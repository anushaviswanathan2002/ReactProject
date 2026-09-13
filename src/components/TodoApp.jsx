import { useState, useEffect } from 'react'
import axios from 'axios'
import './TodoApp.css'

function TodoApp({ user }) {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/todos')
      setTodos(res.data)
      setError('')
    } catch (err) {
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const res = await axios.post('/api/todos', { title: newTodo })
      setTodos([...todos, res.data])
      setNewTodo('')
      setError('')
    } catch (err) {
      setError('Failed to add todo')
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, { completed: !completed })
      setTodos(todos.map(t => t.id === id ? res.data : t))
      setError('')
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter(t => t.id !== id))
      setError('')
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  const completedCount = todos.filter(t => t.completed).length

  if (loading) {
    return <div className="todo-container"><div className="loading-text">Loading your todos...</div></div>
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h2>My To-Dos</h2>
          <div className="progress">
            {completedCount} / {todos.length} completed
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-btn">Add</button>
        </form>

        <div className="todos-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No todos yet. Add one to get started! 🚀</p>
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="todo-checkbox"
                />
                <span className="todo-title">{todo.title}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoApp
