import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'

export default function Navigation() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="flex items-center justify-between p-4">
      <Link to="/" className="text-lg text-gray-900 font-semibold">
        Chat AI Support Platform
      </Link>

      <ul className="hidden sm:flex space-x-4 mt-2">
        <li>
          <Link
            to="/"
            className={`${
              pathname === '/' ? 'underline' : ''
            } text-gray-800 text-lg`}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/products"
            className={`${
              pathname === '/products' ? 'underline' : ''
            } text-gray-800 text-lg`}
          >
            Products
          </Link>
        </li>

        <li>
          <Link
            to="/chat"
            className={`${
              pathname === '/chat' ? 'underline' : ''
            } text-gray-800 text-lg`}
          >
            Chat
          </Link>
        </li>
      </ul>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="sm:hidden">
          <Menu className="w-6 h-6 text-gray-900 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <div className="flex flex-col p-1">
            <Link
              to="/"
              className={`${
                pathname === '/' ? 'underline' : ''
              } p-1 text-sm text-gray-800`}
              onClick={() => setDropdownOpen(false)}
            >
              Dashboard
            </Link>
          </div>

          <div className="flex flex-col p-1">
            <Link
              to="/products"
              className={`${
                pathname === '/products' ? 'underline' : ''
              } p-1 text-sm text-gray-800`}
              onClick={() => setDropdownOpen(false)}
            >
              Products
            </Link>
          </div>

          <div className="flex flex-col p-1">
            <Link
              to="/chat"
              className={`${
                pathname === '/chat' ? 'underline' : ''
              } p-1 text-sm text-gray-800`}
              onClick={() => setDropdownOpen(false)}
            >
              Chat
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
