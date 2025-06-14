import fs from 'fs/promises'
import path from 'path'

import { PrismaClient } from '@prisma/client'
import * as openaiService from '../services/partners/openai.service'
import pinecone from '../services/partners/pinecone.service'

// Create a single PrismaClient instance to be reused
const prisma = new PrismaClient({
  log: ['error'],
})

interface ImportConfig {
  indexName: string
  embeddingModel: string
  dimension?: number
}

interface Product {
  name: string
  description: string
  price: number
}

// Process items in batches with controlled concurrency
async function processBatch(
  items: Product[],
  batchSize: number,
  processItem: (item: Product) => Promise<void>
) {
  // Process in smaller chunks to control concurrency
  const concurrencyLimit = 10
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    // Process chunks of the batch with controlled concurrency
    for (let j = 0; j < batch.length; j += concurrencyLimit) {
      const chunk = batch.slice(j, j + concurrencyLimit)
      await Promise.all(chunk.map(processItem))
    }
  }
}

const configs: ImportConfig[] = [
  {
    indexName: 'openai-ada-002-v2',
    embeddingModel: 'text-embedding-ada-002',
    dimension: 1536,
  },
  // {
  //   indexName: 'electronics-3-large-v2',
  //   embeddingModel: 'text-embedding-3-large',
  //   dimension: 3072,
  // },
]

runAllImports()

async function runAllImports() {
  for (const config of configs) {
    await importProducts(config)
  }
}

async function importProducts(config: ImportConfig) {
  const startTime = Date.now()
  let importedCount = 0
  let skippedCount = 0
  let syncedCount = 0

  try {
    console.log(
      `Starting import for index: ${config.indexName} using model: ${config.embeddingModel}`
    )

    await ensureIndexExists(config.indexName, config.dimension)

    const filePath = path.resolve(
      __dirname,
      'data',
      'electronics_products_100.json'
    )
    const file = await fs.readFile(filePath, 'utf-8')
    const products = JSON.parse(file)

    const index = pinecone.index(config.indexName)

    // Process products in batches of 100 with controlled concurrency
    await processBatch(products, 100, async (product) => {
      try {
        const isDuplicate = await checkDuplicate(product, index, config)
        if (isDuplicate) {
          skippedCount++
          return
        }

        // Product doesn't exist in either database, create it in both
        const created = await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
          },
        })

        const vector = await openaiService.generateEmbedding(
          `${created.name} ${created.description}`,
          config.embeddingModel
        )

        await index.upsert([
          {
            id: created.id?.toString(),
            values: vector,
            metadata: {
              name: created.name,
              description: created.description,
              price: created.price ?? 0,
              embeddingModel: config.embeddingModel,
            },
          },
        ])

        console.log(`Imported: ${created.name}`)
        importedCount++
      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error)
      }
    })

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // Convert to seconds

    console.log(`
Import Summary for ${config.indexName} with model ${config.embeddingModel}:
- Total products processed: ${products.length}
- Successfully imported in both databases: ${importedCount}
- Succesfully imported in one database: ${syncedCount}
- Total duration: ${duration.toFixed(2)} seconds
- Average time per product: ${(duration / products.length).toFixed(2)} seconds
    `)
  } catch (error) {
    console.error('Error importing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function checkDuplicate(
  product: {
    name: string
    description: string
    price: number
  },
  index: any,
  config: ImportConfig
) {
  // Check in relational database
  const existingProduct = await prisma.product.findFirst({
    where: {
      name: product.name,
      description: product.description,
      price: product.price,
    },
  })

  // Check in vector database using vector query with high similarity threshold
  const vector = await openaiService.generateEmbedding(
    `${product.name} ${product.description}`,
    config.embeddingModel
  )

  const queryResponse = await index.query({
    vector,
    topK: 1,
    includeMetadata: true,
    filter: {
      price: product.price,
    },
  })

  const matches = queryResponse.matches || []
  const vectorMatch = matches.length > 0 ? matches[0] : null
  const vectorMetadata = vectorMatch?.metadata as
    | { name: string; description: string; price: number }
    | undefined

  // Verify exact match of name and description
  const isExactMatch =
    vectorMatch &&
    vectorMetadata?.name === product.name &&
    vectorMetadata?.description === product.description

  // If product exists in relational DB but not in vector DB, add it to vector DB
  if (existingProduct && !isExactMatch) {
    console.log(
      `Product exists in relational DB but not in vector DB: ${product.name}`
    )
    const vector = await openaiService.generateEmbedding(
      `${existingProduct.name} ${existingProduct.description}`,
      config.embeddingModel
    )

    await index.upsert([
      {
        id: existingProduct.id?.toString(),
        values: vector,
        metadata: {
          name: existingProduct.name,
          description: existingProduct.description,
          price: existingProduct.price ?? 0,
          embeddingModel: config.embeddingModel,
        },
      },
    ])
    console.log(`Added to vector DB: ${existingProduct.name}`)
    return true
  }

  // If product exists in vector DB but not in relational DB, add it to relational DB
  if (!existingProduct && isExactMatch) {
    console.log(
      `Product exists in vector DB but not in relational DB: ${product.name}`
    )
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
      },
    })
    console.log(`Added to relational DB: ${product.name}`)
    return true
  }

  // If product exists in both DBs, it's a duplicate
  if (existingProduct && isExactMatch) {
    console.log(`Product exists in both databases: ${product.name}`)
    return true
  }

  // Product doesn't exist in either database
  return false
}

async function ensureIndexExists(indexName: string, dimension: number = 1536) {
  try {
    // List all indexes
    const indexes = await pinecone.listIndexes()

    // Check if our index exists
    const indexExists =
      indexes.indexes?.some(
        (index: { name: string }) => index.name === indexName
      ) ?? false

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
