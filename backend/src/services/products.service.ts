import prisma from '../lib/prisma'
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../interfaces/products.interfaces'
import { generateEmbedding } from './embedding.service'
import pinecone from './pinecone.service'

export async function createProduct(data: CreateProductDTO): Promise<Product> {
  const product = await prisma.product.create({ data })

  const combinedText = `${product.name} ${product.description}`
  const vector = await generateEmbedding(combinedText)

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

export async function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany()
}

export async function getProductById(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  })
}

export async function updateProduct(
  id: number,
  data: UpdateProductDTO
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(id: number): Promise<Product> {
  return prisma.product.delete({
    where: { id },
  })
}
