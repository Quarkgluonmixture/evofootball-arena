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

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForSelector('#stage canvas', { timeout: 15000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/1-initial.png` });

// Canvas actually rendered something non-blank? (drawImage on a WebGL canvas
// is blank without preserveDrawingBuffer, so judge by the compositor
// screenshot instead: a striped pitch compresses far larger than a flat fill.)
const canvasShot = await page.locator('#stage canvas').screenshot();
check('canvas renders non-blank pitch', canvasShot.length > 10000, `${canvasShot.length} bytes png`);

const clockBefore = await page.textContent('#scoreboard .clock');

// Fast-forward at 32x; read mid-match (after the match ends the app loads the
// next fixture, which resets the scoreboard/stats — by design).
await page.click('button:has-text("32×")');
await page.waitForTimeout(4000);
await page.screenshot({ path: `${OUT}/2-match-32x.png` });

const clockAfter = await page.textContent('#scoreboard .clock');
check('clock advances under 32×', clockBefore !== clockAfter, `"${clockBefore}" -> "${clockAfter}"`);

const shotVals = await page.locator('#right-panel .stat-val').allTextContents();
const totalShots = Number(shotVals[0] ?? 0) + Number(shotVals[1] ?? 0);
check('match stats accumulate', totalShots > 0, `shots ${shotVals[0]}+${shotVals[1]}`);
await page.click('button:has-text("⏸")');

const feedRows = await page.locator('#event-feed .ev').count();
check('event feed populates', feedRows > 3, `${feedRows} rows`);

const chartPaths = await page.locator('.xg-chart path').count();
check('xG chart draws step lines', chartPaths >= 2, `${chartPaths} paths`);

// Advance into the next match, enable overlays, let it play a moment.
await page.click('button:has-text("⏭ skip")');
for (const label of ['Formation targets', 'Marking lines', 'Press assignments', 'Ball heatmap']) {
  await page.click(`label:has-text("${label}")`);
}
await page.click('button:has-text("2×")');
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
check('team cards render', cards === 16, `${cards} cards`);
check('division badges on team cards', (await page.locator('#league-screen .tag.div-badge-1').count()) === 8);
check('promotion rules selector present', (await page.locator('#league-screen .rules-row button').count()) === 2);

// Toggle playoff mode and verify zones change to include the decider spots.
await page.click('#league-screen button:has-text("⚔ Playoff")');
await page.waitForTimeout(300);
const playoffZones = await page.locator('#league-screen tr.zone-playoff').count();
check('playoff mode marks the decider spots', playoffZones === 2, `${playoffZones} playoff rows`);
await page.click('#league-screen button:has-text("Auto top/bottom 2")');
await page.waitForTimeout(200);

await page.screenshot({ path: `${OUT}/5-league.png` });

// Cup tab, fresh season: the R16 draw is made, later rounds await winners.
await page.click('#league-screen button:has-text("Cup")');
await page.waitForTimeout(300);
const cupFreshTxt = await page.textContent('#league-screen');
check('cup tab: draw rule documented', cupFreshTxt.includes('lower-division (else lower-seeded)'));
check('cup tab: fresh bracket shows all 15 ties', (await page.locator('#league-screen .cup-tie').count()) === 15);
check('cup tab: 14 slots await feeder winners', (await page.locator('#league-screen .cup-row.cup-tbd').count()) === 14);
await page.screenshot({ path: `${OUT}/5b-cup-fresh.png` });
await page.click('#league-screen button:has-text("League")');
await page.waitForTimeout(200);
await page.click('button:has-text("League table")');

// Simulate two full seasons headless via the UI button (two, so the
// evolution sparklines have a line to draw).
await page.click('button:has-text("Season")');
await page.waitForTimeout(25000);
const feedText = await page.textContent('#event-feed');
check('season sim completes with champion message', feedText.includes('champions'), '');
check('cup champion announced in feed', feedText.includes('win the Evo Cup'), '');
await page.click('button:has-text("Season")');
await page.waitForTimeout(25000);

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
// differ between Node and Chromium float paths — assert a story, not a name.
const storyText = await page.locator('#league-screen .report-story').textContent();
check('a cup narrative is mined', /DOUBLE:|GIANT SLAIN:|CUP RUN:|REVENGE:/.test(storyText), storyText.slice(0, 60));
await page.screenshot({ path: `${OUT}/7-season-report.png` });

await page.click('#league-screen button:has-text("Evolution")');
await page.waitForTimeout(300);
const tiles = await page.locator('#league-screen .spark-tile').count();
check('gene+attr drift sparklines render', tiles >= 19, `${tiles} tiles`);
await page.screenshot({ path: `${OUT}/8-evolution.png` });

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
check('cup tab: giant killings marked', (await page.locator('#league-screen .cup-tie.upset').count()) >= 1, '');
check('cup tab: roll of honour lists champions', cupTxt.includes('Roll of honour'), '');
await page.screenshot({ path: `${OUT}/10-cup-bracket.png`, fullPage: true });
await page.click('#league-screen button:has-text("League")');

check('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

const failed = checks.filter((c) => !c.ok);
console.log(`\n${failed.length === 0 ? 'ALL CHECKS PASSED' : `${failed.length} CHECK(S) FAILED`} (${checks.length} total)`);
await browser.close();
process.exit(failed.length === 0 ? 0 : 1);
