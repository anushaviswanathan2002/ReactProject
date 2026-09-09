import React, { useState, useEffect } from 'react';
import './Stopwatch.css';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const getLapTime = (lapIndex) => {
    if (lapIndex === 0) {
      return laps[0];
    }
    return laps[lapIndex] - laps[lapIndex - 1];
  };

  return (
    <div className="stopwatch">
      <div className="display" data-testid="time-display">
        {formatTime(time)}
      </div>

      <div className="controls">
        {!isRunning ? (
          <button
            className="btn btn-primary"
            onClick={handleStart}
            data-testid="start-btn"
          >
            Start
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handlePause}
            data-testid="pause-btn"
          >
            Pause
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={handleReset}
          data-testid="reset-btn"
        >
          Reset
        </button>

        <button
          className="btn btn-tertiary"
          onClick={handleLap}
          disabled={!isRunning}
          data-testid="lap-btn"
        >
          Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps" data-testid="laps-container">
          <h3>Laps</h3>
          <table className="laps-table">
            <thead>
              <tr>
                <th>Lap #</th>
                <th>Lap Time</th>
                <th>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lapTime, index) => (
                <tr key={index} data-testid={`lap-row-${index}`}>
                  <td>#{index + 1}</td>
                  <td>{formatTime(getLapTime(index))}</td>
                  <td>{formatTime(lapTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
