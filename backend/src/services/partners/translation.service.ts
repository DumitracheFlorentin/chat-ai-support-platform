import dotenv from 'dotenv'
import { getLanguageByCode, getDefaultLanguage } from '../../config/languages'

dotenv.config()

export interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

export interface TranslationResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
}

// Enhanced Google Translate API implementation
async function googleTranslate(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  try {
    // If target language is English, return original text
    if (targetLang === 'en') {
      return text
    }

    // Check if we have a Google Translate API key
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

    if (apiKey) {
      // Use Google Translate API
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

    // Fallback: Simple language-specific transformations for demonstration
    // In production, you would always use a proper translation service
    const translations: Record<string, string> = {
      es: `[ES] ${text}`, // Placeholder - would be actual Spanish translation
      fr: `[FR] ${text}`, // Placeholder - would be actual French translation
      de: `[DE] ${text}`, // Placeholder - would be actual German translation
      it: `[IT] ${text}`, // Placeholder - would be actual Italian translation
      pt: `[PT] ${text}`, // Placeholder - would be actual Portuguese translation
      ru: `[RU] ${text}`, // Placeholder - would be actual Russian translation
      zh: `[ZH] ${text}`, // Placeholder - would be actual Chinese translation
      ja: `[JA] ${text}`, // Placeholder - would be actual Japanese translation
      ko: `[KO] ${text}`, // Placeholder - would be actual Korean translation
      ar: `[AR] ${text}`, // Placeholder - would be actual Arabic translation
      hi: `[HI] ${text}`, // Placeholder - would be actual Hindi translation
      tr: `[TR] ${text}`, // Placeholder - would be actual Turkish translation
      nl: `[NL] ${text}`, // Placeholder - would be actual Dutch translation
      pl: `[PL] ${text}`, // Placeholder - would be actual Polish translation
      sv: `[SV] ${text}`, // Placeholder - would be actual Swedish translation
      da: `[DA] ${text}`, // Placeholder - would be actual Danish translation
      no: `[NO] ${text}`, // Placeholder - would be actual Norwegian translation
      fi: `[FI] ${text}`, // Placeholder - would be actual Finnish translation
      cs: `[CS] ${text}`, // Placeholder - would be actual Czech translation
      ro: `[RO] ${text}`, // Placeholder - would be actual Romanian translation
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

    // If target language is English, return original text
    if (targetLanguage === 'en') {
      return {
        translatedText: text,
        sourceLanguage,
        targetLanguage,
      }
    }

    // Validate target language
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

    // Translate the text
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

    // Fallback to original text if translation fails
    return {
      translatedText: request.text,
      sourceLanguage: request.sourceLanguage || 'en',
      targetLanguage: request.targetLanguage,
    }
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    // Check if we have a Google Translate API key for language detection
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

    if (apiKey) {
      // Use Google Translate API for language detection
      const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.data.detections[0][0].language
      }
    }

    // Fallback: Simple language detection logic
    // Check for common language patterns
    if (/[а-яё]/i.test(text)) return 'ru'
    if (/[äöüß]/i.test(text)) return 'de'
    if (/[àâäéèêëïîôöùûüÿç]/i.test(text)) return 'fr'
    if (/[ñáéíóúü]/i.test(text)) return 'es'
    if (/[àáâãçéêíóôõú]/i.test(text)) return 'pt'
    if (/[àèéìíîòóù]/i.test(text)) return 'it'
    if (/[一-龯]/i.test(text)) return 'zh'
    if (/[あ-ん]/i.test(text)) return 'ja'
    if (/[가-힣]/i.test(text)) return 'ko'
    if (/[ا-ي]/i.test(text)) return 'ar'
    if (/[अ-ह]/i.test(text)) return 'hi'
    if (/[çğıöşü]/i.test(text)) return 'tr'

    return 'en' // Default to English
  } catch (error) {
    console.error('Language detection error:', error)
    return 'en' // Default to English if detection fails
  }
}
