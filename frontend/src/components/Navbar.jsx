import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Zap, Menu, X, LayoutDashboard, LogOut, User, Package } from 'lucide-react';
import { logout } from '../redux/authSlice';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../redux/cartSlice';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropOpen(false);
    navigate('/');
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            AssetVault
          </Link>

          {/* Nav Links */}
          <div className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Store</NavLink>
            {isAuthenticated && !isAdmin && (
              <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Orders</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            )}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={16} />
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu" ref={dropRef}>
                <button className="user-avatar-btn" onClick={() => setDropOpen(p => !p)}>
                  <div className="avatar-circle">{initials}</div>
                  <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name?.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div className="dropdown">
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
                    </div>
                    {isAdmin ? (
                      <button className="dropdown-item" onClick={() => { navigate('/admin'); setDropOpen(false); }}>
                        <LayoutDashboard size={14} /> Dashboard
                      </button>
                    ) : (
                      <button className="dropdown-item" onClick={() => { navigate('/orders'); setDropOpen(false); }}>
                        <Package size={14} /> My Orders
                      </button>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}

            <button className="mobile-toggle" onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
