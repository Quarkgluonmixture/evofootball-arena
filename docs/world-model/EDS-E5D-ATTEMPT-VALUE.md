# EDS E5d — The attempt-value axis (one measured quantity)

Status: **PRE-REGISTERED 2026-07-26 — Phase 0 gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#17.4**, which authorised the axis and ordered Phase 0 first: free, decisive,
on E5c's own forks. Phase 1 is drafted here too but is CONDITIONAL — it exists
only if Phase 0 re-ranks.

Date: 2026-07-26

## 1. What is being removed

Ruling #17.2 named the third cause: **the composition itself**. On the same
forks the chooser's axis scores the pattern pass 3.53% against the control's
3.83% while reality pays 4.89% against 3.80% — and the model is nearly exact
off-pattern (3.83 vs 3.80). `P̂(clean) × V̂(cell | clean)` is accurate for
ordinary balls and biased precisely on balls whose value flows through messy
paths: 40% clean reception, highest realized value, because box chaos, second
balls and the runner's own state pay even when the first touch does not.

So the repair is not another factor. **It is one factor fewer:**

```text
now   P̂(clean reception)  ×  V̂(shot | CLEAN reception, destination cell)
E5d   EV̂(shot | ATTEMPT, observable features)
```

Attempt-conditioning has no adjudication gate at all, which is why ruling #17.3
records that it closes E5a's unfollowed-window defect in the same census: there
is no longer a class of receptions whose window goes unsimulated, because every
fork's window is simulated and counted — clean, messy, spilled, intercepted and
unadjudicated alike.

**No weight is invented anywhere.** The change removes a composition rather than
adding one; that is the whole reason it is allowed under rulings #8/#9.

## 2. What is measured

### 2.1 Phase 0 — the free judgment (this contract's live half)

Two things, both on staging this slice already owns.

**(i) The attempt-conditioned table.** E5a's census population, verbatim —
seeds 700,000+, 4,500 moments, the 6–30 m window, plain ground pass moments,
target-choice-only intervention — with one change and one removal:

```text
CHANGE   every fork's 240-tick window is simulated and counted, whatever
         happened to the ball; the outcome is "the passing team took a shot
         within 240 ticks of the kick", exactly E5a's outcome, now over
         ATTEMPTS instead of over clean receptions
REMOVE   the clean-reception conditioning, and with it the adjudication gate
         that produced E5a's defect
```

Keyed on **destination cell × threat band** (ruling #17.4): E5a's eight zones
crossed with E2b-0's five threat quintiles, the passer's own corridor read from
his own snapshot at awareness 0.8. Held out against seeds 710,000+.

Cells the census cannot fill fall back down a ladder frozen here, before any
result: **(cell × band) → cell → global marginal**, at a 200-attempt floor per
bucket. An option the evaluator cannot read at all takes the cell row.

**(ii) The decisive test, on E5c (b)'s own pattern moments** (seeds 740,000+,
its staging verbatim): at each pattern-active moment every window candidate is
scored twice — once on the shipped composed axis, once on EV̂ — and the two
argmaxes are compared.

### 2.2 Phase 1 — CONDITIONAL, drafted but not authorised by this run

Only if Phase 0 re-ranks: a fresh full census at the Phase-0 keying, committed
as SHA'd data; the chooser's axis swapped from the product to EV̂ behind the
existing `edsValueAxis` flag; then `eds-e5b-value-axis-audit.ts` re-run
**verbatim and unedited**, the narrow audit (§2 band, dominance, perf, the six
watchability instruments), and E4 round 2. Its gates are NOT frozen here —
Phase 0's numbers are what a Phase-1 pre-registration must derive from, and
writing them now would be deriving gates from nothing.

## 3. Authorised seat (Phase 0)

* New probe `scripts/probes/eds-e5d-attempt-value.ts`.
* **No `src/**` change at all.** Phase 0 builds its table inside the probe and
  scores both axes there; nothing is committed as data and no consumer changes.
* `scripts/probes/eds-e5b-value-axis-audit.ts` and E5c's probes MUST NOT be
  edited.
* Fingerprint unchanged, zero live callers, flags default OFF.

## 4. Frozen gates — Phase 0

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                    shared SHA-256
X4 zero `src/**` changes (audited)
X5 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
X6 STAGING EQUIVALENCE — over E5a's own seed block the CLEAN-conditioned
   sub-population of this census must return E5a's committed marginal exactly:
   X6a its COUNT is 7,864, and X6b its shot rate computed E5A'S OWN WAY —
   unadjudicated arrivals forced to no-shot — is 0.07146490335707019
```

X6 is E5c's U1 lesson applied before it can bite: a new outcome definition is
only a new definition if everything underneath it is unchanged.

> ⚠️ **AMENDED BEFORE THE RUN (own commit, disclosed in §6.1).** As first
> frozen, X6 asked the clean subset to return E5a's shot rate *directly*. That
> is **unsatisfiable by construction** and I should have seen it while writing
> it: ruling #17.3 records that attempt-conditioning closes E5a's
> unfollowed-window defect, so a defect-free census cannot reproduce a defective
> number. A predicate that cannot be satisfied is the structurally undecidable
> kind PROBE-CONTRACTS §2 outlawed after ruling #6.3, and **E1b §4.1 is the
> precedent** for amending such a gate before the run rather than reporting a
> guaranteed failure. The amended form compares what can only be equal if the
> staging is unchanged — which is what X6 was for — and the gap between X6b's
> number and the honest rate becomes D5, the size of E5a's defect on its own
> marginal.

### C1 — COVERAGE

```text
gated buckets     >= 200 attempts per (cell x band) in BOTH sets
under-filled buckets fall down the frozen ladder and are REPORTED, never merged
                  after seeing results
```

### C2 — HELD-OUT CALIBRATION (interval test)

```text
per gated bucket   | EV_A − EV_B |  <= 5.0pp
marginal           | EV_A − EV_B |  <= 1.5pp
```

E5a's V3 tolerances, verbatim. At n ≈ 200 and p ≈ 0.06 the SE of a bucket
difference is ≈2.4pp, so 5.0pp is ≈2.1σ — the same standard the V cells passed
at, on a smaller base rate.

### C3 — THE AXIS IS A MEASUREMENT

```text
discrimination   | best gated bucket − worst gated bucket |  >= 5.0pp
calibration      | mean EV̂ − realized attempt-outcome rate |  <= 2.0pp,
                 over all scored forks and within each arm below
```

### R — **THE RE-RANK JUDGMENT** (the thing Phase 0 exists to decide)

Both conditions must hold. Either failing means Phase 0 does NOT re-rank:

```text
R1 ORDERING RESTORED   mean EV̂(pattern) − mean EV̂(control)  > 0
                       reality pays +1.09pp; the composed axis scores −0.29pp,
                       so the SIGN is the whole question and the gate is the
                       sign, not a magnitude I would be inventing
R2 ARGMAX MOVES        at pattern-active moments, the share where the argmax
                       selects a licensed runner rises by >= +5.0pp against the
                       composed axis on the SAME moments
```

R2's floor is powered from E5c (b)'s own staging: 608 pattern receptions came
from ~1,500 pattern-arm forks over ≈450 pattern-active moments, so a paired
shift of 5.0pp is ≈23 moments changing hands — well outside the paired-
proportion noise at that n, and small enough that it does not demand the axis
solve the whole problem in one step. **R2 is deliberately about the DECISION,
not about the score:** a table that improves a number without changing a choice
has changed nothing in the game.

### Reported, never gated

```text
D1 the attempt table itself, both sets, with the bucket census beside it
D2 the two axes side by side on the pattern arm: composed score, EV̂, realized
D3 where the re-rank comes from — the cell x band mix of the moments that
   change hands
D4 what the axis does to the ORDINARY option: the same comparison on control
   moments, where ruling #17.2 says the composed model is already nearly exact.
   A repair that breaks the accurate case is not a repair
D5 E5a's defect, closed by construction: the share of attempts that never
   adjudicate and what their windows pay, now inside the axis rather than
   outside it
```

## 5. Stop rules

* **X6 fails** → the staging drifted; withdraw and report, do not reconcile
  after seeing numbers (E5c's U1 precedent, and its correction).
* **C3 fails** → attempt-conditioning does not discriminate, i.e. removing the
  composition also removed the signal. Report; that closes the axis.
* **R1 or R2 fails → PHASE 0 DOES NOT RE-RANK.** Per ruling #17.4 the residual
  is then the state premium plus the honest observability of pattern state (the
  passer's own action memory and a perceived runner), and that returns to the
  commander **as a design question**, not as another probe in this session.
  Phase 1 is not entered.
* **PASS (re-ranks)** → Phase 1 proceeds under a pre-registration derived from
  Phase 0's numbers, and the queue stops at **E4 round 2, the user's eyes**.

## 6. Result

### 6.1 Phase 0 — RUN 2026-07-26: **THE AXIS RE-RANKS, and Phase 0 is still non-PASS**

Probe `scripts/probes/eds-e5d-attempt-value.ts`, SHA `e42e75c3…1299`, two
invocations byte-identical, fingerprint `57b0bdab…c673` unchanged, **zero
`src/**` changes**, suite green.

```text
X5 harness                       PASS  (3/3 seeds bit-identical)
C1 coverage                      PASS  14 of 40 buckets gated
C2 held-out calibration          PASS  buckets and marginal
C3 discrimination                PASS  15.07pp (floor 5.0pp)
R1 ORDERING RESTORED             PASS
R2 ARGMAX MOVES                  PASS
X6 staging equivalence           FAIL
C3 calibration                   FAIL
```

#### The judgment Phase 0 existed to make: **it re-ranks, decisively**

```text
                       composed axis      EV̂        reality
pattern (n=593)            4.348%       8.674%      7.757%
control (n=1,136)          4.295%       6.653%      4.577%
ordering                  +0.05pp      +2.02pp     +3.18pp
```

**R1**: the sign is restored — the composed axis calls the pattern and the
control a coin-flip (+0.05pp) where reality pays +3.18pp; EV̂ says +2.02pp.
**R2**: at the 450 pattern-active moments the argmax selects a licensed runner
**23.78% → 39.33%, a +15.56pp shift** against a +5.0pp floor. The decision
changes hands at 70 moments, not the statistic alone.

The attempt table's own gradient over the eight cells, on attempts rather than
clean receptions: **1.05 / 1.63 / 6.03 / 7.01 / 14.59 / 14.10 / 17.75 /
36.71%**, marginal 6.33% over 14,114 attempts (held out 5.87%).

#### ⛔ X6 FAILED — reported as it fired, and NOT re-amended

```text
clean subset COUNT       7,864  =  E5a's 7,864          EXACT
clean subset RATE        0.07922177009155645
E5a's banked rate        0.07146490335707019            differs
```

**The count is exact, which proves the staging did not drift** — same moments,
same candidates, same fork outcomes, same clean classification, to the unit.
The residual is a third E5a implementation inconsistency, certain from reading
the code rather than inferred: E5a captured `shotsBefore` **after** stepping the
12-tick adjudication window, so its value window ran `[touch+12, kick+240]`
while its own contract says "within 240 ticks of the kick". This probe follows
the contract. The 0.78pp difference is the shots E5a's window excluded — the
first-time shot and the early second ball.

**I have twice now written X6 in a form that conflates the DEFINITION with the
STAGING it was meant to police.** The first form was unsatisfiable and I amended
it before the run (§4). This second form failed on a definition difference too,
and amending it *after* seeing results is precisely what the discipline forbids
— so it stands as FAILED and the disposition is the commander's, exactly as I2
was retired rather than redrawn in ruling #6.2.

**What this makes visible is worth more than the gate was.** On the same 7,864
receptions, E5a's own marginal:

```text
7.146%   as banked            (unfollowed windows zeroed, window starts late)
7.922%   + the correct window start
9.054%   + every window actually simulated
```

**E5a's V table is deflated by 1.91pp on its marginal — 27% relative** — by two
independent implementation defects, neither of which the attempt axis can have.
D5 shows why: of 14,114 attempts, 8,602 reach the target and 7,864 count as
clean receptions, of which **1,473 (18.7% of arrivals) never adjudicate** and
pay **6.04%**; attempts that never reach pay **2.85%**, not zero. Both classes
were structurally invisible to the composed axis.

#### ⛔ C3's calibration FAILED, narrowly, and it is a Phase-1 design fact

```text
all scored forks     within tolerance
pattern arm          8.674% predicted vs 7.757% realized     0.92pp   ok
control arm          6.653% predicted vs 4.577% realized     2.08pp   FAIL (2.0pp)
```

The table is built on the general census and applied to a **selected**
population — moments where a licence fires — and it over-predicts the ordinary
options there by 2.08pp, a hair over the band. Reported as it fired. It does not
touch R1 or R2 (both are comparisons *within* that population, where the bias
applies to both arms), but it is the first thing a Phase-1 pre-registration must
answer: an axis that is calibrated on average and biased on the population where
decisions are hard is not yet finished.

#### Disposition

**Non-PASS.** Two gates fired, and the contract's stop rules plus the standing
instruction send any non-PASS to the commander before Phase 1. Nothing shipped,
no `src/**` touched, every flag still default OFF, E4 round 2 still shut.

What the commander now has that ruling #17.4 asked for: **the attempt axis DOES
re-rank** (+15.56pp of decisions, ordering sign restored), and the two gates
that failed are both about the *old* table's defects and the *new* table's
population, not about the axis's ability to do its job.
