// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.login("test_superuser@example.com");
    cy.get('button[id="toggle-sidebar-button"]').click();
    cy.get(
      "#main_menu_0_0 > .p-menuitem-content > .p-menuitem-link > .p-menuitem-text"
    ).contains("Startseite");
    cy.get(".p-menuitem-content > .p-menuitem-link > .p-menuitem-text")
      .contains("Mitglieder")
      .click();
    cy.get('div[id="collectivo-backdrop"]').click();
    cy.get('div[class="members-table"]').should("exist");
  });
});
