import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import contactEn from '../../content/en/contact.js'
import contactEs from '../../content/es/contact.js'
import './header.scss'

const Header = () => {
  const { t, language } = useI18next()
  const contact = language === 'en' ? contactEn : contactEs

  return (
    <header className="header">
      <h1 className="header__title">{t('title')}</h1>
      <h2 className="header__subtitle">{t('subtitle')}</h2>
      <div className="header__contact">
        {contact.map((item, key) => {
          return (
            <div key={key} className={`header__contact__item ${item.icon}`}>
              <a href={item.link} target="_blank" rel="noreferrer">
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

export default Header
