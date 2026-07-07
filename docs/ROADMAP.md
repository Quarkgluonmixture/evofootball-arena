# Roadmap — Phase 30 handover plan + Phases 31–35 directions

**Audience: the next coding agent (and the user).** Phase 30 is green-lit
and specified below — follow the steps in order, they encode the gotchas.
Everything after Phase 30 is a direction, not a commitment: re-scope each
phase against the user's play reports. When play-feel and the calibrate
table disagree, **the user's play report wins**.

Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–11):
every step ends with typecheck + full vitest + both Playwright suites green;
push via `gh auth switch --user Quarkgluonmixture`, then switch back; verify
the Pages bundle after CI; itch.io needs a manual `npm run package:itch`;
re-baseline the determinism fingerprint after mechanics changes; small
balance levers (±0.15 goals) drown in calibrate noise at n=142 — don't
micro-tune them; Playwright selectors are English (suites pin `lang=en`);
the user plays 3D on a PHONE (≤390–640px) — check every UI change there.

---

## ⭐ Phase 30 — 6v6 + the formation system (user green-lit 2026-07-07)

**The user's diagnosis (verbatim in spirit):** most possessions die in
midfield scrambles or backfield steals, keeper distributions gift
breakaways, no tiki-taka and no wing play, and everything still clumps.
The root: 4 outfielders on a 90×58 pitch with NO build-up structure.

### Scope

- **6th player = a SECOND WINGER** (两翼齐飞 — width was the most-missed
  behavior). Slot order `[GK, DF, MF, WGL, WGR, ST]`.
- **Formation system**: every team owns a FIXED attacking formation AND
  defending formation (identity, shown on the team card, inherited through
  rebirth) picked from a small library of per-slot spot tables (e.g.
  attack `wide-212` vs `narrow-122`; defend `low-32` vs `press-23`).
  `formationSpot` reads the team's tables instead of the one global
  `BASE_SPOTS`. Per-team defensive SCHEME: **man-marking vs zonal** (zonal
  = hold sliding spots, man = current `assignMarks` behavior). Derive
  scheme + formation picks deterministically from the genome at franchise
  creation (no genome/save migration for this part), store on `TeamInfo`,
  inherit on rebirth.
- **The keeper WAITS for shape** (kills the distribution gifts): a goal
  kick / hold release does not happen until teammates settle near their
  attacking-formation spots (determinism-safe timeout ~4s); receivers are
  SET before the ball comes; keeper-throw target gates get stricter.
  Expected: build-up exists, midfield scrambles drop, no more
  "门将开球失误送单刀".

### Implementation order (the handover steps)

0. **Wildcard removal** — DONE (`phase-29.2`, commit `5c46abf`). Check
   `git log` before redoing anything. `PolicyParams` / `DEFAULT_POLICY` /
   `TeamInfo.policy+rolePolicies` plumbing was deliberately KEPT (it's the
   brain's tuning surface; bit-equivalence tests ride on it).
1. **6v6 mechanical pass** (no behavior changes yet): add the 6th slot as
   a second WG; introduce a `TEAM_SIZE` constant and a slot-role list;
   grep-sweep EVERY 5-player assumption:
   - `% 5` (decision-tick stagger), `players[4]` / `for i 4..1` (kickoff
     striker pick), `* 5` / gid math (**gid = side·TEAM_SIZE + index**;
     `playerStats` and `allPlayers` are gid-indexed),
   - `slice(0, 5)`, `playerNames`/`squad`/`ages` array lengths,
     `names.ts` (6 surnames), role-biased newgen for the 2nd WG,
   - save **v8** (chain-migrate: backfill one generated WG newgen per
     team — old saves must keep playing),
   - team cards on PHONE widths (6 squad rows), 2D/3D labels.
   Then re-baseline the determinism fingerprint and fix the
   gid/position-hardcoded tests (aerial duel harness, onball scenarios,
   match bounds). **Gate green before step 2.**
2. **Formations**: the library, per-team picks + scheme (genome-derived,
   TeamInfo-stored, rebirth-inherited), `formationSpot` reads team tables,
   `assignMarks` gets the zonal branch (zonal = keep sliding spots, no man
   assignments outside the box), team card shows formations + scheme.
3. **Keeper waits for shape**: goal-kick ready gate in `stepRestart` + gk
   hold-release gate on "≥3 outfielders within ~6m of their attacking
   spots", timeout-capped (~4s, pure sim-state — invariant 3, watched ≡
   skipped; NO wall clock).
4. **Retune**: calibrate targets ~2.6–3.0 goals; **tackles+interceptions
   should FALL from ~66/match — that's the crowding number**; offsides ~2;
   README/ARCH stamps; tag `phase-30`; push; verify Pages; remind itch.

---

## Phase 31 — formations enter EVOLUTION + set-piece routines

Once Phase 30's fixed formations exist, let them evolve: formation/scheme
become inheritable-mutable identity — meta drift visible in the Evolution
tab ("the league discovered the low block"). Add corner ROUTINES
(near-post / far-post / short-corner picks, scored like everything else)
so set pieces stop being one hardcoded cross.

## Phase 32 — free kicks become REAL

Offside + professional fouls (29.x) made free kicks common again, but
they're generic restarts: add direct shots from range (a 2–3 man wall +
keeper positioning — the danger-band professional foul then has real
cost), a quick-vs-slow restart choice, and a designated set-piece taker
(finishing/technique). High user visibility.

## Phase 33 — the watching experience

Auto-highlights: HT/FT replay reel of goals/big saves (`ReplayBuffer`
already archives watched matches); man-of-the-match + per-player match
ratings feeding the awards; pass-combo detection (tiki-taka feed moments
once Phase 30 makes them real); a phone UX pass on the 6-man team cards.

## Phase 34 — players become PEOPLE

Traits layered on attributes (clinical / playmaker / enforcer — small,
READABLE sim effects, shown on the player card), captains, simple form
arcs feeding the season stories; optionally a transfer window between
seasons if the ecosystem needs fresh narratives.

## Phase 35 — league ecology

Rivalries/derbies (seeded from repeat finals + relegation fights) with
visible intensity effects, prestige shaping rebirth parent choice,
attendance/stadium flavor.

## Backlog (any time)

- Optional GLTF player models with the procedural mesh as fallback.
- Headless perf: gate the decision-tick `why`-string building behind a
  flag (largest remaining profile cost; results unaffected — mind
  watched ≡ skipped when wiring).

**Ordering rationale:** 31–32 deepen what 30 builds (tactics), 33 cashes
it in visually (the user watches on a phone), 34–35 only pay off once the
football itself looks right. **If Phase 30 lands badly on play-feel, STOP
and rebalance before any of these.**
