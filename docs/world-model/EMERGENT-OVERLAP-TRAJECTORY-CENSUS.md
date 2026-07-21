# E3 — Emergent Overlap-trajectory Census

Status: **COMPLETE — NATURAL COVERAGE FAILED; stopped. No live change.**

Date: 2026-07-21

## 1. Question

The live baseline still contains a named `team.overlapper` assignment and a
dedicated `MakeRun` target outside a wide carrier. Under the re-entry rule, the
football pattern may eventually survive while that authority disappears only
if generic movement already supports the underlying trajectory.

E3 asks one descriptive question:

> During an ordinary wide outfield possession spell, does a teammate who starts
> behind the carrier ever run around the carrier's outside and finish materially
> ahead without being licensed as `team.overlapper`?

“Overlap” is a post-hoc geometry label in this probe. It is not an action,
candidate, score, role privilege or gene.

## 2. Frozen sample

Run 120 deterministic five-minute matches from seed offset 30,000 with ordinary
random teams. Observe only `phase === playing` spells with a stable outfield
owner on the ball.

A carrier spell starts when a new outfield player becomes stable owner and ends
when stable ownership changes, play stops or the match finishes. A mover is
eligible once per spell when all of these are true at the same post-step
snapshot:

```text
mover is an active same-team outfielder other than the carrier
|carrier y| >= 0.50 × HALF_W
mover and carrier are on the same flank, or mover begins centrally at |y| <= 8m
carrier local-x - mover local-x is in [1m, 18m]
centre distance <= 24m
```

The episode lasts until the spell ends or 4.0 seconds elapse. Each carrier-spell
and mover pair may produce at most one episode. Ownership changes never splice
two spells together.

## 3. Geometry-only outcome

Record real mover and carrier trajectories in the attacking team's frame. A
completed episode is an overlap-shaped trajectory only when, before termination:

```text
mover forward gain from episode start             >= 3.0m
mover local-x - carrier local-x                    >= 2.0m
|mover y| - |carrier y|                            >= 1.0m
mover remains on the carrier's original flank
```

The first snapshot satisfying all four freezes the trajectory outcome. These
constants define material movement rather than a live tactical threshold; they
must not be changed after seeing the census.

Track separately whether the mover was exposed at any episode tick to:

* `team.overlapper === mover.index`;
* `team.runners`, `team.arriver`;
* `MakeRun` or `SupportBallCarrier`;
* a live same-partner `wallRun`.

The primary natural stratum is `overlapper exposed = false`. A strict stratum
with none of the recorded named assignment/run/support authorities is diagnostic.

## 4. Outputs

Report:

* carrier spells, eligible/closed episodes and conservation;
* overlap-shaped trajectories per match and match coverage;
* named-overlapper exposed versus unlicensed trajectories;
* strict no-recorded-authority trajectories;
* mover role as post-hoc anatomy only;
* start trailing distance, forward gain, final ahead/outside distances, path
  length and elapsed time;
* spell-change, expiry, dead-ball and match-end termination counts;
* duplicate identity and non-finite failures.

No pass, goal, xG, possession payoff or scalar quality determines this census.

## 5. Frozen validity and non-vacuity gates

```text
matches                                      = 120
episode start/close conservation             exact
duplicate carrier-spell/mover identities     = 0
non-finite trajectory facts                  = 0
unfinished episodes after match close        = 0
overlap-shaped trajectories                  >= 10
overlapper-unlicensed trajectories           >= 5 across >= 5 matches
same-seed complete output                     byte-identical
production source changes                     = 0
```

The strict no-authority count is diagnostic, not a pass gate.

## 6. Stop rule

If unlicensed trajectories are absent or vacuous, do not widen the current
overlap gate, add an `Overlap` action or change the geometry after the result.
The generic movement/coordination substrate then does not yet support the
pattern cleanly.

If they exist, do not infer that they pay, occur at the right frequency or
justify retiring the named baseline. Passing only banks primitive trajectory
coverage. Any payoff, selection, shared-task representation or script retirement
requires a separate contract.

Do not modify `TeamBrain`, `PlayerBrain`, `actionExecutor`, formations, policy,
roles, genes or Match to help the census pass.

## 7. Frozen result

Two complete runs produced the identical output hash
`6e57b255df91779e5450f2a7098e2c9c0954f5799c9018607c5508a18c254707`.

### Validity and coverage

```text
carrier spells / wide-at-start spells          17,492 / 4,615
eligible episodes started / closed               8,058 / 8,058
duplicate identities / unfinished / non-finite       0 / 0 / 0
overlap-shaped trajectories                              4
match coverage                                         4 / 120
named-overlapper unlicensed                              4
strict no recorded authority                             0
```

All four observed trajectories lacked the dedicated `team.overlapper` licence,
but every one still used `MakeRun` or `SupportBallCarrier`; two also exposed a
runner/arriver assignment. They therefore do not establish a clean generic
movement path.

| trajectory fact | mean | q10 | q50 | q90 |
|---|---:|---:|---:|---:|
| start trailing | 1.757m | 1.006m | 1.657m | 2.741m |
| forward gain at success | 5.326m | 3.118m | 6.806m | 7.581m |
| ahead of carrier | 2.440m | 2.033m | 2.218m | 3.437m |
| outside carrier | 3.606m | 1.009m | 3.898m | 6.304m |
| path length | 6.203m | 3.199m | 7.591m | 7.821m |
| elapsed | 0.979s | 0.483s | 1.150s | 1.217s |

The four paths show that the geometry is physically possible, but the frozen
non-vacuity gates required at least ten trajectories and at least five
unlicensed trajectories across five matches. Both gates failed.

## 8. Verdict

Unlike cut-inside carries and ordinary return-pass choice, overlap-shaped
off-ball movement is **not yet naturally covered at population scale**. Removing
the named overlap authority now would delete real football rather than reveal a
generic replacement.

The result does not authorise widening the live overlap gate or adding an
`Overlap` action. It identifies a narrower substrate gap: the current generic
movement vocabulary is dominated by fixed world points and legacy run/support
targets; it does not reliably express a teammate-relative trajectory whose
target moves with the carrier. A future dormant, role-neutral moving-reference
movement primitive may be investigated under a separate representation and
feasibility contract. It must expose no overlap label, offset preference, live
emitter or payoff claim.
