/**
 * Probe: FREQUENCY DEPENDENCE (Phase 65 — the yardstick that replaces
 * cycles-in-3-worlds as N1.5's measure).
 *
 * The user's original question was "can the game grow SELF-SUSTAINING
 * tactical diversity?". Population ecology's standard test: NEGATIVE
 * frequency dependence — when a style gets COMMON, its relative payoff
 * FALLS (so it self-limits and rivals persist); positive FD is
 * winner-take-all (a runaway meta); ~zero is drift under constraints.
 * The cross-era snapshot matrix conflated this with arms-race progress;
 * this measures it directly, in-league, per axis:
 *
 *   for each gene axis: share_t = fraction of clubs with gene > 0.6
 *                       perf_t  = their mean (pts − division mean)
 *   FD(axis) = corr over seasons(share_t, perf_t)
 *
 * plus the same for the formation-identity menu (atk shape, def shape,
 * marking scheme). 2 worlds × 30 seasons.
 *
 *   npx tsx scripts/probes/freq-dependence.ts
 */
import { GENE_KEYS, type GeneKey } from '../../src/evolution/genome';
import { League } from '../../src/sim/League';

interface SeasonSnap {
  genes: Array<Record<GeneKey, number>>;
  relPts: number[];
  atkWide: boolean[];
  defPress: boolean[];
  zonal: boolean[];
}

const corr = (xs: number[], ys: number[]): number => {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return num / Math.max(Math.sqrt(dx * dy), 1e-9);
};

const SEASONS = 30;

for (const seed of [424242, 991]) {
  console.log(`-- world ${seed}: ${SEASONS} seasons --`);
  const league = new League({ seed });
  const snaps: SeasonSnap[] = [];
  for (let s = 0; s < SEASONS; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    // Snapshot BEFORE evolution mutates the genomes that earned the points.
    const divMean = [0, 1].map((d) => {
      const rows = league.table.filter((r) => league.franchise(r.slot).division === d);
      return rows.reduce((a, r) => a + r.pts, 0) / Math.max(rows.length, 1);
    });
    snaps.push({
      genes: league.franchises.map((f) => ({ ...f.coach.genome })),
      relPts: league.franchises.map((f) => {
        const row = league.table.find((r) => r.slot === f.slot)!;
        return row.pts - divMean[f.division];
      }),
      atkWide: league.franchises.map((f) => f.coach.style.formationAtk === 'wide-212'),
      defPress: league.franchises.map((f) => f.coach.style.formationDef === 'press-23'),
      zonal: league.franchises.map((f) => f.coach.style.scheme === 'zonal'),
    });
    league.finishSeason();
  }

  const fdOf = (label: string, member: (snap: SeasonSnap, i: number) => boolean): void => {
    const shares: number[] = [];
    const perfs: number[] = [];
    for (const snap of snaps) {
      const idx = snap.genes.map((_, i) => i);
      const inG = idx.filter((i) => member(snap, i));
      if (inG.length < 2 || inG.length > 14) continue; // need both groups populated
      shares.push(inG.length / idx.length);
      perfs.push(inG.reduce((a, i) => a + snap.relPts[i], 0) / inG.length);
    }
    if (shares.length < 10) {
      console.log(`  ${label.padEnd(22)} — insufficient seasons with both groups (${shares.length})`);
      return;
    }
    const r = corr(shares, perfs);
    const meanShare = shares.reduce((a, b) => a + b, 0) / shares.length;
    const flag = r < -0.3 ? 'SELF-BALANCING' : r > 0.3 ? 'RUNAWAY' : 'neutral';
    console.log(
      `  ${label.padEnd(22)} n ${String(shares.length).padStart(2)}  share ${meanShare.toFixed(2)}  ` +
      `FD r ${r >= 0 ? '+' : ''}${r.toFixed(2)}  ${flag}`,
    );
  };

  for (const k of GENE_KEYS) fdOf(k, (snap, i) => snap.genes[i][k] > 0.6);
  fdOf('atk wide-212', (snap, i) => snap.atkWide[i]);
  fdOf('def press-23', (snap, i) => snap.defPress[i]);
  fdOf('zonal marking', (snap, i) => snap.zonal[i]);
  console.log('');
}
console.log('verdict — negative FD on real axes = the ecology self-balances (diversity is self-sustaining)');
