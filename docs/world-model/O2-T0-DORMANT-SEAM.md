# O2 T0 — the DORMANT LOOK seam (`o2Look`, 抬头观察)

Status: **PRE-REGISTERED 2026-08-08, then BUILT + RUN the same round.** The seam
semantics, the FROZEN look interval with its traced constant family, the gates and
the Road B statement below were written **before** the receipts ran (the
frozen-before-sight rule, the O1-T1 / C7-T1 two-part form); the measured numbers
arrive only in [§RESULT](#result--the-gates-run) at the foot.

Authority chain: contract [`O2-LOOK-CONTRACT.md`](O2-LOOK-CONTRACT.md) — §2
**M-O2.1** (the LOOK moment: a bounded interval, the plant idiom, the percept
refresh, epistemic honesty) · **M-O2.2** (the price is REAL TICKS, I1 NO FREE
TIME, no score subsidy) · **M-O2.3** (the trigger is a DECISION on the percept
path, born incumbent-equivalent, instruments may force it) · **M-O2.4** (the
whether seat is the CONSUMER; the certified price table is UNTOUCHED) · §3 the
**O2-T0** clause · §4 the non-claims. Parent
[`OUTLET-CONTRACT.md`](OUTLET-CONTRACT.md) §3 invariants INHERITED: I1 NO FREE
TIME · NO DOUBLE-CHARGE · **FLAG HYGIENE** (explicit boolean, never
`EDS_BUNDLE_ARMED`, never env-armed, never in the a4 bundle) · **EPISTEMIC
HONESTY** (percepts only, never truth scans) · Road B until a play-test verdict.
Ruling **#193.2** (this dispatch, in every detail: hard-false flag, never
bundle-defaulted, flag-off byte-identity + fingerprint, the **#181.2** standing
receipt rule, RNG-stream identity if any draw is added). The O1-T1 dormant seam
([`O1-T1-PASS-WINDUP.md`](O1-T1-PASS-WINDUP.md)) is the FORM this document and its
receipts follow.

Banked evidence this stage stands on: [`O2-OPENING-SIZING.md`](O2-OPENING-SIZING.md)
(#186 — the perception wedge STILL BINDS in the O1-armed world, 7.88× [5.15, 27.5]
armed vs 14.8× baseline, E-ABSTAIN-UNSEEN ≈69% both arms), and the whether seat
itself ([`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md)), which this seam feeds
and does not touch.

---

## §LAW — the FROZEN look interval, and where the number comes from

```text
O2_LOOK_TICKS = round(C7_W_CAP · 60) = round(0.18 · 60) = 11 ticks = 0.18333 s
```

**Traced, not invented.** `C7_W_CAP = 0.18` s is the C7 §LAW wind-up CEILING —
`src/sim/Match.ts:141` (`const C7_W_CAP = 0.18; // T0 §5 MID W_CAP (11 ticks; ≪
the 0.33 s median spell)`), a T0 MID-bracket derivation certified end-to-end by
C7-T1 and re-used verbatim by O1-T1's pass wind-up. The `round(W · 60)` tick
conversion is the law's own (`c7WindupTicks`, `src/sim/Match.ts:146-151`), and 11
is also exactly the upper end of the `[3,11]` clamp that function already
enforces (`src/sim/Match.ts:151`). The constant is **derived in code from
`C7_W_CAP`**, not typed as a literal (`src/sim/Match.ts`, `export const
O2_LOOK_TICKS = Math.round(C7_W_CAP * 60)`), so it cannot drift away from the
family it was taken from.

**Why the CEILING of that family and not its middle.** The contract names the C7
wind-up scale as the LOOK's natural neighbour and requires a frozen number from
it. Of that family's frozen values — floor 0.05 s (3 ticks), cap 0.18 s (11
ticks) — the cap is the one that is a *deliberate act's* price: a look is a
chosen pause, so it is priced at the most a certified release pause can cost, not
at the least. The alternative candidates were the O1-T1 §RESULT *measured* p50
(6 ticks) and mean (6.34 ticks); both were rejected because they are measured
STATISTICS of a different population, not frozen constants, and freezing a
statistic would be a new lever wearing a traced number's clothes. **No new
constant is introduced by this slice**, and the plant's walking pace (`speedF =
0.22`) is likewise the C7/O1 plant's own value, cited at its use site.

Sizing honesty, stated up front: 11 ticks is **0.183 s**, against a measured
median reception-to-release of 0.33 s (#173/O1 phase-0). A look is therefore a
real but small bite out of a possession — roughly half a median touch. Whether
that is enough time to move the perceived-vs-true wedge is **exactly O2-T1's
question**, and this stage pre-commits to NOT re-cutting the interval to make T1
succeed: if T1 needs a different interval, that is a fork for the commander with
the numbers, not a quiet re-freeze.

## §SEAM — the mechanism (all of it behind `o2Look`)

### The flag

* **`o2Look`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.o2Look ?? false` — a **hard `false`**, the `c7Windup` / `o1PassWindup`
  form. **Never** `EDS_BUNDLE_ARMED`, never env-armed, never default-ON, and —
  the #193.2 clause — **never bundle-defaulted**: it is absent from
  `src/game/a4World.ts` entirely (`A4_WORLD_FLAGS` and every `a4MatchFlags(v)`
  version), so no play-test world, preset or env bundle can turn it on. It gets
  its own `League.matchFlags` key (the O1 idiom, `src/sim/League.ts:282`) so a
  probe world can arm it EXPLICITLY, and that key changes no default (an unarmed
  league builds the identical shipped match).

### The trigger — a DECISION, born incumbent-equivalent (M-O2.3)

`src/ai/lookSeat.ts`, a small pure module beside `whetherEye.ts`:

* `o2LookEligible(p, match, topAction, mustKick)` — the eligible-LOOK predicate.
  It is the C5-T2 whether fork's OWN eligible-choice predicate, deliberately
  identical (settled control · not a forced release · A0 not `Shoot`/`ClearBall`
  · not a keeper · `firstTouchWindow <= 0`, i.e. **not in a one-touch window**),
  PLUS the two the contract adds in its own words: he must **own the ball**, and
  no look may be stacked on a live one.
* `o2LookDecision(p, match)` — today it returns `take: false` for everybody
  unless an **instrument** names the body (`Match.forcedLook`, the `forcedHold`
  idiom verbatim, null in every production path). **This is what "born
  incumbent-equivalent" means and it is GATED, not asserted**: an armed world
  with no instrument is byte-identical to the OFF world on every receipt seed
  (§GATES G-BORN). The gene/attr expression is a LATER slice's work (the
  #148-family idiom: born equivalent, differentiation earned); this module is the
  seat it will sit in and nothing more. **Instruments force; ships never do.**

The fork sits in `src/ai/PlayerBrain.ts` **immediately before the C5-T2 whether
fork**, after `cands` are sorted (so A0 = `top` is known) and before the pass
chooser and the action commit — 抬头观察 is what a player does BEFORE he judges,
and the seat that consumes the refreshed reading (M-O2.4) is the very next block.
Exactly ONE call site in `src/**` (`match.armO2Look(p)`), pinned by a test.

### The LOOK itself — what is actually refreshed, and what is NOT

`Match.armO2Look(p)` opens `o2LookWindow = { gid, startTick, untilTick =
startTick + O2_LOOK_TICKS }` and records **one scan moment immediately**;
`Match.stepO2Look()` runs at the head of every tick (beside the C7 and O1 resolve
calls, before any brain runs) and records **one more scan moment per tick** until
the window closes.

A "scan moment" is `recordScanFrame` — the E3R2 recorder the ORDINARY scan clock
already uses (`Match.refreshPerception`; the two now share one private helper,
`recordObserverScanFrame`, pure code motion). The look therefore changes exactly
one thing: the **CADENCE** at which this body's eyes are open (ordinarily every
`round(15 − awareness·9)` = 6–15 ticks; during a look, every tick). Everything
else is the shipped perception trunk:

* the frames are replayed by `reconstructBodyMemory` through
  **`visibleDistance`** — same cone, same range `18 + awareness·22`, same
  near-field 4 m felt/heard rule, same facing test `>= −0.2 − awareness·0.5`;
* the observation error is the same keyed-noise channels at the same amplitudes
  (`writeObservation`), which is why **no rng is drawn anywhere in this seam**;
* **heading-gating is SUPPORTED and is what the seam relies on**: each recorded
  frame carries the body's own `bodyDir` at that tick, and the replay applies the
  cone to it. What is behind him stays behind him unless he turns. The percept
  layer needed no change for this — the M-O2.1 fallback ("else staleness-reset
  only, stated honestly") was **not** needed.

**Honesty limits, stated plainly (all of them):**

1. **He does not choose WHERE to look.** The plant writes no `faceTarget` (the
   C7/O1 plants do, because they aim at a committed target; a look has none).
   Choosing a look DIRECTION would be a new lever and, unearned, a new
   information channel. So the look sharpens what his CURRENT heading covers,
   nothing more. A body facing his own goal learns nothing new about what is
   behind him — correct, and a real limit on how much wedge this can close.
2. **STALE is not refreshed, because it is not a percept.** The whether seat's
   `staleBand` reads `match.teams[side].staleTime`, the body's own possession
   clock (`whetherEye.ts:135`) — his own truth, not a reading of others.
   Looking cannot improve it; it can only make it WORSE, because the clock runs
   while he stands there. That is the price working as designed (M-O2.2), and it
   means the look moves **pressure** and **support** toward truth while pushing
   **staleness** the other way. T1 must read the wedge with that in mind.
3. **Scan-frame ring pressure (disclosed, flag-on only).** `SCAN_FRAME_RING = 16`
   is sized on the comment's premise that "at most 11 scan frames can be inside
   retention" (`Match.ts:81`). A look records 11 frames in 11 ticks, so a looker
   can briefly hold more in-retention frames than the ring, and the OLDEST may be
   overwritten before being replayed. Memory records persist across pulls, so in
   practice an evicted frame has usually already been written; but a body who
   goes a whole look without any consumer pulling his snapshot can lose the
   replay of one or two pre-look moments. Direction of the effect: he keeps the
   FRESH observations and may drop STALE ones — nothing is fabricated. The ring
   is **left untouched** at T0 (it is a certified constant, and changing it is
   not this step's business); T1 should measure whether it matters.
4. **The refresh only exists where the percept trunk is alive.** Body memories
   are built by `refreshPerception`, which runs only when
   `edsPerceivedDefence || edsPerceivedChoice || stationEye !== null`. In a bare
   production-shaped world the look still records frames and still costs its
   ticks, but there is no memory for anyone to read. Every whether-seat world has
   the trunk armed, so this is a statement about scope, not a defect.

### The price — REAL TICKS, and nothing else (M-O2.2, I1)

* **The re-decide lock.** While the window is live and he still owns the ball,
  `decidePlayer` returns immediately — a THIRD, separate lock block, so the C7
  and O1 lock blocks stay byte-identical. He does not pass, shoot, clear or
  re-plan for `O2_LOOK_TICKS` ticks. The lock lapses the instant he loses the
  ball, exactly as C7's and O1's do.
* **The plant.** `src/ai/actionExecutor.ts` holds his movement target on his own
  spot at `speedF = 0.22` (the C7/O1 plant's own value) — the carry slows to a
  standstill-pace while pressure closes. The action keeps the incumbent
  `Dribble` label: **no new action type at T0** (the readable body cue is the
  contract §3 exit item, T2+).
* **No subsidy anywhere.** The seam adds no score term, no bonus, no protection.
  It writes no `ball.owner`, no `kickCooldown`, no `firstTouchWindow`, no
  stamina relief; it does not touch `pressureAt`, `oneTouchMul`,
  `kickMisalignment` or any price chain. Cost = exposure, which is the currency
  the #65-family census prices.

### Bail conditions (each an EXISTING channel; no new attack surface)

`ball.owner !== looker` (→ `abortedLoss`) · `phase !== 'playing'` · `sentOff` ·
`stunTimer > 0` · `role === 'GK'` (→ `abortedPhase`) · expiry at `untilTick`
(→ `completed`). Every armed look lands in exactly one class; the in-engine
ledger (`Match.o2LookLedger`, the #180.3(ii) precedent — accounting lives in the
engine, not in a probe wrapper) counts them and is **read by nothing in the sim**.

### The consumer (M-O2.4)

`src/ai/whetherEye.ts` is **not touched by one character** (pinned by a test).
The refreshed reading reaches it automatically, because the seat already pulls
`match.perceivedSnapshot(p)` and that pull already reconstructs from the recorded
scan moments. **The certified price table is untouched**; no cell, no cut, no
`reachesZero` test is changed; the re-census is O3's gate, not this slice's.

### Untouched (restated as a prohibition)

`pendingKick` / `pendingPassWindup` and every C7/O1 consumer · `forcedHold`,
`whetherEye`, `whetherHoldState` and the ShieldHold executor case · the certified
re-census table and every band cut · `perceptionSnapshot.ts`'s honesty rules
(cone, error channels, retention) · `SCAN_FRAME_RING` · `AI_INTERVAL` ·
`KICK_COOLDOWN` / `firstTouchWindow` / `oneTouchMul` semantics · `a4World.ts`'s
flag set and all three play-test worlds · the mark-selection surfaces S1–S6
(#193.1 DEFER stands).

---

## §GATES — frozen ex ante (the O1-T1 form)

| gate | predicate | kind |
| --- | --- | --- |
| **G-IDENT** | with `o2Look` absent, the 2-season league hash on **3 league seeds** equals the frozen pre-change baselines — **1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26`** — **all three RECOMPUTED IN-PROBE** and written to the committed artifact (#181.2: no doc-typed hash is evidence) | HARD |
| **G-FP** | the 1337 row IS the production fingerprint; `npm run fingerprint` prints it unchanged | HARD |
| **G-OFF** | per-match whole-run signature, **including the rng stream state**: flag ABSENT ≡ flag FALSE, in BOTH the production-shaped world and the percept-armed world, on every receipt seed. **RNG-stream identity**: any new draw on the flag-off path would move `rng.s` and fail this gate | HARD |
| **G-BORN** | ARMED with `forcedLook` null ≡ OFF on every receipt seed (M-O2.3 born incumbent-equivalent — proved, not asserted) | HARD |
| **G-BITE** | forced, the seam is REACHED (looks > 0, scans > 0) and the world DIVERGES — G-OFF/G-BORN are not the identity of dead code | HARD |
| **G-LEN** | every **completed** window is exactly `O2_LOOK_TICKS` ticks; no window exceeds it; zero windows close unexplained; and `O2_LOOK_TICKS === round(C7_W_CAP · 60) === 11` | HARD |
| **G-SCAN** | the ledger closes per match: `looks === completed + abortedLoss + abortedPhase` (no live window at match end) | HARD |
| **G-OWN** | the seam never releases ownership: it writes `ball.owner` nowhere, and every window tick with the ball elsewhere is aborted at the very next head-of-tick (`staleOwnerTicks === abortedLoss`) | HARD |
| **G-RNG** | `armO2Look` draws **zero** rng (exact state compare on a stepped fixture) and its body contains no price term (`pressureAt` / `oneTouchMul` / `orientation*Mul` / `gaussian`) | HARD |
| **G-HYGIENE** | `o2Look` is absent from `a4World.ts`, from `A4_WORLD_FLAGS` and from `a4MatchFlags(1|2|3)`; initialised `?? false`; no `envArmed` | HARD |
| **G-SEED** | seed-block disjointness proved in-probe against every consumed A4/O-arc block | HARD |
| **G-DET** | the receipts core runs **twice**, byte-identical digests | HARD |
| **G-SUITE** | full `npm test` green, `tsc --noEmit` clean | HARD |
| **REPORTED** | the look census (windows, lengths, abort mix, scans per look) and a percept-freshness reading. Descriptive, smoke scale, no control, no CI claim — a reading for the commander, never a licence to re-cut the interval or the trigger | REPORTED |

**Pre-named FAIL ⇒ STOP** (the #179 red lines): any HARD gate failing, any src
diff outside the seam path, any rng draw appearing on the flag-off path, or a
structural collision with the C7/O1 wind-up forms.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| A4/O-arc consumed through | 12,310,999 (far-side forensic reserved 12,310,200–999 in full) | prior |
| **O2-T0 receipts (this stage)** | **12,311,000 – 12,311,023** (24 seeds × 6 arms) + **12,311,024** (the REPORTED freshness read) | **CONSUMED here** |
| free above | 12,311,025 + | available to O2-T1 |

Disjointness from every listed consumed block is computed **in-probe**
(`gates.seedDisjoint`), not asserted here.

## §ROAD B — nothing ships

`o2Look` is **OFF in every production path**: a hard `false` default, absent from
`a4World.ts` and from all three play-test worlds, absent from every League's
`matchFlags` unless a probe sets it explicitly — and even ARMED it does nothing
without an instrument (G-BORN). The production fingerprint is unchanged, and the
flag-off world is byte-identical on three league seeds and on every receipt match
seed, rng stream included. **Nothing about the game the user plays changes in this
commit.** The seam exists so O2-T1 can force it.

## §NON-CLAIMS

O2-T0 claims **no** football effect and **no** epistemic effect size: not on the
perceived-vs-true wedge, not on E-ABSTAIN-UNSEEN, not on hold rate, tempo,
retention or the equilibrium band. The REPORTED freshness reading is one
uncontrolled descriptive number and adjudicates nothing — F-O2a (the wedge does
not close ⇒ the perception trunk needs different surgery, STOP) and F-O2b (the
look becomes a free option) are **T1's** to fire. It does not change the certified
price table (O3's re-census), does not touch off-ball scanning (the station eye's
business), adds no gene, no attribute, no new action type, no render cue, no
coach rung, and no offside work. It does not claim the frozen interval is the
RIGHT interval — only that it is traced, frozen before sight, and unre-cut. It
cannot authorize O2-T1; only the commander can.

---

## §RESULT — the gates run

*(filled in from the committed artifact after the receipts ran; every number here
is quoted FROM `docs/world-model/data/o2-t0-look-seam.json`, which is recomputed
by `npx tsx scripts/probes/o2-t0-look-seam.ts` — the doc never carries evidence
the artifact does not.)*

Implementation at working HEAD `9abf43b` + this commit's seam. Tests:
[`../../tests/o2Look.test.ts`](../../tests/o2Look.test.ts) (11 pins). Receipts:
[`../../scripts/probes/o2-t0-look-seam.ts`](../../scripts/probes/o2-t0-look-seam.ts),
artifact [`data/o2-t0-look-seam.json`](data/o2-t0-look-seam.json).
**24 seeds × 6 arms (absent · off · plain · plainOff · bornArmed · forced-armed)
= 144 full matches per core run, and the core runs TWICE (G-DET, byte-identical
digests), plus 3 league-seed 2-season identity runs and the 2 REPORTED freshness
matches on seed 12,311,024.** Verdict: **GATES PASS.** Wall ≈ 57 s
(CONTEXT ONLY — used in no rate).

* **G-DET digest** `88aef330c95440413bb1c047bcd9244021880db9db8c04662d758a0d7140bb4e`
* **resultSha256** `c19afe60406887cd79d052aa49802528ff9d44a212b4f592902174d06d3419cc`
* `git diff --stat -- src` (context): `PlayerBrain.ts +34 · actionExecutor.ts +17
  · League.ts 2 ± · Match.ts +156` — 4 files, the seam path and nothing else.

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **G-IDENT** | ✅ PASS | all three league hashes IDENTICAL to the frozen baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` — `gates.gIdent.rows`, each computed by the `scripts/fingerprint.ts` procedure on this run |
| **G-FP** | ✅ PASS | the 1337 row IS the production fingerprint (`gates.xFpProd`), and `npm run fingerprint` re-derives `57b0bdab…c673` unchanged; also pinned as a test |
| **G-OFF** | ✅ PASS | 24/24 seeds: flag ABSENT ≡ flag FALSE in the percept-armed world AND in the production-shaped world (`identical` ∧ `plainIdentical`), whole-match signature **including the rng stream state** ⇒ **RNG-stream identity holds: the flag-off draw sequence is untouched** |
| **G-BORN** | ✅ PASS | 24/24: ARMED with `forcedLook` null ≡ OFF, byte for byte (M-O2.3 born incumbent-equivalent is GATED, not asserted) |
| **G-BITE** | ✅ PASS | 24/24 forced arms diverge from OFF; **1,655 looks armed, 16,041 scan moments recorded** |
| **G-LEN** | ✅ PASS | every one of the **1,338 completed** windows is exactly **11 ticks**; max observed 11; zero unexplained closes; `O2_LOOK_TICKS === round(0.18 · 60) === 11` |
| **G-SCAN** | ✅ PASS | **scans (16,041) === live window ticks (16,041)** — exactly one recorded scan moment per look tick, the cadence identity; ledger closes with **unexplained arms 0**: 1,655 = 1,338 completed + 316 abortedLoss + 0 abortedPhase + 1 E-ENDED (a match finished mid-window; the O1 ledger's own class) |
| **G-OWN** | ✅ PASS | `staleOwnerTicks` **316 === abortedLoss 316** — every window tick with the ball elsewhere was aborted at the very next head-of-tick; the seam writes `ball.owner` nowhere (source pin) |
| **G-RNG** | ✅ PASS | the arm fixture's rng state is **777001 → 777001** (exact, no draw); the arm body carries no price term |
| **G-HYGIENE** | ✅ PASS | `o2Look` absent from `a4World.ts`, `A4_WORLD_FLAGS` and `a4MatchFlags(1|2|3)`; `cfg.o2Look ?? false`; no `envArmed` (tests) |
| **G-SEED** | ✅ PASS | 12,311,000–12,311,024, zero collisions with the eight consumed A4/O-arc blocks (`gates.seedDisjoint`) |
| **G-DET** | ✅ PASS | two invocations of the core, identical digests (above) |
| **G-SUITE** | ✅ PASS | see §CHECKS below |

### REPORTED — the look census (forced arm, 24 matches)

| quantity | value |
| --- | --- |
| looks armed | **1,655** |
| completed at the frozen 11 ticks | **1,338 (80.8%)** |
| aborted — ball lost inside the window | **316 (19.1%)** |
| aborted — phase / stun / sending-off | **0** |
| E-ENDED (match finished mid-window) | 1 |
| scan moments recorded | **16,041** (= live window ticks, exactly) |
| mean scans per armed look | 9.69 |
| window length histogram (ticks) | 1:4 · 2:70 · 3:73 · 4:74 · 5:46 · 6:3 · 7:3 · 8:16 · 9:12 · 10:8 · **11:1,345** |

The **19% ball-loss abort rate** is the honest face of M-O2.2: under an
instrument that forces a look on every new carrier, roughly one look in five is
paid for and interrupted before it finishes — the price is real, and it is
exposure. (Compare O1-T1's shortPass wind-up interruption rate 2.80% on a ~6-tick
window; a look is longer AND taken at a less-settled moment, which is what the
gap looks like.) These are descriptive counts under a deliberately crude forcing
rule; they price nothing and adjudicate nothing.

### REPORTED — the percept-freshness read (ONE match, no control, no CI)

| arm (seed 12,311,024) | samples | mean perceived-opponent age | mean opponents in memory |
| --- | --- | --- | --- |
| forced looks | 143 | **9.57 ticks** | 4.86 |
| no look (armed, no instrument) | 121 | **13.14 ticks** | 4.64 |

**What this is and is not.** It is a sanity reading that the mechanism does the
thing it is built to do — a carrier who looks carries fresher readings of the
opponents he can see. It is **one match**, the two arms are **not paired** (the
looks change the trajectory, so the sampled moments are different moments), it
carries **no CI**, and it says **nothing** about the wedge, about hold
classification, or about football. F-O2a and F-O2b remain entirely open and are
**O2-T1's** to fire. This number must not be quoted as an effect size.

### §CHECKS

```text
$ npx tsc --noEmit
tsc clean

$ npm test          (vitest run)
Test Files  125 passed (125)
     Tests  1153 passed (1153)
  Duration  235.16s

$ npm run fingerprint
seed=1337 seasons=2 matches=142
sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

### Deviations recorded

1. **No new action type, and no `faceTarget` in the plant.** The C7/O1 plants aim
   at a committed target; a look has none, and choosing a look DIRECTION would be
   a new lever (and an unearned channel). The looker keeps the incumbent
   `Dribble` label and his existing heading. Consequence, stated: the refresh is
   limited to his current field of view. The readable body cue is the contract's
   T2+ exit item.
2. **The gate `G-SCAN` was tightened after its first run**, not loosened: the
   pre-registered form ("`looks === completed + aborts`") did not name the
   **E-ENDED** class (a match finishing mid-window), which the first full run
   surfaced once in 1,655 arms. The predicate now requires every arm to land in
   exactly one class INCLUDING E-ENDED **and** adds the stricter
   `scans === liveTicks` identity. Recorded here rather than quietly rewritten;
   no result moved (the same run passes either way once E-ENDED is named).
3. **`SCAN_FRAME_RING` left untouched** despite the ring-pressure interaction
   documented in §SEAM honesty limit 3. Changing a certified constant is not this
   step's business; T1 should measure whether it matters.
4. **The freshness read runs on its own match.** `perceivedSnapshot` reconstructs
   body memory, so measuring it inside a compared arm would perturb the very
   signatures the identity gates rest on. It is therefore a separate,
   observation-only run on one extra seed (12,311,024), declared in the seed
   ledger.

### Disposition

The seam is BUILT and DORMANT: the production fingerprint is unchanged, flag-off
byte-identity holds on three league seeds and on 24 match seeds **with the rng
stream included**, an ARMED world with no instrument is byte-identical to OFF,
and when an instrument forces it the seam is reached 1,655 times, costs exactly
the frozen 11 ticks, records exactly one scan moment per tick, releases no
ownership and draws no rng. **Nothing ships.** O2-T0 cannot authorize O2-T1 — the
WEDGE EXAM is the commander's call.
