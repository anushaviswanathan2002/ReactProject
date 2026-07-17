import React from "react";
import "./Scoreboard.css";

function Scoreboard({ teams, currentTeamIndex, round, totalRounds, onNext, onRestart }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const gameOver = round > totalRounds;

  return (
    <div className="scoreboard">
      <h2 className="sb-title">
        {gameOver ? "🎉 Game Over!" : `Round ${round - 1} Complete!`}
      </h2>

      <div className="sb-list">
        {sorted.map((team, i) => (
          <div key={team.name} className={`sb-row ${i === 0 ? "sb-top" : ""}`}>
            <span className="sb-rank">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
            <span className="sb-name">{team.name}</span>
            <span className="sb-score">{team.score} pts</span>
          </div>
        ))}
      </div>

      {gameOver ? (
        <div className="winner-banner">
          🏆 <strong>{sorted[0].name}</strong> wins!
          <button className="btn-primary" onClick={onRestart} style={{ marginTop: "1.5rem" }}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="next-turn">
          <p className="next-label">Next up:</p>
          <p className="next-team">{teams[currentTeamIndex].name}</p>
          <button className="btn-primary" onClick={onNext}>
            Start Round {round} →
          </button>
        </div>
      )}
    </div>
  );
}

export default Scoreboard;
