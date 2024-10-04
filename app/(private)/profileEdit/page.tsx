'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import AdditionalDataForm from 'app/components/AdditionalDataForm';
import UserModel from 'lib/utils/types/user';
import axios from 'axios';
import styles from './profileEdit.module.scss';

export default function Component() {
  const { data: session, status }: { data: any; status: any } = useSession();
  const [userData, setUserData] = useState<UserModel>({
    _id: session?.user?.id || '',
    email: session?.user?.email || ''
  });

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      axios.get(`/api/user/me`).then((res) => {
        setUserData(res.data.user);
      });
    }
  }, [session]);

  return (
    status === 'authenticated' &&
    session && (
      <div className={styles.profileContainer}>
        <h1>
          <strong>
            Ustawienia <span className={styles.highlight}>konta</span>
          </strong>
        </h1>
        <div className={styles.profileDetails}>
          <div className={styles.profileImageWrapper}>
            <img src="/icons/user-icon-placeholder.png" alt="Profile" className={styles.profileImage} />
            <button className={styles.cameraButton}>
              <img src="/images/aparat.svg" alt="Change" />
            </button>
          </div>
          <div className={styles.profileInfo}>
            <h2>{userData?.profile?.name ?? userData?.email}</h2>
            <p>{userData?.profile?.contact?.phone || ''}</p>
          </div>
        </div>
        <AdditionalDataForm userData={userData} />
        <div className={styles.bottomLinks}>
          <a href="/privacy-policy" className={styles.link}>
            Polityka prywatności
          </a>
          <a href="/terms" className={styles.link}>
            Regulamin
          </a>
        </div>
      </div>
    )
  );
}
