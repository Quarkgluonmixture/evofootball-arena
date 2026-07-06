// One-off probe: screenshot the shootout theater at its key beats.
// Usage: node scripts/probe-shootout.mjs (dev server on :5199)
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const OUT = '/tmp/evofootball-shootout-probe';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1560, height: 940 } });
await page.goto('http://localhost:5199');
await page.waitForTimeout(1200);
await page.click('button:has-text("3D")');
await page.waitForTimeout(1000);
await page.evaluate(() => window.__evo.debugShootout());

// Beats (theater seconds): intro end 2.0, kick-0 strike ~4.6, kick-0 outcome
// celebrate ~5.8, a save beat later, and the finale.
const beats = [
  { t: 2000, name: '1-intro' },
  { t: 2600, name: '2-walkup' },
  { t: 4700, name: '3-strike' },
  { t: 5600, name: '4-outcome' },
];
let elapsed = 0;
for (const b of beats) {
  await page.waitForTimeout(b.t - elapsed);
  elapsed = b.t;
  await page.screenshot({ path: `${OUT}/${b.name}.png` });
}
// Poll for a save beat and the finale.
let savedShot = false;
for (let i = 0; i < 200; i++) {
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => window.__evo.theater());
  if (!info) break;
  const feed = await page.textContent('#event-feed');
  if (!savedShot && feed.includes('SAVED')) {
    savedShot = true;
    await page.screenshot({ path: `${OUT}/5-save.png` });
  }
  if (info.done || info.kick >= info.total - 1) {
    // Deciding kick: slow-mo strike 2.0s + outcome 3.0s, then the finale.
    await page.waitForTimeout(9000);
    await page.screenshot({ path: `${OUT}/6-finale.png` });
    break;
  }
}
await page.screenshot({ path: `${OUT}/7-end.png` });
console.log('probe done →', OUT);
await browser.close();
