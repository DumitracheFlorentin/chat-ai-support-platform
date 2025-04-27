import { RequestHandler } from 'express'

import * as apiKeysService from '../services/apiKeys.service'

export const createApiKey: RequestHandler = async function (req, res) {
  try {
    const { owner } = req.body

    const apiKey = await apiKeysService.createApiKey(owner)

    res.status(201).json({
      success: true,
      apiKey,
    })
  } catch (error) {
    console.error('Error creating API Key:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
