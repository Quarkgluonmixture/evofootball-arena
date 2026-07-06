/**
 * Bit-identical fingerprint probe (ARCHITECTURE invariant 2).
 *
 * Runs a fresh league N seasons headless with a fixed seed and prints a
 * sha256 of the save JSON. Hot-path optimizations must NOT change this hash
 * (same seed ⇒ same save JSON). Run before and after a perf change:
 *
 *   npx tsx scripts/fingerprint.ts            # seed 1337, 2 seasons
 *   npx tsx scripts/fingerprint.ts 42 5       # custom seed / seasons
 */
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { runHeadless } from '../src/sim/simRunner';

const seed = Number(process.argv[2] ?? 1337);
const seasons = Number(process.argv[3] ?? 2);

const league = new League({ seed });
const out = runHeadless(league.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration',
  target: league.generation + seasons,
});

const json = JSON.stringify(out.league);
const hash = createHash('sha256').update(json).digest('hex');
console.log(`seed=${seed} seasons=${seasons} matches=${out.matches}`);
console.log(`sha256=${hash}`);
