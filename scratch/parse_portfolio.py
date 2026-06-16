import re
import os

print("Parsing local temp_portfolio.js...")

try:
    if not os.path.exists('temp_portfolio.js'):
        print("Error: temp_portfolio.js not found.")
        exit(1)
        
    with open('temp_portfolio.js', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print("Read JS size:", len(content))
    
    # Decode unicode escapes of the form \uXXXX
    def decode_match(match):
        try:
            return match.group(0).encode('utf-8').decode('unicode_escape')
        except Exception:
            return match.group(0)
            
    # Replace \uXXXX
    decoded_text = re.sub(r'\\u[0-9a-fA-F]{4}', decode_match, content)
    print("Decoded JS size:", len(decoded_text))
    
    # Save decoded text
    with open('scratch/decoded_portfolio.js', 'w', encoding='utf-8') as f:
        f.write(decoded_text)
        
    print("\n--- SEARCHING FOR PORTFOLIO DETAIL ---")
    
    # We want to find user bio, project descriptions, skills, experience, companies.
    keywords = ['Lộc', 'Nguyễn', 'SEO', 'Content', 'tài chính', 'dự án', 'kinh nghiệm', 'tăng trưởng', 'traffic']
    for kw in keywords:
        matches = [m.start() for m in re.finditer(kw, decoded_text, re.IGNORECASE)]
        print(f"Keyword '{kw}' found {len(matches)} matches")
        
    # Let's extract blocks of text that look like actual Vietnamese prose
    # We look for blocks of characters with spaces and Vietnamese letters
    # e.g., words with diacritics
    vietnamese_blocks = re.findall(r'[A-ZÀ-Ỹa-zà-ỹ\s,\.\-\:\!\?\(\)\d\%]{40,}', decoded_text)
    print("\nFound long Vietnamese/text blocks:")
    
    # Remove duplicates and clean
    unique_blocks = []
    seen = set()
    for block in vietnamese_blocks:
        cleaned = block.strip()
        # Keep if it contains Vietnamese diacritics
        if re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]', cleaned):
            if cleaned not in seen:
                seen.add(cleaned)
                unique_blocks.append(cleaned)
                
    for i, block in enumerate(unique_blocks[:50]):
        print(f"\n[{i+1}] {block}")
        print("-" * 50)
        
except Exception as e:
    print("Error:", e)
