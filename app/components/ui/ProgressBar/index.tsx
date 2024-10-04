import React from 'react';
import styles from './ProgressBar.module.scss';

type Props = {
  step: number;
  maxStep: number;
};

const ProgressBar: React.FC<Props> = ({ step, maxStep }) => (
  <div className={styles.progressBar}>
    <div className={styles.progress} style={{ width: `${Math.ceil((step / maxStep) * 100)}%` }} />
  </div>
);

export default ProgressBar;
