import { useCallback, useEffect, useState } from "react";
import { ImageService } from "../../services/ImageService";
import styles from "./Gameplay.module.scss";

interface GameplayProps {
  onEnd: (score: number) => void;
  visible: boolean;
}

interface ImageSet {
  images: { url: string; type: string }[];
  visible: boolean;
}

const GAME_DURATION = 30;

const Gameplay = (props: GameplayProps) => {
  const { onEnd, visible } = props;

  const [imageSets, setImageSets] = useState<ImageSet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (visible) {
      const int = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(int);
      };
    }
  }, [visible]);

  useEffect(() => {
    const loadInitialImageSets = async () => {
      setInitialLoad(true);
      await ImageService.preloadImages();
      // Fetch initial sets and render the first one visible
      await addImageSetToQueue(true); // Initial set to be visible

      // Prefetch 4 more sets
      for (let i = 0; i < 4; i++) {
        addImageSetToQueue(false);
      }

      setInitialLoad(false);
    };
    loadInitialImageSets();
  }, []);

  const addImageSetToQueue = async (visible = false) => {
    const newSet = await ImageService.getNextImageSet(); // Fetch a new set of images
    setImageSets((prevSets) => [...prevSets, { images: newSet, visible }]);
  };

  useEffect(() => {
    if (timer === 0) {
      onEnd(score);
      setScore(0);
      setTimer(GAME_DURATION);
    }
  }, [onEnd, timer, score]);

  const handleImageClick = useCallback(
    async (type: string) => {
      if (type === "fox") {
        setScore((prev) => prev + 1);
      } else {
        setScore((prev) => Math.max(0, prev - 1));
      }
      // Fetch next set of images
      const updatedSets = imageSets.map((set, index) => ({
        ...set,
        visible: index === currentIndex + 1,
      }));
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setImageSets(updatedSets);

      // Check if we need to add a new set to the queue
      if (currentIndex + 3 >= imageSets.length) {
        await addImageSetToQueue(false); // Add a new set, initially invisible
      }
    },
    [currentIndex, imageSets]
  );

  if (initialLoad && visible) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={styles.gameplay}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      {imageSets.map((set, index) => (
        <div
          key={index}
          className={styles.imageSet}
          style={{
            visibility: set.visible && visible ? "visible" : "hidden",
          }}
        >
          <div className={styles.info}>
            <div>Score: {score}</div>
            <div>Timer: {timer}</div>
          </div>
          <div className={styles.imageGrid}>
            {set.images.map((image, index) => (
              <div
                key={index}
                className={styles.image}
                style={{
                  backgroundImage: "url(" + image.url + ")",
                }}
                onClick={() => handleImageClick(image.type)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gameplay;
