# C7 — The Release Wind-up (design contract, commander-owned)

Status: **DESIGN CONTRACT, drafted 2026-07-29.** Authority: the C-track
template (#29.4: map before contract —
[`C7-PHASE0-CODE-MAP.md`](C7-PHASE0-CODE-MAP.md), read in full) · #29.2
(median spell 0.33 s; tempo is a substrate property; "the lever is C7/C6,
not the chooser") · **#54.4 (C7 is the named PAYOFF-SIDE lever for the hold
economics; the single C5 re-census runs after C7's first slice)** · #54.5
(the map this contract stands on) · #12 (no touch-cost re-entry) · #31.1 ·
#32.1 · #38.1 · #20 · #24 · #26.5 · Road B (nothing ships; probes only).
Stages pre-register individually (executor drafts, commander reviews).

---

## 1. The measured case (the map's sentence, adopted)

Release is a single synchronous statement: the brain's decision IS the kick
(`PlayerBrain.ts:922-978` → `kickBall`, `Match.ts:1320-1336`, same tick).
**There is no tick in which a kick is committed but unstruck, so nothing in
football that lives in that interval exists here**: no charge-down, no
hurried-versus-set strike, no cost to shooting off balance beyond the
orientation prices, no reason a composed body releases better than a rushed
one — and therefore no payoff channel through which waiting could ever pay
(C5 T1's finding, seen from the release side). Meanwhile the engine already
runs the exact missing shape on the reception side: `pendingControl`
(`Match.ts:2698-2725`) holds a body committed-but-unresolved for 3 ticks
and can still fail. **C7 mirrors a running machine onto the release side.**

## 2. What already exists (reused, not rebuilt — and the double-charge ban)

* **The orientation prices are complete and stay untouched**:
  `kickMisalignment` → `orientationPowerMul` (−22% power, technique
  recovers) and `orientationNoiseMul` (aim spray) already take the
  accuracy+power half of being twisted, on every path (`mechanics.ts:78-88`).
  ⚠️ The map's one live hazard, adopted as a hard ban: **C7 prices the TIME
  half only.** No new accuracy, power or noise term enters anywhere.
* **The attack surface exists and is ball-keyed** (`tryTackles`,
  `dist(o.pos, ball.pos) < 1.15`): during a wind-up the ball is still owned
  and still sits at the carry offset, so a defender who reaches it inside
  the window robs the shooter through the EXISTING channel. The C6 lesson
  repeats: C7 builds no attack.
* **`KICK_COOLDOWN` 0.45 s is POST-release** and is not re-tasked; the
  restart run-up (banked play-report fix), `firstTouchWindow`/`oneTouchMul`,
  `executedPassPower`, curl/spin, C4's flight machinery, `heading`/
  `TURN_RATE` — all untouchable per map §6.

## 3. The map's seven questions, RULED

* **Q1 — which family is v1? THE SHOT.** Lowest volume (bounded
  watchability), the most football-real interruption semantics (charge-downs
  are everyday football), and the clearest payoff linkage (#54.4: composed
  vs rushed release). **Pass wind-up is explicitly a FUTURE contract** — it
  shifts every possession beat (the map's scale caution: the widest blast
  radius of the three time-seats) and owes the §2 band a dedicated
  obligation. The cross flight-profile seat stays where #37.3 registered
  it — C4-family, not this contract.
* **Q2 — TIME, INTERRUPTIBILITY, or both? BOTH — but interruptibility is
  FREE.** The wind-up is a committed window during which the ball remains
  owned at its carry offset; interruption = the existing ball-keyed tackle
  reaching it. No new mechanic, no new loose-ball channel (a won tackle is
  an existing release channel). The charge-down EMERGES from time ×
  geometry × the existing attack.
* **Q3 — orientation without double-charging?** By construction: the strike
  executes at `readyTick` with the EXISTING math evaluated AT STRIKE TIME.
  The heading integrator keeps running during the window, so a body that
  had time arrives at the strike better aligned and pays LESS of the
  existing misalignment price — time converts to quality through prices
  that already exist. C7 adds the delay; the substrate does the rest.
* **Q4 — the C5 linkage**: this is #54.4's payoff-side lever, named. After
  C7 v1 lands (or is refuted), the SINGLE C5 re-census runs over the
  jointly enriched world (C6's cost side + C7's payoff side), H1
  re-powered, all #29.1 repairs.
* **Q5 — C4 flight-profile**: registered C7-family by #37.3, but it is a
  DELIVERY-shape choice, not a release-time seat; it stays in C4's file.
* **Q6 — charge-down loose-ball budget**: zero new channels by
  construction (I3); the scramble battery binds at T2 regardless.
* **Q7 — watchability**: v1 = shots only (a handful per match), wind-ups of
  tenths of a second that read as drama (a blocked shot, a hurried snap
  shot), not lag. The map's scale caution (a wind-up < 0.15 s is invisible
  to the chooser) is ACCEPTED for v1: **the wind-up is physics, not a
  choice** — no brain reads it, no chooser prices it; selection sees
  outcomes. The choice layer (shoot-early-vs-set) is a future seat and
  needs C5-family machinery.

## 4. v1 — THE SHOT WIND-UP (`pendingKick`)

### 4.1 The seat

When the brain commits to a shot, instead of the synchronous strike the
body enters **`pendingKick`** — the mirror of `pendingControl`:

```text
commit (the switch, PlayerBrain.ts:922+)
  → pendingKick = { gid, target, readyTick = stepCount + W_ticks }
  → the body is committed for the window (cannot re-decide, mirror of
    CONTACT_COMMIT_TIME); the ball stays OWNED at its carry offset
readyTick reached, still owned, not stunned/sent off
  → the strike executes EXACTLY as today: same perform* math, same
    kickMisalignment/orientation prices READ AT STRIKE TIME, same
    keeper diveDifficulty frozen at the strike instant
window interrupted (tackle wins the ball / carrier stunned / sent off /
phase leaves playing)
  → no strike; the interruption resolves through its EXISTING channel;
    counted in a named class
```

### 4.2 The W law (shape fixed here; constants frozen at T1 from T0 data)

```text
W(|v|, |ω|, tech) = clamp( W_BASE + W_MOVE·(|v|/V_REF) + W_TURN·(|ω|/TURN_RATE)
                            − W_TECH·(tech − t̄),  W_FLOOR, W_CAP )
```

* Setting a strike takes longer on the move and mid-turn; technique buys
  it back (mean-centered on the population mean, the C6 T1 convention, so
  the mean body's W is the headline constant).
* **Inputs: the body's OWN kinematics and OWN attributes. No opponent
  input** — a "hurry because pressured" term would be an omniscient
  auto-reflex (the ShieldHold genre); pressure effects EMERGE because real
  defenders really arrive during real windows.
* Expected scale from the map's anchors: W in the low tenths of a second
  (several ticks to ~a decision tick), floor > 0 (no free instant strikes),
  cap well under the 0.33 s median spell. T0's counterfactual arithmetic
  sizes it; T1 freezes the numbers with derivations.
* No randomness in W (the noise half of craft already lives in the
  orientation/curl prices at strike time).

### 4.3 What v1 intends (measured, not asserted)

1. A real charge-down/robbery rate on shots (from ~0 today), sized by T0's
   arithmetic before T1 gates on it.
2. Strike quality responds to TIME through the existing prices: θ at
   strike < θ at commit for bodies left alone (the heading integrator's
   work), so composed shots pay less misalignment — the #54.4 payoff
   channel, measurable as the misalignment-price delta at strike.
3. Rushed, twisted, on-the-run shooting becomes honestly worse-or-robbed
   without one new price being written.

## 5. Design invariants (frozen)

```text
I1  TIME ONLY. No new accuracy/power/noise term anywhere; the existing
    orientation/curl/keeper math is EVALUATED AT STRIKE TIME, never
    duplicated (map §3's hazard, adopted as a ban).
I2  NO OPPONENT INPUT in W's law.
I3  NO NEW ATTACK SURFACE and NO NEW LOOSE-BALL CHANNEL: interruption =
    existing ball-keyed tackles + existing world events; a structural
    gate asserts the seam never releases ownership itself.
I4  Flag `c7Windup`, default OFF, bit-identical when off (the synchronous
    strike verbatim); fingerprint unchanged.
I5  KICK_COOLDOWN (post-release), firstTouchWindow/oneTouchMul, the
    restart run-up, executedPassPower, curl/spin, C4 flight machinery,
    heading/TURN_RATE: untouched (map §6's list, verbatim).
I6  The keeper reads the strike instant, exactly as today (keeper
    anticipation during wind-ups is a perception-layer seat, not v1).
I7  `pendingControl` (reception) untouched — the mirror, never the seat.
I8  No new gene, no new attribute; existing attrs only.
I9  SHOTS ONLY in v1. Pass/cross wind-ups are future contracts with their
    own §2 obligations.
```

## 6. Stages

* **T0 — SHOT-RELEASE CENSUS** (read-only, zero `src/**`): shots per match
  by path; body state at commit (|v|, |ω|, misalignment θ, nearest-defender
  distance and closing speed); counterfactual arithmetic on recorded
  states for candidate W laws — (i) charge-down exposure: how many shots
  would have a defender able to reach the ball inside W; (ii) quality
  head-room: how much θ decays in W at TURN_RATE. Floors per #24 from a
  disclosed sizing smoke (#44.5), smoke seeds disjoint from the census
  block (#46.2's law).
* **T1 — `pendingKick`, dormant**: implement §4.1-4.2; X-family verbatim
  (OFF bit-identical; single-seam test; seam-never-releases-ownership);
  paired same-seed forks at shot commits; two priced axes, never conflated
  (the #47.5(i) convention): (1) interruption rate inside W (expected UP
  from ~0, band from T0's arithmetic), (2) the misalignment price paid at
  strike falls for uninterrupted shots (band from T0's θ-decay
  arithmetic); shot-outcome economy REPORTED; fidelity ledger with the
  standing classes incl. E-INJURY, per-record receipts (#49.3's
  convention), unexplained exactly 0; fork window pinned ex ante (#48.4's
  lesson).
* **T2 — MATCH-LEVEL A/B**: the C6 T2 battery VERBATIM (the house
  deployment battery: scramble limbs, offside/box/restart canaries, §2
  band, PC-instruments as applicable) + the shot economy (shots, goals,
  conversion — the §2 goals band already binds ±15%; C4's I2
  conversion-ceiling doctrine noted: MORE goals is not the deliverable).
* **T3 — not a C7 stage**: on T2's verdict, **the #54.4 C5 re-census
  decision returns to the commander** — one census over the C6+C7
  enriched world.

## 7. Gate sources

#20 · #24 (attainable floors — four catches this programme; derive from
T0's measured populations) · #26.5 (population law; runs state their HEAD)
· #29.5/#44.5 (sizing before freeze; population-touching disclosures need
sign-off) · #32.1 (no coupon-collector) · #38.1 (exception boilerplate +
full sign space) · #46.2 (smoke/census seed disjointness) · #48.4 (pin
fork windows ex ante) · #49.3 (event-keyed exception classes + receipts) ·
PROBE-CONTRACTS (six threshold types).

## 8. Stop rules

Any X-family/fidelity/structural gate fails ⇒ FAIL, queue stops at the
commander. Any T2 watchability limb or canary fires ⇒ stop outright. No
re-cutting after sight: not W's constants, not the bands, not the floors,
not the readings. Nothing ships (Road B): `c7Windup` off in every
production path throughout; T2 ends with a verdict, never a default-ON.
If T0 finds the shot population too thin to power T1 (#24), the fork
returns to the commander before T1 is drafted.

## 9. Registered non-claims

C7 v1 makes no claim about passes, crosses, headers, clearances or keeper
distribution (each keeps today's synchronous release). No shoot-early-vs-
set CHOICE is added — the wind-up is physics; the choice seat is a future
C5-family slice. No keeper anticipation. No claim that holding now pays —
that is exactly what the post-C7 C5 re-census MEASURES (#54.4), and
pre-judging it would be the E5h ×1.3 hazard in a time costume. The
estimand boundary, stated once: **C7 prices the TIME a strike takes; it
does not price where the ball goes** — every downstream quality effect
must arrive through prices that already exist.
