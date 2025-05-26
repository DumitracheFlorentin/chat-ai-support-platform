import { useState } from 'react'

import Navigation from '../components/features/products/Navigation'
import Table from '../components/features/products/table/page'
import Add from '../components/features/products/Add'

export default function Products() {
  const [currentScreen, setCurrentScreen] = useState('all')

  return (
    <div className="mt-5">
      <h1 className="text-3xl font-semibold text-gray-800">Products</h1>

      <Navigation
        setCurrentScreen={setCurrentScreen}
        currentScreen={currentScreen}
      />

      {currentScreen === 'all' ? <Table /> : <Add />}
    </div>
  )
}
