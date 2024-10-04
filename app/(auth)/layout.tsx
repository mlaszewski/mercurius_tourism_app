import '../globals.scss';
import AuthProvider from '../context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: 'Mercurius',
  description: 'Helpful touristic solutions'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
