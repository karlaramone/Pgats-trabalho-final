export default class Produtos {
  goToProducts() {
    cy.get('a[href="/products"]').should('be.visible').click();
    cy.get('.title').should('be.visible');
  }

  openDetailsByNth(n) {
    cy.get(`:nth-child(${n}) > .product-image-wrapper > .choose > .nav > li > a`).click();
  }

  search(name) {
    cy.get('[name="search"]').clear().type(name);
    cy.get('#submit_search').click();
  }

  openProductFromHomeByIndex(n) {
    cy.get(`.features_items > :nth-child(${n}) > .product-image-wrapper > .single-products > .productinfo > .btn`).click();
  }

  subscribe(email) {
    cy.get('.single-widget > h2').scrollIntoView().should('be.visible');
    cy.get('#susbscribe_email').clear().type(email);
    cy.get('#subscribe').click();
  }
}
