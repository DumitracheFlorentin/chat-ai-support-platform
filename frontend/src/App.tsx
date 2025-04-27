import { useEffect } from 'react'
import api from './services/api'

export default function App() {
  async function fetchProducts() {
    const response = await api.get('/products')
    return response.data
  }

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        console.log('Products:', data)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">
        Hello Tailwind v3 + React + Vite!
      </h1>
    </div>
  )
}
