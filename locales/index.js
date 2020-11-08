import en from './en/translation.json'
import es from './es/translation.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translations'],
  defaultNS: 'translations',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translations: en,
    },
    es: {
      translations: es,
    },
  },
})

export default i18n
