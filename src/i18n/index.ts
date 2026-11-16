import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import { resources, FALLBACK_LANGUAGE, pickLanguage } from './resources.ts'

/**
 * Spanish first, like mmPosWeb (src/i18n). Until a business is known the
 * device language decides; once signed in/paired the business language wins
 * (business.language), as on the web and the POS.
 */
const i18n = createInstance()

i18n.use(initReactI18next).init({
  resources,
  lng: pickLanguage(getLocales()[0]?.languageCode),
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: 'setup',
  interpolation: { escapeValue: false }
})

export default i18n
