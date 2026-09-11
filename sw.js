/* 月刊ぴあん — Service Worker
 *
 * ねらい:
 *  - 号のページ画像（images/YYYY-MM/…）と日誌の写真（images/diary/…）は一度見たら
 *    端末に残す（内容が変わらないファイルなので安全）
 *    → 2回目からは通信なしでパッと出る。オフラインでも過去に見た号は読める
 *  - HTML / CSS / JS / issues.js / diary.js は毎回ネットワーク優先
 *    → 新しい号や日誌の記事を出したらすぐ全員に届く（キャッシュで古いまま、を防ぐ）
 */
var VER = "pian-v2";

/* 圏外で、まだ一度も開いていないページを開いたときに出す紙。
   これが無いと caches.match が undefined を返し、respondWith が失敗して
   「このサイトにアクセスできません」という、原因の分からない画面になる。 */
function offlinePage() {
  return new Response(
    '<!DOCTYPE html><html lang="ja"><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<title>電波が とどいていません｜月刊ぴあん</title>" +
    "<style>body{margin:0;min-height:100dvh;display:grid;place-items:center;" +
    "background:#fffaf4;color:#4a453f;font-family:system-ui,sans-serif;line-height:1.9;padding:24px}" +
    "div{max-width:22em;text-align:center}p{margin:.6em 0}</style>" +
    "<div><p style=\"font-size:2.4em;margin:0\">📵</p>" +
    "<p><b>電波が とどいていません</b></p>" +
    "<p>このページは まだ この端末に 残っていません。<br>" +
    "電波の あるところで 一度ひらくと、つぎからは 圏外でも 読めます。</p>" +
    "</div></html>",
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) { return k.indexOf("pian-") === 0 && k !== VER; })
            .map(function (k) { return caches.delete(k); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // フォントなど外部はそのまま

  // 号の画像（images/2026-08/…）と日誌の写真（images/diary/…）。どちらも差し替えない前提
  var isStaticImage = /\/images\/(\d{4}-\d{2}|diary)\//.test(url.pathname);

  // 書き込みは respondWith と別に延命する。待たないと、返した直後に
  // SW が止められて書き込みが終わらないことがある（＝次のオフラインで出せない）
  function store(req, res) {
    var copy = res.clone();
    e.waitUntil(
      caches.open(VER)
        .then(function (c) { return c.put(req, copy); })
        .catch(function () { /* 容量超過など。キャッシュできなくても表示は続ける */ })
    );
  }

  if (isStaticImage) {
    // キャッシュ優先（不変ファイル）
    e.respondWith(
      caches.open(VER).then(function (c) {
        return c.match(req).then(function (hit) {
          if (hit) return hit;
          return fetch(req).then(function (res) {
            if (res && res.ok) store(req, res);
            return res;
          });
        });
      })
    );
  } else {
    // それ以外: ネットワーク優先、落ちたらキャッシュ（オフライン用）
    e.respondWith(
      fetch(req)
        .then(function (res) {
          if (res && res.ok) store(req, res);
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            if (hit) return hit;
            // キャッシュにも無い。ページなら案内を出し、それ以外は素直に失敗させる
            return req.mode === "navigate" ? offlinePage() : Response.error();
          });
        })
    );
  }
});
