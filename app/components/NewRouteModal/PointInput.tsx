import { useMemo, useState } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import styles from './NewRouteModal.module.scss';

const PointInput = ({
  point,
  index,
  setPoints,
  points,
  region
}: {
  point: any;
  index: number;
  setPoints: any;
  points: any[];
  region: string;
}) => {
  const [inputValue, setInputValue] = useState('');
  const getPlaceholder = (index: number) => {
    if (index === 0) return 'Punkt początkowy';
    if (index === points.length - 1) return 'Punkt końcowy';
    return 'Punkt pomiędzy';
  };

  const getPointClass = (index: number) => {
    if (index === 0) return styles.startPoint;
    if (index === points.length - 1) return styles.endPoint;
    return styles.middlePoint;
  };

  const handleRemove = () => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
  };

  const loadOptions = useMemo(
    () =>
      debounce((inputValue: string, callback: (options: { value: any; label: string }[]) => void) => {
        axios
          .get(`/api/point?title=point+of+interest+${inputValue.replace(' ', '+')}&region=${region}`)
          .then((res) => {
            const options = res.data.result.map((point: any) => ({
              value: point,
              label: `${point.name} - ${point.address.locality || point.address.administrative_area_level_2 || point.address.administrative_area_level_1}`
            }));
            callback(options);
          })
          .catch((error) => {
            console.error('Error loading options:', error);
            callback([]);
          });
      }, 500), // 500 ms debounce time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue, region]
  );

  return (
    <div className={styles.pointContainer}>
      <AsyncSelect
        cacheOptions
        value={point}
        placeholder={getPlaceholder(index)}
        className={styles.inputSelect}
        loadOptions={loadOptions}
        onInputChange={debounce((inputValue) => {
          setInputValue(inputValue);
        }, 500)}
        onChange={(selectedOption) => {
          const newPoints = [...points];
          newPoints[index] = selectedOption ?? '';
          setPoints(newPoints);
        }}
        noOptionsMessage={() => 'Brak wyników'}
        loadingMessage={() => 'Ładowanie...'}
      />
      {index > 0 && index < points.length - 1 && <button className={styles.removePoint} onClick={handleRemove} />}
      <div className={getPointClass(index)}>
        {index === 0 && 'S'}
        {index > 0 && index < points.length - 1 && index}
        {index === points.length - 1 && 'F'}
      </div>
      {index < points.length - 1 && <div className={styles.dots} />}
    </div>
  );
};

export default PointInput;
