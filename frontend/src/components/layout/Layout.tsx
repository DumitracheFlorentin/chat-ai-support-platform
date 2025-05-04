import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useApiKeyStore } from '@/store/apiKeyStore'
import { createApiInstance } from '@/services/api'

import Navigation from './Navigation'
import Loading from '../core/Loading'
import Footer from './Footer'

export default function Layout() {
  const setApiKey = useApiKeyStore((state) => state.setApiKey)

  const [loading, setLoading] = useState(true)

  async function fetchApiKey() {
    try {
      const apiNoInterceptors = createApiInstance(false)

      const response = await apiNoInterceptors.get('/api-keys', {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 200 && response.data.apiKeys?.length > 0) {
        setApiKey(response.data.apiKeys[0])
      }
    } catch (error) {
      toast.error(`Failed to fetch API key: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiKey()
  }, [setApiKey])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container p-6  mx-auto min-h-screen bg-[#fafafa46] flex flex-col background-white text-primary">
      <Navigation />

      <div className="flex flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}
