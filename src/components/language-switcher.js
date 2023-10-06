import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import './language-switcher.scss'

const LanguageSwitcher = () => {
  const { t, language, changeLanguage } = useI18next()
  const defaultLocale = 'es'
  const newLanguage = language === 'es' ? 'en' : defaultLocale

  const Flag = () => {
    if (language === 'en') {
      return (
        <button
          onClick={(e) => {
            e.preventDefault()
            changeLanguage(newLanguage)
          }}
        >
          <img src="/images/flags/es.svg" alt={t('menu.toSpanish')} title={t('menu.toSpanish')} />
        </button>
      )
    }

    return (
      <button
        onClick={(e) => {
          e.preventDefault()
          changeLanguage(newLanguage)
        }}
      >
        <img src="/images/flags/uk.svg" alt={t('menu.toEnglish')} title={t('menu.toEnglish')} />
      </button>
    )
  }

  return (
    <div className="language-switcher">
      <Flag />
    </div>
  )
}

export default LanguageSwitcher
