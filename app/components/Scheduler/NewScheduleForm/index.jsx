import axios from 'axios';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import stylesGlobal from '../../../styles/global.module.scss';
import styles from './NewScheduleForm.module.scss';
import { ConfirmationPopup } from '../../ui/ConfirmationPopup';
import { ErrorPopup } from '../../ui/ErrorPopup';

const validationSchema = Yup.object().shape({
  startTime: Yup.string().required('Pole wymagane'),
  selectedObject: Yup.object().required('Pole wymagane'),
  chosenDate: Yup.string().required('Pole wymagane')
});

function NewScheduleForm({ data, onHide }) {
  const [method, setMethod] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMethod(data.method);
  }, [data.method]);

  const handleSubmit = async (values, resetForm) => {
    const { title, chosenDate, startTime, selectedObject } = values;
    const reqData = {
      title,
      dateStart: `${chosenDate}T${startTime}`,
      route: selectedObject.value
    };

    await axios
      .post('http://localhost:3000/api/schedule', reqData)
      .then((response) => {
        if (response.status === 201) {
          resetForm();
          onHide(true);
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      });
  };

  const handleEdit = async (values, resetForm) => {
    const { title, chosenDate, startTime, selectedObject } = values;
    const reqData = {
      title,
      dateStart: `${chosenDate}T${startTime}`,
      route: selectedObject.value
    };

    await axios
      .put(`http://localhost:3000/api/schedule/${data.eventData.id}`, reqData)
      .then((response) => {
        if (response.status === 200) {
          resetForm();
          onHide(true);
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      });
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:3000/api/schedule/${data.eventData.id}`);

    setShowConfirmation(false);
    onHide(true);
  };

  return (
    <>
      {method.toString() === 'create' && <CreationForm onSubmit={handleSubmit} data={data} />}
      {method.toString() === 'edit' && <EditForm onSubmit={handleEdit} data={{ ...data, setShowConfirmation }} />}

      {method.toString() === 'preview' && (
        <div className={styles.formContainer} data-cy="check">
          {data.eventsData.map((event) => (
            <div key={event.id} className={`${styles.previewListElement} ${event.isReserved && styles.reserved}`}>
              {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <span key={event.route._id} className="fw-bold">
                {event.route.name}
              </span>
              <button
                onClick={() => {
                  setMethod('edit');
                  data.eventData = event;
                }}
                className={`${styles.buttonOverlay}`}
              >
                <span className="d-none">Edytuj termin</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setMethod('create');
            }}
            className={`${stylesGlobal.buttonPrimary} `}
          >
            Dodaj nowy termin
          </button>
        </div>
      )}
      {showErrorModal && <ErrorPopup message={errorMessage} dat onHide={() => setShowErrorPopup(true)} />}
      {showConfirmation && (
        <ConfirmationPopup
          onHide={() => setShowConfirmation(false)}
          message="Czy na pewno chcesz usunąć ten termin?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

const CreationForm = ({ onSubmit, data }) => (
  <Formik
    enableReinitialize
    initialValues={{
      startTime: '',
      selectedObject: {},
      chosenDate: data.date
    }}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ setFieldValue, values, errors, touched, isValid, resetForm }) => (
      <Form className={styles.formContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className={styles.formGroupTime}>
            <div>
              <Field
                name="chosenDate"
                type="date"
                className={`${styles.timeInput} ${touched.chosenDate && errors.chosenDate && styles.inputError}`}
              />
            </div>
            <div>
              <Field
                name="startTime"
                type="time"
                className={`${styles.timeInput} ${touched.startTime && errors.startTime && styles.inputError}`}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="selectedObject">Wybierz trasę:</label>
            <Select
              name="selectedObject"
              options={data.guideRoutes.map((route) => ({
                value: route._id,
                label: route.name
              }))}
              onChange={(option) => setFieldValue('selectedObject', option)}
              placeholder="Dodaj istniejącą trasę do wydarzenia*"
              noOptionsMessage={() => 'Brak wyników'}
              loadingMessage={() => 'Ładowanie...'}
              className={touched.selectedObject && errors.selectedObject && styles.inputError}
            />
            {touched.selectedObject && errors.selectedObject && <span className={styles.validationError}>{errors.selectedObject}</span>}
          </div>
        </div>
        <div className={styles.formGroup}>
          <button
            type="button"
            onClick={() => {
              onSubmit(values, resetForm);
            }}
            className={`${stylesGlobal.buttonPrimary} ${styles.submitButton} ${(!isValid || Object.keys(touched).length === 0) && stylesGlobal.disabled}`}
            disabled={!isValid || Object.keys(touched).length === 0}
          >
            Zatwierdź termin
          </button>
        </div>
      </Form>
    )}
  </Formik>
);

const EditForm = ({ onSubmit, data }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        startTime: new Date(data.eventData.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        selectedObject: { value: data?.eventData?.route?._id, label: data?.eventData?.route?.name },
        chosenDate: new Date(data.eventData.start).toISOString().split('T')[0]
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values, errors, touched, isValid, resetForm }) => (
        <Form className={styles.formContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className={styles.formGroupTime}>
              <div>
                <Field
                  name="chosenDate"
                  type="date"
                  className={`${styles.timeInput} ${touched.chosenDate && errors.chosenDate && styles.inputError}`}
                />
              </div>
              <div>
                <Field
                  name="startTime"
                  type="time"
                  className={`${styles.timeInput} ${touched.startTime && errors.startTime && styles.inputError}`}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="selectedObject">Wybierz trasę:</label>
              <Select
                name="selectedObject"
                options={data?.guideRoutes?.map((route) => ({
                  value: route._id,
                  label: route.name
                }))}
                onChange={(option) => setFieldValue('selectedObject', option)}
                value={values.selectedObject}
                placeholder="Dodaj istniejącą trasę do wydarzenia*"
                noOptionsMessage={() => 'Brak wyników'}
                loadingMessage={() => 'Ładowanie...'}
                className={`${stylesGlobal.reactSelect}${touched.selectedObject && errors.selectedObject && styles.inputError}`}
              />
              {touched.selectedObject && errors.selectedObject && <span className={styles.validationError}>{errors.selectedObject}</span>}
            </div>
          </div>
          <div className={styles.formGroup}>
            <button
              onClick={() => {
                onSubmit(values, resetForm);
              }}
              className={`${stylesGlobal.buttonPrimary} ${styles.submitButton} ${!isValid && stylesGlobal.disabled}`}
              disabled={!isValid}
            >
              Zatwierdź termin
            </button>
            <button
              onClick={() => {
                data.setShowConfirmation(true);
              }}
              className={`${stylesGlobal.buttonDelete} ${styles.submitButton}`}
            >
              Usuń termin
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewScheduleForm;
