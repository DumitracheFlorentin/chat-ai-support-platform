import cors from 'cors'

const allowedOriginsDev = ['http://localhost:5173', 'http://127.0.0.1:5173']
const allowedOriginsStaging = ['']
const allowedOriginsProd = ['']

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    let allowedOrigins: string[]

    switch (process.env.NODE_ENV) {
      case 'production':
        allowedOrigins = allowedOriginsProd
        break
      case 'staging':
        allowedOrigins = allowedOriginsStaging
        break
      default:
        allowedOrigins = allowedOriginsDev
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
})
