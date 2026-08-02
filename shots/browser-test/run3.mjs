import { chromium } from 'playwright-core';
import fs from 'node:fs';
const BASE = 'http://localhost:21416/';
const OUT = '/home/runner/workspace/shots/browser-test';
const EXE = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const out = {};

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });

// ---- Desktop: canvas element correctness + graceful GL failure ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  const benignRe = [/vite/i,/react-devtools/i,/WebGL/i,/THREE\./i,/performance/i];
  page.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: '+String(e.message||e)));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForSelector('canvas', { timeout: 15000 });
  await page.waitForTimeout(1000);
  // scroll into flythrough
  await page.evaluate(() => {
    const c = document.querySelector('canvas'); let el=c?c.parentElement:null, s=null;
    while(el){const r=el.getBoundingClientRect(); if(r.height>window.innerHeight*2){s=el;break;} el=el.parentElement;}
    if(s){const r=s.getBoundingClientRect(); window.scrollTo(0, r.top+window.scrollY + (r.height-window.innerHeight)*0.2);}
  });
  await page.waitForTimeout(800);
  out.desktopCanvas = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const r = c.getBoundingClientRect();
    // is it inside a visible (not display:none) tree?
    let vis=true,n=c; while(n){if(getComputedStyle(n).display==='none'){vis=false;break;}n=n.parentElement;}
    return { present:!!c, cssW:Math.round(r.width), cssH:Math.round(r.height), bufW:c.width, bufH:c.height, inVisibleTree:vis };
  });
  out.desktopErrors = { total: errs.length, nonBenign: errs.filter(t=>!benignRe.some(r=>r.test(t))) };
  await ctx.close();
}

// ---- BeforeAfter: definitive drag via real PointerEvents dispatch ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const slider = page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const dragTo = async (fracFrom, fracTo) => {
    return await page.evaluate(({fracFrom, fracTo}) => {
      const s = document.querySelector('[data-testid="beforeafter-slider"]');
      const r = s.getBoundingClientRect();
      const xFrom = r.left + r.width*fracFrom;
      const xTo = r.left + r.width*fracTo;
      const y = r.top + r.height/2;
      const read = () => {
        const dirty = s.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
        return { v: s.getAttribute('aria-valuenow'), clip: dirty?dirty.style.clipPath:null };
      };
      const before = read();
      const opts = (x, buttons) => ({ pointerId:1, pointerType:'mouse', bubbles:true, cancelable:true, clientX:x, clientY:y, buttons });
      s.dispatchEvent(new PointerEvent('pointerdown', opts(xFrom, 1)));
      const steps = 12;
      for (let i=1;i<=steps;i++){ const x = xFrom + (xTo-xFrom)*(i/steps); s.dispatchEvent(new PointerEvent('pointermove', opts(x, 1))); }
      const mid = read();
      s.dispatchEvent(new PointerEvent('pointerup', opts(xTo, 0)));
      const after = read();
      return { before, mid, after };
    }, {fracFrom, fracTo});
  };

  const left = await dragTo(0.58, 0.25);
  await page.screenshot({ path: `${OUT}/desktop-beforeafter-mid-drag.png` });
  const right = await dragTo(0.25, 0.80);

  // keyboard
  await slider.focus();
  const kFocus = await page.evaluate(()=>document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft');
  const kL = await page.evaluate(()=>document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowRight');
  const kR = await page.evaluate(()=>document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));

  out.beforeAfter = {
    dragLeft: { from: left.before.v, mid: left.mid.v, after: left.after.v, clipFrom: left.before.clip, clipAfter: left.after.clip, moved: left.before.v !== left.after.v },
    dragRight: { from: right.before.v, after: right.after.v, moved: right.before.v !== right.after.v },
    keyboard: { focus: kFocus, afterLeft: kL, afterRight: kR, worked: kFocus!==kL && kL!==kR },
  };
  await ctx.close();
}

// ---- Mobile: touch drag on BeforeAfter using dispatched touch/pointer ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const slider = page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const touchDrag = await page.evaluate(() => {
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const r = s.getBoundingClientRect();
    const y = r.top + r.height/2;
    const xFrom = r.left + r.width*0.58, xTo = r.left + r.width*0.22;
    const read = () => s.getAttribute('aria-valuenow');
    const before = read();
    const opt = (x,buttons) => ({pointerId:2, pointerType:'touch', isPrimary:true, bubbles:true, cancelable:true, clientX:x, clientY:y, buttons});
    s.dispatchEvent(new PointerEvent('pointerdown', opt(xFrom,1)));
    for(let i=1;i<=10;i++){const x=xFrom+(xTo-xFrom)*(i/10); s.dispatchEvent(new PointerEvent('pointermove', opt(x,1)));}
    s.dispatchEvent(new PointerEvent('pointerup', opt(xTo,0)));
    return { before, after: read() };
  });
  out.mobileBeforeAfter = { ...touchDrag, moved: touchDrag.before !== touchDrag.after };
  await page.screenshot({ path: `${OUT}/mobile-beforeafter.png` });

  // floating buttons overlap check vs slider
  out.mobileFloating = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a,button'));
    const wa = all.find(e => /wa\.me|whatsapp/i.test(e.getAttribute('href')||'') || /whatsapp/i.test(e.getAttribute('aria-label')||''));
    // assistant: look for fixed-position buttons bottom-right besides WA
    const fixed = all.filter(e => { const cs=getComputedStyle(e); return cs.position==='fixed'; }).map(e=>{const r=e.getBoundingClientRect(); return {label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,20), x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}).filter(f=>f.w>10&&f.h>10);
    const rectOf = e => { if(!e) return null; const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}; };
    const s = document.querySelector('[data-testid="beforeafter-slider"]');
    const sr = s.getBoundingClientRect();
    return { whatsappRect: rectOf(wa), fixedButtons: fixed, sliderRect:{x:Math.round(sr.x),y:Math.round(sr.y),w:Math.round(sr.width),h:Math.round(sr.height)}, vw:window.innerWidth, vh:window.innerHeight };
  });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(`${OUT}/results3.json`, JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
