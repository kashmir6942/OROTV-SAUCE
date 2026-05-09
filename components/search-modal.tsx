'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { ContentModal } from './content-modal'

interface SearchResult {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  media_type: 'movie' | 'tv'
}

interface SearchModalProps {
  onClose: () => void
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<SearchResult | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const searchContent = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchContent(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, searchContent])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Search Header */}
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            {/* Search Icon */}
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
              className="text-muted-foreground flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            {/* Search Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, anime..."
              className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-muted-foreground"
              autoFocus
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Close search"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((result) => (
                  <button
                    key={`${result.media_type}-${result.id}`}
                    onClick={() => setSelectedContent(result)}
                    className="group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                      {result.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${result.poster_path}`}
                          alt={result.title || result.name || ''}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-xs font-medium capitalize">
                        {result.media_type}
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-left line-clamp-2">
                      {result.title || result.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-primary"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>{result.vote_average?.toFixed(1)}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12 text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Start typing to search for movies, TV shows, or anime
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Modal */}
      {selectedContent && (
        <ContentModal
          content={selectedContent}
          type={selectedContent.media_type === 'tv' ? 'tv' : 'movie'}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  )
}
