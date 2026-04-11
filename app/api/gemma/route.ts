import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const response = await ai.models.generateContent({
      model: 'gemma-4-31b-it',        
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}