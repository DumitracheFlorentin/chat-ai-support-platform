import { Router } from 'express'

import {
  createApiKey,
  getAllApiKeys,
  deleteApiKey,
} from '../controllers/apiKeys.controller'

const router = Router()

router.post('/', createApiKey)
router.get('/', getAllApiKeys)
router.delete('/:id', deleteApiKey)

export default router
