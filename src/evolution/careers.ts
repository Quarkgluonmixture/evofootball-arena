import { clamp01 } from '../utils/math';
import type { Rng } from '../utils/rng';
import { ATTR_KEYS, type AttrKey, type PlayerAttributes } from './playerGenome';

/**
 * Player careers (Phase 26): every squad member has an age, develops along an
 * age curve, retires in their mid-thirties and is replaced by a newgen — so
 * squads become dynasties of individuals instead of rerolled stat blocks.
 * Everything is seeded (the League's aging pass owns the Rng); nothing here
 * touches the sim — careers act ONLY through the attribute genes the sim
 * already reads.
 */

/** Career ledger, accumulated from per-player season stats at season end. */
export interface PlayerCareer {
  seasons: number;
  goals: number;
  assists: number;
  saves: number;
  recoveries: number;
}

export const emptyCareer = (): PlayerCareer => ({
  seasons: 0,
  goals: 0,
  assists: 0,
  saves: 0,
  recoveries: 0,
});

/** A retired player worth remembering — the hall of fame keeps the best. */
export interface LegendEntry {
  name: string;
  team: string;
  role: string;
  age: number;
  career: PlayerCareer;
}

/** Newgens debut at 17–19. */
export function rookieAge(rng: Rng): number {
  return 17 + rng.int(0, 2);
}

/** Founded/backfilled squads span the whole career arc (20–32). */
export function veteranAge(rng: Rng): number {
  return rng.int(20, 32);
}

/** Pace fades fastest with age; technique holds longest. */
const DECLINE_W: Record<AttrKey, number> = {
  pace: 1.5,
  technique: 0.6,
  finishing: 0.9,
  defending: 0.9,
  reflexes: 1.1,
};

/**
 * One season of age-driven development: strong growth for teenagers tapering
 * to nothing by 24, a plateau through the twenties, decline from 30 — plus a
 * little seeded noise so no two careers are identical. Growth up and decline
 * down are sized so a full career roughly round-trips: the league's attribute
 * means stay stable across generations (regression-tested over 15 seasons).
 */
export function developPlayer(p: PlayerAttributes, age: number, rng: Rng): PlayerAttributes {
  const growth = age <= 23 ? (0.03 * (24 - age)) / 7 : 0;
  const decline = age >= 30 ? -0.012 * (age - 29) : 0;
  const out = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) {
    out[k] = clamp01(p[k] + growth + decline * DECLINE_W[k] + rng.gaussian() * 0.015);
  }
  return out;
}

/** Retirement odds at season end: none before 32, certain by 36. */
export function retireChance(age: number): number {
  if (age < 32) return 0;
  return Math.min(1, 0.15 + (age - 32) * 0.22);
}
