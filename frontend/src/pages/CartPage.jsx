import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../redux/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <ShoppingCart size={64} className="empty-state-icon" />
            <h2 className="empty-state-title">Your cart is empty</h2>
            <p className="empty-state-desc">Explore our marketplace and add some amazing digital assets!</p>
            <Link to="/" className="btn btn-primary btn-lg">Browse Store</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-grid">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="cart-item-img"
                  onError={e => { e.target.src = `https://placehold.co/144x96/f1f5f9/94a3b8?text=Asset`; }}
                />
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                    <p className="cart-item-title">{item.title}</p>
                  </Link>
                  <p className="cart-item-price">{item.category} • ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}>
                    <Minus size={12} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}>
                    <Plus size={12} />
                  </button>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-accent)', marginBottom: 6 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => dispatch(removeFromCart(item._id))} title="Remove">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="order-summary-title">Order Summary</h2>
            {items.map(item => (
              <div key={item._id} className="summary-row">
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{item.title} ×{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span style={{ color: 'var(--color-accent)' }}>${total.toFixed(2)}</span>
            </div>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/checkout" className="btn btn-primary btn-full btn-lg">
                <ShoppingBag size={16} />
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="btn btn-secondary btn-full">Continue Shopping</Link>
            </div>

            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--color-accent-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-accent-dark)', fontWeight: 500 }}>
              🔒 Secure checkout. Instant digital delivery.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
