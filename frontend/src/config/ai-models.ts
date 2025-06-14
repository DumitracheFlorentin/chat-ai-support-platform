import type { AIModel } from '@/types/chat'

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt35Turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    temperature: 0.7,
  },
  {
    id: 'gpt4',
    name: 'GPT-4',
    provider: 'openai',
    temperature: 0.7,
  },
  {
    id: 'gpt4Turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    temperature: 0.7,
  },
  {
    id: 'gpt4o',
    name: 'GPT-4o',
    provider: 'openai',
    temperature: 0.7,
  },
  {
    id: 'geminiPro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    temperature: 0.7,
  },
]

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id)
}

export function getDefaultModel(): AIModel {
  return AI_MODELS[0]
}
