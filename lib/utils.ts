// Utility functions for Light TV

export function cn(...classes: (string | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function getClientIP(): string {
  // This will be set from the server
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userIP') || '0.0.0.0'
  }
  return '0.0.0.0'
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function getSearchQuery(url: string): string {
  const params = new URLSearchParams(new URL(url).search)
  return params.get('q') || ''
}

export const CONTENT_DATA = {
  movies: [
    {
      id: '1',
      title: 'The Matrix',
      category: 'movies',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop',
      description: 'A computer hacker learns about the true nature of his reality.',
      year: 1999,
    },
    {
      id: '2',
      title: 'Inception',
      category: 'movies',
      image: 'https://images.unsplash.com/photo-1595429676962-88246814b13f?w=300&h=400&fit=crop',
      description: 'A skilled thief who steals corporate secrets through dream-sharing technology.',
      year: 2010,
    },
    {
      id: '3',
      title: 'Interstellar',
      category: 'movies',
      image: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=300&h=400&fit=crop',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      year: 2014,
    },
    {
      id: '4',
      title: 'The Dark Knight',
      category: 'movies',
      image: 'https://images.unsplash.com/photo-1548318065-5efb14b80c69?w=300&h=400&fit=crop',
      description: 'Batman fights against the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.',
      year: 2008,
    },
    {
      id: '5',
      title: 'Pulp Fiction',
      category: 'movies',
      image: 'https://images.unsplash.com/photo-1489599849228-da7df45cc10e?w=300&h=400&fit=crop',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.',
      year: 1994,
    },
  ],
  series: [
    {
      id: '6',
      title: 'Breaking Bad',
      category: 'series',
      image: 'https://images.unsplash.com/photo-1536440936694-5a1f08e7eb1d?w=300&h=400&fit=crop',
      description: 'A chemistry teacher turns to producing methamphetamine to provide for his family.',
      year: 2008,
    },
    {
      id: '7',
      title: 'Game of Thrones',
      category: 'series',
      image: 'https://images.unsplash.com/photo-1533082566322-f60e92b1411b?w=300&h=400&fit=crop',
      description: 'Nine noble families fight for control over the lands of Westeros.',
      year: 2011,
    },
    {
      id: '8',
      title: 'Stranger Things',
      category: 'series',
      image: 'https://images.unsplash.com/photo-1535223289827-42f1b9fac889?w=300&h=400&fit=crop',
      description: 'When a young boy disappears, his friends discover secret experiments and terrifying supernatural forces.',
      year: 2016,
    },
    {
      id: '9',
      title: 'The Office',
      category: 'series',
      image: 'https://images.unsplash.com/photo-1555688336-e8c0bed85c75?w=300&h=400&fit=crop',
      description: 'The everyday lives of office employees in a paper company.',
      year: 2005,
    },
    {
      id: '10',
      title: 'Sherlock',
      category: 'series',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=300&h=400&fit=crop',
      description: 'A modern update to Sherlock Holmes in contemporary London.',
      year: 2010,
    },
  ],
  anime: [
    {
      id: '11',
      title: 'Attack on Titan',
      category: 'anime',
      image: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=300&h=400&fit=crop',
      description: 'Humanity fights back against giant humanoid creatures called Titans.',
      year: 2013,
    },
    {
      id: '12',
      title: 'Demon Slayer',
      category: 'anime',
      image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=400&fit=crop',
      description: 'A young boy joins the demon slayer corps to find a cure for his sister.',
      year: 2019,
    },
    {
      id: '13',
      title: 'Death Note',
      category: 'anime',
      image: 'https://images.unsplash.com/photo-1535720595491-9b7f8d8fbd18?w=300&h=400&fit=crop',
      description: 'A high school student finds a supernatural notebook that allows him to kill anyone.',
      year: 2006,
    },
    {
      id: '14',
      title: 'Naruto',
      category: 'anime',
      image: 'https://images.unsplash.com/photo-1578070382579-1fc953dac6db?w=300&h=400&fit=crop',
      description: 'A young ninja dreams of becoming the strongest ninja and leader of his village.',
      year: 2002,
    },
    {
      id: '15',
      title: 'One Piece',
      category: 'anime',
      image: 'https://images.unsplash.com/photo-1577720643272-265e434f3ce6?w=300&h=400&fit=crop',
      description: 'A pirate crew searches for treasure and freedom on the Grand Line.',
      year: 1999,
    },
  ],
}

export const REFERRAL_URL = 'https://v0.app/ref/WKEGIU'
