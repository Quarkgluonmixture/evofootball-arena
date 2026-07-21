# O5a — Team Offer-portfolio Census

Status: **COMPLETE. Coverage/non-vacuity passed; probe only, no allocator.**

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

## 6. Frozen result

The pre-registered 120-match run passed:

```text
sampled attacking team states             10,689
portfolio-eligible states                 10,590 (99.1%)
portfolio evaluation failures                  0
member/pair conservation failures              0
carrier/player identity failures               0
non-finite pair/range facts                     0
```

| fact | min mean | min q10/q50/q90 | max mean | max q10/q50/q90 | range mean | range q10/q50/q90 |
|---|---:|---:|---:|---:|---:|---:|---:|
| target distance | 6.272m | 1.157/4.824/12.941m | 27.188m | 15.216/26.400/41.025m | 20.917m | 7.648/19.208/38.067m |
| bearing separation | 16.752° | 1.372/9.577/39.957° | 107.314° | 52.694/101.753/169.393° | 90.562° | 36.255/86.319/152.491° |
| arrival separation | 0.026s | 0.001/0.009/0.061s | 0.199s | 0.045/0.171/0.359s | 0.173s | 0.033/0.144/0.320s |
| corridor separation | 1.989m | 0.128/0.986/5.044m | 12.486m | 6.333/12.343/18.368m | 10.498m | 2.972/10.859/17.201m |

The mean portfolio contained 4.066 members and 6.593 unordered pairs. For every
fact, 94.9% of eligible portfolios had a strictly positive internal range. The
remaining 5.1% are principally two-member portfolios, which contain one pair and
therefore correctly have `max - min = 0`; zero was not treated as invalid.

Two full portfolio-mode reruns produced the identical output hash
`37ba0a4c8f94c09b7f4ca26c94c91f9b87c7e21c93c3bb479f6119fc05ce44c2`.
The legacy O3a mode retained its exact frozen hash
`456133643e93fdae4007f9b131e9a51983a94872e4c310b8794d121fa3221be2`.

O5a therefore proves that the generic portfolio object is supported, conserved
and internally variable in the current 6v6 ecology. It does **not** show that a
larger separation is better. The next authorised work remains a separately
pre-registered portfolio-level clone intervention.
