// src/app/api/auth/route.ts
// Server-side auth validation for evaluator bypass

import { NextRequest } from 'next/server';
import type { AuthCredentials, AuthResponse } from '@/types';
import { isValidAuthCredentials } from '@/types';

// Evaluator credentials — stored server-side only, never exposed to client bundle
const EVALUATOR_EMAIL = 'admin@promptwars.io';
const EVALUATOR_PASSWORD = 'NoidaPromptWars2026!';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: unknown = await request.json();

    if (!isValidAuthCredentials(body)) {
      return new Response(
        JSON.stringify({ success: false, role: 'user', message: 'Invalid request format.' } satisfies AuthResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, password }: AuthCredentials = body;

    if (
      email.toLowerCase() === EVALUATOR_EMAIL &&
      password === EVALUATOR_PASSWORD
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          role: 'admin',
          message: 'Authenticated as Competition Evaluator.',
        } satisfies AuthResponse),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `ethnovibe_role=admin; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        role: 'user',
        message: 'Invalid credentials.',
      } satisfies AuthResponse),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, role: 'user', message: 'Server error.' } satisfies AuthResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({ status: 'EthnoVibe Auth Route is operational.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
