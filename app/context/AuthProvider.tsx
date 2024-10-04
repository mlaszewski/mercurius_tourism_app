'use client';

import { SessionProvider } from 'next-auth/react';

// eslint-disable-next-line react/require-default-props
type Props = { children?: React.ReactNode };

function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;
