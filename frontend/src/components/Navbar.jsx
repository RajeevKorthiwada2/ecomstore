import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">EcomStore</Link>
      <div className="nav-links">
        <Link to="/">Products</Link>
        {user && <Link to="/orders">My Orders</Link>}
        {user && <Link to="/cart">Cart</Link>}
        {isAdmin() && <Link to="/admin">Admin</Link>}

        {user ? (
          <>
            <span className="nav-user">Hi, {user.fullName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
