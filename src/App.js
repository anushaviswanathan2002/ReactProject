import React from 'react';
import Stopwatch from './components/Stopwatch';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="app">
        <h1>⏱️ Stopwatch</h1>
        <Stopwatch />
      </div>
    </div>
  );
}

export default App;
