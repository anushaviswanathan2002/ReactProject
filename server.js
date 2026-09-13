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

    // Scores table (one best score per user per difficulty)
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        moves INTEGER NOT NULL,
        time_seconds INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, difficulty)
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

// Routes - Scores

// Submit a finished game score. Keeps only the best score
// (fewest moves, then fastest time) per user + difficulty.
app.post('/scores', authMiddleware, (req, res) => {
  const { difficulty, moves, time_seconds } = req.body

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty' })
  }
  if (!Number.isInteger(moves) || moves < 1) {
    return res.status(400).json({ error: 'Invalid moves value' })
  }
  if (!Number.isInteger(time_seconds) || time_seconds < 0) {
    return res.status(400).json({ error: 'Invalid time value' })
  }

  db.get(
    'SELECT * FROM scores WHERE user_id = ? AND difficulty = ?',
    [req.userId, difficulty],
    (err, existing) => {
      if (err) return res.status(500).json({ error: 'Failed to save score' })

      if (!existing) {
        db.run(
          'INSERT INTO scores (user_id, difficulty, moves, time_seconds) VALUES (?, ?, ?, ?)',
          [req.userId, difficulty, moves, time_seconds],
          (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save score' })
            res.json({ saved: true, new_best: true })
          }
        )
      } else {
        const better =
          moves < existing.moves ||
          (moves === existing.moves && time_seconds < existing.time_seconds)
        if (!better) {
          return res.json({ saved: false, new_best: false })
        }
        db.run(
          'UPDATE scores SET moves = ?, time_seconds = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
          [moves, time_seconds, existing.id],
          (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save score' })
            res.json({ saved: true, new_best: true })
          }
        )
      }
    }
  )
})

// Best scores of the current user (all difficulties)
app.get('/scores/me', authMiddleware, (req, res) => {
  db.all(
    'SELECT difficulty, moves, time_seconds, created_at FROM scores WHERE user_id = ?',
    [req.userId],
    (err, scores) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch scores' })
      res.json(scores || [])
    }
  )
})

// Global leaderboard, best across all users per difficulty
app.get('/scores/leaderboard', (req, res) => {
  db.all(
    `SELECT u.email, s.difficulty, s.moves, s.time_seconds
     FROM scores s
     JOIN users u ON u.id = s.user_id
     ORDER BY s.difficulty ASC, s.moves ASC, s.time_seconds ASC
     LIMIT 100`,
    (err, scores) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch leaderboard' })
      res.json(scores || [])
    }
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
