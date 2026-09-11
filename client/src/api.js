const API_URL = 'http://localhost:5000/api';

export const api = {
  async signup(email, password, name) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  async getMemories(token) {
    const response = await fetch(`${API_URL}/memories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch memories');
    return response.json();
  },

  async createMemory(token, title, content) {
    const response = await fetch(`${API_URL}/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) throw new Error('Failed to create memory');
    return response.json();
  },

  async updateMemory(token, id, title, content) {
    const response = await fetch(`${API_URL}/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) throw new Error('Failed to update memory');
    return response.json();
  },

  async deleteMemory(token, id) {
    const response = await fetch(`${API_URL}/memories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete memory');
    return response.json();
  },
};
