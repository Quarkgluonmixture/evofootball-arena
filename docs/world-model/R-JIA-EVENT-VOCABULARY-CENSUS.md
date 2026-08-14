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

## §2 CLASSIFICATION — **NOT YET WRITTEN AT THE FREEZE COMMIT**

Deliberately empty in commit 1. The engine had not been read when this
document was first committed; git is the attestation (#266.3(c)).

## §3 THE ABSENCE MAP — **NOT YET WRITTEN AT THE FREEZE COMMIT**

Deliberately empty in commit 1.

## §4 SEEDS AND STATS — **completed in commit 2**

Band booked: 12,476,000–12,476,999. Stats expected 0.

## §DOUBTS — **completed in commit 2**
