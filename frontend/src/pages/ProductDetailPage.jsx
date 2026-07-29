import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Tag, Download, Star, Package } from 'lucide-react';
import { productService } from '../services/api';
import { addToCart, selectCartItems } from '../redux/cartSlice';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  'UI Kits': 'badge-blue', 'Templates': 'badge-green', 'Icons': 'badge-yellow',
  'Illustrations': 'badge-red', 'Fonts': 'badge-gray', 'Other': 'badge-gray',
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cartItems = useSelector(selectCartItems);
  const inCart = cartItems.some(i => i._id === id);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productService.getById(id);
        setProduct(res.data.data);
      } catch {
        setError('Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`"${product.title}" added to cart!`);
  };

  if (loading) return <Spinner text="Loading product..." />;
  if (error || !product) return (
    <div className="container empty-state" style={{ minHeight: '60vh' }}>
      <Package size={56} className="empty-state-icon" />
      <h3 className="empty-state-title">{error || 'Product not found'}</h3>
      <Link to="/" className="btn btn-primary">Back to Store</Link>
    </div>
  );

  return (
    <div className="section-sm fade-in">
      <div className="container">
        <Link to="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          {/* Left: Image */}
          <div>
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', aspectRatio: '16/9', background: 'var(--color-bg-elevated)' }}>
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = `https://placehold.co/800x450/f1f5f9/94a3b8?text=${encodeURIComponent(product.category)}`; }}
              />
            </div>

            {/* Details */}
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>About this Asset</h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>{product.description}</p>
              </div>
              {product.tags?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Tag size={14} />Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {product.tags.map(t => <span key={t} className="tag-chip">#{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Purchase card */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-h) + 24px)' }}>
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 28, boxShadow: 'var(--shadow-md)' }}>
              <span className={`badge ${CATEGORY_COLORS[product.category] || 'badge-gray'}`} style={{ marginBottom: 12, display: 'inline-flex' }}>
                {product.category}
              </span>
              <h1 style={{ fontSize: '1.4rem', marginBottom: 12, lineHeight: 1.35 }}>{product.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} fill="var(--color-warning)" color="var(--color-warning)" />{product.rating?.toFixed(1) || '0.0'} rating</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Download size={13} />{product.downloads} downloads</span>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                  {product.price === 0 ? 'Free' : `$${product.price.toFixed(2)}`}
                </div>
                {product.price > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>One-time purchase, lifetime access</p>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn btn-primary btn-full btn-lg" onClick={handleAddToCart} disabled={inCart}>
                  <ShoppingCart size={16} />
                  {inCart ? 'Added to Cart' : (product.price === 0 ? 'Get for Free' : 'Add to Cart')}
                </button>
                {inCart && (
                  <Link to="/cart" className="btn btn-secondary btn-full">View Cart</Link>
                )}
              </div>

              <div className="divider" />

              {/* Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Seller', value: product.seller?.name || 'AssetVault' },
                  { label: 'Category', value: product.category },
                  { label: 'Updated', value: new Date(product.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
