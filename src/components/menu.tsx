import './menu.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { LanguageSwitcher } from './language-switcher'

export const Menu: FunctionComponent = (): ReactElement => {
  return (
    <nav className="menu">
      <LanguageSwitcher />
    </nav>
  )
}
