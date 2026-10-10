import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Search, 
  X, 
  Sparkles, 
  Coffee, 
  ShieldCheck, 
  History, 
  Tag, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS_CATALOG, STORE_CATEGORIES } from '../../data/productsData';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import OrderReceiptModal from './OrderReceiptModal';
import Modal from '../common/Modal';
import './ShoppingView.css';

export default function ShoppingView() {
  const { totalItems, grandTotal, orderHistory } = useCart();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const cleanQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = !cleanQuery || 
        product.name.toLowerCase().includes(cleanQuery) ||
        product.shortDesc.toLowerCase().includes(cleanQuery) ||
        product.category.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts = { all: PRODUCTS_CATALOG.length };
    PRODUCTS_CATALOG.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleOrderComplete = (order) => {
    setActiveReceiptOrder(order);
  };

  return (
    <div className="module-view app-container">
      {/* 1. Store Hero Header */}
      <section className="shopping-hero" aria-label="Wellness Store Header">
        <div className="shopping-hero-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-plum">
              <ShoppingBag size={13} /> Module 2: Wellness Store
            </span>
            <span className="badge badge-amber">Demo Simulation</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {orderHistory.length > 0 && (
              <button 
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={() => setIsOrderHistoryOpen(true)}
              >
                <History size={14} /> Past Orders ({orderHistory.length})
              </button>
            )}

            <button 
              className="btn btn-primary"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open demo cart with ${totalItems} items`}
            >
              <ShoppingCart size={16} />
              <span>Cart ({totalItems})</span>
              {totalItems > 0 && (
                <span style={{ fontSize: '0.82rem', marginLeft: '2px', opacity: 0.9 }}>
                  • ₹{grandTotal}
                </span>
              )}
            </button>
          </div>
        </div>

        <div>
          <h1 className="hero-title">Women's Wellness & Care Essentials</h1>
          <p className="hero-description">
            Discover curated period care, baby essentials, maternity support, and comforting foods. All orders and checkouts run in safe local demonstration mode.
          </p>
        </div>
      </section>

      {/* 2. Distinct Comfort Picks & Nourishing Foods Collection Banner */}
      <div className="comfort-collection-banner">
        <div className="comfort-banner-text">
          <div className="comfort-banner-title">
            <Coffee size={20} color="var(--accent-amber)" />
            <span>Comfort Picks & Nourishing Foods Collection</span>
          </div>
          <p className="comfort-banner-desc">
            Wholesome dark chocolate, mineral-rich nuts, whole oats, and herbal teas. 
            <em> Note: Foods support general nourishment and daily comfort, but are not clinical treatments or medical cures for cramps.</em>
          </p>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setActiveCategory('comfort');
            showToast('Showing Comfort Picks & Nourishing Foods', 'info');
          }}
        >
          View Comfort Picks ({categoryCounts.comfort || 0})
        </button>
      </div>

      {/* 3. Toolbar: Search Bar & Category Filter Tabs */}
      <div className="store-toolbar">
        {/* Search Input */}
        <div className="store-search-box">
          <Search size={16} className="search-icon-float" />
          <input
            type="text"
            className="store-search-input"
            placeholder="Search period care, baby wipes, dark chocolate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search wellness products"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="category-filter-bar" role="tablist" aria-label="Product categories">
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                showToast(`Filtered by ${cat.label}`, 'info');
              }}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <span>{cat.label}</span>
              <span className="category-count-badge">{categoryCounts[cat.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="solid-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
          <ShoppingBag size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <h3>No products found</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
            No products match "{searchQuery}". Try a different keyword or reset filters.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      {/* 4. Order Receipt Modal */}
      <OrderReceiptModal
        order={activeReceiptOrder}
        isOpen={Boolean(activeReceiptOrder)}
        onClose={() => setActiveReceiptOrder(null)}
      />

      {/* 5. Past Order History Modal */}
      {isOrderHistoryOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsOrderHistoryOpen(false)}
          title={`Simulated Order History (${orderHistory.length})`}
          maxWidth="640px"
          footer={
            <button className="btn btn-primary" onClick={() => setIsOrderHistoryOpen(false)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orderHistory.map((ord) => (
              <div 
                key={ord.orderId} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px', 
                  background: 'var(--bg-tertiary)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)' 
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{ord.orderId}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {ord.date} • {ord.items.length} items
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-sage)', fontWeight: 600, marginTop: '2px' }}>
                    ✓ {ord.status}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>₹{ord.grandTotal}</div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={() => {
                      setIsOrderHistoryOpen(false);
                      setActiveReceiptOrder(ord);
                    }}
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
