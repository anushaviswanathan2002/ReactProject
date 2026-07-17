import React, { useState, useEffect, useRef, useCallback } from "react";
import { categories, categoryEmojis } from "../data/words";
import "./WordReveal.css";

const TURN_DURATION = 60;

function getRandomWord(category, usedWords) {
  const pool = categories[category].filter((w) => !usedWords.has(w));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function WordReveal({ category, team, onCorrect, onSkip, onTimeUp, score }) {
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const [currentWord, setCurrentWord] = useState(null);
  const [flash, setFlash] = useState(null); // "correct" | "skip"
  const usedWords = useRef(new Set());
  const timerRef = useRef(null);

  const nextWord = useCallback(() => {
    const word = getRandomWord(category, usedWords.current);
    if (word) {
      usedWords.current.add(word);
      setCurrentWord(word);
    }
  }, [category]);

  // Start timer once revealed
  useEffect(() => {
    if (!revealed) return;
    nextWord();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [revealed]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCorrect() {
    setFlash("correct");
    onCorrect();
    setTimeout(() => {
      setFlash(null);
      nextWord();
    }, 400);
  }

  function handleSkip() {
    setFlash("skip");
    onSkip();
    setTimeout(() => {
      setFlash(null);
      nextWord();
    }, 400);
  }

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / TURN_DURATION) * circumference;
  const timerColor =
    timeLeft > 20 ? "#4ade80" : timeLeft > 10 ? "#facc15" : "#f87171";
  const isUrgent = timeLeft <= 10;

  if (!revealed) {
    return (
      <div className="word-reveal">
        <div className="wr-header">
          <span className="wr-team">🎭 {team}</span>
          <span className="wr-category">
            {categoryEmojis[category]} {category}
          </span>
          <span className="wr-score">⭐ {score} pts</span>
        </div>

        <div className="reveal-prompt">
          <p className="reveal-note">
            Only the <strong>actor</strong> should look!
            <br />
            Everyone else, look away 👀
          </p>
          <button className="btn-reveal" onClick={() => setRevealed(true)}>
            👁 Reveal Word
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`word-reveal ${flash || ""}`}>
      <div className="wr-header">
        <span className="wr-team">🎭 {team}</span>
        <span className="wr-category">
          {categoryEmojis[category]} {category}
        </span>
        <span className="wr-score">⭐ {score} pts</span>
      </div>

      <div className={`timer-ring ${isUrgent ? "pulse" : ""}`} style={{ color: timerColor }}>
        <svg className="timer-svg" viewBox="0 0 120 120">
          <circle className="timer-bg" cx="60" cy="60" r={radius} />
          <circle
            className="timer-progress"
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={`${progress} ${circumference}`}
            stroke={timerColor}
          />
        </svg>
        <span className="timer-text" style={{ color: timerColor }}>
          {timeLeft}
        </span>
      </div>

      <div className="word-box">
        <p className="word-label">ACT THIS OUT!</p>
        <p className="word-display">{currentWord || "No more words!"}</p>
      </div>

      <div className="action-buttons">
        <button className="btn-skip" onClick={handleSkip}>
          ⏭ Skip
        </button>
        <button className="btn-correct" onClick={handleCorrect}>
          ✅ Correct!
        </button>
      </div>
    </div>
  );
}

export default WordReveal;
