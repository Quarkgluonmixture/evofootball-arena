# R8 — THE DEBT-DISCHARGE SLICE (ruling #312 item 3)

Three named doors, one commit, **zero behaviour change**: one type union, one
comment, one test file. Nothing else was opened.

| # | the door | where it was named | what landed |
|---|---|---|---|
| (i) | the `League['matchFlags']` Pick union does not NAME the BK laws | [`BK-ENTRY-RUNG.md`](BK-ENTRY-RUNG.md) §COMMANDER CORRECTIONS item 3 (ruling #310) | `'bkFacingLaw' \| 'bkContactLaw'` added to the key union — **type-level only** |
| (ii) | the anti-pinball property rests on ONE line, unmarked | [`BK-T1-CONTACT-LAW.md`](BK-T1-CONTACT-LAW.md) §COMMANDER CORRECTIONS item 2 (ruling #308) | the anchor comment at the `ball.lastTouch` exclusion — **comment only** |
| (iii) | the RB/RB-2 bbox invariance lived in `/tmp` | [`RB2-OFFICIALS-ROUNDING.md`](RB2-OFFICIALS-ROUNDING.md) §5 + §COMMANDER CORRECTIONS item 2 (ruling #312) | `tests/render3dGeometry.test.ts` — **tests only** |

Files touched: `src/sim/League.ts` (1 line), `src/sim/Match.ts` (comment),
`tests/bkPlaytestEntry.test.ts` (+ the compile-time pin for (i)),
`tests/render3dGeometry.test.ts` (new), this doc.

## (i) matchFlags NAMING — the receipt is the COMPILER

A `Pick<…>` key union **emits no JavaScript**. Claimed, and proven twice.

**THE COMPILE-TIME RECEIPT (the door was really shut).** The pin was written
FIRST and `npm run typecheck` was run BEFORE the widening — the failure, verbatim (tsc emits
it on ONE line; wrapped here only to fit the page, no character changed):

```
tests/bkPlaytestEntry.test.ts(104,7): error TS2353: Object literal may only specify known
properties, and 'bkFacingLaw' does not exist in type 'Partial<Pick<MatchConfig,
"edsTouchCost" | "edsPerceivedDefence" | "edsPerceivedChoice" | "edsValueAxis" |
"edsAwareness" | "traceChoice" | "c5Hold" | "c5TouchFork" | ... 21 more ... | "pcNCover">>'.
```

That is exactly #310 §CORR 3's prediction ("a future literal-typed writer would get a tsc
error") and the mutant M3 class. After the one-line widening: `npm run typecheck` →
`tsc --noEmit`, **no output, exit 0**, and the pin
(*"a literal-typed `League['matchFlags']` may NAME both BK laws"*) is green. The runtime
spread path was never broken and is unchanged.

**THE NON-EMISSION RECEIPT.** `esbuild` transform of the file at `HEAD` vs the file now
(both copied to the same directory so module-format detection is like-for-like):

```
League.ts: IDENTICAL bytes=58099 sha256=b2b5ae9b9680804314d3f3788fb34f6775972983f2b9ef94f6527a7ab2e8be71
```

## (ii) THE ANTI-PINBALL ANCHOR — comment only

Planted at `if (p === ball.lastTouch) continue;` inside `bkCollectBodyStrikes`
(strike-claim collection). It carries the three load-bearing facts §CORR 2 asked for:
the **no-re-strike / anti-buzz property, measured 818 → 46 strikes/match**, rests on this
line; the exclusion is read at **claim collection** while the strike is applied **later**
at resolution (`bkApplyBodyStrike` assigns `ball.lastTouch = p`); therefore **any future
seam that reassigns `ball.lastTouch` between the two reopens the buzz — silently, with a
green suite**.

⚠ **One honesty note is in the comment and is a deviation from the ruling's phrasing.**
BK-T1 §1 measured the 818/46 pair by toggling the **CLOSING condition**, not this line. So
the comment states that the number *sizes* the buzz and does not apportion it between the
two guards (the closing test kills the two-adjacent-cooling-bodies buzz; this line kills
the same-body re-strike buzz), with §CORR 2 named as the ruling of record on what this line
carries. The ruling's own numbers are quoted, not restated softer.

**THE NON-EMISSION RECEIPT** (same method as (i)):

```
Match.ts: IDENTICAL bytes=157844 sha256=b2c48c4ad2a58db3b696f032babf39fcd61a68586cb245b67833bff3ededc8e3
```

## (iii) THE GEOMETRY-GUARD PIN — tests only

`tests/render3dGeometry.test.ts`, **52 checks, green**. It imports the shipped exported
primitives (`barrel` / `limb` / `shoe` / `TORSO_RADIAL_SEG` / `LIMB_RADIAL_SEG` /
`TORSO_BASE`) and covers **23 rounded parts** — 8 player rows (RB §1) + 15 official rows
(RB-2 §1/§3.4: 5 referee + 4 linesman + 6 coach). Per part:

1. **BBOX INVARIANCE** — `computeBoundingBox()` size vs the **hardcoded replaced-box
   dimension table**, within **1e-6** (RB/RB-2's own tolerance). The table is hardcoded
   because the pre-RB geometry no longer exists in src: its only truth sources are the two
   landing docs' tables, and the test says so in a header comment pointing at both.
2. **THE CALL SITE** — the shipped construction expression occurs in its file **exactly
   once**, so the table cannot drift away from the code and still pass (1). (Canon idiom:
   *"a src-extracted constant pins its extraction to the NAMED call site — anchored match +
   line receipt — never first-occurrence"*, home BK-C0 §CORR 1.)
3. **NO `BoxGeometry`** anywhere in the four model files; the flat pieces are exempt **by
   name** and separately pinned as `PlaneGeometry` (referee card `0.2 × 0.28`, flag cloth
   `0.26 × 0.2`, coach jacket panel `0.2 × 0.7`, player number `0.52 × 0.58`). Plus:
   `TORSO_BASE` still is `0.72 × 0.86 × 0.54`; the officials still import the player's
   primitives (one species); no anatomy MESH is scaled — ⚠ scoped to the named parts, NOT a
   blanket `.scale.set(` ban, because the coach's nameplate SPRITE is legitimately scaled.

**THE GUARD BITES — two mutants, both caught, tree restored by `git checkout` each time:**

| mutant | result |
|---|---|
| referee shoe `shoe(0.30, 0.15, 0.38)` → `(0.30, 0.15, 0.40)` | ✗ `RefereeModel.ts builds shoe at exactly ONE call site with these arguments` |
| referee grounding blob `CircleGeometry` → `BoxGeometry` | ✗ `NO 'BoxGeometry' anywhere in the anatomy of the four model files` |

**THE TOLERANCE DOES NO HIDDEN WORK, MEASURED.** Re-run at `TOL = 1e-8`: **17 of the 23 rows
FAIL** (counted, then the file was restored and re-run green). So the passing margin is genuinely in the float32-rounding band RB-2 §CORR 1 named
(max 5.72e-8 against nominal dimensions, float32 eps ~1.2e-7) — 1e-6 is one order above the
worst real deviation and orders below any real resize.

## RECEIPTS OF RECORD

- `npm run typecheck` → `tsc --noEmit`, **no output, exit 0. CLEAN.**
- `npx vitest run tests/render3dGeometry.test.ts tests/bkPlaytestEntry.test.ts
  tests/bkFacingLaw.test.ts tests/bkContactLaw.test.ts` → **4 files, 134 tests, all
  passed** (10.53s). `tests/render3d.test.ts` also re-run as the nearest neighbour of the
  new file: **62 passed**.
- `npx tsx scripts/fingerprint.ts`:

```
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

**IDENTICAL** to the fingerprint of record. Items (i)/(ii) are non-emitting by
construction and proven so byte-for-byte above; (iii) is tests-only.

- **CONSUMPTION: zero seeds, zero stats.** No sim was walked for evidence; the
  suites' own fixtures are their own (seed 12505900, inside the block #310 consumed whole).

## VISION / REALITY (the #201 standing rule)

- **VISION**: no mechanic, no constant, no chooser, no pricing — three debts named by
  earlier rulings, discharged as documentation and guards. The world is byte-identical.
  VISION-neutral — PASS.
- **REALITY**: nothing was claimed about football here, so there is nothing for the
  mechanism oracle to answer. What the slice DOES do for reality is protect two earlier
  answers from silent decay: the ball no longer buzzing inside a cooling body ((ii) names
  the line that holds it), and 人是圆的 ((iii) makes a box impossible to reintroduce
  quietly).

## HONEST GAPS

- **(iii) rebuilds the geometry from the shipped primitives with the shipped arguments; it
  does not instantiate `RefereeModel` / `LinesmanModel` / `CoachModel` / `PlayerModel`.**
  The call-site occurrence pin is what closes the gap between "these arguments" and "the
  arguments the constructor passes" — a text pin, not a runtime one. A model constructor in
  a node test would need its materials/sprite path to be headless-safe; not attempted.
- **The `as THREE.CapsuleGeometry` cast on `shoe()`** (#312 §CORR 3) is untouched — it was
  named for "the next render3d touch", and this slice touches no render3d src.
- **The parts NOT in the table are not guarded**: heads, hair, eyes, blobs, rings, the flag
  stick, the nameplate. They were already round or flat before RB and RB-2, so they carry no
  replaced-box invariant to pin.
- **No perf claim.** Unchanged from RB-2: +22,568 cumulative triangles is still an assertion
  from counts, not a frame-time measurement.
