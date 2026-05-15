'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Search,
  Loader2,
  Frown,
  Soup,
  ArrowRight,
  CookingPot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Recipe {
  id: string
  name: string
  tamil_name: string
  category: string
  tags: string[]
  commonly_served_with: string[]
  similarity: number
}

const ITEMS_PER_PAGE = 9

export default function ChoosePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ── Mount: load recipes immediately, fetch categories in parallel ──
  useEffect(() => {
    let cancelled = false

    async function loadRecipes() {
      setSearched(true)
      setLoading(true)
      setCurrentPage(1)
      try {
        const res = await fetch('/api/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'dish',
            query: 'Tamil South Indian recipe',
            category: 'All',
          }),
        })
        const data = await res.json()
        if (!cancelled) setResults(data.results || [])
      } catch (err) {
        console.error('Recipe load error:', err)
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()

        const raw = (data.categories || [])
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0)

        const seen = new Set<string>()
        const unique: string[] = []
        for (const cat of raw) {
          const lower = cat.toLowerCase()
          if (!seen.has(lower)) {
            seen.add(lower)
            unique.push(cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase())
          }
        }

        if (!cancelled) setCategories(['All', ...unique])
      } catch (err) {
        console.error('Category load error:', err)
      }
    }

    loadRecipes()
    loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    setActiveCategory('')
    setCurrentPage(1)

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'dish', query }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      console.error(err)
      setResults([])
    }

    setLoading(false)
  }

  async function handleCategory(cat: string) {
    setActiveCategory(cat)
    setSearched(true)
    setLoading(true)
    setQuery('')
    setCurrentPage(1)

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'dish',
          query: 'Tamil South Indian recipe',
          category: cat,
        }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      console.error(err)
      setResults([])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <Navbar />

      <main className="w-full max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="animate-fade-up mb-10" style={{ opacity: 0 }}>
          <p
            className="uppercase tracking-[0.15em] text-xs font-semibold mb-3 text-[var(--burnt-orange)]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Browse Recipes
          </p>
          <h1
            className="font-bold leading-tight text-[var(--dark)]"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            What would you like
            <br />
            <span className="text-[var(--burnt-orange)]">to cook today?</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="animate-fade-up delay-1 mb-6"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — try 'idli', 'spicy dosa'..."
              className="flex-1 px-5 py-3.5 rounded-full border-2 border-[var(--border)] bg-white text-[var(--dark)] text-base outline-none transition-colors duration-200 focus:border-[var(--burnt-orange)]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                backgroundColor: 'var(--burnt-orange)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} strokeWidth={2.5} />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {/* Category Filters */}
        <div
          className="animate-fade-up delay-2 flex flex-wrap gap-2 mb-10"
          style={{ opacity: 0 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  activeCategory === cat
                    ? 'text-white'
                    : 'bg-white text-[var(--muted)] border border-[var(--border)] hover:border-[var(--burnt-orange)] hover:text-[var(--burnt-orange)]'
                }
              `}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                backgroundColor:
                  activeCategory === cat ? 'var(--burnt-orange)' : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <CookingPot
              size={48}
              className="text-[var(--burnt-orange)] animate-spin"
              strokeWidth={1.5}
            />
            <p
              className="text-sm text-[var(--muted)]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Chef is searching the cookbook...
            </p>
          </div>
        )}

        {/* Default State */}
        {!loading && !searched && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Soup
              size={48}
              className="text-[var(--burnt-orange)]"
              strokeWidth={1.5}
            />
            <p
              className="text-lg text-[var(--muted)]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Search a dish or pick a category above
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Frown size={48} className="text-[var(--muted)]" strokeWidth={1.5} />
            <h3
              className="text-xl font-bold text-[var(--dark)]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Hmm, I don't know that dish
            </h3>
            <p
              className="text-sm text-[var(--muted)] max-w-md"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              SuvAI specializes in Tamil cuisine.
              <br />
              Try searching for idli, dosa, pongal, sambar...
            </p>
            <button
              onClick={() => {
                setQuery('')
                setSearched(false)
                setResults([])
                setActiveCategory('')
                setCurrentPage(1)
              }}
              className="btn-outline mt-2 text-sm px-6 py-2.5"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && paginatedResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedResults.map((recipe, i) => (
              <Link
                key={recipe.id}
                href={`/chat?id=${recipe.id}&name=${encodeURIComponent(recipe.name)}`}
                className="group block"
              >
                <div
                  className="animate-fade-up h-full p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--burnt-orange)] hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                >
                  {/* Category Badge */}
                  <span
                    className="inline-block mb-4 px-3 py-1 rounded-full text-xs capitalize border border-[var(--border)] text-[var(--muted)]"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      backgroundColor: 'var(--cream)',
                    }}
                  >
                    {recipe.category || 'Tamil Recipe'}
                  </span>

                  {/* Recipe Name */}
                  <h3
                    className="text-lg font-bold text-[var(--dark)] mb-1 leading-snug"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {recipe.name.split('|')[0].split('Recipe')[0].trim()}
                  </h3>

                  {/* Tamil Name */}
                  {recipe.tamil_name && (
                    <p
                      className="text-sm text-[var(--burnt-orange)] mb-4"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                      {recipe.tamil_name.split('/')[0].trim()}
                    </p>
                  )}

                  {/* Tags */}
                  {recipe.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[0.7rem] font-medium"
                          style={{
                            fontFamily: 'var(--font-dm-sans)',
                            backgroundColor: '#FEF3E2',
                            color: 'var(--burnt-orange)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Served With */}
                  {recipe.commonly_served_with?.length > 0 && (
                    <p
                      className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-3"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                      Served with:{' '}
                      {recipe.commonly_served_with.slice(0, 2).join(', ')}
                    </p>
                  )}

                  {/* Cook CTA */}
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--burnt-orange)] transition-all duration-200 group-hover:gap-2.5">
                    Start Cooking
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-[var(--border)] bg-white text-[var(--dark)] transition-all duration-200 hover:border-[var(--burnt-orange)] hover:text-[var(--burnt-orange)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              Prev
            </button>

            <span
              className="text-sm text-[var(--muted)] px-2"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-[var(--border)] bg-white text-[var(--dark)] transition-all duration-200 hover:border-[var(--burnt-orange)] hover:text-[var(--burnt-orange)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Next
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}