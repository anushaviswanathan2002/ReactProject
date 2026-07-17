import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1>Counter</h1>
      <div className="counter-display">{count}</div>
      <div className="buttons">
        <button className="btn btn-decrement" onClick={() => setCount(c => c - 1)}>−</button>
        <button className="btn btn-reset" onClick={() => setCount(0)}>Reset</button>
        <button className="btn btn-increment" onClick={() => setCount(c => c + 1)}>+</button>
      </div>
    </div>
  )
}

export default App
