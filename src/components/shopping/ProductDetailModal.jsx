import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Plus, 
  Minus, 
  Star, 
  ShieldCheck, 
  Info, 
  ShoppingCart, 
  AlertCircle 
} from 'lucide-react';
import Modal from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const existingInCart = cartItems.find((i) => i.id === product.id);

  const handleAdd = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} × "${product.name}" to cart!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      maxWidth="600px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
          {/* Quantity Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <button
              className="btn-icon"
              style={{ width: '28px', height: '28px' }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              className="btn-icon"
              style={{ width: '28px', height: '28px' }}
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Trigger */}
          <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1 }}>
            <ShoppingCart size={16} /> Add to Cart • ₹{product.price * quantity}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
        {/* Header Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${product.badgeColor || 'badge-sage'}`}>
              {product.badge}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
              {product.category}
            </span>
          </div>

          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            ₹{product.price}
          </div>
        </div>

        {/* Full Product Description */}
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {product.fullDesc || product.shortDesc}
        </p>

        {/* Highlights List */}
        {product.highlights && product.highlights.length > 0 && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Product Key Features & Standards:
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
              {product.highlights.map((hl, idx) => (
                <li key={idx}><strong>{hl}</strong></li>
              ))}
            </ul>
          </div>
        )}

        {/* Comfort Food & Pregnancy Safety Notices */}
        {product.category === 'comfort' && (
          <div style={{ padding: '10px 12px', background: 'var(--accent-amber-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid var(--accent-amber)' }}>
            <Info size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
              <strong>Comfort Pick Advisory:</strong> Nourishing snacks support balanced daily energy and sensory comfort. They are not medical cures or replacements for clinical dysmenorrhea therapies.
            </span>
          </div>
        )}

        {product.category === 'maternity' && (
          <div style={{ padding: '10px 12px', background: 'var(--accent-sage-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid var(--accent-sage)' }}>
            <ShieldCheck size={16} color="var(--accent-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
              <strong>Maternal Care Advisory:</strong> Formulated for comfort during pregnancy and postpartum recovery. Always consult your obstetrician before introducing herbal infusions.
            </span>
          </div>
        )}

        {/* Demo Mode Notice */}
        <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
          * Demo Store Simulation: No monetary charge or actual product shipment is processed.
        </div>
      </div>
    </Modal>
  );
}
