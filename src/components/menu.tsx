import './menu.scss'
import { Link, useIntl } from 'gatsby-plugin-intl'
import React, { FunctionComponent, ReactElement } from 'react'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'

export const Menu: FunctionComponent = (): ReactElement => {
  const intl = useIntl()

  return (
    <div className="menu">
      <div className="menu__left">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <nav className="menu__right">
        <ul className="navigation">
          <li className="navigation__link">
            <Link to="/" activeClassName="navigation__link--active">
              {intl.formatMessage({ id: 'pages.home' })}
            </Link>
          </li>
          <li className="navigation__link">
            <Link to="/about/" activeClassName="navigation__link--active">
              {intl.formatMessage({ id: 'pages.about' })}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
