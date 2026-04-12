import { NextRequest } from 'next/server'
import { getRecipeById } from '@/lib/rag'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id) {
    return Response.json(
      { error: 'Recipe id is required' },
      { status: 400 }
    )
  }

  const recipe = await getRecipeById(id)

  if (!recipe) {
    return Response.json(
      { error: 'Recipe not found' },
      { status: 404 }
    )
  }

  return Response.json({ recipe })
}