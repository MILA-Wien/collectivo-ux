// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Bei Ihrem Konto anmelden");
      cy.get("input[name=username]").type("test_member_01@example.com");
      cy.get("input[name=password]").type("Test123!").type("{enter}"); // '{enter}' submits the form
      cy.get('button[id="toggle-sidebar-button"]').click();
      // TODO: Disabled until we figure out the translation issue
      // cy.get("#main_menu > div > div > div > a > div > span").contains(
      //   "Startseite"
      // );
      // cy.get("#main_menu > div > div > div > a > div > span").contains(
      //   "Abmelden"
      // );
    });
  });
});
