export default class Cadastro {
  register({
    firstName,
    lastName,
    timestamp,
    email,
    password = '12345',
    company = '',
    address = '',
    country = 'Canada',
    state = '',
    city = '',
    zipcode = '',
    mobile_number = ''
  } = {}) {
    const name = `${firstName} ${lastName}`;
    cy.get('[data-qa="signup-name"]').clear().type(name);
    cy.get('[data-qa="signup-email"]').clear().type(email || `qa-tester-${timestamp}@test.com`);
    cy.contains('button', 'Signup').click();

    cy.get('input[type=radio]').check('Mrs');
    cy.get('input#password').type(password, { log: false });

    cy.get('select[data-qa="days"]').select('20');
    cy.get('select[data-qa="months"]').select('September');
    cy.get('select[data-qa="years"]').select('1992');
    cy.get('input[type=checkbox]#newsletter').check();
    cy.get('input[type=checkbox]#optin').check();

    cy.get('input#first_name').clear().type(firstName);
    cy.get('input#last_name').clear().type(lastName);
    if (company) cy.get('input#company').clear().type(company);
    if (address) cy.get('input#address1').clear().type(address);
    cy.get('select#country').select(country);
    if (state) cy.get('input#state').clear().type(state);
    if (city) cy.get('input#city').clear().type(city);
    if (zipcode) cy.get('[data-qa="zipcode"]').clear().type(zipcode);
    if (mobile_number) cy.get('[data-qa="mobile_number"]').clear().type(mobile_number);

    cy.get('[data-qa="create-account"]').click();

    cy.url().should('include', 'account_created');
    cy.contains('b', 'Account Created!');
  }
}
