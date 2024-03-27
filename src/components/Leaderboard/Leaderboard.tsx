import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.scss";

interface LeaderboardProps {
  onReplay: () => void;
  onExit: () => void;
}

type GameEntry = { name: string; score: number; date: string }[];

const Leaderboard = (props: LeaderboardProps) => {
  const { onReplay, onExit } = props;
  const [leaderboard, setLeaderboard] = useState<GameEntry>([]);
  useEffect(() => {
    const leaderboard = localStorage.getItem("click_the_fox_results");
    setLeaderboard(leaderboard ? JSON.parse(leaderboard) : []);
  }, []);

  const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);
  return (
    <>
      <h1 className={styles.title}>Scoreboard</h1>
      <table className={styles.table}>
        <thead>
          <td>Rank</td>
          <td>Name</td>
          <td>Date</td>
          <td>Score</td>
        </thead>
        <tbody>
          {sortedLeaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.name}</td>
              <td>{new Date(entry.date).toLocaleString()}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.actions}>
        <button onClick={() => onExit()}>Exit</button>
        <button onClick={() => onReplay()}>Play again!</button>
      </div>
    </>
  );
};

export default Leaderboard;
