import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from './LoginForm.module.scss';
import stylesGlobal from '../../styles/global.module.scss';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    if (result?.error) {
      setError('Niepoprawne hasło lub e-mail. Spróbuj ponownie.');
      console.error('Login error:', result.error);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email">E-mail</label>
        <input
          className={styles.textInput}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="user@gmail.com"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Hasło</label>
        <input
          className={styles.textInput}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="************"
        />
        {error && (
          <p className={styles.validationError} data-cy="text-error">
            {error}
          </p>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button type="submit" className={stylesGlobal.buttonPrimary} data-cy="login">
          Zaloguj
        </button>
        <button onClick={() => signIn('google', { redirect: false })} className={stylesGlobal.buttonSecondary}>
          <div>
            <Image src="/icons/google-32.png" alt="" width="24" height="24" />
            <span>Zaloguj się przez Google</span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
