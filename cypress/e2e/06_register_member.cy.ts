// https://docs.cypress.io/api/introduction/api.html

//TODOs: adapt ids in registration form

Cypress.Cookies.debug(true);
describe("register user not member filling out only compulsory fields and checkboxes on page 4/5", () => {
  it("visits the app root url", () => {
      cy.login('test_user_not_member@example.com');
      cy.get("div[id='members-registration-tile']").should('exist');
      cy.get("button[id='members-registration-tile-continue']").click();
      /* Page 1/5 */
      cy.get("div[id='welcome-paragraph']").should('exist');
      cy.get('[type="radio"]').check('natural');
      cy.get("#next-page-button > .button button").click();
      /* Page 2/5 */
      cy.get("#first-name-input > .textfield input").clear().type('Ötz1');
      cy.get("#last-name-input > .textfield input").clear().type('CABBAG3');
      cy.get('[type="radio"]').check('male');
      cy.get('#birthdate-input > .date input').clear().type('01.01.1990');
      cy.get('#occupation-input > .textfield input').clear().type('lazy cat');
      cy.get('#address-street-input > .textfield input').clear().type('ÄltGasseMitNötFünnyChars');
      cy.get('#address-street-number-input > .number input').clear().type('28392');
      cy.get('#address-postcode-input > .number input').clear().type('1111');
      cy.get('#address-city-input > .textfield input').clear().type('Weän');
      cy.get('#address-country-input > .textfield input').clear().type('Österland');
      cy.get("#next-page-button > .button button").click();
      /* Page 3/5 */
      cy.get('[type="radio"]').check('active');
      cy.get('[type="radio"]').check('normal');
      cy.get('[type="radio"]').check('sepa');
      cy.get('#bank-account-input > .textfield input').clear().type('AT592250039687965121');
      cy.get('#bank-account-owner-input > .textfield input').clear().type('Ötz1 CABBAG3');
      cy.get("#next-page-button > .button button").click();
      /* Page 4/5 */
      cy.get('#groups-interested-input > .multipleChoice input').check('1');
      cy.get('#groups-interested-input > .multipleChoice input').check('9');
      cy.get('#skills-input > .multipleChoice input').check('1');
      cy.get('#skills-input > .multipleChoice input').check('7');
      cy.get("#next-page-button > .button button").click();
      /* Page 5/5 */
      
      /* Checkbox cannot be selected because of this -> https://stackoverflow.com/questions/47551639/access-element-whose-parent-is-hidden-cypress-io, workaround possible */
      
      //cy.get('#public-use-approved-checkbox > .boolean input').check();
      //cy.get('#founding-event-checkbox > .boolean input').check();

      cy.get("#submit-button > .button button").click();

      //TODO intercept response
      //TODO validate response
      //TODO delete user now member 

      /**
       * 1. Fill out register form (NP, Organisation)
       * 2. Assert db-data is correct -> cy.intercept()
       * 3. Delete members/members/id -> cy.request [ADMIN-USER]
       */
  });
});
