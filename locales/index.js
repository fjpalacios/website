import en from './en/common.json'
import es from './es/common.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
const { languages, defaultLanguage } = require('../languages')

i18n.use(initReactI18next).init({
  languages,
  defaultLanguage,
  ns: ['common'],
  resources: {
    en: {
      common: en,
    },
    es: {
      common: es,
    },
  },
})

export default i18n
