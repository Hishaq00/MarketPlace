import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { ShoppingBag } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await orderService.getAll();
        setOrders(res.data.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">View and manage all customer orders</p>
      </div>

      {loading ? <Spinner text="Loading orders..." /> : orders.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={56} className="empty-state-icon" />
          <h3 className="empty-state-title">No orders yet</h3>
          <p className="empty-state-desc">Orders will appear here once customers make purchases.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{order._id.slice(-8).toUpperCase()}</span></td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{order.user?.name || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{order.user?.email}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.875rem' }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>${order.totalPrice.toFixed(2)}</span></td>
                  <td>
                    <span className={`badge ${order.status === 'completed' ? 'badge-green' : order.status === 'pending' ? 'badge-yellow' : 'badge-gray'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'badge-green' : 'badge-red'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
