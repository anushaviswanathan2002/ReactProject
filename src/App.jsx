import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="app-shell">
      <section className="counter-card" aria-label="Counter app">
        <p className="eyebrow">Simple React Counter</p>
        <h1>{count}</h1>
        <div className="actions">
          <button type="button" onClick={() => setCount((value) => value - 1)}>
            -
          </button>
          <button type="button" onClick={() => setCount(0)}>
            Reset
          </button>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            +
          </button>
        </div>
      </section>
    </main>
  );
}