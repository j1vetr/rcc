import { chromium } from 'playwright-core';
const EXEC='/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox','--disable-dev-shm-usage']});
const c=await b.newContext({viewport:{width:1440,height:900}});
const p=await c.newPage();
await p.goto('http://localhost:21416/',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
await p.locator('[data-testid="why-rcc-cinematic-image"]').scrollIntoViewIfNeeded();
await p.mouse.move(5,5); await p.waitForTimeout(300);
for (const n of [2,0,3,1]) {
  // click and immediately read active button (state update is synchronous with React commit ~<50ms)
  const r = await p.evaluate((n)=>{
    document.querySelector(`[data-testid="button-why-${n}"]`).click();
    const btns=[0,1,2,3].map(k=>({k,active:document.querySelector(`[data-testid="button-why-${k}"]`).className.includes('bg-primary')}));
    return {clicked:n};
  }, n);
  await p.waitForTimeout(60);
  const st = await p.evaluate((n)=>{
    const active=[0,1,2,3].filter(k=>document.querySelector(`[data-testid="button-why-${k}"]`).className.includes('bg-primary'));
    const feat=document.querySelector('[data-testid="why-rcc-cinematic-image"]');
    const featLabel=[...feat.querySelectorAll('span')].map(s=>s.textContent).find(t=>/Feature 0\d/.test(t));
    return {clicked:n, activeButtons:active, featLabel};
  }, n);
  console.log(JSON.stringify(st));
}
await b.close();
