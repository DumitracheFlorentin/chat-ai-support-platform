import fs from 'fs/promises'
import path from 'path'

import { PrismaClient } from '@prisma/client'
import * as openaiService from '../services/partners/openai.service'
import pinecone from '../services/partners/pinecone.service'

const prisma = new PrismaClient()

async function importProducts() {
  try {
    console.log('Reading products from JSON...')
    const filePath = path.resolve(
      __dirname,
      'data',
      'electronics_products_detailed.json'
    )
    const file = await fs.readFile(filePath, 'utf-8')
    const products = JSON.parse(file)

    for (const product of products) {
      const created = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
        },
      })

      const vector = await openaiService.generateEmbedding(
        `${created.name} ${created.description}`
      )

      const index = pinecone.index(process.env.PINECONE_INDEX_NAME!)

      await index.upsert([
        {
          id: created.id?.toString(),
          values: vector,
          metadata: {
            name: created.name,
            description: created.description,
            price: created.price ?? 0,
          },
        },
      ])

      console.log(`Imported: ${created.name}`)
    }

    console.log('All products imported successfully.')
  } catch (error) {
    console.error('Error importing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importProducts()
