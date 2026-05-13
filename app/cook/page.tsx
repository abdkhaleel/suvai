'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Search,
  Loader2,
  CookingPot,
  Frown,
  X,
  Plus,
  Wheat,
  Leaf,
  Carrot,
  ArrowRight,
  Sparkles,
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

const SUGGESTIONS = [
  {
    icon: <Wheat size={24} strokeWidth={1.5} />,
    text: 'Try: rice, lentils, tomato',
  },
  {
    icon: <Leaf size={24} strokeWidth={1.5} />,
    text: 'Try: coconut, curry leaves, mustard',
  },
  {
    icon: <Carrot size={24} strokeWidth={1.5} />,
    text: 'Try: kathirikkai, puli, vengayam',
  },
]

export default function CookPage() {
  const [input, setInput] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [results, setResults] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  function addIngredient() {
    const trimmed = input.trim()
    if (!trimmed) return
    if (ingredients.includes(trimmed)) return
    setIngredients((prev) => [...prev, trimmed])
    setInput('')
  }

  function removeIngredient(item: string) {
    setIngredients((prev) => prev.filter((i) => i !== item))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
    if (e.key === 'Backspace' && input === '' && ingredients.length > 0) {
      setIngredients((prev) => prev.slice(0, -1))
    }
  }

  async function handleSearch() {
    if (ingredients.length === 0) return

    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ingredients',
          ingredients,
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
            Cook Smart
          </p>
          <h1
            className="font-bold leading-tight text-[var(--dark)]"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            What's in your
            <br />
            <span className="text-[var(--burnt-orange)]">kitchen today?</span>
          </h1>
          <p
            className="mt-4 text-base text-[var(--muted)] max-w-lg"
            style={{ fontFamily: 'var(--font-dm-sans)', lineHeight: 1.6 }}
          >
            Add your ingredients — Tamil names work too! Try{' '}
            <em>kathirikkai</em>, <em>kothamalli</em>...
          </p>
        </div>

        {/* Ingredient Input */}
        <div className="animate-fade-up delay-1 mb-4" style={{ opacity: 0 }}>
          <div className="bg-white border-2 border-[var(--border)] rounded-2xl p-4 max-w-xl transition-colors duration-200 focus-within:border-[var(--burnt-orange)]">
            {/* Tags */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      backgroundColor: '#FEF3E2',
                      color: 'var(--burnt-orange)',
                      border: '1px solid var(--burnt-orange)',
                    }}
                  >
                    {ing}
                    <button
                      onClick={() => removeIngredient(ing)}
                      className="p-0.5 rounded-full hover:bg-[var(--burnt-orange)] hover:text-white transition-colors duration-200"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  ingredients.length === 0
                    ? 'Type an ingredient and press Enter...'
                    : 'Add another ingredient...'
                }
                className="flex-1 bg-transparent border-none outline-none text-base text-[var(--dark)] placeholder:text-[var(--muted)]"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              />
              <button
                onClick={addIngredient}
                disabled={!input.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  backgroundColor: input.trim()
                    ? 'var(--burnt-orange)'
                    : 'var(--border)',
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Add
              </button>
            </div>
          </div>

          {/* Helper text */}
          <p
            className="mt-2 pl-2 text-xs text-[var(--muted)]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded text-[0.75rem] bg-[var(--border)]">
              Enter
            </kbd>{' '}
            to add ·{' '}
            <kbd className="px-1.5 py-0.5 rounded text-[0.75rem] bg-[var(--border)]">
              Backspace
            </kbd>{' '}
            to remove last
          </p>
        </div>

        {/* Find Recipes Button */}
        <div className="animate-fade-up delay-2 mb-12" style={{ opacity: 0 }}>
          <button
            onClick={handleSearch}
            disabled={ingredients.length === 0 || loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              backgroundColor:
                ingredients.length > 0 ? 'var(--burnt-orange)' : 'var(--border)',
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
                Find Recipes
                {ingredients.length > 0 && (
                  <span className="ml-1 text-sm opacity-80">
                    ({ingredients.length})
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {/* Loading */}
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
              Chef is checking what you can make...
            </p>
          </div>
        )}

        {/* Default State — Suggestions */}
        {!loading && !searched && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            {SUGGESTIONS.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  const items = s.text.replace('Try: ', '').split(', ')
                  setIngredients(items)
                }}
                className="group flex flex-col items-center gap-2 p-5 rounded-xl border border-[var(--border)] bg-white text-center cursor-pointer transition-all duration-200 hover:border-[var(--burnt-orange)] hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-[var(--burnt-orange)] transition-transform duration-200 group-hover:scale-110">
                  {s.icon}
                </div>
                <p
                  className="text-xs text-[var(--muted)]"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Frown
              size={48}
              className="text-[var(--muted)]"
              strokeWidth={1.5}
            />
            <h3
              className="text-xl font-bold text-[var(--dark)]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Hmm, nothing matched
            </h3>
            <p
              className="text-sm text-[var(--muted)]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Try adding more ingredients or check the spelling
            </p>
            <button
              onClick={() => {
                setIngredients([])
                setSearched(false)
                setResults([])
              }}
              className="btn-outline mt-2 text-sm px-6 py-2.5"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <p
              className="mb-6 text-sm text-[var(--muted)] inline-flex items-center gap-2"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              <Sparkles
                size={16}
                className="text-[var(--burnt-orange)]"
                strokeWidth={2}
              />
              Found {results.length} recipe{results.length > 1 ? 's' : ''} you
              can make with your ingredients
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((recipe, i) => (
                <Link
                  key={recipe.id}
                  href={`/chat?id=${recipe.id}&name=${encodeURIComponent(
                    recipe.name
                  )}`}
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

                    {/* Name */}
                    <h3
                      className="text-lg font-bold text-[var(--dark)] mb-1 leading-snug"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {recipe.name
                        .split('|')[0]
                        .split('Recipe')[0]
                        .trim()}
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

                    {/* CTA */}
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--burnt-orange)] transition-all duration-200 group-hover:gap-2.5">
                      Start Cooking
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}