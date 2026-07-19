import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return (
    <div className="app-container">
      <h1>Counter App</h1>
      <div className="counter-display">{count}</div>
      <div className="button-group">
        <button onClick={decrement} className="btn btn-minus">
          Decrease
        </button>
        <button onClick={reset} className="btn btn-reset">
          Reset
        </button>
        <button onClick={increment} className="btn btn-plus">
          Increase
        </button>
      </div>
    </div>
  )
}

export default App
