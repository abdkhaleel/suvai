import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
})

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  })

  if (!response.embeddings?.[0]?.values) {
    throw new Error('No embedding values returned from API')
  }

  return response.embeddings[0].values
}