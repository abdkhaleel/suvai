'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <Navbar />

      <main className="flex flex-col items-center px-6">

        {/* Hero Section */}
        <section className="text-center pt-24 pb-16 max-w-3xl">
          <p
            className="animate-fade-up"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              color: 'var(--burnt-orange)',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '1.5rem',
              opacity: 0,
            }}
          >
            Tamil Cuisine AI Chef
          </p>

          <h1
            className="animate-fade-up delay-1"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--dark)',
              marginBottom: '1.5rem',
              opacity: 0,
            }}
          >
            உங்கள் சமையல்<br />
            <span style={{ color: 'var(--burnt-orange)' }}>
              கலை தொடங்கட்டும்
            </span>
          </h1>

          <p
            className="animate-fade-up delay-2"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1.1rem',
              color: 'var(--muted)',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto 3rem',
              opacity: 0,
            }}
          >
            Authentic Tamil recipes guided by AI. From Idli to Biryani — 
            your personal chef knows every secret.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-up delay-3"
            style={{
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <Link href="/choose" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
              🔍 Choose a Dish
            </Link>
            <Link href="/cook" className="btn-outline" style={{ width: '100%', textAlign: 'center' }}>
              🥘 Cook With What You Have
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          height: '1px',
          backgroundColor: 'var(--border)',
          margin: '2rem 0'
        }} />

        {/* Features Row */}
        <section
          className="animate-fade-up delay-4 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full pb-24"
          style={{ opacity: 0 }}
        >
          {[
            {
              emoji: '🌿',
              title: 'Authentic Recipes',
              desc: 'Traditional Tamil recipes with step by step guidance'
            },
            {
              emoji: '🗣️',
              title: 'Tamil & English',
              desc: 'Understands Tamil ingredient names naturally'
            },
            {
              emoji: '🔄',
              title: 'Smart Substitutions',
              desc: 'Missing an ingredient? Get instant alternatives'
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                {f.emoji}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.1rem',
                color: 'var(--dark)',
                marginBottom: '0.5rem',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.875rem',
                color: 'var(--muted)',
                lineHeight: 1.6,
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem',
        textAlign: 'center',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.8rem',
        color: 'var(--muted)',
      }}>
        Powered by Gemma 4 · Built with ❤️ for Tamil cuisine
      </footer>
    </div>
  )
}