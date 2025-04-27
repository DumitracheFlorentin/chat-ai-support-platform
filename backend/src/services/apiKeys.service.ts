import prisma from '../lib/prisma'
import { randomUUID } from 'crypto'

export async function createApiKey(owner?: string): Promise<string> {
  const newKey = randomUUID()

  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1) // +1 an valabilitate

  await prisma.apiKey.create({
    data: {
      key: newKey,
      owner,
      expiresAt,
      active: true,
    },
  })

  return newKey
}
