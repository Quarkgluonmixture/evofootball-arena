/**
 * Probe (2026-07-19, B0 — baseline for the EMERGENT POSITIONING FIELD). The
 * user's structural point: the formation is a hand-authored rigid MENU + affine
 * transforms, so it (1) doesn't shift ball-side (no strong/weak side), (2) piles
 * bodies uselessly into the own box (bus teams), (3) holds fixed slots (clumps /
 * no drop), (4) doesn't respond to the opponent. This QUANTIFIES the current
 * shape so the emergent field (B1+) has an A/B yardstick + a target.
 *
 * Metrics per archetype team (vs a neutral opponent), meters:
 *   · ball-side shift  = mean(sign(ball.y) · team-centroid.y) when |ball.y|>4,
 *     DEFENDING — >0 means the block slides to the ball's side (strong side).
 *   · nn-dist          = mean nearest-teammate distance (low = clumped).
 *   · own-box crowd    = mean own outfielders in own box (split by ball half).
 *   · spreadX/spreadY  = stdev of outfielder local-x / y (shape size).
 *
 *   npx tsx scripts/probes/positioning-shape.ts [matches]
 */
import { Match } from '../../src/sim/Match';
import { DT, HALF_L, HALF_W, BOX_DEPTH, BOX_WIDTH } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 20);

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
const info = (name: string, g: TacticalGenome): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: g, squad: squad(),
});

const ARCHETYPES: Record<string, TacticalGenome> = {
  NEUTRAL: genome({}),
  BUS: genome({ formationDepth: 0.08, defensiveCompactness: 0.95, pressIntensity: 0.08, attackingWidth: 0.3 }),
  PRESS: genome({ formationDepth: 0.85, pressIntensity: 0.9, defensiveCompactness: 0.6 }),
  WIDE: genome({ attackingWidth: 0.95, defensiveCompactness: 0.3 }),
  NARROW: genome({ attackingWidth: 0.08, defensiveCompactness: 0.9 }),
};
const NEUT = genome({});

function run(name: string, g: TacticalGenome) {
  let frames = 0, defFrames = 0;
  let shift = 0, nn = 0, spreadX = 0, spreadY = 0;
  let boxOwnHalf = 0, ownHalfFrames = 0, boxOppHalf = 0, oppHalfFrames = 0;
  let seed = 1;
  for (let k = 0; k < K; k++) {
    const home = k % 2 === 0;
    const m = new Match({
      seed: seed++,
      teamA: home ? info('ARCH', g) : info('NEUT', NEUT),
      teamB: home ? info('NEUT', NEUT) : info('ARCH', g),
      duration: 300,
    });
    const S = home ? 0 : 1;
    while (!m.finished) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      const t = m.teams[S];
      const outs = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outs.length < 2) continue;
      frames++;
      const cy = outs.reduce((s, p) => s + p.pos.y, 0) / outs.length;
      const cxL = outs.reduce((s, p) => s + t.localX(p.pos.x), 0) / outs.length;
      // spread (stdev)
      let vy = 0, vx = 0;
      for (const p of outs) { vy += (p.pos.y - cy) ** 2; vx += (t.localX(p.pos.x) - cxL) ** 2; }
      spreadY += Math.sqrt(vy / outs.length);
      spreadX += Math.sqrt(vx / outs.length);
      // nearest-neighbour distance
      let nnSum = 0;
      for (const p of outs) {
        let best = Infinity;
        for (const q of outs) if (q !== p) best = Math.min(best, Math.hypot(p.pos.x - q.pos.x, p.pos.y - q.pos.y));
        nnSum += best;
      }
      nn += nnSum / outs.length;
      // ball-side shift (defending, ball clearly to one side)
      const defending = m.possessionSide !== S;
      if (defending && Math.abs(m.ball.pos.y) > 4) {
        defFrames++;
        shift += Math.sign(m.ball.pos.y) * cy;
      }
      // own-box crowd, split by which half the ball is in (own vs opp)
      const ballOwnHalf = t.localX(m.ball.pos.x) < 0;
      let inBox = 0;
      for (const p of outs) if (t.localX(p.pos.x) < -HALF_L + BOX_DEPTH && Math.abs(p.pos.y) < BOX_WIDTH / 2) inBox++;
      if (ballOwnHalf) { boxOwnHalf += inBox; ownHalfFrames++; } else { boxOppHalf += inBox; oppHalfFrames++; }
    }
  }
  const f = Math.max(frames, 1);
  console.log(
    `  ${name.padEnd(8)} shift ${(shift / Math.max(defFrames, 1)).toFixed(1).padStart(5)}  ` +
    `nn-dist ${(nn / f).toFixed(1)}m  spreadX ${(spreadX / f).toFixed(1)}  spreadY ${(spreadY / f).toFixed(1)}  ` +
    `ownBox[ball own½ ${(boxOwnHalf / Math.max(ownHalfFrames, 1)).toFixed(2)} · opp½ ${(boxOppHalf / Math.max(oppHalfFrames, 1)).toFixed(2)}]`,
  );
}

console.log(`Current positioning shape by archetype — ${K} matches each vs NEUTRAL, 0.5 squads`);
console.log(`(shift>0 = block slides to the ball's side = strong/weak side exists; low nn-dist = clumped;`);
console.log(` ownBox = mean own outfielders in own box, split by ball half — high on ball-own-½ = bus crowds)\n`);
for (const [name, g] of Object.entries(ARCHETYPES)) run(name, g);
console.log(`\n⭐ B0 baseline. Emergent field (B1+) must: raise strong-side shift, keep sane spread,`);
console.log(`  avoid useless own-box crowding, and let styles emerge from gene WEIGHTS (not our tables).`);
