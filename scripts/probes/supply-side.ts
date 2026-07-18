/**
 * Probe (Phase 119d diagnosis — the USER's playtest hypothesis): the carry
 * monoculture is a SUPPLY-side failure, not a defensive one. His read:
 * off-ball attackers are glued by their markers and don't make early runs,
 * so a ball-winner who wants to pass has NOBODY open — he stalls, gets
 * swarmed, and the only escape is a turn-and-sprint dribble. The engine
 * rewards beating your marker WITH the ball (momentum gate) but not WITHOUT
 * it, so all the value concentrates in the carry.
 *
 * Measures, in late-ecology worlds:
 *   1. MARKER ADHESION — each off-ball attacker's distance to the nearest
 *      defender during his team's possession (how glued). "open" = > 2.5m.
 *   2. STALLED-CARRIER OPTIONS — when a carrier is pressed (nearest opp
 *      < 3.5m), how many teammates are BOTH in a clear forward lane AND
 *      > 2.5m from any defender. The user predicts ≈ 0.
 *   3. PRESSED-CARRY RESOLUTION — of pressed-carry moments, does he keep
 *      dribbling, complete a pass, or lose it? (revealed preference)
 *
 *   npx tsx scripts/probes/supply-side.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT } from '../../src/sim/constants';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';

const GENS = Number(process.argv[2] ?? 21);

function loadWorld(seed: number): League {
  const path = `/tmp/evo-snap-${seed}-g${GENS}.json`;
  if (existsSync(path)) return League.fromJSON(JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>);
  const league = new League({ seed });
  for (let g = 0; g < GENS; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  writeFileSync(path, JSON.stringify(league.toJSON()));
  return league;
}

const d2 = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

/** Is the segment carrier→mate clear of defenders (none within 1.4m of it)? */
function laneClear(carrier: Player, mate: Player, defs: Player[]): boolean {
  const vx = mate.pos.x - carrier.pos.x;
  const vy = mate.pos.y - carrier.pos.y;
  const len2 = vx * vx + vy * vy || 1;
  for (const o of defs) {
    const t = Math.max(0, Math.min(1, ((o.pos.x - carrier.pos.x) * vx + (o.pos.y - carrier.pos.y) * vy) / len2));
    const px = carrier.pos.x + t * vx;
    const py = carrier.pos.y + t * vy;
    if (Math.hypot(o.pos.x - px, o.pos.y - py) < 1.4) return false;
  }
  return true;
}

for (const seed of [991, 424242]) {
  const league = loadWorld(seed);
  let offBallSamples = 0, offBallSum = 0, offBallOpen = 0;
  let pressedCarries = 0, optSum = 0, zeroOpt = 0;
  const resolve = { dribble: 0, pass: 0, lost: 0 };
  // A pressed-carry "moment" is sampled once, then debounced ~1s.
  const cooldown = new Map<number, number>();
  const pending: Array<{ gid: number; side: 0 | 1; until: number }> = [];

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    while (!m.finished) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      const b = m.ball;
      const owner = b.owner;
      // (1) off-ball adhesion — attacking side, non-carrier, outfield.
      if (owner) {
        const atk = m.teams[owner.side].players;
        const defs = m.teams[1 - owner.side].players.filter((o) => !o.sentOff);
        for (const p of atk) {
          if (p === owner || p.role === 'GK' || p.sentOff) continue;
          let nearest = Infinity;
          for (const o of defs) if (o.role !== 'GK') nearest = Math.min(nearest, d2(p.pos, o.pos));
          offBallSamples++;
          offBallSum += nearest;
          if (nearest > 2.5) offBallOpen++;
        }
        // (2)/(3) stalled/pressed carrier.
        const defsOut = m.teams[1 - owner.side].players.filter((o) => !o.sentOff && o.role !== 'GK');
        let press = Infinity;
        for (const o of defsOut) press = Math.min(press, d2(owner.pos, o.pos));
        const cd = cooldown.get(owner.gid) ?? 0;
        if (press < 3.5 && owner.role !== 'GK' && m.simTime >= cd) {
          cooldown.set(owner.gid, m.simTime + 1.0);
          pressedCarries++;
          const atkDir = m.teams[owner.side].attackDir;
          let opts = 0;
          for (const mate of m.teams[owner.side].players) {
            if (mate === owner || mate.role === 'GK' || mate.sentOff) continue;
            if ((mate.pos.x - owner.pos.x) * atkDir < -3) continue; // not a backward bail-out
            let nearest = Infinity;
            for (const o of defsOut) nearest = Math.min(nearest, d2(mate.pos, o.pos));
            if (nearest > 2.5 && laneClear(owner, mate, defsOut)) opts++;
          }
          optSum += opts;
          if (opts === 0) zeroOpt++;
          // resolution: look 1s ahead by remembering this carrier + time.
          pending.push({ gid: owner.gid, side: owner.side, until: m.simTime + 1.0 });
        }
      }
      // resolve pending moments whose window has elapsed.
      for (let i = pending.length - 1; i >= 0; i--) {
        const pm = pending[i];
        if (m.simTime < pm.until) continue;
        pending.splice(i, 1);
        const now = b.owner;
        if (now && now.gid === pm.gid) resolve.dribble++;
        else if (now && now.side === pm.side) resolve.pass++;
        else resolve.lost++;
      }
    }
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const pct = (n: number, d: number): string => `${((n / Math.max(d, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, one traced season):`);
  console.log(`  off-ball adhesion: ${offBallSamples} samples · nearest-defender x̄ ${(offBallSum / offBallSamples).toFixed(2)}m · OPEN(>2.5m) ${pct(offBallOpen, offBallSamples)}`);
  console.log(`  stalled carrier (pressed <3.5m): ${pressedCarries} moments · open options x̄ ${(optSum / pressedCarries).toFixed(2)} · ZERO options ${pct(zeroOpt, pressedCarries)}`);
  console.log(`  pressed-carry resolution (+1s): dribble-out ${pct(resolve.dribble, pressedCarries)} · completed pass ${pct(resolve.pass, pressedCarries)} · lost ${pct(resolve.lost, pressedCarries)}`);
}
