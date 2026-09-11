import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import MemoryApp from './pages/MemoryApp'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (email) => {
    const userData = { email, id: Date.now() }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/memories" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/memories" /> : <SignUp onSignUp={handleLogin} />}
        />
        <Route
          path="/memories"
          element={user ? <MemoryApp user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={user ? <Navigate to="/memories" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}
