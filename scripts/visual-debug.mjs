/**
 * Visual smoke test: drives the real game in headless Chromium — loads the
 * page, fast-forwards a match, toggles overlays and the league screen, and
 * saves screenshots to /tmp/evofootball-shots/. Prints console errors and a
 * PASS/FAIL summary. Run with the dev server up:  node scripts/visual-debug.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.GAME_URL ?? 'http://localhost:5199/';
const OUT = '/tmp/evofootball-shots';
mkdirSync(OUT, { recursive: true });

const errors = [];
const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok, detail });
  console.log(`${ok ? '  ✓' : '  ✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1560, height: 940 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(String(err)));
// The suites' selectors are English — pin the UI language (zh is the app default since Phase 28.1).
await page.addInitScript(() => localStorage.setItem('evofootball-lang', 'en'));

await page.goto(URL, { waitUntil: 'networkidle' });
// The app boots in 3D — this suite drives the 2D view, which since 34.1 is
// the WebGL FALLBACK only (no panel toggle): switch via the dev hook.
await page.waitForFunction(() => window.__evo !== undefined, { timeout: 15000 });
// The launch overlay (Phase 96) covers everything at boot — dismiss it
// FIRST or every stage-level check below fails.
await page.evaluate(() => window.__evo.skipTitle());
await page.evaluate(() => window.__evo.app.setViewMode('2d'));
await page.waitForSelector('#stage canvas', { timeout: 15000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/1-initial.png` });

// Canvas actually rendered something non-blank? (drawImage on a WebGL canvas
// is blank without preserveDrawingBuffer, so judge by the compositor
// screenshot instead: a striped pitch compresses far larger than a flat fill.)
const canvasShot = await page.locator('#stage canvas').screenshot();
check('canvas renders non-blank pitch', canvasShot.length > 10000, `${canvasShot.length} bytes png`);

const clockBefore = await page.textContent('#scoreboard .clock');

// Fast-forward at 32x via the dev hook (29.1: the speed preset buttons are
// gone from the UI — watching is 1×, tooling drives speed directly); read
// mid-match (after the match ends the app loads the next fixture, which
// resets the scoreboard/stats — by design).
await page.evaluate(() => window.__evo.app.setSpeed(32));
await page.waitForTimeout(4000);
await page.screenshot({ path: `${OUT}/2-match-32x.png` });

const clockAfter = await page.textContent('#scoreboard .clock');
check('clock advances under 32×', clockBefore !== clockAfter, `"${clockBefore}" -> "${clockAfter}"`);
check('speed presets are gone from the UI (29.1)', (await page.locator('button:has-text("32×")').count()) === 0, '');

const shotVals = await page.locator('#right-panel .stat-val').allTextContents();
const totalShots = Number(shotVals[0] ?? 0) + Number(shotVals[1] ?? 0);
check('match stats accumulate', totalShots > 0, `shots ${shotVals[0]}+${shotVals[1]}`);
const statsText = await page.textContent('#right-panel');
check('set-piece stats row present (corners)', statsText.includes('corners'), '');
check('combo stats rows present (34)', statsText.includes('one-twos') && statsText.includes('third man') && statsText.includes('overlaps'), '');
await page.click('button:has-text("⏸")');
check('pause toggles to play (29.1)', (await page.locator('button:has-text("▶")').count()) >= 1, '');

const feedRows = await page.locator('#event-feed .ev').count();
check('event feed populates', feedRows > 3, `${feedRows} rows`);

const chartPaths = await page.locator('.xg-chart path').count();
check('xG chart draws step lines', chartPaths >= 2, `${chartPaths} paths`);

// Advance into the next match, enable overlays, let it play a moment.
await page.click('button:has-text("⏭ skip")');

// Pre-match clash (32.5): every freshly loaded fixture opens with the
// tale-of-the-tape — two DNA radars side by side. Dismiss it here so later
// canvas clicks are never intercepted.
check('pre-match clash shows on the next fixture (32.5)', await page.evaluate(() => window.__evo.clashVisible()), '');
check('clash banner carries two DNA radars', (await page.locator('#clash-banner svg.radar').count()) === 2, '');
await page.screenshot({ path: `${OUT}/2b-clash.png` });
await page.click('#clash-banner');
await page.waitForTimeout(200);
check('clash banner dismisses on tap', !(await page.evaluate(() => window.__evo.clashVisible())), '');

// Phase 33 (user request): the scoreboard is a button — tap to pop the
// tactical DNA clash any time, tap again to close. Manual opens are pinned.
const feedAfterSkip = await page.textContent('#event-feed');
check('FT feed names the man of the match (33)', feedAfterSkip.includes('Man of the match'), '');
await page.click('#scoreboard');
await page.waitForTimeout(200);
check('scoreboard tap re-opens the clash (33)', await page.evaluate(() => window.__evo.clashVisible()), '');
await page.screenshot({ path: `${OUT}/2c-clash-toggle.png` });
await page.click('#scoreboard');
await page.waitForTimeout(200);
check('scoreboard tap closes it again', !(await page.evaluate(() => window.__evo.clashVisible())), '');
check('auto-highlights toggle present (33)', (await page.locator('label:has-text("Auto highlights")').count()) === 1, '');

for (const label of ['Formation targets', 'Marking lines', 'Press assignments', 'Ball heatmap']) {
  await page.click(`label:has-text("${label}")`);
}
await page.evaluate(() => window.__evo.app.setSpeed(2));
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/3-overlays.png` });

// Click a player using the dev hook to find one on screen.
await page.click('button:has-text("⏸")');
const canvasBox = await page.locator('#stage canvas').boundingBox();
const target = await page.evaluate(() => {
  const evo = window.__evo;
  const pos = evo.playerPositions()[3]; // any outfield player
  return { ...pos, ...evo.canvasSize };
});
await page.mouse.click(
  canvasBox.x + (target.x / target.w) * canvasBox.width,
  canvasBox.y + (target.y / target.h) * canvasBox.height,
);
await page.waitForTimeout(400);
const cardTxt = await page.textContent('#player-card');
check('player click-to-select works', cardTxt.includes('action:'), cardTxt.slice(0, 40));
check('player card shows attributes', cardTxt.includes('finishing'), '');
check('player card shows the live match rating (33)', /⭐ rating \d+\.\d/.test(cardTxt), '');
check('player card explains utility', cardTxt.includes('utility scores:'), '');
await page.screenshot({ path: `${OUT}/4-player-selected.png` });

// League screen.
await page.click('button:has-text("League table")');
await page.waitForTimeout(400);
const standingsRows = await page.locator('#league-screen tbody tr').count();
check('two division tables show 16 teams', standingsRows === 16, `${standingsRows} rows`);
const zones = await page.locator('#league-screen tr.zone-up, #league-screen tr.zone-down').count();
check('promotion/relegation zones highlighted', zones === 4, `${zones} zone rows`);
const cards = await page.locator('#league-screen .team-card').count();
check('league tab no longer hosts team cards (113.5)', cards === 0, `${cards} cards`);
const standingLinks = await page.locator('#league-screen tbody .entity-link').count();
check('standings names link to the club center (113.5)', standingLinks === 16, `${standingLinks} links`);
check('promotion rules selector present', (await page.locator('#league-screen .rules-row button').count()) === 4);
check('cup draw rule selector present', (await page.locator('#league-screen .rules-row').count()) === 2);

// Toggle playoff mode and verify zones change to include the decider spots.
await page.click('#league-screen button:has-text("⚔ Playoff")');
await page.waitForTimeout(300);
const playoffZones = await page.locator('#league-screen tr.zone-playoff').count();
check('playoff mode marks the decider spots', playoffZones === 2, `${playoffZones} playoff rows`);
await page.click('#league-screen button:has-text("Auto top/bottom 2")');
await page.waitForTimeout(200);

// Cup draw rule toggle (Phase 22): shootout is the new-league default.
await page.click('#league-screen button:has-text("Underdog advances")');
await page.waitForTimeout(200);
const rulesTxt = await page.textContent('#league-screen');
check('cup draw rule toggles to underdog', rulesTxt.includes('lower-division (else lower-seeded)'));
await page.click('#league-screen button:has-text("Penalty shootout")');
await page.waitForTimeout(200);

await page.screenshot({ path: `${OUT}/5-league.png` });

// ---- Phase 113.5: the CLUB CENTER — the clubs' own stage. ----
await page.click('#topbar button:has-text("Clubs")');
await page.waitForTimeout(400);
check('club center opens (own screen, 113.5)', await page.locator('#clubs-screen').isVisible(), '');
check('league screen closed by the club center', !(await page.locator('#league-screen').isVisible()), '');
const minis = await page.locator('#clubs-screen .club-mini').count();
check('selector wall shows all 16 clubs', minis === 16, `${minis} minis`);
check('division badges on the wall', (await page.locator('#clubs-screen .club-mini .tag.div-badge-1').count()) === 8);
const wallPlates = await page.locator('#clubs-screen .club-mini .tag.nameplate').count();
check('data-driven nameplates on the wall (49)', wallPlates >= 8, `${wallPlates} tags (capped 2/club)`);
check('club dive carries the DNA radar (32.5)', (await page.locator('#clubs-screen .evo-club svg.radar').count()) === 1, '');
check('club dive shows the dugout record (53)', (await page.locator('#clubs-screen .evo-club .coach-block').count()) === 1, '');
check('club dive carries the goal-channel tile (113)', (await page.locator('#clubs-screen .evo-club .goal-channel').count()) === 1, '');
const pitches = await page.locator('#clubs-screen .pitch-tile').count();
check('formation diagrams render, both phases (113.5)', pitches === 2, `${pitches} pitches`);
check('every diagram plots six spots', (await page.locator('#clubs-screen .pitch-tile circle').count()) === 14, ''); // 2×(6 dots + center circle)
const firstName = await page.locator('#clubs-screen .evo-club .team-head span:not(.dot)').first().textContent();
await page.locator('#clubs-screen .club-mini').nth(5).click();
await page.waitForTimeout(300);
const secondName = await page.locator('#clubs-screen .evo-club .team-head span:not(.dot)').first().textContent();
check('tapping the wall re-targets the dive', firstName !== secondName, `${firstName} → ${secondName}`);
check('wall marks the selected club', (await page.locator('#clubs-screen .club-mini.selected').count()) === 1, '');
await page.screenshot({ path: `${OUT}/5c-clubs.png` });
await page.click('#topbar button:has-text("Clubs")'); // close
await page.waitForTimeout(200);
await page.click('button:has-text("League table")');
await page.waitForTimeout(300);

// Cup tab, fresh season: the R16 draw is made, later rounds await winners.
await page.click('#league-screen button:has-text("Cup")');
await page.waitForTimeout(300);
const cupFreshTxt = await page.textContent('#league-screen');
check('cup tab: draw rule documented', cupFreshTxt.includes('penalty shootout'));
check('cup tab: fresh bracket shows all 15 ties', (await page.locator('#league-screen .cup-tie').count()) === 15);
check('cup tab: 14 slots await feeder winners', (await page.locator('#league-screen .cup-row.cup-tbd').count()) === 14);
await page.screenshot({ path: `${OUT}/5b-cup-fresh.png` });
await page.click('#league-screen button:has-text("League")');
await page.waitForTimeout(200);
await page.click('button:has-text("League table")');

// ---- Phase 15: presentation tools (cinematic, share, FX quality) ----
// Cinematic enters from the STAGE button since 34.1 (user request).
check('cinematic enter button lives on the stage (34.1)', await page.locator('.cinematic-enter').isVisible(), '');
await page.click('.cinematic-enter');
await page.waitForTimeout(400);
check('cinematic hides the panel chrome', !(await page.locator('#left-panel').isVisible()), '');
check('cinematic shows the 2D score bug', await page.locator('.cine-bug').isVisible(), '');
check('cinematic exit control is present', await page.locator('.cinematic-exit').isVisible(), '');
// Desktop cinematic fills the screen (user request, 33): the canvas scales
// past its 960px natural width to fit-contain the viewport.
const cineBox = await page.locator('#stage canvas').boundingBox();
check('cinematic canvas fills the desktop viewport (33)', cineBox !== null && cineBox.width > 1300, `w=${cineBox?.width}`);
await page.screenshot({ path: `${OUT}/11-cinematic-2d.png` });
await page.click('.cinematic-exit');
await page.waitForTimeout(300);
check('cinematic exits back to full UI', await page.locator('#left-panel').isVisible(), '');

await page.click('button:has-text("📸 Screenshot")');
await page.waitForTimeout(500);
const feedAfterShot = await page.textContent('#event-feed');
check('screenshot control is real (feed confirms)', /Screenshot (saved|not supported)/.test(feedAfterShot), '');

// Share summary was removed in 34.1 (user call) — assert it stays gone.
check('share summary is gone (34.1)', (await page.locator('button:has-text("Share summary")').count()) === 0, '');
check('2D/3D view toggle is gone from the panel (34.1)', (await page.locator('#left-panel button:has-text("3D")').count()) === 0, '');

await page.click('button:has-text("High")');
await page.waitForTimeout(200);
const fxActive = await page.evaluate(() =>
  [...document.querySelectorAll('#left-panel button')].find((b) => b.textContent === 'High')?.classList.contains('active'),
);
check('FX quality selector reflects its state', fxActive === true, '');
await page.click('button:has-text("Med")');

// Simulate two full seasons headless via the UI button (two, so the
// evolution sparklines have a line to draw).
await page.click('button:has-text("Season")');
await page.waitForTimeout(25000);
const feedText = await page.textContent('#event-feed');
check('season sim completes with champion message', feedText.includes('champions'), '');
check('cup champion announced in feed', feedText.includes('win the Evo Cup'), '');
check(
  'season simulated on the worker thread',
  (await page.evaluate(() => window.__evo.simMode())) === 'worker',
  '',
);

// The rebirth ceremony (32.5) auto-shows at season end: three D2 clubs die,
// each card overlays parent-vs-child gene radars with mutations flagged.
check('rebirth ceremony auto-shows at season end (32.5)', await page.locator('#rebirth-screen').isVisible(), '');
const deathCards = await page.locator('#rebirth-screen .rebirth-card').count();
check('ceremony shows the three rebirths', deathCards === 3, `${deathCards} cards`);
check('each rebirth card carries a radar', (await page.locator('#rebirth-screen .rebirth-card svg.radar').count()) === 3, '');
const ceremonyTxt = await page.textContent('#rebirth-screen');
check('ceremony crowns the elites', ceremonyTxt.includes('Survived untouched'), '');
check('ceremony names dead → born', (await page.locator('#rebirth-screen .rebirth-dead').count()) === 3, '');
await page.screenshot({ path: `${OUT}/6a-rebirth-ceremony.png`, fullPage: true });
await page.click('#rebirth-screen .ceremony-continue');
await page.waitForTimeout(200);
check('ceremony closes on continue', !(await page.locator('#rebirth-screen').isVisible()), '');

await page.click('button:has-text("Season")');
await page.waitForTimeout(25000);
// Season two's ceremony — close it so the league screen is clickable below.
if (await page.locator('#rebirth-screen').isVisible()) {
  await page.click('#rebirth-screen .ceremony-continue');
  await page.waitForTimeout(200);
}

// League screen tabs: report, evolution, hall of fame.
await page.click('button:has-text("League table")');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/6-league-after-season.png` });

await page.click('#league-screen button:has-text("Season report")');
await page.waitForTimeout(300);
const reportText = await page.textContent('#league-screen');
check('season report names both champions', reportText.includes('Premier champions') && reportText.includes('Challenger'), '');
check('promotion/relegation reported', reportText.includes('promoted') && reportText.includes('relegated'));
check('season story narrative renders', (await page.locator('#league-screen .report-story div').count()) >= 1);
check('both division race charts render', (await page.locator('#league-screen .race-chart').count()) === 2);
check('awards render (golden boot)', reportText.includes('Golden Boot'));
check('season report tells the cup final', reportText.includes('Evo Cup'), '');
// Which story fires depends on knife-edge match outcomes that legitimately
// differ between seeds and Node/Chromium float paths — a season with no cup
// upset mines NO cup story (failure mode 11). Assert the mining pipeline
// structurally: at least one typed story line of ANY kind rendered.
const storyText = await page.locator('#league-screen .report-story').textContent();
check('mined season stories carry real text', storyText.trim().length > 20, storyText.slice(0, 60));
await page.screenshot({ path: `${OUT}/7-season-report.png` });

// Phase 52 — the chronicle tab: era-grouped, browsable season chapters.
await page.click('#league-screen button:has-text("Chronicle")');
await page.waitForTimeout(300);
const eraHeads = await page.locator('#league-screen .era-head').count();
check('chronicle groups seasons under era headers (52)', eraHeads >= 1, `${eraHeads} eras`);
const chapterCount = await page.locator('#league-screen .chron-chapter').count();
check('chronicle writes one chapter per season', chapterCount === 2, `${chapterCount} chapters`);
check('the latest chapter arrives open with mined lines',
  (await page.locator('#league-screen .chron-chapter[open] .chron-line').count()) >= 1, '');
const headlineTxt = await page.locator('#league-screen .chron-chapter[open] summary').textContent();
check('chapter headline reads as a title sentence', /title|crown|champion/i.test(headlineTxt), headlineTxt.slice(0, 60));
await page.screenshot({ path: `${OUT}/7b-chronicle.png` });

// Phase 108 — entity links: living club/player names in chronicle prose
// are clickable and jump to the deep dive across screens.
const chronLinks = await page.locator('#league-screen .entity-link').count();
check('chronicle prose carries entity links (108)', chronLinks >= 1, `${chronLinks} links`);
if (chronLinks >= 1) {
  await page.locator('#league-screen .entity-link').first().click();
  await page.waitForTimeout(300);
  const landedDive =
    (await page.locator('#clubs-screen').isVisible()) ||
    (await page.locator('#evolution-screen').isVisible()) ||
    (await page.locator('#player-screen').isVisible());
  check('an entity link lands on a deep-dive screen (108)', landedDive, '');
  // back to the league screen for the checks that follow
  await page.click('#topbar button:has-text("League table")');
  await page.waitForTimeout(200);
  await page.click('#league-screen button:has-text("Chronicle")');
  await page.waitForTimeout(200);
}

// Phase 51 — evolution has its OWN screen (top-bar 🧬 button; opening it
// closes the league screen). Hero map + scrubber + club panel + dynasty wall.
await page.click('#topbar button:has-text("Evolution")');
await page.waitForTimeout(300);
check('evolution center opens (own screen)', await page.locator('#evolution-screen').isVisible(), '');
check('league screen closed by the evolution center', !(await page.locator('#league-screen').isVisible()), '');
const mapCount = await page.locator('#evolution-screen .evo-map').count();
check('four style-space lenses render (51.1)', mapCount === 4, `${mapCount} maps`);
const mapDots = await page.locator('#evolution-screen .evo-map circle').count();
check('every lens plots all 16 clubs', mapDots === 64, `${mapDots} dots`);
check('generation scrubber present', (await page.locator('#evolution-screen .evo-scrub').count()) === 1, '');
// Scrub to frame 0 — all four lenses redraw without errors.
await page.locator('#evolution-screen .evo-scrub').fill('0');
await page.waitForTimeout(200);
check('scrubbing to gen 0 keeps 64 dots', (await page.locator('#evolution-screen .evo-map circle').count()) === 64, '');
// Phase 52 — the era strip above the wall (one cell per generation) + legend.
check('era strip rides the dynasty wall (52)', (await page.locator('#evolution-screen .era-strip').count()) === 1, '');
const eraCells = await page.locator('#evolution-screen .era-strip .era-cell').count();
check('era strip covers every generation', eraCells >= 2, `${eraCells} cells`);
check('era legend names the ages', (await page.locator('#evolution-screen .era-legend .era-chip').count()) >= 1, '');
// Tap a dynasty row → the club panel follows.
const dynRows = await page.locator('#evolution-screen .dyn-row-line').count();
check('dynasty wall shows all 16 slots', dynRows === 16, `${dynRows} rows`);
await page.locator('#evolution-screen .dyn-row-line').nth(3).click();
await page.waitForTimeout(200);
check('club deep-dive selects from the wall', (await page.locator('#evolution-screen .dyn-row-line.selected').count()) === 1, '');
check('club drift panel present (113.5 — identity moved to the club center)', (await page.locator('#evolution-screen .evo-club').count()) === 1, '');
check('drift panel links to the club center (113.5)', (await page.locator('#evolution-screen .evo-club button.club-link').count()) === 1, '');
const heatCells = await page.locator('#evolution-screen .attr-heatmap rect').count();
check('budget heatmap renders 16×8 cells', heatCells === 128, `${heatCells} cells`);
const tiles = await page.locator('#evolution-screen .spark-tile').count();
check('population trend tiles render', tiles >= 5, `${tiles} tiles`);
await page.screenshot({ path: `${OUT}/8-evolution.png` });

// The ceremony is reopenable from the evolution center (32.5 → 51).
await page.click('#evolution-screen button:has-text("Rebirth ceremony")');
await page.waitForTimeout(300);
check('evolution center reopens the rebirth ceremony', await page.locator('#rebirth-screen').isVisible(), '');
await page.click('#rebirth-screen .ceremony-continue');
await page.waitForTimeout(200);

// Phase 56 — the PLAYER CENTER: style space, deep dive, transfers, census.
await page.click('#topbar button:has-text("Players")');
await page.waitForTimeout(300);
check('player center opens (own screen)', await page.locator('#player-screen').isVisible(), '');
check('evolution center closed by the player center', !(await page.locator('#evolution-screen').isVisible()), '');
const playerDots = await page.locator('#player-screen .player-map circle').count();
// 16 clubs × 9-man ROSTERS since Phase 61 (the bench joined the population).
check('player style space plots all 144 players (61)', playerDots === 144, `${playerDots} dots`);
await page.click('#player-screen .player-lens button:has-text("ST")');
await page.waitForTimeout(200);
const stDots = await page.locator('#player-screen .player-map circle').count();
// 16 starting STs + 16 nominal-ST bench rows.
check('role lens filters the map to one line', stDots === 32, `${stDots} ST dots`);
await page.click('#player-screen .player-lens button:has-text("All")');
await page.waitForTimeout(200);
const diveRows = await page.locator('#player-screen .player-dive .gene-row').count();
check('deep dive shows attributes + appetites', diveRows === 13, `${diveRows} rows`);
check('personal appetites render as diverging bars', (await page.locator('#player-screen .style-diverge').count()) === 5, '');
const playerTxt = await page.textContent('#player-screen');
check('transfers & market section renders', playerTxt.includes('Transfers'), '');
check('census counts earned nameplates', playerTxt.includes('nameplate'), '');
await page.screenshot({ path: `${OUT}/8b-player-center.png`, fullPage: true });

// Back to the league screen for the hall checks.
await page.click('#topbar button:has-text("League table")');
await page.waitForTimeout(200);
check('league table button closes the evolution center', !(await page.locator('#evolution-screen').isVisible()), '');

await page.click('#league-screen button:has-text("Hall of fame")');
await page.waitForTimeout(300);
const hallText = await page.textContent('#league-screen');
check('hall of fame shows titles + records', hallText.includes('Premier titles') && hallText.includes('Most points'));
check('movement records render', hallText.includes('Movement records'));
check('dynasty timeline shows all 16 slots', (await page.locator('#league-screen .dynasty-row').count()) === 16);
check('dynasty division bands render', (await page.locator('#league-screen .dynasty-cell.band-d1').count()) > 0);
check('hall of fame lists Evo Cup honours', hallText.includes('Evo Cup honours'), '');
check('giant killings tallied in hall', hallText.includes('Most giant killings'), '');
await page.screenshot({ path: `${OUT}/9-hall-of-fame.png` });

// Cup tab after two seasons: live bracket + last season's completed bracket.
await page.click('#league-screen button:has-text("Cup")');
await page.waitForTimeout(300);
const cupTxt = await page.textContent('#league-screen');
check('cup tab: current + last-season brackets', (await page.locator('#league-screen .bracket').count()) === 2, '');
check('cup tab: completed bracket crowns 15 winners', (await page.locator('#league-screen .cup-row.cup-win').count()) === 15, '');
// Whether a giant killing HAPPENS is knife-edge world data (failure mode
// 11 — the phase-112 gene re-roll produced two upset-free cups): assert the
// marking PIPELINE instead — every upset tie in state carries the DOM flag.
const upsetTiesInState = await page.evaluate(() => {
  const lg = window.__evo.app.league;
  const cups = [lg.cup, [...lg.history].reverse().find((r) => r.cup)?.cup].filter(Boolean);
  return cups.reduce((n, c) => n + c.ties.filter((t) => t.upset).length, 0);
});
check(
  'cup tab: giant killings marked (matches state)',
  (await page.locator('#league-screen .cup-tie.upset').count()) === upsetTiesInState,
  `${upsetTiesInState} in state`,
);
check('cup tab: roll of honour lists champions', cupTxt.includes('Roll of honour'), '');
await page.screenshot({ path: `${OUT}/10-cup-bracket.png`, fullPage: true });
await page.click('#league-screen button:has-text("League")');

// ---- Phase 32.5 on a phone (the user's primary device, ≤390px) ----
// Nothing may overflow the viewport (failure mode: horizontal overflow
// breaks the whole page's proportions on phones).
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/13-phone-league-cards.png` });
const cardOverflow = await page.evaluate(() => {
  const s = document.querySelector('#league-screen');
  return s ? s.scrollWidth - s.clientWidth : 0;
});
check('phone: league cards fit 390px', cardOverflow <= 1, `overflow ${cardOverflow}px`);
await page.click('#league-screen button:has-text("Chronicle")');
await page.waitForTimeout(300);
const chronOverflow = await page.evaluate(() => {
  const s = document.querySelector('#league-screen');
  return s ? s.scrollWidth - s.clientWidth : 0;
});
check('phone: chronicle fits 390px (52)', chronOverflow <= 1, `overflow ${chronOverflow}px`);
await page.screenshot({ path: `${OUT}/13b-phone-chronicle.png` });
await page.click('#league-screen button:has-text("League")'); // back to the league tab
await page.waitForTimeout(200);
await page.click('button:has-text("League table")'); // close the league screen

// Phone: the player center (56).
await page.click('#topbar button:has-text("Players")');
await page.waitForTimeout(400);
const playerOverflow = await page.evaluate(() => {
  const s = document.querySelector('#player-screen');
  return s ? s.scrollWidth - s.clientWidth : 0;
});
check('phone: player center fits 390px (56)', playerOverflow <= 1, `overflow ${playerOverflow}px`);
// 68 (user report): NOT letterboxed — full-viewport like the league screen.
const playerH = await page.evaluate(() => document.querySelector('#player-screen')?.getBoundingClientRect().height ?? 0);
check('phone: player center is FULL PAGE (68)', playerH > 400, `h=${playerH}px`);
await page.screenshot({ path: `${OUT}/13c-phone-players.png` });
await page.click('#topbar button:has-text("Players")'); // close it again

// Phone: the evolution center (51) — same full-page contract (68).
await page.click('#topbar button:has-text("Evolution")');
await page.waitForTimeout(400);
const evoH = await page.evaluate(() => document.querySelector('#evolution-screen')?.getBoundingClientRect().height ?? 0);
const evoOverflow = await page.evaluate(() => {
  const s = document.querySelector('#evolution-screen');
  return s ? s.scrollWidth - s.clientWidth : 0;
});
check('phone: evolution center is FULL PAGE (68)', evoH > 400, `h=${evoH}px`);
check('phone: evolution center fits 390px (68)', evoOverflow <= 1, `overflow ${evoOverflow}px`);
await page.screenshot({ path: `${OUT}/13d-phone-evolution.png` });
await page.click('#topbar button:has-text("Evolution")'); // close it again

await page.evaluate(() => window.__evo.showCeremony());
await page.waitForTimeout(400);
const cerOverflow = await page.evaluate(() => {
  const s = document.querySelector('#rebirth-screen');
  return s ? s.scrollWidth - s.clientWidth : 0;
});
check('phone: rebirth ceremony fits 390px', cerOverflow <= 1, `overflow ${cerOverflow}px`);
await page.screenshot({ path: `${OUT}/14-phone-ceremony.png`, fullPage: true });
await page.click('#rebirth-screen .ceremony-continue');
await page.waitForTimeout(200);

await page.evaluate(() => window.__evo.app.skipMatch());
await page.waitForTimeout(400);
check('phone: clash banner shows', await page.evaluate(() => window.__evo.clashVisible()), '');
const clashBox = await page.locator('#clash-banner').boundingBox();
check('phone: clash banner fits 390px', clashBox !== null && clashBox.width <= 390, `w=${clashBox?.width}`);
await page.screenshot({ path: `${OUT}/15-phone-clash.png` });

check('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

const failed = checks.filter((c) => !c.ok);
console.log(`\n${failed.length === 0 ? 'ALL CHECKS PASSED' : `${failed.length} CHECK(S) FAILED`} (${checks.length} total)`);
await browser.close();
process.exit(failed.length === 0 ? 0 : 1);
