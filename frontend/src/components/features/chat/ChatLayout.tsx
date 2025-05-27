import ChatSidebar from './ChatSidebar'
import ChatWindow from './ChatWindow'

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
  setChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void
  setSelectedChat: (chat: Chat | null) => void
  reloadChats: () => void
}

export default function ChatLayout({
  chats,
  selectedChat,
  setChats,
  setSelectedChat,
  reloadChats,
}: Props) {
  return (
    <div className="flex flex-grow gap-4 py-2">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        setChats={setChats}
        setSelectedChat={setSelectedChat}
        reloadChats={reloadChats}
      />
      <ChatWindow
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setChats={setChats}
      />
    </div>
  )
}
