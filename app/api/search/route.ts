import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OGVkZDM1M2I3MGRmNjNhNDdkZjEyMTRlZTBmNTllZiIsInN1YiI6IjY2M2RhODI1Yjc4ODZmMDliZTdlYzY4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q91N_vNuQXjn4BYPvuJXlZ_UVrxMgBJQ0fE_8RH8KcI'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error('Search failed')
    }

    const data = await res.json()

    // Filter to only include movies and TV shows (not people)
    const filteredResults = data.results?.filter(
      (item: { media_type: string }) => item.media_type === 'movie' || item.media_type === 'tv'
    ) || []

    return NextResponse.json({ results: filteredResults })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    )
  }
}
