/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login into collectivo via UI
     * @example cy.login('test_member_01@example.com', 'iAmNotSafe')
     */
    login(email: string, password?: string): Chainable<void>;
  }
}
