import './layout.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Header } from './header'
import { Menu } from './menu'

type layoutProps = {
  languageSwitcherDisabled?: boolean
  languageSwitcherTo?: string
}

export const Layout: FunctionComponent<layoutProps> = ({
  languageSwitcherDisabled,
  languageSwitcherTo,
  children,
}): ReactElement => {
  return (
    <div className="container">
      <Menu
        languageSwitcherDisabled={languageSwitcherDisabled}
        languageSwitcherTo={languageSwitcherTo}
      />
      <Header />
      <div className="content">{children}</div>
    </div>
  )
}
