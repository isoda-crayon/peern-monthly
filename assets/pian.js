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
    /* 2026年3月以前の号は1枚に複数の課題がまとまっているので、まとめて出す */
    other:      { icon: "📄", name: "この月のないよう", short: "ないよう", lead: "課題とよていのまとめ",   color: "#d8ae3c" }
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
  function thumbOf(issue) {
    var c = content(issue);
    if (!c || !c.pages.length) return null;
    if (c.thumb) return c.thumb;
    var cover = c.pages.filter(function (p) { return p.sec === "cover"; })[0];
    return cover || c.pages.filter(function (p) { return p.sec === "schedule"; })[0] || c.pages[0];
  }
  function summaryOf(issue) {
    return pagesOf(issue, "main").map(function (p) { return p.title; }).join("・");
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
          '<span class="page-hint">📖 タップでよむ</span>' +
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
      return '<p class="hero-note" style="margin:28px auto;"><span class="ico">🙇</span>' +
        "この号の" + esc(brand.name) + "分は、まだ用意ができていません。</p>";
    }
    var flat = c.pages;
    var cover = flat.filter(function (p) { return p.sec === "cover"; })[0];

    var html = '<article class="issue">';

    html += '<header class="hero">' +
      '<p class="hero-kicker">' + esc(brand.name) + "</p>" +
      '<h1 class="hero-title" aria-label="' + esc(issue.label) + '">' +
        "<span>" + issue.year + "年</span>" +
        '<span class="num" aria-hidden="true">' + issue.month + "<small>月号</small></span>" +
      "</h1>";
    if (c["catch"]) html += '<p class="hero-catch">' + esc(c["catch"]) + "</p>";
    if (cover) {
      html += '<figure class="cover">' +
        '<button type="button" data-open="' + flat.indexOf(cover) + '" ' +
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
        list.map(function (p) { return pageHTML(p, flat.indexOf(p)); }).join("") +
      "</section>";
    });

    html += "</article>";
    return html;
  }

  function cardHTML(issue, currentId) {
    var thumb = thumbOf(issue);
    var isNow = issue.id === currentId;
    var items = summaryOf(issue);
    var has = !!content(issue);
    return '' +
      '<a class="arch-card" href="#' + issue.id + '" data-issue="' + issue.id + '"' +
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
            : '<span class="arch-items">準備中です</span>') +
        "</span>" +
      "</a>";
  }

  function archiveHTML(currentId) {
    return PIAN.issues.map(function (i) { return cardHTML(i, currentId); }).join("");
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

  function apply(issue, opts) {
    current = issue.id;
    root.innerHTML = issueHTML(issue);
    archRoot.innerHTML = archiveHTML(issue.id);
    sheetGrid.innerHTML = archiveHTML(issue.id);
    dockHTML(issue);
    document.title = "月刊ぴあん " + issue.label + "｜" + brand.name;
    if (opts && opts.scroll) {
      window.scrollTo({ top: 0, behavior: "auto" });
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

  /* パンの可動範囲。soft>0 のときは範囲外にゴムのような抵抗をつける */
  function clampPan(soft) {
    if (!V.fit) return false;
    var r = stageRect();
    var fw = V.fit.w * V.s, fh = V.fit.h * V.s;
    var minX = Math.min((r.width - fw) / 2, r.width - fw), maxX = Math.max((r.width - fw) / 2, 0);
    var minY = Math.min((r.height - fh) / 2, r.height - fh), maxY = Math.max((r.height - fh) / 2, 0);
    var hit = false;
    function pull(v, lo, hi) {
      if (v < lo) { hit = true; return soft ? lo + (v - lo) * soft : lo; }
      if (v > hi) { hit = true; return soft ? hi + (v - hi) * soft : hi; }
      return v;
    }
    V.tx = pull(V.tx, minX, maxX);
    V.ty = pull(V.ty, minY, maxY);
    return hit;
  }

  function setTrack(dx, dy, anim) {
    vTrack.style.transition = anim && !prefersStill() ? "transform .3s cubic-bezier(.2,.8,.25,1)" : "none";
    vTrack.style.transform = "translate3d(calc(" + (-V.i * 100) + "% + " + dx + "px)," + dy + "px,0)";
  }

  function updateChrome() {
    var p = V.list[V.i];
    vTitle.innerHTML = '<span class="v-issue">' + esc(V.label) + "</span>" + esc(p.title);
    var col = (SEC[p.sec] || {}).color || "#c78fc8";
    vPos.innerHTML =
      '<span class="v-pn"><span class="v-dot" style="background:' + col + '"></span>' +
      (V.i + 1) + " / " + V.list.length + "</span>" +
      '<span class="v-pt">' + esc(p.sub ? p.sub : p.title) + "</span>";
    vPrev.disabled = V.i === 0;
    vNext.disabled = V.i === V.list.length - 1;
  }

  function goTo(i, anim) {
    stopInertia();
    V.i = clamp(i, 0, V.list.length - 1);
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
    V.list = c.pages;
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
    if (!localStorage.getItem("pian_vhint")) {
      localStorage.setItem("pian_vhint", "1");
      setTimeout(function () { vHint.hidden = false; vHint.classList.add("show"); }, 350);
      setTimeout(function () { vHint.classList.remove("show"); }, 3400);
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
    /* とじたとき、最後によんでいたページへ縦スクロール面を合わせる */
    if (V.i !== V.openAt) {
      var target = root.querySelector('.page[data-idx="' + V.i + '"]');
      if (target) target.scrollIntoView({ block: "center", behavior: "auto" });
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
      var now = performance.now(), dt = now - last; last = now;
      V.tx += vx * dt; V.ty += vy * dt;
      var decay = Math.pow(0.94, dt / 16);
      vx *= decay; vy *= decay;
      var hit = clampPan(0);
      applyZoom(false);
      inertia = (Math.hypot(vx, vy) > 0.02 && !hit) ? requestAnimationFrame(step) : null;
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
      if (ptrs.size === 1) {
        var rest = Array.from(ptrs.values())[0];
        G = { type: "pan", x0: rest.x, y0: rest.y, t0: 0, moved: 99, axis: null,
              dx: 0, dy: 0, s0: V.s, tx0: V.tx, ty0: V.ty,
              lastX: rest.x, lastY: rest.y, lastT: performance.now(), vx: 0, vy: 0 };
        return;
      }
      /* 全部の指が離れた：倍率を落ちつかせる */
      if (V.s < 1.02) { resetZoom(); applyZoom(true); }
      else { V.s = clamp(V.s, 1, 4); clampPan(0); applyZoom(true); }
      G = null;
      return;
    }
    if (ptrs.size > 0) return;
    if (!G) return;
    var g = G; G = null;

    if (g.type === "pan") { clampPan(0); applyZoom(true); startInertia(g.vx, g.vy); return; }
    if (g.type === "track") {
      var W = stageRect().width;
      if (g.dx < -W * 0.2 || g.vx < -0.5) goTo(V.i + 1, true);
      else if (g.dx > W * 0.2 || g.vx > 0.5) goTo(V.i - 1, true);
      else goTo(V.i, true);
      return;
    }
    if (g.type === "close") {
      if (g.dy > 110 || g.vy > 0.6) { closeViewer(); if (!viewer.close) cleanupViewer(); }
      else { viewer.style.opacity = ""; setTrack(0, 0, true); }
      return;
    }
    /* タップ（シングル=バー表示切替 / ダブル=拡大） */
    var dur = performance.now() - g.t0;
    if (g.moved < 10 && dur < 320) {
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
    if (V.s > 1.05) { resetZoom(); applyZoom(true); return; }
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
    if (card) {
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

  /* ══════════ 起動 ══════════ */

  dock.hidden = false;
  show(idFromHash() || PIAN.issues[0].id, { force: true });
  onScroll();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
