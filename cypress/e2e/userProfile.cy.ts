/// <reference types="cypress" />

import login from '../support/login';
import searchBar from '../support/searchBar';
import base from '../support/base';
import profile from '../support/profile';
import { generateUserData } from '../fixtures/generateUserData';
import navBar from '../support/navBar';

describe('Edit profile', () => {
  beforeEach(() => {
    login.login('user-e2e@gmail.com', 'tese#@E@#edD3');
    base.assertPage('Rezerwacje', '/home/reservations');
  });

  it('Should edit profile', () => {
    const user = generateUserData();

    cy.intercept('GET', 'http://localhost:3000/api/user/me').as('getUser');

    searchBar.useDropdownMenu('Profil');
    base.assertPage('Ustawienia konta', '/profileEdit');
    cy.wait('@getUser');
    cy.wait('@getUser').then(({ response }) => {
      const userName = response?.body.user.profile.name;
      cy.get('h2').should('contain', userName);
    });

    profile.fillProfile(user);
    base.clickButton('Zapisz zmiany');

    navBar.clickNavbarOption('reservations', 'Rezerwacje', '/reservations');
    searchBar.useDropdownMenu('Profil');
    base.assertPage('Ustawienia konta', '/profileEdit');
    cy.wait('@getUser');
    cy.wait('@getUser').then(({ response }) => {
      const userName = response?.body.user.profile.name;
      cy.get('h2').should('contain', user.name);
    });
    profile.assertProfile(user);
  });
});
