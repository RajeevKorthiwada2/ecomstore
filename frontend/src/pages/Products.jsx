import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async (query = '') => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/products', { params: { search: query, size: 20 } })
      setProducts(data.content || [])
    } catch (err) {
      setError('Could not load products. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(search)
  }

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={handleSearch} style={{ maxWidth: 400, display: 'flex', gap: 8 }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ margin: 0 }}
        />
        <button className="primary" type="submit">Search</button>
      </form>

      {loading && <p>Loading products...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      <div className="product-grid" style={{ marginTop: 20 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
