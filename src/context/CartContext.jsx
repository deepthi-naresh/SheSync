import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../utils/storage';

const CartContext = createContext();

const VALID_COUPONS = {
  SHESYNC10: { code: 'SHESYNC10', discountPercent: 10, description: '10% Off Welcome Voucher' },
  HACKSPHERE: { code: 'HACKSPHERE', discountPercent: 15, description: '15% Off Hackathon Special' }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => storage.get('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState(() => storage.get('cart_coupon', null));
  const [orderHistory, setOrderHistory] = useState(() => storage.get('orders', []));

  // Sync cart and orders to local storage
  useEffect(() => {
    storage.set('cart', cartItems);
  }, [cartItems]);

  useEffect(() => {
    storage.set('cart_coupon', appliedCoupon);
  }, [appliedCoupon]);

  useEffect(() => {
    storage.set('orders', orderHistory);
  }, [orderHistory]);

  // Calculations
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon || !VALID_COUPONS[appliedCoupon]) return 0;
    const percent = VALID_COUPONS[appliedCoupon].discountPercent;
    return Math.round((subtotal * percent) / 100);
  }, [subtotal, appliedCoupon]);

  const deliveryFee = 0; // Free demo shipping

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discount + deliveryFee);
  }, [subtotal, discount, deliveryFee]);

  // Add product to cart with input sanitization and max limit of 20
  const addToCart = useCallback((product, qtyToAdd = 1) => {
    if (!product || !product.id) return;
    const cleanQty = Math.max(1, Math.min(20, parseInt(qtyToAdd, 10) || 1));
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newTotalQty = Math.min(20, updated[existingIndex].qty + cleanQty);
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: newTotalQty
        };
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          category: product.category,
          price: Math.max(0, Number(product.price) || 0),
          badge: product.badge,
          badgeColor: product.badgeColor,
          shortDesc: product.shortDesc,
          imageFallbackColor: product.imageFallbackColor,
          qty: cleanQty
        }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // Update item quantity (removes if qty <= 0, NaN, or non-numeric)
  const updateQuantity = useCallback((productId, newQty) => {
    const parsedQty = parseInt(newQty, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      removeFromCart(productId);
      return;
    }
    const safeQty = Math.min(20, parsedQty);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: safeQty } : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  // Apply voucher promo code
  const applyCoupon = useCallback((code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      setAppliedCoupon(cleanCode);
      return { success: true, message: `Promo code "${cleanCode}" applied successfully!` };
    }
    return { success: false, message: 'Invalid promo code. Try "SHESYNC10" or "HACKSPHERE".' };
  }, []);

  // Remove applied coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Process Simulated Demo Checkout
  const processDemoCheckout = useCallback((customerData) => {
    if (cartItems.length === 0) return null;

    const orderId = `SS-ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...cartItems],
      subtotal,
      discount,
      appliedCoupon,
      deliveryFee,
      grandTotal,
      customer: {
        fullName: customerData.fullName || 'Demo User',
        phone: customerData.phone || '',
        address: customerData.address || '',
        city: customerData.city || '',
        pincode: customerData.pincode || '',
        paymentMethod: customerData.paymentMethod || 'Simulated Cash on Delivery'
      },
      status: 'Demo Order Placed (Simulated)'
    };

    setOrderHistory((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [cartItems, subtotal, discount, appliedCoupon, deliveryFee, grandTotal, clearCart]);

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      subtotal,
      discount,
      deliveryFee,
      grandTotal,
      appliedCoupon,
      orderHistory,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      processDemoCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
