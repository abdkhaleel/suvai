import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        SuvAI 🍛
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link href="/choose" className="hover:text-orange-500 transition-colors">
          Choose Dish
        </Link>
        <Link href="/cook" className="hover:text-orange-500 transition-colors">
          Cook with What You Have
        </Link>
      </div>
    </nav>
  )
}