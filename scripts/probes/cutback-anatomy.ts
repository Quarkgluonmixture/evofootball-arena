/**
 * Probe: CUTBACK ANATOMY (N1.5 lever-2 diagnostic, pre-lever).
 *
 * The phase-58 matrix left "Runners in waves / Compact block" unbeaten, and
 * the named counter-surface — the cutback zone a low block cedes — converts
 * at ~6% (calibrate: 0.98/match, 0.06 goals). Before touching anything:
 * where do cutbacks DIE? For every cutback, watch the 5s payoff window and
 * classify the outcome chain:
 *   SHOT  → goal / saved / miss / blocked-en-route (shotLog outcome + the
 *           lane-blocker count fixed at strike time)
 *   NO SHOT → possession lost inside the window (intercepted/miscontrolled)
 *             or kept-but-recycled (the arriver chose not to shoot).
 * Run the anatomy against three defensive worlds: NEUTRAL, a COMPACT low
 * block (the matrix king's shell), and a PRESS shell — if the compact block
 * kills cutbacks harder than press does, the ceded zone is an illusion.
 *
 *   npx tsx scripts/probes/cutback-anatomy.ts
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { laneOpenness } from '../../src/ai/perception';
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type TeamStyle } from '../../src/sim/types';

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (name: string, genome: TacticalGenome, style: TeamStyle): TeamInfo => ({
  id: name, name, short: name.toUpperCase().slice(0, 3),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome, squad: squad(), style,
});

const attackerStyle: TeamStyle = { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' };

// The attacker leans WIDE (the style that should harvest the flanks).
const attackerGenome = (): TacticalGenome => {
  const g = neutral();
  g.attackingWidth = 0.85;
  g.riskTolerance = 0.6;
  return g;
};

interface Shell { tag: string; genome: TacticalGenome; style: TeamStyle }
const shells: Shell[] = [
  { tag: 'NEUTRAL', genome: neutral(), style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } },
  (() => {
    const g = neutral();
    g.defensiveCompactness = 0.9;
    g.formationDepth = 0.15;
    g.pressIntensity = 0.15;
    return { tag: 'COMPACT', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: 'man' } as TeamStyle };
  })(),
  (() => {
    const g = neutral();
    g.pressIntensity = 0.9;
    g.defensiveCompactness = 0.35;
    g.formationDepth = 0.8;
    return { tag: 'PRESS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } as TeamStyle };
  })(),
];

const MATCHES = 400;
const WINDOW = 5;

for (const shell of shells) {
  const acc = {
    cutbacks: 0, shots: 0, goals: 0, saved: 0, miss: 0,
    lostBall: 0, recycled: 0, blockersSum: 0, xgSum: 0, timeToShotSum: 0,
    allShots: 0, allBlockersSum: 0, lostToIntercept: 0, lostToMiscontrol: 0,
    laneByOutcome: { shot: [] as number[], lost: [] as number[], recycled: [] as number[] },
    delivered: 0, diedInFlight: 0,
    killByCapture: 0, killByDeflect: 0, killBlindSum: 0, killSpeedSum: 0, kills: 0,
    recBlockersSum: 0, recUnsetSum: 0, recWithBlockers: 0,
  };
  for (let k = 0; k < MATCHES; k++) {
    const m = new Match({
      seed: 424200 + k,
      teamA: team('ATK', attackerGenome(), attackerStyle),
      teamB: team(shell.tag, shell.genome, shell.style),
    });
    // step-level watch: classify each cutback by team A (side 0)
    let open: {
      t: number; shotSeen: boolean; icept0: number; misc0: number; lane: number;
      passerGid: number; deliveryResolved: boolean;
    } | null = null;
    let lastT = -1;
    const closeWindow = (now: number): void => {
      if (!open || open.shotSeen) { open = null; return; }
      // no shot inside the window: did we keep the ball?
      if (m.possessionSide === 0) {
        acc.recycled++;
        acc.laneByOutcome.recycled.push(open.lane);
      } else {
        acc.lostBall++;
        acc.laneByOutcome.lost.push(open.lane);
        // What took it: a defender on the pass lane, or the receiver's own
        // hot first touch? (Both can tick in one window — intercept wins the
        // classification; it fires first on the lane.)
        if (m.teams[1].stats.interceptions > open.icept0) acc.lostToIntercept++;
        else if (m.teams[0].stats.miscontrols > open.misc0) acc.lostToMiscontrol++;
      }
      open = null;
    };
    let prevVel = { x: 0, y: 0 };
    while (!m.finished) {
      prevVel = { x: m.ball.vel.x, y: m.ball.vel.y };
      m.step(DT);
      const cb = m.lastCutback;
      if (cb && cb.side === 0 && cb.t !== lastT) {
        if (open) closeWindow(m.simTime);
        // The lane as it stood one step after the kick: passer is the last
        // touch, the licensed arriver is the target the routine aims for.
        const passer = m.ball.lastTouch;
        const arrIdx = m.teams[0].arriver;
        const lane = passer && arrIdx !== null
          ? laneOpenness(passer.pos, m.teams[0].players[arrIdx].pos, m.teams[1].players)
          : -1;
        open = {
          t: cb.t, shotSeen: false, lane,
          icept0: m.teams[1].stats.interceptions,
          misc0: m.teams[0].stats.miscontrols,
          passerGid: passer ? passer.gid : -1,
          deliveryResolved: false,
        };
        lastT = cb.t;
        acc.cutbacks++;
      }
      // The cutback PASS itself: completed to a teammate, or dead in flight?
      // (lastCompletedPass keyed by the passer pins it; a 1.6s flight cap.)
      if (open && !open.deliveryResolved) {
        const lcp = m.lastCompletedPass;
        if (lcp && lcp.passerGid === open.passerGid && lcp.t >= open.t && lcp.t <= open.t + 1.6) {
          acc.delivered++;
          open.deliveryResolved = true;
          // Reception snapshot: the receiver's shot corridor (laneBlockers
          // geometry replicated) with each body's SET state — a set, facing
          // blocker is a real wall; a fast-moving or blind one is the
          // unset body the first-time strike should beat.
          const rec = m.allPlayers[lcp.receiverGid];
          if (rec && rec.side === 0) {
            const goal = m.teams[0].oppGoal();
            const end = {
              x: rec.pos.x + (goal.x - rec.pos.x) * 0.6,
              y: rec.pos.y + (goal.y - rec.pos.y) * 0.6,
            };
            let nB = 0;
            let nUnset = 0;
            for (const o of m.teams[1].players) {
              if (o.sentOff || o.role === 'GK') continue;
              const abx = end.x - rec.pos.x;
              const aby = end.y - rec.pos.y;
              const len2 = abx * abx + aby * aby;
              const tt = len2 > 1e-9
                ? Math.max(0, Math.min(1, ((o.pos.x - rec.pos.x) * abx + (o.pos.y - rec.pos.y) * aby) / len2))
                : 0;
              const cx = rec.pos.x + abx * tt;
              const cy = rec.pos.y + aby * tt;
              if (Math.hypot(o.pos.x - cx, o.pos.y - cy) >= 1.0) continue;
              nB++;
              const spd = Math.hypot(o.vel.x, o.vel.y);
              const toShooter = Math.hypot(rec.pos.x - o.pos.x, rec.pos.y - o.pos.y);
              const facing = toShooter > 1e-6
                ? (o.heading.x * (rec.pos.x - o.pos.x) + o.heading.y * (rec.pos.y - o.pos.y)) / toShooter
                : 0;
              if (spd > 2.5 || facing < 0.2) nUnset++;
            }
            if (nB > 0) acc.recWithBlockers++;
            acc.recBlockersSum += nB;
            acc.recUnsetSum += nUnset;
          }
        } else {
          // Kill telemetry: the first OPPONENT contact during the flight —
          // an owner change = capture, a bare lastTouch flip = deflection.
          const lt = m.ball.lastTouch;
          if (lt && lt.side === 1 && lt.gid !== open.passerGid) {
            // Use the PRE-step velocity: a deflection rewrites ball.vel.
            const spd = Math.hypot(prevVel.x, prevVel.y);
            const dir = spd > 1e-6 ? { x: prevVel.x / spd, y: prevVel.y / spd } : { x: 0, y: 0 };
            const blind = (1 + (dir.x * lt.heading.x + dir.y * lt.heading.y)) / 2;
            if (m.ball.owner === lt) acc.killByCapture++;
            else acc.killByDeflect++;
            acc.killBlindSum += blind;
            acc.killSpeedSum += spd;
            acc.kills++;
            acc.diedInFlight++;
            open.deliveryResolved = true;
          } else if (m.simTime > open.t + 1.6) {
            acc.diedInFlight++;
            open.deliveryResolved = true;
          }
        }
      }
      if (open && !open.shotSeen) {
        const s = m.shotLog.find((e) => e.side === 0 && e.t >= open!.t && e.t <= open!.t + WINDOW);
        if (s && s.outcome !== 'pending') {
          open.shotSeen = true;
          acc.laneByOutcome.shot.push(open.lane);
          acc.shots++;
          acc.blockersSum += s.blockers;
          acc.xgSum += s.xg;
          acc.timeToShotSum += s.t - open.t;
          if (s.outcome === 'goal') acc.goals++;
          else if (s.outcome === 'saved') acc.saved++;
          else acc.miss++;
          open = null;
        }
      }
      if (open && m.simTime > open.t + WINDOW) closeWindow(m.simTime);
    }
    if (open !== null) closeWindow(m.simTime);
    for (const e of m.shotLog) {
      if (e.side !== 0 || e.outcome === 'pending') continue;
      acc.allShots++;
      acc.allBlockersSum += e.blockers;
    }
  }
  const pc = (n: number, d: number): string => (d ? ((n / d) * 100).toFixed(1) + '%' : '—');
  console.log(`\nvs ${shell.tag} (${MATCHES} matches):`);
  console.log(
    `  cutbacks ${acc.cutbacks} (${(acc.cutbacks / MATCHES).toFixed(2)}/match) → ` +
    `shot ${pc(acc.shots, acc.cutbacks)}  lost-ball ${pc(acc.lostBall, acc.cutbacks)} ` +
    `(intercepted ${pc(acc.lostToIntercept, acc.lostBall)} / miscontrol ${pc(acc.lostToMiscontrol, acc.lostBall)} of losses)  ` +
    `recycled ${pc(acc.recycled, acc.cutbacks)}`,
  );
  console.log(
    `  of shots: goal ${pc(acc.goals, acc.shots)}  saved ${pc(acc.saved, acc.shots)}  ` +
    `miss ${pc(acc.miss, acc.shots)}  | avg blockers ${acc.shots ? (acc.blockersSum / acc.shots).toFixed(2) : '—'} ` +
    `(all shots ${acc.allShots ? (acc.allBlockersSum / acc.allShots).toFixed(2) : '—'})  ` +
    `avg xG ${acc.shots ? (acc.xgSum / acc.shots).toFixed(3) : '—'}  ` +
    `time-to-shot ${acc.shots ? (acc.timeToShotSum / acc.shots).toFixed(2) : '—'}s`,
  );
  console.log(`  cutback→goal overall ${pc(acc.goals, acc.cutbacks)}`);
  const mean = (xs: number[]): string =>
    xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2) : '—';
  console.log(
    `  lane-at-kick by outcome: shot ${mean(acc.laneByOutcome.shot)}  ` +
    `lost ${mean(acc.laneByOutcome.lost)}  recycled ${mean(acc.laneByOutcome.recycled)}`,
  );
  console.log(
    `  the PASS itself: delivered ${pc(acc.delivered, acc.cutbacks)}  ` +
    `died-in-flight ${pc(acc.diedInFlight, acc.cutbacks)}`,
  );
  console.log(
    `  flight kills: capture ${acc.killByCapture}  deflect ${acc.killByDeflect}  ` +
    `avg blind-at-kill ${acc.kills ? (acc.killBlindSum / acc.kills).toFixed(2) : '—'}  ` +
    `avg speed-at-kill ${acc.kills ? (acc.killSpeedSum / acc.kills).toFixed(1) : '—'} m/s`,
  );
  console.log(
    `  at reception: shot-corridor blocked ${pc(acc.recWithBlockers, acc.delivered)} of deliveries  ` +
    `avg blockers ${acc.delivered ? (acc.recBlockersSum / acc.delivered).toFixed(2) : '—'}  ` +
    `UNSET share of blockers ${pc(acc.recUnsetSum, acc.recBlockersSum)}`,
  );
}
