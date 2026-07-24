# EDS — Embodied Decision Slice (design contract, commander-owned)

Status: **RATIFIED 2026-07-24 — the user chose EDS over A4-first and directed
`E0→E1→E2→E3, stop at E4 for play-test`. Stage contracts are pre-registered
individually by the autonomous session; this doc fixes scope, order, boundaries
and the ship gate. It is not itself a frozen experiment.**

Stage progress: **E0 pre-registered** ([`EDS-E0-OPTION-VALUATION.md`](EDS-E0-OPTION-VALUATION.md)).

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

E1  FLAGGED PHYSICS — the C1-B touch-cost curve behind an EDS flag,
    default OFF (fingerprint unchanged with flag off). Validation: re-run
    the C1-A2 ledger WITH the flag — H2 (receiver cost) must turn measurably
    non-flat, measured at the FIRST TOUCH (the C1-B lesson: final-control
    metrics are blind to it). This stage spends the C1-B redraw in its
    correct home.

E2  BOTH-SIDES PERCEPTION (dormant build, probe-bundled) — passer choice via
    E0 from perceived state; defender interception entry from perceived
    state; shared awareness trunk wiring. Probe A/B runs with E1+E2 flags ON
    together in probe worlds only. Includes a PERF gate (perceive at brain
    cadence, not per tick; budget derived from docs/perf/baseline.json).

E3  CO-EVOLUTION AUDIT — sealed evo runs, full bundle ON: §2 band (goals
    ±15%), route mix (±25%), the C1-B behavioural contract suite
    (width→crosses, stamina economy, market), no-strict-dominance (power
    usage must stay situation-dependent, not always-heavy — C1-A2 says
    always-heavy is what a cost-free world teaches), co-evo restoration
    (defence adapts across generations, the vision/positioning precedent),
    style diversification not collapsed.

E4  SHIP GATE — user play-test of the whole bundle. Ship = flags default ON
    + fingerprint/perf rebaseline recorded. Revert = the WHOLE bundle; no
    partial ship exists at any stage, in either direction.
```

Ablation probes (bundle minus one component) are authorised as E3
DIAGNOSTICS only — to name a failing component — never as partial ships.

## 4. Gate sources (named now, frozen per stage at pre-registration)

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
