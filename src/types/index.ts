// src/types/index.ts
// Strict TypeScript interfaces — no "any" allowed

export type AIFeature = 'lore' | 'hidden-gems' | 'cultural-pulse';

export interface AIStreamRequest {
  feature: AIFeature;
  location: string;
  context?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  role: 'admin' | 'user';
  message: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  category: 'heritage' | 'nature' | 'food' | 'arts' | 'spiritual';
  description: string;
  crowdLevel: 'low' | 'moderate' | 'high';
}

export interface CulturalEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'festival' | 'performance' | 'workshop' | 'market' | 'ritual';
  description: string;
}

export interface LoreNarrative {
  location: string;
  era: string;
  narrative: string;
  keywords: string[];
}

export interface StreamChunk {
  text: string;
  done: boolean;
}

// Type guard helpers
export function isAIFeature(value: string): value is AIFeature {
  return ['lore', 'hidden-gems', 'cultural-pulse'].includes(value);
}

export function isValidAuthCredentials(
  value: unknown
): value is AuthCredentials {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'password' in value &&
    typeof (value as Record<string, unknown>).email === 'string' &&
    typeof (value as Record<string, unknown>).password === 'string'
  );
}

export function isValidAIRequest(value: unknown): value is AIStreamRequest {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.feature === 'string' &&
    isAIFeature(obj.feature) &&
    typeof obj.location === 'string' &&
    obj.location.trim().length > 0
  );
}
