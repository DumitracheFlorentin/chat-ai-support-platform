import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function askOpenAI(question: string): Promise<string> {
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
    temperature: 0.7,
  })

  return chatCompletion?.choices?.[0]?.message?.content?.trim() || ''
}
