import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { productService } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const CATEGORIES = ['UI Kits', 'Templates', 'Icons', 'Illustrations', 'Fonts', 'Photography', 'Music', 'Video', 'Plugins', 'Other'];

const emptyForm = { title: '', description: '', price: '', imageUrl: '', category: 'UI Kits', tags: '', fileUrl: '', isActive: true };

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(product ? { ...product, tags: product.tags?.join(', ') || '', price: String(product.price) } : emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = 'Valid price required';
    if (!form.imageUrl.trim()) errs.imageUrl = 'Image URL is required';
    if (!form.category) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    try {
      if (product) {
        await productService.update(product._id, payload);
        toast.success('Product updated!');
      } else {
        await productService.create(payload);
        toast.success('Product created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} placeholder="e.g. Premium UI Kit" />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-input form-textarea" value={form.description} onChange={handleChange} placeholder="Describe the asset..." rows={3} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input type="number" name="price" className="form-input" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-input form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input type="url" name="imageUrl" className="form-input" value={form.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
            {errors.imageUrl && <span className="form-error">{errors.imageUrl}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">File URL (optional)</label>
            <input type="text" name="fileUrl" className="form-input" value={form.fileUrl} onChange={handleChange} placeholder="Download link" />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input type="text" name="tags" className="form-input" value={form.tags} onChange={handleChange} placeholder="react, ui, dashboard" />
          </div>

          {product && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--color-accent)' }} />
              <label htmlFor="isActive" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Active (visible in store)</label>
            </div>
          )}

          {form.imageUrl && (
            <div>
              <label className="form-label" style={{ marginBottom: 8 }}>Preview</label>
              <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" />&nbsp;Saving...</> : <><Check size={14} />{product ? 'Update' : 'Create'} Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | product object
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAdminAll({ page, limit: 15 });
      setProducts(res.data.data.products);
      setTotalPages(res.data.data.pages);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = () => {
    setModal(null);
    fetchProducts();
  };

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-subtitle">Manage your digital asset catalog</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('create')}>
            <Plus size={16} />Add Product
          </button>
        </div>
      </div>

      {loading ? <Spinner text="Loading products..." /> : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Downloads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={p.imageUrl} alt={p.title} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.target.src = 'https://placehold.co/96x64/f1f5f9/94a3b8?text=IMG'} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.tags?.slice(0,2).map(t=>`#${t}`).join(' ')}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{p.category}</span></td>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{p.price === 0 ? 'Free' : `$${p.price.toFixed(2)}`}</span></td>
                    <td><span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>{p.downloads}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setModal(p)} title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p._id)} disabled={deleting === p._id} title="Delete">
                          {deleting === p._id ? <span className="spinner spinner-sm" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>No products yet. Create one!</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>›</button>
            </div>
          )}
        </>
      )}

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminProducts;
