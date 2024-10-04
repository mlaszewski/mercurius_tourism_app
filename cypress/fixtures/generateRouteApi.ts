import { faker } from '@faker-js/faker';

const difficulty = ['łatwy', 'średni', 'trudny'];

export function generatedRouteDataApi() {
  return {
    name: `Lublin-${faker.number.int({ max: 100 })}`,
    points: [
      {
        placeId: 'places/ChIJTeyA2kFXIkcREbmoB-ZYRkI',
        name: 'plac Po Farze',
        address: {
          street_number: '18',
          route: 'Grodzka',
          locality: 'Lublin',
          administrative_area_level_2: 'Powiat Lublin',
          administrative_area_level_1: 'Województwo lubelskie',
          country: 'Polska',
          postal_code: '20-400'
        },
        summary: 'Słynny plac z ogródkami kawiarnianymi, z których roztacza się widok na odsłonięte ruiny XIII-wiecznego kościoła.',
        wikiIntro:
          'Plac Po Farze – plac na Starym Mieście w Lublinie utworzony po rozebraniu kościoła farnego pw. św. Michała Archanioła. W latach 1936–1938 odkopano fundamenty kościoła, znaleziono wtedy m.in. resztki sklepień żebrowych. Przez wiele lat na placu Po Farze w kilku miejscach widoczne były zarysy fundamentów. W 1991 roku plac otrzymał obecną nazwę.\nW 2002 dokonano zagospodarowania placu, wyeksponowano fundamenty kościoła, wmontowano w nie oświetlenie, położono kostkę. Dzięki temu widać, jakich rozmiarów był kościół św. Michała. Obecnie plac Po Farze jest miejscem koncertów oraz spotkań lublinian.',
        languageCode: 'pl',
        photo:
          'places/ChIJTeyA2kFXIkcREbmoB-ZYRkI/photos/AUGGfZmhWEeCreu5pN61hBTp0E_QcCH2zcCJ_H4-xALT2S5glukTxIKCb3lVjXCQlW2DTDZgdKygTqQglCeIX2cf-3zU6oLX_4Zsr5Glq1ed4J6nmVEZdqWCIm9erafe15znXN5eKgob52mXmI-MHyIEAQmDwYyAbl3ZpyLl',
        coordinates: {
          lat: 51.24876,
          lng: 22.569288099999998
        }
      },
      {
        placeId: 'places/ChIJTeyA2kFXIkcREbmoB-ZYRkI',
        name: 'plac Po Farze',
        address: {
          street_number: '18',
          route: 'Grodzka',
          locality: 'Lublin',
          administrative_area_level_2: 'Powiat Lublin',
          administrative_area_level_1: 'Województwo lubelskie',
          country: 'Polska',
          postal_code: '20-400'
        },
        summary: 'Słynny plac z ogródkami kawiarnianymi, z których roztacza się widok na odsłonięte ruiny XIII-wiecznego kościoła.',
        wikiIntro:
          'Plac Po Farze – plac na Starym Mieście w Lublinie utworzony po rozebraniu kościoła farnego pw. św. Michała Archanioła. W latach 1936–1938 odkopano fundamenty kościoła, znaleziono wtedy m.in. resztki sklepień żebrowych. Przez wiele lat na placu Po Farze w kilku miejscach widoczne były zarysy fundamentów. W 1991 roku plac otrzymał obecną nazwę.\nW 2002 dokonano zagospodarowania placu, wyeksponowano fundamenty kościoła, wmontowano w nie oświetlenie, położono kostkę. Dzięki temu widać, jakich rozmiarów był kościół św. Michała. Obecnie plac Po Farze jest miejscem koncertów oraz spotkań lublinian.',
        languageCode: 'pl',
        photo:
          'places/ChIJTeyA2kFXIkcREbmoB-ZYRkI/photos/AUc7tXXbKG_sdt2Lvp1WwodAB2dEUjSxO2kabp2eHXfGit87Jym3dNldPRTAQN4t-tHMbt6WAhAWR4-q-xRikSJIZlTgfpXKJ67ot-zuIhY8X1w6aLykSCrWxs0hXE0MM4URVylV351-aykANsmvOq3RxKz067S6IyHCD3eJ',
        coordinates: {
          lat: 51.24876,
          lng: 22.569288099999998
        }
      }
    ],
    selectedCity: {
      name: 'Lublin'
    },
    selectedCountry: {
      name: 'Powiat Lublin',
      adminCode: '0609'
    },
    selectedVoivodeship: {
      name: 'Lubelskie',
      geonameId: 858785
    },
    photos: [],
    description: 'Lorem ipsum',
    duration: '01:30',
    durationUnit: 'km',
    difficulty: difficulty[Math.floor(Math.random() * difficulty.length)],
    price: 300
  };
}
