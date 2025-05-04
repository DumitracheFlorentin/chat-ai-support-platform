import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import { useState } from 'react'

import { createApiInstance } from '@/services/api'

import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddApiKey({
  open,
  setOpen,
  setApiKey,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  setApiKey: (apiKey: any) => void
}) {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const apiNoInterceptors = createApiInstance(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>('')

  async function createApiKey(): Promise<void> {
    try {
      setLoading(true)
      const response = await apiNoInterceptors.post(
        '/api-keys',
        {
          owner: 'user',
          name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 201) {
        setName('')
        setApiKey(response.data.apiKey)
        toast.success('API key created successfully')
      } else {
        throw new Error('Failed to create API key')
      }
    } catch (error) {
      toast.error(`Failed to create API key: ${error}`)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader className="text-center">
            <DrawerTitle>Create API key</DrawerTitle>
            <DrawerDescription>
              Create an API key to access the API. Make sure to keep it secret!
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 px-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for the API key"
                className="col-span-3"
              />
            </div>
          </div>
          <DrawerFooter className="mb-4">
            <Button
              type="submit"
              onClick={createApiKey}
              disabled={loading || name.length === 0}
            >
              Create key
            </Button>
            <DrawerClose>
              <Button variant="ghost" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            Create an API key to access the API. Make sure to keep it secret!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for the API key"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={createApiKey}
            disabled={loading || name.length === 0}
          >
            Create key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
