import { Language } from '../interfaces/language.interfaces'

const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
  },
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)
}

export const getDefaultLanguage = (): Language => {
  return {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  } // English
}
