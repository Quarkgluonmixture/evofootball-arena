// Probe (Phase 97): quantify the keeper-hold render jitter's three suspects.
//   ① heldByGk flicker: during distribution (gkDistributing), what fraction
//      of frames has gkHoldTimer<=0? (the 0.25s re-arm quanta gaps — the
//      RENDER adapter still keys on the raw timer)
//   ② held-ball carry jump: the sim ball's forward offset flips 0.3↔0.85
//      in those gap frames — count the flips.
//   ③ player twitch: velocity-direction reversals (>120° in one frame at
//      speed>2) per outfield player-minute — the contain-boundary flip and
//      any other target ping-pong land here.
//   npx tsx scripts/probes/hold-jitter.ts [seed...]
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, GK_HOLD_CLEARANCE } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const attrs = (v: number): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = v;
  return p;
};
const genome = (jockey: number): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  (g as unknown as Record<string, number>).jockeyBias = jockey;
  return g;
};
function team(name: string, jockey: number): TeamInfo {
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: genome(jockey),
    squad: Array.from({ length: TEAM_SIZE }, () => attrs(0.5)),
  };
}

const seeds = process.argv.slice(2).map(Number);
for (const seed of seeds.length ? seeds : [7, 21, 99]) {
  // High-jockey vs low: the contain boundary flip should show on the high side.
  const m = new Match({ seed, teamA: team('A', 0.9), teamB: team('B', 0.1), duration: 300 });
  let distFrames = 0;
  let gapFrames = 0;
  let carryFlips = 0;
  let prevCarryNear = false;
  let prevHeld = false;
  let reversals = 0;
  let movingFrames = 0;
  let pinnedFrames = 0;
  let desiredFlips = 0;
  let ownedFlips = 0;
  let chaseFrames = 0;
  let receiveTriggers = 0;
  let receiveRestarts = 0;
  const prevDesired = new Map<number, { x: number; y: number }>();
  const lastReceive = new Map<number, number>();
  let prevOwnerGid: number | null = null;
  let prevBallSpeed = 0;
  const prevVel = new Map<number, { x: number; y: number }>();
  while (!m.finished) {
    m.step(DT);
    const b = m.ball;
    for (const t of m.teams) {
      const gk = t.goalkeeper;
      if (b.owner === gk && gk.gkDistributing) {
        distFrames++;
        if (gk.gkHoldTimer <= 0) gapFrames++;
        const near = gk.gkHoldTimer > 0;
        if (prevHeld && near !== prevCarryNear) carryFlips++;
        prevCarryNear = near;
        prevHeld = true;
      } else if (b.owner !== gk) prevHeld = false;
    }
    for (const p of m.allPlayers) {
      if (p.role === 'GK' || p.sentOff) continue;
      const v = p.vel;
      const s2 = v.x * v.x + v.y * v.y;
      const pv = prevVel.get(p.gid);
      if (pv) {
        const ps2 = pv.x * pv.x + pv.y * pv.y;
        if (s2 > 4 && ps2 > 4) {
          movingFrames++;
          const dot = (v.x * pv.x + v.y * pv.y) / Math.sqrt(s2 * ps2);
          if (dot < -0.5) reversals++; // >120° turn in ONE 1/60s frame
        }
      }
      prevVel.set(p.gid, { x: v.x, y: v.y });
    }
    // The contain-target flip (queue suspect ③): a chaser's DESIRED velocity
    // whipping >90° frame-to-frame while moving — physics damps it out of
    // p.vel (reversals ≈ 0), but the brain-level flip is what a hysteresis
    // fix would target. Measured on ChaseBall players only.
    for (const p of m.allPlayers) {
      if (p.role === 'GK' || p.sentOff) continue;
      if (p.action.type === 'ChaseBall') {
        const dv = p.desiredVel;
        const ds2 = dv.x * dv.x + dv.y * dv.y;
        const pd = prevDesired.get(p.gid);
        if (pd && ds2 > 1) {
          const ps2 = pd.x * pd.x + pd.y * pd.y;
          if (ps2 > 1) {
            chaseFrames++;
            if ((dv.x * pd.x + dv.y * pd.y) / Math.sqrt(ds2 * ps2) < 0) {
              desiredFlips++;
              // The contain dance specifically: the ball is OWNED (the
              // intercept target is stable, so a flip = the jockey/chase
              // boundary), vs the legit whip when a loose ball changes
              // direction under the chaser's feet.
              if (b.owner !== null) ownedFlips++;
            }
          }
        }
        prevDesired.set(p.gid, { x: dv.x, y: dv.y });
      } else prevDesired.delete(p.gid);
    }
    // The receive one-shot (queue suspect ②): ownership landed on a player
    // off a fast ball — a RE-trigger inside 0.5s snaps the 0.34s animation
    // back to its start mid-pose.
    const og2 = b.owner?.gid ?? null;
    if (og2 !== null && og2 !== prevOwnerGid && prevBallSpeed > 6.5 && b.owner!.role !== 'GK') {
      receiveTriggers++;
      const last = lastReceive.get(og2);
      if (last !== undefined && m.simTime - last < 0.5) receiveRestarts++;
      lastReceive.set(og2, m.simTime);
    }
    prevOwnerGid = og2;
    prevBallSpeed = Math.hypot(b.vel.x, b.vel.y);
    // Bubble pinning: an opponent riding the hold-clearance edge while
    // still pushing inward gets position-clamped EVERY frame — a ±3cm
    // 60Hz vibration in the render (the reported 队员抽动 suspect).
    for (const t of m.teams) {
      const gk = t.goalkeeper;
      if (b.owner !== gk || !(gk.gkHoldTimer > 0 || gk.gkDistributing)) continue;
      for (const o of m.teams[1 - gk.side].players) {
        if (o.sentOff) continue;
        const dx = o.pos.x - gk.pos.x;
        const dy = o.pos.y - gk.pos.y;
        const d = Math.hypot(dx, dy);
        const sp = Math.hypot(o.vel.x, o.vel.y);
        if (Math.abs(d - GK_HOLD_CLEARANCE) < 0.08 && sp > 0.4) pinnedFrames++;
      }
    }
  }
  console.log(
    `seed ${seed}: distribution frames ${distFrames}, timer-gap ${gapFrames} ` +
    `(${((gapFrames / Math.max(distFrames, 1)) * 100).toFixed(1)}%), carry flips ${carryFlips} | ` +
    `vel reversals ${reversals} over ${movingFrames} moving frames ` +
    `(${((reversals / Math.max(movingFrames, 1)) * 1000).toFixed(2)}/1k) | ` +
    `bubble-pinned frames ${pinnedFrames} | desired-flips ${desiredFlips}/${chaseFrames} chase frames ` +
    `(${((desiredFlips / Math.max(chaseFrames, 1)) * 1000).toFixed(1)}/1k, vs-carrier ${ownedFlips}) | ` +
    `receives ${receiveTriggers}, restarts<0.5s ${receiveRestarts}`,
  );
}
