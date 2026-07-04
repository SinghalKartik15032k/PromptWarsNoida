// src/lib/gemini.ts
// Server-only Gemini client — never import on the client side

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIFeature } from '@/types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY is not set. Add it to .env.local or Vercel Environment Variables.'
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = 'gemini-1.5-flash';

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

export async function streamGeminiResponse(
  feature: AIFeature,
  location: string,
  context?: string
): Promise<ReadableStream<Uint8Array>> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = buildPrompt(feature, location, context);

  const result = await model.generateContentStream(prompt);

  const encoder = new TextEncoder();

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
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
