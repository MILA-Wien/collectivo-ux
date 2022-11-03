// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Bei Ihrem Konto anmelden");
      cy.get("input[name=username]").type("test_member_2@example.com");
      cy.get("input[name=password]").type("test").type("{enter}"); // '{enter}' submits the form
      cy.contains(
        ".pf-c-alert__title",
        "Sie müssen Ihre E-Mail-Adresse verifizieren, um das Benutzerkonto zu aktivieren."
      );
    });
  });
});
