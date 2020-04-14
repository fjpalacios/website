import './menu.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'

export const Menu: FunctionComponent = (): ReactElement => {
  return (
    <nav className="menu">
      <div className="menu__left">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </nav>
  )
}
