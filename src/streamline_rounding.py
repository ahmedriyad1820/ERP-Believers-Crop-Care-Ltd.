
import re
import os

file_path = "/Users/mdriyadahmed/Documents/c2 project/final submitted version/BCC ERP/bcc-erp/src/pages/Admin.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace maximumFractionDigits: 2 with maximumFractionDigits: 0
# Also remove minimumFractionDigits: 2 if present
content = re.sub(r'minimumFractionDigits: 2,\s*', '', content)
content = content.replace('maximumFractionDigits: 2', 'maximumFractionDigits: 0')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated Admin.jsx rounding.")
