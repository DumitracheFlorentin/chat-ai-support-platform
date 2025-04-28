import { create } from 'zustand'

interface ApiKeyState {
  apiKey: undefined
  setApiKey: (key: string) => void
  clearApiKey: () => void
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  apiKey: undefined,
  setApiKey: (key: any) => set({ apiKey: key }),
  clearApiKey: () =>
    set({
      apiKey: undefined,
    }),
}))
