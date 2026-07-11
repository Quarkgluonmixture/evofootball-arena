# Roadmap — Phase 30 handover plan, Phases 31–35 specs, brainstorm parking lot

**Audience: the next coding agent (and the user).** Phase 30 is green-lit
and specified below — follow the steps in order, they encode the gotchas.
Phases 31–35 are specced concretely but are directions, not commitments:
re-scope each against the user's play reports before starting. When
play-feel and the calibrate table disagree, **the user's play report wins**.

Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–11):
every step ends with typecheck + full vitest + both Playwright suites green;
push via `gh auth switch --user Quarkgluonmixture`, then switch back; verify
the Pages bundle after CI; itch.io needs a manual `npm run package:itch`;
re-baseline the determinism fingerprint after mechanics changes; small
balance levers (±0.15 goals) drown in calibrate noise at n=142 — don't
micro-tune them; Playwright selectors are English (suites pin `lang=en`);
the user plays 3D on a PHONE (≤390–640px) — check every UI change there;
sim-generated text stays English (sim/ never touches the browser), UI
chrome is localized via `src/ui/i18n.ts` (zh default).

---

## ⭐ Phase 30 — 6v6 + the formation system (user green-lit 2026-07-07)

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

---

## Phase 31 — formations enter EVOLUTION + set-piece routines

**Goal:** tactical identity becomes something the ecosystem DISCOVERS, and
corners stop being one hardcoded cross.

- **Build:** move formation/scheme picks from "derived at creation" to
  franchise DNA: inherit on rebirth from the dominant parent, mutate with
  small per-season probability (~0.08 — switch to an adjacent formation in
  the library), crossover picks one parent's. Evolution tab: a stacked
  share-per-generation strip per formation id ("the league discovered the
  low block") next to the existing gene sparklines. Corner ROUTINES:
  `RestartState.routine` (near-post / far-post / short / edge-of-box
  cutback), chosen by the taker's brain from openness of each routine's
  target zone; each routine = a target-spot table + which runners attack
  it (reuses the box-crash licensing).
- **Tests:** routine choice determinism; evolve-check shows a
  non-degenerate formation distribution after 10 seasons (no formation
  extinct AND no monoculture — both are failure smells); directional:
  short-corner routine completes more passes, far-post wins more headers.
- **Tune:** corner→shot stays ≥10%; goals impact ±0.1.
- **Risk:** formation mutation churn can destroy identity continuity the
  dynasty timeline sells — keep mutation rare and log it as a lineage
  event (`🔧 switched to low-32`).

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
