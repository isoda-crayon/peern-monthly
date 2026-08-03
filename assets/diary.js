/* 月刊ぴあん — 開発日誌の描画
 *
 * 記事のデータは diary.js（window.PIAN_DIARY）。このファイルは描くだけなので、
 * 記事を1本足すときに触る必要はありません。
 *
 * もとは あとりえ送迎システム の /dev-diary（React）。あちらの
 * src/components/dev-diary/blocks.tsx と page.tsx を、素のJavaScriptに移したものです。
 * クラス名（.dd-）とスタイル（assets/diary.css）は移植元と同じなので、
 * 見た目を直したくなったら「移植元も同じように直すか」を先に考えてください。
 */
(function () {
  "use strict";

  var D = window.PIAN_DIARY;
  if (!D || !D.posts || !D.posts.length) return;

  var root = document.getElementById("diaryRoot");
  if (!root) return;

  /* 一度でも開いたら、入口の赤い印を消すための目印を残す */
  var SEEN_KEY = "pianDiaryLastSeen";

  /* 画面写真の実寸。crop（1枚の写真から何枚もの図版を起こす仕組み）の縦横比が
     ここで決まるので、写真は全部この寸法で撮ってください。
     ⚠ いまはまだ1枚も入っていません。最初の1枚を足す人へ:
        保護者の方が見ているのはスマホの画面なので、**スマホの実機で撮る**こと
        （下の 390×844 は iPhone のスクリーンショットの目安です）。
        パソコンの画面を縮めても、下のボタンの並びが実機と変わってしまい、
        手引きとしては かえって分かりにくくなります。
        違う寸法で撮るときは、この2つも一緒に直してください。 */
  var CAPTURE_W = 390;
  var CAPTURE_H = 844;

  /* ══════════ 小道具 ══════════ */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* **ここを強調** だけ効く軽い記法。HTMLは書けません（移植元と同じく、わざとです） */
  function rich(text) {
    return esc(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  /* 1〜20 を丸数字に。手順と写真の対応づけに使います */
  function circled(n) {
    return n >= 1 && n <= 20 ? String.fromCharCode(0x2460 + n - 1) : "(" + n + ")";
  }

  /* "2026-07-28" → "2026年7月28日" */
  function formatDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    return m ? m[1] + "年" + parseInt(m[2], 10) + "月" + parseInt(m[3], 10) + "日" : d;
  }

  /* "2026-07-28" → "7/28" */
  function formatShort(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    return m ? parseInt(m[2], 10) + "/" + parseInt(m[3], 10) : d;
  }

  function styleAttr(s) { return s ? ' style="' + esc(s) + '"' : ""; }

  /* ══════════ 図版 ══════════ */

  /* crop があるとき、枠の縦横比を切り出し矩形に合わせ、画像を拡大してずらす。
     画像編集をせずに1枚のキャプチャから何枚もの図版を起こすための仕組み。 */
  function cropStyles(c) {
    return {
      frame: "aspect-ratio:" + (c.w * CAPTURE_W) + " / " + (c.h * CAPTURE_H) + ";",
      img: "position:absolute;width:" + (100 / c.w) + "%;max-width:none;height:auto;" +
           "left:" + ((-c.x * 100) / c.w) + "%;top:" + ((-c.y * 100) / c.h) + "%;"
    };
  }

  function focusHtml(f) {
    var pos = "left:" + f.x + "%;top:" + f.y + "%;width:" + f.w + "%;height:" + f.h + "%;";
    var inner = "";
    if (f.pin !== undefined) inner += '<span class="dd-focus-pin">' + circled(f.pin) + "</span>";
    if (f.label) {
      inner += '<span class="dd-focus-label" data-side="' + esc(f.side || "bottom") + '">' +
               esc(f.label) + "</span>";
    }
    return '<span class="dd-focus" data-tone="' + esc(f.tone || "primary") + '"' +
           styleAttr(pos) + ' aria-hidden="true">' + inner + "</span>";
  }

  function figureHtml(o) {
    var s = o.crop ? cropStyles(o.crop) : null;
    var focuses = (o.focus || []).map(focusHtml).join("");
    var cls = "dd-figure" + (o.wide ? " dd-figure--wide" : "");
    var outer = o.maxWidth ? "max-width:" + o.maxWidth + "px;margin-inline:auto;" : "";
    return '<figure class="' + cls + '"' + styleAttr(outer) + ">" +
             '<span class="dd-figure-mat">' +
               '<span class="dd-figure-frame"' + styleAttr(s && s.frame) + ">" +
                 '<img src="' + esc(o.src) + '" alt="' + esc(o.alt) + '" loading="lazy"' +
                   styleAttr(s && s.img) + ">" +
                 focuses +
               "</span>" +
             "</span>" +
             (o.caption ? '<figcaption class="dd-figcaption">' + esc(o.caption) + "</figcaption>" : "") +
           "</figure>";
  }

  /* ══════════ 本文ブロック ══════════ */

  function blockHtml(b) {
    switch (b.kind) {
      case "lead":
        return '<p class="dd-lead-block">' + rich(b.text) + "</p>";

      case "h":
        return '<h3 class="dd-h"' + (b.id ? ' id="' + esc(b.id) + '"' : "") +
               ' data-tone="' + esc(b.tone || "note") + '">' +
               (b.date ? '<span class="dd-h-date">' + esc(b.date) + "</span>" : "") +
               esc(b.text) + "</h3>";

      case "p":
        return "<p>" + rich(b.text) + "</p>";

      case "ul":
        return '<ul class="dd-ul">' +
               b.items.map(function (t) { return "<li>" + rich(t) + "</li>"; }).join("") +
               "</ul>";

      case "beforeAfter":
        return '<div class="dd-ba-wrap"><div class="dd-ba">' +
                 '<div class="dd-ba-card">' +
                   '<p class="dd-ba-title">' + esc(b.before.title) + "</p>" +
                   '<ul class="dd-ba-list">' +
                     b.before.items.map(function (t) { return "<li>" + rich(t) + "</li>"; }).join("") +
                   "</ul>" +
                 "</div>" +
                 '<div class="dd-ba-arrow" aria-hidden="true">→</div>' +
                 '<div class="dd-ba-card is-after">' +
                   '<p class="dd-ba-title">' + esc(b.after.title) + "</p>" +
                   '<ul class="dd-ba-list">' +
                     b.after.items.map(function (t) { return "<li>" + rich(t) + "</li>"; }).join("") +
                   "</ul>" +
                 "</div>" +
               "</div>" +
               (b.verdict ? '<p class="dd-ba-verdict"><span>変わったこと</span>' + esc(b.verdict) + "</p>" : "") +
               "</div>";

      case "steps":
        return '<ol class="dd-steps">' + b.items.map(function (s) {
          return "<li>" +
                   '<p class="dd-step-action">' + rich(s.action) +
                     (s.pin !== undefined ? '<span class="dd-step-pin">写真の' + circled(s.pin) + "</span>" : "") +
                   "</p>" +
                   (s.sees ? '<p class="dd-step-sees">' + rich(s.sees) + "</p>" : "") +
                 "</li>";
        }).join("") + "</ol>";

      case "figure":
        return figureHtml(b);

      case "table":
        return "<div>" +
                 '<div class="dd-table-wrap">' +
                   '<table class="dd-table' + (b.dense ? " is-dense" : "") + '">' +
                     "<thead><tr>" +
                       b.head.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") +
                     "</tr></thead><tbody>" +
                       b.rows.map(function (r) {
                         return "<tr>" + r.map(function (c) { return "<td>" + rich(c) + "</td>"; }).join("") + "</tr>";
                       }).join("") +
                     "</tbody>" +
                   "</table>" +
                 "</div>" +
                 (b.note ? '<p class="dd-table-note">' + esc(b.note) + "</p>" : "") +
               "</div>";

      case "callout":
        return '<div class="dd-callout" data-tone="' + esc(b.tone) + '">' +
                 '<p class="dd-callout-title">' + esc(b.title) + "</p>" +
                 "<p>" + rich(b.text) + "</p>" +
               "</div>";

      case "timeline":
        return '<ol class="dd-timeline">' + b.items.map(function (t) {
          return "<li>" +
                   '<span class="dd-tl-date">' + esc(t.date) + "</span>" +
                   "<div>" +
                     '<p class="dd-tl-title">' + esc(t.title) + "</p>" +
                     '<p class="dd-tl-text">' + rich(t.text) + "</p>" +
                   "</div>" +
                 "</li>";
        }).join("") + "</ol>";

      case "message":
        return '<div class="dd-message">' +
                 '<p class="dd-message-text">' + esc(b.text) + "」</p>" +
                 '<p class="dd-message-todo">' + rich(b.whatToDo) + "</p>" +
               "</div>";

      case "details":
        return '<details class="dd-details">' +
                 "<summary>" + esc(b.summary) + "</summary>" +
                 '<div class="dd-details-body">' + b.blocks.map(blockHtml).join("") + "</div>" +
               "</details>";
    }
    return "";
  }

  /* ══════════ ページの各部 ══════════ */

  /* 「いまの使い方」。記事に now を書くとここに集まります。
     手順が変わった記事に supersededBy を書くと灰色に畳まれ、
     「いまは変わりました」に化けるので、古い記事を書き直さずに済みます。 */
  function nowSummaryHtml() {
    var withNow = D.posts.filter(function (p) { return p.now; });
    if (!withNow.length) return "";
    return '<section class="dd-now" aria-label="いまの使い方">' +
             '<h2 class="dd-now-h">📌 いまの つかいかた（これだけ 読めば だいじょうぶ）</h2>' +
             '<div class="dd-now-grid">' +
               withNow.map(function (p) {
                 var past = Boolean(p.supersededBy);
                 var next = past ? find(p.supersededBy) : null;
                 return '<div class="dd-now-card' + (past ? " is-past" : "") + '">' +
                          '<p class="dd-now-title">' +
                            (past ? "🕰 このときの つかいかた（いまは 変わりました）" : esc(p.now.title)) +
                          "</p>" +
                          '<ol class="dd-now-steps">' +
                            p.now.steps.map(function (s) { return "<li>" + rich(s) + "</li>"; }).join("") +
                          "</ol>" +
                          (p.now.was && !past ? '<p class="dd-now-was">まえ： ' + esc(p.now.was) + "</p>" : "") +
                          (past && next ? '<a class="dd-now-link" href="#post-' + esc(next.slug) + '">→ いまの やり方を 見る</a>' : "") +
                        "</div>";
               }).join("") +
             "</div>" +
           "</section>";
  }

  function find(slug) {
    for (var i = 0; i < D.posts.length; i++) if (D.posts[i].slug === slug) return D.posts[i];
    return null;
  }

  function countByScreen() {
    var m = {};
    D.posts.forEach(function (p) { m[p.screen] = (m[p.screen] || 0) + 1; });
    return m;
  }

  function indexHtml(active) {
    var counts = countByScreen();
    var tiles = D.screenOrder.filter(function (s) { return counts[s]; }).map(function (s) {
      var st = D.screens[s];
      var on = active === s;
      return '<button type="button" class="dd-index-tile' + (on ? " is-on" : "") + '"' +
               ' style="--dd-zone:' + esc(st.zone) + ";--dd-zone-bg:" + esc(st.bg) + '"' +
               ' data-screen="' + esc(s) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
               '<span class="dd-index-emoji" aria-hidden="true">' + st.emoji + "</span>" +
               esc(s) +
               '<span class="dd-index-count">' + counts[s] + "</span>" +
             "</button>";
    }).join("");
    return '<nav class="dd-index" aria-label="画面から さがす">' +
             '<p class="dd-index-h">どの 画面の ことですか？</p>' +
             '<div class="dd-index-grid">' + tiles + "</div>" +
           "</nav>";
  }

  function tocHtml(posts) {
    return '<details class="dd-toc-fold" open>' +
             "<summary>もくじ（" + posts.length + "本）</summary>" +
             '<nav class="dd-toc" aria-label="記事の もくじ">' +
               '<p class="dd-toc-h">もくじ</p>' +
               '<ul class="dd-toc-list">' +
                 posts.map(function (p) {
                   return '<li data-slug="' + esc(p.slug) + '">' +
                            '<a href="#post-' + esc(p.slug) + '" class="dd-toc-item"' +
                              ' style="border-left-color:' + esc(D.screens[p.screen].zone) + '">' +
                              '<span class="dd-toc-date">' + formatShort(p.date) + "</span>" +
                              esc(p.title) +
                            "</a>" +
                          "</li>";
                 }).join("") +
               "</ul>" +
             "</nav>" +
           "</details>";
  }

  function postHtml(p) {
    var st = D.screens[p.screen];
    return '<article id="post-' + esc(p.slug) + '" class="dd-post" style="--dd-zone:' + esc(st.zone) + '">' +
             '<span class="dd-tape" data-cat="' + esc(p.category) + '">' +
               st.emoji + " " + esc(p.screen) + " ／ " + esc(p.category) +
             "</span>" +
             '<div class="dd-post-head">' +
               "<h2>" + esc(p.title) + "</h2>" +
               '<time class="dd-date" datetime="' + esc(p.date) + '">' + formatDate(p.date) +
                 (p.updated ? "（" + formatShort(p.updated) + " 更新）" : "") +
               "</time>" +
             "</div>" +
             '<p class="dd-post-lead">' + esc(p.lead) + "</p>" +
             (p.tags && p.tags.length
               ? '<p class="dd-tags">' + p.tags.map(function (t) {
                   return '<span class="dd-tag">' + esc(t) + "</span>";
                 }).join("") + "</p>"
               : "") +
             (p.hero ? figureHtml(p.hero) : "") +
             '<div class="dd-body">' + p.blocks.map(blockHtml).join("") + "</div>" +
           "</article>";
  }

  /* ══════════ 組み立て ══════════ */

  var screen = null;   // 絞り込み中の画面（null＝すべて）
  var io = null;

  function visiblePosts() {
    return screen ? D.posts.filter(function (p) { return p.screen === screen; }) : D.posts;
  }

  function render() {
    var posts = visiblePosts();
    /* 日誌の色（--dd-*）はぜんぶ .dd-root に載っている。これが無いと
       文字も枠も背景も全部そこだけ抜けるので、描くたびに付け直す。 */
    root.className = "dd-root";
    root.innerHTML =
      '<header class="dd-masthead">' +
        "<div>" +
          "<h1>この ページの あゆみ</h1>" +
          '<p class="dd-sub">' +
            "月刊ぴあんの ページに 何を 足して、何を やめたか。そのとき 何に 困っていたかを 残していきます。" +
            "スマホでの 読みかたも ここに まとめてあるので、使いかたに 迷ったときの 手引きとしても お使いください。" +
          "</p>" +
        "</div>" +
        '<div class="dd-masthead-meta">' +
          "<div>記事 " + D.posts.length + " 本</div>" +
          "<div>最終更新 " + formatDate(D.latest) + "</div>" +
        "</div>" +
      "</header>" +
      nowSummaryHtml() +
      indexHtml(screen) +
      '<div class="dd-layout">' +
        tocHtml(posts) +
        "<main>" +
          (screen
            ? '<div class="dd-filters"><button type="button" class="dd-filter is-on" id="clearFilter">' +
              "「" + esc(screen) + "」の " + posts.length + " 本を 表示中 — すべて 見る ✕</button></div>"
            : "") +
          posts.map(function (p, i) {
            return postHtml(p) +
              (i < posts.length - 1 ? '<div class="dd-binder" aria-hidden="true"><i></i><i></i><i></i></div>' : "");
          }).join("") +
        "</main>" +
      "</div>";

    spy(posts);
  }

  /* 目次の「いま読んでいる記事」を光らせる。
     下側を大きく取り、画面の上のほうに来た記事だけを対象にします。 */
  function spy(posts) {
    if (io) io.disconnect();
    var els = posts.map(function (p) { return document.getElementById("post-" + p.slug); })
                   .filter(function (el) { return el; });
    if (!els.length || !window.IntersectionObserver) return;
    io = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; })
                       .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (!vis[0]) return;
      var slug = vis[0].target.id.replace("post-", "");
      [].forEach.call(root.querySelectorAll(".dd-toc-list > li"), function (li) {
        var a = li.querySelector(".dd-toc-item");
        if (a) a.classList.toggle("is-active", li.getAttribute("data-slug") === slug);
      });
    }, { rootMargin: "-88px 0px -68% 0px", threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
  }

  root.addEventListener("click", function (e) {
    var tile = e.target.closest ? e.target.closest(".dd-index-tile") : null;
    if (tile) {
      var s = tile.getAttribute("data-screen");
      screen = screen === s ? null : s;
      render();
      root.querySelector(".dd-index").scrollIntoView({ block: "start", behavior: "smooth" });
      return;
    }
    if (e.target.closest && e.target.closest("#clearFilter")) {
      screen = null;
      render();
    }
  });

  /* ══════════ 起動 ══════════ */

  render();

  /* 開いた時点で「読んだ」印を付ける（入口の赤い点が消えます） */
  try { window.localStorage.setItem(SEEN_KEY, D.latest); } catch (err) { /* 使えない環境では何もしない */ }

  /* もどり先。にじいろくれよんから来たときは ?b=nijiiro が付いています */
  var isNijiiro = /(^|[?&])b=nijiiro(&|$)/.test(location.search);
  document.body.setAttribute("data-brand", isNijiiro ? "nijiiro" : "atelier");
  var back = document.getElementById("backLink");
  if (back) {
    back.setAttribute("href", isNijiiro ? "nijiiro.html" : "index.html");
    back.textContent = "← " + (isNijiiro ? "にじいろくれよん" : "あとりえくれよん") + "の 月刊ぴあんに もどる";
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
