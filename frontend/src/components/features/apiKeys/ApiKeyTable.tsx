import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import { Trash } from 'lucide-react'
import moment from 'moment'

import { useApiKeyStore } from '@/store/apiKeyStore'
import { createApiInstance } from '@/services/api'

import {
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from '@/components/ui/table'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function ApiKeyTable({
  apiKey,
  setApiKey,
}: {
  apiKey: any
  setApiKey: any
}) {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const clearApiKey = useApiKeyStore((state) => state.clearApiKey)
  const apiNoInterceptors = createApiInstance(false)

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<Boolean>(false)

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

  if (isMobile) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{apiKey?.name}</CardTitle>
          <CardDescription
            className={`font-medium ${
              apiKey?.active ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {apiKey?.active ? 'Active' : 'Disabled'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="font-mono">{apiKey?.key}</p>
            <p className="text-gray-500">
              Created At: {moment(apiKey?.createdAt).format('YYYY-MM-DD')}
            </p>
            <p className="text-gray-500">
              Expires At: {moment(apiKey?.expiresAt).format('YYYY-MM-DD')}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash size={14} />
            <span className="ml-2">Delete</span>
          </Button>
        </CardFooter>
        <DeleteVerification
          showDeleteConfirmation={showDeleteConfirmation}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          apiKeyId={apiKey?.id}
          setApiKey={setApiKey}
          clearApiKey={clearApiKey}
        />
      </Card>
    )
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
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash size={14} className="text-red-800" />
          </TableCell>
        </TableRow>
      </TableBody>
      <DeleteVerification
        showDeleteConfirmation={showDeleteConfirmation}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
        apiKeyId={apiKey?.id}
        setApiKey={setApiKey}
        clearApiKey={clearApiKey}
      />
    </Table>
  )
}

function DeleteVerification({
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  apiKeyId,
  setApiKey,
  clearApiKey,
}: {
  showDeleteConfirmation: Boolean
  setShowDeleteConfirmation: (show: Boolean) => void
  apiKeyId: string
  setApiKey: (apiKey: any) => void
  clearApiKey: () => void
}) {
  const apiNoInterceptors = createApiInstance(false)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  async function removeApiKeyHandler(id: string) {
    try {
      await apiNoInterceptors.delete(`/api-keys/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setApiKey(null)
      clearApiKey()
    } catch (error) {
      toast.error(`Failed to delete API key: ${error}`)
    }
  }

  if (isMobile) {
    return (
      <Drawer
        open={
          showDeleteConfirmation === true ||
          showDeleteConfirmation === undefined
        }
        onOpenChange={setShowDeleteConfirmation}
      >
        <DrawerContent className="px-4">
          <DrawerHeader className="text-center">
            <DrawerTitle>Are you sure to delete this API key?</DrawerTitle>
            <DrawerDescription>
              This action cannot be undone. Please confirm to proceed.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="mb-4">
            <Button
              type="submit"
              onClick={() => {
                setShowDeleteConfirmation(false)
                removeApiKeyHandler(apiKeyId)
              }}
              variant="destructive"
              className="w-full"
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog
      open={
        showDeleteConfirmation === true || showDeleteConfirmation === undefined
      }
      onOpenChange={setShowDeleteConfirmation}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure to delete this API key?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              setShowDeleteConfirmation(false)
              removeApiKeyHandler(apiKeyId)
            }}
            className="cursor-pointer"
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
