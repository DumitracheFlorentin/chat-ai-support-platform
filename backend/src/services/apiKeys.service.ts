import prisma from '../lib/prisma'
import { randomUUID } from 'crypto'

import * as apiKeysInterfaces from '../interfaces/apiKeys.interfaces'

export async function createApiKey(
  name: string,
  owner?: string
): Promise<apiKeysInterfaces.ApiKey> {
  const newKey = randomUUID()

  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1) // +1 an valabilitate

  return prisma.apiKey.create({
    data: {
      name,
      key: newKey,
      owner,
      expiresAt,
      active: true,
    },
  })
}

export async function getAllApiKeys(): Promise<apiKeysInterfaces.ApiKey[]> {
  return prisma.apiKey.findMany({
    where: {
      active: true,
    },
  })
}

export async function deleteApiKey(id: string): Promise<void> {
  await prisma.apiKey.delete({
    where: {
      id: Number(id),
    },
  })
}
