import { useEffect, useState } from 'react'
import apiRequest from '@/api/apiRequest'
import ChatLayout from '@/components/features/chat/ChatLayout'
import Loading from '@/components/core/Loading'
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

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchChatData = async () => {
    try {
      const response = await apiRequest('/chats')
      setChats(response.chats)
      setSelectedChat(response.chats[0] || null)
    } catch {
      toast.error('Failed to fetch chats')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChatData()
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <ChatLayout
      chats={chats}
      selectedChat={selectedChat}
      setChats={setChats}
      setSelectedChat={setSelectedChat}
      reloadChats={fetchChatData}
    />
  )
}
