import { CUP_NAME, CUP_ROUND_NAMES, cupEntrant, cupTie, type CupState } from '../sim/cup';
import type { Fixture, SeasonRecord } from '../sim/League';

/**
 * Pure feed-line builders for season and cup narration. GameApp pushes the
 * returned lines to the event feed — keeping the copywriting out of the
 * orchestrator and independently testable.
 */

/** Feed lines summarizing a just-finished season (works for headless runs too). */
export function seasonRecordLines(
  rec: SeasonRecord,
  prevChampion: string | undefined,
  includeCup: boolean,
): string[] {
  const lines: string[] = [];
  lines.push(
    rec.championName === prevChampion
      ? `🏆 ${rec.championName} retained the Premier title! (Season ${rec.generation})`
      : `🏆 ${rec.championName} are Premier champions! (Season ${rec.generation})`,
  );
  if (rec.d2Champion) lines.push(`🥇 ${rec.d2Champion} won the Challenger Division.`);
  if (rec.playoff) {
    lines.push(
      `⚔ Playoff: ${rec.playoff.homeName} ${rec.playoff.score[0]}–${rec.playoff.score[1]} ${rec.playoff.awayName} — ${rec.playoff.winnerName} take the final Premier spot.`,
    );
  }
  if (includeCup && rec.cup) {
    const final = rec.cup.ties[rec.cup.ties.length - 1];
    lines.push(
      `🏅 ${rec.cup.winnerName} win the ${CUP_NAME}! ${final.scoreH}–${final.scoreA} vs ${rec.cup.runnerUpName}.`,
    );
    if (rec.cup.upsets.length > 0) {
      lines.push(
        `⚡ ${rec.cup.upsets.length} giant killing${rec.cup.upsets.length > 1 ? 's' : ''} along the cup run.`,
      );
    }
  }
  if (rec.cup && rec.cup.winnerSlot === rec.championSlot && rec.cup.winnerName === rec.championName) {
    lines.push(`✨ DOUBLE: ${rec.cup.winnerName} won the league and ${CUP_NAME}.`);
  }
  for (const p of rec.promoted ?? []) lines.push(`⬆️ ${p.name} promoted to the Premier Division.`);
  for (const r of rec.relegated ?? []) lines.push(`⬇️ ${r.name} relegated to the Challenger Division.`);
  for (const e of rec.evolution.entries) {
    if (e.kind === 'reborn') {
      lines.push(`🔄 ${e.name} born from ${e.parents?.join(' × ')} (drift ${e.drift.toFixed(2)})`);
    }
  }
  // Careers (Phase 26): one compact line — the season report holds the detail.
  if (rec.retirements && rec.retirements.length > 0) {
    const names = rec.retirements.slice(0, 4).map((r) => `${r.name} (${r.team}, ${r.age})`);
    const more = rec.retirements.length > 4 ? ` +${rec.retirements.length - 4} more` : '';
    lines.push(`🎓 Retired: ${names.join(', ')}${more}.`);
  }
  return lines;
}

/** Feed lines for a just-applied cup tie: shootouts, giant killings, the final. */
export function cupResultLines(cup: CupState, f: Fixture): string[] {
  const tie = cupTie(cup, f.round, f.index);
  if (!tie.played || tie.winner === undefined) return [];
  const winner = cupEntrant(cup, tie.winner);
  const loser = cupEntrant(cup, tie.winner === tie.home ? tie.away : tie.home);
  const score = `${tie.scoreH}–${tie.scoreA}`;
  const pens = tie.shootout
    ? ` (${tie.shootout.scoreH}–${tie.shootout.scoreA} on penalties${tie.shootout.sudden ? ', sudden death' : ''})`
    : '';
  const drawNote = tie.byDrawRule ? ' — level at full time, the underdog advances' : '';
  if (tie.round === 3) {
    return [`🏅 ${winner.name} win the ${CUP_NAME}! ${score}${pens} vs ${loser.name}${drawNote}.`];
  }
  if (tie.upset) {
    return [
      `⚡ GIANT KILLING: ${winner.name} knocked out ${loser.name} ${score}${pens} in the ${CUP_ROUND_NAMES[tie.round]}${drawNote}.`,
    ];
  }
  if (tie.shootout) {
    return [
      `🥅 Shootout drama: ${winner.name} edge ${loser.name} ${tie.shootout.scoreH}–${tie.shootout.scoreA} on penalties${tie.shootout.sudden ? ' after sudden death' : ''} (${score} at full time).`,
    ];
  }
  return [];
}

/** Feed line announcing a cup round the moment its first tie comes up. */
export function cupDrawLines(cup: CupState, f: Fixture): string[] {
  if (!f.cup || f.index !== 0 || f.played) return [];
  if (f.round === 0) {
    return [
      `🎪 ${CUP_NAME} — the Round of 16 draw is made: eight Premier–Challenger ties. Drawn ties send the underdog through.`,
    ];
  }
  if (f.round === 3) {
    const tie = cupTie(cup, 3, 0);
    return [`🏆 ${CUP_NAME} Final: ${cupEntrant(cup, tie.home).name} vs ${cupEntrant(cup, tie.away).name}!`];
  }
  return [`🎪 ${CUP_NAME} ${CUP_ROUND_NAMES[f.round]}s are here.`];
}
