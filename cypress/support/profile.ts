interface User {
  bio: string;
  name: string;
  language: string;
  email: string;
  contactPhone: string;
  birthDate: string;
}

const fillProfile = (user: User) => {
  cy.get('h2').should('be.visible');
  cy.get('[name="bio"]').clear();
  cy.get('[name="bio"]').type(user.bio, { delay: 0 });
  cy.get('[name="name"]').clear();
  cy.get('[name="name"]').type(user.name);
  cy.get('[name="languages"]').clear();
  cy.get('[name="languages"]').type(user.language);
  cy.get('[type="email"]').clear();
  cy.get('[type="email"]').type(user.email);
  cy.get('[name="contactPhone"]').clear();
  cy.get('[name="contactPhone"]').type(user.contactPhone);
  cy.get('[name="birthDate"]').clear();
  cy.get('[name="birthDate"]').type(user.birthDate);
};

const assertProfile = (user: User) => {
  cy.get('[name="name"]').should('have.value', user.name);
  cy.get('[name="languages"]').should('have.value', user.language);
  cy.get('[type="email"]').should('have.value', user.email);
  cy.get('[name="contactPhone"]').should('have.value', user.contactPhone);
  cy.get('[name="birthDate"]').should('have.value', user.birthDate);
};

export default {
  fillProfile,
  assertProfile
};
