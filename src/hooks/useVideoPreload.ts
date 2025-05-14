"use client"

import { useCallback } from "react"

export const useVideoPreload = (videos: string[]) => {
  // Preload videos by creating video elements and loading them
  const preloadVideo = useCallback((url: string) => {
    if (typeof window === "undefined") return

    const video = document.createElement("video")
    video.preload = "auto"
    video.src = url
    video.load()

    // Remove the element after it's loaded to free memory
    video.onloadeddata = () => {
      video.remove()
    }
  }, [])

  // Preload a batch of videos starting from the current index
  const preloadNextVideos = useCallback(
    (currentIndex: number, count: number) => {
      if (typeof window === "undefined") return

      for (let i = 0; i < count; i++) {
        const nextIndex = currentIndex + i + 1
        if (nextIndex < videos.length) {
          preloadVideo(videos[nextIndex])
        }
      }
    },
    [videos, preloadVideo],
  )

  return { preloadNextVideos }
}
