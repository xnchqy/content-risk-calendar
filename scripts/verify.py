# -*- coding: utf-8 -*-
import os, glob

base = r'C:\Users\xn\.qclaw\workspace-agent-12b2bbb2\content-risk-calendar\src\content\events'
files = glob.glob(os.path.join(base, '*.md'))
print(f'Total files: {len(files)}')

for f in sorted(files):
    with open(f, 'rb') as fp:
        data = fp.read()
    has_bom = data[:3] == b'\xef\xbb\xbf'
    text = data.decode('utf-8', errors='replace')
    # Extract title
    title_line = [l for l in text.split('\n') if l.startswith('title:')]
    title = title_line[0][6:].strip() if title_line else '???'
    # Check Chinese chars (non-ASCII)
    chinese = sum(1 for c in text if ord(c) > 0x4E00 and ord(c) < 0x9FFF)
    status = 'OK' if chinese > 10 else 'WARN'
    bom_flag = ' [BOM]' if has_bom else ''
    print(f'{status}: {os.path.basename(f)} - {title} ({chinese} CJK, {len(text)} chars){bom_flag}')
