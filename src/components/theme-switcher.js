import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import { getSavedTheme, switchTheme } from '../helpers'
import './theme-switcher.scss'

const ThemeSwitcher = () => {
  const { t } = useI18next()
  const theme = getSavedTheme()

  React.useEffect(() => {
    if (theme === 'dark') {
      document.getElementById('selector').checked = true
    }
  })

  return (
    <div className="theme-switcher">
      <input type="checkbox" className="theme-switcher__selector" id="selector" onClick={() => switchTheme()} />
      <label htmlFor="selector">
        <div className="theme-switcher__selector__image" title={t('menu.switchTheme')}></div>
      </label>
    </div>
  )
}

export default ThemeSwitcher
