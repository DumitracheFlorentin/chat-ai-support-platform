import { useState } from 'react'
import { Plus } from 'lucide-react'

import { useApiKeyStore } from '../store/apiKeyStore'
import { CreateApiKey } from '@/components/pages/apiKeys/CreateApiKey'
import ApiKeyTable from '@/components/pages/apiKeys/ApiKeyTable'

import { Button } from '@/components/ui/button'

export default function ApiKeys() {
  const apiKey = useApiKeyStore((state) => state.apiKey)
  const setApiKey = useApiKeyStore((state) => state.setApiKey)

  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="p-10 h-full">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">API Key</h1>
        {!apiKey && (
          <Button
            className="text-base cursor-pointer"
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
          <h2 className="text-3xl font-medium mb-1">No API keys found</h2>
          <p className="text-gray-500">Create an API key to get started</p>
        </div>
      )}

      <CreateApiKey
        {...{
          open,
          setOpen,
          setApiKey,
        }}
      />
    </div>
  )
}
