import './theme-switcher.scss'
import { getSavedTheme, switchTheme } from '../helpers'
import React, { FunctionComponent, ReactElement, useEffect } from 'react'
import { useIntl } from 'gatsby-plugin-intl'

export const ThemeSwitcher: FunctionComponent = (): ReactElement => {
  const intl = useIntl()
  const theme = getSavedTheme()

  useEffect(() => {
    if (theme === 'dark') {
      ;(document.getElementById('selector') as HTMLInputElement).checked = true
    }
  })

  return (
    <div className="theme-switcher">
      <input
        type="checkbox"
        className="theme-switcher__selector"
        id="selector"
        onClick={() => switchTheme()}
      />
      <label htmlFor="selector">
        <div
          className="theme-switcher__selector__image"
          title={intl.formatMessage({ id: 'menu.switchTheme' })}
        ></div>
      </label>
    </div>
  )
}
