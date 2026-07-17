import { useState } from 'react'
import './Counter.css'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(0)

  const colorClass = count > 0 ? 'positive' : count < 0 ? 'negative' : 'zero'

  return (
    <div className="counter-card">
      <p className={`counter-value ${colorClass}`}>{count}</p>
      <div className="counter-buttons">
        <button className="btn btn-decrement" onClick={decrement}>−</button>
        <button className="btn btn-reset" onClick={reset}>Reset</button>
        <button className="btn btn-increment" onClick={increment}>+</button>
      </div>
    </div>
  )
}
