# The emergence pivot (2026-07-14) — READ BEFORE THE NEXT BUILD

> **2026-07-14 (later the same day): the PLAN half of this doc is superseded
> by [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md)** (the user ratified a four-stage
> vision: Engine → Visibility → World → Substrate, with phases 45+ sequenced
> there). This doc stays canonical for the RATIONALE, the substrate audit
> (the three buckets), the gates, and the §5 turnkey attribute scope that
> phase 47 executes verbatim.

The whole approach changed this session. Big code changes were deliberately
deferred to a fresh session; this doc is the handoff.

## The turn (the user's reframe)

> "真正的应该是自己涌现各种风格、技巧、二过一、战术等等,而非我们去设置。
> 这才是我更希望的 evo 的含义。"

**Tactics / skills / styles must EMERGE from evolution + selection — NOT be
hand-coded.** I spent most of this session in game-designer mode (hand-built a
winger take-on, a winger run-license, a wider formation) — all **reverted**.
That instinct is wrong for this project. The job now is to build a rich,
UNBIASED **substrate** + sharp **selection**, and let tactics evolve.
(Durable principle saved to memory: `feedback-evofootball-emergence`.)

## What triggered it — the winger investigation (probes kept in `scripts/probes/`)

Chasing three play reports ("边锋被紧逼太紧、没有用" + "中场乱抢" + "零点几秒
丢球权"):

- **Churn is sub-second + midfield** (`spell-dist.ts`): ~6.6 possessions/match
  die within 1s, **69–70% of those in the middle third**. The mean spell
  (~4.7s) hid this short tail.
- **Wingers aren't under-marked or under-running** (`winger.ts`, `churn.ts`):
  they receive the MOST of any role (~28/match), have 5–6.5m of off-ball space,
  and already run when licensed (57%). They **dead-end ON the ball**: receive
  with ~4.5m, the marker closes to ~1.3m in ~0.5s, and they progress the ball
  only **1.87m** on average — advancing >2m upfield just **18%** of receptions.
  They recycle.
- **Space per player is FINE** — 435 m²/player vs 11v11's 325. The suffocation
  is behavioral: the attack plays a **compact central clump** (widest attacker
  |y| = **15.6m** of a 29m touchline; both teams cluster in ~540–700 m² boxes in
  the middle third). The defense stays compact **because the attack never uses
  the flanks or depth**, so a small block covers everything.
- **The take-on test** (built, measured, REVERTED): a pace-driven 1v1 fired
  ~4.5×/match at 91% retention and was balance-neutral — but in compact 6v6 the
  cover is back at **2.06m within 0.7s**: beating one man just meets the next,
  no space opens, and it added ~+2.7 interceptions. It's 治标, and (below) it
  fights the evolutionary gradient.

## The decisive test — does evolution select any of this? (`evo-drift.ts`, 50 gens × 2 seeds)

**YES, players evolve richly — and evolution selects the no-space slugfest on
purpose:**

| over 50 gens (seed 424242 / 777) | gen 0 → gen 50 |
|---|---|
| WG pace | 0.66→0.87 / 0.64→0.93 |
| WG technique | 0.36→0.60 / 0.37→0.75 |
| ST finishing (control) | 0.60→0.99 / 0.64→0.80 |
| **attackingWidth (gene)** | **0.57→0.19 / 0.45→0.09** |
| **pressIntensity (gene)** | **0.48→0.74 / 0.42→0.85** |
| dribbleBias (gene) | 0.52→0.86 / 0.56→0.78 |

- All player attributes inflate toward the cap (players DO evolve, get fast +
  skilled). Selection works.
- **`attackingWidth` COLLAPSES; `pressIntensity` CLIMBS.** The evolved
  equilibrium = fast, skilled players packed NARROW, pressing HARD = exactly the
  no-space midfield churn the user hates. **It is not a bug — it is optimal**
  given the substrate (width/skill don't pay → narrow+press wins).
- **Corollary: any hand-set width/winger fix fights this gradient and gets
  collapsed back.** Must flip the gradient at the substrate, not fight it.

## The substrate audit (three buckets)

**Bucket 1 — SUBSTRATE, keep (the fixed stage):** physics engine; the gene
dimensions (14 tactical genes + 5 attrs `pace/technique/finishing/defending/reflexes`);
the role skeleton (GK/DF/MF/WG×2/ST); the utility-brain ARCHITECTURE (score
actions, pick best).

**Bucket 2 — GAPS: the substrate doesn't reward genes that should matter → no
selection gradient → tactics can't emerge:**
- ⭐ **1v1 duel ignores pace and under-weights technique.** `tryTackles`:
  `0.21 + markingAggression·0.2 + defending·0.24 − dribbleBias·0.08 −
  technique·0.12` — **pace weight = 0**. "Beat a man with pace/skill" can never
  pay → dribbling/wing-play/width get no gradient → the measured width collapse.
  **THIS IS THE MASTER GATE.**
- **Width has no payoff** (downstream): wingers dead-end; holding width doesn't
  hurt the defense → `attackingWidth` is selected down. Need stretch → space →
  chances to actually pay.
- **Space-vs-pressure payoff is too flat**: playing under a tight press isn't
  punished enough / space isn't rewarded enough → high-press+compact is optimal
  (why `pressIntensity` climbs to 0.85).

**Bucket 3 — HAND-SET TACTICAL BIASES (we set these; hand to genes so style can
emerge — but only AFTER Bucket 2):**
- ⭐ **`DEFAULT_POLICY` is shared & fixed** (`sim/types.ts`): every team uses the
  same ~35 decision weights (shootBase, passBase, dribbleBase…); the 14 genes
  only modulate. `info.policy`/`rolePolicies` are never set (wildcards removed
  in 29.2). So "how a team decides to play" is ~90% hand-set. Biggest lever:
  make the policy (or key weights) gene-driven so decision STYLE evolves.
- **`ROLE_BIAS`** (`playerGenome.ts`): WG pace+0.25, ST fin+0.25, etc. — wingers
  are fast because we SET it, not because evolution differentiated them.
- **`RUN_ROLE_W`** {DF0.4/MF1.2/WG1.8/ST2.2} — who makes runs, hardcoded.
- **Runner-count formula** (`assignRunners`: 1 + counter/tempo + urgency).
- **Support roleBonus** (`decideOffBall`: ST0.12/WG0.1/MF0.06).
- **Formation library is 2×2** (wide-212/narrow-122 × low-32/press-23), picked by
  gene thresholds — a tiny shape space; limits "formations evolving".
- **Mode thresholds** (`ballLocalX>4→Attack`, `pressScore>0.62→Press`) and
  **marking role rules** (WG width-discipline, contain gating).

## The order (the one rule that matters)

**Gaps before biases.** Handing a bias to genes only helps if a selection
gradient exists to climb; otherwise it's just noise. Right now, gene-ifying
"width" would do nothing (width still values 0). So: **fix Bucket 2 (create the
gradients) FIRST, then release Bucket 3 (let evolution use them).**

## The plan

1. ✅ **DONE (phase-41) — the master gate (Bucket 2): the 1v1 now rewards pace +
   technique**, gene/attr-driven and UNBIASED (no `if role==='WG'`).
   `mechanics.tryTackles` carrier-evasion is now
   `− dribbleBias·0.08 − technique·0.18 − pace·drive·0.20`, where
   `drive = clamp(len(owner.vel)/9, 0, 1)` is momentum (~0 jostling in a crowd,
   ~0.5 at the 4.5 m/s "real sprint", ~1 flat out). Momentum-gating is the
   deliberate choice: a flat pace term would just make everyone fast-and-narrow;
   gating on speed means pace only pays where you can BUILD speed (room ahead —
   the flanks/channels), so it is the space→width link, not a blanket buff.
2. ✅ **DONE — `evo-drift.ts` success gate PASSED** (50 gens × 2 seeds):
   - `attackingWidth`: baseline cratered **0.57→0.19 / 0.45→0.09** (ended in the
     hole). Now **bottoms then CLIMBS OUT → 0.27 / 0.31** — seed 777 rises from
     0.077 (gen20) to 0.313 (gen50) on its own. The collapse is arrested; width
     recovers. ✅ (not a full reversal to 0.5+, but the gate was "stops
     collapsing / rises", and it does.)
   - `dribbleBias` climbs harder (→0.84 / 0.90); `pressIntensity` climbs LESS
     (777: 0.85→0.70) — the relentless-press equilibrium softened. ST-finishing
     control still climbs (→0.91/0.96): selection machinery intact.
   - Balance (`calibrate -- 8`, two seeds): goals **2.41/1.78 → 2.71/2.17**
     (mean 2.44, on README's ~2.5 target — no inversion); **won tackles
     16.8/15.3 → 11.1/11.4** (the intended mechanism: carriers now retain);
     through-balls up, completion/possession flat. NOT compensated back — pulling
     goals down means raising tackle success, which would undo the width gradient.
3. ✅ **DONE (phase-42) — released the shared `DEFAULT_POLICY` to per-franchise
   evolution** (attacking-style subset: shoot / dribble / forward-vs-back-pass /
   through / cross / loft / long-shot / run appetites, bounded [0.5×,1.7×] of the
   DEFAULT, `evolution/policyGenome.ts`; fed via the kept `info.policy` hook,
   evolved in `evolve.ts`'s mutated + reborn tiers). `policy-emergence.ts` gate
   PASSED: cross-franchise style spread rises **0% → ~20-24% and PERSISTS** (both
   seeds) — distinct styles COEXIST (calibrate shows seed-leagues evolving
   different metas: one pass-heavy 94/match, one direct/crossing 72/match).
   Balance: goals mean 2.32 → **2.52** (on the ~2.5 target), no inversion. Every
   franchise is BORN at DEFAULT, so any style is earned by selection, not seeded.
4. **Broaden the emergence** (user 2026-07-14), ONE lever at a time, each gated
   by `policy-emergence` + `calibrate`: ✅ **phase-43 (defence)** + ✅ **phase-44
   (build-up: passBase / passLaneW / passOpenW / passOutletMul / supportBase)**
   SHIPPED — ATT+DEF+BUILD spread 0% → ~20% persists, goals 2.40 / 2.34 in band.
   ✅ **the easier lot SHIPPED (phase-45)**: 套路 trigger appetites are policy
   genes (`wallPassW/thirdManW/overlapW`, save v13) + the coherence BASELINE is
   measured (details in EVO-BLUEPRINT.md's status ledger). Player-level biases
   (`ROLE_BIAS`, `RUN_ROLE_W`) ride with the Fable attribute phase.
5. **OPEN THREADS (user 2026-07-14) — TRIAGED (user: hardest → a later Fable
   model, do the rest now):**
   > ⭐ **META (user 2026-07-14): don't hard-code presets — these are GOALS +
   > constraints, not a rigid recipe. Fable model: use your own judgment/
   > ingenuity.** In particular, do NOT pre-define the style archetypes (no fixed
   > "Gegenpress / Tiki-taka" buckets I hand-picked) — build the SUBSTRATE +
   > constraints and let the archetypes EMERGE, then discover/name them from the
   > actual evolved data. Hand-coding presets is the exact designer-mode trap the
   > pivot exists to avoid.
   - **Style COHERENCE** — a club's defence should RELATE to its attack (co-
     evolve, mutually influence), like real teams. Emergence-way: let coherence
     be SELECTED (fitting styles win), don't hand-wire correlations — MEASURE it
     (add cross-gene correlation to `policy-emergence`); a flat correlation = a
     substrate/selection lever to fix, not a thing to hardcode.
   - ⚠️ **FOR A LATER FABLE MODEL — Evolution VISUALIZATION module** (hardest,
     deferred) — a big UI to SEE styles diverge, the main fix for "NOT PROMINENT"
     (see §6): team identity cards with **STYLE NAMEPLATES derived from each
     club's ACTUAL evolved gene profile — DATA-DRIVEN, not hand-picked buckets**
     (e.g. cluster the population and describe each emergent cluster by whatever
     genes actually dominate it, or summarise a club by its own gene extremes;
     let the categories + names come from the data, per the §5 META), a
     style-space map (teams
     plotted by directness × press, clustering into archetypes), gene/policy
     drift curves, diversity over generations. Substantial build — scope first.
   - ✅ **SHIPPED (phase-47)** — Attribute richness (executed per the scope below;
     see EVO-BLUEPRINT.md's status ledger for gate evidence). (Original scoping
     kept for reference:) (hardest, deferred per
     user 2026-07-14; the "还有球员" half — build-up took the phase-44 slot). 5
     attrs is COARSE vs FIFA/FM and `technique` is OVERLOADED. Plan (SCOPED —
     turnkey; big + balance-sensitive, do it FOCUSED not rushed):
     - **5 → 8 attrs**: `pace / passing / dribbling / finishing / defending /
       strength / stamina / reflexes` (split technique → passing+dribbling; add
       strength+stamina). Edit `PlayerAttributes` + `ATTR_KEYS` in
       `playerGenome.ts`; mutate/crossover/randomPlayer iterate ATTR_KEYS (free).
     - **Remap ~25 `attrs.technique` readers** (`tsc` lists every one — ~64
       errors): **passing** = pass/cross/through/loft/switch/FK noise+power
       (`mechanics` orientation*, PlayerBrain loft/through/cross gates 372/456/
       515, kick-misalign 299/1047); **dribbling** = first touch
       (`touchFailChance` 92/682, `oneTouchMul` 160, touchTimer M564), carry
       push/speed (1004/1017, actionExecutor 240), tackle-resistance
       (`tryTackles` owner 1223), 1v1-vs-keeper 1096, shot strike/curl
       (819/827/828, PlayerBrain 235, M1144), back-to-goal 575. ⚠️ **GOTCHA:
       `p.attrs.technique` is context-AMBIGUOUS in mechanics.ts** — the SAME
       `p.` var is a PASS in one fn (325–331) and a TOUCH in another (92/160) —
       so map PER LINE, do NOT blanket replace_all `p.attrs.technique`.
     - **New payoffs (each attr must MATTER)**: strength → `aerialSense` (replace
       its `technique*0.1` term, mechanics 470) + a `tryTackles` shield term +
       hold-up/50-50; stamina → scale the uniform fatigue drain/recovery in
       `Player.physicsStep` (~229–232) by `attrs.stamina`.
     - **Also update**: `ROLE_BIAS` MF technique→passing (strength/stamina
       UNBIASED); `traits.ts` playmaker→passing≥0.8, poacher→dribbling<0.6;
       `careers.ts DECLINE_W`, `playerGenome squadSummary`, `Team` captain pick
       (138, →(passing+dribbling)/2), `evo-drift.ts`/`evolve-check.ts` — all need
       the 8 keys. **Save v11→v12**: passing=dribbling=old technique,
       strength=stamina≈0.4 (neutral).
     - **Balance-SENSITIVE** (passing/first-touch → completion → fm 16-21): gate
       HARD with `calibrate` (both seeds, watch completion+goals) + a player-
       archetype probe (do WG evolve dribble≫pass, MF pass≫dribble?).
   - ✅ **SHIPPED (phase-48)** — RESOURCE BUDGET (see EVO-BLUEPRINT.md's status
     ledger for gate evidence; original scoping kept below). (user 2026-07-14, the key to
     "有限资源下涌现不同风格"). TODAY there is NO budget: evolution maxes EVERY
     attribute (evo-drift: ST finishing → 0.99, WG pace → 0.9) → "good at
     everything" wins → little pressure to SPECIALISE, so archetypes stay faint.
     Add a squad points / wage CAP (a total attribute budget) so raising one attr
     COSTS another → forced tradeoffs → fast-but-fragile vs technical-but-slow vs
     strong-but-plodding EMERGE, each reading as a distinct playstyle. UNBIASED
     (evolution chooses where to spend). PAIRS with the attribute split (a budget
     is what makes "passer vs dribbler" a real choice) and with coherence (a
     budget forces coherent tradeoffs). Likely the single highest-leverage lever
     for the whole vision — and it makes divergence BIGGER + FASTER (see §6).

6. ⭐ **CROSS-CUTTING (user 2026-07-14): the evolution's results are TOO SLOW to
   see and NOT PROMINENT.** Divergence currently needs ~20–50 seasons to show and
   is subtle even then. Every emergence change above must optimise for FAST +
   VISIBLE divergence, not just eventual divergence:
   - **Faster / bigger**: the RESOURCE BUDGET forces specialisation immediately;
     also consider stronger selection (harder culling) / larger style-mutation
     early, so archetypes separate in a handful of seasons, not dozens.
   - **Prominent**: the VIZ module + **STYLE NAMEPLATES** (above) are the fix —
     make a club's emergent identity legible at a glance, so you don't have to
     watch closely or sim forever to SEE evolution working. This is a first-class
     requirement for the Fable work, not a nice-to-have.

## Guardrails
- **fm 16–21 danger zone** (marking / completion / structure — goals can invert,
  see ARCHITECTURE §10). Gate EVERY change with `npm run calibrate -- 8` on two
  seeds; watch goals AND goals-conceded.
- **Do not hand-set behaviors.** If a good tactic doesn't show up, it is a
  substrate or selection problem — fix that, then let evolution find it.
- Standard completion gate still applies to any shipped change (tsc + vitest +
  both Playwright suites + build + fingerprint rebaseline + docs).

## State at handoff
- **Shipped** (committed + CI green): `phase-28.5` (keeper hands stay in the box),
  `phase-28.6` (chest/thigh trap).
- **phase-41 (the master gate)** — the 1v1 pace/technique rework above; full gate
  passed (tsc + vitest 306 + both Playwright suites 75/37 + build). HEAD
  fingerprint `79f6dd04…` (41→41.1→42 `fd6e9d05…` → 43 `85cdb0b4…` → 44
  `79f6dd04…`, each behavioral). `cards.test.ts`
  dirtiest-award test bumped to 240s matches (the per-division award needs cards;
  60s + an outcome shift once tipped seed 9 to zero — not a mechanic regression).
- **Parked — do NOT resurrect as-is** (all fight the evo gradient / are 治标):
  the winger take-on, the winger run-license, the widen-formation.
- **Probes kept**: `evo-drift.ts` (⭐ the success gate), `churn.ts`,
  `spell-dist.ts`, `winger.ts`, `pingpong.ts`.
