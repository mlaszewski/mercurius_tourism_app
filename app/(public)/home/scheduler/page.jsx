'use client';

import Scheduler from 'app/components/Scheduler';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, redirect } from 'next/navigation';
import 'app/globals.scss';

export default function Component() {
  const [user, setUser] = useState(null);

  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!!searchParams.get('guide')) {
      setUser({ id: searchParams.get('guide'), isGuide: true });
    } else if (session) {
      setUser(session.user);
    }
  }, [session, searchParams]);

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);
  if (status === 'authenticated' && session) {
    return <Scheduler user={user} />;
  }
  return null;
}
