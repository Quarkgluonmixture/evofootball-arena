# THE FAR-SIDE DEFENDER FORENSIC CENSUS

**Authority**: commander ruling **#186.4** (dispatched on the user's v3-session
verdict recorded at #186.2, and on the labelled hypothesis **H-186a** at #186.3).
VISION §1 anchor (2026-08-08): 位置是活的 — 共识粗、执行活;站位随球权相位 ×
对手形状 × 形势调制.

**Instrument-only.** ZERO `src/**` changes; nothing ships; the production
fingerprint `57b0bdab…c673` is re-derived in-probe and must be unchanged. This
census MEASURES; it proposes nothing.

Probe: [`scripts/probes/farside-defender-forensic.ts`](../../scripts/probes/farside-defender-forensic.ts).
Artifact: [`data/farside-defender-forensic.json`](data/farside-defender-forensic.json).

---

## §0 THE USER'S LENS, VERBATIM

> "对面断球在右后卫位置,左后卫会在左下角乱转,脱离球队之外"

Three claims live in that sentence, and this instrument measures each one
separately:

| the claim | the measured thing |
| --- | --- |
| 对面断球在右后卫位置 | the TRIGGER (§1): opponent carrying, deep in OUR third, on one flank |
| 脱离球队之外 | DETACHMENT (§3.1): metres from the rest of his own team |
| 在左下角乱转 | the CORNER share (§3.3) + the CHURN rates (§3.4/§3.5) |

**H-186a**, the labelled hypothesis this census is built to split:

- **(i) MODULATION MISSING** — no defensive ball-side compression force reaches
  the weak-side back; the A4 home is ball-RELATIVE but phase-BLIND.
- **(ii) OSCILLATION** — the live station field flips him between targets.

The discriminating reading rule is **pre-registered in §5, before any number
existed**.

---

## §1 THE TRIGGER (frozen)

A tick is IN-TRIGGER iff **all** of the following hold. `a` = the team in
possession (`match.possessionSide`), `d` = `1 − a` = the DEFENDING team (the
user's team-of-interest — the one whose back wanders).

| # | condition | traced constant / source |
| --- | --- | --- |
| T1 | `match.phase === 'playing'` | `Match.phase` |
| T2 | `match.restart === null` | open play only — set-piece geometry is a different animal (the #171.iv lesson: restart-origin populations carry their own shape) |
| T3 | `match.possessionSide !== -1` | a side actually holds it |
| T4 | `match.ball.owner !== null` and `owner.side === a` | 断球 = the ball is AT AN OPPONENT'S FEET, not loose |
| T5 | `owner.role !== 'GK'` | excludes keeper holds / distributions (the Phase-31.6 stand-off world) |
| T6 | `teams[d].localX(ball.pos.x) < −HALF_L / 3` | **OUR OWN THIRD** in the defending team's own local frame — this is `localXBand`'s own `ownThird` cut (`src/ai/stationEye.ts`), the substrate's published third boundary. `HALF_L = 31.5` ⇒ the cut is **−10.5 m local** |
| T7 | `Math.abs(ball.pos.y) >= BOX_WIDTH / 2` | **ONE FLANK** — outside the penalty-box width, i.e. wider than any central corridor. `BOX_WIDTH = 19.6` ⇒ the cut is **9.8 m** from the centre line |

Note on the frame chosen (the ruling offered two): the user's lens is
*opponent possession deep in OUR half on one flank*, so the depth test is in the
DEFENDING team's local frame (T6), not the attacking team's. The two are the
same event described from opposite ends; T6 is the one that names the user's
picture.

### THE EPISODE

An EPISODE is a maximal run of consecutive in-trigger ticks over which **both**
of these stay constant:

- the possession side `a` (a turnover closes the episode), and
- `Math.sign(ball.pos.y)` — the **FLANK SIGN** (a switch of flanks closes the
  episode and opens a new one, because it swaps which back is the weak-side one).

An episode counts only if it lasts `>= MIN_EPISODE_TICKS = 30` ticks
(= **0.5 s** at `DT = 1/60`) — shorter runs are frame flicker, not a picture the
user could see. Frozen before any count existed.

Episode DURATION is `ticks × DT` sim-seconds. All per-second rates in §3 divide
by THIS (one clock, the #171.ii law).

---

## §2 THE WEAK-SIDE BACK (frozen identification)

### §2.1 PRIMARY RULE — the wide-back slot rule

The defending shape's two WIDE bodies are the two whose emergent station carries
a non-zero LANE FRACTION: in `emergentStation` (`src/ai/formations.ts`)
`laneSign = p.index === 3 ? −1 : p.index === 4 ? +1 : 0`, and the lane is applied
to **world y** unflipped (`y = laneFrac * HALF_W * widthMul`, returned as
`v2(x * attackDir, y)`). So slot 3 stations at negative world y and slot 4 at
positive world y **for both sides**. Out of possession these are the wide backs
of the block (the `DEFEND_FORMATIONS` design note: "`low-32` drops both wingers
as wide backs").

> **WEAK-SIDE BACK** = the defending team's outfield body in the wide slot whose
> LANE SIGN is OPPOSITE the ball's flank sign:
> `ball.pos.y > 0 ⇒ index 3`; `ball.pos.y < 0 ⇒ index 4`.
> (`ball.pos.y === 0` cannot occur in-trigger by T7.)
>
> **BALL-SIDE BACK (the CONTROL MIRROR)** = the other wide slot, same episode,
> same tick, same team.

The body must be non-GK and `!sentOff`; an episode where either wide body is
sent off is EXCLUDED and counted in its own class (`excludedSentOff`).

This is a pure SLOT rule read off published station machinery — it uses no live
position and no measured outcome, so it cannot have been fitted to the result.
The control mirror is what makes the churn rates readable: 乱转 means the
weak-side back churns MORE than his own ball-side twin in the same moment.

### §2.2 SECONDARY RULE (cross-check, reported not headlined) — the A4 home rule

The A4 grant prices each body's own home as
`ATTACK_FORMATIONS[team.style.formationAtk][p.index]` (traced verbatim from the
four grant branches in `src/ai/actionExecutor.ts`; team-local coords). The
A4-home weak-side back = among outfield bodies whose home `y` sign is opposite
the ball's flank sign, the one with the SMALLEST home local-x (the deepest such
home); no such body ⇒ the episode contributes to `a4RuleUndefined`.

Reported per world: `a4RuleAgreementRate` = the share of episodes where §2.2
picks the SAME body as §2.1. The headline metrics are always §2.1's.

---

## §3 THE METRICS (frozen)

Per in-trigger tick, for BOTH the weak-side back and the ball-side control
mirror. Episode value = the MEAN over the episode's ticks unless stated;
per-world level = the mean over episodes (episode-weighted), with per-SEED
cluster bootstrap CIs (§4).

**Observation frame (disclosed):** every read is taken AFTER `m.step(DT)` — i.e.
on the state the tick produced. The executor evaluated its own station field at
the HEAD of that tick, so the probe's station read (§3.2) is the field re-evaluated
one tick downstream of the executor's own call. Self-consistent and honest; it is
not the executor's identical value.

### §3.1 DETACHMENT — `distToOwnCentroid`

`hypot(p.pos − centroid)` where the CENTROID is over the defending team's
outfield bodies (`role !== 'GK'`, `!sentOff`) **excluding p himself** — the
distance from the REST of his team, which is what 脱离球队之外 says. Reported:
episode mean, episode max, and the per-world p50/p90/max over episodes.

### §3.2 WHERE THE STATION FIELD SENDS HIM — `sendTarget`

The live send, resolved per tick by the substrate's own precedence:

1. If the station eye is armed on this match **and** `p.action.type ∈
   STATION_FAMILY` (`src/ai/stationEye.ts`) **and** `p.c4Trace !== null` **and the
   body's live commitment carries an offset** (`stationEyeState.get(p.gid).offset
   !== null`) ⇒ the send is the eye's ball-local lattice override,
   `p.c4Trace.applied`.

   **The fourth condition is the executor's real gate** (`src/ai/actionExecutor.ts:1055`:
   `if (state !== undefined && state.offset !== null) { if (isStation) { … target = want }`).
   A commitment that is live but offset-null steers nothing, so testing only the
   first three would count as overrides ticks the executor never overrode. Declared
   here as the fourth condition rather than left implicit in the probe.

   **What `c4Trace.applied` actually is** (`src/ai/actionExecutor.ts:1145`:
   `if (p.c4Trace !== null && target) p.c4Trace = { meet: p.c4Trace.meet, applied: target }`):
   the eye's branch first writes `{meet: want, applied: want}` (`:1061`), and then
   line 1145 REWRITES `applied` to the target that survived the executor's own
   clamps (the onside clamp and the barred-box clamp). So `applied` is the point the
   body was really steered at, not the raw lattice want — which is the send this
   census means. `meet` retains the pre-clamp want.
2. Otherwise ⇒ `formationSpot(p, teams[d], ball, /*hasBall*/ false, teams[a],
   /*abandonRest*/ false)` — which routes to `emergentStation` (emergent
   positioning is DEFAULT ON). `hasBall = false` because in-trigger the defending
   team by definition does not hold the ball (`match.possessionSide === a`);
   `abandonRest = false` because `match.abandonRestDesignation` is `null` in every
   path here (asserted in-probe).

Measured:

- `distToSend` = `hypot(p.pos − sendTarget)`
- `sendIsEyeOverride` (share of ticks) — 0 by construction on the prod world
- `distToStationHome` = distance to (2) ALWAYS, override or not — so the A4/emergent
  HOME can be examined separately from whatever the eye did on top of it
- `sendCornerShare`: is the send target IN THE CORNER? **Frozen corner test** — in
  the `(localX, |y|)` frame, within `SPREAD_R = 9` m of the station clamp's own
  corner point `(−HALF_L + 3, HALF_W − 2)`:
  `hypot(localX − (−HALF_L + 3), |y| − (HALF_W − 2)) < 9`.
  Both anchors are published: the clamp bounds are `emergentStation`'s final
  `clamp(x, −HALF_L + 3, HALF_L − 7)` / `clamp(y, −HALF_W + 2, HALF_W − 2)`, and 9 m
  is that same function's anti-clump repel radius (`if (d < 9 …)`). At
  `FIELD_SCALE = 0.7` the corner point is `(−28.5, 18.3)` local.
- `pCornerShare`: the same test applied to the BODY's own position (is HE in the
  corner, regardless of where he was sent).

### §3.3 THE COMPRESSION YARDSTICK (descriptive only)

A ball-side-compressed shape holds its far bodies within ~one body-spacing of the
ball's lane. `SPREAD_R = 9` m (the anti-clump radius above) is the substrate's own
body-spacing scale. Measured, purely laterally (no invented depth):

- `lateralGapToBall` = `|p.pos.y − ball.pos.y|`
- `compressionShortfall` = `max(0, lateralGapToBall − SPREAD_R)` — how much wider
  than one spacing he sits from the ball's lane
- `sendLateralGapToBall` = `|sendTarget.y − ball.pos.y|` — **does the field even
  ASK him to compress?** This is (i)'s direct read.

These are DESCRIPTIVE. No claim is made that a compressed shape is correct
football; the yardstick exists so "far from any compressed shape" is a number
rather than an adjective.

### §3.4 TARGET-SWITCH FREQUENCY — the oscillation detector

Per tick the SEND IDENTITY is the string
`switchKey = ${p.action.type}|${markTargetIdx ?? '-'}|${eyeCandidateId ?? '-'}`
(`markTargetIdx` = `p.action.targetIdx` under `MarkOpponent`; `eyeCandidateId` =
the committed lattice candidate id from `match.stationEyeState.get(p.gid)` when the
override applied, else `-`). A SWITCH is a tick whose key differs from the previous
tick's key, within the episode (the episode's first tick is never a switch).

`switchRate = switches / episodeSimSeconds`.

**What this key CANNOT separate** (stated here, not only at §8.4): because
`eyeCandidateId` collapses to `-` on every tick the override is not applying, an
override lapsing IN or OUT changes the key exactly as an action-type change or a new
mark target does. A switch is evidence that **the send identity changed**; it names
no cause. Any attribution of churn to one of those causes is beyond this
instrument.

### §3.5 HEADING-FLIP RATE — the churn detector

A FLIP at tick `t` iff `|vel(t)| > SPEED_MIN` and `|vel(t−1)| > SPEED_MIN` and
`dot(vel(t), vel(t−1)) < 0` (i.e. the heading reversed by more than 90°). A STRICT
flip additionally requires the angle > 150°. `SPEED_MIN = 1.0` m/s — **FLAGGED as
the executor's own choice**: there is no published anchor for "moving at all", so a
walking floor is declared here rather than smuggled in. Both rates are reported:

`flipRate90 = flips / episodeSimSeconds`, `flipRate150 = strictFlips / episodeSimSeconds`.

### §3.6 CONTEXT (per world, per episode)

`actionMix` — the share of in-trigger ticks the weak-side back spends in each
`p.action.type`. A body who is not on a STATION-family job is not being steered by
the station field at all, and that is a fact the reading rule needs.

---

## §4 THE FOUR WORLDS, THE SEEDS, THE ARITHMETIC

### §4.1 The worlds (shared seeds, paired)

Composed exactly as `src/game/a4World.ts` does it (`a4MatchFlags` +
`armA4World`), which is the fidelity source:

| world | construction flags | post-construction |
| --- | --- | --- |
| `prod` | none (the shipped game) | none |
| `v1` | `A4_WORLD_FLAGS` (the census substrate) | the A4 PRIOR eye on both sides + `homePriorObedience = 0.5` both sides |
| `v2` | `A4_WORLD_FLAGS` | v1 + the frozen discipline offsets `[0, +.4, +.2, 0, −.2, −.4]` both sides |
| `v3` | `A4_WORLD_FLAGS` + `o1PassWindup: true` | identical to v2 (v3's only extra ingredient is the construction flag) |

`A4_WORLD_FLAGS` is never widened (contract §3 FLAG HYGIENE); v3 composes the
fourth seam at the entry layer, per #184.2. Asserted in-probe as a gate
(`flagHygiene`). "Which world the user saw" is answered incidentally by which
world's numbers match his description.

### §4.2 Seeds (the ledger)

The A4/O-arc ledger is consumed through **12,310,199** (the O2 opening sizing
re-run took 12,310,000..12,310,199). This census reserves the band
**12,310,200..12,310,999** in full:

| block | range |
| --- | --- |
| sizing smoke | 12,310,200 .. 12,310,215 (16 seeds × 4 worlds) |
| the census | 12,310,300 .. 12,310,300 + N − 1 |

Stats (bootstrap) base **103,200** — the #163 stream rule; 103,000 was the O2
re-run's base, so the gap is exactly the 200 floor. Published bases asserted
disjoint in-probe.

### §4.3 N — the arithmetic, frozen before the smoke ran

Target: **`TARGET_EPISODES_PER_WORLD = 1500`** qualifying episodes in the
BINDING (fewest-episodes) world — enough that an episode-level mean carries a
relative bootstrap SE of roughly 2–3 % on quantities with an episode-level CV
near 1, which is the resolution this census needs (it separates hypotheses by
ratios and by a same-tick control mirror, not by a 1 % contrast).

```
N* = min(
       ceil( 1500 / episodesPerMatch_binding )  rounded UP to N_STEP = 25,
       floor( wallBudget / (ms_per_match × 4 worlds × 2 X-DET passes) ),
       N_CAP = 700                      # the reserved band's own ceiling
     )
```

`wallBudget = 1.0 h`. `episodesPerMatch_binding` and `ms_per_match` come from the
sizing smoke (16 seeds), which informs **only N** — no level, share or rate from
the smoke is ever read as a result. The smoke's own artifact is emitted
separately and labelled.

**HOW THE RULE IS EXECUTED (added at the #187 fix round; the rule itself is
unchanged).** N is not a constant in the probe. In census mode the probe READS the
committed sizing artifact, takes exactly two numbers out of it
(`min(episodesPerMatchByWorld)` and `msPerMatch`), evaluates the arithmetic above
in-process before a single census match is stepped, and runs that output. The
derivation, the artifact's own sha256, the smoke's seed block, all three terms and
which term bound are emitted as `nDerivation` in the census artifact; the gate
`nDerived` fails if the N actually run is not that output (so an `FSD_N` override
turns the gate RED rather than passing quietly). The earlier draft hardcoded
`min(N_CAP, …)` — the arithmetic never ran, and the census artifact's own post-hoc
recompute was the only place the numbers appeared. §8 reports which term bound.

---

## §4.4 DECLARED ADDITIONS — D1/D2/D3 (labelled, with provenance)

These three were added **after the 16-seed plumbing sizing smoke and before the
census run**, and are labelled as such in the artifact. Two smoke facts forced
them, and both are facts about the INSTRUMENT'S APPLICABILITY, not levels:

1. the weak-side back spends the large majority of in-trigger ticks in
   `MarkOpponent` — so `formationSpot` is not the only thing steering him, and a
   census that measured only the station send would be measuring a
   counterfactual for most ticks;
2. the §2.2 A4-home cross-check agreed with §2.1 on **0 %** of smoke episodes —
   a divergence worth describing rather than merely reporting.

**Nothing frozen in §1–§3 or §5 is removed, redefined or re-thresholded.** These
additions only ADD facts, which the unchanged §5 rule then consumes at face value.

- **D1 — THE MARK ANCHOR.** On `MarkOpponent` ticks with a resolvable
  `p.action.targetIdx`: distance to the marked opponent, that opponent's lateral
  gap to the ball, whether the marked man is himself on the FAR side of the flank
  (`sign(mark.y) === −flankSign`), and whether the marked man stands in the §3.2
  corner. This names a **third** possible driver the ruling did not enumerate: the
  back may be following a MAN into the corner, not a station.
- **D2 — THE STEER-OWNER MIX.** Which mechanism owns the movement target each
  tick, in `executeAction`'s own precedence order: `eyeOverride` (the eye replaces
  a STATION-family target) > `markStance` (`MarkOpponent`, no override) >
  `stationHome` (`MoveToFormationSpot` / `HoldPosition`, no override) >
  `ballDirected` (`ChaseBall` / intercept / receive / kick actions — never
  overridden, the E-NONSTATION lapse) > `other`.
- **D3 — THE A4-HOME DIVERGENCE, CHARACTERISED.** Which slot §2.2 actually picks
  (slot mix) and how far that body stands from §2.1's wide back at the episode's
  first tick.

---

## §5 ⭐ THE PRE-REGISTERED READING RULE (frozen BEFORE any number existed)

This section is the whole point of the census. It is written before the probe was
run and is not revised afterwards.

Let, for a given world, over qualifying episodes, on the WEAK-SIDE BACK:

- `S` = median episode `switchRate` (§3.4)
- `F` = median episode `flipRate90` (§3.5)
- `D` = median episode `distToSend` (§3.2)
- `G` = median episode `sendLateralGapToBall` (§3.3)
- and the same four on the BALL-SIDE CONTROL MIRROR: `S*`, `F*`, `D*`, `G*`

Two frozen reference scales, both traced to the substrate's own cadence:

- `CHURN_HI = 1 / EYE_W_S = 1 / 3.0 = 0.3333 s⁻¹` — the station eye's own
  commitment window is 3.0 s (`EYE_W_S`, `src/ai/stationEye.ts`), so a send that
  changes faster than once per window is churning relative to the substrate's own
  decision cadence.
- `NEAR_M = 14 m` — the executor's own "badly out of position" scale (the
  `MoveToFormationSpot` branch: `if (dist(p.pos, target) > 14) speedF = …`).

**READING (i) — MODULATION MISSING is supported** iff
`S < CHURN_HI` and `F < CHURN_HI` (the send is STABLE) **while the target itself
sits far from any compressed shape**: `G > SPREAD_R (9 m)`, and/or the send's
corner share is materially non-zero. In words: nobody is flipping him — he is
being sent, calmly and consistently, to a place a compressed defensive shape
would not put him.

**READING (ii) — OSCILLATION is supported** iff
`S >= CHURN_HI` and/or `F >= CHURN_HI`, **while the current send is SANE and
NEAR**: `D <= NEAR_M` and the send's corner share is low. In words: where he is
being sent is fine — he just cannot hold it, so he spins.

**COMPOUND** — both clauses fire ⇒ both mechanisms are present; the census says
so and the fork is the commander's.

**NEITHER** — `S, F < CHURN_HI` AND `G <= SPREAD_R` AND corner shares low AND
detachment unremarkable versus the control mirror ⇒ **the instrument does not
reproduce the user's picture in any of the four worlds**, and the honest verdict
is that the lens is pointed at something this trigger does not capture. That
outcome is a legitimate result and is reported as such.

**The CONTROL MIRROR governs every "high"/"low" word above.** A rate that is high
on the weak-side back and equally high on his ball-side twin is a property of the
substrate's steering, not of weak-side-ness. Every headline is therefore reported
as the pair (weak, ballSide) plus their paired difference with a CI.

---

### §5 FOOTNOTE — the one number §5 does not itself supply (added at the #187 fix round)

§5 above is frozen and is not revised. It says "materially non-zero" for (i)'s
corner disjunct and "low" for (ii)'s corner condition without giving a number. The
probe therefore declares **one** cut, `CORNER_MATERIAL = 0.05`, and uses it for both
(`share >= 0.05` = materially non-zero; `share < 0.05` = low), so no share can be
both immaterial and not-low. This is a FLAGGED executor's choice in the same class
as `SPEED_MIN` — there is no substrate anchor for it. The measured corner shares
(medians 0 in every world, means ≤ 0.68 %) are two orders of magnitude below the
cut, so no plausible value of it changes any verdict; see §8.7.

---

## §6 GATES

| gate | meaning |
| --- | --- |
| `xDet` | the whole four-world computation run TWICE, JSON byte-identical + `resultSha` |
| `xFpProd` | the shipped fingerprint re-derived in-probe (seed 1337, 2 seasons) = `57b0bdab…c673` (#181.2 standing receipt rule) |
| `xSrcUntouched` | `git diff --stat -- src` is empty |
| `seedDisjoint` | the census block is inside the reserved band, above the consumed ceiling, and clashes with no published block |
| `statsDisjoint` | bootstrap base 103,200, gap ≥ 200 from every published base |
| `flagHygiene` | prod = no flags; v1 = v2 = `A4_WORLD_FLAGS` exactly; v3 = that + exactly `o1PassWindup`; `A4_WORLD_FLAGS` itself untouched |
| `tableSha` | the injected merged table + control artifacts rehash to the pinned SHAs |
| `armIdent` | v1/v2/v3 carry the certified eye (`isA4Armed` shape) and the expected obedience/offsets; prod carries none |
| `nDerived` | the N actually run **is** the frozen §4.3 rule's own output on the sizing smoke's two numbers (RED if an `FSD_N` override replaced it) |
| `probeReadOnly` | `abandonRestDesignation`, `homeRegionGrant`, `homeMapGrant` are all null/absent on every match |

---

## §7 WHAT THIS CENSUS DOES NOT DO

- It draws **no design conclusion**. §5 yields a READING of H-186a(i) vs (ii);
  the mechanic fork (modulation force vs oscillation fix vs both vs neither) is
  the commander's and the user's, with the numbers in hand.
- It measures the weak-side BACK only. Other bodies' positioning, the shape as a
  whole, and the attacking side of the user's verdict (进攻配合挺好) are out of
  scope.
- The compression yardstick (§3.3) is a RULER, not a target. Nothing here claims
  a compressed shape is the right football.
- Episode receipts (§8) are emitted so the commander can re-watch concrete
  moments; they are citations, not evidence beyond the aggregate.

---

## §8 RESULTS

Artifact: [`data/farside-defender-forensic.json`](data/farside-defender-forensic.json)
— `resultSha 2bbdfc9a1a9b…`, **all ten gates GREEN** (X-DET true, X-FP-PROD
`57b0bdab…` re-derived, src diff empty, seeds/stats disjoint, flag hygiene, table
SHAs, arm identity, N-derived, probe-read-only). Block
**12,310,300..12,310,999** (N = 700 seeds × 4 worlds × 2 X-DET passes), wall 583 s.

*Provenance of these numbers:* the census was RE-RUN at the #187 fix round on the
same block with the same invocation. Every measured level, CI, verdict and receipt
below is **byte-identical to the draft run's**; the artifact differs only by the
added `reading.clauseTerms` / `CORNER_MATERIAL` fields and the rebuilt N-provenance
blocks, which is why `resultSha` moved from `c47387aea8d5…` to `2bbdfc9a1a9b…`.

Sizing artifact (16 seeds, informed only N):
[`data/farside-defender-forensic-sizing.json`](data/farside-defender-forensic-sizing.json).

### §8.0 WHERE N CAME FROM — the sequence, in order

Rewritten at the #187 fix round: the earlier draft printed the census run's own
post-hoc numbers and called them the smoke's. The truth, in plain sequence:

1. **The sizing smoke ran first** — 16 seeds @ 12,310,200..12,310,215, four worlds,
   `FSD_MODE=smoke`. It measured exactly two things N depends on: episodes per match
   (prod 1.2500 / v1 1.5625 / **v2 1.0625** / v3 1.8125 ⇒ binding = **1.0625**) and
   **108.25 ms per match**. Nothing else in that artifact is read anywhere.
2. **The frozen §4.3 arithmetic was then evaluated on those two numbers, in the
   census process, before any census match was stepped**:
   `ceil(1500 / 1.0625) = 1412` → stepped up to `N_STEP = 25` ⇒ **1425**;
   `floor(1.0 h / (108.25 ms × 4 × 2))` ⇒ **4157**; the reserved band's cap ⇒ **700**.
   `N* = min(1425, 4157, 700) = 700` — **the CAP BINDS** (`bindingTerm =
   reservedBandCap`), and the projected wall was 0.168 h against a 1.0 h budget.
   That 700 is the N that ran; the `nDerived` gate asserts it.
3. **The census then ran and RE-EVALUATED the same arithmetic on its own yield**,
   which selects nothing and is emitted as `sizingRecompute`, labelled POST-HOC:
   binding episodes/match **1.2043** (prod), **102.21 ms/match** ⇒ 1246 → **1250**,
   wall term **4402**, cap 700 ⇒ still 700, cap still binding. The census yielded
   ~13 % more episodes per match in its binding world than the smoke predicted and
   ran ~6 % faster per match; the cap bound under both, so the recompute changes
   nothing and is reported only so the smoke's estimate can be checked against
   reality. (Its `nStar` is labelled COUNTERFACTUAL in the artifact for that reason.
   The wall term is a timing measurement and is the one number here that moves
   between runs of the same block.)

**Sizing shortfall, disclosed.** Because the cap bound, the 1,500-episode
aspiration was not reached: the census carries **843 (prod) / 925 (v1) / 972 (v2) /
1,049 (v3)** episodes. N* is the frozen rule's own output and was not amended after
the smoke; the shortfall is a precision cost, and the CIs below are the honest width
that follows from it.

### §8.1 How often the trigger fires, and for how long

| world | episodes | per match | trigger ticks / played ticks | duration p50 | p90 | max |
| --- | --- | --- | --- | --- | --- | --- |
| prod | 843 | 1.204 | 1.470 % | 0.83 s | 1.67 s | 25.4 s |
| v1 | 925 | 1.321 | 1.658 % | 0.82 s | 1.85 s | 25.8 s |
| v2 | 972 | 1.389 | 1.675 % | 0.80 s | 1.67 s | 28.5 s |
| v3 | 1049 | 1.499 | 1.781 % | 0.80 s | 1.73 s | 23.8 s |

The moment is common (≈1.5–1.8 % of played time) and mostly BRIEF, with a long
tail out to ~25 s. The user's eye lives in that tail.

### §8.2 DETACHMENT — the user's 脱离球队之外 is REAL and RESOLVED in all four worlds

Episode-median metres from the centroid of the rest of his own outfield team;
`Δ` = weak-side back − ball-side control mirror, per-seed cluster bootstrap.

| world | weak p50 [CI] | mirror p50 | Δ [CI] | resolved |
| --- | --- | --- | --- | --- |
| prod | **13.61** [12.92, 14.40] | 10.83 | **+2.78** [+2.06, +3.61] | ✔ |
| v1 | 11.39 [10.81, 11.97] | 10.43 | +0.96 [+0.35, +1.62] | ✔ |
| v2 | 10.88 [10.13, 11.62] | 9.89 | +0.98 [+0.21, +1.81] | ✔ |
| v3 | **10.50** [9.97, 10.90] | 9.52 | +0.98 [+0.38, +1.51] | ✔ |

Episode p90 detachment runs 18.3–20.1 m and the worst episodes reach **35.2 m**
(prod) / 26.0 m (v3). The weak-side back is measurably further from his team than
his own ball-side twin in every world, and the excess resolves everywhere. The
three armed worlds cut the level (13.61 → 10.50 median) and cut the weak-side
EXCESS from +2.78 to +0.98 m — but none of them removes it.

### §8.3 THE STATION FIELD NEVER ASKS HIM TO COMPRESS — the headline number

`sendLatGapMean` = metres between the tick's SEND TARGET and the ball's lane
(§3.3). `SPREAD_R = 9 m` is the substrate's own body-spacing.

**THE TARGET metric** — where the field SENDS him, relative to the ball's lane:

| world | weak p50 [CI] | mirror p50 | Δ [CI] | resolved |
| --- | --- | --- | --- | --- |
| prod | **19.86** [19.65, 20.04] | 2.00 | **+17.86** [+17.65, +18.08] | ✔ |
| v1 | 18.16 [18.14, 18.19] | 1.39 | +16.78 [+16.57, +16.96] | ✔ |
| v2 | 18.18 [18.15, 18.22] | 1.26 | +16.92 [+16.76, +17.05] | ✔ |
| v3 | **18.14** [18.10, 18.18] | 1.24 | +16.90 [+16.74, +17.06] | ✔ |

The send target for the weak-side back sits **18–20 m off the ball's lane — about
twice a body-spacing further than a compressed shape implies — in every world,
with razor-tight CIs**, while his ball-side twin is sent to within 1.2–2.0 m of
the ball's lane.

**A SEPARATE, BODY metric** (fixed at the #187 fix round: the draft tabled this
beside `sendLatGapMean` with prose flowing from one to the other, which implies an
arithmetic that does not exist). `lateralGapToBall` and `compressionShortfall` are
measured on **where the body actually IS**, not on its target:
`compressionShortfall = mean(max(0, |p.pos.y − ball.pos.y| − 9))`. It is **not**
`sendLatGap − 9` and does not subtract into the table above.

| world | body latGap p50 (weak) | compressionShortfall p50 (weak) | mirror latGap p50 | mirror shortfall p50 |
| --- | --- | --- | --- | --- |
| prod | 16.56 | **7.56** | 1.97 | 0 |
| v1 | 12.88 | 4.15 | 2.10 | 0 |
| v2 | 11.76 | 2.80 | 1.89 | 0 |
| v3 | 11.18 | **2.27** | 1.83 | 0 |

Read as its own fact: the weak-side back STANDS 11–17 m off the ball's lane, i.e.
2.3–7.6 m beyond one body-spacing, and his ball-side twin stands inside the spacing
(shortfall median 0 in all four worlds). Note the body's gap is 3.3–7.0 m SMALLER
than its own send's gap in every world (16.56 vs 19.86 prod → 11.18 vs 18.14 v3) — he is generally on his way toward a target
even further out, not overshooting it.

### §8.4 OSCILLATION — the churn is NOT weak-side-specific (and its cause is beyond this instrument)

| world | switch/s weak p50 [CI] | mirror p50 | Δ [CI] | resolved | flip90/s weak (p50 / mean) |
| --- | --- | --- | --- | --- | --- |
| prod | **0.00** [0, 0] | 0.00 | 0.00 [0, 0] | ✘ | 0 / 0.0014 |
| v1 | 0.75 [0.60, 0.86] | 0.67 | +0.08 [−0.10, +0.25] | ✘ | 0 / 0.0036 |
| v2 | 0.59 [0.32, 0.75] | 0.72 | −0.13 [−0.44, +0.04] | ✘ | 0 / 0.0040 |
| v3 | 0.78 [0.67, 0.88] | 0.49 | **+0.29** [+0.06, +0.84] | ✔ | 0 / 0.0009 |

**RETRACTED at the #187 fix round: the draft attributed this churn to "the armed
eye's commitment cycling".** `switchKey` is `type|markTargetIdx|eyeCandidateId` and
`eyeCandidateId` collapses to `-` on every non-override tick, so an override lapsing
in or out is indistinguishable from an action-type flip or a new mark target on the
decision clock (§3.4). The instrument **cannot** name which of those moved the key.
What the receipts do support, stated exactly:

- On **prod the MEDIAN episode shows no change at all** (switch p50 = 0; episodes
  are short — duration p50 0.83 s), but the **mean is 0.42 /s** — the send identity
  does change on prod episodes, and prod carries **zero override ticks**. That is
  positive proof the metric fires on causes that are not the eye at all
  (action-type / mark-target alternation), and it is why no eye attribution can be
  read off this number.
- In v1/v2/v3 the median rises to 0.59–0.78 /s and the mean to 0.80–0.91 /s, i.e.
  roughly **double prod's mean**, while `eyeOverride` owns 42–54 % of ticks. So the
  churn is HIGHER where the eye is armed — but with the key collapsing as it does,
  "higher when armed" is as far as the evidence reaches; it does not isolate
  candidate cycling from the mark/station alternation the arming also changes
  (markStance falls 81.5 % → 29.6–36.0 % between prod and the armed worlds, §8.5, so
  the action mix itself is different).
- **The one clean cross-flank fact stands:** the ball-side mirror churns at
  essentially the same rate as the weak-side back (mirror means 0.41 prod / 0.88 v1
  / 0.90 v2 / 0.80 v3). The paired excess is unresolved in v1 and v2 and resolves
  only in v3, weakly (+0.29 /s, CI lower bound +0.06). Whatever the cause, it is
  **not** a weak-side phenomenon — which is the only thing §5 needs from this
  metric.
- Corner: `sendCornerShare` p50 = 0 in every world (means 0.00 %–0.68 %), and the
  body's own `posCornerShare` means are 0.5–1.3 %. **By the frozen (tight, 9 m of
  the clamp corner) test the literal 左下角 is NOT reproduced** — what IS
  reproduced is standing 18–20 m off the ball's lane inside his own third, which
  on screen occupies the far-flank region but is not the corner disc as frozen.

⚠ **INSTRUMENT DEFECT, disclosed: the heading-flip metric is near-vacuous as
frozen.** §3.5 compares CONSECUTIVE ticks (1/60 s) and the substrate accelerates
at `ACCEL = 14 m/s²` — a body's velocity can change by at most 0.23 m/s per tick,
so a >90° per-tick reversal is physically almost unreachable. Every flip rate is
therefore ≈0 by construction, not by observation. The `F` term of the §5 reading
rule contributed nothing; the `S` (switch) term carried the (ii) clause alone. A
future instrument must measure reversals over a ~0.2–0.5 s window (the marker
reaction cadence), which is the timescale 乱转 is visible on.

### §8.5 D1/D2 — WHAT ACTUALLY STEERS HIM: the mark, not the station

| world | steer mix (weak-side back, tick-weighted) |
| --- | --- |
| prod | markStance **81.5 %** · stationHome 9.3 % · ballDirected 9.1 % |
| v1 | eyeOverride 53.7 % · markStance 29.6 % · ballDirected 10.7 % · stationHome 6.0 % |
| v2 | eyeOverride 43.5 % · markStance 36.0 % · ballDirected 13.4 % · stationHome 7.1 % |
| v3 | eyeOverride 46.6 % · markStance 33.3 % · ballDirected 12.2 % · stationHome 7.8 % |

| world | markShare p50 [Δ vs mirror] | distToMark p50 | markLatGap p50 [Δ] | mark on FAR side (mean) |
| --- | --- | --- | --- | --- |
| prod | 1.00 [+1.00, ✔] | **1.84 m** | **15.68** [+10.47, ✔] | **58.6 %** |
| v1 | 1.00 [+0.22, ✔] | 6.04 m | 9.28 [+5.84, ✔] | 33.8 % |
| v2 | 1.00 [+0.36, ✔] | 4.73 m | 9.00 [+5.63, ✔] | 31.8 % |
| v3 | 1.00 [+0.49, ✔] | 4.87 m | 9.13 [+5.86, ✔] | 30.0 % |

Read plainly: **on prod the weak-side back is man-marking for 82 % of the trigger,
glued at 1.84 m to an opponent who is himself 15.7 m off the ball's lane, and that
opponent is on the FAR side of the flank 58.6 % of the time.** He is not lost — he
is dutifully following a man away from the ball, and nothing in the defensive
phase ever tells him to leave that man and compress. The armed worlds halve the
far-side marking share (30–34 %) and unglue him (4.7–6.0 m), which is exactly why
their detachment is lower.

### §8.6 D3 — the A4 home the eye prices is a DIFFERENT body

The §2.2 A4-home rule agrees with §2.1's wide back on **0.10 %–0.22 %** of
episodes. It picks slot 2 about half the time, slot 1 ~29 %, slot 3 ~19–24 %, and
the two rules' bodies stand a median **11.8–14.9 m apart**. The A4 home is
`ATTACK_FORMATIONS[...]` — an ATTACKING table, priced identically whoever holds
the ball. This is a direct measurement of the phase-blindness #186.3(i) named:
the home the station eye biases toward is not the defensive wide back's defensive
station, and is not the body the user is watching.

### §8.7 THE PRE-REGISTERED §5 READING, APPLIED MECHANICALLY

Evaluated by the probe under the rule **as frozen, including (i)'s disjunct** — the
draft's code tested only `G > SPREAD_R` and dropped "and/or the send's corner share
is materially non-zero"; the code now evaluates and emits both terms
(`reading.clauseTerms`, with `CORNER_MATERIAL = 0.05` per the §5 footnote).

| world | S (switch/s) | F (flip/s) | D (dist to send) | G (send lat gap) | corner share | G > 9? | corner material? | (i) far-from-compressed | frozen verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| prod | 0.00 | 0.00 | 10.68 | 19.86 | 0.0000 | ✔ | ✘ | ✔ | **H-186a(i) MODULATION MISSING** |
| v1 | 0.75 | 0.00 | 9.08 | 18.16 | 0.0000 | ✔ | ✘ | ✔ | H-186a(ii) OSCILLATION |
| v2 | 0.59 | 0.00 | 10.49 | 18.18 | 0.0000 | ✔ | ✘ | ✔ | H-186a(ii) OSCILLATION |
| v3 | 0.78 | 0.00 | 10.51 | 18.14 | 0.0000 | ✔ | ✘ | ✔ | H-186a(ii) OSCILLATION |

**NO VERDICT CHANGED under the restored disjunct, and the numbers say why.** The
median episode `sendCornerShare` is exactly **0.0000** in all four worlds (means
0.00 % / 0.26 % / 0.68 % / 0.35 %), two orders of magnitude below the 5 % cut, while
the first disjunct `G > 9 m` is satisfied in all four (18.14–19.86 m). A disjunction
whose first term is true everywhere and whose second is ~0 everywhere yields exactly
what the narrower coded test yielded — the four verdicts above are byte-identical to
the draft's. The defect was that the code was narrower than the frozen rule, not
that it produced a different answer.

The rule as frozen labels prod (i) and the three armed worlds (ii), because the
(i) clause requires `S < CHURN_HI` and in the armed worlds `S` exceeds 0.333 /s.
**Three facts qualify that mechanical output, all measured:**

1. `G` — the (i) clause's own substantive test — is **satisfied in all four worlds
   at once** (18.14–19.86 m ≫ SPREAD_R = 9 m, CIs a few cm wide). The send never
   asks the weak-side back to compress, in any world.
2. The churn that trips the (ii) clause in v1/v2/v3 is **not weak-side-specific**:
   the ball-side mirror churns at the same rate (paired Δ unresolved in v1 and v2,
   resolved only in v3 at +0.29 /s with the CI touching zero-plus). Its CAUSE is not
   identifiable by this instrument — see the §8.4 retraction; the flank symmetry is
   the part §5 needs and the part the receipts support.
3. The (ii) clause's "sane and near" condition is met on the wrong reading. Take the
   three HIGHEST-DETACHMENT v3 receipts among the FOUR whose weak-side back was
   steered by `stationHome` for **100 %** of the episode with **zero** switches and
   **zero** flips (⚠ #188 CORRECTION: the predicate alone matches four tabled
   receipts; the selection rule is detachment-descending. The unlisted fourth —
   seed 12,310,977 @ tick 13,812: distToSend 3.68 m, detach 23.18 m, sendLatGap
   18.63 m — sits outside the ranges below and does not carry the point. Ranges
   restated at the #187 fix round — the draft's "25 m / 20–24 m" excluded one of
   its own cited episodes):

   | v3 seed | from tick | dur | distToSend | detachment | sendLatGap |
   | --- | --- | --- | --- | --- | --- |
   | 12,310,572 | 14,881 | 2.07 s | **0.83 m** | 25.73 m | 20.53 m |
   | 12,310,300 | 14,807 | 0.88 s | **0.90 m** | 25.18 m | 23.69 m |
   | 12,310,904 | 4,533 | 0.85 s | **1.26 m** | 24.30 m | 19.54 m |

   So: `distToSend` **0.83–1.26 m**, detachment **24.3–25.7 m**, send lateral gap
   **19.5–23.7 m**. He is standing exactly where he was sent, a body-width from a
   target 20 m off the ball and 25 m from his own team. That is (i)'s picture, not
   (ii)'s.

**The census's factual readout, stated without design intent:** the evidence
supports **H-186a(i) MODULATION MISSING** as the mechanism behind the user's
picture in every world including v3 (the world he played), and does **not** support
H-186a(ii) OSCILLATION as a weak-side phenomenon — the churn measured in the armed
worlds is flank-symmetric send-identity churn of a cause this instrument cannot name
(§8.4), and on prod the median episode carries none. D1 adds a
measured CHANNEL the ruling did not enumerate: the mark assignment owns 70–82 % of
his trigger ticks and points far-side 30–59 % of the time, so whatever compression
force is missing is missing against a live marking duty, not against an idle body.

### §8.8 RECEIPTS (concrete lenses the commander can cite)

Full lists (12 worst-detachment episodes per world) in the artifact under
`worlds.<world>.receipts`. Four to name:

| world | seed | from tick (sim-s) | dur | detach | distToSend | sendLatGap | switch/s | steer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| prod | 12,310,746 | 13,452 (224.2 s) | 0.73 s | **35.18 m** | 27.41 | 25.01 | 0 | markStance 100 % (glued 1.80 m to a man 15.1 m off the ball) |
| prod | 12,310,885 | 14,251 (237.5 s) | 1.75 s | 31.60 m | 22.76 | 17.62 | 0 | markStance 100 % (glued 1.73 m) |
| v3 | 12,310,572 | 14,881 (248.0 s) | 2.07 s | **25.73 m** | **0.83 m** | 20.53 | 0 | stationHome 100 % — standing ON his target |
| v3 | 12,310,300 | 14,807 (246.8 s) | 0.88 s | 25.18 m | **0.90 m** | 23.69 | 0 | stationHome 100 % — standing ON his target |

The two v3 rows are the cleanest single lenses in the census: a defender at rest,
precisely on the target the live field gave him, 25 m from his team and 20–24 m
off the ball, not twitching at all.

### §8.9 ARTIFACT CONVENTIONS

- `NaN` serialises as `null` in the JSON (episodes with zero mark ticks have
  `null` mark metrics; the `n` field on every aggregate reports how many episodes
  actually contributed).
- Aggregate blocks report `mean / p50 / p90 / max / n` over EPISODES; the
  `contrasts` block reports episode-level MEDIANS with per-seed cluster bootstrap
  CIs and the paired (weak − mirror) delta.
- Per §7 this section states FACTS and the §5 reading only. The mechanic fork is
  the commander's and the user's.
