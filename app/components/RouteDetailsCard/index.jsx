import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { formatDate, formatTime } from 'lib/utils/data/utils';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

import stylesGlobal from 'app/styles/global.module.scss';
import { IoLocationOutline } from 'react-icons/io5';
import styles from '../RouteCard/RouteCard.module.scss';

import Modal from '../ui/Modal';
import PointMap from '../PointMap';

function ReservationForm({ data, onHide, refresh }) {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get(`/api/route/schedules/${data._id}`).then((res) => {
      setSchedules(res.data.result);
    });
  }, [data]);

  const handleSubmit = (values) => {
    axios.post(`/api/reservation`, { schedule: values.selectedObject.value }).then(() => {
      refresh();
    });

    onHide();
  };

  return (
    <Formik
      initialValues={{
        selectedObject: {}
      }}
      validationSchema={Yup.object().shape({ selectedObject: Yup.string().required('Pole wymagane') })}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form className={styles.formContainer}>
          <div className={styles.formGroup}>
            <Select
              id="terms"
              name="selectedObject"
              options={schedules.map((schedule) => ({
                value: schedule._id,
                label: `${formatDate(schedule.dateStart)} | ${formatTime(schedule.dateStart)} - ${formatTime(schedule.dateEnd)}`
              }))}
              onChange={(option) => setFieldValue('selectedObject', option)}
              value={values.selectedObject}
              noOptionsMessage={() => 'Brak wyników'}
              loadingMessage={() => 'Ładowanie...'}
              placeholder="Wybierz termin*"
              className={`${styles.select} ${touched.selectedObject && errors.selectedObject && styles.inputError}`}
            />
          </div>
          <div className={styles.formGroup}>
            <button
              data-cy="submit"
              className={`${stylesGlobal.buttonPrimary}`}
              onClick={() => {
                handleSubmit(values);
              }}
            >
              Potwierdź
            </button>
            <button
              className={stylesGlobal.buttonDelete}
              onClick={() => {
                onHide();
              }}
            >
              Anuluj
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

const RouteDetailsCard = ({ route, onEdit }) => {
  const { data: session } = useSession();
  const [reservationModal, setReservationModal] = useState(false);

  return (
    <div className={styles.routeDetails} data-cy="routePreviewModal">
      <div className={styles.details}>
        <div className={styles.left}>
          <div className={styles.mapImage}>
            <PointMap points={route.points} />
          </div>
          <div className={styles.photos}>
            {route.photos &&
              route.photos.map((photo, index) => (
                <div className={styles.photo}>
                  <img key={index} src={photo} alt={`Zdjęcie ${index + 1}`} />
                </div>
              ))}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.rating}>
              <span className={styles.stars}>☆☆☆☆☆</span>
              <span className={styles.ratingValue}>&nbsp;</span>
            </div>
            <h3 className={styles.popupH2} data-cy="routeName">
              {route.name}
            </h3>
            <div className={styles.price}>
              <img className={styles.moneyIcon} src="/images/money.svg" alt="money" />
              &nbsp;&nbsp;{route.price}&nbsp;PLN
            </div>
            <div className={styles.location}>
              <IoLocationOutline className={styles.pinIcon} />
              {route?.points[0]?.address?.locality ||
                route?.points[0]?.address?.administrative_area_level_2 ||
                route?.points[0]?.address?.administrative_area_level_1 ||
                ''}
            </div>
          </div>
          <p className={styles.description}>{route.description}</p>
          <div className={styles.info}>
            <div className={styles.time}>
              <img className={styles.clockIcon} src="/images/clock.svg" alt="clock" />
              &nbsp;&nbsp;{route.duration} {route.durationUnit}
            </div>
            <div className={`${styles.detail} ${styles.difficulty}`}>
              {route.difficulty === 'łatwy' && <img className={styles.difficultyIcon} src="/icons/easy.svg" alt="Łatwy" />}
              {route.difficulty === 'średni' && <img className={styles.difficultyIcon} src="/icons/medium.svg" alt="Średni" />}
              {route.difficulty === 'trudny' && <img className={styles.difficultyIcon} src="/icons/hard.svg" alt="Trudny" />}
              {route.difficulty ? route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1) : ''}
            </div>
            <div className={styles.points}>
              <span className={styles.highlight}>Liczba punktów:&nbsp;</span>
              {route.points.length}
            </div>
          </div>
          <div className={styles.action}>
            {session.user.isGuide && session.user.id === route?.creator?._id ? (
              <button className={styles.editButton} onClick={onEdit}>
                Edytuj trasę
              </button>
            ) : (
              <button
                className={`${stylesGlobal.buttonPrimary} ${styles.reserveButton} w-100 mt-2`}
                onClick={() => setReservationModal(true)}
              >
                Zarezerwuj trasę
              </button>
            )}
          </div>
        </div>
      </div>
      {reservationModal && (
        <Modal
          onHide={() => {
            setReservationModal(false);
          }}
          title={
            <h2>
              Wybierz <span className={stylesGlobal.accent}>dostępny</span> termin
            </h2>
          }
        >
          <ReservationForm
            onHide={() => setReservationModal(false)}
            refresh={() => {
              window.location.href = 'reservations';
            }}
            data={route}
          />
        </Modal>
      )}
    </div>
  );
};

export default RouteDetailsCard;
