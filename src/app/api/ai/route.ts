// src/app/api/ai/route.ts
// Edge runtime — Gemini streaming endpoint
// All AI interactions are secured server-side. No API keys on the client.

import { NextRequest } from 'next/server';
import { streamGeminiResponse } from '@/lib/gemini';
import { isValidAIRequest } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: unknown = await request.json();

    if (!isValidAIRequest(body)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request. Required: { feature: AIFeature, location: string }',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { feature, location, context } = body;

    const stream = await streamGeminiResponse(feature, location, context);

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';

    // Handle Gemini API rate limit gracefully
    if (message.includes('quota') || message.includes('rate')) {
      return new Response(
        JSON.stringify({
          error: 'AI service temporarily at capacity. Please try again in a moment.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to generate AI response.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({ status: 'EthnoVibe AI Route is operational.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
