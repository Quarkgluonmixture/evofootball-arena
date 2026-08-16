# PROGRAMME — moved track-table histories (verbatim)

> Verbatim historical result narratives relocated out of
> [`PROGRAMME.md`](PROGRAMME.md)'s track tables by ruling #45.2(0)
> (2026-07-28). Each section below is the **full original table-row cell,
> unedited**; PROGRAMME.md keeps a one-line description + verdict + a link
> back here. The per-stage design/handoff docs remain the primary record;
> this is the programme-level history that had grown too large to sit inline.

## C1 ★ — PHASE 0 DONE 2026-07-24 — premise survives, drafted Phase-2 shape REFUTED.

| C1 ★ | Pass power as a priced choice: launch speed stops being a pure distance formula (`prediction.ts:65`); 2–3 power options per candidate pass priced by the EXISTING interception/receivability machinery; technique-scaled execution noise; receiver control difficulty already priced by M3 touch≠control. First LIVE change since M4 — six-layer PROBE-CONTRACTS treatment, user play-test is the final gate | [`PASS-POWER-SLICE.md`](PASS-POWER-SLICE.md) §6–7 | ⚠️ **PHASE 0 DONE 2026-07-24 — premise survives, drafted Phase-2 shape REFUTED.** The power seat already exists (`orientationPowerMul` scales both lead and launch, `mechanics.ts:288-298`) and reception cost is real but weak (+0.010…+0.029 pFail for a 1.15 ball at 15m vs −17% flight time, and interceptors get demoted to deflections) — but the live evaluator (`laneOpenness`/`opennessOf`) is entirely **speed-blind**, so 2–3 power options score IDENTICALLY: the FIRES gate fails by construction. Fork in §7: **C1-A** dormant plumbing + noise + anatomy probe (bit-identical, authorised by §3) → **C1-B** honest speed-dependent M3 control cost (LIVE, user gate) → **C1-C** choice layer redrawn on C1-B's ledger. Ratified 2026-07-24; C1-C **deferred into the Embodied Decision Slice**. <br>✅ **C1-A SUBSTRATE LANDED** (§9): power executable + mis-executable, fingerprint `57b0bdab…c673` unchanged, 702/702. ⛔ **C1-A ledger FAILED** (SHA `249f7e41…c90a`): G1 non-monotone (0.477/0.570/**0.430**) and G2 inverted — diagnosed as *this contract's own* privileged 1.00 baseline (the only arm drawing no execution gaussian), a power-dependent lead that moves the corridor, and a 3s window in which world divergence dwarfs the effect. Pure touch-quality signal 12.9/10.6/12.5% ⇒ reception cost really is near-free ⇒ **C1-B mandated on measured ground**. Re-posed as **C1-A2** (§10, probe-only). ⚖️ **C1-A2 RESULT (§11, SHA `7e0ff4d5…257b`, 120/120, every arm spending 4 uniforms):** H1 **PASSES big** — contested opponent-first 0.565/0.489/**0.391**, spread **17.4pp**, and the ball reaches the intended man first 59→66→**76** of 120; H3/H4 pass. **H2 FAILS FLAT** — 11.9/12.1/11.8% spill: a ball arriving 3.6 m/s hotter costs the receiver NOTHING. ⇒ the convexity danger is now MEASURED (17pp risk cut for an unmeasurable penalty) ⇒ **C1-B mandated**, cost fixed in the substrate not the evaluator; ledger now trustworthy, no third re-pose. ⛔ **C1-B IMPLEMENTED → §2 BAND BROKE → HONEST REVERT (§13)**: the mechanism DID bite live (miscontrols 6.98→9.38, +34.4%, completion −0.4pp) but the band broke on TWO dimensions — goals 2.3944→2.0264 (**−15.4%**) and long balls 6.2042→7.9525 (**+28.2%**) — plus three behavioural suite contracts (wide-teams-cross-more INVERTED 28→21, stamina economy, free-agent market). Making ground control honest re-routes the whole game while the evaluator is speed-blind ⇒ structural, not tunable. Reverted, fingerprint restored exactly; the one permitted redraw is **deliberately unspent**. ⭐ Recommendation: fold the touch-cost fix into the **Embodied Decision Slice** (§0.5) instead of repricing touch alone. Also learned: C1-A2's H2 metric can't see this (it asks 'ended in control', and M3 recontact re-collects spills) — future attempts must measure the FIRST TOUCH |

## C4 ★ — PHASE-0 CODE MAP DONE 2026-07-27

| C4 ★ | Aerial contest as an embodied process: jump timing / arrival / body position contesting the ball in the air, replacing scan-who-is-already-in-the-box resolution. MUST sequence with the pinned open-play box-arrival gap (crosses currently find nobody ~50% `noAerial` — a duel model without arrivals has nothing to contest) | **PHASE-0 CODE MAP DONE 2026-07-27** → [`C4-PHASE0-CODE-MAP.md`](C4-PHASE0-CODE-MAP.md) (ruling #26.4, read-only, zero code). ⭐ **Headline: the delivery is a well-built pass to a named man; the contest is a one-tick radius lottery; the arrival is ONE licensed body aimed at the WRONG RADIUS for a cross.** `~50% noAerial` is not a crossing bug — it is the arithmetic of a **1.35 m** contest radius (`constants.ts:182`) meeting a box the run system was never asked to fill. ✅ **Delivery is the healthy link** (`mechanics.ts:552-595`): lead capped at `CROSS_LEAD_MAX` 3.5 m, 18% goal-pull (0.25 was tried and fed the keeper), technique-whipped inswinger, `oneTouch` priced. Its target scorer (`PlayerBrain.ts:511-533`) ranks **the bodies already there** — it has no term for whether anyone is there, and nothing anywhere sends bodies BECAUSE a cross is coming. ⛔ **The contest is instantaneous** (`mechanics.ts:785-812`): `s = aerialSense + attacking(0.3 in the box) + (1−d/1.35)·0.35 + rng(0,0.45)` — no jump, no takeoff, no airtime, no body position, and **the die is comparable in size to every other term**. Keeper claims first inside 1.9 m (`745-776`); the chest trap pre-empts (`781`). ⛔⛔ **The arrival mismatch is the sharpest finding**: open play licenses 1–3 runners by `RUN_ROLE_W + localX/45` (`TeamBrain.ts:185-197`) and **none of them is licensed BY a cross**; the single wide-ball arriver (`205-218`) is routed to **the edge-of-box arc 16 m out** (`actionExecutor.ts:351-355`) — that is the CUTBACK target Phase 31 built, while a cross with an 18% goal-pull drops near the penalty spot. Non-runners hold `supportSpot` (`formations.ts:546-560`), which is **relative to the ball**, so a wide ball pulls the support structure toward the touchline. ⭐⭐ **And the engine ALREADY knows how to fill a box on a delivery — it only does it for corners**: 3 licensed crashers ranked by `aerialSense − dist(flag)/45` (`TeamBrain.ts:159-168`), routed to `cornerCrashSpots`, the closest one **re-routed onto the true parabola landing**, and **held 4.5 m off the spot until the taker steps up** so the crash is a timed burst (`actionExecutor.ts:304-349`). Open play has no crash count, no landing re-route, no timing. ⚠️ **The banked history constrains the design hard** (`ROADMAP.md:1246-1306`): two honest reverts at this exact seat — an openness value-field made the box EMPTIER (*"the box is a LOW-openness contested zone, so the scorer AVOIDS it"*), and the two-eye field spiked **offsides +50%**, the tell being bodies arriving **uncoordinated with the delivery**; plus the under-weighted datum that a BALANCED team already fills the box (`noAerial` 26%, `atkHeader` 33%), so the 46–54% belongs to cross-spam and the extreme WIDE archetype; plus the honest ceiling that cross→goal ≈5% here vs **1–2% in real football**, so raising conversion is the wrong target. ⚠️ **Instrument caveat for T0**: `cross-anatomy` attributes by `headersWon` deltas in a 4 s window, so a delivery CHESTED down or controlled on the ground counts as `noAerial` — the number is *"no header"*, not *"no arrival"*, and that difference is load-bearing for a duel contract. §6 leaves six open questions (which link is C4 · does the corner machinery generalize · is 1.35 m the substrate defect or is the missing thing TIME in the contest · what `attacking = 0.3` is really standing in for · what must NOT move · whether `noAerial` should be split before it gates anything) <br>⭐⭐ **DESIGN CONTRACT DRAFTED by the commander on that map (2026-07-27): [`C4-AERIAL-ARRIVAL.md`](C4-AERIAL-ARRIVAL.md)** — the six questions RULED: **C4 v1 = the ARRIVAL link** (delivery healthy-untouched; contest physics deferred — "a duel model without arrivals has nothing to contest" still binds) · **the corner machinery generalizes by HALVES** (post-kick landing re-route = observable physics, generalizes now; pre-kick staged timing needs evidence/doctrine → Stage III's perception layer, never a hand trigger) · 1.35 m stays for now (contest TIME = C5/C7-family, own stage) · **`attacking = 0.3` is a NAMED SUBSIDY** (stays in v1, T3 measures double-pay, removal its own step) · **CONVERSION IS A CEILING (I2 hard)** — cross→goal ≈5% vs real 1–2%, every stage gates non-increase; deliverable = CONTESTS never goals · **`noAerial` splits FIRST** (T0: nobody-there / arrival-no-header / header — one number, two meanings, the E5a lesson). Stages: T0 definitions+arrival census → T1 routing fix flagged (box-crash target w/ onside guard + landing re-route; offside canary from revert 2's +50% blast = hard gate) → T2 probe A/B → T3 live battery + E4 preview round. Queues BEHIND C5's start (#26.3 order) | ⛔ **T2-ARRIVAL Phase A RUN 2026-07-27 — FAIL on D1 and F2** → [`C4-T2-ARRIVAL.md`](C4-T2-ARRIVAL.md) §7 (SHA `fc66f1f6…c597`). ✅ **A0 PROCEEDED cleanly** — R3+R4 **1.36%** CI [0.76, 2.02] vs an 80% stop threshold (median need 3.35 m vs a 7.95 m budget over a 1.03 s flight = **4.86 m slack**), and the target REPLICATED on an unseen block (H3 23.03% vs banked 22.90%): **the arrival gap is ROUTING, not reachability**. ✅ **F1 confirms the defect AND closes it**: licensed bodies still on `MakeRun` at band entry **58.66% → 93.17%** — **the box empties on 41% of crosses**, and the licence takes that to 7%. ⛔ **D1 = RESOLVED ABSENCE**: C3atk **+0.41pp CI [−0.65, +1.46]**, the CI's upper bound BELOW the pre-registered 2.32pp MDE and far below the expected +5.7pp — the gate had its power and the effect is not there (**reading (b)**). Mediators agree: H3 flat (+0.14pp), min-attacker-distance **+0.069 m the WRONG way**, bodies-in-box +0.027 resolved — **they stayed and arrived no nearer the ball**. ⭐⭐⭐ **WHY: the closest licensed body was already going.** Of 66,469 live-licence ticks the branch fired on **45.6%** and had nothing to add on **54.4%** — the closest licensed body was already the registered receiver (**83%**, carrying the identical Phase-63 `landing − flightDir·2.5` re-route) or a chaser already routing to the same landing via `interceptBall` (**17%**). §2.1 asked *whether* the receiver had the re-route, never *how often he IS the closest*. ⚠️ **The pre-registered backfire HAPPENED**: licence-survival alone (A1) is C3atk **−0.75pp CI [−1.77, +0.29]** (§4.8 named it — the arriver's 16 m arc target points AWAY from the landing), and the re-route rung recovers it to ≈0 — **the two halves cancel**. ⛔ **F2 = my gate, third time, two freeze-time defects**: the population was mis-specified (36,121 `noTrace` = predicting a fire for bodies whose action isn't `MakeRun`, when the branch lives inside `case 'MakeRun'`), and the 72 `unexplained` reproduce in ONE cell on ONE seed, all at `phase: 'halftime'` with the ball frozen to the last digit — `Match.step` returns before `simTime += dt`, so the probe compared a fresh expectation against a **stale trace held across the pause**. E1/E2/E3/corner-precedence all **exactly empty** as §4.3b predicted; **#32.1 banned the coupon-collector form and I replaced it with a per-record form whose POPULATION was wrong**. ✅ I2 bounded (+0.19pp); ⚠️ the offside canary passes but **resolves POSITIVE** (+0.066/match CI [0.013, 0.117], a fifth of the band, and NOT the attacking side). Nothing shipped, both flags default OFF, `src` dormant <br>Earlier: **T2-ARRIVAL PRE-REGISTERED 2026-07-27** (#32.4) → [`C4-T2-ARRIVAL.md`](C4-T2-ARRIVAL.md). ⚠️ **The pre-registration corrects the contract's own premise**: #32.4's "post-kick landing re-route" **already exists** in open play since Phase 63 (`actionExecutor.ts:159-166`, *"the 31.9 corner principle in open play"* — attack the descent 2.5 m upstream off the shared `ballLanding`), granted to **exactly one body**, the registered pass target. T2 therefore WIDENS an existing re-route rather than adding one. ⭐⭐⭐ **And the real defect is that the box EMPTIES during the flight**: `PlayerBrain.ts:1144` gates every licensed run on `carrier ? carrier !== p : phase === 'restart' || crashLive`, so a cross clearing `ball.owner` in open play **strips `MakeRun` from every runner and the arriver** the instant it leaves the boot (fall-through: `MoveToFormationSpot`), while `assignRunners` clears `team.arriver` every tick and re-licenses only in the wide channel the ball has just left — **Phase 31.9's bug, still live in open play**, already patched twice in the identical shape (`cornerCrash`; the overlap license at `TeamBrain.ts:114-117`). That explains H3 exactly. **Intervention = the open-play analogue of `cornerCrash`**: `c4Arrival` snapshots the ALREADY-licensed bodies at the kick and holds them for exactly `ballLanding(ball).t` (derived; armed only when `cornerCrash === null`), `c4ArrivalReroute` gives the closest one the meet point — **no new license, no new count, no new scorer, nothing pre-kick**, so revert 2's offside exposure is structurally bounded and the arc cutback is untouched. Gates: **A0 reachability census first** (read-only, may stop the stage but not re-tune it; STOP if `R3+R4 > 80%` of H3, derived off D1's MDE) · X1-X6 incl. **X6 corners-untouched** · F1 licence survival ≥90% · **F2 in #32.1's per-record-with-named-exceptions form** (the ban applied to my own gate the day it was codified) · **D1 = C3atk RISES**, MDE 2.32pp vs expected ≈+5.7pp, mediators M1-M3 · I2 HARD in #31.2's interval form · **offside canary HARD at +0.29/match = ¼ of revert 2's blast, SD MEASURED pre-freeze** (2.4861/match, SD 1.8298, over-dispersion 1.35 — Poisson would have been 16% optimistic) per #29.5. ⚠️ One interpretive call surfaced for reversal: **the defence gets no equivalent re-route** (defensible — the defensive landing-chase already excludes box landings by measured design, and the defence took 71% of T1-FLIGHT's new contests unaided — but NOT run as an arm, being outside #32.4's scope). Phase B is not this stage's (#32.3: the pair audit) <br>Earlier: ⛔ **T1-FLIGHT Phase A RUN 2026-07-27 — FAIL on F2 (my own max-over-5,547 gate, fired by ONE re-struck delivery; the other 5,546 exact)** → [`C4-T1-FLIGHT.md`](C4-T1-FLIGHT.md) §7 (SHA `7a1afab2…5075`). ⭐⭐ The mechanism WORKS: launch-headable 74.02%→**100%**, **H0 54.76%→1.62%**. ⭐⭐⭐ Contests **+3.42pp** CI [2.14, 4.69] — but **71% of them defensive** (C3def +2.44 vs C3atk +0.98), and conversion moved the OTHER way, resolved: **goals 10.76%→8.72%, −2.05pp CI [−2.82, −1.35]**. Honest flight = more aerial football, fewer goals. ⭐⭐ T0R §7.4's partition question ANSWERED against the flight: **H3 of all crosses 11.74%→22.90%**, median miss 2.08→2.39 m — fixing the height ENLARGED the arrival gap, which is now the whole remaining story and T2-ARRIVAL's sized target. §2.4's stale-lead fork measured indistinguishable (#31.1 free). Phase B did NOT run (§8 stops a failed stage before the expensive half); nothing shipped, `c4Flight` default OFF and dormant <br>Earlier: ✅ **T0R+T0b RUN 2026-07-27 — PASS, every gate** → [`C4-T0R-T0B.md`](C4-T0R-T0B.md) §7 (SHA `55b2e4a8…7528`). The per-archetype budget certified T0's failed cell (930 / 867 against a 300 floor) and the census REPLICATED on two never-seen blocks while the X4 pin reproduced `cross-anatomy` exactly. ⭐⭐⭐ **T0b's ladder explains C2 with a ZERO residual**: H0 height-preempted 56.78% · H1 keeper 0.00% · H2 chest-trap 1.37% · H3 no-contender-at-height 41.85% · H4 0 of 1,460. ⭐⭐ Both dominant rungs are MARGINS: H0's balls peak at a median 1.00–1.06 m against a 1.35 m band floor, and H3's nearest body is 1.75–2.20 m away (40–66% within 2 m) — *the contest fails by about half a metre*, nobody is absent. 🎯 **RE-AIM = HEIGHT-DOMINATED** ⇒ the delivery's FLIGHT PROFILE is C4 v1's named seat (#28.4b), routing demoted further; ⚠️ archetype-dependent (CROSS 59–61% vs BAL 46–54%) and H0/H3 is a partition not a causal decomposition <br>Earlier: ⛔ **T0 RUN 2026-07-27 — FAIL, and the queue stops** → [`C4-T0-ARRIVAL-CENSUS.md`](C4-T0-ARRIVAL-CENSUS.md) §7 (SHA `21f42c3d…dd66`). Gate C1 fired on a coverage floor sized off a league-wide cross rate (held-out BAL vs PRESS 296 vs 300, mine, #24 family) AND pre-laid reading (b) fired: **`noAerial` is C0 10.90 / C1 5.70 / C2 27.95** — nobody-there is one part in eight of the number C4 v1 was aimed at. X4 reproduces the unmodified `cross-anatomy` exactly on all six combos; stability ≤1.40pp; the instrument is sound. ⭐ New: only **60–63%** of CROSS-archetype deliveries ever reach header height (BAL 81–84%) — a DELIVERY property that lands on Q1's healthy-untouched verdict. ⭐ The arriver IS nearer the cutback arc than the ball in 74–89% of crosses (map confirmed) but that cannot be the mechanism at C1 = 5.70%. Re-aiming C4 v1, re-sizing the floor, ruling Q1 and naming I2's conversion measurement are all the commander's |

## C5 ★ — User anchor 2026-07-26 (E4 round 2 play, verbatim in VISION §3.1)

| C5 ★ | First-touch decision: one-touch layoff vs control-first as a priced choice — faster-but-noisier vs slower-but-safer, priced by the EXISTING evaluators, technique-scaled execution noise; M3 touch≠control is the substrate seat (the honest-reverted M3b 忠于脚 gap is adjacent, separate). Ref: [`../efootball_engine_research_for_evofootball.md`](../efootball_engine_research_for_evofootball.md) §5/§20 — preparation-delay model (a technique-priced pause before the windup, never animation scaling), one-touch BYPASSES the delay but accuracy prices separately, settled/first-time/chase kicks are different pipelines. ⭐ **User anchor 2026-07-26 (E4 round 2 play, verbatim in VISION §3.1)** — receivers have no 停下来/护球/观察/保护性带球; instant passes feed offside men, intercepted back-passes, or scrambles. Reading: the receive-phase TIME dimension does not exist — the action layer picks among pass/carry/shoot every decision tick and **waiting is not a valued action** (a maturing run, drawn pressure, a fresh scan — none enter the current score), so pass-on-receipt is structural, not a tuning issue. Third independent arrow at this seat (E4r1 back-pass reflex · E5f/E5g chooser→release gap · this). The fix is the missing receiver repertoire (C5 hold-draw-release + C6 shield/protective carry + C7 wind-up + seat-2 scan), never a hand-slowed press. Two defect counters registered for the next audit's REPORTED set: **passes-to-offside rate** and **back-pass interception rate** | **PHASE-0 CODE MAP DONE 2026-07-27** → [`C5-PHASE0-CODE-MAP.md`](C5-PHASE0-CODE-MAP.md) (ruling #26.4, read-only, zero code). ⭐ **Headline: there is no "whether" seat.** The carrier's decision is a single-shot argmax over ways to get RID of the ball or run with it (`PlayerBrain.ts:152` builds `cands`, `785` sorts, `791` takes `[0]`), re-run from scratch every **0.15 s** (`Match.ts:717-718`, `AI_INTERVAL`), and **"not passing" resolves to CARRYING, twice over** (`787-789` empty-list fallback, `961-962` switch default) — never to standing with it. ⭐⭐ **The only time-dependent term in the whole carrier economy PENALISES waiting**: `stagnation = clamp01((staleTime−3)/5)` (`PlayerBrain.ts:176`) is applied AGAINST holding (`606`, `×(1−stagnation·0.5)`) and FOR driving (`650`, `×(1+stagnation·0.28)`), with the source comment saying it outright — *"Patience isn't free: stagnation drains it."* There is no counterpart term that pays for time. ⭐ **The HOLD seat is not empty, it is NARROW**: `HoldUp` is already an `ActionType` (`types.ts:109`), scored (`608`), executed (`actionExecutor.ts:387-405`) and already biases the next decision (`281`/`326`/`392`) — but it is gated to role `ST` or corner-hold, `backToGoal > 0.45` AND `pressure > 0.2`, and its executor is a 1.4 m drift away from the nearest opponent, not a shield. ⭐ **The wind-up seat is a hole of exactly zero ticks**: the kick fires inside the decision function (`PlayerBrain.ts:911-956`, `actionExecutor.ts:380-386` confirming *"Kick already happened at decision time"*), so no state exists in which a kick is committed but unstruck; the ACCURACY half of the body-orientation term is already ability-scaled and live (`mechanics.ts:77/82/87`), only the TIME half is missing. ⭐ **One-touch: the price exists, the CHOICE does not** — the trigger is pressure (`Match.ts:1195-1203`, nearest opponent inside `3.0 + tempo·1.5` ⇒ `firstTouchWindow = 0.28`), the cost is real and technique-scaled (`mechanics.ts:262`), the alternative is priced by `touchFailChance` (`109`), E1b's dormant heavy curve is still wired (`106`/`174`) — but **no `cands` entry ever reads `firstTouchWindow`**. ⭐ **Shield/glue (C6 adjacency)**: the ball is glued every tick (`Match.ts:1276-1283`), the one honest escape needs `Dribble` + v>2.5 + nearest opponent >4.2 m (`1244-1262`), and shielding exists ONLY as an attribute term in tackle resolution (`mechanics.ts:1771-1775`), never as body position — so **a hold cannot be attacked differently from a carry today**. §7 leaves six open design questions for the commander (candidate vs modifier · what pays for waiting · whether the stagnation penalty stays · widen `HoldUp` vs join it · whether C7 shares the contract · what can attack a hold — a free option gets taken always, the same shape as the `×1.3` subsidy E5h quantified) <br>⭐⭐ **DESIGN CONTRACT DRAFTED by the commander on that map (2026-07-27): [`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md)** — the six questions RULED: Hold = **CANDIDATE** never modifier (observable external state, intent privacy holds) · **the WORLD pays for waiting, the CENSUS prices it** (fork-and-force hold-k vs act-now on the attempt tables' own axis — the E2b-0 move applied to time; no invented forward-looking term) · stagnation stays **legacy-only** (time's price in the measured seat comes from the census) · a NEW generalized shield-Hold, legacy HoldUp untouched (flags-off world bit-identical) · C7 shares the contract NOT the stages (own flags/battery, after T4) · **NO FREE TIME (I1)**: every held tick attackable, hold-dominance ceiling at the live audit. Stages: T0 dormant mechanics → T1 waiting census (+ the tempo instruments the 1.1–1.2× anchor waits for) → T2 WHETHER on the measured axis (value brain only) → T3 full #20 battery → T4 E4 round → T5+ C7. Stage contracts pre-register individually (Autonomous mode) | ✅ **T0 built (FAIL, A2a/A3 on the wrong objects) → T0R PASSED 2026-07-27** · ⛔ **T1 RUN 2026-07-27 — FAIL on H1 (act-now arm, 2.99pp vs a 2.0pp tolerance disclosed as 2.1σ BEFORE the run; the three hold arms reproduce at 1.56/0.06/0.87pp and all twelve pressure rows pass H2)** → [`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md) §11 (SHA `72c187aa…8e43`, table SHA `7ea8152a…06e1`). ⭐⭐⭐ **The census itself came back resolved: waiting costs −7.55/−12.77/−16.12pp of shot probability at k=30/60/90 and concedes +1.45/+2.63/+3.55pp on top, monotone, every CI far from zero — and the release-origin twin (−6.53/−10.20/−12.40pp) closes the "the ball was better when he finally played it" defence.** A T2 chooser priced from this table would essentially never hold. Registered honestly: part of the cost is mechanical by construction (the horizon starts at the decision moment so a held tick is a spent tick), so this is *this world's* exchange rate, and Q2's answer — enrich the world, re-census (#26.5) — stands. ⭐ Tempo baseline banked: **median ownership spell 0.33 s, mean 0.68 s**, 28.34 vs 29.64 passes/min legacy vs VALUE |

## C6 ★ — Embodied carrying — kill the glue

| C6 ★ | **Embodied carrying — kill the glue** (user anchor 2026-07-26, verbatim in VISION §3.1). The ball-foot interface is honest only at SPEED in the OPEN: Phase 36's push (free ball, chase, poke window, space-priced 一步一带/爆趟) fires only when v > 2.5 m/s AND nearest opponent > TOUCH_CONTROL_DIST (`Match.ts:1231-1248`). Three regimes still run on GLUE (`Match.ts:1265`: ball.pos = owner.pos + heading·carry, per tick): **TURNING** — the pivot sweeps the ball with the body (the user's "以自己为圆心连球带人一起转"); body turn is TURN_RATE-capped so time passes, but the turn costs zero touches and the ball can NEVER be attacked mid-turn; **SLOW carry** — walking pace = perfect close control by definition; **UNDER PRESSURE** — the push is suppressed exactly where real football charges the most (close control under pressure). Pricing these per-touch is the substrate seat for 护球/变向摆脱/turn-radius honesty, and the enabling substrate for hold-draw-release (ruling #15 seat 3 — E4 round 1's "real back-pass comes after HOLDING the ball and drawing a defender" needs a ball that exists between touches). Design instinct per VISION §1: NOT eFootball's discrete 1/3/5-step classes — extend Phase 36's continuous space/technique pricing into the glued regimes. ⚠️ Watchability guard registered up front: naive de-gluing = more loose balls = the user's #1 hate (§2 hard gate); co-design with the existing poke/recollect pricing, full #20 battery | **TBD — C-track template, Phase-0 code-map first.** Sequencing: C5-adjacent (the two are one ball-foot-interface family; E1b's dormant touch-cost curve re-seats here too per ruling #12.3). Does NOT jump the queue: value seat (E5f → E4 round 2) and Stage III first. Ref: [`../efootball_engine_research_for_evofootball.md`](../efootball_engine_research_for_evofootball.md) §4/§19 — split "dribbles fast" into translation speed / touch interval / input-to-execution latency ("手感" is the latter two); turn taxonomy close-control / dash-large-angle (= SEPARATION + reacquire window, the attackable seat) / high-speed small-angle correction; slow turns cheap, sprint turns expensive is the measured shape | **REGISTERED 2026-07-26** |

## E1 — RE-SCOPE RULED 2026-07-24 (commander ruling #4, design contract §3 amended): E1a → E1b.

| E1 | ✅ **RE-SCOPE RULED 2026-07-24 (commander ruling #4, design contract §3 amended): E1a → E1b.** **E1a** = the trustworthy first-touch instrument at the real `attemptFirstTouch` adjudication, event-level, logging the TERM DECOMPOSITION (speed/pressure/misalign/technique) per event; must reproduce the formula's own speed term on controlled synthetic sweeps (an instrument that cannot see known physics is broken) and must SETTLE the E0b inversion (pressure-relief confound — faster ball ⇒ less closing time ⇒ lower pressure at touch — vs contamination); pure probe, zero physics. **E1b** = the flagged C1-B curve, default OFF, validated by E1a's instrument with the decomposition confirming the SPEED term moved; also run the E3 always-heavy canary cheaply here (if the dormant evaluator still prefers 1.15 in ~52/52 after E1b, the curve is too weak). Spends the C1-B redraw | [`EDS-E1A-FIRST-TOUCH-INSTRUMENT.md`](EDS-E1A-FIRST-TOUCH-INSTRUMENT.md) | ✅ **DISPOSED by ruling #6 (2026-07-25): E1b OPEN on I1's pass; I2 RETIRED (decomposition settled it; powered flat-vs-rising subsumed by E1b's OFF/ON contrast); E1b gains the two-channel amendment (design contract §3).** ⚖️ **E1a RUN 2026-07-24 — I1 PASSES, I2 UNDECIDED, probe verdict FAIL** (§6, SHA `93897f79…9c09`, twice byte-identical, zero new `src/**`, fingerprint `57b0bdab…c673` unchanged, 708/708). Re-staged per ruling #5.3 as a REAL intended pass power-swept 0.85–1.15 × distance 6–30 m: 44,100 staged passes, 25,491 adjudicated (57.8%), held conditions genuinely held (**mean pressure exactly 0**, misalign ≤0.0005). **I1: events 2,780/4,302/4,478/2,864** (floor 400) · **spill 1.691/3.278/4.757/6.494%, strictly monotone** · **|empirical − logged pFail| ≤ 0.311pp** (tolerance 2.0pp) and within 0.31pp of the closed form ⇒ the instrument sees known physics. Extra staging truth: the frozen world must never be allowed to play on (parked bodies walk the ball into an empty net, and the restart corrupts the next staging). **I2 does NOT decide**: clean rate 0.8868/0.9000/0.8919 is flat and non-monotone while predicted pFail rises +2.4pp; **pressure-relief is REFUTED** (pressure term −0.23pp vs speed +1.63pp), and an unbooked term appeared — **misalign rises 0.100→0.348 with power** (a faster ball arrives before the receiver has turned). The coded discriminator read the 0.5pp endpoint gap (SE ≈ 5.6pp at n≈60) as "rises" ⇒ `unexplained`. Reported, NOT patched — I2 was underpowered by construction. **Fork is the USER's** (§6): does I1's pass alone unblock E1b (§4 says yes), and is I2 redrawn (powered, discriminator as an interval test) or retired now that its hypothesis is refuted? <br>Earlier: instrument BUILT and behaviour-proven (`traceFirstTouch` default off; flag on vs off identical over 3 full matches incl. RNG state; fingerprint unchanged; logs speed/pressure/misalign/technique/pFail/clean per adjudication). ⚠️ **I1's synthetic sweep needs a redesign before its gates can be evaluated** — two structural findings: (a) below 6 m/s the world returns clean BEFORE the roll (`mechanics.ts:130`), so no adjudication exists to measure — slow receptions are free by fiat; (b) a loose rolled ball often never reaches an adjudication at all, because the M3 contact cushions it out of the retention window (buckets 7 and 13 gave 60/60 events, 9 and 11 gave none). Fix = stage a REAL intended pass and sweep power. Gates unchanged. **E1b stays unopened until I1 passes** |

## E1b — Flagged touch-cost curve

| E1b | **Flagged touch-cost curve** (drafted by the executor under ruling #6): C1-B's exact one-liner `clamp01((speed−6)/8)*0.07 → clamp01((speed−6)/16)*0.24` behind `Match.edsTouchCost`, default OFF, validated by the E1a instrument on the I1 staging — OFF/ON at 1,300 reps per arm (≥11,300 events/bucket/arm, sample size computed ex ante for 3σ on bucket 7, the binding one), interval-test predicates only, two-channel decomposition, plus the E0 always-heavy canary | [`EDS-E1B-TOUCH-COST-CURVE.md`](EDS-E1B-TOUCH-COST-CURVE.md) | ✅ **PASS 2026-07-25** (§6, SHA `ca192bc8…2d59`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 709/709, 4/4 exact · 4/4 FIRES · 4/4 decomposition · 3/3 canary). 191,100 staged passes per arm; adjudication rate identical OFF/ON (57.6/57.4%) ⇒ the flag changes the roll, not the world's willingness to adjudicate. **X5 reproduction**: the OFF arm's first 300 reps return E1a's banked I1 run to the last digit (2,780/4,302/4,478/2,864 · 1.6906/3.2775/4.7566/6.4944%). **X2 cross-commit**: flag-OFF signatures identical to pre-E1b HEAD `19f7aa1` on all three seeds. **F1**: spill 1.696→2.437 · 3.278→4.818 · 4.820→7.853 · 6.162→10.465%, measured Δ **+0.741/+1.541/+3.032/+4.303pp** vs analytic **+0.547/+1.641/+2.734/+3.828pp** (worst error 0.475pp in a 1.25pp band = 1.07/0.34/0.85/1.35σ); logged pFail matches the arithmetic almost exactly (+0.586/+1.634/+2.753/+3.786pp). **F2**: the speed channel carries **≥99.996%** of the increase, pressure Δ **identically 0** (this staging holds pressure at 0 ⇒ the rise provably is not the refuted pressure-relief confound), misalign channel unchanged to 1e-5. **F3 canary**: predicted touch-cost spread **3.95 → 6.53pp** (floor 6.0), corridor read untouched, flag-OFF reproduction of E0 exact (7.34/11.29, safest-is-1.15 52/52) — ⚠ but E0's 'safest' is threat-ranked, so this sizes the cost (6.53pp against a 21.2pp opponent-first swing) and does NOT settle dominance: that is E3's gate, now forewarned. Diagnostic only (12 matches, no §2 claim): miscontrols 7.25→10.08 (+39.1%), goals 2.833→2.167 — C1-B's live signature again, recorded for E3. Also disclosed: **X2b was amended before the run** (§4.1, own commit `b8386cd`) after a smoke run showed 'all three seeds diverge' was itself the unpowered point test ruling #6 outlawed. Nothing shipped; `edsTouchCost` stays default OFF. **Queue advances to E2** |

## E2 — split E2a → E2b by ruling #7

| E2 | Both-sides perception (dormant build, probe-bundled), **split E2a → E2b by ruling #7**: **E2a** = census-derived base-rate prior table (committed as SHA'd data before any A/B, never adjusted after results) + pricing layer proven on E0's 120 banked states (unseen priced at prior, ZERO deleted for observability); **E2b** = both-sides A/B — evaluator = E0 corridor + E1b touch term, perceived state both sides via the shared-awareness trunk, not-looking-must-not-win directional gate, route-mix gate vs the S3b collapse signature, PERF hard gate at brain cadence. Always-heavy rate under combined pricing reported for E3 | Design contract §3 (ruling #7 constraints) · E2a: [`EDS-E2A-CENSUS-PRIORS.md`](EDS-E2A-CENSUS-PRIORS.md) · E2b TBD | ⚖️ **E2a RUN 2026-07-25 — P3 FAILS, everything else passes; QUEUE STOPS** (§7, SHA `93e25df4…0ea3`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 714/714, zero live callers). ✅ The census is sound: 21,457 passes in set A, held-out 21,822, **P2 calibration worst band 2.03pp of a 5.0pp interval and marginal 0.17pp of 1.5pp** ⇒ a measurement, not a fit. ✅ **The pricing layer works**: 360/360 options priced, ZERO deleted, E0's 55 vanished states now carry an honest base rate, unknowns read as unknown, and the 65 observed states reproduce E0 to the digit (X5). Table committed as data (`src/ai/passPrior.ts`, table SHA `326ea40e…4db0`). ⛔ **P3 fails by 0.18pp** (observed 0.686586 vs marginal 0.688400) — a COMPOSITION effect: real play is short-pass dominated (44% inside 14 m) while E0's acceptance rule surfaces a longer slice (35%), so my derivation's premise was backwards and the data corrected it. ⭐ **The structural finding worth stopping for: the census measures passes the AI CHOSE to play, but the prior must price options nobody chose and nobody can see** — a base rate over played passes is a selected sample, and in E2b the option set is EVERY teammate, a population the census never observed. ⚠️ Also found: **P4's routing rule keyed on `interceptedRate`, which is flat (1.58pp, non-monotone), while the priced axis `receptionSuccessRate` falls 8.32pp** — routing stands as frozen (marginal), re-keying is the commander's call. Three candidate directions in §7; none acted on. **E2b does NOT proceed** (ruling #7 conditioned it on a PASS) <br>✅ **DISPOSED by ruling #8 (2026-07-25): FAIL accepted as a correct catch; E2a re-posed as E2a-2, the counterfactual OPTION-SPACE census (fork-and-force, target-choice intervention only, bit-identical harness gate); routing re-keyed onto the priced quantity; E2b aiming rule settled (priced always, executable only with an honest aim). Constraints: design contract §3 (h)–(l). NEXT: draft E2a-2** |

## E2a-2 — Counterfactual option-space census

| E2a-2 | **Counterfactual option-space census** (ruling #8): sample real plain-ground-pass moments, enumerate every outfield teammate at 6–30 m, fork the deterministic world per candidate and intervene on TARGET CHOICE ONLY — live power/lead/aim/bookkeeping. Harness gate: forcing the brain's own target must replay the match bit-identically | [`EDS-E2A2-OPTION-SPACE-CENSUS.md`](EDS-E2A2-OPTION-SPACE-CENSUS.md) | ✅ **PASS 2026-07-25** (§6, SHA `4180a246…817c`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 714/714, zero live callers, **X5 harness 3/3 bit-identical**, X6 table committed as data `df0aa340…1903`). 4,500 moments × 63 matches = **14,678 forks per set**. **P2**: worst gated band 2.98pp of a 6.0pp interval, marginal 0.30pp of 2.0pp (26–30 band under-sampled at 855 → reported, not gated, as pre-registered). ⭐ **R1 — the selection bias was 13pp, not 0.18pp**: option space **55.72%** vs chosen subset **74.34%** vs E2a-1's pass log **68.84%** ⇒ the live target-chooser is worth **+18.62pp** and E2a-1's prior was overstated by **13.12pp**. P3's tiny directional gate was the visible tip of a large structural error — the argument for keeping cheap directional checks. Interceptions 32.4% counterfactual vs 19.5% played. ⭐ **R2 — what memory is worth**: the priced-axis gradient survives de-selection but HALVES, 4.48pp vs the pass log's 8.32pp, and is **non-monotone** (peaks 59.73% at 18–22 m) ⇒ a consumer must read the band, never extrapolate along distance. **R5 registered blind spot**: 18.33% of the brain's own chosen targets fall OUTSIDE the 6–30 m window (almost all shorter) and take the marginal. R3 unplayable 3.84%, own target 3,675/3,675 playable. R4: 17.1% of arrivals never adjudicate. ⚠️ Disclosed: **P1 failed on its first frozen run (0.8167 vs 0.999) and the defect was my metric's denominator, not the world** — it divided by all moments incl. the 18.3% where the question is unaskable; an independent 300/300 check cleared the seam; corrected, re-run, and **X6 proves the census was byte-unchanged**, so the fix moved a validity counter and nothing else. Also: sampler restricted to plain ground passes (§3 conformance, found at smoke); pricing test re-pointed to the option-space table per (k). **E2b proceeds without a new ruling** |

## E2b-0 — Threat calibration

| E2b-0 | **Threat calibration** (executor split of E2b, drafted under ruling #8's standing authorisation): a blind option prices as a probability and a seen one as seconds of corridor threat, E0 refuses a scalar score by design, and picking a weight to join them would be the invented constant ruling #8 rejected — so measure what the read is worth before choosing on it. E2a-2's fork-and-force staging reused verbatim + one read-only evaluator column | [`EDS-E2B0-THREAT-CALIBRATION.md`](EDS-E2B0-THREAT-CALIBRATION.md) | ✅ **PASS 2026-07-25** (§6, SHA `fdd6a1ad…eca2`, twice byte-identical, calibration SHA `52c10713…3082`, fingerprint `57b0bdab…c673` unchanged, 721/721, zero live callers, harness 3/3). **X5's second half is the licence for the whole thing**: the outcome census reproduces E2a-2's banked option-space table field for field ⇒ adding the observation really was an observation. ⭐ **The curve**: realized success by predicted-threat quintile **82.86 / 62.31 / 50.97 / 47.15 / 43.14%** — monotone, **39.72pp** discrimination against a 10.0pp gate, held out to ≤2.18pp per quintile and 0.12pp on the marginal. E0's P1/P5 sign now confirmed on the OPTION SPACE, not just per-state ranking. ⭐⭐ **R2 — seeing the lane is worth ~6× remembering the distance**: corridor read spreads outcomes **39.72pp**, the distance band only **6.64pp** (same forks, both predictors). Ruling (k) asked what memory is worth; the band is the SMALL half — what looking really buys is the corridor read only a current percept supports. This is the substrate argument for looking, in outcomes. ⚠️ **R3 — a third class E2b-1 must name**: **28.48%** of playable options carry no evaluator read at all (E2a-1 saw 0 of these on its narrow states); they are neither seen-and-priced nor absent-and-marginal, and the layer currently folds them into the banded case. ⚠️ **R4 — look-pressure is entirely a function of the read**: a blind option prices 55.72% vs 55.81% for the mean executable band — indistinguishable — so on the band axis alone not-looking costs nothing; only the corridor read (43→83% spread) makes looking pay. Also: R1 touch term discriminates 18.7pp but flattens after Q2. **E2b-1 drafts on this PASS** |

## E2b-1 — Both-sides perception A/B

| E2b-1 | **Both-sides perception A/B** (ruling #9.3): four awareness arms price the same moments from the passer's own snapshot on one measured probability axis (READ→E2b-0 curve, SEEN-UNREAD→band, UNSEEN→marginal), choose among EXECUTABLE options only, and each choice is forked and forced; the defence reads its own perceived ball in the same arm | [`EDS-E2B1-BOTH-SIDES-AB.md`](EDS-E2B1-BOTH-SIDES-AB.md) | ⛔ **FAIL 2026-07-25 — G3 perf and X3; QUEUE STOPS, E3 NOT drafted** (§7, SHA `732f8950…5332`, fingerprint `57b0bdab…c673` unchanged, 726/726, flags default-off). ✅ **The science passed.** **G1 not-looking does not win**: realized success **63.28 / 64.60 / 63.46 / 67.90%** (aw 0.2/0.5/0.8/oracle), every chain step ≥ the −2.0pp band, endpoint lift **+4.61pp**. ✅ **G2 — the route mix SURVIVES**, the gate S3b failed: long-option share **13.31 / 17.72 / 18.05 / 18.07%** ⇒ at awareness 0.8 the chosen-option distribution is **indistinguishable from omniscience**; S3b's ~38% collapse does not reproduce. ✅ X5 all three, incl. the factors multiplying back to E2b-0's curve (P(reached) 88.4→48.5%, P(clean|reached) 93.8→89.0% — a threatened lane also delivers a dirtier ball). ⛔ **G3 perf FAILS**: brain-cadence perception costs **1.329×** against a 1.25× budget (5.947→7.906 µs/step; p95 1.406× of 1.50 passes). Real work, honestly failed — per the stop rule perception gets cheaper, not the budget bigger; the defender entry needs only the BALL percept, which is most of the saving. ⛔ **X3 FAILS and it is MY defect**: the probe hashes wall-clock timings, so byte-identity is impossible by construction. Demonstrated rather than asserted — strip the perf block and two independent invocations hash identically (`fd4e33bc…4803` twice). Reported as it fired; a probe cannot both carry a perf gate and promise a byte-identical artefact, and that gate change is the commander's. ⭐ **R1 corrects a banked number**: separating the classes shows **SEEN-UNREAD is ~0.2%**, not 28.48% — E2b-0's 'unpriceable' figure was dominated by targets the passer cannot SEE (UNSEEN 37.8/22.7/14.2/0%), not by unreadable lanes. Ruling #9.3(a) characterised the class from the conflated number. **R2 look-pressure real**: a blind option out-prices every executable one in **9.17%** of moments at aw 0.8 (17.03% at 0.2); band axis 3.60/7.10%. R5: the evaluator agrees with the live brain only 38–47% ⇒ genuinely a different chooser. Nothing shipped |

## E3 — FAIL 2026-07-25 — five gates; QUEUE STOPS, the fork is the COMMANDER's

| E3 | Co-evolution audit: sealed evo runs, full bundle ON — §2 band, route mix, the C1-B behavioural suite, no-strict-dominance (power usage must stay situational), co-evo restoration, style diversity | [`EDS-E3-COEVOLUTION-AUDIT.md`](EDS-E3-COEVOLUTION-AUDIT.md) | ⛔ **FAIL 2026-07-25 — five gates; QUEUE STOPS, the fork is the COMMANDER's** (§6, world SHA `e667f476…dc73`, world-deterministic across two invocations with perf reported beside it, fingerprint `57b0bdab…c673` unchanged, 744/744, flags default-off, nothing shipped). ✅ **X4 — the gate this stage rested on — PASSES ABSOLUTELY**: the live consumer reproduces E2b-1R with **0 disagreements in 10,292 per-moment comparisons** (3,000 moments × 4 arms) and **all seven banked aggregate families bit-identical at full float precision**; the band's own baseline arm reproduces C1-B's frozen numbers to 4 dp ⇒ same procedure, same world. ⛔ **§2 band BREAKS on two dimensions**: headers **+30.44%** and long balls **+45.20%** (±25%); goals −14.56% squeaked inside ±15%, crosses −16.55% and cutbacks −5.21% fine — **C1-B's signature, larger**. ⛔ **no-strict-dominance 17.42%** vs a ≥20% floor — and it fails on the ANTI-dominance side (preferred power 49.5/33.1/17.4% light/mid/heavy); two reported diagnostics shape the reading: pace still buys the corridor in **97.86%** of moments (E0's canary reproduces) but the three powers share one threat quintile in **49.43%**, so the coarse corridor axis lets the smooth touch term decide — a granularity property of the registered instrument, not of the world. ⛔ **co-evo restoration**: goals advantage +0.178 (gens 1–3) → +0.296 (gens 8–10), no shrink on a ±0.5-noisy series; ⛔ **style entropy HALVES** (0.497 of the flags-off run vs a 0.60 floor) while all 16 clubs keep distinct nameplates — labels kept, variety lost. ⛔ **X5 perf 1.3223×** mean (p95 1.3196× passes): a chooser reads BODIES, so E2b-1R's ball-only 1.069× saving is gone. Suite under the bundle: **stamina breaks; crossing and market — two of the three C1-B broke — now HOLD**. ⭐⭐ **The ABLATION (§4-authorised, §6.9) names the component**: take the touch cost OUT and the same bundle is **inside every band** (goals +2.20%, headers −0.43%, long balls +8.06%); leave it in alone and it IS C1-B to the decimal (−15.37%/+23.23%/+28.18%). And the chooser alone costs **−21.69%** of the goals while chooser+perceived-defence lands at **+2.20%** ⇒ **both-sides perception really does restore what it breaks** — the S3b/vision-attr lesson passing. R1 seals it: the chooser's own long share is 19.06% vs E2b-1R's dormant 18.05%, so **it is not choosing long balls — the re-route is mechanical, downstream of spilled touches, and bundling does not fix it**. ⚠️ Disclosed (§6.10): the ablation caught a DEFECT in my build — `refreshPerception` was gated on the defence flag alone, so `edsPerceivedChoice` was silently inert by itself; fixed, pinned by a test, and the audited world is **byte-identical before and after** (every gated arm runs the full bundle). R3 look-pressure 6.21%/3.62% · R4 divergence 62.23% · R5 no-executable 4.09% · live classes READ 90.80/SEEN-UNREAD 0.08/UNSEEN 9.13%. |

## E3R — FAIL 2026-07-25 — 2 of 28 gates; QUEUE STOPS at the commander

| E3R | Revised-bundle audit (ruling #12.3–#12.4): touch cost OUT of the v1 live set, the same five gate families re-run verbatim on perceived choice + perceived defence + the evaluator, chain-first re-bank, both style hypotheses pre-registered | [`EDS-E3R-REVISED-BUNDLE-AUDIT.md`](EDS-E3R-REVISED-BUNDLE-AUDIT.md) | ⛔ **FAIL 2026-07-25 — 2 of 28 gates; QUEUE STOPS at the commander** (§5, world SHA `655a98b9…9d59`, world-deterministic across two invocations, fingerprint `57b0bdab…c673` unchanged, 744/744, nothing shipped). ⭐⭐ **RULING #12's DIAGNOSIS IS CONFIRMED BY A FULL AUDIT: the §2 band HOLDS on all five dimensions** — goals **+2.20%**, crosses −8.91%, headers **−0.43%**, long balls **+8.06%**, cutbacks −4.75% (E3 broke at +30.44%/+45.20%), baseline arm again reproducing the frozen numbers to 4 dp. ✅ **C1 proves the premise correction**: constraint (a) assumed the banked reference carried flag-ON touch pricing — it never did (`heavyTouchCost` appears in no E2b probe; a READ price is the census composite), and the re-bank moved **not one digit** (7/7 families bit-identical), with **G1 and G2 re-holding** there; **X4R 0 disagreements / 10,292**. ✅ **no-strict-dominance PASSES at 21.86%** (45.85/32.29/21.86 light/mid/heavy) — constraint (e)'s registered expectation of a heavier shift under the shipped curve held (+4.4pp from E3's 17.42%), and the share is stable 0.195–0.222 across ten generations. ✅ **CO-EVO RESTORATION PASSES**: the goals advantage decays **+0.2864 → +0.0282** (gens 1–3 → 8–10) — the gate the vision-attr saga failed four times. ⛔ **STYLE DIVERSITY fails by 2.03pp** (entropy ratio **0.5797** vs 0.60; nameplates 16/16) ⇒ **H2 stands by the letter** — but its MECHANISM is refuted by all three pre-registered discriminators: cross-club long-ball spread WIDER under the bundle (1.977 vs 1.684 band · 1.505 vs 1.343 evo), genome expression STRONGER (corr(long balls, passBias) −0.222 vs −0.122 band · −0.624 vs −0.577 evo), and the chooser itself varies club to club (0.60 m of chosen distance, 3.32pp of long share). ⚠️ **and the gate's statistic inverts on the pre-registered robustness seed** `515151`: entropy ratio **1.5321** — the bundle is MORE diverse there. One final-generation entropy over 16 clubs has almost no power; the verdict stands as fired, but "H2 stands" should read as "this gate could not answer the question". ⛔ **X5 perf 1.3238×** (p95 1.3113× passes) after implementing constraint (d)'s named lever plus an allocation-free scan (isolated bench 1.4211× → ~1.32×; ball-only reference ~1.05×): the residual cost is the honest per-observation math itself (5 keyed-noise channels + body-turn trig, ~13 observations/step). `Math.hypot`→`sqrt` was tested and REJECTED (bit-different on 38% of 3M samples = a perceived-value change). The one honest lever left is **deferred reconstruction** (replay a body's in-window scans only when a consumer reads them, ~40× fewer observations, identical by construction) — costed, NOT built, because it decides what "the moment I looked" means and that is the commander's call. ⚠️ **Suite (constraint (f)): stamina breaks on the PERCEPTION bundle, not the touch cost** — measured, correcting my own pre-run suspicion: flags-off 0.9161 · choice-only 0.9308 · v1 bundle **0.9697** · E3 bundle 0.9626 (gate <0.93); honest perception makes the game CALMER (later commits, better-supported balls, less sprinting after loose ones), so the tank stops being spent. aerial + freeAgents hold. R4 divergence 61.14% · R5 no-executable 4.04% · look-pressure 6.59/3.78% · classes READ 91.07/SEEN-UNREAD 0.06/UNSEEN 8.88%. |

## E3R2 — PASS 2026-07-26 — ALL 29 GATES; the queue reaches E4

| E3R2 | Narrow re-audit (ruling #13.5): CE2R five-seed median style entropy + X5R2 lazy PULL perception under perpetual pins | [`EDS-E3R2-NARROW-REAUDIT.md`](EDS-E3R2-NARROW-REAUDIT.md) | ✅ **PASS 2026-07-26 — ALL 29 GATES; the queue reaches E4** (§5, world SHA `3cbb8b8c…456f`, world-deterministic across two invocations with perf beside it, fingerprint `57b0bdab…c673` unchanged, **751/751**, nothing shipped). ⭐⭐ **X5R2 — perception is PULL, and provably the same perception**: P1's perpetual pin (7/7, `tests/lazyPerception.test.ts`) has lazy and eager snapshots **field-for-field identical at every brain tick** across awareness 0.2/0.5/0.8/1.0; P2 gives identical world signatures AND identical choice traces on 3 seeds; **P3 returns 17/17 of E3R's banked live numbers BIT-IDENTICAL**, which is what makes ruling #13.5's transfer of the 26 rigorous rather than assumed. **Perf 1.32–1.38× → 1.1977× mean / 1.1529× p95** (budget 1.25/1.50) purely by computing when asked instead of when possible — scan cadence, FOV, retention and keyed error all untouched. ⚠️ One measured one-directional difference, pinned by its own companion test: pulled BETWEEN brain ticks (which no live consumer does) the pull is merely UP TO DATE — self proprioception current, retention expired — never better informed. ⭐⭐ **CE2R — style diversity HOLDS ecologically: median entropy ratio 1.5253** over five fresh seeds (0.779 · 1.525 · 3.405 · 1.466 · 1.922 — **four of five ABOVE 1.0**, i.e. the bundle usually leaves a world with MORE variety), nameplates 16/16 on every seed, and all three mechanism co-gates pass on the median (M1 +0.044 clubs not more alike · M2 +0.174 genome expresses no weaker · M3 0.454 the chooser is club-dependent). E3R's 0.5797 was the low tail of a heavy-tailed statistic ⇒ ruling #13.2's diagnosis confirmed, **the preference-seat fork stays closed**. ⚠️ Reported, not gated (CE1 is banked by ruling #13.1): across these five fresh seeds the advantage-shrink holds on only **2/5**, and the paired goal delta is mostly NEGATIVE and seed-noisy — there is no attacking runaway to restore from, but if CE1 is ever to carry weight in a ship decision it needs CE2's multi-seed treatment. |

## E4 ★ — user play-test of the whole bundle

| E4 ★ | Ship gate — **user play-test of the whole bundle**. Ship = flags default ON + fingerprint/perf rebaseline. Revert = the whole bundle | design §3 | **OPEN — the user's eyes.** ✅ **E4-PREP DONE 2026-07-26** (ruling #14.3): Settings → 🧬 Experimental now carries **“EDS preview: players act on what they SEE”**, which arms `edsPerceivedChoice` + `edsPerceivedDefence` **together** (never one alone — the ablation is why) from the **next kickoff**, so the A/B is runnable mid-season on the phone. Sticky at `evo:edsPreview`, localised, re-armed across every League swap (load / import / new league / reset / worker hand-off), and it announces itself in the feed. **Default OFF**, pinned by a test that walks the whole path (persisted default → `League.matchFlags` empty → a real fixture's Match has all three flags off) and asserts the pair arms together. Gates: tsc + build clean · **752/752** · fingerprint `57b0bdab…c673` unchanged · zero `src/sim`/`src/ai` behaviour change. Flag pair + storage key live in `src/game/edsPreview.ts` so the pin loads no renderer <br>✅ **E4-PREP-2 DONE 2026-07-26** (ruling #22.5): the preview stops being a boolean and becomes a **closed mode list — `off` / `v1` / `triple`** — where `triple` is the **E5d Phase 1 audit's own arm** (v1 pair + `edsValueAxis`), flag for flag. A mode rather than a bag of switches because what needs pinning is not whether the toggle works but **which worlds it can build**: the value axis WITHOUT the perceived pair has never been audited, and a UI able to express it is a way to ship an unaudited game by accident. Two checkboxes type the choice (arming the second arms the first, clearing the first clears the second) and `edsPreviewFlags()` is the only path from a mode to flags. E4-PREP's stored `'1'` still means the v1 pair, so a user who armed the preview before this ruling keeps exactly what they armed. **5 new pins** (closed list · never-alone · no `edsTouchCost`/`traceChoice` in any mode · default-off down to a real fixture · each mode's Match) + zh strings. Gates: tsc + build clean · fingerprint `57b0bdab…c673` unchanged · **zero `src/sim` + `src/ai`**. ⚠️ **The E5b-era pin that excluded the axis from the preview was amended in its OWN disclosed commit** (`6c19779`), separate from the implementation, so a change to a guard reads on its own: the boundary MOVED (axis reachable only inside the triple, never without the pair) rather than dissolving, and it moved because a RULING moved it — a shipped-plumbing pin, not an experiment gate. The pin's own text had anticipated exactly this <br>⭐ **ROUND 2 IN PROGRESS (user playing, 2026-07-26/27) — mode-attributed observations so far, no verdict yet:** ① pass-on-receipt (no hold/shield/scan/protective carry) is present **in ALL modes including triple** — confirms the structural diagnosis (waiting is not a valued action; the WHETHER seat), converging with E5g's chooser→release gap; ② **scrambles/crowding improved under triple but NOT solved** — consistent with the measured calmer-game effect, and the residual is a POSITIONING problem (everyone converging on the ball), whose registered fix is Stage III's value-field don't-crowd emergence, not the chooser; ③ four capability anchors filed from this round's play (receive-phase time dimension → C5-family · kick 前后摇 + twisted-body term → C7/F9 · tempo 1.1–1.2× → C5/C7 first, tempo census registered · attack/defence shapes both emergent → Stage III acceptance). ⭐⭐ **ROUND 2 VERDICT (2026-07-27): ROAD B** — the user chose make-combinations-genuinely-pay over shipping direct football ("B", after #25.4's fork was explained as poor-world-honest vs rich-world-emergent). No ship; all flags stay default-OFF; the E4 gate closes for this cut and re-opens per-slice as the richer world lands (ruling #26) |

## E5 — The value axis

| E5 | **The value axis** (ruling #15.3): V measured by fork-and-force — what happened NEXT (shot within 4.0 s) censused per reception zone, committed as SHA'd data; the decision becomes measured-P × measured-V with no residual hand weight; central hypothesis = measured value REPRODUCES combination play without the hand-coded bonuses; then the narrow audit (§2 band + dominance + perf + the watchability instruments) | [`EDS-E5-VALUE-AXIS.md`](EDS-E5-VALUE-AXIS.md) | ✅ **E5a PASS 2026-07-26 — every gate** (§7.1, SHA `5cc529f7…2a7f`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 759/759, zero live callers, table committed as data `0125071f…3bc9`). ⭐⭐ **The composition is a MEASUREMENT, not a weight**: P̂ × V̂ scored before any outcome predicts the conjunction it claims to estimate — clean reception AND a shot — at **4.014% vs 3.982% realized (0.03pp on 14,114 forks)**, with 7.71pp of top-vs-bottom discrimination. Ruling #15 (b) answered by measurement. **X5b, the licence, held exactly**: the reception census returns E2a-2's table field for field and the threat quintiles return E2b-0's curve digit for digit. V table over 7,864 clean receptions: 1.30 / 2.21 / 7.64 / 8.81 / 11.40 / 13.58 / 9.30 / 42.19% (own third → attacking-third-inner), **V2 discrimination 10.10pp**, held-out worst cell 2.49pp. R4: composed spread 8.03pp beats P alone 7.25pp and V alone 5.66pp. R5: the composed argmax differs in **30.66%** of moments. R6: the legacy brain's own targets already land in zones worth **+2.55pp** over the option space. ⚠️ Registered BEFORE E5b ran and deliberately not repaired: **4 of 8 cells miss the 400-reception floor and two are the attacking-third-inner cells**, so the most dangerous zone reads the marginal — *below* the outer third that is measured. ⚠️ Realized calibration non-monotone (Q2 1.42% under a 3.98% prediction) — why the gate was discrimination + calibration, never a five-point monotonicity claim. ⚠️ Disclosed: R3 as contracted is not measurable in this staging (the window is simulated only for clean receptions); the probe says so rather than printing a duplicate. <br>⛔ **E5b FAIL 2026-07-26 — 30/32 gates pass, the CENTRAL HYPOTHESIS does not; QUEUE STOPS, the fork is the COMMANDER's** (§7.2, world SHA `c3ee6659…c7c0`, world-deterministic, fingerprint unchanged, 759/759, flags default-off, nothing shipped). ✅ **Y4V flag-off identity is absolute**: 0 disagreements / 10,292 and 7/7 banked families bit-identical, G1/G2 re-hold. ✅ **§2 band INSIDE on all five and healthier than E3R's**: goals **+3.01%** (E3R +2.20%), crosses −5.94%, headers +1.26%, **long balls −7.66%** (E3R +8.06%), cutbacks +4.80%, baseline arm reproducing all five to 4 dp. ✅ dominance 25.09% · ✅ perf **1.180×** mean / 1.144× p95. ⭐ **The E4 round-1 table reproduces EXACTLY** — arms 0/1 are its staging and their first two seasons return all nine cited numbers to the digit, so ruling #15 rests on numbers that reproduce. ⛔ **H1 third-man 0.472×** (gate 0.85; v1 bundle 0.603× — the value arm is WORSE than what it was meant to repair) and ⛔ **H3 forward share −3.06pp** (gate −2.0; v1 −2.57pp). ✅ H2 overlap 0.835× (v1 0.741×) · ✅ H4 shots **1.175×** (v1 1.053×). ⭐ **What it DID do**: a more direct, more shooting, less circulating game — passes/match 80.8→63.9, chain 4.94→3.84, give-and-gos 0.457→0.533 (ABOVE flags-off), long balls 5.90→4.14, shots +17.5%; divergence from the legacy brain 55.9%, mean price = reception 0.658 × value 0.0808 vs a 0.0715 marginal ⇒ the chooser really is landing in above-average zones. It failed at the one thing it was predicted to fix. **Ruling #15 (c)'s pre-registered FAIL mode matches**: third-man play is definitionally a TWO-pass pattern whose value accrues to the NEXT reception, and a one-step V cannot see it — every one-pass-shaped combination counter (overlap, give-and-go) recovered or improved. Second candidate, named in E5a before E5b ran: the two unmeasured attacking-third-inner cells under-price the most advanced men, which is exactly H3's axis. **Not separated here, and separating them is a new experiment.** Per §6: no bonuses bolted back, no horizon widened, no outcome definition swapped; **E4 round 2 does not open** |

## E5c — The attribution experiment

| E5c | **The attribution experiment** (ruling #16.4): (a) HU — a cell-targeted census top-up of the two starved inner attacking-third cells to the 400 floor, re-emitted as new SHA'd data, then the E5b probe re-run with every gate VERBATIM; (b) HM — on that residual, fork-and-force the pass to the licensed runner at pattern-active moments and ask whether the topped-up table still under-predicts what happens there, with the same moments' other candidates as the control | [`EDS-E5C-VALUE-ATTRIBUTION.md`](EDS-E5C-VALUE-ATTRIBUTION.md) | **PRE-REGISTERED 2026-07-26** — (a) X1–X4 · **U1 staging equivalence** (the fast two-walk staging must return E5a's Z6/Z7 rows exactly: 129/64 receptions, 0.09302…/0.421875 — the gate that buys the speed) · U2 rest untouched bit-for-bit · U3 committed = census · U4 ≥400 per cell per set · U5 held-out ≤5.0pp · **U6 the E5b re-run**: HU CONFIRMED iff third-man ≥0.85×, PARTIAL 0.653–0.85×, REFUTED <0.653× (the 0.05 margin on v1's 0.603× is ≈6σ on E5b's own counts), *with Y4V, the §2 band, dominance and perf all still passing*; (b) Y1–Y4 · M1 ≥600 clean receptions per arm · **M2 HM CONFIRMED iff the pattern gap (realized − predicted) ≥ +4.0pp AND the control gap is within ±2.0pp**. Stop rules: neither fires → a third cause nobody named, report and return; both fire → E5d queues against seat 2. <br>⛔ **RUN 2026-07-26 — NEITHER FIRES; the queue returns to the COMMANDER with a third cause named from the numbers** (§7.1–§7.3). ✅ **(a) PASS on every gate** (SHA `38c430e3…303e`, twice byte-identical, table SHA `a197b453…ed46`): **U1 the fast staging returns E5a's Z6/Z7 rows to the last digit**; Z6 129→**902 @ 11.97%** (held out 869 @ 12.20%), Z7 64→**400 @ 28.25%** (held out 400 @ 30.25%) against the 7.15% marginal — and Z7's banked 42.19% was the thin-sample mirage E5a flagged. ⚠️⚠️ **U1 ALSO SURFACED A DEFECT IN E5a, disclosed in §7.1**: E5a counted an arrival that never reached `attemptFirstTouch` as a reception (E2a-2's registered convention, correctly inherited) but **never simulated its value window**, entering it as a guaranteed non-shot — 34.48% of Z6 and 28.75% of Z7. Simulating them: they shoot at **7.07%/10.43%**, so those cells are deflated ≈2.4pp/2.8pp and **every other cell by an unmeasured amount**. NOT repaired (keeping the convention is what makes the topped cells comparable); re-censusing all eight and re-banking E5a is the commander's call on a banked milestone. My own probe was ALSO wrong against its contract (it excluded those arrivals, so U1 compared definitions instead of stagings) — corrected toward the pre-registration, after which U1 passes exactly. ⛔ **U6 — the E5b re-run, probe byte-unchanged, HU REFUTED: third-man 0.395×** (line 0.653×), *below* the un-topped 0.472× — the top-up made it WORSE. ✅ **But HU is CONFIRMED on the forward share**, a split the contract did not anticipate: −3.06pp → **−0.21pp**, failing to passing, because the most advanced men stopped being under-priced. Nothing else changed: Y4V 0/10,292, §2 band inside on all five, dominance 27.16%, perf 1.187×. The top-up pushed the game *further* the same way — passes/match 63.9→**56.5**, chain 3.84→**3.26**, give-and-gos 0.533→**0.255**, shots →15.54. ⛔ **(b) HM REFUTED narrowly** (SHA `1658231a…36d3`): pattern gap **+3.38pp** against a +4.0pp floor (n=608, ≈2.6σ from zero) with the **control at −0.06pp on 1,567** — the table is right everywhere else and under-predicts the licensed runner, just by less than the pre-registered band. ⭐ **B2 corrects ruling #16.3's geometric premise, measured**: third-man runners arrive Z2 51.8% / Z4 21.9% / Z3 18.3% and only **4.1% in the inner box** — the confound the ruling registered is not what the geometry does. ⭐⭐ **B4 + §7.3 name the third cause from measured quantities**: the licensed runner is a genuinely HARDER pass (clean reception **40.16% vs 51.77%** at the same moments), and per forced pass the pattern is worth **4.89% vs 3.80%** in realized shots while the chooser's own axis scores it **3.53% vs 3.83% — the composition INVERTS the true ordering**. The failure is neither coarseness nor state-blindness but **a per-option argmax over P̂ × V̂ declining a pass whose payoff is joint**; the legacy ×1.15/×1.3 multipliers were buying exactly that pass, and every one-pass shape survived because it never needed the subsidy. Three untested readings left for the commander in §7.3 — chief among them that **the joint is directly measurable on these same forks and the chooser is not using it** |

## E5d — The attempt-value axis

| E5d | **The attempt-value axis** (ruling #17.4): replace the two-factor composition with ONE measured quantity, `EV̂(shot | ATTEMPT, destination cell × threat band)` — every fork's window simulated and counted, clean/messy/unadjudicated alike, so the repair REMOVES a composition instead of adding one and closes E5a's unfollowed-window defect in the same census. **Phase 0 is free and decisive on E5c's own forks**; Phase 1 (fresh census → axis swap → the E5b probe verbatim → narrow audit → E4 round 2) is CONDITIONAL and its gates are deliberately not frozen yet | [`EDS-E5D-ATTEMPT-VALUE.md`](EDS-E5D-ATTEMPT-VALUE.md) | **PHASE 0 PRE-REGISTERED 2026-07-26** — X1–X5 · **X6 staging equivalence** (the clean-conditioned SUBSET of the attempt census must return E5a's committed marginal exactly, 7,864 @ 0.07146490335707019 — E5c's U1 lesson applied before it can bite) · C1 ≥200 attempts per bucket with a frozen fallback ladder (cell×band → cell → marginal) · C2 held-out ≤5.0pp/1.5pp · C3 discrimination ≥5.0pp and calibration ≤2.0pp · **R1 ORDERING RESTORED** (sign of EV̂(pattern) − EV̂(control) > 0 — reality pays +1.09pp, the composed axis scores −0.29pp, so the SIGN is the question and a magnitude would be invented) · **R2 ARGMAX MOVES** (+5.0pp of pattern-active moments where the argmax picks a licensed runner — deliberately about the DECISION, since a table that improves a number without changing a choice has changed nothing). Zero `src/**`. Stop rule: R1 or R2 fails → no re-rank, Phase 1 not entered, the residual returns to the commander as a DESIGN question. <br>⚠️ **RUN 2026-07-26 — THE AXIS RE-RANKS, and Phase 0 is still NON-PASS; the fork is the COMMANDER's** (§6.1, SHA `e42e75c3…1299`, twice byte-identical, fingerprint unchanged, **zero `src/**`**). ⭐⭐ **R1 + R2 BOTH PASS, decisively**: the composed axis calls pattern-vs-control a coin flip (**+0.05pp**) where reality pays **+3.18pp**; EV̂ says **+2.02pp** — sign restored — and at the 450 pattern-active moments the argmax picks a licensed runner **23.78% → 39.33%, +15.56pp** against a +5.0pp floor. **70 decisions change hands, not just a statistic.** Attempt-table gradient over the eight cells 1.05/1.63/6.03/7.01/14.59/14.10/17.75/**36.71%**, marginal 6.33% over 14,114 attempts (held out 5.87%); C1 14/40 gated, C2 held-out PASS, C3 discrimination **15.07pp**. ⛔ **X6 FAILED and is NOT re-amended** (I2's precedent, ruling #6.2): the clean subset's COUNT is E5a's **7,864 exactly** — the staging provably did not drift — but the rate is 0.07922 vs the banked 0.07146, because **E5a captured `shotsBefore` AFTER the 12-tick adjudication window**, so its value window ran `[touch+12, kick+240]` while its own contract says "within 240 ticks of the kick". Certain from code. I have now written X6 twice in a form that conflates DEFINITION with STAGING; the first form was unsatisfiable and amended before the run, this one fired and stands. ⭐⭐ **What it exposes is worth more than the gate**: on the same 7,864 receptions E5a's marginal is **7.146% as banked → 7.922% with the correct window start → 9.054% with every window simulated — deflated 1.91pp, 27% relative**, by two independent defects the attempt axis structurally cannot have. D5: of 14,114 attempts, 1,473 arrivals (18.7%) never adjudicate and pay **6.04%**, and attempts that never reach pay **2.85%** — both invisible to the composed axis. ⛔ **C3 calibration FAILED narrowly**: on the selected pattern-moment population the table over-predicts the CONTROL arm by **2.08pp** (band 2.0pp) while the pattern arm sits at 0.92pp — it does not touch R1/R2 (both are within-population comparisons) but it is the first thing a Phase-1 pre-registration must answer. Nothing shipped, no `src/**`, E4 round 2 still shut |

## E5d-P1 — The attempt axis censused where it is deployed

| E5d-P1 | **The attempt axis censused where it is deployed** (ruling #18.4): population = licence-triggered decision moments with the full candidate set; window `[kick, kick+240]` with every fork simulated and no adjudication conditioning anywhere; features stay destination-cell × threat-band with NO pattern-state feature added preemptively; table as SHA'd data → chooser axis swap (the composition REMOVED, `price = EV̂`) → the E5b watchability probe verbatim → narrow audit → **E4 round 2** | [`EDS-E5D-PHASE1.md`](EDS-E5D-PHASE1.md) | **PRE-REGISTERED 2026-07-26** — X1–X5 · **S1 staging pin and D1 definition pin SEPARATED** (ruling #18.2's codification, and the direct lesson of writing X6 twice as a mixed gate): S1 = two-walk staging ≡ Phase 0's per-tick-clone staging, attempt records identical in order; D1 = this window returns Phase 0's banked attempt marginal exactly (14,114 @ 0.06327051154881677) · T1 committed = census · C1 ≥200/bucket, ≥8 gated · **C2 held-out calibration on DEPLOYMENT moments, both arms, band 2.0pp NOT widened** (powered: n ≥ 1,500 per arm for SE ≲0.7pp) · C3 discrimination ≥5.0pp + held-out · then **the E5b probe verbatim**: Y4V, §2 band, dominance, perf, and **H1–H4 unchanged** (moving them now would make the whole slice worthless). ⚠️ Registered boundary: the live chooser fires at EVERY pass moment while #18.4(a) names licence-triggered ones as the deployment population — so the same calibration on the GENERAL population is REPORTED, never gated, and the question is answered by measurement rather than argument. <br>⛔ **CENSUS RUN 2026-07-26 — the alignment WORKED, one held-out bucket fired, and the phase STOPS BEFORE THE SWAP; the fork is the COMMANDER's** (§6.1, SHA `f9a1395b…707e`, twice byte-identical, fingerprint unchanged). ⭐⭐ **The split pins are the X6 lesson working**: S1 (definition fixed) — the two-walk staging produces attempt records IDENTICAL to Phase 0's per-tick-clone staging, in order, field for field; D1 (staging fixed) — this window returns Phase 0's banked attempt marginal **exactly, 14,114 @ 0.06327051154881677**. Two claims, two gates, each able to say which one moved. ⭐⭐ **C2 — the gate this phase existed to fix — PASSES on the aligned population**: pattern **−1.22pp** (n=5,195), control **+0.65pp** (n=10,269, was +2.08pp on the general census), marginal **+0.02pp**; both arms 3–7× the power floor and the 2.0pp band NOT widened. ⭐ **R2 closes the boundary I registered before the run**: scored on the GENERAL population the deployment table reads **−0.72pp** overall (licensed −1.09, unlicensed −0.66) — inside the same band, so aligning one end did NOT misalign the other. C1 16 gated buckets · C3 discrimination **13.41pp** · held-out marginal 5.62 vs 6.03%. Attempt gradient 1.16/0.68/4.30/6.88/9.48/14.25/16.62/**21.33%**. **R5**: 6,428 of 15,398 attempts are NOT clean receptions and still pay **2.15%** (clean pay 8.10%) — clean-conditioning was discarding a fifth of the realized value. ⛔ **C3's held-out BUCKET check failed on exactly one bucket** — cell4×band2, 11.91% vs 17.09% at n≈235, error 5.18pp against 5.0pp = **1.59σ, thin-bucket noise** — and the reason it could fire is **my own design error**: C3's tolerance was inherited verbatim from E5a's V3 where cells carried n≈1,000 (3.4σ), while this contract's bucket floor is 200. A floor and a tolerance taken from different experiments and never checked against each other; re-choosing either after seeing which bucket fired is what the discipline forbids, so it stands as fired. **Nothing swapped, table NOT committed as data, the E5b probe NOT run, E4 round 2 does not open, zero `src/**` behaviour change**. <br>✅ **C3R PASS 2026-07-26 — every gate** (§7.4, SHA `5f837f4a…7221`, twice byte-identical, table committed at `e0e73505…ea6b`): raising the FLOOR to meet the tolerance took the worst held-out bucket **5.18pp → 1.23pp** while the 5.0pp tolerance and the gate text never moved; 17 gated buckets on 69,532 attempts per set against a FRESH 770,000+ split, C2 pattern −0.61pp / control +0.68pp, discrimination 12.56pp, general population −0.75pp. X5/S1/D1 held again (D1 returning Phase 0's attempt marginal to the last digit a third time). ⚠️ Reported, NOT chased: the bucket that caused the redraw came back **956 against its own floor of 971** — fifteen short — so it stays ungated on the cell rung; raising the budget to push one named bucket over its line is the move the discipline exists to prevent. <br>⛔ **THE LIVE AUDIT FIRES ON H1 AND H2 — 30/32, E4 round 2 does NOT open, the fork is the COMMANDER's** (E5b probe byte-unchanged, world SHA `5bafff1f…e54c`, fingerprint unchanged, 760/760, flags default OFF). ⭐⭐ **The §2 band is the TIGHTEST any arm in this slice has produced**: goals **−0.07%**, crosses −0.07%, headers +1.95%, long balls −6.75%, cutbacks +7.98%, baseline reproducing all five — the equilibrium is not being bent to buy the shots. ✅ Y4V 0/10,292 · dominance 30.96% · perf **1.186×**. ⭐ **H3 goes POSITIVE for the first time in the slice**: forward share **+1.50pp ABOVE flags-off** (v1 −2.57pp), and H4 shots **1.221×**. ⭐ **H1 is the best third-man any chooser has produced — 0.642×** (composed axis 0.395×, v1 0.603×) — and still misses 0.85. ⛔ **H2 is the new information and it moved the WRONG way: overlap 0.468×**, worse than v1's 0.741× and the composed axis's 0.791–0.835×. **Across the slice the two combination counters have now moved in OPPOSITE directions under every axis** — composed had overlap healthy and third-man dead; attempt has third-man at its best and overlap at its worst. A labelled reading, untested: the attempt table prices the attacking third's inner cells at 16.62/21.33% and the outer-wide cell where an overlap lands at 14.25%, so a value-only chooser takes the more advanced man and the overlap runner loses the comparison the legacy ×1.3 used to win for him. Nothing ships; the table and the swap stay committed but dormant so the next ruling has them in hand |

## E5e-P0 — State-conditional value, Phase 0

| E5e-P0 | **State-conditional value, Phase 0** (ruling #21.3): (a) H2's own power — the overlap counter re-measured across SIX league seeds with the cluster unit declared and a ruling-#20 CI verdict, before `0.468×` is trusted as a magnitude; (b) the DUAL PREMIUM — fork-and-force at overlap-active moments AND at third-man moments, realized outcome against the price the **committed attempt table** actually charges, with the same moments' unlicensed candidates as the control. Both premiums positive and powered → the seesaw reading is certified and Phase 1 (pattern-state features in the census index) may be drafted; either ≈0 → back to the commander | [`EDS-E5E-STATE-CONDITIONAL.md`](EDS-E5E-STATE-CONDITIONAL.md) | **PRE-REGISTERED 2026-07-26** — ⭐ **the sizing scout is the design's premise and is stated up front**: overlap-licence-active pass moments run at **0.065 per match** against third-man's 23.09, so every budget below is sized to that counter and none of the gate VALUES come from the scout. (a) **A0 staging pin** (cluster 1 = the E5b audit seed, reproducing its banked per-match counters to full float) · A1 ex-ante Poisson budget ≥300 OFF-arm overlap events (six clusters predict ≈948) · **A2 ruling-#20 verdict semantics** (NON-INFERIOR only if the WHOLE CI ≥0.70, REFUTED only if the upper bound <0.70, else INCONCLUSIVE) · **A3 cluster robustness** — cluster unit = LEAGUE SEED, 2,000-resample bootstrap over the six, and a disagreement with A2 forces INCONCLUSIVE · A4 the same battery on third-man at 0.85. (b) X5 · **P1 ex-ante coverage ≥2,400 pattern forks per harvest** (derived: SE ≤ δ/2.8 at δ=2.5pp, σ²=0.1222, control 3× pattern, ×1.2 for clustering) · **P2/P3 the two premiums as difference-in-differences** against the committed table, cluster unit = MOMENT, 2,000-resample bootstrap, SUPERIOR only if the lower bound >0 · **P4 control sanity ±2.0pp**, whose failure DOWNGRADES that harvest to INCONCLUSIVE and relabels it "the table is miscalibrated on this population" — E5c's design, kept · P5 determinism. ⚠️ Two boundaries registered BEFORE the run: harvest B is **off-population** (the committed table was never censused on overlap moments), and the predicates are read from **truth** because Phase 0 asks what the WORLD carries, not what a passer can see — perception gating is Phase 1's constraint under ruling #8(l). Reported never gated: the **flip benchmark** (how much the overlap runner loses the argmax by today, from the table's own prices), so a premium that is positive and behaviourally inert cannot be read as a win. Certification = X5∧P1∧P4∧P5 with BOTH premiums SUPERIOR; anything else returns to the commander. Zero `src/**` <br>✅ **(a) RUN 2026-07-26 — MEASURED; `0.468×` was a MAGNITUDE, not a count of rare events** (SHA `f962addf…8495`, twice byte-identical, 6 clusters × 1,704 matches × 2 arms). **A0 6/6** — cluster 1 reproduces the E5b audit's banked counters to the last float — and A1 clears 3.5× over (1,051 off-arm overlap events vs 300). **H2 overlap 0.516×**, pooled CI [0.465, 0.572], cluster bootstrap [0.437, 0.646] — **REFUTED by both, so A3's agreement condition holds**; **H1 third-man 0.660×**, [0.652, 0.669] and [0.546, 0.796] — also REFUTED. Both one-seed readings survive. ⭐⭐ **Three things six clusters show that one could not**: (1) **the cluster rule earns its place on H1** — the naive interval is 1.7pp wide against the bootstrap's **25pp**, a ~15× understatement of uncertainty on a statistic with 53,416 events, because the events are plentiful and the LEAGUES are not, and one cluster comes back at **1.056 — third-man IMPROVED there**; (2) H2's direction is the steadier finding despite 50× fewer events (5/6 clusters below 0.70, vs third-man straddling its floor 0.450–1.056); (3) the counter is **league-dependent, not merely rare** — flags-off overlap runs 0.059–0.168 per match across the six. <br>⛔ **(b) RUN 2026-07-26 — NOT CERTIFIED; the fork is the COMMANDER's** (§6.2, SHA `ced3459b…1f7c`, twice byte-identical, staging check identical, X5 6/6, fingerprint `57b0bdab…c673` unchanged, 809/809 tests, **zero `src/**`**). ✅ **P3 — the third-man premium is REAL against the deployed axis: +1.49pp, CI [+0.60, +2.47]** (cell rung +1.03pp, so not a band artefact), less than half E5c's +3.38pp against the composed V̂ — the attempt axis had already absorbed most of it. ⚠️ But it does **not clear its own flip benchmark**: the runner loses the argmax by 1.10pp on price and the premium's LOWER bound is 0.60pp — real, and the data cannot say it is large enough to change the decision. ⛔ **P2 — the OVERLAP premium is NEGATIVE: −3.52pp, CI [−4.78, −2.28]** (pattern −0.69pp vs control **+2.83pp**) — but the control arm is off-band, which is exactly P4's *"the table is miscalibrated on this population"* condition that the off-population registration anticipated, so the **registered verdict is INCONCLUSIVE, not REFUTED**, and the point estimate is reported under that label. ⛔ **P1 fired by SEVEN forks** (2,393 vs 2,400) and was NOT chased — ruling #2.1 forbids a budget raise outright while a ratio gate is failing at decision time. ⭐⭐ **THE READING I LABELLED AFTER THE LIVE AUDIT IS REFUTED BY MEASUREMENT**: overlap forks land **55% cell 2 / 38% cell 3 — the MIDDLE third**, 1% in cell 7, so the attacking-third price argument was about the wrong part of the pitch; and the flip benchmark comes back **−0.82pp**, meaning at the moments his licence fires **the overlap runner is already the TOP-PRICED option**. He is not losing the comparison. Second time in this slice a geometric premise about where a pattern lands has failed against measurement (ruling #16.3's was the first) — **do not reason about which cell a pattern lands in; ask the census**. ⭐⭐⭐ **The consequence for Phase 1, which is why Phase 0 sat in front of it**: measured state-conditional value would raise the third-man option and **LOWER the overlap option** — it pushes the seesaw FURTHER the way the attempt axis already tipped it instead of holding both ends up. Two limits stated plainly: harvest B measures the premium in the **flags-off** world (as every fork-and-force probe in this slice does), and the live collapse is therefore **unexplained and now sharper — it must be UPSTREAM** (fewer overlap situations developing under the value axis, or releases no longer arriving wide past the counter's stricter `|y| > 11`). One cheap probe would settle it; spending it is the commander's call |

## E5f — The overlap funnel

| E5f | **The overlap funnel** (ruling #22.4): the cheap probe that LOCATES the collapse Phase 0 (b) put upstream of the choice. Counting only, zero forks, zero `src/**`: part (a)'s staging with an A0-style pin, then F1 overlapper assigned → F2 licence-active (the full come-around predicate) → F3 release chosen → F4 the counter's stricter arrival, per-arm rates and OFF/VALUE ratios with league-seed cluster CIs, and **F2→F3 decomposed by the runner's information class in the passer's own snapshot** (VALUE arm) | [`EDS-E5F-OVERLAP-FUNNEL.md`](EDS-E5F-OVERLAP-FUNNEL.md) | **PRE-REGISTERED 2026-07-26** — P0 the instrument is inert (F4 = part (a)'s banked integers per cluster per arm, or INVALID) · P1 funnel monotonicity · P2 ≥300 OFF-arm F2 · P3 determinism. A MEASUREMENT step: verdicts reported, INVALID only on pins. ⚠️ Registered before the run: the instrument TOUCHES the world it measures (manual stepping + `perceivedSnapshot()` at ticks the brain would not have called it), so P0 exists to make a perturbation return INVALID rather than quietly report a different world's funnel. §5's hypothesis map was laid before the numbers. <br>⛔ **RUN 2026-07-26 — MEASURED, and it lands on the branch §5 designated HARD ESCALATION; the fork is the COMMANDER's** (§7, SHA `6112f870…c0bb`, twice byte-identical, **P0/P1/P2 all true**). ⭐ **P0 first: manual stepping plus ~85,000 extra `perceivedSnapshot()` calls reproduced ALL TWELVE banked release integers exactly** — the perception pull is re-entrant in fact, not merely in argument, and this funnel is part (a)'s world. ⭐⭐ **The collapse is ONE STAGE WIDE and it is exactly a halving**: F1 **1.102×** and F2 **1.177×** (the value arm assigns MORE overlappers and gets MORE of them around the outside; both cluster CIs straddle 1 = INCONCLUSIVE = not the problem), **F3 0.588× [0.498, 0.727]** — the only interval excluding 1, consistent across all six leagues (0.64/0.42/0.54/0.57/0.53/0.90) — and F4 **0.579×** which merely inherits it. Transitions: F1→F2 1.068×, **F2→F3 22.86% → 11.43% = 0.500×**, F3→F4 0.985% ratio 0.985× (once released it arrives wide just as often — the counter's geometry is NOT displaced). ⛔ **The class decomposition KILLS the perception hypothesis**: a third of licence-active ticks the runner is genuinely UNSEEN (READ 56,952 / SEEN-UNREAD 3 / UNSEEN 28,140), but **never-READ assignments release MORE, not less — 13.01% (n=976) vs ever-READ 11.03% (n=3,836)**, both ≈ half the OFF arm's 22.86%. **Seat 2 (gaze) does NOT unpark on this evidence**: the runners the passer CAN see are the ones being declined. ⭐ **Exposure is part of it and cannot be all of it**: the value arm holds the ball LONGER while he is live (possession 32.81 → 36.45 ticks) but completes fewer passes in it (0.0818 → 0.0541, **0.662×**) — the direct game's shorter chains inside the overlap window — so fewer passes are played there, and 0.662× does not account for 0.500×. (A crude Fisher reading, not a measured split: the two rates have different denominators, and the honest statement is the weak one, which is still decisive.) ⭐⭐⭐ **So the contradiction is now sharp and it is the escalation**: Phase 0 (b) measured this runner as the TOP-PRICED option at his own licence moments (−0.82pp), and the chooser that prices him top picks him **half as often** — with the ball held longer, with him around the outside more often, and with him visible two thirds of the time. Two candidate reconciliations left explicitly untested and unchosen: the flip benchmark was measured in the FLAGS-OFF world (E5e §6.2.4's own registered limit) and could be re-run with the VALUE arm as the harvested world; and F2-active TICKS are not pass-DECISION moments, which the trace could settle and the funnel cannot |

## E5g — The decision-moment trace

| E5g | **The decision-moment trace** (ruling #23.3): in the VALUE arm, at every pass-decision moment inside an overlapper-live window, log the executable menu, each candidate's live price with its `(cell, band)` inputs, the runner's presence / rank / margin vs the winner, the chosen target, and his priced destination cell beside his truth cell — the stale-geometry seam, if it exists, shows up there. **Three outcomes pre-laid and exhaustive over the CHOICE**: (a) rarely on the menu = different clocks · (b) on the menu but not top-priced = the flags-off flip benchmark did not transfer · (c) top-priced and NOT chosen = a seam defect in the live argmax, hard escalation | [`EDS-E5G-DECISION-TRACE.md`](EDS-E5G-DECISION-TRACE.md) | **PRE-REGISTERED 2026-07-26** — P0 world-hash identity trace-on/off (X3's convention) · P1 staging pin against E5f's banked VALUE funnel integers · P2 ≥2,000 licence-active decision moments · P3 determinism. ⚠️ **#23.3 says zero `src/**` BEHAVIOUR change, not zero `src/**`**, and the menu with per-option prices existed nowhere — so `PricedPassOption` gains the `(cell, band)` it already computed internally and `PassChoiceTraceEntry` gains an `options` sidecar written only under `traceChoice`; re-deriving the menu outside would be a second implementation of the thing under measurement. ⭐ Registered as a fourth QUANTITY that is deliberately NOT a fourth outcome: the chooser picks a TARGET while the action layer decides whether to pass at all, so the chooser→release gap is measured against E5f's banked F3 and reported separately — it cannot later be presented as if it had been one of the three. <br>✅ **RUN 2026-07-26 — MEASURED; the contradiction resolves WITHOUT a defect** (§7, SHA `b6a5f43d…6c2a`, twice byte-identical, **P0 + P1 true**, fingerprint unchanged, **zero `src/**` behaviour change**). ⚠️ **First run came back INVALID and the pin did its job**: F1/F2/F3/counter/matches reproduced to the integer on all six clusters and **only F4 differed, by 1 on three of them** — this probe had nested F4 under F3 while E5f (and contract §3's own wording) counts the counter firing INDEPENDENTLY of the release. Corrected toward the pre-registration, never toward a number (E5c's U1 precedent); the re-run reproduces every banked integer and every decision-trace number is unchanged, since F4 enters none of them. ⛔ **P2 fired and it is MY DESIGN ERROR, owned not lowered**: I set the floor at 2,000 decision moments when the staging contains **854** — not a budget shortfall, six leagues × 24 seasons IS the whole of it, so **the floor was unreachable by construction**. Ruling #19's codified error in its worse form (that one was about inheriting a gate value un-re-powered; I invented one). §5 already said P2 does not invalidate, so it stands as fired and the intervals are simply wider than planned. ⭐⭐⭐ **The dominant fact is UPSTREAM of all three outcomes**: E5f's 4,812 matured runs contain only 854 decision moments — **0.177 per matured run (clusters 0.155–0.194), so in 82% of matured overlap runs the man on the ball never takes a pass decision while the licence is live**. That is #23.3's "different clocks" quantified, and it is bigger than the menu-level effect the outcome was worded around. ⭐⭐ **Outcome (c) is EXACTLY ZERO — 437 moments at rank 1, 437 chosen: whenever he is top-priced he IS taken.** The live argmax is clean, the hard-escalation branch does not fire, and no fork re-run is authorized. The remaining 417 non-picks split ~50/50 between (a) off-menu 210 and (b) on-menu-not-top 207. ⭐⭐ **The flip benchmark DID NOT TRANSFER, exactly as #23.2 registered in advance**: 0.82pp ahead in the flags-off world → **0.92pp BEHIND** in the deployed world (runner 0.0861 vs winner 0.0954), the sign flipping by about the same magnitude — a thin win on a 13.41pp axis that did not survive the world shift, and being top-priced is a coin flip (51.17%) rather than a property. **Which input moved: neither geometry nor the ladder** — priced cell equals truth cell **96.27%**, `band === −1` occurs **0.00%** of the time, and info classes are READ 644 / SEEN-UNREAD 0 / UNSEEN 112 / not-in-window 98. The loss is in the COMPARISON, against the same honest table: the winner most often sits in the runner's OWN cell (2→2 268, 3→3 160), so the threat band separates them, with 2→4 (91) the leading genuinely-more-advanced case. ⚠️ Those pairs pool wins with losses and locate the comparison rather than decompose it; the rank histogram (1→437, 2→121, 3→62, 4→24) is the loss structure. ⭐ **§3.1's fourth quantity found the OPPOSITE of a gap**: the chooser picks him 437 times against E5f's 550 banked releases over the same assignments — releases EXCEED picks (F3 counts releases anywhere in the span), so there is no action-layer loss. Registered, measured, negative. **What returns is a DESIGN question, not a defect**: the pattern needs a decision taken while a run is live, and the direct game does not take one in four fifths of them |

## E5h — The clock twin and the downstream fate

| E5h | **The clock twin and the downstream fate** (ruling #24.4): counters only, BOTH arms, E5f staging verbatim — (i) pass-commits inside licence windows per arm (the OFF twin of E5g's 854) and releases-per-commit, separating *"direct football decides less during windows"* from *"the window-decision share was always the differentiator"*; (ii) the downstream fate of overlap releases in both arms over a frozen 240-tick horizon (cross · shot chain · possession retention) as the C4-link check | [`EDS-E5H-CLOCK-TWIN.md`](EDS-E5H-CLOCK-TWIN.md) | **PRE-REGISTERED 2026-07-27** — P0 staging pin, BOTH arms against E5f's banked integers (doubles as the sidecar pin, the VALUE arm carrying `traceChoice`) · **P1 coverage DERIVED FROM THE ATTAINABLE POPULATION** — ≥400 releases and ≥300 commits per arm, from E5f's banked F3 of 935 OFF / 550 VALUE, which is ruling #24.1's codification of E5g's invented floor applied immediately · P2 determinism. ⚠️ Two things named in the contract rather than glossed: **the twin is NOT E5g's instrument** (the trace only exists where a perceived chooser does, so the twin is defined on what both arms show — a pass leaving a licence-active holder — joined to E5g by a REPORTED calibration, never a gate, since part (i) needs the ratio); and **the C4 check is a stats-delta PROXY** because the registered `noAerial` instrument sits behind `traceFirstTouch`, which `League.matchFlags` cannot reach and arming would be the `src` change this ruling forbids. §5 pre-laid what each answer would mean, including that VALUE-arm releases cashing well would be a **selected elite** and must not be read as a win. <br>✅ **RUN 2026-07-27 — MEASURED** (§7, SHA `9ed77d56…3c29`, twice byte-identical, **P0/P1/P2 all true**, both arms reproducing every banked integer, fingerprint unchanged, **zero `src/**`**). ⭐⭐⭐ **THE CLOCK IS A CONSTANT OF THE SUBSTRATE, NOT THE DIFFERENTIATOR — and this CORRECTS a framing banked one ruling ago.** Commits per matured run: OFF **0.2499** [0.215, 0.287] vs VALUE **0.2267** [0.209, 0.246], ratio **0.907×**, intervals overlapping and per-cluster spreads inside each other (OFF 0.178–0.341, VALUE 0.199–0.255). **In BOTH arms only about a quarter of matured overlap runs ever see a pass commit** — direct football does not decide meaningfully less inside these windows, it was always this low. #24.3 banked the clock as "the FOURTH independent arrow at the C5-family time-dimension seat"; **for the overlap file it is not an arrow at all, so C5 CANNOT restore this counter** — which says nothing about whether C5 deserves building for its own sake, only that pointing it here aims at something that was never the difference. ⭐⭐ **The entire differentiator is at the commit: releases per commit OFF 72.99% [0.712, 0.743] → VALUE 49.04% [0.457, 0.528], ratio 0.672× — disjoint intervals, and EVERY cluster separates** (OFF 0.697–0.753, VALUE 0.440–0.547). **That is the legacy `×1.3` quantified**: the multiplier's whole effect was handing the licensed runner the ball at three commits in four; honest value hands it to him at one in two. ⭐ **Two independently-defined instruments agree without being tuned to each other**: E5g's chooser picks him at 51.17% of licence-active decision moments, this probe's trace-free definition finds 49.04% of licence-active commits become releases. (Calibration, reported never gated: the twin counts 1,091 VALUE commits against E5g's 854, factor 1.277 — the expected consequence of counting "a pass left a licence-active holder" rather than "the brain committed to Pass"; both arms use the one twin definition so the ratios are unaffected.) ⛔ **The C4 LINK IS NOT THE MECHANISM at this horizon**: overlap releases become crosses **1.21% (9/746) OFF and 2.06% (11/535) VALUE**, so #24.3's labelled chain — release → cross → nobody in the box — **cannot be the depressant because it almost never runs**. NOT "crosses find people": the proxy has 9 and 11 events and says nothing either way. ⚠️ **Recorded because I saw it BEFORE the numbers and chose not to act**: the 1-season sizing smoke already showed the cross column would be near-empty at 240 ticks (0 of 63, and the 2.49-crosses-per-match base rate says why), and I left the frozen horizon alone rather than widen a definition after a smoke to get a bigger number — the honest consequence being that a release carried and crossed AFTER four seconds is invisible, so what is refuted is the C4 chain **at the deployed axis's own horizon**, and a longer horizon needs its own pre-registration. ⭐ **#24.3's CONCLUSION survives by another route**: the overlap ball is not bad in absolute terms — 7.24% of OFF releases produce a shot against the table's 5.62–6.33% marginal — it is simply **not the best ball at its own moments**, corroborating E5e harvest B's 8.29% alternatives vs 6.81% runner from a completely different staging. ⚠️ VALUE releases cash HIGHER (9.16% vs 7.24%) = the **selected elite** §5 registered in advance; not a win, not offered as one. Common to both arms and worth the commander's eye: **four seconds after an overlap release the team owns the ball less than a fifth of the time** (18.63% / 17.57%, mean horizon share ≈0.22) — a property of wide play in this substrate, not of the chooser |

## F1 — Player-scale honesty

| F1 | **Player-scale honesty** (user-ratified 2026-07-25: "渲染大于碰撞箱" — verified in code): visual arm-span is ≈1.32 m against a 1.05 m collision footprint (`PLAYER_MIN_DIST`), torso alone eats 82% of min separation — models clip during close marking and bodies read bloated. Fix = uniform visual shrink of the body model (root body scale, NOT labels/rings/halos) with the OBJECTIVE anchor **arm-span ≤ PLAYER_MIN_DIST**; proportion re-sculpting (slimmer torso) is a style call that waits for F0. Zero sim contact — collision constants untouched. Side benefit: pitch reads bigger through the user's existing cameras (broadcast/follow-ball) with no framing change | ✅ **DONE 2026-07-25 — AWAITING THE USER'S EYES** (`src/render3d/PlayerModel.ts`): one derived constant `HUMAN_MODEL_SCALE = 0.64` on a new `scaleRoot` group. Value is arithmetic, not taste: the widest body the game can build is a GK at the tallest hashable identity, arm-span 2 × (0.55 × 1.14 + 0.03 + 0.09 × 1.25) × 1.06 = **1.63134 m**; 1.05 / 1.63134 = 0.6436 → rounded DOWN to 0.64, giving **max arm-span 1.0441 m ≤ PLAYER_MIN_DIST**, nominal MF 1.32 → 0.845 m, nominal standing height 2.70 → 1.72 m. Pure `armSpan()`/`maxArmSpan()` + 3 contract tests pin BOTH directions (0.64 fits, 0.65 does not; the unscaled model provably did not fit). Gates: tsc clean · build clean · **717/717** · fingerprint **`57b0bdab…c673` unchanged** (measured before and after on the same tree) · zero `src/sim` contact · phone framing checked at 390 px. <br>⚠️ **Scope extended beyond the row, disclosed:** the shrink also applies to `RefereeModel`/`LinesmanModel`/`CoachModel` (same box-person skeleton, same constant) — shrinking players alone left the officials towering over the game, which the first screenshot pass showed plainly; "统一" reads as one human scale, not one class. The grounding blob moved INSIDE the scaled group (it is the body's contact shadow, not a marker — and it is absent from the ruling's labels/rings/halos exclusion list). <br>📌 **User verdicts on the three F1 forks (2026-07-25):** ① scale **0.64 RATIFIED** (the full-coverage anchor, over the looser 0.70/0.79 arms); ② **label height rides the shrink after all** — `y 3.15 → 3.15 × 0.64` on the player plate, `2.7 × 0.64` on the coach nameplate, and the declutter projection point moved with them (`3.1 × 0.64`) so overlap is still tested where the plate actually is; plate SIZE unchanged, so 标签不动 holds for the thing it was protecting; ③ **night is now up for grabs** — F0 renders every style arm in daylight AND night, so `ART_DIRECTION.md`'s "dark backdrop / four floodlights / atmosphere darker than the surface" rule is provisionally OPEN pending F0's pick. Still untouched: `PlayerShowcase`'s camera (`0, 1.75, 5.6` looking at `1.02`) now frames a smaller figure — an F1+ lever, not a defect of the anchor. <br>➕ **F1b, on the user's follow-up ("球的大小也得变吧"), same commit family:** every render fake sized against the bodies now rides the same constant — `BALL_VISUAL_SCALE 2.6 → 2.6 × 0.64` (radius 0.286 → 0.183 m, holding the M4-**accepted** 21%-of-body-height ratio instead of letting it inflate to 33%), the keeper's held-ball height cap and 0.3 m hand reach, and the synthesized ground-kick hop arc (1.8 m over a 1.72 m man was a moon shot). Re-gated: 717/717, fingerprint unchanged, build clean |

## F0 ★ — DONE 2026-07-25 — PICKED AND SHIPPED: arm (a) toy/board-game, daylight, night switchable.

| F0 ★ | ✅ **DONE 2026-07-25 — PICKED AND SHIPPED: arm (a) toy/board-game, daylight, night switchable.** The user chose (a) over (c), and asked for both lightings live, so `DEFAULT_STYLE='toy'` / `DEFAULT_LIGHTING='day'` now ship and time-of-day is a real player setting (LeftBar segmented control, persisted at `evo:lighting`, `Lighting/Day/Night` localised). `current` is frozen forever as the banked pre-F0 baseline the pick was made against — a test pins it literal for literal, and F-DIRECTION forbids editing it. Re-gated after the ship: tsc + build clean · **722/722** · fingerprint `57b0bdab…c673` unchanged · visual suite clean apart from two PRE-EXISTING stale assertions unrelated to Track F (`linesmen hold their touchlines` hard-codes `|z| > 29.4` but the `FIELD_SCALE 0.7` rescale put them at 21.1; `crowd > 200` now reads 192) — reported, not silently fixed. <br>Showcase as built: Arm **(b) broadcast realism-lite was DROPPED, not built** — the user asked whether it was worth seeing and the answer was no: it needs gLTF rigs + skeletal animation, which contradicts `ART_DIRECTION.md`'s own "no binary/external assets" rule, F0's own row flagged it phone-risky with skeletal animation as the quality ceiling, and the user's reference image is stylised rather than realist, so it was already answered. Arm **(c) was KEPT as the control** precisely because it is a strict subset of (a)'s work and answers the one question the eye can't: how much of the gap is mere incoherence. Implementation = a real seam, not throwaway: `src/render3d/stylePresets.ts` holds the arms as pure DATA (atmosphere, lights, grass palette/grain/wear, paint softness, chrome palette, floodlights, toon flag, contact-shadow), consumed by `createScene`/`createPitch`/`bodyMat`/the renderer's tone mapping; `__evo.setStyle(id, lighting)` rebuilds the 3D view so one harness shoots every arm at the same frozen tick. **Lighting is orthogonal** (user 2026-07-25): all three arms rendered in night AND day, both the broadcast and follow-ball cameras — 12 frames, two comparison sheets sent. Findings worth keeping: the game shipped with **three's default `NoToneMapping` and no managed exposure**, which is a large part of the flat/harsh read; the first pass painted **soap bubbles** (900 grain blobs at up to 2.55 m radius stack into discs) — count and radius must move in opposite directions, now pinned by a test; and relighting `current` for day **without** touching the chrome leaves a near-black terrace under a noon sky, which is itself the argument for arm (c). Gates: tsc + build clean · **721/721** (4 new pure preset tests, incl. one that pins the default preset literal-for-literal so a screenshot tweak can never drift the shipped look) · fingerprint `57b0bdab…c673` unchanged · zero console/page errors across all 12 renders. **Not yet decided: the pick, and therefore `F-DIRECTION.md`.** Known gaps if (a) wins: `CrowdSystem` body colours are unstyled, character proportions (thin limbs, featureless sphere heads) are untouched, and no post/tilt-shift. <br>Original scope: **Style-direction showcase**: same frozen frame rendered 3 ways for the user to CHOOSE — (a) toy/board-game world: double down on box-people, toon/ramp shading, flat palette discipline, fake contact AO, tilt-shift feel; (b) broadcast realism-lite: gLTF low-poly rigs, PBR, post stack — expensive, phone-risky, skeletal animation becomes the quality ceiling; (c) current look + coherence pass only (unify material language, tone mapping, palette). Commander recommends (a). Render the showcase through the cameras the user actually uses — **broadcast and follow-ball** (user 2026-07-25: the wide tactical camera is NOT their view; no wide-angle preset work). User picks; the pick becomes F-DIRECTION.md | **READY — user gate, light session** |

## F8 — PWA / install to the home screen

| F8 | **PWA / install to the home screen** (user 2026-07-26: "manifest + 图标 + service worker(缓存优先 + 更新提示)+ 全屏 display + 比赛中 wake lock"). Not art — the shell around it — but run under Track F's rules because the phone is the binding constraint. ⭐ **Procedural icons, no committed binary**: iOS refuses an SVG home-screen icon, so `scripts/appIcon.ts` transcribes `public/icon.svg` into a shape list, rasterizes it analytically (3×3 supersampled, straight alpha) and encodes a PNG by hand over `node:zlib` — ~4 icons emitted straight into the bundle by a `pwaAssets` Vite plugin, nothing on disk in the repo. Each variant is right for its platform, which is itself tested: transparent rounded corners for Android's unmasked `purpose:any`, full-bleed opaque with the artwork inside the 80% safe circle for `maskable`, opaque square for `apple-touch-icon` (iOS applies its own mask). Manifest now `display: fullscreen` with a `display_override` fallback chain, `scope`/`start_url` relative so the Pages sub-path works, and a `@media (display-mode: fullscreen)` safe-area inset on `#app` so `black-translucent` does not park the topbar behind the clock — inert in a normal browser tab. Wake lock is a state machine (`src/ui/wakeLock.ts`), not a call at kickoff: the browser drops the lock on background so it must be RE-taken, and it is driven from the frame loop so a rejection must never become a per-frame retry (one attempt per episode; a paused game / finished match / attract-mode title screen all let the phone sleep, via the pure `screenShouldStayAwake`). <br>⚠️ **THREE defects a browser probe caught that the unit tests could not, all three total and all three silent — this is the row's real lesson: a service worker fails invisibly.** ① `cache.addAll` is ATOMIC and rejects on a DUPLICATE url; the plugin emits the icons *into* the bundle, so they arrived twice, install failed, and **no worker ever activated** — now deduped, and install caches entry-by-entry so one bad URL degrades to a partial cache instead of killing the worker. ② Vite marks the entry script/stylesheet `crossorigin`, so the browser sends `Origin`, and a server answering **`Vary: Origin`** (vite preview does; CDNs commonly do) made those two requests MISS entries that were provably in the cache — **offline was completely broken while the cache listing looked perfect**; fixed with `ignoreVary` on every lookup, pinned by a test that forbids a bare `.match(req)`. ③ `register()`'s implicit update check is a *soft* update Chromium throttles — a changed worker sat undetected across a reload for 24s, so **a deploy could go unnoticed indefinitely**; now an explicit `reg.update()` on load plus a throttled foreground re-check. Also removed a `window.load` gate on registration (this page holds 17 MB of audio, so `load` can be minutes away on a phone). <br>Design calls, disclosed: precache is the 1.7 MB shell ONLY — the 17 MB of audio is runtime-cached on first play into a separate UNVERSIONED media cache (re-downloading it per deploy would be hostile; `MEDIA_CACHE_VERSION` is the hand-bump escape hatch); no `skipWaiting()` on install, because swapping the bundle under a running match is exactly the interruption the cache exists to avoid — the user gets a dismissible top-centre bar (`新版本已就绪。/ 更新`) instead; **`?nosw=1` is a documented kill switch** that unregisters and clears every `evo-` cache before anything registers, the answer to a bad cache-first worker on a live site; and **`orientation` changed `landscape` → `any`** — a landscape lock would have rotated the game out from under a user who plays portrait at 390–640 px. Gates: tsc + build clean · **808/808** (+49, incl. a hand-written PNG decoder that verifies the encoder) · fingerprint `57b0bdab…c673` unchanged, measured before and after on the same tree · zero `src/sim` contact · 15/15 browser probe checks green against a served production build (installs, activates, controls, 19-entry precache with no audio, all icons 200, **boots with the network OFF**, update prompt appears and swaps the cache on accept, kill switch clears the stale one) · dev-server middleware serves every generated asset | ✅ **DONE 2026-07-26 — ✅ USER ACCEPTED 2026-07-26 ("pwa没问题"): installed on the phone, works. F8 closed** |

## Relocated queue-state history (from PROGRAMME.md, 2026-08-02 restructure)

**Queue state (2026-07-28 night, #45 running): 📝 C6 DESIGN CONTRACT DRAFTED
by the commander** → [`C6-EMBODIED-CARRYING.md`](C6-EMBODIED-CARRYING.md)
(the map's six questions ruled: **v1 = THE HONEST OFFSET** — the turn as
geometry, `carry 0.85` becomes a magnitude/lag/noise law of the body's own
state + dribbling, NO opponent input, NO touch cost ever in C6 (#12
boundary), ZERO new loose balls by construction; pressured-carry de-glue =
v2 seat behind a pre-registered scramble ceiling; T2's verdict triggers the
#29.3 C5-re-census decision back to the commander). **T0 RAN and PASSES
every gate — ruling #47: reading (c) RICH MOVABLE GEOMETRY** (4,116 turn
episodes; far-side baseline 0.0476% point-mass; ⭐ only the COMBINED shape
moves it — B tuck+lag+speed +1.425 pp [+1.33, +1.53] while tuck-only and
lag-only drive it to ~0; ⭐ ALL candidates RAISE tackle-eligibility, B
+19.1% — **the glue was quietly protective**, honest carrying costs
eligibility and buys technique-priced side-protection; kick displacement
p50 0.35 m corrects the contract's "centimetres" premise, #47.4).
**T1 CHAIN COMPLETE
(#48 → build `0531b4e` → run FAIL on 69 unexplained → #49 diagnosis
(advantage-foul injury, code-verified) → T1R `72aaa6b` → GATES PASS →
ruling #50: ⭐ READING (A), BOTH AXES CERTIFIED** — eligibility +11.63%
CI [+8.51, +14.85] (band low half, live damping), far-side +1.3215 pp
CI [+1.254, +1.3925] (degenerate 0.048% baseline broken), receipts
closing 69+24=93 exactly, dormant, zero-loose structural, fingerprint
unchanged. **The honest offset does what T0 sized. T2 queues for
daylight** (watchability battery; #29.3's C5 re-census stays parked
behind its verdict). Also drafted tonight:
[`STAGE3-V2-DIRECTION-MEMO.md`](STAGE3-V2-DIRECTION-MEMO.md) — the
anticipatory census (COMMANDER DRAFT, #45.2(c), awaiting the user's
morning ratification; nothing authorized). **Both morning forks RULED
2026-07-29: ① Stage III v2 = 先攒底子 (user verdict, ruling #53 — parked
with the memo banked as the revival direction; unpark = C6 T2 verdict +
#29.3 C5 re-census decision + C7 map) · ② C6 T2 = 跑 (ruling #51 → #52
review PASS → probe build in flight; the resident session runs it).**
THE ROAD: C6 T2 → C5 re-census decision → C7 Phase-0 map → Stage III v2
revisit.

**Update (2026-07-29, #54): ⭐⭐ C6 v1 CERTIFIED END TO END** — T2 all
quiet (every limb ~100× inside its edge; §2 band holds; PC-LOOSE did not
transfer, −0.76% unresolved — no loose-ball tax at match level; PC-KICK
inside ±5%). The honest offset is deployment-safe, dormant behind
`c6Carry`, nothing shipped. **#29.3 decided: ONE C5 re-census after C7's
first slice** (C6 moved the hold's cost side — stationary tuck 0.55 m;
C7 wind-up is the payoff-side lever; #26.5 staleness makes per-lever
re-censuses waste). **C7 PHASE-0 CODE MAP DONE** →
[`C7-PHASE0-CODE-MAP.md`](C7-PHASE0-CODE-MAP.md) (⭐ release is
synchronous — the committed-but-unstruck tick DOES NOT EXIST; the
reception side's `pendingControl` already runs the missing shape;
`kickMisalignment` = the one double-charge hazard). **C7 DESIGN CONTRACT
DRAFTED by the commander** → [`C7-RELEASE-WINDUP.md`](C7-RELEASE-WINDUP.md)
(v1 = SHOT `pendingKick`: time-only, existing prices evaluated at strike
time, interruption free via the existing ball-keyed tackle, no opponent
input, shots-only bounds watchability; pass wind-up deferred with §2
obligations). **⭐⭐ C7 v1 CERTIFIED END TO END (2026-07-29, rulings #55–#60)**:
T0 census (reading (d): interruption seat real 10–14%, head-room
tail-concentrated) → T1 `pendingKick` (all 16 gates; quality axis =
design case, noise −3.68 pp carried by the twisted tail −13.61 pp;
interruption 3.52% = real but thin, static defenders) → T2 match A/B
(all quiet; goals +8.79% paired, absolute mid-band — the pre-named risk
did not bite; conversion effect, not chance-manufacturing). Dormant
behind `c7Windup`, nothing shipped. Chain docs:
[`C7-T0-SHOT-RELEASE.md`](C7-T0-SHOT-RELEASE.md) ·
[`C7-T1-PENDINGKICK.md`](C7-T1-PENDINGKICK.md) ·
[`C7-T2-MATCH-AB.md`](C7-T2-MATCH-AB.md). **⭐⭐⭐ THE SUBSTRATE ROAD
IS COMPLETE (2026-07-29, rulings #60–#63)**: the single C5 re-census
over the C6+C7-enriched world ran (labelled FAIL on the power floor →
#62's mechanical extension, optional-stopping door closed) and
**CERTIFIED at 3.17σ: the unpark FIRES** — in exactly one context
(unpressured · fresh percept · low support, k=30) half a second of
holding is statistically indistinguishable from free (−0.67 pp
[−4.66, +3.15]); the mid-support twin died as small-n noise; every
longer/pressured/stale cell still charges. Patience has a PERMITTED
corner, no subsidy; the enriched world plays FASTER (30.7 vs 28.8
releases/min). → [`C5-RECENSUS.md`](C5-RECENSUS.md). **NEXT: (a)
executor drafts C5-T2 (the WHETHER seat) per #63.3; (b) the #53 Stage
III v2 unpark condition is MET — the revisit is the USER'S fork,
presented next round.** **C5-T2 CHAIN COMPLETE
(freeze `24ecd16` → #64 review PASS → build+smoke `f448eee` → ⭐ ruling
#65: the #44.5 sign-off REFUSED, the fork stage NEVER RUNS)** →
[`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md): the sizing smoke
measured a RATE shortfall no match count cures — live chooser-hold rate
**0.141%** vs the frozen 0.29% floor, E-ABSTAIN-UNSEEN 70.7%, context
agreement 50.2% — so **the seat RE-PARKS on a PERCEPTION wall** with its
machinery banked dormant (868/868 green; unpark = any perception-trunk
change that raises the perceived-cell share, cheap smoke first). ⭐⭐⭐
Banked (#65.2): **the certified patience corner exists in true context
(0.586%) but the carrier cannot SEE it — perception, not price, is the
binding constraint.** Third independent arrow at the perception trunk
this week (#56.2 defenders don't anticipate shots · #44 the eye can't
see neighbours' motion · #65.2 the carrier can't see his own calm).
**STAGE III v2 LAUNCHED
(user "1", ruling #66) and the chain is running**: contract drafted
([`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md)) →
V2-P0 wedge map RAN, reading W1, both teeth clear (**the off-ball body
SEES: A 93.08%, W_r 0.851** — the complement of #65.2's blind carrier;
#67/#68) → ⭐⭐⭐ **V2-P1 THE ANTICIPATORY CENSUS RAN AND PASSES (ruling
#70): THE COMPOSITION PRICE EXISTS AND IT IS GEOMETRIC** — 36 resolved-
negative cells concentrate in the behind/lateral ring (following a
teammate into cover duplicates it; median −9.7 pp, floor −20.4 pp) vs
36 resolved-positive dead ahead (a teammate's forward run marks real
opportunity; up to +38.2 pp); the pooled ≈0 is the two structures
cancelling; 不要重复补位,要支援进攻 — in the table, not in a rule
([`STAGE3-V2-P1-ANTICIPATORY-CENSUS.md`](STAGE3-V2-P1-ANTICIPATORY-CENSUS.md)
§9; 932,786 forks, the heaviest run of the programme). **V2-P2 RAN (chain: freeze
`5cb8339` → #71 review → control-recovery GUARD PASS → prediction
recomputed + #65 checkpoint PASS → build `f92636a` → run `9c28826`) —
⛔ READINGS (b)+(h) TOGETHER (ruling #72): DELIVERED AND FLAT, AND THE
EYE CONVERGES EVEN SEEING OTHERS COMING** — DEV 61.56% (v1's killer
genuinely fixed; a clean negative), ATE +0.006 CI containing zero,
ORACLE ≈ 0 (truth doesn't beat percept — the table itself does not
transfer), FORK-SPACING closed −1.05 m, going=1-avoidance INVERTED,
60.4% of deviations into the 180-ring (v1's attractor, harder).
⭐⭐⭐ **The diagnosis, named (#72.2): SIMULTANEITY — the going-bit reads
motion, and simultaneous deciders cannot see each other's incipient
choices; one lagged bit of anticipation cannot break the behind-ring
attractor. Real football solves this with SHARED PRIORS — the A4
doctrine seat.** Stage III v2 CLOSES at fork grain (two generations,
two different measured convergence mechanisms); the P1 composition-price
census STANDS certified; all machinery banked dormant. **THE FORK IS
THE USER'S (#72.4): (A) the A4 doctrine seat (RECOMMENDED) · (B) the
R3-saturation census · (C) park Stage III, return to the C-track.**
R20 gaps / F9 available. Road B stands; nothing ships. Earlier tonight: the #45.2(0) doc split landed and was
accepted (43 rulings verified in RULINGS, 0 giant lines left, orphaned P1
review re-homed).

**⭐⭐⭐ STAGE III v3 CLOSED END-TO-END (2026-07-31, rulings #77–#88).** The
user took fork (B) from #72.4 (the R3-saturation direction) and v3 ran the
ROLE eye — every body reads HIS OWN role's column: contract + launch (#77) →
V3-P0 role map (R3 clear, roles separate; #78/#79) → V3-P1 the role-conditioned
census CERTIFIED (division of labour lives in the PRICES — the 16 BH-resolved
cells, DF near-ball build-up, WG width already paid; #80–#82) → V3-P2 the role
consumer (#83–#85): the FIRST POSITIVE PAYOFF in three generations (ATE +0.0108,
DEV 42%) + real per-role signatures, BUT reading (c) fired at fork grain
(spacing did not open) — #85.3 named the metric confound (the table PAYS DF
proximity, so fork spacing cannot tell 到岗 from 扎堆) → the user ratified
V3-P3 ("来吧,a", #86): two sub-stages, P3a the cheap deployment gate first →
V3-P3a pre-reg PASS + build/run authorized (#87, the R0 two-pin resolution
ratified) → **V3-P3a RAN and GATES FAIL (ruling #88): THREE HARD LIMBS FIRE**
— rest defence 66.9%→46.7% (−30.2% rel both sides, band −20%), offsides
3.27→4.01 (+22.8%, band +10%), restart ticks +50.8% (band +10%, the v1 pin-3
warning live); the §2 band also breaks (headers −44.9% / long balls −35.0% /
cutbacks −33.0%, goals inside, R0 inside — no substrate-drift excuse).
**The deployment answer is NO; P3b does NOT run** (probe/data/doc:
[`STAGE3-V3-P3A-DEPLOYMENT.md`](STAGE3-V3-P3A-DEPLOYMENT.md) §RESULT · data SHA
`7dee0f62…150b3` · 3,200 matches · fingerprint `57b0bdab…c673` unchanged).
⭐⭐ **#88.2 THE SHAPE VICTORY, banked — the #85.3 confound RESOLVED FOR THE
EYE**: at full deployment the three-generation pile-up disease is CURED —
DEGEN-PILEUP quiet, scramble/box quiet, spacing median opens, duplicate runs
FALL −3.6 pp, live role-separation TV 0.654 > incumbent 0.407, WG silent as
priced, eye ball-ledger exactly 0, goals differential null. Division of labour
DISPERSES, it does not clump; 扎堆 is dead. ⭐⭐ **#88.3 THE ESTIMAND BATON,
banked**: what killed the deployment is a NEW, different disease — the certified
table prices ONE thing (the 6/10 s two-face axis) and the eye faithfully harvests
it, but the incumbent's hand-tuned defaults were silently doing UNPRICED
LONG-HORIZON JOBS (holding the rest slot, staying onside, resettling for
restarts); value visible at 6 s crowds out value at 30+ s. The eye is not wrong,
the PRICE LIST is incomplete — pricing discipline is design work, a future
contract, NOT a patch. **Nothing shipped anywhere (Road B held across 46 rulings;
the production fingerprint never moved).** All machinery, tables, findings banked.
**#88.4 RULED (2026-07-31, "按推荐go", ruling #90): fork (i) taken — the
ESTIMAND direction launches as STAGE III v4.** The commander-owned design
contract is drafted: [`STAGE3-V4-LONG-HORIZON-PRICE.md`](STAGE3-V4-LONG-HORIZON-PRICE.md)
(v4 amends WHAT the map prices; three frozen mechanism classes H/S/J with
P0 routing by measurement; the no-free-weights law I3 — every long-horizon
term enters in goal-value units through a measured calibration or not at
all; V4-P4 re-runs the P3a battery with the three fired limbs as named
gates at their exact bands, shape adjudicators re-run as gates).
**Amended by #91 (the user-ordered VISION audit)**: the occupancy census
prices HELD LATTICE CANDIDATES, never the incumbent designation (the #90
draft smuggled the menu's answer into the price list — fixed); I3 bans
hand constants, not gene weights; adjudication class E-RELOCATED-CURE
frozen ex ante for the incumbent-anchored I5(b) gate.
**V4-P0 PRE-REGISTERED (executor commit `1ce1209`) → commander review
PASS WITH AMENDMENTS (ruling #93)**: routing battery frozen (uniform
3-test form H/S/J, ordered dominance J→H→S, UNROUTABLE→stop), amendments
A1–A4 applied at review before any datum was seen (face-matched H
boundary 6 s/10 s; the delivery SUPPRESSION limb routes on the incumbent
side; designation-use boundary; the rest ratified) — see the prereg's §7
([`STAGE3-V4-P0-AUTOPSY-MAP.md`](STAGE3-V4-P0-AUTOPSY-MAP.md)).
**V4-P0 RAN AND STOPPED AS FROZEN (§6 / reading B; §RESULT + data
`f54e28b`, number-verify 4/4)**: hard gates all pass at full scale
(X-CORPUS-IDENT FULL to 6 dp; X-DET; X-SRC-ZERO); frozen verdicts
rest=J (0.706) · offside=J (1.0 [1,1]) · restart=J (1.0 [1,1]) ·
delivery=UNROUTABLE (nExcess=0). **Adjudication #96**: two instrument
defects named — the CLASS J criterion is anchor-TAUTOLOGICAL for
event classes structurally outside open-owned play (the
decision-vs-harm gap, commander-owned, #93-ratified wording) and the
delivery detector is broken by internal inconsistency (mining 0 vs
same-run fresh reference 12.08/match). ⭐ Banked substance: the H
columns corroborate #88.3 at event grain (beyond-horizon cost mass
0.57–0.97, all perm p=0); R1 vindicated at full scale (raw-pool S
resolves, stratified null); fresh base rates for P2 sizing
(turnovers 51.3 / near-line 44.1 / restarts 12.6 / deliveries 12.1
per match). **V4-P0b PRE-REGISTERED (`43ac514`; verify 5/5) → review
#97 PASS, all flagged choices ratified** — decision anchor =
`stationEyeState.untilTick` new-value ticks (decisionTick =
untilTick − 180); the delivery bug's root cause confirmed at source
(an `owner !== null` guard killed kick-moment stat increments; the
guard-free fix sits behind the frozen magnitude HARD gate
[4,833, 14,499]); restart jurisdiction = the exposure map's
phase=restart cell (primary); the origination-moment delivery
support fix ratified as the same anti-tautology principle.
**V4-P0b RAN CLEAN — ALL FOUR LIMBS ROUTE (§RESULT + data `cb23f8f`,
verify 4/4; all hard gates pass incl. delivery magnitude 9,258 ∈
[4,833, 14,499]) → ruling #99: STAGE V4-P0 CLOSES.** The measured
remedy map: **rest = H** (decisions in-support 0.298, cost late
0.57@10 s, p=0) · **offside = H** (0.910 beyond-horizon; the resolved
S contrast −0.105 banked as the pre-registered fallback) ·
**restart = J** (the exposure map: 53k eye decisions per side INSIDE
restart phases, zero priced cells there) · **delivery = S** (cost
binds EARLY, perm p=1.0; wide-vs-central within-cell contrast +0.631,
45 strata; downstream-watch false). ⭐ Exposure finding banked: only
~54% of 764,053 eye decisions occur at priced moments (~32%
ball-in-flight + ~14% restart phases = extrapolation) — the P3
in-support law's surface is measured. P0 (event-anchored) and P0b
(decision-anchored) published side by side. **V4-P1 PRE-REGISTERED
(`86bd481`; verify clean) → review #100 PASS**: matched-baseline lift
estimator (concessions/event = goal-value; face-matched baseline, NOT
location-matched — the nested-ladder design), W_cal = 30 s from P0's
published curves, greedy monotone admission, 40-match sizing smoke
@9.9M then frozen N arithmetic (cap 1,200 @9.8M); box entry accepted
as PROPOSED primary with the final per-channel designation deferred
to the V4-P2 pre-reg (data-informed, freeze-compatible). **→ NEXT:
executor BUILDS `scripts/probes/stage3-v4-p1-calibration.ts` (both
modes: sizing smoke + census; workflow Draft→Verify §0.0), then the
commander runs smoke → N → census detached (#49.5). Monotone-link
gate HARD; all-three-drop ⇒ stop.** **V4-P1 RAN AND CLOSED (ruling #102; §RESULT + both data files
`efd966d`, verify 4/4)**: smoke → N=1,200 (capped) → census 1,200
@9.8M — **THE CALIBRATION TABLE STANDS: deep entry 0.0435
[0.0308, 0.0558] · box entry 0.1952 [0.1662, 0.2235]
concessions/event; shot-against DROPPED non-monotone (0.0865 <
0.1952; shot−box resolved −0.1087)** — the a-priori "shots are
severest" ordering measured WRONG (long-shot dilution; 70.6% of box
entries yield a shot yet the marginal shot is cheaper). CLASS H IS
CALIBRATABLE. ⚠ deep unit window-fragile (unresolved @45 s) — P2
reads at the gated 30 s. Box entry = proposed primary (final
designation at P2 pre-reg review, #102.5). **V4-P2 PRE-REGISTERED (`636d7b8`; verify 5/5, #91 red line clean) →
review #103 PASS, eight flagged calls ratified**: forcedStation
absolute-frozen-target occupancy read; possession-flip NON-terminal
(the hedge itself); 72 cells (3 ball-thirds × 4 roles × 6 folded
region classes, floor 150); W_hold 15 s / W_long 30 s on published
lag-bin edges; per-protocol OCC_FLOOR 0.5; **gating unit = DEEP
entry (0.0435), box = labelled secondary (#103.3)**; full-lattice
fork (control+18), N_max 800, r=21 off-ramp = reading (G). **V4-P2 RAN (smoke #105: N formula's letter answer 19 published +
diagnosed mis-targeted, N re-pinned 100 at the attainability knee →
census reading A, §RESULT + data `efa3ee0`) → ruling #106: THE
STATUE CONFOUND.** The frozen claims fired (47/55 cells resolve;
region separation real, all four middle-third families) — but ALL 47
resolved prices are NEGATIVE (−0.011…−0.053): the point-freeze
enforcement priced BEING A STATUE vs incumbent dynamics; the
gradient (deep worst) cannot buy rest defence. ⭐ Banked as the
DYNAMISM-VALUE MAP (responsiveness itself costs 0.011–0.053
goals/15 s, worst deep/wide — a labelled asset). **V4-P2b RAN CLEAN (build #108 → smoke knee N=100 → census reading
A; §RESULT + data `4018503`, verify 4/4) → ruling #109: THE NEGATIVE
IS REAL — 0/55 in-power cells resolve positive (33 negative, 22
straddle), magnitudes halved vs the statue and the instrument clean
(Δ_statue 42/55 toward zero), so marginal region-occupancy does not
pay against a competent incumbent.** ⭐⭐⭐ Banked conclusion: the
long-horizon discipline jobs are ASSIGNMENT-shaped (team-level
agreement — A4's territory, the 野球 insight), not
per-tick-gradient-shaped; what is measurable is the cost of ABSENCE.
**#109.4 RULED (2026-08-01, the user: "A: 部分消费者先行") → ruling
#110: V4-P3-PARTIAL OPENS as a MEASUREMENT battery** — the v3 role
eye + three H-independent remedies: the generic IN-SUPPORT LAW
(consume only inside certified support; the 46% extrapolation
surface closes), the DELIVERY wide-occupancy S bit and the OFFSIDE
beyond-line S bit (#99.2 activated), both percept-honest and priced
through a TARGETED re-census. Battery verdict form pre-declared
(#110.3): rest limb REPORTED as the measured residual (the A4
target); the other three limbs = cure gates; shape cure must not
regress; NO deployment claim. Options B (A4 assignment) and C
(absence census) banked as likely next. **P3-PARTIAL PRE-REGISTERED (`a62f7ba`; verify 5/5) → review #111
PASS with the explicit VISION audit (user-prompted; the two S bits
are VISION-NAMED eye inputs; the public-whistle phase read ratified;
zero amendments)**: disjoint-scope rule, augment-merge +
X-MERGE-IDENT, the R3v3 attribution arm, seed bands
10.4/10.5/10.6M all ratified. **P3p-0 BUILT AND PROVEN DORMANT (`3ce528f`; verify 5/5; #75 gate
check exhaustive; vitest 929 green; fingerprint EXACT; real
double-build byte-compare identical) → ruling #112: deviations
ratified, two items carried into P3p-1's checklist (the widthHeld
genuine-0 proxy decision rule; the OFFSIDE_EPS=0.2 re-assert).
**P3p-1 RAN AND CLOSED (#113 prereg → #114 build, the
perceivedSnapshot mutation caught → #115 smoke: proxy fired STRICT,
knee re-pinned N=480 → census: ALL GATES GREEN, 323 children
merged, the merged table `39662445…` banked; write-up `bd6ad73`
verify 4/4) → ruling #116.** ⚠ THE OFFSIDE INVERSION (measured
caution): given the beyond-line distinction the short-horizon axis
PREFERS beyond-line runs (Δ +0.049) — the offside cost is the
H-shaped long tail; the #99.2 S-fallback premise measured FALSE at
this estimand. Disposition: the bit stays (the battery
adjudicates); **P3p-3 gains an R3p-noOffside decomposition arm
(#116.2(ii))**; pre-named home: a failed cure sends offside to the
A4/absence family. Delivery bit direction banked (−0.048
behind/level when width held; 60.7% UNKNOWN under strict —
partial lever). **P3p-2 PRE-REGISTERED (`4c49b01`) → review #117: the machine-verify
BLOCKED on a seed collision from the COMMANDER'S OWN BRIEF (owned;
the pipeline caught it at every station) → resolved by MOVING P3p-2
to 11.0M/11.1M (the battery's ratified 10.6–10.9M reservation
untouched); everything else ratified (fallback order, control not
bit-split, prune rule, DEV 0.22 re-confirm, readings A–D).

Earlier (2026-07-28, #44 ruled): ⛔ Stage III P2's double FAIL ACCEPTED
as written — Stage III v1 is CLOSED, rejected on deployment grounds (#44.3);
NO payoff re-run; the pre-named pile-up lever (anticipatory density, §4.5.6)
is LIVE and constrains the successor (#44.4); Stage III v2 direction memo =
commander's, parked for the user's morning ratification (#45.2(c)).
→ [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) §6.5 (P2-A SHA
`d4de82bc…4945`, P2-B SHA `795ab346…6b77`, both twice byte-identical, HEAD
`ae6e49c`, fingerprint unchanged, nothing shipped).

**Doc split (#45.2(0), 2026-07-28):** this `PROGRAMME.md` is the operational entry; all commander rulings now live verbatim in [`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md), and the moved track-table histories in [`PROGRAMME-LOG.md`](PROGRAMME-LOG.md).

* ⛔ **P2-A = reading (d), UNDELIVERED**: DEV **18.47%** against the frozen 22%
  floor. Every other gate passes — clone 12,000/12,000 · X5 480/0 · **X6
  unexplained 0 across 7.08 M ticks** · determinism · **PC resolves
  (−0.0136 [−0.0211, −0.0060])**, so the budget could see this family. By §7 the
  payoff numbers are published labelled and NOT interpreted (NEUTRAL ATE
  +0.00095 [−0.0041, +0.0059]; realised half-width **0.005**, inside the
  pre-registered 0.009 MDE).
* ⭐⭐⭐ **The decision classes say the CHOOSER is fine and the GATE's
  denominator is not**: deviation among decisions that had a priceable context
  is **42.5%** against the table's ex-ante **44.4%**, and the oracle-context arm
  lands at **44.7%** — on the prediction to within a fifth of a point. DEV's
  denominator counts the 56.6% of windows with no cell at all (the ball in
  flight has no owner, so no context exists). Disclosed as item 6 BEFORE the run
  and the floor left exactly as frozen, so the FAIL stands as written.
* ⚠️ **One real delivery defect, owned**: 20.5% of decisions had **no percept
  memory yet** — it is created at a body's own AI tick and the fork's first eye
  decision often precedes it, so the very window the census priced is the one
  most likely to abstain.
* ⛔ **P2-B = reading (h), the queue stops whatever P2-A says**: **C-OFFSIDE
  FIRES** (2.79 → 3.31 per match, **+18.7%** [+0.35, +0.69] vs a +10% band) ·
  **DEGEN-PILEUP FIRES** (spacing under 4 m **9.5% → 17.4%, +84%**) ·
  **DEGEN-RESTDEF FIRES** (designated slot **66.9% → 52.2%**). Quiet: the box
  canary — and it moves the OTHER way (**+19.5%** attackers in the box at cross
  arrival, so revert 1's failure mode is absent) — and the scramble limb (+7.9%
  vs a +25% band). R0 reproduces the shipped world 800/800.
* ⭐⭐ **The strongest thing the run produced is a substrate law**: positional
  value measured ONE BODY AT A TIME does not compose. Each body prices his
  approach against a table censused while the other eleven held the incumbent
  shape; deployed together they converge — spacing −2.33 m, duplicate runs
  55.5% → 70.4%, rest defence 1.32 → 0.98 bodies, restart ticks **+20.8%**
  (pin 3's warning, live). VISION's one-metre shape delta is **tripled**
  (0.85 → 2.56 m) — the faces do price differently — but bought with all of the
  above. The only payoff interval excluding zero has the wrong sign: at the
  one-team rung **goals −0.339 [−0.484, −0.190]**.
* **Banked**: the chooser works and the percept is honest (context agreement
  **95.6%**, face 99.8%); the 180° ring is **25.9%** of everything the eye
  chooses — a quarter of its behaviour is a seat the incumbent cannot express;
  clamp composition's biggest cell is `r7a0|onside`, not r21a0, and on these
  numbers #43.3's removed floor would have passed anyway (recorded so the
  amendment is not credited with a rescue it did not perform).

Earlier (2026-07-27, #42.3 executed): 📝 **Stage III P2 was DRAFTED AND
FROZEN** — the dormant eye that consumes the P1R table under #41.2's meaning and
no other** → [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) (contract
only; zero `src/**`, nothing implemented, nothing run). ✅ **REVIEWED AND
AUTHORIZED by ruling #43 (2026-07-28)** — §4.5 compliance PASS, the ex-ante
prediction reproduced to the digit by independent recomputation, and **ONE
pre-run amendment required before implementation (#43.3): X6 splits — the
per-record fidelity predicate stays HARD, the 0.84 ok-share floor and clamp
shares become REPORTED per-candidate × per-context** (the floor was derived on
P1R's uniform forced mix; the eye's argmax mix concentrates 54.9% on r21a0,
and pin 1 already declares clamp rewrites counted-not-failures). The executor
applies the amendment, then implements and runs P2-A and P2-B. Nothing else
moves.

* **The central hypothesis is #42.3's, pre-named and unmoved**: a
  context-reading, percept-honest chooser over the SAME lattice recovers the
  40-cell conditional payoff every fixed policy loses.
* **Two halves, two instruments.** **P2-A** tests the payoff at the census's own
  unit — paired same-seed forks, five arms (control · neutral · gene-mapped ·
  oracle-context · **inverted argmin as the positive control**) — and **P2-B**
  tests deployment safety at match level across the adoption ladder (one body →
  one team → both teams) on P0's seven instruments with both reverts' canaries
  HARD.
* ⭐ **The methodological spine is OUT-OF-SAMPLE.** The 40 cells were selected
  on P1R's own sample, so P2-A runs on a disjoint seed block (2,000,000+) and
  the contract predicts shrinkage in advance rather than explaining it
  afterwards. Ex ante from the committed table: **44.4% of moments deviate**,
  in-sample ATE **+0.0207**; at 12,000 moments the paired MDE is **≤0.009**, so
  the run resolves H-COND if ≥44% of the in-sample advantage survives. FLAT is
  registered as a **negative verdict**, not a request for budget.
* **P1's ghost is a gate this time**: `DEV` — the eye must actually deviate on
  ≥22% of decisions or **no payoff reading is available**, with the decision
  classes (abstain-unseen / no-cell / tie / non-station) decomposing exactly why.
* **§4.5's eleven items carried verbatim**, plus the three #42.2 handover facts
  as design INPUTS (direction dominates 3× → the deviation mix by angle/radius
  is instrumented; the 180° ring's share is a reported emergence claim).
* **Registered exposure, in advance**: the committed table carries no per-cell
  CI, so the chooser cannot condition on cell precision beyond the 150 floor —
  that is the winner's-curse exposure, and the disjoint block is the test of it.

Earlier (2026-07-27, #41 executed): ✅ **Stage III P1R RAN and PASSES every
gate — the approach table is a SHIPPING TABLE** →
[`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md) §5 (SHA
`2c93d5b2…a964`, table SHA `59a3f72e…6e12d`, 6,000 moments / 114,000 forks,
twice byte-identical; fingerprint unchanged; nothing shipped). Nothing in
flight — returned for P2's scoping.

* ✅ **Every gate**: clone coverage 6,000/6,000 · X5 240 checked / **0
  mismatched** · X6 **unexplained 0** with ok **91.7%** against the derived 84%
  floor · **PC resolved in BOTH faces** (−0.0396 [−0.0546, −0.0259]) · SAT
  inside ±0.05 ⇒ SHIPPING TABLE · determinism. The population filter behaved as
  sized: **14.03%** ball-directed moments excluded.
* **Pooled = reading (c), and unlike P1 that reading is AVAILABLE**: all 18
  candidates resolve negative (−0.024 … −0.076). **The incumbent's station
  function beats every fixed ball-relative approach direction on the lattice**
  — a strong result for something billed as a hand-tuned interim, and the first
  time it has been tested on a measurement that could have gone either way.
* ⭐⭐⭐ **DIRECTION DOMINATES DISTANCE, ~3×.** Angle spread **2.9pp**
  (0° −0.0311 and 180° −0.0346 cheapest; 60° −0.0599 dearest) against a radius
  spread of **0.9pp** (7 m −0.0447 · 14 m −0.0441 · 21 m −0.0536). **Which way
  a body commits its window matters about three times as much as how far.**
  Undesigned — the lattice was built to cover named seats, not to test an axis.
* ⭐⭐ **Conditionally it is reading (a): 40 of 216 cells BEAT their control**,
  none under-powered, and the structure is legible — **deep in our own third a
  long FORWARD approach pays** (`ours|ownThird|crowded` r21a0 **+0.0819**);
  **defending a crowded midfield a BACKWARD one pays** (`theirs|middle|crowded`
  r21a180 **+0.0545**). The pooled negative averages over contexts where the
  incumbent already does the right thing, so **it does not bound what a
  conditional chooser can do** — reading it as a ceiling would be the
  ecological fallacy in a table.
* ⭐ **The 180° ring pays where the incumbent cannot go.** `supportSpot` puts
  every supporter AHEAD of the ball at both `aheadBias` settings (P0 §1.4), so
  approach-from-behind is **inexpressible** in the incumbent — and it is one of
  the two cheapest directions pooled and positive in two contexts. Measured
  support for §3.3's drop-to-receive claim.
* ⚠️ **Honest notes on passes**: PC resolved but is only **5th of 18** — its
  premise ("21 m behind the ball is obviously bad") is **wrong**, since
  backward beats diagonal, so the instrument is weaker than its pass suggests.
  SAT's four gaps are all **positive** (0.017–0.047): under saturation the cost
  SHRINKS, so the unilateral table is conservative — but `r7a180` sits close to
  the band edge and the next census should not assume the margin. X6's derived
  floor was the right repair: ok landed at 91.7% against the 91.9% the clamp
  measurement predicted, and **P1's 99% floor would have failed this run too**.
* **Mediators describe rather than gate**, as #41.3 ruled: occupancy 0.9–19%,
  ETA 2.1–2.9 s of a 3 s window, target error 10–28 m. **A cell can carry
  positive value at ~2% occupancy** — value bought purely by moving, which is
  exactly the object the re-founded estimand said the world contains.
* **For P2, three things it should not have to rediscover**: direction
  dominates distance ~3×; the payoff is conditional and the pooled sign is not
  the eye's ceiling; the behind-the-ball ring is cheap, positive in two
  contexts, and inexpressible in the incumbent.

Earlier (2026-07-27, #40 executed): ⏸ P1R was NOT FROZEN — the pre-freeze
sizing says the scoped repair still does not deliver the treatment** →
[`STAGE3-P1R-PREFREEZE-SIZING.md`](STAGE3-P1R-PREFREEZE-SIZING.md) (read-only,
zero `src/**`, 400 moments, block 970,000). **The fork is back with the
commander**; nothing in flight.

* **#40.4's ex-ante requirement, measured.** Body→target distance
  **p50 19.68 m / p90 35.21 m**, i.e. **p50 2.66 s / p90 4.77 s** of travel.
  P1's W = 2.0 s covered roughly the bottom third — the diagnosis was right and
  this is its size.
* ⛔ **But no (W, margin) in the grid delivers a treatment.** Best cell
  W = 3 s, margin 0.4: occupancy **16.3% mean / 5.6% median**, and it cuts the
  lattice to **2.7 of 18** candidates — no longer a census of a lattice.
  W = 4 s at full margin gives 9.8% mean. Tightening trades coverage for
  occupancy at a rate that never crosses.
* ⭐⭐⭐ **Why, and it is a SUBSTRATE fact**: the target **moves with the ball**
  while the body runs to it. A station is ball-relative by definition, so a
  body crossing 20 m at ~7 m·s⁻¹ chases a point often travelling faster than he
  is. **This closes on P0's I2 from the other side** — the incumbent's own
  station target drifts 2.571 m/s median and exceeds 4 m/s on 27.35% of ticks.
  **Stations in this engine are not occupied; they are perpetually approached**,
  `emergentStation` included. ⚠️ This does NOT refute Stage III's premise — it
  says the CENSUS CELL as defined describes something the world does not
  contain.
* **I did not freeze P1R.** #29.5 makes deliverability a freeze-time
  obligation; freezing a census I already know is undelivered would be the
  "disclosed it and ran anyway" failure the ruling was codified from (C5 T1's
  H1). The round stops at the measurement.
* **Settled cheaply and banked**: the station-family filter is unambiguous —
  **16.8%** of sampled moments are ball-directed jobs (matching P0's 19.4% of
  body-ticks), #40.4 item 2 done; and the clamp share under that population is
  **8.08%** of live ticks, so **X6's floor must be derived against ~8%** — P1's
  99% floor would fail again on a perfectly faithful seam.
* **The fork (commander's, not mine)**: the census needs an estimand the world
  can deliver. Four shapes exist in already-banked material — price the
  **direction** rather than the point (occupancy becomes the mediator it
  already is) · **lead** the target as `runBurstPoint` and the C4 meet point
  already do · **body-anchored** candidates (reachable by construction, but no
  longer a policy the eye can express) · or **accept approach as the
  treatment** and read the table as the value of moving toward a region, which
  is what P1 actually measured. Each is a different claim about what a station
  IS — a design question, not an executor's call.

Earlier (2026-07-27, #39 executed): ⛔ Stage III P1 RAN and FAILS on X6
— and ⭐⭐⭐ the MEDIATORS say the treatment was never delivered** →
[`STAGE3-P1-STATION-CENSUS.md`](STAGE3-P1-STATION-CENSUS.md) §7 (SHA
`92edc587…ff80`, table SHA `d9923b17…cd8f`, 6,000 moments / 114,000 forks,
twice byte-identical; fingerprint `57b0bdab…c673` unchanged; nothing shipped).
Nothing in flight.

* ⭐⭐⭐ **The bodies never arrived.** Occupancy **0.8–5.3%** of W within 2 m of
  the target; ETA **1.75–1.97 s** against a 2.0 s window. §4.4's mediators
  exist so *bad location* can never be confused with *failed to arrive*, and
  they just earned their place: **this census measured two seconds of walking,
  not two seconds of standing.**
* **The cause is a derivation error in §2.4, mine.** W was derived as "travel
  time to the ring" (`14 m ÷ 7 m·s⁻¹ ≈ 2 s`), which treats the ring radius as
  the distance the BODY must cover. The lattice is **ball-relative** — a body
  25 m from the ball asked to stand 14 m beyond it must cover ~35 m. The right
  quantity is `dist(body, ball+offset) ÷ speed`, which is a distribution W
  would have to dominate, not a constant.
* **All 18 candidates resolve, all NEGATIVE** (best `r7a180` −0.0220
  [−0.0359, −0.0081]; worst `r21a120` −0.0524). ⚠️ The naive reading — *the
  incumbent beats every station* — **is not available**, because no station was
  occupied. The honest estimand is: overriding an off-ball body's job with a
  ball-relative target he cannot reach in 2 s costs 2–5 pp of signed value, and
  costs more the farther the target. The monotone structure fits that and
  nothing subtler.
* ⚠️ **Second scope limit, also un-caught at freeze**: §3.4 required only an
  *off-ball outfielder*, not a body on a STATION family. P0 measured
  ball-directed actions at 19.4% of body-ticks, so ~1 moment in 5 forced a
  chaser/receiver/marker to abandon the ball. **C4 O2's lesson in full
  generality**, not carried across.
* ✅ **PC RESOLVED in both faces** (−0.0324 [−0.0463, −0.0184]) — §4.5.5's
  power obligation is discharged: the census could see an effect of this size.
  The failure is not power and not the harness. **X5's 240 checks reproduce
  the base bit-identically and X6's unexplained residual is exactly 0** across
  12.27 M classified live ticks.
* ⛔ **X6 fails on its 99% floor (92.68%), and it is the same defect family
  again.** The onside clamp fired 453,032 times and the barred-box clamp
  444,407 — 7.3% of live ticks. **P0 §1.3 warned in writing** that the onside
  clamp *"rewrites a station beyond the line rather than penalising it"*; I
  documented the pin and then set a floor assuming it almost never fires, on a
  lattice deliberately containing stations 21 m ahead of the ball. The floor
  **conflated "the seam is faithful" (passed decisively) with "the clamps
  rarely bite" (a property of the lattice)**. Consequence on the record:
  beyond-the-line candidates are censused **as-clamped**.
* **Reported**: 18 of 216 cells UNDER-POWERED (the two rarest contexts); 4,135
  forks excluded for ending inside the horizon, counted not zeroed;
  `reconstructionDiverged` 126,716 (1.0%). **SAT agrees within 0.002–0.024** —
  but that is agreement between two versions of a treatment **not delivered in
  either arm**, so it certifies nothing about a table that prices standing.
* **The table is committed as data with its SHA and must NOT be consumed by
  P2** as a station-value table: it prices displacement-in-transit, not
  occupancy. §8 forbids re-cutting W, the lattice, the contexts or the moment
  definition here; the two defects are named and the fix is the commander's to
  scope.

Earlier (2026-07-27, #39 executed): Stage III P1 was PRE-REGISTERED
and NOT RUN** → [`STAGE3-P1-STATION-CENSUS.md`](STAGE3-P1-STATION-CENSUS.md).
Drafted under the amended §4.5 constraint set; nothing in flight; the census
runs on the commander's word.

* **Seam = a POLICY, not a point** (§4.5.1): `forcedStationPolicy` carries a
  BALL-LOCAL `(dx, dy)` recomputed every tick, consumed at the executor's READ
  (#35.3) before the clamps — a station is a *relation to the ball*, and P0
  §1.1 is why a fixed point would price something the eye cannot express.
  Explicitly a DIFFERENT seam from C4 O2's `forcedStation`.
* ⚠️ **§5-P1's original harness gate is unimplementable and is replaced**:
  *"forcing the incumbent's own target reproduces the match"* needs a stored
  incumbent target, and P0 proved there is none. The identity arm is
  **NO-OVERRIDE** (seam armed and null ⇒ shipped world) and the real gate is
  **X5, the CONTROL fork reproducing the base bit-identically** per record.
* **Lattice**: 18 candidates + control, ball-local polar, `r ∈ {7, 14, 21}`
  bracketing P0's measured geometry (`supportSpot`'s 10–18 m band and the
  12.95 m median spacing) × 6 angles — the coarsest grid that can express
  回撤接应 / 内切 / 包抄 / 超载 / 强弱侧, and **180° is reachable at all**,
  which `supportSpot` cannot be (both `aheadBias` settings are positive).
* **W = 2.0 s, DERIVED as a new quantity** from P0's anchors (action clock
  0.15 · licence clock 0.40 · dwell mean 1.47 · 14 m ÷ 7 m·s⁻¹ ≈ 2.0): W must
  exceed the travel time to the ring being priced, or the census prices a
  station nobody reached. The far ring is knowingly under-covered and the
  **arrival mediators are the instrument that says so**, not a footnote.
* **Face-specific horizons** (§4.5.4): H_score 6.0 s, H_concede 10.0 s, one
  fork read at two points, the score face read once and never again (the C5 T1
  lesson). Outcome = **ANY shot each way, signed** — shots not goals, derived:
  at this per-cell budget a goal-based concede face would be almost all zeros
  and the signed axis would be attack-only, the exact tilt §4.5.4 forbids.
* **#24 attainability done ex ante and stated**: 216 cells × a 150 floor
  (SE ≤ 3pp) = 32,400 forks; 6,000 moments × 19 = 114,000 forks ≈ **68 M ticks,
  the largest single measurement in the programme**. Per-cell n is published
  for all 216 and an under-filled cell is labelled **UNDER-POWERED**, never
  pooled away.
* ⭐ **The POSITIVE CONTROL is a power GATE, not a hope** (§4.5.5): the
  `(21 m, 180°)` candidate must price below the control in every face, CI
  upper bound < 0. **If it does not resolve, the budget was wrong and no
  shipping table is published.** C4 O2 is cited as banked supporting evidence
  that this executor path resolves displacement effects — not as a substitute.
* **SAT, the saturation-gap arm** (§4.5.2): the same relative policy applied
  to ALL own outfielders on a pre-registered subset. **The table is labelled
  DESIGN-CALIBRATION ONLY unless SAT lands within ±0.05** — #26.5's population
  law made concrete rather than assumed.
* **Mediators mandatory** (ETA / target-error / occupancy-time): *bad location
  ≠ failed to arrive*, and without them the table cannot tell P2 which it
  measured. **Side-split always** (P0's I4 found the scramble symmetric).
  **The gene mapping is frozen HERE** so P2's ablation cannot be a post-hoc
  fit, and it holds a neutral genome at exactly the unweighted signed axis.
* **#38.1's boilerplate is in**: eight standing exception classes including
  **E-PAUSED**, and §6 lays out the full sign space — gradient / **flat** /
  noise / gradient-but-SAT-fails. Flat is written as a real result: it would
  say the positioning seat is not where the value is, and send the budget to
  perception instead.

Earlier (2026-07-27, #36.3 executed): BOTH C4 oracles RAN.
⭐⭐⭐ O1 = LEVER · ⛔ O2 = GATES FAIL on X6, with a large RESOLVED HARM** →
[`C4-O1-FLIGHT-FORK.md`](C4-O1-FLIGHT-FORK.md) §7 (SHA `dc29a408…fce3`,
5,404 crosses / 10,808 forks) and
[`C4-O2-SECOND-BODY-FORK.md`](C4-O2-SECOND-BODY-FORK.md) §7 (SHA
`f5a69e49…b2ff`, 5,418 crosses / 10,836 forks). Both twice byte-identical,
both **clone coverage 100%** and **harness identity 0 mismatched**, fingerprint
`57b0bdab…c673` unchanged, nothing shipped, both seams null in production.
**Stage III P1 still HOLDS** pending the contract revision. Nothing in flight.

* ⭐⭐⭐ **O1 = LEVER, and the bands separate 43×.** Contests **+12.36pp**
  CI [10.79, 14.04] on deliveries the unforced law leaves SHORT of the header
  band, against **+0.25pp** CI [0.08, 0.46] on the LONG ones it already lifts
  (SHORT/FULL +7.29, LONG/FULL +0.17; pooled +4.18pp). **The 14.454 m boundary
  was derived from `peak = g·T²/8` before any data existed and the world
  agreed with it** — nothing fitted. ⇒ **T1-FLIGHT's blanket floor was doing
  almost all of its work on a third of crosses** (SHORT = 33.4%); the other
  two thirds paid the mandate and got nothing measurable.
* ⭐⭐ **The withdrawn goal claim RETURNS under a compliant estimand.** ANY
  goal in a fixed 4.0 s horizon, censoring impossible inside a fork:
  **−1.65pp CI [−2.16, −1.13]**, resolved. Scope stated precisely — this
  re-establishes that *forcing one delivery to loft* lowers the 4-second goal
  chance; **T1-FLIGHT's match-wide policy claim stays withdrawn** (#36.1). And
  the trade is concentrated: SHORT/THIN is +12.36pp of contests **and**
  −5.27pp of goals. Where lofting buys the most aerial football it costs the
  most goals — Q5's ceiling doing its job.
* O1's contest gain is **75% defensive** (C3atk +1.05 vs C3def +3.13), against
  T1-FLIGHT's 71% under a mandate: the asymmetry is a property of the
  substrate, reproduced by a cleaner design. **C4's closure is NOT certified
  on O1 — it re-opens as a SELECTION question**, and selecting needs something
  that reads pre-kick context, which is Stage III's shape.
* ⛔ **O2 fails X6 on the class ruling #36.1 had already named.** All **33**
  unexplained records reproduce as `phase: 'halftime'` — the paused world, the
  exact class the ruling created after T2's F2 hit it, and I did not put it in
  O2's four exception classes. Every other class came back **empty** and the
  force bit on **222,171 of 222,204** live ticks (99.985%).
* ⛔⛔ **O2's measurement is a large RESOLVED HARM, and the frozen rule
  understates it.** C3atk **27.51% → 18.90% = −8.61pp** CI [−9.62, −7.64];
  C3def **+8.06pp**; shots −8.22pp. The duel does not vanish, **it changes
  hands** — and the mechanism is measured: the nearest ATTACKER ends up
  **farther** from the ball (median 1.943 → 2.367 m). The rule returns
  UNRESOLVED because I wrote a two-sided question with one-sided branches
  (LEVER = helps, NO LEVER = does nothing, *hurts* falls through). **My
  rule-design gap; reported as the rule says, not re-cut.**
* ⭐⭐⭐ **O2's primary and its H3 subgroup disagree in SIGN — the
  pre-registered contingency, live.** All eligible crosses **−8.61pp**;
  control-arm-H3 crosses **+7.28pp** CI [+5.38, +9.28]. §4.3 demoted H3 from
  primary BEFORE the run on the regression-to-the-mean argument and said in
  advance that a disagreement is itself the finding. **Had #36.3(ii)'s literal
  "at H3 crosses" been the headline, O2 would have reported +7.28pp and
  re-opened C4 on a selection artefact.**
* **What O2 does and does not establish**, stated: it supports #34.3's
  doctrine BY MEASUREMENT — overriding an already-licensed body's routing with
  a scripted meet point costs more than it buys — but it cannot separate *"a
  second body does not help"* from *"overriding a chaser hurts"* (eligibility
  is read once at the kick; `team.chasers` refreshes every 0.4 s), and the
  corner machinery's 2.5 m meet point looks like the wrong place to stand for
  an open-play delivery (`minOutfieldDistInBand` barely moves, 1.478 → 1.474).
  A second body was available on **94.1%** of crosses, so the branch was never
  closed by arithmetic.

Earlier (2026-07-27, #36 executed): BOTH C4 compliant oracles were
PRE-REGISTERED and NOT RUN** → [`C4-O1-FLIGHT-FORK.md`](C4-O1-FLIGHT-FORK.md)
and [`C4-O2-SECOND-BODY-FORK.md`](C4-O2-SECOND-BODY-FORK.md). Gap work, per
#36.3; **Stage III P1 continues to HOLD** pending the commander's contract
revision (#36.4). Nothing is in flight.

* **O1 — the per-cross flight fork** (audit finding 8). Seam
  `forcedCrossProfile`, read at exactly one place (`mechanics.ts:564`'s
  `tMinCross`). At every real cross, two forks from the same pre-step clone —
  `'current'` vs `'lofted'` — so **both arms share the same delivery struck by
  the same body from the same world**, which is the direct answer to the
  post-treatment-selection objection (T1-FLIGHT's arms held 5,547/5,633/5,548
  *different* crosses). ⭐ **The deliverable is HETEROGENEITY, not a headline**:
  a frozen 2×2 of pre-kick context (distance **< / ≥ 14.454 m**, the DERIVED
  boundary at which the unforced law already clears the band, #31.4 × box
  occupancy 0–1 / ≥2), with a three-branch decision rule — **LEVER** (bands
  separate ⇒ the profile is selectable, C4 reopens), **FLAT** (every band
  inside ±2.32pp of pooled ⇒ blanket lofting was the honest summary, closure
  CERTIFIED BY MEASUREMENT), **UNRESOLVED** (anything else, read as neither —
  #20 forbids reading a straddling interval as "no effect").
* **O2 — the second-body station fork** (audit finding 14). Seam
  `forcedStation`, applied **before** the existing onside and barred-box clamps
  so the forced body gets no privilege the world does not have. Forces the
  already-licensed body closest to the landing who is **not** the registered
  receiver and **not** a chaser — i.e. genuinely *additional*, nobody new
  licensed. ⭐ This is the branch **#34.3 closed by DOCTRINE**; O2 does not
  challenge the doctrine, it converts the closure from doctrinal to measured.
  **A LEVER reading does NOT authorize shipping the choreography** — it
  authorizes re-opening, and hands Stage III a sized target instead of a
  hypothesis.
* **Both fix the three verified estimand defects at the source**: the horizon
  is fixed at 4.0 s and counts **ANY** goal (finding 10 — and inside a fork
  overlapping windows *cannot* occur, so this is a property of the design, not
  a patch); seed ranges are **disjoint per combination** so "cluster unit = the
  match seed" is exact (finding 15); and both decision rules are **interval
  tests**, not MDE arguments (finding 7 — the correction that re-read T2's D1
  as inconclusive-on-sign, applied in advance).
* **Both carry the harness gates the fork grammar requires**: clone coverage
  **100%** as a GATE rather than an assumption, and the control fork
  reproducing the base continuation **bit-identically** — a fork that cannot
  reproduce its own control is not a counterfactual. O2 adds a force-bites gate
  whose population is **explicitly conditioned on the body's action path**,
  which is precisely the defect T2's F2 had.
* ⚠️ **O2's H3 subgroup is REPORTED, not primary, and the reason is stated**:
  H3 is a post-delivery outcome, so selecting on the control arm's H3 induces
  regression to the mean in the treated arm. Primary is all crosses with an
  eligible second body; the two are read together and a disagreement is itself
  returned to the commander.
* O1 and O2 are **independent** — neither rescues nor blocks the other, either
  order. Both ship nothing; both seams stay null in every production path.

Earlier (2026-07-27, #34 executed): ✅ Stage III P0 is DONE — the
consumer map and the incumbent instrument baselines are banked** →
[`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) (read-only, zero
`src/**`; 300 random-genome matches on fresh block 930,000, 389,865 samples at
6 Hz, twice byte-identical, SHA `dc74fb02…813f`). Definitions and the
two-meanings sweep were committed BEFORE anything was measured (`ecad616`).
Nothing is in flight; per #34.4 the next step is P1's pre-registration.

* ⭐⭐⭐ **There is no station DECISION — there is a station FUNCTION at
  60 Hz.** Every producer (`formationSpot`/`emergentStation`/`supportSpot`/
  `runTarget`/the mark stance) is a pure function recomputed inside
  `executeAction` every tick; what runs on a clock is the ACTION (0.15 s) and
  the LICENCES (0.4 s). **So §4-Q5's commitment window W is a NEW quantity,
  not an inherited cadence** — P0 can only supply anchors, and does.
* ⭐⭐⭐ **I2: the incumbent has no commitment and a quarter of its motion is
  untrackable.** Station-target drift median **2.571 m/s**, p90 6.244,
  **27.35% above 4 m/s** — faster than the body chasing it — and a p99 of
  54 m/s, a 9 m jump inside one sample. Cause visible in code, not inferred:
  `hasBall` is an INPUT to `formationSpot`, so a possession flip re-evaluates
  the whole block in one tick. The incumbent's apparent stability is slow
  inputs, not commitment.
* ⭐⭐ **I6: duplicate runs are the NORM, 54.71%** CI [52.96, 56.37] of
  multi-runner ticks have two run targets within 4 m — structural, since
  `runTarget` maps every runner to the same shoulder of the same line and then
  narrows them into the same lane. The survey's duplicate-run warning is not a
  risk the eye might introduce; it is the incumbent's steady state.
* ⭐⭐ **I7: the attack/defence shape delta is ONE METRE.** Centroid depth
  −0.774 in possession vs −1.760 out, delta **+0.987 m** CI [0.507, 1.446];
  spreadX +1.372; spreadY +0.740. VISION's 2026-07-27 anchor makes this
  difference an acceptance criterion — the bar is a stride.
* ⭐ **I4's split paid for itself immediately.** Own bodies within 5 m of the
  ball **0.956** vs opponent **0.952**; within 10 m 2.204 vs 2.197 — **the two
  sides are indistinguishable**. Pooled, this would have read "1.9 bodies
  within 5 m" and been filed as the 乱抢 residual. **E4 r2's scramble is
  SYMMETRIC**, which re-frames P3's H-SCRAMBLE before P1 starts.
* Also banked: I1 dwell median 0.667 s / mean 1.466 s, 43.98 family changes per
  body per minute, station families owning 77.4% of body-ticks (MARK 32.11%,
  FORMATION 29.04%); I3 spacing p10 4.188 m with **9.40% of pairs under 4 m**;
  I5 rest defence 1.328 bodies deep in possession but **the DESIGNATED slot is
  one of them only 65.82%** of the time.
* ⚠️ **Three consumers a naive replacement breaks**, mapped: the onside clamp
  **rewrites** a station beyond the line rather than penalising it (different
  from revert 2's blast, and must not be confused with it); the ZONAL scheme
  uses `formationSpot` as its marking lattice (`TeamBrain.ts:479`); and
  `shapeReady` makes the station a **restart gate**. Plus `supportSpot` calls
  `formationSpot` internally, so support geometry moves whether P1 intends it
  or not. **P1's harness gate must pre-register whether it forks the executor's
  READ or the FUNCTION** — they are not the same intervention.
* The two-meanings sweep split three of six instruments before measurement
  (station-switch → dwell + drift; ball convergence → per side; rest defence →
  any-body + designated-slot). All three splits changed a reading.

Earlier (2026-07-27, #33 executed): ⛔ C4 T2-ARRIVAL Phase A FAILS on
D1 and on F2 — the box stops emptying and it changes nothing** →
[`C4-T2-ARRIVAL.md`](C4-T2-ARRIVAL.md) §7 (Phase A SHA `fc66f1f6…c597`, twice
byte-identical, 5,745 / 5,637 / 5,632 crosses across three paired arms on
block 920,000; flags-off fingerprint `57b0bdab…c673` unchanged; 820/820 plus
7 new identity pins). #32.1's coupon-collector ban was codified first
(`3c61d68`). Nothing is in flight.

* ✅ **A0 PROCEEDED, and cleanly**: R3+R4 = **1.36%** CI [0.76, 2.02] against
  an 80% stop threshold — the nearest licensed body needs a median 3.35 m
  and has 7.95 m of budget over a 1.03 s flight, **4.86 m of slack**. The
  target replicated on a block it was never measured on (H3 23.03% vs the
  banked 22.90%, median miss 2.32 vs 2.39 m, C3atk 25.50% vs 25.17%). The
  arrival gap is a ROUTING failure, not a reachability one.
* ✅ **F1 — the defect is real and the fix closes it.** Licensed bodies still
  on `MakeRun` when the ball enters the header band: **58.66% → 93.53% (A1)
  → 93.17% (A2)**. §2.2's reading of `PlayerBrain.ts:1144` was right, and
  right about the size: **the box empties on 41% of crosses**, and the
  licence takes that to 7%.
* ⛔ **D1 FAILS, and it is a RESOLVED ABSENCE, not noise.** C3atk
  **25.50% → 25.91% = +0.41pp, CI [−0.65, +1.46]** — the interval straddles
  zero, but its UPPER bound sits below the pre-registered 2.32pp MDE and far
  below the expected +5.7pp. The gate had the power it claimed. **Reading
  (b).** Mediators agree three ways: H3 **flat** (+0.14pp CI [−0.95, 1.16]),
  min attacker distance in band **+0.069 m — the wrong way** (CI [−0.004,
  0.133]), bodies-in-box at band entry **+0.027 resolved** (CI [0.002,
  0.054]). **They stayed, and they arrived no nearer the ball.**
* ⭐⭐⭐ **WHY, and this is the finding: the closest licensed body was
  already going.** Across 66,469 live-licence ticks the new branch fired on
  **45.6%** and had **nothing to add on 54.4%** — because the closest
  licensed body was already the registered receiver (**83%** of that bucket,
  carrying the identical `landing − flightDir·2.5` re-route since Phase 63)
  or already a chaser routing through `interceptBall` to the same landing
  (**17%**). §2.1 established *that* the receiver had the re-route; it never
  asked *how often the receiver IS the closest licensed body*.
* ⚠️ **The pre-registered backfire HAPPENED.** Licence survival ALONE (A1):
  C3atk **−0.75pp CI [−1.77, +0.29]** — §4.8 named it in advance (the
  arriver's 16 m arc target points AWAY from the landing, so holding him on
  it through the flight is worse than letting him go home). The re-route rung
  recovers it to about zero: **the two halves roughly cancel.**
* ⛔ **F2 FAILS — my gate, the third time in this family, and two distinct
  freeze-time defects.** (i) The population was mis-specified: F2 predicted a
  fire for the closest licensed body without conditioning on his ACTION, when
  the branch lives inside `case 'MakeRun'` — the 36,121 `noTrace` records are
  the gate asking a question the mechanism was never going to answer yes to.
  (ii) The 72 `unexplained` reproduce in **one cell on one seed**, every one
  at `phase: 'halftime'` with the ball state frozen to the last digit: at
  half-time `Match.step` returns before `simTime += dt`, so nothing executes
  and the probe compares a fresh expectation against a **stale trace** held
  across the pause. 1.57 cm, one match, a paused world — not a fidelity
  failure. E1/E2/E3 and corner-precedence all came back **exactly empty** as
  §4.3b predicted; both classes I actually needed were ones I did not name.
  **#32.1 banned the coupon-collector form and I replaced it with a
  per-record form whose population was wrong** — a different error in the
  same family.
* ✅ I2 bounded (+0.19pp CI [−0.47, 0.83], "did not rise beyond resolution");
  shots flat. ⚠️ The **offside canary passes but resolves POSITIVE**:
  both-team offsides 2.4494 → 2.5150/match, CI [+0.013, +0.117] — a fifth of
  the 0.29 band, and **not** the attacking side (attacking-only +0.023,
  CI [−0.010, +0.057], inconclusive).
* **Nothing shipped**: both flags default OFF, `src` committed and dormant
  (the E1b precedent). §8 forbids re-posing the mechanism in this session;
  the residual's location is reported, not proposed.

**Open, and the commander's:** dispose F2 (two freeze-time defects, one of
them the successor to the form #32.1 banned); rule what *"the box empties on
41% of crosses, we closed it, and nothing moved"* means for C4 v1 — the
defect was real, the fix works, and the deliverable did not follow; and
whether the residual (only one body is ever AIMED at the delivery, and 83% of
the time it is the one the engine already aimed) is a licensing question,
Q2's forbidden pre-kick half, or the end of v1. Phase B stays held per #32.3.
F9 render-only any time; R20 + Stage III P0 in gaps.

Earlier (2026-07-27, #32 executed): C4 T2-ARRIVAL PRE-REGISTERED.
⭐⭐ **The pre-registration turned up two code findings that changed the
mechanism, both surfaced for reversal before the run (#33 accepted both):**

* ⚠️ **One of #32.4's three authorized components ALREADY EXISTS.** The
  post-kick landing re-route has been in open play since Phase 63 —
  `actionExecutor.ts:159–166`, whose own comment calls it *"the 31.9 corner
  principle in open play"*: attack the descent 2.5 m upstream via the shared
  `ballLanding` projector. **It is granted to exactly ONE body — the
  registered pass target** (`pendingPass`, live 3.5 s, longer than any
  cross flight). So T2's mechanism is not *add a re-route* but **widen who
  is eligible for the one that already works**. Still Q2's safe half, still
  post-kick, still observable physics — but the contract's §2 premise was
  wrong and is corrected here rather than worked around.
* ⭐⭐⭐ **The real defect: the box EMPTIES during the flight.**
  `PlayerBrain.ts:1144` gates every licensed attacking run on
  `carrier ? carrier !== p : phase === 'restart' || crashLive`. A cross in
  open play clears `ball.owner`, the phase is `playing`, and `cornerCrash`
  is corner-only — so **every runner and the arriver lose `MakeRun` the
  instant the ball leaves the boot** and fall through to
  `MoveToFormationSpot`. Upstream, `assignRunners` clears `team.arriver`
  every tick and re-sets it only while the ball is in the wide channel,
  which a ball flying into the box has left. **This is Phase 31.9's bug,
  still present in open play** — the engine has already been patched for the
  identical shape twice (`team.cornerCrash`, and the overlap license at
  `TeamBrain.ts:114–117`, both with the reason in-comment). It explains H3
  exactly: for most of the ~1.1 s flight, every attacking body except the
  registered target is running **away from the box**.
* **Intervention, therefore** = the open-play analogue of `cornerCrash`, two
  nested default-OFF flags, crosses only: `c4Arrival` snapshots the
  ALREADY-licensed bodies at the kick and holds them for exactly
  `ballLanding(ball).t` (derived, not chosen; armed only when
  `cornerCrash === null` so corners can never be double-licensed);
  `c4ArrivalReroute` gives the closest of them the meet point that already
  works. **No new license, no new count, no new scorer, nothing pre-kick** —
  so revert 2's offside exposure is structurally bounded (the flag is judged
  at the kick; every body this stage moves starts after it), and the arc
  cutback channel is untouched.
* **Gates**: A0 reachability census FIRST (read-only; may stop the stage,
  may not re-tune it — STOP if `R3+R4 > 80%` of H3, derived from D1's MDE);
  X1–X6 incl. **X6 corners-untouched**; F1 license survival ≥90%; **F2 in
  #32.1's new per-record-with-named-exception-classes form, applied to my
  own gate the same day the ban was codified**; **D1 = C3atk rises** (MDE
  2.32pp vs an expected ≈+5.7pp) with M1–M3 mediators; I2 HARD in #31.2's
  interval form; **the offside canary HARD at +0.29/match = ¼ of revert 2's
  measured blast, its SD MEASURED in a pre-freeze smoke (2.4861/match,
  SD 1.8298, over-dispersion 1.35 — a Poisson assumption would have been
  16% optimistic) rather than assumed**, per #29.5.
* ⚠️ **The one interpretive call**: the defence gets no equivalent re-route.
  Defensible because the defending landing-chase already **excludes box
  landings** by measured design (`TeamBrain.ts:391–418`, 0.77 goals/match)
  and the defence took 71% of T1-FLIGHT's new contests unaided — but unlike
  T1-FLIGHT §2.4 I do **not** run the alternative as an arm, because it is
  outside #32.4's scope. Registered for the commander.
* Phase B is **not this stage's** (#32.3): the live battery runs once on the
  flight+arrival PAIR, its own pre-registration.

Earlier (2026-07-27, #30.3 + #31 executed): ⛔ C4 T1-FLIGHT Phase A
FAILS on F2 — my own instrument gate, on ONE cross of 5,547 — while everything
the stage exists to measure landed** → [`C4-T1-FLIGHT.md`](C4-T1-FLIGHT.md) §7
(SHA `7a1afab2…5075`, twice byte-identical, 5,547 / 5,633 / 5,548 crosses across
three arms on block 900,000; flags-off fingerprint `57b0bdab…c673` unchanged;
820/820 green).

* ⛔ **F2 fired on 1 cross of 5,547; the other 5,546 are exactly 0.** The
  offender's measured peak (2.661 m) sits 1.02 m ABOVE the apex its launch
  implies — diagnosed read-only as a delivery **re-struck by the same player
  inside its own window**, so `lastTouch` never changes and the `maxZ` guard
  never trips. **A max-statistic over thousands of records at a 1e-3 tolerance
  is a coupon-collector gate**: it asks that no single record anywhere be
  pathological, which is not the claim "the arithmetic reached the world". My
  gate-design defect, the SECOND instrument fire in this stage, and **not
  re-scoped after sight**.
* ✅ **The mechanism works.** Launch-apex headable **74.02% → 100.00%**, apex
  1.871 → 1.964 m, and **H0 height-preempted collapses 54.76% → 1.62%** of C2.
  The ball gets up.
* ⭐⭐⭐ **The payoff is real and it goes to the DEFENCE.** Contests
  **57.36% → 60.78% = +3.42pp**, CI [2.14, 4.69], clearing the pre-registered
  2.7pp MDE — but split C3atk +0.98pp vs **C3def +2.44pp**, so **71% of the new
  contests are defensive**. Nobody designed that; it falls out of giving both
  sides the same extra hang time, which §2.3 registered in advance as an honest
  symmetric cost.
* ⭐⭐ **Conversion moved the OTHER way, resolved**: goals **10.76% → 8.72%,
  −2.05pp CI [−2.82, −1.35]**; shots −1.19pp. I2's ceiling is respected with
  enormous room, and per #31.2's clause the point is reported beside the
  verdict — this is a **resolved DECREASE**, not "did not rise beyond
  resolution". Honest flight makes crossing produce **more aerial football and
  fewer goals**.
* ⭐⭐ **T0R §7.4's partition question is ANSWERED, against the flight.**
  H3 as a share of ALL crosses **11.74% → 22.90%** — it nearly DOUBLED — with
  its median nearest man **2.08 → 2.39 m** and within-2 m falling 47.0% → 33.0%.
  **Fixing the height did not shrink the arrival problem; it enlarged it.** The
  half-metre of arrival is now the whole remaining story, and T2-ARRIVAL's
  target is sized here at 22.90% of all crosses.
* ✅ **§2.4's fork cost nothing, measured**: the stale-lead arm is
  indistinguishable on the deliverable (contests 60.71% vs 60.78%, goals 9.19%
  vs 8.72%). #31.1's call was right and free.
* Reported: C0 10.76% → 11.68% (a longer flight is a longer window to be cut
  out — the change does cost something); C1 4.98% → 3.46%; C2 26.90% → 24.07%;
  the pre-existing not-a-launch-at-capture caveat is flag-independent as
  predicted (150/167/173 per arm); F2's clean-flight slice is only 3.5% of
  crosses, itself a scoping fact.

**Phase B did NOT run.** Its condition (X-series + D1) is met in substance, but
§8 stops a failed stage before the expensive half; running an 8-season
calibrate off a FAIL would be the improvisation the discipline forbids.
Nothing shipped — `c4Flight` default OFF, `src` committed and dormant (the E1b
precedent).

**Open, and the commander's:** dispose F2 (re-pose as a share-based or
per-record gate with the re-strike case named, or accept the stage on F1's
launch-side evidence); rule what a **71%-defensive, goal-reducing** contest
gain means for C4 v1 — the deliverable was CONTESTS, never goals, and it was
delivered; and whether T2-ARRIVAL now becomes the seat on its freshly doubled
22.90% target. C5's live half stays parked (#29.3). Nothing is in flight.
F9 render-only any time; R20 + Stage III P0 in gaps.

Earlier (ruling #30 issued): the executor PRE-REGISTERS C4
T1-FLIGHT next** — the ball gets up, aim untouched (design contract §5.5
amendment); the T0b ladder re-runs inside T1-FLIGHT's audit (partition≠causal,
answered by measurement); T2-ARRIVAL on the residual only; **I2 re-named with
cause to the T0R reference (10.48/11.94%, #20 CI semantics)**. The commander
drafts the C6 design contract on the received map in parallel (#29.3: C6 feeds
the C5 re-census). Stage III P0 + R20 in gaps; F9 any time. Earlier:

**(2026-07-27, #28.4 + #29.4 executed): ✅ C4 T0R+T0b PASSES every
gate, and §6's frozen rule returns HEIGHT-DOMINATED** →
[`C4-T0R-T0B.md`](C4-T0R-T0B.md) §7 (SHA `55b2e4a8…7528`, twice byte-identical,
5,571 + 5,517 crosses over 5,390 matches, zero `src/**`, fingerprint unchanged).

* ✅ **T0R's budget model worked, which was its whole point.** Sizing to a
  common cross TARGET instead of a common match count put every combination at
  **911–967** build and **849–996** held-out; the cell that failed T0 at 296
  now returns 930 / 867, the smallest at **2.8×** the floor. The gate text
  never moved — only the matches behind it, which is the only thing #24 says
  was mine to move.
* ⭐ **The census REPLICATES on two never-seen blocks** (880k/890k vs T0's
  909k/870k): C0 10.05 / C1 6.00 / C2 26.21 / C3atk 25.13 / C3def 32.62 against
  T0's 10.90 / 5.70 / 27.95 / 24.71 / 30.74 — while the X4 pin reproduces the
  unmodified `cross-anatomy` exactly. Both instruments intact. S1 max **0.85pp**
  against a 3.5pp tolerance; S2 max 1.07pp against 7.0pp.
* ⭐⭐⭐ **T0b: the ladder explains C2 completely and the RESIDUAL IS ZERO.**
  H0 height-preempted **56.78%** [54.19, 59.36] · H1 keeper **0.00%** ·
  H2 taken-down-at-height **1.37%** · H3 no-contender-at-height **41.85%** ·
  **H4 residual 0 of 1,460** (2 of 1,445 held out). A ladder derived from
  `tryAerial`'s own gate order BEFORE any data accounts for every C2 cross but
  two — the strongest form of *the code says where the gradient lives first*.
  H1 being exactly zero is itself a finding: keeper claims all happen BEFORE
  arrival, so they sit in C0. ⚠️ H2 would have read zero without §3.2's pre-run
  contact-height fix (a class unfireable by construction, which #29.5 now
  forbids).
* ⭐⭐ **Both dominant rungs are MARGINS, not absences.** H0's deliveries peak
  at a median **1.00–1.06 m** — a third of a metre below the 1.35 m band floor,
  consistently, not marginally. In H3 the nearest outfielder's median distance
  while the ball was headable is **1.75–2.20 m**, p10 1.42–1.53 m, with
  **40–66% within 2 m** and 73–91% within 3 m. **Nobody is absent; everybody is
  close and nobody is close enough** — #28.3(ii) sharpened from "the box fills"
  to *the contest fails by about half a metre*.
* ⚠️ **Registered against over-reading it: H0 and H3 are a PARTITION, not a
  causal decomposition.** A low delivery also spends fewer ticks in the band and
  so has fewer chances to have anyone inside the radius; *"fix the height and H3
  shrinks too"* is a hypothesis this census cannot test.
* 🎯 **RE-AIM by §6's frozen rule: HEIGHT-DOMINATED** (H0's CI lower bound
  clears 0.50) ⇒ per #28.4b **the delivery's FLIGHT PROFILE becomes C4 v1's
  named seat, in its own contract, I2 binding hard**; the routing fix goes
  further back. ⚠️ **The verdict is archetype-dependent and the pooled number
  hides it**: H0 is 59–61% of C2 for the CROSS archetype but **46–54% for BAL**,
  whose deliveries do get up (76–84% headable) — close to contest-dominated by
  the same rule. Scoping the flight contract to cross-spam or to the delivery
  generally is a call §6 did not pre-register.
* ⚠️ **I2's ceiling now has two candidate pairs.** #28.5 named T0's build
  10.27% / held-out 10.73%; the fresh blocks give **10.48% / 11.94%**. A stage
  gating on non-increase needs one named number.

✅ **#29.5 CODIFIED** in [`../PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) §2:
power is a freeze-time obligation, a pre-run disclosure does not discharge it,
plus the corollary — a floor the population cannot supply is not a gate, it is
a reported quantity.

✅ **C6's Phase-0 code map DONE as gap work** →
[`C6-PHASE0-CODE-MAP.md`](C6-PHASE0-CODE-MAP.md): the de-glue already exists and
is gated to ONE regime by three different conditions, only one of which is about
close control (speed excludes the slow carry — defensible; space `>4.2 m`
excludes the pressured carry — the honest inversion; an action label excludes
the turn — bookkeeping). ⭐ **The turn is literally `Match.ts:1334`'s
assignment** — `ball.pos = owner.pos + heading·0.85` held through a 0.48 s
rate-capped 180° pivot, so 以自己为圆心连球带人一起转 is the implementation, not
an approximation — and it ALREADY costs 0.48 s, so a touch charge on top would
double-charge it. `performDribbleTouch` already prices 一步一带/爆趟 as one
continuous variable (VISION §1 honoured), `dribbleTouch` means the
ball-exists-between-touches substrate already exists for one regime, and
`tryTackles` keying on the BALL means C6 need not build an attack. Six open
questions in §7; #29.3 names C6 as a C5-unpark trigger, so C6 FEEDS the
re-census rather than waiting behind it.

**Open, and all the commander's:** draft the flight-profile contract (it must
resolve the partition-not-decomposition warning, the archetype split, and which
conversion pair I2 pins to); C5's live half stays parked per #29.3 with its
unpark condition pre-registered. **Nothing is in flight.** F9 render-only any
time; R20 + Stage III P0 in gaps.

Earlier (ruling #29 issued): C4 T0R+T0b IS THE ONE EXPERIMENT
IN FLIGHT** (authorized at #28.4, unblocked by T1's landing). **C5 T1's H1 FAIL
stands as fired; the measurement is BANKED as the BEFORE table** (waiting costs
−7.55/−12.77/−16.12pp, twin- and concession-confirmed; tempo baseline median
spell 0.33 s banked for the 1.1–1.2× anchor) — **T2 the WHETHER seat PARKS with
a pre-registered unpark condition** (re-census after any live enrichment, H1
re-powered; T2 drafts iff any hold cell's cost interval reaches zero); neither
adopt-as-priced nor T1R-now (the re-census subsumes T1R, the I2 precedent).
**C6's Phase-0 code map authorized as gap work** (an unpark lever, priced when
the fork arrives); Stage III P0 gap work per its ratified slot; F9 any time;
R20 in gaps. Gate lesson to codify in PROBE-CONTRACTS with the executor's next
commit: disclosed-as-under-powered at freeze time ⇒ re-power ex ante, never run
the known coin-flip. Earlier state below.

**(2026-07-27, ruling #28 issued): C5 T1 RUNS NEXT** (approved as
pre-registered — the decision-moment horizon origin is ratified); **C4 T0R+T0b
queues after T1 lands** (floor per-archetype + the C2 decomposition that
decides the v1 re-aim; T1-the-routing-fix demoted to a 5.70pp repair); Q1
amended (flight ≠ aim), I2's ceiling named (goal-within-window 10.27/10.73%,
ROADMAP's ≈5% retired from gate duty); **Stage III design contract MERGED**
([`STAGE3-POSITIONING-EYE.md`](STAGE3-POSITIONING-EYE.md), slot ratified by the
user: P0 = gap work now, P1–P4 behind C4 T3); F9 any time; R20 + P0 in gaps.
Earlier state below.

**(2026-07-27, #27.5 executed — both authorised items done, and the
queue is back at the commander).**

**(1) ⛔ C5 T1 RUN AND FAILED — but the measurement it exists for came back
resolved** → [`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md) §11 (SHA
`72c187aa…8e43`, twice byte-identical, 6,000 + 2,500 moments over 75 + 32
clusters, zero `src/**`, fingerprint unchanged; table committed at
`docs/world-model/data/c5-t1-waiting-census.json`, table SHA `7ea8152a…06e1`).

* ⛔ **H1 fired on the ACT-NOW arm alone, 2.99pp against a 2.0pp tolerance.**
  All three HOLD arms reproduce across disjoint blocks at 1.56 / **0.06** /
  0.87pp and all twelve gated pressure rows are inside H2's 5.0pp. §7.2b had
  disclosed this gate BEFORE the run as 2.1σ rather than ~3σ at the realised
  base rate, and it fired at ≈3.1σ — the edge where a mis-sized tolerance and a
  real block difference are indistinguishable by this design (32 held-out
  clusters, and "how shot-heavy a match is" is a cluster property). **Not
  relaxed after sight**; a T1R would re-power H1 off this run's own cluster
  variance and take more held-out clusters.
* ⭐⭐⭐ **Reading (a), resolved and monotone: waiting is expensive at both
  ends.** Paired per-moment cost **−7.55 / −12.77 / −16.12pp** at k = 30/60/90,
  every CI far from zero — ten times the resolution §7.1 worried about — with
  the concession twin **+1.45 / +2.63 / +3.55pp** on top. Marginal shot rates
  31.35% act-now → 23.80 / 18.58 / **15.23%**.
* ⭐⭐ **§8.3's twin closes the obvious defence.** Re-anchoring the window at
  the RELEASE still leaves **−6.53 / −10.20 / −12.40pp**: the ball is not
  better when it finally goes, it is just later.
* ⭐ **The consequence T2 needs before it is drafted: a chooser priced from
  this table would essentially never hold.** Registered honestly — part of the
  cost is mechanical by construction (a held tick is a tick removed from the
  same window, which §4 fixed the horizon to count rather than hide), so the
  claim is *"in THIS world a held tick is a spent tick and nothing pays it
  back"*, not *"patience has no value"*. **Q2 anticipated exactly this** and
  its answer stands: road B enriches the world and re-censuses (#26.5). This
  table is the before.
* By pressure at k=90: free −10.53 / mid −18.87 / pressed −16.77pp — the world
  only charges for time when there is someone to charge you, the same shape
  T0R found. Hold survives its own window 84.8 / 76.7 / 68.8%.
* ⭐ **§9's tempo baseline, the number the 1.1–1.2× anchor was waiting for:
  the median ownership spell in this game is 0.33 s and the mean is 0.68 s** —
  about four and a half decision ticks on the ball. Passes/min 28.34 legacy vs
  29.64 VALUE; one-touch share 19.4 / 19.6%; the two worlds are within 5% on
  every instrument, so the perceived brain is not what sets the tempo.
* ✅ X4 (seam inert, 3/3), X5 (bites, **100%**), C1/C2/C3 and determinism all
  pass. The ladder resolved 5 of 27 cells at cell level, 9 at (pressure ×
  stale), 13 at the pressure row — exactly what §5 said would happen, which is
  why no per-cell floor was gated.

Earlier, C5 T1 PRE-REGISTERED →
[`C5-T1-WAITING-CENSUS.md`](C5-T1-WAITING-CENSUS.md). Four paired arms off one
pre-step state (act-now vs hold-30/60/90), E5d's shot-within-240 axis so the
numbers are comparable to the committed attempt tables, concession twin beside
it. ⭐ **The load-bearing choice is made in advance: the horizon starts at the
DECISION MOMENT in every arm, not at the release** — a hold arm spends k of its
own ticks holding, which IS the price of waiting; a release origin would hand
the hold arms free time and manufacture the result Q2 forbids assuming (the
release-origin twin is reported beside it). The exchange rate is **REPORTED,
never gated**, with three exhaustive readings fixed now; what is gated is
instrument quality — seam inert when inactive / biting when active, coverage,
and held-out calibration at E5d's inherited tolerances. Floors are checked, not
performed: the pressure-row floor is derivable from T0R's banked band shares,
the joint 27-cell occupancy is NOT, so it gets a frozen ladder and a coverage
report rather than a floor I would have invented. Time-signature instruments
defined in §9 (the tempo census the 1.1–1.2× anchor has been waiting for).

**(2) ⛔ C4 T0 RUN AND FAILED** → [`C4-T0-ARRIVAL-CENSUS.md`](C4-T0-ARRIVAL-CENSUS.md)
§7 (SHA `21f42c3d…dd66`, twice byte-identical, 3,331 + 3,262 crosses, zero
`src/**`, fingerprint unchanged, 820/820). **Two independent routes return it to
the commander, and they agree.**

* ⛔ **Gate C1 fired: held-out BAL vs PRESS produced 296 crosses against a 300
  floor, short by four.** Mine, and the #24 family again — the floor came from
  E5h's league-wide 2.49 crosses/match, a rate describing neither archetype and
  least of all the quietest cell (a balanced side vs a press crosses 1.18/match).
  §5.2 had already recorded the margin collapsing 2.1× → 1.1× when the X4
  reference landed, and the floor was left frozen rather than tuned, which is
  what let it fire honestly. Not re-derived after sight.
* ⭐⭐⭐ **The headline, and it re-aims C4: `noAerial` was almost never "nobody
  there".** Pooled C0 **10.90%** / C1 **5.70%** / C2 **27.95%** / C3atk 24.71% /
  C3def 30.74% — the conflated 43.6% is **one part in eight** nobody-there. That
  is pre-laid reading (b): bodies ARE arriving and not heading. Q6's insistence
  on splitting first is vindicated exactly.
* ⭐⭐ **A new instrument says why — the delivery does not get up.** Only
  **60–63%** of CROSS-archetype crosses ever reach `HEADER_MIN_HEIGHT` (BAL
  81–84%), and among C1 crosses only 24–58% were headable at all. ⚠️ **This
  lands on Q1's "delivery healthy, untouched"**: the archetype that crosses 2.2×
  more often does it with deliveries 20pp less likely to be headable, which is a
  DELIVERY property. Whether Q1 survives is the commander's.
* ⭐ **The map's sharpest claim is CONFIRMED and is not the mechanism**: the
  licensed arriver is nearer the Phase-31 cutback arc than the ball in
  **74–89%** of crosses and sits 8–9 m from it at arrival. So (a)'s second half
  is true while (a)'s first half is false — T1's routing fix would move one body
  in about half the crosses, against a C1 of 5.70%.
* ✅ **X4 exact on all six combinations** (the unmodified `cross-anatomy`'s own
  output reproduced share for share and rate for rate), partition, pooled
  coverage, stability (max 1.40pp vs a 3.5pp tolerance) and determinism all
  pass — **the instrument is not in doubt; one cell's certification is.**
* Also banked: C0 is *cut out by the defence* in ~85% of cases, not dead-ball
  attrition; the box runs ~2:1 against and fills between kick and arrival; even
  C1 is usually a near miss (nearest attacker median 1.8–2.3 m, 69–93% within
  3 m); and I2's conversion baseline is **34.40% shot / 10.27% goal** on
  `cross-anatomy`'s window — ⚠️ **which is NOT the "cross→goal ≈5%" I2 quotes
  from ROADMAP**, so a non-increase gate must name which measurement it means.

**Three pre-run corrections are disclosed in the contract's own §3.3, in their
own commit**: C1/C2 decided over the whole descent rather than one instant (the
single-instant read had the nearest attacker 5.4 m away on crosses that were
then headed), C2 also firing on an attacking touch (the chest trap was landing
in C1 because the contest resolves inside the step), and arrival kept at the
frozen predicate rather than the header band (an intermediate version called
low crosses "never arrived" — a third meaning inside C0).

**Open, and all the commander's.** C5: adopt T1's table on the mis-sized-gate
reading or order T1R with a re-powered H1 and more held-out clusters; and rule
what T2 becomes now that a chooser priced from this table would never hold —
Q2's road-B re-census, a richer world first, or a re-posed axis. C4: re-size
T0's coverage floor off this run's per-archetype rates; re-aim C4 v1 now that
C1 is 5.70% and C2 is 27.95% (arrival vs contest vs the delivery's flight
height); rule on Q1; and name the conversion measurement I2 gates on. Nothing
is in flight. F9 render-only any time; R20 in gaps.

Earlier — **C5 T0R PASSED every gate**
→ [`C5-T0R-REDRAW.md`](C5-T0R-REDRAW.md) (SHA `495faec0…f503`, 12,000 holds /
76 clusters, fresh block 840,000+, zero `src/**`). ⭐ **The authorized
diagnostic first REFUTED my own named confound** — the attrs are flat across
the pressure bands (strength 0.391/0.394/0.386), so there was no skew to
confound with — and then found the real thing: within every band, stronger
holders are tackled MORE and more technical holders LESS. ⭐⭐ **The code had
said so before any data**, which is how #27.3 asked A3R to be derived: the
standing challenge prices the carrier at `dribbling ×0.18`, `strength ×0.10`
and `pace × drive ×0.16` — and that largest term is **switched off by
construction** during a hold, because `drive ≈ 0`. T0's A3 gated the
third-largest term in a formula it never read. **A2aR: tackle-loss 4.52% →
17.72% → 23.76%**, steps +13.20pp [11.11, 15.32] and +6.04pp [4.02, 8.08] —
the world grades a held ball HARD, the rate more than quintuples, both steps
clear zero by 5σ and 4σ. **A3R: −2.76pp, CI [−5.14, −0.49]**, and its per-band
shape is coherent without anyone designing it in — technique buys −0.79pp when
free and **−3.73pp when pressed**, because the formula is only consulted when a
tackler is in range. Transfers all re-earned: A1 95.81%, A2b 67.57%, A2c
rising. ⚠️ Honest margins: A3R's CI upper bound is −0.49pp, close to zero, and
smaller than the frozen block's −3.32pp — re-power rather than inherit it. ⭐
**The strength channel, reported beside it, is UNSTABLE across blocks**
(+1.24/+2.33/+3.63pp frozen → −2.27pp [−4.69, +0.19] fresh): INCONCLUSIVE under
#20, and exactly what a noise-dominated ×0.10 term looks like. Generalised
lesson: **gate where the substrate says the gradient lives — the code tells you
before the data does.** **Next, both authorized without a new ruling (#27.5):
T1 (the waiting census) pre-registers, and C4 T0 runs after this lands (one
experiment in flight).** F9 render-only any time; R20 in gaps. Earlier,
BOTH road-B design contracts IN PLACE —
[`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) +
[`C4-AERIAL-ARRIVAL.md`](C4-AERIAL-ARRIVAL.md), each drafted by the
commander on its Phase-0 map, all twelve open questions ruled. Executor
next: **pre-register C5 T0** (Autonomous mode, both contracts in hand);
C4 T0 slots into a C5 queue gap; F9 render-only any time; R20 in gaps.
Stage III drafting continues (commander).** Earlier,
C5 DESIGN CONTRACT IN PLACE —
[`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md), drafted by the commander on
the Phase-0 map, six questions ruled (Hold = candidate · the census prices
waiting · stagnation legacy-only · new shield-Hold · C7 shares contract not
stages · NO FREE TIME). Executor next: C4 Phase-0 code map (#26.4), then T0
pre-registers under Autonomous mode; F9 render-only any time; R20 in gaps.
Stage III drafting continues (commander).** Earlier,
C5 PHASE-0 CODE MAP DONE
and reported back → [`C5-PHASE0-CODE-MAP.md`](C5-PHASE0-CODE-MAP.md).
Read-only, zero code. Headline for the contract draft: **there is no "whether"
seat** — a single-shot argmax over ways to get rid of the ball, re-run every
0.15 s, whose default is to CARRY, and **the only time term in it penalises
waiting** (`stagnation`, `PlayerBrain.ts:176`, applied against `HoldUp` at
`606`). `HoldUp` already exists but is gated to ST/corner-hold with back to
goal under pressure; the wind-up seat is a zero-tick hole (kick fires inside
the decision function); one-touch has a real technique-scaled price but no
chooser; and a hold cannot be attacked differently from a carry because the
ball is glued either way. Six open design questions in §7 for the commander.
**C4 PHASE-0 CODE MAP ALSO DONE 2026-07-27** →
[`C4-PHASE0-CODE-MAP.md`](C4-PHASE0-CODE-MAP.md): the delivery is healthy, the
contest is a one-tick 1.35 m lottery with a die as big as its signal, and the
single wide-ball arriver runs to the CUTBACK arc 16 m out while the cross drops
near the penalty spot — **and the engine already knows how to fill a box on a
delivery, it just only does it for corners** (timed multi-body crash, landing
re-route). Two honest reverts already sit at this seat, so the option space is
narrow; the `noAerial` instrument needs splitting into *nobody arrived* vs
*arrived and did not head it* before it gates anything. **Both maps are with
the commander; the C5 design contract came back
([`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md)) and its first stage is now
RUN: [`C5-T0-HOLD-MECHANICS.md`](C5-T0-HOLD-MECHANICS.md) — **T0 BUILT, and
FAIL on A2a + A3; the queue stops and the fork is the COMMANDER's.** X-series
6/6 (fingerprint unchanged, arming-with-seams-shut byte-identical, zero live
callers, legacy `HoldUp` untouched), A1 far-side **95.81%**, A2b ceiling
**68.81%** and A2c stamina strictly rising — but **A2a 72.82 → 80.32 → 68.81%**
(non-monotone on the low→mid step) and **A3 −3.44pp, CI [−6.72, +0.18]** (the
strength gradient runs BACKWARDS). ⭐ **A2a's loss-cause column gives a THIRD
reading neither pre-laid option covers**: lost-to-tackle by band is **3.44% →
14.59% → 22.60%, perfectly monotone** — the world DOES order holds by pressure
on the channel pressure drives; A2a measured *ownership survival*, which
bundles tackles with dead balls, and in the low band only 3.44% lose to a
tackle while 27.2% lose the ball. **A gate-definition limitation I own, not a
band artefact and not a world finding** — and NOT re-cut, since rewriting it is
a redraw with a #19 re-powering attached. ⚠️ **A3's leading candidate is a
confound in my own gate**: the terciles are not stratified by pressure band and
the bands differ ~4pp, so a strength skew toward high-pressure moments could
manufacture the whole −3.4pp. Labelled, **not run** — computing a new statistic
to explain away a fired gate is the move the discipline prevents; it is the
commander's to authorize. ⚠️ **One number flagged louder than itself**: the
carry baseline survives 12.31% against the hold's 71.2%, but the baseline arm
counts a COMPLETED PASS as not-survived, so the two are not comparable and the
6× gap is mostly holding-vs-playing, not keeping-vs-losing — flagged precisely
because it is the number most likely to be misread as "holding is free", which
the commander's binding interpretation forbids drawing at this stage. Earlier, the
dormant hold + fork mechanics were pre-registered with gates frozen. ⭐ One finding from re-reading the
tackle path reshaped the build: **the attack surface already exists and already
punishes standing still** (the tackle search measures `dist(o.pos, ball.pos)`,
not the man — so a ball on the far side of a body is harder to reach by
existing geometry; `strength` already shields; a stopped-and-doubled carrier
already takes +0.12). So T0 invents no attack — it makes the shield a
deliberate body position, adds the one genuinely missing cost (stamina), and
then MEASURES whether the existing attack still reaches a hold. That reframing
names T0's real risk, and I1 is gated accordingly as a **CEILING on hold
survival** (< 0.90 under the top pressure band) rather than merely "loss is
possible" — a hold that survives a real press nine times in ten is E5h's `×1.3`
in a new costume. A3's floor is derived AND its attainability stated (forced
holds can be staged at any ball-owner tick, so the floor is budget-bound, not
population-bound — the opposite of E5g's P2, which is why that failure cannot
recur here). **F9 remains available at any time**
(render-only; road B does not pause Track F). R20's three remaining
re-analyses in gaps. All flags default-OFF; the E4 ship gate is closed for
this cut and re-opens per-slice. Earlier,
ruling #25: THE OVERLAP FILE IS CLOSED, fully
attributed — the regression is the removal of a hand subsidy that honest
measurement does not support (73% → 49% per commit; no premium; everything
else measured-innocent). The E5 probe chain closes at eight members, every
one disposed. The fork is the USER's round-2 verdict (#25.4): road A =
direct football as v1's identity + honest pre-ship references, road B =
make combinations genuinely pay (joint value has a measured third-man
target; overlap needs substrate change first). Executor idle apart from R20
gap work; seat 2 parked; the commander drafts Stage III. Earlier,
ruling #24 executed: E5h RUN — and it CORRECTS the
decomposition #24 had just banked. The clock is **not** the overlap file's
first component: commits per matured run are **0.2499 OFF vs 0.2267 VALUE
(0.907×, indistinguishable)** — in BOTH arms only a quarter of matured runs
ever meet a pass commit, so **C5 cannot restore this counter** (which is not an
argument against C5 itself). **The entire differentiator is at the commit:
releases per commit 72.99% → 49.04%, 0.672×, disjoint intervals and every
cluster separating — the legacy `×1.3` quantified**, and independently
confirmed by E5g's 51.17% from a trace-based definition that was never tuned to
this one. ⛔ **The C4 link is also NOT the mechanism at the deployed horizon** —
releases become crosses 1.2% / 2.1% of the time, so the chain cannot be the
depressant — though **#24.3's conclusion survives by another route**: the ball
cashes above the table's marginal (7.24%) and below its own alternatives
(E5e's 8.29%), so the honest table is right about it in this substrate. So both
roads #24.5 ranked ahead of the deep fix are now measured NOT to be the overlap
file's cause; what remains for that file is the subsidy question itself. The
design fork awaits the **USER's round-2 verdict (#24.5)**. E4 ROUND 2 stays
LIVE. Seat 2 parked. R20's three remaining re-analyses in gaps. Stage III
drafting continues (commander). Earlier,
ruling #23 executed: E5g RUN — the contradiction
resolves WITHOUT a defect, and what returns to the commander is a DESIGN
question. Outcome **(c) is exactly zero** (437 at rank 1, 437 chosen — the
live argmax is clean), so the hard stop does not fire and **the
harvest-B-on-VALUE fork stays unauthorized**. The dominant fact sits UPSTREAM
of all three outcomes: **0.177 decisions per matured run — in 82% of matured
overlap runs nobody takes a pass decision while the licence is live**. And the
flip benchmark **did not transfer**, exactly as #23.2 registered in advance:
0.82pp ahead flags-off → **0.92pp behind** deployed, with geometry innocent
(priced cell = truth cell 96.27%, `band === −1` never). ⛔ P2 fired as **my own
design error** — a 2,000-moment floor against a staging that contains 854, i.e.
unreachable by construction — owned, not lowered. **E4 ROUND 2 stays LIVE**
(off / v1 / triple): the user's eyes, direction feedback not a ship vote. Seat 2
parked by measurement. All flags default OFF; R20's three remaining re-analyses
in gaps; the commander drafts Stage III.
Earlier,
BOTH of #22's executor steps are DONE.
E4-PREP-2 SHIPPED (the audited triple is reachable from Settings as a closed
mode list; defaults OFF; the excluded-axis pin amended in its own disclosed
commit) — **E4 ROUND 2 IS OPEN and waiting on the user's eyes**, direction
feedback not a ship vote. E5f RUN and back at the COMMANDER on §5's own
HARD-ESCALATION branch: the overlap collapse is **one stage wide** (F1 1.102×
and F2 1.177× — MORE overlappers assigned and MORE coming around — then
**F2→F3 halves, 22.86% → 11.43%**, and F3→F4 is untouched at 0.985×), and the
perception hypothesis is **dead**: never-READ runners release MORE (13.01%)
than ever-READ ones (11.03%), so **seat 2 (gaze) does NOT unpark** — the men
the passer can see are the ones being declined. P0 was the run's other result:
~85,000 extra `perceivedSnapshot()` calls reproduced all twelve banked
integers, so the perception pull is re-entrant in fact. The contradiction with
Phase 0 (b)'s flip benchmark is now sharp and unexplained, with two untested
reconciliations named and unchosen. All flags default OFF; the commander drafts
Stage III in parallel.** Earlier,
E5e PHASE 0 RUN — (a) MEASURED, (b) NOT CERTIFIED;
back at the COMMANDER. (a) settles the magnitude question: `0.468×` was real,
overlap pools to **0.516×** and third-man to **0.660×**, both REFUTED on six
clusters under ruling #20's own semantics. (b) certifies **only one of the two
premiums** — third-man **+1.49pp** [+0.60, +2.47] against the deployed axis,
overlap **−3.52pp** [−4.78, −2.28] carried as INCONCLUSIVE because P4's control
arm is off-band. ⭐⭐ **The reading I labelled after the live audit is refuted by
measurement**: overlap runners land in the MIDDLE third, and at their own
moments they are already the **top-priced option** (flip benchmark −0.82pp).
⭐⭐⭐ So Phase 1 as designed would raise third-man and **lower** overlap —
pushing the seesaw further, not holding both ends up — and the live collapse
must be **upstream** of the price comparison, which is now the sharp open
question. E4 round 2 stays shut, all flags default OFF, seat 2 still held.
Ruling #20's cheap re-analyses run as independent small steps in the gaps:
**R20-2 (frozen cutpoints) RUN and PASSED** — E2b-0's held-out claim survives
the correction (held-out spread 40.23pp, cutpoints stable to 6.6%), with one
CI-level ~3pp miscalibration at Q2 recorded against it. Earlier,
C3R PASSED and the axis went live behind its flag,
then THE LIVE AUDIT FIRED ON H1 AND H2 — back at the COMMANDER. The attempt
axis is the best chooser the slice has built (§2 band essentially neutral,
forward share ABOVE flags-off for the first time, shots +22%, third-man at its
slice best 0.642×) and it regressed the one counter every previous axis kept:
overlap 0.468×. The two combination counters now provably trade off against
each other under every axis tried. E4 round 2 stays shut, all flags default OFF,
seat 2 still held. Earlier,
PHASE 0 RUN — the attempt axis RE-RANKS
(+15.56pp of decisions, ordering sign restored) but Phase 0 is NON-PASS on two
gates, so per the contract and the standing instruction the fork is the
COMMANDER's before Phase 1. Both failures are about the OLD table's defects
(X6: E5a's V is deflated 1.91pp / 27% relative by a late window start and
unsimulated windows) and the NEW table's population (C3: over-predicts the
control arm by 2.08pp on selected moments) — not about the axis doing its job.
Earlier,
E5 + E5c RUN and returned to the commander: E5c's two
attribution tests BOTH refuted on their own criteria, so per ruling #16.4 and
the contract's §6 the third cause is reported rather than hunted: a per-option
argmax over P̂ × V̂ inverts the true ordering of the third-man pass (realized
4.89% vs 3.80%, scored 3.53% vs 3.83%). Two side findings need a ruling of their
own: E5a's V table is deflated by unfollowed windows (§7.1), and ruling #16.3's
geometric premise is refuted by measurement (§7.2 B2). E4 round 2 stays shut,
every flag default OFF, seat 2 still held. Earlier state — E5a PASS on every gate
(banked as a milestone by ruling #16.1: the game owns a validated value
instrument), E5b 30/32 with the CENTRAL HYPOTHESIS FAILED and accepted exactly
as pre-registered. E4 round 2 does not open and every flag stays default OFF
until E5c attributes; seat 2 (gaze) HOLDS per ruling #16.5. Nothing was repaired
after the result: a one-step measured value buys a coherent, more direct game
(shots +17.5%, overlaps and give-and-gos recovered, the §2 band healthier than
E3R's) and cannot see two-pass patterns.**

> ⚠️ **CI was RED for five days and is now GREEN again (2026-07-26,
> user-ratified fix).** The Pages deploy had **0 successes in its last 100 runs**
> (since 2026-07-21), so the build the user plays was stale and E4 could not
> start. Two independent causes, neither a code regression (the fingerprint is
> unchanged across all of it), each masking the other: (a) `npm test` died with
> `[vitest-worker]: Timeout calling "onTaskUpdate"` at 600–720s with EVERY test
> green — the failure `vite.config.ts` already documents, whose `singleThread`
> mitigation a 99-file/~700s suite has outgrown; (b) once a run got past that,
> `stamina.test.ts` read **0.9406 against its 0.93 gate on the ubuntu runner**
> while the same commit reads 0.9161 on macOS under Node 22 AND Node 26 —
> platform libm drift eating the 1.4pp of headroom E3R §5.7 had already measured.
> Fix (`2b77f47`): CI runs on **macos-latest**, the platform every behavioural
> contract in this repo was calibrated on, and `npm test` becomes **three
> sequential `vitest run --shard=i/3` steps** so no single process accumulates
> enough blocked event-loop time to trip the RPC budget. No test semantics, no
> gameplay, no fingerprint change — re-baselining the stamina contract was the
> alternative and C1-B §12.4 forbids it. Verified: build+deploy green, and the
> live bundle carries `evo:edsPreview`.

> ⭐⭐ **E4 FEEDBACK, ROUND 1 (the user played it, 2026-07-26). No ship verdict
> given, no revert asked for: "方向没问题,可以等" — the direction is affirmed and
> the missing seats are judged worth waiting for. Flags therefore stay
> default-OFF (status quo) and this is the commander's to draft on.**
>
> **What the user saw:** a man you cannot see cannot be passed to is realistic,
> but (a) a midfielder with vision would TURN AND LOOK before playing, and would
> play one-touch because he looked BEFORE receiving; (b) a real back-pass comes
> after HOLDING the ball and drawing a defender, not as a first-touch reflex;
> (c) as it plays now it is safe recycling — "什么配合都打不出来".
>
> **Measured, same seed, two seasons, flags-off vs bundle** (`npx tsx` two-arm
> League probe; numbers are per match unless noted):
>
> ```text
>                        flags-off    bundle     delta
> forward-pass share       58.56%     53.47%    -5.1pp   <= the "safe balls" impression
> passes                   101.58     107.49     +5.8%   <= more circulation
> shots                     13.47      12.66     -6.0%   <= the watchability cost
> pass completion          72.43%     70.25%    -2.2pp
> one-touch share          20.78%     20.28%    -0.5pp   <= one-touch did NOT increase
> third-man releases       10.014      6.437    -35.7%   <= COMBINATION PLAY COLLAPSES
> overlap releases          0.176      0.056    -68.0%
> give-and-gos (small n)    0.578      0.732    +26.8%
> longest pass chain         5.88       6.62    +12.7%   <= circulate, don't progress
> ```
>
> **The mechanism, indicted in code and NOT a perception problem.** The E3 seam
> replaced WHO gets the ball and left WHETHER to pass on the legacy score. The
> legacy pass loop carries the whole tactical layer — the 2过1 return bonus
> (×1.15+), third-man (×1+passBias·0.3·thirdManW), overlap release
> (×1.3+width·0.6) and an explicit **×0.55 "don't hand it straight back"
> penalty** — and all of it only ever shaped `bestMate`. The perceived chooser
> then overrides the target with `argmax P(clean reception)`. So **the licence
> and the delivery are now granted by two different judges**: the overlap runner
> earns the pass, the ball goes to a safer man, and the anti-back-pass penalty
> vanishes with him.
>
> **The deeper reading: the measured axis is half a decision.** Football wants
> P(success) × WHAT THE BALL IS WORTH THERE. E0 refused a scalar by design and
> rulings #8/#9 forbade invented weights, so the chooser is progression-blind BY
> CONSTRUCTION and the safest recycle wins every tie. The honest repair is not to
> re-add hand-tuned bonuses but to MEASURE the value half with E2a-2's own
> fork-and-force harness — for each candidate, not "did he control it" but "what
> happened next" (shot within N seconds / threat delta). Same move E2b-0 made for
> the corridor read: measure the exchange rate, never invent the weight.
>
> **Three named seats, in the order the user's eyes prioritised them:**
> 1. **The value half of the axis** (cheapest single fix; explains BOTH the
>    back-passes and the lost combinations).
> 2. **A gaze consumer — look-before-pass.** S3-G0 / S3-G1 / S3-G2 are banked and
>    dormant; A4 was parked precisely because "latency only binds against live
>    coordination — build it once a live seam exists", and the seam now exists.
>    Look-pressure is already measured at 6.59% of live pass moments.
> 3. **The time dimension** — hold-draw-release, and one-touch vs control as a
>    priced choice (C5, where ruling #12 already re-seated the touch cost).
>
> ⚠️ **And a gap in the GATE SET, not in the bundle:** E3R's §2 band passed on all
> five dimensions while watchability measurably dropped, because the band has no
> progression or combination dimension and 29 gates contained no watchability
> instrument at all — the user's eyes are the only one, and they sit at the END of
> the chain. The four numbers above cost minutes to produce. Recommendation for
> any redraw: carry forward-share, the three combination counters, shots and
> chain length as REPORTED band dimensions from now on, so a probe can see what
> until now only a play session could.

**How to run E4 (the deployed build, on the phone or the desktop):**

1. ⚙ Settings → 🧬 Experimental → tick **“EDS preview: players act on what they
   SEE”**. It takes effect at the **next kickoff**, so the cleanest read is to
   watch a match, tick it, watch the next one, untick it, watch a third.
2. What is actually different: the passer picks his target from his OWN view
   (a man he cannot see cannot be passed to) and the defender's interception
   read runs off his own view of the ball. Everything else — power, aim,
   execution — is the shipped game, and `edsTouchCost` is NOT in this bundle
   (ruling #12.3 re-seated it to a future C5-coupled slice).
3. Registered feel items (ruling #14.4): play is measurably **CALMER** — later
   tackles, better-supported passes, fewer loose-ball scrambles — and a full
   match no longer spends the stamina tank (0.9697 vs a 0.93 contract). The
   question is whether calm reads as football or reads as flat; the
   fatigue-economy re-seat is already queued if the bundle ships.
4. **F-ACCEPT** (art F2–F7: body proportions, crowd + closed bowl, turf grain,
   ball trail/height, goal fireworks + flame jets day AND night, day/night
   toggle) can be judged in the same session.

Ship = both v1 flags default ON + fingerprint/perf rebaseline + a ROADMAP
entry, and the toggle's fate (keep as a “legacy brain” switch or remove) is
decided then. Revert = the whole bundle, dormant assets stay banked. Until the
user says either, `main` plays exactly the game it played before: the flags are
default-off and the fingerprint is untouched.

The slice is complete as engineering: a body inside a live match chooses its
pass from what it can see, the defender reads his own ball, perception is
honest and costs 19.8% at brain cadence, the equilibrium holds on all five §2
dimensions, power usage stays situational, and the ecology keeps its variety
(median entropy ratio 1.5253 over five fresh seeds — usually MORE varied than
without the bundle). Every claim is pinned: E3R's banked live numbers return
17/17 bit-identical under the pull implementation, and the lazy/eager
equivalence is a perpetual test rather than a promise.

**What E4 is, exactly:** the user plays. Ship = the three v1 flags default ON
(`edsPerceivedChoice`, `edsPerceivedDefence`; `edsTouchCost` stays OUT of v1 by
ruling #12.3) plus a fingerprint/perf rebaseline. Revert = the whole bundle.
Nothing is flipped until the user says so — the flags are still default-off at
this commit, so `main` plays exactly the game it played before.

**Two things the user should know while playing** (both measured, neither a
blocker): the game is CALMER — defenders commit later and passers pick
better-supported balls, so there are fewer loose-ball scrambles, and the
stamina contract breaks because a full match no longer spends the tank (0.9697
vs a 0.93 gate; ruling #13.4 carries this to E4 as a FEEL item, with a
fatigue-economy re-seat registered as the follow-up slice IF the bundle ships).
And per-seed CE1 is noisy (2/5 fresh seeds shrink), which is honest context for
"co-evolution restored", not a contradiction of it.

Below, the E3R record as it stopped:


**(E3R result record) ⛔ E3R stopped at a commander gate —
E3R passed 26 of 28 gates and E4 is NOT reached.** Ruling #12's amended thesis
survived its own audit: with the mechanical tax gone, **the live game absorbs
honest two-sided perception** — every §2 dimension in band (goals +2.20%),
power usage situational at 21.86%, and the attacking advantage decaying
+0.2864 → +0.0282 across ten generations. The chain is exact end to end
(re-bank 7/7 bit-identical, X4R 0/10,292), which also PROVES the premise
correction §1.1 registered before the run: the reference was always
flag-off-honest.

**Two things return here, and neither is a gameplay break:**

1. **Style entropy 0.5797 vs a 0.60 floor — H2 stands by the letter only.**
   All three pre-registered discriminators refute the genome-blind mechanism
   (clubs play MORE differently, genes express MORE strongly, the chooser
   varies club to club), and the pre-registered robustness seed INVERTS the
   statistic (ratio 1.5321). The honest reading is that a single
   final-generation entropy over 16 clubs cannot decide this; what the
   commander now has to rule is whether CE2 needs a powered form (multi-seed,
   multi-generation) before it can gate a ship — the sixth threshold type
   applied to an ecology statistic.
2. **Perf 1.3238× against 1.25×,** with the named lever spent and the residual
   cost identified as the honest per-observation math. The one honest lever
   left — deferred reconstruction, ~40× fewer observations with identical
   values — needs a commander ruling because it decides what "the moment I
   looked" means (per-tick frame vs mid-decide-loop refresh).

**Plus one measured correction worth a ruling of its own:** the stamina
contract breaks on the PERCEPTION bundle, not the touch cost — honest
perception makes the game calmer, so a full match stops spending the tank
(0.9697 vs a 0.93 gate, flags-off 0.9161). That is either a real play-feel
finding for E4's play-test or a fatigue-economy re-seat; it is not a constant
to re-baseline.

Below, the E3 record as it stopped:

**(E3 result record) ⛔ E3 FAILED five gates and E4 was NOT reached.** The build did its job: the live
chooser reproduces E2b-1R absolutely (X4: 0/10,292 per-moment disagreements,
7/7 banked families bit-identical), so for the first time a body inside a live
match chooses a pass from what it can see. The world did not absorb it: the §2
band broke on headers (+30.44%) and long balls (+45.20%), the always-heavy
canary read 17.42% against a ≥20% floor (failing on the anti-dominance side),
co-evo restoration did not shrink, style entropy halved, and the bundle costs
1.3223× at brain cadence. Nothing shipped; every flag is default-off and the
fingerprint is untouched.

**What E3 hands the commander** (full text in
[`EDS-E3-COEVOLUTION-AUDIT.md`](EDS-E3-COEVOLUTION-AUDIT.md) §6):

1. **The failing component is NAMED.** The §4-authorised ablation: bundle minus
   the touch cost is inside EVERY band (goals +2.20%, headers −0.43%, long
   balls +8.06%); touch cost alone is C1-B to the decimal. E1b's curve is a
   measured substrate truth, and it re-routes the game whether or not the
   evaluator can see it — because the re-route is not a decision (R1: the
   chooser's long share is 19.06% vs 18.05% dormant).
2. **Both-sides perception PASSED its own test, live.** The chooser alone costs
   −21.69% of the goals; chooser + perceived defence lands at +2.20%. The
   S3b/vision-attr lesson — one-sided reads inflate, co-evolved reads hold —
   is now confirmed in a live equilibrium, not just in probes.
3. **Three axes to redraw on:** the touch cost's home (its band break is
   mechanical, not evaluative — reprice, re-seat, or hold it dormant); the
   dominance predicate's lower edge against a 49/33/17 distribution and a
   five-step corridor axis; and perception's cost for a consumer that reads
   BODIES (E2b-1R's 1.069× came from reading only a ball — the remaining
   consumption-scoping lever is WHICH bodies might be asked to pass).
4. **Style entropy halving** is the one finding with no benign reading yet, and
   it is the ecology gate, not a gameplay one.

Earlier (after E2b-1): the queue stopped at a commander gate. The experiment's own
questions came back well — **not-looking does not win** and **the route mix
survives perception at awareness 0.8, indistinguishable from omniscience**,
which is the gate S3b failed. It stopped on plumbing: brain-cadence perception
costs **1.329× against a 1.25× budget**, and the probe hashes wall-clock
timings so it cannot be byte-identical. Two questions are the commander's,
both in [`EDS-E2B1-BOTH-SIDES-AB.md`](EDS-E2B1-BOTH-SIDES-AB.md) §7: cheapen
perception and re-run (the defender entry needs only the ball percept), and
how a probe should carry a perf gate without forfeiting byte-identity.

Earlier (after E2b-0): E2b-1 was next —
E2b was split by the executor under ruling #8's standing authorisation, on the
same instrument-first principle the commander has applied three times: a blind
option and a seen one were not on a common axis, and inventing the weight to
join them was forbidden. **E2b-0 PASSED** and supplies that axis, plus three
constraints E2b-1's drafting must answer: the corridor read is the dominant
term (**39.72pp vs 6.64pp** — looking beats remembering by ~6×), **28.48%** of
playable options carry no read at all and need an explicit third class, and
look-pressure is a function of the read rather than the band. Ruling #7 (c)–(g)
and #8 (l) already fix the rest of E2b-1's shape.

⚠️ **Sync (ruling #5)**: Track F (art direction) and D6 landed from another
session mid-run. Render/docs/tests only — zero `src/sim`, `src/ai`,
`src/evolution` — fingerprint unchanged, no step-ID collision, and E2b-0 was
re-run at the post-merge HEAD to the same SHA.

Earlier (after E2a-2): E2b was next and proceeded without a new ruling — E2a-2 PASSED on every gate. The prior is now measured
over the population it will actually price, and it hands E2b three numbers to
respect: the chooser it must beat is worth **+18.62pp**, a remembered distance
is worth **4.48pp** and is non-monotone, and **18.33%** of real passes fall
outside the censused window and take the marginal. Ruling #8 (l) already
settled the aiming rule, so E2b's remaining drafting work is the A/B itself.

Earlier (ruling #8): E2a-2 was the next step — E2a-1's split verdict is
disposed: the FAIL was a correct catch (a base rate over CHOSEN passes is a
selected sample; the prior must price the option space), the census/pricing
layer/table stay banked, and both open questions are answered — Q1: recensus
counterfactually by fork-and-force (intervene on target choice only, live
execution, bit-identical reproduction of the chosen pass as the harness
gate; direction reported, never gated; chooser-lift prediction registered);
Q2: re-key routing onto the priced quantity (8.32pp receptionSuccessRate
gradient), pricing classes fully-unknown→marginal / stale-memory→banded.
E2b's aiming rule is settled in the same ruling (priced always, executable
only with an honest aim point; look-pressure statistic reported). Full
constraints: design contract §3 (h)–(l).

Earlier (ruling #7): E1b PASSED on every gate and is
ACCEPTED (ruling #7): the touch-cost curve is banked behind
`Match.edsTouchCost`, default OFF, proven to land at the real adjudication
within noise of its own arithmetic and carried by the speed channel alone.
The C1-B redraw is spent, in its correct home, on a measurement rather than
a weight. E2's drafting constraints live in the design contract §3
(census-derived priors as data, zero-deletion pricing on E0's banked states,
both-sides evaluator = corridor + touch term, not-looking-must-not-win,
route-mix vs the S3b signature, PERF hard gate). One thing E2 and E3 both
inherit: the canary sized the cost at 6.53pp against power's 21.2pp threat
benefit — heavy is still the safer option on the axis E0 ranks by, so
no-strict-dominance is a live risk E3 must gate, not an assumption.

Earlier (ruling #6): E1a came back
split (I1 PASSES, I2 undecided, probe verdict FAIL — frozen in the contract
§6) and ruling #6 disposed it: E1b OPEN on I1's pass (the contract's own §4
condition), I2 RETIRED (question settled by its decomposition; the powered
flat-vs-rising test is subsumed by E1b's OFF/ON contrast). E1b's drafting
constraints are in the design contract §3 (two-channel amendment: speed
and/or misalign carry the increase, pressure bounded; I1 staging, same-seed
OFF/ON, interval-test predicates per PROBE-CONTRACTS' sixth threshold type;
contested states diagnostics only; always-heavy canary unchanged). After
E1b: E2 (unseen-pricing amendment) → E3 (co-evolution audit) → **STOP at E4
for the user's play-test**.

## Relocated QUEUE block (superseded 2026-08-02 by ruling #125 — the #123.5 fork era)

**V4-P3-PARTIAL CLOSED END-TO-END (#110→#123)**: P3p-2 consumer
(reading A; the law cures 83% of the restart excess at consumer
grain; the SECOND positive ATE +0.0095) → **P3p-3 BATTERY (400×5
arms, gates valid, `748b8f6` verify 4/4): STOP OUTRIGHT as frozen —
the #88.2 spacing line resolvedly closed (−5.3%) while duplicate
runs improved and TV held**. Verdict map: the law real-but-shy
(restart +50.8%→+14.5%, RETURNS; banked dormant as v4's strongest
remedy); **the offside inversion CONFIRMED (+33.9% > P3a's +22.8%
— offside formally joins the A4/absence family per #116.2(iii))**;
delivery partial (cutbacks in, headers/long balls out); **the rest
residual MEASURED −16.1% [−17.2, −15.0] (halved from −30.2%) = the
A4 target**. ⭐⭐⭐ THE FRONTIER CONCLUSION (#123.3): price-shaped
remedies slide along the discipline↔shape frontier, they do not
move it; three evidence lines converge — the frontier-mover is
ASSIGNMENT (A4, the 野球 insight). Nothing shipped; fingerprint
unchanged across #90–#123 (34 rulings). **THE QUEUE SITS AT THE
USER FORK (#123.5): (B, recommended) the A4 ASSIGNMENT CONTRACT ·
(C) the absence census first · (D) park v4 / C-track / other.
Nothing proceeds until the user rules.** R20 gaps / F9 any time.
*(Commander's substrate assessment, on the user's question
2026-08-02: SUFFICIENT for A4 SLICE 1 = pre-match, per-team,
gene-weighted assignment of ONE job — rest-defence ownership —
executed through a new eye.v4-pattern seam + the banked in-support
law, validated by the reusable P3p-3 battery form at the frozen
bands; assignment = agreed shared prior, percept-clean per the A4
charter; assignment VALUE tested at TEAM level (battery A/B), never
per-tick pricing (the proven dead end). Deferred to later slices:
dynamic in-match handoff (needs A3-style mutual resolution),
offside-as-doctrine (a line-awareness prior, not a single-owner
job), the coach global eye, the selection/PAYS proof (two-step as
standard).)*

## Relocated QUEUE block (superseded 2026-08-02 by ruling #129 — the A4 arc-open / P1-runs era)

**THE A4 ARC IS OPEN (#125, 2026-08-02)**: the #123.5 fork ruled
**B** (the user's 底座够不够开工→够→"go" exchange; veto window
open — say so and the contract parks unharmed). **The binding
contract is drafted + VISION-audited (PASS, one amendment F1→I-A4
job-menu honesty):
[`A4-ASSIGNMENT-CONTRACT.md`](A4-ASSIGNMENT-CONTRACT.md)** — slice
1 = pre-match, per-team, gene-weighted REST-DEFENCE OWNERSHIP,
percept-clean per the charter (prior buys latency/priority, never
reveals an unobserved body; pre-match static; opponent-opaque).
Sharpened diagnosis at drafting: **R0's rest defence IS already an
assignment — hard-coded** (`PlayerBrain.ts:1176` `p.index === 1` +
the formationSpot clamp + the `!restDefence` support-fan exclusion);
the eye arms erode it (slot 0.5876→0.4384 = the −16.1% [−17.2,
−15.0] residual) — slice 1 replaces the index with an
emergence-compatible primitive. Stage map: **A4-P1 vacancy census**
(fork C folded in as calibration; gate: monotone resolvedly-nonzero
vacancy price, else STOP) → A4-P2 dormant build → A4-P3 frontier
battery (4 arms R0/R3p/assignOnly/ASSIGN; primary `ASSIGN − R3p`;
PASS = DEGEN-RESTDEF closes AND no shape limb regresses = the
frontier MOVES). Seeds 11.7M–12.3M + stats 1000xx reserved. Road B
throughout; fingerprint `57b0bdab…c673` unchanged (#90–#125).
**自走 GREEN PATH LIVE (#126, user "自走go" 2026-08-02):
autonomous stage-to-stage progression authorized** — P1→P2→P3
proceed on PASS without per-stage "go" (commander review + numbered
rulings still gate EVERY stage; #106.6 and Road B unchanged); the
arc returns to the user ONLY on STOP/FAIL, a veto, or the P3
frontier verdict. **A4-P1 PRE-REG LANDED (`a9f7742`, Workflow
Draft→Verify PASS; commander review #127)**: I5(b) reused verbatim;
gate frozen = deep-priced pooled CI>0 ∧ duration-ladder monotone ∧
(bin2−bin0) resolved, PLUS the #127 pre-run tightenings (deep
permanent, no box re-read; Simpson sign reversal = automatic
NOT-ADVANCE; empty-bin1 semantics pre-named). Seeds: smoke 40
@11.70M, census ≤8,000 @11.80M, stats 100003/100103. Enriched
eye-null world (two-pin #26.5/#68.2). **RUNS LIVE (#49.5 detached):
sizing smoke → frozen N arithmetic → census → adjudication ruling.**
R20 gaps / F9 any time.

## Relocated QUEUE block (superseded 2026-08-02 by ruling #135 — the A4-P1b live era)

⭐ **#129.4 RULED A BY THE USER ("A 自走", #133) — A4-P1b, THE
INTERVENTIONAL FORK-AND-ABANDON CENSUS, IS LIVE; the green path
resumed.** Design (#133): a dormant src seam (default-OFF,
side-scoped, set ONLY inside the probe's forked branch) disables
BOTH in-possession faces of the index-1 designation (the
PlayerBrain support-fan exclusion + the formations clamp; the
out-of-possession sweeper face untouched) — remove the POLICY,
freeze nobody (STATUE-safe); paired same-seed branch contrast
prices the policy's causal value in goal-value units (deep entry
primary, #127 carries; horizons/dose axis pinned ex ante); gate =
monotone resolved positive price, frozen before any run; #106.6:
P1b is the SECOND instrument on this question — a third needs a
user ruling. #131/#132 ladder rungs (补位 → 默契学习 → 教练回路)
named, NOT authorized.

## Relocated QUEUE block (superseded 2026-08-02 by ruling #139 — the A4 P1/P1b/P1c era)

**THE A4 ARC (opened #125; contract
[`A4-ASSIGNMENT-CONTRACT.md`](A4-ASSIGNMENT-CONTRACT.md),
VISION-audited; 自走 green path #126) — A4-P1 CLOSED: THE FROZEN
GATE STOPPED THE STAGE (#127–#129, 2026-08-02)**. The observational
vacancy census (pre-reg `a9f7742`, #127 tightenings; the #128
X-DET harness repair en route; 200 matches @11.80M, all X green)
returned a **RESOLVEDLY NEGATIVE pooled vacancy price −0.0144
[−0.0178, −0.0114], non-monotone ladder, no Simpson reversal
(standardized −0.0078 same sign), box/6s/15s all agree** ⇒ STOP
executed as frozen. **Diagnosis (#129.3)**: endogeneity + a bar
artifact — the incumbent hard-codes the job (`PlayerBrain.ts:1176`),
so TRUE functional absence never occurs on this world; occupied≈
pinned states, vacant≈attacking states with the clamp still
covering above the own-third bar. **The world's own variation
cannot price a counterfactual the incumbent never permits — the
question needs an INTERVENTION.** ⭐ **A4-P1b CLOSED — THE INTERVENTIONAL GATE ALSO STOPPED
(#133–#135, 2026-08-02)**: the fork-and-abandon census (dormant
seam `Match.abandonRestDesignation`, `f5dd892`+`551fc3f`; 1400
matches, 56,000 paired forks, all X green) measured the index-1
designation policy's causal price on the incumbent world as
**RESOLVEDLY NEGATIVE** (deep −0.000837 [−0.001065, −0.000603],
accrual −0.0008→−0.0033 at 10→30 s, box NULL, all strata ≤0, no
reversal) ⇒ **the hand-written law is REDUNDANT-TO-COSTLY: the
ordinary positioning engine already covers** — the user's #130
challenge causally vindicated. Design gap owned (#135.3): both
instruments priced the INCUMBENT world; the A4 target (−16.1%) is
an EYE-WORLD phenomenon — ownership's value where ordinary cover
ERODES is still untested. ⭐ **#135.4′ RULED A′ BY THE USER ("A′ 自走", #137) — the
green path resumed; THE CONTRACT RESCOPED (M1′, #136 semantics):
assignment = per-head coarse 2D home-region SOFT prior** (job enum
dropped — P1/P1b proved the PRIOR, not the LAW, carries the value;
clamps banned; formation = the team's EVOLVED home distribution =
the root-replacement path for the #1 VISION violation; §8.2
re-audit PASS). **A4-P1c IS LIVE: fork-and-GRANT on the eye world**
(the R3p arm, where the −16.1% residual lives): branch B GRANTS one
body a back home prior (M3′ soft-bias instrument form, pre-registered
DOSE grid = the monotone axis); gate = resolved dose-monotone
discipline recovery on RAW deep-entry rates (goal-value conversion
labelled only; #127-form tightenings). #106.6: P1c = the THIRD
instrument, user-authorized; no fourth without a fresh ruling.
OFFSHOOT standing: the Phase-31 pin = measured-≤0 hand-code, future
removal candidate via §6 ship discipline (production track).
#131/#132 ladder rungs (补位 → 默契学习 → 教练回路) named, NOT
authorized. Slice-1 stage map on resume:
A4-P2 dormant build → A4-P3 frontier battery (R0/R3p/assignOnly/
ASSIGN; primary `ASSIGN − R3p`). Seeds: 11.70M/11.80M consumed by
P1; 11.81M–12.3M + stats 1002xx+ still reserved to A4. Road B
throughout; fingerprint `57b0bdab…c673` unchanged (#90–#129). R20
gaps / F9 any time.

## Relocated QUEUE block (superseded 2026-08-02 by ruling #142 — the #139 terminal-fork era)

**THE A4 ARC — THE P1 PRICING ARC IS CLOSED: THREE INSTRUMENTS,
ONE ANSWER (#125–#139, 2026-08-02)**. Contract:
[`A4-ASSIGNMENT-CONTRACT.md`](A4-ASSIGNMENT-CONTRACT.md) (M1′
home-region soft prior, #136/#137). The REST-DEFENCE rung is
MEASURED DEAD in all three forms — P1 observational (confounded
negative, #129) → P1b removal on the incumbent world (the
hardcoded law prices ≤0: redundant-to-costly, #135) → **P1c grant
on the eye world (3800m, 76,000 forks ×6 branches, all X green,
#139): a granted back home-prior is RESOLVEDLY ADVERSE, +0.0461
[+0.0400, +0.0522] deep entries/window at unit dose, DOSE-MONOTONE
(+0.020/+0.036/+0.046/+0.046), every stratum harmful, no reversal
— while spacing/dupRun IMPROVE (the tell: the harm is an
own-possession OUTLET TAX, not crowding)**. ⭐ TERMINAL (#139.3):
depth-anchoring one body during own possession buys NO rest-defence
discipline at the 10 s surrogate grain on ANY world — it costs, in
proportion to anchor strength; the job's causal moment lives OUT of
possession, where no percept-honest consumption seam exists (THE
NAMED GAP). #106.6: the rest-defence question is CLOSED — no fourth
instrument. Banked forward: the dormant home-prior machinery (grant
seam + VAL_SCALE dose instrument, reusable), the Phase-31-pin
production REMOVAL candidate (P1b offshoot, §6 discipline), the
world-fact "this economy punishes deep parking" (the user's #130
instinct, thrice measured). ⭐ **THE QUEUE SITS AT THE USER FORK
(#139.5): (A, recommended) pivot slice 1 to the OFFSIDE limb** — a
back-LINE line-awareness prior (#116.2(iii) family, +33.9%
confirmed, eye-world native, a DIFFERENT prior shape; the grant
instrument reuses directly) · **(B)** park A4 (ladder rungs 补位 →
默契学习 → 教练回路, or C-track) · **(C)** the out-of-possession
consumption seam contract (the heavy substrate step at the named
gap). **Green path suspended; nothing proceeds until the user
rules.** Seeds consumed through 12.008M; 12.01M–12.3M + stats
1006xx+ remain reserved. Road B throughout; fingerprint
`57b0bdab…c673` unchanged (#90–#139). R20 gaps / F9 any time.

## Relocated QUEUE block (superseded 2026-08-06 by ruling #154 — the P3/P3prime exam era)

**THE A4 ARC — the P1 pricing arc + the #140 forensics (#125–#142,
2026-08-02)**. Contract: [`A4-ASSIGNMENT-CONTRACT.md`](A4-ASSIGNMENT-CONTRACT.md)
(M1′ home-region soft prior). History: P1 observational STOP (#129,
endogeneity) → P1b removal STOP (#135: the hardcoded law
redundant-to-costly on the incumbent world) → P1c single-body grant
on the eye world STOP (#139: RESOLVEDLY ADVERSE, dose-monotone) →
**the user challenged the diagnosis; the #140 forensics (16,000
forks re-read, all X green) REJECTED all three registered
hypotheses**: turnovers resolved DOWN (outlet-tax dead), the deep
outlet IS used (deeper by 1.4 m; no build-up defect), turnover
geography flat + box weakly UP (not a counting artifact). ⭐
**SURVIVOR (H5, #142.3): counter-press thinning — anchoring ONE
body redistributes the other five by their own gradients, thinning
post-loss pressing density; discipline is a property of the
team's agreed SHAPE, not one body's depth (the user's #131
anatomy ② speaking through data).** #139.3's closure NARROWED
(#142.4): the SINGLE-BODY depth-anchor question is closed
(#106.6); the WHOLE-DISTRIBUTION form (M1′ proper, the 野球
model's real content) was never instrumented. ⭐ **#142.5 RULED
A BY THE USER ("a", #143) — A4-P1d, THE WHOLE-DISTRIBUTION GRANT
CENSUS, IS LIVE; the green path resumed (#126/#137 precedent).**
Design (#143): a NEW dormant map-grant flag (the single-body
homeRegionGrant stays banked untouched) — in branch B EVERY
side-d outfielder gets his own 2D home (center = HIS formation
base spot, the world's own variable; extents from pitch
constants; both axes per #136) as a soft bias at the same
consumption point; dose grid = the P1c VAL_SCALE fractions; gate
= the P1c form (primary-dose Δdeep CI upper<0 ∧ dose-monotone ∧
ladder ∧ no reversal, frozen before any run); the #140 forensic
counters (turnovers/box/penetration) pre-registered as REPORTED
mediators from the start. Seeds: smoke 12.05M, census 12.10M,
stats 100603/100703. H5 predicts coordinated redistribution
should NOT thin the press — this is the kill-or-confirm of
H-A4.1 at pricing grain; its STOP returns to the user (one
instrument for the distribution question, #106.6 idiom). **P1d RAN AND
STOPPED AS FROZEN (#145, 2026-08-03): the primary dose (1.0×) is
NULL — but the dose curve is the arc's FIRST RESOLVED BENEFIT:
Δdeep −0.0139 [−0.0188,−0.0089] @0.25× · −0.0084 @0.5× (both
resolved) · +0.0140 @2.0× (resolved harm) — 约定要"大概意思"才有
效,"规定死"有害 (the user's #132/#136 ontology, measured).
Mediators: turnovers↓ all doses, BOX↓ all doses (resolved),
compact-without-clumping at low dose; H5 confirmed at low dose.
⭐⭐⭐ **A4-P1e PASSED (#148, 2026-08-04) — THE ARC'S FIRST GATE
PASS; the distribution question CLOSES POSITIVE.** Δ@0.25× =
−0.013975 [−0.019344, −0.009119] on fresh seeds — an exact
replication of P1d's independent rung (−0.0139); the whole grid
{0.125..0.5}× beneficial (rungs −0.0142/−0.0140/−0.0122/−0.0096),
noHarm TRUE, no reversal, all X green. Mediators consistent
(turnovers −0.022, box −0.0030 at 0.25×, labelled). **THE MEASURED
TERM: strength region (0, 0.5]×VAL_SCALE, resolved benefit at the
low end — 松约定有价,紧约定无价/有害, the user's ontology now
CERTIFIED at gate grain.** Contract §5 amended (#148: PRIOR arms
pin 0.25×; the P2 gene born 0, bounds [0, 0.5×VAL_SCALE]).
**A4-P2 BUILT + BANKED (#149, `f49382a`)**: gene
`homePriorObedience` (TacticalGenome, born ABSENT ⇒ semantic 0 —
the serialized-keys/fingerprint trap dodged; bounds [0,
0.5×VAL_SCALE]) + master flag `eye.v4.homePrior` + evolution
opt-in; RNG-stream identity PROVEN (8-gen seeded byte-identity,
equal Rng state); 1030/1030; fingerprint unchanged. Contract §5
re-amended (#149: priorOnly was vacuous under M1′ → R3v3/R3v3p
pair). **A4-P3 RAN AND THE FROZEN EXAM FAILED — F-SHAPE-ONLY
(#151, `fb2aecf2`)**: occupancy proxy −0.0401 (wrong way), three
proximity-shape limbs negative (spacing −0.64 m, under-4m +0.007,
dupRun +0.038), scramble improves; **but the REPORTED causal
currency points the OTHER way: deep −1.49/set, box −0.35/set on
the same PRIOR−R3p contrast** (plain eye: deep −4.38, box −0.96).
Honest costs: restartTicks +161/set, roleMixTV 0.556→0.434. ⭐
#151.3: the exam's instruments predate the P1 arc — it graded the
mechanism against the OLD shape's yardstick while the certified
currency says it works; H-A4.1 is MIS-MEASURED, not settled. ⭐
**#151.4 RULED B BY THE USER ("B 自走", #152) — A4-P3′ IS LIVE,
the green path resumed.** The P1e replication structure: fresh
seeds (smoke 12.22M, battery 12.23M, N≤7,000), a NEW frozen gate
= deep entries resolvedly FALL on PRIOR−R3p ∧ box does not worsen
∧ the football hard gates (scramble/ledger/roleMixTV≥0.407/
X-family); proximity readouts DESCRIPTIVE (verdict authority =
the user's play-test, contract §1 #152 amendment); restart
REPORTED (flag above +322/set). The user's two diagnoses banked
(#152.3): per-body offsets = slice-2 candidate; a
punish-compactness substrate = the long line. PASS ⇒ slice 1
returns for the closing ruling + play-test; FAIL ⇒ H-A4.1
unsupported on the honest ruler too. Fingerprint unchanged
(#125–#152); everything dormant.
Design (#146): NO src changes (the map seam takes strength as a
parameter); fine grid {0.125, 0.25, 0.375, 0.5}×VAL_SCALE,
PRIMARY pinned 0.25×; gate frozen fresh = (i) primary resolved
benefit (CI upper<0) ∧ (ii) NO rung in the grid resolves HARM
(the whole future gene range must be non-harmful) ∧ (iii) no
Simpson reversal — the P1d monotone-dose leg is DROPPED with
reasoning (interior optimum plausible inside the region,
pre-named); mediators carried; progress lines every 500 matches
(the overnight lesson); seeds smoke 12.15M / census 12.20M,
stats 100803/100903. The SECOND AND FINAL instrument on the
distribution question — it closes either way; PASS ⇒ the
measured strength region becomes M3′'s term and A4-P2 opens.** Two user
working rules anchored (#144: VISION §6 + §0.0.6): 有故事就要有
探针 · 决策点人话先行. Banked:
the grant/dose machinery (reusable), the Phase-31-pin removal
candidate, the deep-outlet exoneration. Seeds consumed through
12.008M; 12.01M–12.3M + stats 1006xx+ remain. Road B; fingerprint
`57b0bdab…c673` unchanged (#90–#142). R20 gaps / F9 any time.

2026-08-06 (#157): superseded QUEUE state — "THE QUEUE SITS AT
THE USER'S EYES: the A4 world feel (紧凑像球还是像堆, the #152
shape authority) + D1/D2/phone/F7b/F7c verdicts — keep / change
/ revert per lever. Slice 2 (per-body offsets) and the ladder
queue behind the play verdict." → the first play verdict landed
(#157: 越位 ≈2× corroborated, restartTicks +29%, dupRun +7.8%,
配合更多 positive-but-uncountered; proximity-block authority
exercised NEGATIVE); queue moved to the user's #157.5 fork.

2026-08-06 (#158): superseded QUEUE state — "THE QUEUE SITS AT
THE USER'S #157.5 FORK: (i) slice 2 per-body obedience offsets ·
(ii) the offside axis · (iii) wholesale revert · (iv) D1/D2/
phone/F7b/F7c lever verdicts still OPEN." → the user ruled 甲;
slice 2 OPENED (contract drafted + VISION-audited, #158); 乙
hangs; next authorized step = S2-P1 on "go".

2026-08-06 (#159): QUEUE cadence note superseded — "NEXT
AUTHORIZED STEP on 'go' = S2-P1" → the user authorized
SELF-DRIVE for the S2 arc (Workflow dispatch, Opus 5 medium
executors); stops = FAIL/fork/user-gates only.

2026-08-08 (#161): superseded QUEUE state — "SELF-DRIVE
AUTHORIZED (#159): S2-P1 → S2-P2 → S2-P3 proceed without
per-round 'go' … stops = FAIL / fork / user-gates" → the S2-P1
census adjudicated (primary PASS, both NI limbs FAIL, F-S2b
pre-named); self-drive STOPPED at the red line; queue moved to
the user's #161.5 fork (bank/confirmatory-backLoaded/gene-ize/
stop). Ops incident: first census run killed by a harness
reconnect at pass-2 2,040/8,000 (session-tracked task, §0.0.4
nohup rule violated once then followed); clean deterministic
restart, zero contamination.

2026-08-08 (#162): superseded QUEUE state — "SELF-DRIVE STOPPED
(#159 red line). THE QUEUE SITS AT THE USER'S #161.5 FORK" →
the user ruled 考 after the VISION audit; S2-P1b (backLoaded
confirmatory, vs-NONE anchor) authorized and dispatched;
self-drive resumed with the same red lines.

2026-08-08 (#164): superseded QUEUE state — "THE USER RULED 考
(#162): S2-P1b backLoaded confirmatory is LIVE … SELF-DRIVE
RESUMED" → S2-P1b PASSED as frozen on all three legs (full-
magnitude dupRun replication ×1.0185; box pays; deep holds
level; offside flag quiet); self-drive chained to S2-P2
gene-ization (#164).

2026-08-08 (#165): superseded QUEUE state — "SELF-DRIVE IS ON
S2-P2 (gene family dormant …)" → S2-P2 banked (`950c702`,
verify PASS, one vacuous-test debt rides S2-P3, arming
checklist made binding after the separate-flag ratification);
S2-P3 frame frozen (#165.3) and dispatched.

2026-08-08 (#167): superseded QUEUE state — "SELF-DRIVE IS ON
S2-P3 (frame frozen #165.3 …)" → all three legs adjudicated
(F PASS 400/400; W PASS with the decisive set-grain
watchability face; S = H-165a unsupported honestly, the
make-it-pay question inherits to punish-compactness); S2-P4
play-test entry dispatched with the CERTIFIED FIXED world.

2026-08-08 (#168): superseded QUEUE state — "SELF-DRIVE IS ON
S2-P4: the play-test entry extends #156's a4World with v2 ·
discipline …" → the v2 entry merged (`d6c364c`, verify PASS);
slice 2's self-drive arc CLOSED (#159→#168); queue moved to
the user's acceptance session (v2 vs v1 vs off + the open
lever list), with punish-compactness / 乙 / slice-2 disposition
as the named after-verdict forks.

2026-08-08 (#169): QUEUE amended (not superseded) — the user's
scramble verdict (乱抢依旧/没有拿住球/逼抢压力出不去/节奏太紧/
尺子不够?) landed mid-acceptance; ruler-honesty audit confirmed
the relative-ruler blind spot (both-arm diseases can never fire
an A/B gate); the absolute possession/tempo census named as the
next instrument, awaiting go; v2 acceptance stays open in
parallel.

2026-08-08 (#173): superseded QUEUE state — "NAMED NEXT
INSTRUMENT (awaiting the user's go): the ABSOLUTE
possession/tempo census …" → the census arc ran end-to-end
(#170 grant → #171 verify-FAIL recorded as-is → #172 fix
banked → #173 adjudication): the gap table landed (spells ~2.2×
short, tempo ~2.3× real on the watched clock, 80.8% pressed
receptions, C7 wind-up absent), H-169a HOLDS on all three arms;
queue moved to the user's #173.4 fork (outlet seats vs
punish-compactness vs play-first).

2026-08-08 (#175): superseded QUEUE state — "THE QUEUE SITS AT
THE USER'S #173.4 FORK: (甲) outlet seats · (乙)
punish-compactness · (丙) play first" → the user ruled 甲; the
#174 inventory landed (seats mostly EXIST — C7 certified, T0R
shield passed, whether-seat parked on perception); the OUTLET
CONTRACT drafted + VISION-audited (O1 pass wind-up → O2 观察 →
O3 priced hold → O4 control-time); next authorized step = O1
phase-0 on "go".

2026-08-08 (#178): QUEUE amended — O1 phase-0 ran (#176
dispatch → verify FAIL → #177 fix → #178 banked): the
pass-release map + 2,000-match census landed (shortPass 79.8%
of open-play, one-touch 20.7%, pressed 73.4%, wind-up ≈4% of
played time); cut-1 frozen = shortPass only; next authorized
step = O1-T1 dormant seam on "go".

2026-08-08 (#183): superseded QUEUE state — "THE USER RULED 甲 →
THE OUTLET ARC IS OPEN (#174/#175) … NEXT AUTHORIZED STEP on
'go' = O1 phase-0" → O1 cut-1 ran end-to-end under self-drive
(#176 map+census [#177 FAIL → #178 banked] → #179 self-drive →
O1-T1 seam [#180 banked with commander-derived receipts] →
O1-T2 A/B [#181 FAIL → #182 banked → #183 adjudicated]):
equilibrium quiet, mechanism certified, F-O1b fired (tempo
1.7–4.3% of gap); queue moved to the user's #183.5 fork.

2026-08-08 (ops incident, post-#183): the QUEUE edit's find()
anchor missed on a line break and sliced PROGRAMME.md to EOF
(575 archive lines truncated in 41020db); caught on the next
status read, restored byte-identical from 9d6d106 (verified by
anchored diff), queue-tail seed ledger refreshed in the same
commit (7b92466). Lesson: QUEUE edits use anchored replace with
a matched-string assertion, never unchecked find() slicing.

2026-08-08 (#184–#186): superseded QUEUE state — "#183.5 FORK"
→ the user ruled 甲 (cut-1 banked); v3 entry merged + deployed;
O2 sizing banked (wedge still binds both arms — 抬头观察 stays
the binding seat); the user's v3-session verdict landed (进攻
配合好 · 弱侧后卫乱转 · 位置是活的 ontology → VISION §1
anchor); far-side defender forensic dispatched (H-186a:
modulation vs oscillation).

2026-08-08 (#188): QUEUE amended — the far-side forensic ran
and adjudicated (#186.4 dispatch → #187 verify-FAIL honestly
fixed → #188 banked with a one-clause commander correction):
H-186a(i) modulation-missing CONFIRMED all four worlds; the D1
mark channel named; oscillation cleared; queue moved to the
user's #188.3 fork (modulation arc vs mark-selection lens vs
O2-first sequencing).

2026-08-08 (#189–#190): superseded QUEUE state — "#188.3 FORK"
→ the user ruled 丙→乙→甲; O2 LOOK contract drafted+audited
(#189.2); the mark-selection map ran but verify-FAILED (#190,
two false trace mechanisms; core negatives verified standing);
fix round queued as the next step, then 甲 drafting + O2-T0.

2026-08-08 (#191): QUEUE amended — the mark-selection map
banked after one fix round + five commander one-line
corrections (#190→#191); the true far-side-glue mechanism
re-derived and verified; queued next = the 甲 modulation
contract drafting + the 乙-fix-scope decision, then O2-T0.

2026-08-12 (#250): superseded QUEUE state — the "SESSION
CHECKPOINT (2026-08-12)" resume-protocol block retired. As
written it held: the in-flight DV-T0 draft+verify workflow
"dies with the session"; resume = verify-then-adjudicate a
local commit if one exists, else delete untracked partials and
re-dispatch per the frozen brief (exposure traced, three belief
genes + wExposure born absent behind evolveDeliveryValue +
dvDeliveryValue, G-NOTABLE, identity stack + two-doors, seeds
12,430,000+/12,430,900+, stats ≥ 106,200), then DV-T1 → DV-T2 →
entry gate. The death premise proved FALSE — the workflow
survived the clear and landed c08f2eb itself; banked at #250
(two verifies reconciled, corrections c1cafe7, liveness-watch +
strict-seriality amendments). The frozen brief was satisfied by
the resurrected executor; the re-dispatched second executor
stopped honestly on the ownership rule (zero commits, zero
seeds).

2026-08-12 (#251): superseded QUEUE state — the #250 block's
"QUEUED: DV-T1 — THE MAP EXAM" tail replaced by the #251
adjudication: DV-T1 banked (eaa0314 + 3f5dea6), the deflation
moved for the first time (goals +0.2438 resolved at parity,
exposure limb the mover, truth-scale belief inaudible), F-DV-b
letter-fired/mechanism-refuted (anchor itself power-confounded
on fresh seeds), DV-T1b virgin-seed power extension queued;
DV-T2 drafting held for the user (fifth registration + the
§HONESTY 8 commensurability question + belief inaudibility).

2026-08-12 (#252): superseded QUEUE state — the "QUEUED: DV-T1b"
tail replaced by the #252 adjudication: T1b banked (bb773e9 +
632fb11) on 643 virgin seeds sized ex ante; supply limb RESOLVED
HELPFUL at the DV arm (F-DV-b closed permanently), goals limb
unreplicated (+0.040 vs T1's +0.244, CIs overlap) ⇒ #251.2's
"inversion COMPLETE" consequent amended: supply half stands,
goals half open. Control reconciliation: both batteries'
percept controls agree (~2.13–2.17) and sit IN the bare-world
band — the deflation is plane-arm-specific; the band census
question partially answered. Overnight self-drive 2026-08-11/12
ended with #252; the arc paused at the user's morning gates
(goals magnitude · DV-T2 drafting · band census · MT #213).

2026-08-12 (#254/#255): superseded QUEUE state — the #253
morning-rulings block replaced. #254: T1c banked (88dc9dd),
goals Δ −0.0114 [−0.083, +0.056] at N=1936 sized exactly for
the pooled +0.104 ⇒ monotone shrinkage across three batteries,
tri-pool +0.024 [−0.034, +0.082] ⇒ the goals half of the #244
inversion closed HONEST-NEGATIVE at these doses; the deflation
question returned to the plane/DLC ledger; supply/behavioural
gains stand. #255: the six-source label ledger ratified, the
fifth registration frozen verbatim (账本学形状), the DV-T2
learned-map contract bound (learning supersedes co-evolution;
selection measured deaf twice); T2-C0 pass-level census
dispatched; arc = T2-C0 → T2-T0 → T2-T1 → play-test (user
gate).

2026-08-12 (#256): QUEUE amended — T2-C0 banked (389b304 +
corrections): the pass-level truth table measured (own 3.655 % >
middle 3.021 % > final 1.936 % at the 10 s primary, #246 shape
RESOLVED-CONFIRM both limbs, no inversion), the convergence
yardstick frozen (marginal form — the executor's primary-quantity
switch ratified, contract §3 corrected: the commander's drafting
slip, the §HONESTY 8 commensurability class caught early); the
rarity fact published (final zone 0.1 punished/team-match ⇒
T2-T1's run-length/season-reset design crux, #256.3); T2-T0 the
dormant learning seam dispatched.

2026-08-12 (#257): QUEUE amended — T2-T0 banked (3f085b0 +
5d0b2a7, 21/21 of record): the per-team account book built,
dormant, epistemically honest (imports only DV_BELIEF_SLOTS,
reads only own events + public scoreboard); the executor's
Lamarck catch ratified (match-local gene views, never the
franchise — crossover would inherit a present belief even with
the opt-in shut); the 40-match smoke already shows the true
ordering in the pooled book. T2-T1 frame drafted (#257.3):
bare world doors-shut, learn-only primary arm + learn+consume
reported, the registration predicate sharpened (mean-vector
resolved ordering AND ordered-book share ≥ frozen threshold at
ex-ante-sized M — every-book-strict was over-brittle), M
derived from committed rates, F-DV2-a/b/c; T2-T1 dispatched.

2026-08-12 (#258): QUEUE amended — T2-T1 banked (e912fc8 +
43f5e18): ⭐⭐ THE FIFTH REGISTRATION SCORES POSITIVE (40/40
books strictly ordered, both mean-vector gaps resolved, in a
learn-only world proven byte-identical to off; the shape
present from 10 matches, M buys per-book precision); the
steeper-than-census flag resolved benign (all book means inside
the census's own CIs); learn+consume reported clean (39/40,
starvation ~1-2%, guards green). The 2026-08-11/12 self-drive
chain (#250–#258) ENDS at the play-test user gate.

2026-08-12 (#259): QUEUE amended — the user deferred the
play-test gate and ordered substrate self-drive (基建底座自走).
The earned-knowledge discharge arc opened at the #248 archetype
debt (the whetherEye certified hold table): EK-HOLD contract
drafted+bound (load-bearing finding: the certified cost is
counterfactual and unlearnable — the earnable layer gets an
OBSERVABLE label + its own census yardstick; pressure-band
coarseness; T2-T0 canon inherited); EK-C0 dispatched. The
six-source rungs stay queued for the user's own registrations.

2026-08-12 (#260): QUEUE amended — EK-C0 banked (d5dfced +
ba0e240, 17/17): the observable hold label measured and the
#246 check SPLITS — pressed>mid confirmed everywhere, but
perceived-FREE holding is the MOST punished band (79.4%,
resolved-invert at 10/15 s) ⇒ the pre-registered 街机偏离
routing fires. Context: label near-saturates (churn ~5.5 s),
free band rare, grid cap binds (opening stretches), the
certified counterfactual licenses holds exactly in the
most-punished band (different quantities, not a
contradiction). EK-C0b diagnostic dispatched (wedge vs
selection vs saturation, pre-registered predicates); EK-T0/T1
wait on its verdict.

2026-08-12 (#261): QUEUE amended — EK-C0b banked (6b98e36 +
a03df32, 16/16): the 街机偏离 test CLOSED — the inversion is
genuine world structure (wedge DENIED: truth-banded it doubles,
percepts only under-read; selection CONFIRMED: free holds are a
different situation — 39% own-third, +4m true distance, role
mix shifted; 4/5s resolve nothing). Picks of record: window
10s, target shape = the measured truth (free>pressed>mid),
exploration answered by the training-ground venue (dosed-hold
drills), consumption = zero-constant comparative veto. EK-T0
dispatched.

2026-08-13 (#262): QUEUE amended — EK-T0 banked (ff56b60 +
corrections, 23/23): the hold-belief seam dormant, GENE-FREE
(Lamarck closed by construction — consumption reads the book
directly), decline-only veto as integer cross-multiplication,
freshness-refusal rather than guessing; whitelist canon
third-visit upgrade. EK-T1 dispatched (the #257.3 frame on the
hold family); on its adjudication the #248 archetype debt is
marked discharged.

2026-08-13 (#263): QUEUE amended — EK-T1 banked (5fc8488 +
corrections): H-EK NEGATIVE vs the clone-dosed yardstick (books
converged tightly to mid>free>pressed — not the census shape;
0/40; F-EK-a+b fired, F-EK-c leak-proof). The hunt closed:
VENUE MISMATCH — clone-dosed yardstick vs in-timeline
accumulating drills, the #256.2 class one level up ("the
yardstick must be measured in the venue the learner lives
in"); commander owns the design defect. EK-C0c dispatched
(in-timeline census + re-score of the committed books as
H-EK'); on MATCH the #248 archetype debt is discharged, on
MISMATCH stop to the user.

2026-08-13 (#264): QUEUE amended — EK-C0c banked (f67bdea +
corrections; the verify's HIGH ratified): the corrected
in-timeline yardstick = mid 83.27 > free 82.47 > pressed
78.73 % — the books' own ordering, mid's venue shift +13.8pp
confirming the #263 diagnosis completely; books faithful at L1
relative 0.0024; limb (ii) proven unpassable-by-construction
(perfect learners expect 63.8% vs observed 62.5%) so the "seam
defect" route consequent withdrawn as a dead predicate; the
venue truth's robust shape = {mid≈free} > pressed; 626-vs-632
closed (Match.ts:4107 vs :4128). The EK arc paused at the #248
discharge fork (甲 substance-discharge recommended · 乙
tie-aware re-score · 丙 leave open) — the substrate
self-drive's closing ruling.

2026-08-13 (#265): QUEUE amended — the user's day rulings: the
aesthetic criterion registered verbatim (emergent
配合/技巧/博弈/对抗/战术, visibly, over mimicry — the
programme-wide first filter); the 无脑抢 diagnosis ratified
(no dribble threat ⇒ swarming rational ⇒ the duel's missing
half); the CB carry-beat contract drafted+bound (layer 1
commitment physics + touch-past, layer 2 choice seat, frontend
visibility contractual, layer 4 permanently out); CB-C0 queued
for dispatch after the user's compact; the #248 discharge fork
left open pending the user's explicit word.

2026-08-13 (#266): QUEUE amended — CB-C0 banked (draft+verify;
`6d886a6` + corrections): the take is GEOMETRY-BLIND
(tryTackles selects by distance; taker motion nowhere in the
probability; take rate flat across speed/direction/state);
overcommitment exists (15.5%) and is NEVER punished (three
signals null, retention −0.4pp [−4.1,+3.3] a tight null);
miss price kinematics-blind (constant modulo the whistle
path); duels frontal by construction (0/9,956 from behind);
withheld challenge real (~⅓ of proximity ticks); churn
baseline spells 4.3569 s, duels in longer spells; all four
#246 shapes UNRESOLVED-FLAT = the engine-expected flatness,
no 街机偏离 — the flatness IS the finding, §0 confirmed at
census grain. One HIGH ratified (Δsep/Δspace t0 = taker→ball
baseline; paired verdicts survive; CB-T1 must anchor t0 at
the carrier); four dead gate conjuncts demoted; canon
extended (#266.3: hashed body excludes ALL invocation
context · conjunct-liveness before freeze · freeze lands in
its own commit). Next: CB-T0 dispatched (seeds
12,472,000-999, stats ≥ 109,800).

2026-08-14 (#267): QUEUE amended — CB-T0 banked (freeze→gates→
results commits, the #266.3(c) canon's first exercise): the
reachability-slack primitive (χ = clamp01(SLACK/R) multiplying
the untouched incumbent take; recovery = brake+turn+close
replacing the 1.2s/0.35s constants, bit-exact re-derived;
touch-past = the engine's own release+race, aimed, zero rng —
the back compass opens); dormancy proved adversarially (48/48
virgin-seed byte-identity, fingerprint unchanged, 25-family
doors matrix); armed smoke: beaten events exist, 50.3% of
armed lunges condemned by geometry, take 35.8%→6.3%, goals
+60% (doser's world, REPORTED). wallTerm HIGH ratified
(#266.3(a) NOT discharged — claim withdrawn; resultSha256
machine-dependent; fix binds CB-T1 by field name); "610
beaten" demoted to predicate count (validation binds CB-T1);
p·χ doubt ruled 甲 — untuned, no post-sight floor (丙
rejected as the dice subsidy re-introduced); recovery level
stands as derived. Next: CB-T1 (seeds 12,473,000–999, stats
≥ 109,800 unconsumed).

2026-08-14 (#268): QUEUE amended — CB-T1 banked: ⭐⭐ H-CB.1's
world-event half PASSES all three limbs (predicate validated
vs the engine's own race, gap 32.2pp against a 5pp bar,
reproduced on verify's independent instrument; recovery
physics-derived+monotone with the full distribution incl.
min; touch cost honest −8.2pp; world effects reported never
gated). wallTerm class genuinely discharged (cross-machine
digest equal); mutant exactly-one enforced (doctored
double-flip went red). Liveness canon upgraded after third
recurrence (21/55 dead conjuncts): coverage map machine-
derived, every conjunct needs a flipping mutant or the probe
refuses to run. Doubts ruled: dosed-world levels re-read
under CB-T2's chooser; both-doors-armed = CB-T2's first row.
Next: CB-T2 choice seat (seeds 12,474,000–999, stats ≥
110,000).

2026-08-14 (#269): QUEUE amended — CB-T2 banked (ROW-0→freeze→
results): layer 2 complete. The knock = a delivery to the
carrier himself, priced by the SAME hoisted groundCandidate
in the same currency (zero new constants at whitelist grain);
compass derived at CONTROL_RADIUS resolution; cbCarryProneness
born absent, neutral form DERIVED (G-ZERO: 35,745 priced, 0
chosen, byte-identical); dormancy 10/10 on verify's own seeds;
machine-liveness held under two deliberate break-ins. Chooser:
20.7 knocks/match, back compass 21%, incumbent direction only
2%; both-armed world spells lengthen 4.74→5.24s, take 4.4%.
The draft's headline strain (offside ×0.08 on knocks) proven
PHANTOM by verify (structurally unsatisfiable; 0/2400 vs the
published 20.8% proxy-on-wrong-denominator) — doubt withdrawn;
real strain = short-ball ×0.75 on 100% of knocks (uniform, no
patch, named to the pricing-family question + style-evolution
arc). L3 cost null under the chooser (cross-arm mixing caveat;
甲/乙 deliberately undecided — proneness selection is the
instrument). Next: the frontend visibility rung (M-CB.3, seeds
12,475,000–999, stats ≥ 110,200), then the play-test USER GATE.

2026-08-14 (#270): QUEUE amended — the frontend visibility rung
banked (freeze→results→#270.2 fixes): beaten events legible
from REAL state only (release ring, past-positions ribbon,
recovery-lockstep ring with no render-side duration constant);
render layer PROVEN read-only (armed sim byte-equality with
and without the bridge); entry live (⚙→🧬 「CB · 过人世界」,
?a4world=6, dose 1.0 declared presentation; dose kept OUT of
info.genome — better than the A4/MT idiom, Lamarck-safe).
Three user-facing defects fixed pre-gate: ring semantics
taught honestly (55% of ring-seconds are incumbent slide/grab
constants — the commitment story lives in standing-challenge
rings), rates unified onto the 240s match clock (≈16 knocks/
match), replay chord-splice fixed one-line. E4 containment
corrected: armed play moves the league save history (doors
ride league-wide). ⭐⭐ THE CARRY-BEAT ARC PAUSES AT THE
PLAY-TEST USER GATE (过人时刻 expected YES; 博弈 honestly NOT
YET — layer 3 unbuilt). Self-drive stops here per the
contract's own gate.

2026-08-15 (#271): QUEUE amended — the RULER-COVERAGE contract
bound on the user's question (尺子够吗?眼睛看不全): ruler
inventory ruled diagnosis-driven; five blind spots of record
(absence · between-team variance · season grain · sequence
structure · gap table not institutionalized). R-甲 event-
vocabulary census (vocabulary frozen BEFORE reading the
engine) + R-乙 standing gap table (cited real values, re-run
clause) dispatched; R-丙 style-dispersion named/queued.
Performance case opened on 「有点卡」 (read-only diagnostic;
prime suspects: sim-step p99 spikes, league-wide CB doors
while armed, background league sims, per-frame allocations).

2026-08-15 (#272): QUEUE amended — both rulers banked with heavy
corrections. R-甲: 146 entries frozen-before-engine (byte-proven);
corrected P88/D34/A24, carrying 1/14; absence map quotable (①
nobody can lie ② tackle=distance coin-flip ③ no contact game ④
craft never an act ⑤ defenders have no relationships ⑥ three
combination patterns ⑦ no second phase); name-shaped
classification trap on record (A3/A13/C3 demoted); vocab v2
registered. R-乙: institution REAL (ledger append+refusal,
cross-OUT, 20/21 re-derived) but Q11 sign INVERTS when
commensurable (take-ons AT/ABOVE real), the "all below real"
pattern = two-clock artifact (duration rows stand), margin
tails NOT below real, five invented band widths superseded.
INFO-DOCTRINE.md registered verbatim (four user messages; two
processing tiers keyed to recognition from born-absent books;
pressing = time-budget attack; positioning = the latency-free
answer that must EMERGE). Knocker-aftermath probe of record:
info gap NEGATIVE today (10-tick stale-label lag vs defenders'
1 tick; flat-1.6s mid-race abandons; teammates banned from his
race). Dispatched: CB aftermath polish (knock-and-go + derived
marker law, armed-path scoped) then R-乙 instrument fix +
post-polish epoch. Perception contract = NEW USER GATE.

2026-08-15 (#273): QUEUE amended — the stopgap round banked.
CB polish: knock-and-go (decisionTimer=0 at release, the gate's
own threshold) + derived marker lifetime (max(window, recovery
aimed at D∞); D∞ ruled a DECLARED CHOICE — the unique knock-only
upper bound); lag 10→1 tick, regather 57→76%, back-half 26→50%,
abandons 9.1→0.16%, opposition share 31.8→15.1%; production
byte-identical; the touch-past info gap now ZERO (positive =
perception contract, user-gated); CB-T1/T2 armed numbers stale
of record; the v6 play world moved — next verdict reads the
polished world. R-乙 fix+epoch2: take-on success (contested)
0.641 vs real 0.40–0.48 — ABOVE real, inverse of the
quarantined row; dual-axis clock law everywhere; five REAL rows
point-faithful; ledger append-only with 16 supersessions;
tree-clean gates must compare HEAD not index (canon); epochs
may pair the control arm from epoch 3. The programme PAUSES at
the user gates (play-test on polished world · perception
contract · perf menu · #248 · six-source · layer 3 · R-丙 ·
deflation · pitch×numbers · pricing staleness).

2026-08-15 (#274): QUEUE amended — the CB play-test verdict
landed: 过人 PASSES at the user's eyes (verbatim registered);
the carry-beat arc CLOSED POSITIVE — the programme's first
user-passed capability arc. Residual diseases registered: 乱抢
(expected; treatment = layer 3 defence book, its gate NOW OPEN
by this verdict) · no build-up (new named disease; partly
downstream of the swarm, partly structural — nobody comes
short, E7/A10/CTB rows; a future assembly-and-learning arc
over banked dormant seams, not opened). Recommendation: layer
3 now, build-up contract after on the calmed world.

2026-08-15 (#275): QUEUE amended — the SIXTH REGISTRATION frozen
verbatim (边锋/中锋过人多、边路爆趟是过人手段、必须涌现)。
Team-level gene constraint registered (proneness is per-team ⇒
personnel channel needs the #165 slot-offset idiom, named for
the style-evolution arc; R-丙 its ruler). Baseline census
pre-registered (lane×third×role, exposure vs preference,
pricing gradient, along-line share; expected shapes frozen;
three outcomes pre-named) and dispatched read-only on scratch
seeds. Layer-3 recommendation unchanged.

2026-08-15 (#276): QUEUE amended — the sixth registration's
baseline census: geometry+exposure ALREADY produce
winger-dominant dribbling (55.2% of knocks, highest preference)
and the 爆趟 signature (wing 56–63% along-line vs centre 25.5%;
wing races safer — the touchline trades interceptions for
throw-ins); the lane×third interaction is real football's shape
(final third wing-biased, own third clearance-inverted; pooled
flat). Missing: 内切 (≤5%, no post-knock shot value in the
table — named to the pricing family), the personnel channel
(style arc). One probe citation struck (resurrected CB-T2 R9's
superseded 20.8% — canon reminder: check corrections sections
before quoting). Short-ball band covers 100.00% of knock
candidates, confirmed at scale.

2026-08-15 (#277): QUEUE amended — the user's 「go」 opens LAYER
3: the defence-book contract bound (扑了→被过→受罚; per-team
per-arrival-band gene-free book; decline-only veto — the world
can only get more patient where its own history says so; 乱抢
= reported world effect, play-test the user gate). L3-C0
lunge-outcome census dispatched on the polished armed world
(seeds 12,480,000–999, stats ≥110,800); arc = C0→T0→T1→T2→
play-test.

2026-08-15 (#278): QUEUE amended — L3-C0 banked: the armed lunge
wins 6.2% (bare 37.6%), χ condemns 46.5%, yet 16.8 lunges/team/
match and restraint thins where arrival is fastest — 乱抢
measured at its purest. THE LABEL PICK NOT RATIFIED: window
confound HIGH (the pick's window IS the recovery = a function
of the indexed band; common-window flat-to-inverted) — L3-C0b
dispatched (common windows · two-window contrast · P(won)
re-examined under the veto's ordering frame; candidates CLOSED).
Wrong-cell citation struck (37.1%→37.565%; the #276.3 class's
second strike). Armed miss cheaper in time than the old
constant → pricing shelf. T0 waits on C0b.

2026-08-15 (#279): QUEUE amended — L3-C0b banked: the confound
decomposed (68% clock / ~4pp world-taught, RESOLVED on both
common rungs; a STEP at the overcommitted band; signal dead by
1.2s; P(won) failed replication + coin-flip books). THE LABEL
RULED: carrier-anchored separation over an ENGINE-DERIVED
common window (sqrt(2R/a)+π/ω ≈ 0.888s family, no typed
numbers), grain g2 reckless-vs-controlled (g3 fallback);
T1 yardstick re-measured AT the frozen window; T1 multi-season;
decline-only = wrong books cost patience (fail-safe). Citation
class = hat-trick → standing hunt item. L3-T0 dispatched
(seeds 12,482,000–999, stats ≥111,200).

2026-08-15 (#280): QUEUE amended — L3-T0 banked: the defence book
exists dormant (g2, gene-free, own-events; veto token-identical
to EK's, decline-only proven in both dosing directions; dormancy
16/16 cross-tree vs a pre-seam archive). Applied window 54 ticks
= 0.9000 s becomes the law of record (nominal = provenance);
restart contamination 13.7% accepted (yardstick shares the bias,
group-neutral to first order) with a phase-sensitivity rung
binding on T1; the falsified count-proxy comment fix assigned to
T1. The PREFIX identity re-spec ratified (a born-empty book earns
evidence mid-match — the frozen claim was wrong, the world
right). L3-T1 dispatched (multi-season, yardstick at 54 ticks,
seeds 12,483,000–999, stats ≥111,200).

2026-08-15 (#281): QUEUE amended — L3-T1 banked POSITIVE: 16/16
books learn reckless>controlled from own beatings alone (τ=12/16
derived+alive both ways; books within 0.04pp of their own
world's truth; phase rung flips nothing; τ cleared only at 12
seasons — the fourth self-cluster learning positive). THE
SLOW-KNOWLEDGE PROBLEM registered (season-reset wipes faster
than the lesson accrues; one season = 68.75% < τ): T2 runs both
book arms (shipped reset primary, matured contrast); coach
channel = the named accelerator, user-gated. L3-T2 dispatched
(armed world read, 乱抢's faces reported; seeds 12,484,000–999,
stats ≥111,400); the play-test after it is the user gate.

2026-08-15 (#282): QUEUE amended — L3-T2 banked (no HIGH): the
veto suppresses exactly the right thing (reckless −71.6% young
/ −100% matured; substitution not passivity — the matured world
throws the same challenges, just never at full tilt; young books
mis-aim 72% of refusals and still deliver — decline-only
fail-safety as designed; tempo pre-reg falsified in sign and
published: slightly quicker, not calmer; fouls/yellows −6.5%).
SELF-STARVATION discovered: the matured book eliminates its own
food ⇒ THE SEASON RESET STAYS (slice-one law: fail-safe AND
food supply); coach channel = the accelerator road. 乱抢
TREATED IN MECHANISM, user's eyes pending. Entry rung
dispatched (?a4world=7: book live, dosed matured cells via
opt-in chunk, dose = declared presentation; §HOW-TO-SEE: no
full-tilt dives, not fewer challenges). Then THE PLAY-TEST
(user gate) — the arc pauses there.

2026-08-15 (#283): QUEUE amended — the entry banked and THE
LAYER-3 ARC CLOSES (seven rounds, all adversarially verified):
?a4world=7 = the defence book live (matured dose as opt-in
chunk, Lamarck-safe; reckless lunges 0.0000 through the entry's
own path; ?l3dose=0 = the empty-book weak form). Install cost
corrected (+2.06 kB gz). Family-wide fact ratified: worker-
simmed fixtures play the SHIPPED world (matchFlags not
serialized — true since #155, now stated and pinned). 乱抢
TREATED IN MECHANISM; the programme pauses at the play-test
user gate (全速飞铲消失了吗 · 博弈还是犹豫 · 稍快能接受吗).

2026-08-15 (#284/#285): QUEUE amended — the L3 play-test gate
CLEARS (防守确实还可以 — 乱抢 treated, user-confirmed; the
second user-passed arc). The TOUCH-WEIGHT doctrine registered
verbatim (方向×力量 = the complete touch space; 扣/拉/变速
become coordinates, not a move library; named M-CB.5, on the
menu). 两种爆趟 recorded (incumbent auto push vs chosen aimed
knock; the one-table frontier question noted). The BUILD-UP
contract bound (assembly arc over banked seams: CTB·MT·EK·DV·
O1/O2·B9; new cuts only where the census proves a hole; the
arming-lifecycle debt due here). BU-C0 queued for dispatch
AFTER the user's compact (seeds 12,486,000–999, stats
≥111,600) — the #265 handoff form.

---

**2026-08-15 — #286 (BU-C0 adjudicated; QUEUE superseded).** The QUEUE's "NEXT
SELF-DRIVE ACT: BU-C0 …seeds 12,486,000–999, stats ≥ 111,600" block is
superseded by the BU-C0-LANDED + BU-T0-IN-FLIGHT block. WHAT: the reception-
option census landed (`24bae92` freeze → `3d44347` result; verify
PASS-WITH-FINDINGS, all headlines re-derived from committed cells). WHY IT
MATTERED: it flipped the arc's presumed first slice — the contract's §0 story
("nobody comes short", E7 aheadBias) expected the BODY to be missing; the
ladder proved the bodies already stand there (2.605/reception behind the ball)
and the LANE kills them (77.45 % of option loss at L4; bare-arm interception
40.48 % the largest terminal class). E7 grain-corrected, keeper share 54.20 %
exposed, #246 confirmed (0.7775 options/reception). DECISIONS: BU-T0 = DV maps
in the v7 composition (not CTB — deprioritised at the corrected end-to-end
statistic); B9 do-not-schedule; the pass-weight door (B4, M-CB.5's sibling)
registered as a USER DOOR, excluded by M-BU.4 this arc; H-BU.1's scoring seat
amended to ARC EXIT on the assembled composition. LESSONS BANKED: the fifth
citation strike (M-DV.3 quoted from the implementation doc); "an inherited fix
announced is not a fix ridden" (xSrcUntouched claimed #273.3's WORKTREE-vs-HEAD
form, shipped the INDEX form, held only via its second conjunct); GK-split
rungs now a debt on every ladder quote; armed terminal shares carry the veto-
entanglement caveat. Consumption: block 12,486,000–999 consumed; stats 111,600
walked. Next block ≥ 12,487,000; next stats ≥ 111,800.

---

**2026-08-15 — #287 (BU-T0 adjudicated; QUEUE superseded).** The QUEUE's
"IN FLIGHT: BU-T0 — THE DV SLICE" block is superseded by the BU-T0-LANDED +
BU-T0b-IN-FLIGHT block. WHAT: the DV composition slice landed (`eeff10d` freeze
→ `9847be6`; verify PASS-WITH-FINDINGS, all LOW) and the pre-written labelled
hypothesis FIRED — 57/57 faces null, no weight touched. WHY IT MATTERED: the
arc's first assembly slice proved the banked DV seam AS SHIPPED cannot see the
corridor (grain: three pitch thirds vs a lane-shaped loss; or loudness:
~0.004–0.008 score units of price), so the arc pivots to SEPARATING those two
explanations before spending the next slice. Also banked: the #269.2(iv)
lifecycle debt DISCHARGED at CB+L3+DV (with the S∧¬T staleness class exhibited
— real, inert, filed as the S∧¬T-guard debt on the next CB src round); the
GK-split debt discharged (corridor = 82.08 % of OUTFIELD option loss; keeper's
ball survives lanes 2.3× an outfielder's); BU-C0's faces replicated on virgin
seeds. LESSONS: re-derivation gates must read the serialized artifact, not the
in-memory rows (gFaces); "discharged" ≠ "exercised" — the withdrawal path never
behaviourally fired and the record says so. DECISION: BU-T0b price-separation
probe (derived λ-ladder, instrument-only) BEFORE BU-T1 = MT keep/hold, because
the separation verdict decides whether the arc still has an admissible fix
(derived calibration) or the lane's levers are all user doors. Consumption:
block 12,487,000–999 consumed; stats 111,800. Next ≥ 12,488,000 / ≥ 112,000.

---

**2026-08-15 — #288 (BU-T0b adjudicated; QUEUE superseded).** The QUEUE's
"IN FLIGHT: BU-T0b" block is superseded by the BU-T0b-LANDED + BU-T1-IN-FLIGHT
block. WHAT: the price-separation probe landed (`6520311` freeze → `b1a9cc4`;
verdict MIXED on pre-registered clauses; verify PASS-WITH-FINDINGS 2 MED +
4 LOW). WHY IT MATTERED: it answered #287's fork in a way neither branch
predicted cleanly — the loud price DOES move the chooser (the level axis fires,
52/114 contrasts resolve) but the map's own earned content (own third most
punished) makes any loud zone-grain price ANTI-circulation: the team stops
passing backward instead of re-routing. The differential axis (which lane) is
arithmetically unreachable through the seam (ceiling = 37.5 % of the choice
margin). And the corridor's lethality is PRICE-INVARIANT (outfield conversion
flat at every rung) — third independent confirmation that the lane has no
banked cover. DECISIONS: the derived-calibration fix STRUCK from the arc
(menu-noted as a safety/tempo lever); BU-T1 = MT keep/hold dispatches as the
arc's last assembly slice; the play-test will be read against the stated
ceiling (assembly cannot treat the lane; B4/perception/movement are user
doors). LESSONS: the SIXTH citation strike originated in the COMMANDER'S OWN
dispatch prompt ("#286.5") — the standing hunt now covers dispatch prompts;
starred findings must state |Δ|÷half-width (the pressed-supply rise is 1.26×,
marginal, banked only as the labelled hypothesis 持球买身后支援); the knock is
priced through the same groundCandidate as passes (the level-axis mechanism
sentence corrected). Consumption: block 12,488,000–999 consumed; stats 112,000.
Next ≥ 12,489,000 / ≥ 112,200.

---

**2026-08-15 — #289 (BU-T1 adjudicated; the build-up assembly arc CLOSES; QUEUE
superseded).** The QUEUE's "IN FLIGHT: BU-T1" block is superseded by the
ARC-CLOSED + FORK-GATE block. WHAT: the MT slice landed (`6cd1cde` → `77b6345`;
verify PASS-WITH-FINDINGS, all 62 faces re-derived independently) and H-BU.1
was SCORED NEGATIVE at arc exit — options exist thinly, usage is decisively
flat. WHY IT MATTERED: this completes the arc's proof end to end — the banked
inventory CANNOT produce build-up. The census proved the corridor owns the
loss; DV (as shipped) nulled; the loud price re-routes AWAY from circulation;
price-invariance proved the corridor is pitch physics; MT opens the lane only
marginally and doesn't move usage. M-BU.1's own law is now satisfied row by
row: the hole has no banked cover. DECISIONS: the exit play-test is NOT spent
on a world instruments already scored (the user's eyes are reserved for the
fork); the gate transforms into the DOOR CHOICE — ① pass-weight (B4, M-CB.5's
sibling, RECOMMENDED: the only lane-physics lever) ② perception ③ coached
movement ④ EK-holds (the 持球买身后支援 proper test). MT's true grain recorded
(the coupled sag world; "keep/hold" was the user's verdict word, not an event
class); the pressed-supply hypothesis survived its second marginal reading but
its antecedent never occurred. LESSONS: preflight facts inside the hashed body
(the #266.3(a) class again — envelope, by name, next generation); arming
receipts must never be quoted as effect sizes; a dose-source guard should hash
file bytes, not a self-declared field. Consumption: block 12,489,000–999
consumed; stats 112,200. Next ≥ 12,490,000 / ≥ 112,400. THE PROGRAMME PAUSES
AT THE FORK GATE.

---

**2026-08-15 — #290 (the fork resolves; the pass-weight arc opens; QUEUE
superseded).** The QUEUE's fork-gate block is superseded by the PW-ARC-OPEN +
PW-C0-IN-FLIGHT block. WHAT: the user chose door ① (verbatim 「1」) at the
#289.5 fork — the pass-weight axis, the commander's recommendation ratified.
The PW contract was drafted and bound (#290.2): the pass half of the #284.2
touch-weight doctrine, physics-honesty-first, the chooser through the existing
one table, the dominance hazard (free-to-receive rockets) named with a derived
receiving cost as the guarded prerequisite. WHY THIS DOOR: the BU arc proved
end-to-end that the corridor is pitch physics no banked seam can price or open
(#286–#289) — weight is the only lever that touches the lane's physics, and it
is the user's own doctrine on the pass side. PW-C0 (the weight-physics census)
dispatched: audit powerMultiplier's honest propagation, derive the rung ladder
from the clamp's own algebra, measure corridor survival per rung × direction ×
GK-split, audit today's receiving cost. Doors ②③④ hold unopened. Seeds
12,490,000–999; stats ≥ 112,400.

---

**2026-08-15 — #291 (PW-C0 adjudicated; QUEUE superseded).** The QUEUE's
"IN FLIGHT: PW-C0" block is superseded by the PW-C0-LANDED + PW-T0a-IN-FLIGHT
block. WHAT: the weight-physics census landed (freeze → disclosed re-freeze →
result; verify PASS-WITH-FINDINGS with the session's first HIGH). WHY IT
MATTERED: (a) the axis is real and honest — exactly-linear multiplier,
expressible region [0.85, 1.15] from the substrate's own clamp, ladder = the
engine's own canary rungs, and the denominator-stable face moved +3.94 pp
(outfield backward end-to-end 21.09→25.04 % — the biggest single-lever movement
of the whole build-up effort); (b) the HIGH: DIVERGENCE-1 — the oracle never
priced the passer's body orientation at any power (pre-existing engine fact,
census survives because its instrument IS the live chooser's oracle; the
orientation-aware oracle routes into PW-T0b under the flag as self-knowledge);
(c) the dominance hazard fires CHOOSER-SIDE (the engine charges ~half the gain
but the chooser-facing ladder can't see it; the shipped joining rule at
population means picks max weight under both curves) — so PW-T0a measures the
PER-OPTION preference distribution before any src work; (d) direction-neutral
slab ⇒ forward-shifted usage pre-registered as PW-T1's PREDICTED outcome;
weight concentrates loss into the corridor (4th pitch-physics confirmation).
LESSONS: the SEVENTH citation strike again originated in the commander's
dispatch (BU-T0's numbers of record attributed to BU-T1) — briefs now cite
(doc, section) pairs and executors verify the brief's attributions first; a
divergence audit must diff TERM LISTS, not evaluate shared expressions; a
chosen weight must ride the pendingPass through wind-up resolution (the fourth
call site). Consumption: block 12,490,000–999 consumed; stats 112,400. Next ≥
12,491,000 / ≥ 112,600.

---

**2026-08-15 — #292 (PW-T0a adjudicated; the fork ruled; QUEUE superseded).**
The QUEUE's "IN FLIGHT: PW-T0a" block is superseded by the PW-T0a-LANDED +
PW-T0b-IN-FLIGHT block. WHAT: the preference census landed (verify
PASS-WITH-FINDINGS; every distribution re-derived twice over). WHY IT
MATTERED: it killed the naive chooser design before any src was spent — the
shipped joining rule prefers the SOFTEST ball on ~4/5 of published survivors,
and the reason is structural (L4 admission ⇒ all survivors are threat-q0 ⇒ the
corridor half of the price is saturated; only the soft-monotone touch term
remains). The census's lasting insight: soft-to-feet among safe options is
CORRECT football; the firm ball's value is in ADMISSION (options that only
exist at higher pace — the union population, the 6.4 % refusal set), which the
fixed-option design could never see. DECISIONS (#292.4): PW-T0b = the
RUNG-GRAIN chooser — (mate × rung) enumeration through the shipped oracle with
per-rung admission, one table, BASE curve (heavy struck: measured to worsen
the axis); orientation-aware oracle under the PW flag only (DIVERGENCE-1
measured load-bearing: on 35 % of options the passer's body costs more pace
than the whole ceiling gain); the chosen weight rides the pendingPass.
Pre-registered emergence shape: 小力到脚 + 大力穿缝; forward-shift predicted;
the region may be thin. LESSONS: a mean of a step function is not the step
function of the mean (population-mean dominance and per-option floor-degeneracy
coexist); admission grain vs price grain is the load-bearing distinction;
verdict labels are population-contingent — mechanism over label. Consumption:
block 12,491,000–999 consumed; stats 112,600. Next ≥ 12,492,000 / ≥ 112,800.

---

**2026-08-16 — #293 (PW-T0b adjudicated; the fork ruled; PW-T0c ordered; QUEUE
superseded).** The QUEUE's "IN FLIGHT: PW-T0b" block is superseded by the
PW-T0b-LANDED + PW-T0c-IN-FLIGHT block. WHAT: the rung-grain weight chooser
landed as a dormant seam (three src files; byte-identity double-proven — world
digest + the league fingerprint unmoved; 1499/1499; the CB seat's arming block
machine-asserted untouched). The executor's own catch of record: a fourth
argument on the strike statements broke five banked pin suites ⇒ restructured
to the deposit/consume idiom (the weight travels on the match), keeping every
certified statement byte-for-byte. WHY THE AMENDMENT: the verifier proved the
PW price as built DROPS the world's own objective (v7 prices mates on the
armed value axis; the PW chooser re-priced on reception×touch and dropped
seen-unread mates) — the exam would conflate "weight" with "a thinner mate
chooser". DECISIONS (#293): the price IS the admission (no census-grain
filter — it would double-count what the per-rung threat price sees); PW-T0c
before the exam = objective fidelity + candidate-set parity + the pin suite
per house precedent + the cancelled-wind-up re-deposit + PTP×PW named as an
unsupported composition door. LESSONS: literal-spec emptiness can be empirical
not structural (orientation × lead terms — retract "structurally" unless
derived at the caller's own operating point); committed artifacts carrying
false fields need correction OF RECORD, not just a doc note (#287.1 sends
readers to the artifact); joint-argmax seams must inherit the world's own
objective or the exam is unreadable. Consumption: block 12,492,000–999
consumed; stats zero drawn (floor stands 112,800). Next block ≥ 12,493,000.

---

**2026-08-16 — #294 (PW-T0c adjudicated; the exam dispatches; QUEUE
superseded).** The QUEUE's "IN FLIGHT: PW-T0c" block is superseded by the
PW-T0c-LANDED + PW-T1-IN-FLIGHT block. WHAT: the objective-fidelity amendment
banked — the PW price now CALLS the shipped pricePassOption under the world's
own flags with the rung as a reference-normalised factor; ladder collapsed to
{1} makes the armed world byte-identical to the door-shut world (the strongest
fidelity form), and the verifier's independent 10,353-moment sweep found zero
price mismatches with the seen-unread branch firing correctly (the executor's
own doubt corrected FAVOURABLY — a seed-band artefact, not a property). The
weight axis is now the only degree of freedom: 52/451 mate switches are
attributable to a rung. Pin suite lands (24 pins; suite 1,523/1,523);
cancelled wind-ups counted via a closed ledger; PTP×PW shut by constructor
refusal. WHY IT MATTERED: PW-T1's contrast is now readable — weight, not a
thinner chooser. LESSONS: the false-field class struck AGAIN one slice after
its naming (a `bytes` field holding a character count — fields carry the unit
their name claims); verifier scratch seeds must never touch the next virgin
block (12,494,000 retired as tainted); named debts to PW-T2 (pwPowerLadder
fail-closed validation; pairsAsked null-branch). Consumption: block
12,493,000–999 consumed; stats zero drawn. PW-T1 books 12,495,000–999,
stats ≥ 112,800.

---

**2026-08-16 — #295 (PW-T1 adjudicated; the PW arc reaches its gate; QUEUE
superseded).** The QUEUE's "IN FLIGHT: PW-T1" block is superseded by the
ARC-AT-GATE block. WHAT: the composition exam landed (closure equation exact
with a natural population — 65 wind-up voids and 2 in-flight, residue zero;
doors clean at CB+L3+PW; verify PASS-WITH-FINDINGS). H-PW.1 SCORED NEGATIVE
with the estimand ruling: weight IS chosen at strike grain (loud, non-
degenerate, ceiling modal among chosen strikes) but the corridor is unmoved on
BOTH estimands (world supply at default power AND the chosen ball's first-order
channel — Q06 flat, admission region 4.94 % ≈ 2.8 strikes/match, thin exactly
as pre-registered). WHY IT MATTERED: the arc's mechanism claim is honestly
falsified — a rational appetite converts the lane-physics capability into too
few admission-bought balls to move the world — while the arc's REAL positive
emerged unscripted: 有压力才改力度 (pressed strikes abandon the default 64 %
of the time; 大力穿缝 confirmed at 2.29×; 小力到脚 refuted — the soft ball is
an escape valve under pressure). The touch-weight doctrine's chosen region
exists, at pressure grain, thin. DECISIONS: pause at the USER FORK — (i) PW-T2
entry to watch it (recommended for the eyes; debts ride along) vs (ii) the
perception contract (the commander's pick for the disease) vs (iii) movement
vs (iv) menu. LESSONS: score-instrument estimands must be named at contract
time (the census prices at default power — the estimand ruling holds because
both channels agree); a noise-free reference rung makes cross-rung outcome
tables upper bounds twice over; citation form of record = "#294 item 5".
Consumption: 12,495,000–999 consumed; stats 112,800. Next ≥ 12,496,000 /
≥ 113,000. THE PROGRAMME PAUSES AT THE USER GATE.

---

**2026-08-16 — #296 (the fork resolves; the perception arc opens; QUEUE
superseded).** The QUEUE's fork block is superseded by the PC-ARC-OPEN +
PC-C0-IN-FLIGHT block. WHAT: the user chose ② at the #295 fork (verbatim
「2」) — the PW entry declined for now (the seam banks dormant, fully pinned,
debts parked with the future entry), and the PERCEPTION CONTRACT opens: the
biggest door on the menu, held since the INFO-DOCTRINE registration (#272).
The contract binds doctrine slice 1 verbatim: two literature-traced latency
tiers on the SIM clock (body physics lives there — the clock ruling), tier
decided by RECOGNITION from born-absent earned books (fifth self-cluster
instantiation; the novice pays long by construction), stale plan continues
during latency (timers + target-holds; snapshots are slice 2), self-initiated
acts free. WHY THIS DOOR: six confirmations that the lane is pitch physics
share one cause — today's defenders are omniscient and instantaneous (the §3
baseline: every defender re-targets the truth ball within 1 tick). Processing
time is the currency of every information-game mechanic the user has asked
for; this slice buys it. PC-C0 dispatched: the reaction baseline at event
grain, the insertion-seam map (incl. the existing decisionTimer cadence), the
situation-class derivation WITH exposure rates (the L3-T1 slow-knowledge
lesson checked before the build), the self-initiated inventory. Seeds
12,496,000–999; stats ≥ 113,000.

---

**2026-08-16 — #297 (PC-C0 adjudicated; the six holes ruled; QUEUE
superseded).** The QUEUE's "IN FLIGHT: PC-C0" block is superseded by the
PC-C0-LANDED + PC-T0-IN-FLIGHT block. WHAT: the reaction-baseline census landed
(verify PASS-WITH-FINDINGS 4 MED + 3 LOW). THE PICTURE: the doctrine's premise
is proven at census grain — steering re-targets truth at the first possible
tick (six of seven classes at exactly 1.000000), the only latency is an
event-blind 9-tick cadence (corrected of record to mean ≈6.54 ticks — the k−1
fix), and 99.2 % of the world's latency structure is one flat constant.
处理时间在这个世界里根本不存在. THE GIFT: markAnchor already ships a
target-hold with lag ∈ [0.20, 0.45] sim-s — the doctrine's two tiers arrived
at by an independent route ⇒ the tier constants are derived twice over
(SIMPLE 0.20 / CHOICE 0.45) and PC-T0 generalises a shipped idiom rather than
inventing one. THE SIX HOLES RULED: saturation ⇒ finer key (class × pressed ×
relation) + L3-precedent-derived N_cover with sensitivity band; role
differentiation demoted to a reported emergence face (exposure is role-flat —
if reaction ends up role-flat too, that is a finding about doctrine §0);
the hold is body-local against mid-hold team reassignments; the one-touch
window is retroactively the PRE-PROCESSING channel (kept); the push author
scoped out (named door); the spiller pays the surprise side (intended-outcome
boundary of self-initiation). LESSONS: needle-occurrence counts in seam-map
gates (GoalkeeperSave hid behind an already-mapped needle; it also shares the
faceTarget-aliasing hazard — holds COPY vectors); percentile faces need stored
bins; the k−1 step-order trap in event-lag measurement. Consumption: block
12,496,000–999 consumed; stats 113,000. PC-T0 books 12,497,000–999, stats ≥
113,200.

---

**2026-08-16 — #298 (PC-T0 adjudicated; the pre-exam amendment ordered; QUEUE
superseded).** The QUEUE's "IN FLIGHT: PC-T0" block is superseded by the
PC-T0-LANDED + PC-T1-IN-FLIGHT block. WHAT: the dormant reaction-latency seam
banked (four src files + a birth pin suite; dormancy double-proven and
independently reproduced; the CB seat block untouched). The build's elegant
choices of record: initiator freedom BY EXCLUSION (structural — an initiator
is never in his own surprise set — rather than name-checks); one executor gate
after every case and both clamps; monotone-restart overlap (a second surprise
must never make a body faster); additivity structural (the seam never touches
decisionTimer). The receipts: 10,699 clean holds bin at exactly {12, 27}
ticks; own-exposure proven by an independent distance camera; hot cells cross
N_cover within eight walks — the tier differentiation PC-T1 must measure is
already previewing. WHY THE AMENDMENT: two real design gaps found by verify —
a substitute inherits the departed body's gid-keyed hold and frozen target;
the latency clock runs through dead balls the world's cadence freezes across
(ruled: holds clear at dead-ball transitions — a restart voids the surprise's
context). LESSONS: the hashed-body envelope law was breached AGAIN by a
forbidden-names gate (the committed sha is void as portability; canon: hashed
bodies build from an explicit ALLOWLIST SCHEMA); the EIGHTH citation strike is
the commander's third — operational fix: briefs quote canon sentences verbatim
beside numbers, so a wrong number self-corrects by grep. Consumption: block
12,497,000–999 consumed; stats zero. PC-T1 books 12,498,000–999, stats ≥
113,200.

---

**2026-08-16 — #299 (PC-T1 adjudicated; QUEUE superseded).** The QUEUE's
"IN FLIGHT: PC-T1" block is superseded by the PC-T1-LANDED + PC-T2-IN-FLIGHT
block. WHAT: the learning exam landed (amendment 4/4 pinned first, dormancy
re-proven; verify PASS-WITH-FINDINGS 2 MED + 6 LOW). THE RESULT: the doctrine's
learning layer WORKS — books fill exactly as the census predicted (zero false
promises; the fill is a season-long arc, 11.6 %→53.4 % across seven fixtures);
tier differentiation is loud and SITUATION-shaped (the same body pays 78 pp
apart between his most- and least-lived cells; a defender reads a pressed
deflection early 9/10 while staying a novice on shots all season); the N-band
walked with zero flips (orderings Spearman ≥0.987); the added lag is real
(+25.2 applied ticks at 47×, floor-biased) and the base arm reproduced the
census cadence to 0.05 ticks. THE HONEST FINDINGS: outfield reaction is
ROLE-FLAT (2.7 pp vs the 78 pp cell effect) — the user's 中场-后卫 intuition is
not delivered by exposure at this key (the GK's gap is situation mix, not a
role constant); with a season reset, slow cells never fill (the permanent
dribblePush hole); self-starvation is a cold-book transient (warm books
−0.8 %). ADJUDICATIONS: the ninth citation strike = wrong HOME not fabrication
(the sentence is verbatim at PC-T0 §CORRECTIONS item 1; commander-owned;
canon quotes now cite the sentence's actual home — §CORRECTIONS sections are
canon corpus); H4 near-vacuity accepted for slice 1 (the broad 提前知道 channel
is slice 2's); zone-keyed widening deferred to the menu. New canon: max−min
faces report noise-floor comparisons. Consumption: block 12,498,000–999
consumed; stats 113,200–113,204 drawn. PC-T2 books 12,499,000–999, stats ≥
113,600.

---

**2026-08-16 — #300 (PC-T2 adjudicated; H-PC.1 POSITIVE; the disease faces
move for the first time; QUEUE superseded).** The QUEUE's "IN FLIGHT: PC-T2"
block is superseded by the H-PC.1-POSITIVE + PC-ENTRY-IN-FLIGHT block. WHAT:
the armed-world read landed (doors clean first; the matured dose through the
shipped writer; verify PASS-WITH-FINDINGS 4 MED + 1 LOW with a bit-exact
bootstrap reproduction). THE RESULT: the perception contract's scored claim
holds — recognition differentiates reaction (96×; covered-vs-uncovered cells
+56 pp), and the touch-past information gap turns positive (CI rule; the
adjective corrected to marginal-band; the empty arm's +1.24 m at 8.5× carries
the mechanism; 过人买到的时间,是对手没学过这一课的那部分 — a SIMPLE-tier
victim concedes 0.34 m, a CHOICE-tier one 1.42 m). AND THE DISEASE FACES MOVED
for the first time in the whole programme: losses −7.5 pp, interceptions
−3.5/match, spells +0.51 s, touches +0.21, pressed share −4.4 pp — with the
pre-registered split landing exactly (lanes open at sim grain while the
full-truth priced corridor stands still) and the honest pressing read
(absolutely less productive; the time-attack premium exists only against
unlearned defences — 老练的防线不怕逼抢). LESSONS: strength adjectives must
survive stream re-draws (the 2.0059 was a tail artifact; the CI rule was the
verdict's real ground); Δsep instruments must censor on carrier persistence;
nominal ≠ applied even in the stage that gates units; doc prose quotes
artifact fields verbatim or becomes a gated face. DECISION: PC-ENTRY
dispatched (?a4world=8, matured dose, ?pcdose=0 weak form, new
a4ArmedVersion) — then the play-test USER GATE. Consumption: block
12,499,000–999 consumed; stats 113,600. Next ≥ 12,500,000 / ≥ 113,800.

---

**2026-08-16 — #301 (PC-ENTRY adjudicated; CANON.md created; the perception
arc reaches its play-test gate; QUEUE superseded).** The QUEUE's "IN FLIGHT:
PC-ENTRY" block is superseded by the ENTRY-LIVE + AT-THE-GATE block. WHAT:
?a4world=8 is live and watchable — the matured dose bit-equal to PC-T2's arm C
through a file-byte-hashed opt-in chunk (precached zero; +0.56 % main path,
clean-tree verified); ?pcdose=0 the empty weak form; a new a4ArmedVersion with
the containment-ordered read (the BU-T1 mislabel debt paid); worker-fixture
honesty stated in the player's own language. FIX ORDERED (PC-ENTRY-FIX): the
verifier caught that the empty form never resets the league-owned books, so
watched match 2+ played on part-filled books under a truthful-no-longer badge
— the empty form resets at every watched construction. THE STRUCTURAL LESSON:
the TENTH citation strike (fifth commander-owned — two "verbatim" quotes
reworded/mis-homed, both from the brief) was answered with a MECHANISM instead
of another resolution: CANON.md, the standing-law ledger — a derived index of
every canon sentence with its home, refreshed in the same round as any new
canon, from which briefs COPY. Root cause was a single-source violation
(sentences scattered + retyped from memory). RULINGS: slot-pooled dose
accepted as the play form (shared textbooks, not personal histories — per-body
dosing a named door); the 609 kB chunk accepted (derived-artifact door named);
new canon: builds of record run on clean trees. THE ARC: #296→#301, six
rulings, H-PC.1 POSITIVE, the disease faces moved for the first time — THE
PROGRAMME PAUSES AT THE PLAY-TEST USER GATE (过人时对面真的慢半拍了吗 ·
逼抢读作时间攻击了吗 · 世界更像足球了吗; A/B = ?a4world=8 vs 7; wild side
?pcdose=0). Consumption: block 12,500,000–999 consumed; stats zero. Next ≥
12,501,000 / ≥ 113,800.

---

**2026-08-16 — SESSION END (post-#301).** The commander session wraps at the
user's word (「先收尾session吧,我之后再go」). STATE AT WRAP: the perception
arc COMPLETE (#296–#301), ?a4world=8 live on origin/main, THE PROGRAMME PAUSED
AT THE PLAY-TEST USER GATE (过人时对面真的慢半拍了吗 · 逼抢读作时间攻击了吗 ·
世界更像足球了吗; A/B = ?a4world=8 vs 7; wild side ?pcdose=0). PC-ENTRY-FIX:
draft landed `6a1cc93` (the empty form empties; drift pin 0→0→0; dormancy
unmoved; suite 1,580; engine untouched), VERIFY IN FLIGHT at session end —
#302 adjudication is the next session's first act (resume protocol in the
QUEUE). The fix commit ships in this push, labelled un-adjudicated. Session
totals: rulings #286–#301 (sixteen), arcs closed BU (H-BU.1 negative, honest)
· PW (H-PW.1 negative, the emergence banked) · PC (H-PC.1 POSITIVE, the
disease faces moved first-ever); CANON.md created; ten citation strikes
walked and mechanized away. Resume = the QUEUE head + rulings tail, as always.
