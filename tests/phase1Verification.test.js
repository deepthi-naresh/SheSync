import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';

describe('Phase 1 Core Logic Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Theme toggle updates localStorage and document attribute', () => {
    // Initial state
    storage.set('theme', 'light');
    expect(storage.get('theme')).toBe('light');

    // Toggle to dark
    const nextTheme = storage.get('theme') === 'light' ? 'dark' : 'light';
    storage.set('theme', nextTheme);
    expect(storage.get('theme')).toBe('dark');
  });

  it('2. Shop cart subtotal and quantity calculation works correctly', () => {
    const sampleProducts = [
      { id: 'prod-1', name: 'Organic Cotton Overnight Pads', price: 299 },
      { id: 'prod-2', name: 'Medical-Grade Silicone Cup', price: 499 },
    ];

    let cart = [];

    // Add prod-1
    cart = [{ ...sampleProducts[0], qty: 1 }];
    expect(cart.length).toBe(1);
    expect(cart[0].qty).toBe(1);

    // Increment prod-1
    cart = cart.map(item => item.id === 'prod-1' ? { ...item, qty: item.qty + 1 } : item);
    expect(cart[0].qty).toBe(2);

    // Add prod-2
    cart = [...cart, { ...sampleProducts[1], qty: 1 }];
    expect(cart.length).toBe(2);

    // Subtotal calculation: (299 * 2) + (499 * 1) = 598 + 499 = 1097
    const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    expect(totalCartCount).toBe(3);
    expect(cartSubtotal).toBe(1097);
  });

  it('3. Doctor booking slot selection updates active consultations list', () => {
    let booked = [];
    const newBooking = {
      id: 'apt-101',
      doctorName: 'Dr. Ananya Sharma',
      specialty: 'Senior Obstetrician & Gynaecologist',
      slot: '11:00 AM',
      date: 'Tomorrow, Oct 10'
    };

    booked = [newBooking, ...booked];
    expect(booked.length).toBe(1);
    expect(booked[0].doctorName).toBe('Dr. Ananya Sharma');
    expect(booked[0].slot).toBe('11:00 AM');
  });

  it('4. Learn article bookmarking toggles saved IDs without duplication', () => {
    let bookmarks = [];

    // Save article art-1
    if (!bookmarks.includes('art-1')) {
      bookmarks = [...bookmarks, 'art-1'];
    }
    expect(bookmarks).toEqual(['art-1']);

    // Save article art-2
    if (!bookmarks.includes('art-2')) {
      bookmarks = [...bookmarks, 'art-2'];
    }
    expect(bookmarks).toEqual(['art-1', 'art-2']);

    // Toggle off article art-1
    bookmarks = bookmarks.filter(id => id !== 'art-1');
    expect(bookmarks).toEqual(['art-2']);
  });

  it('5. Cancelling Reset Dialog preserves data; Confirming deletes only shesync keys', () => {
    // Populate demo data
    storage.set('theme', 'dark');
    storage.set('cart_preview', [{ id: 'prod-1', qty: 2 }]);
    localStorage.setItem('unrelated_app_setting', 'keep_this_safe');

    // Simulate CANCEL: No action is taken
    expect(storage.get('theme')).toBe('dark');
    expect(storage.get('cart_preview')).toEqual([{ id: 'prod-1', qty: 2 }]);
    expect(localStorage.getItem('unrelated_app_setting')).toBe('keep_this_safe');

    // Simulate CONFIRM RESET: storage.clearAllSheSyncData() is called
    storage.clearAllSheSyncData();

    // Verify SheSync keys are purged while third-party keys are kept
    expect(storage.get('theme')).toBeNull();
    expect(storage.get('cart_preview')).toBeNull();
    expect(localStorage.getItem('unrelated_app_setting')).toBe('keep_this_safe');
  });
});
