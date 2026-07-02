import { Container, Graphics } from 'pixi.js';
import { formationSpot } from '../ai/formations';
import type { Match } from '../sim/Match';
import { add, scale } from '../utils/vec';
import { toPx } from './transform';

export interface DebugFlags {
  formation: boolean;
  passLines: boolean;
  shotVector: boolean;
  marking: boolean;
  chasers: boolean;
}

/**
 * Dev overlays for understanding the AI: formation targets, in-flight pass
 * lanes, shot vectors, marking assignments, press assignments. Pure reader —
 * calls the same pure formationSpot() the AI uses, so what you see is what
 * the players are steering toward.
 */
export class DebugOverlay {
  readonly container = new Container();
  private g = new Graphics();

  constructor() {
    this.container.addChild(this.g);
  }

  update(match: Match | null, flags: DebugFlags): void {
    const g = this.g;
    g.clear();
    if (!match) return;
    const anyOn = flags.formation || flags.passLines || flags.shotVector || flags.marking || flags.chasers;
    if (!anyOn) return;

    if (flags.formation) {
      for (const team of match.teams) {
        const hasBall = match.possessionSide === team.side;
        const color = team.info.colors.primary;
        for (const p of team.players) {
          const spot = toPx(formationSpot(p, team, match.ball, hasBall));
          const pp = toPx(p.pos);
          g.moveTo(spot.x - 4, spot.y - 4).lineTo(spot.x + 4, spot.y + 4).stroke({ width: 1, color, alpha: 0.55 });
          g.moveTo(spot.x - 4, spot.y + 4).lineTo(spot.x + 4, spot.y - 4).stroke({ width: 1, color, alpha: 0.55 });
          g.moveTo(pp.x, pp.y).lineTo(spot.x, spot.y).stroke({ width: 1, color, alpha: 0.15 });
        }
      }
    }

    if (flags.passLines && match.pendingPass) {
      const target = match.allPlayers.find((p) => p.gid === match.pendingPass!.targetGid);
      if (target) {
        const from = toPx(match.ball.pos);
        const to = toPx(target.pos);
        g.moveTo(from.x, from.y).lineTo(to.x, to.y).stroke({ width: 2, color: 0xfde047, alpha: 0.7 });
        g.circle(to.x, to.y, 8).stroke({ width: 1.5, color: 0xfde047, alpha: 0.7 });
      }
    }

    if (flags.shotVector && match.pendingShot && !match.ball.owner) {
      const from = toPx(match.ball.pos);
      const to = toPx(add(match.ball.pos, scale(match.ball.vel, 0.45)));
      g.moveTo(from.x, from.y).lineTo(to.x, to.y).stroke({ width: 2.5, color: 0xef4444, alpha: 0.85 });
    }

    if (flags.marking) {
      for (const team of match.teams) {
        const opp = match.teams[1 - team.side];
        for (const [ownIdx, oppIdx] of team.marks) {
          const a = toPx(team.players[ownIdx].pos);
          const b = toPx(opp.players[oppIdx].pos);
          g.moveTo(a.x, a.y).lineTo(b.x, b.y).stroke({ width: 1, color: 0x22d3ee, alpha: 0.45 });
        }
      }
    }

    if (flags.chasers) {
      for (const team of match.teams) {
        for (const idx of team.chasers) {
          const pp = toPx(team.players[idx].pos);
          g.circle(pp.x, pp.y, 12).stroke({ width: 1.5, color: 0xf97316, alpha: 0.8 });
        }
      }
    }
  }
}
