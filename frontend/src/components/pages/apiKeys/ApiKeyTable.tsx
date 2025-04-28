import { toast } from 'react-toastify'
import { Trash } from 'lucide-react'
import moment from 'moment'

import { createApiInstance } from '@/services/api'

import {
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from '@/components/ui/table'
import { useApiKeyStore } from '@/store/apiKeyStore'

export default function ApiKeyTable({
  apiKey,
  setApiKey,
}: {
  apiKey: any
  setApiKey: any
}) {
  const clearApiKey = useApiKeyStore((state) => state.clearApiKey)
  const apiNoInterceptors = createApiInstance(false)

  async function removeApiKeyHandler(id: string) {
    try {
      if (!confirm('Are you sure you want to delete this API key?')) {
        return
      }

      const response = await apiNoInterceptors.delete(`/api-keys/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        setApiKey(null)
        clearApiKey()
      } else {
        throw new Error('Failed to delete API key')
      }
    } catch (error) {
      toast.error(`Failed to delete API key: ${error}`)
    }
  }

  return (
    <Table className="mt-10 border border-slate-200 rounded-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-gray-500">Name</TableHead>
          <TableHead className="text-gray-500">Status</TableHead>
          <TableHead className="text-gray-500">Key</TableHead>
          <TableHead className="text-gray-500">Created At</TableHead>
          <TableHead className="text-gray-500">Expires At</TableHead>
          <TableHead className="text-gray-500">Owner</TableHead>
          <TableHead className="text-right text-gray-500 p-4">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key={apiKey.id}>
          <TableCell className="font-medium">{apiKey?.name}</TableCell>
          <TableCell
            className={`font-medium ${
              apiKey?.active ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {apiKey?.active ? 'Active' : 'Disabled'}
          </TableCell>
          <TableCell className="font-mono">{apiKey?.key}</TableCell>
          <TableCell>
            {moment(apiKey?.createdAt).format('YYYY-MM-DD')}
          </TableCell>
          <TableCell>
            {moment(apiKey?.expiresAt).format('YYYY-MM-DD')}
          </TableCell>
          <TableCell>{apiKey?.owner}</TableCell>
          <TableCell
            className="flex justify-end mr-4 p-4 cursor-pointer"
            onClick={() => removeApiKeyHandler(apiKey?.id)}
          >
            <Trash size={14} className="text-red-800" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
