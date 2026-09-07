/* 月刊ぴあん — 号の表示・ドック・号えらびシート・ページビューア
 *
 * データは issues.js（window.PIAN）。
 * このファイルは表示だけを担当するので、号を足すときに触る必要はありません。
 *
 * 画面のつくり:
 *  - 縦スクロール面 …… 号全体をながめる（ページはタップでビューアへ）
 *  - ドック（画面下）…… 号えらび＋セクション移動。親指で届く場所に常時表示
 *  - シート …………… 下からせり上がる号えらび（<dialog>）
 *  - ビューア ………… フルスクリーンでページをよむ。よこスワイプでページ送り、
 *                       ピンチ／ダブルタップで拡大、下スワイプ・✕・もどるで閉じる
 */
(function () {
  "use strict";

  var PIAN = window.PIAN;
  if (!PIAN || !PIAN.issues || !PIAN.issues.length) return;

  var brandKey = document.body.getAttribute("data-brand");
  var brand = PIAN.brands[brandKey];

  /* ページの種類ごとの見出し。色は CSS 側で同じキーに割り当てている。 */
  var SEC = {
    schedule:   { icon: "📅", name: "スケジュール",   short: "よてい",   lead: "1か月のよてい",           color: "#76c69f" },
    subject:    { icon: "✏️", name: "きょうかかだい", short: "きょうか", lead: "べんきょうの課題",         color: "#6bb2dd" },
    meditation: { icon: "🧘", name: "めいそうかだい", short: "めいそう", lead: "こころを落ちつける時間",   color: "#8e84cf" },
    main:       { icon: "🎨", name: "メインかだい",   short: "メイン",   lead: "週ごとの活動",             color: "#f0a259" },
    /* 以前の形式は1枚に複数の課題がまとまっているので、まとめて出す
       （あとりえは2026年3月号まで、にじいろは2026年4月号まで。切り替わりが1か月ずれます） */
    other:      { icon: "📄", name: "この月のないよう", short: "ないよう", lead: "1枚に何こかの課題がのっています", color: "#d8ae3c" }
  };
  var SEC_ORDER = ["schedule", "subject", "meditation", "main", "other"];

  function $(id) { return document.getElementById(id); }
  var root = $("issueRoot"), archRoot = $("archList");
  var dock = $("dock"), dockIssue = $("dockIssue"), dockTabs = $("dockTabs");
  var sheet = $("issueSheet"), sheetGrid = $("sheetGrid");
  var toTop = $("toTop"), progress = $("readProgress");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function prefersStill() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* <dialog> が無い古い環境でも開閉だけは動くように */
  function openModal(d) {
    if (d.showModal) { try { d.showModal(); return; } catch (e) {} }
    d.setAttribute("open", "");
  }
  function closeModal(d) {
    if (d.close) { try { d.close(); return; } catch (e) {} }
    d.removeAttribute("open");
  }

  /* ══════════ データ参照 ══════════ */

  function findIssue(id) {
    for (var i = 0; i < PIAN.issues.length; i++) {
      if (PIAN.issues[i].id === id) return PIAN.issues[i];
    }
    return null;
  }
  function content(issue) {
    return issue && issue.brands ? issue.brands[brandKey] : null;
  }
  function pagesOf(issue, sec) {
    var c = content(issue);
    if (!c) return [];
    return c.pages.filter(function (p) { return p.sec === sec; });
  }
  /** 画面に出す順に並べたページ。
   *  原本のページ順（issues.js の pages の並び）と、画面で読ませたい順は違います。
   *  2026年4月号以降は原本が「表紙→きょうか→めいそう→メイン→スケジュール」なのに対し、
   *  縦スクロール面は SEC_ORDER（スケジュールが先）で並べているためです。
   *  ここを唯一の並び順の元にして、縦スクロール面・ビューア・「◯/◯」の3つを揃えます。
   *  （ここが c.pages のままだと、よこスワイプの順と画面の並びが食い違います） */
  function orderedPages(issue) {
    var c = content(issue);
    if (!c) return [];
    var out = c.pages.filter(function (p) { return p.sec === "cover"; });
    SEC_ORDER.forEach(function (s) {
      out = out.concat(c.pages.filter(function (p) { return p.sec === s; }));
    });
    /* 知らない sec が来ても落とさない（原本の順で末尾に付ける） */
    c.pages.forEach(function (p) { if (out.indexOf(p) < 0) out.push(p); });
    return out;
  }
  function thumbOf(issue) {
    var c = content(issue);
    if (!c || !c.pages.length) return null;
    if (c.thumb) return c.thumb;
    var cover = c.pages.filter(function (p) { return p.sec === "cover"; })[0];
    return cover || c.pages.filter(function (p) { return p.sec === "schedule"; })[0] || c.pages[0];
  }
  function summaryOf(issue) {
    var main = pagesOf(issue, "main");
    /* 以前の形式（1枚に複数課題）の号は main が無いので、まとめページの見出しを使う */
    if (!main.length) main = pagesOf(issue, "other");
    return main.map(function (p) { return p.title; }).join("・");
  }

  /* ══════════ レンダラー ══════════ */

  function pageHTML(p, idx) {
    var alt = p.sub ? p.sub + "　" + p.title : p.title;
    /* crop 指定のあるページは、下側の余白を隠して縦を詰める（ビューアでは全体が出る） */
    var cropped = p.crop && p.crop > 0 && p.crop < 1;
    var style = cropped ? ' style="--ar:' + (p.w / (p.h * p.crop)).toFixed(4) + '"' : "";
    return '' +
      '<figure class="page" data-idx="' + idx + '">' +
        '<figcaption class="page-cap">' +
          (p.sub ? '<span class="wk">' + esc(p.sub) + "</span>" : "") +
          '<span class="ttl">' + esc(p.title) + "</span>" +
          /* 見た目の誘導文。button の aria-label と同じ内容が二重に読まれるので隠す */
          '<span class="page-hint" aria-hidden="true">📖 タップでよむ</span>' +
        "</figcaption>" +
        '<button type="button" class="page-view' + (cropped ? " is-crop" : "") + '" ' +
                'data-open="' + idx + '" aria-label="' + esc(alt) + ' をよむ"' + style + ">" +
          '<img src="' + esc(p.src) + '" width="' + p.w + '" height="' + p.h + '" ' +
               'loading="lazy" decoding="async" alt="' + esc(alt) + '" ' +
               'onload="this.setAttribute(\'data-loaded\',\'\')">' +
        "</button>" +
      "</figure>";
  }

  function issueHTML(issue) {
    var c = content(issue);
    if (!c) {
      var alt = otherBrandOf(issue);
      return '<p class="hero-note" style="margin:28px auto;"><span class="ico">📎</span><span>' +
        esc(issue.label) + "は、" +
        (alt
          ? esc(alt.name) + 'だけの発行です。<br><a href="' + esc(alt.href) + "#" + issue.id + '">▶ ' +
            esc(alt.name) + "のこの号を見る</a>"
          : "まだ用意ができていません。") +
        "</span></p>";
    }
    /* data-open は「画面に出す順」での位置。ビューアも同じ並びを使います */
    var ord = orderedPages(issue);
    var cover = ord.filter(function (p) { return p.sec === "cover"; })[0];

    var html = '<article class="issue">';

    html += '<header class="hero">' +
      '<p class="hero-kicker">' + esc(brand.name) + "</p>" +
      '<h1 class="hero-title" tabindex="-1" aria-label="' + esc(issue.label) + '">' +
        "<span>" + issue.year + "年</span>" +
        '<span class="num" aria-hidden="true">' + issue.month + "<small>月号</small></span>" +
      "</h1>";
    if (c["catch"]) html += '<p class="hero-catch">' + esc(c["catch"]) + "</p>";
    if (cover) {
      html += '<figure class="cover">' +
        '<button type="button" data-open="' + ord.indexOf(cover) + '" ' +
                'aria-label="' + esc(issue.label) + 'をよむ">' +
        '<img src="' + esc(cover.src) + '" width="' + cover.w + '" height="' + cover.h + '" ' +
             'decoding="async" fetchpriority="high" alt="' + esc(issue.label) + "　" + esc(brand.name) + 'の表紙">' +
        "</button></figure>";
    }
    html += '<button type="button" class="read-start" data-open="0">📖 はじめから よむ</button>';
    if (c.note) {
      html += '<p class="hero-note"><span class="ico">📌</span><span>' + esc(c.note) + "</span></p>";
    }
    html += "</header>";

    var live = SEC_ORDER.filter(function (s) { return pagesOf(issue, s).length; });
    live.forEach(function (s) {
      var list = pagesOf(issue, s);
      html += '<section class="sec" data-sec="' + s + '" id="sec-' + s + '">' +
        '<div class="sec-head" tabindex="-1">' +
          '<span class="ico" aria-hidden="true">' + SEC[s].icon + "</span>" +
          '<span class="txt"><h2>' + SEC[s].name + "</h2>" +
          '<span class="cnt">' + SEC[s].lead + "　全" + list.length + "ページ</span></span>" +
        "</div>" +
        list.map(function (p) { return pageHTML(p, ord.indexOf(p)); }).join("") +
      "</section>";
    });

    html += "</article>";
    return html;
  }

  /** その号を出しているもう一方の事業所（無ければ null） */
  function otherBrandOf(issue) {
    var keys = Object.keys(issue.brands || {});
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] !== brandKey && PIAN.brands[keys[i]]) return PIAN.brands[keys[i]];
    }
    return null;
  }

  function cardHTML(issue, currentId) {
    var thumb = thumbOf(issue);
    var isNow = issue.id === currentId;
    var items = summaryOf(issue);
    var has = !!content(issue);
    var alt = has ? null : otherBrandOf(issue);
    /* その事業所で未発行の号は、カードに「▶ ◯◯くれよんで見る」と書いてある。
       いままでは同じページで月だけ切り替わり、本文のリンクをもう一度押す必要があった。
       書いてあるとおり、そのままもう一方の事業所のページへ渡す。 */
    var jump = !has && alt;
    return '' +
      '<a class="arch-card" href="' + (jump ? esc(alt.href) : "") + "#" + issue.id + '"' +
         (jump ? ' data-jump="1"' : ' data-issue="' + issue.id + '"') +
         (isNow ? ' aria-current="true"' : "") + ">" +
        '<span class="arch-thumb">' +
          (thumb
            ? '<img src="' + esc(thumb.src) + '" width="' + thumb.w + '" height="' + thumb.h +
              '" loading="lazy" decoding="async" alt="">'
            : "") +
          '<span class="arch-m" aria-hidden="true">' + issue.month + "月</span>" +
        "</span>" +
        '<span class="arch-body">' +
          '<span class="arch-title">' + esc(issue.label) +
            (isNow ? '<span class="arch-now">いま見ている号</span>' : "") +
          "</span>" +
          (has
            ? '<span class="arch-items">' + esc(items) + "</span>" +
              '<span class="arch-go">' + (isNow ? "ひらいています" : "▶ この号を見る") + "</span>"
            : alt
              ? '<span class="arch-items">この号は' + esc(alt.name) + "だけの発行です</span>" +
                '<span class="arch-go">▶ ' + esc(alt.name) + "で見る</span>"
              : '<span class="arch-items">準備中です</span>') +
        "</span>" +
      "</a>";
  }

  /** 号が増えても探しやすいよう、年ごとに区切って並べる */
  function archiveHTML(currentId) {
    var html = "", year = null;
    PIAN.issues.forEach(function (i) {
      if (i.year !== year) {
        year = i.year;
        var n = PIAN.issues.filter(function (x) { return x.year === year; }).length;
        html += '<p class="arch-year"><b>' + year + "年</b><span>" + n + "冊</span></p>";
      }
      html += cardHTML(i, currentId);
    });
    return html;
  }

  function dockHTML(issue) {
    dockIssue.innerHTML = "📚 <b>" + esc(issue.short) + '</b> <span class="dk-c">▲</span>';
    dockIssue.setAttribute("aria-label", "号をえらぶ（いまは" + issue.label + "）");
    var live = SEC_ORDER.filter(function (s) { return pagesOf(issue, s).length; });
    dockTabs.innerHTML = live.map(function (s) {
      return '<button type="button" class="dock-tab" data-sec="' + s + '">' +
        '<span class="ic" aria-hidden="true">' + SEC[s].icon + "</span>" + SEC[s].short + "</button>";
    }).join("");
  }

  /* ══════════ 号の表示・切り替え ══════════ */

  var current = null;

  /* 号の切り替えは画面をまるごと入れ替えるので、見ていない人には何も起きていないように
     見える（title を変えても読み上げられない）。切り替わったことをここから伝える。 */
  var liveStatus = document.createElement("p");
  liveStatus.className = "sr-only";
  liveStatus.setAttribute("role", "status");
  document.body.appendChild(liveStatus);

  function apply(issue, opts) {
    /* ビューアを開いたまま号が変わると（戻るボタンなど）、V.list は古い号のページを
       指したまま残る。閉じるときに新しい号の別ページへ飛ぶので、先に閉じておく。
       close イベントは非同期に飛ぶ＝後始末が入れ替え後に走ることがあるので、
       「読んでいた場所へ戻す」だけは効かないようにしてから閉じる。 */
    if (viewer && viewer.open) {
      V.openAt = V.i;
      closeViewer();
      if (!viewer.close) cleanupViewer();
    }
    current = issue.id;
    root.innerHTML = issueHTML(issue);
    archRoot.innerHTML = archiveHTML(issue.id);
    sheetGrid.innerHTML = archiveHTML(issue.id);
    dockHTML(issue);
    document.title = "月刊ぴあん " + issue.label + "｜" + brand.name;
    if (opts && opts.scroll) {
      window.scrollTo({ top: 0, behavior: "auto" });
      /* 自分で選んで切り替えたときだけ。起動時に動かすとページの頭を飛ばしてしまう */
      liveStatus.textContent = issue.label + "を ひらきました";
      var h = root.querySelector(".hero-title");
      if (h) h.focus({ preventScroll: true });
    }
    curTab = null;
    updateSpy();
  }

  function show(id, opts) {
    var issue = findIssue(id) || PIAN.issues[0];
    if (current === issue.id && !(opts && opts.force)) return;
    var run = function () { apply(issue, opts); };
    /* View Transitions API があれば、号の切り替えをふわっと繋ぐ
       （バックグラウンド等で遷移が中断されても表示自体は run() で完了している） */
    if (document.startViewTransition && !prefersStill() && current) {
      var t = document.startViewTransition(run);
      if (t) {
        if (t.ready && t.ready.catch) t.ready.catch(function () {});
        if (t.finished && t.finished.catch) t.finished.catch(function () {});
      }
    } else {
      run();
    }
  }

  function idFromHash() {
    var h = (location.hash || "").replace(/^#/, "");
    return /^\d{4}-\d{2}$/.test(h) ? h : null;
  }

  window.addEventListener("hashchange", function () {
    var id = idFromHash();
    if (id) show(id, { scroll: true });
    else if (!location.hash) show(PIAN.issues[0].id, { scroll: true });
  });

  /* ══════════ ドック：いまいるセクションを追いかける ══════════ */

  var curTab = null;
  function setTab(sec) {
    if (sec === curTab) return;
    curTab = sec;
    var tabs = dockTabs.querySelectorAll(".dock-tab");
    for (var i = 0; i < tabs.length; i++) {
      var cur = tabs[i].getAttribute("data-sec") === sec;
      if (cur) {
        tabs[i].setAttribute("aria-current", "true");
        tabs[i].scrollIntoView({ inline: "center", block: "nearest", behavior: prefersStill() ? "auto" : "smooth" });
      } else {
        tabs[i].removeAttribute("aria-current");
      }
    }
  }
  /* 画面の上半分に見えている（または通過した）最後のセクション＝現在地 */
  function updateSpy() {
    var secs = root.querySelectorAll(".sec");
    if (!secs.length) return;
    var line = window.innerHeight * 0.45;
    var cur = secs[0].getAttribute("data-sec");
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].getBoundingClientRect().top <= line) cur = secs[i].getAttribute("data-sec");
    }
    setTab(cur);
  }

  dockTabs.addEventListener("click", function (e) {
    var b = e.target.closest(".dock-tab");
    if (!b) return;
    var el = $("sec-" + b.getAttribute("data-sec"));
    if (el) {
      el.scrollIntoView({ behavior: prefersStill() ? "auto" : "smooth", block: "start" });
      var head = el.querySelector(".sec-head");
      if (head) head.focus({ preventScroll: true });
    }
  });

  /* ══════════ 号えらびシート ══════════ */

  dockIssue.addEventListener("click", function () { openModal(sheet); });
  sheet.addEventListener("click", function (e) {
    /* 中身の外（backdrop側）をタップしたら閉じる */
    if (e.target === sheet) closeModal(sheet);
    var card = e.target.closest ? e.target.closest(".arch-card") : null;
    if (card) {
      /* 他事業所へ渡すカードは、そのまま href に任せる */
      if (card.getAttribute("data-jump")) { closeModal(sheet); return; }
      e.preventDefault();
      closeModal(sheet);
      location.hash = card.getAttribute("data-issue");
    }
  });
  /* グリップの下スワイプで閉じる */
  (function () {
    var startY = null;
    var body = sheet.querySelector(".sheet-body");
    sheet.addEventListener("pointerdown", function (e) {
      if (body.scrollTop <= 0) startY = e.clientY;
      else startY = null;
    });
    sheet.addEventListener("pointermove", function (e) {
      if (startY == null) return;
      var dy = e.clientY - startY;
      if (dy > 0 && body.scrollTop <= 0) sheet.style.translate = "0 " + dy * 0.55 + "px";
    });
    function end(e) {
      if (startY == null) return;
      var dy = e.clientY - startY;
      sheet.style.translate = "";
      if (dy > 90) closeModal(sheet);
      startY = null;
    }
    sheet.addEventListener("pointerup", end);
    sheet.addEventListener("pointercancel", end);
  })();

  /* ══════════ ページビューア ══════════ */

  var viewer = $("viewer"), vStage = $("vStage"), vTrack = $("vTrack");
  var vTitle = $("vTitle"), vPos = $("vPos"), vHint = $("vHint");
  var vPrev = $("vPrev"), vNext = $("vNext"), vClose = $("vClose");

  var V = {
    list: [], cells: [], i: 0, openAt: 0, label: "",
    s: 1, tx: 0, ty: 0, fit: null
  };

  function stageRect() { return vStage.getBoundingClientRect(); }

  function fitOf(p) {
    var r = stageRect();
    var s = Math.min(r.width / p.w, r.height / p.h);
    return { w: p.w * s, h: p.h * s };
  }

  function buildCells() {
    vTrack.innerHTML = V.list.map(function (p) {
      return '<div class="v-cell"><img alt="' + esc(p.title) + '" draggable="false"></div>';
    }).join("");
    V.cells = [];
    var els = vTrack.children;
    for (var i = 0; i < els.length; i++) {
      V.cells.push({ el: els[i], img: els[i].firstChild, p: V.list[i], loaded: false });
    }
  }

  function layoutCell(i) {
    var c = V.cells[i];
    if (!c) return;
    var fit = fitOf(c.p);
    var r = stageRect();
    c.img.style.width = fit.w + "px";
    c.img.style.height = fit.h + "px";
    if (i === V.i) {
      V.fit = fit;
      applyZoom(false);
    } else {
      c.img.style.transform = "translate(" + (r.width - fit.w) / 2 + "px," + (r.height - fit.h) / 2 + "px) scale(1)";
    }
  }

  function loadNear() {
    for (var j = Math.max(0, V.i - 1); j <= Math.min(V.list.length - 1, V.i + 1); j++) {
      var c = V.cells[j];
      if (c && !c.loaded) { c.img.src = c.p.src; c.loaded = true; }
    }
  }

  function applyZoom(anim) {
    var img = V.cells[V.i] && V.cells[V.i].img;
    if (!img) return;
    img.style.transition = anim && !prefersStill() ? "transform .28s cubic-bezier(.2,.8,.25,1)" : "none";
    img.style.transform = "translate(" + V.tx + "px," + V.ty + "px) scale(" + V.s + ")";
  }

  function resetZoom() {
    var r = stageRect();
    V.s = 1;
    if (V.fit) {
      V.tx = (r.width - V.fit.w) / 2;
      V.ty = (r.height - V.fit.h) / 2;
    }
  }

  /* 拡大の下限。ここを下回ったら指を離した時点で元の大きさに戻す。
     1本指のパン判定（V.s > 1.02）と揃えておかないと、1.02〜1.05 のあいだで
     「スワイプもパンも効かず、ダブルタップも戻らない」わなができる。 */
  var ZOOM_KEEP = 1.06, ZOOM_MAX = 4;

  /* パンの可動範囲。soft>0 のときは範囲外にゴムのような抵抗をつける。
     戻り値はどちらの軸が端に当たったか（慣性を軸ごとに止めるのに使う） */
  var panHit = { x: false, y: false };
  function clampPan(soft) {
    panHit.x = false; panHit.y = false;
    if (!V.fit) return panHit;
    var r = stageRect();
    var fw = V.fit.w * V.s, fh = V.fit.h * V.s;
    var minX = Math.min((r.width - fw) / 2, r.width - fw), maxX = Math.max((r.width - fw) / 2, 0);
    var minY = Math.min((r.height - fh) / 2, r.height - fh), maxY = Math.max((r.height - fh) / 2, 0);
    function pull(v, lo, hi, ax) {
      if (v < lo) { panHit[ax] = true; return soft ? lo + (v - lo) * soft : lo; }
      if (v > hi) { panHit[ax] = true; return soft ? hi + (v - hi) * soft : hi; }
      return v;
    }
    V.tx = pull(V.tx, minX, maxX, "x");
    V.ty = pull(V.ty, minY, maxY, "y");
    return panHit;
  }

  /* 指が全部離れたときに倍率を落ちつかせる。何かしたら true。
     ピンチの終わりは必ず「2本 → 1本 → 0本」で、1本になった時点で G が pan に
     差し替わるため、以前 pinch 分岐の中にあったこの処理は一度も実行されず、
     0.55 まで縮んだまま／5 倍のまま戻らなくなっていた。 */
  function settleZoom() {
    if (V.s < ZOOM_KEEP) { resetZoom(); applyZoom(true); return true; }
    if (V.s > ZOOM_MAX) { V.s = ZOOM_MAX; clampPan(0); applyZoom(true); return true; }
    return false;
  }

  function setTrack(dx, dy, anim) {
    vTrack.style.transition = anim && !prefersStill() ? "transform .3s cubic-bezier(.2,.8,.25,1)" : "none";
    vTrack.style.transform = "translate3d(calc(" + (-V.i * 100) + "% + " + dx + "px)," + dy + "px,0)";
  }

  /* フォーカスの乗っているボタンを disabled にすると、ブラウザはフォーカスを外して
     body へ落とす。keydown は #viewer に張ってあるので、そうなると矢印キーが
     まるごと効かなくなる（◀ で1ページ目、▶ で最終ページへ行った人が必ず踏む）。
     無効にする前に、隣のボタンへ逃がしておく。 */
  function setNavDisabled(btn, off) {
    if (off && !btn.disabled && document.activeElement === btn) {
      var alt = btn === vNext ? vPrev : vNext;
      (alt.disabled ? vClose : alt).focus({ preventScroll: true });
    }
    btn.disabled = off;
  }

  var chromeAt = -1;
  function updateChrome() {
    var p = V.list[V.i];
    /* vPos は aria-live。同じページのまま書き直すと同じ内容が読み上げ直されるので、
       ページが変わったときだけ作り直す（スワイプが届かず戻ったときも goTo は走る） */
    if (chromeAt !== V.i) {
      chromeAt = V.i;
      vTitle.innerHTML = '<span class="v-issue">' + esc(V.label) + "</span>" + esc(p.title);
      var col = (SEC[p.sec] || {}).color || "#c78fc8";
      vPos.innerHTML =
        '<span class="v-pn"><span class="v-dot" style="background:' + col + '"></span>' +
        (V.i + 1) + " / " + V.list.length + "</span>" +
        '<span class="v-pt">' + esc(p.sub ? p.sub : p.title) + "</span>";
    }
    setNavDisabled(vPrev, V.i === 0);
    setNavDisabled(vNext, V.i === V.list.length - 1);
  }

  function goTo(i, anim) {
    stopInertia();
    V.i = clamp(i, 0, V.list.length - 1);
    /* 見えていないページも DOM には全部いる。transform で外へ出しているだけなので、
       そのままだと読み上げに全ページぶんの画像名が並んで、どれが今なのか分からない */
    for (var k = 0; k < V.cells.length; k++) {
      if (k === V.i) V.cells[k].el.removeAttribute("aria-hidden");
      else V.cells[k].el.setAttribute("aria-hidden", "true");
    }
    V.fit = null;
    layoutCell(V.i);
    resetZoom();
    applyZoom(false);
    for (var j = 0; j < V.cells.length; j++) if (j !== V.i) layoutCell(j);
    setTrack(0, 0, anim);
    viewer.style.opacity = "";
    loadNear();
    updateChrome();
  }

  function openViewer(idx) {
    var issue = findIssue(current);
    var c = content(issue);
    if (!c) return;
    /* 縦スクロール面と同じ並び。data-open の番号もこの配列の位置です */
    V.list = orderedPages(issue);
    if (!V.list.length) return;
    V.label = issue.label + "　" + brand.name;
    V.openAt = clamp(idx || 0, 0, V.list.length - 1);
    buildCells();
    viewer.classList.remove("ui-hide");
    openModal(viewer);
    lockScroll(true);
    V.i = V.openAt;
    /* getBoundingClientRect が同期レイアウトを起こすので、開いた直後でも寸法は取れる
       （rAF はバックグラウンドで止まることがあるため使わない） */
    for (var j = 0; j < V.cells.length; j++) layoutCell(j);
    goTo(V.openAt, false);
    vClose.focus({ preventScroll: true });
    /* localStorage は使えない環境がある（Safari のプライベート等）。diaryDot と同じ扱いに */
    var firstTime = false;
    try {
      if (!window.localStorage.getItem("pian_vhint")) {
        window.localStorage.setItem("pian_vhint", "1");
        firstTime = true;
      }
    } catch (e) { /* 出さないだけ */ }
    if (firstTime) {
      setTimeout(function () { vHint.hidden = false; vHint.classList.add("show"); }, 350);
      setTimeout(function () { vHint.classList.remove("show"); }, 3400);
      /* hidden に戻さないと、消えたあとも読み上げにだけ残り続ける */
      setTimeout(function () { vHint.hidden = true; }, 3800);
    }
  }

  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
  }

  function closeViewer() { closeModal(viewer); }

  viewer.addEventListener("close", cleanupViewer);
  function cleanupViewer() {
    lockScroll(false);
    stopInertia();
    /* 指の状態を持ち越さない。残っていると次に開いたとき最初のタッチが効かない */
    ptrs.clear();
    G = null;
    chromeAt = -1;
    viewer.style.opacity = "";
    /* とじたとき、最後によんでいたページへ縦スクロール面を合わせる。
       フォーカスも一緒に移す。<dialog> は「開く前に押したページ」へ戻すので、
       読みすすめたぶんだけ、見えている場所とフォーカスがずれてしまう。 */
    if (V.i !== V.openAt) {
      var target = root.querySelector('.page[data-idx="' + V.i + '"]');
      if (target) {
        target.scrollIntoView({ block: "center", behavior: "auto" });
        var btn = target.querySelector(".page-view");
        if (btn) btn.focus({ preventScroll: true });
      }
    }
    vTrack.innerHTML = "";
    V.cells = [];
  }
  vClose.addEventListener("click", function () {
    closeViewer();
    if (!viewer.close) cleanupViewer(); /* dialog 非対応環境 */
  });
  vPrev.addEventListener("click", function () { goTo(V.i - 1, true); });
  vNext.addEventListener("click", function () { goTo(V.i + 1, true); });
  viewer.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(V.i - 1, true); }
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(V.i + 1, true); }
  });
  viewer.addEventListener("cancel", function () { /* Esc/もどる → close イベントで後始末 */ });
  window.addEventListener("resize", function () {
    if (!viewer.open) return;
    for (var j = 0; j < V.cells.length; j++) layoutCell(j);
    resetZoom(); applyZoom(false); setTrack(0, 0, false);
  });

  /* ---- ジェスチャ（1本指=ページ送り/パン、2本指=ピンチ、下スワイプ=とじる） ---- */

  var ptrs = new Map(), G = null, lastTap = 0, lastTapXY = null, tapTimer = null, inertia = null;

  function pxy(e) {
    var r = stageRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function mid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

  function stopInertia() {
    if (inertia) { cancelAnimationFrame(inertia); inertia = null; }
  }
  function startInertia(vx, vy) {
    if (Math.hypot(vx, vy) < 0.08 || prefersStill()) return;
    var last = performance.now();
    function step() {
      /* 裏のタブでは rAF が止まる。戻ってきた1フレーム目の dt が巨大になると
         一気に端まで飛ぶので、頭打ちにする */
      var now = performance.now(), dt = Math.min(32, now - last); last = now;
      V.tx += vx * dt; V.ty += vy * dt;
      var decay = Math.pow(0.94, dt / 16);
      vx *= decay; vy *= decay;
      var hit = clampPan(0);
      /* 端に当たった軸だけ止める。以前は片方が当たると両方止まり、
         斜めに流したときに縦がその場で死んでいた */
      if (hit.x) vx = 0;
      if (hit.y) vy = 0;
      applyZoom(false);
      inertia = Math.hypot(vx, vy) > 0.02 ? requestAnimationFrame(step) : null;
    }
    inertia = requestAnimationFrame(step);
  }

  vStage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    try { vStage.setPointerCapture(e.pointerId); } catch (err) {}
    var p = pxy(e);
    ptrs.set(e.pointerId, p);
    stopInertia();
    if (ptrs.size === 1) {
      G = { type: "tap", x0: p.x, y0: p.y, t0: performance.now(), moved: 0, axis: null,
            dx: 0, dy: 0, s0: V.s, tx0: V.tx, ty0: V.ty,
            lastX: p.x, lastY: p.y, lastT: performance.now(), vx: 0, vy: 0 };
    } else if (ptrs.size === 2) {
      var a = Array.from(ptrs.values());
      G = { type: "pinch", d0: dist(a[0], a[1]), mid0: mid(a[0], a[1]),
            s0: V.s, tx0: V.tx, ty0: V.ty };
      setTrack(0, 0, false);
      viewer.style.opacity = ""; /* 下スワイプの途中でピンチに移ると薄いまま残る */
    }
  });

  vStage.addEventListener("pointermove", function (e) {
    if (!ptrs.has(e.pointerId) || !G) return;
    var p = pxy(e);
    ptrs.set(e.pointerId, p);

    if (G.type === "pinch" && ptrs.size >= 2) {
      var a = Array.from(ptrs.values());
      var d = dist(a[0], a[1]), m = mid(a[0], a[1]);
      var s = clamp(G.s0 * (d / Math.max(1, G.d0)), 0.55, 5);
      V.tx = m.x - (G.mid0.x - G.tx0) * (s / G.s0);
      V.ty = m.y - (G.mid0.y - G.ty0) * (s / G.s0);
      V.s = s;
      applyZoom(false);
      return;
    }

    var dx = p.x - G.x0, dy = p.y - G.y0;
    G.dx = dx; G.dy = dy;
    G.moved = Math.max(G.moved, Math.hypot(dx, dy));
    var now = performance.now(), dt = Math.max(1, now - G.lastT);
    G.vx = (p.x - G.lastX) / dt; G.vy = (p.y - G.lastY) / dt;
    G.lastX = p.x; G.lastY = p.y; G.lastT = now;

    if (V.s > 1.02) {
      G.type = "pan";
      V.tx = G.tx0 + dx; V.ty = G.ty0 + dy;
      clampPan(0.4);
      applyZoom(false);
      return;
    }
    if (!G.axis) {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dx) >= Math.abs(dy)) G.axis = "x";
      else G.axis = dy > 0 ? "y" : "none";
    }
    if (G.axis === "x") {
      G.type = "track";
      var r = dx;
      if ((V.i === 0 && dx > 0) || (V.i === V.list.length - 1 && dx < 0)) r = dx * 0.3;
      setTrack(r, 0, false);
    } else if (G.axis === "y") {
      G.type = "close";
      var cy = Math.max(0, dy);
      setTrack(0, cy, false);
      viewer.style.opacity = String(1 - Math.min(0.55, cy / 460));
    }
  });

  function onPointerEnd(e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);

    if (G && G.type === "pinch") {
      if (ptrs.size >= 2) {
        /* 3本目を離した。残った2本でピンチを組み直す。
           以前はここで G を捨てていたので、指が2本残っているのに
           以降ピンチが完全に無反応になっていた */
        var a2 = Array.from(ptrs.values());
        G = { type: "pinch", d0: dist(a2[0], a2[1]), mid0: mid(a2[0], a2[1]),
              s0: V.s, tx0: V.tx, ty0: V.ty };
        return;
      }
      if (ptrs.size === 1) {
        var rest = Array.from(ptrs.values())[0];
        G = { type: "pan", x0: rest.x, y0: rest.y, t0: 0, moved: 99, axis: null,
              dx: 0, dy: 0, s0: V.s, tx0: V.tx, ty0: V.ty,
              lastX: rest.x, lastY: rest.y, lastT: performance.now(), vx: 0, vy: 0 };
        return;
      }
      settleZoom();
      G = null;
      return;
    }
    if (ptrs.size > 0) return;
    if (!G) return;
    var g = G; G = null;

    if (g.type === "pan") {
      /* ピンチから1本になった経路もここに来る。倍率の後始末はここでやる */
      if (settleZoom()) return;
      var hit = clampPan(0);
      applyZoom(true);
      /* ゴムで引っぱった位置から戻すときに慣性を走らせると、その1フレーム目が
         transition:"none" を書いてしまい、.28s のもどりが一度も再生されない */
      if (!hit.x && !hit.y) startInertia(g.vx, g.vy);
      return;
    }
    if (g.type === "track") {
      var W = stageRect().width;
      if (g.dx < -W * 0.2 || g.vx < -0.5) goTo(V.i + 1, true);
      else if (g.dx > W * 0.2 || g.vx > 0.5) goTo(V.i - 1, true);
      else goTo(V.i, true);
      return;
    }
    if (g.type === "close") {
      if (g.dy > 110 || g.vy > 0.6) {
        /* 先に戻さないと、インラインの opacity が .viewer:not([open]){opacity:0} に
           勝って、閉じるあいだ薄いまま居座る */
        viewer.style.opacity = "";
        closeViewer(); if (!viewer.close) cleanupViewer();
      }
      else { viewer.style.opacity = ""; setTrack(0, 0, true); }
      return;
    }
    /* タップ（シングル=バー表示切替 / ダブル=拡大） */
    var dur = performance.now() - g.t0;
    if (g.moved < 10 && dur < 800) {
      var now = performance.now();
      if (now - lastTap < 320 && lastTapXY && Math.hypot(g.x0 - lastTapXY.x, g.y0 - lastTapXY.y) < 32) {
        lastTap = 0; lastTapXY = null;
        if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; }
        dblTap(g.x0, g.y0);
      } else {
        lastTap = now; lastTapXY = { x: g.x0, y: g.y0 };
        if (tapTimer) clearTimeout(tapTimer);
        tapTimer = setTimeout(function () {
          tapTimer = null;
          if (lastTap) { lastTap = 0; viewer.classList.toggle("ui-hide"); }
        }, 330);
      }
    }
  }
  vStage.addEventListener("pointerup", onPointerEnd);
  vStage.addEventListener("pointercancel", onPointerEnd);

  function dblTap(x, y) {
    if (V.s > ZOOM_KEEP) { resetZoom(); applyZoom(true); return; }
    var s2 = 2.5;
    V.tx = x - (x - V.tx) * (s2 / V.s);
    V.ty = y - (y - V.ty) * (s2 / V.s);
    V.s = s2;
    clampPan(0);
    applyZoom(true);
  }

  /* 縦スクロール面のページ → ビューア */
  root.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-open]") : null;
    if (b) openViewer(parseInt(b.getAttribute("data-open"), 10) || 0);
  });

  /* ══════════ 読みすすみバー・現在地・うえへ ══════════ */

  function onScroll() {
    var h = document.documentElement;
    var m = h.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (m > 0 ? clamp(window.scrollY / m, 0, 1) : 0) + ")";
    if (toTop) toTop.classList.toggle("on", window.scrollY > 700);
    updateSpy();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersStill() ? "auto" : "smooth" });
    });
  }

  /* 縦スクロール面のバックナンバー（シートと同じカード） */
  archRoot.addEventListener("click", function (e) {
    var card = e.target.closest ? e.target.closest(".arch-card") : null;
    if (card && !card.getAttribute("data-jump")) {
      e.preventDefault();
      location.hash = card.getAttribute("data-issue");
    }
  });

  /* ══════════ 印刷（画像を全部そろえてから） ══════════ */

  var printBtn = $("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      var label = printBtn.textContent;
      var imgs = [].slice.call(root.querySelectorAll("img"));
      imgs.forEach(function (i) { i.loading = "eager"; });
      var waiting = imgs.filter(function (i) { return !i.complete; });
      if (!waiting.length) { window.print(); return; }
      printBtn.disabled = true;
      printBtn.textContent = "🖨 じゅんび中…";
      Promise.all(imgs.map(function (i) {
        return i.decode ? i.decode().catch(function () {}) : Promise.resolve();
      })).then(function () {
        printBtn.disabled = false;
        printBtn.textContent = label;
        window.print();
      });
    });
  }

  /* ══════════ 開発日誌の「新しい記事あり」 ══════════ */

  /* 前に日誌を読んだときより新しい更新があれば、入口に赤い点を出す。
     最終更新日は diary.js の latest、読んだ印は日誌側（assets/diary.js）が
     同じキーに書き込むので、一度ひらけば消えます。 */
  function diaryDot() {
    var link = $("diaryLink");
    var latest = window.PIAN_DIARY && window.PIAN_DIARY.latest;
    if (!link || !latest) return;
    var seen = null;
    try { seen = window.localStorage.getItem("pianDiaryLastSeen"); } catch (e) { /* 読めない＝まだ読んでいない扱い */ }
    var fresh = !seen || seen < latest;
    var dot = link.querySelector(".dot");
    if (fresh && !dot) {
      dot = document.createElement("span");
      dot.className = "dot";
      dot.setAttribute("aria-hidden", "true");
      link.appendChild(dot);
      link.setAttribute("aria-label", "この ページの あゆみ（新しい記事が あります）");
    } else if (!fresh && dot) {
      link.removeChild(dot);
      link.removeAttribute("aria-label");
    }
  }
  diaryDot();

  /* 日誌を読んで「もどる」で帰ってきたとき、ブラウザがページを読み直さず
     そのまま復元することがある（bfcache）。そのままだと読んだのに赤い点が
     残るので、復元されたときにも判定し直す。 */
  window.addEventListener("pageshow", diaryDot);

  /* ══════════ 起動 ══════════ */

  dock.hidden = false;
  show(idFromHash() || PIAN.issues[0].id, { force: true });
  onScroll();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
