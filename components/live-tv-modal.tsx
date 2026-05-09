'use client'

import { useEffect } from 'react'

interface LiveTVModalProps {
  onClose: () => void
}

export function LiveTVModal({ onClose }: LiveTVModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-xl border border-border p-8 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold mb-3">Coming Soon</h2>
        <p className="text-muted-foreground mb-6">
          Live TV feature is currently under development. Stay tuned for exciting live channels!
        </p>

        {/* Features preview */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-6">
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-primary font-medium">News</div>
            <div className="text-xs">24/7 Coverage</div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-primary font-medium">Sports</div>
            <div className="text-xs">Live Events</div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-primary font-medium">Entertainment</div>
            <div className="text-xs">Top Channels</div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="text-primary font-medium">Kids</div>
            <div className="text-xs">Family Friendly</div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
