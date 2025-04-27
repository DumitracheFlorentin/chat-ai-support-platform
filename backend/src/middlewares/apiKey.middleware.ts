import { RequestHandler, Request, NextFunction } from 'express'
import prisma from '../lib/prisma'

export const apiKeyAuth: RequestHandler = (
  req: Request,
  res: any,
  next: NextFunction
) => {
  const apiKey = req.header('x-api-key')

  if (!apiKey) {
    return res
      .status(401)
      .json({ success: false, message: 'API key is missing' })
  }

  prisma.apiKey
    .findUnique({
      where: { key: apiKey },
    })
    .then((existingKey) => {
      if (!existingKey) {
        return res
          .status(403)
          .json({ success: false, message: 'Invalid API key' })
      }

      if (!existingKey.active) {
        return res
          .status(403)
          .json({ success: false, message: 'API key is inactive' })
      }

      if (new Date() > existingKey.expiresAt) {
        return res
          .status(403)
          .json({ success: false, message: 'API key has expired' })
      }

      next()
    })
    .catch(() => {
      res.status(500).json({ success: false, message: 'Internal Server Error' })
    })
}
