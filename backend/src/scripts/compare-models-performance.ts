import { PrismaClient } from '@prisma/client'
import * as openaiService from '../services/partners/openai.service'
import pinecone from '../services/partners/pinecone.service'

const prisma = new PrismaClient()

interface TestConfig {
  indexName: string
  embeddingModel: string
  dimension: number
}

const configs: TestConfig[] = [
  {
    indexName: 'openai-ada-002',
    embeddingModel: 'text-embedding-ada-002',
    dimension: 1536,
  },
  {
    indexName: 'openai-3-large',
    embeddingModel: 'text-embedding-3-large',
    dimension: 3072,
  },
]

async function ensureIndexExists(indexName: string, dimension: number) {
  try {
    // List all indexes
    const indexes = await pinecone.listIndexes()

    // Check if our index exists
    const indexExists = indexes.indexes?.some(
      (index: { name: string }) => index.name === indexName
    )

    if (!indexExists) {
      console.log(`Creating new index: ${indexName}`)
      await pinecone.createIndex({
        name: indexName,
        dimension: dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      })

      // Wait for index to be ready
      console.log('Waiting for index to be ready...')
      await new Promise((resolve) => setTimeout(resolve, 5000))
    } else {
      console.log(`Index ${indexName} already exists`)
    }
  } catch (error) {
    console.error(`Error ensuring index exists: ${error}`)
    throw error
  }
}

async function measureQueryPerformance(config: TestConfig, queryText: string) {
  const startTime = Date.now()

  try {
    // Ensure index exists before testing
    await ensureIndexExists(config.indexName, config.dimension)

    // Generate embedding
    const embeddingStartTime = Date.now()
    const vector = await openaiService.generateEmbedding(
      queryText,
      config.embeddingModel
    )
    const embeddingTime = Date.now() - embeddingStartTime

    // Query Pinecone
    const queryStartTime = Date.now()
    const index = pinecone.index(config.indexName)
    const queryResponse = await index.query({
      vector,
      topK: 1,
      includeMetadata: true,
    })
    const queryTime = Date.now() - queryStartTime

    const totalTime = Date.now() - startTime

    return {
      model: config.embeddingModel,
      dimension: config.dimension,
      embeddingTime,
      queryTime,
      totalTime,
      result: queryResponse.matches?.[0]?.metadata,
    }
  } catch (error) {
    console.error(`Error testing ${config.embeddingModel}:`, error)
    return null
  }
}

async function runPerformanceTest() {
  // Test with a sample product query
  const testQueries = [
    'gaming laptop with high performance',
    'wireless headphones with noise cancellation',
    'smartphone with good camera',
  ]

  console.log('Starting performance comparison test...\n')

  for (const query of testQueries) {
    console.log(`\nTesting query: "${query}"`)
    console.log('----------------------------------------')

    const results = await Promise.all(
      configs.map((config) => measureQueryPerformance(config, query))
    )

    results.forEach((result) => {
      if (result) {
        console.log(`\nModel: ${result.model}`)
        console.log(`Dimension: ${result.dimension}`)
        console.log(`Embedding generation time: ${result.embeddingTime}ms`)
        console.log(`Pinecone query time: ${result.queryTime}ms`)
        console.log(`Total time: ${result.totalTime}ms`)
        console.log('First match:', result.result)
      }
    })
  }

  await prisma.$disconnect()
}

runPerformanceTest()
