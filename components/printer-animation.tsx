'use client'

import { useEffect, useState } from 'react'

interface PrinterAnimationProps {
  status: 'pending' | 'approved' | 'rejected' | 'not_registered' | 'loading'
  username?: string
  onComplete?: () => void
}

export function PrinterAnimation({ status, username, onComplete }: PrinterAnimationProps) {
  const [phase, setPhase] = useState<'idle' | 'printing' | 'complete' | 'cutting' | 'cut'>('idle')

  useEffect(() => {
    // Start printing animation
    setPhase('printing')

    const printTimeout = setTimeout(() => {
      if (status === 'approved') {
        setPhase('complete')
        setTimeout(() => {
          onComplete?.()
        }, 1500)
      } else if (status === 'rejected' || status === 'not_registered') {
        setPhase('cutting')
        setTimeout(() => {
          setPhase('cut')
          setTimeout(() => {
            onComplete?.()
          }, 1000)
        }, 800)
      } else if (status === 'pending') {
        setPhase('complete')
      }
    }, 2500)

    return () => clearTimeout(printTimeout)
  }, [status, onComplete])

  const getMessage = () => {
    switch (status) {
      case 'pending':
        return 'Awaiting Admin Approval'
      case 'approved':
        return `Welcome, ${username || 'User'}!`
      case 'rejected':
        return 'Registration Rejected'
      case 'not_registered':
        return 'Not Registered'
      default:
        return 'Processing...'
    }
  }

  const getStatusEmoji = () => {
    switch (status) {
      case 'approved':
        return '✓'
      case 'rejected':
      case 'not_registered':
        return '✗'
      default:
        return '⏳'
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Printer Body */}
      <div className="relative w-72">
        {/* Printer top with slot */}
        <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-t-2xl h-10 w-full border-x border-t border-zinc-600 shadow-lg">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-zinc-900 rounded-full" />
        </div>
        
        {/* Paper slot */}
        <div className="bg-zinc-900 h-3 w-full shadow-inner" />
        
        {/* Paper coming out */}
        <div className="relative overflow-hidden h-56">
          <div
            className={`
              absolute left-0 right-0 mx-auto w-[90%] bg-white rounded-b-sm shadow-xl
              transition-all duration-1000 ease-out
              ${phase === 'idle' ? 'translate-y-[-100%]' : ''}
              ${phase === 'printing' ? 'translate-y-0' : ''}
              ${phase === 'complete' ? 'translate-y-0' : ''}
              ${phase === 'cutting' ? 'translate-y-0 opacity-100' : ''}
              ${phase === 'cut' ? 'translate-y-[200%] rotate-12 opacity-0' : ''}
            `}
            style={{ 
              minHeight: '220px',
              transformOrigin: 'top center'
            }}
          >
            {/* Dotted cut line for rejected */}
            {(status === 'rejected' || status === 'not_registered') && phase === 'cutting' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 border-t-2 border-dashed border-red-400 animate-pulse" />
            )}
            
            {/* Paper content */}
            <div className="p-5 text-zinc-900">
              {/* Logo area */}
              <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-zinc-200">
                <div className="text-xs font-bold tracking-wider text-zinc-600">LIGHT TV</div>
              </div>
              
              {/* Status Badge */}
              <div className={`
                mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4
                ${status === 'approved' ? 'bg-green-100 text-green-600' : ''}
                ${status === 'rejected' || status === 'not_registered' ? 'bg-red-100 text-red-600' : ''}
                ${status === 'pending' ? 'bg-yellow-100 text-yellow-600' : ''}
              `}>
                {getStatusEmoji()}
              </div>
              
              {/* Status Text */}
              <div className="text-center space-y-2">
                <div className={`text-lg font-bold
                  ${status === 'approved' ? 'text-green-600' : ''}
                  ${status === 'rejected' || status === 'not_registered' ? 'text-red-600' : ''}
                  ${status === 'pending' ? 'text-yellow-600' : ''}
                `}>
                  {getMessage()}
                </div>
                
                {username && (
                  <div className="text-sm text-zinc-500">
                    User: <span className="font-medium text-zinc-700">{username}</span>
                  </div>
                )}
                
                <div className="text-xs text-zinc-400 pt-2">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Paper tear edge for cut effect */}
            {phase === 'cut' && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-zinc-200 to-transparent" 
                   style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)' }} />
            )}
          </div>
        </div>
        
        {/* Printer bottom with rollers */}
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-2xl h-14 w-full border-x border-b border-zinc-700 flex items-center justify-center gap-6 shadow-lg">
          {/* Animated rollers */}
          <div className={`w-5 h-5 bg-zinc-600 rounded-full border-2 border-zinc-500 ${phase === 'printing' ? 'animate-spin' : ''}`}>
            <div className="w-full h-0.5 bg-zinc-400 mt-2" />
          </div>
          <div className="w-20 h-2 bg-zinc-700 rounded-full" />
          <div className={`w-5 h-5 bg-zinc-600 rounded-full border-2 border-zinc-500 ${phase === 'printing' ? 'animate-spin' : ''}`}>
            <div className="w-full h-0.5 bg-zinc-400 mt-2" />
          </div>
        </div>
        
        {/* Status LED */}
        <div className={`
          absolute top-3 right-4 w-2 h-2 rounded-full
          ${status === 'approved' ? 'bg-green-500 shadow-green-500/50' : ''}
          ${status === 'rejected' || status === 'not_registered' ? 'bg-red-500 shadow-red-500/50' : ''}
          ${status === 'pending' ? 'bg-yellow-500 shadow-yellow-500/50' : ''}
          shadow-lg animate-pulse
        `} />
      </div>
    </div>
  )
}
