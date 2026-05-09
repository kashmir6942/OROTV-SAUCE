'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PrinterAnimation } from '@/components/printer-animation'

type UserStatus = 'not_registered' | 'pending' | 'approved' | 'rejected' | 'loading'

export default function Home() {
  const [status, setStatus] = useState<UserStatus>('loading')
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    // Check if user has a session
    const session = localStorage.getItem('lightTVUser')
    
    if (!session) {
      setStatus('not_registered')
      return
    }

    try {
      const userData = JSON.parse(session)
      setUsername(userData.username || '')

      // Check status from server
      const res = await fetch(`/api/auth/status?userId=${userData.id}`)
      const data = await res.json()

      if (data.status === 'approved') {
        setStatus('approved')
        // Generate token and redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else if (data.status === 'rejected') {
        setStatus('rejected')
      } else if (data.status === 'pending') {
        setStatus('pending')
        // Poll for status updates every 10 seconds
        setTimeout(checkUserStatus, 10000)
      } else {
        setStatus('not_registered')
      }
    } catch (error) {
      console.error('Failed to check status:', error)
      setStatus('not_registered')
    }
  }

  // Not registered - show register/login options
  if (status === 'not_registered') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Image
          src="/images/light-tv-logo.png"
          alt="Light TV"
          width={200}
          height={100}
          className="mb-8"
          priority
        />
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Welcome to Light TV</h1>
        <p className="text-muted-foreground mb-8 text-center">Free streaming for PHCorner users</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a
            href="/register"
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium text-center hover:bg-primary/90 transition-colors"
          >
            Register
          </a>
          <a
            href="/login"
            className="w-full py-3 px-6 bg-secondary text-foreground rounded-lg font-medium text-center hover:bg-muted transition-colors"
          >
            Login
          </a>
        </div>

        {/* Referral Link */}
        <div className="mt-12 p-4 bg-card border border-border rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">Share Light TV with friends!</p>
          <a
            href="https://v0.app/ref/WKEGIU"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm font-medium"
          >
            https://v0.app/ref/WKEGIU
          </a>
        </div>
      </div>
    )
  }

  // Loading state
  if (status === 'loading') {
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
        <p className="text-muted-foreground">Checking your status...</p>
      </div>
    )
  }

  // Pending, Approved, or Rejected - show printer animation
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
      
      <PrinterAnimation 
        status={status} 
        username={username}
        onComplete={() => {
          if (status === 'approved') {
            router.push('/dashboard')
          } else if (status === 'rejected') {
            // Clear session and redirect to register
            localStorage.removeItem('lightTVUser')
            setTimeout(() => {
              router.push('/register')
            }, 3000)
          }
        }}
      />

      {status === 'pending' && (
        <div className="mt-8 text-center">
          <p className="text-yellow-500 font-medium mb-2">Waiting for admin approval...</p>
          <p className="text-muted-foreground text-sm">Your application is being reviewed</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {status === 'rejected' && (
        <div className="mt-8 text-center">
          <p className="text-red-500 font-medium mb-2">Registration Rejected</p>
          <p className="text-muted-foreground text-sm">Redirecting to registration page...</p>
        </div>
      )}

      {status === 'approved' && (
        <div className="mt-8 text-center">
          <p className="text-green-500 font-medium mb-2">Welcome to Light TV!</p>
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      )}
    </div>
  )
}
