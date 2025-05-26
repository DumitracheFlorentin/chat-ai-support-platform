import { useEffect, useState } from 'react'

import type { Product } from './columns'
import { DataTable } from './data-table'
import { columns as productColumns } from './columns'

import apiRequest from '@/api/apiRequest'

export default function Table() {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData(): Promise<void> {
    try {
      const response = await apiRequest('/products?limit=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response?.success) {
        throw new Error('No data received from the API')
      }

      setData(response?.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div className="container mx-auto py-1">Loading...</div>
  }

  return (
    <DataTable
      columns={productColumns({ refetch: fetchData })}
      data={data}
      refetch={fetchData}
    />
  )
}
