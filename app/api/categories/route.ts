import { NextRequest } from 'next/server'
import { getCategories } from '@/lib/rag'

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories()
    return Response.json({ categories })
  } catch (error: any) {
    console.error('Categories API error:', error)
    return Response.json({ categories: [] })
  }
}