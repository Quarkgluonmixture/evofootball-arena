# Roadmap — Phase 31 handover plan, Phases 32–35 specs, brainstorm parking lot

**Audience: the next coding agent (and the user).** Phase 30 SHIPPED
(tag `phase-30`, deployed); Phase 31 is the next build and is specified
below as a step-by-step handover — follow the steps in order, they encode
the gotchas. Phases 32–35 are directions, not commitments: re-scope each
against the user's play reports before starting. When play-feel and the
calibrate table disagree, **the user's play report wins**.

Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–11):
every step ends with typecheck + full vitest + both Playwright suites green;
push via `gh auth switch --user Quarkgluonmixture`, then switch back; verify
the Pages bundle after CI; itch.io needs a manual `npm run package:itch`;
re-baseline the determinism fingerprint after mechanics changes;
**calibrate noise on goals is ±0.3–0.4 at the default n=142 — ALWAYS
measure balance levers with `npm run calibrate -- 8` (n=568), and read
failure modes 16–18 before touching any lever** (18 is Phase 30's whole
detective story: goals live in gene-mix variance, LESS marking = STRONGER
defence, structure deleted the goals-above-xG channel); statistical
match-loop tests need `{ timeout }` + `setImmediate` yields every ~25
matches or CI's 2-core runner starves vitest's heartbeat; Playwright
selectors are English (suites pin `lang=en`); the user plays 3D on a
PHONE (≤390–640px) — check every UI change there; sim-generated text
stays English (sim/ never touches the browser), UI chrome is localized
via `src/ui/i18n.ts` (zh default).

---

## ⭐ Phase 30 — 6v6 + the formation system — **SHIPPED (tag `phase-30`)**

**Outcome:** all four steps built and gated (202 tests, 51+32 visual
checks). Texture targets hit: tackles+interceptions 76.7 → ~57, completion
63%, ~21 through balls, build-up visible, keeper distributions find set
receivers. **Goals landed at ~1.4, honestly below the 2.6–3.0 target** —
the structures deleted the chaos goals and set shapes suppress chance
volume for everyone; ARCHITECTURE **failure mode 18** is the full analysis
(variance insight, zonal-is-OP paradox, n=142 noise is ±0.3–0.4 → use
`npm run calibrate -- 8`). Corner threat collapsed to ~3% (the one
hardcoded cross died to set shapes) — **Phase 31's corner routines are
promoted from polish to fix.** The user's first 6v6 play reports decide
the rebalance before any new build.

<details><summary>Original handover plan (done — kept for reference)</summary>

**The user's diagnosis (verbatim in spirit):** most possessions die in
midfield scrambles or backfield steals, keeper distributions gift
breakaways, no tiki-taka and no wing play, and everything still clumps.
The root: 4 outfielders on a 90×58 pitch with NO build-up structure.

### Scope

- **6th player = a SECOND WINGER** (两翼齐飞 — width was the most-missed
  behavior). Slot order `[GK, DF, MF, WGL, WGR, ST]`.
- **Formation system**: every team owns a FIXED attacking formation AND
  defending formation (identity, shown on the team card, inherited through
  rebirth) picked from a small library of per-slot spot tables (e.g.
  attack `wide-212` vs `narrow-122`; defend `low-32` vs `press-23`).
  `formationSpot` reads the team's tables instead of the one global
  `BASE_SPOTS`. Per-team defensive SCHEME: **man-marking vs zonal** (zonal
  = hold sliding spots, man = current `assignMarks` behavior). Derive
  scheme + formation picks deterministically from the genome at franchise
  creation (no genome/save migration for this part), store on `TeamInfo`,
  inherit on rebirth.
- **The keeper WAITS for shape** (kills the distribution gifts): a goal
  kick / hold release does not happen until teammates settle near their
  attacking-formation spots (determinism-safe timeout ~4s); receivers are
  SET before the ball comes; keeper-throw target gates get stricter.
  Expected: build-up exists, midfield scrambles drop, no more
  "门将开球失误送单刀".

### Implementation order (the handover steps)

0. **Wildcard removal** — DONE (`phase-29.2`, commit `5c46abf`). Check
   `git log` before redoing anything. `PolicyParams` / `DEFAULT_POLICY` /
   `TeamInfo.policy+rolePolicies` plumbing was deliberately KEPT (it's the
   brain's tuning surface; bit-equivalence tests ride on it).
1. **6v6 mechanical pass — DONE (phase 30.1)**: full gate green (193 vitest,
   2D 51 + 3D 34 Playwright, fingerprint re-baselined
   `92f30f48…`). First 6v6 calibrate: 2.06 goals / 67% completion /
   1.99 offsides / tackles+interceptions 76.7 (the predicted pre-formation
   crowding bump — step 2's job). Original spec: add the 6th slot as
   a second WG; introduce a `TEAM_SIZE` constant and a slot-role list;
   grep-sweep EVERY 5-player assumption:
   - `% 5` (decision-tick stagger), `players[4]` / `for i 4..1` (kickoff
     striker pick), `* 5` / gid math (**gid = side·TEAM_SIZE + index**;
     `playerStats` and `allPlayers` are gid-indexed),
   - `slice(0, 5)`, `playerNames`/`squad`/`ages` array lengths,
     `names.ts` (6 surnames), role-biased newgen for the 2nd WG
     (`evolution/playerGenome.ts` — WG bias already exists, reuse),
   - save **v8** (chain-migrate in `data/save.ts`: backfill one generated
     WG newgen per team — old saves must keep playing; follow the v6/v7
     migration patterns and their tests),
   - team cards on PHONE widths (6 squad rows), 2D/3D labels, shootout
     lineup (best-of-5 from 6 players — `shootoutLineup` should already
     generalize; verify),
   - `RUN_ROLE_W` / `AERIAL_ROLE` / any `Record<Role, …>` tables still
     type-check (Role set unchanged — WG just appears twice).
   Then re-baseline the determinism fingerprint and fix the
   gid/position-hardcoded tests (aerial duel harness, onball scenarios,
   match bounds, offside `defence()` helper). **Gate green before step 2.**
2. **Formations**: the library (a `FORMATIONS` table in
   `src/ai/formations.ts`: `Record<FormationId, V2[]>` per slot, attack +
   defend variants), per-team picks + scheme (genome-derived via
   `hashSeed`, TeamInfo-stored, rebirth-inherited in
   `evolution/franchise.ts`), `formationSpot` reads team tables (the
   gene/mode modifiers — slide, depth, width, MODE_SHIFT — stay ON TOP of
   the table spot exactly as they sit on BASE_SPOTS today),
   `assignMarks` gets the zonal branch (zonal = keep sliding spots + only
   mark inside own box; man = current behavior), team card + right panel
   show formations + scheme (i18n: 阵型/盯人方案). Directional test: a
   `low-32` team concedes fewer shots than `press-23` vs the same
   opponent (side-balanced, pooled seeds §10.5).
3. **Keeper waits for shape**: goal-kick ready gate in `stepRestart`
   (extend the `ready` condition) + gk hold-release gate (extend
   `gkHoldTimer` decrement or the ThrowOut/pass decision gate) on
   "≥3 outfielders within ~6m of their attacking spots", timeout-capped
   (~4s, pure sim-state — invariant 3, watched ≡ skipped; NO wall clock).
   Test: from a forced goal kick, receivers' mean distance-to-spot at the
   moment of the kick is below the gate across seeds.
4. **Retune**: calibrate targets ~2.6–3.0 goals; **tackles+interceptions
   should FALL from ~66/match — that's the crowding number**; offsides ~2;
   completion should RISE toward ~70% (build-up exists again); README/ARCH
   stamps; tag `phase-30`; push; verify Pages; remind itch.

### Risks / watchpoints

- 6th body could WORSEN crowding if formations don't spread lanes — tune
  formation tables before touching AI weights.
- Offside line interacts with the 2nd WG (more legal outlets wide);
  re-check offside rate after step 2, not step 1.
- The keeper-waits gate must not deadlock: the timeout is the failsafe —
  test a pathological setup (all teammates sent off / parked far).

</details>

---

## ⭐ Phase 31 — beating SET defences (chance volume), set-piece routines, formation evolution

**Goal:** Phase 30 built the structure and honestly under-delivered on
scoring (~1.4 goals; target ≥2.2). The missing goals are chance VOLUME
against set shapes (on-target 3.45/match vs 29.2's 5.9 — per-shot
conversion is already back at 29.2 levels, don't re-tune it). This phase
gives attacks the real-football answers to a parked block, makes corners
real again, and lets formations evolve. **Read ARCHITECTURE failure modes
16–18 before writing any code.**

### Implementation order (the handover steps)

0. **Play-feel gate.** The user has NOT yet reported on 6v6. Their report
   decides the emphasis: if "还是进不了球/太干" → steps 1–2 are the phase;
   if texture complaints (crowding, wing play, keeper waits feel slow) →
   fix those FIRST as a 30.5 live-play pass, exactly like 29.1. Do not
   skip this gate.
1. **Lane-aware shot selection + blocks.** Today `shotQuality`
   (mechanics.ts) is distance·angle·pressure — it cannot see the four
   parked bodies on the shot path, so carriers shoot into walls (and since
   30.4 shots are NOT leg-deflectable, those fly harmlessly). Build the
   pair together: (a) a `laneBlockers(pos, goal, opponents)` count —
   bodies within ~1m of the shot corridor's first 60% — that DISCOUNTS
   shot utility in `decideCarrier` (carriers work for an angle instead:
   the dribble/pass alternatives win when blocked) and (b) restore shot
   BLOCKS as an explicit mechanic (a blocker within the corridor rolls a
   block chance; blocked = loose ball, NOT the old speed-window deflection
   friction accident) so daring a blocked lane has a real cost. Net
   effect: fewer doomed shots, more shots from actual angles — volume AND
   conversion rise together. Directional test: shots taken with 0 lane
   blockers convert ≥2× shots taken with 2+.
2. **Cutback crosses + overload runs.** The byline cutback is football's
   canonical set-defence beater and the engine has every ingredient: a
   winger reaching the byline zone (localX > HALF_L−10, |y| > 12) gets a
   CUTBACK candidate — a hard low ball to the edge-of-box arc (localX
   ~HALF_L−16, |y| < 8) where a licensed late runner (MF/second WG —
   extend `assignRunners` with an `arriving` license) meets it first-time
   (the snap-decision reception in `giveBall` already exists). Second
   lever: when the ball is wide, the WEAK-side winger's attack spot pulls
   toward the far post (formationSpot override or a runner license) — the
   overload that punishes ball-side zone shifts. Directional: cutback
   goals exist (>0.05/match), crosses/match recovers toward ~2.5.
3. **Corner ROUTINES** (promoted from polish to fix — the one hardcoded
   cross died to set shapes: ~3% corner→shot, probed across three league
   seeds; the 29.1 crasher-momentum lever is INERT, the delivery dies
   before any aerial duel — so routines must create SEPARATION, not just
   aim elsewhere). `RestartState.routine`: near-post flick / far-post
   crash / short-corner give-and-go / edge-of-box cutback (reuses step
   2's arc mechanics), chosen by the taker's brain from openness of each
   routine's target zone; each routine = a target-spot table + which
   box-crash runners attack it (reuses the licensing). Tests: routine
   choice determinism; directional per routine (short completes more
   passes, far-post wins more headers); **corner→shot ≥8%** across league
   seeds (the plumbing floor in aerial.test.ts goes back up when this
   lands).
4. **Formations enter EVOLUTION.** Move style picks from
   "derived at creation" to franchise DNA: inherit on rebirth from the
   dominant parent, mutate with small per-season probability (~0.08 —
   switch ONE component to an adjacent option), log it as a lineage event
   (`🔧 switched to low-32`). Evolution tab: a stacked share-per-generation
   strip per formation id next to the gene sparklines. NOTE the zonal
   guard: zonal is the RARE identity by design (failure mode 18 — the
   lattice out-defends man); if evolution can mutate INTO zonal, keep its
   entry probability low or scoring sinks league-wide again. Tests:
   evolve-check shows a non-degenerate style distribution after 10
   seasons (nothing extinct, no monoculture).
5. **Retune + ship**: `npm run calibrate -- 8`; targets — goals ≥2.2
   (stretch 2.6), on-target ≥4.5, corner→shot ≥8%, offsides ~2–3,
   t+i stays ≤60, completion ≥62%. README/ARCHITECTURE stamps, tag
   `phase-31`, push (account switch!), verify Pages, remind itch.

### Risks / watchpoints

- Step 1's block mechanic re-opens the 30.4 hole if it uses the old
  speed-window deflection — implement it ON the pendingShot path,
  explicitly, or conversion silently dies again.
- Steps 1+2 both raise chance volume: calibrate between steps (at n=568)
  so step 5 isn't untangling a double overshoot.
- Formation mutation churn can destroy the identity continuity the
  dynasty timeline sells — keep mutation rare, one component at a time.
- The cutback runner license must respect the onside hold (executor
  clamp) — an "arriving" runner is exactly the profile the offside
  honesty gap flags; expect offsides to tick up and let them.

## Phase 32 — free kicks become REAL

**Goal:** offside + professional fouls (29.x) made free kicks common; give
them teeth so the danger-band pro foul has real cost.

- **Build:** in `stepRestart`/`decideCarrier` for `freeKick` restarts
  within range (attacking-half, dGoal < ~28m): a DIRECT SHOT candidate
  (taker = best `finishing+technique·0.5`, override `pickTaker`), a 2–3
  man defensive WALL (defenders placed on the ball–goal line at the 6m
  clearance edge during setup — extend the clearance logic, they brace
  like the bubble), keeper cheats toward the near post. Direct FK shot
  uses `performShot` with a dedicated spread/power profile (curl over the
  wall: loft z that clears 1.8m at the wall and dips — the parabola
  machinery exists). QUICK restart option: if the taker reaches the spot
  in <1s and an open teammate exists, skip the min-setup once (cap: only
  when no wall has formed yet).
- **Tests:** wall forms (≥2 defenders within 1m of the ball–goal line at
  kick time for close FKs); direct FK conversion in a focused harness
  ~4–8%; quick-restart determinism.
- **Tune:** FK goals ~0.10–0.15/match; re-check pro-foul willingness (a
  REAL FK threat should make cynicism rarer in the danger band — consider
  feeding FK danger into the `tryTacticalFoul` willingness).
- **Risk:** wall clearance vs the existing 6m restart circle — don't let
  two clearance systems fight (the wall IS the clearance for close FKs).

## Phase 33 — the watching experience

**Goal:** cash the tactics in visually — the user watches on a phone.

- **Build:** HT/FT auto-highlights: play the archived `ReplayBuffer` goal
  (+big-save) moments back-to-back in cinematic framing with the existing
  `cameraForEvent` + slow-mo, ⏭ skips (reuse the shootout-theater
  presentation pattern: presentation only, results already decided).
  Player match RATINGS: fold existing `playerStats` + team outcome into a
  6.0–10.0 scale (weights: goal 1.2, assist 0.8, save 0.25, recovery 0.1,
  miscontrol −0.1, win +0.3), show on player card + a MOTM line in the FT
  feed + season awards integration. TIKI-TAKA counter: consecutive
  completed passes per possession; ≥6 emits one feed line
  (`🎼 8-pass move!`) and a season stat (longest chain).
- **Tests:** ratings are deterministic + bounded; highlight reel replays
  identical frames (snapshot equality on RenderState samples); chain
  counter resets on turnover/dead ball.
- **Risk:** feed spam (failure mode 7) — one line per qualifying move,
  threshold high enough to stay rare (~2–3/match).

## Phase 34 — players become PEOPLE

**Goal:** small, READABLE individuality on top of attributes.

- **Build:** 1–2 TRAITS per player, derived deterministically at
  birth/newgen from attribute extremes + role (clinical: aimMargin −0.1;
  playmaker: pass lane weight +15%; enforcer: tackle +0.04 / foul +0.02;
  engine: stamina drain −10%; poacher: box positioning bias). Shown on the
  player card + mined into season stories ("the enforcer collected his
  10th booking"). Captains: highest age·technique — small mode-hysteresis
  bonus (the team switches modes less erratically). OPTIONAL transfer
  window: one swap per team per season between divisions, driven by
  fitness gaps — only if the ecosystem feels stale.
- **Tests:** trait derivation determinism; each trait's effect directional
  (focused harnesses per §10.5, NOT match-stat soups).
- **Risk:** trait soup — cap at 5-6 trait types total; every trait must be
  visible either in play or in stories, or it's cut.

## Phase 35 — league ecology

**Goal:** long-run narratives the hall of fame can't mine today.

- **Build:** RIVALRIES: a pair ledger in League history (≥2 meetings in
  finals/deciders/relegation six-pointers arms a rivalry); rivalry
  fixtures get a small intensity effect (press +, fouls +, feed banner
  `🔥 Derby`) and their own hall-of-fame table (H2H). PRESTIGE: weighted
  trophy history that biases rebirth parent selection (dynasties leave
  bigger genetic footprints) — watch evolve-check diversity doesn't
  collapse. Attendance/stadium flavor text scaled by prestige+form.
- **Tests:** rivalry arming determinism; prestige bias measurable but
  bounded (diversity metrics in evolve-check stay in band).
- **Risk:** positive-feedback prestige → monoculture; cap the bias.

---

## Brainstorm parking lot (unscoped — pitch to the user before building)

- **Weather / pitch conditions** per fixture (seeded): rain raises
  first-touch difficulty + ball friction, wind perturbs lofted flight —
  deterministic modifiers, visible in 3D (particles) + a fixture badge.
- **Injuries + a bench** (pairs with Phase 34): knocks from hard tackles,
  one sub per match; requires squad size 8 and breaks the "no bench"
  premise — big, only if the user asks for squad depth.
- **Named managers**: a coach persona per franchise carrying the tactical
  identity across rebirths (the genome gets a face); cheap narrative win.
- **Season showpieces**: an All-Star match or Champion-vs-Cup-winner
  Super Cup as a season-end exhibition (standalone tie machinery exists).
- **Replay export/share**: serialize a match's seed+config into a shareable
  code — anyone can rewatch the exact match (determinism as a feature).
- **Commentary variety**: template pools for feed lines (seeded picks) so
  the feed reads less repetitive without translating sim text.
- **2D tactical minimap in 3D view** (picture-in-picture) for phone
  watchability.
- **11v11 / bigger pitch**: only after 6v6 + formations prove the
  structure scales; would need per-line formations and probably zones.
- **Perf**: gate the decision-tick `why`-string building behind a flag
  (largest remaining profile cost; results unaffected — mind
  watched ≡ skipped when wiring).
- **GLTF player models** with the procedural mesh as fallback.

**Ordering rationale:** 31–32 deepen what 30 builds (tactics), 33 cashes
it in visually, 34–35 only pay off once the football itself looks right.
**If Phase 30 lands badly on play-feel, STOP and rebalance before any of
these.**
