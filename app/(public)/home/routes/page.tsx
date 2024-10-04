'use client';

import RouteCard from 'app/components/RouteCard';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import AddRouteModal from 'app/components/NewRouteModal';
import styles from 'app/(public)/home/routes/routes.module.scss';
import { IoAdd } from 'react-icons/io5';

export default function Component() {
  const { data: session, status } = useSession();
  const [isModalOpen, setModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/route/my-routes');
      const data = await response.json();
      setRoutes(data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'authenticated' && session) {
    return (
      <div className={styles.routes}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Twoje <span className={styles.highlight}>Trasy</span>
          </h1>
        </div>
        <div className={styles.grid}>
          <button className={styles.card} onClick={openModal}>
            <div className={styles.addNewContent}>
              <IoAdd className={styles.addNewIcon} />
              <span className={styles.addNewText}>Dodaj trasę</span>
            </div>
          </button>
          {Array.isArray(routes) &&
            routes.map((route: { _id: string }) => <RouteCard route={route} key={route._id} callFetchRoutes={fetchRoutes} />)}
        </div>
        <AddRouteModal isOpen={isModalOpen} onClose={closeModal} callFetchRoutes={fetchRoutes} />
      </div>
    );
  }
}
