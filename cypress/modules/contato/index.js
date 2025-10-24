export default class Contato {
  submit({ name, email, subject, message, fixturePath = 'cypress/fixtures/example.json' } = {}) {
    cy.get('a[href*=contact]').click();

    cy.get('[data-qa="name"]').clear().type(name);
    cy.get('[data-qa="email"]').clear().type(email);
    cy.get('[data-qa="subject"]').clear().type(subject);
    cy.get('[data-qa="message"]').clear().type(message);

    cy.get('input[type=file]').selectFile(fixturePath);

    cy.get('[data-qa="submit-button"]').click();

    cy.get('.status').should('be.visible');
    cy.get('.status').should('have.text', 'Success! Your details have been submitted successfully.');
  }
}
