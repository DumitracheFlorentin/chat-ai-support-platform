import { Bot, Boxes, LockKeyhole, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'

export default function Navigation() {
  const { pathname } = useLocation()

  const [isOpenDropdown, setIsOpenDropdown] = useState(false)

  const menu = [
    { name: 'Products', link: '/products' },
    { name: 'Chat', link: '/chat' },
    { name: 'API Keys', link: '/api-keys' },
  ]

  return (
    <header className="py-2 sm:py-6 flex justify-between items-center">
      <Link to="/products" className="font-medium text-lg">
        Chat AI Support Platform
      </Link>

      <nav className="hidden sm:flex items-center gap-6">
        <SidebarLink
          to="/products"
          label="Products"
          Icon={Boxes}
          pathname={pathname}
        />
        <SidebarLink to="/chat" label="Chat" Icon={Bot} pathname={pathname} />
        <SidebarLink
          to="/api-keys"
          label="API Keys"
          Icon={LockKeyhole}
          pathname={pathname}
        />
      </nav>

      <div className="flex sm:hidden items-center gap-6">
        <DropdownMenu open={isOpenDropdown} onOpenChange={setIsOpenDropdown}>
          <DropdownMenuTrigger>
            <Menu className="sm:hidden cursor-pointer" size={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col p-1">
              {menu.map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  onClick={() => setIsOpenDropdown(false)}
                  className="p-1 hover:cursor hover:bg-gray-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
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
      className={`flex items-center font-medium px-2 py-1 text-gray-900 ${
        isActive
          ? 'border-b border-gray-300'
          : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <Icon className="inline-block mr-4 text-icon-primary" size={22} />
      <p className="mb-0.5">{label}</p>
    </Link>
  )
}
