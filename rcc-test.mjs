import { chromium } from 'playwright-core';
import fs from 'node:fs';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const results = {};
const log = (k, v) => { results[k] = v; console.log(`[${k}]`, typeof v === 'object' ? JSON.stringify(v) : v); };

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

async function overflowInfo(page) {
  return await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
}

// ===================== MOBILE =====================
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctxM.newPage();
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 3. metadata
log('mobile_title', await page.title());
log('mobile_description', await page.$eval('meta[name="description"]', el => el.content).catch(() => null));
const jsonld = await page.evaluate(() => {
  const s = document.querySelector('script[type="application/ld+json"]');
  if (!s) return null;
  try { const j = JSON.parse(s.textContent); return { exists: true, type: j['@type'], name: j.name }; }
  catch { return { exists: true, parseError: true }; }
});
log('mobile_jsonld', jsonld);

// 4. favicon
const favStatus = await page.evaluate(async (b) => (await fetch(b + '/favicon.png')).status, BASE);
log('favicon_status', favStatus);

// 5. overflow (menu closed)
log('mobile_overflow_closed', await overflowInfo(page));

// 6. open menu
await page.click('[data-testid="button-mobile-menu"]');
await page.waitForTimeout(600);

// 7. overlay rect + bg + body overflow
const overlay = await page.evaluate(() => {
  // the overlay is the motion.div with fixed inset-0 bg-[#070707]
  const candidates = Array.from(document.querySelectorAll('nav div'));
  const el = candidates.find(d => {
    const cs = getComputedStyle(d);
    return cs.position === 'fixed' && d.className.includes('inset-0') && d.className.includes('#070707');
  });
  if (!el) return { found: false };
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return { found: true, rect: { x: r.x, y: r.y, width: r.width, height: r.height }, bg: cs.backgroundColor, opacity: cs.opacity };
});
log('mobile_overlay', overlay);
log('mobile_body_overflow', await page.evaluate(() => getComputedStyle(document.body).overflow));

async function vis(sel) {
  const el = await page.$(sel);
  if (!el) return { sel, exists: false };
  const visible = await el.isVisible();
  const text = (await el.textContent() || '').trim();
  return { sel, exists: true, visible, text };
}
const items = {};
for (const s of [
  '[data-testid="link-how-it-works-mobile"]',
  '[data-testid="link-locations-mobile"]',
  '[data-testid="link-services-mobile"]',
  '[data-testid="button-whatsapp-mobile-menu"]',
  '[data-testid="button-quote-mobile-menu"]',
]) items[s] = await vis(s);
log('mobile_menu_items', items);

// phone/email/address visibility by text
const contacts = await page.evaluate(() => {
  const q = (t) => Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes(t));
  const info = (a) => a ? { found: true, visible: !!(a.offsetParent || a.getClientRects().length), href: a.getAttribute('href') } : { found: false };
  return {
    phone: info(q('+41 78 880 38 84')),
    email: info(q('Info@royalcarcleaning.ch')),
    address: info(q('Wechselächerstrasse 25, 8103 Zürich')),
  };
});
log('mobile_contacts', contacts);

// 8. whatsapp href
log('whatsapp_href', await page.$eval('[data-testid="button-whatsapp-mobile-menu"]', el => el.getAttribute('href')));

// 9. screenshot
fs.mkdirSync('/home/runner/workspace/shots', { recursive: true });
await page.screenshot({ path: '/home/runner/workspace/shots/mobile-menu-open.png' });
log('screenshot', 'shots/mobile-menu-open.png');

// 12. language switcher flag (while menu open, switcher is in nav)
const flag = await page.evaluate(() => {
  const btn = document.querySelector('[data-testid="button-language-switcher"]');
  if (!btn) return { found: false };
  const img = btn.querySelector('img');
  const emojiRe = /[\u{1F1E6}-\u{1F1FF}]/u;
  const hasEmoji = emojiRe.test(btn.textContent || '');
  return { found: true, isImg: !!img, src: img ? img.getAttribute('src') : null, currentSrc: img ? img.currentSrc : null, emojiText: hasEmoji, btnText: (btn.textContent||'').trim() };
});
log('mobile_flag', flag);

// 10. click quote
await page.click('[data-testid="button-quote-mobile-menu"]');
await page.waitForTimeout(1200);

// 11. menu closed + quote targeted
const afterQuote = await page.evaluate(() => {
  const candidates = Array.from(document.querySelectorAll('nav div'));
  const el = candidates.find(d => { const cs = getComputedStyle(d); return cs.position === 'fixed' && d.className.includes('#070707'); });
  const overlayVisible = el ? (el.offsetParent !== null || el.getClientRects().length > 0) && getComputedStyle(el).opacity !== '0' : false;
  const quote = document.getElementById('quote');
  const qr = quote ? quote.getBoundingClientRect() : null;
  return {
    overlayPresent: !!el,
    overlayVisible,
    bodyOverflow: getComputedStyle(document.body).overflow,
    quoteExists: !!quote,
    quoteTop: qr ? Math.round(qr.top) : null,
    innerHeight: window.innerHeight,
  };
});
log('mobile_after_quote', afterQuote);

// 13/14 footer
const footer = await page.evaluate(() => {
  const f = document.querySelector('footer');
  const cp = Array.from(f.querySelectorAll('p')).map(p => p.textContent.trim());
  return { copyrightCandidates: cp, fullText: f.textContent.replace(/\s+/g, ' ').trim() };
});
log('mobile_footer', footer);

await ctxM.close();

// ===================== DESKTOP =====================
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pageD = await ctxD.newPage();
await pageD.goto(BASE + '/', { waitUntil: 'networkidle' });
await pageD.waitForTimeout(800);

log('desktop_overflow', await overflowInfo(pageD));

const dFooter = await pageD.evaluate(() => {
  const f = document.querySelector('footer');
  return { fullText: f.textContent.replace(/\s+/g, ' ').trim() };
});
log('desktop_footer', dFooter);

const dFlag = await pageD.evaluate(() => {
  const btn = document.querySelector('[data-testid="button-language-switcher"]');
  if (!btn) return { found: false };
  const img = btn.querySelector('img');
  const emojiRe = /[\u{1F1E6}-\u{1F1FF}]/u;
  return { found: true, isImg: !!img, src: img ? img.getAttribute('src') : null, currentSrc: img ? img.currentSrc : null, emojiText: emojiRe.test(btn.textContent||''), btnText: (btn.textContent||'').trim() };
});
log('desktop_flag', dFlag);

log('console_errors', consoleErrors);

await ctxD.close();
await browser.close();
fs.writeFileSync('/home/runner/workspace/shots/results.json', JSON.stringify(results, null, 2));
console.log('DONE');
