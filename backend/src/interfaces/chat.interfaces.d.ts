// openai

export interface ChatCompletionRequestMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  name?: string
}

export interface AIModel {
  id: string
  name: string
  provider: 'openai'
  temperature: number
}

export interface ChatWithAIRequest {
  question: string
  model: string
  language?: string
  embeddingModel?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  language?: string
}

export interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
  preferredLanguage?: string
}

export interface Language {
  code: string
  name: string
  nativeName: string
  modelName: string
  isRTL: boolean
}
