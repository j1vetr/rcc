import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:21416/';
const OUT = '/home/runner/workspace/shots/browser-test';
const EXE = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const ICD = '/nix/store/71577rskzyhch3axhdqx7faygc2xyn4v-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/vk_swiftshader_icd.json';

const out = {};

const browser = await chromium.launch({
  executablePath: EXE,
  args: [
    '--no-sandbox',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    `--vulkan-icd-path=${ICD}`,
  ],
});

async function scrollFlythrough(page, frac) {
  return await page.evaluate((frac) => {
    const canvas = document.querySelector('canvas');
    let el = canvas ? canvas.parentElement : null;
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
    window.scrollTo(0, absTop + scrollable * frac);
    return { ok: true };
  }, frac);
}

async function canvasPixels(page) {
  return await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return { ok: false };
    const tmp = document.createElement('canvas');
    tmp.width = c.width; tmp.height = c.height;
    const x = tmp.getContext('2d');
    try { x.drawImage(c, 0, 0); } catch (e) { return { ok: true, readErr: String(e), w: c.width, h: c.height }; }
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let nonT = 0, bright = 0, sig = [];
    for (let i = 0; i < d.length; i += 4) {
      if (d[i+3] > 10) nonT++;
      if (d[i] > 25 || d[i+1] > 25 || d[i+2] > 25) bright++;
    }
    // coarse signature
    const step = Math.max(4, Math.floor(d.length / 4 / 400)) * 4;
    for (let i = 0; i < d.length; i += step) sig.push(d[i]+d[i+1]+d[i+2]);
    const px = c.width * c.height;
    return { ok: true, w: c.width, h: c.height, nonTransparentPct: +(100*nonT/px).toFixed(2), brightPct: +(100*bright/px).toFixed(2), sig: sig.join(',') };
  });
}

// ---- DESKTOP WebGL render ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const glErrors = [];
  page.on('console', m => { if (m.type()==='error' && /WebGL context could not be created|Error creating WebGL/i.test(m.text())) glErrors.push(1); });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForSelector('canvas', { timeout: 15000 });
  await page.waitForTimeout(1500);

  // WebGL support check
  out.webglSupported = await page.evaluate(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { ok: false };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    return { ok: true, renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'n/a' };
  });

  await scrollFlythrough(page, 0.2);
  await page.waitForTimeout(1500);
  const px20 = await canvasPixels(page);
  await page.screenshot({ path: `${OUT}/desktop-flythrough-early-20.png` });

  await scrollFlythrough(page, 0.6);
  await page.waitForTimeout(1500);
  const px60 = await canvasPixels(page);
  await page.screenshot({ path: `${OUT}/desktop-flythrough-mid-60.png` });

  await scrollFlythrough(page, 1.0);
  await page.waitForTimeout(1500);
  const px100 = await canvasPixels(page);
  const interior = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const i = imgs.find(x => /flythrough-interior/.test(x.currentSrc||x.src));
    if (!i) return { found:false };
    const wrap = i.closest('div');
    return { found:true, imgOpacity: getComputedStyle(i).opacity, wrapperOpacity: wrap?getComputedStyle(wrap).opacity:null, visible: i.offsetParent !== null };
  });
  await page.screenshot({ path: `${OUT}/desktop-flythrough-end-100.png` });

  out.desktopWebGL = {
    glErrorCount: glErrors.length,
    px20: { nonT: px20.nonTransparentPct, bright: px20.brightPct, readErr: px20.readErr },
    px60: { nonT: px60.nonTransparentPct, bright: px60.brightPct, readErr: px60.readErr },
    px100: { nonT: px100.nonTransparentPct, bright: px100.brightPct },
    carAngleChanged: (px20.sig && px60.sig) ? px20.sig !== px60.sig : 'unknown',
    interiorCrossfade: interior,
  };
  await ctx.close();
}

// ---- Mobile canvas visibility (is it actually rendered/visible?) ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  out.mobileCanvas = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    const details = canvases.map(c => {
      const r = c.getBoundingClientRect();
      // find nearest ancestor with display:none or the md:block wrapper
      let hidden = false, node = c;
      while (node) {
        if (getComputedStyle(node).display === 'none') { hidden = true; break; }
        node = node.parentElement;
      }
      return { w: Math.round(r.width), h: Math.round(r.height), visible: c.offsetParent !== null, displayNoneAncestor: hidden };
    });
    // fallback img visibility
    const imgs = Array.from(document.querySelectorAll('img'));
    const fb = imgs.find(x => /flythrough-interior/.test(x.currentSrc||x.src));
    return {
      canvasCount: canvases.length,
      canvasDetails: details,
      anyCanvasVisible: details.some(d => d.visible && d.w>0 && d.h>0),
      fallbackVisible: fb ? fb.offsetParent !== null : false,
    };
  });
  await ctx.close();
}

// ---- BeforeAfter drag with proper pointer events (desktop) ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const slider = page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const box = await slider.boundingBox();
  const read = () => page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const dirty = s.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
    return { v: s.getAttribute('aria-valuenow'), clip: dirty ? dirty.style.clipPath : null };
  });
  const initial = await read();

  const cy = box.y + box.height/2;
  // Drag LEFT: press at current handle (58%), move to 25%
  await page.mouse.move(box.x + box.width*0.58, cy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width*0.45, cy, { steps: 6 });
  await page.mouse.move(box.x + box.width*0.25, cy, { steps: 10 });
  const midDrag = await read();
  await page.screenshot({ path: `${OUT}/desktop-beforeafter-mid-drag.png` });
  await page.mouse.up();
  const afterLeft = await read();

  // Drag RIGHT: to 80%
  await page.mouse.move(box.x + box.width*0.25, cy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width*0.80, cy, { steps: 12 });
  await page.mouse.up();
  const afterRight = await read();

  // Keyboard
  await slider.focus();
  const focusV = await read();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  const kLeft = await read();
  await page.keyboard.press('ArrowRight');
  const kRight = await read();

  out.beforeAfterDesktop = {
    initial: initial.v, clipInitial: initial.clip,
    midDrag: midDrag.v, clipMidDrag: midDrag.clip,
    afterLeft: afterLeft.v, afterRight: afterRight.v,
    keyboard: { focus: focusV.v, afterLeft: kLeft.v, afterRight: kRight.v },
    wipeMovedOnDrag: initial.clip !== midDrag.clip,
  };
  await ctx.close();
}

await browser.close();
fs.writeFileSync(`${OUT}/results2.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
