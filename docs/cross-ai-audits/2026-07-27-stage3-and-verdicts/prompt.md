You are a senior reviewer with two hats: simulation/game-engine design and
experimental statistics (pre-registered gates, causal censuses). You are
auditing three artifacts in a deterministic TypeScript football simulation.
House methodology (binding context, see docs/PROBE-CONTRACTS.md and
docs/VISION.md §1): experiments pre-register frozen gates before running;
"fork-and-force" = fork the deterministic world at a real moment, force ONE
choice, let live machinery play out, measure outcomes; hand-tuned weights are
forbidden — tables must be measured from the sim by census; players act on
their own honest perception (FOV, scan cadence, decaying memory), never
omniscient inputs; behaviours must EMERGE from capabilities + selection,
never be hand-scripted.

There is NO predefined answer here. Find what you find; it is fine — and
valuable — to disagree with any conclusion these documents reach.

AUDIT (a) — design review, not yet implemented:
docs/world-model/STAGE3-POSITIONING-EYE.md — a design contract for replacing
the current off-ball positioning system (src/ai/formations.ts, especially
emergentStation and supportSpot) with a per-player, perception-based,
census-priced "positioning eye". Assess: internal consistency; whether its
stages (P0–P5) can actually decide what they claim to decide; unstated
failure modes; feasibility risks (statistical power, runtime, stability under
simultaneous consumption); whether any of its design rulings quietly violate
the house methodology above.

AUDIT (b) — evidence-chain review of a NEGATIVE verdict:
docs/world-model/C5-T1-WAITING-CENSUS.md (with docs/world-model/
C5-TIME-DIMENSION.md and C5-T0-HOLD-MECHANICS.md / C5-T0R-REDRAW.md as
background). The programme concluded from this census that, in the current
world, holding the ball (waiting) never pays on the measured axis, and parked
the corresponding feature work. Audit the chain: do the design choices and
reported numbers actually support that conclusion? Is there any way the
measurement design could produce this headline regardless of what is true in
the world? Check the contract's own text against the code it cites.

AUDIT (c) — evidence-chain review of a second NEGATIVE verdict:
docs/world-model/C4-T1-FLIGHT.md and docs/world-model/C4-T2-ARRIVAL.md (with
C4-AERIAL-ARRIVAL.md, C4-T0-ARRIVAL-CENSUS.md, C4-T0R-T0B.md as background).
The programme concluded the aerial-arrival avenue is exhausted at the current
substrate: the delivery flight fix works mechanically but yields
mostly-defensive contests and fewer goals, and closing a licence leak that
emptied the box moved nothing, so the remaining gap was ruled to belong to a
future perception layer. Audit whether the measurements support "exhausted",
and whether any cheap, methodology-compliant intervention was overlooked.

Output: a findings list ordered by severity. For each finding: the claim, the
evidence (file:line citations into this repo), severity (design-blocking /
material / minor), your confidence, and what you would do about it. Include
at least one finding in each audit that a typical first-read reviewer would
miss. End with a one-paragraph overall verdict per audit.
