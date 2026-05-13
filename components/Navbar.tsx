'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Flame, Search, ChefHat, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(253, 246, 236, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      <div className="w-full px-6 sm:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 no-underline transition-transform duration-200 hover:scale-[1.02]"
        >
          <span
            className="text-[var(--burnt-orange)] transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            SuvAI
          </span>
          <Flame
            size={24}
            className="text-[var(--burnt-orange)] transition-transform duration-300 group-hover:rotate-12"
            strokeWidth={2}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-10">
          <Link
            href="/choose"
            className="group relative py-2 text-[0.95rem] font-medium text-[var(--charcoal)] no-underline transition-colors duration-200 hover:text-[var(--burnt-orange)]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Choose Dish
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[var(--burnt-orange)] transition-all duration-300 ease-out group-hover:w-full" />
          </Link>

          <Link
            href="/cook"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[0.95rem] font-semibold text-white no-underline shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              backgroundColor: 'var(--burnt-orange)',
            }}
          >
            <span>Cook Now</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span
              className="w-full h-0.5 rounded-sm bg-[var(--dark)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center"
              style={{
                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              className="w-full h-0.5 rounded-sm bg-[var(--dark)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
              }}
            />
            <span
              className="w-full h-0.5 rounded-sm bg-[var(--dark)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="sm:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          backgroundColor: 'var(--cream)',
          borderTop: '1px solid var(--border)',
          maxHeight: menuOpen ? '300px' : '0',
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div
          className="flex flex-col gap-3 p-6 transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
            transitionDelay: menuOpen ? '0.1s' : '0s',
          }}
        >
          <Link
            href="/choose"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[1.1rem] font-medium text-[var(--charcoal)] no-underline transition-all duration-200 hover:bg-black/[0.03] hover:text-[var(--burnt-orange)]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            <Search size={20} strokeWidth={2} className="text-[var(--burnt-orange)]" />
            Choose Dish
          </Link>

          <Link
            href="/cook"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[1.1rem] font-semibold text-white no-underline shadow-md transition-all duration-200 hover:scale-[1.02]"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              backgroundColor: 'var(--burnt-orange)',
            }}
          >
            <ChefHat size={20} strokeWidth={2} />
            Cook With What You Have
          </Link>
        </div>
      </div>
    </nav>
  )
}