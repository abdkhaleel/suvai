'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Search, ChefHat, Leaf, Languages, RefreshCw, Heart } from 'lucide-react'

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group flex flex-col items-center text-center p-8 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--burnt-orange)] hover:-translate-y-1">
      <div className="mb-5 text-[var(--burnt-orange)] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[var(--dark)]" style={{ fontFamily: 'var(--font-playfair)' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--muted)] max-w-[260px]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {description}
      </p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center px-6">
        <div className="w-full max-w-5xl mx-auto">

          {/* HERO — padding handles ALL spacing, no child margins escaping */}
          <section className="w-full flex flex-col items-center text-center py-28">
            <p
              className="animate-fade-up uppercase tracking-[0.2em] text-xs font-semibold text-[var(--burnt-orange)]"
              style={{ fontFamily: 'var(--font-dm-sans)', opacity: 0 }}
            >
              Tamil Cuisine AI Chef
            </p>

            <h1
              className="animate-fade-up delay-1 font-bold mt-8 text-[var(--dark)]"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.15,
                opacity: 0,
              }}
            >
              உங்கள் சமையல்
              <br />
              <span className="text-[var(--burnt-orange)]">கலை தொடங்கட்டும்</span>
            </h1>

            <p
              className="animate-fade-up delay-2 mt-8 max-w-lg text-[var(--muted)]"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                opacity: 0,
              }}
            >
              Authentic Tamil recipes guided by AI. From Idli to Biryani — your
              personal chef knows every secret.
            </p>

            <div
              className="animate-fade-up delay-3 flex flex-col sm:flex-row items-center gap-4 mt-12"
              style={{ opacity: 0 }}
            >
              <Link href="/choose" className="btn-primary">
                <Search size={18} strokeWidth={2.5} />
                Choose a Dish
              </Link>
              <Link href="/cook" className="btn-outline">
                <ChefHat size={18} strokeWidth={2.5} />
                Cook With What You Have
              </Link>
            </div>
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--border)]" />

          {/* FEATURES — py-20 gives vertical gap */}
          <section className="w-full py-20 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Leaf size={36} strokeWidth={1.5} />}
                title="Authentic Recipes"
                description="Traditional Tamil recipes with step by step guidance"
              />
              <FeatureCard
                icon={<Languages size={36} strokeWidth={1.5} />}
                title="Tamil & English"
                description="Understands Tamil ingredient names naturally"
              />
              <FeatureCard
                icon={<RefreshCw size={36} strokeWidth={1.5} />}
                title="Smart Substitutions"
                description="Missing an ingredient? Get instant alternatives"
              />
            </div>
          </section>

        </div>
      </main>

      <footer className="w-full border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
        <span className="inline-flex items-center gap-1.5 justify-center">
          Powered by Gemma 4 · Built with{' '}
          <Heart size={12} className="text-[var(--burnt-orange)]" fill="currentColor" />{' '}
          for Tamil cuisine
        </span>
      </footer>
    </div>
  )
}