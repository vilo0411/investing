import urllib.request
import re
import os
import ssl

# Disable SSL verification for these downloads to avoid macOS environment issues
ssl_context = ssl._create_unverified_context()

chunks = [
    'Home-B69VTrDV.js',
    'About-RWZQ0gRD.js',
    'Contact-C0W9KXiw.js',
    'Footer-CNFlnVl5.js'
]

base_url = 'https://vilo0411.github.io/portfolio-loc-nguyen/assets/'

for chunk in chunks:
    url = base_url + chunk
    print(f"\nDownloading chunk: {chunk} from {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ssl_context) as response:
            content = response.read().decode('utf-8', errors='ignore')
            
        print("Size:", len(content))
        
        # Decode unicode escapes of the form \uXXXX
        def decode_match(match):
            try:
                return match.group(0).encode('utf-8').decode('unicode_escape')
            except Exception:
                return match.group(0)
                
        decoded_text = re.sub(r'\\u[0-9a-fA-F]{4}', decode_match, content)
        
        # Write to scratch/decoded_chunk.js
        with open(f'scratch/decoded_{chunk}', 'w', encoding='utf-8') as f:
            f.write(decoded_text)
            
        # Search for text
        print(f"--- Decoded {chunk} strings ---")
        # Split by punctuation or JSX tags to find readable Vietnamese content
        # We search for any string of Vietnamese words
        vietnamese_blocks = re.findall(r'[A-ZÀ-Ỹa-zà-ỹ\s,\.\-\:\!\?\(\)\d\%]{30,}', decoded_text)
        
        unique_blocks = []
        seen = set()
        for block in vietnamese_blocks:
            cleaned = block.strip()
            # Must contain Vietnamese diacritics
            if re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]', cleaned):
                if cleaned not in seen:
                    seen.add(cleaned)
                    unique_blocks.append(cleaned)
                    
        for i, block in enumerate(unique_blocks):
            print(f"[{i+1}] {block}")
            print("-" * 30)
            
    except Exception as e:
        print("Error downloading or parsing:", e)
