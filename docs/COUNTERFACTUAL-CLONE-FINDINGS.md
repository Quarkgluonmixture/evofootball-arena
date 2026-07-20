# Counterfactual-value probe: clone vs replay — findings & recommendation

**Question.** For the counterfactual-value probe (offline oracle that certifies
the live cheap value estimator), we freeze a mid-match `Match` state and fan out
several short (2–4 s) branches, each forcing a different candidate action. Can we
**deep-clone the live `Match` mid-tick (option A)**, or must we **replay from the
seed to tick T and branch (option B)**? It must be fully deterministic.

**Recommendation: OPTION A — structural deep-clone.** It is feasible, provably
byte-identical, field-agnostic (robust to future sim fields), and ~340× cheaper
per branch than mid-match replay. A throwaway POC
(`scripts/probes/_poc-clone.ts`) confirms it. Keep option B (replay) only as an
independent cross-check when first standing the probe up.

---

## Why the sim is clonable at all: it is a closed, seed-deterministic state graph

- **Single randomness source.** `Match` constructs exactly one `Rng`
  (`Match.ts:252`, `this.rng = new Rng(cfg.seed)`). Every other `new Rng(...)`
  in the codebase is between-match (League/cup/evolution). `mulberry32`'s entire
  state is one `u32` field `s` (`rng.ts:7`). No `Math.random`, no `Date`,
  no `performance.now` anywhere in the sim path (`src/sim`, `src/ai`,
  `src/evolution`, `src/utils`) — the only such calls live in UI/render
  (`SoundFx`, `FxSystem`, `GameApp`, showcase) and in the profiler, which is
  pure-observational.
- **Fixed timestep.** `DT = 1/60`, `MATCH_DURATION = 240 s` ⇒ a full match is
  **14,400 steps**; a mid-match freeze is ≈ 4,000–9,000 steps in.
- **No hidden mutable module state that couples across a run.** The determinism
  test (`tests/match.test.ts`, "same seed ⇒ identical result") runs match A to
  completion, *then* match B — if any module-global accumulated across matches,
  they'd diverge. They don't. The only module-level mutable things are
  `Player.ts`'s `turnDt/turnCos/turnSin` (a pure cache keyed by `dt`, identical
  for original and clone) and `formations.ts`'s `_emergentPos` (a config toggle,
  constant during a run). Neither is per-tick state.
- **Watched ≡ headless.** `tests/match.test.ts` ("watched equals headless") and
  `tests/simRunner.test.ts` (mid-season handoff is byte-identical) already prove
  step-by-step replay reproduces state exactly. That guarantee is what makes
  option B *correct*; the state-graph closure is what additionally makes option
  A correct.

## The four specific determinations asked

**(1) Does `Match` hold non-serializable refs — circular Player↔Team↔Match,
closures, functions?**
- **No closures or function-valued fields** in the state graph. `ActionState` is
  `{type, targetPos?: V2, targetIdx?: number, scores: UtilityScore[]}` — all
  data (`types.ts:110`). Methods live on class prototypes, never as own props.
- **Shared refs and near-cycles, yes — but tractable.** `Ball.owner` and
  `Ball.lastTouch` are direct `Player` refs (`Ball.ts:25-26`); the same `Player`
  is reachable via `Match.allPlayers`, `Match.teams[s].players`, and
  `Match.allPlayersReversed`. `Player.faceTarget` aliases `ball.pos` or a Team's
  cached goal `V2` (`Player.ts:52`, confirmed in `actionExecutor.ts`), but it is
  rewritten every frame, so its aliasing need not survive a clone.
- **Sets/Maps.** `Team.chasers: Set`, `Team.marks: Map`, `Team.runners: Set`
  (`Team.ts:56-60`) — JSON can't round-trip these; a structural cloner can.
- **`private` is not a barrier.** TS `private` is erased at runtime, so the
  probe reads/writes `rng.s`, `Match.stepCount`, `Match.pendingOut`, etc. from
  outside without touching any shared sim file.
- **Almost everything else is gid-indexed already** (`pendingPass`,
  `pendingShot`, `fkWall`, `carryStart`, `restart.takerGid`, `dribbleTouch`,
  `attackEntry`, per-player stat rows) — numbers, trivially clonable. The only
  object refs needing remap are `Ball.owner`/`lastTouch`.

**(2) Can the RNG state be captured + restored for an exact continuation?**
- **Yes, exactly.** The whole PRNG state is one `u32` (`s`). Reading
  `(rng as any).s` and assigning it reproduces the stream bit-for-bit. The
  structural cloner copies `s` like any other data field — no getter/setter and
  no edit to `rng.ts` required. (Verified by the POC's negative control: nudging
  the clone's `s` by a single increment diverges within the 4 s window.)

**(3) Can a structural deep clone reproduce a byte-identical continuation?**
- **Yes — proven.** A generic, **field-agnostic** cloner that (a) preserves
  class prototypes via `Object.create(getPrototypeOf(v))` so the clone is a real
  `Match` with working methods/getters, (b) uses a `seen` map so shared refs and
  cycles collapse correctly (`ball.owner` remaps into the *clone's* player
  graph), and (c) special-cases `Set`/`Map`, is all that's needed. It knows
  nothing about sim field names, so a field added tomorrow is cloned
  automatically — the fragility that would doom a hand-written serializer.
- `structuredClone()` alone is **not** sufficient: it strips class prototypes
  (methods gone) and throws on the graph shape we'd want to keep. The ~40-line
  custom cloner in the POC is the right tool.

**(4) Cost of option B (replay per branch) — acceptable for an OFFLINE probe?**
- **Absolute cost is acceptable; relative cost is wasteful.** Mid-match replay to
  T measured ≈ **94 ms/branch** (~17 µs/step); a deep-clone is ≈ **275 µs/branch**
  — **~340× cheaper**. For N candidate actions from one frozen state, option B
  pays N × (full replay to T); option A pays one handoff + N × clone. Since the
  probe is offline this is never a correctness issue, but at scale (many freeze
  points × many candidates × many matches) the replay tax is real, and option B
  also requires carrying seed + config + the *exact* tick T alongside the frozen
  state, which a "frozen state" handoff may not have. Clone needs only the live
  object.

## POC result (`scripts/probes/_poc-clone.ts`, throwaway)

```
cases run      : 25 (5 seeds × 5 freeze ticks, incl. either side of half-time)
clone continues: 25/25 identical for 240 steps (4 s)
full-remainder result identical (clone → full time): YES ✓
negative control (1-bit RNG nudge diverges): DIVERGED ✓
replay-to-T (option B/branch): ~94 ms   (~17 µs/step)
deep-clone  (option A/branch): ~275 µs
clone speedup vs mid-match replay: ~342×
RESULT: PASS — structural clone reproduces a byte-identical continuation.
```

The clone was verified to be a distinct `Match` instance with a distinct `Rng`
and `Ball`, with `ball.owner` remapped into the clone's own player graph; a full
dynamic-state fingerprint (all player kinematics/timers, ball, score, RNG `s`,
team assignment Sets/Maps, events) matched at every one of the 240 continuation
steps, and — more strongly — cloning at T and running **both to full time**
yields byte-identical `MatchResult`.

## Recommendation & recipe

**Use option A (structural deep-clone) as the probe's branch primitive.**

1. Freeze: hand the probe the live `Match` at tick T (no seed/T bookkeeping
   needed).
2. For each candidate action: `const branch = deepCloneSim(frozen)`; force the
   action into `branch` (e.g. set the carrier's `action`, or call the relevant
   `perform*`/`giveBall` path); run K = 2–4 s of `branch.step(DT)`; read the
   possession/threat outcome.
3. Determinism holds because the clone captures the entire state graph incl.
   `rng.s`, and the shared module-level caches are pure functions of `dt`.

**Guardrails for the real (non-throwaway) implementation:**
- The cloner must stay **field-agnostic** (prototype-preserving + `seen` map +
  Set/Map). Do **not** hand-enumerate fields.
- Add a standing regression like the POC's negative control + full-remainder
  check so a future sim change that breaks clonability is caught immediately.
- If a `WeakMap`/`WeakRef`/typed-array/`Date`/`RegExp` field is ever introduced
  into the sim state, extend the cloner's special-cases (none exist today).
- Keep option B (replay) available as an *independent* oracle-of-the-oracle when
  first validating the probe — agreement between clone-branch and replay-branch
  outcomes is a cheap, strong sanity check.

**Constraints honored:** no shared sim file was modified (read-only + the single
throwaway script); the sim's only randomness is the seeded `Rng`; work is on a
branch, not main.
