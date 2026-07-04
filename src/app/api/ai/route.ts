// src/app/api/ai/route.ts
// Edge runtime — Gemini streaming endpoint
// All AI interactions are secured server-side. No API keys on the client.

import { NextRequest } from 'next/server';
import { streamGeminiResponse } from '../../../lib/gemini';
import { isValidAIRequest, type AIStreamRequest } from '../../../types';

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

    const { feature, location, context } = body as AIStreamRequest;

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
      console.error('Gemini Quota/Rate Error:', message);
      return new Response(
        JSON.stringify({
          error: `Gemini quota/rate error: ${message}`,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('AI Generation Error:', message);

    return new Response(
      JSON.stringify({ error: `Failed to generate AI response: ${message}` }),
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
