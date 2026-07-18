// Probe (Phase 106): the WALK-IN anatomy — the final-15m carry the 93-104
// arc never governed. The defensive side got repriced (containment,
// outnumbered duel, closeIn) but late-gen conversion still runs 48-60%
// because the carrier's PATH to point-blank goes unexamined. This traces
// every episode of a carrier entering the final 15m in LATE-generation
// ecologies and answers, per outcome:
//   · where the line stood (deepest outfield defender at entry)
//   · who could have stepped out (goal-side bodies, nearest gap, min gap)
//   · what the nearest defender DID (closing speed, containing share)
//   · whether the beaten line RECOVERS (effort ratio toward own goal,
//     how many get goal-side again before the episode ends)
// Observation only — the data picks the phase-106 lever.
//   npx tsx scripts/probes/final15-anatomy.ts [gens]
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';
import { dist } from '../../src/utils/vec';
import { formationSpot } from '../../src/ai/formations';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';

const GENS = Number(process.argv[2] ?? 22);
const ENTRY_X = HALF_L - 15; // final 15m band

interface Episode {
  gid: number;
  side: number;
  entryGap: number; // nearest goal-side outfield defender (m)
  entryGoalSide: number; // goal-side outfield bodies at entry
  entrySteppers: number; // goal-side, within 9m at entry — COULD step out
  entryBeaten: number[]; // gids of beaten outfield defenders at entry
  lineFromGoal: number; // deepest outfield defender's distance from goal line
  minGap: number;
  endGap: number;
  entryLocalX: number;
  advance: number; // carrier localX gain over the episode
  frames: number;
  closingSum: number; // d(gap)/dt of the nearest goal-side defender (m/s, +=closing)
  closingN: number;
  pressure: number | null; // at the strike, from the shot log
  recovSum: number; // beaten men: velocity toward own goal / topSpeed
  recovN: number;
  beatenActions: Record<string, number>; // what the beaten men are DOING
  beatenSpdSum: number; // their full speed ratio |vel|/topSpeed
  beatenSpotSum: number; // their distance to their own formation spot
  pursuerGapMin: number; // nearest behind-pursuer's closest approach (to carrier)
  pursuerBallMin: number; // ... and to the BALL (the 1.15m lunge radius check)
  pursuerTopSum: number; // pursuer topSpeed / carrier topSpeed (the pace duel)
  pursuerTopN: number;
  lunged: boolean; // any defender fired a tackle lunge near the carrier
  recovered: number; // beaten men goal-side again by episode end
  containFrames: number; // nearest goal-side defender flagged containing
  carrierSpdSum: number; // carrier speed toward goal / topSpeed
  shotLogIndex: number | null;
  outcome: string;
  // frozen shot parameters (the save-model inputs), captured at the strike
  shotXg: number | null;
  shotDifficulty: number | null;
  shotCloseIn: number | null;
  shotGkDist: number | null; // keeper→shooter distance at the strike
  shotFromGoal: number | null; // shooter→goal-line distance at the strike
}

const worlds = [991, 424242];
for (const seed of worlds) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }

  const episodes: Episode[] = [];
  let matches = 0;
  let totalGoals = 0;

  const goalSideOutfield = (m: Match, o: Player): Player[] => {
    const t = m.teams[o.side];
    const ox = t.localX(o.pos.x);
    return m.teams[1 - o.side].players.filter(
      (q) => q.role !== 'GK' && !q.sentOff && t.localX(q.pos.x) > ox,
    );
  };

  for (let g = 0; g < 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const m = league.createMatch(fx);
      matches++;
      let ep: Episode | null = null;
      let prevGap = Infinity;
      const perMatch: Episode[] = [];

      const endEpisode = (outcome: string): void => {
        if (!ep) return;
        ep.outcome = outcome;
        // did any beaten man recover goal-side?
        const t = m.teams[ep.side];
        const carrier = m.allPlayers[ep.gid];
        const ox = t.localX(carrier.pos.x);
        ep.advance = ox - ep.entryLocalX;
        for (const bgid of ep.entryBeaten) {
          const q = m.allPlayers[bgid];
          if (t.localX(q.pos.x) > ox) ep.recovered++;
        }
        perMatch.push(ep);
        ep = null;
        prevGap = Infinity;
      };

      while (!m.finished) {
        m.step(DT);
        const o = m.ball.owner;
        // a shot from the episode's carrier ends it as 'shot'
        if (ep !== null && m.pendingShot && m.pendingShot.shooterGid === ep.gid && !m.pendingShot.resolved) {
          ep.shotLogIndex = m.pendingShot.logIndex;
          ep.shotXg = m.pendingShot.xg;
          ep.shotDifficulty = m.pendingShot.difficulty;
          ep.shotCloseIn = m.pendingShot.closeIn ?? 0;
          const shooter = m.allPlayers[ep.gid];
          const defTeam = m.teams[1 - ep.side];
          ep.shotGkDist = dist(defTeam.goalkeeper.pos, shooter.pos);
          const gx = m.teams[ep.side].attackDir * HALF_L;
          ep.shotFromGoal = Math.hypot(gx - shooter.pos.x, shooter.pos.y);
          endEpisode('shot');
          continue;
        }
        if (m.phase !== 'playing') {
          endEpisode('dead');
          continue;
        }
        if (!o) {
          if (ep !== null) {
            if (m.dribbleTouch?.gid === ep.gid) continue; // his own push — lives
            const passed = m.pendingPass && m.pendingPass.passerGid === ep.gid;
            endEpisode(passed ? 'pass-off' : 'loose');
          }
          continue;
        }
        if (o.role === 'GK') {
          endEpisode(ep !== null && o.side !== ep.side ? 'gk-claim' : 'dead');
          continue;
        }
        const t = m.teams[o.side];
        const ox = t.localX(o.pos.x);
        if (ep !== null && (o.gid !== ep.gid || ox < ENTRY_X - 2)) {
          endEpisode(
            o.gid === ep.gid ? 'retreat' : o.side === ep.side ? 'pass-off' : 'turnover',
          );
          // fall through: the new owner may start his own episode this frame
        }
        if (ep === null) {
          // a restart's first touch is not a walk-in (corner taker at 45m)
          if (ox < ENTRY_X || m.restartKickGid === o.gid) continue;
          const gs = goalSideOutfield(m, o);
          const gaps = gs.map((q) => dist(q.pos, o.pos));
          const nearest = gaps.length ? Math.min(...gaps) : Infinity;
          const deepest = gs.length ? Math.max(...gs.map((q) => t.localX(q.pos.x))) : ox;
          ep = {
            gid: o.gid,
            side: o.side,
            entryGap: nearest,
            entryGoalSide: gs.length,
            entrySteppers: gaps.filter((d) => d < 9).length,
            entryBeaten: m.teams[1 - o.side].players
              .filter((q) => q.role !== 'GK' && !q.sentOff && t.localX(q.pos.x) <= ox)
              .map((q) => q.gid),
            lineFromGoal: HALF_L - deepest,
            minGap: nearest,
            endGap: nearest,
            entryLocalX: ox,
            advance: 0,
            frames: 0,
            closingSum: 0,
            closingN: 0,
            pressure: null,
            recovSum: 0,
            recovN: 0,
            beatenActions: {},
            beatenSpdSum: 0,
            beatenSpotSum: 0,
            pursuerGapMin: Infinity,
            pursuerBallMin: Infinity,
            pursuerTopSum: 0,
            pursuerTopN: 0,
            lunged: false,
            recovered: 0,
            containFrames: 0,
            carrierSpdSum: 0,
            shotLogIndex: null,
            outcome: '?',
            shotXg: null,
            shotDifficulty: null,
            shotCloseIn: null,
            shotGkDist: null,
            shotFromGoal: null,
          };
          prevGap = nearest;
          continue;
        }
        // live episode frame
        ep.frames++;
        const gs = goalSideOutfield(m, o);
        let gap = Infinity;
        let nearestQ: Player | null = null;
        for (const q of gs) {
          const d = dist(q.pos, o.pos);
          if (d < gap) {
            gap = d;
            nearestQ = q;
          }
        }
        if (gap < ep.minGap) ep.minGap = gap;
        ep.endGap = gap;
        if (Number.isFinite(prevGap) && Number.isFinite(gap)) {
          ep.closingSum += (prevGap - gap) / DT;
          ep.closingN++;
        }
        prevGap = gap;
        if (nearestQ?.containing) ep.containFrames++;
        const dir = m.teams[o.side].attackDir;
        ep.carrierSpdSum += (o.vel.x * dir) / o.topSpeed;
        for (const bgid of ep.entryBeaten) {
          const q = m.allPlayers[bgid];
          if (t.localX(q.pos.x) > t.localX(o.pos.x)) continue; // already recovered
          ep.recovSum += (q.vel.x * dir) / q.topSpeed;
          ep.recovN++;
          ep.beatenActions[q.action.type] = (ep.beatenActions[q.action.type] ?? 0) + 1;
          ep.beatenSpdSum += Math.hypot(q.vel.x, q.vel.y) / q.topSpeed;
          const defTeam = m.teams[1 - o.side];
          ep.beatenSpotSum += dist(q.pos, formationSpot(q, defTeam, m.ball, false));
        }
        // pursuit endgame: the nearest BEHIND-pursuer's closest approach,
        // his pace duel vs the carrier, and whether anyone ever lunged
        let pd = Infinity;
        let pursuer: Player | null = null;
        for (const q of m.teams[1 - o.side].players) {
          if (q.role === 'GK' || q.sentOff) continue;
          if (t.localX(q.pos.x) > t.localX(o.pos.x)) continue; // goal-side men counted elsewhere
          const d = dist(q.pos, o.pos);
          if (d < pd) {
            pd = d;
            pursuer = q;
          }
          if (d < 3 && q.tackleAnimTimer > 0.3) ep.lunged = true;
        }
        if (pursuer) {
          if (pd < ep.pursuerGapMin) ep.pursuerGapMin = pd;
          const db = dist(pursuer.pos, m.ball.pos);
          if (db < ep.pursuerBallMin) ep.pursuerBallMin = db;
          ep.pursuerTopSum += pursuer.topSpeed / o.topSpeed;
          ep.pursuerTopN++;
        }
      }
      endEpisode('dead');
      // resolve shot outcomes now the match is done
      for (const e of perMatch) {
        if (e.shotLogIndex !== null) {
          const s = m.shotLog[e.shotLogIndex];
          e.outcome = s ? `shot:${s.outcome}${s.chip ? ':chip' : ''}` : 'shot:?';
          e.pressure = s?.pressure ?? null;
        }
      }
      episodes.push(...perMatch);
      const res = m.getResult();
      totalGoals += res.score[0] + res.score[1];
      league.applyResult(fx, res);
    }
    league.finishSeason();
  }

  // ---- aggregate ----
  const groups = new Map<string, Episode[]>();
  for (const e of episodes) {
    if (!groups.has(e.outcome)) groups.set(e.outcome, []);
    groups.get(e.outcome)!.push(e);
  }
  const mean = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
  const walkInGoals = episodes.filter((e) => e.outcome.startsWith('shot:goal')).length;
  console.log(`\nworld ${seed} (gens ${GENS - 2}→${GENS}): ${episodes.length} episodes / ${matches} matches (${(episodes.length / matches).toFixed(1)}/match)`);
  console.log(`  walk-in goals ${walkInGoals} of ${totalGoals} total (${((walkInGoals / totalGoals) * 100).toFixed(0)}%)`);
  const row = (label: string, es: Episode[], denom: number): void => {
    if (!es.length) return;
    const finiteGap = es.filter((e) => Number.isFinite(e.entryGap));
    const secs = mean(es.map((e) => e.frames * DT));
    console.log(
      `  ${label.padEnd(12)} ${String(es.length).padStart(4)} (${((es.length / denom) * 100).toFixed(0)}%)` +
      ` | entry@${(HALF_L - mean(es.map((e) => e.entryLocalX))).toFixed(1)}m` +
      ` breakaway ${((es.filter((e) => e.entryGoalSide === 0).length / es.length) * 100).toFixed(0)}%` +
      ` gap ${mean(finiteGap.map((e) => e.entryGap)).toFixed(1)}m` +
      ` gs ${mean(es.map((e) => e.entryGoalSide)).toFixed(1)}` +
      ` steppers ${mean(es.map((e) => e.entrySteppers)).toFixed(1)}` +
      ` line@${mean(es.map((e) => e.lineFromGoal)).toFixed(1)}m` +
      ` beaten ${mean(es.map((e) => e.entryBeaten.length)).toFixed(1)}` +
      ` | run ${secs.toFixed(1)}s adv ${mean(es.map((e) => e.advance)).toFixed(1)}m` +
      ` minGap ${mean(es.filter((e) => Number.isFinite(e.minGap)).map((e) => e.minGap)).toFixed(1)}` +
      ` close ${mean(es.filter((e) => e.closingN > 0).map((e) => e.closingSum / e.closingN)).toFixed(2)}m/s` +
      ` | recov ${mean(es.filter((e) => e.recovN > 0).map((e) => e.recovSum / e.recovN)).toFixed(2)}` +
      ` recovered ${mean(es.map((e) => (e.entryBeaten.length ? e.recovered / e.entryBeaten.length : NaN)).filter((v) => !Number.isNaN(v))).toFixed(2)}` +
      ` | spd ${mean(es.filter((e) => e.frames > 0).map((e) => e.carrierSpdSum / e.frames)).toFixed(2)}` +
      (es.some((e) => e.pressure !== null)
        ? ` press ${mean(es.filter((e) => e.pressure !== null).map((e) => e.pressure!)).toFixed(2)}`
        : ''),
    );
    // the beaten men's inner life + the pursuit endgame
    const acts: Record<string, number> = {};
    for (const e of es) for (const [a, n] of Object.entries(e.beatenActions)) acts[a] = (acts[a] ?? 0) + n;
    const actTotal = Object.values(acts).reduce((a, b) => a + b, 0) || 1;
    const actMix = Object.entries(acts).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([a, n]) => `${a} ${((n / actTotal) * 100).toFixed(0)}%`).join(' · ');
    console.log(
      `      beaten: [${actMix}] |v| ${mean(es.filter((e) => e.recovN > 0).map((e) => e.beatenSpdSum / e.recovN)).toFixed(2)}` +
      ` spotDist ${mean(es.filter((e) => e.recovN > 0).map((e) => e.beatenSpotSum / e.recovN)).toFixed(1)}m` +
      ` | pursuer: gapMin ${mean(es.filter((e) => Number.isFinite(e.pursuerGapMin)).map((e) => e.pursuerGapMin)).toFixed(2)}` +
      ` ballMin ${mean(es.filter((e) => Number.isFinite(e.pursuerBallMin)).map((e) => e.pursuerBallMin)).toFixed(2)}` +
      ` topRatio ${mean(es.filter((e) => e.pursuerTopN > 0).map((e) => e.pursuerTopSum / e.pursuerTopN)).toFixed(2)}` +
      ` lunged ${((es.filter((e) => e.lunged).length / es.length) * 100).toFixed(0)}%`,
    );
    // the save-model inputs frozen at the strike (shot episodes only)
    const sh = es.filter((e) => e.shotXg !== null);
    if (sh.length) {
      console.log(
        `      strike: from ${mean(sh.map((e) => e.shotFromGoal!)).toFixed(1)}m` +
        ` gkDist ${mean(sh.map((e) => e.shotGkDist!)).toFixed(1)}m` +
        ` xg ${mean(sh.map((e) => e.shotXg!)).toFixed(2)}` +
        ` difficulty ${mean(sh.map((e) => e.shotDifficulty!)).toFixed(2)}` +
        ` closeIn ${mean(sh.map((e) => e.shotCloseIn!)).toFixed(2)}`,
      );
    }
  };
  for (const [k, es] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
    row(k, es, episodes.length);
  }
  // THE diagnostic split: goals where the line was beaten UPSTREAM (no
  // goal-side body at entry) vs goals scored THROUGH standing bodies.
  const goals = episodes.filter((e) => e.outcome.startsWith('shot:goal'));
  console.log('  — goals split by entry regime —');
  row('goal:b-away', goals.filter((e) => e.entryGoalSide === 0), goals.length);
  row('goal:bodies', goals.filter((e) => e.entryGoalSide > 0), goals.length);
  const shots = episodes.filter((e) => e.outcome.startsWith('shot:'));
  const conv = (es: Episode[]): string =>
    es.length ? `${((es.filter((e) => e.outcome.startsWith('shot:goal')).length / es.length) * 100).toFixed(0)}%` : '—';
  console.log(
    `  conversion: breakaway-entry ${conv(shots.filter((e) => e.entryGoalSide === 0))}` +
    ` · bodies-entry ${conv(shots.filter((e) => e.entryGoalSide > 0))}` +
    ` · all walk-in shots ${conv(shots)}`,
  );
}
