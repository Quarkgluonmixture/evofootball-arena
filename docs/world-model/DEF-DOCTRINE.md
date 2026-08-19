# DEF — 防守教义 (THE DEFENSIVE DOCTRINE OF RECORD: 防守和进攻一样大,盯人是连续可学的信息决策)

> Registered by ruling #318 (2026-08-19). STATUS: DOCTRINE — design input of the same rank
> as INFO-DOCTRINE (#272) and the aesthetic criterion; NOT a contract. Every future
> defensive-coordination mechanism answers to this file first. The defensive contract that
> would implement it (DF) is drafted separately and gated on the normal arc discipline.

## §-1 THE USER'S WORDS, VERBATIM (2026-08-19, two messages, in order)

1. 「对了,还有几个事情,第一是我们原来规定压迫必须只能有两个人max,但是如果是涌现的话其实
   防守队员会自己决定盯人还是压迫.然后防守现在很多情况下也会乱跑,并且防守经常感觉区域防守,
   链式防守这些可能长不出来.然后我现在发现随着赛季增加进球数会增加,这也是因为防守没有长出
   来对应怎么防守的方法,可能是底座缺失」
2. 「压迫和盯人这块,我觉得其实按照我们的信息理论来说,应该是一个连续的,可学习的.然后也不是
   二选一,盯人的方式有范戴克的那种,佩佩的那种,然后什么时候选择盯哪个人,什么时候换人盯,
   什么时候不盯自己的人去干持球人,什么时候选择拦截线路,什么时候1防2怎么做,这些不仅仅和自己
   的有关,也和教练和球队有关,和队友也有关,这个防守我觉得是很大一块,和进攻一样」

## §0 The ratified mapping (the commander's decomposition, presented in-session)

Defence is NOT a new theory — it is the INFORMATION DOCTRINE applied to the
out-of-possession game, plus the coordination cluster. The user said so themselves
(「按照我们的信息理论来说」). The decomposition:

| the user's clause | the mechanism it names | substrate status (verified 2026-08-19) |
|---|---|---|
| 连续的 | marking TIGHTNESS is already ratified continuous law (#201: the access-time account, "never a mark/don't-mark switch") | ✅ shipped (the L3 arc) |
| 可学习的 | defence books (world 7's doors) + recognition books (slice 1) | ✅ substrate exists — but it LEARNS TIGHTNESS ONLY, never assignment |
| 盯谁 / 换人盯 | ASSIGNMENT decisions consuming private snapshots (who I can see) + learned threat value + teammate state | ⛔ hand-written assignMarks (the #248 debt "assignMarks→对手簇" is exactly this) |
| 不盯自己的人去干持球人 | pressing = a PER-DEFENDER priced decision | ⛔ capped by hand: TeamBrain.ts:363-367 "One presser, two for a pressing side — NEVER three (Phase 31, user)" — the user's OWN old order, correct then (no pricing substrate existed), retired only AFTER the priced decision exists (the width-floor sequence: make it pay, THEN retire the compensator) |
| 拦截线路 | positioning as the latency-free answer (卡身位·封角 — INFO-DOCTRINE §1's standing observation: MUST EMERGE, never hand-coded) | ⛔ canInterceptPass reads exist; no positional CHOICE consumes them |
| 范戴克式 vs 佩佩式 | STYLES EMERGE from per-body attrs × learned books × genes — never templates; the substrate must make BOTH payable (reading wins one way, physicality the other) | ⛔ the attrs exist; the assignment layer does not consume them |
| 1防2 怎么做 | commitment physics (CB layer 1) + time budget: delaying = refusing to commit = keeping both options priced | half-built (commitment yes, coordination no) |
| 和教练/球队/队友有关 | the coach channel (its own door) + team genes + shared snapshots/默契 (INFO-DOCTRINE §1 primitive 5) | ⛔ the six-source cluster is unopened |
| 防守和进攻一样大 | accepted as SCALE LAW for planning: the defensive brain (assignment + coordination) is a virgin domain of the same rank as the attacking chooser | — |

## §1 The ecological half (the user's fourth observation, evidence-matched)

「随着赛季增加进球数会增加」 is a KNOWN, INSTRUMENTED phenomenon: `goals-warming.ts`
(EVO-BLUEPRINT phase-82, "GOAL INFLATION") measures the inflation curve, and BK-T2's own
CONTROL arm sat at 2.865 goals — outside the equilibrium band's 2.7536 ceiling (the
substrate-drift class, disclosed there). The doctrine's reading: attack evolves along a
RICH gene-driven capability surface; defence's coordination layer is part hand-coded
(the caps, assignMarks, the binary Press/Defend threshold at TeamBrain.ts:90) and part
missing (mutual cover, handoffs, line-linking) — so selection improves attack faster
than defence can answer. The recorded co-evolution law applies (the vision-attr lesson):
a smarter attack only balances if defence gets a comparably-high-leverage,
INDEPENDENTLY-EVOLVABLE counter — and #167's Leg S showed the defensive look-value is
NOT selectable under win-only fitness (punish-compactness inherited "make it pay").
区域防守/链式防守长不出来 is therefore a SUBSTRATE question first (do the primitives
exist for a back line to act as a chain — cover, handoff, link) and a SELECTION question
second (does winning see it) — the maxed-genome test discriminates, per standing method.

## §2 What the doctrine binds (for every future DF contract)

1. Press-vs-mark-vs-cover-vs-intercept is ONE CONTINUOUS decision surface per defender —
   priced, snapshot-consuming, book-informed — never an enum, never a cap. The Phase-31
   cap is a compensator: retired only AFTER the priced decision demonstrably prevents
   the swarm it was built to stop (measured, not assumed).
2. Defensive STYLES are emergent regions of that surface (the 范戴克/佩佩 test: both
   must be reachable and both must PAY in the right situations, or the substrate is
   biased).
3. Coordination (换人盯 · 补位 · 链式联动 · 造越位) consumes SHARED information (默契 /
   the coach channel) — it belongs to the six-source cluster and slice-3+ information
   machinery; no hand-written handoff rules.
4. The ecological gate: any defensive slice's exam reports the SEASON-LADDER face
   (goals × generation) beside the match-grain faces — the disease the user named is
   inflation across seasons, so the ruler must see seasons.
5. 乱跑 is a SYMPTOM to diagnose before treatment (assignment churn vs missing cover
   primitives vs chooser thrash) — census first, per the standing method.
