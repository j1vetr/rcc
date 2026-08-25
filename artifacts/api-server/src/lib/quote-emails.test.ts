import assert from "node:assert/strict";
import test from "node:test";
import type { Quote } from "@workspace/db";
import { parseAdminNotificationEmails } from "./mail";
import { buildQuoteEmailPreviews } from "./quote-emails";

test("parses multiple admin notification recipients", () => {
  assert.deepEqual(
    parseAdminNotificationEmails(
      " first-admin@example.com,second-admin@example.com ",
    ),
    ["first-admin@example.com", "second-admin@example.com"],
  );
});

const quote: Quote = {
  id: 42,
  name: "Test Customer",
  email: "test@example.com",
  phone: "+41 78 000 00 00",
  canton: "Zürich",
  serviceType: "inside-outside-premium",
  carType: "medium",
  message: "Please contact me in the afternoon.",
  createdAt: new Date("2026-08-25T10:00:00.000Z"),
};

const localizedRequestWord = {
  de: /Anfrage/i,
  fr: /Demande/i,
  en: /request/i,
} as const;

for (const language of ["de", "fr", "en"] as const) {
  test(`builds premium ${language} quote emails`, () => {
    const previews = buildQuoteEmailPreviews(quote, language);

    for (const email of [previews.admin, previews.customer]) {
      assert.match(email.html, /Montserrat/);
      assert.match(
        email.html,
        /https:\/\/royalcarcleaning\.ch\/assets\/rcc-logo-MSOWP9q-\.webp/,
      );
      assert.doesNotMatch(email.html, /—/u);
      assert.doesNotMatch(email.text, /[—;]/u);
      assert.doesNotMatch(email.text, /[\u{1F300}-\u{1FAFF}]/u);
    }

    assert.match(previews.admin.text, /Test Customer/);
    assert.match(previews.customer.text, localizedRequestWord[language]);
  });
}