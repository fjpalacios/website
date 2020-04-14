import 'normalize.css/normalize.css'
import './static/fontello/css/fontello.css'
import { getSavedTheme } from './src/helpers'

document.body.classList.add(getSavedTheme())
