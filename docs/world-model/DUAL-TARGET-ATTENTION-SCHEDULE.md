# S3-G2 — Dual-target interleaved attention

Status: **PRE-REGISTERED — no run yet.** (Drafted by the autonomous session
under `PROGRAMME.md` §0.5's ratified ruling: the three-body direction is entered
via S3-G2 before D-TRI-0.)

Date: 2026-07-24

## 1. Why this step, and why before D-TRI-0

D-MUT-0 passed with two bodies and located its own next constraint: all 15
unresolved states were mutual-staleness safe-fails — a player simply never
accumulated qualified evidence on its partner inside the window. S3-G1 banked
**single**-target memory-guided attention and explicitly did not authorise
"multi-target attention scheduling". A three-body rotation requires every player
to track **two** moving partners with one pair of eyes, so attention scheduling
is the binding constraint before any rotation shape can be honest.

> With one gaze and the existing scan cadence, can an observer keep a qualified
> three-sample motion history alive on TWO moving teammates at once — where
> attending to only one starves the other?

## 2. What the geometry already fixes (analytic, before any run)

At awareness `0.8` the honest visual field is `2·acos(-0.6) = 253.74°`, leaving a
`106.26°` rear blind wedge, and the scan interval is `round(15 − 0.8·9) = 8`
ticks — exactly **6 scheduled scans in the banked 48-tick window**.

Two consequences that shape this contract and are not up for negotiation:

1. **At most one target can ever be out of field.** Two bodies more than
   `126.87°` apart in bearing cannot both sit inside one aim's field; two bodies
   both inside the `106.26°` rear wedge cannot be more than `106.26°` apart.
   So S3-G1's "both actors behind the body" acceptance is *geometrically
   impossible* to combine with "one gaze cannot cover both". Attention
   scheduling is therefore NOT a cone-coverage problem here.
2. **It is a cadence problem with zero slack.** Six scans, two targets, strict
   alternation ⇒ exactly **3 fresh observations each** — precisely the minimum
   the banked qualified motion predicate needs (three strictly-newer samples).
   Every single lost scan breaks support on that target.

That is the honest question this experiment tests, and it can genuinely fail.

## 3. Minimal authority

Nothing new in `src/**`. Consumed unchanged: `chooseAttentionGaze`
(S3-G1), `perceiveSnapshot`/`capturePerceptionTruth` (S3a/S3-G0),
`appendObservedMotionSample` + `buildMotionGatedBelief` (D-PROC-1MG/1G). The
alternation schedule is **probe-owned**, exactly as S3-G1's relevance target was
probe-supplied: it is an input to the policy, never an output of it, and it may
read only the tick index — never truth, never the other player's state.

Forbidden, verbatim from S3-G1 §3: world truth or another player's memory in the
policy path, private intent/action/target, coach doctrine, familiarity, team
messages, future observations, any Match/RNG mutation, any live consumer. The
truth-aimed ceiling arm is auditor-owned diagnostics and can never gate a PASS.

## 4. Frozen real-state protocol

Fresh seeds `94,000..94,511` (max 512 — the dual-actor geometry in §4.1 is
rarer than S3-G1's single-actor one; at most one accepted state per seed) until
**96** states are accepted. Matches run 240s with live brains; all outfield
players perceive every tick at awareness `0.8` with per-player memories. Sample
once per simulated second after 10 seconds, while play is live and at least six
seconds from an administrative boundary.

### 4.1 Acceptance

Accept the first (observer, A1, A2) triple of distinct same-team non-goalkeepers,
ordered by gid, such that at the sampled tick:

* both actors' speed is within `[0.25, 0.50]` (S3-G1 verbatim);
* both observer–actor distances are within `(5, 30]` (S3-G1 verbatim);
* **the two actors' bearings from the observer are at least `130°` apart** —
  above the `126.87°` field half-angle, so no single aim can hold both (this
  replaces S3-G1's "behind the body" clause, which §2.1 proves incompatible);
* **at least one actor is outside the unchanged body-facing field**
  (`dot(observer.bodyDir, dir(observer→actor)) < -0.60`), so the body-facing
  baseline is genuinely deficient for at least one target;
* the observer's memory holds a fact for BOTH actors with `ageTicks >= 1`;
* both continued-run targets `actor.pos + norm(actor.vel) * 6` stay at least 2m
  inside the pitch;
* acceptance reads current geometry and current memory only, never an outcome.

Freeze a clone of the match, the observer memory and the acceptance snapshot.
Pin only the two actors: `MoveToPoint` at their continued-run targets with
infinite decision timers. The observer and everyone else stay live.

### 4.2 Record once, replay four arms

Gaze never touches physics, so step the frozen clone 48 ticks recording full
truth after every step, audit the recording immutable, and replay every arm
against it with an independent clone of the frozen memory:

```text
B — gaze = null (unchanged body-facing path)
S — single-target memory-guided at A1 only (the banked S3-G1 behaviour)
I — INTERLEAVED: the probe-owned schedule supplies A1 for ticks 1–8, A2 for
    9–16, alternating every 8 ticks (the banked scan interval); the gaze at
    tick i is chooseAttentionGaze applied to the snapshot of tick i-1 (tick 1
    uses the frozen acceptance snapshot) — the same one-tick reflex latency
T — truth-aimed dual ceiling: aims at the true position of the SAME scheduled
    target as I (diagnostic only; removes stale-memory misaim)
```

A fresh observation of a target is a fact for that target whose `observedTick`
strictly exceeds the freeze tick and every previously counted tick for that
target in that arm.

Qualified support per target is the UNCHANGED `buildMotionGatedBelief` over that
target's observed-motion history, with the observer's own team-mate hypothesis
set generated exactly as D-PROC-1G generated it.

A state aborts (auditor truth-reads only) when the match finishes, play leaves
`playing`, any of the three is sent off or re-rostered, a pinned actor action
mutates, or a true observer–actor distance leaves `(4, visual range]` at any
recorded tick.

## 5. Frozen gates

### Exact validity

```text
accepted states                                         = 96
scanned seeds                                          <= 512
invalid/rejected gaze reaching perceiveSnapshot          = 0   (every arm)
non-normalised stored gaze                               = 0   (every arm)
perception RNG changes (acceptance loop and arms)        = 0
recorded-truth mutation across arm replays               = 0
policy recompute mismatches from logged snapshots        = 0   (S and I arms)
non-finite observation fields                            = 0
two full runs byte-identical (shared SHA-256)            = required
production fingerprint 57b0bdab…c673                     unchanged
```

### Completion

```text
jointly completed windows                              >= 72 / 96
```

### Channel validity (diagnostic arm)

```text
T arm: >= 3 fresh observations of BOTH targets         >= 95% of completed
```

Miss ⇒ **CHANNEL-INVALID**, not a policy FAIL: six scans cannot carry two
histories even under perfect aiming. No envelope, cadence or window may then be
tuned — the finding is that the channel itself is the wall.

### Mechanism

```text
G1  I arm: >= 3 fresh observations of BOTH targets     >= 80% of completed
G2  I arm: qualified support non-empty for BOTH        >= 60% of completed
G3  S arm: >= 3 fresh observations of the UNATTENDED
    target (A2)                                        <= 50% of completed
G4  I fresh count on A2 >= S fresh count on A2         >= 95% of completed
G5  I fresh count on A2 >  S fresh count on A2         >= 50% of completed
G6  I fresh count on A1 <  S fresh count on A1         >= 50% of completed
```

Derivations, from banked numbers only:

* **G1 = 80%.** S3-G1's M arm delivered 6/6/6 fresh observations (min = mean =
  max) in 87/87 completed windows — the cadence itself is deterministic. Strict
  alternation halves that to exactly 3 per target, i.e. the predicate's minimum
  with zero slack, so a 95% gate would be dishonest while 50% would be vacuous
  against a deterministic channel.
* **G2 = 60%.** D-PROC-1MG banked 100% qualified support under 8-tick sampling
  of one target; D-PROC-1G measured 78/96 ≈ 81% in live windows. Requiring it
  simultaneously on two targets prices at roughly `0.81² ≈ 0.66`; 60% sits just
  below that without being vacuous.
* **G3 = 50%** is S3-G1's B-arm ceiling verbatim, reused as the non-vacuity
  tooth: if attending only to A1 already keeps A2's history alive, dual
  scheduling is not needed and the premise is refuted — not a licence to widen
  the bearing separation until A2 looks starved.
* **G4/G5** are S3-G1's paired-comparison gates verbatim.
* **G6** is the honest cost side: attention is scarce, so splitting it must
  measurably hurt the attended target. If it does not, the "scheduling" framing
  is wrong and the result is a premise FAIL rather than a free lunch.

Diagnostics without gates: per-arm per-target fresh-count distributions, ball
staleness per arm (the cost of looking away from the ball twice over), memory
ages at freeze, support-onset tick per target, abort census, T-versus-I gap.

## 6. Hostile tests

No new `src` module ⇒ no new unit test is expected; the probe carries its
audits. Additionally asserted inside the probe: the I arm's gaze sequence is
recomputable from its own logged snapshots and its own schedule alone (S3-G1
audit 8, per target), and the recorded truth is byte-identical before and after
every arm replay.

## 7. Stop and authority

FAIL parks dual-target attention scheduling and **blocks D-TRI-0**: a three-body
rotation in which each player must read two partners cannot be honest if one pair
of eyes cannot sustain two histories. It may not be rescued by widening the cone,
extending range or retention, shortening the scan interval, adding
extrapolation, re-aiming within a tick, letting truth/doctrine/familiarity steer
the aim, or by relaxing the 130° separation. The surviving routes then return to
the user: A4 relevance selection first (choose which ONE partner deserves the
eyes), or a three-body shape in which only one player must read two others.

CHANNEL-INVALID blocks the same work for the opposite reason, and equally
forbids envelope tuning.

PASS banks exactly one capability:

```text
one gaze + a probe-owned alternation schedule
→ two simultaneously live observed-motion histories
→ qualified support on two partners at once
```

and authorises exactly one continuation: **D-TRI-0**, the three-body
rotation-shaped mutual response, whose gates derive from D-MUT-0's banked
numbers. It does not authorise relevance selection (who deserves the eyes),
attention priors, coach doctrine, familiarity, a live consumer, payoff, genes or
evolution.
