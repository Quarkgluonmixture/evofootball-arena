import { clamp01 } from '../utils/math';
import type { Rng } from '../utils/rng';
import type { Role } from '../sim/types';

/**
 * Squad DNA — per-player attribute genes that evolve alongside the team's
 * TacticalGenome. All 0..1, all read directly by the simulation, so squads
 * feel physically different, not just tactically different.
 *
 * Phase 47 (the emergence pivot's attribute richness): the overloaded
 * `technique` split into PASSING (striking a ball toward a target: pass /
 * cross / through / loft / switch / FK accuracy+power) and DRIBBLING
 * (the ball at the feet: first touch, carry control, tackle resistance,
 * 1v1s, shot strike), plus two new payoff dimensions:
 *
 *   pace       top speed & acceleration (±12% speed)
 *   passing    pass/cross/loft accuracy and power retention
 *   dribbling  first touch, carry push control, beating a man
 *   finishing  shot accuracy (spread) and shot confidence
 *   defending  tackle success + tighter marking
 *   strength   aerial power, shielding, the 50/50 shove
 *   stamina    fatigue drain & recovery rate
 *   reflexes   keeper save probability & reach (matters mostly for the GK)
 */
export interface PlayerAttributes {
  pace: number;
  passing: number;
  dribbling: number;
  finishing: number;
  defending: number;
  strength: number;
  stamina: number;
  reflexes: number;
}

export const ATTR_KEYS = [
  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
] as const;
export type AttrKey = (typeof ATTR_KEYS)[number];

/** Squad slot order (mirrors sim/types ROLES): [GK, DF, MF, WGL, WGR, ST]. */
export const SQUAD_ROLES: Role[] = ['GK', 'DF', 'MF', 'WG', 'WG', 'ST'];

/** Each role tends to be born good at its job (bias added, then clamped).
 * strength/stamina carry NO bias (Phase 47) — where the physical game pays
 * is evolution's to discover. (ROLE_BIAS itself retires in the budget
 * phase: newgens will inherit their slot's bloodline instead.) */
const ROLE_BIAS: Record<Role, Partial<PlayerAttributes>> = {
  GK: { reflexes: 0.3 },
  DF: { defending: 0.25 },
  MF: { passing: 0.2 },
  WG: { pace: 0.25 },
  ST: { finishing: 0.25 },
};

export function randomPlayer(rng: Rng, role: Role): PlayerAttributes {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = rng.range(0.1, 0.7);
  const bias = ROLE_BIAS[role];
  for (const k of Object.keys(bias) as AttrKey[]) p[k] = clamp01(p[k] + (bias[k] ?? 0));
  return p;
}

export function randomSquad(rng: Rng): PlayerAttributes[] {
  return SQUAD_ROLES.map((role) => randomPlayer(rng, role));
}

export interface SquadMutateOptions {
  /** Probability each attribute of each player mutates. */
  rate?: number;
  /** Std-dev of gaussian noise. */
  scale?: number;
}

export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
  const rate = opts.rate ?? 0.35;
  const scale = opts.scale ?? 0.1;
  return squad.map((p) => {
    const out = { ...p };
    for (const k of ATTR_KEYS) {
      if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
    }
    return out;
  });
}

/**
 * Position-wise crossover: for each squad slot the child inherits that slot's
 * player from parent A, parent B, or a blend — like signing a mixed starting
 * five from both academies.
 */
export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rng: Rng): PlayerAttributes[] {
  return a.map((pa, i) => {
    const pb = b[i];
    const r = rng.next();
    if (r < 0.4) return { ...pa };
    if (r < 0.8) return { ...pb };
    const mix = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) mix[k] = (pa[k] + pb[k]) / 2;
    return mix;
  });
}

/** Squad-average of each attribute — shown on team cards. */
export function squadSummary(squad: PlayerAttributes[]): PlayerAttributes {
  const sum = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) sum[k] = 0;
  for (const p of squad) for (const k of ATTR_KEYS) sum[k] += p[k];
  for (const k of ATTR_KEYS) sum[k] /= Math.max(squad.length, 1);
  return sum;
}
