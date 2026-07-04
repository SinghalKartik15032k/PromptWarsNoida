'use client';

// src/components/HiddenGemAggregator.tsx
// AI-powered hidden gem discovery for authentic off-the-beaten-path locations

import { useState, useCallback } from 'react';
import StreamingText from './StreamingText';

export default function HiddenGemAggregator() {
  const [location, setLocation] = useState('');
  const [context, setContext] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBody, setStreamBody] = useState<string | undefined>(undefined);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDiscover = () => {
    if (!location.trim()) return;
    setError(null);
    setHasResult(false);
    setStreamBody(
      JSON.stringify({
        feature: 'hidden-gems',
        location: location.trim(),
        context: context.trim() || undefined,
      })
    );
    setIsStreaming(true);
  };

  const handleComplete = useCallback(() => {
    setHasResult(true);
    setIsStreaming(false);
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setIsStreaming(false);
  }, []);

  const handleReset = () => {
    setIsStreaming(false);
    setHasResult(false);
    setStreamBody(undefined);
    setError(null);
  };

  const interestOptions = [
    'Heritage temples', 'Artisan crafts', 'Street food', 'Ancient ruins', 'Folk music',
  ];

  const cityOptions = ['Jaipur', 'Kolkata', 'Mysuru', 'Pondicherry', 'Bhopal'];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-teal/15 flex items-center justify-center text-xl shrink-0">
          💎
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-brand-text">Hidden Gem Aggregator</h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Discover culturally rich spots tourists never find
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-brand-subtle mb-1.5">
            City or Region
          </label>
          <input
            id="gem-location-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Jaipur, Rajasthan"
            className="w-full px-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-text placeholder-brand-muted text-sm focus:outline-none focus:border-brand-teal/60 focus:ring-1 focus:ring-brand-teal/30 transition-colors"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {cityOptions.map((c) => (
              <button
                key={c}
                onClick={() => setLocation(c)}
                className="px-2.5 py-1 text-xs rounded-full border border-brand-border text-brand-muted hover:border-brand-teal/50 hover:text-brand-teal transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-subtle mb-1.5">
            Cultural Interest <span className="text-brand-muted">(optional)</span>
          </label>
          <input
            id="gem-interest-input"
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. ancient temples, textile arts"
            className="w-full px-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-text placeholder-brand-muted text-sm focus:outline-none focus:border-brand-teal/60 focus:ring-1 focus:ring-brand-teal/30 transition-colors"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {interestOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setContext(opt)}
                className="px-2.5 py-1 text-xs rounded-full border border-brand-border text-brand-muted hover:border-brand-teal/50 hover:text-brand-teal transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex gap-2">
        <button
          id="gem-discover-btn"
          onClick={handleDiscover}
          disabled={isStreaming || !location.trim()}
          className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-teal/90 to-brand-teal-glow text-brand-bg hover:shadow-glow-teal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isStreaming ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-brand-bg/40 border-t-brand-bg animate-spin" />
              Discovering Gems...
            </>
          ) : (
            '💎 Uncover Hidden Gems'
          )}
        </button>

        {(hasResult || error) && (
          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text transition-colors text-sm"
          >
            ↺ Reset
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-xs text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Output */}
      {(isStreaming || hasResult) && streamBody && (
        <div className="rounded-xl bg-brand-surface border border-brand-border/60 p-4 min-h-[120px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-border/40">
            <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">
              💎 Hidden Gems Found
            </span>
            {isStreaming && (
              <span className="text-xs text-brand-muted italic animate-pulse">Live AI stream...</span>
            )}
          </div>
          <StreamingText
            isStreaming={isStreaming}
            streamUrl="/api/ai"
            streamBody={streamBody}
            onComplete={handleComplete}
            onError={handleError}
          />
        </div>
      )}
    </div>
  );
}
