'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/header'
import { ContentSection } from '@/components/content-section'
import { SearchModal } from '@/components/search-modal'
import { LiveTVModal } from '@/components/live-tv-modal'
import { AdBlocker } from '@/components/ad-blocker'

const TOKEN_CHECK_INTERVAL = 60 * 1000 // Check every minute
const TOKEN_EXPIRY_WARNING = 5 * 60 * 1000 // Warning 5 minutes before expiry

export default function UserMoviesPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const user = params.user as string
  const tokenlink = searchParams.get('tokenlink')
  
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [showWarning, setShowWarning] = useState(false)
  const [activeTab, setActiveTab] = useState<'movies' | 'tv' | 'anime' | 'live'>('movies')
  const [showSearch, setShowSearch] = useState(false)
  const [showLiveTV, setShowLiveTV] = useState(false)

  const validateAndRefreshToken = useCallback(async () => {
    if (!tokenlink) {
      setIsValid(false)
      return
    }

    try {
      const res = await fetch(`/api/token?token=${tokenlink}&username=${user}`)
      const data = await res.json()

      if (data.valid) {
        setIsValid(true)
        setTimeRemaining(data.timeRemaining || 0)
        
        // Show warning if less than 5 minutes remaining
        if (data.timeRemaining && data.timeRemaining < TOKEN_EXPIRY_WARNING) {
          setShowWarning(true)
        }
      } else if (data.expired) {
        // Token expired - generate new one and reload
        await refreshToken()
      } else {
        setIsValid(false)
      }
    } catch (error) {
      console.error('Token validation error:', error)
      setIsValid(false)
    }
  }, [tokenlink, user])

  const refreshToken = async () => {
    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user })
      })
      const data = await res.json()

      if (data.token) {
        // Redirect to same page with new token
        const newUrl = `/user/usermovies/${user}?tokenlink=${data.token}`
        window.location.href = newUrl
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      router.push('/')
    }
  }

  useEffect(() => {
    // Initial validation
    validateAndRefreshToken()

    // Set up periodic token check
    const interval = setInterval(validateAndRefreshToken, TOKEN_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [validateAndRefreshToken])

  // Auto-reload when token is about to expire
  useEffect(() => {
    if (timeRemaining > 0 && timeRemaining < TOKEN_EXPIRY_WARNING) {
      setShowWarning(true)
    }

    if (timeRemaining > 0 && timeRemaining < 30000) {
      // Less than 30 seconds - auto refresh
      refreshToken()
    }
  }, [timeRemaining])

  // Format time remaining
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Invalid or no token
  if (isValid === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Image
          src="/images/light-tv-logo.png"
          alt="Light TV"
          width={150}
          height={80}
          className="mb-6"
          priority
        />
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center max-w-md">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-500 mb-2">Invalid or Expired Token</h2>
          <p className="text-muted-foreground mb-4">
            Your access token is invalid or has expired. Please login again to continue watching.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isValid === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Image
          src="/images/light-tv-logo.png"
          alt="Light TV"
          width={150}
          height={80}
          className="mb-6 animate-pulse"
          priority
        />
        <p className="text-muted-foreground">Validating access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdBlocker />
      
      {/* Token Warning Banner */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500/90 text-black py-2 px-4 text-center text-sm font-medium z-50">
          Token expires in {formatTime(timeRemaining)} - Page will auto-refresh
          <button 
            onClick={refreshToken}
            className="ml-4 px-3 py-1 bg-black/20 rounded hover:bg-black/30 transition-colors"
          >
            Refresh Now
          </button>
        </div>
      )}

      <Header onSearchClick={() => setShowSearch(true)} />

      {/* User Badge */}
      <div className="container mx-auto px-4 py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-muted-foreground">Watching as</span>
          <span className="font-medium text-primary">{user}</span>
          <span className="text-xs text-muted-foreground">| Token: {formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['movies', 'tv', 'anime', 'live'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'live') {
                  setShowLiveTV(true)
                } else {
                  setActiveTab(tab)
                }
              }}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-muted'
              }`}
            >
              {tab === 'movies' && 'Movies'}
              {tab === 'tv' && 'TV Series'}
              {tab === 'anime' && 'Anime'}
              {tab === 'live' && 'Live TV'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'movies' && (
          <div className="space-y-8">
            <ContentSection title="Trending Movies" type="movie" category="trending" />
            <ContentSection title="Popular Movies" type="movie" category="popular" />
            <ContentSection title="Top Rated Movies" type="movie" category="top_rated" />
          </div>
        )}

        {activeTab === 'tv' && (
          <div className="space-y-8">
            <ContentSection title="Trending TV Series" type="tv" category="trending" />
            <ContentSection title="Popular TV Series" type="tv" category="popular" />
            <ContentSection title="Top Rated TV Series" type="tv" category="top_rated" />
          </div>
        )}

        {activeTab === 'anime' && (
          <div className="space-y-8">
            <ContentSection title="Trending Anime" type="anime" category="trending" />
            <ContentSection title="Popular Anime" type="anime" category="popular" />
            <ContentSection title="Top Rated Anime" type="anime" category="top_rated" />
          </div>
        )}
      </main>

      {/* Modals */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showLiveTV && <LiveTVModal onClose={() => setShowLiveTV(false)} />}
    </div>
  )
}
