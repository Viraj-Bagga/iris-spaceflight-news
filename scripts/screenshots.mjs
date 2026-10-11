// Captures the README screenshots of the landing page: each full-screen
// section on desktop, plus the hero and setup at phone width. Reduced motion
// is on so scroll-triggered reveals are already in place when captured.
//
//   node scripts/screenshots.mjs URL OUTDIR
import { chromium } from 'playwright';

const [url = 'http://localhost:4173/', out = 'shots'] = process.argv.slice(2);
const browser = await chromium.launch();

async function shoot(prefix, viewport, deviceScaleFactor, sections) {
  const page = await browser.newPage({ viewport, deviceScaleFactor, reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const id of sections) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }), id);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${prefix}${id}.png` });
  }
  await page.close();
}

await shoot('', { width: 1440, height: 900 }, 1, ['hero', 'how-it-works', 'why-iris', 'setup', 'about']);
await shoot('phone-', { width: 390, height: 844 }, 2, ['hero', 'setup']);
await browser.close();
console.log('saved to', out);
