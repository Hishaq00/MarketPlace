import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { orderService } from '../services/api';
import Spinner from '../components/ui/Spinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner text="Loading orders..." />;

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>My Orders</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={56} className="empty-state-icon" />
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-desc">Browse our store and purchase your first digital asset!</p>
            <Link to="/" className="btn btn-primary">Browse Store</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 20, transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-green"><CheckCircle size={10} />&nbsp;Completed</span>
                    </div>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-accent)' }}>${order.totalPrice.toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                      <Clock size={11} />{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.imageUrl || 'https://placehold.co/80x52/f1f5f9/94a3b8?text=Asset'} alt={item.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.target.src='https://placehold.co/80x52/f1f5f9/94a3b8?text=Asset'} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>×{item.quantity} • ${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
