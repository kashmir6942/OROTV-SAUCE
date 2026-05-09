'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onSearchClick: () => void
}

export function Header({ onSearchClick }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'lighttv_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'lighttv_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'lighttv_status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/light-tv-logo.png"
            alt="Light TV"
            width={120}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-muted rounded-lg transition-colors"
            aria-label="Search"
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="hidden sm:inline text-sm">Search</span>
          </button>

          {/* Settings Button */}
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-muted rounded-lg transition-colors"
            aria-label="Settings"
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
              <circle cx="12" cy="12" r="1" />
              <path d="M12 1v6m0 6v6" />
              <path d="M4.22 4.22l4.24 4.24m0 5.08l-4.24 4.24" />
              <path d="M19.78 4.22l-4.24 4.24m0 5.08l4.24 4.24" />
            </svg>
            <span className="hidden sm:inline text-sm">Settings</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
            aria-label="Logout"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
