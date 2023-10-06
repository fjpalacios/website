import * as React from 'react'
import Header from '../header'
import createComponentWithIntl from '../../../__helpers__/i18n-component'

describe('Header', () => {
  it('should render properly', () => {
    const header = createComponentWithIntl(<Header />)
    expect(header).toMatchSnapshot()
  })

  it('should show English language by default', () => {
    const { container } = createComponentWithIntl(<Header />, 'en')
    const subTitle = container.querySelectorAll('.header__subtitle')[0].textContent
    expect(subTitle).toBe('Software Developer')
  })

  it('should show Spanish language if required', () => {
    const { container } = createComponentWithIntl(<Header />)
    const subTitle = container.querySelectorAll('.header__subtitle')[0].textContent
    expect(subTitle).toBe('Desarrollador de software')
  })
})
