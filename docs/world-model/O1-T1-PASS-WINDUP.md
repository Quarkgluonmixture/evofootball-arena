# O1 T1 — the DORMANT shortPass wind-up seam (`pendingPassWindup`)

Status: **PRE-REGISTERED 2026-08-08, then BUILT + RUN the same round.** The
mechanism spec, the gates, the seed ledger and the Road B statement below were
written **before** a line of the seam existed and before the smoke ran (the
frozen-before-sight rule, the C7-T1 two-part form); the measured numbers arrive
only in [§RESULT](#result--the-gates-run) at the foot.

Authority chain: **contract [`OUTLET-CONTRACT.md`](OUTLET-CONTRACT.md) §2 O1**
(the slice), **§3 invariants** — I1 NO FREE TIME · **NO DOUBLE-CHARGE** (O1
prices TIME only) · **FLAG HYGIENE** (explicit boolean, never
`EDS_BUNDLE_ARMED`, own League key) · **EPISTEMIC HONESTY** (percepts only; the
law reads the body itself) · Road B until a play-test verdict · **ruling #178.3**
(cut-1 FROZEN = shortPass only, the `performPass` commit statement
`PlayerBrain.ts:975`, the cutback statement `:972` EXCLUDED and shown untouched,
the one-touch window as the DESIGNED bypass, the corrected NO-TOUCH list binds,
a NEW explicit `o1PassWindup`) · **ruling #178.4 / #179.2** (this step's scope,
binding in every detail: duration = the C7 §LAW constants verbatim with
**tech = `attrs.passing`**, the one DESIGNED deviation; interruptibility +
re-decide lock transferred; kickoff/restart passes excluded; gates = the C7-T1
form; seeds from 12,302,000+) · **ruling #179.1** (self-drive on the O1 arc; the
#159 red lines bind — any pre-named FAIL, non-PASS verify after one fix round or
contract ambiguity STOPS to the user).

Banked data this stage stands on (committed, SHA'd):
[`O1-PHASE0-PASS-RELEASE.md`](O1-PHASE0-PASS-RELEASE.md) — the corrected
pass-release code map (§P1.1–P1.7) and the 2,000-match census (§P2.11), plus the
certified C7 family ([`C7-T1-PENDINGKICK.md`](C7-T1-PENDINGKICK.md) §LAW/§SEAM,
the template for every form below).

Code truth verified at HEAD `ae27087` (the phase-0 map's citations re-checked;
no drift): the shortPass commit is **`PlayerBrain.ts:969-976`** (`case 'Pass'`,
`performPass` at **975**; the cutback branch `performCutback` at **972**); the
kickoff pass is **`PlayerBrain.ts:160`** (off-switch, `match.performPass(p,
back)` then `return`); `mustKick = match.restartKickGid === p.gid`
(**`PlayerBrain.ts:95`**); `offsideExemptKick` (**`:198`**); `performPass`
**`Match.ts:1418` → `mechanics.ts:354`**, its single `kickBall` at
**`mechanics.ts:403`**; `kickBall` **`Match.ts:1583`** (`ball.owner = null`
1586, `kickCooldown = KICK_COOLDOWN` 1594, `firstTouchWindow = 0` 1595); the C7
machinery — `c7WindupTicks` **`Match.ts:137-153`**, the `pendingKick` slot
**`Match.ts:564`**, the per-step resolve call **`Match.ts:1136-1139`**,
`armPendingKick` **`Match.ts:1828-1849`**, `resolvePendingKick`
**`Match.ts:1861-1874`**, the C7 arm point **`PlayerBrain.ts:1011-1019`**, the
re-decide lock **`PlayerBrain.ts:38-48`**, the executor plant
**`actionExecutor.ts:1071-1084`**; `oneTouchMul` **`mechanics.ts:263-264`**
(consumed for shortPass at **391**); the shared price chain
**`mechanics.ts:78/83/88`** — *the pass family passes `passing` as `tec`, the
shot family `dribbling`* (`mechanics.ts:364/392` vs `1259/1268`);
`KICK_COOLDOWN = 0.45` (`constants.ts:282`, the ONE stamp site
`Match.ts:1594`, uniform across all nine kinds — the ruling #177 correction);
`TURN_RATE = 6.5` (`Player.ts:17`); `DT = 1/60` (`constants.ts:55`);
`firstTouchWindow` decay `Player.ts:369`, the 0.28 s grant `Match.ts:1725`.

---

## §LAW — the duration law, with its ONE designed deviation

The C7 §LAW is carried **verbatim, same constants, same clamp**:

```text
W(|v|, |ω|, tech) = clamp( W_BASE + W_MOVE·(|v| / V_REF)
                            + W_TURN·(|ω| / TURN_RATE)
                            − W_TECH·(tech − t̄),  W_FLOOR, W_CAP )   seconds
W_ticks   = clamp( round(W · 60),  3, 11 )      (DT = 1/60; whole ticks)
readyTick = commitTick + W_ticks                (no randomness anywhere)
```

`W_BASE 0.06 · W_MOVE 0.05 · W_TURN 0.05 · W_TECH 0.05 · W_FLOOR 0.05 ·
W_CAP 0.18 · V_REF 7.0 · t̄ 0.4068` — the constants already frozen and certified
in `Match.ts:137-153` (`c7WindupTicks`), **reused as the same function, not
copied**. `|v|` is the body's own speed at the commit instant; `|ω|` is read from
the **C6 heading ring** exactly as `armPendingKick` reads it (the two most-recent
recorded headings; no prior frame ⇒ ω = 0). No opponent, no percept, no
ball-context, **no rng draw** (I1/I2 carried over).

### THE ONE DESIGNED DEVIATION — `tech = attrs.passing`

C7 passes `dribbling`; **O1 passes `attrs.passing`**. This is a DESIGNED
deviation, ruled ex ante at **#178.4 / #179.2**, and it is the pass family's own
attribute on the shared price chain: `mechanics.ts:78-88`'s `tec` argument is
`passing` on every pass path (`mechanics.ts:364/392` for shortPass) and
`dribbling` on every shot path (`1259/1268`) — the asymmetry the phase-0 map
recorded at §P1.4 as *"a recorded asymmetry, not a defect"*. The wind-up is the
TIME half of the same craft the accuracy/power half already prices, so it must
read the same attribute the accuracy/power half reads. Two consequences stated
plainly so no later reader mistakes them for drift:

1. **t̄ = 0.4068 is the measured population-mean `dribbling`** (C7-T0 §5(ii)),
   not the population-mean `passing`. It is kept UNCHANGED — re-centering on a
   `passing` mean would be a new constant, i.e. a new lever, in a stage whose
   whole point is a dormant seam with the certified law transferred. The
   consequence is honest and stated: if mean `passing` ≠ 0.4068 the pass
   population's mean W is offset from the shot population's by
   `W_TECH·(passinḡ − 0.4068)` seconds, i.e. at most ±0.05·(that gap) — inside
   ±1 tick for any gap below 0.33. The realized W distribution in §RESULT
   measures where the population actually lands; **re-centering is a T2-or-later
   question, explicitly NOT taken here.**
2. **No new gene, no new attribute** — `passing` already exists and already
   prices this kick.

## §SEAM — the mechanism (all of it behind `o1PassWindup`)

### The flag

* **`o1PassWindup`**, a new **explicit** `MatchConfig` boolean, initialised
  `cfg.o1PassWindup ?? false` — a **hard `false`**, the `c7Windup` form
  (`Match.ts:996`), **never** `EDS_BUNDLE_ARMED`, never env-armed, never
  default-ON. It gets its **own** `League.matchFlags` key (the `League.ts:282`
  idiom) so a probe/play-test world can arm it explicitly, and it is documented
  in the `MatchConfig` comment block. It is **NOT** added to
  `src/game/a4World.ts` — the phase-0 map's trap 12 (a seam gated on `c7Windup`
  would arm itself in the a4 world the moment it was written) is the reason this
  flag exists at all.

### The arm site — the `performPass` commit ONLY

The single fork, on the ruling's own form, inside `case 'Pass'`'s **else** branch
(the `performPass` statement, `PlayerBrain.ts:975`):

```text
if (match.o1PassWindup && !mustKick && p.firstTouchWindow <= 0)
     match.armPendingPass(p, passMate!, offsideExemptKick);
else match.performPass(p, passMate!, offsideExemptKick);
```

* **The cutback statement (`:972`) is UNTOUCHED** — the `top === cutbackCand`
  branch keeps `match.performCutback(p, cutbackMate!)` synchronously, byte for
  byte. Proven by a named source test AND a functional no-route test.
* **The kickoff pass (`:160`) is UNTOUCHED** — it never reaches the switch, so
  it cannot route the seam by construction; proven by a named source test AND a
  functional test that a kickoff release happens with `pendingPassWindup` null.
* **Restart passes excluded** via the explicit `!mustKick` test — the phase-0
  map's trap 1 (a pass-family restart has no separate `perform*`; "excluded as
  in C7" needs the `mustKick` test, not a different door). Population excluded:
  11,214 restart + 8,119 kickoff shortPasses = **12.20% of shortPass** (census
  §P2.11(ii)).
* **No other kind is touched:** cutback, throughGround, throughChip, cross,
  loftedPass, keeperPunt, keeperThrow, clearance all keep today's synchronous
  release (cut-2 / cut-3 are staged behind this cut's evidence, #178.3).

### THE ONE-TOUCH BYPASS (the contract's DESIGNED bypass)

`p.firstTouchWindow > 0` at the commit ⇒ **the seam is not entered at all**: the
release goes through the EXISTING synchronous `performPass` on the commit line,
this tick, unchanged. The price is the EXISTING `oneTouchMul`
(`mechanics.ts:263-264`, consumed at `391`) — **no new charge anywhere**. The
corrected NO-TOUCH list (§P1.4/P1.5) binds and is restated as the seam's own
prohibition list: the seam adds **no** term for body orientation
(`kickMisalignment`/`orientationPowerMul`/`orientationNoiseMul` already own it),
**no** term for hurry (`oneTouchMul`), **no** term for pressure (`pressureAt` at
`mechanics.ts:387`), **no** term for weight/execution (`executedPassPower`),
**no** second regather charge (`KICK_COOLDOWN` 0.45 is uniform and POST-release),
**no** craft/spin term. O1 prices TIME only, and it prices it exactly once —
by moving the existing strike later, not by adding anything to it.

### Wind-up state — a PARALLEL field, and why

**`pendingPassWindup: { gid, readyTick, aim, targetGid, offsideExempt } | null`**, a
new nullable slot beside `pendingKick`, resolved by a new
`resolvePendingPassWindup()` called at the head of the tick immediately after the C7
resolve (`Match.ts:1136-1139`).

**Naming (a recorded deviation, not a design change):** the state field is
`pendingPassWindup`, **not** `pendingPass` — `Match.pendingPass` already exists
(`Match.ts:901`, the certified `PendingPass` in-flight pass/offside registry,
`{ side, passerGid, targetGid, t, offside }`, read by the offside machinery and by
a dozen committed probes). The wind-up slot therefore takes a distinct name; the
arm method keeps the ruling's own name `armPendingPass`. The shot and pass
wind-up FORMS do not collide — only that unrelated pre-existing field name did.

**The form choice, stated as the ruling requires.** A discriminated member on the
existing single `pendingKick` slot was considered and **rejected**: `pendingKick`
is `{ gid, readyTick, aim }` and is read by four certified C7 consumers (the
resolve, the executor plant `actionExecutor.ts:1079`, the re-decide lock
`PlayerBrain.ts:45`, and the C7 tests' source slices). Widening it to a union
would force a type change and a branch into every one of them — i.e. it would
edit the certified shot path to add a pass. A **parallel field keeps the C7 shot
path byte-identical in source and in behaviour** (the shot machinery is not
touched at all), and it removes the phase-0 map's trap 10 (single-slot overwrite
at pass volume) *between the families* outright: a shot wind-up and a pass
wind-up can never evict each other. Within the pass family the slot is still
single, and that is sufficient for the same reason it is for shots: **only the
ball owner can arm**, and a winding-up owner cannot re-decide while it still owns
(the lock below). The one reachable overwrite is a *stale* record whose passer
has already lost the ball — and that record's resolve would bail on the
`ball.owner !== passer` guard anyway, so the overwrite is the correct outcome,
not a lost release.

### Resolution at `readyTick`

`resolvePendingPassWindup()` mirrors `resolvePendingKick` line for line: it clears the
slot, releases the aim lock (`faceTarget = null`), and then — **only** if the
body is still a valid passer — calls the **EXISTING `performPass` math, evaluated
AT STRIKE TIME** with the passer, the mate and the `offsideExempt` flag captured
at ARM time. The pass's lead, speed, pressure spray and orientation prices are
therefore the shipped math, computed once, at the later instant, against the
body's now-integrated heading (the C7 I1 form: the shipped math relocated in
time, never duplicated, no rng added at arm).

Bail conditions (each an EXISTING channel; the seam adds no attack surface, C7
I3): `phase !== 'playing'` · `ball.owner !== passer` · `passer.sentOff` ·
`passer.stunTimer > 0` · `passer.kickCooldown > 0` (the contact-lock abort the
phase-0 map §P1.5 names) · the target body no longer resolvable. On any of them
**no pass runs** and the ball's fate is whatever the existing channel already
did.

> ⚠ **#180.3 CORRECTION, marked in place (not silently rewritten).** "the target
> body no longer resolvable" was implemented as an `undefined`-only check, which
> is too weak: a mate **sent off** or **substituted** inside the window is still
> a resolvable object (the gid is the pitch SLOT, not the man). Ruling #180.3(i)
> named it a debt; it is fixed in the O1-T2 commit as the new interruption cause
> **INT-MATE**, together with #180.3(ii) in-engine eviction accounting
> (`Match.o1WindupLedger`) and #180.3(iii) explicit double-pending precedence.
> See [`O1-T2-MATCH-AB.md`](O1-T2-MATCH-AB.md) §DEBTS. The §RESULT numbers below
> were measured on the pre-fix seam and are left exactly as they were banked.

### During the window

* **The heading integrator runs toward the aim** — `faceTarget` is set to the
  mate's position **as of the ARM instant** (the C7 form, where the aim is the
  goal at commit), so `physicsStep` rotates the heading at ≤ `TURN_RATE` and the
  strike pays LESS of the EXISTING misalignment price. No new orientation term
  (I1).
* **The body plants** — the executor gets a `pendingPassWindup` block mirroring the C7
  plant (`actionExecutor.ts:1071-1084`): movement target held on the body's own
  spot, `speedF = 0.22`, `faceTarget` driven to the aim. The ordinary "kick
  already happened → brief follow-through" `case 'Pass'` does not apply during
  the window because the kick has NOT happened yet; the plant prevents the
  P-DRIFT pathology C7 pre-laid.
* **The ball stays OWNED at its carry offset** — the seam **never writes
  `ball.owner`** and never plants the ball into flight.
* **The re-decide lock, transferred** — a body with a live `pendingPassWindup` **whose
  ball it still owns** returns from `decidePlayer` immediately (its action stays
  `{ type: 'Pass' }`). The lock lapses the instant it loses the ball, exactly as
  C7's does. This is a SECOND, separate guard block gated on `o1PassWindup` —
  the C7 lock block (`PlayerBrain.ts:38-48`) is left byte-identical.

### Untouched (restated as a prohibition)

`pendingKick` and every C7 consumer · `pendingControl` (the reception mirror) ·
`KICK_COOLDOWN` · `firstTouchWindow` / `oneTouchMul` semantics · the restart
run-up (`PlayerBrain.ts:948-965`, a zero-time re-orientation, NOT a wind-up —
do not read it as one, do not remove it) · `executedPassPower` · the C4 flight
machinery · `heading`/`TURN_RATE` semantics · the eight non-shortPass kinds ·
`a4World.ts`'s flag set.

---

## §GATES — frozen ex ante (the C7-T1 form)

| gate | predicate | kind |
| --- | --- | --- |
| **G1 X-FP-PROD** | a 2-season headless league on seed 1337, flag absent, hashes to `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` | HARD |
| **G2 FLAG-OFF BYTE-IDENTITY** | with `o1PassWindup` absent/false, the 2-season league hash on **3 league seeds** equals the pre-change HEAD `ae27087` baselines captured before implementation: **1337 → `57b0bdab…c673` · 20260728 → `c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080` · 424242 → `45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26`** | HARD |
| **G3 NON-VACUITY** | the same-seed ARMED world reaches the seam (≥ 1 wind-up) and its match signature DIFFERS from the OFF world — G2's identity is not the identity of dead code | HARD |
| **G4 SEAM SINGULARITY / NO-ROUTE** | exactly ONE `match.armPendingPass(` call in `src/**`; the cutback statement and the kickoff pass never route the seam (source AND functional proofs); no other pass kind's commit line mentions the flag | HARD |
| **G5 NO NEW CHARGE / NO RNG AT ARM** | `armPendingPass` draws **zero** `match.rng` (the rng state is unchanged across an arm) and its body contains no price term (`oneTouchMul` / `orientation*Mul` / `pressureAt` / `gaussian`) | HARD |
| **G6 SEAM NEVER RELEASES OWNERSHIP** | the ball is owned by the passer on every window tick, and the arm + plant code write `ball.owner` nowhere | HARD |
| **G7 STRIKE ONCE, AT `readyTick`** | `performPass` runs exactly once per resolved wind-up, never at commit, never twice; **zero** times for a wind-up interrupted before `readyTick` | HARD |
| **G8 W ∈ [3,11] ticks** | every realized wind-up length is a whole tick count inside the frozen clamp | HARD |
| **G9 X-DET** | the smoke's experiment core runs **twice**, byte-identical digests | HARD |
| **G10 seed disjointness** | proved in-probe: the O1-T1 smoke block is disjoint from the census block (12,300,000–12,301,999) and the phase-0 sizing smoke (12,309,900–12,309,923), and lies inside the reserved band 12,300,000–12,309,999 | HARD |
| **G11 suite + tsc** | full `npm test` green, `tsc --noEmit` clean | HARD |
| **G12 REALIZED W DISTRIBUTION** | p10/p50/p90 (and mean) of realized wind-up ticks on shortPass arms; the **realized wind-up share** of shortPass releases; the **observed one-touch bypass share**. Reference (NOT a gate): census §P2.11(iii) shortPass one-touch 20.712% ⇒ ~79.3% of shortPass releases are window-closed, and 12.20% of shortPass releases are restart/kickoff-excluded, so the expected wind-up share of ALL shortPass releases is ≈ 0.793 × 0.878 ≈ **69.6%**, and ≈ **79.3% of the OPEN-PLAY, non-restart** shortPass releases | REPORTED |
| **G13 INTERRUPTION CENSUS** | interruption rate on armed wind-ups + cause mix (INT-PHASE / INT-LOSS / INT-STUN / INT-SENTOFF / INT-COOLDOWN / E-ENDED). Reference point (NOT a gate): the C7-T1 measured shot interruption rate **3.52%**, CI [3.06%, 3.99%] | REPORTED |

**Epistemic honesty on the REPORTED pair:** G12/G13 are descriptive readings of
a dormant seam at smoke scale (~40 matches, single arm, no fork, no A/B). They
carry no CI claim beyond the counts printed, they adjudicate nothing, and a
number landing away from its reference is a **reading for the commander**, never
a licence to re-cut the law, the flag, the arm site or the bypass. The A/B (O1-T2)
is where anything gets compared.

**Pre-named FAIL ⇒ STOP** (ruling #179.1 red lines): any HARD gate failing, an
unexplained release, a structural collision between the shot and pass wind-up
forms, or any src diff outside the seam path.

## §SEED LEDGER

| item | block | status |
| --- | --- | --- |
| reserved band (this arc) | **12,300,000 – 12,309,999** | reserved in full by O1 phase-0 |
| O1 phase-0 census | 12,300,000 – 12,301,999 | **CONSUMED** (2,000 matches, #178) |
| O1 phase-0 sizing smoke | 12,309,900 – 12,309,923 | **CONSUMED** (24 matches, #177/#178) |
| **O1-T1 smoke (this stage)** | **`12,302,000 + k`, `k < 40` ⇒ 12,302,000 – 12,302,039** | **CONSUMED here** |
| free inside the band | 12,302,040 – 12,309,899 | available to O1-T2 |

12,302,000 lies strictly above the consumed census ceiling 12,301,999, strictly
below the phase-0 sizing smoke, and inside the reserved band — disjoint from
both (proved in-probe, G10). Every block below 12,300,000 is exhausted
(`TEMPO-CENSUS.md` §7.1 reserved 12,293,000–12,299,999 in full).

## §ROAD B — nothing ships

`o1PassWindup` is **OFF in every production path** through this whole stage: a
hard `false` default, absent from `a4World.ts`, absent from every League's
`matchFlags` unless a probe sets it explicitly. The production fingerprint is
unchanged (G1) and the flag-off world is byte-identical to pre-change HEAD on
three league seeds (G2). **Nothing about the game the user plays changes in this
commit.** The seam exists so O1-T2 can fork it; the tempo re-census is the
outcome ruler; the play-test acceptance is the user's (#179.1).

## §NON-CLAIMS

O1-T1 claims **no** football effect: not on tempo, not on spell length, not on
one-touch share, not on the equilibrium band. It does not claim the wind-up is
correctly SIZED for the pass population (the C7 constants were derived from the
shot seat; whether they suit 11.2× the volume is O1-T2's and the re-census's
question, and F-O1b stands pre-named). It does not re-centre t̄. It does not
touch cut-2 (the through family) or cut-3 (the loftKick five). It adds no gene,
no attribute, no percept. It does not price accuracy, power, pressure, hurry or
regather — those are already priced and the NO-TOUCH list forbids re-charging
them. It cannot authorize O1-T2; only the commander can (#179.1).

---

## §RESULT — the gates run

Implementation at working HEAD `ae27087` + this commit's seam. Tests:
[`../../tests/o1PassWindup.test.ts`](../../tests/o1PassWindup.test.ts) (16 pins).
Armed smoke:
[`../../scripts/probes/o1-t1-windup-smoke.ts`](../../scripts/probes/o1-t1-windup-smoke.ts),
data [`data/o1-t1-windup-smoke.json`](data/o1-t1-windup-smoke.json).
**40 matches, block 12,302,000, 603,208 steps, 241.6283 played sim-seconds/match,
single arm (`o1PassWindup: true`), the core run TWICE byte-identical.** Verdict:
**GATES PASS.** Wall ≈ 17 s (CONTEXT ONLY — used in no rate).

* **X-DET digest** `0bac6d4fbc26f931e84bdf39a639b9ad549cf46b1f4264d2412e458f68c6f864`
* **resultSha256** `054e1fc95b90e0bac51b1b107e0bfd8fabbc63f34fde4c89af9b3a122c82dd8f`

### Gate table

| gate | verdict | evidence |
| --- | --- | --- |
| **G1 X-FP-PROD** | ✅ PASS | seed 1337 / 2 seasons / 142 matches → `57b0bdab…c673`, re-derived UNCHANGED both in-probe and by `scripts/fingerprint.ts`; also pinned as a test |
| **G2 FLAG-OFF BYTE-IDENTITY** | ✅ PASS | all three league hashes identical to the pre-change HEAD baselines: 1337 `57b0bdab…c673` · 20260728 `c6e319a4…f080` · 424242 `45d98c74…a39f26` (⚠ #180 CORRECTION: this row originally read `…9d26`, a transcription error; the frozen value at G2 above and the commander's independent re-derivation both read `…a39f26`). In-test: flag-absent ≡ flag-false ≡ plain run, tick for tick, on two match seeds |
| **G3 NON-VACUITY** | ✅ PASS | on 3 seeds the ARMED world reaches the seam repeatedly and its signature DIFFERS from OFF; the smoke armed **2,039** wind-ups in 40 matches (51.0/match) |
| **G4 SEAM SINGULARITY / NO-ROUTE** | ✅ PASS | exactly one `match.armPendingPass(` in `src/**` (one definition in `Match.ts`); the fork sits in `case 'Pass'`'s else branch with `!mustKick && p.firstTouchWindow <= 0`; the cutback line is verbatim `match.performCutback(p, cutbackMate!);` and the kickoff line verbatim `match.performPass(p, back);`. Functional: **210 restart** and **169 kickoff** shortPass releases in the armed smoke all went synchronously, and per-call assertions over 3 armed full matches show every cutback released on its own tick with no wind-up armed for that body |
| **G5 NO NEW CHARGE / NO RNG AT ARM** | ✅ PASS | the arm body contains no `oneTouchMul`/`orientation*Mul`/`pressureAt`/`gaussian`/`kickMisalignment` and writes neither `kickCooldown` nor `firstTouchWindow`; the rng stream is unchanged across an arm (test) |
| **G6 SEAM NEVER RELEASES OWNERSHIP** | ✅ PASS | the ball is owned by the passer on every window tick (stepped fixture); the arm + plant code write `ball.owner` nowhere |
| **G7 RELEASE ONCE, AT `readyTick`** | ✅ PASS | `performPass` runs zero times in-window, exactly once at `readyTick` with the ARM-time mate, never twice; **zero** for an interrupted wind-up (stun and ball-loss cases) |
| **G8 W ∈ [3,11]** | ✅ PASS | every one of 2,039 realized wind-ups is a whole tick count in [3,11] (observed min 3, max 10); the law demonstrably reads `attrs.passing` and NOT `dribbling` (test) |
| **G9 X-DET** | ✅ PASS | two invocations of the smoke core, identical digests (above) |
| **G10 seed disjointness** | ✅ PASS | 12,302,000–12,302,039: inside the reserved band, above the consumed census ceiling 12,301,999, below the phase-0 sizing smoke 12,309,900 — proved in-probe |
| **G11 suite + tsc** | ✅ PASS | `vitest run` **1,116 tests / 123 files green**; `tsc --noEmit` clean |
| **ARM LEDGER — unexplained 0** | ✅ PASS | every one of 2,039 arms maps to exactly one terminal class: STRUCK 1,981 · INT-LOSS 52 · INT-PHASE 5 · INT-STUN 0 · INT-SENTOFF 0 · INT-COOLDOWN 0 · E-ENDED 1 (excluded, reported) · **EVICTED 0** (the single-slot overwrite the phase-0 map warned about never fired) · **UNEXPLAINED 0** |

### G12 — the REALIZED W distribution (REPORTED)

| | ticks | seconds |
| --- | --- | --- |
| p10 | **5** | 0.0833 |
| p50 | **6** | 0.1000 |
| p90 | **8** | 0.1333 |
| mean | 6.343 | **0.1057** |
| min / max | 3 / 10 | 0.05 / 0.1667 |

Tick histogram (n = 2,039): `3:48 · 4:126 · 5:274 · 6:614 · 7:622 · 8:320 ·
9:33 · 10:2 · 11:0`. The pass population's mean W is **6.34 ticks (0.1057 s)**
against the certified shot seat's 6.73 ticks (0.1122 s) — **0.39 ticks shorter**,
which is exactly the `tech`-deviation offset §LAW predicted and quantified ex
ante: mean `passing` in this population sits above t̄ = 0.4068 (the mean
`dribbling`), so `−W_TECH·(passing − t̄)` shaves a fraction of a tick. Inside
±1 tick, as stated. The floor is > 0 and the cap is never reached; the whole
population sits in the low tenths, far under the 0.33 s median spell.

### G12 — wind-up share and the one-touch bypass (REPORTED)

shortPass commits observed: **3,057 (76.4/match)** = armed **2,039** · one-touch
bypass **639** · restart **210** · kickoff **169** · other synchronous **0**.

| quantity | realized |
| --- | --- |
| wind-up share of ALL shortPass commits | **66.70%** |
| wind-up share of ELIGIBLE commits (window-closed, non-restart, non-kickoff) | **76.14%** |
| one-touch bypass share of eligible commits | **23.86%** |
| one-touch bypass share of all commits | **20.90%** |
| seam releases as a share of all `performPass` releases | 66.06% |

⚠ **An honest reconciliation with the frozen G12 reference.** The gate table's
pre-registered expectation said "≈ 79.3% of the OPEN-PLAY, non-restart shortPass
releases". That arithmetic **mixed denominators**: the census's shortPass
one-touch share (20.712%) is measured over **all 158,424** shortPass releases,
while the eligible population excludes the 19,333 restart+kickoff ones. Redone
on matching denominators — 32,812 one-touch over 139,091 open-play shortPasses =
**23.59% one-touch ⇒ 76.41% window-closed** — and the realized **76.14%** lands
on it. The one-touch bypass share of ALL commits, 20.90%, likewise sits on the
census's 20.712% for the same population. **The seam bites exactly the population
the census said it would.** No gate is re-cut (G12 is REPORTED); the slip is in
the reference arithmetic, recorded here rather than quietly corrected.

### G13 — the interruption census (REPORTED)

Resolved arms **2,038** = struck **1,981** + interrupted **57** ⇒ **interruption
rate 2.797%** (E-ENDED 1 excluded and reported).

| cause | count | share of interruptions |
| --- | --- | --- |
| **INT-LOSS** (the ball left the passer inside the window — the existing ball-keyed channel) | **52** | **91.2%** |
| **INT-PHASE** (phase left `playing`: whistle / stoppage / half) | **5** | 8.8% |
| INT-STUN · INT-SENTOFF · INT-COOLDOWN | 0 · 0 · 0 | 0% |

Against the C7-T1 reference point (shots: **3.52%**, CI [3.06%, 3.99%], mix
INT-TACKLE 71.1% / INT-PHASE 28.4% / E-INJURY 0.5%): the pass wind-up's
interruption channel is **real, and of the same modest order** — 2.80% vs 3.52%,
with the ball-loss channel a LARGER share of the mix (91.2% vs 71.1%), which is
what a shorter window on a more-pressed population (73.4% pressed at release,
census §P2.11(iv)) looks like. Both numbers are smoke-scale descriptives with no
CI claim; the A/B is where the channel gets measured against a paired baseline.

### Deviations recorded

1. **Field name `pendingPassWindup`, not `pendingPass`** — `Match.pendingPass`
   already exists (the certified in-flight pass/offside registry). The arm method
   keeps the ruling's name `armPendingPass`. Recorded in §SEAM.
2. **The probe's release labels were fixed before the reported run.** The first
   run of the smoke classified restart takers by `match.restartKickGid` at
   `performPass` time — but `decidePlayer` nulls that field at the top of the
   taker's own decision (`PlayerBrain.ts:109`), so restart and kickoff releases
   both fell into `SYNC-OTHER` (378). The probe now reads both fields **pre-step**
   (the census's own convention, §P2.6). Every other count was identical across
   the two runs (arms 2,039; commits 3,057; 640 → 639 bypass, the one moved unit
   being a restart taker who also carried an open window), and the seam itself
   was not touched between them — the fix was to the instrument's labels only.
3. **G12's reference arithmetic was mis-denominated** (above). The realized
   number is reported against both the frozen figure and the corrected one.

### Disposition

The seam is BUILT and DORMANT: flag-off byte-identity holds on three league
seeds, the production fingerprint is unchanged, the seam bites the census's
population when armed, W lands where §LAW said, the interruption channel exists
at the C7 order of magnitude, and every arm is accounted for. **Nothing ships.**
O1-T1 cannot authorize O1-T2 — the A/B is the commander's call (#179.1), and the
tempo re-census is the outcome ruler after it.
