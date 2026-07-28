# C7 T0 — The Shot-Release Census

Status: **PRE-REGISTERED 2026-07-29, FROZEN before the run.** READ-ONLY.
Zero `src/**`. Nothing armed, no flag touched, no constant moved. This is a
**measurement pre-registration only** — the census does NOT run under this
commit. It runs after commander review, on the commander's word (the P1
two-commit precedent; ruling #45.2(b): executor drafts → commander review →
authorized run → ruling). The pre-freeze sizing smoke (§6) DID run read-only
and its script commits with this doc (the C6-T0 precedent; #44.5).

Authority chain: **contract [`C7-RELEASE-WINDUP.md`](C7-RELEASE-WINDUP.md)
§6-T0** (this stage's scope) · §4.2 (the W-law shape whose constants T0 sizes)
· §5 invariants and §7 gate sources bind · **#54.4** (C7 is the named
payoff-side lever; T0 sizes its first slice) · #24 (floors attainable on the
census population) · #29.5/#44.5 (deliverability + population-touching
disclosure = a freeze-time sizing obligation) · #32.1 (no coupon-collector
gate forms) · #38.1 (standing exception classes + full sign space) · #46.2
(smoke/census seed disjointness) · #48.4 (fork/measurement windows pinned ex
ante) · #49.3 (event-keyed exception classes + per-record receipts, incl.
E-INJURY) · #20 (CI semantics, cluster = match seed) · Road B (nothing ships;
`c7Windup` stays unbuilt at T0 — this stage implements no law).

Code map: [`C7-PHASE0-CODE-MAP.md`](C7-PHASE0-CODE-MAP.md). §7 records the
current-HEAD lines. **Unlike C6 T0, the release chain shows NO line drift**:
the contract/map citations (`PlayerBrain.ts:922-978` switch, `Match.ts:1320-
1336` `kickBall`, `mechanics.ts:78-88` `kickMisalignment`) are exact at HEAD
`e9c52ce`. Verified, not assumed.

---

## 1. What T0 is, and is not

T0 is the baseline the shot wind-up (`pendingKick`, contract §4) must be sized
against. It **prices the POPULATION and the GEOMETRY, not value** (contract
§9): it measures how many shots there are, by which release path, the body's
state at the instant it commits, and who is near enough to reach the ball
during a wind-up window — never whether waiting pays. It proposes no law and
freezes no constant; the candidate W laws in §5 are **non-binding sizing
devices** — T1 freezes its own W constants (contract §4.2).

The census is **observational**: it steps unmodified matches and reads state
at each shot commit. It does not fork the world, forces no behaviour, arms no
flag — release is exactly today's synchronous strike throughout (there is no
`pendingKick` at T0; the map's one-sentence finding — the committed-but-
unstruck tick does not exist — is precisely why T0 must reconstruct the commit
state from the shipped synchronous strike). T1, not T0, forks and forces.

The counterfactual arithmetic (§2 (iv)) is **pure arithmetic on recorded
states** — for each candidate W it projects, from the state at the strike
instant, (a) whether a defender could have reached the ball inside W and
(b) how much the body's misalignment would have decayed in W. No
re-simulation; the bodies did not react (that is exactly what T1's live forks
test).

---

## 2. The census deliverables (contract §6-T0, made operational)

### (i) The shot population, by release path

Every entry appended to `match.shotLog` during playing time is one shot. Each
is classified to exactly one **release path**, and the classification decides
whether it is IN the v1 seat (contract §4.1, §9 I9: SHOTS ONLY, and §9's
non-claims exclude headers):

| path | IN v1 seat? | code evidence |
| --- | --- | --- |
| **open-play shot** | ✅ **IN** | `case 'Shoot'` (`PlayerBrain.ts:962`) with `kickKind !== 'freeKick'` → `performShot` (`mechanics.ts:1157`) → `kickBall` (`Match.ts:1270→1320`). The chip (`tryChip`) and the composed-1v1 branch are the SAME commit inside `performShot` — one seat, IN |
| **one-touch shot** | ✅ **IN (a sub-population)** | same `performShot` path; distinguished at commit by `shooter.firstTouchWindow > 0` (set `Match.ts:1461`, gates `oneTouchMul` `mechanics.ts:264`). Same `pendingKick` seat; recorded apart because it is the one path the queue row imagined "bypassing" the wind-up |
| **header** | ❌ **EXCLUDED** | `performHeaderShot` (`mechanics.ts:998`) sets `ball.vel`/`ball.vz` **directly — it never calls `kickBall`, the ball is not owned at the feet, and none of `kickMisalignment`/orientation prices apply**. It is an aerial contact resolved on the ball, not a release from the ownership switch. Contract §9 excludes headers by name |
| **free-kick strike** | ❌ **EXCLUDED** | `case 'Shoot'` with `kickKind === 'freeKick'` → `performFreeKick` (`mechanics.ts:1335`). A dead-ball **restart taker** (`match.restartKickGid === shooter.gid`, `Match.ts:674`); the restart run-up (`PlayerBrain.ts:899-919`) already re-orients the taker in the same tick (map §3). Restart-family, not the open-play seat |

Reported: shots per match (total and p10/p50/p90), and the count + share for
each of the four paths. **The v1-seat population = open-play + one-touch.**

**Pre-registered expectation (from §6 smoke), a finding not a gate**: the
**one-touch sub-population is essentially empty** (0/134 seat shots in the
smoke). Ground shots are settled, not first-time: the median time from gaining
ownership to the shot commit (§2 (iv), 0.508 s) is **past the 0.28 s
`firstTouchWindow`**, so the window has decayed to 0 by strike time. First-time
finishes are HEADERS (aerial, excluded). Recorded so T1 is not surprised that
the v1 seat is effectively "settled open-play shots"; leaned on nowhere.

### (ii) Body state at commit

At each v1-seat shot commit, read the shooter's own kinematics — the inputs to
the §4.2 W law — into bands whose edges are DERIVED from named code constants:

```text
speed |v| (m/s):   walk  <= 2.5          -- the de-glue speed gate (Match.ts:1420)
                   jog   2.5 - 5.0        -- 5.0 = 2x the gate
                   sprint > 5.0

turn-rate |omega|: straight  < 0.65      -- 0.1 x TURN_RATE (Player.ts:17)
(rad/s)            moderate  0.65 - 3.25  -- up to 0.5 x TURN_RATE
                   hard      >= 3.25      -- >= half the physical cap (6.5)
                   |omega| = |Delta heading| / DT across the shooter's last two owned ticks

misalignment theta: the angle between the body facing and the strike direction
(rad, and reported in degrees). theta feeds BOTH the §4.2 W-turn term's cousin
(the body IS twisted) and the (iv)(b) quality-headroom arithmetic.
```

⚠️ **theta is RECONSTRUCTED, disclosed**: the exact aim vector `performShot`
builds is not stored, so theta is read as the angle between the shooter's
heading and the **freed ball velocity direction** at the strike tick. This
carries a bounded curl-rotation error (`performShot` pre-rotates the launch by
`-curl·shotT·0.5` before `kickBall`, `mechanics.ts:1268`) — reported as a
sizing quantity, never gated. `|v|` and `|omega|` are exact. T1 evaluates the
REAL `kickMisalignment` at strike time (contract §4.1); T0's theta only sizes
the headroom bracket.

Also recorded per shot: the nearest-defender-to-BALL distance and its CLOSING
SPEED (deliverable (iii)), and the shooter's `dribbling` (the tech attr that
scales the orientation prices, `mechanics.ts:1244+`, used in (iv)(b)).

### (iii) The charge-down exposure geometry

At each v1-seat commit, over the **nearest non-sent-off opponent to the BALL**:

* **distance to the ball** `d = dist(opp.pos, ball.pos)` — the quantity the
  existing ball-keyed tackle keys on (`tryTackles`, `dist(o.pos, ball.pos) <
  1.15`, `mechanics.ts:1757`); a wind-up is interruptible through this EXISTING
  channel only (contract I3), so this is the surface a `pendingKick` exposes;
* **closing speed** = the rate the defender→ball gap shrinks at the commit
  instant: `dot(opp.vel − owner.vel, unit(ball.pos − opp.pos))`, floored at 0.
  The ball moves with the owner while owned, so subtracting the owner's
  velocity gives the true closing rate on the ball's position. This is the
  charge-down exposure geometry: a defender close AND closing can reach the
  ball inside a wind-up window; one close but static cannot.

Reported: distance distribution (p10/p50/p90) and band shares (`≤1.15`
already-eligible · `1.15–3` · `>3`), closing-speed distribution, and the share
of shots with a defender within 3 m at commit.

### (iv) Counterfactual arithmetic on recorded states (NON-BINDING brackets)

For each candidate W law (§5), compute `W(|v|, |omega|, tech)` per shot from
the recorded state, then:

**(a) Interruption (charge-down) exposure.** A defender reaches the ball inside
W if his straight-line advance closes the gap to the tackle radius:

```text
reachable  <=>  d − closeSpeed · W  <=  1.15     (TACKLE_R)
```

*Reach model, PINNED (#48.4): straight-line at the CURRENT closing speed
measured at commit = PRIMARY.* Justification: W is in the low tenths of a
second (§5) — far too short a window for a defender to accelerate materially or
re-orient, so his commit-instant velocity is the honest kinematic projection;
crediting top speed would assume an instantaneous, already-ball-aligned sprint
the window cannot deliver. **Reported alongside as SENSITIVITY: straight-line
at defender TOP SPEED (7 m/s) toward the ball** — the upper bound if every
near defender were already sprinting straight at the ball. The two diverge
sharply in the smoke (8.96% vs 25.37% at W=0.10 s), so the sensitivity is
reported, never buried. For each candidate W: the exposed share and count under
BOTH models, with the match-seed cluster CI (#20).

**(b) Quality head-room.** The heading integrator keeps running during a
wind-up (contract §4.3.2), so theta decays at TURN_RATE:

```text
theta(W) = max(0, theta_commit − TURN_RATE · W)      (TURN_RATE = 6.5 rad/s)
```

The misalignment price is the EXACT `mechanics.ts:78-88` chain, `dribbling` as
the tech attr:

```text
misalign(x)      = (1 − cos x) / 2                                 (mechanics.ts:78)
powerMul(m, tec) = 1 − m · 0.22 · (1 − tec · 0.4)                  (mechanics.ts:88)
noiseMul(m, tec) = 1 + m · (0.9 − tec · 0.6)                       (mechanics.ts:83)
```

Reported per candidate W: mean theta decay (deg); the share of shots whose
theta is fully cancelled inside W; and the **misalignment-price delta** —
`powerMul(misalign(theta(W))) − powerMul(misalign(theta_commit))` (power
regained) and `noiseMul(misalign(theta_commit)) − noiseMul(misalign(theta(W)))`
(aim spray removed). This is the #54.4 payoff channel, sized as pure arithmetic
before T1 gates on it.

### spell context

Per v1-seat shot, the time from the shooter gaining ownership to the commit
(`(commitTick − spellStartTick) · DT`, p10/p50/p90), read against the 0.33 s
median ownership spell (#29.2). This says how much of a spell a shot already
uses today — the fraction a wind-up would extend.

---

## 3. Gates, frozen

Read-only census X-family. Cluster unit for every CI statement = **match seed**
(#20); a rate/share is *resolved* only when its match-seed cluster-bootstrap CI
excludes its reference; a null is reported as such, never re-cut.

| gate | predicate |
| --- | --- |
| **X-SRC** | `git diff --stat -- src` shows **zero** `src/**` changes; the census imports the sim and reads it, writes nothing back |
| **X-FP** | league fingerprint identical to the frozen baseline `57b0bdab…c673` (nothing armed ⇒ trivially, asserted) |
| **X-DET** | two `runExperiment()` invocations produce **byte-identical** output JSON; the output-table SHA is emitted and quoted in §5-result (the smoke already proves the instrument is byte-deterministic, §6) |
| **X-OVERLAP** | reproduces any existing overlapping instrument. **None exists.** `shot-context-anatomy.ts` measures WHERE scored goals come from (assist/pressure/oneVone over `shotLog` goals) — an outcome-context telemetry, not a release-state census; `onevone-anatomy`/`chip-anatomy`/`breakaway`/`c5-t0-hold-anatomy` are outcome/context probes; **C4's `cross-anatomy` measures crosses, not shots** (#37.3 keeps flight-profile in C4's file). No prior instrument reads body state (`|v|`,`|omega|`,`theta`), defender-to-ball geometry, or release timing at the shot COMMIT. Recorded vacuous with that reason; soft anchor: total shots/match reported vs the smoke's 12.31, not gated |
| **X-CLASSIFY** | every `shotLog` entry maps to exactly one **release-path class** {open-play, one-touch, header, free-kick} or a named exception class (below); **unexplained = exactly 0**. Event-keyed (#49.3), not per-tick |

### Population floors (#24 — derived from the §6 smoke, attainable on the census staging)

The smoke (16 matches, block 6,600,000, §6) measured ATTAINABLE rates only
(shot rate, path split, exposure rate, twisted share) — no census outcome, no
comparison. The census staging (§4) is **500 matches**. Expected populations
and frozen floors (≈2× headroom, the C6 convention):

| floor | expected @ 500 matches | frozen floor | basis |
| --- | --- | --- | --- |
| **F-SHOT-SEAT** open-play + one-touch shots | ~4,190 (8.38/match) | **≥ 2,000** | 2.09× headroom |
| **F-SHOT-EXPOSED** seat shots exposed under the candidate W band, PRIMARY reach model | ~314 (≈7.5% under the conservative FAST candidate; 9–11% at the sample W in §6) | **≥ 150** | 2.09× on the most conservative candidate; per the P1R 150-count SE≤3pp convention — **the binding gate** (contract §8: too thin ⇒ fork returns to the commander BEFORE T1) |
| **F-TWISTED** seat shots with theta ≥ 30° at commit (the headroom population) | ~969 (23.13%/seat) | **≥ 400** | 2.42× |

All shots (all four paths) are also reported (~6,155 expected), for the
path-split table; not a separate gate. ⭐ **The floors are derived from a smoke
that measured RATES only** — using them to set floors is floor derivation, not
a result peek (#44.5). The smoke output is reproduced in §6; its script is
committed beside this doc.

### Standing exception classes (#38.1; event-keyed with per-record receipts, #49.3) — unexplained must be exactly 0

Every `shotLog` entry that is NOT one of the four release-path classes falls in
exactly one exception class; the count of anything else must be 0:

```text
E-ENDED       the entry is logged as the match finishes (phase leaves 'playing')
E-OWNERSWITCH ball ownership changed on the same step the shot fired, so the
              pre-step feet-owner cannot be attributed as the shooter
              (ambiguous attribution; expected ~0, classed not guessed)
E-INJURY      an advantage-foul injury to the shooter inside the attribution
              step (a knock mutating attrs post-read, Player.ts:223; or a
              same-gid becomeSub reposition without release, Match.ts:2042) --
              the #49 house class, carried verbatim
E-NONSEAT-NOOWNER  a shot logged with no pre-step feet owner that is NOT a
              header path (should be exactly 0; if it fires, the header-vs-
              other attribution is incomplete and the census FAILS, per #49's
              exactly-0 discipline)
```

Per #49.3, the ledger records **per-record receipts** (seed, tick, gid, cause)
for every exception-class hit, capped at 1,000 per class. No coupon-collector
max-statistic gate is used (#32.1); every gate is a share or a population count
powered ex ante.

---

## 4. Staging table, frozen

The disclosed smoke (§6) ran 16 matches at block **6,600,000**. Per the #46.2
law (smoke/census seed disjointness — the C6-T0 catch, not to be repeated) the
census block starts one stride clear, at **6,700,000**, above every consumed
range.

| item | value |
| --- | --- |
| **seed block** | **6,700,000** (fresh, disjoint). Consumed elsewhere: P0 930k · P1 960k–1.46M · P1R 980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 T0 smoke 4.0M, census 4.1M–4.7M · C6 T1/T1R 5.0M–6.1M · C6 T2 6.2M–6.5M · **the C7 §6 smoke 6.6M**. **6,700,000 lies above every consumed range and above the smoke.** |
| **blocks** | 5 disjoint strides: seeds `6,700,000 + b·100,000 + k`, `b ∈ 0..4`, `k ∈ 0..99` (6.7M, 6.8M, 6.9M, 7.0M, 7.1M) |
| **matches** | **500** (100/block). Justified by the smoke: at 8.38 seat shots/match this delivers ~4,190 seat shots (2.09× F-SHOT-SEAT) and ~314 exposed under the conservative candidate (2.09× the binding F-SHOT-EXPOSED). Shots are a rich population (12.31/match total), so 500 clears every floor without over-spending — turn episodes needed 600 matches for 4,116; the binding shot floor here is the THIN exposed subset, and 500 sizes it while keeping the run at ~7.5 M steps |
| **duration** | default `MATCH_DURATION = 240` (unmodified) |
| **sampling** | event-driven: read state at each `shotLog` append during playing time (with a per-owner heading/spell tracker for `|omega|` and spell-to-commit). No sub-sampling |
| **cluster unit** | match seed (disjoint per block), #20 |
| **bootstrap** | fixed `BOOTSTRAP_SEED`, cluster resampling over match seeds |
| **output** | `docs/world-model/data/c7-t0-shot-release.json`, committed as SHA'd data with the run result; the table SHA quoted in §5-result and reproduced by X-DET |

---

## 5. Candidate W laws (non-binding; registered for §2 (iv))

**These are sizing devices, not proposed law.** T1 freezes its own W law from
the census; these three bracket the contract §4.2 shape so (iv)'s arithmetic
sizes interruption exposure and quality head-room across a plausible range.
Each computes, per recorded shot state:

```text
W(|v|, |omega|, tech) = clamp( W_BASE + W_MOVE·(|v|/V_REF)
                               + W_TURN·(|omega|/TURN_RATE)
                               − W_TECH·(tech − t_bar),  W_FLOOR, W_CAP )
```

`V_REF = 7 m/s` (role top-speed reference, the C6 convention); `TURN_RATE =
6.5`; `tech = dribbling` (the attr that already scales the orientation prices),
mean-centered on the population mean `t_bar` so the mean body's W is the
headline (the C6 T1 mean-preserving convention). All constants in seconds.

```text
Candidate FAST  (lower bracket, least exposure — the conservative floor source)
  W_BASE 0.04  W_MOVE 0.03  W_TURN 0.03  W_TECH 0.04  W_FLOOR 0.03  W_CAP 0.12
  mean body (|v|~6.7, |omega|~0.44):  W ~ 0.071 s ;  twisted sprinter ~ 0.086 s

Candidate MID   (central bracket — the contract's low-tenths expectation)
  W_BASE 0.06  W_MOVE 0.05  W_TURN 0.05  W_TECH 0.05  W_FLOOR 0.05  W_CAP 0.18
  mean body:  W ~ 0.111 s ;  twisted sprinter ~ 0.14 s

Candidate SLOW  (upper bracket — approaches the watchability caution)
  W_BASE 0.08  W_MOVE 0.07  W_TURN 0.07  W_TECH 0.06  W_FLOOR 0.06  W_CAP 0.25
  mean body:  W ~ 0.152 s ;  twisted sprinter ~ 0.19 s
```

All three keep W in the low tenths of a second, floor > 0 (no free instant
strikes, §4.2), cap well under the 0.33 s median spell (§4.2). The smoke's
fixed sample W (0.10 s, 0.15 s) brackets the candidate MEANS; the census
computes state-dependent W per candidate. For each candidate, (iv) reports the
exposed share (both reach models) and the theta-decay price delta, each with a
match-seed cluster CI (#20).

## 5-result — the AUTHORIZED run

*(To be filled after commander review authorizes the run. The census script,
data JSON, output SHA and table SHA, gate table, floor table, deliverables
(i)–(iv), the spell context, and the fired reading go here — the C6-T0 §5-result
form. Nothing is run under this freeze commit.)*

---

## 6. The pre-freeze sizing smoke (disclosed, #44.5)

Script: [`../../scripts/probes/c7-t0-sizing-smoke.ts`](../../scripts/probes/c7-t0-sizing-smoke.ts)
(committed beside this doc). Run 2026-07-29, **16 matches, block 6,600,000**,
HEAD `e9c52ce`, read-only, zero `src/**`, twice byte-identical. It measured
population RATES to derive §3's floors — no census outcome, no comparison, no
ranking. Verbatim:

```text
=== C7 T0 SIZING SMOKE ===
matches 16, seedOffset 6600000, total steps 240670
total shots logged: 197 (12.31/match)
shots/match: p10 7.5 p50 11.0 p90 20.0

--- shot population by release path ---
   134   68.02%  openplay
     0    0.00%  onetouch
    45   22.84%  header
    18    9.14%  freekick
v1 SEAT (openplay+onetouch): 134 (8.38/match, 68.02% of all shots)

--- v1-seat body state at commit ---
|v| m/s:   p10 3.40 p50 6.69 p90 7.29
|omega|:   p10 0.00 p50 0.44 p90 2.52 rad/s
theta deg: p10 1.7 p50 7.3 p90 61.5
  |v| bands:    walk<=2.5 5.97%  jog2.5-5 13.43%  sprint>5 80.60%
  |omega| bands: straight<0.65 52.99%  moderate0.65-3.25 39.55%  hard>=3.25 7.46%
  twisted at commit: theta>=30deg 31 (23.13%)  theta>=45deg 22 (16.42%)

--- charge-down exposure geometry (v1-seat, nearest def to BALL) ---
def dist m:    p10 1.61 p50 2.53 p90 4.61
close speed:   p10 0.00 p50 0.17 p90 7.42 m/s
def within 3 m of ball at commit: 61.94%

--- (BINDING FLOOR SIZE) interruption-exposed share under sample W ---
W=0.10s: exposed(current-closing) 12 (8.96%)  |  exposed(top-speed sensitivity) 34 (25.37%)
W=0.15s: exposed(current-closing) 15 (11.19%)  |  exposed(top-speed sensitivity) 53 (39.55%)

--- theta head-room under sample W (pure arithmetic at TURN_RATE) ---
W=0.10s: theta decay mean 15.0 deg; theta fully cancelled in 79.85% of shots; mean powerMul gain +1.00pp; mean noiseMul drop -3.58pp
W=0.15s: theta decay mean 17.9 deg; theta fully cancelled in 87.31% of shots; mean powerMul gain +1.21pp; mean noiseMul drop -4.33pp

--- spell context: gaining ownership -> shot commit (v1-seat) ---
spell-to-commit s: p10 0.083 p50 0.508 p90 2.720
(median ownership spell = 0.33 s; a shot's own spell uses this much of it)
```

Five facts the smoke establishes, carried into the readings below:

1. **The v1 seat is settled open-play shots.** Open-play 68%, **one-touch 0%**,
   header 22.8% (excluded), free-kick 9.1% (excluded). The one-touch "bypass"
   the queue row imagined has no ground-shot population — shots come at spell
   0.508 s median, past the 0.28 s `firstTouchWindow`.
2. **Shots are taken at pace.** 80.6% sprint (`|v|` p50 6.69 m/s), mostly
   straight (53% straight, 7.5% hard-turning). The W law's move term will
   dominate its turn term at these states.
3. **Most shots are already well-aligned.** theta p50 7.3°, but a real twisted
   tail (p90 61.5°, 23% ≥ 30°, 16% ≥ 45°) — the head-room payoff lives in that
   tail, not the mean.
4. ⭐ **The interruption seat is THIN under the honest reach model.** A defender
   is within 3 m at commit 62% of the time, but he is mostly NOT closing
   (closing speed p50 0.17 m/s). Under the primary current-closing reach model,
   only **9–11%** of shots have a defender who reaches the ball inside W; under
   the top-speed sensitivity, 25–40%. **The reach model is decisive**, and the
   primary one says the charge-down population is small.
5. **The head-room delta is small in the mean** (+1.0–1.2 pp power, −3.6–4.3 pp
   noise) because most shots are already aligned; it concentrates in the twisted
   tail.

---

## 7. Code truth at HEAD (`e9c52ce`) — no drift on the release chain

The contract and map cite lines that match HEAD exactly (verified, not
assumed):

| cited (contract/map) | actual @ HEAD | value |
| --- | --- | --- |
| decision switch `PlayerBrain.ts:922-978` | switch at **922**, `case 'Shoot'` at **962** | synchronous strike, confirmed |
| `kickBall` `Match.ts:1320-1336` | `kickBall` at **1320**, `ball.owner = null` at **1323** | the single ball-leaves-foot statement |
| `performShot` `mechanics.ts:1157` | at **1157**; `kickBall` call at **1270** | open-play + one-touch + chip seat |
| `performHeaderShot` | at **998**; sets `ball.vel`/`ball.vz` directly, **no `kickBall`** | header EXCLUDED, code-confirmed |
| `performFreeKick` `mechanics.ts:1335` | at **1335** | free-kick EXCLUDED |
| `kickMisalignment` `mechanics.ts:78` / `orientationNoiseMul` 83 / `orientationPowerMul` 88 | at **78 / 83 / 88** | the exact (iv)(b) formulas |
| tackle ball radius `< 1.15` `mechanics.ts:1757` | at **1757** | the interruption channel |
| `TURN_RATE` `Player.ts:17` | at **17** | 6.5 rad/s |
| `AI_INTERVAL` `constants.ts:342` · `DT` 55 · `KICK_COOLDOWN` 282 | at **342 / 55 / 282** | 0.15 / 1/60 / 0.45 s |
| `restartKickGid` `Match.ts:674` · `firstTouchWindow` set `Match.ts:1461` | at **674 / 1461** | free-kick + one-touch discriminators |

No value moved and no line drifted between the contract's date and HEAD.
Reported per the iron rule.

---

## 8. Pre-laid readings — the full sign space (#38.1)

Each reading with its disposition. No re-cutting after sight: not W's brackets,
not the reach model, not the theta threshold, not the floors, not these
readings (contract §8).

* **(a) THIN SHOT POPULATION.** F-SHOT-SEAT falls below 2,000. Per contract §8
  this is a **finding, not a licence to lower the floor**: too few shots to
  power T1's two axes, and the fork returns to the commander BEFORE T1 is
  drafted. (The smoke says this is unlikely — 8.38 seat/match — but it is
  pre-laid.)
* **(b) NO MEANINGFUL INTERRUPTION EXPOSURE.** F-SHOT-EXPOSED falls below 150,
  OR the exposed share under the PRIMARY reach model is a handful of percent for
  every candidate W. Then **the seat cannot matter at v1 scope — a finding**:
  the charge-down that C7's interruptibility promises has almost no population,
  because shots are taken with defenders near but not closing (smoke: closing
  speed p50 0.17 m/s). The fork returns to the commander with the sizing as
  evidence, before T1 spends a budget. **This reading is live** — the smoke's
  9–11% primary-model exposure is the thin end, and whether that "matters" is
  the commander's call, not the executor's.
* **(c) EXPOSURE EXISTS BUT THETA HEAD-ROOM IS NIL.** The exposed population
  clears its floor, but (iv)(b)'s misalignment-price delta is negligible for
  every candidate W (because shots are already aligned, smoke theta p50 7.3°).
  Then time-buys-quality (the #54.4 payoff channel) is not there through the
  existing prices at v1 scope — the interruption axis may still be real, but the
  composed-vs-rushed payoff is not. Reported so T1 does not gate on a headroom
  that isn't there. (The smoke's +1 pp mean power gain makes this a genuine
  candidate.)
* **(d) RICH AND MOVABLE — the design case.** F-SHOT-SEAT and F-SHOT-EXPOSED
  both clear, at least one candidate W creates a non-trivial interruption
  exposure with a match-seed CI excluding its baseline, AND the twisted-tail
  head-room delta is non-negligible. Then T0 has delivered its purpose: it
  **licenses the commander to authorize T1's drafting** with measured constants
  and ex-ante power on BOTH axes (contract §6-T1's two-axis obligation). Nothing
  more (T0 prices no law).
* **(e) DEGENERATE PATH AXIS (expected, benign).** One-touch ≈ 0% and the seat
  is effectively open-play only (§6). Read as confirmation that the v1 seat is
  settled shots; the census keys on `|v|`/`|omega|`/`theta`/geometry, none
  degenerate. Not a defect.
* **(f) THETA RECONSTRUCTION UNRELIABLE.** If the ball-velocity-derived theta
  disagrees materially with the body-state expectation (e.g. curl dominates),
  the headroom sizing is flagged as low-confidence and T1 must instrument the
  real `kickMisalignment` at strike time (which it does regardless, contract
  §4.1). Reported, never gated.

---

## 9. Registered non-claims

* **T0 prices nothing.** It measures the shot population, body state, and
  exposure geometry; it makes no claim that waiting/composing pays or that
  charge-downs will occur (contract §9's estimand boundary: C7 prices the TIME a
  strike takes, not where the ball goes).
* **T0 proposes no law and freezes no W constant as final.** The §5 candidates
  are sizing brackets; T1 freezes its own W law and constants.
* **T0 cannot authorize T1.** The census result returns to the commander; a (d)
  reading is a licence for the commander to authorize T1's drafting, not for the
  executor to proceed (contract §6, §8).
* **No `src/**` and no flag.** `c7Windup` is not built at T0; release is the
  shipped synchronous strike throughout. Nothing ships (Road B).
* **Headers, free-kicks, passes, crosses, clearances and keeper distribution
  are untouched** and out of the v1 seat (contract §9); the keeper reads the
  strike instant exactly as today (I6).
