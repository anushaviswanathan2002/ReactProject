import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import './MemoryGame.css'

const DIFFICULTIES = {
  easy: { pairs: 6, label: 'Easy', cols: 4 },
  medium: { pairs: 8, label: 'Medium', cols: 4 },
  hard: { pairs: 12, label: 'Hard', cols: 6 }
}

const EMOJIS = [
  '🍕', '🚀', '🌙', '🎈', '🦊', '🎧',
  '🌵', '🐙', '⚡', '🍩', '🐳', '🔮',
  '🍒', '🧩', '🎲', '🌈', '🔥', '🎩'
]

function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function MemoryGame({ user, bestScores, onScoreSaved }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])      // indices currently face-up (max 2)
  const [matched, setMatched] = useState([])       // indices permanently matched
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState(null)
  const timerRef = useRef(null)

  const pairs = DIFFICULTIES[difficulty].pairs

  const newGame = useCallback((diff) => {
    const p = DIFFICULTIES[diff || difficulty].pairs
    const picked = shuffle(EMOJIS).slice(0, p)
    setCards(shuffle([...picked, ...picked]).map((emoji, i) => ({ id: i, emoji })))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setWon(false)
    setSaveMsg('')
    if (timerRef.current) clearInterval(timerRef.current)
  }, [difficulty])

  // Start a fresh game on mount and when difficulty changes
  useEffect(() => {
    newGame(difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty])

  // Timer tick
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [running])

  // Detect win
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length && !won) {
      setRunning(false)
      setWon(true)
    }
  }, [matched, cards.length, won])

  const flipCard = (index) => {
    if (won) return
    if (flipped.length === 2) return
    if (flipped.includes(index) || matched.includes(index)) return
    if (!running) setRunning(true)

    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = nextFlipped
      if (cards[a].emoji === cards[b].emoji) {
        // Match found
        setMatched((prev) => [...prev, a, b])
        setFlipped([])
      } else {
        // No match — flip back after a short delay
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  const saveScore = async () => {
    setSaveMsg('Saving...')
    try {
      const res = await axios.post('/api/scores', {
        difficulty,
        moves,
        time_seconds: seconds
      })
      setSaveMsg(res.data.new_best ? '🎉 New best score!' : 'Score saved (best score kept)')
      if (onScoreSaved) onScoreSaved()
    } catch (err) {
      setSaveMsg(err.response?.data?.error || 'Failed to save score')
    }
  }

  const loadLeaderboard = async () => {
    setShowLeaderboard((v) => !v)
    try {
      const res = await axios.get('/api/scores/leaderboard')
      setLeaderboard(res.data)
    } catch (err) {
      setLeaderboard([])
    }
  }

  const best = bestScores?.find((s) => s.difficulty === difficulty)
  const matchedCount = matched.length / 2

  return (
    <div className="memory-game">
      <div className="game-header">
        <div className="stats">
          <div className="stat-box">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(seconds)}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Pairs</span>
            <span className="stat-value">{matchedCount}/{pairs}</span>
          </div>
          <div className="stat-box best">
            <span className="stat-label">Your Best</span>
            <span className="stat-value">
              {best ? `${best.moves} moves · ${formatTime(best.time_seconds)}` : '—'}
            </span>
          </div>
        </div>

        <div className="controls">
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button
              key={key}
              className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
              onClick={() => setDifficulty(key)}
            >
              {d.label}
            </button>
          ))}
          <button className="control-btn" onClick={() => newGame(difficulty)}>🔄 New Game</button>
          <button className="control-btn" onClick={loadLeaderboard}>
            {showLeaderboard ? '🙈 Hide Leaderboard' : '🏆 Leaderboard'}
          </button>
        </div>
      </div>

      {showLeaderboard && (
        <div className="leaderboard">
          <h3>🏆 Best Scores (all players)</h3>
          {leaderboard === null ? (
            <p className="lb-empty">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="lb-empty">No scores yet — be the first!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Difficulty</th>
                  <th>Moves</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, i) => (
                  <tr key={i} className={row.email === user?.email ? 'me' : ''}>
                    <td>{row.email}</td>
                    <td className="cap">{row.difficulty}</td>
                    <td>{row.moves}</td>
                    <td>{formatTime(row.time_seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className={`card-grid cols-${DIFFICULTIES[difficulty].cols}`}>
        {cards.map((card, i) => {
          const isFaceUp = flipped.includes(i) || matched.includes(i)
          return (
            <button
              key={card.id}
              className={`card ${isFaceUp ? 'face-up' : ''} ${matched.includes(i) ? 'matched' : ''}`}
              onClick={() => flipCard(i)}
              aria-label={isFaceUp ? `Card ${card.emoji}` : 'Hidden card'}
            >
              <span className="card-inner">
                <span className="card-front">?</span>
                <span className="card-back">{card.emoji}</span>
              </span>
            </button>
          )
        })}
      </div>

      {won && (
        <div className="win-overlay">
          <div className="win-card">
            <h2>🎉 You Win! 🎉</h2>
            <p>You matched all {pairs} pairs!</p>
            <p className="win-stats">
              <strong>{moves} moves</strong> · <strong>{formatTime(seconds)}</strong>
            </p>
            <div className="win-actions">
              <button onClick={saveScore} disabled={saveMsg.startsWith('Saving') || saveMsg !== ''}>
                💾 Save Score
              </button>
              <button onClick={() => newGame(difficulty)}>🔄 Play Again</button>
            </div>
            {saveMsg && <p className="save-msg">{saveMsg}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoryGame
