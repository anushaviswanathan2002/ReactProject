import { useState, useEffect } from 'react'
import axios from 'axios'
import './MemoryGame.css'

const EMOJIS = ['🎮', '🎨', '🎭', '🎪', '🎸', '🎯', '🎲', '🎳']

export default function MemoryGame({ user, onLogout }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [highScore, setHighScore] = useState(user.highScore)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check if won
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameWon(true)
      updateHighScore(moves)
    }
  }, [matched, moves, cards.length])

  const initializeGame = () => {
    const gameCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false
      }))
    setCards(gameCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index) => {
    if (gameWon || flipped.includes(index) || matched.includes(index)) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 600)
      }
      setMoves(moves + 1)
    }
  }

  const updateHighScore = async (finalMoves) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        '/api/user/highscore',
        { score: finalMoves },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setHighScore(response.data.highScore)
    } catch (err) {
      console.error('Error updating high score:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onLogout()
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="header-info">
          <h1>Memory Game</h1>
          <p className="username">Welcome, <strong>{user.username}</strong>!</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best Score:</span>
          <span className="stat-value">{highScore || '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched:</span>
          <span className="stat-value">{Math.floor(matched.length / 2)}/{EMOJIS.length}</span>
        </div>
      </div>

      {gameWon && (
        <div className="win-banner">
          <h2>🎉 You Won! 🎉</h2>
          <p>Completed in {moves} moves!</p>
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="game-controls">
        <button className="new-game-button" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'New Game'}
        </button>
      </div>
    </div>
  )
}
