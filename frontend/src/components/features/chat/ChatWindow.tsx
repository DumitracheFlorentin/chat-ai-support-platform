import type { Chat, ChatMessage } from '@/types/chat'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import apiRequest from '@/api/apiRequest'
import { AI_MODELS, getDefaultModel } from '@/config/ai-models'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  Select,
} from '@/components/ui/select'

const EMBEDDING_MODELS = [
  { id: 'ada002', name: 'Ada-002', provider: 'openai' },
  { id: 'embedding3Large', name: 'Embedding-3-Large', provider: 'openai' },
  { id: 'gemini001', name: 'Gemini Embedding', provider: 'gemini' },
]

export default function ChatWindow({
  setSelectedChat,
  selectedChat,
  setChats,
}: {
  setChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void
  setSelectedChat: (chat: Chat) => void
  selectedChat: Chat | null
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [selectedModel, setSelectedModel] = useState(getDefaultModel().id)
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState('ada002')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')

  // Filter AI models based on selected embedding model
  const embeddingProvider = EMBEDDING_MODELS.find(
    (e) => e.id === selectedEmbeddingModel
  )?.provider
  const filteredModels = AI_MODELS.filter(
    (m) => m.provider === embeddingProvider
  )

  useEffect(() => {
    // If the current selected model is not compatible, reset to first compatible
    if (!filteredModels.find((m) => m.id === selectedModel)) {
      setSelectedModel(filteredModels[0]?.id || '')
    }
    // eslint-disable-next-line
  }, [selectedEmbeddingModel])

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
        ...(selectedChat?.messages || []),
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
          body: JSON.stringify({
            question: message,
            model: selectedModel,
            embeddingModel: selectedEmbeddingModel,
          }),
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

  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100

    setShowScrollButton(!nearBottom)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

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
    <Card className="w-full sm:w-3/4 flex flex-col justify-between">
      <CardHeader className="px-4">
        <div className="flex justify-between items-center gap-4">
          <div className="text-lg font-semibold">
            {selectedChat.title || 'Chat'}
          </div>

          <div className="flex gap-4">
            <Select
              value={selectedEmbeddingModel}
              onValueChange={setSelectedEmbeddingModel}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select embedding model">
                  {
                    EMBEDDING_MODELS.find(
                      (e) => e.id === selectedEmbeddingModel
                    )?.name
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {EMBEDDING_MODELS.map((embedding) => (
                    <SelectItem key={embedding.id} value={embedding.id}>
                      {embedding.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select a model">
                  {filteredModels.find((m) => m.id === selectedModel)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 px-4 py-4 space-y-4">
        <div
          ref={scrollContainerRef}
          className="flex flex-col gap-3 h-[30rem] overflow-y-auto relative"
        >
          {selectedChat?.messages?.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div
                  key={msg.id}
                  className="max-w-[60%] px-4 py-2 rounded-lg mb-3 w-fit ml-auto bg-secondary text-right"
                >
                  {msg.content}
                </div>
              )
            }

            let content
            try {
              let raw = msg.content.trim()

              if (raw.startsWith('```json')) {
                raw = raw
                  .replace(/^```json/, '')
                  .replace(/```$/, '')
                  .trim()
              }

              const products = JSON.parse(raw)

              if (Array.isArray(products)) {
                if (products.length === 0) {
                  content = (
                    <div className="text-muted-foreground">
                      No products found. Please try to be more concise or
                      provide more details about what you want.
                    </div>
                  )
                } else {
                  content = (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {products.map((product, i) => (
                        <Link
                          key={i}
                          to={`https://www.emag.ro`}
                          target="_blank"
                          className="flex flex-col items-center gap-4 border rounded-lg p-4 bg-muted"
                        >
                          <img
                            src={
                              product.image === 'optional_url'
                                ? '/placeholder.webp'
                                : product.image
                            }
                            alt={product.name}
                            className="w-full h-30 object-cover rounded-md"
                          />
                          <div className="flex justify-between gap-4 items-center w-full">
                            <h3 className="text-sm font-medium">
                              {product.name}
                            </h3>
                            <div className="font-medium text-sm text-green-600 whitespace-nowrap">
                              {product.price} EUR
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {product.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )
                }
              } else {
                content = msg.content
              }
            } catch {
              content = (
                <div className="text-muted-foreground">No products found</div>
              )
            }

            return (
              <div
                key={msg.id}
                className="max-w-[95%] px-4 py-2 rounded-lg mb-3 w-fit mr-auto text-left"
              >
                {content}
              </div>
            )
          })}

          <div ref={messagesEndRef} />
        </div>
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="cursor-pointer absolute bg-background bottom-4 left-1/2 transform -translate-x-1/2 border shadow-md px-3 py-1 rounded-lg text-sm hover:bg-muted transition-all"
          >
            <ArrowDown className="w-4 h-6 text-gray-600" />
          </button>
        )}
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
