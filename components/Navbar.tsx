'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll detection for subtle shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      <div className="w-full px-6 sm:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo with enhanced hover effect */}
        <Link 
          href="/" 
          style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            transition: 'transform 0.2s ease',
          }}
          className="group"
        >
          <span style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--burnt-orange)',
            letterSpacing: '-0.02em',
            transition: 'color 0.2s ease',
          }}>
            SuvAI
          </span>
          <span style={{ 
            fontSize: '1.25rem',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'inline-block',
          }} className="group-hover:rotate-12">
            🍛
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-10">
          <Link
            href="/choose"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.95rem',
              color: 'var(--charcoal)',
              fontWeight: 500,
              textDecoration: 'none',
              position: 'relative',
              padding: '0.5rem 0',
            }}
            className="nav-link"
          >
            <span className="relative z-10">Choose Dish</span>
            <span 
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--burnt-orange)] transition-all duration-300 ease-out group-hover:w-full"
              style={{ backgroundColor: 'var(--burnt-orange)' }}
            />
          </Link>

          {/* CTA Button with enhanced hover */}
          <Link
            href="/cook"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.95rem',
              backgroundColor: 'var(--burnt-orange)',
              color: 'white',
              padding: '0.65rem 1.5rem',
              borderRadius: '100px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--turmeric)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--burnt-orange)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span>Cook Now</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transition: 'transform 0.2s ease' }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Animated Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span 
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--dark)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center',
                transform: menuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none',
              }}
            />
            <span 
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--dark)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
              }}
            />
            <span 
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--dark)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center',
                transform: menuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none',
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu with Slide Animation */}
      <div
        style={{
          backgroundColor: 'var(--cream)',
          borderTop: '1px solid var(--border)',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: menuOpen ? '300px' : '0',
          opacity: menuOpen ? 1 : 0,
        }}
        className="sm:hidden"
      >
        <div 
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
          }}
        >
          <Link
            href="/choose"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1.1rem',
              color: 'var(--charcoal)',
              fontWeight: 500,
              textDecoration: 'none',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'
              e.currentTarget.style.color = 'var(--burnt-orange)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--charcoal)'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🔍</span>
            <span>Choose Dish</span>
          </Link>

          <Link
            href="/cook"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1.1rem',
              color: 'white',
              backgroundColor: 'var(--burnt-orange)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--turmeric)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--burnt-orange)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🥘</span>
            <span>Cook With What You Have</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}