import type { AIModel } from '@/types/chat'

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    temperature: 0.3,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    temperature: 0.3,
  },
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    temperature: 0.3,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    temperature: 0.3,
  },
  {
    id: 'gemini-1.0-pro',
    name: 'Gemini Pro',
    provider: 'gemini',
    temperature: 0.3,
  },
]

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id)
}

export function getDefaultModel(): AIModel {
  return AI_MODELS[0]
} 