import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import apiRequest from '@/api/apiRequest'

import Loading from '../components/core/Loading'
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from '@/components/ui/card'

export default function Dashboard() {
  const [productData, setProductData] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
  })

  const [chatData, setChatData] = useState({
    threads: 0,
    messages: 0,
  })

  const [loading, setLoading] = useState(true)

  async function fetchData() {
    try {
      const [
        productsCountTotal,
        productsCountThisMonth,
        productsCountThisWeek,
        chatsCountTotal,
        chatsCountMessages,
      ] = await Promise.all([
        apiRequest('/products/count/total'),
        apiRequest('/products/count/this-month'),
        apiRequest('/products/count/this-week'),
        apiRequest('/chats/count/total'),
        apiRequest('/chats/count/messages'),
      ])

      setChatData({
        threads: chatsCountTotal?.chats?.length || 0,
        messages: chatsCountMessages?.count,
      })

      setProductData({
        total: productsCountTotal?.total,
        thisMonth: productsCountThisMonth?.total,
        thisWeek: productsCountThisWeek?.total,
      })
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="mt-5">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      <div className="my-10">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl tracking-tight transition-colors first:mt-0">
              Products
            </h2>
            <div className="mt-5 flex flex-wrap gap-4">
              <Card className="w-full lg:w-[375px]">
                <CardHeader>
                  <CardTitle>Total</CardTitle>
                  <CardDescription>
                    View and manage all products.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">{productData?.total}</p>
                </CardContent>
              </Card>

              <Card className="w-full lg:w-[375px]">
                <CardHeader>
                  <CardTitle>Added This Month</CardTitle>
                  <CardDescription>
                    View products added in the this month.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">{productData?.thisMonth}</p>
                </CardContent>
              </Card>

              <Card className="w-full lg:w-[375px]">
                <CardHeader>
                  <CardTitle>Added This Week</CardTitle>
                  <CardDescription>
                    View products added in the this week.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">{productData?.thisWeek}</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <div className="my-10">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl tracking-tight transition-colors first:mt-0">
          Chat Messages
        </h2>

        {loading ? (
          <Loading />
        ) : (
          <div className="mt-5 flex flex-wrap gap-4">
            <Card className="w-full lg:w-[375px]">
              <CardHeader>
                <CardTitle>Threads</CardTitle>
                <CardDescription>
                  View and manage all chat threads.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{chatData?.threads}</p>
              </CardContent>
            </Card>

            <Card className="w-full lg:w-[375px]">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  View total messages from all threads.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{chatData?.messages}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
