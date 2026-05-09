'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    // Clear session
    document.cookie = 'lightTVSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Session Status
                </label>
                <p className="text-green-400 font-medium">Active</p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="ml-3 text-slate-300">Autoplay videos</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="ml-3 text-slate-300">High quality by default</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="ml-3 text-slate-300">Enable notifications</span>
              </label>
            </div>
          </div>

          {/* About */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About Light TV</h2>
            <div className="text-slate-300 space-y-2">
              <p>
                <span className="font-medium">Version:</span> 1.0.0
              </p>
              <p>
                <span className="font-medium">Built with:</span> Next.js, React, Supabase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>
            <p className="text-slate-300 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
