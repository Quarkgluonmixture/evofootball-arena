import { clamp, clamp01 } from '../utils/math';
import { dist, dot, norm, sub, v2 } from '../utils/vec';
import { HALF_L, HALF_W } from '../sim/constants';
import {
  cornerKeyZone, defenderLineLocalX, offsideLineLocalX, runBurstPoint, shapeReady,
} from './formations';
import type { Match } from '../sim/Match';
import type { Player } from '../sim/Player';
import type { Team } from '../sim/Team';
import type { UtilityScore } from '../sim/types';
import { aerialSense, kickMisalignment } from '../sim/mechanics';
import {
  airLaneOpenness, canInterceptPass, effectiveBlockers, interceptBall, laneOpenness, opennessOf,
  escapeCarry, pressureAt, spaceAhead, timeToPoint,
} from './perception';

/**
 * PlayerBrain — utility AI. Each decision tick the player scores a set of
 * candidate actions; the best one wins. Every score is a product/sum of
 * normalized factors with the gene multipliers spelled out, and the top
 * candidates are stored on the action for the debug panel.
 *
 * Kicks (Pass/Shoot/Clear) execute immediately at decision time; movement
 * actions are executed continuously by actionExecutor until the next tick.
 */
export function decidePlayer(p: Player, match: Match): void {
  const team = match.teams[p.side];
  const opp = match.teams[1 - p.side];

  // Dead-ball restart: the taker walks to the spot (chasing the stationary
  // ball); everyone else runs their normal logic against the dead ball —
  // defenders reshape and mark, attackers hold width around the spot.
  if (match.phase === 'restart' && match.restart) {
    if (p.gid === match.restart.takerGid) {
      p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'taking the restart' }] };
      return;
    }
  } else if (match.phase !== 'playing') {
    p.action = { type: 'MoveToFormationSpot', scores: [] };
    return;
  }

  if (match.ball.owner === p) {
    decideCarrier(p, team, opp, match);
    return;
  }
  // The carry continues (Phase 36): between discrete touches the ball is
  // free but it is HIS — he chases his own push instead of falling into
  // off-ball logic (which would send him to a spot while the ball rolls).
  if (
    match.ball.owner === null &&
    match.dribbleTouch !== null &&
    match.dribbleTouch.gid === p.gid &&
    match.simTime < match.dribbleTouch.until
  ) {
    p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'chasing my own touch' }] };
    return;
  }
  if (p.role === 'GK') {
    decideGoalkeeper(p, team, match);
    return;
  }
  decideOffBall(p, team, opp, match);
}

/* ------------------------------------------------------------------ */
/* Ball carrier                                                        */
/* ------------------------------------------------------------------ */

function decideCarrier(p: Player, team: Team, opp: Team, match: Match): void {
  const g = team.genome;
  const W = team.policies[p.index]; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
  const ball = match.ball;
  // Restart first touch must be a kick (kick-in/corner/goal kick/free kick)
  // — dribbling straight off the spot would break the dead-ball fiction.
  const mustKick = match.restartKickGid === p.gid;
  const kickKind = mustKick ? match.restartKickKind : null;
  const kickRoutine = mustKick ? match.restartKickRoutine : null;
  if (mustKick) {
    match.restartKickGid = null;
    match.restartKickKind = null;
    match.restartKickRoutine = null;
    // Goal-channel telemetry (Phase 113): stamp the SET-PIECE first touch —
    // a goal within the window banks as `setpiece`. Kick-ins and goal kicks
    // are restarts but not set pieces.
    if (kickKind === 'corner' || kickKind === 'freeKick' || kickKind === 'penalty') {
      match.lastRestartKick = { kind: kickKind, side: p.side, t: match.simTime };
    }
  }
  // A penalty's first touch IS the shot — no utility scoring from the spot.
  if (kickKind === 'penalty') {
    p.action = { type: 'Shoot', scores: [{ action: 'Shoot', score: 1, why: 'penalty kick' }] };
    match.performShot(p);
    return;
  }
  // Keeper hold (Phase 27.2): ball in the hands — no distribution decision
  // until the hold runs out.
  if (p.gkHoldTimer > 0) {
    p.action = { type: 'HoldPosition', scores: [{ action: 'HoldPosition', score: 1, why: 'ball in hands' }] };
    return;
  }
  // The keeper WAITS for shape (Phase 30.3): a held ball is released to SET
  // receivers. Until the outfielders settle near their attacking spots, the
  // hold re-arms in small quanta — every hands protection (untackleable,
  // clearance bubble, nobody presses) keys off gkHoldTimer and keeps
  // applying. Budget-capped so a scattered team can't stall the match.
  if (p.role === 'GK' && p.gkDistributing && p.gkShapeWait < 4 && !shapeReady(team, match.ball)) {
    p.gkHoldTimer = 0.25;
    p.gkShapeWait += 0.25;
    p.action = { type: 'HoldPosition', scores: [{ action: 'HoldPosition', score: 1, why: 'waiting for shape' }] };
    return;
  }
  // Kickoff first touch (Phase 27.3): played BACKWARD to a teammate — no
  // driving forward off the spot, no long ball over the top. Everyone else
  // starts behind the ball at kickoff, so the fallback is nearly unreachable.
  if (match.kickoffKickGid === p.gid) {
    match.kickoffKickGid = null;
    let back: Player | null = null;
    let backScore = -Infinity;
    for (const mate of team.players) {
      if (mate === p || mate.sentOff) continue;
      if (team.localX(mate.pos.x) > -0.5) continue; // must be behind the ball
      const d = dist(p.pos, mate.pos);
      // Open, and comfortably ~12m back — not the keeper 40m away.
      const s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);
      if (s > backScore) {
        backScore = s;
        back = mate;
      }
    }
    if (back) {
      const hx = back.pos.x - p.pos.x;
      const hy = back.pos.y - p.pos.y;
      const hl = Math.sqrt(hx * hx + hy * hy);
      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
      p.action = {
        type: 'Pass',
        targetIdx: back.gid,
        scores: [{ action: 'Pass', score: 1, why: 'kickoff — played back' }],
      };
      match.performPass(p, back);
      return;
    }
  }
  const cands: UtilityScore[] = [];
  const pressure = pressureAt(p.pos, opp.players);
  const goal = team.oppGoal();
  const dGoal = dist(p.pos, goal);
  const localX = team.localX(p.pos.x);
  // Offside awareness (Phase 29): real-law dead-ball exemptions, and the
  // line every delivery below checks its target against. Players avoid
  // teammates stood CLEARLY offside (beyond the 1.2m margin) but back their
  // judgment on tight ones — the referee judges at +0.2m, so the marginal
  // band is exactly where real flags come from (a runner who broke on the
  // previous kick and hasn't checked back level yet).
  // DELIBERATE law deviation (Phase 71, user call "门将开大脚应该有越位"):
  // real goal kicks are offside-exempt, but at this match scale the
  // exemption read as a legal cherry-pick — a striker camped at the
  // opponent's goal, fed by the timeout punt (probed: 19% of goal kicks
  // had a man within 12m of goal). Goal kicks now play under normal
  // offside, same family as the offside→goal-kick restart simplification.
  // Kick-ins keep the real throw-in exemption; corners are geometrically
  // exempt anyway (you cannot be offside level with the goal line ball).
  const offsideExemptKick = kickKind === 'kickIn' || kickKind === 'corner';
  const offLine = offsideLineLocalX(team, opp.players, localX) + 2.2;
  // Territory pressure (Phase 27): 0 while the move is fresh or gaining
  // ground, 1 after ~8s of possession going nowhere. It tilts every carrier
  // choice toward the opponent goal — sideways recycling stops being free.
  const stagnation = clamp01((team.staleTime - 3) / 5);

  // An OPEN RUN (Phase 31, user report "单刀回传"): nobody goal-side within
  // striking territory. Shared state for the whole carrier economy — the
  // finish boost inside 17m (28.4), the drive boost outside it, and the
  // back-pass suppression all key off it. Computed once.
  let openRun = false;
  if (dGoal < 28) {
    openRun = true;
    for (const o of opp.players) {
      if (o.role === 'GK' || o.sentOff) continue;
      if (dist(o.pos, goal) < dGoal - 1) {
        openRun = false;
        break;
      }
    }
  }

  // --- Shoot: worth it when the chance quality (xG) is decent; shootBias
  // scales it from "only tap-ins" (0) to "shoot on sight" (1).
  if (dGoal < 30 && p.kickCooldown <= 0) {
    const q = match.shotQuality(p);
    // NOTE: finishing deliberately does NOT raise shot utility — it pays off
    // in execution (tighter spread in mechanics.performShot), not in shot
    // selection. Coupling it to utility made finishers take worse shots and
    // turned the attribute into a net negative.
    let s = q * (W.shootBase + g.shootBias * W.shootGene);
    if (team.mode === 'Attack' || team.mode === 'CounterAttack') s *= W.shootModeMul;
    s *= 1 - pressure * W.shootPressurePen;
    // Facing away from goal (Phase 27): turn first instead of snap-shooting
    // blind. Restart takers are exempt — they set themselves before kicking.
    if (!mustKick) s *= 1 - kickMisalignment(p, norm(sub(goal, p.pos))) * 0.3;
    // 1v1 (Phase 28.4): nobody between you and the keeper — FINISH. The
    // old economy kept Dribble marginally ahead, so breakaways were walked
    // all the way onto the keeper's toes instead of being struck from 10m.
    const breakaway = openRun && dGoal < 17;
    if (breakaway) s *= 1.6;
    // Long-range appetite (Phase 28): when the sight is clear, have a dig
    // from 16–30m instead of recycling forever — a stale move digs sooner.
    let dig = 0;
    if (dGoal > 16) {
      // Pressure gate eased 0.7 → 0.5 (29.1): a containing jockey 2.6m off
      // shouldn't extinguish the dig — shooting over the delay IS the
      // counter to being contained (and the user wants the 20m strike).
      dig =
        W.longShotW *
        (0.3 + g.shootBias * 0.7) *
        (1 - pressure * 0.5) *
        (0.55 + stagnation * 0.45) *
        clamp01((30 - dGoal) / 14);
      s += dig;
    }
    // Lane-aware selection (Phase 31): shotQuality's distance·angle·pressure
    // cannot see the parked bodies on the path — carriers shot into walls,
    // and since 30.4 those flew harmlessly (not even a deflection). Each
    // corridor body discounts the whole appetite (dig included — the 20m
    // dig into a wall is exactly the doomed shot); the carrier works for an
    // angle instead, and tryShotBlock makes daring it anyway a real cost.
    // shootBias loosens the discount — daring traffic IS what the gene
    // means (a flat 0.62 inverted it: the shoot-happy team lost its whole
    // expression channel and out-shot NOBODY).
    // Phase 60 (the UNSET WALL): the appetite sees READINESS-weighted
    // bodies — a mid-collapse retreater discounts far less than a set,
    // facing wall, so the first-time arc strike gets dared while the
    // block is still arriving. Math.pow takes the fractional count fine.
    const blockers = breakaway ? 0 : effectiveBlockers(p.pos, goal, opp.players);
    if (blockers > 0) s *= Math.pow(0.55 + g.shootBias * 0.15, blockers);
    cands.push({
      action: 'Shoot',
      score: s,
      why: `xG ${q.toFixed(2)} · shootBias ${g.shootBias.toFixed(2)}${breakaway ? ' · 1v1 — finish it' : ''}${dig > 0.03 ? ` · long-range dig ${dig.toFixed(2)}` : ''}${blockers > 0 ? ` · ${blockers.toFixed(1)} ready in the lane` : ''}`,
    });
  }

  // --- Direct free kick (Phase 32): the danger-band placed ball is the
  // specialist's REAL strike — performFreeKick curls it over the wall, so
  // lane blockers don't apply and the ordinary shot economics (pressure,
  // misalignment) don't either. Competes with crossing/passing the FK.
  if (kickKind === 'freeKick' && localX > 0 && dGoal > 9 && dGoal < 28) {
    // Steep in range: the wall pulls two defenders out of the marking
    // scheme, so an FK always HAS an open mate — and real takers still
    // shoot from 17-22m. The pass only outscores from the band's edge.
    const sFK =
      (0.55 + (28 - dGoal) * 0.02) *
      (0.7 + (p.attrs.finishing + p.attrs.dribbling * 0.5) * 0.45) *
      (0.85 + g.shootBias * 0.3);
    cands.push({ action: 'Shoot', score: sFK, why: `direct free kick · ${dGoal.toFixed(0)}m out` });
  }

  // --- Pass: score every teammate, keep the best. Long targets also get a
  // LOFTED variant (Phase 28): the switch flies over the press, so it skips
  // the ground lane and the 32m suppression — its risks are the charge-down
  // at the kicker's feet and the scatter/first touch at the far end.
  let bestMate: Player | null = null;
  let bestPass = 0;
  let bestLane = 0;
  let bestOpen = 0;
  let bestLoftMate: Player | null = null;
  let bestLoft = 0;
  let bestLoftOpen = 0;
  // One aerial-lane read per decision — the pass loop and the through-ball
  // loop used to each run the same scan with the same arguments.
  const airLane = p.kickCooldown <= 0 ? airLaneOpenness(p.pos, opp.players) : 0;
  if (p.kickCooldown <= 0) {
    const lp = match.lastCompletedPass;
    const layingOff = p.action.type === 'HoldUp'; // pivot lay-off (Phase 28)
    for (const mate of team.players) {
      if (mate === p || mate.sentOff) continue;
      // The playmaker (Phase 39) reads passing lanes 15% more open than
      // they look — the trait is vision, priced into lane weight only.
      const lane = Math.min(
        1,
        laneOpenness(p.pos, mate.pos, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
      );
      const open = opennessOf(mate, opp.players);
      const d = dist(p.pos, mate.pos);
      // Forward progress of the pass, normalized to ±1 over 30m.
      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;

      // Shared style/tilt multipliers (identical for ground and lofted).
      let mul = 1;
      if (gain > 0.05) mul *= 1 + gain * stagnation * 0.35;
      else mul *= 1 - stagnation * 0.3;
      if (team.mode === 'CounterAttack' && gain > 0) mul *= 1.3;
      if (team.mode === 'BuildUp' && gain < 0) mul *= 1.1; // patient recycling is fine
      mul *= 0.7 + g.passBias * 0.75;
      mul *= 0.85 + g.tempo * 0.3;
      if (mate.role === 'GK') {
        // The keeper as a build-up OUTLET (Phase 32.2, 出球门将): a
        // traditional side treats the back-pass as a last resort; a
        // ball-playing side (passBias + riskTolerance) uses him to escape
        // the press — the modern relief valve, priced by the same genes
        // that make the keeper himself play instead of hoof.
        const ballPlay = (g.passBias + g.riskTolerance) / 2;
        mul *= (0.25 + ballPlay * 0.55) * (0.7 + pressure * 1.1);
      }
      // Turning back on an OPEN RUN is the last resort (Phase 31 — the
      // reported "单刀回传"): with nobody goal-side, the chaser at your back
      // reads as pressure and the outlet multiplier used to make the
      // trailing back-pass BEAT driving on. Squaring it forward is fine.
      if (openRun && gain < 0) mul *= 0.35;
      // A mate stood offside is a dead target (Phase 29) — near-suppressed,
      // not zero: the rare desperate ball into them is where flags come from.
      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) mul *= 0.08;
      // Playing the ball where the body doesn't face costs accuracy (Phase 27)
      // — prefer passes we're facing; technique loosens the constraint. Kept
      // mild: the time-gated stagnation tilt is the forward driver, this is
      // only the body-mechanics tiebreak. Restart takers are exempt.
      if (!mustKick) mul *= 1 - kickMisalignment(p, norm(sub(mate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
      // A pivot lays off short after holding up (Phase 28).
      if (layingOff && d < 12) mul *= 1.3;

      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
      if (gain > 0) s *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk);
      else s *= 1 + gain * W.passBackPen; // mild penalty for going backward
      // Contested forward balls are gated by riskTolerance — but patience
      // runs out: a stale move plays the risky forward ball anyway.
      // (30.5 tried gating blocked SIDEWAYS balls too — it starved the
      // feed out to the held-width winger and neutral-genome populations
      // stopped scoring; the fan's wide outlet needs that half-blocked ball.)
      if (gain > 0.15 && lane < 0.4) {
        const gate = 0.35 + g.riskTolerance * 0.65;
        s *= gate + (1 - gate) * stagnation * 0.4;
      }
      s *= mul;
      if (d > 32) s *= 0.5;
      if (d < 5) s *= 0.75;
      // 2过1 return (Phase 34): the original passer is BURSTING — the return
      // into his stride is the whole point of the wall pass, so it flips the
      // "don't hand it straight back" rule below into a bonus (forward only).
      const wallReturn =
        mate.wallRun !== null &&
        match.simTime < mate.wallRun.until &&
        mate.wallRun.partnerGid === p.gid &&
        gain > 0.2; // the runner must genuinely be IN BEHIND, not alongside
      if (wallReturn) {
        s *= 1.15 + (g.tempo + g.passBias) * 0.25;
      } else if (lp && lp.passerGid === mate.gid && lp.receiverGid === p.gid && match.simTime - lp.t < 2.5 && gain < 0.1) {
        // Don't just hand it straight back to the passer unless it progresses.
        s *= 0.55;
      }
      // Third man (Phase 34): freshly received with a runner ahead — the
      // quick bounce releases HIM, not the man who fed you (that's a 2过1).
      if (
        lp && lp.receiverGid === p.gid && match.simTime - lp.t < 1.5 &&
        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15
      ) {
        s *= 1 + g.passBias * 0.3 * W.thirdManW;
      }
      // 套边 release (Phase 34): the ball down the line into the overlap —
      // but only once the run has COME AROUND (wide, level or beyond).
      // Bonusing the licensed man wherever he stood released the ball
      // instantly to a runner still 3m BEHIND (probed: median reception
      // |y| 9.6 — a central recycle wearing the overlap's name).
      if (
        team.overlapper === mate.index &&
        Math.abs(mate.pos.y) > 9 &&
        team.localX(mate.pos.x) > localX - 6
      ) {
        // A DEVELOPED overlap is the best ball on the pitch — priced like it
        // (the run happens ~1.6s/match, probed; a timid bonus never cashed it).
        s *= 1.3 + g.attackingWidth * 0.6;
      }

      if (s > bestPass) {
        bestPass = s;
        bestMate = mate;
        bestLane = lane;
        bestOpen = open;
      }

      // Lofted switch: only worth the hang time for genuinely long balls
      // into space; long passing is a skill (technique gates execution AND
      // selection — poor passers don't trust the diagonal). Keep it 24m+
      // (30.5 tried 18m: the loft cannibalized healthy ground passes and
      // through balls in the 18–24m band and goals sank with them).
      if (d > 24 && !layingOff) {
        let sL = (W.loftBase + open * W.loftOpenW) * airLane;
        if (gain > 0) sL *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk) * 0.8;
        else sL *= 1 + gain * W.passBackPen;
        sL *= mul;
        sL *= 0.55 + p.attrs.passing * 0.75;
        if (sL > bestLoft) {
          bestLoft = sL;
          bestLoftMate = mate;
          bestLoftOpen = open;
        }
      }
    }
    if (pressure > 0.5) bestPass *= W.passOutletMul; // pass is the pressure outlet
    // From the HANDS, the ground pass is a SCHOOL choice (Phase 98): the
    // build-up keeper plays it constantly, the punt-first keeper barely
    // trusts his feet. Outfield passing is untouched.
    if (p.role === 'GK' && p.gkDistributing) bestPass *= 0.6 + g.passBias * 0.8;
    // The why string is built once for the winner — building it per improved
    // candidate inside the loop was pure string churn (toFixed × 3 each time).
    if (bestMate) {
      cands.push({
        action: 'Pass',
        score: bestPass,
        why: `to ${bestMate.name} · lane ${bestLane.toFixed(2)} · open ${bestOpen.toFixed(2)} · passBias ${g.passBias.toFixed(2)}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
      });
    }
    if (bestLoftMate) {
      cands.push({
        action: 'LoftedPass',
        score: bestLoft,
        why: `switch to ${bestLoftMate.name} · open ${bestLoftOpen.toFixed(2)} · air lane ${airLane.toFixed(2)} · passing ${p.attrs.passing.toFixed(2)}`,
      });
    }
  }

  // --- Through ball: feed an assigned runner IN THEIR PATH, not to feet.
  // Scored by the lane to the projected point and how far beyond the last
  // defender it lands; riskTolerance gates it (direct sides live on these).
  let bestRunner: Player | null = null;
  let bestThrough = 0;
  let bestBehind = 0;
  let bestThroughLane = 0;
  let bestThroughChip = false;
  if (p.kickCooldown <= 0) {
    const line = defenderLineLocalX(team, opp.players);
    // Third man (Phase 34): p JUST received — the bounce to a runner within a
    // beat is the possession game's release. Modulated by passBias.
    const lpT = match.lastCompletedPass;
    const fresh = lpT !== null && lpT.receiverGid === p.gid && match.simTime - lpT.t < 1.5;
    for (const mate of team.players) {
      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;
      const bounceMul = fresh && lpT!.passerGid !== mate.gid ? 1 + g.passBias * 0.35 * W.thirdManW : 1;
      const flight = dist(p.pos, mate.pos) / 18;
      // Meet the run, not the hover (Phase 29): a runner held onside shows
      // ~zero velocity, so the aim point projects the burst they will make.
      const burst = runBurstPoint(mate, team, opp.players, flight);
      const point = {
        x: clamp(burst.x, -HALF_L + 2, HALF_L - 2),
        y: clamp(burst.y, -HALF_W + 2, HALF_W - 2),
      };
      if (team.localX(point.x) < localX + 5) continue; // must genuinely penetrate
      const lane = laneOpenness(p.pos, point, opp.players);
      const behind = clamp01((team.localX(point.x) - line) / 10);
      let gates = (0.45 + g.riskTolerance * 0.85) * (0.85 + g.tempo * 0.3) * (1 + stagnation * 0.2);
      // A runner ALREADY beyond the offside line is flagged the moment this
      // ball is struck (Phase 29) — wait for them to check their run instead.
      // The held run (executor clamp) makes the legal version of this ball.
      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) gates *= 0.1;
      // The behind term alone used to float a fully-walled ball over the
      // selection bar (Phase 30.5): 82% of through balls went into blocked
      // lanes at 36% completion (probe-pass). Openness now gates the score
      // multiplicatively — open balls unchanged, walls discount hard.
      const s =
        (W.throughBase + lane * W.throughOpenW + behind * W.throughBehindW) *
        gates * (0.4 + 0.6 * clamp01(lane / 0.45)) * bounceMul;
      if (s > bestThrough) {
        bestThrough = s;
        bestRunner = mate;
        bestThroughLane = lane;
        bestBehind = behind;
        bestThroughChip = false;
      }
      // Chip over the top (Phase 28): when bodies block the ground lane but
      // the runner is going in behind, go over them instead — slower to
      // arrive and harder to bring down (technique gates the trust in it).
      // Judged at the LANDING (Phase 30.5): airLane only sees the kicker's
      // surroundings, so packed drop zones looked wide open — the chip's
      // real risk is who stands where the ball comes down.
      if (lane < 0.45) {
        const landOpen = 1 - pressureAt(point, opp.players);
        const sC =
          (W.throughBase + landOpen * W.throughOpenW * 0.8 + behind * W.throughBehindW) *
          gates * 0.9 * (0.55 + p.attrs.passing * 0.7) *
          (0.7 + airLane * 0.3) * (0.4 + 0.6 * clamp01(landOpen / 0.45)) * bounceMul;
        if (sC > bestThrough) {
          bestThrough = sC;
          bestRunner = mate;
          bestThroughLane = landOpen;
          bestBehind = behind;
          bestThroughChip = true;
        }
      }
    }
    if (bestRunner) {
      cands.push({
        action: 'ThroughBall',
        score: bestThrough,
        why: `${bestThroughChip ? 'chipped over the top ' : ''}into ${bestRunner.name}'s run · lane ${bestThroughLane.toFixed(2)} · behind ${bestBehind.toFixed(2)} · risk ${g.riskTolerance.toFixed(2)}`,
      });
    }
  }

  // --- Cross (Phase 28): from wide and advanced (or the corner flag), whip
  // it at the best aerial target attacking the box. Wide-overload football
  // lives here: attackingWidth is the style gene that trusts the delivery.
  let bestCrossMate: Player | null = null;
  let bestCrossT = 0;
  const isCorner = kickKind === 'corner';
  if (p.kickCooldown <= 0 && (isCorner || (Math.abs(p.pos.y) > 10 && localX > 10))) {
    for (const mate of team.players) {
      if (mate === p || mate.sentOff || mate.role === 'GK') continue;
      const mLocalX = team.localX(mate.pos.x);
      if (mLocalX < 16 || Math.abs(mate.pos.y) > 13) continue; // must attack the box channel
      let t =
        aerialSense(mate) * 0.6 +
        opennessOf(mate, opp.players) * 0.4 +
        clamp01((mLocalX - 18) / 20) * 0.25;
      // Corner routine (Phase 31): a post routine aims the delivery at the
      // crasher attacking the KEY zone — the separation run the 29.1
      // momentum lever needed but never got a delivery for.
      if (isCorner && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')) {
        t += clamp01(1 - dist(mate.pos, cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)) / 10) * 0.6;
      }
      // Open-play crosses are judged like any pass (Phase 29) — an offside
      // box target wastes the delivery. Corners are exempt (real law).
      if (!offsideExemptKick && mLocalX > offLine + 0.2) t *= 0.12;
      if (t > bestCrossT) {
        bestCrossT = t;
        bestCrossMate = mate;
      }
    }
    if (bestCrossMate) {
      let sX = W.crossBase + bestCrossT * W.crossBoxW;
      sX *= 0.75 + g.attackingWidth * 0.5;
      sX *= 0.7 + g.passBias * 0.4;
      if (p.role === 'WG') sX *= 1.25; // it's what wingers are FOR (28.3)
      if (team.mode === 'Attack' || team.mode === 'CounterAttack') sX *= 1.15;
      // The corner IS a cross — deliver it. Unless the routine says the
      // ball goes SHORT or to the ARC (Phase 31): then the whip is the
      // fallback, not the plan.
      if (isCorner) sX *= kickRoutine === 'short' || kickRoutine === 'arcCutback' ? 0.7 : 2.4;
      if (!mustKick) sX *= 1 - kickMisalignment(p, norm(sub(bestCrossMate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
      cands.push({
        action: 'Cross',
        score: sX,
        why: `${isCorner ? 'corner — ' : ''}to ${bestCrossMate.name} in the box · target ${bestCrossT.toFixed(2)} · width ${g.attackingWidth.toFixed(2)}`,
      });
    }
  }

  // --- Cutback (Phase 31): from the byline zone, the hard pull-back to the
  // arc — real football's canonical set-defence beater. The regular pass
  // loop can never pick it (gain < 0 reads as a back-pass and gets
  // penalized), so it scores as its own candidate aimed at the licensed
  // ARRIVER, whose late run the executor routes to the arc. The receiver's
  // snap-decision window (giveBall) makes the first-time strike.
  let cutbackMate: Player | null = null;
  let cutbackCand: UtilityScore | null = null;
  const cornerCutback = kickKind === 'corner' && kickRoutine === 'arcCutback';
  if (
    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&
    Math.abs(p.pos.y) > 10 && localX > HALF_L - 17
  ) {
    const arr = team.players[team.arriver];
    if (arr !== p && !arr.sentOff) {
      const lane = laneOpenness(p.pos, arr.pos, opp.players);
      const open = opennessOf(arr, opp.players);
      const arrLocalX = team.localX(arr.pos.x);
      const inArc = arrLocalX > HALF_L - 26 && Math.abs(arr.pos.y) < 12;
      let sCB =
        (0.48 + lane * 0.3 + open * 0.28) *
        (inArc ? 1.15 : 0.6) *
        (0.8 + g.attackingWidth * 0.4);
      // The corner routine committed to this ball (Phase 31) — the arc
      // strike IS the plan, the whipped cross is the fallback.
      if (cornerCutback) sCB *= 2.2;
      cutbackMate = arr;
      cutbackCand = {
        action: 'Pass',
        score: sCB,
        why: `cutback to ${arr.name} at the arc · lane ${lane.toFixed(2)} · open ${open.toFixed(2)}`,
      };
      cands.push(cutbackCand);
    }
  }

  // --- Hold-up (Phase 28): the pivot's back-to-goal game. A striker with
  // the ball, back to goal and a defender on them shields it and waits for
  // support instead of forcing a turn — the lay-off boost in the pass loop
  // is the payoff. Patience isn't free: stagnation drains it.
  // 34.3 (user report "中锋接球之后不转身"): the zone extends into the own
  // half — the target-man outlet shields wherever the long ball finds him.
  // 打卡油角 (Phase 35): killing the game at the corner flag, ANY carrier
  // shields — the pivot's back-to-goal craft, borrowed for the clock.
  const cornerHold =
    team.mentality.holding > 0.5 && localX > HALF_L - 18 && Math.abs(p.pos.y) > 10;
  if (!mustKick && ((p.role === 'ST' && localX > -12 && localX < 32) || cornerHold)) {
    const backToGoal = kickMisalignment(p, norm(sub(goal, p.pos))); // 1 = facing own goal
    if (backToGoal > 0.45 && pressure > 0.2) {
      const sH =
        (0.36 + pressure * 0.3) *
        (0.55 + p.attrs.dribbling * 0.7) *
        (0.5 + backToGoal * 0.5) *
        (1 - stagnation * 0.5) *
        (cornerHold ? 1 + team.mentality.holding * 0.6 : 1);
      cands.push({
        action: 'HoldUp',
        score: sH,
        why: `back to goal · pressure ${pressure.toFixed(2)} · dribbling ${p.attrs.dribbling.toFixed(2)}`,
      });
    }
  }

  // --- Dribble: needs space ahead; dribbleBias makes it a first choice.
  // Never for a keeper (32.2): a back-pass puts the ball at his FEET and
  // his job is to move it, not to carry it out of the box (the reported
  // 门将带球跑出禁区 class of nonsense is fenced here for good).
  if (!mustKick && p.role !== 'GK') {
    // Wide and advanced (Phase 31): the drive goes DOWN THE LINE toward the
    // byline, not diagonally into the packed box — 下底. Space is measured
    // along the actual path (the touchline channel is usually open when the
    // central cone is a wall), and dribbleTarget steers the same way, so
    // the utility and the legs agree. This is what puts carriers in the
    // pull-back zone at all: measured before it, the byline was occupied
    // for 0.16s per MATCH.
    const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
    const toGoal = wideDrive
      ? norm(sub(v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12)), p.pos))
      : norm(sub(goal, p.pos));
    const space = spaceAhead(p, toGoal, opp.players);
    let sD = (W.dribbleBase + space * W.dribbleSpaceW) * (W.dribbleGeneBase + g.dribbleBias * W.dribbleGeneW);
    sD *= 1 - pressure * W.dribblePressurePen;
    // The TURN TAX (34.3, user report "球员朝向也挺重要"): driving forward
    // with your back to the play means turning ON the ball — a contested
    // touch when someone is close. Facing forward, or free of pressure,
    // costs nothing; back-to-goal under a marker, the forward drive yields
    // to holding up, escaping, or the first-time ball.
    sD *= 1 - kickMisalignment(p, toGoal) * pressure * 0.3;
    // Drive the OPEN RUN (Phase 31, the reported "大空间不突破就硬要传球"):
    // big space ahead used to lose to forced passes. The boost is a flat
    // multiplier ON TOP of the pressure penalty — an earlier cut also
    // EXEMPTED open-run dribbles from back-pressure, and that possession-
    // longevity freebie inverted the shootBias gene (patient teams simply
    // outlasted everyone into MORE shots; genes.test caught it). Inside
    // 15m the 28.4 breakaway boost takes over: FINISH, don't carry it in.
    if (openRun && dGoal > 15) sD *= 1.35;
    if (team.mode === 'CounterAttack') sD *= 1.25;
    sD *= 1 + stagnation * 0.28; // carrying it forward relieves stagnation (Phase 27)
    cands.push({
      action: 'Dribble',
      score: sD,
      why: `space ${space.toFixed(2)} · dribbleBias ${g.dribbleBias.toFixed(2)}${openRun && dGoal > 15 ? ' · open run — drive' : ''}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
    });
    // 脱压带球 (34.2, user report): pressured with the front door closed,
    // the craft answer is to CARRY it back or sideways and buy an outlet —
    // not to stop dead (the old forward-only dribble died to the pressure
    // penalty here and the carrier froze). Escaping pressure is the point,
    // so the penalty barely applies; basic craft, only half-gated by flair.
    const holdCorner = team.mentality.holding > 0.5;
    const esc = escapeCarry(p, team.attackDir, localX, opp.players, holdCorner);
    if (esc && !openRun) {
      let sE =
        (W.dribbleBase + esc.space * W.dribbleSpaceW) *
        (W.dribbleGeneBase + g.dribbleBias * 0.5 * W.dribbleGeneW);
      sE *= 1 - pressure * 0.1;
      // Killing the game (Phase 35): the carry to the corner outranks the
      // risky ball — possession IS the shot now.
      if (holdCorner && localX > 0) sE *= 1 + team.mentality.holding * 0.4;
      cands.push({
        action: 'Dribble',
        score: sE,
        why: holdCorner && localX > 0
          ? `carrying it to the corner — killing the game · space ${esc.space.toFixed(2)}`
          : `carrying it OUT of the press · escape space ${esc.space.toFixed(2)}`,
      });
    }
  }

  // --- Keeper distribution from the HANDS (Phase 28.3 → 98, user-ratified
  // "门将出球选择应该和战术有关"): the one-size throw becomes the coach's
  // choice — three genome-scored releases:
  //   · the short roll to feet    — the build-up school (passBias): tempo
  //     from the back, restart the pattern;
  //   · the fast long sling       — the counter launch (counterAttackBias):
  //     forward gain is the whole point, priced up with the gene;
  //   · the PUNT (new)            — closed outlets + no build-up genes: a
  //     long lofted drop the phase-63 aerial channel contests on descent —
  //     STRENGTH picks the target, so the tall outlet man is a buyable
  //     package for punt-first coaches.
  // The 28.3 no-hoof contract stands: every release still has a NAME on it.
  let bestThrowMate: Player | null = null;
  let bestThrow = 0;
  let puntCand: (typeof cands)[number] | null = null;
  let puntMate: Player | null = null;
  if (p.role === 'GK' && p.gkDistributing && p.kickCooldown <= 0) {
    let bestOpenNear = 0; // how playable the short game is right now
    // The counter WINDOW: every opponent still committed in our half at the
    // catch is a man the quick sling beats — the fast break is launched
    // from the keeper's hands or it isn't a fast break at all.
    let committed = 0;
    let oppOutfield = 0;
    for (const o of opp.players) {
      if (o.role === 'GK' || o.sentOff) continue;
      oppOutfield++;
      if (team.localX(o.pos.x) < 0) committed++;
    }
    const transition = oppOutfield > 0 ? committed / oppOutfield : 0;
    for (const mate of team.players) {
      if (mate === p || mate.sentOff) continue;
      const d = dist(p.pos, mate.pos);
      const open = opennessOf(mate, opp.players);
      if (d >= 8 && d <= 16) bestOpenNear = Math.max(bestOpenNear, open);
      if (d < 8 || d > 30) continue;
      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
      const sT =
        d <= 16
          ? (0.3 + open * 0.5) * (0.6 + g.passBias * 0.8)
          : (0.3 + open * 0.5) *
            (0.5 + g.counterAttackBias * 0.7) *
            (1 + Math.max(gain, 0) * (0.2 + g.counterAttackBias * 0.55)) *
            (1 + transition * g.counterAttackBias * 1.3);
      if (sT > bestThrow) {
        bestThrow = sT;
        bestThrowMate = mate;
      }
    }
    if (bestThrowMate) {
      cands.push({
        action: 'ThrowOut',
        score: bestThrow,
        why: `thrown to ${bestThrowMate.name} · open ${opennessOf(bestThrowMate, opp.players).toFixed(2)} · ${dist(p.pos, bestThrowMate.pos) <= 16 ? `roll to feet · passBias ${g.passBias.toFixed(2)}` : `counter sling · counterBias ${g.counterAttackBias.toFixed(2)}`}`,
      });
    }
    let bestPuntFit = 0;
    for (const mate of team.players) {
      if (mate === p || mate.sentOff) continue;
      const d = dist(p.pos, mate.pos);
      if (d < 24) continue;
      const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;
      if (fit > bestPuntFit) {
        bestPuntFit = fit;
        puntMate = mate;
      }
    }
    if (puntMate) {
      const closed = 1 - bestOpenNear;
      const sP =
        (0.2 + closed * 0.55) *
        (1.4 - (g.passBias + g.riskTolerance) * 0.6) *
        (0.7 + bestPuntFit * 0.45);
      puntCand = {
        action: 'LoftedPass',
        score: sP,
        why: `PUNT to ${puntMate.name} · outlets closed ${closed.toFixed(2)} · strength ${puntMate.attrs.strength.toFixed(2)}`,
      };
      cands.push(puntCand);
    }
  }

  // --- Clear: panic button deep in our half; risk-averse teams use it more.
  // A keeper distributing from the HANDS never panic-hoofs (Phase 28.3) —
  // they had a full second to pick a target.
  if (localX < -18 && p.kickCooldown <= 0 && !(p.role === 'GK' && p.gkDistributing)) {
    let sC = (W.clearBase + pressure * W.clearPressureW) * (1.25 - g.riskTolerance * 0.8);
    // A keeper with the ball at his feet (32.2): the TRADITIONAL keeper
    // hoofs it; the ball-playing one (passBias + riskTolerance) trusts his
    // feet and plays through the press — the same genes that make his
    // teammates use him as the outlet.
    if (p.role === 'GK') sC *= 1.9 - (g.passBias + g.riskTolerance) * 0.55;
    cands.push({ action: 'ClearBall', score: sC, why: `pressure ${pressure.toFixed(2)} · risk-averse ${(1 - g.riskTolerance).toFixed(2)}` });
  }

  cands.sort((a, b) => b.score - a.score);
  // Degenerate fallback (kick still on cooldown): carry the ball as today.
  if (cands.length === 0) {
    p.action = { type: 'Dribble', scores: [] };
    return;
  }
  const top = cands[0];
  const scores = cands.slice(0, 4);

  // A restart taker sets themselves before striking (the run-up): face the
  // chosen target so orientation penalties don't gut dead-ball deliveries —
  // corners arrived weak and wild while the taker still faced the flag.
  if (mustKick) {
    const at =
      top === cutbackCand ? cutbackMate!.pos // the corner arc cutback (31)
      : top.action === 'Pass' ? bestMate!.pos
      : top.action === 'LoftedPass' ? bestLoftMate!.pos
      : top.action === 'Cross' ? bestCrossMate!.pos
      : top.action === 'ThroughBall' ? bestRunner!.pos
      : top.action === 'Shoot' ? goal
      : null; // clears/dribbles: face straight upfield
    if (at) {
      const hx = at.x - p.pos.x;
      const hy = at.y - p.pos.y;
      const hl = Math.sqrt(hx * hx + hy * hy);
      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
    } else {
      p.heading = { x: team.attackDir, y: 0 };
    }
  }

  // Kicks resolve instantly; movement actions persist until next tick.
  switch (top.action) {
    case 'Pass':
      if (top === cutbackCand) {
        p.action = { type: 'Pass', targetIdx: cutbackMate!.gid, scores };
        match.performCutback(p, cutbackMate!);
      } else {
        p.action = { type: 'Pass', targetIdx: bestMate!.gid, scores };
        match.performPass(p, bestMate!, offsideExemptKick);
      }
      break;
    case 'LoftedPass': {
      // The keeper's punt (Phase 98) routes to ITS target — the aerial
      // outlet — not the ground game's best switch.
      const loftTo = top === puntCand ? puntMate! : bestLoftMate!;
      p.action = { type: 'LoftedPass', targetIdx: loftTo.gid, scores };
      match.performLoftedPass(p, loftTo, offsideExemptKick);
      break;
    }
    case 'Cross':
      p.action = { type: 'Cross', targetIdx: bestCrossMate!.gid, scores };
      // A routine corner delivers to the KEY ZONE, not to a led body
      // (Phase 31.9): the crasher's burst is timed onto the zone, and a
      // velocity lead on a sprinting man overshot the whole picture by
      // ~9m. The small pull keeps the drop off the keeper's claim radius.
      match.performCross(
        p, bestCrossMate!, offsideExemptKick,
        kickKind === 'corner' ? 0.06 : 0.18,
        kickKind === 'corner' && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')
          ? cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)
          : undefined,
      );
      break;
    case 'ThrowOut':
      p.action = { type: 'ThrowOut', targetIdx: bestThrowMate!.gid, scores };
      match.performKeeperThrow(p, bestThrowMate!);
      break;
    case 'ThroughBall':
      p.action = { type: 'ThroughBall', targetIdx: bestRunner!.gid, scores };
      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);
      break;
    case 'Shoot':
      p.action = { type: 'Shoot', scores };
      // A free-kick strike is a different kick entirely (Phase 32): the
      // placed ball curls OVER the wall on its own flight profile.
      if (kickKind === 'freeKick') match.performFreeKick(p);
      else match.performShot(p);
      break;
    case 'ClearBall':
      p.action = { type: 'ClearBall', scores };
      match.performClear(p);
      break;
    case 'HoldUp':
      p.action = { type: 'HoldUp', scores };
      break;
    default:
      p.action = { type: 'Dribble', scores };
      break;
  }
}

/* ------------------------------------------------------------------ */
/* Goalkeeper                                                          */
/* ------------------------------------------------------------------ */

function decideGoalkeeper(p: Player, team: Team, match: Match): void {
  const ball = match.ball;
  const ownGoal = team.ownGoal();

  // Shot incoming at our goal -> drop everything and save.
  const shot = match.pendingShot;
  if (
    shot && !shot.resolved && shot.side !== p.side && ball.owner === null &&
    dot(ball.vel, sub(ownGoal, ball.pos)) > 0
  ) {
    p.action = { type: 'GoalkeeperSave', scores: [{ action: 'GoalkeeperSave', score: 1, why: 'shot incoming' }] };
    return;
  }

  // 门将上前 (Phase 35): licensed for a stoppage-time attacking corner —
  // the goal stands EMPTY behind him; a cleared ball into the counter is
  // the price of the theater. TeamBrain tears the license up within one
  // brain tick of the moment dying and he falls through to positioning,
  // which sprints him home.
  if (team.keeperUp) {
    p.action = {
      type: 'MakeRun',
      scores: [{ action: 'MakeRun', score: 1, why: 'keeper UP for the corner — nothing left to lose' }],
    };
    return;
  }

  // 1v1 rush (Phase 27.5): an opponent carrier bearing down with nobody
  // goal-side — charge them down and make the goal small. keeperAggression
  // sets how far out the keeper is willing to leave the line.
  // Phase 103 (user design, 门将出击到禁区外) probed BOTH extensions and
  // kept one: charging a CONTROLLED carrier far out is bad football — the
  // rush-anatomy A/B measured the extended charge at GA +1.3-1.8 vs the
  // timid school in both regimes (attackers simply shoot past the
  // advancing keeper: xg/shot faced 0.16→0.20). The carrier charge keeps
  // its classic range; the sweeper's REAL range gain is the loose-ball
  // interception below (through balls are where 出击 pays).
  const carrier = ball.owner;
  if (carrier && carrier.side !== p.side) {
    const aggr = team.genome.keeperAggression;
    const dGoal = dist(carrier.pos, ownGoal);
    if (dGoal < 9 + aggr * 8) {
      let goalside = 0;
      for (const mate of team.players) {
        if (mate === p || mate.sentOff) continue;
        if (dist(mate.pos, ownGoal) < dGoal - 1) goalside++;
      }
      // The RACE READ (Phase 103): charge only when he can MEET the carrier
      // before the shot. Inside the box the old reflex stands (make the
      // goal small); outside it, an unwinnable charge just opens an empty
      // net — probed: an always-charge sweeper conceded 5.13/match vs the
      // timid school's 2.05. The gene prices the accepted margin, the
      // physics decide the race.
      let raceWon = true;
      if (goalside === 0 && !match.inPenaltyBox(carrier.pos, p.side)) {
        const toGoal = norm(sub(ownGoal, carrier.pos));
        const closing = carrier.vel.x * toGoal.x + carrier.vel.y * toGoal.y;
        raceWon =
          closing > 1.2 &&
          timeToPoint(p, carrier.pos) < (dGoal - 11) / closing + (aggr - 0.5) * 0.4;
      }
      if (goalside === 0 && raceWon) {
        p.action = {
          type: 'GoalkeeperRush',
          scores: [{ action: 'GoalkeeperRush', score: 1, why: `1v1 — rushing out · aggr ${aggr.toFixed(2)}` }],
        };
        return;
      }
    }
  }

  // Loose ball near our goal that we can claim first. The gate is on where
  // the ball is COMING DOWN (Phase 28) — a cross dropping into the box pulls
  // the keeper off the line to meet it even while it's still out wide.
  if (ball.owner === null) {
    const sol = interceptBall(p, ball);
    // The sweeper's interception range (Phase 103): a through ball coming
    // down 20-27m out is the high-line keeper's to eat — feet only out
    // there (the 28.5 giveBall gate). Timid keepers keep the old 15m.
    if (dist(sol.point, ownGoal) < 15 + Math.max(0, team.genome.keeperAggression - 0.5) * 24) {
      // Running min over the same values in the same order — the old
      // filter/map/spread allocated two arrays per GK decision.
      let rivalT = Infinity;
      for (const q of match.allPlayers) {
        if (q === p || q.sentOff) continue;
        const t = timeToPoint(q, sol.point);
        if (t < rivalT) rivalT = t;
      }
      if (sol.tMe < rivalT || (ball.airborne && sol.tMe <= sol.tBall + 0.2)) {
        p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 0.9, why: ball.airborne ? 'attack the dropping ball' : 'claim loose ball in box' }] };
        return;
      }
    }
  }

  p.action = {
    type: 'GoalkeeperPosition',
    scores: [{ action: 'GoalkeeperPosition', score: 0.6, why: `keeperAggression ${team.genome.keeperAggression.toFixed(2)}` }],
  };
}

/* ------------------------------------------------------------------ */
/* Off-ball outfielders                                                */
/* ------------------------------------------------------------------ */

function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {
  const g = team.genome;
  const W = team.policies[p.index];
  const ball = match.ball;
  const possession = match.possessionSide;
  const cands: UtilityScore[] = [];
  let markTarget: number | undefined;
  let receiveFlag = false;

  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;

  if (possession === team.side) {
    // ----- We have the ball -----
    const pass = match.pendingPass;
    if (pass && pass.side === team.side && pass.targetGid === p.gid) {
      cands.push({ action: 'ReceivePass', score: 1.2, why: 'pass is coming to me' });
      receiveFlag = true;
    }
    // OUR loose ball (36.2): TeamBrain assigned this player to the 50/50
    // (a squirt/miscontrol/knockdown while possession is nominally ours) —
    // go win it back; the race outranks shape and support.
    if (ball.owner === null && team.chasers.has(p.index)) {
      cands.push({ action: 'ChaseBall', score: 1.1, why: 'our loose ball — contest it' });
    }
    const carrier = ball.owner;
    // The DF slot is the REST DEFENCE (Phase 31): once the ball crosses
    // halfway he does not join the siege — formationSpot clamps his spot
    // deep (≤ −12 local) and he holds it as the +1 cover and the recycling
    // outlet. Without this the support fan pulled even the last outfielder
    // to the ball, nobody covered, and every turnover was an uncontested
    // breakaway — which is how a 5v6 side out-scored its full-strength
    // self (the besieged team lives on counters).
    const restDefence = p.index === 1 && team.localX(ball.pos.x) > 0;
    if (carrier && carrier !== p && !restDefence) {
      const d = dist(p.pos, carrier.pos);
      const roleBonus = p.role === 'ST' ? 0.12 : p.role === 'WG' ? 0.1 : p.role === 'MF' ? 0.06 : 0;
      const modeMul = team.mode === 'Attack' || team.mode === 'CounterAttack' ? 1.2 : team.mode === 'BuildUp' ? 1.0 : 0.6;
      let s = (W.supportBase + clamp01(1 - d / 30) * W.supportProxW + roleBonus) * modeMul;
      if (tired) s *= 0.6; // conserve energy: prefer holding shape
      cands.push({ action: 'SupportBallCarrier', score: s, why: `dist ${d.toFixed(0)}m · mode ${team.mode}` });
    }
    // Assigned runner: sprint in behind and drag the line — the movement a
    // through ball needs. Tired legs sit the run out. During a corner setup
    // there is no carrier yet — the licensed box-crashers run anyway
    // (Phase 28: the cross needs bodies attacking the area, not spectators).
    // The ARRIVER (Phase 31) runs on the same license — executor routes
    // their run to the edge-of-box arc instead of in behind.
    const arriving = team.arriver === p.index;
    // A corner delivery in FLIGHT has no carrier and phase is 'playing' —
    // without the cornerCrash clause the licensed crashers lost their run
    // the instant the ball left the taker's boot and walked back to their
    // formation spots while it was still in the air (Phase 31.9).
    const crashLive = team.cornerCrash !== null && match.simTime < team.cornerCrash.until;
    if ((team.runners.has(p.index) || arriving) && (carrier ? carrier !== p : match.phase === 'restart' || crashLive)) {
      let s = W.runScore;
      if (tired) s *= 0.6;
      cands.push({
        action: 'MakeRun',
        score: s,
        why: arriving
          ? 'arriving late at the cutback arc'
          : match.phase === 'restart' || crashLive ? 'attacking the box for the delivery' : 'licensed run in behind',
      });
    }
    // 2过1 (Phase 34): just played the wall pass under pressure — burst past
    // the marker NOW; the return is scored to find this run. The BURST is
    // short (1.2s) even though the return credit runs 2.3s: a full-window
    // sprint pulled the passer out of the support structure for so long it
    // cost goals across the calibrate seeds — dart, then re-join.
    if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {
      let s = W.runScore * (1.05 + (g.tempo + g.passBias) * 0.25);
      if (tired) s *= 0.6;
      cands.push({ action: 'MakeRun', score: s, why: 'bursting for the one-two return' });
    }
    // 套边 (Phase 34): licensed to overlap outside the confronted wide
    // carrier — width genes commit harder to the run.
    if (team.overlapper === p.index && carrier && carrier !== p) {
      let s = W.runScore * (1 + g.attackingWidth * 0.3);
      if (tired) s *= 0.6;
      cands.push({ action: 'MakeRun', score: s, why: 'overlapping outside the carrier' });
    }
    cands.push({
      action: 'MoveToFormationSpot',
      score: W.formationBase + (tired ? 0.2 : 0),
      why: tired ? 'keeping shape (stamina conservation)' : 'keeping shape',
    });
  } else {
    // ----- They have the ball (or it's loose) -----
    // Cut out a pass in flight — unless it's sailing overhead (Phase 28);
    // lofted balls are contested at the landing point via ChaseBall instead.
    if (ball.owner === null && match.pendingPass && match.pendingPass.side !== team.side && ball.z <= 0.5) {
      const inter = canInterceptPass(p, ball);
      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
    }
    // Chase only if the TeamBrain assigned us — this is what stops ball-swarming.
    if (team.chasers.has(p.index)) {
      const s = W.chaseBase + g.pressIntensity * 0.15;
      cands.push({ action: 'ChaseBall', score: s, why: `assigned presser · pressIntensity ${g.pressIntensity.toFixed(2)}` });
    } else if (possession === -1) {
      // Loose ball: closest unassigned player may react a little. Radius
      // tightened in Phase 28 — a wide net pulled extra bodies into every
      // scramble and open play collapsed into rolling six-player scrums.
      const d = dist(p.pos, ball.pos);
      if (d < 8) cands.push({ action: 'ChaseBall', score: 0.4 * (1 - d / 8), why: 'loose ball nearby' });
    }
    const mark = team.marks.get(p.index);
    if (mark !== undefined) {
      markTarget = mark;
      cands.push({
        action: 'MarkOpponent',
        score: W.markBase + g.markingAggression * 0.15,
        why: `mark ${opp.players[mark].name} · aggression ${g.markingAggression.toFixed(2)}`,
      });
    } else if (ball.owner && ball.owner.side !== team.side && !team.chasers.has(p.index)) {
      // Contain (Phase 29.1): the carrier bears down on ME and I'm already
      // goal-side — jockey them (goal-side stance on the carrier) instead of
      // jogging away to a formation spot. The reported bug: a set defender
      // suddenly ran upfield as the striker arrived, because his mark
      // assignment vanished the moment that striker became the carrier
      // (marks exclude the carrier — the chaser presses the ball, but the
      // chaser can be someone else entirely).
      const carrier = ball.owner;
      const dC = dist(p.pos, carrier.pos);
      const ownGoal = team.ownGoal();
      const carrierGoalD = dist(carrier.pos, ownGoal);
      // Defensive-territory only (< 35m out): containing a deep build-up
      // carrier 70m from goal would just add one more body to the press.
      // ONE container only — the closest unassigned goal-side defender;
      // everyone eligible jockeying at once re-created the pile-up AND
      // strangled the game to 2.0 goals.
      let closest = true;
      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {
        for (const q of team.players) {
          if (q === p || q.role === 'GK' || q.sentOff) continue;
          if (team.chasers.has(q.index) || team.marks.has(q.index)) continue;
          if (dist(q.pos, ownGoal) >= carrierGoalD) continue; // not goal-side
          if (dist(q.pos, carrier.pos) < dC) {
            closest = false;
            break;
          }
        }
        if (closest) {
          markTarget = carrier.index;
          cands.push({
            action: 'MarkOpponent',
            score: 0.66 + clamp01(1 - dC / 10) * 0.18,
            why: `contain ${carrier.name} — hold goal-side`,
          });
        }
      }
    }
    cands.push({
      action: 'MoveToFormationSpot',
      score: 0.42 + g.defensiveCompactness * 0.08,
      why: `hold block · compactness ${g.defensiveCompactness.toFixed(2)}`,
    });
  }

  cands.sort((a, b) => b.score - a.score);
  const top = cands[0];
  p.action = {
    type: top.action,
    targetIdx: top.action === 'MarkOpponent' ? markTarget : receiveFlag ? p.gid : undefined,
    scores: cands.slice(0, 4),
  };
}
