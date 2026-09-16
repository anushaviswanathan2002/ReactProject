import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Signup from './components/Signup'
import MemoryGame from './components/MemoryGame'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    verifyUser()
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleSignupSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('login')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      {user ? (
        <MemoryGame user={user} onLogout={handleLogout} />
      ) : (
        <>
          {currentView === 'login' ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              switchToSignup={() => setCurrentView('signup')}
            />
          ) : (
            <Signup
              onSignupSuccess={handleSignupSuccess}
              switchToLogin={() => setCurrentView('login')}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
