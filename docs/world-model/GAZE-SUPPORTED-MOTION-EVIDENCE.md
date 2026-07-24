# D-PROC-1MG — Gaze-supported temporal motion evidence

Status: **PASS — gaze-supported motion evidence banked; consumer remains closed.**

Date: 2026-07-24 (drafted and ratified; fork selected by the user)

## 1. Why this is a new experiment, not a D-PROC-1M rerun

D-PROC-1M strictly failed because passive body-facing scanning supplied four
new actor observations in only 137/177 completed arms. Its stop rule forbids
rescue by adding samples, lengthening the window or reading private action
state. It said nothing about a different honest information channel, because
none existed then.

S3-G0 banked observer-owned gaze as a physical channel. S3-G1 banked a pure
memory-guided single-target reflex that reaches the truth-aimed ceiling: given
a designated relevant actor, the unchanged envelope sustains six fresh
observations per 48-tick window in 87/87 completed states.

D-PROC-1MG re-poses D-PROC-1M's unchanged estimand under that qualified
channel, on fresh seeds, with the representation, window, arms and every
frozen gate value identical:

> With the observer's gaze driven only by its own memory of the designated
> actor, do three strictly-newer external observations distinguish continued
> movement, braking inertia and redirection?

Nothing else may differ from D-PROC-1M. A pass or fail is therefore
attributable to the channel alone.

## 2. Authority

Everything in `TEMPORAL-MOTION-EVIDENCE.md` §2 applies verbatim: the
representation reads observed tick/age/position/velocity/bodyDir only, and may
not read private targets, `Player.action`, true state, TeamBrain, coach genes,
familiarity or future observations.

Gaze additions:

* the observer's gaze comes from `chooseAttentionGaze` (S3-G1, unchanged) and
  nowhere else;
* one-tick decision latency: the gaze used with the truth of tick `i` is
  computed from the observer's snapshot of tick `i-1`; the first observation
  of each arm uses the frozen acceptance snapshot;
* the previous gaze threads forward when the actor fact is absent, exactly as
  banked;
* no truth-aimed arm exists in this experiment — the ceiling was banked in
  S3-G1 and would contaminate attribution here;
* every M-style gaze must be recomputable from the logged snapshot sequence
  alone (S3-G1's purity audit), be valid and normalised, and never mutate
  truth, RNG or any body.

No production file changes. `src/ai/motionEvidence.ts`,
`src/ai/perceptionSnapshot.ts` and `src/ai/attentionPolicy.ts` are consumed
exactly as committed.

## 3. Frozen protocol

Identical to `TEMPORAL-MOTION-EVIDENCE.md` §4–5 with exactly these deltas:

```text
seeds                       89,000..89,191 (fresh; max 192, one state/seed)
acceptance                  unchanged (carrier/actor/observer + two offers),
                            plus: freeze the observer's acceptance snapshot
arms                        H / E / R unchanged (window 48, switch at 24,
                            same pins, same intent transactions)
observation                 every observe() call supplies the gaze computed
                            from the previous snapshot with one-tick latency
gates                       every D-PROC-1M value unchanged, plus the S3-G1
                            gaze-purity exact gates (invalid gaze = 0,
                            non-normalised = 0, recompute mismatches = 0)
determinism                 two full runs byte-identical, shared SHA-256
```

For the avoidance of doubt, the unchanged frozen gates are: accepted `= 96`;
jointly completed `>= 72`; four-sample support `>= 95%` of completed arms;
aged-observation states `>= 20`; E/R pre-switch parity `= 100%`; E/H evidence
difference `>= 90%`; displacement separation `>= 0.50` in `>= 60`; final-speed
separation `>= 0.50` in `>= 60`; braking delta `<= -0.10` in `>= 48`;
post-switch R/E difference `>= 75%`; velocity-turn and body-turn separation
`>= 0.15` in `>= 48` each; all D-PROC-1M exact/privacy/RNG/intervention gates
at zero.

## 4. Stop and authority

FAIL parks the three-observation temporal representation with prejudice: it
failed under both the passive and the qualified active channel. It may not be
rescued by gaze-policy tuning, dead-reckoning, cadence or retention changes,
a fourth sample or a longer window. The fork returns to the user with the
representation family closed.

PASS banks observer-local motion-phase evidence as a qualified dormant
representation. It authorises at most one user fork: a separately
pre-registered probe-local response consumer that requires motion-phase
evidence before reopening its candidate set (a new experiment — not a
D-PROC-1 rescue; D-PROC-1's own thresholds stay closed). It does not authorise
target-relevance selection, multi-target attention, coach doctrine,
familiarity, payoff, live AI or evolution.

## 5. Frozen result

Fresh seeds `89,000..89,121` (122 scanned, ≤192) supplied all 96 accepted
states. The two full executions were byte-identical, and every schema, privacy,
RNG, intervention, finite-value, sample-order, bounded-history and
private-switch-invisibility check passed at zero. The three added gaze-purity
gates also held exactly: no invalid gaze reached `perceiveSnapshot`, no stored
gaze was non-normalised, and every M-style gaze was recomputable from the
logged snapshot sequence alone. Canonical report SHA-256:

```text
28971096961320f1715147136e0974cc4e7ff02568ad7df0b82e2217d1ce1b58
```

The representation cleared every frozen D-PROC-1M gate under the qualified
channel:

```text
accepted states                                        96 / 96    (need = 96)
jointly completed H/E/R states                         75 / 96    (need >= 72)
completed arms with >= 4 distinct observations        225 / 225   (100%; need 95%)
states with an aged observation                        75 / 75    (need >= 20)
E/R pre-switch evidence parity                         75 / 75    (need = 100%)

E/H evidence sequences differed                        75 / 75    (100%; need 90%)
E-H net displacement >= 0.50m                          74 / 96    (need >= 60)
E-H final speed >= 0.50m/s                             74 / 96    (need >= 60)
H negative observed speed delta <= -0.10m/s            67 / 96    (need >= 48)

R/E post-switch evidence sequences differed            75 / 75    (100%; need 75%)
R-E absolute velocity-turn sum >= 0.15rad              71 / 96    (need >= 48)
R-E absolute body-turn sum >= 0.15rad                  70 / 96    (need >= 48)

invalid / non-normalised gaze                           0
policy recompute mismatches                             0
schema / finite / RNG / intervention / privacy gates    0
```

Arm-completion census across the 288 arms: 225 completed, 36 lost the ball
loose, 24 lost observer support, 3 hit a dead-ball/restart. The single change
from D-PROC-1M — routing each observation through the S3-G1 memory-guided gaze
with one-tick latency instead of the passive body-facing scan — was decisive:
the four-sample support gate that strictly failed D-PROC-1M (137/177, 77.4%)
now holds at 225/225 (100%), lifting jointly-completed states from 59 to 75 and
carrying every downstream separation gate over its frozen threshold. Because
the estimand, representation and every gate value were D-PROC-1M's and only the
observation channel differed, the result is attributable to the channel alone.

Per the stop rule, D-PROC-1MG banks observer-local motion-phase evidence as a
qualified dormant representation. It authorises at most one further user fork:
a separately pre-registered, probe-local response consumer that requires
motion-phase evidence before reopening its candidate set (a new experiment, not
a D-PROC-1 rescue — D-PROC-1's own thresholds stay closed). It does not
authorise target-relevance selection, multi-target attention, coach doctrine,
familiarity, payoff, live AI or evolution.
