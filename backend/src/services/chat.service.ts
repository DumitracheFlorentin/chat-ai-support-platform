import * as pineconeService from './partners/pinecone.service'
import * as openaiService from './partners/openai.service'

import prisma from '../lib/prisma'

export async function askWithContext(question: string): Promise<string> {
  const embedding = await openaiService.generateEmbedding(question)

  const queryResponse = await pineconeService.pineconeIndex.query({
    vector: embedding,
    topK: 100,
    includeMetadata: true,
  })

  const matchedProducts = queryResponse.matches || []

  const context = matchedProducts
    .map((match, i) => {
      const m = match.metadata as {
        name: string
        description: string
        price?: number
      }
      return `\n${i + 1}. 🛒 **${m.name}**
- ${m.description}
${m.price ? `- 💵 Price: ${m.price} RON` : ''}`
    })
    .join('\n')

  return openaiService.generateChatCompletion([
    {
      role: 'system',
      content: `You are an AI assistant for an online store. You have access ONLY to the list of products below.

      You are NOT allowed to invent products, specifications, or prices. Do NOT provide general answers if the information is not in the list.

      If the question cannot be answered based on the product list, reply exactly with: "I'm sorry, I don't have enough information to answer that."

      Use a clear, concise, and friendly tone.

      Respond with a JSON array of matched products with the format:
      [
        {
          "name": "Product name",
          "description": "Product description",
          "price": 1234,
          "image": "optional_url"
        }
      ]

      Do NOT include any additional text outside the JSON. If no products match, return an empty array [].
      Use only products from the provided context.

      Context:\n\n${context}`,
    },
    {
      role: 'user',
      content: question,
    },
  ])
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
