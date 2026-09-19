# ⭐⭐⭐ IF T0 — 「球在飞时的前插 · 缝」 THE FLIGHT-RUN SEAM (a NEW flag, `ifFlightRun`, dormant)

> **What this stage builds.** ONE dormant flag (`match.ifFlightRun`), ONE per-body belief
> (`match.ifLastSeenOwnerGid`), ONE more PERCEIVED state inside the own-run fork, and ONE more
> `why` — **'own run onto the flight'**, the EIGHTH literal. Nothing ships; no world and no
> preset names the flag; armed without `dsOwnRun` it does nothing. Authority: **COMMANDER
> RULING #417 item 3** (the dispatch of record) **as AMENDED by #418 item 5** (the arch-keyed
> G-OFF and fingerprint, the arm64 column inherited by identity or absent-and-skipped, the
> suite verdict read as *green outside the #418 inventory*, the seam-map paths normalized to
> `/`) **and as CORRECTED by #419 items 2–4 — the IF-T0-FIX** (the two aliases moved INSIDE
> the own-run fork, the DS-T0c member-set pin narrowed POSITIVELY 3 → 5, the remembered passer's
> ranking declared as the LAW, and four provenance corrections in this doc). The law is
> [`IF-FLIGHT-RUN-CONTRACT.md`](IF-FLIGHT-RUN-CONTRACT.md) §2 M-IF.1–4; the
> parent seam is [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md) §LAW-C, whose M-DS.7 state
> guard this stage EXTENDS and whose every other byte it leaves alone.
>
> **The dispatch head of record is `595a555`** (ruling #418's own commit). Every digest in
> §PINS was recorded there, before one byte of this seam existed.

---

## §LAW — the two states, and where every bound comes from

```text
THE GATE (unchanged)           match.dsOwnRun            ← the flight door lives INSIDE it
THE SECOND DOOR                match.ifFlightRun         ← default OFF; ABSENT ≡ FALSE
THE GUARD (unchanged)          hatted / wallLive, and the carrier + keeper excluded
                               STRUCTURALLY by decidePlayer's own dispatch
THE PERCEPT (unchanged)        snapshot = match.perceivedSnapshot(p)   ← ONE pull, may be null

THE BELIEF (M-IF.2) — HIS OWN MEMORY, written only under the second door
  ifSawOwner    = ifFlightRun && ownerGid !== null
  ifSawOwner    ⇒ match.ifLastSeenOwnerGid.set(p.gid, ownerGid)   ← a mate, an OPPONENT, or
                                HIMSELF. An opponent seen with the ball CLEARS the mate
                                state; a restart taker seen with it becomes the last owner;
                                a ball never seen leaves the entry ABSENT.
  ifLastSeenGid = ifSawOwner ? ownerGid
                             : (ifFlightRun ? his own entry ?? null : null)

THE STATE GUARD, WIDENED (M-IF.1) — the SEVENTH's own test is byte-unchanged
  STATE 1 (the SEVENTH, M-DS.7, BYTE-UNCHANGED from §LAW-C)
     carrierIsMate = ownerGid !== null && ownerGid !== p.gid
                     && some q in team.players has q.gid === ownerGid
  STATE 2 (the EIGHTH, NEW)
     ifOntoFlight  = ifFlightRun
                     && seenBall !== null && ownerGid === null      ← the ball he SEES is
                                                                      loose or in the air
                     && ifLastSeenGid !== null && ifLastSeenGid !== p.gid
                     && some mate in team.players has mate.gid === ifLastSeenGid
                                                                    ← the ROSTER by gid
  the candidate exists ONLY when snapshot !== null && (carrierIsMate || ifOntoFlight)
  ⭐ THE TWO STATES ARE MUTUALLY EXCLUSIVE BY CONSTRUCTION: state 1 needs
    `ownerGid !== null`, state 2 needs `ownerGid === null`.

THE RANKING · THE RANK ABOVE HIM · THE RESTRAINT · THE SCORE (M-IF.3)
  THE EXPRESSIONS ARE BYTE-UNCHANGED — §LAW-C's M-DS.6″(a)/(b)/(c) and DS-T0's evaluation
  order — but ⭐ THE TWO STATES RANK OVER DIFFERENT MATE SETS (#419 item 3, ACCEPTED AS THE
  LAW): the rank loop skips `mate.gid === ownerGid`, the PERCEIVED carrier. In the eighth
  state `ownerGid === null` by construction, so NOBODY is skipped and the body he REMEMBERS
  with the ball is ranked like any mate. That is the law, not a defect — in the eighth state
  nobody HAS the ball: the passer released it and is a runner like the rest (the give-and-go
  is made of exactly that), and excluding him would be a hand-coded exception on a MEMORY
  rather than on a percept. M-IF.3 is CLARIFIED in the contract to say so ("the mates his
  eyes hold MINUS the perceived carrier IF there is one — in the eighth state there is
  none"), and IF-T1 prints the eighth class's own restraint partition as a face.
      s = W.runScore · prior · restraint ; if (tired) s *= OFFBALL_TIRED_MUL ; s *= obmRunMul
  cands.push({ action: 'MakeRun', score: s, why: 'own run in behind' });   ← SHIPPED, byte-
                                                                            unchanged
  ifCand.why = ifOntoFlight ? 'own run onto the flight' : ifCand.why;      ← THE EIGHTH, a
                                                                            RELABEL of the
                                                                            SAME candidate
```

### 1. Nothing here is a new number — the fourth time

* **NO constant, NO gene, NO weight, NO divisor is introduced.** `git diff` adds no
  `export const` and no numeric literal to the seam's own lines except the `- 1` that indexes
  the candidate the shipped statement just pushed (pinned: the seam's own executable text
  carries exactly one numeric literal, and it is that `1`).
* **NO predicate on a football quantity (#200).** Every new test is an IDENTITY test: a `gid`
  against a `gid`, a `gid` resolved on the ROSTER, and the door's own boolean. No distance, no
  age bound, no velocity threshold, no comparison against any number — the seam's own lines
  contain no `<` and no `>` at all.
* **The score is M-IF.3's**: the SAME statement, the SAME order, the SAME product. The eighth
  `why` is a LABEL for the ledger, never a weight.

### 2. ⭐ THE COMPLETE READ SET of the widened fork

**THE SNAPSHOT** — `snapshot.ball.ownerGid`; each observed body's `gid`, `side` and `pos`
(unchanged from §LAW-C). **HIS OWN BODY** — `pos`, `role`, `gid`, `side`, `wallRun`, `index`
and, through the incumbent `tired`, his `stamina`. **THE ROSTER by gid** — `team.players`'
`gid`, `role`, `sentOff`, `index` (the team sheet and the referee's card, declared shared
knowledge exactly as §LAW-C declares them). **THE BOARD** — `team.runners`, `team.arriver`,
`team.overlapper`. **THE TEAM'S SHARED CONVENTION** — `team.mode`, `team.genome.tempo`,
`team.mentality.urgency`, `team.localX`. **THE INCUMBENTS** — `W.runScore`, `obmRunMul`,
`OFFBALL_TIRED_MUL`, `match.simTime`, `match.dsOwnRun`. **⭐ THE TWO THIS STAGE ADDS, NAMED** —
`match.ifFlightRun` (the door) and `match.ifLastSeenOwnerGid` (**his own entry only**, by his
own `gid`: `.get(p.gid)` and `.set(p.gid, …)`, one read site and one write site in all of
`src/**`).

⛔ **NOT** `match.ball`, ⛔ **NOT** `ball.owner`, ⛔ **NOT** `match.pendingPass`, ⛔ **NOT**
`pendingPassWindup`, ⛔ **NOT** `lastTouch`, ⛔ **NOT** `info.genome`, ⛔ **NOT** another body's
truth `pos`/`vel`, ⛔ **NOT** `opp.*`, ⛔ **NOT** `match.allPlayers`, ⛔ **NOT** another body's
memory. Pinned as source needles over the WHOLE seam span (F6), each with a count of ZERO.

### 3. The percept pull — UNCHANGED

ONE `match.perceivedSnapshot(p)` per own-run evaluation. The flight door adds **no pull**: the
snapshot the seventh state reads is the snapshot the eighth state reads. MEASURED (F5) in the
DS-T1c spied-vs-unspied form, four arms: `dsOwnRun` absent ⇒ **0** · absent + the flight door
⇒ **0** · armed ⇒ **1** · armed + the flight door ⇒ **1**.

---

## §HONESTY — the belief's fallibility, and what the eighth `why` reddens

1. ⭐⭐⭐ **THE BELIEF IS A MEMORY, AND A MEMORY CAN BE WRONG — THAT IS THE POINT.**
   `ifLastSeenOwnerGid` holds who this body last SAW with the ball at HIS OWN decision cadence.
   A body whose eyes were elsewhere when an opponent intercepted still believes his mate has
   it, and may start a run onto a ball that is already gone. A body who never saw the pass
   leave cannot start at all. Both are VISION §1 感知诚实 (contract §6, PASS), not defects, and
   neither is smoothed: there is no freshness bound (乙 was NOT chosen — ruling #417 item 1),
   no age read, no `ageTicks`.
2. ⭐⭐ **THE STALE-OWNER LEAK IS NOT TOUCHED AND IS NOT THIS.** IF-C0 §R4's leak — own runs
   started while the TRUTH ball is in flight because the PERCEIVED owner is a stale passer
   (`stalePasserStillCredited` 0.894186 of 2.771772 per match, the percept a median 33 ticks
   old) — fires through STATE 1 and is untouched here. The eighth state is the opposite
   percept: a ball seen with NO owner. Contract §4 keeps the leak as honest perception; IF-T1
   prints the partition.
3. ⚠⚠ **THE EIGHTH `why` PUTS A `MakeRun` INTO `OTHER` IN EVERY FROZEN SEVEN-LITERAL
   CLASSIFIER, AND NOT ONE OF THEM IS EDITED** (declared at T0, as contract §4 requires).
   ⭐ **THE PROVENANCE, CORRECTED (#419 item 4(i)):** the grep quoted
   (`grep -rln "own run in behind" scripts/probes/`) returns **FIVE** files, and those five ARE
   the seven-literal family — `ds-t1` · `ds-t1b` · `ds-t1c` · `ds-t1d-coop-hats-exam` ·
   `if-c0-flight-run-census`. `ds-c0-designation-census.ts` is NOT among them (it does not carry
   the seventh literal at all) and is named SEPARATELY below. The substantive claim is
   unchanged: the eighth lands in `OTHER` in every one of them, and none is edited.
   * `scripts/probes/if-c0-flight-run-census.ts` — `runClassOf`, seven classes
     (`ownRunInBehind` included) + `OTHER`;
   * `scripts/probes/ds-t1-own-run-exam.ts` · `ds-t1b-own-run-exam.ts` ·
     `ds-t1c-own-run-exam.ts` · `ds-t1d-coop-hats-exam.ts` — the same classifier family plus
     `runClass.theSeventhLiteralIsExtractedNotTyped`;
   * **SEPARATELY** `scripts/probes/ds-c0-designation-census.ts` — `hatClassOf`, a **SIX**-
     literal classifier (`noWhyRecorded` + six `why`s + `OTHER`) in which the SEVENTH literal
     ALREADY lands in `OTHER`, and so does the eighth. Nothing there changes either.
   **WITH THE DOOR SHUT THEY SEE NOTHING NEW** (the eighth is never produced), so every banked
   number stands. Re-run on an ARMED arm they will classify the eighth into `OTHER` — which is
   a FINDING for IF-T1 to read, not a regression to repair here.
4. ⚠⚠ **SIX FROZEN PROBES HASH `decideOffBall` WHOLE, AND THAT HASH READS RED FROM THIS
   COMMIT** (the DS-T0d §PINS-D (c) family form, applied to this file).
   `findSpan(BRAIN_PATH, 'decideOffBall', …)` is a hashed root in
   `ds-c0-designation-census.ts` · `ds-t1-own-run-exam.ts` · `ds-t1b-own-run-exam.ts` ·
   `ds-t1c-own-run-exam.ts` · `ds-t1d-coop-hats-exam.ts` · `if-c0-flight-run-census.ts`. This
   stage inserts eight executable lines into that function, so its whole-text hash — and any
   `CODE_FACTS_OK` conjunct built on it — reads RED at this commit and later. What was
   CHECKED, not assumed, in the CURRENT source:
   * the single-line ANCHORS all SURVIVE: `match.pendingPass` occurs **5** (the enumerated
     count), `ageTicks` occurs **0**, and `WHY_OWN_LINE`
     (`          cands.push({ action: 'MakeRun', score: s, why: 'own run in behind' });`)
     occurs **1** — the shipped push kept every byte;
   * no probe GATES on a whole-FILE hash of `PlayerBrain.ts` (the `srcSha256` provenance maps
     are written into each artifact's meta and compared to nothing banked — #413 §CORR-D 1).
   ⛔ No probe file is touched. **A stage's source-text anchor is a statement dated to ITS
   head; the next census or exam that inherits it states the hash at ITS OWN head.**
5. ⚠ **THE HOST IS x64 AND THE PROGRAMME'S NUMBERS ARE arm64 NUMBERS** (#418 items 1–2). This
   suite's digest table is keyed by `process.arch`: the x64 column was RECORDED here at the
   dispatch head, the arm64 column is INHERITED BY IDENTITY from
   `tests/dsCoopHatsOff.test.ts`, and world 17's arm64 digest is **ABSENT** — that pin skips on
   arm64 and says so in its title. ⛔ No arm64 number in this stage was measured on this host,
   and none was guessed. CI (`macos-latest`) is the arm64 column's arbiter.
6. **NOTHING HERE MEASURES FOOTBALL.** Every count in §PINS is ARMING PLUMBING (canon
   "receipts ≠ effect sizes", home: ruling #289 item 1). Whether the flight run pays, floods,
   or is selected is IF-T1's question (contract C-IF.4), and this stage claims none of it.
7. **THE HONEST GAPS THE CONTRACT NAMED STAND UNCHANGED** (§7): no timing against the line, no
   passer–runner read (RC held), and the run target is still `runTarget` — in behind, not the
   flight's landing point.

---

## §SEAM — the mechanism (all of it dormant)

### The gate lines

```ts
// src/sim/Match.ts — the config key, the field, the belief, the init
  ifFlightRun?: boolean;
  readonly ifFlightRun: boolean;
  readonly ifLastSeenOwnerGid: Map<number, number | null>;
    this.ifFlightRun = cfg.ifFlightRun ?? false;
    this.ifLastSeenOwnerGid = new Map();

// src/sim/League.ts — the union key
    | 'ifFlightRun'

// src/ai/PlayerBrain.ts — the two ALIASES, the FIRST two statements INSIDE the own-run
// fork (M-IF.4's placement; ruling #419 item 2)
    if (match.dsOwnRun) {
      const ifFlightRun = match.ifFlightRun;
      const ifLastSeenOwner = match.ifLastSeenOwnerGid;
```

### The insertion, VERBATIM (`src/ai/PlayerBrain.ts`, `decideOffBall`'s in-possession branch)

```ts
        const ifSawOwner = ifFlightRun && ownerGid !== null;
        const ifLastSeenGid = ifSawOwner
          ? (ifLastSeenOwner.set(p.gid, ownerGid), ownerGid)
          : (ifFlightRun ? (ifLastSeenOwner.get(p.gid) ?? null) : null);
        let ifMateRemembered = false;
        for (const mate of team.players) {
          ifMateRemembered = ifMateRemembered || mate.gid === ifLastSeenGid;
        }
        const ifOntoFlight = ifFlightRun && seenBall !== null && ownerGid === null
          && ifLastSeenGid !== null && ifLastSeenGid !== p.gid && ifMateRemembered;
        carrierIsMate = carrierIsMate || ifOntoFlight;
```

…and, immediately after the shipped push:

```ts
          const ifCand = cands[cands.length - 1];
          ifCand.why = ifOntoFlight ? 'own run onto the flight' : ifCand.why;
```

### ⭐ PURELY ADDITIVE, WHOLE-FILE

`git diff --stat` over the three changed files is **90 insertions, 0 deletions** at the
IF-T0-FIX commit (**89 / 0** at `d0f4a79`, before the FIX's one extra comment line), and the
stripped diff of `src/ai/PlayerBrain.ts` against the dispatch head `595a555` is STILL a PURE
INSERTION in three hunks (`2213a2214,2222` · `2228a2238,2263` · `2259a2295,2300`; at `d0f4a79`
the first hunk read `2212a2213,2220`): not one shipped statement is deleted, reordered,
reworded **or re-indented** — the FIX moved only this seam's OWN alias lines, which are
insertions on both sides of the comparison. §DEVIATIONS 1 explains the form that bought that. With the door shut the seventh-literal path runs byte for byte,
which the five recorded OFF digests measure.

### Untouched (restated as a prohibition)

⛔ `src/ai/perceptionSnapshot.ts` · ⛔ `src/ai/TeamBrain.ts` · ⛔ `src/ai/offballEyes.ts` ·
⛔ `src/ai/actionExecutor.ts` · ⛔ `src/sim/mechanics.ts` · ⛔ `src/game/a4World.ts` — each
pinned at ZERO occurrences of both needles. No world, no preset, no env door, no bundle
default arms this flag; `League.toJSON` omits it.

---

## §PINS — the pin inventory (`tests/ifFlightRun.test.ts`, **38** `it()`s, ALL GREEN on x64)

| # | pin | what it catches |
| --- | --- | --- |
| **F0** | ⭐ **THE INTENDED-RECEIVER FIXTURE, the suite's FIRST** (canon "walk-side definitions pinned", FIFTH strike — #416 item 3(i)): with `pendingPass.targetGid === p.gid` held IDENTICAL, a **FIRING** case (his memory holds a mate ⇒ the EIGHTH `why`, the seventh NOT also pushed, exactly ONE `MakeRun` candidate) and three **NON-FIRING** cases (the memory holds an OPPONENT · the memory is EMPTY · the memory holds HIMSELF), plus the same scene with the door SHUT | an unfixtured predicate; a seam that reads the pass instead of the belief |
| **F1** | **G-OFF, ARCH-KEYED** — the door absent ⇒ whole-match signatures (rng draw included) on the twelve seeds 900,007,400–411 digest to the literals of this architecture's column: x64 bare `43d4174d…1d16`, w13 `796b13a3…93f0`, w15 `7b5fcd1b…f805`, w16 `4ca9ac54…cfa0`, w17 `6b5ecaa3…971d`, all RECORDED at `595a555` in a clean throwaway worktree; arm64 bare `a81e4054…0245`, w13 `d7b9b9e6…2f88`, w15 `1c959b52…b9b5`, w16 `2b78c8a9…4b61`, INHERITED BY IDENTITY from `tests/dsCoopHatsOff.test.ts` (same seeds, same `signatureOf`, same pooling digest, worlds byte-identical since `f1a46b1`) and **ABSENT for world 17** (that pin skips on arm64, by title). Plus ABSENT ≡ EXPLICITLY FALSE (bare AND world 17) and the arch-keyed fingerprint | any leak of the seam into a shipped world; a non-additive edit; a guessed arm64 number |
| **F2** | **THE BELIEF** — over WHOLE matches on worlds 16 and 17, four seeds each: door absent ⇒ `ifLastSeenOwnerGid.size` **0** and zero eighth-why decisions, with the seventh > 0 on the same seeds (non-vacuity); door armed ⇒ size > 0 | a belief written outside the door; a vacuous measurement |
| **F3** | **ARMED** — worlds 16 and 17 + the door: the EIGHTH `why` appears in `p.action.scores` AND the SEVENTH still appears | a state that swallowed the other; a door that does nothing |
| **F4** | **CONTAINED** — the door on the BARE world and on world 13 (no `dsOwnRun`): ZERO eighth-why decisions, ZERO seventh, the belief still EMPTY, on four seeds each | the door escaping its fork |
| **F5** | **THE PULL** — the DS-T1c spied-vs-unspied idiom, four arms, > 100 subjects each: `0 · 0 · 1 · 1` | a second percept pull |
| **F6** | **THE READ SET** — source needles over the WHOLE seam span (the two aliases through the fork's closing brace): `pendingPass` · `match.ball` · `ball.owner` · `lastTouch` · `info.genome` · `pendingPassWindup` · `opp.` · `allPlayers` · `dist(` · `topSpeed` each **0**; `match.perceivedSnapshot` exactly **1** in the span and **3** in the file; the seam's own lines carry NO `<`/`>` and exactly ONE numeric literal (`1`); one `.set(` site and one `.get(` site in all of `src/**` | a truth read; a second pull; a #200 predicate |
| **F7** | **THE SEAM MAP** — per-file executable-line occurrence counts, **paths normalized to `/`** (#418 item 2(iv)): `ifFlightRun` = `Match.ts` 4 · `League.ts` 1 · `PlayerBrain.ts` 5 · every other file 0; `ifLastSeenOwnerGid` = `Match.ts` 2 · `PlayerBrain.ts` 1 · every other file 0; `a4World.ts` names NEITHER; the ONLY assignment in `src/**` is the constructor's init; `ifFlightRun: true` appears NOWHERE; no world 1–17 carries it; the union grew by EXACTLY one; the map is created empty in the constructor and never cleared | a second fork; a flag reaching a world; a backslash-vs-slash red |
| **F8** | **THE LITERALS** — the SIX census literals byte-unchanged, the SEVENTH exactly once and its push statement byte-identical, the EIGHTH exactly once and in `PlayerBrain.ts` only, and the `MakeRun` push count still the **6** of record (the eighth is a RELABEL, not a second push) | a re-typed literal; a smuggled second candidate |
| **F9** | **THE MUTANT WALK** — four mutants at RUNTIME and at SOURCE, each APPLIED to the file and observed to die (table below); M4's divergence seed **900,008,260** — the FIRST of the scan band 900,008,260–271, RE-DERIVED by the pin (#419 item 4(ii): EVERY seed in that band diverges, so the scan REPRODUCES the stored seed rather than selecting it) | each named mutant |
| **F10** | **THE NARROWS AND THE BANDS** — the DS seam maps re-asserted; the percept trunk, the OBM seat, the executor, `mechanics.ts` and `TeamBrain.ts` at zero; every seed derived from the ONE declared `BASE = 900_008_200` and inside `BASE … BASE+99`, with G-OFF's declared exception asserted inside `900,007,400 … 411` | a pin that quietly stopped meaning anything; a scratch walk outside the band |

**THE MUTANT WALK, OBSERVED (not predicted).** Each mutant was applied to
`src/ai/PlayerBrain.ts` in place, this seam's whole file re-run, and the original restored and
sha256-verified before the next:

| mutant | outcome | killed by |
| --- | --- | --- |
| **M1** the FLIGHT clause dropped (`seenBall !== null && ownerGid === null` removed from the state) | **5 pins RED** | F0's firing fixture (the eighth no longer exclusive — the seventh's own state now takes the eighth label), F3 on BOTH worlds (the seventh stops appearing at all), F6's #200 pin, M1's own pin |
| **M2** the belief NEVER WRITTEN (`.set(p.gid, ownerGid)` dropped from the ternary) | **8 pins RED** | F0's firing fixture and TWO of its non-firing fixtures (the memory is never there to be read), F3 on both worlds, F6's write-site pin, M1's and M2's own pins |
| **M3** the door read INVERTED **at the alias line** — now the fork's FIRST statement (#419 item 2): `      const ifFlightRun = match.ifFlightRun;` → `      const ifFlightRun = !match.ifFlightRun;` | **THE SUITE REFUSES TO RUN** — the seam-span anchor (that same line) does not resolve, collection fails, all 38 pins unavailable (canon "mutant liveness": home ruling #268.3(a)) | the seam-span anchor itself |
| **M3′** the SAME inversion applied SURGICALLY INSIDE the seam, the anchor line left intact, so the kill is enumerable. ⭐ **THE EXACT MUTATION (#419 item 4(iii)) — three replacements, the door's three reads, nothing else:** (1) `const ifSawOwner = ifFlightRun && ownerGid !== null;` → `const ifSawOwner = !ifFlightRun && ownerGid !== null;`; (2) `: (ifFlightRun ? (ifLastSeenOwner.get(p.gid) ?? null) : null);` → `: (!ifFlightRun ? (ifLastSeenOwner.get(p.gid) ?? null) : null);`; (3) `const ifOntoFlight = ifFlightRun && seenBall !== null && ownerGid === null` → `const ifOntoFlight = !ifFlightRun && seenBall !== null && ownerGid === null` | **15 pins RED** — RE-MEASURED at the IF-T0-FIX head with the aliases inside the fork (applied in place, the whole file re-run, the original restored and sha256-verified: `faf99a22…b0b`) | all four F0 fixtures INCLUDING "the flag ABSENT ⇒ nothing fires and nothing is written", **G-OFF on worlds 16 and 17** (the inverted door makes the SHUT world fire), F2's empty-belief count on BOTH worlds, F3 on both worlds, TWO F6 pins (the #200 identity-test pin and the belief's write/read-site pin), and the M1/M2/M3 pins. ⚠ This is the VERIFIER's broader form of #419 item 1(f). The executor's narrower 13-pin variant (G-OFF left green) had no exact text in the report, so the reproducible form is the one recorded here |
| **M4** the last-owner test reading TRUTH (`match.ball.owner` in place of his own entry) | **6 pins RED** | THREE non-firing fixtures of F0, F6's truth-read needle scan, F6's read-site pin, and M4's own pin — which RE-DERIVES the stored divergence seed **900,008,260** (**4,741** diverging evaluations in the first 3,000 ticks of world 16 armed). ⚠ **#419 item 4(ii), corrected:** EVERY seed in the scan band 900,008,260–271 diverges (12 / 12, verifier-re-derived: 4,741 · 5,638 · 4,755 · 6,743 · 7,814 · 7,324 · 5,190 · 7,231 · 6,170 · 4,621 · 5,529 · 5,779), so the stored seed is simply the band's FIRST and its 4,741 REPRODUCES — the scan does not SELECT it |

**NARROWS OF RECORD (every one listed, all POSITIVE):**

(a) ⭐ **`tests/dsOwnRun.test.ts` — TWO pins narrowed, and nothing else in that file** (the
FIRST at `d0f4a79` under #417 item 3; the SECOND and LAST at the IF-T0-FIX under #419 item 2,
below). DS-T0c's
"the seventh literal is still the only one this seam adds" becomes **"the EIGHTH literal joined
the menu and the SEVEN before it are unchanged"**: the seventh still exactly once in the `why:`
menu, the `MakeRun` push count still **6**, the eighth exactly once and NOT in the `why:` menu
(it is a relabel), and the shipped push statement asserted byte-for-byte. The DS-T0b TWIN of
that pin (its assertions are all still TRUE — only its TITLE is now understated) was left
BYTE-UNCHANGED, because the dispatch authorises one narrow in that file and no more; it is
named here so the next reader does not mistake it for drift.
(b) ⭐ **THE DS-T0c MEMBER-SET PIN, NARROWED POSITIVELY 3 → 5 (#419 item 2 — the SECOND and
LAST authorised narrow in that file).** With the two aliases now INSIDE the fork, the block's
true `match` read set is FIVE members, and the pin says so in the pin's own sorted order:
`match.dsOwnRun` · `match.ifFlightRun` · `match.ifLastSeenOwnerGid` · `match.perceivedSnapshot`
· `match.simTime`, retitled to match. ⛔ A pin whose assertion passes while its title is false
is exactly what canon forbids; the aliases were moved so the honest pin could be written, not
the other way round. The fork's OTHER frozen DS-T0c pins — the enumerated conditional set (ten
`if`s), the inequality set (two lines), the `.pos` / `.vel` / `mate.` / `body.` read sets and
the banned-needle list — are byte-UNCHANGED and PASS unchanged at this commit, MEASURED: the
seam is written as expressions, so it adds no `if` and no `<`/`>`. F6/F7 carry the same read
set positively on the seam-span side.
(c) **`tests/dsCoopHatsOff.test.ts` IS UNCHANGED AND ITS `MakeRun`-count pin STILL HOLDS** (6),
because the eighth `why` adds no push. Checked, not assumed.

---

## §GATES and the RUN OF RECORD

| gate | predicate | result |
| --- | --- | --- |
| **G-OFF** | the five x64 digests recorded at `595a555` reproduce (bare · 13 · 15 · 16 · 17); ABSENT ≡ EXPLICITLY FALSE | ✅ |
| **G-FP** | the fingerprint of this architecture (`59f42aa7…a072d`) recomputed in-process | ✅ |
| **G-FIXTURE** | the intended-receiver predicate FIXTURED, firing and non-firing | ✅ |
| **G-ARMED** | the eighth `why` observed on worlds 16 and 17 with the door; the seventh still observed | ✅ |
| **G-CONTAINED** | the door alone (bare · 13) produces zero eighth-why decisions and an EMPTY belief | ✅ |
| **G-PULL** | `0 · 0 · 1 · 1` | ✅ |
| **G-MAP** | the seam map, the gate literals, Road B, the union, paths normalized to `/` | ✅ |
| **G-MUTANT** | four mutants applied at source, each observed to die | ✅ |
| **G-SUITE** | `tsc --noEmit` clean; the new suite **38/38** on x64; the FULL suite SERIAL (`NO_COLOR=1 npx vitest run --no-file-parallelism`) **2,354 / 2,411 green, 57 red in 36 files** — and those 57 are a strict SUBSET of ruling #418 item 3's inventory, matched class by class (A 35 · C 20 · B 1 · D 1), with **ZERO reds outside it**. Two inventory entries did NOT recur on this run (`careers.test.ts` and `simRunner.test.ts`, class D host timeouts) | ✅ |

---

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⭐⭐ **THE EIGHTH `why` IS A RELABEL OF THE SHIPPED CANDIDATE, NOT A SECOND PUSH — AND THAT
   IS WHAT MAKES THE EDIT A PURE INSERTION.** The dispatch asks for "the SAME candidate at the
   SAME score" with "the `why` chosen by which state held", AND for the shipped seventh-literal
   path to be byte-unchanged with no statement reworded. Writing the choice INTO the push
   (`why: ifOntoFlight ? … : …`) would have REWORDED a shipped statement; adding a second
   `cands.push({ action: 'MakeRun', … })` would have moved the `MakeRun` push count off the 6
   of record and reddened a pin in `tests/dsCoopHatsOff.test.ts`, which this dispatch does not
   authorise editing. The form chosen satisfies all three: the shipped push keeps every byte,
   the count stays 6, and the candidate it pushed is relabelled in the next statement. The
   relabel reads `cands[cands.length - 1]` — the statement immediately above it — and with the
   door shut it is a self-assignment.
2. ⭐⭐ **THE DOOR AND THE BELIEF ARE ALIASED INSIDE THE FORK, FROM THE FIX; THE DS-T0c
   MEMBER-SET PIN NARROWED 3 → 5 (POSITIVE, #419 item 2).** `const ifFlightRun =
   match.ifFlightRun;` and `const ifLastSeenOwner = match.ifLastSeenOwnerGid;` are the FIRST
   two statements inside `if (match.dsOwnRun) {`, which is M-IF.4's placement: both property
   reads execute ONLY under `dsOwnRun`. HISTORY, PLAINLY: at `d0f4a79` they sat one line ABOVE
   the fork so that DS-T0c's frozen pin "the ONLY `match` members the block touches are the
   flag, the clock and the percept" would stay green without being edited — the behaviour was
   contained and measured, but the pin's TITLE was then false about a set it enumerates, and
   #419 item 2 NOT ACCEPTED that. The honest repair is this one: the aliases moved in and the
   pin was NARROWED POSITIVELY to the true five members (§PINS "NARROWS OF RECORD" (b)) — the
   file's SECOND and LAST authorised narrow. The fork's other frozen pins (the conditional set,
   the inequality set) are untouched and pass unchanged; the seam adds no `if` and no `<`/`>`.
   The five OFF digests cannot move, because the OFF world never enters the fork — re-measured
   at the FIX.
3. **THE G-OFF SEED BAND IS DS-T0d'S, NOT THIS STAGE'S** — ruling #418 item 5(i)'s own
   instruction: G-OFF walks 900,007,400–411 so that the arm64 column can be INHERITED BY
   IDENTITY from `tests/dsCoopHatsOff.test.ts` (same seeds, same recipe). Every OTHER walk in
   the suite lives in this stage's band 900,008,200–299, derived from the ONE declared `BASE`,
   with a pin of its own asserting both bands. Verifier band 900,008,300–399 reserved.
   **Frontier: ZERO consumption. Stats: ZERO.**
4. ⚠⚠ **SIX FROZEN PROBES HASH `decideOffBall` WHOLE AND READ RED FROM THIS COMMIT, AND NONE
   WAS EDITED** — §HONESTY 4, where what survives (every single-line anchor, measured) and what
   reddens (the one hashed span) are separated.
5. **NO RE-INDENT OF ANY SHIPPED LINE.** The dispatch permits one if declared; none was
   needed — the insertion adds statements at the existing nesting and wraps nothing. ⚠ The FIX
   moves the two alias lines one nesting level deeper (four spaces → six), but they are THIS
   seam's own inserted lines, not shipped ones: the whole-file stripped diff against `595a555`
   is still a pure insertion, re-proved at the FIX (90 / 0 over the three files, three `a`
   hunks in `PlayerBrain.ts`).
6. ⚠ **M3'S PRIMARY FORM KILLS BY REFUSING TO RUN, AND A SECOND FORM WAS WALKED SO THE KILL
   COULD BE COUNTED.** Inverting the door at the ALIAS line destroys the seam-span anchor, so
   the suite fails at COLLECTION and no pin reports — an honest kill in the canon
   "mutant liveness" sense, but not an enumerable one. M3′ (the same inversion applied inside
   the seam, the anchor intact) was therefore walked as well. ⭐ #419 item 4(iii): M3′'s EXACT
   mutation text now sits in the table, and the row carries the form that was RE-MEASURED at
   the IF-T0-FIX head — the verifier's broader three-site inversion, **15 pins RED**. The
   executor's narrower 13-pin variant at `d0f4a79` (which left G-OFF green) was reported
   WITHOUT its text and is therefore not reproducible; it is named, not carried. Both M3
   forms are in the table; neither was predicted.
7. **THE BELIEF'S VALUE TYPE IS `number | null`, AS THE CONTRACT WRITES IT**
   (`Map<gid, gid | null>`), although the only value the seam ever writes is a non-null `gid`.
   The `null` arm is the contract's text, kept rather than narrowed; `.get()` is read through
   `?? null`, so an ABSENT entry and a null entry are the same answer to the state test.
8. **`p.action.scores` HOLDS THE TOP FOUR CANDIDATES** (the DS-T0d §DEVIATIONS-D 6 fact,
   inherited). F3's "the eighth appears" is therefore a statement about the RECORDED menu; F0's
   fixtures read the same menu at a staged decision, and F2's zero counts read it with the door
   shut, which is the direction that matters for dormancy.
9. **THE COMMIT SITS ON `main`, UNPUSHED, AND THAT IS THE PROGRAMME'S CONVENTION, NOT A
   DEVIATION** (#419 item 0, entered here so §DEVIATIONS matches the executor report one to
   one): rulings and stage commits share the line the USER pushes, so the executor's own
   branch-first habit does not apply on this programme. `d0f4a79` sits above the dispatch head
   `595a555`, the #419 ruling commit above it, and the IF-T0-FIX commit above that. Nothing is
   pushed by the executor; the user pushes.
