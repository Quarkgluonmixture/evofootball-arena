# Roadmap — shipped through phase-92 (containment repriced: wins neutral head-to-head; adoption still unstable — the fork sharpens)

## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
## ⭐⭐⭐ THE MASTER PLAN IS NOW [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md) (2026-07-14, user-ratified)
## ⭐⭐⭐⭐ THE SUBSTRATE REBUILD: [`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md) + [`PROBE-CONTRACTS.md`](PROBE-CONTRACTS.md) (2026-07-20)

> 🎯🎯🎯 **RESUME (2026-07-20 — the "team-gene overhaul" resolved into a SUBSTRATE-FIRST
> ENGINE REBUILD; reference docs WRITTEN + tree SETTLED — clean baseline `f192a08`; NEXT
> = build-order step 3 · **`Match.step` profiler + perf baseline DONE (`8c97ac4`,
> `docs/perf/baseline.json`: 5.2µs/step, execute 65% / physics 14% / decide 10%; perf is
> now a hard gate)** → step-3 BASELINE-NOW probes DONE (5 → `docs/baselines/BASELINE-NOW.md`) + step-4 counterfactual DONE (**deep-clone Option A** — POC on branch `worktree-poc-clone-probe`, PROBE-CONTRACTS §8). **slice-1a sub-step 1 (S0 `possessionPhase` state) DONE** — bit-identical + perf-neutral (5.3µs/step, 443/443 + invariant test). ⭐⭐ **REFRAMED 2026-07-20 (user + GPT + Claude world-model audit): the "50-50 winner
> resolver" is PAUSED — the deeper gap is that the player is a POINT, not a body.** NEXT =
> the **World-Model Foundation slice → [`docs/world-model/FOUNDATION.md`](world-model/FOUNDATION.md)**
> (THE resume doc for this work). Target = **Kinematic Disc + Oriented Shell**, run as the
> **Minimum Embodied Contest Slice**. ✅ **M0 DONE (2026-07-20, byte-identical):** scale
> authority split (`FIELD/GOAL_AND_BOX/BODY/CONTROL_REACH/SPEED_TIME/SURFACE`), plus
> derived `bodyDir`/`coreRadius`/ball mode, `BALL_RADIUS=0.11`, pure contact/access
> geometry, and type-only `ContestEpisode`. Gates: tsc/build clean · 450/450 · two
> before/after fingerprints identical (`2821d2d9…`, `8d0cfb08…`) · paired perf neutral
> (5.4→5.5µs/step; 14.7→14.4 matches/s, profiler determinism OK). ✅ **M1 DONE + USER
> ACCEPTED (2026-07-20):** the fixed-order overlap solver now removes only closing normal
> relative velocity (tangent/separating motion preserved; keeper anchoring preserved).
> Mechanism: inward 8→0m/s, 120f penetration 0.133333→0.007517m; full 453/453, stable
> repeated fingerprints, perf 5.28µs/step, two-seed calibrate 2.22/2.30. User feel verdict:
> “像抹了一点润滑油的轻微弹性球一样” — accepted, with no sticking/congestion veto.
> ✅ **M2 DONE (2026-07-20):** one `directBallAccess` world-fact now composes oriented
> reach + opponent access-line screening; ground `tryCapture` reads eligibility without
> changing nearest-player order or touch/control semantics. Static counterfactuals pass;
> live delay is only 0.35s/match (0.2% frames); contests 17.57→17.23, pinball max 7→5,
> spell 5.54→5.59s. Initial side/back reach 0.85/0.45 honestly failed policy+stamina and
> was rejected; final 1.00/0.90 passes tsc/build · 457/457 · repeated deterministic
> fingerprints · perf 5.12µs/step · calibrate 2.38/2.35. ✅ **M3 DONE (2026-07-21):** all
> eligible ground contacts claim from one snapshot; first contact gives the ball an impulse,
> never ownership; stable control is a separate attempt three ticks later and may belong to a
> different/third player. 120-match ledger: 14,029/14,029 resolved, 1.25 contacts/episode,
> recontact max 8, contact→control 97.5%, first≠final 10.5%, third+ final 0.4%; full sim tests
> 461/461, final focused 61/61, stable repeated fingerprints, perf 5.37µs/step. ✅ **M4
> DONE (2026-07-21):** render truth aligned (outfield ball at authoritative sim position; old 0.42m ball
> reduced to user-accepted 0.286m; real touch/tackle pulses + tackle cue). Continuous carry
> sine was rejected and fully reverted after max contact chains worsened 8→28 then 141.
> The bounded M3b 忠于脚 spike also honest-reverted: all-close release hit 54.60 touches/match
> and an 85-contact chain; fixed foot distance alone hit 32; narrowed release hit 63; an
> attached three-tick foot phase passed contact anatomy but broke policy/stamina directionality.
> A non-extending M3 control deadline capped recontacts at 5 but broke the player-style→selection
> contract, so it too was removed. Current HEAD is the accepted M3 behavior; 忠于脚 remains a
> real substrate gap, explicitly not a render fake. ✅ **Pass–Arrival–Contest sub-step 2
> DONE (2026-07-21, byte-identical):** new pure `ai/reachability.ts` provides analytic
> current-velocity/accel/fatigue/facing/carry `timeToReach`; no live AI reads it. Directional
> mechanism tests 4/4; the 120-match S1 reliability curve remains monotonic (received
> 33%→92%, intercepted 63%→5%); repeated save fingerprints unchanged (`a9412f22…`,
> `d14a471f…`); perf 5.2µs/step vs frozen 5.32, 14.5 vs 15.0 matches/s. ✅ **S3a
> PerceptionSnapshot representation + layer-gate DONE (2026-07-21, byte-identical):** pure
> copied truth, deterministic keyed observation error, FOV/range, scan latency and last-known
> memory; the on-ball passer keeps an exact ball cue. It is probe-only: no AI consumer, gene,
> save or budget change yet. At 120 matches, synthetic awareness 0.2→0.8 gives position MAE
> 0.54→0.38m, velocity MAE 1.00→0.63m/s, visible players 5.7→8.1 and missed ≤6m threats
> 15.1%→8.3%. ❌ **S3b LIVE CONSUMER TRIED + HONEST-REVERTED (2026-07-21):** shared
> `awareness` attr/save/budget wiring and the on-ball pass consumer passed the mediator
> (awareness 0.2→0.8: target error 0.39→0.13m; lane error 0.063→0.035) plus 74/74
> focused causal tests, but failed the six-layer chain at **PAYS**. At passing 0.8,
> high-awareness lost the 120-match side-alternated duel (pts 1.31 vs 1.46; goals
> 1.48 vs 1.56; completion 73.0% vs 74.4%). Ordinary-Pass-only wiring leaked into
> an omniscient ThroughBall bypass; sharing the snapshot across all pass candidates
> removed that bypass but exposed the existing score table's dependence on omniscience
> (4-season same-world A/B: headers 6.39→4.05, cutbacks 3.96→2.46). One pitch-scale
> sight-range correction restored the overall pass/tackle economy but not payoff or
> route richness, so tuning stopped. All S3b code/schema changes were reverted; HEAD
> remains the byte-identical S3a representation. ✅ **S4a/S5a OFFLINE FOUNDATION DONE
> (2026-07-21, byte-identical):** pure `prediction.ts` mirrors ordinary ground-pass lead,
> launch speed and fixed-step exponential friction; pure `passAffordance.ts` composes S3 observations
> with S1 arrival into an explicitly unscored vector (receiver/opponent ETA, arrival margin,
> control prior, pressure, receive-facing, progression, line breaks, offside and exits).
> Missing observed facts return `null`, never Match truth. Two representation invariants were
> closed alongside it: self-body proprioception is fresh between visual scans, and being
> inside reach radius no longer erases a required body turn. At 120 matches / 9,334 ordinary
> passes, exact-truth arrival-margin buckets are monotonic (target received 30.8→80.0%,
> intercepted 69.2→13.7%); awareness 0.2→0.8 improves usable target coverage 59.5→81.1%
> and arrival-margin MAE 0.160→0.097s while unknown defence is never treated as open.
> Intended-flight error on 7,020 receptions is 0.278s /
> 3.18m (the latter honestly includes kick error + early capture); only 4/9,334 intended
> flights exceed the engine's friction limit. The scalar control prior
> is still under-dispersed (95.2% of truth samples in its top quartile), so it is **not ready
> to act as a live success score**; the raw vector is the accepted output. Gates: build clean ·
> 480/480 · both fingerprints unchanged (`a9412f22…`, `d14a471f…`) · perf 5.38µs/step,
> 14.4 matches/s, profiler determinism OK. **NEXT = define the smallest S7 next-state
> comparator over this vector, then retry one closed S3→S4→S5→S7 behavioural cut; do not
> wire the under-dispersed control prior as a new hand-authored pass bonus.** The body
> model is a LOCAL substrate, NOT the north star.
> Real distinction locked = **which causal variables are in world state + do they support the
> counterfactuals we need** (not "formula vs emergence"). Confirmed facts: `PLAYER_MIN_DIST=1.05`,
> `PITCH_SCALE` scales field+goal+box+center, out/goal use ball-center. (Prior "behavioral
> 50-50 contest" framing SUPERSEDED.)).**
> ✅ **Step 2 DONE:** kept position-aware budget (`SQUAD_BUDGET 35.5`, not 40.0 — vision's
> +9 slots removed) + keeper arc; reverted the whole `vision`/positioning reading-split
> (co-evo files → HEAD; vision stripped from playerGenome/League); tsc + 441 tests +
> saveFile-roundtrip green; NOT pushed/tagged. User + GPT + Claude,
> three-way. The "缺一个行为就加一个 gene" era is over. Two new reference docs:
> - **[`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md)** — S0–S12 causal layers + the gene→hook
>   HARD-CONSTRAINT table. ⭐ Key reframe: **VISION §1's value-field "eye" was NEVER
>   shipped** — live `emergentStation` (`formations.ts:238-348`) is a hand-tuned
>   procedural interim, **no `spaceValue` symbol exists**; the three value-field reverts
>   failed because ONE S5 function was made to carry SIX layers. "team gene" isn't
>   missing, it's fragmented across `TacticalGenome`(23) + `PolicyGenes`(22) + `TeamStyle`.
> - **[`PROBE-CONTRACTS.md`](PROBE-CONTRACTS.md)** — the six-layer acceptance chain
>   (`fires≠works≠pays≠selected≠good-football`), five threshold types, **NO single
>   VisionScore**, the per-phase contract template, probe roster classified
>   BASELINE-NOW / LAYER-GATE / REUSABLE-WORKHORSE / FRAMEWORK-LATER, replay-clip sampling.
>
> **FIRST SLICE = Pass–Arrival–Contest.** slice-1a scope (deliberately narrow): on-ball
> passer perception (S3 stale) + affordance pass-valuation (S5/S7) + contest-at-arrival
> state (S0) + defender co-evolving read (S4). Does **NOT** touch off-ball receiver
> offer-movement (slice-1b) or the TeamBrain→task-bidding refactor (later) — protects the
> play-test-approved `emergentStation` baseline. Build order = PROBE-CONTRACTS §9.
>
> **NEXT (approved in principle, NOT yet done):** ① **settle the tree** — commit
> position-aware budget + keeper; **revert the `vision` 10th-attr** (1 call site
> `PlayerBrain.ts:285`; the map judges it the wrong single-sided fork — use a shared
> awareness+anticipation trunk instead, attack/def asymmetry emerges from spatialIQ/
> decisions/technique) → clean baseline HEAD. ② build BASELINE-NOW probes + freeze
> baseline JSON. ③ `counterfactual-value` feasibility spike (mid-match rollout: deep-clone
> vs replay-to-T — see PROBE-CONTRACTS §8). ④ start slice-1a, six-layer gated, honest-revert.
> **Acceptance = probes + user's eyes JOINTLY** (goals WILL move; §2 = watchability call,
> not goals≈2.0). Detail on the pre-existing uncommitted tree is in the session-wrap block below.

> 🎯🎯 **RESUME (2026-07-20, SESSION WRAP) — user is pivoting to a BIG "球队基因 / team-gene" OVERHAUL
> next.** Read this pointer; the dated blocks below are the detailed session journey (history).
>
> **UNCOMMITTED TREE STATE (no branch; decide keep/commit/revert/fold-into-overhaul BEFORE the
> overhaul, since it edits the same genome files):**
> 1. ✅ **Position-aware budget — VALIDATED, keep-worthy.** `playerGenome.countsForBudget`+`squadTotal`;
>    `League` fire-sale headroom + v32→v33 migration; SAVE_VERSION 33. reflexes keeper-only;
>    finishing/defending free for the GK. §2 bit-identical @8, tracks OLD @25. (SQUAD_BUDGET landed at
>    40.0 once vision was added — see #2.)
> 2. 🟡 **vision/positioning co-evo SPLIT — PLAY-TEST CANDIDATE, VERDICT STILL PENDING.** `vision`
>    (NEW 10th attr) = ATTACKING anticipation (passer velocity-lookahead in laneOpenness/opennessOf,
>    FIDELITY — retires the reverted ×1.15 optimism); `positioning` = DEFENSIVE reading
>    (`canInterceptPass` readMargin `0.5·(pos−0.5)` + reach `10+6·(pos−0.5)`, high-leverage). SEPARATE
>    budget lines (SQUAD_BUDGET 35.5→40.0; SAVE_VER stays 33, vision backfilled 0.5). playmaker
>    re-derived from vision. **CO-EVO CONFIRMED: goals @8 2.47 (attack leads) → @25 3.09 (lead closes)
>    + interceptions @25 19.81 vs base 15.62 (+27% — a reading defence gets selected).** ⚠ user never
>    gave the play-feel 留/调/撤 verdict — the dev server (was localhost:5174) is now stopped.
> 3. ✅ **keeper throw arc — feel, §2-NEUTRAL** (goals 2.47 unchanged). `loftKick` T-floor 0.7→0.9.
> tsc clean · 441/441 tests (the recurring "1 error" = RPC-heartbeat artifact under CPU contention,
> not a failure). Files touched: playerGenome, League, perception, PlayerBrain, traits, careers,
> playerStyle, mechanics, ui/i18n, scripts/probes/jockey-ab + docs.
>
> **⭐ HARD-WON LESSONS (durable — also in memory `feedback-evofootball-emergence`):** the sim is a
> finely-TUNED ~2.0-goal equilibrium; **ANY one-sided behavioral attr change inflates goals** (4
> reverts this session: vision-optimism ×2, awareness-symmetric-but-narrow-defence ×1,
> engine-trait-fix ×1). The FIX = **SEPARATE attack/defence reading genes that CO-EVOLVE** (defence
> gets selected to counter a smarter attack) — the balance EMERGES, don't hand-tune it, and **don't
> gate on §2 at gen 8: watchability is the user's PLAY-TEST call** (§2-as-veto loosened, like the
> density verdict). cross-AI (Codex 5.6-sol ×2, zero-preset → `docs/cross-ai-audits/`) = perception =
> FIDELITY not optimism + separate genes; it also VERIFIED 3 bugs (see backlog).
>
> **📋 BACKLOG / NOT-YET-DONE (held this session; also tasks #2–#7):**
> - **Feel polish (task #4, §2-adjacent → do 1-at-a-time, HMR'd for the user to feel):**
>   walk-while-holding (keeper is FROZEN in `HoldPosition` PlayerBrain.ts:98 while holding),
>   goal-kick "pinball" targeting (runs through the normal vision-gated pass loop; needs a probe to
>   root-cause), 忠于脚 sim carry cadence (vary carry foot↔knock; the render-only version rolled the
>   ball BACKWARD → reverted; §2-touching).
> - **顺手修bug (VERIFIED vs code):** ① `engine` trait gated on `pace` (traits.ts:68) but cuts stamina
>   drain (Player.ts:176) → pace = fast-AND-tireless super-stat (tried gate→stamina: +24% goals + a
>   test broke → needs care/re-tune); ② GK `positioning` DEAD (first-touch returns early for GK
>   mechanics.ts:31) → keeper pays budget for nothing; ③ `mutateSquad` UNUSED in production (variation
>   only via careers/newgens; no post-crossover mutation) = dead fn + a real evolution-variation gap.
> - **Deferred attribute program (Codex-A, bigger):** split pace/agility, split control/dribbling,
>   make strength a physical mass/duel effect + retire hand-authored AERIAL_ROLE, weak-foot/pref-foot.
> - **Emergence-blueprint work:** cut-inside (#3), off-ball eyes / box-arrival + check-to-ball (#2),
>   coach-global value field (#6), possession 50-50 + transition urgency (#7), width-floor retire
>   (#5, blocked on width paying). ⚠ FOUNDATIONAL DEFECT B still open: formations are a hand-authored
>   rigid table (no emergent shape / opponent-response / drop-to-receive) — see the emergence memory.
>
> **→ NEXT = the OUTFIELD BASE (user 2026-07-20: "门将底座没必要大手笔…但场上踢的是真的影响,
> 底座需要做的很好" = keep GK LIGHT ✓done, invest the real substrate work in the OUTFIELD).**
> ⚠️ **Sub-step 2 (vision attr) FIRST CUT = "读数精度 on PASSING" — TRIED + REVERTED (honest-revert,
> §2 hard gate).** Added `vision` (10th attr, budget 35.5→40.0) + wired it as a continuous
> lane-read multiplier replacing the binary `playmaker` ×1.15. BOTH tunings FAILED §2: goals
> +23% (lane+open) / +17% (lane-only, mean-centred), headers −25–34%, aerial route collapses.
> **STRUCTURAL, not a tuning miss: passing→goals is CONVEX, so making the best passers sharper
> inflates scoring even with a mean-preserving spread — a one-sided attacking buff.** Fully
> reverted → tree bit-identical to sub-step-1 baseline again. **→ the fix (user's call, asked):
> vision must be applied SYMMETRICALLY (gate the DEFENDER's interception/anticipation read too,
> so attack↑ is balanced by defense↑ → §2-neutral), OR defense-read FIRST (likely §2-neutral-or-
> better), OR defer vision & do `positioning`-live (sub-step 3) next.** Sub-step 3 = wire
> `positioning` LIVE off-ball (today only a first-touch sub-term). De-dead-weight `strength`.
> One sub-step, §2-gated, honest-revert. Fork B (distinct GK attr template) DEFERRED — chose light A.
>
> ✅ **CROSS-AI CONSULT DONE (2026-07-20, user-directed; Codex gpt-5.6-sol xhigh ×2 zero-preset +
> my own take → `docs/cross-ai-audits/2026-07-20-attr-vision-engine/SYNTHESIS.md`). UNANIMOUS:**
> **DON'T add a `vision` attr — REPURPOSE the near-dead `positioning` gene into "AWARENESS/意识"**
> (keep the serialized key). Model perception **FIDELITY** (the player's ESTIMATE of state), NOT
> optimism: **retire the `playmaker` ×1.15**; awareness affects READING/REACTION only (never speed/
> pass/shot/tackle/reach — no double-pay). **SYMMETRIC — ship attacking + defensive reads TOGETHER**
> (passer's lane read AND defender's interception/marker read) = the balance keeper; that's why my
> one-sided vision inflated goals (convex + max-over-~5-candidates). Determinism-safe (bounded
> velocity lookahead and/or seeded persistent epoch error; never Math.random). Route-gate not just
> goals~2 (headers/combos/carry/through/build-up).
> **3 VERIFIED bugs (checked vs code) = the "顺手修" backlog:** ① `engine` trait gated on `pace`
> (traits.ts:68) but cuts stamina drain (Player.ts:176) → pace is a fast-AND-tireless super-stat;
> ② GK `positioning` DEAD (first-touch returns early for GK mechanics.ts:31) → keeper pays budget
> for nothing (the awareness repurpose fixes this IF GK awareness gets wired); ③ `mutateSquad`
> UNUSED in production (variation only via careers/newgens; no post-crossover mutation).
> **DEFERRED backlog (Codex-A's broader program, NOT now):** split pace/agility, split control/
> dribbling, make strength a physical mass/duel effect + retire hand-authored AERIAL_ROLE, weak-foot.
>
> **→ USER DECIDED: NARROW (意识优先 + 顺手修bug).** DO next, one §2-gated lever at a time,
> honest-revert: **(L1) repurpose `positioning`→awareness = perception FIDELITY, SYMMETRIC (passer
> lane/openness read + defender interception read use awareness-perceived positions), retire the
> playmaker ×1.15.** Mechanism (my call): start with the DETERMINISTIC anticipation lookahead
> (`perceivedPos = pos + vel·0.30·(aware−0.5)·T`, T bounded ~0.8s, aware 0.5 = today exactly, zero
> RNG), plugged into the shared pass/intercept read first (B-rank1). §2-gate (goals ~2.0 + route
> mix intact); genome KEY unchanged (positioning stays) so NO new save-ver/rebaseline for L1.
> Then (L2/L3) the 3 bug fixes as separate clean levers. Attribute splits = deferred backlog above.
>
> ⚠️⚠️ **OUTCOME (2026-07-20): L1 awareness TRIED+REVERTED (goals +32%, worse than vision); engine-
> trait bugfix (pace→stamina) TRIED+REVERTED (goals +24% + broke a test). That's FOUR §2 failures
> this session (vision×2, awareness×1, engine-trait×1) — a META-PATTERN, not bad luck.** ⭐ **THE
> LESSON: the sim is a finely-TUNED ~2.0-goal equilibrium, and essentially EVERY behavioral
> attribute change inflates goals** — because (a) improving option-SELECTION is convex→goals; (b)
> the goal-SUPPRESSION side (keeper/marking/interception) is far LOWER-leverage in the code than the
> attacking side, so perturbations bias UP; (c) the equilibrium was tuned WITH the current quirks
> (even "fixing" engine-on-pace de-tuned it). The ONLY §2-safe change this session (position-aware
> budget) was safe precisely because it was bit-identical @8 (changed no decisions). **→ IMPLICATION:
> "make every outfield attr bite MORE" (甲's premise) inherently fights the §2 tuning. Unblocking it
> needs a STRATEGY decision (put to user): (A) treat §2 as a JOINT target — pair each attr-enrichment
> with a compensating goal-suppression re-tune (keeper save / xG / defensive success) to hold ~2.0;
> (B) only §2-neutral-by-construction changes (very limited); (C) STOP per-attr enrichment, COMMIT
> the validated budget win, redirect to the emergent-positioning foundational defect B or play-feel;
> (D) RE-BASELINE the §2 tolerance — maybe 2.2–2.5 goals is still watchable if the football is richer
> (user's call — I'd been treating ~2.0 as inviolable, but watchability is the user's to define).**
> Tree = validated sub-step-1 (position-aware budget) + docs + `docs/cross-ai-audits/` only.
>
> 📌 **Current PASS model (answer to user 2026-07-20 "能按队友/对手位置+下一步动向传吗"): POSITIONS
> yes (candidate loop scores each mate by `laneOpenness`=opponent-blocked lane + `opennessOf`=nearest
> marker + forward-gain); NEXT-MOVEMENT/anticipation mostly NO (reads are CURRENT-position snapshots;
> only through-balls project space ahead + execution leads the receiver). Adding velocity-anticipation
> to the passer's read is exactly L1 (reverted, +32%).**
>
> ✅✅ **RESOLUTION (2026-07-20) — user reframed: "进球多是应该的,但防守也要能进化来平衡" + chose
> SEPARATE attack/defence reading genes + LOOSEN the §2 goal-veto (user play-tests watchability like
> density). LANDED (uncommitted, PLAY-TEST CANDIDATE):**
> **`vision` (NEW 10th attr) = ATTACKING reading** (passer's velocity-lookahead anticipation in
> `laneOpenness`/`opennessOf`, FIDELITY not the reverted ×1.15 optimism; `PlayerBrain` passLook =
> `0.3·(vision−0.5)·0.7`); **`positioning` (existing) = DEFENSIVE reading** (`canInterceptPass`
> readMargin `0.5·(pos−0.5)` + reach `10+6·(pos−0.5)` — sized HIGH-leverage on purpose). Separate
> budget lines (SQUAD_BUDGET 35.5→40.0; SAVE_VER stays 33, vision backfilled 0.5) so the balance
> CO-EVOLVES. Playmaker trait re-derived from vision. **✅ CO-EVOLUTION CONFIRMED (the whole point):
> goals @8 = 2.47 (attack leads early, +0.47 vs base 2.00) → @25 = 3.09 (≈ base deep 3.19; the lead
> CLOSED) while interceptions @25 = 19.81 vs base 15.62 (+27% — a reading defence got SELECTED).**
> tsc clean · 441/441. Richer football (anticipatory passing + ball-reading defence + more
> interceptions) WITHOUT goals running away. **→ AWAITING USER PLAY-TEST verdict** (`npm run dev`
> localhost; or push live for phone). If kept: this is the vision attr done right (co-evolving split,
> not the one-sided optimism trap). ⚠ genome now has vision → real save-ver/rebaseline lives here
> (SAVE_VER 33 batches position-aware budget + vision). NOTE: earlier §2-as-hard-veto framing above
> is SUPERSEDED for behavioral levers — watchability is the user's play-test call now.
> **顺手修bug backlog still open:** engine-trait-on-pace (tried→+24%, needs care), GK-positioning-
> dead, mutateSquad-unused. Attribute-splits = deferred backlog.

---
⭐⭐⭐⭐⭐ **2026-07-20 SELF-DRIVE — density KEPT (user 留) + step-2 lever REVERTED→REFRAMED (⭐ NEWEST).**

**Density verdict:** user play-tested → "观赏性我觉得没问题,可以go,你自走吧" = **KEEP**.
PITCH_SCALE 0.70 + emergent-default are the CONFIRMED baseline now (see #1 above),
not a candidate. Sequence unblocked.

**Step-2 lever tried = RETIRE the in-possession width FLOOR (`formations.ts:266`,
`widthMul` floor 1.0 → gene-driven 0.55..1.55). REVERTED (honest-revert, §2 hard
gate).** Clean single-lever A/B vs HEAD (baselines captured):
- ✅ **§4 diversity WIN** — `positioning-shape` WIDE−NARROW spreadY divergence
  **1.2m → 2.1m (+75%)**; WIDE stays wide (6.0), NARROW gets genuinely narrow
  (3.9). Width finally expresses across the `attackingWidth` gene.
- ❌ **§2 watchability FAIL** — the SAME change congests the middle: `calibrate 8`
  **goals 2.00→2.26 (+13%)**, shots +11%, **headers +24%** (10.5→13.0), fouls/cards
  up, through-balls down; `positioning-shape` nn-dist tighter across the board;
  `clump-vs-wide` gap **WIDENED 3.4×→5.4×** (CLUMP 3.48/WIDE 1.02 → 3.38/0.63).
- ⭐ **DIAGNOSIS (the reframe):** the width floor is a genuine COMPENSATING bias —
  but it compensates for **width-not-paying**, and that root cause is UNFIXED.
  Retire the floor before width pays → the meta just slides NARROWER into the
  中路乱抢 the user hates. **So step-2 (retire width biases) is BLOCKED on step-3
  (QUALITY CLUSTER must make wide play connect/pay FIRST — attack the box, combos
  reliable — THEN retire the floor and re-observe).** Queue RE-SEQUENCED: 3 → 2.
- ⭐⭐ **ROOT CAUSE PINNED (2026-07-20 diagnostic probes, dense pitch):** WHY
  width doesn't pay = **the final ball into the box finds too few attacking bodies
  + a third of deliveries die in flight.** `cross-anatomy`: crosses convert ~5%
  (NOT ≈0 — the clump-vs-wide extreme overstated it), but **46–54% of crosses are
  `noAerial` = NOBODY contests them** (vs BUS 54%, atkHeader 25%→18% — the box is
  under-crashed, worst vs a packed block). `cutback-anatomy`: cutback→goal 5.3%,
  only 20% → shot, **35% die in flight (mostly intercepted)**, 39% of arrivals
  lost. **→ The true upstream lever = OFF-BALL MOVEMENT INTO DANGEROUS SPACE
  (crash the box on a delivery; proactive drop/arrive to receive) — the SAME root
  as combo-reliability + check-to-ball (step-4). `supportSpot` is always AHEAD of
  the ball & nobody attacks the 6-yd/penalty-spot on a wide ball.** This is the
  next probe-first lever (gene-gated arrival, NOT a scripted run). cf. the earlier
  obs8 pass-power revert — same lesson, combo bottleneck is upstream positioning.
- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
  field, two levels: player-local + coach-global). VISION §1 rewritten with the
  user's words (内切/包抄/回撤 should EMERGE from ONE value field, not be hand-added).
  Tasks re-cut (#2 player value field · #3 cut-inside via same logic on carry
  direction · #5 width-floor deferred · #6 coach-global value field · #7 possession
  contest+transition).**
- ⭐⭐ **FIRST CUT of the value field REVERTED (honest-revert, 2nd this session) — but
  a KEY DESIGN CORRECTION.** Rewrote `supportSpot` into a gene-weighted candidate
  scorer (base + box-crash + drop candidates, scored by openness+receivability−clump
  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
  46→50% / 54→59% — box got EMPTIER), §2 regressed (`calibrate` goals 2.00→2.42 +21%,
  cutbacks 3.69→3.29, headers 10.5→7.8), width didn't rise (`scheme-matchup` W-v-Z
  0.67→0.48). **LESSON: an openness-maximizing value field is the WRONG model for
  BOX-ARRIVAL — the box is a LOW-openness contested zone, so the scorer AVOIDS it +
  scatters supporters into empty pockets (→ emptier box, +turnovers, +goals).**
  → **Split the design: (a) CHECK-TO-BALL / support / overload / drop = genuinely a
  space-value(openness) field ✅; (b) BOX-ARRIVAL = delivery-ANTICIPATION, NOT
  openness — must be COUPLED to an imminent wide delivery (extend `TeamBrain.
  assignRunners` arriver → gene-scaled multi-body crash, TIMED like the corner
  hold→burst), the cutback-arriver mechanism generalized.** Do box-arrival (a
  delivery-coupled licensing change) as the next cut; keep the value-field for
  check-to-ball separate.
- ⭐⭐⭐ **CUT 2 (two-eye value field: space + BALL, per user "得知道空间在哪+球在哪")
  ALSO REVERTED — same signature. → STOP hammering box-arrival-via-supportSpot;
  RE-DIAGNOSE.** Both cuts: box did NOT fill (`cross-anatomy` noAerial 46→51%), §2
  regressed (goals 2.00→2.41 +20%, **offsides 2.20→3.36 +50%**), width did NOT rise
  (`scheme-matchup` W-v-Z 0.67→0.48). **THE OFFSIDES SPIKE is the tell: bodies DO try
  to attack the box now but arrive OFFSIDE (uncoordinated with the delivery) → box
  stays empty + structure disrupted → goals inflate via broken play.**
- ⭐⭐⭐ **KEY under-weighted data + the REFRAME:** (1) a BALANCED team ALREADY fills
  the box fine (`cross-anatomy` BAL: noAerial **26%**, atkHeader **33%**, goal/shot
  16%) — box-arrival is NOT universally broken; it's CROSS-SPAM (early/excess crosses
  outrun arrival) + the extreme WIDE genome being a bad archetype. (2) **WIDTH is a
  LOW-EV mode vs EVERY defense (0.5–1.0) while central CARRY is HIGH-EV (2.2–3.2) —
  because CROSSING IS INHERENTLY LOW-YIELD (cross→goal ~5%), which is REALISTIC (real
  open-play crosses are ~1–2%).** So "make crosses out-score central carry" is the
  WRONG goal — unrealistic. Real width's value = STRETCH the defense to OPEN the
  center + let wide men CUT INSIDE into the high-EV central space (inverted winger),
  NOT out-cross the middle. The unrealistic thing is CENTRAL CARRY being TOO strong
  vs non-zonal defenses (zonal already bites it 58→14; man/default gets shredded; only
  1–2/16 play zonal). **Two candidate realistic levers to STEER on: (A) CUT-INSIDE —
  wide→cut into the opened center (taps the high-EV carry from wide, validates the
  user's earlier instinct); (B) punish CENTRAL CARRY through congestion vs non-zonal
  too (过一个还有另一个, so the clump stops being a free lunch). Box-arrival/crossing =
  accept it as the low-yield supporting weapon it realistically is.** Awaiting user steer.
- Tree left CLEAN at HEAD `ed62978` (only ledger/VISION docs changed). Baselines
  saved this session: calibrate goals 2.00 / cutbacks 3.69 / compl 75%; posshape
  WIDE 6.4 / NARROW 5.2; clump-vs-wide 3.48/1.02; cross noAerial 46/54%; cutback
  20%→shot 5.3% goal; scheme-matchup W-v-Z 0.67 / W-v-M 1.02 / D-v-M 3.18 / D-v-Z 2.23.
- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
  "从底层做了一个足球引擎,方向是对的").** Eyes = 球+对手+队友+场地+**自身**(朝向/我的属性/
  体能)+**动态·预判**(对手结构=提前观察+预判);space is DERIVED; inputs feed multi-dims
  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
  named: engine-first is 承重级/slower/"worse-before-better" → build incrementally, keep the
  baseline revertible, each engine piece must BEAT §2 to ship.
- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
  = DEAD for 8/9 (GK-only reads)**; **`positioning` = near-inert** (only a first-touch
  sub-term; its docstring's off-ball IQ never shipped) — ironically the attr the SELF/off-ball
  eye needs; **`strength` = one-trick** (aerialSense 0.30, near-decorative on the ground).
  STRONG/live: pace · passing · dribbling · finishing · defending (stamina medium). ATTR-BLIND
  mechanics (flat constant an attr could bite NOW): **`TURN_RATE` 6.5** (agility — everyone
  turns identically; bites cut-inside/1v1), **`SHOT_SPEED` 27** (open-play shot power flat),
  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
  `playmaker` trait) = the biggest gap + exactly the "eye-quality" the eyes model needs.
  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
  composure(4) · raw aerial/jump(5) · shot-power(6) · tackle-vs-mark(7) · accel-vs-topspeed(8) ·
  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
  fingerprint rebaseline = USER's architectural call.**

---
⭐⭐⭐⭐⭐ **2026-07-20 SESSION WRAP — GAP BASELINE + SELF-DRIVE QUEUE (⭐ RESUME HERE FIRST).**

**LIVE STATE (HEAD `163f16b`, on Pages):** the density 相变 is SHIPPED as a
candidate (pitch scale 0.70 + emergent positioning DEFAULT — see the block
below). Render/view fixes also shipped: the 3D renderer is now RESPONSIVE
(fills the viewport, cinematic fills the page — `ThreeMatchRenderer.resize()` +
ResizeObserver, NO fullscreen API) and the green adboard "beams" scale with the
pitch. Iterate render/feel with **`npm run dev`** (localhost:5173, fast HMR — no
CI wait); commit+push (personal acct `Quarkgluonmixture`, `gh auth switch`) when
confirmed; trust the browser for pixels (headless flaky).

✅ **#1 DECIDED 2026-07-20 — the density 相变 is a KEEP.** User play-tested and
判决: "观赏性我觉得没问题,可以go,你自走吧" (watchability is fine → GO; self-drive).
PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
not a candidate. Data said GO (cutbacks +235%, scramble-born goals flat 4–7% to
0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
unblocked → now on **step 2: retire the compensating width hand-biases + re-run
evo + OBSERVE diversity on the denser pitch.**

**GAP BASELINE (code-verified inventory 2026-07-20). The substrate is FAR more
complete than a "missing systems" story — most of real football's repertoire
already EXISTS and is gene/attr-driven** (shooting: long/chip/header · dribbling:
knock-and-run/shield/slalom · link: lay-off/one-two/overlap/third-man/cutback ·
set-plays: corners 4-routine/FK/penalty · transition: counter + gegenpress-vs-
drop). So the distance to real football / VISION §3 is mostly EXECUTION QUALITY
+ a few missing abilities + feel, NOT missing systems:
- **QUALITY gaps (why it still "looks not-real"):** ① combos unreliable — 二过一/
  做球/倒三角 mechanics exist but pass力学 (short-pass ~9 m/s floor + lateral
  `orientationNoiseMul` + one-touch `oneTouchMul`) makes them physically miss
  (obs8; naive fix REVERTED — redo RIGHT on the denser pitch where passes are
  shorter). ② possession too discrete — capture = geometric nearest-within-1.25 m
  INSTANT owner-flip (`Match.ts:1776-1842`), no physical 50-50 contest/jostle
  (user-flagged). ③ no transition urgency — `MarkOpponent` has no counter/track
  sprint lever (obs5). ④ goal-kick pinball (obs2), keeper throw too flat (hits
  mates), keeper can't walk while holding (Bug3).
- **Genuinely MISSING abilities (add as GENE-GATED abilities, not scripts):**
  **check-to-ball / drop-to-receive (回撤接应, proactive — supportSpot is always
  AHEAD of the ball; this is ALSO the upstream of combos, obs7)**, cut-inside
  (内切 — dribble only goes down the line), volley, underlap; + decision richness
  (place-vs-power & near/far-post are AUTO in open play, not chosen).
- **§1 cleanup:** retire the compensating hand-biases (the width levers) on the
  denser pitch, then re-run evo + OBSERVE diversity.
- **Feel/visual:** dribble touch cadence (DECIDED = 忠于脚, SIM-level carry
  cadence, not a render fake), keeper throw ARC (raise it), keeper walk-holding.
- **Deliberate arcade deviations — do NOT "fix"** (VISION §3): throw-in→kick-in,
  offside→goal-kick, no indirect FK.

**SELF-DRIVE SEQUENCE (one lever · probe-first · A/B · emergence, VISION is the
acceptance test):**
1. Land the density verdict (user play — 留/退).
2. Retire compensating hand-biases + re-observe diversity on the denser pitch.
3. **QUALITY CLUSTER (the biggest step to "looks real"):** combo reliability
   (pass力学, done right on the denser pitch) → physical possession contest
   (capture 50-50 duel) → transition sprint urgency.
4. **MISSING abilities:** check-to-ball (回撤接应) → cut-inside.
5. **Feel polish:** 忠于脚 touch cadence → keeper throw arc + walk-holding →
   goal-kick targeting.

(This session's play-triage + all the shipped fixes are in the dated blocks
below; VISION.md stays the gold standard, this is the current gap snapshot.)

---
⭐⭐⭐⭐ **2026-07-20 THE DENSITY 相变 — SHIPPED AS A PLAY-TEST CANDIDATE (⭐ NEWEST RESUME POINT).**
VISION §1 named two load-bearing substrate roots behind the endless width/position
reverts: (A) space/density + (B) emergent positioning. This phase does BOTH,
probe-validated first:
- **Probe** (`scripts/probes/density-probe.ts`, scale-invariant, goal scaled with
  pitch): swept PITCH_SCALE 1.0→0.55 with emergent ON. Clean gradient — cutbacks
  MONOTONICALLY up (1.59→3.89@0.70, +145%), strong-side r up (0.78→0.86),
  proportional clumping DOWN, scramble-born goals flat 4–7% until 0.55 where it
  JUMPS to 16% (the 乱抢 cliff). **Sweet spot ≈ 0.70** (213 m²/player) — passes
  VISION §1+§2+§3 together (my first confounded run wrongly said §2 worsened; the
  fix was scaling the clump radius + the goal).
- **SHIPPED (candidate, uncommitted→committing):** `PITCH_SCALE` default **0.70**
  in `constants.ts` (scales PITCH_LENGTH/WIDTH/BOX/CENTER/GOAL — physical sizes
  fixed); **emergent positioning is now the DEFAULT** (`formations.ts`
  emergentPosOn()→true; fixed tables scaled by PITCH_SCALE for the legacy path +
  diagrams; `GameApp.readEmergentPos` default true). 26 tests re-baselined for the
  new geometry (subagent, only tests/, no assertion gutted, verified). Gates at the
  new default: **calibrate cutbacks 1.10→3.69 (+235%)**, completion 75%, goals 2.00,
  balanced; **goals-warming late-mean 4.35 avg (DOWN from the old pitch's 5.07 —
  LESS inflation)**. tsc+build+441 tests green.
- ⚠ **NOT yet the final verdict:** VISION §2 watchability is the USER'S eyes
  (trust the browser). Awaiting the play-test: does 0.70 look good / not cramped /
  tactics legible? goals 2.00 is a touch low (small goal) — nudge goal scale up if
  they want more scoring. **Honest-revert if §2 fails visually.** PITCH_SCALE=1
  restores the old pitch.
- **Dribble philosophy DECIDED: 忠于脚 (real touch cadence, sim-level)** — queued
  AFTER density. My render-only fake cadence (obs4) made the ball "roll backwards";
  REVERTED to the always-ahead glue. A true touch rhythm needs the SIM to vary the
  carry distance (foot↔knock), not a render trick.

---
⭐⭐⭐ **2026-07-20 PLAY-TEST TRIAGE + 画面 BATCH (earlier today).** User play-tested
on Pages **with the emergent field ON** and reported 8 observations + 3 keeper
notes + an evolution-UI ask. Root-caused every item (5 Explore probes). Priority
was "画面 bug first"; that batch is **SHIPPED+PUSHED, HEAD `e4cb39a`** (CI deploying):
- **obs4 dribble ball cadence** (render): ball floated at constant distance +
  rolled smooth → per-stride fore-aft touch cadence around the 0.85m glue.
- **obs1 "转身球飞出去"** (sim): `performDribbleTouch` knocked along `heading`
  (rate-capped, lags velocity through a turn) → aim along **velocity/travel**.
  A/B: recollect 80.4→82.4%, poke 13.6→12.8%, goals calib-8 2.40→2.26,
  cutbacks 1.10→1.30; the baseline 'knock' regime 3.2% was largely the
  fly-away artifact (maxGap≥2.4m) → 0.1%, genuine big pushes remain.
- **keeper catch-lurch** (render): model was planted at the dive-START spot
  (up to ~3m behind the catch) → now TRACKS sim through the lunge (diveT<0.45),
  pins only once grounded (keeps the "feet don't slide" fix).
- **keeper hold-jitter "一抽一抽"** (sim): held-ball carry keyed on gkHoldTimer
  only → sawtoothed 0.3↔0.85 in the 21% re-arm gaps → now spans gkDistributing
  (like the other Phase-31.9 consumers). NOTE: hold-jitter probe's carry-flip
  metric is BROKEN (resets prevHeld via the non-owning keeper each frame,
  always 0) — verified by code logic, not measurement.
- ⚠ Fingerprint drifts (2 sim changes); no stored baseline; determinism is
  test-covered (441 green).

**NEXT 自走 QUEUE (2026-07-20):** user said "自走,有问题再找我".
1. **Evolution pre-match FULL-SCREEN UI** — ✅ **v1 SHIPPED**: ClashBanner
   restyled full-screen (inset:0 over the pitch, holds while paused between
   fixtures, hides on ▶); each side now LEADS with the emergent nameplate
   identity (z-score, not imposed) + draws the evolved formation SHAPE via
   `formationDiagram` (atk+def); formation slug demoted to the diagram caption.
   Pure UI, fingerprint untouched. NOTE: chose the SAFE half — did NOT add a
   hard pause-on-show (avoids autoHighlights/binge interference); it relies on
   the existing between-fixtures pause. If the user wants pause-until-tap
   (blocking), that's the follow-up. Emergent shape (emergentStation) has no
   static 6-spot table → the diagram draws the fixed-table shape; drawing the
   TRUE emergent shape needs a live-Team/Ball sample (future).
2. **B-group SUBSTRATE (needs A/B — user should steer; this is the "combination
   football is structurally weak" story = VISION §3):**
   - **obs8 combo-pass overhit** (倒三角/二过一, esp. lateral): short-pass ~9m/s
     power FLOOR + capture is a 1.25m geometric disk + lateral orientationNoiseMul
     ~×1.3 + one-touch oneTouchMul ~×2. ⚠ **ATTEMPT-1 REVERTED (2026-07-20)**:
     softened sub-5m pass power (`×0.65+d·0.07`). A/B: calibrate-8 goals
     2.26→2.63 (+16%, WRONG direction / evolutionary divergence), cutbacks
     1.30→1.08 (−17%), completion flat; combo-rates oneTwos/overlaps flat-to-down
     but those counts (0–0.33/match, random genomes) are pure NOISE. Verdict: NOT
     the combo lever — cutbacks fell, no combo lift, unintended goal inflation.
     **Reframe:** the combo bottleneck is UPSTREAM — combo INITIATION + support
     POSITIONING (players don't get close enough / don't offer), i.e. the SPACE
     defect + obs7 check-to-ball, NOT isolated pass execution. The real lever is
     the support-shape/density substrate (needs the coordinated pitch-shrink call
     per the emergence memory), not a pass-power tweak. ← DEEP substrate, user
     should steer.
   - **obs7 迎球接球**: reactive meet-the-pass EXISTS (interceptBall); missing =
     proactive check-to-ball / offer as outlet (support-shape).
   - **obs5 transition urgency**: `MarkOpponent` speed has NO counter/transition
     sprint lever — a defender tracking a breakaway runs at normal pace. Substrate
     GAP (nothing to select), not a local optimum.
   - **obs6 CBs clump on goal kick** (field WAS ON): emergent B1-b anti-clump too
     weak in the deep-central goal-kick band → strengthen repulsion there.
   - **obs2 goal-kick pinball**: hoof = upfield+random, no target/min-dist;
     ground goal-kick has only a soft d<5 penalty and laneOpenness ignores
     teammates in the landing zone.
3. **keeper Bug3**: keeper can WALK while holding (feature; HoldPosition target
   is locked to the goal band — hook a short walk-out target).


The user extended the emergence pivot into a full four-stage vision (Engine →
Visibility → World → Substrate): tactics, players, COACHES, seasons and cups
all evolving with earned identities, fast + visible divergence, on a
high-quality substrate. **Resume there** — it sequences everything below and
in EMERGENCE-PIVOT.md (which stays canonical for rationale, the substrate
audit, and the turnkey 5→8 attribute scope). Stage-1: ✅ **phase-45**
(套路 → policy genes, save v13, coherence baseline) + ✅ **phase-46**
(keeper-aware carry cone: maxed-genome keeper-collects 9%→5%, shots 39%→43%) +
✅ **phase-47** (attrs 5→8, save v14 — WG evolve as dribblers, MF as
passers; finishing aim slope retuned after its payoff measured dead) +
✅ **phase-48 SHIPPED** (the RESOURCE BUDGET keystone: `SQUAD_BUDGET` 24 caps
attribute inflation dead, newgens are club BLOODLINE not random+ROLE_BIAS,
stars-vs-balanced emerges, strength/stamina finally have a PRICE; defending repriced
0.24→0.34 after leagues drained DF to fund attack) + ✅ **phase-49**
(visibility v1: data-driven NAMEPLATES, the style-space map + divergence
curve + budget heatmap) + ✅ **phase-50 SHIPPED** (results-dominant fitness —
the three uniform-virtue rewards dropped; measured verdict: the SPEED target
was already met post-budget, remaining speed levers PARKED). **STAGE 1+2 COMPLETE** +
✅ **phase-51 SHIPPED** (the EVOLUTION CENTER — evolution got its own screen
per the user's report: scrubber-driven style map, club deep dive, dynasty
wall; league screen back to pure data) + 51.1 (four style-space lenses) +
51.2 (keeper-hold + restart-taker facing, behavioral) + ✅ **phase-52
SHIPPED** (Stage 3 opens — **W4 the SEASON CHRONICLE**: `sim/chronicle.ts`
title-race mining from the points timeline, the era-banded 编年史 league
tab, era names DISCOVERED from the records via `evolution/eras.ts`, and
the era strip on the dynasty wall; ZERO sim change — fingerprint
untouched; evidence in the blueprint ledger) + ✅ **phase-53 SHIPPED**
(**W1 the COACH** — the philosophy embodied in a named, aging person;
rebirth = hiring, the sack/hire memetic channel, mentor tree, dugout hall;
save v15; the monoculture HARD GATE passed with spread ratios 1.15/0.98).
+ ✅ **phase-54 SHIPPED** (**W2 PLAYER PERSONAL STYLE** — per-player
appetites as multipliers on the coach's policy through the rolePolicies
wire; badges-of-genes traits 🎲🪄👻, earned personal nameplates, career
highlights on the player card; save v16) + ✅ **phase-55 SHIPPED** (**W3
the FIRE-SALE** — dead clubs' players hit the market with careers intact,
signed only at retirement vacancies under the budget; feeds the
rebuilding, not the rich; save v17). **STAGE 3 (the WORLD layer) IS
COMPLETE** — chronicle + eras, coaches + the memetic channel, player
personalities, and the fire-sale all live — + ✅ **phase-56 SHIPPED**
(the **PLAYER CENTER** 👥, from the user's first world-layer report: the
96-player style-space map with role lenses, the player deep dive with
diverging appetite bars, the transfer market + signings chronicle, the
trait census; UI-only, fingerprint untouched) + ✅ **phase-57 SHIPPED**
(**N1 the COUNTER-PLAY MATRIX probe — VERDICT: TRANSITIVE, the gate
FIRES**: 0 cyclic / 21 decisive triads across 12 archetypes from 3
worlds; one meta — narrow+direct+aggressive+risk-on — dominates;
attackingWidth correlates −0.74 with winning; probe-only, fingerprint
untouched; full anatomy in the blueprint ledger) + ✅ **phase-58
SHIPPED** (**N1.5 lever 1 — the ENERGY ECONOMY BINDS**: FT stamina was
0.98-0.99 and every fatigue payoff decorative; repriced
drain/recovery + tackle lunges cost legs via `spendBurst`. Measured:
FT 0.69-0.87 with style spread, markingAggression winning-correlation
**+0.51 → −0.54**, era arms race dissolved .607→.524, width freed;
matrix cycles still 0 — meta rotated to runners+compact-block; vitest
361, visual 106+37, fingerprint REBASELINED `ce0e5c2e…`) + ✅
**phase-59 SHIPPED** (**N1.5 lever 2 — the REACTION GATE**: bystanders
must SEE a live pass to touch it — blind-side deflections whiff
(`DEFLECT_BLIND_PEN`) and bystander captures roll a reaction gate
(`CONTACT_BLIND_PEN`); the cutback anatomy probe traced ~60% of
pull-backs dying to UNCONDITIONAL mid-flight captures. Measured:
delivery 33-40%→43-50%, vs-COMPACT cutback conversion 1.4%→3.3%,
completion 68%→73-76%; **the matrix gate produced the FIRST CYCLE —
Tiki-taka > Compact bus > through-ball surgeons > Tiki-taka — cyclic
4.5%, no unbeaten king, era arms race inverted (.431)**; vitest 361,
visual all-pass, fingerprint REBASELINED `5ec853a4…`).
+ ✅ **phase-60 SHIPPED** (**N1.5 lever 3 — the UNSET WALL**: shot
blockers weigh by facing·stillness at both the appetite and the block
roll; the crossBase+0.87 hypothesis was A/B-refuted first
(`cross-anatomy.ts`); floor swept 0.3→0.55 after 0.3 broke the
attack/defense balance. **Matrix: 3 cycles, 7.5%** — trajectory
0→0→4.5→7.5% across the three N1.5 levers; defensive styles back in
the top tier; vitest 363, fingerprint REBASELINED `b59eeb10…`).
+ ✅ **phase-61 SHIPPED** (**N2 — SUBSTITUTIONS / the bench**: 9-man
rosters under a widened `SQUAD_BUDGET` 36 — a deep bench is funded by
a shallower XI; dead-ball subs driven by the new `rotationBias` gene
(fatigue threshold; tiredest off, like-for-like on; SUBS_MAX 3, no
re-entry, keepers stay); roster-indexed playerStats + `apps` so a
sub's goals land on HIS career; save v18. Probe: the trigger binds
monotonically AND selection is ecology-dependent — world 424242 goes
full carousel (gene .465→.886, 1.46 subs/team/match) while world 991
keeps a mid spread (~0.5 subs) — two rotation cultures, not a uniform
virtue. Calibrate **2.70/2.59 — both seeds back in band, the phase-60
goals watch RESOLVES**. ⚠ Matrix gate RE-BASED (new founding worlds):
0 cycles / 26 decisive, pressIntensity +0.87 — rotation partially
refunds the press fatigue tax. vitest 368; visual 106+37; fingerprint
REBASELINED `9357f90a…`; ARCHITECTURE failure mode 27 added — the
phase-60 blocks test had shipped latently red after its late sweep.)
+ ✅ **phase-62 SHIPPED** (**N1.5 lever 4 — CARDS THAT BIND**, save
v19: personal yellows/reds; a red or every 3rd league yellow = a
one-match ban SERVED BY REAL LINEUPS — the like-for-like bench body
covers the slot, 🚫 on team cards; referee repriced with a steeper
aggression slope after probe A found the old card volume a dead wire.
Probe B: 4-9 banned man-matches/season actually served, targeted at
MA-0.7+ clubs. vitest 377; fingerprint REBASELINED `e5abf0da…`.
⚠ calibrate 2.57/2.29 — 424242 knife-edge under the 2.3 floor,
re-rolled ecology, watch not chase. **The N1.5 close attempt FAILED:
0 cycles / 44 decisive — press correlation halved (+0.87→+0.43) but
discipline is a constant tax, not frequency dependence.**)
⭐ 2026-07-16 the user REFRAMED N1.5 from real leagues ("为什么英超有
克制和多样性?瓜迪奥拉传控/克洛普反击/弱队大巴长传/埃弗顿高塔"):
diversity stands on (1) cheap specialist CHANNELS no one structure
covers, (2) opponent-CONDITIONAL strategy (the bus is what weak teams
do vs strong ones, not an identity), (3) resource inequality. The
derived queue: ✅ **phase-63 SHIPPED** (**the AERIAL/ROUTE-ONE
channel** — the dead cross pipeline decomposed and repaired: attack
the DESCENT not the drop (the 31.9 corner principle in open play,
attacker headers ×2), meetable lead, STRENGTH owns the air
(aerialSense 0.15/0.3 — the tall-CB counter is buyable too). Per-cross
direction: press fears the delivery (shot 28-34%), the bus eats it
(12-19%). **Matrix: cross bombardment went from unplayable (phase-60)
to the TOP archetype (±8, .667); decisive edges 56%→39%, the era arms
race dissolved .762→.528** — still 0 cycles, but the ecology is
flattening. vitest 379; fingerprint REBASELINED `0e93940a…`.)
+ ✅ **phase-64 SHIPPED** (**the UNDERDOG SHIFT** — the Klopp/bus lever,
save v20: the `underdogShift` gene bends an outgunned side toward the
bus by the kickoff Elo gap (150 = a full class); mechanism probed at
3σ — the full pragmatist earns +0.15 pts/match and saves a third of a
realistic deficit; the bus is finally what weak teams DO, not a fixed
identity. Calibrate **2.90/2.99 — both seeds high in band; the 424242
low streak dissolves as ecology-luck**. vitest 383; fingerprint
REBASELINED `7878ed9b…`. ⚠ WATCH: one evolve-world skewed def
formations to low-32 15/16, zonal extinct — the shift may crowd the
def-formation menu.)
+ ✅ **phase-65 SHIPPED** (**the FREQUENCY-DEPENDENCE yardstick — N1.5
CLOSED**, probe-only: in-league, per axis, corr(style share, holders'
relative points) over 30 seasons × 2 worlds. **7 axes SELF-BALANCE
(rotationBias −0.71, dribbleBias −0.66, markingAggression −0.56,
attackingWidth −0.51, defensiveCompactness −0.42, wide-212 −0.39,
keeperAggression −0.31) and ZERO axes run away — no style anywhere
gets stronger as it spreads. Diversity is self-sustaining.** The
≥10%-cycles gate is retired (cross-era snapshots conflated arms-race
progress with相性); the matrix stays a descriptive tool. N5 UNGATED.)
+ ✅ **phase-66 SHIPPED** (**N3 — COACH MATCH-DAY PRESENCE**, save v21:
the game-state response becomes the PERSON's. The `tinkerBias` gene
scales the mentality layer's MAGNITUDE (0 = the stoic who trusts his
XI, 0.5 = the Phase-35 curve exactly, 1 = the tinkerer; direction
stays football law — the underdogShift principle applied to score +
clock); his calls are HIS in the feed (⚡/🧊/🔄 by name, the
Phase-64 bus finally narrated 🚌 at kickoff, a full stoic never
crosses the ⚡ threshold — silence IS personality rendering); and
the coach STANDS ON THE TOUCHLINE in 3D (suited figure + club scarf
+ nameplate in each technical area, tracks the ball, leaps on his
side's goals; render-only, raycast-safe). Probes: mechanism
two-faced — the 1.5× chase buys nothing (GF 0.23→0.24) and bleeds
counters (GA 0.31→0.38) while the harder shut-down protects (+0.16
pts/game leading@68) — and selection is ALIVE, means 0.35–0.55 with
full-width spread over 30 gens × 2 worlds, no corner runaway.
vitest 392; visual 106+38 (new: 2 coaches stand the touchline);
evolve-check healthy; fingerprint REBASELINED `9a23d408…`.
⚠ calibrate 2.15/2.13 — both seeds below the 2.34 center but inside
the documented same-code spread (1.83–2.62, fm 18), and the probe
shows the dial ADDS late goals — new-gene founding re-roll, watch
not chase.)
+ ✅ **phase-66.1 SHIPPED** (user report "coach 得有点对应的动作,观众席
也是": the dugout REACTS and the stands LIVE — render-only, fingerprint
untouched `9a23d408…`. Coach: despair on conceding (hands to head +
slump), a sharp lean-in on every strike, and PERSONALITY on the live
mentality ramp — the tinkerer works the touchline (arm-pumping scaled
by `mentalityOf` at his own gene) while the stoic stands arms-crossed
all match; temperament visible with zero sim state. Crowd: extracted
to `CrowdSystem` (same 2-draw-call instancing, ~270 seats) — idle sway,
"ooh" ripples on shots/saves/corners via the FxSystem deduped hooks,
full jumping eruption on goals (~2.6s decay, per-seat beats). visual
106+40 — new checks: crowd seated, stands stirred in live play.)
+ ✅ **phase-41.2 SHIPPED** (user report "带球转一大圈然后突然丢球" —
the 1v1 family's carrier side: slalom COMMITMENT. Diagnosed by
`spin-loss.ts`/`spin-trace.ts`: the evasion perp's SIGN recomputed
every frame, so a defender shadowing on the goal axis flipped it every
0.25-0.6s and the body turn-rate cap integrated the flip-flop into a
pirouette at walking pace — momentum dead, no pace protection, tackle
inevitable. Fix: the carrier picks a shoulder and holds it 0.6s, with
HYSTERETIC re-picks (an on-axis shadow keeps the committed side; only
a decisively parked blocker flips it — a real cut). Pirouettes
1.38→0.63/match, spin→tackle 0.15→0.08. The honest movement bought TOO
much (3-seed paired calibrate +0.74 goals; evo-drift width re-collapsed
0.52→0.14 under a dribble monoculture) ⇒ drive protection repriced
0.20→0.16: width back to the baseline trajectory (0.48@gen30).
⚠ **CORRECTED at 67 (fm 28)**: the "Δ+0.09 (2.49/1.89/2.74)" calibrate
line was a PHANTOM (a background stash race); true 41.2 =
**2.76/2.29/3.59, ≈+0.6 hot** — tempering continued in 67. Aerial
channel A/B'd healthy
(per-cross attacker headers 6.6→7.3%); two statistical pins hardened
per the phase-64 precedent (throw seeds 52→35/53; cross-header floor
n=20→80 — its n=40 read was a 2%-tail streak, true rate 6.0%). vitest
392; visual 106+40; fingerprint REBASELINED `0c9fd268…`. ⚠ WATCH ×2:
the low-32 def-menu skew re-fired in the evolve-check world (15/1 —
stronger carriers make deep blocks pay; N5's problem) and the goals
band (2.49/1.89/2.74) spans wide across seeds.)
+ ✅ **phase-67 SHIPPED** (**N5 — the FORMATION LIBRARY**: structural
diversity becomes discoverable. Two novel attack shapes join the
tables — `twin-st` (a high pair splitting the CBs, one true feeder)
and `false-nine` (the ST drops to the hole, wingers very high/wide) —
enterable ONLY via the rare style mutation at ×0.35 weight (the zonal
entry pattern); founders still derive classic; reborn clubs copy the
parent's style and coaches carry theirs, so discovered shapes spread
on RESULTS through all three channels. **Emergence verdict (60 gens ×
2 worlds): tried in both; in world 991 false-nine became a genuine
discovered meta (peak 9/16) and gen-60 shows THREE attack shapes
coexisting (wide 3 / narrow 6 / false-nine 7) — the first structural
divergence the game has ever grown. No monoculture.** Head-to-head
the novel shapes are honest, not OP (twin-st 70-82 W-L, false-nine
77-86 vs wide-212). Also: the 41.2 heat properly tempered at the
SOURCE — slalom perp cap 1→0.72 (drive knob measured saturated) —
calibrate 2.76/2.06/3.26 (mean 2.69, from 2.88); pirouettes hold at
0.58/match, spin→tackle 0.03. Width master gate re-passed (0.42@gen30).
vitest 394 (+2: founders-stay-classic, novel-shape playability);
visual 106+40; fingerprint REBASELINED `484c5704…`; fm 28 added (the
41.2 phantom-calibrate stash race, corrected above). ⚠ WATCH: world
991's DEF menu hit full low-32 16/0 — the def-side library (a third
defensive shape) is now the queue's obvious next structural lever;
and the goals band (~2.7 mean, 2.06-3.26 spread) ≈ real-league
scoring — the band contract verdict belongs to the overdue play
report.)
+ ✅ **phase-68 SHIPPED** (**N4 — the TACTICAL BROADCAST layer**:
evolution visible IN PLAY, TV-graphics grade, render-only — fingerprint
UNTOUCHED `484c5704…`. (1) The defensive-block outline: a soft
team-colored hull under the defending outfielders — a low-32 bus and a
press-23 line read differently at a glance; (2) press waves: the
hunting pack's assigned chasers pulse expanding rings while their side
is in Press mode; (3) the live mini formation map: a broadcast inset
(bottom-right canvas, phone-sized at ≤640px) with both shapes + the
ball, whatever the main camera does. All on a new `broadcast` flag in
the PRESENTATION section (default ON — this is product, not debug);
`RenderState` carries possession/modes/press (old replays degrade
gracefully — the layer stays dark). + **the phone FULL-PAGE fix (user
report "手机的演化和球员也要和联赛一样,不被截断,整页")**: the
evolution center (51) and player center (56) were letterboxed at
~260px on phones — built after the Phase-28.3 league fix and never
joined it; the cascade demands the override sit BELOW their base rules
(same specificity), so it lives in a late media block. Now 657px full
viewport, guarded by two new phone checks. vitest 395 (+1 broadcast
fields); visual **109 + 45** (+3 phone, +5 broadcast incl. the toggle
round-trip); the GL canvas is now `.gl-canvas` (the inset made
'#three-host canvas' ambiguous).)
+ ✅ **phase-69 SHIPPED** (**the CHIP 挑射** — user ask, first of the
curve-ball trilogy: the ecology's first mechanism that PUNISHES
`keeperAggression`. `tryChip` in performShot mirrors the FK's
two-constraint closed form — clear GK_CLAIM_HEIGHT+0.25 over the
keeper (unsavable above the ceiling), arrive under the bar (over =
the honest overhit). Feasibility is GEOMETRY: keeper on the chord,
real gap behind (along ≤ d−5.5), genuinely CAUGHT OUT (≥7.5m off his
goal center — the first cut fired 3.9/match at routine KA-0.5
positioning, a lob festival), hang ≤1.45s, and the price must clearly
beat the ground strike (q·1.2+0.03). Counters all emergent: in-face
launch = smother window, short = the claim, long = over. Probe:
routine keepers see 0.03 chips/match, the extreme sweeper (KA 0.9)
3.5/match and NET LOSES (atk 1.17→1.67 across KA); conv ~25% ≈
league-average per shot; in-league volume 0.5-1.0/match, chip goals
0.12-0.20/match. **Selection is ecology-dependent — the headline
result: world 424242's keepers RETREAT (KA 0.42→0.24) while world
991's double down (0.49→0.73, the deep-block world where sweeping
still pays) — a live conditional trade, not a uniform tax.**
Calibrate 3.02/2.28/4.10 (ex-chip 2.84/–/3.99: the chip's direct
+0.15-0.2; 2024 is its usual hot self). vitest **399** (+4: chipped
over the stranded keeper with flight sampling, never vs a home/in-face
keeper, determinism); visual 109+45; fingerprint REBASELINED
`ae193cb1…`.)
+ ✅ **phase-70 SHIPPED** (**弧线传球 — the curve trilogy's passes**,
parts 2+3: aerial SWING + the ground BENDER. Lofted switches and dinks
now carry technique-priced sidespin bulging away from whoever works
the drop zone (outswinger to the flank when clean; landing point
pre-compensated inside loftKick, so only the ARC changes). Ground
THROUGH BALLS curl around a leg pinching the seam — whip flat 0.45 ×
pinch tightness, launch compensated exactly for grass spin decay
(ω(1−e^{−1.5T})/1.5), priced by a WEIGHT ERROR that technique tames.
⭐ Two probe-driven design verdicts: (1) **ordinary circulation passes
stay deliberately STRAIGHT** — the bender on short passes defeated
exactly the lane-jumping that IS the pressing game (isolation-probed:
the zonal press-23 block's measured height collapsed onto low-32's
and the formations contract inverted; through-ball + aerial curves
alone leave it green); (2) the passing-scaled whip inverted the skill
gradient (better passers took bigger bends and paid the deviation) —
the bend needed to clear a leg is geometry, flat for everyone;
technique's edge lives in the weight error. Per-delivery the bender is
NEUTRAL within scene noise (86.3→84-85%, n=400 σ±1.8) — its value is
the visible curve + the technique gradient, not a completion buff.
Calibrate 2.91/2.10/3.35 vs 69's 3.02/2.28/4.10 — mean dead neutral
(2.79 vs 2.80), through balls 8.95→10.97/match (settled between
straight and the untempered +44% festival). vitest **402** (+3:
threaded bender + straight circulation contract, swing-away-from-
threat, pre-compensated landing); visual 109+45; fingerprint
REBASELINED `bd7ba2da…`.)
+ ✅ **phase-71 SHIPPED** (**goal-kick OFFSIDE + the line-holding
clamp** — user report "队员站到对面球门里,门将开大脚完全没有越位" and
ruling "门将开大脚应该有越位". Probed first: the real-law goal-kick
exemption + the brain's exemption-aware targeting made cherry-picking
LEGAL — 19% of goal kicks had an attacker camped within 12m of the
opponent's goal, 37% beyond the line, and the timeout punt targeted
him 12 times in 40 matches. Two fixes: (1) DELIBERATE law deviation,
user-ratified — goal kicks now play under normal offside (same family
as the offside→goal-kick restart simplification; kick-ins keep the
real throw-in exemption, corners are geometrically exempt); (2)
strikers HOLD THE LINE during their own goal-kick setup (the restart
clamp idiom — walked back to the offside line, braced; the first cut
sat below the same-side skip and never ran). Re-probe: beyond-line 0%
(37%), punts at stranded men 0 (12), goalmouth camping 19%→2.7%
(the residue = legal line-level positioning vs deep blocks).
Calibrate 2.81/2.07/3.42 ≈ neutral; offsides 2.01/match. vitest 402
(overlap floor pin hardened 48→96 seeds — its third reshuffle);
visual 109+43; fingerprint REBASELINED `28002dfc…`.)
+ ✅ **phase-72 SHIPPED** (**the ANALYST FEED** — user design after the
"看不懂" verdict on the always-on layer + the real-tactical-cam
discussion: ONE dedicated camera (`tacfeed`, near-vertical, static,
everyone in frame — the UEFA lesson that shapes carry the information)
REPLACES the behind-goal button (behindGoal survives for replay
auto-framing); ALL tactical info lives only there, and each element
gates on its own MOMENT: defensive LINES per team (base — line height
IS identity), the block HULL only while the defending side is SET
(Defend/Press), press CONVERGENCE lines chaser→ball only while the
hunt is on (the unreadable water-ripples die), and the OFFSIDE FLASH
— the defending line burns amber only while a pass flies toward it.
The 📡 checkbox dies (the camera IS the toggle); the mini formation
map shows only in-feed. Render-only, fingerprint IDENTITY `28002dfc…`;
vitest 403 (+1 camera pin); visual 109+**47** (7 new: each element
fires in-feed, everything dark outside it).)
+ ✅ **phase-73 SHIPPED** (**the RUNNER'S BODY** — the FIFA-gap
assessment's first tier, user-ratified "自走": the silhouette-level
distance between our runners and real ones. KNEES (shared geo
re-pivoted: sock/band/foot hang from a knee group at −0.55; the shin
folds during its swing phase via max(0,∓cos φ) so the stance leg
stays near-straight — real gait — with per-pose overrides for kick /
lunge / dive scissor / celebrate landings / the keeper's set crouch,
which now sits INTO its bent knees); ELBOWS (forearm re-pivoted at
−0.34, ~90° run carry per-anim + pump; the shield bar arm holds
straighter; a diver's arms stretch flat); turn BANKING (yaw-rate ×
speed tips the torso into the arc, `bankFor` pure ±0.32, 1.2 rad
teleport guard — kills the ice-skater flat turn); the TRAP (one-shot
0.34s `receive` when a >6.5 m/s ball sticks to an outfielder: the
ball-side leg reaches to meet it, knee extends then softens, weight
sits back — football's most frequent event finally has a body); and
the BALL-SIDE KICKING FOOT (`lateralSlot` pure fn, frozen at kick
start, counter-arm drives). BONUS BUG: the empirical three.js sign
check exposed the kick one-shot as MIRRORED since phase-27 — limbs
hang below their pivots so positive rotation.x is BACKWARD, meaning
the old windup swung the foot forward and the "snap-through" swept
it backward; rebuilt as cock-back-with-folded-knee → snap through
forward as the knee extends into contact. Render-only, fingerprint
IDENTITY `28002dfc…`; vitest 405 (+2 pure-fn pins); visual 109+47;
penalty-theater close-up eyeballed (forearms/socks/boots all
attached, elbows carry naturally).)
+ ✅ **phase-74 SHIPPED** (**the GOAL & THE CURVE made visible** —
FIFA-gap tier 2, the high-value moments: (1) the NET BULGE — the
back panel subdivided 18×9 and punched OUTWARD at the ball's actual
impact point on goals (gaussian falloff σ=1.1m around impact, damped
recoil `e^{−4.2t}·cos(11t)·0.62m` over 0.9s, along the panel normal),
layered on the existing whole-net shake — the iconic goal read; (2)
VISIBLE SIDESPIN — the curve trilogy (69/70) bent trajectories but
the ball itself never showed it: `ball.spin` now rides the adapter
(lerped, `?? 0` for pre-74 replays) and BallModel whirls the pattern
about the vertical axis at 16× the path turn rate while a curled
ball flies. Render-only, fingerprint IDENTITY `28002dfc…`; vitest
406 (+1 spin-carry pin incl. NaN guard); visual 109 + 3D green with
the new co-fire check (any poll catching the 0.7s shake must catch
the 0.9s bulge — it did).)
+ ✅ **phase-75 SHIPPED** (**the REFEREE** — FIFA-gap tier 3, the "this
is a real match" presence: a black-kit yellow-collar figure whose
POSITION IS SYNTHESIZED render-side (`refereeTarget` pure: shadow
play up the pitch at 0.8×, drift the center channel with the end of
play, 7m adjudicating stand-off, never inside 6m of a goal line —
the sim knows nothing about him); he runs a real gait (distance-
driven cycle, speed-scaled amplitude, lean), faces his run while
moving and the ball while standing; FOULS stop him and raise the
call arm 0.9s (+ a 2093Hz double-trill whistle in SoundFx, still
off-by-default); CARDS raise the card itself 1.5s — yellow, or red
mined from the feed's own words (`SENT OFF|STRAIGHT RED`), via the
fx stream which now carries `foul`/`card` events (deduped by t like
FxSystem, re-armed on attach + replay scrub; hidden during the
shootout theater). vitest 408 (+2: refereeTarget geometry pins, fx
foul/card carry + red mining); 3D suite +3 checks ALL observed live
(patrols in bounds, moves with play, call arm raised on a real
foul); 2D 109; fingerprint IDENTITY `28002dfc…`; tactical screenshot
eyeballed — the yellow collar reads instantly against both kits.)
+ ✅ **phase-75.1 SHIPPED** (**the tacmap ghost frame** — user report
"右下角那个框是什么?/其他机位会出现一个半透明的": the tacfeed mini
formation map NEVER actually hid — `#stage canvas` (ID specificity
1,0,1) silently beat `.tacmap.hidden` (0,2,0) since Phase 68, so its
empty border+shadow shell sat in the corner of EVERY camera. The
suite's `tacmapVisible` read classList, which lied. Fix: an
ID-matched hide rule + the debug flag now reads COMPUTED display;
verified by elementFromPoint probe (display:none, zero rect) and the
72-series checks now measure truth.)
+ ✅ **phase-76 SHIPPED** (**INDIVIDUAL BODIES + the dribble READ** —
user direction "每个球员模型都一样…和球员本身绑定再加上和能力绑定"
+ "对抗…挤来挤去,没有盘带的感觉"; render-only, fingerprint
IDENTITY `28002dfc…`). TWO builds: (1) EVERY PLAYER NOW LOOKS
DIFFERENT — `bodyFor(name, strength)` (pure, pinned): IDENTITY
hashes off the NAME (FNV-1a `hash01`) so it survives saves/replays
and swaps correctly on substitution — height 0.94–1.06×, one of 6
skin tones, one of 3 hair styles (cap / buzz / bald) × 6 colors;
BUILD follows the evolved STRENGTH attribute — bulk 0.88–1.16×
(torso+hips), so the gym visibly shows and a 0.9-strength target
man reads as a unit next to a 0.2-strength winger. Wired through
`RenderPlayer.str` (adapter, per-frame like `name`); `setBody`
early-outs on the (name, strength) key, re-tones the head+forearms,
rescales the whole body group, restyles the hair mesh. (2) the
DRIBBLE READ — the display ball (sim stays authoritative) is pushed
AHEAD in stride-synced touches at speed (carrier's own gait clock)
and SCREENED to the far side from the nearest presser when slowed
under pressure, eased 7/s and snapping back the instant it's loose:
the shield finally has a ball on the far foot instead of two men
grinding on top of it. vitest 410 (+2: bodyFor determinism/bounds/
strength-monotonicity + names-diverge; str carried per frame); both
visual suites green; TV-camera eyeball — hair + bulk variation reads
clearly, referee visible mid-pitch.)
+ ✅ **phase-77 SHIPPED** (**the LINESMEN** — user-ratified "边裁啥的
要加吗": two assistants on OPPOSITE touchlines (z=±29.8), one half
each, running the REAL assistant's law — `linesmanTargetX` (pure,
pinned) keeps each level with `defensiveLineX` (second-deepest
defending outfielder, BroadcastLayer's convention) OR the ball when
it's nearer the goal line, clamped halfway↔goal-line — so their
running line IS a living offside-line visualization in every
camera, the payoff of phase-71's offside law. They carry the flag
always (orange cloth on a stick, right hand); OFFSIDE raises it
1.6s — offside rides the sim's `foul` events, marked into
`fx.offside` by text-mining `Offside…` in the adapter — and a
corner at his end gets a 1.0s point. Same fx dedupe/reset idiom as
the referee; hidden in the shootout theater. vitest 412 (+2 pure-fn
suites); 3D suite +3 checks (touchlines+halves held, line run, flag
OBSERVED live on a real offside); fingerprint IDENTITY `28002dfc…`.
One suite-side fix: my hardcoded touchline bound assumed HALF_W=30,
real pitch is 58 wide (HALF_W=29) — the check was wrong, not the
model.)
+ ✅ **phase-78 SHIPPED** (**REAL AUDIO** — the user recorded a 21-file
REAPER library (`audio/audio_raw/`) and spec'd the cleanup pipeline
(2026-07-17, four categories A–D). Built `scripts/audio/clean.py`
(pure numpy, sample-level): noise-floor-ADAPTIVE trims (floor =
median of quietest 10% of 5ms windows, never a fixed threshold),
5ms pre-transient pads, decay-following fade-outs for whistle/
crossbar/net (86/212/400ms auto-picked), crowd lead-in preserved
(200ms), amb passthrough + equal-power head-blend loop candidates
(0.75–2s) with honest seam QA (RMS/centroid/channel-balance/
hot-transient) → `audio/processed/` + `warnings.md` (1 flagged:
the dribble loop — correctly, its trimmed tail is silent). Web
encode: SFX→AAC m4a via afconvert; the two stadium-bed LOOPS ship
as 16-bit WAV (AAC encoder priming clicks at WebAudio loop points);
5.1MB total. INTEGRATION: SoundFx rewritten — lazy sample engine
(fetch+decode on first enable = the required user gesture),
event→sample map (shot=kick, goal=net+celebration, save=glove+
applause, foul=real whistle, interception=touch), ±4% rate jitter
against machine-gunning, looping stadium bed at 0.22 gain with
ramped start/stop, and the old beeps kept as per-file fallback;
label "Sound FX (beeps)"→"Sound FX". vitest 412; visual 109+53;
fingerprint IDENTITY `28002dfc…`. ⚠ Deliberately NOT auto-claimed:
the two loop candidates passed QA but want one human listen (per
the user's own spec); BGM slots await the user's Suno tracks —
music hooks not yet wired.)
+ ✅ **phase-78.1 SHIPPED** (**audio UX** — user reports "平时没有
amb / pass和touch听不到 / 要音量调节+点击静音": SoundFx gains a
master GainNode + volume 0..1 (slider in the left panel, speaker
icon = click-to-mute, remembers the last level); the stadium bed
SELF-HEALS in play() if the first enable raced the fetch; and
pass/touch finally SOUND — they have no sim events, so the renderer
detects ball transitions itself (release >8m/s non-shot = pass with
a 2-take variation pool, pickup = touch) and feeds the same fx
hook. visual 109+52, tsc clean, UI-only.)
+ ✅ **phase-79 SHIPPED** (**N5b — the defensive menu OPENS**: the def
formation mutation was a BINARY low-32↔press-23 toggle, so world
991's 16/0 low-32 monoculture had nothing structurally new to
try — the constitution's "missing behavior = the substrate doesn't
offer it" diagnosis, same as phase-67's attack shapes. Two
additions to `DEF_FORMATIONS` + a weighted menu (classics w=1,
discoveries w=0.35, mutation-only — founders still derive the two
classics from pressIntensity): **mid-41** (the midfield WALL — ST
drops onto the pivot lane, defend-from-the-front without pressing)
and **high-line** (squeeze the pitch on the back line, no front
press — honest only since phase-71's goal-kick offside law).
OBSERVED (shape-emergence probe, now printing def ids): world 991
gen-50 was 16/0 low-32 → gen-60 runs **mid-41×6 + high-line×2 =
8/16 clubs on novel defense**; world 424242 samples them (1-2
clubs, many gens) but selection returns to the classics —
ecology-dependent uptake, menu offers / selection decides. NEUTRAL
on balance: calibrate 8-season × 3 seeds 2.81/2.10/3.46 vs 71's
2.81/2.07/3.42 (Δ≤0.04). vitest 412 (zero pin reshuffles — the
change only touches evolution-time mutation rolls); visual 109+52;
fingerprint REBASELINED `43469bba…` (mutation RNG stream moved).)
+ ✅ **phase-80 SHIPPED** (**N6 — fitBias, recruitment as a GENE**: the
fire-sale board ranked eligible signings by raw ability alone. Now
each club's board carries `fitBias` (17th gene, GENE_KEYS
auto-propagates mutate/crossover/founders): candidate score =
ability + fitBias × 1.2 × `styleFit` (pure: appetite distance
between the candidate and the RETIREE — the club's evolved
bloodline for the slot). 0 = galactico board, 1 = system-first;
whether culture-fit recruitment pays is evolution's call.
Eligibility gates (beats academy, fits budget) unchanged — only the
ranking moves. Save v22 (+migration test, backfill 0.5); identity
tags 'System signings'/'Galactico board'; gene labels in
rebirth/i18n. BONUS latent-bug kill: signings never checked NAME
collisions (Phase-55 era) — a signed agent could duplicate a
squadmate's nameplate, and identity (bodies since 76, styles,
careers) is name-keyed; now same-named agents are ineligible
(caught by the subs migration test when the RNG stream moved).
Calibrate 3.32/3.29/2.98 (mean 3.20 — the new founder gene
re-rolled every world; within historical world variance but the
GOALS-BAND WATCH ESCALATES). vitest 413; visual 109+51;
fingerprint REBASELINED `c8d81a2e…`. Pending observation: fitBias
drift/divergence + signing-fit rates (next probe session).)
+ ✅ **phase-81 SHIPPED** (**the PROBE SESSION** — three questions,
observation-only, fingerprint untouched. ① fitBias
(`market-fit-anatomy.ts`, new): the two worlds evolved OPPOSITE
board cultures — 424242 drifts system-first (mean 0.59→0.78,
spread [0.55..1.00]) while 991 goes galactico (0.43→0.05→0.20,
[0.00..0.56]); signings stay healthy (~1-1.5/season) — the gene is
LIVE under selection and ecology-dependent, not neutral drift. ②
991's defensive story past gen 60 (post-80 world): mid-41 doesn't
just coexist — it TAKES THE LEAGUE (13-16/16 from gen 40 through
gen 100), while 424242 keeps oscillating between the classics and
barely samples it: world-scale ecology dependence ✓, no cross-world
runaway; 991's fixation is its world personality (same as its old
16/0 low-32), the menu is no longer the bottleneck. ③ the goals
band: 6 seeds × 4 seasons = 2.42-3.45, mean 2.78 — the phase-80
"3.2" reading was VARIANCE + a season-count effect (same seeds read
3.3 at 8 seasons vs 2.5 at 4: goals warm as ecologies evolve — a
new lead worth its own look someday), NOT a 79/80 drift; the
standing ~2.8-vs-contract-2.3-2.6 watch stands as before, verdict
= the user's play feel.)
+ ⚠⚠ **phase-82 SHIPPED** (**GOAL INFLATION IS REAL** —
`goals-warming.ts` probe, observation-only: goals/match climb
MONOTONICALLY in every world tested — 424242 3.0→5.9, 991 2.7→6.8,
777 3.6→6.4 by gen ~24. Calibrate only ever sampled seasons 1-8, so
this was invisible; played long leagues LIVE in the inflation zone.
DIAGNOSIS (attr+gene means at gen 0/12/23): NOT an attribute arms
race — defending/reflexes HOLD or rise under the budget, finishing
+0.03-0.07 only. The mover is the GENE meta: pressIntensity
0.44→0.64-0.88 league-wide while shootBias falls 0.5→0.15-0.44 —
evolution converges on universal HIGH PRESS + shot selectivity;
pressing creates turnovers and open pitches both ways, chance
quality soars, and goals inflate as the equilibrium's side effect.
The phase-58 energy tax does not bind hard enough to stop it. NO
FIX SHIPPED — this is a game-feel call the USER owns: (a) accept
chaos-football as the evolved truth, (b) reprice the press
(stamina/turnover economics) so the equilibrium lands lower, or
(c) an absolute defensive anchor in fitness (currently pure
relative results — league-wide defensive erosion is unpunished).
Fingerprint untouched.)
+ ⚠ **phase-83 SHIPPED** (**PRESSING BUYS ITS RISK — necessary, NOT
sufficient**: line height was `formationDepth`'s alone, fully
decoupled from `pressIntensity` — evolution chase-pressed from a
deep couch, turnovers at zero positional risk. Fix: the defending
block steps up with the press gene (outfielders, defending phase,
`(press−0.5)×8m`), so the through/route-one/chip channels attack
the line the press exposes — the real-football tradeoff restored.
MEASURED: press equilibria retreat 0.64-0.88 → 0.55-0.64 (interior
✓ the gradient works) BUT goals still inflate (late means 5.3-6.5,
Δ≈+3.0) — **the press meta was a PASSENGER, not the engine**.
shootBias still collapses (0.12-0.33: extreme shot selectivity),
pace drifts up. Next diagnostic cut: late-gen goals BY VOLUME vs
CONVERSION (shots + xG per gen) — is inflation more shots, or the
same shots converting double? Calibrate 3.57/3.71/2.43 (early
window, world variance); vitest 413; visual 109+53; fingerprint
REBASELINED `8e1b75e2…`.)
+ ⚠⚠ **phase-84 SHIPPED** (**inflation = CONVERSION, not volume** —
goals-warming now splits the economy per season: shots barely move
(8→8-11.5) while xG/shot DOUBLES (0.16→0.23-0.33) and
overperformance-vs-xG grows 1.7×→2.2-2.5× — late-gen leagues
convert 58-77% of ALL shots (real football: 10-12%, 1v1s ~40%).
Two coupled holes: evolution (a) manufactures ever-better chances
and (b) finds shot CONTEXTS the xG model underprices where the
keeper is structurally dead — while defense has NO evolving
counter-gradient at the point of conversion. THE PLAN (user
briefed): ① CONTESTED FINISHING — nearest-defender
distance/closing × his defending attr + keeper positioning ×
reflexes must suppress conversion, giving defensive attributes a
direct anti-conversion channel (read tryShot first: the pressure
term is suspected attribute-flat); ② price the 2.5×-overperf
contexts by MECHANISM after a shot-type-mix probe
(chip/cutback/through-1v1 share of late-gen goals); ③ acceptance:
late equilibrium 2.8-3.3, conversion ≤35%, overperf →1.2×, early
gens ≈unchanged; ④ fitness anchor (c) only if mechanisms fail.
Probe-only, fingerprint untouched `8e1b75e2…`.)
+ ⚠ **phase-85 SHIPPED** (**contested finishing — the gate FAILED
and the failure is the lesson**. User chose option 2 (defense gets
a gradient at conversion). Shipped both touchpoints: ① the nearest
closing OUTFIELDER's `defending` scales the shot's felt pressure
(×0.55 statue → ×1.45 master, ×1.0 at 0.5 so early gens are
preserved by construction; the xG model stays defender-blind like
real xG); ② the keeper's saveP collapse softened (−0.6→−0.45·xG)
with a stronger reflexes swing (±11→±14pp) — elite keepers now
save SOME big chances, early shots move ≤+2pp. vitest 413 green,
early gens unchanged, BOTH LEVERS REAL BUT THE 24-GEN GATE FAILED:
late means still 5.6-6.4, conv 55-69%, overperf 2.2-2.6×. WHY (the
finding): the meta's manufactured chances are pressure≈0 BY
CONSTRUCTION — through-balls behind the line and cutbacks produce
shooters with no defender inside 6m, so a pressure-scaled gradient
multiplies zero exactly on the shots that inflate. The evolvable
defensive answer must live UPSTREAM of the shot: not conceding the
situation (killer-pass interception × defending, recovery races,
box marking). NEXT CUT (before any lever): shot-context telemetry
— extend shotLog with pressure/oneVone/assist-context and split
late-gen goals by situation; then price the dominant situation's
UPSTREAM defense. Calibrate 3.34/3.26/2.70; fingerprint REBASELINED
`0c550c20…`; visual 109+54.)
+ ⚠⚠ **phase-86 SHIPPED** (**shot-context telemetry — the pipe
identified, and it flips the plan**: ShotLogEntry gains
pressure/oneVone/assist (pass launches tag `lastPassKind`; zero
RNG — fingerprint IDENTITY-verified `0c550c20…`). Late-gen goal
anatomy (gens 18-20, two worlds, 1524 goals): **85-87% assist=NONE
(dribble-into-shot), 76-81% composed 1v1s, mean pressure 0.61** —
NOT killer passes (through 3%, cutback 2%) and NOT unpressured:
the presser is BEHIND, nobody goal-side. The engine: the phase-41
substrate pays carriers → evolution buys pace/dribble → defenders
dive in / lose the momentum duel → beaten line → composed-1v1
finish (tight aim + spread×0.7). The user's defensive-school
design maps: **#3 standoff/jockey marking (Van Dijk) is THE
counter and goes FIRST** (stay goal-side, delay, don't lunge —
kills the oneVone flag by simply existing goal-side); #2
coverBias/sweeper second (the man behind the beaten line); #1
offside trap LAST (dribbles have no offside — it serves only the
3% through pipe). NEXT = phase-87 `jockeyBias` gene: the goal-side
contain man holds the carrier-goal line at standoff distance,
tackles only on a loose touch; effects flow through EXISTING
systems (goal-side presence kills 1v1 composure; no full-momentum
duel entry). vitest 413; probe `shot-context-anatomy.ts`.)
+ ✅⚠ **phase-87 SHIPPED** (**jockeyBias — the Van Dijk gene, and it
WORKS where 85 couldn't**: 18th gene (save v23+migration+test).
Mechanics, both flowing through EXISTING systems: ① ChaseBall vs a
carrier: a jockeying team's chaser takes the carrier-goal line at
1.2-2.2m standoff instead of diving at the ball — a body goal-side
kills the composed-1v1 flag by construction, the resolver+slalom
make the carrier go around; ② tryTackles: the goal-side contain
man refuses the full-momentum duel (gate `drive > 0.9−jockey·0.55`)
— challenges only loose touches/dying drives; the dive-in school
(low gene) keeps the old reflex. MEASURED (24-gen gate): evolution
ADOPTS containment unprompted — jockey 0.63-0.84 across all three
worlds; **defending attr moves for the first time in the whole
investigation** (flat 0.50 → 0.53-0.60: the defensive spend finally
buys something); late-gen goals 6.4/6.4/5.6 → **4.46/4.44/5.95**
(Δ halved). NOT yet in the 2.8-3.3 band — conv still 53-62%,
overperf ~2.3: the remaining pipe is the user's school #2, the
SWEEPER (coverBias — the man behind the beaten line). Keeper-throw
seeds re-anchored 35/42→3/97/123 (throws rarer under containment;
4th reshuffle). Calibrate 3.05/3.23/3.44 (early window healthy);
vitest 414; visual 109+52; fingerprint REBASELINED `1a4db42a…`.)
+ ⚠ **phase-88 SHIPPED** (**coverBias — the sweeper gene — and a
hard finding**: 19th gene (save v24+migration+test), the DF slot's
depth relative to his line: libero behind (eats what beats the
first wave, plays everyone onside — the built-in trap tension) vs
stopper up; 0.5 = today's flat line AND the old −12 rest-defense
EXACTLY (the phase-31 hardcode genetified, early-preserving by
construction). THE FINDING (24-gen gate): the founder re-roll
produced worlds where evolution ABANDONS containment — jockey
0.16/0.20 in two worlds (goals re-inflate 5.8/6.7) while 777 keeps
jockey 0.74 (goals 4.40 ✓). Cross-world correlation high-jockey ⟺
low-goals VALIDATES the mechanism, but adoption is
ecology-unstable: in some metas the dive-in school wins RELATIVE
points even while inflating the league — the red-queen hole is now
directly observed, not hypothesized. NEXT (in order): ① A/B probe
— does jockey-0.9 actually beat jockey-0.1 head-to-head? (if NO:
containment's cost is mispriced — fewer turnovers won = attack
starves; rebalance the mechanism); ② if YES and adoption still
flips: the fitness anchor (c) — the user's call. Fire-sale signing
seed re-anchored 41→1 (3rd reshuffle of this class). Calibrate
2.69/2.77/3.15 (early band healthy); vitest 415; visual 109+52;
fingerprint REBASELINED `99ed8ed7…`.)
+ ✅ **phase-89 SHIPPED** (**BGM + the mix fix** — the user's three
Suno tracks landed (`audio/bgm/`): Title (368s), 联赛 (185s), and
夺冠 whose filename carries its own cut ("从20s开始" — honored via
`loopStart`/start-offset in config, the file untouched).
`MusicSystem`: context-driven slots with 1.2s equal-power
crossfades — ceremony → victory (enters at the drop), management
screens → league, the pre-match clash → title, live play → crowd
only; per-slot lazy load on the first nonzero volume; a second
🎵 slider + click-mute in the panel; silent-fail everywhere.
SFX MIX (user report "基本上听不到接球/球入网/射门/传球/人群"):
touch 0.35→0.75, pass 0.55→0.95, kick 0.8→1.15, net 0.9→1.35,
ambience 0.22→0.5 — plus the FAST-FORWARD GATE (the frequent layer
skips above 4×; at 8-32× the per-touch sounds smeared into noise,
likely half the audibility complaint). UI-only; fingerprint
IDENTITY `99ed8ed7…`; visual 109+52. Still open on the audio side:
7 unused samples (UI clicks/crossbar/disappointment/aerial/chants/
dribble-loop/amb-2), arousal-coupled ambience, ambience-only-in-
match, prematch/reel/shootout music slots when tracks arrive.)
+ ✅ **phase-90 SHIPPED** (**audio round 2 — the whole recorded
library is now IN the game** (user: "剩下队列先把所有声音有关的做
完"). ① UI clicks: buttons → click, the big match controls
(.speed-row) → the heavy tonal press, checkboxes → toggle — one
capture listener, all through the master (the volume slider governs
them). ② the MISS: a shot that ends with neither goal nor save
deflates the crowd (renderer falling-edge detection). ③ the HEADER
thud on aerial-duel flags. ④ CHANTS: one of the two recorded songs
rises from the stands every 45-100s, louder when the crowd is up.
⑤ the second ambience bed enters the rotation (random pick per
session). ⑥ AROUSAL COUPLING: CrowdSystem's arousal now swells the
ambience gain (0.7×→1.6×, throttled bridge) — the stands you SEE
erupt are the stands you HEAR. ⑦ the dribble-step loop rides fast
carries (renderer carry-state bridge). ⑧ ambience falls SILENT when
a management screen or the ceremony covers the stage (the clash
banner keeps the crowd — it's a broadcast graphic). SOURCES
CLEANED: audio/ untracked + gitignored (author's archive owns the
masters; the game ships public/audio only — files left on disk,
nothing deleted). NOT wired, honestly: the crossbar sample — the
sim has NO woodwork mechanic; queued as a future behavioral phase
rather than faking it. UI-only; fingerprint IDENTITY `99ed8ed7…`;
visual 109+52.)
+ ⚠⚠ **phase-91 SHIPPED** (**jockey A/B — containment LOSES
head-to-head, overturning the red-queen reading**: `jockey-ab.ts`,
150 paired matches × 2 environments, sides alternated. Neutral:
0.9-jockey W57 D31 L62, 1.35 vs 1.45 pts. Dribble-meta (where it
should shine): W53 L64, 1.28 vs 1.50 pts, and it concedes MORE
(GA 1.61) — so phase-88's two worlds ABANDONING jockey was
evolution judging correctly; 777's adoption was drift. Mechanism
audit found two mispricings: ① EVERY chaser of a jockeying team
takes the goal-side standoff point — including pursuers from
BEHIND, who detour around the carrier instead of pressuring the
ball: a free escort downfield; ② the delay has no ENDGAME — real
jockeying delays UNTIL HELP ARRIVES, but the tackle gate only
lifts when the carrier slows, so a patient carrier is never
dispossessed. DECISION TABLE presented to the user: (1) fix the
mechanism (contain-man-only jockeys + gate lifts when a second
defender is within ~3m) then re-run A/B + warming — recommended;
(2) skip to the fitness anchor — data does NOT currently support
it; (3) both. Probe-only, fingerprint untouched `99ed8ed7…`.)
+ ⚠ **phase-92 SHIPPED** (**containment repriced — user chose fix
the mechanism**: three cuts from the A/B audit: ① only the
GOAL-SIDE man jockeys (pursuers from behind chase the ball — no
more free escorts); ② the delay has an ENDGAME (a second defender
inside 3m collapses containment into the challenge); ③ standoff
tightened to the tackle-range edge (0.9+jockey·0.5 — 2.1m had
parked the contain man permanently outside the 1.15m challenge
radius) + NO jockeying in the danger zone (inside 28m the
challenge is mandatory). A/B AFTER: **neutral squads FLIP — 0.9
wins 1.45 vs 1.31 pts, concedes less**; the dribble-meta env still
loses (1.34 vs 1.52) — but both sides there have defending 0.4,
and a 0.4-defender genuinely can't jockey a 0.65-pace winger: the
gene×attribute PACKAGE (invest defending + jockey = the Van Dijk
build) is the intended strategy space. 24-GEN GATE: still fails —
2/3 worlds abandon jockey (0.15/0.14, goals 6.0-6.7) while 777
keeps 0.70 (goals 5.16): co-evolving the def+jockey package is a
narrow path drift rarely finds in a 16-club population. THE FORK
IS NOW SHARP: the mechanism is priced honestly (neutral A/B wins)
yet population adoption doesn't hold → this IS the red-queen/
drift regime the fitness anchor (c) exists for — OR accept
ecology-dependent defensive worlds as the game's truth. Test pins
re-anchored: keeper-throw 3/97/123→58/182/207 (5th), card sample
seed 5→37 (containment cut desperate lunges = fewer cards).
vitest 415; calibrate 2.95/2.97/3.43 (early band healthy);
fingerprint REBASELINED `f971e8a0…`.)
+ ✅ **phase-93 SHIPPED** (**composure EARNED — the 28.4 gift
dismantled** (queue item D): the oneVone aim ×0.72 + spread ×0.7
were attribute-BLIND — every breakaway shooter got them free. Now
scaled by finishing: `clamp((fin−0.5)/0.4, −0.75, 1)` — at 0.5 the
branch is a NO-OP (plain shot), 0.9+ keeps the full old gift, 0.2
PANICS (sprays ×1.225, aims safer ×1.21). Measured: composed-1v1
goal share 78/82% → 75/73% (anatomy re-baselined at 92-HEAD first);
warming late means 6.0/6.7/5.16 → 5.82/5.52/5.31 — direction ↓ but
the arc is NOT closed: gen-23 finishing stays ~0.5, the pipe now
rides shot QUALITY (xg/shot 0.16→0.22-0.25) rather than the gift,
conv still 46-63%. Calibrate 2.40/2.59/2.99 — default seed ~0.1
under the 2.5 soft edge, above the 2.3 floor: logged as a WATCH,
not chased (the drop is the point; 94/95 re-measure). Keeper-throw
seeds re-anchored 58/182/207→24/42/44 (6th dance; card pins held).
vitest 415; visual 109+51 (the 3D count is data-dependent — the
conditional refCall check didn't fire on this stream); fingerprint
REBASELINED `a3120f75…`.)
+ ⚠ **phase-94 SHIPPED** (**school-linked variation — the academy
follows the philosophy, and a hard finding** (queue item C):
`newgenFromBloodline` gains the philosophy pull — a containment
coach (jockeyBias>0.5) drifts heirs toward defending, a dive-in
coach toward pace; zero-sum on one axis, max ±0.12 (one mutation σ),
budget-clamped structurally by the existing intake `enforceBudget`;
founders/fitness untouched, RNG-stream NEUTRAL by construction
(zero seed re-anchors — first behavioral phase since 61 without a
dance). The MECHANISM works: def attr follows the school (991's
def hit 0.61 — the highest any warming run has shown; unit test
pins the transfer). THE GATE FAILS: 24g adoption = jockey 0.41/
0.09/0.30 at gen 23 — 0/3 worlds hold >0.5, and even 777 (0.74
at 93-HEAD) abandons. Reading: phase-93 devalued exactly what
containment prevents — with the composed-1v1 gift finishing-gated,
a 0.5-finisher's breakaway is no longer lethal, so goal-side
standoff pays LESS; dive-in is honestly optimal again (red-queen,
directly re-observed). Verdict input for 95: late means 6.72/4.90/
4.69 (≫3.8) → the PRE-AUTHORIZED fitness anchor fires next.
Calibrate 2.57/2.64/3.16 (all in band — 93's default-seed watch
RESOLVES). vitest 416; visual 109+51; fingerprint REBASELINED
`bed80ef1…`.)
+ ⚠⚠ **phase-95 SHIPPED** (**the VERDICT gate + the anchor, and the
anchor is REFUTED as the closer** — ⭐ **MORNING RATIFICATION
NEEDED, see below**): the 24g×3 verdict at 94-HEAD read late means
6.72/4.90/4.69 (≫3.8) → pre-authorized fallback A fired. The
conceded-goals anchor: an ABSOLUTE λ·GA/match term in fitness
(never min-max normalized — every other component is
season-relative, so a league that inflates TOGETHER paid nothing;
now the price of conceding scales with the collapse itself; unit
test pins the absoluteness; probe `anchor-sweep.ts`). Swept
{0.05, 0.1, 0.2} on 424242 per the ratified procedure: λ=0.05 →
5.33 FLAT with jockey ADOPTED 0.85 (least-that-stabilizes on the
sweep world); 0.1 → still rising; 0.2 → 6.44 with an extreme-press
chaos meta. SHIPPED at 0.05. BUT the full 3-world verdict refutes
robust stabilization: 424242 5.33✓(0.85), 991 5.62(0.05),
777 7.44(0.61) — vs λ=0's 6.72/4.90/4.69; the ecology RE-ROLL
variance (σ≈1) swamps the λ effect, and 777 inflates to 7.44 WITH
containment adopted (def 0.56, jockey 0.61): **the remaining
inflation engine is the xg/shot climb (0.16→0.26 — shooters walk
it ever closer before striking), not the absence of defense**. The
inflation arc is NOT closed. ⭐ **FOR THE MORNING**: ① ratify or
kill the anchor (one line: `FITNESS_ANCHOR.conceded` → 0); the
purity dent is real, the stabilization evidence is one world of
three; ② the proposed NEXT lever is shot-proximity economics (why
does walking it into the six-yard box pay so reliably late-gen —
keeper 1v1 envelope vs the carry cone at point-blank), not more
fitness engineering. Calibrate 2.50/2.46/2.97; vitest 417 (zero
re-anchors again); visual 109+51; fingerprint REBASELINED
`3cd1253f…`.)
+ ✅ **phase-96 SHIPPED** (**the TITLE SCREEN** — the user-designed
synthwave launch overlay: striped neon sun ON the horizon (the
opaque grid floor swallows its lower half), perspective grid
scrolling one row per beat, chrome-gradient logo, pixel-star
twinkle groups on alternating half-beats — every animation a 500ms
multiple (120BPM, on the Title track). Two stages: the first click
anywhere IS the WebAudio gesture (`MusicSystem.unlock()` resumes
the born-suspended context; the Title BGM starts) → ▶ START
dismisses to the live game (attract mode — the match was running
beneath the whole time). Music slider now BORN at 60 (user intent:
the title must sound; the slider still rules). `updateMusic` gained
the title branch (stadium MUTED under the overlay — it's a title
screen, not a broadcast graphic) + full optional-chaining (the
build-time default fires mid-init — caught live as a boot crash).
Both visual suites dismiss via the new `__evo.skipTitle()` FIRST,
per the queue's own warning. Phone-checked at 390px. UI-only;
fingerprint IDENTITY `3cd1253f…`; vitest 417; visual 109+52.)
+ ✅ **phase-97 SHIPPED** (**the keeper-hold flutter, measured and
killed** (user report 球诡异上下颤动+队员抽动): `hold-jitter.ts`
quantified all the queue's suspects — the real mechanism is the
31.9 hold re-arm QUANTA: **21.6% of distribution frames sit in
timer==0 gaps**, and while every SIM consumer was patched back
then with `|| gkDistributing`, the RENDER adapter's `heldByGk`
still read the raw timer → BallModel's heldY sawtoothed 4×/s
(the vertical flutter) AND the sim's carry offset teleported
0.3↔0.85m in the same gaps (a 0.55m 4Hz horizontal snap — at
crowd scale this is almost certainly the perceived 抽动 too).
Fixes, both render-only: ① the adapter joins the 31.9 convention
(gap flicker after: 0/5522 frames, headless-verified); ② the held
ball's DISPLAY pins to the keeper's chest via the carry channel
(sim ball authoritative underneath — the phase-76 contract).
Eliminated with data: receive one-shot restarts<0.5s = 0/match;
physics vel reversals = 0; bubble pinning 5-8 frames/match.
Sim-side residual for the tail: contain desired-vel flips 66-70/
match (3/1k chase frames) — the hysteresis fix is BEHAVIORAL
(fingerprint), parked at 100+ with baseline numbers in hand.
Fingerprint IDENTITY `3cd1253f…`; vitest 417; visual 109+52;
keeper-hands probe healthy.)
+ ✅ **phase-98 SHIPPED** (**keeper distribution GENETIFIED**
(user-ratified "门将出球选择应该和战术有关"): the one-size throw
becomes the coach's choice, all through EXISTING genes — ① the
short roll to feet priced by passBias, ② the fast counter-sling
priced by counterAttackBias × the TRANSITION WINDOW (opponents
still committed in our half at the catch — a fast break launches
from the hands or not at all), ③ the PUNT (new): closed outlets +
low passBias/riskTolerance send a long lofted drop into the
phase-63 aerial channel, and STRENGTH picks the target — the tall
outlet man is a buyable package for punt-first coaches; ④ the
hands-Pass now school-scaled (was gene-blind and won 83%
regardless — a dead wire the probe caught: counter-sling share was
0% until the transition term). Probe `keeper-distribution.ts`,
four schools, distinct signatures: neutral Pass 83% · build-up
Pass 100% · counter sling 18% · punt-first roll 42% + PUNT 25% +
sling 25% (Pass 0%). The 28.3 no-hoof contract UNTOUCHED (every
release still has a name on it). Throw seeds re-anchored
24/42/44→27/87/167 (7th dance — throws rarer under school
competition). Calibrate 2.91/3.10/3.30 (in band); vitest 417;
visual 109+51; fingerprint REBASELINED `fa984021…`.)
+ ✅ **phase-99 RESOLVED PROBE-ONLY** (**the pressed-winger escape —
the premise didn't survive its own probe** (user question ①): the
queue's condition was "does the situation occur and go UNUSED?" —
`pinned-winger.ts` (120 matches): pinned-wide occurs 4.7
episodes/match (final third) / 1.7 (deep byline squeeze), and it
is NOT wasted — episode outcomes: cross 26%/43% · pass 21%/26% ·
through ball 18%/6% · immediate turnover just 3%. The frame-level
"Dribble 100%" read was an artifact (kicks resolve instantly and
vanish from ownership before sampling — the outcome-at-episode-end
view is the honest one). The escape toolkit already fires, and
the deep-squeeze resolves through the phase-63 cross channel —
building a through-ball appetite booster would hand-force a
behavior the data doesn't ask for. NO sim change (the emergence
rule: diagnose before designing; a 91-style negative result).
If the user's play-feel still disagrees in the morning, the next
probe is through-ball QUALITY deep (completion + what the channel
runner does), not appetite. Fingerprint untouched `fa984021…`.)
+ ✅ **phase-100 SHIPPED** (**WOODWORK — the crossbar sample finally
has its mechanic** (queue-tail item): a driven ball crossing the
goal plane in the OUTER band of a post (|y| ∈ [3.5, 3.67], the
frame+ball radius) or just over the bar (z ∈ [2.44, 2.61]) CLANGS
back into play — crossing point interpolated back to the plane (a
30 m/s shot travels 0.5m/step; the post-step position overshoots).
Deliberately outer-half only: the inner frame edge stays a goal
EXACTLY as before, so no goals are stolen and NO rng draws are
consumed (deterministic bounce → zero seed re-anchors: vitest 421
all green untouched). First cut bounced ×0.52 and fed the six-yard
scramble (calibrate 2024 hit 3.61) — deadened to ×0.4 with post
ricochets pushed OUTWARD to the flank: calibrate 2.48/2.89/3.29
(in band). Measured rate 0.38/match (30 posts + 8 bars per 100) —
real-football territory. Full wire: 'woodwork' event type → feed
🔩 → fx → `sfx_ball_hit_crossbar_01` + the crowd's wince; the
miss-deflation treats a frame hit as resolved (no double gasp).
vitest 421 (4 new); visual 109+52; fingerprint REBASELINED
`47f0e842…`.)
+ ✅⚠⚠ **phase-101 SHIPPED** (**contain hysteresis + the A/B re-read
that moves the fork**: ① the phase-92 goal-side test was a
razor-edge boolean — a chaser dancing on the −0.2 offset flipped
between the standoff point and the ball; now ENTER containment
only clearly goal-side (gap>0.6), HOLD until clearly not (<0.1) —
paired: vs-carrier brain-flips 12→5/match (−58%; the rest of the
66-70 total are LEGIT loose-ball whips — hold-jitter.ts now splits
them). ② the throw-test dance ENDS after eight re-anchors: the
verification half now uses a COUNTER-SCHOOL keeper (dense
producers, pinned to the phase-98 mechanism, not rng drift).
⭐⭐ ③ THE BIG ONE — the paired jockey A/B at current HEAD:
containment's phase-92 neutral WIN is GONE — 0.9-jockey loses
1.16-1.19 vs 1.56-1.61 pts in BOTH arms (hysteresis is
noise-neutral: 1.19 vs 1.16). Phase-93 devalued exactly what
containment prevents (the free composed-1v1), so the package's
head-to-head payoff collapsed with it — evolution abandoning
jockey (94/95) was CORRECT pricing, and the anchor debate is
downstream of THIS: either containment's reward channel gets
repriced (a won containment must be worth possession value) or
defensive worlds stay ecology-dependent. Morning decision item #2.
Calibrate 2.63/2.97/3.26 (in band); vitest 421; visual 109+52;
fingerprint REBASELINED `3249ad64…`.)
+ ✅ **the N6 fitBias watch CLOSES HEALTHY** (queue-tail follow-through,
observation-only at 101-HEAD, `market-fit-anatomy.ts` 30g×2): the
board-culture gene is ALIVE — 424242 drifts fit-seeking (mean
0.55→0.72, spread [0.60..0.93]) while 991 keeps two coexisting board
cultures (mean ~0.5, spread [0.14..1.00]); the market stays healthy
(~1 signing/gen both worlds). No dead wire, no intervention needed.
+ ✅ **phase-102 SHIPPED** (**the anchor is DEAD — user ratification**
(morning 2026-07-18, decision #1): `FITNESS_ANCHOR.conceded` 0.05→0 —
fitness is pure results again. The mechanism + `anchor-sweep.ts` stay
as lab instruments (the test arms λ locally and proves both the no-op
default and the armed absoluteness). The user's chosen replacement
for the inflation engine is IN-ECOLOGY: the keeper RUSH-OUT (103,
user-designed) — attack the xg/shot proximity climb on the pitch,
not on the scoreboard. Calibrate 2.96/2.69/3.38 (in band); vitest
421; visual 109+54; fingerprint REBASELINED `7c896768…`.)
+ ✅⚠ **phase-103 SHIPPED** (**the keeper's missing physics — 出击
finally has a real price tag** (user design, morning decision):
the save model carried NO closing-down credit — a keeper at the
striker's toes saved at the SAME rate as one on his line, so the
出击 school could never pay and the walk-in pipe had no keeper
answer. Now `closeIn` (frozen at strike, like `difficulty`): saveP
× (1 + closeIn·0.9), 0 beyond 7m — early-gen shots untouched by
construction; chips and placed balls carry 0 (the chip IS the
counter, phase-69). Probed the whole design space first
(`rush-anatomy.ts`, 3 schools × 2 attack regimes): ① an
always-charge extended rush = GA 5.13 (attackers shoot past the
advancing keeper) → the carrier-charge keeps its CLASSIC range +
a RACE READ (charge only when he can meet the carrier before the
shot; gene prices the accepted margin); ② the custom out-box foot
poke DELETED by its own measurement — tryTackles never excluded
keepers, so the rushing keeper always had tuned feet and the poke
just layered a worse coin flip on top; ③ the through-ball
interception range extends for aggr>0.5 (the sweeper's real food).
MEASURED: point-blank honesty helps EVERY school (timid GA
3.57→3.27 vs the dribble meta) and the aggr dial gains an interior
optimum (neutral 2.72 beats timid 3.27 AND sweeper 4.53) — a real
tradeoff axis at last. THE GATE, honestly: 24g adoption FAILS
(aggr 0.44/0.18/0.21) and late means 6.13/6.35/4.62 don't bend —
the keeper's honest price alone doesn't close the arc; the
defensive LINE's answer is next (104, Route A as ratified).
Calibrate 2.28/3.01/3.07 (default-seed dip below the 2.3 floor =
watch-not-chase per the 62 precedent; warming early means
2.66-2.98 healthy); vitest 421 (zero re-anchors); visual 109+52;
fingerprint REBASELINED `5707cc92…`.)
+ ✅⚠ **phase-104 SHIPPED** (**Route A — the OUTNUMBERED DUEL**
(user-ratified): tryTackles priced every duel 1v1 no matter how many
bodies converged, so the containment that DELAYED UNTIL HELP ARRIVED
(the whole 87/92 design) won its own collapse at coin-flip rates.
Now a STALLED carrier (drive<0.45) with a second defender inside 3m
concedes +0.12 — pure physics, no gene named (a flat, un-gated +0.10
was tried first and REJECTED by A/B: it fed the press swarm and cost
the jockey side the neutral arm). A/B at this HEAD: dribble-meta
PARITY 1.37 vs 1.37 (the school's target regime — first non-loss in
the whole investigation), neutral −0.14 (noise-band). 24g×3:
**late means 5.60/4.92/5.20 — the LOWEST sum of the entire arc**
(94: 16.31 · 95-anchor: 18.39 · 103: 17.10 · now 15.72), no blowout
world for the first time. Adoption: 777 HOLDS 0.67; 424242 half-buys
the package (jockey 0.43, def 0.60); 991 evolves a DIFFERENT defence
instead (cover 0.53 + pace 0.60 — a sweeping school). The strict
≥2/3-hold gate fails, but the honest reading has moved: containment
is now FAIRLY PRICED and ecology-dependent — worlds choose among
REAL defensive identities rather than uniformly abandoning defence.
Calibrate 2.94/2.90/3.09 (the 103 default-seed dip RESOLVES); vitest
421 (zero re-anchors); visual 109+50; fingerprint REBASELINED
`f4750bb9…`.)
+ ✅ **phase-105 SHIPPED** (**audio round 3 — the MEASURED mix** (user
reports: title BGM should duck→fade→return with pause; beds inaudible;
cheers too loud; balance everything; SFX default on; 手机端没有声音):
① every gain now anchored to MEASURED source RMS (afconvert): the beds
were recorded at −45 dB RMS — 18 dB under the reaction samples — which
is the whole small-amb/loud-cheer complaint in one number. New targets:
beds ≈−29 eff (gains 6.7/6.2), reactions −31..−33 (celebration
0.85→0.66, disappointment 0.6→0.45), goal accents −28 (net 1.6), touch
layer −34 (touch 0.75→2.2 — source −42!), dribble loop 0.3→8 (source
−62, was −72 eff = placebo), chants 0.24→0.4, whistle 0.9, header 1.5;
BGM equalized to −16 eff (title .94/league .68/victory .65 — victory
was hottest source AND biggest gain). ② the TITLE ANTHEM lifecycle
(user design): full on the launch screen → DUCKED ×0.4 on START (the
game boots paused) → fades out the moment ▶ resumes (decoupled from
the clash, which used to hold it 10 sim-seconds into play) → returns
ducked on every pause; `MusicSystem.play(slot, mul)` retargets without
restarting; headless-verified via the new `__evo.audioState()`.
③ MOBILE SILENCE root-caused: SoundFx owns a SECOND AudioContext that
was only ever resumed from frame-driven calls — never inside a gesture,
so iOS kept it suspended forever; the title click now unlocks BOTH
contexts + plays a code-built silent <audio> loop (the ringer-switch
session trick) + visibilitychange re-resume for backgrounding.
④ SFX default ON at 70 (user ask), slider still rules. UI-only;
fingerprint IDENTITY `f4750bb9…`; vitest 421; visual 109+52. Final
gain judgement = the user's ears; every number has a dB paper trail.)
⭐⭐⭐ **THE 108 RESULT (2026-07-18 afternoon — ENTITY LINKS, SHIPPED,
UI-only)**: any LIVING club or player named in prose is now a jump to
its deep dive — dead entities stay plain text (honest: their dive no
longer exists). One generic mechanism instead of per-surface rebuilds:
`ui/entityLinks.ts` (`buildEntityIndex` = the league's current names,
longest-first; `linkifyText` = scan a composed sentence, wrap matches
in clickable spans). Wired surfaces: the CHRONICLE (headlines + mined
lines — 55 live links in the visual-suite world), the MARKET (free
agents' ex-clubs, the signings chronicle), the CENSUS career
leaderboard. Cross-screen nav: `GameApp.openClubDive(slot)` /
`openPlayerDive(slot, index)` → new `EvolutionScreen.focusClub` /
`PlayerScreen.focusPlayer` (clears the role lens so it can't hide the
jump target; both scroll to the dive anchor). The dynasty wall already
linked in-screen (tap-a-row, phase-51) — left as is. Gates: visual
2D 109→111 (two new 108 checks: links exist, a click LANDS on a dive
screen), 3D 52; vitest 421; sim untouched → fingerprint IDENTITY
`f4750bb9…`, no calibrate needed.

⭐⭐⭐ **THE 107 RESULT (2026-07-18 afternoon — N5 library expansion,
SHIPPED)**: two novel attack shapes join the discoverable menu at the
×0.35 rare-entry weight — **`overload`** (the library's first ASYMMETRY:
a three-man left-flank triangle + the right winger alone at max width
as the isolation outlet) and **`target-man`** (the user's 埃弗顿高塔:
the lone tower at +9 — highest ST of any shape — wingers mid-height
arriving on the knock-down; the Phase-63 aerial channel finally gets a
shape built around it). Same discovery discipline as 67: founders stay
classic, reborn clubs copy parents, mutation-only entry, reversible.
**Verdicts**: playability PASSES for both (real attacks both ways over
a side-balanced seed pool); the entry channel verified twice (weighted
draw-check: each novel takes 14.3% of attack switches; lineage census:
9-11 attack switches per 60-gen world → ~1.3 expected tries per shape —
target-man realized 2 entries in the verdict worlds, overload drew a
legitimate zero at ~25%/world odds). ⭐ **The important finding came
from the COUNTERFACTUAL** (phase-106 tag re-run in a worktree, same
worlds): gen-60 ATTACK CONSOLIDATION to a single shape happens under
BOTH menus — baseline 424242→twin-st 16/16, 991→narrow-122 16/16 (+
low-32 16/0, the old def watch re-fires); with 107, 424242→wide-212
16/16, 991→false-nine 16/16 (def mid-41 14 — a 79 shape finally wins a
world). The monoculture is the late-gen walk-in meta expressing
structurally (the 106 diagnosis again: everything consolidates onto
the best LAUNCH platform), NOT a library defect — novels win 2 of 4
world-runs, classics the other 2, no systematic edge. Evidence feeds
109. Also: the EvolutionScreen def share-strip was missing the phase-79
labels entirely (bands invisible since 79) — fixed alongside the four
new labels. Gates: vitest 421 (quiet re-run; a contended 4-sims+vitest
first run produced phantom errors — measurement discipline note);
visual 109+51 quiet; calibrate 3.06/2.90/3.09 in band (424242/2024
streams IDENTICAL to 105 — mutation-only change); warming 15.63 ≈
baseline 15.72; fingerprint IDENTITY-BY-WINDOW `f4750bb9…` (the
2-season window contains no divergent attack pick). No save bump —
enum widening is schema-compatible (the 79 precedent).

⭐⭐⭐ **THE 106 RESULT (2026-07-18 afternoon — the attack-side cut,
executed probe-first as ratified; verdict: PROBE-ONLY, negative results
shipped honestly, the diagnosis re-aims the queue).**
**The instrument**: `scripts/probes/final15-anatomy.ts` — traces every
final-15m carry episode in late-gen worlds (22 gens, 991/424242):
entry regime (goal-side bodies / breakaway), the beaten men's actions,
speeds and spot distances, the pursuit endgame (closest approach to
carrier AND ball, pace ratio, lunge counter), and the save-model inputs
frozen at the strike (xg/difficulty/closeIn/gkDist), chip-split.
**What it measured**: walk-ins = 60-75% of ALL late-gen goals; 71-92%
of walk-in goals enter with the ENTIRE outfield line beaten (gs=0);
goals are struck ~6.5m out with the keeper 3.4m off, difficulty 0.35,
closeIn 0.52; breakaway-entry conversion 72-79% (real one-on-ones ~40%).
**Levers built and MEASURED OUT** (all reverted, site comments carry
the archaeology): ① beaten-line recovery hurry (the queue's candidate
A) — beaten men are 60-88% in MarkOpponent/ChaseBall already, the
touched branch owns 12-18% of their frames; warming 16.52 vs baseline
15.72 = noise. ② last-defender delay — no last defender EXISTS in the
dominant regime (gs=0). ③ retreat geometry — spotDist 12-14m at goal
episodes, nobody is parked on a saturated spot. ④ the closeIn
DIFFICULTY FLOOR in tryKeeperSave (the data-picked lever: the walk-in's
last meters paid DOUBLE — xg 0.21→0.34 while difficulty fell
0.68→0.36) — swept ·0.85 (nothing, 15.88) and ·1.2 (world-split:
424242 conv 79→51% with the honest 1:2 saved:goal; 991 held 72%
regardless; warming 17.36; keeperAggression adoption unmoved 0.37/0.31/
0.69 vs baseline 0.29/0.69/0.35) — deleted per the phase-95 anchor
discipline. **Pursuit physics established**: the pursuer NEVER reaches
the 1.15m lunge radius (closest approach to ball 2.4-3.3m; lunges fire
in 2-4% of breakaway goals); top-speed ratio 0.90-0.94 is STRUCTURAL
(role bases DF 7.0/MF 7.3 vs WG 7.9/ST 7.7 + carry at 0.84+0.1·dr).
**THE DIAGNOSIS (the phase's real product)**: the walk-in is not
under-defended — it is *selected*. shootBias rails to 0.07-0.41 by
gen 23 (the gene's floor = "only tap-ins": refuse the 10-14m strike,
carry to point-blank) while pressIntensity rails 0.52-0.88 and goals
overperform xG 2.2×. Post-launch pricing cannot flip a strategy whose
edge is VOLUME — 13-17 final-15m entries/match. The governing margin
is what SERVES the launch, and the school built to price that channel
is the offside trap (queue 109). Gates: vitest 421 (throw-test seeds
re-anchored TWICE mid-phase and restored on revert — the 101 mechanism
held); visual 109+52; fingerprint IDENTITY `f4750bb9…` (sim diff =
comments only); calibrate untouched by identity (2.94/2.90/3.09 stand).

⭐⭐⭐ **THE NEXT 自走 QUEUE (2026-07-18 afternoon — ⭐ THE RESUME POINT
after the user's compact; user said "我compact之后自走" against the gap
review below, order = Claude's recommendation left unchallenged).**
State at queue-writing: phases 93-105 all shipped+pushed+deployed; HEAD
fingerprint `f4750bb9…` (phase-104; 105 UI-only); calibrate 2.94/2.90/
3.09; vitest 421; the morning decisions LANDED (anchor dead at λ=0 ·
Route A shipped as the outnumbered duel · chaser-count stays · keeper
出击 = closeIn physics). Execute IN ORDER, one phase = one commit+tag+
push, full gates each (vitest · both visual suites · calibrate ×3 on
behavioral changes · fingerprint identity-or-rebaseline · both ledgers);
probe-first everywhere; the user PLAYS CONTINUOUSLY — casual
observations ARE the play reports and may re-order this queue.

**106 — the ATTACK-SIDE inflation cut** ✅⚠⚠ **DONE 2026-07-18 —
PROBE-ONLY (the phase-99 shape): every lever the data could name was
built, measured and MEASURED OUT; the phase's product is the anatomy
instrument + the diagnosis that re-aims 109.** Full entry below
("THE 106 RESULT"); one line: the walk-in is not under-defended, it is
SELECTED — shootBias rails to ~0.1-0.4 by gen 23 (refuse the range
strike, carry to the tap-in) and the governing margin is LAUNCH VOLUME
(13-17 final-15m entries/match), which no post-launch defensive or
keeper pricing we swept could touch (all ≤ re-roll noise on 24-gen
warming). Sim diff = comments only; fingerprint IDENTITY `f4750bb9…`.
⭐ Hand-off: 109 (offside trap) is the school built for exactly the
launch channel — RECOMMENDED pre-work there = a LAUNCH-anatomy probe
(what serves the gs=0 band entry: through-ball / carry-through /
keeper sling / long punt), extending `final15-anatomy.ts`.

**107 — N5 FORMATION LIBRARY expansion** ✅ **DONE 2026-07-18** — the
two genuinely-missing shapes shipped (`overload` asymmetry +
`target-man` tower; twin-ST/deep-forward were already 67's). Full
entry above ("THE 107 RESULT"). No save bump needed (enum widening).
⭐ The counterfactual run's finding — gen-60 single-shape consolidation
under EITHER menu — is 109's evidence base.

**108 — ENTITY LINKS across screens** ✅ **DONE 2026-07-18** — generic
linkify over living entities (chronicle/market/census; dynasty wall
already linked in-screen since 51); full entry above ("THE 108
RESULT"). Inline spans, no layout change at 390px.

**109 — the OFFSIDE-TRAP gene** ✅⚠ **DONE 2026-07-18 — school #3
complete, the last of the user's named defensive schools.** The 21st
gene `trapBias`: a high-trap marker refuses to be dragged deeper than
his SHAPE by an off-ball runner (x holds toward the formation spot at
(trapBias−0.5)·2, y keeps sliding with the man; the phase-71 law flags
whoever gets served beyond the held line), **gated to the ball OUTSIDE
the −17 danger zone** — football law: the trap is sprung before the
ball goes over the top; once beaten, everyone tracks. Save v25
(backfill 0.5) + a migration test (vitest 422). **The measurement
story:** ① `launch-anatomy.ts` (the 106 hand-off): breakaway launches
are carry-through 69-78%, through-ball ≤1% — the trap is school
completeness, NOT an inflation lever; the arc's real target remains
the 1v1 carry-through at the line. ② Baseline offsides were always
~1.09/match — the first "zero" was a DETECTOR bug (offside awards are
GOAL KICKS, the 29.2 arcade rule). ③ Two "perception lag" fixes
(runner + passer line reads) built on that false zero were MEASURED
OUT by foreground stash A/B — gene-only springs BETTER (1.68 vs 1.13)
than with lags (1.38/1.06; a stale read of a rising line makes runners
hold conservatively) → lags reverted, archaeology in the executor.
④ The UNGATED first build was selection-poison: trapBias railed to
0.08, one warming world hit 8.5 goals/match (deep runners unmarked in
the box) — the danger-zone gate fixed both. ⑤ Final A/B: offsides won
1.33 vs 1.03 (+29%), goals 137-143 — a real trade, no blowout.
**Adoption (24×3): two CULTURES — 991 adopts 0.58→0.74 (aggr 0.56:
the trap school), 777 blends 0.62 (jockey 0.82 + cover 0.69: chained
delay), 424242 rejects →0.21 (a press-0.93 world tracks)** — ecology-
dependent, no uniform virtue. Gates: vitest 422; visual 111+52;
warming 17.71 (top of the recent 15.6-17.4 same-code spread — watch);
⚠ calibrate 3.43/2.93/**1.96** — 2024 under the 2.3 hard floor
(single-seed excursion; the A/B shows ~14% suppression at gene
extremes; watch-not-chase per the 62/66 precedent, RE-READ next
phase); fingerprint REBASELINED `dce857a3…` (21-gene rng re-rolls
every stream; the throw test survived without re-anchor).

**110 — the CARRY-THROUGH counter-channels (queue RE-ORDERED
2026-07-18 evening: the user's 射门趋同 question + the 106/109
evidence chain + "gogogo自走" after the stated plan = the walk-in's
counters come before Stage 4).** The arc's target: breakaway launches
are 69-78% carry-through (launch-anatomy), the pursuer reaches 1.7-2.4m
but the duel never rolls (tackle radius 1.15m, lunged 2-4% — 106
anatomy). Lever 1: **the RECOVERY SLIDE** — a from-behind desperation
challenge available in the 1.2-2.2m band: low win rate, HIGH foul
chance (the 62 card economics), a last-man foul risks the red (DOGSO)
— one mechanic opens both the pursuit-duel and the tactical-foul
channels; selection (markingAggression + the situation) decides who
slides. ✅ **SHIPPED 2026-07-18 evening — THE ARC'S FIRST WORKING LEVER.**
`trySlideTackle` (mechanics.ts, after tryTacticalFoul in the step):
driving carrier, dGoal ≤ 30, slider from BEHIND 1.2-2.2m off the ball
— the exact band the 106 anatomy measured pursuit converging at while
the 1.15m tackle radius kept the duel from ever rolling. Attempt
0.05+mA·0.12 (booked ×0.35), win clamp(0.16+def·0.14−dr·0.1, .05,
.40), miss = grounded 0.8s + foul 0.4+mA·0.15 via awardFoul (box ⇒
PENALTY; maybeCard rides — the 62 economics finally reach the
breakaway). Discovered en route: tryTacticalFoul's grab already owned
16-34m; the slide covers the ≤30m kill zone the grab refuses.
**Measured: late-gen breakaway conversion 72-78% → 47% (991) / 60%
(424242); warming late means 15.38 — the FIRST reading below the
15.72 baseline all arc (every prior lever: 15.88-17.71). Calibrate
2.58/3.12/3.27 ALL in band — and the 109 2024-seed watch (1.96)
RESOLVES on the re-roll. Foul economy: 4.24 fouls / 1.47🟨 0.09🟥 /
0.19 pens per match — plausible, cards vitest green.** Gates: vitest
422, visual 111+50, fingerprint REBASELINED `af7ea229…`.
Then lever 2 (if needed): rest-defense NUMBERS vs attack commitment.

**111 — FORM/MORALE** ✅ **DONE 2026-07-18 night (Stage 4's first pull
item; the 22nd gene).** `Franchise.morale` — rolling confidence in
[0.1, 0.9], result-driven with UPSETS weighing more (the Elo `expected`
prices the surprise), mean-reverting ×0.8/round (streaks fade); save
v26 + migration test. What morale DOES is the gene's to price:
`moraleSensitivity` scales a ±9.6%-at-extremes noise channel on ALL
four pass variants + the shot spread (one chokepoint: the shared
passBias tightness factor). Probe `morale-ab.ts`: hot-vs-cold at max
spread = +11% goals, +2.3% passes — real but modest by design.
**Adoption (24×3): 0.41→0.55 / 0.50→0.49 / 0.50→0.73 — one world grew
a genuine CONFIDENCE-TEAM culture, one is immune, selection alive with
spread — the "new payoff surface" gate PASSES.** Visible face: 🔥
on-a-run / ❄ in-a-slump tags on the clash tape (morale ≥0.7 / ≤0.3).
Warming 15.68 ≈ the slide's 15.38 (no inflation); calibrate 3.25/3.64
⚠/2.82 (424242 over the top — re-roll watch); vitest 424 (the fx test
UPDATED for the new advantage contract, below); visual 111+54;
fingerprint REBASELINED `793d0dab…`. **Also shipped (user report
mid-phase): ADVANTAGE fouls no longer whistle** — the fx stream
filters "— advantage" fouls (RenderStateAdapter), so neither the SFX
nor the 3D referee blows while play runs on; the feed line stays.

**112 — the TRANSITION-PRESS gene** ✅ **DONE 2026-07-18 (the 23rd
gene — the counter-defense audit's hole: no gene owned the first 3s
after LOSING the ball).** `transitionPress` — the mirror of
counterAttackBias on the same possession clock. Probe FIRST
(`transition-anatomy.ts`, the finding that justified the gene): the
first-3s response was PURELY a side effect of steady-state
pressIntensity — hiPress sides retreat 2.4-4.8m in the window and
launch counters off 26-50% of deep turnovers, loPress sides retreat
6-10m; a mid-block that counter-presses on loss (or a high press that
DROPS on loss) could not exist in gene space. The gene breaks the
coupling at three sites, all window-bounded (3s off the loser's
`possessionGainedAt`, 0.5 = today exactly): (1) TeamBrain pressScore
+tp·0.22 → a gegenpress side flips into Press the instant it loses it,
a drop side falls to Defend even when its steady press would fire;
(2) chaser count — gegen throws ONE extra body (a deliberate window-
bounded exception to the phase-31 "never three" swarm ban — the ban
was for the PERMANENT swarm; the counter-press expires with the
window), drop refuses its second presser; (3) executor — drop's
spot-holders SPRINT home instead of jog (the 106 hurry trigger failed
because it fired on "beaten"; this fires on the transition clock, for
the gene that pays). **A/B (`transition-ab.ts`, 120 matches): a real
tradeoff with NO dominant side — gegen concedes launches off 8.2% of
losses vs drop's 11.1% (the counter-press denies the launch window)
and wins the ball back HIGH 23% vs 17% (the playmaker value), at the
honest cost of FT fatigue 0.185 vs 0.159; goals near-parity 147 vs
151.** Adoption (24×3): tprs gen-23 = 0.49 / 0.54 / 0.43 — near-neutral
with mild spread; evolution is close to indifferent on this draw (a
weaker school signal than morale's 0.24 spread) but the mechanism
bites and neither extreme is poison or a blowout — school completeness,
priced, no-op-free. Playbook: save v27 + migration test; 'Gegenpress'
tag MOVED from pressIntensity (that's now 'High press') to
transitionPress, +'Drops & recovers'; rebirth radar 反抢/tprs; warming
column. Gates: vitest 426, visual 111+52, calibrate 2.86/2.45/3.12
(mean 2.81, all in-band); warming late-means 14.72 on the fresh
23rd-gene ecology re-roll (sub-baseline, no blowout world, tight
4.8-5.0/world — but a NEW draw, not directly comparable to 111's
15.68); fingerprint REBASELINED `8e02a9cb…`.

⭐⭐⭐ **THE 113 RESULT (2026-07-18 evening) — GOAL-CHANNEL
visualization: the probe-grade anatomy goes player-facing.** The
launch-anatomy band-entry classifier moved IN-ENGINE as pure telemetry
(`Match.trackAttackEntry` + `goalChannelFor`, zero RNG, zero behavior):
every goal banks ONE of seven exclusive channels — `setpiece` (≤6s off
a corner/FK/pen first touch) → the live breakaway entry's launch class
(`keeper`/`through`=in-behind incl. lofted/`carry` >2.2s+9m/`cross`/
`walkin`=line simply beaten) → cross/cutback service → `buildup`
(residual; own goals land here). Banked in `TeamMatchStats.goalChannels`
→ `SeasonAggregates.chFor/chAgainst` → `SeasonRecord.table[].ch`; save
v28 + migration test. UI: `goalChannelTile` (进球管道, scored+conceded
100%-stacked strips + top-3 color chips, segment tooltips carry counts)
on every league-center team card AND the club deep dive.
**Census probe (`goal-channel-census.ts`, gens 20→22, zero sum
mismatches over 1436 goals): 991 = setpiece 17 · carry 55 · walkin 15 ·
buildup 12 · through 0 · keeper 0 · cross 1 (%); 424242 = 19/47/11/20/
2/0/1. Breakaway family 71%/60% ✓ matches the 106 anatomy.
launch-anatomy at the SAME HEAD confirms the port is faithful (carry
74-77% of entries, through 1-2%, keeper 0, cross ~0): the
through/keeper drought is the ECOLOGY — 109's trap + 103's closeIn
priced those launches out and the walk-in engine TODAY is the carry.
The defensive read the phase was for: the worst bleeders concede 66-83%
through `carry` — the recovery-slide/jockey-less schools, visible to
the player at last.** Gates: vitest 430 (+4), visual 113+54 (2 new 2D
checks), calibrate N/A (zero-behavior, proven stronger:) fingerprint
sim-IDENTICAL under the invariant-2 strip protocol (v28 save minus
ch-fields re-hashes to `8e02a9cb…` EXACTLY); full-JSON baseline
REBASELINED `8c6330b2…` (format-only).

⭐⭐⭐ **THE 113.5 RESULT (2026-07-18 evening) — the CLUB CENTER + the
IA reorganization (user direction mid-113, ratified "go").** New
top-bar 🏟 球队 tab (`ClubsScreen`, the player-center pattern): a
compact 16-club selector wall (dot/name/Elo, division badge, 2
nameplates, W-D-L·pts, coach) + ONE deep dive — identity-NOW all in
one place: tags, dugout record, gene radar vs league mean, ⭐ the
阵型图 (`formationDiagram` in charts.ts: mini pitch, six spots from
the real `ATTACK_FORMATIONS`/`DEFEND_FORMATIONS` tables, hollow GK,
role tooltips — both phases side by side), goal channels, budget +
attrs + squad, family tree + lineage. The league tab SHEDS its 16
full team cards (standings names are now click-through links to the
club center); the evolution center sheds identity duty — its club
panel is now DRIFT-only (style moves across generations + a
club-center link button), so 116's enrichment lands in a purified
home. Entity links (108) retarget: club names anywhere → club center.
Zero sim: fingerprint IDENTICAL `8c6330b2…` (no strip needed). Gates:
vitest 430 green, visual 120+54 (2D checks re-homed + 9 net new:
wall/dive/diagram/link coverage), build clean.

⭐⭐⭐ **THE NEXT 自走 QUEUE v2 (2026-07-18 night — ⭐ THE RESUME POINT
after the user's compact; user-ratified: "这几个写入吧" against the
UI-audit + counter-defense conversation, plus their own additions).
⭐⭐ SESSION HANDOFF (2026-07-19 cont., width investigation). Repo is
CLEAN at fingerprint `d309f250` (= phase-119j); this session shipped NO
sim change — both fix prongs were ATTEMPTED, A/B-tested, and REVERTED.
Only additions: `scripts/probes/width-funnel.ts` (kept) + these ledger
notes. ⭐ WHAT WE LEARNED (full anatomy in EVO-BLUEPRINT under "THE
WIDTH-FUNNEL DIAGNOSIS"): the user asked whether 下底传中/45°/内切/套边
can EMERGE, why central dribble penetrates, and about 补防. (1) **补防
(carry-into-traffic tackle nerf) — REVERTED, wrong mechanism**: the
scramble is a SPILL-driven pinball (spill 48-56% of entries), so a
tackle-economy fix can't touch it; and the carry team attacks a SPREAD
defense (no wall to bite). (2) **Carry is the UNIVERSAL weapon; width's
only UNIQUE weapon (the cross) is broken** → width has no gradient, so
everyone narrows. `width-funnel.ts` proved it: WIDE crosses 3.0/m →
**0.0 shots** (2.27 go LOOSE); the box is EMPTY at delivery (0.24 att
vs 0.64 def) because open-play box-crashing never existed + crashers
arrive 1.2s late. (3) **The winger already WINS — by CARRYING**: WING
(width 0.95 + dribble 0.8) beats CLUMP 2.90:2.27 via carry 1.52 / cross
0.02. So 内切/carry-wide EMERGE; the aerial cross does not. (4) **Prong 2
(box-crash + don't-cross-empty-box) — REVERTED**: cut wasteful crosses +
lifted box population but the cross STILL didn't convert (0.02 goals — the
aerial contest goes loose even with bodies there) AND broke 3 invariant
tests. ⭐⭐ REFRAME / NEXT: the high aerial cross is low-percentage BY
DESIGN (realistic 6v6 = cutback+combination, not crossing). **The next
lever is the CUTBACK (倒三角, ground, to the arc arriver)** — strengthen it
so it out-competes the deep carry from wide positions, done WITH box-timing
and the fragile tests (finishing/onball/freeAgents) re-anchored on purpose.
NOT the aerial cross. Standing: 119l run-repertoire; 11v11 as structural
cure (parked); Stage-4 home-advantage→memory-commentary.

---
⭐⭐ SESSION HANDOFF (2026-07-18, preset-free — facts only, next
session decides direction). Repo is CLEAN at fingerprint `ab2e43bd`
(= phase-119f; 119g + the spill probe are zero-sim, hash unchanged).
SHIPPED this session: 119a (player radar + 3D
showcase), 119a.5 (settings screen + topbar nav), 119b (keeper
honesty — fingertip stretch + angle coverage), 119e (the DIRECTIONAL
TACKLE POKE — the 乱抢 re-examination made quantitative; see its
entry + the coupling law), 119f (the KEEPER-RELEASE lane read — a
keeper looks before he throws; the throw-AT-opponent bounce-back),
119g (the 赛前 MATCHDAY REPORT — clash banner gains coach + form +
standing + head-to-head; the 119c revert→reframe's SAFE UI half,
zero-sim). PROBED → NO-FIX this session: 119f-spill (the first-touch
停球失误 is HONEST football — 90% hard receptions; nerfing it would
trip the 119d-1 iron law; the ugliness is the spill FEEDING a
scramble, = the give-and-go/119d frontier). ⭐⭐ THE UNIFIED FINDING
(2026-07-19, `quadrant-balance.ts`): naive scheme-decouple is REFUTED
— forcing all 4 quadrants shows aggressive-zonal (GF1.22/GA0.67)
DOMINATES both ends → freeing → defensive monoculture, goals ~0.67.
Root: the ATTACK has no zone-breaking primitive (a zone doesn't track
men). The 乱抢 free-1v1, the off-ball wall (119d-1), the throttled
give-and-go, AND zonal-dominance are ONE defect: the attack can't pull
a defence apart. ⭐ REDIRECT: 119h (free scheme) BLOCKED until the
attacking zone-breaker exists → 119i. ⭐ 119i FIRST LEVER (give-and-go
return) ATTEMPTED + REVERTED 2026-07-19: it FIRES (frozen oneTwos
0.07→0.5) but FAILS both gates — evolution DE-SELECTS it (net-neg-EV,
fresh gate 7→2/16) AND it inflates goals-warming 11.54→15.25. Lesson:
making a combination fire ≠ making it PAY; the bottleneck is RETURN
QUALITY (A gets open at 5.5m but can't convert the received ball) =
A's off-ball run-timing + first touch = ⭐⭐ THE MISSING POSITIONING /
OFF-BALL-IQ ATTRIBUTE. Five levers now converge here (119c, 119d-1×4,
119i): off-ball actions don't pay AND players can't individually
create/exploit space. The real enabler = the positioning attr. ⭐⭐ 119j SHIPPED
2026-07-19 (user "开始"): the POSITIONING attribute added (9th attr,
SQUAD_BUDGET 36→40.5 density-preserving, save v32, fingerprint
`d309f250`), first wiring point = reception-under-pressure. Validated
but WEAK on this channel (maxed bites −19% spills but goal-neutral;
fresh-evo selects mildly 0.39→0.43-0.46) — possession-retention is
weakly rewarded here, so reception is the weakest wiring point. ZERO
inflation (goals-warming 11.67≈11.54), vitest 441 (+2 re-anchors),
visual 136+54. ⭐ NEXT 119k: the IMPACTFUL wiring — run-timing +
defensive reads — then re-attempt the give-and-go with positioning
making A's reception clean. ⭐ STRATEGIC BACKLOG written: attribute/gene audit vs
FIFA/FM/PES (positioning attr = deepest missing; GK split;
heading/accel/tackling splits). Also queued: 119g(b) pre-match
behavioural plan (attacking-side/upstream only), give-and-go (119d).
ATTEMPTED + REVERTED this session (all A/B'd, none committed): 119c per-opponent
game-plan (defensive gene-bend); 119d-1 off-ball supply (peel /
show-for-it / pitch-wide marker-lag, four cuts); the 1v1 keeper
angle-cut; the marking-scheme freeing (lifted the zonal cap + entry
asymmetry). Each entry below carries its raw A/B numbers.

WHAT WAS BEING EXPLORED (the user's thread, open — not a directive):
the "carry" scoring pattern and whether the game is too reliant on
it. Measured facts on disk (probes kept: `attack-economics`,
`onevone-anatomy`, `supply-side`, `breakaway-origin`, `give-and-go`):
of clean 1v1s that form, ~19% are a dribble-beat, ~28-38% pass-created,
~43-54% transition/scramble-born; 1v1 conversion 45-55%; goal-channel
mix at gen21 is one world buildup-led, one carry+setpiece-mixed. The
user's stated values (from this session, verbatim intent): dislikes
the "乱抢" (scramble/loose-ball) goals as tactic-less/ugly; dislikes
"人堆" (clumps — formations exist to avoid them); wants mechanisms
fixed so play/decisions develop FREELY and diversify in a healthy,
adversarial (对抗) environment; and wants a 赛前布置/赛前报告
(pre-match plan/report). OPEN threads NOT yet built (user paused
before deciding): the 赛前报告 (a UI matchday report — the clash
banner enrichment, safe/UI-only) and/or a mild pre-match behavioural
plan measured only against no-regression; the give-and-go as a second
scoring weapon; the SPILL half of the scramble (~50% of entries —
119e fixed the tackle-squirt half; scramble-goal SHARE sits with
this + the give-and-go); 11v11 (parked, engine-scale); phase 120
home-advantage → memory commentary (clean Stage-4). No
recommendation is baked in here — read the entries + probe numbers
and choose fresh.
(112 through 119b + 119e ALL shipped 2026-07-18; 119c + 119d-1
ATTEMPTED + REVERTED same day; fingerprint baseline now `5c6226fa…`
= phase-119e.)**
State at queue-writing: phases 106-111 ALL shipped+pushed (six in one
day); HEAD fingerprint `793d0dab…` (phase-111); vitest 424; visual
111+54; warming 15.68; calibrate 3.25/3.64⚠/2.82 (424242 over-top
re-roll watch). Execute IN ORDER, one phase = one commit+tag+push,
full gates each, probe-first everywhere.

**112 — the TRANSITION-PRESS gene** ✅✅ **SHIPPED 2026-07-18 — see the
full result entry ABOVE this queue block.** (counter-press vs retreat,
the first-3-seconds-after-turnover axis; the 23rd gene, save v27; A/B
verified a real no-dominant-side tradeoff, adoption near-neutral,
gates green, fingerprint `8e02a9cb…`.)

**113 — GOAL-CHANNEL visualization** ✅✅ **SHIPPED 2026-07-18 — see
the full result entry ABOVE this queue block.** (Seven-channel
in-engine classifier, save v28, 进球管道 tile on team cards + deep
dive; census validated vs launch-anatomy; fingerprint sim-identical
by strip protocol, full baseline `8c6330b2…`.)

**113.5 — CLUB TAB + IA reorganization** ✅✅ **SHIPPED 2026-07-18
(user "go") — see the full result entry ABOVE this queue block.**
(ClubsScreen selector-wall + identity dive with 阵型图; league tab
sheds cards, standings link through; evolution club panel = drift
only + club-center link; entity links retargeted; zero sim,
fingerprint identical.)

**114 — FORM STRIP + morale visibility** ✅ **SHIPPED 2026-07-18.**
Last-5 league W/D/L dots (`recentForm`/`formStrip`, cup ties excluded,
`src/ui/form.ts`) now ride every league-table row (new Form column +
the 🔥/❄ extreme glyph with the exact value in its tooltip), every
club-center wall mini, and the club dive — which also gets the MORALE
METER (`moraleRow`: 0.1–0.9 bar, hot amber / cold ice / neutral ink).
⭐ One conscious downgrade vs the queue text: "morale sparkline"
needs a recorded per-round morale TIMELINE (save-touching, v29) —
the 111 data that "is all there" is the scalar; shipped the meter
instead, timeline is a cheap follow-up if the curve is wanted.
UI-only: fingerprint IDENTICAL `8c6330b2…`. Gates: vitest 432 (+2
form tests), visual 123+54, build clean.

**115 — BUDGET viz done RIGHT + small viz debts** ✅ **SHIPPED
2026-07-18.** ① Club-dive attr rows are now DELTA BARS vs the league
mean (`deltaBar` in charts.ts: center tick, diverging ±0.2 full
deflection, exact value+Δ in the row text) — the 48 stars-vs-balanced
emergence finally legible per club; the Evolution population heatmap
stays (it's the population lens). ② The budget bar splits XI vs 🪑
bench (61 debt): two segments + `22.1 + 🪑7.5 / 36` text. ③ 🪤 TRAP
CREDIT in the feed (109's visible face): when a committed trap side
(raw `trapBias > 0.72`, the nameplate threshold) wins the flag,
`callOffside` credits the SCHOOL — same single line, no feed spam;
vitest-covered both ways (trap side gets 🪤 across seeds, neutral
line never does). Events aren't saved → fingerprint IDENTICAL
`8c6330b2…`. Gates: vitest 434 (+2), visual 125+52 (the 3D count
breathes with match events), build clean.

**116 — the EVOLUTION CENTER enrichment** ✅⚠ **SHIPPED 2026-07-18
(data-inventory-first — two queue premises corrected).** ① SHAPE
TIMELINE per club (阵型史): the discrete formation identity was NOT
reconstructable ("from lineage notes" refuted: sack/hire style swaps
leave no note; only rebirths snapshot style) → now RECORDED per
season on `styleMatrix` rows (`style: TeamStyle`, save v29,
migration + tests; strip-proof: v29 minus the field re-hashes to
`8c6330b2…` EXACTLY, new baseline `f032c705…`) — drift panel shows
⚔/🛡 era-strip-style timelines (palettes now shared consts with the
population strips), growing from v29 on. ② PERFORMANCE TRAJECTORY:
per-club ELO + FITNESS across generations — both sat fully recorded
in history (`table[].elo`, `fitness[].total`), never plotted;
self-normalized sparklines with raw latest in the head
(`sparklineTile` gains `latestLabel`). ③ the DUGOUT on the wall:
lineage's sacked/hired/coach-retired events (recorded since 53,
invisible — no icon/color) now render 🪓/👔/🌅 + legend. ④ player
personal-style evolution: queue premise REFUTED — styles are
career-FIXED by design (`playerStyle.ts:17`), drift is
bloodline-level and unrecorded; not built, documented (would need
its own recording seam if ever wanted). Gates: vitest 436 (+2),
visual 126+53, build clean.

**117 — AUDIO housekeeping** ✅ **SHIPPED 2026-07-18.** ① amb beds
now LAYERED (chose density over alternation — alternation adds bed
seams and the seam-listen is already a standing item): both loops
play through per-bed constant gains into one shared arousal gain;
each bed −3 dB (6.7/6.2 → 4.8/4.4) so the uncorrelated pair sums
back to the 105-measured ≈−29 dB floor; `Math.random()` bed pick
DELETED (chant randomness stays — that's within-session variety,
render-side). ② `sfx_shot_01.m4a` deleted: shots were never silent
(`SAMPLES.shot` = kick_power at 1.35 since 105) — a true dead asset.
③ sweep: every other asset exactly 1-ref, all 3 BGM in use. ⭐ The
new denser bed is part of the STANDING ears-session (105) — judge
them together. Render-only: fingerprint IDENTICAL `f032c705…`.
Gates: vitest 436, visual 126+54, build clean.

**118 — INJURIES** ✅ **SHIPPED 2026-07-18 (user-ratified defaults:
"很少 1-2/队季 · 多轻伤少重伤 · 会被铲伤但不奖励 · 保底 6 人").**
A foul sometimes hurts the man it fouled (`maybeInjure` off BOTH foul
paths — awardFoul + the cynical foul): `INJURY_BASE 0.10` × fatigue
(1.6−stamina) × age (±6%/yr in [0.65,1.5]). 70% KNOCK — `takeKnock`:
pace ×0.8 / dribbling ×0.85, attrs REPLACED not mutated, plays on —
30% serious: out 2-4 rounds via the SUSPENSION SEAM twin
(`f.injuries[ri]`, same decrement/lineup-exclusion/season-clear;
`forceSubstitution` bypasses the rotation gate, bench-exhausted →
`removeFromPitch` = the send-off geometry, no red; keepers only ever
knock — the no-reserve-GK premise). THE 6-MAN FLOOR enforced at
bank time (an absence that would strand the club downgrades to a
knock, deterministic). No new gene — the payoff surfaces are for
EXISTING ones: rotationBias (fresh legs are safer legs), the 61
bench-budget split, the foul economy (injury = side effect, never
an incentive). **Census (12-season worlds 991/424242): 1.27/1.28
injuries per club-season ✓ on budget, serious 30/32%, avg out
3.0/3.1 rounds, fouls 4.16/4.34 · goals 2.61/2.90 — economy
intact. Paired stash A/B, 3 calibrate seeds: goals Δ −0.08/+0.16/
+0.37 ≈ re-roll noise (baselines 2.01/2.45/1.95 → 1.93/2.61/2.32)
— no systematic suppression.** Save v30 + migration; 🚑 feed lines +
club-page badge; three seeded suites re-anchored for the new RNG
stream (subs gene-gate = rotation-only now, cards ledger admits the
stretcher exit, freeAgents seed 1→3 — the documented dance).
Fingerprint REBASELINED `e95c9d2b…` (behavioral — new rng draws).
⭐ BONUS: goals-warming 12.62 (4.57/3.97/4.08, no blowout world) —
THE ARC LOW (prior low 14.72): knocks blunt tired late-game legs
exactly where the carry pipe lives. Gates: vitest 441 (+5), visual
126+53, calibrate paired-A/B Δ≈noise, build clean.

**118.5 — UX round (user reports, 2026-07-18 late)** ✅ **SHIPPED.**
① BUDGET ALLOCATION JOINS THE TIME MACHINE ("预算分配在演化里面怎么
没有变"): the heatmap was a live-only snapshot that ignored the
generation scrubber — per-club attr summaries now RECORDED on
styleMatrix rows (save v31; strip-proof: v31 minus `attrs` re-hashes
to `e95c9d2b…` EXACTLY, new baseline `093da5bd…`), and the heatmap
re-renders with the scrubbed frame (old records show the honest
empty note; history grows from here). ② top-bar order = the user's
reading order: 联赛中心 · 演化 · 球队 · 球员. ③ SPACEBAR toggles
pause/play (guarded: not while typing / on a focused control;
suite-checked). Gates: vitest 441 green, visual 127+53, build clean.

**119a — PLAYER CARD upgrade** ✅ **SHIPPED 2026-07-18 (user ask:
多边能力图 + 3D 可旋转全身).** ① the ABILITY RADAR: the 8 attributes
vs the SAME-ROLE league mean (geneRadar grammar — role mean dashed,
the player filled in kit color; replaces the comparison-free attr
bars, exact values live in the axis tooltips — a keeper's silhouette
finally means something because it's judged against keepers). ② the
SHOWCASE (`render3d/PlayerShowcase.ts`): the MATCH's own PlayerModel
on a studio turntable — kit + back number + the earned body
(height/skin/hair off the name, bulk off evolved strength), keepers
in the inverted kit with gloves in a ready crouch, outfielders at
ease; breathing idle + lazy arm sway around the pose (base-pose
offsets, so the stance survives the animation), drag-to-rotate via
pointer events, auto-spin resumes 2.5s after release. ONE WebGL
context for the screen's lifetime: mount() re-homes the canvas each
render, the model swaps only when the occupant changes, per-instance
materials disposed while the match renderer's shared GEO/MAT caches
stay untouched. UI-only: fingerprint IDENTICAL `093da5bd…`. Gates:
vitest 441, visual 129 (+2: radar + live showcase canvas) + 3D
suite, build clean.

**119a.5 — SETTINGS SCREEN + chrome cleanup** ✅ **SHIPPED 2026-07-18
(user asks: 删掉截图键 · 保存/种子/调试图层/语言进单独设置界面 ·
腾出来之后美化).** The topbar carries DESTINATIONS only now — 🏆
联赛中心 · 🧬 演化 · 🏟 球队 · 👥 球员 · ⚙ 设置 — and each button
LIGHTS UP while its screen is open (nav state was invisible before;
one honesty hook: every screen change already funnels through
updateMusic, so the nav refresh lives there). The NEW ⚙ settings
screen (`ui/SettingsScreen.ts`, stage-overlay pattern, one quiet
card per concern): saves (Save/Load/Export/Import), new-league
(seed + Reset with plain-language warnings), language, and the 7
debug-overlay flags — all moved off the topbar and the match panel.
The 📸 screenshot button DELETED end-to-end (button, GameActions
entry, GameApp.takeScreenshot, ThreeMatchRenderer.captureScreenshot
— the OS tool won); the LeftPanel is now only what you touch while
watching (scoreboard/control/camera/sim/presentation). Dead CSS
swept (debug-section, topbar input rules). UI-only: fingerprint
IDENTICAL `093da5bd…`. Gates: vitest 441, visual 134 (+5 settings
checks, screenshot check inverted to assert-gone) + 3D 54, build
clean.

**119b — ATTACK DIVERSITY: the collapse probe + the 1v1 HONESTY
lever** ✅ **SHIPPED 2026-07-18.** Probe-first, two instruments:
① `attack-economics.ts` (per-possession ledger, tick-traced): the
collapse is DEMAND-SIDE — pass EXECUTION was never priced out
(completion 78%→76-80% early→late, interceptions flat ~17%, carry
steal rate flat ~12/100s); passing died of DISUSE (76→41 att/match)
because the carry's ENDPOINT pays double: 1v1 conversion 29% (gen 3)
→ 56-67% (gen 22), 89% of late goals unassisted. ② the smoking gun,
`onevone-anatomy.ts`: **54%/23% of late-gen 1v1 shots — 65%/36% of
the GOALS — never entered keeper reach at all** (hard cliff at
`keeperReach`: a ball 5cm beyond was untouchable, no saveP roll),
and evolution had routed AROUND the 103 closeIn credit by striking
from 8-10m where closeIn ≈ 0.1. THE LEVER (one, physics, the D+C
inflation-endgame's keeper side): ⑴ the FINGERTIP STRETCH — saves
attempted out to reach×1.35, gated on the ball passing its closest
approach (within-reach behavior bit-identical), parry-only; ⑵ ANGLE
COVERED — `coverage` = keeper depth up the shot cone / shooter
distance, discounted off-line, frozen at strike, sharing closeIn's
×0.9 slope via max() (never compounds). Frozen-gene snapshot A/B:
424242 58→50%, 991 71→68% (its keepers evolved under the old
pricing — starved). **FRESH-EVOLUTION verdict (worlds re-evolved
under the new physics; complete shotLog counts): 1v1 conv 67→59%
(991) / 56→53% (424242), attempts 307→256 / 343→216, rolled-save
23→35% / 20→43% (reflexes+keeperAggression finally worth buying),
goals 3.66→3.31 / 3.97→2.89 — and 424242's ECOLOGY genuinely moved:
channel mix FLIPPED to buildup 66 > carry 59 (first world where the
carry monoculture broke), pass attempts recovered 41→64/match,
pass progression share 34→43%. 991 stayed carry-first (96 from 113)
— one world flipped, one held: honest split.** Early honesty bonus:
gen-3 overperf 1.68×→1.21× (424242), conv 27→19%. (Instrument note:
onevone-anatomy's single-slot tracker undercounts overlapping shot
windows — its 45%/55% conv are subset figures; the reach/roll
decomposition is what it's for.) through/cross still ≈0 — that's
the NEXT lever's job (counter-pick), not this one's. calibrate
1.88/2.36/2.32 vs 118's 1.93/2.61/2.32 (Δ within the seeds' measured
re-roll noise); goals-warming **11.18 (3.79/3.77/3.62) — the ARC
LOW** (prior low 12.62 at 118, highs 15.7+), early means
2.35/2.39/2.86 intact. vitest 441 with ZERO re-anchors (the receding
gate keeps in-reach rng behavior identical); visual 134+53; build
clean. Fingerprint REBASELINED `848370ae…` (behavioral — new
stretch rolls).

**119c — PER-OPPONENT GAME-PLANNING** ⚠️ **ATTEMPTED + REVERTED
2026-07-18 (honest negative result, fingerprint left at `848370ae`).**
Built the full counter-pick loop: a `gameplan.ts` playbook + dossier
(`TeamInfo.oppChannels` = the opponent's goal-channel ledger from
113, injected in `createMatch`), the coach choosing a counter-shape
from the opponent's dominant threat and bending his match-day genes
by his tinkerBias (the 66 pragmatist axis, now paying twice), a
`gameplan-anatomy` probe, and the clash-banner "tonight's shape"
overlay (the user's 赛前报告 seed). **The PLUMBING all bound** — the
`gameplan-anatomy` probe showed detection scaling correctly with the
meta (as carry grew, plans increasingly read "breakaway": 12→64
reads, fire-rate 25→53% of kickoffs). **But the LEVER failed its
A/B** (`GAMEPLAN_OFF=1` toggle, same seeds, 22-gen fresh evolution):
plans-ON vs -OFF — goals **3.63→6.03** (991) / **3.55→4.18**
(424242), carry share went **UP** not down (40→50 / 27→32%), and
evolution NEGATIVELY selected tinkerBias (0.61→0.30 / 0.66→0.41) —
it correctly learned that planning HURTS. A retuned net-tightening
playbook (drop the passive press/depth cuts, add compactness +
marking) still failed: goals 4.69 / **5.77**, carry still up, tinker
still punished. **Root cause = the engine's carry is a TERMINAL
state**: a breakaway is a carrier already isolated with space, and no
DEFENSIVE pre-kickoff gene-bend undoes that — raising jockey just
backs off the fast carrier, and bending both teams' defenses toward
passivity opens the game end-to-end (the goals blow-up). This is
exactly the emergence-memo trap (a hand-set bias fighting the
substrate); reverted rather than shipped. Full-revert: `gameplan.ts`
+ probe deleted, `oppChannels`/`createMatch`/`Match.plans`/
ClashBanner/i18n/css restored — tree clean, vitest 441, fingerprint
`848370ae` UNCHANGED.

**119d-1 — OFF-BALL SEPARATION (supply side)** ⚠️ **ATTEMPTED +
REVERTED 2026-07-18 (four measured cuts, honest negative; fingerprint
left at `848370ae`).** The user's playtest diagnosis (VERIFIED by the
new `supply-side.ts` probe): a pressed carrier has a clean forward
outlet only ~30% of the time (zero options 67%/76%), passes under
pressure just 14-16%, and dribbles/loses the rest — off-ball players
sit in covered lanes, not moving into open ones ("保持阵型有点呆").
The asymmetry: the engine rewards beating your marker WITH the ball
(momentum gate) but not WITHOUT it, so all "beat your man" value
concentrates in the carry. Cuts measured: ① support-spot peel off the
marker (null); ② peel + a "come show for it when the carrier is
pressed" boost + the marker reaction-lag generalized pitch-wide
(Phase 31.9's near-goal lag) — zero-options DID fall (61/62%) and
off-ball adhesion rose (65→77%), BUT the pitch-wide lag ALSO buffs the
carrier (a beaten defender recovers slower → the breakaway is easier),
so the re-evolved meta dribbled MORE (37→57%) and goals rose; ③ the
same without the lag = back to noise (the lag is what actually creates
separation — confirming the coupling — but it's double-edged). **The
iron law across 119b/c/d (four attempts): the carry's endpoint EV is
positive (a pressed dribble loses 43-49% but the ~38% that survive
reach a 1v1 that still pays) + 6v6 space (beat one man = through), so
ANY change that adds space/separation helps the carry ≥ it helps
passing. Supply-side AND defensive-side levers cannot move it.**
⭐ THE REFRAME (user, 2026-07-18 — "现实6v6会出现这种情况吗"): a
carry-LEAN meta is REALISTIC for small-sided football (dribbling/1v1
matter more the smaller the pitch) — chasing "passing dominance" was
the wrong target (it would make it play like 11v11). What real
futsal/6v6 has that ours lacks: (1) the GIVE-AND-GO as a co-weapon
(the pass beats the dribble over distance AND the passer bursts —
pass-and-move as ONE linked action, relentless rotation), and (2)
honest 1v1 conversion (~30-45%, ours 56-67%). The give-and-go
substrate EXISTS (`wallRun`/2过1, Phase 34) but is throttled: gene-
gated to fast/passing sides `(tempo+passBias)/2·wallPassW > 0.35`,
and the burst hits the same off-ball-separation wall — 89% of late
goals are unassisted (119b). Reverted clean; `supply-side.ts` probe
kept.

**119d — the REALISTIC target (the reframe applied): carry +
give-and-go CO-DOMINANCE, not passing dominance**: make the
give-and-go a genuine second scoring weapon (widen the wallRun gate
so it's not only a fast-team toy; give the "go" burst a real chance
to earn the return — the timed pass-and-move that draws the presser,
distinct from the static "get open" that 119d-1 refuted) + finish the
1v1 honesty (119b's keeper lever got conv to 56-67%; real is lower).
Measured by: give-and-go goal share UP in the census, carry share
eased toward a co-weapon (NOT eliminated — carry-lean is realistic),
goals floor held. Probe-first, A/B before commit (the 119c/119d-1
discipline). Structural fallback if this also fails: the carry is
6v6-space-locked and only 11v11 (parked) breaks it.

**119z — the counter-pick loop, a WORKING shape (the 119c lesson
applied)**: negative frequency dependence can't come from bending
DEFENSIVE genes toward a terminal breakaway. The lesson points
UPSTREAM/attacking-side instead — candidates: (a) game-plan the
ATTACK not the defense (a coach facing a compact/anti-carry league
buys through-balls/width — the counter that GROWS is the attacking
answer to the prevailing defense, reviving `through`/`cross` by
demand); (b) prevent breakaway ISOLATION upstream (supportDistance /
counterAttackBias cost when caught out) rather than answer it once
it's happened; (c) accept that the real lever is structural (11v11
space, parked) and pursue diversity elsewhere. Probe-first, A/B with
the `GAMEPLAN_OFF`-style toggle BEFORE committing — the 119c
discipline (measure adoption + goals + carry share, three gates)
stands. ⭐ FOLLOW-ON (user, 2026-07-18): once a working game-plan
lands, the clash banner becomes the MATCHDAY REPORT — this fixture's
formations, the coach's counter-pick and why. (The clash overlay
code was written + reverted with 119c; re-land it with 119d.)

**119e — the DIRECTIONAL TACKLE POKE (the 中场乱抢 re-examination)**
✅ **SHIPPED 2026-07-18 late (user-ratified "先A——符合现实,解围也
一般有方向"; probe-first, two refuted models on the way).** NEW
`scramble-anatomy.ts` (episode = a contest-event chain, gaps <2s,
≥2 possession flips between the teams) quantified the pinball at
HEAD first: **8.15/8.90 scrambles/match, mean 2.9s, 11-12% of open
play, 60-63% in the MIDDLE third, 5-6 bodies within 6m at the peak**
(open-play baseline 2.4-2.6), and **21-24% of ALL goals
scramble-preceded** (a breakaway forms <5s after 20-26% of them).
Shape HELD during scrambles (12.1 vs 11.1m off-spot) — the 人堆 is
structural midfield density + converging assignments, NOT shape
abandonment (the 119d-1 lesson holds). Entries: ~50% first-touch
spills · 35-39% tackle squirts · 9-16% contested pass flights — half
the entries are ACCIDENTS, which is why no selection gradient ever
removes the scramble on its own. THE LEVER: the won-tackle squirt
was `fromAngle(rng 0..2π)` — a physically dishonest uniform spray,
half of it handed back toward the winner's own net. Now a standing
tackle steers WIDE — the away-from-own-goal ray bent toward the near
touchline, ±69° noise (far too wild to be a pass); the slide keeps
momentum/heading physics (you cannot steer from the grass). ⭐ TWO
REFUTED MODELS mapped the design space first (both A/B'd, both
discarded pre-commit): v1 heading-cone (chase-from-behind tacklers
face their own goal — scrambles AND scramble-goals ROSE), v2
straight up-pitch clearance (scrambles −23% BUT the poke became a
free VERTICAL out-ball over the press to the deliberately-high
defend-shape ST: goals-warming re-inflated 11.18→15.4 and fresh
evolution railed press/transitionPress to 0.75/0.8). **THE COUPLING
LAW: a squirt's dispersal power is inseparable from its counter
danger — WIDE is the only direction that passes the scramble gate
AND the goals gate.** Measured (v3, all gates green): scrambles
7.75/7.86 fresh-evolved (−5/−12%) · 7.49/8.66 frozen-gene;
scramble-goal SHARE ~flat (the payoff end is untouched — that's the
spill/give-and-go frontier, 119d); goals-warming **11.48
(2.93/4.71/3.84)** ≈ the 119b arc low 11.18, 424242's 2.93 the
lowest single world of the arc; calibrate 2.01/2.36/2.30 vs 119b's
1.88/2.36/2.32 (noise); vitest 441 with ZERO re-anchors (draw count
preserved); visual 134+54; fingerprint REBASELINED `5c6226fa…`.

**119f — the KEEPER-RELEASE lane read (look before you throw)** ✅
**SHIPPED 2026-07-18 night (user reports; substrate-honest asymmetry
fix, all gates green).** `keeper-release.ts` (new probe, kept)
decomposed the two release paths at gen 21: GOAL KICKS are taken from
the FEET through the normal lane-aware pass loop (blocked-lane 4-5%,
clean); the HANDS throw/sling was choosing its target by
`opennessOf(receiver)` ALONE — it never read `laneOpenness` the way
every outfield pass does (`PlayerBrain.ts:281`), so a "wide-open" mate
with an opponent parked in the throwing lane got the ball thrown AT
that opponent → the bounce-back the user sees (blocked-lane 9-18%,
lane-HITs landing 60-79% in our OWN defensive third). THE FIX (one
line, no new mechanic): the flat throw/sling score is multiplied by
`0.3 + laneOpenness·0.7` — a keeper now looks before he throws, the
same read the outfield already has; the lofted PUNT is left alone (it
clears heads). ⭐ INSTRUMENT NOTE (the valid measure): FRESH-evolution
is USELESS for this small lever — re-evolved worlds swing the GOAL
KICK's blocked-lane 4%→28% between snapshots though its code was NEVER
touched (ecology re-roll dominates, the [[grader-lever-noise]] lesson
in football form). The FROZEN-gene A/B is the controlled instrument:
hands blocked-lane 9→6% (991) / 18→13% (424242), lane-HITs 3→2% /
7→4% — a real ~30-40% cut in throws-at-an-opponent. Safety gates:
goals-warming 11.54 (3.36/4.43/3.75) ≈ 119e's 11.48 (no inflation);
calibrate 2.21/2.30/1.96 (early band); vitest 441 green; visual
134+54; fingerprint REBASELINED (behavioral — different keeper target
picks → new draws). ⭐ HONEST SCOPE: this fixes the throw-AT-opponent
case only; the DOMINANT keeper-turnover cause is the RECEIVER spilling
the first touch (receiver-SPILL 8-13%), which is 119f-spill's job.

**119f-spill — the first-touch SPILL (停球失误)** ✅ **PROBED →
NO-FIX (honest negative, `spill-anatomy.ts` kept).** The spill model
is HONEST: at gen 21 the "SHOULD-NOT-SPILL" residual (unpressured +
facing + controllable-speed) is only **10% of spills** (~0.5-0.7/
match); the other 90% are genuinely hard receptions — 48-57% under
HEAVY pressure (≥0.5), 36-39% blind-side, 90-95% at controllable
speed but in the contested MIDDLE third (53-67%). Spill rate ≈ 1 in 9
receptions (4.7/34 · 7.3/58 completed), concentrated exactly where
real football miscontrols. `touchFailChance` (speed × pressure ×
misalign × technique) prices a slow unpressured facing ball at <1%
fail and a 14 m/s pressured blind ball at ~11% — the ramp is honest.
⭐ VERDICT: NOT a substrate dishonesty → no fix. Nerfing it would (a)
be un-football and (b) trip the 119d-1 iron law (easing reception
helps the carry ≥ passing). The ugliness the user sees is the spill
FEEDING a scramble — that's the scramble PAYOFF frontier (give-and-go
/ 119d), not the reception. `spill-anatomy.ts` kept for whenever the
give-and-go co-weapon is picked up.

**119g — the 赛前 UI (matchday report)** ✅ **SHIPPED 2026-07-18 night
(the revert→reframe of 119c: its SAFE UI half, standalone, ZERO sim).**
The existing pre-match ClashBanner (two DNA radars + formation pair +
scheme + morale + nameplate) is now the MATCHDAY REPORT: each side card
gains the DUGOUT figure (👔 coach name), a recent FORM strip (last 5
league W/D/L, the 114 data), and the LEAGUE STANDING (division rank +
points); the middle gains this season's HEAD-TO-HEAD (played fixtures
between the two, normalized to the home perspective). `show()` now
takes a `ClashContext { population, league, fixture }`; friendlies /
cup ties / exhibitions degrade cleanly to the DNA-only view (no fake
standings). Pure reads off league + fixture — fingerprint IDENTICAL
`ab2e43bd…`. Gates: vitest 441, visual 136 (+2: coaches named, form+
standing rows) + 3D 54, phone 390px still fits, build clean.
⭐ NOT DONE (the (b) half, deliberately deferred): the mild pre-match
BEHAVIOURAL plan. 119c REFUTED defensive gene-bend counter-picking
(fed the terminal breakaway); per 119z + [[feedback-revert-reframe]] a
working plan must be ATTACKING-side / upstream and probe-gated against
no-regression (the revert→reframe rule) — a separate future attempt,
not bundled with the UI.

**119h — FREE THE MARKING SCHEME (the emergence-honest 乱抢 payoff fix)**
⏳ **ACTIVE (user, 2026-07-19 — "让防守自己进化,不预设逼人/区域或贴身/
范戴克比例").** The user's recall of the marking-scheme freeing test,
now re-measured fresh. ⭐ `scheme-balance.ts` (new probe, kept) at gen
21: the OLD imbalance behind the hand-lock (code comment: zonal ~3.5
vs man ~8 shots conceded) HAS CLOSED — man 4.7-4.9 shots / 2.0-2.4
goals conceded, zonal 4.0-5.5 / 1.4-2.0; roughly balanced now (991
zonal even concedes MORE shots). The "zonal dominant → league collapse"
danger that justified the lock has faded across the phases since.
Displacement confirms the mechanism survives: man defenders get dragged
11.9-12.5m off-spot, zonal holds shape 9.1-11.4m — a shape-holding
defence carries cover behind, exactly what kills the 乱抢 free-1v1.
⭐ ROOT CAUSE (why zonal stays 1-2/16 despite being balanced): scheme
is DERIVED from `markingAggression ≥ 0.3` (a hand threshold, not a
gene), and markingAggression ALSO pays for tackle-win (+0.2) + fouls +
press, so evolution keeps it high → man. The coupling HURTS zonal
(forced low-aggression → holds shape but can't win the ball) and makes
the AGGRESSIVE-ZONAL quadrant (hold shape AND tackle hard = the modern
zonal press) UNREACHABLE in gene space. THE PLAN was (1) quadrant probe → (2) decouple → (3) A/B. ⚠️ **STEP 1
REFUTED STEP 2 — DECOUPLE BLOCKED (2026-07-19, `quadrant-balance.ts`).**
Forcing all four {man,zonal}×{aggressive,passive} (neutral 0.5, only
scheme+aggression varied): man-aggr GF1.06/GA1.22, man-pass 1.00/1.36,
**zonal-aggr GF1.22/GA0.67 (5.7/4.1 shots) — DOMINANT on BOTH ends**,
zonal-pass 0.92/0.94. The unreachable quadrant is a FREE LUNCH: hold
shape (cover behind, 4.1 shots conceded) AND win the ball (aggression).
So a naive decouple → evolution converges on aggressive-zonal = a
DEFENSIVE MONOCULTURE with goals crushed to ~0.67 — exactly the
collapse the hand-lock was hiding. The old man-vs-zonal imbalance
didn't close; it MOVED into the coupling's blind spot. ⭐⭐ THE UNIFIED
ROOT: aggressive-zonal is unbeatable because **the ATTACK has no
zone-breaking primitive** — a zone doesn't track men, so you beat it
with MOVEMENT / combination / give-and-go, and our off-ball players sit
in covered lanes (the 119d-1 wall). The 乱抢 free-1v1, the off-ball
wall, the throttled give-and-go, AND zonal-dominance are ONE root: the
attack can't pull a defence apart (a zone especially). ⭐ REDIRECT:
freeing the scheme is BLOCKED until the attacking counter exists;
119h ⇒ folds into the ATTACKING-substrate lever (119d give-and-go /
zone-breaking movement). Don't decouple first — build the zone-breaker
first, THEN free the scheme and the four quadrants balance. Probes
kept: `scheme-balance.ts`, `quadrant-balance.ts`.

**STRATEGIC BACKLOG — the ATTRIBUTE/GENE AUDIT vs FIFA/FM/PES (user,
2026-07-19).** We carry 8 player attrs (pace/passing/dribbling/
finishing/defending/strength/stamina/reflexes) + 23 team genes + 9
derived traits. Cross-referenced against the standard football-sim
taxonomies, split into HAVE-BUT-PRESET-DEAD (coupled, can't evolve
independently) and MISSING-BUT-NEEDED. ⚠ SQUAD_BUDGET makes attrs
trade off — every new attr re-prices the whole economy (the reason
5→8 growth was PARKED at phase-47); each must EARN its place, add
deliberately, not wholesale.
- ⭐ **Positioning / off-ball intelligence / anticipation** — MISSING,
  the deepest gap: all positioning is team-gene + formation-table +
  brain logic; NO player-level "reads space / times runs" attr. Sits
  directly under the off-ball-separation wall (119d-1) + the
  give-and-go. The highest-value single addition.
- **GK attribute split** (handling / kicking / positioning distinct
  from reflexes) — MISSING/collapsed; keeper distribution accuracy
  uses outfield `passing`, catch-vs-spill isn't its own attr. Connects
  straight to 119f + 119f-spill (the keeper-release + spill lines).
- **Heading / jumping** — PRESET-DEAD (derived from strength×0.3 +
  defending×0.15 + role via `aerialSense`); a small timing-header or
  a strong non-jumper can't exist. Feeds the aerial channel + set
  pieces.
- **Acceleration vs top speed + agility** — collapsed into `pace`
  (→topSpeed only); tight-space turning / the momentum gate.
- **Tackling vs marking** — both are `defending`; a great marker ≠ a
  great tackler (feeds scheme diversity).
- Folded acceptably (low priority): composure→finishing, vision→
  passing+playmaker-trait, first-touch→dribbling, set-piece specialism.
Priority order: scheme-gene (119h, in flight) → positioning attr (its
own big project, budget impact) → GK split (rides the keeper line) →
heading / accel / tackling splits.

**119i — THE ATTACKING ZONE-BREAKER: make the seven dilemma-creators
EMERGE** ⏳ **ACTIVE (user, 2026-07-19 — "我希望这七个能在我们的世界
都涌现出来").** The real form of 119d and the UNBLOCKER for 119h. Real
football breaks a defence by manufacturing a DILEMMA (space+time the
defence can't deny in two places at once); against a ZONE specifically
(which defends space, not men) the seven tools are: (1) OVERLOAD /
local 2v1, (2) TIMED third-man run into a seam, (3) GIVE-AND-GO /
combination that beats the shift, (4) SWITCH of play (punish the
ball-side compaction), (5) DRAG / decoy run, (6) DRIBBLE-to-commit,
(7) WIDTH→penetrate. ⭐ EMERGENCE FRAME (not hand-coded): the unified
substrate defect is that **off-ball dilemma-creation does not PAY** —
the engine rewards beating your man WITH the ball (momentum gate →
carry → 1v1) but NOT without it (119d-1), so the only space-manufacturer
that pays is the dribble, and a held zone (cover right there in 6v6)
kills it → aggressive-zonal is unbeatable (quadrant probe). The job:
make each dilemma-creator PAY so evolution SELECTS it — enrich the
gene-driven, unbiased primitives + retire hand-set suppression + run
evolution and OBSERVE which of the seven emerge. NOT script "do a
give-and-go here". ⚠ The 119d-1 iron-law trap: the target is movement
that creates a DILEMMA (commits/overloads a defender), NOT generic
separation/space (that helped the carry). Success metric: the attack's
goals vs the FIXED aggressive-zonal wall rise (quadrant-balance as the
yardstick), goals floor held, carry share eased toward co-dominance
(not eliminated). PLAN: probe-first inventory (which of the seven fire
/ pay today, measured against the zonal wall) → enrich the highest-
leverage primitive → A/B + fresh-evolution + goals-floor + the zonal-
break metric. Realism note: small-sided football breaks compact
defences via ROTATION + give-and-go + 2v1, not dribbling alone — these
are futsal-honest, NOT an 11v11 import. Deep enabler behind all seven =
the MISSING positioning / off-ball-IQ attr (its own project).
⭐ FIRST LEVER PROBED (2026-07-19, `wallrun-anatomy.ts` + `give-and-go`):
the give-and-go is the sharpest zone-breaker (it beats a PRESS, incl.
aggressive-zonal) and its substrate EXISTS (`wallRun`) but is toothless
— oneTwos 0.07/match. Anatomy: licenses fire ~3/match, the burster DOES
get open (peak separation ≥4m in 55-68%, x̄ 5.5m — the "GO" works), the
carrier chooses to return only 3-4% — because **the WALL (B, who
received A's pass) LOSES the ball before the return: 80-81% dispossessed
before peak**. Root: B receives under pressure (the license needs
pressure>0.2) and tries to CONTROL/settle → pressed → lost, instead of
playing the real give-and-go: a FIRST-TIME return into A's burst. B has
no "I'm the wall, lay it back one-touch" behaviour. THE FIRST 119i
ENRICHMENT ⚠️ **ATTEMPTED + REVERTED 2026-07-19 (double FAIL, fingerprint
back at `ab2e43bd`).** Made the wall B lay a FIRST-TIME return (a
boosted through-ball led into A's burst, penetration filter bypassed,
gene-priced). MECHANICALLY it fired: frozen-gene oneTwos 0.07→0.52/0.39,
return-played 4%→33%, and it broke the aggressive press a little
(quadrant zonal-aggr GA 0.67→0.93). BUT the two gates that matter both
failed: (1) EVOLUTION DE-SELECTS IT — fresh-evolved, the wall-pass gene
gate fell 7→2/16 (424242) and oneTwos collapsed to 0.01-0.06; given the
choice, evolution drops the wall-pass appetite because the return is
net-negative-EV (A receives cleanly only 6%, assists ~3% — B firing a
through-ball into A's burst mostly gives it away or doesn't create a
clean chance). (2) IT INFLATES GOALS — goals-warming 15.25 (5.19/5.96/
4.10) vs the 11.54 baseline (+3.7, the refuted-v2-tackle-poke magnitude):
the license fires ~3/match regardless, so the added through-balls feed
converting chances once finishing maxes. ⭐ THE LESSON: making the
return FIRE is not enough — the completed one-two must be POSITIVE-EV
(reliably a better chance than the alternative) for evolution to select
it; the frozen oneTwos 0.5 was an artifact of old genes that happened to
carry wall-pass appetite. The missing piece is the RETURN QUALITY: A
gets open (peak sep 5.5m, measured) but can't convert the received ball
— which points back at A's off-ball run timing + first touch on the
return = the MISSING positioning/off-ball-IQ attr. A/B metric for the
next try = combination goals up AND evolution KEEPS the appetite (gate
holds) AND goals floor held. Probes kept: `wallrun-anatomy.ts`,
`quadrant-balance.ts`, `scheme-balance.ts`.

**119j — the POSITIONING ATTRIBUTE, foundation + reception wiring** ✅
**SHIPPED 2026-07-19 (user "开始"; the 9th attribute, the enabler the
seven need).** The give-and-go failed because the RETURN QUALITY (A
can't convert the received ball) is un-evolvable — all off-ball quality
was team-gene + formation-table + uniform brain logic, no PER-PLAYER
"reads space / times runs / receives under pressure". So: added
`positioning` as the 9th player attribute (appended LAST in ATTR_KEYS so
founders' other attrs draw byte-identical), SQUAD_BUDGET raised 36→40.5
(= 9×9×0.5, preserving the tuned 0.5 density so it's a real trade-off,
not free), save v31→v32 with a TOP-OF-CHAIN backfill (the v17→v18 budget
pass calls enforceBudget → a squad missing the 9th attr NaN-poisons the
rescale, so the backfill must precede the whole chain; v13→v14 rebuilder
carries it too). FIRST WIRING POINT (of four planned): reception under
pressure — `touchFailChance` gains a positioning term that tames the
PRESSURE + BLIND-SIDE penalties (neutral at 0.5, so backfilled saves +
the tuned physics are bit-unchanged there). ⭐ VERDICT — validated but
WEAK on this channel alone: maxed-genome BITES (pos-0.9 spills 3.83 vs
pos-0.1 4.70, −19%) but is goal-NEUTRAL (pos-0.9 GF 1.67 ≈ pos-0.1
1.66); fresh-evolution SELECTS it only mildly (0.39→0.43-0.46 by gen 23
vs defending's 0.55-0.59) — because possession-retention is weakly
rewarded in this engine (goals are scramble/carry/transition-born). So
reception is the WEAKEST of the four wiring points; the payoff comes
from the IMPACTFUL ones — run-timing (creates chances) + defensive reads
(prevents them) — queued next. Gates: goals-warming 11.67 (3.47/4.07/
4.13) ≈ 11.54 baseline (ZERO inflation — the density-preserving budget
raise worked), calibrate 1.76/2.05/2.25 (early band), vitest 441 (+2
re-anchors: shapeHistory attr-count → ATTR_KEYS.length, league v13
migration robust to the new attr), visual 136+54 (radar auto-gains the
9th axis), fingerprint REBASELINED `d309f250…`, save v32.
⭐ NEXT (119k): the IMPACTFUL wiring — (1) run TIMING off the offside
hold (positioning times the break: onside + arrives with the ball),
(2) DEFENSIVE reads (interception/cover positioning — the shape-holding
cover that also kills the 乱抢 free-1v1), then re-attempt the give-and-go
with positioning making A's return-reception clean. A/B each: does a
positioning archetype EMERGE and win, do the seven start appearing, is
the aggressive-zonal wall finally breakable (quadrant metric).

**119k — POSITIONING wiring points 2-3 (run-timing + defensive reads)**
⚠️ **PROBED → BOTH MARGINAL, NOT SHIPPED (fast maxed-test caught them
before any evolution burn; fingerprint stays `d309f250`).** Two more
wiring points tried, each killed by the `positioning-bite.ts` maxed
test: ① SEAM RUN (runTarget pulls a high-positioning runner's Y toward
the largest gap in the defensive line) — REFUTED, pos-0.9 scored LEAST
(GF 1.35 vs pos-0.1 1.50) and conceded MOST (1.56): "run to the biggest
gap" is a hand-coded SINGLE pattern that disrupts shape, not a chance-
creator (the ball must arrive there AND the space ahead is still
defended). ② INTERCEPTION READ (canInterceptPass timing margin scaled
by positioning) — WEAK, pos-0.9 GA 1.43 vs pos-0.1 1.48 (−0.05, noise).
⭐ THE PATTERN (three wiring points now: 119j reception weak, seam-run
negative, interception weak): individual positioning quality-scalers
all move only the MARGINS, because the engine's scoring is dominated by
the carry / scramble / transition economy — improving reception /
interception / run-target quality doesn't touch it. ⭐⭐ THE USER'S
REFRAME (2026-07-19, mid-119k — "跑位其实也很多变…鱼钩跑,肋部跑,拉边,
套边"): the seam-run failed for a DEEPER reason — I hand-coded ONE run.
Real off-ball movement is a VARIED REPERTOIRE (fish-hook / check-and-go,
half-space 肋部, pull-wide 拉边, overlap 套边…), and WHICH run fits the
moment must EMERGE from the substrate + genes + positioning, not be
hand-set. So the attacking side becomes 119l (a real emergence project),
NOT more single-pattern wiring.

**119l — the RUN REPERTOIRE (emergence, per the user's reframe)** ⏳
**QUEUED.** Enrich the off-ball run substrate into gene-driven, unbiased
PRIMITIVES so a variety of runs (fish-hook / check-away-then-burst,
half-space, pull-wide, overlap, near/far-post, drop-and-spin…) can
EMERGE and be SELECTED per situation — positioning = the player's
ability to read which the moment calls for and execute it. Some already
exist hand-licensed at the team level (overlap 套边, the arriver, the
weak-side far-post pull) — the project is to make the repertoire
per-player + evolvable, not TeamBrain-thresholded. This is the honest
form of "make the seven emerge" for the attacking side; big, probe-
first, maxed-test each primitive (does it create chances vs a set line
without just feeding the carry). ⚠ The 119k lesson: do NOT hand-code a
single run pattern; build the repertoire + let selection choose.
⭐ BASELINE PROBED (2026-07-19, `run-repertoire.ts`, gen 21) — the
PREMISE IS UNDERCUT: runs are TIGHTLY marked (83%/69% have a marker) and
DO get open (peak separation 5.6m), but are FOUND (a pass aimed at the
runner) only **14-16%** and convert ≈0%. So the bottleneck is NOT run
variety — **runs aren't SERVED**: the carrier prefers to carry (the
monoculture, 6v6-space-locked: beat one man = through, so carry-EV >
pass-EV). A fancier repertoire helps ONLY if it makes runs SERVED — the
run must DRAG the marker to open the LANE (not merely the runner's own
separation), raising the found rate, AND the carrier's carry-vs-pass
economy must shift. Same carry wall every attacking lever hit this
session (119c, 119d-1×4, 119i, 119j, 119k). ⭐ IMPLICATION: try the run
repertoire ONLY as "drag-the-marker-to-open-the-lane" (a served-run
primitive, maxed-tested on the FOUND rate), not prettier in-behind runs.
If that too hits the wall, the arc's terminal finding stands: the attack
is carry-locked and only 11v11 (more space → beat one man ≠ through)
structurally breaks it. `run-repertoire.ts` kept.

**120+ — Stage 4 continues**: home advantage → memory commentary.

**STANDING / WAITING-ON-USER**: ① the 105 audio mix needs the user's
EARS (every gain has a dB paper trail in the 105 entry — report by
layer name); ② itch push is manual+theirs (Pages auto-deploys); ③
amb-loop seam listen; ④ prematch/reel/shootout BGM slots when tracks
arrive; ⑤ render pageantry parked (foot IK/cloth/celebrations);
⑥ 11v11 deliberately parked (engine-scale).

⭐⭐⭐ **THE MORNING RUN RESULT (2026-07-18 06:00-12:00, phases 102-105
— the user's morning ratification executed: "1.删掉…2.路线a…go自走" +
the audio round)**: **102** ✅ anchor dead (λ=0, purity back) · **103**
✅⚠ closeIn — the save model's missing closing-down credit (probed the
whole design space first: extended charge REJECTED at GA 5.13, custom
poke deleted by its own measurement; aggr gains an interior optimum;
adoption still ecology-dependent) · **103.5** ✅ jockey A/B re-read:
gap narrowed to noise · **104** ✅⚠ Route A = the OUTNUMBERED DUEL
(stalled carrier + helper ≤3m ⇒ +0.12; dribble-meta A/B parity — first
non-loss; late means 15.72 total = the arc's low, no blowout world;
991 evolved a cover+pace school instead of jockey = defensive
DIVERSITY) · **105** ✅ the measured audio mix + title-anthem
pause-lifecycle + mobile dual-context unlock + SFX default ON.
The inflation arc REMAINS OPEN (late conv 48-60%) — queue item 106.

⭐⭐⭐ **THE OVERNIGHT RESULT (2026-07-18 02:00-04:40 — the queue below
EXECUTED, phases 93-101, nine commits+tags all pushed, every gate
green).** One-line map: **93** ✅ composure earned (composed-1v1 share
78/82→75/73%) · **94** ⚠ school academies work, adoption still 0/3 —
because 93 devalued containment's prey · **95** ⚠⚠ anchor swept+shipped
λ=0.05 but REFUTED as the closer (3-world verdict; inflation's real
engine = the xg/shot proximity climb 0.16→0.26) · **96** ✅ the synthwave
TITLE SCREEN (click-to-enter starts the Title BGM; music born at 60) ·
**97** ✅ hold-flutter measured & killed render-only (the 31.9 quanta
gaps, 21.6% of distribution frames) · **98** ✅ keeper distribution
GENETIFIED (roll/sling/PUNT — four school signatures) · **99** ✅
probe-only: the pinned-winger premise refuted (escape already fires;
turnover 3%) · **100** ✅ WOODWORK (0.38/match, your crossbar sample is
live) · **101** ✅⚠⚠ contain hysteresis + the A/B re-read.
⭐ **TWO DECISIONS WAIT FOR YOUR MORNING:**
**#1 the anchor** — keep or kill `FITNESS_ANCHOR.conceded` (0.05,
one line in evolution/fitness.ts): it stabilized only the sweep world;
evidence in the 95 entry. **#2 containment's reward** — the phase-92
neutral A/B win is GONE at current HEAD (0.9-jockey 1.16 vs 1.61):
either a won containment gets a REWARD channel (possession value) or
defensive worlds stay ecology-dependent; the offside-trap gene and
chaser-count redemption are parked downstream of this call.
Also parked: itch push (manual, yours); amb-loop human listen.
HEAD `3249ad64…` (phase-101), calibrate 2.63/2.97/3.26, vitest 421,
visual 109+52, Pages CI deploying phase-101.
⭐⭐ **THE RATIFIED OVERNIGHT QUEUE (user 2026-07-18 "同意dc…连夜自走
到结束") — execute IN ORDER, one phase = one commit+tag+push, full
gates each (vitest, both visual suites, calibrate 3 seeds on
behavioral changes, fingerprint identity-or-rebaseline, both
ledgers). The user is asleep: do NOT block on questions; every
decision below is pre-ratified.**

**93 — D: dismantle the composed-1v1 gift** (user-ratified de-patch).
The 28.4 hand gift (aimMargin×0.72 + spread×0.7 for `oneVone`) is
the inflation engine's core and is attribute-blind. Make composure
EARNED: scale both bonuses with `finishing` (neutral at 0.5 —
early-preserving; a 0.9 finisher keeps ~today's gift, a 0.2 panics).
Gates: shot-context anatomy (composed-1v1 goal share ↓ from 76-81%),
goals-warming 24g (direction: late means ↓), calibrate early band
holds ~2.5-3.4. Expect keeper-throw/card seed re-anchors (6th dance).

**94 — C: school-linked variation** (user-ratified). The two-locus
valley: jockey needs defending. Fix DISCOVERY, not the objective:
the academy grows what the coach's philosophy needs —
`newgenFromBloodline` gains a philosophy pull (attr drift toward
defending scaled by (jockeyBias−0.5), budget-clamped, and the
mirror: dive-in coaches drift pace). Founders/fitness untouched.
Gates: 24g warming — jockey ADOPTION stability (≥2/3 worlds hold
>0.5 when it pays) + def attr movement; goals direction.

**95 — the VERDICT gate**: rerun warming 24g×3 worlds clean. IF
late-gen means land ≤~3.8 and falling → declare the inflation arc
CLOSED (ledger the full story), skip the anchor. ELSE → the
PRE-AUTHORIZED fallback A: a MODEST absolute conceded-goals term in
fitness (λ small, swept {2-3 values} on one seed, pick the least
that stabilizes; document the phase-50 purity tradeoff in the
ledger; final ratification flagged for the user's morning).

**96 — the TITLE SCREEN** (user-designed): synthwave/chiptune launch
overlay — retro grid horizon + neon sun + pixel accents, animations
pulsed at 120BPM (500ms multiples) to match the Title track;
"click to enter" = the WebAudio gesture that starts the Title BGM
(slot already in MusicSystem); START dismisses to the game (attract
mode: the match runs beneath). ⚠ BOTH visual suites must dismiss
the overlay first or all checks fail — add the dismiss step to
each. Music volume default: raise to 60 so the title actually
sounds (user intent); slider still rules.

**97 — keeper-hold render bug** (user report: 球诡异上下颤动 +
队员一下一下抽动): suspects — the held-ball hands anchor riding the
keeper's idle bob each frame (BallModel heldY + hands blend), and
the receive one-shot re-triggering / the phase-92 contain-target
flipping across its goal-side threshold (hysteresis needed).
Render-only, fingerprint identity.

**98 — keeper distribution genetified** (user-ratified today:
"门将出球选择应该和战术有关"): replace the hardcoded
throw/pass/hoof tree with genome-scored options — buildUp/passBias
→ short to feet; counterAttackBias → the fast long throw;
pressured + no build-up genes → the punt (whose landing feeds the
63 aerial channel = strength linkage). Behavioral: full gates.

**99 — the pressed-winger escape** (user question ①): expose
"beaten to the byline? play the fullback's shadow" — through-ball
appetite behind the presser when the carrier is pinned wide, priced
through existing pass scoring and gated by genes (passBias/risk),
NOT a hand trigger. Probe first (does the situation occur and go
unused?). Behavioral: full gates.

**100+ (queue tail, order per judgment)**: offside-trap gene
(hold-the-line vs track-runner, natural tension with coverBias);
woodwork sim mechanic (unlocks the crossbar sample); redeem the
chaser-count hardcode; N6 follow-through (fitBias drift watch).

Standing: the user PLAYS CONTINUOUSLY — casual observations ARE the
play reports; goals-band verdict = theirs; amb-loop human listen
still open. HEAD fingerprint `f4750bb9…` (phase-104; 105 is UI-only identity). The user PLAYS CONTINUOUSLY —
casual observations ARE the play report stream. Parked: foot IK/
skinned meshes/cloth, celebration choreography (sim-touching), amb
loop human listen (user's ears).
HEAD fingerprint `c8d81a2e…` (phase-80 rebaseline; 81/82 probe-only).

## ⭐⭐ THE EMERGENCE PIVOT — [`EMERGENCE-PIVOT.md`](EMERGENCE-PIVOT.md) (2026-07-14)

**The approach changed.** The play-report-driven small-mechanic era is
PAUSED. The user reframed the project: **tactics / skills / styles must
EMERGE from evolution + selection, not be hand-coded** (memory
`feedback-evofootball-emergence`). Do NOT hand-design more mechanics.

Measured this session (`scripts/probes/evo-drift.ts`, 50 gens × 2 seeds):
evolution ACTIVELY SELECTS the no-space slugfest — `attackingWidth`
collapses **0.57→0.19 / 0.45→0.09**, `pressIntensity` climbs to
**0.74 / 0.85** — because width/skill don't PAY in the substrate (the 1v1
duel `tryTackles` ignores pace). So the "no space / midfield churn" the
user hates is the EVOLVED equilibrium, and any hand-set width/winger fix
fights that gradient and gets collapsed back.

**Substrate rework, gated by evolution:** (1) ✅ **phase-41 SHIPPED** — the
master gate: the 1v1 (`mechanics.tryTackles`) now rewards carrier pace
(momentum-gated `pace·clamp(len(vel)/9)·0.20`) + technique (0.12→0.18),
UNBIASED (no role hardcoding); (2) ✅ `evo-drift.ts` gate PASSED —
`attackingWidth` no longer craters (baseline 0.57→0.19 / 0.45→0.09; now
bottoms then CLIMBS OUT to 0.27 / 0.31, seed 777 rising 0.077→0.313 on its
own), dribbleBias climbs harder, press softens; goals 2.41/1.78→2.71/2.17
(mean 2.44, on target), won tackles 16.8→11. (3) ✅ **phase-42 SHIPPED —
released `DEFAULT_POLICY` (attacking-style subset) to per-franchise evolution**;
`policy-emergence.ts` gate PASSED — cross-franchise style spread 0% → ~20-24%
and PERSISTS (distinct styles coexist), goals mean 2.52 (on target). (4) ⭐
**broaden it** (user: build-up / 防守 / 套路 / players should all emerge): ✅
defence (43) + build-up (44) SHIPPED — chase/mark/intercept/clear + pass/outlet/
support genetified, ATT+DEF+BUILD spread ~20%, goals 2.40 / 2.34. NEXT (easier
lot): 套路 combos + style-COHERENCE measurement. ⚠️ **DEFERRED to a later FABLE
model (user 2026-07-14, hardest): player-attribute expansion + the evolution VIZ
module** — both scoped in **`EMERGENCE-PIVOT.md`**. HEAD fingerprint
`79f6dd04…` (phase-44).

Everything below is the pre-pivot play-report history (still valid as
mechanics reference; the ITERATION MODEL is superseded by the above).
## Standing rules & conventions (LIVE — read before any phase)

**Tag convention (user-ratified 2026-07-13):** point tags attach to the
MECHANIC FAMILY they iterate (36.1 = touches, like 34.2/34.3 before
it), NOT to chronology — so the badge (latest tag on HEAD) can show a
LOWER number than the newest chapter; phase-36.1 following phase-40 is
correct, not a regression (phase-28.5 continues the pattern — a keeper-
family tag on the newest HEAD). Never force-retag pushed tags (worktree
A/B baselines and CI history ride on them). The CURRENT fingerprint lives in the head above.

Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–13):
**every phase ends with PROBE evidence** (user rule 2026-07-13, invariant
11: a `scripts/probes/` tsx measuring the mechanic's own rate/shape —
same-seed A/B vs the previous tag for "X improved" claims, two calibrate
seeds before believing deltas, headless choreography probes for
render-side logic, strip-and-rehash for schema growth);
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

The full pre-pivot phase history (phases 30–34.3 chapter by chapter, the
old play-report queue, every probe number) moved to
[`ROADMAP-ARCHIVE.md`](ROADMAP-ARCHIVE.md) — still valid as mechanics
reference; the iteration model it describes is superseded by the
blueprint above.
