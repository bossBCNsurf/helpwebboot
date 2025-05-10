"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantWorkspacesByWorkspaceId } from "@/db/assistants"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getCollectionWorkspacesByWorkspaceId } from "@/db/collections"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"
import { getFoldersByWorkspaceId } from "@/db/folders"
import { getModelWorkspacesByWorkspaceId } from "@/db/models"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { getAssistantImageFromStorage } from "@/db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "@/db/tools"
import { getWorkspaceById } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
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
    setAssistants,
    setAssistantImages,
    setChats,
    setCollections,
    setFolders,
    setFiles,
    setPresets,
    setPrompts,
    setTools,
    setModels,
    setSelectedWorkspace,
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
    ;(async () => {
      await fetchWorkspaceData(workspaceId || "default")
    })()

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
    setLoading(true)

    const workspace = await getWorkspaceById(workspaceId)
    if (!workspace) {
      setLoading(false)
      return
    }

    setSelectedWorkspace(workspace)

    const assistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId)
    setAssistants(assistantData.assistants)

    for (const assistant of assistantData.assistants) {
      const url = assistant.image_path
        ? (await getAssistantImageFromStorage(assistant.image_path)) || ""
        : ""

      const base64 = url
        ? await convertBlobToBase64(await (await fetch(url)).blob())
        : ""

      setAssistantImages(prev => [
        ...prev,
        {
          assistantId: assistant.id,
          path: assistant.image_path,
          base64,
          url
        }
      ])
    }

    const chats = await getChatsByWorkspaceId(workspaceId)
    setChats(chats)

    const collections = await getCollectionWorkspacesByWorkspaceId(workspaceId)
    setCollections(collections.collections)

    const folders = await getFoldersByWorkspaceId(workspaceId)
    setFolders(folders)

    const files = await getFileWorkspacesByWorkspaceId(workspaceId)
    setFiles(files.files)

    const presets = await getPresetWorkspacesByWorkspaceId(workspaceId)
    setPresets(presets.presets)

    const prompts = await getPromptWorkspacesByWorkspaceId(workspaceId)
    setPrompts(prompts.prompts)

    const tools = await getToolWorkspacesByWorkspaceId(workspaceId)
    setTools(tools.tools)

    const models = await getModelWorkspacesByWorkspaceId(workspaceId)
    setModels(models.models)

    setChatSettings({
      model: (searchParams.get("model") || workspace?.default_model || "gpt-3.5-turbo") as LLMID,
      prompt: workspace?.default_prompt || "You are a helpful assistant.",
      temperature: workspace?.default_temperature || 0.5,
      contextLength: workspace?.default_context_length || 4096,
      includeProfileContext: workspace?.include_profile_context ?? true,
      includeWorkspaceInstructions: workspace?.include_workspace_instructions ?? true,
      embeddingsProvider: (workspace?.embeddings_provider as "openai" | "local") || "openai"
    })

    setLoading(false)
  }

  if (loading) return <Loading />

  return <Dashboard>{children}</Dashboard>
}
