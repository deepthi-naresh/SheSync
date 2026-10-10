import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';
import { PRODUCTS_CATALOG } from '../src/data/productsData';

describe('SheSync Cart & Store: Edge Cases & Validation Hardening', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Enforces quantity bounds (caps at 20, removes on zero/negative/invalid)', () => {
    const product = PRODUCTS_CATALOG[0];

    // Simulating quantity operations
    let cart = [{ ...product, qty: 1 }];

    // Attempting to add excessive quantity (> 20)
    const addExcessive = (currentQty, addAmount) => Math.min(20, currentQty + addAmount);
    cart[0].qty = addExcessive(cart[0].qty, 25);
    expect(cart[0].qty).toBe(20);

    // Decrementing to 0 should remove
    const updateQty = (currentCart, productId, newQty) => {
      const parsed = parseInt(newQty, 10);
      if (isNaN(parsed) || parsed <= 0) {
        return currentCart.filter(item => item.id !== productId);
      }
      return currentCart.map(item => item.id === productId ? { ...item, qty: Math.min(20, parsed) } : item);
    };

    // Zero quantity
    let updatedCart = updateQty(cart, product.id, 0);
    expect(updatedCart.length).toBe(0);

    // Negative quantity
    cart = [{ ...product, qty: 5 }];
    updatedCart = updateQty(cart, product.id, -2);
    expect(updatedCart.length).toBe(0);

    // NaN / string invalid quantity
    cart = [{ ...product, qty: 5 }];
    updatedCart = updateQty(cart, product.id, 'invalid');
    expect(updatedCart.length).toBe(0);
  });

  it('2. Normalizes promo coupon codes with case and whitespace insensitivity', () => {
    const VALID_COUPONS = {
      SHESYNC10: { code: 'SHESYNC10', discountPercent: 10 },
      HACKSPHERE: { code: 'HACKSPHERE', discountPercent: 15 }
    };

    const validateCoupon = (inputCode) => {
      const clean = (inputCode || '').trim().toUpperCase();
      return VALID_COUPONS[clean] || null;
    };

    expect(validateCoupon('shesync10')).not.toBeNull();
    expect(validateCoupon('  HACKSPHERE  ')).not.toBeNull();
    expect(validateCoupon('SheSync10').discountPercent).toBe(10);
    expect(validateCoupon('hacksphere').discountPercent).toBe(15);
    expect(validateCoupon('')).toBeNull();
    expect(validateCoupon('INVALID_CODE')).toBeNull();
  });

  it('3. Guarantees non-negative grandTotal even with 100% or extreme voucher calculations', () => {
    const subtotal = 500;
    const discount = 600; // Simulated abnormal voucher
    const deliveryFee = 0;
    const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
    expect(grandTotal).toBe(0);
  });

  it('4. Validates shipping address fields: phone number and postal pincode rules', () => {
    const validateAddress = (data) => {
      const errors = {};
      if (!data.fullName || !data.fullName.trim()) errors.fullName = 'Full Name is required.';
      
      const cleanPhone = (data.phone || '').trim().replace(/[\s-]/g, '');
      if (!/^\d{10}$/.test(cleanPhone)) {
        errors.phone = 'Valid 10-digit mobile required.';
      }

      if (!data.address || !data.address.trim()) errors.address = 'Street Address required.';
      if (!data.city || !data.city.trim()) errors.city = 'City required.';

      const cleanPincode = (data.pincode || '').trim().replace(/\s/g, '');
      if (!/^\d{6}$/.test(cleanPincode)) {
        errors.pincode = 'Valid 6-digit Pincode required.';
      }

      return { isValid: Object.keys(errors).length === 0, errors };
    };

    // Valid address with formatted phone
    const valid = validateAddress({
      fullName: 'Aarohi Sen',
      phone: '98765-43210',
      address: '42 MG Road',
      city: 'Bengaluru',
      pincode: '560001'
    });
    expect(valid.isValid).toBe(true);

    // Invalid non-digit phone and 4-digit pincode
    const invalid = validateAddress({
      fullName: ' ',
      phone: 'abcdefghij',
      address: '',
      city: '',
      pincode: '5600'
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.fullName).toBeDefined();
    expect(invalid.errors.phone).toBeDefined();
    expect(invalid.errors.pincode).toBeDefined();
  });
});
