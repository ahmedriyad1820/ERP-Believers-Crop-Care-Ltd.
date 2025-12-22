
import re
import os

file_path = "/Users/mdriyadahmed/Documents/c2 project/final submitted version/BCC ERP/bcc-erp/src/pages/Admin.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for itemized orders
old_item_pattern = r'\{item\.variant\?\.productCode \? `\$\{item\.variant\.productCode\} \(\$\{item\.variant\.packSize\} \$\{item\.variant\.packUnit \|\| \'ml\'\}\)` : \'-\'\}'
new_item_variant = '{item.variant?.productCode ? `${item.variant.productCode} (${item.variant.packSize} ${item.variant.packUnit || \'ml\'}) [${item.variant.cartoonSize || 1} ${item.variant.cartoonUnit || \'Pcs\'}]` : \'-\'}'

# Pattern for single orders
old_single_pattern = r'order\.variant\?\.productCode \? `\$\{order\.variant\.productCode\} \(\$\{order\.variant\.packSize\} \$\{order\.variant\.packUnit \|\| \'ml\'\}\)` : \'-\''
new_single_variant = 'order.variant?.productCode ? `${order.variant.productCode} (${order.variant.packSize} ${order.variant.packUnit || \'ml\'}) [${order.variant.cartoonSize || 1} ${order.variant.cartoonUnit || \'Pcs\'}]` : \'-\''

# We need to be careful with r' in re.sub if the new text has special chars like $ or {}
# Since we are using literal strings for replacement, we should use re.escape or just string.replace if we can.
# But there might be multiple occurrences in different contexts (Main orders vs Dealer orders).
# The dealer orders section is roughly lines 8200-8500.

# Let's count how many we are replacing.
content = content.replace("${item.variant.productCode} (${item.variant.packSize} ${item.variant.packUnit || 'ml'})", 
                         "${item.variant.productCode} (${item.variant.packSize} ${item.variant.packUnit || 'ml'}) [${item.variant.cartoonSize || 1} ${item.variant.cartoonUnit || 'Pcs'}]")

content = content.replace("order.variant?.productCode ? `${order.variant.productCode} (${order.variant.packSize} ${order.variant.packUnit || 'ml'})` : '-'",
                         "order.variant?.productCode ? `${order.variant.productCode} (${order.variant.packSize} ${order.variant.packUnit || 'ml'}) [${order.variant.cartoonSize || 1} ${order.variant.cartoonUnit || 'Pcs'}]` : '-'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated Variant format using Python.")
