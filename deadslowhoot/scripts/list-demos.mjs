// Makes the list of audio files in the demos folder, so the lucky dip
// player knows what it can pick from. (A website can't look inside a
// folder by itself.) Run automatically by the GitHub Action on every change.
//
//   node scripts/list-demos.mjs

import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIR = path.join(ROOT, "demos");
const OUT = path.join(ROOT, "data", "demos.js");
const AUDIO = /\.(wav|mp3|m4a|aac|ogg|oga|flac)$/i;

const files = (await readdir(DIR).catch(() => []))
  .filter((f) => AUDIO.test(f) && !f.startsWith("."))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// "taller-trees_demo2.wav" → "taller trees demo2"
const title = (f) => f.replace(AUDIO, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

const list = files.map((f) => ({ file: "demos/" + encodeURIComponent(f), title: title(f) }));
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT,
  "// Generated automatically by scripts/list-demos.mjs — don't edit by hand.\n" +
  "window.DEMO_FILES = " + JSON.stringify(list, null, 2) + ";\n");
console.log(`Found ${list.length} demo file(s).`);
