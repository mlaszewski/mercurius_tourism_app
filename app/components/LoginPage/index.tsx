import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.scss';
import stylesGlobal from '../../styles/global.module.scss';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

const LoginPage: React.FC = () => {
  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);
  const { status } = useSession();
  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/home');
    }
  }, [status]);
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {isLoginPage ? (
          <div className={styles.loginContainer}>
            <img src="/images/logo1.svg" alt="Logo" className={styles.logo} />
            <div>
              <h1 className={styles.loginHeader}>
                Zaloguj się do
                <span className={stylesGlobal.accent}> Twojego</span> konta
              </h1>
              <div className={styles.inlineContainer}>
                <p className={styles.text}>Nie jesteś członkiem?</p>
                <button className={stylesGlobal.buttonText} onClick={() => setIsLoginPage(false)}>
                  Czas na przygodę! Wejdź aby utworzyć konto
                </button>
              </div>
            </div>
            <LoginForm />
          </div>
        ) : (
          <div className={styles.loginContainer}>
            <RegisterForm onBack={() => setIsLoginPage(true)} />
          </div>
        )}
        <div className={styles.loginImage} />
      </div>
    </div>
  );
};

export default LoginPage;
