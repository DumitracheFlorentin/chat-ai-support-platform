import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { pineconeIndexes } from './pinecone.service'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables')
}

const chatModels = {
  gpt35Turbo: new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  gpt4: new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  gpt4Turbo: new ChatOpenAI({
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  gpt4o: new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  geminiPro: new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-pro',
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
  }),
}

const embeddingModels = {
  ada002: new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  embedding3Large: new OpenAIEmbeddings({
    modelName: 'text-embedding-3-large',
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  gemini001: new GoogleGenerativeAIEmbeddings({
    modelName: 'models/embedding-001',
    apiKey: process.env.GOOGLE_API_KEY,
  }),
}

const getChatModel = (modelName: keyof typeof chatModels) => {
  return chatModels[modelName]
}

const getEmbeddingModel = (modelName: keyof typeof embeddingModels) => {
  return embeddingModels[modelName]
}

export type EmbeddingModelType = 'ada002' | 'embedding3Large' | 'gemini001'

export async function generateEmbedding(
  text: string,
  embeddingModel: EmbeddingModelType = 'ada002'
) {
  const model = getEmbeddingModel(embeddingModel)
  return model.embedQuery(text)
}

export async function generateChatCompletion(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  modelName: string = 'gpt35Turbo',
  temperature: number = 0.7
) {
  const chatModel = getChatModel(modelName as any)

  const langchainMessages = messages.map((msg) => {
    if (msg.role === 'system') {
      return new SystemMessage(msg.content)
    }
    return new HumanMessage(msg.content)
  })

  const response = await chatModel.invoke(langchainMessages)
  return response.content.toString()
}

export async function askWithContext(
  question: string,
  modelName: string = 'gpt35Turbo',
  embeddingModel: EmbeddingModelType = 'ada002'
): Promise<string> {
  console.log('Starting askWithContext with:', {
    question,
    modelName,
    embeddingModel,
  })

  const embedding = await generateEmbedding(question, embeddingModel)
  console.log('Generated embedding length:', embedding.length)

  const pineconeIndex = pineconeIndexes[embeddingModel]
  console.log('Using Pinecone index:', embeddingModel)

  const queryResponse = await pineconeIndex.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  })
  console.log(
    'Pinecone query response matches:',
    queryResponse.matches?.length || 0
  )

  const matchedProducts = queryResponse.matches || []
  console.log('First matched product:', matchedProducts[0]?.metadata)

  const context = matchedProducts
    .slice(0, 10)
    .map((match, i) => {
      const m = match.metadata as {
        name: string
        description: string
        price?: number
        image?: string
      }
      return `{
  "name": "${m.name}",
  "description": "${m.description}",
  "price": ${m.price ?? null},
  "image": "${m.image ?? ''}"
}`
    })
    .join(',\n')

  // Build the context as a JSON array string
  const contextJson = `[\n${context}\n]`
  console.log('Context JSON preview:', contextJson.substring(0, 200))

  const messages = [
    {
      role: 'system' as const,
      content: `You are an AI assistant for an online electronics store. You are given a list of products as a JSON array.

Your task is to return a JSON array of products from the list that are likely to match the user's request, even if not all details are present. Be helpful and flexible: if a product seems relevant, include it. If no products match, return an empty array [].

IMPORTANT:
- Respond ONLY with a valid JSON array. Do not include any other text, explanation, or markdown. Do not say anything else.
- If you are unsure, include products that are close matches.

Example:
User: Show me laptops with 16GB RAM and 512GB SSD.
Response: [
  { "name": "Example Laptop 1", "description": "A laptop with 16GB RAM and 512GB SSD.", "price": 1200 },
  { "name": "Example Laptop 2", "description": "A gaming laptop with 16GB RAM and 1TB SSD.", "price": 1500 }
]

Here is the product list:
${contextJson}`,
    },
    {
      role: 'user' as const,
      content: question,
    },
  ]

  try {
    const response = await generateChatCompletion(messages, modelName)
    console.log('LLM Response:', response)
    return response
  } catch (error) {
    console.error('Error from LLM:', error)
    throw error
  }
}
