import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SuvAI — Tamil Cuisine Chef',
  description: 'Your AI Tamil cuisine chef powered by Gemma 4',
  keywords: ['Tamil cuisine', 'AI chef', 'South Indian food', 'cooking assistant', 'SuvAI'],
  authors: [{ name: 'SuvAI' }],
  openGraph: {
    title: 'SuvAI — Tamil Cuisine Chef',
    description: 'Your AI Tamil cuisine chef powered by Gemma 4',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${playfair.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col`}
        style={{ 
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          backgroundColor: 'var(--cream, #FAFAF8)',
          color: 'var(--charcoal, #2D2D2D)',
        }}
      >
        {/* <Navbar /> */}
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}