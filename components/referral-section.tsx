'use client'

import { useState } from 'react'
import Link from 'next/link'
import { REFERRAL_URL } from '@/lib/utils'

export function ReferralSection() {
  const [copied, setCopied] = useState(false)

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(REFERRAL_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Invite Friends to Light TV</h3>
      <p className="mb-4 text-sm">Share your referral link and earn rewards</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={REFERRAL_URL}
          readOnly
          className="flex-1 bg-white/20 border border-white/30 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleCopyReferral}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded text-sm font-medium transition"
        >
          {copied ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
