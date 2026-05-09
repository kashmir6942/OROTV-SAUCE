'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Content {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date?: string
  first_air_date?: string
}

interface ContentModalProps {
  content: Content
  type: 'movie' | 'tv' | 'anime'
  onClose: () => void
}

export function ContentModal({ content, type, onClose }: ContentModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const getEmbedUrl = () => {
    // Using vidsrc.xyz for embedding (anti-ads built-in via iframe sandbox)
    if (type === 'movie') {
      return `https://vidsrc.xyz/embed/movie/${content.id}`
    } else {
      return `https://vidsrc.xyz/embed/tv/${content.id}/${selectedSeason}/${selectedEpisode}`
    }
  }

  const title = content.title || content.name
  const releaseYear = (content.release_date || content.first_air_date)?.split('-')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-border">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          aria-label="Close"
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

        {isPlaying ? (
          /* Video Player with Anti-Ads iframe sandbox */
          <div className="aspect-video w-full bg-black">
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          /* Content Info */
          <>
            {/* Backdrop Image */}
            <div className="relative h-64 sm:h-80">
              {content.backdrop_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${content.backdrop_path}`}
                  alt={title || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              ) : (
                <div className="w-full h-full bg-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>

            {/* Content Details */}
            <div className="p-6 -mt-20 relative">
              <div className="flex gap-6">
                {/* Poster */}
                <div className="flex-shrink-0 w-32 h-48 relative rounded-lg overflow-hidden shadow-xl hidden sm:block">
                  {content.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${content.poster_path}`}
                      alt={title || ''}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {releaseYear && <span>{releaseYear}</span>}
                    <span className="flex items-center gap-1 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {content.vote_average?.toFixed(1)}
                    </span>
                    <span className="capitalize">{type === 'anime' ? 'Anime' : type}</span>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base line-clamp-4">
                    {content.overview || 'No overview available.'}
                  </p>
                </div>
              </div>

              {/* Season/Episode selector for TV shows */}
              {(type === 'tv' || type === 'anime') && (
                <div className="mt-6 flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Season</label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      className="px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Season {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Episode</label>
                    <select
                      value={selectedEpisode}
                      onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                      className="px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {[...Array(24)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Episode {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
