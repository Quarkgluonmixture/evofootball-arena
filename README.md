<div align="center">

# ⚽ EvoFootball Arena

**A deterministic, inspectable football world where AI teams play, evolve, and expose why every decision was made.**

[![Play](https://img.shields.io/badge/play-GitHub%20Pages-2f855a)](https://quarkgluonmixture.github.io/evofootball-arena/)
[![itch.io](https://img.shields.io/badge/play-itch.io-fa5c5c?logo=itchdotio&logoColor=white)](https://quarkgluonmixture.itch.io/evofootball-arena)
![TypeScript](https://img.shields.io/badge/TypeScript-simulation-3178C6?logo=typescript&logoColor=white)
![Deterministic](https://img.shields.io/badge/simulation-deterministic-7c3aed)
![No RL](https://img.shields.io/badge/AI-utility%20%2B%20evolution-b45309)

*No reinforcement learning. No backend. No opaque policy network. The match is a readable world model, and the development process treats realism claims as experiments that can fail.*

</div>

---

## Play it

**Browser:** https://quarkgluonmixture.github.io/evofootball-arena/  
**itch.io:** https://quarkgluonmixture.itch.io/evofootball-arena

Everything runs locally in the browser. There are no accounts or remote game servers; saves live in `localStorage` and can be exported/imported as JSON.

```bash
git clone https://github.com/Quarkgluonmixture/evofootball-arena.git
cd evofootball-arena

# The research batteries are pinned to the Node version in .nvmrc
nvm use
npm ci
npm run dev
```

The app boots into the 3D match view when WebGL is available and falls back to 2D otherwise.

---

## What makes it different

EvoFootball is two things at once:

### 1. A playable autonomous football ecosystem

AI-controlled 6v6 teams compete through leagues and cups while tactical and player traits evolve across generations.

You mostly **watch and inspect**:

- why a player chose pass / carry / shoot / press / hold;
- how tactical genes and policy weights change over generations;
- which styles survive, disappear, or re-emerge;
- whether a visually convincing behavior is actually supported by the simulation state.

### 2. A measured world-model programme

Realism work is not done by adding a rule and deciding it "looks better." The repository has an explicit experimental programme for questions such as:

- does body orientation actually constrain passing in a human-like way?
- does the ball respect bodies as geometry rather than only as probabilistic actors?
- can defenders price press / mark / chase decisions without a hardcoded swarm cap?
- does giving players private, stale information change decisions in measurable ways?
- does a local realism fix survive twenty generations of evolution, or does the ecology route around it?

The live research queue and rulings are in [`docs/world-model/PROGRAMME.md`](docs/world-model/PROGRAMME.md), not in this README.

---

## The simulation philosophy

> **Existence by law; quality by decision and chance.**

The engine tries to separate three layers that games often blur together:

```text
physical possibility
      ↓
perception / information
      ↓
decision utility
      ↓
execution noise / skill
      ↓
world consequence
```

A defender should not fail to occupy physical space because a behavioral roll said no. A player should not see the whole pitch because the chooser has access to the global roster. A pass can still be inaccurate or badly chosen after its physical preconditions are satisfied.

This separation is what makes the simulation inspectable enough to test rather than only tune.

---

## Current world-model direction

The project has moved well beyond its early "utility AI football toy" phase. Recent programme arcs have added and tested:

- **body-facing law** — turning has a time cost; facing is not a cosmetic vector;
- **body-ball contact law** — physical bodies occupy space even when behavioral control is unavailable;
- **private snapshots + active looks** — decision makers can act on stale information and pay time to refresh it;
- **persistent marking** — defenders do not greedily clear and rebuild assignments every decision tick;
- **priced defensive surface** — press / hold / jump / take decisions are compared in a shared account;
- **rounded procedural bodies** — presentation geometry matches the physical intent better than the old box mannequins;
- **long-horizon ecological checks** — local fixes are replayed through multi-generation leagues rather than judged from one friendly match.

One important negative result is preserved rather than patched around: simply removing the old multi-chaser cap makes swarm behavior and marking coverage worse. The programme therefore routes toward a **priced chaser licence** instead of declaring the cap obsolete by taste.

That is representative of the development style: a failed hypothesis changes the model of the system; it does not get silently re-tuned until green.

---

## Football systems

The playable world currently includes:

### Match and competition

- deterministic 6v6 matches at a fixed 60 Hz simulation timestep;
- round-robin league seasons and an Evo Cup knockout competition;
- penalty shootouts with 3D presentation;
- seeded fixtures and reproducible watched/fast-sim results;
- promotion/relegation and long-horizon franchise lineage.

### On-ball football

- body facing with finite turn rate;
- first-touch errors under speed / pressure / blind-side receptions;
- ground passes, through balls, cutbacks, crosses, switches, chips and clearances;
- real ball height, aerial contests, headers and crossbar geometry;
- deliberate goalkeeper distribution rather than a single panic-hoof behavior;
- timed runs and offside frozen at the strike moment.

### Defending

- marking and press assignments;
- pressure, lanes, arrival time and access-account calculations;
- tackles, fouls, advantage, professional fouls, yellow/red cards;
- keeper rushing, smothers and handling;
- persistent defensive state and experimentally gated coordination mechanisms.

### Evolution

- team tactical genomes;
- player attributes, aging and careers;
- coach lineage and policy-style evolution;
- a style space that lets tactical identity be measured across generations;
- deterministic mutation / selection under a seeded world.

---

## Why no reinforcement learning?

By design, the world uses **utility AI + evolutionary search** rather than a learned black-box controller.

That gives the project something useful for both play and research: every candidate action has a score that can be surfaced to the UI, traced to an account, mutation-tested, and compared across counterfactual worlds.

```text
perception + state
      ↓
candidate actions
      ↓
explicit utility / price accounts
      ↓
chosen action
      ↓
deterministic physics + seeded stochasticity
```

Evolution changes the parameters and preferences; it does not erase the causal path that made a player act.

---

## Research discipline

The world-model programme borrows methods from experimental software and empirical research rather than normal game balancing.

### Freeze before battery

A scored hypothesis, metric, seed plan, and gate are frozen **before** the expensive battery is run. A red result is reported as red instead of moving the threshold after seeing it.

### Dormant seams

New behavior can be added behind a default-off world flag. Before any effect claim, the project proves that the flag-off world remains byte-identical to the incumbent world.

### Mutation-tested pins

A "test" that stays green when the claimed mechanism is deliberately broken is not treated as evidence. Important source assumptions get adversarial mutants and construction-class fixtures.

### Artifact re-derivation

Published faces are re-derived from serialized per-seed cells rather than trusted because a script printed them once.

### Multi-grain measurement

Friendly-match effects, per-player decisions, season-level ecology and evolutionary slopes are kept as different estimands. A local improvement does not automatically become a claim about long-horizon football.

### User play-test gates

Some questions are intentionally left to perception: if the measured world says a behavior is coherent but it still does not read as football, the user's eyes remain a legitimate gate rather than being overwritten by metrics.

---

## Start here if you are changing the world

Do **not** read the entire programme history into context.

1. [`docs/world-model/PROGRAMME.md`](docs/world-model/PROGRAMME.md) — read the live `QUEUE` section.
2. Tail [`docs/world-model/PROGRAMME-RULINGS.md`](docs/world-model/PROGRAMME-RULINGS.md) — current adjudications.
3. Open the contract/stage doc named by the active ruling.
4. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before changing module ownership or determinism-sensitive code.
5. Run the relevant pin suite before and after the change.

Historical rulings live in the archive files; grep by ruling number rather than loading them wholesale.

---

## Architecture

```text
src/
├── game/            fixed-timestep app orchestration and match flow
├── sim/             deterministic world state, physics, league, cup, records
├── ai/              team/player decisions, steering, formation, perception
├── evolution/       tactical/player/policy genomes, fitness, lineage
├── render/          2D/3D presentation
├── ui/              browser panels and inspection surfaces
└── data/            save/load and persistence

tests/               determinism, contracts, pins, regression and render checks
scripts/             calibration, probes, batteries and research instruments
docs/world-model/    programme, contracts, rulings, stage reports and artifacts
```

**Dependency rule:** simulation / AI / evolution stay independent from presentation so the same world can run headless, in tests, in research batteries, or in the browser.

---

## Determinism

All simulation randomness flows through seeded generators. A watched match and a headless match execute the same underlying world steps.

The repository treats deterministic replay as an invariant, not a convenience:

- the Node/V8 runtime used for research batteries is pinned in `.nvmrc`;
- save/load and worker/main-thread paths are regression-tested for equivalence;
- world flags must prove dormant equivalence before their effects are interpreted;
- a production fingerprint guards accidental movement of the baseline world during instrument-only work.

---

## Development & validation

```bash
nvm use
npm ci

npm test
npm run typecheck
npm run build

# balance / ecology
npm run calibrate
npm run evolve-check

# browser checks — requires a dev server on the expected port
npx playwright install chromium
npx vite --port 5199 --strictPort &
npm run debug:visual
npm run debug:visual3d
```

The exact number of tests/checks is intentionally not hardcoded here; it changes frequently. The suite and current programme receipts are the authority.

---

## Controls

- **Pause / play** the live match.
- **Skip** to finish the current deterministic match immediately.
- **Simulate** rounds/seasons/generations headlessly.
- Switch between **3D and 2D** views.
- Click players to inspect the current action and utility scores.
- Toggle debug overlays for formations, passes, marking, pressure and movement.
- Use cinematic mode / screenshots / share summaries for presentation.
- Export/import league saves as JSON.
- Switch the interface between Chinese and English.

---

## Project principle

A football simulation gets more interesting when "realism" stops meaning *add more rules* and starts meaning:

> **define the mechanism, state what would falsify it, run the world, keep the red results, and only then decide what the next layer should know.**

That is the direction of EvoFootball Arena: not a perfect football simulator, but an increasingly explicit one.
