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
const submissions = [];
// Verify the real browser request and success state without sending customer emails
// or inserting synthetic records into the running database.
await page.route('**/api/quotes', async (route) => {
  assert.equal(route.request().method(), 'POST');
  const input = route.request().postDataJSON();
  submissions.push(input);
  await route.fulfill({
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({ ...input, id: submissions.length, createdAt: new Date().toISOString() }),
  });
});
const submitForm = async () => {
  await page.getByTestId('input-canton').fill('ZH');
  await click('button-wizard-next');
  await click('button-wizard-next');
  await page.getByTestId('input-name').fill('Pricing UI test');
  await page.getByTestId('input-email').fill('test@example.com');
  await page.getByTestId('input-phone').fill('+41000000000');
  await click('button-wizard-next');
  assert.equal(await page.getByTestId('button-submit-quote').isEnabled(), true);
  await click('button-submit-quote');
  await page.locator('#quote form').waitFor({ state: 'detached' });
};

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
  assert.doesNotMatch(await page.locator('body').innerText(), /15\. September|Betriebsstart/);
  await submitForm();
  assert.equal(quoteRequests, 1);
  assert.equal(submissions[0].language, 'de');
  assert.equal(submissions[0].serviceType, 'inside-outside-basic');
  assert.equal(submissions[0].carType, 'xl');
  assert.deepEqual(submissions[0].extras, [
    { id: 'cloth-seat-deep-cleaning', variantId: 'five' },
    { id: 'wax-coating', variantId: 'default' },
  ]);

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
    await click('button-request-selection');
    await page.waitForURL(new RegExp(`/${lang}/contact/\\?`));
    assert.doesNotMatch(await page.locator('body').innerText(), /15 September|15 septembre|opens for business|commence ses activités/);
    await submitForm();
    assert.equal(submissions.at(-1).language, lang);
    assert.equal(submissions.at(-1).serviceType, 'exterior-premium');
    assert.equal(submissions.at(-1).extras[0].variantId, 'five');
  }
  assert.equal(quoteRequests, 3, 'All three language forms submit');
  assert.deepEqual(errors, [], 'Browser must not report runtime exceptions');
  console.log('PASS: package pricing, extras, quote transfer, enabled submission and success states in DE/EN/FR, no launch notices, mobile layout and no browser errors (mocked API, no emails sent)');
} finally {
  await browser.close();
}
