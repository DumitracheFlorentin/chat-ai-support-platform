import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bot, Boxes, LockKeyhole } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useApiKeyStore } from '@/store/apiKeyStore'
import { createApiInstance } from '@/services/api'

export default function Layout() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)

  const setApiKey = useApiKeyStore((state) => state.setApiKey)

  useEffect(() => {
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

    fetchApiKey()
  }, [setApiKey])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex flex-col background-white text-primary">
      <header className="py-6 flex justify-center items-center text-2xl font-medium border-b border-divider">
        Chat AI Support Platform
      </header>

      <div className="flex flex-1">
        <aside className="w-[17rem] p-6 border-r">
          <nav className="flex flex-col space-y-2">
            <SidebarLink
              to="/products"
              label="Products"
              Icon={Boxes}
              pathname={pathname}
            />
            <SidebarLink
              to="/chat"
              label="Chat"
              Icon={Bot}
              pathname={pathname}
            />
            <SidebarLink
              to="/api-keys"
              label="API Keys"
              Icon={LockKeyhole}
              pathname={pathname}
            />
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-[#FAFAFA]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarLink({
  to,
  label,
  Icon,
  pathname,
}: {
  to: string
  label: string
  Icon: any
  pathname: string
}) {
  const isActive = pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center font-medium px-2 py-1 ${
        isActive ? 'bg-gray-900/5 rounded-sm text-blue-700/80' : 'text-gray-900'
      }`}
    >
      <Icon
        className={`inline-block mr-4 ${
          isActive ? 'text-blue-700/80' : 'text-icon-primary'
        }`}
        size={22}
      />
      <p className="mb-0.5">{label}</p>
    </Link>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg
        className="animate-spin h-10 w-10 text-gray-200"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </svg>
    </div>
  )
}
