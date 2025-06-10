import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

import * as chatInterfaces from '../../interfaces/chat.interfaces'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateChatCompletion(
  messages: chatInterfaces.ChatCompletionRequestMessage[],
  model: string = 'gemini-1.0-pro',
  temperature: number = 0.3
): Promise<string> {
  const geminiModel = genAI.getGenerativeModel({ model })

  // Convert OpenAI-style messages to Gemini format
  const prompt = messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join('\n')

  const result = await geminiModel.generateContent(prompt)
  const response = await result.response
  return response.text()
} 