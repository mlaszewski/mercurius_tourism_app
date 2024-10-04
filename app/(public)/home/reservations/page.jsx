'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { formatDate, formatTime } from 'lib/utils/data/utils';
import Modal from 'app/components/ui/Modal';
import Select from 'react-select';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import stylesGlobal from 'app/styles/global.module.scss';
import styles from './reservations.module.scss';

function ReservationsItemGuide({ data, onReject, onAccept, onPropose }) {
  return data.map((reservation) => {
    let statusMessage;
    let statusButtons;
    const date = formatDate(reservation.schedule.dateStart);
    const start = formatTime(reservation.schedule.dateStart);
    const end = formatTime(reservation.schedule.dateEnd);
    if (reservation.isAcceptedByUser && !reservation.isAcceptedByGuide) {
      statusMessage = 'Czeka na Twoją akceptację';
      statusButtons = (
        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton} onClick={() => onAccept(reservation._id)}>
            Akceptuj
          </button>
          <button className={styles.declineButton} onClick={() => onReject(reservation._id)}>
            Anuluj
          </button>
          <button className={styles.proposeButton} onClick={() => onPropose(reservation)}>
            Zaproponuj inny termin
          </button>
        </div>
      );
    } else if (!reservation.isAcceptedByUser && reservation.isAcceptedByGuide) {
      statusMessage = 'Czeka na akceptację użytkownika';
      statusButtons = (
        <div className={styles.buttonContainer}>
          <button className={styles.declineButton} onClick={() => onReject(reservation._id)}>
            Odmów
          </button>
          <button className={styles.proposeButton} onClick={() => onPropose(reservation)}>
            Zaproponuj inny termin
          </button>
        </div>
      );
    } else if (!reservation.isAcceptedByUser && !reservation.isAcceptedByGuide) {
      statusMessage = <span className={styles.cancelled}>Anulowano</span>;
    } else if (reservation.isAcceptedByUser && reservation.isAcceptedByGuide) {
      statusMessage = <span className={styles.highlight}>Potwierdzono</span>;
      statusButtons = (
        <div className={styles.buttonContainer}>
          <button className={styles.declineButton} onClick={() => onReject(reservation._id)}>
            Anuluj
          </button>
          <button className={styles.proposeButton} onClick={() => onPropose(reservation)}>
            Zaproponuj inny termin
          </button>
        </div>
      );
    }

    return (
      <div className={styles.reservationItem} key={reservation._id} data-cy="reservation">
        <div className={styles.reservationContent}>
          <h2>Rezerwacja</h2>
          <p>
            Hej, <span className={styles.userId}>{reservation?.reservedBy?.profile?.name ?? reservation?.reservedBy?.email}</span> czeka na
            Twoją akceptację, żebyście razem mogli
            <br />
            odbyć <span className={styles.routeName}>{reservation.schedule.route.name}</span>. Szczegóły:
          </p>
          <ul>
            <li>Termin: {date}</li>
            <li>Start: {start}</li>
            <li>Koniec: {end}</li>
            <li>
              <strong className={styles.reservationStrong}>Status: {statusMessage}</strong>
            </li>
          </ul>
          {statusButtons}
        </div>
      </div>
    );
  });
}
function ReservationsItemTourist({ data, onReject, onAccept, onPropose }) {
  return data.map((reservation) => {
    let statusMessage;
    let statusButtons;
    const date = formatDate(reservation.schedule.dateStart);
    const start = formatTime(reservation.schedule.dateStart);
    const end = formatTime(reservation.schedule.dateEnd);
    if (reservation.isAcceptedByUser && !reservation.isAcceptedByGuide) {
      statusMessage = 'Oczekuje na potwierdzenie przewodnika';
      statusButtons = (
        <div className={styles.buttonContainer}>
          <button className={styles.declineButton} onClick={() => onReject(reservation._id)}>
            Zrezygnuj
          </button>
          <button className={styles.proposeButton} onClick={() => onPropose(reservation)}>
            Zaproponuj inny termin
          </button>
        </div>
      );
    } else if (!reservation.isAcceptedByUser && reservation.isAcceptedByGuide) {
      statusMessage = 'Czeka na Twoją akceptację';
      statusButtons = (
        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton} onClick={() => onAccept(reservation._id)}>
            Akceptuj
          </button>
          <button className={styles.declineButton} onClick={() => onReject(reservation._id)}>
            Zrezygnuj
          </button>
          <button className={styles.proposeButton} onClick={() => onPropose(reservation)}>
            Zaproponuj inny termin
          </button>
        </div>
      );
    } else if (!reservation.isAcceptedByUser && !reservation.isAcceptedByGuide) {
      statusMessage = <span className={styles.cancelled}>Anulowano</span>;
    } else if (reservation.isAcceptedByUser && reservation.isAcceptedByGuide) {
      statusMessage = <span className={styles.highlight}>Potwierdzono</span>;
      statusButtons = (
        <div className={styles.buttonContainer}>
          <button className={styles.declineButton} onClick={() => onReject(reservation._id)}>
            Zrezygnuj
          </button>
          <button className={styles.proposeButton} onClick={() => onPropose(reservation)}>
            Zaproponuj inny termin
          </button>
        </div>
      );
    }

    return (
      <div className={styles.reservationItem} key={reservation._id}>
        <div className={styles.reservationContent} data-cy="reservation">
          <h2>
            <strong>Rezerwacja</strong>
          </h2>
          <p>
            Hej, tu Twoja rezerwacja! Już niedługo razem z{' '}
            <span className={styles.userId}>{reservation.guide.profile.name ?? reservation.guide.email}</span> poznasz
            <br />
            <span className={styles.routeName}>{reservation.schedule.route.name}</span>. Szczegóły:
          </p>
          <ul>
            <li>Termin: {date}</li>
            <li>Start: {start}</li>
            <li>Koniec: {end}</li>
            <li>Przewodnik: {reservation.guide.profile.name ?? reservation.guide.email}</li>
            <li>
              <strong className={styles.reservationStrong}>Status: {statusMessage}</strong>
            </li>
          </ul>
          {statusButtons}
        </div>
      </div>
    );
  });
}

function ReservationEditForm({ data, onHide, refresh }) {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get(`/api/route/schedules/${data.schedule.route._id}`).then((res) => {
      setSchedules(res.data.result);
    });
  }, [data]);

  const handleSubmit = (values) => {
    axios.put(`/api/reservation/${data._id}`, { schedule: values.selectedObject.value }).then(() => {
      refresh();
    });

    onHide();
  };

  return (
    <Formik
      initialValues={{
        selectedObject: {
          value: data.schedule._id,
          label: `${formatDate(data.schedule.dateStart)} | ${formatTime(data.schedule.dateStart)} - ${formatTime(data.schedule.dateEnd)}`
        }
      }}
      validationSchema={Yup.object().shape({ selectedObject: Yup.string().required('Pole wymagane') })}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form className={styles.formContainer}>
          <div className={styles.formGroupColumn}>
            <label className={styles.label}>Wprowadź nowy termin:</label>
            <Select
              name="selectedObject"
              noOptionsMessage={() => 'Brak wyników'}
              loadingMessage={() => 'Ładowanie...'}
              options={schedules.map((schedule) => ({
                value: schedule._id,
                label: `${formatDate(schedule.dateStart)} | ${formatTime(schedule.dateStart)} - ${formatTime(schedule.dateEnd)}`
              }))}
              onChange={(option) => setFieldValue('selectedObject', option)}
              value={values.selectedObject}
              placeholder="Wybierz termin*"
              className={`${styles.select} ${touched.selectedObject && errors.selectedObject && styles.inputError}`}
            />
          </div>
          <div className={styles.formGroup}>
            <button
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

export default function ReservationsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  const fetchReservations = async () => {
    await axios.get('/api/reservation/my-reservations?accepted=false').then((res) => {
      setData(res.data.result);
    });
  };

  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchReservations();
    }
  }, [session, status, modal]);

  const handleAccept = (reservationId) => {
    axios.post(`/api/reservation/${reservationId}?accept=true`).then(() => {
      fetchReservations();
    });
  };
  const handleReject = (reservationId) => {
    axios.post(`/api/reservation/${reservationId}?reject=true`).then(() => {
      fetchReservations();
    });
  };
  const handlePropose = (reservation) => {
    setModal(true);
    setModalData(reservation);
  };

  if (status === 'authenticated' && session) {
    const { isGuide } = session.user || { isGuide: false };
    return (
      <div className={styles.reservationsWrapper}>
        <h1>
          <strong>Rezerwacje</strong>
        </h1>
        {data.length === 0 && <p className="fs-4 text-secondary">Brak rezerwacji</p>}
        {isGuide ? (
          <ReservationsItemGuide data={data} onAccept={handleAccept} onReject={handleReject} onPropose={handlePropose} />
        ) : (
          <ReservationsItemTourist data={data} onAccept={handleAccept} onReject={handleReject} onPropose={handlePropose} />
        )}
        {modal && (
          <Modal
            onHide={() => {
              setModal(false);
            }}
            title={
              <h2>
                Zmień <span className={stylesGlobal.accent}>termin</span> na inny
              </h2>
            }
          >
            <ReservationEditForm data={modalData} onHide={() => setModal(false)} refresh={fetchReservations} />
          </Modal>
        )}
      </div>
    );
  }
}
