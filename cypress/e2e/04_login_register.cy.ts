// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Bei Ihrem Konto anmelden");
      cy.get("#kc-registration > span > a").click();
      cy.get("#firstName").type("test");
      cy.get("#lastName").type("test");
      cy.get("#email").type("test@test.com");
      cy.get("#password").type("test");
      cy.get("#password-confirm").type("test");
      cy.get(".pf-c-button").contains("Registrieren").click();
      cy.contains(
        ".pf-c-alert__title",
        "Sie müssen Ihre E-Mail-Adresse verifizieren, um das Benutzerkonto zu aktivieren."
      );
    });
  });
});
