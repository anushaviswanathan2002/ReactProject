import React, { useState } from "react";
import "./Setup.css";

const DEFAULT_TEAMS = ["Team Alpha", "Team Beta"];

function Setup({ onStart }) {
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [rounds, setRounds] = useState(3);

  function updateTeam(i, value) {
    setTeams((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function addTeam() {
    if (teams.length < 6) setTeams((prev) => [...prev, `Team ${String.fromCharCode(67 + prev.length - 2)}`]);
  }

  function removeTeam(i) {
    if (teams.length > 2) setTeams((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleStart() {
    const validTeams = teams.map((t) => t.trim()).filter(Boolean);
    if (validTeams.length < 2) return;
    onStart(validTeams, rounds);
  }

  return (
    <div className="setup">
      <div className="setup-logo">
        <span className="logo-icon">🎭</span>
        <h1 className="logo-title">Hungama!</h1>
        <p className="logo-sub">The Charades Party Game</p>
      </div>

      <div className="setup-section">
        <label className="setup-label">Teams</label>
        {teams.map((team, i) => (
          <div key={i} className="team-row">
            <input
              className="team-input"
              value={team}
              maxLength={20}
              onChange={(e) => updateTeam(i, e.target.value)}
              placeholder={`Team ${i + 1}`}
            />
            {teams.length > 2 && (
              <button className="btn-remove" onClick={() => removeTeam(i)}>
                ✕
              </button>
            )}
          </div>
        ))}
        {teams.length < 6 && (
          <button className="btn-add-team" onClick={addTeam}>
            + Add Team
          </button>
        )}
      </div>

      <div className="setup-section">
        <label className="setup-label">Rounds per team</label>
        <div className="rounds-control">
          <button
            className="rounds-btn"
            onClick={() => setRounds((r) => Math.max(1, r - 1))}
          >
            −
          </button>
          <span className="rounds-value">{rounds}</span>
          <button
            className="rounds-btn"
            onClick={() => setRounds((r) => Math.min(10, r + 1))}
          >
            +
          </button>
        </div>
      </div>

      <button className="btn-start" onClick={handleStart}>
        🚀 Start Game!
      </button>
    </div>
  );
}

export default Setup;
