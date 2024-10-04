import { useEffect, useState } from 'react';
import { Form, Formik, Field } from 'formik';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import stylesGlobal from '../../../../styles/global.module.scss';
import styles from '../../../RegisterForm/RegisterForm.module.scss';

const fetchPoints = async (query) => {
  const response = await axios.get(`/api/point?title=${query}&lang=pl`);
  return response.data.result;
};

const PointChooser = ({ field, form: { touched, errors }, ...props }) => {
  const [query, setQuery] = useState('');
  const [points, setPoints] = useState([]);

  return (
    <div>
      <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
      <button
        onClick={async () => {
          const result = await fetchPoints(query);
          setPoints(result);
        }}
      >
        Search
      </button>
      <div>
        {points.length > 0 &&
          points.map((element) => (
            <div>
              <Field
                type="checkbox"
                value={element.placeId}
                name={field.name}
                checked={props.pointsArr.findIndex((el) => el.placeId === element.placeId) !== -1}
                onChange={(e) =>
                  props.pointsArr.findIndex((el) => el.placeId === element.placeId) === -1
                    ? props.pointsHandler((prev) => {
                        const newArr = [...prev, element];
                        return newArr;
                      })
                    : props.pointsHandler((prev) => {
                        const newArr = [...prev];
                        newArr.splice(
                          newArr.findIndex((el) => el.placeId === element.placeId),
                          1
                        );
                        return newArr;
                      })
                }
              />
              <label>{element.name}</label>
              <div>
                <p>{`${element.address.route} ${element.address.street_number}`}</p>
                <p>{element.address.locality}</p>
                <p>{element.address.administrative_area_level_1}</p>
                <p>{element.address.country}</p>
              </div>
              <p>{element.summary}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

const NewRouteForm = () => {
  const { data: session, status } = useSession();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    } else if (!session.user.isGuide) {
      redirect('/home/activity');
    }
  }, [session, status]);

  useEffect(() => {
    console.log('points', points);
  }, [points]);

  if (status === 'authenticated' && session.user.isGuide) {
    return (
      <div className={styles.registerContainer}>
        <Formik
          enableReinitialize
          initialValues={{
            name: '',
            description: '',
            points,
            photos: [],
            duration: 0,
            durationUnit: 'h',
            distance: 0,
            distanceUnit: 'km',
            difficulty: 'easy',
            price: 0,
            priceCurrency: 'zł',
            pricePer: 'person',
            priceDetails: '',
            additionalInfo: '',
            tags: []
          }}
          onSubmit={async (values) => {
            const response = await axios.post('/api/route', values);
          }}
        >
          <Form className={styles.registerForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <Field className={`${styles.textInput}`} type="text" name="name" id="name" placeholder="Name your route..." />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <Field
                className={`${styles.textInput}`}
                as="textarea"
                name="description"
                id="description"
                placeholder="Write something about your route..."
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="distance">Distance</label>
              <Field className={`${styles.textInput}`} type="text" name="distance" id="distance" placeholder="distance" />
              <label htmlFor="distance">Unit</label>
              <Field className={`${styles.textInput}`} as="select" name="distanceUnit" id="distanceUnit">
                <option value="km">km</option>
                <option value="m">m</option>
              </Field>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="duration">Duration</label>
              <Field className={`${styles.textInput}`} type="text" name="duration" id="duration" placeholder="duration" />
              <label htmlFor="duration">Unit</label>
              <Field className={`${styles.textInput}`} as="select" name="durationUnit" id="durationUnit">
                <option value="h">h</option>
                <option value="min">min</option>
              </Field>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="difficulty">Difficulty</label>
              <Field className={`${styles.textInput}`} as="select" name="difficulty" id="difficulty" placeholder="difficulty">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </Field>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price</label>
              <Field className={`${styles.textInput}`} type="text" name="price" id="price" placeholder="price" />
              <label htmlFor="price">Currency</label>
              <Field className={`${styles.textInput}`} as="select" name="priceCurrency" id="priceCurrency" placeholder="price">
                <option value="zł">zł</option>
                <option value="€">€</option>
                <option value="$">$</option>
              </Field>
              <label htmlFor="price">Per</label>
              <Field className={`${styles.textInput}`} as="select" name="pricePer" id="pricePer" placeholder="price">
                <option value="person">person</option>
                <option value="group">group</option>
                <option value="hour">hour</option>
              </Field>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="priceDetails">Price details</label>
              <Field className={`${styles.textInput}`} as="textarea" name="priceDetails" id="priceDetails" placeholder="price details" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="additionalInfo">Additional info</label>
              <Field
                className={`${styles.textInput}`}
                as="textarea"
                name="additionalInfo"
                id="additionalInfo"
                placeholder="additional info"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tags">Tags</label>
              <Field className={`${styles.textInput}`} type="text" name="tags" id="tags" placeholder="tags" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="points">Points</label>
              <Field
                className={`${styles.textInput}`}
                component={PointChooser}
                name="points"
                id="points"
                pointsArr={points}
                pointsHandler={setPoints}
              />
            </div>
            <button type="submit" className={stylesGlobal.buttonPrimary}>
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    );
  }
  return null;
};

export default NewRouteForm;
