import prisma from '../lib/prisma'
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../interfaces/products.interfaces'

export async function createProduct(data: CreateProductDTO): Promise<Product> {
  return await prisma.product.create({ data })
}

export async function getAllProducts(): Promise<Product[]> {
  return await prisma.product.findMany()
}

export async function getProductById(id: number): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: { id },
  })
}

export async function updateProduct(
  id: number,
  data: UpdateProductDTO
): Promise<Product> {
  return await prisma.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(id: number): Promise<Product> {
  return await prisma.product.delete({
    where: { id },
  })
}
