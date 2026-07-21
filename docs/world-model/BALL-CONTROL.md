# Ball-Control Foundation — authoritative ball, readable touches

Status: **B0 done; B1a/B1b honest-reverted; B1c-0 byte-identical representation done;
B1c-1 is next but not started.**
This is a bounded S2 foundation slice, not an extension of the completed M0–M4 body
campaign. The implementation authority for the retry is
[`CONTROLLED-BALL-COUPLING.md`](CONTROLLED-BALL-COUPLING.md).

## 1. Why this slice exists

The user accepted M1 body contact and the current 0.286m 3D readability shell,
but cannot consistently see why a dribbler was or was not dispossessed. The
existing Phase-36 mechanic already releases long open-field knocks; under
pressure it falls back to a binary owner plus a ball fixed 0.85m ahead of the
body. `dribbleTouch` is a chase tag, not a complete control process.

The two failed live cuts made the missing world fact more precise: **a ball may
be physically between the same player's planned touches without the control
process ending or a new loose-ball contest beginning.** `ball.owner` cannot
continue carrying physical constraint, controller identity, pass-chain lifetime
and macro possession by itself.

## 2. Boundary

Build the smallest process that makes foot↔knock cadence and disruption true:

- authoritative sim position only; no render-only foot lie;
- no legs, foot IK, muscle model, or new body collision campaign;
- no hand-authored decision for when to dribble;
- attributes may change execution range/error/time, never declare success or
  make dribbling valuable;
- keep the accepted ball display size and M1 contact feel;
- one behavioural lever per stage, deterministic fixed-order mechanics;
- own planned micro-touches continue one control sequence; only a real break
  enters M3 contact→control;
- macro possession may eventually read a derived `possessionLocus`, but physical
  contact, rules, kick release and render always read authoritative `ball.pos`.

## 3. Build plan

- ✅ **B0 — representation + baseline (BYTE-IDENTICAL).** Add a derived
  `BallControlPhase`: `deadBall | keeperHeld | secured | knocked | free`.
  `knocked` recognises the existing outfielder chase as an ongoing control
  process without pretending the ball is owned. Add a shared event-ledger type
  for future probes. No AI or physics consumer. The 120-match baseline shows
  why the gap is visible: outfield possession is secured for 23.8% of playing
  frames, 80.6% of those frames are under the current pressure gate, and the
  ball sits at mean 0.859m (0.858m under pressure). Only 7.10 true knocks occur
  per match; they last 0.656s, reach 1.277m from the carrier and end in 85.1%
  self-regathers / 11.3% opponent gathers. This freezes the existing open-field
  value while B1 addresses close control.
- ❌ **B1a/B1b — two live shortcuts. TRIED + REVERTED.** See §4. They prove that
  neither moving an owned-ball offset nor making every close touch a free-ball
  event provides the required semantics.
- ✅ **B1c-0 — consumer census + representation (BYTE-IDENTICAL). DONE
  2026-07-21.** Mapped
  every `ball.owner` / `ball.pos` / possession / pass-arrival consumer; add the
  minimal `ControlSequence`, break-cause vocabulary and pure
  `derivePossessionLocus`; added the observational probe shell. Nothing live reads
  the new facts. Census: 110 owner + 165 position occurrences across 12 production
  files. The 120-match shell reports zero sequences and all four own-touch violations
  exactly zero. Gates: build clean · 494/494 · both frozen fingerprints exact ·
  profiler determinism OK · 5.25µs/step, 14.8 matches/s. Full record:
  [`CONTROLLED-BALL-COUPLING.md`](CONTROLLED-BALL-COUPLING.md).
- ⬜ **B1c-1 — single-player coupling.** A real ball moves only by bounded
  impulses inside one continuous sequence. Prove speed/turn cadence and zero
  possession transitions with no opponent.
- ⬜ **B1c-2 — physical disruption.** A real opponent touch breaks the lease and
  enters existing M3; an own planned touch does neither. No direct attr winner.
- ⬜ **B1c-3 — live A/B + user play-test.** Gate contact tails, possession
  economy, policy/style/stamina, determinism and perf. The user decides whether
  touches and steals are readable. Pass or full revert, then return to S3–S8.

## 4. B1 experimental record (2026-07-21)

Two causally different candidates were tested; neither landed.

1. **Authoritative owned cadence.** A distance-travelled foot→knock→foot cycle
   kept `ball.owner` while moving the real ball between 0.685m and 1.02m. It
   avoided backwards world-space motion and passed focused mechanism tests,
   but changed the match path enough to create a 113-contact `passArrival`
   chain at seed 103. The restored B0 state on the same 120 seeds has max 8.
   Goals also moved 2.13→2.32. Fully reverted.
2. **Retained close-control release.** A short pressured touch made the ball
   physically free while retaining the carrier's control process; if the
   carrier reached it first, that next foot contact did not reopen M3, while
   an opponent contact still used normal M3 contact→control. The mechanism
   test passed, but live cadence exploded from 7.10→52.92 knocks/match.
   Contests rose 17.00→24.96/match, M3 max recontacts 8→68, midfield loose
   touches 81.27→92.31/match, possession spells 40.92→46.49/match and mean
   spell duration fell 5.73→5.04s. Fully reverted.

This rejects both common shortcuts: continuously rewriting the authoritative
owned-ball offset, and representing every visible footbeat as a possession
release. The approved B1c hypothesis adds the missing boundary:

```text
independent physical ball
+ continuous ControlSequence / lease
+ derived PossessionLocus for macro consumers
+ own touch stays inside the sequence; opponent touch breaks it into M3
```

This remains a hypothesis until each isolated B1c stage passes. Full semantics,
gates and non-goals are in
[`CONTROLLED-BALL-COUPLING.md`](CONTROLLED-BALL-COUPLING.md).

## 5. Stop rule

Do not repeat the rejected M3b/B1a/B1b distance or timer variants. B1c is allowed
only because it changes the causal representation and starts with a
byte-identical consumer census. If any live B1c stage still multiplies M3,
pass-arrival contacts or possession churn—or breaks policy/style/stamina
directionality—fully revert it. The accepted live HEAD remains B0 until B1c-3
passes the user's play-test. There is no automatic follow-on body campaign.
