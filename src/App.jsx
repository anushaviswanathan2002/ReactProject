import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="counter">
      <h1>Counter</h1>
      <p className="count" data-testid="count">{count}</p>
      <div className="buttons">
        <button className="btn decrement" onClick={() => setCount((c) => c - 1)}>
          −
        </button>
        <button className="btn reset" onClick={() => setCount(0)}>
          Reset
        </button>
        <button className="btn increment" onClick={() => setCount((c) => c + 1)}>
          +
        </button>
      </div>
    </main>
  )
}

export default App
