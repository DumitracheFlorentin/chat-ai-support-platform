import * as langchainService from './partners/langchain.service'
import * as translationService from './partners/google.service'
import prisma from '../lib/prisma'

export async function askWithContext(
  question: string,
  modelId: string = 'gpt35Turbo',
  embeddingModel: langchainService.EmbeddingModelType = 'ada002',
  language: string = 'en'
): Promise<string> {
  const englishResponse = await langchainService.askWithContext(
    question,
    modelId,
    embeddingModel
  )

  if (language === 'en') {
    return englishResponse
  }

  try {
    const cleanedResponse = englishResponse.trim()
    let jsonStart = cleanedResponse.indexOf('[')
    let jsonEnd = cleanedResponse.lastIndexOf(']')

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd + 1)
      const products = JSON.parse(jsonString)

      if (Array.isArray(products) && products.length > 0) {
        const translatedProducts = await translateProductData(
          products,
          language
        )
        const translatedJson = JSON.stringify(translatedProducts, null, 2)

        const beforeJson = cleanedResponse.substring(0, jsonStart)
        const afterJson = cleanedResponse.substring(jsonEnd + 1)

        return beforeJson + translatedJson + afterJson
      }
    }
  } catch (error) {
    console.log('Not a product JSON response, translating as regular text')
  }

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

        if (product.name) {
          const nameTranslation = await translationService.translateText({
            text: product.name,
            targetLanguage,
            sourceLanguage: 'en',
          })
          translatedProduct.name = nameTranslation.translatedText
        }

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
