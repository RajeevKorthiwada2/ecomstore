import { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = { name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const loadData = async () => {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products', { params: { size: 100 } }),
      api.get('/categories'),
    ])
    setProducts(prodRes.data.content || [])
    setCategories(catRes.data || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    }
    try {
      if (editingId) {
        await api.put(`/products/admin/${editingId}`, payload)
      } else {
        await api.post('/products/admin', payload)
      }
      resetForm()
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.')
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || '',
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/products/admin/${id}`)
    loadData()
  }

  return (
    <div>
      <h1>Admin — Manage Products</h1>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 500, marginBottom: 24 }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        {error && <p className="error-text">{error}</p>}

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows={2} value={form.description} onChange={handleChange} />

        <label>Price</label>
        <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />

        <label>Stock Quantity</label>
        <input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} required />

        <label>Image URL (will come from S3 later)</label>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />

        <label>Category</label>
        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">-- None --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="primary" type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <h3>Existing Products ({products.length})</h3>
      {products.map((p) => (
        <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <strong>{p.name}</strong> — ${Number(p.price).toFixed(2)} — {p.stockQuantity} in stock
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
