import { NextRequest, NextResponse } from 'next/server'
import { generateToken, validateToken } from '@/lib/token'

// Generate a new token for a user
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    const token = generateToken(username)
    
    return NextResponse.json({ 
      token,
      expiresIn: 2 * 60 * 60 * 1000, // 2 hours
      message: 'Token generated successfully'
    })
  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}

// Validate a token
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const username = searchParams.get('username')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const result = validateToken(token, username || undefined)
  
  return NextResponse.json(result)
}
