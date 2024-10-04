/// <reference types="cypress" />

import login from '../support/login';
import searchBar from '../support/searchBar';
import base from '../support/base';

describe('Login', () => {
  it('Should login and logout using valid credentials', () => {
    login.login('user-e2e1@gmail.com', 'tese#@E@#edD3');
    searchBar.assertLoggedUser('user-e2e1@gmail.com');
    base.assertPage('Rezerwacje', '/home/reservations');
    searchBar.useDropdownMenu('Wyloguj');
    base.assertPage('Zaloguj się do Twojego konta', '/login');
  });

  it("Shouldn't login with invalid credentials", () => {
    cy.visit('/login');
    cy.get('[id="email"]').type('invalid-email@gmail.com');
    cy.get('[id="password"]').type('invalid-password');

    cy.get('[data-cy="login"]').click();

    login.assertLoginError('Niepoprawne hasło lub e-mail. Spróbuj ponownie.');
  });
});
