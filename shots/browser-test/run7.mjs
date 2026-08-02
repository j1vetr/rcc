import { chromium } from 'playwright-core';
const BASE='http://localhost:21416/';
const OUT='/home/runner/workspace/shots/browser-test';
const EXE=process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});

// Mobile: dismiss overlay, capture clean fallback + before/after
const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const page=await ctx.newPage();
await page.goto(BASE,{waitUntil:'load'});
await page.waitForTimeout(1800);

async function killOverlay(){
  for(let i=0;i<4;i++){await page.keyboard.press('Escape'); await page.waitForTimeout(120);}
  await page.evaluate(()=>{
    // Replit runtime error modal mounts custom element / high-z div
    document.querySelectorAll('vite-error-overlay').forEach(n=>n.remove());
    Array.from(document.querySelectorAll('body *')).forEach(el=>{
      const cs=getComputedStyle(el);
      if((cs.position==='fixed'||cs.position==='absolute') && parseInt(cs.zIndex||'0')>=9999 && /runtime-error-plugin|WebGLRenderer/i.test(el.textContent||'')){ el.remove(); }
    });
  });
}
await killOverlay();
await page.waitForTimeout(300);

// fallback panel
await page.evaluate(()=>{const i=Array.from(document.querySelectorAll('img')).find(x=>/flythrough-interior/.test(x.currentSrc||x.src)); if(i)i.scrollIntoView({block:'center'});});
await page.waitForTimeout(500); await killOverlay(); await page.waitForTimeout(300);
const fb=await page.evaluate(()=>{const i=Array.from(document.querySelectorAll('img')).find(x=>/flythrough-interior/.test(x.currentSrc||x.src)); return i?{visible:i.offsetParent!==null, kb:/kenburns/.test(i.className)}:null;});
console.log('mobile fallback img:', JSON.stringify(fb));
await page.screenshot({path:`${OUT}/mobile-flythrough-fallback.png`});

// before/after mobile - drag then screenshot
const slider=page.locator('[data-testid="beforeafter-slider"]');
await slider.scrollIntoViewIfNeeded();
await page.waitForTimeout(400); await killOverlay();
const box=await slider.boundingBox();
const cy=box.y+box.height/2;
await page.mouse.move(box.x+box.width*0.58,cy); await page.mouse.down();
for(let f=0.58;f>=0.30;f-=0.05){await page.mouse.move(box.x+box.width*f,cy); await page.waitForTimeout(20);}
await page.mouse.up();
const v=await page.evaluate(()=>document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
console.log('mobile beforeafter valuenow:', v);
await slider.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await killOverlay();
await page.screenshot({path:`${OUT}/mobile-beforeafter.png`});
await browser.close();
console.log('done');
