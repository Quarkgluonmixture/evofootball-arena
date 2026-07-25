# EDS — Embodied Decision Slice (design contract, commander-owned)

Status: **RATIFIED 2026-07-24 — the user chose EDS over A4-first and directed
`E0→E1→E2→E3, stop at E4 for play-test`. Stage contracts are pre-registered
individually by the autonomous session; this doc fixes scope, order, boundaries
and the ship gate. It is not itself a frozen experiment.**

Stage progress: **E0 built + banked dormant; its two measurement gates
failed honestly (E0b: instrument contamination caught by the exact gate,
inversion unresolved) and E0b forbids a third re-pose — the reception-cost
question passes to E1 explicitly** ([`EDS-E0-OPTION-VALUATION.md`](EDS-E0-OPTION-VALUATION.md)).
**Commander re-scope 2026-07-24: E1 split into E1a (trustworthy first-touch
instrument) → E1b (flagged curve, validated by that instrument); E2 gains
the unseen-pricing amendment; E3 gains the always-heavy canary.** The
information-boundary decision inside E0 (receiver VELOCITY priceable as
physics, receiver TECHNIQUE reserved for A4 familiarity, neutral 0.5) is
endorsed as precedent.

**Commander ruling #6 (2026-07-25): E1a's I1 PASSED on unmodified gates
(instrument certified: 6.9–11.2× the sample floor, calibration ≤0.311pp
against a 2.0pp tolerance) — E1b is OPEN per the E1a contract's own frozen
§4. I2 is RETIRED, not redrawn: its question was settled by the
decomposition it logged (pressure-relief refuted, −0.23pp vs +1.63pp speed;
the E0b inversion does not reproduce at the clean adjudication), and the
properly-powered flat-vs-rising test is subsumed by E1b's OFF/ON contrast on
the I1 staging. The E1a probe verdict stays FAIL as emitted — retirement is
a disposition, never a rewrite. The misalign discovery (blind-side cost
rises with power) amends E1b's validation below.**

**Commander ruling #7 (2026-07-25): E1b ACCEPTED — PASS on every gate
([`EDS-E1B-TOUCH-COST-CURVE.md`](EDS-E1B-TOUCH-COST-CURVE.md) §6; the curve
lands within noise of its own arithmetic, carried ≥99.996% by the speed
channel, canary 6.53pp vs power's 21.2pp threat benefit — dominance is E3's
live risk, now with a number). The X2b mid-flight amendment is accepted and
its boundary codified in the ruling. E2 is split E2a → E2b (census priors
before the consumer — the instrument-first lesson, third application) with
drafting constraints in §3 below.**

Date: 2026-07-24

## 1. The measured case for a bundle

Three independent experiments measured the same law:

```text
S3b (2026-07-21)   one-sided live perception        → PAYS fail, reverted
vision-attr saga   one-sided read upgrade           → goal inflation ×4 reverts,
                                                      fixed only by co-evolved
                                                      two-sided reading
C1-B (2026-07-24)  one-sided touch cost             → game re-routes to long
                                                      balls (goals −15.4%,
                                                      longballs +28.2%), reverted
```

The live game is a finely tuned equilibrium. **Any single-sided entry breaks
it structurally; the only way in is a balanced bundle with co-evolution
room.** EDS is that bundle — the integration milestone named in
`PROGRAMME.md` §0.5, and the first moment VISION becomes visible in a real
match.

## 2. Scope of the first cut (v1)

IN — four components that hedge each other:

1. **Speed/time-aware pass evaluation** (C1-C's real home): candidates
   scored with flight time, corridor interception margin and receiver touch
   difficulty; each candidate at 2–3 power levels (C1-A substrate,
   dormant-ready).
2. **Honest touch cost** (C1-B's exact one-liner, in its correct home): hot
   balls cost the receiver; now the evaluator can SEE that cost before
   choosing.
3. **Perception-based pass choice** (the S3b redo): the passer reads its own
   `PerceptionSnapshot`, not truth.
4. **Perception-based defensive read** (the co-evolution partner): the
   interception decision reads perceived state through the same machinery.
   Attr wiring follows SUBSTRATE-MAP's ruling: a shared `awareness` trunk,
   attack/defence asymmetry left to other attrs — no one-sided reading attr,
   ever again.

OUT of v1, explicitly: one-touch decision (C5 — second cut, unless E3
evidence demands it), off-ball movement changes, TeamBrain refactor, live
D-PROC/D-MUT consumers, coach doctrine/familiarity, multi-target attention,
aerial work (C4). Feints remain a future observation, never a mechanic.

## 3. Stages (each gets its own pre-registered contract)

```text
E0  DORMANT EVALUATOR — a pure pass-option valuation reading flight time /
    interception margin / touch difficulty at 2–3 powers. Validation:
    preference order must reproduce the C1-A2 isolated ledger's measured
    outcomes (17.4pp risk spread), directional gates, zero live callers,
    fingerprint unchanged.

E1a INSTRUMENT FIRST (commander re-scope 2026-07-24, after E0/E0b measured
    their own instruments instead of the physics — three reception metrics
    currently contradict each other: final-control ≈0, raw-4-tick INVERTED,
    formula +4pp). Build a trustworthy first-touch measurement at the real
    `attemptFirstTouch` adjudication (event-level, never inferred from who
    owns the ball N ticks later), logging the TERM DECOMPOSITION per event
    (speed / pressure / misalign / technique inputs). Validation: (i) on
    synthetic controlled sweeps with pressure and misalign held, the
    instrument must reproduce the formula's own speed term where it provably
    exists — an instrument that cannot see known physics is broken; (ii) it
    must SETTLE the E0b inversion: attribute "heavier arrives cleaner"
    either to pressure-relief (faster ball ⇒ less closing time ⇒ lower
    pressure term at touch — a REAL confound the decomposition can isolate)
    or to contamination (it vanishes under the clean instrument); (iii)
    pure probe/logging, zero physics change, two-run determinism.

E1b FLAGGED PHYSICS — the C1-B touch-cost curve behind an EDS flag, default
    OFF (fingerprint unchanged with flag off). Validation with the E1a
    instrument: the receiver cost must turn measurably non-flat AT THE FIRST
    TOUCH, with the decomposition confirming the SPEED term is what moved.
    This stage spends the C1-B redraw in its correct home.

    ⭐ TWO-CHANNEL AMENDMENT (commander ruling #6, from I2's decomposition,
    2026-07-25): pace buys TWO real costs, not one — the formula's speed
    term AND a blind-side cost (misalign rose 0.100→0.348 with power: a
    faster ball arrives before the receiver completes its facing turn — the
    mechanism is real embodied timing; its I2 magnitude is inflated by
    pinned receivers that cannot turn, so gate on its DIRECTION never its
    size). E1b's decomposition gate is therefore: the cost increase must be
    carried by the speed and/or power-coupled misalign channels, with the
    PRESSURE channel bounded (pressure-relief is the refuted confound — it
    must not carry the increase). Drafting constraints for the stage
    contract: (a) the OFF/ON contrast runs on the I1 staging (real intended
    pass, power×distance sweep, same seeds both arms, I1-scale event counts
    — thousands per bucket, SE ≈ 0.5pp — pre-registered as a powered
    interval test per PROBE-CONTRACTS' equivalence/flatness type, never a
    point inequality); (b) contested-state numbers (I2-style staging) are
    diagnostics only, never gates; (c) the always-heavy canary below runs
    here unchanged. Note the vision link: the misalign term is 身体朝向
    already priced in the substrate — C5's one-touch/orientation craft has
    a real seat waiting.

E2  BOTH-SIDES PERCEPTION (dormant build, probe-bundled) — passer choice via
    E0 from perceived state; defender interception entry from perceived
    state; shared awareness trunk wiring. Probe A/B runs with E1+E2 flags ON
    together in probe worlds only. Includes a PERF gate (perceive at brain
    cadence, not per tick; budget derived from docs/perf/baseline.json).

    ⭐ DESIGN AMENDMENT (from E0's all-or-nothing finding, 2026-07-24):
    at awareness 0.8 observation does not blur the option set — it DELETES
    ~46% of it, wholesale per state, and specifically the long/progressive
    passes (unpriceable mean 21.7m vs priceable 16.8m). That is the concrete
    mechanism of S3b's route collapse (headers 6.39→4.05, cutbacks
    3.96→2.46). Therefore E2 MUST implement: **unseen ≠ unavailable —
    unpriceable options are priced at an honest global base-rate prior
    (population interception/touch rates at that distance band), never
    deleted, never truth-fallback** (a legacy-evaluator fallback for unseen
    targets would make not-looking informationally superior — worse than
    S3b). Note the substrate fact: retention at 0.8 is only ~0.85s, so
    stale-memory pricing has almost nothing to stand on; the base-rate prior
    is the honest fallback, and A4's doctrine/familiarity later SHARPEN
    these priors — exactly the layering §0.5 named. E2 gains an explicit
    route-mix gate derived from S3b's collapse numbers.

    ⭐ DRAFTING CONSTRAINTS (commander ruling #7, 2026-07-25). E2 splits:

    E2a CENSUS PRIORS + PRICING LAYER (the instrument-first lesson, third
        application — measure the input before building its consumer):
        (a) the base-rate prior table is CENSUS-DERIVED, never invented: a
        pre-registered census probe measures population interception /
        first-touch rates by distance band from the world itself, logs and
        SHAs the table, and commits it as data BEFORE any E2b A/B. The
        prior is infrastructure like the sampling budget — it may not be
        adjusted after A/B results, ever. (b) The pricing layer is
        validated on E0's own 120 banked states: the 55/120 unpriceable
        states must become 120/120 priced with ZERO options deleted for
        observability — the direct mechanism test of "unseen ≠ unavailable"
        — and prior calibration is an interval test against realized
        population rates, powered ex ante.

    E2b THE BOTH-SIDES A/B, consuming E2a's table: (c) the evaluator is
        E0's corridor pricing PLUS the touch-difficulty term made real by
        E1b's curve (consumed through the formula the E1a instrument
        certified), reading PERCEIVED state on BOTH sides — passer choice
        and defender interception entry through the same shared-awareness
        machinery (SUBSTRATE-MAP: no one-sided reading attr, ever). Report,
        never gate, the always-heavy rate under combined threat+touch
        pricing — dominance is E3's gate, but E2b hands it the number.
        (d) NOT-LOOKING MUST NOT WIN: across awareness arms on the same
        states, chosen-option quality must be monotone non-decreasing in
        awareness — a truth-fallback or a poisoned prior fails exactly
        here. (e) The route-mix gate: the perceived arm's chosen-option
        distance/type distribution must not reproduce the S3b collapse
        signature; band pre-registered as a powered interval test. (f) The
        PERF hard gate: perception at brain cadence (the substrate's own
        scan intervals), budget from docs/perf/baseline.json per
        PROBE-CONTRACTS §5.5. (g) X5-style reproduction gates against
        banked E0/E1b numbers wherever a staging is reused; interval
        predicates only; dormant throughout — default-OFF flags,
        fingerprint unchanged flags-off, zero live callers, no genes, no
        evolution.

E3  CO-EVOLUTION AUDIT — sealed evo runs, full bundle ON: §2 band (goals
    ±15%), route mix (±25%), the C1-B behavioural contract suite
    (width→crosses, stamina economy, market), no-strict-dominance (power
    usage must stay situation-dependent, not always-heavy — C1-A2 says
    always-heavy is what a cost-free world teaches), co-evo restoration
    (defence adapts across generations, the vision/positioning precedent),
    style diversification not collapsed.

    Canary registered from E0: in the zero-cost world the evaluator's
    per-state safest option was 1.15 in 52/52 — the evaluator correctly
    learned always-heavy where heavy is free. If AFTER E1b the dormant
    evaluator still prefers 1.15 near-universally, the curve is too weak to
    break dominance and E3 will fail no-strict-dominance; check this cheaply
    at E1b validation rather than discovering it in sealed evo runs.

E4  SHIP GATE — user play-test of the whole bundle. Ship = flags default ON
    + fingerprint/perf rebaseline recorded. Revert = the WHOLE bundle; no
    partial ship exists at any stage, in either direction.
```

Ablation probes (bundle minus one component) are authorised as E3
DIAGNOSTICS only — to name a failing component — never as partial ships.

## 4. Gate sources (named now, frozen per stage at pre-registration)

* Known substrate boundaries (registered 2026-07-24 by E1a, NOT touched in
  EDS v1): receptions at ≤6 m/s are free BY FIAT (`mechanics.ts:130` returns
  clean before any roll), and mid-speed loose balls often never reach an
  adjudication at all (M3 contact cushioning). All reception measurements —
  C1-A2, E0b, E1a — are structurally blind below 6 m/s and on unrolled loose
  balls; C5's future design must know both. Third registered fact (E1a-I2,
  2026-07-25): the substrate already prices blind-side receptions — misalign
  rises with power at the real adjudication, so orientation cost EXISTS as
  physics before any craft layer touches it;
* C1-A2 ledger: SHA `7e0ff4d5…257b` numbers as E0/E1 references;
* C1-B audit: the §2 band values, the behavioural suite, the re-route
  signature (long balls +28.2%) as the E3 canary;
* S3b post-mortem: awareness 0.2→0.8 mediator numbers as E2 references;
* perf: `docs/perf/baseline.json` + PROBE-CONTRACTS' hard gate;
* every stage: two-run determinism, purity audits, no `src/**` beyond the
  stage's declared seat, explicit-path staging.

## 5. Stop rules

* Any stage FAIL → the queue stops, the failing stage names its axis, the
  fork returns to the commander. No stage may be rescued by tuning a
  neighbouring stage's parameters.
* E3 band break → ablation diagnostics name the component; the commander
  redraws THAT component's contract; the bundle does not ship partially in
  the meantime.
* E4 user verdict is final and un-appealable this cut; a revert keeps E0/E1
  dormant assets and returns the design to the commander (revert→reframe
  discipline).

## 6. What EDS unlocks on PASS

The first live football where players act on what they SEE, weigh how hard
to hit a pass, and pay real costs for heavy balls — visible in normal
matches. Downstream: Track D4 discovery archive and the "understand" UI
stop being fiction; A4 (doctrine/familiarity priors) gains a LIVE testbed
where latency actually binds; C5/C2/C4 land on a substrate whose costs are
real. A4-first was considered and parked: its causal seat (latency priors)
is only measurable against live coordination, which does not exist until
EDS ships.
