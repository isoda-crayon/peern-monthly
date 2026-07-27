# -*- coding: utf-8 -*-
"""月刊ぴあんのPDFを1号分のWebPページ画像に変換する。

使い方:
    python tools/add_issue.py --pdf "月刊ぴあんメーカー　にじいろ.pdf" --brand nijiiro --ym 2026-08

出力:
    images/<ym>/<brand>/p1.webp ... pN.webp
    変換結果のメタ情報(幅・高さ・サイズ)を標準出力にJSONで表示する。
    そのJSONを見ながら issues.js に1件追記すれば、その号がサイトに並ぶ。

必要なもの:
    - poppler の pdftoppm (PATH上)
    - Pillow
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

# 出力する長辺基準の横幅。A4縦のページで「保護者の方へ」の本文が
# スマホのピンチ拡大で読める下限を確保しつつ、通信量を抑える値。
TARGET_WIDTH = 1600
WEBP_QUALITY = 82
RENDER_DPI = 200

# バックナンバー一覧に出す小さな見本（正方形）
THUMB_SIZE = 240
THUMB_QUALITY = 78

BRANDS = {"atelier": "あとりえくれよん", "nijiiro": "にじいろくれよん"}


def render_pdf_to_pngs(pdf: Path, workdir: Path) -> list[Path]:
    """pdftoppm でPDFを1ページずつPNGに書き出す。"""
    prefix = workdir / "pg"
    cmd = ["pdftoppm", "-png", "-r", str(RENDER_DPI), str(pdf), str(prefix)]
    subprocess.run(cmd, check=True)
    # pdftoppm はページ数の桁数に合わせてゼロ埋めするので、名前を仮定せず
    # 実際に出来たファイルを数値順に並べ直す。
    pngs = sorted(
        workdir.glob("pg-*.png"),
        key=lambda p: int(re.search(r"-(\d+)\.png$", p.name).group(1)),
    )
    if not pngs:
        raise SystemExit(f"PDFからページを取り出せませんでした: {pdf}")
    return pngs


def to_webp(src: Path, dst: Path) -> dict:
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > TARGET_WIDTH:
            h = round(im.height * TARGET_WIDTH / im.width)
            im = im.resize((TARGET_WIDTH, h), Image.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
        return {"w": im.width, "h": im.height}


def make_thumb(src: Path, dst: Path) -> dict:
    """ページの上側を正方形に切り出して、一覧用の小さな画像を作る。
    上を残すのは、表紙もスケジュールも見出しが上にあって見分けやすいため。"""
    with Image.open(src) as im:
        im = im.convert("RGB")
        side = min(im.width, im.height)
        im = im.crop((max(0, (im.width - side) // 2), 0, max(0, (im.width - side) // 2) + side, side))
        im = im.resize((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        im.save(dst, "WEBP", quality=THUMB_QUALITY, method=6)
        return {"w": THUMB_SIZE, "h": THUMB_SIZE, "kb": round(dst.stat().st_size / 1024)}


def main() -> int:
    ap = argparse.ArgumentParser(description="月刊ぴあんPDF → WebPページ画像")
    ap.add_argument("--pdf", required=True, help="変換元PDF")
    ap.add_argument("--brand", required=True, choices=sorted(BRANDS), help="事業所")
    ap.add_argument("--ym", required=True, help="号（例: 2026-08）")
    ap.add_argument("--out", default=None, help="出力先ルート（既定: リポジトリのimages/）")
    ap.add_argument("--thumb-page", type=int, default=1,
                    help="バックナンバー一覧の見本にするページ番号（既定: 1＝表紙）")
    args = ap.parse_args()

    if not re.fullmatch(r"\d{4}-\d{2}", args.ym):
        raise SystemExit("--ym は 2026-08 の形式で指定してください")

    pdf = Path(args.pdf).expanduser()
    if not pdf.exists():
        raise SystemExit(f"PDFが見つかりません: {pdf}")

    repo = Path(__file__).resolve().parent.parent
    out_root = Path(args.out) if args.out else repo / "images"
    out_dir = out_root / args.ym / args.brand

    if not shutil.which("pdftoppm"):
        raise SystemExit("pdftoppm が見つかりません。poppler をインストールしてください。")

    pages = []
    with tempfile.TemporaryDirectory() as tmp:
        pngs = render_pdf_to_pngs(pdf, Path(tmp))
        for i, png in enumerate(pngs, start=1):
            dst = out_dir / f"p{i}.webp"
            meta = to_webp(png, dst)
            rel = dst.relative_to(repo) if dst.is_relative_to(repo) else dst
            pages.append(
                {
                    "src": str(rel).replace("\\", "/"),
                    "w": meta["w"],
                    "h": meta["h"],
                    "kb": round(dst.stat().st_size / 1024),
                }
            )

    # 一覧用の見本画像
    tp = min(max(args.thumb_page, 1), len(pages))
    thumb_dst = out_dir / "thumb.webp"
    thumb_meta = make_thumb(out_dir / f"p{tp}.webp", thumb_dst)
    thumb_rel = thumb_dst.relative_to(repo) if thumb_dst.is_relative_to(repo) else thumb_dst
    thumb = {"src": str(thumb_rel).replace("\\", "/"), **thumb_meta}

    total_kb = sum(p["kb"] for p in pages) + thumb["kb"]
    print(
        json.dumps(
            {
                "ym": args.ym,
                "brand": args.brand,
                "brandName": BRANDS[args.brand],
                "pageCount": len(pages),
                "totalKB": total_kb,
                "thumb": thumb,
                "pages": pages,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    print(f"\n→ {out_dir} に {len(pages)} ページ（合計 {total_kb} KB）", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
