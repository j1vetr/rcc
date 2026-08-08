/**
 * SeoHead ,  injects per-route metadata into <head> on client-side navigation.
 *
 * In SSR prerendered pages the head tags are already written into the HTML;
 * this component updates them when the user navigates without a full page load.
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getMetadataForPath, get404Metadata, isKnownPath } from '@/seo/metadata';
import { detectLangFromPath } from '@/seo/routes';

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute(attr, value);
  } else {
    const tag = document.createElement('meta');
    const parts = selector.match(/\[([^\]]+)="([^\]]+)"\]/);
    if (parts) {
      tag.setAttribute(parts[1], parts[2]);
    }
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
}

function setLink(rel: string, hreflang: string | null, href: string) {
  const existing = hreflang
    ? document.querySelector(`link[rel="${rel}"][hreflang="${hreflang}"]`)
    : document.querySelector(`link[rel="${rel}"]:not([hreflang])`);
  if (existing) existing.remove();

  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  if (hreflang) link.setAttribute('hreflang', hreflang);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

function clearHreflangLinks() {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.remove();
}

export function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const lang = detectLangFromPath(location);
    const known = isKnownPath(location);

    const meta = known
      ? getMetadataForPath(location)
      : get404Metadata(lang);

    // Title
    document.title = meta.title;

    // html lang
    document.documentElement.setAttribute('lang', meta.locale);

    // Meta description
    setMeta('meta[name="description"]', 'content', meta.description);

    // Robots
    setMeta('meta[name="robots"]', 'content', meta.robots);

    // OG tags
    setMeta('meta[property="og:title"]', 'content', meta.ogTitle);
    setMeta('meta[property="og:description"]', 'content', meta.ogDescription);
    setMeta('meta[property="og:locale"]', 'content', meta.ogLocale);
    setMeta('meta[property="og:image"]', 'content', meta.ogImage);

    // Twitter tags
    setMeta('meta[name="twitter:title"]', 'content', meta.twitterTitle);
    setMeta('meta[name="twitter:description"]', 'content', meta.twitterDescription);

    // Canonical + hreflang
    clearHreflangLinks();
    setLink('canonical', null, meta.canonical);
    for (const entry of meta.hreflang) {
      setLink('alternate', entry.hreflang, entry.href);
    }

    // JSON-LD schema
    let jsonLdScript = document.querySelector(
      'script[type="application/ld+json"][data-seo="page"]',
    ) as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      jsonLdScript.setAttribute('data-seo', 'page');
      document.head.appendChild(jsonLdScript);
    }
    if (Object.keys(meta.jsonLd).length > 0) {
      jsonLdScript.textContent = JSON.stringify(meta.jsonLd, null, 2);
    }
  }, [location]);

  return null;
}
