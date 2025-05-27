import { Card, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatItem from './ChatItem'
import { Button } from '@/components/ui/button'
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
  chats: Chat[]
  selectedChat: Chat | null
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  setSelectedChat: (chat: Chat | null) => void
  reloadChats: () => void
}

export default function ChatSidebar({
  chats,
  selectedChat,
  setChats,
  setSelectedChat,
  reloadChats,
}: Props) {
  async function addNewChat() {
    try {
      const res = await apiRequest('/chats', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Chat' }),
      })
      setChats((prevChats) => [...prevChats, res.chat])
      setSelectedChat(res.chat)
      toast.success('Chat created')
    } catch {
      toast.error('Failed to create chat')
    }
  }

  return (
    <Card className="w-1/4 flex flex-col h-full max-h-[90vh]">
      <CardHeader className="text-lg font-bold">Chats</CardHeader>
      <div className="flex flex-col flex-grow overflow-hidden">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4 h-[34.5rem]">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === selectedChat?.id}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                setChats={setChats}
                chats={chats}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button
            className="w-full cursor-pointer"
            variant="outline"
            onClick={addNewChat}
          >
            + New Chat
          </Button>
        </div>
      </div>
    </Card>
  )
}
