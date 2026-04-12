require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenAI } = require('@google/genai')

// clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

// ─────────────────────────────────────────
// Step 1 — generate embedding for a recipe
// ─────────────────────────────────────────
async function getEmbedding(recipe) {
  const text = `
    ${recipe.name} ${recipe.tamil_name} ${recipe.transliteration}
    Category: ${recipe.category} ${recipe.sub_category}
    Ingredients: ${recipe.ingredients.map(i => i.name).join(', ')}
    Tags: ${recipe.tags.join(', ')}
    Served with: ${recipe.commonly_served_with.join(', ')}
    Steps: ${recipe.steps.map(s => s.instruction).join('. ')}
  `.trim()

  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',   // ← updated
    contents: text,
  })

  return response.embeddings[0].values  // ← same as before
}

// ─────────────────────────────────────────
// Step 2 — insert one recipe into Supabase
// ─────────────────────────────────────────
async function insertRecipe(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const recipe = JSON.parse(raw)

  console.log(`\n📄 Processing: ${recipe.name}`)

  // check if already exists
  const { data: existing } = await supabase
    .from('recipes')
    .select('id')
    .eq('name', recipe.name)
    .single()

  if (existing) {
    console.log(`⏭️  Skipping ${recipe.name} — already in DB`)
    return
  }

  // generate embedding
  console.log(`🔢 Generating embedding...`)
  const embedding = await getEmbedding(recipe)

  // insert into recipes table
  const { data: insertedRecipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      name:                 recipe.name,
      tamil_name:           recipe.tamil_name,
      transliteration:      recipe.transliteration,
      category:             recipe.category,
      sub_category:         recipe.sub_category,
      diet_type:            recipe.diet_type,
      difficulty:           recipe.difficulty,
      prep_time:            recipe.prep_time,
      cook_time:            recipe.cook_time,
      total_time:           recipe.total_time,
      servings:             recipe.servings,
      steps:                recipe.steps,
      tips:                 recipe.tips,
      variations:           recipe.variations,
      commonly_served_with: recipe.commonly_served_with,
      tags:                 recipe.tags,
      embedding:            embedding,
      version:              1,
    })
    .select()
    .single()

  if (recipeError) {
    console.error(`❌ Failed to insert recipe: ${recipeError.message}`)
    return
  }

  // insert into ingredients table
  if (recipe.ingredients?.length > 0) {
    const ingredients = recipe.ingredients.map(ing => ({
      recipe_id:      insertedRecipe.id,
      name:           ing.name,
      tamil_name:     ing.tamil_name,
      transliteration: ing.transliteration,
      quantity:       ing.quantity,
      unit:           ing.unit,
      notes:          ing.notes,
    }))

    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredients)

    if (ingError) {
      console.error(`❌ Failed to insert ingredients: ${ingError.message}`)
      return
    }
  }

  console.log(`✅ Inserted: ${recipe.name} (${recipe.tamil_name})`)
}

// ─────────────────────────────────────────
// Step 3 — insert synonyms (run once)
// ─────────────────────────────────────────
async function insertSynonyms() {
  const filePath = path.join(__dirname, 'synonyms.json')
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  synonyms.json not found, skipping')
    return
  }

  const synonyms = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  const { error } = await supabase
    .from('synonyms')
    .upsert(synonyms, { onConflict: 'standard_name' })

  if (error) {
    console.error(`❌ Synonyms insert failed: ${error.message}`)
  } else {
    console.log(`✅ Synonyms inserted (${synonyms.length} entries)`)
  }
}

// ─────────────────────────────────────────
// Step 4 — insert substitutions (run once)
// ─────────────────────────────────────────
async function insertSubstitutions() {
  const filePath = path.join(__dirname, 'substitutions.json')
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  substitutions.json not found, skipping')
    return
  }

  const substitutions = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  const { error } = await supabase
    .from('substitutions')
    .upsert(substitutions, { onConflict: 'ingredient' })

  if (error) {
    console.error(`❌ Substitutions insert failed: ${error.message}`)
  } else {
    console.log(`✅ Substitutions inserted (${substitutions.length} entries)`)
  }
}

// ─────────────────────────────────────────
// Main — runs everything
// ─────────────────────────────────────────
async function main() {
  console.log('🚀 SuvAI Dataset Insert Script')
  console.log('================================')

  // insert synonyms and substitutions first
  console.log('\n📚 Inserting supporting data...')
  await insertSynonyms()
  await insertSubstitutions()

  // read all JSON files from structured folder
  const structuredDir = path.join(__dirname, 'structured')
  const files = fs.readdirSync(structuredDir)
    .filter(f => f.endsWith('.json'))

  console.log(`\n🍛 Found ${files.length} recipe(s) to process`)

  // insert each recipe one by one
  for (const file of files) {
    const filePath = path.join(structuredDir, file)
    await insertRecipe(filePath)

    // small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n================================')
  console.log('✅ All done! Check your Supabase dashboard.')
}

main().catch(console.error)