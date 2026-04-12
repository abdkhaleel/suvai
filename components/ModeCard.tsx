import Link from 'next/link'

interface ModeCardProps {
  title: string
  tamil: string
  description: string
  emoji: string
  href: string
  color: string
}

export default function ModeCard({
  title,
  tamil,
  description,
  emoji,
  href,
  color,
}: ModeCardProps) {
  return (
    <Link href={href}>
      <div className={`
        rounded-2xl p-8 cursor-pointer border-2 border-transparent
        hover:border-orange-400 hover:shadow-lg
        transition-all duration-200 h-full
        ${color}
      `}>
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-3 italic">{tamil}</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}