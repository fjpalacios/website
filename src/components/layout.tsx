import './layout.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Header } from './header'
import { Menu } from './menu'

export const Layout: FunctionComponent = ({ children }): ReactElement => {
  return (
    <nav className="container">
      <Menu />
      <Header />
      <nav className="content">{children}</nav>
    </nav>
  )
}
