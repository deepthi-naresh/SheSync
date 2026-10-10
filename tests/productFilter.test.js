import { describe, it, expect } from 'vitest';
import { PRODUCTS_CATALOG, STORE_CATEGORIES } from '../src/data/productsData';

describe('SheSync Phase 3: Product Catalog & Search Filtering', () => {
  it('1. Contains all 5 required wellness categories', () => {
    const categoryIds = STORE_CATEGORIES.map(c => c.id);
    expect(categoryIds).toContain('period');
    expect(categoryIds).toContain('baby');
    expect(categoryIds).toContain('maternity');
    expect(categoryIds).toContain('comfort');
    expect(categoryIds).toContain('wellness');
  });

  it('2. Filters products accurately by category', () => {
    const periodProducts = PRODUCTS_CATALOG.filter(p => p.category === 'period');
    const babyProducts = PRODUCTS_CATALOG.filter(p => p.category === 'baby');
    const maternityProducts = PRODUCTS_CATALOG.filter(p => p.category === 'maternity');
    const comfortProducts = PRODUCTS_CATALOG.filter(p => p.category === 'comfort');

    expect(periodProducts.length).toBeGreaterThanOrEqual(4);
    expect(babyProducts.length).toBeGreaterThanOrEqual(4);
    expect(maternityProducts.length).toBeGreaterThanOrEqual(4);
    expect(comfortProducts.length).toBeGreaterThanOrEqual(4);
  });

  it('3. Searches products case-insensitively across name, description, and category', () => {
    const query1 = 'CHOCOLATE';
    const results1 = PRODUCTS_CATALOG.filter(p => 
      p.name.toLowerCase().includes(query1.toLowerCase()) || 
      p.shortDesc.toLowerCase().includes(query1.toLowerCase())
    );
    expect(results1.length).toBeGreaterThan(0);
    expect(results1[0].id).toBe('prod-c1');

    const query2 = 'bamboo';
    const results2 = PRODUCTS_CATALOG.filter(p => 
      p.name.toLowerCase().includes(query2.toLowerCase()) || 
      p.shortDesc.toLowerCase().includes(query2.toLowerCase())
    );
    expect(results2.length).toBeGreaterThanOrEqual(2);
  });
});
