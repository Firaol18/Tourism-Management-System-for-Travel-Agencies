"use client"

import React from "react"
import { MessageCircle } from "lucide-react"

export default function ChatToggle({ className = "" }: { className?: string }) {
  const openChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-chat"))
    }
  }

  return (
    <button
      onClick={openChat}
      aria-label="Open chat"
      className={`text-slate-400 hover:text-sky-400 transition-colors ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
    </button>
  )
}
