import React, { MouseEvent } from 'react';
import styles from './NewRouteModal.module.scss';

interface SubmitButtonProps {
  isFormValid: boolean;
  handleSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isFormValid, handleSubmit }) => {
  return (
    <button className={`${styles.submitButton} ${!isFormValid ? styles.disabled : ''}`} onClick={handleSubmit} disabled={!isFormValid}>
      Dodaj nową trasę
    </button>
  );
};

export default SubmitButton;
