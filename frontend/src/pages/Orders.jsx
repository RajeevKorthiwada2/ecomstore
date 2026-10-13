import { useEffect, useState } from 'react'
import api from '../api/axios'

const statusColors = {
  PENDING: '#f59e0b',
  PAID: '#2563eb',
  SHIPPED: '#7c3aed',
  DELIVERED: '#16a34a',
  CANCELLED: '#dc2626',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my').then((res) => {
      setOrders(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Loading orders...</p>
  if (orders.length === 0) return <p>You haven't placed any orders yet.</p>

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Order #{order.id}</strong>
            <span style={{ color: statusColors[order.status] || '#374151', fontWeight: 600 }}>
              {order.status}
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName} × {item.quantity} — ${Number(item.priceAtPurchase).toFixed(2)} each
              </li>
            ))}
          </ul>
          <p><strong>Total: ${Number(order.totalAmount).toFixed(2)}</strong></p>
          <p style={{ color: '#6b7280' }}>Ship to: {order.shippingAddress}</p>
        </div>
      ))}
    </div>
  )
}
