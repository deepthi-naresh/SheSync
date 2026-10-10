import React from 'react';
import { 
  Star, 
  Plus, 
  Check, 
  Eye, 
  Shield, 
  Baby, 
  HeartHandshake, 
  Coffee, 
  Sparkles, 
  Leaf, 
  Package, 
  Sun, 
  Droplet, 
  Moon, 
  Apple, 
  Zap, 
  Feather, 
  Heart, 
  Smile 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './ProductCard.css';

const ICON_MAP = {
  Shield, Baby, HeartHandshake, Coffee, Sparkles, Leaf, Package,
  Sun, Droplet, Moon, Apple, Zap, Feather, Heart, Smile
};

export default function ProductCard({ product, onSelectProduct }) {
  const { cartItems, addToCart } = useCart();
  const { showToast } = useToast();

  const cartItem = cartItems.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.qty : 0;

  const IconComponent = ICON_MAP[product.iconName] || Sparkles;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  return (
    <div 
      className="product-card" 
      onClick={() => onSelectProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelectProduct(product);
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Visual Product Fallback Banner */}
      <div 
        className="product-image-container" 
        style={{ backgroundColor: product.imageFallbackColor || 'var(--bg-tertiary)' }}
      >
        <span className={`badge ${product.badgeColor || 'badge-sage'} product-badge-float`}>
          {product.badge}
        </span>
        <div className="product-illustration-fallback">
          <div className="product-visual-icon">
            <IconComponent size={28} />
          </div>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="product-body">
        <span className="product-category-tag">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>

        <div className="product-rating">
          <Star size={13} color="var(--accent-amber)" fill="var(--accent-amber)" />
          <span>{product.rating}</span>
        </div>

        <p className="product-desc">{product.shortDesc}</p>

        {/* Card Footer: Price & Add Actions */}
        <div className="product-footer">
          <div className="product-price-box">
            <span className="price-currency">Demo Price</span>
            <span className="price-val">₹{product.price}</span>
          </div>

          <div className="product-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className={`btn ${inCartQty > 0 ? 'btn-secondary' : 'btn-primary'}`}
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              {inCartQty > 0 ? (
                <>
                  <Check size={14} /> Added ({inCartQty})
                </>
              ) : (
                <>
                  <Plus size={14} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
