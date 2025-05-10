"use client"

import Loading from "@/app/[locale]/loading"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { getMessagesByChatId } from "@/db/messages"
import { useParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

export const ChatUI: FC = () => {
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
    <div className="relative flex h-full flex-col items-center bg-white text-[#0F3863]">
      {/* Cabecera con avatar y saludo */}
      <div className="flex items-center justify-center w-full h-[60px] border-b-2 font-bold text-lg px-4">
        <img
          src="/kelly-avatar.png"
          alt="Kelly Bot"
          className="h-10 w-10 rounded-full border border-[#0F3863] mr-3"
        />
        Aloha! Soy Kelly Slater 🏄 ¿En qué puedo ayudarte?
      </div>

      {/* Mensajes */}
      <div className="flex flex-1 w-full overflow-auto px-4">
        <ChatMessages />
      </div>

      {/* Input sin botón + y con nuevo placeholder */}
      <div className="w-full max-w-2xl px-4 pb-5 pt-2">
        <ChatInput
          placeholder="Pregunta lo que quieras sobre clases, surftrips o el mar 🌊"
          hideUploadButton={true}
        />
      </div>
    </div>
  )
}
