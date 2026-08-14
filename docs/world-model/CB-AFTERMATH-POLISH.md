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

*(pending — the battery is read after this freeze commit)*
