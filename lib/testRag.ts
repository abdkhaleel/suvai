import { searchByDish } from './rag'

async function test() {
  console.log('Testing RAG search...')
  const results = await searchByDish('soft steamed breakfast')
  console.log('Results:', JSON.stringify(results, null, 2))
}

test()