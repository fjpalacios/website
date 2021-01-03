import React, { ReactChild } from 'react'
import { act } from '@testing-library/react'
import { I18nextProvider } from 'gatsby-plugin-react-i18next'
import locales from '../locales'
import { mount } from 'enzyme'

const createComponentWithIntl = (
  children: ReactChild,
  language: 'en' | 'es' = 'en'
) => {
  act(() => {
    locales.changeLanguage(language)
  })

  return mount(<I18nextProvider i18n={locales}>{children}</I18nextProvider>)
}

export default createComponentWithIntl
