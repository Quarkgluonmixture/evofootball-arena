# D-PROC-1G — Motion-gated embodied-intent reopening

Status: **STRICT FAIL (cadence finding, NOT a mechanism refutation) — the
crux held-exterior false-reopening gate PASSED at 2/96, but jointly-completed
states (59) and ordered responses (50) fell short of their frozen counts. The
evidence-gated response is too slow to fire inside the live window at the
required rate, and the pre-registered 48-tick window attrits joint completion
below 72. No live consumer or D-PROC-2 authorised; no tuning; the fork returns
to the user. See §7.**

Date: 2026-07-24 (drafted; the executor flips this to PRE-REGISTERED on
ratification)

## 1. Why this is a new experiment, not a D-PROC-1 rescue

D-PROC-1's response, causality and anti-oscillation mechanisms all passed. Its
single failure was held-exterior false reopening `7/96` against `<=4/96`: one
observed displacement of at least `0.25m` could not distinguish a persistent
run from braking inertia. Its stop rule forbids changing that consumer's
thresholds or requiring one more sample inside the same design, and demands a
causally different temporal motion-phase representation first.

That representation now exists and is qualified: D-PROC-1MG banked
three-sample observer-local motion evidence under the S3-G1 memory-guided
gaze channel, with 100% four-observation support and every frozen
movement/braking/redirection gate cleared on fresh seeds.

D-PROC-1G therefore re-poses D-PROC-1's unchanged response question with
exactly two causal substitutions and nothing else:

```text
observation channel   body-facing passive scan → S3-G1 memory-guided gaze
support predicate     one displacement sample → qualified motion-phase
                      evidence (active continuation, not braking)
```

Every response, edge, progress, separation, anti-oscillation and exact gate
value is inherited verbatim. A pass or fail is attributable to the evidence
gate alone.

## 2. Authority

Everything in `EMBODIED-INTENT-REOPENING.md` §2–§5 applies verbatim: coach
doctrine and familiarity frozen neutral; set-valued `ObserverIntentBelief`;
physical `PLAYER_MIN_DIST` occupancy admissibility as the only consumer;
cyclic probe-owned tie-break; no timer, no oscillation, no live AI.

Substitutions:

* **Gaze:** B (the responding observer) supplies gaze from
  `chooseAttentionGaze` aimed at A, with one-tick latency and previous-gaze
  threading exactly as in D-PROC-1MG; the first observation uses the frozen
  acceptance snapshot. All S3-G1 purity audits apply (valid, normalised,
  recomputable from logged snapshots; zero truth/RNG/body mutation).
* **Support predicate:** a candidate is supported only when ALL hold:
  * B's `ObservedMotionHistory` over A holds three strictly-newer samples
    (the banked `motionEvidence.ts` representation, unchanged);
  * net observed displacement across the history `>= 0.50m` (D-PROC-1MG's
    frozen movement separation value);
  * minimum observed inter-sample speed delta `> -0.10m/s` (D-PROC-1MG's
    frozen braking signature boundary — a braking history is NOT support);
  * candidate alignment `>= 0.50` with the newest inter-sample displacement
    bearing (D-PROC-1's frozen alignment, applied to the newest history
    step).

  The single-observation `0.25m` trigger is REPLACED, not loosened. Empty
  support remains legal and cannot trigger a response.

New dormant module `src/ai/motionGatedIntentResponse.ts` implements only the
predicate above, composing the unchanged `motionEvidence.ts` history with the
unchanged reopening query in `intentResponse.ts`. Neither existing module may
change.

## 3. Frozen protocol

Identical to `EMBODIED-INTENT-REOPENING.md` §6–§8 with exactly these deltas:

```text
seeds            90,000..90,191 (fresh; max 192, one state per seed)
window           48 ticks (the qualified channel's banked window from
                 S3-G1/D-PROC-1MG — the three-sample predicate is
                 structurally impossible inside 36 ticks at the existing
                 scan cadence; pre-registered here, not adjusted later)
acceptance       unchanged, plus: freeze B's acceptance snapshot
arms             H / I / C unchanged; B runs the gaze reflex on A in ALL
                 three arms (H must face the same evidence machinery it
                 could falsely fire through)
```

## 4. Frozen gates

All of D-PROC-1's gate values verbatim — exact validity list unchanged
(schema/privacy/RNG/writes/pre-reopening I:C equality/duplicates all zero;
accepted `= 96`; scanned `<= 192`; jointly completed `>= 72`), support and
mechanism unchanged:

```text
C non-empty embodied support                >= 64 / 96
C ordered response fingerprints             >= 56 / 96
C - H response-fingerprint edge             >= 48 states
I response fingerprints                      = 0
H false reopenings                          <= 4 / 96
C replacement progress >= 0.25m             >= 75% of C revisions
C/I B-body separation >= 0.25m              >= 60% of C revisions
honest unsupported/no-alternative retention  = 100%
non-oscillation family                       all zeros, max revisions <= 3
```

Plus the S3-G1 gaze-purity exact gates: invalid gaze `= 0`, non-normalised
gaze `= 0`, policy recompute mismatches `= 0`. Two full runs byte-identical
with shared SHA-256; production fingerprint unchanged
(`57b0bdab…c673`).

## 5. Hostile tests

The new module needs its own test file with D-PROC-1's twelve hostile cases
re-targeted at the gated predicate, plus:

13. a braking history (min speed delta `<= -0.10`) yields empty support even
    when net displacement exceeds `0.50m`;
14. a two-sample history yields empty support regardless of magnitude;
15. an active-continuation history (displacement `>= 0.50m`, no braking
    delta) yields support;
16. a post-redirection history aligns support with the NEWEST displacement
    bearing, not the stale pre-switch bearing;
17. history from a different reference epoch or carrier is invalidated
    before use.

## 6. Stop and authority

FAIL parks the observer-triggered response family with prejudice: the
mechanism failed under both the one-sample and the qualified three-sample
evidence gates. No predicate component, window, cadence or seed may be
adjusted; the fork returns to the user (the remaining routes are a different
response consumer shape or the decision-layer wall directly).

A miss ONLY on support/ordered-response counts while H stays within its
ceiling is reported as a **cadence finding** (evidence-gated response is too
slow to fire inside live windows), not a mechanism refutation — still FAIL,
still no tuning, but the write-up must say which of the two happened.

PASS proves private intent → embodied evidence → motion-qualified belief →
non-telepathic, non-oscillating response, with braking no longer mistaken for
commitment. It authorises at most one user fork: a D-PROC-2-shaped
selection/ecology design contract (Track A3 in `PROGRAMME.md`). It does not
authorise live wiring, TeamBrain changes, payoff, coach doctrine,
familiarity, communication, genes or evolution.

## 7. Frozen result

**STRICT FAIL — cadence finding, NOT a mechanism refutation.** Run 2026-07-24
on fresh seeds `90,000..90,186` (187 scanned, `<= 192`), 96/96 accepted, twice
byte-identical. Canonical report SHA-256:

```text
80a1a848b5426d47dec1ab0a9da51f8f00109a6060a61aac8221988c0302b748
```

Implementation:

* `src/ai/motionGatedIntentResponse.ts` derives the set-valued belief from the
  qualified three-sample motion history, then composes it with D-PROC-1's
  UNCHANGED occupancy-admissibility + cyclic reopening query;
* `tests/motionGatedIntentResponse.test.ts` holds the 17 hostile cases
  (D-PROC-1's twelve re-targeted + the five brake / two-sample / continuation /
  redirect-bearing / epoch cases);
* `scripts/probes/motion-gated-intent-reopening.ts` runs H/I/C with the S3-G1
  memory-guided gaze threaded through every arm.

Two gates missed; every other gate — including the crux — held:

```text
GATE                                          FROZEN      ACTUAL     VERDICT
jointly completed H/I/C states                >= 72       59         FAIL
C ordered response fingerprints               >= 56       50         FAIL
H held-exterior false reopenings              <= 4        2          PASS  (crux)
C non-empty embodied support                  >= 64       78         PASS
C - H response-fingerprint edge               >= 48       48         PASS
I response fingerprints                        = 0         0         PASS
C replacement progress >= 0.25m               >= 75%      50/57 87.7% PASS
C/I B-body separation >= 0.25m                >= 60%      55/57 96.5% PASS
non-oscillation cycles / max revisions        0 / <= 3    0 / 2      PASS
accepted states                                = 96       96         PASS
scanned seeds                                 <= 192      187        PASS
```

Every exact validity, privacy, RNG, intervention, admissibility and
frozen-candidate check was zero, and both I/C pre-reopening equalities were
96/96:

```text
schema / non-finite / perception-RNG failures        0 / 0 / 0
forbidden intervention changes                              0
duplicate-observation revisions                             0
admissibility / frozen-candidate violations           0 / 0
I/C pre-reopening physical / evidence equality      96 / 96 · 96 / 96
```

The three added S3-G1 gaze-purity gates also held exactly: invalid gaze `= 0`,
non-normalised gaze `= 0`, policy recompute mismatches `= 0`. Arm-completion
census across the 288 arms: 178 completed, 63 loose, 39 observer-unsupported,
8 dead-ball/restart; per-arm completion H 60 / I 59 / C 59, so 59 jointly.

**Why this is a cadence finding, not a refutation.** The one gate D-PROC-1
failed — held-exterior false reopening, `7/96` against `<= 4/96` — is now
`2/96`. The qualified three-sample motion-phase predicate did exactly what it
was posed to do: a held actor's residual braking motion no longer clears the
support rule, so B no longer responds to inertia it mistook for a run. The
signal-blind arm I fired zero responses; every response B did make progressed
(87.7%), separated its body from I (96.5%) and never oscillated (max 2
revisions). The mechanism — private intent → embodied evidence →
motion-qualified belief → non-telepathic, non-oscillating response — is intact.

Both failing counts trace to the SAME structural cost, exactly as §6 and the
handoff anticipated. Support cannot turn non-empty until three strictly-newer
gaze observations accumulate; at the scan cadence that consumes most of the
48-tick window before any response can fire, so among survivors only 50 reach
an ordered response in time (`< 56`). And the 48-tick window — pre-registered,
not adjustable — itself attrits joint completion from D-PROC-1's 76 (at 36
ticks) to 59, below the 72 floor, dominated by loose balls (63) and lost
observer support (39). H held its ceiling throughout, so per §6 this is a
**cadence finding** (evidence-gated response too slow to fire inside the live
window), with the completion shortfall its window-attrition companion — not a
mechanism refutation.

**Stop.** Per §6 the observer-triggered response family is parked; no predicate
component, window, cadence or seed may be adjusted, and D-PROC-2 is NOT
authorised. Because this is a cadence finding rather than a refutation, the
distinction matters for the commander: the response *works* but is too slow
within the live window, so the remaining routes are a differently-shaped
response consumer (one that can respond before a full three-sample history
exists, without reintroducing D-PROC-1's braking confusion) or taking the
qualified motion-evidence channel to the decision-layer wall directly. The
fork returns to the user; an executor may not author either route.
