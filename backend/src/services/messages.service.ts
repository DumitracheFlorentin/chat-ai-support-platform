import prisma from '../lib/prisma'

export async function saveMessage(
  chatId: string,
  role: 'user' | 'assistant',
  content: string
) {
  return prisma.message.create({
    data: {
      chatId,
      role,
      content,
      createdAt: new Date(),
    },
  })
}

export async function getAllMessages() {
  return prisma.message.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}
