# F-DIRECTION — the committed look

> **Position in the doc hierarchy.** [`VISION.md`](VISION.md) is the gold
> standard for what the game IS. This file is the gold standard for what it
> LOOKS like. It was decided by the user at Track F step F0 (2026-07-25) from
> a rendered showcase, not by argument, and it supersedes the atmosphere rules
> in [`ART_DIRECTION.md`](ART_DIRECTION.md) where the two disagree.
> `ART_DIRECTION.md` remains authoritative for UI registers, event-effect
> rules and the icon language.
>
> **The only valid judge of an art change is the user's eyes.** Beauty cannot
> be probe-gated. What CAN be gated is honesty, and those gates are hard:
> zero sim contact, `npm run fingerprint` unchanged every step, phone framing
> checked at ≤390 px, one lever per step.

## The pick

**Toy / board-game world, in daylight, with night switchable.**

The user chose arm (a) of the F0 showcase over (c) coherence-only, and asked
for both lightings live. Arm (b), broadcast realism-lite, was never built: it
needs gLTF rigs and skeletal animation, which the procedural-first rule below
forbids outright, and the user's reference image was stylised anyway.

The world should read as a **tabletop stadium you could pick up** — flat lit
colour, honest human scale, a surface that has been played on. Never FIFA
realism. Never an asset pack. Everything on screen is drawn by code.

## The palette is DATA

Every colour, light, grass parameter and material flag lives in
`src/render3d/stylePresets.ts` as a plain object, consumed by `createScene`,
`createPitch`, `bodyMat` and the renderer. **Do not hard-code a colour in a
render file.** A new look is a new preset, which means it is diffable,
testable and revertible in one line.

Three presets exist and all three stay:

| Preset | Role |
|---|---|
| `toy` | **shipped.** The committed direction, day and night. |
| `coherence` | the same models under one material language, no restyle. Kept as the cheap control arm for future comparisons. |
| `current` | the pre-F0 look, frozen. **Never edit it** — the pick was made against this frame, and a baseline you tune is not a baseline. A test pins it literal for literal. |

`DEFAULT_STYLE` / `DEFAULT_LIGHTING` are what ships. Lighting is a real player
setting (persisted at `evo:lighting`), not a debug flag.

## Material language

- **One language per scene.** Bodies go through `bodyMat()` — toon ramp under
  `toy`, PBR standard otherwise — and that includes the referee, the linesmen
  and the touchline coaches. An arm restyles every human at once or it is not
  an arm.
- **Tone mapping is mandatory.** The game shipped for months on three's
  default `NoToneMapping` with no managed exposure, which is why bright kits
  clipped and shadows crushed. Every preset now names a tone mapping and an
  exposure.
- **Procedural only.** Geometry, canvas textures, gradient ramps. No GLTF, no
  image files, no binary assets. If it can't be drawn in ~30 lines, simplify
  the idea.
- **MeshBasic is for chrome, not for bodies.** Flat unlit material belongs to
  rings, blobs, overlays and billboards; anything that is part of the world
  gets lit.

## Scale is anchored, not eyeballed

Every procedural human is drawn at `HUMAN_MODEL_SCALE`, derived at F1 so the
widest body the game can build keeps its arm-span inside the sim's own
`PLAYER_MIN_DIST` footprint. The ball and every render fake sized against the
bodies — held-ball height, keeper hand reach, the synthesized kick hop — ride
the same constant, so their proportions cannot drift apart.

**Information keeps full size.** Name plates, selection rings and halos are
read, not inhabited: their SIZE never scales. Their ANCHOR does — a plate
pinned in world metres detaches from a shrunken head, so heights ride the
constant while font sizes do not.

**Chunk, not size (F2).** Toy anatomy is thick limbs on a NARROW chest, a big
head bedded into the shoulders with no visible neck, and a short chunky boot.
When limbs thicken, shoulders tuck IN — that is what keeps the arm-span anchor
intact while the silhouette changes, and it is also what a toy figure's arms
actually do. Two rules learned the hard way, both now enforced by tests:
proportions that other code hand-fits to (the back number's depth offset, the
bulk ceiling, the torso box) must be DERIVED from exported constants, not
copied as literals; and `armSpan()` is only an honest gate while the arms beat
the torso at maximum bulk, so that is asserted, not assumed.

## The surface

A pitch is not a green rectangle. Mowing stripes, a fine turf grain, and
**wear** where a real pitch goes bare: both goalmouths, the centre circle, the
two wing channels.

Grain has ONE governing rule and it is about spatial frequency, not contrast:
**grain lives at boot-stud scale, a few centimetres to ~30 cm.** Metre-scale
speckle reads as clouds — mould on the grass — no matter how low you push the
alpha, and it also drowns the wear patches, which are the variation you
actually want to see. Count and radius therefore move in OPPOSITE directions,
and a test pins that ordering.

Paint is chalk, not vector: softened alpha and a wider line under `toy`.

## Reading the ball

The ball is the most important object on screen and F1b made it 36% smaller,
so its cues carry more weight than they used to. Two rules:

- **Height must be readable from a still frame.** The contact shadow shrinks
  and fades with altitude and never disappears — a lofted ball and a grounded
  one must not draw identically.
- **The wake is a ribbon, never a line.** WebGL caps `linewidth` at 1 on every
  desktop platform, so a `THREE.Line` trail is a one-pixel hair that vanishes
  on a phone. Taper it toward the tail so it reads as direction, and fade it
  proportionally with speed so a crawling ball never paints the pitch.

## The bowl

The ground is ENCLOSED — day and night you are inside it, not looking at a
pitch floating in a void (user, 2026-07-25). But every stand height here is
bounded by a camera, never by taste, and the bounds are asymmetric because the
cameras are:

- **Far (−z) side carries the height** — five rows, a roof canopy with a
  fascia, a back wall. Nothing looks from that side, so it is free, and its
  roof line cutting the sky is the single thing that most makes the world feel
  built rather than floating.
- **Goal ends stay ONE low bank.** behindGoal sits 12 m out at only 5 m up and
  its sight line is down to ~3.9 m by x = 40. Phase 28.3 already lost the
  whole goalmouth behind a three-step stand once.
- **Near (+z) side is one bank held well back** — the binding case is the
  follow camera on near-touchline play, where the sight line is only 2.8 m up
  at the usual apron distance.
- **Corners are filled**, and a 45° section reaches w/2·√½ toward the pitch on
  both axes — stand it further out than that or its inner tip lands on the
  playing surface.

None of the above is eyeballed: `terraceSlabs()` is pure data and the render3d
test pushes every camera's sight line into each slab's own frame (oriented, not
axis-aligned — an AABB over-rejects the corners) and asserts it reaches the
pitch. Crowd head height is included. That test found two real blocks the
moment it existed, one of them pre-existing.

## Cameras

The user plays in **broadcast** and **follow-ball**. Those two are what any
art change is judged in, and what the showcase harness renders. The wide
tactical camera is not their view — do not spend art effort on it, and do not
add wide-angle presets (user, 2026-07-25). Phone is the binding constraint:
≤390–640 px, fluency over interruptions.

## Standing lever list (F1+, one per step)

Open, unordered, each measured against this doc by the user's eyes:
~~character proportions~~ **(F2, done 2026-07-25)** · ~~crowd palette~~
**(F3, done 2026-07-25)** · kit readability and silhouette · procedural animation polish
(anticipation, follow-through) · ~~ball trail / height cues~~ **(F4, done
2026-07-25; spin still open)** · goal-moment
FX and camera work · post: bloom, vignette, tilt-shift, AA — all inside the
phone budget · ~~`PlayerShowcase` re-framing~~ **(done with F2)**.

## What not to do

- No photoreal textures, no PBR material studies, no heavy post stacks.
- No binary or external assets — canvas and geometry only.
- No colour-only team distinction, no red/green-only semantics.
- No hard-coded colours in render files; the preset owns them.
- No editing the `current` preset.
- No render-side writes to sim state, ever (ARCHITECTURE invariant 1).
- No FX that hides the ball, the carrier, or defensive shape.
- No art step that moves the fingerprint. If it does, it touched the sim.
