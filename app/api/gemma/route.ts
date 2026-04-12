import { GoogleGenAI } from '@google/genai';
import { NextRequest } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await ai.models.generateContentStream({
            model: 'gemma-4-31b-it',
            contents: prompt,
          });

          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error: any) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}