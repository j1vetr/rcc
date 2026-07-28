import { chromium } from 'playwright-core';
const EXEC='/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox','--disable-dev-shm-usage']});
const c=await b.newContext({viewport:{width:390,height:844}});
const p=await c.newPage();
await p.goto('http://localhost:21416/',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);
const info=await p.evaluate(()=>{
  const btn=document.querySelector('[data-testid="button-mobile-menu"]');
  const all=Array.from(document.querySelectorAll('[data-testid]')).map(e=>e.getAttribute('data-testid'));
  return {btnExists:!!btn, btnVisible: btn?(btn.offsetParent!==null):null, btnRect: btn?btn.getBoundingClientRect():null, testids: all.slice(0,40)};
});
console.log(JSON.stringify(info,null,2));
await b.close();
