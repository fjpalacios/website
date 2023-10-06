import * as React from 'react'
import { act } from '@testing-library/react'
import { I18nextProvider } from 'gatsby-plugin-react-i18next'
import { render } from '@testing-library/react'
import locales from '../locales'
const { defaultLanguage } = require('../languages')

const createComponentWithIntl = (children, language = defaultLanguage) => {
  act(() => {
    locales.changeLanguage(language)
  })
  return render(<I18nextProvider i18n={locales}>{children}</I18nextProvider>)
}

export default createComponentWithIntl
