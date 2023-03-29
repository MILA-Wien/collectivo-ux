// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the members table", () => {
    cy.login("test_superuser@example.com");
    cy.get('button[id="toggle-sidebar-button"]').click();
    cy.get("#admin_menu > div > div > div > a > div > span")
      .contains("Tags")
      .click();
    cy.get("#collectivo-backdrop").click();
    cy.get("#tags-admin").should("exist");
    // TODO: Needs to be fixed
    // cy.get(
    //   "#tags-admin > div > div.p-tabview-panels > div > div > div > div.grow.overflow-auto > div > div > div.p-datatable-wrapper > table > thead > tr > th.p-sortable-column.p-resizable-column.p-highlight"
    // ).click();
    // cy.get(
    //   "div > div > .p-datatable-tbody > :nth-child(1) > :nth-child(4)"
    // ).contains("Test tag 0");

    // cy.get(
    //   ".p-highlight > .p-column-header-content > .p-column-filter > .p-column-filter-menu-button > .pi"
    // ).click();
    // cy.get(
    //   ".p-highlight > .p-column-header-content > .p-column-filter > .p-column-filter-menu-button"
    // ).click();
    cy.get(".p-paginator-next").click();
  });
});
