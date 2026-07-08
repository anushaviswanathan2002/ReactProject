import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>React Dev Server Test</h1>
        <div className="counter-display">
          <p className="counter-label">Counter:</p>
          <p className="counter-value">{count}</p>
        </div>
        <button className="increment-button" onClick={handleIncrement}>
          Increment
        </button>
      </div>
    </div>
  );
}

export default App;
