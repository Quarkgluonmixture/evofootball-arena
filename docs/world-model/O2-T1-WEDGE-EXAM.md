# O2 T1 — THE WEDGE EXAM (the #186 sizing form re-run with the LOOK forced)

Status: **PRE-REGISTERED, then SMOKED the same round.** The §FORM / §SEEDS /
§GATES sections below were written **FROZEN BEFORE SIGHT** — from
[`O2-LOOK-CONTRACT.md`](O2-LOOK-CONTRACT.md) §3, [`O2-OPENING-SIZING.md`](O2-OPENING-SIZING.md)
(#186) and [`O2-T0-DORMANT-SEAM.md`](O2-T0-DORMANT-SEAM.md) alone, before any
O2-T1 datum existed. The measured numbers arrive only in
[§RESULT (SMOKE)](#result--smoke) at the foot, and every number there is quoted
**from the committed artifact**
[`data/o2-t1-wedge-exam-smoke.json`](data/o2-t1-wedge-exam-smoke.json), never
from a console transcript or from this doc's own prose (#181.2).

**NO design conclusion is drawn here.** The probe emits per-arm rows and paired
deltas; it emits **no verdict line** (#203). F-O2a and F-O2b are pre-named in the
contract and are the **commander's** to fire.

Authority: **ruling #219.2** (this dispatch: "dispatch O2-T1 per the frozen
O2-LOOK-CONTRACT §3 — the WEDGE EXAM … the executor form: stage doc + probe
(inherit the #186 sizing instruments + the o2Look seam's forcedLook channel) +
smoke + verify") · **contract §3 O2-T1** (the pre-registered success and the two
FAIL branches) · **#185.2 / #186** (the instrument this inherits VERBATIM) ·
**#193.2 / #194** (the `o2Look` seam and its HONESTY LIMITS) · **#181.2** (every
HARD gate's evidence computed in-probe and committed) · **#197-M1 / #198** (the
hashed-body / unhashed-envelope receipt rule) · **#163** (seed + stats
disjointness, gaps ≥ 200) · **#20** (cluster = match seed) · **#128** (wall
measured outside the compared core) · **#207** (the checkpoint/resume form) ·
**#203** (per-arm rows, never verdicts).

**INSTRUMENT-ONLY ROUND.** `src/**` is byte-untouched (gate `X-SRC-UNTOUCHED`);
no flag is widened; no constant is re-cut; the certified price table is not
touched. Probe: [`../../scripts/probes/o2-t1-wedge-exam.ts`](../../scripts/probes/o2-t1-wedge-exam.ts).

---

## §FORM — the frozen exam form

### The two arms (paired on the same seed list, #20 cluster = match seed)

| arm | flags |
| --- | --- |
| **CONTROL** | the #186 **`o1armed`** arm VERBATIM: `CENSUS_FLAGS` (`edsPerceivedDefence` `edsPerceivedChoice` `edsValueAxis` `c5Hold` `c6Carry` `c7Windup` armed, `c5TouchFork` off) **+ `o1PassWindup: true`**. Nothing else. |
| **LOOK** | CONTROL **+ `o2Look: true`** + the probe-level forcing harness (below). |

The arms differ by **exactly the `o2Look` flag** plus the instrument; gate
`FLAG-HYGIENE` computes that in-probe (key-set equality + the single added key).
Both arms walk the **same seed list**, so every contrast is paired on the seed.

A third flag set exists for **receipts only** and is never counted as exam data:
`REPRO65` = `CENSUS_FLAGS` (no `o1PassWindup`), used solely by gate
`G-REPRO-186` limb (a).

### THE FORCING RULE — ONE LOOK PER RECEPTION (commander-frozen)

Verbatim the O2-T0 harness idiom
([`scripts/probes/o2-t0-look-seam.ts:162-168`](../../scripts/probes/o2-t0-look-seam.ts)),
applied at the head of every walk tick in the LOOK arm and **only** there:

```ts
const owner = match.ball.owner;
if (owner !== null && owner.gid !== lastOwner && owner.role !== 'GK') {
  lastOwner = owner.gid;                                   // the RECEPTION edge
  match.forcedLook = { gid: owner.gid, untilTick: match.simTick + 40 };
}
```

* **One look per reception.** `lastOwner` is the previously-seen carrier gid, so
  the arming line fires exactly on a **new-ownership edge** by a non-GK body. The
  `forcedLook` slot then names that body for a 40-tick eligibility runway; the
  seat (`o2LookEligible` + `o2LookDecision`, `src/ai/lookSeat.ts`) arms **one**
  11-tick window at the next decision fork at which he is eligible, and
  `o2LookEligible` refuses to stack a look on a live one
  (`match.o2LookWindow === null`). Play then proceeds with refreshed percepts.
* **Re-receptions get a fresh look.** A body who loses the ball and regains it
  later re-crosses the new-ownership edge (`owner.gid !== lastOwner` is true
  again, because someone else held it in between) and is armed again. A body who
  simply *keeps* the ball is armed **once**. This is the T0 harness's own
  behaviour, verified against that probe: T0's `lookCensus` recorded **1,655**
  armed looks over 24 matches under exactly this rule
  (`o2-t0-look-seam.json`, quoted in O2-T0 §RESULT), i.e. repeated arming across
  a match, not one per body per match.
* **CONTINUOUS forcing is FORBIDDEN** (commander-frozen): the look's re-decide
  lock would pin the carrier permanently and the world would stop playing
  football, which answers no exam question. Nothing in this probe re-arms a body
  while his window is live, and nothing extends a window.
* **Instruments force; ships never do.** `forcedLook` is null in every production
  path (O2-T0 §GATES G-BORN); the CONTROL arm never touches it.

### SAMPLING / CLASSIFICATION — inherited VERBATIM from #186, zero re-cuts

Every eligibility test, constant, exclusion and metric column below is the #186
probe's (`scripts/probes/o2-whether-sizing-rerun.ts`), which is itself #65's:

| item | value / definition |
| --- | --- |
| qualifying moment | `phase === 'playing'` · non-GK, not-sent-off owner · `decisionTimer <= 0` · ≥ `MOMENT_SPACING` **30** ticks since the last sample · ≤ `PER_MATCH_CAP` **80** per match |
| eligible moment | qualifying minus four exclusions: `firstTouchWindow > 0` · `restartKickGid` (forced release) · A0-decided `Shoot` / `ClearBall` off a one-step pristine fork (`HORIZON` 240) |
| classification | `whetherEyeDecision` on a **pristine clone** — the live match never carries a `whetherEye` |
| classes | `D-HOLD` (PERCEIVED hold) · `E-ABSTAIN-UNSEEN` · `E-ACTNOW-DECLINED` · `E-NOCELL` |
| TRUE-context share | TRUE cell (`pressureAt` over real opponents · own `staleTime` · real teammates in the **6–30 m** window) is the certified holdable cell; only `0\|0\|0` reaches zero (asserted in-probe) |
| wedge ratio | TRUE-context share ÷ PERCEIVED hold share |
| M-CTX | perceived cell key == TRUE cell key over moments where a cell was placed, plus the three per-feature agreements (P / S / support) |
| DEV floor | perceived share ≥ **0.29 %** and N_hold ≥ **446** — **NOT re-cut** (#65.1) |
| match duration | 240 s |

**Population rulings, declared before sight:**

1. **Moments falling inside a live look window STAY in the population.** They are
   honestly mid-price moments; excluding them would re-cut #186's predicate to
   flatter the exam.
2. **Declared consequence of (1), stated ex ante so it is not read later as a
   surprise.** While a look window is live the body is under the O2-T0
   **re-decide lock**, so the A0 one-step fork reads his incumbent `Dribble`
   label — the `Shoot` / `ClearBall` exclusions therefore fire *less* often in the
   LOOK arm. The predicate is unchanged; the *world it is applied to* is the LOOK
   world. The per-arm **exclusion mix** is published so the shift is visible, not
   hidden.
3. **The pristine clone carries the live seam state.** `cloneSimulationState` is a
   deep clone, so a fork taken inside a live window carries that window and its
   own copy of `o2LookLedger`; the fork's step can therefore increment the
   **clone's** ledger and never the live match's. The exam's ledger numbers are
   the live match's only.

### DECLARED ADDITIONS — new columns only, all declared before sight

* **(i) The per-arm LOOK LEDGER** — the in-engine `Match.o2LookLedger`
  (`looks` / `completed` / `abortedLoss` / `abortedPhase` / `scans`) plus the
  probe-side `E-ENDED` class (the walk ended with a window live),
  `liveWindowTicks` and `frozenPhaseTicksUnderLiveWindow`.
  ⭐ **`liveWindowTicks` IS READ ON THE PLAYING CLOCK — the clock `stepO2Look`
  actually runs on**, and the ticks it excludes are published beside it as their
  own named class rather than dropped. `Match.step` returns early during
  `kickoff` / `goalPause` / `halftime` / `fulltime` **before** `stepO2Look`, so on
  such a tick the engine records **no scan** and **cannot close** the window — yet
  the window object survives. The two columns **partition** every tick that ended
  under a live window, so the cadence identity `scans === liveWindowTicks` is a
  statement about the seam's own clock and nothing is swallowed to make it hold.
  See §GATES **G-FORCE** for the correction of record this class was named in.
  ⚠ **THE #194 ABORT-MIX PRICE, paid BEFORE the mix is read anywhere.**
  `stepO2Look`'s `phase !== 'playing'` bail is largely unreachable — `Match.step`
  returns early during kickoff / goal-pause / half-time *before* `stepO2Look`
  runs — so a window spanning a goal pause closes as **`abortedLoss`**, not
  `abortedPhase`, and `abortedPhase` reads ≈ 0 by construction (O2-T0 §RESULT,
  the "#194 T1 instrument note": 0 in 1,655 arms). **Consequence, binding on this
  doc and on any reader:** `abortedLoss` is *"ball not owned by the looker at the
  next head-of-tick"*, which is a superset of "lost in a duel"; it is **not** a
  clean exposure-cost estimator on its own, and this exam therefore prices
  exposure with the independent turnover instruments in (ii) as well.
* **(ii) F-O2b EXPOSURE INSTRUMENTS — the free-option predicate, pre-registered
  BEFORE sight.** Per arm, on the identical walk loop:
  `possessionSpells` (new-carrier edges) · `turnovers` (the owning **side**
  changes) · `turnoverPerSpell` · `turnoversPer1000WalkedTicks` ·
  `turnoversUnderLiveLook` (a turnover whose **losing carrier** is the body whose
  look window was live **at, or within `O2_LOOK_TICKS` ticks before, the hand-over
  tick**; 0 in CONTROL by construction) · the engine's own `abortedLoss`.
  ⚠ **SHARPENED, and recorded** (§RESULT deviation 5): this predicate was first
  written as *"held a live window on the tick before the ball changed hands"*; a
  **guard-block dry run** (12,422,050–051, which adjudicates nothing) showed that
  literal reading returns **0 by construction**, because the ball is loose for
  several ticks between a loss and the next control. The predicate was tightened
  to a working one **before** any receipts run, in the O2-T0 `G-SCAN` precedent
  (a criterion fixed *before* sight, never re-cut after).
  ⭐ **RE-SPECIFIED AT LOSS-TICK SEMANTICS — the commander-ruled PRE-BATTERY form,
  settling the instrument debt §RESULT deviation 5 booked.** The debt was booked
  *before* any battery datum existed and is settled here with none in existence.
  The predicate now in force, stated exactly:

  > The **team-level turnover** definition is UNCHANGED — the probe's existing
  > spell tracking, a turnover being the tick at which the **owning side**
  > changes. Such a turnover is **look-attributed** iff, at the **losing team's
  > LAST-CONTROLLED tick of that spell**, the body then in control held a **live
  > `o2Look` window of his own**. "Last-controlled tick" is derived from the
  > probe's own spell tracking (the carrier's most recent tick in control), so
  > the loose-ball gap between the loss and the opponent's regain — which is
  > exactly why the adjacency wording read **0 by construction** — is spanned by
  > construction rather than by any tick window. `O2_LOOK_TICKS` no longer enters
  > the predicate. **0 in CONTROL by construction** (no window can exist there).

  Published beside it, **as data with NO assumed identity** — no claim is made
  that any of the three columns measures the same quantity:
  **(a)** the engine ledger's own `abortedLoss` (already emitted; the #194
  superset priced in (i)); **(b)** `abortedLossOwnTeamRecovery` — of the
  aborted-by-loss windows, how many were followed by an established control by
  the **looker's own side** (own-team recovery of the loose ball), i.e. the abort
  did **not** end as a team-level turnover. `abortedLossUnresolvedAtWalkEnd` is
  carried beside them so (b) is auditable against (a) (aborts whose next
  established control never arrived before the walk stopped).
  Whatever the re-specified column then reads is **published plainly**; this doc
  adjudicates nothing from it.
  **F-O2b's shape (contract §3, the E5h class): classification improves while the
  measured exposure cost is ~zero.** Its two component readings, frozen here:
  (a) a classification limb resolves (the PERCEIVED hold delta, or the wedge
  delta, with a paired CI excluding 0/the CONTROL wedge), **and** (b) every
  exposure-cost delta's paired CI **contains 0**. The probe emits the component
  `resolved` booleans (the #186 field, a mechanical CI property) and **nothing
  composite** — no probe output names F-O2a or F-O2b. Firing them is the
  commander's.
* **(iii) The per-feature M-CTX decomposition (P / S / support)** with paired CIs
  on each, read **with T0 HONESTY LIMIT 2**: a look refreshes **pressure** and
  **support** toward truth while making **STALENESS strictly worse** (`staleBand`
  reads the team's own possession clock, which runs while he stands there — it is
  not a percept and cannot be refreshed). The wedge reading must therefore
  separate the two directions; the overall agreement number alone cannot.
  (T0 HONESTY LIMIT 1 also binds the ceiling: he does not choose *where* to look,
  so only what his current heading covers can sharpen.)
* **(iv) RING-PRESSURE REPORTED reading (T0 HONESTY LIMIT 3).** `SCAN_FRAME_RING`
  is 16 while a look records 11 frames in 11 ticks, so a looker can hold more
  in-retention frames than the ring and the OLDEST may be evicted before replay.
  Cheap and measured: at every eligible moment, on the same clone the classifier
  reads, the owner's scan ring is inspected — `occupancy`, `oldestFrameAgeTicks`,
  `ringFull` (occupancy == 16) and **`ringPressure`** := `ringFull` **and**
  `oldestFrameAge < retentionTicks`, i.e. the ring is holding *less* history than
  retention would have kept ⇒ an in-retention frame was evicted.
  `retentionTicks = round(15 + awareness·45) = 51` at the exam's
  `edsAwareness 0.8` (`src/ai/perceptionSnapshot.ts:530`). The ring size is
  **read out of `src/sim/Match.ts` in-probe** (gate `X-RING-PIN`), not typed as a
  belief. REPORTED: it prices a known limit, it adjudicates nothing.
* **(v) THE #218 BUILD-UP RULER — DROPPED, with the reason stated plainly.**
  The census's goal-origin classifier (`goal-genealogy-census.ts` §8) is a
  **full-match** tick-walk: it needs every possession segment from kickoff to
  final whistle to place a goal's origin. The #186 walk is **not** a full-match
  walk — it stops at `PER_MATCH_CAP` 80 sampled moments
  (#186 read 16,000 qualifying moments from 200 matches = exactly 80 per match,
  i.e. the cap binds in every match), so the walk truncates well before the
  whistle. Lifting the classifier would require walking each match to the end,
  which changes the #186 population's cost and is a population edit this round is
  forbidden to make. **Carried instead: per-arm goal counts over the sampled
  window only** (`goalsInWalkedWindow`, with `ticksWalked` and
  `matchesReachingFullTime` published beside them so the truncation is auditable).
  The constructed-goal share and the scramble share are **NOT measured here**;
  they remain the build-up arc's ruler, to be read on an instrument that walks
  whole matches.

### PRE-REGISTERED SUCCESS (contract §3, restated verbatim in force)

> "pre-registered success = perceived-context hold classification rate rises
> toward the true-context rate (wedge point falls toward 1×, CI excluding the
> baseline wedge), E-ABSTAIN-UNSEEN falls resolvedly"

Operationally, and frozen here: the **perceived-context hold rate rises toward
the true-context rate**, the **wedge point falls toward 1× with the paired CI
excluding the CONTROL wedge**, and **E-ABSTAIN-UNSEEN falls resolvedly** (its
paired-delta CI entirely below 0).

**FAIL branches — reported as-is, NEVER adjudicated by the probe or by this doc:**

* **F-O2a** — the ledger shows looks completing and percepts refreshing but
  classification does not move (the wedge is not staleness-driven; the perception
  trunk needs different surgery; STOP).
* **F-O2b** — hold/survival improves at ~zero measured exposure cost (the free
  option, the E5h class).

### THE ESTIMATOR (pre-registered)

The #186 **(A3)** paired cluster bootstrap, extended: one resampled seed-index
set feeds BOTH arms (paired on the match seed), **2,000 resamples**,
**ratio-of-totals** estimator, **2.5 / 97.5** percentiles, stats base
**104,600**. A delta is labelled `resolved` iff its CI excludes 0. Carried on:
the six #186 rates (perceived hold · true-context · E-ABSTAIN-UNSEEN ·
E-ACTNOW-DECLINED · E-NOCELL · M-CTX overall), **the wedge contrast**, the three
per-feature M-CTX agreements (iii), and the (ii) exposure rates. For the wedge
the probe additionally publishes the LOOK arm's own wedge CI and the mechanical
flag `lookWedgeCiExcludesControlPoint` — a CI property, not a verdict.

### THE N RULE (frozen ex ante, computed in-probe from the #186 artifact)

The battery N is **derived, never typed**, from the committed #186 numbers
(`data/o2-whether-sizing-rerun.json`, the `o1armed` arm — the CONTROL arm of this
exam): perceived hold **0.0672 %** (n=8), true-context **0.5295 %** (n=63),
E-ABSTAIN-UNSEEN **68.7905 %**, **11,897** eligible moments from **200** seeds
(**59.485** eligible/seed).

For a pre-registered quantity *q* with control level `p0` and frozen alternative
`p1`, at two-sided 95 % / 80 % power:

```text
m_iid(q)  = (z.975 + z.80)^2 · (p0(1−p0) + p1(1−p1)) / (p1 − p0)^2      [eligible moments/arm]
DEFF(q)   = (halfWidth(#186 paired-delta CI of q) / z.975)^2
            ÷ ( (pb(1−pb) + pa(1−pa)) / m186 )                          [MEASURED, not assumed]
m_req(q)  = DEFF(q) · m_iid(q)
N(q)      = ceil( m_req(q) / 59.485 )
N         = min( 800 , max_q N(q) )
```

The two pre-registered quantities and their frozen effect sizes:

* **q1 = the perceived-context hold rate.** `p0 = 0.000672`; `p1 = p0 + (0.005295 − p0)/2`
  = **HALF-CLOSURE of the wedge** (the contract's success is "rises toward the
  true rate"; half-closure is the frozen size, chosen before sight).
* **q2 = E-ABSTAIN-UNSEEN.** `p0 = 0.687905`; `p1 = p0 − 0.02` — a **2 pp**
  absolute fall, frozen before sight (≈ ⅗ of the #186 paired-delta CI half-width,
  i.e. deliberately smaller than what #186 could see).

`N` is the **larger** of the two, capped at **800** seeds/arm (the seed-budget
cap idiom — the reserved battery block is 800 seeds wide; if the cap binds it is
stated plainly and the shortfall published, never absorbed). The rule's whole
arithmetic — every intermediate, both DEFFs, the binding quantity and whether the
cap bound — is emitted in the artifact's `nRule` block.

**Smoke = 12 seeds shared by both arms** (frozen by this doc, not derived).

---

## §SEEDS — the fresh band, declared as sub-blocks

The fresh band starts at **12,422,000** (the goal-genealogy census consumed
through 12,421,999).

| sub-block | use |
| --- | --- |
| **12,422,000 – 12,422,011** | **SMOKE** — the 12 shared match seeds, walked by BOTH arms |
| **12,422,050 – 12,422,099** | **EXIT-SEMANTICS GUARD BLOCK** (the census idiom): every bounded / overridden / fingerprint-skipped invocation is routed here, turns gate `G-CLEAN-INVOCATION` **RED** and exits 1. Such a run **adjudicates nothing** and its artifact is not a receipt. Keeps the battery block virgin. |
| **12,422,100 – 12,422,899** | **BATTERY** — contiguous from 12,422,100, `N` seeds by the rule above, hard cap 800 (through 12,422,899) |
| 12,310,000 – 12,310,011 | #186's **own** block, re-walked ONLY as the `G-REPRO-186` limb (b) receipt — never fresh data |
| 8,500,000 – 8,500,047 | #65's **own** block, re-walked ONLY as the `G-REPRO-186` limb (a) receipt — never fresh data |
| stats base **104,600** | the bootstrap stream (#163: gap ≥ 200 from every published ≥91,100-regime base; the nearest is the census's 104,400 ⇒ min gap exactly 200) |

Disjointness is computed **IN-PROBE** against the complete consumed-block ledger:
the goal-genealogy census probe's ledger (the completest to date — **17 blocks**
through the MT-LADDER reserved band, #186's own 12,310,000–199 already **inside**
it) **plus the census's own consumption 12,421,000 – 12,421,999**, plus #65's
repro block 8,500,000–047 ⇒ **19 entries** in total (the count §RESULT quotes
from the artifact). The stats namespace
published is the census probe's complete ≥91,100-regime list **plus 104,400**
(the census's own base); the probe proves min gap ≥ 200.

---

## §GATES — all computed IN-PROBE and committed (#181.2; evidence is NEVER doc-typed)

| gate | HARD? | form |
| --- | --- | --- |
| **X-DET** | HARD | the whole computation (both arms + both repro walks + every summary and bootstrap) runs **TWICE**; the two **hashed bodies** must be byte-identical; `resultSha256` = sha256 of run 1's hashed body |
| **(#197-M1/#198 envelope rule)** | — | git head, wall-clock, absolute/relative paths, timestamps, checkpoint state ride the **UNHASHED envelope ONLY**; `resultSha256` must recompute identically at any later commit or from any cwd |
| **X-FP-PROD** | HARD | the shipped production fingerprint recomputed in-probe (`League({seed:1337})` → `runHeadless` to `generation+2` → sha256 of the save JSON) == `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` |
| **G-REPRO-186** | HARD | instrument inheritance **PROVED, not asserted**, in two limbs: **(a)** this probe's walker re-walks **#65's own block 8,500,000–8,500,047** with `REPRO65` flags and reproduces #186's committed `G-REPRO65` row exactly (qualifying 3,840 · eligible 2,835 · D-HOLD 4 · classes 4/816/2,004/11 · cells placed 820 · agreement 0.502439); **(b)** this probe's **CONTROL arm** re-walks the **first 12 seeds of #186's fresh block 12,310,000** and reproduces `data/o2-whether-sizing-rerun.json`'s committed `perMatch.o1armed` rows **field-for-field** (seed · eligible · dHold · trueHoldable · abstainUnseen · ctxPlaced · ctxAgreeAll). Limb (b) is the stronger form for THIS exam — it proves the CONTROL arm *is* #186's `o1armed` arm on #186's own data; limb (a) additionally chains back to #65. Both are cheap; both are run. |
| **X-SRC-UNTOUCHED** | HARD | `git diff --stat -- src` is empty at run time (instrument-only round) |
| **X-RING-PIN** | HARD | `SCAN_FRAME_RING` read out of `src/sim/Match.ts` in-probe == 16 (the (iv) instrument's premise is a receipt, not a belief) |
| **SEED-DISJOINT** | HARD | every walked block in-band and clash-free against the complete consumed ledger (census ledger + the census's own block + the two repro blocks) |
| **STATS-DISJOINT** | HARD | stats base 104,600, min gap ≥ 200 from every published ≥91,100-regime base |
| **FLAG-HYGIENE** | HARD | CONTROL == `CENSUS_FLAGS` + `o1PassWindup` exactly (the #186 `o1armed` set); LOOK == CONTROL + `o2Look` and **nothing else** (key-set equality + one added key) |
| **TABLE-DRIFT** | HARD | injected certified table `tableSha` == `184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53` exactly **and** the holdable-cell set == `["0\|0\|0"]` |
| **G-FORCE** | HARD | the arms are what they claim: in **LOOK**, `looks > 0` on **every** seed and `scans === liveWindowTicks` **read on the playing clock** (the T0 cadence identity), with `frozenPhaseTicksUnderLiveWindow` published beside it, and the ledger closes (`looks == completed + abortedLoss + abortedPhase + E-ENDED`); in **CONTROL**, the ledger is **empty** (zero looks, zero scans, zero live ticks, zero frozen ticks) |
| **G-CLEAN-INVOCATION** | HARD | no env override is in force (`O2T1_N`, `O2T1_SKIP_FP`). Any override routes the run onto the **guard block** and turns this gate RED (and exits 1) rather than passing quietly. |

**Pre-named FAIL ⇒ report as-is, never re-cut**: any HARD gate failing, any `src`
diff, any population edit. A frozen criterion is never re-cut after seeing
numbers.

#### ⚠ G-FORCE — CORRECTION OF RECORD (a measurement-layer defect, not a re-cut)

A battery run of this instrument (N = 320, seeds 12,422,100–419, `resultSha256`
`056f2fdd01e0c954f081bd8e9a4e959bf98a6833f16998ead226f205b055489e`) **failed
G-FORCE red on the cadence-identity limb**: engine-ledger `scans` **115,308** vs
probe-counted `liveWindowTicks` **116,568**. **That artifact was never committed
and has been deleted**; it is superseded by the fix recorded here. Its exam
numbers were **not read** — only its gate block was, and only to diagnose.

*The account, confirmed empirically before the counter was touched* (a throwaway
single-seed trace, no artifact, nothing adjudicated):

* The deficit was **1,260 = exactly 10 of 320 seeds × exactly 126 ticks each** —
  no other seed deviated by any amount.
* On seed **12,422,107** the trace found **one** contiguous frozen span, ticks
  **7,256–7,381 = 126 ticks**, composed of **72 `halftime` ticks** (the 1.2 s
  pause, `Match.ts` `phaseTimer = 1.2`) **+ 54 `kickoff` ticks** (0.9 s,
  `setupKickoff`). The window (gid 5, armed at tick 7,253, `untilTick` 7,264) sat
  frozen across it and **closed as `abortedLoss` at tick 7,382**, the first
  playing tick — the documented **#194** abort-mix quirk, never `abortedPhase`.
  Seed 12,422,126 reproduced the identical shape (span 7,606–7,731, 72 + 54).
  All ten affected seeds were re-walked independently: **126 each, total 1,260**.
* **The seam was intact throughout** — the ledger closed (`unexplainedArms` 0),
  CONTROL was empty, and `looks > 0` held on 320/320 seeds. The defect was in the
  **probe's measurement**, not the engine: the counter read `win !== null` on the
  **wall** clock, so ticks on which `Match.step` returned early *before*
  `stepO2Look` — recording no scan and unable to close the window — were counted
  as live. On such a tick a scan **cannot** exist, so the identity was being asked
  to hold across a clock the seam does not run on.

*The fix, in the O2-T0 **G-SCAN** precedent — name the class, tighten honestly,
never quietly rewrite*: `liveWindowTicks` now counts on the seam's own clock, and
the excluded ticks are published as the explicitly named companion class
**`frozenPhaseTicksUnderLiveWindow`** (per arm, in the ledger, in the G-FORCE
evidence block and in the transcript). The two columns partition every tick that
ended under a live window, so **nothing is dropped to make the gate green** — the
frozen ticks are visible on their own line. `src/**` is byte-untouched; the
engine's `stepCount` safety net is deliberately **not** mirrored in the probe's
predicate, so any *other* path that ever skips `stepO2Look` must still break this
gate loudly rather than be absorbed. On the smoke block the new class reads
**0 / 0** (no half ends under a live window there), which is why every previously
committed smoke number is unchanged.

### Mode / resume contract

* **The receipt paths are FIXED by mode** — there is no output-path env override,
  so the canonical-write hole the census carried (#217.2's operational rule) is
  simply never opened here. An **overridden** run additionally writes to
  `/tmp/o2-t1-guard-run.json`, so it cannot clobber a committed artifact.
* `O2T1_MODE=smoke` (default) — 12 seeds at 12,422,000; no checkpoint (the unit
  of loss is minutes).
* `O2T1_MODE=full` — `N` seeds from the N rule at 12,422,100, with **per-seed
  checkpoint/resume** in the #207 `mt-t2-coevolution` form: the checkpointed unit
  is exactly the per-(pass, seed) pair of `PerMatch` rows the uninterrupted loop
  builds; **nothing pooled is stored** — every rate, CI, gate, digest and
  `resultSha256` is recomputed downstream from the union, by the same code, in
  the same order, so **resume ≡ fresh, byte-identical**. `O2T1_RESUME=1` restores;
  the header pins full git HEAD, this probe file's sha, a sha of `git diff -- src`,
  the mode and a sha of the frozen-config echo — **any** mismatch REFUSES (exit 1).
  Records carry a payload sha and an `encode(decode(encode(x))) === encode(x)`
  round-trip check (the NaN→null trap); a failing record is discarded and its seed
  recomputed. The file is `/tmp` scratch, never committed, never read by a gate.

---

## §RESULT — SMOKE

*(Every number in this section is quoted FROM the committed artifact
[`data/o2-t1-wedge-exam-smoke.json`](data/o2-t1-wedge-exam-smoke.json), which is
recomputed by `npx tsx scripts/probes/o2-t1-wedge-exam.ts`. The doc never carries
evidence the artifact does not — #181.2.)*

**Ran 2026-08-10 · `resultSha256`
`089a4292ce0dc2c0a8d19da0220f6e562d8be612d0ebe4812e914fa2c62fc2a3` ·
X-DET core digest `4554ed0bb8efa002c62f6b891e7af776ece91b7a7253b361db12ab1ddd434966`
(both passes) · 12 shared seeds 12,422,000–12,422,011 · **ALL GATES PASS**
(`allGatesPass: true`) · wall 208 s (CONTEXT ONLY, #128 — used in no rate, and
riding the UNHASHED envelope).**

⚠ **SUPERSESSION (2), stated plainly.** This is the **third** smoke artifact. The
second (`resultSha256`
`eefb273a38f25208c777e7aad5019617107811919aee02972f88fd5154ffc1d7`, X-DET digest
`908d6aac112b25eafa2c2ef255c55d9bf8551d973d7dff0da39a2256980b7dcf`) is **not
withdrawn and remains in git history** at commit `14f824f`. It was superseded by
the **G-FORCE correction of record** written up in §GATES: the probe's
`liveWindowTicks` counter now runs on the clock `stepO2Look` runs on, and the
excluded ticks are published as the named class
`frozenPhaseTicksUnderLiveWindow`. **Every previously committed number in this
section is byte-identical** — the *only* hashed-body fields that moved are the
four new `frozenPhaseTicksUnderLiveWindow` entries (all **0** at smoke), the two
new ledger notes and the G-FORCE note prose, which is why `resultSha256` and the
X-DET digest move. `src/**` is byte-untouched in this round too.

⚠ **SUPERSESSION (1), stated plainly.** The
first (`resultSha256`
`d21ffedbdaf7746013a71ece8286505c88283ebc2b13b45d6cfd2140231c2bc5`, X-DET digest
`1a9816653aa4485745a41a9ad88ae8a3716e2db41afa63227c3dd4aeb3a9af54`) is **not
withdrawn and remains in git history** at commit `e5a5261`. It was superseded by
this **pre-battery instrument round**, run with **no battery datum in existence**:
(1) `turnoversUnderLiveLook` re-specified at LOSS-TICK semantics (§FORM (ii)) and
two companion columns published beside it; (2) `reference186.wedgeRatio` made a
**file read** of the cited artifact's committed counts-based value **7.875** (it
had been **7.8795**, re-derived in-probe from rounded shares — a CITED number that
differed from its source); (3) the §SEEDS ledger arithmetic corrected to **19**.
`src/**` is byte-untouched in this round too. **Every other number in this section
is byte-identical to the first artifact's** — the only hashed-body fields that
moved are the re-specified/added exposure columns and `reference186.wedgeRatio`
(with its note), which is why `resultSha256` and the X-DET digest move.

### Gate table — every value recomputed in-probe on the run that wrote the artifact

| gate | verdict | evidence |
| --- | --- | --- |
| **X-DET** | ✅ PASS | the whole computation twice; hashed bodies byte-identical: `digestA === digestB === 4554ed0b…4966` |
| **X-FP-PROD** | ✅ PASS | observed `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` == the shipped baseline |
| **G-REPRO-186 (a)** | ✅ PASS | #65's block 8,500,000–047, `REPRO65` flags: qualifying **3,840** · eligible **2,835** · D-HOLD **4** · classes **4 / 816 / 2,004 / 11** · cells placed **820** · agreement **0.502439** — identical to #186's committed `G-REPRO65` target |
| **G-REPRO-186 (b)** | ✅ PASS | the CONTROL arm on #186's own block 12,310,000–011: **12 rows checked, 0 mismatches** against the committed `perMatch.o1armed` rows (seed · eligible · dHold · trueHoldable · abstainUnseen · ctxPlaced · ctxAgreeAll) |
| **X-SRC-UNTOUCHED** | ✅ PASS | `git diff --stat -- src` empty at run time |
| **X-RING-PIN** | ✅ PASS | `SCAN_FRAME_RING` read out of `src/sim/Match.ts` = **16** |
| **SEED-DISJOINT** | ✅ PASS | exam block 12,422,000–011: **0 collisions** against the 19-block consumed ledger; sub-blocks ordered (smoke `12422000..12422011` · guard `12422050..12422099` · battery `12422100..12422899`) |
| **STATS-DISJOINT** | ✅ PASS | base **104,600**, **min gap 200** (nearest published base 104,400) |
| **FLAG-HYGIENE** | ✅ PASS | CONTROL == `CENSUS_FLAGS` + `o1PassWindup`; LOOK == CONTROL + `o2Look`, exactly one key added, every shared key equal |
| **TABLE-DRIFT** | ✅ PASS | `tableSha 184d1e84…0b53` · holdable-cell set `["0\|0\|0"]` |
| **G-FORCE** | ✅ PASS | LOOK: **436** looks, `looks > 0` on **12/12** seeds, **scans 4,083 === live window ticks 4,083** (the T0 cadence identity, read on the playing clock), `frozenPhaseTicksUnderLiveWindow` **0**, unexplained arms **0**. CONTROL: ledger **empty** (0 looks · 0 scans · 0 live ticks · 0 frozen ticks). See §GATES **G-FORCE — correction of record** for the battery-run defect this class was named in. |
| **G-CLEAN-INVOCATION** | ✅ PASS | no override in force (`O2T1_N` null · `O2T1_SKIP_FP` false) |

### The headline table — both arms, 12 shared seeds

Shares are of **eligible moments**: CONTROL **718** · LOOK **757**, from **960 /
960** qualifying (retained fraction 74.8 % / 78.9 %). CIs are the paired
per-match cluster bootstrap (2,000 resamples, ratio-of-totals, 2.5/97.5, stats
base 104,600); `Δ` = **LOOK − CONTROL**, `resolved` iff the CI excludes 0.

| quantity | CONTROL | LOOK | paired Δ (pp) [2.5, 97.5] | resolved? |
| --- | --- | --- | --- | --- |
| **PERCEIVED hold rate** | **0.1393 %** (n=1) | **0 %** (n=0) | −0.1393 [−0.4310, 0] | **no** |
| **TRUE-context share** | **0.6964 %** (n=5) | **0.9247 %** (n=7) | +0.2283 [−0.3003, +0.8427] | no |
| **wedge ratio (true ÷ perceived)** | **5.00×**, CI [0, 10] (1,317/2,000 finite draws) | **null** — undefined, the arm holds ZERO times (0/2,000 finite draws) | null | **no** |
| **E-ABSTAIN-UNSEEN** | **72.0056 %** | **63.6724 %** | **−8.3332** [−13.7655, −3.2488] | **YES** |
| E-ACTNOW-DECLINED | 27.5766 % | 36.0634 % | **+8.4868** [+3.3913, +13.9313] | **YES** |
| E-NOCELL | 0.2786 % | 0.2642 % | −0.0144 [−0.4110, +0.4032] | no |
| **M-CTX agreement (overall)** | **43.2161 %** (placed 199) | **56.7766 %** (placed 273) | **+13.5605** [+0.8383, +26.2597] | **YES** |
| — M-CTX **pressure** | 78.8945 % | 94.1392 % | **+15.2447** [+6.1596, +24.9826] | **YES** |
| — M-CTX **stale** | 100 % | 100 % | 0 [0, 0] | no |
| — M-CTX **support** | 56.2814 % | 60.4396 % | +4.1582 [−6.6046, +15.2564] | no |
| **DEV floor 0.29 % cleared?** | **no** | **no** | — | — |
| matches to accumulate N_hold ≥ 446 | 5,352 | n/a (zero holds) | — | — |

**The wedge is UNDEFINED in the LOOK arm at this N** — its denominator is the
perceived-hold count, which is 0 there (and 1 in CONTROL). The pre-registered
wedge contrast therefore has no value on this smoke, and
`lookWedgeCiExcludesControlPoint` is **false** by absence, not by evidence. This
is the rare-event resolution problem #186 already named (its own arms held 5 and
8 times in ~11.9 k moments); at 718 / 757 moments the quantity is not in reach.
It is stated, not worked around.

### Exclusion mix (the declared population consequence, published so it is visible)

| exclusion | CONTROL | LOOK |
| --- | --- | --- |
| first-touch window | 160 | 101 |
| forced restart (`restartKickGid`) | 45 | 68 |
| A0 `Shoot` | 35 | 32 |
| A0 `ClearBall` | 2 | 2 |

### (i) The LOOK ledger — per arm

| quantity | CONTROL | LOOK |
| --- | --- | --- |
| looks armed | 0 | **436** |
| completed at the frozen 11 ticks | 0 | **335** |
| aborted — not owned at the next head-of-tick (`abortedLoss`) | 0 | **94** |
| aborted — phase / stun / sending-off | 0 | **0** |
| E-ENDED (the walk ended mid-window) | 0 | **7** |
| scan moments recorded | 0 | **4,083** |
| live window ticks (playing clock) | 0 | **4,083** |
| `frozenPhaseTicksUnderLiveWindow` (no scan possible; window cannot close) | 0 | **0** |
| seeds with `looks > 0` | 0 / 12 | **12 / 12** |
| unexplained arms | 0 | **0** |

Read **only** through the #194 price stated ex ante in §FORM (i): `abortedPhase`
is ≈ 0 **by construction** (the phase bail is largely unreachable), and
`abortedLoss` means *"not owned at the next head-of-tick"* — a superset of a duel
loss. No mechanism claim is made from this mix.

### (ii) F-O2b exposure instruments — per arm

| quantity | CONTROL | LOOK | paired Δ [2.5, 97.5] | resolved? |
| --- | --- | --- | --- | --- |
| walked ticks | 98,810 | 98,306 | — | — |
| possession spells | 815 | 661 | — | — |
| turnovers | 339 | 280 | — | — |
| **turnover per spell** | **0.415951** | **0.423601** | +0.00765 [−0.02383, +0.038604] | **no** |
| **turnovers / 1,000 walked ticks** | **3.430827** | **2.848249** | **−0.582577** [−0.860543, −0.314299] | **YES** |
| **turnovers look-attributed at the LOSS TICK** (`turnoversUnderLiveLook`, re-specified) | 0 (by construction) | **18** | — | — |
| companion (a) — engine `abortedLoss` | 0 | **94** | — | — |
| companion (b) — `abortedLossOwnTeamRecovery` (abort NOT ending as a team turnover) | 0 | **50** | — | — |
| `abortedLossUnresolvedAtWalkEnd` (audit residue for (b)) | 0 | **2** | — | — |

The re-specified column **fires**: of the LOOK arm's **280** team-level turnovers,
**18** are attributable to a look live at the losing team's last-controlled tick.
The old adjacency wording read 0 by construction; the debt booked in deviation 5
is **settled here, before the battery**, and the re-spec's exact predicate is in
§FORM (ii).

The three columns beside it are **data with no assumed identity** — no claim is
made that they measure the same thing, and none of them is adjudicated here.
Read only through the #194 price: `abortedLoss` = 94 is *"not owned by the looker
at the next head-of-tick"*, a superset of a duel loss; of those, **50** were
followed by an established control by the **looker's own side** (own-team recovery
of the loose ball — the abort did not end as a team-level turnover), **2** never
saw another established control before the walk stopped, and the remaining **42**
were followed by opposition control. That 42 is *not* the same population as the
18: the 18 counts **turnovers** whose losing last-controlled tick was under a live
look, the 42 counts **aborted windows** followed by opposition control. The
arithmetic between them is the commander's to read, not this doc's.

### (iii) M-CTX per-feature — read with T0 HONESTY LIMIT 2

The decomposition is in the headline table. What the honesty limit requires be
said beside it: **pressure** and **support** are the refreshable features;
**stale is not a percept at all** (it is the team's own possession clock, which
runs *while he stands there*), so it reads 100 % agreement in **both** arms by
construction and the look can only push it the wrong way. The overall agreement
movement is therefore carried by pressure (resolved) and support (unresolved),
and the overall number must not be read as though all three features could move.

### (iv) Ring pressure (REPORTED, T0 HONESTY LIMIT 3)

`SCAN_FRAME_RING` = **16** (pinned in-probe), `retentionTicks` = **51** at
`edsAwareness 0.8`.

| quantity (over eligible moments) | CONTROL | LOOK |
| --- | --- | --- |
| moments with a readable ring | 706 | 745 |
| ring FULL (occupancy 16) | 686 | 724 |
| **ringPressure** (full **and** oldest frame younger than retention) | **0** (0 %) | **50** (**6.7114 %**) |
| mean occupancy | 15.746 | 15.760 |
| mean oldest-frame age (ticks) | 181.411 | 147.213 |

Paired Δ on the ringPressure share: **+6.7114 pp [+4.6917, +8.7744]**,
`resolved: true`. The T0 honesty limit is therefore **real and measurable**: in
about one eligible moment in fifteen the looker's ring held *only* in-retention
frames, i.e. an in-retention frame was evicted. Direction unchanged from T0's
statement — he keeps the FRESH observations; nothing is fabricated. The ring is
still **left untouched** (a certified constant is not this round's business).

### (v) The #218 build-up ruler — DROPPED (stated plainly, no silent cap)

Not measured: constructed-goal share, scramble share. The evidence for the drop,
on this very run: **960 / 960** qualifying moments in both arms is exactly
80 × 12 (the `PER_MATCH_CAP` binds in every match), and **0 / 12** matches in
either arm reached full time inside the walk — the census's origin classifier
needs the whole match. Carried instead:

| quantity | CONTROL | LOOK |
| --- | --- | --- |
| goals inside the walked window | **15** | **20** |
| ticks walked | 98,810 | 98,306 |
| matches reaching full time | 0 / 12 | 0 / 12 |

### The N rule, as computed in-probe

Source: the committed `data/o2-whether-sizing-rerun.json`
(sha256 `121ad7d42ec64c66eca45b119aa9105d733c301b9c3f48f141bf5203ea67b831`),
`o1armed` arm, 11,897 eligible / 200 matches = **59.485** eligible per seed.

| item | q1 = PERCEIVED hold | q2 = E-ABSTAIN-UNSEEN |
| --- | --- | --- |
| `p0` | 0.000672 | 0.687905 |
| `p1` (frozen alternative) | 0.0029835 (half-closure) | 0.667905 (−2 pp) |
| `m_iid` | 5,356.2 | 8,565.1 |
| `DEFF` (measured off #186's paired-delta CI) | 1.4614 | 2.2155 |
| `m_req` (eligible moments per arm) | 7,827.6 | 18,976.4 |
| **N(q)** (seeds per arm) | 132 | **320** |

**N\* = 320 seeds/arm**, binding quantity **E-ABSTAIN-UNSEEN**; the 800-seed cap
does **NOT** bind (`capBinds: false`). Battery block would be
**12,422,100 – 12,422,419**.

### The UNABRIDGED smoke transcript

```text

=============================================================================
O2-T1 WEDGE EXAM (#219.2) · mode smoke · N 12 seeds × 2 arms (CONTROL vs LOOK)
seeds 12422000..12422011
arms differ by EXACTLY o2Look; forcing = ONE LOOK PER RECEPTION (40-tick runway, 11-tick window)
N rule ⇒ N* 320 (cap 800)
=============================================================================
  pass 1 · seed 1/12 (12422000) · both arms done · 2.6 s
  pass 1 · seed 2/12 (12422001) · both arms done · 5.0 s
  pass 1 · seed 3/12 (12422002) · both arms done · 7.4 s
  pass 1 · seed 4/12 (12422003) · both arms done · 9.7 s
  pass 1 · seed 5/12 (12422004) · both arms done · 12.1 s
  pass 1 · seed 6/12 (12422005) · both arms done · 14.4 s
  pass 1 · seed 7/12 (12422006) · both arms done · 16.8 s
  pass 1 · seed 8/12 (12422007) · both arms done · 19.1 s
  pass 1 · seed 9/12 (12422008) · both arms done · 21.3 s
  pass 1 · seed 10/12 (12422009) · both arms done · 23.7 s
  pass 1 · seed 11/12 (12422010) · both arms done · 25.9 s
  pass 1 · seed 12/12 (12422011) · both arms done · 28.3 s
  pass 1 · G-REPRO-186 (a): #65 block 8500000 (48 matches, REPRO65 flags)...
  pass 1 · G-REPRO-186 (b): #186 block 12310000 (12 matches, CONTROL arm)...
  [o2-t1] pass 1 digest 4554ed0bb8efa002c62f6b891e7af776ece91b7a7253b361db12ab1ddd434966 — X-DET second pass...
  pass 2 · seed 1/12 (12422000) · both arms done · 2.3 s
  pass 2 · seed 2/12 (12422001) · both arms done · 4.7 s
  pass 2 · seed 3/12 (12422002) · both arms done · 7.0 s
  pass 2 · seed 4/12 (12422003) · both arms done · 9.4 s
  pass 2 · seed 5/12 (12422004) · both arms done · 11.7 s
  pass 2 · seed 6/12 (12422005) · both arms done · 14.0 s
  pass 2 · seed 7/12 (12422006) · both arms done · 16.3 s
  pass 2 · seed 8/12 (12422007) · both arms done · 18.5 s
  pass 2 · seed 9/12 (12422008) · both arms done · 20.8 s
  pass 2 · seed 10/12 (12422009) · both arms done · 23.1 s
  pass 2 · seed 11/12 (12422010) · both arms done · 25.4 s
  pass 2 · seed 12/12 (12422011) · both arms done · 27.7 s
  pass 2 · G-REPRO-186 (a): #65 block 8500000 (48 matches, REPRO65 flags)...
  pass 2 · G-REPRO-186 (b): #186 block 12310000 (12 matches, CONTROL arm)...
  [o2-t1] pass 2 digest 4554ed0bb8efa002c62f6b891e7af776ece91b7a7253b361db12ab1ddd434966 — X-DET PASS

=== O2-T1 WEDGE EXAM · mode smoke · 12422000..12422011 (12 seeds/arm, shared) ===
eligible moments  CONTROL 718 · LOOK 757   (qualifying 960 / 960)
THE RATES (paired per-match bootstrap, ratio-of-totals, 2.5/97.5, stats base 104600, 2000 resamples; Δ = LOOK − CONTROL)
  PERCEIVED hold             CONTROL     0.1393% · LOOK     0.0000% · Δ -0.001393 [-0.00431, 0] resolved=false
      n_hold           CONTROL 1 · LOOK 0
  TRUE-context share         CONTROL     0.6964% · LOOK     0.9247% · Δ 0.002283 [-0.003003, 0.008427] resolved=false
      n_true           CONTROL 5 · LOOK 7
  WEDGE (true÷perceived)     CONTROL 5× · LOOK NaN× · Δ NaN [NaN, NaN] resolved=false
      LOOK wedge CI [NaN, NaN] · excludesControlPoint=false
  E-ABSTAIN-UNSEEN           CONTROL    72.0056% · LOOK    63.6724% · Δ -0.083332 [-0.137655, -0.032488] resolved=true
  E-ACTNOW-DECLINED          CONTROL    27.5766% · LOOK    36.0634% · Δ 0.084868 [0.033913, 0.139313] resolved=true
  E-NOCELL                   CONTROL     0.2786% · LOOK     0.2642% · Δ -0.000144 [-0.00411, 0.004032] resolved=false
  M-CTX agreement            CONTROL    43.2161% · LOOK    56.7766% · Δ 0.135605 [0.008383, 0.262597] resolved=true
  M-CTX  pressure            CONTROL    78.8945% · LOOK    94.1392% · Δ 0.152447 [0.061596, 0.249826] resolved=true
  M-CTX  stale               CONTROL   100.0000% · LOOK   100.0000% · Δ 0 [0, 0] resolved=false
  M-CTX  support             CONTROL    56.2814% · LOOK    60.4396% · Δ 0.041582 [-0.066046, 0.152564] resolved=false
  DEV floor 0.29% cleared?   CONTROL false · LOOK false   (NOT re-cut, #65.1)
EXCLUSION MIX (firstTouch / mustKick / A0-Shoot / A0-Clear)
  CONTROL 160 / 45 / 35 / 2   ·   LOOK 101 / 68 / 32 / 2
(i) LOOK LEDGER   (the #194 abort-mix price is stated in the artifact beside these counts)
  CONTROL looks 0 · scans 0 · liveTicks 0
  LOOK    looks 436 · completed 335 · abortedLoss 94 · abortedPhase 0 · E-ENDED 7 · scans 4083 · liveTicks 4083 · seedsWithLooks 12/12
  frozen-phase ticks under a live window (NO scan, window cannot close — published, not dropped)   CONTROL 0 · LOOK 0
(ii) F-O2b EXPOSURE INSTRUMENTS
  turnover per spell         CONTROL    0.415951 · LOOK    0.423601 · Δ 0.00765 [-0.02383, 0.038604] resolved=false
  turnovers /1000 ticks      CONTROL    3.430827 · LOOK    2.848249 · Δ -0.582577 [-0.860543, -0.314299] resolved=true
  turnovers look-attributed at the LOSS TICK   CONTROL 0 · LOOK 18
  companions (no assumed identity): engine abortedLoss 0/94 · abortedLoss with OWN-team recovery 0/50 · unresolved at walk end 0/2
  spells 815/661 · turnovers 339/280 · ticks 98810/98306
(iv) RING PRESSURE (ring 16, retention 51 ticks)
  ringPressure share         CONTROL     0.0000% · LOOK     6.7114% · Δ 0.067114 [0.046917, 0.087744] resolved=true
  ringFull  CONTROL 686/706 · LOOK 724/745 · mean occupancy 15.746/15.76 · mean oldest age 181.411/147.213
(v) BUILD-UP RULER — constructed/scramble shares DROPPED (whole-match classifier vs a walk
    truncated at PER_MATCH_CAP); carried instead:
  goals in walked window  CONTROL 15 · LOOK 20 · matches reaching full time 0/0 of 12
N RULE (in-probe, from the committed #186 artifact)
  q1 perceived-hold half-closure: DEFF 1.4614 · m_req 7827.6 ⇒ N 132
  q2 E-ABSTAIN-UNSEEN −2pp:       DEFF 2.2155 · m_req 18976.4 ⇒ N 320
  binding q2AbstainUnseen ⇒ N* 320 (cap 800, binds=false) · battery block 12422100..12422419
GATES
  xDet               PASS
  xFpProd            PASS
  gRepro186          PASS
  xSrcUntouched      PASS
  xRingPin           PASS
  seedDisjoint       PASS
  statsDisjoint      PASS
  flagHygiene        PASS
  tableDrift         PASS
  gForce             PASS
  gCleanInvocation   PASS
  ALL                PASS
resultSha256 089a4292ce0dc2c0a8d19da0220f6e562d8be612d0ebe4812e914fa2c62fc2a3
wall 208 s (CONTEXT ONLY) · artifact docs/world-model/data/o2-t1-wedge-exam-smoke.json
```

### §CHECKS

```text
$ npx tsc --noEmit
(clean)

$ npm test
Test Files  128 passed (128)
     Tests  1206 passed (1206)
  Duration  239.72s

$ git diff --stat -- src
(empty)
```

### Deviations recorded

1. **(v) the #218 build-up ruler is DROPPED**, with mechanism and in-run evidence
   published (§FORM (v), §RESULT (v)). Per-arm goal counts over the sampled window
   are carried in its place. No silent cap.
2. **`abortedPhase` is read as a mechanism signal nowhere.** The #194 quirk is
   priced in §FORM (i) *before* any abort number appears, and the exposure question
   is instrumented independently in (ii).
3. **No composite verdict is emitted** (#203). The probe prints per-arm rows,
   paired deltas and the mechanical `resolved` CI flag (#186's own field); it
   never names F-O2a or F-O2b. Firing them is the commander's.
4. **Smoke N is a smoke N.** 718 / 757 eligible moments per arm against #186's
   11,897; the perceived-hold numerator is 1 and 0. Nothing on the rare-event axis
   can resolve here, and the wedge is undefined in the LOOK arm. The smoke's job is
   the gates, the ledger, the plumbing and the N rule — **the exam is the
   battery's**.
5. **`turnoversUnderLiveLook` was sharpened BEFORE the receipts run, and still
   reads 0.** A **guard-block dry run** (12,422,050–051, `O2T1_N=2
   O2T1_SKIP_FP=1` — gates `G-CLEAN-INVOCATION` and `X-FP-PROD` RED, exit 1,
   output to `/tmp`, adjudicating nothing) showed the first predicate ("a live
   window on the tick before the hand-over") returns 0 by construction. It was
   replaced by the current one *before* any receipts existed (the O2-T0 `G-SCAN`
   precedent). It still reads 0; the mechanism is a labelled hypothesis and the
   re-specification is **recorded debt for before the battery**, not a post-hoc
   re-cut.
6. **The (A3) percentile helper's NaN-unstable sort was repaired and the WHOLE
   smoke re-run.** #186's helper filtered non-finite bootstrap draws *after*
   sorting; `Array.sort` with a subtraction comparator is order-undefined once a
   NaN is present, so on the degenerate wedge arm the interval could come out
   `lower > upper` (the discarded first run printed a CONTROL wedge CI of
   `[11, 1.3333]`). The filter now runs **before** the sort and every CI publishes
   `finiteDraws` / `draws`. This repairs the estimator's **arithmetic** — it
   re-cuts no criterion, moves no population and changes no gate. The first run's
   artifact was **discarded, never committed**; the committed artifact is entirely
   from the repaired probe.
7. **The receipt paths carry no env override**, and an overridden run writes to
   `/tmp/o2-t1-guard-run.json` — the canonical-write hole of #217.2 is never opened
   here.
8. **Guard-block consumption:** seeds 12,422,050–12,422,051 were consumed by the
   dry run in (5), exactly the sub-block's declared purpose.
9. **G-FORCE's cadence limb was a MEASUREMENT-layer defect, found by the gate
   itself, and the smoke was re-run.** A completed N = 320 battery turned G-FORCE
   red (`scans` 115,308 vs `liveWindowTicks` 116,568). The deficit was **10 seeds
   × exactly 126 ticks**; a single-seed trace confirmed the mechanism before the
   counter was touched (72 `halftime` + 54 `kickoff` ticks on which `Match.step`
   returns early *before* `stepO2Look`, so no scan can be recorded and the window
   cannot close, while the probe's counter read `win !== null` on the wall clock).
   **The seam was intact** — the ledger closed, CONTROL was empty, looks fired on
   320/320 seeds. The gate did its job: it caught the probe, not the engine.
   Fixed in the O2-T0 `G-SCAN` precedent — `liveWindowTicks` moved onto the seam's
   own clock and the excluded ticks **published** as the named class
   `frozenPhaseTicksUnderLiveWindow` (§GATES, correction of record). **No
   criterion was re-cut and no number was dropped**; the identity is now asked of
   the clock it was always a statement about. That battery artifact was **never
   committed and has been deleted**, and **its exam numbers were never read** —
   only its gate block, and only to diagnose. `src/**` byte-untouched. The smoke
   re-run reproduces every previously committed number byte-identically; the new
   class reads 0/0 there.

### Disposition

The instrument is BUILT and SMOKED: every gate green, the seam demonstrably
reached at scale on every seed of the LOOK arm and demonstrably absent from
CONTROL, the #186 walker proved identical on two committed blocks (limb (a)
#65's, limb (b) #186's own rows), and the battery N derived at **320** seeds/arm
under the cap. **Nothing is adjudicated here** — the wedge exam's verdict, and
F-O2a / F-O2b, are the commander's, on the battery.
