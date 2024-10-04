import React from 'react';
import styles from './NewRouteModal.module.scss';

const ImageUpload = ({
  id,
  image,
  onImageChange,
  onRemove
}: {
  id: string;
  image: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <div className={styles.photoContainer}>
      <input type="file" accept="image/png, image/jpeg" className={styles.photoInput} id={id} onChange={onImageChange} />
      {image ? (
        <div className={styles.imageWrapper}>
          <img src={image} alt="Preview" className={styles.customUploadButtonImage} />
          <button onClick={() => onRemove(id)} className={styles.removeButton}>
            X
          </button>
        </div>
      ) : (
        <label htmlFor={id} className={styles.customUploadButton}>
          <div className={styles.addNewIcon}>+</div>
          Dodaj zdjęcie
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
