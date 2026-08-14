# R-甲 — THE EVENT-VOCABULARY CENSUS (instrument-only)

> Dispatched by ruling #271.2 under
> [`RULER-COVERAGE-CONTRACT.md`](RULER-COVERAGE-CONTRACT.md) §1 R-甲.
> Blind spot addressed: **§0.1 ABSENCE** — the eyes cannot see what does not
> exist.
>
> ⭐⭐ **THE FREEZE ORDER IS THE INSTRUMENT.** §1 below (the vocabulary) is
> drafted FROM THE SPORT — from football knowledge and public event/coaching
> taxonomies — **before one line of engine code was read this round**. A
> vocabulary drafted while reading the engine shapes itself around what
> exists; that is the list-shaped blind spot this instrument is built to
> escape. This document lands in TWO commits and the git history is the
> attestation (#266.3(c)):
>
> * **COMMIT 1 (this one) = THE FREEZE.** §-1 … §1 complete; §2/§3 present
>   but EMPTY, explicitly marked NOT YET WRITTEN.
> * **COMMIT 2 = THE RESULTS.** §2 (classification) + §3 (the absence map),
>   written only after the engine was read.
>
> No `src/**` byte is touched by this round (hard property).

## §-1 THE REFERENCE THE CENSUS SERVES

The aesthetic criterion of [`../VISION.md`](../VISION.md): **配合 · 技巧 ·
博弈 · 对抗 · 战术** — 涌现的, 看得出来的, 不是手写的. A vocabulary entry
matters to this census in proportion to how load-bearing it is for those five
words. §3 ranks the absences on exactly that axis, in plain football language.

## §0 METHOD

1. **Grain.** One entry = one thing a football watcher would name as a
   distinct action or event. Deliberately NOT the grain of a physics
   primitive (no "apply force to ball") and NOT the grain of a whole
   possession (no "build-up phase"). Where a family has football-meaningful
   sub-types that behave differently (passes by height, tackles by form,
   saves by form), the sub-types are separate entries, because the census's
   whole point is that a family can be PRESENT while every interesting
   sub-type inside it is ABSENT.
2. **Freeze then classify.** §1 frozen (commit 1) → engine read in full →
   §2 classified (commit 2).
3. **Three verdicts, evidence-bearing** (§2 legend):
   * **PRESENT** — a mechanism exists; evidence = code trace (`file:line`)
     and, where cheap, a measured occurrence from an evidence walk.
   * **DEGENERATE** — the name exists but the thing is structurally hollow:
     the mechanism cannot express the football distinction the entry names.
     A DEGENERATE verdict must say **exactly how** it is hollow.
   * **ABSENT** — no mechanism. An ABSENT verdict must say **what was
     searched** (grep terms, files read), because "I did not find it" is not
     "it is not there" until the search is stated.
4. **Completeness is versioned, not claimed.** Per contract §4, a missing
   row indicts THIS VERSION of the vocabulary, not the instrument. Amendable
   by ruling only.
5. **Not a gate.** Per contract §4 no absence is a gate and nothing here
   recommends what to build — the absence map is raw material for the ruling
   chain.

### §0.1 EXTERNAL TAXONOMIES CONSULTED (completeness checks only)

Consulted AFTER the first-pass draft from football knowledge, purely to catch
families a solo draft forgets. No engine content is in any of these.

* StatsBomb open-data event schema — event-type list (Pass, Shot, Dribble,
  Carry, Duel, 50/50, Ball Receipt, Miscontrol, Clearance, Interception,
  Block, Pressure, Dribbled Past, Goalkeeper, Foul Committed/Won, Bad
  Behaviour, Substitution, Injury Stoppage).
  <https://github.com/imrankhan17/statsbomb-parser/blob/master/statsbomb/events.yaml>
* Wyscout data glossary — duel taxonomy (offensive / defensive / aerial /
  loose-ball / pressing duel), pass sub-types (cross, head pass, hand pass,
  long, progressive, deep completion), foul sub-types, transition / loss /
  recovery / counterpressing recovery / acceleration, off-the-ball movement,
  covering teammate, defensive positioning.
  <https://dataglossary.wyscout.com/duel/> ·
  <https://dataglossary.wyscout.com/loose_ball_duel/> ·
  <https://dataglossary.wyscout.com/transition/>
* IFAB Laws of the Game — Law 8 (start/restart), Law 9 (ball in/out of
  play), Law 11 (offside), Law 12 (fouls and misconduct), Laws 13–17 (free
  kick, penalty kick, throw-in, goal kick, corner kick), dropped ball.
  <https://www.theifab.com/laws/latest/the-start-and-restart-of-play/> ·
  <https://www.theifab.com/laws/latest/fouls-and-misconduct/>
* Coaching run-type taxonomies (overlap / underlap / third-man /
  blindside / decoy / run in behind / pulling into the half-space).
  <https://coachingamericansoccer.com/tactics-and-teamwork/advanced-attacking-runs/> ·
  <https://learning.coachesvoice.com/cv/glossary-football-tactics-coaching/>
* Goalkeeping action taxonomy (catch / parry / tip / punch / block / smother
  / sweeping / cross claim / distribution).
  <https://learn.englandfootball.com/articles-and-resources/coaching/resources/2023/Different-saving-actions-for-goalkeepers> ·
  <https://guidetofootball.com/tactics/goalkeeper-roles/>

### §0.2 THE WORKED EXAMPLE NAMED IN ADVANCE

Ruling #271's dispatch names **CB-C0's frontal-by-construction duel** as the
worked example of a DEGENERATE verdict: a dispossession mechanism can exist
and fire, and still be hollow if the geometry of the contest is fixed by
construction rather than by where the two bodies actually are. Whichever
entry that mechanism lands on in §2 carries the worked-example annotation.

### §0.3 HYGIENE

* **Seeds**: this round may consume **12,476,000–12,476,999 only**, for
  evidence walks; every seed touched is recorded in §4 (booked = walked).
* **Stats**: expected **0** — this is a reading round; if a walk is run, it
  is an occurrence check, not a statistical claim.
* **Gates**: this round produces a census, not a battery. Its receipts are
  simple assertions (src untouched; freeze commit precedes results commit),
  stated as such — no gate battery is claimed, and #268.3(a)
  machine-liveness therefore has no conjunct set to derive.

---

## §1 THE VOCABULARY (FROZEN — commit 1)

**146 entries** (counted mechanically, not asserted:
`grep -cE '^\| [A-L][0-9]+ \|'` over this file = 146, no duplicate IDs),
organized by phase of play in 12 groups. Each = one line of football
definition, no engine reference of any kind. The dispatch asked for ~60–120 at
a sensible grain; the draft came in at 146 because sub-types were kept
separate wherever they behave differently in football (pass height, tackle
form, save form) — that separation is the instrument's whole point, so the
over-run is deliberate and declared rather than trimmed to hit a number.

### §1.A ON-BALL ATTACKING — carrying and beating a man (14)

| ID | Entry | Football definition |
|---|---|---|
| A1 | Carry / drive | Moving the ball forward under control over ground, no opponent being beaten. |
| A2 | Close dribble in traffic | Short-touch control at speed with opponents inside a metre or two. |
| A3 | Knock-and-run past a man | Pushing the ball into space beyond a defender and winning the foot race to it. |
| A4 | Change of direction to beat a man | Beating an opponent by cutting across his standing foot / away from his momentum. |
| A5 | Feint / body swerve (no touch) | Selling a direction with the body while the ball stays still, then going the other way. |
| A6 | Stepover / scissor family | A foot passed over or around the ball to freeze the defender before the real touch. |
| A7 | Drag-back / stop-and-turn | Pulling the ball backwards out of a committed defender's tackle line. |
| A8 | Nutmeg / through-the-legs | Playing the ball between a defender's legs and collecting it beyond him. |
| A9 | Roulette / spin turn | Turning through 360° over the ball to escape pressure from behind. |
| A10 | Shielding / holding the ball up | Keeping the body between opponent and ball to retain possession with no forward gain. |
| A11 | Take-on from a standing start | Attacking a set defender from stationary, no run-up. |
| A12 | Running at a retreating defender | Carrying into a defender who is backpedalling rather than set. |
| A13 | Acceleration burst with the ball | A step change of pace with the ball to break a pressing player's grip. |
| A14 | Beaten-past outcome (dribbled past) | The event, from the defender's side, of being taken on and left behind. |

### §1.B ON-BALL ATTACKING — passing and delivery (20)

| ID | Entry | Football definition |
|---|---|---|
| B1 | Short ground pass | A firm pass along the floor to a nearby teammate. |
| B2 | Long ground pass | A driven floor pass over distance, e.g. switching play. |
| B3 | Lofted / chipped pass | A pass lifted over an opponent or an opponent's leg. |
| B4 | Driven low pass into feet | A hard, flat pass a receiver must control rather than run onto. |
| B5 | Through-ball into space | A pass played into the space behind or between defenders for a runner. |
| B6 | Reverse pass / against the grain | A pass played opposite to the direction of body shape and momentum. |
| B7 | Disguised / no-look pass | A pass whose direction is hidden from the defender until struck. |
| B8 | Pass into the space a runner will arrive in (lead pass) | Weighted for where the teammate will be, not where he is. |
| B9 | Layoff / set (wall pass first half) | A one-touch return to a supporting player who arrives behind you. |
| B10 | One-two / wall pass (the pair) | Give, move, receive back beyond the beaten defender — the two-man combination. |
| B11 | Third-man combination | A pass to B that releases C, who was never the first option. |
| B12 | Back pass / recycle | A pass backwards to reset the attack. |
| B13 | Switch of play | Moving the ball across the pitch to the weak side. |
| B14 | Cross from wide, high | An aerial delivery into the box from a wide area. |
| B15 | Cross from wide, low / cut-back | A driven or pulled-back low delivery across the face of goal. |
| B16 | Early ball into the half-space | A delivery released before reaching the byline, into the inside channel. |
| B17 | Head pass / aerial redirect to teammate | Deliberately heading the ball to a teammate. |
| B18 | Clipped pass over the top | A lifted ball over a defensive line for a runner in behind. |
| B19 | Pass under pressure with a defender committed | Releasing the ball with an opponent already in the tackle. |
| B20 | Misplaced pass / turnover by pass | The pass fails and possession changes — the failure event as its own type. |

### §1.C ON-BALL ATTACKING — finishing (11)

| ID | Entry | Football definition |
|---|---|---|
| C1 | Shot with the laces (driven) | A struck shot for power. |
| C2 | Placed side-foot finish | An accurate, low-power finish into a corner. |
| C3 | Curled / bent shot | A shot spun around the keeper or a body. |
| C4 | Chip / lob over the keeper | Lifting the ball over an advanced goalkeeper. |
| C5 | First-time finish (no touch to settle) | Striking the ball as it arrives, without controlling. |
| C6 | Volley | Striking the ball out of the air before it lands. |
| C7 | Header at goal | An attempt on goal with the head. |
| C8 | Tap-in / close-range finish | Finishing from inside a few metres of the goal. |
| C9 | Shot from distance | An attempt from well outside the box. |
| C10 | Rebound / second-phase finish | Scoring from a save, block or loose ball in the area. |
| C11 | Deliberate shot fake | Winding up to shoot in order to move a defender or keeper, then not shooting. |

### §1.D RECEIVING AND FIRST CONTACT (7)

| ID | Entry | Football definition |
|---|---|---|
| D1 | Clean first touch into space | Receiving and killing the ball into a usable position. |
| D2 | Directional first touch away from pressure | The first touch chosen to escape a nearby defender. |
| D3 | Receiving on the half-turn | Body opened on receipt so the next action can go forward. |
| D4 | Receiving with back to goal under contact | Taking the ball with an opponent leaning on you. |
| D5 | Chest / thigh / head control of an aerial ball | Settling a ball out of the air with a non-foot surface. |
| D6 | Miscontrol / heavy touch | The first touch fails and the ball escapes control. |
| D7 | Letting the ball run / dummy | Deliberately not touching a pass so it runs to a better place or player. |

### §1.E OFF-BALL ATTACKING (15)

| ID | Entry | Football definition |
|---|---|---|
| E1 | Run in behind the defensive line | A forward run past the last defender into the space beyond. |
| E2 | Overlapping run | A forward run outside the teammate in possession. |
| E3 | Underlapping run | A forward run inside the teammate in possession. |
| E4 | Third-man run | A run to receive from a combination between two other players. |
| E5 | Blindside run | A run made out of the marking defender's line of sight. |
| E6 | Decoy run (drawing a marker away) | A run whose value is the defender it takes with it, not the ball. |
| E7 | Checking to the ball (come short) | Moving towards the passer to receive in front of the marker. |
| E8 | Check away then come back (double movement) | Two-step movement to break a marker's timing. |
| E9 | Pulling wide to stretch the pitch | Moving into width to widen the opponent's shape. |
| E10 | Dropping into the pocket / half-space | Occupying the space between opponent lines. |
| E11 | Pinning a defender | Standing where a defender cannot leave you, freezing him. |
| E12 | Making the far-post arrival | Timing a run to the back post for a delivery. |
| E13 | Support behind the ball (offering the safe pass) | Positioning so the ball-carrier always has a backwards option. |
| E14 | Rest-position while the ball is elsewhere | Where a player stands when nothing is asked of him yet. |
| E15 | Second-ball / rebound anticipation | Positioning for where a duel or block will spit the ball out. |

### §1.F DEFENDING — individual, on the ball-carrier (13)

| ID | Entry | Football definition |
|---|---|---|
| F1 | Standing / block tackle | Taking the ball with the foot from a set stance, front-on. |
| F2 | Sliding tackle | Going to ground to reach the ball. |
| F3 | Poke / toe tackle | Stabbing at the ball without committing the body. |
| F4 | Tackle from the side | Winning the ball from an opponent's flank. |
| F5 | Tackle / challenge from behind | Reaching or nicking the ball from behind the carrier. |
| F6 | Jockeying / delaying | Staying on the front foot at distance, refusing to commit, showing him one way. |
| F7 | Shepherding to a side (showing him outside/inside) | Angling the body to force the carrier onto his weaker or less dangerous route. |
| F8 | Pressing an opponent (closing down) | Running at the ball-carrier to reduce his time. |
| F9 | Counterpressing immediately after loss | Pressing within seconds of your own team losing the ball. |
| F10 | Recovery run (chasing back) | Sprinting back towards your own goal after being beaten or out of position. |
| F11 | Shoulder-to-shoulder contest for a rolling ball | Two players running at a loose ball, contact deciding it. |
| F12 | Standing a man up (no tackle at all) | Holding position and letting the carrier find nothing. |
| F13 | Foul as a defensive choice | Stopping the attack illegally on purpose. |

### §1.G DEFENDING — ball not at the carrier's feet, and team defending (13)

| ID | Entry | Football definition |
|---|---|---|
| G1 | Interception of a pass | Cutting out a pass in flight or along the ground. |
| G2 | Block of a shot | Getting a body or leg in the way of an attempt at goal. |
| G3 | Block of a cross | Preventing the delivery leaving the wide area. |
| G4 | Clearance under pressure | Getting the ball away from danger with no possession intent. |
| G5 | Headed clearance | Clearing an aerial ball with the head. |
| G6 | Man-marking | Being assigned to a specific opponent and following him. |
| G7 | Zonal marking | Being responsible for a space rather than a man. |
| G8 | Covering a teammate (second defender) | Positioning behind the pressing teammate to take the carrier if he is beaten. |
| G9 | Defensive handover / passing a runner on | Two defenders swapping responsibility for a moving attacker. |
| G10 | Cutting the passing lane (screening) | Standing in the line of a pass instead of going to the ball. |
| G11 | Holding the offside line / stepping up | The back line moving up together to leave attackers offside. |
| G12 | Dropping off / retreating as a unit | The line falling back together to deny the ball in behind. |
| G13 | Compressing the block (staying compact) | The team narrowing distances between players to deny space between them. |

### §1.H TRANSITIONS AND POSSESSION-CHANGE EVENTS (7)

| ID | Entry | Football definition |
|---|---|---|
| H1 | Turnover / loss of possession | The moment the ball changes team. |
| H2 | Recovery of a loose ball | Picking up a ball belonging to nobody. |
| H3 | Loose-ball duel | Two players contesting a ball neither controls, with no clear favourite. |
| H4 | Counter-attack (fast attack off a turnover) | Attacking at speed into a disorganized opponent. |
| H5 | Transition to defend (being counter-attacked) | Your team's response in the seconds after losing the ball high up. |
| H6 | Slowing the game / killing a transition | Deliberately stopping the tempo after winning the ball. |
| H7 | Deflection / rebound off a body | The ball changing direction off a player with no intent. |

### §1.I GOALKEEPING (12)

| ID | Entry | Football definition |
|---|---|---|
| I1 | Save with a catch | Holding the shot cleanly. |
| I2 | Parry / tip away | Deflecting a shot he cannot hold, to safety or in play. |
| I3 | Diving save | A save at full stretch away from the standing position. |
| I4 | Reflex / close-range save | A save with no time to move the feet. |
| I5 | Save with the feet / spread | Blocking with legs or body at close range. |
| I6 | Smother at the striker's feet | Coming out to take the ball off the attacker's boot. |
| I7 | Claiming a cross | Coming through bodies to catch an aerial delivery. |
| I8 | Punching a cross clear | Clearing an aerial delivery with the fists when a catch is not on. |
| I9 | Sweeping outside the box | Leaving the area to deal with a ball played in behind. |
| I10 | Narrowing the angle / setting the shot | Advancing on the shooter to reduce the goal he can see. |
| I11 | Distribution — throw / roll out | Restarting play with the hands. |
| I12 | Distribution — kick out (short or long) | Restarting play with a kick, short to a teammate or long upfield. |

### §1.J SET PIECES AND RESTARTS (14)

| ID | Entry | Football definition |
|---|---|---|
| J1 | Kick-off | The restart that begins a half and follows a goal. |
| J2 | Throw-in | The restart when the ball has left the pitch at the side. |
| J3 | Goal kick | The restart when the attacking team put the ball out behind the goal. |
| J4 | Corner kick | The restart when the defending team put the ball out behind their own goal. |
| J5 | Direct free kick | A free kick from which a goal can be scored directly. |
| J6 | Indirect free kick | A free kick requiring a second touch before a goal counts. |
| J7 | Penalty kick | A shot from the mark, keeper alone, for a foul in the area. |
| J8 | Dropped ball | The restart when play stopped for something the Laws do not otherwise cover. |
| J9 | Defensive wall at a free kick | Bodies lined up to cover part of the goal. |
| J10 | Set-piece delivery routine | A rehearsed delivery type and target for a corner or free kick. |
| J11 | Set-piece attacking movement (blocks, runs, near/far) | Rehearsed off-ball movement of the attacking group at a set piece. |
| J12 | Set-piece defensive scheme (zonal / man at corners) | How the defending group organizes for a delivery. |
| J13 | Short / worked set piece | Playing the set piece short to keep possession instead of delivering. |
| J14 | Quick restart to exploit disorganization | Taking a restart fast, before the opponent is set. |

### §1.K INSTITUTIONAL EVENTS (the Laws and the match's frame) (12)

| ID | Entry | Football definition |
|---|---|---|
| K1 | Foul — trip / kick / push | Illegal contact against an opponent. |
| K2 | Foul — holding / shirt pull | Restraining an opponent illegally. |
| K3 | Foul — tactical / cynical | A foul committed to stop a promising attack. |
| K4 | Handball | Deliberate or punishable contact with the hand or arm. |
| K5 | Offside | An attacker beyond the last defender when the ball is played to him. |
| K6 | Advantage played | The referee letting play continue because stopping it would help the offender. |
| K7 | Yellow card | A caution for a punishable act. |
| K8 | Second yellow / red card | Dismissal from the match. |
| K9 | Playing on with a man down | The match continuing with unequal numbers. |
| K10 | Goal awarded | The ball wholly crossing the line, validly. |
| K11 | Own goal | A goal put in by the defending team. |
| K12 | Stoppage — injury, substitution, time added | The clock's frame around the football. |

### §1.L DUELS, BODIES AND PHYSICAL CONTEST (8)

| ID | Entry | Football definition |
|---|---|---|
| L1 | Aerial duel | Two players jumping to contest a ball in the air. |
| L2 | Header for distance / clearance | Winning the aerial ball and sending it away. |
| L3 | Header to a teammate / flick-on | Winning the aerial ball and keeping it in the team. |
| L4 | Shoulder charge | Legal body contact to unbalance an opponent contesting the ball. |
| L5 | Being outmuscled / dispossessed by contact | Losing the ball to physical contest rather than a foot on the ball. |
| L6 | Screening a runner with the body (blocking his path) | Standing in an opponent's route to slow his run. |
| L7 | Fatigue / physical decline over the match | The body getting worse as the game goes on, changing what actions are possible. |
| L8 | Injury | A body event that removes or degrades a player. |

**Total: 146 entries** — A 14 · B 20 · C 11 · D 7 · E 15 · F 13 · G 13 · H 7 ·
I 12 · J 14 · K 12 · L 8 (each group count measured, sums to 146).

---


---

## §2 CLASSIFICATION (commit 2 — written only after the engine was read)

**What was read IN FULL for this section** (not searched — read):
`src/sim/mechanics.ts` (2193), `src/sim/Match.ts` (4302), `src/sim/Player.ts`
(401), `src/sim/types.ts` (549), `src/ai/PlayerBrain.ts` (1713),
`src/ai/actionExecutor.ts` (1401), `src/ai/TeamBrain.ts` (502),
`src/ai/formations.ts` (710), `src/sim/carryBeat.ts` (240). Import-graph check
run over the rest of `src/ai/**` to separate LIVE decision surfaces from
unwired instrument modules (result of record: `defensiveCoordination.ts`,
`offBallCoordination.ts`, `relativeAffordance.ts`, `teamTaskOccupancy.ts`,
`carryAffordance.ts`, `rendezvousRecovery.ts` and their neighbours have **no
importer in the live path** — they are instrument-side layers, and an entry
whose only home is one of those is NOT present in the football).

### §2.0 TALLY

| verdict | count |
|---|---|
| **PRESENT** | 91 |
| **DEGENERATE** | 31 |
| **ABSENT** | 24 |
| total | 146 |

Counts are MEASURED, not asserted: parsed off the verdict column of §2.1–§2.12
(146 rows, no duplicate IDs); the per-group split is §2.13 and sums to the
same three numbers.

### §2.0a THE MEASURED BASELINE (the walk's occurrence column)

60 matches, League seeds **12,476,000–12,476,004** (§4). The match clock is
`MATCH_DURATION = 240 s` (`src/sim/constants.ts:57`) displayed as 90′, so every
"per match" below is per 240 s of football, not per real 90 minutes.

Per match: passes 109.18 (completed 81.60) · dribble events 115.87 · one-touch
passes 22.73 · through balls 11.52 · shots 11.45 · interceptions 23.50 ·
tackles 10.93 · clearances 3.63 · miscontrols 8.08 · headers won 6.28 ·
long balls 4.63 · cutbacks 3.90 · crosses 2.25 · corners 2.65 · offsides 2.97 ·
fouls 3.80 · saves 4.48 (parry 3.27 / catch 1.12) · goals 1.62 · yellows 1.13 ·
advantage played 1.47 · free-kick strikes 1.02 · header shots 2.08 · chips 0.78 ·
high claims 0.77 · one-twos 0.80 · third-man releases 12.00 · **blocks 0.07** ·
**overlaps 0.12** · smothers 0.05 · woodwork 0.22 · penalties 0.03 · reds 0.03 ·
subs 0.03 · injuries 0.17 · restarts: goal kick 4.68 / corner 2.65 / free kick
2.30 / kick-in 1.38 / penalty 0.03.

Second walk, seeds **12,476,005–006** (20 matches), action-label histogram over
120 k player-samples: MoveToFormationSpot 26.83% · MarkOpponent 25.99% ·
GoalkeeperPosition 14.15% · ChaseBall 11.89% · SupportBallCarrier 6.23% ·
MakeRun 6.13% · ReceivePass 2.87% · InterceptPass 2.09% · Dribble 1.71% ·
HoldPosition 1.27% · Pass 0.50% · … · **HoldUp 5 samples (0.004%)** ·
**ShieldHold 0**. Containment (`Player.containing`) on 3.1% of samples;
6.1 dribble pushes per match. Every CB ledger read **0** (Road-B doors shut).

### §2.1 A — CARRYING AND BEATING A MAN

| ID | verdict | evidence |
|---|---|---|
| A1 | PRESENT | `Dribble` action + the discrete push `mechanics.ts:1447 performDribbleTouch`; measured 6.1 pushes/match, `Dribble` 1.71% of player-samples. |
| A2 | DEGENERATE | In traffic there are NO touches: the push is gated on `nearOpp > TOUCH_CONTROL_DIST` (4.2 m) at `Match.ts:2800`, so inside 4.2 m the ball is RIGIDLY GLUED at `owner.pos + heading·0.85` (`Match.ts:2835`). Close control is an attachment, not a sequence of contacts. The honest offset that would fix it exists (`Match.ts:2547 applyC6HonestOffset`) and is dormant (`c6Carry` false everywhere). |
| A3 | PRESENT | Push length scales with open field ahead (`mechanics.ts:1472-1473`, `TOUCH_PUSH_SPACE`) with a touchline guard at `:1479`. |
| A4 | DEGENERATE | The legs do cut (`actionExecutor.ts:1356-1386`, committed slalom shoulder), but nothing about the cut BEATS anybody: the outcome is `tryTackles`'s roll, whose probability contains no relative geometry at all (`mechanics.ts:1929-1957`). A cut into a defender's momentum and a cut into his stance price identically. |
| A5 | ABSENT | Searched `feint`, `swerve`, `dummy`, `deceive`, `fake` across `src/sim`+`src/ai`: zero hits. Structurally: no defender holds a belief about the carrier's intent, so there is nothing to sell. |
| A6 | ABSENT | Searched `stepover`, `scissor`: zero hits. |
| A7 | ABSENT | Searched `dragback`, `drag-back`, backward-touch paths. The only aimed knock into the back half is `mechanics.ts:1573 performTouchPast`, reachable ONLY through `Match.forcedTouchPast` (null in every production path, `Match.ts:2765-2783`); ledger measured 0. |
| A8 | ABSENT | Searched `nutmeg`: zero hits; no through-the-legs geometry (the defender is a disc, `PLAYER_CORE_RADIUS`). |
| A9 | ABSENT | Searched `roulette`, `spin turn`: zero hits. The turn-rate cap (`Player.ts:17`) makes turning a cost, never a move. |
| A10 | DEGENERATE | `HoldUp` exists end to end (`PlayerBrain.ts:881`, `actionExecutor.ts:638`) and is EXTINCT: 5 of ~120 000 player-samples (0.004%). Its generalized successor `ShieldHold` (`actionExecutor.ts:573`) measured 0 — dormant by design. |
| A11 | DEGENERATE | No standing-start take-on exists as an act, and the duel's only carrier credit is MOMENTUM (`mechanics.ts:1943`, `pace·drive·0.16`) — a stationary carrier attacking a set defender is priced as the worst case with no compensating craft term. |
| A12 | DEGENERATE | The situation happens constantly (retreating markers, `actionExecutor.ts:277-399`) but the mechanism is blind to it: the duel reads neither defender velocity nor whether he is set (`mechanics.ts:1929-1957`). |
| A13 | PRESENT | Carry speed `0.84 + dribbling·0.1` (`actionExecutor.ts:560`) and the momentum gate (`mechanics.ts:1943`) make the burst pay. |
| A14 | DEGENERATE | No beaten event in production. The only trace of "he was beaten" is a CONSTANT recovery price (`mechanics.ts:2028`: 1.2 s cooldown / 0.35 s stun) — identical for a walk-in and a full-tilt dive. The physics-derived version exists (`carryBeat.ts:159 recoveryInterval`) behind `cbCommitPhysics`, measured 0. |

### §2.2 B — PASSING AND DELIVERY

| ID | verdict | evidence |
|---|---|---|
| B1 | PRESENT | `mechanics.ts:355 performPass`; 109.18 passes/match. |
| B2 | PRESENT | Same function; long balls priced by `d > 32 ⇒ ×0.5` (`PlayerBrain.ts:479`) and the speed clamp `d·0.6+8.2 → [9,22]` (`mechanics.ts:392`). |
| B3 | PRESENT | `mechanics.ts:736 performLoftedPass` / `:526 loftKick`; 4.63 long balls/match. |
| B4 | DEGENERATE | **The passer cannot choose to drill it.** Speed is a pure function of distance (`mechanics.ts:392`); the weight input exists (`performPass(… powerChoice)`, executed with error at `:348 executedPassPower`) and EVERY live caller omits it (`Match.ts:2160`, default 1). One pace per range, for everyone. |
| B5 | PRESENT | `mechanics.ts:454 performThroughBall`; 11.52/match. |
| B6 | DEGENERATE | Body orientation is priced (`mechanics.ts:79 kickMisalignment`, `:84/:89`) but only ever as a COST; there is no against-the-grain delivery and no benefit for playing where the defence is not leaning. |
| B7 | ABSENT | Searched `noLook`, `no-look`, `disguise`, `telegraph`. The pass's direction is never a percept: a defender's intercept read is the BALL (`PlayerBrain.ts:1627-1640`), only after the kick. |
| B8 | PRESENT | The strike leads the receiver by `mate.vel · flight · 0.8` (`mechanics.ts:376`). (The CHOSEN lead — pricing a led point — is the dormant PTP seat, `PlayerBrain.ts:355`.) |
| B9 | DEGENERATE | The lay-off bonus exists (`PlayerBrain.ts:439`, `layingOff && d < 12 ⇒ ×1.3`) but it is keyed to `action.type === 'HoldUp'`, which is extinct (0.004%). The set from a pivot effectively never happens. |
| B10 | PRESENT | The wall-pass licence `mechanics.ts:434-443` + the burst `PlayerBrain.ts:1606`; completed one-twos 0.80/match. |
| B11 | PRESENT | `mechanics.ts:240 registerPass` bounce flag + `PlayerBrain.ts:497-502`; third-man releases 12.00/match. |
| B12 | PRESENT | Back-pass term `PlayerBrain.ts:468` and the open-run suppression `:429`. |
| B13 | PRESENT | The `d > 24` lofted switch (`PlayerBrain.ts:596-618`). |
| B14 | PRESENT | `mechanics.ts:566 performCross`; 2.25/match. |
| B15 | PRESENT | `mechanics.ts:670 performCutback`; 3.90/match. |
| B16 | DEGENERATE | The RELEASE point is free (`|y| > 10 && localX > 10`, `PlayerBrain.ts:793`) but the TARGET must already be in the box channel (`mLocalX < 16 || |y| > 13 ⇒ skip`, `:797`). There is no half-space receiver concept anywhere, so "the early ball to the man arriving in the inside channel" cannot be aimed at. |
| B17 | PRESENT | `mechanics.ts:926-940` (the cushioned knockdown to the best-placed mate). |
| B18 | PRESENT | The lofted through ball `mechanics.ts:471-477`. |
| B19 | PRESENT | Pressure noise `mechanics.ts:396-405` + the one-touch window (`Match.ts:2467-2485`); 22.73 one-touch passes/match. |
| B20 | PRESENT | passes − completed ≈ 27.6/match. |

### §2.3 C — FINISHING

| ID | verdict | evidence |
|---|---|---|
| C1 | PRESENT | `mechanics.ts:1170 performShot`; 11.45 shots/match. |
| C2 | DEGENERATE | **There is no power/placement trade.** Every open-play shot leaves at the same `SHOT_SPEED` (`mechanics.ts:1281`); "placement" is an attribute-derived aim margin and spread (`:1197`, `:1267`), never a choice. A shooter cannot decide to side-foot it. |
| C3 | PRESENT | The placed curler `mechanics.ts:1279-1284`. |
| C4 | PRESENT | `mechanics.ts:1086 tryChip`; 0.78 chips/match. |
| C5 | PRESENT | The snap-decision window in shooting range (`Match.ts:2432-2436`). |
| C6 | ABSENT | Searched `volley`, `half-volley`. Structural: `performShot` requires `ball.owner === shooter` (`mechanics.ts:1171`), and an airborne ball has no owner — so a ball out of the air can only ever become a HEADER (`tryAerial`), never a struck volley. |
| C7 | PRESENT | `mechanics.ts:1011 performHeaderShot`; 2.08 header shots/match. |
| C8 | PRESENT | Distance falloff `mechanics.ts:275` + the earned-composure 1v1 (`:1255`). |
| C9 | PRESENT | The long-range dig `PlayerBrain.ts:282-289`. |
| C10 | PRESENT | Parries 3.27/match (`mechanics.ts:2179-2190`), woodwork 0.22/match (`Match.ts:2955`), blocked drives become loose balls (`mechanics.ts:2081-2085`). |
| C11 | ABSENT | Searched `shotFake`, `fake`, `feint`: zero. Nothing on the pitch can pretend to shoot. |

### §2.4 D — RECEIVING AND FIRST CONTACT

| ID | verdict | evidence |
|---|---|---|
| D1 | PRESENT | `mechanics.ts:159 attemptFirstTouch`; the clean branch hands control via `giveBall`. |
| D2 | ABSENT | **The first touch has no direction.** The adjudication is binary (`clean` / not, `mechanics.ts:203`), and a FAILED touch sprays the ball at a RANDOM angle and speed (`:208`, `rotate(±0.8 rad) × range(3.5,6.5)`). Nobody ever chooses where to take it. Searched the whole reception path (`attemptFirstTouch`, `giveBall`, `resolvePendingControlAttempt`, `tryChestTrap`) for any directional argument: none exists. |
| D3 | DEGENERATE | Reception orientation IS priced (`mechanics.ts:173`, the misalign term) but body facing is a by-product of movement (`Player.ts:314-341`); no body ever opens up FOR a reception, and there is no half-turn act. |
| D4 | DEGENERATE | The cost side exists (pressure in `touchFailChance`), the football act does not: back-to-goal play routes to `HoldUp`, extinct at 0.004%. |
| D5 | PRESENT | `mechanics.ts:957 tryChestTrap`. |
| D6 | PRESENT | 8.08 miscontrols/match. |
| D7 | ABSENT | Searched `dummy`, `letItRun`, `decline`. Structurally the opposite is enforced: every body inside `CONTROL_RADIUS` with access submits a claim (`Match.ts:3958 collectGroundContactClaims`) and the best reach margin CONTACTS the ball (`:4076-4109`). A player cannot choose not to touch it. |

### §2.5 E — OFF-BALL ATTACKING

| ID | verdict | evidence |
|---|---|---|
| E1 | PRESENT | Licensed runners (`TeamBrain.ts:112 assignRunners`) → `runTarget` (`formations.ts:551`); `MakeRun` 6.13% of samples. |
| E2 | PRESENT | `TeamBrain.ts:238-274` (the overlap licence) + `actionExecutor.ts:542-549`. ⚠ measured **0.12 completed overlaps/match** — the licence fires but the release almost never arrives. |
| E3 | ABSENT | Searched `underlap`, `inside run`. The overlap target is hard-coded to the OUTSIDE (`actionExecutor.ts:546-548`, `|y| → HALF_W − 2.5`); the inside version has no representation. |
| E4 | PRESENT | The bounce flag (`mechanics.ts:240`) + the release bonus (`PlayerBrain.ts:497`); 12.00/match. |
| E5 | ABSENT | Searched `blindside`, `line of sight`, `behind the marker`. Runs are geometric (`runTarget`); no run ever reads the marker's facing, and the marker's own facing is only used for tackle/deflection/block blind penalties, never for run selection. |
| E6 | DEGENERATE | Runs DO drag man-markers (`TeamBrain.ts:456 assignMarks` re-solves greedily) — the effect exists as a side effect. Nobody ever runs in order to move a defender, and nothing in any score prices the space created for someone else. |
| E7 | DEGENERATE | Support is ALWAYS ahead of the ball: `aheadBias = 0.75` (attacking) / `0.35` (else), both positive (`formations.ts:701`). Coming SHORT to receive is exactly the axis the CTB plane opens (`formations.ts:644-658`, span reaches −0.15) and it is dormant (`ctbSupportPlane` false everywhere). |
| E8 | ABSENT | Searched `double movement`, `checkAway`. No two-phase movement primitive exists; a run has one target recomputed per frame. |
| E9 | PRESENT | `widthMul = 1.0 + attackingWidth·0.55` (`formations.ts:300`). |
| E10 | DEGENERATE | Lane/depth fractions exist per role (`formations.ts:277-283`) but there is no BETWEEN-THE-LINES reference in attack: the only opponent-relative station term is defence-only (`formations.ts:346`, `!hasBall && (DF|MF)`). |
| E11 | DEGENERATE | Pinning is DESIGNED IN as a table fact — the defend tables deliberately keep the striker high, "offence by presence" (`formations.ts:65-71`) — but no player ever chooses to pin, and the pinned defender's marker never notices. |
| E12 | PRESENT | The weak-side far-post pull (`formations.ts:233-238`) and the `farPost` corner routine (`formations.ts:467-469`). |
| E13 | DEGENERATE | With `aheadBias` positive in both modes, the only body behind the ball is the rest-defence DF held there by a clamp (`formations.ts:294-296`), so the backwards option is a positional accident, not an offer. |
| E14 | PRESENT | `formations.ts:267 emergentStation`; `MoveToFormationSpot` 26.83% of samples. |
| E15 | ABSENT | Searched the chaser assignment (`TeamBrain.ts:316-441`): contesters are picked by CURRENT distance to the ball (`:437`), plus a landing projection for long lofted balls (`:408-436`). Nothing anywhere anticipates where a DUEL or a BLOCK will spit the ball out. |

### §2.6 F — INDIVIDUAL DEFENDING

| ID | verdict | evidence |
|---|---|---|
| F1 | **DEGENERATE — ⭐ THE WORKED EXAMPLE (§0.2)** | The standing challenge exists and fires 10.93×/match (`mechanics.ts:1862 tryTackles`), and it is structurally hollow in a precise way: the candidate is chosen by SCALAR DISTANCE only (`:1875`, `d < 1.15`), and the take probability (`:1929-1957`) is built from team aggression, the tackler's `defending`, the carrier's `dribbling`/`strength`/`pace·drive` — **no term of the TAKER's own velocity, heading or approach angle appears anywhere**. So every challenge is FRONTAL BY CONSTRUCTION: CB-C0 measured 97 of 103 candidate bearings inside the front cone and **zero behind**, and its R3 (chasing challenges take less often than head-on ones) came back NEGATIVE/UNRESOLVED. Consequences: diving in costs nothing beyond a constant (`:2028`, 1.2 s / 0.35 s regardless of how hard you came), and geometry cannot beat anybody. The armed alternative (`carryBeat.ts:125 commitmentFactor`, `:159 recoveryInterval`) is dormant; ledger measured 0. |
| F2 | PRESENT (rare) | `mechanics.ts:1737 trySlideTackle` — but narrow by construction: within 30 m of goal, carrier `|v| ≥ 4`, band 1.2–2.2 m, attempt `0.05 + markingAggression·0.12`. |
| F3 | ABSENT | One tackle model only (`tryTackles`); searched `poke`, `toe`, `stab`. No low-commitment challenge exists — every attempt spends the same lunge (`spendBurst(TACKLE_LUNGE_COST)`, `:1906`). |
| F4 | ABSENT | No angle term exists to distinguish it (see F1). Searched `side tackle`, `flank`. |
| F5 | DEGENERATE | From-behind challenges exist ONLY as the recovery slide (`:1737`, which requires `bx·vx + by·vy ≤ 0`, i.e. chasing) and the cynical grab (`:1803`). The ordinary standing duel has no behind case at all (F1's zero-behind measurement). |
| F6 | PRESENT | The jockey (`mechanics.ts:1886-1904` refusal gate, `actionExecutor.ts:211-249` standoff, hysteresis `Player.ts:163`); containment on 3.1% of player-samples. |
| F7 | ABSENT | Searched the containment target: it is `carrier.pos + toOwnGoal·standoff` (`actionExecutor.ts:239-241`) — the goal-side line and nothing else. There is no "show him outside / show him onto his weak side", and no weak-foot state to show him onto (searched `weakFoot`, `weak foot`: zero). |
| F8 | PRESENT | Chaser assignment (`TeamBrain.ts:316`) + `pressIntensity`. |
| F9 | PRESENT | The transition window (`TeamBrain.ts:380-387`, `transitionPress`) and its mode face (`:82-89`). |
| F10 | PRESENT | The retreat school (`actionExecutor.ts:203-208`). |
| F11 | DEGENERATE | A rolling-ball contest is resolved by REACH MARGIN ORDERING (`Match.ts:4076-4081`) plus symmetric overlap separation (`:4116`). No strength, no body contact, no winner — the first body to be geometrically nearest simply gets the touch. |
| F12 | PRESENT | The jockey's refusal branch is literally "no tackle" (`mechanics.ts:1904 return`). |
| F13 | PRESENT | `mechanics.ts:1803 tryTacticalFoul`; cynical fouls 0.28/match. |

### §2.7 G — TEAM DEFENDING

| ID | verdict | evidence |
|---|---|---|
| G1 | PRESENT | `PlayerBrain.ts:1627-1640` + `Match.ts:2486-2492`; 23.50/match. |
| G2 | DEGENERATE | `mechanics.ts:2053 tryShotBlock` exists, but the gate is a 0.9 m box AND `z ≤ 1.1` AND outside the six-yard zone: measured **0.07 blocks/match against 11.45 shots** (0.6%). Meanwhile the shooter's appetite is discounted for every body in the corridor (`PlayerBrain.ts:303-304`) — the threat is priced far above the event. |
| G3 | ABSENT | Searched for any cross-interception path: `tryShotBlock` is `pendingShot`-only (`mechanics.ts:2054`), `tryDeflection` is ground-speed-only, and a lofted cross above `CONTROL_MAX_HEIGHT` goes straight to `tryAerial`. A defender cannot block the delivery in the wide area. |
| G4 | PRESENT | `mechanics.ts:1613 performClear`; 3.63/match. |
| G5 | PRESENT | The defensive header branch (`mechanics.ts:917-924`). |
| G6 | PRESENT | `scheme: 'man'` (`types.ts:89`), `TeamBrain.ts:456`; `MarkOpponent` 25.99% of samples. |
| G7 | PRESENT | The zonal branch (`TeamBrain.ts:460`, `:479`, `:493`). |
| G8 | DEGENERATE | Cover exists only as (i) the sweeper's DEPTH gene (`formations.ts:294-296`) and (ii) a duel bonus when a second body happens to be within 3 m (`mechanics.ts:1956`). No defender is ever ASSIGNED to cover another; the cover-handoff module `src/ai/defensiveCoordination.ts` has no importer in the live path. |
| G9 | DEGENERATE | Handover happens only as a side effect of the greedy re-solve of `team.marks` every `TEAM_AI_INTERVAL` (`TeamBrain.ts:456-501`) — no continuity, no negotiation, no "he's yours". The negotiation modules (`defensiveCoordination.ts`, `intentProcess.ts` family) are unwired. |
| G10 | PRESENT | The ball-side lane blend (`actionExecutor.ts:334-345`, `laneW`). |
| G11 | PRESENT | The trap hold-line (`actionExecutor.ts:362-369`, `trapBias`); trap events 0.32/match, offsides 2.97/match. |
| G12 | PRESENT | `MODE_SHIFT.Defend = −8` (`formations.ts:126`) + opponent-line tracking (`:346-355`). |
| G13 | PRESENT | `defensiveCompactness` width squeeze (`formations.ts:300`) and the solidity collapse (`:391-395`). |

### §2.8 H — TRANSITIONS

| ID | verdict | evidence |
|---|---|---|
| H1 | PRESENT | `Match.ts:2500-2509` (`possessionSide` swing, both brains re-coordinate). |
| H2 | PRESENT | The own-loose-ball chaser (`TeamBrain.ts:328-345`). |
| H3 | DEGENERATE | The phase exists as a NAME and nothing reads it: `PossessionPhase.contested` is derived per step (`Match.ts:2079 computePossessionPhase`) and the field's own comment states nothing in the decision path reads it (`Match.ts:786-791`). The actual resolution is reach-margin ordering (F11) — a 50/50 is a geometry sort, not a duel. |
| H4 | PRESENT | `CounterAttack` mode (`TeamBrain.ts:62`), `counterAttackBias`. |
| H5 | PRESENT | The loss clock (`TeamBrain.ts:82-89`) + the retreat school (`actionExecutor.ts:203`). |
| H6 | PRESENT | `mentality.holding` + the corner hold (`PlayerBrain.ts:879-895`, `:950-952`). |
| H7 | PRESENT | `mechanics.ts:1642 tryDeflection`; and the blocked-shot ricochet (`:2083`). |

### §2.9 I — GOALKEEPING

| ID | verdict | evidence |
|---|---|---|
| I1 | PRESENT | `mechanics.ts:2175-2177`; 1.12 catches/match. |
| I2 | PRESENT | `mechanics.ts:2179-2190`; 3.27 parries/match. |
| I3 | DEGENERATE | There is no dive: reach is a RADIUS (`mechanics.ts:30 keeperReach`, plus the `SAVE_STRETCH = 1.35` attempt band at `:46`), and the dive is display only (`Player.ts:96 saveAnimTimer`). A keeper never commits to a side and cannot be wrong-footed. |
| I4 | PRESENT | Difficulty frozen at the strike (`mechanics.ts:51 diveDifficulty`) + `reflexes` (`:2150`). |
| I5 | ABSENT | One save model for everything (`tryKeeperSave`); searched `spread`, `feet save`, `block save`. The only non-hands keeper act is the smother. |
| I6 | PRESENT | `mechanics.ts:1674 trySmother`; 0.05/match. |
| I7 | PRESENT | The keeper claim in `tryAerial` (`mechanics.ts:789-820`); 0.77 high claims/match. |
| I8 | ABSENT | The claim is BINARY: win ⇒ `giveBall`, lose ⇒ "flapped at it — the ball sails on" (`mechanics.ts:819`). No punch, no fisted clearance; searched `punch`, `fist`. |
| I9 | PRESENT | `GoalkeeperRush` (`PlayerBrain.ts:1424-1455`) and the sweeper interception range (`:1465`). |
| I10 | PRESENT | `out = 2.5 + keeperAggression·7` (`actionExecutor.ts:698`) and the two positional save credits (`mechanics.ts:63 angleCoverage`, `Match.ts:261 closeIn`). |
| I11 | PRESENT | `mechanics.ts:647 performKeeperThrow`. |
| I12 | PRESENT | The three-way release: roll / sling / PUNT (`PlayerBrain.ts:979-1051`). |

### §2.10 J — SET PIECES AND RESTARTS

| ID | verdict | evidence |
|---|---|---|
| J1 | PRESENT | `Match.ts:4201 setupKickoff` + the backward first touch (`PlayerBrain.ts:166-194`). |
| J2 | DEGENERATE — **deliberate arcade deviation, not a disease** | There is no throw-in: the touchline restart is a futsal-style KICK-IN, declared as such at `types.ts:300-304`; 1.38/match. No hands, no throw-in offside exemption logic beyond the flag at `PlayerBrain.ts:233`. Flagged per contract §7 for R-乙's STATUS column, not as a gap. |
| J3 | PRESENT | `Match.ts:3085`; 4.68/match; the keeper waits for shape (`PlayerBrain.ts:157`). |
| J4 | PRESENT | `Match.ts:3083`; 2.65/match. |
| J5 | PRESENT | `mechanics.ts:1348 performFreeKick` (the closed-form curl over the wall); 1.02 strikes/match. |
| J6 | ABSENT | `RestartKind` has exactly five members and no indirect kick (`types.ts:304`); offside is deliberately resolved as a GOAL KICK instead (`Match.ts:3319 callOffside`, declared a law simplification). |
| J7 | PRESENT | `Match.ts:3113-3118`; 0.03/match (rare because outfield fouls play advantage). |
| J8 | ABSENT | No dropped ball in `RestartKind` (`types.ts:304`); searched `droppedBall`, `drop ball`. Every stoppage routes to one of the five kinds. |
| J9 | PRESENT | `Match.ts:3401-3415` + `formations.ts:415 fkWallSlots` + the wall-wait gate (`Match.ts:3653-3661`). |
| J10 | PRESENT | Four corner routines (`types.ts:311`), chosen by zone openness (`TeamBrain.ts:284 pickCornerRoutine`). |
| J11 | PRESENT | `formations.ts:456 cornerCrashSpots` + the TIMED crash burst (`actionExecutor.ts:519-526`). |
| J12 | DEGENERATE | Defending a set piece is just ordinary marking plus the clearance circle (`Match.ts:3542-3585`): no corner-specific scheme, no zonal six-yard sentry, no near-post guard, and the taker is explicitly un-marked (`TeamBrain.ts:470-474`). The attacking side has four routines; the defending side has none. |
| J13 | PRESENT | The `short` and `arcCutback` routines (`formations.ts:441-453`, `PlayerBrain.ts:843-868`). |
| J14 | PRESENT | The quick free kick before the wall forms (`Match.ts:3605-3633`). |

### §2.11 K — INSTITUTIONAL EVENTS

| ID | verdict | evidence |
|---|---|---|
| K1 | PRESENT | `Match.ts:3110 awardFoul`; 3.80 fouls/match. ⚠ every foul in the world originates in a failed challenge (`mechanics.ts:2033`), a slide (`:1800`), a smother (`:1710`) or the cynical grab — see K2. |
| K2 | DEGENERATE | Holding exists ONLY as the cynical grab of a breakaway (`Match.ts:3279 awardTacticalFoul`, 0.28/match). Off the ball and in open play nobody can hold, push or obstruct: searched `hold`, `push`, `obstruct` across the foul paths. |
| K3 | PRESENT | `mechanics.ts:1803` + `Match.ts:3279`. |
| K4 | ABSENT | Searched `handball`, `hand ball`, `handling`: zero hits. Only the keeper has hands, and his hands are a claim mechanism, never an offence. |
| K5 | PRESENT | Frozen at kick time (`mechanics.ts:220 offsideAtKick`, `:234 registerPass`), consumed at the touch (`Match.ts:2366`, `mechanics.ts:883-888`); 2.97/match. |
| K6 | PRESENT | `Match.ts:3120-3135`; advantage played 1.47/match. |
| K7 | PRESENT | `Match.ts:3147 maybeCard`; 1.13 yellows/match. |
| K8 | PRESENT | Second yellow + straight red (`Match.ts:3166-3176`); 0.03 reds/match. |
| K9 | PRESENT | `Match.ts:3184 sendOff` → `removeFromPitch`; every player loop skips `sentOff`. |
| K10 | PRESENT | `Match.ts:2988 checkGoal`; 1.62 goals/match. |
| K11 | PRESENT | The own-goal branch (`Match.ts:3027-3030`). |
| K12 | PRESENT | Stoppage (`Match.ts:2105 refBlowsNow`, `:1683 addedMinutes`), injuries (`:3230`), substitutions (`:3429`). ⚠ measured 0.03 subs/match — on a 240 s clock the fatigue threshold is almost never crossed, so the rotation gene barely expresses. |

### §2.12 L — DUELS, BODIES AND PHYSICAL CONTEST

| ID | verdict | evidence |
|---|---|---|
| L1 | PRESENT | `mechanics.ts:785 tryAerial` (position + `aerialSense` + a jump-timing roll); 6.28 headers won/match. |
| L2 | PRESENT | The clearance header (`mechanics.ts:917-924`). |
| L3 | PRESENT | The knockdown to a mate (`mechanics.ts:926-940`). |
| L4 | ABSENT | Body contact between players is `resolveOverlaps` (`Match.ts:4116-4188`): a symmetric position + normal-velocity separation with NO strength term, NO winner and NO foul possibility. Searched `charge`, `shoulder` (only `shoulder` as a comment metaphor). Nobody can lean on anybody. |
| L5 | DEGENERATE | `strength` reaches the world in exactly two places — a −0.1 shield term in the standing tackle (`mechanics.ts:1934`) and `aerialSense` (`:774`). There is no contact dispossession event: you cannot be outmuscled off the ball, only tackled or beaten to it. |
| L6 | DEGENERATE | Bodies ARE obstacles (`PLAYER_MIN_DIST` separation, `avoidOpponents`, and the ball-access screening test `Match.ts:3973 directBallAccess`), but no player ever chooses to block a runner's path, and obstruction is never a foul. |
| L7 | PRESENT | `Player.ts:346-359` (quadratic drain / recovery) and `topSpeed = baseSpeed·(0.62 + 0.38·stamina)` (`:266`). |
| L8 | PRESENT | `Match.ts:3230 maybeInjure`, knock (`Player.ts:223`) vs serious; 0.17 injuries/match. |

### §2.13 PER-GROUP TALLY

| group | P | D | A | n |
|---|---|---|---|---|
| A carrying | 3 | 6 | 5 | 14 |
| B passing | 15 | 4 | 1 | 20 |
| C finishing | 8 | 1 | 2 | 11 |
| D receiving | 3 | 2 | 2 | 7 |
| E off-ball | 6 | 5 | 4 | 15 |
| F individual defending | 7 | 3 | 3 | 13 |
| G team defending | 9 | 3 | 1 | 13 |
| H transitions | 6 | 1 | 0 | 7 |
| I goalkeeping | 9 | 1 | 2 | 12 |
| J set pieces | 10 | 2 | 2 | 14 |
| K institutional | 10 | 1 | 1 | 12 |
| L duels / bodies | 5 | 2 | 1 | 8 |
| **total** | **91** | **31** | **24** | **146** |

Both tallies are the same parse of the same column, so they agree by
construction rather than by a reader's arithmetic.

**The shape of the answer, in one line:** the engine has most of football's
NOUNS (91/146) and is thin on football's VERBS OF CRAFT AND CONTEST — carrying
(3 present of 14) and off-ball movement (6 of 15) are the two weakest groups,
and they are exactly the two the aesthetic criterion is watched through.

---

## §3 THE ABSENCE MAP

Ranked by how load-bearing the missing thing is for the aesthetic criterion
(配合 · 技巧 · 博弈 · 对抗 · 战术). Plain football language first; the entry IDs
are the receipts. **No recommendation of what to build** — that is the ruling
chain's (contract §4).

### 1. Nobody on this pitch can lie to anybody (技巧 + 博弈)
`A5 A6 A7 A8 A9 B7 C11 D7 E5 E8`

There is not one deceptive act in the whole world. No feint, no stepover, no
drag-back, no shot fake, no no-look pass, no dummy, no blindside run, no
double movement. Every player always does exactly what he is doing, and the
opponent's response is a function of where the ball IS, never of what he was
made to believe. 博弈 — the mind game — needs two things the world does not
have: a way to sell a lie, and a defender with a belief to sell it to. This is
the single largest hole in the census, and it is one hole, not ten: the ten
entries are ten faces of "no deception layer".

### 2. The tackle is a coin flip on a distance (对抗)
`F1 (the worked example) · A4 A11 A12 F3 F4 F5 A14`

The duel that decides most possessions asks only "is he within 1.15 m", then
rolls dice weighted by attributes. How he arrived — flying in, planted,
chasing from behind, cutting across the carrier's line — changes nothing, so
diving in is free and beating a man with geometry is impossible. 97 of 103
challenges come from in front because nothing else can be represented. There
is also no cheap challenge (no poke) and no expensive one: every attempt costs
the same lunge. The carrier's side of it is the same story from the other end —
he can cut, but the cut cannot beat anybody, and being beaten is not an event,
just a constant 1.2 s cooldown.

### 3. There is no contact game at all (对抗)
`L4 L5 F11 L6`

Two bodies meeting is a geometry separation with no strength, no winner and no
foul. You cannot shoulder a man off the ball, you cannot be outmuscled, you
cannot hold your ground and win a shoulder-to-shoulder race, and you cannot
legally block a runner's path. `strength` reaches the world in two arithmetic
terms and nowhere else. Every 50/50 in the game is decided by which body's
reach margin is bigger — a sort, not a fight.

### 4. Craft is an attribute, never an act (技巧)
`D2 B4 C2 A2 D3 B6`

The three moments where real technique lives are all fixed laws: the first
touch has no direction (clean, or a random spray), the pass has one pace per
range (the weight input exists and no caller uses it), and the shot has one
speed for everybody (placement is a spread constant, not a choice). In traffic
the ball is not even touched — it is glued 0.85 m in front of the body. A
0.9-technique player and a 0.3-technique player make the same DECISIONS and
differ only in noise, so 技巧 cannot be watched, only inferred from outcomes.

### 5. Defenders have no relationships with each other (战术)
`G8 G9 F7 J12 G2 G3`

Marking is solved greedily every team tick and that is the whole of team
defending. Nobody covers anybody, nobody hands a runner on, nobody shepherds
a carrier onto his weaker side, and defending a corner is just the ordinary
marking scheme. The two "get a body in the way" acts barely exist: shot blocks
happen 0.07 times a match (0.6% of shots, while the shooter is discounted for
every body in the lane) and blocking a cross is not representable at all. The
modules that would carry cover and handover exist in the tree and are wired to
nothing.

### 6. The combination vocabulary is three patterns wide (配合)
`E3 E7 E13 E6 E10 B9 B16 E2(0.12/match)`

配合 exists — one-two 0.80/match, third-man 12/match — but the movements that
CREATE combinations are thin. Support is always ahead of the ball, so nobody
comes short to receive and nobody offers the safe backward ball; there is no
underlap, no run that exists to drag a marker, no between-the-lines pocket, no
half-space target for an early delivery, and the pivot lay-off is keyed to an
act (hold-up) that is extinct at 0.004% of player-frames. The overlap is
licensed but its release arrives 0.12 times a match, so the one wide
combination the engine names is, in practice, not happening.

### 7. Second phase is missing (配合 · 对抗)
`E15 H3 G2 I8 I3 I5`

Nothing anticipates where a contest will spit the ball out: contesters are
chosen by present distance. The loose-ball duel is a named phase that no
decision reads. In the air the keeper's claim is win-or-flap (no punch), and
his save is a radius rather than a dive, so he can never be wrong-footed and
there is no committed-keeper rebound picture.

### 8. Laws texture — mostly honest arcade deviations (low aesthetic load)
`J2 (deliberate) J6 J8 K4 K2 C6`

The kick-in instead of the throw-in is a declared deviation and belongs in
R-乙's STATUS column, not here. Alongside it: no indirect free kick (offside
becomes a goal kick, also declared), no dropped ball, no handball, no holding
or pushing in open play, and no volley — a ball out of the air can only ever
become a header, because a shot requires ownership and an airborne ball has no
owner. These cost the aesthetic criterion least, but C6 (no volley) is the one
that is a real football absence rather than a simplification.

### 9. Grain notes worth the ruling chain's eye (not absences)
* **Substitutions 0.03/match** — the 240 s clock means the fatigue threshold is
  almost never crossed, so an evolvable rotation gene has nearly no expression
  surface. (Measured, not designed.)
* **Third-man 12/match vs one-two 0.80/match** — a two-order-of-magnitude gap
  between two counters that both claim to count a combination; worth a
  definition audit before either number is quoted as 配合.
* **A large dormant layer exists** — CB (carry beat), C5/C6/C7, O1/O2, PM, MT,
  CTB, OBM, PTP, DLC, DV, EK: capabilities BUILT and shut behind Road-B doors.
  Several §2 DEGENERATE verdicts name the dormant fix explicitly. The census
  classifies THE FOOTBALL THAT IS PLAYED, so a dormant capability never counts
  as PRESENT — but it is not "nothing exists", and the difference matters to
  whoever reads this map.

---

## §4 SEEDS AND STATS

* Band booked by ruling #271.2: **12,476,000–12,476,999** (evidence walks only).
* **Consumed (booked = walked): 12,476,000 · 001 · 002 · 003 · 004** (walk 1,
  League seeds, 12 matches each = 60 matches) and **12,476,005 · 006** (walk 2,
  10 matches each = 20 matches). The rest of the band is **virgin**.
* **Stats drawn: 0.** Stated explicitly, as the dispatch requires: this round
  drew no statistics number. Every figure in §2 is either a code trace or a raw
  occurrence count over the named seeds — an occurrence check, never an
  inferential claim, and no confidence interval is offered anywhere.
* **Receipts, honestly named**: this round's receipts are TWO SIMPLE
  ASSERTIONS, not a gate battery — (i) `src/**` is byte-untouched (the round's
  hard property; `git status` carried only this document), and (ii) the freeze
  commit precedes the results commit in the git history (#266.3(c)). No gate
  conjuncts exist, so #268.3(a) machine-liveness has nothing to derive here,
  and none is claimed.

## §DOUBTS

1. **Verdict boundaries are judgement calls at the margin.** PRESENT-but-rare
   vs DEGENERATE is the fuzziest line in this document. The rule applied: if
   the mechanism can express the football distinction the entry names, it is
   PRESENT even when rare (F2 slide tackle, I6 smother); if it cannot express
   the distinction, it is DEGENERATE even when it fires constantly (F1 tackle,
   10.93/match). Two rows sit closest to the line and are flagged rather than
   hidden: **G2** (shot block — the mechanism is honest, but 0.07/match against
   a threat priced into every shot) and **E2** (overlap — licence real,
   completion 0.12/match).
2. **Occurrence counts are per 240 s, not per 90 min.** Anyone comparing them
   to published real-football rates must scale, and R-乙's STATUS column is
   where that comparison belongs — not here.
3. **`thirdMan = 12.00/match` is not audited.** It counts flagged bounce
   ARRIVALS (`Match.ts:2454`), which may be a looser definition than a coach's
   third-man run. Recorded as a definition question, not corrected.
4. **The dormant layer is deliberately classified as not-present** (§3.9). If
   the ruling chain wants the census to distinguish ABSENT from DORMANT as a
   third axis, that is a versioned amendment to this instrument, not a
   correction of this run.
5. **146 rows is one draft's completeness, not football's.** Per contract §4 a
   missing row indicts this version. Known thin spots in my own draft: youth /
   restart-of-restart edge cases, deliberate time-wasting sub-types, and
   keeper-specific distribution sub-types beyond the three the engine happens
   to have.

## §COMMANDER CORRECTIONS OF RECORD (#272.2, 2026-08-15)

The verify: freeze order BYTE-PROVEN (the frozen §1 diffs identical to final; §2/§3 were literal
stubs at the freeze commit), tallies independently re-parsed, 20 adversarial spot-checks, the
engine-shaped-vocabulary hunt clean (counter-evidence: the group sitting on the newest engine layer
came back WEAKEST). VERDICT: PASS-WITH-FINDINGS. Adjudicated:

* **(i) HIGH RATIFIED — A3 (knock past a man) is DEGENERATE, not PRESENT.** The cited push is
  priced by the ABSENCE of an opponent in the forward cone (mechanics.ts:1453-1472: a defender
  ahead SHORTENS it; inside 4.2 m no push at all) — the mechanism does the opposite of the entry's
  football meaning; the only aimed knock past a body is A7's dormant seam. The classifier followed
  the source's own comment ("knock-and-run down the wing") — ⭐ the NAME-SHAPED version of the
  blind spot the freeze order guards against, now on record as a classification hazard.
* **(ii) MED-1/MED-2 RATIFIED — A13 and C3 are DEGENERATE by the census's own rule** (pace change:
  attribute gradient exists, the ACT does not — dribble speed a constant, burst tackle-only; curl:
  unconditional, attribute-scaled, auto-signed, never aimed). ⭐ CORRECTED TALLIES OF RECORD:
  **PRESENT 88 · DEGENERATE 34 · ABSENT 24**; carrying = **1/14 PRESENT**. The absence map is
  STRENGTHENED, not weakened (item #2 loses its last in-group counter-example; item #4 gains two
  rows).
* **(iii) MEDs corrected**: `strength` reaches the world in THREE live terms (+PlayerBrain.ts:1033,
  the keeper punt-outlet fitness) — §2.12/§3.3's "exactly two" superseded; G3 narrowed: a LOFTED
  delivery cannot be blocked (forked to tryAerial by height); a low cut-back falls to the generic
  interception path (G1).
* **(iv) MED-5 — VOCABULARY v2 AMENDMENT REGISTERED** (classification rides the next census touch,
  not asserted here): 假摔/造犯规 (simulation — a DECEPTION act, further strengthening absence-map
  #1) · 点球大战 · VAR/裁判回看 · 团队压迫陷阱/逼向一侧 (distinct from F7) · 危险动作/高脚 ·
  脚后跟/外脚背传球. Per contract §4 these indict the version, not the instrument.
* **(v) LOWs recorded**: the in-text count recipe is stale in the final file (146 unique IDs, 292
  rows — use `grep -oE | sort -u`) · L4 has one asymmetric case (GK-in-box push, role-based —
  ABSENT stands) · the "~60–120" range was the executor brief's, not the contract's · §3's rank
  order inside items 1–7 is argued, not scored — quotable as a MAP, not as a metric.
