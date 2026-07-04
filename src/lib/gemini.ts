// src/lib/gemini.ts
// Server-only Gemini client — never import on the client side

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIFeature } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY is not set. Add it to .env.local or Vercel Environment Variables.'
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ordered fallback: each model has an independent quota bucket
const MODEL_CANDIDATES = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-pro',
] as const;

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 30000; // Match Google's retryDelay suggestion

function buildPrompt(feature: AIFeature, location: string, context?: string): string {
  const base = context ? `Additional context: ${context}\n\n` : '';

  switch (feature) {
    case 'lore':
      return `${base}You are a cinematic cultural historian and master storyteller. 
Generate an immersive, atmospheric historical narrative (300-400 words) for the location: "${location}".
Structure your response as: 
1. A vivid opening hook (2-3 sentences) 
2. Key historical moments (2-3 paragraphs) 
3. The cultural soul of this place today (1 paragraph)
Use sensory language. Make the reader feel transported. Avoid generic tourist descriptions.`;

    case 'hidden-gems':
      return `${base}You are an expert cultural anthropologist and local travel insider for "${location}".
Identify and describe 4-5 hidden gems that most tourists completely miss. For each gem provide:
- Name and exact type (heritage site / artisan market / local ritual / etc.)
- Why it matters culturally (1-2 sentences)
- Best time to visit and local tips
- Crowd level (low/moderate)
Focus on authentic, non-commercialized experiences that reveal the real soul of the destination.`;

    case 'cultural-pulse':
      return `${base}You are a hyper-local cultural curator for "${location}".
Synthesize a cultural events calendar for the next 30 days covering:
1. Traditional festivals or religious observances
2. Local artisan markets or craft fairs
3. Community performance arts (music, dance, theater)
4. Heritage workshops open to visitors
5. Seasonal food or agricultural traditions
For each event provide: name, approximate date/period, location within the city, and why a traveler should attend. Be specific, not generic.`;

    default: {
      const exhaustiveCheck: never = feature;
      throw new Error(`Unknown feature: ${exhaustiveCheck}`);
    }
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryGenerateStream(
  modelName: string,
  prompt: string,
  retries: number = MAX_RETRIES
): Promise<ReadableStream<Uint8Array>> {
  const model = genAI.getGenerativeModel({ model: modelName });
  const encoder = new TextEncoder();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContentStream(prompt);

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (streamError) {
            controller.error(streamError);
          }
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Gemini attempt ${attempt + 1}/${retries + 1} failed (${modelName}):`, message);

      // If it's a 429 rate limit error and we have retries left, wait and retry
      if ((message.includes('429') || message.includes('quota') || message.includes('rate')) && attempt < retries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      // For non-retryable errors or exhausted retries, throw
      throw error;
    }
  }

  throw new Error('All retry attempts exhausted');
}

export async function streamGeminiResponse(
  feature: AIFeature,
  location: string,
  context?: string
): Promise<ReadableStream<Uint8Array>> {
  const prompt = buildPrompt(feature, location, context);

  // Try each model candidate in order until one works
  const errors: string[] = [];

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`Trying model: ${modelName}`);
      const stream = await tryGenerateStream(modelName, prompt);
      console.log(`Success with model: ${modelName}`);
      return stream;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${modelName}: ${message}`);
      console.warn(`Model ${modelName} failed, trying next fallback...`);
      continue;
    }
  }

  throw new Error(`All models exhausted. Errors: ${errors.join(' | ')}`);
}
