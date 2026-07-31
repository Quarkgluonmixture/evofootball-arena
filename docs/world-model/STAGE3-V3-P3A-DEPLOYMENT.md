# Stage III V3-P3a — The Deployment Ladder + the Full HARD Battery

Status: **PRE-REGISTERED 2026-07-31, FROZEN BEFORE IMPLEMENTATION** (authority
**#86.2(a)**, user-ratified "来吧,a"). Nothing is built; nothing has been run; no
`src/**` will change to run this (the role-eye deployment seam already ships behind
`Match.stationEye` with `scope ∈ {body, team, both}` + the `v3` role table, from the
certified V3-P2 build — `git diff --stat -- src` empty, production fingerprint
`57b0bdab…c673` unchanged with every flag OFF). This document freezes the arms, the
instruments, every gate and its derived band, the shape adjudicators, the staging and
the full sign-space readings **before a single P3a datum exists**. **This freeze
RETURNS TO THE COMMANDER for review; the run needs its own authorization** (the
standing pattern: freeze → review → build → run; #86.2 sequence). **P3a is the CHEAP
GATE: any HARD limb firing STOPS THE STAGE — P3b (the R3-saturation re-census) does
NOT run.**

Authority chain: **#86** (V3-P3 user-ratified; the two-sub-stage structure; P3a =
the deployment ladder + the FULL HARD battery at ~C6/C7-T2 scale, ANY limb firing
stops the stage before the expensive half) · **#85** (V3-P2 reading (c) frozen; #85.3
the METRIC CONFOUND — the certified table PAYS the DF near-ball build-up work, so
fork-grain spacing cannot distinguish 扎堆 from 到岗; **the honest adjudicator is the
MATCH-LEVEL battery with every body playing his role**) · **#82.2** (the certified
role geometry — the 16 BH-resolved cells: DF argMax in build-up positioning, argMin
on deep runs in `ownThird`, MF beats DF on the crowded-midfield defensive approach)
· **#84.2** (the WG silence banked ex ante as division of labour expressed — any
pooled-mediator null DECOMPOSED BY ROLE before a verdict; a DF/MF/ST-driven signature
with a quiet WG is the EXPECTED shape) · **#68.2** (the battery re-baselines on the
ENRICHED world's own paired R0 — never the banked v1 P0 numbers) · the design contract
[`STAGE3-V3-ROLE-EYE.md`](STAGE3-V3-ROLE-EYE.md) §4 (V3-P3 = deployment + the battery
+ the R3 iteration), **I4** (the R3 stability iteration is a GATE, run once — deferred
to P3b), **I5** (the deployment battery verbatim and HARD, the C6/C7-T2 form) · the
HOUSE DEPLOYMENT BATTERY carried verbatim from
[`C7-T2-MATCH-AB.md`](C7-T2-MATCH-AB.md) §§2–6 and
[`C6-T2-MATCH-AB.md`](C6-T2-MATCH-AB.md) §§2–6 (arms form, watchability limbs with the
P2-B bands, offside/box/restart canaries with two-part predicates, the C1 §4
equilibrium band absolute form, R0 flag-off identity, X-DET, ledger scoping) · the v1
P2-B ADOPTION LADDER from [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) §4.1
(R0 / R1 one-body / R2 one-team / R3 both — a BRAIN change takes the ladder, unlike
symmetric physics) and §4.4 DEGEN limbs · #20 (CI-inside-band, cluster = match seed) ·
#24 (floors re-powered AND attainable) · #26.5 (the consumer world = the census world;
state HEAD + flags) · #30.3 (the band is a guard, never a hand re-tune) · #19 (no
invented / mis-powered floors) · #32.1 (no coupon-collector max-statistic) · #38.1
(standing exception classes + full sign space) · #44.5 (a disclosure touching a gate's
POPULATION triggers read-only sizing + commander sign-off) · #46.2 (seed
disjointness) · #48.4 (windows pinned) · #49.3 (receipts) · #49.5 (the resident
supervises the long runs — P3b, not this cheap gate) · Road B (nothing ships).

Data this freeze is derived from (committed, SHA'd): the V3-P1 role-conditioned table
[`data/stage3-v3-p1-role-census-table.json`](data/stage3-v3-p1-role-census-table.json)
(canonical `tableSha` **`171a6dad…6559f`**, file SHA-256 **`ba0bd8ee…0735`**) and the
V3-P2 per-`(context × role)` control levels
[`data/stage3-v3-p2-control-recovery.json`](data/stage3-v3-p2-control-recovery.json);
the P0 instrument definitions in
[`STAGE3-P0-CONSUMER-MAP.md`](STAGE3-P0-CONSUMER-MAP.md) §2.2 / §3; the C6/C7-T2 house
battery (§4 of each, carried verbatim); the P2-B adoption ladder and DEGEN bands
(§4.1/§4.4); the incumbent role signature (V3-P0 (iii) / #79.1: mean pairwise role TV
**0.407**, DF r14a180 · MF r14a0 flattest · WG outside-lattice width · ST ahead).

Code truth (HEAD `d10ae24` at freeze): the role-eye deployment seam ships behind
`Match.stationEye` (the `scope`/`v3` reads in `src/ai/actionExecutor.ts` ≈L668–892) —
null in every production path; the enriched substrate flags (`edsPerceived*`,
`c5Hold`, `c6Carry`, `c7Windup`) default OFF (`EDS_BUNDLE` unarmed); production
fingerprint `57b0bdab…c673`. **P3a arms the EXISTING seam across the ladder on the
enriched substrate — it changes no `src/**` to run.** The build (a probe modelled on
[`../../scripts/probes/c7-t2-match-ab.ts`](../../scripts/probes/c7-t2-match-ab.ts) for
the T2 battery, [`../../scripts/probes/stage3-p2b-adoption.ts`](../../scripts/probes/stage3-p2b-adoption.ts)
for the ladder arming, and
[`../../scripts/probes/stage3-v3-p2-consumer.ts`](../../scripts/probes/stage3-v3-p2-consumer.ts)
for the v3 `{roleTable, control}` injection) is a FUTURE authorized step.

---

## §1 — WHAT P3a IS, AND THE ONE QUESTION IT ANSWERS

V3-P2 certified, at FORK grain, that the role columns argmax APART (100% predicted
divergence; DEV 42.15% delivered; PC resolving; the first positive ATE in three
generations, +0.0108). Reading (c) fired — fork-grain FORK-SPACING did not open
(pooled −0.313; resolved-cell stratum −4.26). **#85.3 named why that stratum cannot
be trusted as a shape verdict:** the certified table pays the DF near-ball build-up
work, so a lone forced DF doing his certified job lands NEARER his teammates *by the
job's own definition* — the resolved-cell spacing stratum penalizes PAID PROXIMITY
(到岗) as if it were pile-up (扎堆). **Fork grain cannot distinguish the two.**

P3a asks the one question the fork windows structurally cannot: **when the role eye is
deployed across WHOLE matches with EVERY body playing his own role simultaneously,
does the SHAPE the user watches disperse (到岗, division of labour) or clump (扎堆,
pile-up) — and does it stay football?** The whole-match instruments see the aggregate
team shape (not one forced body among ten incumbents), so a lone-DF proximity artefact
cannot masquerade as team pile-up: if the eye truly clumps the team, the pile-up TAIL
(I3 < 4 m share) rises and DEGEN-PILEUP fires; if it disperses (bodies of different
roles pulling to different cells), the tail is flat and the median/p10 open. **The
confound is resolved by an instrument that sees the whole team, and the 乱抢 canaries
are HARD** (#85.3).

**⭐ A ROLE EYE IS NOT C6/C7 — it REPOSITIONS BODIES.** C6 (physics) and C7 (time)
repositioned no body during their windows, so the C6/C7-T2 ex-ante expectation was
"all-quiet with large margin." **The role eye is an EYE** — it directly rewrites
off-ball station targets, exactly the class the v1 P2-B bands were calibrated for (the
v1 eye moved I3 +84%, I5(b) −22%). So here the shape WILL move; that is the point. The
HARD limbs guard the UGLY direction (pile-up / scramble / rest-defence abandonment);
the shape adjudicators (§4.3) report the DIRECTION so the #85.3 dispersal-vs-clump
question is answered. This is why P3a needs BOTH the HARD battery AND the reported
shape instruments — the battery keeps it football, the adjudicators say whether it is
GOOD football.

**What P3a does NOT re-litigate.** The role eye's per-decision fidelity (role read as
own-state, percept-honest context, in-power own-role cell, argmax vs recovered
control, the two harness repairs) is **certified by V3-P2** (X6 unexplained 0 across
9.15 M ticks; DEV/PC passed) on the identical seam and table; P3a's watchability
instruments are 6 Hz whole-match distributions, not per-decision fidelity recomputes
(the C6/C7-T2 ledger-scoping precedent, #52.1). The one P3a ledger where "unexplained
exactly 0" binds is the ownership/re-position attribution (§4.5, the structural gate).

---

## §2 — ARMS: THE DEPLOYMENT LADDER (P2-B §4.1 form; a BRAIN change takes the ladder)

Unlike C6/C7 (symmetric physics/time → no ladder), a role eye is a **unilateral
chooser deployed universally**, so the adoption gap is an identification question the
ladder answers (P2-B §4.1). Four arms, all **NEUTRAL** weights (`w_s = w_c = 0.5`),
the **same 800 seeds paired** across every arm:

```text
R0  CONTROL     nobody runs the eye — the paired ENRICHED baseline
                (stationEye null; the role-eye-off pin; #68.2 re-baseline anchor)
R1  ONE BODY    one outfielder, gid = 1 + (matchSeed mod 5), on side 0 only
                (scope { kind: 'body', gid }; the P2-B §4.1 selection rule VERBATIM)
R2  ONE TEAM    all outfielders of side 0        (scope { kind: 'team', side: 0 })
R3  BOTH TEAMS  every outfielder on both sides   (scope { kind: 'both' })  ← DEPLOYMENT
```

**R3 is the arm every canary, band and shape adjudicator binds on**, because it is the
world P3b would audit. R1/R2 are the **saturation gradient**: a sign disagreement
between rungs is its own reading and returns to the commander unresolved (§6(E), the
P2-B §6(g) precedent). No GENE / ORACLE / INVERTED arm runs at P3a (all NEUTRAL, per
#86.2(a); the GENE attribution partner and the R3 stability iteration are P3b's, I4).

**How the eye arms per body at match scale** (the existing seam,
`actionExecutor.ts` ≈L668–892; the V3-P2 injection pattern): the probe sets
`match.stationEye = { arm: 'neutral', scope, v3: { roleTable, control }, trace }` with
the committed table + recovered controls INJECTED (never bundled in `src/**`). At each
station-family body matching the scope, on its own decision cadence (first eligible
tick, then once per window):

* it PULLS its own percept `match.perceivedSnapshot(p)` and forms the perceived
  context (face × threat × density) — **percept-honest, no truth by the back door**;
* it reads **HIS OWN role's column** (`p.role`, immutable own-state — free, no percept
  issue) and argmaxes `V(x) = 0.5·value(context, role, x)` against
  `control(context, role)` in the IN-POWER cells only (`priceApproachesV3`);
* **deviate iff advantage > 0**; every tie / no-cell / abstention (no snapshot / no
  ball / no owner) **commits the window to the INCUMBENT** — the incumbent runs, and
  that is the eye choosing him (E-TIE / E-NOCELL / E-ABSTAIN-*);
* **NO going-bit** (out of v3's table, #77.2(ii)); **NO brake** (the v2.1 abort stays
  DORMANT, `abortEnabled` false); **NO gene, no new attribute, no new percept
  channel**; the eye writes **only the off-ball movement target** — never ball state,
  never a ball-directed action (a body that becomes carrier / whose action leaves the
  station family reverts to the incumbent, E-NONSTATION), keepers excluded (`role !==
  'GK'`).

Every delta below is **paired per-seed** (rung minus R0 on the identical seed) with a
**match-seed cluster bootstrap** CI (#20): a shift is *resolved* only when its CI
excludes its reference; a null is reported as such, never re-cut (#38.1 / contract §6).
`stationEye` is null in every production path throughout (Road B).

---

## §3 — SEED BLOCK & STAGING (frozen)

### 3.1 Seed block — fresh, disjoint above every consumed range (#46.2)

```text
seeds = 9,300,000 + blockIndex·100,000 + k,   blockIndex ∈ 0..3,  k ∈ 0..199
      = 4 disjoint blocks × 200 = 800 matches per arm,  the same 800 seeds in all arms
range = 9,300,000 .. 9,600,199
```

The block walk (consumed / reserved, cleared): … V2-P2 8.90M/8.91M · V2-P2R
9.00M/9.01M · V3-P0 smoke 9.10M / census 9.11M · V3-P1 REUSES 9.11M · **V3-P2 smoke
9.20M / payoff 9.21M**. **9,300,000 lies above every consumed range, including all of
V3-P2 (9.20M/9.21M).** The 4-block × 200 structure mirrors C6-T2 §3.1 / C7-T2 §3.1 /
P2-B §4.6.

### 3.2 Match count, cluster, bootstrap, duration, output

| item | value |
| --- | --- |
| matches per arm | **800** (4 blocks × 200) — the C6/C7-T2 precedent (justified below) |
| arms | **R0 + R1 + R2 + R3 = 4 arms (all NEUTRAL)** ⇒ **3,200 matches total** |
| duration | the default full match (unchanged; no time knob is touched) |
| instrument sampling | 6 Hz (every 10th tick), `phase === 'playing'`, keepers excluded — **P0 §2 verbatim** |
| cluster unit | the **match seed** (#20), disjoint per block |
| bootstrap | 2,000 resamples, frozen `BOOTSTRAP_SEED = 93003` (disjoint from V3-P2's 92110 / V3-P1's 91110 / V3-P0's 91100 / C7-T2's 79002 / C6-T2's 62003 / P2-B's 50041) |
| identity | R0 reproduces the ENRICHED baseline bit-identically (the role-eye-off pin, §4.4) |
| world / flags | the **ENRICHED** world (#67.3): `edsPerceivedDefence + edsPerceivedChoice + edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup` ON; `c5TouchFork` off — **the same world the table was censused on** (#26.5); the run states its HEAD (#26.5) |
| output | [`data/stage3-v3-p3a-deployment.json`](data/stage3-v3-p3a-deployment.json), SHA'd, twice byte-identical (X-DET) |

**Why 800/arm powers every HARD limb — MDEs transferred, not re-derived.** P3a runs
the C6/C7-T2 battery on the **identical instruments and the identical 800-match
staging**, and BOTH C6-T2 and C7-T2 ran that battery to all-quiet with every scramble
CI straddling zero at 800 matches; P2-B itself RESOLVED shifts of +84% / −22% / +18.7%
at exactly this staging with CIs excluding zero. The transferred variances confirm 800
has ample power for the scramble battery, the canaries and the §2 band. MDEs (the
C6/C7-T2 figures verbatim, SE scaled from P0's 300-match CIs by √(300/800) = 0.612,
conservative unpaired):

| HARD limb | instrument | v1 P0 ref (NOT the baseline — see #68.2) | band edge (fires at) | SE @ 800 | **MDE (≈2.8·SE)** | headroom |
| --- | --- | --- | --- | --- | --- | --- |
| **DEGEN-SCRAMBLE** | I4 own-within-5 m | 0.956 | +25% rel | ≈0.0051 | **≈ +1.5% rel** | 17× below edge |
| **DEGEN-PILEUP** | I3 share < 4 m | 9.40% | +50% rel | ≈0.25 pp | **≈ +7% rel** | 7× below edge |
| **DEGEN-RESTDEF** | I5(b) designated slot | 65.82% | −20% rel | ≈0.43 pp | **≈ −1.8% rel** | 11× below edge |

**⭐ Unlike C6/C7-T2, the ex-ante expectation is NOT "all-quiet with large margin."**
A role eye repositions bodies; the shape MAY move materially in EITHER direction. The
MDEs say only that if the true effect sat at a DEGEN band edge, 800 paired matches
would resolve it — the power to CATCH a firing is present; whether it fires is the
open question P3a exists to answer. (I3's SE anchor: P0 gives no direct CI for the
<4 m share; 0.25 pp is the conservative binomial-on-clustered estimate that reproduces
P2-B's ability to resolve its +84% move — an estimate, not a measured P0 CI, disclosed
per #44.5.)

### 3.3 Sizing smoke — SKIPPED, argued (the V3-P1 precedent)

**No sizing smoke runs.** The V3-P1 precedent: a smoke runs only where a *gated
quantity's population* is missing. Here every HARD gate reuses a C6/C7-T2 instrument
whose 800-match variance is MEASURED (C6-T2, C7-T2, P2-B all ran the identical battery
at this staging), so no gated MDE is unknown ex ante (§3.2). The one NEW quantity —
the role eye's match-level deviation RATE and its per-role split — is **REPORTED, not
gated** (§4.3); a reported quantity carries no floor to pre-size (#19: sizing a floor
for a reported instrument would invent one). Should the build discover any HARD gate
whose population is genuinely unmeasured, a disjoint read-only smoke on `9,290,000 +
k` (below the run block, above 9.21M) + commander sign-off (#44.5) precedes the run;
otherwise the run proceeds directly. This decision is FROZEN here (skip), not deferred
to sight.

---

## §4 — INSTRUMENTS AND GATES (all frozen ex ante; every threshold derived)

Cluster unit for every CI = **match seed** (#20). Every gate covers the full sign
space (#38.1); none is a max-statistic (#32.1). Predicates are **two-part** (a CI
bound AND a relative threshold) wherever they inherit the P2-B / C6-T2 canary form.
Every HARD limb binds on **R3 paired vs R0**, side-split and never summed (P0 §2.1);
R1/R2 are reported as the saturation gradient.

### 4.1 (i) WATCHABILITY HARD LIMBS — any one firing STOPS THE STAGE — P2-B §4.4 / C6-T2 §4.1 VERBATIM

Firing = **P3a stops outright, P3b does not run, the fork returns to the commander**,
whatever the shape adjudicators or the §2 band say (P2-B reading (h); 乱抢 is #1 hate).

**The scramble battery — P2-B §4.4 DEGEN bands, KEPT VERBATIM, relative to the ENRICHED R0 (#68.2).**

```text
DEGEN-SCRAMBLE  I4 own-within-5 m rises,  CI lower > 0  AND  relative ≥ +25%
DEGEN-PILEUP    I3 share < 4 m rises,     CI lower > 0  AND  relative ≥ +50%
DEGEN-RESTDEF   I5(b) designated slot falls, CI upper < 0 AND relative ≥ 20% drop
```

**Why VERBATIM, and why the enriched-R0 re-baseline.** The DEGEN thresholds encode the
*disease* (pile-up, abandoned rest defence, scramble), not the mechanism; 乱抢 limbs
may NEVER be loosened, and tightening is REJECTED as an invented floor (#19/#24). These
bands were CALIBRATED for exactly an EYE (the v1 P2-B eye that moved I3 +84% / I5(b)
−22%), so they transfer to the role eye without adjustment. The relative threshold
binds **paired vs the ENRICHED-world R0 measured in THIS run** (#68.2: re-baseline on
the enriched world's own paired R0, never the banked v1 numbers 9.40% / 65.82% / 0.956
— those ran on the pre-enriched v1 block and are cited only as historical reference
and reported as R0-drift, §4.4). **DEGEN-PILEUP (I3 <4 m tail) is the direct HARD tooth
on #85.3's 扎堆; DEGEN-RESTDEF is the HARD tooth on rest-defence abandonment** — the
two shape questions the confound raises are already HARD-gated here.

**The two reverts' standing canaries (P2-B §4.3) — carried HARD, verbatim, two-part.**

```text
C-OFFSIDE  offsides per match (both sides) rises,  CI lower > 0  AND  point ≥ +10%
           — revert 2 blasted +50%; +10% = ⅕ of that; P2-B fired this at +18.7%
C-BOX      attackers in the opposition box AT CROSS ARRIVAL falls,
           CI upper < 0  AND  relative drop ≥ 15%
           — revert 1 emptied the box; C4 T0 measured 0.98–1.53 bodies at arrival.
             C4 T0's four arrival classes (C0/C1/C2/C3) REPORTED alongside so a
             class-MIX shift shows even if the count holds
```

The role eye repositions off-ball bodies, so BOTH canaries have a DIRECT path (the eye
can pull a body off the offside line or out of the box) — unlike C6/C7 where the path
was thin. This is the eye class the canaries were built for; they bind HARD.

**Restart health (§6-T2 (v)) — HARD, C6-T2 band verbatim.**

```text
C-RESTART  restart ticks per match rises,  CI lower > 0  AND  relative ≥ +10%
           Derivation: P2-B's degenerate run raised restarts +20.8%; +10% is HALF of
           that. The restart TAKER is E-RESTART-excluded; the indirect path is more
           near-box contests from repositioning. All-quiet is the expectation.
```

### 4.2 (ii) THE §2 EQUILIBRIUM BAND — C1 §4 ABSOLUTE, verbatim, hard abort

Applied **verbatim as inherited whole** (C1 §4; C4-T1-FLIGHT §5.1). R3's five headline
per-match rates must each stay inside the ABSOLUTE band; a break on any is a hard abort
(reading (C), the C1-B precedent). R0's rates are reported against the same baselines
as the flag-off sanity cross-check (§4.4).

```text
baselines (C1 §4):  goals 2.3944 · crosses 2.4894 · headers 9.1039 ·
                    long balls 6.2042 · cutbacks 3.8151

goals/match        within ±15%     2.0352 .. 2.7536
crosses            within ±25%     1.8671 .. 3.1118
headers won        within ±25%     6.8279 .. 11.3799
long balls         within ±25%     4.6532 .. 7.7553
cutbacks           within ±25%     2.8613 .. 4.7689
```

Per #30.3 the band is a **guard, never a hand re-tune** — a break is honest-revert (of
nothing, Road B), the finding banked. Shots and possession spells are NOT in the
canonical §2 five; REPORTED with CIs (§4.4), never folded into the band (#19).
**Enriched-R0-drift caveat, pre-laid:** the C1 baselines are the v1-world values; the
enriched world plays faster (banked), so R0's absolute rates MAY sit near or outside a
C1 band edge independent of the eye. If R0 itself resolves outside a C1 band that is an
ENRICHED-SUBSTRATE drift finding (reported to the commander, NOT attributed to the
eye); the eye's own effect is the paired R3−R0 delta, also reported. The §2 hard-abort
reads the R3 absolute point (C6/C7-T2 §4.2 form); a substrate-drift R0 is disclosed,
never re-cut.

### 4.3 (iii) THE SHAPE ADJUDICATORS — the #85.3 confound resolver — REPORTED with CIs and pre-named directions

**These are REPORTED, NOT additional HARD limbs.** The two shape questions #85.3 raises
— does the eye clump (扎堆) or disperse (到岗) — are ALREADY HARD-gated by DEGEN-PILEUP
(the I3 <4 m tail) and DEGEN-RESTDEF (the I5(b) slot); adding a NEW hard floor on the
distributional detail would be an invented floor calibrated to no measured disease
(#19). So the battery (§4.1/§4.2) keeps the game football (HARD), and the adjudicators
below answer the DIRECTION question — reported with match-seed cluster CIs and
pre-named directions, R3 paired vs R0, side-split, DECOMPOSED BY ROLE (#84.2: any
pooled null decomposed by role before a verdict). **Which are HARD vs reported, stated
explicitly:**

| adjudicator | instrument | HARD or reported | pre-named DISPERSAL (到岗) direction |
| --- | --- | --- | --- |
| I3 spacing DISTRIBUTION | p10 · median | **reported** | p10 ↑ / median ↑ (bodies spread) |
| I3 pile-up TAIL | share < 4 m | **HARD** (= DEGEN-PILEUP) | flat or ↓ (no clump) |
| I5 rest defence | (a) both-back share AND (b) designated slot | (a) **reported**, (b) **HARD** (= DEGEN-RESTDEF) | (a) stable · (b) stable / not ≥20% drop |
| I6 duplicate runs | share of moments with ≥2 bodies to one region | **reported** | ↓ (fewer duplicated destinations) |
| I7 attack/defence shape delta | spread-X / spread-Y by phase | **reported** | wider / role-differentiated, not collapsed |
| per-role deviation rate (match) | DEV per role at match scale | **reported** | present per role; WG quiet EXPECTED (#84.2) |
| role-mix TV distances | pairwise role TV of match-level destination mix vs incumbent | **reported** | ≥ incumbent's 0.407 (V3-P0 (iii) / #79.1) = roles more distinct |

The RIGHT-way prediction, explicit: because the four columns argmax APART (#82.2),
co-located bodies of different roles pull to different cells ⇒ **the pile-up tail stays
flat while the median/p10 OPEN, duplicate runs FALL, per-role destination mixes grow
MORE distinct than the incumbent's 0.407, and rest defence holds** — dispersal (到岗),
not clumping. The V2-P2/V3-P2 fork-grain null (a single map, or paid proximity, closing
spacing) is the exact confound this match-level instrument set is built to see past:
at deployment the DF's paid proximity is one body among a whole team playing its roles,
so a genuine dispersal shows in the team distribution even while the DF does his
build-up job. The WG is EXPECTED quiet (#84.2: the world already pays his width; the
eye has little to sell him) — a DF/MF/ST-driven signature with a quiet WG is the
predicted shape, not a defect.

### 4.4 (iv) X-FAMILY & IDENTITY (two pins) + THE STRUCTURAL LEDGER — HARD — C6/C7-T2 §4.7 form

| gate | predicate |
| --- | --- |
| **X-FP-PROD** | production fingerprint identical to `57b0bdab…c673` with every flag OFF — nothing ships, `src/**` byte-identical (Road B) |
| **X-OFF-IDENT** (the role-eye-off pin) | R0 (enriched substrate, `stationEye` null) byte-identical to the same enriched world run with no `stationEye` field across all 800 seeds (0 mismatches) — the deployment-measurement validity pin |
| **X-SEAM** | a test asserts `stationEye` gates the eye in exactly its `actionExecutor` read point, is null on a fresh `Match`/`League`, honours `scope` (body/team/both), and never overrides a ball-directed action (E-NONSTATION) |
| **X-DET** | two `runExperiment()` invocations produce byte-identical output JSON; the table/control/output SHAs are emitted and quoted; the injected `tableSha 171a6dad…` + control SHA re-verified unchanged |
| **STRUCTURAL EYE-NEVER-TOUCHES-BALL (#48.3)** | on R3, the eye writes ONLY off-ball movement targets; **every ownership release classes to a named EXISTING channel** (kick, de-glue, ball-won, tackle, stun-drop, phase-leave, sent-off, ball-won-by-opp) and **eye-attributable releases = exactly 0** over the standing class set incl. E-INJURY. Any unattributable release ⇒ FAIL |

**⭐ Two identity pins, and why both.** R0 here is the ENRICHED baseline (the census
world, #26.5), NOT the shipped flags-off production world — the eye must be consumed on
the world it was censused on or it reads a stale table. So X-OFF-IDENT pins R0 to the
ENRICHED baseline (the role-eye-off pin: the eye, when null, changes nothing), while
X-FP-PROD separately pins the PRODUCTION fingerprint (`57b0bdab`, all flags off) to
guarantee Road B — nothing ships. (See "for the commander's eye" — the #86.2(a)
phrasing "R0 bit-identical to shipped" is honoured as the role-eye-off pin on the
enriched substrate; R0 is NOT the shipped production world, and cannot be, given the
enriched census world.) Any X-family / structural gate failing ⇒ FAIL, the stage stops
at the commander (reading (F)).

### 4.5 (v) ALSO REPORTED (ecology, CIs, not gating)

The full P0 seven at match level side-split (beyond the gated/adjudicated cuts above);
the eye's decision rate per body per minute and per rung; the deviation mix by
angle/radius and 180°-ring share at each rung; the R1/R2/R3 saturation gradient on the
signed match-level differential (eye side's shots-for − shots-against, paired vs R0);
shots/match, possession spells (count + duration), long-ball share, and the
eye-independent watchability items (#15.4: forward-pass share, give-and-gos, longest
chain) — REPORTED, never gated, so the play-feel picture is complete for the commander
and the user's later eyes.

---

## §5 — EXCEPTION CLASSES (mandatory boilerplate, #38.1) & what is ledgered

The standing set, incl. **E-INJURY** (a named house class, #49), plus the eye's
decision classes:

```text
FIDELITY / SAMPLING (6 Hz distributions — sampling-exclusion counts REPORTED, no
"unexplained 0" requirement; per-decision fidelity is V3-P2-certified):
E-PAUSED     phase ≠ 'playing'         E-GK        role === 'GK' (keepers excluded)
E-NOOWNER    ball loose / in flight    E-RESTART   the restart taker
E-SENTOFF    owner sent off            E-ENDED     match ended (EXCLUDED, count REPORTED)
E-INJURY     advantage-foul injury inside the window (the #49 named class, both limbs)

DECISION CLASSES (per decision instant, mutually exclusive, sum = decision count):
D-DEVIATE          an override was issued
E-ABSTAIN-UNSEEN   the percept carried no ball / owner (§2)   E-NOCELL  no in-power cell
E-TIE              best advantage ≤ 0 — the eye chose the incumbent
E-NONSTATION       the body's action left the station family mid-window
```

**Where "unexplained exactly 0" binds (the #52.1 scoping precedent).** P3a's
watchability instruments (6 Hz) are DISTRIBUTIONS with sampling-exclusion classes
(REPORTED as counts, no unexplained-0). The **one P3a ledger where "unexplained
exactly 0" binds** is the STRUCTURAL EYE-NEVER-TOUCHES-BALL attribution (§4.4): every
ownership release must class to a named existing channel over the full set above;
eye-attributable releases must be exactly 0 (the eye writes movement targets only).
Any release the ledger cannot attribute ⇒ FAIL. Per-record receipts `{seed, tick, gid,
cause}` are kept per class hit, capped 1,000/class (first-N, deterministic — #49.3).

---

## §6 — PRE-LAID READINGS — the full sign space (#38.1)

Written before the run; not one may be re-cut after sight (contract §6). Each carries
its disposition. **Nothing ships in any branch (Road B).**

* **(A) ALL-QUIET, SHAPE DISPERSES-OR-NEUTRAL — the design case; LICENSES P3b.** No
  watchability HARD limb fires (DEGEN battery, C-OFFSIDE, C-BOX, C-RESTART all quiet),
  the §2 band holds on all five dimensions, the X-family/structural gates pass, AND the
  shape adjudicators (§4.3) move toward DISPERSAL or are neutral (the pile-up tail flat
  or falling, median/p10 stable-or-opening, duplicate runs flat-or-down, per-role mixes
  ≥ the incumbent's 0.407 distinctness or unchanged, rest defence held) — the ladder
  agreeing in sign (R1→R2→R3). Disposition: **return to the commander; this is the ONE
  reading that LICENSES P3b** (the R3-saturation re-census + the I4 stability
  comparison). #85.3 answered: at match level with every body playing his role, the
  eye keeps the game football and moves the shape toward division of labour, not
  pile-up. **P3a licenses P3b ONLY; it ships nothing and authorizes no re-census by
  itself.**

* **(B) A WATCHABILITY HARD LIMB FIRES — the stage STOPS.** Any of DEGEN-SCRAMBLE /
  DEGEN-PILEUP / DEGEN-RESTDEF / C-OFFSIDE / C-BOX / C-RESTART fires (its two-part
  predicate met on R3). Disposition: **STOP OUTRIGHT, P3b does NOT run, return to the
  commander** — the deployment answer is NO (P2-B reading (h); 乱抢 is #1 hate). No
  re-cut. DEGEN-PILEUP firing is the direct #85.3 verdict that the eye CLUMPS at scale
  (扎堆 confirmed as real, not a fork artefact); banked as such.

* **(C) §2 BAND BREAKS.** Any of the five headline rates leaves its C1 §4 band on R3.
  Disposition: **return to the commander with the broken dimension quantified**, no
  re-cut (#30.3). Honest revert of nothing (Road B). If R0 (enriched baseline) is the
  one outside the band, that is a substrate-drift finding, not an eye verdict (§4.2),
  reported distinctly. P3b does not run on a §2 break.

* **(D) ALL-QUIET BUT THE SHAPE TIGHTENS WITHIN BANDS — a reading, returns to the
  commander.** No HARD limb fires and the §2 band holds, BUT the shape adjudicators
  resolve toward CLUMPING without crossing a DEGEN edge (the pile-up tail rises
  resolved but < +50%, and/or median/p10 CLOSE, and/or duplicate runs RISE, and/or
  per-role mixes grow LESS distinct than the incumbent's 0.407). Meaning: the eye, at
  scale, tightens the team toward pile-up — the #85.3 confound's pessimistic reading
  vindicated at sub-disease magnitude; the fork-grain −0.313 was NOT purely the
  paid-proximity artefact. Disposition: **return to the commander UNRESOLVED** — a
  clean HARD battery does NOT license P3b when the shape signal points the wrong way;
  the commander weighs whether a within-band tightening is division of labour finding
  its level or the first sign of the disease. No re-cut, no ship, P3b withheld.

* **(E) LADDER SIGN DISAGREEMENT — unresolved to the commander.** R1/R2/R3 disagree in
  sign on a shape adjudicator or the signed match differential with CIs excluding zero
  (e.g. one-body helps but both-teams clumps), OR the watchability/shape instruments
  point opposite ways with CIs excluding zero (no coherent deployment story).
  Disposition: **returned UNRESOLVED to the commander** (the P2-B reading (g)
  precedent); no P3b, no re-cut. The saturation gradient is the identification P3a's
  ladder exists to expose.

* **(F) AN X-FAMILY / STRUCTURAL GATE FAILS.** X-FP-PROD / X-OFF-IDENT / X-SEAM / X-DET
  fails, OR an eye-attributable release ≠ 0. Disposition: **FAIL, the stage stops at
  the commander**, whatever the shape instruments say — an eye that cannot reproduce
  its own flag-off (enriched) baseline, or that touches the ball, is not a valid
  deployment measurement.

**The WG-silence expectation at match level (#84.2), pre-laid across A/D:** the winger
is expected to carry a thin/quiet per-role deviation rate and a small role-mix shift
(the world already pays his width) — a DF/MF/ST-driven dispersal signature with a quiet
WG is reading (A)'s EXPECTED shape, not a shortfall; any pooled shape null is
DECOMPOSED BY ROLE before a verdict is read.

---

## §7 — NON-CLAIMS

* **P3a ships NOTHING (Road B).** `stationEye` is null and the enriched flags are
  dormant in every production path throughout; the production fingerprint is unchanged
  (`57b0bdab…c673`); no default-ON. P3a ends with a verdict, never a live default.
* **P3a licenses EXACTLY ONE thing: P3b.** A clean reading (A) licenses only the
  commander to authorize P3b (the R3-saturation re-census + the I4 stability
  comparison, #86.2(b)). P3a authorizes NO re-census, NO live-arming, and makes NO
  shipping or value claim. **P4 (the user's-eyes decision) is the USER's**, presented
  by the commander only after a clean P3b (#86.3).
* **P3a prices the role eye's DEPLOYMENT SHAPE, not value.** The value question (the
  first positive ATE, banked #85.2) is downstream and not re-litigated here; P3a asks
  only whether role-play at match scale disperses or clumps the shape and stays
  football (#85.3).
* **No new gene, no new attribute, no new percept channel, no going-bit, no brake**
  (contract I8 / §2): role is read, not created; the eye writes off-ball targets only.
* **The R3 stability iteration (I4) is NOT run here** — it is P3b's long pole
  (#86.2(b)), and runs only on a quiet P3a. P3a is the cheap gate.

---

## §RESULT — the AUTHORIZED run (ruling #87.2): THREE HARD LIMBS FIRE, the stage STOPS as frozen — and the shape resolves FOR THE EYE on the way down

Run to completion **inside the executor session** (the smoke projected under the
in-session cap; the resident was reserved for P3b, #49.5), the **frozen probe unchanged**
(§§1–7: no arm / band / instrument / seed-block / sign-space / gate re-cut after sight).
HEAD `1fcf507` (ruling #87 authorizing commit); ENRICHED world, full #67.3 bundle armed
(`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`,
`c7Windup`; `c5TouchFork` off); `src/**` byte-identical — **production fingerprint
`57b0bdab…c673` unchanged** (X-FP-PROD PASS, Road B held). Seed block **9,300,000 + k**,
4 blocks × 200 = **800 matches/arm × 4 arms (R0/R1/R2/R3, all NEUTRAL) = 3,200 matches**;
cluster = match seed paired across arms; bootstrap 2,000 @ `93003`; 6 Hz sampling.
Consumed table canonical SHA **`171a6dad…6559f`** (byte-identical, unconsumed); control
SHA **`968349ff…acc1c`** (guard PASS, pooled control −0.0567). Data:
[`data/stage3-v3-p3a-deployment.json`](data/stage3-v3-p3a-deployment.json) · file SHA-256
**`7dee0f62…150b3`** · `deterministic: true` (X-DET) · **verdict: GATES FAIL**.

**The reading is (B) + (C) jointly** (§6): **THREE watchability HARD limbs fire** (the
stage STOPS OUTRIGHT, P3b does NOT run, the deployment answer is NO) **AND the §2
equilibrium band breaks** — while the X-family/structural gates all PASS and the shape
adjudicators (§4.3) resolve toward **DISPERSAL (到岗)**, answering the #85.3 confound FOR
THE EYE. 扎堆 is dead; a different, unpriced disease killed the deployment.

### §4.1 (i) WATCHABILITY HARD LIMBS — THREE FIRE (R3 paired vs enriched R0, side-split)

| limb | instrument | R0 → R3 | rel (band) | resolved | **FIRES** |
| --- | --- | --- | --- | --- | --- |
| DEGEN-SCRAMBLE | I4 own-within-5 m | 1.073 → 1.052 (s0) · 1.078 → 1.051 (s1) | −1.9% / −2.5% (≥+25%) | yes (FALLS) | **no — quiet** |
| DEGEN-PILEUP | I3 share <4 m | 0.1028 → 0.1023 (s0) · 0.1044 → 0.1023 (s1) | −0.4% ns / −2.0% (≥+50%) | s0 no / s1 falls | **no — quiet** |
| **DEGEN-RESTDEF** | I5(b) designated slot | **0.6688 → 0.4668 (s0) · 0.6718 → 0.4641 (s1)** | **−30.2% / −30.9%** (≥−20%) | yes | **⛔ FIRES** |
| **C-OFFSIDE** | offsides/match (both) | **3.269 → 4.014** | **+22.8%** [+0.55,+0.94] (≥+10%) | yes | **⛔ FIRES** |
| C-BOX | attackers in box at arrival | 0.889 → 1.002 | +10.3% RISES (fires on ≥−15% drop) | rises | **no — quiet** |
| **C-RESTART** | restart ticks/match | **1722.0 → 2596.3** | **+50.8%** [+822,+928] (≥+10%) | yes | **⛔ FIRES** |

**Rest defence collapses ~30% on BOTH sides** — the designated-slot occupant is
abandoned nearly a third of the time. **Offsides climb +22.8%** (the eye pulls bodies off
the line). **Restart ticks +50.8%** — the v1 pin-3 warning came live: `shapeReady` reads
the incumbent formation while the eye has bodies elsewhere, so the game keeps
re-restarting. The C4-T0 arrival-class mix shifted too (C0 603→718, C2 430→536, C3
667→456: fewer late-crowded arrivals) though C-BOX itself held — reported per §4.1.

### §4.2 (ii) THE §2 EQUILIBRIUM BAND — BREAKS (goals inside; R0 inside; NO substrate-drift excuse)

| rate | C1 baseline | band | R3 | rel | inside? | R0 | R0 rel | R0 inside? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| goals | 2.3944 | ±15% | 2.3662 | −1.2% | ✅ | 2.4962 | +4.3% | ✅ |
| crosses | 2.4894 | ±25% | 2.4475 | −1.7% | ✅ | 2.4213 | −2.7% | ✅ |
| **headers won** | 9.1039 | ±25% | **5.0163** | **−44.9%** | ⛔ | 7.9525 | −12.7% | ✅ |
| **long balls** | 6.2042 | ±25% | **4.0312** | **−35.0%** | ⛔ | 5.1225 | −17.4% | ✅ |
| **cutbacks** | 3.8151 | ±25% | **2.5550** | **−33.0%** | ⛔ | 4.0287 | +5.6% | ✅ |

The band fails on **THREE non-goals stats — headers −44.9% (the worst), long balls
−35.0%, cutbacks −33.0%** — all falling out the BOTTOM. **Goals stay inside (−1.2%), and
every R0 rate is inside the band** (`r0Holds: true`), so the §4.2 substrate-drift
exemption does NOT apply: the aerial/delivery economy collapses under the eye itself, not
under the enriched substrate. (Reported ecology corroborates: shots/match −21.8%, long-ball
share −28.6% — but give-and-gos +43.5% and longest chain +11.3%: the eye trades the
delivery game for short combination play it cannot finish.)

### §4.3 (iii) THE SHAPE ADJUDICATORS — the #85.3 confound RESOLVES FOR THE EYE (到岗, not 扎堆)

R3 paired vs R0, cluster CIs, pre-named DISPERSAL direction in the last column:

| adjudicator | R3 diff | CI | resolved | pre-named 到岗 | reads |
| --- | --- | --- | --- | --- | --- |
| I3 spacing p10 | +0.028 m | [−0.018,+0.071] | no | ↑ spread | opens (ns) |
| I3 spacing MEDIAN | **+0.053 m** | [−0.026,+0.133] | no | ↑ spread | **opens** (point; CI straddles) |
| I3 pile-up TAIL <4 m (HARD) | −0.001 | [−0.003,+0.000] | no | flat/↓ | **flat — no clump** |
| I5 rest both-back share (a, reported) | +0.100 | [+0.093,+0.107] | yes | stable | **RISES +34.9%** (see note) |
| I5 designated slot (b, HARD) | −0.205 | [−0.212,−0.197] | yes | not ≥20% drop | **FIRES −30.6%** |
| I6 duplicate runs | **−0.036** | [−0.049,−0.022] | yes | ↓ | **FALLS −6.5pp** |
| I7 shape spread-X | −0.443 | [−0.482,−0.406] | yes | wider/differentiated | narrows −31.8% |
| I7 shape spread-Y | +0.187 | [+0.168,+0.207] | yes | wider/differentiated | widens +28.2% |
| role-mix TV (live) | **0.654** | — | — | ≥ 0.407 | **> incumbent 0.407** |

**The pile-up tail is FLAT, duplicate runs FALL −3.6 pp, the median spacing OPENS, live
role separation TV 0.654 clears the incumbent's 0.407, the shape re-differentiates (X
narrows, Y widens — a role-shaped reshape, not a collapse), and the eye's ball-ledger is
exactly 0.** This is DISPERSAL (division of labour), the RIGHT-way prediction of §4.3 —
NOT the pessimistic (D). The fork-grain −0.313 spacing was the paid-proximity artefact
#85.3 named; at match level with every body playing his role, the shape opens.
**⚠ Reported note for the record:** the rest-defence break is a *slot* abandonment, not a
retreat — the general both-back share (a) actually RISES +34.9% while the designated slot
(b) collapses −30.6%: bodies scatter into the rest-defence region but vacate the assigned
post. This sharpens the #88.3 diagnosis (the price list rewards presence, not the
specific unpriced job).

### §4.3b — PER-ROLE deviation (match scale) + the ladder texture

**Per-role deviation rate** (WG quiet EXACTLY as #84.2 pre-laid): DF **41.2%** · MF
**64.8%** · WG **12.3%** · ST **60.1%** — a DF/MF/ST-driven signature with a silent
winger, the expected shape, not a defect.

**The ladder — the disease GROWS MONOTONICALLY with adoption.** Rest defence (the one
fired limb with a per-rung series, via I5(b)): **R1 −2.4% → R2 −14.8% → R3 −30.6%** — one
body barely dents it, one team halves it, both teams collapse it. No sign disagreement
(reading (E) does not fire); the ladder is coherent. The signed match differential shows
the deployment-cancellation texture: R1 **+0.53** [+0.10,+0.95] and R2 **+0.66**
[+0.25,+1.05] resolve POSITIVE (a unilateral eye helps its side), but **R3 +0.06
[−0.36,+0.49] is NULL** — when both sides run the eye the edge cancels (goals
differential null, ruling #88.2).

### §4.4 (iv) X-FAMILY / STRUCTURAL — ALL PASS

| gate | result |
| --- | --- |
| X-FP-PROD | production fingerprint `57b0bdab…c673`, flags off — **matches. PASS** |
| X-OFF-IDENT | R0 (enriched, `stationEye` null) bit-identical across **800 seeds / 0 mismatches. PASS** |
| X-SEAM | fresh-null ✓ · body/team scope ✓ · both activated ✓ · carrier never overridden ✓. **PASS** |
| X-DET | two runs byte-identical, SHA `7dee0f62…150b3`; table+control SHAs re-verified unchanged. **PASS** |
| STRUCTURAL eye-never-touches-ball | 113,836 releases all named (kick 105,097 · deglue 6,612 · ball-won 1,817 · tackle 310); **eye-attributable = 0, unattributable = 0. PASS** |

The measurement is valid: the eye reproduces its own flag-off (enriched) baseline
bit-for-bit and never touches the ball. The limb-fires are real, not artefacts.

### §RESULT.disposition — which readings fired, and #88 verbatim

**Sign-space clauses fired: (B) A WATCHABILITY HARD LIMB FIRES — the stage STOPS**
(DEGEN-RESTDEF + C-OFFSIDE + C-RESTART, three teeth), **AND (C) §2 BAND BREAKS** (headers
/ long balls / cutbacks; goals inside, R0 inside → NOT substrate drift). (B)'s #85.3
sub-clause is the INVERSE of what the pessimistic branch feared: DEGEN-PILEUP did NOT fire
and the adjudicators point to DISPERSAL — the shape question resolves FOR the eye even as
the discipline limbs stop the deployment. (A) is refuted (P3b is NOT licensed); (D) is
refuted (the shape does not tighten); (E) does not fire (the ladder is coherent); (F)
does not fire (X-family clean).

**COMMANDER RULING #88 (2026-07-31), verbatim:**

> 1. **FAIL AS FIRED, the stop rule verbatim**: REST DEFENCE 66.9%→46.7% (−30.2% rel,
>    both sides, resolved) vs the −20% band; OFFSIDES 3.27→4.01/match (+22.8%) vs +10%;
>    RESTARTS +50.8% vs +10% (the v1 pin-3 warning live: shapeReady reads the incumbent
>    formation while bodies are elsewhere). The equilibrium-band gate also fails on a
>    non-goals stat (goals themselves inside, R0 inside — no substrate-drift excuse).
>    **The deployment answer is NO; P3b does not run.**
> 2. ⭐⭐⭐ **BANKED — the #85.3 confound RESOLVED FOR THE EYE**: at full deployment the
>    three-generation pile-up disease is CURED — DEGEN-PILEUP quiet (under-4 m share
>    −0.4%, CI straddling), scramble quiet, box quiet, **spacing median OPENS +0.053 m,
>    the close-pair tail opens, duplicate runs FALL −3.6 pp, live role separation TV
>    0.654 > the incumbent's 0.407**, WG silent at match level exactly as priced, the
>    eye's ball-ledger exactly 0, goals differential null. **Division of labour disperses;
>    it does not clump.** 扎堆 is dead; what killed the deployment is a NEW, different
>    disease.
> 3. ⭐⭐⭐ **THE DIAGNOSIS, banked — the baton passes to the ESTIMAND (the 现实差距对表's
>    gap #2, now measured)**: the certified table prices ONE thing (the 6/10 s two-face
>    axis), and the eye faithfully harvests it — but the incumbent's hand-tuned defaults
>    were silently doing UNPRICED LONG-HORIZON JOBS: holding the rest-defence slot,
>    staying onside, resettling for restarts. Value visible at 6 s crowds out value
>    visible only at 30+ s or in the counterfactual (the goal NOT conceded on the break
>    that never came). The eye is not wrong; the PRICE LIST is incomplete. Any successor
>    prices discipline: longer/asymmetric horizons, or the defensive face weighted at
>    role-appropriate horizons, or structural jobs entering the census as priced states —
>    design work, a future contract, NOT a patch.
> 4. **STAGE III v3 CLOSES END-TO-END** (contract → P0 role map → P1
>    division-of-labour-in-prices certified → P2 the first positive payoff + real role
>    signatures → P3a: shape cured, discipline broke). Nothing shipped anywhere (Road B
>    held throughout; the production fingerprint never moved across 46 rulings). All
>    machinery, tables and findings banked. The queue drains to USER GATES: the natural
>    next forks are (i) the ESTIMAND contract (price the long-horizon jobs — the #88.3
>    baton), (ii) the C-track (C6 v2 / C7 pass wind-up), (iii) anything the user names.
>    Presented with the wrap-up; nothing proceeds until the user rules.

**Discrepancy noted for the commander's eye:** ruling #88.1 and the pre-freeze both frame
the equilibrium break as "a non-goals stat" (singular); the data breaks on **THREE**
(headers −44.9%, long balls −35.0%, cutbacks −33.0%). The verdict is unchanged (the gate
fails either way; goals and every R0 rate inside as stated), but the disease is broader
than the singular phrasing — the whole aerial/delivery economy collapses, consistent with
the #88.3 unpriced-jobs diagnosis. Also: the spacing MEDIAN "opens +0.053 m" as a point
estimate but its CI straddles zero (not CI-resolved); the resolved dispersal evidence is
the FLAT pile-up tail, duplicate runs −3.6 pp (resolved), and role-mix TV 0.654.
