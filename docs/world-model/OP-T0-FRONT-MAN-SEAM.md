# ⭐⭐⭐ OP T0 — 「身前那个人 · 缝」 THE FRONT-MAN SEAM (a NEW flag, `opFrontMan`, dormant)

> **What this stage builds.** ONE dormant flag (`match.opFrontMan`), ONE pure geometry function
> beside the shipped one (`laneOpennessFront` in `src/ai/perception.ts`), and ONE seat — the
> licence's lane, the ONE `laneOpenness` call inside the hoisted `groundCandidate` pricer
> (`src/ai/PlayerBrain.ts`). Nothing ships; no world and no preset names the flag. Authority:
> **COMMANDER RULING #432 item 3** (the dispatch of record), standing on the user's 「甲吧」 ⇒
> 甲 「身前贴着的人要算进去」 (#431 item 3's fork). The law is
> [`OP-FRONT-MAN-CONTRACT.md`](OP-FRONT-MAN-CONTRACT.md) §2 M-OP.1–4 and §3 OP-T0; the form
> template is [`IF-T0-FLIGHT-RUN-SEAM.md`](IF-T0-FLIGHT-RUN-SEAM.md).
>
> **The dispatch head of record is `1b352f7`** (ruling #432's own commit). Every G-OFF digest in
> §PINS was recorded there, on this x64 host, before one byte of this seam existed.

---

## §LAW — the seat, the form, the door, and where every number comes from

```text
THE DOOR                     match.opFrontMan        ← default OFF; ABSENT ≡ FALSE; no world names it
THE SEAT (M-OP.1)            the ONE laneOpenness(p.pos, aim, opp.players) call inside groundCandidate
                             — the licence: bestPass ← groundCandidate ← lane
  door shut   ⇒ the shipped laneOpenness, the SAME function object (HEAD's statements, byte for byte)
  door armed  ⇒ laneOpennessFront, the SAME arguments
  UNCHANGED   the playmaker's ×1.15, the min(1, …), the forward gate (gain > 0.15 && lane < 0.4)
              and the score — all of them read the one `lane`, so all of them see the man

THE FORM (M-OP.2)            laneOpennessFront(from, to, opponents) — laneOpenness line for line
                             EXCEPT the clear-the-kicker guard:
  for each opponent o, not sent off:
     cp    = closestPointOnSegment(from, to, o.pos)
     along = dist(cp, from)
     along === 0      ⇒ SKIP     ← his closest point IS the kicker (the clamp to t = 0): level with
                                   or behind the ball's start; the degenerate segment (clone(from))
                                   keeps the shipped behaviour
     0 < along < 1.5  ⇒ READ     clamp01(d / CONTROL_RADIUS)   ← strictly AHEAD, inside the shipped
                                                                 guard's radius
     along ≥ 1.5      ⇒ READ     clamp01(d / 4)                ← unchanged
     (d = dist(cp, o.pos))
  return the worst

NO NEW NUMBER   1.5 (the shipped guard) · CONTROL_RADIUS (the engine's, src/sim/constants.ts)
                · 4 (the shipped normaliser) · 0 (the clamp's own output, not a threshold)
```

1. **Monotone by construction.** Every man the shipped form reads (along ≥ 1.5) is read
   identically; the front form additionally reads men in (0, 1.5). So `laneOpennessFront ≤
   laneOpenness` on every lane, and the two are EQUAL whenever no live man's closest point lies
   in (from, 1.5 m) — pinned on a 4,000-lane random sweep (F0) and on every armed licence
   evaluation of the scratch walks (F3).
2. **The 1.5 m edge is the shipped guard's own.** The shipped guard skipped `along < 1.5`; at
   exactly 1.5 m both forms read `d / 4`. Contract §4 names the step at 1.5 m (CONTROL_RADIUS
   inside, 4 beyond) as a NAMED DOOR, not taken here.
3. **No other lane changes.** `ownLaneOpenness` (LN), `airLaneOpenness`, the through-ball / carry /
   support lanes (the three other `laneOpenness(` calls in `PlayerBrain.ts`), the DV / GC
   exposure terms and the snapshot target chooser (`choosePerceivedPassTarget`, M-OP.4 — a HELD
   door) are untouched; the seam map pins each at ZERO occurrences of both names.

---

## §SEAM — VERBATIM (all of it dormant)

`git diff --stat 1b352f7 -- src` = **4 files, 61 insertions, 0 deletions**. Every hunk is an
`a` (pure insertion): `PlayerBrain.ts` `19a20` · `633a635,640`; `perception.ts` `5a6` ·
`155a157,187`; `League.ts` `301a302`; `Match.ts` `1125a1126,1137` · `2030a2043,2047` ·
`2735a2753,2756`. Not one shipped line is deleted, reordered, reworded or re-indented.

### `src/ai/perception.ts`

```ts
import { CONTROL_RADIUS } from '../sim/constants';
```

…and immediately after the shipped `laneOpenness` (JSDoc omitted here; it is in the file):

```ts
export function laneOpennessFront(from: V2, to: V2, opponents: Player[]): number {
  let worst = 1;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const cp = closestPointOnSegment(from, to, o.pos);
    // Ignore a defender only when the kick truly passes him by — his closest point IS the kicker.
    const along = dist(cp, from);
    if (along === 0) continue;
    const d = dist(cp, o.pos);
    worst = Math.min(worst, clamp01(d / (along < 1.5 ? CONTROL_RADIUS : 4)));
  }
  return worst;
}
```

### `src/ai/PlayerBrain.ts` — the import, and THE SEAT (the closure's FIRST statement)

```ts
import { laneOpenness as laneOpennessShipped, laneOpennessFront } from './perception';
```

```ts
    const groundCandidate = (mate: Player, aim: Readonly<V2>, d: number): {
      s: number; lane: number; open: number; gain: number; mul: number;
    } => {
      // OP T0 §SEAM — THE LICENCE'S LANE (M-OP.1, ruling #432): … (5 comment lines)
      const laneOpenness = match.opFrontMan ? laneOpennessFront : laneOpennessShipped;
      // The playmaker (Phase 39) reads passing lanes 15% more open than
      // they look — the trait is vision, priced into lane weight only.
      const lane = Math.min(                                                   ← SHIPPED,
        1,                                                                     ← byte-
        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
      );                                                                       ← unchanged
```

### `src/sim/Match.ts` · `src/sim/League.ts` — the door (the `bkGroundCorridor` idiom)

```ts
  opFrontMan?: boolean;                              // MatchConfig, after bkGroundCorridor?
  readonly opFrontMan: boolean;                      // Match, after readonly bkGroundCorridor
    this.opFrontMan = cfg.opFrontMan ?? false;       // constructor, after the bkGroundCorridor init
    | 'opFrontMan'                                   // League matchFlags key union, after 'ifFlightRun'
```

### Untouched (restated as a prohibition)

⛔ `src/game/a4World.ts` (names neither `opFrontMan` nor `laneOpennessFront`) · ⛔
`src/ai/ownLaneSeat.ts` · ⛔ `src/ai/perceivedPassChoice.ts` · ⛔ `src/ai/deliveryValueSeat.ts` ·
⛔ `src/ai/perceptionSnapshot.ts` · ⛔ `src/ai/passCorridorInterception.ts` · ⛔ every
`scripts/probes/` file. No world, no preset, no env door, no bundle default arms the flag;
`League.toJSON` omits it.

---

## §PINS — `tests/opFrontMan.test.ts`, **34** `it()`s, ALL GREEN on x64

| # | pin | what it catches |
| --- | --- | --- |
| **F0** | ⭐ **THE FIXTURES, the three geometric cases FIRST**: (1) a man BEHIND the kicker ⇒ skipped, `= laneOpenness`; (2) a man LEVEL with the kicker ⇒ skipped (his closest point measured `=== 0`); (3) a man 1 m AHEAD on the line ⇒ **0** (`laneOpenness` gives 1); (4) the 1.5 m EDGE — at 1.5 m both read `d / 4` (0.25), at 1.49 m the front form reads `1 / CONTROL_RADIUS` and the shipped 1; beyond, unchanged; (5) 1 m ahead and `CONTROL_RADIUS` aside ⇒ **1** (half of it ⇒ 0.5); sent-off skipped, the degenerate segment = shipped; ⭐ the SWEEP — 4,000 random lanes from `Rng(900,009,850)`: `front ≤ shipped` always, `front ≡ shipped` on every lane with no live man's closest point in (from, 1.5 m), and different on some lanes with one (both partitions > 500) | M1 · M2; a form that departs from `laneOpenness` beyond the guard |
| **F1** | **G-OFF, ARCH-KEYED** — the door absent ⇒ whole-match signatures (the `ifFlightRun` / `dsCoopHatsOff` `signatureOf`, rng draw included) on the twelve scratch seeds **900,009,800–811** digest to the x64 literals RECORDED at `1b352f7`: bare `8ed1d970…7481` · w13 `fd6d7443…80c3` · w17 `3f85b15e…c1ed` · w18 `9fcfa316…ac00`; **arm64 ABSENT** (each pin skips on arm64, by title); ABSENT ≡ EXPLICITLY FALSE (bare AND world 18, three seeds); the fingerprint (x64 `59f42aa7…a072d`, in process) | any leak of the seam into a shipped world; M3; M4 |
| **F2** | **DORMANT, COUNTED** — over whole matches with the door absent (bare and world 18, three seeds each) `laneOpennessFront` is called **0** times; armed it is called | the door read inverted (M3); a second caller |
| **F3** | **ARMED LIVENESS — the in-process HEAD-vs-seam A/B.** Every armed licence evaluation is priced by BOTH forms on the SAME arguments (the export is wrapped by `vi.mock`, value untouched): on world 18 + the door, seeds 900,009,830–832, **15,412** evaluations, **7,348** with a man strictly ahead within 1.5 m, **2,480 differ, 0 of them without such a man**; on the bare world + the door, **3,115 / 1,349 / 339 / 0**. And the armed world MOVES (world 18 signature ≠ shut on 900,009,860–861) | a seat that does nothing; a form that moves lanes it must not |
| **F4** | **THE SEAT** — the fork is the closure's FIRST executable statement; the shipped four-line `const lane = Math.min(…)` is contained byte-for-byte; the closure's executable text has exactly ONE `laneOpenness(` call and ONE `opFrontMan`; outside the closure `PlayerBrain.ts` names neither `laneOpennessFront` nor `opFrontMan` nor a `const laneOpenness =` (the seam's import line aside); the three other shipped callers byte-present; the file's `laneOpenness(` count still **4** (`bkCorridorPrice.test.ts`'s frozen pin); `ownLaneSeat` · `perceivedPassChoice` · `deliveryValueSeat` · `perceptionSnapshot` · `passCorridorInterception` at ZERO | a widened seat (M4); a re-written shipped line |
| **F5** | **THE FORM** — the executable lines of `laneOpenness` and `laneOpennessFront` differ EXACTLY by the enumerated set (shipped: the `< 1.5` guard and the `d / 4` line; front: `along`, the `=== 0` guard, the selected normaliser), front = shipped + 1 line; the numeric literals of the front form are the SET `{0, 1, 1.5, 4}`; `CONTROL_RADIUS` arrives on a NEW import line, the shipped import line byte-unchanged | a new constant; a form drift |
| **F6** | **THE SEAM MAP** — per-file executable-line counts, **paths normalized to `/`** (#418 item 2(iv)): `opFrontMan` = `Match.ts` 4 · `League.ts` 1 · `PlayerBrain.ts` 1 · every other file 0; `laneOpennessFront` = `perception.ts` 1 · `PlayerBrain.ts` 2 · every other 0; `laneOpennessShipped` = `PlayerBrain.ts` 2 only; the ONLY assignment `.opFrontMan =` is the constructor's; `opFrontMan: true` and any env read NOWHERE; Road B — no world 1–18 carries it, `a4World.ts` names neither name, worlds 13 / 17 / 18 construct it `false`, `League.toJSON` omits it; the key union grew by EXACTLY one | a flag reaching a world; a second fork; a backslash-vs-slash red |
| **F7** | **THE MUTANT WALK** — the four mutation texts held as data, each `from` line exactly once in its file (reproducible), plus per-mutant runtime + source kill pins (table below) | each named mutant |
| **F8** | **THE BAND** — every seed derived from the ONE declared `BASE = 900_009_800` and inside 900,009,800–899; the verifier band 900,009,900–999 untouched | a walk outside the band |

**THE MUTANT WALK, OBSERVED (not predicted).** Each mutant was applied in place by a scratch
script (whole-line replacement, each `from` asserted to occur exactly once), this whole file
re-run, the original restored and sha256-verified (`perception.ts` `ea5080de2fa8…`,
`PlayerBrain.ts` `bd26ad1b8961…`, `ownLaneSeat.ts` `d4f5075c0c60…`; all three re-checked OK
against a pre-walk `sha256sum` file):

| mutant | exact mutation | outcome | killed by (among others) |
| --- | --- | --- | --- |
| **M1** the shipped guard kept | `perception.ts`: `    if (along === 0) continue;` → `    if (along < 1.5) continue;` | **12 / 34 RED** | fixtures (3) (4) (5) and the sweep; F3 both worlds and "the world MOVES" (the armed form now equals HEAD); F5 both; the reproducibility row; M1's and M2's rows |
| **M2** the 4 m normaliser inside 1.5 m | `perception.ts`: `    worst = Math.min(worst, clamp01(d / (along < 1.5 ? CONTROL_RADIUS : 4)));` → `    worst = Math.min(worst, clamp01(d / 4));` | **6 / 34 RED** | fixtures (4) (5); F5 both; the reproducibility row; M2's row |
| **M3** the flag inverted | `PlayerBrain.ts`: the seat line → `      const laneOpenness = !match.opFrontMan ? laneOpennessFront : laneOpennessShipped;` | **13 / 34 RED** | **G-OFF on all four worlds + the fingerprint**; F2 both worlds (shut now calls the front form); F3 both worlds; F4's first-statement pin; F6's gate-lines pin; the reproducibility row; M3's row |
| **M4** the seat applied to `ownLaneOpenness` too | `ownLaneSeat.ts`: `import { laneOpenness } from './perception';` → `import { laneOpenness, laneOpennessFront } from './perception';` AND `  return laneOpenness(from, aim, kept as unknown as Player[]);` → `  return laneOpennessFront(from, aim, kept as unknown as Player[]);` | **8 / 34 RED** | **G-OFF on worlds 17 and 18** (the LN own-lane world family); F2 on world 18 (the shut world now calls the front form through LN); F4's no-other-lane pin; F6's seam map; the reproducibility row; M3's runtime row (its shut-world call count); M4's own-lane fixture |

No narrows: no existing pin had to change (§GATES G-SUITE).

---

## §GATES and the RUN OF RECORD

| gate | predicate | result |
| --- | --- | --- |
| **G-OFF** | the four x64 digests recorded at `1b352f7` (bare · 13 · 17 · 18, 900,009,800–811) reproduce with the seam in; ABSENT ≡ EXPLICITLY FALSE | ✅ |
| **G-FP** | `npm run fingerprint` = `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` (the x64 value of record), and recomputed in process by F1 | ✅ |
| **G-FIXTURE** | the three geometric cases, the edge, the CONTROL_RADIUS-aside case, the ≡-sweep | ✅ |
| **G-DORMANT** | ZERO `laneOpennessFront` calls over whole shut matches (bare · 18) | ✅ |
| **G-ARMED** | differs only with a man strictly ahead within 1.5 m (0 exceptions in 18,527 evaluations), and differs (2,819) | ✅ |
| **G-MAP** | the seam map, the gate literals, Road B, the union, paths normalized to `/` | ✅ |
| **G-MUTANT** | four mutants applied at source, each observed to die (12 · 6 · 13 · 8) | ✅ |
| **G-SUITE** | `tsc --noEmit` clean; the new suite **34/34** on x64; the FULL suite SERIAL (`NO_COLOR=1 npx vitest run --no-file-parallelism`, 2,616 s) **2,435 / 2,491 green, 56 red in 35 files** — THE SUBTRACTION against ruling #418 item 3's inventory, file by file: (A) the arm64 fingerprint pin x1 in each of the 18 named files + the pooled IDENTITY digests in `bqPlaytestEntry` · `gkPlaytestEntry` · `lnPlaytestEntry` (x1) + `dsPlaytestEntry` · `ds2PlaytestEntry` (x2) + G-OFF x4 and the fingerprint in `dsOwnRun` and `dsCoopHatsOff` = **35**; (C) path separators in `bfFacingCost` x2 · `bkCorridorPrice` · `bqCushion` x2 · `dlcDeliveryChoice` · `dlcStrikePlane` · `dsCoopHatsOff` x2 · `dsOwnRun` x2 · `dvDeliveryValue` · `dxWindupAim` x2 · `gcGroundCorridor` · `obmEyesSeat` · `ptpPassLead` · `raAccessPrice` · `rcAnticipate` · `rcReady` = **20**; (B) `stamina.test.ts` 0.940625 < 0.93 = **1**; (D) host timeouts = **0** this run. 35 + 20 + 1 + 0 = **56 = the reds observed; ZERO outside the inventory**, every assertion a digest / fingerprint / path-separator / the B-class outcome literal. `ifFlightRun` 51/51 and `ifPlaytestEntry` 33/33 green | ✅ |

---

## §HONESTY

1. **NOTHING HERE MEASURES FOOTBALL.** Every count in §PINS is ARMING PLUMBING (canon "receipts
   ≠ effect sizes", ruling #289 item 1). F3's 2,480 / 15,412 is a count of licence EVALUATIONS
   whose price moved, not of passes, releases or outcomes. Whether the pressed passer now
   chooses differently, and whether that reads as 「传不出去」, is OP-T1's question (contract
   C1–C3) and the eye's.
2. **THE HOST IS x64 AND THE PROGRAMME'S NUMBERS ARE arm64 NUMBERS** (#418). This suite's G-OFF
   table has an x64 column only. The arm64 column is ABSENT, not guessed: these scratch seeds
   have no arm64 literal of record. The arm64 argument is BY IDENTITY OF THE CODE PATH — with the
   door shut the seat binds the shipped `laneOpenness` function object, and F2 counts ZERO
   front-form calls — so the shut world runs HEAD's statements on any architecture. CI
   (`macos-latest`) skips the four G-OFF pins by title and runs everything else.
3. ⚠ **TWO FROZEN PROBES HASH `decideCarrier` WHOLE, AND THAT HASH READS RED FROM THIS COMMIT**
   (the IF-T0 §HONESTY 4 form). `findSpan(BRAIN_PATH, 'decideCarrier', …)` is a hashed root in
   `scripts/probes/ds-c0-designation-census.ts` and `scripts/probes/if-c0-flight-run-census.ts`;
   `groundCandidate` lives inside `decideCarrier`, and this seam inserts six lines there. ⛔ No
   probe file is touched. The single-line anchors the OP censuses read (the shipped
   `laneOpenness(p.pos, aim, opp.players)` call, the `if (dist(cp, from) < 1.5) continue;`
   guard, the forward gate, the playmaker line) each still occur exactly as before — the seam
   rewords no shipped line. Whole-file `srcSha256` provenance maps of `perception.ts` /
   `PlayerBrain.ts` written into probe artifacts change, as they do at every src commit; none
   gates on a banked value (checked by reading, not by re-running the probes).

---

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⭐⭐ **THE SEAT IS A CLOSURE-LOCAL SHADOW, SO THE SHIPPED STATEMENT KEEPS EVERY BYTE.** The
   contract says "Armed, it calls `laneOpennessFront` instead, with the same arguments"; the
   dispatch says "a purely additive fork on `match.opFrontMan`". Writing the choice INTO the
   shipped call (`(match.opFrontMan ? laneOpennessFront : laneOpenness)(…)`) would REWORD a
   shipped line. The form chosen: the shipped `laneOpenness` is ALSO imported under the alias
   `laneOpennessShipped` (a NEW import line; the shipped import block is byte-unchanged), and the
   closure's FIRST statement binds a block-local `const laneOpenness = match.opFrontMan ?
   laneOpennessFront : laneOpennessShipped;`. The shipped `const lane = Math.min(1,
   laneOpenness(p.pos, aim, opp.players) * …)` then calls the door's choice with the same
   arguments — exactly M-OP.1 — and the shadow is lexically confined to `groundCandidate`: the
   three other `laneOpenness(` callers sit outside the closure and bind the module import (F4
   pins both). Door shut ⇒ the bound function IS the shipped one (F2: zero front-form calls).
   The door is read once per `groundCandidate` call (a property read; no rng, no state). The
   meaning of the mechanism is unchanged.
2. **`CONTROL_RADIUS` ARRIVES ON ITS OWN IMPORT LINE** (`import { CONTROL_RADIUS } from
   '../sim/constants';`) rather than being added to the shipped import line, for the same
   reason: the shipped line keeps every byte. No import cycle: `perception.ts` already imported
   from `../sim/constants`. `CONTROL_RADIUS = 1.25 · CONTROL_REACH_SCALE` — the engine's own
   value, including its env door (unset on every host, #418 item 1).
3. **F3 MEASURES EVERY LICENCE EVALUATION, NOT ONLY RELEASES.** #432 item 3(ii) words ARMED
   liveness on "releases with such a man". The pin compares the two forms on EVERY call the
   armed seat makes (every candidate priced, chosen or not) — a strict superset of the releases,
   so "differs only with such a man" holds a fortiori on releases. The observation is made by
   wrapping the `laneOpennessFront` export with `vi.mock` (value returned untouched); this is
   sound because the seam map pins `laneOpennessFront`'s ONLY caller as the seat.
4. **THE G-OFF SEEDS ARE THIS STAGE'S OWN SCRATCH BAND (900,009,800–811), AND THE arm64 COLUMN
   IS THEREFORE ABSENT.** The ruling asks for "≥ 12 scratch seeds (x64 recorded; arm64 by
   identity of the code path)" — no inheritance route (a) is available on new seeds, so route
   (b) ABSENT is taken and the code-path identity is pinned as behaviour (F2). The recorder's
   recipe was first CHECKED byte-equal to `tests/ifFlightRun.test.ts`'s: run on that suite's
   seeds 900,007,400–411 it reproduced its x64 bare `43d4174d…1d16`, w13 `796b13a3…93f0`, w17
   `6b5ecaa3…971d` at `1b352f7`. The x64 column was recorded IN PROCESS on the clean dispatch
   tree (no worktree; `git status --short` empty) and re-derived with the seam in (identical).
   **Frontier: ZERO consumption. Stats: ZERO.** Verifier band 900,009,900–999 reserved.
5. **M4's MUTATION IS UNCONDITIONAL** (the front form inside `ownLaneOpenness` with no door read),
   because `ownLaneSeat.ts` is pure and has no `match` to read a door from. It is the widest
   reading of "the seat applied to `ownLaneOpenness` too"; a door-gated variant would be killed
   by the same source pins (F4 / F6) and by the M4 own-lane fixture whenever armed.
6. **NO NARROWS.** No pinned test needed a narrow: the new key reddens no existing union /
   seam-map pin (G-SUITE, measured), so the dispatch's narrows commit is not used.
