"use client"

import { useState, useCallback } from "react"

export const useInfiniteScroll = (initialVideos: string[]) => {
  const [videos, setVideos] = useState<string[]>(initialVideos)

  // Function to load more videos by repeating the initial set
  const loadMoreVideos = useCallback(() => {
    setVideos((prevVideos) => {
      // Add another batch of the initial videos
      return [...prevVideos, ...initialVideos]
    })
  }, [initialVideos])

  return { videos, loadMoreVideos }
}
