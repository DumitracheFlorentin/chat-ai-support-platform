import type { Chat } from '@/types/chat'
import { useState } from 'react'
import { toast } from 'sonner'

import apiRequest from '@/api/apiRequest'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog'

export default function RenameDialog({
  setSelectedChat,
  onOpenChange,
  setChats,
  open,
  chat,
}: {
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  onOpenChange: (open: boolean) => void
  setSelectedChat: (chat: Chat) => void
  open: boolean
  chat: Chat
}) {
  const [title, setTitle] = useState(chat.title || '')

  const renameChatHandler = async () => {
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
          <Button onClick={renameChatHandler}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
