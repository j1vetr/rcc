import { chromium } from 'playwright-core';
const EXE = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const ICD = '/nix/store/71577rskzyhch3axhdqx7faygc2xyn4v-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/vk_swiftshader_icd.json';

const flagSets = {
  A: ['--no-sandbox','--use-gl=swiftshader'],
  B: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],
  C: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-features=Vulkan','--disable-gpu-sandbox'],
  D: ['--no-sandbox','--headless=new','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],
  E: ['--no-sandbox','--use-gl=egl'],
};

for (const [name, args] of Object.entries(flagSets)) {
  try {
    const b = await chromium.launch({ executablePath: EXE, args });
    const p = await b.newPage();
    const r = await p.evaluate(() => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return { ok:false };
      const d = gl.getExtension('WEBGL_debug_renderer_info');
      return { ok:true, renderer: d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL):'?', ver: gl.getParameter(gl.VERSION) };
    });
    console.log(name, JSON.stringify(r));
    await b.close();
  } catch (e) { console.log(name, 'LAUNCH_ERR', String(e).slice(0,100)); }
}
