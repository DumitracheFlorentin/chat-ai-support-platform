import { translateToEnglish } from './translation.service'
import { generateEmbedding } from './embedding.service'
import { pineconeIndex } from './pinecone.service'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function askWithContext(question: string): Promise<string> {
  const translatedQuestion = await translateToEnglish(question, 'ron_Latn')
  const embedding = await generateEmbedding(translatedQuestion)

  const queryResponse = await pineconeIndex.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  })

  const matchedProducts = queryResponse.matches || []

  const context = matchedProducts
    .map((match, i) => {
      const m = match.metadata as {
        name: string
        description: string
        price?: number
      }
      return `Product: ${i + 1}: ${m.name} - ${m.description}${
        m.price ? ` (price: ${m.price} RON)` : ''
      }`
    })
    .join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant for an online store. You have access ONLY to the list of products below.

        You are NOT allowed to invent products, specifications, or prices. Do NOT provide general answers if the information is not in the list.

        If the question cannot be answered based on the product list, reply exactly with: "I'm sorry, I don't have enough information to answer that."

        Use a clear, concise, and friendly tone.

        Product list:\n\n${context}`,
      },
      {
        role: 'user',
        content: question,
      },
    ],
    temperature: 0.3,
  })

  return completion?.choices?.[0]?.message?.content?.trim() || ''
}
