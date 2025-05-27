import type { Chat, ChatMessage } from '@/types/chat'
import { useState } from 'react'
import { toast } from 'sonner'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import apiRequest from '@/api/apiRequest'

export default function ChatWindow({
  setSelectedChat,
  selectedChat,
  setChats,
}: {
  setChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void
  setSelectedChat: (chat: Chat) => void
  selectedChat: Chat | null
}) {
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')

  const sendMessageHandler = async () => {
    if (!message.trim() || !selectedChat) return

    try {
      setIsSending(true)
      const res = await apiRequest(`/chats/${selectedChat.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ question: message }),
        headers: { 'Content-Type': 'application/json' },
      })

      const newMessages: ChatMessage[] = [
        ...selectedChat.messages,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: res.answer,
          createdAt: new Date().toISOString(),
        },
      ]

      const updatedChat = { ...selectedChat, messages: newMessages }

      setSelectedChat(updatedChat)
      setChats((prev: Chat[]) =>
        prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      )
      setMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (!selectedChat) {
    return (
      <div className="w-3/4 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <Card className="w-3/4 flex flex-col justify-between">
      <CardHeader className="text-lg font-semibold px-4">
        {selectedChat.title || 'Chat'}
      </CardHeader>

      <ScrollArea className="flex-1 space-y-4 px-4 py-4">
        {selectedChat?.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-muted self-start text-left'
                : 'bg-primary text-white self-end text-right ml-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Ask about a product..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler()}
        />
        <Button onClick={sendMessageHandler} disabled={isSending}>
          Send
        </Button>
      </div>
    </Card>
  )
}
