/// <reference types="cypress" />

import { faker, simpleFaker } from '@faker-js/faker';
import registration from '../support/registration';
import base from '../support/base';
import searchBar from '../support/searchBar';

describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/login');
    registration.clickRegisterButton();
  });

  it('Should register new user', () => {
    const userEmail = `${faker.internet.email().split('@')[0]}+${Date.now()}@${faker.internet.email().split('@')[1]}`;
    const userPassword = `Password!${simpleFaker.number.int(1000)}`;

    registration.selectRole('tourist');
    base.clickButton('Dalej');
    registration.fillEmailInput(userEmail);
    base.clickButton('Dalej');
    registration.fillPasswordInput(userPassword);
    base.clickButton('Dalej');
    registration.fillPasswordConfirmationInput(userPassword);
    base.clickButton('Dalej');

    searchBar.assertLoggedUser(userEmail);
    base.assertPage('Rezerwacje', '/home/reservations');
  });

  it('Should not register with invalid password or email values', () => {
    const userEmail = `${faker.internet.email().split('@')[0]}+${Date.now()}@${faker.internet.email().split('@')[1]}`;
    const userPassword = `Password!${simpleFaker.number.int(1000)}`;

    cy.fixture('passwordValidationErrors.json').then((passwordValidationErrors) => {
      registration.selectRole('tourist');
      base.clickButton('Dalej');

      registration.fillEmailAndAssertError('invalidEmail', 'Nieprawidłowy adres email');
      registration.fillEmailInput(userEmail);
      base.clickButton('Dalej');

      passwordValidationErrors.forEach(({ password, errorMessage }: { password: string; errorMessage: string }) => {
        registration.fillPasswordAndAssertError(password, errorMessage);
      });

      registration.fillPasswordInput(userPassword);
      base.clickButton('Dalej');

      registration.fillPasswordConfirmationAndAssertError('Password2!', 'Hasła muszą być identyczne');

      registration.fillPasswordConfirmationInput(userPassword);

      base.clickButton('Dalej');

      searchBar.assertLoggedUser(userEmail);
      base.assertPage('Rezerwacje', '/home/reservations');
    });
  });
});
