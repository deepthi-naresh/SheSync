import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  X, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Modal from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }) {
  const { 
    cartItems, 
    totalItems, 
    subtotal, 
    discount, 
    deliveryFee, 
    grandTotal, 
    appliedCoupon, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const result = applyCoupon(couponInput);
    if (result.success) {
      showToast(result.message, 'success');
      setCouponInput('');
    } else {
      showToast(result.message, 'warning');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Promo code removed.', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Your Demo Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
      maxWidth="620px"
      footer={
        cartItems.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
            <button 
              type="button" 
              className="btn btn-ghost" 
              style={{ fontSize: '0.82rem', padding: '6px 10px' }}
              onClick={() => {
                clearCart();
                showToast('Cart cleared.', 'info');
              }}
            >
              <Trash2 size={14} /> Clear Cart
            </button>

            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
            >
              <span>Proceed to Demo Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : null
      }
    >
      <div className="cart-drawer-container">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <ShoppingCart size={48} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Your demo cart is empty</h3>
            <p style={{ fontSize: '0.86rem', marginTop: '4px' }}>
              Explore our curated period care, maternity essentials, and comfort picks to test the cart workflow.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '16px' }}
              onClick={onClose}
            >
              Start Browsing
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-price-unit">
                      ₹{item.price} each • <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="cart-qty-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-display">{item.qty}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="cart-item-total">
                    ₹{item.price * item.qty}
                  </div>

                  <button
                    className="btn-delete-history"
                    onClick={() => {
                      removeFromCart(item.id);
                      showToast(`Removed "${item.name}" from cart.`, 'info');
                    }}
                    title="Remove item"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Voucher Code Section */}
            {appliedCoupon ? (
              <div className="applied-coupon-pill">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} />
                  <strong>Coupon Applied: {appliedCoupon} ({appliedCoupon === 'HACKSPHERE' ? '15%' : '10%'} Off)</strong>
                </div>
                <button
                  className="btn-ghost"
                  style={{ padding: '2px 6px', color: 'var(--accent-sage)', fontWeight: 700 }}
                  onClick={handleRemoveCoupon}
                  aria-label="Remove coupon"
                >
                  <X size={14} /> Remove
                </button>
              </div>
            ) : (
              <form className="cart-coupon-box" onSubmit={handleApplyCoupon}>
                <input
                  id="cart-coupon-input"
                  type="text"
                  className="coupon-input"
                  placeholder="Enter Promo Code (e.g. SHESYNC10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  aria-label="Enter promotional voucher code"
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  Apply
                </button>
              </form>
            )}

            {/* Subtotal & Totals Breakdown */}
            <div className="cart-summary-card">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items):</span>
                <span>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row" style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>
                  <span>Promo Discount ({appliedCoupon}):</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Standard Delivery:</span>
                <span style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>FREE (Demo)</span>
              </div>

              <div className="summary-row total-row">
                <span>Estimated Total:</span>
                <span style={{ color: 'var(--accent-primary)' }}>₹{grandTotal}</span>
              </div>
            </div>

            {/* Safety Simulation Disclaimer */}
            <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              * Demo Store Simulation: No actual monetary charge or delivery order is processed.
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
