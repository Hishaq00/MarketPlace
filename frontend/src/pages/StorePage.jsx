import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Star, Package } from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';

const CATEGORIES = ['All', 'UI Kits', 'Templates', 'Icons', 'Illustrations', 'Fonts', 'Photography', 'Music', 'Video', 'Plugins', 'Other'];

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, category: category === 'All' ? undefined : category };
      if (search) params.search = search;
      const res = await productService.getAll(params);
      setProducts(res.data.data.products);
      setTotalPages(res.data.data.pages);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounce search — also reset category to 'All' when user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
      if (searchInput) setCategory('All');
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // When a category is clicked, clear the search box
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchInput('');
    setSearch('');
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">
            <TrendingUp size={14} />
            <span>Premium Digital Assets</span>
          </div>
          <h1 className="hero-title">Discover. Download.<br />Create Something Amazing.</h1>
          <p className="hero-subtitle">
            Your go-to marketplace for high-quality UI kits, templates, icons, fonts, and more. Crafted by professionals, ready to use.
          </p>
          <div className="hero-actions">
            <a href="#store" className="btn btn-primary btn-lg">Browse Assets</a>
            <a href="#categories" className="btn btn-ghost btn-lg">View Categories</a>
          </div>
          <div className="hero-stats">
            <div style={{ textAlign: 'center' }}>
              <div className="hero-stat-value">{total > 0 ? `${total}+` : '500+'}</div>
              <div className="hero-stat-label">Digital Assets</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="hero-stat-value">50K+</div>
              <div className="hero-stat-label">Downloads</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="hero-stat-value">4.9</div>
              <div className="hero-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}><Star size={12} fill="currentColor" /> Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Store section */}
      <section className="section-sm" id="store">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar" id="categories">
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search assets, tags..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              <SlidersHorizontal size={14} />
              <span>{total} results</span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="category-pills" style={{ marginBottom: 32 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className={`category-pill ${category === cat ? 'active' : ''}`} onClick={() => handleCategoryChange(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <Spinner text="Loading assets..." />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Package size={56} className="empty-state-icon" />
              <h3 className="empty-state-title">No assets found</h3>
              <p className="empty-state-desc">Try a different search term or category</p>
              <button className="btn btn-primary" onClick={() => { setSearchInput(''); setCategory('All'); }}>Clear filters</button>
            </div>
          ) : (
            <>
              <div className="bento-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default StorePage;
