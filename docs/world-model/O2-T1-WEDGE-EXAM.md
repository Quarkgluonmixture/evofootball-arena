# O2 T1 — THE WEDGE EXAM (the #186 sizing form re-run with the LOOK forced)

Status: **PRE-REGISTERED, SMOKED the same round, and the N\* = 320 BATTERY RUN.**
The §FORM / §SEEDS / §GATES sections below were written **FROZEN BEFORE SIGHT** —
from [`O2-LOOK-CONTRACT.md`](O2-LOOK-CONTRACT.md) §3, [`O2-OPENING-SIZING.md`](O2-OPENING-SIZING.md)
(#186) and [`O2-T0-DORMANT-SEAM.md`](O2-T0-DORMANT-SEAM.md) alone, before any
O2-T1 datum existed. The measured numbers arrive only in
[§RESULT (SMOKE)](#result--smoke) and
[§RESULT (FULL BATTERY)](#result--full-battery) at the foot, and every number
there is quoted **from the committed artifacts**
[`data/o2-t1-wedge-exam-smoke.json`](data/o2-t1-wedge-exam-smoke.json) and
[`data/o2-t1-wedge-exam.json`](data/o2-t1-wedge-exam.json), never from a console
transcript or from this doc's own prose (#181.2).

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

  ⭐⭐ **AMENDED ONTO THE PLAYING CLOCK — a second commander-ruled PRE-BATTERY
  amendment, made with NO exam number in existence** (the G-FORCE correction of
  record surfaced it; see §GATES). The supersession trail above stands unchanged —
  this amends the reading's **clock**, not its meaning. The predicate now in force,
  stated exactly:

  > The **team-level turnover definition is UNCHANGED** (the owning **side**
  > changes) and the **spell machinery feeding the RATE columns is UNTOUCHED** —
  > `possessionSpells`, `turnovers`, `turnoverPerSpell` and
  > `turnoversPer1000WalkedTicks` are computed exactly as before. Only
  > **ATTRIBUTION** moves. A turnover is **look-attributed** iff, at the losing
  > team's **LAST-CONTROLLED PLAYING TICK**, the body then in control held a live
  > `o2Look` window of his own. Attribution state advances **only on ticks the
  > engine actually plays** — the same clock `stepO2Look` runs on and the same
  > clock the G-FORCE cadence identity is read on. **Frozen-phase ticks**
  > (`kickoff` / `goalPause` / `halftime` early-return) write **no** attribution
  > state and form **no** attribution edge. An attribution edge whose spell was
  > terminated by such a **frozen-phase dead-ball reset** is not a live-play loss:
  > it is counted into its own named subclass
  > **`attributionEdgesAcrossFrozenReset`** (published per arm) and is **never**
  > mixed into `turnoversUnderLiveLook`.

  **Why this had to be amended, and why the distortion was ASYMMETRIC.** On a
  frozen tick `Match.step` never reaches the seam: no scan can be recorded and no
  window can close — yet the ball **can** be reset to a kickoff taker. The
  pre-amendment wall-clock reading let that dead-ball owner **overwrite** the
  losing carrier's last-controlled reading, silently discarding the attribution.
  **CONTROL carries no windows at all**, so this could only ever corrupt the
  **LOOK** arm's attributed count — which is precisely the column the **F-O2b**
  exposure limb reads. Left alone it would have biased the free-option question in
  a direction no one had chosen, on the one arm under exam. Amended **ex ante**,
  with the battery not yet re-run and no exam rate seen by anyone.

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
`f7a646eed18dee494d65f170c9d747925b99699e6fcfcaf1336e357780600b6a` ·
X-DET core digest `210e58967dc4d63f5c0761b9da5411a6e026695dd0107745ff456a44bb073d34`
(both passes) · 12 shared seeds 12,422,000–12,422,011 · **ALL GATES PASS**
(`allGatesPass: true`) · wall 210 s (CONTEXT ONLY, #128 — used in no rate, and
riding the UNHASHED envelope).**

⚠ **SUPERSESSION (3), stated plainly.** This is the **fourth** smoke artifact. The
third (`resultSha256`
`089a4292ce0dc2c0a8d19da0220f6e562d8be612d0ebe4812e914fa2c62fc2a3`, X-DET digest
`4554ed0bb8efa002c62f6b891e7af776ece91b7a7253b361db12ab1ddd434966`) is **not
withdrawn and remains in git history** at commit `48b059f`. It was superseded by
the **loss-tick playing-clock amendment** (§FORM (ii), commander-ruled with no
exam number in existence) plus the per-seed publication of
`frozenPhaseTicksUnderLiveWindow`. The hashed-body fields that moved are: the two
new `attributionEdgesAcrossFrozenReset` counters and their note, the 24 new
per-seed `frozenPhaseTicksUnderLiveWindow` columns (all **0** at smoke) and the
two amended `turnoversUnderLiveLookPredicate` strings. **No measured number moved
at all** — `turnoversUnderLiveLook` read **0 / 18** before the amendment and
**0 / 18** after it, exactly as the mechanism predicts (see (ii)).

⚠ **SUPERSESSION (2), stated plainly.** The
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
| **X-DET** | ✅ PASS | the whole computation twice; hashed bodies byte-identical: `digestA === digestB === 210e5896…3d34` |
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
| **turnovers look-attributed at the LOSS TICK** (`turnoversUnderLiveLook`, re-specified, now read on the **playing clock**) | 0 (by construction) | **18** | — | — |
| subclass — `attributionEdgesAcrossFrozenReset` (spell terminated by a half-time / kickoff dead-ball reset; **never mixed into the row above**) | 20 | **23** | — | — |
| companion (a) — engine `abortedLoss` | 0 | **94** | — | — |
| companion (b) — `abortedLossOwnTeamRecovery` (abort NOT ending as a team turnover) | 0 | **50** | — | — |
| `abortedLossUnresolvedAtWalkEnd` (audit residue for (b)) | 0 | **2** | — | — |

The re-specified column **fires**: of the LOOK arm's **280** team-level turnovers,
**18** are attributable to a look live at the losing team's last-controlled tick.
The old adjacency wording read 0 by construction; the debt booked in deviation 5
is **settled here, before the battery**, and the predicate's exact current form —
including the **playing-clock amendment** — is in §FORM (ii).

⭐ **The playing-clock amendment moved this column by ZERO at smoke** (it read 18
before and after), which is exactly what the mechanism predicts: the amendment can
only change an attribution whose losing carrier held a **live window** into a
frozen tick, and `frozenPhaseTicksUnderLiveWindow` is **0** on this block. The
subclass row is nevertheless **non-zero** (20 / 23) because frozen-phase resets
themselves are ordinary here — every match has kickoffs — and those edges were
always in the population; they are now **named and shown** instead of being
silently arbitrated by whichever owner the dead ball happened to hold. Note the
subclass is **not** an exposure cost and is **not** comparable across the arms as
a rate: it is a population census of a dead-ball boundary.

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
  pass 1 · seed 2/12 (12422001) · both arms done · 5.1 s
  pass 1 · seed 3/12 (12422002) · both arms done · 7.5 s
  pass 1 · seed 4/12 (12422003) · both arms done · 9.9 s
  pass 1 · seed 5/12 (12422004) · both arms done · 12.3 s
  pass 1 · seed 6/12 (12422005) · both arms done · 14.7 s
  pass 1 · seed 7/12 (12422006) · both arms done · 17.0 s
  pass 1 · seed 8/12 (12422007) · both arms done · 19.3 s
  pass 1 · seed 9/12 (12422008) · both arms done · 21.6 s
  pass 1 · seed 10/12 (12422009) · both arms done · 24.0 s
  pass 1 · seed 11/12 (12422010) · both arms done · 26.2 s
  pass 1 · seed 12/12 (12422011) · both arms done · 28.7 s
  pass 1 · G-REPRO-186 (a): #65 block 8500000 (48 matches, REPRO65 flags)...
  pass 1 · G-REPRO-186 (b): #186 block 12310000 (12 matches, CONTROL arm)...
  [o2-t1] pass 1 digest 210e58967dc4d63f5c0761b9da5411a6e026695dd0107745ff456a44bb073d34 — X-DET second pass...
  pass 2 · seed 1/12 (12422000) · both arms done · 2.5 s
  pass 2 · seed 2/12 (12422001) · both arms done · 4.8 s
  pass 2 · seed 3/12 (12422002) · both arms done · 7.2 s
  pass 2 · seed 4/12 (12422003) · both arms done · 9.6 s
  pass 2 · seed 5/12 (12422004) · both arms done · 11.9 s
  pass 2 · seed 6/12 (12422005) · both arms done · 14.3 s
  pass 2 · seed 7/12 (12422006) · both arms done · 16.7 s
  pass 2 · seed 8/12 (12422007) · both arms done · 19.0 s
  pass 2 · seed 9/12 (12422008) · both arms done · 21.3 s
  pass 2 · seed 10/12 (12422009) · both arms done · 23.7 s
  pass 2 · seed 11/12 (12422010) · both arms done · 26.0 s
  pass 2 · seed 12/12 (12422011) · both arms done · 28.4 s
  pass 2 · G-REPRO-186 (a): #65 block 8500000 (48 matches, REPRO65 flags)...
  pass 2 · G-REPRO-186 (b): #186 block 12310000 (12 matches, CONTROL arm)...
  [o2-t1] pass 2 digest 210e58967dc4d63f5c0761b9da5411a6e026695dd0107745ff456a44bb073d34 — X-DET PASS

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
  turnovers look-attributed at the LOSS TICK (PLAYING clock)   CONTROL 0 · LOOK 18
  attribution edges across a FROZEN-PHASE dead-ball reset (own subclass, NEVER mixed in)   CONTROL 20 · LOOK 23
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
resultSha256 f7a646eed18dee494d65f170c9d747925b99699e6fcfcaf1336e357780600b6a
wall 210 s (CONTEXT ONLY) · artifact docs/world-model/data/o2-t1-wedge-exam-smoke.json
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
10. **The loss-tick attribution was AMENDED ONTO THE PLAYING CLOCK, ex ante, and
    a named subclass published.** Diagnosing (9) surfaced that the *same*
    frozen-tick blind spot reached a second column: on a frozen tick the ball can
    be reset to a kickoff taker, and the wall-clock reading let that dead-ball
    owner overwrite the losing carrier's last-controlled look reading. Because
    **CONTROL carries no windows**, the distortion was **asymmetric** — it could
    only corrupt the LOOK arm's `turnoversUnderLiveLook`, the column the F-O2b
    exposure limb reads. Ruled an **amendment** by the commander with **no exam
    number in existence**: attribution now advances only on played ticks, and
    attribution edges terminated by a frozen-phase dead-ball reset go to their own
    published subclass `attributionEdgesAcrossFrozenReset` rather than being
    silently arbitrated (§FORM (ii)). **The team-level turnover definition and the
    rate columns are untouched.** At smoke the amendment moved **nothing** —
    `turnoversUnderLiveLook` reads 0 / 18 before and after, as the mechanism
    predicts (`frozenPhaseTicksUnderLiveWindow` is 0 on this block) — and the
    subclass reads 20 / 23, a population that was always there and is now named.
    `frozenPhaseTicksUnderLiveWindow` was also added to the **per-seed** rows, so
    the next cadence deficit is attributable without a re-run.

### Disposition

The instrument is BUILT and SMOKED: every gate green, the seam demonstrably
reached at scale on every seed of the LOOK arm and demonstrably absent from
CONTROL, the #186 walker proved identical on two committed blocks (limb (a)
#65's, limb (b) #186's own rows), and the battery N derived at **320** seeds/arm
under the cap. **Nothing is adjudicated here** — the wedge exam's verdict, and
F-O2a / F-O2b, are the commander's, on the battery.

---

## §RESULT — FULL BATTERY

*(Every number in this section is quoted FROM the committed artifact
[`data/o2-t1-wedge-exam.json`](data/o2-t1-wedge-exam.json), which is recomputed by
`O2T1_MODE=full npx tsx scripts/probes/o2-t1-wedge-exam.ts`. The doc never carries
evidence the artifact does not — #181.2.)*

**Ran 2026-08-10 · `resultSha256`
`2100760d267b197b18a7625e39bfc35c458e0f2227dfc2495d224f6eaf8a616b` ·
X-DET core digest `b1489dd4b00faf4c7a8b8763b1dd155d7db2863465b53cf4cbfe6219e841126f`
(both passes) · 320 shared seeds 12,422,100–12,422,419 (N* = 320, the pre-registered
rule's binding limb) · **ALL 11 GATES PASS** (`allGatesPass: true`) · wall 1,590 s
(CONTEXT ONLY, #128 — used in no rate, and riding the UNHASHED envelope).**

⚠ **This is the RELAUNCHED battery.** The first battery on this block failed
**G-FORCE** red on its cadence-identity limb; it was diagnosed **blind** (its gate
block only, no exam number read by anyone), fixed at the measurement layer, and its
artifact was **never committed and was deleted** — the full trail is in §GATES
*"G-FORCE — correction of record"*, in §FORM (ii), and in deviations 9 and 10.
`src/**` is byte-untouched across the whole episode
(`envelopeContextOnly.srcDiffStat` is empty on this run).

⭐ **The #221 diagnosis is validated by its own named class, arithmetically.** The
red run recorded `scans` **115,308** against `liveWindowTicks` **116,568**. This run
records `scans` **115,308** — the *same* number, as it must be, the engine being
byte-identical — against `liveWindowTicks` **115,308** and
`frozenPhaseTicksUnderLiveWindow` **1,260**. And **116,568 − 115,308 = 1,260 =
10 × 126**, exactly the ten half-time-frozen windows the blind diagnosis predicted,
at exactly the predicted 126 ticks each (72 half-time + 54 kickoff). The deficit did
not disappear when the gate went green: it was **re-filed under its own name**.

### Gate table — every value recomputed in-probe on the run that wrote the artifact

| gate | verdict | evidence |
| --- | --- | --- |
| **X-DET** | ✅ PASS | the whole computation (both arms + both repro walks + every summary and bootstrap) run **twice**; hashed bodies byte-identical: `digestA === digestB === b1489dd4…126f` |
| **X-FP-PROD** | ✅ PASS | observed `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` == the shipped baseline (seed 1337, 2 seasons) |
| **G-REPRO-186** | ✅ PASS | limb (a) #65's block 8,500,000–047 reproduced **identically** against the #186 target; limb (b) #186's own block 12,310,000–011 reproduced **row-for-row on the CONTROL arm**, **0** mismatches |
| **X-SRC-UNTOUCHED** | ✅ PASS | `git diff --stat -- src` **empty** on the run that wrote the artifact |
| **X-RING-PIN** | ✅ PASS | `SCAN_FRAME_RING` read out of `src/sim/Match.ts` in-probe == **16** == expected |
| **SEED-DISJOINT** | ✅ PASS | exam block 12,422,100–12,422,419: **0** collisions against the complete consumed ledger; sub-blocks ordered (smoke 12,422,000–011 · guard 12,422,050–099 · battery 12,422,100–899) |
| **STATS-DISJOINT** | ✅ PASS | stats base **104,600**, min gap **200** from every published ≥91,100-regime base |
| **FLAG-HYGIENE** | ✅ PASS | CONTROL == `CENSUS_FLAGS` + `o1PassWindup` exactly; LOOK == CONTROL + `o2Look` and **nothing else** (key-set equality + exactly one added key) |
| **TABLE-DRIFT** | ✅ PASS | injected certified table `tableSha` == `184d1e84…0b53`; holdable-cell set == `["0\|0\|0"]` |
| **G-FORCE** | ✅ PASS | LOOK: **11,964** looks, `looks > 0` on **320/320** seeds, **scans 115,308 === live window ticks 115,308** (the T0 cadence identity, read on the playing clock), `frozenPhaseTicksUnderLiveWindow` **1,260**, ledger closes with unexplained arms **0**. CONTROL: ledger **empty** (0 looks · 0 scans · 0 live ticks · 0 frozen ticks) |
| **G-CLEAN-INVOCATION** | ✅ PASS | no env override in force (`O2T1_N` null, `O2T1_SKIP_FP` false); not routed to the guard block |

### The headline table — both arms, 320 shared seeds

Shares are of **eligible moments**: CONTROL **19,088** · LOOK **20,138**, from
**25,582 / 25,600** qualifying (retained fraction **74.615 % / 78.6641 %**).
Eligible per match: CONTROL mean **59.65** [47, 73] · LOOK mean **62.931** [47, 74].
CIs are the paired per-match cluster bootstrap (2,000 resamples, ratio-of-totals,
2.5/97.5, stats base 104,600, 320 clusters); `Δ` = **LOOK − CONTROL**, `resolved`
iff the CI excludes 0.

| quantity | CONTROL | LOOK | paired Δ (pp) [2.5, 97.5] | resolved? |
| --- | --- | --- | --- | --- |
| **PERCEIVED hold rate** (= the `D-HOLD` class share) | **0.0733 %** (n=14) | **0.0546 %** (n=11) | −0.0187 [−0.0754, +0.0367] | **no** |
| **TRUE-context share** | **0.6391 %** (n=122) | **0.4817 %** (n=97) | **−0.1575** [−0.2901, −0.0172] | **YES** |
| **wedge ratio (true ÷ perceived)** | **8.7143×**, CI [5.2083, 18.4286] (2,000/2,000 finite draws) | **8.8182×**, CI [4.8421, 22.2] (1,999/2,000 finite draws) | **+0.1039** [−10.2778, +13.55] (1,999 finite) | **no** |
| **E-ABSTAIN-UNSEEN** | **68.179 %** (n=13,014) | **61.878 %** (n=12,461) | **−6.3009** [−7.4516, −5.1142] | **YES** |
| **E-ACTNOW-DECLINED** | 31.4229 % (n=5,998) | 37.6899 % (n=7,590) | **+6.2671** [+5.0524, +7.4442] | **YES** |
| **E-NOCELL** | 0.3248 % (n=62) | 0.3774 % (n=76) | +0.0526 [−0.0507, +0.1615] | no |
| **M-CTX agreement (overall)** | **50.815 %** (placed 6,012) | **55.9137 %** (placed 7,601) | **+5.0987** [+2.8628, +7.2823] | **YES** |
| — M-CTX **pressure** | 84.0652 % | 90.7381 % | **+6.6729** [+4.9261, +8.4665] | **YES** |
| — M-CTX **stale** | 100 % | 100 % | 0 [0, 0] | no |
| — M-CTX **support** | 58.5828 % | 59.0843 % | +0.5015 [−1.899, +2.8913] | no |
| **turnover per spell** | **0.409024** | **0.443299** | **+0.034275** [+0.024942, +0.043182] | **YES** |
| **turnovers / 1,000 walked ticks** | **3.368084** | **3.239743** | **−0.128341** [−0.232284, −0.02734] | **YES** |
| **ringPressure share** | **0 %** | **6.2923 %** | **+0.062923** [+0.059084, +0.06665] | **YES** |
| **DEV floor 0.29 % cleared?** | **no** | **no** | — | — |
| matches to accumulate N_hold ≥ 446 | 10,195 | 12,975 | — | — |

The **DEV floor is NOT re-cut** (#65.1): it stands at **0.29 %** share with
`N_hold` floor **446**, and **neither arm clears it** at this N — the perceived-hold
rate is 0.0733 % / 0.0546 %, so the floor would need **10,195 / 12,975** matches per
arm. This is published as a standing measurement fact about the hold channel's
rarity, exactly as it was at smoke; nothing here re-cuts it and nothing here is
adjudicated from it.

The **wedge contrast is defined on both arms at this N** (unlike the smoke, where
the LOOK arm held zero times): both wedge CIs are wide, they overlap heavily, the
paired delta's CI spans 0, and `lookWedgeCiExcludesControlPoint` is **false**. Those
are mechanical CI properties (#203), stated and not interpreted here.

### Exclusion mix (the declared population consequence, published so it is visible)

| exclusion | CONTROL | LOOK |
| --- | --- | --- |
| first-touch window | 4,260 | 3,269 |
| forced restart (`restartKickGid`) | 1,343 | 1,397 |
| A0 `Shoot` | 878 | 764 |
| A0 `ClearBall` | 13 | 32 |

This is the shift §FORM declared **before sight**: under the re-decide lock the A0
one-step fork reads the incumbent `Dribble` label in the LOOK arm, so the
`Shoot`/`ClearBall` exclusions fire less often there and the first-touch exclusion
falls — which is why the LOOK arm retains **more** eligible moments (20,138 vs
19,088) from an almost identical qualifying count (25,600 vs 25,582). Declared
consequence, published, not corrected for.

### (i) The LOOK ledger — per arm, at scale

| quantity | CONTROL | LOOK |
| --- | --- | --- |
| looks armed | 0 | **11,964** |
| completed at the frozen 11 ticks | 0 | **9,600** |
| aborted — not owned at the next head-of-tick (`abortedLoss`) | 0 | **2,222** |
| aborted — phase / stun / sending-off | 0 | **0** |
| E-ENDED (the walk ended mid-window) | 0 | **142** |
| scan moments recorded | 0 | **115,308** |
| live window ticks (playing clock) | 0 | **115,308** |
| `frozenPhaseTicksUnderLiveWindow` (no scan possible; window cannot close) | 0 | **1,260** |
| seeds with `looks > 0` | 0 / 320 | **320 / 320** |
| unexplained arms | 0 | **0** |

The ledger **closes exactly**: 9,600 + 2,222 + 0 + 142 = **11,964**. The cadence
identity holds on the nose (**115,308 === 115,308**), and the frozen class carries
**1,260** ticks beside it — the ten half-time-spanning windows, 126 ticks each.
`abortedPhase` reads **0** at 11,964 arms, exactly the **#194** by-construction
result priced in §FORM (i) *before* any abort number existed: `Match.step` returns
early during the paused phases *before* `stepO2Look`, so a window that spans a pause
closes as `abortedLoss` at the next playing tick instead. `abortedLoss` therefore
means *"not owned by the looker at the next head-of-tick"* — a **superset** of a duel
loss, and no mechanism claim is made from this mix.

### (ii) F-O2b exposure instruments — per arm

| quantity | CONTROL | LOOK | paired Δ [2.5, 97.5] | resolved? |
| --- | --- | --- | --- | --- |
| walked ticks | 2,627,013 | 2,588,168 | — | — |
| possession spells | 21,632 | 18,915 | — | — |
| turnovers | 8,848 | 8,385 | — | — |
| **turnover per spell** | **0.409024** | **0.443299** | **+0.034275** [+0.024942, +0.043182] | **YES** |
| **turnovers / 1,000 walked ticks** | **3.368084** | **3.239743** | **−0.128341** [−0.232284, −0.02734] | **YES** |
| **turnovers look-attributed at the LOSS TICK** (`turnoversUnderLiveLook`, playing clock) | 0 (by construction) | **414** | — | — |
| subclass — `attributionEdgesAcrossFrozenReset` (spell terminated by a half-time / kickoff dead-ball reset; **never mixed into the row above**) | 517 | **512** | — | — |
| companion (a) — engine `abortedLoss` | 0 | **2,222** | — | — |
| companion (b) — `abortedLossOwnTeamRecovery` (abort NOT ending as a team turnover) | 0 | **1,024** | — | — |
| `abortedLossUnresolvedAtWalkEnd` (audit residue for (b)) | 0 | **25** | — | — |

The re-specified, playing-clock-amended column **fires at scale**: of the LOOK arm's
**8,385** team-level turnovers, **414** are attributable to a look live at the losing
team's last-controlled **playing** tick. CONTROL reads **0 by construction** — no
window can exist there.

The frozen-reset subclass is a **boundary census, not an exposure cost**: **517**
CONTROL / **512** LOOK attribution edges were terminated by a half-time or kickoff
dead ball rather than by a loss in live play. It sits at nearly the same size in both
arms — as it must, dead-ball boundaries being a property of the fixture and not of
the look — and it is **never** added to the 414. Its purpose is that this population
is **visible data** instead of being silently arbitrated by whichever owner the dead
ball happened to hold (§FORM (ii)).

The three companion columns are **data with no assumed identity** — no claim is made
that they measure the same quantity. Read only through the #194 price: engine
`abortedLoss` = **2,222** is *"not owned by the looker at the next head-of-tick"*; of
those, **1,024** were followed by an established control by the **looker's own side**
(own-team recovery — the abort did **not** end as a team-level turnover), **25** never
saw another established control before the walk stopped, and the remaining **1,173**
were followed by opposition control. That 1,173 is *not* the same population as the
414: the 414 counts **turnovers** whose losing last-controlled playing tick was under a
live look, the 1,173 counts **aborted windows** followed by opposition control. The
arithmetic between them is the commander's to read, not this doc's.

### (iii) M-CTX per-feature — read with T0 HONESTY LIMIT 2

| feature | CONTROL | LOOK | paired Δ (pp) [2.5, 97.5] | resolved? |
| --- | --- | --- | --- | --- |
| overall agreement | 50.815 % | 55.9137 % | **+5.0987** [+2.8628, +7.2823] | **YES** |
| pressure | 84.0652 % | 90.7381 % | **+6.6729** [+4.9261, +8.4665] | **YES** |
| stale | 100 % | 100 % | 0 [0, 0] | no |
| support | 58.5828 % | 59.0843 % | +0.5015 [−1.899, +2.8913] | no |

Placed contexts: CONTROL **6,012** · LOOK **7,601**. **T0 HONESTY LIMIT 2 is
binding on any reading of these rows**: a look refreshes **pressure** and **support**
toward truth while `staleBand` reads the team's own possession clock — which runs
while the body stands there and is **not a percept**. At this block `stale` agreement
is **100 % in both arms**, so the overall figure is carried by pressure and support
alone. The decomposition is published precisely so the overall number is not read
without it.

### (iv) Ring pressure (REPORTED, T0 HONESTY LIMIT 3)

| quantity | CONTROL | LOOK |
| --- | --- | --- |
| ring size / retention | 16 / 51 ticks | 16 / 51 ticks |
| moments with a readable ring | 18,768 | 19,818 |
| ring FULL at the moment | 18,257 | 19,239 |
| **ringPressure moments** (full **and** oldest frame younger than retention) | **0** | **1,247** |
| **ringPressure share** | **0 %** | **6.2923 %** (Δ +0.062923 [+0.059084, +0.06665], **resolved**) |
| mean occupancy | 15.761 | 15.763 |
| mean oldest-frame age (ticks) | 182.47 | 143.582 |

The ring is essentially always full in both arms (18,257/18,768 and 19,239/19,818);
what moves is the **age** of its oldest frame — mean 182.47 ticks in CONTROL against
143.582 in LOOK — which is what carries the ringPressure share from 0 to 6.2923 %.
**REPORTED, per T0 HONESTY LIMIT 3**; no mechanism claim is made here.

### (v) The #218 build-up ruler — DROPPED (stated plainly, no silent cap)

| quantity | CONTROL | LOOK |
| --- | --- | --- |
| goals inside the walked window | **416** | **415** |
| ticks walked | 2,627,013 | 2,588,168 |
| matches reaching full time | **3 / 320** | **0 / 320** |

The #218 constructed-goal and scramble shares are **NOT measured here**: their census
origin classifier needs a **whole-match** walk, and this walk truncates at
`PER_MATCH_CAP` = 80 sampled moments — only **3** CONTROL matches and **0** LOOK
matches reached full time. Per-arm goal counts over the sampled window are carried in
their place. Stated plainly, not silently capped.

### The N rule, as computed in-probe (unchanged — it is an ex-ante rule)

| limb | DEFF | m_req | ⇒ N |
| --- | --- | --- | --- |
| q1 perceived-hold half-closure | 1.4614 | 7,827.6 | 132 |
| **q2 E-ABSTAIN-UNSEEN −2 pp (binding)** | 2.2155 | 18,976.4 | **320** |

**N\* = 320** (cap 800, not binding) ⇒ battery block **12,422,100–12,422,419**, which
is the block this run walked.

### Pre-registered criteria — restated verbatim, adjudicated NOWHERE in this doc

> "pre-registered success = perceived-context hold classification rate rises
> toward the true-context rate (wedge point falls toward 1×, CI excluding the
> baseline wedge), E-ABSTAIN-UNSEEN falls resolvedly"

The pre-named FAIL branches, restated verbatim and **not fired here**: **F-O2a** —
*the ledger shows looks completing and percepts refreshing but classification does not
move*; **F-O2b** — *hold/survival improves at ~zero measured exposure cost*.

⚠ **This section emits PER-ARM ROWS, paired deltas and the mechanical `resolved` CI
flags only (#203).** The probe names neither F-O2a nor F-O2b, and neither does this
doc. **Adjudication is the commander's ruling, recorded in `PROGRAMME-RULINGS.md`,
not here.**

### §CHECKS (full battery)

```text
$ git diff --stat -- src
(empty)            # X-SRC-UNTOUCHED, recomputed in-probe on the run itself

$ git rev-parse --short HEAD
d3029f7            # envelopeContextOnly.headContextOnly (UNHASHED envelope, #197-M1/#198)
```

### The UNABRIDGED full-battery transcript

```text

=============================================================================
O2-T1 WEDGE EXAM (#219.2) · mode full · N 320 seeds × 2 arms (CONTROL vs LOOK)
seeds 12422100..12422419
arms differ by EXACTLY o2Look; forcing = ONE LOOK PER RECEPTION (40-tick runway, 11-tick window)
N rule ⇒ N* 320 (cap 800)
=============================================================================
RESUME requested but no checkpoint at /tmp/o2-t1-checkpoint.jsonl — starting FRESH.
checkpoint ARMED at /tmp/o2-t1-checkpoint.jsonl (one line per finished (pass, seed) unit)
  pass 1 · seed 1/320 (12422100) · both arms done · 2.5 s
  pass 1 · seed 2/320 (12422101) · both arms done · 4.8 s
  pass 1 · seed 3/320 (12422102) · both arms done · 7.1 s
  pass 1 · seed 4/320 (12422103) · both arms done · 9.4 s
  pass 1 · seed 5/320 (12422104) · both arms done · 11.7 s
  pass 1 · seed 6/320 (12422105) · both arms done · 14.0 s
  pass 1 · seed 7/320 (12422106) · both arms done · 16.2 s
  pass 1 · seed 8/320 (12422107) · both arms done · 18.5 s
  pass 1 · seed 9/320 (12422108) · both arms done · 20.7 s
  pass 1 · seed 10/320 (12422109) · both arms done · 23.0 s
  pass 1 · seed 11/320 (12422110) · both arms done · 25.2 s
  pass 1 · seed 12/320 (12422111) · both arms done · 27.6 s
  pass 1 · seed 13/320 (12422112) · both arms done · 29.9 s
  pass 1 · seed 14/320 (12422113) · both arms done · 32.1 s
  pass 1 · seed 15/320 (12422114) · both arms done · 34.4 s
  pass 1 · seed 16/320 (12422115) · both arms done · 36.7 s
  pass 1 · seed 17/320 (12422116) · both arms done · 39.0 s
  pass 1 · seed 18/320 (12422117) · both arms done · 41.3 s
  pass 1 · seed 19/320 (12422118) · both arms done · 43.4 s
  pass 1 · seed 20/320 (12422119) · both arms done · 45.7 s
  pass 1 · seed 21/320 (12422120) · both arms done · 48.1 s
  pass 1 · seed 22/320 (12422121) · both arms done · 50.5 s
  pass 1 · seed 23/320 (12422122) · both arms done · 52.8 s
  pass 1 · seed 24/320 (12422123) · both arms done · 55.1 s
  pass 1 · seed 25/320 (12422124) · both arms done · 57.4 s
  pass 1 · seed 26/320 (12422125) · both arms done · 59.7 s
  pass 1 · seed 27/320 (12422126) · both arms done · 62.1 s
  pass 1 · seed 28/320 (12422127) · both arms done · 64.4 s
  pass 1 · seed 29/320 (12422128) · both arms done · 66.7 s
  pass 1 · seed 30/320 (12422129) · both arms done · 69.0 s
  pass 1 · seed 31/320 (12422130) · both arms done · 71.5 s
  pass 1 · seed 32/320 (12422131) · both arms done · 73.9 s
  pass 1 · seed 33/320 (12422132) · both arms done · 76.1 s
  pass 1 · seed 34/320 (12422133) · both arms done · 78.6 s
  pass 1 · seed 35/320 (12422134) · both arms done · 81.0 s
  pass 1 · seed 36/320 (12422135) · both arms done · 83.4 s
  pass 1 · seed 37/320 (12422136) · both arms done · 85.7 s
  pass 1 · seed 38/320 (12422137) · both arms done · 88.1 s
  pass 1 · seed 39/320 (12422138) · both arms done · 90.5 s
  pass 1 · seed 40/320 (12422139) · both arms done · 92.9 s
  pass 1 · seed 41/320 (12422140) · both arms done · 95.2 s
  pass 1 · seed 42/320 (12422141) · both arms done · 97.6 s
  pass 1 · seed 43/320 (12422142) · both arms done · 100.0 s
  pass 1 · seed 44/320 (12422143) · both arms done · 102.4 s
  pass 1 · seed 45/320 (12422144) · both arms done · 104.8 s
  pass 1 · seed 46/320 (12422145) · both arms done · 107.1 s
  pass 1 · seed 47/320 (12422146) · both arms done · 109.4 s
  pass 1 · seed 48/320 (12422147) · both arms done · 111.7 s
  pass 1 · seed 49/320 (12422148) · both arms done · 114.1 s
  pass 1 · seed 50/320 (12422149) · both arms done · 116.5 s
  pass 1 · seed 51/320 (12422150) · both arms done · 119.0 s
  pass 1 · seed 52/320 (12422151) · both arms done · 121.4 s
  pass 1 · seed 53/320 (12422152) · both arms done · 123.7 s
  pass 1 · seed 54/320 (12422153) · both arms done · 126.1 s
  pass 1 · seed 55/320 (12422154) · both arms done · 128.5 s
  pass 1 · seed 56/320 (12422155) · both arms done · 131.0 s
  pass 1 · seed 57/320 (12422156) · both arms done · 133.2 s
  pass 1 · seed 58/320 (12422157) · both arms done · 135.6 s
  pass 1 · seed 59/320 (12422158) · both arms done · 138.0 s
  pass 1 · seed 60/320 (12422159) · both arms done · 140.4 s
  pass 1 · seed 61/320 (12422160) · both arms done · 142.7 s
  pass 1 · seed 62/320 (12422161) · both arms done · 145.2 s
  pass 1 · seed 63/320 (12422162) · both arms done · 147.4 s
  pass 1 · seed 64/320 (12422163) · both arms done · 149.9 s
  pass 1 · seed 65/320 (12422164) · both arms done · 152.3 s
  pass 1 · seed 66/320 (12422165) · both arms done · 154.6 s
  pass 1 · seed 67/320 (12422166) · both arms done · 157.1 s
  pass 1 · seed 68/320 (12422167) · both arms done · 159.5 s
  pass 1 · seed 69/320 (12422168) · both arms done · 161.9 s
  pass 1 · seed 70/320 (12422169) · both arms done · 164.3 s
  pass 1 · seed 71/320 (12422170) · both arms done · 166.6 s
  pass 1 · seed 72/320 (12422171) · both arms done · 168.9 s
  pass 1 · seed 73/320 (12422172) · both arms done · 171.0 s
  pass 1 · seed 74/320 (12422173) · both arms done · 173.2 s
  pass 1 · seed 75/320 (12422174) · both arms done · 175.4 s
  pass 1 · seed 76/320 (12422175) · both arms done · 177.7 s
  pass 1 · seed 77/320 (12422176) · both arms done · 179.9 s
  pass 1 · seed 78/320 (12422177) · both arms done · 182.1 s
  pass 1 · seed 79/320 (12422178) · both arms done · 184.4 s
  pass 1 · seed 80/320 (12422179) · both arms done · 186.7 s
  pass 1 · seed 81/320 (12422180) · both arms done · 189.0 s
  pass 1 · seed 82/320 (12422181) · both arms done · 191.3 s
  pass 1 · seed 83/320 (12422182) · both arms done · 193.6 s
  pass 1 · seed 84/320 (12422183) · both arms done · 195.7 s
  pass 1 · seed 85/320 (12422184) · both arms done · 198.0 s
  pass 1 · seed 86/320 (12422185) · both arms done · 200.3 s
  pass 1 · seed 87/320 (12422186) · both arms done · 202.6 s
  pass 1 · seed 88/320 (12422187) · both arms done · 204.8 s
  pass 1 · seed 89/320 (12422188) · both arms done · 207.1 s
  pass 1 · seed 90/320 (12422189) · both arms done · 209.3 s
  pass 1 · seed 91/320 (12422190) · both arms done · 211.5 s
  pass 1 · seed 92/320 (12422191) · both arms done · 213.8 s
  pass 1 · seed 93/320 (12422192) · both arms done · 216.1 s
  pass 1 · seed 94/320 (12422193) · both arms done · 218.3 s
  pass 1 · seed 95/320 (12422194) · both arms done · 220.5 s
  pass 1 · seed 96/320 (12422195) · both arms done · 222.8 s
  pass 1 · seed 97/320 (12422196) · both arms done · 225.1 s
  pass 1 · seed 98/320 (12422197) · both arms done · 227.3 s
  pass 1 · seed 99/320 (12422198) · both arms done · 229.6 s
  pass 1 · seed 100/320 (12422199) · both arms done · 231.8 s
  pass 1 · seed 101/320 (12422200) · both arms done · 234.1 s
  pass 1 · seed 102/320 (12422201) · both arms done · 236.4 s
  pass 1 · seed 103/320 (12422202) · both arms done · 238.6 s
  pass 1 · seed 104/320 (12422203) · both arms done · 240.8 s
  pass 1 · seed 105/320 (12422204) · both arms done · 243.1 s
  pass 1 · seed 106/320 (12422205) · both arms done · 245.2 s
  pass 1 · seed 107/320 (12422206) · both arms done · 247.5 s
  pass 1 · seed 108/320 (12422207) · both arms done · 249.7 s
  pass 1 · seed 109/320 (12422208) · both arms done · 251.9 s
  pass 1 · seed 110/320 (12422209) · both arms done · 254.2 s
  pass 1 · seed 111/320 (12422210) · both arms done · 256.5 s
  pass 1 · seed 112/320 (12422211) · both arms done · 258.7 s
  pass 1 · seed 113/320 (12422212) · both arms done · 261.0 s
  pass 1 · seed 114/320 (12422213) · both arms done · 263.3 s
  pass 1 · seed 115/320 (12422214) · both arms done · 265.4 s
  pass 1 · seed 116/320 (12422215) · both arms done · 267.7 s
  pass 1 · seed 117/320 (12422216) · both arms done · 270.0 s
  pass 1 · seed 118/320 (12422217) · both arms done · 272.2 s
  pass 1 · seed 119/320 (12422218) · both arms done · 274.4 s
  pass 1 · seed 120/320 (12422219) · both arms done · 276.7 s
  pass 1 · seed 121/320 (12422220) · both arms done · 279.2 s
  pass 1 · seed 122/320 (12422221) · both arms done · 281.4 s
  pass 1 · seed 123/320 (12422222) · both arms done · 283.6 s
  pass 1 · seed 124/320 (12422223) · both arms done · 285.9 s
  pass 1 · seed 125/320 (12422224) · both arms done · 288.2 s
  pass 1 · seed 126/320 (12422225) · both arms done · 290.5 s
  pass 1 · seed 127/320 (12422226) · both arms done · 292.7 s
  pass 1 · seed 128/320 (12422227) · both arms done · 295.0 s
  pass 1 · seed 129/320 (12422228) · both arms done · 297.3 s
  pass 1 · seed 130/320 (12422229) · both arms done · 299.6 s
  pass 1 · seed 131/320 (12422230) · both arms done · 301.7 s
  pass 1 · seed 132/320 (12422231) · both arms done · 303.9 s
  pass 1 · seed 133/320 (12422232) · both arms done · 306.2 s
  pass 1 · seed 134/320 (12422233) · both arms done · 308.4 s
  pass 1 · seed 135/320 (12422234) · both arms done · 310.7 s
  pass 1 · seed 136/320 (12422235) · both arms done · 312.9 s
  pass 1 · seed 137/320 (12422236) · both arms done · 315.0 s
  pass 1 · seed 138/320 (12422237) · both arms done · 317.3 s
  pass 1 · seed 139/320 (12422238) · both arms done · 319.4 s
  pass 1 · seed 140/320 (12422239) · both arms done · 321.6 s
  pass 1 · seed 141/320 (12422240) · both arms done · 323.8 s
  pass 1 · seed 142/320 (12422241) · both arms done · 326.0 s
  pass 1 · seed 143/320 (12422242) · both arms done · 328.3 s
  pass 1 · seed 144/320 (12422243) · both arms done · 330.5 s
  pass 1 · seed 145/320 (12422244) · both arms done · 332.8 s
  pass 1 · seed 146/320 (12422245) · both arms done · 334.9 s
  pass 1 · seed 147/320 (12422246) · both arms done · 337.1 s
  pass 1 · seed 148/320 (12422247) · both arms done · 339.4 s
  pass 1 · seed 149/320 (12422248) · both arms done · 341.7 s
  pass 1 · seed 150/320 (12422249) · both arms done · 343.9 s
  pass 1 · seed 151/320 (12422250) · both arms done · 346.1 s
  pass 1 · seed 152/320 (12422251) · both arms done · 348.4 s
  pass 1 · seed 153/320 (12422252) · both arms done · 350.6 s
  pass 1 · seed 154/320 (12422253) · both arms done · 352.9 s
  pass 1 · seed 155/320 (12422254) · both arms done · 355.1 s
  pass 1 · seed 156/320 (12422255) · both arms done · 357.4 s
  pass 1 · seed 157/320 (12422256) · both arms done · 359.7 s
  pass 1 · seed 158/320 (12422257) · both arms done · 362.0 s
  pass 1 · seed 159/320 (12422258) · both arms done · 364.1 s
  pass 1 · seed 160/320 (12422259) · both arms done · 366.4 s
  pass 1 · seed 161/320 (12422260) · both arms done · 368.6 s
  pass 1 · seed 162/320 (12422261) · both arms done · 371.0 s
  pass 1 · seed 163/320 (12422262) · both arms done · 373.2 s
  pass 1 · seed 164/320 (12422263) · both arms done · 375.4 s
  pass 1 · seed 165/320 (12422264) · both arms done · 377.8 s
  pass 1 · seed 166/320 (12422265) · both arms done · 380.0 s
  pass 1 · seed 167/320 (12422266) · both arms done · 382.2 s
  pass 1 · seed 168/320 (12422267) · both arms done · 384.4 s
  pass 1 · seed 169/320 (12422268) · both arms done · 386.6 s
  pass 1 · seed 170/320 (12422269) · both arms done · 388.9 s
  pass 1 · seed 171/320 (12422270) · both arms done · 391.2 s
  pass 1 · seed 172/320 (12422271) · both arms done · 393.6 s
  pass 1 · seed 173/320 (12422272) · both arms done · 395.9 s
  pass 1 · seed 174/320 (12422273) · both arms done · 398.2 s
  pass 1 · seed 175/320 (12422274) · both arms done · 400.4 s
  pass 1 · seed 176/320 (12422275) · both arms done · 402.7 s
  pass 1 · seed 177/320 (12422276) · both arms done · 405.0 s
  pass 1 · seed 178/320 (12422277) · both arms done · 407.1 s
  pass 1 · seed 179/320 (12422278) · both arms done · 409.4 s
  pass 1 · seed 180/320 (12422279) · both arms done · 411.7 s
  pass 1 · seed 181/320 (12422280) · both arms done · 413.9 s
  pass 1 · seed 182/320 (12422281) · both arms done · 416.2 s
  pass 1 · seed 183/320 (12422282) · both arms done · 418.5 s
  pass 1 · seed 184/320 (12422283) · both arms done · 420.7 s
  pass 1 · seed 185/320 (12422284) · both arms done · 422.9 s
  pass 1 · seed 186/320 (12422285) · both arms done · 425.1 s
  pass 1 · seed 187/320 (12422286) · both arms done · 427.3 s
  pass 1 · seed 188/320 (12422287) · both arms done · 429.6 s
  pass 1 · seed 189/320 (12422288) · both arms done · 431.9 s
  pass 1 · seed 190/320 (12422289) · both arms done · 434.1 s
  pass 1 · seed 191/320 (12422290) · both arms done · 436.4 s
  pass 1 · seed 192/320 (12422291) · both arms done · 438.7 s
  pass 1 · seed 193/320 (12422292) · both arms done · 441.0 s
  pass 1 · seed 194/320 (12422293) · both arms done · 443.3 s
  pass 1 · seed 195/320 (12422294) · both arms done · 445.5 s
  pass 1 · seed 196/320 (12422295) · both arms done · 447.8 s
  pass 1 · seed 197/320 (12422296) · both arms done · 450.0 s
  pass 1 · seed 198/320 (12422297) · both arms done · 452.3 s
  pass 1 · seed 199/320 (12422298) · both arms done · 454.5 s
  pass 1 · seed 200/320 (12422299) · both arms done · 456.7 s
  pass 1 · seed 201/320 (12422300) · both arms done · 459.1 s
  pass 1 · seed 202/320 (12422301) · both arms done · 461.3 s
  pass 1 · seed 203/320 (12422302) · both arms done · 463.4 s
  pass 1 · seed 204/320 (12422303) · both arms done · 465.7 s
  pass 1 · seed 205/320 (12422304) · both arms done · 468.1 s
  pass 1 · seed 206/320 (12422305) · both arms done · 470.3 s
  pass 1 · seed 207/320 (12422306) · both arms done · 472.4 s
  pass 1 · seed 208/320 (12422307) · both arms done · 474.7 s
  pass 1 · seed 209/320 (12422308) · both arms done · 476.9 s
  pass 1 · seed 210/320 (12422309) · both arms done · 479.2 s
  pass 1 · seed 211/320 (12422310) · both arms done · 481.4 s
  pass 1 · seed 212/320 (12422311) · both arms done · 483.6 s
  pass 1 · seed 213/320 (12422312) · both arms done · 485.8 s
  pass 1 · seed 214/320 (12422313) · both arms done · 487.9 s
  pass 1 · seed 215/320 (12422314) · both arms done · 490.2 s
  pass 1 · seed 216/320 (12422315) · both arms done · 492.5 s
  pass 1 · seed 217/320 (12422316) · both arms done · 494.7 s
  pass 1 · seed 218/320 (12422317) · both arms done · 496.9 s
  pass 1 · seed 219/320 (12422318) · both arms done · 499.1 s
  pass 1 · seed 220/320 (12422319) · both arms done · 501.2 s
  pass 1 · seed 221/320 (12422320) · both arms done · 503.4 s
  pass 1 · seed 222/320 (12422321) · both arms done · 505.6 s
  pass 1 · seed 223/320 (12422322) · both arms done · 507.9 s
  pass 1 · seed 224/320 (12422323) · both arms done · 510.1 s
  pass 1 · seed 225/320 (12422324) · both arms done · 512.3 s
  pass 1 · seed 226/320 (12422325) · both arms done · 514.6 s
  pass 1 · seed 227/320 (12422326) · both arms done · 516.8 s
  pass 1 · seed 228/320 (12422327) · both arms done · 519.0 s
  pass 1 · seed 229/320 (12422328) · both arms done · 521.3 s
  pass 1 · seed 230/320 (12422329) · both arms done · 523.6 s
  pass 1 · seed 231/320 (12422330) · both arms done · 525.8 s
  pass 1 · seed 232/320 (12422331) · both arms done · 528.0 s
  pass 1 · seed 233/320 (12422332) · both arms done · 530.3 s
  pass 1 · seed 234/320 (12422333) · both arms done · 532.5 s
  pass 1 · seed 235/320 (12422334) · both arms done · 534.7 s
  pass 1 · seed 236/320 (12422335) · both arms done · 537.0 s
  pass 1 · seed 237/320 (12422336) · both arms done · 539.3 s
  pass 1 · seed 238/320 (12422337) · both arms done · 541.5 s
  pass 1 · seed 239/320 (12422338) · both arms done · 543.8 s
  pass 1 · seed 240/320 (12422339) · both arms done · 546.0 s
  pass 1 · seed 241/320 (12422340) · both arms done · 548.2 s
  pass 1 · seed 242/320 (12422341) · both arms done · 550.5 s
  pass 1 · seed 243/320 (12422342) · both arms done · 552.7 s
  pass 1 · seed 244/320 (12422343) · both arms done · 554.9 s
  pass 1 · seed 245/320 (12422344) · both arms done · 557.1 s
  pass 1 · seed 246/320 (12422345) · both arms done · 559.3 s
  pass 1 · seed 247/320 (12422346) · both arms done · 561.6 s
  pass 1 · seed 248/320 (12422347) · both arms done · 563.9 s
  pass 1 · seed 249/320 (12422348) · both arms done · 566.1 s
  pass 1 · seed 250/320 (12422349) · both arms done · 568.3 s
  pass 1 · seed 251/320 (12422350) · both arms done · 570.5 s
  pass 1 · seed 252/320 (12422351) · both arms done · 572.7 s
  pass 1 · seed 253/320 (12422352) · both arms done · 575.0 s
  pass 1 · seed 254/320 (12422353) · both arms done · 577.3 s
  pass 1 · seed 255/320 (12422354) · both arms done · 579.5 s
  pass 1 · seed 256/320 (12422355) · both arms done · 581.7 s
  pass 1 · seed 257/320 (12422356) · both arms done · 583.8 s
  pass 1 · seed 258/320 (12422357) · both arms done · 586.0 s
  pass 1 · seed 259/320 (12422358) · both arms done · 588.2 s
  pass 1 · seed 260/320 (12422359) · both arms done · 590.4 s
  pass 1 · seed 261/320 (12422360) · both arms done · 592.7 s
  pass 1 · seed 262/320 (12422361) · both arms done · 595.0 s
  pass 1 · seed 263/320 (12422362) · both arms done · 597.3 s
  pass 1 · seed 264/320 (12422363) · both arms done · 599.5 s
  pass 1 · seed 265/320 (12422364) · both arms done · 601.6 s
  pass 1 · seed 266/320 (12422365) · both arms done · 603.9 s
  pass 1 · seed 267/320 (12422366) · both arms done · 606.1 s
  pass 1 · seed 268/320 (12422367) · both arms done · 608.4 s
  pass 1 · seed 269/320 (12422368) · both arms done · 610.5 s
  pass 1 · seed 270/320 (12422369) · both arms done · 612.7 s
  pass 1 · seed 271/320 (12422370) · both arms done · 615.0 s
  pass 1 · seed 272/320 (12422371) · both arms done · 617.2 s
  pass 1 · seed 273/320 (12422372) · both arms done · 619.4 s
  pass 1 · seed 274/320 (12422373) · both arms done · 621.6 s
  pass 1 · seed 275/320 (12422374) · both arms done · 623.9 s
  pass 1 · seed 276/320 (12422375) · both arms done · 626.1 s
  pass 1 · seed 277/320 (12422376) · both arms done · 628.3 s
  pass 1 · seed 278/320 (12422377) · both arms done · 630.5 s
  pass 1 · seed 279/320 (12422378) · both arms done · 632.8 s
  pass 1 · seed 280/320 (12422379) · both arms done · 635.0 s
  pass 1 · seed 281/320 (12422380) · both arms done · 637.2 s
  pass 1 · seed 282/320 (12422381) · both arms done · 639.5 s
  pass 1 · seed 283/320 (12422382) · both arms done · 641.8 s
  pass 1 · seed 284/320 (12422383) · both arms done · 644.0 s
  pass 1 · seed 285/320 (12422384) · both arms done · 646.2 s
  pass 1 · seed 286/320 (12422385) · both arms done · 648.4 s
  pass 1 · seed 287/320 (12422386) · both arms done · 650.6 s
  pass 1 · seed 288/320 (12422387) · both arms done · 653.0 s
  pass 1 · seed 289/320 (12422388) · both arms done · 655.3 s
  pass 1 · seed 290/320 (12422389) · both arms done · 657.6 s
  pass 1 · seed 291/320 (12422390) · both arms done · 659.8 s
  pass 1 · seed 292/320 (12422391) · both arms done · 661.9 s
  pass 1 · seed 293/320 (12422392) · both arms done · 664.2 s
  pass 1 · seed 294/320 (12422393) · both arms done · 666.4 s
  pass 1 · seed 295/320 (12422394) · both arms done · 668.7 s
  pass 1 · seed 296/320 (12422395) · both arms done · 670.8 s
  pass 1 · seed 297/320 (12422396) · both arms done · 673.1 s
  pass 1 · seed 298/320 (12422397) · both arms done · 675.2 s
  pass 1 · seed 299/320 (12422398) · both arms done · 677.4 s
  pass 1 · seed 300/320 (12422399) · both arms done · 679.6 s
  pass 1 · seed 301/320 (12422400) · both arms done · 681.9 s
  pass 1 · seed 302/320 (12422401) · both arms done · 684.0 s
  pass 1 · seed 303/320 (12422402) · both arms done · 686.2 s
  pass 1 · seed 304/320 (12422403) · both arms done · 688.6 s
  pass 1 · seed 305/320 (12422404) · both arms done · 690.8 s
  pass 1 · seed 306/320 (12422405) · both arms done · 693.0 s
  pass 1 · seed 307/320 (12422406) · both arms done · 695.3 s
  pass 1 · seed 308/320 (12422407) · both arms done · 697.5 s
  pass 1 · seed 309/320 (12422408) · both arms done · 699.8 s
  pass 1 · seed 310/320 (12422409) · both arms done · 702.1 s
  pass 1 · seed 311/320 (12422410) · both arms done · 704.4 s
  pass 1 · seed 312/320 (12422411) · both arms done · 706.7 s
  pass 1 · seed 313/320 (12422412) · both arms done · 708.9 s
  pass 1 · seed 314/320 (12422413) · both arms done · 711.2 s
  pass 1 · seed 315/320 (12422414) · both arms done · 713.4 s
  pass 1 · seed 316/320 (12422415) · both arms done · 715.7 s
  pass 1 · seed 317/320 (12422416) · both arms done · 717.8 s
  pass 1 · seed 318/320 (12422417) · both arms done · 720.0 s
  pass 1 · seed 319/320 (12422418) · both arms done · 722.3 s
  pass 1 · seed 320/320 (12422419) · both arms done · 724.5 s
  pass 1 · G-REPRO-186 (a): #65 block 8500000 (48 matches, REPRO65 flags)...
  pass 1 · G-REPRO-186 (b): #186 block 12310000 (12 matches, CONTROL arm)...
  [o2-t1] pass 1 digest b1489dd4b00faf4c7a8b8763b1dd155d7db2863465b53cf4cbfe6219e841126f — X-DET second pass...
  pass 2 · seed 1/320 (12422100) · both arms done · 2.2 s
  pass 2 · seed 2/320 (12422101) · both arms done · 4.5 s
  pass 2 · seed 3/320 (12422102) · both arms done · 6.6 s
  pass 2 · seed 4/320 (12422103) · both arms done · 8.8 s
  pass 2 · seed 5/320 (12422104) · both arms done · 11.1 s
  pass 2 · seed 6/320 (12422105) · both arms done · 13.3 s
  pass 2 · seed 7/320 (12422106) · both arms done · 15.5 s
  pass 2 · seed 8/320 (12422107) · both arms done · 17.7 s
  pass 2 · seed 9/320 (12422108) · both arms done · 19.9 s
  pass 2 · seed 10/320 (12422109) · both arms done · 22.2 s
  pass 2 · seed 11/320 (12422110) · both arms done · 24.4 s
  pass 2 · seed 12/320 (12422111) · both arms done · 26.7 s
  pass 2 · seed 13/320 (12422112) · both arms done · 29.0 s
  pass 2 · seed 14/320 (12422113) · both arms done · 31.2 s
  pass 2 · seed 15/320 (12422114) · both arms done · 33.4 s
  pass 2 · seed 16/320 (12422115) · both arms done · 35.7 s
  pass 2 · seed 17/320 (12422116) · both arms done · 38.0 s
  pass 2 · seed 18/320 (12422117) · both arms done · 40.2 s
  pass 2 · seed 19/320 (12422118) · both arms done · 42.3 s
  pass 2 · seed 20/320 (12422119) · both arms done · 44.6 s
  pass 2 · seed 21/320 (12422120) · both arms done · 46.8 s
  pass 2 · seed 22/320 (12422121) · both arms done · 49.1 s
  pass 2 · seed 23/320 (12422122) · both arms done · 51.3 s
  pass 2 · seed 24/320 (12422123) · both arms done · 53.5 s
  pass 2 · seed 25/320 (12422124) · both arms done · 55.8 s
  pass 2 · seed 26/320 (12422125) · both arms done · 58.0 s
  pass 2 · seed 27/320 (12422126) · both arms done · 60.2 s
  pass 2 · seed 28/320 (12422127) · both arms done · 62.4 s
  pass 2 · seed 29/320 (12422128) · both arms done · 64.6 s
  pass 2 · seed 30/320 (12422129) · both arms done · 66.8 s
  pass 2 · seed 31/320 (12422130) · both arms done · 69.1 s
  pass 2 · seed 32/320 (12422131) · both arms done · 71.3 s
  pass 2 · seed 33/320 (12422132) · both arms done · 73.4 s
  pass 2 · seed 34/320 (12422133) · both arms done · 75.7 s
  pass 2 · seed 35/320 (12422134) · both arms done · 78.0 s
  pass 2 · seed 36/320 (12422135) · both arms done · 80.2 s
  pass 2 · seed 37/320 (12422136) · both arms done · 82.4 s
  pass 2 · seed 38/320 (12422137) · both arms done · 84.7 s
  pass 2 · seed 39/320 (12422138) · both arms done · 87.0 s
  pass 2 · seed 40/320 (12422139) · both arms done · 89.2 s
  pass 2 · seed 41/320 (12422140) · both arms done · 91.3 s
  pass 2 · seed 42/320 (12422141) · both arms done · 93.6 s
  pass 2 · seed 43/320 (12422142) · both arms done · 95.8 s
  pass 2 · seed 44/320 (12422143) · both arms done · 98.1 s
  pass 2 · seed 45/320 (12422144) · both arms done · 100.4 s
  pass 2 · seed 46/320 (12422145) · both arms done · 102.6 s
  pass 2 · seed 47/320 (12422146) · both arms done · 104.7 s
  pass 2 · seed 48/320 (12422147) · both arms done · 106.8 s
  pass 2 · seed 49/320 (12422148) · both arms done · 109.1 s
  pass 2 · seed 50/320 (12422149) · both arms done · 111.4 s
  pass 2 · seed 51/320 (12422150) · both arms done · 113.7 s
  pass 2 · seed 52/320 (12422151) · both arms done · 115.9 s
  pass 2 · seed 53/320 (12422152) · both arms done · 118.1 s
  pass 2 · seed 54/320 (12422153) · both arms done · 120.4 s
  pass 2 · seed 55/320 (12422154) · both arms done · 122.6 s
  pass 2 · seed 56/320 (12422155) · both arms done · 124.9 s
  pass 2 · seed 57/320 (12422156) · both arms done · 127.0 s
  pass 2 · seed 58/320 (12422157) · both arms done · 129.2 s
  pass 2 · seed 59/320 (12422158) · both arms done · 131.5 s
  pass 2 · seed 60/320 (12422159) · both arms done · 133.7 s
  pass 2 · seed 61/320 (12422160) · both arms done · 136.0 s
  pass 2 · seed 62/320 (12422161) · both arms done · 138.2 s
  pass 2 · seed 63/320 (12422162) · both arms done · 140.4 s
  pass 2 · seed 64/320 (12422163) · both arms done · 142.6 s
  pass 2 · seed 65/320 (12422164) · both arms done · 144.9 s
  pass 2 · seed 66/320 (12422165) · both arms done · 147.1 s
  pass 2 · seed 67/320 (12422166) · both arms done · 149.4 s
  pass 2 · seed 68/320 (12422167) · both arms done · 151.7 s
  pass 2 · seed 69/320 (12422168) · both arms done · 153.9 s
  pass 2 · seed 70/320 (12422169) · both arms done · 156.2 s
  pass 2 · seed 71/320 (12422170) · both arms done · 158.5 s
  pass 2 · seed 72/320 (12422171) · both arms done · 160.8 s
  pass 2 · seed 73/320 (12422172) · both arms done · 162.9 s
  pass 2 · seed 74/320 (12422173) · both arms done · 165.1 s
  pass 2 · seed 75/320 (12422174) · both arms done · 167.2 s
  pass 2 · seed 76/320 (12422175) · both arms done · 169.5 s
  pass 2 · seed 77/320 (12422176) · both arms done · 171.7 s
  pass 2 · seed 78/320 (12422177) · both arms done · 173.9 s
  pass 2 · seed 79/320 (12422178) · both arms done · 176.2 s
  pass 2 · seed 80/320 (12422179) · both arms done · 178.6 s
  pass 2 · seed 81/320 (12422180) · both arms done · 180.9 s
  pass 2 · seed 82/320 (12422181) · both arms done · 183.3 s
  pass 2 · seed 83/320 (12422182) · both arms done · 185.6 s
  pass 2 · seed 84/320 (12422183) · both arms done · 187.8 s
  pass 2 · seed 85/320 (12422184) · both arms done · 190.0 s
  pass 2 · seed 86/320 (12422185) · both arms done · 192.3 s
  pass 2 · seed 87/320 (12422186) · both arms done · 194.6 s
  pass 2 · seed 88/320 (12422187) · both arms done · 196.8 s
  pass 2 · seed 89/320 (12422188) · both arms done · 199.1 s
  pass 2 · seed 90/320 (12422189) · both arms done · 201.3 s
  pass 2 · seed 91/320 (12422190) · both arms done · 203.5 s
  pass 2 · seed 92/320 (12422191) · both arms done · 205.8 s
  pass 2 · seed 93/320 (12422192) · both arms done · 208.1 s
  pass 2 · seed 94/320 (12422193) · both arms done · 210.3 s
  pass 2 · seed 95/320 (12422194) · both arms done · 212.6 s
  pass 2 · seed 96/320 (12422195) · both arms done · 214.8 s
  pass 2 · seed 97/320 (12422196) · both arms done · 217.1 s
  pass 2 · seed 98/320 (12422197) · both arms done · 219.4 s
  pass 2 · seed 99/320 (12422198) · both arms done · 221.6 s
  pass 2 · seed 100/320 (12422199) · both arms done · 223.9 s
  pass 2 · seed 101/320 (12422200) · both arms done · 226.2 s
  pass 2 · seed 102/320 (12422201) · both arms done · 228.4 s
  pass 2 · seed 103/320 (12422202) · both arms done · 230.6 s
  pass 2 · seed 104/320 (12422203) · both arms done · 232.9 s
  pass 2 · seed 105/320 (12422204) · both arms done · 235.1 s
  pass 2 · seed 106/320 (12422205) · both arms done · 237.3 s
  pass 2 · seed 107/320 (12422206) · both arms done · 239.6 s
  pass 2 · seed 108/320 (12422207) · both arms done · 241.7 s
  pass 2 · seed 109/320 (12422208) · both arms done · 243.9 s
  pass 2 · seed 110/320 (12422209) · both arms done · 246.2 s
  pass 2 · seed 111/320 (12422210) · both arms done · 248.5 s
  pass 2 · seed 112/320 (12422211) · both arms done · 250.7 s
  pass 2 · seed 113/320 (12422212) · both arms done · 253.0 s
  pass 2 · seed 114/320 (12422213) · both arms done · 255.3 s
  pass 2 · seed 115/320 (12422214) · both arms done · 257.5 s
  pass 2 · seed 116/320 (12422215) · both arms done · 259.7 s
  pass 2 · seed 117/320 (12422216) · both arms done · 262.0 s
  pass 2 · seed 118/320 (12422217) · both arms done · 264.1 s
  pass 2 · seed 119/320 (12422218) · both arms done · 266.4 s
  pass 2 · seed 120/320 (12422219) · both arms done · 268.7 s
  pass 2 · seed 121/320 (12422220) · both arms done · 271.1 s
  pass 2 · seed 122/320 (12422221) · both arms done · 273.3 s
  pass 2 · seed 123/320 (12422222) · both arms done · 275.5 s
  pass 2 · seed 124/320 (12422223) · both arms done · 277.8 s
  pass 2 · seed 125/320 (12422224) · both arms done · 280.0 s
  pass 2 · seed 126/320 (12422225) · both arms done · 282.3 s
  pass 2 · seed 127/320 (12422226) · both arms done · 284.6 s
  pass 2 · seed 128/320 (12422227) · both arms done · 286.9 s
  pass 2 · seed 129/320 (12422228) · both arms done · 289.2 s
  pass 2 · seed 130/320 (12422229) · both arms done · 291.4 s
  pass 2 · seed 131/320 (12422230) · both arms done · 293.6 s
  pass 2 · seed 132/320 (12422231) · both arms done · 295.8 s
  pass 2 · seed 133/320 (12422232) · both arms done · 298.1 s
  pass 2 · seed 134/320 (12422233) · both arms done · 300.3 s
  pass 2 · seed 135/320 (12422234) · both arms done · 302.6 s
  pass 2 · seed 136/320 (12422235) · both arms done · 304.8 s
  pass 2 · seed 137/320 (12422236) · both arms done · 307.0 s
  pass 2 · seed 138/320 (12422237) · both arms done · 309.3 s
  pass 2 · seed 139/320 (12422238) · both arms done · 311.4 s
  pass 2 · seed 140/320 (12422239) · both arms done · 313.6 s
  pass 2 · seed 141/320 (12422240) · both arms done · 315.9 s
  pass 2 · seed 142/320 (12422241) · both arms done · 318.1 s
  pass 2 · seed 143/320 (12422242) · both arms done · 320.4 s
  pass 2 · seed 144/320 (12422243) · both arms done · 322.6 s
  pass 2 · seed 145/320 (12422244) · both arms done · 324.9 s
  pass 2 · seed 146/320 (12422245) · both arms done · 327.1 s
  pass 2 · seed 147/320 (12422246) · both arms done · 329.3 s
  pass 2 · seed 148/320 (12422247) · both arms done · 331.6 s
  pass 2 · seed 149/320 (12422248) · both arms done · 333.9 s
  pass 2 · seed 150/320 (12422249) · both arms done · 336.2 s
  pass 2 · seed 151/320 (12422250) · both arms done · 338.4 s
  pass 2 · seed 152/320 (12422251) · both arms done · 340.7 s
  pass 2 · seed 153/320 (12422252) · both arms done · 342.9 s
  pass 2 · seed 154/320 (12422253) · both arms done · 345.2 s
  pass 2 · seed 155/320 (12422254) · both arms done · 347.5 s
  pass 2 · seed 156/320 (12422255) · both arms done · 349.8 s
  pass 2 · seed 157/320 (12422256) · both arms done · 352.1 s
  pass 2 · seed 158/320 (12422257) · both arms done · 354.4 s
  pass 2 · seed 159/320 (12422258) · both arms done · 356.6 s
  pass 2 · seed 160/320 (12422259) · both arms done · 358.9 s
  pass 2 · seed 161/320 (12422260) · both arms done · 361.2 s
  pass 2 · seed 162/320 (12422261) · both arms done · 363.5 s
  pass 2 · seed 163/320 (12422262) · both arms done · 365.7 s
  pass 2 · seed 164/320 (12422263) · both arms done · 368.0 s
  pass 2 · seed 165/320 (12422264) · both arms done · 370.4 s
  pass 2 · seed 166/320 (12422265) · both arms done · 372.7 s
  pass 2 · seed 167/320 (12422266) · both arms done · 374.9 s
  pass 2 · seed 168/320 (12422267) · both arms done · 377.2 s
  pass 2 · seed 169/320 (12422268) · both arms done · 379.4 s
  pass 2 · seed 170/320 (12422269) · both arms done · 381.7 s
  pass 2 · seed 171/320 (12422270) · both arms done · 384.0 s
  pass 2 · seed 172/320 (12422271) · both arms done · 386.4 s
  pass 2 · seed 173/320 (12422272) · both arms done · 388.7 s
  pass 2 · seed 174/320 (12422273) · both arms done · 391.1 s
  pass 2 · seed 175/320 (12422274) · both arms done · 393.4 s
  pass 2 · seed 176/320 (12422275) · both arms done · 395.7 s
  pass 2 · seed 177/320 (12422276) · both arms done · 398.0 s
  pass 2 · seed 178/320 (12422277) · both arms done · 400.1 s
  pass 2 · seed 179/320 (12422278) · both arms done · 402.4 s
  pass 2 · seed 180/320 (12422279) · both arms done · 404.8 s
  pass 2 · seed 181/320 (12422280) · both arms done · 407.1 s
  pass 2 · seed 182/320 (12422281) · both arms done · 409.3 s
  pass 2 · seed 183/320 (12422282) · both arms done · 411.6 s
  pass 2 · seed 184/320 (12422283) · both arms done · 413.9 s
  pass 2 · seed 185/320 (12422284) · both arms done · 416.1 s
  pass 2 · seed 186/320 (12422285) · both arms done · 418.3 s
  pass 2 · seed 187/320 (12422286) · both arms done · 420.5 s
  pass 2 · seed 188/320 (12422287) · both arms done · 422.9 s
  pass 2 · seed 189/320 (12422288) · both arms done · 425.1 s
  pass 2 · seed 190/320 (12422289) · both arms done · 427.4 s
  pass 2 · seed 191/320 (12422290) · both arms done · 429.7 s
  pass 2 · seed 192/320 (12422291) · both arms done · 432.0 s
  pass 2 · seed 193/320 (12422292) · both arms done · 434.3 s
  pass 2 · seed 194/320 (12422293) · both arms done · 436.7 s
  pass 2 · seed 195/320 (12422294) · both arms done · 439.0 s
  pass 2 · seed 196/320 (12422295) · both arms done · 441.2 s
  pass 2 · seed 197/320 (12422296) · both arms done · 443.5 s
  pass 2 · seed 198/320 (12422297) · both arms done · 445.7 s
  pass 2 · seed 199/320 (12422298) · both arms done · 447.9 s
  pass 2 · seed 200/320 (12422299) · both arms done · 450.1 s
  pass 2 · seed 201/320 (12422300) · both arms done · 452.5 s
  pass 2 · seed 202/320 (12422301) · both arms done · 454.7 s
  pass 2 · seed 203/320 (12422302) · both arms done · 456.9 s
  pass 2 · seed 204/320 (12422303) · both arms done · 459.2 s
  pass 2 · seed 205/320 (12422304) · both arms done · 461.6 s
  pass 2 · seed 206/320 (12422305) · both arms done · 463.8 s
  pass 2 · seed 207/320 (12422306) · both arms done · 466.0 s
  pass 2 · seed 208/320 (12422307) · both arms done · 468.3 s
  pass 2 · seed 209/320 (12422308) · both arms done · 470.5 s
  pass 2 · seed 210/320 (12422309) · both arms done · 472.8 s
  pass 2 · seed 211/320 (12422310) · both arms done · 475.0 s
  pass 2 · seed 212/320 (12422311) · both arms done · 477.3 s
  pass 2 · seed 213/320 (12422312) · both arms done · 479.5 s
  pass 2 · seed 214/320 (12422313) · both arms done · 481.6 s
  pass 2 · seed 215/320 (12422314) · both arms done · 484.0 s
  pass 2 · seed 216/320 (12422315) · both arms done · 486.2 s
  pass 2 · seed 217/320 (12422316) · both arms done · 488.5 s
  pass 2 · seed 218/320 (12422317) · both arms done · 490.7 s
  pass 2 · seed 219/320 (12422318) · both arms done · 492.9 s
  pass 2 · seed 220/320 (12422319) · both arms done · 495.1 s
  pass 2 · seed 221/320 (12422320) · both arms done · 497.3 s
  pass 2 · seed 222/320 (12422321) · both arms done · 499.6 s
  pass 2 · seed 223/320 (12422322) · both arms done · 501.9 s
  pass 2 · seed 224/320 (12422323) · both arms done · 504.1 s
  pass 2 · seed 225/320 (12422324) · both arms done · 506.4 s
  pass 2 · seed 226/320 (12422325) · both arms done · 508.7 s
  pass 2 · seed 227/320 (12422326) · both arms done · 510.9 s
  pass 2 · seed 228/320 (12422327) · both arms done · 513.1 s
  pass 2 · seed 229/320 (12422328) · both arms done · 515.4 s
  pass 2 · seed 230/320 (12422329) · both arms done · 517.7 s
  pass 2 · seed 231/320 (12422330) · both arms done · 520.0 s
  pass 2 · seed 232/320 (12422331) · both arms done · 522.2 s
  pass 2 · seed 233/320 (12422332) · both arms done · 524.5 s
  pass 2 · seed 234/320 (12422333) · both arms done · 526.7 s
  pass 2 · seed 235/320 (12422334) · both arms done · 529.0 s
  pass 2 · seed 236/320 (12422335) · both arms done · 531.2 s
  pass 2 · seed 237/320 (12422336) · both arms done · 533.5 s
  pass 2 · seed 238/320 (12422337) · both arms done · 535.7 s
  pass 2 · seed 239/320 (12422338) · both arms done · 538.0 s
  pass 2 · seed 240/320 (12422339) · both arms done · 540.2 s
  pass 2 · seed 241/320 (12422340) · both arms done · 542.4 s
  pass 2 · seed 242/320 (12422341) · both arms done · 544.6 s
  pass 2 · seed 243/320 (12422342) · both arms done · 546.8 s
  pass 2 · seed 244/320 (12422343) · both arms done · 549.1 s
  pass 2 · seed 245/320 (12422344) · both arms done · 551.3 s
  pass 2 · seed 246/320 (12422345) · both arms done · 553.5 s
  pass 2 · seed 247/320 (12422346) · both arms done · 555.8 s
  pass 2 · seed 248/320 (12422347) · both arms done · 558.1 s
  pass 2 · seed 249/320 (12422348) · both arms done · 560.2 s
  pass 2 · seed 250/320 (12422349) · both arms done · 562.5 s
  pass 2 · seed 251/320 (12422350) · both arms done · 564.7 s
  pass 2 · seed 252/320 (12422351) · both arms done · 566.9 s
  pass 2 · seed 253/320 (12422352) · both arms done · 569.2 s
  pass 2 · seed 254/320 (12422353) · both arms done · 571.5 s
  pass 2 · seed 255/320 (12422354) · both arms done · 573.7 s
  pass 2 · seed 256/320 (12422355) · both arms done · 575.9 s
  pass 2 · seed 257/320 (12422356) · both arms done · 577.9 s
  pass 2 · seed 258/320 (12422357) · both arms done · 580.1 s
  pass 2 · seed 259/320 (12422358) · both arms done · 582.3 s
  pass 2 · seed 260/320 (12422359) · both arms done · 584.5 s
  pass 2 · seed 261/320 (12422360) · both arms done · 586.8 s
  pass 2 · seed 262/320 (12422361) · both arms done · 589.1 s
  pass 2 · seed 263/320 (12422362) · both arms done · 591.4 s
  pass 2 · seed 264/320 (12422363) · both arms done · 593.6 s
  pass 2 · seed 265/320 (12422364) · both arms done · 595.7 s
  pass 2 · seed 266/320 (12422365) · both arms done · 598.0 s
  pass 2 · seed 267/320 (12422366) · both arms done · 600.3 s
  pass 2 · seed 268/320 (12422367) · both arms done · 602.5 s
  pass 2 · seed 269/320 (12422368) · both arms done · 604.6 s
  pass 2 · seed 270/320 (12422369) · both arms done · 606.8 s
  pass 2 · seed 271/320 (12422370) · both arms done · 609.1 s
  pass 2 · seed 272/320 (12422371) · both arms done · 611.3 s
  pass 2 · seed 273/320 (12422372) · both arms done · 613.6 s
  pass 2 · seed 274/320 (12422373) · both arms done · 615.8 s
  pass 2 · seed 275/320 (12422374) · both arms done · 618.0 s
  pass 2 · seed 276/320 (12422375) · both arms done · 620.2 s
  pass 2 · seed 277/320 (12422376) · both arms done · 622.4 s
  pass 2 · seed 278/320 (12422377) · both arms done · 624.6 s
  pass 2 · seed 279/320 (12422378) · both arms done · 626.9 s
  pass 2 · seed 280/320 (12422379) · both arms done · 629.1 s
  pass 2 · seed 281/320 (12422380) · both arms done · 631.4 s
  pass 2 · seed 282/320 (12422381) · both arms done · 633.6 s
  pass 2 · seed 283/320 (12422382) · both arms done · 635.9 s
  pass 2 · seed 284/320 (12422383) · both arms done · 638.1 s
  pass 2 · seed 285/320 (12422384) · both arms done · 640.4 s
  pass 2 · seed 286/320 (12422385) · both arms done · 642.5 s
  pass 2 · seed 287/320 (12422386) · both arms done · 644.7 s
  pass 2 · seed 288/320 (12422387) · both arms done · 647.1 s
  pass 2 · seed 289/320 (12422388) · both arms done · 649.3 s
  pass 2 · seed 290/320 (12422389) · both arms done · 651.7 s
  pass 2 · seed 291/320 (12422390) · both arms done · 653.8 s
  pass 2 · seed 292/320 (12422391) · both arms done · 656.0 s
  pass 2 · seed 293/320 (12422392) · both arms done · 658.3 s
  pass 2 · seed 294/320 (12422393) · both arms done · 660.4 s
  pass 2 · seed 295/320 (12422394) · both arms done · 662.7 s
  pass 2 · seed 296/320 (12422395) · both arms done · 664.8 s
  pass 2 · seed 297/320 (12422396) · both arms done · 667.1 s
  pass 2 · seed 298/320 (12422397) · both arms done · 669.2 s
  pass 2 · seed 299/320 (12422398) · both arms done · 671.4 s
  pass 2 · seed 300/320 (12422399) · both arms done · 673.6 s
  pass 2 · seed 301/320 (12422400) · both arms done · 675.9 s
  pass 2 · seed 302/320 (12422401) · both arms done · 678.0 s
  pass 2 · seed 303/320 (12422402) · both arms done · 680.2 s
  pass 2 · seed 304/320 (12422403) · both arms done · 682.6 s
  pass 2 · seed 305/320 (12422404) · both arms done · 684.8 s
  pass 2 · seed 306/320 (12422405) · both arms done · 687.0 s
  pass 2 · seed 307/320 (12422406) · both arms done · 689.3 s
  pass 2 · seed 308/320 (12422407) · both arms done · 691.6 s
  pass 2 · seed 309/320 (12422408) · both arms done · 693.8 s
  pass 2 · seed 310/320 (12422409) · both arms done · 696.2 s
  pass 2 · seed 311/320 (12422410) · both arms done · 698.5 s
  pass 2 · seed 312/320 (12422411) · both arms done · 700.8 s
  pass 2 · seed 313/320 (12422412) · both arms done · 703.1 s
  pass 2 · seed 314/320 (12422413) · both arms done · 705.3 s
  pass 2 · seed 315/320 (12422414) · both arms done · 707.6 s
  pass 2 · seed 316/320 (12422415) · both arms done · 709.8 s
  pass 2 · seed 317/320 (12422416) · both arms done · 712.0 s
  pass 2 · seed 318/320 (12422417) · both arms done · 714.2 s
  pass 2 · seed 319/320 (12422418) · both arms done · 716.5 s
  pass 2 · seed 320/320 (12422419) · both arms done · 718.7 s
  pass 2 · G-REPRO-186 (a): #65 block 8500000 (48 matches, REPRO65 flags)...
  pass 2 · G-REPRO-186 (b): #186 block 12310000 (12 matches, CONTROL arm)...
  [o2-t1] pass 2 digest b1489dd4b00faf4c7a8b8763b1dd155d7db2863465b53cf4cbfe6219e841126f — X-DET PASS

=== O2-T1 WEDGE EXAM · mode full · 12422100..12422419 (320 seeds/arm, shared) ===
eligible moments  CONTROL 19088 · LOOK 20138   (qualifying 25582 / 25600)
THE RATES (paired per-match bootstrap, ratio-of-totals, 2.5/97.5, stats base 104600, 2000 resamples; Δ = LOOK − CONTROL)
  PERCEIVED hold             CONTROL     0.0733% · LOOK     0.0546% · Δ -0.000187 [-0.000754, 0.000367] resolved=false
      n_hold           CONTROL 14 · LOOK 11
  TRUE-context share         CONTROL     0.6391% · LOOK     0.4817% · Δ -0.001575 [-0.002901, -0.000172] resolved=true
      n_true           CONTROL 122 · LOOK 97
  WEDGE (true÷perceived)     CONTROL 8.7143× · LOOK 8.8182× · Δ 0.1039 [-10.2778, 13.55] resolved=false
      LOOK wedge CI [4.8421, 22.2] · excludesControlPoint=false
  E-ABSTAIN-UNSEEN           CONTROL    68.1790% · LOOK    61.8780% · Δ -0.063009 [-0.074516, -0.051142] resolved=true
  E-ACTNOW-DECLINED          CONTROL    31.4229% · LOOK    37.6899% · Δ 0.062671 [0.050524, 0.074442] resolved=true
  E-NOCELL                   CONTROL     0.3248% · LOOK     0.3774% · Δ 0.000526 [-0.000507, 0.001615] resolved=false
  M-CTX agreement            CONTROL    50.8150% · LOOK    55.9137% · Δ 0.050987 [0.028628, 0.072823] resolved=true
  M-CTX  pressure            CONTROL    84.0652% · LOOK    90.7381% · Δ 0.066729 [0.049261, 0.084665] resolved=true
  M-CTX  stale               CONTROL   100.0000% · LOOK   100.0000% · Δ 0 [0, 0] resolved=false
  M-CTX  support             CONTROL    58.5828% · LOOK    59.0843% · Δ 0.005015 [-0.01899, 0.028913] resolved=false
  DEV floor 0.29% cleared?   CONTROL false · LOOK false   (NOT re-cut, #65.1)
EXCLUSION MIX (firstTouch / mustKick / A0-Shoot / A0-Clear)
  CONTROL 4260 / 1343 / 878 / 13   ·   LOOK 3269 / 1397 / 764 / 32
(i) LOOK LEDGER   (the #194 abort-mix price is stated in the artifact beside these counts)
  CONTROL looks 0 · scans 0 · liveTicks 0
  LOOK    looks 11964 · completed 9600 · abortedLoss 2222 · abortedPhase 0 · E-ENDED 142 · scans 115308 · liveTicks 115308 · seedsWithLooks 320/320
  frozen-phase ticks under a live window (NO scan, window cannot close — published, not dropped)   CONTROL 0 · LOOK 1260
(ii) F-O2b EXPOSURE INSTRUMENTS
  turnover per spell         CONTROL    0.409024 · LOOK    0.443299 · Δ 0.034275 [0.024942, 0.043182] resolved=true
  turnovers /1000 ticks      CONTROL    3.368084 · LOOK    3.239743 · Δ -0.128341 [-0.232284, -0.02734] resolved=true
  turnovers look-attributed at the LOSS TICK (PLAYING clock)   CONTROL 0 · LOOK 414
  attribution edges across a FROZEN-PHASE dead-ball reset (own subclass, NEVER mixed in)   CONTROL 517 · LOOK 512
  companions (no assumed identity): engine abortedLoss 0/2222 · abortedLoss with OWN-team recovery 0/1024 · unresolved at walk end 0/25
  spells 21632/18915 · turnovers 8848/8385 · ticks 2627013/2588168
(iv) RING PRESSURE (ring 16, retention 51 ticks)
  ringPressure share         CONTROL     0.0000% · LOOK     6.2923% · Δ 0.062923 [0.059084, 0.06665] resolved=true
  ringFull  CONTROL 18257/18768 · LOOK 19239/19818 · mean occupancy 15.761/15.763 · mean oldest age 182.47/143.582
(v) BUILD-UP RULER — constructed/scramble shares DROPPED (whole-match classifier vs a walk
    truncated at PER_MATCH_CAP); carried instead:
  goals in walked window  CONTROL 416 · LOOK 415 · matches reaching full time 3/0 of 320
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
resultSha256 2100760d267b197b18a7625e39bfc35c458e0f2227dfc2495d224f6eaf8a616b
wall 1590 s (CONTEXT ONLY) · artifact docs/world-model/data/o2-t1-wedge-exam.json
```
