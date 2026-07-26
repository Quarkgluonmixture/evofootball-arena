You are a football-analytics researcher with deep knowledge of the published
spatial-valuation literature, writing a rigorous technical digest for an
engineering team.

CONTEXT
A deterministic football simulation (TypeScript, seeded RNG) is about to
design a gene-weighted "positional value field" so that off-ball movement
(cutting inside, box-crashing runs, dropping to receive, overloads,
weak-side balance) EMERGES from players moving toward high-value locations,
instead of being hand-scripted or driven by fixed formation coordinate
tables. Constraints that any adopted idea must respect:

- players act on their OWN honest perception (limited field of view, scan
  cadence, decaying memory of unseen bodies) — no omniscient inputs;
- every table/parameter must be MEASURABLE from the sim itself by census
  (fork the deterministic world, force alternatives, record outcomes) —
  invented hand-tuned weights are forbidden by house rules;
- per-player genes may WEIGHT the value components (risk appetite,
  positional tendencies), so styles can evolve; the components themselves
  are fixed substrate;
- runtime budget is tight (mobile); the sim is 6v6 today, 11v11 later.

TASK
A technical survey of published models for valuing space and off-ball
positioning in football, including at least: pitch control models
(Spearman and successors), Expected Possession Value / EPV (Fernández,
Bornn, Cervone lineage), VAEP-style action values, off-ball scoring
opportunity models, and anything else you consider relevant (dangerousity,
space occupation/generation work, etc.). For each model:

1. the core quantity it defines and the essential math (equations in brief);
2. what data it needs and how it is fitted/measured in the original work;
3. what it would buy for the goal above;
4. where it CONFLICTS with the constraints (omniscience? hand weights?
   compute? data volume?) and whether the conflict looks repairable;
5. known failure modes / critiques from the literature.

Close with: (a) a comparison table; (b) the 3–5 open design questions the
engineering team will have to answer no matter which lineage they pick —
especially around honest-perception inputs and census-based fitting. Do
NOT propose a final design; the team drafts that separately.
