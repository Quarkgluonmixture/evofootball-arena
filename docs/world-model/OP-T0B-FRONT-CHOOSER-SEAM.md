# ⭐⭐⭐ OP T0b — 「身前那个人 · 挑线」 THE FRONT-CHOOSER SEAM (a NEW flag, `opFrontChooser`, dormant)

> **What this stage builds.** ONE dormant flag (`match.opFrontChooser`), ONE pure fact
> (`frontContactOf`, new file `src/ai/frontContact.ts`), ONE optional input (`frontContact?` on
> `choosePerceivedPassTarget` → `pricePassOption`), ONE seat (inside `pricePassOption`'s READ branch)
> and ONE call-site argument (`PlayerBrain.ts`). Nothing ships; no world and no preset names the flag.
> Authority: **COMMANDER RULING #435 items 3–4** (M-OP.5 bound; OP-T0b dispatched), standing on OP-C3's
> MISREAD and the user's 「甲吧」 ⇒ 「身前贴着的人要算进去」 applied to WHO. The law is
> [`OP-FRONT-MAN-CONTRACT.md`](OP-FRONT-MAN-CONTRACT.md) §2 M-OP.2 and M-OP.5; the form template is
> [`OP-T0-FRONT-MAN-SEAM.md`](OP-T0-FRONT-MAN-SEAM.md) (incl. its §COMMANDER CORRECTIONS).
>
> **The dispatch head of record is `cbc30c5`** (ruling #435's own commit). Every G-OFF digest in §PINS was
> recorded there, on this x64 host, before one byte of this seam existed.

---

## §LAW — the fact, the seat, the door, and where every number comes from

```text
THE DOOR                     match.opFrontChooser     ← default OFF; ABSENT ≡ FALSE; no world names it
THE CALL SITE (M-OP.5(c))    the ONE choosePerceivedPassTarget({...}) call in decideCarrier gains ONE key:
                             frontContact: match.opFrontChooser
THE THREAD                   choosePerceivedPassTarget hands input.frontContact to every pricePassOption call
THE SEAT (M-OP.5(b))         pricePassOption, READ branch (both bodies seen, the corridor read non-null):
  frontSeat = input.frontContact === true && frontContactOf(snapshot, passerGid, targetGid, reachProfiles, 1)
  frontSeat false ⇒ the shipped READ lines, byte for byte (door shut: frontContactOf is never called)
  frontSeat true  ⇒ the threat used for reception and band is +Infinity:
                      reception = threatQuintilePrice(+Infinity)   = THREAT_CALIBRATION[last].realizedSuccess
                      band      = threatBandIndex(+Infinity)       = last
                      value     = valueAxis ? attemptValueAt(cell, last) : 1
                      price     = valueAxis ? value : reception
                    every other field (targetGid, infoClass READ, cell, executable, distance) the shipped one;
                    the read object is NOT touched
  SEEN-UNREAD / UNSEEN options: untouched (no corridor read, no band)

THE FACT (M-OP.5(a))         frontContactOf(snapshot, passerGid, targetGid, reachProfiles, powerMultiplier)
  passer, target = the passer's OWN snapshot entries (either missing ⇒ FALSE)
  from = passer's perceived pos;  to = predictGroundPass(passer.pos, target, power).targetPoint
                                        (the corridor's own call, passCorridorInterception.ts)
  TRUE iff some snapshot entry on the other side, holding a reach profile (= not sent off), has
       cp = closestPointOnSegment(from, to, his perceived pos),  along = dist(cp, from),
       0 < along < 1.5   AND   dist(cp, his pos) < CONTROL_RADIUS

NO NEW NUMBER   1.5 (M-OP.2's partition = the shipped guard radius) · CONTROL_RADIUS (the engine's)
                · 0 (the clamp's own output) · +Infinity (the unbounded sentinel; the read already
                uses NEGATIVE_INFINITY) · 1 (the power the shipped read in pricePassOption is priced at)
                · the LAST band (the calibration's own last row)
```

1. **Binary, because the price is a band (#435 item 3(e)).** The man either makes this lane the worst class
   or he does not touch the price.
2. **The fact IS M-OP.2's partition.** `frontContactOf` is TRUE exactly when `laneOpennessFront`, on the same
   segment and the same live opponents, reads below 1 because of a man inside (0, 1.5) — pinned on a
   4,000-lane random sweep (F0b): per man, the front form reads him below the shipped form iff he is in the
   partition within `CONTROL_RADIUS`.
3. **No other consumer changes.** `evaluatePassOption`, `evaluatePassCorridorInterception`,
   `preferredPassPower` (the canary), the LN own-lane hook, the lane forms, `opFrontMan`'s seat, the trace
   door's fields: untouched. The armed chooser's trace stores the option as priced (band = last), as it
   stores every priced option.

---

## §SEAM — VERBATIM in every executable line (the source is the authority: `git show <SEAM> -- src`)

`git diff --stat cbc30c5 -- src` = **4 files changed, 60 insertions, 0 deletions** + the NEW
`src/ai/frontContact.ts` (47 lines). Every hunk is a pure insertion: `PlayerBrain.ts` `@@ -1493,6 +1493,9 @@` ·
`perceivedPassChoice.ts` `@@ -36,6 +36,7` · `@@ -126,6 +127,13` · `@@ -183,6 +191,8` · `@@ -232,6 +242,31` ·
`@@ -262,6 +297,7` · `League.ts` `@@ -300,6 +300,7` · `Match.ts` `@@ -1135,6 +1135,17` · `@@ -2045,6 +2056,11` ·
`@@ -2754,6 +2770,10`. Not one shipped line is deleted, reordered, reworded or re-indented.

### `src/ai/frontContact.ts` (NEW; JSDoc omitted here)

```ts
export function frontContactOf(
  snapshot: PerceptionSnapshot,
  passerGid: number,
  targetGid: number,
  reachProfiles: ReadonlyMap<number, KnownReachProfile>,
  powerMultiplier: number,
): boolean {
  const passer = snapshot.players.find((entry) => entry.gid === passerGid);
  const target = snapshot.players.find((entry) => entry.gid === targetGid);
  if (!passer || !target) return false;
  const from = passer.pos as V2;
  const to = predictGroundPass(passer.pos, target, powerMultiplier).targetPoint;
  for (const entry of snapshot.players) {
    if (entry.side === passer.side) continue;
    if (!reachProfiles.has(entry.gid)) continue;
    const cp = closestPointOnSegment(from, to, entry.pos as V2);
    const along = dist(cp, from);
    if (!(along > 0 && along < 1.5)) continue;
    if (dist(cp, entry.pos as V2) < CONTROL_RADIUS) return true;
  }
  return false;
}
```

### `src/ai/perceivedPassChoice.ts` — the import, the two optional fields, THE SEAT, the thread

```ts
import { frontContactOf } from './frontContact';                 // a NEW line in the import block
  readonly frontContact?: boolean;                               // PerceivedPassChoiceInput (JSDoc'd)
  readonly frontContact?: boolean;                               // pricePassOption's input
```

…between the shipped SEEN-UNREAD branch and the shipped READ lines (6 comment lines omitted):

```ts
  const frontSeat = input.frontContact === true
    && frontContactOf(snapshot, passerGid, targetGid, reachProfiles, 1);
  if (frontSeat) {
    const worstThreat = Number.POSITIVE_INFINITY;
    const worstReception = threatQuintilePrice(worstThreat);
    const worstBand = threatBandIndex(worstThreat);
    const worstValue = valueAxis ? attemptValueAt(cell, worstBand) : 1;
    return {
      targetGid,
      infoClass: 'READ',
      cell,
      band: worstBand,
      price: valueAxis ? worstValue : worstReception,
      reception: worstReception,
      value: worstValue,
      executable: true,
      distance,
    };
  }
```

…and in `choosePerceivedPassTarget`, ONE new line inside the shipped `pricePassOption({ … })` literal:

```ts
    frontContact: input.frontContact,
```

### `src/ai/PlayerBrain.ts` — the ONE call-site argument (2 comment lines omitted)

```ts
        frontContact: match.opFrontChooser,
```

### `src/sim/Match.ts` · `src/sim/League.ts` — the door (the `opFrontMan` idiom)

```ts
  opFrontChooser?: boolean;                               // MatchConfig, after opFrontMan?
  readonly opFrontChooser: boolean;                       // Match, after readonly opFrontMan
    this.opFrontChooser = cfg.opFrontChooser ?? false;    // constructor, after the opFrontMan init
    | 'opFrontChooser'                                    // League matchFlags key union, after 'opFrontMan'
```

### Untouched (restated as a prohibition)

⛔ `src/game/a4World.ts` (names none of it) · ⛔ `opFrontMan`'s seat (`PlayerBrain.ts` — the line byte-present,
its count 1) · ⛔ `passOptionValue.ts` · `passCorridorInterception.ts` · `passAffordance.ts` · `perception.ts` ·
`ownLaneSeat.ts` · `deliveryValueSeat.ts` · `perceptionSnapshot.ts` · `passWeightChooser.ts` · `reachability.ts`
· `prediction.ts` · ⛔ every `scripts/probes/` file. No world, no preset, no env door, no bundle default arms
the flag; `League.toJSON` omits it.

---

## §PINS — `tests/opFrontChooser.test.ts`, **45** `it()`s, ALL GREEN on x64

| # | pin | what it catches |
| --- | --- | --- |
| **F0** | **THE FIXTURES, item 4(ii)'s list in order** — passer at the origin, target standing at (10, 0): a man 1 m ahead on the line ⇒ TRUE; behind ⇒ FALSE; level ⇒ FALSE; 1 m ahead at EXACTLY `CONTROL_RADIUS` aside ⇒ FALSE (both sides); just inside ⇒ TRUE; at EXACTLY 1.5 m along ⇒ FALSE (1.5 − 1e-9 ⇒ TRUE); sent off (no reach profile) ⇒ FALSE; a man the snapshot does not hold ⇒ FALSE; a teammate ⇒ FALSE; plus: the segment ends at the PREDICTED `targetPoint` (a running target; a man 0.836 m from that line but 1.3 m > `CONTROL_RADIUS` from the line to the target's position ⇒ TRUE), and a missing passer / target ⇒ FALSE | M2 · M3; a fact read off truth, off the wrong segment, or off teammates |
| **F0b** | ⭐ **THE AGREEMENT PIN** — 4,000 random lanes from `Rng(900,010,450)` (6–30 m, moving targets, 1–5 bodies, 15 % teammates, 5 % without a profile): `frontContactOf` ≡ "some live observed opponent reads `laneOpennessFront(from, to, [o]) < laneOpenness(from, to, [o])`" on the SAME `from`/`to`, every lane; and TRUE ⇒ `laneOpennessFront` over the live opponents < 1. Both partitions > 500 | any drift between the chooser's fact and M-OP.2's form (M2) |
| **F1** | **THE SEAT** — the shipped read prices a man 1 m ahead below the last band (the misread, both axes); ABSENT ≡ EXPLICITLY FALSE ≡ shipped, with ZERO `frontContactOf` calls; ARMED with contact ⇒ band = last = `threatBandIndex(+∞)`, reception = the last row's `realizedSuccess` = `threatQuintilePrice(+∞)`, value = `attemptValueAt(cell, last)` on the value axis (1 off it), price per axis, every other field the shipped option's; ARMED without contact (3 m ahead; `CONTROL_RADIUS` aside; behind) ⇒ shipped field for field; ⛔ **the read NOT mutated** (every `evaluatePassOption` return captured by a `vi.mock` wrapper equals its own shallow copy taken at return, and its threat stays finite); the chooser threads the input (armed: the contact option's band = last, the clean option unchanged; `false` ≡ absent) | M1 · M4; a seat that touches clean options |
| **F2** | **G-OFF, ARCH-KEYED** — the door absent ⇒ whole-match signatures (the `opFrontMan.test.ts` `signatureOf`, rng draw included) on the twelve scratch seeds **900,010,400–411** digest to the x64 literals RECORDED at `cbc30c5`: bare `335339ce…aec5` · w13 `fca46900…e2da` · w17 `20e8e7c9…20bd` · w18 `501be87c…758e` · **w18 + `opFrontMan`** `30c37c19…a74f`; **arm64 ABSENT** (skipped on arm64, by title); ABSENT ≡ EXPLICITLY FALSE (bare · 18 · 18 + `opFrontMan`, three seeds) and the two doors independent; the fingerprint (x64 `59f42aa7…a072d`, in process) | any leak of the seam into a shipped world; M1 |
| **F3** | **DORMANT, COUNTED** — over whole matches with the door absent (bare and world 18, three seeds each, each also with `opFrontMan` armed) `frontContactOf` is called **0** times; armed on world 18 it is called | M1; a second caller |
| **F4** | **ARMED LIVENESS — the in-process A/B.** Every armed chooser call (wrapped by `vi.mock`, value untouched) is re-priced SHUT on the same input: world 18 + the door, seeds 900,010,430–432: **156** choices, **35** with a front-contact candidate, **3** chosen targets differ, **0** of them without contact; **42** options moved, **0** without contact on that option. World 18 + `opFrontMan` + the door: **153 / 38 / 6 / 0**; **50 / 0**. And the armed world MOVES (world 18 signature ≠ shut on 900,010,460–461) | a seat that does nothing; a seat that moves clean options |
| **F5** | **THE SEAM MAP** — the seat's guard sits after the SEEN-UNREAD branch and before the shipped READ lines, which END the function byte-for-byte; one `frontContactOf(` call, one `input.frontContact` read, one `+Infinity`; ⛔ no assignment to the read or its threat; the seat's numeric literals = `{1}`; the thread is ONE new line inside the shipped literal; LN's pins hold (`ownLaneFactor` ×3, the shipped `priced` line); `preferredPassPower` untouched; the call site: ONE `choosePerceivedPassTarget(` call, ONE code line naming the door, OP-T0's seat line byte-present, `opFrontMan` code count 1; the fact: literals `{0, 1.5}`, five imports, no Match / rng / truth, the corridor's own `predictGroundPass` call; per-file counts, **paths normalized to `/`**: `opFrontChooser` = `Match.ts` 4 · `League.ts` 1 · `PlayerBrain.ts` 1; `frontContactOf` = `frontContact.ts` 1 · `perceivedPassChoice.ts` 2; `frontContact` (the input) = `perceivedPassChoice.ts` 6 · `PlayerBrain.ts` 1; ten other modules at ZERO; OP-T0's pin (the chooser names neither OP-T0 name) holds; the only `.opFrontChooser =` is the constructor's; `opFrontChooser: true` and env reads nowhere; Road B (no world 1–18, `a4World.ts` names none, worlds 13 / 17 / 18 construct it `false`, `toJSON` omits it); the key union grew by EXACTLY one, right after `'opFrontMan'` | a flag reaching a world; a widened seat; a re-written shipped line |
| **F6** | **THE MUTANT WALK** — the four mutation texts held as data, each `from` exactly once in its file (reproducible), plus per-mutant kill pins (table below) | each named mutant |
| **F7** | **THE BAND** — every seed from the ONE `BASE = 900_010_400`, inside 900,010,400–499; the verifier band 900,010,500–599 untouched | a walk outside the band |

**THE MUTANT WALK, OBSERVED (not predicted).** Each mutant applied in place by a scratch script (binary,
whole-line replacement, each `from` asserted exactly once), this whole file re-run, the original restored and
sha256-verified (`frontContact.ts` `f95d8d21007d…`, `perceivedPassChoice.ts` `f5d8621be8ab…`; both re-checked
OK after the walk):

| mutant | exact mutation | outcome | killed by (among others) |
| --- | --- | --- | --- |
| **M1** the seat ignores the flag | `perceivedPassChoice.ts`: `  const frontSeat = input.frontContact === true` → `  const frontSeat = true` | **15 / 45 RED** | **G-OFF on w13 · w17 · w18 · w18+`opFrontMan`** (bare stays green: the chooser does not run there); F3 on world 18; F1 absent ≡ shipped, the misread fixture, the armed-vs-shut field pin; F4 both worlds and "the world MOVES" (armed now equals shut); F5 seat + per-file map; the reproducibility row; M1's row |
| **M2** the 1.5 bound dropped | `frontContact.ts`: `    if (!(along > 0 && along < 1.5)) continue;` → `    if (!(along > 0)) continue;` | **6 / 45 RED** | the 1.5 m fixture; **the agreement sweep**; F1 armed-without-contact (3 m ahead); F5 the fact; the reproducibility row; M2's row |
| **M3** `<=` for `<` on `CONTROL_RADIUS` | `frontContact.ts`: `    if (dist(cp, entry.pos as V2) < CONTROL_RADIUS) return true;` → `…<= CONTROL_RADIUS) return true;` | **5 / 45 RED** | the `CONTROL_RADIUS`-aside fixture; F1 armed-without-contact; F5 the fact; the reproducibility row; M3's row |
| **M4** the seat applied to the corridor READ itself, not the price | `perceivedPassChoice.ts`: `  if (frontSeat) {` → `  if (frontSeat && !((read as { interceptionThreatSeconds: number }).interceptionThreatSeconds = Number.POSITIVE_INFINITY)) {` (the read is overwritten, the shipped lines then price it) | **5 / 45 RED** | **F1 the read NOT mutated**; F5 the seat; M1's and M4's rows (source); the reproducibility row. ⚠ Its PRICES equal the seat's (+∞ either way) — only the immutability pins can see it, which is why they exist |

No narrows: no existing pin had to change (§GATES G-SUITE).

---

## §GATES and the RUN OF RECORD

| gate | predicate | result |
| --- | --- | --- |
| **G-OFF** | the five x64 digests recorded at `cbc30c5` (bare · 13 · 17 · 18 · 18 + `opFrontMan`, 900,010,400–411) reproduce with the seam in; ABSENT ≡ EXPLICITLY FALSE | ✅ |
| **G-FP** | `npm run fingerprint` = `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`, and recomputed in process by F2 | ✅ (`sha256=59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`, seed 1337, 142 matches) |
| **G-FIXTURE** | item 4(ii)'s nine fixtures + the targetPoint case | ✅ |
| **G-AGREE** | `frontContactOf` ≡ the partition man of `laneOpennessFront`, 4,000 / 4,000 lanes | ✅ |
| **G-DORMANT** | ZERO `frontContactOf` calls over whole shut matches (bare · 18, each also with `opFrontMan` armed) | ✅ |
| **G-ARMED** | chosen target differs only with a front-contact candidate (0 exceptions in 309 armed choices; 0 moved options without contact in 92) and differs (3 + 6) | ✅ |
| **G-MAP** | the seam map, the gate literals, Road B, the union, paths normalized to `/` | ✅ |
| **G-MUTANT** | four mutants applied at source, each observed to die (15 · 6 · 5 · 5) | ✅ |
| **G-SUITE** | `tsc --noEmit` clean; the new suite **45/45** on x64 (`opFrontMan.test.ts` 34/34 beside it); the FULL suite SERIAL (`NO_COLOR=1 npx vitest run --no-file-parallelism`, 2,760 s) **2,480 / 2,536 green, 56 red in 35 files** — THE SUBTRACTION against ruling #418 item 3's inventory, file by file and title by title, the same 35 files and 56 titles as OP-T0's run of record: (A) the arm64 fingerprint pin x1 in each of the 18 named files + the pooled IDENTITY digests in `bqPlaytestEntry` · `gkPlaytestEntry` · `lnPlaytestEntry` (x1) + `dsPlaytestEntry` · `ds2PlaytestEntry` (x2) + G-OFF x4 and the fingerprint in `dsOwnRun` and `dsCoopHatsOff` = **35**; (C) path separators in `bfFacingCost` x2 · `bkCorridorPrice` · `bqCushion` x2 · `dlcDeliveryChoice` · `dlcStrikePlane` · `dsCoopHatsOff` x2 · `dsOwnRun` x2 · `dvDeliveryValue` · `dxWindupAim` x2 · `gcGroundCorridor` · `obmEyesSeat` · `ptpPassLead` · `raAccessPrice` · `rcAnticipate` · `rcReady` = **20**; (B) `stamina.test.ts` 0.9406252509653392 < 0.93 = **1**; (D) host timeouts = **0** this run. 35 + 20 + 1 + 0 = **56 = the reds observed; ZERO outside the inventory**, every assertion a digest / fingerprint (`59f42aa7…` observed vs `57b0bdab…`) / path-separator / the B-class literal | ✅ |

---

## §HONESTY

1. **NOTHING HERE MEASURES FOOTBALL.** Every count in §PINS is ARMING PLUMBING (ruling #289 item 1). F4's
   3 / 156 is a count of chooser CALLS on three short scratch matches whose argmax moved, not of passes or
   outcomes. Whether the passer pressed from the front now picks another lane, and what that costs (more
   passes into safer, shorter or backward lanes — #435 item 3(f)), is OP-T1b's question.
2. **THE HOST IS x64 AND THE PROGRAMME'S NUMBERS ARE arm64 NUMBERS** (#418). G-OFF has an x64 column only;
   the arm64 column is ABSENT, not guessed. The arm64 argument is BY IDENTITY OF THE CODE PATH: door shut ⇒
   `frontSeat` is `false` by the `=== true` test before any call, F3 counts ZERO `frontContactOf` calls, and
   the shipped READ lines run unchanged. CI (`macos-latest`) skips the five G-OFF pins by title.
3. ⚠ **FROZEN PROBES THAT HASH WHOLE SPANS READ RED FROM THIS COMMIT** (the OP-T0 §HONESTY 3 / IF-T0
   §HONESTY 4 form). `decideCarrier` (the call-site argument lives inside it) is a hashed root in
   `scripts/probes/ds-c0-designation-census.ts` and `if-c0-flight-run-census.ts`; `pricePassOption` and / or
   `choosePerceivedPassTarget` are extracted whole in `ln-c2-chooser-path-census.ts`,
   `ln-c3-untraced-family-census.ts`, `ln-t1p-own-lane-exam.ts`, `ln-t1pb-own-lane-exam.ts`. ⛔ No probe file is
   touched. The single-line anchors the OP censuses read (e.g. `op-c3-chooser-census.ts`'s
   `        valueAxis: match.edsValueAxis,` and `        ownLaneFactor: lnOwnLaneFactor,`, OP-T0's seat line,
   the `opFrontMan` init) still occur exactly as before — the seam rewords no shipped line. Checked by reading,
   not by re-running the probes. OP-T1b's own instrument must anchor on this commit.
4. **The armed chooser's trace** (`passChoiceTrace`, the trace door) stores a contact option with band = last
   and its seat price — the menu "as priced", exactly as it stores the LN-priced menu. A census reading the
   trace's `band` on an armed arm reads the SEAT's band, not the corridor's; the corridor's own read is
   recoverable only by a re-call (as OP-C3 did).

---

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⭐ **"NOT SENT OFF" IS READ AS "HOLDS A REACH PROFILE".** The snapshot entry type (`ObservedPlayer`) carries
   no `sentOff` field; the snapshot drops a sent-off man at the next scan, and `Match.reachProfiles()` — the
   map handed to the chooser and to `frontContactOf` (ruling #435's own signature) — holds every body NOT
   sent off. The corridor read itself skips a defender without a profile (`!profile ⇒ null`). So the fact
   skips an opponent with no profile; the fixture "sent off ⇒ FALSE" is a man in the snapshot without a
   profile. Meaning unchanged: a man the corridor would not race is not a front contact.
2. ⭐ **THE SEAT IS AN EARLY RETURN, SO THE SHIPPED READ LINES KEEP EVERY BYTE.** Writing `+Infinity` into the
   shipped `threatQuintilePrice(read.interceptionThreatSeconds)` lines would reword them; mutating `read`
   is forbidden (and is M4). The seat therefore returns its own option literal, the shipped READ literal's
   shape with the worst-band trio — a second copy of nine field lines. F1 pins the seat's option equal to the
   shut option on every field but band / reception / value / price, so a drift of the copy dies. The meaning
   is the ruling's.
3. **THE POWER IS THE LITERAL `1`** — the power the shipped `evaluatePassOption` call in the same function is
   priced at (`powerMultiplier: 1`, pinned byte-present by F5), so the fact and the read see the same flight.
4. **THE THREAD IS A NEW LINE INSIDE A SHIPPED LITERAL** (`frontContact: input.frontContact,`), so the
   shipped `pricePassOption({` and `snapshot, passerGid, …, valueAxis,` lines keep their bytes. Absent ⇒ the
   key carries `undefined` and the seat's `=== true` is false.
5. **F4 COMPARES TARGETS AND OPTIONS PER CHOOSER CALL**, and the A/B shut side is the UNWRAPPED original
   called on the armed call's own input with `frontContact: undefined` — a strict in-process HEAD-vs-seam
   comparison at every armed decision, plus "some option had front contact" computed by the unwrapped
   `frontContactOf` over every candidate (a superset of the READ options the seat can touch). Thin but
   non-vacuous (3 + 6 differing choices): scratch matches are 240 s.
6. **M4's MUTATION** is the read overwritten inside the seat (the narrowest reading of "the seat applied to
   the corridor read itself, not the price"): its prices are identical to the seat's, so it is killed ONLY by
   the read-immutability pins (runtime and source). A mutation inside `evaluatePassOption` would be pure and
   door-less (as OP-T0's M4), and would die on G-OFF w18 and the no-other-consumer map.
7. **THE G-OFF SEEDS ARE THIS STAGE'S OWN SCRATCH BAND (900,010,400–411), arm64 ABSENT** (route (b) of #418
   item 2(ii)). The recorder (`tsx`, in process, on the clean dispatch tree, `git status --short` empty, no
   worktree) was first CHECKED by reproducing `opFrontMan.test.ts`'s four x64 literals on 900,009,800–811
   (bare `8ed1d970…7481` · w13 `fd6d7443…80c3` · w17 `3f85b15e…c1ed` · w18 `9fcfa316…ac00`), then recorded
   the five literals at `cbc30c5`, then re-derived them with the seam in (identical). **Frontier: ZERO.
   Stats: ZERO.** Verifier band 900,010,500–599 reserved.
8. **NO NARROWS.** No pinned test needed a narrow (G-SUITE, measured); the narrows commit is not used.

## §COMMANDER CORRECTIONS (ruling #436 — OP-T0b BANKED; verifier PASS, zero HIGH, zero MEDIUM, three LOW; no code change owed)

1. **LOW — §SEAM's diffstat line.** `git diff --stat cbc30c5 -- src` prints **5 files changed, 107 insertions(+)**
   (PlayerBrain 3 · frontContact 47 · perceivedPassChoice 36 · League 1 · Match 20). The "4 files, 60 insertions"
   above left the new file out. Every hunk header listed is the real diff's.
2. **LOW — §HONESTY 3 is incomplete.** Add `scripts/probes/pw-t0b-chooser-receipts.ts` and
   `pw-t0c-amendment-receipts.ts`: they build `PRODUCTION_TERMS` from the identifiers of `pricePassOption`'s body as
   `bodyOf` cuts it (from the first `{`, i.e. the input type literal), so the new `frontContact?` field makes a re-run
   record `productionTermCount` 17, not the banked 16. Errata, standing; no probe edited. OP-C1 / C2 / C3 / T1 needle
   anchors still hold (verified).
3. **LOW — F4 computes "some option had front contact" over every candidate**, a superset of the READ options the
   seat can reprice. Accepted as declared (deviation 5); the per-option check (`optionsMovedWithoutFront === 0`) is
   exact and covers the gap.
