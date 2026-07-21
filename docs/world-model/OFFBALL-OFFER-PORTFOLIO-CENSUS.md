# O5a — Team Offer-portfolio Census

Status: **PRE-REGISTERED. Probe only; no allocator.**

Date: 2026-07-21

## 1. Question

O5 can represent a whole same-carrier commitment set. O5a asks whether that
team-level object is supported and non-vacuous in real attacking states under
the already frozen O3a independent-feasibility null model.

It does not ask which portfolio should be chosen.

## 2. Frozen sample and null commitments

Reuse O3a exactly on 120 matches from seed offset 0:

* sample once per simulation second during live stable control;
* evaluate every attacking non-carrier outfielder through truth O0;
* create at most one non-hold, onside, positive-margin commitment per player;
* choose lowest self ETA, then candidate ID;
* give every probe-only commitment the same explicit 90-tick lifetime.

O5a only adds one portfolio evaluation over the resulting commitments. Default
O3a output must remain byte-identical.

## 3. Measurements

For every state with at least two commitments report:

* active member and pair counts;
* min and max target distance;
* min and max carrier-bearing separation;
* min and max arrival-time separation;
* min and max corridor separation;
* within-portfolio max-minus-min range for every fact;
* player-pair identity conservation.

Each distribution reports mean and q10/q50/q90. Zero remains a real geometric
fact. No value becomes `duplicate=true` or `diverse=true`.

## 4. Gates

```text
matches                                = 120
portfolio-eligible states              >= 80% sampled states
portfolio evaluation failures          = 0
member/pair conservation failures      = 0
carrier/player identity failures       = 0
non-finite pair/range facts             = 0
```

For target, bearing, arrival and corridor facts:

* min and max distributions must each contain observations;
* q90 must exceed q10;
* at least 50% of portfolios must have a strictly positive internal
  max-minus-min range.

This is a non-vacuity gate, not evidence that large range is better.

## 5. Stop rule

Stop before a clone intervention if:

* portfolio support requires named runs, role gates or live state;
* a weighted diversity score is needed to describe the sample;
* pair identities cannot be conserved;
* a threshold is inferred from the observed distribution; or
* O3a default output/fingerprint changes.

Passing O5a authorises only a separately pre-registered clone experiment that
constructs deliberately concentrated and spread generic portfolios as causal
extremes. It does not authorise an allocator or live commitment.
