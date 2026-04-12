import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function CookPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🥘</div>
          <h1 className="text-3xl font-bold mb-2">Cook With What You Have</h1>
          <p className="text-gray-500 mb-8">
            Enter your ingredients and find the best recipe — coming soon
          </p>
          <Link
            href="/"
            className="text-orange-500 hover:underline text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  )
}