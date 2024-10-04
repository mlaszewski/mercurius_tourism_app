import React, { useState, useCallback } from 'react';
import styles from './NewRouteModal.module.scss';

const TextAreaField = ({
  value,
  setValue,
  placeholder,
  maxLength = 1000,
  isRequired = false
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  maxLength: number;
  isRequired: boolean;
}) => {
  const [error, setError] = useState(false);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setValue(e.currentTarget.value);
      if (isRequired && e.currentTarget.value === '') {
        setError(true);
      }
    },
    [setValue, isRequired]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.currentTarget.value);
      if (e.currentTarget.value !== '') {
        setError(false);
      }
    },
    [setValue]
  );

  return (
    <div>
      <textarea
        maxLength={maxLength}
        placeholder={placeholder}
        required={isRequired}
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {error && (
        <div className={styles.errorMessage} data-cy="error">
          Pole wymagane
        </div>
      )}
    </div>
  );
};

export default TextAreaField;
