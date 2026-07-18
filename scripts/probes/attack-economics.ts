/**
 * Probe (Phase 119b): ATTACK ECONOMICS — the per-possession ledger behind
 * the carry monoculture. The goal-channel census says WHAT scores (carry
 * 47-55%, through/cross ≈0 late); this measures WHY: what a second of
 * carrying vs a pass attempt actually buys (toward-goal meters), what each
 * risks (turnovers), and what each pays (shots, xG, conversion), EARLY
 * (gen ~3, pre-collapse) vs LATE (gen ~22, collapsed) in the same worlds.
 *
 * Accounting (tick-traced, zero sim writes):
 *   carry meters  — toward-goal ball movement while the same player owns it
 *   pass meters   — toward-goal displacement of COMPLETED deliberate passes
 *                   (pendingPass kicks; scramble knock-ons don't count)
 *   risk          — carry turnovers (steal within 1s of a live carry, no
 *                   pass in flight) vs pass interceptions
 *   payoff        — possession episodes classified carry- vs pass-dominant
 *                   by which mode gained more meters; shots/goals/xG per
 *                   episode class; plus the shotLog's own assist mix and
 *                   the oneVone conversion (1v1 honesty, phase-86 flag)
 *
 *   npx tsx scripts/probes/attack-economics.ts [lateGens]
 */
import { League } from '../../src/sim/League';
import type { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import type { Player } from '../../src/sim/Player';

const LATE = Number(process.argv[2] ?? 22);
const EARLY = 3;

interface Agg {
  matches: number;
  carryM: number;
  carryS: number;
  carryTO: number;
  passM: number;
  passAtt: number;
  passCmp: number;
  passTO: number;
  epC: number; // carry-dominant episodes
  epP: number;
  epShotC: number;
  epShotP: number;
  goals: number;
  shots: number;
  xg: number;
  oneVone: number;
  oneVoneGoals: number;
  assistGoals: Record<string, number>;
}

const init = (): Agg => ({
  matches: 0, carryM: 0, carryS: 0, carryTO: 0,
  passM: 0, passAtt: 0, passCmp: 0, passTO: 0,
  epC: 0, epP: 0, epShotC: 0, epShotP: 0,
  goals: 0, shots: 0, xg: 0, oneVone: 0, oneVoneGoals: 0,
  assistGoals: {},
});

function traceMatch(m: Match, agg: Agg): void {
  agg.matches++;
  let prevOwner: Player | null = null;
  let prevX = 0;
  let flight: { side: 0 | 1; startX: number } | null = null;
  let lastPassT = -1;
  // Steal window: who last carried, and when they lost it (no flight).
  let lastCarrySide: 0 | 1 | null = null;
  let lastCarryLostT = -1;
  type Ep = { side: 0 | 1; carryM: number; passM: number; shotBase: number };
  let ep: Ep | null = null;

  const bank = (e: Ep | null): void => {
    if (!e) return;
    const shots = m.shotLog.slice(e.shotBase).filter((s) => s.side === e.side).length;
    const carryDom = e.carryM >= e.passM;
    if (carryDom) { agg.epC++; if (shots > 0) agg.epShotC++; }
    else { agg.epP++; if (shots > 0) agg.epShotP++; }
  };

  while (!m.finished) {
    m.step(DT);
    if (m.phase !== 'playing') {
      bank(ep);
      ep = null;
      flight = null;
      prevOwner = null;
      lastCarrySide = null;
      continue;
    }
    const b = m.ball;
    const o = b.owner;
    const pp = m.pendingPass;
    if (pp && pp.t !== lastPassT) {
      lastPassT = pp.t;
      flight = { side: pp.side, startX: b.pos.x };
      agg.passAtt++;
    }
    if (o) {
      if (flight) {
        if (o.side === flight.side) {
          const gain = Math.max(0, (b.pos.x - flight.startX) * m.teams[flight.side].attackDir);
          agg.passCmp++;
          agg.passM += gain;
          if (ep && ep.side === flight.side) ep.passM += gain;
        } else {
          agg.passTO++;
        }
        flight = null;
      } else if (lastCarrySide !== null && o.side !== lastCarrySide && m.simTime - lastCarryLostT < 1.0) {
        // Direct steal off the dribble (tackle/poke) — no pass was in flight.
        agg.carryTO++;
      }
      if (!ep || ep.side !== o.side) {
        bank(ep);
        ep = { side: o.side, carryM: 0, passM: 0, shotBase: m.shotLog.length };
      }
      if (prevOwner === o) {
        const d = Math.max(0, (b.pos.x - prevX) * m.teams[o.side].attackDir);
        agg.carryM += d;
        agg.carryS += DT;
        ep.carryM += d;
      }
      prevOwner = o;
      prevX = b.pos.x;
      lastCarrySide = o.side;
      lastCarryLostT = m.simTime;
    } else {
      prevOwner = null;
    }
  }
  bank(ep);

  for (const s of m.shotLog) {
    if (s.outcome === 'pending') continue;
    agg.shots++;
    agg.xg += s.xg;
    if (s.outcome === 'goal') {
      agg.goals++;
      const k = s.assist ?? 'none';
      agg.assistGoals[k] = (agg.assistGoals[k] ?? 0) + 1;
    }
    if (s.oneVone) {
      agg.oneVone++;
      if (s.outcome === 'goal') agg.oneVoneGoals++;
    }
  }
}

function traceSeason(league: League): Agg {
  const agg = init();
  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m = league.createMatch(fx);
    traceMatch(m, agg);
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();
  return agg;
}

function report(tag: string, a: Agg): void {
  const per = (n: number, d: number): number => (d > 0 ? n / d : 0);
  const totM = a.carryM + a.passM;
  console.log(`  [${tag}] ${a.matches} matches, ${a.goals} goals, ${a.shots} shots (conv ${(per(a.goals, a.shots) * 100).toFixed(1)}%, xg/shot ${per(a.xg, a.shots).toFixed(3)}, overperf ${per(a.goals, a.xg).toFixed(2)}x)`);
  console.log(`    progression: carry ${(per(a.carryM, totM) * 100).toFixed(0)}% (${(a.carryM / a.matches).toFixed(0)}m/match) · completed-pass ${(per(a.passM, totM) * 100).toFixed(0)}% (${(a.passM / a.matches).toFixed(0)}m/match)`);
  console.log(`    carry: ${per(a.carryM, a.carryS).toFixed(2)} m/s owned · steals ${per(a.carryTO * 100, a.carryS).toFixed(1)}/100s`);
  console.log(`    pass: ${(a.passAtt / a.matches).toFixed(0)} att/match · cmp ${(per(a.passCmp, a.passAtt) * 100).toFixed(0)}% · ${per(a.passM, a.passCmp).toFixed(1)}m/cmp · intercepted ${(per(a.passTO, a.passAtt) * 100).toFixed(1)}%`);
  console.log(`    episodes: carry-dom ${a.epC} (shot ${(per(a.epShotC, a.epC) * 100).toFixed(1)}%) · pass-dom ${a.epP} (shot ${(per(a.epShotP, a.epP) * 100).toFixed(1)}%)`);
  console.log(`    1v1: ${a.oneVone} shots, conv ${(per(a.oneVoneGoals, a.oneVone) * 100).toFixed(0)}% · goal assists: ${Object.entries(a.assistGoals).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
}

for (const seed of [991, 424242]) {
  console.log(`\nworld ${seed}:`);
  const league = new League({ seed });
  for (let g = 0; g < EARLY - 1; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  report(`gen ${EARLY} (early)`, traceSeason(league));
  for (let g = EARLY + 1; g < LATE; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  report(`gen ${LATE} (late)`, traceSeason(league));
}
