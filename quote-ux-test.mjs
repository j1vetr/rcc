import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const PORT = '21422';
const BASE = `http://localhost:${PORT}`;
const OUT = '/home/runner/workspace/shots/quote-ux';
fs.mkdirSync(OUT, { recursive: true });

const R = {};
const log = (k, v) => { R[k] = v; try { fs.writeFileSync('/tmp/quote-ux-results.json', JSON.stringify(R, null, 2)); } catch {} console.log(`[${k}]`, typeof v === 'object' ? JSON.stringify(v) : v); };

const vite = spawn('/home/runner/workspace/artifacts/rcc-website/node_modules/.bin/vite',
  ['--config', '/home/runner/workspace/artifacts/rcc-website/vite.config.ts', '--host', '0.0.0.0'],
  { env: { ...process.env, PORT, BASE_PATH: '/' }, stdio: 'ignore' });

const watchdog = setTimeout(() => { try { vite.kill('SIGKILL'); } catch {}; process.exit(2); }, 120000);
watchdog.unref();

async function up() { for (let i = 0; i < 40; i++) { try { const r = await fetch(BASE + '/'); if (r.status === 200) return i; } catch {} await new Promise(r => setTimeout(r, 1000)); } throw new Error('novite'); }

// scroll to #quote and wait for car picker
async function gotoQuote(page) {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="button-car-small"]', { timeout: 20000 });
  await page.$eval('#quote', el => el.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(400);
}

const progressWidth = () => {
  const bar = document.querySelector('#quote .h-px.w-full.bg-white\\/10 > div') || document.querySelector('#quote [style*="width"]');
  // find the animated progress fill: a div child of the track
  const track = document.querySelector('#quote .bg-white\\/10');
  const fill = track ? track.querySelector('div') : null;
  return fill ? fill.style.width || getComputedStyle(fill).width : null;
};

const stepInfo = () => {
  // step label "STEP 01".."04" in header
  const hdr = [...document.querySelectorAll('#quote span')].map(s => s.textContent.trim());
  const track = document.querySelector('#quote .bg-white\\/10');
  const fill = track ? track.querySelector('div') : null;
  const rectFill = fill ? fill.getBoundingClientRect().width : null;
  const rectTrack = track ? track.getBoundingClientRect().width : null;
  const pct = rectFill != null && rectTrack ? Math.round((rectFill / rectTrack) * 100) : null;
  return {
    progressPct: pct,
    hasCarPicker: !!document.querySelector('[data-testid="button-car-small"]'),
    hasPackages: !!document.querySelector('[data-testid^="option-service-"]'),
    hasContact: !!document.querySelector('[data-testid="input-name"]'),
    hasSubmit: !!document.querySelector('[data-testid="button-submit-quote"]'),
  };
};

async function main() {
  const upS = await up(); log('vite_up_s', upS);
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });

  // ============ MOBILE ============
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  const mErrs = []; mpage.on('console', m => { if (m.type() === 'error') mErrs.push(m.text()); }); mpage.on('pageerror', e => mErrs.push('PAGEERR ' + e.message));
  await gotoQuote(mpage);

  // Inspect car picker layout on mobile
  const mobileLayout = await mpage.evaluate(() => {
    const picker = document.querySelector('[data-testid="button-car-small"]').parentElement;
    const cs = getComputedStyle(picker);
    const card = document.querySelector('[data-testid="button-car-small"]');
    const crect = card.getBoundingClientRect();
    const prect = picker.getBoundingClientRect();
    // measure horizontal overflow (scrollable)
    const scrollable = picker.scrollWidth > picker.clientWidth + 2;
    // total stacked height if it were vertical vs actual
    return {
      display: cs.display,
      overflowX: cs.overflowX,
      scrollWidth: picker.scrollWidth,
      clientWidth: picker.clientWidth,
      horizontallyScrollable: scrollable,
      pickerHeightPx: Math.round(prect.height),
      cardWidthPx: Math.round(crect.width),
      viewportW: window.innerWidth,
      cardWidthVw: +(crect.width / window.innerWidth * 100).toFixed(1),
      maskImage: cs.maskImage || cs.webkitMaskImage,
      scrollbarWidthStyle: cs.scrollbarWidth,
    };
  });
  log('mobile_car_picker_layout', mobileLayout);

  // check scrollbar visually hidden: attempt scroll and confirm scrollLeft changes
  const mobileScroll = await mpage.evaluate(async () => {
    const picker = document.querySelector('[data-testid="button-car-small"]').parentElement;
    const before = picker.scrollLeft;
    picker.scrollLeft = 200;
    await new Promise(r => setTimeout(r, 100));
    const after = picker.scrollLeft;
    picker.scrollLeft = 0;
    return { before, after, moved: after > before };
  });
  log('mobile_scroll_test', mobileScroll);

  // screenshot mobile step 1 (the quote section top)
  await mpage.$eval('#quote', el => el.scrollIntoView({ block: 'start' }));
  await mpage.waitForTimeout(300);
  await mpage.screenshot({ path: `${OUT}/mobile-step1-scrollrow.png` });
  // also a tighter crop of the picker
  const pcRect = await mpage.evaluate(() => { const p = document.querySelector('[data-testid="button-car-small"]').parentElement; const r = p.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await mpage.screenshot({ path: `${OUT}/mobile-step1-picker-crop.png`, clip: { x: Math.max(0, pcRect.x - 4), y: Math.max(0, pcRect.y - 40), width: Math.min(390, pcRect.w + 8), height: pcRect.h + 80 } });
  log('mobile_console_errors', mErrs);
  await mctx.close();

  // ============ DESKTOP ============
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dpage = await dctx.newPage();
  const dErrs = []; dpage.on('console', m => { if (m.type() === 'error') dErrs.push(m.text()); }); dpage.on('pageerror', e => dErrs.push('PAGEERR ' + e.message));
  await gotoQuote(dpage);

  // desktop grid layout
  const desktopLayout = await dpage.evaluate(() => {
    const picker = document.querySelector('[data-testid="button-car-small"]').parentElement;
    const cs = getComputedStyle(picker);
    return { display: cs.display, gridTemplateColumns: cs.gridTemplateColumns, columnsCount: (cs.gridTemplateColumns || '').split(' ').filter(Boolean).length, overflowX: cs.overflowX };
  });
  log('desktop_car_picker_layout', desktopLayout);

  // Prefill canton (simulate map selection => ZH)
  await dpage.fill('[data-testid="input-canton"]', 'ZH');
  const step0 = await dpage.evaluate(stepInfo); log('desktop_before_car_click', step0);

  // Click a car type
  await dpage.click('[data-testid="button-car-medium"]');
  // immediately after click, before 350ms
  await dpage.waitForTimeout(120);
  const immediately = await dpage.evaluate(stepInfo); log('desktop_120ms_after_car', immediately);
  // wait for auto-advance
  await dpage.waitForFunction(() => !!document.querySelector('[data-testid^="option-service-"]'), { timeout: 3000 }).catch(() => {});
  await dpage.waitForTimeout(600);
  const afterAdvance = await dpage.evaluate(stepInfo); log('desktop_after_car_autoadvance', afterAdvance);
  await dpage.screenshot({ path: `${OUT}/desktop-step2-autoadvanced.png` });

  // Step 2: click a package -> auto-advance to step 3
  const firstPkg = await dpage.evaluate(() => { const el = document.querySelector('[data-testid^="option-service-"]'); return el ? el.getAttribute('data-testid') : null; });
  log('desktop_first_package_testid', firstPkg);
  await dpage.click(`[data-testid="${firstPkg}"]`);
  await dpage.waitForFunction(() => !!document.querySelector('[data-testid="input-name"]'), { timeout: 3000 }).catch(() => {});
  await dpage.waitForTimeout(600);
  const afterPkg = await dpage.evaluate(stepInfo); log('desktop_after_package_autoadvance', afterPkg);

  // Step 3: no auto-advance. Wait 800ms and confirm still on contact (no submit yet)
  await dpage.waitForTimeout(900);
  const step3Stable = await dpage.evaluate(stepInfo); log('desktop_step3_no_autoadvance', step3Stable);

  // Manual Weiter on step 3 -> step 4 (review + submit). Fill valid contact (fields are required).
  await dpage.fill('[data-testid="input-name"]', 'Max Muster');
  await dpage.fill('[data-testid="input-email"]', 'max@example.com');
  await dpage.fill('[data-testid="input-phone"]', '0788803884');
  await dpage.click('[data-testid="button-wizard-next"]');
  await dpage.waitForFunction(() => !!document.querySelector('[data-testid="button-submit-quote"]'), { timeout: 3000 }).catch(() => {});
  await dpage.waitForTimeout(400);
  const step4 = await dpage.evaluate(stepInfo); log('desktop_step4_manual_next', step4);

  // Back navigation: go from step 4 to step 2 (click Back twice) using visible text locator
  const stepIndex = () => dpage.evaluate(() => { const s = [...document.querySelectorAll('#quote span')].map(x=>x.textContent.trim()); const m = s.find(x=>/^0[1-4]$/.test(x)); return m; });
  const countZurueck = () => dpage.evaluate(() => [...document.querySelectorAll('#quote button')].filter(b => /Zurück/.test(b.textContent)).length);
  log('desktop_zurueck_btn_count', await countZurueck());
  // back1: step4 (index3) -> step3 (index2, contact)
  await dpage.getByRole('button', { name: /Zurück/ }).first().click();
  await dpage.waitForTimeout(1000);
  const afterBack1 = await dpage.evaluate(stepInfo); log('desktop_after_back1', afterBack1);
  // back2: step3 (index2) -> step2 (index1, packages)
  await dpage.getByRole('button', { name: /Zurück/ }).first().click();
  await dpage.waitForFunction(() => !!document.querySelector('[data-testid^="option-service-"]'), { timeout: 3000 }).catch(() => {});
  await dpage.waitForTimeout(1000);
  const afterBack = await dpage.evaluate(stepInfo); log('desktop_after_back_twice', afterBack);

  // On step 2 select a DIFFERENT package -> auto-advance again
  const pkgs = await dpage.evaluate(() => [...document.querySelectorAll('[data-testid^="option-service-"]')].map(e => ({ id: e.getAttribute('data-testid'), pressed: e.getAttribute('aria-pressed') })));
  log('desktop_packages_on_back', pkgs);
  const different = pkgs.find(p => p.pressed !== 'true');
  if (different) {
    await dpage.click(`[data-testid="${different.id}"]`);
    await dpage.waitForFunction(() => !!document.querySelector('[data-testid="input-name"]'), { timeout: 3000 }).catch(() => {});
    await dpage.waitForTimeout(600);
    const afterDiff = await dpage.evaluate(stepInfo); log('desktop_after_different_package_autoadvance', { clicked: different.id, ...afterDiff });
  } else {
    log('desktop_after_different_package_autoadvance', 'NO_DIFFERENT_PACKAGE_FOUND');
  }

  log('desktop_console_errors', dErrs);
  await dctx.close();
  await browser.close();
  vite.kill('SIGKILL');
  log('DONE', true);
  process.exit(0);
}

main().catch(e => { log('FATAL', String(e && e.stack || e)); try { vite.kill('SIGKILL'); } catch {}; process.exit(1); });
