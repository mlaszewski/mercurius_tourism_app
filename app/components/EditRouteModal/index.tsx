import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PointMap from 'app/components/PointMap';
import Select from 'react-select';
import styles from './NewRouteModal.module.scss';
import InputField from './InputField';
import CurrencyInputField from './CurrencyInputField';
import TextAreaField from './TextAreaField';
import ImageUpload from './ImageUpload';
import DifficultySelector from './DifficultySelector';
import PointInput from './PointInput';

const EditRouteModal = ({
  routeData,
  closeModals,
  callFetchRoutes = null
}: {
  routeData: any;
  closeModals: any;
  callFetchRoutes?: any;
}) => {
  const [name, setName] = useState(routeData.name);
  const [points, setPoints] = useState(
    routeData.points.length < 2
      ? routeData.points.length === 0
        ? [{}, {}]
        : [
            { value: routeData.points[0], label: routeData.points[0].name },
            { value: {}, label: '' }
          ]
      : routeData.points.map((point: any) => ({ value: point, label: point.name }))
  );
  const [price, setPrice] = useState(routeData.price);
  const [selectedVoivodeship, setSelectedVoivodeship] = useState({
    label: routeData.addressInformation.voivodeship.name,
    value: routeData.addressInformation.voivodeship.geonameId
  });
  const [selectedCounty, setSelectedCounty] = useState({
    label: routeData.addressInformation.county.name,
    value: routeData.addressInformation.county.adminCode
  });
  const [selectedCity, setSelectedCity] = useState({
    label: routeData.addressInformation.city.name,
    value: routeData.addressInformation.city.name
  });
  const [voivodeships, setVoivodeships] = useState();
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [duration, setDuration] = useState(routeData.duration);
  const [difficulty, setDifficulty] = useState(routeData.difficulty);
  const [description, setDescription] = useState(routeData.description);
  const [isFormValid, setIsFormValid] = useState(false);
  const [images, setImages] = useState<Array<string>>(routeData.photos);
  const [region, setRegion] = useState('');
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);

  useEffect(() => {
    console.log(routeData.addressInformation.voivodeship);
  });

  const handleImageChange = async (e: any, index: number) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages((oldImages: Array<string>) => {
        const newImages = [...oldImages];
        newImages[index] = url;
        return newImages;
      });
      setImageFiles((oldFiles: Array<File>) => {
        const newFiles = [...oldFiles];
        newFiles[index] = file;
        return newFiles;
      });
    }
    e.target.value = null;
  };

  const handleRemove = (id: string) => {
    setImages(images.filter((_, index) => index.toString() !== id));
  };

  useEffect(() => {
    if (name && price && description && duration) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, price, description, duration]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/data-fetch/geocoding/voivodeships')
      .then((response) => {
        const options = response.data.regions.map((voivodeship: any) => ({
          value: voivodeship.geonameId,
          label: voivodeship.name
        }));
        setVoivodeships(options);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleVoivodeshipChange = (selectedVoivodeship: any) => {
    setSelectedVoivodeship(selectedVoivodeship);
    axios
      .get(`/api/data-fetch/geocoding/counties?geonameId=${selectedVoivodeship.value}`)
      .then((response) => {
        const options = response.data.regions.map((county: { adminCode2: string; name: string }) => ({
          value: county.adminCode2,
          label: county.name
        }));
        setCounties(options);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleCountyChange = (selectedCounty: any) => {
    setSelectedCounty(selectedCounty);
    axios
      .get(`/api/data-fetch/geocoding/cities?adminCode=${selectedCounty.value}`)
      .then((response) => {
        const options = response.data.regions.map((city: any) => ({
          value: city.name,
          label: city.name
        }));
        setCities(options);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleCityChange = (selectedCity: any) => {
    setSelectedCity(selectedCity);
  };

  useEffect(() => {
    setRegion(
      selectedCity.label ||
        selectedCounty.label ||
        selectedVoivodeship.label ||
        points[0]?.value?.address?.locality ||
        points[points.length - 1]?.value?.address?.locality ||
        points[0]?.value?.address?.administrative_area_level_2 ||
        points[points.length - 1]?.value?.address?.administrative_area_level_2 ||
        points[0]?.value?.address?.administrative_area_level_1 ||
        points[points.length - 1]?.value?.address?.administrative_area_level_1 ||
        ''
    );
  }, [selectedCity, selectedCounty, selectedVoivodeship, points]);

  const resetForm = () => {
    setName('');
    setPoints([{}, {}]);
    setPrice('');
    setSelectedVoivodeship({ value: '', label: '' });
    setSelectedCounty({ value: '', label: '' });
    setSelectedCity({ value: '', label: '' });
    setDuration('');
    setDifficulty('średni');
    setDescription('');
    setImages([]);
  };

  const addPoint = () => {
    const newPoints = [...points];
    newPoints.splice(points.length - 1, 0, '');
    setPoints(newPoints);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    const imageURLs: any = [];

    for (let i = 0; i < images.length; i += 1) {
      const image = imageFiles[i];
      const imageUrl = images[i];
      if (!image && imageUrl) imageURLs.push(imageUrl);
      else {
        const formData = new FormData();
        formData.append('file', image);

        await axios
          .post('/api/file-upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => {
            imageURLs.push(res.data.filePath);
          });
      }
    }

    const newRoute = {
      name,
      points: points.map((point: any) => point?.value ?? ''),
      photos: imageURLs,
      description,
      duration,
      difficulty,
      price: Number(price.toString().replace('PLN', '').replace(/,/g, '').trim()),
      selectedCounty: { name: selectedCounty.label, adminCode: selectedCounty.value },
      selectedCity: { name: selectedCity.label },
      selectedVoivodeship: { name: selectedVoivodeship.label, geonameId: selectedVoivodeship.value }
    };

    axios
      .put(`http://localhost:3000/api/route/${routeData._id}`, JSON.stringify(newRoute), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        resetForm();
        closeModals();
        if (callFetchRoutes) callFetchRoutes();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.map}>
        <PointMap points={points.map((point: any) => point?.value)} />
      </div>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <InputField type="text" value={name} setValue={setName} placeholder="Dodaj nazwę trasy*" isRequired />
        <CurrencyInputField
          value={price}
          setValue={setPrice}
          placeholder="Podaj cenę*"
          isRequired
          decimalsLimit={2}
          maxLength={10}
          prefix="PLN "
        />
        <span className={styles.info}>
          {' '}
          Jeśli podasz region, powiat i miasto to pozwoli nam zawęzić zakres wyszukiwania według tych parametrów
        </span>

        <Select
          options={voivodeships}
          placeholder="Województwo"
          className={styles.inputSelect}
          onChange={handleVoivodeshipChange}
          value={selectedVoivodeship}
          id="voivodeship"
        />
        <Select
          options={counties}
          placeholder="Powiat"
          className={styles.inputSelect}
          onChange={handleCountyChange}
          value={selectedCounty}
          id="country"
        />
        <Select
          options={cities}
          placeholder="Miasto"
          className={styles.inputSelect}
          onChange={handleCityChange}
          value={selectedCity}
          id="city"
        />

        <div className={styles.points} data-cy="points">
          {points.map((point: any, index: any) => (
            <React.Fragment key={index}>
              <PointInput point={point} index={index} setPoints={setPoints} points={points} region={region} />
              {index === points.length - 2 && (
                <button className={styles.gitaddPoint} type="button" onClick={addPoint}>
                  Dodaj punkt
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.routeTime}>
          <label>Podaj czas trwania trasy*</label>
          <input
            type="time"
            value={duration}
            className={styles.input}
            onChange={(e) => {
              const { value } = e.target;
              const regex = /^\d{0,2}(:\d{0,2})?$/;

              if (value.length === 2 && duration.length === 1) {
                if (regex.test(`${value}:`)) {
                  setDuration(`${value}:`);
                }
              } else if (regex.test(value)) {
                setDuration(value);
              }
            }}
          />
        </div>
        <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
        <TextAreaField value={description} setValue={setDescription} placeholder="Opis*" isRequired maxLength={2000} />
        <div className={styles.photos}>
          {['upload1', 'upload2', 'upload3', 'upload4'].map((id, index) => (
            <ImageUpload
              key={id}
              id={id}
              image={images[index] ? images[index].toString() : ''}
              onImageChange={(e: any) => handleImageChange(e, index)}
              onRemove={() => handleRemove(String(index))}
            />
          ))}
        </div>
      </form>
      <button className={`${styles.submitButton} ${!isFormValid ? styles.disabled : ''}`} onClick={handleSubmit} disabled={!isFormValid}>
        Zapisz
      </button>
    </div>
  );
};

export default EditRouteModal;
