# LN — THE OWN-LANE CONTRACT（让传球者看见自己人）

> **Created by LN-T0, authorized by COMMANDER RULING #393 item 5(v).** Binding stage doc:
> [`LN-T0-OWN-LANE-PRICE.md`](LN-T0-OWN-LANE-PRICE.md). Exam to come: **LN-T1′** (#393 item 6).
>
> **Position.** [`VISION.md`](../VISION.md) is the gold standard; this contract governs ONE
> mechanism — *what the passer's pricers know about his own men* — and nothing else. It creates
> no authority over the restart's shape, over the receiver's first touch (BQ/BK), or over the
> opponent side of the corridor (its own census, later).

## §0 THE DIAGNOSIS CHAIN — five stages, one mechanism

**THE USER'S VERDICT, verbatim (2026, world 12 play-test):**

```text
12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上
```

**THE THIRD SENTENCE — 「传到人身上弹回」 — is this contract's subject.** BN-C0 split it into
the receiver's bobble (world 13's cushion answers that half) and the LANE CAROM: the ball hits
somebody before it gets there. Five stages then took the lane carom apart, and every number
below is QUOTED BY FIELD NAME from the stage's own committed artifact/doc.

| stage | the load-bearing field | value | what it established |
|---|---|---|---|
| **LN-C0** | `lane.passesWithOccupantShare` (E13) | **0.328098** | one measured ground pass in three is struck with one of OUR OWN bodies already standing in its four-metre corridor; `lane.occupantsPerPass` **0.390020** |
| **LN-C0** | `reads.lane.E13.majorityClass` | **`mixed`** | no single cause owns the occupancy — the coach's licence (`composition.L1` 0.375270) and the support seat (`composition.L2` 0.368062) lead, and no class is a majority |
| **LN-T1** | `firstBody.ownNonTarget` (ABSENT arm) | **0.102758** | the ruler; and `reads.universals.noDosedCornerHasR2Down` = **true** — ⛔ the off-ball eyes thinned the CROWD (`crowd.crashShare` Δ **−0.012779** on MARKER-ESCAPE) and moved the CAROM not at all |
| **LN-C1** | `read.established.cBlockedShare` | **0.682965** | the lane the passer CHOSE was already blocked by one of ours at the moment he chose it |
| **LN-C1** | `read.established.aShare` | **0.951501** | and there was almost always another line available that our own men did not block |
| **LN-C1** | `carom.established.presence.presentAtChoice` | **0.641956** | the man he hit was already standing in the corridor when he decided — he did not run into it |
| **LN-C2** | `read.established.sShare` | **0.678909** | of the caroms the pricing ledger DOES trace, the perceived chooser is the path |
| **LN-C2** | `shell.established.legacy.firedShare` | **0.014374** | the lane argmax's binary shell almost never fires on the LEGACY path — the one place the engine *does* see our own bodies is essentially silent |
| **LN-C2** | `path.established.untraced.caromShareOfCaroms` | **0.527230** | ⛔ and more than half the caroms are not in that ledger at all |
| **LN-C3** | `family.<F>.caromShareOfAllCaroms` (KICKOFF-PLAYBACK) | **0.403488** | the untraced half has ONE owner: the kick-off tap-back |
| **LN-C3** | `family.<F>.passShare` / `family.<F>.caromRate` (KICKOFF-PLAYBACK) | **0.068456** / **0.594178** | a small family of passes with a huge carom rate |
| **LN-C3** | `openFam.<F>.ownOpennessMean` (KICKOFF-PLAYBACK) | **0.413493** | the restart's own shape packs the team behind the ball (every other family's `openFam.<F>.ownOpennessMean` lies between 0.767597 and 0.900429 over the six FAMILY rows — the aggregate rows UNTRACED-ALL 0.709278 · ALL 0.802432 · TRACED-ALL 0.840960 are outside that scope) |
| **LN-C3** | `familyReads.cells.E13.k` | **3** | three pricers hold 0.960465 of all caroms: `kickoffPlaybackScorer` → `choosePerceivedPassTarget` → `groundCandidate` |
| **LN-C3** | `unpricedFamilyHoldsMajorityOfItsCaroms` (KICKOFF-PLAYBACK) | **TRUE** (the share behind it is a different face: `shellFam.KICKOFF-PLAYBACK.firedShareOnCaroms` **0.942363**) | and the top family's pricer never reads a line at all |

**THE PRICERS AS CODE FACTS (LN-C3 §R2).** The kick-off play-back scorer IS a scorer —
`opennessOf(mate, opp.players) − |d − 12| · 0.02 − (GK ? 0.3 : 0)` — whose
`readsCorridorForOpponents` is **FALSE** and whose `readsOwnBodiesNotAtAll` is **TRUE**. Four
of the five hashed pricers read the corridor for OPPONENTS. Only `groundCandidate` sees our own
bodies at all, and only through a binary shell.

⇒ **ONE SENTENCE: THE PASSER'S PRICERS DO NOT SEE HIS OWN MEN.** LN-T0 is the seam that makes
them see, graded, at exactly the three places K names.

## §1 THE CLAIMS

1. **CLAIMED — a capacity, behind a shut door.** There exists in `src/**` a graded own-lane
   read, callable at the lane argmax, at the kick-off play-back scorer and at the perceived
   chooser, whose geometry is the SHIPPED `laneOpenness` over LN-C1's own reconstruction
   population (own outfield bodies − passer − target), whose strength is a born-absent gene,
   and whose door is default OFF.
2. **CLAIMED — dormancy is measured, not asserted.** With the flag off the world is
   byte-identical to HEAD; with the flag ON and the gene ABSENT it is byte-identical again,
   even though the scope statement, both subtractions and the perceived factor all execute.
   Both are pinned on twelve seeds in the bare world and in world 13's composition.
3. **CLAIMED — the seam is alive.** At `w = 1` the world moves, each site moves by exactly the
   priced quantity on its own fixture, and the kick-off scorer changes its man.
4. **NOT CLAIMED — that any football face improves.** Whether `firstBody.ownNonTarget` falls,
   by family, and what it costs in backward passes, completion, interceptions, goals, shots and
   offsides, is **LN-T1′** (#393 item 6). This stage reports ZERO football effect sizes.
5. **NOT CLAIMED — that the kick-off family has an admissible alternative.** LN-C3 HONEST
   LIMITS 1–2 raised the possibility that at the restart there is no clear man to play; that is
   the LABELLED HYPOTHESIS **H-LN-2**, and the exam is its probe.

## §2 MECHANISM — M-LN.1, M-LN.2, M-LN.3 as built

### M-LN.1 — THE OWN-LANE READ (`src/ai/ownLaneSeat.ts`)

```ts
export function ownLaneOpenness(
  from: Readonly<V2>, aim: Readonly<V2>, ownBodies: readonly OwnLaneBody[],
  passerGid: number, targetGid: number,
): number {
  const kept: OwnLaneBody[] = [];
  for (const body of ownBodies) {
    if (body.gid === passerGid || body.gid === targetGid) continue;
    if (body.sentOff === true) continue;
    if (body.role === 'GK') continue;
    kept.push(body);
  }
  return laneOpenness(from, aim, kept as unknown as Player[]);
}
```

⭐ **THE SHIPPED GEOMETRY IS CALLED, NOT RESTATED** — the closest-point-on-segment law, the
1.5 m clear-the-kicker guard and the 4 m normaliser are `laneOpenness`'s own, and the module
contains none of them (a pin reads the module's code with its comments stripped and requires
that). **NO NEW PERCEPTION CHANNEL** (M-GC.3's precedent): the function reads only the
positions it is handed, and names no `Match`, no store, no rng.

⚠ **THE POPULATION TYPE IS STRUCTURAL** because the perceived chooser's bodies are perception
snapshot entries (`ObservedPlayer`), not `Player`s. `OwnLaneBody` requires `gid` and `pos` —
the only fields the geometry consumes — and treats `sentOff` and `role` as OPTIONAL identity
fields read by the FILTER alone. A snapshot entry carries neither, which is why the perceived
call site hands in a body set that is already own-outfield-and-not-sent-off. The pin
`ownLaneOpenness === laneOpenness(from, aim, <the filtered Players>)` is what makes the two
populations one law instead of two drifting copies.

### M-LN.2 — THE PRICE

```ts
export function ownLanePrice(w: number, openness: number): number {
  return w * (1 - openness);
}
```

with `w = lnOwnLaneWeightOf(g)` — the `dvExposureWeightOf` / `raAccessWeightOf` idiom: `clamp01`
with the undefined/non-finite guard, so ABSENT and BROKEN both read `0`. The gene
`lnOwnLaneWeight?: number` is **BORN ABSENT** and is **NOT in `GENE_KEYS`**, so `randomGenome`
/ `mutateGenome` / `crossoverGenomes` / `geneDistance` draw the same rng in the same order as
HEAD and `JSON.stringify` omits the key. ⛔ **NO `evolve*` OPT-IN EXISTS FOR IT YET** —
evolution's opt-in is a LATER SLICE; today it gains a value only from an instrument's effective
genome. The door is the MatchConfig flag `lnOwnLanePrice?: boolean` — an explicit boolean,
`?? false`, a readonly field, never env-armed, never bundle-defaulted, absent from `a4World.ts`
and from every preset.

### M-LN.3 — THE THREE SITES, AND ONLY THESE

ONE seat, ONE flag read, hoisted above the kick-off branch because that branch RETURNS before
the ladder ever runs:

```ts
  const lnSeat = match.lnOwnLanePrice ? { w: lnOwnLaneWeightOf(g) } : null;
```

**(a) THE LANE ARGMAX** — inside the hoisted `groundCandidate`, after the ground-corridor shell
and before the receiver-access term:

```ts
      const sLn = lnSeat === null ? sGc
        : sGc - ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, aim, team.players, p.gid, mate.gid));
      const sRa = raSeat === null ? sLn
        : sLn - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;
```

The binary shell STAYS as it is; the graded term complements it. Because the pricer is hoisted,
this covers to-feet, led, strike-plane, the knock and the keeper's ground passes at once.

**(b) THE KICK-OFF PLAY-BACK SCORER** — one statement inside its own loop; the shipped
expression above it is unchanged character for character (`const` became `let`):

```ts
      let s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);
      if (lnSeat !== null) {
        s -= ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, mate.pos, team.players, p.gid, mate.gid));
      }
```

**(c) THE PERCEIVED CHOOSER** — the scope, then the price:

```ts
    const lnOwnGids = lnSeat === null ? null : ownLaneScopeGids(p.gid, team.players);
    if (lnOwnGids !== null) for (const gid of lnOwnGids) scope.add(gid);
```

```ts
        return 1 - ownLanePrice(lnSeat.w, ownLaneOpenness(
          seenPasser.pos, seenTarget.pos, lnOwnPerceived, p.gid, targetGid,
        ));
```

handed to `choosePerceivedPassTarget` as an optional `ownLaneFactor`, which multiplies every
EXECUTABLE option's `price` before the reduce:

```ts
  const priced = input.ownLaneFactor === undefined ? options
    : options.map((option) => (option.executable
      ? { ...option, price: option.price * input.ownLaneFactor!(option.targetGid) }
      : option));
```

⭐ **WHY THE HOOK AND NOT A RE-RANK IN `PlayerBrain`.** Re-ranking outside the chooser would
require a SECOND copy of the argmax and its tie rule, and a second copy of a decision law is
exactly the thing that drifts. The hook keeps ONE argmax. Consequence, stated: the returned
`options` — and therefore `passChoiceTrace`'s stored `options[].price` and the winner's `price`
— record the PRICED value; and `blindOutpricesRead` / `blindOutpricesBand` then compare a PRICED best against an UNPRICED blind option and an UNPRICED band — an ASYMMETRIC comparison when armed, drifting toward `true` (behaviourally inert: no decision reads them; LN-T0 §COMMANDER CORRECTIONS item 1; LN-T1′ reads no look-pressure off armed arms). Hook absent ⇒ `priced` IS `options`, the same array object.

⛔ **NO PREDICATE, NO THRESHOLD, NO BAN** (#200 / #328): the argmax still decides everywhere.
⛔ **NO OTHER SITE**: the through-ball scorer, the cutback scorer and `TeamBrain` are untouched
— LN-C3's `familyReads.cells.E13.k` is **3**, and those two families hold
`family.THROUGH-BALL.caromShareOfAllCaroms` **0.026744** and
`family.CUTBACK.caromShareOfAllCaroms` **0.012791** between them.

## §3 INSTRUMENTS & THE ARC

* **LN-C0** (who stands in the lane) → **LN-T1** (the off-ball eyes thin the crowd, not the
  carom) → **LN-C1** (the chosen lane already blocked by ours) → **LN-C2** (which chooser; the
  shell obeyed and bypassed) → **LN-C3** (which family; the kick-off). The censuses END there,
  as #392 item 4(ii) promised.
* **LN-T0 (this stage)** — the seam and its permanent pin suite `tests/lnOwnLane.test.ts`.
  ZERO sims of record; every walk in the out-of-band scratch band.
* **LN-T1′ — THE EXAM (#393 item 6), the form of record.** Arms on world 13's composition:
  **ABSENT** · **ARMED-ZERO** (flag on, gene absent — FLAG-HYGIENE) · **w ∈ {0.25, 0.5, 1.0}**
  (the shell's own 0.5 as the reference dose). **PRIMARY** the user's face
  `firstBody.ownNonTarget` **DOWN resolved**, published **BY FAMILY** with LN-C3's family rule
  INHERITED (KICKOFF-PLAYBACK · SUBSTITUTED · LEGACY · the rest), and the kick-off row read for
  **H-LN-2**. **GUARDS** in OBM-T1's tolerance form: the **BACKWARD-PASS share FIRST**
  (LN-C1's warning — `menu.established.bestAlternativeGain.backward` **0.570033**: the clear alternative points backward more often than not) · `passCompletion`
  · interceptions · goals and shots in both directions · offsides in the FLAG form · 撞车
  beside. **READS** naming LN-ENTRY (world 14 = world 13 + the door at the dose that moves the
  face with no breach) · the restart SHAPE (if the kick-off row is unmoved, H-LN-2 stands and
  the shape is the lever, a geometry question for after) · or STOP.

### STATUS

* **#396 (2026-09-05) — LN-T1′b OF RECORD, GREEN; LN-ENTRY NAMED at w = 0.25.** LN-T1′ (RED on an
  inherited receipt conjunct; the table read at #395) and LN-T1′b (all 26 gates green, a fresh block)
  agree: `firstBody.ownNonTarget` falls at every dose (LN-T1′b: 0.102798 → 0.058788 / 0.050337 /
  0.039949; the played form 0.089528 → 0.040022 at 0.5), no guard breaches, the backward-pass share
  unresolved at every dose, completion UP resolved and interceptions DOWN resolved at every E13 dose,
  the kick-off tap-back 0.575499 → 0.189112 / 0.096154 / 0.083333 (H-LN-2 refuted at 0.25), the
  unpriced families unmoved in resolution, passes per match 74.579710 → 71.246377 at 0.25 (the cost
  face). The frozen literal READ 1 selected on both runs; the smallest qualifying dose 0.25. LN-ENTRY
  (world 14 = world 13 + `lnOwnLanePrice`, `lnOwnLaneWeight` pinned 0.25) dispatched at #396 item 4.
  The user's world-13 verdict, VERBATIM: 「缓冲留球 (v13) — keep — 仍然有砸队友身上反弹的情况出现」 — the
  second half of that sentence is this seam's face.

## §4 NON-CLAIMS

* ⚠⚠ **THE CURRENCY MIX IS A DECLARED APPROXIMATION.** At the perceived chooser a SCORE-UNIT
  weight multiplies a MEASURED PROBABILITY (`price` is a reception or attempt-value prior out
  of `passPrior.ts`'s committed census data). `1 − w · (1 − ownLane)` is a dimensionless
  discount applied to a probability, and the seam does NOT claim it is a probability itself.
  It is the smallest form that (i) leaves the argmax the decider, (ii) is exactly the identity
  at `w = 0`, and (iii) uses the same `w` as the two score sites so one gene means one thing.
  A currency-correct form (an own-body term inside the corridor read) is a LATER DOOR.
* ⚠ **THE ARMED TRACE'S LOOK-PRESSURE BOOLEANS ARE ASYMMETRIC.** With the hook live,
  `choosePerceivedPassTarget` computes `blindOutpricesRead` / `blindOutpricesBand` from a PRICED
  best against an UNPRICED blind option and an UNPRICED band (unexecutable options and the band
  are not multiplied), so both drift toward `true` under a dose. No decision reads them (their
  only consumers are the `passChoiceTrace` sidecar and its type); flag-OFF byte-identity is
  unaffected. LN-T1′ must not read look-pressure off armed arms (ruling #394 item 3).
* ⚠ **THE SHELL AND THE GRADED TERM BOTH CHARGE NEAR THE LINE.** `groundCandidate` keeps
  `groundShellHazard`'s binary 0.635 m shell AND adds this graded read, so a body inside the
  shell is priced twice when both doors are armed. Accepted at T0 — LN-C2 measured
  `shell.established.legacy.firedShare` at **0.014374**, so the overlap is rare, and REMOVING the shell
  would be a change to a banked seam this stage has no authority over.
* ⚠ **THE RESTART SHAPE IS UNTOUCHED.** The seam prices the kick-off taker's CHOICE; it does
  not move a single body's kick-off position. If the tap-back's carom does not fall under a
  price, the shape is the lever (H-LN-2) — and that is the exam's question, not this stage's.
* ⚠ **THE THROUGH BALL'S PROJECTED AIM IS NOT THIS SEAM'S.** The through-ball scorer prices a
  point ahead of a runner on its own lead arithmetic and is out of K.
* ⚠ **NO OUTCOME AXIS.** The read is geometry at the moment of choice. It does not know whether
  the ball would actually have been intercepted, deflected or received.
* ⚠ **THIS IS A PRICE, NOT A TACTIC.** Nothing here tells anybody where to stand, whom to pass
  to, or when to release. It makes one line cost more than another and lets the existing argmax
  answer.
* ⚠ **EVOLUTION HAS NOT OPTED IN.** `lnOwnLaneWeight` has no `evolve*` boolean yet, so no
  population can search it until a later slice grants one.

## §6 VISION AUDIT (the #91 form)

* vs §-1 (tactics emerge): the seam adds a PRICE on existing geometry, not a behaviour rule.
  Nobody is told to look for a teammate; the score of a blocked line falls and the SAME argmax
  decides. 「回敲给旁边那个没人挡的」 should EMERGE where it is worth more, and not where it is
  not. **PASS.**
* vs 眼睛看到的空间: a passer who cannot see his own men is half-blind. LN-C1 measured the
  blindness (`read.established.cBlockedShare` **0.682965**) and LN-C2 measured how narrow the
  one existing window is (`shell.established.legacy.firedShare` **0.014374**). This opens the eye; it
  does not paint what the eye sees. **PASS.**
* vs #200 / #328 (no taste constants, no bans): every constant in the read is the shipped
  `laneOpenness`'s own (the 1.5 m guard, the 4 m normaliser); the only new number is a GENE,
  born absent, that selection may search once a later slice opens it. No predicate, no
  threshold, no forbidden line. **PASS.**
* vs 底座给能力: the read is world geometry over bodies that exist; the CARE is per-team and
  per-genome. Substrate below, taste above. **PASS.**
* vs the assembly law: the seam composes with the banked shell, the corridor price and the
  receiver-access term at the ONE hoisted pricer, and adds no second scoring path. **PASS.**

## §7 REALITY AUDIT (the #201 rule)

* Real football: a passer looks for his own men FIRST — the question "is one of mine in the
  way" is asked before "is one of theirs". The engine asked the second and, apart from a
  0.635 m shell, never the first. **PASS.**
* Real football: **开球回敲从来不会撞在自己人身上.** The tap-back is the one pass in the game
  that never hits a teammate, because the taker can see the whole picture and the ball travels
  a short, chosen line. LN-C3 measured this engine's tap-back at
  `family.KICKOFF-PLAYBACK.caromRate` **0.594178**. That is not a football, and the scorer that
  produced it reads no line at all. **PASS.**
* Real football: a body a stride off the line is not the same as a body ON it — a passer plays
  past a man who is nearly clear and does not play through one who is planted. A GRADED read is
  how that is seen; a binary shell is not. **PASS.**
* Honest limits, stated: the restart's SHAPE (everybody packed behind the ball,
  `openFam.<F>.ownOpennessMean` **0.413493** for KICKOFF-PLAYBACK) may leave the taker with no
  admissible alternative — real players face that too, and answer it by MOVING, which this seam
  cannot do. **H-LN-2**, with LN-T1′ as its probe. **PASS.**
