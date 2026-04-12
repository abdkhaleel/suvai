import { NextRequest } from 'next/server'
import { searchByDish, searchByIngredients } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { mode, query, ingredients } = await request.json()

    if (mode === 'dish') {
      if (!query?.trim()) {
        return Response.json(
          { error: 'Query is required' },
          { status: 400 }
        )
      }
      const results = await searchByDish(query)
      return Response.json({ results })
    }

    if (mode === 'ingredients') {
      if (!ingredients?.length) {
        return Response.json(
          { error: 'Ingredients are required' },
          { status: 400 }
        )
      }
      const results = await searchByIngredients(ingredients)
      return Response.json({ results })
    }

    return Response.json(
      { error: 'Invalid mode' },
      { status: 400 }
    )
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}