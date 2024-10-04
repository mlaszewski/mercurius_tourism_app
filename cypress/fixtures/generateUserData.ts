import { faker } from '@faker-js/faker';
import { random } from 'lodash';

export function generateUserData() {
  return {
    bio: `Lorem ipsum,${random(1, 100)}`,
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    language: 'Polski',
    email: faker.internet.email(),
    contactPhone: faker.phone.imei(),
    birthDate: new Date(faker.date.past()).toISOString().slice(0, 10)
  };
}
