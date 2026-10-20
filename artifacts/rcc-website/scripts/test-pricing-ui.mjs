import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:80';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/repl/tools/bin/chromium',
  args: ['--no-sandbox'],
});
const errors = [];
let quoteRequests = 0;
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('pageerror', (error) => errors.push(error.message));
page.on('request', (request) => {
  if (request.method() === 'POST' && request.url().includes('/quotes')) quoteRequests++;
});
const click = async (id) => page.getByTestId(id).click();
const total = () => page.getByTestId('text-total-price').first();

try {
  await page.goto(`${base}/de/pakete/`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-testid^="button-select-"]').count(), 6);
  assert.equal(await page.getByRole('checkbox').count(), 14);
  assert.equal(await page.locator('[data-testid^="button-car-"]').count(), 3);
  for (const [car, expected] of [['small', 150], ['medium', 219], ['xl', 279]]) {
    await click(`button-car-${car}`);
    await click('button-select-inside-outside-basic');
    await total().filter({ hasText: String(expected) }).waitFor();
  }
  await click('checkbox-extra-cloth-seat-deep-cleaning');
  await total().filter({ hasText: '368' }).waitFor();
  await click('radio-extra-cloth-seat-deep-cleaning-five');
  await total().filter({ hasText: '438' }).waitFor();
  await click('checkbox-extra-wax-coating');
  await total().filter({ hasText: '463' }).waitFor();
  await click('checkbox-extra-pet-hair-removal');
  await total().filter({ hasText: '543' }).waitFor();
  assert.ok((await page.getByTestId('summary-price-breakdown').innerText()).includes('abweichen'));
  await click('checkbox-extra-pet-hair-removal');
  await total().filter({ hasText: '463' }).waitFor();
  await click('button-request-selection');
  await page.waitForURL(/\/de\/kontakt\/\?/);
  await page.getByTestId('text-total-price').filter({ hasText: '463' }).waitFor();
  assert.ok((await page.getByTestId('summary-price-breakdown').innerText()).includes('5 Sitze'));
  // Get through the wizard without sending anything.
  await page.getByTestId('input-canton').fill('ZH');
  await click('button-wizard-next');
  await page.getByTestId('checkbox-extra-wax-coating').waitFor();
  assert.equal(await page.getByTestId('checkbox-extra-wax-coating').getAttribute('aria-checked'), 'true');
  await click('button-wizard-next');
  await page.getByTestId('input-name').fill('Pricing UI test');
  await page.getByTestId('input-email').fill('test@example.com');
  await page.getByTestId('input-phone').fill('+41000000000');
  await click('button-wizard-next');
  assert.equal(await page.getByTestId('button-submit-quote').isDisabled(), true);
  await page.locator('form').evaluate((form) => form.requestSubmit());
  assert.equal(quoteRequests, 0, 'The prelaunch form must not submit');

  for (const [lang, path, expectedName] of [
    ['en', '/en/packages/', 'Standard'],
    ['fr', '/fr/forfaits/', 'Standard'],
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('checkbox').count(), 14, lang);
    assert.equal(await page.locator('[data-testid^="button-select-"]').count(), 6, lang);
    await click('button-car-xl');
    await click('button-select-exterior-premium');
    await total().filter({ hasText: '159' }).waitFor();
    await click('radio-extra-cloth-seat-deep-cleaning-five');
    await total().filter({ hasText: '318' }).waitFor();
    assert.ok((await page.locator('main').innerText()).toLowerCase().includes(expectedName.toLowerCase()));
    const dimensions = await page.evaluate(() => ({ body: document.documentElement.scrollWidth, width: innerWidth }));
    assert.ok(dimensions.body <= dimensions.width + 1, `${lang} mobile has horizontal overflow`);
  }
  assert.deepEqual(errors, [], 'Browser must not report runtime exceptions');
  console.log('PASS: 6 packages, 3 vehicle sizes, 14 extras, variant totals, deselection, quote transfer, launch guard, EN/FR mobile and no browser errors');
} finally {
  await browser.close();
}
