import { Ellipsis, Pencil, Trash } from 'lucide-react'
import type { Chat } from '@/types/chat'
import { useState } from 'react'
import { toast } from 'sonner'

import RenameDialog from './RenameDialog'
import apiRequest from '@/api/apiRequest'

import { Button } from '@/components/ui/button'
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'

export default function ChatItem({
  setSelectedChat,
  selectedChat,
  isActive,
  setChats,
  chat,
}: {
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  setSelectedChat: (chat: Chat | null) => void
  selectedChat?: Chat | null
  isActive: boolean
  chat: Chat
}) {
  const [openRename, setOpenRename] = useState(false)

  const removeChatHandler = async () => {
    try {
      if (chat.id === selectedChat?.id) {
        setSelectedChat(null)
      }

      await apiRequest(`/chats/${chat.id}`, { method: 'DELETE' })
      setChats((prev) => prev.filter((c) => c.id !== chat.id))

      toast.success('Chat removed')
    } catch {
      toast.error('Failed to remove chat')
    }
  }

  return (
    <>
      <div className="relative w-full flex justify-between items-center">
        <Button
          variant={isActive ? 'default' : 'outline'}
          className="flex-1 justify-start cursor-pointer"
          onClick={() => setSelectedChat(chat)}
        >
          {chat.title.length > 30
            ? `${chat.title.slice(0, 30)}...`
            : chat.title || `Chat ${chat.id.slice(0, 6)}...`}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-1 cursor-pointer">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpenRename(true)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={removeChatHandler}
              className="cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RenameDialog
        open={openRename}
        onOpenChange={setOpenRename}
        setSelectedChat={setSelectedChat}
        chat={chat}
        setChats={setChats}
      />
    </>
  )
}
