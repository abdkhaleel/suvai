import Link from 'next/link'
import { ReactNode } from 'react'

interface ModeCardProps {
  title: string
  tamil: string
  description: string
  icon: ReactNode
  href: string
}

export default function ModeCard({
  title,
  tamil,
  description,
  icon,
  href,
}: ModeCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-8 transition-all duration-300 hover:border-[var(--burnt-orange)] hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-5 text-[var(--burnt-orange)] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h2
        className="text-2xl font-bold mb-1 text-[var(--dark)]"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {title}
      </h2>
      <p
        className="text-sm italic mb-3 text-[var(--muted)]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        {tamil}
      </p>
      <p
        className="leading-relaxed text-[var(--muted)]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        {description}
      </p>
    </Link>
  )
}