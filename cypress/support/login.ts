const login = (email: string, password: string) => {
  cy.intercept('GET', 'http://localhost:3000/api/reservation/*').as('login');

  cy.visit('/login');
  cy.url().should('include', '/login');

  cy.get('[id="email"]').type(email);
  cy.get('[id="password"]').type(password);

  cy.get('[data-cy="login"]').click();

  cy.wait('@login');
  cy.wait('@login');
};

const assertLoginError = (errorMessage: string) => {
  cy.get('[data-cy="text-error"]').should('have.text', errorMessage);
};

export default {
  login,
  assertLoginError
};
