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

export const getDefaultLanguage = (): Language => {
  return SUPPORTED_LANGUAGES[0] // English
}
