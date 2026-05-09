// Token generation and validation for anti-hit-and-run system
// Tokens expire every 2 hours

const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

interface TokenData {
  username: string
  timestamp: number
  expiresAt: number
}

// Simple encoding function (production would use proper crypto)
function encodeToken(data: TokenData): string {
  const json = JSON.stringify(data)
  return Buffer.from(json).toString('base64url')
}

function decodeToken(token: string): TokenData | null {
  try {
    const json = Buffer.from(token, 'base64url').toString()
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function generateToken(username: string): string {
  const now = Date.now()
  const data: TokenData = {
    username,
    timestamp: now,
    expiresAt: now + TOKEN_EXPIRY_MS
  }
  return encodeToken(data)
}

export function validateToken(token: string, expectedUsername?: string): { valid: boolean; expired: boolean; username?: string; timeRemaining?: number } {
  const data = decodeToken(token)
  
  if (!data) {
    return { valid: false, expired: false }
  }

  const now = Date.now()
  
  if (now > data.expiresAt) {
    return { valid: false, expired: true, username: data.username }
  }

  if (expectedUsername && data.username !== expectedUsername) {
    return { valid: false, expired: false }
  }

  return { 
    valid: true, 
    expired: false, 
    username: data.username,
    timeRemaining: data.expiresAt - now
  }
}

export function getTokenExpiryTime(): number {
  return TOKEN_EXPIRY_MS
}
