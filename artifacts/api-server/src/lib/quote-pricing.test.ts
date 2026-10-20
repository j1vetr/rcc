import assert from "node:assert/strict";
import test from "node:test";
import { services, extras, calculatePrice, vehicleCategories } from "@workspace/service-catalog";
import { buildQuotePricing } from "./quote-pricing";
import { buildQuoteEmailPreviews } from "./quote-emails";
import { SubmitQuoteBody } from "@workspace/api-zod";

const expectedPrices = [
  [150, 219, 279], [279, 329, 400], [100, 120, 140],
  [199, 239, 289], [95, 129, 169], [109, 149, 159],
];

test("all six packages have the exact 18 supplied prices and three categories", () => {
  assert.equal(services.length, 6);
  services.forEach((service, index) => {
    assert.deepEqual(Object.keys(service.prices), ["small", "medium", "xl"]);
    assert.deepEqual(Object.values(service.prices), expectedPrices[index]);
    for (const car of ["small", "medium", "xl"]) {
      assert.equal(calculatePrice(service.id, car).total, service.prices[car as "small"]);
    }
  });
  for (const labels of Object.values(vehicleCategories)) assert.equal(Object.keys(labels).length, 3);
});

test("every package contains all features in all three languages", () => {
  const expected = [[7, 6], [12, 11], [7, 0], [12, 0], [0, 6], [0, 11]];
  services.forEach((service, index) => {
    for (const language of ["DE", "EN", "FR"] as const) {
      assert.equal(service[`interiorFeatures${language}`].length, expected[index][0]);
      assert.equal(service[`exteriorFeatures${language}`].length, expected[index][1]);
      assert.ok(service[`name${language}`]);
    }
  });
  assert.equal(services[0].nameDE, "Standard Paket");
  assert.equal(services[1].nameDE, "Premium Aufbereitung Paket");
  assert.equal(services[3].nameDE, "Innenreinigung Premium (Aufbereitung)");
});

test("all 14 extras retain exact prices, variants, groups and variable notices", () => {
  assert.equal(extras.length, 14);
  assert.equal(extras.filter((extra) => extra.category === "interior").length, 6);
  assert.equal(extras.filter((extra) => extra.category === "exterior").length, 8);
  assert.deepEqual(extras.map((extra) => extra.variants.map((variant) => variant.price)),
    [[45], [89, 159], [100], [80], [25], [89], [25], [25], [35], [50], [40], [25], [15], [25]]);
  assert.deepEqual(extras.filter((extra) => extra.variablePrice).map((extra) => extra.id),
    ["pet-hair-removal", "headliner-cleaning"]);
  for (const extra of extras) {
    for (const language of ["de", "en", "fr"] as const) {
      assert.ok(extra.name[language]);
      assert.ok(extra.description[language]);
      assert.doesNotMatch(extra.name[language] + extra.description[language], /[—;]/u);
    }
  }
});

test("totals change with vehicle category and cloth-seat variant, and deselection removes extras", () => {
  const selections = [{ id: "cloth-seat-deep-cleaning", variantId: "single" }, { id: "wax-coating", variantId: "default" }];
  assert.equal(calculatePrice("inside-outside-basic", "small", selections).total, 264);
  assert.equal(calculatePrice("inside-outside-basic", "medium", selections).total, 333);
  assert.equal(calculatePrice("inside-outside-basic", "xl", selections).total, 393);
  selections[0].variantId = "five";
  assert.equal(calculatePrice("inside-outside-basic", "xl", selections).total, 463);
  assert.equal(calculatePrice("inside-outside-basic", "xl", []).total, 279);
  const all = extras.map((extra) => ({ id: extra.id, variantId: extra.variants[0].id }));
  assert.deepEqual(calculatePrice("inside-outside-premium", "xl", all),
    { packagePrice: 400, extrasPrice: 668, total: 1068, variablePrice: true });
});

test("server rejects unknown services, categories, extras, variants and duplicate extras", () => {
  assert.throws(() => buildQuotePricing("unknown", "small"));
  assert.throws(() => buildQuotePricing("interior-basic", "large"));
  assert.throws(() => buildQuotePricing("interior-basic", "small", [{ id: "unknown", variantId: "default" }]));
  assert.throws(() => buildQuotePricing("interior-basic", "small", [{ id: "wax-coating", variantId: "fake" }]));
  assert.throws(() => buildQuotePricing("interior-basic", "small", [
    { id: "cloth-seat-deep-cleaning", variantId: "single" },
    { id: "cloth-seat-deep-cleaning", variantId: "five" },
  ]));
});

test("API validation accepts three categories and structured extras, rejects legacy fourth category", () => {
  const body = { name: "Test", email: "test@example.com", phone: "000000", canton: "ZH", serviceType: "exterior-premium", carType: "xl",
    extras: [{ id: "wax-coating", variantId: "default" }] };
  assert.ok(SubmitQuoteBody.safeParse(body).success);
  assert.equal(SubmitQuoteBody.safeParse({ ...body, carType: "large" }).success, false);
});

for (const language of ["de", "en", "fr"] as const) {
  test(`both ${language} emails use saved total, localized extras and variable-price notice`, () => {
    const pricing = buildQuotePricing("inside-outside-premium", "medium", [
      { id: "cloth-seat-deep-cleaning", variantId: "five" },
      { id: "pet-hair-removal", variantId: "default" },
    ]);
    assert.equal(pricing.total, 568);
    const quote = { id: 1, name: "Test", email: "test@example.com", phone: "000000", canton: "ZH",
      serviceType: "inside-outside-premium", carType: "medium", message: null, pricing, createdAt: new Date("2026-08-25") };
    const previews = buildQuoteEmailPreviews(quote, language);
    for (const email of [previews.admin, previews.customer]) {
      assert.match(email.text, /568 CHF/);
      assert.ok(email.text.includes(pricing.extras[0].name[language]));
      assert.ok(email.text.includes(pricing.extras[0].variantLabel[language]));
      assert.match(email.text, language === "de" ? /abweichen/ : language === "en" ? /may vary/ : /peut varier/);
      assert.doesNotMatch(email.text, /[—;]/u);
    }
    pricing.total = 567; // A stored snapshot wins over later catalog recalculation.
    assert.match(buildQuoteEmailPreviews(quote, language).admin.text, /567 CHF/);
  });
}
