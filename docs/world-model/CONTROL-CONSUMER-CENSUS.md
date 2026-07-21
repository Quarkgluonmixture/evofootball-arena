# Controlled-ball consumer census — B1c-0

Status: **B1c-0 authority, 2026-07-21.** This classifies the current production
readers/writers before any controlled-ball consumer is migrated.

Source scan at `12ed15e`:

| Symbol | Production occurrences | Files |
|---|---:|---:|
| `ball.owner` | 110 | 12 |
| `ball.pos` | 165 | 12 |
| `possessionSide` | 27 | 7 |
| `pendingPass` | 44 | 5 |
| `dribbleTouch` | 17 | 4 |
| `pendingControl` | 12 | 1 |
| `activeContest` | 9 | 1 |
| `contestEpisodes` | 2 | 1 |

These counts are navigation aids, not acceptance metrics. Tests and probes add
many more direct setup/assertion references and are intentionally excluded from
the production count.

## 1. Three meanings currently sharing two fields

Every consumer below is classified as:

- **P — physical truth:** where the real independent ball is and whether a
  body can actually contact it;
- **C — control-process truth:** who may perform the next own action and whether
  one continuous carry/reception is still alive;
- **M — macro possession:** which team has the ball, where the attack broadly
  is, and which tactical phase/shape should apply.

`ball.pos` currently serves P and M. `ball.owner` currently serves P, C and M.
That semantic overlap—not a bad cadence constant—is the B1 failure exposed by
the 113-contact pass-arrival chain and the 52.92-knock regime.

## 2. `Match` authority and laws

| Site | Current use | Class | B1c migration rule |
|---|---|---|---|
| `stepBall()` owned branch | constrains ball pose/velocity to owner; decides open knock | P+C | B1c-0 unchanged. B1c-1 exercises an isolated alternative; no live switch. |
| `kickBall()` | releases and places the real ball | P | Always authoritative `ball.pos/vel`; an own micro-touch must not call this generic pass/release path. |
| `giveBall()` | assigns owner, ends pass, records stats, changes possession, resets brains, resolves M3 | C+M | Must never be called by an own planned micro-touch. Later stable-control entry may start a sequence in an isolated lever. |
| `computePossessionPhase()` | classifies controlled/contested/loose | M | B1c-0 unchanged. A future sequence-aware phase is behavioural and must be isolated. |
| `checkWoodwork()` / `checkGoal()` / `checkOutOfPlay()` | laws and physical boundaries | P | Always real ball. Never `PossessionLocus`. |
| `collectGroundContactClaims()` / `applyControlContact()` / `resolvePendingControlAttempt()` / `tryCapture()` | M3 ball access, contact and delayed control | P | Always real ball. Own sequence touches must stay outside M3; opponent contact enters here. |
| restart placement, foul spot, keeper claim/smother | real ball and law positions | P | Always real ball. |
| stoppage-time attack checks and `Team.resetProgress()` | coarse attack position/progress | M | Candidate for a later isolated `PossessionLocus` migration, never B1c-0. |
| `possessionSide` writes | team possession spell and brain reset | M | Own touch exact-zero invariant: never changes it. |
| `pendingPass` lifecycle | offside, pass completion, interception and arrival context | P+C+M | Own touch exact-zero invariant: never creates or prolongs a pass-arrival episode. |
| `dribbleTouch` | existing Phase-36 open knock/chase/recollect | C | Preserve as the genuine open-space regime. Do not reuse it for close-control micro-touches. |
| `pendingControl` / `activeContest` | M3 contact→control and passive contest ledger | P | Opponent interruption boundary only. Own planned touch must not create either. |

## 3. Skill execution (`src/sim/mechanics.ts`)

| Consumer family | Class | B1c rule |
|---|---|---|
| pass/cross/shot/restart guards (`ball.owner === actor`) | C | Eventually needs a controller query while a sequence is active; no switch in B1c-0. Release origin remains real `ball.pos`. |
| pass, shot, header, block, save, deflection trajectories | P | Always real ball position/velocity. |
| first-touch difficulty and arrival bookkeeping | P+C | Stable control may start a sequence later; own carry touches never masquerade as a new reception. |
| `tryDribbleTouch()` | C+P | Remains the open kick–chase–regather regime. It is not the B1c close-control cadence. |
| standing/slide/keeper tackles | P+C | Ball access and opponent interruption use real ball. A later lease break may enter M3; no direct winner is added. |
| pressure, loose-touch and goal-distance queries | P or M by purpose | Physical tackle/execution queries stay on real ball; coarse tactical valuation requires a separate consumer decision. |

## 4. Individual AI

### `src/ai/PlayerBrain.ts`

- `ball.owner === p` chooses the on-ball brain: **C**. Later it may use the
  active controller identity, but that is a behavioural consumer migration.
- `ball.owner === null && dribbleTouch.gid === p.gid` chooses open-knock chase:
  **C**, preserved separately.
- loose-ball chase, interception and shot-danger tests: **P**, always use real
  ball state.
- carrier/opponent identity used for marking and support: mixed **C+M**; it must
  not infer “free team possession” from the ball being between own touches.
- rest-defence and coarse progression reads of `ball.pos`: **M**, future
  `PossessionLocus` candidates only.

### `src/ai/actionExecutor.ts`

- deciding who carries, who is marked, and whether the keeper holds: **C**;
- face/chase/intercept targets and ball-body distances: **P**;
- formation targets and coarse ball-side shifts: **M**.

No executor consumer moves in B1c-0. In particular, a virtual foot anchor is not
an action target or collider yet.

## 5. Team AI and shape

### `src/ai/TeamBrain.ts`

The current carrier and `possessionSide` drive mode, press/chaser assignment,
support and passing structure. Most spatial reads of `ball.pos` here are **M**;
loose-ball reach/interception checks are **P**. Each call site must be migrated
individually—there is no blanket search/replace from `ball.pos` to
`possessionLocus`.

### `src/ai/formations.ts`

Ball-local-x, side shift, block depth and lane anchors are predominantly **M**.
They are plausible later `PossessionLocus` consumers, but changing them can move
all twelve bodies and therefore cannot share a behavioural commit with touch
physics.

## 6. Perception, renderer and replay

| Site | Class | Rule |
|---|---|---|
| `perceptionSnapshot` ball position/velocity | P | Players observe the real ball, including exposure between touches. |
| `perceptionSnapshot.ownerGid` | C | Later represent the active controller explicitly; do not falsify physical ball position. |
| 2D/3D rendered ball and trails | P | Always real ball. M4 forbids a render-only foot lie. |
| owner marker / held-ball presentation | C | May later read controller/keeper state, separately from ball position. |
| scorebar possession and formation overlays | M | May read macro control after an isolated adapter change. |

## 7. Probe and test consumers

Probes intentionally read all three layers. They do not become live consumers:

- `ball-control-anatomy` freezes secured/knocked/free behaviour;
- `contest-anatomy` guards M3 recontacts and pass-arrival tails;
- `control-sequence-anatomy` observes the new representation and enforces the
  four exact-zero own-touch violations;
- fingerprint, watched=headless and clone-continuation tests certify that the
  representation did not change the match path.

Direct state writes in unit tests are scenario setup, not migration candidates.

## 8. B1c-0 decision

No existing production consumer moves in B1c-0.

The only runtime additions are:

```text
Match.controlSequence = null
Match.possessionLocus = derive(ball.pos, controlSequence, controller.pos)
```

Normal play never creates a sequence, and no decision/physics/render path reads
the new getter. Therefore the B1c-0 expectation is exact byte identity.

## 9. First later migrations, if B1c-0 passes

1. **B1c-1 mechanism scene only:** physical ball impulses + one active sequence,
   with no opponent and no macro consumer migration.
2. **B1c-2 opponent scene:** opponent real contact breaks the sequence into
   existing M3; own touch remains outside M3.
3. **Only after those mechanisms pass:** choose one macro consumer family
   (`possessionPhase`, TeamBrain, or formation locus), state the expected
   counterfactual, and gate it alone.

This ordering prevents a gait phase from perturbing pass arrival or moving all
twelve players before the control-process invariant itself works.
