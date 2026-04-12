'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const recipeId = searchParams.get('id')
  const recipeName = searchParams.get('name')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<any>(null)
  const [recipeLoading, setRecipeLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // fetch full recipe on load
  useEffect(() => {
    if (!recipeId) return
    async function fetchRecipe() {
      setRecipeLoading(true)
      try {
        const res = await fetch(`/api/recipe?id=${recipeId}`)
        const data = await res.json()
        setRecipe(data.recipe)

        // send initial chef greeting
        setMessages([{
          role: 'assistant',
          text: `வணக்கம்! 🙏 I'm your SuvAI chef, and I'm excited to help you make **${data.recipe?.name?.split('|')[0].split('Recipe')[0].trim() || recipeName}** today!\n\nThis is a beautiful Tamil dish. Are you ready to start cooking? Just say **"Let's start"** and I'll guide you step by step! 🍳`
        }])
      } catch (err) {
        console.error(err)
        setMessages([{
          role: 'assistant',
          text: `வணக்கம்! 🙏 I'm your SuvAI chef! I'm here to help you cook today. What would you like to know? 🍳`
        }])
      }
      setRecipeLoading(false)
    }
    fetchRecipe()
  }, [recipeId])

  // auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // add user message
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    // add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', text: '' }])

    try {
      const res = await fetch('/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          recipeContext: recipe,
          history: messages.map(m => ({
            role: m.role,
            text: m.text,
          })),
        }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)

        // stream into last assistant message
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            text: updated[updated.length - 1].text + chunk,
          }
          return updated
        })
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          text: "Oops! Something went wrong in the kitchen 😅 Please try again.",
        }
        return updated
      })
    }

    setLoading(false)
  }

  // quick reply buttons
  const quickReplies = [
    "Let's start! 🍳",
    "What ingredients do I need?",
    "Any tips for beginners?",
    "What can I substitute?",
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />

      {/* Recipe Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem',
      }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/choose"
                style={{
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                ← Back
              </Link>
              <span style={{ color: 'var(--border)' }}>|</span>
              <h2 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--dark)',
              }}>
                {recipe?.name?.split('|')[0].split('Recipe')[0].trim()
                  || recipeName?.split('|')[0].split('Recipe')[0].trim()
                  || 'Chef Chat'}
              </h2>
            </div>
            {recipe?.tamil_name && (
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.85rem',
                color: 'var(--burnt-orange)',
                marginTop: '0.2rem',
              }}>
                {recipe.tamil_name.split('/')[0].trim()}
              </p>
            )}
          </div>

          {/* Recipe Info Pills */}
          {recipe && (
            <div className="flex gap-2">
              {recipe.difficulty && (
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
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cook_time && (
                <span style={{
                  backgroundColor: 'var(--cream)',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-dm-sans)',
                  color: 'var(--muted)',
                }}>
                  ⏱ {recipe.cook_time} mins
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem 1rem',
      }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-4">

          {/* Loading recipe */}
          {recipeLoading && (
            <div className="flex justify-center py-8">
              <div style={{
                fontSize: '2rem',
                animation: 'spin 1s linear infinite',
              }}>🍳</div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className="animate-fade-up"
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                opacity: 0,
              }}
            >
              {/* Chef avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--burnt-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  marginRight: '0.75rem',
                  marginTop: '0.25rem',
                }}>
                  👨‍🍳
                </div>
              )}

              <div style={{
                maxWidth: '75%',
                backgroundColor: msg.role === 'user'
                  ? 'var(--burnt-orange)'
                  : 'white',
                color: msg.role === 'user'
                  ? 'white'
                  : 'var(--dark)',
                borderRadius: msg.role === 'user'
                  ? '20px 20px 4px 20px'
                  : '20px 20px 20px 4px',
                padding: '0.875rem 1.1rem',
                border: msg.role === 'assistant'
                  ? '1px solid var(--border)'
                  : 'none',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                {msg.role === 'assistant' ? (
                  <>
                    <ReactMarkdown
                      components={{
                        h1: ({ ...props }) => <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--dark)' }} {...props} />,
                        h2: ({ ...props }) => <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', marginTop: '0.75rem', color: 'var(--dark)' }} {...props} />,
                        h3: ({ ...props }) => <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.3rem', marginTop: '0.5rem' }} {...props} />,
                        p: ({ ...props }) => <p style={{ marginBottom: '0.5rem' }} {...props} />,
                        ul: ({ ...props }) => <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem' }} {...props} />,
                        ol: ({ ...props }) => <ol style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem' }} {...props} />,
                        li: ({ ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                        strong: ({ ...props }) => <strong style={{ color: 'var(--burnt-orange)', fontWeight: 600 }} {...props} />,
                        code: ({ ...props }) => <code style={{ backgroundColor: 'var(--cream)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.85rem' }} {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                    {/* Streaming cursor */}
                    {loading && i === messages.length - 1 && (
                      <span style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '1em',
                        backgroundColor: 'var(--burnt-orange)',
                        marginLeft: '2px',
                        animation: 'blink 1s step-end infinite',
                        verticalAlign: 'text-bottom',
                      }} />
                    )}
                  </>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && !loading && (
        <div style={{
          padding: '0 1rem 0.5rem',
          maxWidth: '3xl',
        }}>
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {quickReplies.map(reply => (
              <button
                key={reply}
                onClick={() => {
                  setInput(reply)
                  setTimeout(() => sendMessage(), 100)
                }}
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid var(--border)',
                  borderRadius: '100px',
                  padding: '0.4rem 1rem',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.82rem',
                  color: 'var(--charcoal)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--burnt-orange)'
                  e.currentTarget.style.color = 'var(--burnt-orange)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--charcoal)'
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{
        backgroundColor: 'white',
        borderTop: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
      }}>
        <form
          onSubmit={sendMessage}
          className="max-w-3xl mx-auto flex gap-3 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your chef anything..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.875rem 1.25rem',
              borderRadius: '100px',
              border: '2px solid var(--border)',
              backgroundColor: 'var(--cream)',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.95rem',
              color: 'var(--dark)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--burnt-orange)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim()
                ? 'var(--border)'
                : 'var(--burnt-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              fontSize: '1.2rem',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {loading ? '⏳' : '↑'}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}