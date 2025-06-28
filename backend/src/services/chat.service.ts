import * as langchainService from './partners/langchain.service'
import * as translationService from './partners/translation.service'
import { getLanguageByCode, getDefaultLanguage } from '../config/languages'
import prisma from '../lib/prisma'

export async function askWithContext(
  question: string,
  modelId: string = 'gpt35Turbo',
  embeddingModel: langchainService.EmbeddingModelType = 'ada002',
  language: string = 'en'
): Promise<string> {
  // Always use existing LangChain service for context retrieval and response generation
  const englishResponse = await langchainService.askWithContext(
    question,
    modelId,
    embeddingModel
  )

  // If the target language is English, return the response as is
  if (language === 'en') {
    return englishResponse
  }

  // Check if the response contains JSON with products
  try {
    const cleanedResponse = englishResponse.trim()
    let jsonStart = cleanedResponse.indexOf('[')
    let jsonEnd = cleanedResponse.lastIndexOf(']')

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd + 1)
      const products = JSON.parse(jsonString)

      if (Array.isArray(products) && products.length > 0) {
        // Translate product data
        const translatedProducts = await translateProductData(
          products,
          language
        )
        const translatedJson = JSON.stringify(translatedProducts, null, 2)

        // Replace the original JSON with translated JSON
        const beforeJson = cleanedResponse.substring(0, jsonStart)
        const afterJson = cleanedResponse.substring(jsonEnd + 1)

        return beforeJson + translatedJson + afterJson
      }
    }
  } catch (error) {
    console.log('Not a product JSON response, translating as regular text')
  }

  // Translate the response to the target language
  const translation = await translationService.translateText({
    text: englishResponse,
    targetLanguage: language,
    sourceLanguage: 'en',
  })

  return translation.translatedText
}

async function translateProductData(
  products: any[],
  targetLanguage: string
): Promise<any[]> {
  try {
    const translatedProducts = await Promise.all(
      products.map(async (product) => {
        const translatedProduct = { ...product }

        // Translate product name
        if (product.name) {
          const nameTranslation = await translationService.translateText({
            text: product.name,
            targetLanguage,
            sourceLanguage: 'en',
          })
          translatedProduct.name = nameTranslation.translatedText
        }

        // Translate product description
        if (product.description) {
          const descTranslation = await translationService.translateText({
            text: product.description,
            targetLanguage,
            sourceLanguage: 'en',
          })
          translatedProduct.description = descTranslation.translatedText
        }

        return translatedProduct
      })
    )

    return translatedProducts
  } catch (error) {
    console.error('Error translating product data:', error)
    return products // Return original products if translation fails
  }
}

export async function generateMultiLanguageResponse(
  question: string,
  language: string = 'en',
  modelId?: string
): Promise<string> {
  try {
    const targetLanguage = getLanguageByCode(language)
      ? language
      : getDefaultLanguage().code

    // Use the existing LangChain service to generate the response in English
    const englishResponse = await langchainService.generateChatCompletion(
      [
        {
          role: 'system',
          content:
            'You are an AI assistant for an online electronics store. Please respond in English.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
      modelId || 'gpt35Turbo'
    )

    // If target language is English, return as is
    if (targetLanguage === 'en') {
      return englishResponse
    }

    // Translate to target language
    const translation = await translationService.translateText({
      text: englishResponse,
      targetLanguage,
      sourceLanguage: 'en',
    })

    return translation.translatedText
  } catch (error) {
    console.error('Error generating multi-language response:', error)
    throw error
  }
}

export async function translateMessage(
  content: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string> {
  try {
    const translation = await translationService.translateText({
      text: content,
      targetLanguage,
      sourceLanguage,
    })
    return translation.translatedText
  } catch (error) {
    console.error('Error translating message:', error)
    return content // Return original content if translation fails
  }
}

export async function detectMessageLanguage(content: string): Promise<string> {
  try {
    return await translationService.detectLanguage(content)
  } catch (error) {
    console.error('Error detecting language:', error)
    return 'en' // Default to English if detection fails
  }
}

export async function createChat(title: string) {
  return prisma.chat.create({
    data: {
      title: title || 'New Chat',
    },
  })
}

export async function getAllChats() {
  return prisma.chat.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function getMessagesByChatId(chatId: string) {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function deleteChatById(chatId: string) {
  await prisma.message.deleteMany({
    where: { chatId },
  })

  return prisma.chat.delete({
    where: { id: chatId },
  })
}

export async function editTitleByChatId(chatId: string, newTitle: string) {
  return prisma.chat.update({
    where: { id: chatId },
    data: { title: newTitle },
  })
}
