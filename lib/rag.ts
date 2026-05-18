import { supabase } from './supabase'
import { getEmbedding } from './embedding'
import { resolveIngredients } from './synonyms'

export interface RecipeMatch {
  id: string
  name: string
  tamil_name: string
  category: string
  steps: any[]
  commonly_served_with: string[]
  tags: string[]
  similarity: number
}

export async function searchByDish(
  query: string,
): Promise<RecipeMatch[]> {
  const embedding = await getEmbedding(query)

  const { data, error } = await supabase.rpc('match_recipes', {
    query_embedding: embedding,
    match_threshold: 0.592666625977,
    match_count: 10000,
  })

  if (error) {
    console.error('RAG search error:', error)
    return []
  }

  return data || []
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('category')
    .not('category', 'is', null)

  if (error) throw error

  const cats = data
    .map((r: any) => r.category)
    .filter((c: any): c is string => typeof c === 'string' && c.trim().length > 0)

  return [...new Set(cats)]
}

export async function searchByIngredients(
  ingredients: string[],
): Promise<RecipeMatch[]> {
  const resolved = await resolveIngredients(ingredients)
  const query = `recipe with ingredients: ${resolved.join(', ')}`

  const embedding = await getEmbedding(query)

  const { data, error } = await supabase.rpc('match_recipes', {
    query_embedding: embedding,
    match_threshold: 0.6,
    match_count: 10000,
  })

  if (error) {
    console.error('RAG ingredients search error:', error)
    return []
  }

  return data || []
}

export async function getRecipeById(id: string) {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (recipeError) {
    console.error('Recipe fetch error:', recipeError)
    return null
  }

  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .eq('recipe_id', id)

  return {
    ...recipe,
    ingredients: ingredients || []
  }
}