/* ==========================================================================
   Colour schemes (Display Properties → Appearance)
   Loaded in <head> so a visitor's saved choice applies before the page
   draws. To add a scheme, copy a line: face = window grey, title = active
   title bar. Anything else (text, field…) is optional and worked out
   automatically if left out.
   ========================================================================== */
window.SCHEMES = [
  { name: "Windows Standard", face: "#c0c0c0", title: "#000080" },
  { name: "Teal",             face: "#c0c0c0", title: "#008080" },
  { name: "Brick",            face: "#c2bfa5", title: "#800000" },
  { name: "Desert",           face: "#d5ccbb", title: "#8a6a3a" },
  { name: "Eggplant",         face: "#a8a0b8", title: "#4a2e5c" },
  { name: "Lilac",            face: "#aea8d9", title: "#5a4eb1" },
  { name: "Marine",           face: "#88c0b8", title: "#004a60" },
  { name: "Plum",             face: "#a89890", title: "#483848" },
  { name: "Pumpkin",          face: "#f0c070", title: "#803000" },
  { name: "Rainy Day",        face: "#8399b1", title: "#3f5572" },
  { name: "Rose",             face: "#cfafb7", title: "#9f4f68" },
  { name: "Spruce",           face: "#a2c8a9", title: "#2f5f38" },
  { name: "Wheat",            face: "#d7d79c", title: "#707000" },
  { name: "Night Owl (dark)", face: "#34343e", title: "#6a2c91", text: "#e6e6ee", field: "#1c1c22",
    hilite: "#5a5a68", light: "#46464f", shadow: "#202026", dark: "#0a0a0c", link: "#9ab8ff", linkVisited: "#c9a2ff",
    titleInactive: "#4c4c58", titleInactiveText: "#b8b8c4" },
  { name: "High Contrast Black", face: "#000000", title: "#800080", text: "#ffffff", field: "#000000",
    hilite: "#ffffff", light: "#808080", shadow: "#808080", dark: "#ffffff", link: "#ffff00", linkVisited: "#00ffff",
    titleInactive: "#404040", titleInactiveText: "#ffffff" },
];
window.DEFAULT_SCHEME = "Night Owl (dark)";

(function () {
  function hex(c) { c = c.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(c.substr(i, 2), 16); }); }
  function css(a) { return "#" + a.map(function (v) { return ("0" + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2); }).join(""); }
  function mix(a, b, t) { a = hex(a); b = hex(b); return css(a.map(function (v, i) { return v + (b[i] - v) * t; })); }
  function lum(c) { c = hex(c); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }

  function find(name) {
    var list = window.SCHEMES;
    for (var i = 0; i < list.length; i++) if (list[i].name === name) return list[i];
    return list[0];
  }

  window.applyScheme = function (name) {
    var s = find(name);
    var dark = lum(s.face) < 0.4;
    var text = s.text || (dark ? "#ffffff" : "#000000");
    var v = {
      "--face": s.face,
      "--hilite": s.hilite || "#ffffff",
      "--light": s.light || mix(s.face, "#ffffff", 0.5),
      "--shadow": s.shadow || mix(s.face, "#000000", 0.4),
      "--dark": s.dark || "#0a0a0a",
      "--title": s.title,
      "--title-light": mix(s.title, "#ffffff", 0.45),
      "--title-inactive": s.titleInactive || mix(s.face, "#000000", 0.35),
      "--title-inactive-text": s.titleInactiveText || mix(s.face, "#ffffff", 0.5),
      "--title-text": "#ffffff",
      "--select": s.select || s.title,
      "--select-text": "#ffffff",
      "--text": text,
      "--muted": s.muted || mix(text, s.face, 0.45),
      "--field": s.field || "#ffffff",
      "--field-text": s.fieldText || (s.field ? text : "#000000"),
      "--link": s.link || "#0000ee",
      "--link-visited": s.linkVisited || "#551a8b"
    };
    var root = document.documentElement.style;
    Object.keys(v).forEach(function (k) { root.setProperty(k, v[k]); });
    document.documentElement.setAttribute("data-scheme", s.name);
    return s.name;
  };

  window.saveScheme = function (name) {
    try { localStorage.setItem("dsh-scheme", name); } catch (e) { /* private mode etc. — just don't remember */ }
  };

  var saved = null;
  try { saved = localStorage.getItem("dsh-scheme"); } catch (e) {}
  window.CURRENT_SCHEME = window.applyScheme(saved || window.DEFAULT_SCHEME);
})();
