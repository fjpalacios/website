describe('About', () => {
  beforeEach(() => {
    cy.visit('/about/').get('main')
    cy.injectAxe()
  })

  it('should have valid English SEO properties', () => {
    cy.get('html').should('have.attr', 'lang', 'es')
    cy.get('.header__subtitle').should('have.text', 'Desarrollador de software')
    cy.get('.menu .menu__left .language-switcher img').click()
    cy.get('html').should('have.attr', 'lang', 'en')
    cy.get('head title').should('have.text', 'About me - Francisco Javier Palacios Pérez')
    cy.get('head meta[property="og:url"]').should('have.attr', 'content', 'http://localhost:8000/en/about/')
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
    cy.get('head title').should('have.text', 'Sobre mí - Francisco Javier Palacios Pérez')
    cy.get('head meta[property="og:url"]').should('have.attr', 'content', 'http://localhost:8000/about/')
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
})

export {}
