// Fetches the newest post from the band's Substack (via its public RSS feed)
// and writes data/substack.js for the Newsletter window.
//
// The Substack address is read from content.js, so there's only one place to
// set it. No token or account needed. Run automatically by the GitHub Action.
//
//   node scripts/sync-substack.mjs

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "data", "substack.js");

async function readSubstackUrl() {
  const sandbox = { window: {} };
  vm.runInNewContext(await readFile(path.join(ROOT, "content.js"), "utf8"), sandbox);
  return ((sandbox.window.SITE && sandbox.window.SITE.substack) || "").trim().replace(/\/+$/, "");
}

// --- tiny RSS helpers (Substack's feed is simple and consistent) ---
function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
}
function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function textFromHtml(html) {
  return decode(
    html
      .replace(/<(script|style|figure|figcaption)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<\/(p|h\d|li|blockquote)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  ).replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}
function excerpt(text, max = 320) {
  const flat = text.replace(/\n+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).replace(/[,;:.\s]+$/, "") + "…";
}

async function main() {
  const base = await readSubstackUrl();
  if (!base) {
    console.log("No substack address in content.js — skipping newsletter sync.");
    return;
  }
  const res = await fetch(`${base}/feed`, { headers: { "User-Agent": "DeadSlowHootSite/1.0 (+GitHub Actions)" } });
  if (!res.ok) throw new Error(`Couldn't fetch ${base}/feed (${res.status})`);
  const xml = await res.text();
  const item = (xml.match(/<item>([\s\S]*?)<\/item>/i) || [])[1];
  if (!item) { console.log("The feed has no posts yet."); return; }

  const title = decode(tag(item, "title"));
  const url = decode(tag(item, "link"));
  const pub = tag(item, "pubDate");
  const subtitle = textFromHtml(tag(item, "description"));
  const body = textFromHtml(tag(item, "content:encoded"));
  const enclosure = (item.match(/<enclosure[^>]*url="([^"]+)"/i) || [])[1] || "";

  // Subtitle first (if there is one), then the opening of the post.
  const text = subtitle && !body.startsWith(subtitle) ? `${subtitle} — ${body}` : body || subtitle;
  const date = pub ? new Date(pub).toISOString().slice(0, 10) : "";

  const post = { title, url, date, excerpt: excerpt(text), image: decode(enclosure) };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT,
    "// Generated automatically by scripts/sync-substack.mjs — don't edit by hand.\n" +
    "window.SUBSTACK_POST = " + JSON.stringify(post, null, 2) + ";\n");
  console.log(`Latest post: "${title}" (${date})`);
}

main().catch((err) => {
  console.error(err.message);
  console.error("::warning::Substack sync failed — the site was published with the last saved post.");
  process.exit(0);
});
