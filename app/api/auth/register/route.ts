import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// @ts-ignore
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, phcornerUser, password } = await request.json()

    if (!username || !phcornerUser || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Get user's IP address for anti hit-and-run
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0] || headersList.get('x-real-ip') || 'unknown'

    const supabase = await createClient()

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new user with pending status
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        phcorner_user: phcornerUser,
        password_hash: passwordHash,
        ip_address: ipAddress,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
        { status: 500 }
      )
    }

    // Set cookie for username
    const response = NextResponse.json({
      message: 'Registration successful. Awaiting admin approval.',
      userId: data.id,
    })

    response.cookies.set('lighttv_username', username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    response.cookies.set('lighttv_user_id', data.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
