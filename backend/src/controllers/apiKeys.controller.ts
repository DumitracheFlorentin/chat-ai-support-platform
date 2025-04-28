import { RequestHandler } from 'express'

import * as apiKeysService from '../services/apiKeys.service'

export const createApiKey: RequestHandler = async function (req, res) {
  try {
    const { owner, name } = req.body

    const apiKey = await apiKeysService.createApiKey(name, owner)

    res.status(201).json({
      success: true,
      apiKey,
    })
  } catch (error) {
    console.error('Error creating API Key:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export const getAllApiKeys: RequestHandler = async function (req, res) {
  try {
    const apiKeys = await apiKeysService.getAllApiKeys()

    res.status(200).json({
      success: true,
      apiKeys,
    })
  } catch (error) {
    console.error('Error fetching API Keys:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export const deleteApiKey: RequestHandler = async function (req, res) {
  try {
    const { id } = req.params

    await apiKeysService.deleteApiKey(id)

    res.status(200).json({
      success: true,
      message: 'API Key deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting API Key:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
