'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PermanentBypass() {
  const router = useRouter()

  useEffect(() => {
    // Create a permanent session bypass
    const bypassSession = {
      id: 'permanent-bypass-user',
      username: 'MOA_BYPASS',
      phcorner_user: 'permanent_access',
      status: 'approved',
      bypass: true,
      created_at: new Date().toISOString()
    }

    // Store bypass session
    localStorage.setItem('lightTVUser', JSON.stringify(bypassSession))
    document.cookie = `lightTVSession=${btoa(JSON.stringify(bypassSession))}; path=/; max-age=31536000`

    // Redirect to dashboard after short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Image
        src="/images/light-tv-logo.png"
        alt="Light TV"
        width={180}
        height={100}
        className="mb-6"
        priority
      />
      
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg mb-4">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-green-500 font-medium">MOA Access Granted</span>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Permanent Access Activated</h1>
        <p className="text-muted-foreground mb-4">Bypassing authentication...</p>
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    </div>
  )
}
