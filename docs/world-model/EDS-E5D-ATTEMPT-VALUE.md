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

*(frozen on completion — Phase 0 §6.1)*
