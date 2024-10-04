import type { Metadata } from 'next';
import '../globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import stylesGlobal from 'app/styles/global.module.scss';
import Navbar from 'app/components/Navbar';
import SearchBar from 'app/components/Searchbar';
import AuthProvider from '../context/AuthProvider';

export const metadata: Metadata = {
  title: 'Mercurius',
  description: 'Helpful touristic solutions',
  icons: {
    icon: '/images/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className={stylesGlobal.wrapper}>
            <div className={stylesGlobal.navbar}>
              <Navbar />
            </div>
            <div className={stylesGlobal.content}>
              <SearchBar />
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
