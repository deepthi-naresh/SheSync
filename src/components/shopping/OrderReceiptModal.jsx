import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Package, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ShoppingBag, 
  Truck 
} from 'lucide-react';
import Modal from '../common/Modal';
import './OrderReceiptModal.css';

export default function OrderReceiptModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Demo Order Receipt: ${order.orderId}`}
      maxWidth="640px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
          <button type="button" className="btn btn-outline" onClick={handlePrint}>
            <Printer size={16} /> Print / Save Invoice
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      }
    >
      <div className="receipt-container">
        {/* Success Confirmation Banner */}
        <div className="receipt-header-banner">
          <CheckCircle2 size={32} color="var(--accent-sage)" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Demo Order Placed Successfully!
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your simulated wellness essentials care package has been logged locally.
            </p>
          </div>
        </div>

        {/* Status Tracking Timeline */}
        <div className="order-timeline-track">
          <div className="timeline-step completed">
            <div className="timeline-dot">✓</div>
            <span>Order Placed</span>
          </div>
          <div style={{ flex: 1, height: '2px', background: 'var(--accent-sage)', margin: '0 4px' }} />
          <div className="timeline-step active">
            <div className="timeline-dot">●</div>
            <span>Packing (Simulated)</span>
          </div>
          <div style={{ flex: 1, height: '2px', background: 'var(--border-color)', margin: '0 4px' }} />
          <div className="timeline-step">
            <div className="timeline-dot" />
            <span>Doorstep Delivery</span>
          </div>
        </div>

        {/* Order Details & Delivery Summary */}
        <div className="grid-2">
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>📦 Delivery Details:</span>
            <div><strong>Recipient:</strong> {order.customer.fullName}</div>
            <div><strong>Address:</strong> {order.customer.address}, {order.customer.city} - {order.customer.pincode}</div>
            <div><strong>Mobile:</strong> {order.customer.phone}</div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>💳 Transaction Details:</span>
            <div><strong>Order ID:</strong> {order.orderId}</div>
            <div><strong>Date:</strong> {order.date}</div>
            <div><strong>Payment Mode:</strong> {order.customer.paymentMethod}</div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.category}</div>
                  </td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td><strong>₹{item.price * item.qty}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', padding: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-sage)', fontWeight: 600 }}>
              <span>Promo Voucher Discount ({order.appliedCoupon}):</span>
              <span>- ₹{order.discount}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Fee:</span>
            <span style={{ color: 'var(--accent-sage)' }}>FREE (Demo)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
            <span>Grand Total Paid (Demo):</span>
            <span>₹{order.grandTotal}</span>
          </div>
        </div>

        {/* Ethical Simulation Notice */}
        <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          * <strong>Demo Simulation Disclosure:</strong> This invoice is an educational demonstration. No actual credit/debit charges were billed, and no physical shipment will occur.
        </div>
      </div>
    </Modal>
  );
}
