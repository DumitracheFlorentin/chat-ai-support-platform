import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import dotenv from 'dotenv'

dotenv.config()

// OpenAI API Key validation
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

// Chat Models Configuration
export const chatModels = {
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
}

// Embeddings Models Configuration
export const embeddingModels = {
  ada002: new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),

  embedding3Large: new OpenAIEmbeddings({
    modelName: 'text-embedding-3-large',
    openAIApiKey: process.env.OPENAI_API_KEY,
  }),
}

// Helper function to get a chat model by name
export const getChatModel = (modelName: keyof typeof chatModels) => {
  return chatModels[modelName]
}

// Helper function to get an embedding model by name
export const getEmbeddingModel = (modelName: keyof typeof embeddingModels) => {
  return embeddingModels[modelName]
}
