/**
 * 3D visual smoke test: drives the real game's Three.js viewer in headless
 * Chromium — meshes, cameras, readability aids, event feedback, replay — and
 * saves screenshots to /tmp/evofootball-shots-3d/. Requires the dev server:
 *   npx vite --port 5199 &  then  node scripts/visual-debug-3d.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.GAME_URL ?? 'http://localhost:5199/';
const OUT = '/tmp/evofootball-shots-3d';
mkdirSync(OUT, { recursive: true });

const errors = [];
const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok });
  console.log(`${ok ? '  ✓' : '  ✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const note = (msg) => console.log(`  · ${msg}`);

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1560, height: 940 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto(URL, { waitUntil: 'networkidle' });
// The app boots straight into 3D since Phase 27.5 — wait for ITS canvas
// (the hidden 2D Pixi canvas never becomes visible on its own).
await page.waitForSelector('#three-host canvas', { timeout: 15000 });
await page.waitForTimeout(1200);
const info = await page.evaluate(() => window.__evo.three());
check('3D renderer initializes', info !== null);
check('10 player models exist', info?.players === 10, `players=${info?.players}`);
check('2 goal models exist', info?.goals === 2);

const shot3d = await page.locator('#three-host canvas').screenshot();
check('3D canvas renders non-blank', shot3d.length > 10000, `${shot3d.length} bytes`);
check('broadcast score bug shows', info?.scoreBugVisible === true);
check('FX quality defaults to medium', info?.fxQuality === 'medium', `q=${info?.fxQuality}`);

// FX quality buttons drive the renderer for real.
await page.click('button:has-text("High")');
await page.waitForTimeout(200);
check('FX quality High reaches the renderer', (await page.evaluate(() => window.__evo.three()))?.fxQuality === 'high');
await page.click('button:has-text("Med")');

// ---- brief tactical look ----
await page.click('button:has-text("8×")');
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/1-tactical.png` });

// ---- watch the full first match at 32x, polling readability/feedback flags ----
await page.click('button:has-text("32×")');
const seen = { possessionRing: false, ballTrail: false, ballMarker: false, declutter: false, banner: false, netShake: false };
let crowdedShotTaken = false;
for (let i = 0; i < 60; i++) {
  const d = await page.evaluate(() => {
    const t = window.__evo.three();
    return t && { ...t, clock: document.querySelector('#scoreboard .clock')?.textContent ?? '' };
  });
  if (!d) break;
  seen.possessionRing ||= d.possessionRing;
  seen.ballTrail ||= d.ballTrail;
  seen.declutter ||= d.labelsVisible < 10;
  seen.banner ||= d.bannerVisible;
  seen.netShake ||= d.netShaking;
  if (d.ballMarker && !crowdedShotTaken) {
    crowdedShotTaken = true;
    seen.ballMarker = true;
    await page.screenshot({ path: `${OUT}/2-crowded.png` });
  }
  await page.waitForTimeout(250);
}
check('possession ring appears on ball carriers', seen.possessionRing);
check('ball trail appears on kicks', seen.ballTrail);
check('crowd marker flags a hidden ball', seen.ballMarker, crowdedShotTaken ? 'screenshot 2-crowded.png' : '');
check('labels declutter in crowds (<10 visible)', seen.declutter);

const goalsInMatch1 = await page.locator('#event-feed .ev.goal').count();
if (goalsInMatch1 > 0) {
  check('goal banner and/or net shake fired live', seen.banner || seen.netShake, `banner=${seen.banner} shake=${seen.netShake}`);
} else {
  note('first match had no goals — banner/net-shake verified in replay below');
}

// ---- broadcast attack framing (next match) ----
await page.click('button:has-text("TV")');
await page.click('button:has-text("8×")');
let framed = false;
for (let i = 0; i < 50; i++) {
  const d = await page.evaluate(() => window.__evo.three());
  if (d?.ball && Math.abs(d.ball.x) > 25 && d.cameraMode === 'broadcast') {
    framed = true;
    break;
  }
  await page.waitForTimeout(250);
}
await page.screenshot({ path: `${OUT}/3-broadcast-attack.png` });
check('broadcast camera frames final-third attacks', framed);

// ---- goalkeeper identity close-up (behind-goal frames the keeper) ----
await page.click('button:has-text("Goal")');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/3b-gk-identity.png` });

// ---- cinematic mode in 3D ----
await page.click('button:has-text("🎥 Cinematic")');
await page.waitForTimeout(400);
check('3D cinematic hides panels', !(await page.locator('#left-panel').isVisible()));
await page.screenshot({ path: `${OUT}/3c-cinematic-3d.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Esc exits 3D cinematic', await page.locator('#left-panel').isVisible());
check('cinematic state exposed to tooling', (await page.evaluate(() => window.__evo.cinematic())) === false);

// ---- select a player in 3D ----
await page.click('button:has-text("⏸")');
await page.waitForTimeout(300);
const box = await page.locator('#three-host canvas').boundingBox();
const size = await page.evaluate(() => window.__evo.canvasSize);
const targets = await page.evaluate(() => window.__evo.threePlayerPositions());
let selected = false;
for (const t of targets.slice(2, 8)) {
  await page.mouse.click(box.x + (t.x / size.w) * box.width, box.y + (t.y / size.h) * box.height);
  await page.waitForTimeout(250);
  const txt = await page.textContent('#player-card');
  if (txt && txt.includes('action:')) {
    selected = true;
    break;
  }
}
check('player click-to-select works in 3D', selected);

// ---- overlays ----
for (const label of ['Formation targets', 'Marking lines', 'Press assignments']) {
  await page.click(`label:has-text("${label}")`);
}
await page.click('button:has-text("2×")');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/4-overlays.png` });

// ---- replay: auto-camera, slow-mo, goal feedback ----
await page.click('button:has-text("🎬 Replay")');
await page.waitForTimeout(500);
check('replay opens', (await page.evaluate(() => window.__evo.replayInfo())).active === true);

const goalChip = page.locator('#replay-bar button.chip:has-text("⚽")').first();
const shotChip = page.locator('#replay-bar button.chip:has-text("🎯")').first();
if (await goalChip.count()) {
  await goalChip.click();
  await page.waitForTimeout(300);
  const rp = await page.evaluate(() => window.__evo.replayInfo());
  const cam = await page.evaluate(() => window.__evo.three().cameraMode);
  check('goal jump: behind-goal camera auto-selected', cam === 'behindGoal', cam);
  check('goal jump: slow motion engaged', rp.speed === 0.5, `speed=${rp.speed}`);
  // Ride the slow-mo into the goal moment; banner/net shake should re-fire.
  let goalFeedback = false;
  for (let i = 0; i < 36; i++) {
    const d = await page.evaluate(() => window.__evo.three());
    if (d.bannerVisible || d.netShaking) {
      goalFeedback = true;
      await page.screenshot({ path: `${OUT}/5-replay-goal.png` });
      break;
    }
    await page.waitForTimeout(250);
  }
  check('goal replay shows banner/net shake', goalFeedback);
} else if (await shotChip.count()) {
  note('no goal in the recording — using a shot chip instead');
  await shotChip.click();
  await page.waitForTimeout(300);
  const cam = await page.evaluate(() => window.__evo.three().cameraMode);
  check('shot jump: broadcast camera auto-selected', cam === 'broadcast', cam);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/5-replay-shot.png` });
} else {
  check('replay has event chips', false, 'no chips at all');
}

// Scrubbing still moves the world.
const ballBefore = await page.evaluate(() => window.__evo.three().ball);
await page.locator('#replay-bar input[type=range]').fill('950');
await page.waitForTimeout(400);
const ballAfter = await page.evaluate(() => window.__evo.three().ball);
check(
  'scrubbing moves the replayed world',
  Math.abs(ballBefore.x - ballAfter.x) + Math.abs(ballBefore.z - ballAfter.z) > 0.3,
);
await page.click('button:has-text("exit replay")');
check('replay exits', (await page.evaluate(() => window.__evo.replayInfo())).active === false);

// ---- 2D round-trip ----
await page.click('button:has-text("2D")');
await page.waitForTimeout(400);
check('back to 2D, 3D disposed', await page.evaluate(() => window.__evo.three()) === null);
await page.click('button:has-text("3D")');
await page.waitForTimeout(800);
check('3D re-initializes after dispose', (await page.evaluate(() => window.__evo.three()))?.players === 10);

// ---- Phase 24: shootout theater (dev-hook driven; checks stay structural —
// the kick script itself is engine-independent, mulberry32 only) ----
const theaterStarted = await page.evaluate(() => window.__evo.debugShootout());
check('shootout theater starts via dev hook', theaterStarted === true);
await page.waitForTimeout(400);
const th = await page.evaluate(() => window.__evo.theater());
check('theater reports kick progress', th !== null && th.total >= 6, JSON.stringify(th));
check(
  'penalty camera takes over for pens',
  (await page.evaluate(() => window.__evo.three().cameraMode)) === 'penalty',
);
const pensBugEarly = await page.textContent('#three-host .score-bug');
check('score bug switches to the pens score', pensBugEarly.includes('pens'), pensBugEarly.slice(0, 60));
// Let the first kick land (intro + walk + set + strike ≈ 5.2s), then look.
await page.waitForTimeout(7000);
await page.screenshot({ path: `${OUT}/12-shootout.png` });
const theaterFeed = await page.textContent('#event-feed');
check('feed narrates kicks by name', theaterFeed.includes('Pens:'), '');
check('theater still owns the stage mid-shootout', (await page.evaluate(() => window.__evo.theater())) !== null);
await page.click('button:has-text("⏭ skip")');
await page.waitForTimeout(300);
check('⏭ skips the shootout', (await page.evaluate(() => window.__evo.theater())) === null);
const feedAfterTheater = await page.textContent('#event-feed');
check('skipped kicks still reach the feed', (feedAfterTheater.match(/Pens:|Sudden death:/g) ?? []).length >= 6);

check('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

const failed = checks.filter((c) => !c.ok);
console.log(`\n${failed.length === 0 ? 'ALL 3D CHECKS PASSED' : `${failed.length} CHECK(S) FAILED`} (${checks.length} total)`);
await browser.close();
process.exit(failed.length === 0 ? 0 : 1);
