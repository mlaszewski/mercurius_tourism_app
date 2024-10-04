import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Modal from 'app/components/ui/Modal';

import FullCalendar from '@fullcalendar/react';
import plLocale from '@fullcalendar/core/locales/pl';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import stylesGlobal from '../../styles/global.module.scss';
import './fullCalendarStyles.scss';
import NewScheduleForm from './NewScheduleForm';

const getAvailableRoutes = async () => {
  const response = await axios.get('http://localhost:3000/api/route/my-routes');
  return response.data.result;
};

const Scheduler = ({ user }) => {
  const [events, setEvents] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const { data: session } = useSession();

  const getScheduleEvents = async () => {
    let formattedEvents = [];
    if (session.user.isGuide) {
      await axios.get(`/api/schedule/guide/${user.id}`).then((response) => {
        formattedEvents = response.data.result.map((event) => ({
          id: event._id,
          title: event?.route?.name || '',
          start: new Date(event.dateStart),
          end: new Date(event.dateEnd),
          route: event.route,
          isReserved: event.isReserved
        }));
      });
    } else {
      await axios.get(`/api/reservation/my-reservations`).then((response) => {
        formattedEvents = response.data.result
          .filter((event) => event.isReserved)
          .map((event) => ({
            title: event.schedule.route.name,
            start: new Date(event.schedule.dateStart),
            end: new Date(event.schedule.dateEnd)
          }));
      });
    }
    setEvents(formattedEvents);
  };

  const handleDayClick = async (info) => {
    const foundEvents = events.filter((event) => {
      return event.start.toLocaleDateString() === new Date(info.dateStr).toLocaleDateString();
    });

    setModalData({
      date: info.dateStr,
      method: foundEvents.length !== 0 ? 'preview' : 'create',
      guideId: user.id,
      eventsData: foundEvents
    });
    setShowModal(true);
  };

  const handleModalClose = (isSaved) => {
    setShowModal(false);
    if (isSaved) {
      getScheduleEvents();
    }
  };

  useEffect(() => {
    if (!!user) {
      getScheduleEvents();
    }
  }, [user]);

  return (
    <>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDayClick}
          headerToolbar={{
            start: '',
            end: 'prev,title,next'
          }}
          dayMaxEventRows // allow "more" link when too many events
          firstDay={1}
          locale={plLocale}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
        />
      </div>

      {user?.isGuide && user?.id === session?.user?.id
        ? showModal && <ScheduleModal onHide={handleModalClose} data={modalData} />
        : showModal && <div>{/* <ReservationModal onHide={handleModalClose} data={modalData} /> */}</div>}
    </>
  );
};

// function ReservationModal({ show, onHide, data }) {
//   const [formData, setFormData] = useState({
//     startTime: '',
//     endTime: '',
//     chosenRoute: ''
//   });
//
//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       title={
//         <h2>
//           Nowe <span className={stylesGlobal.accent}>wydarzenie</span>:
//         </h2>
//       }
//     ></Modal>
//   );
// }

function ScheduleModal({ onHide, data }) {
  const [availableRoutes, setAvailableRoutes] = useState([]);

  useEffect(() => {
    getAvailableRoutes().then((routes) => {
      setAvailableRoutes(routes);
    });
  }, []);

  return (
    <Modal
      onHide={onHide}
      title={
        data.method === 'create' ? (
          <h2>
            Nowy <span className={stylesGlobal.accent}>termin</span>:
          </h2>
        ) : (
          <h2>
            Termin <span className={stylesGlobal.accent}>{data.date}</span>:
          </h2>
        )
      }
    >
      <NewScheduleForm onHide={onHide} data={{ guideRoutes: availableRoutes, ...data }} />
    </Modal>
  );
}

export default Scheduler;
