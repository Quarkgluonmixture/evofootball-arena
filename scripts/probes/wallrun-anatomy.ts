/**
 * Probe (119i, 2026-07-19): WHY does the give-and-go never complete? The
 * give-and-go probe found oneTwos = 0.07/match though 7-9/16 clubs clear the
 * gene gate — the `wallRun` LICENSE fires but the return almost never gets
 * played. Is it the "GO" (the burst beats nobody → the return is covered) or
 * the "RETURN" (the carrier never chooses the bursting partner)?
 *
 * Tracks every wallRun license from set → expiry (2.3s). At the license's
 * PEAK (the burster's max separation from his nearest opponent during the
 * window) records: separation achieved, whether the carrier still held the
 * ball then, whether a return pass to the burster was played, and whether he
 * received it. Buckets separation so we can see if the "go" ever gets open.
 *
 *   npx tsx scripts/probes/wallrun-anatomy.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT } from '../../src/sim/constants';
import { dist } from '../../src/utils/vec';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';

const GENS = Number(process.argv[2] ?? 21);

function loadWorld(seed: number): League {
  const path = `/tmp/evo-snap-${seed}-g${GENS}.json`;
  if (existsSync(path)) return League.fromJSON(JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>);
  const league = new League({ seed });
  for (let g = 0; g < GENS; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  writeFileSync(path, JSON.stringify(league.toJSON()));
  return league;
}

function nearestOppDist(p: Player, m: Match): number {
  let best = Infinity;
  for (const o of m.teams[1 - p.side].players) {
    if (o.sentOff) continue;
    const d = dist(o.pos, p.pos);
    if (d < best) best = d;
  }
  return best;
}

for (const seed of [991, 424242]) {
  const league = loadWorld(seed);
  let matches = 0;
  let licenses = 0;
  let returnPlayed = 0;
  let returnReceived = 0;
  const sepBand = { tight: 0, half: 0, open: 0 }; // peak sep <2 / <4 / >=4m
  let sepSum = 0;
  let carrierGoneAtPeak = 0;

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;
    // one active license tracked per burster gid; a license is IDENTIFIED by
    // its `until` — the field lingers after 2.3s expiry (cleared only on the
    // next pass), so counting per-tick zombie-inflates. Count each distinct
    // `until` exactly once.
    const live = new Map<number, { until: number; partnerGid: number; peakSep: number; carrierGoneSeen: boolean; done: boolean }>();
    const counted = new Map<number, number>(); // gid -> last counted `until`

    while (!m.finished) {
      // detect newly-set licenses (a fresh `until`) BEFORE stepping
      for (const team of m.teams) {
        for (const p of team.players) {
          if (p.wallRun && counted.get(p.gid) !== p.wallRun.until && m.simTime < p.wallRun.until - 0.01) {
            counted.set(p.gid, p.wallRun.until);
            licenses++;
            live.set(p.gid, { until: p.wallRun.until, partnerGid: p.wallRun.partnerGid, peakSep: 0, carrierGoneSeen: false, done: false });
          }
        }
      }
      m.step(DT);
      const b = m.ball;
      for (const [gid, rec] of live) {
        if (rec.done) continue;
        const burster = m.teams[0].players.find((q) => q.gid === gid) ?? m.teams[1].players.find((q) => q.gid === gid);
        if (!burster) { rec.done = true; continue; }
        // separation the "go" is achieving right now
        const sep = nearestOppDist(burster, m);
        if (sep > rec.peakSep) rec.peakSep = sep;
        // is the wall partner (the carrier) still holding the ball?
        const carrierHolds = b.owner !== null && b.owner.gid === rec.partnerGid;
        if (!carrierHolds) rec.carrierGoneSeen = true;
        // return played TO the burster?
        if (m.pendingPass && m.pendingPass.targetGid === gid && m.pendingPass.passerGid === rec.partnerGid) {
          returnPlayed++;
          rec.done = true;
          // did he receive it (own it within 1.5s)? approximate: check next frames
        }
        if (b.owner && b.owner.gid === gid && rec.carrierGoneSeen) {
          // he got the ball back after the partner released — a completed one-two-ish
          returnReceived++;
          rec.done = true;
        }
        if (m.simTime >= rec.until && !rec.done) {
          // license expired unused — bucket the peak separation it reached
          if (rec.peakSep < 2) sepBand.tight++;
          else if (rec.peakSep < 4) sepBand.half++;
          else sepBand.open++;
          sepSum += rec.peakSep;
          if (!carrierHolds) carrierGoneAtPeak++;
          rec.done = true;
        }
      }
      for (const [gid, rec] of live) if (rec.done && m.simTime >= rec.until) live.delete(gid);
    }
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const expired = sepBand.tight + sepBand.half + sepBand.open;
  const pct = (n: number, d: number): string => `${((n / Math.max(d, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, ${matches} matches):`);
  console.log(`  wallRun licenses ${(licenses / matches).toFixed(1)}/match · return PLAYED ${pct(returnPlayed, licenses)} · return RECEIVED ${pct(returnReceived, licenses)}`);
  console.log(`  of EXPIRED-unused licenses (${expired}): peak burster separation tight(<2m) ${pct(sepBand.tight, expired)} · half(<4m) ${pct(sepBand.half, expired)} · open(>=4m) ${pct(sepBand.open, expired)} · x̄ ${(sepSum / Math.max(expired, 1)).toFixed(1)}m`);
  console.log(`  carrier lost the ball before peak: ${pct(carrierGoneAtPeak, expired)} of expired`);
}
