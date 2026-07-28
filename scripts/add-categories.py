#!/usr/bin/env python3
"""Add categories: [] to each manga entry in manga-data.ts."""
import re
from pathlib import Path

path = Path("/home/z/my-project/src/lib/manga-data.ts")
src = path.read_text(encoding="utf-8")

# After every `    genres: [...],\n` line that has actual genres, add categories
pattern = re.compile(r'(\n    genres: \[[^\]]*\],)(\n    tags:)')
def repl(m):
    return m.group(1) + "\n    categories: [\"Manga\"]," + m.group(2)

new_src, n = pattern.subn(repl, src)
print(f"Replaced {n} occurrences")
path.write_text(new_src, encoding="utf-8")
