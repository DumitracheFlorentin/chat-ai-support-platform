import { Router } from 'express'

import {
  saveMessageByChatId,
  editTitleByChatId,
  getAllMessagesAndChats,
  deleteChatById,
  getAllChats,
  createChat,
  chatWithAI,
} from '../controllers/chat.controller'

const router = Router()

router.post('/:id/messages/question', saveMessageByChatId)
router.get('/count', getAllMessagesAndChats)
router.post('/:id/messages', chatWithAI)
router.put('/:id', editTitleByChatId)
router.delete('/:id', deleteChatById)
router.post('/', createChat)
router.get('/', getAllChats)

export default router
