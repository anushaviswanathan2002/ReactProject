import React, { useState } from "react";
import "./App.css";
import Setup from "./components/Setup";
import CategoryPicker from "./components/CategoryPicker";
import WordReveal from "./components/WordReveal";
import Scoreboard from "./components/Scoreboard";

// Game phases
const PHASE = {
  SETUP: "setup",
  CATEGORY: "category",
  PLAYING: "playing",
  SCOREBOARD: "scoreboard",
};

function buildTeams(names) {
  return names.map((name) => ({ name, score: 0 }));
}

function App() {
  const [phase, setPhase] = useState(PHASE.SETUP);
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [round, setRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [turnScore, setTurnScore] = useState(0);

  function handleStart(teamNames, rounds) {
    setTeams(buildTeams(teamNames));
    setTotalRounds(rounds);
    setCurrentTeamIndex(0);
    setRound(1);
    setPhase(PHASE.CATEGORY);
  }

  function handleCategorySelect(cat) {
    setSelectedCategory(cat);
    setTurnScore(0);
    setPhase(PHASE.PLAYING);
  }

  function handleCorrect() {
    setTurnScore((s) => s + 1);
    setTeams((prev) =>
      prev.map((t, i) =>
        i === currentTeamIndex ? { ...t, score: t.score + 1 } : t
      )
    );
  }

  function handleSkip() {
    // No penalty — just move on
  }

  function endTurn() {
    const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
    const nextRound =
      nextTeamIndex === 0 ? round + 1 : round;
    setCurrentTeamIndex(nextTeamIndex);
    setRound(nextRound);
    setPhase(PHASE.SCOREBOARD);
  }

  function handleNextRound() {
    setSelectedCategory(null);
    setTurnScore(0);
    setPhase(PHASE.CATEGORY);
  }

  function handleRestart() {
    setPhase(PHASE.SETUP);
    setTeams([]);
    setCurrentTeamIndex(0);
    setRound(1);
    setSelectedCategory(null);
    setTurnScore(0);
  }

  const currentTeam = teams[currentTeamIndex] || null;

  return (
    <div className="app-bg">
      <div className="app-card">
        {phase !== PHASE.SETUP && phase !== PHASE.SCOREBOARD && (
          <p className="round-indicator">
            Round {round} / {totalRounds} &nbsp;·&nbsp; {currentTeam?.name}
          </p>
        )}

        {phase === PHASE.SETUP && <Setup onStart={handleStart} />}

        {phase === PHASE.CATEGORY && (
          <CategoryPicker onSelect={handleCategorySelect} />
        )}

        {phase === PHASE.PLAYING && currentTeam && (
          <WordReveal
            key={`${currentTeam.name}-${round}`}
            category={selectedCategory}
            team={currentTeam.name}
            score={turnScore}
            onCorrect={handleCorrect}
            onSkip={handleSkip}
            onTimeUp={endTurn}
          />
        )}

        {phase === PHASE.SCOREBOARD && (
          <Scoreboard
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            round={round}
            totalRounds={totalRounds}
            onNext={handleNextRound}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
