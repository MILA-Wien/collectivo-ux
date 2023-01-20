// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Bei Ihrem Konto anmelden");
      cy.get("input[name=username]").type("test_superuser@example.com");
      cy.get("input[name=password]").type("Test123!").type("{enter}"); // '{enter}' submits the form
      cy.get('button[id="toggle-sidebar-button"]').click();
      cy.get(
        "#main_menu_0_0 > .p-menuitem-content > .p-menuitem-link > .p-menuitem-text"
      ).contains("Startseite");
      cy.get(".p-menuitem-content > .p-menuitem-link > .p-menuitem-text")
        .contains("Mitglieder")
        .click();
      cy.get('div[id="collectivo-backdrop"]').click();
      cy.get('div[class="members-table"').should("exist");
    });
  });
});
