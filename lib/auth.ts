import { cookies } from 'next/headers'

export interface SessionData {
  userId: string
  username: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('lightTVSession')

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value) as SessionData
    return session
  } catch {
    return null
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('lightTVSession', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('lightTVSession')
}

export function validatePassword(
  password: string,
  minLength: number = 6
): boolean {
  return password.length >= minLength
}

export function validateUsername(username: string): boolean {
  // Username must be alphanumeric and 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

export function validatePhcornerUser(phcornerUser: string): boolean {
  // Basic validation for phcorner user (non-empty string)
  return phcornerUser.trim().length > 0
}
