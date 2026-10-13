import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Cart() {
  const [items, setItems] = useState([])
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)
  const navigate = useNavigate()

  const fetchCart = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setItems(data)
    } catch (err) {
      setError('Could not load cart.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`)
    fetchCart()
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )

  const handleCheckout = async (e) => {
    e.preventDefault()
    setError('')
    setPlacing(true)
    try {
      await api.post('/orders', { shippingAddress: address })
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order.')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <p>Loading cart...</p>

  return (
    <div>
      <h1>Your Cart</h1>
      {error && <p className="error-text">{error}</p>}

      {items.length === 0 ? (
        <p>Your cart is empty. Go add some products!</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <strong>{item.product.name}</strong>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Qty: {item.quantity} × ${Number(item.product.price).toFixed(2)}
                </p>
              </div>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>

          <form onSubmit={handleCheckout} className="card" style={{ maxWidth: 400 }}>
            <label>Shipping Address</label>
            <textarea
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="primary" type="submit" disabled={placing}>
              {placing ? 'Placing order...' : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
