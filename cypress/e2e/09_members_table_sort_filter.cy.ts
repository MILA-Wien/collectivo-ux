// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the members table", () => {
    cy.login("test_superuser@example.com");
    cy.get('button[id="toggle-sidebar-button"]').click();
    cy.get(
      "#main_menu_0_0 > .p-menuitem-content > .p-menuitem-link > .p-menuitem-text"
    ).contains("Startseite");
    cy.get(".p-menuitem-content > .p-menuitem-link > .p-menuitem-text")
      .contains("Mitglieder")
      .click();
    cy.get("#collectivo-backdrop").click();
    cy.get("#members-table").should("exist");
    cy.get(
      ":nth-child(4) > .p-column-header-content > .p-sortable-column-icon"
    ).click();
    cy.get(".p-datatable-tbody > :nth-child(1) > :nth-child(4)").contains(
      "Test Member 01"
    );

    cy.get(
      ":nth-child(4) > .p-column-header-content > .p-sortable-column-icon"
    ).click();
    cy.get(
      ".p-highlight > .p-column-header-content > .p-column-filter > .p-column-filter-menu-button"
    ).click();
    cy.get(".p-paginator-next").click();
  });
});
