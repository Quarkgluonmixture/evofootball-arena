# Independent design consultation — EvoFootball Arena · PERCEPTION→DECISION ARCHITECTURE (zero preset)

You are giving an INDEPENDENT design opinion. There is **no predefined answer** — investigate, form
your own view, and it is completely fine (encouraged) to DISAGREE with the current direction. The
person asking wants a genuine second brain, not their own thinking echoed back. Where the docs
contain a current author's in-progress hypotheses (especially `docs/ROADMAP.md`, a dated
working-session log), treat those as *context, not answers*; reason from the code and first
principles and say if you think they're wrong.

## The project
EvoFootball Arena is a **deterministic 6v6 evolutionary football simulation** (TypeScript) whose
soul is **EMERGENCE**: tactics/styles/skills must ARISE from evolution + selection on a substrate,
never be hand-coded. Players decide actions each tick via utility scorers built on small perception
queries. A stated design direction is to build the game "bottom-up" as a
**perception → value → action** decision engine — letting each player (and the coach) "grow eyes":
perceive the ball, opponents, team-mates, the field, their own state, and the dynamics/anticipation,
derive the VALUE of options, and choose. Constraints to respect:

- **Emergence** (enrich substrate + genes so good play pays; don't hand-script role behaviors).
- **Watchability:** ~2 goals/match, varied routes to goal, no pathologies; a change that inflates
  scoring or collapses a route is a regression even if realistic.
- **Determinism:** seeded RNG only (no `Math.random`/wall-clock); identical seed ⇒ identical match.
- **Per-player individuality should be EVOLVABLE** (gene-driven), not a fixed hand-set constant.

## What to read (repo root = your CWD)
- `docs/VISION.md` — the gold-standard vision (authoritative intent; includes the "eyes"/engine idea).
- `docs/EVO-BLUEPRINT.md` — the emergence architecture.
- `docs/ROADMAP.md` — recent history + current state (working-session log; context, not answers).
- `src/ai/perception.ts` — the pure perception queries (openness, lane, pressure, space, intercept).
- `src/ai/PlayerBrain.ts` — the per-player action utility scorers (pass/shoot/dribble/run).
- `src/ai/TeamBrain.ts` — team-level coordination (runners, modes).
- `src/ai/formations.ts` — positioning/station logic.
- `src/evolution/playerGenome.ts` — the attribute genes + budget.

## Your questions (form your OWN opinions; be concrete — name functions, formulas, code sites)
1. **Assess the perception→value→action / "grow eyes" direction.** Is it the right architecture for
   this sim? What would you keep, change, or drop? Where are the current perception queries too
   perfect, too crude, or missing a dimension (e.g. team-mates, own state, anticipation)?
2. **Per-player perception QUALITY.** Currently perception is essentially perfect and identical for
   every player. If individual perception quality should VARY (and be evolvable), how would you model
   it so it differentiates players WITHOUT destabilizing match outcomes (e.g. without one-sidedly
   inflating scoring)? Consider both attacking reads and defensive reads. What keeps it balanced?
3. **Highest-leverage next step.** Given the vision (realism) and the hard watchability constraint,
   what is the single highest-leverage next change to the perception/decision layer — and what would
   you deliberately NOT do yet? Rank a short list with the balance risk of each.

Prioritize. Disagree freely. Cite file:line where you can.
