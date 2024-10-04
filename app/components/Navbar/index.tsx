'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.scss';

const NavItem = ({
  href,
  currentPath,
  imgSrc,
  altText,
  text
}: {
  href: string;
  currentPath: string;
  imgSrc: string;
  altText: string;
  text: string;
}) => (
  <li>
    <Link href={href} className={currentPath === href ? styles.active : ''} data-cy={altText}>
      <img src={imgSrc} alt={altText} />
      {text}
    </Link>
  </li>
);

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'authenticated' && session && session.user) {
    const { isGuide } = session.user as { isGuide?: boolean };
    const links = isGuide
      ? [
          { href: '/home/reservations', imgSrc: '/images/booking.svg', altText: 'reservations', text: 'Twoje rezerwacje' },
          { href: '/home/routes', imgSrc: '/images/routes.svg', altText: 'routes', text: 'Twoje trasy' },
          { href: '/home/scheduler', imgSrc: '/images/calendar.svg', altText: 'scheduler', text: 'Kalendarz' },
          { href: '/home/activity', imgSrc: '/images/bulb.svg', altText: 'activity', text: 'Aktywności - demo' },
          { href: '/home/payments', imgSrc: '/images/payments.svg', altText: 'payments', text: 'Płatności - demo' }
        ]
      : [
          { href: '/home/reservations', imgSrc: '/images/booking.svg', altText: 'reservations', text: 'Twoje rezerwacje' },
          { href: '/home/scheduler', imgSrc: '/images/calendar.svg', altText: 'calendar', text: 'Kalendarz' },
          { href: '/home/activity', imgSrc: '/images/bulb.svg', altText: 'activity', text: 'Aktywności - demo' },
          { href: '/home/payments', imgSrc: '/images/payments.svg', altText: 'payments', text: 'Płatności - demo' }
        ];

    return (
      <nav className={styles.nav}>
        <div className={styles.logoWrapper}>
          <img src="/images/logo1_white.svg" alt="Logo" className={styles.logo} />
        </div>
        <ul>
          {links.map((link) => (
            <NavItem {...link} currentPath={pathname} key={link.href} />
          ))}
        </ul>
        <div className={styles.footer}>v. 0.21.37</div>
      </nav>
    );
  }
}
