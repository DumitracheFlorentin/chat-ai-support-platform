import OpenAI from 'openai'
import dotenv from 'dotenv'

import * as chatInterfaces from '../../interfaces/chat.interfaces'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function generateEmbedding(
  text: string,
  model: string = 'text-embedding-ada-002'
): Promise<number[]> {
  const res = await openai.embeddings.create({
    model,
    input: text,
  })

  return res.data[0].embedding
}

export async function generateChatCompletion(
  messages: chatInterfaces.ChatCompletionRequestMessage[],
  model: string = 'gpt-3.5-turbo',
  temperature: number = 0.3
): Promise<string> {
  const res = await openai.chat.completions.create({
    model,
    messages,
    temperature,
  })

  return res?.choices?.[0]?.message?.content?.trim() as string
}
