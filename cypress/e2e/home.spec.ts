/// <reference types="cypress" />

describe('Home', () => {
  beforeEach(() => {
    cy.visit('/').get('main')
  })

  describe('Menu bar', () => {
    it('should have a functional language switcher', () => {
      cy.get('.header__subtitle').should('have.text', 'Software Developer')
      cy.get('.menu .menu__left .language-switcher img').click()
      cy.url().should('include', '/es')
      cy.get('.header__subtitle').should(
        'have.text',
        'Desarrollador de software'
      )
    })

    it('should have a functional light/dark theme switcher', () => {
      cy.get('body').should('have.css', 'background-color', 'rgb(17, 21, 28)')
      cy.get(
        '.menu .menu__left .theme-switcher .theme-switcher__selector__image'
      ).click()
      cy.get('body').should(
        'have.css',
        'background-color',
        'rgb(251, 254, 249)'
      )
    })
  })

  describe('Header', () => {
    it('should hide the phone on the screen', () => {
      cy.get('.header__contact phone').should('not.be.visible')
    })
  })
})

export {}
