"use client"

import Loading from "@/app/[locale]/loading"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { getMessagesByChatId } from "@/db/messages"
import { useParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  const params = useParams()
  const {
    setChatMessages,
    setSelectedChat,
    setChatFiles,
    setChatFileItems,
    setChatImages,
    setShowFilesDisplay,
    setUseRetrieval
  } = useContext(ChatbotUIContext)

  const { handleFocusChatInput } = useChatHandler()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await getMessagesByChatId(params.chatid as string)
      setChatMessages(fetchedMessages.map(message => ({ message, fileItems: [] })))
      setSelectedChat(null)
      setChatFiles([])
      setChatFileItems([])
      setChatImages([])
      setUseRetrieval(false)
      setShowFilesDisplay(false)
      handleFocusChatInput()
      setLoading(false)
    }

    if (params.chatid) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <Loading />

  return (
    <div className="relative flex h-full flex-col items-center">
      {/* Cabecera personalizada */}
      <div className="flex items-center justify-center w-full h-[60px] border-b bg-white text-[#0F3863] font-bold text-xl">
        <img
          src="/kelly-avatar.png"
          alt="Kelly Bot"
          className="h-8 w-8 rounded-full mr-2"
        />
        Hola! Soy Kelly Bot 🤙 ¿En qué puedo ayudarte hoy?
      </div>

      {/* Mensajes */}
      <div className="flex flex-1 w-full overflow-auto">
        <ChatMessages />
      </div>

      {/* Input de chat personalizado */}
      <div className="w-full px-4 pb-4">
        <ChatInput
          placeholder="Pregunta lo que quieras..."
          hideUploadButton={true} // Elimina el botón de "+"
        />
      </div>
    </div>
  )
}
