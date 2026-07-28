# C6 T2 — The Match-Level A/B (deployment / watchability)

Status: **PRE-REGISTERED 2026-07-29, FROZEN BEFORE IMPLEMENTATION.** Nothing is
built. Nothing has been run. No `src/**` will change to run this (the law and its
seam already exist behind `c6Carry`, default OFF, from the certified T1R build);
no T2 probe script exists yet. This document freezes the arms, the instruments,
every gate and its derived band, the staging and the full sign-space readings
**before** a single T2 datum exists. **This freeze RETURNS TO THE COMMANDER for
review; the run needs its own authorization** (#51.1: "frozen before
implementation, commander review before any run").

Authority chain: **contract [`C6-EMBODIED-CARRYING.md`](C6-EMBODIED-CARRYING.md)
§6-T2** (this stage's scope), §5 invariants I1–I9 (bind verbatim), §8 stop rules,
§9 non-claims · **ruling #51** (T2 authorized, user-ratified "跑"): #51.1 (the
kick-origin displacement and the loose-ball delta are T2's to PRICE — each a
pre-registered band with a derivation, not a reported orphan), #51.2 (law armed
BOTH TEAMS vs R0, paired seeds, physics is symmetric so **no adoption ladder**),
#51.3 (sub-agent channel) · **#50** (T1R accepted, reading (A), both axes
certified — the numbers T2 inherits) · **#49** (E-INJURY is now a named house
class) · #20 (CI-inside-band, cluster = match seed) · #24 (floors re-powered AND
attainable on the deployed population) · #26.5 (population law: the run states its
HEAD) · #32.1 (no coupon-collector max-statistic gate form) · #38.1 (standing
exception classes + full sign space, every stage) · #44.5 (a disclosure touching a
gate's POPULATION triggers read-only sizing + commander sign-off before the run) ·
Road B (nothing ships; `c6Carry` null/off in every production path).

Data this freeze is derived from (committed, SHA'd):
[`C6-T1-HONEST-OFFSET.md`](C6-T1-HONEST-OFFSET.md) §T1R RESULT and
[`data/c6-t1r-honest-offset.json`](data/c6-t1r-honest-offset.json) (table SHA
`f1d98a8b…07e1`, output SHA `38cfae01…600a`); the P0 instrument definitions and
baselines in [`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) §2.2 / §3;
the match-level paired-arm house pattern, the two-part canary form and the
scramble battery in [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) §4; and
the §2 EQUILIBRIUM BAND as inherited whole from C1 §4 (cited verbatim in §GATES).

Code truth (HEAD `7cd8faf`, ruling #51): the certified law/seam ship behind
`c6Carry` in `src/sim/Match.ts` (`applyC6HonestOffset`, the outfield glue fork);
`git diff --stat -- src` is empty; the fingerprint is `57b0bdab…c673` with the
flag OFF. T2 arms the **existing** flag — it does not touch the law, the seam, the
constants or any T1R gate.

---

## §1 — WHAT T2 IS, AND WHAT IT INHERITS

T1R **certified the GEOMETRY** (reading (A), off a closed ledger): armed both
teams inside turn-episode fork windows, the honest offset raised tackle
eligibility (+11.63%, CI [+8.51%, +14.85%], band low-half) and broke the
degenerate far-side baseline (+1.3215 pp, CI [+1.254, +1.3925], ~93% of the T0
recompute), the lag-skill gradient came out monotone positive, the structural
zero-loose held (offset-attributable releases **0**), and the run was
deterministic. **T1 cannot price DEPLOYMENT** — that is T2.

T2 asks the one question T1R's fork windows could not: **when the honest offset is
armed on BOTH teams across WHOLE matches, does the game the user watches stay
football?** The subject matter is the user's #1 hate (乱抢 / scrambles), so its
limbs are HARD (§6-T2). Three quantities T1R banked as REPORTED orphans are now
T2's to PRICE with derived bands (#51.1): the loose-ball economy (+363 at fork
level) and the kick-origin displacement (p50 +16.5% over its T0 bound).

**What T2 does NOT re-litigate.** The per-tick fidelity of the offset (applied
offset ≡ §LAW to 1e-9; unexplained exactly 0 over the class set incl. E-INJURY) is
**certified by T1R on the identical law and seam** and is not re-run here. T2's
per-record ledger is the **ownership-release attribution** (the structural
zero-loose, §EXCEPTION CLASSES); its watchability instruments are 6 Hz
distributions, not per-tick fidelity checks.

---

## §2 — ARMS (#51.2)

Physics is symmetric, so the adoption ladder (one body → one team → both teams,
P2-B §4.1) does **not** apply — the ladder exists to identify a *unilateral*
chooser deployed universally, and a body-ball interface that tells the truth
about every carrier is symmetric by construction. Two arms, paired same-seed:

```text
R0      c6Carry OFF  — must reproduce the shipped world BIT-IDENTICALLY
                       (the flag-off pin; fingerprint 57b0bdab…c673)
R-BOTH  c6Carry ON, armed on EVERY outfield carrier on BOTH sides
                       (the DEPLOYMENT arm; every canary/band binds here)
```

Both arms run the **same seeds**, paired. Every delta below is **paired per-seed**
(R-BOTH minus R0 on the identical seed), with a **match-seed cluster bootstrap**
CI, #20 semantics: a shift is *resolved* only when its cluster-bootstrap CI
excludes its reference; a null is reported as such, never re-cut (contract §8).
`c6Carry` is null in every production path throughout (Road B); the arms exist
only as probe `Match` config.

---

## §3 — SEED BLOCK & STAGING (frozen)

### 3.1 Seed block — fresh, disjoint from every consumed range

```text
seeds = 6,200,000 + blockIndex·100,000 + k,   blockIndex ∈ 0..3,  k ∈ 0..199
      = 4 disjoint blocks × 200 = 800 matches per arm,  same 800 seeds in R0 and R-BOTH
range = 6,200,000 .. 6,500,199
```

Consumed elsewhere and cleared: P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A
2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · T0 smoke 4.0M · T0 census
4.1M–4.7M · **T1/T1R 5.0M–6.1M**. **6,200,000 lies above every consumed range,
including all of T1/T1R.** The 4-block × 200 structure mirrors P2-B §4.6 (its
`3,500,000 + blockIndex·100,000`, 4 × 200).

### 3.2 Match count, cluster, bootstrap, duration, output

| item | value |
| --- | --- |
| matches per arm | **800** (4 blocks × 200) — the P2-B §4.6 precedent |
| arms | **R0 + R-BOTH = 2 arms** (no ladder, #51.2) ⇒ **1,600 matches total** |
| duration | the default full match (unchanged; no time knob is touched) |
| instrument sampling | 6 Hz (every 10th tick), `phase === 'playing'`, keepers excluded — **P0 §2 verbatim** |
| cluster unit | the **match seed** (#20), disjoint per block |
| bootstrap | 2,000 resamples, frozen `BOOTSTRAP_SEED = 62003` |
| identity | R0 must reproduce the shipped world bit-identically (the flag-off pin) |
| output | [`data/c6-t2-match-ab.json`](data/c6-t2-match-ab.json), SHA'd, twice byte-identical |
| HEAD | the run states its HEAD (#26.5); expected `57b0bdab…c673` fingerprint throughout (no live substrate change lands between T1R and T2) |

**Why 800 per arm powers every HARD limb — MDE derived ex ante.** The HARD limbs
are the three scramble limbs (§6-T2 (i)); each expects **all-quiet** under a
physics change that repositions no bodies (§6.4), so power means: *if the true
effect sat at the band edge, 800 paired matches would resolve it.* MDEs (80% power,
95% cluster bootstrap; SE scaled from P0's 300-match CIs by √(300/800) = 0.612,
and the paired design shrinks it further — the figures below are the conservative
unpaired scaling):

| HARD limb | instrument | P0 baseline | band edge (fires at) | SE @ 800 (scaled) | **MDE (≈2.8·SE)** | headroom |
| --- | --- | --- | --- | --- | --- | --- |
| **DEGEN-SCRAMBLE** | I4 own-within-5 m | 0.956 | +25% rel = +0.239 (→1.195) | ≈0.0051 | **≈ +1.5% rel** | 17× below edge |
| **DEGEN-PILEUP** | I3 share < 4 m | 9.40% | +50% rel = +4.70 pp (→14.10%) | ≈0.25 pp | **≈ +7% rel** | 7× below edge |
| **DEGEN-RESTDEF** | I5(b) designated slot | 65.82% | −20% rel = −13.16 pp (→52.66%) | ≈0.43 pp | **≈ −1.8% rel** | 11× below edge |

P2-B itself resolved shifts of +84% / −22% / (and offside +18.7%) at exactly this
800-match staging with CIs excluding zero (§6.5.4), so the transferred variances
confirm 800 has ample power for the scramble battery, the §2 band and the standing
canaries. (I3's SE anchor: P0 gives no CI for the <4 m share directly; 0.25 pp is
the conservative binomial-on-clustered estimate that reproduces P2-B's ability to
resolve its +84% move — reported as an estimate, not a measured P0 CI.)

---

## §4 — INSTRUMENTS AND GATES (all frozen ex ante; every threshold derived)

Cluster unit for every CI = **match seed** (#20). Every gate covers the full sign
space (#38.1); none is a max-statistic (#32.1). Predicates are **two-part** (a CI
bound AND a relative threshold) wherever they inherit the P2-B canary form.

### 4.1 (i) WATCHABILITY HARD LIMBS — any one firing STOPS THE QUEUE

All bind on the **R-BOTH** arm, **paired vs R0**, side-split and never summed (P0
§2.1). Firing = the queue stops outright and the fork returns to the commander,
**whatever the payoff/economy instruments say** (contract §8; P2-B reading (h)).

**The scramble battery (§6-T2 (i)) — P2-B §4.4 DEGEN bands, KEPT VERBATIM.**

```text
DEGEN-SCRAMBLE  I4 own-within-5 m rises,  CI lower > 0  AND  relative ≥ +25%
                — P0 baseline 0.956;  乱抢 is the user's #1 hate
DEGEN-PILEUP    I3 share < 4 m rises,     CI lower > 0  AND  relative ≥ +50%
                — P0 baseline 9.40%
DEGEN-RESTDEF   I5(b) designated slot falls, CI upper < 0 AND relative ≥ 20% drop
                — P0 baseline 65.82%
```

**Keep-or-tighten, justified per limb (a physics change vs an eye).** The P2-B
bands were calibrated for an **eye** — a positioning chooser that *directly
rewrites station targets* and therefore has a large, deliberate repositioning
blast radius (it moved I3 +84%, I5(b) −22%). C6 is a **physics** change: it
repositions **no body**; it moves only where the *owned ball* sits within the
carrier's control (I3-glue kept, zero new loose balls, §5-I3/I4/I7 of the
contract). Its only path to these body-shape instruments is **indirect** — the
+11.63% eligibility could convert to more tackles → more turnovers → altered chase
patterns. Two consequences:

1. **The bands are KEPT VERBATIM, never loosened.** The DEGEN thresholds encode
   the *disease itself* (pile-up, abandoned rest defence, scramble), and a disease
   is the same disease whatever causes it; 乱抢 limbs may never be loosened (§6-T2;
   the user's #1 hate). A scramble shift arising from a *physics* change that
   touches no positioning would be, if anything, **more** alarming than the eye's
   — so the same threshold is conservative for C6, not lax.
2. **Tightening is REJECTED as an invented floor.** A tighter DEGEN threshold
   would be a number calibrated to no measured disease — exactly the #19/#24 error
   (inventing/mis-powering a floor). The honest instrument is the *calibrated*
   one plus the ex-ante expectation, stated: **all-quiet with large margin**
   (MDEs 7–17× below each edge, §3.2). If any limb fires despite C6 repositioning
   no body, that is a strong finding, precisely because it was not expected.

**The two reverts' standing canaries (P2-B §4.3) — carried HARD, verbatim.** They
guard deployment diseases C6 can plausibly reach: the honest ball's position
**determines the offside line** (offside is ball-position-keyed) and the ball's
mid-turn location shifts box presence at cross arrival.

```text
C-OFFSIDE  offsides per match (both sides) rises,  CI lower > 0  AND  point ≥ +10%
           — revert 2 blasted +50%; +10% = ⅕ of that blast (P2-B §4.3);
             P2-B fired this at +18.7%
C-BOX      attackers in the opposition box AT CROSS ARRIVAL falls,
           CI upper < 0  AND  relative drop ≥ 15%
           — revert 1 emptied the box; C4 T0 measured 0.98–1.53 bodies at arrival,
             so 15% ≈ ⅕ of a body (P2-B §4.3).  C4 T0's four arrival classes
             (C0/C1/C2/C3) REPORTED alongside so a class-MIX shift shows even if
             the count holds
```

**Restart health (§6-T2 (v)) — HARD, band DERIVED from P2-B's +21% precedent.**
Fluency > interruptions is a standing user value; a restart stall is a
watchability disease (P0 §1.3 pin 3; P2-B measured restart ticks +20.8% on its
failing run).

```text
C-RESTART  restart ticks per match rises,  CI lower > 0  AND  relative ≥ +10%
           Derivation: P2-B's degenerate run raised restarts +20.8%; +10% is HALF
           of that observed degradation — high enough not to fire on noise at 800
           matches, low enough to catch the restart-stall genre before it reaches
           P2-B's level.  Mirrors C-OFFSIDE's "fraction of the observed disease"
           two-part construction.  The restart TAKER is excluded (E-RESTART), so
           C6 has no direct path here — all-quiet is the expectation.
```

### 4.2 (ii) THE §2 EQUILIBRIUM BAND — C1 §4 verbatim, hard abort

Applied **verbatim** as inherited whole (C4-T1-FLIGHT §5.1, "C1 §4 verbatim,
inherited whole"). The R-BOTH arm's five headline per-match rates must each stay
inside the absolute band; a break is a hard abort (reading (C), the C1-B
precedent). R0's rates are reported against the same baselines as the flag-off
sanity cross-check (P2-B §4.2: a large R0-vs-baseline drift is itself reported).

```text
baselines (C1 §4):  goals 2.3944 · crosses 2.4894 · headers 9.1039 ·
                    long balls 6.2042 · cutbacks 3.8151

goals/match        within ±15%     2.0352 .. 2.7536
crosses            within ±25%     1.8671 .. 3.1118
headers won        within ±25%     6.8279 .. 11.3799
long balls         within ±25%     4.6532 .. 7.7553
cutbacks           within ±25%     2.8613 .. 4.7689
```

Per #30.3 the band is a **guard, never a hand re-tune** — a break is honest-revert
(of nothing, since nothing ships), the finding banked, not a licence to re-cut the
law. **Shots and possession spells are NOT in the canonical §2 five**; they are
REPORTED with CIs in the ecology block (§4.5), never folded into the hard band —
inventing a band for them would be the #19 error.

### 4.3 (iii) PRICED CONSEQUENCES — pre-registered bands per #51.1

Each is a band with a derivation. Within band ⇒ priced as designed; a resolved
excursion beyond band ⇒ reading (d), returned to the commander, no re-cut.

**PC-LOOSE — the loose-ball / turnover economy.** T1R banked +363 loose-ball
events at fork level (OFF 85,270 → ON 85,633), both-teams-armed but scoped to
turn-episode windows — **relative +0.4257%** (363 / 85,270).

```text
match-level expectation:  +0.43% relative  (the T1R fork-level relative delta)
BAND (relative):          [ −0.43% , +0.85% ]  =  [ −1× , +2× ] of the fork-level
```

*Derivation.* The extra loose balls are GENERATED by the changed tackle geometry
(+11.63% eligibility) at turn/exposure moments — exactly what the fork windows
captured — so the fork-level RELATIVE shift is the transferable anchor. Two
competing transfer effects bound it: (a) **dilution** — a full match's loose-ball
denominator includes many non-turn turnovers the offset never touches, pushing the
match-level relative **below** +0.43%; (b) **cascade** — a full-match turnover
reshapes a whole possession, which can amplify. The `[−1×, +2×]` bracket is the
standing "fork-vs-live survival" allowance this programme uses for
narrow-scope → broad-scope transfer (the ½×/1.5× axis convention of T1 §GATES,
widened one notch because fork-window → whole-match is a larger extrapolation than
recompute → live, and asymmetric-up because +363 was never resolved as > 0). The
run REPORTS the absolute R0 loose/match and the paired count delta/match so the
relative band is anchored on measured variance. **A resolved shift above +0.85%
relative, or a resolved negative beyond −0.43%, ⇒ reading (d).** Because the fork
delta was tiny and unresolved, a CI that straddles zero **inside** the band is
"priced as designed" (#29.5: a weak instrument disclosed, not gated harder than
its power).

**PC-KICK — the kick-origin displacement's match-level effect.** Kicks originate at
the ball, so the honest offset shifts the kick origin. T1R (same law) measured, on
kicks in-window: **p50 0.40318 m** (T0 bound 0.346, +16.5%), **p90 0.75071 m**
(bound 0.727, +3.3%), max 1.25549 m; per-seam-tick p50 0.30929 / p90 0.66276 m.
The displacement is REPORTED at T2 (cross-check vs T1R; same law ⇒ expected
consistent). Its match-level CONSEQUENCE is read on **completion rates**:

```text
instruments read:  pass-completion rate · shot rate/on-target rate
                   (cross-completion COUNT is already §2-banded via crosses/long balls)
BAND (relative):   each within ±5%  vs R0, paired
```

*Derivation.* The kick is aimed **from wherever the ball actually is** (the solver
re-computes at the true origin), so a shifted origin is **largely self-correcting**
— the residual effect on completion is second-order. The p90 origin shift 0.75 m
against a typical pass vector (~13 m, anchored on P0's median teammate spacing
12.955 m) is ≈ 5.8% of the vector, an **upper bound** on the completion
perturbation (self-correction makes the realised effect far smaller). ±5% relative
is that upper bound; a completion rate resolving **outside** it ⇒ reading (d) — the
live honest ball moved the kick more than the geometry's self-correction absorbed,
which returns to the commander, constants untouched. (Cross/long-ball COUNTS are
backstopped by the §2 band; PC-KICK adds pass-completion and shot rate, which the
§2 five do not carry.)

### 4.4 (iv) DUEL ECONOMY — REPORTED with CIs, NOT gated

The mechanism, reported (contract §6-T2 lists it as an instrument; #51.2 gates only
the scramble battery + §2 band; the loose count is elevated to PC-LOOSE above).
Match-seed cluster CIs, paired vs R0:

```text
tackle attempts per match          · tackle success rate
where turnovers happen             (zone histogram: own third / middle / their third)
turn-episode outcomes              (tackle attempt/success on the carrier during and
                                    within 0.5 s after a ≥90° sweep — the T1 window)
```

These carry no gate (they are the causal story behind the priced/hard instruments);
their sign informs the (E) instruments-disagree reading (§5).

### 4.5 (v) ALSO REPORTED (ecology, CIs, not gating)

The full P0 seven at match level (I1 dwell · I2 target drift · I3 spacing · I4
convergence · I5 both rest-defence readings · I6 duplicate runs · I7 shape delta),
side-split; plus shots/match, possession spells (count + duration distribution),
long-ball share, and the eye-independent watchability items (#15.4: forward-pass
share, give-and-gos, longest chain) — REPORTED, never gated, so the play-feel
picture is complete for the commander and the user's later eyes.

### 4.6 X-family (OFF identity, determinism, single seam) — HARD

| gate | predicate |
| --- | --- |
| **X-FP** | `c6Carry` OFF: league fingerprint identical to the frozen baseline `57b0bdab…c673` |
| **X-OFF-IDENT** | R0 world signatures **byte-identical** to the shipped world across the 800 seeds (the flag-off pin) |
| **X-SEAM** | a test asserts `c6Carry` is read in **exactly one place** (the `applyC6HonestOffset` outfield fork), is null on a fresh `Match`/`League`, and does not gate the de-glue branch or the GK-hold path (inherited from T1R; re-asserted) |
| **X-DET** | two `runExperiment()` invocations produce byte-identical output JSON; the table/output SHAs are emitted and quoted |
| **STRUCTURAL ZERO-LOOSE (#48.3)** | on R-BOTH, every ownership release classes to a named channel (kick, de-glue, ball-won, tackle); **offset-attributable releases exactly 0** over the standing class set incl. E-INJURY. Any unattributable release ⇒ FAIL |

Any X-family / structural gate failing ⇒ FAIL, queue stops at the commander
(reading (F)), whatever the watchability instruments say.

---

## §5 — EXCEPTION CLASSES (mandatory boilerplate, #38.1) & what is ledgered

The standing set, incl. **E-INJURY** (now a named house class, #49):

```text
E-PAUSED     phase ≠ 'playing' (kickoff, halftime, stoppage, restart wait)
E-GKHOLD     gkHoldTimer > 0 or gkDistributing (carry = 0.3, hands)
E-GK         role === 'GK'  (keepers excluded from every body instrument, P0 §2)
E-NOOWNER    ball has no owner (in flight / loose)
E-RESTART    the restart taker (restartKickGid === owner.gid)
E-SENTOFF    owner sent off
E-DEGLUE     the de-glue branch fired (|v|>2.5 AND nearOpp>4.2 m) — ball already free
E-TRANSITION the ownership / same-player re-strike artefact (the F2 class)
E-INJURY     advantage-foul injury to the carrier inside the step: same-gid attrs
             mutation post-read (limb 1, takeKnock) OR same-gid becomeSub reposition
             without ball release (limb 2) — the #49 named class, both limbs code-cited
E-ENDED      the match ended
```

**What is ledgered, and where "unexplained exactly 0" applies — stated explicitly
(the task's requirement).** T2's match-level watchability instruments (I1–I7,
sampled 6 Hz) are **distributions**, not per-tick fidelity recomputes: they have
**sampling-exclusion** classes (E-PAUSED, E-GK/keeper, E-ENDED) REPORTED as counts,
and **no** "unexplained exactly 0" requirement — the offset's per-tick fidelity is
already **certified by T1R** on the identical law and seam and is not re-litigated.
The **one T2 ledger where "unexplained exactly 0" binds** is the **ownership-release
attribution** (STRUCTURAL ZERO-LOOSE, §4.6): every release must class to a named
channel over the full set above (incl. E-INJURY, whose limb-2 sub can free the ball
the following tick → E-NOOWNER); **offset-attributable releases must be exactly 0**.
Any release the ledger cannot attribute ⇒ FAIL. Per-record receipts
`{seed, tick, gid, cause}` are kept for each class hit, capped 1,000/class
(first-N, deterministic — the #49.3 obligation, carried).

---

## §6 — PRE-LAID READINGS — the full sign space (#38.1)

Written before the run; not one may be re-cut after sight (contract §8). Each
carries its disposition. **Nothing ships in any branch (Road B).**

* **(A) ALL-QUIET — the design case.** No watchability HARD limb fires (scramble
  battery, C-OFFSIDE, C-BOX, C-RESTART all quiet), the §2 band holds on all five
  dimensions, both priced consequences (PC-LOOSE, PC-KICK) land inside their bands,
  the X-family/structural gates pass, and the duel economy is coherent. Disposition:
  **return to the commander.** What it licenses: **nothing ships**; the T2 verdict
  **feeds #29.3's C5 re-census decision** back to the commander (contract §6-T3 —
  the held-tick exchange rate on the enriched substrate, H1 re-powered per #29.1).
  T2 **cannot** authorize that re-census, nor any live-arming — it only licenses the
  commander to *consider* them (§7 NON-CLAIMS).

* **(B) A WATCHABILITY HARD LIMB FIRES.** Any of DEGEN-SCRAMBLE / DEGEN-PILEUP /
  DEGEN-RESTDEF / C-OFFSIDE / C-BOX / C-RESTART fires (its two-part predicate met).
  Disposition: **STOP OUTRIGHT, return to the commander**, whatever the payoff and
  economy say (P2-B reading (h); 乱抢 is #1 hate). No re-cut of the law, the bands or
  the readings. A limb firing from a physics change that repositions no body is a
  strong, unexpected finding (§4.1), banked as such.

* **(C) §2 BAND BREAKS.** Any of the five headline rates leaves its band on R-BOTH.
  The C1-B precedent: **honest revert of nothing** (nothing shipped), the finding
  **banked** — the honest carry, deployed both sides, buys more of that dimension
  (e.g. more long balls / fewer goals) than the watchability band permits.
  Disposition: **return to the commander** with the broken dimension quantified; no
  re-cut (#30.3: the band is a guard, never a re-tune).

* **(D) A PRICED-CONSEQUENCE BAND IS EXCEEDED.** PC-LOOSE resolves above +0.85% /
  below −0.43% relative, OR a PC-KICK completion rate resolves outside ±5% relative.
  Disposition: **reading, return to the commander, no re-cut** (the C6-T1 reading
  (F) precedent for the kick) — the live whole-match world moved the loose economy /
  the kick more than the geometry's transfer/self-correction predicted; the
  constants do not move.

* **(E) INSTRUMENTS DISAGREE IN SIGN.** The watchability, priced and duel-economy
  instruments point opposite ways with CIs excluding zero (e.g. pile-up rises while
  scramble falls; or the duel economy says "more turnovers" while loose count says
  "fewer") — no coherent deployment story. Disposition: **returned UNRESOLVED to the
  commander** (the P2-B ladder-disagreement precedent, reading (g)); no shipping
  claim, no re-cut.

* **(F) AN X-FAMILY / STRUCTURAL GATE FAILS.** X-FP / X-OFF-IDENT / X-SEAM / X-DET
  fails, OR an offset-attributable release ≠ 0. Disposition: **FAIL, the queue stops
  at the commander** (contract §8; P2-B reading (h)/(a)), whatever the watchability
  instruments say — a fork that cannot reproduce its own flag-off world, or a seam
  that frees a ball, is not a valid deployment measurement.

---

## §7 — NON-CLAIMS

* **T2 ships NOTHING (Road B).** `c6Carry` is null/off in every production path
  through the whole stage; the fingerprint is unchanged (`57b0bdab…c673`); there is
  no default-ON. T2 ends with a verdict, never a live default (contract §8).
* **A clean (all-quiet) T2 authorizes NEITHER of the two things it unlocks.** It
  **licenses the commander to CONSIDER** (a) the **#29.3 C5 re-census** (contract
  §6-T3), and (b) — separately, later, and **with the user** — any **live-arming**
  conversation. **T2 cannot authorize either**; both are the commander's (and, for
  live arming, the user's) decision, taken after T2 returns.
* **T2 prices GEOMETRY's DEPLOYMENT CONSEQUENCES, not value** (contract §9 estimand
  boundary): nothing here claims carrying pays or costs — only whether the honest
  ball, armed both sides across whole matches, keeps the game watchable football.
* **No de-glue claim** (the pressured-carry regime keeps its glue; v2's seat with
  its own scramble ceiling, contract §9). **No touch cost ever** (#12's boundary).
  **No shielding CHOICE** (choices belong to the decision layers under their own
  contracts). **No new gene, no new attribute** (I8) — the law reads only the body's
  own kinematics and dribbling.
* **Untouched:** the de-glue branch and its two learned corrections (I6), the keeper
  path and its 0.3 carry (I5), `TURN_RATE`/heading semantics (I5), and C7's wind-up
  seat (contract §9). T2 arms the existing flag; it changes no `src/**` to run.
