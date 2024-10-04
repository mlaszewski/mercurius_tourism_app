import Image from 'next/image';
import stylesGlobal from 'app/styles/global.module.scss';
import styles from './Modal.module.scss';

export default function Modal({ title, onHide, children }) {
  return (
    <div className={`${styles.uiModalContainer}`} data-cy="modal">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div className={styles.uiModalOverlay} onMouseDown={onHide} />
      <div className={styles.uiModal}>
        <div className={styles.uiModalHeader}>
          {title}
          <button className={stylesGlobal.buttonSecondary} onClick={onHide}>
            <Image src="/icons/close.svg" alt="Close" width="16" height="16" color="black" />
            <span hidden>Close</span>
          </button>
        </div>
        <div className={styles.uiModalContent}>{children}</div>
      </div>
    </div>
  );
}
