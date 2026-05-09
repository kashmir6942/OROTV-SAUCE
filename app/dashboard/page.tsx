'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/header'
import { ContentSection } from '@/components/content-section'
import { SearchModal } from '@/components/search-modal'
import { LiveTVModal } from '@/components/live-tv-modal'
import { PrinterAnimation } from '@/components/printer-animation'
import { AdBlocker } from '@/components/ad-blocker'
import { ReferralSection } from '@/components/referral-section'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userStatus, setUserStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'movies' | 'tv' | 'anime' | 'live'>('movies')
  const [showSearch, setShowSearch] = useState(false)
  const [showLiveTV, setShowLiveTV] = useState(false)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const status = document.cookie
        .split('; ')
        .find(row => row.startsWith('lighttv_status='))
        ?.split('=')[1]

      const userId = document.cookie
        .split('; ')
        .find(row => row.startsWith('lighttv_user_id='))

      if (!userId) {
        setIsAuthenticated(false)
        setUserStatus('not_registered')
        return
      }

      if (status === 'approved') {
        setIsAuthenticated(true)
        setUserStatus('approved')
      } else if (status === 'pending') {
        setUserStatus('pending')
        setIsAuthenticated(false)
      } else if (status === 'rejected') {
        setUserStatus('rejected')
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(false)
        setUserStatus('not_registered')
      }
    }

    checkAuth()
  }, [])

  // Show printer animation for non-approved users
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated && userStatus) {
    return <PrinterAnimation status={userStatus as 'pending' | 'rejected' | 'not_registered'} />
  }

  const handleTabClick = (tab: 'movies' | 'tv' | 'anime' | 'live') => {
    if (tab === 'live') {
      setShowLiveTV(true)
    } else {
      setActiveTab(tab)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdBlocker />
      <Header onSearchClick={() => setShowSearch(true)} />
      
      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'movies', label: 'Movies' },
              { id: 'tv', label: 'TV Series' },
              { id: 'anime', label: 'Anime' },
              { id: 'live', label: 'Live TV' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'movies' && (
          <div className="space-y-8">
            <ReferralSection />
            <ContentSection title="Trending Movies" type="movie" category="trending" />
            <ContentSection title="Popular Movies" type="movie" category="popular" />
            <ContentSection title="Top Rated Movies" type="movie" category="top_rated" />
            <ContentSection title="Now Playing" type="movie" category="now_playing" />
          </div>
        )}

        {activeTab === 'tv' && (
          <div className="space-y-8">
            <ContentSection title="Trending TV Shows" type="tv" category="trending" />
            <ContentSection title="Popular TV Shows" type="tv" category="popular" />
            <ContentSection title="Top Rated TV Shows" type="tv" category="top_rated" />
            <ContentSection title="On The Air" type="tv" category="on_the_air" />
          </div>
        )}

        {activeTab === 'anime' && (
          <div className="space-y-8">
            <ContentSection title="Trending Anime" type="anime" category="trending" />
            <ContentSection title="Popular Anime" type="anime" category="popular" />
            <ContentSection title="Top Rated Anime" type="anime" category="top_rated" />
            <ContentSection title="Airing Now" type="anime" category="airing" />
          </div>
        )}
      </main>

      {/* Search Modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      {/* Live TV Modal */}
      {showLiveTV && <LiveTVModal onClose={() => setShowLiveTV(false)} />}
    </div>
  )
}
