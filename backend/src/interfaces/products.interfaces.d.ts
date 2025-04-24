export interface Product {
  id: number
  name: string
  description: string
  price: number | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductDTO {
  name: string
  description: string
  price?: number
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
}
