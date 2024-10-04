import React, { useState, useCallback } from 'react';
import styles from './NewRouteModal.module.scss';

const InputField = ({
  value,
  setValue,
  placeholder,
  type = 'text',
  isRequired = false
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  type: string;
  isRequired: boolean;
}) => {
  const [error, setError] = useState(false);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setValue(e.currentTarget.value);
      }
      setError(false);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
      if (isRequired && e.currentTarget.value === '') {
        setError(true);
      }
    },
    [setValue, isRequired]
  );

  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.error : ''}`}
        value={value}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && (
        <div className={styles.errorMessage} data-cy="error">
          Pole wymagane
        </div>
      )}
    </div>
  );
};

export default InputField;
