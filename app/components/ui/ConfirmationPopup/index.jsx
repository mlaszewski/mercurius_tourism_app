import stylesGlobal from 'app/styles/global.module.scss';
import styles from './ConfirmationPopup.module.scss';

export const ConfirmationPopup = ({ message, onConfirm, onHide }) => {
  return (
    <div className={styles.popupContainer} data-cy="confirmationPopup">
      <div className={styles.content}>
        <p>{message}</p>
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm} className={stylesGlobal.buttonDeleteSecondary}>
            Tak
          </button>
          <button onClick={onHide} className={stylesGlobal.buttonSecondary}>
            Nie
          </button>
        </div>
      </div>
    </div>
  );
};
