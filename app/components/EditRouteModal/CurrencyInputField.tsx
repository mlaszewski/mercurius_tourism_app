import React, { useState, useCallback } from 'react';
import CurrencyInput from 'react-currency-input-field';
import styles from './NewRouteModal.module.scss';

const CurrencyInputField = ({
  value,
  setValue,
  placeholder,
  decimalsLimit = 2,
  maxLength = 6,
  prefix = 'PLN ',
  isRequired = false
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  decimalsLimit: number;
  maxLength: number;
  prefix: string;
  isRequired: boolean;
}) => {
  const [error, setError] = useState(false);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
      if (isRequired && e.currentTarget.value === '') {
        setError(true);
      }
    },
    [setValue, isRequired]
  );

  const handleValueChange = useCallback(
    (value: string | undefined, name?: string, values?: any) => {
      if (value !== undefined) {
        setValue(value);
        if (value !== '') {
          setError(false);
        }
      }
    },
    [setValue]
  );

  return (
    <div>
      <CurrencyInput
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.error : ''}`}
        defaultValue={value}
        decimalsLimit={decimalsLimit}
        maxLength={maxLength}
        onValueChange={handleValueChange}
        prefix={prefix}
        onBlur={handleBlur}
      />
      {error && (
        <div className={styles.errorMessage} data-cy="error">
          Pole wymagane
        </div>
      )}
    </div>
  );
};

export default CurrencyInputField;
