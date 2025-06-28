import { Request, Response } from 'express'

import * as messageService from '../services/messages.service'
import * as chatService from '../services/chat.service'
import { getLanguageByCode, getDefaultLanguage } from '../config/languages'

export async function getAllMessagesAndChats(req: Request, res: Response) {
  try {
    const [messages, chats] = await Promise.all([
      messageService.getAllMessages(),
      chatService.getAllChats(),
    ])

    res.status(200).json({
      success: true,
      chats: chats.length,
      messages: messages.length,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load messages' })
  }
}

export async function saveMessageByChatId(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { question, language } = req.body

    const savedMessage = await messageService.saveMessage(
      id,
      'user',
      question,
      language
    )

    res.status(200).json({ success: true, message: savedMessage })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save message' })
  }
}

export async function createChat(req: Request, res: Response) {
  try {
    const chat = await chatService.createChat(req.body.title)
    res.status(201).json({ success: true, chat })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create chat' })
  }
}

export async function getMessagesByChatId(req: Request, res: Response) {
  try {
    const { id } = req.params
    const messages = await chatService.getMessagesByChatId(id)
    res.status(200).json({ success: true, messages })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load messages' })
  }
}

export async function getAllChats(req: Request, res: Response) {
  try {
    const chats = await chatService.getAllChats()
    res.status(200).json({ success: true, chats })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load chats' })
  }
}

export async function chatWithAI(req: Request, res: Response) {
  try {
    const { question, model, embeddingModel, language } = req.body

    if (!question || typeof question !== 'string') {
      res
        .status(400)
        .json({ success: false, message: 'Invalid or missing "question"' })
      return
    }

    // Validate and set default language
    const targetLanguage =
      language && getLanguageByCode(language)
        ? language
        : getDefaultLanguage().code

    const answer = await chatService.askWithContext(
      question,
      model,
      embeddingModel,
      targetLanguage
    )

    const savedAnswer = await messageService.saveMessage(
      req.params.id,
      'assistant',
      answer,
      targetLanguage
    )

    res.status(200).json({ success: true, answer: savedAnswer })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to process question' })
  }
}

export async function deleteChatById(req: Request, res: Response) {
  try {
    const { id } = req.params
    await chatService.deleteChatById(id)
    res
      .status(200)
      .json({ success: true, message: 'Chat deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete chat' })
  }
}

export async function editTitleByChatId(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { newTitle } = req.body

    if (!newTitle || typeof newTitle !== 'string') {
      res
        .status(400)
        .json({ success: false, message: 'Invalid or missing "newTitle"' })
      return
    }

    const updatedChat = await chatService.editTitleByChatId(id, newTitle)
    res.status(200).json({ success: true, chat: updatedChat })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update title' })
  }
}
