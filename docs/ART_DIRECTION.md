# EvoFootball Arena — Art Direction

**Target style: "retro tactical broadcast + low-poly diorama football".**
The game should read like a late-night tactics show covering a tabletop
stadium: information-dense monospace chrome around a warm, readable, procedural
low-poly pitch. Never FIFA realism. Never asset packs. Everything on screen is
either data or drawn by code.

## Color rules

All UI color comes from the tokens in `src/ui/style.css` (`:root`). Never
hard-code a hex in markup when a token exists.

| Token | Role |
|---|---|
| `--bg / --panel / --panel-2 / --panel-3` | dark base ramp (page → card → raised) |
| `--border / --border-soft` | outlines; soft variant for internal grids |
| `--text / --muted` | primary copy / secondary chrome |
| `--accent` (pitch green) | titles, active states, goals, "up" |
| `--gold` | honours: cups, corners, playoff, records |
| `--danger` / `--down` | relegation, destructive actions, REPLAY badge |
| `--info` | saves, neutral highlights |

Team identity is **kit color + line style + position**, never color alone
(the 8-kit palette cannot be pairwise CVD-safe — the xG chart uses solid vs
dashed, the 3D view auto-swaps a clashing kit to its inverse).

Event icon language (used consistently across feed, chips, reports, hall):
⚽ goal · 🎯 shot · 🧤 save · ⚑ corner · 🏆 Premier title · 🥇 Challenger title ·
🏅 Evo Cup · ⚡ giant killing · ✨ double · ⬆️⬇️ promotion/relegation ·
👑 elite · 🧬 mutated · 🔄 reborn.

## UI rules

Four visual registers, in priority order:

1. **Broadcast UI** (score bug, goal banner, replay badge/context): floats on
   the stage, dark glass cards, bold condensed numbers. May animate, briefly.
2. **Normal UI** (panels, league screens): section cards on `--panel`, 11px
   uppercase headers, 13px monospace body. Dense is fine; raw is not.
3. **History UI** (league tabs): same system plus headline cards, zebra-free
   tables with hover rows, dashed `.empty` boxes for pre-era states.
4. **Debug UI** (overlay toggles): visually demoted — dashed border, ⚙ prefix.
   Debug tools are never removed by polish, only demoted (cinematic mode hides
   them temporarily and is always escapable via Esc/✕).

Animations: 150–350 ms, ease-out, one property (opacity/translate/scale).
Nothing loops except the REPLAY pulse and possession ring. If an animation
competes with reading the pitch, cut the animation.

## 3D scene rules

- The pitch is a **diorama**: one textured plane on a pedestal, dark backdrop,
  fog, four floodlights, low terrace silhouettes. Atmosphere must stay darker
  and quieter than the playing surface (vignette enforces focus).
- Players are **jointed box-people**, ~12 parts, shared geometries. Identity
  channels: kit colors (shirt/shorts/socks), role builds (GK broad+gloves,
  winger slim, striker hunched), back numbers (1/4/8/7/9), labels.
- Every mesh is procedural (BoxGeometry/canvas textures). No GLTF, no image
  files. If it can't be drawn in ~30 lines, simplify the idea.
- Grounding matters more than detail: blob shadows + real shadow map, players
  and ball never float.

## Event effect rules

- Effects **confirm** what the sim did; they never invent drama. Every fx is
  driven by a real `RenderState.fx` event and dedupes by event time, so live
  play, fast-forward and replay fire each exactly once.
- Goal = banner + net shake + burst (+confetti on High). Save = keeper burst.
  Shot = xG floater + camera pulse. Corner = ⚑ floater. Interception = kit
  burst.
- FX quality: Low (no particles, no vignette, 1× pixel ratio) / Medium
  (default) / High (confetti extras). Readability features (trail, crowd
  marker, declutter) are NOT quality-gated — they always run.

## What not to do

- No photoreal textures, no PBR material studies, no bloom/post stacks.
- No binary/external assets — canvas + geometry only.
- No color-only team distinction, no red/green-only semantics.
- No permanent removal of debug tooling in the name of polish.
- No render-side writes to sim state, ever (see ARCHITECTURE invariant 1).
- No FX that hides the ball, the carrier, or defensive shape.
