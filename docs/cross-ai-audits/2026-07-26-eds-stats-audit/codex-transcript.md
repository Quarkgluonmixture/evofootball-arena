Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
[1mworkdir:[0m /Users/jamie/Documents/Promptfoo/evofootball-arena
[1mmodel:[0m gpt-5.6-sol
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m read-only
[1mreasoning effort:[0m xhigh
[1mreasoning summaries:[0m none
[1msession id:[0m 019f9f3b-baa5-7412-a501-658c0f1e1cf2
--------
[36muser[0m
You are a senior experimental statistician and research-methodology reviewer,
auditing the experiment programme of a deterministic football simulation
(TypeScript, seeded RNG, headless-reproducible).

CONTEXT
The repo runs a pre-registered experiment chain for a "world model" upgrade:
perception, pass-choice evaluators, censuses of success/value tables measured
by forking the deterministic sim ("fork-and-force"), calibration gates,
paired same-seed A/B probes, and sealed evolution audits. The governing
documents are:

- docs/world-model/PROGRAMME.md          (the operational log: rulings, queue)
- docs/world-model/EMBODIED-DECISION-SLICE.md   (design contract)
- docs/world-model/EDS-*.md              (per-stage pre-registered contracts,
                                          each with frozen gates + frozen results)
- docs/PROBE-CONTRACTS.md                (the gate-design discipline)

Numbers in "FROZEN RESULT" sections are real measured outputs. The chain is
long (E0 → E5d); read as much of it as you need, prioritising the frozen
gates and frozen results.

TASK
Adversarial audit of the STATISTICS and the GATE DESIGN. There is no
predefined answer — find what you find; it is fine to disagree with the
programme's own self-assessments. Hunt for:
- statistical methodology errors (power, error rates, dependence structure,
  selection effects, calibration methodology, multiple testing);
- gate-design flaws (predicates that cannot answer their question, gates
  that pass/fail for the wrong reason, missing gates);
- confounds or unjustified inferences in the written conclusions;
- places where a number is trusted beyond what its measurement supports.

Include at least one finding that a typical first-read reviewer would miss.

OUTPUT
A findings report, ranked by severity. For each finding: the claim, the
document/section it concerns (cite file + section heading), why it is a
problem, and what a fix would look like. Be concrete and quantitative where
possible. End with the three findings you consider most decision-relevant
for whether this engine should ship to live players.

[2m2026-07-26T16:22:00.077908Z[0m [31mERROR[0m [2mrmcp::transport::worker[0m[2m:[0m worker quit with fatal: Transport channel closed, when UnexpectedServerResponse("HTTP 401: {\"error\":\"unauthorized\",\"message\":\"A valid Bearer API key is required.\"}")
[35m[3mcodex[0m[0m
I’ll audit the frozen gates and results stage by stage, then trace any conclusions back to what the estimands and sampling design actually support. I’ll pay special attention to same-seed dependence, adaptive stage selection, calibration targets, and gates whose logical predicates do not match the claimed question.
  [36m→[0m Map programme documents, stage contracts, frozen gates, and frozen results
  [2m•[0m [2mAudit estimands, sampling/dependence, calibration, multiplicity, and selection effects[0m
  [2m•[0m [2mCross-check the most serious findings quantitatively against reported numbers and code where useful[0m
  [2m•[0m [2mWrite severity-ranked findings and identify the top three ship decisions[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "pwd && rg --files -g 'AGENTS.md' -g 'docs/world-model/*.md' -g 'docs/PROBE-CONTRACTS.md' | sort"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 504ms:[0m
docs/PROBE-CONTRACTS.md
docs/world-model/ACTIVE-GAZE-FOUNDATION.md
docs/world-model/ALTERNATIVE-ACTION-TRANSITION-COVERAGE.md
docs/world-model/ARRIVAL-READINESS-RESIDUAL-AUDIT.md
docs/world-model/B1D-FIXED-RENDEZVOUS.md
docs/world-model/BALL-CONTROL.md
docs/world-model/CARRY-AFFORDANCE-CENSUS.md
docs/world-model/CARRY-AFFORDANCE-INSET-FAILURE-AUDIT.md
docs/world-model/CARRY-DIRECTION-AFFORDANCE.md
docs/world-model/CONTROL-CONSUMER-CENSUS.md
docs/world-model/CONTROLLED-BALL-COUPLING.md
docs/world-model/COUNTERFACTUAL-ORACLE-V2.md
docs/world-model/COUPLED-ARRIVAL-CONTACT-RACE.md
docs/world-model/COUPLED-RACE-RNG-ROBUSTNESS.md
docs/world-model/COVERAGE-GAPS.md
docs/world-model/DECENTRALISED-DEFENSIVE-COVER-HANDOFF.md
docs/world-model/DECENTRALISED-DEFENSIVE-DILEMMA-LAB.md
docs/world-model/DECENTRALISED-DEFENSIVE-HANDOVER.md
docs/world-model/DECENTRALISED-DEFENSIVE-INTENT-NEGOTIATION.md
docs/world-model/DECENTRALISED-DEFENSIVE-PASS-CORRIDOR.md
docs/world-model/DECENTRALISED-DEFENSIVE-ROTATION-PROCESS.md
docs/world-model/DECENTRALISED-OFFER-LOOP-LAB.md
docs/world-model/DECENTRALISED-PREFERENCE-LEARNABILITY.md
docs/world-model/DUAL-TARGET-ATTENTION-SCHEDULE.md
docs/world-model/EDS-E0-OPTION-VALUATION.md
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md
docs/world-model/EDS-E2A-CENSUS-PRIORS.md
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md
docs/world-model/EDS-E5-VALUE-AXIS.md
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md
docs/world-model/EDS-E5D-PHASE1.md
docs/world-model/EMBODIED-DECISION-SLICE.md
docs/world-model/EMBODIED-INTENT-REOPENING.md
docs/world-model/EMBODIED-OFFER-REACTION-SURFACE.md
docs/world-model/EMERGENT-CARRY-TRAJECTORY-CENSUS.md
docs/world-model/EMERGENT-CENTRAL-ARRIVAL-CENSUS.md
docs/world-model/EMERGENT-OVERLAP-TRAJECTORY-CENSUS.md
docs/world-model/EMERGENT-PASS-RETURN-CENSUS.md
docs/world-model/EMERGENT-REENTRY.md
docs/world-model/FACTORIZED-TRANSITION-ESTIMATOR.md
docs/world-model/FOUNDATION.md
docs/world-model/GAZE-SUPPORTED-MOTION-EVIDENCE.md
docs/world-model/HANDOFF-D-TRI-0.md
docs/world-model/INTERVENTION-SUPPORTED-TRANSITION-ESTIMATOR.md
docs/world-model/MOTION-GATED-INTENT-REOPENING.md
docs/world-model/MUTUAL-MOTION-GATED-RESPONSE.md
docs/world-model/OBSERVER-GROUNDED-ARRIVAL-CONTACT.md
docs/world-model/OBSERVER-LOCAL-ATTENTION-POLICY.md
docs/world-model/OFFBALL-HANDOFF-FAILURE-AUDIT.md
docs/world-model/OFFBALL-MAINLINE-DECISION.md
docs/world-model/OFFBALL-MOVE-FEASIBILITY.md
docs/world-model/OFFBALL-MOVE-PRIMITIVE.md
docs/world-model/OFFBALL-OFFER-COMMITMENT-CENSUS.md
docs/world-model/OFFBALL-OFFER-COMMITMENTS.md
docs/world-model/OFFBALL-OFFER-FIELD-CENSUS.md
docs/world-model/OFFBALL-OFFER-FIELD.md
docs/world-model/OFFBALL-OFFER-OBSERVER-CALIBRATION.md
docs/world-model/OFFBALL-OFFER-PORTFOLIO-CENSUS.md
docs/world-model/OFFBALL-OFFER-PORTFOLIO-INTERVENTION.md
docs/world-model/OFFBALL-OFFER-PORTFOLIO.md
docs/world-model/OFFBALL-OFFER-STATE-ANATOMY.md
docs/world-model/OFFBALL-OFFER-TO-RECEPTION.md
docs/world-model/OFFBALL-OFFER-TRANSITION-CALIBRATION.md
docs/world-model/OFFBALL-PASS-HANDOFF-CONTINUATION.md
docs/world-model/PAIRED-ACTION-TRANSITION-RISK.md
docs/world-model/PASS-POWER-SLICE.md
docs/world-model/PRIVATE-INTENT-OBSERVATION-PROTOCOL.md
docs/world-model/PROCESS-DISTILLED-CORRIDOR-ESTIMATOR.md
docs/world-model/PROCESS-DISTILLED-OBSERVER-ESTIMATOR.md
docs/world-model/PROGRAMME.md
docs/world-model/RELATIVE-AFFORDANCE-FOUNDATION.md
docs/world-model/RELATIVE-POINT-FAILURE-AUDIT.md
docs/world-model/RELATIVE-POINT-MOVEMENT-FEASIBILITY.md
docs/world-model/RELATIVE-POINT-MOVEMENT-PRIMITIVE.md
docs/world-model/REPLICATED-POLICY-TRANSITION-DISTRIBUTION.md
docs/world-model/S7C-THREAT-POTENTIAL.md
docs/world-model/S7D-FLIGHT-INTERCEPTION.md
docs/world-model/S7E-REPLICATED-ORACLE-CEILING.md
docs/world-model/S7E-TRANSITION-COMPOSITION.md
docs/world-model/SECURED-BALL-ACCESS-CENSUS.md
docs/world-model/TEAM-TASK-OCCUPANCY-FOUNDATION.md
docs/world-model/TEMPORAL-MOTION-EVIDENCE.md
docs/world-model/THREE-BODY-CHAIN-RESPONSE.md
docs/world-model/TRANSITION-CALIBRATION-FAILURE-AUDIT.md
docs/world-model/TRANSITION-ESTIMATOR-PROGRAMME.md
docs/world-model/TRIADIC-MOTION-GATED-ROTATION.md
docs/world-model/WORLD-MODEL-NEXT-AUTHORITY.md

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "wc -l docs/PROBE-CONTRACTS.md docs/world-model/PROGRAMME.md docs/world-model/EMBODIED-DECISION-SLICE.md docs/world-model/EDS-*.md && rg -n '"'^#{1,4} '"' docs/PROBE-CONTRACTS.md docs/world-model/PROGRAMME.md docs/world-model/EMBODIED-DECISION-SLICE.md docs/world-model/EDS-*.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     340 docs/PROBE-CONTRACTS.md
    1421 docs/world-model/PROGRAMME.md
     436 docs/world-model/EMBODIED-DECISION-SLICE.md
     194 docs/world-model/EDS-E0-OPTION-VALUATION.md
     150 docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md
     278 docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md
     358 docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md
     319 docs/world-model/EDS-E2A-CENSUS-PRIORS.md
     316 docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md
     279 docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md
     332 docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md
     212 docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md
     501 docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md
     432 docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md
     249 docs/world-model/EDS-E3R2-NARROW-REAUDIT.md
     570 docs/world-model/EDS-E5-VALUE-AXIS.md
     426 docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md
     302 docs/world-model/EDS-E5D-ATTEMPT-VALUE.md
     374 docs/world-model/EDS-E5D-PHASE1.md
    7489 total
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:1:# EDS E2a — Census priors and the pricing layer
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:11:## 1. The problem E2a exists to solve
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:26:### 1.1 Discovery finding that shapes the design (pre-registration input)
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:41:## 2. Authorised seat
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:55:## 3. The census
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:85:## 4. Frozen gates
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:87:### EXACT
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:108:### P1 — COMPLETENESS: nothing is deleted for observability
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:117:### P2 — CALIBRATION: the prior generalises (interval test, powered ex ante)
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:132:### P3 — NOT-LOOKING MUST NOT WIN (E2a's weak form, deterministic)
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:144:### P4 — BAND REALITY (routing rule decided in advance, NOT a fail)
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:157:## 5. Stop rules
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:175:## 6. What E2a hands E2b
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:188:## 7. FROZEN RESULT — P3 FAILS; the census itself is sound (2026-07-25)
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:208:### The census
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:235:### P4 — the routing rule fired on the wrong statistic (finding, not a fail)
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:254:### P3 — the gate that fired, and what it actually caught
docs/world-model/EDS-E2A-CENSUS-PRIORS.md:308:### What is banked either way
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:1:# EDS E1a — The first-touch instrument
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:11:## 1. Why an instrument comes before any curve
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:28:## 2. Authorised seat — logging only, zero physics
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:40:## 3. Frozen gates
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:42:### Exact validity (zero-behaviour proof)
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:54:### I1 — the instrument must see known physics
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:69:### I2 — the instrument must SETTLE the E0b inversion
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:85:## 4. Stop rules
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:98:## 5. E1a INTERIM — instrument built and behaviour-proven; I1's staging blocked (2026-07-24)
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:104:### Established
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:118:### Two structural findings about where reception can be measured at all
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:140:### Status
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:146:## 6. FROZEN RESULT — I1 PASSES, I2 DOES NOT DECIDE (2026-07-24, re-staged run)
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:155:### The re-stage
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:173:### I1 — the instrument recovers the formula's own speed term
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:190:### Exact validity
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:199:### I2 — the sample cannot settle the inversion
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:235:### Where this leaves E1
docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md:249:## 7. Disposition — commander ruling #6 (2026-07-25)
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:1:# EDS E0b — Option valuation, measured at the first touch
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:10:## 1. What is being redrawn, and what is NOT
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:27:## 2. The two measurement changes
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:43:## 3. Frozen gates
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:72:## 4. Stop rules
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:88:## 5. E0b RESULT — FAIL, and the stop rule binds (2026-07-24)
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:104:### The reproduction gate caught an instrumentation error of mine
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:114:### And the raw metric came out INVERTED, not merely different
docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md:124:### Verdict: the reception-cost question leaves E0 unsettled, by rule
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:1:# EDS E1b — The flagged touch-cost curve
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:11:## 1. What this stage is
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:25:## 2. The change (C1-B §12.2 verbatim, behind a flag)
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:39:### 2.1 Authorised seat — nothing outside this list
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:59:## 3. The measurement
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:70:### 3.1 Analytic predictions (the gates are derived from these)
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:83:### 3.2 Sample size, computed BEFORE the run
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:101:## 4. Frozen gates
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:103:### EXACT — the flag must be a flag
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:124:### 4.1 AMENDMENT to X2b, disclosed before the experiment ran (2026-07-25)
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:143:### F1 — FIRES: the curve reaches the real adjudication
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:157:### F2 — the decomposition (ruling #6's two-channel amendment)
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:176:### F3 — the always-heavy canary (E3's question, checked cheaply here)
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:204:### Diagnostics — reported, never gates (ruling #6 (b))
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:212:## 5. Stop rules
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:232:## 6. FROZEN RESULT — PASS on every gate (2026-07-25)
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:241:### Exact validity
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:261:### F1 — the curve lands exactly where the arithmetic said it would
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:285:### F2 — the increase is carried by the speed channel alone
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:301:### F3 — the always-heavy canary
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:325:### Diagnostics — reported, NEVER gates
docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md:347:### Verdict
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:1:# EDS E2a-2 — The option-space census (counterfactual)
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:10:## 1. Why the census is being re-posed
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:26:### 1.1 Scope boundary, registered rather than glossed
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:37:## 2. Authorised seat
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:59:## 3. The measurement
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:84:## 4. Frozen gates
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:86:### EXACT
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:105:### P1 — COMPLETENESS
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:115:### P2 — CALIBRATION (interval test, powered ex ante)
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:131:### Reported, never gated (ruling #8 (j))
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:149:### Pricing classes (ruling #8 (k), settled by the commander — implemented, not decided here)
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:162:## 5. Stop rules
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:178:## 6. FROZEN RESULT — PASS; the selection bias was 13pp, not 0.18pp (2026-07-25)
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:197:### The option-space table
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:216:### R1 — the chooser lift, and how big the selection bias really was
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:245:### R2 — what a remembered distance is worth (the re-keyed axis)
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:263:### R3/R4/R5 — the honest remainders
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:279:### Disclosures
docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md:307:### What E2b inherits
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:1:# EDS E5d — The attempt-value axis (one measured quantity)
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:11:## 1. What is being removed
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:37:## 2. What is measured
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:39:### 2.1 Phase 0 — the free judgment (this contract's live half)
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:69:### 2.2 Phase 1 — CONDITIONAL, drafted but not authorised by this run
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:79:## 3. Authorised seat (Phase 0)
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:88:## 4. Frozen gates — Phase 0
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:90:### EXACT
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:121:### C1 — COVERAGE
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:129:### C2 — HELD-OUT CALIBRATION (interval test)
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:140:### C3 — THE AXIS IS A MEASUREMENT
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:148:### R — **THE RE-RANK JUDGMENT** (the thing Phase 0 exists to decide)
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:170:### Reported, never gated
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:185:## 5. Stop rules
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:199:## 6. Result
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:201:### 6.1 Phase 0 — RUN 2026-07-26: **THE AXIS RE-RANKS, and Phase 0 is still non-PASS**
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:218:#### The judgment Phase 0 existed to make: **it re-ranks, decisively**
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:237:#### ⛔ X6 FAILED — reported as it fired, and NOT re-amended
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:277:#### ⛔ C3's calibration FAILED, narrowly, and it is a Phase-1 design fact
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:293:#### Disposition
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:1:# EDS E3R2 — the narrow re-audit: CE2R + X5R2
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:17:## 1. Scope — narrow, by ruling
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:33:## 2. X5R2 — what "perception is PULL" is, in code
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:70:## 3. Frozen gates
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:72:### X5R2 — the reconstruction must BE the perception
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:98:### CE2R — style diversity, gated ecologically
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:128:## 4. Stop rules
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:141:## 5. RESULT — ✅ PASS (2026-07-26). Pull perception is the same perception; the ecology keeps its variety
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:148:### 5.1 X5R2 — the reconstruction IS the perception
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:190:### 5.2 CE2R — style diversity holds, and E3R's 0.58 was the low tail
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:234:### 5.3 Disclosures
docs/world-model/EDS-E5-VALUE-AXIS.md:1:# EDS E5 — The value axis (the other half of the decision)
docs/world-model/EDS-E5-VALUE-AXIS.md:10:## 1. Why this stage exists
docs/world-model/EDS-E5-VALUE-AXIS.md:43:## 2. What is measured
docs/world-model/EDS-E5-VALUE-AXIS.md:45:### 2.1 E5a — the V-census
docs/world-model/EDS-E5-VALUE-AXIS.md:119:### 2.2 E5b — the live composition and the narrow audit
docs/world-model/EDS-E5-VALUE-AXIS.md:129:## 3. Authorised seat
docs/world-model/EDS-E5-VALUE-AXIS.md:141:## 4. Frozen gates — E5a
docs/world-model/EDS-E5-VALUE-AXIS.md:143:### EXACT
docs/world-model/EDS-E5-VALUE-AXIS.md:161:### V1 — COVERAGE
docs/world-model/EDS-E5-VALUE-AXIS.md:173:### V2 — DISCRIMINATION (interval test, powered ex ante)
docs/world-model/EDS-E5-VALUE-AXIS.md:185:### V3 — HELD-OUT CALIBRATION (interval test)
docs/world-model/EDS-E5-VALUE-AXIS.md:192:### V4 — COMPOSITION CALIBRATION (the anti-hand-weight gate)
docs/world-model/EDS-E5-VALUE-AXIS.md:226:### Reported, never gated (E5a)
docs/world-model/EDS-E5-VALUE-AXIS.md:245:## 5. Frozen gates — E5b
docs/world-model/EDS-E5-VALUE-AXIS.md:247:### EXACT
docs/world-model/EDS-E5-VALUE-AXIS.md:262:### §2 EQUILIBRIUM BAND (C1 §4 verbatim, as every stage since)
docs/world-model/EDS-E5-VALUE-AXIS.md:274:### NO-STRICT-DOMINANCE
docs/world-model/EDS-E5-VALUE-AXIS.md:285:### H — THE CENTRAL HYPOTHESIS (ruling #15 (c))
docs/world-model/EDS-E5-VALUE-AXIS.md:322:### X5V — PERF
docs/world-model/EDS-E5-VALUE-AXIS.md:331:## 6. Stop rules
docs/world-model/EDS-E5-VALUE-AXIS.md:354:## 7. Result
docs/world-model/EDS-E5-VALUE-AXIS.md:356:### 7.1 E5a — RUN 2026-07-26, PASS on every gate
docs/world-model/EDS-E5-VALUE-AXIS.md:464:### 7.2 E5b — RUN 2026-07-26: **30 of 32 gates PASS, the CENTRAL HYPOTHESIS FAILS. Queue stops; the fork is the commander's**
docs/world-model/EDS-E5-VALUE-AXIS.md:492:#### H — the central hypothesis, over 24 seasons, three paired arms
docs/world-model/EDS-E5-VALUE-AXIS.md:531:#### Why, as far as the evidence supports, and no further
docs/world-model/EDS-E5-VALUE-AXIS.md:553:#### Reported, never gated
docs/world-model/EDS-E5-VALUE-AXIS.md:564:#### Disposition
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:1:# EDS E5c — The attribution experiment (HU vs HM)
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:11:## 1. The question, and why the last result cannot answer it
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:34:## 2. What is measured
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:36:### 2.1 (a) The HU test — a targeted census top-up
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:71:### 2.2 (b) The HM test — is the table STATE-blind or sample-starved?
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:110:## 3. Authorised seat
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:122:## 4. Frozen gates — (a) the HU top-up
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:124:### EXACT
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:142:### U4 — COVERAGE
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:150:### U5 — HELD-OUT CALIBRATION (interval test)
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:159:### U6 — THE E5b RE-RUN, GATES VERBATIM
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:178:### Reported, never gated (a)
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:187:## 5. Frozen gates — (b) the HM test
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:189:### EXACT
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:199:### M1 — COVERAGE
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:208:### M2 — THE STATE-BLINDNESS TEST (interval test, powered ex ante)
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:221:### Reported, never gated (b)
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:233:## 6. Stop rules and what each outcome means
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:252:## 7. Result
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:254:### 7.1 (a) The HU top-up — PASS on every gate, and **HU REFUTED** by the re-run
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:281:#### ⚠️ U1 surfaced a DEFECT IN E5a, and this is its disclosure
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:315:#### U6 — the E5b re-run, gates verbatim: **HU REFUTED**
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:350:### 7.2 (b) The HM state-blindness test — **HM REFUTED**, narrowly, with the direction right
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:384:### 7.3 Attribution — **NEITHER fires, and the third cause is visible in these numbers**
docs/world-model/EDS-E5D-PHASE1.md:1:# EDS E5d Phase 1 — The attempt axis, censused where it is deployed
docs/world-model/EDS-E5D-PHASE1.md:10:## 1. What Phase 0 settled and what it left
docs/world-model/EDS-E5D-PHASE1.md:23:## 2. What is measured
docs/world-model/EDS-E5D-PHASE1.md:25:### 2.1 The population (constraint a)
docs/world-model/EDS-E5D-PHASE1.md:44:### 2.2 The quantity (constraint b)
docs/world-model/EDS-E5D-PHASE1.md:56:### 2.3 The features (constraint c)
docs/world-model/EDS-E5D-PHASE1.md:67:### 2.4 The staging, and why it needs its own pin
docs/world-model/EDS-E5D-PHASE1.md:77:### 2.5 The swap and the audit (constraint e)
docs/world-model/EDS-E5D-PHASE1.md:85:## 3. Authorised seat
docs/world-model/EDS-E5D-PHASE1.md:95:## 4. Frozen gates
docs/world-model/EDS-E5D-PHASE1.md:97:### EXACT — one gate per claim
docs/world-model/EDS-E5D-PHASE1.md:120:### C1 — COVERAGE
docs/world-model/EDS-E5D-PHASE1.md:128:### C2 — HELD-OUT CALIBRATION ON DEPLOYMENT MOMENTS (constraint d)
docs/world-model/EDS-E5D-PHASE1.md:145:### C3 — THE AXIS IS A MEASUREMENT
docs/world-model/EDS-E5D-PHASE1.md:152:### THE LIVE AUDIT — `eds-e5b-value-axis-audit.ts`, verbatim
docs/world-model/EDS-E5D-PHASE1.md:170:### Reported, never gated
docs/world-model/EDS-E5D-PHASE1.md:184:## 5. Stop rules
docs/world-model/EDS-E5D-PHASE1.md:201:## 6. Result
docs/world-model/EDS-E5D-PHASE1.md:203:### 6.1 The deployment census — RUN 2026-07-26: **the alignment WORKED, one held-out bucket fired, and the phase STOPS there**
docs/world-model/EDS-E5D-PHASE1.md:228:#### C2 — the gate this whole phase existed to fix, PASSES
docs/world-model/EDS-E5D-PHASE1.md:244:#### R2 — the boundary I registered before the run, answered by measurement
docs/world-model/EDS-E5D-PHASE1.md:262:#### ⛔ C3's held-out bucket check FAILED — one bucket, and my tolerance was mis-powered
docs/world-model/EDS-E5D-PHASE1.md:281:#### What the census found, for the record
docs/world-model/EDS-E5D-PHASE1.md:298:#### Disposition
docs/world-model/EDS-E5D-PHASE1.md:311:## 7. C3R — the floor rises to meet the tolerance
docs/world-model/EDS-E5D-PHASE1.md:318:### 7.1 What changes and what does not
docs/world-model/EDS-E5D-PHASE1.md:356:### 7.2 A FRESH held-out split (ruling #19.2)
docs/world-model/EDS-E5D-PHASE1.md:366:### 7.3 What is forbidden here, restated
docs/world-model/EDS-E5D-PHASE1.md:372:### 7.4 Result
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:1:# EDS E3 — The co-evolution audit
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:12:## 1. What E3 is, and the scope fact that shapes it
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:32:## 2. The bundle, and what turns on
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:44:### 2.1 The live chooser (the new build)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:60:## 3. Frozen gates
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:62:### EXACT
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:73:### §2 EQUILIBRIUM BAND (hard abort — C1 §4 verbatim, the gate C1-B broke)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:91:### BEHAVIOURAL CONTRACT SUITE (the three C1-B broke)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:102:### NO-STRICT-DOMINANCE (the E0 canary, now live)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:115:### CO-EVOLUTION RESTORATION
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:126:### Reported, never gated
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:135:## 4. Stop rules
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:152:## 5. Implementation registrations (executor, BEFORE any result)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:246:## 6. RESULT — ⛔ FAIL (2026-07-25). The build reproduces; the world does not absorb it
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:265:### 6.1 What PASSED — and the one that matters most
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:296:### 6.2 §2 EQUILIBRIUM BAND — BROKEN on two dimensions
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:317:### 6.3 NO-STRICT-DOMINANCE — FAIL at 17.4%, on the ANTI-dominance side
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:346:### 6.4 CO-EVOLUTION RESTORATION — FAIL, and style diversity halves
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:369:### 6.5 X5 PERF — FAIL at 1.322x mean (p95 passes)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:390:### 6.6 Behavioural contract suite under `EDS_BUNDLE=1`
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:403:### 6.7 Reported, never gated
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:427:### 6.8 Disclosures
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:443:### 6.9 ABLATION — the failing component is the TOUCH COST, and the both-sides read is what SAVES the equilibrium
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:481:### 6.10 A DEFECT IN MY BUILD, caught by the ablation and disclosed
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:1:# EDS E2b-1R — Consumption-scoped perception
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:9:## 1. What failed, and what the fix may not touch
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:24:## 2. The diagnosis the redraw is built on
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:41:## 3. The change
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:59:## 4. Frozen gates
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:61:### EXACT
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:78:### B1 — BEHAVIOUR-NEUTRALITY (the decisive gate, ruling #10.3)
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:99:### G3 — PERF (unchanged budget)
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:106:## 5. Stop rules
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:121:## 6. FROZEN RESULT — PASS; 1.329× became 1.069× and nothing else moved (2026-07-25)
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:139:### G3 — the cost went where the diagnosis said it would
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:160:### B1 — the decisive gate: nothing but the cost moved
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:175:### X6 — cheaper, not blinder
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:184:### X3 — the corrected scheme, demonstrating its own point
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:191:### Disclosures
docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md:206:### What this unlocks
docs/world-model/PROGRAMME.md:1:# PROGRAMME — the stepwise handoff plan (2026-07)
docs/world-model/PROGRAMME.md:20:## 0. Where we are (context, 2026-07-24)
docs/world-model/PROGRAMME.md:37:## 0.5 Direction (commander deep-think, 2026-07-24)
docs/world-model/PROGRAMME.md:761:## Track E — the Embodied Decision Slice (the integration milestone)
docs/world-model/PROGRAMME.md:793:## Track A — the epistemology chain (information → decision)
docs/world-model/PROGRAMME.md:829:## Track B — make it visible (no gameplay risk)
docs/world-model/PROGRAMME.md:839:## Track C — substrate slices (base + emergence, parallel-capable)
docs/world-model/PROGRAMME.md:858:## Track E — the Embodied Decision Slice (the integration milestone)
docs/world-model/PROGRAMME.md:1196:## Track D — world-observatory UI (no sim contact, Sonnet-friendly)
docs/world-model/PROGRAMME.md:1215:## Track F — art direction (opened by the user 2026-07-25; parallel-safe)
docs/world-model/PROGRAMME.md:1255:### Track F session handoff (2026-07-25, art session — READ THIS FIRST)
docs/world-model/PROGRAMME.md:1314:## Self-drive protocol (2026-07-24, user-delegated)
docs/world-model/PROGRAMME.md:1350:### Autonomous mode (2026-07-24, Fable-grade executor)
docs/world-model/PROGRAMME.md:1375:## Governance (binds every executor session)
docs/world-model/PROGRAMME.md:1409:## Sequence at a glance
docs/PROBE-CONTRACTS.md:1:# EvoFootball Probe Contracts — the acceptance methodology
docs/PROBE-CONTRACTS.md:16:## 1. The six-layer acceptance chain
docs/PROBE-CONTRACTS.md:36:## 2. Six threshold TYPES (never mix them)
docs/PROBE-CONTRACTS.md:101:## 3. Gate structure per phase (no single VisionScore)
docs/PROBE-CONTRACTS.md:122:## 4. Per-phase contract template
docs/PROBE-CONTRACTS.md:127:## Hypothesis          — what real-football causality are we adding?
docs/PROBE-CONTRACTS.md:128:## Substrate mechanism — what new capability exists in the world? (which S-layer)
docs/PROBE-CONTRACTS.md:129:## Gene hooks          — which capability/preference/knowledge/state acts where?
docs/PROBE-CONTRACTS.md:131:## Primary mechanism probe   — the ONE mediator we measure directly (layer 1/2)
docs/PROBE-CONTRACTS.md:132:## Behaviour probe     — which behaviour should now be POSSIBLE? (layer 3)
docs/PROBE-CONTRACTS.md:133:## Counterfactual payoff probe — value vs hold / neutral / alternative (layer 4)
docs/PROBE-CONTRACTS.md:134:## Match guardrails    — goals / scramble / spell / churn / route-mix / shape (layer 6)
docs/PROBE-CONTRACTS.md:135:## Evolution gate      — does FRESH evo select it conditionally? (layer 5)
docs/PROBE-CONTRACTS.md:136:## Ecology gate        — diversity kept, negative freq-dependence, no runaway? (layer 5/6)
docs/PROBE-CONTRACTS.md:137:## Replay sample       — worst / median / best / largest-A-B clips (seed+timestamp)
docs/PROBE-CONTRACTS.md:138:## Ship rule           — which gates are HARD fail, which are WATCH-only
docs/PROBE-CONTRACTS.md:139:## Threshold types     — tag each gate: invariant | directional | calibration
docs/PROBE-CONTRACTS.md:145:## 5. The probe roster (classified by WHEN to build)
docs/PROBE-CONTRACTS.md:150:### EXISTING — strong coverage, call directly
docs/PROBE-CONTRACTS.md:161:### BASELINE-NOW — build BEFORE slice-1 (measure the current world, bank the "before")
docs/PROBE-CONTRACTS.md:171:### LAYER-GATE — build WITH the substrate layer it gates (it measures something not built yet)
docs/PROBE-CONTRACTS.md:185:### REUSABLE-WORKHORSE — the layer-4 engine for EVERY future lever
docs/PROBE-CONTRACTS.md:190:### FRAMEWORK-LATER — standing contracts, instantiated per future slice/layer
docs/PROBE-CONTRACTS.md:206:## 5.5 Probe tiers & shared telemetry (dev-cycle scaling)
docs/PROBE-CONTRACTS.md:230:## 6. Replay sampling — 让你少看,不是不看
docs/PROBE-CONTRACTS.md:242:## 7. Watchability dashboard (§2, one view — don't read them scattered)
docs/PROBE-CONTRACTS.md:261:## 8. Counterfactual boundary + open feasibility items
docs/PROBE-CONTRACTS.md:328:## 9. Build order (merges the user's revised sequence + the probe classification)
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:1:# EDS E2b-0 — Threat calibration (the common axis)
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:11:## 1. Why E2b splits, and why here
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:41:## 2. What is measured
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:66:## 3. Authorised seat
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:74:## 4. Frozen gates
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:76:### EXACT
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:94:### C1 — COVERAGE
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:102:### C2 — DISCRIMINATION (interval test, powered ex ante)
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:118:### C3 — HELD-OUT CALIBRATION (interval test)
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:125:### Reported, never gated
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:142:## 5. Stop rules
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:165:## 6. FROZEN RESULT — PASS; seeing the lane is worth six times remembering the distance (2026-07-25)
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:198:### R1 — the calibration curve
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:218:### R2 — which read carries the information
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:238:### R3 — a quarter of playable options cannot be priced at all
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:255:### R4 — look-pressure will be real
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:269:### What E2b-1 inherits
docs/world-model/EMBODIED-DECISION-SLICE.md:1:# EDS — Embodied Decision Slice (design contract, commander-owned)
docs/world-model/EMBODIED-DECISION-SLICE.md:107:## 1. The measured case for a bundle
docs/world-model/EMBODIED-DECISION-SLICE.md:127:## 2. Scope of the first cut (v1)
docs/world-model/EMBODIED-DECISION-SLICE.md:175:## 3. Stages (each gets its own pre-registered contract)
docs/world-model/EMBODIED-DECISION-SLICE.md:369:## 4. Gate sources (named now, frozen per stage at pre-registration)
docs/world-model/EMBODIED-DECISION-SLICE.md:415:## 5. Stop rules
docs/world-model/EMBODIED-DECISION-SLICE.md:427:## 6. What EDS unlocks on PASS
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:1:# EDS E2b-1 — The both-sides perception A/B
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:10:## 1. The question
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:23:## 2. Three information states (ruling #9.3 (a))
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:42:## 3. One unit, no invented weights (ruling #9.3 (b), (c))
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:60:### 3.1 On flag-ON, and why this A/B runs flag-OFF
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:84:## 4. The experiment
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:102:### 4.1 Authorised seat
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:114:## 5. Frozen gates
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:116:### EXACT
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:128:### G1 — NOT-LOOKING MUST NOT WIN (ruling #7 (d))
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:140:### G2 — ROUTE MIX (ruling #7 (e))
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:152:### G3 — PERF (ruling #7 (f))
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:163:### Reported, never gated
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:175:## 6. Stop rules
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:191:## 7. FROZEN RESULT — the science passes, the plumbing fails twice (2026-07-25)
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:205:### What passed, and it is the part that mattered
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:248:### G3 — perception at brain cadence costs 33%
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:265:### X3 — my defect, not the world's
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:283:### R1 — a correction to a banked number
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:302:### R2/R3/R5 — the rest
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:317:### Verdict and fork
docs/world-model/EDS-E0-OPTION-VALUATION.md:1:# EDS E0 — Dormant pass-option valuation
docs/world-model/EDS-E0-OPTION-VALUATION.md:9:## 1. The question
docs/world-model/EDS-E0-OPTION-VALUATION.md:21:## 2. Authorised seat
docs/world-model/EDS-E0-OPTION-VALUATION.md:38:## 3. Information boundary (binding)
docs/world-model/EDS-E0-OPTION-VALUATION.md:50:## 4. Frozen protocol
docs/world-model/EDS-E0-OPTION-VALUATION.md:65:## 5. Frozen gates
docs/world-model/EDS-E0-OPTION-VALUATION.md:67:### Exact validity
docs/world-model/EDS-E0-OPTION-VALUATION.md:80:### Prediction gates (evaluator vs the world it claims to model)
docs/world-model/EDS-E0-OPTION-VALUATION.md:100:## 6. Stop rules
docs/world-model/EDS-E0-OPTION-VALUATION.md:114:## 7. E0 RESULT — FAIL on two axes, with three findings that reshape E2 (2026-07-24)
docs/world-model/EDS-E0-OPTION-VALUATION.md:139:### Finding 1 — the evaluator genuinely models the interception physics
docs/world-model/EDS-E0-OPTION-VALUATION.md:147:### Finding 2 — observation does not blur the option set, it DELETES it
docs/world-model/EDS-E0-OPTION-VALUATION.md:170:### Finding 3 — the touch-cost disagreement is most likely the METRIC, not the model
docs/world-model/EDS-E0-OPTION-VALUATION.md:187:### Verdict and redraw
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:1:# EDS E3R — the revised-bundle audit (touch cost out of v1)
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:14:## 1. What changed, and what did not
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:30:### 1.1 Premise correction on constraint (a), disclosed before the run
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:60:## 2. The build E3R needs (constraint (d))
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:80:## 3. Frozen gates
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:82:### C1 — CHAIN FIRST: the re-banked choice reference (constraint (a))
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:96:### X4R — the live consumer chains to THAT reference
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:105:### EXACT (E3's, verbatim)
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:115:### §2 EQUILIBRIUM BAND (C1 §4 verbatim, unchanged tolerances)
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:122:### NO-STRICT-DOMINANCE (constraint (e), purpose documented)
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:139:### CO-EVOLUTION RESTORATION + STYLE (constraint (c))
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:182:### BEHAVIOURAL CONTRACT SUITE (constraint (f))
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:196:## 4. Stop rules
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:210:## 5. RESULT — ⛔ FAIL on two gates (2026-07-25). The equilibrium HOLDS; style and perf do not
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:223:### 5.1 C1 — the premise correction is PROVEN, and the chain holds
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:238:### 5.2 §2 EQUILIBRIUM BAND — ALL FIVE DIMENSIONS IN BAND
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:261:### 5.3 NO-STRICT-DOMINANCE — PASS at 21.86%, and the registered expectation held
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:276:### 5.4 CO-EVOLUTION RESTORATION — PASS: the advantage decays by 90%
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:287:### 5.5 STYLE DIVERSITY — ⛔ FAIL by 2.03pp, and the discriminators refute H2's mechanism
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:333:### 5.6 X5 PERF — ⛔ FAIL at 1.3238× mean (p95 1.3113× passes)
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:375:### 5.7 Behavioural suite (constraint (f)) — the stamina break is NOT the touch cost
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:401:### 5.8 Reported, never gated
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:416:### 5.9 Disclosures

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,340p' docs/PROBE-CONTRACTS.md; sed -n '1,436p' docs/world-model/EMBODIED-DECISION-SLICE.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EvoFootball Probe Contracts — the acceptance methodology

> **Why this exists.** `fires ≠ works ≠ pays ≠ selected ≠ good football`. The
> one-two experiment FIRED more often, "worked" mechanically — and fresh evolution
> **culled it while inflating goals**. No change ships on a single scalar or a
> handful of match-level stats. Every substrate/attr/gene change must prove **six
> things, in order**. Companion to [`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md); this
> enforces [`VISION.md`](VISION.md) §6 discipline ("一次一根杠杆, probe-first,
> A/B, honest-revert").
>
> Ratified 2026-07-20 (user + GPT + Claude). The probe **inventory** (60+ existing
> tools) is catalogued at the end; this doc adds the **contracts** they serve.

---

## 1. The six-layer acceptance chain

Any new capability, attribute, or gene proves these **in sequence** — a failure at
layer N means STOP, do not chase layer N+1:

| # | Layer | The question | Evidence style |
|---|---|---|---|
| 1 | **Mechanism exists** | did the internal mechanism actually change? (obs-error moved, ETA sharper, first-touch faster, turn cost lower, trajectory error changed) | frozen-scene, **direct mediator** measurement |
| 2 | **Gene bites correctly** | is the causal PATH right, not a shortcut? `awareness↑ → info fresher → prediction better`, **NOT** `awareness↑ → +10% tackle` | causal-path (mediator) test, not just directional |
| 3 | **Capability appears** | does the world ALLOW the behaviour? (candidate generated, window exists, receiver reachable) | behaviour-possibility probe |
| 4 | **It pays** | vs hold / neutral / alternative, does it improve the NEXT state? | **counterfactual** rollout (the layer we kept missing) |
| 5 | **Evolution selects conditionally** | does **fresh** evo keep it in SOME ecologies, reject in others, at a real budget price? | multi-world fresh-evo + shadow-price |
| 6 | **World remains healthy** | §2 watchability, readability, diversity, realism, ecology, perf, determinism | paired non-inferiority + ecological + replay clips |

**The new default question** is no longer *"did behaviour X happen more?"* but
*"why did it happen, what did it create, why did evolution keep it, and did it
crowd out other football?"*

---

## 2. Six threshold TYPES (never mix them)

Each gate belongs to exactly one type; state which when you write the contract.

- **Exact invariant** — must hold to the bit: feature-off is bit-identical
  (`fingerprint`), state ledger conserves, `watched === headless`, no illegal
  states. *(vitest: `match.test`, `simRunner.test`, `rng.test`.)*
  **Determinism hashes cover WORLD OUTCOMES only — wall-clock / perf numbers
  are reported alongside, never hashed.** A probe cannot both hash wall-clock
  and promise byte-identity; the two claims are different epistemic
  categories. *(Registered from EDS E2b-1, 2026-07-25: a perf block inside
  the hashed object made X3 structurally unpassable while the world itself
  was proven deterministic.)*
- **Directional** — only the sign is required: `awareness↑ → obs-error↓`,
  `agility↑ → turn-ETA↓`. Side-balanced, enough seeds (ARCHITECTURE rule).
- **Calibration** — predicted probability ≈ observed frequency: events predicted
  "70% control" should land ≈70%. *(The whole point of `arrival-calibration`.)*
- **Paired non-inferiority** — same-seed A/B: scramble/goals/route-mix must not
  regress out of the agreed band. The verdict is *"not worse,"* not *"better."*
- **Ecological** — multi-seed, multi-generation, **fresh** evo: divergence exists,
  **no runaway** axis, payoff is frequency-dependent.
  **Type your gate and OBEY the type**: an ecological claim gated on a single
  seed is mis-typed and noise-dominated, whatever its threshold. *(Registered
  from EDS E3R CE2, 2026-07-25: a one-seed style-entropy floor read 0.5797 —
  FAIL — while the pre-registered robustness seed flipped the same statistic
  to 1.5321 and all three mechanism discriminators said diversity ROSE.)*

**Inherited gate values must be RE-POWERED against the inheriting
contract's own parameters (ruling #19, 2026-07-26).** A tolerance is only
meaningful relative to the n it was powered at; inheriting the number
without redoing the power calculation is an unpowered predicate in
disguise. *(Registered from EDS E5d Phase 1 C3: a 5.0pp tolerance
inherited from a contract with n≈1,000/bucket — 3.4σ there — met a 200
bucket floor here, where it is 1.54σ and fires on noise ~11% per bucket;
across two dozen buckets a false fire was near-certain by construction.)*

**Reproduction gates pin STAGING and DEFINITIONS separately (ruling #18,
2026-07-26): one gate per claim.** A staging gate pins counts, inputs and
moment sets (drift detection); a definition gate pins outcome windows and
conventions (redefinition detection). A gate that mixes both cannot tell
drift from redefinition and will either be unsatisfiable or fire
ambiguously. *(Registered from EDS E5d X6: counts matched 7,864/7,864 —
staging clean — while the rate fired because E5a's own window start
violated its own contract; the mixed gate had already needed one pre-run
amendment for being unsatisfiable.)*

**Watchability instruments (ruling #15, 2026-07-26): every §2-band run
REPORTS forward-pass share, third-man releases, overlap releases,
give-and-gos, shots and longest pass chain.** E3R passed 29 gates while
watchability measurably dropped (third-man −35.7%, shots −6.0%) because no
gate could see it — the user's eyes sat at the END of the chain, and these
six counters cost minutes. Reported, never gated: the user's eyes remain
the only watchability judge; the instruments exist so a probe can flag
what previously only a play session could.
- **Equivalence / flatness** — the claim is *"no effect"* / *"no longer rises"*:
  must be pre-registered as an INTERVAL test (an explicit equivalence band) with
  a sample size computed against the predicted effect. A strict point inequality
  where the per-arm SE swamps the predicted difference is structurally
  undecidable — the gate can only ever return `unexplained`, whichever way the
  world is. *(Registered from EDS E1a-I2, 2026-07-25: a 0.5pp endpoint gap was
  coded as "rises" where the SE of that difference was ≈5.6pp at n≈60 — the
  probe was honest, the predicate was unpowered by construction.)*

---

## 3. Gate structure per phase (no single VisionScore)

**Never** collapse the vision into `VisionScore = 0.3·realism + 0.3·diversity + …`
— the moment it's one scalar, we optimise the scalar, not the football (Goodhart).
Instead, every phase declares:

- **Hard gates** (any fail ⇒ NO ship): determinism · neutral baseline · mechanism
  direction · state-ledger conservation · §2 no-obvious-regression · no ecology
  runaway · **perf non-regression** (relative to tag: live-frame p95 / sim-step p95
  / allocations / headless matches·s⁻¹ — see §5.5).
- **ONE primary outcome** for the phase (the thing this lever is for).
- **2–4 mediators** proving the result arrived **via the intended path** (layer-1/2
  variables), not a side effect.
- **Diagnostics** — may move freely, do **not** decide ship.

Acceptance is **probes + the user's eyes, jointly** (user 2026-07-20). Behavioral
levers WILL move goals; §2 is a watchability judgement (probe proxies + play-test),
**not** a goals≈2.0 veto.

---

## 4. Per-phase contract template

Copy this block per phase (into ROADMAP or a phase note):

```md
## Hypothesis          — what real-football causality are we adding?
## Substrate mechanism — what new capability exists in the world? (which S-layer)
## Gene hooks          — which capability/preference/knowledge/state acts where?
                         (must obey the SUBSTRATE-MAP hook table's "MUST NOT" column)
## Primary mechanism probe   — the ONE mediator we measure directly (layer 1/2)
## Behaviour probe     — which behaviour should now be POSSIBLE? (layer 3)
## Counterfactual payoff probe — value vs hold / neutral / alternative (layer 4)
## Match guardrails    — goals / scramble / spell / churn / route-mix / shape (layer 6)
## Evolution gate      — does FRESH evo select it conditionally? (layer 5)
## Ecology gate        — diversity kept, negative freq-dependence, no runaway? (layer 5/6)
## Replay sample       — worst / median / best / largest-A-B clips (seed+timestamp)
## Ship rule           — which gates are HARD fail, which are WATCH-only
## Threshold types     — tag each gate: invariant | directional | calibration
                         | paired-non-inferiority | ecological
```

---

## 5. The probe roster (classified by WHEN to build)

The key discipline: **do not build a gate-probe before the substrate it gates
exists.** Probes fall into classes:

### EXISTING — strong coverage, call directly
`calibrate -- 8` (box-score, goals band) · `goals-warming` (inflation curve) ·
`scramble-anatomy` / `spell-dist` / `churn` (乱抢, §2) · `cross-anatomy` /
`cutback-anatomy` / `width-funnel` (box-arrival) · `spill-anatomy` /
`positioning-bite` / `reception-by-width` / `orientation-ab` (**first-touch — NOT a
gap**) · `goal-channel-census` / `shot-context-anatomy` / `launch-anatomy` (route
mix) · `freq-dependence` / `matchup-matrix` (self-balance) · `scheme-matchup` /
`positioning-shape` / `run-repertoire` / `transition-anatomy` (shape/runs/transition).
Gates: `offside.test`, `cutback.test`, `oneTouch.test`, `cushion.test`,
`touches.test`, `blocks.test`, `aerial.test`, `combos.test`, `goalChannels.test`.

### BASELINE-NOW — build BEFORE slice-1 (measure the current world, bank the "before")
| Probe | Emits | Acceptance layer |
|---|---|---|
| `contest-anatomy` (NEW) | loose-ball events/m; **state-ledger completeness** (every loss-of-control → controlled-opp / controlled-same / contest / out / dead — **no `owner=null` orphan**); source×outcome matrix (block-2nd / tackle-loose / keeper-spill / aerial-knockdown / first-touch-spill → atk-recover% / def-recover% / re-loose%); bodies within 3m/6m; time-to-controlled; **`pinballChainLength`**; **`contestToChanceRate`** | 3, 6 |
| `ball-control-anatomy` | `secured / knocked / free` phase share; secured and pressured ball distance; visible distance changes; knock cadence/duration/max carrier distance; self/teammate/opponent/dead outcome. Must be read with `contest-anatomy` — improving cadence while its recontact tail grows is a failure. | 1, 3, 6 |
| `arrival-calibration` (NEW, reliability half) | control-reliability curve: margin-bucket (`<−0.5 … >+0.5`s) → clean / contested / intercepted / died-in-flight / lose<0.5s / stable@1.5s, by pass type × zone | 3, 4, 6 |
| `reception-survival` (NEW) | post-reception 0.5–1.5s: `stableControl@0.5/1.5s`, `forwardReady@1.0s`, `nextOptionCount`, `receiveToTurnover`, `receiveToProgression` (reuse `spill-anatomy` for the touch itself — don't rebuild) | 3, 4 |
| `probe-pass` (EXTEND) | per {short/long/through/cross/lateral/one-touch}: attempts / clean / interrupted / contest-created / intercepted / out / stable@0.5s / stable@1.5s / facing-forward / line-broken / next-options / possession-value-delta | 3, 4, 6 |
| `perception-calibration` (NEW, **run once now**) | truth vs internal observation: position/vel/dir MAE, missed-threat, phantom-threat, observation-age, blind-side latency. **On the OLD engine this reads ≈0 = the perfect-information baseline** (proves the hole, not quality) | 1 |

### LAYER-GATE — build WITH the substrate layer it gates (it measures something not built yet)
| Probe | Gates | Acceptance layer |
|---|---|---|
| `perception-calibration` (as a gate) | S3 `PerceptionSnapshot` | 1, 2 |
| `arrival-calibration` (prediction-MAE half) | S4 predictor (predicted vs actual ETA MAE by horizon/facing/speed/fatigue) | 1, 2 |
| `pass-value-frontier` | S7 next-state relation: Pareto-frontier size, dominated live choices, awareness→pair/frontier fidelity; outcome split is diagnostic, **not counterfactual payoff** | 1, 3 |
| `cognition-factorial` | S3/S4 gene wiring — 2×2 `awareness×passing` (attack) & `awareness/anticipation × tackling/defending` (defence); proves the shared trunk serves BOTH sides while domain skill still differentiates | 2, 3, 4 |
| `control-sequence-anatomy` | B1c continuous control: sequences/touches/cadence by speed-pressure-turn, ball↔controller/virtual-foot distance, relative velocity, exposure, opponent break causes and fast reacquire. Exact zero: `ownTouchOpenedM3`, `ownTouchChangedPossession`, `passArrivalContactsAfterControl`, `duplicateSequenceStart`. Read with `ball-control-anatomy` + `contest-anatomy`; B0 max M3 recontacts 8, no 113-contact arrival, no return to 50+ knocks/m. **B1c-0 baseline:** 120 matches, zero sequences/touches and all four violations exactly zero. | 1, 2, 3, 6 |
| `control-coupling-mechanism` | B1c-1 isolated solo gate: distance-derived cadence, alternating query feet, bounded velocity-only impulse, ball↔foot/controller error, recovery-envelope rate and sequence-id continuity. It must leave live `control-sequence-anatomy` at zero until a later live cut. | 1, 2 |
| `control-opponent-mechanism` | B1c-2 isolated 1v1 boundary: own direct contact must continue the same sequence without M3; exposed opponent access must break it into an M3 handoff; a screened access line must not break it. Exact zero: own-touch M3/sequence change, missed opponent break, screened break and any owner/winner field. | 1, 2 |
| `rendezvous-recovery-mechanism` | B1d-0 isolated no-opponent falsification: one velocity impulse, immutable contact tick/point, desiredVel-only recovery through real `Player.physicsStep`, endpoint contact or honest miss. Primary = feasible fixed-plan contact completion; recovery ablation must miss at least one scene. Exact zero: post-commit ball correction, target/tick change, retime, direct player-state writes, M3/contest/possession/sequence/locus/RNG use. Passing does not authorise live wiring. | 1, 2 |
| `counterfactual-oracle-v2` | S7e precondition, offline only: one mutually exclusive first transition (`intended / teammate / opponent / loose / dead`) from post-step owner/law/pass-lifecycle facts; administrative censoring stays outside football outcomes. Exact zero: residual `other/unresolved`, force failures, partition/controller/support-mask violations. Owner-null possession/options are null, not zero. Primary horizon remains kick+3s; transition+3s is diagnostic. Passing does not authorise an estimator or live consumer. | 1, 4 |
| `s7e-replicated-oracle-pilot` | S7e-0C feasibility only: 64 independent pilot pairs × 64 paired child continuations, split into two fixed R=32 halves. Every continuation preserves nullable raw Oracle-v2 facts and emits total versioned `ComparablePassPayoffV1`; exact zero for projection/null/reset/terminal/denominator/RNG/determinism violations. Gates: relation agreement ≥52/64 and projected MC half-width ≤1.25pp. **Frozen result:** oracle validity PASS; 39/64 and 3.222pp → `INCONCLUSIVE — R=32 insufficient`; final not authorised, no adaptive R/tolerance retry. | 1, 4 |

### REUSABLE-WORKHORSE — the layer-4 engine for EVERY future lever
| Probe | Emits | ⚠ |
|---|---|---|
| `counterfactual-value` | clone the frozen state, run paired-seed branches (real run / hold / neutral support / alternative point) 2–4s, compare possession-prob / progression / options / line-break / xG / opponent-displacement / mate-space / turnover-exposure. Core metric **`offBallAddedValue = rollout(actualRun) − rollout(hold)`** | **Feasibility spike first — see §8** |

### FRAMEWORK-LATER — standing contracts, instantiated per future slice/layer
`shape-dynamics` (S8 team shape: centroid/width/length/stretch/surface-area/
response-lag/reform-time — **relative, not 11v11 absolute metres**) · `coordination-
anatomy` (S8 task-bidding: `uncoveredTaskTime` / `duplicateTaskTime` / `handoffLatency`
/ `taskFitRegret` / `shapeHoleDuration`) · `dilemma-anatomy` (does a break-defence
move create a REAL 2-choice for one defender — operationalises overload/third-man/
wall-pass/drag/switch/dribble-to-commit **without labels**) · `style-identifiability`
(behaviour-only classifier; within-team distance < between-team, held-out opponent/
season — the machine proxy for "战术肉眼可辨"; note 100% ≠ good, also want
opponent-adaptation) · `attribute-shadow-price` (budget-conserving swaps: marginal
value per 0.1 per role/ecology — no attr universally must-buy or perpetually drained)
· `fresh-evo-retention` (per new attr: frozen→paired→fresh-evo→multi-world→spread,
not driven to 0 or 1).

---

## 5.5 Probe tiers & shared telemetry (dev-cycle scaling)

The dev cycle 卡 before the player's machine does — running 60+ probes (multi-world,
multi-gen, A/B, matchup, visual) on every change makes a phase take hours. So probes
are TIERED and share ONE trace:

- **Tier 0 — every change, seconds:** unit tests · determinism invariant · frozen
  mechanism scene · gene directional bite · state conservation · feature-off bit-identity.
- **Tier 1 — every commit, 1–3 min:** small paired A/B · contest · arrival ·
  perception-calibration · reception-survival · neutral mirror · scramble guard.
- **Tier 2 — pre-ship, ~10–15 min:** calibrate · goals-warming (short) · fresh-evo ·
  matchup · style-identifiability · replay-sample extraction.
- **Tier 3 — nightly/milestone:** multi-world long evo · freq-dependence · 24–40 gens ·
  full ecology · visual matrix · large counterfactual rollouts.

**Shared telemetry (build once):** one sim run emits a trace — `TelemetryEvent`,
`DecisionTrace`, `PossessionTransition`, `PassLifecycle`, `ContestLifecycle`,
`TaskLifecycle` — and many probes analyse the SAME trace offline. Kills the "run 500
matches 10× for 10 metrics" waste. ⚠ **Invariant: the trace is flag-gated,
PURE-observational, and OFF by default** (live + fingerprint runs never emit) — emitting
must never change sim results (determinism), and per-event allocation stays out of the
hot path. Perf is measured by the phase-level profiler in `Match.step` (physics /
perception / prediction / candidates / coordination / mechanics / snapshot-building).

## 6. Replay sampling — 让你少看,不是不看

Watching can't be fully replaced (rhythm/narrative/continuity live in the eye). But
cut the cost from "dozens of matches" to **~20 auto-mined clips per phase.** Each
probe emits `replay seed + timestamp`; auto-extract four sets: **worst 5**
(max scramble / max prediction error / longest uncovered task) · **largest A/B diff
5** · **median 5** · **best 5**. Watch each **twice**: pass 1 no overlay (是否像
足球), pass 2 with perception/ETA/task/candidate-score overlays (diagnose why). This
kills the "only the highlight looks great, 90% of normal play is weird" failure.

---

## 7. Watchability dashboard (§2, one view — don't read them scattered)

- **Chaos:** contest time-share · loose-ball time-share · `pinballChainLength` ·
  <3s ownership flips · touches before a controlled spell · decision-target flip
  rate · time with ≥3 bodies converging on the ball · duplicate-function bodies in
  a zone.
- **Football-formation:** controlled-possession duration · goals by route · goals
  after a line-break · goals after a contest/deflection chain · receiver
  stable-control rate · chances from **structured** attack vs scramble · attacks by
  width / central / combination progression · defensive shape recovered before a
  chance.
- **Fluency:** dead-ball time · restart setup · interruption frequency · ball-out
  rate · action-commitment duration · players reversing target without acting.

**Do not** demand all possessions get longer or all goals come from build-up — the
vision wants **multiple readable routes**, not forced tiki-taka.

---

## 8. Counterfactual boundary + open feasibility items

- **Rule — online counterfactual = NEVER, offline = ORACLE.** The live AI must use a
  CHEAP value estimator (S7 bounded lookahead: ETA / pitch-control / line-break /
  estimated future options / local danger). `counterfactual-value` is the OFFLINE
  oracle that CERTIFIES the cheap estimator actually flags the valuable runs. Never
  clone-and-rollout inside the live sim — it explodes exponentially and reads like a
  god-compute chess engine (violates §1's "long eyes," not omniscient search).

- **✅ FEASIBILITY SPIKE + POC DONE (2026-07-20) — use STRUCTURAL DEEP-CLONE (Option A).**
  My first read-only pass recommended the conservative replay-to-T; a deeper
  separate-session POC then proved **deep-clone is the better call and cheap**:
  - `Match` has ONE randomness source (`readonly rng: Rng`, `Match.ts:252`; whole state
    = a single u32 `s`; **no `Math.random`/`Date`/`performance.now` in the sim path** —
    only UI/render/profiler). `private` is erased at runtime → `rng.s` is read/settable
    externally, so **no sim file needs editing** to capture/restore it.
  - CLOSED state graph: fixed `DT=1/60` (full match = 14,400 steps), no cross-run module
    state (the "A-then-B" determinism test proves it) beyond a dt-keyed trig cache + a
    const config flag. The ONLY object refs needing remap are `Ball.owner`/`lastTouch`;
    `Team.chasers/marks/runners` are Set/Map (structural, not JSON, clone); everything
    else is gid-indexed, no closures (`ActionState` is pure data).
  - A generic prototype-preserving, cycle-safe cloner gives **byte-identical
    continuations**: POC (`scripts/probes/_poc-clone.ts`) = **25/25 cases (5 seeds × 5
    freeze ticks incl. half-time) identical for 4 s + identical full-match remainder**;
    negative control (1-bit RNG nudge) **DIVERGES** (assertion non-vacuous). Cost
    **~275 µs/clone vs ~94 ms replay-to-T ≈ 342× cheaper**; replay-to-T stays the
    trivial fallback.
  - ✅ **Mainline primitive now landed (2026-07-21):** `sim/cloneState.ts` promotes the
    field-agnostic cloner with a 4s byte-identical continuation regression, and
    `pass-target-counterfactual` is its first real consumer. It freezes the state just
    before a live pass decision and forces chosen-target vs alternative-target branches
    from identical RNG. The first S7 run correctly **failed** payoff (509 pairs:
    alternative/chosen dominance 34.4/35.6%; team possession 53.4→49.1%), proving the
    oracle can veto a plausible-looking estimator rather than rubber-stamp it.
  - ❌ **S7c static two-sided threat also failed honestly (2026-07-21):** a
    pre-registered shooting-window + turnover-corridor extension left 363 paired
    rollouts, but alternative/chosen dominance was 34.4/35.0% and own-team
    possession fell 53.4→47.1%. The implementation was fully reverted with no
    coefficient/tolerance sweep; the negative audit remains in
    `world-model/S7C-THREAT-POTENTIAL.md`.
  - ❌ **S7d temporal flight interception also failed complete payoff
    (2026-07-21):** the route margin itself calibrated strongly (risky pass
    received/intercepted 64.7/28.6%; safe 88.7/3.5%), but adding it to S7 left
    only a +0.9pp alternative dominance edge and reduced own possession
    51.1→47.0% over 219 paired rollouts. Its implementation was fully reverted;
    `pass-target-counterfactual` retains first-controller/pass-resolution anatomy
    so the next hypothesis can distinguish flight failure from post-reception
    failure. See `world-model/S7D-FLIGHT-INTERCEPTION.md`.
  - ✅ **The retained anatomy found the next causal boundary:** within the 212
    paired branches where both intended targets first-controlled, the original
    S7b alternative/chosen dominance becomes 38.2/28.8%, possession 65.6→67.5%,
    progression +1.181m and xG +0.006. S7 therefore needs a contingent transition
    model (`receive / teammate / opponent / dead / loose` → conditional next
    state), not another independent Pareto feature and not another live cut.
  - ✅ **Horizon sensitivity confirms the split:** at 3.0/4.5/6.0s, aggregate
    dominance gaps are −1.2/−3.5/+2.2pp and never pass, while macro-possession
    direction flips. The `bothTarget` conditional gap stays +9.4/+5.6/+8.0pp
    with positive progression and xG throughout. Keep 3.0s as the frozen total
    baseline; use event-anchored diagnostics to design S7e, not to cherry-pick
    a favourable fixed horizon.
- ⭐ **This does NOT gate S7.** Live bounded-lookahead uses the CHEAP analytic estimator
  (ETA / pitch-control / next-options), never a Match rollout (too slow per-tick under
  either scheme) — the clone-vs-replay choice only touches the offline oracle, so the
  online=never / offline=oracle boundary above holds cleanly.

---

## 9. Build order (merges the user's revised sequence + the probe classification)

1. Write [`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md) + this doc. ✅ (this pass)
2. **Settle the tree:** commit `position-aware budget` + keeper; **revert the
   `vision` 10th-attr wiring** (1 call site) → clean slice-1 baseline HEAD.
3. Build the **BASELINE-NOW** probes (§5) + run the full EXISTING suite; **freeze
   baseline JSON** on the settled HEAD.
4. **Feasibility spike** for `counterfactual-value` (§8); build it if (a) is cheap,
   else scope the replay-to-T version.
5. **Begin Pass–Arrival–Contest slice-1a** (SUBSTRATE-MAP §5), one sub-step at a
   time, each verified in the six-layer order: **mechanism → gene-bite → capability
   → payoff → fresh-evo → ecology → replay clips.** LAYER-GATE probes come online
   as their layer lands.
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

**Commander ruling #8 (2026-07-25): E2a-1's P3 FAIL accepted as a correct
catch — the pass-log census is a SELECTED sample (the live chooser already
filtered for options it liked), and the honest population for an unseen-man
prior is the OPTION SPACE the evaluator prices. E2a re-posed as E2a-2: a
counterfactual fork-and-force census (intervene on target choice only, live
execution machinery, bit-identical reproduction of the chosen pass as the
harness gate). Direction findings are reported, never gated. Routing re-keys
onto the priced quantity. E2b's aiming rule settled: priced always,
executable only with an honest aim point; the price-vs-aim gap is the
causal seat of look-before-pass. Full text in §3 (h)–(l).**

**Commander ruling #9 (2026-07-25): E2a-2 PASSED (real selection bias:
13pp, not 0.18pp) and the executor's E2b split is accepted — E2b-0
measured the corridor read's exchange rate into probability (PASS,
39.72pp discrimination) so no invented weight ever joins the axes. E2b-1
constraints: name the third information class (READ / SEEN-UNREAD 28.48% /
UNSEEN), common unit = measured probability, no double-counting of the
touch term (corridor factor from reach-based outcomes × E1a-certified
formula at flag-ON), look-pressure reported on both axes. Green path runs
to E4. Full text in PROGRAMME ruling #9.**

**Commander ruling #10 (2026-07-25): E2b-1's split verdict disposed — the
science is BANKED (G1 not-looking never won, oracle lift +4.61pp; G2 the
route mix survived perception, S3b's collapse did not reproduce; those two
gates are the graves S3b and C1-B died in, now passed in dormant form) and
both failures are plumbing. X3 ruled: determinism hashes cover world
outcomes only, perf reports alongside (PROBE-CONTRACTS codified); the FAIL
stands for this run, the redraw pre-registers the corrected scheme. G3
ruled: E2b-1R redraw with CONSUMPTION-SCOPED perception (defender entry
reads a ball-only percept; full snapshot only at pass-decision moments) —
honesty frozen (scan cadence / FOV / retention / keyed error untouchable),
budget stays 1.25×, and the decisive new gate is behaviour-neutrality:
same seeds → the redraw's logged choices must be IDENTICAL to E2b-1's.
R1's correction supersedes the 28.48% number (§4). Green path: E2b-1R
PASS → E3 draft → stop at E4.**

**Commander ruling #12 (2026-07-25): E3 FAILED five gates and the thesis is
amended by its own measurement. X4's achievement stands banked — the first
live perceived choice, 0/10,292 divergence from the probe that validated
it. The ablation names touch cost as the failing component and R1 proves
the break is mechanical (spill → loose → aerial; the chooser never chose
it), so "the bundle makes the cost survivable" is REFUTED — information
was the wrong co-evolution partner for a mechanical tax. Touch cost leaves
the v1 live set (§2), re-seated to a future C5-coupled slice where the
receiver's craft can absorb it. E3R re-audits the 1+3+4 bundle in FULL
(ablation diagnostics are not passes): re-bank the choice reference with
flag-off-honest pricing first, then X4 chains to it; both style-entropy
hypotheses pre-registered (touch-flattening vs genome-blind chooser);
perf lever = candidate-scoped snapshots at pass-commit; 20–80 dominance
band kept with its purpose documented. Green path: E3R PASS → E4.**

**Commander ruling #13 (2026-07-25): E3R 26/28 — the revised thesis passed
its own full audit (§2 band all five in, dominance 21.86% stable, co-evo
restoration +0.2864→+0.0282 — first pass ever on the vision-attr gate;
X4R 0/10,292; the ruling-#12(a) premise disproven-and-proven: the banked
reference was already flag-off-honest). CE2's verdict stands but the gate
was mis-typed (single-seed ecological claim; H2 refuted by its own three
discriminators + the seed flip to 1.5321) → CE2R = 5-seed median entropy
≥0.60 + discriminators as co-gates. X5R: lazy reconstruction APPROVED,
semantics registered as PULL (knowledge = what your scans would have
shown, materialised when you act; values constructionally identical),
under perpetual equivalence pins + choice identity + unchanged budget.
Stamina carries to E4 as a feel item (calmer play is an ordered emergent
consequence); fatigue-economy re-seat registered as the post-ship slice.
E3R2 is narrow: the two gates only. PASS → E4 + F-ACCEPT.**

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
   choosing. **⛔ REMOVED FROM THE v1 LIVE SET by ruling #12 (2026-07-25,
   E3's measured verdict): the band break it causes is MECHANICAL — spill →
   loose ball → aerial route, with no decision anywhere in the chain (R1:
   the chooser's long share 19.06% vs 18.05% dormant) — so seeing the cost
   cannot absorb it. Bundling with information was the wrong co-evolution
   partner; the right one is the RECEIVER'S CRAFT: when cushion-vs-one-touch
   is a priced choice (C5), receivers can ADAPT to hot balls instead of
   mechanically spilling. E1b's curve stays BANKED dormant (the measurement
   is never wasted); its live entry re-seats to a future C5-coupled slice.**
3. **Perception-based pass choice** (the S3b redo): the passer reads its own
   `PerceptionSnapshot`, not truth.
4. **Perception-based defensive read** (the co-evolution partner): the
   interception decision reads perceived state through the same machinery.
   Attr wiring follows SUBSTRATE-MAP's ruling: a shared `awareness` trunk,
   attack/defence asymmetry left to other attrs — no one-sided reading attr,
   ever again.

**v1 LIVE BUNDLE after ruling #12 = components 1+3+4** (the pair the E3
ablation measured in-band on every dimension: chooser alone −21.69% goals,
chooser + perceived defence +2.20%). The evaluator prices the world AS IT
IS — flag-off touch physics — never phantom costs.

OUT of v1, explicitly: one-touch decision (C5 — second cut, unless E3
evidence demands it), off-ball movement changes, TeamBrain refactor, live
D-PROC/D-MUT consumers, coach doctrine/familiarity, multi-target attention,
aerial work (C4). Feints remain a future observation, never a mechanic.

**Also OUT, registered by ruling #11 (2026-07-25) so nobody later claims
more honesty than v1 delivers: perception-honest pass AIMING.** The v1
honesty claim covers the CHOICE (chosen from the passer's own snapshot,
executable-only, measured axis). EXECUTION still runs the legacy machinery,
which leads the true target — the same truth-aimed kick the current game
gives every pass, so E3's §2 band compares like with like and E2b's banked
choices (validated under exactly that execution) chain through X4 without a
seam. Aiming at the REMEMBERED position instead — where passes to a
departed runner honestly miss — changes mechanics for every pass and
belongs to a future slice beside C-track lead/weight craft.

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

    ⭐ RULING #8 AMENDMENT (2026-07-25, after E2a-1's P3 FAIL caught the
    selected-sample truth: a census of PLAYED passes inherits the live
    chooser's filter, but the prior must price options nobody chose and
    nobody saw). E2a is re-posed as **E2a-2, the OPTION-SPACE census**,
    measured counterfactually — the honest population is the candidate
    set E2b will actually price:

    (h) Sample real in-play decision moments from fresh seeds; enumerate
        the FULL candidate set (every outfield teammate per E0's candidate
        definition); for each candidate FORK the deterministic world and
        intervene ON TARGET CHOICE ONLY — power, lead and execution run
        the live machinery pointed at the substituted target. That
        measures exactly "what happens if the passer chose X instead",
        the quantity the evaluator prices. Outcome definitions and
        adjudication-class decomposition (incl. the ~25% never-adjudicated
        share) carried over from E2a-1 unchanged.
    (i) EXACT harness gate: forcing the pass the live AI was about to
        play must produce a continuation BIT-IDENTICAL to the unforked
        match — the fork proves itself against observed reality before
        any counterfactual is trusted. Forced targets the execution
        machinery cannot play are logged as their own outcome class
        (unplayable), never silently dropped.
    (j) The visible-vs-unseen DIRECTION is REPORTED, never gated — P3's
        lesson is that beliefs about which way the world leans do not
        belong in validity gates when they can be measured; E2b's
        not-looking-must-not-win stays the behavioural enforcement point.
        Registered prediction (not a gate): option-space rates land below
        pass-log rates; the delta is the first measured CHOOSER LIFT
        (how much value the live target-chooser adds over uniform choice
        — near-zero would itself be a substrate finding, consistent with
        the speed-blind evaluator). E2a-1's census stays banked as the
        chosen-subset reference and one side of that diagnostic.
        Pessimism-by-construction is REJECTED (an invented constant —
        the amount of pessimism can only come from a measurement, which
        is this recensus); accept-and-let-E2b-judge is REJECTED (building
        a consumer on an input known-mispriced at its own gate is E0b's
        lesson inverted).
    (k) RE-KEY, codified: a routing predicate must key on the statistic
        its consumer actually reads, never a proxy (E2a-1's P4 keyed on
        flat interceptedRate while the priced axis, receptionSuccessRate,
        carries a real 8.32pp gradient — same error family as
        label≠metric). E2a-2's routing keys on the priced quantity.
        Pricing classes for E2b: fully-unknown (targetMissing, no memory)
        → MARGINAL by construction, the distance is unknowable;
        stale-memory (last-known position within retention) → BANDED at
        the remembered distance — the 8.32pp gradient is what memory is
        worth, the S3 layering paying off. E2a-1's frozen result stands
        untouched.
    (l) E2b aiming rule (settles the question E2a-1 §6 flagged): unseen
        options are PRICED always (zero deletion holds), but EXECUTION
        requires an aim point the passer honestly possesses — a current
        percept or within-retention memory. A zero-information teammate
        can win a price comparison but cannot be kicked to; no last-known-
        beyond-retention or role-anchor aiming, which is truth-fallback
        by the back door. The gap between "prices well" and "cannot aim"
        is the causal seat of look-before-pass — E2b REPORTS how often a
        blind option out-priced every executable one (the look-pressure
        statistic, a future gaze consumer), and its choice A/B runs over
        executable options only.

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
* E2b-0 calibration (banked 2026-07-25, calibration SHA `52c10713…3082`):
  corridor-threat quintile → realized reception success 82.86 / 62.31 /
  50.97 / 47.15 / 43.14% — the measured exchange rate from corridor seconds
  into probability, 39.72pp discrimination. Read-vs-band: the corridor read
  spreads outcomes 39.72pp, the distance band 6.64pp (~6×) — looking's value
  is the lane read only a current percept supports (A4's boundary
  pre-registered: doctrine buys priors and latency, never lane reads).
  Third information class: real but nearly empty — **SUPERSEDED by E2b-1
  (ruling #10): the banked "28.48% SEEN-UNREAD" was the evaluator-null share,
  a MIXED class that is mostly UNSEEN targets; the true SEEN-UNREAD share is
  ≈0.2%.** The taxonomy stands, the magnitude was mis-attributed.
  Look-pressure lives on the read axis (blind 55.72% ≈ mean executable band
  55.81%);
* E2b-1 science (banked 2026-07-25 despite the run's plumbing FAIL —
  ruling #10): **G1 not-looking did not win** — realized success 63.28 /
  64.60 / 63.46% across awareness 0.2/0.5/0.8, oracle 67.90%, every rung
  inside the −2.0pp non-inferiority band, endpoint lift +4.61pp; **G2 the
  route mix survived perception** — long-option share 13.31 / 17.72 /
  18.05% vs oracle 18.07%, S3b's ~38% collapse did NOT reproduce: the
  base-rate prior does exactly what it was built for. Look-pressure banked:
  a blind option out-prices every executable one in **9.17%** of moments at
  awareness 0.8 (17.03% at 0.2) — the future gaze consumer's workload.
  Evaluator-vs-live-brain agreement is only **47% under omniscience**: the
  evaluator is a DIFFERENT chooser, so E3 must expect play to CHANGE and
  measure whether the change stays in band. Side finding: threatened lanes
  also deliver dirtier balls (P(clean|reached) 93.8→89.0% across threat) —
  pressure arrives with the ball;
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

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '240,340p' docs/PROBE-CONTRACTS.md; sed -n '1,220p' docs/world-model/EMBODIED-DECISION-SLICE.md; sed -n '221,436p' docs/world-model/EMBODIED-DECISION-SLICE.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
---

## 7. Watchability dashboard (§2, one view — don't read them scattered)

- **Chaos:** contest time-share · loose-ball time-share · `pinballChainLength` ·
  <3s ownership flips · touches before a controlled spell · decision-target flip
  rate · time with ≥3 bodies converging on the ball · duplicate-function bodies in
  a zone.
- **Football-formation:** controlled-possession duration · goals by route · goals
  after a line-break · goals after a contest/deflection chain · receiver
  stable-control rate · chances from **structured** attack vs scramble · attacks by
  width / central / combination progression · defensive shape recovered before a
  chance.
- **Fluency:** dead-ball time · restart setup · interruption frequency · ball-out
  rate · action-commitment duration · players reversing target without acting.

**Do not** demand all possessions get longer or all goals come from build-up — the
vision wants **multiple readable routes**, not forced tiki-taka.

---

## 8. Counterfactual boundary + open feasibility items

- **Rule — online counterfactual = NEVER, offline = ORACLE.** The live AI must use a
  CHEAP value estimator (S7 bounded lookahead: ETA / pitch-control / line-break /
  estimated future options / local danger). `counterfactual-value` is the OFFLINE
  oracle that CERTIFIES the cheap estimator actually flags the valuable runs. Never
  clone-and-rollout inside the live sim — it explodes exponentially and reads like a
  god-compute chess engine (violates §1's "long eyes," not omniscient search).

- **✅ FEASIBILITY SPIKE + POC DONE (2026-07-20) — use STRUCTURAL DEEP-CLONE (Option A).**
  My first read-only pass recommended the conservative replay-to-T; a deeper
  separate-session POC then proved **deep-clone is the better call and cheap**:
  - `Match` has ONE randomness source (`readonly rng: Rng`, `Match.ts:252`; whole state
    = a single u32 `s`; **no `Math.random`/`Date`/`performance.now` in the sim path** —
    only UI/render/profiler). `private` is erased at runtime → `rng.s` is read/settable
    externally, so **no sim file needs editing** to capture/restore it.
  - CLOSED state graph: fixed `DT=1/60` (full match = 14,400 steps), no cross-run module
    state (the "A-then-B" determinism test proves it) beyond a dt-keyed trig cache + a
    const config flag. The ONLY object refs needing remap are `Ball.owner`/`lastTouch`;
    `Team.chasers/marks/runners` are Set/Map (structural, not JSON, clone); everything
    else is gid-indexed, no closures (`ActionState` is pure data).
  - A generic prototype-preserving, cycle-safe cloner gives **byte-identical
    continuations**: POC (`scripts/probes/_poc-clone.ts`) = **25/25 cases (5 seeds × 5
    freeze ticks incl. half-time) identical for 4 s + identical full-match remainder**;
    negative control (1-bit RNG nudge) **DIVERGES** (assertion non-vacuous). Cost
    **~275 µs/clone vs ~94 ms replay-to-T ≈ 342× cheaper**; replay-to-T stays the
    trivial fallback.
  - ✅ **Mainline primitive now landed (2026-07-21):** `sim/cloneState.ts` promotes the
    field-agnostic cloner with a 4s byte-identical continuation regression, and
    `pass-target-counterfactual` is its first real consumer. It freezes the state just
    before a live pass decision and forces chosen-target vs alternative-target branches
    from identical RNG. The first S7 run correctly **failed** payoff (509 pairs:
    alternative/chosen dominance 34.4/35.6%; team possession 53.4→49.1%), proving the
    oracle can veto a plausible-looking estimator rather than rubber-stamp it.
  - ❌ **S7c static two-sided threat also failed honestly (2026-07-21):** a
    pre-registered shooting-window + turnover-corridor extension left 363 paired
    rollouts, but alternative/chosen dominance was 34.4/35.0% and own-team
    possession fell 53.4→47.1%. The implementation was fully reverted with no
    coefficient/tolerance sweep; the negative audit remains in
    `world-model/S7C-THREAT-POTENTIAL.md`.
  - ❌ **S7d temporal flight interception also failed complete payoff
    (2026-07-21):** the route margin itself calibrated strongly (risky pass
    received/intercepted 64.7/28.6%; safe 88.7/3.5%), but adding it to S7 left
    only a +0.9pp alternative dominance edge and reduced own possession
    51.1→47.0% over 219 paired rollouts. Its implementation was fully reverted;
    `pass-target-counterfactual` retains first-controller/pass-resolution anatomy
    so the next hypothesis can distinguish flight failure from post-reception
    failure. See `world-model/S7D-FLIGHT-INTERCEPTION.md`.
  - ✅ **The retained anatomy found the next causal boundary:** within the 212
    paired branches where both intended targets first-controlled, the original
    S7b alternative/chosen dominance becomes 38.2/28.8%, possession 65.6→67.5%,
    progression +1.181m and xG +0.006. S7 therefore needs a contingent transition
    model (`receive / teammate / opponent / dead / loose` → conditional next
    state), not another independent Pareto feature and not another live cut.
  - ✅ **Horizon sensitivity confirms the split:** at 3.0/4.5/6.0s, aggregate
    dominance gaps are −1.2/−3.5/+2.2pp and never pass, while macro-possession
    direction flips. The `bothTarget` conditional gap stays +9.4/+5.6/+8.0pp
    with positive progression and xG throughout. Keep 3.0s as the frozen total
    baseline; use event-anchored diagnostics to design S7e, not to cherry-pick
    a favourable fixed horizon.
- ⭐ **This does NOT gate S7.** Live bounded-lookahead uses the CHEAP analytic estimator
  (ETA / pitch-control / next-options), never a Match rollout (too slow per-tick under
  either scheme) — the clone-vs-replay choice only touches the offline oracle, so the
  online=never / offline=oracle boundary above holds cleanly.

---

## 9. Build order (merges the user's revised sequence + the probe classification)

1. Write [`SUBSTRATE-MAP.md`](SUBSTRATE-MAP.md) + this doc. ✅ (this pass)
2. **Settle the tree:** commit `position-aware budget` + keeper; **revert the
   `vision` 10th-attr wiring** (1 call site) → clean slice-1 baseline HEAD.
3. Build the **BASELINE-NOW** probes (§5) + run the full EXISTING suite; **freeze
   baseline JSON** on the settled HEAD.
4. **Feasibility spike** for `counterfactual-value` (§8); build it if (a) is cheap,
   else scope the replay-to-T version.
5. **Begin Pass–Arrival–Contest slice-1a** (SUBSTRATE-MAP §5), one sub-step at a
   time, each verified in the six-layer order: **mechanism → gene-bite → capability
   → payoff → fresh-evo → ecology → replay clips.** LAYER-GATE probes come online
   as their layer lands.
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

**Commander ruling #8 (2026-07-25): E2a-1's P3 FAIL accepted as a correct
catch — the pass-log census is a SELECTED sample (the live chooser already
filtered for options it liked), and the honest population for an unseen-man
prior is the OPTION SPACE the evaluator prices. E2a re-posed as E2a-2: a
counterfactual fork-and-force census (intervene on target choice only, live
execution machinery, bit-identical reproduction of the chosen pass as the
harness gate). Direction findings are reported, never gated. Routing re-keys
onto the priced quantity. E2b's aiming rule settled: priced always,
executable only with an honest aim point; the price-vs-aim gap is the
causal seat of look-before-pass. Full text in §3 (h)–(l).**

**Commander ruling #9 (2026-07-25): E2a-2 PASSED (real selection bias:
13pp, not 0.18pp) and the executor's E2b split is accepted — E2b-0
measured the corridor read's exchange rate into probability (PASS,
39.72pp discrimination) so no invented weight ever joins the axes. E2b-1
constraints: name the third information class (READ / SEEN-UNREAD 28.48% /
UNSEEN), common unit = measured probability, no double-counting of the
touch term (corridor factor from reach-based outcomes × E1a-certified
formula at flag-ON), look-pressure reported on both axes. Green path runs
to E4. Full text in PROGRAMME ruling #9.**

**Commander ruling #10 (2026-07-25): E2b-1's split verdict disposed — the
science is BANKED (G1 not-looking never won, oracle lift +4.61pp; G2 the
route mix survived perception, S3b's collapse did not reproduce; those two
gates are the graves S3b and C1-B died in, now passed in dormant form) and
both failures are plumbing. X3 ruled: determinism hashes cover world
outcomes only, perf reports alongside (PROBE-CONTRACTS codified); the FAIL
stands for this run, the redraw pre-registers the corrected scheme. G3
ruled: E2b-1R redraw with CONSUMPTION-SCOPED perception (defender entry
reads a ball-only percept; full snapshot only at pass-decision moments) —
honesty frozen (scan cadence / FOV / retention / keyed error untouchable),
budget stays 1.25×, and the decisive new gate is behaviour-neutrality:
same seeds → the redraw's logged choices must be IDENTICAL to E2b-1's.
R1's correction supersedes the 28.48% number (§4). Green path: E2b-1R
PASS → E3 draft → stop at E4.**

**Commander ruling #12 (2026-07-25): E3 FAILED five gates and the thesis is
amended by its own measurement. X4's achievement stands banked — the first
live perceived choice, 0/10,292 divergence from the probe that validated
it. The ablation names touch cost as the failing component and R1 proves
the break is mechanical (spill → loose → aerial; the chooser never chose
it), so "the bundle makes the cost survivable" is REFUTED — information
was the wrong co-evolution partner for a mechanical tax. Touch cost leaves
the v1 live set (§2), re-seated to a future C5-coupled slice where the
receiver's craft can absorb it. E3R re-audits the 1+3+4 bundle in FULL
(ablation diagnostics are not passes): re-bank the choice reference with
flag-off-honest pricing first, then X4 chains to it; both style-entropy
hypotheses pre-registered (touch-flattening vs genome-blind chooser);
perf lever = candidate-scoped snapshots at pass-commit; 20–80 dominance
band kept with its purpose documented. Green path: E3R PASS → E4.**

**Commander ruling #13 (2026-07-25): E3R 26/28 — the revised thesis passed
its own full audit (§2 band all five in, dominance 21.86% stable, co-evo
restoration +0.2864→+0.0282 — first pass ever on the vision-attr gate;
X4R 0/10,292; the ruling-#12(a) premise disproven-and-proven: the banked
reference was already flag-off-honest). CE2's verdict stands but the gate
was mis-typed (single-seed ecological claim; H2 refuted by its own three
discriminators + the seed flip to 1.5321) → CE2R = 5-seed median entropy
≥0.60 + discriminators as co-gates. X5R: lazy reconstruction APPROVED,
semantics registered as PULL (knowledge = what your scans would have
shown, materialised when you act; values constructionally identical),
under perpetual equivalence pins + choice identity + unchanged budget.
Stamina carries to E4 as a feel item (calmer play is an ordered emergent
consequence); fatigue-economy re-seat registered as the post-ship slice.
E3R2 is narrow: the two gates only. PASS → E4 + F-ACCEPT.**

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
   choosing. **⛔ REMOVED FROM THE v1 LIVE SET by ruling #12 (2026-07-25,
   E3's measured verdict): the band break it causes is MECHANICAL — spill →
   loose ball → aerial route, with no decision anywhere in the chain (R1:
   the chooser's long share 19.06% vs 18.05% dormant) — so seeing the cost
   cannot absorb it. Bundling with information was the wrong co-evolution
   partner; the right one is the RECEIVER'S CRAFT: when cushion-vs-one-touch
   is a priced choice (C5), receivers can ADAPT to hot balls instead of
   mechanically spilling. E1b's curve stays BANKED dormant (the measurement
   is never wasted); its live entry re-seats to a future C5-coupled slice.**
3. **Perception-based pass choice** (the S3b redo): the passer reads its own
   `PerceptionSnapshot`, not truth.
4. **Perception-based defensive read** (the co-evolution partner): the
   interception decision reads perceived state through the same machinery.
   Attr wiring follows SUBSTRATE-MAP's ruling: a shared `awareness` trunk,
   attack/defence asymmetry left to other attrs — no one-sided reading attr,
   ever again.

**v1 LIVE BUNDLE after ruling #12 = components 1+3+4** (the pair the E3
ablation measured in-band on every dimension: chooser alone −21.69% goals,
chooser + perceived defence +2.20%). The evaluator prices the world AS IT
IS — flag-off touch physics — never phantom costs.

OUT of v1, explicitly: one-touch decision (C5 — second cut, unless E3
evidence demands it), off-ball movement changes, TeamBrain refactor, live
D-PROC/D-MUT consumers, coach doctrine/familiarity, multi-target attention,
aerial work (C4). Feints remain a future observation, never a mechanic.

**Also OUT, registered by ruling #11 (2026-07-25) so nobody later claims
more honesty than v1 delivers: perception-honest pass AIMING.** The v1
honesty claim covers the CHOICE (chosen from the passer's own snapshot,
executable-only, measured axis). EXECUTION still runs the legacy machinery,
which leads the true target — the same truth-aimed kick the current game
gives every pass, so E3's §2 band compares like with like and E2b's banked
choices (validated under exactly that execution) chain through X4 without a
seam. Aiming at the REMEMBERED position instead — where passes to a
departed runner honestly miss — changes mechanics for every pass and
belongs to a future slice beside C-track lead/weight craft.

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

    ⭐ RULING #8 AMENDMENT (2026-07-25, after E2a-1's P3 FAIL caught the
    selected-sample truth: a census of PLAYED passes inherits the live
    chooser's filter, but the prior must price options nobody chose and
    nobody saw). E2a is re-posed as **E2a-2, the OPTION-SPACE census**,
    measured counterfactually — the honest population is the candidate
    set E2b will actually price:

    (h) Sample real in-play decision moments from fresh seeds; enumerate
        the FULL candidate set (every outfield teammate per E0's candidate
        definition); for each candidate FORK the deterministic world and
        intervene ON TARGET CHOICE ONLY — power, lead and execution run
        the live machinery pointed at the substituted target. That
        measures exactly "what happens if the passer chose X instead",
        the quantity the evaluator prices. Outcome definitions and
        adjudication-class decomposition (incl. the ~25% never-adjudicated
        share) carried over from E2a-1 unchanged.
    (i) EXACT harness gate: forcing the pass the live AI was about to
        play must produce a continuation BIT-IDENTICAL to the unforked
        match — the fork proves itself against observed reality before
        any counterfactual is trusted. Forced targets the execution
        machinery cannot play are logged as their own outcome class
        (unplayable), never silently dropped.
    (j) The visible-vs-unseen DIRECTION is REPORTED, never gated — P3's
        lesson is that beliefs about which way the world leans do not
        belong in validity gates when they can be measured; E2b's
        not-looking-must-not-win stays the behavioural enforcement point.
        Registered prediction (not a gate): option-space rates land below
        pass-log rates; the delta is the first measured CHOOSER LIFT
        (how much value the live target-chooser adds over uniform choice
        — near-zero would itself be a substrate finding, consistent with
        the speed-blind evaluator). E2a-1's census stays banked as the
        chosen-subset reference and one side of that diagnostic.
        Pessimism-by-construction is REJECTED (an invented constant —
        the amount of pessimism can only come from a measurement, which
        is this recensus); accept-and-let-E2b-judge is REJECTED (building
        a consumer on an input known-mispriced at its own gate is E0b's
        lesson inverted).
    (k) RE-KEY, codified: a routing predicate must key on the statistic
        its consumer actually reads, never a proxy (E2a-1's P4 keyed on
        flat interceptedRate while the priced axis, receptionSuccessRate,
        carries a real 8.32pp gradient — same error family as
        label≠metric). E2a-2's routing keys on the priced quantity.
        Pricing classes for E2b: fully-unknown (targetMissing, no memory)
        → MARGINAL by construction, the distance is unknowable;
        stale-memory (last-known position within retention) → BANDED at
        the remembered distance — the 8.32pp gradient is what memory is
        worth, the S3 layering paying off. E2a-1's frozen result stands
        untouched.
    (l) E2b aiming rule (settles the question E2a-1 §6 flagged): unseen
        options are PRICED always (zero deletion holds), but EXECUTION
        requires an aim point the passer honestly possesses — a current
        percept or within-retention memory. A zero-information teammate
        can win a price comparison but cannot be kicked to; no last-known-
        beyond-retention or role-anchor aiming, which is truth-fallback
        by the back door. The gap between "prices well" and "cannot aim"
        is the causal seat of look-before-pass — E2b REPORTS how often a
        blind option out-priced every executable one (the look-pressure
        statistic, a future gaze consumer), and its choice A/B runs over
        executable options only.

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
* E2b-0 calibration (banked 2026-07-25, calibration SHA `52c10713…3082`):
  corridor-threat quintile → realized reception success 82.86 / 62.31 /
  50.97 / 47.15 / 43.14% — the measured exchange rate from corridor seconds
  into probability, 39.72pp discrimination. Read-vs-band: the corridor read
  spreads outcomes 39.72pp, the distance band 6.64pp (~6×) — looking's value
  is the lane read only a current percept supports (A4's boundary
  pre-registered: doctrine buys priors and latency, never lane reads).
  Third information class: real but nearly empty — **SUPERSEDED by E2b-1
  (ruling #10): the banked "28.48% SEEN-UNREAD" was the evaluator-null share,
  a MIXED class that is mostly UNSEEN targets; the true SEEN-UNREAD share is
  ≈0.2%.** The taxonomy stands, the magnitude was mis-attributed.
  Look-pressure lives on the read axis (blind 55.72% ≈ mean executable band
  55.81%);
* E2b-1 science (banked 2026-07-25 despite the run's plumbing FAIL —
  ruling #10): **G1 not-looking did not win** — realized success 63.28 /
  64.60 / 63.46% across awareness 0.2/0.5/0.8, oracle 67.90%, every rung
  inside the −2.0pp non-inferiority band, endpoint lift +4.61pp; **G2 the
  route mix survived perception** — long-option share 13.31 / 17.72 /
  18.05% vs oracle 18.07%, S3b's ~38% collapse did NOT reproduce: the
  base-rate prior does exactly what it was built for. Look-pressure banked:
  a blind option out-prices every executable one in **9.17%** of moments at
  awareness 0.8 (17.03% at 0.2) — the future gaze consumer's workload.
  Evaluator-vs-live-brain agreement is only **47% under omniscience**: the
  evaluator is a DIFFERENT chooser, so E3 must expect play to CHANGE and
  measure whether the change stays in band. Side finding: threatened lanes
  also deliver dirtier balls (P(clean|reached) 93.8→89.0% across threat) —
  pressure arrives with the ball;
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

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -i 'ruling|E5|E4|ship|sealed|power|multip|alpha|confidence|interval|seed|season' docs/world-model/PROGRAMME.md | head -n 300"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
59:(the S3b redo, both sides reading), pass power (C1), first-touch decision
60:(C5), shipped only through six-layer + §2 band + user play-test. Until that
70:> user gates).** The delegated queue `ship B1 + apply B2 → C1-Phase0 →
71:> A3(D-MUT-0)` was executed in one session: B1 shipped, B2 applied,
75:> **COMMANDER RULING on the three open forks (2026-07-24, pending the user's
114:> 1. ✅ **D-TRI-0 DONE — PASSED** (ruling #2 executed): three bodies resolve a
120:>    (recommended, `PASS-POWER-SLICE.md` §13.4) or spend the one unspent redraw.
121:> 3. ✅ **D1 BUILT** (ruling #3) — dual shell in place, fingerprint unchanged.
126:> **COMMANDER RULING #3 (2026-07-24, pending the user's one-word ratification):**
137:> stages E0–E4, each pre-registered individually by the autonomous session;
138:> E1 consumes the C1-B redraw in its correct home; NO partial ship in either
139:> direction; E4 = the user's play-test, final.
141:> Recommended queue on ratification: `E0 → E1 → E2 → E3 → E4(user)`, with
145:> **COMMANDER RULING #5 (2026-07-24 — the D-TRI sync race + E1a re-stage):**
165:> 3. **E1a re-stage GO**: a REAL intended pass, power-swept to foot speed
177:> **COMMANDER RULING #6 (2026-07-25 — the E1a split verdict):**
190:>    the powered flat-vs-rising test is SUBSUMED by E1b's same-seed OFF/ON
192:>    — more power than any standalone redraw). Disposition recorded in the
195:>    type — equivalence/flatness claims must be pre-registered as interval
196:>    tests with pre-computed power; a strict point inequality where SE
199:>    cost AND blind-side cost (misalign 0.100→0.348 with power — real
208:> **COMMANDER RULING #7 (2026-07-25 — E1b accepted; E2 split and constrained):**
214:>    digit, and nothing shipped (`edsTouchCost` default OFF, fingerprint
221:>    "all three seeds diverge" → "at least one" was exactly the sixth
229:>    calibration as a powered interval test). **E2b** = the both-sides A/B:
233:>    route-mix gate vs the S3b collapse signature (powered interval);
239:>    (E2b may proceed on an E2a PASS without a new ruling).
241:> **COMMANDER RULING #8 (2026-07-25 — E2a-1's selected-sample catch; the
253:>    (live machinery does power/lead/execution). EXACT harness gate:
278:>    Autonomous mode; on its PASS, E2b proceeds without a new ruling
279:>    (ruling #7's provision carries over).
281:> **COMMANDER RULING #9 (2026-07-25 — E2b-0 accepted; concurrency rule;
282:> E2b-1 constraints; green path to E4):**
318:>    §3's gates, no new ruling needed); the queue stops at **E4 — the
321:> **COMMANDER RULING #10 (2026-07-25 — E2b-1's split verdict; the
329:>    passed in dormant form. X5's factors multiply back. What failed is
345:>    BEHAVIOUR-NEUTRALITY: same seeds, same moments → the redraw's logged
359:>    (Autonomous mode) → queue stops at **E4, the user's play-test**.
361:> **COMMANDER RULING #11 (2026-07-25 — E2b-1R accepted; E3 reviewed, GO):**
377:>    nothing ships, E4 is the user's.
384:> 4. Standing user gates after E3: **E4 (the bundle) and F-ACCEPT (art
387:> **COMMANDER RULING #12 (2026-07-25 — E3's verdict; the thesis amended by
413:>    confirmed live). No partial ship: nothing goes to E4 until E3R
422:>    verbatim on the 1+3+4 bundle, fresh sealed evo included. (c) STYLE
438:> 5. **Green path: E3R PASS → E4 + F-ACCEPT** (one play session can serve
441:> **COMMANDER RULING #13 (2026-07-25 — E3R 26/28; the last two gates get
453:>    single-seed entropy floor is an ecological claim gated
454:>    non-ecologically (PROBE-CONTRACTS' own type table says multi-seed;
458:>    club-dependent (0.60m), and the robustness seed flips the statistic
460:>    E3R2): median style entropy across 5 fresh sealed-evo seeds ≥ 0.60,
472:>    this seat explicitly — pull semantics is what ships in v1.
473:> 4. **The stamina finding carries to E4 as a FEEL item, never a
477:>    Whether a calmer game FEELS right is the user's judgment at E4. IF
478:>    the bundle ships, a fatigue-economy re-seat (stamina costs
482:>    CE2R multi-seed + X5R2 lazy-reconstruction-under-pins. The 26
484:>    transfer rigorous). **E3R2 PASS → E4 + F-ACCEPT**; CE2R median
488:> **COMMANDER RULING #14 (2026-07-26 — E3R2 accepted 29/29; E4 opens):**
493:>    rigorous transfer mechanism ruling #13.5 asked for, delivered as
496:>    with 4/5 seeds ABOVE 1.0 — under this bundle a typical world is MORE
501:>    fresh seeds with mostly-negative noisy paired diffs — there is no
503:>    gate's purpose in substance; a multi-seed CE1 form joins the
504:>    post-ship follow-up list beside the fatigue-economy re-seat. It
505:>    does not block E4.
506:> 3. **E4-PREP authorized (small, any session):** the two v1 flags
512:>    unchanged, CI deploy**. Live A/B on the user's phone IS the E4
513:>    instrument. At ship time the toggle's fate (keep as "legacy brain"
515:> 4. **E4 + F-ACCEPT are open — the user's eyes, nothing else.** Ship =
522:>    flat; fatigue re-seat is already queued if shipped.
524:> **COMMANDER RULING #15 (2026-07-26 — E4 round 1 disposed; the value
527:> 1. **E4 round 1: no ship, no revert — the direction is affirmed and
528:>    the flags stay default-OFF.** E4 becomes an ITERATIVE gate: the
529:>    user plays each round on the preview toggle; v1 ships when their
543:> 3. **E5 — THE VALUE AXIS — is authorized (executor drafts, Autonomous
550:>    the prior census — sufficient for v1, revisit if E5's own audit
560:>    not bolt the old bonuses back on. (d) Narrow audit before E4 round
568:> 5. **Seats 2 and 3 queued behind E5, in the user's priority order:**
572:>    one-touch vs control as priced choices, where ruling #12 already
574:>    audit and E4 round.
576:> **COMMANDER RULING #16 (2026-07-26 — E5's split verdict; the
579:> 1. **E5a is BANKED as a milestone:** the value half is measurable and
583:>    banked tables bit-exact. Whatever E5c attributes, THIS survives:
585:> 2. **E5b's FAIL is accepted exactly as pre-registered** — the central
603:> 4. **E5c — ATTRIBUTION — is authorized (executor drafts, Autonomous
610:>    re-run the E5b watchability probe with gates verbatim. HU
617:>    pre-powered band even after the top-up, i.e. the cell-indexed
619:>    state-conditional value slice (E5d) queues and its cost is weighed
621:> 5. **Seat 2 (gaze) HOLDS until E5c attributes.** Gaze widens the
626:>    eyes at E4 round 2, once a candidate table exists — not before.
628:> **COMMANDER RULING #17 (2026-07-26 — E5c: both hypotheses refuted,
631:> 1. **E5c is ACCEPTED — both refutations stand, and both carried real
654:> 3. **U1's E5a defect is ruled:** the never-adjudicated arrivals were
656:>    — the banked E5a table is SUPERSEDED-PENDING (never edited; its
660:> 4. **E5d — THE ATTEMPT-VALUE AXIS — is authorized (executor drafts,
665:>    and decisive, on E5c's existing forks:** build the
669:>    axis swap, the E5b watchability probe verbatim, narrow audit,
670:>    then E4 ROUND 2. Does NOT re-rank → the residual is the state
678:> **COMMANDER RULING #18 (2026-07-26 — E5d Phase 0: the axis re-ranks;
689:> 2. **X6's fire is ACCEPTED and it closes the E5a file:** staging
691:>    E5a's value window started at touch+12 against its own contract's
695:>    pay 6.04%; missed balls pay 2.85%, not 0). **E5a's table is now
704:>    options; E5a censused general touches and overprices the control
719:>    powered, band 2.0pp; staging/definition gates separated per
720:>    PROBE-CONTRACTS; the E5b watchability probe verbatim; §2 band,
721:>    dominance, perf pins, Y4V power-off identity; (e) table as SHA'd
722:>    data, chooser axis swap, then **E4 ROUND 2**.
727:> **COMMANDER RULING #19 (2026-07-26 — Phase 1's stop; C3 redrawn on
748:>    must be re-powered against the inheriting contract's parameters.
757:>    no new ruling:** table committed as SHA'd data → chooser axis swap
758:>    → the E5b watchability probe verbatim → narrow audit → **E4 ROUND
766:> **COMMANDER RULING #2 (2026-07-24, pending the user's one-word ratification):**
775:>    decision time. If ratio gates were failing, a budget raise is seed-shopping
778:>    `PASS-POWER-SLICE.md` §13.4); the unspent redraw stays unspent. C1-B's break
800:| A3b | **S3-G2 dual-target interleaved attention** (ratified entry to the three-body direction): with one gaze and 6 scans per 48-tick window, can an observer keep a qualified three-sample history alive on TWO moving teammates, where attending to one starves the other? Analytic groundwork inside the contract: the 253.74° field means at most one target is ever out of field, so this is a CADENCE problem with zero slack (strict alternation = exactly 3 samples each = the predicate's minimum). Zero `src/**` changes | [`DUAL-TARGET-ATTENTION-SCHEDULE.md`](DUAL-TARGET-ATTENTION-SCHEDULE.md) | ✅ **PASS 2026-07-24** (§9, SHA `bc242ff8…7d4c`, 96/96 accepted in 681 seeds, 93 completed, fingerprint unchanged, all purity audits zero): **dual fresh 88.2%** (≥80) · **dual qualified support 74.2%** (≥60) · single-target gaze starves the other partner in **92.5%** of the same windows (0.42 vs 2.81 fresh) · I never worse on A2 (100%) · and the cost is real — splitting hurt the attended partner in 86.0% (6.00→3.56). Run 1 was an **acceptance shortfall** (69/96 in the frozen 512-seed budget) = a hard escalation; resolved by raising the SAMPLING BUDGET only (§8.1, same seeds, every gate verbatim) — flagged for the user's veto. Carry-forwards for D-TRI-0: comparison is vs single-target gaze not vs no policy (body-facing holds both in 44.1%), and dual SUPPORT ceilings at 86% even truth-aimed. **D-TRI-0 authorised** |
801:| A3c ★ | ⚠️ **VARIANT ACTUALLY RUN — not the commander's drafted A5 design (see the disclosure note under Track A).** D-TRI-0 triadic motion-gated rotation — three teammates in a CHAIN conflict (A–B, B–C), each reading its TWO partners via S3-G2's interleaved gaze and running the UNCHANGED consumer once per partner (first reopening wins; no belief merging). Spends both banked bricks at once. New failure mode: **second-order churn** — a replacement admissible against partner 1 may conflict with partner 2's supported set. Zero `src/**` changes | [`TRIADIC-MOTION-GATED-ROTATION.md`](TRIADIC-MOTION-GATED-ROTATION.md) | **PRE-REGISTERED 2026-07-24** (ruling #2 ratified): seeds `95,000..99,095` (budget set generously ex ante — the S3-G2 shortfall lesson), completion ≥40/96, materiality ≥70%, **resolved ≥45%** (0.769² × 0.92 ≈ 0.54 derived), progress ≥75%, combined revisions ≤6 / per-player ≤3 / zero cycles. ✅ **PASS 2026-07-24** (§7, SHA `d3624042…b435`, 96/96 accepted in 366 seeds, **74 completed** (≥40), zero `src/**` changes, fingerprint unchanged, 702/702): materiality **97.3%**, **resolved 57/74 = 77.0%** (gate 45) — *identical to D-MUT-0's two-body 76.9%, the third body cost nothing* — progress 76.6%, combined revisions max 4 / per-player max 2, zero cycles, and **second-order churn 0 of 145 revisions**. Responders A 38 · B 51 · C 50, all three in only 27% ⇒ chains settle on one or two moves, not a scramble. Purity/identity audits zero for all THREE observers; N/M equality 96/96 physical + 96/96 evidence. **Fork is the USER's, as pre-laid: open A4, or prioritise the EDS** |
808:> ⚠️ **DISCLOSURE (2026-07-24, executor): A3c is not A5.** Commander ruling #2
833:| B1 | Perception sandbox: default-off render overlay (`src/render3d/PerceptionSandbox3D.ts`) | handoff consumed (ROADMAP B1 block) | ✅ **SHIPPED 2026-07-24** (user gate waived): tsc + build clean, 697/697, fingerprint exact `57b0bdab…c673` ⇒ render-only proven. B2 respec applies on top |
843:| C1 ★ | Pass power as a priced choice: launch speed stops being a pure distance formula (`prediction.ts:65`); 2–3 power options per candidate pass priced by the EXISTING interception/receivability machinery; technique-scaled execution noise; receiver control difficulty already priced by M3 touch≠control. First LIVE change since M4 — six-layer PROBE-CONTRACTS treatment, user play-test is the final gate | [`PASS-POWER-SLICE.md`](PASS-POWER-SLICE.md) §6–7 | ⚠️ **PHASE 0 DONE 2026-07-24 — premise survives, drafted Phase-2 shape REFUTED.** The power seat already exists (`orientationPowerMul` scales both lead and launch, `mechanics.ts:288-298`) and reception cost is real but weak (+0.010…+0.029 pFail for a 1.15 ball at 15m vs −17% flight time, and interceptors get demoted to deflections) — but the live evaluator (`laneOpenness`/`opennessOf`) is entirely **speed-blind**, so 2–3 power options score IDENTICALLY: the FIRES gate fails by construction. Fork in §7: **C1-A** dormant plumbing + noise + anatomy probe (bit-identical, authorised by §3) → **C1-B** honest speed-dependent M3 control cost (LIVE, user gate) → **C1-C** choice layer redrawn on C1-B's ledger. Ratified 2026-07-24; C1-C **deferred into the Embodied Decision Slice**. <br>✅ **C1-A SUBSTRATE LANDED** (§9): power executable + mis-executable, fingerprint `57b0bdab…c673` unchanged, 702/702. ⛔ **C1-A ledger FAILED** (SHA `249f7e41…c90a`): G1 non-monotone (0.477/0.570/**0.430**) and G2 inverted — diagnosed as *this contract's own* privileged 1.00 baseline (the only arm drawing no execution gaussian), a power-dependent lead that moves the corridor, and a 3s window in which world divergence dwarfs the effect. Pure touch-quality signal 12.9/10.6/12.5% ⇒ reception cost really is near-free ⇒ **C1-B mandated on measured ground**. Re-posed as **C1-A2** (§10, probe-only). ⚖️ **C1-A2 RESULT (§11, SHA `7e0ff4d5…257b`, 120/120, every arm spending 4 uniforms):** H1 **PASSES big** — contested opponent-first 0.565/0.489/**0.391**, spread **17.4pp**, and the ball reaches the intended man first 59→66→**76** of 120; H3/H4 pass. **H2 FAILS FLAT** — 11.9/12.1/11.8% spill: a ball arriving 3.6 m/s hotter costs the receiver NOTHING. ⇒ the convexity danger is now MEASURED (17pp risk cut for an unmeasurable penalty) ⇒ **C1-B mandated**, cost fixed in the substrate not the evaluator; ledger now trustworthy, no third re-pose. ⛔ **C1-B IMPLEMENTED → §2 BAND BROKE → HONEST REVERT (§13)**: the mechanism DID bite live (miscontrols 6.98→9.38, +34.4%, completion −0.4pp) but the band broke on TWO dimensions — goals 2.3944→2.0264 (**−15.4%**) and long balls 6.2042→7.9525 (**+28.2%**) — plus three behavioural suite contracts (wide-teams-cross-more INVERTED 28→21, stamina economy, free-agent market). Making ground control honest re-routes the whole game while the evaluator is speed-blind ⇒ structural, not tunable. Reverted, fingerprint restored exactly; the one permitted redraw is **deliberately unspent**. ⭐ Recommendation: fold the touch-cost fix into the **Embodied Decision Slice** (§0.5) instead of repricing touch alone. Also learned: C1-A2's H2 metric can't see this (it asks 'ended in control', and M3 recontact re-collects spills) — future attempts must measure the FIRST TOUCH |
862:`E0→E1→E2→E3, stop at E4 for play-test`). Each stage pre-registers its own
863:contract. Nothing ships partially, in either direction: E4 reverts the WHOLE
864:bundle or ships it.
868:| E0 | Dormant pass-option valuation: observation-only, 2–3 power levels, priced in flight time / corridor interception margin / touch difficulty. Must reproduce the C1-A2 ledger **including the world's near-flat reception cost** — modelling the defect is the point | [`EDS-E0-OPTION-VALUATION.md`](EDS-E0-OPTION-VALUATION.md) + [`EDS-E0B-OPTION-VALUATION-REDRAW.md`](EDS-E0B-OPTION-VALUATION-REDRAW.md) | ⚠️ **E0 FAIL → E0b FAIL; no third re-pose authorised.** ✅ Banked twice on identical numbers: the evaluator models the interception physics — per-state ranking by predicted corridor threat moves the MEASURED opponent-first rate **0.558→0.346 (21.2pp)**, safest=1.15 in **52/52** contested, flight time and arrival speed monotone. ⭐ Banked finding: at awareness 0.8 the passer can price **nothing** in 55/120 states, split by distance (21.7m unpriced vs 16.8m priced) ⇒ observation DELETES ~46% of options, mostly long ones — the mechanism behind S3b's route collapse and **E2's central design problem**. ⛔ Unsettled: what the world charges for pace at reception — three metrics disagree (eventual control ~0, raw-4-tick INVERTED, formula +4pp), and E0b's reproduction gate caught the raw metric contaminating its companion. **E1 must be re-scoped to build a trustworthy reception measurement first — the user's call** |
869:| E1 | ✅ **RE-SCOPE RULED 2026-07-24 (commander ruling #4, design contract §3 amended): E1a → E1b.** **E1a** = the trustworthy first-touch instrument at the real `attemptFirstTouch` adjudication, event-level, logging the TERM DECOMPOSITION (speed/pressure/misalign/technique) per event; must reproduce the formula's own speed term on controlled synthetic sweeps (an instrument that cannot see known physics is broken) and must SETTLE the E0b inversion (pressure-relief confound — faster ball ⇒ less closing time ⇒ lower pressure at touch — vs contamination); pure probe, zero physics. **E1b** = the flagged C1-B curve, default OFF, validated by E1a's instrument with the decomposition confirming the SPEED term moved; also run the E3 always-heavy canary cheaply here (if the dormant evaluator still prefers 1.15 in ~52/52 after E1b, the curve is too weak). Spends the C1-B redraw | [`EDS-E1A-FIRST-TOUCH-INSTRUMENT.md`](EDS-E1A-FIRST-TOUCH-INSTRUMENT.md) | ✅ **DISPOSED by ruling #6 (2026-07-25): E1b OPEN on I1's pass; I2 RETIRED (decomposition settled it; powered flat-vs-rising subsumed by E1b's OFF/ON contrast); E1b gains the two-channel amendment (design contract §3).** ⚖️ **E1a RUN 2026-07-24 — I1 PASSES, I2 UNDECIDED, probe verdict FAIL** (§6, SHA `93897f79…9c09`, twice byte-identical, zero new `src/**`, fingerprint `57b0bdab…c673` unchanged, 708/708). Re-staged per ruling #5.3 as a REAL intended pass power-swept 0.85–1.15 × distance 6–30 m: 44,100 staged passes, 25,491 adjudicated (57.8%), held conditions genuinely held (**mean pressure exactly 0**, misalign ≤0.0005). **I1: events 2,780/4,302/4,478/2,864** (floor 400) · **spill 1.691/3.278/4.757/6.494%, strictly monotone** · **|empirical − logged pFail| ≤ 0.311pp** (tolerance 2.0pp) and within 0.31pp of the closed form ⇒ the instrument sees known physics. Extra staging truth: the frozen world must never be allowed to play on (parked bodies walk the ball into an empty net, and the restart corrupts the next staging). **I2 does NOT decide**: clean rate 0.8868/0.9000/0.8919 is flat and non-monotone while predicted pFail rises +2.4pp; **pressure-relief is REFUTED** (pressure term −0.23pp vs speed +1.63pp), and an unbooked term appeared — **misalign rises 0.100→0.348 with power** (a faster ball arrives before the receiver has turned). The coded discriminator read the 0.5pp endpoint gap (SE ≈ 5.6pp at n≈60) as "rises" ⇒ `unexplained`. Reported, NOT patched — I2 was underpowered by construction. **Fork is the USER's** (§6): does I1's pass alone unblock E1b (§4 says yes), and is I2 redrawn (powered, discriminator as an interval test) or retired now that its hypothesis is refuted? <br>Earlier: instrument BUILT and behaviour-proven (`traceFirstTouch` default off; flag on vs off identical over 3 full matches incl. RNG state; fingerprint unchanged; logs speed/pressure/misalign/technique/pFail/clean per adjudication). ⚠️ **I1's synthetic sweep needs a redesign before its gates can be evaluated** — two structural findings: (a) below 6 m/s the world returns clean BEFORE the roll (`mechanics.ts:130`), so no adjudication exists to measure — slow receptions are free by fiat; (b) a loose rolled ball often never reaches an adjudication at all, because the M3 contact cushions it out of the retention window (buckets 7 and 13 gave 60/60 events, 9 and 11 gave none). Fix = stage a REAL intended pass and sweep power. Gates unchanged. **E1b stays unopened until I1 passes** |
870:| E1b | **Flagged touch-cost curve** (drafted by the executor under ruling #6): C1-B's exact one-liner `clamp01((speed−6)/8)*0.07 → clamp01((speed−6)/16)*0.24` behind `Match.edsTouchCost`, default OFF, validated by the E1a instrument on the I1 staging — OFF/ON at 1,300 reps per arm (≥11,300 events/bucket/arm, sample size computed ex ante for 3σ on bucket 7, the binding one), interval-test predicates only, two-channel decomposition, plus the E0 always-heavy canary | [`EDS-E1B-TOUCH-COST-CURVE.md`](EDS-E1B-TOUCH-COST-CURVE.md) | ✅ **PASS 2026-07-25** (§6, SHA `ca192bc8…2d59`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 709/709, 4/4 exact · 4/4 FIRES · 4/4 decomposition · 3/3 canary). 191,100 staged passes per arm; adjudication rate identical OFF/ON (57.6/57.4%) ⇒ the flag changes the roll, not the world's willingness to adjudicate. **X5 reproduction**: the OFF arm's first 300 reps return E1a's banked I1 run to the last digit (2,780/4,302/4,478/2,864 · 1.6906/3.2775/4.7566/6.4944%). **X2 cross-commit**: flag-OFF signatures identical to pre-E1b HEAD `19f7aa1` on all three seeds. **F1**: spill 1.696→2.437 · 3.278→4.818 · 4.820→7.853 · 6.162→10.465%, measured Δ **+0.741/+1.541/+3.032/+4.303pp** vs analytic **+0.547/+1.641/+2.734/+3.828pp** (worst error 0.475pp in a 1.25pp band = 1.07/0.34/0.85/1.35σ); logged pFail matches the arithmetic almost exactly (+0.586/+1.634/+2.753/+3.786pp). **F2**: the speed channel carries **≥99.996%** of the increase, pressure Δ **identically 0** (this staging holds pressure at 0 ⇒ the rise provably is not the refuted pressure-relief confound), misalign channel unchanged to 1e-5. **F3 canary**: predicted touch-cost spread **3.95 → 6.53pp** (floor 6.0), corridor read untouched, flag-OFF reproduction of E0 exact (7.34/11.29, safest-is-1.15 52/52) — ⚠ but E0's 'safest' is threat-ranked, so this sizes the cost (6.53pp against a 21.2pp opponent-first swing) and does NOT settle dominance: that is E3's gate, now forewarned. Diagnostic only (12 matches, no §2 claim): miscontrols 7.25→10.08 (+39.1%), goals 2.833→2.167 — C1-B's live signature again, recorded for E3. Also disclosed: **X2b was amended before the run** (§4.1, own commit `b8386cd`) after a smoke run showed 'all three seeds diverge' was itself the unpowered point test ruling #6 outlawed. Nothing shipped; `edsTouchCost` stays default OFF. **Queue advances to E2** |
871:| E2 | Both-sides perception (dormant build, probe-bundled), **split E2a → E2b by ruling #7**: **E2a** = census-derived base-rate prior table (committed as SHA'd data before any A/B, never adjusted after results) + pricing layer proven on E0's 120 banked states (unseen priced at prior, ZERO deleted for observability); **E2b** = both-sides A/B — evaluator = E0 corridor + E1b touch term, perceived state both sides via the shared-awareness trunk, not-looking-must-not-win directional gate, route-mix gate vs the S3b collapse signature, PERF hard gate at brain cadence. Always-heavy rate under combined pricing reported for E3 | Design contract §3 (ruling #7 constraints) · E2a: [`EDS-E2A-CENSUS-PRIORS.md`](EDS-E2A-CENSUS-PRIORS.md) · E2b TBD | ⚖️ **E2a RUN 2026-07-25 — P3 FAILS, everything else passes; QUEUE STOPS** (§7, SHA `93e25df4…0ea3`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 714/714, zero live callers). ✅ The census is sound: 21,457 passes in set A, held-out 21,822, **P2 calibration worst band 2.03pp of a 5.0pp interval and marginal 0.17pp of 1.5pp** ⇒ a measurement, not a fit. ✅ **The pricing layer works**: 360/360 options priced, ZERO deleted, E0's 55 vanished states now carry an honest base rate, unknowns read as unknown, and the 65 observed states reproduce E0 to the digit (X5). Table committed as data (`src/ai/passPrior.ts`, table SHA `326ea40e…4db0`). ⛔ **P3 fails by 0.18pp** (observed 0.686586 vs marginal 0.688400) — a COMPOSITION effect: real play is short-pass dominated (44% inside 14 m) while E0's acceptance rule surfaces a longer slice (35%), so my derivation's premise was backwards and the data corrected it. ⭐ **The structural finding worth stopping for: the census measures passes the AI CHOSE to play, but the prior must price options nobody chose and nobody can see** — a base rate over played passes is a selected sample, and in E2b the option set is EVERY teammate, a population the census never observed. ⚠️ Also found: **P4's routing rule keyed on `interceptedRate`, which is flat (1.58pp, non-monotone), while the priced axis `receptionSuccessRate` falls 8.32pp** — routing stands as frozen (marginal), re-keying is the commander's call. Three candidate directions in §7; none acted on. **E2b does NOT proceed** (ruling #7 conditioned it on a PASS) <br>✅ **DISPOSED by ruling #8 (2026-07-25): FAIL accepted as a correct catch; E2a re-posed as E2a-2, the counterfactual OPTION-SPACE census (fork-and-force, target-choice intervention only, bit-identical harness gate); routing re-keyed onto the priced quantity; E2b aiming rule settled (priced always, executable only with an honest aim). Constraints: design contract §3 (h)–(l). NEXT: draft E2a-2** |
872:| E2a-2 | **Counterfactual option-space census** (ruling #8): sample real plain-ground-pass moments, enumerate every outfield teammate at 6–30 m, fork the deterministic world per candidate and intervene on TARGET CHOICE ONLY — live power/lead/aim/bookkeeping. Harness gate: forcing the brain's own target must replay the match bit-identically | [`EDS-E2A2-OPTION-SPACE-CENSUS.md`](EDS-E2A2-OPTION-SPACE-CENSUS.md) | ✅ **PASS 2026-07-25** (§6, SHA `4180a246…817c`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 714/714, zero live callers, **X5 harness 3/3 bit-identical**, X6 table committed as data `df0aa340…1903`). 4,500 moments × 63 matches = **14,678 forks per set**. **P2**: worst gated band 2.98pp of a 6.0pp interval, marginal 0.30pp of 2.0pp (26–30 band under-sampled at 855 → reported, not gated, as pre-registered). ⭐ **R1 — the selection bias was 13pp, not 0.18pp**: option space **55.72%** vs chosen subset **74.34%** vs E2a-1's pass log **68.84%** ⇒ the live target-chooser is worth **+18.62pp** and E2a-1's prior was overstated by **13.12pp**. P3's tiny directional gate was the visible tip of a large structural error — the argument for keeping cheap directional checks. Interceptions 32.4% counterfactual vs 19.5% played. ⭐ **R2 — what memory is worth**: the priced-axis gradient survives de-selection but HALVES, 4.48pp vs the pass log's 8.32pp, and is **non-monotone** (peaks 59.73% at 18–22 m) ⇒ a consumer must read the band, never extrapolate along distance. **R5 registered blind spot**: 18.33% of the brain's own chosen targets fall OUTSIDE the 6–30 m window (almost all shorter) and take the marginal. R3 unplayable 3.84%, own target 3,675/3,675 playable. R4: 17.1% of arrivals never adjudicate. ⚠️ Disclosed: **P1 failed on its first frozen run (0.8167 vs 0.999) and the defect was my metric's denominator, not the world** — it divided by all moments incl. the 18.3% where the question is unaskable; an independent 300/300 check cleared the seam; corrected, re-run, and **X6 proves the census was byte-unchanged**, so the fix moved a validity counter and nothing else. Also: sampler restricted to plain ground passes (§3 conformance, found at smoke); pricing test re-pointed to the option-space table per (k). **E2b proceeds without a new ruling** |
873:| E2b-0 | **Threat calibration** (executor split of E2b, drafted under ruling #8's standing authorisation): a blind option prices as a probability and a seen one as seconds of corridor threat, E0 refuses a scalar score by design, and picking a weight to join them would be the invented constant ruling #8 rejected — so measure what the read is worth before choosing on it. E2a-2's fork-and-force staging reused verbatim + one read-only evaluator column | [`EDS-E2B0-THREAT-CALIBRATION.md`](EDS-E2B0-THREAT-CALIBRATION.md) | ✅ **PASS 2026-07-25** (§6, SHA `fdd6a1ad…eca2`, twice byte-identical, calibration SHA `52c10713…3082`, fingerprint `57b0bdab…c673` unchanged, 721/721, zero live callers, harness 3/3). **X5's second half is the licence for the whole thing**: the outcome census reproduces E2a-2's banked option-space table field for field ⇒ adding the observation really was an observation. ⭐ **The curve**: realized success by predicted-threat quintile **82.86 / 62.31 / 50.97 / 47.15 / 43.14%** — monotone, **39.72pp** discrimination against a 10.0pp gate, held out to ≤2.18pp per quintile and 0.12pp on the marginal. E0's P1/P5 sign now confirmed on the OPTION SPACE, not just per-state ranking. ⭐⭐ **R2 — seeing the lane is worth ~6× remembering the distance**: corridor read spreads outcomes **39.72pp**, the distance band only **6.64pp** (same forks, both predictors). Ruling (k) asked what memory is worth; the band is the SMALL half — what looking really buys is the corridor read only a current percept supports. This is the substrate argument for looking, in outcomes. ⚠️ **R3 — a third class E2b-1 must name**: **28.48%** of playable options carry no evaluator read at all (E2a-1 saw 0 of these on its narrow states); they are neither seen-and-priced nor absent-and-marginal, and the layer currently folds them into the banded case. ⚠️ **R4 — look-pressure is entirely a function of the read**: a blind option prices 55.72% vs 55.81% for the mean executable band — indistinguishable — so on the band axis alone not-looking costs nothing; only the corridor read (43→83% spread) makes looking pay. Also: R1 touch term discriminates 18.7pp but flattens after Q2. **E2b-1 drafts on this PASS** |
874:| E2b-1 | **Both-sides perception A/B** (ruling #9.3): four awareness arms price the same moments from the passer's own snapshot on one measured probability axis (READ→E2b-0 curve, SEEN-UNREAD→band, UNSEEN→marginal), choose among EXECUTABLE options only, and each choice is forked and forced; the defence reads its own perceived ball in the same arm | [`EDS-E2B1-BOTH-SIDES-AB.md`](EDS-E2B1-BOTH-SIDES-AB.md) | ⛔ **FAIL 2026-07-25 — G3 perf and X3; QUEUE STOPS, E3 NOT drafted** (§7, SHA `732f8950…5332`, fingerprint `57b0bdab…c673` unchanged, 726/726, flags default-off). ✅ **The science passed.** **G1 not-looking does not win**: realized success **63.28 / 64.60 / 63.46 / 67.90%** (aw 0.2/0.5/0.8/oracle), every chain step ≥ the −2.0pp band, endpoint lift **+4.61pp**. ✅ **G2 — the route mix SURVIVES**, the gate S3b failed: long-option share **13.31 / 17.72 / 18.05 / 18.07%** ⇒ at awareness 0.8 the chosen-option distribution is **indistinguishable from omniscience**; S3b's ~38% collapse does not reproduce. ✅ X5 all three, incl. the factors multiplying back to E2b-0's curve (P(reached) 88.4→48.5%, P(clean|reached) 93.8→89.0% — a threatened lane also delivers a dirtier ball). ⛔ **G3 perf FAILS**: brain-cadence perception costs **1.329×** against a 1.25× budget (5.947→7.906 µs/step; p95 1.406× of 1.50 passes). Real work, honestly failed — per the stop rule perception gets cheaper, not the budget bigger; the defender entry needs only the BALL percept, which is most of the saving. ⛔ **X3 FAILS and it is MY defect**: the probe hashes wall-clock timings, so byte-identity is impossible by construction. Demonstrated rather than asserted — strip the perf block and two independent invocations hash identically (`fd4e33bc…4803` twice). Reported as it fired; a probe cannot both carry a perf gate and promise a byte-identical artefact, and that gate change is the commander's. ⭐ **R1 corrects a banked number**: separating the classes shows **SEEN-UNREAD is ~0.2%**, not 28.48% — E2b-0's 'unpriceable' figure was dominated by targets the passer cannot SEE (UNSEEN 37.8/22.7/14.2/0%), not by unreadable lanes. Ruling #9.3(a) characterised the class from the conflated number. **R2 look-pressure real**: a blind option out-prices every executable one in **9.17%** of moments at aw 0.8 (17.03% at 0.2); band axis 3.60/7.10%. R5: the evaluator agrees with the live brain only 38–47% ⇒ genuinely a different chooser. Nothing shipped |
875:| E2b-1R | **Consumption-scoped perception** (ruling #10.3): the O(1) ball percept the sim actually reads, `perceiveSnapshot` split into advance-memory / materialise-snapshot, probe materialises only at pass moments. Honesty frozen; budget unchanged | [`EDS-E2B1R-CONSUMPTION-SCOPED.md`](EDS-E2B1R-CONSUMPTION-SCOPED.md) | ✅ **PASS 2026-07-25 — every gate** (§6, world hash `dd6dbd0a…bf38` identical across two invocations with perf reported beside it, fingerprint `57b0bdab…c673` unchanged, 734/734). ⭐ **G3: 1.329× → 1.0692×** (p95 1.406 → 1.0728) — honest perception at brain cadence costs **6.9%**, and not one rule about what a body can see moved. The diagnosis held exactly: the sim only ever read the BALL, so scanning a squad and allocating an `ObservedPlayer[]` was work whose output was discarded. Flag-OFF measured **5.319 µs/step** vs the frozen baseline's 5.32. ⭐ **B1 behaviour-neutrality — all seven families exact** (realized success, long-share, mean distance, brain agreement, class shares, look-pressure ×2, chosen counts): 3,000 moments × 4 arms and not one choice changed ⇒ **G1 and G2 reproduce BY CONSTRUCTION** — *not-looking never wins* and *the route mix survives perception* are now VERIFIED, not merely banked. **X6 honesty pin**: the cheap ball path returns exactly what the full path returns, asserted in-probe every run + `tests/observeBall.test.ts` every commit. **X3 corrected scheme demonstrated its own point** — the perf measurement changed mid-development and the world hash did not move. ⚠️ Two disclosures, both fixed by making the redraw MORE faithful: a keeper-passer skip I had silently dropped (oracle arm 64.6→68.3% at smoke — a behaviour change wearing a performance costume; B1 exists to catch exactly this), and a perf measurement order that let drift land entirely on the ON arm (now interleaved). **E3 drafts next; queue stops at E4** |
876:| E3 | Co-evolution audit: sealed evo runs, full bundle ON — §2 band, route mix, the C1-B behavioural suite, no-strict-dominance (power usage must stay situational), co-evo restoration, style diversity | [`EDS-E3-COEVOLUTION-AUDIT.md`](EDS-E3-COEVOLUTION-AUDIT.md) | ⛔ **FAIL 2026-07-25 — five gates; QUEUE STOPS, the fork is the COMMANDER's** (§6, world SHA `e667f476…dc73`, world-deterministic across two invocations with perf reported beside it, fingerprint `57b0bdab…c673` unchanged, 744/744, flags default-off, nothing shipped). ✅ **X4 — the gate this stage rested on — PASSES ABSOLUTELY**: the live consumer reproduces E2b-1R with **0 disagreements in 10,292 per-moment comparisons** (3,000 moments × 4 arms) and **all seven banked aggregate families bit-identical at full float precision**; the band's own baseline arm reproduces C1-B's frozen numbers to 4 dp ⇒ same procedure, same world. ⛔ **§2 band BREAKS on two dimensions**: headers **+30.44%** and long balls **+45.20%** (±25%); goals −14.56% squeaked inside ±15%, crosses −16.55% and cutbacks −5.21% fine — **C1-B's signature, larger**. ⛔ **no-strict-dominance 17.42%** vs a ≥20% floor — and it fails on the ANTI-dominance side (preferred power 49.5/33.1/17.4% light/mid/heavy); two reported diagnostics shape the reading: pace still buys the corridor in **97.86%** of moments (E0's canary reproduces) but the three powers share one threat quintile in **49.43%**, so the coarse corridor axis lets the smooth touch term decide — a granularity property of the registered instrument, not of the world. ⛔ **co-evo restoration**: goals advantage +0.178 (gens 1–3) → +0.296 (gens 8–10), no shrink on a ±0.5-noisy series; ⛔ **style entropy HALVES** (0.497 of the flags-off run vs a 0.60 floor) while all 16 clubs keep distinct nameplates — labels kept, variety lost. ⛔ **X5 perf 1.3223×** mean (p95 1.3196× passes): a chooser reads BODIES, so E2b-1R's ball-only 1.069× saving is gone. Suite under the bundle: **stamina breaks; crossing and market — two of the three C1-B broke — now HOLD**. ⭐⭐ **The ABLATION (§4-authorised, §6.9) names the component**: take the touch cost OUT and the same bundle is **inside every band** (goals +2.20%, headers −0.43%, long balls +8.06%); leave it in alone and it IS C1-B to the decimal (−15.37%/+23.23%/+28.18%). And the chooser alone costs **−21.69%** of the goals while chooser+perceived-defence lands at **+2.20%** ⇒ **both-sides perception really does restore what it breaks** — the S3b/vision-attr lesson passing. R1 seals it: the chooser's own long share is 19.06% vs E2b-1R's dormant 18.05%, so **it is not choosing long balls — the re-route is mechanical, downstream of spilled touches, and bundling does not fix it**. ⚠️ Disclosed (§6.10): the ablation caught a DEFECT in my build — `refreshPerception` was gated on the defence flag alone, so `edsPerceivedChoice` was silently inert by itself; fixed, pinned by a test, and the audited world is **byte-identical before and after** (every gated arm runs the full bundle). R3 look-pressure 6.21%/3.62% · R4 divergence 62.23% · R5 no-executable 4.09% · live classes READ 90.80/SEEN-UNREAD 0.08/UNSEEN 9.13%. |
877:| E3R | Revised-bundle audit (ruling #12.3–#12.4): touch cost OUT of the v1 live set, the same five gate families re-run verbatim on perceived choice + perceived defence + the evaluator, chain-first re-bank, both style hypotheses pre-registered | [`EDS-E3R-REVISED-BUNDLE-AUDIT.md`](EDS-E3R-REVISED-BUNDLE-AUDIT.md) | ⛔ **FAIL 2026-07-25 — 2 of 28 gates; QUEUE STOPS at the commander** (§5, world SHA `655a98b9…9d59`, world-deterministic across two invocations, fingerprint `57b0bdab…c673` unchanged, 744/744, nothing shipped). ⭐⭐ **RULING #12's DIAGNOSIS IS CONFIRMED BY A FULL AUDIT: the §2 band HOLDS on all five dimensions** — goals **+2.20%**, crosses −8.91%, headers **−0.43%**, long balls **+8.06%**, cutbacks −4.75% (E3 broke at +30.44%/+45.20%), baseline arm again reproducing the frozen numbers to 4 dp. ✅ **C1 proves the premise correction**: constraint (a) assumed the banked reference carried flag-ON touch pricing — it never did (`heavyTouchCost` appears in no E2b probe; a READ price is the census composite), and the re-bank moved **not one digit** (7/7 families bit-identical), with **G1 and G2 re-holding** there; **X4R 0 disagreements / 10,292**. ✅ **no-strict-dominance PASSES at 21.86%** (45.85/32.29/21.86 light/mid/heavy) — constraint (e)'s registered expectation of a heavier shift under the shipped curve held (+4.4pp from E3's 17.42%), and the share is stable 0.195–0.222 across ten generations. ✅ **CO-EVO RESTORATION PASSES**: the goals advantage decays **+0.2864 → +0.0282** (gens 1–3 → 8–10) — the gate the vision-attr saga failed four times. ⛔ **STYLE DIVERSITY fails by 2.03pp** (entropy ratio **0.5797** vs 0.60; nameplates 16/16) ⇒ **H2 stands by the letter** — but its MECHANISM is refuted by all three pre-registered discriminators: cross-club long-ball spread WIDER under the bundle (1.977 vs 1.684 band · 1.505 vs 1.343 evo), genome expression STRONGER (corr(long balls, passBias) −0.222 vs −0.122 band · −0.624 vs −0.577 evo), and the chooser itself varies club to club (0.60 m of chosen distance, 3.32pp of long share). ⚠️ **and the gate's statistic inverts on the pre-registered robustness seed** `515151`: entropy ratio **1.5321** — the bundle is MORE diverse there. One final-generation entropy over 16 clubs has almost no power; the verdict stands as fired, but "H2 stands" should read as "this gate could not answer the question". ⛔ **X5 perf 1.3238×** (p95 1.3113× passes) after implementing constraint (d)'s named lever plus an allocation-free scan (isolated bench 1.4211× → ~1.32×; ball-only reference ~1.05×): the residual cost is the honest per-observation math itself (5 keyed-noise channels + body-turn trig, ~13 observations/step). `Math.hypot`→`sqrt` was tested and REJECTED (bit-different on 38% of 3M samples = a perceived-value change). The one honest lever left is **deferred reconstruction** (replay a body's in-window scans only when a consumer reads them, ~40× fewer observations, identical by construction) — costed, NOT built, because it decides what "the moment I looked" means and that is the commander's call. ⚠️ **Suite (constraint (f)): stamina breaks on the PERCEPTION bundle, not the touch cost** — measured, correcting my own pre-run suspicion: flags-off 0.9161 · choice-only 0.9308 · v1 bundle **0.9697** · E3 bundle 0.9626 (gate <0.93); honest perception makes the game CALMER (later commits, better-supported balls, less sprinting after loose ones), so the tank stops being spent. aerial + freeAgents hold. R4 divergence 61.14% · R5 no-executable 4.04% · look-pressure 6.59/3.78% · classes READ 91.07/SEEN-UNREAD 0.06/UNSEEN 8.88%. |
878:| E3R2 | Narrow re-audit (ruling #13.5): CE2R five-seed median style entropy + X5R2 lazy PULL perception under perpetual pins | [`EDS-E3R2-NARROW-REAUDIT.md`](EDS-E3R2-NARROW-REAUDIT.md) | ✅ **PASS 2026-07-26 — ALL 29 GATES; the queue reaches E4** (§5, world SHA `3cbb8b8c…456f`, world-deterministic across two invocations with perf beside it, fingerprint `57b0bdab…c673` unchanged, **751/751**, nothing shipped). ⭐⭐ **X5R2 — perception is PULL, and provably the same perception**: P1's perpetual pin (7/7, `tests/lazyPerception.test.ts`) has lazy and eager snapshots **field-for-field identical at every brain tick** across awareness 0.2/0.5/0.8/1.0; P2 gives identical world signatures AND identical choice traces on 3 seeds; **P3 returns 17/17 of E3R's banked live numbers BIT-IDENTICAL**, which is what makes ruling #13.5's transfer of the 26 rigorous rather than assumed. **Perf 1.32–1.38× → 1.1977× mean / 1.1529× p95** (budget 1.25/1.50) purely by computing when asked instead of when possible — scan cadence, FOV, retention and keyed error all untouched. ⚠️ One measured one-directional difference, pinned by its own companion test: pulled BETWEEN brain ticks (which no live consumer does) the pull is merely UP TO DATE — self proprioception current, retention expired — never better informed. ⭐⭐ **CE2R — style diversity HOLDS ecologically: median entropy ratio 1.5253** over five fresh seeds (0.779 · 1.525 · 3.405 · 1.466 · 1.922 — **four of five ABOVE 1.0**, i.e. the bundle usually leaves a world with MORE variety), nameplates 16/16 on every seed, and all three mechanism co-gates pass on the median (M1 +0.044 clubs not more alike · M2 +0.174 genome expresses no weaker · M3 0.454 the chooser is club-dependent). E3R's 0.5797 was the low tail of a heavy-tailed statistic ⇒ ruling #13.2's diagnosis confirmed, **the preference-seat fork stays closed**. ⚠️ Reported, not gated (CE1 is banked by ruling #13.1): across these five fresh seeds the advantage-shrink holds on only **2/5**, and the paired goal delta is mostly NEGATIVE and seed-noisy — there is no attacking runaway to restore from, but if CE1 is ever to carry weight in a ship decision it needs CE2's multi-seed treatment. |
879:| E4 ★ | Ship gate — **user play-test of the whole bundle**. Ship = flags default ON + fingerprint/perf rebaseline. Revert = the whole bundle | design §3 | **OPEN — the user's eyes.** ✅ **E4-PREP DONE 2026-07-26** (ruling #14.3): Settings → 🧬 Experimental now carries **“EDS preview: players act on what they SEE”**, which arms `edsPerceivedChoice` + `edsPerceivedDefence` **together** (never one alone — the ablation is why) from the **next kickoff**, so the A/B is runnable mid-season on the phone. Sticky at `evo:edsPreview`, localised, re-armed across every League swap (load / import / new league / reset / worker hand-off), and it announces itself in the feed. **Default OFF**, pinned by a test that walks the whole path (persisted default → `League.matchFlags` empty → a real fixture's Match has all three flags off) and asserts the pair arms together. Gates: tsc + build clean · **752/752** · fingerprint `57b0bdab…c673` unchanged · zero `src/sim`/`src/ai` behaviour change. Flag pair + storage key live in `src/game/edsPreview.ts` so the pin loads no renderer |
881:| E5 | **The value axis** (ruling #15.3): V measured by fork-and-force — what happened NEXT (shot within 4.0 s) censused per reception zone, committed as SHA'd data; the decision becomes measured-P × measured-V with no residual hand weight; central hypothesis = measured value REPRODUCES combination play without the hand-coded bonuses; then the narrow audit (§2 band + dominance + perf + the watchability instruments) | [`EDS-E5-VALUE-AXIS.md`](EDS-E5-VALUE-AXIS.md) | ✅ **E5a PASS 2026-07-26 — every gate** (§7.1, SHA `5cc529f7…2a7f`, twice byte-identical, fingerprint `57b0bdab…c673` unchanged, 759/759, zero live callers, table committed as data `0125071f…3bc9`). ⭐⭐ **The composition is a MEASUREMENT, not a weight**: P̂ × V̂ scored before any outcome predicts the conjunction it claims to estimate — clean reception AND a shot — at **4.014% vs 3.982% realized (0.03pp on 14,114 forks)**, with 7.71pp of top-vs-bottom discrimination. Ruling #15 (b) answered by measurement. **X5b, the licence, held exactly**: the reception census returns E2a-2's table field for field and the threat quintiles return E2b-0's curve digit for digit. V table over 7,864 clean receptions: 1.30 / 2.21 / 7.64 / 8.81 / 11.40 / 13.58 / 9.30 / 42.19% (own third → attacking-third-inner), **V2 discrimination 10.10pp**, held-out worst cell 2.49pp. R4: composed spread 8.03pp beats P alone 7.25pp and V alone 5.66pp. R5: the composed argmax differs in **30.66%** of moments. R6: the legacy brain's own targets already land in zones worth **+2.55pp** over the option space. ⚠️ Registered BEFORE E5b ran and deliberately not repaired: **4 of 8 cells miss the 400-reception floor and two are the attacking-third-inner cells**, so the most dangerous zone reads the marginal — *below* the outer third that is measured. ⚠️ Realized calibration non-monotone (Q2 1.42% under a 3.98% prediction) — why the gate was discrimination + calibration, never a five-point monotonicity claim. ⚠️ Disclosed: R3 as contracted is not measurable in this staging (the window is simulated only for clean receptions); the probe says so rather than printing a duplicate. <br>⛔ **E5b FAIL 2026-07-26 — 30/32 gates pass, the CENTRAL HYPOTHESIS does not; QUEUE STOPS, the fork is the COMMANDER's** (§7.2, world SHA `c3ee6659…c7c0`, world-deterministic, fingerprint unchanged, 759/759, flags default-off, nothing shipped). ✅ **Y4V flag-off identity is absolute**: 0 disagreements / 10,292 and 7/7 banked families bit-identical, G1/G2 re-hold. ✅ **§2 band INSIDE on all five and healthier than E3R's**: goals **+3.01%** (E3R +2.20%), crosses −5.94%, headers +1.26%, **long balls −7.66%** (E3R +8.06%), cutbacks +4.80%, baseline arm reproducing all five to 4 dp. ✅ dominance 25.09% · ✅ perf **1.180×** mean / 1.144× p95. ⭐ **The E4 round-1 table reproduces EXACTLY** — arms 0/1 are its staging and their first two seasons return all nine cited numbers to the digit, so ruling #15 rests on numbers that reproduce. ⛔ **H1 third-man 0.472×** (gate 0.85; v1 bundle 0.603× — the value arm is WORSE than what it was meant to repair) and ⛔ **H3 forward share −3.06pp** (gate −2.0; v1 −2.57pp). ✅ H2 overlap 0.835× (v1 0.741×) · ✅ H4 shots **1.175×** (v1 1.053×). ⭐ **What it DID do**: a more direct, more shooting, less circulating game — passes/match 80.8→63.9, chain 4.94→3.84, give-and-gos 0.457→0.533 (ABOVE flags-off), long balls 5.90→4.14, shots +17.5%; divergence from the legacy brain 55.9%, mean price = reception 0.658 × value 0.0808 vs a 0.0715 marginal ⇒ the chooser really is landing in above-average zones. It failed at the one thing it was predicted to fix. **Ruling #15 (c)'s pre-registered FAIL mode matches**: third-man play is definitionally a TWO-pass pattern whose value accrues to the NEXT reception, and a one-step V cannot see it — every one-pass-shaped combination counter (overlap, give-and-go) recovered or improved. Second candidate, named in E5a before E5b ran: the two unmeasured attacking-third-inner cells under-price the most advanced men, which is exactly H3's axis. **Not separated here, and separating them is a new experiment.** Per §6: no bonuses bolted back, no horizon widened, no outcome definition swapped; **E4 round 2 does not open** |
883:| E5c | **The attribution experiment** (ruling #16.4): (a) HU — a cell-targeted census top-up of the two starved inner attacking-third cells to the 400 floor, re-emitted as new SHA'd data, then the E5b probe re-run with every gate VERBATIM; (b) HM — on that residual, fork-and-force the pass to the licensed runner at pattern-active moments and ask whether the topped-up table still under-predicts what happens there, with the same moments' other candidates as the control | [`EDS-E5C-VALUE-ATTRIBUTION.md`](EDS-E5C-VALUE-ATTRIBUTION.md) | **PRE-REGISTERED 2026-07-26** — (a) X1–X4 · **U1 staging equivalence** (the fast two-walk staging must return E5a's Z6/Z7 rows exactly: 129/64 receptions, 0.09302…/0.421875 — the gate that buys the speed) · U2 rest untouched bit-for-bit · U3 committed = census · U4 ≥400 per cell per set · U5 held-out ≤5.0pp · **U6 the E5b re-run**: HU CONFIRMED iff third-man ≥0.85×, PARTIAL 0.653–0.85×, REFUTED <0.653× (the 0.05 margin on v1's 0.603× is ≈6σ on E5b's own counts), *with Y4V, the §2 band, dominance and perf all still passing*; (b) Y1–Y4 · M1 ≥600 clean receptions per arm · **M2 HM CONFIRMED iff the pattern gap (realized − predicted) ≥ +4.0pp AND the control gap is within ±2.0pp**. Stop rules: neither fires → a third cause nobody named, report and return; both fire → E5d queues against seat 2. <br>⛔ **RUN 2026-07-26 — NEITHER FIRES; the queue returns to the COMMANDER with a third cause named from the numbers** (§7.1–§7.3). ✅ **(a) PASS on every gate** (SHA `38c430e3…303e`, twice byte-identical, table SHA `a197b453…ed46`): **U1 the fast staging returns E5a's Z6/Z7 rows to the last digit**; Z6 129→**902 @ 11.97%** (held out 869 @ 12.20%), Z7 64→**400 @ 28.25%** (held out 400 @ 30.25%) against the 7.15% marginal — and Z7's banked 42.19% was the thin-sample mirage E5a flagged. ⚠️⚠️ **U1 ALSO SURFACED A DEFECT IN E5a, disclosed in §7.1**: E5a counted an arrival that never reached `attemptFirstTouch` as a reception (E2a-2's registered convention, correctly inherited) but **never simulated its value window**, entering it as a guaranteed non-shot — 34.48% of Z6 and 28.75% of Z7. Simulating them: they shoot at **7.07%/10.43%**, so those cells are deflated ≈2.4pp/2.8pp and **every other cell by an unmeasured amount**. NOT repaired (keeping the convention is what makes the topped cells comparable); re-censusing all eight and re-banking E5a is the commander's call on a banked milestone. My own probe was ALSO wrong against its contract (it excluded those arrivals, so U1 compared definitions instead of stagings) — corrected toward the pre-registration, after which U1 passes exactly. ⛔ **U6 — the E5b re-run, probe byte-unchanged, HU REFUTED: third-man 0.395×** (line 0.653×), *below* the un-topped 0.472× — the top-up made it WORSE. ✅ **But HU is CONFIRMED on the forward share**, a split the contract did not anticipate: −3.06pp → **−0.21pp**, failing to passing, because the most advanced men stopped being under-priced. Nothing else changed: Y4V 0/10,292, §2 band inside on all five, dominance 27.16%, perf 1.187×. The top-up pushed the game *further* the same way — passes/match 63.9→**56.5**, chain 3.84→**3.26**, give-and-gos 0.533→**0.255**, shots →15.54. ⛔ **(b) HM REFUTED narrowly** (SHA `1658231a…36d3`): pattern gap **+3.38pp** against a +4.0pp floor (n=608, ≈2.6σ from zero) with the **control at −0.06pp on 1,567** — the table is right everywhere else and under-predicts the licensed runner, just by less than the pre-registered band. ⭐ **B2 corrects ruling #16.3's geometric premise, measured**: third-man runners arrive Z2 51.8% / Z4 21.9% / Z3 18.3% and only **4.1% in the inner box** — the confound the ruling registered is not what the geometry does. ⭐⭐ **B4 + §7.3 name the third cause from measured quantities**: the licensed runner is a genuinely HARDER pass (clean reception **40.16% vs 51.77%** at the same moments), and per forced pass the pattern is worth **4.89% vs 3.80%** in realized shots while the chooser's own axis scores it **3.53% vs 3.83% — the composition INVERTS the true ordering**. The failure is neither coarseness nor state-blindness but **a per-option argmax over P̂ × V̂ declining a pass whose payoff is joint**; the legacy ×1.15/×1.3 multipliers were buying exactly that pass, and every one-pass shape survived because it never needed the subsidy. Three untested readings left for the commander in §7.3 — chief among them that **the joint is directly measurable on these same forks and the chooser is not using it** |
885:| E5d | **The attempt-value axis** (ruling #17.4): replace the two-factor composition with ONE measured quantity, `EV̂(shot | ATTEMPT, destination cell × threat band)` — every fork's window simulated and counted, clean/messy/unadjudicated alike, so the repair REMOVES a composition instead of adding one and closes E5a's unfollowed-window defect in the same census. **Phase 0 is free and decisive on E5c's own forks**; Phase 1 (fresh census → axis swap → the E5b probe verbatim → narrow audit → E4 round 2) is CONDITIONAL and its gates are deliberately not frozen yet | [`EDS-E5D-ATTEMPT-VALUE.md`](EDS-E5D-ATTEMPT-VALUE.md) | **PHASE 0 PRE-REGISTERED 2026-07-26** — X1–X5 · **X6 staging equivalence** (the clean-conditioned SUBSET of the attempt census must return E5a's committed marginal exactly, 7,864 @ 0.07146490335707019 — E5c's U1 lesson applied before it can bite) · C1 ≥200 attempts per bucket with a frozen fallback ladder (cell×band → cell → marginal) · C2 held-out ≤5.0pp/1.5pp · C3 discrimination ≥5.0pp and calibration ≤2.0pp · **R1 ORDERING RESTORED** (sign of EV̂(pattern) − EV̂(control) > 0 — reality pays +1.09pp, the composed axis scores −0.29pp, so the SIGN is the question and a magnitude would be invented) · **R2 ARGMAX MOVES** (+5.0pp of pattern-active moments where the argmax picks a licensed runner — deliberately about the DECISION, since a table that improves a number without changing a choice has changed nothing). Zero `src/**`. Stop rule: R1 or R2 fails → no re-rank, Phase 1 not entered, the residual returns to the commander as a DESIGN question. <br>⚠️ **RUN 2026-07-26 — THE AXIS RE-RANKS, and Phase 0 is still NON-PASS; the fork is the COMMANDER's** (§6.1, SHA `e42e75c3…1299`, twice byte-identical, fingerprint unchanged, **zero `src/**`**). ⭐⭐ **R1 + R2 BOTH PASS, decisively**: the composed axis calls pattern-vs-control a coin flip (**+0.05pp**) where reality pays **+3.18pp**; EV̂ says **+2.02pp** — sign restored — and at the 450 pattern-active moments the argmax picks a licensed runner **23.78% → 39.33%, +15.56pp** against a +5.0pp floor. **70 decisions change hands, not just a statistic.** Attempt-table gradient over the eight cells 1.05/1.63/6.03/7.01/14.59/14.10/17.75/**36.71%**, marginal 6.33% over 14,114 attempts (held out 5.87%); C1 14/40 gated, C2 held-out PASS, C3 discrimination **15.07pp**. ⛔ **X6 FAILED and is NOT re-amended** (I2's precedent, ruling #6.2): the clean subset's COUNT is E5a's **7,864 exactly** — the staging provably did not drift — but the rate is 0.07922 vs the banked 0.07146, because **E5a captured `shotsBefore` AFTER the 12-tick adjudication window**, so its value window ran `[touch+12, kick+240]` while its own contract says "within 240 ticks of the kick". Certain from code. I have now written X6 twice in a form that conflates DEFINITION with STAGING; the first form was unsatisfiable and amended before the run, this one fired and stands. ⭐⭐ **What it exposes is worth more than the gate**: on the same 7,864 receptions E5a's marginal is **7.146% as banked → 7.922% with the correct window start → 9.054% with every window simulated — deflated 1.91pp, 27% relative**, by two independent defects the attempt axis structurally cannot have. D5: of 14,114 attempts, 1,473 arrivals (18.7%) never adjudicate and pay **6.04%**, and attempts that never reach pay **2.85%** — both invisible to the composed axis. ⛔ **C3 calibration FAILED narrowly**: on the selected pattern-moment population the table over-predicts the CONTROL arm by **2.08pp** (band 2.0pp) while the pattern arm sits at 0.92pp — it does not touch R1/R2 (both are within-population comparisons) but it is the first thing a Phase-1 pre-registration must answer. Nothing shipped, no `src/**`, E4 round 2 still shut |
887:| E5d-P1 | **The attempt axis censused where it is deployed** (ruling #18.4): population = licence-triggered decision moments with the full candidate set; window `[kick, kick+240]` with every fork simulated and no adjudication conditioning anywhere; features stay destination-cell × threat-band with NO pattern-state feature added preemptively; table as SHA'd data → chooser axis swap (the composition REMOVED, `price = EV̂`) → the E5b watchability probe verbatim → narrow audit → **E4 round 2** | [`EDS-E5D-PHASE1.md`](EDS-E5D-PHASE1.md) | **PRE-REGISTERED 2026-07-26** — X1–X5 · **S1 staging pin and D1 definition pin SEPARATED** (ruling #18.2's codification, and the direct lesson of writing X6 twice as a mixed gate): S1 = two-walk staging ≡ Phase 0's per-tick-clone staging, attempt records identical in order; D1 = this window returns Phase 0's banked attempt marginal exactly (14,114 @ 0.06327051154881677) · T1 committed = census · C1 ≥200/bucket, ≥8 gated · **C2 held-out calibration on DEPLOYMENT moments, both arms, band 2.0pp NOT widened** (powered: n ≥ 1,500 per arm for SE ≲0.7pp) · C3 discrimination ≥5.0pp + held-out · then **the E5b probe verbatim**: Y4V, §2 band, dominance, perf, and **H1–H4 unchanged** (moving them now would make the whole slice worthless). ⚠️ Registered boundary: the live chooser fires at EVERY pass moment while #18.4(a) names licence-triggered ones as the deployment population — so the same calibration on the GENERAL population is REPORTED, never gated, and the question is answered by measurement rather than argument. <br>⛔ **CENSUS RUN 2026-07-26 — the alignment WORKED, one held-out bucket fired, and the phase STOPS BEFORE THE SWAP; the fork is the COMMANDER's** (§6.1, SHA `f9a1395b…707e`, twice byte-identical, fingerprint unchanged). ⭐⭐ **The split pins are the X6 lesson working**: S1 (definition fixed) — the two-walk staging produces attempt records IDENTICAL to Phase 0's per-tick-clone staging, in order, field for field; D1 (staging fixed) — this window returns Phase 0's banked attempt marginal **exactly, 14,114 @ 0.06327051154881677**. Two claims, two gates, each able to say which one moved. ⭐⭐ **C2 — the gate this phase existed to fix — PASSES on the aligned population**: pattern **−1.22pp** (n=5,195), control **+0.65pp** (n=10,269, was +2.08pp on the general census), marginal **+0.02pp**; both arms 3–7× the power floor and the 2.0pp band NOT widened. ⭐ **R2 closes the boundary I registered before the run**: scored on the GENERAL population the deployment table reads **−0.72pp** overall (licensed −1.09, unlicensed −0.66) — inside the same band, so aligning one end did NOT misalign the other. C1 16 gated buckets · C3 discrimination **13.41pp** · held-out marginal 5.62 vs 6.03%. Attempt gradient 1.16/0.68/4.30/6.88/9.48/14.25/16.62/**21.33%**. **R5**: 6,428 of 15,398 attempts are NOT clean receptions and still pay **2.15%** (clean pay 8.10%) — clean-conditioning was discarding a fifth of the realized value. ⛔ **C3's held-out BUCKET check failed on exactly one bucket** — cell4×band2, 11.91% vs 17.09% at n≈235, error 5.18pp against 5.0pp = **1.59σ, thin-bucket noise** — and the reason it could fire is **my own design error**: C3's tolerance was inherited verbatim from E5a's V3 where cells carried n≈1,000 (3.4σ), while this contract's bucket floor is 200. A floor and a tolerance taken from different experiments and never checked against each other; re-choosing either after seeing which bucket fired is what the discipline forbids, so it stands as fired. **Nothing swapped, table NOT committed as data, the E5b probe NOT run, E4 round 2 does not open, zero `src/**` behaviour change** |
889:**Queue state (2026-07-26): E5d PHASE 1 CENSUS RUN and STOPPED at the
893:skipping ahead past a FAIL, so the axis was not swapped and E4 round 2 does not
899:(X6: E5a's V is deflated 1.91pp / 27% relative by a late window start and
903:E5 + E5c RUN and returned to the commander: E5c's two
904:attribution tests BOTH refuted on their own criteria, so per ruling #16.4 and
907:4.89% vs 3.80%, scored 3.53% vs 3.83%). Two side findings need a ruling of their
908:own: E5a's V table is deflated by unfollowed windows (§7.1), and ruling #16.3's
909:geometric premise is refuted by measurement (§7.2 B2). E4 round 2 stays shut,
910:every flag default OFF, seat 2 still held. Earlier state — E5a PASS on every gate
911:(banked as a milestone by ruling #16.1: the game owns a validated value
912:instrument), E5b 30/32 with the CENTRAL HYPOTHESIS FAILED and accepted exactly
913:as pre-registered. E4 round 2 does not open and every flag stays default OFF
914:until E5c attributes; seat 2 (gaze) HOLDS per ruling #16.5. Nothing was repaired
921:> (since 2026-07-21), so the build the user plays was stale and E4 could not
938:> ⭐⭐ **E4 FEEDBACK, ROUND 1 (the user played it, 2026-07-26). No ship verdict
949:> **Measured, same seed, two seasons, flags-off vs bundle** (`npx tsx` two-arm
978:> rulings #8/#9 forbade invented weights, so the chooser is progression-blind BY
993:>    priced choice (C5, where ruling #12 already re-seated the touch cost).
1004:**How to run E4 (the deployed build, on the phone or the desktop):**
1011:   read runs off his own view of the ball. Everything else — power, aim,
1012:   execution — is the shipped game, and `edsTouchCost` is NOT in this bundle
1013:   (ruling #12.3 re-seated it to a future C5-coupled slice).
1014:3. Registered feel items (ruling #14.4): play is measurably **CALMER** — later
1018:   fatigue-economy re-seat is already queued if the bundle ships.
1023:Ship = both v1 flags default ON + fingerprint/perf rebaseline + a ROADMAP
1032:dimensions, power usage stays situational, and the ecology keeps its variety
1033:(median entropy ratio 1.5253 over five fresh seeds — usually MORE varied than
1038:**What E4 is, exactly:** the user plays. Ship = the three v1 flags default ON
1040:ruling #12.3) plus a fingerprint/perf rebaseline. Revert = the whole bundle.
1048:vs a 0.93 gate; ruling #13.4 carries this to E4 as a FEEL item, with a
1049:fatigue-economy re-seat registered as the follow-up slice IF the bundle ships).
1050:And per-seed CE1 is noisy (2/5 fresh seeds shrink), which is honest context for
1058:E3R passed 26 of 28 gates and E4 is NOT reached.** Ruling #12's amended thesis
1061:power usage situational at 21.86%, and the attacking advantage decaying
1072:   varies club to club), and the pre-registered robustness seed INVERTS the
1075:   commander now has to rule is whether CE2 needs a powered form (multi-seed,
1076:   multi-generation) before it can gate a ship — the sixth threshold type
1081:   values — needs a commander ruling because it decides what "the moment I
1084:**Plus one measured correction worth a ruling of its own:** the stamina
1088:finding for E4's play-test or a fatigue-economy re-seat; it is not a constant
1093:**(E3 result record) ⛔ E3 FAILED five gates and E4 was NOT reached.** The build did its job: the live
1100:1.3223× at brain cadence. Nothing shipped; every flag is default-off and the
1136:E2b was split by the executor under ruling #8's standing authorisation, on the
1143:look-pressure is a function of the read rather than the band. Ruling #7 (c)–(g)
1146:⚠️ **Sync (ruling #5)**: Track F (art direction) and D6 landed from another
1151:Earlier (after E2a-2): E2b was next and proceeded without a new ruling — E2a-2 PASSED on every gate. The prior is now measured
1155:outside the censused window and take the marginal. Ruling #8 (l) already
1158:Earlier (ruling #8): E2a-2 was the next step — E2a-1's split verdict is
1167:E2b's aiming rule is settled in the same ruling (priced always, executable
1171:Earlier (ruling #7): E1b PASSED on every gate and is
1172:ACCEPTED (ruling #7): the touch-cost curve is banked behind
1180:inherit: the canary sized the cost at 6.53pp against power's 21.2pp threat
1184:Earlier (ruling #6): E1a came back
1186:§6) and ruling #6 disposed it: E1b OPEN on I1's pass (the contract's own §4
1187:condition), I2 RETIRED (question settled by its decomposition; the powered
1190:and/or misalign carry the increase, pressure bounded; I1 staging, same-seed
1191:OFF/ON, interval-test predicates per PROBE-CONTRACTS' sixth threshold type;
1193:E1b: E2 (unseen-pricing amendment) → E3 (co-evolution audit) → **STOP at E4
1204:| D1 | Shell split: world-mode pages drop the match side-columns (floating mini-player instead); match-mode unchanged | UI-NORTHSTAR §全盘采纳 1 | ✅ **BUILT 2026-07-24** (ruling #3): `body.world-mode` toggles on the four world pages (+ settings and the entity-link deep dives resync it); both `aside` columns step aside, the live match shrinks to a 288×162 floating player top-right with a `⤢` restore control, and match-only chrome (cinematic enter, replay bar, reel bug, tacmap, perception readout) hides while the in-host score bug/banner shrink with it. Phones keep the stacked strip instead of a floating card. Zero sim contact: build clean, 702/702, fingerprint `57b0bdab…c673` unchanged. **Acceptance = the user's eyes** |
1205:| D2 | Evolution scatter: season trails + ghost points + hover/lock + generation slider | UI-NORTHSTAR §全盘采纳 2 | **READY** (D1 shipped 2026-07-24) |
1208:| D5 | Causal replay / counterfactual mode | — | LOCKED until counterfactual authority is productised (E2a-2's fork-and-force harness is its named seed) |
1209:| D6 ★ | **POV suite** (user-ratified direction 2026-07-25, "应该多搞,之后出效果再说"): player-eye BELIEF view — render what the player believes, not truth: unseen teammates as fading ghosts, ball gone when out of cone (9.4% of the time at 0.8 awareness), gaze visibly alternating between targets; plus the literal second person (watch a player through their marker's eyes) and a follow-cam. "就好像我们在踢球一样,能直观知道球员想干啥,看到了什么" | TBD — commander drafts after EDS ships | **LOCKED until E4 ships the bundle** — before EDS, live behavior is not perception-driven and a POV view would narrate behaviors that do not exist (UI-NORTHSTAR's deferral rule) |
1237:  screenshot A/B (fixed seed/camera/tick via the existing harness) as a
1245:| F1 | **Player-scale honesty** (user-ratified 2026-07-25: "渲染大于碰撞箱" — verified in code): visual arm-span is ≈1.32 m against a 1.05 m collision footprint (`PLAYER_MIN_DIST`), torso alone eats 82% of min separation — models clip during close marking and bodies read bloated. Fix = uniform visual shrink of the body model (root body scale, NOT labels/rings/halos) with the OBJECTIVE anchor **arm-span ≤ PLAYER_MIN_DIST**; proportion re-sculpting (slimmer torso) is a style call that waits for F0. Zero sim contact — collision constants untouched. Side benefit: pitch reads bigger through the user's existing cameras (broadcast/follow-ball) with no framing change | ✅ **DONE 2026-07-25 — AWAITING THE USER'S EYES** (`src/render3d/PlayerModel.ts`): one derived constant `HUMAN_MODEL_SCALE = 0.64` on a new `scaleRoot` group. Value is arithmetic, not taste: the widest body the game can build is a GK at the tallest hashable identity, arm-span 2 × (0.55 × 1.14 + 0.03 + 0.09 × 1.25) × 1.06 = **1.63134 m**; 1.05 / 1.63134 = 0.6436 → rounded DOWN to 0.64, giving **max arm-span 1.0441 m ≤ PLAYER_MIN_DIST**, nominal MF 1.32 → 0.845 m, nominal standing height 2.70 → 1.72 m. Pure `armSpan()`/`maxArmSpan()` + 3 contract tests pin BOTH directions (0.64 fits, 0.65 does not; the unscaled model provably did not fit). Gates: tsc clean · build clean · **717/717** · fingerprint **`57b0bdab…c673` unchanged** (measured before and after on the same tree) · zero `src/sim` contact · phone framing checked at 390 px. <br>⚠️ **Scope extended beyond the row, disclosed:** the shrink also applies to `RefereeModel`/`LinesmanModel`/`CoachModel` (same box-person skeleton, same constant) — shrinking players alone left the officials towering over the game, which the first screenshot pass showed plainly; "统一" reads as one human scale, not one class. The grounding blob moved INSIDE the scaled group (it is the body's contact shadow, not a marker — and it is absent from the ruling's labels/rings/halos exclusion list). <br>📌 **User verdicts on the three F1 forks (2026-07-25):** ① scale **0.64 RATIFIED** (the full-coverage anchor, over the looser 0.70/0.79 arms); ② **label height rides the shrink after all** — `y 3.15 → 3.15 × 0.64` on the player plate, `2.7 × 0.64` on the coach nameplate, and the declutter projection point moved with them (`3.1 × 0.64`) so overlap is still tested where the plate actually is; plate SIZE unchanged, so 标签不动 holds for the thing it was protecting; ③ **night is now up for grabs** — F0 renders every style arm in daylight AND night, so `ART_DIRECTION.md`'s "dark backdrop / four floodlights / atmosphere darker than the surface" rule is provisionally OPEN pending F0's pick. Still untouched: `PlayerShowcase`'s camera (`0, 1.75, 5.6` looking at `1.02`) now frames a smaller figure — an F1+ lever, not a defect of the anchor. <br>➕ **F1b, on the user's follow-up ("球的大小也得变吧"), same commit family:** every render fake sized against the bodies now rides the same constant — `BALL_VISUAL_SCALE 2.6 → 2.6 × 0.64` (radius 0.286 → 0.183 m, holding the M4-**accepted** 21%-of-body-height ratio instead of letting it inflate to 33%), the keeper's held-ball height cap and 0.3 m hand reach, and the synthesized ground-kick hop arc (1.8 m over a 1.72 m man was a moon shot). Re-gated: 717/717, fingerprint unchanged, build clean |
1246:| F0 ★ | ✅ **DONE 2026-07-25 — PICKED AND SHIPPED: arm (a) toy/board-game, daylight, night switchable.** The user chose (a) over (c), and asked for both lightings live, so `DEFAULT_STYLE='toy'` / `DEFAULT_LIGHTING='day'` now ship and time-of-day is a real player setting (LeftBar segmented control, persisted at `evo:lighting`, `Lighting/Day/Night` localised). `current` is frozen forever as the banked pre-F0 baseline the pick was made against — a test pins it literal for literal, and F-DIRECTION forbids editing it. Re-gated after the ship: tsc + build clean · **722/722** · fingerprint `57b0bdab…c673` unchanged · visual suite clean apart from two PRE-EXISTING stale assertions unrelated to Track F (`linesmen hold their touchlines` hard-codes `|z| > 29.4` but the `FIELD_SCALE 0.7` rescale put them at 21.1; `crowd > 200` now reads 192) — reported, not silently fixed. <br>Showcase as built: Arm **(b) broadcast realism-lite was DROPPED, not built** — the user asked whether it was worth seeing and the answer was no: it needs gLTF rigs + skeletal animation, which contradicts `ART_DIRECTION.md`'s own "no binary/external assets" rule, F0's own row flagged it phone-risky with skeletal animation as the quality ceiling, and the user's reference image is stylised rather than realist, so it was already answered. Arm **(c) was KEPT as the control** precisely because it is a strict subset of (a)'s work and answers the one question the eye can't: how much of the gap is mere incoherence. Implementation = a real seam, not throwaway: `src/render3d/stylePresets.ts` holds the arms as pure DATA (atmosphere, lights, grass palette/grain/wear, paint softness, chrome palette, floodlights, toon flag, contact-shadow), consumed by `createScene`/`createPitch`/`bodyMat`/the renderer's tone mapping; `__evo.setStyle(id, lighting)` rebuilds the 3D view so one harness shoots every arm at the same frozen tick. **Lighting is orthogonal** (user 2026-07-25): all three arms rendered in night AND day, both the broadcast and follow-ball cameras — 12 frames, two comparison sheets sent. Findings worth keeping: the game shipped with **three's default `NoToneMapping` and no managed exposure**, which is a large part of the flat/harsh read; the first pass painted **soap bubbles** (900 grain blobs at up to 2.55 m radius stack into discs) — count and radius must move in opposite directions, now pinned by a test; and relighting `current` for day **without** touching the chrome leaves a near-black terrace under a noon sky, which is itself the argument for arm (c). Gates: tsc + build clean · **721/721** (4 new pure preset tests, incl. one that pins the default preset literal-for-literal so a screenshot tweak can never drift the shipped look) · fingerprint `57b0bdab…c673` unchanged · zero console/page errors across all 12 renders. **Not yet decided: the pick, and therefore `F-DIRECTION.md`.** Known gaps if (a) wins: `CrowdSystem` body colours are unstyled, character proportions (thin limbs, featureless sphere heads) are untouched, and no post/tilt-shift. <br>Original scope: **Style-direction showcase**: same frozen frame rendered 3 ways for the user to CHOOSE — (a) toy/board-game world: double down on box-people, toon/ramp shading, flat palette discipline, fake contact AO, tilt-shift feel; (b) broadcast realism-lite: gLTF low-poly rigs, PBR, post stack — expensive, phone-risky, skeletal animation becomes the quality ceiling; (c) current look + coherence pass only (unify material language, tone mapping, palette). Commander recommends (a). Render the showcase through the cameras the user actually uses — **broadcast and follow-ball** (user 2026-07-25: the wide tactical camera is NOT their view; no wide-angle preset work). User picks; the pick becomes F-DIRECTION.md | **READY — user gate, light session** |
1247:| F2 | **Character proportions — toy anatomy** (first lever off F-DIRECTION's list, user delegated "按照推荐自走"). Limbs +~35% thick, shoulders tucked IN (`SHOULDER_X` 0.55→0.50) so the F1 anchor survives untouched — widest body 1.6165 m, **0.64 still the largest 0.01 step that fits**, the model neither grew nor shrank. Head 0.30→0.34 and bedded 0.115 INTO the shoulder line (no visible neck — a stub neck was built, found to be fully buried, and deleted rather than shipped as dead geometry); eyes added; chest NARROWED 0.86→0.72 so the thick arms stop merging into the shirt; shirt shortened 0.95→0.86 so the legs read; boot chunkier and shorter. Officials + coaches thickened to match. Limb LENGTHS untouched on purpose — every elbow/knee pivot and AnimationSystem pose is written against them. ⚠️ **Three defects the review stage caught and that are now test-guarded**: the hair cap swallowed the new eyes and faceted at the bigger radius; deepening the torso buried the back number behind a hand-fitted `-0.253` literal (now derived from an exported `TORSO_BASE`); and `armSpan()`'s "arms are the widest part" was a COMMENT, not a check — now asserted for every role at max bulk. Also re-framed `PlayerShowcase`'s camera (an F1 leftover: it framed a 2.7 m figure). Gates: tsc + build clean · **723/723** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25 — user's eyes next** |
1249:| F4 | **Ball readability cues** (third lever, same delegation). Chosen over the remaining polish items because it repays a debt F1b created: shrinking the ball 36% degraded the single most important object on screen, worst on a phone. Three fixes. ① **Height cue** — the contact shadow was a fixed disc, so a ball 3 m up drew identically to one on the grass; it now shrinks and fades with altitude, clamped so a high ball still leaves a findable mark. ② **The wake is a ribbon, not a line** — WebGL caps `linewidth` at 1 on every desktop platform, so the old `THREE.Line` trail was a one-pixel hair; now a tapered two-vertex-per-sample strip that reads as direction. ③ **Proportional fade** — trail floor 7→5.5 m/s with opacity scaled by speed, so a smaller ball gets a wake sooner without a crawling one painting the pitch. New math lives in the PURE `ballPresentation` module (this repo's own pattern) and is pinned by tests: shadow monotone in height, clamped both ends, never negative; trail opacity clamped, shots hotter. ⚠️ Also **caught and fixed a defect I shipped in F3**: the per-head skin lottery drew from the seat generator's own LCG, so adding it reseated the whole terrace 192→184 bodies — the visual suite's crowd count found it; skins now have their own stream (`2bcc956`). Gates: tsc + build clean · **726/726** · fingerprint `57b0bdab…c673` unchanged · visual suite's own trail check green on the new ribbon | ✅ **DONE 2026-07-25** |
1252:| F7 | **The goal moment** (user 2026-07-25: "进球得有点特效比如烟花喷火之类的"). Started as a check and found a real **F0 regression**: goal particles use ADDITIVE blending, which glowed against the old night diorama and all but vanishes against bright daylight grass — so shipping the toy/day arm had quietly killed every celebration. Blending is now preset-driven (`fxBlending`): solid confetti by day, glow by night. **Fireworks** added — three staggered shells over the main stand, verified rendering. ✅ **Flame jets SHIPPED, on the fifth attempt.** Four `THREE.Points` rewrites rendered nothing — vertex colours removed, 6 m point size, moved from behind the goal line into open pitch, restructured to mirror `Firework` exactly — with a clean console and a probe reporting visible/parented/opacity≈1/full drawRange/sane NDC, while the near-identical `Firework` Points worked. **Never explained.** Rebuilt as ONE stretched `THREE.Sprite` per jet with a procedural flame gradient: renders immediately, looks better, and costs 4 draw calls instead of 360. Codified in F-DIRECTION: prefer Sprites for billboard-shaped FX until someone explains the Points case. Tuned saturated-orange and 4.6 m (7.5 m towered over 1.7 m players; a white-hot gradient over bright grass reads as haze) — exact look is the user's eyes, since headless capture of a 1.5 s effect is flaky by nature. ⭐ Also fixed a perf debt **F6 created**: `CrowdSystem.update` rewrote and re-uploaded all 369×2 instance matrices EVERY frame, double the pre-bowl cost, on the platform where the phone is the binding constraint — calm stands now refresh at 20 Hz (a 3.5 cm idle bob nobody can resolve), eruptions still get every frame, pinned by a test. Gates: tsc + build clean · **731/731** · fingerprint `57b0bdab…c673` unchanged | ✅ **DONE 2026-07-25 — fireworks + 喷火** |
1276:sections (their rulings and Track E rows, my Track F rows); everything else
1294:[`../F-DIRECTION.md`](../F-DIRECTION.md)): the game shipped for months with
1334:   unrestorable, acceptance/seed shortfall, fingerprint drift);
1338:   ship/revert (C1 Phase 2) belong to the USER's eyes, never delegated.
1343:ecology wall (A3 and beyond), anything that ships into the live game, and
1367:It still STOPS for the user on: anything that ships into the live game
1384:   AFTER seeing results (it isn't — report the FAIL); acceptance/seeds can't
1391:   STOP, do not stage it, reconcile first** (ruling #9; commit `857784c`
1399:4b. **One working tree = one writer (ruling #9).** Concurrent sessions must
1414:   └──► C1 ★ (pass power, lands between A-steps) ──► C2 ★ ──► (C3 emerges)

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,260p' docs/world-model/PROGRAMME.md; sed -n '261,520p' docs/world-model/PROGRAMME.md; sed -n '521,760p' docs/world-model/PROGRAMME.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# PROGRAMME — the stepwise handoff plan (2026-07)

> **Position in the doc hierarchy:** [`VISION.md`](../VISION.md) is the gold
> standard; [`EVO-BLUEPRINT.md`](../EVO-BLUEPRINT.md), [`SUBSTRATE-MAP.md`](../SUBSTRATE-MAP.md)
> and [`PROBE-CONTRACTS.md`](../PROBE-CONTRACTS.md) govern method. This file is
> the **operational sequencing layer**: which step is next, which contract
> binds it, and what an executor session may do. It creates no new authority —
> every step defers to its own contract doc.
>
> **How to use (user):** hand an executor ONE step: *"读
> `docs/world-model/PROGRAMME.md`,执行步骤 <ID>"*. Steps marked ★ need your
> ratification (usually: you handing it over IS the ratification). Steps
> marked TBD have no contract yet — they are drafted only after their
> gate-step lands, by a planning-grade session.
>
> **How to use (executor):** read this file, then the step's contract +
> handoff docs, then execute EXACTLY that step. Do not start the next step.
> Update this file's status column in your final commit.

## 0. Where we are (context, 2026-07-24)

Banked, all dormant unless noted: M0–M4 embodied contest slice (LIVE),
S3a perception, D-PROC-0T intent privacy, S3-G0 active gaze, S3-G1
memory-guided attention. Closed with prejudice: D-ROTATE/D-INTENT/D-HANDOVER
(commander replacement, pre-gaze), C-RNG portability, static kick-vector
estimators. Full narrative: [`WORLD-MODEL-NEXT-AUTHORITY.md`](WORLD-MODEL-NEXT-AUTHORITY.md).

The three walls to VISION: **information** (nearly through), **decision
layer** (**first brick landed 2026-07-24** — A3/D-MUT-0 PASSED: two bodies
resolve a private conflict through observation alone, 76.9% resolved, no
commander and no communication. The road here: A2/D-PROC-1G fixed the
braking-vs-commitment confusion that sank D-PROC-1 (2/96) but was too slow
inside a unilateral 0.8s window; symmetrising it — where resolution needs only
ONE party to fire — cleared the cadence problem), **selection** (deliberately
unopened). Everything below is sequenced against those walls.

## 0.5 Direction (commander deep-think, 2026-07-24)

**Two engines of emergence.** Track A builds the information→decision
substrate (who sees what, believes what, responds how) — *tactics* live
there. Track C builds the craft-choice substrate (pass weight, body shape,
aerial timing, one-touch vs control) — *style* lives there. VISION needs
both, and they must go LIVE together: S3b proved one-sided live perception
fails at PAYS, and the vision-attr saga proved read/craft upgrades inflate
goals unless attack and defence co-evolve.

**The cadence reframe.** D-PROC-1G measured pure-evidence response at
~0.3–0.5s. Real players act faster — on PRIORS, not on accumulated evidence.
That is exactly what A4's layers are FOR, causally: coach doctrine = shared
priors that let a player act safely on less evidence; familiarity = faster,
stabler interpretation of the same external cues. Neither may reveal an
unobserved body — they buy LATENCY, not information. D-MUT-0 measures how far
pure evidence gets; whatever gap remains to football-speed coordination is
the quantified value of doctrine/familiarity when A4 opens. The cadence
finding was not a setback; it located the causal seat of coaching.

**The integration milestone** (first visible VISION moment): an **Embodied
Decision Slice** — one live, co-evolved bundle: perception-based pass choice
(the S3b redo, both sides reading), pass power (C1), first-touch decision
(C5), shipped only through six-layer + §2 band + user play-test. Until that
bundle survives PAYS, everything stays dormant by design; after it, the
discovery archive and "understand" UI (Track D4/D5) stop being fiction.

**Sequencing instinct:** when in doubt, prefer the step that (a) closes a
causal gap a prior FAIL named, (b) reuses banked machinery, (c) keeps the
live baseline untouched. That instinct produced S3-G0→G1→1MG→1G→D-MUT; it
generalises.

> **Self-drive status (2026-07-24, autonomous run COMPLETE — queue drained to
> user gates).** The delegated queue `ship B1 + apply B2 → C1-Phase0 →
> A3(D-MUT-0)` was executed in one session: B1 shipped, B2 applied,
> C1-Phase0 answered (drafted Phase-2 shape refuted; fork in the contract's
> §7), A3 **PASSED** — the decision-layer wall's first brick.
>
> **COMMANDER RULING on the three open forks (2026-07-24, pending the user's
> one-word ratification — on it, the autonomous queue below unlocks):**
>
> 1. **A3 fork → three-body direction, entered via S3-G2 first.** D-MUT's own
>    data locates the next constraint: all 15 unresolved states were mutual-
>    staleness safe-fails, and S3-G1 banked SINGLE-target attention only. A
>    three-body process makes every player track TWO moving partners with one
>    gaze — attention scheduling becomes the binding constraint before any
>    rotation shape can be honest. Ladder: **S3-G2** (dual-target interleaved
>    attention gate: can alternating memory-guided gaze sustain qualified
>    evidence on two moving targets? same G-series pattern, ceiling arm,
>    frozen support gates derived from S3-G1/1MG numbers) → **D-TRI-0**
>    (three-body rotation-shaped mutual response, gates derived from D-MUT's
>    banked numbers). Autonomous session drafts both contracts in that order
>    under pre-registration discipline.
> 2. **C1 fork → C1-A now (dormant, autonomous), C1-B GO as the next LIVE
>    slice** (user play-test gate at the end stays): honest speed-dependent
>    control cost is a standalone substrate-truth fix (heavy balls barely
>    cost anything today — the +0.07 raw term saturates at 14 m/s) and is the
>    prerequisite for the ENTIRE craft engine (C1-C, C5 both need reception
>    cost to be real). Six-layer + §2 band + paired A/B, narrow slice, lands
>    between Track-A experiments. **C1-C is DEFERRED into the Embodied
>    Decision Slice** — teaching the evaluator to price time/speed belongs to
>    the S3b-redo bundle, not a patch on `laneOpenness`.
> 3. **D1 GO, parallel, Sonnet-tier** — pure UI, user's eyes accept.
>
> Recommended queue on ratification: `C1-A → S3-G2 → C1-B(≤user play-test) →
> D-TRI-0`, D1 parallel. B2's render: user looks whenever; small tweaks only.
>
> **RATIFIED by the user 2026-07-24** ("按指挥官裁决继续"), then executed in one
> autonomous run: **C1-A** substrate banked (bit-identical) with its ledger
> honestly failed and re-posed as **C1-A2** (which came back clean: pace buys
> −17.4pp interception and costs the receiver nothing) → **S3-G2 PASSED** (dual
> attention banked; one acceptance-shortfall escalation resolved by sampling
> budget only, flagged for veto) → **C1-B implemented, §2 band broke on goals and
> long balls, honest-reverted**.
>
> **Queue state: back at user gates.** Per the self-drive protocol C1-B's
> non-PASS stops the queue. Open, all the user's:
> 1. ✅ **D-TRI-0 DONE — PASSED** (ruling #2 executed): three bodies resolve a
>    rotation-shaped conflict by observation alone at 77.0%, second-order churn
>    zero. The pre-laid fork is now live: **open A4** (coach doctrine /
>    familiarity as latency-reducing priors) **or prioritise the Embodied
>    Decision Slice**. Nothing else in Track A is authorised until you pick.
> 2. **The touch-cost fork** — fold C1-B into the Embodied Decision Slice
>    (recommended, `PASS-POWER-SLICE.md` §13.4) or spend the one unspent redraw.
> 3. ✅ **D1 BUILT** (ruling #3) — dual shell in place, fingerprint unchanged.
>    Waiting on your eyes; feedback is small CSS tweaks, not a new step. D2
>    (evolution scatter trails) becomes READY behind it.
> 4. **B2's render** — look whenever; feedback is small tweaks.
>
> **COMMANDER RULING #3 (2026-07-24, pending the user's one-word ratification):**
>
> **The D-TRI fork → EDS-first; A4 parked with its quantified basis intact.**
> Reasoning: the dormant stack's marginal value is now bounded by the live
> wall — three independent measurements (S3b, vision-attr, C1-B) say partial
> live entry breaks structurally, and D-TRI-0 just showed pure evidence
> plateaus around ~77% coordination offline. A4's causal seat is LATENCY,
> and latency only binds against live coordination — build A4 after a live
> seam exists and it gets a real testbed instead of another offline probe.
> The design contract is drafted:
> [`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) — Track E below;
> stages E0–E4, each pre-registered individually by the autonomous session;
> E1 consumes the C1-B redraw in its correct home; NO partial ship in either
> direction; E4 = the user's play-test, final.
>
> Recommended queue on ratification: `E0 → E1 → E2 → E3 → E4(user)`, with
> **D1 to a light parallel session anytime**. A4 and C5/C2/C4 queue behind
> EDS's outcome.
>
> **COMMANDER RULING #5 (2026-07-24 — the D-TRI sync race + E1a re-stage):**
>
> 1. **Sync rule (governance, binds every session from now on):** before
>    DRAFTING or EXECUTING any step, pull origin and check whether a
>    contract/handoff already owns that step ID. Commander-authored contracts
>    take precedence; on collision STOP and reconcile — never run a parallel
>    variant under the same ID. (The D-TRI race: the commander's A5 contract
>    landed at `04af61d` while the autonomous session was already running its
>    own draft; the session disclosed it fully and kept the handoff — correct
>    conduct after the fact.)
> 2. **The triadic variant's result STANDS under its own honest claim** —
>    all-three-alternating + first-open-wins chain resolution at 77.0%, zero
>    churn under the WEAKER composition, and in one respect a HARSHER
>    attention world than A5's (everyone pays the split, yet 77% held). It
>    does **NOT consume A5**: `THREE-BODY-CHAIN-RESPONSE.md` + `HANDOFF-D-TRI-0.md`
>    stay OPEN, queued at Track A resumption (post-EDS), where their
>    unanswered questions — B's dual-support transfer inside a consumer,
>    union admissibility vs first-open-wins, partial resolution — become
>    direct inputs to A4 / rotation-at-scale design. The EDS-first decision
>    did not depend on D-TRI specifics and is unaffected.
> 3. **E1a re-stage GO**: a REAL intended pass, power-swept to foot speed
>    (the intended receiver is where the world actually adjudicates,
>    maxSpeed 24 vs 14); I1/I2 gates verbatim — this is re-staging, not
>    gate-changing; E1b stays closed until I1 passes; run it in a FRESH
>    session (the third-same-night quality stop was the right call).
> 4. Two substrate boundaries REGISTERED (mirrored in the EDS design doc §4):
>    receptions at ≤6 m/s are free BY FIAT (`mechanics.ts:130` returns clean
>    before any roll — C1-A2 and E0b were equally blind there), and
>    mid-speed loose balls often never reach adjudication at all (M3 contact
>    cushioning; sweep buckets 9/11 produced zero events vs 60/60 in 7/13).
>    Both are C5-adjacent substrate truths — registered, NOT touched in EDS v1.
>
> **COMMANDER RULING #6 (2026-07-25 — the E1a split verdict):**
>
> 1. **E1b OPEN on I1's pass alone.** The E1a contract's frozen §4 names I1
>    as the sole drafting condition; I1 passed on untouched gates (6.9–11.2×
>    floor, calibration ≤0.311pp / 2.0pp). Substantively: the one physics
>    story that could have invalidated E1b's premise — pressure-relief as
>    the dominant channel — was refuted by the logged decomposition
>    (pressure −0.23pp vs speed +1.63pp). E1b consumes the instrument, not
>    I2's verdict.
> 2. **I2 RETIRED, not redrawn.** The E1a probe verdict stays FAIL as
>    emitted — no predicate is rewritten after results, ever. But its
>    question is settled by its own decomposition (pressure-relief refuted;
>    the E0b inversion does not reproduce at the clean adjudication), and
>    the powered flat-vs-rising test is SUBSUMED by E1b's same-seed OFF/ON
>    contrast on the I1 staging (thousands of events per bucket, SE ≈0.5pp
>    — more power than any standalone redraw). Disposition recorded in the
>    E1a contract §7.
> 3. **Discipline codified:** PROBE-CONTRACTS §2 gains a SIXTH threshold
>    type — equivalence/flatness claims must be pre-registered as interval
>    tests with pre-computed power; a strict point inequality where SE
>    swamps the predicted effect is structurally undecidable and forbidden.
> 4. **E1b two-channel amendment (design contract §3):** pace buys speed
>    cost AND blind-side cost (misalign 0.100→0.348 with power — real
>    embodied timing; I2 magnitude inflated by pinned receivers, so gate
>    its DIRECTION never its size). E1b's decomposition gate = increase
>    carried by speed and/or misalign channels, pressure channel bounded.
>    OFF/ON contrast on the I1 staging; contested states diagnostics only;
>    always-heavy canary unchanged. The executor drafts the E1b stage
>    contract under these constraints (Autonomous mode) — no further
>    commander input needed until E1b's result.
>
> **COMMANDER RULING #7 (2026-07-25 — E1b accepted; E2 split and constrained):**
>
> 1. **E1b ACCEPTED — PASS on every gate.** The curve lands within noise of
>    its own pre-computed arithmetic (worst 1.35σ), the increase is carried
>    ≥99.996% by the speed channel with pressure identically zero (provably
>    not the refuted confound), X5 reproduces E1a's banked run to the last
>    digit, and nothing shipped (`edsTouchCost` default OFF, fingerprint
>    unchanged). The C1-B redraw is spent, correctly, on a measurement.
> 2. **The X2b amendment is ACCEPTED and its boundary CODIFIED:** after a
>    smoke/shakedown but before the frozen run, a predicate may be amended
>    ONLY if it is a harness/instrument predicate (determinism smoke,
>    staging sanity), never a physics-bearing gate; always in its own
>    commit with the rationale, always disclosed in the result. Amending
>    "all three seeds diverge" → "at least one" was exactly the sixth
>    threshold type's lesson applied honestly mid-flight.
> 3. **E2 SPLITS into E2a → E2b** (instrument-first, third application):
>    **E2a** = census-derived prior table (pre-registered census probe,
>    distance-banded population rates, SHA'd and committed as DATA before
>    any A/B; priors are infrastructure — never adjusted after results) +
>    the pricing layer validated on E0's 120 banked states (55/120
>    unpriceable → 120/120 priced, ZERO deleted for observability, prior
>    calibration as a powered interval test). **E2b** = the both-sides A/B:
>    evaluator = E0 corridor + E1b's touch term via the certified formula,
>    PERCEIVED state both sides through the shared-awareness trunk;
>    NOT-LOOKING-MUST-NOT-WIN directional gate across awareness arms;
>    route-mix gate vs the S3b collapse signature (powered interval);
>    PERF hard gate at brain cadence (budget from docs/perf/baseline.json);
>    X5-style reproduction gates on every reused staging; always-heavy rate
>    under combined pricing REPORTED for E3, never gated here. Full text in
>    the design contract §3. The executor drafts both stage contracts under
>    Autonomous mode — no further commander input needed until E2a's result
>    (E2b may proceed on an E2a PASS without a new ruling).
>
> **COMMANDER RULING #8 (2026-07-25 — E2a-1's selected-sample catch; the
> option-space recensus):**
>
> 1. **E2a-1's FAIL is ACCEPTED as a correct catch.** P3's direction was a
>    belief; the data corrected it (composition: real play is short-pass
>    dominated, E0's acceptance surfaces a longer slice) — that is what a
>    pre-registered gate is FOR. The census itself, the pricing layer, the
>    zero-deletion mechanism and the committed table all stand banked.
> 2. **Q1 answered — the honest population is the OPTION SPACE, measured
>    counterfactually. E2a is re-posed as E2a-2**: sample real in-play
>    decision moments, enumerate the FULL candidate set, FORK the
>    deterministic world per candidate and intervene on TARGET CHOICE ONLY
>    (live machinery does power/lead/execution). EXACT harness gate:
>    forcing the pass the live AI was about to play must reproduce the
>    unforked match BIT-IDENTICALLY. Unplayable targets = their own logged
>    class. Direction findings REPORTED, never gated (P3's lesson);
>    registered prediction: option-space rates < pass-log rates, the delta
>    = the first measured CHOOSER LIFT. Pessimism-by-construction REJECTED
>    (an invented constant); accept-and-let-E2b-judge REJECTED (a consumer
>    built on an input known-mispriced at its own gate = E0b inverted).
>    E2a-1's census stays banked as the chosen-subset reference. The
>    fork-and-force harness is a banked capability with named future
>    consumers (D5 causal replay; VISION's counterfactual authority).
> 3. **Q2 answered — RE-KEY, in E2a-2's pre-registration, never retro:**
>    a routing predicate must key on the statistic its consumer actually
>    reads (receptionSuccessRate's 8.32pp gradient, not flat
>    interceptedRate — same error family as label≠metric). Pricing
>    classes: fully-unknown → MARGINAL by construction; stale-memory
>    (within retention) → BANDED at remembered distance — the gradient is
>    what memory is worth. E2a-1's frozen result stands untouched.
> 4. **E2b's aiming question (flagged in E2a-1 §6) is settled now**:
>    priced always, executable only with an honest aim point (current
>    percept or within-retention memory); no role-anchor or
>    beyond-retention aiming (truth-fallback by the back door). The gap
>    between "prices well" and "cannot aim" is the causal seat of
>    look-before-pass; E2b reports the look-pressure statistic. Full
>    text: design contract §3 (h)–(l). The executor drafts E2a-2 under
>    Autonomous mode; on its PASS, E2b proceeds without a new ruling
>    (ruling #7's provision carries over).
>
> **COMMANDER RULING #9 (2026-07-25 — E2b-0 accepted; concurrency rule;
> E2b-1 constraints; green path to E4):**
>
> 1. **The E2b split and E2b-0's PASS are ACCEPTED.** The gap was real —
>    a blind option prices as a probability, a seen one as corridor
>    seconds, E0 refuses scalar scores by design, and inventing the
>    joining weight was forbidden — so measuring the exchange rate first
>    (instrument-first, fourth application) was the correct move under
>    the standing authorisation. X5's field-for-field reproduction of
>    E2a-2's table and the re-run at the post-merge HEAD to the same SHA
>    are exactly the conduct the discipline wants.
> 2. **Concurrency CODIFIED (governance 4/4b):** one working tree = one
>    writer; parallel sessions stagger or use separate `git worktree`s and
>    merge through git; before every commit `git status` must show only
>    this session's files — a foreign modification means STOP, reconcile,
>    never stage it. `857784c`'s sweep did no damage but proved the hole.
> 3. **E2b-1 drafting constraints:** (a) NAME the third class — three
>    information states: READ (target + lane in current percept → the
>    E2b-0 curve), SEEN-UNREAD (target perceived, lane not → banded at
>    the known distance — 28.48% of playable options, currently folded
>    silently), UNSEEN (→ marginal); class shares REPORTED — the silent
>    fold is E2a-1's population error family. (b) COMMON UNIT = measured
>    probability: the E2b-0 curve is the exchange rate; no invented
>    weight anywhere in the evaluator. (c) NO DOUBLE-COUNTING of touch:
>    the E2b-0 curve was measured on receptionSuccess in the flag-OFF
>    world; E2b-1 runs flags ON — decompose corridor (interception/
>    reach-based outcome from the same census columns) × touch (the
>    E1a-certified formula at flag-ON strength), or justify an
>    alternative explicitly in the pre-registration. (d) Look-pressure
>    reported on both axes (band axis ≈ not-looking is free; read axis =
>    where looking pays 43→83%). (e) The 6× finding is BOOKED (design
>    contract §4): banded stale-memory pricing stays — honest and cheap —
>    but the value of LOOKING is the lane read only a current percept
>    supports; this pre-registers A4's boundary (doctrine/familiarity buy
>    priors and latency, never lane reads).
> 4. **Green path extended to the user gate:** on E2b-1's PASS the
>    executor drafts E3 directly under Autonomous mode (design contract
>    §3's gates, no new ruling needed); the queue stops at **E4 — the
>    user's play-test**. Any non-PASS anywhere returns to the commander.
>
> **COMMANDER RULING #10 (2026-07-25 — E2b-1's split verdict; the
> perception-cost redraw):**
>
> 1. **The FAIL is accepted and the science is BANKED.** G1 (not-looking
>    never won: 63.28/64.60/63.46% vs oracle 67.90%, every rung in band,
>    +4.61pp endpoint lift) and G2 (route mix survived: long-share 18.05%
>    at 0.8 awareness vs 18.07% omniscient — S3b's ~38% collapse did NOT
>    reproduce) are the two graves this programme dug itself out of, now
>    passed in dormant form. X5's factors multiply back. What failed is
>    plumbing, twice, honestly reported.
> 2. **X3 ruled — hash the world, report the clock.** Determinism hashes
>    cover WORLD OUTCOMES only; wall-clock/perf is a sidecar report,
>    never hashed (PROBE-CONTRACTS codified). The executor's conduct was
>    correct: the verdict stood as emitted, and world-determinism was
>    PROVEN by diagnosis (perf block removed → identical hashes twice),
>    not asserted. The redraw pre-registers the corrected scheme.
> 3. **G3 ruled — E2b-1R redraw, cheaper by computing LESS, never by
>    perceiving less.** The lever is CONSUMPTION-SCOPING: the defender
>    interception entry reads only the BALL percept (build the ball-only
>    cheap path); the passer's full snapshot is computed at pass-decision
>    moments only, not every brain tick. Codified principle: perception
>    cost scales with what consumers READ, not with what could be seen.
>    Honesty is frozen — scan cadence, FOV, retention, keyed error may
>    not move. Budget stays 1.25× / p95 1.50×. The decisive new gate is
>    BEHAVIOUR-NEUTRALITY: same seeds, same moments → the redraw's logged
>    choices must be IDENTICAL to E2b-1's per moment per arm (G1/G2 then
>    reproduce by construction and stand as verification). If
>    consumption-scoping still misses the budget → STOP and report; no
>    honesty shaving, no budget raise.
> 4. **R1's correction is ACCEPTED and the banked number SUPERSEDED**
>    (design contract §4): "28.48% SEEN-UNREAD" was the evaluator-null
>    share — a mixed class, mostly UNSEEN; true SEEN-UNREAD ≈ 0.2%. The
>    taxonomy stands, nearly empty. Banked alongside: look-pressure 9.17%
>    at 0.8 / 17.03% at 0.2 (the future gaze consumer's workload), and
>    47% omniscient agreement with the live brain — the evaluator is a
>    DIFFERENT chooser, so E3 must EXPECT play to change and measure
>    whether the change stays in band.
> 5. **Green path unchanged:** E2b-1R PASS → the executor drafts E3
>    (Autonomous mode) → queue stops at **E4, the user's play-test**.
>
> **COMMANDER RULING #11 (2026-07-25 — E2b-1R accepted; E3 reviewed, GO):**
>
> 1. **E2b-1R ACCEPTED — every gate.** 1.329× → 1.069× by computing less,
>    not perceiving less; B1's seven families bit-identical across 3,000
>    moments × 4 arms, so G1/G2 graduate from banked-with-asterisk to
>    VERIFIED; X6 pins the cheap path field-for-field against the full
>    path in perpetuity; X3's fix proved itself mid-development (perf
>    measurement changed, world hash did not move). Both pre-freeze
>    disclosures tightened faithfulness rather than loosening it — the
>    GK-skip catch is exactly the behaviour-change-in-a-perf-coat B1
>    exists to catch. Exemplary run.
> 2. **E3's draft is REVIEWED and APPROVED to run as pre-registered** —
>    no gate changes. The chain holds: X4 (live consumer must reproduce
>    E2b-1R's banked choices), §2 band verbatim from C1-B's grave,
>    no-strict-dominance 20–80 as the operational form of "situational",
>    co-evo restoration directional per the vision/positioning precedent,
>    nothing ships, E4 is the user's.
> 3. **One scope registration (design contract §2), no gate touched:**
>    v1's honesty claim covers the CHOICE; execution stays truth-aimed —
>    the same kick the legacy game gives every pass, so the band compares
>    like with like and X4 chains without a seam. Perception-honest
>    AIMING (passes to a departed runner honestly missing) is named OUT,
>    a future slice beside C-track lead/weight craft.
> 4. Standing user gates after E3: **E4 (the bundle) and F-ACCEPT (art
>    F2–F7)** — one play session can serve both if the user prefers.
>
> **COMMANDER RULING #12 (2026-07-25 — E3's verdict; the thesis amended by
> its own measurement; E3R):**
>
> 1. **E3's FAIL is accepted, and X4's achievement is banked loudly:** the
>    first live perceived choice in this game's history, 0/10,292
>    divergences from the probe that validated it, baseline arm matching
>    C1-B's frozen numbers to four decimals. The dormant→live seam HOLDS.
>    The build-defect disclosure (refreshPerception on the wrong flag,
>    caught by the executor's own ablation, fixed with bit-identical
>    proof) and the pre-run dominance operationalisation were exemplary.
> 2. **The v1 thesis is REFUTED as stated, by the cleanest evidence this
>    programme has produced:** bundle minus touch cost is in EVERY band;
>    touch cost alone is C1-B to the decimal; and R1 proves the break is
>    MECHANICAL (spill → loose → aerial — the chooser's long share never
>    moved). Information cannot absorb a tax that no decision produces.
>    The bundle hedged the wrong risk: the missing co-evolution partner
>    for touch cost is not the passer's information but the RECEIVER'S
>    CRAFT — C5's cushion-vs-one-touch as a priced choice is the
>    adaptation lever today's receivers simply do not have.
> 3. **Disposition (the §5 pre-registered path, followed exactly):**
>    touch cost leaves the v1 live set (design contract §2 amended);
>    E1b's curve stays BANKED dormant — the measurement is never wasted —
>    and its live entry re-seats to a future C5-coupled slice. **v1 live
>    bundle = perceived choice + perceived defence + the evaluator**,
>    the pair whose live equilibrium the ablation already measured
>    in-band (−21.69% alone → +2.20% together: the S3b/vision-attr law,
>    confirmed live). No partial ship: nothing goes to E4 until E3R
>    passes IN FULL — ablation diagnostics are not passes.
> 4. **E3R drafting constraints (executor, Autonomous mode):**
>    (a) CHAIN FIRST: the banked E2b-1R choices were priced with the
>    flag-ON touch factor; E3R's world runs touch-flag OFF, so pricing
>    must be flag-off-honest (the world as it is, never phantom costs) —
>    therefore re-run the E2b-1R staging with flag-off pricing to re-bank
>    the choice reference (G1/G2 must re-hold there), THEN X4 chains the
>    live chooser to the NEW reference. (b) All five gate families
>    verbatim on the 1+3+4 bundle, fresh sealed evo included. (c) STYLE
>    ENTROPY carries two pre-registered hypotheses: H1 touch-flattening
>    (entropy ≥0.60 recovers without the curve → benign, closed) vs H2
>    genome-blind chooser (the evaluator prices pure measured probability
>    and may have removed the seat through which tactical genes expressed
>    style; if entropy stays <0.60 the fork returns to the commander for
>    a designed PREFERENCE SEAT — genes modulating evaluator weights as
>    priced choices, the two-engines junction — never a tuning knob).
>    (d) PERF: the remaining consumption-scoping lever is WHICH bodies —
>    candidate-scoped snapshots materialised at pass-commit only; budget
>    stays 1.25×; misses → report, no honesty shaving. (e) 20–80
>    dominance band kept with its purpose documented: >80% is the
>    always-heavy pathology, <20% guards degenerate never-heavy as a
>    mispricing symptom; expect the distribution to shift heavier under
>    flag-off pricing. (f) Stamina-suite break re-tested on the revised
>    bundle before any deeper diagnosis.
> 5. **Green path: E3R PASS → E4 + F-ACCEPT** (one play session can serve
>    both). Any non-PASS returns here.
>
> **COMMANDER RULING #13 (2026-07-25 — E3R 26/28; the last two gates get
> their honest forms; E3R2):**
>
> 1. **The 26 stand BANKED, and three deserve names:** co-evo restoration
>    PASSED for the first time in this project's history (+0.2864 →
>    +0.0282 — the gate the vision-attr saga failed four times); the §2
>    band held on all five dimensions with the revised bundle; and
>    constraint (a)'s premise was DISPROVEN AND PROVEN — the commander
>    assumed the banked reference was flag-ON-priced, the executor
>    re-banked and not one digit moved. My premise was wrong; their
>    verification was exactly right. X4R 0/10,292.
> 2. **CE2 disposed — the verdict stands, the gate was mis-typed.** A
>    single-seed entropy floor is an ecological claim gated
>    non-ecologically (PROBE-CONTRACTS' own type table says multi-seed;
>    codified there). **H2 (genome-blind chooser) is REFUTED by its own
>    pre-registered discriminators**: cross-club spread UP (1.977 vs
>    1.684), gene expression STRONGER (−0.222 vs −0.122), the chooser
>    club-dependent (0.60m), and the robustness seed flips the statistic
>    to 1.5321. The preference-seat fork does NOT open. **CE2R** (inside
>    E3R2): median style entropy across 5 fresh sealed-evo seeds ≥ 0.60,
>    with the three mechanism discriminators as co-gates.
> 3. **X5R disposed — lazy reconstruction APPROVED, and its semantics
>    REGISTERED: perception is PULL.** A body knows what its scans would
>    have shown, materialised at the moment it acts; keyed noise makes
>    the values constructionally identical, so this changes WHEN the
>    computation happens, never WHAT is known. Hard gates in E3R2:
>    field-for-field snapshot equivalence lazy-vs-eager, pinned by a
>    perpetual test (the X6 pattern); B1-style choice identity against
>    E3R's own logged choices; budget stays 1.25× / p95 1.50×. Registered
>    boundary: any FUTURE live consumer needing scan-moment PUSH events
>    (a body reacting AT the instant of seeing, unpolled) must revisit
>    this seat explicitly — pull semantics is what ships in v1.
> 4. **The stamina finding carries to E4 as a FEEL item, never a
>    re-baseline.** Honest perception makes play calmer (defenders commit
>    later, passes find supported targets, fewer loose-ball chases) —
>    that is an emergent consequence of exactly the kind VISION orders.
>    Whether a calmer game FEELS right is the user's judgment at E4. IF
>    the bundle ships, a fatigue-economy re-seat (stamina costs
>    recalibrated so the tank matters in the calmer game) is registered
>    as the follow-up slice; the suite red stays a finding until then.
> 5. **E3R2 is NARROW: only the two gates, in their honest forms** —
>    CE2R multi-seed + X5R2 lazy-reconstruction-under-pins. The 26
>    banked results transfer (the equivalence pins are what make that
>    transfer rigorous). **E3R2 PASS → E4 + F-ACCEPT**; CE2R median
>    < 0.60 → a real diversity problem, back here; lazy pins fail →
>    the reconstruction is not the perception, fix it, never widen.
>
> **COMMANDER RULING #14 (2026-07-26 — E3R2 accepted 29/29; E4 opens):**
>
> 1. **E3R2 ACCEPTED.** Pull semantics proven to be the SAME perception
>    (P1 7/7 perpetual pins, P2 identical worlds + full choice
>    trajectories, P3 17/17 banked live numbers bit-identical — the
>    rigorous transfer mechanism ruling #13.5 asked for, delivered as
>    proof rather than assumption); perf 1.1977× / p95 1.1529× inside
>    budget by computing less, never by seeing less; CE2R median 1.5253
>    with 4/5 seeds ABOVE 1.0 — under this bundle a typical world is MORE
>    stylistically diverse than without it, and all three mechanism
>    co-gates hold. The preference-seat fork stays closed. The
>    between-tick pull asymmetry is honestly pinned (never knows MORE).
> 2. **CE1's honest weight registered:** advantage-shrink held in 2/5
>    fresh seeds with mostly-negative noisy paired diffs — there is no
>    attacking runaway ANYWHERE to restore from, which satisfies the
>    gate's purpose in substance; a multi-seed CE1 form joins the
>    post-ship follow-up list beside the fatigue-economy re-seat. It
>    does not block E4.
> 3. **E4-PREP authorized (small, any session):** the two v1 flags
>    exist only as Match config — the user plays the deployed build. Add
>    an in-game settings toggle (the F0 lighting-control precedent:
>    LeftBar control, persisted, localised) that flips
>    `edsPerceivedChoice` + `edsPerceivedDefence` together at match
>    start — **default OFF, pinned by a default-off test, fingerprint
>    unchanged, CI deploy**. Live A/B on the user's phone IS the E4
>    instrument. At ship time the toggle's fate (keep as "legacy brain"
>    switch or remove) is decided then.
> 4. **E4 + F-ACCEPT are open — the user's eyes, nothing else.** Ship =
>    both flags default ON + fingerprint/perf rebaseline + ROADMAP
>    entry; revert = the whole bundle (dormant assets stay banked).
>    Registered feel items for the session: the game is measurably
>    CALMER (later tackles, better-supported passes, fewer loose-ball
>    scrambles) and a full match no longer spends the stamina tank
>    (0.9697 vs 0.93) — judge whether calm feels like football or feels
>    flat; fatigue re-seat is already queued if shipped.
>
> **COMMANDER RULING #15 (2026-07-26 — E4 round 1 disposed; the value
> half; drafted on the executor's own numbers, no re-derivation):**
>
> 1. **E4 round 1: no ship, no revert — the direction is affirmed and
>    the flags stay default-OFF.** E4 becomes an ITERATIVE gate: the
>    user plays each round on the preview toggle; v1 ships when their
>    eyes say so, likely after the value seat lands. The user's three
>    observations map one-to-one onto the three named seats — the map
>    predicted the play experience, which is what "方向没问题" means
>    operationally.
> 2. **The two-judges seam finding is ACCEPTED as the round's central
>    fact:** the E3 seam replaced WHO receives but left WHETHER/WHY on
>    the legacy score, so the licence (legacy tactical layer: 2过1
>    ×1.15+, third-man, overlap ×1.3, anti-back-pass ×0.55) and the
>    delivery (argmax P(clean)) are granted by different judges — the
>    overlap runner earns the pass, the ball goes to the safest man,
>    combinations collapse (third-man −35.7%, overlap −68.0%, forward
>    share −5.1pp, shots −6.0%). This is a SEAM artifact, not a
>    perception failure: honest information + half an objective.
> 3. **E5 — THE VALUE AXIS — is authorized (executor drafts, Autonomous
>    mode).** Constraints: (a) V is MEASURED, never invented: the
>    fork-and-force harness prices each candidate by WHAT HAPPENED NEXT
>    (threat delta / shot-within-N / progression), censused over real
>    decision moments, table committed as SHA'd data — the E2b-0
>    exchange-rate move applied to the value half; circularity
>    registered honestly (V is measured under legacy-brain play, like
>    the prior census — sufficient for v1, revisit if E5's own audit
>    says otherwise). (b) The decision becomes measured-P × measured-V
>    composition, pre-registered exactly, no residual hand weights.
>    (c) **The slice's central hypothesis, pre-registered:** measured
>    value REPRODUCES combination play without the hand-coded bonuses —
>    third-man/overlap counters recover toward flags-off levels because
>    the third man stands in measured space, not because ×1.3 says so.
>    PASS = the first hand-coded→measured replacement inside the brain,
>    the emergence doctrine cashed in code; FAIL = the value definition
>    is myopic (one-step V cannot see two-pass patterns) — report, do
>    not bolt the old bonuses back on. (d) Narrow audit before E4 round
>    2: §2 band + dominance + perf pins + the watchability instruments.
> 4. **The gate-set gap is CODIFIED:** every future band carries the
>    watchability instruments as REPORTED dimensions — forward-pass
>    share, third-man releases, overlap releases, give-and-gos, shots,
>    longest chain. 29 gates contained no watchability instrument while
>    watchability measurably dropped; minutes of probe cost buy what
>    only a play session could see. (PROBE-CONTRACTS note added.)
> 5. **Seats 2 and 3 queued behind E5, in the user's priority order:**
>    the gaze consumer (look-before-pass — A4's unpark condition "a
>    live seam exists" is now MET; look-pressure measured at 6.59% of
>    live pass moments), then C5's time dimension (hold-draw-release,
>    one-touch vs control as priced choices, where ruling #12 already
>    re-seated the touch cost). Each is its own slice with its own
>    audit and E4 round.
>
> **COMMANDER RULING #16 (2026-07-26 — E5's split verdict; the
> attribution experiment; gaze holds):**
>
> 1. **E5a is BANKED as a milestone:** the value half is measurable and
>    the product needs no weight — P̂ × V̂ predicted its own conjunction
>    to 0.03pp on 14,114 forks (4.014% vs 3.982%), the V table carries
>    10.10pp of discrimination, and both licence gates returned the
>    banked tables bit-exact. Whatever E5c attributes, THIS survives:
>    the game now owns a validated value instrument.
> 2. **E5b's FAIL is accepted exactly as pre-registered** — the central
>    hypothesis died on the pattern it was predicted to die on
>    (third-man 0.472×, worse than v1's 0.603×) while one-pass shapes
>    recovered (overlap 0.835×, give-and-gos ABOVE flags-off). Banked
>    finding: the value axis produces a COHERENT different football —
>    direct, shot-hungry (+17.5%), shorter chains, band healthier than
>    E3R — it works, and it cannot see two-pass patterns. Correct
>    conduct throughout: no bonuses re-added, no horizon widened, no
>    outcome redefined, `edsValueAxis` kept out of the preview toggle
>    by a pinned test.
> 3. **The differential CANNOT arbitrate the two causes — a geometric
>    confound, registered:** overlap runners target the OUTER attacking
>    third (well-sampled, 13.58% cell — recovered) while third-man
>    runners arrive in the INNER box (the two cells below the 400
>    floor, reading marginal — died further). So "one-pass shapes
>    recovered, the two-pass shape died" fits BOTH one-step myopia (HM)
>    and inner-box undersampling (HU). Separating them is an
>    experiment, not a paragraph — exactly as the executor said.
> 4. **E5c — ATTRIBUTION — is authorized (executor drafts, Autonomous
>    mode). Two independent cheap measurements, both on the existing
>    harness:** (a) **HU test first (nearly free):** targeted census
>    top-up of the inner attacking-third cells to the 400 floor (staged
>    moments where inner-box candidates exist; the census's own
>    acceptance rules verbatim), re-emit the table as new SHA'd data,
>    measure how far the topped-up cells move off the marginal, then
>    re-run the E5b watchability probe with gates verbatim. HU
>    confirmed iff third-man recovers materially with nothing else
>    changed. (b) **HM test on (a)'s residual:** at live
>    pattern-active moments (give-and-go just completed, third runner
>    in flight), fork-and-force the pass to the runner and compare
>    realized outcome value against the topped-up table's V̂ at that
>    destination — HM confirmed iff realized exceeds V̂ beyond a
>    pre-powered band even after the top-up, i.e. the cell-indexed
>    table is STATE-blind, not sample-starved. If both fire, a
>    state-conditional value slice (E5d) queues and its cost is weighed
>    against seat 2 at that fork.
> 5. **Seat 2 (gaze) HOLDS until E5c attributes.** Gaze widens the
>    option set; the chooser would still price it with the axis under
>    investigation — gaze compounds AFTER the value seat is right, and
>    the house instinct closes the causal gap a FAIL just named. The
>    "different football" the value arm produced goes to the user's
>    eyes at E4 round 2, once a candidate table exists — not before.
>
> **COMMANDER RULING #17 (2026-07-26 — E5c: both hypotheses refuted,
> the third cause found in the numbers; the attempt-value axis):**
>
> 1. **E5c is ACCEPTED — both refutations stand, and both carried real
>    findings out.** HU refuted on third-man (top-up made it WORSE,
>    0.472×→0.395×) yet TRUE on the progression axis (forward share
>    −3.06pp → −0.21pp): the sampling defect was real and the
>    topped-up table is KEPT as the base. HM literally refuted (+3.38pp
>    vs the +4.0pp band, ~2.6σ from zero, control arm −0.06pp): the
>    state premium is real and small. **And B2 measured my #16.3
>    geometric premise FALSE** — third-man destinations are 4.1% inner
>    box, not box-bound (Z2 51.8% / Z4 21.9%). The fourth time this
>    programme has corrected the commander by measurement; owned.
> 2. **The third cause is NAMED: clean-conditioned composition inverts
>    joint-payoff ordering.** On the same forks: the chooser's axis
>    scores pattern 3.53% vs control 3.83% (−0.29pp) while reality pays
>    4.89% vs 3.80% (+1.09pp) — and the model is nearly EXACT off-
>    pattern (3.83 vs 3.80). P̂(clean)×V̂(cell|clean) is accurate for
>    ordinary balls and biased precisely on balls whose value flows
>    through messy paths (40% clean yet highest realized value: box
>    chaos, second balls, the runner's state). The chooser rejects a
>    ball that is CORRECTLY rejected on its own axis and WRONGLY
>    rejected in reality. Registered verbatim: the legacy ×1.15/×1.3
>    were not decoration — they bought exactly the balls an honest
>    single-option comparison cannot win; every one-touch shape
>    survived because it never needed the subsidy.
> 3. **U1's E5a defect is ruled:** the never-adjudicated arrivals were
>    counted at value ZERO and their simulated windows pay 7.07/10.43%
>    — the banked E5a table is SUPERSEDED-PENDING (never edited; its
>    milestone claim V4 stands on its own staging). The fix CONVERGES
>    with the repair: attempt-conditioning has no adjudication gate at
>    all, so one census closes both holes.
> 4. **E5d — THE ATTEMPT-VALUE AXIS — is authorized (executor drafts,
>    Autonomous mode).** Replace the two-factor composition with ONE
>    measured quantity: EV̂(option) = E[outcome | ATTEMPT, observable
>    features], fork-and-force censused, every fork's window simulated
>    and counted (clean, messy, unadjudicated alike). **Phase 0 is free
>    and decisive, on E5c's existing forks:** build the
>    attempt-conditioned table at destination-cell × threat-band and
>    test whether argmax now picks the runner at the measured pattern
>    moments. Re-ranks → Phase 1: fresh census, SHA'd table, chooser
>    axis swap, the E5b watchability probe verbatim, narrow audit,
>    then E4 ROUND 2. Does NOT re-rank → the residual is the state
>    premium and the honest-observability of pattern state (the
>    passer's own action memory + a perceived runner) returns here as
>    a design question. No invented weight anywhere: the repair
>    REMOVES a composition rather than adding one.
> 5. **Seat 2 (gaze) continues to HOLD** per #16.5 — same reasoning,
>    now with a named axis defect instead of an unattributed one.
>
> **COMMANDER RULING #18 (2026-07-26 — E5d Phase 0: the axis re-ranks;
> the two fired gates indict the old table and the census population,
> not the finding; Phase 1 constrained):**
>
> 1. **The #17.4 question is answered YES, decisively.** The attempt
>    axis restores the sign the composition lost (+2.02pp vs reality's
>    +3.18pp vs the coin-flip +0.05pp) and 70 real decisions changed
>    hands (argmax picks the authorized runner 23.78%→39.33%, gate
>    +5.0pp). The non-PASS verdict stands as emitted; neither fired
>    gate touches R1/R2, which are within-population comparisons on
>    Phase 0's own forks.
> 2. **X6's fire is ACCEPTED and it closes the E5a file:** staging
>    proven clean (7,864/7,864 exact) while the rate fired because
>    E5a's value window started at touch+12 against its own contract's
>    "within 240 of kick" — that plus the zero-value convention
>    depressed the banked V table by 1.91pp (relative 27%), certified
>    in code and quantified by D5 (18.7% of arrivals never adjudicated
>    pay 6.04%; missed balls pay 2.85%, not 0). **E5a's table is now
>    fully SUPERSEDED with cause.** The V4 milestone claim survives on
>    its own staging; the table does not. The executor's disclosure
>    that X6 was twice written as a mixed gate is codified in
>    PROBE-CONTRACTS: staging and definition pin SEPARATELY, one gate
>    per claim.
> 3. **C3's near-miss is a DESIGN fact and the third appearance of the
>    house law: a table is honest only on the population it is
>    deployed on.** E2a-1 censused played passes and mispriced unchosen
>    options; E5a censused general touches and overprices the control
>    arm by 2.08pp exactly at licence-triggered moments — where the
>    chooser actually runs. Do not widen the 2.0pp band; align the
>    population.
> 4. **Phase 1 is AUTHORIZED under these constraints (executor drafts,
>    Autonomous mode):** (a) the census population IS the deployment
>    population — licence-triggered decision moments, full candidate
>    set, fork-and-force; (b) the value window runs [kick, kick+240]
>    from the attempt per contract, every fork's window simulated, no
>    adjudication conditioning anywhere; (c) features stay
>    destination-cell × threat-band (the validated axes) — the pattern-
>    state feature is NOT added preemptively: at deployment-population
>    frequencies part of the +3.4pp premium is absorbed naturally, and
>    the feature question returns ONLY if third-man still misses;
>    (d) gates: held-out calibration on DEPLOYMENT moments, both arms,
>    powered, band 2.0pp; staging/definition gates separated per
>    PROBE-CONTRACTS; the E5b watchability probe verbatim; §2 band,
>    dominance, perf pins, Y4V power-off identity; (e) table as SHA'd
>    data, chooser axis swap, then **E4 ROUND 2**.
> 5. **Seat 2 (gaze) continues to HOLD.** Same reasoning as #16.5; the
>    value seat now has a proven-re-ranking axis awaiting its honest
>    census, which is the last step before the user's eyes.
>
> **COMMANDER RULING #19 (2026-07-26 — Phase 1's stop; C3 redrawn on
> the floor, not the tolerance):**
>
> 1. **The stop was correct and the round's substance is BANKED.** C2
>    validates the house law in numbers (control arm +2.08pp → +0.65pp
>    by aligning the population, band never widened); S1/D1 — the
>    separated staging/definition pins — worked exactly as designed on
>    first use (each can say which claim moved: the X6 lesson, cashed);
>    R2 closed the boundary question by measurement (deployment-built
>    table on the general population: −0.72pp, in band). Census
>    findings banked: attempt gradient 1.16% → 21.33% (13.41pp), and
>    R5 quantifies what the composed axis threw away — 6,428 of 15,398
>    attempts are not clean receptions and still pay 2.15%.
> 2. **C3 is REDRAWN, not retired — and the fix is the FLOOR, not the
>    tolerance.** Retirement (the I2 route) does not apply: per-bucket
>    honesty is load-bearing (argmax compares options bucket-by-bucket;
>    aggregates can mask a bad cell), so the question must be answered,
>    not dismissed. But the gate as written was structurally guaranteed
>    to fire on noise: 5.0pp at n≈235 is 1.54σ (~11% false-fire per
>    bucket; near-certain across two dozen). The executor's own
>    diagnosis is codified in PROBE-CONTRACTS: inherited gate values
>    must be re-powered against the inheriting contract's parameters.
>    **C3R: the 5.0pp tolerance KEEPS its V3 meaning; the per-bucket
>    floor RISES until 5.0pp ≥ 3.4σ** (n_min derived ex ante per bucket
>    from the A-set rates — ≈1,000+ at p≈0.15), reached by a targeted
>    census top-up on the existing harness, judged on a FRESH held-out
>    split, gate text verbatim. No re-running the old check on the old
>    data with a new number — that is the forbidden move in both
>    directions.
> 3. **On C3R's PASS the #18.4 pipeline continues unchanged and needs
>    no new ruling:** table committed as SHA'd data → chooser axis swap
>    → the E5b watchability probe verbatim → narrow audit → **E4 ROUND
>    2**. Any fire anywhere returns here. Seat 2 (gaze) holds.


[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '281,440p' docs/world-model/PROGRAMME.md; sed -n '441,620p' docs/world-model/PROGRAMME.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
> **COMMANDER RULING #9 (2026-07-25 — E2b-0 accepted; concurrency rule;
> E2b-1 constraints; green path to E4):**
>
> 1. **The E2b split and E2b-0's PASS are ACCEPTED.** The gap was real —
>    a blind option prices as a probability, a seen one as corridor
>    seconds, E0 refuses scalar scores by design, and inventing the
>    joining weight was forbidden — so measuring the exchange rate first
>    (instrument-first, fourth application) was the correct move under
>    the standing authorisation. X5's field-for-field reproduction of
>    E2a-2's table and the re-run at the post-merge HEAD to the same SHA
>    are exactly the conduct the discipline wants.
> 2. **Concurrency CODIFIED (governance 4/4b):** one working tree = one
>    writer; parallel sessions stagger or use separate `git worktree`s and
>    merge through git; before every commit `git status` must show only
>    this session's files — a foreign modification means STOP, reconcile,
>    never stage it. `857784c`'s sweep did no damage but proved the hole.
> 3. **E2b-1 drafting constraints:** (a) NAME the third class — three
>    information states: READ (target + lane in current percept → the
>    E2b-0 curve), SEEN-UNREAD (target perceived, lane not → banded at
>    the known distance — 28.48% of playable options, currently folded
>    silently), UNSEEN (→ marginal); class shares REPORTED — the silent
>    fold is E2a-1's population error family. (b) COMMON UNIT = measured
>    probability: the E2b-0 curve is the exchange rate; no invented
>    weight anywhere in the evaluator. (c) NO DOUBLE-COUNTING of touch:
>    the E2b-0 curve was measured on receptionSuccess in the flag-OFF
>    world; E2b-1 runs flags ON — decompose corridor (interception/
>    reach-based outcome from the same census columns) × touch (the
>    E1a-certified formula at flag-ON strength), or justify an
>    alternative explicitly in the pre-registration. (d) Look-pressure
>    reported on both axes (band axis ≈ not-looking is free; read axis =
>    where looking pays 43→83%). (e) The 6× finding is BOOKED (design
>    contract §4): banded stale-memory pricing stays — honest and cheap —
>    but the value of LOOKING is the lane read only a current percept
>    supports; this pre-registers A4's boundary (doctrine/familiarity buy
>    priors and latency, never lane reads).
> 4. **Green path extended to the user gate:** on E2b-1's PASS the
>    executor drafts E3 directly under Autonomous mode (design contract
>    §3's gates, no new ruling needed); the queue stops at **E4 — the
>    user's play-test**. Any non-PASS anywhere returns to the commander.
>
> **COMMANDER RULING #10 (2026-07-25 — E2b-1's split verdict; the
> perception-cost redraw):**
>
> 1. **The FAIL is accepted and the science is BANKED.** G1 (not-looking
>    never won: 63.28/64.60/63.46% vs oracle 67.90%, every rung in band,
>    +4.61pp endpoint lift) and G2 (route mix survived: long-share 18.05%
>    at 0.8 awareness vs 18.07% omniscient — S3b's ~38% collapse did NOT
>    reproduce) are the two graves this programme dug itself out of, now
>    passed in dormant form. X5's factors multiply back. What failed is
>    plumbing, twice, honestly reported.
> 2. **X3 ruled — hash the world, report the clock.** Determinism hashes
>    cover WORLD OUTCOMES only; wall-clock/perf is a sidecar report,
>    never hashed (PROBE-CONTRACTS codified). The executor's conduct was
>    correct: the verdict stood as emitted, and world-determinism was
>    PROVEN by diagnosis (perf block removed → identical hashes twice),
>    not asserted. The redraw pre-registers the corrected scheme.
> 3. **G3 ruled — E2b-1R redraw, cheaper by computing LESS, never by
>    perceiving less.** The lever is CONSUMPTION-SCOPING: the defender
>    interception entry reads only the BALL percept (build the ball-only
>    cheap path); the passer's full snapshot is computed at pass-decision
>    moments only, not every brain tick. Codified principle: perception
>    cost scales with what consumers READ, not with what could be seen.
>    Honesty is frozen — scan cadence, FOV, retention, keyed error may
>    not move. Budget stays 1.25× / p95 1.50×. The decisive new gate is
>    BEHAVIOUR-NEUTRALITY: same seeds, same moments → the redraw's logged
>    choices must be IDENTICAL to E2b-1's per moment per arm (G1/G2 then
>    reproduce by construction and stand as verification). If
>    consumption-scoping still misses the budget → STOP and report; no
>    honesty shaving, no budget raise.
> 4. **R1's correction is ACCEPTED and the banked number SUPERSEDED**
>    (design contract §4): "28.48% SEEN-UNREAD" was the evaluator-null
>    share — a mixed class, mostly UNSEEN; true SEEN-UNREAD ≈ 0.2%. The
>    taxonomy stands, nearly empty. Banked alongside: look-pressure 9.17%
>    at 0.8 / 17.03% at 0.2 (the future gaze consumer's workload), and
>    47% omniscient agreement with the live brain — the evaluator is a
>    DIFFERENT chooser, so E3 must EXPECT play to change and measure
>    whether the change stays in band.
> 5. **Green path unchanged:** E2b-1R PASS → the executor drafts E3
>    (Autonomous mode) → queue stops at **E4, the user's play-test**.
>
> **COMMANDER RULING #11 (2026-07-25 — E2b-1R accepted; E3 reviewed, GO):**
>
> 1. **E2b-1R ACCEPTED — every gate.** 1.329× → 1.069× by computing less,
>    not perceiving less; B1's seven families bit-identical across 3,000
>    moments × 4 arms, so G1/G2 graduate from banked-with-asterisk to
>    VERIFIED; X6 pins the cheap path field-for-field against the full
>    path in perpetuity; X3's fix proved itself mid-development (perf
>    measurement changed, world hash did not move). Both pre-freeze
>    disclosures tightened faithfulness rather than loosening it — the
>    GK-skip catch is exactly the behaviour-change-in-a-perf-coat B1
>    exists to catch. Exemplary run.
> 2. **E3's draft is REVIEWED and APPROVED to run as pre-registered** —
>    no gate changes. The chain holds: X4 (live consumer must reproduce
>    E2b-1R's banked choices), §2 band verbatim from C1-B's grave,
>    no-strict-dominance 20–80 as the operational form of "situational",
>    co-evo restoration directional per the vision/positioning precedent,
>    nothing ships, E4 is the user's.
> 3. **One scope registration (design contract §2), no gate touched:**
>    v1's honesty claim covers the CHOICE; execution stays truth-aimed —
>    the same kick the legacy game gives every pass, so the band compares
>    like with like and X4 chains without a seam. Perception-honest
>    AIMING (passes to a departed runner honestly missing) is named OUT,
>    a future slice beside C-track lead/weight craft.
> 4. Standing user gates after E3: **E4 (the bundle) and F-ACCEPT (art
>    F2–F7)** — one play session can serve both if the user prefers.
>
> **COMMANDER RULING #12 (2026-07-25 — E3's verdict; the thesis amended by
> its own measurement; E3R):**
>
> 1. **E3's FAIL is accepted, and X4's achievement is banked loudly:** the
>    first live perceived choice in this game's history, 0/10,292
>    divergences from the probe that validated it, baseline arm matching
>    C1-B's frozen numbers to four decimals. The dormant→live seam HOLDS.
>    The build-defect disclosure (refreshPerception on the wrong flag,
>    caught by the executor's own ablation, fixed with bit-identical
>    proof) and the pre-run dominance operationalisation were exemplary.
> 2. **The v1 thesis is REFUTED as stated, by the cleanest evidence this
>    programme has produced:** bundle minus touch cost is in EVERY band;
>    touch cost alone is C1-B to the decimal; and R1 proves the break is
>    MECHANICAL (spill → loose → aerial — the chooser's long share never
>    moved). Information cannot absorb a tax that no decision produces.
>    The bundle hedged the wrong risk: the missing co-evolution partner
>    for touch cost is not the passer's information but the RECEIVER'S
>    CRAFT — C5's cushion-vs-one-touch as a priced choice is the
>    adaptation lever today's receivers simply do not have.
> 3. **Disposition (the §5 pre-registered path, followed exactly):**
>    touch cost leaves the v1 live set (design contract §2 amended);
>    E1b's curve stays BANKED dormant — the measurement is never wasted —
>    and its live entry re-seats to a future C5-coupled slice. **v1 live
>    bundle = perceived choice + perceived defence + the evaluator**,
>    the pair whose live equilibrium the ablation already measured
>    in-band (−21.69% alone → +2.20% together: the S3b/vision-attr law,
>    confirmed live). No partial ship: nothing goes to E4 until E3R
>    passes IN FULL — ablation diagnostics are not passes.
> 4. **E3R drafting constraints (executor, Autonomous mode):**
>    (a) CHAIN FIRST: the banked E2b-1R choices were priced with the
>    flag-ON touch factor; E3R's world runs touch-flag OFF, so pricing
>    must be flag-off-honest (the world as it is, never phantom costs) —
>    therefore re-run the E2b-1R staging with flag-off pricing to re-bank
>    the choice reference (G1/G2 must re-hold there), THEN X4 chains the
>    live chooser to the NEW reference. (b) All five gate families
>    verbatim on the 1+3+4 bundle, fresh sealed evo included. (c) STYLE
>    ENTROPY carries two pre-registered hypotheses: H1 touch-flattening
>    (entropy ≥0.60 recovers without the curve → benign, closed) vs H2
>    genome-blind chooser (the evaluator prices pure measured probability
>    and may have removed the seat through which tactical genes expressed
>    style; if entropy stays <0.60 the fork returns to the commander for
>    a designed PREFERENCE SEAT — genes modulating evaluator weights as
>    priced choices, the two-engines junction — never a tuning knob).
>    (d) PERF: the remaining consumption-scoping lever is WHICH bodies —
>    candidate-scoped snapshots materialised at pass-commit only; budget
>    stays 1.25×; misses → report, no honesty shaving. (e) 20–80
>    dominance band kept with its purpose documented: >80% is the
>    always-heavy pathology, <20% guards degenerate never-heavy as a
>    mispricing symptom; expect the distribution to shift heavier under
>    flag-off pricing. (f) Stamina-suite break re-tested on the revised
>    bundle before any deeper diagnosis.
> 5. **Green path: E3R PASS → E4 + F-ACCEPT** (one play session can serve
>    both). Any non-PASS returns here.
>
> **COMMANDER RULING #13 (2026-07-25 — E3R 26/28; the last two gates get
> their honest forms; E3R2):**
>
> 1. **The 26 stand BANKED, and three deserve names:** co-evo restoration
>    PASSED for the first time in this project's history (+0.2864 →
>    +0.0282 — the gate the vision-attr saga failed four times); the §2
>    band held on all five dimensions with the revised bundle; and
>    constraint (a)'s premise was DISPROVEN AND PROVEN — the commander
>    assumed the banked reference was flag-ON-priced, the executor
>    re-banked and not one digit moved. My premise was wrong; their
>    verification was exactly right. X4R 0/10,292.
> 2. **CE2 disposed — the verdict stands, the gate was mis-typed.** A
>    single-seed entropy floor is an ecological claim gated
>    non-ecologically (PROBE-CONTRACTS' own type table says multi-seed;
>    codified there). **H2 (genome-blind chooser) is REFUTED by its own
>    pre-registered discriminators**: cross-club spread UP (1.977 vs
>    1.684), gene expression STRONGER (−0.222 vs −0.122), the chooser
>    club-dependent (0.60m), and the robustness seed flips the statistic
>    to 1.5321. The preference-seat fork does NOT open. **CE2R** (inside
>    E3R2): median style entropy across 5 fresh sealed-evo seeds ≥ 0.60,
>    with the three mechanism discriminators as co-gates.
> 3. **X5R disposed — lazy reconstruction APPROVED, and its semantics
>    REGISTERED: perception is PULL.** A body knows what its scans would
>    have shown, materialised at the moment it acts; keyed noise makes
>    the values constructionally identical, so this changes WHEN the
>    computation happens, never WHAT is known. Hard gates in E3R2:
>    field-for-field snapshot equivalence lazy-vs-eager, pinned by a
>    perpetual test (the X6 pattern); B1-style choice identity against
>    E3R's own logged choices; budget stays 1.25× / p95 1.50×. Registered
>    boundary: any FUTURE live consumer needing scan-moment PUSH events
>    (a body reacting AT the instant of seeing, unpolled) must revisit
>    this seat explicitly — pull semantics is what ships in v1.
> 4. **The stamina finding carries to E4 as a FEEL item, never a
>    re-baseline.** Honest perception makes play calmer (defenders commit
>    later, passes find supported targets, fewer loose-ball chases) —
>    that is an emergent consequence of exactly the kind VISION orders.
>    Whether a calmer game FEELS right is the user's judgment at E4. IF
>    the bundle ships, a fatigue-economy re-seat (stamina costs
>    recalibrated so the tank matters in the calmer game) is registered
>    as the follow-up slice; the suite red stays a finding until then.
> 5. **E3R2 is NARROW: only the two gates, in their honest forms** —
>    CE2R multi-seed + X5R2 lazy-reconstruction-under-pins. The 26
>    banked results transfer (the equivalence pins are what make that
>    transfer rigorous). **E3R2 PASS → E4 + F-ACCEPT**; CE2R median
>    < 0.60 → a real diversity problem, back here; lazy pins fail →
>    the reconstruction is not the perception, fix it, never widen.
>
> **COMMANDER RULING #14 (2026-07-26 — E3R2 accepted 29/29; E4 opens):**
>
> 1. **E3R2 ACCEPTED.** Pull semantics proven to be the SAME perception
>    (P1 7/7 perpetual pins, P2 identical worlds + full choice
>    trajectories, P3 17/17 banked live numbers bit-identical — the
>    rigorous transfer mechanism ruling #13.5 asked for, delivered as
>    proof rather than assumption); perf 1.1977× / p95 1.1529× inside
>    budget by computing less, never by seeing less; CE2R median 1.5253
>    with 4/5 seeds ABOVE 1.0 — under this bundle a typical world is MORE
>    stylistically diverse than without it, and all three mechanism
>    co-gates hold. The preference-seat fork stays closed. The
>    between-tick pull asymmetry is honestly pinned (never knows MORE).
> 2. **CE1's honest weight registered:** advantage-shrink held in 2/5
>    fresh seeds with mostly-negative noisy paired diffs — there is no
>    attacking runaway ANYWHERE to restore from, which satisfies the
>    gate's purpose in substance; a multi-seed CE1 form joins the
>    post-ship follow-up list beside the fatigue-economy re-seat. It
>    does not block E4.
> 3. **E4-PREP authorized (small, any session):** the two v1 flags
>    exist only as Match config — the user plays the deployed build. Add
>    an in-game settings toggle (the F0 lighting-control precedent:
>    LeftBar control, persisted, localised) that flips
>    `edsPerceivedChoice` + `edsPerceivedDefence` together at match
>    start — **default OFF, pinned by a default-off test, fingerprint
>    unchanged, CI deploy**. Live A/B on the user's phone IS the E4
>    instrument. At ship time the toggle's fate (keep as "legacy brain"
>    switch or remove) is decided then.
> 4. **E4 + F-ACCEPT are open — the user's eyes, nothing else.** Ship =
>    both flags default ON + fingerprint/perf rebaseline + ROADMAP
>    entry; revert = the whole bundle (dormant assets stay banked).
>    Registered feel items for the session: the game is measurably
>    CALMER (later tackles, better-supported passes, fewer loose-ball
>    scrambles) and a full match no longer spends the stamina tank
>    (0.9697 vs 0.93) — judge whether calm feels like football or feels
>    flat; fatigue re-seat is already queued if shipped.
>
> **COMMANDER RULING #15 (2026-07-26 — E4 round 1 disposed; the value
> half; drafted on the executor's own numbers, no re-derivation):**
>
> 1. **E4 round 1: no ship, no revert — the direction is affirmed and
>    the flags stay default-OFF.** E4 becomes an ITERATIVE gate: the
>    user plays each round on the preview toggle; v1 ships when their
>    eyes say so, likely after the value seat lands. The user's three
>    observations map one-to-one onto the three named seats — the map
>    predicted the play experience, which is what "方向没问题" means
>    operationally.
> 2. **The two-judges seam finding is ACCEPTED as the round's central
>    fact:** the E3 seam replaced WHO receives but left WHETHER/WHY on
>    the legacy score, so the licence (legacy tactical layer: 2过1
>    ×1.15+, third-man, overlap ×1.3, anti-back-pass ×0.55) and the
>    delivery (argmax P(clean)) are granted by different judges — the
>    overlap runner earns the pass, the ball goes to the safest man,
>    combinations collapse (third-man −35.7%, overlap −68.0%, forward
>    share −5.1pp, shots −6.0%). This is a SEAM artifact, not a
>    perception failure: honest information + half an objective.
> 3. **E5 — THE VALUE AXIS — is authorized (executor drafts, Autonomous
>    mode).** Constraints: (a) V is MEASURED, never invented: the
>    fork-and-force harness prices each candidate by WHAT HAPPENED NEXT
>    (threat delta / shot-within-N / progression), censused over real
>    decision moments, table committed as SHA'd data — the E2b-0
>    exchange-rate move applied to the value half; circularity
>    registered honestly (V is measured under legacy-brain play, like
>    the prior census — sufficient for v1, revisit if E5's own audit
>    says otherwise). (b) The decision becomes measured-P × measured-V
>    composition, pre-registered exactly, no residual hand weights.
>    (c) **The slice's central hypothesis, pre-registered:** measured
>    value REPRODUCES combination play without the hand-coded bonuses —
>    third-man/overlap counters recover toward flags-off levels because
>    the third man stands in measured space, not because ×1.3 says so.
>    PASS = the first hand-coded→measured replacement inside the brain,
>    the emergence doctrine cashed in code; FAIL = the value definition
>    is myopic (one-step V cannot see two-pass patterns) — report, do
>    not bolt the old bonuses back on. (d) Narrow audit before E4 round
>    2: §2 band + dominance + perf pins + the watchability instruments.
> 4. **The gate-set gap is CODIFIED:** every future band carries the
>    watchability instruments as REPORTED dimensions — forward-pass
>    share, third-man releases, overlap releases, give-and-gos, shots,
>    longest chain. 29 gates contained no watchability instrument while
>    watchability measurably dropped; minutes of probe cost buy what
>    only a play session could see. (PROBE-CONTRACTS note added.)
> 5. **Seats 2 and 3 queued behind E5, in the user's priority order:**
>    the gaze consumer (look-before-pass — A4's unpark condition "a
>    live seam exists" is now MET; look-pressure measured at 6.59% of
>    live pass moments), then C5's time dimension (hold-draw-release,
>    one-touch vs control as priced choices, where ruling #12 already
>    re-seated the touch cost). Each is its own slice with its own
>    audit and E4 round.
>
> **COMMANDER RULING #16 (2026-07-26 — E5's split verdict; the
> attribution experiment; gaze holds):**
>
> 1. **E5a is BANKED as a milestone:** the value half is measurable and
>    the product needs no weight — P̂ × V̂ predicted its own conjunction
>    to 0.03pp on 14,114 forks (4.014% vs 3.982%), the V table carries
>    10.10pp of discrimination, and both licence gates returned the
>    banked tables bit-exact. Whatever E5c attributes, THIS survives:
>    the game now owns a validated value instrument.
> 2. **E5b's FAIL is accepted exactly as pre-registered** — the central
>    hypothesis died on the pattern it was predicted to die on
>    (third-man 0.472×, worse than v1's 0.603×) while one-pass shapes
>    recovered (overlap 0.835×, give-and-gos ABOVE flags-off). Banked
>    finding: the value axis produces a COHERENT different football —
>    direct, shot-hungry (+17.5%), shorter chains, band healthier than
>    E3R — it works, and it cannot see two-pass patterns. Correct
>    conduct throughout: no bonuses re-added, no horizon widened, no
>    outcome redefined, `edsValueAxis` kept out of the preview toggle
>    by a pinned test.
> 3. **The differential CANNOT arbitrate the two causes — a geometric
>    confound, registered:** overlap runners target the OUTER attacking
>    third (well-sampled, 13.58% cell — recovered) while third-man
>    runners arrive in the INNER box (the two cells below the 400
>    floor, reading marginal — died further). So "one-pass shapes
>    recovered, the two-pass shape died" fits BOTH one-step myopia (HM)
>    and inner-box undersampling (HU). Separating them is an
>    experiment, not a paragraph — exactly as the executor said.
> 4. **E5c — ATTRIBUTION — is authorized (executor drafts, Autonomous
>    mode). Two independent cheap measurements, both on the existing
>    harness:** (a) **HU test first (nearly free):** targeted census
>    top-up of the inner attacking-third cells to the 400 floor (staged
>    moments where inner-box candidates exist; the census's own
>    acceptance rules verbatim), re-emit the table as new SHA'd data,
>    measure how far the topped-up cells move off the marginal, then
>    re-run the E5b watchability probe with gates verbatim. HU
>    confirmed iff third-man recovers materially with nothing else
>    changed. (b) **HM test on (a)'s residual:** at live
>    pattern-active moments (give-and-go just completed, third runner
>    in flight), fork-and-force the pass to the runner and compare
>    realized outcome value against the topped-up table's V̂ at that
>    destination — HM confirmed iff realized exceeds V̂ beyond a
>    pre-powered band even after the top-up, i.e. the cell-indexed
>    table is STATE-blind, not sample-starved. If both fire, a
>    state-conditional value slice (E5d) queues and its cost is weighed
>    against seat 2 at that fork.

[35m[3mcodex[0m[0m
The programme has already caught several real errors itself—selected-sample priors, an ecological claim gated on one seed, and an inherited tolerance that was badly underpowered. I’m now separating those acknowledged defects from residual problems that still affect the evidential chain, especially whether thousands of forked options are being counted as thousands of independent observations.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,194p' docs/world-model/EDS-E0-OPTION-VALUATION.md; sed -n '1,150p' docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md; sed -n '1,278p' docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E0 — Dormant pass-option valuation

Status: **PRE-REGISTERED — no run yet.** (Stage E0 of
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3, ratified by the
user 2026-07-24: "选 EDS。按 Track E 跑 E0→E1→E2→E3,停在 E4 等我 play-test".)

Date: 2026-07-24

## 1. The question

> Can a pure, observation-only valuation of pass options — each candidate at
> 2–3 power levels, priced in flight time, corridor interception margin and
> receiver touch difficulty — reproduce the outcomes C1-A2 actually measured,
> **including the world's current defect** that a hot ball costs the receiver
> nothing?

Reproducing the defect is the point. If the evaluator predicts a reception cost
the world does not charge, it is not modelling this world, and E1's flagged
touch-cost curve could not be validated against it.

## 2. Authorised seat

ONE new pure module, `src/ai/passOptionValue.ts`, dormant with **zero live
callers**, composing banked machinery unchanged:

* `prediction.predictGroundPass` (already takes `powerMultiplier`);
* `passAffordance.evaluatePassAffordance` (already takes `powerMultiplier`) for
  arrival margins, receive pressure, progression, offside;
* `passCorridorInterception.evaluatePassCorridorInterception` (consumes
  `launchSpeed`) per observed opponent;
* a **documented mirror** of `mechanics.touchFailChance`'s curve, in the same
  pattern `prediction.ts` already uses to mirror `performPass` — because a pure
  `ai/` module may not import the sim's mechanics. A hostile test pins the mirror
  against the real function across an input grid, so the two cannot drift.

No `src/**` change anywhere else. No probe may wire it into a decision.

## 3. Information boundary (binding)

Allowed inputs: the passer's own `PerceptionSnapshot`, the probe-supplied
candidate target and power level, `KnownReachProfile`s, attack direction.

Forbidden: world truth, `Match`, RNG, another player's memory, private intent,
coach doctrine, familiarity, and — the subtle one — **the receiver's private
attributes**. A passer pricing *this* receiver's first touch would be
familiarity, which A4 owns. E0 therefore prices a **generic receiver at neutral
technique/positioning 0.5**, documented in the module. Receiver *velocity* is
observed and may be used (relative closing speed is physics, not knowledge).

## 4. Frozen protocol

The probe re-uses C1-A2's acceptance and outcome measurement **verbatim** —
same seeds `93,000..`, near-stationary receiver so all power arms share one
corridor, every arm drawing one execution gaussian, outcome decided by the FIRST
body to touch the ball — and adds the evaluator's predictions on the frozen
pre-kick state. Re-deriving C1-A2's measured rates is itself a validity check.

```text
accepted states                 120   (max 512 seeds from 93,000)
powers                          0.85 / 1.00001 / 1.15   (C1-A2 verbatim)
contested corridors             freeze laneOpenness <= 0.50
two invocations byte-identical  shared SHA-256
```

## 5. Frozen gates

### Exact validity

```text
C1-A2 measured rates reproduced exactly:
  opponent-first, contested   0.565 / 0.489 / 0.391
  touch failure               0.119 / 0.121 / 0.118
per-arm RNG draws equal        100% of states
non-finite / null valuations   0 (a null valuation on an accepted state is a FAIL)
zero live callers of the module (module imports no sim/Match; audited)
tsc + build clean · full suite green (incl. the mirror contract test)
production fingerprint          57b0bdab…c673 unchanged
```

### Prediction gates (evaluator vs the world it claims to model)

```text
P1 predicted interception threat (max defender corridor slack, seconds)
     strictly DECREASING in power on contested states                  ✓ required
     and the evaluator's per-state SAFEST option is 1.15 in >= 60%      ✓ required
P2 predicted touch-fail prior spread 0.85→1.15  <  3.0pp
     (the world's near-flat cost; 3.0pp is C1-A2's own resolution floor)
P3 predicted flight time strictly DECREASING in power
P4 predicted arrival speed strictly INCREASING in power
P5 AGREEMENT: measured opponent-first rate under each state's
     evaluator-safest power is at least 5.0pp lower than under its
     evaluator-riskiest power
```

Derivations, banked numbers only: P1's direction and P5's floor come from C1-A2's
measured 17.4pp contested spread across fixed powers — a per-state ranked
selection should capture at least a third of it, so 5.0pp is conservative. P2's
3.0pp is C1-A2's stated ±3.9pp resolution, floored. P3/P4 are physics sanity.

## 6. Stop rules

* **P1 or P5 fails** → the valuation does not model the interception physics it
  composes; E0 is refuted and the bundle has no evaluator. Park and report; do
  not add weights until it agrees.
* **P2 fails** (the evaluator predicts a cost the world does not charge) → the
  mirror or the arrival-speed derivation is wrong. Fix the *mirror*, never the
  gate, and re-run; the mirror is a factual claim about `touchFailChance`, not a
  tunable.
* Fingerprint drift or any live caller → revert; E0 is dormant by definition.
* No new tactical weight table, no scalar score, no use of
  `controlProbability` as a score (S4a: 95.2% of truth samples in its top
  quartile — it is an oriented dimension only).

## 7. E0 RESULT — FAIL on two axes, with three findings that reshape E2 (2026-07-24)

`scripts/probes/eds-option-valuation.ts`, seeds `93,000..93,126`, 120/120
accepted, 92 contested, deterministic across two invocations, SHA
`79ab8339…d3fa`. `npx tsc --noEmit` clean; the module is pure and has zero live
callers; production fingerprint `57b0bdab…c673` unchanged.

```text
EXACT
  C1-A2 opponent-first reproduced   0.565 / 0.489 / 0.391   ✓ exact
  C1-A2 touch failure reproduced    0.119 / 0.121 / 0.118   ✓ exact
  per-arm RNG draws equal           120/120                 ✓
  null valuations                   165 (55 of 120 states)  ✗ gate was 0
  every state priced                65 of 120               ✗

PREDICTION
  P1 threat falls with power        0.843 → 0.586 → 0.446 s ✓ and the per-state
                                    safest option is 1.15 in 52/52 contested   ✓
  P2 predicted touch-cost spread    7.34 → 11.29 = 3.95pp   ✗ gate was < 3.0pp
  P3 flight time falls              1.713 → 1.303 → 1.061 s ✓
  P4 arrival speed rises            5.99 → 8.69 → 11.39     ✓
  P5 ranked selection agrees        measured opponent-first 0.558 (evaluator's
                                    riskiest) → 0.346 (its safest) = 21.2pp    ✓
```

### Finding 1 — the evaluator genuinely models the interception physics

P1 and P5 are not marginal. Ranking the three options by predicted corridor
threat and taking the safest moves the **measured** opponent-first rate from
55.8% to 34.6% — a **21.2pp** swing, *larger* than the 17.4pp available from any
fixed power, because the ranking is per state. Pricing pass options in TIME
works, and it works on observed facts alone.

### Finding 2 — observation does not blur the option set, it DELETES it

The 165 nulls are not scattered: they are **all-or-nothing per state**. 65 states
priced all three options, 55 priced none, and the split is by distance — mean
pass distance **21.7m for the unpriced states against 16.8m for the priced
ones**. The cause is the information boundary doing its job: at awareness 0.8 a
passer frequently has no observed fact for a distant teammate, and you cannot
price a pass to a man you cannot see.

**This is the concrete mechanism behind S3b's failure.** S3b's post-mortem
recorded that route richness collapsed when candidates shared an observed
snapshot (headers 6.39→4.05, cutbacks 3.96→2.46) and read it as "the score
table's dependence on omniscience". E0 now shows the sharper version: replacing
truth with observation removes **~46% of today's pass options, disproportionately
the long progressive ones**. Any both-sides perception stage must therefore
decide explicitly what a passer does about an unobserved teammate — vanishing
them is what broke S3b, and no amount of evaluator quality fixes it.

The pre-registered gate treated any null as a failure. That was the right gate to
have set (it forced this finding into the open) and it fails honestly, but it
conflated "the model cannot answer" with "the option genuinely does not exist".
The redraw separates them.

### Finding 3 — the touch-cost disagreement is most likely the METRIC, not the model

The mirror is pinned to `touchFailChance` by a passing contract test across a
5-dimensional input grid, so the curve is not in doubt. At the predicted arrival
speeds the formula implies a 3.95pp cost spread from 0.85 to 1.15, while the
measured spread is 0.0pp. But **C1-B already proved this measurement blind**
(§13.3): "ended in control" absorbs a spilled touch that M3 recontact
re-collects, and its own lesson was that future attempts must measure the FIRST
TOUCH. The most likely reading is therefore that the world does charge a small
reception cost, of roughly the predicted order, and that neither C1-A2 nor this
probe has yet looked at the right event.

If that is right it also sharpens C1-B's premise: the cost is not architecturally
absent, it is **small and previously unmeasured** — which changes E1's job from
"create a cost" to "make an existing small cost large enough to matter, and
measure it where it actually happens".

### Verdict and redraw

**FAIL** — axes: `null valuations` and `P2`. Per the EDS design §5 the queue
stops and the fork returns to the commander, which under autonomous mode is this
session; the redraw is **E0b**, pre-registered in
[`EDS-E0B-OPTION-VALUATION-REDRAW.md`](EDS-E0B-OPTION-VALUATION-REDRAW.md). The
evaluator module is NOT changed by the redraw — nothing about it was refuted; two
measurements were.
# EDS E0b — Option valuation, measured at the first touch

Status: **PRE-REGISTERED — no run yet.** (Redraw of
[`EDS-E0-OPTION-VALUATION.md`](EDS-E0-OPTION-VALUATION.md) after its honest FAIL,
drafted by the autonomous session as working commander per
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §5.)

Date: 2026-07-24

## 1. What is being redrawn, and what is NOT

**The evaluator module is untouched.** Nothing about `passOptionValue.ts` was
refuted — P1, P3, P4 and P5 all passed, and P5 passed strongly (a per-state
ranked selection moved the measured opponent-first rate 21.2pp). Two
*measurements* failed, and both failures were informative:

1. the null gate treated "the passer cannot see this teammate" as an error,
   when it is the single most important thing E0 discovered (46% of states,
   the long passes);
2. P2 compared the predicted reception cost against a metric that **C1-B had
   already proved blind** — "ended in control" absorbs a spilled touch that M3
   recontact re-collects.

E0b changes only how those two things are measured. No gate value that passed is
touched, and the seeds stay the same.

## 2. The two measurement changes

1. **Measure the RAW first touch.** The probe already knows the tick of the
   target's first contact. M3 resolves the control attempt
   `CONTACT_CONTROL_DELAY_TICKS = 3` ticks later, so the honest question is
   whether the ball is owned by the target at `firstTouchTick + 3 + 1`. A spill
   the player re-collects two seconds later is a spill. The old
   eventual-control number is retained as a reported diagnostic so both metrics
   stay visible side by side — that comparison is the evidence for C1-B's lesson.
2. **Nulls are classified, not failed.** A state where the passer has no observed
   fact for the target is a legitimate absence of an option, and E2 must decide
   what to do about it. E0b reports the split and gates only **non-vacuity**:
   at least 40 contested states must price all three options, so the prediction
   gates have a real sample. (40 is the same floor D-TRI-0 used for a
   sample-of-96 protocol; the E0 run had 52.)

## 3. Frozen gates

```text
EXACT
  accepted states                   120  (max 512 seeds from 93,000)
  per-arm RNG draws equal           100% of states
  non-finite                        0
  contested states priced 3/3       >= 40                (non-vacuity)
  C1-A2 eventual-control rates reproduced exactly  0.119 / 0.121 / 0.118
  two invocations byte-identical, shared SHA-256
  module still pure, zero live callers, fingerprint 57b0bdab…c673 unchanged

PREDICTION (P1, P3, P4, P5 verbatim from E0; only P2 is restated)
  P1 predicted threat strictly decreasing in power, and the per-state safest
     option is 1.15 in >= 60% of priced contested states
  P2' AGREEMENT: | predicted touch-cost spread − measured RAW first-touch
     failure spread |  <=  2.0pp
  P3 predicted flight time strictly decreasing in power
  P4 predicted arrival speed strictly increasing in power
  P5 measured opponent-first under each state's evaluator-safest power is
     >= 5.0pp lower than under its evaluator-riskiest power
```

P2' derivation: the predicted effect is 3.95pp. The agreement band is half the
effect size, which is a stated criterion about precision rather than a threshold
fitted to any observed value — the predicted quantity carries real slack (the
actual relative speed at the actual touch, and a squad's technique distribution
against the neutral 0.5 the information boundary forces).

## 4. Stop rules

* **P2' fails high** (measured raw spread ≈ 0 while predicted ≈ 4pp) → the world
  genuinely does not charge for pace at reception even at the first touch, and
  C1-B's original premise stands unqualified. E1 then has to CREATE the cost, and
  E0's evaluator must be corrected to stop predicting one.
* **P2' fails low** (measured raw spread much larger than predicted) → the
  mirror's inputs are wrong, most likely the arrival-speed derivation. Fix the
  derivation, not the gate.
* **Non-vacuity fails** (< 40 priced contested states) → observation deletes so
  much of the option set that E0's prediction claims cannot be tested at
  awareness 0.8, which is itself the E2 question arriving early. Report, stop.
* A third re-pose of E0 is NOT authorised. If E0b cannot settle the reception
  cost, the question goes to E1 as an explicit open item and the fork returns to
  the user.

## 5. E0b RESULT — FAIL, and the stop rule binds (2026-07-24)

`scripts/probes/eds-option-valuation-firsttouch.ts`, seeds `93,000..93,126`,
120/120 accepted, 92 contested, 52 priced 3/3 (non-vacuity ✓), deterministic
across two invocations, SHA `2b7d6a3b…44cb`. Fingerprint `57b0bdab…c673`
unchanged; the module is still pure with zero live callers.

```text
P1 threat falls with power        0.843 → 0.586 → 0.446 s, safest=1.15 52/52  ✓
P3 flight time falls             1.713 → 1.303 → 1.061 s                     ✓
P4 arrival speed rises           5.99 → 8.69 → 11.39                         ✓
P5 ranked selection agrees       measured opponent-first 0.558 → 0.346        ✓
P2' agreement                    predicted +4.0pp vs measured RAW −6.2pp      ✗
C1-A2 eventual-control reproduced  0.136 / 0.106 / 0.145 (was 0.119/0.121/0.118) ✗
```

### The reproduction gate caught an instrumentation error of mine

The retained eventual-control diagnostic no longer matches C1-A2 — **because the
new raw measurement perturbs it.** E0b steps the match four ticks to resolve the
first touch *before* running the old up-to-12-tick ownership loop, so the second
metric no longer starts where C1-A2 started it. The two reception metrics are not
independent when measured in the same branch, and the exact gate that demanded
C1-A2 be reproduced is what surfaced it. That is the gate doing its job on the
experimenter.

### And the raw metric came out INVERTED, not merely different

Raw first-touch failure measured **0.220 / 0.227 / 0.158** — failure *falls* as
the ball gets harder — against a predicted **+4.0pp** rise. A 10.2pp
disagreement in the opposite direction is not a calibration gap; combined with
the contamination above it says the instrumentation, not the physics, is what is
being measured. A fixed four-tick window after "first contact" evidently does not
line up with the M3 control attempt the same way for a rolled ball as for a
drilled one.

### Verdict: the reception-cost question leaves E0 unsettled, by rule

**FAIL.** §4's stop rule is explicit and binds: *"A third re-pose of E0 is NOT
authorised. If E0b cannot settle the reception cost, the question goes to E1 as an
explicit open item and the fork returns to the user."* So:

* **Banked and robust** (identical across E0 and E0b, two byte-identical runs
  each): the evaluator models the interception physics — per-state ranking by
  predicted corridor threat moves the measured opponent-first rate
  **0.558 → 0.346 (21.2pp)**, with the safest option being 1.15 in **52/52**
  contested states, and predicted flight time and arrival speed monotone in power.
* **Banked finding** (unchanged by the redraw): at awareness 0.8 the passer can
  price nothing at all in **55 of 120 states**, split by distance (21.7m unpriced
  vs 16.8m priced) — observation deletes ~46% of today's options, mostly the long
  ones. This is the mechanism behind S3b's route collapse and it is E2's central
  design problem.
* **Unsettled and handed to E1 as an explicit open item**: what the world charges
  a receiver for pace. Three metrics now disagree — eventual control says ~0,
  raw-four-tick says it *falls* with pace, the formula says it rises ~4pp — so
  **E1's first job is a reception measurement that is trustworthy**, established
  against the real `attemptFirstTouch` roll rather than inferred from ownership
  timing. Until that exists, no touch-cost change can be validated, which is
  precisely what C1-B's revert already implied.

The fork returns to the user: E1 must be re-scoped around building that
measurement first, and that is a change to the ratified ladder's content, so it
is not the executor's call.
# EDS E1a — The first-touch instrument

Status: **RUN 2026-07-24 — §6 is the frozen result: I1 PASSES, I2 does not
decide, probe verdict FAIL. DISPOSED 2026-07-25 by commander ruling #6 (§7):
I1's pass opens E1b; I2 retired.** (Commander ruling #4, 2026-07-24:
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3 amended to
E1a → E1b, because E0/E0b measured their own instruments instead of the physics.)

Date: 2026-07-24

## 1. Why an instrument comes before any curve

Three reception measurements currently contradict each other on the same states
and seeds:

```text
eventual control (C1-A2, E0)    0.119 / 0.121 / 0.118    flat
raw 4-tick ownership (E0b)      0.220 / 0.227 / 0.158    INVERTED
the formula itself (E0 mirror)  0.073 / 0.091 / 0.113    +4.0pp
```

No touch-cost change can be validated against that. E1a builds one measurement
that is taken **at the real adjudication** — the `attemptFirstTouch` call
inside `Match.resolvePendingControlAttempt` — instead of inferred from who owns
the ball N ticks later, and it logs the **term decomposition** per event so the
speed term can be separated from the pressure and blind-side terms.

## 2. Authorised seat — logging only, zero physics

* `src/sim/Match.ts`: an opt-in `traceFirstTouch?: boolean` config flag
  (default **false**), exactly like the existing `traceContests` precedent, plus
  a `firstTouchTrace` array appended to only when the flag is on.
* `src/sim/mechanics.ts`: `attemptFirstTouch` pushes one record when tracing is
  on — `{tick, gid, intendedTarget, relativeSpeed, pressure, misalign, technique,
  positioning, pFail, clean}` — after it has computed those values for its own
  roll. No value is recomputed, no branch is added before the roll, and the RNG
  is untouched.
* New probe. No other `src/**` change; no physics, no thresholds, no curve.

## 3. Frozen gates

### Exact validity (zero-behaviour proof)

```text
fingerprint with the flag OFF        57b0bdab…c673 unchanged
flag ON vs OFF, same seed            identical result signature (score, ball,
                                     every player pos/vel, RNG state) at full time
trace completeness                   every logged event's pFail equals
                                     touchFailChance(its own logged terms)  exactly
two invocations byte-identical       shared SHA-256
tsc + build clean · full suite green
```

### I1 — the instrument must see known physics

Synthetic controlled sweeps: staged passes to an isolated stationary receiver
facing the ball, with the nearest opponent held far away, so `pressure ≈ 0` and
`misalign ≈ 0` and only arrival speed varies.

```text
>= 400 traced events per speed bucket, buckets at 7 / 9 / 11 / 13 m/s
empirical spill rate per bucket must rise monotonically
| empirical spill rate − mean logged pFail | <= 2.0pp per bucket
```

An instrument that cannot recover the formula's own speed term where that term
provably exists is broken, and E1b cannot be validated by it.

### I2 — the instrument must SETTLE the E0b inversion

Re-run C1-A2's isolated states (seeds `93,000..`, near-stationary receiver, the
three powers) with tracing on, and decompose the adjudication:

```text
report per power: clean rate at the real adjudication, mean relativeSpeed,
                  mean pressure, mean misalign, mean pFail
adjudication (the gate is that the instrument DECIDES, not which way):
  pressure-relief confound CONFIRMED  if mean pressure at touch falls with
    power AND the pressure term's fall >= the speed term's rise
  contamination CONFIRMED             if the inversion disappears under the
    clean adjudication (clean rate no longer rises with power)
minimum sample                        >= 40 traced target-receptions per power
```

## 4. Stop rules

* **I1 fails** → the instrument is wrong; fix the instrument, never the formula,
  and re-run. If the formula's own terms cannot be recovered under held
  conditions, the reception model is not measurable and E1b is blocked — report to
  the user rather than flipping a curve blind.
* **Any behaviour difference between flag ON and OFF** → revert immediately; a
  logging hook that changes the world is not a logging hook.
* **I2 cannot decide** (sample below floor) → report; do not guess which
  explanation holds.
* E1a authorises no curve change of any kind. E1b is a separate
  pre-registration, and it may only be drafted after I1 passes.

## 5. E1a INTERIM — instrument built and behaviour-proven; I1's staging blocked (2026-07-24)

**Not a verdict on the frozen gates.** I1 and I2 were not evaluated at their
pre-registered samples, because the synthetic sweep cannot yet produce
adjudications across all four buckets. What is established:

### Established

* **The instrument exists and is honest.** `Match.traceFirstTouch` (default off,
  same pattern as `traceContests`) + a push inside `attemptFirstTouch` after its
  own roll. Logged per event: tick, gid, intended-target flag, relative speed,
  pressure, misalign, technique, positioning, pFail, clean.
* **Zero-behaviour proof PASSES.** Three full matches (seeds 7001–7003) run with
  the flag on and off produce identical result signatures — score, phase, ball
  state, every player's position/velocity/heading, and the RNG state at full
  time. Production fingerprint `57b0bdab…c673` unchanged with the flag off.
* **It reads the physics where an adjudication happens.** A staged reception
  logged `relativeSpeed 10.32, pressure 0.000, misalign 0.0001, pFail 0.0406,
  clean true` — the decomposition E0/E0b lacked.

### Two structural findings about where reception can be measured at all

1. **Below 6 m/s the world does not adjudicate.** `attemptFirstTouch` returns
   clean *before* the roll for `speed <= 6` (`mechanics.ts:130`), so no event
   exists to log. The instrument is blind there by construction — and so is any
   reception measurement, including C1-A2's and E0b's. Slow receptions are free
   by fiat, not by outcome.
2. **A loose rolled ball frequently never reaches an adjudication.** In the
   sweeps the M3 contact cushions the ball out of the retention window
   (`Match.ts:2051`), so the pending control attempt is abandoned and
   `attemptFirstTouch` is never called — the ball simply rolls to a stop with
   `lastTouch` set. Buckets 7 and 13 produced 60/60 events while 9 and 11
   produced none, which is this effect, not sampling noise.

Consequence: **I1 must stage a real intended pass** (`performPass` from a pinned
passer, sweeping power to sweep arrival speed) rather than a rolled loose ball,
because the intended target is the case the world actually adjudicates
(`maxSpeed` 24 for the intended target vs `CONTROL_MAX_SPEED` 14, `Match.ts:1978`).
That is a redesign of the sweep, not a gate change: I1's gates (monotone spill
rate, |empirical − logged pFail| ≤ 2.0pp per bucket, ≥400 events/bucket) and
I2's stand exactly as frozen.

### Status

`E1a` remains **in progress**: instrument accepted, sweep staging to be
rebuilt, then I1 and I2 run at their pre-registered samples. No curve may be
flipped until I1 passes — E1b stays unopened.

## 6. FROZEN RESULT — I1 PASSES, I2 DOES NOT DECIDE (2026-07-24, re-staged run)

Run at HEAD `0c54a74` under commander ruling #5.3 (re-staging, not
gate-changing: every I1/I2 gate value is the one frozen in §3).
Two invocations byte-identical, shared SHA
`93897f7995fcf39e14306b01d17be4113d51eae14e1aba5d2cab7a7e42c79c09`.
Probe verdict as emitted: **FAIL** — I1 passes, I2's adjudication returns
`unexplained`, and the probe requires both.

### The re-stage

I1 now stages a **real intended pass**: a pinned passer square to the ball
plays `performPass` to a pinned teammate facing him, every other body parked at
the far ends, and the arrival speed is swept by **power** (0.85…1.15, the legal
`PASS_POWER_MIN..MAX` range) crossed with distance 6…30 m (launch speed is
`clamp(d*0.6+8.2, 9, 22)`, so distance is the second lever). 300 reps of a
weighted grid = **44,100 staged passes**; the world adjudicated **25,491** of
them (57.8%) and 14,424 landed inside a bucket window. The held conditions
came out genuinely held: **mean pressure exactly 0** and **mean misalign
≤ 0.0005** in every bucket.

The staging fix that mattered, beyond the ruling's own diagnosis: the frozen
world must **never be allowed to play on**. An earlier cut let the engine run
restarts between trials; with every body parked the ball simply walked into an
empty net, over and over, and each restart corrupted the next staging. A staged
trial now either completes in a held world or the match is discarded.

### I1 — the instrument recovers the formula's own speed term

```text
bucket   events    empirical spill   mean logged pFail   |Δ|      analytic
 7 m/s    2,780        1.691%             1.697%        0.006pp    1.641%
 9 m/s    4,302        3.278%             3.159%        0.118pp    3.172%
11 m/s    4,478        4.757%             4.727%        0.030pp    4.703%
13 m/s    2,864        6.494%             6.183%        0.311pp    6.234%
```

Every gate clears with room: ≥400 events per bucket (6.9–11.2× the floor),
**strictly monotone** empirical spill, and |empirical − logged pFail| ≤ 0.311pp
against a 2.0pp tolerance. The empirical rate also lands within 0.31pp of the
closed-form `touchFailChance` at each bucket centre — the instrument sees known
physics where that physics provably exists. **I1 PASSES.** Per §4 that is the
condition E1b's drafting was waiting on.

### Exact validity

```text
fingerprint, flag off      57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673 (unchanged)
flag ON vs OFF             identical result signatures, seeds 7001–7003
two invocations            byte-identical, shared SHA above
tsc + build clean · 708/708 tests green · zero new src/** changes
```

### I2 — the sample cannot settle the inversion

```text
power    events   clean rate   rel. speed   pressure   misalign   mean pFail
0.85       53       0.8868        8.61        0.350      0.100      0.0739
1.00       60       0.9000        9.32        0.362      0.208      0.0843
1.15       74       0.8919       10.54        0.332      0.348      0.0978
```

Term decomposition across the outer arms: **speed +1.63pp**, **misalign
+1.24pp**, **pressure −0.23pp**.

* The **pressure-relief confound is refuted as the explanation.** Pressure at
  touch does fall with power, but by 0.23pp — an order of magnitude short of
  the 1.63pp the speed term rises. §3's first branch does not fire.
* An unbooked third term showed up instead: **misalign rises steeply with
  power** (0.100 → 0.348). A faster ball arrives before the receiver has turned
  to face it, so pace buys blind-side cost as well as speed cost. Predicted
  cost therefore rises +2.4pp in pFail across the arms.
* The measured clean rate does **not** follow it: 0.8868 / 0.9000 / 0.8919 —
  flat and non-monotone, with the middle arm highest.

The probe encoded §3's "clean rate no longer rises with power" as a two-endpoint
strict inequality, and 0.8919 > 0.8868 trips it as *rising* — by 0.5pp, on
n ≈ 60 per arm where the standard error of that difference is ≈ 5.6pp. So the
coded discriminator routes to `unexplained` rather than to `contamination
CONFIRMED`, and the probe's verdict is FAIL.

**This is reported, not patched.** Rewriting the predicate after seeing the
numbers is exactly the move the pre-registration discipline forbids, and the
sample floor (≥40/power, met at 53/60/74) was never large enough to resolve a
2.4pp predicted difference in the first place — I2 is **underpowered by
construction**, not by seed luck. The honest reading of the numbers is that
E0b's inversion does not reproduce at the clean adjudication; the honest
reading of the *gate* is that this run cannot certify which explanation holds.

### Where this leaves E1

Per the self-drive protocol a non-PASS stops the queue. Two questions belong to
the user / commander, in this order:

1. **Does I1's pass unblock E1b on its own?** §4 says E1b may be drafted "after
   I1 passes", and I1 passed on gates that were never touched. E1b's validation
   needs the instrument, which is now proven; it does not need I2's verdict.
2. **Is I2 redrawn or retired?** A powered redraw is a new pre-registration
   (more states, or the discriminator stated as an interval test rather than a
   point comparison, frozen before the run). Retiring it is also defensible:
   the decomposition already refuted the pressure-relief hypothesis it was
   built to test.

## 7. Disposition — commander ruling #6 (2026-07-25)

The §6 verdict stands exactly as emitted: **FAIL**. Nothing below rewrites it.

1. **E1b is OPEN on I1's pass alone.** Grounds, in order of authority: (a)
   §4's frozen text names I1 as the sole drafting condition, and I1 passed on
   untouched gates at 6.9–11.2× its sample floor with calibration inside
   0.311pp of a 2.0pp tolerance; (b) the only physics that could have
   invalidated E1b's premise — pressure-relief as the DOMINANT channel, i.e.
   heavy passes self-financing through reduced closing time — was directly
   refuted by the logged decomposition (pressure −0.23pp vs speed +1.63pp);
   (c) E1b consumes the instrument, not I2's adjudication.
2. **I2 is RETIRED, not redrawn.** Its question is settled at the design
   level by the decomposition it logged: pressure-relief refuted, and the
   E0b inversion (raw 0.220/0.227/0.158) does not reproduce at the clean
   adjudication (0.8868/0.9000/0.8919, flat and non-monotone) — consistent
   with contamination, exactly what E0b's reproduction gate already caught.
   The properly-powered flat-vs-rising test is SUBSUMED by E1b's validation:
   a same-seed OFF/ON contrast on the I1 staging at thousands of events per
   bucket (SE ≈ 0.5pp) has strictly more power than any standalone redraw
   could pre-register, and runs where the answer matters. A redraw would
   spend a full pre-registration cycle to re-answer an answered question.
3. **The predicate failure is codified, not blamed**: PROBE-CONTRACTS §2
   gains a sixth threshold type — equivalence/flatness claims must be
   interval tests with pre-computed power; strict point inequalities where
   SE swamps the predicted effect are structurally undecidable and forbidden.
4. **The misalign discovery is booked as substrate truth** (design contract
   §4) and amends E1b's decomposition gate (design contract §3): pace buys
   speed cost AND blind-side cost; the pressure channel — the refuted
   confound — must not carry E1b's measured increase.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,358p' docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E1b — The flagged touch-cost curve

Status: **RUN 2026-07-25 — §6 is the frozen result: PASS on every gate.**
Drafted by the autonomous session
under commander ruling #6 (2026-07-25), which opened E1b on I1's pass and
handed the drafting constraints in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. What this stage is

C1-B's exact one-liner — the honest speed-dependent control cost — returns,
this time **behind an EDS flag, default OFF**, and validated by the E1a
instrument instead of by a live calibrate. C1-B failed at the §2 equilibrium
band, not at the mechanism: it raised miscontrols 34.4% inside its own bound
and then the speed-blind game re-routed itself around the damage (goals
−15.4%, long balls +28.2%). The EDS thesis is that the re-route is what a
BUNDLE fixes; E1b's only job is to prove the curve does at the first touch
exactly what it claims, and to check one canary cheaply before E3 pays for it.

**E1b ships nothing.** No §2 band measurement is authorised here — E3 owns
that question, and the user's play-test at E4 owns the verdict.

## 2. The change (C1-B §12.2 verbatim, behind a flag)

```
clamp01((speed - 6) / 8) * 0.07   →   clamp01((speed - 6) / 16) * 0.24
```

Nothing else in `touchFailChance` moves: the 6 m/s free threshold, the
pressure, blind-side, positioning and technique terms are untouched. The
derivation is C1-B §12.2's and is not re-opened — `8 → 16` moves saturation
from 14 m/s to the 22 m/s ground-pass launch cap, `0.07 → 0.24` sets the
rolled-versus-drilled spread at the same order as the 17.4pp interception
swing power buys, so neither side of the future choice dominates by
construction.

### 2.1 Authorised seat — nothing outside this list

* `src/sim/mechanics.ts` — `touchFailChance` gains a trailing
  `heavyTouchCost = false` parameter selecting between the two curve
  constants; `attemptFirstTouch` and `tryChestTrap` pass `match.edsTouchCost`
  (C1-B moved the function, so both of its callers move with it).
* `src/sim/Match.ts` — `edsTouchCost?: boolean` config flag, default
  **false**, stored readonly. Same pattern as `traceFirstTouch`.
* `src/ai/passOptionValue.ts` — `mirroredTouchFailChance` gains the same
  trailing flag and `PassOptionInput` an optional `heavyTouchCost`, because
  E0's dormant evaluator is where the always-heavy canary is measured. The
  mirror's own comment already names this stage: *"if the real curve moves —
  as EDS E1 will move it — this mirror and that test move with it, together."*
* `tests/passOptionValue.test.ts` — the mirror contract test extended to
  cover BOTH curve states across the same input grid.
* New probe `scripts/probes/eds-touch-cost-curve.ts`.

No other `src/**` change. No new tactical weight, no scalar score, no live
caller of the flag, no default-on anything.

## 3. The measurement

The OFF/ON contrast runs on **E1a's I1 staging** (ruling #6 (a)): a pinned
passer plays a real intended pass to a pinned, isolated teammate facing him,
power swept 0.85–1.15 × distance 6–30 m, every other body parked, pressure
held at exactly 0 and misalign ≤ 0.0005. Both arms use the same match-seed
schedule (`5,100,000+`) and the identical staging schedule. The RNG streams
necessarily diverge once an outcome differs (a spill draws three more values),
so this is a between-arms comparison at large n, **not** a paired difference —
which is why every gate below is sized against its own sampling error.

### 3.1 Analytic predictions (the gates are derived from these)

At held conditions — technique 0.5 (multiplier 0.875), positioning 0.5,
pressure 0, misalign ≈ 0:

```text
bucket    OFF pFail     ON pFail     predicted Δ
 7 m/s     1.641%        2.188%       +0.547pp
 9 m/s     3.172%        4.813%       +1.641pp
11 m/s     4.703%        7.438%       +2.734pp
13 m/s     6.234%       10.063%       +3.828pp
```

### 3.2 Sample size, computed BEFORE the run

For a 3σ separation of the OFF/ON empirical spill difference,
`n = 9·(p_off·q_off + p_on·q_on)/Δ²` per arm per bucket:

```text
bucket 7    11,297      <- binding
bucket 9     2,558
bucket 11    1,369
bucket 13      915
```

Bucket 7 binds because it sits just above the 6 m/s free threshold where the
two curves are closest. I1's 300 reps yielded 2,780 bucket-7 events, so the
sweep is frozen at **1,300 reps** (≈12,050 expected), and the floor gate is
**≥11,300 events per bucket per arm**. Per PROBE-CONTRACTS' sixth threshold
type, no gate below is a point inequality whose SE swamps its own effect.

## 4. Frozen gates

### EXACT — the flag must be a flag

```text
X1 production fingerprint with the flag OFF   57b0bdab…c673 unchanged
X2 flag OFF, seeds 7001-7003                  result signature identical to
                                              pre-E1b HEAD 19f7aa1
X2b flag ON, same seeds                       signature DIFFERS in at least one
                                              (a flag that changes nothing is
                                              not a physics change) — see the
                                              §4.1 amendment
X3 tsc + build clean · full suite green, with the mirror contract test
   extended over BOTH curve states
X4 two invocations byte-identical             shared SHA-256
X5 REPRODUCTION: the OFF arm's first 300 reps reproduce E1a's banked I1
   numbers EXACTLY — events 2,780 / 4,302 / 4,478 / 2,864 and spill
   1.691% / 3.278% / 4.757% / 6.494%
```

X5 is the E0b-style gate: a staging that has silently drifted cannot pass it,
and every number below would be uninterpretable without it.

### 4.1 AMENDMENT to X2b, disclosed before the experiment ran (2026-07-25)

X2b was drafted as *"the signature differs in all three seeds"*. A 3-rep smoke
run — implementation shakedown, not the experiment; the sweep gates cannot even
be evaluated at that size — showed seed 7002 producing an **identical**
signature under both arms, and the reason is structural rather than a bug: a
120-second match contains only a handful of first-touch adjudications, and a
curve change flips an outcome only when that roll's shared uniform draw lands
between the two pFail values — a window of roughly 0.5–4pp per roll. Requiring
all three seeds to diverge is therefore a coin-flip predicate, i.e. exactly the
unpowered point test ruling #6 codified as forbidden.

X2b is amended to **at least one of the three**, which is what a 120-second
match can honestly support. Nothing is weakened: the powered proof that the
flag bites lives in F1d, where thousands of events per bucket test the measured
effect against its analytic prediction inside a ≥3σ band. This amendment is
recorded here, in its own commit, **before** the experiment ran; no gate that
bears on the physics is touched.

### F1 — FIRES: the curve reaches the real adjudication

```text
F1a  >= 11,300 traced events per bucket per arm (the §3.2 computation)
F1b  ON empirical spill rate strictly monotone across the four buckets
F1c  | ON empirical spill − ON mean logged pFail | <= 2.0pp per bucket
       (I1's calibration gate, verbatim)
F1d  INTERVAL TEST: | measured Δ(empirical spill) − predicted Δ | <= 1.25pp
       per bucket, against §3.1's 0.547 / 1.641 / 2.734 / 3.828pp.
       The band is >= 3σ in every bucket at the frozen n
       (σ_diff = 0.18 / 0.29 / 0.35 / 0.41pp), so it can fail on a wrong
       curve and cannot fail on noise.
```

### F2 — the decomposition (ruling #6's two-channel amendment)

```text
F2a ATTRIBUTION of the measured Δ mean pFail, per bucket:
      speed channel carries        >= 95% of Δ
      | pressure channel Δ |       <= 0.05pp
      | misalign channel Δ |       <= 0.05pp
F2b EQUIVALENCE — the flag must not leak into the substrate's own
    blind-side channel:
      | mean misalign_ON − mean misalign_OFF |  <= 0.01 per bucket
```

F2a is what makes the rise un-attributable to the **refuted** pressure-relief
confound: on this staging pressure is identically 0, so a cost increase here
provably cannot be a closing-time artifact. F2b guards the other direction —
E1b touches the speed term only; the power-coupled misalign channel that I2
discovered is pre-existing substrate physics and must read the same in both
arms.

### F3 — the always-heavy canary (E3's question, checked cheaply here)

Re-run E0's prediction block on its own states (seeds `93,000..`) with the
heavy mirror. Every quantity here is deterministic — no sampling error, so no
power computation applies.

```text
C1 predicted touch-cost spread 0.85→1.15 over E0's priced states
     >= 6.0pp   (banked under the old curve: 7.34 → 11.29 = 3.95pp;
                 analytic under the new curve ≈ 6.90pp, because the 0.85 arm
                 arrives at 5.99 m/s — below the free threshold — and is
                 unchanged, while the 1.15 arm's 11.39 m/s term goes
                 4.13pp → 7.07pp. The floor sits 0.9pp under the analytic
                 value to allow for per-state mix.)
C2 EQUIVALENCE: the corridor read must be untouched — predicted threat
     0.843 / 0.586 / 0.446 s, flight 1.713 / 1.303 / 1.061 s and arrival
     5.99 / 8.69 / 11.39 m/s reproduced to 3 dp
C3 REPRODUCTION: with the mirror flag OFF the canary reproduces E0's banked
     7.34 / 11.29 and safest-is-1.15 in 52/52 contested, exactly
```

A note the result must carry either way: E0's "safest" is ranked by corridor
threat alone, so **C1 passing does not by itself prove always-heavy is
broken** — it proves the evaluator can now SEE a cost of the right order
(≈6.9pp against the 21.2pp measured threat swing). Whether that is enough for
no-strict-dominance is E3's gate, and E1b's job is to hand E3 an honest number
rather than a surprise.

### Diagnostics — reported, never gates (ruling #6 (b))

* the contested I2-style staging, OFF vs ON;
* a sealed full-match OFF/ON first-touch trace (miscontrols/match, mean pFail,
  per-channel means, misalign distribution) — this is where pressure and
  misalign actually vary. C1-B already measured what live re-routing does and
  E3 owns it; nothing here may be read as a §2 band result.

## 5. Stop rules

* **Any EXACT gate fails** → revert immediately and report. A flag that moves
  the default path is not a flag, and a staging that fails X5 invalidates
  every number after it.
* **F1c or F1d fails** → the curve did not land as specified. Report; **do not
  re-tune the curve constants** (C1-B §12.5 carried over verbatim: no
  parameter may be re-tuned after seeing results, and the one permitted C1-B
  redraw is being spent HERE, on this staging, not on a new weight).
* **F2 fails** → the increase is being carried by a channel the amendment
  forbids. That is a substrate finding, not a tuning problem: report to the
  commander.
* **C1 below 6.0pp** → the curve is too weak to break always-heavy. Report;
  **do not strengthen the curve**, which would be fitting a constant to a
  canary. The commander redraws E1b's shape or accepts the number into E3's
  design.
* E1b authorises no live ship, no default-on flag, no §2 band claim, and no
  work on E2. On PASS the queue advances to E2's drafting; on any FAIL the
  fork returns to the commander per the design contract §5.

## 6. FROZEN RESULT — PASS on every gate (2026-07-25)

Run at HEAD `b8386cd`. Verdict **PASS**: 4/4 exact, 4/4 FIRES, 4/4
decomposition, 3/3 canary. Two invocations byte-identical, shared SHA
`ca192bc85b227bd9f4a4ded2d920187fd0553df5cc51c62a0e0c86fa56582d59`.
Sweep: **191,100 staged passes per arm**, 110,031 adjudicated OFF (57.58%) and
109,780 ON (57.45%) — the flag does not change how often the world adjudicates,
only how the roll comes out.

### Exact validity

```text
X1  production fingerprint, flag off   57b0bdab…c673 unchanged
X2  flag OFF vs pre-E1b HEAD 19f7aa1   IDENTICAL on all three seeds, verified
                                       cross-commit in a throwaway worktree:
                                       b00f6d62… · eb1dc176… · 3aab42f5…
X2b flag ON                            diverges on 7001 and 7003 (7002 holds,
                                       exactly the coin-flip §4.1 predicted)
X3  tsc + build clean · 709/709 green, mirror contract over both curve states
X4  two invocations byte-identical     SHA above
X5  REPRODUCTION                       the OFF arm's first 300 reps return
                                       E1a's banked I1 run to the last digit:
                                       2,780 / 4,302 / 4,478 / 2,864 events and
                                       1.6906% / 3.2775% / 4.7566% / 6.4944%
```

X5 is the load-bearing one: the staging is a copy of E1a's, and it came back
bit-exact, so every number below sits on the world E1a certified.

### F1 — the curve lands exactly where the arithmetic said it would

```text
bucket   events OFF/ON     spill OFF → ON        measured Δ   predicted Δ   error
 7        12,205/12,311     1.696% →  2.437%      +0.741pp     +0.547pp     0.194pp
 9        18,305/18,346     3.278% →  4.818%      +1.541pp     +1.641pp     0.100pp
11        19,522/19,637     4.820% →  7.853%      +3.032pp     +2.734pp     0.298pp
13        12,221/12,346     6.162% → 10.465%      +4.303pp     +3.828pp     0.475pp
```

Every bucket clears its 11,300-event floor, the ON arm is strictly monotone,
and the ON calibration |empirical − logged pFail| is 0.155 / 0.023 / 0.369 /
0.494pp against the 2.0pp tolerance. The F1d interval holds with room: the
worst error is 0.475pp inside a 1.25pp band, and in σ terms the four buckets
land 1.07 / 0.34 / 0.85 / 1.35σ from prediction (σ_diff = 0.18 / 0.29 / 0.35 /
0.35pp at the achieved n) — noise, not bias.

The **logged** pFail is even tighter than the outcome, as it should be, because
it carries no binomial noise: +0.586 / +1.634 / +2.753 / +3.786pp against the
analytic +0.547 / +1.641 / +2.734 / +3.828pp. The residual is the in-bucket
speed mean, not the curve: Δ is linear in arrival speed at 0.547pp per m/s
above the 6 m/s threshold, so a window that is not perfectly centred shifts it
by exactly this much.

### F2 — the increase is carried by the speed channel alone

```text
bucket   Δ mean pFail   speed channel share   Δ pressure   Δ misalign   |Δ mean misalign|
 7        +0.586pp          99.996%             0.000pp      0.000pp        1e-5
 9        +1.634pp          99.999%             0.000pp      0.000pp        0
11        +2.753pp         100.002%             0.000pp     -0.000pp        1e-5
13        +3.786pp         100.000%             0.000pp     -0.000pp        0
```

The pressure channel is **identically zero in both arms** — this staging holds
pressure at 0 by construction — so the measured increase provably cannot be the
pressure-relief confound I2 refuted. The power-coupled misalign channel that I2
discovered reads the same in both arms to within 1e-5: E1b touched the speed
term and nothing else leaked.

### F3 — the always-heavy canary

```text
C1  predicted touch-cost spread 0.85→1.15, E0's 65 priced states
      old curve 3.95pp  →  new curve 6.53pp     (floor 6.0pp)          ✓
C2  corridor read untouched: threat 0.843 / 0.586 / 0.446 s, flight
      1.713 / 1.303 / 1.061 s, arrival 5.99 / 8.69 / 11.39 m/s          ✓ exact
C3  flag-OFF reproduction of E0: 7.34% / 11.29% and safest-is-1.15 in
      52/52 contested                                                   ✓ exact
```

C1 clears, but under its own floor rather than over the 6.90pp the §4
arithmetic projected — the per-state arrival mix is slightly cooler than the
three-power means suggested. That is why the floor was set 0.9pp below the
projection.

**The caveat the contract required this result to carry:** E0's "safest" is
ranked by corridor threat alone, so C1 passing does **not** prove always-heavy
is broken. What it proves is that the evaluator can now see a cost of the right
order — 6.53pp of touch failure against the 21.2pp measured opponent-first
swing that power buys. Heavy is still the safer option on the threat axis by a
wide margin; whether 6.53pp is enough for E3's no-strict-dominance is E3's
gate, now with an honest number in front of it instead of a surprise.

### Diagnostics — reported, NEVER gates

Twelve sealed 240-second matches per arm, same seeds:

```text                        OFF        ON       delta
miscontrols / match          7.25      10.08     +39.1%
goals / match               2.833      2.167     -23.5%
first-touch spill rate      9.67%     13.57%     +3.90pp
mean logged pFail           9.81%     13.07%     +3.26pp
  speed channel             3.39pp     6.53pp    +3.14pp
  pressure channel          4.12pp     4.36pp    +0.24pp
  misalign channel          1.40pp     1.28pp    -0.12pp
```

This is C1-B's live signature again — miscontrols up about a third, goals down
— on twelve matches instead of 568, and it is recorded here only so E3 knows
what it is walking into. **No §2 band claim is made or implied**; C1-B already
measured that properly and its verdict stands. Note the channel row: in real
play pressure is the largest single channel (4.12pp) and the curve did not
touch it, while the blind-side channel is a real 1.3–1.4pp of every touch —
the substrate seat C5's orientation craft will land on.

### Verdict

**E1b PASSES.** The flag is a flag (X1/X2/X5), the curve reaches the real
adjudication exactly as specified (F1), the increase is carried by the channel
the amendment names and by no other (F2), and the dormant evaluator can now
price a cost of the right order (F3). Nothing shipped: `edsTouchCost` remains
default OFF, the production fingerprint is unchanged, and the C1-B redraw has
been spent here, in its correct home, on a measurement instead of a weight.

Per the design contract §3 the queue advances to **E2** — both-sides
perception, with the unseen-pricing amendment — whose stage contract drafts
next.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,319p' docs/world-model/EDS-E2A-CENSUS-PRIORS.md; sed -n '1,316p' docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E2a — Census priors and the pricing layer

Status: **RUN 2026-07-25 — §7 is the frozen result: P3 FAILS, everything else
passes. The queue STOPS; the fork is the commander's.** Drafted by the
autonomous session
under commander ruling #7 (2026-07-25), whose drafting constraints live in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. The problem E2a exists to solve

E0 measured the thing that killed S3b: at awareness 0.8 the passer could price
**nothing** in 55 of 120 states, and the split was by distance — 21.7 m mean
for the unpriced against 16.8 m for the priced. Observation does not blur the
option set, it deletes ~46% of it, disproportionately the long progressive
passes. Delete those and not-looking becomes informationally superior, which is
worse than S3b.

The design contract's answer is **unseen ≠ unavailable**: an option the passer
cannot see is priced at an honest population base rate, never deleted and never
truth-fallback. E2a builds that base rate as a **measurement** and proves the
pricing layer on E0's own banked states — the instrument-first lesson in its
third application. E2b then consumes the table; it may not adjust it.

### 1.1 Discovery finding that shapes the design (pre-registration input)

Re-running E0's state acceptance and classifying every null by cause reproduces
E0's 65/55 split exactly (16.79 m priced vs 21.71 m unpriced) and finds **all 55
nulls have a single cause: `targetMissing`** — the teammate is absent from
`snapshot.players` entirely. Not a failed affordance, not an unreachable flight,
not a missing opponent: 55/55 target-missing, 0 everything else.

That settles what the prior must be indexed on. A passer who cannot see the man
also **cannot know how far away he is**, so an unseen option cannot be assigned
a distance band. It is priced at the census **marginal**. The table is banded
anyway for two reasons: a marginal is only trustworthy if the bands behind it
are real, and an OBSERVED option does have a distance, so it can carry its own
band's prior alongside E0's sharper corridor read.

## 2. Authorised seat

* `scripts/probes/eds-e2a-prior-census.ts` — new probe: census, held-out
  calibration, and the pricing-layer validation on E0's 120 states.
* `src/ai/passPrior.ts` — new pure data module: the frozen census table, with
  the census SHA in its header. No imports from `sim/`, no logic beyond a band
  lookup.
* `src/ai/passOptionPricing.ts` — new pure module: the pricing layer. Wraps
  `evaluatePassOption` and **never returns null**.
* `tests/passOptionPricing.test.ts` — hostile tests: never-null, prior options
  carry no physical fields, observed options unchanged.
* No change to any existing `src/**` file. Zero live callers: nothing in the
  live AI imports either new module. Dormant by construction.

## 3. The census

Population: every registered intended ground pass whose **kick-time
passer→target distance is 6–30 m** — E0's own candidate window, so the census
measures the option space the evaluator prices. (C1-A2's near-stationary
receiver restriction was an isolation device for a different question and is
deliberately NOT applied here; it would bias the population toward standing
receivers.)

Per pass, observed from outside the sim (`match.pendingPass` transitions plus
`ball.lastTouch`, with `traceFirstTouch` on for the adjudication record — a
flag E1a proved behaviour-neutral):

```text
band            6-10 / 10-14 / 14-18 / 18-22 / 22-26 / 26-30 m
outcome         intercepted | reachedTarget | otherTeammate | unresolved
if reached      clean first touch, split into adjudicated and clean-by-fiat
                (<=6 m/s returns clean before the roll — the registered
                substrate boundary; reported separately so the number is honest)
per band        n, interceptedRate, reachedRate, otherTeammateRate,
                unresolvedRate, cleanGivenReached, receptionSuccessRate
                (= reached x cleanGivenReached), plus a MARGINAL row
```

Sets, frozen: **census set A = seeds 610,000..610,249** (250 matches),
**held-out set B = seeds 620,000..620,249** (250 matches), disjoint. A 20-match
pilot measured 81.3 qualifying passes per match and band occupancy
310/404/350/249/180/121 per 20 matches, so set A gives ≈20,325 passes with
≈1,512 in the thinnest band (26–30 m).

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint                57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical        shared SHA-256
X4 zero live callers                     no src module outside the two new
                                         files imports either of them (audited)
X5 REPRODUCTION on E0's 120 banked states — the 65 observed states must
   return E0's own numbers: threat 0.843 / 0.586 / 0.446 s, flight
   1.713 / 1.303 / 1.061 s, arrival 5.99 / 8.69 / 11.39 m/s, touch prior
   7.34% / 11.29%, safest-is-1.15 in 52/52 contested
X6 the committed `src/ai/passPrior.ts` table is EQUAL to this run's census
   output, field by field
```

X6 is built in two passes by design and that is pre-registered here, not
improvised: the first run emits the table, it is committed as data, the second
run asserts the committed copy is the measurement. Its purpose is drift
protection for E2b, which consumes the committed table and may never adjust it.

### P1 — COMPLETENESS: nothing is deleted for observability

```text
120/120 E0 states priced, at all three powers, zero nulls
source split exactly 65 observed / 55 prior — E0's banked split
every prior-priced option carries source='prior' and NO physical dimension
  (no seconds, no metres): an unknown must read as unknown, never as zero
```

### P2 — CALIBRATION: the prior generalises (interval test, powered ex ante)

The table built on set A must predict set B's realized rates:

```text
per band     | rate_A − rate_B |  <= 5.0pp
marginal     | rate_A − rate_B |  <= 1.5pp
```

Power, computed before the run from the pilot's p ≈ 0.20 interception rate:
σ_diff = √(p·q·(1/n_A + 1/n_B)) is 1.45pp in the thinnest band (n ≈ 1,512 per
set) and 0.40pp on the marginal (n ≈ 20,325 per set), so both bands are ≈3.4σ
wide — they cannot fail on noise and can fail on a prior that does not
generalise.

### P3 — NOT-LOOKING MUST NOT WIN (E2a's weak form, deterministic)

```text
mean receptionSuccessPrior of the 65 OBSERVED options
   >= the marginal prior assigned to the 55 UNSEEN options
```

Derivation from banked numbers: the observed states average 16.8 m and the
unseen 21.7 m, and the census population includes the long passes the observed
set does not. If this inverts, the prior is optimistic and E2b's gate (d) would
fail by construction — better to learn it here for the price of a lookup.

### P4 — BAND REALITY (routing rule decided in advance, NOT a fail)

```text
if interceptedRate(26-30) − interceptedRate(6-10) >= 5.0pp
     the bands are real; E2b prices observed options at their own band
else the bands are noise; the table is banked but E2b prices every option at
     the MARGINAL, and the banded table stays as a diagnostic
```

Either branch continues to E2b. This is a routing decision, not a verdict:
pre-registering both arms is what stops the result from being re-interpreted
after the fact.

## 5. Stop rules

* **X5 or X6 fails** → the pricing layer or the census drifted; report. Never
  adjust the table to fit.
* **P1 fails** → "never deleted" is not implemented; report, do not special-case
  the failing states.
* **P2 fails** → the census is not a prior: it does not generalise off its own
  seeds. Report to the commander; **do not widen the band, re-band, or re-seed
  after seeing results.**
* **P3 fails** → the prior is optimistic. STOP: E2b's not-looking gate would
  fail by construction, and the fix is a design question (what an honest prior
  for an unseen man actually is), not a parameter.
* The table is infrastructure like a sampling budget: once committed it may not
  be adjusted after any E2b result, ever.
* E2a is dormant throughout — default-off, zero live callers, fingerprint
  unchanged. It authorises no consumer, no gene, no evolution, and no A/B.
  **On PASS, E2b proceeds without a new ruling** (commander ruling #7).

## 6. What E2a hands E2b

A committed, SHA'd, held-out-validated base-rate table; a pricing layer that
returns an option for every teammate whether or not he is visible; and a
measured answer to the one question that decides whether E2b's design is even
coherent — whether an honest prior sits below what a passer who looks can see.

One thing E2a deliberately does NOT answer, flagged for E2b's drafting: if the
evaluator CHOOSES an unseen option, where is the ball actually aimed? Pricing
an option the passer cannot aim at is coherent; executing it is not, and
solving it with last-known or role-anchor positions edges toward the
truth-fallback the design contract forbids. E2b owns that question.

## 7. FROZEN RESULT — P3 FAILS; the census itself is sound (2026-07-25)

Run at HEAD `b639d18`. Verdict **FAIL** on one gate: **P3, not-looking-must-not-
win**. Two invocations byte-identical, shared SHA
`93e25df425aba226dc1efc6e8da10d7337774db9ccb30c4f325e20e3d1970ea3`.
Census table SHA `326ea40e…4db0`.

```text
X1 fingerprint 57b0bdab…c673 unchanged          ✓
X2 tsc + build clean · 714/714 green            ✓
X3 two invocations byte-identical               ✓
X4 zero live callers (audited)                  ✓
X5 reproduces E0's banked numbers               ✓  exactly, 65/55 split included
X6 committed table == this run's census         ✓
P1 completeness (all three sub-gates)           ✓  360/360 options, 0 nulls
P2 calibration, per band and marginal           ✓  worst band 2.03pp of 5.0pp
P3 not-looking must not win                     ✗  0.686586 vs 0.688400
P4 band-reality routing (not a verdict)         →  marginal
```

### The census

21,457 qualifying passes in set A over 250 matches, 21,822 in the disjoint
held-out set B.

```text
band      n(A)   intercepted   reached   clean|reached   receptionSuccess
 6-10     4,377     17.98%      76.88%      92.96%           71.46%
10-14     5,113     17.72%      75.36%      92.94%           70.04%
14-18     4,572     19.90%      74.54%      93.22%           69.49%
18-22     3,437     22.78%      70.67%      93.04%           65.76%
22-26     2,455     20.61%      73.85%      92.44%           68.27%
26-30     1,503     19.56%      68.86%      91.69%           63.14%
MARGINAL 21,457     19.51%      74.12%      92.88%           68.84%
```

**P2 passes comfortably**: the worst band disagreement between A and B is
2.03pp against a 5.0pp interval, and the marginal agrees to 0.17pp
(interception) and 0.11pp (success) against 1.5pp. The census generalises off
its own seeds — it is a measurement, not a fit.

One honesty note carried from E1a's registered boundaries: of 15,903 arrivals
at the intended target, **3,997 (25.1%) never reached an adjudication at all**
(≤6 m/s returns clean before the roll, and M3 cushioning can skip it). Those
count as kept, because the world declined to charge for them; the split is
reported rather than buried.

### P4 — the routing rule fired on the wrong statistic (finding, not a fail)

Interception rate is essentially **flat** in distance — 17.98% at 6–10 m
against 19.56% at 26–30 m, a 1.58pp endpoint difference that is not even
monotone (it peaks at 22.78% in the 18–22 band). The pre-registered rule
therefore routes E2b to the marginal.

But the axis the pricing layer actually uses is not interception, it is
**reception success, and that falls 71.46% → 63.14%, a real 8.32pp gradient**,
carried by `reachedRate` (76.9% → 68.9%) and by other-teammate touches rising
(5.1% → 9.4%). The rule was keyed to `interceptedRate` when it should have been
keyed to the priced quantity.

**Not amended.** The run is over; ruling #6's boundary permits a pre-run
amendment of a harness predicate only, and this is neither pre-run nor a
harness predicate. The routing stands as frozen — E2b prices at the marginal —
and whether to re-key it is the commander's call, with the 8.32pp gradient now
measured and on the table.

### P3 — the gate that fired, and what it actually caught

```text
mean receptionSuccessPrior, 65 OBSERVED options   0.686586
marginal assigned to the 55 UNSEEN options        0.688400
                                          gap    -0.181pp   ✗
```

The band mix of the 65 observed states is `[9, 14, 16, 9, 11, 5]` across the
six bands plus one option whose OBSERVED distance fell outside the 6–30 m
window and correctly took the marginal. Compare shares:

```text
band        6-10   10-14  14-18  18-22  22-26  26-30
census       20.4%  23.8%  21.3%  16.0%  11.4%   7.0%
E0 states    13.8%  21.5%  24.6%  13.8%  16.9%   7.7%
```

So this is a **composition effect**, and my §4 derivation had its premise
backwards. I reasoned that the census "includes the long passes the observed
set does not". It is the opposite: real play is short-pass dominated — 44% of
played passes are inside 14 m — while E0's acceptance rule (nearest candidate
at ≥6 m with a near-stationary receiver) surfaces a longer, sparser slice, only
35% inside 14 m. Weighted by its own band mix, E0's observed set sits 0.18pp
BELOW the population marginal. The gate was correctly specified as a
directional test on the quantity that matters; the data corrected the belief
behind it, which is what a pre-registered gate is for.

**The structural finding underneath it — the reason this is worth stopping
for.** The census measures passes the AI **chose to play**. The prior is asked
to price options **nobody chose and nobody can see**. A base rate over played
passes is a *selected* sample: the live AI already filtered for options it
liked, so the census inherits that filter. Here the mismatch is 0.18pp and
merely trips a directional gate. In E2b it will be larger and its sign is not
predictable, because E2b's option set is *every teammate*, not the nearest
near-stationary one — a population the census has never observed at all.

That is a design question — what an honest prior for an unseen man is measured
over — and per §5 it is not a parameter to adjust. Candidate directions, for
the commander and not acted on here:

1. **Census the option space, not the pass log**: sample candidate targets the
   way an evaluator would enumerate them and force-play a sample of them, so
   the base rate covers unchosen options too. Expensive and it perturbs play,
   so it wants its own staging contract.
2. **Condition the prior on what the passer DOES know** when a man is unseen —
   which, per §1.1, is nothing positional. Then the honest prior may have to be
   pessimistic by construction (an unseen option is a worse bet than a seen one
   *because* it is unseen), which would satisfy P3 by design rather than by
   luck.
3. **Accept the selection bias and gate E2b on the realized outcome instead**,
   letting not-looking-must-not-win be tested where it actually matters rather
   than pre-checked here.

### What is banked either way

The census table is committed as data (`src/ai/passPrior.ts`, table SHA
`326ea40e…4db0`), held-out validated, and the pricing layer works exactly as
specified — 360/360 options priced, zero deleted, E0's 55 vanished states now
carrying an honest base rate, unknowns reading as unknown rather than zero, and
the 65 observed states reproducing E0's numbers to the digit. Nothing about
that is invalidated by P3; what P3 rejects is the *choice of population* the
base rate was measured over.

Per §5 and the self-drive protocol, **the queue stops here** — E2b does not
proceed, because ruling #7 conditioned it on an E2a PASS.
# EDS E2a-2 — The option-space census (counterfactual)

Status: **RUN 2026-07-25 — §6 is the frozen result: PASS on every gate.**
Drafted by the autonomous session
under commander ruling #8 (2026-07-25), constraints (h)–(l) in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. Why the census is being re-posed

E2a-1's P3 caught something real. Its census measured **passes the AI chose to
play**, and the prior is asked to price **options nobody chose and nobody
saw**. A base rate over played passes inherits the live chooser's filter, so it
is a selected sample; the gap showed up as a 0.18pp inversion and would have
grown in E2b, whose option set is every teammate rather than the nearest
near-stationary one.

Ruling #8's answer: measure the population the evaluator actually prices. Take
real decision moments, enumerate the full candidate set, and for each candidate
**fork the deterministic world and intervene on target choice only** — power,
lead, aim noise, offside and bookkeeping all run the live machinery, pointed at
the substituted man. That is exactly "what would have happened if he had picked
that one instead", which is the quantity a prior over options must be about.

### 1.1 Scope boundary, registered rather than glossed

The intervention is on TARGET choice, not ACTION choice. A moment enters the
census only if the brain was going to play a plain ground pass there; forcing a
target cannot make a dribbling or shooting moment into a passing one. So E2a-2
removes the **target**-selection bias and leaves the **action**-selection bias
in place. That is what ruling #8 (h) specifies and it is the honest limit of
this instrument: the prior it produces is "given that a pass is being played,
what happens to a pass at this distance", not "what happens if you pass at a
moment nobody would pass".

## 2. Authorised seat

* `src/sim/Match.ts` — `forcedPassTarget: number | null = null`, a mutable
  dormant field. Null in every production path.
* `src/ai/PlayerBrain.ts` — at the point the brain has already decided to pass,
  the chosen `bestMate` may be substituted by `forcedPassTarget`. Nothing else
  moves: the decision to pass, the power, the lead, the aim spray, the run-up
  heading and every downstream call stay as they are. The cutback has its own
  machinery and is never substituted.
* `src/ai/passPrior.ts` — the option-space table added alongside E2a-1's
  pass-log table, which is **retained untouched** as the chosen-subset
  reference (and so E2a-1's own reproduction gate keeps working).
* `src/ai/passOptionPricing.ts` — pricing classes re-cut per ruling (k).
* New probe `scripts/probes/eds-e2a2-option-space-census.ts`.
* No other `src/**` change; zero live callers; fingerprint unchanged.

**Disclosure:** the seam above was authored during drafting, to establish that
an exact intervention point exists at all — the census design is worthless if
the fork cannot reproduce reality. Only `tsc` and `npm run fingerprint` were
run against it (fingerprint `57b0bdab…c673`, unchanged). No census, no rate, no
gate value was computed before this contract was committed.

## 3. The measurement

Sampling, frozen: **census set A = seeds 700,000+**, **held-out set B = seeds
710,000+**, disjoint from every set used by E0, E1a/b and E2a-1. Matches are
consumed in seed order until **4,500 sampled moments** per set are collected.

At each moment (a tick where the brain plays a plain ground pass), the
candidate set is **every outfield teammate of the passer at 6–30 m** — no
nearest-only filter and no near-stationary filter, both of which were isolation
devices for other questions and would re-select the population. Each candidate
gets one fork of the pre-tick state, the seam armed for exactly one tick.

Outcome classes, carried over from E2a-1 unchanged plus ruling (i)'s addition:

```text
intercepted | reachedTarget | otherTeammate | unresolved | UNPLAYABLE
reachedTarget splits into adjudicated clean / adjudicated spilled /
never-adjudicated (the registered ~25% share: <=6 m/s returns clean before the
roll, and M3 cushioning can skip the adjudication entirely)
```

Sizing, from a harness pilot that measured **3.36 candidates per moment** and
**59 forks/s** (counts and timing only — no outcome rate was computed): 4,500
moments ≈ 15,100 forks per set.

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint, seam dormant        57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical              shared SHA-256
X4 zero live callers of passPrior / passOptionPricing (audited)
X5 HARNESS (ruling #8 (i)) — over 3 full matches (seeds 700,001-700,003),
   arming the seam at EVERY pass with the target the brain itself chose must
   reproduce the unforked match BIT-IDENTICALLY at full time: score, phase,
   ball, every player's position/velocity/heading, and the RNG state. 3/3.
X6 the committed option-space table equals this run's census, field by field
   (the two-pass construction E2a-1 used, pre-registered again here)
```

X5 is the gate the whole census rests on. A fork that cannot reproduce observed
reality when asked to replay it has no standing to report what would have
happened otherwise.

### P1 — COMPLETENESS

```text
every enumerated candidate lands in exactly one outcome class; zero
  unclassified
UNPLAYABLE is counted and reported, never dropped
the brain's OWN target is playable at >= 99.9% of sampled moments — a seam that
  silently fails to substitute shows up here first
```

### P2 — CALIBRATION (interval test, powered ex ante)

```text
per band   | rate_A − rate_B |  <= 6.0pp,  for every band with n >= 1,200 per set
marginal   | rate_A − rate_B |  <= 2.0pp
```

Power: at the 1,200-per-band floor the worst-case (p = 0.5) standard error of
the A−B difference is 2.04pp, so ±6.0pp is ≈2.9σ; on the marginal (n ≈ 15,100
per set) it is 0.58pp, so ±2.0pp is ≈3.4σ. Both are wide enough that noise
cannot fail them and narrow enough that a prior which does not generalise will.

A band that does not reach the 1,200 floor is reported as **under-sampled** and
named in the result; its numbers are banked but it is not gated, because a
self-widening interval is not a test.

### Reported, never gated (ruling #8 (j))

The direction of every one of these is a finding, not a validity condition —
that is P3's lesson, and P3 is deliberately absent from this contract.

```text
R1 CHOOSER LIFT: option-space rates against E2a-1's pass-log rates. Registered
   prediction (a prediction, not a gate): option-space lands BELOW pass-log,
   and the delta is the first measured value of the live target-chooser over
   uniform choice. Near-zero would itself be a substrate finding, consistent
   with a speed-blind evaluator.
R2 the priced-axis gradient across bands — receptionSuccessRate, the statistic
   the consumer reads, never the flat interceptedRate proxy (ruling (k)'s
   re-key). This is what within-retention memory is worth.
R3 the UNPLAYABLE share, by cause where distinguishable.
R4 the adjudication-class split, including the never-adjudicated share.
```

### Pricing classes (ruling #8 (k), settled by the commander — implemented, not decided here)

```text
fully-unknown  (target absent from the snapshot, no memory)
                 -> MARGINAL, by construction: the distance is unknowable
stale-memory   (last-known position within retention)
                 -> BANDED at the remembered distance
```

Class is decided by whether the target is in the snapshot, **not** by whether
the physical read succeeded — a target that is remembered but whose flight
cannot be priced is still a stale-memory option, and it keeps its band.

## 5. Stop rules

* **X5 fails** → the fork does not reproduce reality; the census has no
  standing and nothing in it may be reported as a rate. Report and stop.
* **X1/X4 fail** → the seam is not dormant; revert immediately.
* **P1 fails** → candidates are being lost; report, never patch the classifier
  to absorb them.
* **P2 fails** → the option-space prior does not generalise off its own seeds.
  Report to the commander; **do not re-band, re-seed, or widen after seeing
  results.**
* No direction finding may be converted into a gate after the fact, and no
  reported number may be used to justify adjusting the table.
* The table, once committed, is infrastructure: never adjusted after any E2b
  result.
* **On PASS, E2b proceeds without a new ruling** (commander ruling #8).

## 6. FROZEN RESULT — PASS; the selection bias was 13pp, not 0.18pp (2026-07-25)

Run at HEAD `fe81397`. Verdict **PASS**: 2/2 exact-plus-harness, 3/3
completeness, 2/2 calibration. Two invocations byte-identical, shared SHA
`4180a2469443210f0658974a8cf942d97eff8991b8218c00bb865f468dda817c`.
Option-space table SHA `df0aa340…1903`. 63 matches yielded 4,500 moments and
**14,678 forks** per set.

```text
X1 fingerprint 57b0bdab…c673 unchanged, seam dormant      ✓
X2 tsc + build clean · 714/714 green                      ✓
X3 two invocations byte-identical                         ✓
X4 zero live callers (audited)                            ✓
X5 harness — 3/3 matches replay bit-identically           ✓
X6 committed option-space table == this run's census      ✓
P1 completeness, all three sub-gates                      ✓
P2 calibration, per band and marginal                     ✓
```

### The option-space table

```text
band      n(A)   intercepted   reached   clean|reached   receptionSuccess
 6-10    3,451     34.69%      58.97%      91.50%           53.96%
10-14    3,483     32.27%      61.58%      91.33%           56.24%
14-18    2,867     30.66%      61.88%      91.60%           56.68%
18-22    2,101     28.08%      65.45%      91.27%           59.73%
22-26    1,357     34.19%      59.69%      91.36%           54.53%
26-30      855     37.78%      54.15%      91.36%           49.47%   (under-sampled)
MARGINAL 14,114    32.43%      60.95%      91.42%           55.72%
```

**P2 passes**: the worst gated band disagrees with the held-out set by 2.98pp
against a 6.0pp interval, and the marginal by 0.30pp (interception) and 0.035pp
(success) against 2.0pp. The 26–30 band fell short of the 1,200 floor (855/911)
and is therefore **reported, not gated**, exactly as §4 pre-registered — its
errors happened to be 0.31pp and 0.03pp, but that is luck, not evidence.

### R1 — the chooser lift, and how big the selection bias really was

```text
option space (every candidate, counterfactual)     55.72%
chosen subset (the candidate the brain picked)     74.34%
E2a-1's pass-log census                            68.84%
                       chooser lift  +18.62pp
    option space − pass log          −13.12pp
```

Ruling #8's registered prediction holds, and not marginally. Two things follow.

**The live target-chooser is worth 18.6pp.** Picking the man it picks, rather
than a uniformly drawn candidate, moves reception success from 55.7% to 74.3%.
The "near-zero would itself be a substrate finding" branch is firmly not the
world we are in: the chooser is speed-blind, but it is not blind — lane
openness and distance already carry most of what a target choice needs.

**E2a-1's prior was overstated by 13.12pp.** P3 caught this as a 0.18pp
inversion, which was the visible tip of it: the inversion only measured how the
bias differed between two *already-selected* slices, not the bias itself. A
directional gate on a tiny quantity found a large structural error — which is
the argument for keeping cheap directional checks even when their effect sizes
look trivial.

The interception column says the same thing more bluntly: 32.4% of
counterfactual passes are intercepted against 19.5% of played ones. The chooser
avoids roughly two-fifths of the interceptions available to it.

### R2 — what a remembered distance is worth (the re-keyed axis)

```text
priced axis, option space   53.96% (6-10 m) → 49.47% (26-30 m)   4.48pp
priced axis, pass log       71.46%          → 63.14%             8.32pp
```

The gradient survives the de-selection but **halves**, and in the option space
it is **not monotone** — success peaks at 59.73% in the 18–22 m band and falls
away on both sides. Half of what looked like a distance effect in the pass log
was the chooser being more careful about long passes than short ones.

Under ruling (k) the pricing classes are already settled, so this is not a
routing decision but a magnitude: banding a within-retention memory instead of
falling back to the marginal is worth about 4.5pp across the window, and the
non-monotonicity means a consumer must read the band, never extrapolate along
distance.

### R3/R4/R5 — the honest remainders

```text
R3 unplayable                    564 / 14,678 = 3.84%
   the brain's own target        3,675 / 3,675 = 100.0% playable
R4 arrivals at the target        8,602, of which 1,473 (17.1%) never reached an
                                 adjudication at all, and 738 spilled
R5 chosen target out of window   825 / 4,500 moments = 18.33%
```

R5 is the one E2b must carry: nearly a fifth of the passes the brain actually
plays go to a man outside the censused 6–30 m window, almost all of them
shorter than 6 m. Those options exist and will be priced at the marginal, which
is the honest answer but a blunt one. Widening the window is a future census
question, not something to extrapolate into.

### Disclosures

Three, all before or independent of the gates they touch:

1. **The sampler was corrected during smoke to match §3.** `pendingPass` alone
   also fires for through balls, crosses, lofted passes and the corner cutback,
   none of which the seam substitutes; §3 had already specified "a plain ground
   pass", so filtering on the sim's own `lastPassKind` is conformance rather
   than an amendment. Unplayable fell 19.1% → 4.6% at smoke scale.
2. **P1 failed on its first frozen run, at 0.8167 against a 0.999 floor, and
   the failure was in my metric, not the world.** `ownTargetPlayableRate`
   divided by ALL sampled moments, including the 18.3% where the brain's chosen
   man lies outside the censused window and therefore no fork is tagged
   `chosen` at all — the gate's question is not even askable there. An
   independent check forked 300 moments with the brain's own target and got
   **300/300 exact**, so the seam was never implicated. The denominator was
   corrected to the moments where the question exists, the out-of-window share
   was promoted to a reported finding (R5), and the run was repeated: the gate
   now reads 3,675/3,675 = 1.000. **X6 is what makes this safe to state**: the
   re-run's census is byte-equal to the committed table produced before the
   fix, so the correction demonstrably moved a validity counter and nothing
   else. Disclosed in full because the census numbers were already visible when
   the counter was fixed.
3. **`tests/passOptionPricing.test.ts` was re-pointed** from E2a-1's pass-log
   table to the option-space table. That is ruling (k)'s re-wiring landing in
   the test that asserts which table the layer reads, not a re-baseline of a
   behavioural contract.

### What E2b inherits

A held-out-validated prior measured over the population it will actually price;
a pricing layer whose class is decided by memory rather than by whether physics
could be read; the measured value of the chooser it must beat (18.62pp); the
measured value of a remembered distance (4.48pp, non-monotone); and one
registered blind spot (18.3% of real passes fall outside the window and take
the marginal).

Per ruling #8 and the design contract, **E2b proceeds without a new ruling.**

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -C 12 'forcedPassTarget|force.*target' src/ai/PlayerBrain.ts src/sim/Match.ts scripts/probes/eds-e2a2-option-space-census.ts | head -n 240"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/sim/Match.ts-369-    ball: { pos: V2; vel: V2; ownerGid: number | null };
src/sim/Match.ts-370-    players: { gid: number; side: Side; pos: V2; vel: V2; bodyDir: V2; sentOff: boolean }[];
src/sim/Match.ts-371-  } | null = null;
src/sim/Match.ts-372-  /**
src/sim/Match.ts-373-   * EDS E2a-2 (docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md): substitute
src/sim/Match.ts-374-   * the pass TARGET the brain chose, for one tick, and let the live machinery
src/sim/Match.ts-375-   * play it. Intervenes on target choice ONLY — power, lead, aim noise,
src/sim/Match.ts-376-   * offside and bookkeeping all run unchanged. Null in every production path;
src/sim/Match.ts-377-   * a probe arms it for a single tick and clears it. Forcing the gid the brain
src/sim/Match.ts-378-   * would have chosen anyway reproduces the match bit-identically, which is
src/sim/Match.ts-379-   * the harness gate the counterfactual census rests on.
src/sim/Match.ts-380-   */
src/sim/Match.ts:381:  forcedPassTarget: number | null = null;
src/sim/Match.ts-382-  private readonly traceContests: boolean;
src/sim/Match.ts-383-  private activeContest: MutableContestEpisode | null = null;
src/sim/Match.ts-384-  private nextContestId = 1;
src/sim/Match.ts-385-  /** Physical contact has happened; stable ownership has not. */
src/sim/Match.ts-386-  private pendingControl: PendingControlAttempt | null = null;
src/sim/Match.ts-387-  /**
src/sim/Match.ts-388-   * Discrete dribble touch in flight (Phase 36): the carrier pushed the
src/sim/Match.ts-389-   * ball ahead and is chasing it. The tag keeps his brain on the chase and
src/sim/Match.ts-390-   * prices his re-collect gently (it's HIS touch, not a blind reception);
src/sim/Match.ts-391-   * any other capture, kick or dead ball clears it.
src/sim/Match.ts-392-   */
src/sim/Match.ts-393-  dribbleTouch: { gid: number; until: number } | null = null;
--
scripts/probes/eds-e2a2-option-space-census.ts-113-    if (fresh !== null) {
scripts/probes/eds-e2a2-option-space-census.ts-114-      key = fresh;
scripts/probes/eds-e2a2-option-space-census.ts-115-      events.push({ tick: reference.simTick, targetGid: reference.pendingPass!.targetGid });
scripts/probes/eds-e2a2-option-space-census.ts-116-    }
scripts/probes/eds-e2a2-option-space-census.ts-117-  }
scripts/probes/eds-e2a2-option-space-census.ts-118-  const referenceSignature = signature(reference);
scripts/probes/eds-e2a2-option-space-census.ts-119-
scripts/probes/eds-e2a2-option-space-census.ts-120-  const replay = matchOf(seed);
scripts/probes/eds-e2a2-option-space-census.ts-121-  let index = 0;
scripts/probes/eds-e2a2-option-space-census.ts-122-  while (!replay.finished) {
scripts/probes/eds-e2a2-option-space-census.ts-123-    const next = events[index];
scripts/probes/eds-e2a2-option-space-census.ts-124-    const arm = next !== undefined && replay.simTick + 1 === next.tick;
scripts/probes/eds-e2a2-option-space-census.ts:125:    if (arm) replay.forcedPassTarget = next.targetGid;
scripts/probes/eds-e2a2-option-space-census.ts-126-    replay.step(DT);
scripts/probes/eds-e2a2-option-space-census.ts-127-    if (arm) {
scripts/probes/eds-e2a2-option-space-census.ts:128:      replay.forcedPassTarget = null;
scripts/probes/eds-e2a2-option-space-census.ts-129-      index += 1;
scripts/probes/eds-e2a2-option-space-census.ts-130-    }
scripts/probes/eds-e2a2-option-space-census.ts-131-  }
scripts/probes/eds-e2a2-option-space-census.ts-132-  return signature(replay) === referenceSignature && index === events.length && events.length > 0;
scripts/probes/eds-e2a2-option-space-census.ts-133-};
scripts/probes/eds-e2a2-option-space-census.ts-134-
scripts/probes/eds-e2a2-option-space-census.ts-135-// --- the counterfactual census ----------------------------------------------
scripts/probes/eds-e2a2-option-space-census.ts-136-type Outcome = 'intercepted' | 'reachedTarget' | 'otherTeammate' | 'unresolved' | 'unplayable';
scripts/probes/eds-e2a2-option-space-census.ts-137-
scripts/probes/eds-e2a2-option-space-census.ts-138-interface Fork {
scripts/probes/eds-e2a2-option-space-census.ts-139-  readonly band: number;
scripts/probes/eds-e2a2-option-space-census.ts-140-  readonly outcome: Outcome;
--
scripts/probes/eds-e2a2-option-space-census.ts-149- * Everything after the substitution is the live machinery playing that pass.
scripts/probes/eds-e2a2-option-space-census.ts-150- */
scripts/probes/eds-e2a2-option-space-census.ts-151-const forkCandidates = (
scripts/probes/eds-e2a2-option-space-census.ts-152-  before: Match, passerGid: number, chosenGid: number, candidates: readonly Player[],
scripts/probes/eds-e2a2-option-space-census.ts-153-): Fork[] => candidates.map((candidate) => {
scripts/probes/eds-e2a2-option-space-census.ts-154-  const fork = cloneSimulationState(before);
scripts/probes/eds-e2a2-option-space-census.ts-155-  const passer = fork.allPlayers.find((player) => player.gid === passerGid);
scripts/probes/eds-e2a2-option-space-census.ts-156-  if (!passer) {
scripts/probes/eds-e2a2-option-space-census.ts-157-    return { band: 0, outcome: 'unplayable' as Outcome, spilled: false, adjudicated: false, chosen: false };
scripts/probes/eds-e2a2-option-space-census.ts-158-  }
scripts/probes/eds-e2a2-option-space-census.ts-159-  const band = bandIndexOf(distanceBetween(passer.pos, candidate.pos));
scripts/probes/eds-e2a2-option-space-census.ts-160-  const chosen = candidate.gid === chosenGid;
scripts/probes/eds-e2a2-option-space-census.ts:161:  fork.forcedPassTarget = candidate.gid;
scripts/probes/eds-e2a2-option-space-census.ts-162-  fork.step(DT);
scripts/probes/eds-e2a2-option-space-census.ts:163:  fork.forcedPassTarget = null;
scripts/probes/eds-e2a2-option-space-census.ts-164-  const pending = fork.pendingPass;
scripts/probes/eds-e2a2-option-space-census.ts-165-  // Unplayable: the substitution did not become a pass to this man. Counted as
scripts/probes/eds-e2a2-option-space-census.ts-166-  // its own class, never dropped — ruling #8 (i).
scripts/probes/eds-e2a2-option-space-census.ts-167-  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
scripts/probes/eds-e2a2-option-space-census.ts-168-    return { band, outcome: 'unplayable', spilled: false, adjudicated: false, chosen };
scripts/probes/eds-e2a2-option-space-census.ts-169-  }
scripts/probes/eds-e2a2-option-space-census.ts-170-  const kickTick = fork.simTick;
scripts/probes/eds-e2a2-option-space-census.ts-171-  let outcome: Outcome = 'unresolved';
scripts/probes/eds-e2a2-option-space-census.ts-172-  let toucherGid = -1;
scripts/probes/eds-e2a2-option-space-census.ts-173-  for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
scripts/probes/eds-e2a2-option-space-census.ts-174-    fork.step(DT);
scripts/probes/eds-e2a2-option-space-census.ts-175-    const toucher = fork.ball.lastTouch;
--
src/ai/PlayerBrain.ts-789-    return;
src/ai/PlayerBrain.ts-790-  }
src/ai/PlayerBrain.ts-791-  const top = cands[0];
src/ai/PlayerBrain.ts-792-  const scores = cands.slice(0, 4);
src/ai/PlayerBrain.ts-793-
src/ai/PlayerBrain.ts-794-  // EDS E2a-2: dormant target-choice intervention. A census of PLAYED passes
src/ai/PlayerBrain.ts-795-  // is a selected sample — the chooser already filtered for options it liked —
src/ai/PlayerBrain.ts-796-  // so the option-space prior has to be measured counterfactually. This is the
src/ai/PlayerBrain.ts-797-  // one seam where "what if he had picked that man instead" can be asked
src/ai/PlayerBrain.ts-798-  // without touching how the pass is then struck. Null in every production
src/ai/PlayerBrain.ts-799-  // path; the cutback has its own machinery and is never substituted.
src/ai/PlayerBrain.ts-800-  let passMate = bestMate;
src/ai/PlayerBrain.ts:801:  if (match.forcedPassTarget !== null && top.action === 'Pass' && top !== cutbackCand) {
src/ai/PlayerBrain.ts-802-    const forced = team.players.find(
src/ai/PlayerBrain.ts:803:      (mate) => mate.gid === match.forcedPassTarget && mate !== p && !mate.sentOff,
src/ai/PlayerBrain.ts-804-    );
src/ai/PlayerBrain.ts-805-    if (forced) passMate = forced;
src/ai/PlayerBrain.ts-806-  } else if (
src/ai/PlayerBrain.ts-807-    match.edsPerceivedChoice && top.action === 'Pass' && top !== cutbackCand
src/ai/PlayerBrain.ts-808-    && p.role !== 'GK' && bestMate !== null
src/ai/PlayerBrain.ts-809-  ) {
src/ai/PlayerBrain.ts-810-    // EDS E3 — the live perceived chooser (design contract §2.1). The brain has
src/ai/PlayerBrain.ts-811-    // already decided to pass; WHO gets it is priced from this body's own
src/ai/PlayerBrain.ts-812-    // snapshot on E2b-0's measured probability axis, over executable options
src/ai/PlayerBrain.ts-813-    // only. Keepers are excluded exactly as every perception consumer excludes
src/ai/PlayerBrain.ts-814-    // them, and the cutback keeps its own machinery.
src/ai/PlayerBrain.ts-815-    // E3R (ruling #12.4 (d)): candidate-scoped materialisation. The pricing

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '730,900p' src/ai/PlayerBrain.ts; sed -n '135,235p' scripts/probes/eds-e2a2-option-space-census.ts"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
      // it picked by receiver-openness alone. A clear lane is now required,
      // not merely an open receiver. The lofted PUNT below clears heads and
      // keeps its openness-of-landing logic.
      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;
      if (sT > bestThrow) {
        bestThrow = sT;
        bestThrowMate = mate;
      }
    }
    if (bestThrowMate) {
      cands.push({
        action: 'ThrowOut',
        score: bestThrow,
        why: `thrown to ${bestThrowMate.name} · open ${opennessOf(bestThrowMate, opp.players).toFixed(2)} · ${dist(p.pos, bestThrowMate.pos) <= 16 ? `roll to feet · passBias ${g.passBias.toFixed(2)}` : `counter sling · counterBias ${g.counterAttackBias.toFixed(2)}`}`,
      });
    }
    let bestPuntFit = 0;
    for (const mate of team.players) {
      if (mate === p || mate.sentOff) continue;
      const d = dist(p.pos, mate.pos);
      if (d < 24) continue;
      const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;
      if (fit > bestPuntFit) {
        bestPuntFit = fit;
        puntMate = mate;
      }
    }
    if (puntMate) {
      const closed = 1 - bestOpenNear;
      const sP =
        (0.2 + closed * 0.55) *
        (1.4 - (g.passBias + g.riskTolerance) * 0.6) *
        (0.7 + bestPuntFit * 0.45);
      puntCand = {
        action: 'LoftedPass',
        score: sP,
        why: `PUNT to ${puntMate.name} · outlets closed ${closed.toFixed(2)} · strength ${puntMate.attrs.strength.toFixed(2)}`,
      };
      cands.push(puntCand);
    }
  }

  // --- Clear: panic button deep in our half; risk-averse teams use it more.
  // A keeper distributing from the HANDS never panic-hoofs (Phase 28.3) —
  // they had a full second to pick a target.
  if (localX < -18 && p.kickCooldown <= 0 && !(p.role === 'GK' && p.gkDistributing)) {
    let sC = (W.clearBase + pressure * W.clearPressureW) * (1.25 - g.riskTolerance * 0.8);
    // A keeper with the ball at his feet (32.2): the TRADITIONAL keeper
    // hoofs it; the ball-playing one (passBias + riskTolerance) trusts his
    // feet and plays through the press — the same genes that make his
    // teammates use him as the outlet.
    if (p.role === 'GK') sC *= 1.9 - (g.passBias + g.riskTolerance) * 0.55;
    cands.push({ action: 'ClearBall', score: sC, why: `pressure ${pressure.toFixed(2)} · risk-averse ${(1 - g.riskTolerance).toFixed(2)}` });
  }

  cands.sort((a, b) => b.score - a.score);
  // Degenerate fallback (kick still on cooldown): carry the ball as today.
  if (cands.length === 0) {
    p.action = { type: 'Dribble', scores: [] };
    return;
  }
  const top = cands[0];
  const scores = cands.slice(0, 4);

  // EDS E2a-2: dormant target-choice intervention. A census of PLAYED passes
  // is a selected sample — the chooser already filtered for options it liked —
  // so the option-space prior has to be measured counterfactually. This is the
  // one seam where "what if he had picked that man instead" can be asked
  // without touching how the pass is then struck. Null in every production
  // path; the cutback has its own machinery and is never substituted.
  let passMate = bestMate;
  if (match.forcedPassTarget !== null && top.action === 'Pass' && top !== cutbackCand) {
    const forced = team.players.find(
      (mate) => mate.gid === match.forcedPassTarget && mate !== p && !mate.sentOff,
    );
    if (forced) passMate = forced;
  } else if (
    match.edsPerceivedChoice && top.action === 'Pass' && top !== cutbackCand
    && p.role !== 'GK' && bestMate !== null
  ) {
    // EDS E3 — the live perceived chooser (design contract §2.1). The brain has
    // already decided to pass; WHO gets it is priced from this body's own
    // snapshot on E2b-0's measured probability axis, over executable options
    // only. Keepers are excluded exactly as every perception consumer excludes
    // them, and the cutback keeps its own machinery.
    // E3R (ruling #12.4 (d)): candidate-scoped materialisation. The pricing
    // reads this body, the options it is pricing, and the opponents the
    // corridor read scans — so that is what gets built into an array, at the
    // one tick it is asked. Candidates are enumerated from the roster, which
    // needs no snapshot at all (§5 (c)'s registered truth-measured window).
    const candidateGids = passChoiceCandidateGids(p, team.players);
    const scope = new Set<number>([p.gid, ...candidateGids]);
    for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);
    const snapshot = candidateGids.length === 0 ? null : match.perceivedSnapshot(p, scope);
    const reachProfiles = snapshot === null ? null : match.reachProfiles();
    const choice = snapshot === null || reachProfiles === null || candidateGids.length === 0 ? null
      : choosePerceivedPassTarget({
        snapshot,
        passerGid: p.gid,
        candidateGids,
        attackDir: team.attackDir,
        reachProfiles,
        valueAxis: match.edsValueAxis,
      });
    const chosen = choice === null ? null
      : team.players.find((mate) => mate.gid === choice.targetGid) ?? null;
    // No executable option means he can see nobody he could honestly aim at.
    // v1 keeps the legacy choice there rather than suppressing a pass the
    // action layer already committed to — the seam is target choice only. The
    // rate is traced (`chosenGid === -1`) and reported, never hidden.
    if (chosen) passMate = chosen;
    if (match.traceChoice) {
      const power = choice === null || snapshot === null || reachProfiles === null
        ? null : preferredPassPower({
          snapshot,
          passerGid: p.gid,
          targetGid: choice.targetGid,
          attackDir: team.attackDir,
          reachProfiles,
          powers: PASS_CANARY_POWERS,
          heavyTouchCost: match.edsTouchCost,
        });
      match.passChoiceTrace.push({
        tick: match.simTick,
        passerGid: p.gid,
        chosenGid: choice?.targetGid ?? -1,
        legacyGid: bestMate.gid,
        candidates: candidateGids.length,
        read: choice?.options.filter((o) => o.infoClass === 'READ').length ?? 0,
        seenUnread: choice?.options.filter((o) => o.infoClass === 'SEEN-UNREAD').length ?? 0,
        unseen: choice?.options.filter((o) => o.infoClass === 'UNSEEN').length ?? 0,
        price: choice?.price ?? Number.NaN,
        reception: choice?.reception ?? Number.NaN,
        value: choice?.value ?? Number.NaN,
        distance: choice?.distance ?? Number.NaN,
        blindOutpricesRead: choice?.blindOutpricesRead ?? false,
        blindOutpricesBand: choice?.blindOutpricesBand ?? false,
        preferredPowerIndex: power?.preferredIndex ?? -1,
        powerPrices: power?.prices ?? [],
        powerThreatSeconds: power?.threatSeconds ?? [],
        powerTouchFailPriors: power?.touchFailPriors ?? [],
      });
    }
  }

  // A restart taker sets themselves before striking (the run-up): face the
  // chosen target so orientation penalties don't gut dead-ball deliveries —
  // corners arrived weak and wild while the taker still faced the flag.
  if (mustKick) {
    const at =
      top === cutbackCand ? cutbackMate!.pos // the corner arc cutback (31)
      : top.action === 'Pass' ? passMate!.pos
      : top.action === 'LoftedPass' ? bestLoftMate!.pos
      : top.action === 'Cross' ? bestCrossMate!.pos
      : top.action === 'ThroughBall' ? bestRunner!.pos
      : top.action === 'Shoot' ? goal
      : null; // clears/dribbles: face straight upfield
    if (at) {
      const hx = at.x - p.pos.x;
      const hy = at.y - p.pos.y;
      const hl = Math.sqrt(hx * hx + hy * hy);
      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
    } else {
      p.heading = { x: team.attackDir, y: 0 };
    }
  }

  // Kicks resolve instantly; movement actions persist until next tick.
  switch (top.action) {
    case 'Pass':
      if (top === cutbackCand) {
// --- the counterfactual census ----------------------------------------------
type Outcome = 'intercepted' | 'reachedTarget' | 'otherTeammate' | 'unresolved' | 'unplayable';

interface Fork {
  readonly band: number;
  readonly outcome: Outcome;
  readonly spilled: boolean;
  readonly adjudicated: boolean;
  /** True for the candidate the brain would have chosen unaided. */
  readonly chosen: boolean;
}

/**
 * Fork the pre-tick state once per candidate, substituting only the target.
 * Everything after the substitution is the live machinery playing that pass.
 */
const forkCandidates = (
  before: Match, passerGid: number, chosenGid: number, candidates: readonly Player[],
): Fork[] => candidates.map((candidate) => {
  const fork = cloneSimulationState(before);
  const passer = fork.allPlayers.find((player) => player.gid === passerGid);
  if (!passer) {
    return { band: 0, outcome: 'unplayable' as Outcome, spilled: false, adjudicated: false, chosen: false };
  }
  const band = bandIndexOf(distanceBetween(passer.pos, candidate.pos));
  const chosen = candidate.gid === chosenGid;
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  // Unplayable: the substitution did not become a pass to this man. Counted as
  // its own class, never dropped — ruling #8 (i).
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return { band, outcome: 'unplayable', spilled: false, adjudicated: false, chosen };
  }
  const kickTick = fork.simTick;
  let outcome: Outcome = 'unresolved';
  let toucherGid = -1;
  for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
    fork.step(DT);
    const toucher = fork.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) {
      toucherGid = toucher.gid;
      outcome = toucher.gid === candidate.gid
        ? 'reachedTarget'
        : toucher.side === passer.side ? 'otherTeammate' : 'intercepted';
      break;
    }
    if (fork.phase !== 'playing') break;
  }
  if (outcome !== 'reachedTarget') return { band, outcome, spilled: false, adjudicated: false, chosen };
  // Let the adjudication land: contact and first touch are three ticks apart.
  const touchTick = fork.simTick;
  for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
    fork.step(DT);
  }
  const event = fork.firstTouchTrace.find((trace) => (
    trace.gid === toucherGid && trace.intendedTarget
    && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
  ));
  return {
    band,
    outcome,
    spilled: event ? !event.clean : false,
    adjudicated: event !== undefined,
    chosen,
  };
});

const tabulate = (forks: readonly Fork[], bandFrom: number, bandTo: number): PassPriorRow => {
  // UNPLAYABLE is not an outcome of a pass — it is the absence of one — so it
  // is excluded from the rate denominator and reported separately (R3).
  const playable = forks.filter((fork) => fork.outcome !== 'unplayable');
  const n = playable.length;
  const rate = (count: number) => (n === 0 ? 0 : count / n);
  const reached = playable.filter((fork) => fork.outcome === 'reachedTarget');
  const spilled = reached.filter((fork) => fork.spilled).length;
  const cleanGivenReached = reached.length === 0 ? 0 : 1 - spilled / reached.length;
  const reachedRate = rate(reached.length);
  return {
    bandFrom,
    bandTo,
    passes: n,
    interceptedRate: rate(playable.filter((fork) => fork.outcome === 'intercepted').length),
    reachedRate,
    otherTeammateRate: rate(playable.filter((fork) => fork.outcome === 'otherTeammate').length),
    unresolvedRate: rate(playable.filter((fork) => fork.outcome === 'unresolved').length),
    cleanGivenReached,
    receptionSuccessRate: reachedRate * cleanGivenReached,
  };
};

const runCensus = (seedStart: number) => {
  const forks: Fork[] = [];
  let moments = 0;
  let ownTargetPlayable = 0;
  let ownTargetInWindow = 0;
  let chosenOutOfWindow = 0;
  let matches = 0;
  for (
    let seed = seedStart;

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '900,1010p' src/ai/PlayerBrain.ts; sed -n '235,360p' scripts/probes/eds-e2a2-option-space-census.ts"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
      if (top === cutbackCand) {
        p.action = { type: 'Pass', targetIdx: cutbackMate!.gid, scores };
        match.performCutback(p, cutbackMate!);
      } else {
        p.action = { type: 'Pass', targetIdx: passMate!.gid, scores };
        match.performPass(p, passMate!, offsideExemptKick);
      }
      break;
    case 'LoftedPass': {
      // The keeper's punt (Phase 98) routes to ITS target — the aerial
      // outlet — not the ground game's best switch.
      const loftTo = top === puntCand ? puntMate! : bestLoftMate!;
      p.action = { type: 'LoftedPass', targetIdx: loftTo.gid, scores };
      match.performLoftedPass(p, loftTo, offsideExemptKick);
      break;
    }
    case 'Cross':
      p.action = { type: 'Cross', targetIdx: bestCrossMate!.gid, scores };
      // A routine corner delivers to the KEY ZONE, not to a led body
      // (Phase 31.9): the crasher's burst is timed onto the zone, and a
      // velocity lead on a sprinting man overshot the whole picture by
      // ~9m. The small pull keeps the drop off the keeper's claim radius.
      match.performCross(
        p, bestCrossMate!, offsideExemptKick,
        kickKind === 'corner' ? 0.06 : 0.18,
        kickKind === 'corner' && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')
          ? cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)
          : undefined,
      );
      break;
    case 'ThrowOut':
      p.action = { type: 'ThrowOut', targetIdx: bestThrowMate!.gid, scores };
      match.performKeeperThrow(p, bestThrowMate!);
      break;
    case 'ThroughBall':
      p.action = { type: 'ThroughBall', targetIdx: bestRunner!.gid, scores };
      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);
      break;
    case 'Shoot':
      p.action = { type: 'Shoot', scores };
      // A free-kick strike is a different kick entirely (Phase 32): the
      // placed ball curls OVER the wall on its own flight profile.
      if (kickKind === 'freeKick') match.performFreeKick(p);
      else match.performShot(p);
      break;
    case 'ClearBall':
      p.action = { type: 'ClearBall', scores };
      match.performClear(p);
      break;
    case 'HoldUp':
      p.action = { type: 'HoldUp', scores };
      break;
    default:
      p.action = { type: 'Dribble', scores };
      break;
  }
}

/* ------------------------------------------------------------------ */
/* Goalkeeper                                                          */
/* ------------------------------------------------------------------ */

function decideGoalkeeper(p: Player, team: Team, match: Match): void {
  const ball = match.ball;
  const ownGoal = team.ownGoal();

  // Shot incoming at our goal -> drop everything and save.
  const shot = match.pendingShot;
  if (
    shot && !shot.resolved && shot.side !== p.side && ball.owner === null &&
    dot(ball.vel, sub(ownGoal, ball.pos)) > 0
  ) {
    p.action = { type: 'GoalkeeperSave', scores: [{ action: 'GoalkeeperSave', score: 1, why: 'shot incoming' }] };
    return;
  }

  // 门将上前 (Phase 35): licensed for a stoppage-time attacking corner —
  // the goal stands EMPTY behind him; a cleared ball into the counter is
  // the price of the theater. TeamBrain tears the license up within one
  // brain tick of the moment dying and he falls through to positioning,
  // which sprints him home.
  if (team.keeperUp) {
    p.action = {
      type: 'MakeRun',
      scores: [{ action: 'MakeRun', score: 1, why: 'keeper UP for the corner — nothing left to lose' }],
    };
    return;
  }

  // 1v1 rush (Phase 27.5): an opponent carrier bearing down with nobody
  // goal-side — charge them down and make the goal small. keeperAggression
  // sets how far out the keeper is willing to leave the line.
  // Phase 103 (user design, 门将出击到禁区外) probed BOTH extensions and
  // kept one: charging a CONTROLLED carrier far out is bad football — the
  // rush-anatomy A/B measured the extended charge at GA +1.3-1.8 vs the
  // timid school in both regimes (attackers simply shoot past the
  // advancing keeper: xg/shot faced 0.16→0.20). The carrier charge keeps
  // its classic range; the sweeper's REAL range gain is the loose-ball
  // interception below (through balls are where 出击 pays).
  const carrier = ball.owner;
  if (carrier && carrier.side !== p.side) {
    const aggr = team.genome.keeperAggression;
    const dGoal = dist(carrier.pos, ownGoal);
    if (dGoal < 9 + aggr * 8) {
      let goalside = 0;
      for (const mate of team.players) {
        if (mate === p || mate.sentOff) continue;
        if (dist(mate.pos, ownGoal) < dGoal - 1) goalside++;
      }
      // The RACE READ (Phase 103): charge only when he can MEET the carrier
      // before the shot. Inside the box the old reflex stands (make the
    let seed = seedStart;
    seed < seedStart + MAX_MATCHES_PER_SET && moments < MOMENTS_PER_SET;
    seed++
  ) {
    matches += 1;
    const match = matchOf(seed);
    let key = '';
    while (!match.finished && moments < MOMENTS_PER_SET) {
      // The pre-tick state is the fork point: the brain has not decided yet.
      const before = cloneSimulationState(match);
      const kindBefore = match.lastPassKind;
      match.step(DT);
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null) continue;
      key = fresh;
      const pending = match.pendingPass!;
      const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
      if (!passerBefore) continue;
      // The full candidate set: every outfield teammate in the censused window.
      // No nearest-only and no near-stationary filter — both were isolation
      // devices for other questions and would re-select the population.
      const candidates = before.teams[passerBefore.side].players.filter((player) => (
        player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
        && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
        && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
      ));
      if (candidates.length === 0) continue;
      moments += 1;
      const batch = forkCandidates(before, pending.passerGid, pending.targetGid, candidates);
      // P1 asks whether the SEAM can play the brain's own choice. That question
      // is only askable when the chosen man is inside the censused window —
      // otherwise no fork is tagged `chosen` and the moment says nothing about
      // the seam. The out-of-window share is a finding in its own right (R5).
      const own = batch.find((fork) => fork.chosen);
      if (own === undefined) chosenOutOfWindow += 1;
      else {
        ownTargetInWindow += 1;
        if (own.outcome !== 'unplayable') ownTargetPlayable += 1;
      }
      forks.push(...batch);
    }
  }

  const table = PASS_PRIOR_BANDS.map(([from, to], index) =>
    tabulate(forks.filter((fork) => fork.band === index), from, to));
  const marginal = tabulate(forks, -1, -1);
  const chosen = forks.filter((fork) => fork.chosen);
  const reached = forks.filter((fork) => fork.outcome === 'reachedTarget');
  return {
    table,
    marginal,
    chosenSubset: tabulate(chosen, -1, -1),
    moments,
    matches,
    forks: forks.length,
    unplayable: forks.filter((fork) => fork.outcome === 'unplayable').length,
    ownTargetPlayableRate: ownTargetInWindow === 0 ? 0 : ownTargetPlayable / ownTargetInWindow,
    ownTargetInWindow,
    chosenOutOfWindow,
    chosenOutOfWindowShare: moments === 0 ? 0 : chosenOutOfWindow / moments,
    adjudication: {
      reached: reached.length,
      adjudicated: reached.filter((fork) => fork.adjudicated).length,
      unadjudicated: reached.filter((fork) => !fork.adjudicated).length,
      spilled: reached.filter((fork) => fork.spilled).length,
    },
  };
};

const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);
const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const census = runCensus(CENSUS_SEED_START);
  const holdout = runCensus(HOLDOUT_SEED_START);

  const calibration = census.table.map((row, index) => {
    const other = holdout.table[index];
    const gated = row.passes >= BAND_SAMPLE_FLOOR && other.passes >= BAND_SAMPLE_FLOOR;
    return {
      band: `${row.bandFrom}-${row.bandTo}`,
      passesA: row.passes,
      passesB: other.passes,
      successA: row.receptionSuccessRate,
      successB: other.receptionSuccessRate,
      interceptedError: Math.abs(row.interceptedRate - other.interceptedRate),
      successError: Math.abs(row.receptionSuccessRate - other.receptionSuccessRate),
      gated,
    };
  });
  const marginalCalibration = {
    passesA: census.marginal.passes,
    passesB: holdout.marginal.passes,
    interceptedError: Math.abs(census.marginal.interceptedRate - holdout.marginal.interceptedRate),
    successError: Math.abs(
      census.marginal.receptionSuccessRate - holdout.marginal.receptionSuccessRate,
    ),
  };

  const exact = {
    x5HarnessReproduces: harness.every((entry) => entry.reproduces),
    x6CommittedTableMatchesCensus:
      OPTION_SPACE_PRIOR_TABLE.length === census.table.length
      && OPTION_SPACE_PRIOR_TABLE.every((row, index) => rowsEqual(row, census.table[index]))
      && rowsEqual(OPTION_SPACE_PRIOR_MARGINAL, census.marginal),
  };
  const completeness = {
    // Every fork carries exactly one of the five classes, and every moment
    // contributed at least one fork.
    p1AllClassified: census.forks > 0 && census.forks >= census.moments
      && holdout.forks >= holdout.moments,
    p1MomentsCollected: census.moments === MOMENTS_PER_SET && holdout.moments === MOMENTS_PER_SET,
    p1OwnTargetPlayable: census.ownTargetPlayableRate >= OWN_TARGET_PLAYABLE_FLOOR
      && holdout.ownTargetPlayableRate >= OWN_TARGET_PLAYABLE_FLOOR,
  };
  const calibrationGates = {
    p2Bands: calibration.filter((entry) => entry.gated).every((entry) =>
      entry.interceptedError <= BAND_TOLERANCE && entry.successError <= BAND_TOLERANCE),
    p2Marginal: marginalCalibration.interceptedError <= MARGINAL_TOLERANCE
      && marginalCalibration.successError <= MARGINAL_TOLERANCE,
  };

  // Reported, never gated (ruling #8 (j)).
  const reported = {

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,279p' docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md; sed -n '1,332p' docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md; sed -n '1,212p' docs/world-model/EDS-E2B1R-CONSUMPTION-SCOPED.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E2b-0 — Threat calibration (the common axis)

Status: **RUN 2026-07-25 — §6 is the frozen result: PASS on every gate.**
Drafted by the autonomous session
under commander ruling #8, which authorised E2b to proceed on E2a-2's PASS
without a new ruling; constraints (c)–(l) in
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3.

Date: 2026-07-25

## 1. Why E2b splits, and why here

Ruling #7 (c) specifies E2b's evaluator as "E0's corridor pricing PLUS the
touch-difficulty term made real by E1b's curve", and ruling #8 (l) requires the
choice A/B to run over **executable** options while blind options stay priced.
Putting those two together exposes a gap neither ruling had to settle:

```text
a blind option      priced at 55.72%          — a probability (E2a-2's marginal)
a seen option       corridor threat in SECONDS + a touch-fail probability
```

Those do not compare. E0 deliberately refuses a scalar score (S7a, and S4a's
finding that `controlProbability` was far too under-dispersed to be one), so
there is no existing total order to choose with — and **inventing a weight to
combine seconds with probabilities is precisely the invented constant ruling #8
rejected** when it threw out pessimism-by-construction. The amount of
information a corridor read carries can only come from a measurement.

So E2b splits, on the same instrument-first principle the commander has now
applied three times (E1a→E1b, E2a-1→E2a-2, and here):

* **E2b-0 (this contract)** — census what the evaluator's corridor read is
  actually worth, by measuring realized outcomes against the read that
  predicted them. Output: a calibration curve that turns the physical read into
  a probability on the *same axis* as the band prior, so a seen option and a
  blind one can finally be compared without a hand-set weight.
* **E2b-1 (drafts on this PASS)** — the both-sides perception A/B, consuming
  that curve.

## 2. What is measured

E2a-2's fork-and-force harness, **reused verbatim with one extra logged
column**. At each sampled plain-ground-pass moment the passer's own
`PerceptionSnapshot` is built at awareness 0.8 (E0's setting), every outfield
teammate at 6–30 m is enumerated, and before the fork the E0 evaluator prices
that candidate from the passer's perceived state. Then the world is forked, the
target substituted, and the realized outcome recorded exactly as E2a-2 did.

```text
logged per candidate, in addition to E2a-2's outcome classes:
  interceptionThreatSeconds   E0's corridor read (higher = more threatened)
  touchFailPrior              E1b's curve through the certified formula
  flightSeconds, arrivalSpeed
  priced                      whether the evaluator could read it at all
```

The census then reports realized reception success by **quintile of predicted
threat**, plus the same for the touch term, over set A, held out against set B.
Quintiles rather than deciles because ~1,760 forks per bin is a measurement and
~880 is a rumour.

Sets, frozen: **A = seeds 700,000+**, **B = 710,000+**, 4,500 moments each —
identical to E2a-2, which is what makes X5 below a real reproduction gate.

## 3. Authorised seat

* New probe `scripts/probes/eds-e2b0-threat-calibration.ts`.
* `src/ai/passPrior.ts` — the calibration table added as data, alongside the
  two census tables already there.
* No other `src/**` change. No new sim seam: E2a-2's `forcedPassTarget` is
  reused as it stands. Zero live callers, fingerprint unchanged.

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical            shared SHA-256
X4 zero live callers (audited)
X5 REPRODUCTION — the outcome census must reproduce E2a-2's banked
   option-space table EXACTLY, field by field, table and marginal:
   the staging and seeds are identical and only a read-only column was added,
   so anything else means the evaluator call perturbed the world
X6 the committed calibration table equals this run's census
```

X5 is the gate that makes the extra column safe. E2a-2 established what this
staging measures; if adding an observation changes it, the observation is not
an observation.

### C1 — COVERAGE

```text
every quintile        n >= 1,200 per set
priced share          reported; a candidate the evaluator cannot read at all is
                      its own class and is never silently binned
```

### C2 — DISCRIMINATION (interval test, powered ex ante)

```text
| realized success in the best-threat quintile
  − realized success in the worst-threat quintile |   >= 10.0pp
```

The **sign is reported, not gated** — ruling #8 (j)'s lesson. What is gated is
that the corridor read *discriminates outcomes at all*: a calibration curve
over a read that predicts nothing is not a curve, and E2b-1 would be building
its chooser on noise. The 10.0pp floor is derived as under half of E0's banked
21.2pp measured opponent-first swing from per-state threat ranking, so it is
conservative against a quantity the world has already shown at larger scale. At
n ≈ 1,760 per bin the standard error of that difference is 1.69pp, so 10.0pp is
≈5.9σ — it cannot fail on noise.

### C3 — HELD-OUT CALIBRATION (interval test)

```text
per quintile   | success_A − success_B |  <= 5.0pp        (≈3.0σ at n ≈ 1,760)
marginal       | success_A − success_B |  <= 2.0pp
```

### Reported, never gated

```text
R1 the calibration curve itself — realized success per threat quintile, and the
   same per touch-prior quintile
R2 WHICH READ CARRIES MORE: the spread the corridor read achieves against the
   spread the band prior achieves on the same forks. If the band prior wins,
   E2b-1's chooser should lean on memory over corridor geometry, and that is a
   finding about what perception is FOR
R3 the unpriceable-but-executable share: candidates in the snapshot whose
   flight the evaluator still could not price (E2a-1 found 0 of these on its
   states; over the full option space it may not be 0)
R4 look-pressure precursor: how often the blind marginal out-prices the best
   executable option once both are on the calibrated axis — ruling #8 (l)'s
   statistic, measurable here for the first time
```

## 5. Stop rules

* **X5 fails** → adding the evaluator read perturbed the world; the column is
  not read-only. Revert and report; nothing in the census may be used.
* **C1 fails** → a quintile is under-sampled; report, do not merge bins after
  seeing results.
* **C2 fails** → the corridor read does not discriminate outcomes. That is a
  substrate finding of the first order — it would mean E0's P1/P5 success was
  specific to per-state ranking and does not survive the option space — and it
  stops E2b-1, because a chooser needs something real to choose on. Report to
  the commander; **do not substitute another read to make the gate pass.**
* **C3 fails** → the curve does not generalise; report, never re-bin or re-seed.
* No reported number may be converted into a gate afterwards, and the
  calibration table, once committed, is infrastructure: never adjusted after
  any E2b-1 result.
* **On PASS, E2b-1 drafts** — the both-sides A/B, whose shape is already fixed
  by ruling #7 (c)–(g) and #8 (l): flagged perceived-state consumers on BOTH
  sides default-off, choice over executable options by the calibrated axis,
  not-looking-must-not-win as monotone non-decreasing realized quality across
  awareness arms, the route-mix gate against S3b's collapse signature, and the
  PERF hard gate at brain cadence against `docs/perf/baseline.json`
  (5.32 µs/step, p95 9 µs).

## 6. FROZEN RESULT — PASS; seeing the lane is worth six times remembering the distance (2026-07-25)

Run at HEAD `439688b`. Verdict **PASS**: 3/3 exact, 1/1 coverage, 1/1
discrimination, 2/2 calibration.

> **Sync note (ruling #5).** While this census was running, six commits from
> another session landed on top of `439688b` — Track F art direction (F0/F1/F1b/
> F1c) and Track D6. They touch `src/render3d`, `src/game`, docs and tests, and
> **zero** files under `src/sim`, `src/ai` or `src/evolution`, which is why the
> production fingerprint is unchanged and why the suite grew from 714 to 721
> tests. No step ID collides: Track F is art direction, this is Track E. The
> census was nonetheless re-run at the post-merge HEAD and returned the same
> SHA, so the result holds at both. Two invocations byte-identical, shared SHA
`fdd6a1ad54306b156be58c5f9b082ffdcbdde55f85c715b4e8bac03b3d65eca2`.
Calibration SHA `52c10713…3082`.

```text
X1 fingerprint 57b0bdab…c673 unchanged                       ✓
X2 tsc + build clean · full suite green                      ✓
X3 two invocations byte-identical                            ✓
X4 zero live callers (audited)                               ✓
X5 harness 3/3 bit-identical                                 ✓
X5 outcome census reproduces E2a-2's banked table exactly    ✓
X6 committed calibration equals this run's census            ✓
C1 every quintile >= 1,200 per set (2,019 / 2,049–2,052)     ✓
C2 discrimination                                            ✓  39.72pp of 10.0
C3 held-out calibration                                      ✓  worst 2.18pp of 5.0
```

The second X5 line is the one that licenses everything else: adding the
evaluator column returned E2a-2's option-space table **field for field**, so
the observation really was an observation.

### R1 — the calibration curve

```text
threat quintile (predicted corridor slack, s)   n      realized success
 −2.017 … 0.039                               2,019       82.86%
  0.039 … 0.296                               2,019       62.31%
  0.296 … 0.536                               2,019       50.97%
  0.536 … 0.806                               2,019       47.15%
  0.806 … 2.945                               2,019       43.14%
```

Monotone across all five bins, spanning **39.72pp**, and it generalises: the
held-out set disagrees by at most 2.18pp per quintile and 0.12pp on the
marginal (57.29% vs 57.17%). The sign is the one E0's P1/P5 found — more
predicted corridor threat, less realized success — now confirmed on the option
space rather than on per-state ranking, which is the thing C2 existed to check.

The touch term discriminates too, but less and unevenly: 70.48 / 60.43 / 51.61
/ 52.15 / 51.76 — an 18.7pp spread that goes flat after the second quintile.

### R2 — which read carries the information

```text
corridor read (E0's threat)     39.72pp of spread
distance band (E2a-2's prior)    6.64pp of spread
```

Same forks, same outcomes, two predictors. **Seeing the lane is worth about six
times knowing how far away the man is.** The band prior is not wrong — its bins
run 54.33 / 55.72 / 55.87 / 59.53 / 60.97, directionally correct — it is simply
weak.

This lands directly on ruling (k). That ruling gave a within-retention memory a
banded price and a fully-unknown man the marginal, and asked what memory is
worth; the answer is that the *band* is the small half of it. What memory
really buys is not the distance but the **corridor read that only a current
percept supports** — which is the substrate argument for looking, stated in
outcomes rather than in principle, and it is what E2b-1's chooser should lean
on wherever it exists.

### R3 — a quarter of playable options cannot be priced at all

```text
playable forks                14,114
priced by the evaluator       10,095   (71.52%)
unpriceable                    4,019   (28.48%)
```

E2a-1 found **zero** of these on its 120 narrow states, where the target was
always the nearest near-stationary man. Over the full option space it is more
than a quarter. These are candidates the fork plays perfectly well but whose
flight the evaluator cannot read, so they are neither "seen and priced" nor
"absent and marginal" — a third class the pricing layer currently folds into
the banded case. E2b-1 must decide explicitly what a remembered-but-unreadable
option is worth; folding it in silently would be the same mistake E2a-1 made
with the population.

### R4 — look-pressure will be real

```text
a blind option                                   55.72%
the mean band price of an executable option      55.81%
```

Indistinguishable. On the band axis alone a passer is nearly indifferent
between a man he cannot see and the average man he can — so if that were the
whole evaluator, not-looking would cost almost nothing and ruling #8 (l)'s
look-pressure statistic would be noise. It is only once the corridor read joins
the axis, spreading executable options from 43% to 83%, that looking pays. That
is the causal seat ruling #8 (l) named, now with a number on both sides of it.

### What E2b-1 inherits

A committed, held-out-validated curve that turns E0's corridor read into a
probability on the same axis as the band prior — so a seen option and a blind
one can finally be compared without a hand-set weight, which was the gap that
forced this split. Plus three constraints its drafting must answer: the
corridor read is the dominant term (39.72pp vs 6.64pp), 28.48% of playable
options carry no read at all and need an explicit class, and look-pressure is
entirely a function of the read rather than the band.

Per §5, **E2b-1 drafts on this PASS.**
# EDS E2b-1 — The both-sides perception A/B

Status: **RUN 2026-07-25 — §7 is the frozen result: FAIL on G3 (perf) and on
X3 (a harness defect of mine). The queue STOPS; E3 is not drafted.** Drafted
by the autonomous session
under commander ruling #9.3; shape fixed by ruling #7 (c)–(g) and #8 (l).

Date: 2026-07-25

## 1. The question

Everything so far has been instruments. This is the experiment they were built
for: **when both sides act on what they can see instead of on truth, does the
option set survive, and does looking beat not looking?**

S3b answered "no" once already — one-sided live perception collapsed the route
mix (headers 6.39→4.05, cutbacks 3.96→2.46) and was reverted. E0 found the
mechanism: observation does not blur the option set, it **deletes** ~46% of it.
E2a-2 built the prior that stops the deletion, and E2b-0 built the exchange
rate that lets a seen option and a blind one be compared at all. E2b-1 spends
them.

## 2. Three information states (ruling #9.3 (a))

The class is named, not folded. E2a-1's population error came from a silent
fold, and E2b-0 measured that 28.48% of playable options sit in the class the
pricing layer currently hides:

```text
READ         target AND lane in the current percept
             → priced by E2b-0's corridor curve (the measured exchange rate)
SEEN-UNREAD  target perceived, lane not readable  (28.48% of playable options)
             → priced at the BAND rate for the remembered distance
UNSEEN       no trace of the man at all
             → priced at the MARGINAL; priced always, executable never
```

Shares are **reported per arm**. They are the mechanism: as awareness falls,
options move READ → SEEN-UNREAD → UNSEEN, and that migration is what a route
collapse would be made of.

## 3. One unit, no invented weights (ruling #9.3 (b), (c))

Every option is priced as a **measured probability that the intended man ends
up in clean control**, and every number in it comes from a census:

```text
READ         P(reached | threat quintile)  ×  P(clean | reached, that quintile)
SEEN-UNREAD  P(reached | band)             ×  P(clean | reached, band)
UNSEEN       P(reached | marginal)         ×  P(clean | reached, marginal)
```

The band and marginal factors are already banked in
[`passPrior.ts`](../../src/ai/passPrior.ts) (`reachedRate`,
`cleanGivenReached`). The READ factors are **not** yet split that way — E2b-0
banked only the composite `realizedSuccess` per quintile — so this contract's
first act is to re-derive the quintile curve as its two factors from the same
census, under an X5 reproduction gate.

### 3.1 On flag-ON, and why this A/B runs flag-OFF

Ruling #9.3 (c) requires either a corridor × touch decomposition at flag-ON
strength, **or an explicit justification for an alternative**. This contract
takes the alternative, on purpose:

E2b-0's curve, the band table and the marginal were all measured in the
**flag-OFF** world. Decomposing lets the READ class be re-priced at flag-ON
strength, because the E1a-certified formula gives a per-option touch term — but
**SEEN-UNREAD and UNSEEN have no per-option arrival prediction**, so their touch
factors would stay at OFF strength while READ moved to ON. That would put a
systematic wedge between the classes *precisely along the axis the choice is
made on*, and the size of the wedge would be an artefact of which class happens
to carry a prediction. Having just spent a whole stage refusing to invent an
exchange rate, importing an uncalibrated one through the back door is the same
error wearing a different hat.

So **E2b-1 runs `edsTouchCost` OFF**, where all three classes are calibrated in
the same world, and the corridor × touch decomposition is still carried out and
reported (it is what makes the READ price auditable). E1b's curve rejoins at
**E3**, where the full bundle is audited together and the §2 band is the
question. A flag-ON sensitivity figure for the READ class alone is reported
here as a diagnostic so the size of the deferred effect is on the record.

## 4. The experiment

Staging: E2a-2's fork-and-force, seeds `700,000+`, **3,000 moments**. Per
moment, four arms are priced and each arm's choice is forked:

```text
arms          awareness 0.2 / 0.5 / 0.8  +  ORACLE (truth — today's world)
both sides    the passer prices from HIS snapshot; the defender's interception
              entry reads HIS OWN perceived ball, through the same shared
              awareness trunk (SUBSTRATE-MAP: no one-sided reading attr)
choice        the highest-priced EXECUTABLE option (READ ∪ SEEN-UNREAD);
              UNSEEN is priced and excluded — ruling #8 (l). Ties by lowest gid
measure       fork, force the chosen target, record the realized outcome
```

Only the chosen option is forked, so this is 4 × 3,000 = 12,000 forks, not a
full re-census.

### 4.1 Authorised seat

* `src/sim/Match.ts` — `edsPerceivedDefence?: boolean`, default **false**, and
  a flag-gated per-player perception layer updated at **brain cadence** (the
  substrate's own scan interval), not per tick.
* `src/ai/PlayerBrain.ts` — the interception entry (`canInterceptPass`, the one
  call at the `pendingPass` branch) reads the defender's own perceived ball
  when the flag is on. A defender with no ball percept cannot enter: not
  looking must cost something, or the arm is theatre.
* New probe `scripts/probes/eds-e2b1-both-sides-ab.ts`.
* No other `src/**` change. Flags default off; fingerprint unchanged.

## 5. Frozen gates

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged, all flags off
X2 tsc + build clean · full suite green
X3 two invocations byte-identical             shared SHA-256
X4 flags-off bit-identity: 3 full matches identical to pre-E2b-1 HEAD
X5 REPRODUCTION: with all flags off, the quintile re-derivation must reproduce
   E2b-0's banked composite curve (82.86 / 62.31 / 50.97 / 47.15 / 43.14%)
   exactly, and its factors must multiply back to it
```

### G1 — NOT-LOOKING MUST NOT WIN (ruling #7 (d))

```text
realized success, arms ordered 0.2 → 0.5 → 0.8 → ORACLE:
  each step  >=  the previous  − 2.0pp        (non-inferiority chain)
```

At 3,000 moments per arm the standard error of a step difference is ≈1.29pp, so
the −2.0pp band is ≈1.6σ of slack: it tolerates a flat rung, and a real
inversion of the size S3b produced (tens of pp) cannot hide in it. The
**endpoint lift (ORACLE − 0.2) is REPORTED, not gated** — ruling #8 (j).

### G2 — ROUTE MIX (ruling #7 (e))

```text
long-option share (chosen distance >= 18 m), awareness-0.8 arm vs ORACLE arm:
  within ±25% relative
mean chosen distance, same comparison:          within ±15% relative
```

Derived from S3b's own collapse signature, which ran −37% and −38% on its route
counts; a ±25% band sits inside that and far outside noise (at a ~30% share and
n = 3,000, ±25% relative is ≈7.7σ).

### G3 — PERF (ruling #7 (f))

```text
flag-ON µs/step   <=  1.25 × flag-OFF µs/step, measured in the same run
flag-ON p95       <=  1.50 × flag-OFF p95
flag-OFF µs/step  reported against docs/perf/baseline.json (5.32 µs/step)
```

Perception runs at brain cadence, never per tick; a per-tick implementation
will fail this gate rather than be argued about.

### Reported, never gated

```text
R1 class shares per arm (READ / SEEN-UNREAD / UNSEEN) — the migration
R2 look-pressure on BOTH axes (ruling #9.3 (d)): how often the best UNSEEN
   price beats the best executable price, on the band axis and on the read axis
R3 endpoint lift ORACLE − 0.2, and the per-arm realized success
R4 the corridor × touch decomposition of the READ price, and the flag-ON
   sensitivity of the READ class alone (§3.1's deferred effect)
R5 chosen-option agreement with the live brain's own choice, per arm
```

## 6. Stop rules

* **X1/X4 fail** → a flag is not dormant; revert immediately.
* **X5 fails** → the re-derivation is not E2b-0's curve; the factors are not
  the thing that was calibrated. Report; never re-fit.
* **G1 fails** → not-looking wins, which is S3b's failure with better
  instruments. Report to the commander: the fix is a design question about what
  an unseen option is worth, never a re-weighting of the evaluator.
* **G2 fails** → the route mix collapsed; the option set did not survive
  perception. Report; do not widen the band.
* **G3 fails** → report; perception may be made cheaper, never less honest, and
  a re-run needs the cheaper implementation, not a raised budget.
* Dormant throughout: nothing ships, no genes, no evolution, no §2 band claim.
* **On PASS the executor drafts E3** directly (ruling #9.4), and the queue
  stops at **E4 — the user's play-test**.

## 7. FROZEN RESULT — the science passes, the plumbing fails twice (2026-07-25)

Run at HEAD `1186760`. Verdict **FAIL** on two gates. SHA
`732f89507b518dd37d9dd2878687cb90ddab99f75d075083d847974229155332`.

```text
X5 harness / census / factors                    ✓ ✓ ✓
G1 not-looking must not win                      ✓
G2 route mix (long share, mean distance)         ✓ ✓
G3 perf p95                                      ✓
G3 perf MEAN                                     ✗  1.329x against a 1.25x budget
X3 two invocations byte-identical                ✗  a defect in this probe
```

### What passed, and it is the part that mattered

**G1 — not-looking does not win.** Realized success of each arm's own chosen
option, forked and forced so the number is the world's:

```text
awareness 0.2    63.28%          chain step  —
awareness 0.5    64.60%                      +1.32pp
awareness 0.8    63.46%                      −1.14pp
ORACLE           67.90%                      +4.44pp
```

Every step clears the −2.0pp non-inferiority band; the 0.5→0.8 rung is
slightly negative and well inside it. The endpoint lift (reported, not gated)
is **+4.61pp**. Seeing the world is worth about four and a half points of
reception success, and no arm of blindness beats a more sighted one.

**G2 — the route mix survives.** This is the gate S3b failed.

```text
long-option share (>= 18 m)   13.31%  17.72%  18.05%  |  18.07% oracle
mean chosen distance (m)      12.81   13.34   13.41   |  13.18  oracle
```

At awareness 0.8 the chosen-option distribution is **indistinguishable from
omniscience** (18.05% vs 18.07%). S3b's collapse signature does not reproduce:
the prior that stops option deletion is doing exactly the job it was built for.
Only the blindest arm shortens the game, and even it does so by a quarter, not
by S3b's ~38%.

**X5** holds on all three legs, including the factors multiplying back to
E2b-0's banked curve. The decomposition is also informative in itself:

```text
threat quintile   P(reached)   P(clean | reached)
1                   88.36%          93.78%
5                   48.49%          88.97%
```

The corridor read predicts the corridor, as intended (39.9pp), and also
mildly predicts touch cleanliness (4.8pp) — a threatened lane delivers a
dirtier ball, which is pressure arriving with the pass.

### G3 — perception at brain cadence costs 33%

```text                 flag OFF     flag ON     ratio    budget
µs/step                  5.947       7.906      1.329     1.25    ✗
p95 (µs)                 9.334      13.125      1.406     1.50    ✓
```

An honest failure of the gate as frozen. The cost is real work: `refreshPerception`
rebuilds a full snapshot per body per decision, and because decisions are
staggered across the squad, essentially every tick captures truth and rebuilds
arrays for somebody. Per §6 the response is **cheaper perception, never a bigger
budget**. Candidate directions, measured by nobody yet and therefore not acted
on: the defender entry consumes only the **ball** percept, not the player array,
so a ball-only refresh would do most of the job; the truth capture allocates a
fresh array per tick; and bodies whose current action cannot consume perception
need not refresh at all.

### X3 — my defect, not the world's

The probe embeds **wall-clock timings** in the object it hashes, so byte
identity is impossible by construction, and the run reported
`deterministic: false`. That is a drafting error: G3 is a measurement of the
machine, and I put it inside the artefact that is supposed to be a measurement
of the world.

The world is fine, and this is demonstrated rather than asserted: with the perf
block removed, two independent shell invocations hash **identically**
(`fd4e33bc…4803` twice). Every other number in this result is reproducible.

The gate is reported as it fired. Rewriting the hash's contents after seeing
the result is exactly the move the discipline forbids, and I have refused it
once already in E1a-I2; the fix belongs in the commander's redraw, where
separating the perf artefact from the hashed result is a one-line decision that
someone other than the author of the mistake should ratify.

### R1 — a correction to a banked number

Separating the three classes properly changes what ruling #9.3 (a) was told:

```text                READ    SEEN-UNREAD    UNSEEN
awareness 0.2         62.0%      0.2%        37.8%
awareness 0.5         77.1%      0.2%        22.7%
awareness 0.8         85.6%      0.2%        14.2%
ORACLE               100.0%      0.0%         0.0%
```

**SEEN-UNREAD is ~0.2% of enumerated options, not 28.48%.** E2b-0's 28.48%
"unpriceable" figure counted every candidate the evaluator returned nothing for
— and that set is dominated by targets the passer simply cannot see, not by
perceived men whose lane is unreadable. The third class is real and worth
naming, but it is nearly empty; the mass is plain UNSEEN. Ruling #9.3 (a)
characterised the class from the conflated number, so this corrects the input
rather than the ruling.

### R2/R3/R5 — the rest

```text
look-pressure, read axis    17.03%  11.77%   9.17%   0%
look-pressure, band axis     7.10%   5.63%   3.60%   0%
agreement with the live brain 38.1%  39.6%   40.8%  47.4%
```

Look-pressure is real and falls with awareness exactly as ruling #8 (l)
predicted: at awareness 0.8 a blind option out-prices every executable one in
**9.2%** of moments — a man the passer would rather have than anyone he can
see. That is the gaze consumer's future workload, quantified. And the evaluator
agrees with the live brain under half the time even with perfect sight, so it
is genuinely a different chooser, not a re-derivation of the existing one.

### Verdict and fork

**FAIL.** The queue stops and **E3 is not drafted** — ruling #9.4 conditioned
that on a PASS. Two questions for the commander, in order:

1. **G3 is a real engineering result**: brain-cadence perception as built costs
   33% against a 25% budget. Cheapen and re-run, or re-scope the budget on
   evidence (the stop rule forbids the latter without a cheaper implementation
   first).
2. **X3 is a contract/harness conflict I created**: a probe cannot both carry a
   wall-clock perf gate and promise a byte-identical artefact. The clean fix is
   to hash the world-result and report perf beside it, but that is a gate
   change and belongs to the commander.

Nothing about G1, G2 or X5 is in question, and none of it shipped: both flags
remain default-off and the fingerprint is unchanged.
# EDS E2b-1R — Consumption-scoped perception

Status: **RUN 2026-07-25 — §6 is the frozen result: PASS on every gate.**
Drafted by the autonomous session
under commander ruling #10.2/#10.3.

Date: 2026-07-25

## 1. What failed, and what the fix may not touch

E2b-1's science passed — not-looking never won, the route mix survived
perception — and its plumbing failed twice. This redraw fixes the plumbing and
must leave the science *bit-for-bit alone*.

```text
G3  brain-cadence perception cost 1.329x against a 1.25x budget
X3  the probe hashed wall-clock, so byte-identity was impossible by construction
```

Ruling #10.3 fixes the lever: **cheaper by computing LESS, never by perceiving
less.** Honesty is frozen — scan cadence, FOV, retention and the keyed
observation error may not move — and the budget stays 1.25× / p95 1.50×.

## 2. The diagnosis the redraw is built on

E2b-1's in-sim perception layer built a **full snapshot** — a scan over every
body, a proprioception write, a retention prune and a fresh `ObservedPlayer[]`
— once per body per brain tick. The only thing in the sim that ever *read* it
was one field:

```ts
match.perceptionSnapshots.get(p.gid)?.ball    // the defender's interception entry
```

Nothing in `src` consumed the player array at all; the passer's choice is
computed probe-side from the probe's own snapshots. So the 33% was almost
entirely work whose output was discarded. That is the codified principle in
ruling #10.3 stated as a bug: **perception cost scales with what consumers
READ, not with what could be seen.**

## 3. The change

Three seams, all of them about *when* and *how much* is computed, never about
what is knowable:

1. **`observeBall` — an O(1) ball percept.** Same scan cadence, same
   visibility rule, same keyed error, same retention, same proprioception
   branch for a carrier — copied from `perceiveSnapshot`'s ball branch, with
   the per-body loop and the array build removed. It needs the observer and the
   ball, so it also skips `capturePerceptionTruth`'s whole-squad allocation.
2. **Memory update split from snapshot materialisation.** `perceiveSnapshot`
   becomes update-then-materialise over the same memory; a consumer that needs
   the array asks for it, and one that does not never pays for it. The public
   function keeps its exact behaviour, pinned by a contract test.
3. **The probe materialises the passer's snapshot at pass-decision moments
   only**, while the memory chain keeps updating every tick — because a memory
   chain sampled only at pass moments is not a memory chain.

## 4. Frozen gates

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged, flags off
X2 tsc + build clean · full suite green
X3 CORRECTED SCHEME (ruling #10.2): the determinism hash covers WORLD
   OUTCOMES only; wall-clock is reported beside it and never hashed. Two
   invocations must agree on the world hash
X4 flags-off bit-identity: 3 full matches identical to pre-redraw HEAD
X5 harness 3/3 · census reproduces E2a-2's table · factors multiply back to
   E2b-0's curve (all three as in E2b-1)
X6 HONESTY PIN: `observeBall` returns exactly what `perceiveSnapshot(...).ball`
   returns, over a frozen grid of awareness × geometry × tick, memory chains
   advanced in lockstep. Asserted in the probe AND as a contract test — this
   is the gate that stops "cheaper" from becoming "blinder"
```

### B1 — BEHAVIOUR-NEUTRALITY (the decisive gate, ruling #10.3)

Same seeds, same moments, and **every E2b-1 aggregate reproduced exactly**:

```text
realized success per arm      63.28% / 64.60% / 63.46% / 67.90%
long-option share             13.31% / 17.72% / 18.05% / 18.07%
mean chosen distance          12.8118 / 13.3403 / 13.4093 / 13.1824
agreement with the brain      38.05% / 39.64% / 40.81% / 47.42%
class shares, look-pressure (both axes), chain deltas, endpoint lift
```

Compared at full float precision against E2b-1's frozen result. A single
changed choice in 3,000 moments × 4 arms would move these; identity across all
of them is the observable form of "the redraw changed nothing but the cost".
G1 and G2 then reproduce **by construction** and stand as verification, not as
fresh evidence.

The probe also emits a **per-moment choice hash** so future redraws can be
compared against this run directly rather than through aggregates.

### G3 — PERF (unchanged budget)

```text
flag-ON µs/step   <=  1.25 × flag-OFF µs/step, same run
flag-ON p95       <=  1.50 × flag-OFF p95
```

## 5. Stop rules

* **X6 fails** → the cheap path is not the same percept; that is perceiving
  less, which this redraw forbids. Revert and report.
* **B1 fails** → the redraw changed behaviour, so it is not a cost fix; the
  science would have to be re-earned rather than reproduced. Report; never
  re-bank the new numbers as if they were E2b-1's.
* **G3 still fails after consumption-scoping** → **STOP and report** (ruling
  #10.3, verbatim): no honesty shaving, no budget raise. The finding would be
  that honest perception at this cadence costs more than the budget allows,
  which is a design question, not a tuning one.
* Dormant throughout; nothing ships.
* **On PASS the executor drafts E3** (ruling #10.5), and the queue stops at
  **E4 — the user's play-test**.

## 6. FROZEN RESULT — PASS; 1.329× became 1.069× and nothing else moved (2026-07-25)

Run at HEAD `e9e3b49`. Verdict **PASS** on every gate. World hash
`dd6dbd0ad3bb1d64ed5e363345d5d72d56edf3a555f877293108c03a2b3abf38`, identical
across two invocations; perf reported beside it and never hashed.

```text
X1 fingerprint 57b0bdab…c673 unchanged                       ✓
X2 tsc + build clean · 729/729 green                         ✓
X3 world hash identical across two invocations               ✓  (corrected scheme)
X5 harness / census / factors                                ✓ ✓ ✓
X6 ball-only percept == full-path ball                       ✓
B1 behaviour-neutrality, all seven families                  ✓
G1 not-looking must not win                                  ✓
G2 route mix                                                 ✓ ✓
G3 perf mean 1.0692× (1.25) · p95 1.0728× (1.50)             ✓ ✓
```

### G3 — the cost went where the diagnosis said it would

```text                    E2b-1        E2b-1R      budget
µs/step, flag OFF          5.947        5.319
µs/step, flag ON           7.906        5.688
ratio                      1.329        1.0692      1.25   ✓
p95 ratio                  1.406        1.0728      1.50   ✓
```

Honest perception at brain cadence now costs **6.9%**, not 33%, and not one
rule about what a body can see was touched to get there. The whole difference
is that the sim stopped building an `ObservedPlayer[]` and scanning a squad to
answer a question about the ball.

Two corroborations worth recording. The flag-OFF arm measured **5.319 µs/step**
against the frozen baseline's 5.32 — the harness is measuring the same machine
the baseline was taken on. And the perf arms are now **interleaved** match by
match: the previous all-OFF-then-all-ON order let any drift over the run land
entirely on the second arm, and since the gate is a ratio that bias pointed
straight at the flag.

### B1 — the decisive gate: nothing but the cost moved

Every E2b-1 aggregate returned at full float precision:

```text
realized success      0.632844 / 0.646007 / 0.634585 / 0.678974
long-option share     0.133066 / 0.177205 / 0.180511 / 0.180723
mean chosen distance · agreement with the brain · class shares ·
look-pressure on both axes · chosen counts        all exact
```

3,000 moments × 4 arms of choices, and not one of them changed. G1 and G2
therefore reproduce **by construction** and stand as verification rather than
fresh evidence, exactly as ruling #10.3 specified.

### X6 — cheaper, not blinder

The ball-only path returns exactly what `perceiveSnapshot(...).ball` returns,
over memory chains driven in lockstep across awareness × facing × ball-owner ×
distance — asserted in the probe on every run and pinned by
`tests/observeBall.test.ts` on every commit. This is the gate that stops a
future "optimisation" from buying its budget with a wider cone or a lazier
scan.

### X3 — the corrected scheme, demonstrating its own point

The world hash covers world outcomes; the wall clock is reported beside it.
During development the perf measurement was changed (interleaving) and **the
world hash did not move** — which is precisely the separation ruling #10.2
codified, visible in the artefact.

### Disclosures

Two, both found before the frozen run and both fixed by making the redraw
*more* faithful rather than less:

1. **A behaviour change I introduced and then removed.** E2b-1 built snapshots
   only for non-keeper, on-pitch bodies, so a keeper passer fell through an
   undefined lookup and was skipped in **every** arm. Materialising on demand
   silently started including those moments, and the oracle arm moved
   64.6% → 68.3% at smoke scale. That is a behaviour change wearing a
   performance costume; the skip is now reproduced explicitly, and B1 is what
   would have caught it had I not.
2. **The perf measurement order**, described above. Both arms now pay any drift
   equally.

### What this unlocks

The plumbing is fixed and the science it was blocking is now verified rather
than merely banked: **not-looking never wins** and **the route mix survives
perception** — S3b's two graves — at a perception cost of 6.9%. Per ruling
#10.5 the executor drafts **E3** next, and the queue stops at **E4, the user's
play-test**.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -C 8 'quint|threshold|calibr' scripts/probes/eds-e2b0-threat-calibration.ts | head -n 260"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
57-const BAND_TOLERANCE = 0.06;
58-const MARGINAL_TOLERANCE = 0.02;
59-const BAND_SAMPLE_FLOOR = 1200;
60-// E2b-0's own frozen parameters (contract §4).
61-const AWARENESS = 0.8; // E0's setting, so the read is the one E0 validated
62-const QUINTILES = 5;
63-const QUINTILE_FLOOR = 1200; // C1
64-const DISCRIMINATION_FLOOR = 0.10; // C2, 10.0pp
65:const CALIBRATION_TOLERANCE = 0.05; // C3, 5.0pp per quintile
66-const CALIBRATION_MARGINAL_TOLERANCE = 0.02; // C3, 2.0pp
67-const OWN_TARGET_PLAYABLE_FLOOR = 0.999; // P1
68-const MAX_MATCHES_PER_SET = 4000; // a backstop, never expected to bind
69-
70-const team = (name: string, seed: number): TeamInfo => {
71-  const rng = new Rng(seed);
72-  return {
73-    id: name,
--
401-  };
402-};
403-
404-const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
405-  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);
406-const canonical = (value: unknown): string => JSON.stringify(value);
407-
408-/**
409: * Bin the playable, priced forks into quintiles of a predicted quantity and
410: * report what the world actually did in each. This is the calibration: it turns
411- * a prediction into a probability by measuring the prediction.
412- */
413:const quintilesBy = (
414-  forks: readonly Fork[], value: (read: EvaluatorRead) => number,
415-) => {
416-  const priced = forks
417-    .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
418-    .map((fork) => ({ fork, key: value(fork.read!) }))
419-    // Ties broken by the outcome-independent band so the ordering is total and
420-    // deterministic; never by the outcome, which would fit the curve to itself.
421-    .sort((left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess);
422-  const size = Math.floor(priced.length / QUINTILES);
423-  return Array.from({ length: QUINTILES }, (_, index) => {
424-    const from = index * size;
425-    const to = index === QUINTILES - 1 ? priced.length : from + size;
426-    const slice = priced.slice(from, to);
427-    const wins = slice.filter((entry) => succeeded(entry.fork)).length;
428-    return {
429:      quintile: index,
430-      n: slice.length,
431-      keyFrom: slice.length === 0 ? 0 : slice[0].key,
432-      keyTo: slice.length === 0 ? 0 : slice[slice.length - 1].key,
433-      realizedSuccess: slice.length === 0 ? 0 : wins / slice.length,
434-    };
435-  });
436-};
437-
--
441-  return rates.length === 0 ? 0 : Math.max(...rates) - Math.min(...rates);
442-};
443-
444-const runExperiment = () => {
445-  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
446-  const census = runCensus(CENSUS_SEED_START);
447-  const holdout = runCensus(HOLDOUT_SEED_START);
448-
449:  const threatA = quintilesBy(census.forkRecords, (read) => read.threatSeconds);
450:  const threatB = quintilesBy(holdout.forkRecords, (read) => read.threatSeconds);
451:  const touchA = quintilesBy(census.forkRecords, (read) => read.touchFailPrior);
452-  // R2's rival predictor, over the SAME forks: the band prior alone.
453:  const bandBins = quintilesBy(census.forkRecords, () => 0).length === 0 ? [] : (() => {
454-    const priced = census.forkRecords
455-      .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
456-      .sort((left, right) => left.bandSuccess - right.bandSuccess);
457-    const size = Math.floor(priced.length / QUINTILES);
458-    return Array.from({ length: QUINTILES }, (_, index) => {
459-      const from = index * size;
460-      const to = index === QUINTILES - 1 ? priced.length : from + size;
461-      const slice = priced.slice(from, to);
462-      const wins = slice.filter((fork) => succeeded(fork)).length;
463:      return { quintile: index, n: slice.length, realizedSuccess: slice.length === 0 ? 0 : wins / slice.length };
464-    });
465-  })();
466-
467-  const playablePriced = census.forkRecords.filter(
468-    (fork) => fork.outcome !== 'unplayable' && fork.read !== null,
469-  );
470-  const playable = census.forkRecords.filter((fork) => fork.outcome !== 'unplayable');
471-  const marginalSuccessA = playablePriced.length === 0
472-    ? 0 : playablePriced.filter(succeeded).length / playablePriced.length;
473-  const holdoutPriced = holdout.forkRecords.filter(
474-    (fork) => fork.outcome !== 'unplayable' && fork.read !== null,
475-  );
476-  const marginalSuccessB = holdoutPriced.length === 0
477-    ? 0 : holdoutPriced.filter(succeeded).length / holdoutPriced.length;
478-
479:  const calibration = threatA.map((bin, index) => ({
480:    quintile: index,
481-    nA: bin.n,
482-    nB: threatB[index].n,
483-    successA: bin.realizedSuccess,
484-    successB: threatB[index].realizedSuccess,
485-    error: Math.abs(bin.realizedSuccess - threatB[index].realizedSuccess),
486-  }));
487-
488-  const discrimination = Math.abs(
--
505-  };
506-  const coverage = {
507-    c1Quintiles: threatA.every((bin) => bin.n >= QUINTILE_FLOOR)
508-      && threatB.every((bin) => bin.n >= QUINTILE_FLOOR),
509-  };
510-  const discriminationGate = {
511-    c2Discriminates: discrimination >= DISCRIMINATION_FLOOR,
512-  };
513:  const calibrationGates = {
514:    c3Quintiles: calibration.every((entry) => entry.error <= CALIBRATION_TOLERANCE),
515-    c3Marginal: Math.abs(marginalSuccessA - marginalSuccessB) <= CALIBRATION_MARGINAL_TOLERANCE,
516-  };
517-
518-  const pass = Object.values(exact).every(Boolean)
519-    && Object.values(coverage).every(Boolean)
520-    && Object.values(discriminationGate).every(Boolean)
521:    && Object.values(calibrationGates).every(Boolean);
522-
523-  return {
524-    experiment: 'EDS-E2b-0',
525-    authority: 'EDS-E2B0-THREAT-CALIBRATION',
526-    parameters: {
527-      censusSeedStart: CENSUS_SEED_START,
528-      holdoutSeedStart: HOLDOUT_SEED_START,
529-      momentsPerSet: MOMENTS_PER_SET,
530-      awareness: AWARENESS,
531:      quintiles: QUINTILES,
532:      quintileFloor: QUINTILE_FLOOR,
533-      discriminationFloor: DISCRIMINATION_FLOOR,
534:      calibrationTolerance: CALIBRATION_TOLERANCE,
535-    },
536-    harness,
537-    census: { table: census.table, marginal: census.marginal, moments: census.moments, forks: census.forks },
538-    threatQuintilesA: threatA,
539-    threatQuintilesB: threatB,
540:    calibration,
541-    marginalSuccess: { setA: marginalSuccessA, setB: marginalSuccessB },
542-    reported: {
543-      r1TouchQuintiles: touchA,
544-      r2WhichReadCarriesMore: {
545-        threatSpread: spreadOf(threatA),
546-        bandPriorSpread: spreadOf(bandBins),
547-        bandBins,
548-      },
--
556-        blindMarginal: OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate,
557-        bestExecutableMeanBand: playablePriced.length === 0
558-          ? 0 : playablePriced.reduce((sum, fork) => sum + fork.bandSuccess, 0) / playablePriced.length,
559-      },
560-    },
561-    exact,
562-    coverage,
563-    discrimination: { topVsBottom: discrimination, ...discriminationGate },
564:    calibrationGates,
565-    verdict: pass ? 'PASS' : 'FAIL',
566-  };
567-};
568-
569-const first = runExperiment();
570-const second = runExperiment();
571-const firstJson = canonical(first);
572-const deterministic = firstJson === canonical(second);
573-const sha256 = createHash('sha256').update(firstJson).digest('hex');
574-const output = { ...first, deterministic, sha256 };
575-if (!deterministic) output.verdict = 'FAIL';
576-console.log(JSON.stringify(output, null, 2));
577-console.error(
578-  `EDS-E2b-0 ${output.verdict} · X5 harness ${output.exact.x5HarnessReproduces}`
579-  + ` · X5 reproduces-E2a2 ${output.exact.x5ReproducesE2a2}`
580-  + ` · X6 ${output.exact.x6CommittedCalibrationMatches}`
581:  + ` · threat quintiles ${output.threatQuintilesA.map((q) => (q.realizedSuccess * 100).toFixed(1)).join('/')}`
582-  + ` · discrimination ${(output.discrimination.topVsBottom * 100).toFixed(2)}pp`
583-  + ` · spreads threat ${(output.reported.r2WhichReadCarriesMore.threatSpread * 100).toFixed(2)}pp`
584-  + ` vs band ${(output.reported.r2WhichReadCarriesMore.bandPriorSpread * 100).toFixed(2)}pp`
585-  + ` · SHA ${sha256}`,
586-);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -C 5 'CORRIDOR|THREAT|QUINTILE|keyFrom|keyTo|realizedSuccess' src/ai/passPrior.ts src/ai/passOptionPricing.ts scripts/probes/eds-e2b1-both-sides-ab.ts | head -n 260"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/ai/passPrior.ts-253-  return index === null ? OPTION_SPACE_PRIOR_MARGINAL : OPTION_SPACE_PRIOR_TABLE[index];
src/ai/passPrior.ts-254-}
src/ai/passPrior.ts-255-
src/ai/passPrior.ts-256-/**
src/ai/passPrior.ts-257- * EDS E2b-0 — the threat calibration curve.
src/ai/passPrior.ts:258: * Authority: docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md
src/ai/passPrior.ts-259- *
src/ai/passPrior.ts-260- * What E0's corridor read is WORTH, measured rather than assumed: realized
src/ai/passPrior.ts-261- * reception success by quintile of predicted interception threat, over the same
src/ai/passPrior.ts-262- * counterfactual forks E2a-2 censused. This is what puts a seen option's
src/ai/passPrior.ts-263- * physical read on the same probability axis as an unseen option's band prior,
--
src/ai/passPrior.ts-267- */
src/ai/passPrior.ts-268-export interface ThreatCalibrationRow {
src/ai/passPrior.ts-269-  readonly quintile: number;
src/ai/passPrior.ts-270-  readonly n: number;
src/ai/passPrior.ts-271-  /** Predicted corridor threat in seconds; higher = more threatened. */
src/ai/passPrior.ts:272:  readonly keyFrom: number;
src/ai/passPrior.ts:273:  readonly keyTo: number;
src/ai/passPrior.ts:274:  readonly realizedSuccess: number;
src/ai/passPrior.ts-275-}
src/ai/passPrior.ts-276-
src/ai/passPrior.ts-277-export const VALUE_ZONE_LONGITUDINAL_EDGES: readonly number[] = [-10.5, 10.5, 21];
src/ai/passPrior.ts-278-/** The sim's own overlap gate (`Match.ts`: a release counts wide past 11 m). */
src/ai/passPrior.ts-279-export const VALUE_ZONE_WIDE_METRES = 11;
--
src/ai/passPrior.ts-532-  const row = ATTEMPT_VALUE_CELL_TABLE[cell];
src/ai/passPrior.ts-533-  if (row !== undefined && row.attempts >= ATTEMPT_VALUE_BUCKET_FLOOR) return row.shotRate;
src/ai/passPrior.ts-534-  return ATTEMPT_VALUE_MARGINAL.shotRate;
src/ai/passPrior.ts-535-}
src/ai/passPrior.ts-536-
src/ai/passPrior.ts:537:export const THREAT_CALIBRATION: readonly ThreatCalibrationRow[] = [
src/ai/passPrior.ts-538-  {
src/ai/passPrior.ts-539-    quintile: 0,
src/ai/passPrior.ts-540-    n: 2019,
src/ai/passPrior.ts:541:    keyFrom: -2.017366997896862,
src/ai/passPrior.ts:542:    keyTo: 0.038622300107134966,
src/ai/passPrior.ts:543:    realizedSuccess: 0.8286280336800397,
src/ai/passPrior.ts-544-  },
src/ai/passPrior.ts-545-  {
src/ai/passPrior.ts-546-    quintile: 1,
src/ai/passPrior.ts-547-    n: 2019,
src/ai/passPrior.ts:548:    keyFrom: 0.03868202803909754,
src/ai/passPrior.ts:549:    keyTo: 0.2955869871130011,
src/ai/passPrior.ts:550:    realizedSuccess: 0.6230807330361565,
src/ai/passPrior.ts-551-  },
src/ai/passPrior.ts-552-  {
src/ai/passPrior.ts-553-    quintile: 2,
src/ai/passPrior.ts-554-    n: 2019,
src/ai/passPrior.ts:555:    keyFrom: 0.2956539813153475,
src/ai/passPrior.ts:556:    keyTo: 0.5363880087900351,
src/ai/passPrior.ts:557:    realizedSuccess: 0.5096582466567607,
src/ai/passPrior.ts-558-  },
src/ai/passPrior.ts-559-  {
src/ai/passPrior.ts-560-    quintile: 3,
src/ai/passPrior.ts-561-    n: 2019,
src/ai/passPrior.ts:562:    keyFrom: 0.5364606140899261,
src/ai/passPrior.ts:563:    keyTo: 0.805766621095352,
src/ai/passPrior.ts:564:    realizedSuccess: 0.4715205547300644,
src/ai/passPrior.ts-565-  },
src/ai/passPrior.ts-566-  {
src/ai/passPrior.ts-567-    quintile: 4,
src/ai/passPrior.ts-568-    n: 2019,
src/ai/passPrior.ts:569:    keyFrom: 0.806141904559798,
src/ai/passPrior.ts:570:    keyTo: 2.944990072437604,
src/ai/passPrior.ts:571:    realizedSuccess: 0.4314016840019812,
src/ai/passPrior.ts-572-  },
src/ai/passPrior.ts-573-];
--
scripts/probes/eds-e2b1-both-sides-ab.ts-11-//
scripts/probes/eds-e2b1-both-sides-ab.ts-12-// Staging and census below are E2a-2's and E2b-0's, reused unchanged; X5 is
scripts/probes/eds-e2b1-both-sides-ab.ts-13-// the gate that the re-derived factors are the curve E2b-0 banked.
scripts/probes/eds-e2b1-both-sides-ab.ts-14-//
scripts/probes/eds-e2b1-both-sides-ab.ts-15-// Inherited header:
scripts/probes/eds-e2b1-both-sides-ab.ts:16:// EDS E2b-0 THREAT CALIBRATION.
scripts/probes/eds-e2b1-both-sides-ab.ts-17-//
scripts/probes/eds-e2b1-both-sides-ab.ts-18-// E2a-2's fork-and-force staging, VERBATIM, plus one read-only column: what the
scripts/probes/eds-e2b1-both-sides-ab.ts-19-// E0 evaluator predicted for each candidate from the passer's own perceived
scripts/probes/eds-e2b1-both-sides-ab.ts-20-// state, before the world was forked. Censusing realized outcomes against that
scripts/probes/eds-e2b1-both-sides-ab.ts-21-// prediction turns the corridor read — which is in seconds — into a probability
--
scripts/probes/eds-e2b1-both-sides-ab.ts-45-} from '../../src/ai/perceptionSnapshot';
scripts/probes/eds-e2b1-both-sides-ab.ts-46-import { evaluatePassOption } from '../../src/ai/passOptionValue';
scripts/probes/eds-e2b1-both-sides-ab.ts-47-import type { KnownReachProfile } from '../../src/ai/reachability';
scripts/probes/eds-e2b1-both-sides-ab.ts-48-import {
scripts/probes/eds-e2b1-both-sides-ab.ts-49-  OPTION_SPACE_PRIOR_MARGINAL, OPTION_SPACE_PRIOR_TABLE, PASS_PRIOR_BANDS,
scripts/probes/eds-e2b1-both-sides-ab.ts:50:  optionSpacePriorAt, THREAT_CALIBRATION, type PassPriorRow,
scripts/probes/eds-e2b1-both-sides-ab.ts-51-} from '../../src/ai/passPrior';
scripts/probes/eds-e2b1-both-sides-ab.ts-52-import { Match } from '../../src/sim/Match';
scripts/probes/eds-e2b1-both-sides-ab.ts-53-import type { Player } from '../../src/sim/Player';
scripts/probes/eds-e2b1-both-sides-ab.ts-54-import { cloneSimulationState } from '../../src/sim/cloneState';
scripts/probes/eds-e2b1-both-sides-ab.ts-55-import { DT } from '../../src/sim/constants';
--
scripts/probes/eds-e2b1-both-sides-ab.ts-71-const BAND_TOLERANCE = 0.06;
scripts/probes/eds-e2b1-both-sides-ab.ts-72-const MARGINAL_TOLERANCE = 0.02;
scripts/probes/eds-e2b1-both-sides-ab.ts-73-const BAND_SAMPLE_FLOOR = 1200;
scripts/probes/eds-e2b1-both-sides-ab.ts-74-// E2b-0's own frozen parameters (contract §4).
scripts/probes/eds-e2b1-both-sides-ab.ts-75-const AWARENESS = 0.8; // E0's setting, so the read is the one E0 validated
scripts/probes/eds-e2b1-both-sides-ab.ts:76:const QUINTILES = 5;
scripts/probes/eds-e2b1-both-sides-ab.ts:77:const QUINTILE_FLOOR = 1200; // C1
scripts/probes/eds-e2b1-both-sides-ab.ts-78-const DISCRIMINATION_FLOOR = 0.10; // C2, 10.0pp
scripts/probes/eds-e2b1-both-sides-ab.ts-79-const CALIBRATION_TOLERANCE = 0.05; // C3, 5.0pp per quintile
scripts/probes/eds-e2b1-both-sides-ab.ts-80-const CALIBRATION_MARGINAL_TOLERANCE = 0.02;
scripts/probes/eds-e2b1-both-sides-ab.ts-81-// E2b-1's own frozen parameters (contract §4, §5).
scripts/probes/eds-e2b1-both-sides-ab.ts-82-const AB_MOMENTS = Number(process.argv[3] ?? 3000);
--
scripts/probes/eds-e2b1-both-sides-ab.ts-439-  readonly distance: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-440-}
scripts/probes/eds-e2b1-both-sides-ab.ts-441-
scripts/probes/eds-e2b1-both-sides-ab.ts-442-/** E2b-0's curve, re-derived as its two factors (contract §3, gate X5). */
scripts/probes/eds-e2b1-both-sides-ab.ts-443-interface QuintileFactors {
scripts/probes/eds-e2b1-both-sides-ab.ts:444:  readonly keyTo: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-445-  readonly reached: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-446-  readonly cleanGivenReached: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-447-  readonly composite: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-448-  readonly n: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-449-}
scripts/probes/eds-e2b1-both-sides-ab.ts-450-
scripts/probes/eds-e2b1-both-sides-ab.ts-451-const quintileOf = (
scripts/probes/eds-e2b1-both-sides-ab.ts-452-  threatSeconds: number, factors: readonly QuintileFactors[],
scripts/probes/eds-e2b1-both-sides-ab.ts-453-): QuintileFactors => {
scripts/probes/eds-e2b1-both-sides-ab.ts:454:  for (const row of factors) if (threatSeconds <= row.keyTo) return row;
scripts/probes/eds-e2b1-both-sides-ab.ts-455-  return factors[factors.length - 1];
scripts/probes/eds-e2b1-both-sides-ab.ts-456-};
scripts/probes/eds-e2b1-both-sides-ab.ts-457-
scripts/probes/eds-e2b1-both-sides-ab.ts-458-/**
scripts/probes/eds-e2b1-both-sides-ab.ts-459- * Price one candidate on the single measured axis. Every number here came from
--
scripts/probes/eds-e2b1-both-sides-ab.ts-514-interface ArmResult {
scripts/probes/eds-e2b1-both-sides-ab.ts-515-  readonly awareness: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-516-  readonly oracle: boolean;
scripts/probes/eds-e2b1-both-sides-ab.ts-517-  readonly moments: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-518-  readonly chosen: number;
scripts/probes/eds-e2b1-both-sides-ab.ts:519:  readonly realizedSuccess: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-520-  readonly classShares: Record<InfoClass, number>;
scripts/probes/eds-e2b1-both-sides-ab.ts-521-  readonly meanChosenDistance: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-522-  readonly longShare: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-523-  readonly agreesWithBrain: number;
scripts/probes/eds-e2b1-both-sides-ab.ts-524-  readonly lookPressureReadAxis: number;
--
scripts/probes/eds-e2b1-both-sides-ab.ts-682-    return {
scripts/probes/eds-e2b1-both-sides-ab.ts-683-      awareness: arm.awareness,
scripts/probes/eds-e2b1-both-sides-ab.ts-684-      oracle: arm.oracle,
scripts/probes/eds-e2b1-both-sides-ab.ts-685-      moments: acc.moments,
scripts/probes/eds-e2b1-both-sides-ab.ts-686-      chosen: acc.chosen,
scripts/probes/eds-e2b1-both-sides-ab.ts:687:      realizedSuccess: acc.chosen === 0 ? 0 : acc.wins / acc.chosen,
scripts/probes/eds-e2b1-both-sides-ab.ts-688-      classShares: { READ: share(acc.read), 'SEEN-UNREAD': share(acc.seenUnread), UNSEEN: share(acc.unseen) },
scripts/probes/eds-e2b1-both-sides-ab.ts-689-      meanChosenDistance: acc.chosen === 0 ? 0 : acc.distance / acc.chosen,
scripts/probes/eds-e2b1-both-sides-ab.ts-690-      longShare: acc.chosen === 0 ? 0 : acc.long / acc.chosen,
scripts/probes/eds-e2b1-both-sides-ab.ts-691-      agreesWithBrain: acc.chosen === 0 ? 0 : acc.agrees / acc.chosen,
scripts/probes/eds-e2b1-both-sides-ab.ts-692-      lookPressureReadAxis: acc.moments === 0 ? 0 : acc.lookRead / acc.moments,
--
scripts/probes/eds-e2b1-both-sides-ab.ts-699-const deriveFactors = (forks: readonly Fork[]): QuintileFactors[] => {
scripts/probes/eds-e2b1-both-sides-ab.ts-700-  const priced = forks
scripts/probes/eds-e2b1-both-sides-ab.ts-701-    .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
scripts/probes/eds-e2b1-both-sides-ab.ts-702-    .map((fork) => ({ fork, key: fork.read!.threatSeconds }))
scripts/probes/eds-e2b1-both-sides-ab.ts-703-    .sort((left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess);
scripts/probes/eds-e2b1-both-sides-ab.ts:704:  const size = Math.floor(priced.length / QUINTILES);
scripts/probes/eds-e2b1-both-sides-ab.ts:705:  return Array.from({ length: QUINTILES }, (_, index) => {
scripts/probes/eds-e2b1-both-sides-ab.ts-706-    const from = index * size;
scripts/probes/eds-e2b1-both-sides-ab.ts:707:    const to = index === QUINTILES - 1 ? priced.length : from + size;
scripts/probes/eds-e2b1-both-sides-ab.ts-708-    const slice = priced.slice(from, to);
scripts/probes/eds-e2b1-both-sides-ab.ts-709-    const reachedForks = slice.filter((entry) => entry.fork.outcome === 'reachedTarget');
scripts/probes/eds-e2b1-both-sides-ab.ts-710-    const spilled = reachedForks.filter((entry) => entry.fork.spilled).length;
scripts/probes/eds-e2b1-both-sides-ab.ts-711-    const reached = slice.length === 0 ? 0 : reachedForks.length / slice.length;
scripts/probes/eds-e2b1-both-sides-ab.ts-712-    const cleanGivenReached = reachedForks.length === 0 ? 0 : 1 - spilled / reachedForks.length;
scripts/probes/eds-e2b1-both-sides-ab.ts-713-    return {
scripts/probes/eds-e2b1-both-sides-ab.ts:714:      keyTo: slice.length === 0 ? 0 : slice[slice.length - 1].key,
scripts/probes/eds-e2b1-both-sides-ab.ts-715-      reached,
scripts/probes/eds-e2b1-both-sides-ab.ts-716-      cleanGivenReached,
scripts/probes/eds-e2b1-both-sides-ab.ts-717-      composite: reached * cleanGivenReached,
scripts/probes/eds-e2b1-both-sides-ab.ts-718-      n: slice.length,
scripts/probes/eds-e2b1-both-sides-ab.ts-719-    };
--
scripts/probes/eds-e2b1-both-sides-ab.ts-764-
scripts/probes/eds-e2b1-both-sides-ab.ts-765-  const oracle = arms[arms.length - 1];
scripts/probes/eds-e2b1-both-sides-ab.ts-766-  const chain = arms.slice(1).map((arm, index) => ({
scripts/probes/eds-e2b1-both-sides-ab.ts-767-    from: `${arms[index].oracle ? 'oracle' : arms[index].awareness}`,
scripts/probes/eds-e2b1-both-sides-ab.ts-768-    to: `${arm.oracle ? 'oracle' : arm.awareness}`,
scripts/probes/eds-e2b1-both-sides-ab.ts:769:    delta: arm.realizedSuccess - arms[index].realizedSuccess,
scripts/probes/eds-e2b1-both-sides-ab.ts-770-  }));
scripts/probes/eds-e2b1-both-sides-ab.ts-771-
scripts/probes/eds-e2b1-both-sides-ab.ts-772-  const exact = {
scripts/probes/eds-e2b1-both-sides-ab.ts-773-    x5Harness: harness.every((entry) => entry.reproduces),
scripts/probes/eds-e2b1-both-sides-ab.ts-774-    // The census this all rests on is still E2a-2's.
scripts/probes/eds-e2b1-both-sides-ab.ts-775-    x5CensusReproduces: census.table.every((row, index) => rowsEqual(row, OPTION_SPACE_PRIOR_TABLE[index]))
scripts/probes/eds-e2b1-both-sides-ab.ts-776-      && rowsEqual(census.marginal, OPTION_SPACE_PRIOR_MARGINAL),
scripts/probes/eds-e2b1-both-sides-ab.ts-777-    // The factors must BE E2b-0's banked curve, and must multiply back to it.
scripts/probes/eds-e2b1-both-sides-ab.ts-778-    x5FactorsReproduceCurve: factors.every((row, index) => (
scripts/probes/eds-e2b1-both-sides-ab.ts:779:      row.n === THREAT_CALIBRATION[index].n
scripts/probes/eds-e2b1-both-sides-ab.ts:780:      && Math.abs(row.composite - THREAT_CALIBRATION[index].realizedSuccess) < 1e-12
scripts/probes/eds-e2b1-both-sides-ab.ts-781-    )),
scripts/probes/eds-e2b1-both-sides-ab.ts-782-  };
scripts/probes/eds-e2b1-both-sides-ab.ts-783-  const g1 = {
scripts/probes/eds-e2b1-both-sides-ab.ts-784-    nonInferiorityChain: chain.every((step) => step.delta >= -G1_NON_INFERIORITY),
scripts/probes/eds-e2b1-both-sides-ab.ts-785-  };
--
scripts/probes/eds-e2b1-both-sides-ab.ts-819-      r2LookPressure: arms.map((arm) => ({
scripts/probes/eds-e2b1-both-sides-ab.ts-820-        arm: arm.oracle ? 'oracle' : arm.awareness,
scripts/probes/eds-e2b1-both-sides-ab.ts-821-        readAxis: arm.lookPressureReadAxis,
scripts/probes/eds-e2b1-both-sides-ab.ts-822-        bandAxis: arm.lookPressureBandAxis,
scripts/probes/eds-e2b1-both-sides-ab.ts-823-      })),
scripts/probes/eds-e2b1-both-sides-ab.ts:824:      r3EndpointLift: oracle.realizedSuccess - arms[0].realizedSuccess,
scripts/probes/eds-e2b1-both-sides-ab.ts-825-      r4Factors: factors,
scripts/probes/eds-e2b1-both-sides-ab.ts-826-      r5AgreesWithBrain: arms.map((arm) => ({
scripts/probes/eds-e2b1-both-sides-ab.ts-827-        arm: arm.oracle ? 'oracle' : arm.awareness, agrees: arm.agreesWithBrain,
scripts/probes/eds-e2b1-both-sides-ab.ts-828-      })),
scripts/probes/eds-e2b1-both-sides-ab.ts-829-    },
--
scripts/probes/eds-e2b1-both-sides-ab.ts-843-const output = { ...first, deterministic, sha256 };
scripts/probes/eds-e2b1-both-sides-ab.ts-844-if (!deterministic) output.verdict = 'FAIL';
scripts/probes/eds-e2b1-both-sides-ab.ts-845-console.log(JSON.stringify(output, null, 2));
scripts/probes/eds-e2b1-both-sides-ab.ts-846-console.error(
scripts/probes/eds-e2b1-both-sides-ab.ts-847-  `EDS-E2b-1 ${output.verdict} · X5 ${output.exact.x5Harness}/${output.exact.x5CensusReproduces}/${output.exact.x5FactorsReproduceCurve}`
scripts/probes/eds-e2b1-both-sides-ab.ts:848:  + ` · success ${output.arms.map((a) => (a.realizedSuccess * 100).toFixed(1)).join('/')}`
scripts/probes/eds-e2b1-both-sides-ab.ts-849-  + ` · chain ${output.chain.map((c) => (c.delta * 100).toFixed(1)).join('/')}`
scripts/probes/eds-e2b1-both-sides-ab.ts-850-  + ` · long share ${output.arms.map((a) => (a.longShare * 100).toFixed(1)).join('/')}`
scripts/probes/eds-e2b1-both-sides-ab.ts-851-  + ` · perf ${output.perf.off.usPerStep.toFixed(2)}→${output.perf.on.usPerStep.toFixed(2)}µs`
scripts/probes/eds-e2b1-both-sides-ab.ts-852-  + ` · SHA ${sha256}`,
scripts/probes/eds-e2b1-both-sides-ab.ts-853-);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,501p' docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E3 — The co-evolution audit

Status: **RUN 2026-07-25 — ⛔ FAIL on five gates; the fork returns to the
commander (§6).** Pre-registered under commander ruling #10.5 (gates from the
design contract §3 (E3) and §4), approved to run as-is by ruling #11.2, and
run with every §3 gate untouched. X4 — the reproduction gate the stage rested
on — passed absolutely; the equilibrium did not absorb the bundle. Nothing
shipped.

Date: 2026-07-25

## 1. What E3 is, and the scope fact that shapes it

E3 is the last stage before the user's eyes. Everything before it ran
**dormant**: E0–E2b-1R built and validated an evaluator, a prior, an exchange
rate and a perception layer, and every one of them was measured either in a
probe world or through `forcedPassTarget`. Nothing has ever chosen a pass
inside a live match.

**So E3's first act is a build, not a run.** The bundle cannot be audited under
evolution until the passer's choice is a live consumer, because sealed evo runs
are ordinary matches — there is no probe standing beside them to compute a
choice and force it. That build is the last dormant-to-live step in the whole
slice, and it is why E3 carries the §2 equilibrium band that C1-B broke.

Ruling #10.4 already fixed the expectation this must be judged against: the
evaluator agrees with the live brain **only 38–47% of the time even under
omniscience**, so it is a genuinely different chooser. **E3 must expect play to
change.** The question is never "did anything move" — things will move — but
**"did the change stay in band, and did the ecology absorb it".**

## 2. The bundle, and what turns on

```text
edsTouchCost           E1b's honest speed-dependent control curve
edsPerceivedDefence    the defender's interception entry on its own ball percept
edsPerceivedChoice     NEW — the passer chooses via the evaluator, from his own
                       snapshot, over EXECUTABLE options, on the measured
                       probability axis (E2b-0's curve / band / marginal)
```

All three default **off**. E3 ships nothing: E4 is the ship gate.

### 2.1 The live chooser (the new build)

At the one point the brain has already decided to pass, the target is chosen by
the E2b-1R pricing rather than by `bestMate`'s lane score — same three
information classes, same measured axis, same executable-only rule (ruling #8
(l): a man you cannot aim at cannot be kicked to, however well he prices).
`observeBall`'s consumption-scoping principle binds here too: the passer needs
a full snapshot, but only at the moment he is actually choosing, so the
materialise-on-demand split E2b-1R built is what keeps this affordable.

**Reproduction gate before anything else:** with the flag on and the world
otherwise untouched, the chooser's per-moment selections on E2b-1R's own
staging must be **identical to E2b-1R's logged choices**. If the live consumer
does not reproduce the probe that validated it, the probe validated something
else.

## 3. Frozen gates

### EXACT

```text
X1 fingerprint 57b0bdab…c673 unchanged with all three flags off
X2 tsc + build clean · full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
X4 LIVE-CONSUMER REPRODUCTION: flag-on choices identical, per moment per arm,
   to E2b-1R's banked choices on the same staging
X5 perf: the full bundle within 1.25× / p95 1.50× of flags-off, interleaved
```

### §2 EQUILIBRIUM BAND (hard abort — C1 §4 verbatim, the gate C1-B broke)

8-season paired calibrate, seed `20260702`, against the frozen baseline
`goals 2.3944 · crosses 2.4894 · headers 9.1039 · long balls 6.2042 ·
cutbacks 3.8151`:

```text
goals/match        within ±15%        2.0352 .. 2.7536
crosses            within ±25%        1.8671 .. 3.1118
headers won        within ±25%        6.8279 .. 11.3799
long balls         within ±25%        4.6532 .. 7.7553
cutbacks           within ±25%        2.8613 .. 4.7689
```

C1-B broke this on goals (−15.37%) and long balls (+28.18%) with a *one-sided*
touch cost and a speed-blind evaluator. The whole EDS thesis is that the bundle
is what makes the same cost survivable, so this is the thesis' own test.

### BEHAVIOURAL CONTRACT SUITE (the three C1-B broke)

```text
aerial.test.ts   "wide teams cross more" — must NOT invert (C1-B: 28 → 21)
stamina.test.ts  "a full match SPENDS the tank"
freeAgents.test.ts / market
```

A suite test that encodes old touch numbers and fails is **a finding to report,
not something to re-baseline** (C1-B §12.4, verbatim).

### NO-STRICT-DOMINANCE (the E0 canary, now live)

```text
power usage must stay SITUATIONAL: the share of passes played at the highest
power must be  <= 80%  and  >= 20%  across the sealed runs
```

E0 measured that a cost-free world teaches always-heavy (safest = 1.15 in
52/52). E1b's canary sized the cost at 6.53pp against power's 21.2pp threat
benefit and explicitly did **not** settle dominance — it flagged it as a live
risk for exactly this gate. The 20/80 band is the operational form of
"situational".

### CO-EVOLUTION RESTORATION

```text
sealed fresh evo, >= 10 seasons, both sides under the bundle:
  defence adapts — the attacking advantage at generation 1 must SHRINK by
  generation 10 (the vision/positioning precedent: a one-sided read inflates
  goals until the other side co-evolves)
  style diversity NOT collapsed — the nameplate/style spread must not fall
  below 60% of the flags-off run's spread
```

### Reported, never gated

```text
R1 route mix under evolution, against S3b's collapse signature
R2 the always-heavy rate over generations — dominance forming or dissolving
R3 look-pressure in live play (the future gaze consumer's workload)
R4 how far the live chooser diverges from the old lane-score chooser
```

## 4. Stop rules

* **X4 fails** → the live consumer is not the thing E2b validated. Fix the
  consumer, never the probe, and re-run.
* **§2 band breaks** → honest revert of the whole bundle, per the design
  contract §5 and the four-revert lesson: treat drift as structural, not
  tunable. Report which dimension broke; ablation diagnostics (bundle minus one
  component) are authorised **only** to name the failing component, never as a
  partial ship.
* **No-strict-dominance fails** → the cost is too weak against the benefit,
  exactly as E1b's canary warned. Report; do not strengthen the curve to rescue
  the gate — that is fitting a constant to a symptom.
* **Co-evo restoration fails** → the bundle is a one-sided upgrade after all,
  which is the vision-attr saga repeating. Report to the commander.
* **Nothing ships from E3.** Flags stay default-off. Ship is E4, and **E4 is
  the user's play-test — the queue stops there.**

## 5. Implementation registrations (executor, BEFORE any result)

Ruling #11.2 approved §3 to run **as pre-registered — no gate changes**, and
none are made below. What follows is the operational form of predicates that
§3 states in words, written down before the run and before any number was
seen, per ruling #7.2's boundary (instrument/harness definitions in their own
commit, with the rationale, disclosed in the result). Every one is reported
with its parts so the commander can re-judge on the same numbers.

**(a) NO-STRICT-DOMINANCE is measured as the EVALUATOR's preference, not as a
played share — and the reason is structural.** The live game has no power
chooser: `Match.performPass`'s `powerChoice` argument has no production caller
(`Match.ts:775` — "every live caller omits it"), C1-C was deferred into this
slice, and E2b-0/E2b-1/E2b-1R priced power 1.0 only, so the calibration curve
this bundle chooses on cannot price a power. "The share of passes PLAYED at
the highest power" therefore has no live quantity behind it: it is 0% or 100%
by construction depending on whether 1.0 counts as "the highest", and a
predicate that cannot come out any other way is the structurally-undecidable
kind PROBE-CONTRACTS' sixth threshold type forbids. What E0's canary and
E1b's canary both actually measured is the EVALUATOR's preference (E0: "the
per-state safest option was 1.15 in 52/52"; E1b: "predicted touch-cost spread
3.95 → 6.53pp"), and §3's own stop rule reads the same way ("the cost is too
weak against the benefit, exactly as E1b's canary warned"). So at every live
pass moment the bundle prices its own chosen target at the substrate's three
powers (`PASS_POWER_MIN` 0.85 / 1.0 / `PASS_POWER_MAX` 1.15) and the gate is
the share of moments whose preferred power is the highest: **≥20% and ≤80%**,
exactly the frozen band. The joining rule, fixed here before results:

```text
price(power) = quintilePrice(threat(power)) × (1 − touchFail(power)) / (1 − touchFail(1.0))
```

At power 1.0 this is exactly the choice axis, so nothing is double-counted at
the reference point; away from it, the measured corridor axis is scaled by the
relative first-touch survival the E1a-certified formula predicts at flag-ON
strength (ruling #9.3 (c)'s decomposition). The per-power threat seconds,
touch-fail priors and prices are all REPORTED, so any other joining rule can
be applied to the same numbers afterwards. The played share is also reported,
for completeness: it is 100% at power 1.0, because nothing plays anything else.

**(b) X4's operational form.** E2b-1R banked aggregates, not a per-moment
choice log, so X4 is run as both halves of the same claim: (i) the live
consumer and a verbatim copy of E2b-1R's own pricing/argmax run side by side
on every moment of every arm, and must agree on **every one**; (ii) with the
live consumer doing the choosing, all seven of E2b-1R's banked aggregate
families must come back **bit-identical at full float precision** over the
same 3,000 moments × 4 arms, forks and all — the same standard E2b-1R's own
B1 gate used. One adaptation, disclosed: the reference copy prices a READ
option at `THREAT_CALIBRATION[q].realizedSuccess` rather than re-deriving
`reached × cleanGivenReached` from a 14,678-fork census E2b-1R already banked
and whose X5 pinned the two equal to <1e-12; any consequence would surface as
a per-moment disagreement or a broken bit-identity. Scope: X4 runs on
E2b-1R's staging, which advances the memory chain every tick; the live match
advances it at BRAIN CADENCE (the cadence E2's design gate names, and the one
E2b-1R's own live defence path uses), so X4 certifies the CHOOSER, and how far
live play diverges from the probe's chooser is reported as R4.

**(c) The candidate WINDOW is truth-measured (v1 scope boundary).** The 6–30 m
window is E0's censused window and the only range any prior in `passPrior.ts`
was measured over. It is enumerated on true positions, exactly as every E2b-*
probe enumerated it: the window decides which options EXIST, while the price
and the executable rule are perceived. Registered beside ruling #11.3's aiming
registration so nobody later claims more honesty than v1 delivers.

**(d) No executable option → the legacy choice stands, and the rate is
reported.** When the passer can see nobody he could honestly aim at, the
chooser returns null (it never invents an aim point) and v1 leaves the legacy
lane-score target in place rather than suppressing a pass the action layer has
already committed to — the seam is target choice only. This is an
informational leak in the blind direction and it is therefore MEASURED and
reported (`chosenGid = -1` in the trace), not hidden.

**(e) CO-EVOLUTION RESTORATION's operational form.** Two sealed 10-season evo
runs on the same league seed (424242), bundle ON and flags OFF, paired
generation by generation. The "attacking advantage" is the goals/match
difference ON − OFF at each generation; the gate is that its ABSOLUTE size
over the last three generations is smaller than over the first three (a
three-generation mean each side, because one 71-match generation is noisy).
Style diversity: at the final generation, distinct coach nameplates and the
mean entropy of the three style-share distributions, each **≥60%** of the
flags-off run's own value.

**(f) How the bundle is armed for a league or a test suite.** `League.matchFlags`
(a probe surface, not serialized, empty in production — the same pattern as
`sackingEnabled`) and an `EDS_BUNDLE=1` environment switch read once at module
load in `Match.ts` (the same pattern as `formations.ts`'s `EMERGENT_POS`), so
the behavioural contract suite can run under the bundle without every test
learning about a dormant slice. Unset ⇒ every flag off ⇒ the shipped world,
pinned by `tests/perceivedPassChoice.test.ts` and by X1's fingerprint.

**(g) The behavioural contract suite is run with `EDS_BUNDLE=1`** over the
three named files, and over the full suite for information; suite failures are
reported as findings, never re-baselined (C1-B §12.4).

## 6. RESULT — ⛔ FAIL (2026-07-25). The build reproduces; the world does not absorb it

`scripts/probes/eds-e3-coevolution-audit.ts`, world SHA
**`e667f476…dc73`**, world-deterministic across two invocations with perf
reported beside the hash (X3's corrected scheme). **Nothing shipped**: all
three flags stay default OFF, and the production fingerprint is
`57b0bdab…c673`, measured after the build.

The frozen run was executed twice, before and after the wiring fix §6.10
discloses. Every world field except the newly added ablation block is
**byte-identical between the two** (verified field for field; the first run's
SHA was `4b4cf985…532e`, and it differs only because the ablation section
joined the output). So the fix — which only mattered when the choice flag ran
WITHOUT the defence flag — provably did not touch a single audited number.

**Verdict: FAIL on five gates.** Per §4 and the design contract §5 the queue
stops and the fork returns to the commander. No gate was touched, no
component was tuned, and no partial ship exists in either direction.

### 6.1 What PASSED — and the one that matters most

```text
X4  live-consumer reproduction   ✓  0 disagreements in 10,292 per-moment
                                    comparisons (3,000 moments x 4 arms), and
                                    ALL SEVEN of E2b-1R's banked aggregate
                                    families bit-identical at full float
                                    precision: realized success, long share,
                                    mean chosen distance, brain agreement,
                                    class shares, look-pressure x2, chosen counts
X4  fork-and-force harness       ✓  3/3 bit-identical (E2a-2's gate, still holding)
X1  fingerprint, flags off       ✓  57b0bdab...c673 unchanged
X2  tsc + build + suite          ✓  clean, clean, 744/744 (10 new contract tests)
X3  world determinism            ✓  identical across two invocations, perf outside
X5  perf p95                     ✓  1.320x of flags-off (budget 1.50x)
--  flags-off inertness          ✓  armed-false == not-armed, tick for tick;
                                    empty perception memory; empty trace
--  trace inertness              ✓  the instrument moves nothing (same signature)
--  cheap ball path (X6)         ✓  still field-for-field identical
--  §2 band baseline arm         ✓  reproduces the frozen baseline to 4 dp on all
                                    five dimensions (goals 2.3944, crosses 2.4894,
                                    headers 9.1039, long balls 6.2042, cutbacks
                                    3.8151) => the harness is the same procedure
                                    C1-B's band was frozen from
```

**The live consumer IS the thing E2b validated.** That was the open question
this stage carried, and it is answered without an asterisk: the same
arithmetic, the same choices, moment for moment, and the aggregates come back
to the last digit. Everything below is about what the WORLD does with it.

### 6.2 §2 EQUILIBRIUM BAND — BROKEN on two dimensions

8-season paired calibrate, seed `20260702`, 568 matches per arm:

```text                        baseline     bundle     delta      band
goals/match                   2.3944     2.0458    -14.56%    ±15%   ✓ (edge)
crosses/match                 2.4894     2.0775    -16.55%    ±25%   ✓
headers won/match             9.1039    11.8750    +30.44%    ±25%   ✗ BREAK
long balls/match              6.2042     9.0088    +45.20%    ±25%   ✗ BREAK
cutbacks/match                3.8151     3.6162     -5.21%    ±25%   ✓
tackles/match                12.2077    11.4613     -6.1%     (no gate)
miscontrols/match             6.9771     9.7447    +39.7%     (no gate)
pass completion               71.29%     69.39%    -1.90pp    (no gate)
```

**This is C1-B's signature, larger.** C1-B (touch cost alone, speed-blind
evaluator) went goals −15.4% / long balls +28.2%. The bundle — whose entire
thesis was that a *seeing* evaluator makes the same cost survivable — goes
goals −14.6% / long balls **+45.2%** / headers **+30.4%**. Goals stayed
(just) inside the band this time; the re-route did not.

### 6.3 NO-STRICT-DOMINANCE — FAIL at 17.4%, on the ANTI-dominance side

30,656 live pass moments, each priced at 0.85 / 1.0 / 1.15 (§5 (a)'s
registered instrument):

```text
preferred power share      lightest 49.47%   middle 33.11%   heaviest 17.42%
gate                       heaviest must be >= 20% and <= 80%        ✗ FAIL
mean corridor threat (s)   0.2494 / 0.1119 / 0.0433   (pace buys the corridor)
mean touch-fail prior      0.0757 / 0.1008 / 0.1297   (pace costs the receiver)
mean joined price          0.6545 / 0.6870 / 0.6860
```

Two diagnostics, reported not gated, that shape how this should be read:

* **`lowestThreatIsHighestPower` = 97.86%** — E0's canary shape reproduces
  exactly: more pace still buys a safer corridor almost always. What breaks
  always-heavy is E1b's touch cost, which is the bundle working as designed.
* **`sameQuintileShare` = 49.43%** — in half of all moments the three powers
  land in the SAME threat quintile, so the corridor axis (a five-step
  function) cannot distinguish them and the smooth touch term decides by
  construction. That granularity is a property of my registered instrument,
  not of the world, and it biases this statistic toward the lighter power.

So the failure is not "the game learned always-heavy" — the distribution is
49/33/17, arguably the most situational outcome available — it is that the
frozen band's LOWER edge rejects it. Reported as it fired; the reading is the
commander's.

### 6.4 CO-EVOLUTION RESTORATION — FAIL, and style diversity halves

Paired sealed evo, seed `424242`, 10 generations, bundle ON vs flags OFF:

```text
goals/match advantage (ON - OFF) by generation
 -0.141  0.000  +0.676  +0.113  -0.113  +0.239  -0.493  -0.014  +0.465  +0.437
first three mean  +0.178      last three mean  +0.296      shrinks?  ✗ NO
style spread at generation 10
  distinct nameplates    16 vs 16          ratio 1.000   ✓
  mean style entropy     0.2768 vs 0.5574  ratio 0.497   ✗ FAIL (floor 0.60)
always-heavy share by generation
 0.183 0.175 0.190 0.188 0.203 0.212 0.223 0.216 0.234 0.212  (drifting UP)
```

The advantage series swings ±0.5 goals generation to generation on 71 matches
each, so the shrink test is underpowered as posed — but it did not shrink even
directionally, and the **style finding is not noise**: formation-identity
entropy is nearly halved under the bundle while every club still carries a
distinct nameplate. The ecology keeps its labels and loses its variety. That is
the vision-attr saga's shape, not its magnitude, and it is exactly what this
gate exists to catch.

### 6.5 X5 PERF — FAIL at 1.322x mean (p95 passes)

```text
flags off        5.1540 us/step   p95  8.083 us
full bundle      6.8151 us/step   p95 10.666 us
ratio            1.3223x (budget 1.25x)  ✗ FAIL     p95 1.3196x (1.50x)  ✓
(the first run measured 1.3220x / 1.3030x on the same world — the clock moved,
 the world hash did not, which is X3's corrected scheme doing its job)
```

Diagnosis, not a fix: E2b-1R got perception to **1.069x** by having the sim's
only percept consumer (the defender's ball read) build a ball and nothing
else. A CHOOSER reads bodies, so the choice flag switches that body's memory
chain back to the full scan — same cadence, same honesty, but the squad loop
returns. The truth buffer is already refilled in place rather than allocated,
so what is left is the scan itself. The consumption-scoping lever that remains
is WHO needs bodies: only a player who might be asked to pass, which is a much
smaller set than "every outfield body every brain tick". Per ruling #10.3's
codified principle the redraw computes less, never perceives less — and per
E2b-1's stop rule the budget does not move.

### 6.6 Behavioural contract suite under `EDS_BUNDLE=1`

```text
aerial.test.ts    "wide teams cross more"   28 -> holds     ✓  (C1-B INVERTED it)
freeAgents.test.ts / market                 5/5 pass        ✓  (C1-B broke it)
stamina.test.ts   "a full match SPENDS the tank"            ✗  0.9626 vs < 0.93
```

Two of the three contracts C1-B broke now HOLD under the bundle — the crossing
inversion and the market both survive, which is the bundling thesis paying off
where C1-B failed. Stamina breaks the same way it broke then (less ground
running to do). Reported as a finding, not re-baselined (C1-B §12.4).

### 6.7 Reported, never gated

```text
R1 route mix        chosen-option long share 19.06%, mean chosen distance 13.07 m
                    — the CHOICE distribution is E2b-1R's (18.05% / 13.41 m); the
                    long-ball explosion is downstream MECHANICS, not the chooser
                    picking long. S3b's collapse signature does not reproduce.
R2 always-heavy     0.183 -> 0.212 across 10 generations (§6.4)
R3 look-pressure    read axis 6.21%, band axis 3.62% of live pass moments
R4 divergence       62.23% of live choices differ from the lane-score brain
                    (dormant measurement said 38-47% agreement — consistent)
R5 no-executable    4.09% of traced moments had no executable option and kept the
                    legacy choice (§5 (d)'s registered leak, measured)
class shares live   READ 90.80% · SEEN-UNREAD 0.08% · UNSEEN 9.13%
```

**R1 is the sharpest diagnostic in this run.** The chooser's own output
distribution is indistinguishable from what E2b-1R banked dormant — it is not
choosing long balls. The +45% long balls and +30% headers appear anyway,
because more spilled first touches means more loose ball, and loose ball is
what the rest of the game turns into aerial route. C1-B's lesson, restated
with the evaluator no longer speed-blind: **the re-route was never the
evaluator's fault.**

### 6.8 Disclosures

* The §5 registrations (a)-(g) were committed before the run, in `b99c8a8`.
* Two canary diagnostics (`sameQuintileShare`,
  `lowestThreatIsHighestPowerShare`) were added AFTER a 1-season shakedown and
  BEFORE the frozen run, reported never gated, exactly to expose the
  instrument granularity that shapes §6.3. Harness-only, per ruling #7.2's
  boundary.
* The ablation in §4's authorised sense (bundle minus one component, to NAME
  the failing component) is recorded in §6.9. It is a diagnostic and never a
  partial ship.
* A vitest worker RPC timeout ("Timeout calling onTaskUpdate") appeared once
  while the X4 probe was saturating the machine; every test passed, and it did
  not reproduce on a quiet re-run. Final suite state: **744/744**, tsc clean,
  build clean, fingerprint `57b0bdab…c673` re-measured after the fix.

### 6.9 ABLATION — the failing component is the TOUCH COST, and the both-sides read is what SAVES the equilibrium

§4's authorised diagnostic, same 8-season staging, deltas against the same
frozen baseline (`t` = touch cost, `d` = perceived defence, `c` = perceived
choice):

```text
arm                       t d c   goals    crosses  headers  longBalls cutbacks  misctrl
FULL BUNDLE               1 1 1  -14.56%  -16.55%  +30.44%   +45.20%   -5.21%    9.74
minus touch cost          0 1 1   +2.20%   -8.91%   -0.43%    +8.06%   -4.75%    7.63  <= IN BAND, all five
minus perceived choice    1 1 0   -8.16%   -4.31%  +25.80%   +28.58%   +5.77%    9.19
minus perceived defence   1 0 1  -20.22%   -9.33%  +13.11%    +3.89%   -8.86%    9.83
touch cost only           1 0 0  -15.37%   +0.85%  +23.23%   +28.18%   +4.43%    9.38  <= C1-B, exactly
perceived choice only     0 0 1  -21.69%   -2.33%  +11.60%    +6.90%  -14.54%    7.40
```

Three things fall out, and they are the most useful output of this whole stage:

1. **The aerial re-route is the touch cost's, not the chooser's.** Take the
   touch cost out and headers/long balls come home (−0.43% / +8.06%); leave it
   in alone and they are the C1-B numbers to the decimal (+23.23% / +28.18%).
   The bundle's own thesis was that a speed-SEEING evaluator would make this
   cost survivable. It does not: the chooser sees the cost, prices it, and the
   long balls still arrive — because they were never a decision. More spilled
   first touches means more loose ball, and loose ball becomes aerial route
   downstream of every decision layer. **C1-B's diagnosis is confirmed and
   sharpened: the re-route is mechanical, and bundling does not fix it.**
2. **Perception on BOTH sides really does restore the balance it breaks.** The
   chooser alone costs 21.7% of the goals; add the defender reading his own
   ball and the same world lands at **+2.20%** — inside every band. That is
   co-evolution visible in one line, and it is the S3b/vision-attr lesson
   passing rather than failing.
3. **`minus touch cost` (0 1 1) is a §2-clean bundle.** It is not a partial
   ship and this stage does not propose one — the design contract forbids it
   in both directions, and E1b's curve is a measured substrate truth that a
   band failure does not un-measure. But it is the commander's most obvious
   redraw axis, and it now has numbers.

### 6.10 A DEFECT IN MY BUILD, caught by the ablation and disclosed

The first ablation run returned `perceived choice only` reproducing the
baseline **exactly** on all five dimensions — a dead flag, not a null result.
Cause: `Match.step` refreshed a body's percept only `if (this.edsPerceivedDefence)`,
so with the choice flag alone no memory chain existed, `perceivedSnapshot`
returned null, and the legacy lane-score chooser played every pass. The gate
condition is now `edsPerceivedDefence || edsPerceivedChoice`, and
`tests/perceivedPassChoice.test.ts` pins the isolated flag (it must trace
choices and must NOT reproduce the plain match).

What it did and did not affect: every gated arm in §6.2–§6.7 runs the FULL
bundle, where the defence flag is on, so the audited world is byte-identical
before and after the fix (verified above). Only the ablation arms with `d 0`
moved — which is why §6.9's table is from the corrected run, and why the first
ablation's `1 0 1` and `1 0 0` rows were identical to each other.

The lesson worth keeping: **an ablation arm that reproduces the baseline to the
digit is evidence about the harness, not about the world.** It is the cheapest
dead-flag detector this programme has found, and it belongs in any future
bundle audit.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,432p' docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md; sed -n '1,249p' docs/world-model/EDS-E3R2-NARROW-REAUDIT.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E3R — the revised-bundle audit (touch cost out of v1)

Status: **RUN 2026-07-25 — ⛔ FAIL on two gates of twenty-eight; the fork
returns to the commander (§5).** Drafted and run by the autonomous session
under commander ruling #12.4, constraints (a)–(f), gates untouched. The
equilibrium HOLDS without the touch cost — §2 band in on all five dimensions,
dominance in band, co-evolution restoration passing, the chain reproducing
bit-identically. What fails: style-diversity entropy by 2.03pp (H2 stands by
the letter, its mechanism refuted by all three discriminators, and the gate's
statistic inverts on a second seed) and perf mean at 1.3238×. Nothing shipped.

Date: 2026-07-25

## 1. What changed, and what did not

E3 measured the v1 thesis and refuted it: the §2 band break is MECHANICAL
(spill → loose ball → aerial route), the chooser never chose it (R1: long
share 19.06% live vs 18.05% dormant), and the §4 ablation showed the same
bundle **minus the touch cost** sitting inside every band. Ruling #12 took
touch cost out of the v1 live set and re-seated it to a future C5-coupled
slice; E1b's curve stays banked dormant.

**The v1 live bundle is now `edsPerceivedChoice` + `edsPerceivedDefence` +
the evaluator.** `edsTouchCost` is not armed in any gated arm of this audit.

Nothing else moves. Every gate family below is E3's, verbatim, and the
ablation numbers are NOT a pass — ruling #12.3 says so explicitly, and this
contract exists because a diagnostic arm is not an audit.

### 1.1 Premise correction on constraint (a), disclosed before the run

Constraint (a) says the banked E2b-1R choices "were priced with the flag-ON
touch factor", so E3R must re-bank them flag-off-honest. **They were not.**
Verified in the probes themselves: `heavyTouchCost` and `edsTouchCost` appear
in none of `eds-e2a2-option-space-census.ts`, `eds-e2b0-threat-calibration.ts`,
`eds-e2b1-both-sides-ab.ts` or `eds-e2b1r-consumption-scoped.ts`. The chain is
flag-off throughout:

* the option-space census forked worlds with `edsPerceivedDefence` only;
* E2b-0's calibration read outcomes from those same flag-off forks;
* E2b-1/1R priced a READ option from the census composite — never from the
  `mirroredTouchFailChance` formula — so the E1b curve could not enter the
  price even in principle;
* `src/ai/perceivedPassChoice.ts` (the live consumer) likewise prices the
  composite, so its price is flag-INDEPENDENT. Only the E3 canary consumed
  the flagged curve, and only to report power preference.

So ruling #12's "the evaluator prices the world AS IT IS — never phantom
costs" was already satisfied on the pricing side; what was inconsistent in E3
was the WORLD (touch ON) against a calibration measured with touch OFF, and
removing touch cost from v1 repairs exactly that.

**(a) is therefore executed as a PROOF obligation, not a re-measurement**: the
reference staging is re-run with the pricing path declared flag-off, and it
must reproduce E2b-1R's banked aggregates bit-identically, with G1 and G2
re-verified on that re-banked reference before X4R chains to it. If the
re-bank ever moved a digit, the premise correction would be wrong and this
stage would stop — so the claim is tested, not asserted.

## 2. The build E3R needs (constraint (d))

The only new code is a perf lever, and it may not change one perceived value:

1. **Candidate-scoped materialisation at pass-commit** (the ruling's named
   lever): the snapshot built at a pass decision carries the bodies the
   pricing actually reads — the passer, his candidates, and the opponents the
   corridor read scans — instead of every remembered body.
2. **Allocation-free memory advance**: the scan writes into the stored
   observation in place rather than allocating a fresh record per observed
   body per scan. Same scan cadence, same visibility rule, same keyed error,
   same retention: cheaper because it allocates less, never because it
   perceives less.

Both are pinned by the bit-identity gates below (C1/X4R would break instantly
if either changed a percept), and by `tests/observeBall.test.ts`'s existing
honesty pin. Honesty is frozen: scan cadence, FOV, retention and keyed error
may not move. **Budget stays 1.25× / p95 1.50×; a miss is reported, never
shaved** (ruling #12.4 (d)).

## 3. Frozen gates

### C1 — CHAIN FIRST: the re-banked choice reference (constraint (a))

```text
C1a the reference chooser, pricing declared flag-off, reproduces E2b-1R's
    banked aggregates BIT-IDENTICALLY at full float precision — all seven
    families (realized success, long share, mean chosen distance, brain
    agreement, class shares, look-pressure x2, chosen counts)
C1b G1 re-holds on the re-banked reference: the realized-success chain across
    awareness arms is non-inferior, every step >= -2.0pp
C1c G2 re-holds: the 0.8 arm's long-option share within +-25% relative and
    mean chosen distance within +-15% relative of the oracle arm
C1d the fork-and-force harness still replays reality on all three seeds
```

### X4R — the live consumer chains to THAT reference

```text
X4Ra per-moment identity: the live consumer's choice equals the re-banked
     reference's choice on EVERY moment of EVERY arm (3,000 x 4)
X4Rb with the live consumer choosing, the same seven families come back
     bit-identical to the banked numbers
```

### EXACT (E3's, verbatim)

```text
X1 fingerprint 57b0bdab...c673 unchanged with every flag off
X2 tsc + build clean, full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
X5 perf: the v1 bundle within 1.25x mean / 1.50x p95 of flags-off, interleaved
-- flags-off inertness, trace inertness, cheap-ball-path identity
```

### §2 EQUILIBRIUM BAND (C1 §4 verbatim, unchanged tolerances)

8-season paired calibrate, seed `20260702`, against the frozen baseline
`goals 2.3944 · crosses 2.4894 · headers 9.1039 · long balls 6.2042 ·
cutbacks 3.8151`; goals ±15%, the other four ±25%. The paired baseline arm
must reproduce those five numbers to 4 dp, as it did in E3.

### NO-STRICT-DOMINANCE (constraint (e), purpose documented)

```text
the share of pass moments whose preferred power is the HIGHEST must be
  <= 80%   guards the always-heavy pathology E0 measured in a cost-free world
  >= 20%   guards degenerate never-heavy, which would be a MISPRICING symptom
```

Instrument unchanged from E3 §5 (a) — the evaluator's preferred power at every
live pass moment, joined by
`quintilePrice(threat) x (1 - touchFail(power)) / (1 - touchFail(1.0))`, with
every part reported. **Registered expectation (constraint (e)): the
distribution shifts HEAVIER than E3's 49/33/17, because the touch term now
uses the shipped curve (span 8, weight 0.07) instead of E1b's (16 / 0.24).**
E3's granularity diagnostics (`sameQuintileShare`,
`lowestThreatIsHighestPowerShare`) are reported again.

### CO-EVOLUTION RESTORATION + STYLE (constraint (c))

Paired sealed 10-generation evo, seed `424242`, bundle vs flags off:

```text
CE1 the goals/match advantage (bundle - flags off) must SHRINK in absolute
    size from the first three generations to the last three
CE2 style: distinct coach nameplates AND mean style-share entropy at the final
    generation, each >= 60% of the flags-off run's own value
```

**The two style hypotheses, pre-registered (ruling #12.4 (c)):**

* **H1 — touch-flattening.** E3's entropy collapse (0.497) was downstream of
  the touch cost: a mechanically noisier ground game rewards fewer distinct
  identities. *Prediction:* without the curve, entropy recovers to ≥60% ⇒ CE2
  passes, H1 confirmed, the question is CLOSED and benign.
* **H2 — genome-blind chooser.** The evaluator prices pure measured
  probability, so it may have removed the seat through which tactical genes
  expressed style: whatever a club's genome says about how it wants to pass,
  every club now picks the same measured-best option. *Prediction:* entropy
  stays <60% even without the curve ⇒ **CE2 fails, H2 stands, and the fork
  returns to the commander** for a designed PREFERENCE SEAT (genes modulating
  evaluator weights as priced choices — the two-engines junction), never a
  tuning knob. Per the user's standing instruction, H2 holding returns here
  even if nothing else fails.

Two diagnostics discriminate the mechanism, REPORTED never gated, measured
identically in both arms so they are comparable:

```text
D1 cross-club spread (population std dev) of per-club long balls/match and
   crosses/match over the 8-season band arms — does the bundle flatten how
   differently clubs play?
D2 Pearson correlation of a club's long-ball rate with its coach genome's
   passBias and attackingWidth, both arms — does the genome still express?
D3 bundle arm only: cross-club spread of the CHOSEN option distance and long
   share from the choice trace — the chooser's own club-to-club variety
```

A second evo seed (`515151`) runs both arms as a REPORTED robustness check on
CE2's direction; it is not a gate, and CE1/CE2 are judged on `424242`.

### BEHAVIOURAL CONTRACT SUITE (constraint (f))

```text
aerial.test.ts     "wide teams cross more" must not invert
stamina.test.ts    "a full match SPENDS the tank" — RE-TESTED on the revised
                   bundle: it broke under E3's bundle (0.9626 vs < 0.93) and
                   the touch cost is the obvious suspect, since less ground
                   running follows fewer completed ground passes
freeAgents.test.ts / market
```

Run with `EDS_BUNDLE=1` (which now arms choice + defence only). A break is a
finding to report, never a re-baseline (C1-B §12.4).

## 4. Stop rules

* **C1 or X4R fails** → the chain is broken: fix the consumer or report the
  premise correction as wrong. Never touch the reference.
* **§2 band breaks** → the revised bundle is not survivable either; report
  which dimension, no tuning, back to the commander.
* **CE2 fails** → H2 stands: the fork returns to the commander for the
  preference-seat design. Do not invent a gene→weight mapping here.
* **Dominance or CE1 fails** → report as fired, no instrument change after
  results.
* **X5 misses** → report; no honesty shaving and no budget move.
* **Nothing ships from E3R.** Flags stay default-off. Ship is E4 — the user's
  play-test — and only on a full PASS.

## 5. RESULT — ⛔ FAIL on two gates (2026-07-25). The equilibrium HOLDS; style and perf do not

`scripts/probes/eds-e3r-revised-bundle-audit.ts`, world SHA
**`655a98b9…9d59`**, world-deterministic across two invocations with perf
reported beside the hash. Fingerprint `57b0bdab…c673` unchanged with every
flag off; suite 744/744; nothing shipped.

**26 of 28 gates pass.** The two that do not: **style diversity** (entropy
ratio 0.5797 against a 0.60 floor — H2 stands by the letter of the gate) and
**perf mean** (1.3238× against 1.25×). Per §4 and the user's standing
instruction, both the non-PASS and H2 standing return the fork to the
commander.

### 5.1 C1 — the premise correction is PROVEN, and the chain holds

```text
C1a re-bank vs E2b-1R's banked aggregates   7/7 families BIT-IDENTICAL
C1b G1 non-inferiority chain                ✓ every step >= -2.0pp
C1c G2 long share / mean distance           ✓ / ✓ vs the oracle arm
C1d fork-and-force harness                  ✓ 3/3 bit-identical
X4R live consumer vs the re-banked reference  0 disagreements / 10,292
```

Constraint (a) asked for a re-bank because the reference was believed to carry
flag-ON touch pricing. §1.1 said it did not; **the re-bank moved not one digit,
which is the proof.** The pricing path is flag-independent by construction, and
now says so explicitly in the code the gate runs (`heavyTouchCost: false`).

### 5.2 §2 EQUILIBRIUM BAND — ALL FIVE DIMENSIONS IN BAND

8-season paired calibrate, seed `20260702`, 568 matches per arm; the baseline
arm again reproduces the frozen numbers to 4 dp:

```text                        baseline     bundle     delta      band
goals/match                   2.3944     2.4472     +2.20%    ±15%   ✓
crosses/match                 2.4894     2.2676     -8.91%    ±25%   ✓
headers won/match             9.1039     9.0651     -0.43%    ±25%   ✓
long balls/match              6.2042     6.7042     +8.06%    ±25%   ✓
cutbacks/match                3.8151     3.6338     -4.75%    ±25%   ✓
miscontrols/match             6.9771     7.6250     +9.3%     (no gate)
pass completion               71.29%     70.24%     -1.05pp   (no gate)
tackles/match                12.2077    12.6778     +3.9%     (no gate)
```

**This is ruling #12's diagnosis, confirmed by a full audit rather than a
diagnostic arm.** E3's break was +30.44% headers / +45.20% long balls; take the
mechanical tax out and the same information layer leaves the game's route mix
essentially where it found it. Goals move +2.20% — the perceived chooser and
the perceived defender very nearly cancel, which is what the ablation predicted
(−21.69% alone → +2.20% together).

### 5.3 NO-STRICT-DOMINANCE — PASS at 21.86%, and the registered expectation held

```text
preferred power share    lightest 45.85%   middle 32.29%   heaviest 21.86%  ✓ (20-80)
E3, under E1b's curve    lightest 49.47%   middle 33.11%   heaviest 17.42%  ✗
mean corridor threat     0.2634 / 0.1253 / 0.0548 s
mean touch-fail prior    0.0645 / 0.0798 / 0.0940
sameQuintileShare        48.01%      lowestThreatIsHighestPower  97.81%
always-heavy by generation  0.211 0.222 0.220 0.195 0.220 0.208 0.209 0.222 0.206 0.217
```

Constraint (e) registered that the distribution would shift heavier under the
shipped touch curve, and it did, by 4.4pp — into the band. The share is also
stable across ten generations (0.195–0.222), so this is not a knife-edge pass.

### 5.4 CO-EVOLUTION RESTORATION — PASS: the advantage decays by 90%

```text
goals/match advantage (bundle - flags off) by generation
 -0.014  +0.070  +0.803  +0.352  -0.042  -0.479  -0.676  -0.141  +0.014  +0.211
first three mean  +0.2864      last three mean  +0.0282      shrinks?  ✓ YES
```

The defence adapts: whatever edge the perceived chooser opens early is nearly
gone by generation 10. This is the gate the vision-attr saga failed four times.

### 5.5 STYLE DIVERSITY — ⛔ FAIL by 2.03pp, and the discriminators refute H2's mechanism

```text
                          bundle    flags off   ratio    floor
distinct nameplates          16         16      1.000    0.60   ✓
mean style-share entropy   0.3231     0.5574    0.5797   0.60    ✗  (E3: 0.4966)
```

So **CE2 fails and H2 stands by the letter** — and the pre-registered
diagnostics say its proposed MECHANISM is not what is happening. H2 says the
evaluator is genome-blind and removed the seat through which tactical genes
expressed style. All three discriminators point the other way:

```text                                   bundle    flags off    H2 predicts
D1 cross-club long-ball spread (band)    1.9772     1.6837      NARROWER
D1 cross-club long-ball spread (evo)     1.5045     1.3434      NARROWER
D1 cross-club cross spread (band)        0.4863     0.5204      NARROWER
D2 corr(long balls, passBias) (band)    -0.2223    -0.1222      TOWARD 0
D2 corr(long balls, passBias) (evo)     -0.6235    -0.5767      TOWARD 0
D2 corr(crosses, width) (band)           0.2186    -0.0032      TOWARD 0
D3 cross-club spread of CHOSEN distance  0.5968 m     n/a       ~0
D3 cross-club spread of CHOSEN long share  3.32pp     n/a       ~0
```

Clubs play MORE differently from each other under the bundle, the genome
expresses MORE strongly in route rates, and the chooser itself varies club to
club by 0.6 m of mean chosen distance. A genome-blind chooser produces none of
that.

⚠️ **And the gate's own statistic does not survive a second seed.** The
pre-registered robustness run (seed `515151`, both arms, reported never gated):

```text
mean style-share entropy at generation 10   bundle 0.2388   flags off 0.1559
ratio                                        1.5321  — the bundle is MORE diverse
distinct nameplates                          16 vs 16
```

One seed says 0.58, the other says 1.53. A single final-generation entropy on
16 clubs is dominated by which handful of coaches happened to survive; as a
gate it has almost no power, which is PROBE-CONTRACTS' sixth threshold type
applied to an ecology statistic. **The verdict stands as it fired — no
predicate is rewritten after results** — but the commander should read "H2
stands" as "this gate could not answer the question", not as evidence for a
genome-blind chooser, which D1/D2/D3 refute directly.

### 5.6 X5 PERF — ⛔ FAIL at 1.3238× mean (p95 1.3113× passes)

```text
flags off        5.2045 us/step   p95  8.167 us
v1 bundle        6.8898 us/step   p95 10.709 us
ratio            1.3238x (budget 1.25x)  ✗      p95 1.3113x (1.50x)  ✓
```

Constraint (d)'s named lever was implemented, and so was a second one:

```text
E3, eager full chain + full materialisation          1.4211x  (isolated bench)
+ candidate-scoped materialisation at pass-commit    1.3225x
+ allocation-free memory advance (in-place records)   ~1.32x   (within noise)
  ball-only percept, for reference (E2b-1R's world)   ~1.05x
```

**Where the cost actually is, measured:** not allocation, and not the
materialise step — those are now nearly free. It is the honest per-observation
math itself: five keyed-noise channels plus a body-turn `cos`/`sin` per
observed body per scan, ~13 observations per step once every outfield body
keeps a body-level chain. Two things were tried and rejected on the spot:
`Math.sqrt(x*x+y*y)` for `Math.hypot` (**bit-different in 38% of 3M samples**
— that is a perceived-value change, not an optimisation), and squared-distance
early-outs in the visibility test (identical decisions except at a tie, where
a rare divergence would be indistinguishable from a bug).

**The one honest lever left, costed but NOT built** (it needs a commander
ruling because it makes a semantics choice): *deferred reconstruction*. A
body's percept at time T depends only on scans inside its retention window
(≤60 ticks), and the scan clock is already maintained by the O(1) ball path —
so keep the ball path for everyone, record a per-tick ring buffer of body
truth, and REPLAY a body's in-window scans only when a consumer actually reads
them. That is ~40× fewer observations per step, with identical values by
construction. The wrinkle the commander must rule on: a per-tick truth frame
sees all observers in a tick reading the same world state, whereas today's
mid-decide-loop refresh lets a restart taker's heading change land between two
observers. The probe staging that validated the chooser observes at the START
of a tick, so the ring buffer is arguably CLOSER to the validated semantics —
but it is a change in what "the moment I looked" means, and that is not an
executor's call. Per (d): reported, nothing shaved, budget untouched.

### 5.7 Behavioural suite (constraint (f)) — the stamina break is NOT the touch cost

The E3R contract named the touch cost as "the obvious suspect". That was a
belief, and it is now measured and WRONG:

```text
same stamina staging (seeds 11/42, neutral squads), full-time mean stamina
flags off                      0.9160899895418604   PASS (gate < 0.93)
perceived choice only          0.9308032191132962   BREAK
perceived defence only         0.9128440227961777   PASS
v1 bundle (choice + defence)   0.9696581256351910   BREAK
E3 bundle (+ touch cost)       0.9625876531614549   BREAK
```

`aerial.test.ts` "wide teams cross more" holds; `freeAgents.test.ts` 5/5 holds.
**Stamina breaks on the perception bundle itself, and slightly worse than under
E3's bundle.** The mechanism is coherent and is a genuine finding rather than a
brittle constant: honest perception makes the game CALMER — a defender who
reads his own ball commits later, and a passer who prices options picks the
better-supported ball more often, so there is simply less sprinting after loose
balls. The contract's substance is that a full match must SPEND the tank; at
0.9697 the tank is barely touched and the fatigue economy is decorative again.
Reported, not re-baselined (C1-B §12.4). Note the headroom: flags-off sits at
0.9161 against a 0.93 gate, so this staging had 1.4pp of slack and the bundle
spends it.

### 5.8 Reported, never gated

```text
R1 route mix        chosen long share 19.25%, mean chosen distance 13.07 m
                    (E2b-1R dormant: 18.05% / 13.41 m) — the chooser's own
                    distribution is stable across every world it has run in
R3 look-pressure    read axis 6.59%, band axis 3.78% of live pass moments
R4 divergence       61.14% of live choices differ from the lane-score brain
                    (evo arms 59.56%) — a genuinely different chooser
R5 no-executable    4.04% of traced moments kept the legacy choice (§5 (d) of
                    the E3 contract: the registered blind-direction leak)
class shares live   READ 91.07% · SEEN-UNREAD 0.06% · UNSEEN 8.88%
canary stability    highest-power share 0.195-0.222 across ten generations
```

### 5.9 Disclosures

* §1.1's premise correction was committed BEFORE the run (`c1e65ce`) and is now
  proven by C1a's seven bit-identical families.
* The perf levers changed `src/ai/perceptionSnapshot.ts` (in-place observation
  records, one shared visibility distance, optional materialisation scope).
  Value-preservation is not asserted: C1a's re-bank, X4R's 10,292 identical
  choices, `tests/observeBall.test.ts` and the flags-off inertness gate all run
  through that code.
* `materialisePerceptionSnapshot` now COPIES vectors out of memory. That is
  required by the in-place scan — a snapshot holding references would have
  mutated under its reader — and it changes no value.
* The stamina attribution in §3 ("the touch cost is the obvious suspect") was
  a pre-run belief; §5.7 replaces it with a measurement. The belief was never
  a gate.
* One vitest worker RPC timeout appeared while the audit saturated the machine;
  all 744 tests passed and it did not reproduce quietly.
# EDS E3R2 — the narrow re-audit: CE2R + X5R2

Status: **RUN 2026-07-26 — ✅ PASS, all 29 gates.** Drafted and run by the
autonomous session under commander ruling #13.5, gates untouched. Perception is
PULL and provably the same perception; style diversity holds ecologically with a
median entropy ratio of **1.5253** across five fresh seeds; perf lands at
**1.1977×** inside a 1.25× budget. E3R's 26 banked results transfer, and P3
proves it: 17 of 17 live numbers bit-identical. **The queue advances to E4 —
the user's play-test — and stops there.** Nothing shipped; flags remain
default-off. Scope is exactly the two gates E3R failed, in
the honest forms ruling #13.2 and #13.3 gave them. **The 26 banked E3R
results transfer**, and the equivalence pins below are what make that
transfer rigorous rather than assumed.

Date: 2026-07-25 (drafted) · 2026-07-26 (run)

## 1. Scope — narrow, by ruling

```text
CE2R  style diversity, gated ECOLOGICALLY: the MEDIAN style-share entropy
      ratio across FIVE fresh sealed-evo seeds >= 0.60, with H2's own three
      mechanism discriminators as CO-GATES
X5R2  lazy perception reconstruction ("perception is PULL", ruling #13.3):
      field-for-field snapshot equivalence lazy-vs-eager under a perpetual
      test, B1-style choice identity against E3R's banked live numbers, and
      the unchanged 1.25x / 1.50x budget
```

Nothing else is re-run and nothing else may be widened. `edsTouchCost` stays
out of the v1 live set; the v1 bundle is `edsPerceivedChoice` +
`edsPerceivedDefence` + the evaluator, exactly as E3R audited it.

## 2. X5R2 — what "perception is PULL" is, in code

Ruling #13.3 registers the semantics: **a body knows what its scans would have
shown, materialised at the moment it acts.** The keyed-noise design is what
makes that safe — an observation is a pure function of
`(seed, observer, entity, tick)` and the truth at that tick, so computing it
later yields the same number it would have had. What changes is WHEN the
computation happens, never WHAT is known.

The build:

1. The **ball** percept keeps its existing eager O(1) path at brain cadence —
   the defender's interception entry reads it every tick it thinks, and that
   path is E2b-1R's, untouched. It also drives the scan clock.
2. At each brain tick, if that body's scan clock fires, the sim records the
   **body truth of that scan moment** into a small per-observer ring (a frame:
   tick + every body's pos/vel/bodyDir/sentOff). Recording a frame costs ~70
   number writes; running ten observations costs five keyed-noise channels and
   a `cos`/`sin` per observed body, which is the cost E3R could not pay.
3. When a body is **asked** (the one pass-commit per decision where the chooser
   runs), its in-retention frames are replayed through the unchanged
   scan/visibility/error/retention code, then proprioception is written from
   the current tick exactly as the eager path writes it, and the snapshot is
   materialised (candidate-scoped, as E3R already does).

Ring capacity is set from the substrate: retention is at most 60 ticks and the
scan interval at least 6, so at most 11 frames can be in window; the ring holds
16. The frame recorded is the truth **at that body's own scan moment**, which is
why the equivalence below is exact rather than approximate — a per-tick shared
frame would differ whenever a restart taker's heading turns between two
observers inside one decide loop (`bodyDir` IS `heading`, `Player.ts:50`).

**Registered boundary (ruling #13.3):** pull semantics is what ships in v1. A
future consumer that must react AT the instant of seeing — an unpolled, push
style event — has to revisit this seat explicitly; it cannot be bolted onto a
pull chain.

## 3. Frozen gates

### X5R2 — the reconstruction must BE the perception

```text
P1 PERPETUAL EQUIVALENCE (the X6 pattern, a committed test, every commit):
   over a synthetic truth sequence x awareness {0.2, 0.5, 0.8, 1.0}, the
   snapshot materialised from the LAZY path is field-for-field identical to
   the snapshot from the EAGER path, at every brain tick of the sequence —
   gid, side, pos, vel, bodyDir, observedTick, ageTicks, ball, and the
   player set itself
P2 IN-SIM EQUIVALENCE: over 3 live match seeds, eager and lazy produce
   identical world signatures AND identical choice traces (per moment: chosen
   gid, class counts, price, distance, look-pressure flags, power canary)
P3 B1 CHOICE IDENTITY vs E3R's banked live numbers, at full float precision:
   the §2 band bundle arm's five dimensions (goals 2.4472... crosses...),
   the trace aggregates (divergence 0.6114409240498161, no-executable
   0.040403727669587296, class shares, mean chosen distance, long share) and
   the dominance share 0.21861863803919032 must come back UNCHANGED
X5 PERF: the v1 bundle within 1.25x mean / 1.50x p95 of flags-off, interleaved
X1 fingerprint 57b0bdab...c673 unchanged with every flag off
X2 tsc + build clean, full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
```

A pin breaking means the reconstruction is not the perception: **fix the
reconstruction, never the pin, and never widen the scope** (ruling #13.5).

### CE2R — style diversity, gated ecologically

Five **fresh** sealed-evo seeds, pre-registered here and never chosen after a
result: `700101, 700202, 700303, 700404, 700505`. Each seed runs both arms
(v1 bundle and flags off), 10 generations, paired.

```text
CE2R  median over the five seeds of (bundle entropy / flags-off entropy)
      at the final generation  >=  0.60
CO-GATES — H2's own three discriminators, whose directions E3R measured and
ruling #13.2 accepted as refuting the genome-blind mechanism:
  M1  median over seeds of (bundle cross-club long-ball spread
      - flags-off spread)  >=  0        (clubs must not play MORE alike)
  M2  median over seeds of (|corr(long balls, passBias)| bundle
      - |corr| flags off)  >=  0        (the genome must not express LESS)
  M3  median over seeds of the chooser's cross-club chosen-distance spread
      >  0                              (the chooser must be club-dependent)
```

Reported, never gated: per-seed entropy and nameplate ratios, per-seed CE1
(the advantage shrink, which E3R already passed and which transfers), the
per-seed discriminator values, and E3R's own two seeds (`424242` = 0.5797,
`515151` = 1.5321) beside the five so the spread of this statistic is on the
record.

**Median, not mean, and the reason is pre-registered:** a final-generation
entropy is a small-sample ecology statistic with a heavy tail (E3R's two seeds
differ by 2.6x), and ruling #13.2 asked for the ecological form of the claim —
"a typical world keeps its variety", not "the average of five worlds does".

## 4. Stop rules

* **Any P-pin fails** → the lazy path is not the eager perception. Fix the
  reconstruction; the pin never moves, the scope never widens.
* **X5 still misses** → report; no honesty shaving, no budget move. The seat
  is then the commander's again.
* **CE2R median < 0.60** → this is a real diversity problem rather than a
  mis-typed gate, and it returns to the commander (the preference-seat fork
  that ruling #13.2 closed would then reopen on evidence).
* **A co-gate fails** → H2's mechanism is live after all; report and return.
* **Nothing ships from E3R2.** Flags stay default-off; E4 is the user's
  play-test, and the queue stops there on a PASS.

## 5. RESULT — ✅ PASS (2026-07-26). Pull perception is the same perception; the ecology keeps its variety

`scripts/probes/eds-e3r2-narrow-reaudit.ts`, world SHA **`3cbb8b8c…456f`**,
world-deterministic across two invocations with perf reported beside the hash.
Fingerprint `57b0bdab…c673` unchanged with every flag off; tsc + build clean;
suite **751/751** (11 new pins across two files). Nothing shipped.

### 5.1 X5R2 — the reconstruction IS the perception

```text
P1 perpetual equivalence (tests/lazyPerception.test.ts)   7/7 tests green
   lazy vs eager snapshots field-for-field identical at every brain tick,
   awareness 0.2 / 0.5 / 0.8 / 1.0 — gid, side, pos, vel, bodyDir,
   observedTick, ageTicks, ball and the player set itself
P2 in-sim identity, eager vs lazy, seeds 700001/2/3
   world signature  IDENTICAL 3/3      choice trace  IDENTICAL 3/3
P3 B1 identity vs E3R's banked live numbers   17 / 17 BIT-IDENTICAL
   (five band dimensions, miscontrols, pass completion, divergence,
   no-executable share, mean chosen distance, long share, look-pressure x2,
   dominance share, three class shares)
X5 perf   4.4685 -> 5.3520 us/step   mean 1.1977x (budget 1.25x)  ✓
                                      p95  1.1529x (budget 1.50x)  ✓
-- flags-off inertness, trace inertness, cheap-ball-path identity     ✓ ✓ ✓
```

**P3 is what makes ruling #13.5's transfer rigorous rather than assumed.** Every
live number E3R banked comes back unchanged to the last digit under the pull
implementation, so E3R's §2 band (goals +2.20%, crosses −8.91%, headers −0.43%,
long balls +8.06%, cutbacks −4.75%), its dominance share (21.86%) and its
reported statistics are properties of the v1 bundle, not of how perception was
scheduled.

**The perf story ends where ruling #10.3's principle said it would.** E3's eager
scheme cost 1.32–1.38×; the same perception, computed when it is asked instead
of when it could be, costs **1.1977×**. Nothing about what a body can see moved:
scan cadence, FOV, retention and keyed error are untouched, and P1/P2 are the
proof rather than the promise.

⚠️ **One measured difference, pinned rather than buried** (companion test in
`tests/lazyPerception.test.ts`): pulled BETWEEN brain ticks — which no live
consumer does, since the chooser runs inside the decide call — the pull path is
*up to date* where the eager path is *as of its last call*. Two consequences,
both one-directional: the body's own proprioception reads now (continuous
proprioception is the eager path's own documented rule), and retention has
forgotten anything now out of window. The pull never holds a body the eager
path lacks, and every shared entry is identical, so it is never better
informed. This is the seat ruling #13.3's registered boundary names: a future
PUSH consumer must revisit it explicitly.

### 5.2 CE2R — style diversity holds, and E3R's 0.58 was the low tail

Five fresh sealed-evo seeds, both arms, 10 generations each:

```text
seed      entropy bundle / flags off    ratio      M1       M2      M3
700101         0.2864 / 0.3679         0.7786   -0.088   +0.135   0.454
700202         0.5963 / 0.3910         1.5253   +0.095   -0.064   0.651
700303         0.2654 / 0.0779         3.4053   +0.461   +0.303   0.487
700404         0.4876 / 0.3326         1.4659   -0.287   +0.174   0.285
700505         0.6799 / 0.3537         1.9225   +0.044   +0.425   0.409

MEDIAN entropy ratio        1.5253   (floor 0.60)                       ✓
MEDIAN nameplate ratio      1.0000   (16 of 16 clubs distinct, every seed) ✓
M1 clubs not more alike     +0.0441  (median, floor 0)                  ✓
M2 genome not weaker        +0.1736  (median, floor 0)                  ✓
M3 chooser club-dependent    0.4538  (median, must exceed 0)            ✓
reference — E3R's own seeds: 424242 = 0.5797,  515151 = 1.5321
```

**Four of the five fresh seeds sit ABOVE 1.0**: under the v1 bundle a typical
world ends up with *more* style variety than the same world without it, not
less. The lowest fresh seed (0.7786) still clears the floor comfortably. Ruling
#13.2's reading is confirmed by measurement: E3R's 0.5797 was one draw from a
heavy-tailed ecology statistic, and the single-seed gate was mis-typed rather
than reporting a diversity problem. **The preference-seat fork stays closed.**

All three mechanism discriminators pass on the median as well, so the pass is
not a chooser that has quietly flattened how clubs play: clubs' route rates
spread slightly WIDER, the genome expresses more strongly in those rates, and
the chooser's own mean chosen distance varies club to club by ~0.45 m.

⚠️ **Reported honestly, though CE1 is banked and not gated here (ruling
#13.1):** across these five fresh seeds the advantage-shrink statistic holds on
only **2 of 5** (700101 and 700505). The per-seed paired goal delta is itself
seed-noisy and mostly NEGATIVE under this bundle (the bundle usually scores
slightly fewer goals, e.g. −0.141 → −0.014, −0.033 → −0.263), so "the
attacking advantage decays" rests on the single seed E3R measured. Nothing here
contradicts the banked result and no gate is affected — but if the commander
ever wants CE1 to carry weight in a ship decision, it needs the same
multi-seed treatment CE2 just got. The reason it does not block E4: there is no
attacking runaway to restore FROM — the deltas hover around zero in both
directions rather than inflating.

### 5.3 Disclosures

* P1's first implementation polled every 5 ticks and failed on the observer's
  own entry. The FROZEN predicate (§3) says "at every brain tick of the
  sequence", so the test was wrong and was corrected to the contract; the
  difference it found is now pinned by its own companion test rather than
  deleted (§5.1).
* The lazy path is the default and the eager one is retained as the pinned
  reference behind `Match.edsEagerPerception` — a probe surface, off in
  production.
* Constraint-scope: E3R2 ran only the two gates ruling #13.5 authorised, plus
  the inertness pins. The C1/X4R staging was NOT re-run; P3's bit-identity is
  the transfer mechanism the ruling named, and the probe staging never touched
  the live perception path.
* One vitest worker RPC timeout appeared while the audit saturated the machine
  and did not reproduce on a quiet re-run (751/751 clean, twice).

[35m[3mcodex[0m[0m
A high-severity pattern is now clear: several “confirmations” are deterministic reruns of the same seed set that selected the redesign. For example, E3R’s five equilibrium numbers are numerically identical to E3’s already-inspected “minus touch cost” ablation. That verifies implementation consistency, but it is not fresh confirmatory evidence and cannot erase the selection step. I’m checking whether the E5 chain repeats the same issue in its calibration and attribution gates.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,260p' docs/world-model/EDS-E5-VALUE-AXIS.md; sed -n '261,570p' docs/world-model/EDS-E5-VALUE-AXIS.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E5 — The value axis (the other half of the decision)

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#15.3**, which authorised E5 with four constraints (a)–(d) and named its
central hypothesis. Nothing here may be tuned after first sight of results.

Date: 2026-07-26

## 1. Why this stage exists

E4 round 1 is the reason, and the user's eyes named it before any probe did:
*"什么配合都打不出来"*. The measurement behind that impression, same seed, two
seasons, flags-off vs the v1 bundle:

```text
third-man releases   10.014 → 6.437   −35.7%
overlap releases      0.176 → 0.056   −68.0%
forward-pass share   58.56% → 53.47%  −5.1pp
shots                 13.47 → 12.66    −6.0%
longest pass chain     5.88 → 6.62    +12.7%   (circulate, don't progress)
```

Ruling #15.2 indicted the mechanism in code, and it is **not** a perception
failure. The E3 seam replaced WHO receives and left WHETHER/WHY on the legacy
score, so the licence and the delivery are granted by two different judges: the
legacy pass loop carries the whole tactical layer (2过1 return ×1.15+, third-man
×1+passBias·0.3·thirdManW, overlap release ×1.3+width·0.6, the ×0.55
anti-back-pass penalty) and all of it only ever shaped `bestMate`; the perceived
chooser then overrides the target with `argmax P(clean reception)`. The overlap
runner earns the pass, the ball goes to the safest man.

The deeper reading, which is what this stage acts on: **the measured axis is
half a decision.** Football wants P(success) × WHAT THE BALL IS WORTH THERE.
E0 refused a scalar by design and rulings #8/#9 forbade invented weights, so the
chooser is progression-blind BY CONSTRUCTION and the safest recycle wins every
tie.

The honest repair is not to re-add hand-tuned bonuses. It is the move E2b-0
already made for the corridor read, applied to the value half: **measure the
exchange rate, never invent the weight.**

## 2. What is measured

### 2.1 E5a — the V-census

E2a-2's fork-and-force staging, **reused verbatim** (which is also E2b-0's
staging, verbatim), with the follow extended past the reception to record WHAT
HAPPENED NEXT. Sets frozen identically to both predecessors — **A = seeds
700,000+, B = 710,000+, 4,500 moments each** — which is what makes X5b below a
real reproduction gate rather than a similarity claim.

**The value outcome, frozen (ruling #15 (a) names three candidates; this stage
gates on the first and reports the other two):**

```text
PRIMARY   shot by the passing team within 240 ticks (4.0 s) of the kick,
          the follow stopping early when the phase leaves 'playing'
REPORTED  progression: ball localX at follow end − at the kick, attack frame
REPORTED  goal by the passing team inside the same window
```

240 ticks is `FOLLOW_TICKS`, the constant this staging already uses — long
enough for receive-and-shoot and for receive-pass-shoot (the combination the
user is missing), short enough that the shot still belongs to this pass. The
dead-ball stop is deliberate: a move that ends in a throw-in produced no shot,
and following through the restart would credit this pass with a corner-kick
goal.

**V's key, frozen: the RECEPTION ZONE** — the candidate's position at the
decision moment (not at arrival: the passer prices what he can see NOW, exactly
as the distance band already works), in the passing team's attack frame:

```text
longitudinal (Team.localX, metres, pitch half-length 31.5)
  Z0  < −10.5      own third
  Z1  −10.5..10.5  middle third
  Z2  10.5..21     attacking third, outer half
  Z3  >= 21        attacking third, inner half
lateral
  C   |y| < 11     central
  W   |y| >= 11    wide
```

Thirds are football's own division, not an invented cut; the attacking third is
halved because that is where the shot gradient is steepest and the sample is
densest; **11 m is the sim's own overlap gate** (`Match.ts:1155`, the constant
that decides whether an overlap release counts), so the wide band is the one the
game already believes in. 8 cells.

**The two factors and their composition, pre-registered exactly (ruling #15
(b), no residual hand weights):**

```text
P̂(option)  = the E3R chooser's price, unchanged
             READ        → THREAT_CALIBRATION quintile (E2b-0)
             SEEN-UNREAD → option-space band prior at the perceived distance
             UNSEEN      → option-space marginal
V̂(option)  = P(shot within 240 ticks | the intended man received CLEANLY),
             measured per zone cell over this census
             seen target → the cell his perceived position falls in
             UNSEEN      → the V marginal (he cannot know where the man is)
score      = P̂ × V̂
```

This product is not a weighting scheme. P̂ estimates P(clean reception) and V̂
estimates P(shot | clean reception, zone), so **P̂ × V̂ estimates one thing the
world can be asked directly**: P(clean reception AND a shot within the window).
Gate V4 asks it directly and compares. That is the whole anti-hand-weight
argument, and it is a measurement, not an assertion.

**Circularity, registered honestly (ruling #15 (a)):** V is measured under
legacy-brain play, exactly as E2a-2's and E2b-0's tables were. A pass into Z3
is worth what it is worth *given how these players then behave*. Sufficient for
v1; if E5b's own audit says the composed chooser has moved play far enough that
the table no longer describes its own world, that is a finding and it returns to
the commander — never a quiet re-census.

### 2.2 E5b — the live composition and the narrow audit

The composed price becomes live behind a **third flag, `edsValueAxis`, default
OFF**, armed only with the other two. A separate flag (rather than folding the
change into `edsPerceivedChoice`) is what keeps the E3R/E2b-1R ablation
available and makes gate X4V below possible.

Then the narrow audit ruling #15 (d) ordered: §2 band + dominance + perf pins +
the watchability instruments — and, ruling #15 (c), the central hypothesis.

## 3. Authorised seat

* New probes `scripts/probes/eds-e5a-value-census.ts`,
  `scripts/probes/eds-e5b-value-axis-audit.ts`.
* `src/ai/passPrior.ts` — the V table added as committed data beside the three
  tables already there.
* `src/ai/perceivedPassChoice.ts` — the composition, behind the flag.
* `src/sim/Match.ts`, `src/sim/League.ts` — the `edsValueAxis` flag only.
* One new perpetual test file for the composition pins.
* **No other `src/**` change.** With the flag off every path is the E3R2 one,
  bit for bit; fingerprint unchanged; zero production callers.

## 4. Frozen gates — E5a

### EXACT

```text
X1  production fingerprint 57b0bdab…c673 unchanged
X2  tsc + build clean · full suite green
X3  two invocations byte-identical                    shared SHA-256
X4  zero live callers (audited)
X5a harness: forcing the brain's own target replays the match bit-identically
    on all three harness seeds (E2a-2's gate, verbatim)
X5b REPRODUCTION — the reception-outcome census must reproduce E2a-2's banked
    option-space table EXACTLY, field by field, table and marginal, AND the
    threat quintiles must reproduce THREAT_CALIBRATION exactly. The staging and
    seeds are identical and only a longer follow was added, so anything else
    means the follow perturbed what came before it — which is impossible in a
    deterministic forward simulation, and therefore a defect in me
X6  the committed V table equals this run's census
```

### V1 — COVERAGE

```text
every zone cell   >= 400 clean receptions per set to be GATED
under-sampled cells are REPORTED, priced at the V marginal, never merged after
seeing results
```

400 is the floor at which a shot rate near 0.12 has SE ≈ 1.6pp, i.e. the cell is
a measurement rather than a rumour. The expected mean is ≈1,000 per cell
(≈8,000 clean receptions over 8 cells), so the floor should bind only on Z3-W.

### V2 — DISCRIMINATION (interval test, powered ex ante)

```text
| best gated cell − worst gated cell |  >= 5.0pp
```

The sign is reported, not gated (ruling #8 (j)'s lesson). What is gated is that
*where the ball arrives changes what happens next at all* — a value table that
does not discriminate is not a value table, and the composition would be
multiplying by a constant. At n ≈ 1,000 per cell and p ≈ 0.12 the SE of the
difference is ≈1.5pp, so 5.0pp is ≈3.4σ.

### V3 — HELD-OUT CALIBRATION (interval test)

```text
per gated cell   | V_A − V_B |  <= 5.0pp        (≈2.3σ at n ≈ 1,000)
marginal         | V_A − V_B |  <= 1.5pp
```

### V4 — COMPOSITION CALIBRATION (the anti-hand-weight gate)

Every playable fork is scored P̂ × V̂ *before* its outcome is known, binned into
quintiles of that score, and compared with the conjunction the product claims to
estimate — clean reception AND a shot within the window:

```text
V4a discrimination   | top quintile − bottom quintile | of the realized
                     conjunction rate                        >= 4.0pp
V4b calibration      | mean predicted score − realized conjunction rate |
                     <= 5.0pp per quintile, <= 2.0pp on the marginal
V4c coverage         every quintile n >= 1,200
```

**Which set V4 is judged on, settled before implementation:** V4 is GATED on
set A (its own census, as E2b-0 gated discrimination on A), and the identical
computation is run on **set B scored with set A's table** and reported as the
held-out companion. Both are decided here, before any code and any result.

**Which position keys the table, settled before implementation:** the table is
built on the candidate's TRUE decision-moment position, and the live consumer
looks it up with his PERCEIVED position — exactly the arrangement the distance
band already has (E2a-2 measured true distance; the chooser prices perceived
distance). The table describes the world; the reader reads it with what he
knows.

4.0pp: E2b-0 gated 10.0pp on a rate near 0.56; the conjunction rate here is
≈4× smaller, so the scaled-precedent floor is ≈2.1pp and 4.0pp sits above it.
At n ≈ 2,900 per quintile and p ≈ 0.12 the SE of the difference is ≈0.85pp, so
4.0pp is ≈4.7σ. **V4b is the gate that decides whether the product rule is a
measurement**: if the two factors were not conditionally independent given their
keys, the product would systematically mis-predict the conjunction and the
composition would need a weight — which this stage would then refuse to invent.

### Reported, never gated (E5a)

```text
R1  the V table itself, per cell, both sets
R2  progression per cell (metres) and goal-within-window per cell — the two
    rival value definitions ruling #15 (a) named, so any other composition can
    be applied to these same numbers later
R3  the unconditional shot-within-window rate per composed quintile (the looser
    question the conjunction gate deliberately does not ask)
R4  what V is worth against what P is worth: the spread P̂ alone achieves on
    the conjunction vs the spread V̂ alone achieves, same forks — E2b-0's R2
    move applied to the value half
R5  how often the composed argmax would differ from the P-only argmax at the
    same moments (the size of the change E5b is about to make, measured before
    it is made)
R6  the chosen-subset value: what the live brain's own choices are worth on the
    V axis vs the option space — the value-half analogue of E2a-2's +18.62pp
```

## 5. Frozen gates — E5b

### EXACT

```text
Y1  fingerprint 57b0bdab…c673 unchanged (flag default OFF)
Y2  tsc + build clean · full suite green, new pins included
Y3  the audit's world signatures identical across two invocations, with perf
    reported beside them (E2b-1R's scheme — a perf number may not be hashed)
Y4V FLAG-OFF IDENTITY — with `edsValueAxis` off, the chooser reproduces E3R's
    banked live numbers exactly: X4's 10,292 per-moment comparisons at 0
    disagreements and all seven E2b-1R aggregate families bit-identical
Y5  COMPOSITION PIN (perpetual test): on a fixed synthetic snapshot the composed
    price equals P̂ × V̂ to the last bit for each information class, and with the
    flag off equals P̂ exactly
```

### §2 EQUILIBRIUM BAND (C1 §4 verbatim, as every stage since)

```text
seed 20260702, 8 seasons, paired arms
goals      ±15%      of 2.3944
crosses    ±25%      of 2.4894
headers    ±25%      of 9.1039
long balls ±25%      of 6.2042
cutbacks   ±25%      of 3.8151
and the flags-off arm must reproduce those five baselines to 4 dp
```

### NO-STRICT-DOMINANCE

```text
preferred-highest-power share  20% <= share <= 80%
```

Unchanged from E3R, where it passed at 21.86%. V is power-independent by
construction (a zone does not move with pass weight), so the canary's joining
rule is untouched; the gate is kept because the composition changes WHICH
options reach the canary.

### H — THE CENTRAL HYPOTHESIS (ruling #15 (c))

Three arms on the band staging, paired, same League seed, **24 seasons** (≈1,700
matches per arm — E4 round 1 saw 2 seasons, and the overlap counter at 0.176 per
match needs the length before a ratio means anything):

```text
arm 0  flags off                              the reference
arm 1  perceived choice + perceived defence    the v1 bundle E4 round 1 played
arm 2  arm 1 + edsValueAxis                    this stage
```

Measured value REPRODUCES combination play without the hand-coded bonuses. All
four must hold, on arm 2 against arm 0:

```text
H1  third-man releases    >= 0.85 x flags-off       (E4 r1 bundle: 0.643x)
H2  overlap releases      >= 0.70 x flags-off       (E4 r1 bundle: 0.318x)
H3  forward-pass share    >= flags-off − 2.0pp      (E4 r1 bundle: −5.1pp)
H4  shots                 >= 0.97 x flags-off       (E4 r1 bundle: 0.940x)
```

Every threshold closes **50–60% of the gap E4 round 1 measured** (H1 60%, H2
56%, H3 61%, H4 50%) — deliberately one consistent standard, derived from the
banked numbers rather than picked per metric. The reasoning for that level:
the value axis is one of three named seats (the gaze consumer and C5's time
dimension are queued behind it), so demanding full restoration would be
demanding their work too; demanding less than half the gap would not be
"reproduces combination play" in any honest sense. Power at 24 seasons: overlaps
≈300 events in arm 0, so the ratio's SE ≈0.06 — a true ratio of 1.0 fails H2
with probability ≈0, and H1/H3/H4 are far better sampled than that.

**Watchability instruments — REPORTED as band dimensions from now on (ruling
#15 (4), for all three arms):** forward-pass share, third-man releases, overlap
releases, give-and-gos, shots, longest pass chain. Plus passes, completion and
one-touch share, so the E4 round-1 table can be read arm for arm.

### X5V — PERF

```text
mean  <= 1.25x flags-off      p95 <= 1.50x      12 matches, interleaved
```

E3R2 banked 1.1977× / 1.1529× for the bundle. The value axis adds one table
lookup per option, so a measurable rise here would itself be a finding.

## 6. Stop rules

* **X5b fails** → the longer follow perturbed the census. Impossible forward in
  time, therefore my defect: fix and re-run, never re-baseline.
* **V2 fails** → where the ball arrives does not change what happens next in
  this world. That is a substrate finding of the first order and it kills the
  whole value premise; report it, stop, commander.
* **V4b fails** → the product rule mis-predicts the conjunction, so P and V are
  not conditionally independent given their keys and no weight-free composition
  exists on these keys. **Report; do not invent the weight, do not re-key after
  seeing results.** Back to the commander.
* **The central hypothesis (H) fails** → per ruling #15 (c): the value
  definition is myopic — one-step V cannot see two-pass patterns. **Report; do
  NOT bolt the old bonuses back on, do not widen the horizon after seeing
  results, do not re-run with another outcome definition.** Back to the
  commander.
* **§2 band / dominance / perf / any EXACT gate fails** → the usual: nothing
  ships, flags stay default OFF, the fork returns to the commander.
* **PASS on everything** → the flags stay default OFF, the preview toggle is
  extended to arm all three flags together, and the queue stops at **E4 round
  2, the user's eyes**. Ruling #15.1 made E4 iterative; v1 ships when they say
  so, not when a probe does.

## 7. Result

### 7.1 E5a — RUN 2026-07-26, PASS on every gate

Probe `scripts/probes/eds-e5a-value-census.ts`, SHA `5cc529f7…2a7f`, two
invocations byte-identical, fingerprint `57b0bdab…c673` unchanged, zero live
callers, suite green (759/759). Value table committed as data in
`src/ai/passPrior.ts`, table SHA `0125071f…3bc9`; the pre-commit extraction run
and this frozen run agree on every reported number, so committing the table
moved nothing but X6.

**The licence gate, first.** X5a's harness reproduces the match bit-identically
on all three seeds; **X5b returns E2a-2's option-space table field for field AND
E2b-0's threat quintiles digit for digit**. The staging and seeds are the
predecessors', and only a longer follow was added — which is why this had to be
exact, and is.

**R1 — the value table.** 7,864 clean receptions in set A (7,907 in B):

```text
zone                          receptions   V = P(shot within 4.0 s)   gated
Z0  own third, central            1,612          1.30%                yes
Z1  own third, wide                 226          2.21%                 no
Z2  middle third, central         3,546          7.64%                yes
Z3  middle third, wide            1,544          8.81%                yes
Z4  att. third outer, central       500         11.40%                yes
Z5  att. third outer, wide          243         13.58%                 no
Z6  att. third inner, central       129          9.30%                 no
Z7  att. third inner, wide           64         42.19%                 no
marginal                          7,864          7.15%
```

* **V2 — discrimination 10.10pp** over the gated cells (floor 5.0pp): where the
  ball arrives changes what happens next by a factor of nearly 9 between a
  reception in your own third and one in the attacking third.
* **V3 — held out**: worst gated cell error **2.49pp** (tolerance 5.0pp),
  marginal **0.92pp** (tolerance 1.5pp).

⚠️ **The sharpest limitation, reported and NOT repaired: four of eight cells miss
the 400-reception floor, and two of them are the attacking-third-inner cells** —
exactly where value is highest. They take the 7.15% marginal, which is BELOW the
outer-attacking-third cells that ARE measured (11.40% / 13.58%), so the live
chooser gets *less* credit for the most dangerous zone than for the one behind
it. Z7's 64 receptions read 42.19% (29.31% held out) — real signal, far too thin
to price on. Re-keying the grid after seeing this is exactly what §4 forbids, so
it stands as a named candidate cause if H fails, and as the first thing a
successor slice should fix (more moments, not coarser cells).

**V4 — the composition is a measurement.** Every playable fork scored P̂ × V̂
before its outcome was known, binned into quintiles of that score, against the
conjunction the product claims to estimate:

```text
quintile      n     mean predicted   realized conjunction   error
0          2,822        1.88%              1.74%            0.14pp
1          2,822        3.75%              3.05%            0.71pp
2          2,822        3.98%              1.42%            2.56pp
3          2,822        4.30%              4.25%            0.04pp
4          2,826        6.16%              9.45%            3.29pp
marginal  14,114        4.014%             3.982%           0.03pp
```

* **V4a discrimination 7.71pp** (floor 4.0pp) · **V4b worst quintile 3.29pp**
  (tolerance 5.0pp), **marginal 0.03pp** (tolerance 2.0pp) · **V4c** every
  quintile 2,822+ (floor 1,200). Held-out companion (set B scored with set A's
  table): predicted 3.98% vs realized 3.46%, 0.52pp.
* The product rule therefore predicts the world's own conjunction rate to within
  three hundredths of a percentage point in aggregate. **No weight was invented
  and none is needed** — which is the whole argument ruling #15 (b) asked for,
  settled by measurement rather than assertion.
* ⚠️ Reported, not gated, and honestly odd: the realized curve is **not
  monotone** — Q2 lands at 1.42% under a 3.98% prediction, the worst cell in the
  table, while Q1 and Q3 straddle it correctly. The gate was pre-registered on
  discrimination and calibration precisely because a five-point monotonicity
  claim is under-powered, and this is what that looked like in practice.

**R4 — which half carries it.** Same forks, three predictors: composed spread
**8.03pp** > P alone **7.25pp** > V alone **5.66pp**. Neither half is redundant
and the composition beats both, which is the substrate argument for pricing two
things instead of one.

**R5 — the size of the change before it is made:** the composed argmax differs
from the P-only argmax in **30.66%** of decision moments (1,004 of 3,275). E5b
is not a tweak.

**R6 — the legacy brain already selects for value:** its own chosen targets land
in zones worth **9.70%** against the option space's 7.15%, a **+2.55pp** lift.
The value half of the tactical layer was doing real work; ruling #15.2's
two-judges diagnosis says the E3 seam then threw that work away, and this is the
number behind it.

**R2 — the rival value definitions** (reported so any other composition can be
applied to these numbers): progression per cell runs +11.77 m in the own third
down to −3.93 m in the attacking-third-inner cell — a receiver deep in the box
does not "progress", so progression and shots disagree about the most valuable
place on the pitch, and the primary was frozen before that was visible. Goal
rate peaks at Z6 (10.85%, n=129).

**R7:** mean follow 182.4 ticks of the 240-tick window; 2,597 of 7,864 windows
were cut short by a dead ball, as §2.1 specified.

⚠️ **DISCLOSED, my defect, caught in my own output: R3 as contracted is not
measurable in this staging.** The contract asked for the unconditional
shot-within-window rate per composed quintile; §2.1 simulates the window only
for clean receptions (for every other fork the conjunction is false by
definition), so the column would be identical to the conjunction by
construction. Answering it honestly costs ~45% more simulation for a
reported-only number. The probe now says so in its own output instead of
printing a duplicate that looks like an answer.

### 7.2 E5b — RUN 2026-07-26: **30 of 32 gates PASS, the CENTRAL HYPOTHESIS FAILS. Queue stops; the fork is the commander's**

Probe `scripts/probes/eds-e5b-value-axis-audit.ts`, world SHA
`c3ee6659…c7c0`, world-deterministic across two invocations with perf reported
beside it, fingerprint `57b0bdab…c673` unchanged, 759/759, every flag default
OFF, nothing shipped.

**Everything the audit was for, except the thing it was for, passed.**

```text
Y4V flag-off identity   0 disagreements / 10,292 comparisons · 7/7 banked
                        families bit-identical · G1 and G2 re-hold
§2 band                 goals +3.01% · crosses −5.94% · headers +1.26%
                        long balls −7.66% · cutbacks +4.80%   ALL INSIDE
                        and the flags-off arm reproduces all five baselines to 4 dp
no-strict-dominance     25.09%            (band 20–80%)
X5V perf                5.258 → 6.204 µs = 1.180x mean · p95 1.144x
                        (budget 1.25 / 1.50)
```

The composed bundle is a **healthier** equilibrium than the one E3R banked:
goals +3.01% against E3R's +2.20%, long balls DOWN 7.66% where E3R was +8.06%.

**And the E4 round-1 table reproduces EXACTLY.** Arms 0 and 1 are its staging,
and their first two seasons return all nine of the commander's cited numbers to
the digit (forward 58.56/53.47%, third-man 10.014/6.437, overlap 0.176/0.056,
shots 13.47/12.66, chain 5.88/6.62). Ruling #15 rests on numbers that reproduce.

#### H — the central hypothesis, over 24 seasons, three paired arms

```text
                     flags-off    v1 bundle      + value axis      gate
third-man releases      6.851    4.130 (0.603x)  3.231 (0.472x)   >=0.85x  ⛔
overlap releases       0.0927   0.0687 (0.741x) 0.0775 (0.835x)   >=0.70x  ✅
forward-pass share     59.81%   57.24% (−2.57)  56.75% (−3.06pp)  >=−2.0pp ⛔
shots                   12.52   13.18 (1.053x)  14.71 (1.175x)    >=0.97x  ✅
```

**⛔ H1 and H3 fail, and neither failure is a staging artifact.** On third-man
the value arm is *worse than the v1 bundle it was meant to repair* — 0.472×
against 0.603× — so no reading of the reference makes it a recovery. On the
forward share it is likewise worse than v1 (−3.06pp vs −2.57pp). Per ruling #15
(c) and §6 this is reported, **not repaired**: no bonuses go back in, no horizon
is widened, no outcome definition is swapped after seeing this.

**What measured value DID do**, reported in full because it is the shape of the
finding:

```text
                   flags-off      v1     + value
passes / match         80.80    70.67     63.88     circulates far less
longest pass chain      4.94     4.42      3.84     shorter moves
give-and-gos          0.4572   0.3985    0.5335     ABOVE flags-off
long balls              5.90     5.61      4.14     fewer
goals                   2.78     3.37      3.13
pass completion       72.61%   69.83%    70.00%
one-touch share       14.54%   13.75%    12.88%
```

The value axis produces a **more direct, more shooting, less circulating** game:
+17.5% shots and give-and-gos above the flags-off level, on a healthy §2 band.
It did not fail by being inert — the composed argmax differs from the legacy
brain in 55.9% of live choices (E3R: 61.1%), the mean chosen price decomposes
into reception 0.658 × value 0.0808 against a 0.0715 marginal, so the chooser is
genuinely landing in above-average zones. It failed at the specific thing it was
predicted to fix.

#### Why, as far as the evidence supports, and no further

Ruling #15 (c) pre-registered the FAIL mode as *"the value definition is myopic
— one-step V cannot see two-pass patterns"*, and the shape of the result matches
that prediction closely enough to say so:

* **Third-man play is definitionally a two-pass pattern** (`Match.ts`: the
  counter fires on a BOUNCE to the licensed runner). A V measured as *P(shot
  within 4.0 s of arriving here)* rewards the man nearest a shot, never the man
  whose touch releases someone else — the third man's value accrues to the
  NEXT reception, which this V cannot see. Every other combination counter that
  is one-pass-shaped (overlap, give-and-go) recovered or improved.
* **E5a's own registered limitation is the second candidate, and it points the
  same way**: both attacking-third-inner cells missed the 400-reception floor
  and take the 7.15% marginal, *below* the outer-third cells that were measured.
  The chooser is therefore under-pricing the most advanced men — which is
  exactly the axis H3 measures. This was named in E5a §7.1 before E5b ran, and
  it is a sampling defect, not a keying choice to be revisited after results.

Both readings are consistent with the data; this audit does not separate them,
and separating them is a new experiment, not a paragraph.

#### Reported, never gated

```text
route mix under the bundle   crosses 2.342 · headers 9.218 · long balls 5.729
                             · cutbacks 3.998 · chosen long share 20.36%
                             · mean chosen distance 13.23 m
live classes                 READ 90.51 · SEEN-UNREAD 0.06 · UNSEEN 9.43%
look-pressure                read axis 5.61% · band axis 2.43%
no-executable share          5.02%
```

#### Disposition

Per §6 and ruling #15 (c): **nothing ships, both v1 flags stay default OFF,
`edsValueAxis` stays default OFF and out of the preview toggle** (pinned by
`tests/valueAxis.test.ts`), **E4 round 2 does not open**, and the fork returns to
the commander. The V table, the composition and the audit harness are banked and
cost nothing to keep.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,426p' docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E5c — The attribution experiment (HU vs HM)

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#16.4**, which authorised two independent cheap measurements on the existing
harness and named their order: (a) the HU top-up first, (b) the HM test on
(a)'s residual. Nothing here may be tuned after first sight of results.

Date: 2026-07-26

## 1. The question, and why the last result cannot answer it

E5b's central hypothesis died exactly where it was predicted to
(third-man 0.472×, worse than the v1 bundle's 0.603×) while one-pass shapes
recovered (overlap 0.835×, give-and-gos above flags-off). Two causes fit:

```text
HM  one-step MYOPIA          V = P(shot within 4.0 s of arriving HERE) can
                             never see a value that accrues to the NEXT
                             reception, and third-man play is definitionally
                             a two-pass pattern
HU  inner-box UNDERSAMPLING  E5a's Z6/Z7 cells (attacking third, inner half)
                             hold 129 and 64 receptions against a 400 floor,
                             so they read the 7.15% marginal — BELOW the
                             outer-third cells that were measured
```

Ruling #16.3 registered why the differential cannot arbitrate them: **overlap
runners target the OUTER attacking third (well sampled, 13.58%) while third-man
runners arrive in the INNER box (the two starved cells).** The pattern that
recovered and the pattern that died differ in their destination cell AND in
their pass depth at the same time. Only an experiment separates them.

## 2. What is measured

### 2.1 (a) The HU test — a targeted census top-up

E5a's staging and acceptance rules, verbatim, with two sampling-infrastructure
changes and nothing else (ruling #2.1's codified rule: budget is infrastructure,
not a gate):

1. **Cell-targeted enumeration.** Only candidates whose TRUE decision-moment
   zone is Z6 or Z7 are forked. Every other rule — plain ground pass moments,
   the 6–30 m window, target-choice-only intervention, the 240-tick follow, the
   12-tick adjudication window, clean-reception conditioning, the 240-tick value
   horizon with its dead-ball stop — is E5a's, unchanged.
2. **Fresh seeds.** Set A tops up from seeds **720,000+**, set B from
   **730,000+**, both continuing until each cell clears the floor in each set.

**The marginal and cells Z0–Z5 are NOT touched.** Adding inner-box receptions to
the marginal would over-represent the highest-value zones in the very number
that prices an unseen man. The topped-up table is E5a's table with two cells
replaced; gate U2 re-derives the rest.

**A faster staging, and the pin that makes it honest.** E5a cloned the world
every tick to hold a pre-tick fork point, which costs ~10 s of wall clock per
match and would make this top-up a multi-hour run. E5c walks each match twice
instead: once to record the ticks at which a plain ground pass registers
(no cloning, no perception), then once more cloning only at those ticks. The
world is deterministic and neither walk intervenes, so the fork points are the
same ones — but that is an argument, and **gate U1 turns it into a measurement**:
run this staging over E5a's OWN seed block and it must return E5a's Z6/Z7
numbers exactly, receptions and rates. Perception is dropped entirely because
the V table never consumed it (it is keyed on true positions; only the class
columns E5c does not need were perceived).

**Then the E5b probe is re-run with every gate VERBATIM**, its only input change
being the table. Ruling #16.4: *HU confirmed iff third-man recovers materially
with nothing else changed.*

### 2.2 (b) The HM test — is the table STATE-blind or sample-starved?

On (a)'s residual, and only meaningful after it: at **pattern-active moments**
the world is forked and the pass FORCED to the licensed runner, and the realized
outcome is compared against what the topped-up table predicts for that
destination.

Pattern-active is not a new definition — it is the legacy pass loop's own
licence predicates, read from truth (`PlayerBrain.ts`):

```text
THIRD-MAN     lastCompletedPass.receiverGid === holder && age < 1.5 s
              && lastCompletedPass.passerGid !== mate && mate is MakeRun
              && gain > 0.15
WALL RETURN   mate.wallRun active && mate.wallRun.partnerGid === holder
              && gain > 0.2
```

**The control is the same moments.** At each pattern-active moment every OTHER
window candidate is forked and forced too. So the two arms share their moments,
their world and their machinery, and differ only in whether the destination is
the licensed runner. That is what isolates state-blindness from a global
miscalibration: a table that under-predicts everywhere is broken; a table that
under-predicts *only the pattern's destination* is blind to the state.

Both arms are compared on the quantity the table actually claims:

```text
predicted   mean V̂(topped-up table, TRUE destination cell) over the clean
            receptions in that arm
realized    the share of those same receptions followed by a shot inside the
            240-tick window
gap         realized − predicted
```

Forks run in the flags-off world, exactly as the census measured V — the
circularity registered in E5 §2.1 is inherited deliberately, because the
question here is whether THIS table describes THAT world.

## 3. Authorised seat

* New probes `scripts/probes/eds-e5c-inner-cell-topup.ts`,
  `scripts/probes/eds-e5c-pattern-value.ts`.
* `src/ai/passPrior.ts` — the topped-up table added as NEW committed data
  beside E5a's, which stays untouched so its own X6 keeps reproducing;
  `valueZoneAt` re-points to the new table.
* `tests/valueAxis.test.ts` — the fallback pin follows the table it guards.
* **`scripts/probes/eds-e5b-value-axis-audit.ts` MUST NOT BE EDITED.** Its
  re-run is only a re-run if not one character moved.
* No other `src/**` change. Flags stay default OFF, fingerprint unchanged.

## 4. Frozen gates — (a) the HU top-up

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                     shared SHA-256
X4 zero live callers of the probe; the only src change is committed data
U1 STAGING EQUIVALENCE — run over E5a's own seed block (700,000+, 4,500
   moments), the fast staging must return E5a's banked Z6/Z7 rows EXACTLY:
   129 and 64 receptions, shot rates 0.09302325581395349 and 0.421875
U2 UNTOUCHED REST — the committed topped-up table equals E5a's table in
   cells Z0–Z5 and in the marginal, bit for bit
U3 the committed topped-up table equals this run's census in Z6 and Z7
```

U1 is the gate that buys the speed. If the two-walk staging is not E5a's
staging, its numbers have no standing and the top-up is withdrawn.

### U4 — COVERAGE

```text
Z6 and Z7 each >= 400 clean receptions in BOTH sets A and B
```

The same floor E5a froze, now met rather than missed.

### U5 — HELD-OUT CALIBRATION (interval test)

```text
per topped-up cell   | V_A − V_B |  <= 5.0pp
```

E5a's V3 tolerance, verbatim. At n ≈ 400 and p ≈ 0.10 the SE of the difference
is ≈2.1pp, so 5.0pp is ≈2.4σ — the same standard the gated cells passed at.

### U6 — THE E5b RE-RUN, GATES VERBATIM

`eds-e5b-value-axis-audit.ts` unmodified, reading the topped-up table:

```text
HU CONFIRMED   H1 third-man ratio >= 0.85x           (E5b's own gate, passed)
HU PARTIAL     0.653x <= ratio < 0.85x               (materially above the v1
                                                      bundle's 0.603x)
HU REFUTED     ratio < 0.653x                        (no material movement)
```

The 0.05 margin on the v1 bundle's banked 0.603× is powered from E5b's own
counts: 11,674 third-man events in the flags-off arm and 5,506 in the value arm
give the ratio an SE of ≈0.008, so 0.05 is ≈6σ — this cannot move on noise.

**"With nothing else changed" is gated too:** Y4V's flag-off identity, the §2
band on all five dimensions, dominance and perf must all still pass. A
third-man recovery bought by breaking the equilibrium is not a recovery.

### Reported, never gated (a)

```text
A1 how far the topped-up cells move off the 7.15% marginal — the size of the
   correction HU is built on
A2 the full re-run watchability table, arm for arm (the six instruments)
A3 H2/H3/H4 under the topped-up table, so a partial recovery is legible
```

## 5. Frozen gates — (b) the HM test

### EXACT

```text
Y1 fingerprint unchanged · tsc + build clean · suite green
Y2 two invocations byte-identical                     shared SHA-256
Y3 zero live callers; probe-only, no src change beyond (a)'s data
Y4 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
```

### M1 — COVERAGE

```text
pattern arm   >= 600 clean receptions
control arm   >= 600 clean receptions
```

At n = 600 and p ≈ 0.10 the SE of a rate is ≈1.2pp.

### M2 — THE STATE-BLINDNESS TEST (interval test, powered ex ante)

```text
HM CONFIRMED   pattern gap (realized − predicted)  >= +4.0pp
               AND control gap within ±2.0pp
HM REFUTED     pattern gap < +4.0pp
```

+4.0pp is ≈3.3σ at the coverage floor. The control condition is what makes it a
test of STATE-blindness rather than of the table: if the control gap also
exceeds its band, the finding is a miscalibrated table and the attribution is
neither HU nor HM — it returns to the commander as a third cause.

### Reported, never gated (b)

```text
B1 the gap split by pattern (third-man vs wall return)
B2 the destination cell mix of each arm — whether the pattern's runners really
   do arrive in the inner cells, which is ruling #16.3's geometric claim
   measured rather than assumed
B3 realized and predicted separately, so the direction of any gap is legible
B4 clean-reception rate per arm: the licensed runner may simply be a harder
   pass, which is a P-side fact and not a V-side one
```

## 6. Stop rules and what each outcome means

* **U1 fails** → the fast staging is not E5a's staging. Withdraw it, report; do
  not "fix" it into agreement after seeing the numbers.
* **U4 unreachable inside the sampling budget** → report the partial counts and
  stop; a cell that cannot be filled is itself the finding.
* **HU CONFIRMED and HM REFUTED** → the failure was sampling. The value axis is
  sound and E4 round 2 opens on the topped-up table (the commander's call).
* **HU REFUTED and HM CONFIRMED** → the failure is structural. One-step value is
  blind to two-pass patterns, and a state-conditional value slice (E5d) queues
  against seat 2 at that fork, per ruling #16.4.
* **BOTH fire** → both are real; the same fork opens with a stronger case for
  E5d, and the top-up ships with it.
* **NEITHER fires** → **a third cause exists that nobody has named.** Report
  that plainly and return to the commander; do not go looking for a fourth
  measurement in the same session.
* Any EXACT gate failing anywhere → nothing ships, flags stay default OFF, the
  fork returns to the commander.

## 7. Result

### 7.1 (a) The HU top-up — PASS on every gate, and **HU REFUTED** by the re-run

Probe `scripts/probes/eds-e5c-inner-cell-topup.ts`, SHA `38c430e3…303e`, two
invocations byte-identical, fingerprint `57b0bdab…c673` unchanged. Topped-up
table committed as new data in `src/ai/passPrior.ts`, table SHA `a197b453…ed46`.

```text
U1 staging equivalence   PASS — the fast staging returns E5a's Z6/Z7 rows to
                         the last digit (129 @ 0.09302325581395349,
                         64 @ 0.421875, both progressions exact)
U2 rest untouched        PASS   U3 committed = census   PASS
U4 coverage              PASS — Z6 902/869, Z7 400/400 (floor 400 per set)
U5 held out              PASS — Z6 0.22pp, Z7 2.00pp (tolerance 5.0pp)
```

**A1 — the correction is large, and it also deflates a mirage:**

```text
        E5a               topped up (set A)     held out (set B)   marginal
Z6      129 @  9.30%      902 @ 11.97%          869 @ 12.20%        7.15%
Z7       64 @ 42.19%      400 @ 28.25%          400 @ 30.25%        7.15%
```

Z7's banked 42.19% was the thin-sample reading E5a §7.1 flagged; at 6× the data
it settles at 28.25% — still four times the marginal the chooser had been
paying it. Both cells now clear the floor and price themselves.

#### ⚠️ U1 surfaced a DEFECT IN E5a, and this is its disclosure

U1 failed on its first run, and the diagnosis is not the staging. E5a's Z6 is
**12 shots / 129 receptions**; the first E5c replay found **the same 12 shots /
83 receptions**, and both progression figures rescale between the two
denominators to the last digit. The fork points were proven identical
separately (same pass ticks, all consumed, a pending pass at every one).

The difference is the reception DEFINITION, and it is E5a's that is wrong:

* E2a-2's registered convention counts an arrival that never reaches
  `attemptFirstTouch` as a clean reception — it is not an adjudicated spill.
  E5a inherited that correctly.
* **But E5a then skipped the value window for exactly those receptions and
  recorded them as no-shot by construction.** They sit in the denominator as
  guaranteed zeros that were never simulated.

Two consequences, and one correction to my own conduct:

1. **My probe was also wrong against its own contract** — it excluded
   unadjudicated arrivals, so U1 compared two definitions instead of holding the
   definition fixed and testing the staging. Corrected to E5a's convention
   verbatim (a fix toward the pre-registration, not toward a number), after
   which U1 passes exactly.
2. **The defect is now sized rather than described.** 34.48% of Z6's receptions
   and 28.75% of Z7's never adjudicated; simulating those windows anyway, they
   produce shots at **7.07%** and **10.43%** — not zero. So Z6 is deflated by
   ≈2.44pp (11.97 → 14.41) and Z7 by ≈2.80pp (28.25 → 31.25), and **every other
   cell in the table by an unmeasured amount.**
3. **Not repaired here.** Keeping E5a's convention is what makes the two topped
   cells comparable with the six untouched ones; repairing it means re-censusing
   all eight and re-banking E5a, which is a commander call on a banked milestone
   (ruling #16.1). Recorded at the table in `passPrior.ts`.

#### U6 — the E5b re-run, gates verbatim: **HU REFUTED**

`eds-e5b-value-axis-audit.ts` byte-unchanged (`git diff` empty), world SHA
`4884e5c3…807b`, world-deterministic.

```text
                 flags-off   v1 bundle   value (E5a)   value (topped)    gate
third-man           6.851    4.130         3.231       2.707  0.395x      ⛔
overlap            0.0927   0.0687        0.0775      0.0734  0.791x      ✅
forward share      59.81%   57.24%        56.75%      59.60%  −0.21pp     ✅
shots               12.52    13.18         14.71       15.54  1.241x      ✅
```

**HU REFUTED on its own criterion: 0.395× is below the 0.653× line, and below
the un-topped 0.472× — the top-up made third-man play WORSE.**

**But HU is CONFIRMED on the forward share**, and the contract did not
anticipate that split: −3.06pp → **−0.21pp**, from failing to passing, because
the most advanced men stopped being under-priced. The sampling defect was real
and it was doing exactly what a sampling defect should do — on the axis that
measures how far forward the ball goes, not on the axis that measures whether
teams combine.

Everything else held with nothing else changed: **Y4V 0 disagreements /
10,292**, all seven banked families bit-identical, §2 band inside on all five
(goals −7.50%, crosses ±0.00%, headers +19.84%, long balls +5.19%, cutbacks
−3.83%), dominance 27.16%, perf **1.187×** mean / 1.149× p95.

**A2/A3 — the direction the top-up pushed:** passes/match 63.88 → **56.52**,
longest chain 3.84 → **3.26**, give-and-gos 0.533 → **0.255** (flags-off 0.457),
shots 14.71 → **15.54**. Pricing the box at four times the marginal makes the
chooser drive at it whenever it can see someone there, and the intermediate
passes combinations are built from disappear. That is not a sampling artifact;
that is the same one-step argmax with a steeper gradient.

### 7.2 (b) The HM state-blindness test — **HM REFUTED**, narrowly, with the direction right

Probe `scripts/probes/eds-e5c-pattern-value.ts`, SHA `1658231a…36d3`, two
invocations byte-identical, harness reproduces on all three seeds, 50 matches.

```text
              n     predicted V̂    realized     gap        gate
pattern     608        8.80%        12.17%     +3.38pp    >= +4.0pp   ⛔
control   1,567        7.39%         7.34%     −0.06pp    ±2.0pp      ✅
```

**HM REFUTED by the letter: +3.38pp against a +4.0pp floor.** Reported exactly
as it fired — no predicate is rewritten after results. Two honest qualifications
the commander should weigh, neither of which changes the verdict:

* The **direction is right and the control is exquisite.** At n = 608 and
  p ≈ 0.12 the SE is ≈1.32pp, so the pattern gap is ≈2.6σ from zero while the
  control sits at −0.06pp on 1,567 receptions. The table is right everywhere
  else and under-predicts the licensed runner's destination. State-blindness is
  real; it is just **smaller than the band I pre-registered**.
* **B1 splits it:** third-man **+2.96pp** (n=579) and wall-return **+11.73pp**
  (n=29 — far too thin to carry weight, reported for completeness).

**B2 corrects ruling #16.3's geometric premise, measured.** The licensed
runner's destinations are **Z2 51.8% · Z4 21.9% · Z3 18.3% · Z6+Z7 4.1%** —
third-man runners overwhelmingly arrive in the middle third and the outer
attacking third, **not the inner box**. The confound the ruling registered
(overlap→outer, third-man→inner) is not what the geometry does, which is why
the top-up could not have rescued third-man play and, in the event, did not.

**B4 is the number the attribution turns on: the licensed runner is a genuinely
HARDER pass** — clean reception **40.16%** against the control's **51.77%** at
the same moments.

### 7.3 Attribution — **NEITHER fires, and the third cause is visible in these numbers**

Per §6 this returns to the commander. But the two tests did not merely fail;
between them they leave one reading standing, and it is arithmetic on measured
quantities rather than a new hypothesis:

```text
per forced pass, at the same moments        pattern      control
clean reception (B4)                         40.16%       51.77%
V̂ the table gives the destination             8.80%        7.39%
realized shots per FORK                       4.89%        3.80%   <= reality
P̂-proxy × V̂  (the chooser's own axis)         3.53%        3.83%   <= the chooser
```

**The composed axis INVERTS the true ordering.** Playing the third man is worth
**+1.09pp** more per attempt than the alternatives at the same moment — and the
chooser scores it **−0.29pp** worse, because his P̂ deficit (−11.6pp of clean
reception, real and correctly measured) swamps a V̂ advantage worth +1.4pp of
cell value plus the +3.4pp of state the table cannot see.

So the failure is **not** that V is too coarse (HU: the correction went the
wrong way) and **not** mainly that V is state-blind (HM: real, but +3.4pp when
the deficit to overcome is ~12pp). It is that **a per-option argmax over
P̂ × V̂ declines the pattern pass on an axis where declining it is locally
correct.** The legacy layer's ×1.15/×1.3 multipliers were not decoration — they
were buying a pass that does not win an honest one-option-at-a-time comparison
and yet pays off across the move. Every one-pass shape survived the value axis
precisely because it never needed that subsidy.

Three readings for the commander, in the order the evidence supports them, and
**none of them tested here** (§6 forbids hunting a fourth measurement in this
session):

1. **The joint is measurable and the chooser is not using it.** The 4.89% vs
   3.80% above is P × V measured TOGETHER on the same forks. A value seat that
   prices the joint outcome per option — rather than composing two separately
   measured halves — would rank the third man correctly, with no hand weight and
   no new horizon.
2. **State-conditional value (E5d as ruling #16.4 framed it)** is real but
   under-powered as a sole repair: +3.4pp against a ~12pp deficit.
3. **The sampling repair should ship regardless of the fork** — the topped-up
   table fixed the forward share, and the unfollowed-window defect in §7.1
   deflates every cell in the banked E5a table by an unmeasured amount.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,302p' docs/world-model/EDS-E5D-ATTEMPT-VALUE.md; sed -n '1,374p' docs/world-model/EDS-E5D-PHASE1.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
# EDS E5d — The attempt-value axis (one measured quantity)

Status: **PRE-REGISTERED 2026-07-26 — Phase 0 gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#17.4**, which authorised the axis and ordered Phase 0 first: free, decisive,
on E5c's own forks. Phase 1 is drafted here too but is CONDITIONAL — it exists
only if Phase 0 re-ranks.

Date: 2026-07-26

## 1. What is being removed

Ruling #17.2 named the third cause: **the composition itself**. On the same
forks the chooser's axis scores the pattern pass 3.53% against the control's
3.83% while reality pays 4.89% against 3.80% — and the model is nearly exact
off-pattern (3.83 vs 3.80). `P̂(clean) × V̂(cell | clean)` is accurate for
ordinary balls and biased precisely on balls whose value flows through messy
paths: 40% clean reception, highest realized value, because box chaos, second
balls and the runner's own state pay even when the first touch does not.

So the repair is not another factor. **It is one factor fewer:**

```text
now   P̂(clean reception)  ×  V̂(shot | CLEAN reception, destination cell)
E5d   EV̂(shot | ATTEMPT, observable features)
```

Attempt-conditioning has no adjudication gate at all, which is why ruling #17.3
records that it closes E5a's unfollowed-window defect in the same census: there
is no longer a class of receptions whose window goes unsimulated, because every
fork's window is simulated and counted — clean, messy, spilled, intercepted and
unadjudicated alike.

**No weight is invented anywhere.** The change removes a composition rather than
adding one; that is the whole reason it is allowed under rulings #8/#9.

## 2. What is measured

### 2.1 Phase 0 — the free judgment (this contract's live half)

Two things, both on staging this slice already owns.

**(i) The attempt-conditioned table.** E5a's census population, verbatim —
seeds 700,000+, 4,500 moments, the 6–30 m window, plain ground pass moments,
target-choice-only intervention — with one change and one removal:

```text
CHANGE   every fork's 240-tick window is simulated and counted, whatever
         happened to the ball; the outcome is "the passing team took a shot
         within 240 ticks of the kick", exactly E5a's outcome, now over
         ATTEMPTS instead of over clean receptions
REMOVE   the clean-reception conditioning, and with it the adjudication gate
         that produced E5a's defect
```

Keyed on **destination cell × threat band** (ruling #17.4): E5a's eight zones
crossed with E2b-0's five threat quintiles, the passer's own corridor read from
his own snapshot at awareness 0.8. Held out against seeds 710,000+.

Cells the census cannot fill fall back down a ladder frozen here, before any
result: **(cell × band) → cell → global marginal**, at a 200-attempt floor per
bucket. An option the evaluator cannot read at all takes the cell row.

**(ii) The decisive test, on E5c (b)'s own pattern moments** (seeds 740,000+,
its staging verbatim): at each pattern-active moment every window candidate is
scored twice — once on the shipped composed axis, once on EV̂ — and the two
argmaxes are compared.

### 2.2 Phase 1 — CONDITIONAL, drafted but not authorised by this run

Only if Phase 0 re-ranks: a fresh full census at the Phase-0 keying, committed
as SHA'd data; the chooser's axis swapped from the product to EV̂ behind the
existing `edsValueAxis` flag; then `eds-e5b-value-axis-audit.ts` re-run
**verbatim and unedited**, the narrow audit (§2 band, dominance, perf, the six
watchability instruments), and E4 round 2. Its gates are NOT frozen here —
Phase 0's numbers are what a Phase-1 pre-registration must derive from, and
writing them now would be deriving gates from nothing.

## 3. Authorised seat (Phase 0)

* New probe `scripts/probes/eds-e5d-attempt-value.ts`.
* **No `src/**` change at all.** Phase 0 builds its table inside the probe and
  scores both axes there; nothing is committed as data and no consumer changes.
* `scripts/probes/eds-e5b-value-axis-audit.ts` and E5c's probes MUST NOT be
  edited.
* Fingerprint unchanged, zero live callers, flags default OFF.

## 4. Frozen gates — Phase 0

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                    shared SHA-256
X4 zero `src/**` changes (audited)
X5 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
X6 STAGING EQUIVALENCE — over E5a's own seed block the CLEAN-conditioned
   sub-population of this census must return E5a's committed marginal exactly:
   X6a its COUNT is 7,864, and X6b its shot rate computed E5A'S OWN WAY —
   unadjudicated arrivals forced to no-shot — is 0.07146490335707019
```

X6 is E5c's U1 lesson applied before it can bite: a new outcome definition is
only a new definition if everything underneath it is unchanged.

> ⚠️ **AMENDED BEFORE THE RUN (own commit, disclosed in §6.1).** As first
> frozen, X6 asked the clean subset to return E5a's shot rate *directly*. That
> is **unsatisfiable by construction** and I should have seen it while writing
> it: ruling #17.3 records that attempt-conditioning closes E5a's
> unfollowed-window defect, so a defect-free census cannot reproduce a defective
> number. A predicate that cannot be satisfied is the structurally undecidable
> kind PROBE-CONTRACTS §2 outlawed after ruling #6.3, and **E1b §4.1 is the
> precedent** for amending such a gate before the run rather than reporting a
> guaranteed failure. The amended form compares what can only be equal if the
> staging is unchanged — which is what X6 was for — and the gap between X6b's
> number and the honest rate becomes D5, the size of E5a's defect on its own
> marginal.

### C1 — COVERAGE

```text
gated buckets     >= 200 attempts per (cell x band) in BOTH sets
under-filled buckets fall down the frozen ladder and are REPORTED, never merged
                  after seeing results
```

### C2 — HELD-OUT CALIBRATION (interval test)

```text
per gated bucket   | EV_A − EV_B |  <= 5.0pp
marginal           | EV_A − EV_B |  <= 1.5pp
```

E5a's V3 tolerances, verbatim. At n ≈ 200 and p ≈ 0.06 the SE of a bucket
difference is ≈2.4pp, so 5.0pp is ≈2.1σ — the same standard the V cells passed
at, on a smaller base rate.

### C3 — THE AXIS IS A MEASUREMENT

```text
discrimination   | best gated bucket − worst gated bucket |  >= 5.0pp
calibration      | mean EV̂ − realized attempt-outcome rate |  <= 2.0pp,
                 over all scored forks and within each arm below
```

### R — **THE RE-RANK JUDGMENT** (the thing Phase 0 exists to decide)

Both conditions must hold. Either failing means Phase 0 does NOT re-rank:

```text
R1 ORDERING RESTORED   mean EV̂(pattern) − mean EV̂(control)  > 0
                       reality pays +1.09pp; the composed axis scores −0.29pp,
                       so the SIGN is the whole question and the gate is the
                       sign, not a magnitude I would be inventing
R2 ARGMAX MOVES        at pattern-active moments, the share where the argmax
                       selects a licensed runner rises by >= +5.0pp against the
                       composed axis on the SAME moments
```

R2's floor is powered from E5c (b)'s own staging: 608 pattern receptions came
from ~1,500 pattern-arm forks over ≈450 pattern-active moments, so a paired
shift of 5.0pp is ≈23 moments changing hands — well outside the paired-
proportion noise at that n, and small enough that it does not demand the axis
solve the whole problem in one step. **R2 is deliberately about the DECISION,
not about the score:** a table that improves a number without changing a choice
has changed nothing in the game.

### Reported, never gated

```text
D1 the attempt table itself, both sets, with the bucket census beside it
D2 the two axes side by side on the pattern arm: composed score, EV̂, realized
D3 where the re-rank comes from — the cell x band mix of the moments that
   change hands
D4 what the axis does to the ORDINARY option: the same comparison on control
   moments, where ruling #17.2 says the composed model is already nearly exact.
   A repair that breaks the accurate case is not a repair
D5 E5a's defect, closed by construction: the share of attempts that never
   adjudicate and what their windows pay, now inside the axis rather than
   outside it
```

## 5. Stop rules

* **X6 fails** → the staging drifted; withdraw and report, do not reconcile
  after seeing numbers (E5c's U1 precedent, and its correction).
* **C3 fails** → attempt-conditioning does not discriminate, i.e. removing the
  composition also removed the signal. Report; that closes the axis.
* **R1 or R2 fails → PHASE 0 DOES NOT RE-RANK.** Per ruling #17.4 the residual
  is then the state premium plus the honest observability of pattern state (the
  passer's own action memory and a perceived runner), and that returns to the
  commander **as a design question**, not as another probe in this session.
  Phase 1 is not entered.
* **PASS (re-ranks)** → Phase 1 proceeds under a pre-registration derived from
  Phase 0's numbers, and the queue stops at **E4 round 2, the user's eyes**.

## 6. Result

### 6.1 Phase 0 — RUN 2026-07-26: **THE AXIS RE-RANKS, and Phase 0 is still non-PASS**

Probe `scripts/probes/eds-e5d-attempt-value.ts`, SHA `e42e75c3…1299`, two
invocations byte-identical, fingerprint `57b0bdab…c673` unchanged, **zero
`src/**` changes**, suite green.

```text
X5 harness                       PASS  (3/3 seeds bit-identical)
C1 coverage                      PASS  14 of 40 buckets gated
C2 held-out calibration          PASS  buckets and marginal
C3 discrimination                PASS  15.07pp (floor 5.0pp)
R1 ORDERING RESTORED             PASS
R2 ARGMAX MOVES                  PASS
X6 staging equivalence           FAIL
C3 calibration                   FAIL
```

#### The judgment Phase 0 existed to make: **it re-ranks, decisively**

```text
                       composed axis      EV̂        reality
pattern (n=593)            4.348%       8.674%      7.757%
control (n=1,136)          4.295%       6.653%      4.577%
ordering                  +0.05pp      +2.02pp     +3.18pp
```

**R1**: the sign is restored — the composed axis calls the pattern and the
control a coin-flip (+0.05pp) where reality pays +3.18pp; EV̂ says +2.02pp.
**R2**: at the 450 pattern-active moments the argmax selects a licensed runner
**23.78% → 39.33%, a +15.56pp shift** against a +5.0pp floor. The decision
changes hands at 70 moments, not the statistic alone.

The attempt table's own gradient over the eight cells, on attempts rather than
clean receptions: **1.05 / 1.63 / 6.03 / 7.01 / 14.59 / 14.10 / 17.75 /
36.71%**, marginal 6.33% over 14,114 attempts (held out 5.87%).

#### ⛔ X6 FAILED — reported as it fired, and NOT re-amended

```text
clean subset COUNT       7,864  =  E5a's 7,864          EXACT
clean subset RATE        0.07922177009155645
E5a's banked rate        0.07146490335707019            differs
```

**The count is exact, which proves the staging did not drift** — same moments,
same candidates, same fork outcomes, same clean classification, to the unit.
The residual is a third E5a implementation inconsistency, certain from reading
the code rather than inferred: E5a captured `shotsBefore` **after** stepping the
12-tick adjudication window, so its value window ran `[touch+12, kick+240]`
while its own contract says "within 240 ticks of the kick". This probe follows
the contract. The 0.78pp difference is the shots E5a's window excluded — the
first-time shot and the early second ball.

**I have twice now written X6 in a form that conflates the DEFINITION with the
STAGING it was meant to police.** The first form was unsatisfiable and I amended
it before the run (§4). This second form failed on a definition difference too,
and amending it *after* seeing results is precisely what the discipline forbids
— so it stands as FAILED and the disposition is the commander's, exactly as I2
was retired rather than redrawn in ruling #6.2.

**What this makes visible is worth more than the gate was.** On the same 7,864
receptions, E5a's own marginal:

```text
7.146%   as banked            (unfollowed windows zeroed, window starts late)
7.922%   + the correct window start
9.054%   + every window actually simulated
```

**E5a's V table is deflated by 1.91pp on its marginal — 27% relative** — by two
independent implementation defects, neither of which the attempt axis can have.
D5 shows why: of 14,114 attempts, 8,602 reach the target and 7,864 count as
clean receptions, of which **1,473 (18.7% of arrivals) never adjudicate** and
pay **6.04%**; attempts that never reach pay **2.85%**, not zero. Both classes
were structurally invisible to the composed axis.

#### ⛔ C3's calibration FAILED, narrowly, and it is a Phase-1 design fact

```text
all scored forks     within tolerance
pattern arm          8.674% predicted vs 7.757% realized     0.92pp   ok
control arm          6.653% predicted vs 4.577% realized     2.08pp   FAIL (2.0pp)
```

The table is built on the general census and applied to a **selected**
population — moments where a licence fires — and it over-predicts the ordinary
options there by 2.08pp, a hair over the band. Reported as it fired. It does not
touch R1 or R2 (both are comparisons *within* that population, where the bias
applies to both arms), but it is the first thing a Phase-1 pre-registration must
answer: an axis that is calibrated on average and biased on the population where
decisions are hard is not yet finished.

#### Disposition

**Non-PASS.** Two gates fired, and the contract's stop rules plus the standing
instruction send any non-PASS to the commander before Phase 1. Nothing shipped,
no `src/**` touched, every flag still default OFF, E4 round 2 still shut.

What the commander now has that ruling #17.4 asked for: **the attempt axis DOES
re-rank** (+15.56pp of decisions, ordering sign restored), and the two gates
that failed are both about the *old* table's defects and the *new* table's
population, not about the axis's ability to do its job.
# EDS E5d Phase 1 — The attempt axis, censused where it is deployed

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#18.4**, constraints (a)–(e). Nothing here may be tuned after first sight of
results.

Date: 2026-07-26

## 1. What Phase 0 settled and what it left

Phase 0 answered #17.4 yes: the attempt axis restores the ordering sign
(+2.02pp against reality's +3.18pp, where the composition scored +0.05pp) and
**70 real decisions changed hands** (argmax picks the licensed runner
23.78% → 39.33%). It also fired two gates, and ruling #18 disposed of both:
X6 closed the E5a file (its V table was depressed 1.91pp, relative 27%, by a
late window start plus the zero-value convention), and C3's near-miss became
the house law's third appearance — **a table is honest only on the population
it is deployed on**.

Phase 1 is that correction, plus the live swap.

## 2. What is measured

### 2.1 The population (constraint a)

**Licence-triggered decision moments**: a plain ground pass moment at which at
least one window candidate carries the legacy loop's own third-man or
wall-return licence. At each, the **full candidate set** — licensed and not —
is enumerated and fork-and-forced. Both arms come from the same moments, as in
E5c (b) and Phase 0.

> ⚠️ **A boundary I want on the record, stated before the run and not as an
> excuse afterwards.** The live chooser runs at EVERY plain-ground-pass moment,
> not only licence-triggered ones, so "deployment population" admits two
> readings: the moments where the chooser fires (all of them), or the moments
> where its errors were measured and where watchability is decided (these).
> Ruling #18.4 (a) names the second, and this contract follows it. To keep the
> question answerable by measurement rather than argument, **the same
> calibration is computed on the GENERAL population and REPORTED (never
> gated)** — so if aligning one end misaligns the other, the number says so
> instead of the audit discovering it downstream.

### 2.2 The quantity (constraint b)

```text
EV̂(option) = P(the passing team takes a shot within 240 ticks OF THE KICK
              | this pass is ATTEMPTED, destination cell × threat band)
```

Every fork's window is simulated and counted — clean, spilled, intercepted,
never-adjudicated alike. **No adjudication conditioning anywhere**, which is
what makes both E5a defects structurally impossible here rather than merely
absent.

### 2.3 The features (constraint c)

**Destination cell × threat band**, the two validated axes: E5a's eight zones ×
E2b-0's five threat quintiles, the passer's own corridor read from his own
snapshot at awareness 0.8. Frozen fallback ladder, as Phase 0:
**(cell × band) → cell → marginal**, at a 200-attempt floor.

**The pattern-state feature is deliberately NOT added.** Ruling #18.4 (c): at
deployment-population frequencies part of Phase 0's +3.4pp premium is absorbed
naturally, and the feature question returns only if third-man still misses.

### 2.4 The staging, and why it needs its own pin

Phase 0 cloned the world every tick. This population is ~9× rarer per match, so
the same staging would cost hours. Phase 1 uses E5c's proven two-walk staging —
scout the pass ticks, then replay and clone only there — and, per ruling #18.2's
codification, **pins the staging SEPARATELY from the definition, one gate per
claim**: S1 below compares stagings with the definition held fixed, D1 below
compares definitions with the staging held fixed. That is the direct lesson of
writing X6 twice as a mixed gate.

### 2.5 The swap and the audit (constraint e)

Table committed as SHA'd data; `pricePassOption` under `edsValueAxis` returns
**EV̂ itself** — the composition is removed, not re-weighted, so `price = V̂` and
the reception half survives only as a reported diagnostic. Then
`eds-e5b-value-axis-audit.ts` **verbatim and unedited**, and on a PASS the queue
stops at **E4 round 2**.

## 3. Authorised seat

* New probe `scripts/probes/eds-e5d-p1-deployment-census.ts`.
* `src/ai/passPrior.ts` — the attempt table as new committed data; E5a's and
  E5c's tables stay untouched so their own gates keep reproducing.
* `src/ai/perceivedPassChoice.ts` — the axis swap, behind the existing flag.
* `tests/valueAxis.test.ts` — the pins follow the axis they guard.
* **`scripts/probes/eds-e5b-value-axis-audit.ts` MUST NOT BE EDITED.**
* No other `src/**` change. Flags default OFF, fingerprint unchanged.

## 4. Frozen gates

### EXACT — one gate per claim

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                     shared SHA-256
X4 zero live callers of the probe; the only src changes are the committed
   table and the flagged axis swap
X5 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
S1 STAGING PIN, definition held fixed — over a common seed block the two-walk
   staging and Phase 0's per-tick-clone staging must produce IDENTICAL attempt
   records (moment, cell, band, reached, adjudicated, clean, shot), in order
D1 DEFINITION PIN, staging held fixed — over Phase 0's own population and seed
   block this probe's window must return Phase 0's banked attempt marginal
   EXACTLY: 14,114 attempts at 0.06327051154881677
T1 the committed table equals this run's census
```

S1 and D1 are the same experiment split in two, which is the whole point: X6
failed twice because one gate carried both claims and could not say which had
moved.

### C1 — COVERAGE

```text
gated buckets   >= 200 attempts per (cell x band) in BOTH sets · >= 8 gated
under-filled buckets take the frozen ladder and are REPORTED, never merged
after seeing results
```

### C2 — HELD-OUT CALIBRATION ON DEPLOYMENT MOMENTS (constraint d)

The gate C3 missed by 0.08pp in Phase 0, now on the aligned population and
powered before the fact:

```text
pattern arm   | mean EV̂ − realized |  <= 2.0pp
control arm   | mean EV̂ − realized |  <= 2.0pp
marginal      | mean EV̂ − realized |  <= 1.0pp
```

Powering: at p ≈ 0.08 a 2.0pp band needs SE ≲ 0.7pp, i.e. **n ≥ 1,500 attempts
per arm** on the held-out set — a floor this contract meets by construction
(C1's budget yields ≈1,700 attempts per 450 moments, and the held-out set runs
to the same budget as the census). **The band is NOT widened** (ruling #18.3);
the population is aligned instead.

### C3 — THE AXIS IS A MEASUREMENT

```text
discrimination   | best gated bucket − worst gated bucket |  >= 5.0pp
held out         | EV_A − EV_B |  <= 5.0pp per gated bucket, <= 1.5pp marginal
```

### THE LIVE AUDIT — `eds-e5b-value-axis-audit.ts`, verbatim

Every gate as that file already carries them, unedited:

```text
Y4V flag-off identity      0 disagreements / 10,292 · 7/7 banked families
§2 band                    goals ±15% · crosses/headers/long balls/cutbacks ±25%
                           and the flags-off arm reproducing all five to 4 dp
no-strict-dominance        20% <= share <= 80%
perf                       mean <= 1.25x · p95 <= 1.50x
H1 third-man   >= 0.85x    H2 overlap  >= 0.70x
H3 forward share >= −2.0pp H4 shots    >= 0.97x
```

H1–H4 are E5b's own frozen gates and are **not** re-derived here. The whole
slice has been trying to pass them; moving them now would be the one thing that
makes the attempt worthless.

### Reported, never gated

```text
R1 the attempt table itself, both sets, with the bucket census beside it
R2 the SAME calibration on the GENERAL population — the boundary in §2.1,
   answered by measurement
R3 the argmax comparison Phase 0 ran, re-measured on the deployed table
R4 the six watchability instruments arm for arm, and the E4 round-1 reproduction
   the E5b probe already carries
R5 what happens to the reception half: it is no longer in the price, so its
   correlation with the realized outcome is reported as the record of what was
   removed
```

## 5. Stop rules

* **S1 fails** → the two-walk staging is not Phase 0's staging. Withdraw it and
  re-run on the slow staging; do not reconcile after seeing numbers.
* **D1 fails** → the window or the conditioning moved. My defect; fix and re-run.
* **C2 fails on the aligned population** → the misalignment was not the
  population, and that is a finding about the FEATURES, not a licence to widen
  the band. Report; ruling #18.4 (c)'s pattern-state question opens at the
  commander.
* **Any live-audit gate fails — including H1** → nothing ships, flags stay
  default OFF, E4 round 2 does not open, the fork returns to the commander. In
  particular H1 failing after an aligned census is the specific evidence that
  reopens the pattern-state feature.
* **PASS on everything** → the flags stay default OFF, the preview toggle is
  extended to arm all three together, and the queue stops at **E4 round 2, the
  user's eyes.**

## 6. Result

### 6.1 The deployment census — RUN 2026-07-26: **the alignment WORKED, one held-out bucket fired, and the phase STOPS there**

Probe `scripts/probes/eds-e5d-p1-deployment-census.ts`, SHA `f9a1395b…707e`,
two invocations byte-identical, fingerprint `57b0bdab…c673` unchanged.

```text
X5 harness                          PASS  3/3 seeds
S1 staging pin                      PASS  two-walk ≡ per-tick-clone, record for record
D1 definition pin                   PASS  14,114 attempts @ 0.06327051154881677,
                                          Phase 0's banked marginal to the last digit
C1 coverage                         PASS  16 gated buckets · both arms ≥ 1,500
C2 calibration, deployment moments  PASS  see below
C3 discrimination                   PASS  13.41pp (floor 5.0pp)
C3 held-out marginal                PASS  5.62% vs 6.03%
C3 held-out buckets                 FAIL  one bucket, see below
T1 committed = census               vacuous — the phase stopped before committing
```

**The split pins are the X6 lesson working.** S1 held the definition fixed and
asked only about the staging: the fast two-walk staging produces attempt records
identical to Phase 0's per-tick-clone staging, in order, field for field. D1
held the staging fixed and asked only about the definition: this window returns
Phase 0's banked attempt marginal **exactly**. Two claims, two gates, each able
to say which one moved — which is precisely what X6 could not do, twice.

#### C2 — the gate this whole phase existed to fix, PASSES

Phase 0 missed by 0.08pp on a table censused over general touches. Censused
where it is deployed:

```text
                 n        predicted   realized    gap      band
pattern       5,195         6.822%     8.046%   −1.22pp   ±2.0pp  ✅
control      10,269         5.651%     5.005%   +0.65pp   ±2.0pp  ✅
marginal     15,464         6.044%     6.027%   +0.02pp   ±1.0pp  ✅
```

Both arms clear the power floor (n ≥ 1,500) by 3–7×, and the band was not
widened — ruling #18.3's instruction was to align the population, and aligning
it moved the control arm's error from +2.08pp to +0.65pp.

#### R2 — the boundary I registered before the run, answered by measurement

§2.1 flagged that the live chooser fires at every pass moment while #18.4 (a)
names licence-triggered ones as the deployment population, and promised the
general-population calibration as a reported number so a trade-off could not
hide. There is no trade-off:

```text
general population, scored with the deployment table
  all options        n = 14,114     gap  −0.72pp
  licensed           n =  1,758     gap  −1.09pp
  unlicensed         n = 12,356     gap  −0.66pp
```

The deployment-censused table is **inside the 2.0pp band on the general
population too**. Aligning one end did not misalign the other, and the question
is closed by a number rather than an argument.

#### ⛔ C3's held-out bucket check FAILED — one bucket, and my tolerance was mis-powered

```text
cell 4 (attacking third outer, central) × band 2
   set A  235 attempts @ 11.91%      set B  234 @ 17.09%      error 5.18pp
   tolerance 5.0pp
next worst: cell3×band1 2.83pp · cell4×band3 2.74pp · cell3×band0 2.68pp
```

At n ≈ 235 and p ≈ 0.145 the SE of that difference is **3.25pp, so 5.18pp is
1.59σ** — thin-bucket noise. But the gate fired, and the reason it could fire is
**my own design error, stated plainly**: I inherited C3's 5.0pp tolerance
verbatim from E5a's V3, where cells carried n ≈ 1,000 and 5.0pp was 3.4σ. Paired
with this contract's 200-attempt bucket floor, the same tolerance is only 1.6σ —
a floor and a tolerance chosen from different experiments and never checked
against each other. **Re-choosing either after seeing which bucket fired is
exactly what the discipline forbids**, so the gate stands as fired and the
disposition is the commander's.

#### What the census found, for the record

The attempt-value gradient over the eight cells on the deployment population:

```text
own third central 1.16% · own third wide 0.68% · middle central 4.30%
middle wide 6.88% · att. outer central 9.48% · att. outer wide 14.25%
att. inner central 16.62% · att. inner wide 21.33%      marginal 5.62%
```

**R5 — the size of what the composition was discarding:** of 15,398 attempts,
9,846 reach the target and 8,970 count as clean receptions, which pay **8.10%**
— but the 6,428 attempts that are NOT clean receptions pay **2.15%**, not zero,
and 1,648 arrivals never adjudicate at all. Clean-conditioning was throwing away
a fifth of the realized value, unevenly across cells. That is the same defect
family X6 exposed in E5a, now quantified on the population that matters.

#### Disposition

**Non-PASS, and the phase stops before the swap.** Governance is explicit — a
FAIL anywhere binds the step's stop rule and forbids skipping ahead — so the
axis was **not** swapped, `ATTEMPT_VALUE_TABLE` was **not** committed as data,
the E5b watchability probe was **not** run, and E4 round 2 does not open. No
`src/**` behaviour changed; the table scaffold in `passPrior.ts` is empty and
has no callers.

What the commander has: the population alignment **worked** — C2 passes on both
arms and on the general population too — and the single failing gate is a
tolerance/floor mismatch I introduced, at 1.6σ, in the thinnest gated bucket.

## 7. C3R — the floor rises to meet the tolerance

**PRE-REGISTERED 2026-07-26 under commander ruling #19.2**, before any
implementation and before any new data. C3 is redrawn, not retired:
per-bucket honesty is load-bearing, because the argmax compares options
bucket by bucket and an aggregate can hide a bad cell.

### 7.1 What changes and what does not

```text
KEEPS   the 5.0pp tolerance, with its V3 meaning intact
KEEPS   the gate text, verbatim: | EV_A − EV_B | <= 5.0pp per GATED bucket
KEEPS   C1 (>= 8 gated), C2 (2.0pp arms / 1.0pp marginal), C3 discrimination,
        the fallback ladder, the population, the window, the features
RAISES  the per-bucket floor, until 5.0pp is >= 3.4σ for that bucket
```

`n_min(bucket) = max(200, ⌈2·p·(1−p)·(3.4/0.05)²⌉)`, with **p taken from the
A-set rates already banked in §6.1** — ex ante in the only sense that matters
here: the floors are computed from data that has already been seen and frozen
below, never from the data that will judge them.

```text
        band0  band1  band2  band3  band4
cell 0    211    200    200    200    200
cell 1    200    200    200    462    200
cell 2    651    493    435    388    418
cell 3   1074    923    610    529    450
cell 4    883   1007    971    780    632
cell 5   1376    966   1034   1712    585
cell 6   2220   1958   1734   1233   1032
cell 7   1918   1585    420    200    200
```

A bucket is **GATED iff n_A ≥ n_min AND n_B ≥ n_min**; otherwise it takes the
frozen ladder and is reported, exactly as before. The committed table carries
that decision per row, so the live consumer's ladder and the gate cannot drift
apart.

At the Phase-1 budget nine buckets already clear their own floor. The bucket
that fired — cell 4 × band 2 — needs **4.15×** its 235 attempts, so the budget
rises to **18,000 moments per set** (≈4.5×, ≈787 matches), which is what a
targeted top-up means here: more of the same census under the same rules, sized
by the floors above.

### 7.2 A FRESH held-out split (ruling #19.2)

Set A extends the existing block (seeds 750,000+). **Set B is a fresh block,
seeds 770,000+** — the 760,000+ split has been looked at and cannot judge the
redraw. C2 and C3R are both computed against the fresh B.

**Every candidate at every accepted moment is still forked.** "Targeted" sizes
the budget, never the sampling: forking only the buckets that need filling
would bias the cell rows and the marginal, which are the ladder's own rungs.

### 7.3 What is forbidden here, restated

Re-running the old check on the old data with a new number — in either
direction. C3R is a new floor on a new split, with the tolerance and the gate
text untouched.

### 7.4 Result

*(frozen on completion)*

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -C 10 'v4|composition|quintile|heldOut|heldout|score.*table|predicted' scripts/probes/eds-e5a-value-census.ts | head -n 360"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
2-// Authority: docs/world-model/EDS-E5-VALUE-AXIS.md §2.1, §4
3-//
4-// E4 round 1: the perceived chooser picks argmax P(clean reception) and
5-// combination play collapses, because the measured axis is half a decision.
6-// Football wants P(success) x WHAT THE BALL IS WORTH THERE, and rulings #8/#9
7-// forbid inventing the second half. So it gets measured, by the same move
8-// E2b-0 made for the corridor read: E2a-2's fork-and-force staging, VERBATIM,
9-// with the follow extended past the reception to record what happened NEXT.
10-//
11-// Two gates carry this file. X5b: the reception-outcome census must come back
12:// byte-equal to E2a-2's and the threat quintiles byte-equal to E2b-0's, because
13-// only a longer follow was added and a forward simulation cannot change its own
14-// past. V4: the product P-hat x V-hat must predict the conjunction it claims to
15:// estimate — clean reception AND a shot — which is what makes the composition a
16-// measurement instead of a weight.
17-//
18-// Inherited header from the staging this reuses:
19-// EDS E2a-2 OPTION-SPACE CENSUS (counterfactual). At each real decision moment
20-// the full candidate set is enumerated, the deterministic world is forked per
21-// candidate, and the intervention is on TARGET CHOICE ONLY — power, lead, aim
22-// spray, offside and bookkeeping all run the live machinery.
23-import { createHash } from 'node:crypto';
24-import {
25-  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
--
466-    chosenOutOfWindow,
467-  };
468-};
469-
470-const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
471-  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);
472-const valueRowsEqual = (left: ValueZoneRow, right: ValueZoneRow): boolean =>
473-  (Object.keys(left) as (keyof ValueZoneRow)[]).every((key) => left[key] === right[key]);
474-const canonical = (value: unknown): string => JSON.stringify(value);
475-
476:/** E2b-0's quintile machinery, unchanged — X5b re-derives its curve. */
477:const quintilesBy = (forks: readonly Fork[], value: (read: EvaluatorRead) => number) => {
478-  const priced = forks
479-    .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
480-    .map((fork) => ({ fork, key: value(fork.read!) }))
481-    .sort((left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess);
482-  const size = Math.floor(priced.length / QUINTILES);
483-  return Array.from({ length: QUINTILES }, (_, index) => {
484-    const from = index * size;
485-    const to = index === QUINTILES - 1 ? priced.length : from + size;
486-    const slice = priced.slice(from, to);
487-    const wins = slice.filter((entry) => succeeded(entry.fork)).length;
488-    return {
489:      quintile: index,
490-      n: slice.length,
491-      keyFrom: slice.length === 0 ? 0 : slice[0].key,
492-      keyTo: slice.length === 0 ? 0 : slice[slice.length - 1].key,
493-      realizedSuccess: slice.length === 0 ? 0 : wins / slice.length,
494-    };
495-  });
496-};
497-
498-const threatQuintilePriceFrom = (
499-  rows: readonly { keyTo: number; realizedSuccess: number }[], threatSeconds: number,
500-): number => {
501-  for (const row of rows) if (threatSeconds <= row.keyTo) return row.realizedSuccess;
502-  return rows[rows.length - 1].realizedSuccess;
503-};
504-
505-/**
506: * The composition, exactly as the live chooser will do it (contract §2.1): the
507- * information class picks WHICH census answers on each half, and the two halves
508- * multiply. Nothing here is weighted by hand.
509- */
510-const composeScore = (
511-  fork: Fork,
512-  threatRows: readonly { keyTo: number; realizedSuccess: number }[],
513-  valueTable: readonly ValueZoneRow[],
514-  valueMarginal: ValueZoneRow,
515-  usableZones: ReadonlySet<number>,
516-): { p: number; v: number; score: number } => {
517-  let p: number;
518-  if (fork.infoClass === 'UNSEEN') p = OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate;
519-  else if (fork.infoClass === 'SEEN-UNREAD') p = fork.bandSuccess;
520-  else p = threatQuintilePriceFrom(threatRows, fork.read!.threatSeconds);
521-  const cell = fork.perceivedZone;
522-  const v = cell >= 0 && usableZones.has(cell)
523-    ? valueTable[cell].shotRate : valueMarginal.shotRate;
524-  return { p, v, score: p * v };
525-};
526-
527:/** Bin by a predicted quantity and report what the world actually did (V4). */
528-const scoreQuintiles = (
529-  scored: readonly { fork: Fork; key: number }[],
530-) => {
531-  const sorted = [...scored].sort(
532-    (left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess,
533-  );
534-  const size = Math.floor(sorted.length / QUINTILES);
535-  return Array.from({ length: QUINTILES }, (_, index) => {
536-    const from = index * size;
537-    const to = index === QUINTILES - 1 ? sorted.length : from + size;
538-    const slice = sorted.slice(from, to);
539-    const n = slice.length;
540-    return {
541:      quintile: index,
542-      n,
543-      meanPredicted: n === 0 ? 0 : slice.reduce((sum, entry) => sum + entry.key, 0) / n,
544-      realizedConjunction: n === 0 ? 0 : slice.filter((entry) => conjunction(entry.fork)).length / n,
545-      // NOT the unconditional shot rate: `shot` is only ever recorded for clean
546-      // receptions, because the window is only simulated for them (the
547-      // conjunction is false by construction otherwise). Kept so the identity
548-      // with `realizedConjunction` is visible rather than implied — see R3.
549-      realizedShotAmongClean: n === 0 ? 0
550-        : slice.filter((entry) => entry.fork.shot).length / n,
551-      realizedSuccess: n === 0 ? 0 : slice.filter((entry) => succeeded(entry.fork)).length / n,
--
556-const spreadOf = (bins: readonly { realizedConjunction: number; n: number }[]): number => {
557-  const rates = bins.filter((bin) => bin.n > 0).map((bin) => bin.realizedConjunction);
558-  return rates.length === 0 ? 0 : Math.max(...rates) - Math.min(...rates);
559-};
560-
561-const runExperiment = () => {
562-  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
563-  const census = runCensus(CENSUS_SEED_START);
564-  const holdout = runCensus(HOLDOUT_SEED_START);
565-
566:  const threatA = quintilesBy(census.forkRecords, (read) => read.threatSeconds);
567-
568-  // V1: which cells are measurements. The held-out GATES (V2/V3) need the cell
569-  // measured in both sets; the COMPOSITION uses the rule the live consumer can
570-  // actually apply, which sees only the committed set-A table — `valueZoneAt`'s
571-  // own floor. Keeping the two separate is what stops the probe from simulating
572-  // a chooser the game cannot be.
573-  const gatedZones = new Set<number>(census.valueTable
574-    .filter((row, index) => row.receptions >= ZONE_SAMPLE_FLOOR
575-      && holdout.valueTable[index].receptions >= ZONE_SAMPLE_FLOOR)
576-    .map((row) => row.zone));
--
592-
593-  // V4, gated on set A; the same computation on set B with A's table reported
594-  // beside it (contract §4, settled before implementation).
595-  const playableA = census.forkRecords.filter((fork) => fork.outcome !== 'unplayable');
596-  const playableB = holdout.forkRecords.filter((fork) => fork.outcome !== 'unplayable');
597-  const compose = (fork: Fork) => composeScore(
598-    fork, threatA, census.valueTable, census.valueMarginal, usableZones,
599-  );
600-  const scoredA = playableA.map((fork) => ({ fork, key: compose(fork).score }));
601-  const scoredB = playableB.map((fork) => ({ fork, key: compose(fork).score }));
602:  const compositionA = scoreQuintiles(scoredA);
603:  const compositionB = scoreQuintiles(scoredB);
604-  const marginalPredictedA = scoredA.length === 0
605-    ? 0 : scoredA.reduce((sum, entry) => sum + entry.key, 0) / scoredA.length;
606-  const marginalRealizedA = scoredA.length === 0
607-    ? 0 : scoredA.filter((entry) => conjunction(entry.fork)).length / scoredA.length;
608-  const marginalPredictedB = scoredB.length === 0
609-    ? 0 : scoredB.reduce((sum, entry) => sum + entry.key, 0) / scoredB.length;
610-  const marginalRealizedB = scoredB.length === 0
611-    ? 0 : scoredB.filter((entry) => conjunction(entry.fork)).length / scoredB.length;
612-
613-  // R4: which half carries the discrimination, same forks, both ways.
--
651-      && VALUE_ZONE_TABLE.every((row, index) => valueRowsEqual(row, census.valueTable[index]))
652-      && valueRowsEqual(VALUE_ZONE_MARGINAL, census.valueMarginal),
653-  };
654-  const coverage = {
655-    v1GatedCells: gatedZones.size,
656-    v1AtLeastFourGated: gatedZones.size >= 4,
657-  };
658-  const discrimination = {
659-    v2Discriminates: v2Discrimination >= V2_DISCRIMINATION_FLOOR,
660-  };
661:  const heldOut = {
662-    v3Cells: valueCalibration.filter((row) => row.gated)
663-      .every((row) => row.error <= V3_CELL_TOLERANCE),
664-    v3Marginal: Math.abs(census.valueMarginal.shotRate - holdout.valueMarginal.shotRate)
665-      <= V3_MARGINAL_TOLERANCE,
666-  };
667:  const composition = {
668:    v4aDiscriminates: Math.abs(
669:      compositionA[QUINTILES - 1].realizedConjunction - compositionA[0].realizedConjunction,
670-    ) >= V4A_DISCRIMINATION_FLOOR,
671:    v4bQuintiles: compositionA.every(
672-      (bin) => Math.abs(bin.meanPredicted - bin.realizedConjunction) <= V4B_QUINTILE_TOLERANCE),
673:    v4bMarginal: Math.abs(marginalPredictedA - marginalRealizedA) <= V4B_MARGINAL_TOLERANCE,
674:    v4cCoverage: compositionA.every((bin) => bin.n >= V4C_QUINTILE_FLOOR),
675-  };
676-
677-  const pass = Object.values(exact).every(Boolean)
678-    && coverage.v1AtLeastFourGated
679-    && Object.values(discrimination).every(Boolean)
680:    && Object.values(heldOut).every(Boolean)
681:    && Object.values(composition).every(Boolean);
682-
683-  return {
684-    experiment: 'EDS-E5a',
685-    authority: 'EDS-E5-VALUE-AXIS',
686-    parameters: {
687-      censusSeedStart: CENSUS_SEED_START,
688-      holdoutSeedStart: HOLDOUT_SEED_START,
689-      momentsPerSet: MOMENTS_PER_SET,
690-      awareness: AWARENESS,
691-      valueHorizonTicks: VALUE_HORIZON_TICKS,
692-      zoneSampleFloor: ZONE_SAMPLE_FLOOR,
693-      v2DiscriminationFloor: V2_DISCRIMINATION_FLOOR,
694-      v3CellTolerance: V3_CELL_TOLERANCE,
695:      v4aDiscriminationFloor: V4A_DISCRIMINATION_FLOOR,
696:      v4bQuintileTolerance: V4B_QUINTILE_TOLERANCE,
697-    },
698-    harness,
699-    census: {
700-      moments: census.moments,
701-      matches: census.matches,
702-      forks: census.forks,
703-      receptions: census.receptions,
704-      table: census.table,
705-      marginal: census.marginal,
706-      valueTable: census.valueTable,
--
708-    },
709-    holdout: {
710-      forks: holdout.forks,
711-      receptions: holdout.receptions,
712-      valueTable: holdout.valueTable,
713-      valueMarginal: holdout.valueMarginal,
714-    },
715-    threatQuintilesA: threatA,
716-    valueCalibration,
717-    v2Discrimination,
718:    compositionA,
719:    compositionB,
720:    compositionMarginal: {
721:      predictedA: marginalPredictedA,
722-      realizedA: marginalRealizedA,
723:      predictedB: marginalPredictedB,
724-      realizedB: marginalRealizedB,
725-    },
726-    reported: {
727-      r2RivalValueDefinitions: census.valueTable.map((row) => ({
728-        zone: row.zone,
729-        receptions: row.receptions,
730-        shotRate: row.shotRate,
731-        goalRate: row.goalRate,
732-        meanProgression: row.meanProgression,
733-      })),
734-      /**
735-       * R3 AS CONTRACTED IS NOT MEASURABLE IN THIS STAGING, and saying so is
736-       * cheaper than a column that looks like an answer. The contract asked for
737:       * the unconditional shot-within-window rate per composed quintile; §2.1
738-       * simulates the window only for clean receptions, because for every other
739-       * fork the conjunction is false by definition and following it buys
740-       * nothing the gates need. So `shotAmongClean` below is identically
741-       * `realizedConjunction`. Answering R3 honestly would cost ~45% more
742-       * simulation for a reported-only number; it is left unmeasured, not
743-       * faked.
744-       */
745-      r3UnconditionalShot: {
746-        measurable: false,
747-        why: 'the window is simulated only for clean receptions (contract §2.1)',
748:        shotAmongClean: compositionA.map((bin) => ({
749:          quintile: bin.quintile, n: bin.n, shot: bin.realizedShotAmongClean,
750-        })),
751-      },
752-      r4WhichHalfCarries: {
753:        composedSpread: spreadOf(compositionA),
754-        pOnlySpread: spreadOf(pOnly),
755-        vOnlySpread: spreadOf(vOnly),
756-        pOnly,
757-        vOnly,
758-      },
759-      r5ArgmaxChange: {
760-        moments: argmaxMoments,
761-        differs: argmaxDiffers,
762-        share: argmaxMoments === 0 ? 0 : argmaxDiffers / argmaxMoments,
763-      },
--
771-        meanTicks: census.receptions === 0 ? 0
772-          : census.forkRecords.filter(succeeded)
773-            .reduce((sum, fork) => sum + fork.followTicks, 0) / census.receptions,
774-        truncated: census.forkRecords.filter(
775-          (fork) => succeeded(fork) && fork.followTicks < VALUE_HORIZON_TICKS).length,
776-      },
777-    },
778-    exact,
779-    coverage: { ...coverage, usableCells: usableZones.size },
780-    discrimination: { spread: v2Discrimination, ...discrimination },
781:    heldOut,
782:    composition,
783-    verdict: pass ? 'PASS' : 'FAIL',
784-  };
785-};
786-
787-const first = runExperiment();
788-const second = runExperiment();
789-const firstJson = canonical(first);
790-const deterministic = firstJson === canonical(second);
791-const sha256 = createHash('sha256').update(firstJson).digest('hex');
792-const output = { ...first, deterministic, sha256 };
793-if (!deterministic) output.verdict = 'FAIL';
794-console.log(JSON.stringify(output, null, 2));
795-console.error(
796-  `EDS-E5a ${output.verdict} · X5a ${output.exact.x5aHarnessReproduces}`
797-  + ` · X5b E2a-2 ${output.exact.x5bReproducesE2a2} / E2b-0 ${output.exact.x5bReproducesE2b0}`
798-  + ` · X6 ${output.exact.x6CommittedValueTableMatches}`
799-  + ` · receptions ${output.census.receptions}`
800-  + ` · V ${output.census.valueTable.map((row) => (row.shotRate * 100).toFixed(1)).join('/')}`
801-  + ` (marginal ${(output.census.valueMarginal.shotRate * 100).toFixed(2)}%)`
802-  + ` · V2 ${(output.v2Discrimination * 100).toFixed(2)}pp`
803:  + ` · V4 predicted ${output.compositionA.map((bin) => (bin.meanPredicted * 100).toFixed(1)).join('/')}`
804:  + ` vs realized ${output.compositionA.map((bin) => (bin.realizedConjunction * 100).toFixed(1)).join('/')}`
805-  + ` · argmax differs ${(output.reported.r5ArgmaxChange.share * 100).toFixed(1)}%`
806-  + ` · SHA ${sha256}`,
807-);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '560,700p' scripts/probes/eds-e2b1-both-sides-ab.ts; rg -n 'chosen counts|chosenCounts|chosen:' docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md scripts/probes/eds-e2b1-both-sides-ab.ts scripts/probes/eds-e2b1r-consumption-scoped.ts | head -n 100"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
    seed < CENSUS_SEED_START + MAX_MATCHES_PER_SET && sampled < AB_MOMENTS;
    seed++
  ) {
    const match = matchOf(seed);
    const memories = ARMS.map(() => new Map<number, PerceptionMemory>());
    const snapshots = ARMS.map(() => new Map<number, PerceptionSnapshot>());
    for (const player of match.allPlayers) {
      if (player.role === 'GK') continue;
      memories.forEach((memory) => memory.set(player.gid, createPerceptionMemory()));
    }
    let key = '';
    while (!match.finished && sampled < AB_MOMENTS) {
      const before = cloneSimulationState(match);
      const kindBefore = match.lastPassKind;
      const truth = capturePerceptionTruth(match);
      ARMS.forEach((arm, index) => {
        for (const player of match.allPlayers) {
          if (player.role === 'GK' || player.sentOff) continue;
          snapshots[index].set(player.gid, arm.oracle
            ? oraclePerceptionSnapshot(truth, player.gid)
            : perceiveSnapshot(truth, player.gid, arm.awareness, seed, memories[index].get(player.gid)!));
        }
      });
      match.step(DT);
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null) continue;
      key = fresh;
      const pending = match.pendingPass!;
      const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
      if (!passerBefore) continue;
      const candidates = before.teams[passerBefore.side].players.filter((player) => (
        player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
        && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
        && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
      ));
      if (candidates.length === 0) continue;
      sampled += 1;
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed, accel: player.accel, dribbling: player.attrs.dribbling,
        }]),
      );
      const attackDir = before.teams[passerBefore.side].attackDir;

      ARMS.forEach((arm, index) => {
        const acc = arms[index];
        acc.moments += 1;
        const snapshot = snapshots[index].get(pending.passerGid);
        if (snapshot === undefined) return;
        const priced = candidates.map((candidate) => priceOption(
          snapshot, pending.passerGid, candidate, attackDir, reachProfiles, factors,
        ));
        acc.options += priced.length;
        for (const option of priced) {
          if (option.infoClass === 'READ') acc.read += 1;
          else if (option.infoClass === 'SEEN-UNREAD') acc.seenUnread += 1;
          else acc.unseen += 1;
        }
        const executable = priced.filter((option) => option.executable);
        const blind = priced.filter((option) => !option.executable);
        if (executable.length === 0) return;
        // Look-pressure on both axes (ruling #9.3 (d)).
        const bestExecutable = executable.reduce(
          (best, option) => (option.price > best.price
            || (option.price === best.price && option.targetGid < best.targetGid) ? option : best),
        );
        if (blind.length > 0) {
          if (blind[0].price > bestExecutable.price) acc.lookRead += 1;
          const bestExecutableBand = Math.max(...executable.map(
            (option) => (Number.isNaN(option.distance)
              ? OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate
              : optionSpacePriorAt(option.distance).receptionSuccessRate),
          ));
          if (blind[0].price > bestExecutableBand) acc.lookBand += 1;
        }
        acc.chosen += 1;
        acc.distance += bestExecutable.distance;
        if (bestExecutable.distance >= AB_LONG_METRES) acc.long += 1;
        if (bestExecutable.targetGid === pending.targetGid) acc.agrees += 1;
        // Fork and force the arm's own choice; the defence reads its own ball.
        const fork = cloneSimulationState(before);
        (fork as unknown as { edsPerceivedDefence: boolean }).edsPerceivedDefence = !arm.oracle;
        (fork as unknown as { edsAwareness: number }).edsAwareness = arm.awareness;
        if (!arm.oracle) {
          for (const [gid, memory] of memories[index]) {
            fork.perceptionMemories.set(gid, cloneMemory(memory));
          }
        }
        fork.forcedPassTarget = bestExecutable.targetGid;
        fork.step(DT);
        fork.forcedPassTarget = null;
        const fp = fork.pendingPass;
        if (!fp || fp.targetGid !== bestExecutable.targetGid) return;
        const kickTick = fork.simTick;
        let toucherGid = -1;
        let reached = false;
        for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
          fork.step(DT);
          const toucher = fork.ball.lastTouch;
          if (toucher && toucher.gid !== pending.passerGid) {
            toucherGid = toucher.gid;
            reached = toucher.gid === bestExecutable.targetGid;
            break;
          }
          if (fork.phase !== 'playing') break;
        }
        if (!reached) return;
        const touchTick = fork.simTick;
        for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
          fork.step(DT);
        }
        const event = fork.firstTouchTrace.find((trace) => (
          trace.gid === toucherGid && trace.intendedTarget
          && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
        ));
        if (event === undefined || event.clean) acc.wins += 1;
      });
    }
  }
  return ARMS.map((arm, index): ArmResult => {
    const acc = arms[index];
    const share = (count: number) => (acc.options === 0 ? 0 : count / acc.options);
    return {
      awareness: arm.awareness,
      oracle: arm.oracle,
      moments: acc.moments,
      chosen: acc.chosen,
      realizedSuccess: acc.chosen === 0 ? 0 : acc.wins / acc.chosen,
      classShares: { READ: share(acc.read), 'SEEN-UNREAD': share(acc.seenUnread), UNSEEN: share(acc.unseen) },
      meanChosenDistance: acc.chosen === 0 ? 0 : acc.distance / acc.chosen,
      longShare: acc.chosen === 0 ? 0 : acc.long / acc.chosen,
      agreesWithBrain: acc.chosen === 0 ? 0 : acc.agrees / acc.chosen,
      lookPressureReadAxis: acc.moments === 0 ? 0 : acc.lookRead / acc.moments,
      lookPressureBandAxis: acc.moments === 0 ? 0 : acc.lookBand / acc.moments,
    };
  });
};

// --- X5: re-derive E2b-0's curve as its two factors --------------------------
const deriveFactors = (forks: readonly Fork[]): QuintileFactors[] => {
  const priced = forks
scripts/probes/eds-e2b1r-consumption-scoped.ts:111:  chosen: [2247, 2404, 2504, 2573],
scripts/probes/eds-e2b1r-consumption-scoped.ts:217:  readonly chosen: boolean;
scripts/probes/eds-e2b1r-consumption-scoped.ts:252:      chosen: false, read, bandSuccess: 0,
scripts/probes/eds-e2b1r-consumption-scoped.ts:543:  readonly chosen: number;
scripts/probes/eds-e2b1r-consumption-scoped.ts:578:    moments: 0, chosen: 0, wins: 0, distance: 0, long: 0, agrees: 0,
scripts/probes/eds-e2b1r-consumption-scoped.ts:723:      chosen: acc.chosen,
scripts/probes/eds-e2b1r-consumption-scoped.ts:856:    chosenCounts: same(arms.map((a) => a.chosen), E2B1_BANKED.chosen),
scripts/probes/eds-e2b1-both-sides-ab.ts:192:  readonly chosen: boolean;
scripts/probes/eds-e2b1-both-sides-ab.ts:227:      chosen: false, read, bandSuccess: 0,
scripts/probes/eds-e2b1-both-sides-ab.ts:518:  readonly chosen: number;
scripts/probes/eds-e2b1-both-sides-ab.ts:553:    moments: 0, chosen: 0, wins: 0, distance: 0, long: 0, agrees: 0,
scripts/probes/eds-e2b1-both-sides-ab.ts:686:      chosen: acc.chosen,

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node -e 'const arms=[[\"0.2\",2247,.632844],[\"0.5\",2404,.646007],[\"0.8\",2504,.634585],[\"oracle\",2573,.678974]]; for(const [a,n,p] of arms) console.log(a,\"wins\",n*p,\"all3000\",n*p/3000,\"missing\",3000-n); const p1=.646007,p2=.634585,n=3000,d=p2-p1,se=Math.sqrt(p1*(1-p1)/n+p2*(1-p2)/n); console.log(\"G1\",d,se,d-1.644854*se,d-1.959964*se,d+1.959964*se); for(const q of [[.8,.841621],[.9,1.281552]]) console.log(\"nreq\",q[0],2*.64*.36*Math.pow(1.644854+q[1],2)/.0004); const np=608/.4016,nc=1567/.5177,pp=.0489,pc=.038,dd=pp-pc,se2=Math.sqrt(pp*(1-pp)/np+pc*(1-pc)/nc); console.log(\"attempt\",np,nc,dd,se2,dd-1.959964*se2,dd+1.959964*se2,dd/se2); const hm=.0338,sehm=.0132; console.log(\"HM\",hm+1.644854*sehm,hm-1.959964*sehm,hm+1.959964*sehm); console.log(\"sign\",6/32,1/32,8/128); for(const rho of [.005,.01,.02,.05,.1]) console.log(\"DE\",rho,1+232*rho,1+2.36*rho)'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
0.2 wins [33m1422.000468[39m all3000 [33m0.474000156[39m missing [33m753[39m
0.5 wins [33m1553.000828[39m all3000 [33m0.5176669426666667[39m missing [33m596[39m
0.8 wins [33m1589.00084[39m all3000 [33m0.5296669466666667[39m missing [33m496[39m
oracle wins [33m1747.000102[39m all3000 [33m0.5823333673333333[39m missing [33m427[39m
G1 [33m-0.011422000000000043[39m [33m0.012390437626465554[39m [33m-0.03180246089164242[39m [33m-0.03570681169211798[39m [33m0.012862811692117889[39m
nreq [33m0.8[39m [33m7122.306730319999[39m
nreq [33m0.9[39m [33m9865.55759251507[39m
attempt [33m1513.9442231075698[39m [33m3026.8495267529456[39m [33m0.0109[39m [33m0.006541981627616997[39m [33m-0.0019220484787907197[39m [33m0.023722048478790718[39m [33m1.666161817695362[39m
HM [33m0.05551207279999999[39m [33m0.007928475199999997[39m [33m0.0596715248[39m
sign [33m0.1875[39m [33m0.03125[39m [33m0.0625[39m
DE [33m0.005[39m [33m2.16[39m [33m1.0118[39m
DE [33m0.01[39m [33m3.32[39m [33m1.0236[39m
DE [33m0.02[39m [33m5.64[39m [33m1.0472[39m
DE [33m0.05[39m [33m12.600000000000001[39m [33m1.1179999999999999[39m
DE [33m0.1[39m [33m24.200000000000003[39m [33m1.236[39m
(node:82087) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n '"'^### G1|''^### G2|''^### C3|''^### V4|''^### M2|''^### R —|''^### NO-STRICT|''^### CO-EVOLUTION|''^### CE2R|''^### 5'"\\.2 CE2R|"'^### 5'"\\.4 CO|"'^### 5'"\\.2 §2|"'^### 7'"\\.2 \\(b\\)|"'^### 7'"\\.3 Attribution|"'^### 6'"\\.1 Phase 0|"'^#### C2|''^#### ⛔ C3|''^### 7'"\\.1 What changes|"'^### 7'"\\.2 A FRESH' docs/world-model/EDS-*.md; rg -n 'const threatA|const threatB|chosen: \\[|realizedSuccess: acc.chosen|quintilesBy\\(holdout|compositionA|compositionB' scripts/probes/eds-e2b0-threat-calibration.ts scripts/probes/eds-e2b1-both-sides-ab.ts scripts/probes/eds-e2b1r-consumption-scoped.ts scripts/probes/eds-e5a-value-census.ts; rg -n 'COMMANDER RULING #1[4-9]|CE1.s honest weight|attacking runaway' docs/world-model/PROGRAMME.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:128:### G1 — NOT-LOOKING MUST NOT WIN (ruling #7 (d))
docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:140:### G2 — ROUTE MIX (ruling #7 (e))
docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:118:### C3 — HELD-OUT CALIBRATION (interval test)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:102:### NO-STRICT-DOMINANCE (the E0 canary, now live)
docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:115:### CO-EVOLUTION RESTORATION
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:140:### C3 — THE AXIS IS A MEASUREMENT
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:148:### R — **THE RE-RANK JUDGMENT** (the thing Phase 0 exists to decide)
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:201:### 6.1 Phase 0 — RUN 2026-07-26: **THE AXIS RE-RANKS, and Phase 0 is still non-PASS**
docs/world-model/EDS-E5D-ATTEMPT-VALUE.md:277:#### ⛔ C3's calibration FAILED, narrowly, and it is a Phase-1 design fact
docs/world-model/EDS-E5D-PHASE1.md:145:### C3 — THE AXIS IS A MEASUREMENT
docs/world-model/EDS-E5D-PHASE1.md:228:#### C2 — the gate this whole phase existed to fix, PASSES
docs/world-model/EDS-E5D-PHASE1.md:262:#### ⛔ C3's held-out bucket check FAILED — one bucket, and my tolerance was mis-powered
docs/world-model/EDS-E5D-PHASE1.md:318:### 7.1 What changes and what does not
docs/world-model/EDS-E5D-PHASE1.md:356:### 7.2 A FRESH held-out split (ruling #19.2)
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:98:### CE2R — style diversity, gated ecologically
docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:190:### 5.2 CE2R — style diversity holds, and E3R's 0.58 was the low tail
docs/world-model/EDS-E5-VALUE-AXIS.md:192:### V4 — COMPOSITION CALIBRATION (the anti-hand-weight gate)
docs/world-model/EDS-E5-VALUE-AXIS.md:274:### NO-STRICT-DOMINANCE
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:122:### NO-STRICT-DOMINANCE (constraint (e), purpose documented)
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:139:### CO-EVOLUTION RESTORATION + STYLE (constraint (c))
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:238:### 5.2 §2 EQUILIBRIUM BAND — ALL FIVE DIMENSIONS IN BAND
docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:276:### 5.4 CO-EVOLUTION RESTORATION — PASS: the advantage decays by 90%
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:208:### M2 — THE STATE-BLINDNESS TEST (interval test, powered ex ante)
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:350:### 7.2 (b) The HM state-blindness test — **HM REFUTED**, narrowly, with the direction right
docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:384:### 7.3 Attribution — **NEITHER fires, and the third cause is visible in these numbers**
scripts/probes/eds-e2b0-threat-calibration.ts:449:  const threatA = quintilesBy(census.forkRecords, (read) => read.threatSeconds);
scripts/probes/eds-e2b0-threat-calibration.ts:450:  const threatB = quintilesBy(holdout.forkRecords, (read) => read.threatSeconds);
scripts/probes/eds-e2b1r-consumption-scoped.ts:111:  chosen: [2247, 2404, 2504, 2573],
scripts/probes/eds-e2b1r-consumption-scoped.ts:724:      realizedSuccess: acc.chosen === 0 ? 0 : acc.wins / acc.chosen,
scripts/probes/eds-e2b1-both-sides-ab.ts:687:      realizedSuccess: acc.chosen === 0 ? 0 : acc.wins / acc.chosen,
scripts/probes/eds-e5a-value-census.ts:566:  const threatA = quintilesBy(census.forkRecords, (read) => read.threatSeconds);
scripts/probes/eds-e5a-value-census.ts:602:  const compositionA = scoreQuintiles(scoredA);
scripts/probes/eds-e5a-value-census.ts:603:  const compositionB = scoreQuintiles(scoredB);
scripts/probes/eds-e5a-value-census.ts:669:      compositionA[QUINTILES - 1].realizedConjunction - compositionA[0].realizedConjunction,
scripts/probes/eds-e5a-value-census.ts:671:    v4bQuintiles: compositionA.every(
scripts/probes/eds-e5a-value-census.ts:674:    v4cCoverage: compositionA.every((bin) => bin.n >= V4C_QUINTILE_FLOOR),
scripts/probes/eds-e5a-value-census.ts:718:    compositionA,
scripts/probes/eds-e5a-value-census.ts:719:    compositionB,
scripts/probes/eds-e5a-value-census.ts:748:        shotAmongClean: compositionA.map((bin) => ({
scripts/probes/eds-e5a-value-census.ts:753:        composedSpread: spreadOf(compositionA),
scripts/probes/eds-e5a-value-census.ts:803:  + ` · V4 predicted ${output.compositionA.map((bin) => (bin.meanPredicted * 100).toFixed(1)).join('/')}`
scripts/probes/eds-e5a-value-census.ts:804:  + ` vs realized ${output.compositionA.map((bin) => (bin.realizedConjunction * 100).toFixed(1)).join('/')}`
488:> **COMMANDER RULING #14 (2026-07-26 — E3R2 accepted 29/29; E4 opens):**
500:> 2. **CE1's honest weight registered:** advantage-shrink held in 2/5
502:>    attacking runaway ANYWHERE to restore from, which satisfies the
524:> **COMMANDER RULING #15 (2026-07-26 — E4 round 1 disposed; the value
576:> **COMMANDER RULING #16 (2026-07-26 — E5's split verdict; the
628:> **COMMANDER RULING #17 (2026-07-26 — E5c: both hypotheses refuted,
678:> **COMMANDER RULING #18 (2026-07-26 — E5d Phase 0: the axis re-ranks;
727:> **COMMANDER RULING #19 (2026-07-26 — Phase 1's stop; C3 redrawn on
878:| E3R2 | Narrow re-audit (ruling #13.5): CE2R five-seed median style entropy + X5R2 lazy PULL perception under perpetual pins | [`EDS-E3R2-NARROW-REAUDIT.md`](EDS-E3R2-NARROW-REAUDIT.md) | ✅ **PASS 2026-07-26 — ALL 29 GATES; the queue reaches E4** (§5, world SHA `3cbb8b8c…456f`, world-deterministic across two invocations with perf beside it, fingerprint `57b0bdab…c673` unchanged, **751/751**, nothing shipped). ⭐⭐ **X5R2 — perception is PULL, and provably the same perception**: P1's perpetual pin (7/7, `tests/lazyPerception.test.ts`) has lazy and eager snapshots **field-for-field identical at every brain tick** across awareness 0.2/0.5/0.8/1.0; P2 gives identical world signatures AND identical choice traces on 3 seeds; **P3 returns 17/17 of E3R's banked live numbers BIT-IDENTICAL**, which is what makes ruling #13.5's transfer of the 26 rigorous rather than assumed. **Perf 1.32–1.38× → 1.1977× mean / 1.1529× p95** (budget 1.25/1.50) purely by computing when asked instead of when possible — scan cadence, FOV, retention and keyed error all untouched. ⚠️ One measured one-directional difference, pinned by its own companion test: pulled BETWEEN brain ticks (which no live consumer does) the pull is merely UP TO DATE — self proprioception current, retention expired — never better informed. ⭐⭐ **CE2R — style diversity HOLDS ecologically: median entropy ratio 1.5253** over five fresh seeds (0.779 · 1.525 · 3.405 · 1.466 · 1.922 — **four of five ABOVE 1.0**, i.e. the bundle usually leaves a world with MORE variety), nameplates 16/16 on every seed, and all three mechanism co-gates pass on the median (M1 +0.044 clubs not more alike · M2 +0.174 genome expresses no weaker · M3 0.454 the chooser is club-dependent). E3R's 0.5797 was the low tail of a heavy-tailed statistic ⇒ ruling #13.2's diagnosis confirmed, **the preference-seat fork stays closed**. ⚠️ Reported, not gated (CE1 is banked by ruling #13.1): across these five fresh seeds the advantage-shrink holds on only **2/5**, and the paired goal delta is mostly NEGATIVE and seed-noisy — there is no attacking runaway to restore from, but if CE1 is ever to carry weight in a ship decision it needs CE2's multi-seed treatment. |

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -C 10 'controls|control|patternArm|patternFork|clean.*pattern|clean.*control' scripts/probes/eds-e5c-pattern-value.ts | head -n 320"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
1-// EDS E5c (b) — THE STATE-BLINDNESS TEST (the HM test).
2-// Authority: docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md §2.2, §5
3-//
4-// (a) removes the sampling defect. Whatever is left is the residual this asks
5-// about: is a cell-indexed value table blind to the STATE a pass is played in?
6-//
7-// The legacy pass loop already knows what a pattern looks like — it grants the
8-// third-man and 2过1 licences by predicate — so those predicates, read from
9-// truth, define the pattern arm. At each moment where one fires, the world is
10-// forked and the pass FORCED to the licensed runner; every OTHER window
11:// candidate at the SAME moment is forked too and forms the control. Both arms
12-// are then compared against what the topped-up table predicts for the
13-// destination they reached.
14-//
15:// That control is the whole design. A table that under-predicts everywhere is
16-// simply miscalibrated — which would be a third finding, not HM. A table that
17-// under-predicts ONLY where the pattern's runner arrives is blind to the state.
18-import { createHash } from 'node:crypto';
19-import {
20-  VALUE_ZONE_MARGINAL, VALUE_ZONE_SAMPLE_FLOOR, VALUE_ZONE_TABLE_TOPPED,
21-  valueZoneAt, valueZoneIndex,
22-} from '../../src/ai/passPrior';
23-import { Match } from '../../src/sim/Match';
24-import type { Player } from '../../src/sim/Player';
25-import { cloneSimulationState } from '../../src/sim/cloneState';
--
147-  const lp = before.lastCompletedPass;
148-  if (lp && lp.receiverGid === passer.gid && before.simTime - lp.t < THIRD_MAN_WINDOW_SECONDS
149-    && lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > THIRD_MAN_MIN_GAIN) {
150-    return 'third-man';
151-  }
152-  return null;
153-};
154-
155-// --- one forced pass, followed to the value horizon -------------------------
156-interface Outcome {
157:  readonly arm: 'pattern' | 'control';
158-  readonly licence: Licence | null;
159-  readonly zone: number;
160-  /** V̂ the topped-up table gives this destination (marginal for starved cells). */
161-  readonly predicted: number;
162-  readonly cleanReception: boolean;
163-  readonly shot: boolean;
164-}
165-
166-const forceAndFollow = (
167-  before: Match,
168-  passerGid: number,
169-  candidate: Player,
170:  arm: 'pattern' | 'control',
171-  licence: Licence | null,
172-): Outcome | null => {
173-  const passerBefore = before.allPlayers.find((player) => player.gid === passerGid);
174-  if (!passerBefore) return null;
175-  const attacking = before.teams[passerBefore.side];
176-  const zone = valueZoneIndex(attacking.localX(candidate.pos.x), candidate.pos.y);
177-  const predicted = valueZoneAt(attacking.localX(candidate.pos.x), candidate.pos.y).shotRate;
178-  const fork = cloneSimulationState(before);
179-  fork.forcedPassTarget = candidate.gid;
180-  fork.step(DT);
--
257-    const candidates = attacking.players.filter((player) => (
258-      player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
259-      && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
260-      && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
261-    ));
262-    if (candidates.length < 2) continue;
263-    const licences = new Map<number, Licence | null>(
264-      candidates.map((mate) => [mate.gid, licenceFor(before, passerBefore, mate)]),
265-    );
266-    const licensed = candidates.filter((mate) => licences.get(mate.gid) !== null);
267:    // Pattern-ACTIVE moments only: no licence, no comparison. The control is
268-    // drawn from the same moments so both arms share their world.
269-    if (licensed.length === 0) continue;
270-    for (const mate of candidates) {
271-      const licence = licences.get(mate.gid) ?? null;
272-      const outcome = forceAndFollow(
273:        before, pending.passerGid, mate, licence === null ? 'control' : 'pattern', licence,
274-      );
275-      if (outcome !== null) outcomes.push(outcome);
276-    }
277-  }
278-  return outcomes;
279-};
280-
281-const summarise = (outcomes: readonly Outcome[]) => {
282-  const clean = outcomes.filter((row) => row.cleanReception);
283-  const n = clean.length;
--
298-};
299-
300-const canonical = (value: unknown): string => JSON.stringify(value);
301-
302-const runExperiment = () => {
303-  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
304-  const outcomes: Outcome[] = [];
305-  let matches = 0;
306-  for (let seed = SEED_START; seed < SEED_START + MAX_MATCHES; seed++) {
307-    const pattern = outcomes.filter((row) => row.arm === 'pattern' && row.cleanReception).length;
308:    const control = outcomes.filter((row) => row.arm === 'control' && row.cleanReception).length;
309:    if (pattern >= ARM_FLOOR && control >= ARM_FLOOR) break;
310-    outcomes.push(...harvestMatch(seed));
311-    matches += 1;
312-  }
313-
314-  const pattern = summarise(outcomes.filter((row) => row.arm === 'pattern'));
315:  const control = summarise(outcomes.filter((row) => row.arm === 'control'));
316-  const thirdMan = summarise(outcomes.filter((row) => row.licence === 'third-man'));
317-  const wallReturn = summarise(outcomes.filter((row) => row.licence === 'wall-return'));
318-
319-  const coverage = {
320-    m1Pattern: pattern.cleanReceptions >= ARM_FLOOR,
321:    m1Control: control.cleanReceptions >= ARM_FLOOR,
322-  };
323-  const hmConfirmed = pattern.gap >= PATTERN_GAP_FLOOR
324:    && Math.abs(control.gap) <= CONTROL_GAP_BAND;
325:  const controlOutOfBand = Math.abs(control.gap) > CONTROL_GAP_BAND;
326-
327-  return {
328-    experiment: 'EDS-E5c-b',
329-    authority: 'EDS-E5C-VALUE-ATTRIBUTION',
330-    parameters: {
331-      seedStart: SEED_START,
332-      maxMatches: MAX_MATCHES,
333-      armFloor: ARM_FLOOR,
334-      patternGapFloor: PATTERN_GAP_FLOOR,
335:      controlGapBand: CONTROL_GAP_BAND,
336-      valueHorizonTicks: VALUE_HORIZON_TICKS,
337-      tableFloor: VALUE_ZONE_SAMPLE_FLOOR,
338-      marginal: VALUE_ZONE_MARGINAL.shotRate,
339-      toppedTable: VALUE_ZONE_TABLE_TOPPED,
340-    },
341-    harness,
342-    matches,
343-    pattern,
344:    control,
345-    m2: {
346-      patternGap: pattern.gap,
347:      controlGap: control.gap,
348-      hmConfirmed,
349-      /** A table wrong everywhere is a third finding, not HM (contract §5). */
350:      controlOutOfBand,
351-    },
352-    reported: {
353-      b1ByPattern: { thirdMan, wallReturn },
354:      b2CellMix: { pattern: pattern.cellMix, control: control.cellMix },
355-      b3Parts: {
356-        pattern: { predicted: pattern.predicted, realized: pattern.realized },
357:        control: { predicted: control.predicted, realized: control.realized },
358-      },
359:      b4CleanRate: { pattern: pattern.cleanRate, control: control.cleanRate },
360-    },
361-    coverage,
362-    verdict: Object.values(coverage).every(Boolean) && harness.every((entry) => entry.reproduces)
363-      ? 'MEASURED' : 'INVALID',
364-  };
365-};
366-
367-const first = runExperiment();
368-const second = runExperiment();
369-const firstJson = canonical(first);
--
371-const sha256 = createHash('sha256').update(firstJson).digest('hex');
372-const output = { ...first, deterministic, sha256 };
373-if (!deterministic) output.verdict = 'INVALID';
374-console.log(JSON.stringify(output, null, 2));
375-console.error(
376-  `EDS-E5c-b ${output.verdict} · harness ${output.harness.every((entry) => entry.reproduces)}`
377-  + ` · pattern n=${output.pattern.cleanReceptions}`
378-  + ` predicted ${(output.pattern.predicted * 100).toFixed(2)}%`
379-  + ` realized ${(output.pattern.realized * 100).toFixed(2)}%`
380-  + ` gap ${(output.m2.patternGap * 100).toFixed(2)}pp`
381:  + ` · control n=${output.control.cleanReceptions}`
382:  + ` predicted ${(output.control.predicted * 100).toFixed(2)}%`
383:  + ` realized ${(output.control.realized * 100).toFixed(2)}%`
384:  + ` gap ${(output.m2.controlGap * 100).toFixed(2)}pp`
385-  + ` · HM ${output.m2.hmConfirmed ? 'CONFIRMED' : 'REFUTED'}`
386:  + (output.m2.controlOutOfBand ? ' · CONTROL OUT OF BAND (third finding)' : '')
387-  + ` · SHA ${sha256}`,
388-);

[3mMapped the full E0→E5d chain, inspected the core probe implementations where document language was ambiguous, and quantified the main power/selection problems. The most consequential defects are in the E2 causal gate, held-out calibration, hypothetical power-dominance gate, programme-level adaptive reuse, and E5 attribution logic.[0m
  [32m✓[0m Map programme documents, stage contracts, frozen gates, and frozen results
  [32m✓[0m Audit estimands, sampling/dependence, calibration, multiplicity, and selection effects
  [32m✓[0m Cross-check the most serious findings quantitatively against reported numbers and code where useful
  [32m✓[0m Write severity-ranked findings and identify the top three ship decisions
[35m[3mcodex[0m[0m
# Adversarial statistical and gate-design audit

## Overall verdict

The programme is unusually strong on determinism, instrumentation disclosure, and exact reproduction. Those gates show that the code being measured is the code intended.

They do not, however, establish that the statistical conclusions generalise beyond the inspected seeds, or that several central gates estimate the questions their names imply. On the present evidence, the value/perception bundle should remain default-OFF. The programme’s current Phase-1 stop is correct, but the defects below require more than completing C3R.

## Findings, ranked by severity

### 1. Critical — “Not-looking must not win” is based on selected complete cases, not the registered 3,000 moments

**Claim.** Realised success is 63.28/64.60/63.46/67.90%, so poorer awareness never beats better awareness and oracle vision adds 4.61pp.

**Concern.** [EDS-E2B1-BOTH-SIDES-AB — “G1 — NOT-LOOKING MUST NOT WIN”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:128) and its frozen result. The implementation’s banked chosen counts are only [2,247 / 2,404 / 2,504 / 2,573](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e2b1r-consumption-scoped.ts:111) out of 3,000 moments.

**Why it is a problem.**

- The success rates condition on finding an executable option. Missingness changes sharply with awareness: 25.1%, 19.9%, 16.5%, and 14.2%.
- The arms therefore do not compare the same decision moments. The blind arm discards far more of the cases in which blindness binds.
- If “no executable option” were scored as failure, the same numerators give approximately 47.4%, 51.8%, 53.0%, and 58.2%; the claimed endpoint lift becomes about 10.8pp, not 4.61pp. If the intended live behaviour is legacy truth fallback, that fallback must instead be simulated and included.
- Passer and defender awareness change together. Reception success is a net effect of better attacking information and better defensive information, not the causal value of the passer looking.

**Fix.** Use an intention-to-treat estimand over all registered moments with a frozen rule for no-executable cases. Run a 2×2 passer-awareness × defender-awareness factorial, paired by moment and seed. Report paired confidence intervals using match/seed-clustered resampling.

---

### 2. Critical — the E2b-0 “held-out calibration” does not apply the trained bins to held-out data

**Claim.** The threat curve generalises because corresponding A/B quintiles differ by at most 2.18pp.

**Concern.** [EDS-E2B0-THREAT-CALIBRATION — “C3 — HELD-OUT CALIBRATION”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:118).

**Why it is a problem.** This is the easy-to-miss implementation defect. The probe independently calculates [A quintiles and B quintiles](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e2b0-threat-calibration.ts:449). It then compares A’s lowest 20% with B’s lowest 20%, and so forth. But the deployed lookup uses A’s numerical cut-points.

That tests whether rank strata have similar outcomes, not whether the committed A curve correctly calibrates B observations. Distributional drift in threat values can be hidden because B silently moves its boundaries.

**Fix.** Freeze A’s cut-points and rates, assign every B observation using those exact cut-points, and evaluate reliability, calibration intercept/slope, Brier/log loss, and out-of-range occupancy. Repeat under match-seed cluster bootstrap.

---

### 3. Critical — the “no-strict-dominance” gate measures a hypothetical preference; live power never varies

**Claim.** Power use is situational, passing at 21.86% highest-power preference.

**Concern.** [EDS-E3 — “NO-STRICT-DOMINANCE”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:102) and [EDS-E3R — the passed 21.86% result](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:261).

**Why it is a problem.** E3’s own operational registration states that there is no production power chooser and that the played share is 100% at power 1.0. The gate was changed into an offline evaluator preference over three hypothetical powers.

That can verify dormant scoring arithmetic, but it cannot answer whether live power use is situational, whether execution remains non-dominated, or whether players experience pass-power choice at all. A typical report reader can easily interpret “21.86%” as played behaviour when it is not.

**Fix.** Either:

- remove pass-power behaviour and dominance from the live-v1 claims; or
- wire the power decision into production, then rerun calibration, equilibrium, ecology, and actual played-power gates.

---

### 4. Critical — most “interval tests” are point-estimate thresholds, not equivalence or non-inferiority tests

**Claim.** Gates described as powered interval tests establish equivalence, calibration, or refutation.

**Concern.** The discipline in [PROBE-CONTRACTS — “Six threshold TYPES”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/PROBE-CONTRACTS.md:36), compared with E2b G1 and [E5c M2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:208).

**Why it is a problem.**

- G1 passes when the observed step is merely above −2pp. For 0.5→0.8, the estimate is −1.14pp. Under an optimistic independent-binomial approximation, SE ≈1.24pp and the one-sided 95% lower bound is about −3.18pp. Non-inferiority to −2pp is therefore not demonstrated. Roughly 7,100 independent observations per arm would be needed for 80% power at a true zero difference; pairing might reduce that, but discordant-pair counts were not analysed.
- E5c declares HM “refuted” because +3.38pp is below a +4pp confirmation threshold. With the reported SE ≈1.32pp, the one-sided 95% upper bound is about +5.55pp. The result is inconclusive; it does not refute an effect of at least 4pp.
- Raw `|A−B| ≤ tolerance` rules have a 50% pass probability when the true difference lies exactly on the boundary. Sample-size calculations designed to make false failures rare are not equivalence tests.

**Fix.** Use TOST or confidence-interval decision rules:

- equivalent/non-inferior only if the entire CI lies inside the acceptance region;
- superior only if the lower bound clears the threshold;
- refuted only if the upper bound lies below it;
- otherwise explicitly `INCONCLUSIVE`.

---

### 5. Critical — E5’s “no weight needed” validation is substantially in-sample and hides severe local miscalibration

**Claim.** P̂×V̂ predicts its conjunction to 0.03pp, proving the composition is a measurement and needs no weight.

**Concern.** [EDS-E5 — “V4 — COMPOSITION CALIBRATION”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5-VALUE-AXIS.md:192) and “E5a — PASS on every gate.”

**Why it is a problem.**

- V4 is explicitly gated on set A, the same set used to estimate V and the threat curve. The code gates only [`compositionA`](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e5a-value-census.ts:667); B is a reported companion.
- Aggregate agreement is largely cancellation. Internally, Q2 predicts 3.98% and realises 1.42%—about 64% overprediction—while Q4 predicts 6.16% and realises 9.45%—about 53% underprediction.
- The realised curve is non-monotone, yet the model is used for argmax ranking.
- A ±5pp calibration tolerance on predictions of roughly 2–6% allows errors comparable to or larger than the entire predicted probability.
- The held-out result reported only aggregate agreement, not held-out binwise calibration or ranking.

**Fix.** Fit on A, freeze every table and cut-point, and gate all binwise calibration/discrimination on B or a third sealed block. Prefer nested cross-fitting by match seed. Require monotone ranking or positive held-out calibration slope and compare Brier/log loss against P-only and V-only baselines.

---

### 6. High — fork counts are repeatedly treated as independent observations

**Claim.** Sample sizes such as 14,114 forks, 2,019 options per quintile, or 608 receptions provide the stated σ-level power.

**Concern.** E2a-2 P2, E2b-0 C2/C3, E5a V2–V4, E5c M2, and E5d C2/C3.

**Why it is a problem.** The hierarchy is approximately:

```text
seed/match → decision moment → several candidate forks
```

Sibling forks share the same world state and initial RNG state. Moments share teams, tactics, and match history. Yet the power calculations use candidate-level binomial formulas.

E2a-2’s 14,678 forks came from only 4,500 moments and 63 matches—about 233 forks per match. Even a match-level ICC of 0.01 gives a design effect near `1 + 232×0.01 = 3.32`, cutting nominal effective sample size by about 70%. A nominal 3.4σ result could become roughly 1.9σ. Candidate-level weighting also gives more influence to moments containing more eligible teammates.

**Fix.** Declare the outer sampling unit. Use match/league-seed cluster bootstraps or hierarchical models, with pairing inside moment. Report ICCs, effective sample sizes, and both moment-weighted and option-weighted estimands.

---

### 7. High — stage-level preregistration does not remove programme-level adaptive selection

**Claim.** Later full audits provide confirmation after earlier diagnostic failures.

**Concern.** [EDS-E3 §6.9 ablation](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:443) and [EDS-E3R §5.2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:238).

**Why it is a problem.**

- The “minus touch cost” arm was selected after inspecting the E3 ablation because it passed all five bands.
- E3R then reused the same league seed and returned the exact same five values. In a deterministic engine, this verifies wiring; it is not a fresh replication of the selected arm.
- E5c used its results to name a “third cause”; E5d Phase 0 then reused E5c’s own forks.
- Phase 1’s C3 failure produced C3R with new floors and additional data.

Each individual rewrite may be transparently registered, but the chain lacks a programme-level exploratory/confirmatory split or alpha-spending rule. Repeated redesign-and-retest can eventually select a passing path.

**Fix.** Maintain permanently sealed confirmatory league-seed blocks. Use development seeds for diagnosis and redesign, then exactly one confirmatory run on untouched seeds. Record the full hypothesis family and sequential decision/error policy.

---

### 8. High — the E2 “route mix” gate was incapable of detecting the failure later seen by players

**Claim.** Route mix survives because long-option share and mean distance at awareness 0.8 resemble the oracle arm.

**Concern.** [EDS-E2B1 — “G2 — ROUTE MIX”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:140).

**Why it is a problem.**

- It compares against the new evaluator’s oracle arm, not the flags-off live brain.
- It gates only distance and long-share, not headers, cutbacks, third-man releases, overlaps, give-and-gos, or progression structure.
- It passed, while E4 later measured third-man −35.7%, overlap −68.0%, and forward share −5.1pp ([EDS-E5 §1](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5-VALUE-AXIS.md:10)).

Thus G2 answered “does perception preserve this evaluator’s distance distribution?” rather than “does live route diversity survive?”

**Fix.** Compare live flags-on against paired flags-off on specific route and combination counters. Predefine which are hard non-inferiority gates; merely reporting them cannot prevent a statistically known watchability regression from reaching users.

---

### 9. High — the ecological conclusion overstates five-seed evidence, and CE1 was waived after contradictory fresh results

**Claim.** A typical world becomes more stylistically diverse, and co-evolution restoration is banked.

**Concern.** [EDS-E3R2 — “CE2R — style diversity”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:98), its [frozen result](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:190), and [PROGRAMME ruling #14](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/PROGRAMME.md:488).

**Why it is a problem.**

- Four of five fresh seeds above ratio 1.0 does not establish that the population median exceeds 1. A simple sign test gives one-sided p=0.1875.
- M3 requires only cross-club spread `>0`; finite samples will almost always produce nonzero spread even if clubs share the same underlying policy. It is not a valid test of club dependence.
- CE1’s “advantage shrinks” passed on one seed, then only 2/5 fresh seeds. The programme reinterpreted the gate’s purpose post hoc as “there is no runaway to restore from” and still opened E4. That may be a sensible new hypothesis, but it is not the registered CE1 claim.

**Fix.** Reclassify CE1 as inconclusive. Use more paired ecology seeds, hierarchical seed/club models, variance-component tests for club dependence, and a predeclared estimand such as median paired entropy difference rather than unstable ratios with near-zero denominators.

---

### 10. High — E5c’s “third cause” and the justification for E5d are not statistically resolved

**Claim.** HM and HU are refuted, while reality values the pattern pass by +1.09pp, proving the composed axis inverts the true ordering.

**Concern.** [EDS-E5C §7.2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:350) and [§7.3 Attribution](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:384).

**Why it is a problem.**

- As above, +3.38pp with SE≈1.32pp is inconclusive relative to the +4pp HM boundary, not a refutation.
- Using the reported clean counts/rates to approximate attempt totals, the 4.89% versus 3.80% payoff difference has an optimistic independent-observation 95% interval of roughly −0.19pp to +2.37pp. Match/moment clustering will widen it.
- Every other candidate becomes a control, so moments with more candidates receive more control weight. Pattern and control are not one paired alternative per moment.

The attempt-axis idea is plausible, but the evidence that it restores a real ordering should be treated as exploratory.

**Fix.** Choose one control option per moment by a frozen policy or analyse moment-level contrasts. Use fresh pattern moments, paired cluster inference, and an explicit inconclusive region.

---

### 11. Moderate — calibration is validated under the wrong data-generating policy

**Claim.** Seed holdout establishes tables suitable for the live perceived/evolved world.

**Concern.** E2b-0 §2–§6 and E5’s registered circularity.

**Why it is a problem.** The threat table is measured at awareness 0.8 under the flag-off/legacy action process, then used at awareness 0.2, 0.5, oracle, with perceived defence, a different live chooser, and sealed evolution. Adjacent seed blocks test new random draws from the same policy; they do not test policy or ecology shift.

This matters because improving defender perception changes `P(clean | threat)` even if the threat read itself is unchanged.

**Fix.** Add reliability gates in the actual deployed flags-on policy and across held-out evolved leagues. If one shared invariant curve is claimed, test interaction terms for awareness, defensive policy, club, and generation.

---

### 12. Moderate — reported truth fallbacks leave the “perception-honest choice” claim ungated

**Claim.** Live choices are based on what the player sees.

**Concern.** E3’s implementation registrations and reported `no-executable` rate.

**Why it is a problem.** Candidate existence is truth-enumerated, execution remains truth-aimed, and no-executable moments retain the legacy truth-based choice—about 4% of live traced moments. These cases are reported but have no acceptance threshold. They are also closely related to the complete-case selection defect in Finding 1.

**Fix.** Either narrow the shipping claim explicitly or gate the truth fallback rate. A fully honest version needs perceived candidate enumeration, a defined hold/no-pass response when nobody is executable, and perception-honest aiming.

## Three most decision-relevant ship findings

1. **Finding 1:** the central E2 evidence that “not-looking does not win” is a selected complete-case comparison with attacker and defender awareness confounded. The perception mechanism’s main causal claim is not established.

2. **Findings 2 and 5:** the core probability/value tables have not passed a genuine frozen-bin, fully held-out calibration test. E5’s aggregate 0.03pp agreement masks large ranking errors, precisely where argmax decisions are sensitive.

3. **Findings 3, 7, and 9:** whole-engine readiness is overstated: live power choice does not exist, the revised equilibrium reused the seed that selected it, and the ecological/co-evolution evidence is not robust across fresh seeds.

**Ship recommendation: do not ship the bundle to live players yet.** Keep the flags default-OFF, finish Phase 1 only after repairing the estimands and inference above, then require one untouched multi-seed confirmatory audit plus a blinded or counterbalanced E4 play-test.
[2mtokens used[0m
237,863
# Adversarial statistical and gate-design audit

## Overall verdict

The programme is unusually strong on determinism, instrumentation disclosure, and exact reproduction. Those gates show that the code being measured is the code intended.

They do not, however, establish that the statistical conclusions generalise beyond the inspected seeds, or that several central gates estimate the questions their names imply. On the present evidence, the value/perception bundle should remain default-OFF. The programme’s current Phase-1 stop is correct, but the defects below require more than completing C3R.

## Findings, ranked by severity

### 1. Critical — “Not-looking must not win” is based on selected complete cases, not the registered 3,000 moments

**Claim.** Realised success is 63.28/64.60/63.46/67.90%, so poorer awareness never beats better awareness and oracle vision adds 4.61pp.

**Concern.** [EDS-E2B1-BOTH-SIDES-AB — “G1 — NOT-LOOKING MUST NOT WIN”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:128) and its frozen result. The implementation’s banked chosen counts are only [2,247 / 2,404 / 2,504 / 2,573](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e2b1r-consumption-scoped.ts:111) out of 3,000 moments.

**Why it is a problem.**

- The success rates condition on finding an executable option. Missingness changes sharply with awareness: 25.1%, 19.9%, 16.5%, and 14.2%.
- The arms therefore do not compare the same decision moments. The blind arm discards far more of the cases in which blindness binds.
- If “no executable option” were scored as failure, the same numerators give approximately 47.4%, 51.8%, 53.0%, and 58.2%; the claimed endpoint lift becomes about 10.8pp, not 4.61pp. If the intended live behaviour is legacy truth fallback, that fallback must instead be simulated and included.
- Passer and defender awareness change together. Reception success is a net effect of better attacking information and better defensive information, not the causal value of the passer looking.

**Fix.** Use an intention-to-treat estimand over all registered moments with a frozen rule for no-executable cases. Run a 2×2 passer-awareness × defender-awareness factorial, paired by moment and seed. Report paired confidence intervals using match/seed-clustered resampling.

---

### 2. Critical — the E2b-0 “held-out calibration” does not apply the trained bins to held-out data

**Claim.** The threat curve generalises because corresponding A/B quintiles differ by at most 2.18pp.

**Concern.** [EDS-E2B0-THREAT-CALIBRATION — “C3 — HELD-OUT CALIBRATION”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:118).

**Why it is a problem.** This is the easy-to-miss implementation defect. The probe independently calculates [A quintiles and B quintiles](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e2b0-threat-calibration.ts:449). It then compares A’s lowest 20% with B’s lowest 20%, and so forth. But the deployed lookup uses A’s numerical cut-points.

That tests whether rank strata have similar outcomes, not whether the committed A curve correctly calibrates B observations. Distributional drift in threat values can be hidden because B silently moves its boundaries.

**Fix.** Freeze A’s cut-points and rates, assign every B observation using those exact cut-points, and evaluate reliability, calibration intercept/slope, Brier/log loss, and out-of-range occupancy. Repeat under match-seed cluster bootstrap.

---

### 3. Critical — the “no-strict-dominance” gate measures a hypothetical preference; live power never varies

**Claim.** Power use is situational, passing at 21.86% highest-power preference.

**Concern.** [EDS-E3 — “NO-STRICT-DOMINANCE”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:102) and [EDS-E3R — the passed 21.86% result](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:261).

**Why it is a problem.** E3’s own operational registration states that there is no production power chooser and that the played share is 100% at power 1.0. The gate was changed into an offline evaluator preference over three hypothetical powers.

That can verify dormant scoring arithmetic, but it cannot answer whether live power use is situational, whether execution remains non-dominated, or whether players experience pass-power choice at all. A typical report reader can easily interpret “21.86%” as played behaviour when it is not.

**Fix.** Either:

- remove pass-power behaviour and dominance from the live-v1 claims; or
- wire the power decision into production, then rerun calibration, equilibrium, ecology, and actual played-power gates.

---

### 4. Critical — most “interval tests” are point-estimate thresholds, not equivalence or non-inferiority tests

**Claim.** Gates described as powered interval tests establish equivalence, calibration, or refutation.

**Concern.** The discipline in [PROBE-CONTRACTS — “Six threshold TYPES”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/PROBE-CONTRACTS.md:36), compared with E2b G1 and [E5c M2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:208).

**Why it is a problem.**

- G1 passes when the observed step is merely above −2pp. For 0.5→0.8, the estimate is −1.14pp. Under an optimistic independent-binomial approximation, SE ≈1.24pp and the one-sided 95% lower bound is about −3.18pp. Non-inferiority to −2pp is therefore not demonstrated. Roughly 7,100 independent observations per arm would be needed for 80% power at a true zero difference; pairing might reduce that, but discordant-pair counts were not analysed.
- E5c declares HM “refuted” because +3.38pp is below a +4pp confirmation threshold. With the reported SE ≈1.32pp, the one-sided 95% upper bound is about +5.55pp. The result is inconclusive; it does not refute an effect of at least 4pp.
- Raw `|A−B| ≤ tolerance` rules have a 50% pass probability when the true difference lies exactly on the boundary. Sample-size calculations designed to make false failures rare are not equivalence tests.

**Fix.** Use TOST or confidence-interval decision rules:

- equivalent/non-inferior only if the entire CI lies inside the acceptance region;
- superior only if the lower bound clears the threshold;
- refuted only if the upper bound lies below it;
- otherwise explicitly `INCONCLUSIVE`.

---

### 5. Critical — E5’s “no weight needed” validation is substantially in-sample and hides severe local miscalibration

**Claim.** P̂×V̂ predicts its conjunction to 0.03pp, proving the composition is a measurement and needs no weight.

**Concern.** [EDS-E5 — “V4 — COMPOSITION CALIBRATION”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5-VALUE-AXIS.md:192) and “E5a — PASS on every gate.”

**Why it is a problem.**

- V4 is explicitly gated on set A, the same set used to estimate V and the threat curve. The code gates only [`compositionA`](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e5a-value-census.ts:667); B is a reported companion.
- Aggregate agreement is largely cancellation. Internally, Q2 predicts 3.98% and realises 1.42%—about 64% overprediction—while Q4 predicts 6.16% and realises 9.45%—about 53% underprediction.
- The realised curve is non-monotone, yet the model is used for argmax ranking.
- A ±5pp calibration tolerance on predictions of roughly 2–6% allows errors comparable to or larger than the entire predicted probability.
- The held-out result reported only aggregate agreement, not held-out binwise calibration or ranking.

**Fix.** Fit on A, freeze every table and cut-point, and gate all binwise calibration/discrimination on B or a third sealed block. Prefer nested cross-fitting by match seed. Require monotone ranking or positive held-out calibration slope and compare Brier/log loss against P-only and V-only baselines.

---

### 6. High — fork counts are repeatedly treated as independent observations

**Claim.** Sample sizes such as 14,114 forks, 2,019 options per quintile, or 608 receptions provide the stated σ-level power.

**Concern.** E2a-2 P2, E2b-0 C2/C3, E5a V2–V4, E5c M2, and E5d C2/C3.

**Why it is a problem.** The hierarchy is approximately:

```text
seed/match → decision moment → several candidate forks
```

Sibling forks share the same world state and initial RNG state. Moments share teams, tactics, and match history. Yet the power calculations use candidate-level binomial formulas.

E2a-2’s 14,678 forks came from only 4,500 moments and 63 matches—about 233 forks per match. Even a match-level ICC of 0.01 gives a design effect near `1 + 232×0.01 = 3.32`, cutting nominal effective sample size by about 70%. A nominal 3.4σ result could become roughly 1.9σ. Candidate-level weighting also gives more influence to moments containing more eligible teammates.

**Fix.** Declare the outer sampling unit. Use match/league-seed cluster bootstraps or hierarchical models, with pairing inside moment. Report ICCs, effective sample sizes, and both moment-weighted and option-weighted estimands.

---

### 7. High — stage-level preregistration does not remove programme-level adaptive selection

**Claim.** Later full audits provide confirmation after earlier diagnostic failures.

**Concern.** [EDS-E3 §6.9 ablation](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:443) and [EDS-E3R §5.2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:238).

**Why it is a problem.**

- The “minus touch cost” arm was selected after inspecting the E3 ablation because it passed all five bands.
- E3R then reused the same league seed and returned the exact same five values. In a deterministic engine, this verifies wiring; it is not a fresh replication of the selected arm.
- E5c used its results to name a “third cause”; E5d Phase 0 then reused E5c’s own forks.
- Phase 1’s C3 failure produced C3R with new floors and additional data.

Each individual rewrite may be transparently registered, but the chain lacks a programme-level exploratory/confirmatory split or alpha-spending rule. Repeated redesign-and-retest can eventually select a passing path.

**Fix.** Maintain permanently sealed confirmatory league-seed blocks. Use development seeds for diagnosis and redesign, then exactly one confirmatory run on untouched seeds. Record the full hypothesis family and sequential decision/error policy.

---

### 8. High — the E2 “route mix” gate was incapable of detecting the failure later seen by players

**Claim.** Route mix survives because long-option share and mean distance at awareness 0.8 resemble the oracle arm.

**Concern.** [EDS-E2B1 — “G2 — ROUTE MIX”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:140).

**Why it is a problem.**

- It compares against the new evaluator’s oracle arm, not the flags-off live brain.
- It gates only distance and long-share, not headers, cutbacks, third-man releases, overlaps, give-and-gos, or progression structure.
- It passed, while E4 later measured third-man −35.7%, overlap −68.0%, and forward share −5.1pp ([EDS-E5 §1](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5-VALUE-AXIS.md:10)).

Thus G2 answered “does perception preserve this evaluator’s distance distribution?” rather than “does live route diversity survive?”

**Fix.** Compare live flags-on against paired flags-off on specific route and combination counters. Predefine which are hard non-inferiority gates; merely reporting them cannot prevent a statistically known watchability regression from reaching users.

---

### 9. High — the ecological conclusion overstates five-seed evidence, and CE1 was waived after contradictory fresh results

**Claim.** A typical world becomes more stylistically diverse, and co-evolution restoration is banked.

**Concern.** [EDS-E3R2 — “CE2R — style diversity”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:98), its [frozen result](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:190), and [PROGRAMME ruling #14](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/PROGRAMME.md:488).

**Why it is a problem.**

- Four of five fresh seeds above ratio 1.0 does not establish that the population median exceeds 1. A simple sign test gives one-sided p=0.1875.
- M3 requires only cross-club spread `>0`; finite samples will almost always produce nonzero spread even if clubs share the same underlying policy. It is not a valid test of club dependence.
- CE1’s “advantage shrinks” passed on one seed, then only 2/5 fresh seeds. The programme reinterpreted the gate’s purpose post hoc as “there is no runaway to restore from” and still opened E4. That may be a sensible new hypothesis, but it is not the registered CE1 claim.

**Fix.** Reclassify CE1 as inconclusive. Use more paired ecology seeds, hierarchical seed/club models, variance-component tests for club dependence, and a predeclared estimand such as median paired entropy difference rather than unstable ratios with near-zero denominators.

---

### 10. High — E5c’s “third cause” and the justification for E5d are not statistically resolved

**Claim.** HM and HU are refuted, while reality values the pattern pass by +1.09pp, proving the composed axis inverts the true ordering.

**Concern.** [EDS-E5C §7.2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:350) and [§7.3 Attribution](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:384).

**Why it is a problem.**

- As above, +3.38pp with SE≈1.32pp is inconclusive relative to the +4pp HM boundary, not a refutation.
- Using the reported clean counts/rates to approximate attempt totals, the 4.89% versus 3.80% payoff difference has an optimistic independent-observation 95% interval of roughly −0.19pp to +2.37pp. Match/moment clustering will widen it.
- Every other candidate becomes a control, so moments with more candidates receive more control weight. Pattern and control are not one paired alternative per moment.

The attempt-axis idea is plausible, but the evidence that it restores a real ordering should be treated as exploratory.

**Fix.** Choose one control option per moment by a frozen policy or analyse moment-level contrasts. Use fresh pattern moments, paired cluster inference, and an explicit inconclusive region.

---

### 11. Moderate — calibration is validated under the wrong data-generating policy

**Claim.** Seed holdout establishes tables suitable for the live perceived/evolved world.

**Concern.** E2b-0 §2–§6 and E5’s registered circularity.

**Why it is a problem.** The threat table is measured at awareness 0.8 under the flag-off/legacy action process, then used at awareness 0.2, 0.5, oracle, with perceived defence, a different live chooser, and sealed evolution. Adjacent seed blocks test new random draws from the same policy; they do not test policy or ecology shift.

This matters because improving defender perception changes `P(clean | threat)` even if the threat read itself is unchanged.

**Fix.** Add reliability gates in the actual deployed flags-on policy and across held-out evolved leagues. If one shared invariant curve is claimed, test interaction terms for awareness, defensive policy, club, and generation.

---

### 12. Moderate — reported truth fallbacks leave the “perception-honest choice” claim ungated

**Claim.** Live choices are based on what the player sees.

**Concern.** E3’s implementation registrations and reported `no-executable` rate.

**Why it is a problem.** Candidate existence is truth-enumerated, execution remains truth-aimed, and no-executable moments retain the legacy truth-based choice—about 4% of live traced moments. These cases are reported but have no acceptance threshold. They are also closely related to the complete-case selection defect in Finding 1.

**Fix.** Either narrow the shipping claim explicitly or gate the truth fallback rate. A fully honest version needs perceived candidate enumeration, a defined hold/no-pass response when nobody is executable, and perception-honest aiming.

## Three most decision-relevant ship findings

1. **Finding 1:** the central E2 evidence that “not-looking does not win” is a selected complete-case comparison with attacker and defender awareness confounded. The perception mechanism’s main causal claim is not established.

2. **Findings 2 and 5:** the core probability/value tables have not passed a genuine frozen-bin, fully held-out calibration test. E5’s aggregate 0.03pp agreement masks large ranking errors, precisely where argmax decisions are sensitive.

3. **Findings 3, 7, and 9:** whole-engine readiness is overstated: live power choice does not exist, the revised equilibrium reused the seed that selected it, and the ecological/co-evolution evidence is not robust across fresh seeds.

**Ship recommendation: do not ship the bundle to live players yet.** Keep the flags default-OFF, finish Phase 1 only after repairing the estimands and inference above, then require one untouched multi-seed confirmatory audit plus a blinded or counterbalanced E4 play-test.
