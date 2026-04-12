'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Recipe {
  id: string
  name: string
  tamil_name: string
  category: string
  tags: string[]
  commonly_served_with: string[]
  similarity: number
}

const CATEGORIES = ['All', 'Breakfast', 'Rice', 'Curry', 'Snacks', 'Sweets']

export default function ChoosePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

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

    const categoryQueries: Record<string, string> = {
      'All':      'Tamil South Indian recipe',
      'Breakfast': 'Tamil breakfast tiffin morning dish idli dosa pongal upma',
      'Rice':      'Tamil rice variety dish sambar curd lemon rice',
      'Curry':     'Tamil kuzhambu curry gravy dish sambar rasam',
      'Snacks':    'Tamil snack street food bajji murukku sundal',
      'Sweets':    'Tamil sweet dessert payasam halwa pongal',
    }

    const searchQuery = categoryQueries[cat] || `Tamil ${cat} recipe`

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'dish',
          query: searchQuery,
          matchCount: 9        
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="animate-fade-up" style={{ opacity: 0, marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            color: 'var(--burnt-orange)',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            Browse Recipes
          </p>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--dark)',
            lineHeight: 1.2,
          }}>
            What would you like<br />
            <span style={{ color: 'var(--burnt-orange)' }}>to cook today?</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="animate-fade-up delay-1"
          style={{ opacity: 0, marginBottom: '1.5rem' }}
        >
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search — try 'soft idli', 'spicy dosa', 'இட்லி'..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                paddingRight: '7rem',
                borderRadius: '100px',
                border: '2px solid var(--border)',
                backgroundColor: 'white',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '1rem',
                color: 'var(--dark)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--burnt-orange)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'var(--burnt-orange)',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                padding: '0.6rem 1.4rem',
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Category Filters */}
        <div
          className="animate-fade-up delay-2 flex flex-wrap gap-2"
          style={{ opacity: 0, marginBottom: '2.5rem' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{
                padding: '0.4rem 1.1rem',
                borderRadius: '100px',
                border: '1.5px solid',
                borderColor: activeCategory === cat
                  ? 'var(--burnt-orange)'
                  : 'var(--border)',
                backgroundColor: activeCategory === cat
                  ? 'var(--burnt-orange)'
                  : 'white',
                color: activeCategory === cat
                  ? 'white'
                  : 'var(--muted)',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                fontSize: '2.5rem',
                animation: 'spin 1s linear infinite',
              }}>
                🍳
              </div>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                color: 'var(--muted)',
                fontSize: '0.9rem',
              }}>
                Chef is searching the cookbook...
              </p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
            <h3 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.4rem',
              color: 'var(--dark)',
              marginBottom: '0.5rem',
            }}>
              No recipes found
            </h3>
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              color: 'var(--muted)',
              fontSize: '0.9rem',
            }}>
              Try searching for idli, dosa, pongal, upma...
            </p>
          </div>
        )}

        {/* Default State */}
        {!loading && !searched && (
          <div className="text-center py-16">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍛</div>
            <p style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.2rem',
              color: 'var(--muted)',
            }}>
              Search a dish or pick a category above
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
            <h3 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.4rem',
              color: 'var(--dark)',
              marginBottom: '0.5rem',
            }}>
              Hmm, I don't know that dish
            </h3>
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              color: 'var(--muted)',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}>
              SuvAI specializes in Tamil cuisine 🍛<br />
              Try searching for idli, dosa, pongal, sambar...
            </p>
            <button
              onClick={() => {
                setQuery('')
                setSearched(false)
                setResults([])
              }}
              className="btn-outline"
              style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((recipe, i) => (
              <Link
                key={recipe.id}
                href={`/chat?id=${recipe.id}&name=${encodeURIComponent(recipe.name)}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="animate-fade-up feature-card"
                  style={{
                    opacity: 0,
                    animationDelay: `${i * 0.1}s`,
                    cursor: 'pointer',
                    height: '100%',
                  }}
                >
                  {/* Category Badge */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      backgroundColor: 'var(--cream)',
                      border: '1px solid var(--border)',
                      borderRadius: '100px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-dm-sans)',
                      color: 'var(--muted)',
                      textTransform: 'capitalize',
                    }}>
                      {recipe.category || 'Tamil Recipe'}
                    </span>
                  </div>

                  {/* Recipe Name */}
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--dark)',
                    marginBottom: '0.3rem',
                    lineHeight: 1.3,
                  }}>
                    {recipe.name.split('|')[0].split('Recipe')[0].trim()}
                  </h3>

                  {/* Tamil Name */}
                  {recipe.tamil_name && (
                    <p style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.95rem',
                      color: 'var(--burnt-orange)',
                      marginBottom: '1rem',
                    }}>
                      {recipe.tamil_name.split('/')[0].trim()}
                    </p>
                  )}

                  {/* Tags */}
                  {recipe.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1" style={{ marginBottom: '1rem' }}>
                      {recipe.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: '#FEF3E2',
                            color: 'var(--burnt-orange)',
                            borderRadius: '100px',
                            padding: '0.2rem 0.6rem',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Served With */}
                  {recipe.commonly_served_with?.length > 0 && (
                    <p style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.78rem',
                      color: 'var(--muted)',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem',
                    }}>
                      Served with: {recipe.commonly_served_with.slice(0, 2).join(', ')}
                    </p>
                  )}

                  {/* Cook CTA */}
                  <div style={{
                    marginTop: '1rem',
                    color: 'var(--burnt-orange)',
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    Start Cooking →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}