import React from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.title}</span>
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-btn"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
};

export default TodoItem;
