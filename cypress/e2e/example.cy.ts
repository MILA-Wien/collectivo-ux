// https://docs.cypress.io/api/introduction/api.html

describe("learning cypress", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Mach Mit!");
  });
});
