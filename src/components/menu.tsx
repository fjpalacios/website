import './menu.scss'
import { Link, useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import React, { FunctionComponent, ReactElement } from 'react'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'

type menuProps = {
  languageSwitcherDisabled?: boolean
  languageSwitcherTo?: string
}

export const Menu: FunctionComponent<menuProps> = ({
  languageSwitcherDisabled,
  languageSwitcherTo,
}): ReactElement => {
  const { t } = useTranslation()
  const { language } = useI18next()

  return (
    <div className="menu">
      <div className="menu__left">
        <LanguageSwitcher
          disabled={languageSwitcherDisabled}
          to={languageSwitcherTo}
        />
        <ThemeSwitcher />
      </div>
      <nav className="menu__right">
        <ul className="navigation">
          <li className="navigation__link">
            <Link
              to="/"
              activeClassName="navigation__link--active"
              language={language}
            >
              {t('pages.home')}
            </Link>
          </li>
          <li className="navigation__link">
            <Link
              to="/about"
              activeClassName="navigation__link--active"
              language={language}
            >
              {t('pages.about')}
            </Link>
          </li>
          <li className="navigation__link">
            <Link
              to="/blog"
              activeClassName="navigation__link--active"
              language={language}
            >
              {t('pages.blog')}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
