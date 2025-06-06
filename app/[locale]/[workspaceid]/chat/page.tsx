"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatUI } from "@/components/chat/chat-ui"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext, useEffect } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => handleFocusChatInput())

  const { chatMessages, setChatSettings } = useContext(ChatbotUIContext)
  const { handleNewChat, handleFocusChatInput } = useChatHandler()
  const { theme } = useTheme()

  // Forzar configuración al cargar
  useEffect(() => {
    setChatSettings({
      model: "gpt-3.5-turbo", // 💸 el más barato
      prompt: "Eres un asistente simpático y profesional de BCN Surf School. Ayudas a resolver dudas con energía positiva y claridad.",
      temperature: 0.5,
      contextLength: 4096,
      includeProfileContext: false,
      includeWorkspaceInstructions: false,
      embeddingsProvider: "openai"
    })
  }, [])

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
