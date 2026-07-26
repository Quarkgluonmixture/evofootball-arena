# Synthesis — vision / attribute-base design (2026-07-20)

Sources: `claude-take.md` (mine, written first), `codex-report-a.md` (attribute model, + ran empirical
HI/LO probes), `codex-report-b.md` (perception architecture). Cross-checked; novel claims verified.

## AGREED — all three reached independently (HIGH confidence)
1. **Do NOT add a 10th `vision` attribute now.** Instead repurpose the existing, near-dead
   `positioning` gene into a general **AWARENESS / game-reading** attribute (keep the serialized key;
   maybe relabel). Preserves budget dimensionality; positioning already owns the semantic territory
   (its docstring promises run-timing/space-finding/defensive-reads) but only affects first-touch today.
2. **Model perception FIDELITY, not optimism/behaviour.** Awareness changes the player's ESTIMATE of
   the state (perceived positions / perceived race-margin), feeding the SAME perception queries — it
   must NOT be a lane-openness multiplier. **Retire the `playmaker` ×1.15** (that's optimism, not
   reading — a perceptive player recognises a safe lane, doesn't make a blocked one safer).
3. **SYMMETRIC — ship attacking + defensive reads TOGETHER.** Awareness improves the passer's read
   AND the defender's interception/marking read. This is the balance keeper: it's why my vision
   attempt inflated goals (one-sided attacking buff). Awareness affects READING/REACTION only — never
   speed, pass/shot accuracy, tackle success, or physical reach (no double-pay).
4. **My convex diagnosis confirmed + sharpened (B):** the passer takes the MAX over ~5 candidate
   reads, so even a mean-centred per-candidate change is NOT output-neutral after the maximisation —
   better identification of the top attacking option has convex payoff. Determinism-safe throughout
   (bounded velocity extrapolation and/or seeded persistent epoch error; never `Math.random`).
5. **Route gate, not just goals~2:** headers/combos/carry/through/build-up must all be checked (the
   reverted vision change collapsed the aerial route).

## VERIFIED novel findings (Codex earned its keep — all confirmed vs code)
- **`engine` trait bug:** gated on `pace` (traits.ts:68) but cuts stamina drain (Player.ts:176) →
  pace is a fast-AND-tireless super-stat. Empirically (A's probes) pace + defending already dominate.
- **GK `positioning` dead:** first-touch returns early for GK (mechanics.ts:31) → keeper pays budget
  for nothing. Fix = exclude from GK budget, OR repurpose→awareness (then GK awareness matters).
- **`mutateSquad` unused in production:** variation only via careers/newgens; no unbiased
  post-crossover mutation. Dead function + a real evolution-variation gap.
- **A's empirical audit** (ran the sim): pace/defending huge, strength barely separates, positioning
  moves spills 6.01→4.87 but no scoring gradient. Confirms strength weak + positioning first-touch-only.
- **Attribute-blind decision points:** perception exact for all; TURN_RATE/decision-interval flat;
  pass-contact/marker/chaser/runner assignment attribute-blind; body-overlap separation strength-blind.
- **B's architecture framing:** the missing layer is BELIEF/FORECAST (world→belief→forecast→value→
  action); attacker (`laneOpenness` at receiver's CURRENT pos) and defender (`canInterceptPass`,
  binary) reason about the SAME pass with UNRELATED models — unify into ONE shared spatiotemporal
  race forecast; awareness perturbs its ambiguous reads.
- **A's broader substrate program:** split pace/agility, split control/dribbling, make strength a
  physical mass/duel effect + retire the hand-authored AERIAL_ROLE bonus, weak-foot later.

## GENUINE forks (the user decides)
### Fork 1 — SCOPE (the main one)
- **(a) Narrow:** do awareness-via-positioning FIRST as one §2-gated lever; opportunistically fix the
  small verified bugs (engine-trait, GK-positioning-budget, mutateSquad). Defer the substrate splits.
- **(b) Broad program:** commit to A's sequence — fix engine/liveness/budget → instrument attribute
  sensitivity → awareness (symmetric) → split pace/agility → split control/dribbling → strength
  physical. Directly serves "every outfield attr must bite," but many more genes/rebaselines.
- *My rec:* (a) narrow — awareness first + the cheap bug fixes; treat the splits as a ranked backlog.

### Fork 2 — fidelity MECHANISM (secondary; the two Codex runs differ)
- **(A) Anticipation lookahead** (deterministic, no RNG): `perceivedPos = pos + vel × 0.30·(aware−0.5)·T`.
  High awareness sees the play develop earlier; simplest; zero determinism risk.
- **(B) Ambiguity error** (seeded, persistent): `perceivedMargin = trueMargin + ambiguity·σmax·(1−aware)²·ε`
  — errors ONLY on genuinely tight reads; obvious situations stay obvious to all.
- *My rec:* compose eventually; START with A (simplest, deterministic) applied symmetrically, add B's
  ambiguity model if differentiation is too weak. Both plug awareness into the same shared forecast.

### Fork 3 — first PLUG-IN point (implementation sequencing)
- B-rank1: the shared PASS-RACE model (passer + interceptor use one forecast) first — narrow,
  symmetric by construction, fixes the two-models contradiction; off-ball support scorer after.
- *My rec:* B-rank1. It's the cleanest first §2 A/B and inherently balanced.
