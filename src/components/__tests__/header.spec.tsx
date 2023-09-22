import createComponentWithIntl from '../../../__helpers__/i18n-component'
import { Header } from '../header'
import React from 'react'

describe('Header', () => {
  it('should render properly', () => {
    const header = createComponentWithIntl(<Header />)
    expect(header).toMatchSnapshot()
  })

  it('should show English language by default', () => {
    const { container } = createComponentWithIntl(<Header />)
    const subTitle =
      container.querySelectorAll('.header__subtitle')[0].textContent
    expect(subTitle).toBe('Software Developer')
  })

  it('should show Spanish language if required', () => {
    const { container } = createComponentWithIntl(<Header />, 'es')
    const subTitle =
      container.querySelectorAll('.header__subtitle')[0].textContent
    expect(subTitle).toBe('Desarrollador de software')
  })
})
