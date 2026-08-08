# THE MARK-SELECTION CODE MAP (phase-0, read-only)

**Authority**: commander ruling **#189.3** (乙 in the #188.3 fork, sequenced
丙→乙→甲 by the user). Dispatched to answer ONE question with traced code: **why
can a weak-side back be glued to a far-side man 15 m off the ball's lane, and
what would ever unglue him?**

**Read-only.** ZERO `src/**` changes; this document is the whole deliverable. It
states FACTS about code as it stands at commit `fa54178`, cites `file:line` for
every claim, labels anything the code does not settle as **AMBIGUOUS**, and
proposes **no** design. Fix scope is the commander's.

⚠ **FIX ROUND (ruling #190 → this revision).** The first draft failed
machine-verify on nine findings; every one is corrected **in place** below,
marked `⚠ CORRECTION` with the old claim left readable. The corrections are:
§2.1 step 3 (the mechanism was FALSE), §2.1 step 4 (station width number),
§2.2 (chaser-release row incomplete; "dominant" ranking unmeasured), §4 S1
(reader list — `actionExecutor` reads `targetIdx`, not `team.marks`), §4 S3
(`formationBase` is the wrong symbol), §5 trap 1 (a prescription beyond the
evidence), the branch disclosure immediately below, and five line-range fixes
(`genes.test.ts`, `Team.ts`, `policyGenome.ts`, the stance comment,
`formations.test.ts`). Ruling #190 §2 records what stood verified untouched:
no ball-distance / lane-relevance term anywhere in mark selection, no retention
state (fixed point, not memory), the 22 m gate exceeding `HALF_W`, the armed
worlds' unglue being a stance-target replacement, and the `formations.test.ts`
pin.

⚠ **BRANCH DISCLOSURE (undisclosed in the first draft).** `formationSpot`
([`formations.ts:133-232`](../../src/ai/formations.ts#L133)) forks on its first
line: `if (emergentPosOn()) return emergentStation(...)`
([`:140`](../../src/ai/formations.ts#L140)). **Every `formations.ts` line this
map cites (`:256-264`, `:267-284`, `:295-296`, `:304-313`, `:326-353`) lives
inside `emergentStation` (`:250-364`) — the EMERGENT path.** It is the **DEFAULT
ON** path ([`:108-113`](../../src/ai/formations.ts#L108): `_emergentPos === null`
⇒ `true`, flipped only by the settings toggle via `setEmergentPos` (`:105-107`)
or `EMERGENT_POS=0` (`:112`)), so it is what prod and the census world ran — but
every station claim here is **emergent-path-only**. The legacy table path
(`:141-232`) differs materially in exactly the place this map cares about: it
takes lateral position from `DEFEND_FORMATIONS[formationDef][p.index].y ×
widthMul` ([`:206`](../../src/ai/formations.ts#L206)) — a hand-authored table,
not a role lane fraction — and its ball-side term
([`:209`](../../src/ai/formations.ts#L209)) is a per-body **CONVERGENCE** toward
`ball.pos.y` (weight `compactness*0.25`), which *does* pull a weak-side man
toward the ball's lane, unlike the emergent path's common translation (see the
§2.1 step-3 correction). It also has **no** anti-clump, solidity or
opponent-line term. Claims that are branch-INDEPENDENT: everything in
`TeamBrain.assignMarks` / `assignChasers`, `PlayerBrain`, `actionExecutor` and
`stationEye` — i.e. §1.2, §1.3, §1.4, §2.2, §2.4 and §4 S1–S5.

**The measured facts this map explains** (banked, #188.2, from
[`FARSIDE-DEFENDER-FORENSIC.md`](FARSIDE-DEFENDER-FORENSIC.md) §8.5): on prod the
weak-side back is in `MarkOpponent` for **81.5 %** of trigger ticks, at
**1.84 m** from his mark, and that mark is himself **15.68 m** off the ball's
lane and on the **FAR** side of the flank **58.6 %** of mark ticks. The armed
worlds (v1/v2/v3) hold `markShare` p50 at 1.00 but cut far-side marking to
**30.0–33.8 %** and the mark distance to **4.73–6.04 m**.

---

## §1 THE ASSIGNMENT MECHANISM, END TO END

### §1.1 The five stations of the path

| # | what happens | where |
| --- | --- | --- |
| 1 | team mode chosen (`Press` / `Defend` / …) | [`TeamBrain.ts:58-97`](../../src/ai/TeamBrain.ts#L58) |
| 2 | chasers assigned (1–3 bodies; everyone else is "free") | [`TeamBrain.ts:99`](../../src/ai/TeamBrain.ts#L99) → `assignChasers` [`:316-441`](../../src/ai/TeamBrain.ts#L316) |
| 3 | **marks assigned** — the whole map (`Map<ourIdx, oppIdx>` on `team.marks`) | [`TeamBrain.ts:100`](../../src/ai/TeamBrain.ts#L100) → `assignMarks` [`:456-502`](../../src/ai/TeamBrain.ts#L456); the field is [`Team.ts:58`](../../src/sim/Team.ts#L58) (⚠ CORRECTION, finding 9: cited `:57-58`; `:57` is the doc comment, the `marks = new Map<number, number>()` declaration is `:58`, and `chasers` is `:56`) |
| 4 | the individual **scores** `MarkOpponent` against his other options and writes `action.targetIdx` | [`PlayerBrain.ts:1295-1302`](../../src/ai/PlayerBrain.ts#L1295), [`:1348-1354`](../../src/ai/PlayerBrain.ts#L1348) |
| 5 | the executor turns `targetIdx` into a **movement target** (the mark STANCE) | [`actionExecutor.ts:222-326`](../../src/ai/actionExecutor.ts#L222) |

Two independent clocks drive it:

- **team clock** `TEAM_AI_INTERVAL = 0.4 s` ([`constants.ts:344`](../../src/sim/constants.ts#L344)),
  ticked at [`Match.ts:1221-1249`](../../src/sim/Match.ts#L1221). Every firing
  **clears and fully rebuilds** `team.marks` ([`TeamBrain.ts:457`](../../src/ai/TeamBrain.ts#L457)).
- **body clock** `AI_INTERVAL = 0.15 s` ([`constants.ts:342`](../../src/sim/constants.ts#L342)),
  staggered per body at [`Match.ts:1117`](../../src/sim/Match.ts#L1117), consumed at
  [`Match.ts:1274-1278`](../../src/sim/Match.ts#L1274). `p.action.targetIdx` can
  therefore lag `team.marks` by up to one body interval.

Off-clock re-coordination is forced (`brainTimer` clamped to 0.05 s) on a
possession swing [`Match.ts:1826-1828`](../../src/sim/Match.ts#L1826), a send-off
[`Match.ts:2517-2518`](../../src/sim/Match.ts#L2517) and a restart award
[`Match.ts:2681-2682`](../../src/sim/Match.ts#L2681).

### §1.2 The choice rule, verbatim in structure

`assignMarks` ([`TeamBrain.ts:456-502`](../../src/ai/TeamBrain.ts#L456)) is a
**greedy, deterministic, threat-major loop**:

1. **Early out**: `if (match.possessionSide === team.side) return` — with the map
   already cleared, so *we have the ball ⇒ no marks at all* (`:457-458`).
2. **Threat list** (`:473-475`): every opponent except GK, the **current
   carrier**, sent-off men and the restart taker — **sorted by how deep they are
   in our half** (`opp.localX(b) − opp.localX(a)`, index tiebreak). Depth is the
   ONLY ranking key.
3. **Free list** (`:477`): our outfielders who are not chasers and not sent off.
4. **Zones** (`:479`, zonal scheme only): each free body's zone centre =
   `formationSpot(p, team, ball, false, opp)` — *his own defensive station*.
5. For each threat in depth order, pick the **nearest** eligible free body
   (`:481-496`), subject to three filters:
   - **WG width discipline** (`:490`): a `WG` wider than 12 m may not take a
     threat inside 8 m of centre (Phase 28.4).
   - **zonal gate** (`:493`): outside our box, only a defender whose **own
     station** is within **9 m** of the threat may engage.
   - **range gate** (`:495`): `d < 22`, `d = dist(defender, threat)`.
6. Claim it: `used.add`, `team.marks.set(bestIdx, threat.index)` (`:497-500`).
   One threat per defender, one defender per threat, first-come by threat depth.

### §1.3 Every input to the choice, enumerated

| input | read at | role |
| --- | --- | --- |
| `match.possessionSide` | `TeamBrain.ts:458` | the whole map exists only out of possession |
| opponent `localX` (depth in our half) | `:475` | the ONLY threat-priority key |
| `ball.owner` (the carrier) | `:462`, `:474` | carrier is EXCLUDED from the threat list |
| `match.restart?.takerGid` | `:470`, `:474` | taker excluded |
| defender↔threat euclidean distance | `:494-495` | the assignment score AND the range gate |
| defender role + `|pos.y|`, threat `|pos.y|` | `:490` | WG width discipline only |
| `team.style.scheme` | `:460` | man vs zonal |
| `formationSpot(...)` per free body | `:479` | zonal zone centres only |
| our-box test on the threat | `:471-472`, `:482` | box threats bypass the zonal gate |
| `team.chasers` | `:477` | pressers are not markers |

**The negative result, stated flatly: the ball's POSITION enters `assignMarks`
only through the carrier exclusion (`:474`) and, in the zonal scheme, through
`formationSpot`'s own ball terms (`:479`).** There is no term for
defender-to-ball distance, no term for threat-to-ball distance, and no
lane-relevance / passing-distance term anywhere in the scoring
(`d = dist(p.pos, threat.pos)`, `:494`). Nothing in the loop knows or asks
whether the man being assigned could ever receive the ball.

### §1.4 The individual's score, and the stance

- `MarkOpponent` scores `W.markBase + g.markingAggression * 0.15`
  ([`PlayerBrain.ts:1300`](../../src/ai/PlayerBrain.ts#L1300)) against
  `MoveToFormationSpot`'s `0.42 + g.defensiveCompactness * 0.08` (max 0.50)
  ([`:1341-1345`](../../src/ai/PlayerBrain.ts#L1341)). `markBase` defaults to
  **0.62** ([`types.ts:222`](../../src/sim/types.ts#L222)), so with a mark in
  hand `MarkOpponent` wins on default weights **before** the aggression term.
  Highest score wins outright ([`:1348-1349`](../../src/ai/PlayerBrain.ts#L1348)).
- The stance target ([`actionExecutor.ts:257-274`](../../src/ai/actionExecutor.ts#L257))
  = the mark's position + `markDist` along a blend of (mark→our goal) and
  (mark→ball), the ball term weighted `laneW = 0.22 + markingAggression*0.22`
  (`:268`). `markDist = 2.6 − markingAggression*1.4` (`:239`) ⇒ **1.2–2.6 m**.
  That is the 1.84 m the forensic measured.
- Note what the stance's ball term is: it rotates the defender **around his
  mark**; it never moves him **toward the ball's lane**. He stays a
  body-and-a-half from the man wherever the man goes.

---

## §2 THE FAR-SIDE GLUE, EXPLAINED

### §2.1 The trace, step by step

State at the trigger (the user's lens): the opponents carry the ball deep in our
third on one flank; our weak-side back stands on the other flank, on his own
station.

1. **He is not a chaser.** `assignChasers` sends 0–3 bodies at the ball
   (count at [`TeamBrain.ts:359-395`](../../src/ai/TeamBrain.ts#L359)), picked by
   **distance to the ball** ([`:437-440`](../../src/ai/TeamBrain.ts#L437)).
   The weak-side back is the furthest man from the ball, so he is never picked by
   that rule — he lands in the `free` list
   ([`:477`](../../src/ai/TeamBrain.ts#L477)). ⚠ CORRECTION (finding 5, same
   defect as the §2.2 chaser row): "1–2" understated it — `count` reaches **3**
   inside the phase-112 transition window (`:373-387`), and the ATTACK-THE-DROP
   branch (`:397-435`) picks by **arrival time to the landing point**, not ball
   distance, so on an opponent's long hoof the furthest man from the ball *can*
   be the chaser.
2. **A far-side opponent is a threat with high priority.** Threats are sorted by
   DEPTH only ([`:475`](../../src/ai/TeamBrain.ts#L475)). An opponent winger
   parked on the weak flank, deep in our third, sorts at or near the top of the
   list — no matter that the ball is 15 m of width away.
3. **He is the nearest free body to that threat.** The nearest-body rule is
   [`TeamBrain.ts:494-495`](../../src/ai/TeamBrain.ts#L494) (`d = dist(p.pos,
   threat.pos)`, min over the *surviving* free bodies).

   ⚠ **CORRECTION (finding 1, the FALSE mechanism).** The first draft wrote:
   *"They are on the same flank; everyone else has shifted ball-side (the station
   field's own ball-side shift, `formations.ts:295-296`)."* **That is false.**
   `formations.ts:295-296` is a **COMMON TRANSLATION**: `y += ball.pos.y *
   ballSideShift` is added to **every** body's station with the **same**
   coefficient (`0.18 + defensiveCompactness*0.25` out of possession) — the code
   comment says so explicitly (`:292-294`: "TRANSLATE the block ball-side (add a
   common offset) — do NOT converge each man onto ball.y … The whole shape slides
   over, keeping its width"). A uniform offset **cannot** change who is nearest
   to anything: it preserves the lateral ORDER of the stations and every
   station-to-station gap. "Everyone else shifted ball-side" is therefore not a
   mechanism at all. (The legacy table path's `:209` term *is* a per-body
   convergence and would differentiate — but that path was OFF; see the branch
   disclosure.)

   **The TRUE mechanism, re-derived from code, is three facts stacked:**

   a. **LANE GEOMETRY: only two of the six bodies have a wide station, one per
      flank.** In `emergentStation` the lane anchor is
      [`formations.ts:256-264`](../../src/ai/formations.ts#L256): `laneSign =
      p.index === 3 ? -1 : p.index === 4 ? 1 : 0`, and `laneFrac` is `laneSign *
      0.6` for `WG`, `laneSign * 0.12` for `MF`, **0** for `GK` / `DF` / `ST`.
      With `ROLES = ['GK','DF','MF','WG','WG','ST']`
      ([`types.ts:27`](../../src/sim/types.ts#L27)), the only `laneSign ≠ 0`
      slots are 3 and 4 — both `WG` — so slot 3 owns the −y flank, slot 4 the +y
      flank, and slots 1 (`DF`), 2 (`MF`, `laneSign = 0` ⇒ `laneFrac = 0`) and 5
      (`ST`) all hold the **centre lane**. The weak-side wide body is thus the
      *only* body whose station sits on the far flank; the common ball-side
      translation slides the whole set over but leaves him the widest man on his
      side, and the anti-clump repulsion
      ([`:326-343`](../../src/ai/formations.ts#L326), stations repel inside 9 m)
      actively *maintains* that separation rather than closing it.
   b. **THE BALL-SIDE BODIES ARE CONSUMED AS CHASERS.** `assignChasers` picks the
      `count` nearest bodies **to the ball**
      ([`TeamBrain.ts:437-440`](../../src/ai/TeamBrain.ts#L437)) — i.e. ball-side
      bodies — and `free` is built by **excluding** them
      ([`:477`](../../src/ai/TeamBrain.ts#L477)). Those bodies are not candidates
      for any threat, far-side or not.
   c. **THE GREEDY DEPTH-MAJOR LOOP SPENDS THE REST BALL-SIDE FIRST.** Threats
      are iterated in depth order ([`:475`](../../src/ai/TeamBrain.ts#L475),
      `:481`) and each claim is exclusive (`used`, `:485`, `:498`). The deeper
      ball-side threats are reached first and take the central/ball-side free
      bodies, so by the time the far-flank threat is reached the candidate set is
      thinned — and the weak-side wide body, standing on that flank (a), is the
      minimiser of `dist(p.pos, threat.pos)` among whoever is left.

   Together: he is nearest **because his slot's lane anchor puts him there and
   because every body nearer the ball has already been spent** — a
   consumption-plus-lane-geometry fact, not a shift fact. With 6 bodies, one GK,
   1–3 chasers (§2.2) and ≤ 5 threats, the free list is 2–4 bodies wide, so this
   thinning is not marginal.

   ⚠ **AMBIGUOUS (labelled hypothesis)**: *which* bodies were chasers or already
   `used` on the receipt's tick — and therefore how much of (b)/(c) was load-
   bearing versus (a) alone — is **not** recoverable from the banked artifact
   (§2.3). (a) is derivable from the receipt (slot 4 = the `laneSign = +1` wide
   body, `flankSign = −1` ⇒ ball on the other flank); (b) and (c) need the
   re-walk probe.
4. **No gate stops it.**
   - Range: `d < 22` — and `HALF_W = 58 × 0.7 / 2 = 20.3 m`
     ([`constants.ts:35-37`](../../src/sim/constants.ts#L35)), so **the 22 m mark
     radius exceeds the pitch's own half-width**. In his own third the gate
     excludes essentially nothing lateral.
   - WG discipline (`:490`) fires only for threats **inside 8 m of centre** — a
     far-flank threat is the opposite case, so the filter is silent.
   - Zonal (`:493`) would need the threat within 9 m of **his own station** — and
     his station IS on the weak flank.

     ⚠ **CORRECTION (finding 2, a FALSE number).** The first draft wrote
     *"`laneFrac = ±0.6 × HALF_W ≈ ±12.2 m` (`formations.ts:256-263`)"*. That
     drops the width multiplier. The station's lateral coordinate is
     `y = laneFrac * HALF_W * widthMul`
     ([`formations.ts:284`](../../src/ai/formations.ts#L284)) with
     `widthMul = 1.15 − defensiveCompactness*0.6` out of possession
     ([`:282`](../../src/ai/formations.ts#L282)) ⇒ `widthMul ∈ [0.55, 1.15]`.
     With `laneFrac = 0.6` and `HALF_W = 20.3 m`
     ([`constants.ts:35-37`](../../src/sim/constants.ts#L35)), `0.6 × 20.3 =
     12.18 m` is only the `widthMul = 1` case; the true band is
     **6.7 m … 14.0 m**. In the **zonal** scheme `widthMul` is floored at 0.95
     ([`:283`](../../src/ai/formations.ts#L283)) ⇒ `widthMul ∈ [0.95, 1.15]` and
     the band is **11.6 m … 14.0 m**. (Both bands are pre-modifier: the common
     ball-side translation then adds `ball.pos.y × (0.18…0.43)` (`:295-296`), the
     solidity term multiplies `y` by `1 − threat*(0.3+compactness*0.5)*0.3`
     ∈ [0.835, 1] for non-`ST` under threat (`:349-353`), and anti-clump adds
     ≤ ±7 m (`:342-343`).)

     **Does the 9 m argument survive the corrected numbers? Yes, but narrower
     than stated.** The gate only exists in the zonal scheme (`zones` is `null`
     otherwise, `:479`), and zonal is exactly the branch whose `widthMul` is
     floored — so the zone centre's lane is **never narrower than ≈11.6 m**, and
     the 6.7 m low end is unreachable where the gate applies. A far-flank threat
     standing beside the weak-side man (the receipt's 1.84 m) is then inside the
     9 m radius provided the pair's **depth** (x) difference is also small: the
     gate is a 2-D distance `dist(zoneCentre, threat.pos) > 9`, so it excludes a
     far-side man who is wider than the station or ≳9 m off it in x. That
     exclusion is real and pinned: `formations.test.ts:150-155` stages a flank
     threat at `y = 25`, wider than any station, and asserts **zonal does NOT
     mark him**. So the honest claim is: *the zonal gate is a station-proximity
     test, not a ball-relevance test — it excludes far-side men who are far from
     the weak-side man's station, and permits the ones parked next to him.*
   - Lane relevance: no such term exists (§1.3).
5. **`MarkOpponent` wins his own decision** ([`PlayerBrain.ts:1295-1302`](../../src/ai/PlayerBrain.ts#L1295)):
   0.62 + aggression vs 0.42 + compactness.
6. **The executor parks him 1.2–2.6 m from the man**
   ([`actionExecutor.ts:239`, `:274`](../../src/ai/actionExecutor.ts#L239)) and
   walks him at `speedF = 0.85 + markingAggression*0.15` (`:321`) — near-sprint,
   so he *tracks* rather than trails.
7. **The next team tick re-derives the same answer.** `team.marks` is cleared and
   rebuilt from scratch every 0.4 s ([`:457`](../../src/ai/TeamBrain.ts#L457)) —
   but the inputs are unchanged and the rule is deterministic, so the assignment
   is a **fixed point**, not a memory. There is no hysteresis and no stickiness
   term in the code; the glue is re-earned 2.5×/s. (This is why the prod receipts
   show `switchRate = 0` on a mechanism with no commitment window at all.)

### §2.2 What would EVER unglue him — the complete release list

Marks are not "released"; the map is rebuilt. He loses this mark on the next team
tick iff one of these becomes true:

| release | where | note |
| --- | --- | --- |
| we win the ball (`possessionSide === team.side`) | `TeamBrain.ts:458` | ⚠ CORRECTION (finding 7): the first draft called this "**the dominant real-world release**". That ranking is **UNMEASURED** — no probe in this arc counted which row fires. Code-level fact only: this row clears the *entire* map for every body at once (`:457-458`), whereas every other row releases one pair. Frequency is a **labelled hypothesis**, not a result. |
| play stops (not `playing`/`restart`) | `TeamBrain.ts:28-36` | `marks.clear()` at `:31` |
| his mark becomes the CARRIER | `TeamBrain.ts:474` | carrier is filtered out of threats |
| the mark drifts ≥ 22 m away | `TeamBrain.ts:495` | wider than a half-pitch (§2.1.4) |
| a DEEPER threat claims him first (he is nearest to it) | `TeamBrain.ts:481-500` | the only competitive release |
| he becomes a chaser | `TeamBrain.ts:477` (membership built at `:359-440`) | ⚠ CORRECTION (finding 5): the first draft said this "requires being **1st/2nd nearest the ball**" — INCOMPLETE. Three ways in: (i) the steady-state pick, the `count` nearest **to the ball** (`:437-440`), `count = 1`, `+1` for `Press` mode or `pressIntensity > 0.78` (`:367`); (ii) **the phase-112 transition window** (`:373-387`) — for `sinceLoss < 3.0 s` a gegenpress side (`transitionPress` normalised `> 0.3`) goes to **`count = 3`**, so the 3rd-nearest body becomes a chaser too (and a drop-and-recover side, `< −0.3`, is clamped back to 1, `:385`); (iii) **ATTACK-THE-DROP** (`:397-435`) — on an opponent's lofted ball in flight (`ball.z > 0.5 \|\| vz > 2`, `pass.side !== team.side`, `owner === null`) with `flight > 12 m` and the landing **outside our box**, the single chaser is whoever minimises **arrival time** `dist(p.pos, land) / topSpeed` to `ballLanding(ball)` (`:421-434`) — a ball-distance-independent pick that CAN name the weak-side man, and it `return`s, replacing the whole by-distance list. Counter-cases in the same block: `count = 0` while the opponent GK holds/distributes (`:357-361`) or at a goal kick (`:395`), `count = 1` at other restarts (`:395`) and for a loose ball (`:372`) — those rows *prevent* this release. |
| zonal only: the mark leaves his 9 m station zone | `TeamBrain.ts:493` | zone centre moves with his own station |
| his mark is sent off / he is sent off | `Match.ts:2511-2516` | bookkeeping |
| half-time / kickoff reset | `Match.ts:3408` | `marks.clear()` |

**Not on the list, by inspection: any condition mentioning the ball's distance,
the ball's lane, the mark's threat level, the team's shape, or how detached the
marker has become.** That absence is exactly the #188.2(b) verdict — "nothing in
the defensive phase ever tells him to leave that man and compress" — located in
code.

### §2.3 The receipt as a lens (prod, seed 12,310,746 @ tick 13,452)

From the artifact (`worlds.prod.receipts[0]` of
[`data/farside-defender-forensic.json`](data/farside-defender-forensic.json)):
`defendingSide 0`, `flankSign −1` (ball on the −y flank), **weak-side slot 4**,
0.733 s episode, `markShare 1`, `distToMarkMean 1.804`, `markLatGapMean 15.12`,
`detachMean 35.18`, `distToSendMean 27.41`, `switchRate 0`, steer mix
`markStance 100 %`.

Slot 4 is the `laneSign = +1` wide body ([`formations.ts:256`](../../src/ai/formations.ts#L256)),
i.e. the +y flank while the ball is at −y: the geometry of §2.1 exactly. Slot 4's
**role is `WG`** ([`types.ts:27`](../../src/sim/types.ts#L27):
`ROLES = ['GK','DF','MF','WG','WG','ST']`) — so "weak-side back" is the user's
positional description of the far-flank wide slot, and two code consequences
follow: his station lane is the `WG` fraction `0.6` (`formations.ts:263`, the
§2.1-step-4 band), and the WG width-discipline filter
([`TeamBrain.ts:490`](../../src/ai/TeamBrain.ts#L490)) is the one gate that
*could* apply to him — it does not here, because it only blocks **central**
threats (`|threat.pos.y| < 8`). His mark
sits 15.1 m off the ball's lane and he holds 1.80 m from him — inside the
`markDist` band `1.2–2.6` ([`actionExecutor.ts:239`](../../src/ai/actionExecutor.ts#L239)) —
for the whole episode, with zero switches, which is the fixed-point behaviour of
§2.1.7.

⚠ **AMBIGUOUS (labelled hypothesis, not verified)**: which of the nine release
rows was closest to firing, and whether this defending team's
`style.scheme` was `man` or `zonal` ([`types.ts:89`](../../src/sim/types.ts#L89):
`scheme = markingAggression >= 0.3 ? 'man' : 'zonal'`), is **not** recoverable by
reading — the artifact stores no per-episode scheme, threat ordering or mark
identity beyond the derived metrics. Deciding it needs a probe that re-walks the
seed and dumps `team.marks` + `style.scheme` per tick. Everything in §2.1–§2.2 is
code-level and scheme-agnostic except row 7.

### §2.4 Why the ARMED worlds halve it

The armed worlds (`v1/v2/v3`) arm the **station eye** and, for v2/v3, per-body
home-prior offsets ([`farside-defender-forensic.ts:207-216`](../../scripts/probes/farside-defender-forensic.ts#L207);
`src/game/a4World.ts:155`, `:246`). Two code facts:

1. **`MarkOpponent` is in `STATION_FAMILY`**
   ([`stationEye.ts:340-343`](../../src/ai/stationEye.ts#L340)). So on an
   override tick the eye **replaces the mark stance target** with a
   **ball-relative** point `ball.pos + (dx, dy)` from the 18-candidate lattice
   (radii 7/14/21 m, [`stationEye.ts:176-188`](../../src/ai/stationEye.ts#L176)),
   applied at [`actionExecutor.ts:1055-1062`](../../src/ai/actionExecutor.ts#L1055),
   committed for `EYE_W_S = 3.0 s` ([`stationEye.ts:39`](../../src/ai/stationEye.ts#L39)).
   The **assignment is untouched** — `team.marks` and `action.type` still say
   `MarkOpponent` (which is why `markShare` p50 stays 1.00 in every world) — but
   the body no longer walks to the man. That is the measured unglue from 1.84 m
   to 4.73–6.04 m, and the D2 steer-mix shift `markStance 81.5 % → 29.6–36.0 %`
   is the same ticks being re-labelled `eyeOverride` by the probe's own
   precedence.
2. **The far-side SHARE falls for a second, indirect reason.** The far-side share
   is a property of `assignMarks`' output, which the eye never calls. The only
   channel is **positional feedback**: the eye pulls bodies to ball-relative
   points, `assignMarks` runs on `p.pos` (`:494`) at the next 0.4 s tick, so the
   nearest-body ranking changes and far-side men are more often claimed by
   somebody else or fall outside `d < 22`.
   ⚠ **AMBIGUOUS / hypothesis-labelled**: the code supports this as the ONLY
   available channel (no eye code writes `team.marks`; grep for `marks.set` finds
   exactly one writer, `TeamBrain.ts:499`), but the census did not isolate it and
   this map runs no probe. Confirming it needs a per-tick dump of assignment
   identity vs body positions in the armed worlds.

---

## §3 GENE / ATTR vs HAND-RULE INVENTORY (everything in the path)

### §3.1 Evolvable

| knob | kind | where read | what it moves |
| --- | --- | --- | --- |
| `markingAggression` | tactical gene ([`genome.ts:28-29`](../../src/evolution/genome.ts#L28), key list [`:268`](../../src/evolution/genome.ts#L268)) | `PlayerBrain.ts:1300`; `actionExecutor.ts:239,255,268,321` | mark score, stance distance, stance lane weight, marker speed |
| `markBase` | **policy gene** (per-franchise, key at [`policyGenome.ts:24`](../../src/evolution/policyGenome.ts#L24), bounds `MIN_MUL 0.5` / `MAX_MUL 1.7 ×` its default 0.62 ⇒ **0.31–1.05**, [`:39-43`](../../src/evolution/policyGenome.ts#L39) — ⚠ CORRECTION, finding 9: cited `:37-45`; `:36-38` is the doc comment, `MIN_MUL`/`MAX_MUL` are `:39-40` and `boundsFor` is `:41-44`) | `PlayerBrain.ts:1300` | mark-vs-shape appetite. At the low bound (0.31) the mark can LOSE to `MoveToFormationSpot` (0.42–0.50) |
| `style.scheme` (man/zonal) | derived from `markingAggression >= 0.3` ([`types.ts:89`](../../src/sim/types.ts#L89)) | `TeamBrain.ts:460` | whether the 9 m zone gate exists at all |
| `defensiveCompactness` | tactical gene | `PlayerBrain.ts:1343`; `formations.ts:282,295,350-352` | shape appetite; the ONLY ball-side lateral pull in defence |
| `pressIntensity` | tactical gene | `TeamBrain.ts:85,367`; `formations.ts:270` | chaser count (hence who is "free"), block height |
| `formationDepth`, `coverBias`, `attackingWidth` | tactical genes | `formations.ts:269,277-278,282` | where the station — hence the zonal zone centre and the pre-mark position — sits |
| `trapBias` | tactical gene | `actionExecutor.ts:291-298` | how far a marker refuses to be dragged in **x** (never in y: `:296` keeps `target.y`) |
| `defending` | player **attr** | `actionExecutor.ts:310` | marker reaction lag `0.45 − defending*0.25 s` |
| `homePriorObedience(+Offset)` | tactical gene (armed worlds only) | `stationEye.ts:160-171`; probe `:199-205` | eye home bias; null/absent in prod |

### §3.2 Hand rules (constants, no gene, no attr)

| constant | where | note |
| --- | --- | --- |
| threat priority = **depth only** | `TeamBrain.ts:475` | no gene, no weighting |
| mark range **22 m** | `TeamBrain.ts:495` | > `HALF_W` (20.3 m) |
| zonal zone radius **9 m** | `TeamBrain.ts:493` | |
| WG width discipline **12 m / 8 m** | `TeamBrain.ts:490` | Phase 28.4 |
| chaser counts **1 / 2 / 3** and their gates | `TeamBrain.ts:359-395` | Phase 31 "never three" + the 112 window |
| `TEAM_AI_INTERVAL 0.4 s`, `AI_INTERVAL 0.15 s` | `constants.ts:342,344` | the re-derivation cadence |
| stance floor **1.2 m** / carrier stand-off **2.6 m** | `actionExecutor.ts:239` | Phase 30.5 / 29.1 |
| distribution stand-off **2.0–2.6 m** | `actionExecutor.ts:250-256` | Phase 31.6 |
| `laneW` base **0.22** | `actionExecutor.ts:268` | Phase 27.1 |
| trap danger-zone **−17 m** | `actionExecutor.ts:292` | shared with the jockey (Phase 92) |
| `MoveToFormationSpot` defensive base **0.42** | `PlayerBrain.ts:1343` | not a policy gene |
| contain branch **8 m / 35 m / one-body** | `PlayerBrain.ts:1321-1331` | Phase 29.1; writes `markTarget = carrier.index` without touching `team.marks` |
| ball-side shift `0.18 + compactness*0.25` | `formations.ts:295-296` (emergent path only) | the substrate's ENTIRE lateral ball-side modulation out of possession (≤ 0.43 × ball.y). ⚠ It is a **COMMON TRANSLATION** — the same offset for every body (`:292-294`), so it moves the block, never the *relative* order of stations (the §2.1 step-3 correction). The legacy table path's counterpart `:209` is a per-body convergence instead. |
| solidity central pull `threat*(0.3+compactness*0.5)*0.3` | `formations.ts:349-353` | pulls toward y = 0, not toward the ball's lane |

---

## §4 WHAT A NARROW FIX WOULD TOUCH — the candidate surfaces and their blast radius

Facts only; no recommendation, no ranking.

**S1 — a lane-relevance / ball-relevance term inside the mark SCORE**
([`TeamBrain.ts:494-495`](../../src/ai/TeamBrain.ts#L494)).
Blast radius. ⚠ **CORRECTION (finding 3, a FALSE reader).** The first draft listed
`actionExecutor.ts:222-224` as a reader of `team.marks`. **It is not one.**
`grep -n "\.marks" src/` returns exactly six `src` sites and `actionExecutor.ts`
is not among them. The **complete** `team.marks` surface is:

| site | kind |
| --- | --- |
| [`TeamBrain.ts:499`](../../src/ai/TeamBrain.ts#L499) | the ONLY writer (`marks.set`) |
| [`TeamBrain.ts:31`](../../src/ai/TeamBrain.ts#L31), [`:457`](../../src/ai/TeamBrain.ts#L457) | clears (play stopped / every rebuild) |
| [`PlayerBrain.ts:1295`](../../src/ai/PlayerBrain.ts#L1295) | reader — the mark candidate |
| [`PlayerBrain.ts:1324`](../../src/ai/PlayerBrain.ts#L1324) | reader — container eligibility (a body that stops being a marker becomes eligible to jockey the carrier) |
| [`Match.ts:2511-2515`](../../src/sim/Match.ts#L2511) | send-off cleanup (deletes both directions) |
| [`Match.ts:3408`](../../src/sim/Match.ts#L3408) | half-time / kickoff clear |
| [`RenderStateAdapter.ts:296`](../../src/render3d/RenderStateAdapter.ts#L296) | reader — the on-screen marking lines / `flags.marking`, [`DebugOverlay.ts:49`](../../src/render/DebugOverlay.ts#L49) |
| `tests/cloneState.test.ts:50` | state-clone contract (`marks: [...side.marks]`) |

**The executor's real input is `p.action.targetIdx`**
([`actionExecutor.ts:223`](../../src/ai/actionExecutor.ts#L223):
`const markIdx = p.action.targetIdx`), written at
[`PlayerBrain.ts:1352`](../../src/ai/PlayerBrain.ts#L1352) from `markTarget`.
Two consequences the first draft understated:

- **Staleness indirection.** `targetIdx` is a *snapshot* taken on the body's own
  0.15 s tick, while `team.marks` is rebuilt on the team's 0.4 s tick, so the
  stance can be executed against an assignment up to one body interval (0.15 s)
  out of date (§1.1). A change to `assignMarks` reaches the executor only via
  the next `decidePlayer` for that body — there is no path from `team.marks` to
  a movement target that skips `PlayerBrain`.
- **`targetIdx` is not always a `team.marks` entry.** The contain branch writes
  `markTarget = carrier.index` with **no** map entry
  ([`PlayerBrain.ts:1332`](../../src/ai/PlayerBrain.ts#L1332), trap 8), so the
  executor's mark path also serves ticks the map never authored.

Tests that pin current behaviour: `formations.test.ts:143-156` asserts man-marking
tracks **the flank threat wherever it goes** (`:147`) and that zonal does NOT
(`:155`) — i.e. the current far-side behaviour is an explicit, asserted contract
— and `onball.test.ts:372-378` asserts the contain fallback appears once `marks`
is empty. Branch note: the `marking schemes` describe
([`formations.test.ts:105-157`](../../tests/formations.test.ts#L105)) has **no**
`setEmergentPos` hook of its own (the `beforeEach`/`afterEach` pairs at `:76-77`,
`:164-165`, `:293-294` belong to other describes), so this pin runs on the
**emergent** default path — even though its staging still names a `low-32`
defensive table (`:110`) that the emergent path ignores.

**S2 — the threat PRIORITY key** ([`TeamBrain.ts:475`](../../src/ai/TeamBrain.ts#L475)).
Same consumers as S1. Additionally: the loop is greedy, so re-ordering threats
re-orders *every* claim, not just the far-side one — the box threat currently
claimed in **both** schemes could lose its marker to an earlier-sorted man.
⚠ CORRECTION (finding 9): the box-threat pin was cited as
`formations.test.ts:146-152`; the real assertions are
[`:148`](../../tests/formations.test.ts#L148) (`expect(manMarked.has(3))`) and
[`:153`](../../tests/formations.test.ts#L153) (`expect(zonalMarked.has(3))` — "the
box is still defended man-for-man"), with the box threat staged at
[`:131`](../../tests/formations.test.ts#L131) (`B.players[3].pos = { x: -38, y: 2 }`)
and the whole test spanning `:143-156`.

**S3 — the RANGE gate 22 m** ([`TeamBrain.ts:495`](../../src/ai/TeamBrain.ts#L495)).
Tightening it leaves far-side threats UNMARKED rather than differently marked
(there is no fallback assignment pass), which changes how many bodies fall back
to `MoveToFormationSpot` — and hence how much of the game the station field the
#188 verdict already indicts is driving.

⚠ **CORRECTION (finding 4, a WRONG SYMBOL).** The first draft said that fallback
is "priced against **`formationBase`**". It is not. In the defending branch the
`MoveToFormationSpot` candidate is scored by a **hardcoded literal**:
`0.42 + g.defensiveCompactness * 0.08`
([`PlayerBrain.ts:1341-1344`](../../src/ai/PlayerBrain.ts#L1341)) ⇒ 0.42–0.50,
no policy gene — exactly as §1.4 and the §3.2 row ("`MoveToFormationSpot`
defensive base **0.42** · `PlayerBrain.ts:1343` · not a policy gene") already
state; S3 contradicted them. `W.formationBase` **does** exist
([`types.ts:174`](../../src/sim/types.ts#L174), default **0.45**
[`:220`](../../src/sim/types.ts#L220)) but is read only at
[`PlayerBrain.ts:1262`](../../src/ai/PlayerBrain.ts#L1262) — the **in-possession**
`MoveToFormationSpot` candidate (the `else` at `:1265` opens the
they-have-the-ball branch). It is also **not** in `POLICY_GENE_KEYS`
([`policyGenome.ts:18-31`](../../src/evolution/policyGenome.ts#L18)), so it is a
hand constant either way. Net effect on S3's argument: the mark/shape ordering in
defence is `markBase`-vs-literal, so tightening the range gate trades marking for
a **fixed** 0.42–0.50 fallback, and only `markBase` (§3.1) can move the other
side of that comparison.

**S4 — a RELEASE condition** (a new predicate anywhere in
[`TeamBrain.ts:481-500`](../../src/ai/TeamBrain.ts#L481), or a mark-dropping
branch at [`PlayerBrain.ts:1295-1302`](../../src/ai/PlayerBrain.ts#L1295)).
Note the structural fact: there is no retention state to release — the map is
rebuilt each 0.4 s (`:457`), so a "release" is a *filter* on re-assignment. A
release implemented at `PlayerBrain.ts:1296` instead (declining an assigned mark)
leaves `team.marks` claiming him, so the threat is neither marked nor
re-assignable (one defender per threat, `used`, `:498`) and the marking overlay
would draw a line nobody is honouring.

**S5 — the mark STANCE** ([`actionExecutor.ts:257-274`](../../src/ai/actionExecutor.ts#L257),
`laneW` at `:268`, `markDist` at `:239`).
Blast radius is the documented failure-mode ledger in that block: the 1.2 m floor
exists because tighter stances put markers inside the 1.15 m tackle radius and
killed possession chains (Phase 30.5, comment
[`:232-238`](../../src/ai/actionExecutor.ts#L232) — ⚠ CORRECTION, finding 9:
cited `:234-238`; the "Stance floor 0.8 → 1.2m (Phase 30.5)" comment **opens at
`:232`** and the `markDist` line it guards is `:239`); a stronger ball-side
pull previously dragged every marker into the central corridor (Phase 27.1,
comment `:266-267`); flattening the aggression slope inverted the
`markingAggression` payoff and is pinned by
[`genes.test.ts:102-130`](../../tests/genes.test.ts#L102) (the 300-attempt
tackle-win margin is asserted at **`:130`**, `expect(tackleWins(0.9))
.toBeGreaterThan(tackleWins(0.1) + 20)` — ⚠ CORRECTION, finding 9: cited
`:102-129`, which stops one line short of the assertion; note also the tests live
in `tests/`, not beside the sources). `markDist`/`laneW` are also the offside-trap
(`:291-298`) and reaction-lag (`:299-320`) inputs.

**S6 — the defensive station's lateral ball-side term**
([`formations.ts:295-296`](../../src/ai/formations.ts#L295)).
This is the 甲 arc's surface, not the mark's, but it is coupled: `formationSpot`
is the zonal zone centre (`TeamBrain.ts:479`), the `MarkOpponent` no-target
fallback (`actionExecutor.ts:323`), the trap's hold line (`:294`), the
`MoveToFormationSpot` target (`:135`), and per ruling **#35.3** it is also read
by the onside clamp, `shapeReady`'s restart gate and `supportSpot` — that ruling
already ruled interventions must fork the *read*, never the function, precisely
because of these side doors.

---

## §5 TRAPS

1. **The far-side mark is an asserted contract, not an oversight.**
   `formations.test.ts:143-156` (`:147`, "flank threat tracked wherever it goes")
   and the Phase-30 comment at
   [`TeamBrain.ts:447-454`](../../src/ai/TeamBrain.ts#L447) are the record.

   ⚠ **CORRECTION (finding 8, a PRESCRIPTION beyond the evidence).** The first
   draft closed: *"Any fix that makes markers refuse far-side men moves toward
   that measured failure."* That over-reaches. **The narrower fact, verbatim in
   scope:** the Phase-30 comment (`:451-454`) records that **a zonal first cut in
   which zone defenders NEVER ENGAGED** parked an impenetrable 5-body wall — 3
   shots/match conceded, league shot volume collapsed. "Never engaged" is a
   *total* withdrawal from marking; "declining far-side men" is a strictly
   narrower change that leaves box threats (`:482`, `boxThreat` bypasses the
   gate) and near-side threats marked. The Phase-30 evidence therefore does not
   price the narrow version. ⚠ **INFERENCE, unmeasured**: a far-side refusal sits
   *somewhere* on the axis whose far end produced that collapse, so it shares the
   failure's direction and any A/B should carry the shots-conceded / league
   shot-volume metrics that detected it. That is a hypothesis about which
   instruments to bring, not a prediction of the outcome, and this map runs no
   probe to settle it.
2. **Two prior reverts live inside the stance block** (`actionExecutor.ts:234-256`):
   the 30.5 stance-floor (tight stances = snap dispossessions) and the 31.6
   distribution stand-off (glued markers = box wrestling at goal kicks), each
   re-tuned so that `markingAggression` keeps a payoff channel — the comment
   names this "failure mode 3", twice.
3. **`markingAggression` is triple-coupled.** It selects the *scheme* at a hard
   0.3 threshold ([`types.ts:89`](../../src/sim/types.ts#L89)), prices tackles and
   the stance, AND sets the yellow-card rate
   `0.16 + markingAggression*0.28` ([`Match.ts:2462`](../../src/sim/Match.ts#L2462)).
   A change that alters marking's payoff moves selection pressure on a gene that
   also moves cards and scheme identity — an equilibrium coupling, not a local
   one.
4. **`markBase` is evolved, not fixed** ([`policyGenome.ts:24`](../../src/evolution/policyGenome.ts#L24)).
   Any re-balance of mark-vs-shape scoring shifts the fitness gradient on a live
   policy gene whose low bound (0.31) already sits *below* the shape score
   (0.42–0.50) — i.e. the mark/shape ordering is already gene-flippable, and a
   fix could make one side of that flip unreachable.
5. **The greedy loop's order effects are global.** One threat per defender
   (`used`, `:485`, `:498`) plus depth-major iteration means a local change to one
   pair re-shuffles the remainder of the assignment deterministically — no probe
   should read a single pair's change as the whole effect.
6. **The eye path is not a marking path.** Only `TeamBrain.ts:499` writes
   `team.marks`; the eye changes the *target*, never the assignment
   (`stationEye.ts:340-343` + `actionExecutor.ts:1055-1062`). "The armed worlds
   fix marking" is therefore a statement about positions, not assignments — see
   the §2.4 AMBIGUOUS label.
7. **The churn instrument in this area is known-defective**
   (FARSIDE-DEFENDER-FORENSIC §8.4/§8.5 retraction: `switchKey` collapses the
   eye/mark/action causes; the heading-flip metric is near-vacuous). Any A/B on a
   mark-selection change needs a NEW instrument for oscillation; the banked one
   cannot attribute it.
8. **The contain branch is a second, hidden mark producer.**
   `PlayerBrain.ts:1331-1338` sets `markTarget = carrier.index` and emits
   `MarkOpponent` **without** any `team.marks` entry. Any code that reasons "mark
   ⇒ there is an entry in `team.marks`" is wrong for those ticks
   (`RenderStateAdapter.ts:296` draws no line for them).

---

## §6 WHAT THIS MAP DOES NOT DO

- It runs **no** probe: no new number here. Every level cited is either from the
  banked census artifact or a constant read out of code.
- It does not identify the receipt's scheme, threat ordering or mark identity
  (§2.3 AMBIGUOUS) — that needs a re-walk probe.
- It does not confirm the §2.4 positional-feedback channel — code-supported,
  unmeasured (labelled).
- It does not RANK the §2.2 release rows (finding 7): no probe counted which one
  fires in play, so no row is called dominant.
- It does not describe the legacy table path beyond the contrast in the branch
  disclosure (finding 6): every station claim is emergent-path-only, and the
  emergent path is the DEFAULT-ON one prod ran.
- It does not price a narrow far-side refusal against the Phase-30 collapse
  (finding 8): that evidence is about a zonal cut which never engaged at all.
- It proposes nothing. The fix scope, if any, is the commander's per #189.3.
