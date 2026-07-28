import { chromium } from 'playwright-core';
const EXEC='/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox','--disable-dev-shm-usage']});
const c=await b.newContext({viewport:{width:1440,height:900}});
const p=await c.newPage();
await p.goto('http://localhost:21416/',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
await p.locator('[data-testid="why-rcc-cinematic-image"]').scrollIntoViewIfNeeded();
await p.mouse.move(5,5); await p.waitForTimeout(300);
const snap = async (label) => {
  const r = await p.evaluate(()=>{
    const imgs=[...document.querySelectorAll('[data-testid^="why-rcc-image-"]')].map(i=>({tid:i.getAttribute('data-testid'),src:(i.getAttribute('src')||'').split('/').pop(),opacity:getComputedStyle(i).opacity}));
    const btns=[0,1,2,3].map(n=>{const btn=document.querySelector(`[data-testid="button-why-${n}"]`);return {n,active:btn.className.includes('bg-primary')};});
    const feat=document.querySelector('[data-testid="why-rcc-cinematic-image"]');
    const featLabel=[...feat.querySelectorAll('span')].map(s=>s.textContent).find(t=>/Feature 0\d/.test(t));
    return {imgs,btns,featLabel};
  });
  console.log(label, JSON.stringify(r));
};
await p.click('[data-testid="button-why-3"]'); await p.waitForTimeout(700); await snap('after click3:');
await p.click('[data-testid="button-why-1"]'); await p.waitForTimeout(700); await snap('after click1:');
await b.close();
