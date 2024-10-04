// ModalHeader.tsx
import React from 'react';
import styles from './NewRouteModal.module.scss';

interface ModalHeaderProps {
  handleClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ handleClose }) => {
  return (
    <div className={styles.headerWrapper}>
      <h2 className={styles.header}>
        Tworzenie<span> nowej</span> trasy:
      </h2>
      <button className={styles.closeButton} onClick={handleClose}>
        X
      </button>
    </div>
  );
};

export default ModalHeader;
