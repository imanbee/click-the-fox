import { useState } from "react";
import styles from "./Welcome.module.scss";

interface WelcomeProps {
  onContinue: (userName: string) => void;
}

const Welcome = (props: WelcomeProps) => {
  const { onContinue } = props;
  const [userName, setUserName] = useState("");

  const handleContinue = () => {
    onContinue(userName);
  };

  return (
    <>
      <h1 className={styles.title}>Welcome to Click the Fox!</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className={styles.input}
        autoComplete="off"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={handleContinue} disabled={!userName}>
        Continue
      </button>
    </>
  );
};

export default Welcome;
