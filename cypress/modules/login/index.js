export default class Login {
  login(email, password) {
    cy.get('[data-qa="login-email"]').clear().type(email);
    cy.get('[data-qa="login-password"]').clear().type(password);
    cy.get('[data-qa="login-button"]').click();
  }

  logout() {
    cy.get('a[href="/logout"]').should('be.visible').click();
  }

  assertLoggedIn(fullName) {
    cy.get('i.fa-user').parent().should('contain', fullName);
  }
}
