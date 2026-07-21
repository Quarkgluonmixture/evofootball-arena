# O5 — Team Off-ball Offer Portfolio

Status: **PRE-REGISTERED. Representation only; no allocation or live consumer.**

Date: 2026-07-21

## 1. Missing causal fact

O3 represents one player's candidate relative to teammates' commitments. The
team still lacks one authoritative object that can answer:

```text
For this carrier, which players have committed?
Which exact pairs are spatially/timingly similar or different?
Is the whole offer set concentrated or spread across several lines?
```

This is portfolio state, not a task allocator. It does not decide whether
concentration or spread is better.

## 2. Representation

Add a pure `evaluateOffBallOfferPortfolio()` over:

```text
carrier point
current tick
explicit OffBallOfferCommitment[]
```

The result contains:

* one carrier identity;
* active commitments copied and sorted by player gid;
* every unordered player pair in stable gid order;
* per-pair target distance;
* carrier-centric bearing separation when both bearings exist;
* arrival-time separation;
* corridor separation;
* separate portfolio min/max values for each fact.

No fact is called overlap, underlap, duplicate, check-back, box crash or third
man. Min/max values remain measurements, not a score.

## 3. Validity rules

* Expired commitments are ignored.
* Every active commitment must already satisfy O3 validity.
* All active commitments must reference the same carrier.
* A player may have at most one active commitment in a portfolio.
* Malformed, mixed-carrier or duplicate-player active input returns `null`.
* Zero or one active commitment is a valid portfolio with zero pairs and null
  pairwise extrema.
* Bearing facts are nullable when a target equals the carrier point; other
  pairwise facts remain defined.
* Inputs are never mutated and the portfolio owns copies of target coordinates.

## 4. Counterfactual tests

Focused tests must prove:

1. empty and singleton portfolios are valid with no fabricated pairwise facts;
2. three commitments produce exactly three stable unordered pairs;
3. same target produces zero target/bearing/corridor separation;
4. same ray at different depth preserves zero bearing/corridor separation;
5. orthogonal geometry produces the expected angle and corridor separation;
6. min/max summaries identify different supplying pairs without collapsing them;
7. expired commitments do not enter the portfolio;
8. mixed carriers, duplicate players and malformed active commitments return
   unsupported;
9. mirrored geometry preserves every unsigned fact;
10. repeated evaluation is identical and input mutation after evaluation cannot
    change the result.

## 5. Exact-zero gates

```text
Match/Team/brain imports       = 0
live portfolio creation        = 0
allocation/selection           = 0
duplicate threshold            = 0
aggregate utility              = 0
named football patterns        = 0
role/gene/policy checks         = 0
RNG draws                       = 0
default fingerprint changes     = 0
```

## 6. Stop rule

Stop before a portfolio census if pairwise identity cannot be conserved without
a score or named task. Passing O5 authorises only a probe-only portfolio census,
then a separately pre-registered clone experiment comparing deliberately
concentrated and spread generic commitment sets.

It does not authorise a live bidder, `supportSpot` replacement, TeamBrain rewrite,
gene, preference or retirement of named scripts.
