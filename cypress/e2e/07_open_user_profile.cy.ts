// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.login("test_superuser@example.com");
    cy.get('button[id="toggle-sidebar-button"]').click();
    cy.get("#main_menu > div > div > div > a > div > span")
      .contains("Mitgliedschaft")
      .click();
    cy.get("#collectivo-backdrop").click();
    cy.get("#memberships-profile").should("exist");
  });
});
