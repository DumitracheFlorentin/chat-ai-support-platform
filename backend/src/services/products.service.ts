import * as productsInterfaces from '../interfaces/products.interfaces'
import * as openaiServices from './partners/openai.service'
import pinecone from './partners/pinecone.service'
import prisma from '../lib/prisma'

export async function createProduct(
  data: productsInterfaces.CreateProductDTO
): Promise<productsInterfaces.Product> {
  const product = await prisma.product.create({ data })

  const combinedText = `${product.name} ${product.description}`
  const vector = await openaiServices.generateEmbedding(combinedText)

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME!)

  await index.upsert([
    {
      id: product.id.toString(),
      values: vector,
      metadata: {
        name: product.name,
        description: product.description,
        price: product.price ?? 0,
      },
    },
  ])

  return product
}

export async function getAllProducts(): Promise<productsInterfaces.Product[]> {
  return prisma.product.findMany()
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
  return prisma.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(
  id: number
): Promise<productsInterfaces.Product> {
  return prisma.product.delete({
    where: { id },
  })
}
