"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import VideoPlayer from "./VideoPlayer"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"
import { useVideoPreload } from "../hooks/useVideoPreload"

// CDN video URLs
const CDN_VIDEOS = [
  "https://d1uz400jez5i0o.cloudfront.net/1725406911composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725416899composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725418700composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725421263composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725483901composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725485800composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725736110composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725743026composited_video.m4v",
  "https://d1uz400jez5i0o.cloudfront.net/1725745717composited_video.m4v",
]

interface VideoFeedProps {
  onVideoDoubleTap: (index: number) => void
}

const VideoFeed = ({ onVideoDoubleTap }: VideoFeedProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Check if we're in the browser
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate infinite feed by repeating the CDN videos
  const { videos, loadMoreVideos } = useInfiniteScroll(CDN_VIDEOS)

  // Preload videos for smoother playback
  const { preloadNextVideos } = useVideoPreload(videos)

  // Handle scroll to determine current video
  const handleScroll = useCallback(() => {
    if (!isMounted) return
    if (!feedRef.current) return

    const containerHeight = window.innerHeight
    const scrollTop = feedRef.current.scrollTop
    const newIndex = Math.floor(scrollTop / containerHeight)

    if (newIndex !== currentVideoIndex) {
      setCurrentVideoIndex(newIndex)

      // Preload next 2 videos when scrolling
      preloadNextVideos(newIndex, 2)

      // Load more videos if we're near the end
      if (newIndex >= videos.length - 3) {
        loadMoreVideos()
      }
    }
  }, [currentVideoIndex, videos.length, loadMoreVideos, preloadNextVideos, isMounted])

  useEffect(() => {
    if (!isMounted) return

    const feedElement = feedRef.current
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll)
      return () => feedElement.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll, isMounted])

  // Preload initial videos on component mount
  useEffect(() => {
    if (isMounted) {
      preloadNextVideos(0, 3)
    }
  }, [preloadNextVideos, isMounted])

  // Don't render anything during SSR
  if (!isMounted) return null

  return (
    <div ref={feedRef} className="video-feed h-full w-full overflow-y-scroll snap-y snap-mandatory">
      {videos.map((video, index) => (
        <div key={`${video}-${index}`} className="video-container h-screen w-full snap-start snap-always">
          <VideoPlayer src={video} isActive={index === currentVideoIndex} onDoubleTap={() => onVideoDoubleTap(index)} />
        </div>
      ))}
    </div>
  )
}

export default VideoFeed
