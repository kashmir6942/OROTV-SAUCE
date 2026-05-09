import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OGVkZDM1M2I3MGRmNjNhNDdkZjEyMTRlZTBmNTllZiIsInN1YiI6IjY2M2RhODI1Yjc4ODZmMDliZTdlYzY4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q91N_vNuQXjn4BYPvuJXlZ_UVrxMgBJQ0fE_8RH8KcI'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const getEndpoint = (type: string, category: string): string => {
  if (type === 'anime') {
    // For anime, we filter TV shows with animation genre and Japanese origin
    switch (category) {
      case 'trending':
        return '/trending/tv/week'
      case 'popular':
        return '/discover/tv'
      case 'top_rated':
        return '/discover/tv'
      case 'airing':
        return '/discover/tv'
      default:
        return '/discover/tv'
    }
  }
  
  if (type === 'movie') {
    switch (category) {
      case 'trending':
        return '/trending/movie/week'
      case 'popular':
        return '/movie/popular'
      case 'top_rated':
        return '/movie/top_rated'
      case 'now_playing':
        return '/movie/now_playing'
      default:
        return '/movie/popular'
    }
  }
  
  // TV shows
  switch (category) {
    case 'trending':
      return '/trending/tv/week'
    case 'popular':
      return '/tv/popular'
    case 'top_rated':
      return '/tv/top_rated'
    case 'on_the_air':
      return '/tv/on_the_air'
    default:
      return '/tv/popular'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'movie'
    const category = searchParams.get('category') || 'popular'

    const endpoint = getEndpoint(type, category)
    
    let url = `${TMDB_BASE_URL}${endpoint}`
    const params = new URLSearchParams({
      language: 'en-US',
      page: '1',
    })

    // Add anime-specific filters
    if (type === 'anime') {
      params.set('with_genres', '16') // Animation genre
      params.set('with_original_language', 'ja') // Japanese origin
      if (category === 'airing') {
        params.set('air_date.gte', new Date().toISOString().split('T')[0])
      }
      if (category === 'top_rated') {
        params.set('sort_by', 'vote_average.desc')
        params.set('vote_count.gte', '100')
      }
      if (category === 'popular') {
        params.set('sort_by', 'popularity.desc')
      }
    }

    url = `${url}?${params.toString()}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch content')
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Content API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content', results: [] },
      { status: 500 }
    )
  }
}
