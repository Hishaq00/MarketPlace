import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { productService, orderService, authService } from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="stat-card">
    <div className="stat-icon-wrap" style={{ background: bg }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          productService.getAdminAll({ page: 1, limit: 1 }),
          orderService.getAll(),
          authService.getAllUsers(),
        ]);

        const orders = ordersRes.data.data;
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

        setStats({
          products: productsRes.data.data.total,
          orders: orders.length,
          users: usersRes.data.data.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch {
        setStats({ products: 0, orders: 0, users: 0, revenue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">Welcome back, Admin! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={Package} label="Total Products" value={stats?.products ?? 0} color="#3b82f6" bg="rgba(59,130,246,0.1)" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.orders ?? 0} color="#22c55e" bg="rgba(34,197,94,0.1)" />
        <StatCard icon={Users} label="Registered Users" value={stats?.users ?? 0} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(stats?.revenue ?? 0).toFixed(2)}`} color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Orders</h2>
          <span className="badge badge-green"><TrendingUp size={10} />&nbsp;Live</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <ShoppingBag size={40} className="empty-state-icon" />
            <p className="empty-state-desc">No orders yet</p>
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
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{order._id.slice(-8).toUpperCase()}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.user?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>${order.totalPrice.toFixed(2)}</span></td>
                    <td><span className="badge badge-green">Completed</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
