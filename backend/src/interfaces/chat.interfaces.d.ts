// openai

export interface ChatCompletionRequestMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  name?: string
}

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'gemini'
  maxTokens?: number
  temperature?: number
}

export interface ChatWithAIRequest {
  question: string
  model: string
}
