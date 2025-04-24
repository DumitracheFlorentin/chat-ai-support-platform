import { Request, Response } from 'express'
import { askWithContext } from '../services/chat.service'

export async function chatWithAI(req: Request, res: Response) {
  try {
    const { question } = req.body

    if (!question || typeof question !== 'string') {
      res
        .status(400)
        .json({ success: false, message: 'Invalid or missing "question"' })
      return
    }

    const answer = await askWithContext(question)
    res.status(200).json({ success: true, answer })
  } catch (error) {
    console.error('Error in chatWithAI:', error)
    res
      .status(500)
      .json({ success: false, message: 'Failed to process question' })
  }
}
