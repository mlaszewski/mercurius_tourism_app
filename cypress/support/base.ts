const assertPage = (title: string, url: string) => {
  cy.get('h1').should('have.text', title);

  cy.url().should('include', url);
};

const clickButton = (text: string) => {
  cy.get('button').contains(text).scrollIntoView();
  cy.get('button').contains(text).click();
};

const assertButtonDisabled = (isDisabled: boolean, text: string) => {
  if (isDisabled) {
    cy.get('button').contains(text).should('be.disabled');
  } else {
    cy.get('button').contains(text).should('not.be.disabled');
  }
};

const assertValidationError = (isVisible: boolean, text?: string) => {
  if (isVisible) {
    cy.get('[data-cy="error"]').should('be.visible');
    if (text) {
      cy.get('[data-cy="error"]').should('have.text', text);
    }
  } else {
    cy.get('[data-cy="error"]').should('not.exist');
  }
};

const assertErrorPopup = (text: string) => {
  cy.get('[data-cy="errorPopup"]').should('be.visible').and('contain.text', text);
};

const tomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString().split('T')[0];
};

const dayAfterTomorrow = () => {
  const today = new Date();
  const dayAfterTomorrow = new Date(today);

  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  return dayAfterTomorrow.toISOString().split('T')[0];
};

const useConfirmationPopup = (text: string, option: string) => {
  cy.get('[data-cy="confirmationPopup"]')
    .should('be.visible')
    .within(() => {
      cy.contains(text).should('be.visible');
      cy.get('button').contains(option).click();
    });
};

export default {
  assertPage,
  clickButton,
  assertButtonDisabled,
  assertValidationError,
  tomorrowDate,
  dayAfterTomorrow,
  assertErrorPopup,
  useConfirmationPopup
};
