# A4 PLAY-TEST — 约定世界,交给眼睛

> **Authority**: commander ruling #155 (the user rules #154.4 option A).
> **What it is**: the certified PRIOR world of A4 slice 1 — affirmed at exam
> grain in #154 — wired into the PLAYABLE game behind an explicit opt-in, so
> the verdict that no instrument can give (does it look like football?) can be
> given by the only arbiter VISION §2 recognises: the user's eyes.
> **Nothing ships.** Default OFF everywhere; production fingerprint
> `57b0bdab…c673` unchanged; a player who does not opt in downloads nothing
> extra and plays the identical game.

## 1. What the armed world is

Both teams get, at once:

* **The enriched substrate** the census was taken on — the perceived-defence /
  perceived-choice / value-axis trio plus the C-family seams (`c5Hold`,
  `c6Carry`, `c7Windup`; `c5TouchFork` off). This is `CENSUS_FLAGS` of
  `scripts/probes/a4-p3prime-replication.ts`, verbatim.
* **The eye** — the both-sides role-conditioned chooser on the P3p-1 merged
  table, with the in-support law and the two S bits armed (the `R3p` arm).
* **The agreement** — `eye.v4.homePrior` on, `homePriorObedience = 0.5` on both
  teams: `homePriorStrength(0.5) = 0.25×VAL_SCALE = 0.040874`, the #148
  certified **whisper** dose. 野球开场三十秒 的那种约定,不是战术板。

That combination is the probe's `PRIOR` arm. Measured there (#154, virgin
seeds): deep entries **−0.74/set**, box entries **−0.380/set** against `R3p`,
with every football hard gate holding. What it costs, honestly: restarts up
(~+161/set at #151 grain) and the eye's role diversity homogenises about
halfway toward the incumbent.

## 2. How to launch

**Desktop**

1. Open the game.
2. `⚙ Settings` → **🧬 Experimental** → tick
   **“A4 world: the pre-match agreement (play-test)”**.
3. The census tables load (~440 kB, once), the current match **restarts** in
   the armed world, and the chip **🧪 A4 约定世界** appears in the top-left
   corner. That chip is the ground truth for which world is on screen.
4. Untick to go back. The shipped world returns at once, chip disappears.

**Phone** (the same room — the ⚙ screen is full-viewport below 640px)

* Same three taps: `⚙` → scroll to 🧬 Experimental → tick the A4 box. The chip
  sits inside the safe-area inset, above the match strip and every overlay, so
  it stays visible in the stacked phone layout and in the installed PWA.
* **Or use the link**: append `?a4world=1` to the URL, e.g.
  `https://…/evofootball-arena/?a4world=1`. It arms on load and **sticks**
  (the choice is remembered), so the link only has to be opened once.
  `?a4world=0` disarms and clears it; the ⚙ checkbox does the same.

**Notes**

* The choice is sticky across reloads and across “new league” / “reset”.
* Arming or disarming restarts the CURRENT fixture (same seed, rebuilt in the
  chosen world) — you never have to wait a match to see it.
* If the tables fail to load (offline first run), the entry refuses to arm,
  says so in the feed, and leaves you in the shipped world.

## 3. What to watch for (the acceptance list)

Rule per item: **keep / change / revert**, in plain football language. Change
verdicts want the "what would be better" clause; instruments can follow.

| # | Lever | The question |
|---|---|---|
| 1 | **A4 约定世界** | 紧凑得像**球队**还是像**一堆人**? Does the defensive block look like a shape holding its ground, or like everyone sucked toward the ball? Watch a defensive phase from the halfway line and a settled opponent build-up. Second look: do the restarts (throw-ins, goal kicks) feel too frequent / too fussy? |
| 2 | **D1 shell** | Does the world outside the pitch read as a stadium — does the shell frame the game or distract from it? |
| 3 | **D2 trails** | The motion trails: do they help you read who is moving where, or do they smear the picture? |
| 4 | **Phone layering** | On the phone: does anything cover anything it shouldn't — match strip vs league/evolution/settings screens, the banners, the badge? |
| 5 | **F7b fireworks** | The goal fireworks: right amount, right moment, or does it interrupt the football? |
| 6 | **F7c goal camera** | The goal camera move: does it show you the goal, or does it lose the ball? |

## 4. The verdict format

For each of the six, one line:

```
<lever> — keep | change | revert — <one sentence in plain football language>
```

Example: `A4 约定世界 — change — 后场紧是对的,但中前场跟着球挤成一坨,像野球。`

Verdicts go back to the commander, who converts them into rulings; **keep** on
item 1 is what would move the home-prior mechanism from BANKED DORMANT toward a
ship candidate — this entry does not ship it, and playing with it armed changes
nothing for anyone else.

## 5. Where the code is

| Piece | File |
|---|---|
| The armed world (flags, eye, prior, storage, table loader) | `src/game/a4World.ts` |
| The on-screen chip | `src/ui/A4WorldBadge.ts` (+ `.a4-world-badge` in `src/ui/style.css`) |
| The toggle | `src/ui/SettingsScreen.ts` (🧬 Experimental) |
| The wiring (arm / disarm / arm the next match) | `src/game/GameApp.ts` (`setA4World`, `armA4`, `loadNextFixture`) |
| The contract tests | `tests/a4PlaytestEntry.test.ts` |
| The fidelity source | `scripts/probes/a4-p3prime-replication.ts` (the `PRIOR` arm) |

The arming idiom is E4-PREP's (`src/game/edsPreview.ts`, rulings #14.3 / #22.5):
an audited arm, a sticky user choice, pushed onto `League.matchFlags` for
matches started from now on. A4 adds what construction flags cannot express —
the `Match.stationEye` config and the obedience gene on both teams — applied to
the freshly built match, and only when the user armed it.
