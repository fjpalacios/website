import './layout.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Header } from './header'
import { Menu } from './menu'

export const Layout: FunctionComponent = ({ children }): ReactElement => {
  return (
    <div className="container">
      <Menu />
      <Header />
      <div className="content">{children}</div>
    </div>
  )
}
