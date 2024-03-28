import { useCallback, useState } from "react";
import Welcome from "./components/Welcome";
import Gameplay from "./components/Gameplay";
import Leaderboard from "./components/Leaderboard";

enum GameMode {
  WELCOME = "welcome",
  GAME = "game",
  LEADERBOARD = "leaderboard",
}

const FoxGame = () => {
  const [mode, setMode] = useState(GameMode.WELCOME);
  const [userName, setUserName] = useState("");

  const handleReinitGame = () => {
    setUserName("");
    setMode(GameMode.WELCOME);
  };

  const handleStartGame = (name?: string) => {
    if (name) {
      setUserName(name);
    }
    setMode(GameMode.GAME);
  };

  const handleEndGame = useCallback(
    (score: number) => {
      if (userName !== "") {
        try {
          const leaderboard = localStorage.getItem("click_the_fox_results");
          const currentLeaderboard = leaderboard ? JSON.parse(leaderboard) : [];
          const newLeaderboard = [
            ...currentLeaderboard,
            { name: userName, score, date: new Date().toISOString() },
          ];
          localStorage.setItem(
            "click_the_fox_results",
            JSON.stringify(newLeaderboard)
          );
        } catch (error) {
          console.error("Failed to save leaderboard", error);
        }
      }
      setMode(GameMode.LEADERBOARD);
    },
    [userName]
  );

  return (
    <div className="game-container">
      {mode === GameMode.WELCOME && <Welcome onContinue={handleStartGame} />}
      <Gameplay onEnd={handleEndGame} visible={mode === GameMode.GAME} />
      {mode === GameMode.LEADERBOARD && (
        <Leaderboard onExit={handleReinitGame} onReplay={handleStartGame} />
      )}
    </div>
  );
};

export default FoxGame;
