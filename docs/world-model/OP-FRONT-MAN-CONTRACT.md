# OP — THE FRONT-MAN CONTRACT (身前贴着的人要算进去 · the licence to pass sees the man in front of the ball)

> Bound by **commander ruling #432** (2026-10-12), consuming: the user's fork answer, VERBATIM **「甲吧」**
> (#431 item 3: 甲 「身前贴着的人要算进去」), and the three censuses of record — OP-C0 (#427: the sentence
> 「传到对面身上」 is the passer's, not his eyes'), OP-C1 (#429, its §COMMANDER CORRECTIONS), OP-C2 (#431: the
> licence skips the man in front). Arc prefix **OP**; slices OP-T0 (the dormant seam) → OP-T1 (the exam) →
> OP-ENTRY (world 19) → **exit = the user's eye gate**.

## §-1 WHAT THIS SLICE IS FOR

The user's sentence of record (the world-12 verdict, #382 item 4(vii)): **「传到对面身上」** — the only line of that
verdict carrying 「经常」. About one ground pass in three on world 18 meets an opponent first (OP-C0 §R1). OP-C2 found
the licence: a pass happens because the `Pass` candidate's `bestPass` wins, and `bestPass` is built by `groundCandidate`
from `laneOpenness` — which skips every opponent within 1.5 m of the kicker along the line (`perception.ts`: "Ignore
defenders standing right on top of the passer — the kick clears them.") and, under pressure, is multiplied UP
(`passOutletMul`, "pass is the pressure outlet"). The skip's assumption holds for men BEHIND the kicker (they touch
first 0.054087, W18-D) and fails for the man IN FRONT (0.220887; any opponent first 0.429225 vs 0.262927 with the
zone empty). This slice makes the licence's lane price see the man in front. ⛔ NO LINE IS BANNED, NO ACTION IS
FORCED: the price becomes true to the engine's contact law, and the argmax — pass, dribble, turn, hold — decides.

## §0 THE DIAGNOSIS CHAIN — the numbers of record (W18-D, x64, exact on this host)

| step | fact | source |
| --- | --- | --- |
| OP-C0 | `fb.ground.opponent` 0.311390; in the lane at release 0.542610 of those; the passer's read held the man on all but 0.014096 | OP-C0 §R1–§R3, §COMMANDER CORRECTIONS |
| OP-C1 | in-lane: snapshot chooser seated 0.809896; struck-through: `guardSkip` geometry 0.530706 | OP-C1 §R2–§R3 |
| OP-C2 | `guardSkip` balls: snapshot-seated 0.90804, man in its snapshot 0.997979, target price "open" 0.738629, closed late 0.049743 | OP-C2 §R1–§R3 |
| OP-C2 | the licence = `bestPass` ← `groundCandidate` ← `laneOpenness` with the 1.5 m skip | OP-C2 §COMMANDER CORRECTIONS 1 |
| OP-C2 | a man ahead in the zone at release on 17,054 / 80,724 ground releases; he is first body 0.220887; any opponent first 0.429225 (zone empty 0.262927); behind only 0.054087 | OP-C2 §R4 (`qd.zoneAhead.*`) |

## §1 CLAIMS

* **C1.** With the seat armed, a ground pass played with an opponent IN FRONT of the ball inside the kick's first
  1.5 m becomes rarer, and the share of those releases where that man is the first body falls.
* **C2.** `fb.ground.opponent` falls on the dosed world.
* **C3 (the cost, measured, not assumed away).** The passer pressed from the front chooses something else; whether
  that reads as 「传不出去球」 is measured by the 传不出去 faces (§3, OP-T1) and judged by the eye.

## §2 THE MECHANISM — M-OP.1–4 (OP-T0) — all dormant

* **M-OP.1 — THE SEAT: THE LICENCE'S LANE, ONLY.** The ONE `laneOpenness(p.pos, aim, opp.players)` call inside
  `groundCandidate` (`PlayerBrain.ts`, the DLC-hoisted ground pricer). Armed, it calls `laneOpennessFront` (M-OP.2)
  instead, with the same arguments; the playmaker's ×1.15 and the `min(1, …)` stay exactly as they are. Because the
  forward gate (`gain > 0.15 && lane < 0.4`) and the score both read this `lane`, both see the man. ⛔ No other caller
  changes: `ownLaneOpenness` (LN — own men), the through-ball / carry / support lanes (`PlayerBrain.ts` l.~954,
  ~1074, ~1239 at `41c3a17`), `airLaneOpenness`, the DV / GC exposure terms, and the snapshot target chooser
  (`choosePerceivedPassTarget`) are untouched.
* **M-OP.2 — THE FORM: ONE GUARD MADE TRUE, NOTHING INVENTED.** `laneOpennessFront(from, to, opponents)` in
  `perception.ts`, beside `laneOpenness`, is `laneOpenness` character for character EXCEPT the clear-the-kicker guard:
  * the guard SKIPS a man only when the kick truly passes him by — **his closest point on the segment IS the kicker**
    (`closestPointOnSegment`'s parameter clamps to 0, so `dist(cp, from) === 0`: he is level with or behind the
    ball's start; the degenerate segment keeps the shipped behaviour);
  * a man whose closest point lies strictly AHEAD of the kicker and within `1.5` m of him (the shipped guard radius)
    is READ, with the reach the engine gives a body over that stretch: `clamp01(d / CONTROL_RADIUS)` where `d` is his
    distance to the line — in the kick's first 1.5 m the ball is past him in about a tenth of a second, so he cannot
    close; what he has is the control reach the engine's own contact / control law grants (`constants.ts`
    `CONTROL_RADIUS`);
  * beyond 1.5 m along the line: unchanged (`clamp01(d / 4)`).
  NO NEW CONSTANT: 1.5 (the shipped guard), `CONTROL_RADIUS` (the engine's), 4 (the shipped normaliser). ⛔ No gene,
  no weight, no world constant.
* **M-OP.3 — BORN INCUMBENT-EQUIVALENT (#200), DORMANT, CONTAINED.** `match.opFrontMan` — new, additive, default
  `false`, in `Match.ts` (the cfg field + the readonly member, the `bkGroundCorridor` idiom) and the `League.ts` key
  union; NO world carries it at OP-T0. Absent ≡ false; worlds ≤ 18 byte-identical with the flag absent.
* **M-OP.4 — THE TARGET CHOOSER, A HELD DOOR.** The snapshot chooser picks WHO after the licence has said pass, with
  a reach-based price that read the front-man lane "open" on 0.738629 of the `guardSkip` balls. If the licence alone
  leaves the chooser re-seating INTO the front-man lane (OP-T1 measures it as a face), a slice on the chooser is
  named then — not now.

## §3 INSTRUMENTS AND THE ARC

* **OP-C0 / OP-C1 / OP-C2** (done, #427 / #429 / #431) — the censuses of record (§0).
* **OP-T0** (next — #432 item 3, the dispatch of record) — the seam and its permanent pin suite
  (`tests/opFrontMan.test.ts`): G-OFF byte-identical (bare · 13 · 17 · 18 on ≥ 12 scratch seeds; the fingerprint
  `59f42aa7…a072d` unchanged); ABSENT ≡ false; the seam map (flag occurrence counts per file); `laneOpennessFront`
  fixtures — ⭐ the three geometric cases first (a man behind the kicker: skipped, equal to `laneOpenness`; a man
  level with the kicker: skipped; a man 1 m ahead on the line: read, 0) plus the edge at 1.5 m and a man 1 m ahead
  and `CONTROL_RADIUS` aside (open 1); `laneOpennessFront ≡ laneOpenness` whenever no opponent's closest point lies
  in (from, 1.5 m]; ARMED — the licence's `lane` differs from HEAD only on releases with such a man; the mutant walk
  (M1 the guard kept as shipped · M2 the 4 m normaliser used inside 1.5 m · M3 the flag inverted · M4 the seat
  applied to `ownLaneOpenness` too — must die). Dormant. Ships nothing.
* **OP-T1** (after OP-T0's PASS) — the exam on world 18: `W18-D` (the user's play, THE CONTROL) vs `W18-D+OP`, and
  `W18-E` vs `W18-E+OP` beside. Faces: OP-C2's zone-ahead faces (share, first-body), `fb.ground.opponent`, the
  re-seat face (M-OP.4); ⭐ **THE 传不出去 FACES**: passes per possession, ground-pass attempts per possession, the
  pressed carrier's action mix (pass · dribble · hold · turn), dispossessions of the carrier, backward-pass share,
  possessions ending without a pass; the house band (F-DS-b, as IF-T1b walked it). THE READS are frozen at OP-T1's
  dispatch, before any seed.
* **OP-ENTRY** — world 19 = 18 + `opFrontMan`, the DS-ENTRY-2 rung form (one door, no gene, no constant; identity
  below 19 arch-keyed; the honest brief in the player's language) ⇒ **the user's eye gate 「身前贴着的人要算进去
  (v19) — keep | change | revert」**.

## §4 NON-CLAIMS

* The seat does not make the passer see better (perception is unchanged) and does not price his own men (LN does).
* `CONTROL_RADIUS` inside 1.5 m and 4 m beyond leaves a step at 1.5 m along the line; a continuous form is a NAMED
  DOOR, not taken here.
* The snapshot target chooser is not changed (M-OP.4).
* Nothing here says the pass-or-keep balance is now "right" — the eye says that.

## §6 VISION audit record (the #91 form)

* **Emergence (EMERGENCE-PIVOT).** No tactic is coded: no "don't pass when pressed" rule, no new action, no weight.
  A price is made true to the engine's own contact law; what the pressed passer does instead emerges from the same
  argmax. PASS.
* **#200 incumbent-equivalence.** Dormant flag, default false, no world at T0; worlds ≤ 18 byte-identical. PASS.
* **No new number.** 1.5, `CONTROL_RADIUS`, 4 are all shipped. The "closest point is the kicker" test is the shipped
  clamp's own output, not a new sign test on the flight. PASS.
* **The user's words.** 「甲吧」 answering 「身前贴着的人要算进去」 — the seat is exactly that sentence and no wider
  (the licence only; behind-the-kicker men stay skipped, where the skip measured right). PASS.

## §7 REALITY audit record (the #201 standing rule)

* A defender squared up in front of the ball blocks or intercepts passes played through his legs; real passers,
  pressed from the front, play around him, turn, shield, or recycle. A defender behind or beside the passer is
  cleared by the kick. The two cases the form separates are the two the football separates. PASS.
* The engine agrees: OP-C2 measured the man in front as first body 0.220887 and the man behind 0.054087. PASS.
* Risk named: if the passer, unable to pass forward under a front press, keeps the ball into the press, the
  dispossession face rises — OP-T1 measures it; the eye judges it. OPEN (measured at T1).

## STATUS

* 2026-10-12 — BOUND at #432 (the user's 「甲吧」). OP-T0 DISPATCHED (#432 item 3).
* 2026-10-12 — #433: OP-T0 BANKED (`f850404`, verifier PASS, five LOW; `OP-T0-FRONT-MAN-SEAM.md` §COMMANDER
  CORRECTIONS). OP-T1 DISPATCHED with its reads FROZEN at #433 item 3 (block 12,564,000–999).
