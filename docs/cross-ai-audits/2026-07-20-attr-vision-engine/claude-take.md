# Claude's independent take (written BEFORE reading Codex) — 2026-07-20

Grounded in this session's code work + A/B measurements. My genuine view, to be cross-checked.

## 1. Attribute audit — what bites, what doesn't
- **Live & distinct:** `pace` (±12% speed), `passing` (accuracy/power — read all over the pass code),
  `dribbling` (carry/1v1/first touch), `finishing` (conversion), `defending` (tackle/marking). These
  genuinely differentiate.
- **`reflexes`** — GK-only; now correctly budget-scoped (position-aware budget landed this session:
  outfielders no longer pay for it, and the keeper no longer pays for finishing/defending).
- **`stamina`** — medium; fatigue drain, diffuse but real.
- **`strength`** — ONE-TRICK: essentially just `aerialSense` (0.30 weight) + a little shielding/50-50.
  Near-decorative on the ground. Under-delivers for a whole budget slot.
- **`positioning`** — NEAR-INERT: only a first-touch reception sub-term (`touchFailChance`). Its own
  docstring promises off-ball IQ (run timing, space-finding, defensive reads) that never shipped.
  This is the deadest EXISTING outfield attr — and ironically the one the off-ball "eyes" need most.
- **MISSING:** a `vision`/game-reading attr (only the binary `playmaker` trait exists).
- **Attribute-BLIND mechanics** (flat constants where a gene should bite): `TURN_RATE` 6.5 (agility —
  everyone turns identically; matters for cut-inside/1v1), `SHOT_SPEED` 27 (shot power flat), and
  perception is PERFECT full-field for everyone (no eye-quality gradient).

## 2. Modelling vision WITHOUT distorting balance — my hard-won finding
This session I added `vision` and wired it as the passer's lane-read (generalizing the playmaker
×1.15). It **inflated goals +17–23% and collapsed the aerial route** — two tunings, structural, so
I reverted. Diagnosis: **passing→goals is CONVEX** — a great pass creates a high-value chance; a bad
pass only loses possession. So sharpening the best passers' incision raises aggregate chance quality
even with a mean-preserving spread → more goals. **General principle: any attribute that ONE-SIDEDLY
improves the attacking phase tends to inflate scoring.** Balance-safe options:
  - (a) **Symmetric**: vision also sharpens the DEFENDER's read (interception reach / anticipation /
    marking) so attacking incision is met by defensive reading → net goal effect ≈ 0.
  - (b) **Execution-cleanliness not incision**: apply vision to reducing ERRORS (first touch under
    pressure, misread turnovers) rather than to sharpening the killer pass.
  - (c) apply it where the outcome ISN'T convex-in-goals: off-ball positioning quality, decision
    latency, defensive reads.
  My lean: (a)+(c). Tune so calibrate goals stay ~2.0; the aerial route must not collapse.

## 3. Highest-leverage outfield-base changes (my ranking)
1. **Make `positioning` LIVE off-ball FIRST** (not vision). It already exists + is budget-costed +
   near-dead. Wire it into run/movement/support scoring AND defensive shape/cover reads. It's
   SYMMETRIC (helps attacking movement AND defensive shape) → far less likely to one-sidedly inflate
   goals than a passing-vision attr, AND it's the attr the "eyes"/off-ball game needs most. Best
   bang-per-risk. §2-gate it.
2. **Vision as a SYMMETRIC read attr**, AFTER positioning is live (positioning = where to be; vision
   = what you can see — the off-ball eye needs both).
3. **De-dead-weight `strength`**: ground-duel bite (shielding/hold-up success, 50-50 shove,
   screening) so it's not aerial-only. Roughly symmetric (possession retention both ways).
4. **Gene-bind the attr-blind constants**: `TURN_RATE` from agility/pace (cut-inside/1v1),
   `SHOT_SPEED` from finishing/strength (shot power). Makes existing attrs bite more; center to
   stay balanced.
5. Prefer making EXISTING attrs bite over ADDING attrs — the budget is shared, every new attr
   dilutes the others.

## 4. On the perception→value→action / "grow eyes" direction
- Right in spirit — the utility scorers on perception queries already ARE a perception→value→action
  core. But "eyes" changes (box-arrival, cut-inside) kept REVERTING because they were bolted onto two
  foundational defects: (A) pitch too sparse (fixed this session by the density 相变, pitch 0.70) and
  (B) **formations are a hand-authored rigid table** — no emergent shape, no opponent-response, no
  drop-to-receive. Defect B is unfixed.
- So the biggest "eyes" unlock is making POSITIONING EMERGENT — a gene-driven station value field
  = f(ball, opponents, team-mates, space-value) — which is exactly why wiring `positioning` live +
  a positioning value field beats a passing-vision read as the next step.
- Caution on "imperfect perception": making perception noisy/range-limited is tempting for realism
  but risks the same convex-goal-inflation I hit. Apply imperfection to DEFENSIVE reads and off-ball
  movement, not the final killer pass.

## My recommendation (independent)
Next step = **make `positioning` live off-ball** (symmetric, existing attr, deadest one, lowest
balance risk, serves the eyes), THEN a **symmetric** vision attr, THEN strength/TURN_RATE/SHOT_SPEED.
Vision-on-the-final-pass alone is a balance trap.
