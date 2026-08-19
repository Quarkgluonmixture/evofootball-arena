# RB — THE ROUND-BODY PRESENTATION SLICE (landing doc)

> **Authority**: PROGRAMME ⭐QUEUE item ① (ruling #303 item 3(iii), re-queued at
> #304 item 4). **Scope**: `src/render3d/**` only — zero sim, zero AI, zero 2D.
> **The directive, verbatim (the user, #303 session)**: 「我觉得球员现在方形身体
> 一有点违和,也不符合实际模型,应该变成身体变圆(类似于现实)」.

## 1. WHAT LANDED

Every anatomy **box** on the 3D mannequin became a **body of revolution**. No
vertical edge survives anywhere on a player.

| part | before (BoxGeometry) | after |
|---|---|---|
| torso | 0.72 × 0.86 × 0.54 box | `barrel(0.36, 0.43, corner 0.20, radial 12)`, z-squashed ×0.75 |
| hips | 0.68 × 0.34 × 0.5 box | `barrel(0.34, 0.17, corner 0.15, radial 12)`, z-squashed ×0.735 |
| sleeve (upper arm) | 0.30 × 0.36 × 0.30 box | `limb(0.15, 0.36)` — barrel, corner 0.7 × half-width |
| forearm | 0.26 × 0.44 × 0.26 box | `limb(0.13, 0.44)` |
| thigh | 0.34 × 0.55 × 0.34 box | `limb(0.17, 0.55)` |
| sock (shin) | 0.30 × 0.42 × 0.32 box | `limb(0.15, 0.42, zk 1.0667)` |
| sock band | 0.32 × 0.10 × 0.34 box | `CylinderGeometry(0.16, 0.16, 0.10, 8)`, z ×1.0625 |
| boot | 0.32 × 0.18 × 0.46 box | `CapsuleGeometry(0.09, 0.28)` laid along **+z**, widened ×1.778 on x |
| head / hair / eyes / number / ring / label | (already round or flat) | **unchanged** |

`barrel(halfW, halfH, corner, radial)` (new, `PlayerModel.ts`) is a lathed
rounded rectangle: circular in cross-section, straight-sided through the
middle, rounded off at both ends.

**A full capsule was tried FIRST and rejected at the eyes** — with the F2 toy
proportions a capsule torso (corner radius = half-width) reads as a *ball*: the
shoulder line disappears and the short upper arm turns into a bead. Keeping the
corner radius BELOW the half-width is what restores the shoulder/hip lines
while the silhouette stays round from every angle. That rejected version is the
reason `LIMB_CORNER = 0.7` and the torso corner `0.20` (not `0.36`) exist.

## 2. WHAT WAS **NOT** ALLOWED TO MOVE (the invariants, held by construction)

1. **Every part occupies exactly the same bounding box as the box it replaces.**
   Measured, per part, in three@0.185 (`computeBoundingBox`) — all ten parts
   report `BBOX=` (identical), see §4 table. Consequence: `armSpan` /
   `maxArmSpan`, the F1 anchor `HUMAN_MODEL_SCALE = 0.64` and the F2 toy
   proportions (HEAD_R 0.34, `TORSO_BASE` 0.72 × 0.86 × 0.54, ~1:4 head) are
   numerically untouched — none of those constants was edited.
2. **Non-circular cross-sections are baked into the GEOMETRY** (`.scale(1,1,k)`
   at build time), never onto the mesh — `mesh.scale` still carries role build ×
   per-player bulk exactly as before (`setBody`).
3. **Every pivot and every translate-to-pivot offset is byte-identical**: the
   elbow group at `y = -0.34`, the knee group at `y = -0.55`, the sleeve/
   forearm/thigh/sock/band/boot translations (−0.18 / −0.22 / −0.27 / −0.21 /
   −0.03 / −0.44), `HIP_Y`, `TORSO_TOP`, arm `y = 1.0`, `foot.position.z = 0.1`.
   `AnimationSystem.ts` is **not touched** — it poses groups, never meshes.
4. Team/GK kit colours, keeper glove/sleeve scaling, eyes, hair cap, shirt
   number plane, select ring + halo, contact blob, name sprite: unchanged.

## 3. PERF — TRIANGLES PER PLAYER

Counted from the real geometries (index count ÷ 3), body parts only, with the
per-player multiplicities (2 arms, 2 legs):

**594 → 2122 triangles per player body** (+1528). For a full 12-player pitch:
**7,128 → 25,464**. Segment budget deliberately low: radial 8 (limbs) / 12
(torso, hips), 3 quads per rounded end. Nothing else in the scene changed;
draw-call count is unchanged (same shared-geometry set, same materials).

## 4. RECEIPTS

Canon, copied from [`CANON.md`](CANON.md): **clean-tree builds** — "a build of
record runs on a CLEAN tree at a named commit" (paraphrase-marked; home:
PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4); **doc-prose fidelity** —
VERBATIM: "a stage doc's prose quotes artifact FIELDS verbatim or the number
becomes a gated face".

### 4.1 Fingerprint A/B — a render change cannot move the sim

BEFORE (at HEAD `3e8c835`, clean tree), `npx tsx scripts/fingerprint.ts`:

```
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

AFTER (this slice applied):

```
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

**IDENTICAL**, and equal to the frontier's fingerprint of record `57b0bdab…c673`.

### 4.2 typecheck / build

- `npm run typecheck` → `tsc --noEmit`, no output, exit 0. CLEAN.
- `npm run build` → `✓ built in 4.14s`. CLEAN (the pre-existing
  ">500 kB chunk" advisory is unchanged and not from this slice).

### 4.3 tests

`npm run test` on the final code:

```
 Test Files  1 failed | 143 passed (144)
      Tests  1 failed | 1579 passed (1580)
   Duration  279.73s
```

The single failure is `tests/formationEvolution.test.ts > league-level style
ecology > ten seasons: …` — the KNOWN load-dependent timeout class. Verified
pass-in-isolation on this same working tree:

```
 ✓ tests/render3d.test.ts (62 tests) 226ms
 ✓ tests/formationEvolution.test.ts (3 tests) 155866ms
 Test Files  2 passed (2)
      Tests  65 passed (65)
```

Recorded honestly: an earlier full run *during* this session (intermediate
capsule version) reported `4 failed | 140 passed (144)` files / `5 failed |
1575 passed` tests plus one `Timeout calling "onTaskUpdate"` unhandled worker
error — same load-dependent class, worse machine load (the run took 380 s), not
a code signal. `tests/render3d.test.ts` (62 tests, includes the F1 span
contract tests) passed in every run.

### 4.4 screenshots

`npm run debug:visual3d` needed `npx playwright install chromium` first
(browser binary was missing). After that it ran green on the final code:
`ALL 3D CHECKS PASSED (51 total)`, including `✓ no console/page errors`.

- [`rb-round-body/before-closeup.png`](rb-round-body/before-closeup.png) — five
  roles, box bodies (captured with this file `git stash`-ed, foreground, tree
  otherwise clean).
- [`rb-round-body/after-closeup.png`](rb-round-body/after-closeup.png) — the
  same five, round.
- [`rb-round-body/after-broadcast.png`](rb-round-body/after-broadcast.png) — in
  game, broadcast camera (from the `debug:visual3d` suite).

The close-ups were captured through the dev server with a throwaway Playwright
script that imports `PlayerModel.ts` directly and renders five roles side by
side; the script is NOT committed. Per the repo's standing rule, headless
capture is an aid — **the user's browser is the final judge**.

## 5. VISION / REALITY (the #201 standing rule)

- **VISION**: presentation-fidelity only. No behaviour, no pricing, no
  constant that any chooser reads. VISION-neutral — PASS.
- **REALITY**: 人是圆的. A footballer's chest, thigh and calf have circular
  cross-sections; the previous model's vertical edges were an artefact of the
  primitive, not of anything the world claims. PASS.

## 6. HONEST GAPS

- The referee, linesmen and touchline coaches are the same box-person skeleton
  in their own files (`RefereeModel.ts`, `LinesmanModel.ts`, `CoachModel.ts`)
  and are **still boxes** — the directive said 球员, and F1's shared-anchor
  reasoning would want them rounded in the same pass if the commander wants
  visual consistency. Not done here; a one-file-each follow-up.
- The crowd (`CrowdSystem.ts`) is intentionally not touched — it is instanced
  and its perf story is different.
- No A/B on perf: +18.3k triangles across the pitch is asserted as negligible
  from the counts, **not** measured as frame time.
