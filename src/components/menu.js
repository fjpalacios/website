import * as React from 'react'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
import LanguageSwitcher from './language-switcher'
import ThemeSwitcher from './theme-switcher'
import './menu.scss'

const Menu = () => {
  const { t, language } = useI18next()

  return (
    <div className="menu">
      <div className="menu__left">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <nav className="menu__right">
        <ul className="navigation">
          <li className="navigation__link">
            <Link to="/" activeClassName="navigation__link--active" language={language}>
              {t('pages.home')}
            </Link>
          </li>
          <li className="navigation__link">
            <Link to="/about" activeClassName="navigation__link--active" language={language}>
              {t('pages.about')}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Menu
