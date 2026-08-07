import re
import os

base = r'c:\Users\HP\Documents\IIT DHANBAD\DET0X_IIT_Dhanbad\site'

nav_links = {
    'Home': 'index.html',
    'Smart Warehouse': 'warehouse.html',
    'Price Intelligence': 'price.html',
    'Traceability': 'traceability.html',
}

for fname in ['index.html', 'warehouse.html', 'price.html', 'traceability.html']:
    fpath = os.path.join(base, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix nav links
    for link_text, link_href in nav_links.items():
        # Replace href="#" that appears near nav link text
        old = 'href="#">' + link_text + '</a>'
        new = 'href="' + link_href + '">' + link_text + '</a>'
        content = content.replace(old, new)
        
        # Also handle with extra attributes between href and text
        old2 = "href=\"#\">" + link_text + "</a>"
        new2 = 'href="' + link_href + '">' + link_text + '</a>'
        content = content.replace(old2, new2)
    
    # Fix "Explore" card links on index.html
    if fname == 'index.html':
        # Link the 3 pillar cards
        content = content.replace(
            'href="#">Explore Smart Warehouse',
            'href="warehouse.html">Explore Smart Warehouse'
        )
        content = content.replace(
            'href="#">Explore Price Intelligence',
            'href="price.html">Explore Price Intelligence'
        )
        content = content.replace(
            'href="#">Explore Traceability',
            'href="traceability.html">Explore Traceability'
        )
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Updated: {fname}')

print('All navigation links fixed!')
