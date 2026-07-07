# Publishing to itch.io

**Published: <https://quarkgluonmixture.itch.io/evofootball-arena>**
(first upload 2026-07-07, v0.20.0 — for updates see §4).

The build is fully static with relative asset paths (`base: './'`), so it runs
inside itch.io's HTML5 player as-is. Saves live in the browser's localStorage
(per-domain), and the Export/Import buttons let players move leagues between
machines as `.json` files.

## 1. Build the package

```bash
npm run package:itch
```

This runs the production build and zips `dist/` into
`release/evofootball-arena-<version>-itch.zip` with `index.html` at the
archive root — exactly the layout itch expects.

## 2. Create the project on itch.io

Dashboard → *Create new project*, then:

| Setting | Value |
|---|---|
| Kind of project | **HTML** |
| Uploads | the zip from step 1 — check **"This file will be played in the browser"** |
| Embed options | **Embed in page**, viewport **1560 × 940** (or "Click to launch in fullscreen") |
| Mobile friendly | off (the layout is desktop-first) |
| Fullscreen button | **on** |
| SharedArrayBuffer support | not needed (no cross-origin isolation requirements) |

The Web Worker fast-sim, PWA manifest and localStorage saves all work inside
the itch iframe; nothing phones home (no network calls at runtime).

## 3. Suggested page copy

> An autonomous football ecosystem: AI-controlled 5v5 teams play seasons,
> cups and playoffs while their tactical DNA evolves across generations.
> You watch, inspect every decision's reasoning, and follow dynasties rise
> and fall. Deterministic — same seed, same season, every time.

Tags: `simulation`, `football`, `ai`, `evolution`, `idle`, `management`.

## 4. Updating a release

Bump `version` in `package.json`, re-run `npm run package:itch`, and upload
the new zip (itch keeps the old file until you delete it; mark the new one as
the playable upload). Old players' saves live in their browsers, and the
save-version migration chain (v1+) keeps them loadable.
