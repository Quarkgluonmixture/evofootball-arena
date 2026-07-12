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
failure modes 16–21 before touching any lever** (18 is Phase 30's whole
detective story: goals live in gene-mix variance, LESS marking = STRONGER
defence, structure deleted the goals-above-xG channel; 19–21 are Phase
30.5/31's: bounded support fans, the completion homeostat, and
inheritance compounding — plus fm 12's Node-vs-Node corollary for any
long-run league test); statistical
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

## ⭐ Phase 30.5 — the live-play texture pass — **SHIPPED**

**The user's first 6v6 play report** (2026-07-12): starts fine, then
degrades into a perpetual midfield scramble — constant dispossessions, a
pile of bodies, no visible formation, wings unused except by a few teams.
Their hypothesis: organizing attack pays too little, swarming pays too
much. Diagnosis confirmed in code, but the lever was GEOMETRY, not payoff
weights: all three off-ball supporters converged into one column ~10–18m
ahead of the carrier (dragging markers into the same corridor — every
forward lane walled), the tightest marking stance stood INSIDE tackle
radius (a marked reception = snap dispossession), loose balls pulled 2
chasers per team plus the crowd, 82% of through balls flew into blocked
lanes (the chip was judged by the kicker's surroundings, not the landing),
and the 2.15s floated switch always lost its aerial duel at the winger.

**Shipped fixes** (each measured at n=568): radius-bounded support fan
(failure mode 19 — the unbounded first cut inverted the 5v6 invariant),
marking stance floor 1.2m (slope 1.8 → 1.4; genes.test guards the
aggression payoff), loose ball = 1 chaser per team, landing-judged chips +
multiplicative openness gate on through balls, driven 1.4–1.6s switches.
**Result: goals 1.44 → 1.94, on-target 3.45 → 4.21 — the set-defence
era's first volume recovery — t+i ≈58 flat, completion pinned at ~61–63%
(failure mode 20: it's an evolutionary homeostat; don't chase it).**
New probes: `probe-pass.ts` (pass-failure buckets), `probe-shorthand.ts`
(5v6 sanity). Policy shot-skew test strengthened (shootBase 6) — the
lever works, the organized league prices it higher. Fingerprint
re-baselined `64039883…`. What only the user can judge: whether the
fan/wings/duels read as ORGANIZED on the pitch — the next play report
decides whether 30.5 iterates or Phase 31 starts.

---

## ⭐ Phase 31 — beating SET defences, set-piece routines, formation evolution — **SHIPPED**

**Outcome (final `calibrate -- 8`): goals 2.58 (target ≥2.2, stretch 2.6
hit), on-target 4.89 (≥4.5 ✓), completion 64% (≥62% ✓), t+i 55.7 (≤60 ✓),
corner→shot ~7-9% across league seeds (from 2-4%; the literal ≥8%-
everywhere needs marker-tracking separation — markers shadow crashers
frame-perfectly, so the goal-side man still wins most post duels; the
aerial.test floor sits at 0.04), crosses 1.35 (the ~2.5 reference was
pre-cutback: byline drives + cutbacks 0.46 + corner routines carry the
wide-delivery texture now; crossBase 0.32 was tried and overshot goals to
3.0), offsides 1.71 (the expected tick-up never came — fine).** All five
steps built: lane-aware shooting + explicit blocks (31.1, plus the
user-reported 单刀回传/大空间不突破 fixes — the OPEN RUN economy and the
REST-DEFENCE DF), byline cutbacks + the arriving runner + 下底 + far-post
pull (31.2), corner routines with the crasher-wait gate (31.3, plus
chasers capped at two — user report), formation evolution with the zonal
ecology budget (31.4 — failure mode 21: inheritance compounded zonal to
10/16 clubs before the budget), aimMargin 1.2 → 1.3 retune (31.5, fm 16a
re-validated: +0.36 goals from one aim-safety lever). 225 tests;
fingerprint re-baselined `3aed8c8f…`.

**Phase 31.6 — the post-ship live-play pass (SHIPPED same day):** four
user reports, four fixes. (1) "开门球对面挤着队员" → the distribution
STAND-OFF: while a keeper stands over a goal kick or holds the ball,
markers cover from 2.0–2.6m (aggression still scales it — a flat floor
erased the gene channel again, 30.5's lesson second edition). (2)
"offside 应该发门球" → offside now restarts as a GOAL KICK to the
defenders (deliberate law simplification, user call — the real award is
an indirect FK at the spot; the calm keeper reset is what the flag is
FOR here; 🚩 label kept). (3) "做一下观众席" → instanced crowd on every
terrace step (~300 bodies+heads, 2 draw calls, deterministic palette;
behind-goal stands stay LOW — failure mode 13). (4) "要增加传球力度吗"
→ measured: pass speed d·0.55+7.5 → d·0.6+8.2 (cap 22) — zip beats the
in-flight interceptors; completion 64→65-69%, interceptions 31→27,
t+i 57→49 (the smoothest the game has ever measured), goals 2.26 (≥2.2
holds; aimMargin has headroom if the user wants 2.5+ back). Fallout
absorbed: the 5v6 invariant moved to GOAL DIFFERENCE (the counter
economy keeps a besieged attack alive — the robust man-short cost is the
LEAK, 70 vs 59 conceded), the press/marking gene test went focused
(failure mode 15), the corner floor pooled over three seeds. 226 tests.

**Phase 31.7 — the cushioned trap (SHIPPED):** "长球停不住" — the 30.5
driven switch lands ~19.5 m/s, above CONTROL_MAX_SPEED 14, so it skipped
past the winger it was aimed at. The pass's INTENDED receiver may now
control up to 24 m/s (raised from a first cut of 22 when the user hit the
same wall on 40m keeper launches — "门将开长球穿模接不到"), priced by
attemptFirstTouch; bystanders/interceptors keep 14, so lane dynamics are
unchanged. LoftedPass completion 20-25% → 71%; goals 2.26 → ~2.5;
crosses recovered ~1.8-1.9 (switch receptions flow into wing play).

**Phase 31.8 — three live reports (SHIPPED):** (1) a held keeper ball
clears the BOX like a goal kick (user call — same calm-reset
simplification family as the offside goal kick). (2) "有的比赛还是到处抢"
— probed 112 matches: t+i variance 28–123 correlates ZERO with
press/aggression genomes; the top-5 chaotic fixtures were ALL
narrow-122 derbies (both attacks mirror into one corridor; the support
fan anchors to lanes and narrow lanes gave it no relief valve — worst:
224 passes, 123 turnovers, 0 goals). narrow-122's inside slots moved to
the HALF-SPACES (8/11 → 12/15; wide-212 stays ±19): worst-match t+i
123 → 97. The narrow derby remains the scrappiest fixture BY IDENTITY —
if play still reads too chaotic, the next dial is the founding share
(deriveTeamStyle attackingWidth threshold 0.5) or more half-space.
(3) the 5v6 invariant moved a THIRD time — to what survives n=60 across
economy tweaks: shots ratio < 0.97 + "never better off short" (the GD
penalty sank into ±8 pool noise; chasing it was testing noise, §10.5).
Final state: goals ~2.5, on-target 4.8, completion 69%, t+i 45 (the
ping-pong era is over: 57.5 at 30.5 → 45), tags `phase-31.6/7/8`, all
deployed, fingerprint `c5771aca…`.

**Phase 31.9 — four live reports + the headed-game pass (SHIPPED):**

(1) "门球时 mark 的球员往禁区里挤,抽搐" — steering fought Match's hard
box clamp every frame (drive in → teleport out). Fixed at the steering
layer: while a goal kick or keeper hold bars a player from the opposing
box, their target rides 0.4m OUTSIDE the clamp line, plus a velocity-level
backstop (separation between two markers on the edge shoved one inward)
and vel-braking on the hard clamps. Probed: pinned-on-clamp frames 4003 →
876 across 12 matches, longest streak 16 frames (was 79), zero above 0.5s.

(2) "门将扑救鬼畜,只有上半身动" — the dive pose tilted only the `lean`
group while the legs stood planted. PlayerModel grew a `body` group
(lean + legs, pivot at the feet); the dive is now a one-shot arc: whole
body tilts 1.2 rad with a launch hop, scissor legs, both arms to the ball
side, and a half-rate approach() recovery that reads as getting back up.
Render-only.

(3) "有没有一脚出球?" (user request) — a PRESSURED intended receiver
(opponent within 3.0+tempo·1.5m) now plays first-time: the reception opens
a 0.28s window + an immediate decision; any pass struck inside it carries
×(1.15 + (1−technique)·0.9) aim noise (loft range error too). Unpressured
receptions keep the 0.3s settle — the window must never be free or
one-touch ping-pong (the original disease) returns. ~12-16 one-touch
passes/match; completion 68→69%, tackles −1.3 (the pressured layoff
escapes the snap dispossession), t+i 49→43. tests/oneTouch.test.ts pins
the trigger, the consumption, and the technique-priced spray (measured
via release-angle std — completion in open scenes doesn't discriminate).

(4) **The headed-game pass** ("做头球那些") — the queue's marker REACTION
LAG shipped (markers tracking a >4.5 m/s mark within 26m of their own
goal re-read the stance target every 0.2–0.45s by `defending`, not
per-frame), but the probes showed it changed NOTHING — the corner was
being killed upstream by a chain of silent bugs the outcome metrics never
separated: (a) crashers pre-positioned ON the landing (a static box the
set marker always won) → the timed crash: hold 4.5m off the spot, burst
through it as the taker steps up; (b) the HAND-OFF GAP — the restart
clears ~0.2-0.5s before the kick, and licenses/routing/clearance all died
with it: crashers turned back toward formation spots mid-flight (fixed:
`team.cornerCrash` persists routine+personnel through the flight, brain
keeps MakeRun alive on it) and defenders rushed the taker so the launch
(first ~3m at leg height, inside the deflect window) was blocked at the
boot (fixed: the clearance circle now holds until the ball is actually
kicked, all restart kinds); (c) the corner cross led the target by
vel·flight ≈ 9m — a burst-timed crasher got the ball dropped far past
everyone (fixed: routine corners aim at the KEY ZONE, `performCross(at)`);
(d) **the 6m sentry** — our corner's apex is ~3.5m, so its ascent sits in
the header band until ~7.8m from the flag, and a defender camped on the
generic 6m clearance edge got a free header at every climbing corner
(fixed: `CORNER_CLEARANCE = 9.15`, the real law); (e) corner noise
scatters the landing ~2.6m σ — a crasher pinned to the table spot missed
half the drops (fixed: the closest licensed crasher re-routes to the true
descent, exact parabola, meeting 2.5m upstream where the ball crosses the
band). **Corner→shot 7.6% → ~24-35% pooled (aerial.test floor 0.04 →
0.08), headed goals ×3 (0.021 → 0.069/match), header shots 0.31 → 0.39.**

**31.9 finals (`calibrate -- 8`): goals 2.79, on-target 5.26, completion
69%, one-touch 11.7, crosses 2.08, t+i 43.2 (new low), offsides 1.68,
ball-in-play 91%. Fingerprint re-baselined `8a3a6534…`. 231 tests** (the
shootBias pool re-widened to 48 seeds and the finishing pool to 270 —
both were coin flips vs their real margins at the old sizes, §10.5).

**Phase 31.9.1 — the same-day live-play pass (SHIPPED):** four more
reports against the deployed 31.9.

(1) "抢断后球直接被对方控制,拦截/抢断/解围没区别" (user diagnosis of
乱抢) — dead right: the won-tackle "squirt" was cosmetic. Probed: **85%
of won tackles were re-captured BY THE TACKLER within 0.19s** (squirt
5.5-10 m/s < CONTROL_MAX 14, victim stunned 0.6s, tackler unrestricted).
Fix: the tackler is committed to the lunge — `kickCooldown 0.5` on the
win, so the loose ball belongs to the THIRD man. Now: tackler-himself
51%, victim's side recovers 25% (was 8%), mean loose-ball time 0.81s.
The three takeaways finally differ: interception = clean, tackle =
contested 50/50, clearance = hoofed hang (already healthy). Economy
fallout absorbed: goals 2.79 → ~2.5, completion 69 → 66% (contested
phases are back), ball-in-play 91 → 87% — if that reads too scrappy,
the tackler cooldown length is the dial.

(2) "门将手拿球/球门球时对方疯狂抽动逼抢" — the shape-wait re-arms the
hold in 0.25s quanta and the clearance DIED in the timer==0 gaps between
them: 22% of distribution time was gap, box intrusion ran 7× higher
there, opponents surged/expelled at ~4Hz. `gkDistributing` now spans the
whole hand-to-kick phase in stepBall's calm branch, the executor's
barred-box steering and assignChasers' zero-chaser rule — gap-frame box
intrusions: 123 → 0.

(3) "球员跑的时候帧率不对,眼花" — players hovering on the jog↔sprint
speed threshold (5.2, common now that marker-lag anchors jump their
targets) flipped limb swing amplitude 0.6↔1.05 INSTANTLY every few
frames — a strobe. Swing amplitude and arm factor now ease via
approach() like every rotation already did (render-only).

(4) "扑救动画后球的位置应该随手部变化" — the held ball hovered at the
standing carry spot while the body dove. ThreeMatchRenderer hands
BallModel a hands anchor (body-group localToWorld) whenever the owner's
body is tilted; the ball blends toward it by tilt fraction and eases
back as the keeper gets up (render-only).

Test pools re-powered while the economy moved (§10.5): keeper-reflexes
60 seeds (own pool — the 8-seed default gave the real +13pp save-rate
edge ~1σ), the 5v6 invariant 180 seeds with GD margin +12 (three
disjoint 60-pools measured GD-diff {+6,−17,−1}, σ≈12 — the old +4 margin
sat inside single-pool noise; the guard is for SYSTEMATIC inversions).
**31.9.1 finals: goals 2.48, on-target 4.51, completion 66%, one-touch
12.0, t+i 44.2, headers won 5.41. Fingerprint `6c963230…`. 231 tests.**

**Play-feel queue (post-31.9.1):** the box duel itself is now the header
bottleneck — defenders still win the first corner duel ~7:1 (the box
outnumbers the crash 4-5v3 and DF aerial sense 0.3 tops every crasher
role except ST 0.26). Next dials if the user still wants more headed
goals: rank crash-spot assignment by aerialSense (today it's player-index
order), a crasher momentum bonus in the duel score, or a longer reaction
lag. Also watch: kick protection changed restart dynamics for kick-ins
and goal kicks too (takers are no longer rushable in the hand-off gap) —
if restarts now feel too safe, the protection window is the dial. And
watch completion 66% + ball-in-play 87% (the tackle-scramble price) —
the tackler kickCooldown 0.5 is the dial if midfield reads scrappy again.

<details><summary>Original handover plan (done — kept for reference)</summary>

**Goal:** Phase 30 built the structure and honestly under-delivered on
scoring (~1.4 goals; target ≥2.2). The missing goals are chance VOLUME
against set shapes (on-target 3.45/match vs 29.2's 5.9 — per-shot
conversion is already back at 29.2 levels, don't re-tune it). This phase
gives attacks the real-football answers to a parked block, makes corners
real again, and lets formations evolve. **Read ARCHITECTURE failure modes
16–18 before writing any code.**

### Implementation order (the handover steps)

0. **Play-feel gate.** The first report came in texture-shaped and Phase
   30.5 (above) answered it. The gate now re-arms on the user's NEXT
   report: if the scramble/shape/wings complaints persist → iterate 30.5
   (the fan pull 0.75 / cap 0.9·radius, stance floor, duel cap are the
   dials); if it shifts to "还是进不了球/太干" → steps 1–2 are the phase.
   Do not skip this gate.
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

</details>

## ⭐ Phase 32 — free kicks become REAL — **SHIPPED**

**Outcome:** the danger-band FK (attacking half, 9–28m out) is a real set
piece: the SPECIALIST steps up (best finishing+technique·0.5 among
players within 26m — an unbounded pick summoned men who couldn't arrive
before the 6s failsafe), a 2–3 body WALL forms on the ball–goal line at
the law 9.15m (93% formed at kick in league play), the keeper cheats a
step to the near post, and the direct strike curls OVER the wall on a
closed-form parabola (z ≥ 2.6 at the wall — above the header band) and
dips. QUICK restarts (~7%) punish a slow defensive reset when a clearly
open FORWARD outlet exists. Fouls in the band are WHISTLED BACK
(⚠ deliberate narrowing of the 27.2 advantage rule — flagged for the
user's veto: the set piece out-values scrappy possession there; advantage
still swallows every whistle elsewhere), and the professional foul weighs
the new threat (willingness ×0.6 in range). League picture: ~0.7 danger
FKs/match, ~0.45 direct strikes, ~0.05 FK goals (the real game's rate —
the spec's 0.10-0.15 predates the advantage-rule reality), conversion
~8-10% focused. Fallout absorbed en route, each probed: the wall members
were glass-walled by the restart circle (exempted — the wall IS the
clearance), shoved off their slots by resolveOverlaps (1.1m spacing >
PLAYER_MIN_DIST), beaten to their line by the fast taker (the referee
now WAITS for the wall like corners wait for crashers), and — the best
one — released at the kick, they walked back toward their marks straight
into the climb's header band and free-headed the ball they had just
walled (the wall now HOLDS 0.7s after the strike). Calibrate: goals 2.66,
on-target 4.83, t+i 41.2, cards 0.94🟨 (the pro-foul discount), corners
still ~25%+ corner→shot. 238 tests (7 new in freekick.test.ts);
fingerprint `0782000e…`.

<details><summary>Original spec (done — kept for reference)</summary>

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

</details>

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
