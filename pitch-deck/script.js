/* ============================================
   DET0X PITCH DECK — Navigation & Animations
   ============================================ */

(function () {
  'use strict';

  // --- State ---
  const TOTAL_SLIDES = 12;
  let currentSlide = 0;
  let isTransitioning = false;

  // --- DOM References ---
  const slidesContainer = document.getElementById('slidesContainer');
  const slides = document.querySelectorAll('.slide');
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const navDotsContainer = document.getElementById('navDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // --- Initialize Navigation Dots ---
  function initNavDots() {
    for (let i = 0; i < TOTAL_SLIDES; i++) {
      const dot = document.createElement('button');
      dot.classList.add('nav-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.dataset.slide = i;
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      navDotsContainer.appendChild(dot);
    }
  }

  // --- Update UI State ---
  function updateUI() {
    // Progress bar
    const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
    progressFill.style.width = `${progress}%`;

    // Slide counter
    slideCounter.textContent = `${currentSlide + 1} / ${TOTAL_SLIDES}`;

    // Nav dots
    const dots = navDotsContainer.querySelectorAll('.nav-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Arrow buttons
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === TOTAL_SLIDES - 1;
  }

  // --- Animate Counters ---
  function animateCounters(slideEl) {
    const counters = slideEl.querySelectorAll('[data-count]');
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.count, 10);
      const suffix = counter.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();

      // Format large numbers with commas
      function formatNumber(num) {
        if (num >= 1000) {
          return num.toLocaleString('en-IN');
        }
        return num.toString();
      }

      function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counter.textContent = formatNumber(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    });
  }

  // --- Go To Slide ---
  function goToSlide(index) {
    if (index === currentSlide || isTransitioning) return;
    if (index < 0 || index >= TOTAL_SLIDES) return;

    isTransitioning = true;

    const direction = index > currentSlide ? 1 : -1;
    const currentEl = slides[currentSlide];
    const nextEl = slides[index];

    // Exit current slide
    currentEl.classList.remove('active');
    currentEl.classList.add(direction > 0 ? 'exit-left' : '');

    // Prepare next slide entry direction
    nextEl.style.transform = direction > 0 ? 'translateX(60px)' : 'translateX(-60px)';
    nextEl.style.opacity = '0';

    // Small delay then enter
    requestAnimationFrame(() => {
      nextEl.classList.add('active');
      nextEl.style.transform = '';
      nextEl.style.opacity = '';

      // Animate counters on the new slide
      animateCounters(nextEl);
    });

    // Cleanup after transition
    setTimeout(() => {
      currentEl.classList.remove('exit-left');
      currentEl.style.transform = '';
      isTransitioning = false;
    }, 550);

    currentSlide = index;
    updateUI();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // --- Keyboard Navigation ---
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(TOTAL_SLIDES - 1);
        break;
    }
  });

  // --- Button Navigation ---
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // --- Touch/Swipe Navigation ---
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only act on horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // --- Mouse Wheel Navigation ---
  let wheelTimeout;
  document.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelTimeout) return;

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 800);

    if (e.deltaY > 0 || e.deltaX > 0) {
      nextSlide();
    } else if (e.deltaY < 0 || e.deltaX < 0) {
      prevSlide();
    }
  }, { passive: false });

  // --- Initialize ---
  function init() {
    initNavDots();
    updateUI();

    // Trigger counter animation on first slide if applicable
    animateCounters(slides[0]);

    // Ensure first slide is visible
    slides[0].classList.add('active');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
