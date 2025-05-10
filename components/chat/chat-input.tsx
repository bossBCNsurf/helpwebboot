"use client"
import { FC, useEffect, useRef, useState, useContext } from "react" // ✅ AHORA INCLUYE useContext
import { useTranslation } from "react-i18next"
import { ChatbotUIContext } from "@/context/context"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import useHotkey from "@/lib/hooks/use-hotkey"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { IconPlayerStopFilled, IconSend } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  placeholder?: string
  hideUploadButton?: boolean
}

export const ChatInput: FC<ChatInputProps> = ({
  placeholder = "Pregunta lo que quieras sobre nuestras clases, surftrips o el mar 🌊"
}) => {
  const { t } = useTranslation()
  const [isTyping, setIsTyping] = useState(false)

  const {
    userInput,
    setUserInput,
    chatMessages,
    isGenerating
  } = useContext(ChatbotUIContext)

  const {
    chatInputRef,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput
  } = useChatHandler()

  useHotkey("l", handleFocusChatInput)

  useEffect(() => {
    setTimeout(() => {
      handleFocusChatInput()
    }, 200)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage(userInput, chatMessages, false)
    }
  }

  return (
    <div className="relative flex w-full items-center rounded-xl border-2 border-[#0F3863] bg-white px-4 py-2 shadow-sm">
      <TextareaAutosize
        textareaRef={chatInputRef}
        className="text-[#0F3863] text-md w-full resize-none border-none bg-transparent focus:outline-none placeholder:text-[#6B7280]"
        placeholder={placeholder}
        onValueChange={val => setUserInput(val)}
        value={userInput}
        minRows={1}
        maxRows={6}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
      />

      <div className="ml-2 shrink-0 cursor-pointer">
        {isGenerating ? (
          <IconPlayerStopFilled
            onClick={handleStopMessage}
            className="text-[#0F3863] hover:opacity-60"
            size={28}
          />
        ) : (
          <IconSend
            className={cn(
              "bg-[#0F3863] text-white rounded p-1",
              !userInput && "cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (!userInput) return
              handleSendMessage(userInput, chatMessages, false)
            }}
            size={28}
          />
        )}
      </div>
    </div>
  )
}
