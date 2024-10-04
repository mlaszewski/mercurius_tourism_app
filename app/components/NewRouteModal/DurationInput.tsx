import React from 'react';
import styles from './NewRouteModal.module.scss';

interface DurationInputProps {
  duration: string;
  setDuration: (value: string) => void;
}

const DurationInput: React.FC<DurationInputProps> = ({ duration, setDuration }) => {
  return (
    <div className={styles.routeTime}>
      <label>Podaj czas trwania trasy*</label>
      <input
        type="time"
        pattern="\d{2}:\d{2}"
        placeholder="hh:mm"
        value={duration}
        className={styles.input}
        onChange={(e) => {
          const { value } = e.target;
          const regex = /^\d{0,2}(:\d{0,2})?$/;

          if (value.length === 2 && duration.length === 1) {
            if (regex.test(`${value}:`)) {
              setDuration(`${value}:`);
            }
          } else if (regex.test(value)) {
            setDuration(value);
          }
        }}
      />
    </div>
  );
};

export default DurationInput;
