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
// The suites' selectors are English — pin the UI language (zh is the app default since Phase 28.1).
await page.addInitScript(() => localStorage.setItem('evofootball-lang', 'en'));

await page.goto(URL, { waitUntil: 'networkidle' });
// The app boots straight into 3D since Phase 27.5 — wait for ITS canvas
// (the hidden 2D Pixi canvas never becomes visible on its own).
await page.waitForSelector('#three-host canvas.gl-canvas', { timeout: 15000 });
await page.waitForTimeout(1200);
const info = await page.evaluate(() => window.__evo.three());
check('3D renderer initializes', info !== null);
check('12 player models exist', info?.players === 12, `players=${info?.players}`);
check('2 goal models exist', info?.goals === 2);
// Phase 66 (N3): league fixtures carry named coaches — both stand the touchline.
check('2 coaches stand the touchline (66)', info?.coaches === 2, `coaches=${info?.coaches}`);
// 66.1: the seated crowd is instanced and alive (animated in the update loop).
check('the crowd is seated (66.1)', (info?.crowd ?? 0) > 200, `crowd=${info?.crowd}`);
// 72: tactical info lives ONLY in the tacfeed camera — hidden at boot.
check('mini formation map hidden outside tacfeed (72)', info?.tacmapVisible === false);

const shot3d = await page.locator('#three-host canvas.gl-canvas').screenshot();
check('3D canvas renders non-blank', shot3d.length > 10000, `${shot3d.length} bytes`);
check('broadcast score bug shows', info?.scoreBugVisible === true);
check('FX quality defaults to medium', info?.fxQuality === 'medium', `q=${info?.fxQuality}`);

// Pre-match clash (32.5): the app boots paused on a fresh fixture, so the
// tale-of-the-tape is up. Verify, then dismiss so it never blocks a click.
check('pre-match clash shows at boot (32.5)', await page.evaluate(() => window.__evo.clashVisible()), '');
await page.screenshot({ path: `${OUT}/0-clash-3d.png` });
await page.click('#clash-banner');
await page.waitForTimeout(200);
check('clash dismisses on tap', !(await page.evaluate(() => window.__evo.clashVisible())), '');

// FX quality buttons drive the renderer for real.
await page.click('button:has-text("High")');
await page.waitForTimeout(200);
check('FX quality High reaches the renderer', (await page.evaluate(() => window.__evo.three()))?.fxQuality === 'high');
await page.click('button:has-text("Med")');

// ---- brief tactical look ----
await page.evaluate(() => window.__evo.app.setSpeed(8));
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/1-tactical.png` });

// ---- watch the full first match at 32x, polling readability/feedback flags ----
// Auto-highlights defaults OFF now (Phase 41.1): turn it ON to exercise the
// reel; the click after the reel check toggles it back off for the live sections.
await page.click('label:has-text("Auto highlights")');
await page.evaluate(() => window.__evo.app.setSpeed(32));
const seen = { possessionRing: false, ballTrail: false, ballMarker: false, declutter: false, banner: false, netShake: false, netBulge: false, reel: false, refInBounds: false, refMoved: false, refCall: false, arOnLines: false, arMoved: false, arFlag: false };
let refPrev = null;
let arPrev = null;
let crowdedShotTaken = false;
for (let i = 0; i < 60; i++) {
  // HT/FT auto-highlights (Phase 33): the reel pauses the sim at a whistle.
  // Verify it rolled (chip + replay), screenshot once, then ⏭ back to live.
  if (await page.evaluate(() => window.__evo.reelActive())) {
    if (!seen.reel) {
      seen.reel = true;
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/2b-highlight-reel.png` });
    }
    await page.evaluate(() => window.__evo.app.skipMatch());
    await page.waitForTimeout(200);
    continue;
  }
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
  seen.netBulge ||= d.netBulging;
  if (d.referee) {
    seen.refInBounds ||= Math.abs(d.referee.x) <= 46 && Math.abs(d.referee.z) <= 31;
    if (refPrev) seen.refMoved ||= Math.hypot(d.referee.x - refPrev.x, d.referee.z - refPrev.z) > 0.5;
    refPrev = d.referee;
    seen.refCall ||= d.referee.calling;
  }
  if (d.linesmen?.length === 2) {
    // Each AR holds his touchline (|z| just outside the pitch) and his half.
    seen.arOnLines ||= d.linesmen.every((l, i) =>
      Math.abs(l.z) > 29.4 && Math.abs(l.z) < 32 && Math.abs(l.x) <= 45 && (i === 0 ? l.x >= -0.6 : l.x <= 0.6));
    if (arPrev) seen.arMoved ||= Math.abs(d.linesmen[0].x - arPrev[0].x) > 0.5 || Math.abs(d.linesmen[1].x - arPrev[1].x) > 0.5;
    arPrev = d.linesmen;
    seen.arFlag ||= d.linesmen.some((l) => l.flag);
  }
  seen.crowdStirred ||= d.crowdArousal > 0.1; // 66.1: a shot/save/goal moved the stands
  if (d.ballMarker && !crowdedShotTaken) {
    crowdedShotTaken = true;
    seen.ballMarker = true;
    await page.screenshot({ path: `${OUT}/2-crowded.png` });
  }
  await page.waitForTimeout(250);
}
check('possession ring appears on ball carriers', seen.possessionRing);
check('HT/FT highlight reel rolled and ⏭ skipped it (33)', seen.reel, seen.reel ? '2b-highlight-reel.png' : '');
// Reel verified — switch auto-highlights OFF so the remaining sections
// (camera framing, selection, replay) poll live play, not surprise reels.
await page.click('label:has-text("Auto highlights")');
if (await page.evaluate(() => window.__evo.reelActive())) {
  await page.evaluate(() => window.__evo.app.skipMatch());
  await page.waitForTimeout(200);
}
check('ball trail appears on kicks', seen.ballTrail);
check('crowd marker flags a hidden ball', seen.ballMarker, crowdedShotTaken ? 'screenshot 2-crowded.png' : '');
check('labels declutter in crowds (<10 visible)', seen.declutter);
check('the stands stirred at least once (66.1)', seen.crowdStirred === true);
check('referee patrols inside the pitch (75)', seen.refInBounds);
check('referee moves with play (75)', seen.refMoved);
if (seen.refCall) check('referee raised the call arm on a foul/card (75)', true);
else note('no foul landed in the poll window — call arm not observed');
check('linesmen hold their touchlines + halves (77)', seen.arOnLines);
check('linesmen run the offside line (77)', seen.arMoved);
if (seen.arFlag) check('a linesman flagged an offside/corner (77)', true);
else note('no offside/corner at a covered end in the poll window — flag not observed');


const goalsInMatch1 = await page.locator('#event-feed .ev.goal').count();
if (goalsInMatch1 > 0) {
  check('goal banner and/or net shake fired live', seen.banner || seen.netShake, `banner=${seen.banner} shake=${seen.netShake}`);
  // The bulge (74) starts with the shake and outlives it (0.9s vs 0.7s), so
  // any poll that caught the shake must also have caught the bulge.
  if (seen.netShake) check('net bulges at the impact point on goals (74)', seen.netBulge, `bulge=${seen.netBulge}`);
} else {
  note('first match had no goals — banner/net-shake verified in replay below');
}

// ---- broadcast attack framing (next match) ----
// A reel may still be running off the last whistle — back to live first.
if (await page.evaluate(() => window.__evo.reelActive())) {
  await page.evaluate(() => window.__evo.app.skipMatch());
  await page.waitForTimeout(200);
}
await page.click('button:has-text("TV")');
await page.evaluate(() => window.__evo.app.setSpeed(8));
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

// ---- the ANALYST feed (72): tactical info only here, elements event-gated ----
await page.click('button:has-text("Tac feed")');
await page.evaluate(() => window.__evo.app.setSpeed(8));
const tac = { lines: false, block: false, converge: false, flash: false, inset: false };
for (let i = 0; i < 80; i++) {
  const d = await page.evaluate(() => window.__evo.three());
  if (!d) break;
  tac.lines ||= d.broadcastLines;
  tac.block ||= d.broadcastBlock;
  tac.converge ||= d.pressConverge;
  tac.flash ||= d.offsideFlash;
  tac.inset ||= d.tacmapVisible;
  if (await page.evaluate(() => window.__evo.reelActive())) {
    await page.evaluate(() => window.__evo.app.skipMatch());
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(200);
}
check('tacfeed: defensive lines draw (72)', tac.lines === true);
check('tacfeed: set-block hull appears (72)', tac.block === true);
check('tacfeed: press convergence appears (72)', tac.converge === true);
check('tacfeed: offside flash fires (72)', tac.flash === true);
check('tacfeed: the inset shows here (72)', tac.inset === true);
await page.screenshot({ path: `${OUT}/3b-tacfeed.png` });
await page.click('button:has-text("TV")');
await page.waitForTimeout(300);
const offFeed = await page.evaluate(() => window.__evo.three());
check('leaving tacfeed hides the layer (72)', offFeed?.tacmapVisible === false && offFeed?.broadcastLines === false);
await page.evaluate(() => window.__evo.app.setSpeed(1));

// ---- cinematic mode in 3D (stage button since 34.1) ----
await page.click('.cinematic-enter');
await page.waitForTimeout(400);
check('3D cinematic hides panels', !(await page.locator('#left-panel').isVisible()));
await page.screenshot({ path: `${OUT}/3c-cinematic-3d.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Esc exits 3D cinematic', await page.locator('#left-panel').isVisible());
check('cinematic state exposed to tooling', (await page.evaluate(() => window.__evo.cinematic())) === false);

// ---- select a player in 3D ----
// Live play only: a reel replaying moments would put clicks on ghost frames.
if (await page.evaluate(() => window.__evo.reelActive())) {
  await page.evaluate(() => window.__evo.app.skipMatch());
  await page.waitForTimeout(200);
}
await page.click('button:has-text("⏸")');
await page.waitForTimeout(300);
// A new fixture may have loaded behind the watch loop — clear its clash
// banner so the raw canvas clicks below can't be intercepted.
if (await page.evaluate(() => window.__evo.clashVisible())) {
  await page.click('#clash-banner');
  await page.waitForTimeout(200);
}
const box = await page.locator('#three-host canvas.gl-canvas').boundingBox();
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
await page.evaluate(() => window.__evo.app.setSpeed(2));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/4-overlays.png` });

// ---- replay: auto-camera, slow-mo, goal feedback ----
// The live buffer needs at least one jumpable moment first — a young match
// (reel-skips eat watch time) may not have produced a shot yet. Run on 32×.
if ((await page.evaluate(() => window.__evo.liveMoments())) === 0) {
  await page.evaluate(() => window.__evo.app.setSpeed(32));
  for (let i = 0; i < 40; i++) {
    if (await page.evaluate(() => window.__evo.reelActive())) {
      await page.evaluate(() => window.__evo.app.skipMatch());
    }
    if ((await page.evaluate(() => window.__evo.liveMoments())) > 0) break;
    await page.waitForTimeout(250);
  }
  await page.click('button:has-text("⏸")');
  await page.waitForTimeout(200);
}
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

// ---- 2D round-trip (fallback path — panel toggle removed in 34.1) ----
await page.evaluate(() => window.__evo.app.setViewMode('2d'));
await page.waitForTimeout(400);
check('back to 2D, 3D disposed', await page.evaluate(() => window.__evo.three()) === null);
await page.evaluate(() => window.__evo.app.setViewMode('3d'));
await page.waitForTimeout(800);
check('3D re-initializes after dispose', (await page.evaluate(() => window.__evo.three()))?.players === 12);

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
