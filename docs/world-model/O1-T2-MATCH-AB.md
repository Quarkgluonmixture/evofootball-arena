# O1 T2 — the ARMED shortPass wind-up A/B (the deployment measurement)

Status: **PRE-REGISTERED 2026-08-08 and FROZEN BEFORE SIGHT.** The arms, the
gates and their derived bands, the reported dimension list, the seed ledger, the
sizing formula and the pre-laid readings below were written **before** the sizing
smoke ran and before any T2 datum existed. The smoke's numbers appear only in
[§SMOKE](#smoke--the-sizing-run-committed); the full run's verdict will appear
only in a later §RESULT, appended after the commander launches it.

Authority chain: **contract [`OUTLET-CONTRACT.md`](OUTLET-CONTRACT.md)** §2 O1
(the slice), **§3 invariants** (I1 NO FREE TIME · **NO DOUBLE-CHARGE** — the
three debt fixes add **no price term** · FLAG HYGIENE · EPISTEMIC HONESTY ·
EQUILIBRIUM DISCIPLINE · Road B), **§4** (the tempo census as the per-slice
OUTCOME ruler), **§5 F-O1a / F-O1b** (both pre-named here verbatim) ·
**ruling #180.4** (this stage's shape: the C7-T2 template PLUS the tempo-census
dimensions on both arms; sizing smoke → frozen N; F-O1a STOPS; the F-O1b read is
taken at adjudication) · **#180.3** (the three seam debts, fixed and tested in
this same commit — §DEBTS) · **#179.1** (self-drive on the O1 arc; the #159 red
lines bind: a pre-named FAIL, a non-PASS verify after one fix round, contract
ambiguity or anything touching another slice ⇒ STOP to the user) · **#178.3**
(cut-1 = shortPass only) · **#175** (the contract) · #173.2 (the frozen gap
table this arc is measured against) · #163 (stats-stream disjointness) · #128
(wall measured outside the compared core) · #20 (cluster = match seed).

Templates carried, not reinvented: **[`C7-T2-MATCH-AB.md`](C7-T2-MATCH-AB.md)**
(the A/B form — paired same-seed arms, equilibrium readings, the sizing→frozen-N
idiom, receipts) and **[`TEMPO-CENSUS.md`](TEMPO-CENSUS.md)** (every tempo metric
definition below is that document's, verbatim, including its **axis honesty** law).

Banked data this stage stands on: [`O1-T1-PASS-WINDUP.md`](O1-T1-PASS-WINDUP.md)
§RESULT (the certified dormant seam; W p50 6 ticks, wind-up share 76.14% of
eligible commits, interruption 2.797%, arm ledger unexplained 0) and
[`O1-PHASE0-PASS-RELEASE.md`](O1-PHASE0-PASS-RELEASE.md) §P2.11 (the census
populations).

---

## §DEBTS — the three #180.3 robustness debts, fixed on the licensed seam path

All three are dormant-robustness fixes **inside** the licensed seam path, behind
`o1PassWindup`. **They add no price term** (the NO-DOUBLE-CHARGE list binds: no
`oneTouchMul`, no `orientation*Mul`, no `pressureAt`, no `kickMisalignment`, no
second regather charge), they draw **no rng**, and the **flag-off byte-identity
and the production fingerprint were re-derived after them** (§GATES G-IDENT).

### (i) INT-MATE — the arm-time mate must still be on the pitch, and still be him

T1's resolve validated the mate only for `undefined`. Two existing engine
channels break that:

* **a send-off** (`Match.sendOff` → `removeFromPitch`) parks the body on the
  apron (`pos = (−attackDir·12, ±(HALF_W+4))`) with `sentOff = true` — the body
  object stays in `allPlayers`, so a `undefined`-only check passes and the pass
  would have been struck **at an empty apron**;
* **an injury substitution** (`Match.forceSubstitution` → `Player.becomeSub`)
  swaps a **new identity into the same pitch slot** — the gid is the *slot*, not
  the man (`Player.ts:30-37`), so a gid-only check would deliver the pass to a
  **stranger who was never picked**.

The fix: the slot captures `targetRosterIdx` at arm, and
`resolvePendingPassWindup` **cancels** if at `readyTick`
`mate.sentOff || mate.rosterIdx !== targetRosterIdx`. Cancel = **no pass runs**;
the ball stays with the passer and the existing channel that removed the mate
owns the outcome (the C7 I3 form — the seam adds nothing, opens no new channel).
It is a **new named interruption cause, `INT-MATE`**, counted in-engine
(`o1WindupLedger.cancelledMate`) and reported in the interruption mix.

**Tests** (`tests/o1PassWindup.test.ts`): a send-off inside the window ⇒ zero
`performPass`, slot cleared, aim lock released, ball still owned, ledger
`cancelledMate = 1`; a `becomeSub` inside the window (`sentOff` still false — a
gid-only check would have passed) ⇒ same; and a **non-vacuity control** — an
untouched mate still receives at `readyTick` with `cancelledMate = 0`.

### (ii) EVICTION ACCOUNTING, IN-ENGINE (with the code argument at its honest strength, tested)

T1 counted slot overwrites in a **probe wrapper**. That is the wrong place: the
engine owns the slot. `Match.o1WindupLedger` is now the in-engine ledger —
`{ arms, evictions, struck, cancelledMate, cancelledPendingKick,
cancelledByPendingKick }` — pure bookkeeping that **nothing in the sim ever
reads**, so it cannot influence a tick, and every counter stays 0 unless
`o1PassWindup` is armed.

**The code argument, written out as the ruling requires — and stated at the
strength it actually has (⚠ #181.1 correction, marked in place: step 3 below
previously claimed a second arm *requires a different body*, which the
re-decide lock's real guard condition does not support).** The pass wind-up slot
is single, so a second arm while one is live overwrites it. What the code
guarantees:

1. **Only the ball owner can arm.** The arm site is inside `decideCarrier`,
   reached from `decidePlayer` only when `match.ball.owner === p`
   (`PlayerBrain.ts:72`), and exactly one body owns the ball at a time.
2. **A winding-up owner cannot re-decide *while he still owns the ball*.** The
   O1 re-decide lock (`PlayerBrain.ts:54-57`) returns immediately while
   `match.o1PassWindup && pendingPassWindup.gid === p.gid && ball.owner === p`.
   The third conjunct is the limit of the guarantee: **the lock lapses the moment
   the winding-up body loses the ball** — that lapse is deliberate (T1 §SEAM: the
   commitment must not survive a charge-down).
3. **So a second arm needs the ball to have moved, but NOT necessarily to another
   body.** Two routes exist on paper: a different body wins it and arms, or the
   *same* body loses it and regains it inside the window and arms again. In the
   first the slot's record is stale and its resolve would in any case have bailed
   on the `this.ball.owner !== passer` guard (`Match.ts:2055`); in the second the
   older record is a superseded duplicate of the same passer with a stale aim and
   an earlier `readyTick`. **In neither route is a release lost** — the newer arm
   owns the legs, which is exactly the #180.3(iii) precedence rule — but *"the
   double arm is unreachable"* is a claim this argument does **not** establish,
   and it is not made. The counter is therefore **measured, not argued away.**

The argument is **not load-bearing on its own** — the tests carry the claim: the
counter is proven **falsifiable** by a test that reaches the overwrite through
the public API (`evictions` 0 → 1, the later arm holding the slot), and a second
test walks whole armed matches asserting the engine's own count stays **0 on
every tick** while `arms > 0` (the attempt-to-reach). T1's 2,039-arm smoke
measured EVICTED 0, and this stage's smoke measures **EVICTED 0 over 1,163
arms** — consistent, and the number is what we rely on.

### (iii) THE DOUBLE-PENDING BODY — precedence, defined and implemented

The pass plant sits after the C7 plant, and the two slots are parallel, so a
`pendingKick` and a `pendingPassWindup` could in principle name the same gid.
**The precedence is now explicit: a body has ONE set of legs, and the arm that
fires LAST owns them.** Arming the pass cancels a live same-gid shot wind-up
(`cancelledPendingKick`); arming the shot cancels a live same-gid pass wind-up
(`cancelledByPendingKick`). A cancelled wind-up simply clears — no strike, no
pass, exactly as its own interruption path leaves it.

The shot side needed **one line inside `armPendingKick`**, and it is **gated on
`o1PassWindup`** so the certified C7 path is bit-exactly as certified in every
world where O1 is off (a test pins that a `c7Windup`-only world is signature-
identical with the flag absent vs explicitly false). **This is a recorded
deviation from T1's "the C7 shot path is byte-untouched in source"**: it is now
byte-untouched *in behaviour* for every non-O1 world, and one flag-gated guard
line in source. The debt could not be discharged otherwise — precedence for
*both* orders cannot live only on the pass side.

**Reachability:** like (ii), no live-match route to a double-pending body is
known — each seam's re-decide lock returns while the owning body still owns the
ball — and, per the (ii) correction above, that lock lapses on a loss, so
*"unreachable"* is **not claimed**, only **unobserved** (both precedence counters
measure 0 in every armed walk). Both orders are therefore tested through the
public API, and a third
test walks whole matches with **both** flags armed asserting the two slots never
name the same gid and that neither precedence counter ever fires.

---

## §1 — WHAT T2 ASKS

T1 certified the **seam**, dormant. It could not price **deployment**: what the
match looks like when every open-play, window-closed shortPass on **both** sides
takes its honest set-up time. Two questions, one gated and one not:

* **Does the game stay football?** — the equilibrium band (§GATES F-O1a). This is
  the HARD half. Pass volume is ~11× shot volume (census: shortPass 79.81% of
  87.1 open-play releases/match), so unlike C7 this lever touches the whole
  possession game, not a seat.
* **Does it move TEMPO, and by how much?** — the tempo-census dimensions on both
  arms (§REPORTED). This is the contract's OUTCOME ruler (§4) and the reason the
  slice exists. **It is reported, never gated**; the F-O1b read is the
  commander's at adjudication (§F-O1b).

T2 does **not** re-litigate T1: the per-window fidelity (`readyTick = commit +
W`, aim lock, ball owned at the carry offset, no rng at arm, release once at
`readyTick`), the one-touch bypass, the cutback/kickoff/restart no-routes and the
W law are certified on the identical law and seam and are re-asserted only by the
test pins that ride this commit.

---

## §2 — ARMS (paired, symmetric, one mechanic)

```text
OFF     o1PassWindup false  — must reproduce the SHIPPED world bit-identically
                              (X-OFF-IDENT, per seed, against a flag-ABSENT match)
ARMED   o1PassWindup true   — armed on EVERY open-play, window-closed shortPass
                              commit on BOTH sides; the equilibrium band binds here
```

The wind-up is **physics, not a choice** — no brain reads it, no chooser prices
it — so it is symmetric and there is **no adoption ladder** (the C7-T2 §2
precedent). **One mechanic per A/B:** every other flag stays at its shipped
default in both arms (`c6Carry`, `c7Windup`, the c5 family and the a4 world flags
are all absent). Both arms run the **same seeds, paired**; every delta is a
per-seed paired contrast with a **match-seed cluster bootstrap** CI (#20): a shift
is *resolved* only when its CI excludes zero, and a null is reported as a null,
never re-cut.

`o1PassWindup` is **null/off in every production path** throughout (Road B); the
arms exist only as probe `Match` config.

---

## §GATES — frozen ex ante

| gate | predicate | kind |
| --- | --- | --- |
| **F-O1a EQUILIBRIUM BAND** | on the **ARMED** arm, all five C1 §4 headline rates inside their absolute bands (below). Any break ⇒ **STOP to the user** (contract §5 F-O1a) | **HARD** |
| **G-IDENT flag-off byte-identity** | with the flag absent/false the 2-season league hash on the **three** frozen league seeds equals the pre-#180.3 baselines (1337 · 20260728 · 424242). ⭐ **#181.2 THE STANDING RECEIPT RULE:** all three baselines are hard-coded in the probe and **all three hashes are recomputed in-probe on every run** and written to `gates.gIdent.rows` of the committed JSON — the artifact proves the gate; **no hash in this document is evidence**, each is a transcription of the receipt | **HARD** |
| **G1 X-FP-PROD** | seed 1337 / 2 seasons, flag absent ⇒ the production fingerprint. It is the **1337 row of the same G-IDENT recomputation** (one run, not two), and reproducible independently by `scripts/fingerprint.ts 1337 2` | **HARD** |
| **X-OFF-IDENT** | per seed, the OFF arm's end-of-match signature is **identical** to a flag-ABSENT match's | **HARD** |
| **X-DET** | the whole experiment core runs **twice**, byte-identical digests | **HARD** |
| **RELEASE CLASS RECONCILES** | the probe splits every `performPass` by call site (openPlayCommit / seamResolve / kickoffPlayBack / restartTaker) and its `seamResolve` count must equal the **ENGINE** ledger's `struck` on **both** arms (ARMED and OFF-with-zero) | **HARD** |
| **ARM LEDGER CLOSES** | every arm maps to exactly one terminal class (STRUCK / INT-PHASE / INT-LOSS / INT-STUN / INT-SENTOFF / INT-COOLDOWN / **INT-MATE** / E-ENDED / EVICTED); **unexplained exactly 0**; and the **probe ledger agrees with the ENGINE ledger** on arms, struck, evictions and INT-MATE | **HARD** |
| **SEAM NEVER RELEASES OWNERSHIP** | seam-attributable ownership releases **exactly 0**: an interrupted resolve never frees a ball that the passer still owned pre-step (the seam writes `ball.owner` nowhere — T1-certified, re-checked live) | **HARD** |
| **W ∈ [3,11]** | every realized wind-up is a whole tick count inside the frozen clamp | **HARD** |
| **OFF-ARM SEAM DEAD** | on the OFF arm: zero arms, the engine ledger all-zero | **HARD** |
| **SEED DISJOINTNESS** | proved in-probe against the itemized ledger (§SEED LEDGER) | **HARD** |
| **STATS-STREAM DISJOINTNESS (#163)** | bootstrap base **102,800**, ≥200 from every published base (102,000 / 102,200 / 102,400 / 102,600) | **HARD** |
| **SUITE + tsc** | full `npm test` green (incl. all T1 pins + the new debt tests), `tsc --noEmit` clean | **HARD** |

### F-O1a — the band, inherited whole (the C7-T2 §4.2 values VERBATIM)

Nothing invented, nothing tightened, nothing loosened (#19/#30.3: the band is a
guard, never a hand re-tune). The **ARMED** arm's absolute per-match rates:

```text
baselines (C1 §4):  goals 2.3944 · crosses 2.4894 · headers 9.1039 ·
                    long balls 6.2042 · cutbacks 3.8151

goals/match        within ±15%     2.03524 .. 2.75356    ← the headline band
crosses            within ±25%     1.86705 .. 3.11175
headers won        within ±25%     6.82793 .. 11.37987
long balls         within ±25%     4.65315 .. 7.75525
cutbacks           within ±25%     2.86133 .. 4.76888
```

Every edge above is quoted **exactly as the probe computes and prints it**
(`baseline × (1 ± tolerance)`, rounded to 5 dp — the headers upper edge is
`11.37987`, ⚠ #181.1 last-decimal correction from `11.37988`); the band table in
`gates.fO1a.rows` of the committed JSON is the receipt.

The **OFF arm is reported against the same bands** as the flag-off sanity
cross-check (the P2-B §4.2 form): a large OFF-vs-baseline drift is itself
reported, and it is not a gate.

**Why the goals band is the live reading here, as in C7-T2.** The wind-up defers
releases; a deferred pass can be intercepted, and the composed release pays less
of the existing misalignment price. Both directions are open. The C7 precedent
resolved **+8.79% goals** from the shot seat alone; the pass family is ~11×
the volume but its effect runs through *possession*, not through shot quality, so
the sign is genuinely unknown ex ante. Reported both ways (paired delta = the
mechanism size; the ARMED absolute point = the band decision, the C7-T2 §4.3
form).

---

## §REPORTED — never gated (the OUTCOME ruler and the seam's own census)

Every dimension is measured **on BOTH arms** with the TEMPO-CENSUS definition
verbatim, and every contrast is paired with a cluster CI. **Axis honesty binds**
(TEMPO-CENSUS §2): `match.simTime` (PLAYED sim-seconds) denominates every rate;
`perDisplayMinute = perSimSecond × 2.6667`; `simTick · DT` appears once per arm as
`wallSimSecondsPerMatchContextOnly` and is used in **no** rate. Durations are
sim-seconds only and are never rescaled.

1. **Open-play possession spell** (§3.1): mean / median / p25 / p75 / p90, plus
   the controlled-time-only variant. Origin = `openPlay` only (restart/kickoff
   spells are set-piece geometry, §4 population rule).
2. **One-touch share** (§3.2): strict (one ownership episode, ended by
   `opponentControl`) and bare.
3. **Turnovers** (§3.5): spells terminated by `opponentControl`, on all four axes
   (perMatch / perSimSecond / **perWatchedMinute** / perDisplayMinute).
4. **Pressed at reception** (§3.6): open-play first receptions with the nearest
   non-sent-off opponent inside the frozen **R = `TOUCH_CONTROL_DIST` = 4.2 m**,
   with the 3.0 m sensitivity radius beside it.
5. **Pressed at release**: the same radius at the **release instant**, over the
   **cut-1 population, defined by call site** (⚠ #181.1 correction: this was
   previously computed over *every* `performPass` while labelled cut-1).
   `Match.performPass` has exactly three call sites in `src/**`, and the probe
   labels every release with the one it came from:
   * `openPlayCommit` — the **cut-1 commit statement** (`PlayerBrain.ts:998`,
     #178.3). On ARMED these are the window-open **bypass** releases, since a
     window-closed commit arms instead;
   * `seamResolve` — the **same statement's deferred release**, W ticks later
     (ARMED only; reconciled against the engine ledger's `struck`);
   * `kickoffPlayBack` — the Phase 27.3 kickoff play-back (`PlayerBrain.ts:170`),
     its own early branch that never reaches the commit statement — **excluded**;
   * `restartTaker` — a restart taker coming through the commit door (`mustKick`
     bars him from arming, the C7 free-kick precedent) — **excluded**.

   **cut-1 = `openPlayCommit + seamResolve`**; the four counts and the
   all-`performPass` cross-check share are both committed, so any reader can
   re-derive either population. The exclusions are present identically on both
   arms. *Declared deviation:* the phase-0 census read this on a pre-step snapshot
   (§P2.6); this probe reads the release tick itself — identically on both arms,
   so the contrast is honest, and the level is comparable to the census only up to
   that convention.
6. **Reception-to-release** (§3.4): owner-held sim-seconds per ownership episode,
   mean / median / p75 / p90 and the share at or under the engine's own 0.28 s
   one-touch window.
7. **The realized W distribution** on the ARMED arm (p10/p50/p90/mean, tick
   histogram, seconds), cross-checked against T1's p50 6 / mean 6.343.
8. **The interruption mix** including **INT-MATE**, against T1's 2.797%.
9. **The arm ledger, both copies** — the ENGINE's `o1WindupLedger` (arms /
   evictions / struck / cancelledMate / both precedence counters) and the probe's
   terminal classes, with their agreement asserted.
10. **The equilibrium economy beside the band**: shots/match, conversion,
    on-target rate, loose-ball paired delta (expected ~null by construction — the
    seam opens no new loose-ball channel, contract I3), passes/match, pass
    completion, fouls/match.

### F-O1b — the arithmetic form, stated ex ante; the READ is the commander's

Contract §5: *"tempo moves < 20% of the #173.2 gap at full arming — the lever is
too small; the fork (bigger duration law vs accept) is the user's."* The frozen
arithmetic, on the two dimensions the ruling names:

⭐ **ONE ESTIMATION BASIS, END TO END** (⚠ #181.1 (M3) correction: the block
previously mixed pooled-across-spells *levels* with paired per-match *deltas* —
two different estimators in one subtraction). Every level **and** every delta in
the F-O1b block is now the **paired per-match mean**: for each of the N paired
matches take that match's own value, then average over matches. Consequently
`level(ARMED) − level(OFF)` **equals** the paired delta exactly, and the CI on
that delta is the same object. The pooled-across-spells levels (which weight
long-spell matches more heavily) stay reported in `arms.*.tempo` for continuity
with the pooled phase-0 census, and appear inside the F-O1b block only as a
labelled `pooledCrossCheck`.

```text
basis           = paired per-match means, levels AND deltas
gap(dimension)  = | OFF-arm level  −  the #173.2 reference edge |
threshold       = OFF-arm level  moved 20% of that gap TOWARD the edge
fractionMoved   = (ARMED − OFF) / gap        (signed toward the edge)

spell mean (s):              OFF ≈ 4.4 (#173.2 prod 4.39) → edge 9.6
                             ⇒ threshold ≈ OFF + 0.20·(9.6 − OFF)
turnovers / watched minute:  OFF ≈ 8.6 (#173.2 prod 8.6)  → edge 4.5
                             ⇒ threshold ≈ OFF − 0.20·(OFF − 4.5)
```

The probe prints `fractionOfGapMoved` on both dimensions and **decides nothing**.
Which dimensions count, and whether the movement is enough, is the **commander's
read at adjudication** (#180.4), and either way it lands the fork goes to the
user. **No threshold here gates the run.**

---

## §SIZING — the smoke, then the frozen-N arithmetic (the C7-T2 / P3′ idiom)

The sizing smoke is **sizing, wall and plumbing ONLY**. Its absolute levels are
honest data and are committed, but **no conclusion in this document is derived
from them** and none may be: everything above was frozen before it ran.

**The formula, frozen before the smoke:**

```text
N*_goals  = ceil( (2.8 · SD_pairedGoalsDelta / 0.07)^2 )      # MDE 0.07 goals/match
N*_spell  = ceil( (2.8 · SD_pairedSpellMeanDelta / 0.50)^2 )  # MDE 0.5 s on spell mean
N*_wall   = floor( 6 h / msPerPairedSeed )                    # the ≤ 6 h budget
N*        = min( roundUpTo50( max(N*_goals, N*_spell) ), N*_wall, 1000 )
```

* **The 0.07 goals/match MDE** is the C7-T2 §3.2 figure verbatim (it is what
  resolved that stage's +0.20 push with headroom, and it is a fifth of the goals
  band's half-width) — derived, not invented.
* **The 0.5 s spell-mean MDE** is **half** the F-O1b decision step (20% of the
  ≈5.2 s gap ≈ 1.04 s), so the run can locate the movement against the threshold
  rather than merely notice it.
* **`msPerPairedSeed`** is the smoke's own measured wall / N — it therefore
  already includes the X-DET double-run **and** the third (flag-absent) match per
  seed that X-OFF-IDENT costs. Wall budget **≤ 6 h** (#180.4).
* **The 1,000 cap** is the declared seed sub-block 12,303,000–12,303,999 — one
  seed per paired match, so the block size *is* the cap. It is the probe's own
  hard clamp (`FULL_N_CAP = 1000`, and the `O1T2_N` default is 1,000 so the two
  cannot drift), and **ruling #181.3 fixes the LAUNCH N at exactly this cap**
  (⚠ #181.1 reconciliation: earlier drafts of this section said 800 in places
  while the probe already clamped at 1,000 — doc and probe now agree at 1,000).

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| reserved band (this arc) | **12,300,000 – 12,309,999** | reserved in full by O1 phase-0 |
| O1 phase-0 census | 12,300,000 – 12,301,999 | CONSUMED (#178) |
| O1-T1 armed smoke | 12,302,000 – 12,302,039 | CONSUMED (#180.2) |
| **O1-T2 sizing smoke (this commit)** | **12,302,040 + k, k < 24 ⇒ 12,302,040 – 12,302,063** | **CONSUMED here** |
| **O1-T2 full run** | **12,303,000 + k, k < N\*** — reserved **12,303,000 – 12,303,999** (the probe's own hard cap is N ≤ 1,000); at the ruled **N\* = 1,000** (#181.3) it spends the block **in full: 12,303,000 – 12,303,999** | reserved here, spent at launch |
| O1 phase-0 sizing smoke | 12,309,900 – 12,309,923 | CONSUMED (#177/#178) |
| free inside the band | 12,304,000 – 12,309,899 | available to O1-T3 (the tempo re-census) |

Every block above lies inside the reserved band and above the exhausted
12,299,999 ceiling (`TEMPO-CENSUS.md` §7.1 reserved 12,293,000–12,299,999 in
full). Disjointness is **proved in-probe** against this itemized list, both for
the smoke and for the full run, including against each other. **The band's
remainder is sufficient at every N ≤ 1,000 — no extension into 12,310,000+ is
needed**, and none is taken. At N = 1,000 the full-run sub-block is spent exactly
to its last seed and nothing spills; any future N > 1,000 needs a fresh block and
a ruling, which is why the probe refuses to exceed 1,000.

**Stats stream (#163):** bootstrap base **102,800**, ≥ 200 above O1 phase-0's
102,600 and above the tempo census's reserved 102,400. CIs are deterministic
cluster bootstraps (2,000 resamples) on that stream, never the match RNG.

---

## §PRE-LAID READINGS — the full sign space (#38.1), frozen

Not one may be re-cut after sight. **Nothing ships in any branch (Road B).**

* **(A) BAND HOLDS, TEMPO MOVES ≥ the F-O1b step — the design case.** All five
  §2 dimensions inside band on ARMED, the arm ledger closes, every X-gate passes,
  and the tempo dimensions move toward the reference edges by at least the 20%
  step. Disposition: **return to the commander** with the numbers; the tempo
  re-census (the OUTCOME ruler) and then the user's play-test are what follow.
  T2 authorizes neither.
* **(B) BAND HOLDS, TEMPO MOVES < the F-O1b step.** The lever is real but small.
  Disposition: **F-O1b — the fork goes to the USER** (bigger duration law vs
  accept vs widen to cut-2), per contract §5 and #179.1. No re-cut of the law by
  us.
* **(C) F-O1a FIRES — the band breaks on ARMED.** Any of the five dimensions
  leaves its band (goals in either direction is the named risk). Disposition:
  **STOP to the user** with the broken dimension quantified. The world's honest
  answer about balance; **nothing re-cut** (#30.3), honest revert of nothing
  (Road B).
* **(D) A REPORTED-ECONOMY SURPRISE.** The loose-ball economy resolves a nonzero
  *increase* without the structural gate firing, or a reported economy instrument
  resolves against the coherent story (e.g. spells lengthen while turnovers rise).
  Disposition: **reading, returned to the commander, no re-cut.**
* **(E) INSTRUMENTS DISAGREE IN SIGN.** The tempo dimensions point opposite ways
  with CIs excluding zero (spell length up while reception-to-release falls, say).
  Disposition: **returned UNRESOLVED to the commander.**
* **(F) A HARD PLUMBING GATE FAILS.** G-IDENT / G1 / X-OFF-IDENT / X-DET / the
  arm ledger / seam-attributable releases / W clamp / seeds / stats base.
  Disposition: **FAIL, queue stops**, whatever the football numbers say — an arm
  that cannot reproduce its own flag-off world is not a measurement.

## §NON-CLAIMS

* **Nothing ships.** `o1PassWindup` is a hard `false`, absent from `a4World.ts`,
  absent from every League `matchFlags` unless a probe sets it. The production
  fingerprint is unchanged; the flag-off world is byte-identical to the
  pre-#180.3 baselines on three league seeds.
* **T2 is not the tempo re-census.** The census (contract §4) re-runs as the
  OUTCOME ruler *after* T2, on its own staging; T2's tempo dimensions are the A/B
  contrast, not the absolute re-census.
* **T2 does not adjudicate F-O1b** — it states the arithmetic; the read is the
  commander's and the fork is the user's.
* **No watchability verdict.** The user's eyes own that (#152/#168).
* **No new price, no new gene, no new attribute, no rng at arm.** The three debt
  fixes add counters and cancels only. `t̄` is not re-centred. Cut-2 (the through
  family) and cut-3 (the loftKick five) are untouched.
* **T2 cannot authorize anything.** The launch of the full run, the re-census and
  the play-test entry are the commander's and the user's (#179.1).

---

## §COMMANDS

```bash
# the sizing smoke (done — committed):  ~minutes, foreground
O1T2_MODE=smoke npx tsx scripts/probes/o1-t2-match-ab.ts

# THE FULL A/B — the §0.0.4 DETACHED form (the commander's resident session
# launches it; a sub-agent session dies and orphans background processes).
# LOG PATH (declared): /tmp/o1-t2-match-ab.log
nohup env O1T2_MODE=full O1T2_N=1000 \
  npx tsx scripts/probes/o1-t2-match-ab.ts \
  > /tmp/o1-t2-match-ab.log 2>&1 & disown

# supervise: the PID printed above, plus
tail -f /tmp/o1-t2-match-ab.log
```

`O1T2_N=1000` is the **ruled launch N** (#181.3) and also the probe's default and
its hard cap, so the command, the flag default and the clamp all say the same
number. ⚠ **The probe exits NON-ZERO (1) when any gate fails** (#181.1 LOW: a
`nohup` supervisor sees only the exit status) — the JSON is written **first**, so
a failed run still leaves its full evidence on disk.

Outputs: [`data/o1-t2-sizing-smoke.json`](data/o1-t2-sizing-smoke.json) ·
`data/o1-t2-match-ab.json` (the full run) · log `/tmp/o1-t2-match-ab.log`
(progress is written to **stderr**, which the redirect captures).

---

## §SMOKE — the sizing run (committed)

Implementation: **re-run after the #181 fix round** at working HEAD `0dea9ac` +
this commit's changes (the three #180.3 debt fixes + the probe) — the JSON records
`0dea9ac`, the T1 §RESULT convention. Instrument:
[`../../scripts/probes/o1-t2-match-ab.ts`](../../scripts/probes/o1-t2-match-ab.ts).
Data: [`data/o1-t2-sizing-smoke.json`](data/o1-t2-sizing-smoke.json).
**24 paired seeds, block 12,302,040 (12,302,040–12,302,063), both arms + a
flag-absent identity run per seed, the whole core run TWICE byte-identical.**
Wall **42.3 s** (CONTEXT ONLY — used in no rate), **1,761.1 ms per paired seed**
(that figure carries the X-DET double-run, the third flag-absent match per seed
AND **all three** in-probe G-IDENT league runs — deliberately conservative for the
projection).

* **X-DET digest** `3eff73bd4227f8e0c4f57519903cfdc8fd841bed5b2e871532412f39a7e49a29` (twice)
* **resultSha256** `ffa535b5d10c6ee0398e4aa0f2bc10081ca8d0f33bcd8d8b4a9d71c1d65700b8`

**What the #181 fix round changed in this artifact** (stated so the diff is not
mistaken for drift): the populations, the equilibrium levels, the spell/turnover
tempo levels, the W distribution, the arm ledger and every plumbing verdict are
**unchanged**. What moved, and why: (a) the three G-IDENT hashes are now
**computed here** (a new `gates.gIdent` block, +2 league runs ⇒ the wall/ms
figures above); (b) **pressed-at-release** is now the cut-1 population instead of
every `performPass`, so its levels changed (OFF 0.71713 → **0.769576**, ARMED
0.72219 → **0.775803**) — the old figures survive as the labelled
`allPerformPassCrossCheck`; (c) the seam's arm share is now over **eligible cut-1
commits** (0.666476 → **0.780013**, against T1's 0.7614 — the corrected
denominator moves it onto the T1 reference, not away from it); (d) the F-O1b block
is on the paired per-match basis; (e) a release-class reconciliation gate and a
non-zero exit path were added.

### Plumbing gate table (the only thing this smoke adjudicates)

| gate | verdict | evidence |
| --- | --- | --- |
| **G-IDENT flag-off byte-identity** | ✅ PASS | ⭐ **the receipt is the artifact** (#181.2): all three hashes recomputed **in-probe on this run** into `gates.gIdent.rows` — 1337 `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` · 20260728 `c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080` · 424242 `45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26`, each compared in code against the hard-coded pre-#180.3 baseline ⇒ `identical: true` ×3. Independently reproducible by `npx tsx scripts/fingerprint.ts <seed> 2` |
| **G1 X-FP-PROD** | ✅ PASS | the 1337 row of that same recomputation, flag absent ⇒ `57b0bdab…c673` |
| **RELEASE CLASS RECONCILES** | ✅ PASS | ARMED `seamResolve` 1,135 = engine `struck` 1,135; OFF 0 = 0. Composition — ARMED: openPlayCommit 328 (the bypass) + seamResolve 1,135 = **cut-1 1,463**, excluded kickoffPlayBack 106 + restartTaker 148 (all `performPass` 1,717); OFF: openPlayCommit **1,558** = cut-1, excluded 99 + 153 (all 1,810) |
| **X-OFF-IDENT** | ✅ PASS | 24/24 seeds: the OFF arm's signature identical to a flag-ABSENT match; 0 mismatches |
| **X-DET** | ✅ PASS | two core runs, identical digests (above) |
| **ARM LEDGER CLOSES** | ✅ PASS | 1,163 arms = STRUCK 1,135 + INT-LOSS 24 + INT-PHASE 3 + E-ENDED 1 + EVICTED 0; **UNEXPLAINED 0**; probe ↔ **engine** ledger agree on arms (1,163/1,163), struck (1,135/1,135), evictions (0/0) and INT-MATE (0/0) |
| **SEAM NEVER RELEASES OWNERSHIP** | ✅ PASS | seam-attributable releases **0** |
| **W ∈ [3,11]** | ✅ PASS | p10 5 / p50 6 / p90 8, mean 6.374 ticks (0.10623 s) — on T1's p50 6 / mean 6.343 |
| **OFF-ARM SEAM DEAD** | ✅ PASS | zero arms, engine ledger all-zero on the OFF arm |
| **SEED / STATS DISJOINTNESS** | ✅ PASS | 12,302,040–12,302,063: in band, no collision with the census, the T1 smoke, the phase-0 smoke or the full-run block; stats base 102,800, min gap 200 |
| **F-O1a (smoke scale, plumbing only)** | quiet | all five ARMED dimensions inside band (goals 2.5 ∈ [2.03524, 2.75356]) — **at n = 24 this is plumbing, NOT the band decision** |
| **SUITE + tsc** | ✅ PASS | `tsc --noEmit` clean. `vitest run` on the #181 fix round: **1,126 tests / 123 files, 1,126 green in 234.5 s — no failures, no timeouts.** (Recorded as-is: the pre-fix run of the same suite had **1,125** green, its one failure being `tests/formationEvolution.test.ts` "ten seasons" hitting the **180 s per-test timeout under full-suite load**, which re-ran green in isolation at 139.97 s — a load-margin miss that did not recur here. The disclosure is kept so the earlier record stays readable.) Baseline for comparison: T1 banked 1,116 tests; this commit adds the **10 debt pins** |

### The frozen-N arithmetic (the §SIZING formula, applied)

Measured paired-delta SDs: **SD(goals) = 1.70623**, **SD(spell mean) = 1.59398**
goals/match and sim-seconds respectively.

```text
N*_goals = ceil( (2.8 · 1.70623 / 0.07)^2 )   = 4,658
N*_spell = ceil( (2.8 · 1.59398 / 0.50)^2 )   =    80
N*_wall  = floor( 6 h / 1761.1 ms )           = 12,265
N*       = min( roundUpTo50(max(4658, 80)) , 12265 , 1000 ) = 1,000  ← the cap binds
```

**N\* = 1,000 per arm (2,000 matches + 1,000 identity runs) — the frozen formula's
output and the LAUNCH N ruled in #181.3. Projected wall ≈ 1,000 × 1,761.1 ms
≈ 29.4 min for the whole double-run — 0.082 of the 6 h budget.**

⚠ **The disclosure the cap forces, stated rather than buried.** The measured
paired-goals-delta SD is **1.706**, i.e. **2.4×** the C7-T2 §3.2 working estimate
of 0.7 — a pass-family mechanic re-rolls whole matches, where a shot-seat
mechanic only re-rolls conversions on ~9 shots. So at the frozen cap the
**paired goals MDE is ≈ 0.151 goals/match (≈ 6.8% of the OFF level), not the
0.07 the formula targets**; `N*_goals` would need ~4,700. Three things follow,
all frozen-consistent:

1. **The gate is unaffected in kind.** F-O1a reads the **ARMED arm's ABSOLUTE
   point** against the band (the C7-T2 §4.3 form), and that point's standard
   error at 1,000 is **≈ 0.046 goals/match** (per-arm goals SD 1.445 on this
   smoke) — the band's half-width is 0.359, i.e. ~7.9 SE, so the band decision is
   well resolved at N\* = 1,000.
2. **The tempo obligation is met with room.** The spell-mean MDE at 1,000 is
   **≈ 0.141 s**, versus the 0.5 s target and the ≈ 1.0 s F-O1b decision step
   (absolute per-arm SE ≈ 0.037 s).
3. **The paired goals delta may come back a NULL, and that is a real reading**
   (§PRE-LAID (D)/(E) territory), not a defect: a null at MDE 0.151 says "no
   goals move larger than ~6.8% was resolved", and it is reported as exactly
   that. **Raising N further is affordable in wall** (it scales linearly: even
   3,000/arm is ≈ 88 min) **but not in seeds** — 1,000 is the declared sub-block
   12,303,000–12,303,999 in full and the probe's hard clamp, so any larger N needs
   a fresh block and a ruling. It is in no case a post-hoc self re-cut: the frozen
   formula's output is 1,000 and #181.3 rules exactly that.

### Smoke levels — committed as honest data, DERIVING NOTHING

Recorded for the audit trail only; **no reading in this document rests on them**
(the pre-registration was frozen before the run, and the F-O1b arithmetic is
adjudicated on the full run):

⚠ **Each row names its ESTIMATION BASIS** (#181.1 LOW: the table previously mixed
two sources silently). **`mean-of-matches`** = the per-match value averaged over
the 24 matches (the paired basis; `result.paired.*.control/.treated`).
**`pooled`** = one ratio or moment over the pooled events of all 24 matches
(`result.arms.*.*`) — a different estimator, which is why the two never appear in
one subtraction.

| dimension | basis | OFF | ARMED |
| --- | --- | --- | --- |
| goals/match | mean-of-matches | 2.20833 | 2.5 |
| shots/match | mean-of-matches | 13.125 | 13.04167 |
| conversion · on-target rate | **mean of per-match ratios (paired basis)** (⚠ #182 CORRECTION: this row was mislabelled "pooled"; 0.16908/0.19664 are `result.paired.conversion.control/treated` — the pooled goals÷shots values are 0.168254/0.191693 at `arms.*.equilibrium.conversion`) | 0.16908 · 0.60361 | 0.19664 · 0.60462 |
| loose/match | mean-of-matches | 130.625 | 126.91667 |
| open-play spell mean / median (s) | **pooled** over all open-play spells | 4.5246 / 3.1583 | 4.3846 / 3.0583 |
| open-play spell mean / median (s) | mean-of-matches (the F-O1b basis) | 4.64744 / 3.19653 | 4.5597 / 3.29792 |
| one-touch share (strict) | **pooled** (one-touch spells ÷ all open-play spells) | 0.26683 | 0.2733 |
| one-touch share (strict) | mean-of-matches | 0.26009 | 0.26541 |
| turnovers per watched minute (per display minute) | **pooled** (mean turnovers ÷ mean played seconds) | 8.31574 (0.36959) | 8.23229 (0.36588) |
| turnovers per watched minute | mean-of-matches (the F-O1b basis) | 8.31672 | 8.23971 |
| pressed at reception | **pooled** over first receptions | 0.80299 | 0.79849 |
| pressed at release — **cut-1 population** | **pooled** over cut-1 releases (n 1,558 / 1,463) | 0.76958 | 0.7758 |
| pressed at release — all `performPass` (cross-check) | **pooled** (n 1,810 / 1,717) | 0.71713 | 0.72219 |
| reception→release mean / median (s) | **pooled** over all ownership episodes | 0.6521 / 0.3333 | 0.6936 / 0.3333 |
| reception→release mean / median (s) | mean-of-matches | 0.69652 / 0.30799 | 0.71565 / 0.35347 |

⚠ **Correction of the draft's claim (#181.1 (M1)): NOT every paired contrast at
n = 24 is a null.** Thirteen of the fourteen are (each CI straddles zero), and one
is **RESOLVED**:

| contrast | Δ (ARMED − OFF) | 95% cluster CI | verdict |
| --- | --- | --- | --- |
| **reception→release MEDIAN (s)** | **+0.045486** | **[+0.025694, +0.066667]** | **RESOLVED** |
| reception→release mean (s) | +0.019133 | [−0.113491, +0.150287] | null |
| goals/match | +0.291667 | [−0.375, +0.916667] | null |
| spell mean (s) | −0.087736 | [−0.757322, +0.506386] | null |
| turnovers / watched min | −0.077004 | [−0.79292, +0.683783] | null |
| pressed at release (cut-1) | +0.01034 | [−0.015027, +0.03464] | null |
| *(the other eight: shots, conversion, on-target, loose, spell median, one-touch, pressed-at-reception, passes — all null)* | | | |

**That one resolution is EXPECTED, and it is the seam biting on its own
mechanism.** The wind-up's whole content is *hold the ball W ticks longer before
releasing it* — W p50 = 6 ticks = **0.100 s** (⚠ #182 CORRECTION: 6 ticks at DT=1/60 is exactly 0.100 s; 0.106 s is the realized MEAN, as the gate row states) — and reception-to-release is the
metric that measures exactly that hold. A median shift of **+0.045 s** on a
distribution whose median is ~0.31 s is the mechanism's direct arithmetic
signature showing through at n = 24, not a football outcome: it needs no large
sample because it is nearly deterministic per release, which is precisely why the
downstream *outcome* dimensions (spells, turnovers, goals) stay null at this
scale. It **decides nothing** — F-O1b is adjudicated on the full run, and the
mechanism size was never the question this smoke was allowed to answer.

Two sanity notes, also not conclusions: the OFF arm's absolute tempo levels sit
where the #173.2 prod arm's did (spell mean 4.52 vs 4.39; turnovers/watched-minute
8.32 vs 8.6; pressed-at-reception 0.803 vs 0.808) on a fresh seed block, which is
the flag-off arm behaving like the shipped world it is required to be; and the
seam's realized W distribution, interruption rate (2.32%) and arm share of
eligible cut-1 commits (**0.78002** vs T1's 0.7614) sit on T1's banked figures.

**The launch command with the frozen N is in §COMMANDS above, with `O1T2_N=1000`
(the #181.3 ruled launch N).**
