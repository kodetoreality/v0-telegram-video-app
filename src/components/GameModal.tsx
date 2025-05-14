"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  videoIndex: number | null
}

const GAME_URL = "https://magenta-cendol-1287e0.netlify.app/"

const GameModal = ({ isOpen, onClose, videoIndex }: GameModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isGameLoaded, setIsGameLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Check if we're in the browser
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Always preload the game iframe, but only show when isOpen is true
  useEffect(() => {
    // Reset game loaded state when modal is opened
    if (isOpen) {
      setIsGameLoaded(false)
    }
  }, [isOpen])

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsGameLoaded(true)
  }

  // Handle sharing the game
  const handleShareChallenge = () => {
    if (typeof window !== "undefined" && typeof window.Telegram?.WebApp !== "undefined" && videoIndex !== null) {
      // Generate deep link to the specific game
      const deepLink = `https://t.me/your_bot_username?start=game_${videoIndex}`

      // Use Telegram's native sharing if available
      // This is a mock implementation - you would need to use the actual Telegram API
      console.log("Sharing challenge with deep link:", deepLink)

      // Example of how you might post to a chat via the bot
      // In a real implementation, you would use Telegram's API
      alert(`Challenge shared! Deep link: ${deepLink}`)
    }
  }

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose()
    }
  }

  // Don't render anything during SSR
  if (!isMounted) return null

  // Create a portal for the modal to avoid z-index issues
  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full max-w-full max-h-full">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Game iframe container */}
        <div className="w-full h-full">
          {/* Skeleton loader */}
          {!isGameLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">Loading game...</p>
            </div>
          )}

          {/* Game iframe - always rendered but only visible when loaded */}
          <iframe
            ref={iframeRef}
            src={GAME_URL}
            className={`w-full h-full border-0 ${isGameLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={handleIframeLoad}
            title="Game"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>

        {/* Share challenge button */}
        <button
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-3 px-6 rounded-full font-medium shadow-lg"
          onClick={handleShareChallenge}
        >
          Challenge Friends
        </button>
      </div>
    </div>
  )
}

export default GameModal
