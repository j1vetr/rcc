import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const OUT = '/home/runner/workspace/shots/bataftest';
fs.mkdirSync(OUT, { recursive: true });
const R = {};
const log = (k, v) => { R[k] = v; fs.appendFileSync('/tmp/bat-checkpoint.txt', `[${k}] ${typeof v==='object'?JSON.stringify(v):v}\n`); try{fs.writeFileSync('/tmp/bat-desk-results.json', JSON.stringify(R,null,2));}catch{} };

const vite = spawn('/home/runner/workspace/artifacts/rcc-website/node_modules/.bin/vite',
  ['--config','/home/runner/workspace/artifacts/rcc-website/vite.config.ts','--host','0.0.0.0'],
  { env: { ...process.env, PORT:'21416', BASE_PATH:'/' }, stdio:'ignore' });

fs.writeFileSync('/tmp/bat-checkpoint.txt','START\n');
const watchdog = setTimeout(()=>{
  try{ fs.writeFileSync('/tmp/bat-desk-results.json', JSON.stringify(R,null,2)); fs.appendFileSync('/tmp/bat-checkpoint.txt','WATCHDOG_EXIT\n'); }catch{}
  try{ vite.kill('SIGKILL'); }catch{}
  process.exit(2);
}, 50000);
watchdog.unref();

async function up(){ for(let i=0;i<25;i++){try{const r=await fetch(BASE+'/');if(r.status===200)return i;}catch{}await new Promise(r=>setTimeout(r,1000));} throw new Error('novite'); }

const sliderJs = () => {
  const el = document.querySelector('[data-testid="beforeafter-slider"]');
  if(!el) return {found:false};
  const r = el.getBoundingClientRect();
  const clip = el.querySelector('div[style*="clip-path"]');
  return { found:true, rect:{x:r.x,y:r.y,width:Math.round(r.width),height:Math.round(r.height)}, ariaNow:el.getAttribute('aria-valuenow'), clipPath:clip?clip.style.clipPath:null };
};
const tabJs = () => {
  const g=(id)=>{const b=document.querySelector(`[data-testid="beforeafter-tab-${id}"]`);if(!b)return null;const cs=getComputedStyle(b);return{text:b.textContent.trim(),pressed:b.getAttribute('aria-pressed'),color:cs.color,borderColor:cs.borderColor,bg:cs.backgroundColor};};
  return {exterior:g('exterior'),interior:g('interior')};
};
const imgJs = () => { const el=document.querySelector('[data-testid="beforeafter-slider"]');if(!el)return{};const im=[...el.querySelectorAll('img')];return{cleanSrc:im[0]?.getAttribute('src'),dirtySrc:im[1]?.getAttribute('src')}; };

async function main(){
  const upS = await up(); log('vite_up_s', upS);
  const browser = await chromium.launch({ executablePath:EXEC, args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); page.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1200);
  await page.evaluate(()=>window.scrollBy(0,300));
  await page.waitForSelector('[data-testid="beforeafter-slider"]',{timeout:15000});
  await page.waitForTimeout(500);

  log('order_heading', await page.evaluate(()=>{const h=[...document.querySelectorAll('h2')].find(x=>/vorher|nachher|before|after/i.test(x.textContent));const bat=document.querySelector('[data-testid="beforeafter-slider"]').closest('section');const main=document.querySelector('main');const first=main.querySelector('section');return{heading:h?h.textContent.trim():null, batIsFirstOrSecond: main? [...main.querySelectorAll('section')].indexOf(bat):-1};}));
  log('tabs_initial', await page.evaluate(tabJs));
  log('slider_initial', await page.evaluate(sliderJs));
  log('imgs_initial', await page.evaluate(imgJs));

  await page.$eval('[data-testid="beforeafter-slider"]', el=>el.scrollIntoView({block:'center'}));
  await page.waitForTimeout(400);
  await page.locator('[data-testid="beforeafter-slider"]').screenshot({path:`${OUT}/desktop-exterior-default.png`});

  // drag
  const s = await page.evaluate(sliderJs);
  const cy = s.rect.y + s.rect.height/2;
  const cx = s.rect.x + s.rect.width*0.58;
  const tx = s.rect.x + s.rect.width*0.30;
  await page.mouse.move(cx,cy); await page.mouse.down();
  await page.mouse.move(s.rect.x+s.rect.width*0.44,cy,{steps:5});
  await page.mouse.move(tx,cy,{steps:8});
  await page.waitForTimeout(120);
  const mid = await page.evaluate(sliderJs);
  await page.screenshot({path:`${OUT}/desktop-exterior-mid-drag.png`, clip:{x:0,y:Math.max(0,s.rect.y-40),width:1440,height:Math.min(900,s.rect.height+120)}});
  await page.mouse.up();
  log('drag', { from:s.ariaNow, to:mid.ariaNow, clipPath:mid.clipPath, worked: mid.ariaNow!=null && Math.abs(+mid.ariaNow-30)<=4 });

  // keyboard
  await page.focus('[data-testid="beforeafter-slider"]');
  const kb0=await page.evaluate(sliderJs);
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120);
  const kbR=await page.evaluate(sliderJs);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(120);
  const kbL=await page.evaluate(sliderJs);
  log('keyboard', { before:kb0.ariaNow, afterRight:kbR.ariaNow, afterLeft:kbL.ariaNow, worked: kbR.ariaNow!=null && +kbR.ariaNow>+kb0.ariaNow && +kbL.ariaNow<+kbR.ariaNow });

  // interior tab
  await page.click('[data-testid="beforeafter-tab-interior"]');
  await page.waitForTimeout(600);
  log('tabs_interior', await page.evaluate(tabJs));
  log('imgs_interior', await page.evaluate(imgJs));
  log('slider_interior', await page.evaluate(sliderJs));
  await page.$eval('[data-testid="beforeafter-slider"]', el=>el.scrollIntoView({block:'center'}));
  await page.waitForTimeout(300);
  await page.screenshot({path:`${OUT}/desktop-interior-active.png`, clip:{x:0,y:0,width:1440,height:900}});

  await page.click('[data-testid="beforeafter-tab-exterior"]');
  await page.waitForTimeout(400);
  log('imgs_back', await page.evaluate(imgJs));

  // below sections
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
  await page.waitForTimeout(700);
  log('below', await page.evaluate(()=>{
    const has=s=>!!document.querySelector(s);
    const byT=re=>[...document.querySelectorAll('h2,h3')].some(h=>re.test(h.textContent));
    return {
      howItWorks: byT(/schritt|steps|so funktioniert|three steps|ablauf/i),
      map: has('svg'),
      services: byT(/service|leistung|pakete|angebot/i),
      whyRcc: byT(/warum|why|rcc/i),
      quoteForm: has('form'),
      floatingAssistant: has('[data-testid="floating-assistant"]')||has('[data-testid^="button-assistant"]')||[...document.querySelectorAll('button')].some(b=>/assist/i.test(b.getAttribute('data-testid')||'')||/assist/i.test(b.getAttribute('aria-label')||'')),
      whatsappFloat: [...document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]')].length,
    };
  }));
  log('overflow', await page.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:window.innerWidth,overflow:document.documentElement.scrollWidth>window.innerWidth+1})));
  log('canvas', await page.evaluate(()=>document.querySelectorAll('canvas').length));
  const benign=t=>/vite|react-devtools|Download the React|\[HMR\]|hmr|favicon|preload|Lit is in dev/i.test(t);
  log('console_errors', errs.filter(e=>!benign(e)));
  log('console_all_count', errs.length);

  fs.writeFileSync('/tmp/bat-desk-results.json', JSON.stringify(R,null,2));
  fs.appendFileSync('/tmp/bat-checkpoint.txt','DONE\n');
  await browser.close().catch(()=>{});
  try{vite.kill('SIGKILL');}catch{}
  try{ const {execSync}=await import('node:child_process'); execSync('pkill -9 -f chrome-linux/chrome 2>/dev/null || true'); }catch{}
  process.exit(0);
}
main().catch(e=>{ fs.appendFileSync('/tmp/bat-checkpoint.txt','FATAL '+e.message+'\n'); fs.writeFileSync('/tmp/bat-desk-results.json',JSON.stringify(R,null,2)); try{vite.kill('SIGKILL');}catch{} process.exit(1); });
