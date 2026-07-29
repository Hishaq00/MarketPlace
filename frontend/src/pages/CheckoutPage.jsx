import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/cartSlice';
import { orderService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', card: '4242 4242 4242 4242', expiry: '12/28', cvv: '123' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item._id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
      }));
      const res = await orderService.create({ items: orderItems, totalPrice: total });
      setOrderId(res.data.data._id);
      dispatch(clearCart());
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="container empty-state" style={{ minHeight: '70vh' }}>
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Go Shopping</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: 'calc(100vh - var(--navbar-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }} className="fade-in-up">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={48} color="var(--color-accent)" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>Order Confirmed! 🎉</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            Thank you for your purchase. Your digital assets are ready.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 32, fontFamily: 'monospace' }}>
            Order ID: {orderId}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">View Orders</Link>
            <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/cart" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 style={{ fontSize: '1.75rem', marginBottom: 32 }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16 }}>
              <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><span>Contact Information</span></h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><CreditCard size={18} />Payment Details</h3>
              <div style={{ background: 'var(--color-accent-muted)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, fontSize: '0.8rem', color: 'var(--color-accent-dark)', fontWeight: 500 }}>
                🧪 This is a mock checkout. No real payment is processed.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input type="text" name="card" className="form-input" value={form.card} onChange={handleChange} maxLength={19} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input type="text" name="expiry" className="form-input" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input type="text" name="cvv" className="form-input" value={form.cvv} onChange={handleChange} placeholder="123" maxLength={4} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 20 }} disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" />&nbsp;Processing...</> : <><ShieldCheck size={16} />Pay ${total.toFixed(2)}</>}
            </button>
          </form>

          {/* Summary */}
          <div>
            <div className="order-summary">
              <h2 className="order-summary-title">Order Summary</h2>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.target.src = 'https://placehold.co/96x64/f1f5f9/94a3b8?text=Asset'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>×{item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="summary-row"><span>Processing fee</span><span>$0.00</span></div>
              <div className="summary-row summary-total"><span>Total</span><span style={{ color: 'var(--color-accent)' }}>${total.toFixed(2)}</span></div>
              <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
                256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
