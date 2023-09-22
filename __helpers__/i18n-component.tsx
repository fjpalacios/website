import React, { ReactNode } from 'react'
import { IntlProvider } from 'gatsby-plugin-intl'
import locales from '../locales'
import { render } from '@testing-library/react'

const createComponentWithIntl = (
  children: ReactNode,
  locale: 'en' | 'es' = 'en'
) => {
  return render(
    <IntlProvider locale={locale} messages={locales[locale]}>
      {children}
    </IntlProvider>
  )
}

export default createComponentWithIntl
