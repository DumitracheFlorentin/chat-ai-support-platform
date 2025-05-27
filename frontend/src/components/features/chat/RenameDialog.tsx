import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import apiRequest from '@/api/apiRequest'
import { toast } from 'sonner'

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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  chat: Chat
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  setSelectedChat: (chat: Chat) => void
}

export default function RenameDialog({
  open,
  onOpenChange,
  chat,
  setChats,
  setSelectedChat,
}: Props) {
  const [title, setTitle] = useState(chat.title || '')

  const handleRename = async () => {
    try {
      const response = await apiRequest(`/chats/${chat.id}`, {
        method: 'PUT',
        body: JSON.stringify({ newTitle: title }),
        headers: { 'Content-Type': 'application/json' },
      })

      setChats((prev) =>
        prev.map((c) =>
          c.id === chat.id ? { ...c, title: response.chat.title } : c
        )
      )
      setSelectedChat({ ...chat, title: response.chat.title })
      toast.success('Chat renamed')
      onOpenChange(false)
    } catch {
      toast.error('Rename failed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chat Title</DialogTitle>
          <DialogDescription>Set a new name for your chat.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRename}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
