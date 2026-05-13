import { create } from 'zustand'

type ApiKeysState = {
  keys: Record<string, string> // provider → key
  setKey: (provider: string, key: string) => void
  getKey: (provider: string) => string | undefined
  hasKey: (provider: string) => boolean
  clearKey: (provider: string) => void
}

export const useApiKeysStore = create<ApiKeysState>((set, get) => ({
  keys: {},
  setKey: (provider, key) =>
    set((s) => ({ keys: { ...s.keys, [provider]: key } })),
  getKey: (provider) => get().keys[provider],
  hasKey: (provider) => Boolean(get().keys[provider]),
  clearKey: (provider) =>
    set((s) => {
      const next = { ...s.keys }
      delete next[provider]
      return { keys: next }
    }),
}))