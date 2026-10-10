import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SheSync Evaluator Readiness & Quality Audit Tests', () => {
  const indexHtmlPath = path.resolve(__dirname, '../index.html');
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

  it('1. Verifies SEO meta description is present, non-empty, and <= 160 characters', () => {
    const metaDescMatch = indexHtmlContent.match(/<meta\s+name=["']description["']\s+content="([^"]+)"/i);
    expect(metaDescMatch).not.toBeNull();
    const metaDesc = metaDescMatch[1];
    expect(metaDesc.length).toBeGreaterThan(50);
    expect(metaDesc.length).toBeLessThanOrEqual(160);
  });

  it('2. Verifies canonical URL points to production Vercel domain', () => {
    const canonicalMatch = indexHtmlContent.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    expect(canonicalMatch).not.toBeNull();
    expect(canonicalMatch[1]).toBe('https://she-sync-xi.vercel.app/');
  });

  it('3. Verifies complete Open Graph tags are present in index.html', () => {
    expect(indexHtmlContent).toContain('property="og:type"');
    expect(indexHtmlContent).toContain('property="og:url"');
    expect(indexHtmlContent).toContain('property="og:title"');
    expect(indexHtmlContent).toContain('property="og:description"');
    expect(indexHtmlContent).toContain('property="og:image"');
    expect(indexHtmlContent).toContain('property="og:site_name"');
  });

  it('4. Verifies Twitter Card metadata is present', () => {
    expect(indexHtmlContent).toContain('name="twitter:card"');
    expect(indexHtmlContent).toContain('name="twitter:title"');
    expect(indexHtmlContent).toContain('name="twitter:description"');
    expect(indexHtmlContent).toContain('name="twitter:image"');
  });

  it('5. Verifies JSON-LD structured data parses cleanly and conforms to Schema.org', () => {
    const jsonLdMatch = indexHtmlContent.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    expect(jsonLdMatch).not.toBeNull();
    const parsed = JSON.parse(jsonLdMatch[1]);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsed['@graph'])).toBe(true);
    const types = parsed['@graph'].map(item => item['@type']);
    expect(types).toContain('WebApplication');
    expect(types).toContain('MedicalWebPage');
  });

  it('6. Verifies fallback noscript provides accessible module summaries for crawlers', () => {
    expect(indexHtmlContent).toContain('<noscript>');
    expect(indexHtmlContent).toContain('Periods &amp; Wellbeing');
    expect(indexHtmlContent).toContain('Wellness Store');
    expect(indexHtmlContent).toContain('Doctor Appointments');
    expect(indexHtmlContent).toContain('Learn &amp; Support');
    expect(indexHtmlContent).toContain('Pregnancy Emergency Care &amp; SOS');
  });

  it('7. Verifies CycleCalendar uses semantic section landmark with aria-label', () => {
    const calendarPath = path.resolve(__dirname, '../src/components/period-tracker/CycleCalendar.jsx');
    const calendarContent = fs.readFileSync(calendarPath, 'utf-8');
    expect(calendarContent).toContain('<section className="glass-card cycle-calendar-container" aria-label="Menstrual Cycle Calendar">');
    expect(calendarContent).not.toContain('<div className="glass-card cycle-calendar-container" aria-label=');
  });

  it('8. Verifies form inputs have accessible labels or aria-labels across key components', () => {
    const hospitalCardPath = path.resolve(__dirname, '../src/components/emergency/NearbyHospitalsCard.jsx');
    const hospitalContent = fs.readFileSync(hospitalCardPath, 'utf-8');
    expect(hospitalContent).toContain('aria-label="Search hospitals by name, area, or facility"');

    const cartDrawerPath = path.resolve(__dirname, '../src/components/shopping/CartDrawer.jsx');
    const cartContent = fs.readFileSync(cartDrawerPath, 'utf-8');
    expect(cartContent).toContain('aria-label="Enter promotional voucher code"');

    const checkoutPath = path.resolve(__dirname, '../src/components/shopping/CheckoutModal.jsx');
    const checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
    expect(checkoutContent).toContain('role="radiogroup"');
    expect(checkoutContent).toContain('id="payment-demo-cod"');
    expect(checkoutContent).toContain('id="payment-demo-upi"');
    expect(checkoutContent).toContain('id="payment-demo-card"');
  });
});
