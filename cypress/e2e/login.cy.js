const validEmail = 'doguscan@mail.com';
const validPassword = 'asdasda1D.';
const invalidEmail = 'not-an-email';
const invalidPassword = 'ab1';

const emailError = 'Please enter a valid email address.';
const passwordError =
  'Password must be at least 5 characters, contain a letter, and have no spaces.';

const signInButton = () => cy.get('[data-testid="submit-button"]');
const emailInput = () => cy.get('[data-testid="email-input"]');
const passwordInput = () => cy.get('[data-testid="password-input"]');
const termsInput = () => cy.get('[data-testid="terms-input"]');
const visibleErrors = () => cy.get('[data-testid$="-error"]:visible');

describe('Login form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('signs in with valid credentials and opens the success page', () => {
    emailInput().type(validEmail);
    passwordInput().type(validPassword);
    termsInput().check();

    signInButton().should('be.enabled');
    signInButton().click();

    cy.location('pathname').should('eq', '/success');
    cy.contains('Success').should('be.visible');
  });

  describe('invalid submissions', () => {
    it('shows one error for a wrong email and keeps the button disabled', () => {
      emailInput().type(invalidEmail).blur();
      passwordInput().type(validPassword).blur();
      termsInput().check();

      visibleErrors().should('have.length', 1);
      cy.get('[data-testid="email-error"]')
        .should('be.visible')
        .and('contain.text', emailError);
      signInButton().should('be.disabled');
    });

    it('shows two errors when both email and password are wrong', () => {
      emailInput().type(invalidEmail).blur();
      passwordInput().type(invalidPassword).blur();
      termsInput().check();

      visibleErrors().should('have.length', 2);
      cy.get('[data-testid="password-error"]')
        .should('be.visible')
        .and('contain.text', passwordError);
      signInButton().should('be.disabled');
    });

    it('keeps the button disabled when terms are not accepted', () => {
      emailInput().type(validEmail);
      passwordInput().type(validPassword);

      termsInput().should('not.be.checked');
      signInButton().should('be.disabled');
    });
  });
});
