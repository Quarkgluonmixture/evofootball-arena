#!/usr/bin/env node
/**
 * THE RECONSTRUCTION RECEIPT — COMMANDER RULING #350 item 2's cmp-grade gate.
 *
 * Re-derives the PRE-SPLIT `docs/VISION.md` byte stream from three artifacts and
 * nothing else:
 *
 *   1. the post-split `docs/VISION.md`            (the KEEP half)
 *   2. `docs/VISION-STATUS-LEDGER.md`             (the MOVE half, verbatim blocks)
 *   3. `docs/world-model/VISION-SPLIT-PLAN.md` §R (the line map — INDICES ONLY,
 *                                                  it carries no content bytes)
 *
 * and compares the result byte-for-byte against `git show <BASE>:docs/VISION.md`
 * via cmp(1). The map holds only line indices and newline flags, so a PASS proves
 * every byte of the gold standard survived the split inside one of the two files.
 *
 * Usage:  node scripts/audits/vision-split-reconstruct.mjs [BASE_COMMIT]
 *         (BASE_COMMIT defaults to 633fe42, the pre-split HEAD)
 *
 * Exit 0 = PASS. Any non-zero exit = the split is unverifiable; do not trust it.
 * No dependencies. Reads only; writes two files under the OS temp dir.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const NL = "\n";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const BASE = process.argv[2] || "633fe42";
const VISION = path.join(ROOT, "docs", "VISION.md");
const LEDGER = path.join(ROOT, "docs", "VISION-STATUS-LEDGER.md");
const PLAN = path.join(ROOT, "docs", "world-model", "VISION-SPLIT-PLAN.md");

const die = (msg) => { console.error("FAIL: " + msg); process.exit(1); };
const readLines = (p) => {
  const raw = fs.readFileSync(p, "utf8");
  if (!raw.endsWith(NL)) die(p + " does not end with a newline");
  return raw.slice(0, -1).split(NL);
};

/** Pull the delimited region between two marker lines. */
function region(lines, beginMarker, endMarker, what) {
  const b = lines.indexOf(beginMarker), e = lines.indexOf(endMarker);
  if (b < 0 || e < 0 || e <= b) die("missing/!ordered markers for " + what);
  if (lines.indexOf(beginMarker, b + 1) >= 0) die("duplicate marker for " + what);
  return lines.slice(b + 1, e);
}

// ---- 1. the map (indices only) -------------------------------------------
const planLines = readLines(PLAN);
const mapRegion = region(planLines, "<!-- RECONSTRUCTION-MAP BEGIN -->",
                         "<!-- RECONSTRUCTION-MAP END -->", "the map");
const json = mapRegion.filter((l) => !l.startsWith("```")).join(NL);
let map;
try { map = JSON.parse(json); } catch (e) { die("map is not valid JSON: " + e.message); }
if (!Array.isArray(map.ops) || map.ops.length === 0) die("map has no ops");
for (const op of map.ops) {
  const keys = Object.keys(op).sort().join(",");
  if (keys !== "nl,r" && keys !== "nl,v" && keys !== "l,nl,r") die("op has unexpected keys: " + keys);
  if (op.v && !(Number.isInteger(op.v[0]) && Number.isInteger(op.v[1]))) die("non-integer v range");
  if (JSON.stringify(op).match(/[^\x00-\x7F]/)) die("map carries non-ASCII — it must hold indices, not content");
}

// ---- 2. the ledger's verbatim blocks --------------------------------------
const ledgerLines = readLines(LEDGER);
const blocks = new Map();
for (const l of ledgerLines) {
  const m = l.match(/^<!-- VERBATIM (S\d\d) BEGIN -->$/);
  if (m) blocks.set(m[1], region(ledgerLines, l, `<!-- VERBATIM ${m[1]} END -->`, m[1]));
}
if (blocks.size === 0) die("no verbatim blocks found in the ledger");

// ---- 3. the post-split VISION --------------------------------------------
const visionLines = readLines(VISION);

// ---- 4. re-derive ---------------------------------------------------------
const used = new Set();
let out = "";
for (const op of map.ops) {
  let text;
  if (op.v) {
    const [a, b] = op.v;
    if (a < 1 || b > visionLines.length || b < a) die("v range out of bounds: " + JSON.stringify(op.v));
    text = visionLines.slice(a - 1, b).join(NL);
  } else {
    const blk = blocks.get(op.l);
    if (!blk) die("ledger entry " + op.l + " referenced by the map is missing");
    const [a, b] = op.r;
    if (a !== 1 || b !== blk.length) die("ledger entry " + op.l + " is " + blk.length + " lines, map wants " + a + ".." + b);
    used.add(op.l);
    text = blk.slice(a - 1, b).join(NL);
  }
  out += text + (op.nl ? NL : "");
}
for (const id of blocks.keys()) if (!used.has(id)) die("ledger entry " + id + " is not referenced by the map (orphan)");

// ---- 5. cmp against the pre-split blob ------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vision-split-"));
const gotPath = path.join(tmp, "reconstructed.md");
const wantPath = path.join(tmp, "pre-split.md");
fs.writeFileSync(gotPath, out);
fs.writeFileSync(wantPath, execFileSync("git", ["show", `${BASE}:docs/VISION.md`], { cwd: ROOT, maxBuffer: 1 << 26 }));

const want = fs.readFileSync(wantPath), got = fs.readFileSync(gotPath);
let cmpOut = "";
try {
  execFileSync("cmp", [gotPath, wantPath], { stdio: ["ignore", "pipe", "pipe"] });
  cmpOut = "cmp: no differences";
} catch (e) {
  cmpOut = String(e.stdout || "") + String(e.stderr || "");
  console.error(cmpOut.trim());
  die("reconstruction differs from " + BASE + ":docs/VISION.md");
}

// ---- 6. the receipt -------------------------------------------------------
const pointerRe = /本处的现状快照已移至/;
console.log("VISION SPLIT — RECONSTRUCTION RECEIPT (#350 item 2)");
console.log("  base (pre-split)      : " + BASE + ":docs/VISION.md");
console.log("  ledger entries        : " + blocks.size + " (" + [...blocks.keys()].join(" ") + ")");
console.log("  map ops               : " + map.ops.length +
            " (" + map.ops.filter((o) => o.v).length + " from VISION, " +
            map.ops.filter((o) => o.l).length + " from the ledger)");
console.log("  post-split VISION     : " + visionLines.length + " lines, " + fs.statSync(VISION).size + " bytes");
console.log("  pointer lines added   : " + visionLines.filter((l) => pointerRe.test(l)).length);
console.log("  pre-split VISION      : " + want.toString("utf8").slice(0, -1).split(NL).length + " lines, " + want.length + " bytes");
console.log("  reconstructed         : " + got.toString("utf8").slice(0, -1).split(NL).length + " lines, " + got.length + " bytes");
console.log("  " + cmpOut);
console.log("  RESULT                : PASS — byte-identical reconstruction");
fs.rmSync(tmp, { recursive: true, force: true });
