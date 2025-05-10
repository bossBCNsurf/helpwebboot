"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Aquí defines a qué workspace redirigir por defecto
    const defaultWorkspaceId = "default"
    router.push(`/${defaultWorkspaceId}/chat`)
  }, [])

  return null
}
