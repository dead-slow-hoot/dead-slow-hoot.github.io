/* ==========================================================================
   Dead Slow Hoot — desktop behaviour
   You shouldn't need to edit this file. Content lives in content.js.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var MOBILE_BREAKPOINT = 860;

  /* ---------- tiny DOM helper (always uses textContent, never innerHTML) ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) el.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return el;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function isMobile() { return window.innerWidth < MOBILE_BREAKPOINT; }
  function external(url) { return /^https?:/i.test(url) ? { target: "_blank", rel: "noopener" } : {}; }
  function assign(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }

  /* ---------- 16x16 pixel-art icons ---------- */
  var PAL = {
    k: "#000000", w: "#ffffff", g: "#c0c0c0", d: "#808080", y: "#ffff00", o: "#c0a000",
    b: "#000080", u: "#1084d0", t: "#008080", c: "#00ffff", r: "#ff0000", m: "#800000", n: "#00a000"
  };
  var SPRITES = {
    folder: ["", "", ".kkkk", "kyyyyk", "kyyyyykkkkkkkkk", "kywwwwwwwwwwwwyk", "kwyyyyyyyyyyyyok", "kwyyyyyyyyyyyyok",
      "kwyyyyyyyyyyyyok", "kwyyyyyyyyyyyyok", "kwyyyyyyyyyyyyok", "kwyyyyyyyyyyyyok", "kwyyyyyyyyyyyyok",
      "kooooooooooooook", "kkkkkkkkkkkkkkkk"],
    music: ["", "......bbbbbbbbb", "......bbbbbbbbb", "......b.......b", "......b.......b", "......b.......b",
      "......b.......b", "......b.......b", "......b.......b", "...bbbb....bbbb", "..bbbbb...bbbbb",
      "..bbbbb...bbbb", "...bbb"],
    camera: ["", "", "", ".....kkkkk", ".kkkkdddddkkkkk", "kggggggggggggggk", "kgrgggkkkkggggdk",
      "kggggkbcbbkgggdk", "kggggkbbcbkgggdk", "kggggkbbbbkgggdk", "kgggggkkkkggggdk", "kddddddddddddddk",
      "kkkkkkkkkkkkkkkk"],
    calendar: ["", "", ".kkkkkkkkkkkkkk", ".krrrrrrrrrrrrk", ".krwrrwrrwrrwrk", ".kkkkkkkkkkkkkk",
      ".kwwwwwwwwwwwwk", ".kwkwkwkwkwkwwk", ".kwwwwwwwwwwwwk", ".kwkwkwkwkwkwwk", ".kwwwwwwwwwwwwk",
      ".kwkwkwrrwkwwwk", ".kwwwwwwwwwwwwk", ".kkkkkkkkkkkkkk"],
    computer: ["", "..kkkkkkkkkkkk", "..kggggggggggk", "..kgbbbbbbbbgk", "..kgbtttttbbgk", "..kgbttbbbbbgk",
      "..kgbbbbbbbbgk", "..kgbbbbbbbbgk", "..kggggggggggk", "..kkkkkkkkkkkk", "......kkkk",
      "...kkkkkkkkkk", "...kggggggggk", "...kggggggrgk", "...kkkkkkkkkk"],
    mail: ["", "", "", ".kkkkkkkkkkkkkk", ".kwkwwwwwwwwkwk", ".kwwkwwwwwwkwwk", ".kwwwkwwwwkwwwk",
      ".kwwwwkwwkwwwwk", ".kwwwwwkkwwwwwk", ".kwwwwwwwwwwwwk", ".kwwwwwwwwwwwwk", ".kkkkkkkkkkkkkk"],
    video: ["", "", "", "..rrrrrrrrrrrr", ".rrrrrrrrrrrrrr", ".rrrrrwrrrrrrrr", ".rrrrrwwrrrrrrr",
      ".rrrrrwwwrrrrrr", ".rrrrrwwwwrrrrr", ".rrrrrwwwrrrrrr", ".rrrrrwwrrrrrrr", ".rrrrrwrrrrrrrr",
      ".rrrrrrrrrrrrrr", "..rrrrrrrrrrrr"],
    web: ["", ".....kkkkkk", "...kkuuuuuukk", "..kuunnuuuuuuk", ".kuunnnnuuunnuk", ".kunnnnnuunnnuk",
      "kuunnnnuuuunnuuk", "kuuunnnuuuuunuuk", "kuuuunnuuuuuuuuk", "kuuuunuuunnuuuuk", "kuuuuuuunnnnuuuk",
      ".kuuuuuunnnnuuk", ".kuuuuuuunnuuuk", "..kuuuuuuuuuuk", "...kkuuuuuukk", ".....kkkkkk"],
    merch: ["", "", "...kkkk..kkkk", "..kmmmmkkmmmmk", ".kmmmmmmmmmmmmk", "kmmmmmmmmmmmmmmk",
      "kmmkmmmmmmmmkmmk", ".kk.kmmmmmmk.kk", "....kmmmmmmk", "....kmmmmmmk", "....kmmmmmmk",
      "....kmmmmmmk", "....kmmmmmmk", "....kkkkkkkk"],
    speaker: ["", "", ".......k", "......kk", ".....kwk", ".kkkkwgk", ".kwwwggk", ".kwggggk", ".kwggggk",
      ".kdddggk", ".kkkkdgk", ".....kdk", "......kk", ".......k"],
    speakerOn: ["", "", ".......k.....b", "......kk..b...b", ".....kwk...b..b", ".kkkkwgk.b..b..b",
      ".kwwwggk..b.b..b", ".kwggggk..b.b..b", ".kwggggk..b.b..b", ".kdddggk..b.b..b", ".kkkkdgk.b..b..b",
      ".....kdk...b..b", "......kk..b...b", ".......k.....b"],
    display: ["", "..kkkkkkkkkkkk", "..kggggggggggk", "..kgrrrryyyygk", "..kgrrrryyyygk", "..kgnnnnuuuugk",
      "..kgnnnnuuuugk", "..kgmmmmbbbbgk", "..kggggggggggk", "..kkkkkkkkkkkk", "......kkkk", "...kkkkkkkkkk",
      "...kggggggggk", "...kkkkkkkkkk"],
    dice: ["", ".kkkkkkkkkkkkkk", ".kwwwwwwwwwwwwk", ".kwkkwwwwwwkkwk", ".kwkkwwwwwwkkwk", ".kwwwwwwwwwwwwk",
      ".kwwwwwrrwwwwwk", ".kwwwwwrrwwwwwk", ".kwwwwwwwwwwwwk", ".kwkkwwwwwwkkwk", ".kwkkwwwwwwkkwk", ".kwwwwwwwwwwwwk",
      ".kkkkkkkkkkkkkk"],
    // ---- extra music icons ----
    cd: ["....kkkkkkkk", "..kkwwwwwggggkk", ".kwwwccwwwggggdk", ".kwwcwwwwwwgggdk", "kwwcwwwwwwwwggdk", "kwcwwwwwwwwwggdk", "kwcwwwwkkwwwgddk", "kwwwwwkwwkwwgddk", "kwwwwwkwwkwggddk", "kgwwwwwkkwwggddk", "kggwwwwwwwwgdddk", "kgggwwwwwwggdddk", ".kgggwwwwgggddk", ".kdgggggggggddk", "..kkddddddddkk", "....kkkkkkkk"],
    vinyl: ["....kkkkkkkk", "..kkkkkkkkkkkk", ".kkkkddddddkkkk", ".kgkddkkkkddkkk", "kkkdkkkkkkkkdkkk", "kkdkkkrrrrkkkdkk", "kkdkkrrrrrrkkdkk", "kkdkkrrwwrrkkdkk", "kkdkkrrwwrrkkdkk", "kkdkkrrrrrrkkdkk", "kkdkkkrrrrkkkdkk", "kkkdkkkkkkkkdkkk", ".kkkddkkkkddkkk", ".kkkkddddddkkkk", "..kkkkkkkkkkkk", "....kkkkkkkk"],
    cassette: ["", "", "kkkkkkkkkkkkkkkk", "kggggggggggggggk", "kgwwwwwwwwwwwwgk", "kgwrrrrrrrrrrwgk", "kgwwwwwwwwwwwwgk", "kggkkkkkkkkkkggk", "kggkwdkddkdwkggk", "kggkdwkddkwdkggk", "kggkkkkkkkkkkggk", "kggggggggggggggk", "kgggdkkkkkkdgggk", "kkkkkkkkkkkkkkkk"],
    headphones: ["", "....kkkkkkkk", "..kkddddddddkk", ".kdd........ddk", ".kd..........dk", "kd............dk", "kd............dk", "kd............dk", "kkkkk......kkkkk", "kbbuk......kubbk", "kbbuk......kubbk", "kbbuk......kubbk", "kbbuk......kubbk", "kkkkk......kkkkk"],
    mic: ["......kkkk", ".....kgwgdk", "....kgwgggdk", "....kgdgdgdk", "....kdgdgddk", "....kgdgdgdk", ".....kddddk", "......kkkk", "......kddk", "......kddk", "......kddk", "......kddk", ".......kk", "....kkkkkkkk", "....kddddddk", "....kkkkkkkk"],
    radio: ["", "", "..........k", "...........k", "............k", "kkkkkkkkkkkkkkkk", "kmmmmmmmmmmmmmmk", "kmkkkkkmmyyyyymk", "kmkdkdkmmkkkkkmk", "kmkkdkkmmmmmmmmk", "kmkdkdkmmgmgmgmk", "kmkkkkkmmmmmmmmk", "kmmmmmmmmmmmmmmk", "kkkkkkkkkkkkkkkk"],
    // ---- end of extra music icons ----
    power: ["", "", "......kkkk", ".....kggggk", "....kgddddgk", "...kgd....dgk", "...kgd.kk.dgk",
      "...kgd.kk.dgk", "...kgd....dgk", "....kgddddgk", ".....kggggk", "......kkkk"]
  };
  var NS = "http://www.w3.org/2000/svg";
  function icon(name) {
    var rows = SPRITES[name] || SPRITES.web;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("aria-hidden", "true");
    rows.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        var ch = row[x], start = x;
        while (x < row.length && row[x] === ch) x++;
        if (PAL[ch]) {
          var r = document.createElementNS(NS, "rect");
          r.setAttribute("x", start); r.setAttribute("y", y);
          r.setAttribute("width", x - start); r.setAttribute("height", 1);
          r.setAttribute("fill", PAL[ch]);
          svg.appendChild(r);
        }
      }
    });
    return svg;
  }

  /* ---------- content ---------- */
  var band = SITE.bandName || "Dead Slow Hoot";
  document.title = band;

  var substack = (SITE.substack || "").replace(/\/+$/, "");
  var subscribeUrl = substack ? substack + "/subscribe" : "";
  var links = (SITE.links || []).filter(function (l) { return l && l.url; });
  if (subscribeUrl) links.unshift({ group: "Mailing list", label: SITE.luckyDipLabel || "Join the mailing list for demos lucky dip",
    icon: "mail", url: subscribeUrl, luckyDip: true });
  if (SITE.email) links.push({ group: "Contact", label: "Email us", icon: "mail", url: "mailto:" + SITE.email });

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  var shows = (SITE.tourDates || [])
    .filter(function (s) { return s && s.date && s.date >= todayISO(); })
    .sort(function (a, b) { return a.date < b.date ? -1 : 1; });

  var photos = (SITE.photos || []).filter(Boolean).map(function (src) { return { src: src }; });

  function fmtDate(iso) {
    var p = iso.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  }

  /* Welcome */
  (function () {
    var body = $("#win-welcome .welcome-body");
    var actions = h("div", { class: "welcome-actions" });
    if (SITE.featured && SITE.featured.url) {
      actions.appendChild(h("a", assign({ class: "btn big", href: SITE.featured.url }, external(SITE.featured.url)),
        icon("music"), SITE.featured.label || "Listen"));
    }
        // ---- Play-a-song button ----
    var song = new Audio("music/All_My_Love_Remains.mp3");
    var songLabel = h("span", { text: "Radio" });
    var songBtn = h("button", { class: "btn big", type: "button" }, icon("radio"), songLabel);
    songBtn.addEventListener("click", function () {
      if (song.paused) {
        claimAudio(song);
        song.play();
      } else {
        song.pause();
      }
    });
    song.addEventListener("play", function () {
      songBtn.replaceChild(icon("speakerOn"), songBtn.firstChild);
      songLabel.textContent = "Pause";
    });
    song.addEventListener("pause", function () {
      songBtn.replaceChild(icon("radio"), songBtn.firstChild);
      songLabel.textContent = "Radio";
    });
    window.addEventListener("dsh-audio", function (e) { if (e.detail !== song) song.pause(); });
    actions.appendChild(songBtn);
    // ---- end of play-a-song button ----
     actions.appendChild(h("button", { class: "btn big", type: "button", onclick: function () { openWindow("win-tour"); } },
      icon("calendar"), "Tour dates"));
    actions.appendChild(h("button", { class: "btn big", type: "button", onclick: function () { openWindow("win-links"); } },
      icon("folder"), "All links"));

    body.appendChild(h("div", { class: "welcome-hero logo" },
      h("h1", null, h("img", { class: "logo-text", src: "photos/sticker-text-stacked.png", alt: band })),
      h("img", { class: "logo-man", src: "photos/sticker-man.png", alt: "" })));
    if (SITE.tagline) body.appendChild(h("p", { class: "welcome-tagline", text: SITE.tagline }));
    if (SITE.about) body.appendChild(h("p", { class: "welcome-text", text: SITE.about }));
    body.appendChild(actions);
  })();

  /* ---------- Mailing list → demos lucky dip ----------
     Click the button → an email box drops down. Enter a valid address and
     press Enter → Substack's sign-up page opens in a new tab with the
     address filled in (Substack sends them a confirmation email), and the
     button turns into a player for a random track from the demos folder. */
  var demoPool = (Array.isArray(window.DEMO_FILES) ? window.DEMO_FILES : []).filter(function (d) { return d && d.file; });
  // Browsers can keep an old copy of the demo list for a while after you
  // upload new demos, so fetch a fresh one in the background straight away.
  var poolReady = fetch("data/demos.js?v=" + Date.now(), { cache: "no-store" })
    .then(function (r) { return r.ok ? r.text() : ""; })
    .then(function (t) {
      var m = /DEMO_FILES\s*=\s*(\[[\s\S]*\])\s*;?\s*$/.exec(t);
      if (!m) return;
      var fresh = JSON.parse(m[1]).filter(function (d) { return d && d.file; });
      if (fresh.length) demoPool = fresh;
    })
    .catch(function () { /* offline or opened from a file: keep the list we have */ });
  var JOINED_KEY = "dsh-joined";
  function joined() { try { return localStorage.getItem(JOINED_KEY) === "1"; } catch (e) { return false; } }
  function rememberJoined() { try { localStorage.setItem(JOINED_KEY, "1"); } catch (e) {} }
  // only one thing plays at once across the site
  function claimAudio(audio) {
    window.dispatchEvent(new CustomEvent("dsh-audio", { detail: audio }));
  }
  function fmtTime(t) {
    if (!isFinite(t)) return "--:--";
    return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
  }
  /* Google Form → Google Sheet backup of every sign-up.
     Works from the form's "pre-filled link", which contains both the
     form's ID and the ID of the email question. */
  var ML = SITE.mailingList || {};
  var sheet = (function (link) {
    var m = /\/forms\/d\/e\/([^/]+)\/viewform\?(?:.*&)?(entry\.\d+)=/.exec(link || "");
    return m ? { action: "https://docs.google.com/forms/d/e/" + m[1] + "/formResponse", field: m[2] } : null;
  })(ML.googleFormLink);
  function saveToSheet(email) {
    if (!sheet) return false;
    var data = new FormData();
    data.append(sheet.field, email);
    // Google doesn't let other sites read its reply ("no-cors"), but it does save the answer.
    fetch(sheet.action, { method: "POST", mode: "no-cors", body: data }).catch(function () {});
    return true;
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(v); }

  function luckyDip(l) {
    var box = h("div", { class: "lucky" });
    var btn = h("button", { class: "btn lucky-btn", type: "button", "aria-expanded": "false" }, icon("mail"), l.label);

    var input = h("input", { class: "win-input", type: "email", name: "email", autocomplete: "email",
      inputmode: "email", placeholder: "you@example.com", "aria-label": "Your email address" });
    var err = h("div", { class: "lucky-error", role: "alert" });
    var form = h("form", { class: "lucky-form", novalidate: true },
      h("label", { class: "lucky-label", text: "Your email address:" }),
      h("div", { class: "lucky-row" }, input, h("button", { class: "btn", type: "submit", text: "OK" })),
      err,
      h("div", { class: "lucky-hint", text: (ML.openSubstack !== false || !sheet)
        ? "Press Enter to join our mailing list. Substack opens in a new tab to confirm, and you get a random demo."
        : "Press Enter to join our mailing list and get a random demo. Unsubscribe any time." }));
    form.hidden = true;

    var player = h("div", { class: "lucky-player" });
    player.hidden = true;

    btn.addEventListener("click", function () {
      if (joined()) { showPlayer(); return; }
      form.hidden = !form.hidden;
      btn.setAttribute("aria-expanded", form.hidden ? "false" : "true");
      btn.classList.toggle("open", !form.hidden);
      if (!form.hidden) setTimeout(function () { input.focus(); }, 0);
    });
    input.addEventListener("input", function () { err.textContent = ""; input.classList.remove("bad"); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!isEmail(email)) {
        err.textContent = "That doesn't look like a working email address. Please check it and try again.";
        input.classList.add("bad");
        input.focus();
        return;
      }
      var saved = saveToSheet(email);
      if (!saved || ML.openSubstack !== false) {
        window.open(substack + "/subscribe?email=" + encodeURIComponent(email), "_blank", "noopener");
      }
      rememberJoined();
      showPlayer();
    });

    /* the player */
    var audio = new Audio();
    audio.preload = "auto";
    var current = -1;
    var titleEl, timeEl, fill, speaker, status;
    window.addEventListener("dsh-audio", function (e) { if (e.detail !== audio) audio.pause(); });

    function build() {
      if (player.firstChild) return;
      if (!demoPool.length) {
        player.appendChild(h("div", { class: "lucky-empty", text: "Thanks for joining! The demos are on their way. Check back soon." }));
        return;
      }
      speaker = h("button", { class: "btn speaker-btn", type: "button", "aria-label": "Play / pause" }, icon("speaker"));
      titleEl = h("div", { class: "demo-title" });
      fill = h("div", { class: "progress-fill" });
      var bar = h("div", { class: "progress", title: "Click to skip" }, fill);
      timeEl = h("span", { class: "demo-time" });
      status = h("div", { class: "demo-note" });
      player.appendChild(h("div", { class: "demo" },
        speaker,
        h("div", { class: "demo-info" }, titleEl, status, h("div", { class: "demo-progress" }, bar, timeEl))));
      player.appendChild(h("div", { class: "lucky-actions" },
        h("button", { class: "btn", type: "button", onclick: dip }, icon("dice"), "Dip again")));
      speaker.addEventListener("click", function () { if (audio.paused) play(); else audio.pause(); });
      bar.addEventListener("click", function (e) {
        var r = bar.getBoundingClientRect();
        if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
      });
      function sync() {
        fill.style.width = (audio.duration ? audio.currentTime / audio.duration * 100 : 0) + "%";
        timeEl.textContent = fmtTime(audio.currentTime) + " / " + fmtTime(audio.duration);
        speaker.replaceChild(icon(audio.paused ? "speaker" : "speakerOn"), speaker.firstChild);
        speaker.classList.toggle("playing", !audio.paused);
      }
      ["timeupdate", "loadedmetadata", "play", "pause"].forEach(function (ev) { audio.addEventListener(ev, sync); });
      audio.addEventListener("waiting", function () { status.textContent = "Loading…"; });
      audio.addEventListener("playing", function () { status.textContent = "Lucky dip"; });
      audio.addEventListener("ended", dip);
      audio.addEventListener("error", function () { status.textContent = "Couldn't load this one. Try another dip."; });
    }
    function play() { claimAudio(audio); audio.play().catch(function () {}); }
    function dip() {
      if (!demoPool.length) return;
      var n = demoPool.length === 1 ? 0 : current;
      while (n === current) n = Math.floor(Math.random() * demoPool.length);
      current = n;
      var d = demoPool[n];
      titleEl.textContent = d.title || d.file.split("/").pop();
      status.textContent = "Loading…";
      fill.style.width = "0%";
      audio.src = d.file;
      play();
    }
    function showPlayer() {
      form.hidden = true;
      btn.hidden = true;
      player.hidden = false;
      if (demoPool.length) { build(); if (current < 0) dip(); return; }
      // list not here yet: wait for the fresh copy before saying there's nothing
      if (!player.firstChild) player.appendChild(h("div", { class: "lucky-empty", text: "Loading demos…" }));
      poolReady.then(function () {
        player.textContent = "";
        build();
        if (demoPool.length && current < 0) dip();
      });
    }

    box.appendChild(btn);
    box.appendChild(form);
    box.appendChild(player);
    return box;
  }

  /* Links */
  (function () {
    var body = $("#win-links .links-body");
    var groups = [];
    links.forEach(function (l) {
      var g = l.group || "Links";
      var found = groups.filter(function (x) { return x.name === g; })[0];
      if (!found) { found = { name: g, items: [] }; groups.push(found); }
      found.items.push(l);
    });
    groups.forEach(function (g) {
      body.appendChild(h("fieldset", null, h("legend", { text: g.name }),
        h("div", { class: "link-grid" }, g.items.map(function (l) {
          if (l.luckyDip) return luckyDip(l);
          // long labels get the full row so they don't wrap
          return h("a", assign({ class: "btn" + (l.label.length > 14 ? " wide" : ""), href: l.url }, external(l.url)), icon(l.icon), l.label);
        }))));
    });
    if (!groups.length) body.appendChild(h("p", { text: "Links coming soon." }));
    $("#links-status").textContent = links.length + " object(s)";
  })();

  /* Tour */
  (function () {
    var body = $("#win-tour .tour-body");
    var field = h("div", { class: "field" });
    if (!shows.length) {
      field.appendChild(h("div", { class: "tour-empty", text: "No shows announced right now. Check back soon." }));
    } else {
      var tbody = h("tbody");
      shows.forEach(function (s) {
        var tix;
        if (s.soldOut) tix = h("span", { class: "btn", "aria-disabled": "true", text: "Sold out" });
        else if (s.ticketUrl) tix = h("a", assign({ class: "btn", href: s.ticketUrl }, external(s.ticketUrl)), "Tickets");
        else tix = h("span", { class: "btn", "aria-disabled": "true", text: "TBA" });
        var url = !s.soldOut && s.ticketUrl ? s.ticketUrl : "";
        var go = url ? function (e) {
          if (e.target.closest("a")) return;            // the Tickets button handles itself
          if (e.type === "keydown" && e.key !== "Enter") return;
          window.open(url, /^https?:/i.test(url) ? "_blank" : "_self", "noopener");
        } : null;
        tbody.appendChild(h("tr", url ? {
            class: "has-link", tabindex: "0", title: "Get tickets: " + (s.venue || "") + ", " + (s.city || ""),
            onclick: go, onkeydown: go
          } : null,
          h("td", { class: "date", text: fmtDate(s.date) }),
          h("td", null, s.city || ""),
          h("td", null, s.venue || "", s.note ? h("span", { class: "note", text: s.note }) : null),
          h("td", { class: "tix" }, tix)));
      });
      field.appendChild(h("table", { class: "tour-table" },
        h("thead", null, h("tr", null,
          h("th", { text: "Date" }), h("th", { text: "City" }), h("th", { text: "Venue" }), h("th", { text: "" }))),
        tbody));
    }
    body.appendChild(field);
    $("#tour-status").textContent = shows.length + " upcoming show" + (shows.length === 1 ? "" : "s");
  })();

  /* Newsletter (latest Substack post) */
  var post = (window.SUBSTACK_POST && window.SUBSTACK_POST.title) ? window.SUBSTACK_POST
           : (SITE.latestPost && SITE.latestPost.title) ? SITE.latestPost : null;
  var hasNews = !!(post || subscribeUrl);
  (function () {
    var win = $("#win-news");
    if (!hasNews) { win.setAttribute("data-start-closed", "true"); win.setAttribute("data-taskbar", "false"); return; }
    var body = $(".news-body", win);
    if (post) {
      var dateText = post.date ? fmtDate(post.date.slice(0, 10)) : "";
      body.appendChild(h("table", { class: "mail-head" },
        h("tr", null, h("th", { text: "From:" }), h("td", { text: band })),
        dateText ? h("tr", null, h("th", { text: "Date:" }), h("td", { text: dateText })) : null,
        h("tr", null, h("th", { text: "Subject:" }), h("td", null, h("b", { text: post.title })))));
      var msg = h("div", { class: "field mail-msg" });
      if (post.image) msg.appendChild(h("img", { class: "mail-img", src: post.image, alt: "", loading: "lazy",
        onerror: function () { this.remove(); } }));   // hide it rather than show a broken picture
      msg.appendChild(h("p", { text: post.excerpt || "" }));
      body.appendChild(msg);
    } else {
      body.appendChild(h("div", { class: "field mail-msg" },
        h("p", { text: "Get new music, gig announcements and the odd ramble straight to your inbox." })));
    }
    var actions = h("div", { class: "welcome-actions" });
    if (post && post.url) actions.appendChild(h("a", assign({ class: "btn", href: post.url }, external(post.url)), "Read the full post"));
    if (subscribeUrl) actions.appendChild(h("a", assign({ class: "btn", href: subscribeUrl }, external(subscribeUrl)), icon("mail"), "Join the mailing list"));
    body.appendChild(actions);
  })();

  /* Demos */
  var demos = (SITE.demos || []).filter(function (d) { return d && d.file; });
  (function () {
    var win = $("#win-demos");
    if (!demos.length) { win.setAttribute("data-start-closed", "true"); win.setAttribute("data-taskbar", "false"); return; }
    var body = $(".demos-body", win);
    var audio = new Audio();
    audio.preload = "none";
    var current = null;                          // the row that is loaded
    window.addEventListener("dsh-audio", function (e) { if (e.detail !== audio) audio.pause(); });

    function fmt(t) {
      if (!isFinite(t)) return "--:--";
      return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
    }
    function setIcon(row, playing) {
      var btn = row._btn;
      btn.replaceChild(icon(playing ? "speakerOn" : "speaker"), btn.firstChild);
      btn.classList.toggle("playing", playing);
      btn.setAttribute("aria-label", (playing ? "Pause " : "Play ") + row._demo.title);
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
    }
    function update() {
      if (!current) return;
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      current._fill.style.width = pct + "%";
      current._time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
      $("#demos-status").textContent = (audio.paused ? "Paused: " : "Now playing: ") + current._demo.title;
    }
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("play", function () { if (current) setIcon(current, true); update(); });
    audio.addEventListener("pause", function () { if (current) setIcon(current, false); update(); });
    audio.addEventListener("ended", function () {
      var rows = Array.prototype.slice.call(body.querySelectorAll(".demo"));
      var next = rows[rows.indexOf(current) + 1];
      if (next) toggle(next); else { current._fill.style.width = "0%"; }
    });
    audio.addEventListener("error", function () {
      if (current) $("#demos-status").textContent = "Couldn't load " + current._demo.file + " (check the file name in content.js)";
    });

    function toggle(row) {
      if (current !== row) {
        if (current) { audio.pause(); setIcon(current, false); current._fill.style.width = "0%"; current._time.textContent = ""; }
        current = row;
        audio.src = row._demo.file;
      }
      if (audio.paused) { claimAudio(audio); audio.play().catch(function () {}); } else audio.pause();
    }

    demos.forEach(function (d) {
      var fill = h("div", { class: "progress-fill" });
      var bar = h("div", { class: "progress", title: "Click to skip" }, fill);
      var time = h("span", { class: "demo-time" });
      var btn = h("button", { class: "btn speaker-btn", type: "button" }, icon("speaker"));
      var row = h("div", { class: "demo" },
        btn,
        h("div", { class: "demo-info" },
          h("div", { class: "demo-title", text: d.title || d.file.split("/").pop() }),
          d.note ? h("div", { class: "demo-note", text: d.note }) : null,
          h("div", { class: "demo-progress" }, bar, time)));
      row._demo = d; row._btn = btn; row._fill = fill; row._time = time;
      setIcon(row, false);
      btn.addEventListener("click", function () { toggle(row); });
      bar.addEventListener("click", function (e) {
        if (current !== row) { toggle(row); return; }
        var r = bar.getBoundingClientRect();
        if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
      });
      body.appendChild(row);
    });
    $("#demos-status").textContent = demos.length + " demo" + (demos.length === 1 ? "" : "s") + " — click a speaker to play";
  })();

  /* Display Properties: colour scheme picker */
  (function () {
    var body = $("#win-display .display-body");
    var committed = window.CURRENT_SCHEME || "Windows Standard";
    var select = h("select", { class: "win-select", id: "scheme-select" });
    (window.SCHEMES || []).forEach(function (sc) {
      var o = h("option", { value: sc.name, text: sc.name });
      if (sc.name === committed) o.selected = true;
      select.appendChild(o);
    });
    // picking a scheme previews it across the whole site straight away
    select.addEventListener("change", function () { window.applyScheme(select.value); });

    function apply() { committed = window.applyScheme(select.value); window.saveScheme(committed); }
    function revert() { window.applyScheme(committed); select.value = committed; }
    function close() { closeWindow($("#win-display")); }

    body.appendChild(h("div", { class: "tabs" }, h("span", { class: "tab", text: "Appearance" })));
    body.appendChild(h("div", { class: "tab-panel" },
      h("div", { class: "scheme-preview", "aria-hidden": "true" },
        h("div", { class: "pv-win pv-inactive" },
          h("div", { class: "title-bar" }, h("span", { class: "title-text", text: "Inactive Window" }))),
        h("div", { class: "pv-win pv-active" },
          h("div", { class: "title-bar" }, h("span", { class: "title-text", text: "Active Window" })),
          h("div", { class: "pv-body" },
            h("div", { class: "pv-menu" }, h("span", { text: "Normal" }), h("span", { class: "sel", text: "Selected" })),
            h("div", { class: "pv-field", text: "Window Text" })))),
      h("div", { class: "scheme-row" }, h("label", { for: "scheme-select", text: "Scheme:" }), select)));
    body.appendChild(h("div", { class: "dialog-buttons" },
      h("button", { class: "btn", type: "button", text: "OK", onclick: function () { apply(); close(); } }),
      h("button", { class: "btn", type: "button", text: "Cancel", onclick: function () { revert(); close(); } }),
      h("button", { class: "btn", type: "button", text: "Apply", onclick: apply })));
    // closing with the X counts as Cancel, like the real thing
    $("#win-display")._revert = revert;
  })();

  /* Photos folder */
  function photoName(p) { return decodeURIComponent(p.src.split("/").pop()); }
  (function () {
    var body = $("#win-photos .photos-body");
    var grid = h("div", { class: "photo-grid" });
    photos.forEach(function (p) {
      grid.appendChild(h("a", assign({ class: "photo-tile", href: p.src }, external("https:")),
        h("img", { src: p.src, alt: band + " photo", loading: "lazy" }),
        h("span", { text: photoName(p) })));
    });
    body.appendChild(h("div", { class: "field" }, grid));
    $("#photos-status").textContent = photos.length + " object(s)";
  })();

  /* Decorative photo windows: 3 panes that shuffle through the photos */
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var strip = h("div", { class: "photo-strip" });
  var panes = [];
  shuffled(photos.map(function (_, i) { return i; })).slice(0, 3).forEach(function (idx, n) {
    var p = photos[idx];
    var img = h("img", { src: p.src, alt: band + " photo" });
    var frame = h("div", { class: "photo-frame" }, img);
    var win = h("section", {
      class: "window photo-window", id: "win-pic" + (n + 1),
      "data-title": photoName(p), "data-icon": "camera", "data-taskbar": "false"
    },
      h("header", { class: "title-bar" }, h("span", { class: "title-text" })),
      h("div", { class: "window-body" }, frame));
    panes.push({ win: win, frame: frame, img: img, idx: idx });
    strip.appendChild(win);
  });
  $("#desktop").appendChild(strip);

  /* ---------- window manager ---------- */
  var z = 10;
  var wins = Array.prototype.slice.call(document.querySelectorAll(".window[data-title]"));
  var taskbar = $("#task-buttons");

  wins.forEach(function (win) {
    var bar = $(".title-bar", win);
    var title = win.getAttribute("data-title");
    $(".title-text", win).textContent = title;
    bar.insertBefore(icon(win.getAttribute("data-icon")), bar.firstChild);
    bar.appendChild(h("div", { class: "title-controls" },
      h("button", { class: "btn-min", type: "button", "aria-label": "Minimise", onclick: function (e) { e.stopPropagation(); minimise(win); } }),
      win.classList.contains("photo-window") ? null :
        h("button", { class: "btn-max", type: "button", "aria-label": "Maximise", onclick: function (e) { e.stopPropagation(); win.classList.toggle("maximized"); } }),
      h("button", { class: "btn-close", type: "button", "aria-label": "Close", onclick: function (e) { e.stopPropagation(); closeWindow(win); } })));

    if (win.getAttribute("data-taskbar") !== "false") {
      win._task = h("button", { class: "task-button", type: "button", title: title, onclick: function () {
        if (win.classList.contains("active") && !win.classList.contains("closed")) minimise(win);
        else openWindow(win.id);
      } }, icon(win.getAttribute("data-icon")), h("span", { text: title }));
    }
    if (win.getAttribute("data-start-closed") === "true") win.classList.add("closed");
    else if (win._task) taskbar.appendChild(win._task);

    win.addEventListener("pointerdown", function () { focusWindow(win); pin(win); });
    win.addEventListener("pointerenter", function () { win._hover = true; });
    win.addEventListener("pointerleave", function () { win._hover = false; });
    bar.addEventListener("dblclick", function () { if (!isMobile() && !win.classList.contains("photo-window")) win.classList.toggle("maximized"); });
    makeDraggable(win, bar);
  });

  function focusWindow(win) {
    wins.forEach(function (w) {
      w.classList.remove("active");
      if (w._task) w._task.classList.remove("active");
    });
    win.classList.add("active");
    win.style.zIndex = ++z;
    if (win._task) win._task.classList.add("active");
  }
  function openWindow(id) {
    var win = document.getElementById(id);
    if (!win) return;
    var wasClosed = win.classList.contains("closed");
    win.classList.remove("closed");
    if (win._task && !win._task.parentNode) taskbar.appendChild(win._task);
    if (wasClosed && !isMobile() && !win._placed) centre(win);
    focusWindow(win);
    pin(win);
    if (isMobile()) win.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function minimise(win) {
    win.classList.add("closed");
    win.classList.remove("active");
    if (win._task) win._task.classList.remove("active");
  }
  function closeWindow(win) {
    if (win._revert) win._revert();   // Display Properties: closing undoes any unsaved preview
    minimise(win);
    if (win._task && win._task.parentNode) win._task.parentNode.removeChild(win._task);
  }

  function makeDraggable(win, handle) {
    var sx, sy, ox, oy, dragging = false;
    handle.addEventListener("pointerdown", function (e) {
      if (isMobile() || win.classList.contains("maximized") || e.target.closest("button")) return;
      dragging = true; win._dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var d = $("#desktop");
      var x = Math.min(Math.max(ox + e.clientX - sx, -win.offsetWidth + 60), d.clientWidth - 60);
      var y = Math.min(Math.max(oy + e.clientY - sy, 0), d.clientHeight - 24);
      win.style.left = x + "px"; win.style.top = y + "px";
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      handle.addEventListener(ev, function () {
        dragging = false; win._dragging = false;
        win._x = win.offsetLeft; win._y = win.offsetTop;
      });
    });
  }

  function place(id, x, y, w) {
    var win = document.getElementById(id);
    if (!win) return null;
    win.style.width = w + "px";
    win.style.left = Math.round(x) + "px";
    win.style.top = Math.round(y) + "px";
    win._placed = true;
    win._x = undefined;
    return win;
  }
  function centre(win) {
    var d = $("#desktop");
    var w = Math.min(Number(win.getAttribute("data-width")) || 560, d.clientWidth - 40);
    win.style.width = w + "px";
    win.style.left = Math.round((d.clientWidth - w) / 2) + "px";
    win.style.top = Math.max(20, Math.round((d.clientHeight - Math.min(win.offsetHeight || 420, d.clientHeight - 40)) / 2)) + "px";
    win.style.maxHeight = (d.clientHeight - 40) + "px";
    win._placed = true;
    win._x = undefined;
  }

  /* ---------- floating windows ----------
     On big screens every window drifts slowly around the desktop and
     bounces off the edges. A window stops while the pointer is over it,
     and stays put once clicked. Clicking empty desktop (or another
     window) lets it drift off again. */
  var FLOAT_SPEED = [10, 24];              // pixels per second, min-max
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pin(win) {
    wins.forEach(function (w) { if (w !== win) unpin(w); });
    win._pinned = true;
  }
  function unpin(win) {
    if (!win._pinned) return;
    win._pinned = false;
    win._x = win.offsetLeft; win._y = win.offsetTop;   // carry on from wherever it was left
  }
  // click on empty desktop = release everything
  document.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".window, .taskbar, .start-menu, .desktop-icon")) return;
    wins.forEach(unpin);
  });

  wins.forEach(function (w) {
    var a = Math.random() * Math.PI * 2;
    var v = FLOAT_SPEED[0] + Math.random() * (FLOAT_SPEED[1] - FLOAT_SPEED[0]);
    w._vx = Math.cos(a) * v; w._vy = Math.sin(a) * v;
  });

  var last = null;
  function drift(t) {
    var dt = last === null ? 0 : Math.min(0.05, (t - last) / 1000);
    last = t;
    if (!isMobile() && !reduceMotion) {
      var d = $("#desktop"), W = d.clientWidth, H = d.clientHeight;
      wins.forEach(function (w) {
        if (w._pinned || w._hover || w._dragging || !w._placed ||
            w.classList.contains("closed") || w.classList.contains("maximized")) return;
        if (w._x === undefined) { w._x = w.offsetLeft; w._y = w.offsetTop; }
        var maxX = Math.max(0, W - w.offsetWidth), maxY = Math.max(0, H - w.offsetHeight);
        w._x += w._vx * dt; w._y += w._vy * dt;
        if (w._x < 0) { w._x = 0; w._vx = Math.abs(w._vx); }
        if (w._x > maxX) { w._x = maxX; w._vx = -Math.abs(w._vx); }
        if (w._y < 0) { w._y = 0; w._vy = Math.abs(w._vy); }
        if (w._y > maxY) { w._y = maxY; w._vy = -Math.abs(w._vy); }
        w.style.left = w._x.toFixed(1) + "px";
        w.style.top = w._y.toFixed(1) + "px";
      });
    }
    requestAnimationFrame(drift);
  }
  requestAnimationFrame(drift);

  /* Initial "messy desk" arrangement for big screens */
  function layout() {
    if (isMobile()) return;
    var d = $("#desktop");
    var W = d.clientWidth, H = d.clientHeight;
    var L = 104;                         // room for the icon column
    var usable = W - L;

    function bottom(w) { return w && !w.classList.contains("closed") ? w.offsetTop + w.offsetHeight : 0; }
    var gap = 18;

    // column A: welcome, then tour dates underneath
    var aX = L + usable * 0.02;
    var welcomeW = Math.min(440, usable * 0.36);
    var welcome = place("win-welcome", aX, H * 0.04, welcomeW);
    var tourW = Math.min(560, usable * 0.44);
    var tw = place("win-tour", aX + usable * 0.03, Math.min(bottom(welcome) + gap, H - 220), tourW);
    tw.style.maxHeight = Math.max(200, H - tw.offsetTop - 16) + "px";

    // column B: links, then demos
    var bX = aX + welcomeW + gap + 6;
    var linksW = Math.min(320, usable * 0.27);
    var lw = place("win-links", bX, H * 0.07, linksW);
    var demosW = Math.min(360, usable * 0.3);
    var dw = place("win-demos", bX + 20, Math.min(bottom(lw) + gap, H - 200), demosW);

    // column C: newsletter top-right
    var newsW = Math.min(320, usable * 0.26);
    var nw = place("win-news", W - newsW - 16, H * 0.03, newsW);

    // photos tucked into the gaps (they overlap a little, on purpose)
    var picW = Math.max(150, Math.min(220, usable * 0.17));
    var cX = Math.max(bX + linksW + gap, W - newsW - 16);
    place("win-pic1", cX + 20, Math.min(bottom(nw) + gap, H - picW - 60), picW);
    place("win-pic2", Math.max(bX + demosW + 40, cX - picW * 0.6), Math.min(bottom(lw) + 10, H - picW * 2 - 40) , picW * 0.85);
    place("win-pic3", Math.min(aX + tourW + 70, W - picW - 20), Math.min(Math.max(bottom(dw), bottom(lw)) + gap, H - picW - 50), picW * 0.8);

    // stacking order: photos underneath, content on top
    ["win-pic3", "win-pic2", "win-pic1", "win-demos", "win-news", "win-tour", "win-links", "win-welcome"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.zIndex = ++z;
    });
    focusWindow(welcome);
  }

  var wasMobile = isMobile();
  layout();
  if (wasMobile) focusWindow($("#win-welcome"));
  window.addEventListener("resize", function () {
    var m = isMobile();
    if (m !== wasMobile) { wasMobile = m; layout(); }
  });

  /* ---------- desktop icons ---------- */
  var iconDefs = [
    { label: band, icon: "computer", win: "win-welcome" },
    { label: "Listen & Follow", icon: "folder", win: "win-links" },
    { label: "Tour Dates", icon: "calendar", win: "win-tour" },
    { label: "Photos", icon: "camera", win: "win-photos" }
  ];
  if (demos.length) iconDefs.splice(3, 0, { label: "Demos", icon: "speaker", win: "win-demos" });
  if (hasNews) iconDefs.push({ label: "Newsletter", icon: "mail", win: "win-news" });
  iconDefs.push({ label: "Colours", icon: "display", win: "win-display" });
  var insta = links.filter(function (l) { return /instagram/i.test(l.label); })[0];
  if (insta) iconDefs.push({ label: "Instagram", icon: "camera", url: insta.url });
  if (SITE.email) iconDefs.push({ label: "Email", icon: "mail", url: "mailto:" + SITE.email });

  var iconBox = $("#icons");
  iconDefs.forEach(function (d) {
    var el = d.url
      ? h("a", assign({ class: "desktop-icon", href: d.url }, external(d.url)), icon(d.icon), h("span", { text: d.label }))
      : h("button", { class: "desktop-icon", type: "button", onclick: function () { openWindow(d.win); } }, icon(d.icon), h("span", { text: d.label }));
    iconBox.appendChild(el);
  });

  /* ---------- start menu ---------- */
  var startBtn = $("#start-button"), menu = $("#start-menu"), items = $(".start-items", menu);
  function item(ic, label, action) {
    var el = typeof action === "string"
      ? h("a", assign({ href: action, role: "menuitem" }, external(action)), icon(ic), label)
      : h("button", { type: "button", role: "menuitem", onclick: function () { toggleMenu(false); action(); } }, icon(ic), label);
    return h("li", null, el);
  }
  items.appendChild(item("computer", "Welcome", function () { openWindow("win-welcome"); }));
  items.appendChild(item("folder", "Listen & Follow", function () { openWindow("win-links"); }));
  items.appendChild(item("calendar", "Tour Dates", function () { openWindow("win-tour"); }));
  if (demos.length) items.appendChild(item("speaker", "Demos", function () { openWindow("win-demos"); }));
  items.appendChild(item("camera", "Photos", function () { openWindow("win-photos"); }));
  if (hasNews) items.appendChild(item("mail", "Newsletter", function () { openWindow("win-news"); }));
  if (links.length) {
    items.appendChild(h("li", null, h("hr")));
    links.slice(0, 4).forEach(function (l) { items.appendChild(item(l.icon, l.label, l.url)); });
  }
  items.appendChild(h("li", null, h("hr")));
  items.appendChild(item("display", "Colour Scheme...", function () { openWindow("win-display"); }));
  items.appendChild(item("power", "Shut Down...", function () { $("#shutdown").hidden = false; }));

  function toggleMenu(open) {
    menu.hidden = !open;
    startBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  startBtn.addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(menu.hidden); });
  document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) toggleMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleMenu(false); });
  $("#shutdown").addEventListener("click", function () { this.hidden = true; });

  /* ---------- photo shuffle ----------
     Every few seconds one of the photo windows swaps to a random photo
     that isn't already on screen. Change the timing in content.js
     (photoChangeSeconds). Pauses while the pointer is over that window. */
  (function () {
    if (photos.length <= panes.length) return;     // nothing spare to swap in
    var every = Math.max(2, Number(SITE.photoChangeSeconds) || 5) * 1000;
    var fade = !reduceMotion;
    var last = -1;

    function swap() {
      var choices = panes.filter(function (p, i) { return i !== last && !p.win._hover && !p.win.classList.contains("closed"); });
      if (!choices.length) return;
      var pane = choices[Math.floor(Math.random() * choices.length)];
      last = panes.indexOf(pane);
      var showing = panes.map(function (p) { return p.idx; });
      var spare = photos.map(function (_, i) { return i; }).filter(function (i) { return showing.indexOf(i) < 0; });
      var idx = spare[Math.floor(Math.random() * spare.length)];
      var next = new Image();
      next.alt = band + " photo";
      next.onload = function () {
        pane.idx = idx;
        $(".title-text", pane.win).textContent = photoName(photos[idx]);
        if (!fade) { pane.frame.replaceChild(next, pane.img); pane.img = next; return; }
        next.className = "photo-next";
        pane.frame.appendChild(next);
        requestAnimationFrame(function () { requestAnimationFrame(function () { next.classList.add("in"); }); });
        setTimeout(function () {
          next.className = "";
          if (pane.img.parentNode) pane.frame.removeChild(pane.img);
          pane.img = next;
        }, 900);
      };
      next.src = photos[idx].src;
    }
    // preload everything quietly so swaps are instant
    photos.forEach(function (p) { var i = new Image(); i.src = p.src; });
    setInterval(swap, every);
  })();

  /* tray button next to the clock */
  var trayBtn = $("#tray-display");
  trayBtn.appendChild(icon("display"));
  trayBtn.addEventListener("click", function () { openWindow("win-display"); });

  /* ---------- clock ---------- */
  function tick() {
    $("#clock").textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 15000);
})();
