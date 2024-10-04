'use client';

import { Form, Formik, Field, FieldProps } from 'formik';
import axios from 'axios';
import styles from './AdditionalDataForm.module.scss';

const AdditionalDataForm = ({ userData }: { userData: any }) => {
  return (
    <div className={styles.formContainer}>
      <Formik
        enableReinitialize
        initialValues={{
          name: userData.profile?.name || '',
          languages: userData.profile?.languages || '',
          contactEmail: userData.profile?.contact?.email || '',
          contactPhone: userData.profile?.contact?.phone || '',
          birthDate: userData.profile?.birthDate || '',
          bio: userData.profile?.bio || '',
          notifications: {
            email: userData.notifications?.email || false,
            sms: userData.notifications?.sms || false
          }
        }}
        onSubmit={async (values) => {
          const profile = {
            name: values.name,
            languages: values.languages,
            contact: {
              phone: values.contactPhone,
              email: values.contactEmail
            },
            birthDate: values.birthDate,
            bio: values.bio,
            notifications: values.notifications
          };
          await axios.put(`/api/user/${userData._id}`, { profile });
        }}
      >
        {({ submitForm }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <Field className={styles.textArea} as="textarea" name="bio" placeholder="Opis" maxLength="400" />
              <div className={styles.textLength}>0/400</div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Field className={styles.textInput} type="text" name="name" placeholder="Imię i nazwisko" />
              </div>
              <div className={styles.formGroup}>
                <Field className={styles.textInput} type="text" name="languages" placeholder="Języki" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Field className={styles.textInput} type="email" name="contactEmail" placeholder="E-mail" />
              </div>
              <div className={styles.formGroup}>
                <Field className={styles.textInput} type="text" name="contactPhone" placeholder="Numer telefonu" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Field className={styles.textInput} type="text" name="birthDate" placeholder="Data urodzenia" />
              </div>
              <div className={styles.formGroup}>
                <button type="button" className={styles.passwordButton}>
                  Zmień hasło <img src="/images/arrow.svg" alt="Arrow" />
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Powiadom mnie o zmianach statusu rezerwacji</label>
              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <Field name="notifications.email">
                    {({ field }: FieldProps) => (
                      <>
                        <input type="checkbox" {...field} className={styles.hiddenCheckbox} />
                        <span className={styles.customCheckbox} />
                        e-mail
                      </>
                    )}
                  </Field>
                </label>
                <label className={styles.checkboxLabel}>
                  <Field name="notifications.sms">
                    {({ field }: FieldProps) => (
                      <>
                        <input type="checkbox" {...field} className={styles.hiddenCheckbox} />
                        <span className={styles.customCheckbox} />
                        wiadomość sms
                      </>
                    )}
                  </Field>
                </label>
              </div>
            </div>
            <button type="submit" onClick={submitForm} className={styles.submitButton}>
              Zapisz zmiany
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdditionalDataForm;
