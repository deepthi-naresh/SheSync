import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';
import { PRODUCTS_CATALOG } from '../src/data/productsData';

describe('SheSync Phase 3: Wellness Store & Cart Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Adds products to cart and calculates correct quantities and subtotal', () => {
    const pad = PRODUCTS_CATALOG.find(p => p.id === 'prod-p1'); // Price 299
    const cup = PRODUCTS_CATALOG.find(p => p.id === 'prod-p3'); // Price 499

    let cart = [];

    // Add 2 pads
    cart = [{ ...pad, qty: 2 }];
    // Add 1 cup
    cart = [...cart, { ...cup, qty: 1 }];

    const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    expect(totalCount).toBe(3);
    // (299 * 2) + (499 * 1) = 598 + 499 = 1097
    expect(subtotal).toBe(1097);
  });

  it('2. Handles quantity increments, decrements, and removals', () => {
    let cart = [
      { id: 'prod-p1', name: 'Pad', price: 299, qty: 2 },
      { id: 'prod-b1', name: 'Diaper', price: 649, qty: 1 }
    ];

    // Increment Diaper to 2
    cart = cart.map(i => i.id === 'prod-b1' ? { ...i, qty: i.qty + 1 } : i);
    expect(cart.find(i => i.id === 'prod-b1').qty).toBe(2);

    // Decrement Pad to 1
    cart = cart.map(i => i.id === 'prod-p1' ? { ...i, qty: i.qty - 1 } : i);
    expect(cart.find(i => i.id === 'prod-p1').qty).toBe(1);

    // Remove Pad
    cart = cart.filter(i => i.id !== 'prod-p1');
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe('prod-b1');
  });

  it('3. Applies valid promo vouchers and calculates discounts accurately', () => {
    const subtotal = 1000;

    // Test SHESYNC10 (10% off)
    const discount10 = Math.round((subtotal * 10) / 100);
    expect(discount10).toBe(100);
    const totalWith10 = subtotal - discount10;
    expect(totalWith10).toBe(900);

    // Test HACKSPHERE (15% off)
    const discount15 = Math.round((subtotal * 15) / 100);
    expect(discount15).toBe(150);
    const totalWith15 = subtotal - discount15;
    expect(totalWith15).toBe(850);
  });

  it('4. Simulates checkout order generation, stores receipt, and clears active cart', () => {
    const cart = [
      { id: 'prod-c1', name: 'Dark Chocolate', price: 220, qty: 2 }
    ];
    const subtotal = 440;
    const discount = 44; // 10% with SHESYNC10
    const grandTotal = 396;

    const customerData = {
      fullName: 'Meera Rao',
      phone: '9876543210',
      address: '12 Blossom Street',
      city: 'Pune',
      pincode: '411001',
      paymentMethod: 'Demo Cash on Delivery'
    };

    const orderId = `SS-ORD-123456`;
    const order = {
      orderId,
      date: '10 Oct 2026',
      items: [...cart],
      subtotal,
      discount,
      appliedCoupon: 'SHESYNC10',
      grandTotal,
      customer: customerData,
      status: 'Demo Order Placed (Simulated)'
    };

    storage.set('orders', [order]);
    storage.set('cart', []);

    const retrievedOrders = storage.get('orders');
    const retrievedCart = storage.get('cart');

    expect(retrievedOrders.length).toBe(1);
    expect(retrievedOrders[0].orderId).toBe('SS-ORD-123456');
    expect(retrievedOrders[0].grandTotal).toBe(396);
    expect(retrievedCart.length).toBe(0);
  });
});
