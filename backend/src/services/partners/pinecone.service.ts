import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'
import * as langchainService from './langchain.service'

dotenv.config()

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set in environment variables')
}

if (
  !process.env.PINECONE_INDEX_ADA002 ||
  !process.env.PINECONE_INDEX_3LARGE ||
  !process.env.PINECONE_INDEX_GEMINI001
) {
  throw new Error('Pinecone index names are not set in environment variables')
}

console.log('Initializing Pinecone with indexes:', {
  ada002: process.env.PINECONE_INDEX_ADA002,
  embedding3Large: process.env.PINECONE_INDEX_3LARGE,
  gemini001: process.env.PINECONE_INDEX_GEMINI001,
})

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
})

export { pinecone }

export const pineconeIndexes = {
  ada002: pinecone.Index(process.env.PINECONE_INDEX_ADA002),
  embedding3Large: pinecone.Index(process.env.PINECONE_INDEX_3LARGE),
  gemini001: pinecone.Index(process.env.PINECONE_INDEX_GEMINI001),
}

Promise.all([
  pineconeIndexes.ada002.describeIndexStats(),
  pineconeIndexes.embedding3Large.describeIndexStats(),
  pineconeIndexes.gemini001.describeIndexStats(),
])
  .then(([ada002Stats, embedding3LargeStats, gemini001Stats]) => {
    console.log('Pinecone index stats:', {
      ada002: ada002Stats,
      embedding3Large: embedding3LargeStats,
      gemini001: gemini001Stats,
    })
  })
  .catch((error) => {
    console.error('Error accessing Pinecone indexes:', error)
  })

export type PineconeIndexType = keyof typeof pineconeIndexes

export async function deleteProductFromPinecone(
  productId: string | number
): Promise<void> {
  const id = productId.toString()

  console.log(`Attempting to delete product ${id} from all Pinecone indexes`)

  try {
    await Promise.all([
      pineconeIndexes.ada002.deleteOne(id),
      pineconeIndexes.embedding3Large.deleteOne(id),
      pineconeIndexes.gemini001.deleteOne(id),
    ])

    console.log(`Product ${id} deleted from all Pinecone indexes`)
  } catch (error) {
    console.error(`Error deleting product ${id} from Pinecone:`, error)
    throw error
  }
}

export async function updateProductInPinecone(
  productId: string | number,
  name: string,
  description: string,
  price: number
): Promise<void> {
  const id = productId.toString()

  console.log(`Attempting to update product ${id} in all Pinecone indexes`)

  const combinedText = `${name} ${description}`

  try {
    const [ada002Vector, embedding3LargeVector, gemini001Vector] =
      await Promise.all([
        langchainService.generateEmbedding(combinedText, 'ada002'),
        langchainService.generateEmbedding(combinedText, 'embedding3Large'),
        langchainService.generateEmbedding(combinedText, 'gemini001'),
      ])

    await Promise.all([
      pineconeIndexes.ada002.upsert([
        {
          id,
          values: ada002Vector,
          metadata: { name, description, price },
        },
      ]),
      pineconeIndexes.embedding3Large.upsert([
        {
          id,
          values: embedding3LargeVector,
          metadata: { name, description, price },
        },
      ]),
      pineconeIndexes.gemini001.upsert([
        {
          id,
          values: gemini001Vector,
          metadata: { name, description, price },
        },
      ]),
    ])

    console.log(`Product ${id} updated in all Pinecone indexes`)
  } catch (error) {
    console.error(`Error updating product ${id} in Pinecone:`, error)
    throw error
  }
}
