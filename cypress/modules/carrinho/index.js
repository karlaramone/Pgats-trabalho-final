export default class Carrinho {
  addFromFeaturesIndex(n) {
    cy.get(`.features_items > :nth-child(${n}) > .product-image-wrapper > .single-products > .productinfo > .btn`).click();
    cy.get('.modal-body > :nth-child(1)').should('contain', 'Your product has been added to cart.');
    cy.get('.modal-body > :nth-child(2)').click();
  }

  viewCartAndCheckout() {
    cy.get('.col-sm-6 > .btn').click();
  }

  fillCheckoutMessage(msg) {
    cy.get('[name="message"]').type(msg);
    cy.get(':nth-child(7) > .btn').click();
  }

  pay({ name, number, cvc, month, year } = {}) {
    cy.get('[data-qa="name-on-card"]').type(name);
    cy.get('[data-qa="card-number"]').type(number);
    cy.get('[data-qa="cvc"]').type(cvc);
    cy.get('[data-qa="expiry-month"]').type(month);
    cy.get('[data-qa="expiry-year"]').type(year);
    cy.get('[data-qa="pay-button"]').click();
  }
}
