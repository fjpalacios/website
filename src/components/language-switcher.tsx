import './language-switcher.scss'
import { Link, useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import React, { FunctionComponent, ReactElement } from 'react'

type languageSwitcherProps = {
  disabled?: boolean
  to?: string
}

export const LanguageSwitcher: FunctionComponent<languageSwitcherProps> = ({
  disabled,
  to,
}): ReactElement => {
  const { t } = useTranslation()
  const { defaultLanguage, language, originalPath } = useI18next()
  const newLanguage = language === defaultLanguage ? 'en' : 'es'

  const Flag = (): ReactElement => {
    if (language === 'en') {
      return (
        <Link to={to || originalPath} language={newLanguage}>
          <img
            src="/images/flags/es.svg"
            alt={t('menu.toSpanish')}
            title={t('menu.toSpanish')}
          />
        </Link>
      )
    }

    return (
      <Link to={to || originalPath} language={to ? '' : newLanguage}>
        <img
          src="/images/flags/uk.svg"
          alt={t('menu.toEnglish')}
          title={t('menu.toEnglish')}
        />
      </Link>
    )
  }

  return (
    <div
      className={disabled ? 'language-switcher--disabled' : 'language-switcher'}
    >
      <Flag />
    </div>
  )
}
