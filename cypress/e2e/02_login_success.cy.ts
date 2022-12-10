// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Bei Ihrem Konto anmelden");
      cy.get("input[name=username]").type("test_member_01@example.com");
      cy.get("input[name=password]").type("test").type("{enter}"); // '{enter}' submits the form
      // cy.get("#kc-accept").click();
      cy.get('button[id="toggle-sidebar-button"]').click();
      cy.get('#main_menu_0_0 > .p-menuitem-content > .p-menuitem-link > .p-menuitem-text').contains("Dashboard");
      cy.get("a").contains("Abmelden").click();
    });
  });
});
