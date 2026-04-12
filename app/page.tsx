import Navbar from '@/components/Navbar'
import ModeCard from '@/components/ModeCard'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            உங்கள் சமையல்காரர் 🍛
          </h1>
          <p className="text-xl text-gray-500">
            Your Tamil Cuisine AI Chef
          </p>
        </div>

        {/* Two Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <ModeCard
            title="Choose a Dish"
            tamil="உணவை தேர்ந்தெடு"
            description="Browse or search Tamil recipes. Pick a dish and your chef will guide you step by step."
            emoji="🔍"
            href="/choose"
            color="bg-orange-50 dark:bg-orange-950"
          />
          <ModeCard
            title="Cook With What You Have"
            tamil="இருப்பதை வைத்து சமை"
            description="Tell your chef what ingredients you have. Get the best recipe you can make right now."
            emoji="🥘"
            href="/cook"
            color="bg-green-50 dark:bg-green-950"
          />
        </div>

      </main>

      <footer className="text-center py-6 text-sm text-gray-400">
        Powered by Gemma 4 · Built with ❤️ for Tamil cuisine
      </footer>
    </div>
  )
}