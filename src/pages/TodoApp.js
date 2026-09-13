import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const storedTodos = localStorage.getItem(`todos_${user.email}`);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    }
  }, [user]);

  const saveTodos = (updatedTodos) => {
    setTodos(updatedTodos);
    if (user) {
      localStorage.setItem(`todos_${user.email}`, JSON.stringify(updatedTodos));
    }
  };

  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-app">
      <header className="todo-header">
        <div className="header-content">
          <h1>📝 Memory Todo</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="todo-main">
        <div className="todo-container">
          <div className="todo-stats">
            <div className="stat">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{totalCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{totalCount - completedCount}</span>
            </div>
          </div>

          <TodoForm onAddTodo={addTodo} />

          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />

          {todos.length === 0 && (
            <div className="empty-state">
              <p>✨ No todos yet! Add one to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoApp;
