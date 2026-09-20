# IF — THE FLIGHT-RUN CONTRACT (球在飞时的前插 · 看见传球出去,球员自己决定起跑)

> **What this contract binds.** Whether a body may price his own run in behind when the ball he
> SEES has just left a teammate's foot and is in the air — the run onto a ball already
> travelling: the third man going as the first pass travels, the striker spinning as the ball is
> played into the midfielder. Today NO form of run can start in that state: the coach's licence
> needs a carrier (`PlayerBrain.ts` `carrier ? carrier !== p : restart || crashLive ||
> crossLive`) and the player's own run (DS, M-DS.7) needs a PERCEIVED owner. Authority:
> **COMMANDER RULING #417 item 2** (this contract bound), standing on **#416 items 1 and 4**
> (IF-C0 banked as measurement; the table read) and on **THE USER'S RULING at #417 item 1** —
> the IF fork of #416 item 5 resolved **甲**, VERBATIM: 「肯定是甲,现实里就是这样的」 (anchored in
> `docs/VISION.md` §3.1 the same round). Method docs govern as always; VISION is the gold
> standard; the DS contract ([`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md)) is the
> parent — this contract extends M-DS.7's state guard and touches nothing else of the DS law.

---

## §0 THE DIAGNOSIS CHAIN — the numbers of record

Every number below is QUOTED from [`IF-C0-FLIGHT-RUN-CENSUS.md`](IF-C0-FLIGHT-RUN-CENSUS.md) §R
(the artifact [`data/if-c0-flight-run-census.json`](data/if-c0-flight-run-census.json) is the
numbers of record) at 6 dp, arm **`OWNCOOP-E13`** (world 17's door set on world 13, the OBM seat
absent — the arm of record) with the shipped coach **`HATS-E13`** beside; ≈ marks the one face
ruling #416 item 3(i) DOWNGRADED (its predicate is unfixtured; the fixture is IF-T0's first pin).

1. **Nobody has ever started a run onto a ball already travelling to him.** The eventual
   receiver of a completed pass STARTED HIS RUN DURING THE FLIGHT
   `receiver.classShare.startedDuringTheFlight` = **0.000021** (1 / 47,184) on `HATS-E13` and
   **0.000021** (1 / 46,609) on the arm of record; on the INTENDED receiver alone it is
   **0.000000** on all four arms. The intended-receiver share of in-flight run starts ≈ **0 /
   3,166** (≈ 0 / 614 on HATS). The reason is STRUCTURAL and code-mapped (§R5): both licence
   forms need someone credited with the ball.
2. **The coach's own run never starts in flight either.** `licensedRunInBehind` starts with a
   mate on the ball **1.000000** of the time on every arm; the coach's only in-flight starts are
   his set-piece machinery (`attackingTheBox` 0.112809 in flight, 0.883492 at the restart;
   `arrivingLate` 0.054550).
3. **"In flight" on the shipped path is mostly not a pass.** Of the coach's in-flight run starts
   **0.845496** have NO pending pass at all (loose balls, clearances); his side's own pass in the
   air is 0.614615 run starts a match. On the arm of record the in-flight share of run starts is
   `run.inFlightShare` = **0.083077** (HATS **0.027587**).
4. **The own run's in-flight starts are the EYES, not a decision.** Own runs started with the
   TRUTH ball in flight: **2.771772** per match; of them `stalePasserStillCredited` =
   **0.894186** (2,476 / 2,769) — the perceived ball a median **33 ticks** old (all stamped
   starts: median 0) — and `aFreshMateWhoIsNotThePasser` = 0.105814. The stale-owner leak on
   in-flight starts is **0.402597** (2,697 / 6,699). ⭐ That leak is honest perception (VISION §1
   感知诚实) and it is NOT the run onto a flight; this contract does not touch it (§4).
5. **The passer in world 17 has half the runners the coach used to give him at the strike.**
   Same-side bodies already running at a release: **1.176840** (HATS) → **0.644204** (arm of
   record); the eventual receiver already running at the release **0.264051** → **0.146066**.
6. **THE TIMING FACT (Q4).** Δt = next same-side release − run start; the NEGATIVE half (a run
   onto a ball already travelling) is **0.004264** (605 / 141,902) on the shipped path and
   **0.039719** (3,151 / 79,333) on the arm of record — the latter the leak's own runs. The flight
   is TOWARD the runner on **0.117814** of in-flight starts on his side's pass.

**THE DIAGNOSIS.** The percept exists — `ObservedBall` carries `pos · vel · ownerGid ·
observedTick · ageTicks`, so a body can SEE a ball with no owner moving — and the decision that
reads it does not. That is a substrate gap of exactly the DS kind (VISION §1): the only bodies
that react to a ball in the air are the ones the coach sent. **THE USER'S RULING (#417 item 1),
VERBATIM: 「肯定是甲,现实里就是这样的」** — the run onto a flight is the player's own decision, and
real football is made of it.

## §1 CLAIMS

* **C-IF.1** A body who has SEEN the ball leave a teammate's foot may price his own run in
  behind for it — the same candidate, the same menu, the same argmax as everything else he does.
* **C-IF.2** The state he prices it in is READ OFF HIS OWN EYES AND HIS OWN MEMORY: the ball he
  perceives has no owner, and the last body he perceived with the ball was a same-side mate.
  No truth, no `pendingPass`, no constant.
* **C-IF.3** The coach's convention (rank, count) restrains the flight run exactly as it
  restrains the at-feet run; the flight state adds a licence, not a weight.
* **C-IF.4** Whether the flight run pays, floods, or is chosen by selection is a QUESTION FOR
  MEASUREMENT (IF-T1); nothing ships before the commander rules on it.

## §2 THE MECHANISM — M-IF.1–4 (IF-T0) — all dormant

* **M-IF.1 — THE FLIGHT STATE, PERCEIVED.** Inside the own-run fork (`PlayerBrain.ts`
  `if (match.dsOwnRun) { … }`), under a SECOND dormant flag `match.ifFlightRun`, the state guard
  M-DS.7 admits ONE more perceived state: `snapshot.ball !== null && snapshot.ball.ownerGid ===
  null` (the ball he sees is loose or in the air) **AND** the last owner this body perceived
  (M-IF.2) resolves on the ROSTER to a same-side mate other than himself (gid / side identity
  tests — the M-DS.7 form). In that state the SAME candidate is pushed with the SAME score
  (M-IF.3) and a distinct `why: 'own run onto the flight'` — **the EIGHTH literal**, pinned, with
  the seven unchanged; the two states are mutually exclusive by construction (owner-is-mate ⇒
  the seventh; owner-null ∧ last-seen-mate ⇒ the eighth). ⛔ NO predicate on a football
  quantity (#200): no distance, no age bound, no velocity threshold — identity tests only. ⛔ NO
  truth read: not `match.ball`, not `ball.owner`, not `pendingPass`, not `lastTouch`. ⛔ NO
  second pull: the fork's existing single `perceivedSnapshot(p)` pull serves both states.
* **M-IF.2 — THE LAST-PERCEIVED-OWNER MEMORY.** ONE per-body belief, `ifLastSeenOwnerGid`
  (a `Map<gid, gid | null>` on `Match`, created EMPTY), written ONLY inside the flag at the fork
  site: whenever the pulled snapshot's ball has a non-null `ownerGid` (a mate, an opponent, or
  himself) it overwrites the entry. An opponent seen with the ball therefore CLEARS the mate
  state; a ball never seen leaves it empty; a restart taker seen with the ball becomes the last
  owner. It is the body's OWN memory of who he last saw with the ball at his own decision
  cadence — never the truth's `lastTouch`, never another body's memory. Flag absent ⇒ never
  written, never read ⇒ byte-identical (G-OFF).
* **M-IF.3 — THE SCORE IS UNCHANGED.** `W.runScore · prior · restraint · obmRunMul · (tired ?
  OFFBALL_TIRED_MUL : 1)` in DS-T0's own statement order, `prior` and `restraint` from M-DS.6″
  over the same perceived mates. NO new constant, NO new gene, NO new weight. ⭐ CLARIFIED at #419
  item 3: the restraint ranks the mates his eyes hold MINUS the perceived carrier IF there is one —
  in the eighth state there is none (`ownerGid === null` by construction), so the body he REMEMBERS
  with the ball ranks like any mate. The two states therefore rank over different mate sets; that
  is the law, not a defect (nobody has the ball; the passer is a runner like the rest), and IF-T1
  prints the eighth class's own restraint partition as a face.
* **M-IF.4 — BORN INCUMBENT-EQUIVALENT (#200), DORMANT, CONTAINED.** `match.ifFlightRun`
  defaults OFF (`cfg.ifFlightRun ?? false`, the `dsCoopHatsOff` idiom; the League union key; no
  env door; named by NO world or preset). ABSENT ≡ explicitly FALSE. The flag lives INSIDE the
  own-run fork: armed without `dsOwnRun` it does nothing (pinned — zero eighth-why decisions
  over whole matches). The fork's COMPLETE READ SET, restated: his own `pos`/`role`/`stamina`,
  the roster's `gid`/`side`/`role`/`sentOff`/`index`, his own snapshot's `ball.ownerGid` and
  the mates' snapshot copies, his own `ifLastSeenOwnerGid`, `obmRunMul`, `W.runScore`,
  `team.localX`, `runnerCount`'s three inputs — and ⛔ NOT `pendingPass`, NOT `pendingPassWindup`,
  NOT any truth `pos`/`vel`/`owner`, NOT `info.genome`.

* **M-IF.5 — THE GAME IS LIVE (IF-T0b, ruling #422 item 2).** The eighth state additionally requires
  `match.phase === 'playing'` — the whistle, a state every body shares (the field R1 reads; the coach's
  licence reads it through `restart`). At a dead ball the eighth state is FALSE; the seventh state is
  untouched. An identity test on a match state; no constant.
* **M-IF.6 — HE SAW IT LEAVE: THE TWO-LOOK FRESHNESS (IF-T0b, ruling #422 item 2).** The per-body belief
  becomes a record `{ ownerGid, look }` — the gid he last saw with the ball AND THE INDEX OF THE LOOK that
  wrote it — beside ONE per-body look counter `ifLook: Map<gid, number>` (created empty), incremented once
  per own-run evaluation under the flag at the fork site (his own decision cadence: a hatted or
  wall-licensed body does not look, because the fork does not run for him). The eighth state holds ONLY
  when the belief was written AT HIS IMMEDIATELY PREVIOUS LOOK (`belief.look === thisLook − 1` — "the
  previous", an index equality like `cands.length − 1`; ⛔ not a tick bound, ⛔ not an age bound) AND the
  belief's gid resolves on the roster to a same-side mate other than himself AND the ball he sees NOW
  has no owner. A previous look that saw no owner, or an opponent, or a sighting more than one look ago
  ⇒ he does not start. M-IF.2's write rule is unchanged. The fork's read set becomes SEVEN `match`
  members (`dsOwnRun` · `ifFlightRun` · `ifLastSeenOwnerGid` · `ifLook` · `perceivedSnapshot` · `phase` ·
  `simTime`). ⛔ No truth ball, no `pendingPass`, no `lastTouch`; ⛔ no second pull; ⛔ no constant.

## §3 INSTRUMENTS AND THE ARC

* **IF-C0** (done, #416 item 1) — the census of record (§0).
* **IF-T0** (next — #417 item 3, the dispatch of record) — the seam and its permanent pin suite
  (`tests/ifFlightRun.test.ts`): G-OFF byte-identical in bare · 13 · 16 · 17 on ≥ 12 scratch
  seeds; the fingerprint; ABSENT ≡ false; the memory EMPTY over whole matches with the flag
  absent; ARMED — the eighth `why` appears only with the flag AND `dsOwnRun`; the pull count per
  own-run evaluation UNCHANGED (one); the read set pinned by source needles over the fork span;
  the seam map (flag occurrence counts per file); the seven literals unchanged + the eighth
  exactly once; ⭐ THE INTENDED-RECEIVER FIXTURE (the census's unfixtured predicate, #416 item
  3(i)) written here as the suite's first fixture; the mutant walk (M1 the flight clause dropped
  · M2 the memory never written · M3 the flag read inverted · M4 the last-owner test reading
  truth `match.ball.owner` — must die on a perceived-vs-truth divergence seed). Dormant. Ships
  nothing.
* **IF-T1** (DONE at #421 — READ 2 of record: *the flight run carries a face*, G9 through balls UP +49 %; the flood printed; the restraint fork 等待裁决 — #421 item 3; dispatched at #420 item 2) — the exam on E13, the OBM seat ABSENT:
  **`OWNCOOP-E13`** (world 17's door set, THE CONTROL) · **`OWNCOOP+IF-E13`** (the same + `ifFlightRun`,
  the world-18 candidate) · `HATS-E13` beside; `OWNCOOP-D13` / `OWNCOOP+IF-D13` beside. R1 (the flood
  face, `beyondToleranceUp`), the band (F-DS-b, ten limbs), the eighth `why` as its OWN class with its
  start-state · restraint (#419 item 3) · yield partitions, and IF-C0's Q4 faces AS FACES (by field
  name): the negative Δt half, the receiver started-during-flight share, bodies already running at the
  release, the intended-receiver share (fixtured), the leak partition (unchanged by construction —
  printed), the in-flight own-run yield vs at-feet. ⭐ THE ≈ STAMP (#418 item 2(v)): the exam runs on
  the x64 host; IF-C0's arm64 values are printed beside as ≈, never selecting; the control arm is the
  exact comparator. THE READS, frozen at #420 item 2(iii) and copied here CHARACTER FOR CHARACTER, on
  `OWNCOOP+IF-E13` vs `OWNCOOP-E13`:
  > **read 1** — *"THE FLIGHT RUN COSTS NOTHING THE BAND CAN SEE — IF-ENTRY is named (world 18 = 17 +
  > the run onto the flight)."*
  > **read 2** — *"THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides between a
  > restraint slice and stop with the table."*
  > **read 3** — *"THE FLIGHT RUN FLOODS — the restraint needs the flight: a restraint slice is named
  > before any entry."*
  > **the FALLBACK** — *"THE READS DO NOT COVER THE SHAPE — the commander decides with the table."*
  PRECEDENCE: a breach ⇒ read 2; else `floods` ⇒ read 3; else read 1; the fallback only on an ABSENT
  stored boolean. Liveness (`gBiteIF`) is a precondition of every read: RED ⇒ *"THE SEAM DID NOT FIRE —
  no read"*.
* **IF-T0b** (ruling #422 item 3 — 「看见出脚」 the restraint slice: M-IF.5 + M-IF.6 under the same
  dormant flag; pins re-recorded; seven fixtures; seven mutants; the DS-T0c member-set pin 5 → 7). Ships
  nothing.
* **IF-T1b** (DONE at #424 — READ 1 of record: *the flight run costs nothing the band can see — IF-ENTRY is named*; the band holds on all four pairs, R1 ×1.195 not a flood, G9 unresolved; the eighth class 731 → 46 per match; dead-ball starts 0; ruling #422 item 4 — the IF-T1 exam re-walked by recipe on block 12,560,000–999 with the
  amended seam; the SAME three reads + fallback + precedence + liveness precondition; the start state by
  phase and by look distance added as a stored partition; #421 item 4's corrections applied at the
  freeze; IF-T1's x64 numbers the exact prior twin, IF-C0's arm64 ≈).
* **IF-ENTRY** (DISPATCHED at #424 item 5 — world 18 = 17 + `ifFlightRun`, the DS-ENTRY-2 rung form: one
  door, no gene, no constant; the door set proven the exam's; identity below 18 arch-keyed; the honest
  brief in the player's language traced by field and arm; the user's eye gate 「看见出脚就跑 (v18) — keep |
  change | revert」 opens at the push after the entry's PASS).
* **ENTRY or STOP** — the commander's, on the read: world 18 = 17 + `ifFlightRun`, or a
  restraint slice, or stop. Nothing ships before it.

## §4 NON-CLAIMS

This contract claims **nothing** about: **the leak** (the stale-owner in-flight own run — 乙 was
NOT chosen FOR THE LEAK at #417; at #422 the two-look freshness IS chosen AS THE RESTRAINT of the eighth state — M-IF.6 — while the leak itself, the stale-owner in-flight OWN run of the seventh state, stays as honest perception and is PRINTED at IF-T1 / IF-T1b, never fixed here) · **a
timing model** (the flight run may be early or late against the line; the OBM seat is absent
and no ETA is read) · **the flight's direction or value** (a run may start on a backpass or a
clearance the body believes was a mate's — his belief, honestly wrong sometimes) · **coordination
between passer and runner** (RC 默契 dormant and HELD; no shared read exists) · **the through
ball's chooser** (the passer still targets bodies already running or standing; whether he learns
to play into a flight run is selection's) · **corners, crosses, restarts** (their branches
untouched) · **that the flight run PAYS, floods, or is selected** (IF-T1 measures; C-IF.4) · **the
eighth `why`'s effect on frozen instruments** (probes that classify seven literals put the eighth
in OTHER and read RED at re-run — declared at IF-T0, none edited).

## §6 VISION audit record (the #91 form, clause-by-clause at drafting)

* **vs §1 共同 prior ≠ 逐 tick commander** — the run stays the body's own decision; the coach's
  rank/count convention restrains it as before; no order is issued. PASS.
* **vs §1 感知诚实 (像人眼一样获得数据)** — the second state is read off HIS OWN snapshot and HIS
  OWN memory of who he last saw with the ball; a body who did not see the pass leave cannot
  start; a body with old eyes may start on a ball an opponent has since cleared — honestly
  wrong, as a player is. No truth read. PASS.
* **vs §1 底座给能力,不替球队定行为** — a CAPABILITY (one more state in which the run may be
  priced), no mandate; who runs, how often, whether it pays — the argmax's, the genes', the
  eye's. PASS.
* **vs the #200 red line** — identity tests only (gid / side / roster); no age bound, no
  distance, no velocity threshold, no constant. PASS.
* **vs §1 不要写死预设** — no number is introduced; the eighth `why` is a LABEL for the ledger,
  not a weight. PASS.
* **vs §2 watchability** — IF-T0 shows the user nothing by construction; the eye judges at the
  entry after IF-T1. DEFERRED, as the family does.
* **#422 (M-IF.5 / M-IF.6)** — vs 感知诚实: two looks of his own, his own counter — PASS; vs 共同
  prior: the coach's count still restrains, unchanged — PASS; vs 底座给能力: a narrower licence, no
  mandate — PASS; vs #200: identity tests only (a game state, an index equality, roster identity) —
  PASS; vs 不要写死预设: no number; "the previous look" is a name — PASS.
* Amendments produced: none.

## §7 REALITY audit record (the #201 standing rule)

* **THE USER'S RULING, VERBATIM: 「肯定是甲,现实里就是这样的」.** A real forward does not wait to
  be credited with a run: the third man goes as the first pass travels; the striker spins the
  moment the ball is played into the midfielder's feet; the winger attacks the space as the
  switch is struck. The run and the pass are one shared decision, and a real part of it starts
  AFTER the strike. PASS — the mechanism builds the missing half.
* **THE ENGINE'S ZERO IS NOT FOOTBALL.** 1 receiver in 47,184 completions started his run during
  the flight; 0.004264 of runs on the shipped path start after a release. IF-C0 §R4. PASS as a
  diagnosis; the size of the cure is IF-T1's.
* **A real player runs on what he SAW, and he is sometimes wrong.** He starts on a pass he saw
  leave a teammate's boot; he does not start on one he did not see; he may start on a ball an
  opponent has since intercepted if his eyes were elsewhere. M-IF.2's belief is exactly that
  memory and exactly that fallibility. PASS.
* **#422 — THE USER DELEGATED TO VISION** (「按照vision来吧，开始自走」): a real forward goes when he
  sees the ball leave the boot — not because his side had it a while ago (IF-T1: 0.833177 of the
  memories were of a mate who was not the passer); nobody sprints in behind on a dead ball before it is
  taken (0.227300 of the starts were) — the set-piece run is the coach's machinery, untouched. PASS.
* **Honest gaps, named**: (a) a real runner times the flight run against the LINE and the
  receiver's first touch — no timing model here (the OBM seat absent); (b) real runners and
  passers READ EACH OTHER — a glance, a shape — nothing here builds that (RC held); (c) the real
  third-man run is aimed at the NEXT pass, not the ball in the air — the engine's run target
  (`runTarget`) is in behind, not toward the flight's landing; whether that reads as football is
  the eye's question at the entry.

## STATUS

* **#417 (2026-09-13) — THE IF FORK RESOLVED 甲 BY THE USER; THIS CONTRACT BOUND; IF-T0 the dispatch
  of record (launched at the next round).** Nothing built yet; nothing ships. The queue: IF-T0 →
  IF-T1 → entry / a restraint slice / stop.
* **#418 (2026-09-19) — IF-T0 AMENDED for the host's architecture change and DISPATCHED.** The
  programme's digests are arm64 numbers; this x64 host reproduces none (ruling #418 item 1). IF-T0's
  G-OFF and fingerprint pins are keyed by `process.arch` (the x64 column recorded here; the arm64
  column inherited by identity from DS-T0d's literals for bare · 13 · 15 · 16, absent for 17); the
  suite verdict = green outside the #418 inventory. IF-T1's reads against §0's table will be
  ≈-stamped (cross-architecture); its own control arm on this host is the exact comparator.
* **#419 (2026-09-19) — IF-T0 LANDED (`d0f4a79`, verifier PASS, zero HIGH); M-IF.3 clarified (the
  remembered passer ranks as a mate in the eighth state); IF-T0-FIX dispatched (the door and belief reads
  moved INSIDE the fork, the DS-T0c member-set pin narrowed 3 → 5, four doc corrections). IF-T0 banks at
  the FIX's PASS; then IF-T1's dispatch ruling.
* **#420 (2026-09-19) — IF-T0 BANKED-DORMANT (`d0f4a79` + the FIX `e65b198`, both verifier PASS); §3 IF-T1
  rewritten with the three frozen reads; IF-T1 「球在飞时的前插 · 考」 DISPATCHED (block 12,559,000–999 booked
  at its freeze; the first exam on the x64 host — G-REPRO architecture-aware, the ≈ stamp on every IF-C0
  twin). Next: IF-ENTRY / a restraint slice / stop on the read.
* **#421 (2026-09-19) — IF-T1 BANKED (`ff34357` / `fd613f4`, verifier PASS, 27 / 27 gates); THE READ OF RECORD =
  read 2 (a breach: G9 through balls per match UP, the only one, on every door-carrying pair; R1 floods ×3.16,
  printed). The state licenses more than the user's sentence (memory of another mate 0.833177; own-side dead
  balls 0.227300 of starts). 等待裁决: 甲 死球不算 · 乙 亲眼看见出脚 · 丙 球往前飞 (a #200 question) · 丁 停; the
  commander's lean 乙 + 甲. Nothing dispatched; no world 18.
* **#422 (2026-09-19) — THE RESTRAINT FORK RESOLVED BY DELEGATION TO VISION: 乙 + 甲. M-IF.5 (the game is
  live) and M-IF.6 (the two-look freshness) BOUND; IF-T0b DISPATCHED → IF-T1b on block 12,560,000–999;
  丙 (the flight's direction) HELD behind the #200 red line. Nothing ships.
* **#423 (2026-09-19) — IF-T0b LANDED (`159f671`, verifier PASS; M-IF.5 / M-IF.6 built; the OFF world unmoved,
  pinned as an identity); the M5 mutant row's runtime scene FIXED ahead of the rerun (IF-T0b-FIX); IF-T1b
  DISPATCHED on block 12,560,000–999 — the same three reads; §4's 乙 clause amended (乙 not chosen for the
  leak, chosen as the restraint). Next: IF-ENTRY / 丙 (the user's) / stop on the read.
* **#424 (2026-09-20) — IF-T1b BANKED (`b55b62d` / `272cbf6`, verifier PASS, 28 / 28 gates); READ 1 of record —
  IF-ENTRY named; 乙 + 甲 removed both the flood and the breach; 丙 never needed, still HELD; the same-architecture
  re-walk gated with zero mismatches on the control arms. IF-ENTRY 「看见出脚就跑 · 世界 18」 DISPATCHED; the user's
  eye gate opens at the push after its PASS.
