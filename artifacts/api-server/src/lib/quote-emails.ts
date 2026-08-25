import type { Quote } from "@workspace/db";
import { getServiceById } from "../routes/services";
import { getMailConfig, getMailTransport } from "./mail";

export type MailLanguage = "de" | "fr" | "en";

const EMAIL_LOGO_URL =
  "https://royalcarcleaning.ch/assets/rcc-logo-MSOWP9q-.webp";

type QuoteEmailDetails = {
  quote: Quote;
  language: MailLanguage;
  serviceName: string;
  carTypeLabel: string;
  estimatedPrice: number | undefined;
};

const copy = {
  de: {
    adminSubject: "Neue RCC Offertenanfrage",
    customerSubject: "Ihre Offertenanfrage bei RCC ist eingegangen",
    adminPreview: "Eine neue mobile Autopflege Anfrage ist eingegangen.",
    customerPreview: "Vielen Dank. Ihre Anfrage ist bei RCC eingegangen.",
    adminTitle: "Neue Offertenanfrage",
    customerTitle: "Ihre Anfrage ist eingegangen",
    adminIntro: "Eine neue Anfrage wartet auf Ihre Bearbeitung.",
    customerIntro:
      "Vielen Dank für Ihr Vertrauen. Wir haben Ihre Anfrage erhalten und melden uns persönlich bei Ihnen.",
    requestDetails: "Anfragedetails",
    contactDetails: "Kontaktdaten",
    quoteId: "Anfrage ID",
    received: "Eingegangen",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    canton: "Kanton",
    carType: "Fahrzeugklasse",
    service: "Gewünschte Leistung",
    estimate: "Preisindikation",
    message: "Nachricht",
    noMessage: "Keine zusätzliche Nachricht",
    noEstimate: "Auf Anfrage",
    customerNext:
      "Unser Team prüft Ihre Angaben und kontaktiert Sie für die nächsten Schritte. Diese Nachricht bestätigt den Eingang Ihrer Anfrage und ist keine definitive Terminbestätigung.",
    adminAction: "Bitte antworten Sie direkt auf diese Nachricht, um den Kunden zu kontaktieren.",
    signature: "RCC Royal Car Cleaning",
    footerLine: "Mobile Autopflege in der Schweiz",
    priceSuffix: " CHF",
    dateLocale: "de-CH",
  },
  fr: {
    adminSubject: "Nouvelle demande de devis RCC",
    customerSubject: "Votre demande de devis RCC a bien été reçue",
    adminPreview: "Une nouvelle demande de nettoyage automobile mobile est arrivée.",
    customerPreview: "Merci. Votre demande est bien arrivée chez RCC.",
    adminTitle: "Nouvelle demande de devis",
    customerTitle: "Votre demande a bien été reçue",
    adminIntro: "Une nouvelle demande attend votre traitement.",
    customerIntro:
      "Merci pour votre confiance. Nous avons reçu votre demande et nous vous contacterons personnellement.",
    requestDetails: "Détails de la demande",
    contactDetails: "Coordonnées",
    quoteId: "ID de demande",
    received: "Reçue le",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    canton: "Canton",
    carType: "Catégorie du véhicule",
    service: "Prestation souhaitée",
    estimate: "Indication de prix",
    message: "Message",
    noMessage: "Aucun message complémentaire",
    noEstimate: "Sur demande",
    customerNext:
      "Notre équipe étudie vos informations et vous contactera pour la suite. Ce message confirme la réception de votre demande et ne constitue pas une confirmation définitive de rendez-vous.",
    adminAction: "Répondez directement à ce message pour contacter le client.",
    signature: "RCC Royal Car Cleaning",
    footerLine: "Nettoyage automobile mobile en Suisse",
    priceSuffix: " CHF",
    dateLocale: "fr-CH",
  },
  en: {
    adminSubject: "New RCC quote request",
    customerSubject: "Your RCC quote request has been received",
    adminPreview: "A new mobile car care request has arrived.",
    customerPreview: "Thank you. Your request has reached RCC.",
    adminTitle: "New quote request",
    customerTitle: "Your request has been received",
    adminIntro: "A new request is ready for your attention.",
    customerIntro:
      "Thank you for your trust. We have received your request and will contact you personally.",
    requestDetails: "Request details",
    contactDetails: "Contact details",
    quoteId: "Request ID",
    received: "Received",
    name: "Name",
    email: "Email",
    phone: "Phone",
    canton: "Canton",
    carType: "Vehicle category",
    service: "Requested service",
    estimate: "Price indication",
    message: "Message",
    noMessage: "No additional message",
    noEstimate: "On request",
    customerNext:
      "Our team will review your details and contact you about the next steps. This message confirms receipt of your request and is not a definitive appointment confirmation.",
    adminAction: "Reply directly to this message to contact the customer.",
    signature: "RCC Royal Car Cleaning",
    footerLine: "Mobile car care across Switzerland",
    priceSuffix: " CHF",
    dateLocale: "en-CH",
  },
} as const;

type MailCopy = (typeof copy)[MailLanguage];

const carTypeLabels: Record<MailLanguage, Record<string, string>> = {
  de: {
    small: "Kleinwagen",
    medium: "Mittelklasse",
    large: "SUV oder Kombi",
    xl: "Van oder sehr grosses Fahrzeug",
  },
  fr: {
    small: "Petite voiture",
    medium: "Classe moyenne",
    large: "SUV ou break",
    xl: "Van ou très grand véhicule",
  },
  en: {
    small: "Small car",
    medium: "Mid-size car",
    large: "SUV or estate",
    xl: "Van or very large vehicle",
  },
};

function normalizeLanguage(language: string | undefined): MailLanguage {
  return language === "fr" || language === "en" ? language : "de";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date: Date, language: MailLanguage): string {
  return new Intl.DateTimeFormat(copy[language].dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatMoney(price: number | undefined, labels: MailCopy): string {
  return price === undefined ? labels.noEstimate : `${price}${labels.priceSuffix}`;
}

function getDetails(quote: Quote, requestedLanguage?: string): QuoteEmailDetails {
  const language = normalizeLanguage(requestedLanguage);
  const service = getServiceById(quote.serviceType);
  const serviceName =
    service?.[`name${language.toUpperCase()}` as "nameDE" | "nameFR" | "nameEN"] ??
    quote.serviceType;
  const carTypeLabel =
    carTypeLabels[language][quote.carType] ?? quote.carType;
  const price = service?.prices[quote.carType as keyof typeof service.prices];

  return {
    quote,
    language,
    serviceName,
    carTypeLabel,
    estimatedPrice: price,
  };
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:11px 0;border-bottom:1px solid #2a2926;color:#9b968b;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;vertical-align:top;width:38%">${label}</td><td style="padding:11px 0;border-bottom:1px solid #2a2926;color:#f4f0e8;font-size:14px;line-height:1.5;vertical-align:top">${value}</td></tr>`;
}

function layout(
  language: MailLanguage,
  title: string,
  preview: string,
  content: string,
  signature: string,
  footerLine: string,
): string {
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"></head><body style="margin:0;background:#080808;color:#f4f0e8;font-family:'Montserrat',Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preview)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808"><tr><td align="center" style="padding:36px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background:#11110f;border:1px solid #353027"><tr><td align="center" style="padding:30px 36px;border-bottom:1px solid #353027;text-align:center"><img src="${EMAIL_LOGO_URL}" alt="RCC Royal Car Cleaning" width="290" style="display:block;width:290px;max-width:100%;height:auto;margin:0 auto"></td></tr><tr><td style="padding:38px 36px 42px">${content}</td></tr><tr><td style="padding:22px 36px;border-top:1px solid #353027;color:#77736a;font-size:11px;line-height:1.7">${escapeHtml(signature)}<br>${escapeHtml(footerLine)}</td></tr></table></td></tr></table></body></html>`;
}

function adminEmail(details: QuoteEmailDetails): { html: string; text: string; subject: string } {
  const { quote, language, serviceName, carTypeLabel, estimatedPrice } = details;
  const labels = copy[language];
  const date = formatDate(quote.createdAt, language);
  const message = quote.message?.trim() || labels.noMessage;
  const rows = [
    row(labels.quoteId, String(quote.id)),
    row(labels.received, date),
    row(labels.name, escapeHtml(quote.name)),
    row(labels.email, escapeHtml(quote.email)),
    row(labels.phone, escapeHtml(quote.phone)),
    row(labels.canton, escapeHtml(quote.canton)),
    row(labels.carType, escapeHtml(carTypeLabel)),
    row(labels.service, escapeHtml(serviceName)),
    row(labels.estimate, escapeHtml(formatMoney(estimatedPrice, labels))),
    row(labels.message, escapeHtml(message).replaceAll("\n", "<br>")),
  ].join("");
  const html = layout(
    language,
    labels.adminTitle,
    labels.adminPreview,
    `<h1 style="margin:0 0 12px;color:#f4f0e8;font-size:28px;line-height:1.2;font-weight:500;letter-spacing:-.4px">${escapeHtml(labels.adminTitle)}</h1><p style="margin:0 0 30px;color:#aaa59b;font-size:14px;line-height:1.7">${escapeHtml(labels.adminIntro)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table><p style="margin:30px 0 0;padding:18px 20px;border-left:2px solid #c9a553;color:#cfc9bd;font-size:13px;line-height:1.7">${escapeHtml(labels.adminAction)}</p>`,
    labels.signature,
    labels.footerLine,
  );
  const text = [
    labels.adminTitle,
    "",
    labels.adminIntro,
    "",
    `${labels.quoteId}: ${quote.id}`,
    `${labels.received}: ${date}`,
    `${labels.name}: ${quote.name}`,
    `${labels.email}: ${quote.email}`,
    `${labels.phone}: ${quote.phone}`,
    `${labels.canton}: ${quote.canton}`,
    `${labels.carType}: ${carTypeLabel}`,
    `${labels.service}: ${serviceName}`,
    `${labels.estimate}: ${formatMoney(estimatedPrice, labels)}`,
    `${labels.message}: ${message}`,
    "",
    labels.adminAction,
    "",
    labels.signature,
    labels.footerLine,
  ].join("\n");
  return { html, text, subject: labels.adminSubject };
}

function customerEmail(details: QuoteEmailDetails): { html: string; text: string; subject: string } {
  const { quote, language, serviceName, carTypeLabel, estimatedPrice } = details;
  const labels = copy[language];
  const date = formatDate(quote.createdAt, language);
  const detailRows = [
    row(labels.received, date),
    row(labels.canton, escapeHtml(quote.canton)),
    row(labels.carType, escapeHtml(carTypeLabel)),
    row(labels.service, escapeHtml(serviceName)),
    row(labels.estimate, escapeHtml(formatMoney(estimatedPrice, labels))),
  ].join("");
  const html = layout(
    language,
    labels.customerTitle,
    labels.customerPreview,
    `<h1 style="margin:0 0 12px;color:#f4f0e8;font-size:28px;line-height:1.2;font-weight:500;letter-spacing:-.4px">${escapeHtml(labels.customerTitle)}</h1><p style="margin:0 0 28px;color:#aaa59b;font-size:14px;line-height:1.8">${escapeHtml(labels.customerIntro)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px">${detailRows}</table><div style="padding:20px;background:#191711;border:1px solid #4a3c20"><p style="margin:0;color:#d8c8a4;font-size:13px;line-height:1.8">${escapeHtml(labels.customerNext)}</p></div>`,
    labels.signature,
    labels.footerLine,
  );
  const text = [
    labels.customerTitle,
    "",
    labels.customerIntro,
    "",
    `${labels.received}: ${date}`,
    `${labels.canton}: ${quote.canton}`,
    `${labels.carType}: ${carTypeLabel}`,
    `${labels.service}: ${serviceName}`,
    `${labels.estimate}: ${formatMoney(estimatedPrice, labels)}`,
    "",
    labels.customerNext,
    "",
    labels.signature,
  ].join("\n");
  return { html, text, subject: labels.customerSubject };
}

export function buildQuoteEmailPreviews(
  quote: Quote,
  requestedLanguage?: string,
): {
  admin: { html: string; text: string; subject: string };
  customer: { html: string; text: string; subject: string };
} {
  const details = getDetails(quote, requestedLanguage);
  return {
    admin: adminEmail(details),
    customer: customerEmail(details),
  };
}

export type MailDeliveryResult = {
  recipient: "admin" | "customer";
  adminIndex?: number;
  result: PromiseSettledResult<unknown>;
};

export async function sendQuoteEmails(
  quote: Quote,
  requestedLanguage?: string,
): Promise<MailDeliveryResult[]> {
  const previews = buildQuoteEmailPreviews(quote, requestedLanguage);
  const config = getMailConfig();
  const transport = getMailTransport();
  const from = `"${config.fromName}" <${config.fromAddress}>`;

  const [adminResults, customerResults] = await Promise.all([
    Promise.allSettled(
      config.adminNotificationEmails.map((adminEmail) =>
        transport.sendMail({
          from,
          to: adminEmail,
          replyTo: quote.email,
          subject: previews.admin.subject,
          text: previews.admin.text,
          html: previews.admin.html,
        }),
      ),
    ),
    Promise.allSettled([
      transport.sendMail({
        from,
        to: quote.email,
        subject: previews.customer.subject,
        text: previews.customer.text,
        html: previews.customer.html,
      }),
    ]),
  ]);

  return [
    ...adminResults.map((result, index) => ({
      recipient: "admin" as const,
      adminIndex: index + 1,
      result,
    })),
    { recipient: "customer" as const, result: customerResults[0] },
  ];
}