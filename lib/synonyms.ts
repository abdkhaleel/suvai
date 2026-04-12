import { supabase } from './supabase'

export async function resolveIngredients(
  ingredients: string[]
): Promise<string[]> {
  const resolved: string[] = []

  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase().trim()

    const { data } = await supabase
      .from('synonyms')
      .select('standard_name, aliases')

    if (!data) {
      resolved.push(lower)
      continue
    }
    
    const match = data.find(row =>
      row.aliases?.some((alias: string) =>
        alias.toLowerCase() === lower
      )
    )
    
    resolved.push(match ? match.standard_name : lower)
  }

  return resolved
}