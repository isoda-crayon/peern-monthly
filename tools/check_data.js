/* 月刊ぴあん — データと画面の整合チェック
 *
 *   node tools/check_data.js
 *
 * 号を足したあと、push する前に一度走らせてください。目で気づけないずれ
 * （画像の欠落、宣言した寸法と実物の食い違い、ラベルの表記ゆれ、
 * 画面の並びとよむ画面の並びの不一致）を機械的に拾います。
 * 追加のインストールは要りません（Node だけで動きます）。
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.resolve(__dirname, "..");
const SEC_ORDER = ["schedule", "subject", "meditation", "main", "other"];
const VALID_SEC = ["cover"].concat(SEC_ORDER);

let ng = 0, warn = 0, ok = 0;
const bad = (m) => { ng++; console.log("  [NG]   " + m); };
const note = (m) => { warn++; console.log("  [注意] " + m); };
const pass = () => { ok++; };

/* ── データを読む ───────────────────────────── */
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(REPO, "issues.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(REPO, "diary.js"), "utf8"), ctx);
const PIAN = ctx.window.PIAN;
const D = ctx.window.PIAN_DIARY;

/* ── WebP の実寸をヘッダから読む ─────────────── */
function webpSize(fp) {
  const b = fs.readFileSync(fp);
  if (b.slice(0, 4).toString("ascii") !== "RIFF" || b.slice(8, 12).toString("ascii") !== "WEBP") return null;
  const cc = b.slice(12, 16).toString("ascii");
  if (cc === "VP8 ") {
    const s = b.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
    return s < 0 ? null : { w: b.readUInt16LE(s + 3) & 0x3fff, h: b.readUInt16LE(s + 5) & 0x3fff };
  }
  if (cc === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (cc === "VP8X") {
    const p = 24;
    return { w: (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16)) + 1,
             h: (b[p + 3] | (b[p + 4] << 8) | (b[p + 5] << 16)) + 1 };
  }
  return null;
}

console.log("■ 号のデータ（issues.js）");

let pages = 0;
PIAN.issues.forEach((i) => {
  const m = /^(\d{4})-(\d{2})$/.exec(i.id);
  if (!m) return bad("id の形式: " + i.id);
  if (+m[1] !== i.year || +m[2] !== i.month) bad(i.id + ": year/month が id と合っていません");
  if (i.label !== i.year + "年" + i.month + "月号") bad(i.id + ": label が " + i.label);
  if (i.short !== i.month + "月号") bad(i.id + ": short が " + i.short);
  pass();
});

const seenId = {};
PIAN.issues.forEach((i) => { if (seenId[i.id]) bad("id の重複: " + i.id); seenId[i.id] = 1; });
for (let k = 1; k < PIAN.issues.length; k++) {
  if (PIAN.issues[k - 1].id <= PIAN.issues[k].id) {
    bad("issues が新しい順に並んでいません: " + PIAN.issues[k - 1].id + " → " + PIAN.issues[k].id);
  }
}
/* バックナンバーの年見出しは「同じ年が固まっている」前提で数えている */
let prevYear = null; const yearSeen = {};
PIAN.issues.forEach((i) => {
  if (i.year !== prevYear) {
    if (yearSeen[i.year]) bad("年が飛び飛びです（バックナンバーの年見出しが二重に出ます）: " + i.year);
    yearSeen[i.year] = 1; prevYear = i.year;
  }
});

const used = new Set();
PIAN.issues.forEach((i) =>
  Object.keys(i.brands || {}).forEach((b) => {
    if (!PIAN.brands[b]) bad(i.id + ": 知らない事業所キー " + b);
    const c = i.brands[b];
    const where = i.id + " " + b;
    const wantDir = "images/" + i.id + "/" + b + "/";

    const check = (o, label) => {
      used.add(o.src);
      if (!o.src.startsWith(wantDir)) bad(where + ": " + label + " のパスが " + o.src);
      const fp = path.join(REPO, o.src);
      if (!fs.existsSync(fp)) return bad(where + ": 画像がありません " + o.src);
      const s = webpSize(fp);
      if (s && (s.w !== o.w || s.h !== o.h)) {
        bad(where + ": 寸法ずれ " + o.src + " 宣言 " + o.w + "x" + o.h + " / 実物 " + s.w + "x" + s.h);
      } else pass();
    };

    if (c.thumb) check(c.thumb, "thumb"); else note(where + ": thumb がありません");
    c.pages.forEach((p, k) => {
      pages++;
      check(p, "p" + (k + 1));
      const fm = /\/p(\d+)\.webp$/.exec(p.src);
      if (!fm) bad(where + ": ファイル名の形式 " + p.src);
      else if (+fm[1] !== k + 1) bad(where + ": ページ番号と並び順のずれ " + p.src + "（配列 " + (k + 1) + "番目）");
      if (VALID_SEC.indexOf(p.sec) < 0) bad(where + ": 知らない sec " + p.sec + "（" + p.src + "）");
      if (!p.title || !String(p.title).trim()) bad(where + ": title が空 " + p.src);
      if (p.sub === undefined) note(where + ": sub がありません " + p.src);
      if (p.crop !== undefined && !(typeof p.crop === "number" && p.crop > 0 && p.crop < 1)) {
        bad(where + ": crop は 0 と 1 のあいだで指定してください " + p.src);
      }
    });

    const set = new Set(c.pages.map((p) => p.sec));
    if (!set.has("cover")) note(where + ": 表紙（sec:\"cover\"）がありません");
    if (c.pages.filter((p) => p.sec === "cover").length > 1) bad(where + ": 表紙が複数あります");
    if (set.has("other") && (set.has("main") || set.has("subject") || set.has("meditation"))) {
      note(where + ": 旧形式(other)と新形式が混ざっています");
    }
    /* 同じ種類のページが離れて置かれていると、画面のセクションが飛び飛びになる */
    const run = [];
    c.pages.forEach((p) => { if (p.sec !== "cover" && run[run.length - 1] !== p.sec) run.push(p.sec); });
    if (new Set(run).size !== run.length) bad(where + ": 同じ種類のページが分かれています → " + run.join(" > "));

    /* 画面の並び（assets/pian.js の orderedPages と同じ規則）で過不足が出ないこと */
    let ord = c.pages.filter((p) => p.sec === "cover");
    SEC_ORDER.forEach((s) => { ord = ord.concat(c.pages.filter((p) => p.sec === s)); });
    c.pages.forEach((p) => { if (ord.indexOf(p) < 0) ord.push(p); });
    if (ord.length !== c.pages.length || new Set(ord).size !== ord.length) {
      bad(where + ": 画面の並びに直すとページが増減します");
    } else pass();

    /* 同じ号のなかで課題名がまるごと重複＝原本の取り違えの疑い */
    const titles = c.pages.map((p) => p.title);
    const dup = [...new Set(titles.filter((t, k) => titles.indexOf(t) !== k))];
    if (dup.length) note(where + ": 同じ課題名が2回出ています → " + dup.join(" , "));
  })
);

/* sub はサイト側の語彙。原本の文言ではないので揃っていること */
const SUB_OK = /^(表紙|きょうかかだい|めいそうかだい|メインかだい|1か月のよてい|おしらせ|\d{4}年\d{1,2}月号)/;
PIAN.issues.forEach((i) =>
  Object.keys(i.brands || {}).forEach((b) =>
    i.brands[b].pages.forEach((p) => {
      if (p.sub && !SUB_OK.test(p.sub)) note(i.id + " " + b + ": sub の書き方が他と違います " + JSON.stringify(p.sub));
      if (p.sub && /課題|瞑想/.test(p.sub)) bad(i.id + " " + b + ": sub は ひらがな表記に揃えてください " + JSON.stringify(p.sub));
    })
  )
);

/* 参照されていない画像 */
function walk(d, acc) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) walk(fp, acc);
    else acc.push(path.relative(REPO, fp).replace(/\\/g, "/"));
  }
  return acc;
}
const orphans = walk(path.join(REPO, "images"), []).filter(
  (f) => !used.has(f) && /^images\/\d{4}-\d{2}\//.test(f)
);
orphans.forEach((f) => note("issues.js から参照されていない号の画像: " + f));
console.log("  " + PIAN.issues.length + "冊 / " + pages + "ページ / 画像 " + used.size + "枚 を確認");

/* ── 日誌 ─────────────────────────────────── */
console.log("■ 開発日誌（diary.js）");
const KINDS = ["lead", "h", "p", "ul", "beforeAfter", "steps", "figure", "table", "callout", "timeline", "message", "details"];
const TONES = ["info", "warn", "tip", "story", "miss"];
const CATS = ["しくみ", "つかいかた", "軌跡"];
const slugs = {};
function walkBlocks(bs, slug) {
  (bs || []).forEach((b) => {
    if (KINDS.indexOf(b.kind) < 0) bad(slug + ": 知らない block kind " + b.kind + "（そのブロックは黙って消えます）");
    if (b.kind === "callout" && b.tone && TONES.indexOf(b.tone) < 0) bad(slug + ": 知らない callout tone " + b.tone + "（無色になります）");
    if (b.kind === "table") {
      const n = (b.head || []).length;
      (b.rows || []).forEach((r, k) => { if (r.length !== n) bad(slug + ": table の列数が合いません（" + (k + 1) + "行目）"); });
    }
    if (b.kind === "details") walkBlocks(b.blocks, slug);
    if (b.kind === "figure" && b.src && !fs.existsSync(path.join(REPO, b.src))) bad(slug + ": 図版の画像がありません " + b.src);
  });
}
D.posts.forEach((p) => {
  if (slugs[p.slug]) bad("slug の重複: " + p.slug);
  slugs[p.slug] = 1;
  if (!D.screens[p.screen]) bad(p.slug + ": screens に無い screen 「" + p.screen + "」");
  if (D.screenOrder.indexOf(p.screen) < 0) bad(p.slug + ": screenOrder に無い screen 「" + p.screen + "」（索引から絞り込めません）");
  if (CATS.indexOf(p.category) < 0) bad(p.slug + ": 知らない category 「" + p.category + "」（マステが無色になります）");
  if (!/^\d{4}-\d{2}-\d{2}/.test(p.date)) bad(p.slug + ": date の形式 " + p.date);
  if (p.supersededBy && !D.posts.some((q) => q.slug === p.supersededBy)) bad(p.slug + ": supersededBy の宛先がありません " + p.supersededBy);
  if (p.now && !Array.isArray(p.now.steps)) bad(p.slug + ": now に steps がありません（日誌が真っ白になります）");
  walkBlocks(p.blocks, p.slug);
  pass();
});
D.screenOrder.forEach((s) => { if (!D.screens[s]) bad("screenOrder にあるが screens に無い: " + s); });
Object.keys(D.screens).forEach((s) => { if (D.screenOrder.indexOf(s) < 0) bad("screens にあるが screenOrder に無い: " + s); });
for (let k = 1; k < D.posts.length; k++) {
  if (D.posts[k - 1].date < D.posts[k].date) bad("posts が新しい順ではありません: " + D.posts[k - 1].date + " → " + D.posts[k].date);
}
const newest = D.posts.map((p) => p.date).sort().pop();
if (D.latest < newest) bad("latest が最新の記事より古いです（入口の赤い印が点きません）: " + D.latest + " < " + newest);
console.log("  記事 " + D.posts.length + "本 / 最終更新 " + D.latest + " を確認");

/* ── 画面のつくり ─────────────────────────── */
/* 縦スクロール面（SEC_ORDER の並び）と、よむ画面のページ送り・「◯/◯」は、
   同じ1本（orderedPages）から番号をもらっていないと食い違う。
   2026年4月号〜2026年9月号で実際に起きていた見落としなので、構造ごと見張る。 */
console.log("■ 画面のつくり（assets/pian.js）");
const js = fs.readFileSync(path.join(REPO, "assets/pian.js"), "utf8");
if (!/function orderedPages\(/.test(js)) {
  bad("orderedPages がありません（縦スクロール面とよむ画面の並びが分かれます）");
} else {
  const calls = (js.match(/orderedPages\(issue\)/g) || []).length;
  if (calls < 2) bad("orderedPages が " + calls + "か所でしか使われていません（縦スクロール面とよむ画面の両方から使ってください）");
  else pass();
}
if (/V\.list\s*=\s*c\.pages/.test(js)) bad("よむ画面が原本のページ順をそのまま使っています（画面の並びと食い違います）");
if (/flat\.indexOf/.test(js)) bad("ページ番号が原本のページ順から作られています（画面の並びと食い違います）");
console.log("  縦スクロール面・よむ画面・印刷が同じ並びを使っているか を確認");

/* ── まとめ ───────────────────────────────── */
console.log("");
if (ng) {
  console.log("✗ " + ng + "件 直してください" + (warn ? "（ほかに注意 " + warn + "件）" : ""));
  process.exit(1);
}
console.log("✓ 問題なし" + (warn ? "（注意 " + warn + "件。原本どおりならそのままで大丈夫です）" : ""));
