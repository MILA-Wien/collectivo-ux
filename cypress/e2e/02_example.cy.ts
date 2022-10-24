// https://docs.cypress.io/api/introduction/api.html

Cypress.Cookies.debug(true);
describe("Login Succesfull", () => {
  it("visits the app root url", () => {
    cy.session("test", () => {
      cy.visit("/");
      cy.contains("h1", "Sign in to your account");
      cy.get("input[name=username]").type("test");
      cy.get("input[name=password]").type("test").type("{enter}"); // '{enter}' submits the form
      cy.contains("h1", "Mach Mit!");
      cy.get("a").contains("Logout").click();
    })

  });
});
