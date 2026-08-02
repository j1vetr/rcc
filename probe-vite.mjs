import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
const EXEC='/nix/store/hvv3n9pvjfq0x8wjw8f3igsyvlaz1ngr-playwright-browsers-chromium/chromium-1091/chrome-linux/chrome';
fs.writeFileSync('/tmp/pv.txt','start\n');
const vite=spawn('/home/runner/workspace/artifacts/rcc-website/node_modules/.bin/vite',['--config','/home/runner/workspace/artifacts/rcc-website/vite.config.ts','--host','0.0.0.0'],{env:{...process.env,PORT:'21416',BASE_PATH:'/'},stdio:'ignore'});
vite.unref();
fs.appendFileSync('/tmp/pv.txt','spawned\n');
for(let i=0;i<25;i++){try{const r=await fetch('http://localhost:21416/');if(r.status===200){fs.appendFileSync('/tmp/pv.txt','up '+i+'\n');break;}}catch{}await new Promise(r=>setTimeout(r,1000));}
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.goto('http://localhost:21416/',{waitUntil:'domcontentloaded'});
fs.appendFileSync('/tmp/pv.txt','title '+(await p.title())+'\n');
await b.close();
fs.appendFileSync('/tmp/pv.txt','closed\n');
vite.kill('SIGKILL');
fs.appendFileSync('/tmp/pv.txt','vitekilled\n');
process.exit(0);
