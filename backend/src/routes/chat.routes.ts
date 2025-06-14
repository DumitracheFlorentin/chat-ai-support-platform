import { Router } from 'express'

import {
  getMessagesByChatId,
  saveMessageByChatId,
  editTitleByChatId,
  getAllMessages,
  deleteChatById,
  getAllChats,
  createChat,
  chatWithAI,
} from '../controllers/chat.controller'

const router = Router()

router.post('/:id/messages/question', saveMessageByChatId)
router.get('/:id/messages', getMessagesByChatId)
router.get('/count/messages', getAllMessages)
router.post('/:id/messages', chatWithAI)
router.get('/count/total', getAllChats)
router.put('/:id', editTitleByChatId)
router.delete('/:id', deleteChatById)
router.post('/', createChat)
router.get('/', getAllChats)

export default router
