import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Products() {
  // get all products
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  async function fetchProducts() {
    try {
      const productsResponse = await api.get('/products', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (productsResponse.status === 200) {
        setProducts(productsResponse?.data?.products)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-10 h-full">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Products</h1>
      </header>
    </div>
  )
}
