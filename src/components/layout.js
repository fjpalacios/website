import * as React from 'react'
import Menu from './menu'
import Header from './header'
import './layout.scss'

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Menu />
      <Header />
      <div className="content">{children}</div>
    </div>
  )
}

export default Layout
