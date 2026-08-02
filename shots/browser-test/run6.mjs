import { chromium } from 'playwright-core';
const BASE='http://localhost:21416/';
const OUT='/home/runner/workspace/shots/browser-test';
const EXE=process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});

async function dismissOverlay(page){
  // The runtime-error-modal renders in a plugin element; press Escape a few times & remove any overlay node
  for(let i=0;i<3;i++){ await page.keyboard.press('Escape'); await page.waitForTimeout(150); }
  await page.evaluate(()=>{
    document.querySelectorAll('vite-error-overlay, plugin-runtime-error-plugin, [class*="runtime-error"], #vite-error-overlay').forEach(n=>n.remove());
    // the replit modal often mounts in a specific container:
    Array.from(document.querySelectorAll('div')).forEach(d=>{ if(/runtime-error-plugin/i.test(d.textContent||'') && d.getBoundingClientRect().width>800){ d.style.display='none'; }});
  });
}

async function toFly(page, frac){
  await page.evaluate((frac)=>{
    const c=document.querySelector('canvas'); let el=c?c.parentElement:null,s=null;
    while(el){const r=el.getBoundingClientRect(); if(r.height>window.innerHeight*2){s=el;break;} el=el.parentElement;}
    if(s){const r=s.getBoundingClientRect(); window.scrollTo(0, r.top+window.scrollY+(r.height-window.innerHeight)*frac);}
  },frac);
}

const ctx=await browser.newContext({viewport:{width:1440,height:900}});
const page=await ctx.newPage();
await page.goto(BASE,{waitUntil:'load'});
await page.waitForSelector('canvas',{timeout:15000});
await page.waitForTimeout(1000);
await dismissOverlay(page);

await toFly(page,0.2); await page.waitForTimeout(600); await dismissOverlay(page); await page.waitForTimeout(300);
await page.screenshot({path:`${OUT}/desktop-flythrough-early-20.png`});
await toFly(page,0.6); await page.waitForTimeout(600); await dismissOverlay(page); await page.waitForTimeout(300);
await page.screenshot({path:`${OUT}/desktop-flythrough-mid-60.png`});
await toFly(page,1.0); await page.waitForTimeout(700); await dismissOverlay(page); await page.waitForTimeout(400);
await page.screenshot({path:`${OUT}/desktop-flythrough-end-100.png`});

// before/after with keyboard-moved wipe (keyboard confirmed working) for a clear moved-state screenshot
const slider=page.locator('[data-testid="beforeafter-slider"]');
await slider.scrollIntoViewIfNeeded();
await page.waitForTimeout(400); await dismissOverlay(page);
await slider.focus();
for(let i=0;i<6;i++){ await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(40);}
const v=await page.evaluate(()=>document.querySelector('[data-testid="beforeafter-slider"]').getAttribute('aria-valuenow'));
console.log('beforeafter valuenow for screenshot:', v);
await slider.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({path:`${OUT}/desktop-beforeafter-mid-drag.png`, clip: await slider.boundingBox().then(b=>({x:Math.max(0,b.x-20),y:Math.max(0,b.y-60),width:Math.min(1440,b.width+40),height:b.height+120}))});

await ctx.close();

// mobile flythrough fallback (no overlay expected since no canvas rendered on mobile => no THREE error)
const mctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const mp=await mctx.newPage();
await mp.goto(BASE,{waitUntil:'load'});
await mp.waitForTimeout(2000);
await mp.evaluate(()=>{const i=Array.from(document.querySelectorAll('img')).find(x=>/flythrough-interior/.test(x.currentSrc||x.src)); if(i)i.scrollIntoView({block:'center'});});
await mp.waitForTimeout(700);
await mp.screenshot({path:`${OUT}/mobile-flythrough-fallback.png`});
await mctx.close();

await browser.close();
console.log('done');
