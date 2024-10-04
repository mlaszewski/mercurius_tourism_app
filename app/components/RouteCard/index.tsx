import { useState, useEffect, useRef } from 'react';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Modal from 'app/components/ui/Modal';
import RouteDetailsCard from 'app/components/RouteDetailsCard';
import axios from 'axios';
import styles from './RouteCard.module.scss';
import EditRouteModal from '../EditRouteModal';
import { ConfirmationPopup } from '../ui/ConfirmationPopup';

const RouteCard = ({ route, callFetchRoutes = null, cardType = 'vertical' }: { route: any; callFetchRoutes?: any; cardType?: string }) => {
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [routeData, setRoutesData]: [route: any, setRoutesData: any] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const menuRef = useRef(null);

  const deleteRoute = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await axios.delete(`http://localhost:3000/api/route/${route._id}`);
      if (callFetchRoutes) {
        callFetchRoutes();
      }
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };

  const showDeleteConfirmation = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowConfirmation(true);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        (menuRef.current as HTMLElement).contains &&
        !(menuRef.current as HTMLElement).contains(event.target as Node) &&
        event.target !== document.querySelector('.deleteRoute')
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const closeModals = () => {
    setShowRouteModal(false);
    setIsEditMode(false);
  };

  useEffect(() => {
    const durationInMinutes = route.duration;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    setRoutesData({ ...route, duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` });
  }, [route]);

  return (
    // eslint-disable-next-line
    <>
      <div
        className={`${cardType === 'horizontal' ? styles.cardHorizontal : styles.cardVertical}`}
        data-cy="card"
        onClick={() => setShowRouteModal(true)}
      >
        <div className={styles.imageContainer}>
          <img
            src={routeData?.photos[0] ? routeData?.photos[0] : '/images/route-placeholder.jpeg'}
            alt={routeData?.name}
            className={styles.image}
          />
          <BsThreeDotsVertical
            className={styles.menuIcon}
            data-cy="menu"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          />
          {showMenu && (
            <div className={styles.menu} ref={menuRef}>
              <div onClick={showDeleteConfirmation}>Usuń trasę</div>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{routeData?.name}</h3>
          <div className={styles.details}>
            {routeData?.points[0]?.address && (
              <div className={styles.detail}>
                <IoLocationOutline className={styles.icon} />
                {routeData?.points[0]?.address?.locality ||
                  routeData?.points[0]?.address?.administrative_area_level_2 ||
                  routeData?.points[0]?.address?.administrative_area_level_1 ||
                  ''}
              </div>
            )}
            <div className={styles.detail}>
              <IoTimeOutline className={styles.icon} />
              {routeData?.duration ?? ''}
            </div>
            <div>
              <div className={`${styles.detail} ${styles.difficulty}`}>
                {routeData?.difficulty === 'łatwy' && <img className={styles.difficultyIcon} src="/icons/easy.svg" alt="Łatwy" />}
                {routeData?.difficulty === 'średni' && <img className={styles.difficultyIcon} src="/icons/medium.svg" alt="Średni" />}
                {routeData?.difficulty === 'trudny' && <img className={styles.difficultyIcon} src="/icons/hard.svg" alt="Trudny" />}
                {routeData?.difficulty ? routeData.difficulty.charAt(0).toUpperCase() + routeData.difficulty.slice(1) : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationPopup
          onHide={(e: React.MouseEvent) => {
            e.stopPropagation();
            setShowConfirmation(false);
          }}
          message="Czy na pewno chcesz usunąć trasę?"
          onConfirm={deleteRoute}
        />
      )}
      {showRouteModal && (
        <Modal
          title={<h2>{isEditMode ? 'Edycja trasy' : 'Szczegóły trasy'}</h2>}
          onHide={(e: any) => {
            e.stopPropagation();
            setShowRouteModal(false);
            setIsEditMode(false);
          }}
        >
          {isEditMode ? (
            <EditRouteModal routeData={routeData} closeModals={closeModals} callFetchRoutes={callFetchRoutes} />
          ) : (
            <RouteDetailsCard route={routeData} onEdit={() => setIsEditMode(true)} />
          )}
        </Modal>
      )}
    </>
  );
};

export default RouteCard;
