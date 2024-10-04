/// <reference types="cypress" />

import login from '../support/login';
import navBar from '../support/navBar';
import scheduler from '../support/scheduler';
import searchBar from '../support/searchBar';
import base from '../support/base';
import { generatedRouteDataApi } from '../fixtures/generateRouteApi';

const generateRoute = generatedRouteDataApi();
const route = { ...generateRoute, startTime: '06:00' };
let routeId: string;
let scheduleId;

describe('Add new schedule', () => {
  beforeEach(() => {
    login.login('user-guide5@gmail.com', 'tese#@E@#edD3');
    searchBar.assertLoggedUser('user-guide5@gmail.com');
    base.assertPage('Rezerwacje', '/home/reservations');
    cy.request('POST', 'http://localhost:3000/api/route', route).then((response) => {
      routeId = response.body.result._id;
      expect(response.status).to.eq(201);
    });

    cy.intercept('POST', 'http://localhost:3000/api/schedule').as('schedule');
    navBar.clickNavbarOption('scheduler', 'Kalendarz', '/calendar');
  });

  afterEach(() => {
    cy.request('DELETE', `http://localhost:3000/api/route/${routeId}`).then((response) => {
      expect(response.status).to.eq(200 || 404);
    });
  });

  it('Should be possible to add and remove new schedule', () => {
    const tommorow = base.tomorrowDate();

    const schedule = {
      date: tommorow,
      time: route.startTime,
      routeName: route.name,
      scheduleExist: false
    };

    scheduler.addSchedule(schedule);
    scheduler.assertScheduleCreated(schedule);

    cy.wait('@schedule').then(({ response }) => {
      scheduleId = (response as any)?.body?.result?._id;

      cy.request('DELETE', `http://localhost:3000/api/schedule/${scheduleId}`).then((response) => {
        expect(response.status).to.eq(200 || 404);
      });
    });
  });

  it('Should be possible to add schedule at existing event', () => {
    const tommorow = base.tomorrowDate();

    const schedule1 = {
      date: tommorow,
      time: route.startTime,
      routeName: route.name,
      scheduleExist: false
    };

    const schedule2 = {
      date: tommorow,
      time: route.startTime,
      routeName: route.name,
      scheduleExist: true
    };

    scheduler.addSchedule(schedule1);
    scheduler.addSchedule(schedule2);

    base.assertErrorPopup('Termin jest zajęty');

    cy.wait('@schedule').then(({ response }) => {
      scheduleId = (response as any)?.body?.result?._id;

      cy.request('DELETE', `http://localhost:3000/api/schedule/${scheduleId}`).then((response) => {
        expect(response.status).to.eq(200 || 404);
      });
    });
  });

  it('Should be possible to edit schedule at existing event', () => {
    const tommorow = base.tomorrowDate();
    const today = base.dayAfterTomorrow();
    route.startTime = '15:30';

    const schedule = {
      date: tommorow,
      time: route.startTime as string,
      routeName: route.name,
      scheduleExist: false
    };

    const editedSchedule = {
      date: schedule.date,
      newDate: today,
      time: '19:00',
      routeName: route.name,
      scheduleExist: true
    };

    scheduler.addSchedule(schedule);
    scheduler.assertDay(schedule);
    scheduler.editSchedule(editedSchedule);
    scheduler.assertDay({ date: editedSchedule.newDate, time: editedSchedule.time, routeName: route.name });

    cy.wait('@schedule').then(({ response }) => {
      scheduleId = (response as any)?.body?.result?._id;

      cy.request('DELETE', `http://localhost:3000/api/schedule/${scheduleId}`).then((response) => {
        expect(response.status).to.eq(200 || 404);
      });
    });
  });
});
