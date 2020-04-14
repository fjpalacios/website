import './language-switcher.scss'
import { changeLocale, useIntl } from 'gatsby-plugin-intl'
import React, { FunctionComponent, ReactElement } from 'react'

export const LanguageSwitcher: FunctionComponent = (): ReactElement => {
  const intl = useIntl()
  const locale = intl.locale
  const defaultLocale = '' // empty string to avoid duplicate content in / and /en
  const newLocale = locale === 'en' ? 'es' : defaultLocale

  const Flag = (): ReactElement => {
    if (locale === 'en') {
      return (
        <img
          src="/images/flags/es.svg"
          alt={intl.formatMessage({ id: 'menu.toSpanish' })}
          title={intl.formatMessage({ id: 'menu.toSpanish' })}
          onClick={() => changeLocale(newLocale)}
        />
      )
    }

    return (
      <img
        src="/images/flags/uk.svg"
        alt={intl.formatMessage({ id: 'menu.toEnglish' })}
        title={intl.formatMessage({ id: 'menu.toEnglish' })}
        onClick={() => changeLocale(newLocale)}
      />
    )
  }

  return (
    <div className="language-switcher">
      <Flag />
    </div>
  )
}
