# E1 — Emergent Carry-trajectory Census

Status: **PASS as a telemetry-only natural-pattern census. No live change.**

Date: 2026-07-21

## 1. Question

The re-entry rule says a reverted named behaviour may return only as a pattern
that is observed after generic world/action dynamics produce it. E1 asks a
descriptive baseline question:

> Do current ordinary `Dribble` episodes that begin wide already produce
> materially goalward, inward carry trajectories without a `CutInside` action,
> winger role gate or pattern reward?

This is not a proposal to increase their frequency. It first separates a real
trajectory from a design name.

## 2. Current migration debt

The existing live baseline is not uniformly emergent:

* `Dribble` is a general carrier action and its ordinary target is the opponent
  goal, with opponent-relative slalom and pressure escape;
* an explicit `wideDrive` spatial predicate still sends advanced wide carriers
  down the line;
* one-two, third-man, overlap, cutback arriver and runner assignment still have
  named state/weights/authorities elsewhere in the engine.

Therefore E1 must not call every familiar-looking movement emergent. It records
whether an inward trajectory ever entered the existing explicit wide-drive zone,
and it does not evaluate the named combination scripts.

## 3. Episode authority

Run 120 deterministic five-minute matches from seed offset 26000 with ordinary
random teams.

A carry episode starts when an outfield player is the stable `ball.owner` and
their current action is ordinary `Dribble`. It remains continuous through that
player's accepted `dribbleTouch` free-ball interval. It ends at the first of:

* another player becomes stable owner;
* the ball is free with no active touch for that player;
* the player regains stable control but chooses a non-Dribble action;
* live play ends or the match finishes.

Only episodes with finite positions and at least two sampled ticks enter the
trajectory ledger. Touch gaps are not separate new carries.

## 4. Geometry-only classification

All geometry is measured in the carrier team's attack frame. Define:

```text
wide start              |start y| >= 0.50 × HALF_W
material goalward reach peak local-x gain >= 3.0m
material inward reach   |start y| - minimum |y| >= 3.0m
material outward reach  maximum |y| - |start y| >= 3.0m
```

Among wide-start, material-goalward episodes, classify after the episode:

```text
inward-only  inward yes, outward no
outward-only outward yes, inward no
mixed arc    both yes
straight     neither
```

These names exist only in the probe output. No role, gene, action score or live
state reads them.

Also record whether any episode tick satisfied the current baseline's explicit
wide-drive spatial predicate:

```text
|y| > 13m
20m < local x < HALF_L - 7m
```

This is an audit flag, not a new implementation dependency.

## 5. Outputs

Report:

* all completed carry episodes and wide-progressive denominator;
* inward-only/outward-only/mixed/straight counts and shares;
* peak forward gain, inward/outward excursion, path length and duration;
* role distribution as observation only;
* how many inward or mixed trajectories never entered the explicit wide-drive
  zone;
* team-side and match coverage;
* non-finite, orphan-touch and unfinished-episode anatomy.

No goals, wins or scalar pattern quality determine this census.

## 6. Frozen non-vacuity and validity gates

```text
matches                                      = 120
completed wide-progressive episodes          >= 100
inward-only + mixed episodes                  >= 10
inward-only + mixed share                     >= 5%
non-finite trajectory facts                   = 0
same-seed complete output                      byte-identical
production source changes                     = 0
```

Exposure to the explicit wide-drive zone is diagnostic, not a pass gate. If all
inward trajectories pass through named/scripted authorities, the correct result
is that clean emergence remains unproved.

## 7. Stop rule

If inward movement is absent or vacuous, do not add a `CutInside` action, winger
bonus, target or gene. If it exists, do not infer that more is always better or
that it pays. The next evidence would be trajectory-to-outcome anatomy or a
generic carry-direction choice representation, both under a new contract.

Do not modify `dribbleTarget`, `PlayerBrain`, policies, attributes, roles,
movement physics or renderer to help the census pass.

## 8. Frozen result

The 120-match run at seed offset 26000 passed every validity and non-vacuity
gate:

```text
completed ordinary carry episodes             16,203
wide-start + material-goalward episodes       574 (116/120 matches)
inward-only + mixed                            398 (69.3%)
inward/mixed without explicit wideDrive zone  386 (97.0%)
matches containing inward/mixed movement      111/120
non-finite trajectory facts                   0
```

| post-hoc trajectory | count | share | mean forward | mean inward | mean path | mean duration |
|---|---:|---:|---:|---:|---:|---:|
| inward-only | 397 | 69.2% | 11.04m | 6.19m | 13.76m | 2.19s |
| outward-only | 18 | 3.1% | 10.48m | 0.15m | 13.60m | 2.41s |
| mixed arc | 1 | 0.2% | 14.85m | 4.06m | 51.61m | 3.30s |
| straight | 158 | 27.5% | 5.27m | 1.52m | 6.19m | 1.13s |

Wide-progressive episodes were side-balanced (283/291) and occurred mainly—but
not exclusively—among players occupying the wing role (483 WG, 49 ST, 23 DF,
19 MF). Role was recorded after the fact and never gated an episode.

Two complete runs produced the identical output hash
`1356d48ba3512a7cf76572aedef2078da603100eb1f827fe7a30faf5ff9d432f`.
The production fingerprint remained
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

The narrow conclusion is strong: the current generic goal-directed carry plus
ordinary opponent-relative steering already produces the trajectory commonly
described as cutting inside, at population scale, without a `CutInside` action,
gene or role licence. Ninety-seven percent of these trajectories never entered
the current explicit down-the-line predicate's spatial zone.

This does not prove that 69% is the right frequency, that the carries pay, or
that teams deliberately choose an inverted-winger strategy. It proves that the
football phenomenon no longer needs its old scripted implementation. Any future
work should compare generic carry-direction affordances and outcomes, leaving
the pattern name in telemetry.
