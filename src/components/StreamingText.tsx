'use client';

// src/components/StreamingText.tsx
// Reusable streaming text renderer — reads a fetch Response body as a ReadableStream

import { useEffect, useRef, useState } from 'react';

interface StreamingTextProps {
  isStreaming: boolean;
  streamUrl?: string;
  streamBody?: string;
  className?: string;
  onComplete?: (text: string) => void;
  onError?: (err: string) => void;
}

export default function StreamingText({
  isStreaming,
  streamUrl,
  streamBody,
  className = '',
  onComplete,
  onError,
}: StreamingTextProps) {
  const [text, setText] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isStreaming || !streamUrl || !streamBody) return;

    setText('');
    setIsDone(false);

    abortRef.current = new AbortController();

    (async () => {
      try {
        const res = await fetch(streamUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: streamBody,
          signal: abortRef.current?.signal,
        });

        if (!res.ok) {
          const errData = await res.json() as { error?: string };
          onError?.(errData.error ?? 'Failed to get AI response.');
          return;
        }

        if (!res.body) {
          onError?.('No response body received.');
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setText(accumulated);
        }

        setIsDone(true);
        onComplete?.(accumulated);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        onError?.(err instanceof Error ? err.message : 'Stream error occurred.');
      }
    })();

    return () => {
      abortRef.current?.abort();
    };
  }, [isStreaming, streamUrl, streamBody, onComplete, onError]);

  if (!isStreaming && !text) return null;

  return (
    <div className={`relative ${className}`}>
      <p className="whitespace-pre-wrap leading-relaxed text-brand-text text-sm">
        {text}
        {isStreaming && !isDone && (
          <span className="inline-block w-0.5 h-4 bg-brand-amber ml-0.5 animate-blink align-middle" />
        )}
      </p>
    </div>
  );
}
