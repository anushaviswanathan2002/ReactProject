import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, LogOut, Search, Heart } from 'lucide-react'
import './MemoryApp.css'

export default function MemoryApp({ user, onLogout }) {
  const [memories, setMemories] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [favorites, setFavorites] = useState([])
  const navigate = useNavigate()

  // Load memories from localStorage
  useEffect(() => {
    const storedMemories = localStorage.getItem(`memories_${user.id}`)
    const storedFavorites = localStorage.getItem(`favorites_${user.id}`)
    if (storedMemories) {
      setMemories(JSON.parse(storedMemories))
    }
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [user.id])

  // Save memories to localStorage
  useEffect(() => {
    localStorage.setItem(`memories_${user.id}`, JSON.stringify(memories))
  }, [memories, user.id])

  useEffect(() => {
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites))
  }, [favorites, user.id])

  const addMemory = () => {
    if (!title.trim() || !content.trim()) return

    if (editingId) {
      setMemories(memories.map(m =>
        m.id === editingId
          ? { ...m, title, content, updatedAt: new Date().toISOString() }
          : m
      ))
      setEditingId(null)
    } else {
      const newMemory = {
        id: Date.now(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setMemories([newMemory, ...memories])
    }

    setTitle('')
    setContent('')
  }

  const deleteMemory = (id) => {
    setMemories(memories.filter(m => m.id !== id))
    setFavorites(favorites.filter(fav => fav !== id))
  }

  const startEdit = (memory) => {
    setTitle(memory.title)
    setContent(memory.content)
    setEditingId(memory.id)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const filteredMemories = memories.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const favoriteMemories = filteredMemories.filter(m => favorites.includes(m.id))
  const otherMemories = filteredMemories.filter(m => !favorites.includes(m.id))
  const displayedMemories = [...favoriteMemories, ...otherMemories]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="memory-app">
      <header className="app-header">
        <div className="header-left">
          <h1>📝 My Memories</h1>
          <p className="welcome-text">Welcome, {user.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          Sign Out
        </button>
      </header>

      <div className="app-content">
        <div className="editor-section">
          <h2>{editingId ? 'Edit Memory' : 'Create New Memory'}</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Memory title..."
            className="title-input"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your memory here..."
            className="content-input"
          />
          <div className="button-group">
            <button onClick={addMemory} className="add-btn">
              <Plus size={20} />
              {editingId ? 'Update Memory' : 'Save Memory'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null)
                  setTitle('')
                  setContent('')
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="memories-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memories..."
            />
          </div>

          {displayedMemories.length === 0 ? (
            <div className="empty-state">
              <p>No memories yet. Create your first one!</p>
            </div>
          ) : (
            <div className="memories-grid">
              {displayedMemories.map((memory) => (
                <div key={memory.id} className={`memory-card ${favorites.includes(memory.id) ? 'favorite' : ''}`}>
                  <div className="memory-header">
                    <h3>{memory.title}</h3>
                    <button
                      onClick={() => toggleFavorite(memory.id)}
                      className={`favorite-btn ${favorites.includes(memory.id) ? 'active' : ''}`}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <p className="memory-content">{memory.content}</p>
                  <div className="memory-footer">
                    <span className="memory-date">
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </span>
                    <div className="memory-actions">
                      <button
                        onClick={() => startEdit(memory)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
