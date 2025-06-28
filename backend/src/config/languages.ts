export interface Language {
  code: string
  name: string
  nativeName: string
  modelName: string
  isRTL: boolean
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)
}

export const getDefaultLanguage = (): Language => {
  return SUPPORTED_LANGUAGES[0] // English
}

export const isLanguageSupported = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code)
}
