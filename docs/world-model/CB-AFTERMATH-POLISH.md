# CB — THE KNOCK AFTERMATH POLISH (fix ① knock-and-go · fix ③ the derived marker lifetime)

Status: **FROZEN (this half), then BUILT + RUN.** Per **#266.3(c)** everything from §WHY to
§NON-CLAIMS — both fixes' exact forms with their traces, the ⭐ LIFETIME DERIVATION, the rejected
alternative, the scope rule, the ⭐⭐ MACHINE-DERIVED liveness rule, the frozen gate list, the
frozen A/B read list, the N rule and the seed ledger — lands in **its own commit BEFORE any
battery is read**, so git corroborates frozen-before-sight. The measured numbers arrive only in
[§RESULT](#result) at the foot, and every number there is quoted FROM the committed artifact
(#229.2).

Authority chain: the **CARRY-BEAT CONTRACT**
[`CB-CARRY-BEAT-CONTRACT.md`](CB-CARRY-BEAT-CONTRACT.md) **§2 M-CB.1(b)** (the bound contract),
dispatched by ruling **#272.4(a)** as a **SEAM-HONESTY CORRECTION — NOT a new mechanism**.
Findings of record it answers: ruling **#272.3** (the knocker-aftermath probe) and
[`INFO-DOCTRINE.md`](INFO-DOCTRINE.md) **§0** (自己发起的动作 = 零延迟) and **§3** (the measured
baseline). Instrument inputs: [`CB-T0-DORMANT-LAYER1-SEAM.md`](CB-T0-DORMANT-LAYER1-SEAM.md),
[`CB-T1-BEATEN-EVENT-EXAM.md`](CB-T1-BEATEN-EVENT-EXAM.md),
[`CB-T2-CHOICE-SEAT.md`](CB-T2-CHOICE-SEAT.md) (the priced form this round corrects the world
under). Hygiene canon: **#163** · **#200** · **#203** · **#229.2** · **#236** · **#247** ·
**#248.1** · **#250.3** · **#261.2** · **#262.2** · **#266.2(i)** · **#266.3(a,b,c)** ·
**#267.2** · **#268.2(iii,iv)** · ⭐⭐ **#268.3(a)** (LIVENESS BY MACHINE) · **#272.3(v)** (the
CB-T1 exactly-one-conjunct form, ENFORCED, non-negotiable).

---

## §WHY — the world undercuts its own priced form

CB-T2 priced a touch-past candidate on the assumption that the knocker CHASES: the candidate's
length is `rolledDistance` at the knocker's own speed over the race window the push itself sets.
The knocker-aftermath probe (#272.3) measured what the world actually does after the release:

* **the 10-tick stale label.** The knocker keeps his `Dribble` action label for a deterministic
  **10 ticks (0.167 s)** on 600/658 knocks — his brain re-decides on the ordinary `AI_INTERVAL`
  cadence, so he is the **LAST body on the pitch to react to his OWN action**, while every
  defender's steering re-targets the truth ball **within 1 tick**. Today's information gap at the
  touch-past is NEGATIVE (INFO-DOCTRINE §3).
* **the flat marker.** `match.dribbleTouch.until = simTime + 1.6` is a hand constant. **17.5 %**
  of knocks (115/658) are still unresolved when it expires, and in **63** of them the knocker's
  brain walks away from a ball ~2 m off, mid-race, because the marker — not the race — ended.

Both are seam dishonesty: the world does not deliver the form it prices. Neither fix adds a
mechanism, a perception, or an information channel.

---

## §FIX-① — KNOCK-AND-GO (the release IS the start of the chase)

**Football semantics (the user, INFO-DOCTRINE §-1 message 3, ratified §0):** 趟球和启动是同一个
动作 — 自己发起的动作 = 零延迟 (碰到的瞬间就开始走). A body does not wait for a decision slot to
notice what his own foot just did.

**THE FORM (exactly this, and nothing else):** at the aimed release, inside `performTouchPast`
and after the release writes, the knocker's decision timer is reset so that his brain re-decides
at the very next decision phase:

```text
p.decisionTimer = 0;   // the knock IS the start of the chase (INFO-DOCTRINE §0)
```

* **Trace — the precedent's form.** The engine already resets a body's decision timer when its
  situation changed underneath the cadence, with the comment that names the reason: `src/sim/
  Match.ts` `trySubstitution` — `out.decisionTimer = 0.05; // think on arrival, not a stale slot's
  cadence`; the same idiom at `forceSubstitution` and at the kick-off striker. `giveBall` writes
  the same family of override (`p.decisionTimer = Math.max(p.decisionTimer, … 0.18 …)`, the settle
  after a capture, and `Math.min(…, 0.18)` for a keeper on the press's clock).
* **⚠ DECLARED DEVIATION FROM THE PRECEDENT'S LITERAL (0.05 → 0).** The precedent's *form* is
  "re-decide off the stale slot's cadence"; its *value* (0.05 s) is a SETTLE — a body walking onto
  the pitch has nothing to react to yet. Here the doctrine's ratified term is **zero** latency for
  a self-initiated action, and the engine's own decision gate is `if (p.decisionTimer <= 0)`, so
  the value that means "at once" is the gate's own threshold, **0** — not a second copy of a hand
  constant (#200). Arithmetic, so the choice is checkable rather than aesthetic: the decision
  phase runs BEFORE physics (the decrement) and physics before the ball step (the release), so
  `0` re-decides on the **next tick** — 1 tick, the engine's floor — while `0.05` costs
  `ceil(0.05/DT) + 1 = 4` ticks and lands on a floating-point boundary (`0.05 − 3·(1/60)`).
* **NO PHYSICS CHANGE.** No velocity, position, heading, cooldown or timer other than
  `decisionTimer` is written. His body still has to brake, turn and run — only the BRAIN stops
  being stale. **ZERO INFORMATION LEAK**: it is his own action, and nothing about any other body
  is read.
* **SCOPE:** the aimed touch-past path ONLY. `performDribbleTouch` (the production push) is
  **byte-untouched**.

---

## §FIX-③ — THE MARKER LIFETIME BECOMES A DERIVED LAW

`match.dribbleTouch = { gid, until: simTime + 1.6 }` — the `1.6` is a hand constant with no
derivation anywhere in the programme. For the AIMED knock it becomes the knocker's **own claim
horizon**, derived from the knock's own physics.

### The derivation (every term traced; no tuned constant)

The marker answers exactly one question: **is this loose ball still HIS knock?** It is still his
knock for as long as his own motion model can still end the race — i.e. for the interval the
engine ALREADY derives for a body that must get itself back onto a ball its momentum has carried
it past. That law exists and is banked: `recoveryInterval` (`src/sim/carryBeat.ts`), CB-T0's
physics-derived recovery, three legs and no others:

```text
brake = |v| / a            his deceleration model IS his acceleration model   (carryBeat.ts)
turn  = θ / TURN_RATE      θ = angle from where his momentum points to the target
close = sqrt(2·d / a)      the braking identity inverted, from rest
```

The only thing this fix chooses is **the target that law is aimed at**, and it chooses the one
point the knock itself defines: **the ball's roll-out endpoint** — the farthest point the ball can
ever reach along the line it was struck on. Under the engine's own turf decay
(`rolledDistance(v, t) = v·(1 − e^{−k·t}) / k`, `carryBeat.ts`, `BALL_FRICTION_K = 0.55`,
`constants.ts`) that limit is closed-form:

```text
D∞ = lim_{t→∞} rolledDistance(v0, t) = v0 / BALL_FRICTION_K        (v0 = the release speed)
rollOut = ball.pos + dir · D∞
L_claim = recoveryInterval(knocker, rollOut, knocker.heading).total
```

and the marker may never expire while the engine still FORBIDS him to touch the ball, so it is
floored at the engine's own no-recollect window for this push
(`touchRaceWindow(push) = TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH`, `carryBeat.ts`,
the identical expression `performTouchPast` already writes into `p.kickCooldown`):

```text
⭐ THE LAW:   until = simTime + max( touchRaceWindow(push), L_claim )
```

Worked, with the measured medians of record (#272.3: `v0 ≈ 8.93 m/s`, knocker speed `≈ 5 m/s`,
`a = ACCEL·(0.9 + pace·0.2) ≈ 14 m/s²`, `TURN_RATE = 6.5 rad/s`, push median 3.70 m):
`D∞ = 8.93/0.55 = 16.24 m` · `brake = 5/14 = 0.357 s` · `turn = θ/6.5` (0 s straight on, 0.483 s
turned right around) · `close = sqrt(2·16.24/14) = 1.523 s` · `W = 0.26 + 3.70·0.04 = 0.408 s`
⇒ **L ≈ 1.88 s forward, ≈ 2.36 s fully turned**, against the incumbent flat 1.6 s. It is a
PER-KNOCK quantity: a short knock at walking pace gets a SHORTER marker than 1.6 s, a hard knock
behind him a longer one.

* **Non-vacuity, pre-registered:** the law must produce a materially spread lifetime (not a
  disguised constant) — `gLifetimeLaw` requires ≥ 3 distinct values and a min/max spread > 0.25 s
  over the battery, and requires the engine's written marker to equal an INDEPENDENT
  re-derivation of the law exactly on **every** knock.
* **SCOPE:** the ARMED touch-past path ONLY. `performDribbleTouch` keeps its incumbent flat
  `1.6` — **byte-identity of the production world is the HARD gate** (`gProdUntouched`,
  `gIdentity`, `xFpProd`).

### ⭐ THE ALTERNATIVE CONSIDERED AND REJECTED (surfaced per the dispatch)

**Rejected: a LIVENESS marker** — "the claim persists while the race is genuinely live (ball
loose AND he is the nearest body)", re-evaluated每 tick instead of a time law. Three reasons:

1. **It is a new mechanism, not a seam correction.** A per-tick claim test is a rule about the
   world's current state that did not exist before; this round is bound to correcting a hand
   constant under M-CB.1(b) (#272.4(a)), and "no new mechanisms" is the dispatch's own iron rule.
2. **It leaks information.** "Am I the nearest?" is a query about OTHER bodies' positions,
   evaluated continuously and for free — precisely the perception channel the INFORMATION
   DOCTRINE gates behind the (unstarted, user-gated) PERCEPTION CONTRACT. Fix ① is honest exactly
   because it reads nothing but his own action; a liveness marker would not be.
3. **The time law is re-derivable; a liveness rule is not.** The lifetime written at release is a
   closed form of quantities the knock itself set, so an instrument can re-derive it exactly
   (that is `gLifetimeLaw`). A path-dependent marker can only be re-derived by replaying the
   world.

⚠ The cost of rejecting it is stated, not hidden: a time law can keep a knocker chasing a ball a
defender has already effectively won (until the engine's own capture clears the marker in
`giveBall`). The A/B measures that as the who-wins census and the outcome shares, and any
deterioration lands in §DOUBTS.

---

## §SCOPE — what may move, and what may not

| surface | disposition |
| --- | --- |
| `src/sim/mechanics.ts` `performTouchPast` | **two added lines** (fix ①'s timer reset, fix ③'s derived `until`) |
| `src/sim/carryBeat.ts` | **one added pure export** (`knockClaimLifetime`), no existing law touched |
| `src/sim/mechanics.ts` `performDribbleTouch` | ⛔ **BYTE-UNTOUCHED** (its flat `1.6` stays) |
| `Match.ts` marker expiry / `giveBall` / `PlayerBrain` chase branch | ⛔ untouched |
| defenders, perception, `AI_INTERVAL`, any other body's timer | ⛔ untouched (dispatch's iron rule) |
| doors / flags | ⛔ none added, none changed |

`performTouchPast` is reachable ONLY behind `match.cbTouchPast && forcedTouchPast !== null`
(`Match.ts` `stepBall`, the ONE fork), both false/null in every production path — so the
production world is untouched **by construction**, and the identity stack proves it anyway.

---

## §A/B — THE FROZEN READ LIST (the point of the round)

Both arms are the **same armed world** — the play entry's exact arming, `a4MatchFlags(6)` +
`armA4World(match, null, 6)`, `cbArmedVersion === 6` asserted — on the **same seeds**, with the
**byte-identical probe file** (sha asserted equal across arms). **PRE = the build at `HEAD~` of
the fix commit** (measured in the working tree before the fixes landed; the artifact carries the
src fingerprints that prove which build produced it, gate `gArmsDistinct`).

| # | quantity | grain | of record (#272.3, 30 scratch seeds) |
| --- | --- | --- | ---: |
| 1 | **label-switch histogram** — ticks from release to the knocker's `ChaseBall` label, buckets `0 · 1 · 2–3 · 4–9 · 10+`, plus the median | per knock | median **10** ticks |
| 2 | **back-half regather rate** (knocks aimed behind his travel) | per knock | **20.3 %** |
| 3 | **overall regather rate** | per knock | **56.7 %** |
| 4 | **mid-race abandons** | per knock | **63** / 658 |
| 5 | **races unresolved at the marker expiry** (each arm at its OWN marker) | per knock | **17.5 %** |
| 5b | **races unresolved at a FIXED 1.6 s horizon** (the common yardstick) | per knock | 17.5 % |
| 6 | **who-wins census** — knocker · beaten man · other defender · opp GK · teammate · out · whistle | per knock | 56.7 / 8.7 / 21.6 / — / 5.3 / 5.9 |
| R1 | defender reaction delay (the untouched control) | per defender-knock | 1 tick |
| R2 | marker lifetime distribution | per knock | flat 1.600 |
| R3 | world summary: goals · shots · fouls · turnovers · knocks per match | per match | reported |

**ABANDON, frozen definition:** a knock whose marker expired with the race unresolved, where at
expiry the knocker was his side's **nearest outfielder to the ball**, and **12 ticks after
expiry** his action label is **not** a ball-chase label (`ChaseBall` / `InterceptPass` /
`GoalkeeperRush` / `GoalkeeperSave`). The gap he walked away from is recorded.

**Estimator:** per-seed (cluster) cells stored in the artifact; **paired** cluster bootstrap over
seeds (the arms share the seed list), B = 2000, 95 % percentile CIs, ONE shared resample matrix.
Stats base **110,400** (step 200, at/above the ruling floor, clear of every published base).

---

## §GATES — the frozen list (HARD; every conjunct mutant-flipped, EXACTLY-ONE ENFORCED)

⭐⭐ **LIVENESS BY MACHINE (#268.3(a), the CB-T1 form per #272.3(v)):** the coverage map is
enumerated **from the gate objects themselves** at startup; a conjunct without a mutant, or a
mutant naming a conjunct that does not exist, makes the probe **REFUSE TO RUN** (exit 3). Every
mutant must **flip its own conjunct AND leave every other conjunct of that gate unchanged**
(`live = flipped && othersSurvived`); `gMutants` is the conjunction of that over all mutants.

| gate | asserts |
| --- | --- |
| `gDet` | the whole receipt body re-derives bit-identically on a second independent pass |
| `gIdentity` | ⭐ **flags-off byte-identity**: trajectory digests over 12 virgin seeds × **BOTH world shapes** (bare production · the a4 substrate) are **equal between the PRE and POST arms**, and non-vacuously sampled |
| `xFpProd` | ⭐ the **production fingerprint** re-derives: 3 League seeds × 2 seasons headless equal their frozen baselines, in BOTH arms |
| `gProdUntouched` | `performDribbleTouch`'s body sha is IDENTICAL across arms and still writes the flat `+ 1.6`; the marker-expiry line in `Match.ts` and the brain's chase branch are unmoved |
| `gScope` | exactly two `dribbleTouch = {` write sites in `src/**` (one per function, named); the knock-and-go write occurs exactly once and only inside `performTouchPast` |
| `gArmsDistinct` | the PRE artifact carries the fix-ABSENT src fingerprint and the POST artifact the fix-PRESENT one, and the two artifacts share probe sha, seed list, world flags and N |
| `gLifetimeLaw` | POST: every knock's written marker equals an INDEPENDENT re-derivation of §FIX-③'s law (≤ 1e-9); PRE: every marker is exactly 1.600; POST non-vacuity: ≥ 3 distinct lifetimes and spread > 0.25 s |
| `gKnockAndGo` | POST: the label-switch lag is ≤ 1 tick on every knock that had a lag to pay; PRE: the modal lag is > 1 tick (the defect is present to be fixed) |
| `gWorld` | both arms armed at `cbArmedVersion === 6`, every substrate flag read back off the built match, `stationEye` null, no engine door set |
| `gNonVac` | every published rate has a non-empty denominator at claim grain, in both arms |
| `gBoot` | ONE shared resample matrix, B = 2000, indices in range, cluster count = seed count |
| `gSeed` | booked = walked: the seed intervals are pairwise disjoint, inside band **12,478,000–999**, and disjoint from every ledger entry |
| `gStats` | stats base at/above **110,400**, on the 200 grid, clear of every published base |
| `gEnvClean` | whitelist-or-refuse held and no override was set (a PREFLIGHT may never write a canonical path) |
| `gHashEnvelope` | ⭐ the hashed body carries **no invocation context**; the digest re-derives from the written file; a **second invocation to another path** with another envelope re-derives the identical stripped digest (cross-`OUT` acceptance) |
| `gN` | N is the rule's output, the precision term comes from the **committed sizing artifact**, and the battery ran at N |
| `gMutants` | every conjunct of every gate has a mutant, and every mutant is `live` |

**N RULE (frozen):** `N* = min( max( ceil(300 / rarestScoredCellPerMatch), 60 ), floor(0.5 h /
(msPerMatch × 2 arms)), 200 )`; the rarest scored cell is the **ABANDON** (read #4). The
`rarestPerMatch` and `msPerMatch` terms come from the COMMITTED SIZING ARTIFACT
(`data/cb-aftermath-polish-sizing.json`), never from the battery's own clock — so N, and
therefore the whole hashed body, re-derives on another machine.

**FORKS.** `F-CBA-a`: an identity gate is RED ⇒ the round is void and the fixes revert.
`F-CBA-b`: the gates are green but the derived lifetime moves the who-wins census against the
knocker ⇒ REPORT to the pricing model (CB-T2 numbers stale) and hand the fork up, do not tune.

---

## §SEED — the ledger (#163, booked = walked)

Band **12,478,000–12,478,999** (ruling #272.4(b): polish). Every interval below is walked exactly
as booked and asserted in-probe.

| interval | use |
| --- | --- |
| 12,478,000–011 | identity: 12 virgin seeds × 2 world shapes (both arms) |
| 12,478,100–104 | the sizing smoke (committed artifact) |
| 12,478,200 – 12,478,199+N | the armed battery (both arms, paired) |
| 12,478,999 | the determinism anchor / world receipt seed |

Stats: **110,400** (step 200). Consumed elsewhere and disjoint by assertion: CB-C0
12,470,000–471,799 · CB-T0 12,472,000–999 · CB-T1 12,473,000–999 · CB-T2 12,474,000–477,999 (its
row-0, seat and battery blocks) · R-甲 12,476,000–006 · R-乙 12,477,000–999.

---

## §NON-CLAIMS

No perception latency (fix ② is THE DOCTRINE's mechanism and an OPEN USER GATE — not started
here). No defender-side change of any kind. No new mechanism, no new door, no new gene. No
tempo, churn or aesthetic claim: this round says only that the world now delivers the form CB-T2
priced. ⚠ **CB-T1/CB-T2 armed-world numbers become STALE on landing** (#272.4(a)) — this doc does
not restate them.

---

<a id="result"></a>

## §RESULT

Probe [`../../scripts/probes/cb-aftermath-polish.ts`](../../scripts/probes/cb-aftermath-polish.ts).
Artifacts: [`data/cb-aftermath-polish.json`](data/cb-aftermath-polish.json) (`resultSha256`
`b2897144…`) over the two arm artifacts
[`…-pre.json`](data/cb-aftermath-polish-pre.json) (`30c7cafa…`) and
[`…-post.json`](data/cb-aftermath-polish-post.json) (`dc9181b8…`), sized by the committed
[`…-sizing.json`](data/cb-aftermath-polish-sizing.json) (`ffe30a09…`). **N = 188 matches per arm**
(the N rule's own output: `ceil(300/1.6) = 188` ↑60, wall 5,725, cap 200), same seeds both arms,
**3,843 knocks PRE · 4,420 knocks POST**, 0 unarmed knocks. Every number below is quoted from the
combine artifact.

### ⭐ THE A/B — the aftermath, pre-fix vs post-fix, same armed world, same seeds

| # | quantity | PRE | POST | Δ (95 % cluster-bootstrap CI) |
| --- | --- | ---: | ---: | ---: |
| 1 | label-switch lag, **median ticks** | **10** | **1** | **−9** [−9, −9] |
| 1b | share of knocks paying **> 1 tick** | 100.0 % (3,548/3,548) | **0.0 %** (0/4,414) | −1.000 [−1.000, −1.000] |
| 2 | ⭐ **back-half regather rate** | 26.19 % | **49.86 %** | **+23.67 pp** [+19.42, +28.11] |
| 3 | **overall regather rate** | 57.22 % | **76.18 %** | **+18.96 pp** [+16.70, +21.19] |
| 4 | **mid-race abandons** | 350 / 3,843 = **9.11 %** | 7 / 4,420 = **0.16 %** | **−8.95 pp** [−9.92, −7.95] |
| 5 | unresolved at the arm's **own** marker expiry | 16.60 % | **0.34 %** | −16.26 pp [−17.65, −14.92] |
| 5b | unresolved at the **fixed 1.6 s** yardstick | 16.60 % | **7.26 %** | −9.34 pp [−10.75, −7.95] |
| R1 | ⚠ defender reaction (the untouched control), median ticks | 11 | 11 | **0** [−2, +2] |
| R2 | marker lifetime, median s | 1.600 (flat) | **2.031** | +0.431 [+0.419, +0.443] |
| — | knocker's regather time, median s | 1.017 | **0.733** | −0.283 [−0.383, −0.217] |
| — | the gap he walked away from, median m | 2.033 | 1.299 | −0.734 [−1.273, −0.542] |

**The who-wins census (read 6), share of knocks:**

| winner | PRE | POST | Δ (95 % CI) |
| --- | ---: | ---: | ---: |
| the knocker | 57.22 % | **76.18 %** | +18.96 pp [+16.70, +21.19] |
| the beaten man | 7.65 % | 2.40 % | −5.25 pp [−6.14, −4.37] |
| a third defender | 22.69 % | 12.08 % | −10.61 pp [−12.32, −8.95] |
| the opposition keeper | 1.48 % | 0.66 % | −0.83 pp [−1.33, −0.37] |
| a teammate (+ his keeper) | 4.19 % + 0.68 % | 4.05 % + 0.59 % | ≈ 0 (CIs span 0) |
| out of play | 6.09 % | 4.05 % | −2.04 pp [−2.86, −1.23] |

**The world around it (REPORTED, never gated):** knocks/match **20.44 → 23.51** [+1.84, +4.31] ·
goals/match 2.239 → 2.346 (CI spans 0) · shots/match 12.09 → 11.99 (CI spans 0) · fouls/match
6.186 → 6.218 (CI spans 0) · turnovers/match (⚠ the probe's own ruler: a change of the controlling
side) 53.59 → 51.69 [−3.57, −0.21].

**The derived lifetime itself:** min **0.683 s** · q1 1.804 · median **2.031 s** · q3 2.177 · max
**2.556 s** (4,420 knocks) — ⭐ it is not "1.6 made longer": the law both **shortens** the marker
for a short knock at walking pace and **lengthens** it for a hard knock the knocker must turn
around for. PRE is the flat 1.600 on all 3,843.

### The gates

| gate | verdict | receipt |
| --- | --- | --- |
| `gDet` | ✅ | both arms re-derived the anchor-seed walk (12,478,999) bit-identically on an independent second pass; the two arms' anchor digests differ (the fixes bite) |
| `gIdentity` | ✅ | ⭐ **24/24 flags-off trajectory digests identical between the arms** — 12 virgin seeds (12,478,000–011) × **both world shapes** (bare production · the a4 substrate), each a whole-match trajectory sampled every 30 ticks over ball + 12 bodies |
| `xFpProd` | ✅ | the production fingerprint re-derives in **both** arms: 3 League seeds × 2 seasons headless, all 3 equal to the frozen baselines (`57b0bdab…` on seed 1337) |
| `gProdUntouched` | ✅ | `performDribbleTouch`'s body sha identical across arms (`55827a25…`) and still writing the flat `+ 1.6`; `Match`'s marker expiry and the brain's chase branch unmoved |
| `gScope` | ✅ | exactly two `dribbleTouch` write sites in `src/**`, one per named function, none unclassified; the knock-and-go reset written **exactly once**, inside `performTouchPast` |
| `gArmsDistinct` | ✅ | PRE carries the fix-ABSENT src fingerprint, POST the fix-PRESENT one; identical probe sha, seed list and armed-world flags |
| `gLifetimeLaw` | ✅ | POST: **0 / 4,420** knocks disagree with the independent re-derivation; PRE: **3,843 / 3,843** are exactly 1.600 and **none** obeys the law (the arms are genuinely different laws); non-vacuity: **3,496 distinct** lifetimes (to 4 dp) among 4,420 knocks, spanning **1.874 s** |
| `gKnockAndGo` | ✅ | POST: **max lag 1 tick** over 4,414 measured knocks; PRE: modal bucket `10+`, median 10 |
| `gWorld` | ✅ | both arms `cbArmedVersion === 6`, all three CB doors read back open off the built match, no engine door set |
| `gNonVac` | ✅ | knocks, back-half knocks and lag samples non-empty in both arms; the defect existed pre-fix (350 abandons); 0 unarmed knocks |
| `gBoot` | ✅ | ONE shared 2000 × 188 resample matrix, indices in range, clusters = the walked seeds in both arms |
| `gSeed` | ✅ | booked = walked: 12,478,000–011 · 100–104 · 200–387 · 999, pairwise disjoint, inside the band, disjoint from the ledger |
| `gStats` | ✅ | base **110,400** ≥ floor, on the 200 grid, clear of every published base |
| `gEnvClean` | ✅ | no override set; whitelist-or-refuse held |
| `gHashEnvelope` | ✅ | the hashed body carries no invocation key; the digest re-derives off disk; a second invocation to another path with another envelope re-derives the identical stripped digest |
| `gN` | ✅ | N = N\* = 188, both terms taken from the committed sizing artifact |
| `gMutants` | ✅ | ⭐⭐ **57 conjuncts enumerated FROM THE GATE OBJECTS · 57 mutants · 57/57 LIVE** (each flips its own conjunct AND leaves every other conjunct of its gate unchanged — EXACTLY-ONE **enforced**, #272.3(v)) |

Test suite: **1,451/1,451 pass** (`vitest run` first showed 2 failures — `simRunner` and
`formationEvolution`, both the known 20 s **load-timeout** pattern under parallel load; re-run with
`--testTimeout=180000` both pass, 12.2 s and 160.5 s of genuine work). `tsc --noEmit` clean.

---

## §DEV — what was built, and the two instrument corrections declared

1. **Fix ① is two lines** (one statement + its comment) in `performTouchPast`: `p.decisionTimer =
   0;`. Nothing physical is written. Measured effect: the 10-tick stale label collapses to the
   engine's floor of 1 tick, on **every** knock.
2. **Fix ③ is one call** in `performTouchPast` and **one new pure export** in `carryBeat.ts`
   (`knockClaimLifetime`), which composes the banked `recoveryInterval` with the ball's own
   roll-out limit. No existing law was touched.
3. ⚠ **DECLARED DEVIATION (fix ①'s value).** The frozen design already declared it: the giveBall
   family's literal is `0.05`, the value written is `0` — the decision gate's own threshold. See
   §FIX-① for the arithmetic (4 ticks + a float boundary vs 1 tick).
4. ⚠ **INSTRUMENT CORRECTION 1 — the push the probe re-derives with.** The first build inverted
   the push out of the rounded recollect window; it now takes the engine's **own** value (the
   `cbLedger.touchPastPushMetres` delta). Strictly stronger, and it removed one of the two
   apparent law disagreements.
5. ⚠⚠ **AMENDMENT WITH RECEIPTS — `gLifetimeLaw`'s tolerance, `1e-9` → a DERIVED bound.** The
   frozen text said "≤ 1e-9". That is not achievable by an *independent* re-derivation, for a
   reason that is arithmetic rather than sloppiness: `recoveryInterval`'s turn leg is
   `acos(x)/TURN_RATE`, and a knock struck **straight along the knocker's own momentum** sits at
   `x → 1`, where `acos` is ill-conditioned — a ONE-ULP difference in `x` becomes
   `sqrt(2·ε) = 2.107e-8` rad of angle, i.e. `sqrt(2·Number.EPSILON)/TURN_RATE ≈ **3.2421e-9 s**`
   of lifetime. The tolerance is now that propagated bound, shown as arithmetic and computed in
   the probe (never typed). Receipts: **5 of 4,420** POST knocks deviate above `1e-9`; the
   **largest deviation is 3.242061e-9 s**, against the bound 3.242065e-9 — the worst case is
   exactly one ulp of the cosine, which is what the bound says it should be. ⚠ It therefore
   **saturates**: see §DOUBTS 4.
6. **The turnover ruler is the probe's own** (a change of the controlling side). Comparable across
   these two arms only — not with CB-C0's or CB-T1's spell/turnover columns.
7. **R1's reaction ruler is the STEERING one** (`desiredVel` within 60° of the ball), the finding
   of record's own test — not an action label. Its level here (median 11 ticks among defenders who
   were *not already* steering at the ball) is not the "1 tick" headline of #272.3, which pooled
   the already-aligned bodies; the two arms use the identical definition, which is all a control
   needs.
8. **The PRE arm was measured in the working tree before the fixes landed**, with the
   byte-identical probe file (the `git stash` of exactly `src/sim/carryBeat.ts` +
   `src/sim/mechanics.ts`, foreground, nothing else running). `HEAD~` of the results commit is the
   freeze commit, so the PRE build is re-creatable; `gArmsDistinct` proves which build each arm
   ran on from the artifacts alone.

---

## §DOUBTS

1. ⭐⭐ **THE PRICING MODEL MUST HEAR THIS: the knock got MUCH cheaper.** The knocker now wins
   **76.2 %** of his own races (was 57.2 %), the back-half knock **49.9 %** (was 26.2 %), and the
   opposition's share of the ball fell from 31.8 % to 15.1 %. CB-T2 priced touch-past candidates
   in the world that punished them doubly; that pricing is now **stale in the generous direction**
   — a take-on may well be UNDER-priced today. This is REPORTED, not tuned (F-CBA-b's spirit): the
   fixes only made the world deliver the form it already promised, and re-pricing is the
   commander's call, not this round's.
2. ⭐ **The A/B is of the BUNDLE, not the two fixes.** One PRE arm and one POST arm cannot say how
   much of the +19 pp regather is fix ① (he starts chasing 9 ticks earlier) and how much is fix ③
   (his claim outlives the old constant). Read 5b is the closest decomposition available: at the
   **fixed** 1.6 s yardstick — where fix ③ cannot help — unresolved races still fell 16.6 % →
   7.3 %, so fix ① alone is doing real work. A three-arm decomposition (① only) is the obvious
   next instrument question and is NOT claimed here.
3. **Knocks per match ROSE** 20.44 → 23.51. The choice seat is unchanged, so this is downstream:
   he keeps the ball more often, so he carries more, so he is offered the seat more often. It also
   means every CB-T1/CB-T2 armed-world *rate* is stale in denominator as well as numerator
   (#272.4(a) predicted the staleness; this is its size).
4. ⚠ **`gLifetimeLaw`'s derived tolerance saturates.** The observed worst case (3.242061e-9) is
   99.9999 % of the bound (3.242065e-9). The bound is the ONE-ulp propagation; a run in which the
   cosine rounds by two ulps would go RED. The correct response then is to re-derive the bound
   (`2·sqrt(2ε)/TURN_RATE`) with that receipt — **never** to widen it by hand.
5. **7 abandons survive** (0.16 %). They are not the old failure (median gap 1.30 m, i.e. inside
   ~1 m of his control reach, not 2 m away): they are races where the derived claim genuinely ran
   out. Left alone deliberately — a claim horizon that never expires is not a claim.
6. **The identity ruler is a trajectory digest, not a save-file diff.** It samples ball + 12 bodies
   every 30 ticks over whole matches on 24 world-shape cells, and the production League
   fingerprint (a real save-JSON sha) backs it up on 3 seeds × 2 seasons in both arms. A change
   that hid between samples AND left the League fingerprint intact is not excluded by construction
   — it is excluded by `performTouchPast` being unreachable without `cbTouchPast`.
7. **Nothing here touches the doctrine's own mechanism.** Fix ② (perception latency) remains an
   OPEN USER GATE. The information gap at the touch-past is no longer *negative*; it is now
   **zero** — the knocker reacts to his own knock as fast as the defenders react to it. Making it
   POSITIVE (他早就知道球去哪) is the perception contract's business, not this round's.

## §COMMANDER CORRECTIONS OF RECORD + RULINGS (#273.2, 2026-08-15)

The verify: flags-off byte-identity on ITS OWN seeds and a DIFFERENT sampling grid, deliberately
sampling the very field fix ① writes (16/16 digests); unreachability read off the source; the
lifetime law re-derived by hand with edge-case arithmetic (no pathology, ceiling ≈3.18 s); every
A/B cell re-summed exactly; exactly-one and the coverage refusal both broken on purpose and both
held; an independent re-measurement on guard seeds reproduced the collapse (lag 10→1, abandons →0).
VERDICT: PASS-WITH-FINDINGS. Adjudicated:

* **(i) MED RATIFIED — THE AIM POINT IS A CHOICE, AND IS NOW RULED ONE.** `knockClaimLifetime`
  aims the banked `recoveryInterval` at D∞, the ball's asymptotic roll-out — a point the ball
  never reaches (within the lifetime it covers 31–76 %, median 67.3 %). "Zero tuned constants" is
  true; "the knock itself defines it" overstated — the knock defines the FAMILY of aim points,
  and D∞ is the chosen member. ⭐ RULED (#273.2): **D∞ stands as the DECLARED choice of record**
  — it is the unique knock-only upper bound requiring NO new information (a fixed-point form
  reads the same quantities but adds an iterative solve for marginal tightness; any tighter aim
  must read the DEFENDERS, which is an information channel the gated perception contract owns).
  Its generosity is bounded (≤3.18 s; 7 abandons survive — a claim that never expires is not a
  claim) and is now PART OF THE PRICED WORLD: the pricing-staleness question (§7(1)) owns it.
* **(ii) MED — the amended tolerance is RELABELLED of record**: `sqrt(2·EPSILON)/TURN_RATE` is
  the ANGLE-RESOLUTION QUANTUM (the scale the 5 deviations actually land on), ≈2× the true
  one-ulp propagation `sqrt(EPSILON/2)/TURN_RATE`. The gate is real (six orders below the
  guarded quantity) and SATURATES — §DOUBTS 4's instruction stands verbatim: a two-ulp run goes
  RED and the answer is re-derivation, never hand-widening. The frozen gate table's "≤1e-9" line
  carries this section as its amendment (not retro-edited).
* **(iii) MED — the PREFLIGHT seed layout self-collides** (preflight BATTERY_BASE spans
  DET_SEED): preflight mode permanently reads gSeed RED and darkens 5 mutants, so a preflight
  cannot distinguish a real collision from the built-in one. The record run is unaffected
  (disjoint by arithmetic). FIX rides the next probe touch: preflight blocks must be laid out
  disjoint by construction.
* **(iv) LOWs recorded**: 3,496-vs-3,499 distinct lifetimes = rounding-method difference (both
  ≫ threshold) · the defender-reaction "control" is population-dependent (the source diff is the
  conclusive evidence; the median is corroboration only) · the suite headline reads of record as
  **1,450 + 1 load-sensitive timeout** (formationEvolution passes alone at 151–160 s vs its
  180 s budget; margin ~11 %, machine-state-dependent) · ⚠ the v6 play-test world's BEHAVIOUR
  HAS MOVED (intended — the armed path is the fix's scope): the user's next play verdict reads
  the polished world.
* **(v) The §7 doubts RULED**: (1) the knock is now much cheaper (opposition race share
  31.8 %→15.1 %; regather 76.2 %; back-half 49.9 %) — REPORTED to the pricing question, nothing
  tuned; ⭐ CB-T1/CB-T2's armed-world numbers are STALE OF RECORD (rates AND denominators); the
  post-polish gap-table epoch is the current armed-world reference. (2) the bundle A/B stands
  with the fixed-1.6 s yardstick as the honest partial decomposition (fix ① alone: 16.6→7.3 %
  unresolved); a three-arm decomposition is a NAMED instrument option, not queued. (3)
  knocks/match 20.4→23.5 = downstream of retention, noted. (7) ⭐ the information gap at the
  touch-past is now ZERO (was negative); POSITIVE is the perception contract — the user gate.
