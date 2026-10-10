import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import Modal from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CheckoutModal({ isOpen, onClose, onOrderComplete }) {
  const { cartItems, totalItems, grandTotal, subtotal, discount, appliedCoupon, processDemoCheckout } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment Simulation
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'demo_cod'
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile phone number.';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Street Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    
    const cleanPincode = formData.pincode.trim().replace(/\s/g, '');
    if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit postal Pincode.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep(2);
    } else {
      showToast('Please complete all required delivery fields.', 'warning');
    }
  };

  const handleConfirmOrder = () => {
    const completedOrder = processDemoCheckout(formData);
    if (completedOrder) {
      showToast('Demo order placed successfully!', 'success');
      onClose();
      onOrderComplete(completedOrder);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simulated Demo Checkout"
      maxWidth="620px"
      footer={
        step === 1 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Back to Cart
            </button>
            <button type="button" className="btn btn-primary" onClick={handleProceedToPayment}>
              <span>Proceed to Payment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Edit Address
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirmOrder}>
              <CheckCircle2 size={16} /> Confirm Demo Order (₹{grandTotal})
            </button>
          </div>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Step Indicator */}
        <div className="checkout-step-indicator">
          <span className={`checkout-step-pill ${step === 1 ? 'active' : ''}`}>
            1. Delivery Address
          </span>
          <span className={`checkout-step-pill ${step === 2 ? 'active' : ''}`}>
            2. Simulated Payment
          </span>
        </div>

        {/* STEP 1: Address Form */}
        {step === 1 && (
          <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={handleProceedToPayment}>
            <div className="form-group">
              <label className="form-label" htmlFor="chk-name">
                <span>Full Name</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>* Required</span>
              </label>
              <input
                id="chk-name"
                name="fullName"
                type="text"
                className="form-input-date"
                placeholder="e.g. Aditi Sharma"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              {errors.fullName && <span style={{ fontSize: '0.8rem', color: '#DC2626' }}>{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="chk-phone">
                <span>Mobile Contact Number</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>* Required (10 Digits)</span>
              </label>
              <input
                id="chk-phone"
                name="phone"
                type="tel"
                maxLength={10}
                className="form-input-date"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {errors.phone && <span style={{ fontSize: '0.8rem', color: '#DC2626' }}>{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="chk-address">
                <span>Street Address & House / Flat No.</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>* Required</span>
              </label>
              <input
                id="chk-address"
                name="address"
                type="text"
                className="form-input-date"
                placeholder="e.g. Flat 402, Lotus Orchid Apartments, Indiranagar"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              {errors.address && <span style={{ fontSize: '0.8rem', color: '#DC2626' }}>{errors.address}</span>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="chk-city">City</label>
                <input
                  id="chk-city"
                  name="city"
                  type="text"
                  className="form-input-date"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                {errors.city && <span style={{ fontSize: '0.8rem', color: '#DC2626' }}>{errors.city}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="chk-pincode">Pincode (6 Digits)</label>
                <input
                  id="chk-pincode"
                  name="pincode"
                  type="text"
                  maxLength={6}
                  className="form-input-date"
                  placeholder="e.g. 560038"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
                {errors.pincode && <span style={{ fontSize: '0.8rem', color: '#DC2626' }}>{errors.pincode}</span>}
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              🔒 <strong>Local Device Security:</strong> All address and contact fields are processed strictly within your local browser session and never sent to remote tracking servers.
            </div>
          </form>
        )}

        {/* STEP 2: Payment Simulation */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '12px 14px', background: 'var(--accent-cream)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-amber)', fontSize: '0.84rem' }}>
              <strong>⚠️ Simulated Demo Transaction:</strong> No real money will be charged. Select any simulated payment method to test order generation.
            </div>

            <div className="payment-method-selector" role="radiogroup" aria-label="Simulated payment method selection">
              <label 
                htmlFor="payment-demo-cod"
                className={`payment-option-card ${formData.paymentMethod === 'demo_cod' ? 'active' : ''}`}
              >
                <div className="payment-option-left">
                  <Banknote size={20} color="var(--accent-sage)" />
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>Demo Cash on Delivery (COD)</h4>
                    <p style={{ fontSize: '0.78rem' }}>Pay ₹{grandTotal} in cash during demo doorstep delivery.</p>
                  </div>
                </div>
                <input 
                  id="payment-demo-cod"
                  type="radio" 
                  name="paymentMethod"
                  value="demo_cod"
                  checked={formData.paymentMethod === 'demo_cod'} 
                  onChange={() => setFormData(p => ({ ...p, paymentMethod: 'demo_cod' }))}
                  aria-label="Demo Cash on Delivery"
                />
              </label>

              <label 
                htmlFor="payment-demo-upi"
                className={`payment-option-card ${formData.paymentMethod === 'demo_upi' ? 'active' : ''}`}
              >
                <div className="payment-option-left">
                  <QrCode size={20} color="var(--accent-primary)" />
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>Demo UPI / QR Code Simulation</h4>
                    <p style={{ fontSize: '0.78rem' }}>Simulated instant UPI transfer via GPay / PhonePe / Paytm.</p>
                  </div>
                </div>
                <input 
                  id="payment-demo-upi"
                  type="radio" 
                  name="paymentMethod"
                  value="demo_upi"
                  checked={formData.paymentMethod === 'demo_upi'} 
                  onChange={() => setFormData(p => ({ ...p, paymentMethod: 'demo_upi' }))}
                  aria-label="Demo UPI or QR Code Simulation"
                />
              </label>

              <label 
                htmlFor="payment-demo-card"
                className={`payment-option-card ${formData.paymentMethod === 'demo_card' ? 'active' : ''}`}
              >
                <div className="payment-option-left">
                  <CreditCard size={20} color="var(--accent-lavender-deep)" />
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>Demo Test Card Simulation</h4>
                    <p style={{ fontSize: '0.78rem' }}>Simulated test credit/debit card authorization.</p>
                  </div>
                </div>
                <input 
                  id="payment-demo-card"
                  type="radio" 
                  name="paymentMethod"
                  value="demo_card"
                  checked={formData.paymentMethod === 'demo_card'} 
                  onChange={() => setFormData(p => ({ ...p, paymentMethod: 'demo_card' }))}
                  aria-label="Demo Test Card Simulation"
                />
              </label>
            </div>

            {/* Order Summary Box */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Recipient:</span>
                <strong>{formData.fullName} ({formData.city})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Items:</span>
                <strong>{totalItems} items</strong>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-sage)' }}>
                  <span>Promo Discount ({appliedCoupon}):</span>
                  <strong>- ₹{discount}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
                <span>Amount to Pay (Demo):</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
