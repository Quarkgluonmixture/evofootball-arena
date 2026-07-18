// Probe (Phase 109 pre-work, the 106 hand-off): what LAUNCHES the walk-in?
// 106 established that late-gen goals are 60-75% walk-ins, 71-92% entering
// the final 15m with the WHOLE line beaten (gs=0), and that post-launch
// pricing cannot touch a volume edge — the governing margin is the LAUNCH.
// This classifies every breakaway band-entry by what served it:
//   carry-through  — the carrier dribbled through/past the line himself
//   through-ball   — a ground through-ball behind the line (the trap's prey)
//   long-ball      — a lofted launch (aerial route; trap-relevant via timing)
//   keeper-launch  — the phase-98 sling/roll/punt starting the break
//   pass / cross   — short service that still met a broken line
//   other          — loose-ball recoveries, deflections, restarts
// The offside-trap gene (109) prices through-balls and early runs — this
// says how much of the pipe it can actually govern.
//   npx tsx scripts/probes/launch-anatomy.ts [gens]
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';
import type { Match } from '../../src/sim/Match';

const GENS = Number(process.argv[2] ?? 22);
const ENTRY_X = HALF_L - 15;

for (const seed of [991, 424242]) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }

  const launches: Record<string, number> = {};
  const launchGoals: Record<string, number> = {};
  let entries = 0;
  let matches = 0;

  const classify = (m: Match, gid: number, ownStart: number, ownStartX: number, ox: number): string => {
    const held = m.simTime - ownStart;
    if (held > 2.2 && ox - ownStartX > 9) return 'carry-through';
    const lp = m.lastCompletedPass;
    if (lp && lp.receiverGid === gid && m.simTime - lp.t < 3.5) {
      if (m.allPlayers[lp.passerGid].role === 'GK') return 'keeper-launch';
      const kind = m.lastPassKind && m.simTime - m.lastPassKind.t < 3.5 ? m.lastPassKind.kind : 'pass';
      return kind === 'through' ? 'through-ball' : kind === 'lofted' ? 'long-ball' : kind;
    }
    return 'other';
  };

  for (let g = 0; g < 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const m = league.createMatch(fx);
      matches++;
      let ownGid = -1;
      let ownStart = 0;
      let ownStartX = 0;
      let inBand = false; // the current owner already counted for this entry
      let pendingKind: string | null = null;
      let pendingShooter = -1;
      const perMatch: Array<{ kind: string; logIndex: number }> = [];
      while (!m.finished) {
        m.step(DT);
        const o = m.ball.owner;
        if (pendingKind !== null && m.pendingShot && m.pendingShot.shooterGid === pendingShooter && !m.pendingShot.resolved) {
          perMatch.push({ kind: pendingKind, logIndex: m.pendingShot.logIndex });
          pendingKind = null;
        }
        if (!o || m.phase !== 'playing') {
          if (!o && m.dribbleTouch && m.dribbleTouch.gid === ownGid) continue; // his own push
          continue;
        }
        const t = m.teams[o.side];
        const ox = t.localX(o.pos.x);
        if (o.gid !== ownGid) {
          ownGid = o.gid;
          ownStart = m.simTime;
          ownStartX = ox;
          inBand = ox >= ENTRY_X; // took over already inside — not a fresh entry
          if (o.role === 'GK') inBand = true;
        }
        if (!inBand && ox >= ENTRY_X) {
          inBand = true;
          // breakaway only: zero goal-side outfielders
          const gs = m.teams[1 - o.side].players.some(
            (q) => q.role !== 'GK' && !q.sentOff && t.localX(q.pos.x) > ox,
          );
          if (!gs && m.restartKickGid !== o.gid) {
            entries++;
            const kind = classify(m, o.gid, ownStart, ownStartX, ox);
            launches[kind] = (launches[kind] ?? 0) + 1;
            pendingKind = kind;
            pendingShooter = o.gid;
          }
        }
      }
      for (const e of perMatch) {
        if (m.shotLog[e.logIndex]?.outcome === 'goal') {
          launchGoals[e.kind] = (launchGoals[e.kind] ?? 0) + 1;
        }
      }
      league.applyResult(fx, m.getResult());
    }
    league.finishSeason();
  }

  const total = Object.values(launches).reduce((a, b) => a + b, 0) || 1;
  console.log(`\nworld ${seed} (gens ${GENS - 2}→${GENS}): ${entries} breakaway entries / ${matches} matches (${(entries / matches).toFixed(1)}/match)`);
  for (const [k, n] of Object.entries(launches).sort((a, b) => b[1] - a[1])) {
    const goals = launchGoals[k] ?? 0;
    console.log(
      `  ${k.padEnd(14)} ${String(n).padStart(4)} (${((n / total) * 100).toFixed(0)}%)` +
      ` → ${goals} goals (${((goals / n) * 100).toFixed(0)}% of entries)`,
    );
  }
}
