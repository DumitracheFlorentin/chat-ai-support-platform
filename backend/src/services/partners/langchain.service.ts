import {
  getChatModel,
  getEmbeddingModel,
} from '../../config/ai/langchain.config'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { pineconeIndexes } from './pinecone.service'

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

  // Generate embedding using LangChain
  const embedding = await generateEmbedding(question, embeddingModel)
  console.log('Generated embedding length:', embedding.length)

  // Get the appropriate Pinecone index based on the embedding model
  const pineconeIndex = pineconeIndexes[embeddingModel]
  console.log('Using Pinecone index:', embeddingModel)

  // Query Pinecone
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
