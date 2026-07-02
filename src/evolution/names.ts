import type { Rng } from '../utils/rng';

const PREFIXES = [
  'Crimson', 'Azure', 'Neon', 'Iron', 'Golden', 'Shadow', 'Solar', 'Arctic',
  'Velvet', 'Turbo', 'Quantum', 'Royal', 'Ember', 'Static', 'Feral', 'Cosmic',
  'Obsidian', 'Rustic', 'Electric', 'Phantom',
];

const NOUNS = [
  'Wolves', 'Falcons', 'Comets', 'Titans', 'Sparks', 'Serpents', 'Mariners',
  'Foxes', 'Ravens', 'Pumas', 'Dynamo', 'Orbit', 'Locusts', 'Herons',
  'Badgers', 'Cyclones', 'Otters', 'Jackals', 'Pilots', 'Nomads',
];

const SURNAMES = [
  'Adler', 'Boro', 'Cato', 'Dree', 'Eska', 'Ferro', 'Guss', 'Halo', 'Ivek',
  'Jarra', 'Kade', 'Lumo', 'Mirek', 'Nolo', 'Ovie', 'Pika', 'Quill', 'Rasco',
  'Soto', 'Tarn', 'Ulmo', 'Vesk', 'Wren', 'Xylo', 'Yano', 'Zubat', 'Ando',
  'Brix', 'Corda', 'Dova', 'Enzo', 'Frey', 'Gale', 'Hosk', 'Iber', 'Jett',
];

/** Distinct kit palettes per league slot (green avoided — the pitch is green). */
export const KIT_COLORS: Array<{ primary: number; secondary: number }> = [
  { primary: 0xd64550, secondary: 0xffffff }, // red
  { primary: 0x3b82f6, secondary: 0xfde047 }, // blue
  { primary: 0x9b5cf6, secondary: 0xf1f5f9 }, // purple
  { primary: 0xf97316, secondary: 0x1e293b }, // orange
  { primary: 0x22d3ee, secondary: 0x0f172a }, // cyan
  { primary: 0xec4899, secondary: 0xfefce8 }, // pink
  { primary: 0xfacc15, secondary: 0x111827 }, // yellow
  { primary: 0x94a3b8, secondary: 0x111111 }, // steel
];

export function uniqueTeamName(rng: Rng, taken: Set<string>): string {
  for (let i = 0; i < 200; i++) {
    const name = `${rng.pick(PREFIXES)} ${rng.pick(NOUNS)}`;
    if (!taken.has(name)) {
      taken.add(name);
      return name;
    }
  }
  // Pathological fallback — still deterministic.
  const name = `Club ${taken.size + 1}`;
  taken.add(name);
  return name;
}

export function shortName(name: string): string {
  return name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
}

/** Five squad surnames, order = [GK, DF, MF, WG, ST]. */
export function generatePlayerNames(rng: Rng): string[] {
  const pool = [...SURNAMES];
  rng.shuffle(pool);
  return pool.slice(0, 5);
}
