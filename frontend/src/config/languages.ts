import type { Language } from '@/types/chat'

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
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
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
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
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
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
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
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    modelName: 'microsoft/DialoGPT-medium',
    isRTL: false,
  },
  {
    code: 'cs',
    name: 'Czech',
    nativeName: 'Čeština',
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
