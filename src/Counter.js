import React, { useState } from 'react';
import './Counter.css';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h1 className="counter-title">Counter</h1>
      <p className="counter-value">{count}</p>
      <div className="counter-buttons">
        <button className="btn btn-decrement" onClick={() => setCount(c => c - 1)}>−</button>
        <button className="btn btn-reset" onClick={() => setCount(0)}>Reset</button>
        <button className="btn btn-increment" onClick={() => setCount(c => c + 1)}>+</button>
      </div>
    </div>
  );
}

export default Counter;
