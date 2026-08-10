import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { AI_INTERVAL, DT, OFFBALL_TIRED_MUL } from '../src/sim/constants';
import { supportSpot, supportSpotOnObmPlane } from '../src/ai/formations';
import { PRESSURE_RADIUS_M } from '../src/ai/perception';
import {
  perceptionRetentionTicks, type PerceptionSnapshot,
} from '../src/ai/perceptionSnapshot';
import {
  OBM_POLICY_TTL_TICKS, OBM_SCORE_SPAN, obmFeatures, obmOffballPolicy, obmPolicyOf,
} from '../src/ai/offballEyes';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS,
  OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS, crossoverGenomes, mutateGenome,
  offballMovementWeightVector, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { clamp01 } from '../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * OBM-T0 (docs/world-model/OBM-T0-DORMANT-SEAM.md; contract
 * docs/world-model/OFFBALL-MOVEMENT-CONTRACT.md §2 M-OBM.1–4; ruling #227) — the
 * DORMANT OFF-BALL EYES SEAT (前插与回撤是同一个选择). The pins:
 *   • THE GENES `offballMovementWeights` — an optional 4×4 policy matrix, BORN
 *     ABSENT, deliberately NOT in GENE_KEYS (the #148.5 / #75 RNG-stream trap),
 *     evolving only under its OWN `evolveOffballMovement` opt-in whose draws sit
 *     STRICTLY AFTER the `ctbSupportPlane` block.
 *   • THE TRACED BOUNDS — `OBM_SCORE_SPAN` DERIVED IN CODE from the incumbent
 *     off-ball fatigue multiplier, `OBM_WEIGHT_MIN/MAX` from the CTB plane's own
 *     signed domain, `OBM_POLICY_TTL_TICKS` from `AI_INTERVAL / DT`, the feature
 *     normalisers from `PRESSURE_RADIUS_M` and the perception retention horizon —
 *     each asserted against the source text so no bound can drift or be re-typed.
 *   • THE ZERO-POINT — weights absent OR all zero ⇒ `+0` and `×1` ⇒ today's
 *     geometry and today's score arithmetic EXACTLY.
 *   • ⭐ EPISTEMIC HONESTY (G-EPI) — on a stepped fixture where PERCEPT and TRUTH
 *     disagree the features follow the PERCEPT; and the seat module reads nothing
 *     off `match` but `perceivedSnapshot`.
 *   • THE FOUR-LIMB ARMING CHECKLIST — flag + opt-in-or-probe-written genes +
 *     non-absent genes + A PERCEPT-ARMED WORLD. A blind body has no policy.
 *   • THE READ-FORK INVENTORY — exactly TWO `match.obmMovement` forks in `src/**`.
 * Road B: flag hard-false ⇒ byte-identical world (the 2-season fingerprint pin is
 * deliberately NOT duplicated here — PM-T0 Deviation 2's load lesson; G-IDENT /
 * G-FP recompute it in the probe).
 */

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const dosedMatrix = (fill: (i: number) => number): number[] => Array.from(
  { length: OBM_WEIGHT_SLOTS }, (_, i) => fill(i),
);
const matchOf = (
  seed: number,
  arm?: boolean,
  weights?: number[],
  percept = true,
): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...(percept ? { edsPerceivedDefence: true, edsPerceivedChoice: true } : {}),
    ...(arm === undefined ? {} : { obmMovement: arm }),
  });
  if (weights !== undefined) {
    // THE ARMING CHECKLIST (#196.3-D6): all three genome views of BOTH teams.
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.offballMovementWeights = [...weights];
      }
    }
  }
  return m;
};
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const run = (m: Match): string => {
  while (!m.finished) m.step(DT);
  return signature(m);
};
const steppedFixture = (seed: number, ticks = 400, arm = true): Match => {
  const m = matchOf(seed, arm);
  for (let i = 0; i < ticks; i++) m.step(DT);
  return m;
};
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

describe('OBM-T0 — the policy matrix is BORN ABSENT and outside the RNG stream', () => {
  it('the matrix is not a GENE_KEY, so randomGenome never creates or serializes it', () => {
    expect((GENE_KEYS as readonly string[]).includes('offballMovementWeights')).toBe(false);
    const g = randomGenome(new Rng(7));
    expect(g.offballMovementWeights).toBeUndefined();
    expect(JSON.stringify(g)).not.toContain('offballMovement');
  });

  it('mutation draws ZERO extra rng with the opt-in off, and the matrix stays absent', () => {
    const rngA = new Rng(4242);
    const rngH = new Rng(4242);
    let a = randomGenome(new Rng(11));
    let h: TacticalGenome = { ...a };
    const headMutate = (g: TacticalGenome, rng: Rng): TacticalGenome => {
      const out = { ...g };
      for (const k of GENE_KEYS) if (rng.chance(0.45)) out[k] = clamp01(out[k] + rng.gaussian() * 0.14);
      return out;
    };
    for (let i = 0; i < 8; i++) {
      a = mutateGenome(a, rngA, { rate: 0.45, scale: 0.14 });
      h = headMutate(h, rngH);
    }
    expect(GENE_KEYS.every((k) => a[k] === h[k])).toBe(true);
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(a.offballMovementWeights).toBeUndefined();
  });

  it('crossover draws ZERO extra rng with the opt-in off, and carries parent A through', () => {
    const rngA = new Rng(9090);
    const rngH = new Rng(9090);
    const mine = dosedMatrix((i) => (i % 3) * 0.25 - 0.25);
    const p0 = { ...randomGenome(new Rng(3)), offballMovementWeights: mine };
    const p1 = { ...randomGenome(new Rng(4)), offballMovementWeights: dosedMatrix(() => 0.5) };
    const child = crossoverGenomes(p0, p1, rngA);
    const headChild = (() => {
      const out = {} as TacticalGenome;
      for (const k of GENE_KEYS) {
        const r = rngH.next();
        out[k] = r < 0.4 ? p0[k] : r < 0.8 ? p1[k] : (p0[k] + p1[k]) / 2;
      }
      return out;
    })();
    expect(GENE_KEYS.every((k) => child[k] === headChild[k])).toBe(true);
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(child.offballMovementWeights).toEqual(mine);
  });

  it('the opt-in is LIVE and its draws sit STRICTLY AFTER the ctbSupportPlane block', () => {
    // (a) live: with the opt-in on, the matrix gains values in-domain.
    let g = randomGenome(new Rng(5));
    const rngOn = new Rng(777);
    for (let i = 0; i < 8; i++) {
      g = mutateGenome(g, rngOn, { rate: 1, scale: 0.2, evolveOffballMovement: true });
    }
    expect(g.offballMovementWeights).toHaveLength(OBM_WEIGHT_SLOTS);
    expect(g.offballMovementWeights!.every((v) => v >= OBM_WEIGHT_MIN && v <= OBM_WEIGHT_MAX))
      .toBe(true);
    // (b) ordering: the PRIOR opt-in's own values are UNMOVED by the new block, in
    // mutation and in crossover alike — the new draws happen strictly after it.
    const ctbOnly = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
      rate: 1, scale: 0.2, evolveCtbSupportPlane: true,
    });
    const both = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
      rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
    });
    expect(both.ctbSupportDepth).toBe(ctbOnly.ctbSupportDepth);
    expect(both.ctbSupportWidth).toBe(ctbOnly.ctbSupportWidth);
    const p0 = { ...randomGenome(new Rng(3)), ctbSupportDepth: 0.4, ctbSupportWidth: -0.4 };
    const p1 = { ...randomGenome(new Rng(4)), ctbSupportDepth: -0.8, ctbSupportWidth: 0.8 };
    const xCtb = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true);
    const xBoth = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true, true);
    expect(xBoth.ctbSupportDepth).toBe(xCtb.ctbSupportDepth);
    expect(xBoth.ctbSupportWidth).toBe(xCtb.ctbSupportWidth);
    expect(xBoth.offballMovementWeights).toHaveLength(OBM_WEIGHT_SLOTS);
  });

  it('the weight map guards: absent, short, and non-finite all degrade to NEUTRAL', () => {
    expect(offballMovementWeightVector({} as TacticalGenome))
      .toEqual(new Array<number>(OBM_WEIGHT_SLOTS).fill(0));
    const short = offballMovementWeightVector({ offballMovementWeights: [0.5] } as TacticalGenome);
    expect(short).toHaveLength(OBM_WEIGHT_SLOTS);
    expect(short[0]).toBe(0.5);
    expect(short[1]).toBe(0);
    const dirty = offballMovementWeightVector({
      offballMovementWeights: dosedMatrix((i) => (i === 0 ? Number.NaN : i === 1 ? 5 : -5)),
    } as TacticalGenome);
    expect(dirty[0]).toBe(0);
    expect(dirty[1]).toBe(OBM_WEIGHT_MAX);
    expect(dirty[2]).toBe(OBM_WEIGHT_MIN);
  });
});

describe('OBM-T0 — the LAW: traced bounds, exact zero, bounded outputs', () => {
  it('every bound is DERIVED IN CODE from an incumbent constant, never typed', () => {
    // the score span IS the incumbent off-ball fatigue reach
    expect(OBM_SCORE_SPAN).toBe(1 - OFFBALL_TIRED_MUL);
    expect(OFFBALL_TIRED_MUL).toBe(0.6);
    // the weight domain IS the CTB plane's own signed domain
    expect(OBM_WEIGHT_MIN).toBe(CTB_GENE_MIN);
    expect(OBM_WEIGHT_MAX).toBe(CTB_GENE_MAX);
    // the read cadence cap IS the body's own decision interval, in ticks
    expect(OBM_POLICY_TTL_TICKS).toBe(Math.ceil(AI_INTERVAL / DT));
    // the matrix shape is derived from the two named key lists
    expect(OBM_WEIGHT_SLOTS).toBe(OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length);
    // ...and each derivation line is matched VERBATIM so it cannot be re-typed
    const eyes = readFileSync('src/ai/offballEyes.ts', 'utf8');
    expect(eyes).toContain('export const OBM_SCORE_SPAN = 1 - OFFBALL_TIRED_MUL;');
    expect(eyes).toContain('export const OBM_POLICY_TTL_TICKS = Math.ceil(AI_INTERVAL / DT);');
    const genome = readFileSync('src/evolution/genome.ts', 'utf8');
    expect(genome).toContain('export const OBM_WEIGHT_MIN = CTB_GENE_MIN;');
    expect(genome).toContain('export const OBM_WEIGHT_MAX = CTB_GENE_MAX;');
    expect(genome).toContain(
      'export const OBM_WEIGHT_SLOTS = OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length;',
    );
    // the two feature normalisers are the incumbent perception constants themselves
    expect(readFileSync('src/ai/perception.ts', 'utf8'))
      .toContain('return clamp01(1 - best / PRESSURE_RADIUS_M);');
    expect(PRESSURE_RADIUS_M).toBe(6);
    expect(readFileSync('src/ai/perceptionSnapshot.ts', 'utf8'))
      .toContain('return Math.round(15 + clamp01(awarenessInput) * 45);');
    expect(perceptionRetentionTicks(0.8)).toBe(51);
  });

  it('ZERO-POINT: an all-zero matrix is +0 and ×1 EXACTLY, on any features', () => {
    const rng = new Rng(12_424_900);
    for (let trial = 0; trial < 50; trial++) {
      const features = OBM_FEATURE_KEYS.map(() => rng.next());
      const statics: TacticalGenome = {
        ctbSupportDepth: rng.next() * 2 - 1, ctbSupportWidth: rng.next() * 2 - 1,
      } as TacticalGenome;
      for (const g of [
        statics, { ...statics, offballMovementWeights: dosedMatrix(() => 0) },
      ] as TacticalGenome[]) {
        const policy = obmPolicyOf(g, features, true);
        expect(policy.outputs).toEqual([0, 0, 0, 0]);
        expect(policy.plane.depth).toBe(statics.ctbSupportDepth);
        expect(policy.plane.width).toBe(statics.ctbSupportWidth);
        expect(policy.supportMul).toBe(1);
        expect(policy.runMul).toBe(1);
        // ...and ×1 is an identity on an arbitrary incumbent score
        const s = 0.1 + rng.next();
        expect(s * policy.supportMul).toBe(s);
        expect(s * policy.runMul).toBe(s);
      }
    }
  });

  it('the outputs are BOUNDED by the frozen spans at every corner of the domain', () => {
    const rng = new Rng(12_424_901);
    for (let trial = 0; trial < 200; trial++) {
      const features = OBM_FEATURE_KEYS.map(() => rng.next());
      const g = {
        ctbSupportDepth: rng.next() * 2 - 1,
        ctbSupportWidth: rng.next() * 2 - 1,
        offballMovementWeights: dosedMatrix(() => (rng.next() < 0.5 ? -1 : 1)),
      } as TacticalGenome;
      const policy = obmPolicyOf(g, features, true);
      for (const o of policy.outputs) {
        expect(o).toBeGreaterThanOrEqual(OBM_WEIGHT_MIN);
        expect(o).toBeLessThanOrEqual(OBM_WEIGHT_MAX);
      }
      expect(policy.plane.depth).toBeGreaterThanOrEqual(CTB_GENE_MIN);
      expect(policy.plane.depth).toBeLessThanOrEqual(CTB_GENE_MAX);
      expect(policy.plane.width).toBeGreaterThanOrEqual(CTB_GENE_MIN);
      expect(policy.plane.width).toBeLessThanOrEqual(CTB_GENE_MAX);
      for (const mul of [policy.supportMul, policy.runMul]) {
        expect(mul).toBeGreaterThanOrEqual(1 - OBM_SCORE_SPAN - 1e-12);
        expect(mul).toBeLessThanOrEqual(1 + OBM_SCORE_SPAN + 1e-12);
      }
    }
  });

  it('the STATIC CTB genes are the policy INTERCEPT: the dynamic term adds to them', () => {
    const features = [1, 0, 0, 0];
    const g = {
      ctbSupportDepth: 0.25, ctbSupportWidth: -0.25,
      // w[planeDepth][f1] = +1 ⇒ output = 1/4; w[planeWidth][f1] = −1 ⇒ −1/4
      offballMovementWeights: dosedMatrix((i) => (i === 0 ? 1 : i === OBM_FEATURE_KEYS.length ? -1 : 0)),
    } as TacticalGenome;
    const policy = obmPolicyOf(g, features, true);
    expect(policy.plane.depth).toBeCloseTo(0.25 + 1 / OBM_FEATURE_KEYS.length, 12);
    expect(policy.plane.width).toBeCloseTo(-0.25 - 1 / OBM_FEATURE_KEYS.length, 12);
  });
});

describe('OBM-T0 — ⭐ G-EPI: the eyes are HONEST', () => {
  it('a body with NO snapshot has NO policy — every feature is exactly zero', () => {
    const policy = obmPolicyOf(
      { offballMovementWeights: dosedMatrix(() => 1) } as TacticalGenome,
      obmFeatures(null, { x: 0, y: 0 }, 0, { x: 5, y: 5 }),
      false,
    );
    expect(policy.features).toEqual([0, 0, 0, 0]);
    expect(policy.outputs).toEqual([0, 0, 0, 0]);
    expect(policy.supportMul).toBe(1);
    expect(policy.runMul).toBe(1);
  });

  it('a snapshot with no perceived OPPONENT is also exactly neutral', () => {
    const snapshot: PerceptionSnapshot = {
      tick: 10, observerGid: 0, awareness: 0.8, ball: null,
      players: [{
        gid: 0, side: 0, pos: { x: 1, y: 1 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 },
        observedTick: 10, ageTicks: 0,
      }],
    };
    expect(obmFeatures(snapshot, { x: 1, y: 1 }, 0, { x: 2, y: 2 })).toEqual([0, 0, 0, 0]);
  });

  it('⭐ features follow the PERCEPT, not the truth, when the two disagree', () => {
    const m = steppedFixture(12_424_902, 600);
    const p = m.teams[0].players.find((q) => q.role !== 'GK' && !q.sentOff)!;
    const candidate = supportSpot(p, m.teams[0], m.ball);
    // the honest reading, from the body's own eyes
    const perceived = m.perceivedSnapshot(p);
    expect(perceived).not.toBeNull();
    expect(perceived!.players.some((o) => o.side !== p.side)).toBe(true);
    const fromPercept = obmFeatures(perceived, p.pos, p.side, candidate);

    // TELEPORT every opponent 25 m away WITHOUT stepping: the recorded scan moments
    // still hold where they were, so truth and percept now disagree by construction.
    for (const o of m.teams[1].players) { o.pos.x += 25; o.pos.y += 12; }

    // (a) the seat still reads the OLD, perceived positions
    const seat = obmOffballPolicy(p, m, m.teams[0].genome, candidate);
    expect(seat.features).toEqual(fromPercept);

    // (b) the same features computed off a TRUTH snapshot differ
    const truthSnapshot: PerceptionSnapshot = {
      tick: m.simTick, observerGid: p.gid, awareness: 0.8, ball: null,
      players: m.allPlayers.filter((q) => !q.sentOff).map((q) => ({
        gid: q.gid, side: q.side, pos: { x: q.pos.x, y: q.pos.y },
        vel: { x: q.vel.x, y: q.vel.y }, bodyDir: { x: q.bodyDir.x, y: q.bodyDir.y },
        observedTick: m.simTick, ageTicks: 0,
      })),
    };
    const fromTruth = obmFeatures(truthSnapshot, p.pos, p.side, candidate);
    expect(fromTruth).not.toEqual(fromPercept);
    // and the age feature is the honest tell: truth is fresh, his eyes are not
    expect(fromTruth[3]).toBe(0);
    expect(fromPercept[3]).toBeGreaterThan(0);
  });

  it('⭐ the feature values ARE the percept, recomputed by hand from the snapshot', () => {
    const m = steppedFixture(12_424_903, 500);
    let checked = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.role === 'GK' || p.sentOff) continue;
        const candidate = supportSpot(p, t, m.ball);
        const snap = m.perceivedSnapshot(p);
        if (snap === null) continue;
        const opponents = snap.players.filter((o) => o.side !== p.side);
        if (opponents.length === 0) continue;
        const near = (at: { x: number; y: number }): number => Math.min(
          ...opponents.map((o) => Math.hypot(o.pos.x - at.x, o.pos.y - at.y)),
        );
        const got = obmFeatures(snap, p.pos, p.side, candidate);
        const carrierGid = snap.ball?.ownerGid ?? null;
        const carrier = carrierGid === null ? undefined
          : snap.players.find((o) => o.gid === carrierGid);
        expect(got[0]).toBe(carrier === undefined ? 0 : clamp01(1 - near(carrier.pos) / PRESSURE_RADIUS_M));
        expect(got[1]).toBe(clamp01(1 - near(p.pos) / PRESSURE_RADIUS_M));
        expect(got[2]).toBe(clamp01(1 - near(candidate) / PRESSURE_RADIUS_M));
        const meanAge = opponents.reduce((n, o) => n + o.ageTicks, 0) / opponents.length;
        expect(got[3]).toBe(clamp01(meanAge / perceptionRetentionTicks(snap.awareness)));
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('⭐ SOURCE PIN: the seat module touches NOTHING on `match` but perceivedSnapshot', () => {
    const eyes = readFileSync('src/ai/offballEyes.ts', 'utf8');
    const code = eyes.split('\n')
      .filter((l) => !l.trim().startsWith('*') && !l.trim().startsWith('//') && !l.trim().startsWith('/*'))
      .join('\n');
    const members = new Set([...code.matchAll(/\bmatch\.(\w+)/g)].map((mm) => mm[1]));
    expect([...members]).toEqual(['perceivedSnapshot']);
    // and no truth-scan door of any kind in the executable body
    for (const banned of [
      'allPlayers', 'perceptionTruth', 'oraclePerceptionSnapshot', 'capturePerceptionTruth',
      // ⚠ `snapshot.ball.ownerGid` is the PERCEIVED owner and is exactly what this
      // seat may read, so the banned token is the TRUTH ball, `match.ball`.
      'match.teams', 'match.ball', 'team.players', 'opp.', 'pressureAt(',
    ]) {
      expect(code).not.toContain(banned);
    }
    // the only truth-carrying objects it may name are the OBSERVER's own body and
    // his own genome — `Team`, `Ball` and the TeamBrain are not even imported.
    for (const banned of ["from '../sim/Team'", "from '../sim/Ball'", "from './TeamBrain'"]) {
      expect(eyes).not.toContain(banned);
    }
    // ...and the ONLY `p.` members read are his own proprioception
    expect([...new Set([...code.matchAll(/\bp\.(\w+)/g)].map((mm) => mm[1]))].sort())
      .toEqual(['pos', 'side']);
  });
});

describe('OBM-T0 — Road B hygiene, the read forks, and the four-limb arming checklist', () => {
  it('the flag is an explicit hard false, and a fresh Match / League match is OFF', () => {
    expect(readFileSync('src/sim/Match.ts', 'utf8'))
      .toContain('this.obmMovement = cfg.obmMovement ?? false;');
    expect(new Match({
      seed: 1, teamA: team('A', 1), teamB: team('B', 2), duration: 60,
    }).obmMovement).toBe(false);
    const l = new League({ seed: 20_260_810 });
    expect(l.createMatch(l.nextFixture()!).obmMovement).toBe(false);
  });

  it('the flag and the matrix are ABSENT from a4World.ts ENTIRELY, and from every bundle', () => {
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    expect(a4).not.toContain('obmMovement');
    expect(a4).not.toContain('offballMovementWeights');
    for (const v of [1, 2, 3] as const) {
      expect(Object.keys(a4MatchFlags(v))).not.toContain('obmMovement');
    }
  });

  it('no env door: the seam is never env-armed nor EDS_BUNDLE_ARMED', () => {
    for (const f of ['src/sim/Match.ts', 'src/ai/offballEyes.ts', 'src/ai/formations.ts',
      'src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts', 'src/evolution/genome.ts',
      'src/sim/League.ts']) {
      const lines = readFileSync(f, 'utf8').split('\n')
        .filter((l) => /obmMovement|offballMovement|obmPlane|OBM_/.test(l));
      expect(lines.some((l) => /envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))).toBe(false);
    }
  });

  it('READ-FORK INVENTORY: exactly TWO `match.obmMovement` forks in src/**, both named', () => {
    const sites = srcFiles('src').flatMap((f) => readFileSync(f, 'utf8').split('\n')
      .map((text, i) => ({ file: f, line: i + 1, text: text.trim() }))
      .filter((s) => /match\.obmMovement/.test(s.text)
        && !s.text.startsWith('*') && !s.text.startsWith('//')));
    expect(sites).toHaveLength(2);
    expect(sites.map((s) => s.file).sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts']);
    expect(readFileSync('src/ai/PlayerBrain.ts', 'utf8')).toContain('if (match.obmMovement) {');
    const exec = readFileSync('src/ai/actionExecutor.ts', 'utf8');
    expect(exec).toContain('const obmPlane = match.obmMovement ? match.obmPlaneFor(p) : null;');
    // the plane MODULATION happens at exactly one statement, and the incumbent CTB
    // call above it is left BYTE-IDENTICAL (the banked pin, contract §4)
    expect(exec.match(/if \(obmPlane !== null\)/g)!.length).toBe(1);
    expect(exec).toContain('target = supportSpot(p, team, ball, match.ctbSupportPlane);');
    // the banked CTB fork is untouched and still exactly one
    const forms = readFileSync('src/ai/formations.ts', 'utf8');
    expect(forms.match(/if \(ctbPlane\)/g)!.length).toBe(1);
    expect(forms).toContain(
      'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {',
    );
  });

  it('the plane read site is CADENCE-CAPPED: a policy older than the TTL is gone', () => {
    const m = steppedFixture(12_424_904, 120);
    const p = m.teams[0].players.find((q) => q.role !== 'GK' && !q.sentOff)!;
    m.setObmPolicy(p.gid, { depth: -1, width: -1 });
    expect(m.obmPlaneFor(p)).toEqual({ depth: -1, width: -1 });
    for (let i = 0; i <= OBM_POLICY_TTL_TICKS; i++) m.step(DT);
    expect(m.obmPlaneFor(p)).toBeNull();
  });

  it('the OBM plane entry point is the CTB limb: zero ⇒ incumbent, dosed ⇒ the plane', () => {
    const m = steppedFixture(12_424_905, 400, false);
    let checked = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff) continue;
        const incumbent = supportSpot(p, t, m.ball);
        // the ZERO plane is the incumbent expression EXACTLY (+0 and ×1)
        const zeroed = supportSpotOnObmPlane(p, t, m.ball, { depth: 0, width: 0 });
        expect(zeroed.x).toBe(incumbent.x);
        expect(zeroed.y).toBe(incumbent.y);
        // a composed plane says exactly what the STATIC CTB limb says at the same point
        for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
          g.ctbSupportDepth = -0.7;
          g.ctbSupportWidth = 0.3;
        }
        expect(supportSpotOnObmPlane(p, t, m.ball, { depth: -0.7, width: 0.3 }))
          .toEqual(supportSpot(p, t, m.ball, true));
        for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
          delete g.ctbSupportDepth;
          delete g.ctbSupportWidth;
        }
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('⭐ THE FOUR-LIMB ARMING CHECKLIST: flag · genes · non-zero · A PERCEPT-ARMED WORLD', () => {
    const seed = 12_424_906;
    const dose = dosedMatrix((i) => (i % 2 === 0 ? -1 : 1));
    const off = run(matchOf(seed, false));
    expect(run(matchOf(seed, undefined))).toBe(off); // absent ≡ false
    expect(run(matchOf(seed, true))).toBe(off); // limb 2: armed, matrix absent
    expect(run(matchOf(seed, true, dosedMatrix(() => 0)))).toBe(off); // limb 3: at zero
    expect(run(matchOf(seed, false, dose))).toBe(off); // limb 1: dosed, flag off
    expect(run(matchOf(seed, true, dose))).not.toBe(off); // ALL FOUR ⇒ it bites
    // ⭐ limb 4, the new one: the SAME arming in a world with the percept trunk OFF
    // is inert — `refreshPerception` never runs, `perceivedSnapshot` is null, every
    // feature is zero. A blind body has no policy.
    const blindOff = run(matchOf(seed, false, undefined, false));
    expect(run(matchOf(seed, true, dose, false))).toBe(blindOff);
  });
});
