import { chromium } from 'playwright-core';
const BASE='http://localhost:21416/';
const OUT='/home/runner/workspace/shots/browser-test';
const EXE=process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const page=await ctx.newPage();
await page.goto(BASE,{waitUntil:'load'});
await page.waitForTimeout(2000);
for(let i=0;i<4;i++){await page.keyboard.press('Escape');await page.waitForTimeout(100);}
await page.evaluate(()=>{document.querySelectorAll('vite-error-overlay').forEach(n=>n.remove());Array.from(document.querySelectorAll('body *')).forEach(el=>{const cs=getComputedStyle(el);if((cs.position==='fixed'||cs.position==='absolute')&&parseInt(cs.zIndex||'0')>=9999&&/runtime-error-plugin|WebGLRenderer/i.test(el.textContent||'')){el.remove();}});});

// Inspect all flythrough-interior imgs: which is visible, natural size (loaded?), rect, ken-burns
const info=await page.evaluate(()=>{
  const imgs=Array.from(document.querySelectorAll('img')).filter(x=>/flythrough-interior/.test(x.currentSrc||x.src));
  return imgs.map(i=>{
    const r=i.getBoundingClientRect();
    let hidden=false,n=i; while(n){if(getComputedStyle(n).display==='none'){hidden=true;break;}n=n.parentElement;}
    return {className:i.className, complete:i.complete, naturalW:i.naturalWidth, naturalH:i.naturalHeight, visible:i.offsetParent!==null, hiddenAncestor:hidden, rect:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}, kb:/kenburns/.test(i.className), currentSrc:(i.currentSrc||i.src).slice(-40)};
  });
});
console.log(JSON.stringify(info,null,2));

// scroll the VISIBLE (mobile) fallback into view and force-load if lazy
const target=await page.evaluate(()=>{
  const imgs=Array.from(document.querySelectorAll('img')).filter(x=>/flythrough-interior/.test(x.currentSrc||x.src));
  const vis=imgs.find(i=>{let n=i;while(n){if(getComputedStyle(n).display==='none')return false;n=n.parentElement;}return true;});
  if(vis){ vis.loading='eager'; vis.scrollIntoView({block:'center'}); return {found:true, y:Math.round(vis.getBoundingClientRect().top)}; }
  return {found:false};
});
console.log('scrolled to visible fallback:', JSON.stringify(target));
await page.waitForTimeout(1200);
const after=await page.evaluate(()=>{
  const imgs=Array.from(document.querySelectorAll('img')).filter(x=>/flythrough-interior/.test(x.currentSrc||x.src));
  const vis=imgs.find(i=>{let n=i;while(n){if(getComputedStyle(n).display==='none')return false;n=n.parentElement;}return true;});
  const r=vis.getBoundingClientRect();
  return {complete:vis.complete, naturalW:vis.naturalWidth, rectTop:Math.round(r.top), rectH:Math.round(r.height)};
});
console.log('after scroll:', JSON.stringify(after));
await page.screenshot({path:`${OUT}/mobile-flythrough-fallback.png`});
await browser.close();
