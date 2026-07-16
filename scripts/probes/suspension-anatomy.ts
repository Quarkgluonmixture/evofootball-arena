/**
 * SUSPENSION ANATOMY (Phase 62 — CARDS THAT BIND).
 *
 * Step A (pre-registration, run BEFORE the system existed — numbers in the
 * phase-62 ledger): at the old referee pricing the league drew only 52-67
 * yellows a season (player median 0, threshold-3 bans 2-4/season) and club
 * yellows coupled to style at r≈0.18 (MA) / 0.31 (press) — any suspension
 * system on that volume would be a dead wire (failure mode 25). That
 * evidence set the referee reprice (yellowP 0.12+MA·0.12 → 0.16+MA·0.28).
 *
 * This file now measures the LIVE system: binding volume (bans actually
 * served), style targeting (who serves them), and the XI cost of a cover
 * (the discipline price's transmission into results).
 *
 * Run: npx tsx scripts/probes/suspension-anatomy.ts
 */
import { ATTR_KEYS } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { ROSTER_SIZE, TEAM_SIZE } from '../../src/sim/types';

for (const seed of [424242, 991]) {
  console.log(`-- world ${seed}: 6 seasons evolved, season 7 measured --`);
  const league = new League({ seed });
  let banMatches = 0; // man-matches sat out, season 7
  let coverDelta = 0; // attr-total delta starter-minus-cover when a ban is covered
  let covers = 0;
  const bansByClub = new Map<number, number>();
  const play = (measure: boolean): void => {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      if (measure) {
        for (const slot of [f.home, f.away]) {
          const fr = league.franchise(slot);
          for (let ri = 1; ri < ROSTER_SIZE; ri++) {
            if (fr.suspensions[ri] > 0) {
              banMatches++;
              bansByClub.set(slot, (bansByClub.get(slot) ?? 0) + 1);
              if (ri < TEAM_SIZE) {
                // the like-for-like cover the lineup will field
                const info = league.teamInfo(slot);
                const coverRi = info.lineup?.[ri];
                if (coverRi !== undefined && coverRi !== ri) {
                  const tot = (r: number): number =>
                    ATTR_KEYS.reduce((a, k) => a + fr.squad[r][k], 0);
                  coverDelta += tot(ri) - tot(coverRi);
                  covers++;
                }
              }
            }
          }
        }
      }
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
  };
  for (let s = 0; s < 6; s++) {
    play(false);
    league.finishSeason();
  }
  play(true); // season 7 stays unfinished: playerAgg holds its card ledger
  console.log(
    `  BINDING: ${banMatches} banned man-matches served; XI covers ${covers}, ` +
    `mean attr-total cost ${(covers ? coverDelta / covers : 0).toFixed(2)} ` +
    `(a starter is ~4.0 total)`,
  );
  if (bansByClub.size > 0) {
    const worst = [...bansByClub.entries()].sort((a, b) => b[1] - a[1])[0];
    console.log(
      `  bans hit ${bansByClub.size}/16 clubs; worst: ${league.franchise(worst[0]).name} ` +
      `${worst[1]} man-matches (MA ${league.franchise(worst[0]).coach.genome.markingAggression.toFixed(2)}, ` +
      `press ${league.franchise(worst[0]).coach.genome.pressIntensity.toFixed(2)})`,
    );
  }

  const players: Array<{ y: number; reds: number; ma: number; press: number }> = [];
  for (const f of league.franchises) {
    for (let i = 0; i < ROSTER_SIZE; i++) {
      const s = league.playerAgg[f.slot][i];
      players.push({
        y: s.yellows,
        reds: s.reds,
        ma: f.coach.genome.markingAggression,
        press: f.coach.genome.pressIntensity,
      });
    }
  }
  const ys = players.map((p) => p.y).sort((a, b) => a - b);
  const q = (f: number): number => ys[Math.min(ys.length - 1, Math.floor(ys.length * f))];
  const totalY = ys.reduce((a, b) => a + b, 0);
  const totalR = players.reduce((a, b) => a + b.reds, 0);
  console.log(
    `  season yellows: total ${totalY} (reds ${totalR}) — per player med ${q(0.5)}, ` +
    `p75 ${q(0.75)}, p90 ${q(0.9)}, max ${ys[ys.length - 1]}`,
  );
  // Correlation: does the tail belong to aggressive CLUBS?
  const meanY = totalY / players.length;
  const meanMa = players.reduce((a, b) => a + b.ma, 0) / players.length;
  let num = 0;
  let dy = 0;
  let dm = 0;
  for (const p of players) {
    num += (p.y - meanY) * (p.ma - meanMa);
    dy += (p.y - meanY) ** 2;
    dm += (p.ma - meanMa) ** 2;
  }
  console.log(`  yellows ↔ club markingAggression r = ${(num / Math.sqrt(dy * dm)).toFixed(2)}`);
  for (const T of [2, 3, 4, 5]) {
    const bans = players.reduce((a, p) => a + Math.floor(p.y / T), 0);
    const banned = players.filter((p) => p.y >= T).length;
    console.log(
      `  threshold ${T}: ${bans} accumulation bans / league season, ` +
      `${banned}/${players.length} players hit it at least once`,
    );
  }
  console.log(`  red bans (1 match each): ${totalR} / league season`);

  // CLUB level: per-player yellows are rare (median 0), so the player-level
  // r drowns in Poisson noise — the style question lives at club volume.
  const clubs = league.franchises.map((f) => {
    let y = 0;
    for (let i = 0; i < ROSTER_SIZE; i++) y += league.playerAgg[f.slot][i].yellows;
    return {
      y,
      ma: f.coach.genome.markingAggression,
      press: f.coach.genome.pressIntensity,
      name: f.name,
    };
  });
  const r = (xs: number[], ys2: number[]): number => {
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys2.reduce((a, b) => a + b, 0) / ys2.length;
    let n2 = 0;
    let dx = 0;
    let dy2 = 0;
    for (let i = 0; i < xs.length; i++) {
      n2 += (xs[i] - mx) * (ys2[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy2 += (ys2[i] - my) ** 2;
    }
    return n2 / Math.max(Math.sqrt(dx * dy2), 1e-9);
  };
  console.log(
    `  CLUB yellows ↔ markingAggression r = ${r(clubs.map((c) => c.ma), clubs.map((c) => c.y)).toFixed(2)}, ` +
    `↔ pressIntensity r = ${r(clubs.map((c) => c.press), clubs.map((c) => c.y)).toFixed(2)}`,
  );
  const top = [...clubs].sort((a, b) => b.y - a.y).slice(0, 3);
  const bot = [...clubs].sort((a, b) => a.y - b.y).slice(0, 3);
  console.log(
    `  dirtiest: ${top.map((c) => `${c.name} ${c.y}🟨 (MA ${c.ma.toFixed(2)})`).join(' · ')}`,
  );
  console.log(
    `  cleanest: ${bot.map((c) => `${c.name} ${c.y}🟨 (MA ${c.ma.toFixed(2)})`).join(' · ')}`,
  );
}
