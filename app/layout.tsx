import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Light TV - Free Streaming',
  description: 'Watch movies, TV series, and anime for free on Light TV',
  keywords: ['streaming', 'movies', 'tv series', 'anime', 'free'],
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
