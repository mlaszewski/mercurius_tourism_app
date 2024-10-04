import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import ProgressBar from 'app/components/ui/ProgressBar';
import axios from 'axios';
import styles from './RegisterForm.module.scss';
import stylesGlobal from '../../styles/global.module.scss';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email jest obowiązkowy')
    .test('unique-email', 'Email jest zajęty', async (value) => {
      if (!value) {
        return false;
      }
      const response = await axios.get('/api/auth/unique-email', {
        params: {
          email: value
        }
      });
      return response.data.unique;
    })
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Nieprawidłowy adres email'
    ),
  password: Yup.string()
    .required('Hasło jest wymagane')
    .min(8, 'Hasło powinno zawierać co najmniej 8 znaków')
    .matches(/[a-z]/, 'Hasło powinno zawierać co najmniej jedną małą literę')
    .matches(/[A-Z]/, 'Hasło powinno zawierać co najmniej jedną dużą literę')
    .matches(/[0-9]/, 'Hasło powinno zawierać co najmniej jedną liczbę')
    .matches(/[!@#$%^&*]/, 'Hasło powinno zawierać co najmniej jeden znak specjalny'),
  isGuide: Yup.boolean().required('To pole jest wymagane'),
  passwordConfirmation: Yup.string()
    .required('Potwierdzenie hasła jest wymagane')
    .oneOf([Yup.ref('password')], 'Hasła muszą być identyczne')
});

const passwordRequirements = [
  {
    test: (password: string) => password.length >= 8,
    message: 'Hasło powinno zawierać co najmniej 8 znaków'
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    message: 'Hasło powinno zawierać co najmniej jedną wielką literę'
  },
  {
    test: (password: string) => /[a-z]/.test(password),
    message: 'Hasło powinno zawierać co najmniej jedną małą literę'
  },
  {
    test: (password: string) => /[0-9]/.test(password),
    message: 'Hasło powinno zawierać co najmniej jedną liczbę.'
  },
  {
    test: (password: string) => /[!@#$%^&*]/.test(password),
    message: 'Hasło powinno zawierać co najmniej jeden znak specjalny'
  }
];

const RegisterForm = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<number>(1);

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerHeader}>
        <ProgressBar step={step} maxStep={5} />
      </div>
      <Formik
        initialValues={{
          email: '',
          password: '',
          isGuide: false,
          passwordConfirmation: ''
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          const { email, password, isGuide } = values;
          await axios.post('/api/auth/signup', {
            email,
            password,
            isGuide
          });

          await signIn('credentials', {
            redirect: false,
            email,
            password
          });
          setStep(5);
        }}
      >
        {({ values, errors, touched, validateForm, setTouched, submitForm, setFieldValue }) => {
          return (
            <>
              <Form className={styles.registerForm}>
                <img src="/images/logo_mini.svg" alt="Logo" className={styles.logo} width={60} />

                {step === 1 && (
                  <>
                    <p className={styles.text}>
                      Witamy w Mercurius! Aby rozpocząć, proszę wybrać swoją rolę: Czy jesteś przewodnikiem czy turystą?
                    </p>
                    <div className={styles.formGroup}>
                      <h3>
                        Wybierz <span className={stylesGlobal.accent}>Twoją</span> rolę:
                      </h3>
                      <div className={styles.roleChoosing}>
                        <button
                          className={`${styles.roleOption} ${!values.isGuide && styles.roleSelected}`}
                          onClick={() => setFieldValue('isGuide', false)}
                        >
                          <img src="/images/tourist1.png" alt="Tourist" />
                          <label htmlFor="tourist">TURYSTA</label>
                        </button>
                        <button
                          className={`${styles.roleOption} ${values.isGuide && styles.roleSelected}`}
                          onClick={() => setFieldValue('isGuide', true)}
                        >
                          <img src="/images/tour-guide1.png" alt="Guide" />
                          <label htmlFor="guide">PRZEWODNIK</label>
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <p className={styles.text}>
                      Świetny wybór! Aby utworzyć konto, proszę podać swój adres e-mail. Będzie to Twój główny kontakt do ważnych
                      aktualizacji i powiadomień.
                    </p>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        Wprowadź <span className={stylesGlobal.accent}>Twój</span> adres email:
                      </label>
                      <Field
                        className={`${styles.textInput} ${errors.email && touched.email && styles.inputError}`}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="user@example.com"
                      />
                      {errors.email && touched.email ? <p className={styles.validationError}>{errors.email}</p> : null}
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <p className={styles.text}>
                      Doskonale! Teraz utwórzmy hasło do Twojego konta. Upewnij się, że jest unikalne i zawiera mieszankę liter, cyfr oraz
                      symboli.
                    </p>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        Wybierz <span className={stylesGlobal.accent}>bezpieczne</span> password:
                      </label>
                      <Field
                        className={`${styles.textInput} ${errors.password && touched.password && styles.inputError}`}
                        type="password"
                        name="password"
                        id="password"
                        required
                        placeholder="************"
                      />
                      {errors.password && touched.password ? <p className={styles.validationError}>{errors.password}</p> : null}
                      <ul className={styles.requirementList}>
                        {passwordRequirements.map((requirement, index) => (
                          <li key={index} className={requirement.test(values.password) ? styles.conditionChecked : styles.conditionInvalid}>
                            {requirement.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {step === 4 && (
                  <>
                    <p className={styles.text}>Aby zapewnić dokładność, proszę ponownie wprowadzić hasło, które właśnie utworzyłeś.</p>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        <span className={stylesGlobal.accent}>Potwierdź</span> hasło:
                      </label>
                      <Field
                        className={`${styles.textInput} ${errors.passwordConfirmation && touched.passwordConfirmation && styles.inputError}`}
                        type="password"
                        name="passwordConfirmation"
                        id="passwordConfirmation"
                        required
                        placeholder="************"
                      />
                      {errors.passwordConfirmation && touched.passwordConfirmation ? (
                        <p className={styles.validationError}>{errors.passwordConfirmation}</p>
                      ) : null}
                    </div>
                  </>
                )}
                {step === 5 && (
                  <>
                    <p className={styles.text}>
                      Gratulacje! Twoje konto zostało utworzone. Aby w pełni korzystać z Mercurius, uzupełnij swoje dane w profilu. Opowiedz
                      nam trochę więcej o sobie, aby dostosować swoje doświadczenie.
                    </p>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">
                        Uzupełnij <span className={stylesGlobal.accent}>dodatkowe szczegóły</span>, aby ukończyć swój profil
                      </label>
                    </div>
                  </>
                )}
              </Form>
              <div className={styles.buttonGroup}>
                <button
                  className={stylesGlobal.buttonPrimary}
                  hidden={step !== 5}
                  onClick={() => {
                    window.location.href = '/profileEdit';
                  }}
                >
                  Uzupełnij dodatkowe informacje
                </button>
                <button
                  className={stylesGlobal.buttonSecondary}
                  hidden={step !== 5}
                  onClick={() => {
                    window.location.href = '/home';
                  }}
                >
                  Zacznijmy
                </button>
                <button
                  onClick={() => {
                    validateForm(values).then(async () => {
                      if (
                        !((errors.email && step === 2) || (errors.password && step === 3) || (errors.passwordConfirmation && step === 4))
                      ) {
                        if (step < 4) setStep((prevState) => prevState + 1);
                        else {
                          await submitForm();
                        }
                      }
                      if (step === 2 && errors.email) {
                        await setTouched({ email: true });
                      }
                      if (step === 3 && errors.password) {
                        await setTouched({ password: true });
                      }
                      if (step === 4 && errors.passwordConfirmation) {
                        await setTouched({ passwordConfirmation: true });
                      }
                    });
                  }}
                  className={`${stylesGlobal.buttonPrimary} ${
                    (step === 2 && (!!errors.email || !values.email)) ||
                    (step === 3 && (!!errors.password || !values.password)) ||
                    (step === 4 && (!!errors.passwordConfirmation || !values.passwordConfirmation))
                      ? styles.buttonPrimaryDisabled
                      : ''
                  }`}
                  hidden={step === 5}
                  disabled={
                    (step === 2 && (!!errors.email || !values.email)) ||
                    (step === 3 && (!!errors.password || !values.password)) ||
                    (step === 4 && (!!errors.passwordConfirmation || !values.passwordConfirmation))
                  }
                >
                  {' '}
                  Dalej{' '}
                </button>
                <button
                  className={styles.goBackButton}
                  hidden={step === 5}
                  onClick={() => {
                    if (step > 1) setStep((prevState) => prevState - 1);
                    else onBack();
                  }}
                >
                  Wróć
                </button>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default RegisterForm;
