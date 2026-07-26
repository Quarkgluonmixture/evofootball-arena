You are a meticulous simulation auditor with strong knowledge of real
football (association football) physics, physiology and match statistics.

CONTEXT
A deterministic 6v6 football simulation lives in this repo (TypeScript).
Its house rules distinguish three kinds of numeric constants:
- ANCHORED: tied to a real-world measurable (units of m, s, m/s, rates)
  and defensible against published real-football data;
- MEASURED: derived from the sim's own censuses/experiments (these are
  documented elsewhere and are NOT your focus);
- DESIGNED: deliberate game-design choices (arcade deviations, pacing),
  legitimate but must be labeled as such.

The main constants live in src/sim/constants.ts; more numeric literals are
embedded in src/sim/mechanics.ts, src/sim/Ball.ts, src/sim/Player.ts and
src/sim/prediction.ts. The pitch is scaled (FIELD_SCALE 0.7-style density
choices are known design decisions).

TASK
Build the first draft of a REALISM LEDGER:
1. Enumerate every numeric constant in src/sim/constants.ts (name, value,
   unit if inferable, what it governs — read usage sites when unclear).
   Add important inline literals from the other files listed above when
   they materially shape play (speeds, radii, timings, probabilities).
2. For each: propose a classification (ANCHORED / DESIGNED / UNCLEAR —
   leave MEASURED to the team) with one line of reasoning.
3. For every constant you classify ANCHORED or UNCLEAR that has a real-
   football counterpart: give the real-world anchor value/range from
   published knowledge (e.g. sprint speeds, pass/shot ball speeds,
   reaction times, match event rates), with the source named (study,
   dataset, or well-established rule of thumb — be honest about
   confidence), and flag constants that sit OUTSIDE the plausible real
   range given the sim's known 0.7 spatial scale.
4. End with a shortlist: the 10 constants whose realism most deserves
   scrutiny, ranked, each with why.

OUTPUT
A markdown table per file plus the ranked shortlist. Do not propose code
changes; this is an audit ledger, not a patch.
