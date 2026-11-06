/**
 * World 0 vs world 18 over many seasons — does the league's style ecology collapse when the
 * whole league plays world 18? (docs/STATUS.md, decision 3: world 18 becomes the default only
 * if style diversity does not collapse.)
 *
 * Both worlds run the SAME headless loop the sim worker runs (`runHeadless`), armed through the
 * SAME helper the app hands the worker (`a4HeadlessWorld`), with the doses loaded by the app's
 * own loaders (`loadL3Dose` / `loadPcDose`, SHA-guarded). World 18 is played in its default
 * form — the matured books, what a player gets with no `?pcdose=` param.
 *
 *   npx tsx scripts/world-compare.ts [--seasons 10] [--seeds 424242,31313,1337] [--duration S]
 *
 * `--duration` overrides the match length in sim seconds (default: the shipped length) — for
 * smoke runs only; the comparison of record uses full-length matches.
 *
 * The COLLAPSED thresholds at the bottom are PROPOSED, NOT CALIBRATED (2026-11-06): each is a
 * ratio against world 0 on the same seeds, never an absolute value.
 */
import { createHash } from 'node:crypto';
import { detectEras } from '../src/evolution/eras';
import { dimStats, nameplates, styleSpread } from '../src/evolution/styleSpace';
import {
  a4HeadlessWorld, loadL3Dose, loadPcDose, type A4LeagueWorld,
} from '../src/game/a4World';
import { League, type SeasonRecord } from '../src/sim/League';
import { runHeadless } from '../src/sim/simRunner';

const arg = (name: string): string | undefined => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const SEASONS = Number(arg('seasons') ?? 10);
const SEEDS = (arg('seeds') ?? '424242,31313,1337').split(',').map(Number);
const DURATION = arg('duration') === undefined ? undefined : Number(arg('duration'));
if (!Number.isInteger(SEASONS) || SEASONS < 1 || SEEDS.some((s) => !Number.isFinite(s))
  || (DURATION !== undefined && !(DURATION > 0))) {
  console.error('usage: world-compare.ts [--seasons N] [--seeds a,b,c] [--duration S]');
  process.exit(2);
}

interface Row {
  seed: number;
  world: 0 | 18;
  secs: number;
  goalsPerMatch: number;
  champs: number;
  maxTitles: number;
  eras: number;
  spreadMean: number;
  spreadFinal: number;
  plates: number;
  atkKinds: number;
  defKinds: number;
  maxIdShare: number;
  zonal: number;
  switches: number;
  eloSD: number;
  finalShares: string;
  sha: string;
}

/** How many identities hold at least one club. */
const kinds = (r: Record<string, number>): number => Object.values(r).filter((n) => n > 0).length;
const top = (r: Record<string, number>): number => Math.max(0, ...Object.values(r));
const mean = (xs: number[]): number => xs.reduce((a, x) => a + x, 0) / Math.max(xs.length, 1);
const sd = (xs: number[]): number => {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};
const fmtShares = (r: Record<string, number>): string =>
  Object.entries(r).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join(',');

function measure(seed: number, world: A4LeagueWorld): Row {
  const league = new League({ seed, matchDuration: DURATION });
  const target = league.generation + SEASONS;
  const t0 = performance.now();
  const out = runHeadless(
    league.toJSON() as Record<string, unknown>,
    { kind: 'toGeneration', target },
    (p) => {
      if (p.seasonFinished) process.stderr.write(`  seed ${seed} world ${world.version}: gen ${p.generation - 1} done\n`);
    },
    undefined,
    a4HeadlessWorld(world),
  );
  const secs = (performance.now() - t0) / 1000;
  const end = League.fromJSON(out.league);
  const hist: SeasonRecord[] = end.history.slice(-SEASONS);

  let goals = 0;
  let played = 0;
  for (const rec of hist) {
    for (const t of rec.table) {
      goals += t.gf;
      played += t.w + t.d + t.l;
    }
  }
  const titles = new Map<string, number>();
  for (const rec of hist) titles.set(rec.championName, (titles.get(rec.championName) ?? 0) + 1);
  // A season's style snapshot is taken BEFORE that season's evolution, so the run's first record
  // is the initial population in both worlds — style metrics skip it (it only dilutes the ratio).
  const styled = hist.slice(1);
  const spreads = styled
    .filter((r) => r.styleMatrix && r.styleMatrix.length > 0)
    .map((r) => styleSpread(dimStats(r.styleMatrix!.map((m) => m.values))));
  const shares = styled.map((r) => r.styleShares).filter((s) => s !== undefined);
  const plates = new Set(
    nameplates(end.franchises.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })))
      .map((p) => p.join('+')),
  );
  const last = shares[shares.length - 1];
  return {
    seed,
    world: world.version as 0 | 18,
    secs,
    goalsPerMatch: played > 0 ? goals / (played / 2) : NaN,
    champs: titles.size,
    maxTitles: Math.max(0, ...titles.values()),
    eras: detectEras(end.history).length,
    spreadMean: mean(spreads),
    spreadFinal: spreads[spreads.length - 1] ?? NaN,
    plates: plates.size,
    atkKinds: last ? kinds(last.atk) : NaN,
    defKinds: last ? kinds(last.def) : NaN,
    // atk/def only: the marking scheme is capped by contract (at most max(4, initial) zonal
    // clubs), so 'man' holding 12+ of 16 is the design, not a collapse — `zonal` reports it.
    maxIdShare: Math.max(...shares.map((s) => Math.max(top(s.atk), top(s.def)))),
    zonal: last?.scheme.zonal ?? 0,
    switches: end.franchises.reduce(
      (a, f) => a + f.lineage.filter((l) => l.note?.startsWith('🔧')).length, 0),
    eloSD: sd(end.franchises.map((f) => f.elo)),
    finalShares: last ? `atk[${fmtShares(last.atk)}] def[${fmtShares(last.def)}] scheme[${fmtShares(last.scheme)}]` : '-',
    sha: createHash('sha256').update(JSON.stringify(out.league)).digest('hex').slice(0, 12),
  };
}

const COLS: Array<[string, number]> = [['seed', -7], ['world', 5], ['secs', 6], ['goals/m', 7],
  ['champs', 6], ['maxTitles', 9], ['eras', 5], ['spreadMean', 10], ['spreadFinal', 11],
  ['plates', 6], ['atkKinds', 8], ['defKinds', 8], ['maxIdShare', 10], ['zonal', 5], ['switches', 8],
  ['eloSD', 6], ['sha', 0]];
const header = COLS.map(([n, w]) => (w < 0 ? n.padEnd(-w) : n.padStart(w))).join('  ');
const line = (r: Row | (Omit<Row, 'seed' | 'sha' | 'finalShares'> & { seed: string; sha: string })): string => [
  String(r.seed).padEnd(7), String(r.world).padStart(5), r.secs.toFixed(1).padStart(6),
  r.goalsPerMatch.toFixed(3).padStart(7), r.champs.toFixed(1).padStart(6), r.maxTitles.toFixed(1).padStart(9),
  r.eras.toFixed(1).padStart(5), r.spreadMean.toFixed(4).padStart(10), r.spreadFinal.toFixed(4).padStart(11),
  r.plates.toFixed(1).padStart(6), r.atkKinds.toFixed(1).padStart(8), r.defKinds.toFixed(1).padStart(8),
  r.maxIdShare.toFixed(1).padStart(10), r.zonal.toFixed(1).padStart(5), r.switches.toFixed(1).padStart(8),
  r.eloSD.toFixed(1).padStart(6), r.sha,
].join('  ');

async function main(): Promise<void> {
  const [l3Dose, pcDose] = await Promise.all([loadL3Dose(), loadPcDose()]);
  const worlds: A4LeagueWorld[] = [
    { version: 0, tables: null, l3Dose: null, pcDose: null },
    { version: 18, tables: null, l3Dose, pcDose },
  ];
  console.log(`world-compare  seasons=${SEASONS}  seeds=${SEEDS.join(',')}`
    + `  duration=${DURATION ?? 'shipped'}  (world 18 = matured books)`);
  const rows: Row[] = [];
  for (const seed of SEEDS) for (const w of worlds) rows.push(measure(seed, w));

  console.log(header);
  for (const r of rows) console.log(line(r));
  const byWorld = (w: 0 | 18): Row[] => rows.filter((r) => r.world === w);
  const avg = (w: 0 | 18) => {
    const rs = byWorld(w);
    const m = (k: keyof Row): number => mean(rs.map((r) => r[k] as number));
    return {
      seed: 'MEAN', world: w, secs: m('secs'), goalsPerMatch: m('goalsPerMatch'), champs: m('champs'),
      maxTitles: m('maxTitles'), eras: m('eras'), spreadMean: m('spreadMean'), spreadFinal: m('spreadFinal'),
      plates: m('plates'), atkKinds: m('atkKinds'), defKinds: m('defKinds'), maxIdShare: m('maxIdShare'),
      zonal: m('zonal'), switches: m('switches'), eloSD: m('eloSD'), sha: '-',
    };
  };
  const a0 = avg(0);
  const a18 = avg(18);
  console.log(line(a0));
  console.log(line(a18));
  const ratio = (a: number, b: number): string => (b === 0 ? 'n/a' : (a / b).toFixed(2));
  console.log(`ratio 18/0   goals/m ${ratio(a18.goalsPerMatch, a0.goalsPerMatch)}`
    + `  champs ${ratio(a18.champs, a0.champs)}  spreadMean ${ratio(a18.spreadMean, a0.spreadMean)}`
    + `  plates ${ratio(a18.plates, a0.plates)}  eloSD ${ratio(a18.eloSD, a0.eloSD)}`);
  console.log('\nfinal-season styleShares:');
  for (const r of rows) console.log(`  ${String(r.seed).padEnd(7)} w${String(r.world).padEnd(2)}  ${r.finalShares}`);

  // ⚠ PROPOSED, UNCALIBRATED thresholds (2026-11-06) — same-seed world 0 is the only control.
  const reasons: string[] = [];
  for (const seed of SEEDS) {
    const r0 = rows.find((r) => r.seed === seed && r.world === 0)!;
    const r18 = rows.find((r) => r.seed === seed && r.world === 18)!;
    if (r18.maxIdShare >= 14 && r0.maxIdShare < 14) {
      reasons.push(`seed ${seed}: one atk/def identity held ${r18.maxIdShare}/16 clubs`);
    }
  }
  if (a18.atkKinds < a0.atkKinds - 0.5) reasons.push('fewer atk identities alive at the end than world 0');
  if (a18.defKinds < a0.defKinds - 0.5) reasons.push('fewer def identities alive at the end than world 0');
  if (a18.spreadMean < 0.8 * a0.spreadMean) reasons.push('spreadMean < 0.8 x world 0');
  if (a18.plates < 0.75 * a0.plates) reasons.push('plates < 0.75 x world 0');
  if (a18.champs < 0.5 * a0.champs) reasons.push('champs < 0.5 x world 0');
  console.log(`\nVERDICT (proposed thresholds, uncalibrated): ${reasons.length === 0 ? 'OK' : `COLLAPSED (${reasons.join('; ')})`}`);
}

void main();
