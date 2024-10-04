const clickRegisterButton = () => {
  cy.get('button').contains('Czas na przygodę! Wejdź aby utworzyć konto').click();
};

const selectRole = (option: 'tourist' | 'guide') => {
  if (option === 'guide') {
    cy.get(`label[for="${option}"]`).click();
  } else {
  }
};

const fillEmailInput = (email: string) => {
  cy.get('#email')
    .invoke('val')
    .then((value) => {
      if (value) {
        cy.get('#email').clear();
      }
      cy.get('#email').type(email);
      cy.get('#email').clickOutside();
    });
};

const fillPasswordInput = (password: string) => {
  cy.get('#password')
    .invoke('val')
    .then((value) => {
      if (value) {
        cy.get('#password').clear();
      }
      cy.get('#password').type(password);
      cy.get('#password').clickOutside();
    });
};

const fillPasswordConfirmationInput = (password: string) => {
  cy.get('#passwordConfirmation')
    .invoke('val')
    .then((value) => {
      if (value) {
        cy.get('#passwordConfirmation').clear();
      }
      cy.get('#passwordConfirmation').type(password);
      cy.get('#passwordConfirmation').clickOutside();
    });
};

const assertEmailValidationError = (errorMessage: string) => {
  cy.get('.RegisterForm_validationError__ZctFL').should('have.text', errorMessage);
};

const fillEmailAndAssertError = (email: string, errorMessage: string) => {
  fillEmailInput(email);
  assertEmailValidationError(errorMessage);
};

const fillPasswordAndAssertError = (password: string, errorMessage: string) => {
  fillPasswordInput(password);
  assertEmailValidationError(errorMessage);
};

const fillPasswordConfirmationAndAssertError = (password: string, errorMessage: string) => {
  fillPasswordConfirmationInput(password);
  assertEmailValidationError(errorMessage);
};

export default {
  clickRegisterButton,
  selectRole,
  fillEmailInput,
  assertEmailValidationError,
  fillPasswordInput,
  fillPasswordConfirmationInput,
  fillEmailAndAssertError,
  fillPasswordAndAssertError,
  fillPasswordConfirmationAndAssertError
};
