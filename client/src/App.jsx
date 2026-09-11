import { useState, useEffect } from 'react';
import { AuthPage } from './AuthPage';
import { MemoryModal } from './MemoryModal';
import { MemoryCard } from './MemoryCard';
import { api } from './api';
import './index.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      loadMemories(savedToken);
    }
  }, []);

  const loadMemories = async (authToken) => {
    try {
      setLoading(true);
      const data = await api.getMemories(authToken);
      setMemories(data);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    loadMemories(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setMemories([]);
    setEditingMemory(null);
  };

  const handleSaveMemory = async (data) => {
    try {
      if (editingMemory) {
        const updated = await api.updateMemory(token, editingMemory.id, data.title, data.content);
        setMemories(memories.map(m => m.id === editingMemory.id ? updated : m));
      } else {
        const newMemory = await api.createMemory(token, data.title, data.content);
        setMemories([newMemory, ...memories]);
      }
      setShowModal(false);
      setEditingMemory(null);
    } catch (err) {
      alert('Error saving memory: ' + err.message);
    }
  };

  const handleEditMemory = (memory) => {
    setEditingMemory(memory);
    setShowModal(true);
  };

  const handleDeleteMemory = async (id) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      try {
        await api.deleteMemory(token, id);
        setMemories(memories.filter(m => m.id !== id));
      } catch (err) {
        alert('Error deleting memory: ' + err.message);
      }
    }
  };

  const openAddModal = () => {
    setEditingMemory(null);
    setShowModal(true);
  };

  if (!token) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1>📝 Memories</h1>
        <div className="user-info">
          <p>Logged in as:</p>
          <p className="user-name">{user.name}</p>
          <p>{user.email}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>My Memories</h2>
          <button className="add-memory-btn" onClick={openAddModal}>
            + Add Memory
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Loading memories...
          </div>
        ) : memories.length === 0 ? (
          <div className="empty-state">
            <h3>No memories yet</h3>
            <p>Create your first memory by clicking "Add Memory" button</p>
          </div>
        ) : (
          <div className="memories-grid">
            {memories.map(memory => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onEdit={handleEditMemory}
                onDelete={handleDeleteMemory}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <MemoryModal
          memory={editingMemory}
          onSave={handleSaveMemory}
          onCancel={() => {
            setShowModal(false);
            setEditingMemory(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
