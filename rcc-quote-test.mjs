import { chromium } from 'playwright-core';
import fs from 'node:fs';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const R = {};
const log = (k, v) => { R[k] = v; console.log(`[${k}]`, typeof v === 'object' ? JSON.stringify(v) : v); };

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
fs.mkdirSync('/home/runner/workspace/shots', { recursive: true });

const rr = r => r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom) } : null;

// ============ DESKTOP 1440x900 ============
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pd = await ctxD.newPage();
const dErrs = [];
pd.on('console', m => { if (m.type() === 'error') dErrs.push(m.text()); });
pd.on('pageerror', e => dErrs.push('PAGEERR: ' + e.message));
await pd.goto(BASE + '/', { waitUntil: 'networkidle' });
await pd.waitForTimeout(1000);

// trigger lazy sections by scrolling through the page
for (let y = 0; y <= 10; y++) { await pd.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f / 10), y); await pd.waitForTimeout(350); }
await pd.waitForSelector('#quote', { state: 'attached', timeout: 20000 });
await pd.waitForSelector('[data-testid="input-name"]', { state: 'attached', timeout: 20000 });
await pd.waitForTimeout(600);

// scroll #quote to top
await pd.evaluate(() => { const el = document.getElementById('quote'); const y = el.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, y); });
await pd.waitForTimeout(700);

const dQuote = await pd.evaluate(() => {
  const round = r => r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom) } : null;
  const section = document.getElementById('quote');
  const secR = section.getBoundingClientRect();
  const panel = section.querySelector('.border.border-white\\/10') || section.querySelector('[class*="border"]');
  const panelR = panel ? panel.getBoundingClientRect() : null;
  const form = section.querySelector('form');
  const formR = form ? form.getBoundingClientRect() : null;
  const inputs = ['input-name','input-email','input-phone','input-canton'].map(id => {
    const e = document.querySelector(`[data-testid="${id}"]`);
    return e ? { id, r: round(e.getBoundingClientRect()) } : { id, r: null };
  });
  const svc = document.querySelector('[data-testid="select-service-type"]');
  const msg = document.querySelector('[data-testid="input-message"]');
  const submit = document.querySelector('[data-testid="button-submit-quote"]');
  const carPicker = document.querySelector('[data-testid^="cartype-"]') || section.querySelector('form .grid');
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    section: round(secR),
    panel: round(panelR),
    form: round(formR),
    inputs,
    service: svc ? round(svc.getBoundingClientRect()) : null,
    message: msg ? round(msg.getBoundingClientRect()) : null,
    submit: submit ? round(submit.getBoundingClientRect()) : null,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  };
});
log('desktop_quote_layout', dQuote);
log('desktop_horiz_overflow', dQuote.scrollW > dQuote.clientW + 1);

// Check 4 contact inputs are in ONE row (same top within tolerance)
const dTops = dQuote.inputs.filter(i => i.r).map(i => i.r.top);
const dContactSameRow = dTops.length === 4 && (Math.max(...dTops) - Math.min(...dTops) <= 6);
log('desktop_4inputs_one_row', { sameRow: dContactSameRow, tops: dTops });

// Left-column emptiness: compute empty area to left of form content within header row.
// header row is the top grid; check the left cell (title) vs form width. We estimate whitespace ratio of panel.
const dWhitespace = await pd.evaluate(() => {
  const section = document.getElementById('quote');
  const panel = section.querySelector('.border.border-white\\/10');
  if (!panel) return null;
  const pR = panel.getBoundingClientRect();
  const panelArea = pR.width * pR.height;
  // sum bounding areas of leaf content elements (text/input/labels/buttons) inside panel
  const leaves = Array.from(panel.querySelectorAll('h2,h3,p,span,a,label,input,textarea,button,svg,[data-testid^="cartype"]'));
  let filled = 0;
  const seen = [];
  leaves.forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.width > 2 && r.height > 2) seen.push([r.left, r.top, r.width, r.height]);
  });
  // rough occupied via sampling grid 60x60
  const cols = 60, rows = 60;
  let occ = 0;
  for (let i=0;i<cols;i++) for (let j=0;j<rows;j++){
    const px = pR.left + (i+0.5)/cols*pR.width;
    const py = pR.top + (j+0.5)/rows*pR.height;
    const hit = seen.some(([l,t,w,h]) => px>=l&&px<=l+w&&py>=t&&py<=t+h);
    if (hit) occ++;
  }
  return { panelWidth: Math.round(pR.width), panelHeight: Math.round(pR.height), occupiedRatio: +(occ/(cols*rows)).toFixed(3), whitespaceRatio: +(1-occ/(cols*rows)).toFixed(3) };
});
log('desktop_panel_whitespace', dWhitespace);

// existing canton/service events populate fields
await pd.evaluate(() => window.dispatchEvent(new CustomEvent('select-canton', { detail: 'Zürich' })));
await pd.waitForTimeout(200);
const svcOpts = await pd.evaluate(() => {
  // read a service id from select options via API-populated list; dispatch select-service with first option
  return null;
});
// grab first service option id by opening select
const firstSvcId = await pd.evaluate(async () => {
  const trigger = document.querySelector('[data-testid="select-service-type"]');
  return trigger ? true : false;
});
await pd.evaluate(() => {
  // find any option-service testid rendered? they render in portal only when open. Instead dispatch a plausible value then read.
});
// Try dispatch select-service with a real service id: query API
const svcId = await pd.evaluate(async () => {
  try { const r = await fetch('/api/services'); const j = await r.json(); return Array.isArray(j) && j[0] ? j[0].id : (j.services && j.services[0] ? j.services[0].id : null); } catch(e){ return 'ERR:'+e.message; }
});
log('first_service_id', svcId);
if (svcId && !String(svcId).startsWith('ERR')) {
  await pd.evaluate((id) => window.dispatchEvent(new CustomEvent('select-service', { detail: id })), svcId);
  await pd.waitForTimeout(300);
}
const dFieldVals = await pd.evaluate(() => {
  const canton = document.querySelector('[data-testid="input-canton"]');
  const svcTrigger = document.querySelector('[data-testid="select-service-type"]');
  const car = document.querySelector('[data-testid^="cartype-"]') || document.querySelector('[class*="CarType"]');
  const carButtons = Array.from(document.querySelectorAll('button')).filter(b => (b.getAttribute('data-testid')||'').includes('car'));
  return {
    cantonValue: canton ? canton.value : null,
    serviceTriggerText: svcTrigger ? svcTrigger.textContent.trim() : null,
    submitExists: !!document.querySelector('[data-testid="button-submit-quote"]'),
    carPickerButtonCount: document.querySelectorAll('form button').length,
  };
});
log('desktop_event_population', dFieldVals);

// car selection: click a car option (do NOT submit). Find car picker buttons.
const carClick = await pd.evaluate(() => {
  const section = document.getElementById('quote');
  // CarTypePicker renders buttons; find buttons that are not submit
  const btns = Array.from(section.querySelectorAll('form button')).filter(b => b.getAttribute('data-testid') !== 'button-submit-quote');
  const infos = btns.map(b => ({ testid: b.getAttribute('data-testid'), text: (b.textContent||'').trim().slice(0,20), type: b.type }));
  return { count: btns.length, infos };
});
log('desktop_car_options', carClick);
if (carClick.count > 0) {
  await pd.evaluate(() => {
    const section = document.getElementById('quote');
    const btns = Array.from(section.querySelectorAll('form button')).filter(b => b.getAttribute('data-testid') !== 'button-submit-quote');
    if (btns[0]) btns[0].click();
  });
  await pd.waitForTimeout(200);
}

// screenshot desktop quote (focused on section, scrolled to top)
await pd.evaluate(() => { const el = document.getElementById('quote'); const y = el.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, y); });
await pd.waitForTimeout(400);
await pd.locator('#quote').screenshot({ path: '/home/runner/workspace/shots/quote-desktop.png' });
log('shot_desktop_quote', 'shots/quote-desktop.png');

// ==== NON-HERO SECTION HEADINGS on desktop ====
const dHeadings = await pd.evaluate(() => {
  const round = r => ({ w: Math.round(r.width), h: Math.round(r.height) });
  const out = [];
  ['how-it-works','locations','services','quote'].forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) { out.push({ id, missing: true }); return; }
    const h = sec.querySelector('h2') || sec.querySelector('h1') || sec.querySelector('h3');
    if (!h) { out.push({ id, noHeading: true }); return; }
    const cs = getComputedStyle(h);
    out.push({ id, tag: h.tagName, fontSizePx: Math.round(parseFloat(cs.fontSize)), lineHeightPx: Math.round(parseFloat(cs.lineHeight)||0), rect: round(h.getBoundingClientRect()), text: (h.textContent||'').trim().slice(0,40) });
  });
  // also grab the big Why/Services rotating h3 numbers
  const svcH3 = document.querySelector('#services h3');
  if (svcH3) { const cs = getComputedStyle(svcH3); out.push({ id:'services-h3', fontSizePx: Math.round(parseFloat(cs.fontSize)), rect: round(svcH3.getBoundingClientRect()), text:(svcH3.textContent||'').trim().slice(0,30) }); }
  return out;
});
log('desktop_nonhero_headings', dHeadings);

// screenshot desktop services (scroll to top)
await pd.evaluate(() => { const el = document.getElementById('services'); const y = el.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, y); });
await pd.waitForTimeout(500);
await pd.locator('#services').screenshot({ path: '/home/runner/workspace/shots/services-desktop.png' });
log('shot_desktop_services', 'shots/services-desktop.png');

log('desktop_console_errors', dErrs);
await ctxD.close();

// ============ MOBILE 390x844 ============
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const pm = await ctxM.newPage();
const mErrs = [];
pm.on('console', m => { if (m.type() === 'error') mErrs.push(m.text()); });
pm.on('pageerror', e => mErrs.push('PAGEERR: ' + e.message));
await pm.goto(BASE + '/', { waitUntil: 'networkidle' });
await pm.waitForTimeout(1000);

for (let y = 0; y <= 10; y++) { await pm.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f / 10), y); await pm.waitForTimeout(350); }
await pm.waitForSelector('#quote', { state: 'attached', timeout: 20000 });
await pm.waitForSelector('[data-testid="input-name"]', { state: 'attached', timeout: 20000 });
await pm.waitForTimeout(600);

// scroll quote to top
await pm.evaluate(() => { const el = document.getElementById('quote'); const y = el.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, y); });
await pm.waitForTimeout(700);

const mQuote = await pm.evaluate(() => {
  const round = r => r ? { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) } : null;
  const section = document.getElementById('quote');
  const secR = section.getBoundingClientRect();
  const secTopDoc = secR.top + window.scrollY;
  const h2 = section.querySelector('h2');
  const p = section.querySelector('p');
  const arrow = section.querySelector('svg.lucide-arrow-down') || Array.from(section.querySelectorAll('svg')).find(s => (s.getAttribute('class')||'').toLowerCase().includes('arrow'));
  const firstInput = document.querySelector('[data-testid="input-name"]');
  const firstInputTopDoc = firstInput ? firstInput.getBoundingClientRect().top + window.scrollY : null;
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    section: round(secR),
    sectionTopDoc: Math.round(secTopDoc),
    sectionHeight: Math.round(secR.height),
    title: h2 ? { text: (h2.textContent||'').trim().slice(0,40), rect: round(h2.getBoundingClientRect()), fontSizePx: Math.round(parseFloat(getComputedStyle(h2).fontSize)) } : null,
    copy: p ? { text: (p.textContent||'').trim().slice(0,60), rect: round(p.getBoundingClientRect()) } : null,
    arrowCue: !!arrow ? round(arrow.getBoundingClientRect()) : null,
    firstInput: firstInput ? round(firstInput.getBoundingClientRect()) : null,
    sectionTopToFirstInputPx: (firstInput ? Math.round(firstInput.getBoundingClientRect().top + window.scrollY - secTopDoc) : null),
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  };
});
log('mobile_quote_layout', mQuote);
log('mobile_horiz_overflow', mQuote.scrollW > mQuote.clientW + 1);

// mobile events populate
await pm.evaluate(() => window.dispatchEvent(new CustomEvent('select-canton', { detail: 'Bern' })));
if (svcId && !String(svcId).startsWith('ERR')) await pm.evaluate((id) => window.dispatchEvent(new CustomEvent('select-service', { detail: id })), svcId);
await pm.waitForTimeout(300);
const mVals = await pm.evaluate(() => {
  const canton = document.querySelector('[data-testid="input-canton"]');
  const svcTrigger = document.querySelector('[data-testid="select-service-type"]');
  return { cantonValue: canton ? canton.value : null, serviceTriggerText: svcTrigger ? svcTrigger.textContent.trim() : null, submitExists: !!document.querySelector('[data-testid="button-submit-quote"]') };
});
log('mobile_event_population', mVals);

// screenshot mobile quote (top of section)
await pm.evaluate(() => { const el = document.getElementById('quote'); const y = el.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, y); });
await pm.waitForTimeout(400);
await pm.screenshot({ path: '/home/runner/workspace/shots/quote-mobile.png' });
log('shot_mobile_quote', 'shots/quote-mobile.png');

log('mobile_console_errors', mErrs);
await ctxM.close();

await browser.close();
fs.writeFileSync('/home/runner/workspace/shots/quote-results.json', JSON.stringify(R, null, 2));
console.log('DONE');
