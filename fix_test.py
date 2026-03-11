import re

with open('src/components/editor/EditorWorkspace.tsx', 'r') as f:
    content = f.read()

if "console.log('SYNC STORE CALLED', image.filters);" in content:
    content = content.replace("console.log('SYNC STORE CALLED', image.filters);", "")
    content = content.replace("console.log('SYNC STORE SETTING:', currentAdjustments);", "")
    with open('src/components/editor/EditorWorkspace.tsx', 'w') as f:
        f.write(content)
