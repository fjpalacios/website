import './layout.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Header } from './header'

export const Layout: FunctionComponent = ({ children }): ReactElement => {
  return (
    <div className="container">
      <Header />
      <div className="content">{children}</div>
    </div>
  )
}
