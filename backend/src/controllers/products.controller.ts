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
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 5
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      productsServices.getAllProducts(limit, skip),
      productsServices.getTotalProductsCount(),
    ])

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
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
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function getTotalProductsCount(req: Request, res: Response) {
  try {
    const total = await productsServices.getTotalProductsCount()
    res.status(200).json({ success: true, total })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function getTotalProductsCountThisMonth(
  req: Request,
  res: Response
) {
  try {
    const total = await productsServices.getTotalProductsCountThisMonth()
    res.status(200).json({ success: true, total })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export async function getTotalProductsCountThisWeek(
  req: Request,
  res: Response
) {
  try {
    const total = await productsServices.getTotalProductsCountThisWeek()
    res.status(200).json({ success: true, total })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
