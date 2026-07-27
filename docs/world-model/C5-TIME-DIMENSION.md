# C5 — The Receive-Phase Time Dimension (design contract, commander-owned)

Status: **DRAFTED 2026-07-27 under ruling #26.3**, on the Phase-0 code map
([`C5-PHASE0-CODE-MAP.md`](C5-PHASE0-CODE-MAP.md), consumed). Stage
contracts are pre-registered individually by the autonomous session (the
EDS pattern). This document fixes scope, order, invariants and the ship
gate; it is not itself a frozen experiment.

Authority: VISION §1 (soul: capabilities, never behaviours) · §2
(watchability hard gates) · §3.1 user anchors (receive-phase time
dimension 2026-07-26 · kick 前后摇 2026-07-26 · tempo 1.1–1.2× 2026-07-27)
· PROBE-CONTRACTS (all semantics blocks) · ruling #26 (road B).

## 1. The measured case

Four independent arrows at one seat:

```text
E4 round 1      "真实回传是持球引开防守人之后的选择" — the back-pass reflex
user anchor     pass-on-receipt in ALL modes incl. triple (2026-07-26)
E5f             longer overlap windows yet fewer passes inside them (0.662×)
E5g + E5h       0.177 pass-commits per matured run — and the clock is a
                SHARED CONSTANT across brains (0.2499 vs 0.2267): the
                action layer, not the chooser
```

And the Phase-0 map's findings, cited as ground truth for every stage:

* **The WHETHER seat does not exist.** One-shot argmax over "how to move
  the ball or carry it" every 0.15 s (`PlayerBrain.ts:152` cands,
  `785/791` sort-and-take, `Match.ts:717` AI_INTERVAL); no memory, no
  "none of the above"; both fallbacks land on Dribble (`787–789`,
  `961–962`) — not-passing means MOVING, never holding.
* **The only time term punishes waiting.** `stagnation`
  (`PlayerBrain.ts:176`) suppresses HoldUp ×(1−0.5·stag) at `606` and
  boosts Dribble ×(1+0.28·stag) at `650`. The substrate HAS a possession
  clock — wired as a penalty, with no term anywhere paying FOR time.
* **HoldUp exists but is narrow**: ST-role or corner control, back-to-goal
  > 0.45, pressure > 0.2; execution is a 1.4 m drift (`actionExecutor.ts:
  387-405`), not shielding. A forward-facing free player cannot hold.
* **The kick is a zero-tick event**: committed and struck inside the same
  decision call (`PlayerBrain.ts:911–956`; `actionExecutor.ts:380-386`
  "kick already happened at decision time"). No committed-but-unstruck
  state exists — nothing can close on it, read it, or cancel it. The
  ACCURACY half of body-orientation is already live and ability-scaled
  (`kickMisalignment`, `mechanics.ts:77`); C7 owes only the TIME half.
* **One-touch is priced but never chosen**: `firstTouchWindow` is set by
  PRESSURE (`Match.ts:1195-1203`), both branches carry real
  technique-scaled prices (`mechanics.ts:262`, `touchFailChance:109`,
  E1b's dormant curve at `106/174`) — and no cands entry reads the fork.
* **Holding is effectively unattackable today** (glue `Match.ts:1276-1283`
  + drift; shielding exists only as an attr term inside tackle
  resolution, `mechanics.ts:1771-1775`, never as body position). E5h's
  lesson in new clothes: an unattackable option will always be selected.

Registered honestly per ruling #25.1: **C5 is a feel/realism slice on four
arrows. It is NOT an overlap repair** — the clock is a shared constant.

## 2. Scope of the first cut (v1)

IN — four pieces that form one seat:

1. **Hold, generalized** (dormant mechanics): available to any role at any
   facing; body-position SHIELDING (body between ball and nearest threat)
   with optional slow protective carry; **attackable by construction**
   (invariant I1); execution priced by attrs (strength / balance / the
   existing shield attr) and stamina.
2. **The one-touch fork as a real choice**: release-into-the-window vs
   control-first becomes a decision input; both branches keep their
   existing measured prices — the fork point is the only new thing.
3. **The waiting census** (instrument first — the house move): at
   value-brain decision moments, fork the deterministic world and force
   HOLD for k ticks (a small pre-registered ladder) versus act-now;
   outcome on the SAME axis as the attempt tables (shot-within-horizon,
   every window simulated, no adjudication conditioning). Context
   features fixed at pre-registration (pressure band, staleTime band,
   support count — each floor checked against the ATTAINABLE population
   ex ante, the #24 P2 lesson). Table SHA'd and committed as data.
4. **WHETHER joins the measured axis, value brain only**: the dormant
   chooser gains hold-vs-release (hold priced from the census) and the
   one-touch fork (priced from its two branches). This heals one edge of
   the two-judges seam (E4 round 1) on the measured side.

**C7 — the wind-up window — shares this contract, not these stages** (§3
T5+): the same ball-foot time seat, but it touches every kick in the
game; separate flags, separate battery, sequenced after T4, splittable
without a new ruling.

OUT of v1, explicitly: **any legacy-brain behaviour change** (the
flags-off world stays bit-identical — stagnation and narrow HoldUp keep
their code paths verbatim); C6's full de-glue (turning / slow-carry /
pressure-carry pricing — its own registered slice); an active scan/gaze
action (seat 2 stays parked; pull perception already refreshes during a
hold); joint/multi-step value (#26.3, parked); coach tempo doctrine (A4);
positioning (Stage III).

## 3. Stages (each pre-registers its own contract)

```text
T0  HOLD + FORK MECHANICS, dormant — flag family `c5Hold`/`c5TouchFork`,
    zero live callers, fingerprint unchanged flags-off, two-run
    determinism, X-style flag-off identity pins. The shield becomes a
    body position; the poke/tackle window against it opens (I1).
T1  THE WAITING CENSUS — fork-and-force, C3R floor discipline + the
    attainable-population check ex ante, #20 cluster semantics, table
    SHA'd as data, zero src. Time-signature instruments DEFINED here
    (passes/min, time-to-release distribution, hold-duration
    distribution, one-touch share) — the tempo census rides this stage.
T2  WHETHER INTEGRATION, dormant A/B probe — staging pins against banked
    E5f/E5g/E5h integers wherever a staging is reused; flag-off paths
    behaviour-neutral by construction and pinned.
T3  LIVE AUDIT — the full #20 battery: §2 band, perf 1.25×/1.50×,
    Y4-style flag-off identity, watchability counters HARD (flags-off
    paired), time-signature instruments REPORTED, plus the
    HOLD-DOMINANCE check (I1's gate form). Any fire → commander.
T4  E4 ROUND — the user plays the slice (per-slice gate, ruling #26.1).
T5+ C7 WIND-UP stages — own pre-registrations, own battery, only after
    T4's verdict; the biggest blast radius in the family (every kick).
```

## 4. Design invariants — the Phase-0 map's six questions, ruled

* **Q1 — Hold is a CANDIDATE, never a modifier.** The measured gap IS the
  missing option; a modifier hides the choice from measurement and from
  selection, and a candidate is an observable external state — opponents
  see shielding, never intention (the 内心/外显/推断 model holds).
* **Q2 — the WORLD pays for waiting; the census prices it.** No
  forward-looking bonus term is invented anywhere. Waiting's real
  benefits (runs maturing, pressure drawn, percepts refreshing under
  pull semantics) flow through the NEXT decision's genuinely better
  menu; the census measures the net exchange rate on the same outcome
  axis the pass prices use — the E2b-0 move applied to time. If today's
  world pays little for patience, the table says so honestly; road B
  enriches the world and re-censuses (#26.5).
* **Q3 — stagnation stays legacy-only.** In the measured seat, time's
  price comes from the census (staleTime is a census feature, so any
  real decay is IN the table); the hand-penalty is neither copied into
  the value seat nor removed from the legacy one.
* **Q4 — a NEW generalized Hold; legacy HoldUp untouched.** Shield-hold
  is the v1 action. "Look around" is not a separate action in v1 —
  that is seat 2's future consumer. The `layingOff` synergy (`281/326`)
  is a named natural consumer, later.
* **Q5 — C7 shares the contract, not the stages** (§2 above).
* **Q6 — NO FREE TIME (I1, the hard invariant).** Every held tick must
  be attackable: pressure closes, poke/tackle windows open against the
  shield (priced by both sides' attrs), stamina drains. A Hold that
  cannot be lost is the ×1.3 subsidy in a new costume (E5h) and C1-A2's
  free option. T3 carries an explicit pre-registered hold-dominance
  ceiling; a world where holding never loses the ball stops the queue.

## 5. Gate sources (named now, frozen per stage at pre-registration)

Banked integers for staging pins (E5f funnel · E5g trace · E5h commits);
the committed attempt tables for axis comparability; PROBE-CONTRACTS in
full (#20 CI/cluster semantics · #19+#24 floors re-powered AND attainable
· #18 staging/definition pins separated · #22 pattern geometry censused);
perf budget from `docs/perf/baseline.json`; §2 band verbatim; the
time-signature instruments defined at T1 and reported at every later
stage — they are also the measurement the user's 1.1–1.2× tempo anchor
has been waiting for.

## 6. Stop rules

Any stage FAIL → the queue stops, the fork returns to the commander; no
stage may be rescued by tuning a neighbour. T3's hold-dominance ceiling
and any battery fire stop the queue outright. T4's user verdict is final
for this cut. Population law (#26.5): any upstream substrate change
landing live (C4, C6, Stage III) invalidates T1's table — re-census
before T2/T3 results are reused.

## 7. What C5 unlocks on PASS

The first live football where a carrier can WAIT: shield the ball, draw
the press, release into an option that matured while he held — the
hold-draw-release the user named at E4 round 1. One-touch vs control as a
real choice with its already-real prices. The tempo instruments finally
measuring the 1.1–1.2× intuition. And the substrate every later seat
builds on: C7's readable wind-up, A4's tempo doctrine, the gaze
consumer's look-before-release. Registered non-claim, one more time:
overlap stays where honest measurement puts it.
