'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Component() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    } else {
      redirect('/home/reservations');
    }
  }, [status]);
}
