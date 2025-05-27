import { Toaster } from '@/components/ui/sonner'
import { Outlet } from 'react-router-dom'

import Navigation from '../core/Navigation'

function Layout() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex flex-col w-full min-h-screen p-2.5 sm:p-5 max-w-7xl">
        <Navigation />

        <main className="flex flex-grow  flex-col my-5 h-full mx-4">
          <Outlet />
        </main>

        <p className="px-10 text-center text-xs text-gray-500">
          Copyright © {new Date().getFullYear()} Dumitrache Florentin-Cristian.
          All rights reserved.
        </p>
      </div>

      <Toaster richColors />
    </div>
  )
}

export default Layout
