"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { LLMID } from "@/types"
import { useParams, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceId = params.workspaceid as string

  const {
    setChatSettings,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatFiles,
    setChatImages,
    setNewMessageFiles,
    setNewMessageImages,
    setShowFilesDisplay
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkspaceData(workspaceId)
  }, [])

  useEffect(() => {
    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setIsGenerating(false)
    setFirstTokenReceived(false)
    setChatFiles([])
    setChatImages([])
    setNewMessageFiles([])
    setNewMessageImages([])
    setShowFilesDisplay(false)
  }, [workspaceId])

  const fetchWorkspaceData = async (workspaceId: string) => {
    // ⚠️ Aquí podrías cargar datos de ejemplo si quieres
    setChatSettings({
      model: (searchParams.get("model") || "gpt-3.5-turbo") as LLMID,
      prompt: "Eres un asistente de ayuda simpático de una escuela de surf.",
      temperature: 0.5,
      contextLength: 4096,
      includeProfileContext: false,
      includeWorkspaceInstructions: false,
      embeddingsProvider: "openai"
    })

    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  return <Dashboard>{children}</Dashboard>
}
