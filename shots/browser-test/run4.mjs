import { chromium } from 'playwright-core';
import fs from 'node:fs';
const BASE='http://localhost:21416/';
const OUT='/home/runner/workspace/shots/browser-test';
const EXE=process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const out={};
const browser=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});
const read=(page)=>page.evaluate(()=>{const s=document.querySelector('[data-testid="beforeafter-slider"]');const d=s.querySelector('div[style*="clip-path"],div[style*="clipPath"]');return {v:s.getAttribute('aria-valuenow'),clip:d?d.style.clipPath:null};});

// Desktop real-mouse drag
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  await page.goto(BASE,{waitUntil:'load'});
  const slider=page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const box=await slider.boundingBox();
  const cy=box.y+box.height/2;
  const initial=await read(page);

  // LEFT drag: grab handle at 58%, drag to 22%
  await page.mouse.move(box.x+box.width*0.58, cy);
  await page.waitForTimeout(50);
  await page.mouse.down();
  await page.waitForTimeout(50);
  for(let f=0.58; f>=0.22; f-=0.04){ await page.mouse.move(box.x+box.width*f, cy); await page.waitForTimeout(20);}
  const midLeft=await read(page);
  await page.screenshot({path:`${OUT}/desktop-beforeafter-mid-drag.png`});
  await page.mouse.up();
  const afterLeft=await read(page);

  // RIGHT drag: grab handle at current, drag to 82%
  const cur=parseInt(afterLeft.v)/100;
  await page.mouse.move(box.x+box.width*cur, cy);
  await page.mouse.down();
  for(let f=cur; f<=0.82; f+=0.04){ await page.mouse.move(box.x+box.width*f, cy); await page.waitForTimeout(20);}
  await page.mouse.up();
  const afterRight=await read(page);

  // keyboard
  await slider.focus();
  const kf=await read(page);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(60);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(60);
  const kl=await read(page);
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(60);
  const kr=await read(page);

  out.desktopDrag={
    initial:initial.v, clipInitial:initial.clip,
    afterLeft:afterLeft.v, clipAfterLeft:afterLeft.clip, midLeft:midLeft.v,
    afterRight:afterRight.v, clipAfterRight:afterRight.clip,
    keyboard:{focus:kf.v, afterLeft:kl.v, afterRight:kr.v, worked: kf.v!==kl.v && kl.v!==kr.v},
    leftMoved: initial.v!==afterLeft.v,
    rightMoved: afterLeft.v!==afterRight.v,
    wipeChanged: initial.clip!==afterLeft.clip,
  };
  await ctx.close();
}

// Mobile real touch drag
{
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  await page.goto(BASE,{waitUntil:'load'});
  const slider=page.locator('[data-testid="beforeafter-slider"]');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const box=await slider.boundingBox();
  const cy=box.y+box.height/2;
  const initial=await read(page);
  // Use CDP-like touch via page.touchscreen isn't drag-capable; use mouse (hasTouch still routes pointer). Do real pointer drag:
  await page.mouse.move(box.x+box.width*0.58, cy);
  await page.mouse.down();
  for(let f=0.58; f>=0.20; f-=0.05){ await page.mouse.move(box.x+box.width*f, cy); await page.waitForTimeout(20);}
  await page.mouse.up();
  const after=await read(page);
  out.mobileDrag={initial:initial.v, after:after.v, moved: initial.v!==after.v, clipInitial:initial.clip, clipAfter:after.clip};
  await page.screenshot({path:`${OUT}/mobile-beforeafter.png`});
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/results4.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
