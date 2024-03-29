describe('Home', () => {
  beforeEach(() => {
    cy.visit('/').get('main')
    cy.injectAxe()
  })

  it('should have valid English SEO properties', () => {
    cy.get('html').should('have.attr', 'lang', 'es')
    cy.get('.header__subtitle').should('have.text', 'Desarrollador de software')
    cy.get('.menu .menu__left .language-switcher img').click()
    cy.get('html').should('have.attr', 'lang', 'en')
    cy.get('head title').should('have.text', 'Francisco Javier Palacios Pérez')
    cy.get('head meta[property="og:url"]').should('have.attr', 'content', 'https://fjp.es/en/')
    cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'website')
    cy.get('head meta[name="description"]').should(
      'have.attr',
      'content',
      "Francisco Javier Palacios Pérez's personal website, Software Developer based in Valencia (Spain)"
    )
    cy.get('head meta[name="image"]').should('have.attr', 'content', 'https://fjp.es/logo.jpg')
  })

  it('should have valid Spanish SEO properties', () => {
    cy.get('html').should('have.attr', 'lang', 'es')
    cy.get('head title').should('have.text', 'Francisco Javier Palacios Pérez')
    cy.get('head meta[property="og:url"]').should('have.attr', 'content', 'https://fjp.es/')
    cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'website')
    cy.get('head meta[name="description"]').should(
      'have.attr',
      'content',
      'Página web personal de Francisco Javier Palacios Pérez, desarrollador de software de Valencia (España)'
    )
    cy.get('head meta[name="image"]').should('have.attr', 'content', 'https://fjp.es/logo.jpg')
  })

  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y()
  })

  describe('Menu bar', () => {
    it('should have a functional language switcher', () => {
      cy.get('.header__subtitle').should('have.text', 'Desarrollador de software')
      cy.get('.menu .menu__left .language-switcher img').click()
      cy.url().should('include', '/en')
      cy.get('.header__subtitle').should('have.text', 'Software Developer')
    })

    it('should have a functional light/dark theme switcher', () => {
      cy.get('body').should('have.css', 'background-color', 'rgb(17, 21, 28)')
      cy.get('.menu .menu__left .theme-switcher .theme-switcher__selector__image').click()
      cy.get('body').should('have.css', 'background-color', 'rgb(251, 254, 249)')
    })
  })

  describe('Header', () => {
    it('should hide the phone on the screen', () => {
      cy.get('.header__contact .phone').should('not.be.visible')
    })

    it('should hide the website on the screen', () => {
      cy.get('.header__contact .globe').should('not.be.visible')
    })
  })
})
