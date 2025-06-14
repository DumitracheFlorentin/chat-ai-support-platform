import * as pineconeService from './partners/pinecone.service'
import * as langchainService from './partners/langchain.service'
import prisma from '../lib/prisma'

export async function askWithContext(
  question: string,
  modelId: string = 'gpt35Turbo',
  embeddingModel: langchainService.EmbeddingModelType = 'ada002'
): Promise<string> {
  return langchainService.askWithContext(question, modelId, embeddingModel)
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
