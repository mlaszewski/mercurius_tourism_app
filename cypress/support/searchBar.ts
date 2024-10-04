const assertLoggedUser = (username: string) => {
  cy.get('[data-cy="user-menu"]').should('have.text', username);
};

const useDropdownMenu = (option: string) => {
  cy.get('[data-cy="user-menu"]').click();

  cy.get('[data-cy="userMenu"]')
    .should('be.visible')
    .then(() => {
      cy.contains(option).click();
    });
};

export default {
  assertLoggedUser,
  useDropdownMenu
};
