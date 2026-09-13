import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import bcryptjs from 'bcryptjs'
import jwt_simple from 'jwt-simple'
import path from 'path'
import { fileURLToPath } from 'url'

const jwt = jwt_simple

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const SECRET_KEY = 'your-secret-key-change-in-production'
const DB_PATH = path.join(__dirname, 'app.db')

// Middleware
app.use(cors())
app.use(express.json())

// Database initialization
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Database error:', err)
  else {
    console.log('Connected to SQLite database')
    initializeDatabase()
  }
})

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Todos table
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
  })
}

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.decode(token, SECRET_KEY)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Routes - Auth

app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  const hashedPassword = bcryptjs.hashSync(password, 10)

  db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email already exists' })
        }
        return res.status(500).json({ error: 'Signup failed' })
      }

      const token = jwt.encode({ id: this.lastID }, SECRET_KEY)
      res.json({
        user: { id: this.lastID, email },
        token
      })
    }
  )
})

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = bcryptjs.compareSync(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.encode({ id: user.id }, SECRET_KEY)
    res.json({
      user: { id: user.id, email: user.email },
      token
    })
  })
})

app.get('/auth/me', authMiddleware, (req, res) => {
  db.get('SELECT id, email FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'User not found' })
    }
    res.json(user)
  })
})

// Routes - Todos

app.get('/todos', authMiddleware, (req, res) => {
  db.all(
    'SELECT id, title, completed FROM todos WHERE user_id = ? ORDER BY created_at DESC',
    [req.userId],
    (err, todos) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch todos' })
      res.json(todos || [])
    }
  )
})

app.post('/todos', authMiddleware, (req, res) => {
  const { title } = req.body

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title required' })
  }

  db.run(
    'INSERT INTO todos (user_id, title, completed) VALUES (?, ?, 0)',
    [req.userId, title],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to create todo' })
      res.json({
        id: this.lastID,
        title,
        completed: false
      })
    }
  )
})

app.put('/todos/:id', authMiddleware, (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  db.run(
    'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?',
    [completed ? 1 : 0, id, req.userId],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to update todo' })
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' })
      }
      res.json({
        id: parseInt(id),
        completed
      })
    }
  )
})

app.delete('/todos/:id', authMiddleware, (req, res) => {
  const { id } = req.params

  db.run(
    'DELETE FROM todos WHERE id = ? AND user_id = ?',
    [id, req.userId],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to delete todo' })
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' })
      }
      res.json({ success: true })
    }
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
