import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import productRoutes from './routes/products.routes'
import apiKeysRoutes from './routes/apiKeys.routes'
import chatRoutes from './routes/chat.routes'
import prisma from './lib/prisma'

import { rateLimiter } from './middlewares/rateLimiter.middleware'
import { apiKeyAuth } from './middlewares/apiKey.middleware'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  try {
    await prisma.$connect()
    res.send('Database connected and API is running...')
  } catch (error) {
    console.error('Database connection failed', error)
    res.status(500).send('Database connection failed')
  }
})

app.use('/api/v1/products', apiKeyAuth, rateLimiter, productRoutes)
app.use('/api/v1/api-keys', rateLimiter, apiKeysRoutes)
app.use('/api/v1/chat', apiKeyAuth, rateLimiter, chatRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
