'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ContentModal } from './content-modal'

interface Content {
  id: number
  title: string
  name?: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date?: string
  first_air_date?: string
}

interface ContentSectionProps {
  title: string
  type: 'movie' | 'tv' | 'anime'
  category: string
}

export function ContentSection({ title, type, category }: ContentSectionProps) {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?type=${type}&category=${category}`)
        const data = await res.json()
        setContent(data.results || [])
      } catch (error) {
        console.error('Failed to fetch content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [type, category])

  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 h-52 bg-secondary rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {content.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedContent(item)}
            className="flex-shrink-0 w-36 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            <div className="relative w-36 h-52 rounded-lg overflow-hidden bg-secondary">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name || ''}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="144px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-primary text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{item.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <h3 className="mt-2 text-sm font-medium text-left line-clamp-2">
              {item.title || item.name}
            </h3>
          </button>
        ))}
      </div>

      {selectedContent && (
        <ContentModal
          content={selectedContent}
          type={type}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </section>
  )
}
