'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from './payments.module.scss';

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

export default function PaymentsPage() {
  const payments = [
    {
      dateTime: '01.02.2005 21:37',
      userId: 'Użytkownik20210088',
      amount: '213,7 PLN',
      paymentMethod: 'Karta kredytowa'
    },
    {
      dateTime: '01.02.2005 21:37',
      userId: 'Użytkownik20210088',
      amount: '213,7 PLN',
      paymentMethod: 'Karta kredytowa'
    },
    {
      dateTime: '01.02.2005 21:37',
      userId: 'Użytkownik20210088',
      amount: '213,7 PLN',
      paymentMethod: 'Karta kredytowa'
    }
  ];

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  return (
    status === 'authenticated' &&
    session && (
      <div className={styles.paymentsFeed}>
        <h1>
          <strong>
            Twoje <span className={styles.highlight}>Płatności</span>
          </strong>
        </h1>
        {payments.map((payment, index) => (
          <PaymentItem key={index} {...payment} />
        ))}
      </div>
    )
  );
}
