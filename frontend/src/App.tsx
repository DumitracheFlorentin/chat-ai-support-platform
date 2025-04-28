import { Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout'
import Products from './pages/Products'
import ApiKeys from './pages/ApiKeys'
import Chat from './pages/Chat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<Products />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  )
}

export default App
