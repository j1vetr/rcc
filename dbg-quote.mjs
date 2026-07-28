import { chromium } from 'playwright-core';
const EXEC = '/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
const BASE = 'http://localhost:21416';
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox','--disable-dev-shm-usage'] });
const p = await browser.newPage();
const errs=[];
p.on('console', m => console.log('CONSOLE', m.type(), m.text().slice(0,300)));
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto(BASE+'/', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
for (let y=0;y<=10;y++){ await p.evaluate(f=>window.scrollTo(0,document.body.scrollHeight*f/10), y); await p.waitForTimeout(400); }
await p.waitForTimeout(1000);
const info = await p.evaluate(() => {
  const secs = Array.from(document.querySelectorAll('section')).map(s => ({ id: s.id, cls: s.className.slice(0,40), h: Math.round(s.getBoundingClientRect().height) }));
  return { sections: secs, hasQuote: !!document.getElementById('quote'), bodyLen: document.body.innerText.length, testids: Array.from(document.querySelectorAll('[data-testid]')).map(e=>e.getAttribute('data-testid')).slice(0,40) };
});
console.log('INFO', JSON.stringify(info,null,2));
await browser.close();
