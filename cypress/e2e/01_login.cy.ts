// https://docs.cypress.io/api/introduction/api.html
import "cypress-keycloak";

describe("Show the Login mask", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Sign in to your account");
  });
});
