import React, { ReactChild } from 'react'
import { IntlProvider } from 'gatsby-plugin-intl'
import locales from '../locales'
import { mount } from 'enzyme'

const createComponentWithIntl = (
  children: ReactChild,
  locale: 'en' | 'es' = 'en'
) => {
  return mount(
    <IntlProvider locale={locale} messages={locales[locale]}>
      {children}
    </IntlProvider>
  )
}

export default createComponentWithIntl
