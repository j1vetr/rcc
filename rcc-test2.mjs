import { chromium } from 'playwright-core';
import fs from 'node:fs';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const R = {};
const log = (k, v) => { R[k] = v; console.log(`[${k}]`, typeof v === 'object' ? JSON.stringify(v) : v); };

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
fs.mkdirSync('/home/runner/workspace/shots', { recursive: true });

// ========= MOBILE 390x844 =========
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctxM.newPage();
const errs = [];
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// --- PROCESS STEPS: observe data-active cycle over ~7s (park mouse away) ---
await page.mouse.move(5, 5);
await page.locator('#how-it-works').scrollIntoViewIfNeeded();
await page.mouse.move(5, 5);
await page.waitForTimeout(400);
const readActive = () => page.evaluate(() => [1,2,3].map(i => {
  const el = document.querySelector(`[data-testid="process-step-${i}"]`);
  return el ? el.getAttribute('data-active') : null;
}));
const activeSeq = [];
const t0 = Date.now();
// sample every 300ms for 7s; record which step index is active
while (Date.now() - t0 < 7000) {
  const st = await readActive();
  const idx = st.findIndex(v => v === 'true') + 1; // 1-based, 0 if none
  const last = activeSeq[activeSeq.length - 1];
  if (!last || last.step !== idx) activeSeq.push({ t: Date.now() - t0, step: idx });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(150);
}
log('process_active_transitions', activeSeq);
// derive ordered distinct step sequence
const stepOrder = activeSeq.map(s => s.step).filter(s => s > 0);
log('process_step_order', stepOrder);

// mobile process screenshot
await page.locator('#how-it-works').scrollIntoViewIfNeeded();
await page.mouse.move(5, 5);
await page.waitForTimeout(300);
await page.locator('#how-it-works').screenshot({ path: '/home/runner/workspace/shots/m-process.png' });
log('shot_mobile_process', 'shots/m-process.png');

// --- SWITZERLAND MAP ---
await page.locator('#locations').scrollIntoViewIfNeeded();
await page.mouse.move(5, 5);
await page.waitForTimeout(600);

// bounds: svg, geographies group, card container, viewport
const bounds = await page.evaluate(() => {
  const round = r => r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), right: Math.round(r.right) } : null;
  const section = document.getElementById('locations');
  const svg = section.querySelector('svg');
  const svgR = svg ? svg.getBoundingClientRect() : null;
  // whole geography content bbox in screen coords: union of all path rects
  const paths = Array.from(section.querySelectorAll('path'));
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  paths.forEach(p => { const r = p.getBoundingClientRect(); if(r.width||r.height){minX=Math.min(minX,r.left);minY=Math.min(minY,r.top);maxX=Math.max(maxX,r.right);maxY=Math.max(maxY,r.bottom);} });
  const geoUnion = isFinite(minX) ? { left: Math.round(minX), right: Math.round(maxX), top: Math.round(minY), bottom: Math.round(maxY), w: Math.round(maxX-minX), h: Math.round(maxY-minY) } : null;
  // card: nearest sized wrapper of svg (the .relative.w-full div)
  const card = svg ? svg.closest('div') : null;
  const cardR = card ? card.getBoundingClientRect() : null;
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    svg: round(svgR),
    card: round(cardR),
    geoUnion,
    docScrollWidth: document.documentElement.scrollWidth,
    docClientWidth: document.documentElement.clientWidth,
  };
});
log('map_bounds_mobile', bounds);
// clipping analysis
log('map_left_clip_mobile', {
  geoLeft: bounds.geoUnion?.left, cardLeft: bounds.card?.left, viewportLeft: 0,
  geoLeftClippedByCard: bounds.geoUnion && bounds.card ? bounds.geoUnion.left < bounds.card.left - 1 : null,
  geoLeftOffscreen: bounds.geoUnion ? bounds.geoUnion.left < -1 : null,
  horizOverflow: bounds.docScrollWidth > bounds.docClientWidth + 1,
});

// canton labels
const labels = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('.map-canton-label'));
  const codes = els.map(e => (e.textContent || '').trim());
  const visible = els.filter(e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none');
  return { total: els.length, visibleCount: visible.length, codes, visibleCodes: visible.map(e => e.textContent.trim()) };
});
log('map_labels', labels);
// check no city circles/names: look for <circle> markers or long (>2 char) marker texts
const legacy = await page.evaluate(() => {
  const section = document.getElementById('locations');
  const circles = Array.from(section.querySelectorAll('circle'));
  const markerTexts = Array.from(section.querySelectorAll('text')).map(t => (t.textContent||'').trim());
  const cityLike = markerTexts.filter(t => t.length > 2); // codes are 2 letters; city names longer
  return { circleCount: circles.length, textsLongerThan2: cityLike };
});
log('map_legacy_check', legacy);

// mobile map screenshot
await page.locator('#locations').screenshot({ path: '/home/runner/workspace/shots/m-map.png' });
log('shot_mobile_map', 'shots/m-map.png');

// observe glow: sample glowing path (fill/stroke/filter) over ~3.5s
await page.mouse.move(5, 5);
const glowSamples = [];
const g0 = Date.now();
while (Date.now() - g0 < 3500) {
  const s = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll('#locations path'));
    // glowing = has drop-shadow filter and glow fill
    const glowing = paths.filter(p => { const cs = getComputedStyle(p); return cs.filter && cs.filter.includes('drop-shadow') && cs.filter !== 'none'; });
    return glowing.map(p => { const cs = getComputedStyle(p); return { fill: cs.fill, stroke: cs.stroke, filter: cs.filter.slice(0,40), key: p.getAttribute('d') ? p.getAttribute('d').slice(0,14) : '' }; });
  });
  glowSamples.push({ t: Date.now() - g0, glowingKeys: s.map(x => x.key), sample: s[0] || null });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(320);
}
// distinct glowing path keys across samples
const distinctGlow = [...new Set(glowSamples.flatMap(s => s.glowingKeys).filter(Boolean))];
log('glow_distinct_paths', distinctGlow.length);
log('glow_samples', glowSamples.map(s => ({ t: s.t, keys: s.glowingKeys, fill: s.sample?.fill, stroke: s.sample?.stroke, filter: s.sample?.filter })));

// click ZH then verify it stays selected while others still glow.
// The ZH label <text> marker sits on top of the path, so click the label (also selects ZH via selectByCode).
await page.mouse.move(5, 5);
const zhLabel = page.locator('text.map-canton-label', { hasText: /^ZH$/ }).first();
await zhLabel.scrollIntoViewIfNeeded();
await zhLabel.click({ force: true });
await page.waitForTimeout(400);
const afterClick = [];
const c0 = Date.now();
while (Date.now() - c0 < 2500) {
  const s = await page.evaluate(() => {
    const zh = document.querySelector('[data-testid="button-canton-ZH"]');
    const zhcs = zh ? getComputedStyle(zh) : null;
    const gold = 'rgb(217, 168, 32)'; // hsl(43,74%,49%) approx
    // count paths currently glowing (excluding selected)
    const paths = Array.from(document.querySelectorAll('#locations path'));
    const glowing = paths.filter(p => { const cs = getComputedStyle(p); return cs.filter && cs.filter.includes('drop-shadow') && cs.filter !== 'none'; });
    return { zhFill: zhcs?.fill, zhStroke: zhcs?.stroke, zhStrokeWidth: zhcs?.strokeWidth, zhAriaPressed: zh?.getAttribute('aria-pressed'), glowingCount: glowing.length };
  });
  afterClick.push({ t: Date.now() - c0, ...s });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(350);
}
log('zh_selected_samples', afterClick);
// confirm ZH fill is solid gold (selected, no alpha) across all samples and glow continues
const isSolidGold = f => f && /^rgb\(21[0-9],\s*16[0-9],\s*3[0-9]\)$/.test(f.replace(/\s+/g,' ').trim());
log('zh_selected_stable', {
  allAriaPressed: afterClick.every(s=>s.zhAriaPressed==='true'),
  allSolidGoldFill: afterClick.every(s=>isSolidGold(s.zhFill)),
  glowContinued: afterClick.some(s=>s.glowingCount>0),
  distinctZhFills: [...new Set(afterClick.map(s=>s.zhFill))],
  glowingCounts: afterClick.map(s=>s.glowingCount),
});

// --- WHY RCC autoplay 01->04 over ~12s (avoid hovering the buttons) ---
await page.locator('[data-testid="why-rcc-cinematic-image"]').scrollIntoViewIfNeeded();
await page.mouse.move(5, 5);
await page.waitForTimeout(300);
const whySeq = [];
const w0 = Date.now();
while (Date.now() - w0 < 13000) {
  const cur = await page.evaluate(() => {
    const img = document.querySelector('[data-testid^="why-rcc-image-"]');
    const tid = img ? img.getAttribute('data-testid') : null;
    const idx = tid ? Number(tid.split('-').pop()) : null;
    return { idx, src: img ? (img.getAttribute('src')||'').split('/').pop() : null };
  });
  const last = whySeq[whySeq.length-1];
  if (!last || last.idx !== cur.idx) whySeq.push({ t: Date.now()-w0, idx: cur.idx, src: cur.src });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(300);
}
log('why_autoplay_seq', whySeq);

// manual click test: click button-why-2
await page.mouse.move(5,5);
await page.click('[data-testid="button-why-2"]');
await page.waitForTimeout(250);
const manual = await page.evaluate(() => {
  const img = document.querySelector('[data-testid^="why-rcc-image-"]');
  return { activeImg: img?.getAttribute('data-testid'), src: (img?.getAttribute('src')||'').split('/').pop() };
});
log('why_manual_click_button2', manual);

log('mobile_console_errors', errs);
await ctxM.close();

// ========= DESKTOP 1440x900 =========
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pd = await ctxD.newPage();
await pd.goto(BASE + '/', { waitUntil: 'networkidle' });
await pd.waitForTimeout(800);
// desktop map bounds quick
await pd.locator('#locations').scrollIntoViewIfNeeded();
await pd.mouse.move(5,5); await pd.waitForTimeout(500);
const dBounds = await pd.evaluate(() => {
  const round = r => r ? { left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) } : null;
  const section = document.getElementById('locations');
  const svg = section.querySelector('svg');
  const card = svg ? svg.closest('div') : null;
  const paths = Array.from(section.querySelectorAll('path'));
  let minX=Infinity,maxX=-Infinity; paths.forEach(p=>{const r=p.getBoundingClientRect(); if(r.width){minX=Math.min(minX,r.left);maxX=Math.max(maxX,r.right);}});
  return { svg: round(svg?.getBoundingClientRect()), card: round(card?.getBoundingClientRect()), geoLeft: Math.round(minX), geoRight: Math.round(maxX), scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth };
});
log('map_bounds_desktop', dBounds);
log('desktop_horiz_overflow', dBounds.scrollW > dBounds.clientW + 1);

// desktop WhyRcc screenshot + flag/footer
await pd.locator('[data-testid="why-rcc-cinematic-image"]').scrollIntoViewIfNeeded();
await pd.mouse.move(5,5); await pd.waitForTimeout(400);
// screenshot the whole Why RCC section
await pd.evaluate(() => { const el = document.querySelector('[data-testid="why-rcc-cinematic-image"]'); el.closest('section')?.scrollIntoView(); });
await pd.waitForTimeout(300);
const whySection = pd.locator('[data-testid="why-rcc-cinematic-image"]').locator('xpath=ancestor::section[1]');
await whySection.screenshot({ path: '/home/runner/workspace/shots/d-whyrcc.png' }).catch(async()=>{ await pd.screenshot({path:'/home/runner/workspace/shots/d-whyrcc.png'}); });
log('shot_desktop_whyrcc', 'shots/d-whyrcc.png');

const dFlag = await pd.evaluate(() => {
  const btn = document.querySelector('[data-testid="button-language-switcher"]');
  const img = btn?.querySelector('img');
  const emoji = /[\u{1F1E6}-\u{1F1FF}]/u.test(btn?.textContent||'');
  return { isImg: !!img, srcHead: (img?.getAttribute('src')||'').slice(0,40), isSvg: (img?.getAttribute('src')||'').includes('svg'), emoji };
});
log('desktop_flag', dFlag);
const dFooter = await pd.evaluate(() => document.querySelector('footer').textContent.replace(/\s+/g,' ').trim());
log('desktop_footer', dFooter);

await ctxD.close();
await browser.close();
fs.writeFileSync('/home/runner/workspace/shots/results2.json', JSON.stringify(R, null, 2));
console.log('DONE');
