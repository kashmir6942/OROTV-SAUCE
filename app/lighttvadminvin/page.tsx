'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface User {
  id: string
  username: string
  phcorner_user: string
  ip_address: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?status=${filter}`)
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="/images/light-tv-logo.png"
            alt="Light TV"
            width={100}
            height={50}
          />
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Manage user registrations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500 text-sm font-medium">Secret Panel</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 font-medium">Username</th>
                <th className="text-left p-4 font-medium">PHCorner User</th>
                <th className="text-left p-4 font-medium">IP Address</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Registered</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4 text-primary">{user.phcorner_user}</td>
                    <td className="p-4 text-muted-foreground font-mono text-sm">{user.ip_address}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'approved'
                            ? 'bg-green-500/20 text-green-500'
                            : user.status === 'rejected'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">{formatDate(user.created_at)}</td>
                    <td className="p-4">
                      {user.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateUserStatus(user.id, 'approved')}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === user.id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.id, 'rejected')}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === user.id ? '...' : 'Reject'}
                          </button>
                        </div>
                      )}
                      {user.status !== 'pending' && (
                        <button
                          onClick={() => updateUserStatus(user.id, user.status === 'approved' ? 'rejected' : 'approved')}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground rounded text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {actionLoading === user.id ? '...' : user.status === 'approved' ? 'Revoke' : 'Approve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-500">
            {users.filter(u => u.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500">
            {users.filter(u => u.status === 'approved').length}
          </div>
          <div className="text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-red-500">
            {users.filter(u => u.status === 'rejected').length}
          </div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </div>
      </div>
    </div>
  )
}
