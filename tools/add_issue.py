# -*- coding: utf-8 -*-
"""月刊ぴあんのPDFを1号分のWebPページ画像に変換する。

原本PDFは共有ドライブの「⑤ ぴあんチラシ」フォルダに置いてある前提なので、
ふつうは月を指定するだけで済みます。

    # 2026年9月号を、あとりえ・にじいろまとめて変換
    python tools/add_issue.py --ym 2026-09

    # 片方だけ
    python tools/add_issue.py --ym 2026-09 --brand nijiiro

    # 別の場所のPDFを使う（共有ドライブにまだ無いときなど）
    python tools/add_issue.py --ym 2026-09 --brand nijiiro --pdf "C:\\...\\なにか.pdf"

出力:
    images/<ym>/<brand>/p1.webp ... pN.webp と thumb.webp
    変換結果のメタ情報(src/w/h/サイズ)を標準出力にJSONで表示するので、
    それを見ながら issues.js に1件足せばサイトに並びます。

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

# ── 原本PDFの保管場所（共有ドライブ）──────────────────────────
# Googleドライブが G: にマウントされていない環境では --pdf で個別に指定してください。
PDF_ROOT = Path(r"G:\共有ドライブ\あとりえくれよんＺ\②　ぴあん課題\⓪　全体\⑤　ぴあんチラシ")

BRANDS = {
    "atelier": {"name": "あとりえくれよん", "pdf": "あとりえチラシ_{y}年{m:02d}月.pdf"},
    "nijiiro": {"name": "にじいろくれよん", "pdf": "にじいろチラシ_{y}年{m:02d}月.pdf"},
}

# 出力する横幅。A4縦のページで「保護者の方へ」の本文が
# スマホのピンチ拡大で読める下限を確保しつつ、通信量を抑える値。
TARGET_WIDTH = 1600
WEBP_QUALITY = 82
RENDER_DPI = 200

# バックナンバー一覧に出す小さな見本（正方形）
THUMB_SIZE = 240
THUMB_QUALITY = 78


def pdf_for(brand: str, ym: str) -> Path:
    """保管場所から、その月・その事業所のPDFを探す。"""
    y, m = ym.split("-")
    return PDF_ROOT / BRANDS[brand]["pdf"].format(y=int(y), m=int(m))


def render_pdf_to_pngs(pdf: Path, workdir: Path) -> list[Path]:
    """pdftoppm でPDFを1ページずつPNGに書き出す。"""
    prefix = workdir / "pg"
    try:
        subprocess.run(
            ["pdftoppm", "-png", "-r", str(RENDER_DPI), str(pdf), str(prefix)], check=True
        )
    except subprocess.CalledProcessError as e:
        raise SystemExit(
            f"PDFを開けませんでした: {pdf.name}（pdftoppm 終了コード {e.returncode}）\n"
            "（原本が壊れていないか、ほかのアプリで開いたままになっていないか確認してください）"
        ) from None
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
        left = max(0, (im.width - side) // 2)
        im = im.crop((left, 0, left + side, side))
        im = im.resize((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, "WEBP", quality=THUMB_QUALITY, method=6)
        return {"w": THUMB_SIZE, "h": THUMB_SIZE, "kb": round(dst.stat().st_size / 1024)}


def convert(pdf: Path, brand: str, ym: str, out_root: Path, repo: Path, thumb_page: int) -> dict:
    out_dir = out_root / ym / brand
    pages = []
    with tempfile.TemporaryDirectory() as tmp:
        for i, png in enumerate(render_pdf_to_pngs(pdf, Path(tmp)), start=1):
            dst = out_dir / f"p{i}.webp"
            meta = to_webp(png, dst)
            rel = dst.relative_to(repo) if dst.is_relative_to(repo) else dst
            pages.append({
                "src": str(rel).replace("\\", "/"),
                "w": meta["w"], "h": meta["h"],
                "kb": round(dst.stat().st_size / 1024),
            })

    # ページ数が減る作り直し（8→4ページ等）では古い p5..p8 が残り、issues.js から
    # 参照されないまま公開・キャッシュされ続ける。消すかは運用判断なので必ず知らせる。
    stale = []
    for f in sorted(out_dir.glob("p*.webp")):
        mm = re.fullmatch(r"p(\d+)\.webp", f.name)
        if mm and int(mm.group(1)) > len(pages):
            stale.append(f.name)
    if stale:
        print("※ 前回より少ないページ数です。使われないファイルが残っています: "
              + ", ".join(stale)
              + "（issues.js から参照しないなら削除してください）", file=sys.stderr)

    tp = min(max(thumb_page, 1), len(pages))
    thumb_dst = out_dir / "thumb.webp"
    tmeta = make_thumb(out_dir / f"p{tp}.webp", thumb_dst)
    trel = thumb_dst.relative_to(repo) if thumb_dst.is_relative_to(repo) else thumb_dst

    total = sum(p["kb"] for p in pages) + tmeta["kb"]
    print(f"  {ym} {BRANDS[brand]['name']}: {len(pages)}ページ 合計 {total} KB  ← {pdf.name}",
          file=sys.stderr)
    return {
        "ym": ym,
        "brand": brand,
        "brandName": BRANDS[brand]["name"],
        "source": str(pdf),
        "pageCount": len(pages),
        "totalKB": total,
        "thumb": {"src": str(trel).replace("\\", "/"), **tmeta},
        "pages": pages,
    }


def main() -> int:
    # 保管場所のパスに含まれる「⓪」は cp932 に無い文字。出力をファイルやパイプに
    # 流すと、最後のJSON出力だけが UnicodeEncodeError で落ちる（画像は出来ているのに
    # 「失敗した」と見える）。先に UTF-8 に切り替えておく。
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass

    ap = argparse.ArgumentParser(description="月刊ぴあんPDF → WebPページ画像")
    ap.add_argument("--ym", required=True, help="号（例: 2026-09）")
    ap.add_argument("--brand", choices=sorted(BRANDS), default=None,
                    help="事業所。省略すると両方まとめて変換します")
    ap.add_argument("--pdf", default=None,
                    help="変換元PDF。省略すると共有ドライブの保管場所から探します")
    ap.add_argument("--out", default=None, help="出力先ルート（既定: リポジトリのimages/）")
    ap.add_argument("--thumb-page", type=int, default=1,
                    help="バックナンバー一覧の見本にするページ番号（既定: 1＝表紙）")
    args = ap.parse_args()

    # \d は全角数字（２０２６）にも一致してしまう。通すと原本は見つかるのに
    # 出力先だけ images/２０２６-０９/ になり、sw.js のキャッシュ判定からも外れる。
    if not re.fullmatch(r"[0-9]{4}-(0[1-9]|1[0-2])", args.ym):
        raise SystemExit("--ym は 2026-09 の形式（半角、月は 01〜12）で指定してください")
    if not shutil.which("pdftoppm"):
        raise SystemExit("pdftoppm が見つかりません。poppler をインストールしてください。")

    repo = Path(__file__).resolve().parent.parent
    out_root = Path(args.out).expanduser().resolve() if args.out else repo / "images"
    if not out_root.is_relative_to(repo):
        print(f"※ 出力先がリポジトリの外です（{out_root}）。表示される src は絶対パスに\n"
              "  なるので、そのままでは issues.js に貼れません。", file=sys.stderr)
    brands = [args.brand] if args.brand else list(BRANDS)

    if args.pdf and not args.brand:
        raise SystemExit("--pdf を使うときは --brand も指定してください")

    # 先に全部の在りかを確かめる。ファイルが無い場合の空振りは防げるが、
    # 変換の途中で失敗すれば片方だけ出来上がる（そのときは同じ月をもう一度回す）
    targets = []
    for b in brands:
        p = Path(args.pdf).expanduser() if args.pdf else pdf_for(b, args.ym)
        if not p.exists():
            raise SystemExit(
                f"PDFが見つかりません: {p}\n"
                f"（保管場所に置いてあるか、ファイル名が「{BRANDS[b]['pdf'].format(y=int(args.ym[:4]), m=int(args.ym[5:]))}」の形か確認してください）"
            )
        targets.append((b, p))

    print(f"変換します（{args.ym}）", file=sys.stderr)
    results = [convert(p, b, args.ym, out_root, repo, args.thumb_page) for b, p in targets]

    print(json.dumps(results if len(results) > 1 else results[0],
                     ensure_ascii=False, indent=2))
    print("\n→ この src / w / h を issues.js の先頭に足してください。", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
