# HANDOFF — B1 perception sandbox (default-off render overlay)

> Programme step B1 ([`PROGRAMME.md`](PROGRAMME.md)). Not a frozen experiment —
> a read-only observability feature. The acceptance authority is the USER's
> eyes, not gates. **Delete this file in the final commit.**

## 1. Goal

Let the user SELECT one player during a normal watched match and see what that
player's world model actually contains, live:

1. **View cone + range** — the honest body-facing visual cone and range from
   `perceiveSnapshot` semantics (awareness-dependent width/range), drawn from
   the player.
2. **Memory ghosts** — for every entity in the player's `PerceptionSnapshot`:
   a ghost marker at the *believed* position, visually aged (fresh = solid,
   stale = faded), with a thin line to the *true* position so belief error is
   visible. Entities absent from memory simply have no ghost — their absence
   IS the point.
3. **Ball fact** — believed ball position/ghost, same aging treatment; exact
   when carried (proprioception).
4. **Staleness readout** — small per-ghost age (ticks or seconds), plus the
   observer's scan cadence (a subtle pulse on scheduled scans is ideal).
5. **What-if gaze layer (sub-toggle, default OFF, clearly labelled
   "hypothetical")** — overlay the cone as it WOULD sit if the player ran
   `chooseAttentionGaze` at the current ball carrier. This is not live
   behaviour; the label must say so. No other policy may be rendered.

## 2. Hard boundaries

* **Default OFF.** A explicit UI toggle (fits the existing debug/overlay
  affordances in the render layer; executor's choice of placement).
* **Read-only.** The overlay owns its own `PerceptionMemory` per selected
  player (created on enable, discarded on disable/selection change), feeds it
  once per sim tick from `capturePerceptionTruth`, and renders the returned
  snapshot. It must never write to Match, players, ball, RNG, brains or any
  live decision path — and no AI may read the overlay's snapshots.
* **Awareness is synthetic** (no live attr exists): fixed `0.8`, optionally a
  small debug slider; label it synthetic.
* **Zero cost when OFF**: the entire path sits behind the toggle. When ON,
  cost is debug-tier and unmeasured, but do not perceive for players that are
  not selected.
* **No production gameplay file changes.** Expected touch set: render layer
  (`src/render/**` and/or `src/render3d/**`), UI toggle wiring, plus imports
  of the existing dormant `perceptionSnapshot.ts`/`attentionPolicy.ts`. If a
  sim/ai file seems to need editing, STOP and report.

## 3. Validation

```bash
npx tsc --noEmit && npm run build     # clean
npx vitest run                        # all green (no new tests required)
npm run fingerprint                   # MUST equal 57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

Fingerprint is the proof the overlay is render-only. Any drift = you touched
the sim — revert and restart.

Manual check before handing to the user: run `npm run dev`, toggle the
overlay, select several players (incl. the keeper and the carrier), confirm
ghosts age and vanish, cone follows bodyDir, what-if layer clearly labelled,
toggle-off leaves no residue.

## 4. Acceptance and iteration

The user play-tests and judges (fluency > completeness). Expected follow-ups
are B2 render tweaks (colors, fade rates, label density) — apply small
requests directly; anything that grows scope (multi-player simultaneous view,
live-AI wiring, new policies) goes back to the user as a question.

## 5. Commit

Stage explicit paths only. Message: `Add default-off perception sandbox
overlay`. Update PROGRAMME.md B1 status + a one-line ROADMAP note in the same
commit. Delete this file. Push (auth: `gh auth switch` to Quarkgluonmixture
if rejected).
