import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bot, Boxes, LockKeyhole } from 'lucide-react'

export default function Layout() {
  const { pathname } = useLocation()

  console.log(pathname)

  return (
    <div className="min-h-screen flex flex-col background-white text-primary">
      <header className="py-6 flex justify-center items-center text-2xl font-medium border-b border-divider">
        Chat AI Support Platform
      </header>

      <div className="flex flex-1">
        <aside className="w-[17rem] p-6 border-r">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/products"
              className={`flex items-center font-medium px-2 py-1 ${
                pathname === '/products'
                  ? 'bg-secondary/10 rounded-sm text-blue/75'
                  : 'text-gray-900'
              }`}
            >
              <Boxes
                className={`inline-block mr-4  ${
                  pathname === '/products'
                    ? 'text-blue/75'
                    : 'text-icon-primary'
                }`}
                size={22}
              />
              <p className="mb-0.5">Products</p>
            </Link>

            <Link
              to="/chat"
              className={`flex items-center font-medium px-2 py-1 ${
                pathname === '/chat'
                  ? 'bg-secondary/10 rounded text-blue/75'
                  : 'text-gray-900'
              }`}
            >
              <Bot
                className={`inline-block mr-4  ${
                  pathname === '/chat' ? 'text-blue/75' : 'text-icon-primary'
                }`}
                size={22}
              />
              <p className="mb-0.5">Chat</p>
            </Link>

            <Link
              to="/api-keys"
              className={`flex items-center font-medium px-2 py-1 ${
                pathname === '/api-keys'
                  ? 'bg-secondary/10 rounded text-blue/75'
                  : 'text-gray-900'
              }`}
            >
              <LockKeyhole
                className={`inline-block mr-4  ${
                  pathname === '/api-keys'
                    ? 'text-blue/75'
                    : 'text-icon-primary'
                }`}
                size={22}
              />
              <p className="mb-0.5">API keys</p>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-background-gray">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
