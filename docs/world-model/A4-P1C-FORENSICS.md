# A4-P1c — THE FORENSIC SAME-SEED RE-READ (the "outlet tax" put on trial: H1 / H2 / H4)

Status: **REPORTED-ONLY, NOT A GATE.** This is adjudication diligence under **ruling
#140** — a same-seed re-read of the first 800 census forks that ADDS possession /
turnover / receive / pass mediators the census never carried, so the commander can
discriminate WHY a granted deep prior raised deep entries. It **verdicts nothing**:
the #140.2 hypotheses are frozen but **not a predicate**, no leg gates anything, and
**the #139 STOP stands regardless of what this re-read finds** (#106.6 undisturbed —
this is not a fourth instrument). Road B throughout: `homeRegionGrant` is `null` in
every production path, the grant lives only inside offline fork clones, and the
production fingerprint `57b0bdab…c673` is unchanged.

Authority: **ruling #140** (the user challenges #139.2 — "后场站着的时候也会接应啊
…后卫也参与转移"; the outlet-tax story rested on `deep↑ ∧ spacing/dupRun improved`
alone, and branch-B possession loss was NEVER measured ⇒ the killer is DOWNGRADED
from finding to HYPOTHESIS; the forensic re-read is authorized; SAME-SEED REUSE IS
THE DESIGN, #140.3; X-COUNT-IDENT is HARD) · **#139** (the census being re-read:
RESOLVEDLY ADVERSE, `Δprimary +0.046066 [+0.039961, +0.052158]`, dose-monotone) ·
**#138** (the instrument — the dormant grant seam + the R3p arm) · the P1 deep/box
detectors (`stage3-v4-p1-calibration.ts`) · `PlayerBrain.ts:320/356/357` (the
`passBackPen` backward test) · the census probe `a4-p1c-grant-census.ts` (world /
fork / branch machinery reused verbatim).

---

## §1 — THE FROZEN HYPOTHESES (QUOTED VERBATIM from #140.2 — may NOT be altered)

> * **H1 — outlet tax (possession dies earlier)**: branch-B turnovers/window ↑
>   resolved; retention time ↓; box entries ↑.
> * **H2 — UNUSED outlet (substrate defect)**: the granted body's deep receives NOT
>   higher in B (backward passes to him rare; passBackPen suspect); turnovers ↑
>   anyway.
> * **H4 — mechanical surrogate artifact**: turnovers ≈ equal and retention ≈ equal,
>   but turnover LOCATION deeper in B; box ≈ NULL; the deep↑ largely a location-shift
>   artifact of the entry counter.
> * Mixtures possible; ALL mediators REPORTED, no gate.

The probe auto-populates a discrimination table MECHANICALLY at the **primary dose
(1.0) − branch A** cell: each prediction gets its point estimate + match-cluster CI
and a bare **matched / unmatched / ambiguous** label (a "≈ equal" prediction is
*matched* only when the CI spans 0; a "NOT higher" prediction is *matched* unless the
delta is resolved-up). Level-only clauses — "backward passes to him rare" and
"turnover LOCATION deeper" — are reported as NUMBERS, not contrasts. **No verdict text
is emitted; the commander reads the table.**

---

## §2 — THE SUBSET (same-seed reuse BY DESIGN, #140.3)

* **Seeds**: `12,000,000 + k, k ∈ 0..799` — the FIRST 800 census matches, verbatim.
  Determinism makes the re-read EXACT and auditable (ruled #140.3); the 800 is FROZEN
  here — **the real run takes NO N env**. It is a SUBSET of the census 12.00M block, so
  it deliberately RE-USES those seeds (not disjoint from the census — that is the
  design); it remains inside the reservation `[11.7M, 12.3M]` and disjoint from the
  P1 / P1b / A4-P1c-smoke blocks.
* **Branches**: **A** (grant null) + **dose 1.0** + **dose 2.0** — a subset of the
  census's `{0.25, 0.5, 1.0, 2.0}` ladder. Every branch is an INDEPENDENT deep clone
  from the SAME fork state (`cloneSimulationState`), so running fewer doses cannot
  perturb the shared branches: the parent trajectory, the qualifying fork moments,
  branch A, and branches B_{1.0} / B_{2.0} are byte-identical to what the census
  computed. Dose 1.0 = the census PRIMARY (the H1/H2/H4 comparison cell); dose 2.0 =
  the saturating top rung.
* **World / fork machinery**: the census R3p arm verbatim (ENRICHED #67.3 + the ARMED
  eye, `v3` base+children+SHA, `v4` inSupportLaw+deliveryBit+offsideBit), the
  #128 wall-free deterministic core, `FORK_SPACING_S = 4.0`, `FORK_CAP_PER_MATCH = 20`,
  `W = 10 s`, match-cluster bootstrap (`BOOTSTRAP_SEED = 100403`, `B = 2000`).

---

## §3 — THE COUNTERS (exact, code-cited)

| counter | definition | code trace |
| --- | --- | --- |
| **deepEntries** | opponent deep-entry-against-d, null→true in `(t_fork, t_fork+10 s]`: `oppOwns && phase==='playing' && localX(ball) < −REST_THIRD` | **BYTE-IDENTICAL** to the census `a4-p1c-grant-census.ts:404-422` (= the P1 detector `stage3-v4-p1-calibration.ts:326-344`). The X-COUNT-IDENT anchor. |
| **boxEntries** | opponent box-entry-against-d, null→true: `oppOwns && playing && localX(ball) ≤ BOX_INNER_X ∧ \|ball.y\| ≤ BOX_WIDTH/2` | the P1 calibration box detector VERBATIM, `stage3-v4-p1-calibration.ts:337-343` |
| **turnovers** | side-d possession losses in the window = `Match.possessionSide` transitions `d → (1−d)` (the persistent possessor; `-1` dead-ball transients are NOT a turnover) | `Match.possessionSide` (`src/sim/Match.ts:507`, set on `gainPossession` :1695) |
| **firstTurnoverTicks** | ticks-since-fork of the FIRST such loss; **CENSORED at `W_MAX_TICKS`** when possession is retained the whole window (retention proxy — higher = more retained) | derived from the turnover counter above |
| **turnoverThird** | the side-d-local third (own / mid / their) of the ball at the FIRST turnover; `none` if retained | `contextOf(localX)` (own = `localX < −REST_THIRD`) |
| **grantedReceives** | times the granted body (side-d **index-1**, the census grantee) GAINS ball ownership: `ball.owner.gid → grantedGid` transition | `ball.owner` (`src/sim/Match.ts`); grantee = `players.find(index===1)` (census verbatim) |
| **grantedReceiveLocalX** | the granted body's OWN localX at each receive, pooled mean per branch (more negative = deeper) | `team.localX(granted.pos.x)` |
| **teamPassesForward / Backward** | side-d NEW `pendingPass` attempts in the window, split by the SAME backward test `passBackPen` uses: `gain = clamp01((localX(target) − localX(passer) + 30)/60)·2 − 1`; `gain > 0 ⇒ forward`, else `⇒ backward` | `gain` def `PlayerBrain.ts:320`; fwd/back split `:356` / `:357` (the `passBackPen` branch); attempts via `Match.pendingPass` (`Match.ts:855`, built `mechanics.ts:246`) |
| **passesToGranted** | side-d pass attempts whose `targetGid === grantedGid` (and its backward subset) | as above, filtered on `pendingPass.targetGid` |

Every counter is READ-ONLY (it reads state AFTER `fork.step(DT)` and never touches the
RNG or control flow), which is what keeps the deep count and the fork trajectory
byte-identical to the census.

---

## §4 — THE X-FAMILY (inherited; X-COUNT-IDENT the new hard one)

* **X-DET (HARD)** — the whole experiment runs TWICE, byte-identical, on the #128
  WALL-FREE deterministic core (the per-match wall is measured OUTSIDE the compared
  payload).
* **X-FORK-IDENT (HARD, 100 %)** — on every fork, branch A equals an INDEPENDENT plain
  clone stepped `W_MAX_TICKS` (zero branch/parent leakage).
* **X-MERGE-IDENT (HARD)** — the injected P3p-1 merged table SHA + rehash identity
  (`39662445…9d6105` / `171a6dad…6559f`), the battery's gate verbatim.
* **E-NONSTATION (HARD)** — the eye ACTIVATES on the R3p world and NEVER overrides the
  ball carrier (the battery's X-SEAM, incl. the #134.2 refinement).
* **X-FP-PROD (HARD)** — the production fingerprint `57b0bdab…c673` is unchanged; the
  src carries only the dormant grant seam (unchanged from the #138 census commit).
* **SEED-REUSE BY DESIGN (#140.3)** — the 800 forensic seeds INTENTIONALLY re-use the
  census 12.00M seeds; disjointness is asserted only against the P1 / P1b / smoke
  blocks and the reservation band, NOT against the census (re-use is the point).
* **X-COUNT-IDENT (HARD, honest form).** The census artifact does NOT store per-fork
  counts, so a direct per-fork equality diff is IMPOSSIBLE. The identity is instead
  guaranteed BY CONSTRUCTION and checked mechanically: (a) the deep-entry counting
  block is COPIED byte-identical from the census; (b) the forensic counters are all
  read-only; (c) the world / fork / branch machinery is reused unchanged ⇒ same parent
  trajectory ⇒ same qualifying forks ⇒ identical branch-A / B deep counts; (d) X-DET +
  X-FORK-IDENT prove the determinism this rests on. The probe reports the 800-subset
  pooled deep delta for eyeball against the census signs (`+0.0461` at dose 1.0) — it
  need not EQUAL the full-N (3800-match) pooled figure, only share sign/shape. **This
  is stated honestly: (a)–(d) prove the counts equal what the census WOULD recompute on
  these 800 seeds; they do not compare against stored numbers the census never kept.**

Any X-family gate failing ⇒ FAIL at the commander (measurement invalid; Road B is the
floor). X-COUNT-IDENT failing (a deep-count drift vs the census logic, or non-
determinism) ⇒ the forensics are INVALID (#140.3).

---

## §5 — DISPOSITION (REPORTED-only; no gate)

The probe writes `docs/world-model/data/a4-p1c-forensics.json`: per-branch pooled means
+ match-cluster CIs for every mediator (A, dose 1.0, dose 2.0, and the paired deltas
dose1−A / dose2−A), the turnover-third distribution, the pooled granted-receive
localX, and the auto-populated H1/H2/H4 discrimination table (matched / unmatched /
ambiguous per prediction, plus the level-reported clauses). **There is no PASS/STOP
here** — the #139 STOP already stands, and #140 holds the #139.5 fork open pending the
commander's read of this table. An H2-leaning read would redirect toward the build-up /
recycling realism track before (or instead of) the offside pivot; an H1-leaning read
leaves #139.3 intact; an H4-leaning read would asterisk the "on ANY world" phrasing.
**The commander adjudicates; the executor only reports.**

**FREEZE HONESTY.** §1 is quoted verbatim from #140.2; §2/§3 cite only already-published
seeds, constants, detectors, and lines; the probe reuses the census machinery and the
P1 detectors unchanged. No `docs/world-model/data/*.json` was opened for any figure in
this document; a bounded 3-match preflight (writing OUTSIDE the repo) confirmed the
counters populate, the branches pair, and X-DET / X-FORK-IDENT / X-MERGE-IDENT /
E-NONSTATION read true; its scratch output was deleted. This doc + probe commit locally
and DO NOT push (the push rides the commander's #140 adjudication).
