'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PrinterAnimationProps {
  status: 'pending' | 'approved' | 'rejected' | 'not_registered'
  username?: string
}

export function PrinterAnimation({ status, username }: PrinterAnimationProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<'printing' | 'complete' | 'cutting'>('printing')

  useEffect(() => {
    if (status === 'approved') {
      const timer = setTimeout(() => {
        setPhase('complete')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }, 3000)
      return () => clearTimeout(timer)
    } else if (status === 'rejected' || status === 'not_registered') {
      const timer = setTimeout(() => {
        setPhase('cutting')
        setTimeout(() => {
          router.push('/register')
        }, 1500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, router])

  const getMessage = () => {
    switch (status) {
      case 'pending':
        return 'Your registration is pending approval. Please wait for admin verification.'
      case 'approved':
        return `Welcome back, ${username}! Access granted.`
      case 'rejected':
        return 'Your registration was rejected. Please register again.'
      case 'not_registered':
        return 'You are not registered. Redirecting to registration...'
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'text-green-500'
      case 'rejected':
      case 'not_registered':
        return 'text-red-500'
      default:
        return 'text-primary'
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8">
        {/* Printer Body */}
        <div className="relative w-80">
          {/* Printer top */}
          <div className="bg-secondary rounded-t-lg h-8 w-full border-x border-t border-border" />
          
          {/* Paper slot */}
          <div className="bg-muted h-2 w-full" />
          
          {/* Paper coming out */}
          <div className="relative overflow-hidden h-64">
            <div
              className={`
                absolute w-full bg-white rounded-b-sm shadow-lg
                ${phase === 'printing' ? 'animate-printer-feed' : ''}
                ${phase === 'cutting' ? 'animate-paper-cut' : ''}
              `}
              style={{ 
                minHeight: '250px',
                transformOrigin: 'top center'
              }}
            >
              {/* Paper content */}
              <div className="p-6 text-background">
                {/* Light TV Logo on paper */}
                <div className="flex items-center gap-2 mb-4 border-b border-gray-300 pb-4">
                  <svg width="40" height="30" viewBox="0 0 120 80">
                    <ellipse cx="35" cy="25" rx="12" ry="14" fill="none" stroke="#0a0a0a" strokeWidth="2" />
                    <path d="M28 38 L28 44 L42 44 L42 38" fill="none" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="35" y1="5" x2="35" y2="0" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="22" y1="12" x2="18" y2="8" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="48" y1="12" x2="52" y2="8" stroke="#0a0a0a" strokeWidth="2" />
                    <text x="55" y="35" fill="#0a0a0a" fontSize="18" fontWeight="bold">ght TV</text>
                  </svg>
                </div>
                
                {/* Status */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">User Status</div>
                  <div className={`text-lg font-bold capitalize ${
                    status === 'approved' ? 'text-green-600' : 
                    status === 'rejected' || status === 'not_registered' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {status === 'not_registered' ? 'Not Registered' : status}
                  </div>
                  
                  {username && (
                    <>
                      <div className="text-sm text-gray-500 mt-4">Username</div>
                      <div className="text-base font-medium">{username}</div>
                    </>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-300 text-sm text-gray-600">
                    {getMessage()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Printer bottom */}
          <div className="bg-secondary rounded-b-lg h-12 w-full border-x border-b border-border flex items-center justify-center gap-2">
            {/* Printer rollers */}
            <div className={`w-4 h-4 bg-muted rounded-full ${phase === 'printing' ? 'animate-printer-roller' : ''}`}>
              <div className="w-1 h-4 bg-border mx-auto" />
            </div>
            <div className={`w-4 h-4 bg-muted rounded-full ${phase === 'printing' ? 'animate-printer-roller' : ''}`}>
              <div className="w-1 h-4 bg-border mx-auto" />
            </div>
          </div>
        </div>
        
        {/* Status message below printer */}
        <div className={`text-center ${getStatusColor()}`}>
          <p className="text-lg font-medium">{getMessage()}</p>
          {status === 'pending' && (
            <p className="text-sm text-muted-foreground mt-2">
              Please check back later or contact admin
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
