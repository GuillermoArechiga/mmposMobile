import esSetup from './locales/es/setup.ts'
import enSetup from './locales/en/setup.ts'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]
export const FALLBACK_LANGUAGE: Language = 'es'

// One entry per namespace, same names as mmPosWeb/src/i18n/locales.
export const resources = {
  es: { setup: esSetup },
  en: { setup: enSetup }
} as const

export function pickLanguage(code: string | null | undefined): Language {
  const value = String(code ?? '').toLowerCase()
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
    ? (value as Language)
    : FALLBACK_LANGUAGE
}
