import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Loading from '../components/core/Loading'
import apiRequest from '@/api/apiRequest'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Ellipsis, Pencil, Trash } from 'lucide-react'

import { Label } from '@/components/ui/label'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    createdAt: string
  }>
}

export default function Chat() {
  const [openDialog, setOpenDialog] = useState(false)
  const [name, setName] = useState('')
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])
  const [message, setMessage] = useState('')

  async function fetchChatData() {
    try {
      const response = await apiRequest('/chats')
      setChats(response.chats)
      if (response.chats.length > 0) {
        setSelectedChat(response.chats[0])
      }
    } catch (error) {
      toast.error('Failed to fetch chat data')
    } finally {
      setIsLoading(false)
    }
  }

  async function addNewChatHandler() {
    try {
      setIsLoading(true)
      const response = await apiRequest('/chats', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Chat' }),
      })
      setChats((prev) => [...prev, response.chat])
      setSelectedChat(response.chat)
      toast.success('New chat created successfully')
    } catch (error) {
      toast.error('Failed to create new chat')
    } finally {
      setIsLoading(false)
    }
  }

  async function sendMessageHandler() {
    if (!message.trim() || !selectedChat) return

    try {
      setIsSending(true)
      const res = await apiRequest(`/chats/${selectedChat.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ question: message }),
        headers: { 'Content-Type': 'application/json' },
      })

      const updatedMessages = [
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

      const updatedChat = { ...selectedChat, messages: updatedMessages }

      setChats((prev: any) =>
        prev?.map((chat: any) =>
          chat.id === updatedChat.id ? updatedChat : chat
        )
      )

      setSelectedChat(updatedChat as Chat)
      setMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  async function removeChatHandler(chatId: string) {
    if (!chatId) return

    try {
      setIsLoading(true)
      await apiRequest(`/chats/${chatId}`, { method: 'DELETE' })
      setChats((prev) => prev.filter((chat) => chat.id !== chatId))
      setSelectedChat((prev) =>
        prev ? chats.find((chat) => chat.id !== chatId) || null : null
      )
      toast.success('Chat removed successfully')
    } catch (error) {
      toast.error('Failed to remove chat')
    } finally {
      setIsLoading(false)
    }
  }

  async function renameChatHandler(chatId: string, newTitle: string) {
    if (!chatId || !newTitle.trim()) return

    try {
      setIsLoading(true)
      const response = await apiRequest(`/chats/${chatId}`, {
        method: 'PUT',
        body: JSON.stringify({ newTitle }),
        headers: { 'Content-Type': 'application/json' },
      })

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: response.chat.title } : chat
        )
      )
      if (selectedChat?.id === chatId) {
        setSelectedChat((prev: any) => ({
          ...prev,
          title: response.chat.title,
        }))
      }
      toast.success('Chat renamed successfully')
    } catch (error) {
      toast.error('Failed to rename chat')
    } finally {
      setOpenDialog(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChatData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-grow items-center justify-center h-full p-5">
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <h1 className="text-3xl font-semibold text-gray-800">
            No Chats Available
          </h1>
          <p className="text-gray-600">
            Start a new chat to see messages here.
          </p>
          <Button className="cursor-pointer mt-1" onClick={addNewChatHandler}>
            Start New Chat
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-grow gap-4 py-2">
      {/* Chat List */}
      <Card className="w-1/4 flex flex-col h-full max-h-[90vh]">
        <CardHeader className="text-lg font-bold">Chats</CardHeader>

        <div className="flex flex-col flex-grow overflow-hidden">
          <ScrollArea className="flex-1 px-4">
            <div className="h-[34.5rem] space-y-2 pb-4">
              {chats?.map((chat) => (
                <>
                  <Button
                    variant={
                      selectedChat?.id === chat.id ? 'default' : 'outline'
                    }
                    className="w-full justify-between cursor-pointer"
                    onClick={() => setSelectedChat(chat)}
                  >
                    {chat.title || `Chat ${chat.id.slice(0, 6)}...`}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-full cursor-pointer p-1">
                          <Ellipsis className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => setOpenDialog(true)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => removeChatHandler(chat.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Button>

                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Chat Title</DialogTitle>
                        <DialogDescription>
                          Update the name of your chat. Click save when you're
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={() => renameChatHandler(chat.id, name)}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              onClick={addNewChatHandler}
            >
              + New Chat
            </Button>
          </div>
        </div>
      </Card>

      <Card className="w-3/4 flex flex-col justify-between">
        <CardHeader className="text-lg font-semibold">
          {selectedChat ? selectedChat?.title || 'Chat' : 'Select a chat'}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 px-2 pt-2">
          <ScrollArea className="h-full pr-4">
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
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Type your question about a product..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessageHandler()}
          />

          <Button onClick={sendMessageHandler} disabled={isSending}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}
