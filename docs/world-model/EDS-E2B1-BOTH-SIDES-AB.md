# EDS E2b-1 — The both-sides perception A/B

Status: **RUN 2026-07-25 — §7 is the frozen result: FAIL on G3 (perf) and on
X3 (a harness defect of mine). The queue STOPS; E3 is not drafted.** Drafted
by the autonomous session
under commander ruling #9.3; shape fixed by ruling #7 (c)–(g) and #8 (l).

Date: 2026-07-25

## 1. The question

Everything so far has been instruments. This is the experiment they were built
for: **when both sides act on what they can see instead of on truth, does the
option set survive, and does looking beat not looking?**

S3b answered "no" once already — one-sided live perception collapsed the route
mix (headers 6.39→4.05, cutbacks 3.96→2.46) and was reverted. E0 found the
mechanism: observation does not blur the option set, it **deletes** ~46% of it.
E2a-2 built the prior that stops the deletion, and E2b-0 built the exchange
rate that lets a seen option and a blind one be compared at all. E2b-1 spends
them.

## 2. Three information states (ruling #9.3 (a))

The class is named, not folded. E2a-1's population error came from a silent
fold, and E2b-0 measured that 28.48% of playable options sit in the class the
pricing layer currently hides:

```text
READ         target AND lane in the current percept
             → priced by E2b-0's corridor curve (the measured exchange rate)
SEEN-UNREAD  target perceived, lane not readable  (28.48% of playable options)
             → priced at the BAND rate for the remembered distance
UNSEEN       no trace of the man at all
             → priced at the MARGINAL; priced always, executable never
```

Shares are **reported per arm**. They are the mechanism: as awareness falls,
options move READ → SEEN-UNREAD → UNSEEN, and that migration is what a route
collapse would be made of.

## 3. One unit, no invented weights (ruling #9.3 (b), (c))

Every option is priced as a **measured probability that the intended man ends
up in clean control**, and every number in it comes from a census:

```text
READ         P(reached | threat quintile)  ×  P(clean | reached, that quintile)
SEEN-UNREAD  P(reached | band)             ×  P(clean | reached, band)
UNSEEN       P(reached | marginal)         ×  P(clean | reached, marginal)
```

The band and marginal factors are already banked in
[`passPrior.ts`](../../src/ai/passPrior.ts) (`reachedRate`,
`cleanGivenReached`). The READ factors are **not** yet split that way — E2b-0
banked only the composite `realizedSuccess` per quintile — so this contract's
first act is to re-derive the quintile curve as its two factors from the same
census, under an X5 reproduction gate.

### 3.1 On flag-ON, and why this A/B runs flag-OFF

Ruling #9.3 (c) requires either a corridor × touch decomposition at flag-ON
strength, **or an explicit justification for an alternative**. This contract
takes the alternative, on purpose:

E2b-0's curve, the band table and the marginal were all measured in the
**flag-OFF** world. Decomposing lets the READ class be re-priced at flag-ON
strength, because the E1a-certified formula gives a per-option touch term — but
**SEEN-UNREAD and UNSEEN have no per-option arrival prediction**, so their touch
factors would stay at OFF strength while READ moved to ON. That would put a
systematic wedge between the classes *precisely along the axis the choice is
made on*, and the size of the wedge would be an artefact of which class happens
to carry a prediction. Having just spent a whole stage refusing to invent an
exchange rate, importing an uncalibrated one through the back door is the same
error wearing a different hat.

So **E2b-1 runs `edsTouchCost` OFF**, where all three classes are calibrated in
the same world, and the corridor × touch decomposition is still carried out and
reported (it is what makes the READ price auditable). E1b's curve rejoins at
**E3**, where the full bundle is audited together and the §2 band is the
question. A flag-ON sensitivity figure for the READ class alone is reported
here as a diagnostic so the size of the deferred effect is on the record.

## 4. The experiment

Staging: E2a-2's fork-and-force, seeds `700,000+`, **3,000 moments**. Per
moment, four arms are priced and each arm's choice is forked:

```text
arms          awareness 0.2 / 0.5 / 0.8  +  ORACLE (truth — today's world)
both sides    the passer prices from HIS snapshot; the defender's interception
              entry reads HIS OWN perceived ball, through the same shared
              awareness trunk (SUBSTRATE-MAP: no one-sided reading attr)
choice        the highest-priced EXECUTABLE option (READ ∪ SEEN-UNREAD);
              UNSEEN is priced and excluded — ruling #8 (l). Ties by lowest gid
measure       fork, force the chosen target, record the realized outcome
```

Only the chosen option is forked, so this is 4 × 3,000 = 12,000 forks, not a
full re-census.

### 4.1 Authorised seat

* `src/sim/Match.ts` — `edsPerceivedDefence?: boolean`, default **false**, and
  a flag-gated per-player perception layer updated at **brain cadence** (the
  substrate's own scan interval), not per tick.
* `src/ai/PlayerBrain.ts` — the interception entry (`canInterceptPass`, the one
  call at the `pendingPass` branch) reads the defender's own perceived ball
  when the flag is on. A defender with no ball percept cannot enter: not
  looking must cost something, or the arm is theatre.
* New probe `scripts/probes/eds-e2b1-both-sides-ab.ts`.
* No other `src/**` change. Flags default off; fingerprint unchanged.

## 5. Frozen gates

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged, all flags off
X2 tsc + build clean · full suite green
X3 two invocations byte-identical             shared SHA-256
X4 flags-off bit-identity: 3 full matches identical to pre-E2b-1 HEAD
X5 REPRODUCTION: with all flags off, the quintile re-derivation must reproduce
   E2b-0's banked composite curve (82.86 / 62.31 / 50.97 / 47.15 / 43.14%)
   exactly, and its factors must multiply back to it
```

### G1 — NOT-LOOKING MUST NOT WIN (ruling #7 (d))

```text
realized success, arms ordered 0.2 → 0.5 → 0.8 → ORACLE:
  each step  >=  the previous  − 2.0pp        (non-inferiority chain)
```

At 3,000 moments per arm the standard error of a step difference is ≈1.29pp, so
the −2.0pp band is ≈1.6σ of slack: it tolerates a flat rung, and a real
inversion of the size S3b produced (tens of pp) cannot hide in it. The
**endpoint lift (ORACLE − 0.2) is REPORTED, not gated** — ruling #8 (j).

### G2 — ROUTE MIX (ruling #7 (e))

```text
long-option share (chosen distance >= 18 m), awareness-0.8 arm vs ORACLE arm:
  within ±25% relative
mean chosen distance, same comparison:          within ±15% relative
```

Derived from S3b's own collapse signature, which ran −37% and −38% on its route
counts; a ±25% band sits inside that and far outside noise (at a ~30% share and
n = 3,000, ±25% relative is ≈7.7σ).

### G3 — PERF (ruling #7 (f))

```text
flag-ON µs/step   <=  1.25 × flag-OFF µs/step, measured in the same run
flag-ON p95       <=  1.50 × flag-OFF p95
flag-OFF µs/step  reported against docs/perf/baseline.json (5.32 µs/step)
```

Perception runs at brain cadence, never per tick; a per-tick implementation
will fail this gate rather than be argued about.

### Reported, never gated

```text
R1 class shares per arm (READ / SEEN-UNREAD / UNSEEN) — the migration
R2 look-pressure on BOTH axes (ruling #9.3 (d)): how often the best UNSEEN
   price beats the best executable price, on the band axis and on the read axis
R3 endpoint lift ORACLE − 0.2, and the per-arm realized success
R4 the corridor × touch decomposition of the READ price, and the flag-ON
   sensitivity of the READ class alone (§3.1's deferred effect)
R5 chosen-option agreement with the live brain's own choice, per arm
```

## 6. Stop rules

* **X1/X4 fail** → a flag is not dormant; revert immediately.
* **X5 fails** → the re-derivation is not E2b-0's curve; the factors are not
  the thing that was calibrated. Report; never re-fit.
* **G1 fails** → not-looking wins, which is S3b's failure with better
  instruments. Report to the commander: the fix is a design question about what
  an unseen option is worth, never a re-weighting of the evaluator.
* **G2 fails** → the route mix collapsed; the option set did not survive
  perception. Report; do not widen the band.
* **G3 fails** → report; perception may be made cheaper, never less honest, and
  a re-run needs the cheaper implementation, not a raised budget.
* Dormant throughout: nothing ships, no genes, no evolution, no §2 band claim.
* **On PASS the executor drafts E3** directly (ruling #9.4), and the queue
  stops at **E4 — the user's play-test**.

## 7. FROZEN RESULT — the science passes, the plumbing fails twice (2026-07-25)

Run at HEAD `1186760`. Verdict **FAIL** on two gates. SHA
`732f89507b518dd37d9dd2878687cb90ddab99f75d075083d847974229155332`.

```text
X5 harness / census / factors                    ✓ ✓ ✓
G1 not-looking must not win                      ✓
G2 route mix (long share, mean distance)         ✓ ✓
G3 perf p95                                      ✓
G3 perf MEAN                                     ✗  1.329x against a 1.25x budget
X3 two invocations byte-identical                ✗  a defect in this probe
```

### What passed, and it is the part that mattered

**G1 — not-looking does not win.** Realized success of each arm's own chosen
option, forked and forced so the number is the world's:

```text
awareness 0.2    63.28%          chain step  —
awareness 0.5    64.60%                      +1.32pp
awareness 0.8    63.46%                      −1.14pp
ORACLE           67.90%                      +4.44pp
```

Every step clears the −2.0pp non-inferiority band; the 0.5→0.8 rung is
slightly negative and well inside it. The endpoint lift (reported, not gated)
is **+4.61pp**. Seeing the world is worth about four and a half points of
reception success, and no arm of blindness beats a more sighted one.

**G2 — the route mix survives.** This is the gate S3b failed.

```text
long-option share (>= 18 m)   13.31%  17.72%  18.05%  |  18.07% oracle
mean chosen distance (m)      12.81   13.34   13.41   |  13.18  oracle
```

At awareness 0.8 the chosen-option distribution is **indistinguishable from
omniscience** (18.05% vs 18.07%). S3b's collapse signature does not reproduce:
the prior that stops option deletion is doing exactly the job it was built for.
Only the blindest arm shortens the game, and even it does so by a quarter, not
by S3b's ~38%.

**X5** holds on all three legs, including the factors multiplying back to
E2b-0's banked curve. The decomposition is also informative in itself:

```text
threat quintile   P(reached)   P(clean | reached)
1                   88.36%          93.78%
5                   48.49%          88.97%
```

The corridor read predicts the corridor, as intended (39.9pp), and also
mildly predicts touch cleanliness (4.8pp) — a threatened lane delivers a
dirtier ball, which is pressure arriving with the pass.

### G3 — perception at brain cadence costs 33%

```text                 flag OFF     flag ON     ratio    budget
µs/step                  5.947       7.906      1.329     1.25    ✗
p95 (µs)                 9.334      13.125      1.406     1.50    ✓
```

An honest failure of the gate as frozen. The cost is real work: `refreshPerception`
rebuilds a full snapshot per body per decision, and because decisions are
staggered across the squad, essentially every tick captures truth and rebuilds
arrays for somebody. Per §6 the response is **cheaper perception, never a bigger
budget**. Candidate directions, measured by nobody yet and therefore not acted
on: the defender entry consumes only the **ball** percept, not the player array,
so a ball-only refresh would do most of the job; the truth capture allocates a
fresh array per tick; and bodies whose current action cannot consume perception
need not refresh at all.

### X3 — my defect, not the world's

The probe embeds **wall-clock timings** in the object it hashes, so byte
identity is impossible by construction, and the run reported
`deterministic: false`. That is a drafting error: G3 is a measurement of the
machine, and I put it inside the artefact that is supposed to be a measurement
of the world.

The world is fine, and this is demonstrated rather than asserted: with the perf
block removed, two independent shell invocations hash **identically**
(`fd4e33bc…4803` twice). Every other number in this result is reproducible.

The gate is reported as it fired. Rewriting the hash's contents after seeing
the result is exactly the move the discipline forbids, and I have refused it
once already in E1a-I2; the fix belongs in the commander's redraw, where
separating the perf artefact from the hashed result is a one-line decision that
someone other than the author of the mistake should ratify.

### R1 — a correction to a banked number

Separating the three classes properly changes what ruling #9.3 (a) was told:

```text                READ    SEEN-UNREAD    UNSEEN
awareness 0.2         62.0%      0.2%        37.8%
awareness 0.5         77.1%      0.2%        22.7%
awareness 0.8         85.6%      0.2%        14.2%
ORACLE               100.0%      0.0%         0.0%
```

**SEEN-UNREAD is ~0.2% of enumerated options, not 28.48%.** E2b-0's 28.48%
"unpriceable" figure counted every candidate the evaluator returned nothing for
— and that set is dominated by targets the passer simply cannot see, not by
perceived men whose lane is unreadable. The third class is real and worth
naming, but it is nearly empty; the mass is plain UNSEEN. Ruling #9.3 (a)
characterised the class from the conflated number, so this corrects the input
rather than the ruling.

### R2/R3/R5 — the rest

```text
look-pressure, read axis    17.03%  11.77%   9.17%   0%
look-pressure, band axis     7.10%   5.63%   3.60%   0%
agreement with the live brain 38.1%  39.6%   40.8%  47.4%
```

Look-pressure is real and falls with awareness exactly as ruling #8 (l)
predicted: at awareness 0.8 a blind option out-prices every executable one in
**9.2%** of moments — a man the passer would rather have than anyone he can
see. That is the gaze consumer's future workload, quantified. And the evaluator
agrees with the live brain under half the time even with perfect sight, so it
is genuinely a different chooser, not a re-derivation of the existing one.

### Verdict and fork

**FAIL.** The queue stops and **E3 is not drafted** — ruling #9.4 conditioned
that on a PASS. Two questions for the commander, in order:

1. **G3 is a real engineering result**: brain-cadence perception as built costs
   33% against a 25% budget. Cheapen and re-run, or re-scope the budget on
   evidence (the stop rule forbids the latter without a cheaper implementation
   first).
2. **X3 is a contract/harness conflict I created**: a probe cannot both carry a
   wall-clock perf gate and promise a byte-identical artefact. The clean fix is
   to hash the world-result and report perf beside it, but that is a gate
   change and belongs to the commander.

Nothing about G1, G2 or X5 is in question, and none of it shipped: both flags
remain default-off and the fingerprint is unchanged.
