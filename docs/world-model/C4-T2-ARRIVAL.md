# C4 T2-ARRIVAL — the half-metre of arrival, on the doubled target

Status: **PRE-REGISTERED 2026-07-27, NOT RUN.** Authorized by **commander
ruling #32.4** on T1-FLIGHT's measured residual. Executor-drafted under
Autonomous mode; gates frozen here, before any Phase-A data exists.

Authority: [`C4-AERIAL-ARRIVAL.md`](C4-AERIAL-ARRIVAL.md) §2 T1-demoted /
§3 Q2 (the corner machinery generalizes by HALVES) / §3 Q5 (I2, conversion
is a ceiling) / §5.5 (the re-aim) · ruling #32.3 (v1 is a COUPLED PAIR —
Phase B defers to the pair audit) · #32.4 (scope: post-kick landing
re-route + the box-crash routing fix + the demoted C1 repair, offside
canary HARD, I2 in its #31.2 interval form, the T0b ladder re-run) ·
#32.1 (coupon-collector gates forbidden — applied to my own F2 below) ·
#20 (CI/cluster) · #19/#24/#29.5 (power at freeze time) · #30.3 (mechanism
derived from code before data).

## 1. What T2-ARRIVAL is

T1-FLIGHT fixed the height and **enlarged** the arrival gap: H3
(*the ball crossed head height with nobody at head height*) went from
11.74% to **22.90% of all crosses**, and the nearest body got **farther**,
2.08 → 2.39 m. Deliveries that were previously un-headable by construction
now arrive headable and find nobody there.

T2 is that half-metre, and nothing else. Not the contest (1.35 m stays,
Q3), not the delivery (healthy, Q1, and now also flight-corrected), not
conversion (a ceiling, never a target, Q5).

## 2. The mechanism, derived from the code before any data (#30.3)

### 2.1 ⚠️ One of the three authorized components is ALREADY IN THE ENGINE

The contract's §2 describes the post-kick landing re-route as something to
build. **It exists in open play, and has since Phase 63** —
`actionExecutor.ts:159–166`:

```ts
if (p.action.type === 'ReceivePass' && ball.owner === null && ball.z > CONTROL_MAX_HEIGHT) {
  const { x: lx, y: ly } = ballLanding(ball);
  const vl = Math.hypot(ball.vel.x, ball.vel.y) || 1;
  target = { x: lx - (ball.vel.x / vl) * 2.5, y: ly - (ball.vel.y / vl) * 2.5 };
}
```

Its own comment says it is *"the 31.9 corner principle in open play"*:
attack the DESCENT 2.5 m upstream, not the drop. `ballLanding`
(`perception.ts:97–112`) is the one shared projector, Magnus-corrected and
exact.

**So the re-route is not missing. It is granted to exactly one body — the
registered pass target** (`registerPass` → `match.pendingPass` → the
`ReceivePass` candidate at `PlayerBrain.ts:1105–1107`, live for 3.5 s,
longer than any cross flight). This re-shapes T2's mechanism from *"add a
re-route"* to *"widen who is eligible for the one that already works"* —
still Q2's safe half, still post-kick, still observable physics. **Flagged
as a correction to the contract's own premise; the commander can reverse
the framing before the run at no cost.**

### 2.2 ⭐⭐⭐ And the real defect is that the box EMPTIES during the flight

`PlayerBrain.ts:1144`, the gate on every licensed attacking run:

```ts
if ((team.runners.has(p.index) || arriving) &&
    (carrier ? carrier !== p : match.phase === 'restart' || crashLive)) {
```

Read the false branch. The instant a cross leaves the boot in open play,
`ball.owner === null`, `match.phase === 'playing'`, and `crashLive` is
false (`team.cornerCrash` is set for corners only, `Match.ts:2208–2214`).
**Every runner and the arriver lose their `MakeRun` candidate.**
`SupportBallCarrier` also requires a carrier (`1128`), so what is left is
`MoveToFormationSpot` (`1172–1176`). With a decision cadence of ~0.3–0.5 s
inside a ~1.1 s flight, most of them re-decide once or twice mid-air.

Upstream, the license itself dies too: `assignRunners` clears
`team.arriver = null` every tick (`TeamBrain.ts:113–114`) and re-sets it
only while the ball is *in the wide attacking channel*
(`ballLocalX > HALF_L − 21 && |ballPos.y| > 10`, `211`) — which a ball
flying into the box has left.

**This is Phase 31.9's bug, still present in open play.** The engine has
already been patched for it twice, in the same shape, with the reasons
in-comment: `team.cornerCrash` for corners (*"the licenses died HERE and
the crashers turned back toward their formation spots before the ball was
struck"*) and the overlap license at `TeamBrain.ts:114–117` (*"the kick
clears `ball.owner`, and a license torn up at that instant strands the
runner — and the arriving ball — mid-flight"*).

And it explains H3 exactly: the ball needs ~1.1 s to reach the header
band, and for most of that second every attacking body except the
registered target is running **away from the box**.

### 2.3 The intervention, therefore: the open-play analogue of `cornerCrash`

Two nested flags, both default OFF, crosses only:

**`c4Arrival` — the license survives the delivery.** `performCross` snapshots
the already-licensed bodies (`team.runners` + `team.arriver`, exactly as
`Match.ts:2210–2213` snapshots them at the corner hand-off) into a
`team.crossFlight` record, and `PlayerBrain.ts:1144`'s `crashLive` clause is
generalized to accept it. **No new license, no new count, no new scorer** —
whoever the engine had already sent forward simply does not turn around
mid-air.

*Duration, derived not chosen*: `until = simTime + ballLanding(ball).t` read
at the kick — the license lasts exactly the flight and not a tick longer.
(The corner's 2.8 s carries hand-off slack open play does not have.)
It also ends early the moment the ball is owned again.

*Scope, derived*: armed only when `team.cornerCrash === null`, so a corner
delivery keeps its own machinery and can never be double-licensed.

**`c4ArrivalReroute` — the closest licensed body gets the re-route that
already works.** While the license is live and the ball is above
`CONTROL_MAX_HEIGHT`, the licensed body closest to `ballLanding` targets the
meet point `landing − flightDir·2.5` — the **same formula** as
`actionExecutor.ts:164–166` and as the corner branch at `320`/`344`. The
others keep their existing routing untouched, exactly as the corner branch
leaves its non-closest crashers on their structure spots for the knockdown.

Nesting is forced: without the license there is no `MakeRun` to re-route, so
the ladder OFF → license → license+re-route is the only decomposition
available, and it is the one the arms below run.

### 2.4 What this deliberately does NOT do

* **Nothing pre-kick.** The arriver keeps the 16 m arc until the ball is
  struck. That is Q2's forbidden half (it needs the delivery moment, which
  open play knows only through evidence or doctrine), it is what revert 2
  broke, and the arc is a *measured* channel in its own right
  (`cutback-anatomy`: 20% → shot).
* **Therefore the offside exposure is structurally bounded**, not merely
  gated: the flag is judged at the kick (`offsideAtKick`, `mechanics.ts:234`)
  and every body this stage moves starts moving *after* it. Revert 2's blast
  came from bodies crashing *before* the delivery. The canary in §4.6 is
  still HARD — structure is an argument, and the discipline gates arguments.
* **No new bodies in the box.** If the answer turns out to be *more*
  crashers, that is a licensing change and its own stage.

### 2.5 ⚠️ The one interpretive call, surfaced for the commander to reverse

**The defence gets no equivalent.** This is asymmetric by construction, and
I am not hiding it. Two facts make it the defensible reading rather than a
gift: the defending side's landing-chase already exists and **explicitly
excludes box landings** (`TeamBrain.ts:391–418` — *"box landings belong to
the marking scheme"*, an unscoped first cut cost 0.77 goals/match), and
T1-FLIGHT measured the defence taking **71%** of the new contests without
any such help. So the asymmetry corrects an imbalance rather than creating
one.

Unlike T1-FLIGHT §2.4 I am **not** running the alternative as an arm: a
defensive re-route is outside #32.4's authorized scope, and adding it
unbidden would be exactly the improvisation the discipline forbids.
Registered for the commander instead.

## 3. Staging, frozen

| item | value |
| --- | --- |
| Phase A block | seeds **920,000+**, fresh (830/840/850/860/870/880/890/900/909/910 all seen; 910k was consumed by this contract's own pre-freeze sizing smoke, §4.6) |
| staging | T0R's six archetype × shell combinations and its per-combination match budgets, verbatim (295/296/354/524/566/660 = 2,695 matches per arm) |
| baseline arm | **`c4Flight` ON** — the world T1-FLIGHT measured and the world the 22.90% target lives in (#32.3: v1 is a coupled pair) |
| arms | **paired same-seed**: A0 flight-only · A1 `+c4Arrival` · A2 `+c4Arrival +c4ArrivalReroute` |
| primary comparison | **A2 vs A0**; A1 is the reported ladder rung |
| cluster unit | the match seed (#20) |
| bootstrap | 2,000 resamples, frozen seed **50017** |

Pairing is why one block suffices — every gate below is a same-seed
DIFFERENCE, not a level, and T0R established the census replicates across
blocks at ≤0.85pp.

## 4. Phase A — gates

Every gate is powered ex ante against its measured base rate; **none is
disclosed as weak** (#29.5), and **none is a max-statistic** (#32.1).

### 4.1 A0-CENSUS — the reachability question, answered before the intervention

Read-only, zero `src/**`, run first on the same block. T0's lesson:
instrument before gating. It asks the one question that decides whether
this mechanism can possibly work.

For every H3 cross, take the nearest licensed attacking body at the kick and
decompose:

```text
R1  REACHABLE  — his distance to the meet point is <= topSpeed x (remaining
                 flight time), i.e. the routing is what failed
R2  MARGINAL   — reachable within 1.15x that budget (the executor's own
                 steering/accel losses live here)
R3  UNREACHABLE— he could not have arrived at any routing
R4  NO LICENCE — nobody was licensed at the kick at all
```

**A0 cannot change a single Phase-A gate value.** It can only stop the
stage, by one pre-registered rule:

```text
STOP if  R3 + R4  >  80% of H3 crosses
```

**80% is derived, not chosen**: the addressable population is
`(1 − R3 − R4) × 22.90%`; at the same one-in-four conversion assumption D1
is powered on, an addressable share below 20% yields
`0.25 × 0.20 × 22.90 = 1.15pp`, which is **below D1's 2.32pp MDE** — and
#29.5 forbids running a gate that cannot distinguish its own two readings.
Above the threshold the intervention proceeds; below it, the seat is
pre-kick anticipation (Q2's forbidden half → Stage III) and that is the
commander's, not this session's.

### 4.2 X — identity

| gate | predicate |
| --- | --- |
| **X1** | all flags off: `npm run fingerprint` returns `57b0bdab…c673`, unchanged |
| **X2** | all flags off: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts each flag is read in exactly one place, and that `c4ArrivalReroute` is inert without `c4Arrival` |
| **X4** | the banked `cross-anatomy` rollup pin on the 909k block reproduces exactly, flags off (inherited from T0R/T1-FLIGHT, verbatim) |
| **X5** | two `runExperiment()` calls byte-identical, SHA emitted |
| **X6** | **corners are untouched**: the open-play license never arms while `team.cornerCrash !== null` (asserted), and the corner behavioural tests stay green unmodified — the reference implementation this stage borrows from must not move |

### 4.3 F — the mechanism fires (layer 1 of the six-layer chain)

```text
F1  LICENCE SURVIVAL. Of crosses that had >=1 licensed attacking body at the
    kick, the share where >=1 licensed body is still on MakeRun at the tick
    the ball first enters the header band:
        A0  reported (expected near zero -- this is the defect)
        A2  >= 90%                                        (seam bites, X5-class)
F2  RE-ROUTE FIDELITY, per-record with NAMED exception classes (#32.1 --
    NOT a max over records). On every tick where the licence is live, the
    ball is above CONTROL_MAX_HEIGHT and a closest licensed body exists,
    his steering target either equals `landing - flightDir*2.5` to 1e-9, or
    falls into a named class:
        E1  the onside clamp rewrote it (actionExecutor:547 -- inert while
            the ball is unowned, so this class is expected EMPTY)
        E2  the barred-box clamp rewrote it (actionExecutor:571)
        E3  he stopped being the closest between decision and execution
    GATE: the UNEXPLAINED residual is exactly 0. Class counts reported.
```

F1's 90% floor is the same seam-bites form C5 T1 used, powered the same
way: at n ≈ 5,500 the binomial SE at p = 0.9 is 0.40pp, so 90% sits ~25σ
below a working seam and far above a broken one — it separates *fires* from
*does not fire*, which is all a layer-1 gate is for.

**F1 and F2 prove the mechanism reached the world. They prove nothing about
whether the world is better.** The payoff is D1.

### 4.3b ⚠️ Instrument facts disclosed before the run, in their own commit

Three things the implementation surfaced. None touches a gate value, the
mechanism, D1's power, I2's margin, the canary's band or §6's readings.

1. **F2 needs an observability field, and I added one.** The gate compares
   the engine's steering target against the meet point; a probe cannot see a
   local. `Player.c4Trace = { meet, applied }` is written by the executor on
   the tick its branch fires and cleared at the top of every `executeAction`.
   It is **never read by any decision** and is null in every flags-off world.
   Without it F2 could only be *asserted* in a unit test instead of *measured*
   over the run, which is the weaker thing #32.1 was trying to get away from.
2. **E3 turns out to be structurally impossible, and the class is kept
   anyway.** `Match.step` runs every `executeAction` in one loop, after
   `simTime += dt` and before any physics or ball step, so every body executes
   off the same frozen world — "he stopped being closest between decision and
   execution" cannot happen within a tick. The probe replicates the executor's
   own preconditions at the pre-step boundary for exactly this reason. The
   class stays in the ledger; an empty class is a result, not a defect.
3. **A corner takes precedence and those ticks are EXCLUDED from F2's
   population, counted separately.** `crossFlight` is armed only when
   `cornerCrash === null`, but a corner can begin while one is live, and the
   executor's crash branch wins. This is X6's own rule seen from the other
   side; the count is reported so the exclusion is visible rather than silent.

### 4.4 D — the deliverable (#28.4's "CONTESTS, never goals")

```text
D1  PRIMARY. The ATTACKING contest share of crosses (C3atk) RISES, A2 vs A0,
    paired same-seed, 95% cluster-bootstrap CI lower bound > 0
```

**Power, derived**: C3atk sits at **25.17%** of crosses (T1-FLIGHT §7.3,
flag-on), so at n ≈ 5,500 per arm the unpaired difference SE is 0.83pp and
the MDE at 80% is **2.32pp**; pairing shrinks it further. Expected effect:
H3 is 22.90% of all crosses and its median miss is 2.39 m — a body who
currently spends ~0.5 s of the flight walking away covers ~3.2 m at 6.5 m/s,
so the geometry is comfortably inside the budget. Converting a quarter of H3
gives **≈ +5.7pp**, a **2.5×** margin over the MDE.

C3atk rather than total contests, deliberately: T1-FLIGHT's +3.42pp went
71% to the defence, and this stage's mechanism is attacker-side only. Total
contests and C3def are reported beside it.

Mediators — the result must arrive via the intended path:

```text
M1  H3's share of ALL crosses FALLS (CI upper bound < 0) -- the target,
    sized at 22.90%
M2  the minimum ATTACKER distance while the ball is in the header band
    falls (median, with CI) -- the half-metre itself
M3  attacking bodies in the box at the tick the ball enters the band RISES
    -- the direct echo of "the box stops emptying"
```

### 4.5 I2 — the conversion ceiling, HARD (#32.4, in #31.2's interval form)

```text
I2  the 95% cluster-bootstrap CI UPPER bound on the paired difference in
    goal-within-4.0s-window must be BELOW +1.5pp                    (HARD)
```

Inherited whole from T1-FLIGHT §4.5 including its derivation: 1.5pp is
T0R's measured block-to-block spread of this very quantity (1.2–1.46pp), and
an increase smaller than the census's own block noise cannot honestly be
called a conversion rise. Baseline is arm-matched by pairing (A0 = 8.72%,
T1-FLIGHT §7.3), which removes the reference question entirely.

**Reported beside it, per #31.2**: the point estimate and its full interval,
so a resolved DECREASE is reported as one and not as "did not rise".
Also goals per contest — the quantity that says whether any movement came
from more contests or better ones.

### 4.6 The offside canary, HARD (revert 2's +50% blast)

```text
OC  the 95% cluster-bootstrap CI UPPER bound on the paired difference in
    BOTH-TEAM offsides per match must be BELOW +0.29 / match         (HARD)
```

**Both numbers derived, and the SD MEASURED before the freeze rather than
assumed.** A read-only sizing smoke (360 matches, `c4Flight` ON, block
910,000 — consumed for this purpose and now excluded from Phase A) gives
both-team offsides **2.4861/match, SD 1.8298** (over-dispersion 1.35 — a
Poisson assumption would have been 16% optimistic, which is exactly why it
was measured). At 2,695 matches per arm the unpaired difference SE is
**0.050/match**, so the MDE at 80% is 0.14/match.

The band is **one quarter of revert 2's measured blast** (2.20 → 3.36 =
+1.16/match): it fires long before the failure it exists to catch, it sits
2.1× above the MDE so the gate can distinguish its two readings, and a true
zero clears it by 5.8σ. Attacking-side offsides (1.2139/match, SD 1.1202)
reported beside it.

### 4.7 The T0b ladder re-runs (#32.4)

Verbatim, flag-on-flag, **reported not gated**: H0–H4 for A0/A1/A2. H1
(keeper claims) is the pre-laid backfire seat again — more attacking bodies
in the six-yard area is more `crowd` in the keeper's `pClaim` term
(`mechanics.ts:745–776`), which could cut either way and is watched rather
than assumed.

### 4.8 Reported, never gated

A1 as the ladder rung — **which half did the work**, and specifically
whether license-survival ALONE is negative (the arriver's 16 m arc target
points *away* from the landing, so holding him on it during the flight is a
real way for this to backfire); C0/C1/C2/C3def; C1 specifically, as the
demoted 5.70pp repair's own number (3.46% flag-on); per-combination
everything; the F2 exception histogram.

## 5. Phase B — NOT this stage's (#32.3)

v1 is a **coupled pair**. The live battery runs **once, on flight+arrival
together** — one bundle, one preview arm, E4 per-slice — and it is its own
pre-registration. T2 Phase A ships nothing and enables nothing by default;
both flags stay OFF.

## 6. Pre-laid readings

Three, exhaustive, laid before the run:

* **(a) D1 resolves positive** — the arrival gap was a *routing* failure, the
  bodies were always there, and the corner machinery's safe half generalizes
  as Q2 predicted. The pair audit becomes the next question.
* **(b) D1 resolves negative or straddles zero** — the bodies cannot use the
  extra second, whatever A0's reachability decomposition said about the
  geometry. Then the arrival seat is **anticipation, not routing**: the body
  has to leave before the ball does, which is Q2's forbidden half and belongs
  to the perception layer. Stop, return to the commander, no re-pose here.
* **(c) D1 resolves positive but I2 or the canary fires** — the arrival was
  bought with something the contract said we would not spend. HARD abort,
  and the honest reading is that the box cannot be filled at this scale
  without the ecology paying for it.

Registered non-claims: the contest stays a lottery (Q3); `attacking = 0.3`
stays and is not re-priced (Q4); conversion does not rise, and is not
expected to fall as far as T1-FLIGHT's did — more attacking bodies is the
one thing in v1 that pushes back on that decrease, which makes I2 a real
gate here and not a formality.

## 7. Result

### 7.0 A0-CENSUS — ✅ **PROCEED.** The arrival gap is a routing failure.

Run 2026-07-27 on block 920,000, `c4Flight` ON, 2,695 matches, **5,745
crosses**, twice byte-identical, SHA `17c46125…41b0`.
Probe: `scripts/probes/c4-t2-a0-census.ts` (read-only, zero `src/**`).

**The target replicates on a block it was not measured on** — H3 **23.03%**
of all crosses against T1-FLIGHT's 22.90%, median miss **2.32 m** against
2.39 m, C3atk **25.50%** against 25.17%. The population D1 is powered on is
the population that exists.

```text
R1  REACHABLE     96.60%
R2  MARGINAL       2.04%
R3  UNREACHABLE    1.21%
R4  NO LICENCE     0.15%
STOP statistic (R3+R4)  1.36%   CI [0.76, 2.02]   threshold 80%
```

Not close. The geometry is not the binding constraint anywhere: the nearest
licensed body needs a median **3.35 m** against a median budget of **7.95 m**
over a **1.03 s** flight — **4.86 m of slack**. A licence exists on 100% of
crosses (mean 2.14 bodies) and includes the arriver on 72%.

**What this does and does not license.** It is a *necessary-condition*
screen and it passed with room: the bodies could be there. It says nothing
about whether they will be — that is D1's question, and A0 cannot answer it.
The predicate is deliberately generous (straight line at top speed), which is
what R2's band existed to soften; with 4.86 m of median slack a much tighter
bound would also have passed, so the reading survives the predicate's
looseness rather than depending on it.

**No Phase-A gate value was touched.** A0's only power was to stop the stage.

### 7.1 Phase A

*(empty until Phase A runs — filled in the same commit as the result, per
governance rule 6.)*

## 8. Stop rules

* **A0's STOP rule fires ⇒ the intervention does not run**, the fork returns
  to the commander. A0 may stop the stage; it may not re-tune it.
* **Any X gate fails ⇒ FAIL** — a flagged stage that moves the flags-off
  world, or that moves the corner machinery it borrows from, has failed at
  its only unconditional job.
* **F1 or F2 fails ⇒ FAIL** — the seam did not bite, or it bit somewhere
  unaccounted for.
* **D1 fails ⇒ reading (b)**, stop, return to the commander. No re-pose of
  the mechanism by this session.
* **I2 or the offside canary fires ⇒ HARD abort**, regardless of every other
  gate.
* Nothing ships from this stage in any case: the ship gate is the pair
  audit's E4 preview round, the user's, per #26.1 and #32.3.
* No re-cutting after sight — not the 80% stop threshold, not D1's MDE, not
  I2's margin, not the canary's band, not §6's readings.
