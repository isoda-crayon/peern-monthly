/* 月刊ぴあん — Service Worker
 *
 * ねらい:
 *  - 号のページ画像（images/YYYY-MM/…）と日誌の写真（images/diary/…）は一度見たら
 *    端末に残す（内容が変わらないファイルなので安全）
 *    → 2回目からは通信なしでパッと出る。オフラインでも過去に見た号は読める
 *  - HTML / CSS / JS / issues.js / diary.js は毎回ネットワーク優先
 *    → 新しい号や日誌の記事を出したらすぐ全員に届く（キャッシュで古いまま、を防ぐ）
 */
var VER = "pian-v1";

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

  if (isStaticImage) {
    // キャッシュ優先（不変ファイル）
    e.respondWith(
      caches.open(VER).then(function (c) {
        return c.match(req).then(function (hit) {
          if (hit) return hit;
          return fetch(req).then(function (res) {
            if (res && res.ok) c.put(req, res.clone());
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
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(VER).then(function (c) { c.put(req, copy); });
          }
          return res;
        })
        .catch(function () { return caches.match(req); })
    );
  }
});
