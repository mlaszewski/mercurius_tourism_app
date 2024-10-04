/// <reference types="cypress" />

import { generatedRouteDataApi } from 'cypress/fixtures/generateRouteApi';
import base from 'cypress/support/base';
import login from 'cypress/support/login';
import navBar from 'cypress/support/navBar';
import reservations from 'cypress/support/reservations';
import searchBar from 'cypress/support/searchBar';

let routeId: string;
const route = generatedRouteDataApi();

describe('Reservations', () => {
  beforeEach(() => {
    login.login('user-guide2@gmail.com', 'tese#@E@#edD3');
    searchBar.assertLoggedUser('user-guide2@gmail.com');
    base.assertPage('Rezerwacje', '/home/reservations');

    cy.request('POST', 'http://localhost:3000/api/route', route)
      .then((response) => {
        routeId = response.body.result._id;
        expect(response.status).to.eq(201);
      })
      .then(() => {
        cy.request('POST', 'http://localhost:3000/api/schedule', {
          dateStart: '2024-06-09T12:30',
          route: routeId
        }).then((response) => {
          expect(response.status).to.eq(201);
        });
      });
  });

  afterEach(() => {
    cy.request('DELETE', `http://localhost:3000/api/route/${routeId}`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('Should be possible to do reservation', () => {
    const reservation = {
      routeName: route.name,
      term: '09/06/2024',
      guide: 'user-guide2@gmail.com',
      tourist: 'user-tourist@gmail.com'
    };

    searchBar.useDropdownMenu('Wyloguj');
    base.assertPage('Zaloguj się do Twojego konta', '/login');

    login.login('user-tourist@gmail.com', 'tese#@E@#edD3');
    searchBar.assertLoggedUser('user-tourist@gmail.com');
    base.assertPage('Rezerwacje', '/home/reservations');

    navBar.useSearch(route.name);
    base.clickButton('Zarezerwuj trasę');
    reservations.selectTerm('09/06/2024');

    base.assertPage('Rezerwacje', '/home/reservations');
    reservations.assertReservation(reservation.term, reservation, 'tourist');

    searchBar.useDropdownMenu('Wyloguj');
    base.assertPage('Zaloguj się do Twojego konta', '/login');

    login.login('user-guide2@gmail.com', 'tese#@E@#edD3');
    searchBar.assertLoggedUser('user-guide2@gmail.com');
    base.assertPage('Rezerwacje', '/home/reservations');
    reservations.assertReservation(reservation.term, reservation, 'guide');
  });
});
