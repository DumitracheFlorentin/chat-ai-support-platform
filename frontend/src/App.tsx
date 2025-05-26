import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Layout from './components/layouts/layout'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Chat from './pages/Chat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
