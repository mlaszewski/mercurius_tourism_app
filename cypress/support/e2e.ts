/* eslint-disable no-unused-vars */

import 'cypress-mochawesome-reporter/register';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      clickOutside(options?: {}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add('clickOutside', { prevSubject: 'element' }, (subject, options = {}) => {
  cy.get('body').click(options);
});

Cypress.on('uncaught:exception', (err) => {
  return false;
});
