import { Router } from 'express'

import {
  getMessagesByChatId,
  editTitleByChatId,
  deleteChatById,
  getAllChats,
  createChat,
} from '../controllers/chat.controller'

const router = Router()

router.get('/:id/messages', getMessagesByChatId)
router.put('/:id', editTitleByChatId)
router.delete('/:id', deleteChatById)
router.post('/', createChat)
router.get('/', getAllChats)

export default router
