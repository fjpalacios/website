import createComponentWithIntl from '../../../__helpers__/i18n-component'
import { Header } from '../header'
import React from 'react'

describe('Header', () => {
  it('should render properly', () => {
    const header = createComponentWithIntl(<Header />)
    expect(header).toMatchSnapshot()
  })

  it('should show English language by default', () => {
    const header = createComponentWithIntl(<Header />)
    const subTitle = header.find('.header__subtitle').text()
    expect(subTitle).toBe('Software Developer')
  })

  it('should show Spanish language if required', () => {
    const header = createComponentWithIntl(<Header />, 'es')
    const subTitle = header.find('.header__subtitle').text()
    expect(subTitle).toBe('Desarrollador de software')
  })
})
