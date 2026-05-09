'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    phcornerUser: '',
    password: '',
    retypePassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.retypePassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!formData.phcornerUser) {
      setError('PHCorner username is required')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          phcornerUser: formData.phcornerUser,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect to pending page with printer animation
      router.push('/pending')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Light TV Logo */}
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/L%20ght-IENA05Jy09LOJLqZ0Ptt2Sl6TPQhqj.png"
          alt="Light TV"
          width={150}
          height={100}
          className="mb-2"
          priority
        />
        <p className="text-muted-foreground text-sm">Free Streaming Platform</p>
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="phcornerUser" className="block text-sm font-medium mb-2">
              PHCorner Username <span className="text-red-500">*</span>
            </label>
            <input
              id="phcornerUser"
              type="text"
              required
              value={formData.phcornerUser}
              onChange={(e) => setFormData({ ...formData, phcornerUser: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="Your PHCorner username"
            />
            <p className="text-xs text-muted-foreground mt-1">Required for verification</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="retypePassword" className="block text-sm font-medium mb-2">
              Retype Password
            </label>
            <input
              id="retypePassword"
              type="password"
              required
              value={formData.retypePassword}
              onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="Retype your password"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              'Tap to Approve'
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Your IP will be recorded for anti hit-and-run purposes
          </p>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Referral link */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground mb-2">First time here? Use our referral:</p>
          <a
            href="https://v0.app/ref/WKEGIU"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            v0.app/ref/WKEGIU
          </a>
        </div>
      </div>
    </div>
  )
}
