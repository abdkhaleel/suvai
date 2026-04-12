'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--cream)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="w-full px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--burnt-orange)',
            letterSpacing: '-0.02em',
          }}>
            SuvAI
          </span>
          <span style={{ fontSize: '1.1rem' }}>🍛</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/choose"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.9rem',
              color: 'var(--charcoal)',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--burnt-orange)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--charcoal)')}
          >
            Choose Dish
          </Link>
          <Link
            href="/cook"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.9rem',
              backgroundColor: 'var(--burnt-orange)',
              color: 'white',
              padding: '0.5rem 1.2rem',
              borderRadius: '100px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--turmeric)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--burnt-orange)')}
          >
            Cook Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'var(--dark)',
            padding: '0.25rem',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: 'var(--cream)',
            borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          className="sm:hidden"
        >
          <Link
            href="/choose"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1rem',
              color: 'var(--charcoal)',
              fontWeight: 500,
              textDecoration: 'none',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            🔍 Choose Dish
          </Link>
          <Link
            href="/cook"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1rem',
              color: 'var(--burnt-orange)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            🥘 Cook With What You Have
          </Link>
        </div>
      )}
    </nav>
  )
}