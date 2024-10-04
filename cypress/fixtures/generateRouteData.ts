import { faker } from '@faker-js/faker';

const difficulty = ['Łatwy', 'Średni', 'Trudny'];

export function generatedRouteData() {
  return {
    name: `Lublin nocą-${faker.number.int({ max: 100 })}`,
    price: '250',
    province: 'Lubelskie',
    district: 'Lublin',
    city: 'Lublin',
    startingPoint: 'Zamek w Lublinie',
    middlePoint: 'Zalew Zemborzycki',
    endingPoint: 'Brama Krakowska',
    description: 'Wieczorny spacer po najpiękniejszych zakątkach Lublina.',
    difficulty: difficulty[Math.floor(Math.random() * difficulty.length)],
    time: '12:30',
    image: 'routeImage.png',
    startTime: null
  };
}
