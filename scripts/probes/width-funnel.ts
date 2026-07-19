/**
 * Probe (2026-07-19): WHY is width impotent? clump-vs-wide showed WIDE scores
 * ~0 from crosses. This traces the wide pipeline as a FUNNEL to find where it
 * dies — delivery, aerial contest, keeper claim, or finish:
 *
 *   crosses delivered → became a shot (assist cross/cutback) → on target
 *   → goal   (vs saved / missed / blocked)
 *
 * Run WIDE vs CLUMP (the wide team is the one that SHOULD punish a central
 * clump). If crosses rarely become shots, the leak is delivery/contest; if
 * they become shots but never goals, it's the keeper/finish. Contrast against
 * CLUMP's carry funnel so the asymmetry is visible.
 *
 *   npx tsx scripts/probes/width-funnel.ts [matchesPerPairing]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type MarkScheme, type TeamInfo, type TeamStyle } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 40);

const genome = (over: Partial<Record<string, number>>): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
  for (const [k, v] of Object.entries(over)) (g as unknown as Record<string, number>)[k] = v!;
  return g;
};
const squad = (): PlayerAttributes[] => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
};
const CLUMP = genome({ attackingWidth: 0.12, defensiveCompactness: 0.9, dribbleBias: 0.85, passBias: 0.3, riskTolerance: 0.6 });
// The "wide" opponent — two flavours (arg[3]): 'poss' = possession-width
// (pass-heavy, low dribble; can't reach the byline) · 'wing' = the winger
// archetype that SHOULD emerge (high width + high dribble → carry the line to
// the byline → cutback/cross). Compact defence stays so the flank is open.
const ARCH = process.argv[3] ?? 'poss';
const WIDE = ARCH === 'wing'
  ? genome({ attackingWidth: 0.95, defensiveCompactness: 0.5, dribbleBias: 0.8, passBias: 0.45, overlapW: 1, tempo: 0.6 })
  : genome({ attackingWidth: 0.95, defensiveCompactness: 0.3, dribbleBias: 0.3, passBias: 0.85, tempo: 0.7 });

// arg[4] forces the CLUMP defence's scheme (man | zonal); default man.
const DEF_SCHEME = (process.argv[4] as MarkScheme) ?? 'man';
const clumpStyle: TeamStyle = { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: DEF_SCHEME };
const info = (name: string, g: TacticalGenome): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: g, squad: squad(),
  ...(name === 'CLUMP' ? { style: clumpStyle } : {}),
});

type Bucket = {
  matches: number; gf: number; crosses: number; headersWon: number; saves: number;
  shots: number;
  // shots keyed by what SERVED them
  crossShots: number; crossGoals: number; crossSaved: number; crossMiss: number;
  cutbackShots: number; cutbackGoals: number;
  carryShots: number; carryGoals: number;
  // cross-contest resolution (who owns the ball ~1.2s after a cross):
  cxGK: number; cxDef: number; cxAtt: number; cxLoose: number;
  // box picture at the moment of delivery: attacking runners vs defenders
  cxN: number; boxAtt: number; boxDef: number; boxAttAfter: number;
  // reach: seconds/match with a carrier in the byline zone (wide+deep)
  bylineTime: number; boxTouches: number;
};
const zero = (): Bucket => ({
  matches: 0, gf: 0, crosses: 0, headersWon: 0, saves: 0, shots: 0,
  crossShots: 0, crossGoals: 0, crossSaved: 0, crossMiss: 0,
  cutbackShots: 0, cutbackGoals: 0, carryShots: 0, carryGoals: 0,
  cxGK: 0, cxDef: 0, cxAtt: 0, cxLoose: 0, cxN: 0, boxAtt: 0, boxDef: 0, boxAttAfter: 0,
  bylineTime: 0, boxTouches: 0,
});
const tally: Record<'CLUMP' | 'WIDE', Bucket> = { CLUMP: zero(), WIDE: zero() };

let seed = 1;
for (let k = 0; k < K; k++) {
  const clumpHome = k % 2 === 0;
  const m = new Match({
    seed: seed++,
    teamA: clumpHome ? info('CLUMP', CLUMP) : info('WIDE', WIDE),
    teamB: clumpHome ? info('WIDE', WIDE) : info('CLUMP', CLUMP),
    duration: 300,
  });
  const clumpSide = clumpHome ? 0 : 1;
  const nameOf = (side: number) => (side === clumpSide ? 'CLUMP' : 'WIDE') as 'CLUMP' | 'WIDE';
  const prevCross = [0, 0];
  const pending: { crosserSide: number; at: number }[] = [];
  const HL = 52.5, BOX_DEPTH = 13, BYLINE_MIN = HL - 17, BYLINE_MAX = HL - 3;
  while (!m.finished) {
    m.step(DT);
    // detect a fresh cross per side
    for (let side = 0; side < 2; side++) {
      const c = m.teams[side].stats.crosses;
      if (c > prevCross[side]) {
        pending.push({ crosserSide: side, at: m.simTime + 1.2 });
        // box picture at delivery: count bodies in the opp box central zone
        const t = m.teams[side];
        const b = tally[nameOf(side)];
        b.cxN++;
        for (const q of t.players) {
          if (q.role === 'GK') continue;
          if (t.localX(q.pos.x) > HL - 16 && Math.abs(q.pos.y) < 14) b.boxAtt++;
        }
        for (const o of m.teams[1 - side].players) {
          if (o.role === 'GK') continue;
          if (t.localX(o.pos.x) > HL - 16 && Math.abs(o.pos.y) < 14) b.boxDef++;
        }
      }
      prevCross[side] = c;
    }
    // resolve matured crosses: who owns the ball now?
    for (let i = pending.length - 1; i >= 0; i--) {
      if (m.simTime < pending[i].at) continue;
      const { crosserSide } = pending.splice(i, 1)[0];
      const b = tally[nameOf(crosserSide)];
      const own = m.ball.owner;
      if (!own) b.cxLoose++;
      else if (own.role === 'GK') b.cxGK++;
      else if (own.side === crosserSide) b.cxAtt++;
      else b.cxDef++;
      // box population NOW (1.2s after delivery — crashers have burst in)
      const t2 = m.teams[crosserSide];
      for (const q of t2.players) {
        if (q.role === 'GK') continue;
        if (t2.localX(q.pos.x) > HL - 16 && Math.abs(q.pos.y) < 14) b.boxAttAfter++;
      }
    }
    // reach: byline occupancy + box touches for the carrier's team
    const own = m.ball.owner;
    if (own && own.role !== 'GK') {
      const t = m.teams[own.side];
      const lx = t.localX(own.pos.x);
      if (Math.abs(own.pos.y) > 13 && lx > BYLINE_MIN && lx < BYLINE_MAX) tally[nameOf(own.side)].bylineTime += DT;
      if (lx > HL - BOX_DEPTH && Math.abs(own.pos.y) < 20) tally[nameOf(own.side)].boxTouches += DT;
    }
  }
  const r = m.getResult();
  for (const [name, side] of [['CLUMP', clumpSide], ['WIDE', 1 - clumpSide]] as const) {
    const b = tally[name];
    const s = r.stats[side];
    b.matches++;
    b.gf += r.score[side];
    b.crosses += s.crosses;
    b.headersWon += s.headersWon;
    b.saves += r.stats[1 - side].saves; // saves the OPPONENT keeper made against us
    b.shots += s.shots;
  }
  // Walk the shot log — bucket each shot by what created it + its outcome.
  // NB: header shots (most cross outcomes) DON'T set `assist`, but BOTH cross
  // and cutback collapse to channel 'cross' (goalChannelFor). So the cross
  // channel = all wide-served shots; `assist === 'cutback'` splits out the
  // ground cutback subset for contrast.
  for (const e of m.shotLog) {
    const name = e.side === clumpSide ? 'CLUMP' : 'WIDE';
    const b = tally[name];
    if (e.channel === 'cross') {
      b.crossShots++;
      if (e.outcome === 'goal') b.crossGoals++;
      else if (e.outcome === 'saved') b.crossSaved++;
      else b.crossMiss++;
    }
    if (e.assist === 'cutback') {
      b.cutbackShots++;
      if (e.outcome === 'goal') b.cutbackGoals++;
    }
    if (e.channel === 'carry') {
      b.carryShots++;
      if (e.outcome === 'goal') b.carryGoals++;
    }
  }
}

const per = (x: number, n: number) => (x / Math.max(n, 1)).toFixed(2);
console.log(`WIDE[${ARCH}] vs CLUMP width funnel — ${K} matches, all attrs 0.5\n`);
for (const name of ['WIDE', 'CLUMP'] as const) {
  const b = tally[name];
  const n = b.matches;
  console.log(`${name}:  GF/m ${per(b.gf, n)}   shots/m ${per(b.shots, n)}   crosses/m ${per(b.crosses, n)}   headersWon/m ${per(b.headersWon, n)}`);
  console.log(`  cross funnel:   deliver ${per(b.crosses, n)}  →  shot ${per(b.crossShots, n)}  →  goal ${per(b.crossGoals, n)}  (saved ${per(b.crossSaved, n)} · miss/block ${per(b.crossMiss, n)})`);
  console.log(`  box @ delivery (per cross): attackers ${(b.boxAtt / Math.max(b.cxN, 1)).toFixed(2)} · defenders ${(b.boxDef / Math.max(b.cxN, 1)).toFixed(2)}  →  @+1.2s attackers ${(b.boxAttAfter / Math.max(b.cxN, 1)).toFixed(2)}`);
  console.log(`  cross contest (1.2s after): GK-claim ${per(b.cxGK, n)} · defender ${per(b.cxDef, n)} · attacker ${per(b.cxAtt, n)} · loose ${per(b.cxLoose, n)}`);
  console.log(`  cutback funnel:  shot ${per(b.cutbackShots, n)}  →  goal ${per(b.cutbackGoals, n)}`);
  console.log(`  carry funnel:    shot ${per(b.carryShots, n)}  →  goal ${per(b.carryGoals, n)}`);
  console.log(`  reach:  byline occupancy ${per(b.bylineTime, n)}s/m · box-carry ${per(b.boxTouches, n)}s/m`);
  console.log('');
}
console.log('⭐ If WIDE crosses deliver but rarely become shots → leak = delivery/aerial-contest.');
console.log('  If they become shots but rarely goals → leak = keeper-claim/finish.');
