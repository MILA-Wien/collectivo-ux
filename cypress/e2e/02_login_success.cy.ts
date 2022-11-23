// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Bei Ihrem Konto anmelden");
      cy.get("input[name=username]").type("test_member_1@example.com");
      cy.get("input[name=password]").type("test").type("{enter}"); // '{enter}' submits the form
      cy.contains("h1", "Dashboard");
      cy.get("a").contains("Logout").click();
    });
  });
});
