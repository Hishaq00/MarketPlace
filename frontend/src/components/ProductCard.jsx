import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Eye } from 'lucide-react';
import { addToCart, selectCartItems } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  'UI Kits': 'badge-blue',
  'Templates': 'badge-green',
  'Icons': 'badge-yellow',
  'Illustrations': 'badge-red',
  'Fonts': 'badge-gray',
  'Photography': 'badge-blue',
  'Music': 'badge-yellow',
  'Video': 'badge-red',
  'Plugins': 'badge-gray',
  'Other': 'badge-gray',
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const inCart = cartItems.some(i => i._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`"${product.title}" added to cart!`);
  };

  return (
    <div className="product-card fade-in-up">
      <Link to={`/products/${product._id}`} style={{ display: 'contents' }}>
        <div className="product-card-img">
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            onError={(e) => { e.target.src = `https://placehold.co/400x250/f1f5f9/94a3b8?text=${encodeURIComponent(product.category)}`; }}
          />
          <div className="product-card-category">
            <span className={`badge ${CATEGORY_COLORS[product.category] || 'badge-gray'}`}>
              {product.category}
            </span>
          </div>
        </div>
        <div className="product-card-body">
          <h3 className="product-card-title">{product.title}</h3>
          <p className="product-card-desc">{product.description}</p>
          {product.tags?.length > 0 && (
            <div className="product-card-tags">
              {product.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag-chip">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="product-card-footer">
        <span className="product-price">
          {product.price === 0 ? 'Free' : `$${product.price.toFixed(2)}`}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/products/${product._id}`} className="btn btn-ghost btn-sm btn-icon" title="View details">
            <Eye size={15} />
          </Link>
          <button
            className={`btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleAddToCart}
            title={inCart ? 'In cart' : 'Add to cart'}
          >
            <ShoppingCart size={14} />
            {inCart ? 'In Cart' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
