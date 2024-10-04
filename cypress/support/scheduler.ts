import base from './base';

const addSchedule = ({ date, time, routeName }: { date: string; time: string; routeName: string }) => {
  cy.get(`[data-date="${date}"]`).click();

  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.contains('Nowy termin').should('be.visible');

      cy.get('[name="startTime"]').type(time);
      cy.get('[aria-hidden="true"]').last().click({ force: true });

      cy.get('[role="option"]').contains(routeName).click();
      base.clickButton('Zatwierdź termin');
    });
};

const assertDay = ({ date, routeName, time }: { date: string; routeName: string; time: string }) => {
  cy.get(`[data-date="${date}"]`).within(() => {
    cy.contains(time).should('be.visible');
    cy.contains(routeName).should('be.visible');
  });
};

const assertScheduleCreated = ({
  scheduleExist,
  date,
  time,
  routeName
}: {
  date: string;
  time: string;
  routeName: string;
  scheduleExist?: boolean;
}) => {
  cy.get(`[data-date="${date}"]`).within(() => {
    cy.contains(time).should('be.visible');
    cy.contains(routeName).should('be.visible');
  });

  cy.get(`[data-date="${date}"]`).click();
  scheduleExist && base.clickButton('Dodaj nowy termin');

  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.contains(`Termin ${date}`).should('be.visible');
    });

  cy.get('[data-cy="check"]').last().should('contain', time).and('contain', routeName);
};

const editSchedule = ({ date, newDate, time, routeName }: { date: string; newDate: string; time: string; routeName: string }) => {
  cy.get(`[data-date="${date}"]`).click();

  cy.get('[data-cy="modal"]')
    .should('be.visible')
    .within(() => {
      cy.wait(1000);
      cy.get('[data-cy="check"] button').first().click();
    });

  cy.get('[name="chosenDate"]').type(newDate);
  cy.get('[type="time"]').type(time);
  cy.contains('Zatwierdź termin').click();
};

export default {
  addSchedule,
  assertScheduleCreated,
  editSchedule,
  assertDay
};
