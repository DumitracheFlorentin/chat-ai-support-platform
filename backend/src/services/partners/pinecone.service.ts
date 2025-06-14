import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

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

// Verify indexes are accessible
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
