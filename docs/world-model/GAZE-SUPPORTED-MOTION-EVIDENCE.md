# D-PROC-1MG — Gaze-supported temporal motion evidence

Status: **PRE-REGISTERED — no run yet.**

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
