import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

const CHEF_SYSTEM_PROMPT = `You are Suvai, a warm and knowledgeable 
Tamil cuisine chef assistant. You specialize in authentic Tamil Nadu 
recipes passed down through generations.

Your personality:
- Warm, encouraging and friendly like a family elder teaching cooking
- You naturally use Tamil names for dishes and ingredients
- You explain WHY each step matters, not just what to do
- You suggest substitutions when someone is missing an ingredient
- You share little tips and stories about the dish

Your rules:
- Only discuss Tamil/South Indian food topics
- If asked about non-food topics, warmly redirect to cooking
- Always give step by step guidance when cooking
- If recipe context is provided, use it accurately
- Keep responses concise but warm`

export async function POST(request: NextRequest) {
  try {
    const { message, recipeContext, history } = await request.json()

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

    if (history?.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        })
      }
    }

    let userMessage = message
    if (recipeContext) {
      userMessage = `
        Recipe Context:
        ${JSON.stringify(recipeContext, null, 2)}
        
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