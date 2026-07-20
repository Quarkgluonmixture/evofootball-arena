/**
 * M2 live census — observes the public pre-step snapshot and asks how often
 * the new direct-access fact bites among players who pass the old distance,
 * cooldown and ball-speed envelope. Pure observational; no Match telemetry.
 *
 *   npx tsx scripts/probes/ball-access-census.ts [matches=120] [seedOffset=0]
 */
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import {
  CONTROL_MAX_HEIGHT,
  CONTROL_MAX_SPEED,
  CONTROL_RADIUS,
  DEFLECT_MAX_SPEED,
  DT,
  GK_CONTROL_MAX_SPEED,
  MATCH_DURATION,
} from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { directBallAccess, type BodySector } from '../../src/sim/physical';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `${name}${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

let playingFrames = 0;
let looseFrames = 0;
let oldEnvelopeFrames = 0;
let noDirectFrames = 0;
let rawCandidates = 0;
let directCandidates = 0;
let mustTurn = 0;
let screened = 0;
const sectors: Record<BodySector, number> = { front: 0, side: 0, back: 0 };

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  while (!m.finished) {
    const ball = m.ball;
    if (m.phase === 'playing') playingFrames++;
    if (m.phase === 'playing' && ball.owner === null && ball.z <= CONTROL_MAX_HEIGHT) {
      looseFrames++;
      const speed = Math.hypot(ball.vel.x, ball.vel.y);
      const shotInFlight = m.pendingShot !== null && !m.pendingShot.resolved;
      const deflectable = speed > CONTROL_MAX_SPEED && speed <= DEFLECT_MAX_SPEED && !shotInFlight;
      let rawThisFrame = 0;
      let directThisFrame = 0;
      for (const p of m.allPlayers) {
        if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;
        const d = Math.hypot(p.pos.x - ball.pos.x, p.pos.y - ball.pos.y);
        if (d >= CONTROL_RADIUS) continue;
        const intended =
          m.pendingPass !== null &&
          m.pendingPass.targetGid === p.gid &&
          m.pendingPass.side === p.side;
        const maxSpeed = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED;
        if (speed > maxSpeed && !deflectable) continue;

        rawThisFrame++;
        rawCandidates++;
        const access = directBallAccess(p, ball, m.allPlayers, CONTROL_RADIUS);
        sectors[access.geometry.sector]++;
        if (access.mustTurn) mustTurn++;
        if (access.mustGoAround) screened++;
        if (access.canDirectlyContact) {
          directThisFrame++;
          directCandidates++;
        }
      }
      if (rawThisFrame > 0) {
        oldEnvelopeFrames++;
        if (directThisFrame === 0) noDirectFrames++;
      }
    }
    m.step(DT);
  }
}

const pct = (part: number, whole: number): string =>
  `${(part / Math.max(whole, 1) * 100).toFixed(1)}%`;

console.log(`M2 BALL-ACCESS CENSUS · n=${N} seeds ${OFF}-${OFF + N - 1}`);
console.log(
  `loose frames ${looseFrames} · old-envelope frames ${oldEnvelopeFrames}` +
  ` · no-direct linger ${noDirectFrames} (${pct(noDirectFrames, oldEnvelopeFrames)})`,
);
console.log(
  `no-direct exposure ${(noDirectFrames / Math.max(N, 1) * DT).toFixed(2)}s/match` +
  ` · ${pct(noDirectFrames, playingFrames)} of live frames`,
);
console.log(
  `raw candidates ${rawCandidates} → direct ${directCandidates} (${pct(directCandidates, rawCandidates)})` +
  ` · must-turn ${mustTurn} (${pct(mustTurn, rawCandidates)})` +
  ` · screened ${screened} (${pct(screened, rawCandidates)})`,
);
console.log(
  `sector mix: front ${pct(sectors.front, rawCandidates)}` +
  ` · side ${pct(sectors.side, rawCandidates)}` +
  ` · back ${pct(sectors.back, rawCandidates)}`,
);
