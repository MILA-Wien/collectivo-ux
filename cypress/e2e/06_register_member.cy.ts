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

3. it("register as legal person", () => {...} //DONE
4. Use cy.fixture() to load test data -> https://docs.cypress.io/api/commands/fixture
5. Use generic button validation
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
        url: `http://localhost:8000/api/members/members/?first_name__contains=%C3%96tz1&last_name__contains=CABBAG3`,
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
  it.skip("register as natural person", () => {
    cy.login("test_user_not_member@example.com");
    cy.get("span[id='welcome-member-span']").should(
      "contain.text",
      "Willkommen auf der MILA Mitgliederplattform!"
    );
    cy.get('.p-card-body button').then(($btn) => {
      const txt = $btn.text()
      expect(txt).to.eq("Weiter");
    }).click();
    /* Page 1/5 */
    cy.get("div[id='welcome-paragraph']").should("exist");
    cy.get('[type="radio"]').check("natural");
    cy.get("#next-page1-button > .button button").click();
    /* Page 2/5 */
    cy.get("#first-name-input > .textfield input").clear().type("Ötz1");
    cy.get("#last-name-input > .textfield input").clear().type("CABBAG3");
    cy.get('[type="radio"]').check("male");
    cy.get("#birthdate-input > .date input").clear().type("01.01.1990").blur();
    cy.get("#occupation-input > .textfield input").click({force: true}).type("lazy cat");
    cy.get("#address-street-input > .textfield input").click({force: true}).type(
      "ÄltGasseMitNötFünnyChars"
    );
    cy.get("#address-street-number-input > .number input").click({force:true}).type("28392");
    cy.get("#address-postcode-input > .number input").click({force:true}).type("1111");
    cy.get("#address-city-input > .textfield input").click({force:true}).type("Weän");
    cy.get("#address-country-input > .textfield input").click({force:true}).type("Österland");
    cy.get("#next-page2-button > .button button").click();
    /* Page 3/5 */
    cy.get('[type="radio"]').check("active");
    cy.get('[type="radio"]').check("normal");
    cy.get('[type="radio"]').check("sepa");
    cy.get("#bank-account-input > .textfield input").type(
      "AT592250039687965121"
    );
    cy.get("#bank-account-owner-input > .textfield input").type("Ötz1 CABBAG3");
    cy.get("#next-page3-button > .button button").click();
    /* Page 4/5 */
    cy.get("#groups-interested-input > .multipleChoice input").check("1");
    cy.get("#groups-interested-input > .multipleChoice input").check("9");
    cy.get("#skills-input > .multipleChoice input").check("1");
    cy.get("#skills-input > .multipleChoice input").check("7");
    cy.get("#next-page4-button > .button button").click();
    /* Page 5/5 */
    cy.get('#checkbox_statutes_approved > .boolean input').check({force: true});
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
      "CABBAG3"
    );
  });

  it("register as legal person", () => {
    cy.login("test_user_not_member@example.com");
    cy.get("span[id ='welcome-member-span']").should(
      "contain.text",
      "Willkommen auf der MILA Mitgliederplattform!"
    );
    cy.get('.p-card-body button').then(($btn) => {
      const txt = $btn.text()
      expect(txt).to.eq("Weiter");
    }).click();
    /* Page 1/5 */
    cy.get("div[id='welcome-paragraph']").should("exist");
    cy.get('[type="radio"]').check("legal");
    cy.get("#next-page1-button > .button button").click();
    /* Page 2/5 */

    cy.get("#lp-name-input input").type("Ötzi CABBAG3");
    cy.get("#lp-legal-type-input input").type("GG");
    cy.get("#lp-identification-number-input input").type("000000x");
    
    cy.get("#lp-address-street-input input").click().type(
      "ÄltGasseMitNötFünnyChars"
    );
    cy.get("#lp-address-street-number-input input").click().type("28392");
    cy.get("#lp-address-postcode-input input").click().type("1111");
    cy.get("#lp-address-city-input input").click().type("Weän");
    cy.get("#lp-address-country-input input").click().type("Österland");
    
    cy.get("#lp-first-name-input input").clear().type("Ötz1");
    cy.get("#lp-last-name-input input").clear().type("CABBAG3");
    cy.get('[type="radio"]').check("male");
    
    cy.get("#next-page2-button > .button button").click();
    /* Page 3/5 */
    cy.get('[type="radio"]').check("normal");
    cy.get('[type="radio"]').check("sepa");
    cy.get("#bank-account-input input").type(
      "AT592250039687965121"
    );
    cy.get("#bank-account-owner-input input").type("Ötz1 CABBAG3");
    cy.get("#next-page3-button button").click();
    /* Page 4/5 */
    cy.get("#groups-interested-input input").check("1");
    cy.get("#groups-interested-input input").check("9");
    cy.get("#skills-input input").check("1");
    cy.get("#skills-input input").check("7");
    cy.get("#next-page4-button button").click();
    /* Page 5/5 */
    cy.get('#checkbox_statutes_approved input').check({force: true});
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
      "CABBAG3"
    );
  });
});
