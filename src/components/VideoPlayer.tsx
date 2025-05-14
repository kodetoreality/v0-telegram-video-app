"use client"

import { useRef, useEffect, useState, memo } from "react"

interface VideoPlayerProps {
  src: string
  isActive: boolean
  onDoubleTap: () => void
}

const VideoPlayer = memo(({ src, isActive, onDoubleTap }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastTap, setLastTap] = useState<number>(0)
  const [isMounted, setIsMounted] = useState(false)

  // Check if we're in the browser
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const videoElement = videoRef.current
    if (!videoElement) return

    if (isActive) {
      // Play video when it becomes active
      const playPromise = videoElement.play()

      // Handle play promise to avoid errors
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, add a play button or handle as needed
        })
      }
    } else {
      // Pause video when it's not active
      videoElement.pause()
    }
  }, [isActive, isMounted])

  // Handle video loading events
  useEffect(() => {
    if (!isMounted) return

    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoaded = () => setIsLoading(false)
    const handleWaiting = () => setIsLoading(true)

    videoElement.addEventListener("loadeddata", handleLoaded)
    videoElement.addEventListener("waiting", handleWaiting)
    videoElement.addEventListener("playing", handleLoaded)

    return () => {
      videoElement.removeEventListener("loadeddata", handleLoaded)
      videoElement.removeEventListener("waiting", handleWaiting)
      videoElement.removeEventListener("playing", handleLoaded)
    }
  }, [isMounted])

  // Handle double tap detection
  const handleTap = () => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300 // ms

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onDoubleTap()
      setLastTap(0) // Reset to prevent triple tap
    } else {
      setLastTap(now)
    }
  }

  // Don't render anything during SSR
  if (!isMounted) return null

  return (
    <div className="relative w-full h-full bg-black" onClick={handleTap}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        loop
        preload="auto"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Double tap instruction overlay */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm opacity-70">
        Double-tap to play game
      </div>
    </div>
  )
})

VideoPlayer.displayName = "VideoPlayer"

export default VideoPlayer
