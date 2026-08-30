# RA-T0 — THE RECEIVER-ACCESS DORMANT SEAM (接应时间入价的席位)

> **The seat the user's ①′ election authorizes, dispatched by COMMANDER RULING #360
> item 3** once [`DX-C2-MEETABILITY-CENSUS.md`](DX-C2-MEETABILITY-CENSUS.md) came back
> **DISCRIMINATES** (72.78 % of carried elections unmeetable; Δ unresolved +0.0865 entirely
> above zero — the pre-committed licence of #359 item 2(b) GRANTED). Lineage: the user's
> #357-fork mechanism-oracle question 「这个用vision和现实重新思考下，为什么现实不这样」
> (ruling #358: the lead is a RENDEZVOUS solve and the shared pricer had no receiver-access
> term) → the user's #358-fork election 「①′ 接应时间入价」 (ruling #359). Contract frame:
> [`DX-DELIVERY-EXECUTION-CONTRACT.md`](DX-DELIVERY-EXECUTION-CONTRACT.md) (the arc opened
> under it, #359 item 1); §6 VISION / §7 REALITY audits of record: ruling #358 item 6.
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `raAccessPrice` is default OFF, never
> env/bundle-armed, named by NO world and NO preset (`a4World.ts` contains neither the flag
> nor the gene); the production fingerprint is UNCHANGED (verified at the seam commit:
> `npm run fingerprint` = the literal of record `57b0bdab…c673`). The entry rung is RA-T1's
> business, not this stage's.

## §1 THE MECHANISM (what armed means)

Armed (`raAccessPrice: true` **AND** a NON-ABSENT `raAccessWeight` gene), the ONE hoisted
`groundCandidate` pricer performs ONE extra last subtraction:

```text
deficit(E) = max(0, tMate(E) − tBall(E))        [the receiver's unreachable seconds]
score′     = score − raAccessWeight · deficit(E) · W.passBase
```

with the account **DX-C2 §P.A byte for byte** (traced, never invented):
`tBall = dist(from, E) / PTP_FLIGHT_SPEED` (the chooser's own flight law, the constant
IMPORTED); `tMate = dist(mate, E) / max(mate.topSpeed, 0.1) + 0.15` (`interceptBall`'s own
time-to-point form — the receiver's REAL chase machine; both source lines asserted VERBATIM
by the pin suite); the `CONTROL_RADIUS` **presence clause** (a mate at the point owes
nothing); a **self-delivery GATE** (a knock's reception point is by construction where the
carrier's own race resolves — CB-T2's law — so the account has nothing to price there).
Currency = the DV belief limb's own `W.passBase` (the named prior of #360 item 3(iii)).
⛔ No cap, no ban, no constant beyond the account's own; the deficit is bounded by
construction. ⛔ NO receiver-behaviour change of any kind (the cooperation seat is a held
door, #360 item 4).

**The football sentence**: the passer finally asks 「他赶得到吗」 before asking 「值多少」 —
and how much he cares is a gene, so selection sizes the price, we don't.

## §2 THE FILES

| file | what |
|---|---|
| `src/ai/receiverAccessSeat.ts` | NEW — the seat (`receiverAccessSeatOf`) + the deficit law (`receiverAccessDeficit`) + the three traced constants (`RA_FLIGHT_SPEED` imported from PTP; `RA_CHASE_REACTION`/`RA_CHASE_MIN_SPEED` traced from `interceptBall`, never-re-cut docblocks) |
| `src/ai/PlayerBrain.ts` | ONE flag fork (`raSeat`, built once per decision) + the ONE last subtraction inside `groundCandidate` |
| `src/evolution/genome.ts` | `raAccessWeight?` BORN ABSENT (the `cbCarryProneness` birth discipline verbatim: outside `GENE_KEYS`, zero rng flag-off, serialization omits) + `raAccessWeightOf` accessor + `evolveReceiverAccess` opt-in whose draws sit STRICTLY AFTER every existing block (mutate + crossover, both LAST) |
| `src/sim/Match.ts` | `raAccessPrice` config + readonly + `?? false` initialiser |
| `src/sim/League.ts` | the `matchFlags` key union only (`League.toJSON` omits matchFlags — nothing serializes) |
| `tests/raAccessPrice.test.ts` | THE PERMANENT PIN SUITE — 19 pins, see §3 |

## §3 THE PINS (all green at the seam commit; the suite is the living inventory)

* **Road B**: prohibition set (no world/preset/env names the flag or gene) · no
  serialization · **G-OFF** (absent ≡ explicit-false, bare + world 11 × 2 scratch seeds) ·
  **G-BORN** (armed, gene absent ≡ shut byte for byte — structural, no seat) · **G-ZERO**
  (armed at gene 0 ≡ shut with the path LIVE; IEEE-exact `−(+0)`) ·
  ⭐ **G-INERT** (armed at weight **1** with NO displaced candidate in the world ≡ shut,
  byte for byte — the term can only touch a DISPLACED aim: to-feet dies to the presence
  clause, the knock to the GATE) · **G-BITE** (with the DLC led candidates in the world, a
  dosed gene genuinely REPRICES — the world diverges).
* **The account law on fixtures**: the trace holds (constants ARE the traced family;
  source lines verbatim, including the MARK_SAG line — the defence's half of the same
  account) · presence clause · self-delivery gate · the `max(0,·)` half-wave with exact
  arithmetic · min-speed clamp · the module is PURE and CHANNEL-CLOSED (never names
  `Match`).
* **Scope**: ONE pricer, ONE deficit call, the LAST subtraction; the LOFTED chain names
  nothing.
* **Seam map**: occurrence counts per needle, five sites enumerated, no other spelling in
  `src/**`.
* **G-RNG**: pricing draws ZERO rng; flag-off mutate/crossover streams UNMOVED (the
  opt-in draws only when asked, strictly after every existing block).
* **The fingerprint of record** is a literal in the suite; this seam may not move it.

## §4 HONEST LIMITS

* ⚠ The account is STATIC at the pricing instant (dist/topSpeed from a standing start +
  one reaction beat; the receiver's own velocity is not credited — the traced form does
  not credit it either). DX-C2 §R3 measured what this costs: +0.25 m mean overall, honest.
* ⚠ `mate.topSpeed` is stamina-scaled LIVE — the chooser is credited with knowing his
  teammate's current pace. The pricer family already credits OPPONENTS' `topSpeed` (the DV
  exposure limb), so this is strictly weaker; stated, not hidden.
* ⚠ The deficit prices the ELECTION; it does not and must not move the RECEIVER
  (#360 item 4 — the +3.23 m cooperation gap is a different seat's number).
* ⚠ Whether the argmax actually stops electing unreachable balls is **RA-T1's exam**, not
  this stage's claim: primary face = the elected-unmeetable share falls resolvedly; bands
  on ground volume and completion from its own shut arm; goals REPORTED; season ladder
  (the gene evolvable via `evolveReceiverAccess`).
