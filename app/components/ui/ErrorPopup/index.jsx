import styles from './ErrorPopup.module.scss';

export const ErrorPopup = ({ message }) => {
  return (
    <div className={styles.popupContainer} data-cy="errorPopup">
      <div className={styles.content}>
        <p>{message}</p>
      </div>
    </div>
  );
};
