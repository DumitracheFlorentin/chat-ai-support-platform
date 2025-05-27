import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'

import productRoutes from './routes/products.routes'
import chatRoutes from './routes/chat.routes'
import prisma from './lib/prisma'

import { rateLimiter } from './middlewares/rateLimiter.middleware'
import { corsMiddleware } from './middlewares/cors.middleware'

dotenv.config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(corsMiddleware)

app.get('/internal/health', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    res.status(403).json({ success: false, message: 'Access denied' })
    return
  }

  try {
    await prisma.$connect()
    res.send('Database connected and API is running...')
  } catch (error) {
    console.error('Database connection failed', error)
    res.status(500).send('Database connection failed')
  }
})

app.use('/api/v1/products', rateLimiter, productRoutes)
app.use('/api/v1/chats', rateLimiter, chatRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
