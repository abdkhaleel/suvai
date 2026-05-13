'use client'

import { Suspense } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  CookingPot,
  Loader2,
  ChefHat,
  Clock,
  ArrowLeft,
  Send,
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

// ─── Helper: unescape literal \n from API response ───
function unescapeText(text: string) {
  return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

// ─── Chat Content (uses useSearchParams) ───
function ChatContent() {
  const searchParams = useSearchParams()
  const recipeId = searchParams.get('id')
  const recipeName = searchParams.get('name')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<any>(null)
  const [recipeLoading, setRecipeLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!recipeId) return
    async function fetchRecipe() {
      setRecipeLoading(true)
      try {
        const res = await fetch(`/api/recipe?id=${recipeId}`)
        const data = await res.json()
        setRecipe(data.recipe)
        setMessages([
          {
            role: 'assistant',
            text: unescapeText(
              `வணக்கம்! I'm your SuvAI chef, and I'm excited to help you make **${
                data.recipe?.name?.split('|')[0].split('Recipe')[0].trim() ||
                recipeName
              }** today!\n\nThis is a beautiful Tamil dish. Are you ready to start cooking? Just say **"Let's start"** and I'll guide you step by step!`
            ),
          },
        ])
      } catch (err) {
        console.error(err)
        setMessages([
          {
            role: 'assistant',
            text: unescapeText(
              `வணக்கம்! I'm your SuvAI chef! I'm here to help you cook today. What would you like to know?`
            ),
          },
        ])
      }
      setRecipeLoading(false)
    }
    fetchRecipe()
  }, [recipeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)
    setMessages((prev) => [...prev, { role: 'assistant', text: '' }])

    try {
      const res = await fetch('/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          recipeContext: recipe,
          history: messages.map((m) => ({
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
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            text: updated[updated.length - 1].text + chunk,
          }
          return updated
        })
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          text: 'Oops! Something went wrong in the kitchen. Please try again.',
        }
        return updated
      })
    }

    setLoading(false)
  }

  const quickReplies = [
    "Let's start!",
    'What ingredients do I need?',
    'Any tips for beginners?',
    'What can I substitute?',
  ]

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <Navbar />

      {/* Recipe Header */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href="/choose"
                className="inline-flex items-center gap-1 text-sm text-[var(--muted)] no-underline whitespace-nowrap hover:text-[var(--burnt-orange)] transition-colors duration-200"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back
              </Link>
              <span className="text-[var(--border)]">|</span>
              <h2
                className="text-base font-bold text-[var(--dark)] truncate max-w-[200px]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {recipe?.name?.split('|')[0].split('Recipe')[0].trim() ||
                  recipeName?.split('|')[0].split('Recipe')[0].trim() ||
                  'Chef Chat'}
              </h2>
            </div>

            {/* Pills */}
            {recipe && (
              <div className="flex gap-2 flex-wrap">
                {recipe.difficulty && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[0.7rem] capitalize border border-[var(--border)] text-[var(--muted)]"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      backgroundColor: 'var(--cream)',
                    }}
                  >
                    {recipe.difficulty}
                  </span>
                )}
                {recipe.cook_time && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] border border-[var(--border)] text-[var(--muted)]"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      backgroundColor: 'var(--cream)',
                    }}
                  >
                    <Clock size={12} strokeWidth={2} />
                    {recipe.cook_time}m
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tamil name */}
          {recipe?.tamil_name && (
            <p
              className="mt-1 text-xs text-[var(--burnt-orange)]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              {recipe.tamil_name.split('/')[0].trim()}
            </p>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {recipeLoading && (
            <div className="flex justify-center py-8">
              <CookingPot
                size={32}
                className="text-[var(--burnt-orange)] animate-spin"
                strokeWidth={1.5}
              />
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className="animate-fade-up flex"
              style={{
                justifyContent:
                  msg.role === 'user' ? 'flex-end' : 'flex-start',
                opacity: 0,
              }}
            >
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-[var(--burnt-orange)] flex items-center justify-center shrink-0 mr-3 mt-1">
                  <ChefHat size={20} className="text-white" strokeWidth={2} />
                </div>
              )}

              <div
                className="max-w-[75%] px-4 py-3.5 text-[0.95rem] leading-relaxed shadow-sm"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  backgroundColor:
                    msg.role === 'user' ? 'var(--burnt-orange)' : 'white',
                  color: msg.role === 'user' ? 'white' : 'var(--dark)',
                  borderRadius:
                    msg.role === 'user'
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                  border:
                    msg.role === 'assistant'
                      ? '1px solid var(--border)'
                      : 'none',
                }}
              >
                {msg.role === 'assistant' ? (
                  <>
                    <ReactMarkdown
                      components={{
                        h1: (props) => (
                          <h1
                            className="text-xl font-bold mb-2"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                            {...props}
                          />
                        ),
                        h2: (props) => (
                          <h2
                            className="text-lg font-bold mb-2 mt-3"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                            {...props}
                          />
                        ),
                        h3: (props) => (
                          <h3
                            className="text-base font-semibold mb-1"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                            {...props}
                          />
                        ),
                        p: (props) => (
                          <p className="mb-2 last:mb-0" {...props} />
                        ),
                        ul: (props) => (
                          <ul className="pl-5 mb-2 list-disc" {...props} />
                        ),
                        ol: (props) => (
                          <ol className="pl-5 mb-2 list-decimal" {...props} />
                        ),
                        li: (props) => (
                          <li className="mb-1" {...props} />
                        ),
                        strong: (props) => (
                          <strong
                            className="font-semibold text-[var(--burnt-orange)]"
                            {...props}
                          />
                        ),
                        code: (props) => (
                          <code
                            className="px-1 py-0.5 rounded text-sm"
                            style={{ backgroundColor: 'var(--cream)' }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {unescapeText(msg.text)}
                    </ReactMarkdown>
                    {loading && i === messages.length - 1 && (
                      <span className="inline-block w-0.5 h-4 bg-[var(--burnt-orange)] ml-0.5 align-text-bottom animate-pulse" />
                    )}
                  </>
                ) : (
                  unescapeText(msg.text)
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => {
                  setInput(reply)
                  setTimeout(() => sendMessage(), 100)
                }}
                className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--border)] bg-white text-[var(--charcoal)] cursor-pointer transition-all duration-200 hover:border-[var(--burnt-orange)] hover:text-[var(--burnt-orange)]"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-[var(--border)] px-4 py-3">
        <form
          onSubmit={sendMessage}
          className="max-w-3xl mx-auto flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your chef..."
            disabled={loading}
            className="flex-1 min-w-0 px-4 py-3 rounded-full border-2 border-[var(--border)] bg-[var(--cream)] text-[var(--dark)] text-[0.95rem] outline-none transition-colors duration-200 focus:border-[var(--burnt-orange)] disabled:opacity-60"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white transition-all duration-200 disabled:cursor-not-allowed disabled:bg-[var(--border)]"
            style={{
              backgroundColor:
                loading || !input.trim()
                  ? 'var(--border)'
                  : 'var(--burnt-orange)',
            }}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} strokeWidth={2} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Export with Suspense ───
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: 'var(--cream)' }}
        >
          <CookingPot
            size={48}
            className="text-[var(--burnt-orange)] animate-spin"
            strokeWidth={1.5}
          />
          <p
            className="text-sm text-[var(--muted)]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Loading your chef...
          </p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}