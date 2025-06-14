export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'gemini'
  temperature: number
}
