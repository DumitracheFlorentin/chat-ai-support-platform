import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Ellipsis, Pencil, Trash } from 'lucide-react'
import RenameDialog from './RenameDialog'
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
  chat: Chat
  isActive: boolean
  setSelectedChat: (chat: Chat) => void
  selectedChat?: Chat | null
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  chats: Chat[]
}

export default function ChatItem({
  chat,
  isActive,
  setSelectedChat,
  selectedChat,
  setChats,
  chats,
}: Props) {
  const [openRename, setOpenRename] = useState(false)

  const removeChat = async () => {
    try {
      if (chat.id === selectedChat?.id) {
        setSelectedChat(chats.filter((c) => c.id !== chat.id)?.[0])
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
          {chat.title || `Chat ${chat.id.slice(0, 6)}...`}
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
            <DropdownMenuItem onClick={removeChat} className="cursor-pointer">
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
