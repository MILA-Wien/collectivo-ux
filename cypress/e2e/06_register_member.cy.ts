/*
README && TODOs:

2. JSON response validation on submit formular: @Joel, see below validated properties
4. Use cy.fixture() to load test data -> https://docs.cypress.io/api/commands/fixture //DONE for expectedResponse
5. Use generic button validation
6. Test for form checkout page has to be redone
7. Test for survey results has to be redone (now at api/mila/profiles/)
*/

Cypress.Cookies.debug(true);
describe("register user_not_member", () => {
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
        url: `http://localhost:8000/api/memberships/memberships/?user__first_name__contains=%C3%96tz1&user__last_name__contains=CABBAG3`,
        headers: {
          authorization: token,
        },
      };
      // retrieve member(s) matching test_user_not_member sent registration from previous test execution
      cy.request(retrieveMembersParams).then((response) => {
        console.log(response.body);
        if (response.status === 200 && response.body.length > 0) {
          for (let i = 0; i < response.body.length; i++) {
            const member = response.body[i];
            console.log("Deleting membershiop with id: ", member.id);
            console.log(member);
            const deleteMembersParameters = {
              method: "DELETE",
              url: `http://localhost:8000/api/memberships/memberships/${member.id}/`,
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
    cy.get("span[id='welcome-member-span']").should(
      "contain.text",
      "Willkommen auf der MILA Mitgliederplattform!"
    );
    cy.get(".p-card-body button")
      .then(($btn) => {
        const txt = $btn.text();
        expect(txt).to.eq("Weiter");
      })
      .click();
    /* Page 1/5 */
    cy.get("div[id='welcome-paragraph']").should("exist");
    cy.get('[type="radio"]').check("natural");
    cy.get("#next-page1-button > .button button").click();
    /* Page 2/5 */
    cy.get("#first-name-input > .textfield input").clear().type("Ötz1");
    cy.get("#last-name-input > .textfield input").clear().type("CABBAG3");
    cy.get('[type="radio"]').check("male");
    cy.get("#birthdate-input > .date input").click({ force: true });
    cy.get(
      "#pv_id_1_panel > div > div > div.p-datepicker-calendar-container > table > tbody > tr:nth-child(4) > td.p-datepicker-today > span"
    ).click({ force: true });
    cy.get("#occupation-input > .textfield input")
      .click({ force: true })
      .type("lazy cat");
    cy.get("#address-street-input > .textfield input")
      .click({ force: true })
      .type("ÄltGasseMitNötFünnyChars");
    cy.get("#address-street-number-input > .textfield input")
      .click({ force: true })
      .type("28392");
    cy.get("#address-postcode-input > .textfield input")
      .click({ force: true })
      .type("1111");
    cy.get("#address-city-input > .textfield input")
      .click({ force: true })
      .type("Weän");
    cy.get("#address-country-input > .textfield input")
      .click({ force: true })
      .type("Österland");
    cy.get("#next-page2-button > .button button").click();
    /* Page 3/5 */
    cy.get('[type="radio"]').check("1"); // TODO: Can we use label instead?
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
    cy.get("#checkbox_statutes_approved > .boolean input").check({
      force: true,
    });
    cy.intercept({ method: "POST", url: "**/register" }).as("new-member");
    cy.get("#submit-button > .button button").click();
    cy.wait("@new-member").then(({ response: actualResponse }) => {
      expect(actualResponse?.statusCode).to.eq(201);
      cy.fixture("expectedResponseNP.json").then((expectedResponse) => {
        /* Here response.body validation */
        expect(actualResponse?.statusCode).to.eq(201);
        expect(actualResponse?.body).to.have.property("user");
        expect(actualResponse?.body).to.have.property("person_type");
        expect(actualResponse?.body.person_type).to.deep.eq(
          expectedResponse.person_type
        );
      });
    });
  });

  it("register as legal person", () => {
    cy.login("test_user_not_member@example.com");
    cy.get("span[id ='welcome-member-span']").should(
      "contain.text",
      "Willkommen auf der MILA Mitgliederplattform!"
    );
    cy.get(".p-card-body button")
      .then(($btn) => {
        const txt = $btn.text();
        expect(txt).to.eq("Weiter");
      })
      .click();
    /* Page 1/5 */
    cy.get("div[id='welcome-paragraph']").should("exist");
    cy.get('[type="radio"]').check("legal");
    cy.get("#next-page1-button > .button button").click();
    /* Page 2/5 */

    cy.get("#lp-name-input input").type("Ötzi CABBAG3");
    cy.get("#lp-legal-type-input input").type("GG");
    cy.get("#lp-identification-number-input input").type("000000x");

    cy.get("#lp-address-street-input input")
      .click()
      .type("ÄltGasseMitNötFünnyChars");
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
    cy.get("#bank-account-input input").type("AT592250039687965121");
    cy.get("#bank-account-owner-input input").type("Ötz1 CABBAG3");
    cy.get("#next-page3-button button").click();
    /* Page 4/5 */
    cy.get("#groups-interested-input input").check("1");
    cy.get("#groups-interested-input input").check("9");
    cy.get("#skills-input input").check("1");
    cy.get("#skills-input input").check("7");
    cy.get("#next-page4-button button").click();
    /* Page 5/5 */
    cy.get("#checkbox_statutes_approved input").check({ force: true });
    cy.intercept({ method: "POST", url: "**/register" }).as("new-member");
    cy.get("#submit-button > .button button").click();
    cy.wait("@new-member").then(({ response: actualResponse }) => {
      cy.fixture("expectedResponseLP.json").then((expectedResponse) => {
        /* Here response.body validation */
        expect(actualResponse?.statusCode).to.eq(201);
        expect(actualResponse?.body).to.have.property("user");
        expect(actualResponse?.body).to.have.property("person_type");
        expect(actualResponse?.body.person_type).to.deep.eq(
          expectedResponse.person_type
        );
      });
    });
  });
});
