'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from './activity.module.scss';

interface PaymentItemProps {
  dateTime: string;
  userId: string;
  amount: string;
  paymentMethod: string;
}

function PaymentItem({ dateTime, userId, amount, paymentMethod }: PaymentItemProps) {
  return (
    <div className={styles.paymentItem}>
      <div className={styles.dateTime}>
        {dateTime}
        <div className={styles.dottedLine} />
      </div>
      <div className={styles.paymentContent}>
        <h2>
          <strong>
            Nowa płatność od <br />
            <span className={styles.userId}>{userId}</span>
          </strong>
        </h2>
        <p>
          Świetne wieści! Użytkownik <strong>{userId}</strong> właśnie dokonał płatności za nadchodzącą przygodę z Wrocławską Wycieczką. Oto
          szczegóły:
        </p>
        <ul>
          <li>Kwota: {amount}</li>
          <li>Metoda płatności: {paymentMethod}</li>
        </ul>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  dateTime: string;
  userId: string;
  route: string;
  date: string;
  time: string;
  tourists: string;
}
function ActivityItem({ dateTime, userId, route, date, time, tourists }: ActivityItemProps) {
  return (
    <div className={styles.paymentItem}>
      <div className={styles.dateTime}>
        {dateTime}
        <div className={styles.dottedLine} />
      </div>
      <div className={styles.paymentContent}>
        <h2>
          <strong>
            Została zarezerwowana <span className={styles.highlight}>Nowa Trasa 🌟</span>
          </strong>
        </h2>
        <p>
          Świetne wieści! Użytkownik <strong>{userId}</strong> właśnie zarezerwował trasę. Oto szczegóły:
        </p>
        <ul>
          <li>Trasa: {route}</li>
          <li>Data: {date}</li>
          <li>Czas: {time}</li>
          <li>Liczba turystów: {tourists}</li>
        </ul>
      </div>
    </div>
  );
}

export default function Component() {
  const { data: session, status } = useSession();
  const payments = [
    {
      dateTime: '01.02.2005 21:37',
      userId: 'Użytkownik20210088',
      amount: '213,7 PLN',
      paymentMethod: 'Karta kredytowa'
    }
  ];
  const activities = [
    {
      dateTime: '01.02.2005 21:37',
      userId: 'Użytkownik20210088',
      route: 'Wroclaw Tour',
      date: '03.04.2005, 17:00',
      time: '01.02.2005, 21:37',
      tourists: '4'
    },
    {
      dateTime: '01.02.2005 21:37',
      userId: 'Użytkownik20210088',
      route: 'Wroclaw Tour',
      date: '03.04.2005, 17:00',
      time: '01.02.2005, 21:37',
      tourists: '4'
    }
  ];
  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  return (
    status === 'authenticated' &&
    session && (
      <div className={styles.activityFeed}>
        <h1>
          <strong>
            Twoje <span className={styles.highlight}>Aktywności</span>
          </strong>
        </h1>
        {payments.map((payment, index) => (
          <PaymentItem key={index} {...payment} />
        ))}
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    )
  );
}
