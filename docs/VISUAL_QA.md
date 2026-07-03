# Visual QA — Phase 15 (art direction & presentation)

Manual inspection notes for the Phase 15 polish pass. Screenshots referenced
here are produced by `npm run debug:visual` (`/tmp/evofootball-shots/`) and
`npm run debug:visual3d` (`/tmp/evofootball-shots-3d/`) — both suites must
pass AND a human must look at the images (ARCHITECTURE invariant 10).

## What was inspected

| Area | Screenshot | Verdict |
|---|---|---|
| 3D tactical view + stadium | 3d/1-tactical.png | stripes, corner arcs, penalty D, flags, terraces, floodlights, vignette all read; goal banner card + score bug over live play |
| Goal moment (banner) | 3d/1-tactical.png, 3d/5-replay-goal.png | dark-glass GOAL! card with kit-color edge + score subline; net shake fires |
| Player readability close-up | 3d/3c-cinematic-3d.png | back numbers (1/4/8/7/9) legible, short sleeves + skin forearms, kit separation, blob + map shadows ground the models |
| GK identity | 3d/3b-gk-identity.png, 2-crowded.png | broad build, long sleeves + pale gloves, inverted kit, bigger blob |
| Crowded moments | 3d/2-crowded.png | crowd marker + declutter still work over the new models |
| Cinematic 3D | 3d/3c-cinematic-3d.png | chrome hidden, score bug + banner only, ✕/Esc exits |
| Cinematic 2D | 2d/11-cinematic-2d.png | poster view + 2D score bug; overlays remain user-controlled |
| League pages reskin | 2d/5-league.png … 9-hall-of-fame.png | pill tabs, headline cards, zebra-hover tables, zone edge bars, demoted ⚙ debug section, dashed empty states |
| Replay chrome | 3d/5-replay-goal.png | pulsing REPLAY badge + event context label ("⚽ 34' — …") |
| Presentation controls | 2d/7-season-report.png (left panel) | Cinematic/Screenshot/Share buttons real (feed-confirmed in Playwright); FX Low/Med/High wired to renderer |

## Before / after notes

- **Players**: previously single-color box figures with full-shirt arms; now
  role-built silhouettes with numbers, sleeves, gloves, sock trim. Teams stay
  distinguishable in crowds (kit clash auto-invert unchanged).
- **Pitch**: flat two-tone stripes → groomed dual-direction mowing + speckle
  grain, corner arcs, penalty spots/D, taller flags; goal frame is glossier,
  net denser.
- **Stadium**: floating plane → diorama with terraces, adboards, floodlights,
  vignette. Deliberately darker than the pitch (focus rule).
- **Broadcast**: bare text GOAL banner → structured card; new persistent score
  bug (works in replay too — snapshots carry score/minute); REPLAY badge +
  context label; corner ⚑ floater.
- **UI chrome**: raw stacked controls → section cards with a typography scale;
  debug tools visibly demoted but never removed.

## Known visual limitations (accepted, documented)

- Behind-goal camera can frame transitional dead space for ~1s while swinging
  during goal pauses (pre-existing damping behavior, not a regression).
- xG floaters can briefly overlap each other on rapid shot→rebound sequences.
- Players have no knee/elbow joints (single-piece limbs) — dives and kicks are
  readable but stylized; a two-segment leg is a future upgrade, not a bug.
- Shirt numbers exist on backs only; front numbers would fight the possession
  ring for attention at tactical distance.
- FX "Low" reduces particles/vignette/pixel-ratio but keeps shadows (toggling
  shadow maps at runtime forces a material recompile stutter — skipped to
  protect stability, see phase spec's "skip and document" rule).
- Cinematic camera presets reuse the five existing camera modes rather than
  adding bespoke poster cameras (kept the camera surface small; documented
  mapping: poster=tactical, broadcast close=TV, drama=behind-goal/replay).

## Future art upgrade ideas

- Two-segment legs + foot IK toward the ball on kicks.
- Crowd sprites/flags on the terraces reacting to goals (cheap billboards).
- Team-color corner flags and adboard sponsor text from franchise names.
- Match intro camera flythrough (tactical → broadcast) on kickoff.
- Optional GLTF player models with the procedural mesh as fallback (roadmap).
