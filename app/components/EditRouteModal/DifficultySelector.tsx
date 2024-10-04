import React from 'react';
import styles from './NewRouteModal.module.scss';

const DifficultySelector = ({ difficulty, setDifficulty }: { difficulty: string; setDifficulty: (value: string) => void }) => {
  return (
    <div className={styles.routesLevel}>
      <label>Podaj poziom trudności pokonania trasy</label>
      <label className={styles.label}>
        <input
          type="radio"
          name="difficulty"
          value="łatwy"
          className={styles.radio}
          checked={difficulty === 'łatwy'}
          onChange={(e) => setDifficulty(e.target.value)}
        />{' '}
        Łatwy
      </label>
      <label className={styles.label}>
        <input
          type="radio"
          name="difficulty"
          className={styles.radio}
          value="średni"
          checked={difficulty === 'średni'}
          onChange={(e) => setDifficulty(e.target.value)}
        />{' '}
        Średni
      </label>
      <label className={styles.label}>
        <input
          type="radio"
          name="difficulty"
          className={styles.radio}
          value="trudny"
          checked={difficulty === 'trudny'}
          onChange={(e) => setDifficulty(e.target.value)}
        />{' '}
        Trudny
      </label>
    </div>
  );
};

export default DifficultySelector;
