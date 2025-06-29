import dotenv from 'dotenv'
import { getLanguageByCode } from '../languages.service'
import {
  TranslationRequest,
  TranslationResponse,
} from '../../interfaces/google.interfaces'

dotenv.config()

async function googleTranslate(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  try {
    if (targetLang === 'en') {
      return text
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

    if (apiKey) {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.data.translations[0].translatedText
      }
    }

    const translations: Record<string, string> = {
      es: `[ES] ${text}`,
      fr: `[FR] ${text}`,
      de: `[DE] ${text}`,
      it: `[IT] ${text}`,
      pt: `[PT] ${text}`,
      ru: `[RU] ${text}`,
      zh: `[ZH] ${text}`,
      ja: `[JA] ${text}`,
      ko: `[KO] ${text}`,
      ar: `[AR] ${text}`,
      hi: `[HI] ${text}`,
      tr: `[TR] ${text}`,
      nl: `[NL] ${text}`,
      pl: `[PL] ${text}`,
      sv: `[SV] ${text}`,
      da: `[DA] ${text}`,
      no: `[NO] ${text}`,
      fi: `[FI] ${text}`,
      cs: `[CS] ${text}`,
      ro: `[RO] ${text}`,
    }

    return translations[targetLang] || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = request

    if (targetLanguage === 'en') {
      return {
        translatedText: text,
        sourceLanguage,
        targetLanguage,
      }
    }

    const language = getLanguageByCode(targetLanguage)
    if (!language) {
      console.warn(
        `Unsupported language: ${targetLanguage}, falling back to English`
      )
      return {
        translatedText: text,
        sourceLanguage,
        targetLanguage: 'en',
      }
    }

    const translatedText = await googleTranslate(
      text,
      targetLanguage,
      sourceLanguage
    )

    return {
      translatedText,
      sourceLanguage,
      targetLanguage,
    }
  } catch (error) {
    console.error('Translation error:', error)

    return {
      translatedText: request.text,
      sourceLanguage: request.sourceLanguage || 'en',
      targetLanguage: request.targetLanguage,
    }
  }
}
