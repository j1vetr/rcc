import { chromium } from 'playwright-core';
const EXEC='/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox','--disable-dev-shm-usage']});
const c=await b.newContext({viewport:{width:1440,height:900}});
const p=await c.newPage();
await p.goto('http://localhost:21416/',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
await p.locator('[data-testid="why-rcc-cinematic-image"]').scrollIntoViewIfNeeded();
await p.mouse.move(5,5); await p.waitForTimeout(300);
const check = async (n) => {
  await p.click(`[data-testid="button-why-${n}"]`);
  // read within 250ms, before next 3600ms autoplay tick
  const r = await p.evaluate((n)=>{
    const btn=document.querySelector(`[data-testid="button-why-${n}"]`);
    const img=document.querySelector('[data-testid^="why-rcc-image-"]');
    return { btnActive: getComputedStyle(btn).backgroundColor, imgTestid: img?.getAttribute('data-testid'), src:(img?.getAttribute('src')||'').split('/').pop() };
  }, n);
  console.log(`click button-why-${n} ->`, JSON.stringify(r));
};
await check(3); await p.mouse.move(5,5); await p.waitForTimeout(200);
await check(0); await p.mouse.move(5,5); await p.waitForTimeout(200);
await check(2);
await b.close();
