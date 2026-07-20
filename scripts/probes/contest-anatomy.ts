// Probe: CONTEST / loose-ball anatomy (BASELINE-NOW for the substrate rebuild's
// S0 possession-phase — docs/SUBSTRATE-MAP.md §3 S0, docs/PROBE-CONTRACTS.md §5).
// There is NO first-class contest/loose state today; this measures what the
// `owner === null` scramble looks like NOW so slice-1's contest phase has a
// "before". A CONTEST = a genuinely loose ball (owner null, no dribbleTouch in
// flight, no pass in flight) in open play. ORIGIN is classified from stat-counter
// deltas + ball.lastTouch (blocks/tackles/saves/headers/miscontrols are counters,
// not events). Emits: contests/match, origin mix, outcome (losing-side-retains /
// opponent-wins / dead-or-out), bodies within 3m/6m, zone (losing side's thirds),
// pinball chain length, contest->chance rate, time-to-controlled, ledger check.
//   npx tsx scripts/probes/contest-anatomy.ts [matches] [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT, HALF_L, PLAYER_MIN_DIST } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { firstContestContact } from '../../src/sim/physical';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);
const THIRD = HALF_L / 3;

let contests = 0;
let resolved = 0;
const origin = { shotBlock: 0, keeperSpill: 0, tackleLoose: 0, firstTouch: 0, aerial: 0, deflection: 0 };
let retain = 0; // the side that lost control won it back
let oppWin = 0; // the opponent won it
let deadOut = 0; // resolved to a dead ball / out of play / goal
let bodies3 = 0;
let bodies6 = 0;
const zone = { def: 0, mid: 0, att: 0 }; // relative to the LOSING side's attack dir
let chainSum = 0;
let chainMax = 0;
let toChance = 0; // contests followed by a shot (same winner side) within 3s
let ttcSum = 0; // time from loose-start to clean control
let goals = 0;

// M3 first-class contact ledger. These facts no longer infer contact from
// ball.lastTouch, so an ordinary trap is not mistaken for a pinball touch.
let contactEpisodes = 0;
let contactResolved = 0;
let contactCount = 0;
let controlled = 0;
let firstEqualsFinal = 0;
let firstNotFinal = 0;
let thirdPlayerFinal = 0;
let finalSameSide = 0;
let finalOppSide = 0;
let finalFromUnassigned = 0;
let recontestSum = 0;
let recontestMax = 0;
let threePlusContenders = 0;
const firstMix = { cleanControl: 0, poke: 0, deflection: 0, neutral: 0 };

// Opposing core pairs that remain touching after the M1 solver: a direct
// watchability guard against bodies sticking together through a contest.
let bodyContactRuns = 0;
let bodyContactTicks = 0;
let bodyContactMaxTicks = 0;
let worstContactEpisode: {
  seed: number;
  startedTick: number;
  resolvedTick: number;
  origin: string;
  gids: number[];
} | null = null;

type Cur = { startT: number; losing: number; chain: number; lastGid: number };

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
    traceContests: true,
  });
  let pBlocks = 0, pTackles = 0, pSaves = 0, pHeaders = 0, pMis = 0;
  let pShots = [0, 0];
  let prevLastGid = -1;
  let cur: Cur | null = null;
  let lastEvt: { cls: keyof typeof origin; t: number } | null = null; // most recent duel event
  const pending: Array<{ t: number; side: number }> = []; // resolved contests awaiting a chance
  let activeBodyContacts = new Map<string, number>();

  while (!m.finished) {
    m.step(DT);
    const b = m.ball;
    const T = m.teams;
    const blocks = T[0].stats.blocks + T[1].stats.blocks;
    const tackles = T[0].stats.tackles + T[1].stats.tackles;
    const saves = T[0].stats.saves + T[1].stats.saves;
    const headers = T[0].stats.headersWon + T[1].stats.headersWon;
    const mis = T[0].stats.miscontrols + T[1].stats.miscontrols;
    const shots = [T[0].stats.shots, T[1].stats.shots];

    const nextBodyContacts = new Map<string, number>();
    if (m.phase === 'playing') {
      for (const a of T[0].players) {
        if (a.sentOff) continue;
        for (const b of T[1].players) {
          if (b.sentOff) continue;
          if (Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y) <= PLAYER_MIN_DIST + 1e-6) {
            const key = `${a.gid}:${b.gid}`;
            nextBodyContacts.set(key, (activeBodyContacts.get(key) ?? 0) + 1);
          }
        }
      }
    }
    for (const [key, ticks] of activeBodyContacts) {
      if (nextBodyContacts.has(key)) continue;
      bodyContactRuns++;
      bodyContactTicks += ticks;
      bodyContactMaxTicks = Math.max(bodyContactMaxTicks, ticks);
    }
    activeBodyContacts = nextBodyContacts;

    // Remember the most recent duel event (counters, not events) so a contest
    // that opens a few ticks after the cause (e.g. a first-touch spill while the
    // pass is still "in flight") is still attributed to it.
    if (blocks > pBlocks) lastEvt = { cls: 'shotBlock', t: m.simTime };
    else if (saves > pSaves) lastEvt = { cls: 'keeperSpill', t: m.simTime };
    else if (tackles > pTackles) lastEvt = { cls: 'tackleLoose', t: m.simTime };
    else if (mis > pMis) lastEvt = { cls: 'firstTouch', t: m.simTime };
    else if (headers > pHeaders) lastEvt = { cls: 'aerial', t: m.simTime };

    // contest -> chance: a shot by the contest winner within 3s of it resolving.
    for (let s = 0; s < 2; s++) {
      if (shots[s] > pShots[s]) {
        for (let i = pending.length - 1; i >= 0; i--) {
          if (pending[i].side === s && m.simTime - pending[i].t <= 3) { toChance++; pending.splice(i, 1); }
        }
      }
    }
    // expire stale pending
    for (let i = pending.length - 1; i >= 0; i--) if (m.simTime - pending[i].t > 3) pending.splice(i, 1);

    const owner = b.owner;
    const looseNow =
      m.phase === 'playing' && owner === null && m.dribbleTouch === null &&
      m.pendingPass === null && m.possessionSide !== -1;
    const ltGid = b.lastTouch ? b.lastTouch.gid : -1;

    if (looseNow && !cur) {
      // ---- a contest STARTS ----
      contests++;
      let cls: keyof typeof origin;
      if (lastEvt && m.simTime - lastEvt.t <= 0.3) cls = lastEvt.cls;
      else if (b.z > 0.4) cls = 'aerial';
      else cls = 'deflection';
      origin[cls]++;
      const losing = m.possessionSide as 0 | 1; // looseNow guarantees !== -1; sticky = last owner
      let n3 = 0, n6 = 0;
      for (const p of m.allPlayers) {
        if (p.sentOff) continue;
        const d = Math.hypot(p.pos.x - b.pos.x, p.pos.y - b.pos.y);
        if (d < 3) n3++;
        if (d < 6) n6++;
      }
      bodies3 += n3;
      bodies6 += n6;
      const lx = b.pos.x * m.teams[losing].attackDir; // >0 = losing side's attacking end
      if (lx > THIRD) zone.att++;
      else if (lx < -THIRD) zone.def++;
      else zone.mid++;
      cur = { startT: m.simTime, losing, chain: 1, lastGid: ltGid };
    } else if (looseNow && cur) {
      if (ltGid !== -1 && ltGid !== prevLastGid) cur.chain++; // another loose touch
    } else if (!looseNow && cur) {
      // ---- a contest RESOLVES ----
      resolved++;
      ttcSum += m.simTime - cur.startT;
      chainSum += cur.chain;
      if (cur.chain > chainMax) chainMax = cur.chain;
      let winner = -1;
      if (owner) winner = owner.side;
      else if (m.pendingPass) winner = m.pendingPass.side;
      else if (m.dribbleTouch) {
        const g = m.dribbleTouch.gid;
        const dp = m.allPlayers.find((p) => p.gid === g);
        if (dp) winner = dp.side;
      }
      if (m.phase !== 'playing' && m.phase !== 'restart') deadOut++;
      else if (winner === cur.losing) retain++;
      else if (winner === 1 - cur.losing) oppWin++;
      else deadOut++;
      if (winner !== -1) pending.push({ t: m.simTime, side: winner });
      cur = null;
    }

    prevLastGid = ltGid;
    pBlocks = blocks; pTackles = tackles; pSaves = saves; pHeaders = headers; pMis = mis;
    pShots = shots;
  }
  for (const ticks of activeBodyContacts.values()) {
    bodyContactRuns++;
    bodyContactTicks += ticks;
    bodyContactMaxTicks = Math.max(bodyContactMaxTicks, ticks);
  }
  if (cur) { resolved++; deadOut++; chainSum += cur.chain; } // resolve any open contest at FT
  for (const episode of m.contestEpisodes) {
    contactEpisodes++;
    contactCount += episode.contacts.length;
    if (episode.resolution) contactResolved++;
    if (episode.contenderGids.length >= 3) threePlusContenders++;

    const first = firstContestContact(episode);
    if (!first) continue;
    if (first.kind === 'deflection') firstMix.deflection++;
    else if (episode.possessionSideAtStart === -1) firstMix.neutral++;
    else if (first.side === episode.possessionSideAtStart) firstMix.cleanControl++;
    else firstMix.poke++;

    const recontests = Math.max(0, episode.contacts.length - 1);
    recontestSum += recontests;
    if (recontests > recontestMax) {
      recontestMax = recontests;
      worstContactEpisode = {
        seed,
        startedTick: episode.startedTick,
        resolvedTick: episode.resolution?.tick ?? episode.startedTick,
        origin: episode.origin,
        gids: episode.contacts.map((contact) => contact.gid),
      };
    }
    if (episode.resolution?.kind !== 'controlled') continue;
    controlled++;
    const finalGid = episode.resolution.gid;
    if (first.gid === finalGid) firstEqualsFinal++;
    else firstNotFinal++;
    if (episode.possessionSideAtStart === -1) finalFromUnassigned++;
    else if (episode.resolution.side === episode.possessionSideAtStart) finalSameSide++;
    else finalOppSide++;

    const distinctContactors: number[] = [];
    for (const contact of episode.contacts) {
      if (!distinctContactors.includes(contact.gid)) distinctContactors.push(contact.gid);
    }
    if (distinctContactors.indexOf(finalGid) >= 2) thirdPlayerFinal++;
  }
  goals += m.score[0] + m.score[1];
}

const per = (v: number): string => (v / N).toFixed(2);
const pctC = (v: number): string => `${((v / Math.max(contests, 1)) * 100).toFixed(1)}%`;
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   goals/match ${per(goals)}`);
console.log(`contests/match: ${per(contests)}   ledger: started ${contests} == resolved ${resolved} ${contests === resolved ? 'OK ✅' : 'ORPHAN ❌'}`);
console.log(`origin mix:   block ${pctC(origin.shotBlock)} · keeperSpill ${pctC(origin.keeperSpill)} · tackleLoose ${pctC(origin.tackleLoose)} · firstTouch ${pctC(origin.firstTouch)} · aerial ${pctC(origin.aerial)} · deflection ${pctC(origin.deflection)}`);
console.log(`outcome:      losing-side retains ${pctC(retain)} · opponent wins ${pctC(oppWin)} · dead/out ${pctC(deadOut)}`);
console.log(`bodies@loss:  within 3m ${(bodies3 / Math.max(contests, 1)).toFixed(2)} · within 6m ${(bodies6 / Math.max(contests, 1)).toFixed(2)}`);
console.log(`zone (losing side): def ${pctC(zone.def)} · mid ${pctC(zone.mid)} · att ${pctC(zone.att)}`);
console.log(`pinball chain: mean loose-touches/contest ${(chainSum / Math.max(resolved, 1)).toFixed(2)} · max ${chainMax}`);
console.log(`time-to-controlled: mean ${(ttcSum / Math.max(retain + oppWin, 1)).toFixed(2)}s`);
console.log(`contest->chance (shot ≤3s, same side): ${pctC(toChance)}`);

const pctE = (v: number): string => `${((v / Math.max(contactEpisodes, 1)) * 100).toFixed(1)}%`;
const pctControlled = (v: number): string => `${((v / Math.max(controlled, 1)) * 100).toFixed(1)}%`;
const pctFirst = (v: number): string => `${((v / Math.max(contactEpisodes, 1)) * 100).toFixed(1)}%`;
console.log('\nM3 contact ledger (direct, not inferred from lastTouch)');
console.log(`episodes/match: ${per(contactEpisodes)}   ledger: started ${contactEpisodes} == resolved ${contactResolved} ${contactEpisodes === contactResolved ? 'OK ✅' : 'ORPHAN ❌'}`);
console.log(`contacts/episode: mean ${(contactCount / Math.max(contactEpisodes, 1)).toFixed(2)} · recontests mean ${(recontestSum / Math.max(contactEpisodes, 1)).toFixed(2)} · max ${recontestMax}`);
console.log(`first-contact→control: ${pctE(controlled)} · first=final ${pctControlled(firstEqualsFinal)} · first≠final ${pctControlled(firstNotFinal)} · third+ distinct player final ${pctControlled(thirdPlayerFinal)}`);
console.log(`first-contact mix: clean-control ${pctFirst(firstMix.cleanControl)} · poke ${pctFirst(firstMix.poke)} · deflection ${pctFirst(firstMix.deflection)} · neutral ${pctFirst(firstMix.neutral)}`);
console.log(`final possession (controlled): same prior side ${pctControlled(finalSameSide)} · opponent ${pctControlled(finalOppSide)} · previously unassigned ${pctControlled(finalFromUnassigned)}`);
console.log(`episodes with 3+ eligible contenders: ${pctE(threePlusContenders)}`);
console.log(`body-stuck: runs/match ${per(bodyContactRuns)} · mean ${((bodyContactTicks * DT) / Math.max(bodyContactRuns, 1)).toFixed(3)}s · max ${(bodyContactMaxTicks * DT).toFixed(3)}s`);
if (worstContactEpisode) {
  const worst = worstContactEpisode;
  console.log(
    `worst recontest: seed ${worst.seed} · ${(worst.startedTick * DT).toFixed(2)}–${(worst.resolvedTick * DT).toFixed(2)}s` +
    ` · ${worst.origin} · gids [${worst.gids.join(',')}]`,
  );
}
