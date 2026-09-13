import { useState, useEffect } from 'react'
import './Timer.css'

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputMinutes, setInputMinutes] = useState('5')

  useEffect(() => {
    let interval
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1)
      }, 1000)
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false)
      // Optional: Play a sound or show notification
    }
    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (seconds === 0) {
      const mins = parseInt(inputMinutes) || 0
      if (mins > 0) {
        setSeconds(mins * 60)
      }
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleResume = () => {
    if (seconds > 0) {
      setIsRunning(true)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
    setInputMinutes('5')
  }

  const progress = (parseInt(inputMinutes) * 60 - seconds) / (parseInt(inputMinutes) * 60 || 1) * 100

  return (
    <div className="timer-container">
      <div className="timer-card">
        <h2 className="timer-title">Focus Timer</h2>
        
        <div className="timer-display">
          <div className="timer-circle">
            <svg className="progress-ring" width="180" height="180">
              <circle
                cx="90"
                cy="90"
                r="85"
                className="progress-ring-circle"
                style={{
                  strokeDashoffset: 535 - (535 * progress) / 100
                }}
              />
            </svg>
            <div className="timer-time">{formatTime(seconds)}</div>
          </div>
        </div>

        {!isRunning && seconds === 0 && (
          <div className="timer-input-group">
            <label htmlFor="minutes">Minutes:</label>
            <input
              id="minutes"
              type="number"
              min="1"
              max="60"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              className="timer-input"
              disabled={isRunning}
            />
          </div>
        )}

        <div className="timer-controls">
          {!isRunning && seconds === 0 && (
            <button onClick={handleStart} className="timer-btn start-btn">Start</button>
          )}
          {isRunning && (
            <button onClick={handlePause} className="timer-btn pause-btn">Pause</button>
          )}
          {!isRunning && seconds > 0 && (
            <button onClick={handleResume} className="timer-btn resume-btn">Resume</button>
          )}
          <button onClick={handleReset} className="timer-btn reset-btn">Reset</button>
        </div>

        {seconds === 0 && !isRunning && parseInt(inputMinutes) > 0 && (
          <p className="timer-status">Ready to focus? Click Start!</p>
        )}
        {seconds > 0 && !isRunning && (
          <p className="timer-status">Paused at {formatTime(seconds)}</p>
        )}
        {isRunning && (
          <p className="timer-status">Stay focused! 💪</p>
        )}
      </div>
    </div>
  )
}

export default Timer
