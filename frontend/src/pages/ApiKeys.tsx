import { Plus } from 'lucide-react'
import { useState } from 'react'

import { useApiKeyStore } from '../store/apiKeyStore'

import ApiKeyTable from '../components/features/apiKeys/ApiKeyTable'
import AddApiKey from '../components/features/apiKeys/AddApiKey'

import { Button } from '@/components/ui/button'

export default function ApiKeys() {
  const setApiKey = useApiKeyStore((state) => state.setApiKey)
  const apiKey = useApiKeyStore((state) => state.apiKey)

  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="py-10 h-full">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">API Key</h1>
        {!apiKey && (
          <Button
            className="text-[0.75rem] sm:text-base cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Plus /> Create API key
          </Button>
        )}
      </header>

      {apiKey ? (
        <ApiKeyTable apiKey={apiKey} setApiKey={setApiKey} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl sm:text-3xl font-medium mb-1">
            No API keys found
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Create an API key to get started
          </p>
        </div>
      )}

      <AddApiKey
        {...{
          open,
          setOpen,
          setApiKey,
        }}
      />
    </div>
  )
}
