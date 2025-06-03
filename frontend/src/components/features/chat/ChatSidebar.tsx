import type { Chat } from '@/types/chat'
import { toast } from 'sonner'

import apiRequest from '@/api/apiRequest'
import ChatItem from './ChatItem'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ChatSidebar({
  setSelectedChat,
  selectedChat,
  reloadChats,
  setChats,
  chats,
}: {
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  setSelectedChat: (chat: Chat | null) => void
  selectedChat: Chat | null
  reloadChats: () => void
  chats: Chat[]
}) {
  async function addChatHandler() {
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
    <Card className="w-full sm:w-1/4 flex flex-col h-full max-h-[35vh] sm:max-h-[90vh]">
      <CardHeader className="text-lg font-bold">Chats</CardHeader>
      <div className="flex flex-col flex-grow overflow-hidden">
        <ScrollArea className="flex-1 px-4 py-3 sm:py-0">
          <div className="space-y-2 pb-4 h-[5rem] sm:h-[34.5rem]">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === selectedChat?.id}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                setChats={setChats}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button
            className="w-full cursor-pointer"
            variant="outline"
            onClick={addChatHandler}
          >
            + New Chat
          </Button>
        </div>
      </div>
    </Card>
  )
}
