"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ReactNode } from "react"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return <Dashboard>{children}</Dashboard>
}
