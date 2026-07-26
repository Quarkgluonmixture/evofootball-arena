# Independent design consultation — EvoFootball Arena · ATTRIBUTE MODEL (zero preset)

You are giving an INDEPENDENT design opinion. There is **no predefined answer** — investigate the
code/docs, form your own view, and it is completely fine (encouraged) to DISAGREE with how things
are currently done. The person asking does NOT want their own thinking echoed back; they want a
genuine second brain. Where the docs contain a current author's in-progress hypotheses (especially
`docs/ROADMAP.md`, which is a dated working-session log), treat those as *context, not answers* —
reason from the code and first principles, and say if you think they're wrong.

## The project
EvoFootball Arena is a **deterministic 6v6 evolutionary football simulation** (TypeScript). Teams
AND their players EVOLVE across seasons via selection. The project's core philosophy is
**EMERGENCE**: tactics, styles, and skills must ARISE from evolution + selection acting on a
substrate — NOT be hand-coded. Key constraints you must respect in any proposal:

- **Emergence:** don't hand-script behaviors; enrich the SUBSTRATE (physics + genes) so good play
  PAYS and selection discovers it. A change that reads `if (role === 'WG') ...` to force a behavior
  is against the soul.
- **Squad attribute BUDGET:** players have per-attribute genes (0..1); a shared squad-level cap
  means raising one attribute COSTS another, forcing specialization/archetypes to emerge.
- **Watchability:** matches must stay watchable and balanced — roughly ~2 goals/match, varied
  routes to goal (through-balls, crosses/headers, cutbacks, dribbles), no degenerate pathologies.
  A change that inflates scoring or collapses a route to goal is a regression even if "realistic".
- **Determinism:** all randomness is seeded (no `Math.random`, no wall-clock); identical seed ⇒
  identical match.

## What to read (repo root = your CWD)
- `docs/VISION.md` — the gold-standard vision (what the game should feel/be). Authoritative intent.
- `docs/EVO-BLUEPRINT.md` — the emergence architecture.
- `docs/ROADMAP.md` — recent history + current state (working-session log; context, not answers).
- `src/evolution/playerGenome.ts` — the attribute genes, the budget, mutation/crossover/heredity.
- `src/sim/mechanics.ts` — where attributes are consumed by the match physics (grep the attr names).
- `src/ai/PlayerBrain.ts`, `src/ai/perception.ts` — how players perceive and choose actions.
- `src/evolution/traits.ts`, `src/evolution/careers.ts` — derived traits + age curves.

## Your questions (form your OWN opinions; be concrete — name attributes, formulas, code sites)
1. **Attribute audit.** Does each player attribute genuinely and DISTINCTLY matter in the sim?
   Which are weak, redundant, one-dimensional, or effectively dead? Which real-football qualities
   are MISSING from the attribute set? Are any mechanics "attribute-blind" (a flat constant where a
   gene should bite)?
2. **Modelling "game reading / awareness / vision" (eye quality).** If you were to add or strengthen
   an attribute for how well a player READS the game, how would you model it so it (a) meaningfully
   DIFFERENTIATES players, (b) stays emergence-faithful and evolvable under the budget, and (c) does
   NOT distort match balance — e.g. does not inflate scoring or over-concentrate one route to goal?
   Where exactly would it plug into the perception/decision code? What are the failure modes to
   avoid, and how would you keep it balanced?
3. **Highest-leverage changes.** Rank your top 3–5 changes to the attribute substrate that would
   make evolution produce richer, more distinct, more realistic players — WITHOUT hand-coding
   behaviors — and note the balance risk of each.

Prioritize. Disagree freely. Cite file:line where you can.
