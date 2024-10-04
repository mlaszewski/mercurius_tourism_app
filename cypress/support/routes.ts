import base from './base';

const useSelect = (inputName: string, value: string) => {
  cy.contains(inputName).click({ force: true });
  cy.get('[role="option"]').contains(value).click();
};

const usePointSelect = (index: number, value: string) => {
  cy.get("[data-cy='points']").within(() => {
    cy.get('input').eq(index).type(value);
    cy.get('[role="option"]').contains(value).click();
  });
};

const fillForm = (route: any) => {
  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.contains('Tworzenie nowej trasy').should('be.visible');
      cy.get('[placeholder="Dodaj nazwę trasy*"]').type(route.name);
      cy.get('[placeholder="Podaj cenę*"]').type(route.price);

      useSelect('Województwo', route.province);
      useSelect('Powiat', route.district);
      useSelect('Miasto', route.city);

      usePointSelect(0, route.startingPoint);
      base.clickButton('Dodaj punkt');

      usePointSelect(1, route.middlePoint);
      usePointSelect(2, route.endingPoint);

      cy.contains(route.difficulty).click();
      cy.get('input[type="time"]').type(route.time);
      cy.get('[placeholder="Opis*"]').type(route.description);
    });
};

const removeRoute = (name: string) => {
  cy.contains(name)
    .should('be.visible')
    .parents('[data-cy="card"]')
    .within(() => {
      cy.get('[data-cy="menu"]').click();
    });

  cy.contains('Usuń trasę').click();
};

const cancelModal = () => {
  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.contains('Close').click();
    });
};

const assertRouteCard = (isVisible: boolean, route: any) => {
  if (!isVisible) {
    cy.contains(route.name).should('not.exist');
    return;
  }

  cy.contains(route.name)
    .should('be.visible')
    .parents('[data-cy="card"]')
    .within(() => {
      cy.contains(route.city).should('be.visible');
      cy.contains(route.difficulty).should('be.visible');
      cy.contains(route.time).should('be.visible');
    });
};

const clickRouteCard = (name: string) => {
  cy.contains(name).should('be.visible').parents('[data-cy="card"]').click();
};

const assertModalDetails = (route: any) => {
  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="routeName"]').should('have.text', route.name);
      cy.contains(route.city).should('be.visible');
      cy.contains(route.description).should('be.visible');
      cy.contains(route.difficulty).should('be.visible');
      cy.contains(route.time).should('be.visible');
      cy.contains(route.price).should('be.visible');
    });
};

const assertRequiredField = (inputName: string) => {
  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.get(`[placeholder="${inputName}"]`).focus();
      cy.get(`[placeholder="${inputName}"]`).blur();
    });
};

const fillInput = (inputName: string, value: string) => {
  if (inputName === 'Podaj czas trwania trasy*') {
    cy.get('input[type="time"]').type(value);
    return;
  }

  cy.get(`[placeholder="${inputName}"]`).type(value);
};

const assertSelect = (value: string) => {
  cy.contains(value).should('be.visible');
};

const assertPointSelect = (index: number, value: string) => {
  cy.get("[data-cy='points']").within(() => {
    cy.get('input').eq(index).should('have.value', value);
  });
};

const assertForm = (route: any) => {
  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      console.log('this', route);

      cy.get('[placeholder="Dodaj nazwę trasy*"]').should('have.value', route.name);
      cy.get('[placeholder="Podaj cenę*"]').should('have.value', `PLN ${route.price}`);

      cy.get('#voivodeship').should('have.text', route.selectedVoivodeship.name);
      cy.get('#country').should('have.text', route.selectedCountry.name);
      cy.get('#city').should('have.text', route.selectedCity.name);

      cy.get('#point').eq(0).should('have.text', route.points[0].name);
      cy.get('#point').last().should('have.text', route.points[1].name);

      cy.get('input[type="time"]').should('have.value', route.duration);
      cy.get('[placeholder="Opis*"]').should('have.value', route.description);
    });
};

const editRoute = (route: any) => {
  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder="Dodaj nazwę trasy*"]').clear();
      cy.get('[placeholder="Dodaj nazwę trasy*"]').type(route.name);
      cy.get('[placeholder="Podaj cenę*"]').clear();
      cy.get('[placeholder="Podaj cenę*"]').type(route.price);

      cy.get('#voivodeship').click();
      cy.get('[role="option"]').contains(route.province).click();

      cy.get('#country').click();
      cy.get('[role="option"]').contains(route.district).click();

      cy.get('#city').click();
      cy.get('[role="option"]').contains(route.city).click();

      usePointSelect(0, route.startingPoint);
      usePointSelect(1, route.endingPoint);

      cy.contains(route.difficulty).click();
      cy.get('input[type="time"]').clear();
      cy.get('input[type="time"]').type(route.time);
      cy.get('[placeholder="Opis*"]').clear();
      cy.get('[placeholder="Opis*"]').type(route.description);
    });
};

export default {
  fillForm,
  assertRouteCard,
  clickRouteCard,
  assertModalDetails,
  assertRequiredField,
  fillInput,
  cancelModal,
  removeRoute,
  assertForm,
  editRoute
};
