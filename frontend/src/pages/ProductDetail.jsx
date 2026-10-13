import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await api.post('/cart', { productId: product.id, quantity: Number(quantity) })
      setMessage('Added to cart!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not add to cart.')
    }
  }

  if (!product) return <p>Loading...</p>

  return (
    <div className="card" style={{ maxWidth: 600, margin: '20px auto' }}>
      <img
        src={product.imageUrl || 'https://placehold.co/600x300?text=No+Image'}
        alt={product.name}
        style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
      />
      <h2>{product.name}</h2>
      <p style={{ color: '#6b7280' }}>{product.description}</p>
      <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>${Number(product.price).toFixed(2)}</p>
      <p>{product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}</p>

      {product.stockQuantity > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '10px 0' }}>
          <input
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: 80, margin: 0 }}
          />
          <button className="primary" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}
