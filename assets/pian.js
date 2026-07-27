/* 月刊ぴあん — 号の表示とバックナンバーの切り替え
 *
 * データは issues.js（window.PIAN）。
 * このファイルは表示だけを担当するので、号を足すときに触る必要はありません。
 */
(function () {
  "use strict";

  var PIAN = window.PIAN;
  if (!PIAN || !PIAN.issues || !PIAN.issues.length) return;

  var brandKey = document.body.getAttribute("data-brand");
  var brand = PIAN.brands[brandKey];

  /* ページの種類ごとの見出し。色は CSS 側で同じキーに割り当てている。 */
  var SEC = {
    schedule:   { icon: "📅", name: "スケジュール",   short: "よてい",   lead: "1か月のよてい" },
    subject:    { icon: "✏️", name: "きょうかかだい", short: "きょうか", lead: "べんきょうの課題" },
    meditation: { icon: "🧘", name: "めいそうかだい", short: "めいそう", lead: "こころを落ちつける時間" },
    main:       { icon: "🎨", name: "メインかだい",   short: "メイン",   lead: "週ごとの活動" }
  };
  var SEC_ORDER = ["schedule", "subject", "meditation", "main"];

  var root = document.getElementById("issueRoot");
  var archRoot = document.getElementById("archList");
  var nowLabel = document.getElementById("nowIssue");
  var toTop = document.getElementById("toTop");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function findIssue(id) {
    for (var i = 0; i < PIAN.issues.length; i++) {
      if (PIAN.issues[i].id === id) return PIAN.issues[i];
    }
    return null;
  }

  /** その号・その事業所のページ一覧（データが無い号は null） */
  function content(issue) {
    return issue && issue.brands ? issue.brands[brandKey] : null;
  }

  function pagesOf(issue, sec) {
    var c = content(issue);
    if (!c) return [];
    return c.pages.filter(function (p) { return p.sec === sec; });
  }

  /** バックナンバー一覧に出す小さな見本。専用サムネが無い号は本体画像で代用する。 */
  function thumbOf(issue) {
    var c = content(issue);
    if (!c || !c.pages.length) return null;
    if (c.thumb) return c.thumb;
    var cover = c.pages.filter(function (p) { return p.sec === "cover"; })[0];
    return cover || c.pages.filter(function (p) { return p.sec === "schedule"; })[0] || c.pages[0];
  }

  /** バックナンバーのカードに出す「その月やったこと」 */
  function summaryOf(issue) {
    return pagesOf(issue, "main").map(function (p) { return p.title; }).join("・");
  }

  function pageHTML(p) {
    var alt = p.sub ? p.sub + "　" + p.title : p.title;
    /* crop 指定のあるページは、下側の余白を隠して縦を詰める。
       隠れた分は見る手段が無くなるので、余白だけのページにしか使わない。 */
    var cropped = p.crop && p.crop > 0 && p.crop < 1;
    var style = cropped ? ' style="--ar:' + (p.w / (p.h * p.crop)).toFixed(4) + '"' : "";
    return '' +
      '<figure class="page">' +
        '<figcaption class="page-cap">' +
          (p.sub ? '<span class="wk">' + esc(p.sub) + "</span>" : "") +
          '<span class="ttl">' + esc(p.title) + "</span>" +
        "</figcaption>" +
        '<div class="page-view' + (cropped ? " is-crop" : "") + '"' + style + ">" +
          '<img src="' + esc(p.src) + '" width="' + p.w + '" height="' + p.h + '" ' +
               'loading="lazy" decoding="async" alt="' + esc(alt) + '">' +
        "</div>" +
      "</figure>";
  }

  function issueHTML(issue) {
    var c = content(issue);
    if (!c) {
      return '<p class="hero-note"><span class="ico">🙇</span>' +
        "この号の" + esc(brand.name) + "分は、まだ用意ができていません。</p>";
    }

    var cover = c.pages.filter(function (p) { return p.sec === "cover"; })[0];

    var html = '<article class="issue">';

    /* ── 表紙まわり ── */
    html += '<header class="hero">' +
      '<p class="hero-kicker">' + esc(brand.name) + "</p>" +
      '<h1 class="hero-title" aria-label="' + esc(issue.label) + '">' +
        "<span>" + issue.year + "年</span>" +
        '<span class="num" aria-hidden="true">' + issue.month + "<small>月号</small></span>" +
      "</h1>";
    if (c["catch"]) html += '<p class="hero-catch">' + esc(c["catch"]) + "</p>";
    if (cover) {
      html += '<figure class="cover">' +
        '<img src="' + esc(cover.src) + '" width="' + cover.w + '" height="' + cover.h + '" ' +
             'decoding="async" alt="' + esc(issue.label) + "　" + esc(brand.name) + 'の表紙">' +
        "</figure>";
    }
    if (c.note) {
      html += '<p class="hero-note"><span class="ico">📌</span><span>' + esc(c.note) + "</span></p>";
    }
    html += "</header>";

    /* ── セクションへのジャンプ ── */
    var live = SEC_ORDER.filter(function (s) { return pagesOf(issue, s).length; });
    html += '<nav class="jump" aria-label="この号の中身">';
    live.forEach(function (s) {
      html += '<a href="#sec-' + s + '" data-sec="' + s + '">' +
        '<span class="ico" aria-hidden="true">' + SEC[s].icon + "</span>" +
        "<span>" + SEC[s].short + "</span></a>";
    });
    html += "</nav>";

    /* ── 各セクション ── */
    live.forEach(function (s) {
      var list = pagesOf(issue, s);
      html += '<section class="sec" data-sec="' + s + '" id="sec-' + s + '">' +
        '<div class="sec-head" tabindex="-1">' +
          '<span class="ico" aria-hidden="true">' + SEC[s].icon + "</span>" +
          '<span class="txt"><h2>' + SEC[s].name + "</h2>" +
          '<span class="cnt">' + SEC[s].lead + "　全" + list.length + "ページ</span></span>" +
        "</div>" +
        list.map(pageHTML).join("") +
      "</section>";
    });

    html += "</article>";
    return html;
  }

  function archiveHTML(currentId) {
    return PIAN.issues.map(function (issue) {
      var cover = thumbOf(issue);
      var isNow = issue.id === currentId;
      var items = summaryOf(issue);
      var has = !!content(issue);
      return '' +
        '<a class="arch-card" href="#' + issue.id + '" data-issue="' + issue.id + '"' +
           (isNow ? ' aria-current="true"' : "") + ">" +
          '<span class="arch-thumb">' +
            (cover
              ? '<img src="' + esc(cover.src) + '" width="' + cover.w + '" height="' + cover.h +
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
                '<span class="arch-go">' + (isNow ? "この下に表示中" : "▶ この号を見る") + "</span>"
              : '<span class="arch-items">準備中です</span>') +
          "</span>" +
        "</a>";
    }).join("");
  }

  var current = null;

  function show(id, opts) {
    var issue = findIssue(id) || PIAN.issues[0];
    if (current === issue.id && !(opts && opts.force)) return;
    current = issue.id;

    root.innerHTML = issueHTML(issue);
    archRoot.innerHTML = archiveHTML(issue.id);
    nowLabel.textContent = issue.label;
    document.title = "月刊ぴあん " + issue.label + "｜" + brand.name;

    if (opts && opts.scroll) {
      window.scrollTo({ top: 0, behavior: prefersStill() ? "auto" : "smooth" });
    }
  }

  function prefersStill() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function idFromHash() {
    var h = (location.hash || "").replace(/^#/, "");
    return /^\d{4}-\d{2}$/.test(h) ? h : null;
  }

  /* セクションへのジャンプは URL を書き換えずにスクロールだけする
     （URLのハッシュは「いま見ている号」に使っているため） */
  document.addEventListener("click", function (e) {
    var jump = e.target.closest ? e.target.closest(".jump a") : null;
    if (jump) {
      var el = document.querySelector(jump.getAttribute("href"));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: prefersStill() ? "auto" : "smooth", block: "start" });
        var head = el.querySelector(".sec-head");
        if (head) head.focus({ preventScroll: true });
      }
    }
  });

  /* 号の切り替えも「もどる」で戻れるようにする。
     #archive や #main のような普通のアンカーは、そのままブラウザに任せる。 */
  window.addEventListener("hashchange", function () {
    var id = idFromHash();
    if (id) show(id, { scroll: true });
    else if (!location.hash) show(PIAN.issues[0].id, { scroll: true });
  });

  /* 上へもどる */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersStill() ? "auto" : "smooth" });
    });
    var onScroll = function () {
      toTop.classList.toggle("on", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* 印刷・PDF保存。まだ読み込んでいないページ画像があると白紙で出てしまうので、
     先に全部そろえてから印刷にわたす。 */
  var printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      var label = printBtn.textContent;
      var imgs = [].slice.call(root.querySelectorAll("img"));
      imgs.forEach(function (i) { i.loading = "eager"; });
      var waiting = imgs.filter(function (i) { return !i.complete; });
      if (!waiting.length) { window.print(); return; }

      printBtn.disabled = true;
      printBtn.textContent = "🖨 じゅんび中…";
      Promise.all(
        imgs.map(function (i) {
          return i.decode ? i.decode().catch(function () {}) : Promise.resolve();
        })
      ).then(function () {
        printBtn.disabled = false;
        printBtn.textContent = label;
        window.print();
      });
    });
  }

  show(idFromHash() || PIAN.issues[0].id, { force: true });
})();
