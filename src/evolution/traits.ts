import type { Role } from '../sim/types';
import type { PlayerAttributes } from './playerGenome';

/**
 * Player TRAITS (Phase 39) — small, readable individuality on top of the
 * attribute vector. DERIVED, never stored: a pure function of (attrs,
 * role), so newgens and developing players grow into (and out of) them
 * with no save-schema change. Capped at 2 per player, 6 types total (the
 * roadmap's anti-soup rule) — and every one has a PLAY effect:
 *
 *   clinical  aimMargin −0.1 (shaves the post)     shooters, finishing
 *   poacher   run target pulls toward the goalmouth ST instinct-finisher
 *   playmaker pass-lane read ×1.15                  technique on the ball
 *   enforcer  tackle +0.04, foul +0.02              the destroyer
 *   engine    stamina drain ×0.9                    the motor
 *   cat       keeper reach +0.12                    GK reflexes
 */
export type Trait = 'clinical' | 'playmaker' | 'enforcer' | 'engine' | 'poacher' | 'cat';

export const TRAIT_KEYS: readonly Trait[] = [
  'clinical', 'playmaker', 'enforcer', 'engine', 'poacher', 'cat',
];

/** Display chips — emoji read on a phone in any language. */
export const TRAIT_EMOJI: Record<Trait, string> = {
  clinical: '🎯',
  playmaker: '🎩',
  enforcer: '🛡️',
  engine: '🔋',
  poacher: '🦊',
  cat: '🐱',
};

/** Candidate traits with how far past their bar this player is. */
function candidates(a: PlayerAttributes, role: Role): Array<{ t: Trait; excess: number }> {
  const out: Array<{ t: Trait; excess: number }> = [];
  if (role === 'GK') {
    if (a.reflexes >= 0.85) out.push({ t: 'cat', excess: a.reflexes - 0.85 });
    return out; // keepers are keepers — outfield traits stay outfield
  }
  if (role !== 'DF' && a.finishing >= 0.8) out.push({ t: 'clinical', excess: a.finishing - 0.8 });
  if (role === 'ST' && a.finishing >= 0.75 && a.dribbling < 0.6) {
    out.push({ t: 'poacher', excess: a.finishing - 0.75 });
  }
  if (a.passing >= 0.8) out.push({ t: 'playmaker', excess: a.passing - 0.8 });
  if (a.defending >= 0.8) out.push({ t: 'enforcer', excess: a.defending - 0.8 });
  if (a.pace >= 0.82) out.push({ t: 'engine', excess: a.pace - 0.82 });
  return out;
}

/** The 1–2 traits this player IS (deterministic: sorted by excess, ties by
 * table order so equal-excess picks never depend on insertion luck). */
export function traitsOf(a: PlayerAttributes, role: Role): Trait[] {
  return candidates(a, role)
    .sort((x, y) => y.excess - x.excess || TRAIT_KEYS.indexOf(x.t) - TRAIT_KEYS.indexOf(y.t))
    .slice(0, 2)
    .map((c) => c.t);
}
