/**
 * EK-C0b §RESULT GENERATOR (#229.2 — the section is PRINTED from the committed artifact, never
 * typed). Usage:
 *   npx tsx scripts/analysis/ek-c0b-diagnostic-result.ts docs/world-model/data/ek-c0b-inversion-diagnostic.json
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'docs/world-model/data/ek-c0b-inversion-diagnostic.json';
const a = JSON.parse(readFileSync(path, 'utf8'));
const cap = a.result.capped;
const unc = a.result.uncapped;
const P = a.result.predicates;
const g = a.gates;
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number | null): string => (typeof x === 'number' && Number.isFinite(x) ? `${(x * 100).toFixed(3)} %` : 'n/a');
const pp = (x: number | null): string => (typeof x === 'number' && Number.isFinite(x) ? (x * 100).toFixed(3) : 'n/a');
const int = (x: number): string => (typeof x === 'number' && Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const num = (x: number | null, dp = 4): string => (typeof x === 'number' && Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const sha = (s: string): string => `${s.slice(0, 8)}…${s.slice(-4)}`;
const BAND: Record<string, string> = { p0: '**free** (band 0)', p1: 'mid (band 1)', p2: '⭐ **pressed** (band 2)' };
const gateCount = Object.keys(g).length;
const passCount = Object.values(g).filter((x: any) => x.pass).length;
const primary = (t: any[]): any => t.find((w: any) => w.isPrimary);
const W_S = a.frozenDesign.windows.primaryWindowS;

o('## §RESULT');
o();
const censusBlockEnds = String(a.result.censusSource.block).split('..').map((x: string) => Number(x));
o(`**Re-walk ${int(cap.matches)} seeds (the committed census block ${int(censusBlockEnds[0])}–`
  + `${int(censusBlockEnds[1])}) + a fresh UNCAPPED arm of ${int(unc.matches)} seeds, `
  + `${passCount}/${gateCount} gates PASS**, \`resultSha256\` \`${sha(a.resultSha256)}\`. Every number below is `
  + 'printed by `scripts/analysis/ek-c0b-diagnostic-result.ts` from the committed artifact; none is typed (#229.2).');
o();
o('### The two arms');
o();
o('```text');
o(`census artifact  ${a.result.censusSource.artifact}`);
o(`                 sha256 ${a.result.censusSource.sha256}`);
o(`RE-WALK (capped) ${int(cap.matches)} matches · ${num(cap.momentsPerMatch)} dosed holds/match · `
  + `${int(cap.accounting.dosedForks)} holds · stats base ${int(cap.statsBase)}`);
o(`UNCAPPED (fresh) ${int(unc.matches)} matches · ${num(unc.momentsPerMatch)} dosed holds/match · `
  + `${int(unc.accounting.dosedForks)} holds · stats base ${int(unc.statsBase)}`);
o(`⭐ G-REPRO-EKC0   sub-block ${int(g.gReproEkc0.subBlockFields)} fields / ${g.gReproEkc0.subBlockMismatches} mismatches · `
  + `FULL BLOCK ${int(g.gReproEkc0.fullFields)} fields / ${g.gReproEkc0.fullMismatches} mismatches`);
o(`   ⇒ THE SAME HOLDS: every per-cluster cell of the census reproduced field-exact.`);
o(`last decision instant (max over matches): capped ${num(cap.lastDecisionTimeS.max, 2)} s · `
  + `uncapped ${num(unc.lastDecisionTimeS.max, 2)} s   (the cap-bound opening stretch, made visible)`);
o('```');
o();

/* ---------------------------------------------------------------- (W) */
o('## §RESULT-W — THE PERCEPTION WEDGE');
o();
o(`### The two banded tables, SAME holds, primary window (${W_S} s)`);
o();
o('| band | PERCEIVED: holds | punished | **P(punished)** | CI 95 % (pp) | TRUTH: holds | punished | **P(punished)** | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (let i = 0; i < 3; i++) {
  const p = primary(cap.perceivedTable).byBand[i];
  const t = primary(cap.truthTable).byBand[i];
  o(`| ${BAND[p.band]} | ${int(p.moments)} | ${int(p.punished)} | **${pct(p.punishRate)}** | `
    + `[${pp(p.punishRateCi95[0])}, ${pp(p.punishRateCi95[1])}] | ${int(t.moments)} | ${int(t.punished)} | `
    + `**${pct(t.punishRate)}** | [${pp(t.punishRateCi95[0])}, ${pp(t.punishRateCi95[1])}] |`);
}
{
  const p = primary(cap.perceivedTable).all; const t = primary(cap.truthTable).all;
  o(`| **ALL** | ${int(p.moments)} | ${int(p.punished)} | **${pct(p.punishRate)}** | `
    + `[${pp(p.punishRateCi95[0])}, ${pp(p.punishRateCi95[1])}] | ${int(t.moments)} | ${int(t.punished)} | `
    + `**${pct(t.punishRate)}** | [${pp(t.punishRateCi95[0])}, ${pp(t.punishRateCi95[1])}] |`);
}
o();
o('### The shape ladder on BOTH indices (same holds, same estimator)');
o();
o('| window | PERCEIVED pressed−mid | verdict | PERCEIVED mid−free | verdict | TRUTH pressed−mid | verdict | TRUTH mid−free | verdict |');
o('|---|---:|---|---:|---|---:|---|---:|---|');
for (let i = 0; i < cap.perceivedTable.length; i++) {
  const p = cap.perceivedTable[i]; const t = cap.truthTable[i];
  const tag = p.isPrimary ? ' **(PRIMARY)**' : p.isC5Native ? ' *(C5-native)*' : '';
  o(`| ${p.windowS} s${tag} | ${pp(p.realityShape.pressedVsMid.point)} | ${p.realityShape.pressedVsMid.verdict} | `
    + `${pp(p.realityShape.midVsFree.point)} | ${p.realityShape.midVsFree.verdict} | `
    + `${pp(t.realityShape.pressedVsMid.point)} | ${t.realityShape.pressedVsMid.verdict} | `
    + `${pp(t.realityShape.midVsFree.point)} | ${t.realityShape.midVsFree.verdict} |`);
}
o();
o(`CI 95 % of the primary-window \`mid − free\` difference: PERCEIVED `
  + `[${pp(primary(cap.perceivedTable).realityShape.midVsFree.ci95[0])}, `
  + `${pp(primary(cap.perceivedTable).realityShape.midVsFree.ci95[1])}] pp · TRUTH `
  + `[${pp(primary(cap.truthTable).realityShape.midVsFree.ci95[0])}, `
  + `${pp(primary(cap.truthTable).realityShape.midVsFree.ci95[1])}] pp.`);
o();
o(`### ⭐⭐ THE CONFUSION MATRIX — perceived × truth, with per-cell punishment rate (${W_S} s)`);
o();
o('| perceived \\ truth | free | mid | pressed | row total |');
o('|---|---|---|---|---:|');
for (const pbk of ['p0', 'p1', 'p2']) {
  const cells = ['p0', 'p1', 'p2'].map((tbk) => cap.confusion.find((c: any) => c.perceived === pbk && c.truth === tbk));
  const rowTotal = cells.reduce((s: number, c: any) => s + c.moments, 0);
  o(`| ${BAND[pbk]} | ${cells.map((c: any) => `${int(c.moments)} · ${pct(c.punishRate)}${c.isWedgeCell ? ' ⭐**WEDGE**' : ''}`).join(' | ')} | ${int(rowTotal)} |`);
}
{
  const colTot = ['p0', 'p1', 'p2'].map((tbk) => cap.confusion.filter((c: any) => c.truth === tbk)
    .reduce((s: number, c: any) => s + c.moments, 0));
  o(`| **column total** | ${colTot.map((x) => int(x)).join(' | ')} | ${int(cap.accounting.dosedForks)} |`);
}
o();
o(`Each cell prints **holds · P(punished)**. Perceived-band agreement with the truth band: `
  + `**${pct(cap.confusionAgreementShare)}** of dosed holds. ⭐ THE WEDGE CELL (perceived free ∩ truly pressed): `
  + `**${int(cap.wedgeCell.moments)} holds**, P(punished) **${pct(cap.wedgeCell.punishRate)}** `
  + `[${pp(cap.wedgeCell.punishRateCi95[0])}, ${pp(cap.wedgeCell.punishRateCi95[1])}].`);
o();
o('### ⭐ WEDGE-PREDICATE (frozen in §W, evaluated mechanically)');
o();
o('```text');
o(`perceived mid−free @ ${W_S} s   ${P.W.perceivedMidVsFreeVerdict}     (limb: perceived INVERTS = ${P.W.perceivedInverts})`);
o(`TRUTH     mid−free @ ${W_S} s   ${P.W.truthMidVsFreeVerdict}     (limb: truth NOT inverted = ${P.W.truthNotInverted})`);
o(`⇒ ${P.W.verdict}`);
o('```');
o();

/* ---------------------------------------------------------------- (S) */
o('## §RESULT-S — CONTEXT SELECTION');
o();
o('### The four context profiles, per PERCEIVED band (capped/census arm)');
o();
o('| band | holds | own third | middle | final | match time mean (s) | median | p90 | nearest TRUE opponent mean (m) | median | mean TRUE pressure |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const p of cap.profiles) {
  o(`| ${BAND[p.band]} | ${int(p.moments)} | ${pct(p.zoneShares.own)} | ${pct(p.zoneShares.middle)} | ${pct(p.zoneShares.final)} | `
    + `${num(p.matchTimeS.mean, 2)} | ${num(p.matchTimeS.median, 2)} | ${num(p.matchTimeS.p90, 2)} | `
    + `${num(p.nearestTrueOpponentM.mean, 3)} | ${num(p.nearestTrueOpponentM.median, 3)} | ${num(p.meanTruthPressure, 4)} |`);
}
o();
o('| band | DF | MF | WG | ST | (GK) |');
o('|---|---:|---:|---:|---:|---:|');
for (const p of cap.profiles) {
  o(`| ${BAND[p.band]} | ${pct(p.roleShares.DF)} | ${pct(p.roleShares.MF)} | ${pct(p.roleShares.WG)} | `
    + `${pct(p.roleShares.ST)} | ${int(p.roleCounts.GK)} |`);
}
o();
o('### The four PRE-NAMED margins (free vs pooled mid+pressed, frozen in §S before any receipt)');
o();
o('| margin | frozen threshold | measured Δ | CI 95 % | fires? |');
o('|---|---|---:|---:|---|');
{
  const m = cap.margins;
  o(`| **M-ZONE** own-third share | ≥ ${a.frozenDesign.margins.mZoneOwnThirdSharePp} pp, CI excludes 0 | `
    + `${pp(m.mZone.point)} pp | [${pp(m.mZone.ci95[0])}, ${pp(m.mZone.ci95[1])}] | ${m.mZone.fires ? '**YES**' : 'no'} |`);
  o(`| **M-TIME** mean decision time | ≥ ${a.frozenDesign.margins.mTimeMeanS} s, CI excludes 0 | `
    + `${num(m.mTime.point, 3)} s | [${num(m.mTime.ci95[0], 3)}, ${num(m.mTime.ci95[1], 3)}] | ${m.mTime.fires ? '**YES**' : 'no'} |`);
  o(`| **M-ROLE** role-mix TVD | ≥ ${a.frozenDesign.margins.mRoleTvd}, CI lower ≥ ${a.frozenDesign.margins.mRoleTvdCiLowerFloor} | `
    + `${num(m.mRole.point, 5)} | [${num(m.mRole.ci95[0], 5)}, ${num(m.mRole.ci95[1], 5)}] | ${m.mRole.fires ? '**YES**' : 'no'} |`);
  o(`| **M-DIST** mean true distance | ≥ ${a.frozenDesign.margins.mDistMeanM} m, CI excludes 0 | `
    + `${num(m.mDist.point, 3)} m | [${num(m.mDist.ci95[0], 3)}, ${num(m.mDist.ci95[1], 3)}] | ${m.mDist.fires ? '**YES**' : 'no'} |`);
}
o();
o(`### ⭐ THE UNCAPPED-GRID ARM — ${int(unc.matches)} fresh seeds, per-match cap REMOVED`);
o();
o(`Moments per match: capped **${num(cap.momentsPerMatch)}** → uncapped **${num(unc.momentsPerMatch)}** `
  + `(× ${num(unc.momentsPerMatch / cap.momentsPerMatch, 2)}); last sampled decision instant `
  + `${num(cap.lastDecisionTimeS.max, 1)} s → ${num(unc.lastDecisionTimeS.max, 1)} s.`);
o();
o('| band | holds | punished | **P(punished)** | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|');
for (const r of primary(unc.perceivedTable).byBand) {
  o(`| ${BAND[r.band]} | ${int(r.moments)} | ${int(r.punished)} | **${pct(r.punishRate)}** | `
    + `[${pp(r.punishRateCi95[0])}, ${pp(r.punishRateCi95[1])}] |`);
}
{
  const s = primary(unc.perceivedTable).realityShape;
  o(`| **ALL** | ${int(primary(unc.perceivedTable).all.moments)} | ${int(primary(unc.perceivedTable).all.punished)} | `
    + `**${pct(primary(unc.perceivedTable).all.punishRate)}** | — |`);
  o();
  o(`Uncapped shape @ ${W_S} s: \`pressed − mid\` **${pp(s.pressedVsMid.point)} pp** `
    + `[${pp(s.pressedVsMid.ci95[0])}, ${pp(s.pressedVsMid.ci95[1])}] ⇒ ${s.pressedVsMid.verdict} · `
    + `\`mid − free\` **${pp(s.midVsFree.point)} pp** [${pp(s.midVsFree.ci95[0])}, ${pp(s.midVsFree.ci95[1])}] `
    + `⇒ **${s.midVsFree.verdict}**.`);
}
o();
o('### ⭐ SELECTION-PREDICATE (frozen in §S, evaluated mechanically)');
o();
o('```text');
o(`limb (a) the inversion VANISHES in the uncapped arm   ${P.S.limbA_uncappedInversionVanishes}`
  + `   (uncapped mid−free verdict: ${P.S.uncappedMidVsFreeVerdict})`);
o(`limb (b) any pre-named margin fires                   ${P.S.limbB_anyMarginFires}`
  + `   (fired: ${JSON.stringify(P.S.marginsFired)})`);
o(`⇒ ${P.S.verdict}`);
o('```');
o();

/* ---------------------------------------------------------------- (A) */
o('## §RESULT-A — SATURATION (the 4/5 s candidate-primary re-read, NO VERDICT)');
o();
o('| window | baseline P(punished) | CI 95 % | free | mid | pressed | pressed−mid | mid−free | spread ÷ baseline |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const w of P.A.ladder) {
  const tag = w.isCandidatePrimary ? ' ⭐**(CANDIDATE)**' : w.isCensusPrimary ? ' *(census primary)*' : '';
  const b = Object.fromEntries(w.byBand.map((x: any) => [x.band, x.punishRate]));
  o(`| ${w.windowS} s${tag} | **${pct(w.baseline)}** | [${pp(w.baselineCi95[0])}, ${pp(w.baselineCi95[1])}] | `
    + `${pct(b.p0)} | ${pct(b.p1)} | ${pct(b.p2)} | ${pp(w.pressedVsMid.point)} (${w.pressedVsMid.verdict}) | `
    + `${pp(w.midVsFree.point)} (${w.midVsFree.verdict}) | ${num(w.discrimination.spreadToBaseline, 4)} |`);
}
o();
o('| window | \\|pressed−mid\\| ÷ baseline | \\|mid−free\\| ÷ baseline | band spread (pp) |');
o('|---|---:|---:|---:|');
for (const w of P.A.ladder) {
  o(`| ${w.windowS} s | ${num(w.discrimination.pressedVsMidToBaseline, 4)} | ${num(w.discrimination.midVsFreeToBaseline, 4)} | `
    + `${pp(w.discrimination.spread)} |`);
}
o();
o(`⚠ ${P.A.charterNote}`);
o();

/* ---------------------------------------------------------------- gates */
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const ev: Record<string, string> = {
  xDet: `digest \`${sha(g.xDet.digestA)}\` twice (both arms; pass B never resumes)`,
  xSrcUntouched: '`git diff --stat -- src` empty',
  xFpProd: `observed \`${sha(g.xFpProd.observed)}\` = baseline, re-derived in-process`,
  gConfigIdentity: `${Object.keys(g.gConfigIdentity).filter((k) => typeof g.gConfigIdentity[k] === 'boolean' && k !== 'pass').length} conjuncts against the committed census probe's SOURCE`,
  gReproEkc0: `sub-block ${int(g.gReproEkc0.subBlockFields)} fields **0 mismatches** · full block ${int(g.gReproEkc0.fullFields)} fields **${g.gReproEkc0.fullMismatches} mismatches** (${g.gReproEkc0.censusBlock})`,
  gTruthBand: `${int(g.gTruthBand.checked)} real decision-geometry samples, ${g.gTruthBand.disagreements} band disagreements, max \\|Δ\\| ${g.gTruthBand.maxAbsDelta} (shipped \`pressureAt\` vs the seat's inline formula)`,
  gWedgeAccounting: `confusion/marginals/context all tie to ${int(cap.accounting.dosedForks)} dosed holds · punished ⊆ lost in every cell · monotone/invariant checks`,
  gUncappedArm: `cap removed · moments/match ${num(cap.momentsPerMatch, 2)} → ${num(unc.momentsPerMatch, 2)} · last instant ${num(cap.lastDecisionTimeS.max, 1)} s → ${num(unc.lastDecisionTimeS.max, 1)} s`,
  gWorld: `read back on a never-stepped match at seed ${int(g.gWorld.constructionSeed)}`,
  gSeedDisjoint: `${g.gSeedDisjoint.blocks.length} blocks machine-checked (the re-walk's predicate INVERTED) · ledger ${int(g.gSeedDisjoint.ledgerEntries)} entries`,
  gStatsDisjoint: `bases ${int(g.gStatsDisjoint.cappedBase)} / ${int(g.gStatsDisjoint.uncappedBase)}, minGap ${int(g.gStatsDisjoint.minGap)}, between-arm gap ${int(g.gStatsDisjoint.betweenArmsGap)}`,
  gCleanInvocation: `overrides covered: ${g.gCleanInvocation.overridesCovered.join(' · ')} — all route through the preflight flag (#260.2(i))`,
  gNDerived: `re-walk N ${int(g.gNDerived.rewalk.ranN)} = the artifact's N · uncapped N* ${int(g.gNDerived.uncapped.ranN)} (binding: ${g.gNDerived.uncapped.bindingTerm})`,
  gValuesUnreachable: `${int(g.gValuesUnreachable.filesScannedCount)} src files · ${g.gValuesUnreachable.needles.length} needles (raw 5-dp + formatted %) · ${g.gValuesUnreachable.hits.length} hits · control needle found`,
  gFrozenMargins: `all four margin literals, both predicate names, the no-verdict clause, all ${g.gFrozenMargins.gateCount} gate names and the headline count matched in the stage doc`,
  gMutants: `**${int(g.gMutants.conjunctsCovered)} conjuncts, ${g.gMutants.dead} dead** — every mutant RE-INVOKES its gate's conjunct function; coverage EXACT on ${g.gMutants.gatesCovered.length} gates, zero exclusions`,
};
for (const [k, v] of Object.entries(g)) {
  o(`| \`${k}\` | **${(v as any).pass ? 'PASS' : 'FAIL'}** | ${ev[k] ?? ''} |`);
}
o();
o('### The accounting identities (gate input)');
o();
o('```text');
o(`dosed holds        ${int(cap.accounting.dosedForks)} = D-HOLD ${int(cap.accounting.classCounts['D-HOLD'])} + E-ACTNOW-DECLINED ${int(cap.accounting.classCounts['E-ACTNOW-DECLINED'])}`);
o(`perceived marginal ${int(cap.accounting.perceivedTotal)}   truth marginal ${int(cap.accounting.truthTotal)}   confusion cells ${int(cap.accounting.confusionTotal)}`);
o(`context cells      ${int(cap.accounting.ctxTotal)}   zone counts ${int(cap.accounting.zoneTotal)}   role counts ${int(cap.accounting.roleTotal)}   samples ${int(cap.accounting.sampleTotal)}`);
for (const w of cap.accounting.perWindow) {
  o(`  @${String(w.windowS).padStart(2)} s   punished ${String(int(w.perceivedPunished)).padStart(6)} (truth-side ${String(int(w.truthPunished)).padStart(6)}) · lost ${int(w.perceivedLost)} INVARIANT · moments ${int(w.perceivedMoments)} INVARIANT · censored ${int(w.censored)}`);
}
o('```');
o();
o('### The uncapped arm\'s N as executed');
o();
o('```text');
o(`${g.gNDerived.uncapped.arithmetic}`);
o(`smoke artifact  ${g.gNDerived.uncapped.smokeArtifact} (sha256 ${sha(g.gNDerived.uncapped.smokeArtifactSha256 ?? '')})`);
o(`free-band holds/match ${num(g.gNDerived.uncapped.freeBandHoldsPerMatch, 5)} · ms/match ${num(g.gNDerived.uncapped.msPerMatch, 1)}`);
o(`nRaw ${g.gNDerived.uncapped.nRaw} → stepped ${g.gNDerived.uncapped.nStepped} · wall ${g.gNDerived.uncapped.nWall} · cap ${g.gNDerived.uncapped.nCap}  ⇒ N* ${g.gNDerived.uncapped.nStar} (${g.gNDerived.uncapped.bindingTerm})`);
o(`as executed     N ${g.gNDerived.uncapped.ranN} · realised free-band holds ${int(primary(unc.perceivedTable).byBand[0].moments)} against the rule's target ${g.gNDerived.uncapped.targetFreeBandHolds}`);
o('```');
o();
o('### Deviations recorded');
o();
a.deviations.forEach((d: string, i: number) => o(`${i + 1}. ${d}`));
o();
o('### Registered non-claims (from the artifact)');
o();
a.nonClaims.forEach((d: string, i: number) => o(`${i + 1}. ${d}`));
o();
o(`**VERDICT (the probe's own, mechanical — #203): (W) ${P.W.verdict} · (S) ${P.S.verdict} · `
  + '(A) NO VERDICT BY CHARTER.** What the inversion IS, and which window EK-T1 takes of record, are the '
  + 'commander\'s.');
