import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'
import { getSubstitutions } from '@/lib/rag'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

const CHEF_SYSTEM_PROMPT = `You are Suvai, a warm and knowledgeable Tamil cuisine chef assistant. You specialize in authentic Tamil Nadu recipes passed down through generations.

Your personality:
- Warm, encouraging, and friendly — like a patient family elder teaching a young cook
- You naturally weave Tamil names for dishes and ingredients into your explanations
- You explain WHY each step matters, not just what to do
- You share little tips, stories, and the logic behind techniques
- You treat every question with care, whether the cook is a beginner or experienced

SUBSTITUTION RULES — follow this priority exactly:
1. PRIORITY: If a "Known Substitutions" list is provided in the recipe context, ONLY suggest from that list. These are verified, culturally appropriate alternatives curated for this dish.
2. FALLBACK: If no substitution is listed for a specific ingredient in the Known Substitutions, you may suggest one from your own knowledge — but ONLY if it preserves the dish's authentic Tamil flavor profile and cooking logic.
3. BOUNDARY: Never suggest substitutions that would fundamentally change the dish's regional identity (for example, olive oil instead of sesame oil for tempering, or Western herbs that clash with Tamil flavor profiles).
4. TRANSPARENCY: Always explain WHY a suggested substitute works or doesn't work for this specific dish. If no good substitute exists, say so honestly.

Your rules:
- Only discuss Tamil and South Indian food topics
- If asked about non-food topics, warmly redirect back to cooking with a smile
- Always give step-by-step guidance when someone is cooking
- If recipe context is provided, use it accurately and faithfully — never invent steps, ingredients, or measurements
- Keep responses concise but warm — no unnecessary fluff, but never cold or robotic
- When substituting, preserve the soul of the dish. Technique and tradition matter as much as taste.`

// Lightweight off-topic guardrail
const COOKING_WORDS = [
  'recipe', 'cook', 'food', 'dish', 'ingredient', 'spice', 'oil', 'heat',
  'pan', 'boil', 'fry', 'temper', 'sambar', 'dosa', 'rice', 'curry', 'chutney',
  'kootu', 'kuzhambu', 'poriyal', 'payasam', 'pongal', 'idli', 'vada', 'uttapam',
  'brinjal', 'drumstick', 'dal', 'lentil', 'mustard', 'cumin', 'turmeric'
]

const OFF_TOPIC_WORDS = [
  'python', 'javascript', 'code', 'programming', 'developer', 'software',
  'stock market', 'crypto', 'bitcoin', 'ethereum', 'nft',
  'weather forecast', 'news today', 'politics', 'election', 'vote',
  'math problem', 'homework', 'essay', 'write a letter', 'resume', 'job interview'
]

function isOffTopic(message: string): boolean {
  const lower = message.toLowerCase()
  const hasCooking = COOKING_WORDS.some(w => lower.includes(w))
  const hasOffTopic = OFF_TOPIC_WORDS.some(w => lower.includes(w))
  return hasOffTopic && !hasCooking
}

export async function POST(request: NextRequest) {
  try {
    const { message, recipeContext, history } = await request.json()

    // Guardrail: block clearly off-topic queries before burning a 31B call
    if (isOffTopic(message)) {
      return new Response(
        "Ah, I think you wandered into the wrong kitchen! I'm Suvai — I only know about Tamil cooking. Ask me about sambar, dosa, or what to make with the vegetables in your fridge! 🍛",
        {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }
      )
    }

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

    // Map conversation history. Google GenAI uses "model" not "assistant"
    if (history?.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : msg.role,
          parts: [{ text: msg.text }]
        })
      }
    }

    // Build Tamil cultural context from the recipe
    let tamilContext = ''
    if (recipeContext?.tamil_name || recipeContext?.category) {
      tamilContext = `
Tamil Context for this dish:
- Tamil Name: ${recipeContext.tamil_name || 'N/A'}
- Category: ${recipeContext.category || 'N/A'}
- Traditionally served with: ${recipeContext.commonly_served_with?.join(', ') || 'N/A'}
`
    }

    // Fetch curated substitutions for this recipe's ingredients
    let substitutionsContext = ''
    if (recipeContext?.ingredients?.length > 0) {
      const ingredientNames = recipeContext.ingredients.map((i: any) => i.name).filter(Boolean)
      const subs = await getSubstitutions(ingredientNames)
      if (subs.length > 0) {
        substitutionsContext = `
Known Substitutions:
${JSON.stringify(subs, null, 2)}
`
      }
    }

    // Assemble the full user message
    let userMessage = message
    if (recipeContext) {
      userMessage = `
Recipe Context:
${JSON.stringify(recipeContext, null, 2)}
${tamilContext}
${substitutionsContext}
User message: ${message}
`
    }

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ai.models.generateContentStream({
            model: 'gemma-4-31b-it',
            config: {
              systemInstruction: CHEF_SYSTEM_PROMPT,
            },
            contents,
          })

          for await (const chunk of response) {
            const text = chunk.text
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (error: any) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}