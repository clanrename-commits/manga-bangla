#!/usr/bin/env python3
"""Generate numbered test images for upload sequence testing."""
from PIL import Image, ImageDraw, ImageFont
import os

out_dir = "/home/z/my-project/download/test-pages"
os.makedirs(out_dir, exist_ok=True)

for i in range(1, 6):
    img = Image.new("RGB", (600, 900), color=(
        30 + i * 40,
        50,
        100 - i * 15,
    ))
    draw = ImageDraw.Draw(img)
    # Big number in center
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 300)
    except Exception:
        font = ImageFont.load_default()
    text = str(i)
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text(
        ((600 - w) / 2, (900 - h) / 2 - 50),
        text,
        fill="white",
        font=font,
    )
    # Label
    try:
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except Exception:
        small = ImageFont.load_default()
    draw.text((50, 50), f"PAGE {i}", fill="white", font=small)
    img.save(f"{out_dir}/page-{i}.png")
    print(f"Created page-{i}.png")

print("Done")
