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
    setIngredients(prev => [...prev, trimmed])
    setInput('')
  }

  function removeIngredient(item: string) {
    setIngredients(prev => prev.filter(i => i !== item))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
    if (e.key === 'Backspace' && input === '' && ingredients.length > 0) {
      setIngredients(prev => prev.slice(0, -1))
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      {/* <Navbar /> */}

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div
          className="animate-fade-up"
          style={{ opacity: 0, marginBottom: '2.5rem' }}
        >
          <p style={{
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            color: 'var(--burnt-orange)',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            Cook Smart
          </p>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--dark)',
            lineHeight: 1.2,
          }}>
            What's in your<br />
            <span style={{ color: 'var(--burnt-orange)' }}>
              kitchen today?
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '1rem',
            color: 'var(--muted)',
            marginTop: '0.75rem',
            lineHeight: 1.6,
          }}>
            Add your ingredients — Tamil names work too!
            Try <em>kathirikkai</em>, <em>kothamalli</em>...
          </p>
        </div>

        {/* Ingredient Input */}
        <div
          className="animate-fade-up delay-1"
          style={{ opacity: 0, marginBottom: '1.5rem' }}
        >
          <div style={{
            backgroundColor: 'white',
            border: '2px solid var(--border)',
            borderRadius: '16px',
            padding: '1rem',
            maxWidth: '600px',
            transition: 'border-color 0.2s ease',
          }}
            onFocus={() => {}}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2" style={{ marginBottom: ingredients.length ? '0.75rem' : 0 }}>
              {ingredients.map(ing => (
                <span
                  key={ing}
                  style={{
                    backgroundColor: '#FEF3E2',
                    border: '1px solid var(--burnt-orange)',
                    borderRadius: '100px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-dm-sans)',
                    color: 'var(--burnt-orange)',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'default',
                  }}
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--burnt-orange)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  ingredients.length === 0
                    ? 'Type an ingredient and press Enter...'
                    : 'Add another ingredient...'
                }
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '1rem',
                  color: 'var(--dark)',
                  backgroundColor: 'transparent',
                }}
              />
              <button
                onClick={addIngredient}
                disabled={!input.trim()}
                style={{
                  backgroundColor: input.trim()
                    ? 'var(--burnt-orange)'
                    : 'var(--border)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '0.5rem 1rem',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Helper text */}
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.78rem',
            color: 'var(--muted)',
            marginTop: '0.5rem',
            paddingLeft: '0.5rem',
          }}>
            Press <kbd style={{
              backgroundColor: 'var(--border)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
            }}>Enter</kbd> to add · <kbd style={{
              backgroundColor: 'var(--border)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
            }}>Backspace</kbd> to remove last
          </p>
        </div>

        {/* Find Recipes Button */}
        <div
          className="animate-fade-up delay-2"
          style={{ opacity: 0, marginBottom: '3rem' }}
        >
          <button
            onClick={handleSearch}
            disabled={ingredients.length === 0 || loading}
            style={{
              backgroundColor: ingredients.length > 0
                ? 'var(--burnt-orange)'
                : 'var(--border)',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              padding: '0.9rem 2.5rem',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: ingredients.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            {loading
              ? 'Searching...'
              : `🔍 Find Recipes${ingredients.length > 0
                ? ` (${ingredients.length} ingredient${ingredients.length > 1 ? 's' : ''})`
                : ''
              }`
            }
          </button>
        </div>

        {/* Loading */}
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
                Chef is checking what you can make...
              </p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <h3 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.4rem',
              color: 'var(--dark)',
              marginBottom: '0.5rem',
            }}>
              Hmm, nothing matched
            </h3>
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              color: 'var(--muted)',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}>
              Try adding more ingredients or check the spelling
            </p>
            <button
              onClick={() => {
                setIngredients([])
                setSearched(false)
                setResults([])
              }}
              className="btn-outline"
              style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}
            >
              Start Over
            </button>
          </div>
        )}

        {/* Default State */}
        {!loading && !searched && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            style={{ maxWidth: '600px' }}
          >
            {[
              { emoji: '🍚', text: 'Try: rice, lentils, tomato' },
              { emoji: '🥥', text: 'Try: coconut, curry leaves, mustard' },
              { emoji: '🌿', text: 'Try: kathirikkai, puli, vengayam' },
            ].map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  const items = s.text.replace('Try: ', '').split(', ')
                  setIngredients(items)
                }}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
                className="feature-card"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
                  {s.emoji}
                </div>
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.78rem',
                  color: 'var(--muted)',
                }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.9rem',
              color: 'var(--muted)',
              marginBottom: '1.5rem',
            }}>
              Found {results.length} recipe{results.length > 1 ? 's' : ''} 
              you can make with your ingredients 🎉
            </p>

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

                    {/* Name */}
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

                    {/* CTA */}
                    <div style={{
                      marginTop: '1rem',
                      color: 'var(--burnt-orange)',
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem',
                    }}>
                      Start Cooking →
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