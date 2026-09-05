# LN-T0 — THE OWN-LANE PRICE（让传球者看见自己人：传球之前先看看自己人挡不挡）

> **Authorized by COMMANDER RULING #393 item 5** (item 4 the decision, item 6 the exam that
> follows, item 2 the family table). **Binding contract:**
> [`LN-OWN-LANE-CONTRACT.md`](LN-OWN-LANE-CONTRACT.md) — created by this stage.
>
> **Lineage.** LN-C0 (who stands in the lane) → LN-T1 (the off-ball eyes thin the CROWD, not
> the carom) → LN-C1 (the passer's chosen lane was already blocked by ours) → LN-C2 (which
> chooser; the shell obeyed and bypassed) → LN-C3 (which family; the kick-off tap-back) →
> **this stage builds the price behind a shut door and nothing else.**
>
> ⛔ **THIS STAGE SHIPS NOTHING** (Road B): `lnOwnLanePrice` is default OFF, never env- or
> bundle-armed, named by NO world and NO preset (`src/game/a4World.ts` is NOT EDITED and
> contains no `lnOwnLanePrice`); the gene `lnOwnLaneWeight` is born ABSENT and is not in
> `GENE_KEYS`; the production fingerprint is UNCHANGED — `npm run fingerprint` = the literal of
> record **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** at the seam
> commit. ⛔ **World 12's and world 13's compositions and bytes are untouched** — the user's
> play-test still compares like with like. **ZERO sims of record; the pin suite's walks live in
> the out-of-band scratch band 900,004,000–099.** `npm run build` was NOT run: no entry layer
> names the flag.

## §0 THE WORDS OF RECORD

### RULING #393 item 5 — THE DISPATCH (verbatim)

```text
5. ⭐⭐ **LN-T0 DISPATCHED — 「让传球者看见自己人」 THE OWN-LANE PRICE** (a T0
   seam; SRC EDITS AUTHORIZED for the seam ONLY; Road B: the flag default
   OFF, absent from `a4World` and every preset, the production fingerprint
   57b0bdab…c673 UNCHANGED, world 13's bytes untouched; the BQ-T0 / RC-T0b
   form; a new contract `LN-OWN-LANE-CONTRACT.md` with §6 VISION and §7
   REALITY audits). (i) **M-LN.1 THE OWN-LANE READ**: one pure function in a
   new module (`src/ai/ownLaneSeat.ts`) —
   `ownLaneOpenness(from, aim, ownBodies, passerGid, targetGid)` = the
   shipped `laneOpenness(from, aim, bodies)` CALLED with `ownBodies` filtered
   to outfield, not sent off, not the passer, not the target — LN-C1's
   reconstruction byte for byte, so the seam adds a PRICE and no new
   perception geometry (M-GC.3's "no new channel" precedent); the 1.5 m
   clear-the-kicker guard and the 4 m normaliser are the function's own.
   (ii) **M-LN.2 THE PRICE**: `price = w · (1 − ownLaneOpenness)`, w = the
   gene `lnOwnLaneWeight` (born ABSENT ⇒ 0 ⇒ IEEE-exact identity; read by
   `lnOwnLaneWeightOf(g)` = clamp01, the `dvExposureWeightOf` idiom; NOT in
   GENE_KEYS — no random draws; evolution's opt-in is a later slice), behind
   the MatchConfig flag `lnOwnLanePrice` (explicit boolean, `?? false`,
   readonly, never env-armed). (iii) **M-LN.3 THE THREE SITES**, and only
   these: (a) `groundCandidate` — one more subtraction at the hoisted point
   AFTER `sGc` and BEFORE `sRa`'s form (`sLn = sGc − w · (1 −
   ownLaneOpenness(p.pos, aim, team.players, p.gid, mate.gid))`; the shell
   stays as it is — the graded term complements the binary shell; covers
   to-feet, led and the keeper); (b) the kick-off play-back scorer — `s −= w
   · (1 − ownLaneOpenness(p.pos, mate.pos, team.players, p.gid, mate.gid))`
   inside its loop; (c) the perceived chooser — when the flag is on, the
   own outfield gids enter the snapshot `scope` (the passer perceives his
   own men through the same eyes, with the snapshot's own age), and each
   executable option's `price` is multiplied by `(1 − w · (1 −
   ownLaneOpenness(passer.perceivedPos, target.perceivedPos, own perceived
   bodies, passer, target)))` at the SUBSTITUTION site (inside
   `choosePerceivedPassTarget`'s reduce or immediately before it — the
   executor chooses the smaller cut and says why); the currency mix (a
   score-unit weight applied multiplicatively to a measured probability) is
   STATED in the contract's §4 non-claims and the T0 doc's HONEST LIMITS as
   the seam's declared approximation; the flag OFF ⇒ the scope is
   byte-identical ⇒ the world is byte-identical. No predicate, no threshold,
   no ban (#200 / #328): the argmax still decides. (iv) **PINS**
   (`tests/lnOwnLane.test.ts`, the `bqCushion.test.ts` form): flag OFF ⇒
   whole-match signature (rng state included) byte-identical to HEAD on ≥ 12
   seeds, in the bare world AND in world 13 (`a4MatchFlags(13)` +
   `armA4World`); flag ON + gene ABSENT ⇒ byte-identical (the identity
   arm); flag ON + w > 0 ⇒ on hand-built fixtures each site moves by EXACTLY
   w · (1 − ownLane) (a body on the line; a body 4 m off ⇒ 0; the passer and
   the target excluded; the 1.5 m guard); the kick-off scorer prefers an
   own-clear mate at large w; the perceived chooser's option price falls by
   the factor with an own body on the perceived line; the scope is unchanged
   when the flag is off; the three read sites and the one scope site
   counted by anchored needles (exactly four `lnOwnLanePrice` reads);
   mutants prove each pin alive; fingerprint unchanged; typecheck clean;
   `npm test` green. (v) **THE CONTRACT** `LN-OWN-LANE-CONTRACT.md`: §0 the
   diagnosis chain (the user's 「传到人身上弹回」 × LN-C0/T1/C1/C2/C3's
   mechanism, by field); §1 claims; §2 M-LN.1–3; §3 instruments & the arc
   (T0 → T1′ per item 6); §4 non-claims (the currency mix; the restart
   shape; the through ball's projected aim; no outcome axis); §6 VISION
   audit (眼睛看到的空间; prices not bans; no hand-coded tactic — the weight
   is a gene); §7 REALITY audit (real passers see their own men first; the
   tap-back never hits a teammate). (vi) DOC `LN-T0-OWN-LANE-PRICE.md` (§0
   the words of record; §1 the mechanism; §2 the files; §3 the pins as the
   living inventory; §4 HONEST LIMITS; §DEVIATIONS); ONE commit (seam +
   pins + doc + contract), never pushed; X-SRC-ZERO does NOT apply (a T0),
   but every src edit is listed in §2 and no file outside the seam's list
   changes; `a4World.ts` is NOT edited.
```

### RULING #393 item 4 — THE DECISION (verbatim)

```text
4. ⭐⭐⭐ **THE DECISION (VISION + REALITY).** VISION: 眼睛看到的空间 — a passer
   who cannot see his own men is half-blind, and 真足球的开球回敲从来不会撞在自己人
   身上 — the tap-back is the one pass in football that never hits a
   teammate. REALITY, measured: two of every five caroms the user sees are
   the kick-off tap-back hitting one of ours; the scorer that picks the man
   12 m behind asks only whether opponents are near him and never looks at
   the line; the whole team is packed behind the ball by the restart's own
   shape (own-openness 0.413493), so the line is usually occupied. Beside
   it, the perceived chooser (0.355814 of caroms) sees the corridor for
   opponents and not for us, and the lane argmax (0.148837) sees us only
   inside a 0.635 m shell. ⇒ (i) **THE LANE ARC'S CENSUSES END HERE**, as
   #392 item 4(ii) promised: LN-C0 (who stands in the lane) → LN-T1 (the
   off-ball eyes thin the crowd, not the carom) → LN-C1 (the passer's
   chosen lane already blocked by ours) → LN-C2 (which chooser; the shell
   obeyed and bypassed) → LN-C3 (which family; the kick-off). Five stages,
   one mechanism: THE PASSER'S PRICERS DO NOT SEE HIS OWN MEN. (ii) **LN-T0
   BUILDS THE SEAM** (item 5): ONE graded own-body lane read — LN-C1's
   reconstruction, the shipped `laneOpenness` geometry CALLED with the own
   outfield population minus passer minus target — priced at the THREE
   pricers K names, a born-absent gene, a flag default OFF, the fingerprint
   unchanged, pin suites from birth. (iii) **LN-T1′ EXAMS IT** (item 6) on the
   user's face by family; the kick-off family's "no admissible alternative"
   story (LN-C3 HONEST LIMITS 1–2) is a LABELLED HYPOTHESIS **H-LN-2** with
   the exam as its probe: if the tap-back's carom does not move under a
   price, the restart SHAPE is the lever, a geometry question for after.
   (iv) The backward-pass risk (LN-C1: the clear alternative points
   backward on 0.570033) is the exam's FIRST guard. (v) ③ stays queued; the
   audit's ⑤ stays last. (vi) The user's third sentence has, at last, a
   mechanism, a family table and a seam; his verdict on world 13 remains
   the gate of record.
```

### in plain football language

「传球之前先看看自己人挡不挡。」

今天的引擎是这样的：传球的人问的是「**对面**有没有人在这条线上」。他自己人站在哪儿，他基本上看不
见——只有一个 0.635 米的贴身壳会响一下，而那个壳在最常见的那条路上几乎从不响。结果就是你在场上看
到的：**十次里有七次，他选的那条线在做决定的时候就已经被自己人堵住了**，而且当时几乎总有另一条自己
人不挡的线可以走。最离谱的是**开球回敲**：真足球里，开球往回敲那一脚是全场最不可能撞到自己人的球；
这个引擎里它是撞得最多的一类——因为选人的那个算式只问「他身边有没有对手」，**从头到尾没看过那条
线**，而开球的时候全队都堆在球后面。

这一版把「看自己人」这件事放进一扇**关着**的门。门开了，传球的人在三个地方各多问一句：*这条线上有
没有我自己人*——用的还是引擎自己那把量尺（同一个走廊几何、同一个 1.5 米「贴着我的人挡不住这一脚」
的豁免、同一个 4 米归一化），只是把量的对象从对手换成自己人（不算他自己、不算要传的那个、不算门将、
不算被罚下的）。有人挡就**扣分**，挡得越死扣得越多，扣多少由一个**天生不存在的基因**决定。⛔ 不禁
任何一条线：还是同一个 argmax 在挑，只是被挡住的那条现在有价钱了。

**这一版什么都没上线。** 门是关的，基因是空的，生产指纹一个字节没动。

## §1 THE MECHANISM (what armed means)

**ARMED = a seat + four sites.** The seat is built ONCE per carrier decision, from ONE flag
read, and hoisted ABOVE the kick-off branch because that branch RETURNS before the ladder runs:

```ts
  const lnSeat = match.lnOwnLanePrice ? { w: lnOwnLaneWeightOf(g) } : null;
```

**SITE (a) — THE LANE ARGMAX**, inside the ONE hoisted `groundCandidate`, after the
ground-corridor shell and before the receiver-access term (the chain is now
`s → sDv → sGc → sLn → sRa`, pinned link by link):

```ts
      const sLn = lnSeat === null ? sGc
        : sGc - ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, aim, team.players, p.gid, mate.gid));
      const sRa = raSeat === null ? sLn
        : sLn - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;
```

**SITE (b) — THE KICK-OFF PLAY-BACK SCORER**, one statement inside its own loop. The shipped
expression above it is unchanged character for character; only `const` became `let`:

```ts
      let s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);
      if (lnSeat !== null) {
        s -= ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, mate.pos, team.players, p.gid, mate.gid));
      }
```

**SITE (c1) — THE PERCEIVED SCOPE.** The passer can only price a line his own men stand in if
he PERCEIVES them, so his own outfield gids enter the materialisation scope — through the same
eyes, at the snapshot's own age, no new channel:

```ts
    const lnOwnGids = lnSeat === null ? null : ownLaneScopeGids(p.gid, team.players);
    if (lnOwnGids !== null) for (const gid of lnOwnGids) scope.add(gid);
```

**SITE (c2) — THE PERCEIVED OPTION PRICE.** The factor is built from the snapshot's own
entries for exactly those gids and handed to `choosePerceivedPassTarget`, which multiplies
every EXECUTABLE option's `price` before the reduce:

```ts
        return 1 - ownLanePrice(lnSeat.w, ownLaneOpenness(
          seenPasser.pos, seenTarget.pos, lnOwnPerceived, p.gid, targetGid,
        ));
```

```ts
  const priced = input.ownLaneFactor === undefined ? options
    : options.map((option) => (option.executable
      ? { ...option, price: option.price * input.ownLaneFactor!(option.targetGid) }
      : option));
```

⭐ **THE CUT CHOSEN, AND WHY.** The hook goes INTO the chooser rather than re-ranking in
`PlayerBrain` immediately before `if (chosen) passMate = chosen;`, because re-ranking outside
would need a SECOND copy of the argmax and its tie rule — and a second copy of a decision law
is the thing that drifts. One argmax stays. **Consequence, stated:** the chooser's returned
`options` are the PRICED ones, so `passChoiceTrace`'s stored `options[].price` and the winner's
`price` record the priced value. An UNEXECUTABLE option is left untouched: a man the passer
cannot aim at has no lane to price and never enters the argmax.

### THE IDENTITY PROOF, IN WORDS

With the flag OFF, `lnSeat` is `null`: the two ternaries take their shipped branch, the
`if (lnOwnGids !== null)` body never runs, `lnOwnLaneFactor` is `undefined`, and the chooser's
`priced` IS `options` — the same array object. No openness is computed, no gid is added, no
double moves. **G-OFF measures this rather than asserting it.**

With the flag ON and the gene ABSENT, `lnOwnLaneWeightOf` returns `0`, so `ownLanePrice` is
exactly `+0` for every openness: `sGc − (+0)` is bit-identical to `sGc` for every double
(including `−0`), and `price × (1 − (+0))` is `price × 1`, bit-identical. The scope DOES widen
and the snapshot DOES carry the own entries — which is inert because the chooser's price reads
only the passer, the target and the OPPONENT side of the snapshot (`evaluatePassOption`'s
corridor loop skips `entry.side === passer.side`, and `evaluatePassAffordance`'s own-side loop
feeds `exitOptionCount`, which no priced field consumes). **G-IDENT measures this too.**

## §2 THE FILES

| file | what changed |
|---|---|
| `src/ai/ownLaneSeat.ts` | **NEW.** `OwnLaneBody` (the structural population type), `ownLaneOpenness` (M-LN.1), `ownLanePrice` (M-LN.2's single owner), `ownLaneScopeGids` (M-LN.3(c1)) |
| `src/ai/PlayerBrain.ts` | the import; the hoisted `lnSeat` (the ONE `match.lnOwnLanePrice` read); SITE (a) `sLn` + `sRa` reading `sLn`; SITE (b) `const`→`let` plus one guarded statement; SITE (c1) the two scope statements; SITE (c2) `lnOwnPerceived` + `lnOwnLaneFactor` + the `ownLaneFactor` property on the chooser call |
| `src/ai/perceivedPassChoice.ts` | the optional `ownLaneFactor` input field and its docblock; the `priced` mapping; `executable` / `blind` / the returned `options` read `priced` |
| `src/evolution/genome.ts` | `lnOwnLaneWeight?: number` on `TacticalGenome` (born absent, NOT in `GENE_KEYS`) + `lnOwnLaneWeightOf` |
| `src/sim/Match.ts` | `lnOwnLanePrice?: boolean` config field + `readonly lnOwnLanePrice: boolean` + `this.lnOwnLanePrice = cfg.lnOwnLanePrice ?? false;` |
| `src/sim/League.ts` | the `matchFlags` key union only, on its own line (`League.toJSON` omits `matchFlags` — nothing serializes) |
| `tests/lnOwnLane.test.ts` | **NEW.** THE PERMANENT PIN SUITE — see §3 |
| `tests/dvDeliveryValue.test.ts` | ONE narrowing — §DEVIATIONS 1 |
| `tests/raAccessPrice.test.ts` | ONE narrowing — §DEVIATIONS 2 |
| `docs/world-model/LN-OWN-LANE-CONTRACT.md` | **NEW.** the contract |
| `docs/world-model/LN-T0-OWN-LANE-PRICE.md` | this file |

⛔ **No other file under `src/**` or `tests/**` changed.** ⛔ **`src/game/a4World.ts` is NOT
edited** and contains neither `lnOwnLanePrice` nor `lnOwnLaneWeight`. No new constant, no new
field on `Player`, no entry-layer mention, no probe touched.

## §3 THE PINS (`tests/lnOwnLane.test.ts` — ALL GREEN; **the suite is the living inventory, and the count derives from it**)

* **THE PROHIBITION SET** — `a4World.ts` names neither the flag nor the gene; `a4MatchFlags` at
  every version carries no `lnOwnLanePrice` key; a bare `Match`, a world-13 `Match` and a
  `League.createMatch` match all read `false`; every `src/**` file that mentions the flag is
  either one of the three executable homes or a docblock cross-reference whose every mentioning
  line is a comment; no `process.env` and no bundle default anywhere.
  **CATCHES:** a door that ships by accident.
* **NO SERIALIZATION / BORN ABSENT** — `League.toJSON` omits the flag; `lnOwnLaneWeight` is not
  in `GENE_KEYS`; `randomGenome` / `mutateGenome` / `crossoverGenomes` never write the key; the
  accessor returns `0` for absent, `NaN` and negatives, `1` above the range, and the value
  itself inside it. **CATCHES:** a gene that starts drawing rng, or a clamp that lets a
  negative weight through (a side that would seek its own bodies).
* **⭐⭐ G-OFF** — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on twelve scratch seeds
  in the BARE world AND in WORLD 13's composition, pooled digest, and one DISTINCT digest per
  (world × seed) cell so the comparison is not a degenerate constant. The signature carries the
  score, the phase, the ball's pos/vel/z/vz, every body's pos/vel/heading/stamina, and — last —
  ONE DRAW off the finished match's own rng, which is a pure function of the stream state.
  **CATCHES:** any statement of this seam that executes on the shipped path, and any change in
  the number or order of rng draws.
* **⭐⭐ G-IDENT** — flag ON with the gene ABSENT ≡ flag OFF, byte for byte, same seeds, both
  worlds, with the seat asserted PRESENT at weight zero. **CATCHES:** an arithmetic form that
  is not an exact identity at zero (a division, a `Math.max`, a re-ordered sum), and a scope
  widening that turns out NOT to be inert.
* **⭐⭐ G-BITE** — flag ON at `w = 1` moves the signature on at least one of those seeds in
  each world shape. **CATCHES:** a seam that is wired but dead (the pin that makes G-OFF and
  G-IDENT mean something).
* **⭐⭐ THE GEOMETRY, with a MUTANT on every clause** — a body ON the segment ⇒ openness `0`
  ⇒ price exactly `w` (mutant: the same body 4 m off does not price at `w`); a body 4 m off ⇒
  openness exactly `1` ⇒ price exactly `0` (mutant: at 3.9 m the clamp has not saturated); a
  body 1 m up the line from the kicker is IGNORED by `laneOpenness`'s own 1.5 m guard (mutant:
  the same body at 2 m is not ignored); the passer, the target, the keeper and a sent-off body
  are each excluded (mutant: a plain outfield body at the SAME spot prices at `0` openness);
  and `ownLaneOpenness` EQUALS `laneOpenness(from, aim, <the filtered Players>)` on a live
  roster, strictly between the endpoints, while the UNFILTERED population gives a different
  number. **CATCHES:** a re-typed geometry, a filter clause silently dropped, and the two
  populations drifting apart.
* **⭐ THE PRICE IS THE SINGLE OWNER** — `ownLanePrice(w, o) === w * (1 - o)` across a grid,
  and at `w = 0` the subtraction and the factor are bit-identical for `0`, `−0` and both ends
  of the double range. **CATCHES:** a site growing its own copy of the expression.
* **⭐⭐ SITE (a) EXACTNESS** — on a hand-built scene (one carrier, one clear target, one of
  OURS standing exactly on the line to him) the ENGINE's own reported Pass score falls by
  EXACTLY `ownLanePrice(w, ownLaneOpenness(...))` for the SAME winner. MUTANTS: the wrong sign;
  an empty body set (openness `1`, price `0`); and the blocker moved off the line, where the
  engine's armed score returns to the shut one. A second pin shows the score falls at `w = 1`.
  **CATCHES:** the price applied to the wrong candidate, at the wrong aim, or scaled by a
  multiplier it should sit inside.
* **⭐⭐ SITE (b) EXACTNESS** — LN-C3's own family on a fixture: shut, the scorer takes the
  blocked 12 m mate its `|d − 12| · 0.02` band prefers; armed at `w = 1` it takes the own-CLEAR
  mate 14 m back, with the two prices computed OUTSIDE the engine (the blocked one exactly `1`,
  the clear one strictly less). MUTANT: move the blocker off the line and the armed scorer goes
  back to the 12 m mate. **CATCHES:** a kick-off branch that never sees the seat (it returns
  before the ladder — the reason the seat is hoisted), and a price with no effect on the pick.
* **⭐⭐ SITE (c2) EXACTNESS** — on a hand-built snapshot, every EXECUTABLE option's price is
  exactly `shutPrice × (1 − w · (1 − ownLane))`, the unexecutable one is untouched, the
  returned winner's `price` is the option the argmax compared, and the winner FLIPS from the
  blocked man to the clear one. MUTANTS: the factor with the wrong sign picks a different man;
  the hook `undefined` reproduces the shipped chooser exactly. **CATCHES:** the multiplication
  landing on a field the argmax does not compare.
* **⭐⭐ SITE (c1) THE SCOPE** — on a live world-13 match, the shipped scope materialises NO
  own-side body but the passer, the widened scope materialises them, and every entry the
  shipped snapshot carried is byte-for-byte the same in the widened one. **CATCHES:** a scope
  change that alters what the passer already saw (a different snapshot age, a different
  reconstruction), which would break the identity arm.
* **⭐⭐ THE SEAM MAP** — occurrence COUNTS per needle with EVERY site enumerated (canon,
  VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
  occurrence's site"*, home: `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1): the
  flag's files, its three executable statements in `Match.ts`, its own line in `League.ts`,
  EXACTLY ONE `match.lnOwnLanePrice` read in the brain with the seat line verbatim; exactly
  three `ownLaneOpenness(` and three `ownLanePrice(` calls and one `ownLaneScopeGids(` in the
  brain, each site's statement anchored VERBATIM; exactly two `scope.add(` sites; one
  `lnOwnLaneWeightOf(` call; the through-ball block and `TeamBrain.ts` free of `ownLane`; and
  the seat module's CODE (comments stripped) free of `match.`, `Math.random`, `rng`, `Rng`,
  `perceivedSnapshot`, `closestPointOnSegment`, `/ 4` and `1.5`. **CATCHES:** a fourth site, a
  second flag read, a restated geometry, and a percept pull inside a pure module.
* **⭐ THE FINGERPRINT OF RECORD** is a literal in the suite and the suite RUNS it (the
  `a4HomeGrant` form: a 2-season headless league hashed and compared). ⭐ CANON "pin suites
  from birth" (home: ruling #297 item 7).

⭐ **Receipts are receipts** (home: ruling #289 item 1): the fixture metres and the flip counts
are ARMING PLUMBING — the law's arithmetic proved on a handful of bodies and one door — and are
never quoted as football effect sizes. What the price BUYS is **LN-T1′**'s question, and this
stage ran **ZERO sims of record**.

## §4 HONEST LIMITS

* ⚠⚠ **THE CURRENCY MIX IS THE SEAM'S ONE DECLARED APPROXIMATION.** At the perceived chooser a
  SCORE-UNIT weight multiplies a MEASURED PROBABILITY — `price` there is a reception or
  attempt-value prior out of `passPrior.ts`'s committed census data, while `w` is the same gene
  that subtracts from a utility score at the other two sites. `1 − w · (1 − ownLane)` is a
  dimensionless discount on a probability and is NOT claimed to be a probability. It was chosen
  because it (i) leaves the argmax the decider, (ii) is the EXACT identity at `w = 0`, and
  (iii) uses ONE gene for all three sites so the exam's dose means one thing. A
  currency-correct form — an own-body term inside the corridor read itself — is a LATER DOOR,
  and would be a change to a banked measured axis this stage has no authority over.
* ⚠ **THE PERCEIVED SCOPE CHANGE HAS A PERCEPTION COST THAT IS NOT MODELLED.** Armed, the
  passer materialises his own men as well as the opponents. He gets them at the snapshot's own
  age — no fresher, no extra look, no gaze move — so this is not free information in the
  percept sense. But it IS more bodies in one materialisation, and the engine charges nothing
  for the width of a look. Whether looking for your own men should cost TIME is the IN/O2 gaze
  family's question, not this seam's.
* ⚠ **THE SHELL AND THE GRADED TERM BOTH CHARGE NEAR THE LINE.** `groundCandidate` keeps
  `groundShellHazard`'s binary 0.635 m shell and now adds this graded read, so with both doors
  armed a body inside the shell is priced twice. ACCEPTED AT T0: LN-C2 measured
  `shell.*.legacy.firedShare` at **0.014374**, so the overlap is rare, and retiring the shell
  would edit a banked seam. If the exam finds the double price matters, that is a ruling.
* ⚠ **THE KICK-OFF SHAPE IS UNTOUCHED, AND MAY BE THE REAL LEVER.** The seam prices the
  taker's CHOICE. It moves no body's kick-off position, and LN-C3 measured
  `openFam.<F>.ownOpennessMean` at **0.413493** for that family — the whole team is behind the
  ball by the restart's own geometry. If there is genuinely no clear man, a price cannot invent
  one. That is **H-LN-2**, a LABELLED HYPOTHESIS, and LN-T1′ is its probe.
* ⚠ **LN-C3'S FROZEN INSTRUMENT NO LONGER RE-ANCHORS AT THIS HEAD.**
  `scripts/probes/ln-c3-untraced-family-census.ts` hashes the kick-off play-back scorer's whole
  span from `'  if (match.kickoffKickGid === p.gid) {'`, and this seam adds a statement inside
  it (`const` → `let` on the shipped score line). The line ANCHORS still match; the SPAN HASH
  does not. **The banked census is untouched** (it ran at its own frozen head), and **LN-T1′
  must re-anchor any reused instrument at its own head before its battery** (the BQ-T0 §4
  precedent for BQ-C1).
* ⚠ **WITH THE FLAG OFF THE SHIPPED WORLD STANDS BYTE FOR BYTE**, and this stage states **NO
  FOOTBALL CLAIM**. ARMED means "the capacity exists behind a shut door", not that the world is
  better, not that any face moves.
* ⚠ **WHAT THE EXAM MUST SHOW** (#393 item 6): `firstBody.ownNonTarget` DOWN and RESOLVED,
  published BY FAMILY with LN-C3's rule inherited, with the KICKOFF-PLAYBACK row read for
  H-LN-2 — and the BACKWARD-PASS share as the FIRST guard, because LN-C1's
  `menu.established.bestAlternativeGain.backward` is **0.570033**: the clear alternative points
  backward more often than not, so a price on blocked lines can buy the carom with recycling.
  Completion, interceptions, goals and shots in both directions, offsides in the FLAG form and
  撞车 beside.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **`tests/dvDeliveryValue.test.ts` — ONE NARROWING.** Its chain pin read
   `'      const sRa = raSeat === null ? sGc\n'`. Ruling #393 item 5(iii)(a) orders the own-lane
   subtraction to sit AFTER `sGc` and BEFORE `sRa`, so that link now reads `sLn`. The pin is
   NARROWED, not deleted, in the DF-T0 §P7 form ratified at #323 item 1: the assertion is
   restated as the full chain `s → sDv → sGc → sLn → sRa`, pinned link by link, with the new
   link added. DV-T0's substantive claim is unweakened — `sDv` is still formed from `s` by
   exactly ONE `deliveryRiskPrice` call and is still what the rest of the pricer consumes.
2. **`tests/raAccessPrice.test.ts` — ONE NARROWING.** Its "the RA term is the LAST subtraction"
   pin read `': sGc - raSeat.weight * ...'` and now reads `': sLn - raSeat.weight * ...'`, for
   the same reason and in the same form. RA-T0's claim is unweakened: the deficit is still the
   LAST thing the shared pricer does, still by exactly ONE `receiverAccessDeficit` call.
3. **THE SEAT IS HOISTED ABOVE THE KICK-OFF BRANCH, NOT BUILT BESIDE THE OTHER SEATS.** The
   dispatch's idiom is "the seat object built beside `gcSeat`". MEASURED at this head: the
   kick-off branch sits far ABOVE that construction in the same function and RETURNS inside itself, so a seat
   built there would never reach SITE (b) — the family that holds
   `family.<F>.caromShareOfAllCaroms` **0.403488**. The seat is therefore constructed once,
   higher up, which keeps the ruling's "read the flag ONCE per decision" requirement exactly
   (the brain contains ONE `match.lnOwnLanePrice`, pinned) and serves all four sites.
4. **THE PERCEIVED CUT IS THE HOOK, NOT A RE-RANK.** The ruling left the choice to the
   executor and asked for the reason: re-ranking in `PlayerBrain` would need a SECOND copy of
   the argmax and its tie rule. Consequence declared in §1 and the contract §2: the trace's
   `options[].price` records the PRICED value.
5. **THE DISPATCH'S "exactly four `lnOwnLanePrice` reads" IS DELIVERED AS ONE READ SERVING FOUR
   SITES.** #393 item 5(iv) anticipated four flag reads (three read sites + the scope site).
   One hoisted seat is STRICTER — it makes a per-site divergence structurally impossible — so
   the seam map pins `count(brainSource, /match\.lnOwnLanePrice/g) === 1` and pins the FOUR
   SITES individually by their own anchored statements instead.
6. **ONE MUTANT SUBSTITUTED AT SITE (a).** The dispatch's suggested "target not excluded"
   mutant is VACUOUS at this fixture: the target sits at the END of the segment, so including
   him gives closest-point distance `0` and the same openness the blocker already forces. Two
   live mutants replace it (the empty body set, and the blocker moved off the line); the "target
   excluded" clause itself is mutated in the geometry pins, where it is not vacuous.
7. **COMMITTED ON `main`** (no branch, no push) — the programme's own governance; of record.
8. **A PRE-EXISTING SLOW TEST, NAMED.** `tests/formationEvolution.test.ts`'s ten-season
   trajectory runs just inside vitest's own per-test budget. It TIMED OUT once in an early
   full-suite run under load at this head; MEASURED standalone afterwards at this head AND at
   the dispatch HEAD it passes on both, and this head is the FASTER of the two. The
   commit-gate `npm test` run is GREEN including it. Named rather than left as a mystery: it is
   not this seam's, and no timeout was changed.
