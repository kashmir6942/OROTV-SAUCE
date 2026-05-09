import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    
    const { data: user, error } = await supabase
      .from('users')
      .select('status')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ status: 'not_found' })
    }

    return NextResponse.json({ status: user.status })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}
