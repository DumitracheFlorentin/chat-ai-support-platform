import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'

import type { Payment } from './columns'

export default function Table() {
  const [data, setData] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  async function getData(): Promise<Payment[]> {
    return [
      {
        id: '728ed52f',
        amount: 100,
        status: 'pending',
        email: 'm@example.com',
      },
      {
        id: 'b2c3d4e5',
        amount: 200,
        status: 'processing',
        email: 'test@gmail.com',
      },
    ]
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getData()
        setData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-1">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
