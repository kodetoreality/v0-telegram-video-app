"use client"

import { useState, useEffect } from "react"

export const useDeepLink = () => {
  const [isDeepLink, setIsDeepLink] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    // Parse URL parameters or Telegram start params
    const parseDeepLink = () => {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const gameParam = urlParams.get("game")

      if (gameParam) {
        setIsDeepLink(true)
        setGameId(gameParam)
        return
      }

      // Check Telegram WebApp start params if available
      if (window.Telegram?.WebApp?.initData) {
        try {
          // Parse initData (this is a simplified example)
          const initData = new URLSearchParams(window.Telegram.WebApp.initData)
          const startParam = initData.get("start")

          if (startParam && startParam.startsWith("game_")) {
            const extractedGameId = startParam.replace("game_", "")
            setIsDeepLink(true)
            setGameId(extractedGameId)
          }
        } catch (error) {
          console.error("Error parsing Telegram initData:", error)
        }
      }
    }

    parseDeepLink()
  }, [])

  return { isDeepLink, gameId }
}
