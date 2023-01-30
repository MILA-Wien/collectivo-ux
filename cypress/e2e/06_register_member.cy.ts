/* 
README && TODOs:
1. BUG(?): whenever a new user_not_member registers as member, AND after successfully deleting member id from db (see beforeEach() hook), on new login the UI will display user_as_member StartPage:
  - StartPage EXPECTED: user_not_member
  - StartPage ACTUAL: user_as_member
  Workaround: docker compose restart backend services (@Joel, Keycloak matter)

2. JSON response validation on submit formular, 2 possible approaches:
  2a: deep.equal comparison between actualResponse and expectedResponse 
      Manipulation of expectedResponse properties necessary, i.e. they need to be made dynamic: "id" (i), "membership_start" (ii) etc.
  2b: validation of specific actualResponse properties only. Which ones?

3. it("register as legal person", () => {...}
4. Use cy.fixture() to load test data -> https://docs.cypress.io/api/commands/fixture
*/

Cypress.Cookies.debug(true);
describe("register user_not_member, compulsory fields only (except checkboxes on page 4/5)", () => {
  /*
  beforeEach(): better practice than afterEach(). 
  WHY: https://docs.cypress.io/guides/references/best-practices#Using-after-or-afterEach-hooks 
  */
  beforeEach(() => {
    // authenticate as superuser
    cy.request("POST", "http://collectivo.local:8000/api/dev/token/", {
      username: "test_superuser@example.com",
      password: "Test123!",
    }).then((response) => {
      const token = response.body.access_token;
      const retrieveMembersParams = {
        method: "GET",
        url: `http://localhost:8000/api/members/members/?first_name__contains=%C3%96tz1&last_name__contains=CABBAG3&person_type=natural`,
        headers: {
          authorization: token,
        },
      };
      // retrieve member(s) matching test_user_not_member sent registration from previous test execution
      cy.request(retrieveMembersParams).then((response) => {
        if (response.status === 200 && response.body.length > 0) {
          for (let i = 0; i < response.body.length; i++) {
            const member = response.body[i];
            console.log("Deleting member with id: ", member.id);
            const deleteMembersParameters = {
              method: "DELETE",
              url: `http://localhost:8000/api/members/members/${member.id}/`,
              headers: {
                authorization: token,
              },
            };
            // delete member(s)
            cy.request(deleteMembersParameters).then((response) =>
              expect(response.status).to.eq(204)
            );
          }
        } else {
          console.log("No members found, continuing testCase...");
        }
      });
    });
  });
  it("register as natural person", () => {
    cy.login("test_user_not_member@example.com");
    cy.get("div[id='members-registration-tile']").should("exist");
    cy.get("button[id='members-registration-tile-continue']").click();
    /* Page 1/5 */
    cy.get("div[id='welcome-paragraph']").should("exist");
    cy.get('[type="radio"]').check("natural");
    cy.get("#next-page-button > .button button").click();
    /* Page 2/5 */
    cy.get("#first-name-input > .textfield input").clear().type("Ötz1");
    cy.get("#last-name-input > .textfield input").clear().type("CABBAG3");
    cy.get('[type="radio"]').check("male");
    cy.get("#birthdate-input > .date input").clear().type("01.01.1990");
    cy.get("#occupation-input > .textfield input").clear().type("lazy cat");
    cy.get("#address-street-input > .textfield input")
      .clear()
      .type("ÄltGasseMitNötFünnyChars");
    cy.get("#address-street-number-input > .number input")
      .clear()
      .type("28392");
    cy.get("#address-postcode-input > .number input").clear().type("1111");
    cy.get("#address-city-input > .textfield input").clear().type("Weän");
    cy.get("#address-country-input > .textfield input")
      .clear()
      .type("Österland");
    cy.get("#next-page-button > .button button").click();
    /* Page 3/5 */
    cy.get('[type="radio"]').check("active");
    cy.get('[type="radio"]').check("normal");
    cy.get('[type="radio"]').check("sepa");
    cy.get("#bank-account-input > .textfield input")
      .clear()
      .type("AT592250039687965121");
    cy.get("#bank-account-owner-input > .textfield input")
      .clear()
      .type("Ötz1 CABBAG3");
    cy.get("#next-page-button > .button button").click();
    /* Page 4/5 */
    cy.get("#groups-interested-input > .multipleChoice input").check("1");
    cy.get("#groups-interested-input > .multipleChoice input").check("9");
    cy.get("#skills-input > .multipleChoice input").check("1");
    cy.get("#skills-input > .multipleChoice input").check("7");
    cy.get("#next-page-button > .button button").click();
    /* Page 5/5 */
    /* 
    Checkbox cannot be selected because of: https://stackoverflow.com/questions/47551639/access-element-whose-parent-is-hidden-cypress-io, workaround possible 
    */
    // cy.get('#public-use-approved-checkbox > .boolean input').check() // DEPRECATED;
    // cy.get('#founding-event-checkbox > .boolean input').check();

    cy.intercept({ method: "POST", url: "**/register" }).as("new-member");
    cy.get("#submit-button > .button button").click();
    cy.wait("@new-member").then(({ request, response }) => {
      console.log("Request sent to server: ", request.body);
      console.log("Response sent back to client: ", response?.body);
      expect(response?.statusCode).to.eq(201);
      /* Here response.body validation */
    });
    cy.get("#welcome-member-span").should(
      "contain.text",
      "Willkommen auf der MILA Mitgliederplattform!"
    );
  });
});
