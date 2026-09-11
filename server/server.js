import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// In-memory database
const users = new Map();
const memories = new Map(); // userId -> array of memories

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (users.has(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userId = Date.now().toString();

    users.set(email, {
      id: userId,
      email,
      name,
      password: hashedPassword,
    });

    memories.set(userId, []);

    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: userId, email, name },
    });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Memory Routes
app.get('/api/memories', verifyToken, (req, res) => {
  try {
    const userMemories = memories.get(req.userId) || [];
    res.json(userMemories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

app.post('/api/memories', verifyToken, (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const memory = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    if (!memories.has(req.userId)) {
      memories.set(req.userId, []);
    }

    memories.get(req.userId).push(memory);

    res.json(memory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

app.put('/api/memories/:id', verifyToken, (req, res) => {
  try {
    const { title, content } = req.body;
    const userMemories = memories.get(req.userId) || [];
    const memory = userMemories.find(m => m.id === req.params.id);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    memory.title = title || memory.title;
    memory.content = content || memory.content;

    res.json(memory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

app.delete('/api/memories/:id', verifyToken, (req, res) => {
  try {
    const userMemories = memories.get(req.userId) || [];
    const index = userMemories.findIndex(m => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    userMemories.splice(index, 1);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

app.listen(PORT, () => {
  console.log(`Memory app server running on port ${PORT}`);
});
