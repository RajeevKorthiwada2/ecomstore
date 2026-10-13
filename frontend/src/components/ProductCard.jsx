import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img
        src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
        alt={product.name}
        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
      />
      <h3>{product.name}</h3>
      <p style={{ color: '#6b7280', minHeight: 20 }}>
        {product.category?.name || 'Uncategorized'}
      </p>
      <p style={{ fontWeight: 700 }}>${Number(product.price).toFixed(2)}</p>
      <p style={{ fontSize: '0.85rem', color: product.stockQuantity > 0 ? '#16a34a' : '#dc2626' }}>
        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
      </p>
      <Link to={`/products/${product.id}`}>
        <button className="primary" style={{ width: '100%' }}>View</button>
      </Link>
    </div>
  )
}
