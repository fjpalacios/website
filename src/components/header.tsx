import './header.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import contactEn from '../../content/static/contact/en'
import contactEs from '../../content/static/contact/es'
import { useIntl } from 'gatsby-plugin-intl'

export const Header: FunctionComponent = (): ReactElement => {
  const intl = useIntl()
  const contact = intl.locale === 'en' ? contactEn : contactEs

  return (
    <header className="header">
      <h1 className="header__title">{intl.formatMessage({ id: 'title' })}</h1>
      <h2 className="header__subtitle">
        {intl.formatMessage({ id: 'subtitle' })}
      </h2>
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
