# C4 Phase 0 — Code map: cross, header, and who is actually in the box

Status: **READ-ONLY REPORT-BACK.** Produced under **commander ruling #26.4**
(C-track template: Phase-0 code-map with `file:line` evidence first). **Zero
code changed, zero probes run.** T0 can pre-register on this map; nothing here
proposes a mechanic.

Date: 2026-07-27

---

## 0. The one-sentence finding

**The delivery is a well-built pass to a named man; the aerial contest is a
one-tick radius lottery; and the arrival is one licensed body aimed at the
wrong place for a cross.** The `~50% noAerial` number is not a bug in the
crossing code — it is the arithmetic consequence of a **1.35 m** contest radius
(`constants.ts:182`) meeting a box that the run system was never asked to fill.

---

## 1. The delivery: `performCross` — the healthiest part of the chain

`mechanics.ts:552–595`. It is a real cross, not a hoof:

- **Aim point** — leads the target's run by `CROSS_LEAD_FRAC` 0.4 of flight,
  capped at `CROSS_LEAD_MAX` 3.5 m (`563–569`, `constants.ts:164–165`), then
  pulls **18%** toward goal (`579`; `0.25` was tried and fed the keeper — the
  comment at `572–574` records it).
- **Shape** — an inswinger: sign from the chord × to-goal cross product, whip
  scaled by `passing` (`585–588`), flown by `loftKick` with pre-compensated
  landing (`589`).
- **Price** — `oneTouch` read at `580` and charged through `oneTouchMul`; a
  corner routine's key zone can override the aim entirely (`at`, `570`).

**Who it aims at** — `PlayerBrain.ts:511–533`. Candidates must be inside the
box channel (`mLocalX >= 16 && |y| <= 13`, `514`), scored by
`aerialSense·0.6 + openness·0.4 + advancement·0.25` (`516–518`), with an
offside kill at `×0.12` (`527`).

⚠️ **Note what that scorer contains and what it does not**: it ranks *the
bodies that are already there*. It has no term for whether anyone is there at
all, and nothing anywhere makes bodies go there **because** a cross is coming.
The delivery is chosen after the box population is fixed.

---

## 2. The contest: `tryAerial` — a one-tick radius lottery

`mechanics.ts:741–…`, called from `Match.ts:1383`.

**Gate 1 — height.** `743`: the ball must be inside `HEADER_MIN_HEIGHT` 1.35 m
→ `GK_CLAIM_HEIGHT` 2.55 m (`constants.ts:179/198`), and outfield contests need
`z <= HEADER_MAX_HEIGHT` 2.5 m (`778`).

**Gate 2 — the keeper claims first.** `745–776`: any keeper inside his own box
within **1.9 m** rolls `pClaim = 0.62 + (reflexes − 0.5)·0.5 − crowd·0.3`,
clamped 0.2–0.9. Wins ⇒ he has the ball, the contest never happens.

**Gate 3 — the chest trap pre-empts.** `781` `tryChestTrap` — an unpressured
man under a dropping ball takes it down instead of heading it.

**The contest itself** — `785–812`:

```ts
if (d2 > HEADER_RADIUS * HEADER_RADIUS) continue;   // 1.35 m, constants.ts:182
s = aerialSense(p) + attacking + (1 − d/HEADER_RADIUS)·0.35 + rng(0, 0.45)
```

where `attacking` = **0.3** if the ball is inside the attacking box
(`802`) — the running-jump edge, raised 0.12 → 0.2 → 0.3 across phases 29.1/31
with the reasons in-comment (`794–801`).

⭐ **Three structural facts fall out of those four lines, and they are the C4
seat:**

1. **The contest is instantaneous.** There is no jump, no takeoff, no airtime,
   no body position — one tick, one score, one winner. `stunTimer`,
   `kickCooldown` and GK/sent-off filter the field (`786`); nothing else about
   the bodies matters except `aerialSense`, distance, and a uniform random.
2. **`rng(0, 0.45)` is the largest single term** for evenly matched players.
   `aerialSense` spans roughly one unit, the distance term 0.35, the attacking
   bonus 0.3 — the die is comparable to all of them.
3. **1.35 m is the whole box.** A delivery that lands 2 m from the nearest body
   is contested by nobody, whatever else is true. That is what `noAerial`
   counts.

`headersWon` is incremented at `mechanics.ts:853`, i.e. **only when someone
actually wins a header** — so the probe's `noAerial` is honestly "no header by
either side within 4 s", not "the cross was bad".

---

## 3. The arrival: one licensed body, aimed at the arc

This is the thinnest link, and it is thin by construction rather than by bug.

**Who gets a run** — `TeamBrain.ts:185–197`:

```ts
count = (mode === CounterAttack || tempo > 0.65 ? 2 : 1) + (urgency > 0.65 ? 1 : 0)
```

ranked by `RUN_ROLE_W[role] + localX/45`. **So open play licenses one to three
runners, and none of them is licensed *by* a cross.**

**The arriver** — `TeamBrain.ts:205–218`: when the ball is in the wide
attacking channel (`ballLocalX > HALF_L − 21 && |ballPos.y| > 10`), **one**
body — the MF, or the weak-side winger if the MF is unavailable — is licensed.

**And here is the mismatch that matters for C4** —
`actionExecutor.ts:351–355`:

```ts
} else if (team.arriver === p.index) {
  target = ... : v2((HALF_L - 16) * team.attackDir, clamp(p.pos.y * 0.3, -7, 7));
}
```

**The open-play arriver runs to the edge-of-box arc, 16 m from goal.** That is
the *cutback* target — Phase 31 built it for the byline pull-back, and it says
so (`TeamBrain.ts:200–204`). A cross delivered with an 18% goal-pull drops
**nearer the penalty spot** (`PENALTY_SPOT_DIST = BOX_DEPTH·0.72`,
`constants.ts:214`). **The one late body a wide ball licenses is aimed at a
different zone from the one a cross lands in.**

**Everyone else** — `actionExecutor.ts:365` → `runTarget`
(`formations.ts:490–504`): a run *in behind* the defensive line
(`line + 7`), narrowing to `y·0.6`. Non-runners hold `supportSpot`
(`formations.ts:546–560`), which sits at `ball.pos + attackDir·radius·aheadBias`
— **relative to the ball, 10–18 m out**, so on a wide ball the support
structure is drawn *toward the touchline*, not into the six-yard box.

⭐ **Only the corner path fills a box on purpose.** `TeamBrain.ts:159–168`
licenses **3 crashers** (2 for short/arc routines) ranked by
`aerialSense − dist(flag)/45`, and `actionExecutor.ts:304–349` routes them to
`cornerCrashSpots`, re-routes the closest one onto the true parabola landing
(`320–338`), and **holds them 4.5 m off the spot until the taker steps up**
(`345–349`) so the crash is a timed burst rather than a static box. **Open play
has no equivalent of any of that** — no crash count, no landing re-route, no
timing.

That asymmetry is the single most actionable thing on this map: **the engine
already knows how to fill a box on a delivery; it only does it for corners.**

---

## 4. The banked history, and why it constrains the design

`ROADMAP.md:1246–1306` records **two honest reverts** at exactly this seat, and
they narrow the option space sharply:

- **Cut 1** — `supportSpot` rewritten as a gene-weighted openness scorer. The
  box got **emptier** (`noAerial` 46→50% / 54→59%) and §2 regressed. Recorded
  lesson: *"the box is a LOW-openness contested zone, so the scorer AVOIDS
  it"*.
- **Cut 2** — the two-eye (space + ball) field. Same signature, and the tell
  was **offsides +50%** (2.20→3.36): bodies did try to attack the box and
  arrived **uncoordinated with the delivery**.
- ⭐ **The under-weighted datum** (`ROADMAP.md:1288–1291`): a **balanced** team
  already fills the box fine — `noAerial` **26%**, `atkHeader` **33%**. So box
  arrival is **not universally broken**; the 46–54% figure belongs to
  cross-spam and to the extreme WIDE archetype.
- And the honest ceiling (`1292–1300`): cross→goal ≈5% here versus **1–2% in
  real football**, so *"make crosses out-score central carry" is the wrong
  goal*.

**Reading those three together**: the failure is not that crosses are
underpowered, it is that **delivery and arrival are on different clocks** —
which is the same disease shape E5g named for the overlap file, in a different
part of the pitch.

---

## 5. The existing instruments (no new probe needed to start)

| probe | what it reports |
| --- | --- |
| `scripts/probes/cross-anatomy.ts` | the canonical `noAerial` number: a 4 s window opened on each `stats.crosses` increment, closed into `atkHeader` / `defHeader` / `noHeader` by `headersWon` deltas (`77–108`), plus shot, goal and retention. 250 matches × 3 defensive shells |
| `scripts/probes/aerial-anatomy.ts` | the contest itself |
| `scripts/probes/cutback-anatomy.ts` | the arc route: 20%→shot, 5.3% goal, 35% die in flight |

⚠️ **A definitional caveat worth carrying into T0**: `cross-anatomy` attributes
by `headersWon` deltas inside 4 s, so a delivery **chested down** (`781`) or
controlled on the ground counts as `noAerial` even though a body met it. The
number is "no header", not "no arrival" — and for a C4 contract that difference
is load-bearing.

---

## 6. What a C4 contract has to decide (questions, not answers)

1. **Which link is C4?** Delivery (§1, healthy), contest (§2, a one-tick
   lottery), or arrival (§3, one body at the wrong radius)? The registered row
   says the duel model "has nothing to contest" without arrivals, which
   sequences arrival first — but arrival has been attempted twice and reverted
   twice, and the contest has never been touched.
2. **Does the corner machinery generalize?** §3's asymmetry says the engine can
   already time a multi-body crash onto a real landing point. Open play differs
   in that the delivery is not yet committed when the run must start — which is
   exactly what broke Cut 2 (offsides +50%).
3. **Is 1.35 m the substrate defect?** A radius that small makes the contest
   binary on delivery accuracy. Widening it is a tuning knob and would be
   suspect; giving the contest *time* (approach, jump, airtime) is a substrate
   change of the same family as C5/C7's — and would let a body that is 2 m away
   at ball-arrival still be in the duel.
4. **What is `attacking = 0.3` really?** It is a hand-set momentum bonus
   standing in for a body that has actually run onto the ball. If arrival
   becomes real, this term is the thing it should replace.
5. **What must NOT move**: cross→goal ≈5% is already generous against real
   football's 1–2%. Any C4 gate that rewards a higher conversion is aimed the
   wrong way; the honest targets are `noAerial`, `atkHeader`, and whether the
   *variance* of wide play changes — not its mean yield.
6. **The `noAerial` instrument itself** — per §5, it should probably be split
   into "nobody arrived" versus "someone arrived and did not head it" before it
   gates anything.

---

## 7. What this report did not do

- No code changed, no test added, no probe run, no flag touched.
- It does not price anything, propose a mechanic, or rank §6.
- C5's map (`C5-PHASE0-CODE-MAP.md`) is its sibling; the two share the
  ball-foot/ball-body time question but are separate contracts.
- F9 (kick animation, render-only) remains untouched and available at any time
  per #26.4.
