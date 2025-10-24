/// <reference types="cypress" />

import userData from '../fixtures/example.json';
import { faker } from '@faker-js/faker';
import Login from '../modules/login';
import Cadastro from '../modules/cadastro';
import Contato from '../modules/contato';
import Produtos from '../modules/produtos';
import Carrinho from '../modules/carrinho';

const login = new Login();
const cadastro = new Cadastro();
const contato = new Contato();
const produtos = new Produtos();
const carrinho = new Carrinho();

describe('Automation Tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr'); 
    cy.visit('https://automationexercise.com/'); 
    cy.get('a[href="/login"]').click(); 
  });

  it('Teste 1: Registrar usuário', () => {
    const timestamp = new Date().getTime();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    cadastro.register({
      firstName,
      lastName,
      timestamp,
      company: `PGATS ${faker.company.name()}`,
      address: faker.location.streetAddress(),
      country: 'Canada',
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobile_number: '111 222 333',
      password: '12345'
    });
  });


  it('Teste 2: Faça login no usuário com e-mail e senha corretos', () => {
    login.login('qa-tester-1759530219181@test.com', '12345');
    login.assertLoggedIn('QA Tester');
    cy.get('a[href="/logout"]').should('be.visible');

    cy.get(':nth-child(10) > a')
      .should('be.visible')
      .and('have.text', ' Logged in as QA Tester');

    cy.contains('b', 'QA Tester');
    cy.contains('Logged in as QA Tester').should('be.visible');
  });


  it('Teste 3: Fazer login no usuário com e-mail e senha incorretos', () => {
    cy.get('[data-qa="login-email"]').type('qa-tester-1759530219181@test.com');
    cy.get('[data-qa="login-password"]').type('99754321');

    cy.get('[data-qa="login-button"]').click(); 
    cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!');
  });

  it('Teste 4: Fazer logout do usuário', () => {
    cy.get('[data-qa="login-email"]').type('qa-tester-1759530219181@test.com');
    cy.get('[data-qa="login-password"]').type('12345');

    cy.get('[data-qa="login-button"]').click(); 
    cy.get('i.fa-user').parent().should('contain', 'QA Tester'); 
    
    cy.get('a[href="/logout"]').should('be.visible').click(); 

    cy.url().should('contain', 'login');
    cy.contains('Login to your account'); 

    cy.get('a[href="/logout"]').should('not.exist');
    cy.get('a[href="/login"]').should('contain', 'Signup / Login'); 
  });


  it('Teste 5: Registrar usuário com e-mail existente', () => {
    cy.get('[data-qa="signup-name"]').type('QA Tester'); 
    cy.get('[data-qa="signup-email"]').type('qa-tester-1759530219181@test.com'); 
    cy.contains('button', 'Signup').click();

    cy.get('.signup-form > form > p').should('contain', 'Email Address already exist!')
  });

  it('Teste 6: Formulário de contato', () => {
    contato.submit({
      name: userData.name,
      email: userData.email,
      subject: userData.subject,
      message: userData.message,
      fixturePath: 'cypress/fixtures/example.json'
    });
  });

  it('Teste 8: Verificar todos os produtos e a página de detalhes do produto', () => {
    login.login('qa-tester-1759530219181@test.com', '12345');
    produtos.goToProducts();
    produtos.openDetailsByNth(3);
    cy.get('.product-information > h2').should('be.visible')
    cy.get('.product-information > :nth-child(3)').should('be.visible')
    cy.get(':nth-child(5) > span').should('be.visible')
    cy.get('[name="quantity"]').should('have.value', '1');
    cy.get('.product-information > :nth-child(6)').should('be.visible')
    cy.get('.product-information > :nth-child(7)').should('be.visible')
    cy.get('.product-information > :nth-child(8)').should('be.visible')
  });

  it('Teste 9: Pesquisar produto', () => {
    login.login('qa-tester-1759530219181@test.com', '12345');
    produtos.goToProducts();
    produtos.search('Blue Top');
    cy.get('.productinfo > p').should('be.visible');
  });


  it('Teste 10: Verify Subscription in home page', () => {
    login.login('qa-tester-1759530219181@test.com', '12345');
    produtos.subscribe('teste@teste.com');
  });


  it('Teste 15: Faça o pedido: Registre-se antes de finalizar a compra', () => {
    const timestamp = new Date().getTime();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const nomeCartao = faker.person.fullName();
    const numeroCartao = faker.finance.creditCardNumber('#### #### #### ####');
    const cvc = faker.finance.creditCardCVV();
    const mesExpiracao = faker.date.future().getMonth() + 1; // mês entre 1–12
    const anoExpiracao = faker.date.future().getFullYear();
    const celular = `119${faker.number.int({ min: 10000000, max: 99999999 })}`;
    const converteu = celular.replace(/\D/g, ''); // "11912345678"


    cadastro.register({
      firstName,
      lastName,
      timestamp,
      company: `PGATS ${faker.company.name()}`,
      address: faker.location.streetAddress(),
      country: 'Canada',
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobile_number: converteu,
      password: '12345'
    });

    cy.get('[data-qa="continue-button"]').click();
    login.assertLoggedIn(`${firstName} ${lastName}`);
    cy.get('a[href="/logout"]').should('be.visible');

    cy.contains('b', `${firstName} ${lastName}`);
    cy.contains(`Logged in as ${firstName} ${lastName}`).should('be.visible');
   
    carrinho.addFromFeaturesIndex(3);
    
    cy.get('.cart_description > h4')
        .should('be.visible')
        .and('contain.text', 'Blue Top');

    carrinho.viewCartAndCheckout();
    carrinho.fillCheckoutMessage('teste de software');
    carrinho.pay({
      name: nomeCartao,
      number: numeroCartao,
      cvc,
      month: mesExpiracao.toString(),
      year: anoExpiracao.toString()
    });

    cy.get('.alert-success.alert').should('exist').and('contain.text', 'You have been successfully subscribed!');
    cy.get(':nth-child(5) > a').click();
    cy.get('[data-qa="account-deleted"]').should('exist').and('contain.text', 'Account Deleted!');
    cy.get('[data-qa="continue-button"]').click();
  });
});