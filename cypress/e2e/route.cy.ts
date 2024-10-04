/// <reference types="cypress" />

import { generatedRouteDataApi } from 'cypress/fixtures/generateRouteApi';
import { generatedRouteData } from 'cypress/fixtures/generateRouteData';
import base from 'cypress/support/base';
import login from 'cypress/support/login';
import navBar from 'cypress/support/navBar';
import routes from 'cypress/support/routes';
import searchBar from 'cypress/support/searchBar';

let routeId: string;

describe('Add new route', () => {
  beforeEach(() => {
    login.login('user-guide2@gmail.com', 'tese#@E@#edD3');
    searchBar.assertLoggedUser('user-guide2@gmail.com');
    base.assertPage('Rezerwacje', '/home/reservations');
  });

  it('Should add new route and remove route', () => {
    const route = generatedRouteData();

    navBar.clickNavbarOption('routes', 'Twoje Trasy', '/routes');
    base.clickButton('Dodaj trasę');
    routes.fillForm(route);
    base.clickButton('Dodaj nową trasę');

    routes.assertRouteCard(true, route);
    routes.clickRouteCard(route.name);
    routes.assertModalDetails(route);

    routes.cancelModal();
    routes.removeRoute(route.name);
    base.useConfirmationPopup('Czy na pewno chcesz usunąć trasę?', 'Tak');
    routes.assertRouteCard(false, route);
  });

  it('Should not add new route without required fields', () => {
    let route = generatedRouteData();

    route = {
      ...route,
      difficulty: 'Średni'
    };

    navBar.clickNavbarOption('routes', 'Twoje Trasy', '/routes');
    base.clickButton('Dodaj trasę');

    routes.assertRequiredField('Dodaj nazwę trasy*');
    base.assertValidationError(true, 'Pole wymagane');
    routes.fillInput('Dodaj nazwę trasy*', route.name);
    base.assertValidationError(false);

    routes.assertRequiredField('Podaj cenę*');
    base.assertValidationError(true, 'Pole wymagane');
    routes.fillInput('Podaj cenę*', route.price);
    base.assertValidationError(false);

    routes.fillInput('Podaj czas trwania trasy*', route.time);
    base.assertValidationError(false);
    base.assertButtonDisabled(true, 'Dodaj nową trasę');

    routes.assertRequiredField('Opis*');
    base.assertValidationError(true, 'Pole wymagane');
    routes.fillInput('Opis*', route.description);

    base.assertButtonDisabled(false, 'Dodaj nową trasę');
  });

  it('Should edit route', () => {
    const route = generatedRouteDataApi();
    const newRoute = generatedRouteData();

    cy.request('POST', 'http://localhost:3000/api/route', route).then((response) => {
      expect(response.status).to.eq(201);
      routeId = response.body.result._id;
    });

    navBar.clickNavbarOption('routes', 'Twoje Trasy', '/routes');
    routes.clickRouteCard(route.name);
    base.clickButton('Edytuj trasę');
    routes.assertForm(route);
    routes.editRoute(newRoute);

    base.clickButton('Zapisz');
    routes.assertRouteCard(true, newRoute);
    routes.clickRouteCard(newRoute.name);
    routes.assertModalDetails(newRoute);
  });

  after(() => {
    cy.request('DELETE', `http://localhost:3000/api/route/${routeId}`).then((response) => {
      expect(response.status).to.eq(200 || 404);
    });
  });
});
