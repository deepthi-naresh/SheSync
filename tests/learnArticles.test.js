import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';
import { ARTICLES_CATALOG, ARTICLE_CATEGORIES } from '../src/data/articlesData';

describe('SheSync Phase 3: Learn Content Expansion & Sources Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Contains all 8 mandated pregnancy, maternal, and postpartum educational guides', () => {
    const articleIds = ARTICLES_CATALOG.map(a => a.id);

    // Mandated Phase 3 topics
    expect(articleIds).toContain('art-p1'); // Pregnancy Signs & Testing
    expect(articleIds).toContain('art-p2'); // Pregnancy by Trimester
    expect(articleIds).toContain('art-p3'); // Antenatal Care & Clinician Questions
    expect(articleIds).toContain('art-p4'); // Nutrition, Hydration & Supplements
    expect(articleIds).toContain('art-p5'); // Foods to Limit or Avoid
    expect(articleIds).toContain('art-p6'); // Postpartum & Newborn Basics
    expect(articleIds).toContain('art-p7'); // Emotional Wellbeing & PPD
    expect(articleIds).toContain('art-p8'); // Urgent Warning Signs
  });

  it('2. Every educational guide includes verified public-health source citations', () => {
    ARTICLES_CATALOG.forEach((art) => {
      expect(Array.isArray(art.sources)).toBe(true);
      expect(art.sources.length).toBeGreaterThanOrEqual(1);

      // Verify presence of recognized public-health authorities (WHO, MoHFW, NHS, CDC, ACOG, etc.)
      const combinedSources = art.sources.join(' ');
      const hasRecognizedSource = /(WHO|World Health Organization|MoHFW|Ministry of Health|NHS|CDC|ACOG|AAP|ICMR|Endocrine Society)/i.test(combinedSources);
      expect(hasRecognizedSource).toBe(true);
    });
  });

  it('3. Bookmarking operations persist cleanly to storage without duplication', () => {
    let bookmarks = storage.get('bookmarked_articles', []);
    expect(bookmarks.length).toBe(0);

    // Bookmark article art-p1
    bookmarks = ['art-p1'];
    storage.set('bookmarked_articles', bookmarks);
    expect(storage.get('bookmarked_articles')).toEqual(['art-p1']);

    // Bookmark article art-p4
    bookmarks = [...bookmarks, 'art-p4'];
    storage.set('bookmarked_articles', bookmarks);
    expect(storage.get('bookmarked_articles')).toEqual(['art-p1', 'art-p4']);

    // Toggle off art-p1
    bookmarks = bookmarks.filter(id => id !== 'art-p1');
    storage.set('bookmarked_articles', bookmarks);
    expect(storage.get('bookmarked_articles')).toEqual(['art-p4']);
  });
});
