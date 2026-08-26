# THE VISION THREE-WAY SPLIT — PLAN + RECONSTRUCTION RECEIPT

> Dispatched by **COMMANDER RULING #350 item 2** (user-ordered: 「a撞身这个说人话,b拆」,
> 2026-08-26), evidence base = [`../VISION-SNAPSHOT-AUDIT-2026-08.md`](../VISION-SNAPSHOT-AUDIT-2026-08.md)
> (#349, tally of record 37 / 34 / 6 / 7 of 84).
>
> **§P = THE FROZEN PLAN** — committed BEFORE any file is modified (commit 1). It
> classifies every line of the pre-split `docs/VISION.md` (HEAD `633fe42`) as
> KEEP / MOVE / DEDUP-§6 and fixes every excision boundary to the byte.
> **§R = THE RECONSTRUCTION RECEIPT** — written in commit 2: the derived line map
> plus the cmp-grade proof that {post-split VISION.md + VISION-STATUS-LEDGER.md +
> this map} re-derives the pre-split byte stream EXACTLY.
>
> ⛔ **ZERO rewording anywhere.** Every moved byte is moved verbatim; every kept
> byte is left verbatim. ZERO `src/**`, ZERO seeds, ZERO stats.

## §P.0 THE CLASSIFICATION RULES (frozen before any file was touched)

Applied in the dispatch's PRIORITY ORDER — an earlier rule beats a later one:

1. **(i) ⛔ EVERY user blockquote (`> 原话` lines) = KEEP.** No exceptions. This
   extends to 原话 quoted INLINE inside prose (§6's two 2026-08-02 quotes): 原话
   never leaves the gold standard (#350), so a line carrying 原话 can never be
   DEDUP'd away either.
2. **(ii) Every iron law, REQUIREMENT (要求 sentences), standard, gate, and section
   scaffold = KEEP.**
3. **(iii) Every dated CODE-STATUS passage the #349 audit inventoried (the 84 rows'
   source sentences and their immediate status-prose context) = MOVE.**
4. **(iv) §6 lines genuinely covered by a PROGRAMME §0.0 / Governance sentence =
   DEDUP** (pointer). Anything unique to §6 = KEEP. See §P.4 — the survey found
   **zero** qualifying lines and quotes both sides for every candidate.
5. **(v) Mixed paragraphs split at sentence boundaries, every sentence accounted
   for, neither half reworded.**

Three operational sub-rules were fixed at the same time, because rule (v) alone
does not determine a boundary in this document's prose:

* **THE SENTENCE IS THE ATOM.** A sub-sentential audited CLAUSE (a parenthetical,
  a `;`-clause, an `——`-clause) inherits the classification of the sentence that
  contains it. Consequence: a sentence that is BOTH an iron law / REQUIREMENT and
  carries a status clause is KEEP by priority (ii) > (iii). The 23 audit rows this
  keeps in VISION are listed one by one in §P.3 — none is silently dropped.
* **THE JOINT RULE.** A MOVE span begins at a sentence start and ends at a `。`
  (or at end-of-bullet). This is what makes the residue grammatical without a
  single reworded byte: no kept fragment is ever left beginning with `。`, `)`,
  `;` or any other closing particle. Where the joint rule and rule (iii) collide,
  the joint rule wins and the passage stays (again: §P.3).
* **THE INDENTATION RULE.** When a line is split, its leading whitespace travels
  with whichever half starts the line. A kept half that begins mid-line therefore
  begins at its first non-whitespace byte and loses no byte of its own. (Markdown
  lazy continuation keeps such a fragment inside its list item.)

**POINTER LINES.** At each excision point ONE line is inserted:

```
⚠ 本处的现状快照已移至 [`VISION-STATUS-LEDGER.md`](VISION-STATUS-LEDGER.md) §Sxx (#350)
```

indented to match the leading whitespace of the excision's start line. The only
departure from #350's literal string is that the filename is a markdown link, in
the house style of every other VISION cross-reference. No two excisions are
adjacent, so no pointer merging was needed: **22 excisions ⇒ 22 pointer lines.**

**THE TWO #349 POINTER LINES ARE NOT EDITED** (L47 in §1, L325 in §3.1). #350
permits editing them if their target changes section; it does not. Their target
is a whole other file (`VISION-SNAPSHOT-AUDIT-2026-08.md`), that file is unmoved,
and both sentences remain true as written. Leaving them byte-identical also keeps
them inside the reconstruction gate instead of exempt from it. They are pointers,
not verbatims, and could have been edited — the plan's choice is not to.

## §P.1 THE LINE ACCOUNTING — every line of the pre-split VISION.md

Pre-split object: `git show 633fe42:docs/VISION.md` — **597 lines, 53,023 bytes.**
Contiguous runs, exhaustive and non-overlapping (`MOVE` = the whole line leaves;
`SPLIT` = the line is cut at the boundary fixed in §P.2, both halves accounted).

| LINES | CLASS |
|---|---|
| L1–L53 | KEEP |
| L54–L59 | MOVE → S01 |
| L60 | SPLIT → S01 |
| L61–L78 | KEEP |
| L79 | SPLIT → S02 |
| L80–L81 | MOVE → S02 |
| L82–L132 | KEEP |
| L133 | SPLIT → S03 |
| L134–L135 | MOVE → S03 |
| L136–L140 | KEEP |
| L141–L142 | SPLIT → S04 |
| L143–L206 | KEEP |
| L207 | SPLIT → S05 |
| L208–L210 | MOVE → S05 |
| L211 | SPLIT → S05 |
| L212–L257 | KEEP |
| L258 | SPLIT → S06 |
| L259–L261 | MOVE → S06 |
| L262–L263 | KEEP |
| L264–L265 | MOVE → S07 |
| L266 | SPLIT → S07 |
| L267–L275 | KEEP |
| L276 | SPLIT → S08 |
| L277 | MOVE → S08 |
| L278 | SPLIT → S08 |
| L279–L280 | KEEP |
| L281–L282 | SPLIT → S09 |
| L283–L345 | KEEP |
| L346 | SPLIT → S10 |
| L347–L349 | MOVE → S10 |
| L350–L357 | KEEP |
| L358–L362 | MOVE → S11 |
| L363–L368 | KEEP |
| L369–L371 | MOVE → S12 |
| L372 | SPLIT → S12 |
| L373–L379 | KEEP |
| L380–L383 | MOVE → S13 |
| L384–L388 | KEEP |
| L389–L391 | MOVE → S14 |
| L392 | SPLIT → S14 |
| L393–L395 | KEEP |
| L396 | SPLIT → S15 |
| L397 | MOVE → S15 |
| L398–L405 | KEEP |
| L406 | SPLIT → S16 |
| L407–L408 | MOVE → S16 |
| L409 | SPLIT → S16 |
| L410–L419 | KEEP |
| L420 | SPLIT → S17 |
| L421–L422 | MOVE → S17 |
| L423 | SPLIT → S17 |
| L424–L438 | KEEP |
| L439 | SPLIT → S18 |
| L440–L442 | MOVE → S18 |
| L443–L454 | KEEP |
| L455 | SPLIT → S19 |
| L456–L462 | MOVE → S19 |
| L463 | SPLIT → S19 |
| L464–L487 | KEEP |
| L488 | SPLIT → S20 |
| L489 | MOVE → S20 |
| L490 | SPLIT → S20 |
| L491–L503 | KEEP |
| L504 | SPLIT → S21 |
| L505 | MOVE → S21 |
| L506 | SPLIT → S21 |
| L507–L515 | KEEP |
| L516 | SPLIT → S22 |
| L517–L518 | MOVE → S22 |
| L519 | SPLIT → S22 |
| L520–L597 | KEEP |

**TOTALS: 597 lines = 511 KEEP-whole + 56 MOVE-whole + 30 SPLIT** (each SPLIT line
contributes bytes to both sides). **DEDUP-§6 = 0** (§P.4). **Pointer lines added:
22.** Post-split VISION.md is therefore 511 + 30 + 22 = **563 lines**.

## §P.2 THE 22 EXCISIONS — exact boundaries, frozen

Each row fixes the excision to the byte by ANCHOR (the boundary is the first
occurrence of the anchor string in that line; every anchor was verified UNIQUE in
its line before this plan was committed). `START` = the moved span begins at the
anchor's first byte (`col 0` = at line start). `END` = the moved span ends at the
anchor's last byte inclusive.

| S | HOME (§ / 条目) | START | END | AUDIT ROWS | #349 VERDICTS |
|---|---|---|---|---|---|
| S01 | §1 头号活体违规 — 「现状（对代码属实）」 | L54 col 0 | L60 `防守贡献 0。` | V01 V02 V03 V04 V05 V06 V07 V08 | 6 PARTIALLY-STALE + 2 FIXED-SINCE (V05 V08) |
| S02 | §1 活阵型的解剖 — 「现状对账」 | L79 `现状对账` | L81 `⑤ 没有。` | V09 V10 V11 V12 V13 | 4 STILL-TRUE + 1 PARTIALLY-STALE (V12) |
| S03 | §1 位置是活的 — (c) 技术诚实 | L133 `(c) 技术诚实` | L135 `H-186a)。` | V16 V17 V18 | STILL-TRUE / PARTIALLY-STALE / UNVERIFIABLE |
| S04 | §1 盯不盯人 #200 — (b) 病根 | L141 `(b) 但 PM-T1` | L142 `绕不过去)。` | V19 | FIXED-SINCE |
| S05 | §1 两层眼睛 — 「现状」 | L207 ` 现状:` | L211 `更深一层的后续**。` | V25 V26 V27 | 3 STILL-TRUE |
| S06 | §2 节奏偏快 — tempo census 登记 + 速度管线 | L258 `同时登记 **tempo census**` | L261 `可按需先做感受。)` | V31 V32 | FIXED-SINCE / PARTIALLY-STALE |
| S07 | §2 动作动画 — 「现状」 | L264 col 0 | L266 `纯 render-only。` | V33 V34 | PARTIALLY-STALE / STILL-TRUE |
| S08 | §2 乱抢判词 — (a) 密度相变 | L276 `(a) **密度相变` | L278 `节奏被逼紧。` | V35 V36 | STILL-TRUE / PARTIALLY-STALE |
| S09 | §2 乱抢判词 — (c) 尺子确实不够 | L281 `(c) **尺子确实不够` | L282 `乱抢活在基线里。` | V37 | PARTIALLY-STALE |
| S10 | §3.1 rest defence — 「代码核实的现状」 | L346 `代码核实的现状(2026-08-02):` | L349 `同族)。` | V39 V40 V41 | 3 STILL-TRUE |
| S11 | §3.1 球-脚界面 — 「代码核实的现状」 | L358 col 0 | L362 `三个场景。` | V43 V44 V45 V46 | 3 STILL-TRUE + 1 PARTIALLY-STALE (V44) |
| S12 | §3.1 前后摇 — 「代码核实的现状」 | L369 col 0 | L372 `来源。` | V48 V49 V50 | 2 PARTIALLY-STALE + STILL-TRUE (V50) |
| S13 | §3.1 拧身传球 — 「代码核实」 | L380 col 0 | L383 `动作区分的一项)。` | V51 V52 V53 | PARTIALLY-STALE / FIXED-SINCE / STILL-TRUE |
| S14 | §3.1 接球后时间维度 — 「解读」的状态句 | L389 col 0 | L392 `不是调参问题。` | V54 | PARTIALLY-STALE |
| S15 | §3.1 接球后时间维度 — 两个 REPORTED 计数器登记 | L396 `⚠ 两个具体缺陷信号` | L397 `已有硬门槛）。` | V55 | STILL-TRUE |
| S16 | §3.1 build-up #213 — (b) 三块地基缺失 | L406 `(b) **build-up` | L409 `安全回收)。` | V56 V57 V58 | 2 UNVERIFIABLE + PARTIALLY-STALE (V58) |
| S17 | §3.1 回撤接应 #223 — (a) 代码级证明 | L420 `(a) **` | L423 `是维度不存在。` | V59 V60 V61 | 2 PARTIALLY-STALE + STILL-TRUE (V60) |
| S18 | §3.1 前插与回撤 #227 — (a) 代码层证实 | L439 `(a) **代码层证实` | L442 `没有眼睛。` | V63 V64 V65 | 2 PARTIALLY-STALE + STILL-TRUE (V64) |
| S19 | §3.1 关系性底座 #231 — (a) 普查 + (b) 排第一的洞 | L455 `(a) **普查按` | L463 `旁证成立。` | V66 V67 V68 | UNVERIFIABLE + 2 PARTIALLY-STALE |
| S20 | §3.1 落点连续 #240 — (a) 离散化残留 | L488 `(a) **DLC 竞价` | L490 `不可表达。` | V73 | PARTIALLY-STALE |
| S21 | §3.1 击球参数空间 #241 — (b) 击球空间早已存在 | L504 `(b) **引擎的击球空间` | L506 `各带写死参数)。` | V74 V75 | STILL-TRUE / PARTIALLY-STALE |
| S22 | §3.1 地图对账 #245 — 对账结论三块 | L516 `对账结论 = ` | L519 `chooser 看不见)。` | V76 V77 V78 V79 | 2 PARTIALLY-STALE + UNVERIFIABLE (V77) + STILL-TRUE (V78) |

**61 of the audit's 84 rows move** (V01–V13, V16–V19, V25–V27, V31–V37, V39–V41,
V43–V46, V48–V55, V56–V61, V63–V68, V73–V79). The other 23 are §P.3.

## §P.3 THE 23 AUDITED ROWS THAT STAY IN VISION — one by one, with the reason

Nothing here is a silent omission: each row below was reached by rule (i), (ii) or
the joint rule, all of which outrank rule (iii).

| ROWS | WHERE | WHY IT STAYS |
|---|---|---|
| V14 | §1 野球模型, L99–100 | Sub-sentential: the 电池 clause sits inside the parenthesis of the doctrine sentence 「位置 = 每个脑子里的粗粒度共识,功能是防撞车」. Any cut leaves a kept fragment beginning `)。` — joint rule. |
| V15 | §1 住址先验, L114–115 | Sub-sentential parenthetical inside 「防反击是涌现副作用(…)。」 — same joint. |
| V20 | §1 盯不盯人 (c), L146–147 | The 先例 half and the iron law 「维度是底座手搭的,行为永远是称重后长出来的」 are ONE sentence joined by `——`; removing the first half leaves 「既有先例:——**维度是…**」. Rule (ii) + joint rule. |
| V21 | §1 #201 (a), L151–152 | The 松紧写死 clause is the `——` tail of the reality sentence 「盯人现实存在…现代默认是区域+人指向混合」; cutting it strands the sentence's `。`. |
| V22 V23 V24 | §1 长眼睛, L164–168 | All three sit inside the ONE 答 sentence that also carries an INLINE 用户原话 (「内切还有禁区包抄,这些球员自己不能长出来吗」) and the 底座缺陷,非选择缺口 doctrine. Rule (i) + (ii). |
| V28 V29 | §1 尾 SUBSTRATE-MAP 脚注, L231–232 | The 「从没 ship 过 / 无 `spaceValue` 符号」 clause is inside the parenthesis of the KEEP sentence pointing at SUBSTRATE-MAP; cutting it leaves a kept fragment beginning `)。`. |
| V30 | §2 节奏锚点, L256–258 | The two 结构性贡献源 and the ordering law 「修法顺序:先落 C5/C7 再重判节奏」 are one `;`-joined sentence ending at 「(且属"故意取舍"级决定)。」. Rule (ii). |
| V38 | §2 乱抢判词 (c) 尾, L282–284 | 「绝对尺…已登记未建 —— 建尺先于任何机制修补。」 — the status and the REQUIREMENT are one `——` sentence. Rule (ii). |
| V42 | §3.1 rest defence 要求, L351 | trapBias sits INSIDE the 要求 sentence. Rule (ii) — the 要求 is exactly what #350 orders kept. |
| V47 | §3.1 球-脚界面 尾, L365–366 | 「已注册为…C6(观赏性警戒:…必须与捅球/回收定价协同设计)。」 — the parenthetical is a binding §2 caution. Rule (ii). |
| V62 | §3.1 回撤接应 (d), L429–430 | Phase 30.5 铁证 is a parenthetical inside the pre-registered PREDICTION sentence (CTB-T2). Rule (ii) + joint rule. |
| V69 V70 V71 V72 | §3.1 出球方式 #235 (b), L473–478 | (b) is ONE sentence: the 代码盘点 runs straight into the mandate 「⇒ 三者统一为一张逐球定价的出球菜单…」 with no `。` between. Cutting the status half leaves 「(b) **代码盘点**:⇒ 三者统一…」. Rule (ii) + joint rule. |
| V80 V81 | §3 尾 街机偏离, L524–526 | A standing instruction (「不要"修"回去」 / 「改动前先分辨…」) whose verdicts are STILL-TRUE and whose whole point is that it binds future work. Rule (ii). |
| V82 | §3 对照数据库, L295–299 | The reference registration + its link is the antecedent of the house-law sentence 「用法:…常数永不进口」. Scaffold, rule (ii). |
| V83 | §4 多样性需要约束, L535 | #350 names **§4 whole** among what stays in VISION. |
| V84 | §6 全门, L560–562 | #350 names §6's unique content as staying; the five-gate list is not duplicated anywhere in PROGRAMME (§P.4). |

## §P.4 §6 DE-DUPLICATION SURVEY vs PROGRAMME §0.0 + Governance — RESULT: 0

Rule (iv) DEDUPs a §6 line only if a PROGRAMME sentence GENUINELY covers it. Both
sides quoted, bullet by bullet:

| §6 BULLET (VISION L…) | NEAREST PROGRAMME SENTENCE | VERDICT |
|---|---|---|
| L560–562 「一次一根杠杆 + probe-first + A/B 才提交…过全门（vitest、visual-debug×2、calibrate、goals-warming、fingerprint 重刷),再提交/打 tag/推。」 | Governance 2: 「After any live change: re-run `npm run fingerprint` + perf baseline and record both in the landing doc.」 + Governance 4: 「Two-commit pattern for pre-registered experiments」 | **KEEP** — PROGRAMME names two gates in another context; the five-gate ship list (V84) exists nowhere else. |
| L563 「**诚实回退**:测不过就回退,如实报告数字;别把不 work 的东西硬上。」 | §0.0 5: 「Pre-registration discipline (gates freeze before runs; predicates never change after sight; FAILs reported as-is)…」 | **KEEP** — covers 「如实报告」, not 「测不过就回退 / 别硬上」. Partial ≠ genuine cover. |
| L564–566 revert→reframe (用户 2026-07-18) | — nothing in §0.0 / Governance | **KEEP** (unique) |
| L567–574 「回退的是实现，不是足球现象」 + 用户 blockquote | — | **KEEP** (rule (i): blockquote) |
| L575 「play 报告驱动 phase」 | — | **KEEP** (unique) |
| L576 「记忆写 durable-only;live 状态进账本」 | — (a harness-level rule, not PROGRAMME's) | **KEEP** (unique here) |
| L577–581 「⭐ **有故事就要有探针(用户原话 2026-08-02:"应该有就是有探针去确定故事")**…因果解释≠测量发现…贵的从来不是探针,是被错误故事引走的下一步。」 | §0.0 6(a): 「**有故事就要有探针**: a causal STORY in a ruling either carries instrument evidence or is labelled HYPOTHESIS — never presented as a finding; a story that matters gets its own forensic probe (same-seed re-read + counters, discriminating predictions FROZEN before the run — the #140 form).」 | **KEEP** — the RULE is genuinely duplicated, but the VISION line carries the 用户原话 verbatim, and rule (i) outranks rule (iv): 原话 never leaves the gold standard (#350). PROGRAMME §0.0 6(a) remains the operational copy; VISION remains the source of the words. |
| L582–585 「⭐ **需要用户拍板的,人话先行(用户原话 2026-08-02:"需要我确定的要说人话")**…(实测:一个下午用户被迫问了三次"说人话",遂立此规)。」 | §0.0 6(b): 「**决策点人话先行**: anything requiring the user's ruling (forks, gates, verdicts) is presented in plain football language FIRST (what happened / what it means / what each option buys and costs); numbers and codenames stay in the rulings, not the decision prompt.」 | **KEEP** — same finding: rule duplicated, 原话 + its provenance are not. Rule (i) > rule (iv). |

⭐ **The survey's honest result is that §6 has nothing to de-duplicate**: its two
genuinely duplicated RULES are exactly the two that carry the user's 原话, and
#350's own ⛔ forbids moving those out of the gold standard. Recorded here rather
than executed, so the next reader does not re-open the question.

## §R THE RECONSTRUCTION RECEIPT

⛔ **An unverifiable split is not shippable** (#350 item 2). The gate is not an
eyeball: it is a committed script that re-derives the PRE-SPLIT byte stream from the
post-split artifacts and `cmp`s it against the blob in git.

**THE SCRIPT**: [`../../scripts/audits/vision-split-reconstruct.mjs`](../../scripts/audits/vision-split-reconstruct.mjs)
— node-runnable, zero dependencies, read-only over the repo.

```
node scripts/audits/vision-split-reconstruct.mjs 633fe42
```

**ITS INPUTS ARE EXACTLY THREE**, and none of them is a copy of the original:

1. post-split `docs/VISION.md` — the KEEP half;
2. `docs/VISION-STATUS-LEDGER.md` — the MOVE half, read out of the
   `<!-- VERBATIM Sxx BEGIN/END -->` delimiters;
3. **the line map below** — which carries **indices only**. The script asserts the map
   is pure ASCII precisely so it cannot smuggle content: every Chinese byte in the
   reconstruction must come out of file 1 or file 2. It also fails if any ledger entry
   is orphaned (present but unreferenced) or if an entry's length has drifted.

**THE MAP.** `{"v":[a,b]}` = post-split VISION.md lines a..b; `{"l":"Sxx","r":[a,b]}` =
lines a..b of ledger entry Sxx's verbatim block; `"nl":1` = a newline terminates that
op in the original stream (a line boundary), `"nl":0` = the next op abuts it inside one
original line (the 30 SPLIT lines of §P.1). Pointer lines are referenced by no op —
that is what makes them additions rather than edits.

<!-- RECONSTRUCTION-MAP BEGIN -->
```json
{
 "ops": [
  {"v":[1,53],"nl":1},
  {"l":"S01","r":[1,7],"nl":0},
  {"v":[55,74],"nl":0},
  {"l":"S02","r":[1,3],"nl":1},
  {"v":[76,127],"nl":0},
  {"l":"S03","r":[1,3],"nl":1},
  {"v":[129,134],"nl":0},
  {"l":"S04","r":[1,2],"nl":0},
  {"v":[136,201],"nl":0},
  {"l":"S05","r":[1,5],"nl":0},
  {"v":[203,250],"nl":0},
  {"l":"S06","r":[1,4],"nl":1},
  {"v":[252,253],"nl":1},
  {"l":"S07","r":[1,3],"nl":0},
  {"v":[255,265],"nl":0},
  {"l":"S08","r":[1,3],"nl":0},
  {"v":[267,270],"nl":0},
  {"l":"S09","r":[1,2],"nl":0},
  {"v":[272,336],"nl":0},
  {"l":"S10","r":[1,4],"nl":1},
  {"v":[338,345],"nl":1},
  {"l":"S11","r":[1,5],"nl":1},
  {"v":[347,352],"nl":1},
  {"l":"S12","r":[1,4],"nl":0},
  {"v":[354,361],"nl":1},
  {"l":"S13","r":[1,4],"nl":1},
  {"v":[363,367],"nl":1},
  {"l":"S14","r":[1,4],"nl":0},
  {"v":[369,373],"nl":0},
  {"l":"S15","r":[1,2],"nl":1},
  {"v":[375,383],"nl":0},
  {"l":"S16","r":[1,4],"nl":0},
  {"v":[385,396],"nl":0},
  {"l":"S17","r":[1,4],"nl":0},
  {"v":[398,414],"nl":0},
  {"l":"S18","r":[1,4],"nl":1},
  {"v":[416,428],"nl":0},
  {"l":"S19","r":[1,9],"nl":0},
  {"v":[430,455],"nl":0},
  {"l":"S20","r":[1,3],"nl":0},
  {"v":[457,471],"nl":0},
  {"l":"S21","r":[1,3],"nl":0},
  {"v":[473,483],"nl":0},
  {"l":"S22","r":[1,4],"nl":0},
  {"v":[485,563],"nl":1}
 ]
}
```
<!-- RECONSTRUCTION-MAP END -->

### §R.1 RESULT — PASS

Run at the commit-2 tree, verbatim stdout:

```
VISION SPLIT — RECONSTRUCTION RECEIPT (#350 item 2)
  base (pre-split)      : 633fe42:docs/VISION.md
  ledger entries        : 22 (S01 S02 S03 S04 S05 S06 S07 S08 S09 S10 S11 S12 S13 S14 S15 S16 S17 S18 S19 S20 S21 S22)
  map ops               : 45 (23 from VISION, 22 from the ledger)
  post-split VISION     : 563 lines, 47620 bytes
  pointer lines added   : 22
  pre-split VISION      : 597 lines, 53023 bytes
  reconstructed         : 597 lines, 53023 bytes
  cmp: no differences
  RESULT                : PASS — byte-identical reconstruction
```

`cmp: no differences` between the reconstruction and `git show 633fe42:docs/VISION.md`
⇒ **every one of the pre-split file's 53,023 bytes survives, verbatim, in exactly one
of {post-split VISION.md, VISION-STATUS-LEDGER.md}.** Zero rewording is not a claim
here, it is a measurement.

### §R.2 WHAT LANDED

| | PRE-SPLIT | POST-SPLIT |
|---|---|---|
| `docs/VISION.md` | 597 lines / 53,023 bytes | 563 lines (511 KEEP-whole + 30 kept split-halves + 22 pointer lines) |
| `docs/VISION-STATUS-LEDGER.md` | — | 22 entries S01–S22, carrying 61 of the 84 audit rows |
| DEDUP-§6 | — | 0 (§P.4, surveyed with both sides quoted) |
| the two #349 pointer lines | L47 / L325 | byte-identical, inside the gate |

⭐ **The split changed no user word, no iron law and no 要求.** What it changed is
AUTHORITY: a dated snapshot of the code now lives in a file where it is allowed to go
stale and can be retired by ruling, and the criterion lives in a file where nothing
expires. That was the whole point of #349's mechanism lesson.
