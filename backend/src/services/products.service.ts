import * as productsInterfaces from '../interfaces/products.interfaces'
import * as langchainService from './partners/langchain.service'
import {
  pineconeIndexes,
  deleteProductFromPinecone,
  updateProductInPinecone,
} from './partners/pinecone.service'
import prisma from '../lib/prisma'

export async function createProduct(
  data: productsInterfaces.CreateProductDTO
): Promise<productsInterfaces.Product> {
  const product = await prisma.product.create({ data })

  const combinedText = `${product.name} ${product.description}`

  const ada002Vector = await langchainService.generateEmbedding(
    combinedText,
    'ada002'
  )
  const embedding3LargeVector = await langchainService.generateEmbedding(
    combinedText,
    'embedding3Large'
  )
  const gemini001Vector = await langchainService.generateEmbedding(
    combinedText,
    'gemini001'
  )

  await Promise.all([
    // Save to ada002 database
    pineconeIndexes.ada002.upsert([
      {
        id: product.id.toString(),
        values: ada002Vector,
        metadata: {
          name: product.name,
          description: product.description,
          price: product.price ?? 0,
        },
      },
    ]),

    // Save to embedding3Large database
    pineconeIndexes.embedding3Large.upsert([
      {
        id: product.id.toString(),
        values: embedding3LargeVector,
        metadata: {
          name: product.name,
          description: product.description,
          price: product.price ?? 0,
        },
      },
    ]),

    // Save to gemini001 database
    pineconeIndexes.gemini001.upsert([
      {
        id: product.id.toString(),
        values: gemini001Vector,
        metadata: {
          name: product.name,
          description: product.description,
          price: product.price ?? 0,
        },
      },
    ]),
  ])

  console.log('Product created and saved to Pinecone')

  return product
}

export async function getAllProducts(
  limit: number,
  skip: number
): Promise<productsInterfaces.Product[]> {
  return prisma.product.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTotalProductsCount(): Promise<number> {
  return prisma.product.count()
}

export async function getTotalProductsCountThisMonth(): Promise<number> {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
  return prisma.product.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })
}

export async function getTotalProductsCountThisWeek(): Promise<number> {
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return prisma.product.count({
    where: {
      createdAt: {
        gte: startOfWeek,
      },
    },
  })
}

export async function getProductById(
  id: number
): Promise<productsInterfaces.Product | null> {
  return prisma.product.findUnique({
    where: { id },
  })
}

export async function updateProduct(
  id: number,
  data: productsInterfaces.UpdateProductDTO
): Promise<productsInterfaces.Product> {
  console.log(`Updating product with database ID: ${id}`)

  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
  })

  console.log(
    `Product updated in database, now updating in Pinecone with ID: ${updatedProduct.id}`
  )

  await updateProductInPinecone(
    updatedProduct.id,
    updatedProduct.name,
    updatedProduct.description,
    updatedProduct.price ?? 0
  )

  return updatedProduct
}

export async function deleteProduct(
  id: number
): Promise<productsInterfaces.Product> {
  console.log(`Deleting product with database ID: ${id}`)

  const product = await prisma.product.delete({
    where: { id },
  })

  console.log(
    `Product deleted from database, now deleting from Pinecone with ID: ${product.id}`
  )

  await deleteProductFromPinecone(product.id)

  return product
}
