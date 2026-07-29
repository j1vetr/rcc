import { chromium } from 'playwright-core';
import fs from 'node:fs';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const SHOTS = '/home/runner/workspace/shots';
fs.mkdirSync(SHOTS, { recursive: true });

const R = {};
const log = (k, v) => { R[k] = v; console.log(`[${k}]`, typeof v === 'object' ? JSON.stringify(v) : v); };
const round = r => r ? { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) } : null;

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

async function collectErrors(page, bucket) {
  page.on('console', m => { if (m.type() === 'error') bucket.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', e => bucket.push('PAGEERR: ' + e.message));
}

async function goPrep(page) {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="button-open-assistant"]', { timeout: 20000 });
  await page.waitForTimeout(800);
}

// ============================================================
// DESKTOP 1440x900
// ============================================================
async function runViewport(name, viewport) {
  const errs = [];
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await collectErrors(page, errs);
  await goPrep(page);

  const isMobile = viewport.width < 768;
  const P = name; // prefix

  // ---- MAP: exactly one aria-pressed=true without clicking ----
  await page.evaluate(() => document.getElementById('locations')?.scrollIntoView());
  await page.waitForTimeout(700);
  const pressed = await page.$$eval('[data-testid^="button-canton-"]', els =>
    els.filter(e => e.getAttribute('aria-pressed') === 'true').map(e => e.getAttribute('data-testid')));
  log(`${P}_map_pressed_count`, pressed.length);
  log(`${P}_map_pressed_which`, pressed);

  // confirmation card visible
  const confirmBtn = await page.$('[data-testid="button-confirm-canton"]');
  const cardVisible = confirmBtn ? await confirmBtn.isVisible() : false;
  const selectedName = await page.$eval('#locations .text-primary.truncate', e => e.textContent.trim()).catch(() => null);
  log(`${P}_confirm_card_visible`, cardVisible);
  log(`${P}_selected_name`, selectedName);

  // click confirm -> populates QuoteForm canton + scrolls
  const cantonBefore = await page.$eval('[data-testid="input-canton"]', e => e.value).catch(() => null);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await confirmBtn.click();
  await page.waitForTimeout(1200);
  const cantonAfter = await page.$eval('[data-testid="input-canton"]', e => e.value).catch(() => null);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  const quoteInView = await page.evaluate(() => {
    const el = document.getElementById('quote'); if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  });
  log(`${P}_canton_before`, cantonBefore);
  log(`${P}_canton_after`, cantonAfter);
  log(`${P}_canton_populated`, !!cantonAfter && cantonAfter.length > 0);
  log(`${P}_scroll_changed`, scrollAfter !== scrollBefore);
  log(`${P}_quote_in_view_after_confirm`, quoteInView);

  // ---- Launchers position: assistant bottom-left, whatsapp bottom-right, no overlap ----
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const launchers = await page.evaluate(() => {
    const round = r => ({ l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) });
    const a = document.querySelector('[data-testid="button-open-assistant"]');
    const w = document.querySelector('[data-testid="button-floating-whatsapp"]');
    return {
      assistant: round(a.getBoundingClientRect()),
      whatsapp: round(w.getBoundingClientRect()),
      vw: window.innerWidth,
      docW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });
  const a = launchers.assistant, w = launchers.whatsapp;
  const overlap = !(a.r <= w.l || w.r <= a.l || a.b <= w.t || w.b <= a.t);
  log(`${P}_assistant_launcher_rect`, a);
  log(`${P}_whatsapp_launcher_rect`, w);
  log(`${P}_assistant_is_bottom_left`, a.l < launchers.vw / 2 && a.b > launchers.vw ? true : (a.l < launchers.vw/2 && a.b > (viewport.height*0.5)));
  log(`${P}_assistant_left_of_center`, a.l < launchers.vw / 2);
  log(`${P}_whatsapp_right_of_center`, w.r > launchers.vw / 2);
  log(`${P}_launchers_overlap`, overlap);
  log(`${P}_no_horizontal_overflow`, launchers.docW <= launchers.clientW + 1);
  log(`${P}_overflow_detail`, { docW: launchers.docW, clientW: launchers.clientW });

  // ---- Open assistant ----
  await page.click('[data-testid="button-open-assistant"]');
  await page.waitForTimeout(600);
  const panel = await page.$('[data-testid="rcc-assistant-panel"]');
  log(`${P}_panel_opened`, !!panel && await panel.isVisible());
  const panelRect = await panel.evaluate(el => {
    const r = el.getBoundingClientRect();
    return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height), vw: window.innerWidth, vh: window.innerHeight };
  });
  log(`${P}_panel_rect`, panelRect);
  // desktop floating card: not full-width, positioned left. mobile drawer: full-width, bottom-anchored
  if (isMobile) {
    log(`${P}_panel_is_bottom_drawer`, Math.abs(panelRect.w - panelRect.vw) < 3 && Math.abs(panelRect.b - panelRect.vh) < 3);
  } else {
    log(`${P}_panel_is_floating_card`, panelRect.w < panelRect.vw * 0.6 && panelRect.l < panelRect.vw * 0.5 && panelRect.b < panelRect.vh);
  }

  // exactly 20 FAQ buttons
  const faqCount = await page.$$eval('[data-testid^="button-faq-"]', els => els.length);
  log(`${P}_faq_button_count`, faqCount);

  // focus behavior after open (first focusable should be focused)
  const focusedAfterOpen = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || document.activeElement?.tagName);
  log(`${P}_focus_after_open`, focusedAfterOpen);

  // Screenshot for mobile assistant-open
  if (isMobile) {
    await page.screenshot({ path: `${SHOTS}/m-assistant-open.png` });
    log(`${P}_screenshot`, `${SHOTS}/m-assistant-open.png`);
  }

  // click a FAQ question -> answer shows
  const firstQ = await page.$eval('[data-testid="button-faq-1"]', e => e.textContent.trim());
  await page.click('[data-testid="button-faq-1"]');
  await page.waitForTimeout(500);
  const backBtn = await page.$('[data-testid="button-assistant-back"]');
  const answerShown = await page.evaluate(() => {
    const p = document.querySelector('[data-testid="rcc-assistant-panel"]');
    // answer is inside the .leading-7 paragraph
    const ans = p?.querySelector('p.leading-7');
    return ans ? ans.textContent.trim().slice(0, 60) : null;
  });
  log(`${P}_faq1_question`, firstQ.slice(0, 50));
  log(`${P}_answer_shown_on_question`, !!backBtn && !!answerShown);
  log(`${P}_answer_preview`, answerShown);

  // back works
  await backBtn.click();
  await page.waitForTimeout(400);
  const backToList = await page.$$eval('[data-testid^="button-faq-"]', els => els.length);
  log(`${P}_back_returns_to_list`, backToList === 20);

  // quote CTA scrolls + closes
  await page.click('[data-testid="button-faq-2"]');
  await page.waitForTimeout(400);
  const scrollB = await page.evaluate(() => window.scrollY);
  // quote CTA is the btn-gold-luxury in panel
  await page.evaluate(() => {
    const p = document.querySelector('[data-testid="rcc-assistant-panel"]');
    const btn = p?.querySelector('button.btn-gold-luxury');
    btn?.click();
  });
  await page.waitForTimeout(1200);
  const panelAfterCta = await page.$('[data-testid="rcc-assistant-panel"]');
  const quoteInViewCta = await page.evaluate(() => {
    const el = document.getElementById('quote'); if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  });
  log(`${P}_quote_cta_closed_panel`, !panelAfterCta);
  log(`${P}_quote_cta_scrolled_to_quote`, quoteInViewCta);

  // reopen -> test close button
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('[data-testid="button-open-assistant"]');
  await page.waitForTimeout(500);
  await page.click('[data-testid="button-close-assistant"]');
  await page.waitForTimeout(500);
  const closedByBtn = !(await page.$('[data-testid="rcc-assistant-panel"]'));
  const focusAfterClose = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || document.activeElement?.tagName);
  log(`${P}_close_button_works`, closedByBtn);
  log(`${P}_focus_returns_to_launcher_after_close`, focusAfterClose);

  // reopen -> Escape closes
  await page.click('[data-testid="button-open-assistant"]');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const closedByEsc = !(await page.$('[data-testid="rcc-assistant-panel"]'));
  log(`${P}_escape_closes`, closedByEsc);

  log(`${P}_console_errors`, errs);
  await ctx.close();
  return errs;
}

const desktopErrs = await runViewport('D', { width: 1440, height: 900 });
const mobileErrs = await runViewport('M', { width: 390, height: 844 });

// ============================================================
// LANGUAGE SWITCH DE->FR->EN on assistant content (desktop)
// ============================================================
{
  const errs = [];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await collectErrors(page, errs);
  await goPrep(page);

  async function assistantSnapshot() {
    await page.click('[data-testid="button-open-assistant"]');
    await page.waitForTimeout(500);
    const data = await page.evaluate(() => {
      const p = document.querySelector('[data-testid="rcc-assistant-panel"]');
      const title = p?.querySelector('#rcc-assistant-title')?.textContent.trim();
      const greeting = p?.querySelector('p.font-serif')?.textContent.trim();
      const q1 = p?.querySelector('[data-testid="button-faq-1"]')?.textContent.trim();
      return { title, greeting, q1 };
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    return data;
  }

  async function setLang(code) {
    await page.click('[data-testid="button-language-switcher"]');
    await page.waitForTimeout(300);
    await page.click(`[data-testid="button-lang-${code}"]`);
    await page.waitForTimeout(500);
  }

  await setLang('de');
  const de = await assistantSnapshot();
  await setLang('fr');
  const fr = await assistantSnapshot();
  await setLang('en');
  const en = await assistantSnapshot();

  log('lang_de', de);
  log('lang_fr', fr);
  log('lang_en', en);
  log('lang_de_fr_differ', JSON.stringify(de) !== JSON.stringify(fr));
  log('lang_fr_en_differ', JSON.stringify(fr) !== JSON.stringify(en));
  log('lang_content_changes', (de.q1 !== fr.q1) && (fr.q1 !== en.q1));
  log('lang_console_errors', errs);
  await ctx.close();
}

// ============================================================
// Desktop map screenshot
// ============================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await goPrep(page);
  await page.evaluate(() => document.getElementById('locations')?.scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${SHOTS}/d-map.png` });
  log('desktop_map_screenshot', `${SHOTS}/d-map.png`);
  await ctx.close();
}

log('ALL_CONSOLE_ERRORS', { desktop: desktopErrs, mobile: mobileErrs });
fs.writeFileSync(`${SHOTS}/assistant-results.json`, JSON.stringify(R, null, 2));
await browser.close();
console.log('\n=== DONE ===');
