import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--cream)',
      }}
      className="w-full px-8 py-5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm"
    >
      <Link href="/" className="flex items-center gap-2">
        <span style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.6rem',
          fontWeight: 700,
          color: 'var(--burnt-orange)',
          letterSpacing: '-0.02em'
        }}>
          SuvAI
        </span>
        <span style={{ fontSize: '1.2rem' }}>🍛</span>
      </Link>

      <div className="flex items-center gap-8">
        <Link
          href="/choose"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.9rem',
            color: 'var(--charcoal)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--burnt-orange)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--charcoal)')}
        >
          Choose Dish
        </Link>
        <Link
          href="/cook"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.9rem',
            backgroundColor: 'var(--burnt-orange)',
            color: 'white',
            padding: '0.5rem 1.2rem',
            borderRadius: '100px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--turmeric)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--burnt-orange)')}
        >
          Cook Now
        </Link>
      </div>
    </nav>
  )
}