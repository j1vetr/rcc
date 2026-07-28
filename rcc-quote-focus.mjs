import { chromium } from 'playwright-core';
import fs from 'node:fs';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const R = {};
const log = (k, v) => { R[k] = v; console.log(`[${k}]`, typeof v === 'object' ? JSON.stringify(v) : v); };
const round = r => r ? { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) } : null;

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
fs.mkdirSync('/home/runner/workspace/shots', { recursive: true });

async function prep(page) {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  for (let y = 0; y <= 10; y++) { await page.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f / 10), y); await page.waitForTimeout(300); }
  await page.waitForSelector('#quote', { state: 'attached', timeout: 20000 });
  await page.waitForSelector('[data-testid="input-name"]', { state: 'attached', timeout: 20000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => { const el = document.getElementById('quote'); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY); });
  await page.waitForTimeout(500);
}
// ensure any open radix Select popover is closed before screenshot
async function closeSelect(page) {
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(() => { document.body.click(); });
  await page.waitForTimeout(200);
  const open = await page.evaluate(() => !!document.querySelector('[data-state="open"][role="listbox"], [data-radix-popper-content-wrapper]'));
  return open;
}

// service id for event test
const tmp = await browser.newPage();
const svcId = await tmp.evaluate(async () => { try { const r = await fetch('http://localhost:21416/api/services'); const j = await r.json(); const a = Array.isArray(j)?j:(j.services||[]); return a[0]?.id ?? null; } catch(e){ return 'ERR'; } }).catch(()=>null);
await tmp.close();
log('first_service_id', svcId);

// ============ DESKTOP 1440x900 ============
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pd = await ctxD.newPage();
const dErrs = [];
pd.on('console', m => { if (m.type() === 'error') dErrs.push(m.text()); });
pd.on('pageerror', e => dErrs.push('PAGEERR: ' + e.message));
await prep(pd);

// populate via events
await pd.evaluate(() => window.dispatchEvent(new CustomEvent('select-canton', { detail: 'Zürich' })));
if (svcId && svcId !== 'ERR') await pd.evaluate((id) => window.dispatchEvent(new CustomEvent('select-service', { detail: id })), svcId);
await pd.waitForTimeout(300);
// fill text fields to verify inputs work
await pd.fill('[data-testid="input-name"]', 'Hans Müller');
await pd.fill('[data-testid="input-email"]', 'hans@beispiel.ch');
await pd.fill('[data-testid="input-phone"]', '+41 79 000 00 00');
// select a car
await pd.click('[data-testid="button-car-suv"]').catch(()=>{});
await pd.waitForTimeout(200);

const dMeta = await pd.evaluate(() => {
  const round = r => r ? { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) } : null;
  const section = document.getElementById('quote');
  const panel = section.querySelector('.border.border-white\\/10');
  const inputs = ['input-name','input-email','input-phone','input-canton'].map(id => { const e = document.querySelector(`[data-testid="${id}"]`); return { id, top: e?Math.round(e.getBoundingClientRect().top):null, value: e?e.value:null }; });
  const cars = ['small','medium','suv','limousine','sport','van'].map(k => { const e = document.querySelector(`[data-testid="button-car-${k}"]`); return e ? { k, r: round(e.getBoundingClientRect()), pressed: e.getAttribute('aria-pressed') || e.getAttribute('data-state') || null } : { k, missing:true }; });
  const svcTrigger = document.querySelector('[data-testid="select-service-type"]');
  const msg = document.querySelector('[data-testid="input-message"]');
  const submit = document.querySelector('[data-testid="button-submit-quote"]');
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    section: round(section.getBoundingClientRect()),
    sectionHeight: Math.round(section.getBoundingClientRect().height),
    panel: round(panel?.getBoundingClientRect()),
    panelHeight: panel ? Math.round(panel.getBoundingClientRect().height) : null,
    inputs,
    cars,
    serviceTriggerText: svcTrigger ? svcTrigger.textContent.trim() : null,
    message: round(msg?.getBoundingClientRect()),
    submit: round(submit?.getBoundingClientRect()),
    submitExists: !!submit,
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  };
});
log('desktop_quote', dMeta);
log('desktop_horiz_overflow', dMeta.scrollW > dMeta.clientW + 1);
const dCarTops = dMeta.cars.filter(c=>c.r).map(c=>c.r.top);
log('desktop_cars_one_row', { count: dMeta.cars.filter(c=>c.r).length, sameRow: dCarTops.length===6 && (Math.max(...dCarTops)-Math.min(...dCarTops)<=4), tops: dCarTops });
const dInTops = dMeta.inputs.map(i=>i.top).filter(t=>t!=null);
log('desktop_inputs_one_row', { sameRow: dInTops.length===4 && (Math.max(...dInTops)-Math.min(...dInTops)<=4), tops: dInTops });
log('desktop_event_population', { canton: dMeta.inputs.find(i=>i.id==='input-canton')?.value, service: dMeta.serviceTriggerText, name: dMeta.inputs.find(i=>i.id==='input-name')?.value, submitExists: dMeta.submitExists, suvPressed: dMeta.cars.find(c=>c.k==='suv')?.pressed });

// close any open select and screenshot
await closeSelect(pd);
await pd.evaluate(() => { const el = document.getElementById('quote'); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY); });
await pd.waitForTimeout(300);
log('desktop_select_open_before_shot', await pd.evaluate(() => !!document.querySelector('[data-radix-popper-content-wrapper]')));
await pd.locator('#quote').screenshot({ path: '/home/runner/workspace/shots/quote-desktop.png' });
log('shot_desktop_quote', 'shots/quote-desktop.png');
log('desktop_console_errors', dErrs);
await ctxD.close();

// ============ MOBILE 390x844 ============
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const pm = await ctxM.newPage();
const mErrs = [];
pm.on('console', m => { if (m.type() === 'error') mErrs.push(m.text()); });
pm.on('pageerror', e => mErrs.push('PAGEERR: ' + e.message));
await prep(pm);

await pm.evaluate(() => window.dispatchEvent(new CustomEvent('select-canton', { detail: 'Bern' })));
if (svcId && svcId !== 'ERR') await pm.evaluate((id) => window.dispatchEvent(new CustomEvent('select-service', { detail: id })), svcId);
await pm.waitForTimeout(300);
await pm.fill('[data-testid="input-name"]', 'Hans Müller');
await pm.fill('[data-testid="input-email"]', 'hans@beispiel.ch');
await pm.fill('[data-testid="input-phone"]', '+41 79 000 00 00');
await pm.click('[data-testid="button-car-suv"]').catch(()=>{});
await pm.waitForTimeout(200);

const mMeta = await pm.evaluate(() => {
  const round = r => r ? { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) } : null;
  const section = document.getElementById('quote');
  const secR = section.getBoundingClientRect();
  const secTopDoc = secR.top + window.scrollY;
  const h2 = section.querySelector('h2');
  const p = section.querySelector('p');
  const arrow = Array.from(section.querySelectorAll('svg')).find(s => (s.getAttribute('class')||'').toLowerCase().includes('arrow'));
  // contact links (tel/mail/maps) visibility on mobile
  const links = Array.from(section.querySelectorAll('a[href^="tel"], a[href^="mailto"], a[href*="maps"]'));
  const linkVisible = links.filter(a => a.getClientRects().length>0 && getComputedStyle(a).display!=='none' && getComputedStyle(a).visibility!=='hidden').length;
  const firstInput = document.querySelector('[data-testid="input-name"]');
  const fiTopDoc = firstInput ? firstInput.getBoundingClientRect().top + window.scrollY : null;
  const canton = document.querySelector('[data-testid="input-canton"]');
  const svcTrigger = document.querySelector('[data-testid="select-service-type"]');
  const submit = document.querySelector('[data-testid="button-submit-quote"]');
  const suv = document.querySelector('[data-testid="button-car-suv"]');
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    sectionHeight: Math.round(secR.height),
    title: h2 ? { text:(h2.textContent||'').trim().slice(0,40), top: Math.round(h2.getBoundingClientRect().top) } : null,
    copyPresent: !!p, arrowCuePresent: !!arrow, arrowTop: arrow?Math.round(arrow.getBoundingClientRect().top):null,
    contactLinksVisibleCount: linkVisible, contactLinksTotal: links.length,
    sectionTopToFirstInputPx: fiTopDoc!=null ? Math.round(fiTopDoc - secTopDoc) : null,
    firstInputValue: firstInput?firstInput.value:null,
    cantonValue: canton?canton.value:null,
    serviceTriggerText: svcTrigger?svcTrigger.textContent.trim():null,
    suvPressed: suv ? (suv.getAttribute('aria-pressed')||suv.getAttribute('data-state')) : null,
    submitExists: !!submit,
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  };
});
log('mobile_quote', mMeta);
log('mobile_horiz_overflow', mMeta.scrollW > mMeta.clientW + 1);

await closeSelect(pm);
await pm.evaluate(() => { const el = document.getElementById('quote'); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY); });
await pm.waitForTimeout(300);
await pm.screenshot({ path: '/home/runner/workspace/shots/quote-mobile.png' });
log('shot_mobile_quote', 'shots/quote-mobile.png');
log('mobile_console_errors', mErrs);
await ctxM.close();

await browser.close();
fs.writeFileSync('/home/runner/workspace/shots/quote-focus-results.json', JSON.stringify(R, null, 2));
console.log('DONE');
