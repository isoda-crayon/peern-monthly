# -*- coding: utf-8 -*-
"""PWA用のアイコンを生成する（にじいろ7色の丸いクレヨンマーク）。"""
from pathlib import Path

from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "assets"

# にじいろ7色（デザインシステムのマステカラー）
COLORS = ["#E8857B", "#F2A65A", "#F5D76E", "#7EC8A0", "#6BAEDB", "#8B7EC8", "#C48BC8"]
PAPER = "#FFFAF4"


def make(size: int, path: Path, pad_ratio: float = 0.16) -> None:
    """クリーム背景に、7色の縦ストライプを丸く切り抜いたマークを描く。"""
    ss = 4  # supersampling
    s = size * ss
    im = Image.new("RGB", (s, s), PAPER)

    pad = int(s * pad_ratio)
    d = s - pad * 2

    # ストライプ
    stripes = Image.new("RGB", (d, d), PAPER)
    sd = ImageDraw.Draw(stripes)
    w = d / len(COLORS)
    for i, c in enumerate(COLORS):
        sd.rectangle([int(i * w), 0, int((i + 1) * w) + 1, d], fill=c)

    # 丸マスク
    mask = Image.new("L", (d, d), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, d - 1, d - 1], fill=255)
    im.paste(stripes, (pad, pad), mask)

    # 白フチとハイライトで、シールっぽい柔らかさを足す
    dr = ImageDraw.Draw(im)
    ring = int(s * 0.018)
    dr.ellipse([pad, pad, pad + d - 1, pad + d - 1], outline="#FFFFFF", width=ring)
    hl = Image.new("L", (d, d), 0)
    ImageDraw.Draw(hl).ellipse(
        [int(d * 0.16), int(d * 0.10), int(d * 0.52), int(d * 0.34)], fill=70
    )
    white = Image.new("RGB", (d, d), "#FFFFFF")
    im.paste(white, (pad, pad), hl)

    im = im.resize((size, size), Image.LANCZOS)
    im.save(path, "PNG", optimize=True)
    print(f"{path.name}: {size}x{size} ({round(path.stat().st_size/1024)} KB)")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    make(192, OUT / "icon-192.png")
    make(512, OUT / "icon-512.png")
    # apple-touch-icon は角丸をOSが付けるので余白少なめ
    make(180, OUT / "apple-touch-icon.png", pad_ratio=0.10)
