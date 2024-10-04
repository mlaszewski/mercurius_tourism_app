import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    pageLoadTimeout: 20000,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    execTimeout: 20000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      overwrite: false,
      video: true,
      saveAllAttempts: false
    },
    baseUrl: 'http://localhost:3000',
    video: true,
    setupNodeEvents(on) {
      // eslint-disable-next-line global-require
      require('cypress-mochawesome-reporter/plugin')(on);
    }
  }
});
