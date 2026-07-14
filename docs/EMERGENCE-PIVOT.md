# The emergence pivot (2026-07-14) — READ BEFORE THE NEXT BUILD

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

## The plan (next session)

1. **First cut — the master gate (Bucket 2): make the 1v1 reward pace +
   technique**, gene/attr-driven and UNBIASED (NO `if role==='WG'`; wingers must
   EMERGE as the dribblers because evolution puts pace/dribble genes into wide
   attacking roles). Consider space-vs-pressure payoff too.
2. **Re-run `evo-drift.ts` — the evolution-native success gate:**
   - ✅ success = `attackingWidth` stops collapsing / rises on its own; wing play
     & dribbling emerge; goals healthy.
   - ❌ fail = width still craters to ~0.1 → the substrate still doesn't reward it,
     keep going.
   - Do NOT judge by hand-tuned outcomes.
3. **Then (optional, deeper): release Bucket-3 biases** — start with the shared
   `DEFAULT_POLICY` → gene-driven, so decision style emerges.

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
  `phase-28.6` (chest/thigh trap). HEAD fingerprint `7efd3ef6…`.
- **Parked — do NOT resurrect as-is** (all fight the evo gradient / are 治标):
  the winger take-on, the winger run-license, the widen-formation.
- **Probes kept**: `evo-drift.ts` (⭐ the success gate), `churn.ts`,
  `spell-dist.ts`, `winger.ts`, `pingpong.ts`.
