import type { Chat, ChatMessage } from '@/types/chat'
import { useEffect, useRef, useState } from 'react'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')

  const sendMessageHandler = async () => {
    if (!message.trim() || !selectedChat) return

    try {
      setIsSending(true)

      const questionMessage = await apiRequest(
        `/chats/${selectedChat.id}/messages/question`,
        {
          method: 'POST',
          body: JSON.stringify({ question: message }),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      let newMessages: ChatMessage[] = [
        ...selectedChat.messages,
        {
          id: questionMessage?.message?.id,
          role: 'user',
          content: message,
          createdAt: questionMessage?.message?.createdAt,
        },
      ]

      let updatedChat = { ...selectedChat, messages: newMessages }

      setSelectedChat(updatedChat)
      setChats((prev: Chat[]) =>
        prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      )

      const answerMessage = await apiRequest(
        `/chats/${selectedChat.id}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({ question: message }),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      newMessages = [
        ...newMessages,
        {
          id: answerMessage?.answer?.id,
          role: 'assistant',
          content: answerMessage?.answer?.content,
          createdAt: answerMessage?.answer?.createdAt,
        },
      ]

      updatedChat = { ...selectedChat, messages: newMessages }

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

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages, selectedChat?.id])

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

      <ScrollArea className="flex-1 px-4 py-4 space-y-4">
        <div className="flex flex-col gap-3 h-[30rem] overflow-y-auto">
          {selectedChat?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[60%] px-4 py-2 rounded-lg mb-3 w-fit
        ${
          msg.role === 'user'
            ? 'ml-auto bg-secondary text-right'
            : 'mr-auto text-left'
        }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
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
