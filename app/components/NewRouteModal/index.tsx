import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import PointMap from 'app/components/PointMap';
import Modal from 'app/components/ui/Modal';
import styles from './NewRouteModal.module.scss';
import InputField from './InputField';
import CurrencyInputField from './CurrencyInputField';
import TextAreaField from './TextAreaField';
import ImageUpload from './ImageUpload';
import PointInput from './PointInput';
import DifficultySelector from './DifficultySelector';
import SubmitButton from './SubmitButton';

const AddRouteModal = ({ isOpen, onClose, callFetchRoutes }: { isOpen: boolean; onClose: () => void; callFetchRoutes: () => void }) => {
  const [name, setName] = useState('');
  const [points, setPoints]: [points: any, setPoints: any] = useState([null, null]);
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('średni');
  const [description, setDescription] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [images, setImages] = useState<Array<string>>([]);
  const [voivodeships, setVoivodeships] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedVoivodeship, setSelectedVoivodeship] = useState({ value: '', label: '' });
  const [selectedCounty, setSelectedCounty] = useState({ value: '', label: '' });
  const [selectedCity, setSelectedCity] = useState({ value: '', label: '' });
  const [region, setRegion] = useState('');
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);

  const handleRemove = (id: string) => {
    setImages(images.filter((_, index) => index.toString() !== id));
  };

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
    setPoints(['', '']);
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

    for (const image of imageFiles) {
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

    const newRoute: any = {
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
      .post('http://localhost:3000/api/route', JSON.stringify(newRoute), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        resetForm();
        onClose();
        callFetchRoutes();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={
        <h2 className={styles.header}>
          Tworzenie<span> nowej</span> trasy:
        </h2>
      }
      onHide={handleClose}
    >
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

          <Select options={voivodeships} placeholder="Województwo" className={styles.inputSelect} onChange={handleVoivodeshipChange} />
          <Select options={counties} placeholder="Powiat" className={styles.inputSelect} onChange={handleCountyChange} />
          <Select options={cities} placeholder="Miasto" className={styles.inputSelect} onChange={handleCityChange} />
          <div className={styles.points} data-cy="points">
            {points.map((point: any, index: any) => (
              <React.Fragment key={index}>
                <PointInput point={point} index={index} setPoints={setPoints} points={points} region={region} />
                {index === points.length - 2 && (
                  <button type="button" onClick={addPoint}>
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
        <SubmitButton isFormValid={isFormValid} handleSubmit={handleSubmit} />
      </div>
    </Modal>
  );
};

export default AddRouteModal;
