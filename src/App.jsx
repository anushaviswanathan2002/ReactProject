import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="counter">
      <h1>Counter</h1>
      <p className="count" aria-live="polite">{count}</p>
      <div className="buttons">
        <button onClick={() => setCount((c) => c - 1)} aria-label="Decrement">
          −
        </button>
        <button className="reset" onClick={() => setCount(0)}>
          Reset
        </button>
        <button onClick={() => setCount((c) => c + 1)} aria-label="Increment">
          +
        </button>
      </div>
    </main>
  )
}
