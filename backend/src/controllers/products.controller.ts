import { Request, Response } from 'express'

import * as productsInterfaces from '../interfaces/products.interfaces'
import * as productsServices from '../services/products.service'

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price } =
      req.body as productsInterfaces.CreateProductDTO

    const product = await productsServices.createProduct({
      name,
      description,
      price,
    })
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await productsServices.getAllProducts()
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params

    const product = await productsServices.getProductById(Number(id))

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' })
      return
    }

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params
    const data = req.body as productsInterfaces.UpdateProductDTO

    const updatedProduct = await productsServices.updateProduct(
      Number(id),
      data
    )
    res.status(200).json({ success: true, data: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params

    await productsServices.deleteProduct(Number(id))
    res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
