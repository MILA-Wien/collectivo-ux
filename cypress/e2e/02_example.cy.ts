// https://docs.cypress.io/api/introduction/api.html
import "cypress-keycloak";

describe("My First Test", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Sign in to your account");
    cy.get("input[name=username]").type("test");
    cy.get("input[name=password]").type("test").type("{enter}"); // '{enter}' submits the form
    cy.contains("h1", "Mach mit!");
    cy.get("a").contains("Logout").click();
  });
});
