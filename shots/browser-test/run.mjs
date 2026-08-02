import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:21416/';
const OUT = '/home/runner/workspace/shots/browser-test';
const EXE = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const BENIGN = [
  /vite/i, /react-devtools/i, /Download the React DevTools/i,
  /WebGL/i, /THREE\./i, /performance/i, /Multiple instances of Three/i,
  /\[vite\]/i,
];

function isBenign(txt) { return BENIGN.some((r) => r.test(txt)); }

const results = { desktop: {}, mobile: {}, consoleErrors: [], screenshots: [] };

async function collectConsole(page, bucket) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      const entry = { ctx: bucket, text: txt, benign: isBenign(txt) };
      results.consoleErrors.push(entry);
    }
  });
  page.on('pageerror', (err) => {
    const txt = String(err.message || err);
    results.consoleErrors.push({ ctx: bucket, text: 'PAGEERROR: ' + txt, benign: isBenign(txt) });
  });
}

async function scrollFlythrough(page, frac) {
  // Find the pinned section (h-[340vh] wrapper). It's the parent of the sticky container.
  // We locate the canvas' outer scroll section by measuring its bounding box.
  const info = await page.evaluate((frac) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { ok: false };
    // Walk up to find the tall scroll section (height ~ 340vh)
    let el = canvas.parentElement;
    let section = null;
    while (el) {
      const r = el.getBoundingClientRect();
      if (r.height > window.innerHeight * 2) { section = el; break; }
      el = el.parentElement;
    }
    if (!section) return { ok: false };
    const rect = section.getBoundingClientRect();
    const absTop = rect.top + window.scrollY;
    const scrollable = rect.height - window.innerHeight;
    const target = absTop + scrollable * frac;
    window.scrollTo(0, target);
    return { ok: true, target, absTop, scrollable, sectionHeight: rect.height, vh: window.innerHeight };
  }, frac);
  return info;
}

async function shot(page, name) {
  const p = `${OUT}/${name}.png`;
  await page.screenshot({ path: p });
  results.screenshots.push(p);
  return p;
}

const browser = await chromium.launch({ executablePath: EXE, args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--no-sandbox'] });

// ---------------- DESKTOP ----------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await collectConsole(page, 'desktop');
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  results.desktop.loadMs = Date.now() - t0;
  await page.waitForTimeout(1500);

  // Wait for canvas to appear
  let canvasExists = false;
  try {
    await page.waitForSelector('canvas', { timeout: 15000 });
    canvasExists = true;
  } catch { canvasExists = false; }
  results.desktop.canvasExists = canvasExists;

  // horizontal overflow check
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    bodyScrollW: document.body.scrollWidth,
  }));
  results.desktop.overflow = overflow;
  results.desktop.horizontalOverflow = overflow.scrollW > overflow.clientW + 1;

  // Canvas non-empty check (drawing buffer has non-transparent pixels)
  if (canvasExists) {
    // scroll to ~10% to make sure the car is rendering in orbit
    await scrollFlythrough(page, 0.1);
    await page.waitForTimeout(1200);
    const canvasCheck = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      if (!c) return { ok: false };
      const w = c.width, h = c.height;
      // Read pixels via a 2d snapshot on an offscreen canvas
      const tmp = document.createElement('canvas');
      tmp.width = w; tmp.height = h;
      const ctx2 = tmp.getContext('2d');
      try { ctx2.drawImage(c, 0, 0); } catch (e) { return { ok: true, w, h, readErr: String(e) }; }
      const data = ctx2.getImageData(0, 0, w, h).data;
      let nonTransparent = 0, bright = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i+3] > 10) nonTransparent++;
        if (data[i] > 30 || data[i+1] > 30 || data[i+2] > 30) bright++;
      }
      const px = w*h;
      return { ok: true, w, h, nonTransparentPct: +(100*nonTransparent/px).toFixed(2), brightPct: +(100*bright/px).toFixed(2) };
    });
    results.desktop.canvasCheck = canvasCheck;
  }

  // Screenshot @ ~20%
  const s20 = await scrollFlythrough(page, 0.2);
  results.desktop.scroll20 = s20;
  await page.waitForTimeout(1000);
  results.desktop.caption20 = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p')).map(p => ({t: p.textContent.trim(), o: getComputedStyle(p).opacity}));
    return ps.filter(p => ['Exterieur','Detailarbeit','Interieur'].includes(p.t));
  });
  await shot(page, 'desktop-flythrough-early-20');

  // Screenshot @ ~60%
  await scrollFlythrough(page, 0.6);
  await page.waitForTimeout(1000);
  results.desktop.caption60 = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p')).map(p => ({t: p.textContent.trim(), o: getComputedStyle(p).opacity}));
    return ps.filter(p => ['Exterieur','Detailarbeit','Interieur'].includes(p.t));
  });
  await shot(page, 'desktop-flythrough-mid-60');

  // Screenshot @ 100% (interior crossfade)
  await scrollFlythrough(page, 1.0);
  await page.waitForTimeout(1200);
  results.desktop.caption100 = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p')).map(p => ({t: p.textContent.trim(), o: getComputedStyle(p).opacity}));
    return ps.filter(p => ['Exterieur','Detailarbeit','Interieur'].includes(p.t));
  });
  // interior image opacity check
  results.desktop.interiorCrossfade = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const interior = imgs.find(i => /flythrough-interior/.test(i.currentSrc || i.src));
    if (!interior) return { found: false };
    const wrapper = interior.closest('div');
    return { found: true, imgOpacity: getComputedStyle(interior).opacity, wrapperOpacity: wrapper ? getComputedStyle(wrapper).opacity : null };
  });
  await shot(page, 'desktop-flythrough-end-100');

  // ---- Grab pixel hashes at 20 vs 60 to prove car angle changed ----
  async function canvasHash(frac) {
    await scrollFlythrough(page, frac);
    await page.waitForTimeout(1000);
    return await page.evaluate(() => {
      const c = document.querySelector('canvas');
      if (!c) return null;
      const tmp = document.createElement('canvas');
      const dw = 64, dh = 40;
      tmp.width = dw; tmp.height = dh;
      const x = tmp.getContext('2d');
      try { x.drawImage(c, 0, 0, dw, dh); } catch { return null; }
      const d = x.getImageData(0,0,dw,dh).data;
      // build a coarse signature
      let sig = [];
      for (let i=0;i<d.length;i+=4*40) sig.push(d[i]+d[i+1]+d[i+2]);
      return sig.join(',');
    });
  }
  const h20 = await canvasHash(0.2);
  const h60 = await canvasHash(0.6);
  results.desktop.carAngleChanged = (h20 && h60) ? (h20 !== h60) : 'unknown';

  // ---------------- BeforeAfter desktop ----------------
  const slider = page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  results.desktop.baInitial = await page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    return { valuenow: s?.getAttribute('aria-valuenow') };
  });
  const box = await slider.boundingBox();
  results.desktop.baBox = box;

  // labels visible
  results.desktop.baLabels = await page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const spans = Array.from(s.querySelectorAll('span')).map(x=>x.textContent.trim());
    return spans;
  });

  // clip-path before drag
  const clipBefore = await page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const dirty = s.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
    return dirty ? dirty.style.clipPath : null;
  });
  results.desktop.clipBefore = clipBefore;

  // Drag LEFT via mouse
  const cx = box.x + box.width * 0.58;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.30, cy, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const afterLeft = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
  await shot(page, 'desktop-beforeafter-mid-drag');
  const clipLeft = await page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const dirty = s.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
    return dirty ? dirty.style.clipPath : null;
  });

  // Drag RIGHT via mouse
  await page.mouse.move(box.x + box.width * 0.30, cy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, cy, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const afterRight = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));

  // Keyboard test
  await slider.focus();
  const focusVal = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(200);
  const afterKeyLeft = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const afterKeyRight = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));

  results.desktop.beforeAfter = {
    initial58: results.desktop.baInitial.valuenow,
    clipBefore, clipLeft,
    afterDragLeft: afterLeft, afterDragRight: afterRight,
    keyboard: { focusVal, afterKeyLeft, afterKeyRight },
    dragMovedWipe: clipBefore !== clipLeft,
  };

  // Dirty vs glossy brightness sampling (left dirty side vs right glossy side)
  results.desktop.dirtyVsGlossy = await page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const r = s.getBoundingClientRect();
    // sample not reliable via pixels here; report grime overlay existence
    const grime = s.querySelector('.beforeafter-grime');
    const dirtyImg = s.querySelector('.beforeafter-dirty-img');
    return {
      grimePresent: !!grime,
      grimeStyle: grime ? { filter: getComputedStyle(grime).filter, bg: getComputedStyle(grime).backgroundColor, opacity: getComputedStyle(grime).opacity } : null,
      dirtyImgFilter: dirtyImg ? getComputedStyle(dirtyImg).filter : null,
    };
  });

  // Floating buttons present (desktop)
  results.desktop.floating = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a,button'));
    const wa = all.find(e => /whatsapp/i.test(e.getAttribute('href')||'') || /whatsapp/i.test(e.getAttribute('aria-label')||''));
    const assistant = all.find(e => /assist|chat|berater|help/i.test((e.getAttribute('aria-label')||'') + (e.className||'')));
    return { whatsappFound: !!wa, assistantFound: !!assistant };
  });

  await ctx.close();
}

// ---------------- MOBILE ----------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' });
  const page = await ctx.newPage();
  await collectConsole(page, 'mobile');
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);

  results.mobile.canvasExists = await page.evaluate(() => !!document.querySelector('canvas'));
  results.mobile.fallbackImg = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const interior = imgs.find(i => /flythrough-interior/.test(i.currentSrc||i.src));
    if (!interior) return { found: false };
    const cls = interior.className;
    return { found: true, hasKenburns: /kenburns/i.test(cls), className: cls };
  });

  const overflowM = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth }));
  results.mobile.overflow = overflowM;
  results.mobile.horizontalOverflow = overflowM.scrollW > overflowM.clientW + 1;

  // scroll a bit into flythrough fallback and screenshot
  await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const interior = imgs.find(i => /flythrough-interior/.test(i.currentSrc||i.src));
    if (interior) interior.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);
  await shot(page, 'mobile-flythrough-fallback');

  // BeforeAfter touch drag
  const slider = page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const box = await slider.boundingBox();
  results.mobile.baBox = box;
  const mInitial = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));

  // Touch drag using touchscreen API
  const cy = box.y + box.height/2;
  await page.touchscreen.tap(box.x + box.width*0.58, cy).catch(()=>{});
  // Use dispatch of pointer events sequence for a drag
  await page.mouse.move(box.x + box.width*0.58, cy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width*0.25, cy, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const mAfter = await page.evaluate(() => document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
  results.mobile.beforeAfter = { initial: mInitial, afterDrag: mAfter, moved: mInitial !== mAfter };
  await shot(page, 'mobile-beforeafter');

  // Floating buttons on mobile + overlap check with slider
  results.mobile.floating = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a,button'));
    const wa = all.find(e => /whatsapp/i.test(e.getAttribute('href')||'') || /whatsapp/i.test(e.getAttribute('aria-label')||''));
    const assistant = all.find(e => /assist|chat|berater|help/i.test((e.getAttribute('aria-label')||'') + (e.className||'')));
    function rectOf(e){ if(!e) return null; const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(r.bottom),right:Math.round(r.right)}; }
    return { whatsappFound: !!wa, assistantFound: !!assistant, waRect: rectOf(wa), assistantRect: rectOf(assistant), vw: window.innerWidth, vh: window.innerHeight };
  });

  await ctx.close();
}

await browser.close();

fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
