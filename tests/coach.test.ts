import { describe, expect, it } from 'vitest';
import { coachRetireChance, createCoach, foundingCoachAge } from '../src/evolution/coach';
import { randomGenome } from '../src/evolution/genome';
import { defaultPolicyGenes } from '../src/evolution/policyGenome';
import { League } from '../src/sim/League';
import { deriveTeamStyle } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * Phase 53 — the coach: the philosophy embodied in a named, aging person,
 * plus the memetic channel (rebirth = hiring, sack/hire mobility, mentor
 * tree). These tests drive REAL seasons; only the market is hand-seeded.
 */

const playSeason = (league: League): void => {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
};

// One shared played league — the expensive part — reused where possible.
let cached: League | null = null;
const playedLeague = (): League => {
  if (cached) return cached;
  const league = new League({ seed: 99, matchDuration: 30 });
  playSeason(league);
  league.finishSeason();
  cached = league;
  return league;
};

const mintCoach = (seed: number) => {
  const rng = new Rng(seed);
  const genome = randomGenome(rng);
  return createCoach(rng, genome, defaultPolicyGenes(), deriveTeamStyle(genome));
};

describe('the coach entity (Phase 53)', () => {
  it('every founding club employs a named, mid-career coach carrying the philosophy', () => {
    const league = new League({ seed: 7, matchDuration: 30 });
    for (const f of league.franchises) {
      expect(f.coach.name.split(' ').length).toBe(2);
      expect(f.coach.age).toBeGreaterThanOrEqual(38);
      expect(f.coach.age).toBeLessThanOrEqual(58);
      expect(f.coach.genome.passBias).toBeGreaterThanOrEqual(0);
      expect(f.coach.style.formationAtk).toBeDefined();
      expect(f.coach.career.clubs).toBe(1);
    }
  });

  it('banks the dugout season: titles/cups to the winners, seasons to everyone', () => {
    const league = playedLeague();
    const rec = league.history[0];
    // Banking runs BEFORE the aging pass, so when a winning coach RETIRES
    // the same season (legitimate coincidence — phase 58's reshuffle landed
    // on one), the banked honour rides into the legends hall with him and
    // the live pointer is his 0-honour successor.
    const retiredClubs = new Set(
      (rec.coaching ?? []).filter((e) => e.event === 'retired' || e.event === 'sacked').map((e) => e.club));
    const banked = (slot: number, honour: 'titles' | 'cups'): number => {
      const club = league.franchise(slot);
      // A reborn club carries a NEW name; its old boss sits in the pool
      // under the old one. Sacked bosses hit the pool, retirees the hall.
      const rebornEntry = rec.evolution.entries.find((e) => e.kind === 'reborn' && e.slot === slot);
      const oldName = rebornEntry?.oldName ?? club.name;
      if (!rebornEntry && !retiredClubs.has(oldName)) return club.coach.career[honour];
      const exCareer =
        league.coachLegends.find((l) => l.lastClub === oldName)?.career ??
        league.coachPool.find((p) => p.lastClub === oldName)?.coach.career;
      return exCareer?.[honour] ?? -1;
    };
    expect(banked(rec.championSlot, 'titles')).toBe(1);
    if (rec.cup) {
      expect(banked(rec.cup.winnerSlot, 'cups')).toBe(1);
    }
    // Reborn clubs' NEW coaches sat out the banked season — and so did the
    // fresh successors of same-season retirees.
    const reborn = new Set(rec.evolution.entries.filter((e) => e.kind === 'reborn').map((e) => e.slot));
    for (const f of league.franchises) {
      if (!reborn.has(f.slot) && f.slot !== rec.championSlot && !retiredClubs.has(f.name)) {
        expect(f.coach.career.seasons).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('rebirth is a HIRING: dead clubs fire into the pool, newborns get mentored newgens', () => {
    const league = playedLeague();
    const rec = league.history[0];
    const reborn = rec.evolution.entries.filter((e) => e.kind === 'reborn');
    expect(reborn.length).toBe(3);
    // The market holds the dead clubs' ex-managers, tagged with their old club.
    const pooledClubs = league.coachPool.map((p) => p.lastClub);
    for (const e of reborn) {
      expect(pooledClubs).toContain(e.oldName!);
      const f = league.franchise(e.slot);
      // The newgen coach: young, schooled by the dominant parent's manager.
      expect(f.coach.age).toBeGreaterThanOrEqual(34);
      expect(f.coach.age).toBeLessThanOrEqual(43); // 34–42 at hire, +1 aging pass
      expect(f.coach.mentor).toBeDefined();
      expect(e.coach).toBe(f.coach.name);
    }
  });

  it('a 70-year-old coach retires and his school succeeds him (mentor tree)', () => {
    const league = new League({ seed: 41, matchDuration: 30 });
    const target = league.franchises[3];
    const oldName = target.coach.name;
    target.coach.age = 70;
    target.coach.career.titles = 2; // a winner — the chronicle eulogizes him
    playSeason(league);
    const rec = league.finishSeason();
    expect(coachRetireChance(71)).toBe(1);
    expect(target.coach.name).not.toBe(oldName);
    expect(target.coach.mentor).toBe(oldName);
    expect(rec.coaching!.some((ev) => ev.event === 'retired' && ev.coach === oldName)).toBe(true);
    expect(rec.coaching!.some((ev) => ev.event === 'succeeded' && ev.club === target.name)).toBe(true);
    expect(league.coachLegends.some((l) => l.name === oldName && l.career.titles === 2)).toBe(true);
  });

  it('a chronically miserable club sacks its coach for the market\'s best philosophy', () => {
    const league = new League({ seed: 4242, matchDuration: 30 });
    playSeason(league);
    // Arm every fuse and plant one star free agent before season end.
    league.misery = league.franchises.map(() => 1);
    const star = mintCoach(555);
    league.coachPool.push({ coach: star, sinceGen: 1, lastFitness: 999, lastClub: 'Old Glory' });
    const rec = league.finishSeason();
    const sacked = rec.coaching!.filter((ev) => ev.event === 'sacked');
    const hired = rec.coaching!.filter((ev) => ev.event === 'hired');
    // Every sack pairs with a hire; the star gets landed exactly once (other
    // boards may hire the dead clubs' ex-managers — the channel working).
    expect(sacked.length).toBeGreaterThanOrEqual(1);
    expect(sacked.length).toBe(hired.length);
    const starHire = hired.filter((ev) => ev.coach === star.name);
    expect(starHire.length).toBe(1);
    const club = league.franchises.find((f) => f.name === starHire[0].club)!;
    expect(club.coach).toBe(star);
    expect(star.career.clubs).toBe(2);
    // The sacked man is back on the market, scarred.
    expect(league.coachPool.some((p) => p.coach.name === sacked[0].coach && p.coach.career.sackings >= 1)).toBe(true);
    // Lineage tells the story on the club.
    expect(club.lineage.some((l) => l.event === 'sacked')).toBe(true);
    expect(club.lineage.some((l) => l.event === 'hired')).toBe(true);
  });

  it('the market ages out: nobody waits by the phone forever', () => {
    const league = new League({ seed: 91, matchDuration: 30 });
    playSeason(league);
    const fossil = mintCoach(777);
    league.coachPool.push({ coach: fossil, sinceGen: -5, lastFitness: 0.0001, lastClub: 'Gone FC' });
    league.finishSeason();
    expect(league.coachPool.some((p) => p.coach === fossil)).toBe(false);
  });

  it('coach state roundtrips through the save byte-identically', () => {
    const league = playedLeague();
    const json = JSON.stringify(league.toJSON());
    const restored = League.fromJSON(JSON.parse(json) as Record<string, unknown>);
    expect(JSON.stringify(restored.toJSON())).toBe(json);
    expect(restored.coachPool.length).toBe(league.coachPool.length);
    expect(restored.misery).toEqual(league.misery);
  });

  it('ages are sane generators', () => {
    const rng = new Rng(1);
    for (let i = 0; i < 50; i++) {
      const a = foundingCoachAge(rng);
      expect(a).toBeGreaterThanOrEqual(38);
      expect(a).toBeLessThanOrEqual(58);
    }
    expect(coachRetireChance(61)).toBe(0);
    expect(coachRetireChance(67)).toBe(1);
  });
});
