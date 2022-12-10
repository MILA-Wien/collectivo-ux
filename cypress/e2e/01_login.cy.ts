// https://docs.cypress.io/api/introduction/api.html

describe("Show the Login mask", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Bei Ihrem Konto anmelden");
  });
});
