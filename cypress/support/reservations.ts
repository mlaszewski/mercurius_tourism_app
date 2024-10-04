const selectTerm = (term: string) => {
  cy.get('[id="terms"]').click();
  cy.get('[role="option"]').contains(term).click();

  cy.get('[data-cy="modal"]')
    .last()
    .within(() => {
      cy.get('[data-cy="submit"]').click();
    });
};

const assertReservation = (term: string, reservation: any, user: 'tourist' | 'guide') => {
  cy.get('[data-cy="reservation"]').should('be.visible');

  cy.get('[data-cy="reservation"]').within(() => {
    cy.contains(reservation.routeName).should('be.visible');
    cy.contains(term).should('be.visible');
    user === 'tourist' ? cy.contains(reservation.guide).should('be.visible') : cy.contains(reservation.tourist).should('be.visible');
  });
};

export default {
  selectTerm,
  assertReservation
};
