import base from './base';

const clickNavbarOption = (option: string, title: string, url: string) => {
  cy.intercept('GET', `http://localhost:3000/home/${option}*`).as('waitForPage');

  if (option === 'scheduler') {
    cy.get(`[data-cy="${option}"]`).click({ force: true });
    cy.contains('Kalendarz').should('be.visible');
  } else {
    cy.get(`[data-cy="${option}"]`).click({ force: true });
    base.assertPage(title, url);
  }

  cy.wait('@waitForPage');
};

const useSearch = (searchedValue: string) => {
  cy.get('[placeholder="Szukaj..."]').type(searchedValue);

  cy.get('[data-cy="routeInfo"]').should('be.visible');
  cy.get('[data-cy="routeInfo"]').should('contain', searchedValue);
  cy.get('[data-cy="routeInfo"]').contains(searchedValue).click();
};

export default {
  clickNavbarOption,
  useSearch
};
