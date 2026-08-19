# RB-2 — OFFICIALS / COACHES ROUNDING (landing doc)

> **Authority**: ruling **#311 item 2 (R7)**, named at **#305 item 2** (the
> honest gap RB itself recorded). **Scope**: `src/render3d/**` only — zero sim,
> zero AI, zero 2D. **The debt, verbatim from
> [`RB-ROUND-BODY-SLICE.md`](RB-ROUND-BODY-SLICE.md) §6**: "The referee,
> linesmen and touchline coaches are the same box-person skeleton in their own
> files (`RefereeModel.ts`, `LinesmanModel.ts`, `CoachModel.ts`) and are
> **still boxes**".

## 1. WHAT LANDED

The men giving the decisions were a different species from the men taking them.
RB rounded the players; RB-2 rounds the touchline with **the player's own
primitives** — `barrel()`, `limb()` and `shoe()` are now **exported** from
`PlayerModel.ts` and reused by all three official models. One lathe, one
segment budget, one corner rule for every procedural human on the pitch.

### Referee (`RefereeModel.ts`)

| part | before (BoxGeometry) | after |
|---|---|---|
| torso | 0.78 × 0.95 × 0.44 box | `barrel(0.39, 0.475, corner 0.20, radial 12)`, z ×0.44/0.78 |
| collar | 0.8 × 0.12 × 0.46 box | `CylinderGeometry(0.4, 0.4, 0.12, 12)`, z ×0.46/0.8 |
| arm (×2) | 0.26 × 0.74 × 0.26 box | `limb(0.13, 0.74)` |
| leg (×2) | 0.30 × 1.0 × 0.32 box | `limb(0.15, 1.0, zk 0.32/0.30)` |
| shoe (×2) | 0.30 × 0.15 × 0.38 box | `shoe(0.30, 0.15, 0.38)` — capsule along **+z**, widened on x |
| head / card / blob | (already round or flat) | **unchanged** |

### Linesman (`LinesmanModel.ts`)

| part | before (BoxGeometry) | after |
|---|---|---|
| torso | 0.72 × 0.92 × 0.42 box | `barrel(0.36, 0.46, corner 0.20, radial 12)`, z ×0.42/0.72 |
| collar | 0.74 × 0.11 × 0.44 box | `CylinderGeometry(0.37, 0.37, 0.11, 12)`, z ×0.44/0.74 |
| arm (×2) | 0.25 × 0.72 × 0.25 box | `limb(0.125, 0.72)` |
| leg (×2) | 0.28 × 1.0 × 0.30 box | `limb(0.14, 1.0, zk 0.30/0.28)` |
| head / flag stick / flag cloth / blob | (already round or flat) | **unchanged** |

He has no shoes — that was true before RB-2 and still is.

### Coach (`CoachModel.ts`)

| part | before (BoxGeometry) | after |
|---|---|---|
| torso | 0.82 × 0.95 × 0.46 box | `barrel(0.41, 0.475, corner 0.20, radial 12)`, z ×0.46/0.82 |
| scarf band | 0.6 × 0.16 × 0.5 box | `CylinderGeometry(0.3, 0.3, 0.16, 12)`, z ×0.5/0.6 |
| scarf tail | 0.16 × 0.5 × 0.06 box | `limb(0.08, 0.5, zk 0.06/0.16)` — a flat strip with rounded ends |
| arm (×2) | 0.28 × 0.78 × 0.28 box | `limb(0.14, 0.78)` |
| leg (×2) | 0.32 × 1.06 × 0.34 box | `limb(0.16, 1.06, zk 0.34/0.32)` |
| shoe (×2) | 0.32 × 0.16 × 0.42 box | `shoe(0.32, 0.16, 0.42)` |
| head / open-jacket shirt panel / blob | (already round or flat) | **unchanged** |

**The corner radius is the player's 0.20 on all three chests, not a capsule.**
That is RB's rejected-experiment lesson inherited rather than re-learned: with
corner = half-width the chest reads as a *ball* and the shoulder line
disappears. 0.20 < every chest half-width here (0.36 / 0.39 / 0.41), so all
three keep a shoulder line and a hem while the silhouette is round from every
angle.

**The scarf tail stays cloth.** It is the one part where "round it" would have
been wrong: a lathe at full depth would turn a hanging strip into a spindle.
It gets `limb()` at the old 0.06 depth — flattened, ends rounded off. The
open-jacket shirt panel is a `PlaneGeometry` and stays flat.

## 2. WHAT WAS **NOT** ALLOWED TO MOVE (RB's invariants, inherited)

1. **Every part occupies exactly the same bounding box as the box it
   replaces** — 15 parts, measured, see §3.4.
2. **Non-circular cross-sections are baked into the GEOMETRY** (`.scale(1,1,k)`
   at build time), never onto a mesh. No `mesh.scale` was added or changed in
   any of the three files; `HUMAN_MODEL_SCALE` still arrives through the single
   `bodyScale` group exactly as F1 built it.
3. **Every pivot and every translate-to-pivot offset is byte-identical**: the
   shoulder groups (ref ±0.44, linesman ±0.41, coach ±0.48, all at y = 1.0),
   the leg groups (ref ±0.21, linesman ±0.20, both at y = 1.06), the coach's
   directly-placed legs/shoes, `lean.position.y = 1.06`, the arm-geometry
   translates (−0.32 / −0.31 / −0.34), the leg translates (−0.5 / −0.5 /
   −0.53), the shoe positions (−1.0, 0.07 / 0.07, 0.08), torso y (0.62 / 0.6 /
   0.62), collar y (1.04 / 1.01), head y (1.34 / 1.30 / 1.34), scarf placements
   and the card at (0, −0.78, 0.02). Not one line of `update()` in any of the
   three files was touched, so the diagonal patrol, the offside line, the gait,
   the raised card/flag arm and the coach's crossed-arms / celebration /
   despair poses are what they were.
4. **The player did not move either.** `PlayerModel.ts` changed only in
   visibility and hoisting: `barrel` gained `export`; the `limb` closure inside
   `sharedGeo()` was lifted to a module-level exported function with the same
   body; the boot's inline capsule expression became `shoe(0.32, 0.18, 0.46)`.
   Proved byte-level, not asserted — see §3.5.
5. Materials, colours, castShadow flags, the blobs, the flag, the card, the
   nameplate sprite: unchanged.

## 3. RECEIPTS

Canon, copied from [`CANON.md`](CANON.md): **doc-prose fidelity** — VERBATIM:
"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a
gated face"; **clean-tree builds** — a build of record runs on a CLEAN tree at
a named commit (paraphrase-marked in CANON.md; home: PC-ENTRY-RUNG.md
§COMMANDER CORRECTIONS item 4).

### 3.1 Fingerprint A/B — a render change cannot move the sim

BEFORE (at HEAD `ef95eab`, clean tree), `npx tsx scripts/fingerprint.ts`:

```
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

AFTER (this slice applied):

```
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

**IDENTICAL**, and equal to the fingerprint of record
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

### 3.2 typecheck / build

- `npm run typecheck` → `tsc --noEmit`, no output, exit 0. CLEAN.
- `npm run build` → `✓ built in 4.20s`. CLEAN (the pre-existing ">500 kB
  chunk" advisory is unchanged and not from this slice).

### 3.3 the 3D visual suite

`npm run debug:visual3d` against `npx vite --port 5199` (the browser binary
installed in RB is still there), final line:

```
ALL 3D CHECKS PASSED (52 total)
```

including `✓ no console/page errors`. RB quoted 51 — the suite has gained one
check since; the number is the run's own, not RB's carried forward.

### 3.4 per-part bounding-box invariance (the RB discipline)

**How verified**: a throwaway script (`/tmp/rb2-verify.ts`, NOT committed)
imports the real exported primitives from `src/render3d/PlayerModel.ts`,
rebuilds each replaced `BoxGeometry` with its original arguments, and compares
`computeBoundingBox()` sizes of the OLD box against the NEW geometry — float32
buffer against float32 buffer, the same measurement on both sides. Every part
in the three tables of §1 is covered (15 rows), each row's multiplicity
included in the triangle columns.

```
BBOX FAILURES: 0   MAX DEVIATION: 2.98e-8 (float32 eps ~1.2e-7)
```

Thirteen of the fifteen rows report `dev=0.0e+0` — bit-identical extents. Two
rows (`referee/leg`, `linesman/torso`) report `dev=3.0e-8`, one float32 rounding
step on the **depth** axis only, where the depth is produced by a
`.scale(1, 1, k)` with a non-terminating ratio (0.32/0.30 and 0.42/0.72). The
tolerance is stated so it can never do hidden work: at 1e-6 nothing else could
have passed, and the worst row is 4× below float32 epsilon.

Consequence: `HUMAN_MODEL_SCALE = 0.64` (F1) and the officials' F2 toy
proportions are numerically untouched — **no constant was edited in any of the
three files**.

### 3.5 the player is byte-unchanged by the hoist

A second throwaway check (`/tmp/rb2-player-unchanged.ts`, NOT committed)
compares the full `position` and `index` buffers of the hoisted helpers against
the exact expressions they replaced:

```
player foot  shoe() === old inline expression : true
player sock  limb() === old inline closure    : true
```

### 3.6 triangles per figure

From the real geometries (index count ÷ 3), whole figures including the
unchanged head / blob / flag / card / panel:

| figure | before | after | Δ |
|---|---|---|---|
| referee | 328 | 1208 | +880 |
| linesman | 328 | 1008 | +680 |
| coach | 340 | 1336 | +996 |
| **touchline total** (1 ref + 2 linesmen + 2 coaches) | **1,664** | **5,896** | **+4,232** |

Officials are far fewer bodies than players, so the whole touchline costs less
than a quarter of RB's player bill (RB: 7,128 → 25,464 across 12 players,
+18,336). Draw calls are unchanged in count; geometries are still per-figure
(the officials never shared the player cache — that is a deliberate dispose-path
decision from Phase 66/75, untouched here).

### 3.7 screenshots

Same figures, same camera, same lighting; the BEFORE was captured by putting
the three files back to their `HEAD` content, shooting, then restoring the new
files from **/tmp byte copies** (hashes re-verified equal after the restore) —
no `git checkout` on an uncommitted tree.

- [`rb-round-body/rb2-before-officials.png`](rb-round-body/rb2-before-officials.png)
  — referee · linesman · coach, box-person.
- [`rb-round-body/rb2-after-officials.png`](rb-round-body/rb2-after-officials.png)
  — the same three, round.

Per the repo's standing rule, headless capture is an aid — **the user's browser
is the final judge**.

## 4. VISION / REALITY (the #201 standing rule)

- **VISION**: presentation-fidelity only. No behaviour, no pricing, no
  constant any chooser reads; the sim's fingerprint is unmoved and no file
  outside `src/render3d/**` was opened. VISION-neutral — PASS.
- **REALITY**: 人是圆的, and a referee is a person. The mechanism oracle
  question here is not about football law but about the world's own claim: the
  officials and the players are the SAME species of body in this world (F1 made
  that explicit by putting them all on one shrink anchor, `HUMAN_MODEL_SCALE`).
  A round team beside a boxed referee contradicted a claim the code already
  made. PASS.

## 5. HONEST GAPS

- **No perf measurement.** +4,232 triangles across the touchline is asserted as
  negligible from the counts, **not** measured as frame time — the same gap RB
  left open, and it now compounds (RB +18,336, RB-2 +4,232 → +22,568 total on a
  full pitch). Still an assertion.
- **The crowd (`CrowdSystem.ts`) is still boxes** and is deliberately out of
  scope: it is instanced, so its triangle story is per-instance × thousands,
  not per-figure. Rounding it needs its own perf argument, not this one.
- **No automated pin guards this rounding.** `tests/render3d.test.ts` covers
  the officials' PURE functions (`refereeTarget`, `defensiveLineX`,
  `linesmanTargetX`) and never their geometry, so nothing in the suite would
  fail if a future edit put a box back. The bounding-box invariance was
  verified by a throwaway script, not by a committed test. If the commander
  wants that class of drift caught, the ask is a `render3d.test.ts` case that
  asserts each figure's per-part bounding boxes against the table in §1 — one
  small src-adjacent test, not attempted here (this step's scope was the
  rounding).
- **The head is still a plain sphere on all three** — same as the players
  before F2's eyes/hair went on. The officials have no eyes and no hair cap, so
  from the broadcast camera they read as round-but-faceless. Deliberately not
  expanded: that is a new feature, not the named debt.

---

## §COMMANDER CORRECTIONS OF RECORD (ruling #312, 2026-08-19)

1. **The "13/15 parts dev = 0.0" phrasing is COMPARISON-BASIS DEPENDENT** (verify LOW 2):
   against nominal dimensions all 15 are nonzero (max 5.72e-8) — both readings are
   sub-float32-eps, so the invariant genuinely holds; the phrasing must not be read as
   bit-exactness.
2. **The committed-guard gap** (verify LOW 1, self-disclosed §5): the bbox-invariance
   evidence lived in /tmp — a future edit could reintroduce a box with a green suite.
   DISCHARGED IN R8 (#312 item 3): a committed geometry-guard pin joins the debt slice.
3. The `as THREE.CapsuleGeometry` cast on shoe() papers over post-mutation parameters
   (verify LOW 5) — cosmetic, noted for the next render3d touch.
4. Perf remains count-asserted (+4,232 touchline; +22,568 cumulative with RB) — the
   radial counts stay one-line tunable; the perf menu holds (#305 item 2 lineage).
