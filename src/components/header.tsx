import './header.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import contactEn from '../../content/static/contact/en'
import contactEs from '../../content/static/contact/es'

export const Header: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation()
  const { defaultLanguage, language } = useI18next()
  const contact = language === defaultLanguage ? contactEn : contactEs

  return (
    <header className="header">
      <h1 className="header__title">{t('title')}</h1>
      <div className="header__subtitle">{t('subtitle')}</div>
      <div className="header__contact">
        {contact.map((item, key) => {
          return (
            <div key={key} className={`header__contact__item ${item.icon}`}>
              <a href={item.link} target="_blank" rel="noreferer">
                <i className={`icon-${item.icon}`}></i>
                <p>{item.text}</p>
              </a>
            </div>
          )
        })}
      </div>
    </header>
  )
}
