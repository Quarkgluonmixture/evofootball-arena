# C7 T2 — The Match-Level A/B (deployment / watchability)

Status: **RUN COMPLETE 2026-07-30 (ruling #59.2). GATES PASS — reading (A), the
design case: all-quiet, the +8.79% goals push landed INSIDE the §2 band. Returned
to the commander.** Pre-registered 2026-07-29 and FROZEN BEFORE IMPLEMENTATION; the
arms, instruments, every gate and its derived band, the staging and the full
sign-space readings were fixed **before** a single T2 datum existed (see §1–§7; the
verdict is in §RESULT). No `src/**` changed to run this (the law and its seam
already ship behind `c7Windup`, default OFF, from the certified T1 build; HEAD at
run time `26fa06c`, `git diff --stat -- src` empty, fingerprint `57b0bdab…c673`
unchanged). Per #54.4 / §7 a clean T2 licenses only the commander to TAKE the
single C5 re-census decision; T2 authorizes nothing itself.

Authority chain: **contract [`C7-RELEASE-WINDUP.md`](C7-RELEASE-WINDUP.md) §6-T2**
(this stage's scope: "the C6 T2 battery VERBATIM … + the shot economy") and §5
invariants I1–I9 (bind verbatim), §8 stop rules, §9 non-claims · **ruling #58**
(T1 accepted, T2 drafting authorized): #58.1 (T1 certified — all 16 gates, ledger
5,481/5,481 seam-attributable 0, both structural tests hold), #58.2 (the two-axis
verdict T2 inherits), **#58.3 (the pre-named goals-push risk WITH the commander's
own arithmetic — the shot/goals axis is the headline, both outcomes pre-laid, no
re-cut), #58.4 (T2 drafting authorized: the C6 T2 house battery VERBATIM + the shot
economy with the #58.3 reading pre-laid, bands derived not invented)** · **#52**
(the C6 T2 review — its dispositions bind the same battery here: bands kept
verbatim, §2 band as C1 §4 absolute hard-abort, ledger scoping = only the
seam-attribution ledger re-binds at exactly 0) · **#54.4** (C7 is the named
PAYOFF-SIDE lever; on T2's verdict the single C5 re-census decision returns to the
commander) · #20 (CI-inside-band, cluster = match seed) · #24 (floors re-powered
AND attainable on the deployed population) · #26.5 (population law: the run states
its HEAD) · #32.1 (no coupon-collector max-statistic gate form) · #38.1 (standing
exception classes + full sign space) · #44.5 (a disclosure touching a gate's
POPULATION triggers read-only sizing + commander sign-off before the run) · #46.2
(smoke/census seed disjointness) · #48.3/#49.3 (structural zero-release ledger +
event-keyed classes + receipts) · Road B (nothing ships; `c7Windup` null/off in
every production path).

Data this freeze is derived from (committed, SHA'd):
[`C7-T1-PENDINGKICK.md`](C7-T1-PENDINGKICK.md) §RESULT and
[`data/c7-t1-pendingkick.json`](data/c7-t1-pendingkick.json) (output SHA
`7b88942f…074bb`, table SHA `62a88d86…dea0`); the C6 T2 house battery in
[`C6-T2-MATCH-AB.md`](C6-T2-MATCH-AB.md) §4 (carried VERBATIM — arms form,
watchability limbs with the P2-B bands, offside/box/restart canaries, X-family,
ledger scoping, readings form); the P0 instrument definitions and baselines in
[`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) §2.2 / §3; the
match-level paired-arm house pattern and two-part canary form in
[`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) §4; and the §2 EQUILIBRIUM
BAND as inherited whole from C1 §4 (cited verbatim in §4.2).

Code truth (HEAD `a6e7d9a`, ruling #58): the certified law/seam ship behind
`c7Windup` in `src/sim/Match.ts` (`armPendingKick`, `c7WindupTicks`), the deferred
strike plant in `src/ai/actionExecutor.ts`, the commit fork in
`src/ai/PlayerBrain.ts:984`; `git diff --stat -- src` is empty; the fingerprint is
`57b0bdab…c673` with the flag OFF. T2 arms the **existing** flag on both teams — it
does not touch the law, the seam, the W constants or any T1 gate.

---

## §1 — WHAT T2 IS, AND WHAT IT INHERITS

T1 **certified the SEAM and the two priced axes** (all 16 gates, off a closed
ledger; #58.1). Armed on forked shot commits, the wind-up (a) raised the
interruption rate on seat-shots from a synchronous ~0 to **3.52%** [3.06, 3.99]
(reading (D-band): resolved UP, below the ½×–1.5× band — the #56.2 static-defender
fact borne out live), and (b) delivered the composed-vs-rushed payoff through
prices that already exist: **noise reduction −3.68 pp** [3.50, 3.87] and **power
gain +1.03 pp** [0.98, 1.08], both inside band, tail-carried (twisted θ≥30° noise
−13.61 pp vs aligned −0.42 pp). The shot economy at fork level was REPORTED (not
gated): **seat-shot goal share 17.18% → 20.11%, +2.94 pp** over 5,315 struck forks;
the wind-up distribution realised **W ticks p10 6 / p50 7 / p90 8, mean 6.73
(0.1122 s)**. **T1 cannot price DEPLOYMENT** — that is T2.

T2 asks the one question T1's fork windows could not: **when the wind-up is armed on
BOTH teams across WHOLE matches, does the game the user watches stay football?**
The subject matter includes the user's #1 hate (乱抢 / scrambles), so those limbs
are HARD and their bands are the P2-B/C6-T2 house bands, KEPT VERBATIM (§4.1). The
one quantity T1 banked as a REPORTED fork-level orphan and #58.3 elevates to the
**headline** is the **shot/goals economy**: goals per match and the §2 goals band
(§4.3). The commander's own pre-named arithmetic (#58.3): ~9 seat shots/match ×
+2.94 pp − 3.52% interruptions ≈ **+0.20 goals/match ≈ +8%** — inside the §2 ±15%
band but **the largest single-mechanic push this programme has produced.**

**What T2 does NOT re-litigate.** The per-window fidelity of the wind-up
(`readyTick = commit + W_ticks`, `faceTarget = aim`, `|Δheading| ≤ TURN_RATE·DT`,
ball at the owned carry offset; unexplained exactly 0 over 36,312/36,312 window
ticks) and X-STRUCT-2 (the strike math evaluated once per struck shot, never at
commit, never twice; rng-parity) are **certified by T1 on the identical law and
seam** and are not re-run here. T2's per-record ledger is the
**ownership-release attribution** (the structural zero, §4.6); its watchability
instruments are 6 Hz distributions, not per-tick fidelity checks (the C6 T2
ledger-scoping precedent, #52.1).

---

## §2 — ARMS

The wind-up is **physics, not a choice** (contract §7 Q7: no brain reads it, no
chooser prices it; selection sees outcomes), and it is symmetric — every carrier's
strike takes its honest time. As in C6 T2 there is **no adoption ladder** (the
ladder identifies a unilateral chooser deployed universally; a symmetric physics
change has none to identify). Two arms, paired same-seed:

```text
R0      c7Windup OFF  — must reproduce the shipped world BIT-IDENTICALLY
                       (the flag-off pin; fingerprint 57b0bdab…c673; the
                       synchronous strike verbatim, contract I4)
R-BOTH  c7Windup ON, armed on EVERY carrier's shot commit on BOTH sides
                       (the DEPLOYMENT arm; every canary/band binds here)
```

**One mechanic per A/B: `c6Carry` stays OFF in both arms.** The only difference
between R0 and R-BOTH is the wind-up; the shipped world is otherwise held fixed
(c6Carry OFF ⇒ the rigid 0.85 m carry offset, exactly as the T1 fork ran — "C7
prices TIME, not carry"). This isolates the wind-up's deployment consequences from
C6's; a joint C6+C7 world is the #54.4 C5 re-census's subject, not T2's.

Both arms run the **same seeds**, paired. Every delta below is **paired per-seed**
(R-BOTH minus R0 on the identical seed), with a **match-seed cluster bootstrap** CI,
#20 semantics: a shift is *resolved* only when its cluster-bootstrap CI excludes its
reference; a null is reported as such, never re-cut (contract §8). `c7Windup` is
null in every production path throughout (Road B); the arms exist only as probe
`Match` config.

---

## §3 — SEED BLOCK & STAGING (frozen)

### 3.1 Seed block — fresh, disjoint from every consumed range (#46.2)

```text
seeds = 7,900,000 + blockIndex·100,000 + k,   blockIndex ∈ 0..3,  k ∈ 0..199
      = 4 disjoint blocks × 200 = 800 matches per arm,  same 800 seeds in R0 and R-BOTH
range = 7,900,000 .. 8,200,199
```

Consumed elsewhere and cleared: P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A
2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 T0 smoke 4.0M · C6 T0 census
4.1M–4.7M · C6 T1/T1R 5.0M–6.1M · **C6 T2 6.2M–6.5M** · **C7 T0 smoke 6.6M** · **C7
T0 census 6.7M–7.1M** · **C7 T1 sizing smoke 7.2M** · **C7 T1 run 7.3M–7.8M**.
**7,900,000 lies above every consumed range, including all of C7 T0 and all of C7
T1.** The 4-block × 200 structure mirrors C6 T2 §3.1 (and P2-B §4.6).

### 3.2 Match count, cluster, bootstrap, duration, output

| item | value |
| --- | --- |
| matches per arm | **800** (4 blocks × 200) — the C6 T2 precedent (§3.2), justified below |
| arms | **R0 + R-BOTH = 2 arms** (no ladder) ⇒ **1,600 matches total** |
| duration | the default full match (unchanged; no time knob is touched) |
| instrument sampling | 6 Hz (every 10th tick), `phase === 'playing'`, keepers excluded — **P0 §2 verbatim** |
| cluster unit | the **match seed** (#20), disjoint per block |
| bootstrap | 2,000 resamples, frozen `BOOTSTRAP_SEED = 79002` |
| identity | R0 must reproduce the shipped world bit-identically (the flag-off pin) |
| output | [`data/c7-t2-match-ab.json`](data/c7-t2-match-ab.json), SHA'd, twice byte-identical |
| HEAD | the run states its HEAD (#26.5); expected `57b0bdab…c673` fingerprint throughout (no live substrate change lands between T1 and T2) |

**Why 800 per arm powers every gate — MDEs derived ex ante.** Two power obligations
must be met: the HARD watchability limbs (all-quiet under a change that repositions
no body during the window — §4.1), and the **shot/goals headline** (which must
resolve a ~+8% push and check it against the §2 band — §4.3).

*The scramble battery.* The HARD limbs are the three scramble limbs plus the three
canaries; each expects **all-quiet** (the wind-up defers a strike; it repositions no
body — bodies move under their existing brains throughout the window). MDEs are the
C6 T2 figures verbatim (identical instruments, identical 800-match staging; SE
scaled from P0's 300-match CIs by √(300/800) = 0.612, paired shrinks further, the
figures below are the conservative unpaired scaling):

| HARD limb | instrument | P0 baseline | band edge (fires at) | SE @ 800 (scaled) | **MDE (≈2.8·SE)** | headroom |
| --- | --- | --- | --- | --- | --- | --- |
| **DEGEN-SCRAMBLE** | I4 own-within-5 m | 0.956 | +25% rel = +0.239 (→1.195) | ≈0.0051 | **≈ +1.5% rel** | 17× below edge |
| **DEGEN-PILEUP** | I3 share < 4 m | 9.40% | +50% rel = +4.70 pp (→14.10%) | ≈0.25 pp | **≈ +7% rel** | 7× below edge |
| **DEGEN-RESTDEF** | I5(b) designated slot | 65.82% | −20% rel = −13.16 pp (→52.66%) | ≈0.43 pp | **≈ −1.8% rel** | 11× below edge |

*The shot/goals headline.* The goals-per-match paired delta (R-BOTH − R0) has, at
whole-match scale, most of each match identical between arms (same seed, same
bodies) — only the shot conversions on wound-up strikes differ. A conservative
per-match paired-delta SD of **≤ 0.7 goals** (bounded by ~9 seat shots/match ×
per-shot conversion flips of small probability, correlated with match state) gives
SE over 800 clusters ≈ 0.7/√800 = **0.0247 goals/match**, so **MDE ≈ 2.8·SE ≈ 0.069
goals/match ≈ +2.9%** — comfortably below the pre-named +0.20 goals/match (+8%)
push. **800 matches resolve the goals delta with ample headroom** and locate it
against the §2 band's ±15% (≈ ±0.359 goals) edge with room to spare. (The 0.7 SD is
a conservative estimate, not a measured C6 T2 CI — the C6 T2 goals delta was
−0.056/match on the same staging and resolved cleanly against the band; disclosed as
an estimate per #44.5, and the reading, not the MDE, rules.)

P2-B resolved shifts of +84% / −22% / +18.7% at exactly this 800-match staging with
CIs excluding zero, and C6 T2 ran the identical battery to all-quiet with every CI
straddling zero at 800 matches — the transferred variances confirm 800 has ample
power for the scramble battery, the §2 band and the standing canaries. (I3's SE
anchor: P0 gives no CI for the <4 m share directly; 0.25 pp is the conservative
binomial-on-clustered estimate that reproduces P2-B's ability to resolve its +84%
move — an estimate, not a measured P0 CI.)

---

## §4 — INSTRUMENTS AND GATES (all frozen ex ante; every threshold derived)

Cluster unit for every CI = **match seed** (#20). Every gate covers the full sign
space (#38.1); none is a max-statistic (#32.1). Predicates are **two-part** (a CI
bound AND a relative threshold) wherever they inherit the P2-B/C6-T2 canary form.

### 4.1 (i) WATCHABILITY HARD LIMBS — any one firing STOPS THE QUEUE — C6 T2 §4.1 VERBATIM

All bind on the **R-BOTH** arm, **paired vs R0**, side-split and never summed (P0
§2.1). Firing = the queue stops outright and the fork returns to the commander,
**whatever the shot economy says** (contract §8; P2-B reading (h)).

**The scramble battery — P2-B §4.4 DEGEN bands, KEPT VERBATIM.**

```text
DEGEN-SCRAMBLE  I4 own-within-5 m rises,  CI lower > 0  AND  relative ≥ +25%
                — P0 baseline 0.956;  乱抢 is the user's #1 hate
DEGEN-PILEUP    I3 share < 4 m rises,     CI lower > 0  AND  relative ≥ +50%
                — P0 baseline 9.40%
DEGEN-RESTDEF   I5(b) designated slot falls, CI upper < 0 AND relative ≥ 20% drop
                — P0 baseline 65.82%
```

**Keep-verbatim, justified for a TIME change.** The C6 T2 disposition (bands kept
verbatim because the DEGEN thresholds encode the *disease*, not the mechanism, and
乱抢 limbs may never loosen; #52.1) binds identically here. C7 is a **time** change,
not an eye: during the ≤11-tick window it **repositions no body** — the bodies move
under their unchanged brains; the wind-up only defers the strike and lets the
existing heading integrator keep running. Its only path to these body-shape
instruments is **indirect** — the 3.52% interruption channel converts some shots to
turnovers near the box, which could alter chase patterns. **The bands are KEPT
VERBATIM, never loosened** (a scramble shift arising from a change that repositions
no body would be, if anything, *more* alarming — so the threshold is conservative
for C7, not lax); **tightening is REJECTED as an invented floor** (#19/#24). The
ex-ante expectation is **all-quiet with large margin** (MDEs 7–17× below each edge,
§3.2); a limb firing despite C7 repositioning no body is a strong, unexpected
finding.

**The two reverts' standing canaries (P2-B §4.3) — carried HARD, verbatim.**

```text
C-OFFSIDE  offsides per match (both sides) rises,  CI lower > 0  AND  point ≥ +10%
           — revert 2 blasted +50%; +10% = ⅕ of that blast; P2-B fired this at +18.7%
C-BOX      attackers in the opposition box AT CROSS ARRIVAL falls,
           CI upper < 0  AND  relative drop ≥ 15%
           — revert 1 emptied the box; C4 T0 measured 0.98–1.53 bodies at arrival,
             so 15% ≈ ⅕ of a body.  C4 T0's four arrival classes (C0/C1/C2/C3)
             REPORTED alongside so a class-MIX shift shows even if the count holds
```

Offside is ball-position-keyed; the wind-up does **not** move the ball (it stays
owned at the carry offset through the window — the strike simply leaves later), so
C7's path to C-OFFSIDE is thin (a shot leaving a few ticks later marginally shifts
the offside snapshot). C-BOX's path is the same indirect timing shift. All-quiet is
the expectation on both; the bands stay verbatim.

**Restart health (§6-T2 (v)) — HARD, C6 T2 band verbatim.**

```text
C-RESTART  restart ticks per match rises,  CI lower > 0  AND  relative ≥ +10%
           Derivation: P2-B's degenerate run raised restarts +20.8%; +10% is HALF
           of that.  The restart TAKER is E-RESTART-excluded, so C7 has no direct
           path here; the only indirect path is the INT-PHASE share of interruptions
           (28.4% at T1 — a whistle inside the window), which could add restarts.
           All-quiet is the expectation.
```

### 4.2 (ii) THE §2 EQUILIBRIUM BAND — C1 §4 verbatim, hard abort

Applied **verbatim** as inherited whole (C4-T1-FLIGHT §5.1). The R-BOTH arm's five
headline per-match rates must each stay inside the absolute band; a break is a hard
abort (reading (C), the C1-B precedent). R0's rates are reported against the same
baselines as the flag-off sanity cross-check (P2-B §4.2: a large R0-vs-baseline
drift is itself reported).

```text
baselines (C1 §4):  goals 2.3944 · crosses 2.4894 · headers 9.1039 ·
                    long balls 6.2042 · cutbacks 3.8151

goals/match        within ±15%     2.0352 .. 2.7536       ← the #58.3 HEADLINE band
crosses            within ±25%     1.8671 .. 3.1118
headers won        within ±25%     6.8279 .. 11.3799
long balls         within ±25%     4.6532 .. 7.7553
cutbacks           within ±25%     2.8613 .. 4.7689
```

**The goals band is the #58.3 headline and is the LIVE reading, not an all-quiet
expectation** (unlike every other C6 T2 limb). C7 actively changes shot outcomes;
the goals band is the guard the commander pre-named for the +8% push (§4.3). Per
#30.3 the band is a **guard, never a hand re-tune** — a break is honest-revert (of
nothing, since nothing ships), the finding banked, not a licence to re-cut the law.
**Shots and possession spells are NOT in the canonical §2 five**; they are REPORTED
with CIs (§4.4), never folded into the hard band — inventing a band for them would
be the #19 error.

### 4.3 (iii) THE SHOT / GOALS AXIS — the #58.3 HEADLINE, both outcomes pre-laid

This is the C7-specific reading and the round's headline (#58.3). The **one band**
on this axis is the **§2 goals band** above (±15% absolute, R-BOTH vs the C1
baseline 2.3944 ⇒ [2.0352, 2.7536]); no separate paired-delta band is invented (the
C4 I2 conversion-ceiling doctrine — conversion is a CEILING, MORE goals is not a
deliverable, so a "goals must rise" band would invert the doctrine; #19). The goals
push is **priced against the equilibrium band, nothing more.**

**Reported both ways, so the mechanism size and the balance check are both visible:**

* **goals/match — paired delta (R-BOTH − R0), match-seed cluster-bootstrap CI**:
  the mechanism size (T1's fork-level +2.94 pp goal share → the commander's
  ~+0.20/match, ~+8% arithmetic; #58.3). REPORTED with CI.
* **goals/match — R-BOTH absolute vs the §2 band [2.0352, 2.7536]**: the hard-abort
  check. Note the anchoring: the §2 band is relative to the **C1 baseline 2.3944**,
  while the paired delta is relative to **R0**. C6 T2 measured R0 goals at 2.28875
  (−4.4% below the C1 baseline on a fresh block); if C7's R0 sits similarly below
  baseline, an +8% paired push lands R-BOTH *below or near* the baseline in absolute
  terms and comfortably inside the band. If R0 sits closer to baseline, or the live
  match-level push exceeds the fork-derived +0.20, R-BOTH can approach or cross the
  upper edge 2.7536 — **the live risk #58.3 names.** Both numbers are reported; the
  **band decision reads the absolute R-BOTH point** (C6 T2 §4.2 form).

**THE TWO OUTCOMES, PRE-LAID WITH DISPOSITIONS (#58.3 — not one re-cut after
sight):**

```text
INSIDE the §2 goals band  (R-BOTH goals/match ∈ [2.0352, 2.7536])
  ⇒ PRICED AND BANKED.  The wind-up's composed-vs-rushed payoff (T1 axis 2) buys
    more goals — the largest single-mechanic push this programme has produced — and
    the equilibrium still holds.  Priced as designed; part of reading (A).  Nothing
    re-cut, nothing tightened.  The +8% is a REAL, watchable balance effect that
    lives inside the band the programme set for itself.

OUTSIDE the §2 goals band (R-BOTH goals/match resolves > 2.7536 — or, implausibly,
                           < 2.0352)
  ⇒ THE FORK RETURNS TO THE COMMANDER (reading (C)).  The world's honest answer
    about balance: the wind-up, deployed both sides across whole matches, moves
    goals more than the equilibrium band permits.  Honest revert of nothing (Road
    B).  NOTHING is re-cut — not the W law, not the bands, not the readings (#58.3:
    "the reading is the world's honest answer about balance, not a probe defect.
    Nobody re-cuts anything to make it fit").
```

**Also REPORTED with CIs (paired vs R0, match-seed cluster bootstrap; none gated —
the causal story behind the headline; #58.3's reported list):**

```text
shots/match                         · seat-shot share (open-play+one-touch commits / all shots)
conversion (goals / shots)          · on-target rate
blocks/match                        · charge-downs/match  (INT-TACKLE reaching the owned ball, T1's 71.1% channel)
wind-up W distribution realised live (p10/p50/p90/mean W ticks on R-BOTH — cross-check vs T1's p50 7 / mean 6.73)
interruption rate at match level    (INT-* / seat-shot commits — cross-check vs T1's fork-level 3.52%; live match-level may differ)
twisted-tail share                  (struck shots with θ ≥ 30° at commit / all struck — cross-check vs T1's 24.7%)
```

These carry no gate; their sign informs reading (A) coherence and reading (E)
disagreement (§6). The interruption-rate and W-distribution live cross-checks are
the deployment-scale analogues of T1's fork numbers — a large divergence is
information about whole-match reaction (§5 divergence semantics), never a re-cut.

### 4.4 (iv) DUEL / TURNOVER ECONOMY — REPORTED with CIs, NOT gated

The interruption channel's causal story, reported (contract §6-T2; the scramble
battery + §2 band gate, this does not). Match-seed cluster CIs, paired vs R0:

```text
tackle recoveries/match            · interceptions/match
where turnovers happen             (zone histogram: own third / middle / their third)
turn-episode outcomes              (the T1 window's turn-episode loss economy, at match scale)
```

These carry no gate (they are the causal story behind the priced/hard instruments);
their sign informs the (E) instruments-disagree reading (§6).

### 4.5 (v) LOOSE-BALL ECONOMY & KICK-ORIGIN — derived, why they are NOT priced bands here

The C6 T2 house battery priced two consequences (PC-LOOSE, PC-KICK). Both are
**derived out** for C7 — a band on either would be an invented floor (#19):

* **Loose-ball economy — REPORTED, expected ~NULL by construction (contract I3).**
  C7 opens **no new loose-ball channel**: an interruption is an EXISTING ball-keyed
  tackle (an existing release channel), never a new one; the seam never releases
  ownership itself (T1 X-STRUCT-1, certified). A priced band would invent a disease
  C7 cannot cause. It is REPORTED (loose/match, paired Δ + CI) and **guarded at
  exactly 0 by the STRUCTURAL SEAM-NEVER-RELEASES gate** (§4.6); a resolved
  loose-ball *increase* without a gate failure would be a structural surprise →
  reading (D), returned to the commander.
* **Kick-origin displacement (PC-KICK) — N/A.** C6's PC-KICK priced a *positional*
  shift (the carry offset moving the kick origin). C7 moves **no origin**: the ball
  stays at the rigid 0.85 m carry offset (c6Carry OFF) through the window, and the
  strike aims from the true origin at `readyTick` exactly as today. C7 prices the
  TIME a strike takes, not where the ball goes (contract §9 estimand). The
  origin-displacement instrument and its ±5% completion band do not transfer; the
  wind-up's completion/quality consequence lives in the shot economy (§4.3), not in
  a position term.
* **Restart health** is retained as the HARD **C-RESTART** canary (§4.1, C6 T2
  battery verbatim) — not derived out; expected all-quiet (the restart taker is
  E-RESTART-excluded).

### 4.6 (vi) ALSO REPORTED (ecology, CIs, not gating)

The full P0 seven at match level (I1 dwell · I2 target drift · I3 spacing · I4
convergence · I5 both rest-defence readings · I6 duplicate runs · I7 shape delta),
side-split; plus possession spells (count + duration distribution), long-ball share,
and the eye-independent watchability items (#15.4: forward-pass share, give-and-gos,
longest chain) — REPORTED, never gated, so the play-feel picture is complete for the
commander and the user's later eyes.

### 4.7 (vii) X-family (OFF identity, determinism, single seam) — HARD — C6 T2 §4.6 form

| gate | predicate |
| --- | --- |
| **X-FP** | `c7Windup` OFF: league fingerprint identical to the frozen baseline `57b0bdab…c673` |
| **X-OFF-IDENT** | R0 world signatures **byte-identical** to the shipped world across the 800 seeds (the flag-off pin; contract I4) |
| **X-SEAM** | a test asserts `c7Windup` gates the wind-up in exactly its two seam points (the `armPendingKick` commit fork in `PlayerBrain`, the deferred-strike plant in `actionExecutor`), is null on a fresh `Match`/`League`, and gates no excluded release path (inherited from T1's X-SEAM `tests/c7Windup.test.ts`; re-asserted) |
| **X-DET** | two `runExperiment()` invocations produce byte-identical output JSON; the table/output SHAs are emitted and quoted |
| **STRUCTURAL SEAM-NEVER-RELEASES-OWNERSHIP (#48.3 / I3)** | on R-BOTH, every ownership release classes to a named EXISTING channel (strike-at-`readyTick`/`kickBall`, tackle-won, stun-drop, phase-leave, sent-off, de-glue, ball-won); **`pendingKick`-seam-attributable releases exactly 0** over the standing class set incl. E-INJURY. Any unattributable release ⇒ FAIL |

Any X-family / structural gate failing ⇒ FAIL, queue stops at the commander
(reading (F)), whatever the watchability instruments say. **Per-window fidelity and
X-STRUCT-2 (strike-math evaluated once, never duplicated; rng-parity) are
T1-certified on the identical law/seam and are NOT re-run** (§1; the C6 T2
ledger-scoping precedent, #52.1).

---

## §5 — EXCEPTION CLASSES (mandatory boilerplate, #38.1) & what is ledgered

The standing set, incl. **E-INJURY** (a named house class, #49):

```text
E-PAUSED     phase ≠ 'playing' (kickoff, halftime, stoppage, restart wait)
E-GKHOLD     gkHoldTimer > 0 or gkDistributing (keeper hold)
E-GK         role === 'GK'  (keepers excluded from every body instrument, P0 §2)
E-NOOWNER    ball has no owner (in flight / loose)
E-RESTART    the restart taker (restartKickGid === owner.gid)
E-SENTOFF    owner sent off
E-STUN       carrier stunned mid-window (a stun-drop resolving through the tackle channel)
E-DEGLUE     the de-glue branch fired — ball already free
E-TRANSITION the ownership / same-player re-strike artefact
E-INJURY     advantage-foul injury to the shooter inside the window: same-gid attrs
             mutation post-read (limb 1, takeKnock) OR same-gid becomeSub reposition
             without ball release (limb 2) — the #49 named class, both limbs code-cited
             (at T1 one E-INJURY interruption resolved, INT composition 0.5%)
E-ENDED      the match ended inside the window/horizon (EXCLUDED, count REPORTED, #48.4)
```

**What is ledgered, and where "unexplained exactly 0" applies (the C6 T2
precedent, #52.1).** T2's match-level watchability instruments (I1–I7, sampled
6 Hz) are **distributions**, not per-tick fidelity recomputes: they have
**sampling-exclusion** classes (E-PAUSED, E-GK/keeper, E-ENDED) REPORTED as counts,
and **no** "unexplained exactly 0" requirement — the wind-up's per-window fidelity is
already **certified by T1** on the identical law and seam. The **one T2 ledger where
"unexplained exactly 0" binds** is the **ownership-release attribution** (STRUCTURAL
SEAM-NEVER-RELEASES, §4.7): every release must class to a named EXISTING channel over
the full set above; **`pendingKick`-seam-attributable releases must be exactly 0**.
Any release the ledger cannot attribute ⇒ FAIL. Per-record receipts
`{seed, tick, gid, cause}` are kept for each class hit, capped 1,000/class (first-N,
deterministic — the #49.3 obligation, carried).

---

## §6 — PRE-LAID READINGS — the full sign space (#38.1)

Written before the run; not one may be re-cut after sight (contract §8). Each
carries its disposition. **Nothing ships in any branch (Road B).**

* **(A) ALL-QUIET, GOALS IN-BAND — the design case.** No watchability HARD limb
  fires (scramble battery, C-OFFSIDE, C-BOX, C-RESTART all quiet), the §2 band holds
  on all five dimensions **including goals (the +8% push lands inside ±15%,
  §4.3)**, the loose-ball economy is ~null, the X-family/structural gates pass, and
  the shot/duel economy is coherent. Disposition: **return to the commander.** What
  it licenses: **nothing ships**; the T2 verdict returns to the commander, who may
  then take the **#54.4 single C5 re-census decision** (one census over the C6+C7
  enriched world, H1 re-powered). T2 **cannot** authorize that re-census, nor any
  live-arming — it only licenses the commander to *consider* them (§7 NON-CLAIMS).

* **(B) A WATCHABILITY HARD LIMB FIRES.** Any of DEGEN-SCRAMBLE / DEGEN-PILEUP /
  DEGEN-RESTDEF / C-OFFSIDE / C-BOX / C-RESTART fires (its two-part predicate met).
  Disposition: **STOP OUTRIGHT, return to the commander**, whatever the shot economy
  and goals say (P2-B reading (h); 乱抢 is #1 hate). No re-cut of the law, the bands
  or the readings. A limb firing from a TIME change that repositions no body during
  the window is a strong, unexpected finding (§4.1), banked as such.

* **(C) §2 BAND BREAKS — the pre-named goals-push risk lives here (#58.3).** Any of
  the five headline rates leaves its band on R-BOTH. **The named case: goals/match
  resolves above 2.7536** (the +8% push overshoots the equilibrium at match level).
  Disposition: **return to the commander with the broken dimension quantified**; the
  world's honest answer about balance (#58.3), **no re-cut** (#30.3: the band is a
  guard, never a re-tune; nobody re-cuts anything to make it fit). Honest revert of
  nothing (Road B). Any other §2 dimension breaking (e.g. long balls, cutbacks)
  disposes identically.

* **(D) A REPORTED-ECONOMY SURPRISE.** The loose-ball economy resolves a nonzero
  *increase* (against I3's no-new-channel construction, and without the structural
  gate firing), OR a single reported shot/duel-economy instrument resolves opposite
  to the coherent composed-vs-rushed story. Disposition: **reading, return to the
  commander, no re-cut** — the live whole-match world produced a consequence the
  contract's construction did not predict; the constants do not move.

* **(E) INSTRUMENTS DISAGREE IN SIGN.** The watchability, shot and duel-economy
  instruments point opposite ways with CIs excluding zero (e.g. goals rise while
  on-target and conversion both fall; or the duel economy says "more turnovers"
  while the interruption rate says "fewer") — no coherent deployment story.
  Disposition: **returned UNRESOLVED to the commander** (the P2-B
  ladder-disagreement precedent, reading (g)); no shipping claim, no re-cut.

* **(F) AN X-FAMILY / STRUCTURAL GATE FAILS.** X-FP / X-OFF-IDENT / X-SEAM / X-DET
  fails, OR a `pendingKick`-seam-attributable release ≠ 0. Disposition: **FAIL, the
  queue stops at the commander** (contract §8; P2-B reading (h)/(a)), whatever the
  watchability instruments say — a fork that cannot reproduce its own flag-off
  world, or a seam that frees a ball, is not a valid deployment measurement.

---

## §7 — NON-CLAIMS

* **T2 ships NOTHING (Road B).** `c7Windup` is null/off in every production path
  through the whole stage; the fingerprint is unchanged (`57b0bdab…c673`); there is
  no default-ON. `c6Carry` is likewise OFF in both arms (one mechanic per A/B). T2
  ends with a verdict, never a live default (contract §8).
* **A clean T2 licenses exactly ONE thing: the commander to TAKE the #54.4 C5
  re-census decision** (contract §6-T3 / §7-T3 — one census over the C6+C7 enriched
  world). T2 **cannot** authorize that re-census, nor any live-arming; both are the
  commander's (and, for live arming, the user's) decision, taken after T2 returns.
  Nothing more is licensed.
* **T2 prices the WIND-UP's DEPLOYMENT CONSEQUENCES, not value** (contract §9): the
  goals push is a REPORTED balance effect checked against the equilibrium band, not
  a claim that holding/wind-up "pays" — that is exactly what the post-C7 C5
  re-census measures (#54.4), and pre-judging it would be the E5h ×1.3 hazard in a
  time costume.
* **No new price** (contract I1): C7 prices TIME only; the existing
  orientation/curl/keeper math is evaluated at strike time, never duplicated. **No
  opponent input in W** (I2). **No new attack surface / no new loose-ball channel**
  (I3). **No shoot-early-vs-set CHOICE** (the wind-up is physics; the choice seat is
  a future C5-family slice, contract §9). **No keeper anticipation** (I6). **No new
  gene, no new attribute** (I8). **SHOTS ONLY** — pass/cross wind-ups are future
  contracts (I9).
* **Untouched:** `pendingControl` (the reception mirror, I7), `KICK_COOLDOWN`, the
  restart run-up, `firstTouchWindow`/`oneTouchMul`, `executedPassPower`, curl/spin,
  C4's flight machinery, `heading`/`TURN_RATE` (I5), and C6's carry glue (c6Carry
  OFF throughout). T2 arms the existing flag; it changes no `src/**` to run.

---

## §RESULT — the AUTHORIZED run (commander ruling #59.2)

Implementation: HEAD `26fa06c` (`c7Windup` OFF in every production path from the
T1 build; `git diff --stat -- src` empty; fingerprint `57b0bdab…c673` unchanged).
Instrument: [`../../scripts/probes/c7-t2-match-ab.ts`](../../scripts/probes/c7-t2-match-ab.ts).
Data: [`data/c7-t2-match-ab.json`](data/c7-t2-match-ab.json). Run **800 matches ×
2 arms = 1,600 matches**, seeds `7,900,000 + b·100,000 + k` (§3.1; disjoint above
all of C7 T0 and all of C7 T1), paired same-seed. `runExperiment()` invoked
**twice, byte-identical** (X-DET). Verdict: **GATES PASS.** Wall time ≈ 5.3 min.
**The pre-laid reading that fired is (A) — ALL-QUIET, GOALS IN-BAND, the design
case.**

* **output SHA** `ed4188474d9855ea7a9d328935c7db14a20f9447a517d90bf5bf397088e6bbf0`
* **table SHA** (limbs, band, shot/goals axis, loose-ball, duel, ecology, structural) `b532212fe3fc6369a18143dba80117d1c0082c95a997ab4d8bf8058987e898ac`

### The headline (#58.3): the goals push landed, and it landed inside the band

The commander's own pre-named arithmetic (#58.3) was **~+0.20 goals/match ≈ +8%.**
The world delivered **+0.1975 goals/match, CI [0.05, 0.3425], +8.79% over R0** —
the paired delta lands **almost exactly on the pre-named figure**, and its CI
excludes zero (the push is real). This is the largest single-mechanic goals push
this programme has produced. **And the equilibrium held:** R-BOTH goals/match =
**2.44375**, inside the §2 band **[2.0352, 2.7536]**, **0.30981 below the upper
edge** — reading (A), priced and banked, nothing re-cut, nothing tightened.

The **anchoring subtlety #59.1 disclosed rather than discovered** is exactly why:
R0 sits **below** the C1 baseline (R0 = 2.24625, −6.2% vs 2.3944), so an +8.79%
paired push lands R-BOTH only **+2.06%** above the C1 baseline in absolute terms —
comfortably mid-band. The push is real (paired) and the balance holds (absolute);
both numbers reported, the band decision reads the absolute point (§4.3).

### §4.7 X-family / structural gate table

| gate | verdict | evidence |
| --- | --- | --- |
| **X-FP** | ✅ PASS | league fingerprint `57b0bdab…c673`, `c7Windup` OFF (nothing armed in production) |
| **X-OFF-IDENT** | ✅ PASS | R0 world signatures byte-identical to the shipped/default-flag world across **all 800 seeds** (0 mismatches) — the flag-off pin (contract I4) |
| **X-SEAM** | ✅ PASS | `c7Windup === false` and `pendingKick === null` on a fresh `Match` (T1's `tests/c7Windup.test.ts` re-asserted) |
| **X-DET** | ✅ PASS | two `runExperiment()` invocations byte-identical; SHAs above |
| **STRUCTURAL SEAM-NEVER-RELEASES-OWNERSHIP** (#48.3 / I3) | ✅ PASS | **seam-attributable releases = 0**, unattributable = 0, over **107,684** R-BOTH releases (strike/kick 99,482 · de-glue 5,742 · ball-won 2,076 · tackle 384) — every one classes to a named EXISTING channel; the pendingKick seam writes `ball.owner` nowhere |

Exclusion counts (REPORTED, §5): E-PAUSED 1,734,841 · E-GK 1,643,702 · E-ENDED 0
sampling ticks; receipts kept first-N per class (cap 1,000). Per-window fidelity
and X-STRUCT-2 are **T1-certified on the identical law/seam and not re-run** (§1,
the #52.1 scoping precedent).

### §4.1 (i) Watchability HARD limbs — all-quiet, every margin wide

All bind on R-BOTH paired vs R0, side-split, two-part predicates (a CI bound AND a
relative threshold). **Every limb is QUIET.**

| HARD limb | instrument | measured (worst side) | band edge (fires at) | margin | verdict |
| --- | --- | --- | --- | --- | --- |
| **DEGEN-SCRAMBLE** | I4 own-within-5 m | rel **+1.63%** (s0), CI [+0.005, +0.025] | ≥ +25% rel | **15× below edge** | ✅ quiet |
| **DEGEN-PILEUP** | I3 share < 4 m | rel **+0.80%** (s1), CI straddles 0 | ≥ +50% rel | far below | ✅ quiet |
| **DEGEN-RESTDEF** | I5(b) designated slot | rel **+0.39% / −0.70%**, CIs straddle 0 | ≤ −20% rel | far above | ✅ quiet |
| **C-OFFSIDE** | offsides/match (pooled) | Δ +0.06, CI [−0.095, +0.211], rel +2.16% | lower > 0 AND ≥ +10% | CI straddles 0 | ✅ quiet |
| **C-BOX** | box bodies at cross arrival | Δ **+0.064** (rises), rel +7.54% | upper < 0 AND ≤ −15% drop | wrong sign (rises) | ✅ quiet |
| **C-RESTART** | restart ticks/match | Δ +39.4, CI [−3.9, +81.4], rel +2.56% | lower > 0 AND ≥ +10% | CI straddles 0 | ✅ quiet |

The two small DEGEN-SCRAMBLE side CIs resolve just above zero (+1.6% / +1.1% rel)
— a **real but minuscule** convergence far below the +25% edge (the 3.27%
interruption channel converting a few near-box shots to loose contests, exactly the
indirect path §4.1 named); it is nowhere near firing. Arrival-class mix (REPORTED
alongside C-BOX): R0 C0/C1/C2/C3 = 639/169/455/600, R-BOTH = 655/154/419/693 — a
mild shift toward **more headers** (C3 +93), consistent with the box holding, no
class collapse.

### §4.2 (ii) The §2 equilibrium band — holds on all five dimensions

| dimension | R-BOTH/match | band | rel vs C1 baseline | verdict | R0/match |
| --- | --- | --- | --- | --- | --- |
| **goals** (±15%, #58.3 headline) | **2.44375** | [2.0352, 2.7536] | **+2.06%** | ✅ inside | 2.24625 |
| crosses (±25%) | 2.45875 | [1.8671, 3.1118] | −1.23% | ✅ inside | 2.3725 |
| headers won (±25%) | 8.825 | [6.8279, 11.3799] | −3.06% | ✅ inside | 8.8625 |
| long balls (±25%) | 5.76375 | [4.6532, 7.7553] | −7.10% | ✅ inside | 6.09 |
| cutbacks (±25%) | 3.9525 | [2.8613, 4.7689] | +3.60% | ✅ inside | 3.7175 |

R0 rates are all inside the band too (the flag-off sanity cross-check, P2-B §4.2):
no large R0-vs-baseline drift.

### §4.3 (iii) The shot / goals axis — both ways, and the reported economy

**Goals reported both ways (§4.3):**

* **paired delta (mechanism size):** **+0.1975 goals/match**, CI **[0.05,
  0.3425]**, **+8.79%** — resolved UP, ≈ the #58.3 pre-named +0.20/+8%.
* **R-BOTH absolute (hard-abort check):** **2.44375** ∈ [2.0352, 2.7536], inside,
  **0.30981 below the upper edge / 0.40851 above the lower.** → reading (A).

**The shot economy (paired CIs, REPORTED, none gated):**

| quantity | R0 | R-BOTH | Δ (CI) | resolved? |
| --- | --- | --- | --- | --- |
| shots/match | 13.17 | 13.2325 | +0.0625 [−0.233, +0.356] | no (null) |
| **conversion** (goals/shots) | 0.17494 | 0.19045 | **+0.01551 [+0.0044, +0.0268], +8.87%** | ✅ yes |
| **on-target rate** | 0.57057 | 0.59599 | **+0.02542 [+0.0117, +0.0389], +4.46%** | ✅ yes |
| blocks/match | 0.10625 | 0.1225 | +0.01625 [−0.016, +0.049] | no (null) |

**The coherent composed-vs-rushed story holds:** shots/match is flat (the wind-up
adds no shots — it does not manufacture chances), while **conversion and on-target
both rise** (the composed strike scores more of the SAME shots). The +8.87%
conversion lift is the mechanism behind the +8.79% goals push — one and the same
effect, not two. No instrument points against the story (no reading (E)).

**Wind-up-specific live cross-checks vs T1 (R-BOTH; no wind-up exists on R0):**

| quantity | T1 (fork) | T2 (live match) | note |
| --- | --- | --- | --- |
| realised W distribution | p50 7 / mean 6.73 | **p10 6 / p50 7 / p90 8 / mean 6.7355 (0.1123 s)** | n = 7,380 arms; matches T1 almost exactly |
| match-level interruption rate | 3.52% | **3.27%** (241 / 7,380) | INT-* / seat commits; live ≈ fork |
| twisted-tail share (θ≥30°) | 24.7% | **25.02%** (1,786 / 7,139 struck) | matches T1 |
| seat-shot share (commits / all shots) | — | **69.71%** (7,380 / 10,586) | most shots route the v1 seat |
| charge-downs/match (INT-TACKLE) | 71.1% of INT | **0.30125/match** (241 total, **100% INT-TACKLE**) | at match scale every interruption was a ball-keyed tackle; no INT-PHASE terminal in the single-slot window |

### §4.5 (v) Loose-ball economy — ~null, structural gate holds

Loose/match R0 = 133.52, R-BOTH = 133.83, **Δ +0.311, CI [−1.019, +1.586], rel
+0.23% — a null (CI straddles zero), `resolvedIncrease = false`.** No new
loose-ball channel opened (contract I3), and the STRUCTURAL SEAM gate holds it at
exactly 0 (§4.7) — no reading (D) surprise. **PC-KICK N/A** (C7 moves no origin;
c6Carry OFF, the ball stays at the rigid carry offset through the window).

### §4.4 (iv) Duel economy — REPORTED, all null (coherent)

tackles/match +0.164 [−0.21, +0.52] · interceptions/match −0.043 [−0.51, +0.40] ·
turnover zone own/mid/their all straddle zero (+0.114 / −0.093 / −0.099) ·
turn-episodes −0.055 [−0.28, +0.19] · turn-episode loss rate +0.0053 [−0.017,
+0.027]. **Every duel-economy instrument is a null** — the interruption channel is
thin (3.27%) and leaves the whole-match turnover economy statistically unmoved,
consistent with the small conversion-side effect being the wind-up's real footprint.

### The verdict — reading (A), returned to the commander

Every HARD limb quiet; the §2 band holds on all five dimensions **including the
goals headline**; the goals push is real (+8.79% paired) AND in-band (2.44375,
0.31 below the upper edge); the shot economy is coherent (conversion up, shots
flat); the loose-ball economy is null and the structural seam gate holds at exactly
0; every X-family gate passes. **This is reading (A): ALL-QUIET, GOALS IN-BAND —
the design case.** Disposition (§6-A): **return to the commander.** T2 ships
nothing (Road B; `c7Windup` null/off in every production path, fingerprint
unchanged). Per #54.4 / §7, a clean T2 licenses exactly one thing — **the commander
to TAKE the single C5 re-census decision** over the C6+C7 enriched world; T2 cannot
authorize it, nor any live-arming. Nothing more is licensed.
