import { Router } from 'express'

import { createApiKey } from '../controllers/apiKeys.controller'

const router = Router()

router.post('/', createApiKey)

export default router
