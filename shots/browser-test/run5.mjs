import { chromium } from 'playwright-core';
const BASE='http://localhost:21416/';
const EXE=process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1440,height:900}});
const page=await ctx.newPage();
await page.goto(BASE,{waitUntil:'load'});
const slider=page.locator('[data-testid="beforeafter-slider"]');
await slider.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

// instrument: capture buttons on every pointermove
await page.evaluate(()=>{
  window.__moves=[];
  const s=document.querySelector('[data-testid="beforeafter-slider"]');
  s.addEventListener('pointermove',e=>window.__moves.push({buttons:e.buttons, x:Math.round(e.clientX), type:e.pointerType}),true);
});

const box=await slider.boundingBox();
const cy=box.y+box.height/2;
await page.mouse.move(box.x+box.width*0.58, cy);
await page.mouse.down();
for(let f=0.58; f>=0.25; f-=0.05){ await page.mouse.move(box.x+box.width*f, cy); await page.waitForTimeout(20);}
await page.mouse.up();

const info=await page.evaluate(()=>{
  const s=document.querySelector('[data-testid="beforeafter-slider"]');
  return { moves: window.__moves, valuenow: s.getAttribute('aria-valuenow') };
});
console.log('valuenow after left drag:', info.valuenow);
console.log('move samples (buttons/x/type):');
info.moves.slice(0,15).forEach(m=>console.log('  buttons='+m.buttons, 'x='+m.x, 'type='+m.type));
console.log('total moves:', info.moves.length, '| moves with buttons==1:', info.moves.filter(m=>m.buttons===1).length);
await browser.close();
