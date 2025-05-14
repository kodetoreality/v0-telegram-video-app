"use client"

import { useEffect, useState } from "react"
import VideoFeed from "./components/VideoFeed"
import GameModal from "./components/GameModal"
import { useDeepLink } from "./hooks/useDeepLink"
import "./App.css"

// Mock Telegram WebApp object for development
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        ready: () => void
        expand: () => void
        MainButton: {
          setText: (text: string) => void
          show: () => void
          onClick: (callback: () => void) => void
        }
      }
    }
  }
}

function App() {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const { isDeepLink, gameId } = useDeepLink()

  useEffect(() => {
    // Initialize Telegram Mini App
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }

    // If deep link to game, open game modal directly
    if (isDeepLink && gameId !== null) {
      setSelectedVideoIndex(Number.parseInt(gameId))
      setIsGameModalOpen(true)
    }
  }, [isDeepLink, gameId])

  const handleVideoDoubleTap = (index: number) => {
    setSelectedVideoIndex(index)
    setIsGameModalOpen(true)
  }

  const handleCloseGameModal = () => {
    setIsGameModalOpen(false)
  }

  return (
    <div className="app h-screen w-full bg-black overflow-hidden">
      <VideoFeed onVideoDoubleTap={handleVideoDoubleTap} />

      {/* Game modal is always rendered but hidden when not active */}
      <GameModal isOpen={isGameModalOpen} onClose={handleCloseGameModal} videoIndex={selectedVideoIndex} />
    </div>
  )
}

export default App
