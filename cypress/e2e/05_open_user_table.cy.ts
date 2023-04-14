// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.login("test_superuser@example.com");
    cy.get('button[id="toggle-sidebar-button"]').click();
    // TODO: This finds Users in the CI E2E because the menu is in english
    cy.get("#admin_menu > div > div > div > a > div > span")
      .contains("Benutzer*innen")
      .click();
    cy.get("#collectivo-backdrop").click();
    cy.get("#core-users").should("exist");
  });
});
