import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="app-shell">
      <section className="counter-card" aria-label="Counter app">
        <p className="eyebrow">Simple React Counter</p>
        <h1>Keep count with a click</h1>
        <p className="count-label">Current count</p>
        <p className="count-value" aria-live="polite">
          {count}
        </p>
        <div className="button-row">
          <button type="button" onClick={() => setCount(count - 1)}>
            Decrease
          </button>
          <button type="button" onClick={() => setCount(0)}>
            Reset
          </button>
          <button type="button" onClick={() => setCount(count + 1)}>
            Increase
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
