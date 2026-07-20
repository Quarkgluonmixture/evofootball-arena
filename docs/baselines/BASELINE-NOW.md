# BASELINE-NOW — probe baselines on the clean substrate-rebuild HEAD

> The **"before"** for the Pass–Arrival–Contest slice (docs/PROBE-CONTRACTS.md §5
> BASELINE-NOW class). Frozen on the post-tree-settle sim (budget `SQUAD_BUDGET 35.5`
> + keeper arc; `vision` reverted — commit `f192a08`+). Deterministic (fixed seeds) —
> reproduce with the command shown. When slice-1 lands, re-run each and compare the
> named metrics; the acceptance is probes + the user's play-test eyes (not goals≈2.0).

---

## contest-anatomy — S0 loose-ball / contest ledger
`npx tsx scripts/probes/contest-anatomy.ts 120 0`

```
n=120 (seeds 0-119)   goals/match 2.34
contests/match: 17.59   ledger: started 2111 == resolved 2111 OK
origin mix:   block 0.1% · keeperSpill 2.7% · tackleLoose 0.4% · firstTouch 0.0% · aerial 33.1% · deflection 63.7%
outcome:      losing-side retains 22.4% · opponent wins 34.8% · dead/out 42.8%
bodies@loss:  within 3m 1.98 · within 6m 3.87
zone (losing side): def 19.5% · mid 5.4% · att 75.0%
pinball chain: mean loose-touches/contest 1.47 · max 19
time-to-controlled: mean 2.40s
contest->chance (shot ≤3s, same side): 2.7%
```

**Reads (the honest "before"):**
- **~17.6 genuine loose balls/match**, and **75% happen in the losing side's ATTACKING
  third** — turnovers are where attacks break down high up, not midfield battles.
- **Loose balls are overwhelmingly deflections (64%) + aerial knockdowns (33%).**
  `tackleLoose`/`firstTouch` read ~0% because in today's sim a won tackle / clean
  reception resolves straight to controlled possession — it does NOT pass through a
  loose window. That absence is itself the finding: there is no modelled "50-50 /
  jostle" contest; capture is the instant 1.25 m owner-flip. Slice-1's S0 contest
  state is what will give tackles/first-touch a real contested phase.
- **Outcome: losing side wins it back 22% · opponent 35% · dead-or-out 43%.** Nearly
  half of loose balls just leave play — low "second-ball" retention.
- **contest→chance only 2.7%** and **pinball chain mean 1.47** (max 19): loose balls
  rarely become shots quickly, and sustained ping-pong is the tail, not the norm.
- ⚠ origin `tackleLoose`/`firstTouch` are structurally under-counted (see above) —
  watch the DEFLECTION/AERIAL split + outcome + contest→chance as the primary signals.
