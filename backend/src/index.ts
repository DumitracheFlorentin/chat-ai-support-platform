import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './lib/prisma'

import productRoutes from './routes/products.routes'
import chatRoutes from './routes/chat.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Health Check
app.get('/', async (req, res) => {
  try {
    await prisma.$connect()
    res.send('Database connected and API is running...')
  } catch (error) {
    console.error('Database connection failed', error)
    res.status(500).send('Database connection failed')
  }
})

// Mount products API
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/chat', chatRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
