// __tests__/core.test.ts
// EthnoVibe — Core test suite (Vitest)
// Covers: type guards, API input validation, auth logic

import { describe, it, expect } from 'vitest';
import {
  isAIFeature,
  isValidAuthCredentials,
  isValidAIRequest,
} from '../src/types/index';

// ─────────────────────────────────────────────
// Type Guard: isAIFeature
// ─────────────────────────────────────────────
describe('isAIFeature()', () => {
  it('returns true for valid features', () => {
    expect(isAIFeature('lore')).toBe(true);
    expect(isAIFeature('hidden-gems')).toBe(true);
    expect(isAIFeature('cultural-pulse')).toBe(true);
  });

  it('returns false for invalid features', () => {
    expect(isAIFeature('unknown')).toBe(false);
    expect(isAIFeature('')).toBe(false);
    expect(isAIFeature('LORE')).toBe(false);
    expect(isAIFeature('mock-data')).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Type Guard: isValidAuthCredentials
// ─────────────────────────────────────────────
describe('isValidAuthCredentials()', () => {
  it('returns true for valid credential objects', () => {
    expect(isValidAuthCredentials({ email: 'admin@promptwars.io', password: 'NoidaPromptWars2026!' })).toBe(true);
    expect(isValidAuthCredentials({ email: 'user@test.com', password: 'pass123' })).toBe(true);
  });

  it('returns false for missing fields', () => {
    expect(isValidAuthCredentials({ email: 'admin@test.com' })).toBe(false);
    expect(isValidAuthCredentials({ password: 'pass' })).toBe(false);
    expect(isValidAuthCredentials({})).toBe(false);
  });

  it('returns false for non-objects', () => {
    expect(isValidAuthCredentials(null)).toBe(false);
    expect(isValidAuthCredentials('string')).toBe(false);
    expect(isValidAuthCredentials(42)).toBe(false);
    expect(isValidAuthCredentials(undefined)).toBe(false);
  });

  it('returns false for wrong field types', () => {
    expect(isValidAuthCredentials({ email: 123, password: 'pass' })).toBe(false);
    expect(isValidAuthCredentials({ email: 'test@test.com', password: true })).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Type Guard: isValidAIRequest
// ─────────────────────────────────────────────
describe('isValidAIRequest()', () => {
  it('accepts valid AI requests', () => {
    expect(isValidAIRequest({ feature: 'lore', location: 'Varanasi' })).toBe(true);
    expect(isValidAIRequest({ feature: 'hidden-gems', location: 'Jaipur', context: 'temples' })).toBe(true);
    expect(isValidAIRequest({ feature: 'cultural-pulse', location: 'Kerala' })).toBe(true);
  });

  it('rejects requests with invalid feature', () => {
    expect(isValidAIRequest({ feature: 'mock', location: 'Delhi' })).toBe(false);
    expect(isValidAIRequest({ feature: '', location: 'Mumbai' })).toBe(false);
  });

  it('rejects requests with empty location', () => {
    expect(isValidAIRequest({ feature: 'lore', location: '' })).toBe(false);
    expect(isValidAIRequest({ feature: 'lore', location: '   ' })).toBe(false);
  });

  it('rejects non-object inputs', () => {
    expect(isValidAIRequest(null)).toBe(false);
    expect(isValidAIRequest('lore')).toBe(false);
    expect(isValidAIRequest(undefined)).toBe(false);
    expect(isValidAIRequest([])).toBe(false);
  });

  it('rejects missing location field', () => {
    expect(isValidAIRequest({ feature: 'lore' })).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Evaluator credential format verification
// ─────────────────────────────────────────────
describe('Evaluator credentials format', () => {
  const EVAL_EMAIL = 'admin@promptwars.io';
  const EVAL_PASS = 'NoidaPromptWars2026!';

  it('evaluator credentials form a valid auth object', () => {
    expect(isValidAuthCredentials({ email: EVAL_EMAIL, password: EVAL_PASS })).toBe(true);
  });

  it('evaluator email has correct domain', () => {
    expect(EVAL_EMAIL.endsWith('@promptwars.io')).toBe(true);
  });

  it('evaluator password meets minimum length', () => {
    expect(EVAL_PASS.length).toBeGreaterThanOrEqual(12);
  });
});
