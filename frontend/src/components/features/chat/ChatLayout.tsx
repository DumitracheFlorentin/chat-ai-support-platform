import type { Chat } from '@/types/chat'

import ChatSidebar from './ChatSidebar'
import ChatWindow from './ChatWindow'

export default function ChatLayout({
  setSelectedChat,
  selectedChat,
  reloadChats,
  setChats,
  chats,
}: {
  setChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void
  setSelectedChat: (chat: Chat | null) => void
  selectedChat: Chat | null
  reloadChats: () => void
  chats: Chat[]
}) {
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
