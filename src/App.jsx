import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Signup from './components/Signup'
import TodoApp from './components/TodoApp'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => {
          setUser(res.data)
          setView('todos')
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    setView('todos')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setView('login')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      {user && (
        <div className="navbar">
          <h1>Memory</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      )}

      <div className="container">
        {view === 'login' && (
          <Login onSuccess={handleLoginSuccess} onSignupClick={() => setView('signup')} />
        )}
        {view === 'signup' && (
          <Signup onSuccess={handleLoginSuccess} onLoginClick={() => setView('login')} />
        )}
        {view === 'todos' && (
          <TodoApp user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  )
}

export default App
