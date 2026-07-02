import { useState, useEffect } from 'react';
import { TypingState, TestConfig, calculateWPM, calculateAccuracy } from '../utils/helpers';

interface LiveStatsProps {
  state: TypingState;
  config: TestConfig;
}

export function LiveStats({ state, config }: LiveStatsProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!state.isTyping || state.isComplete || config.mode !== 'time') return;
    
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [state.startTime, state.isComplete, state.isTyping]);

  const now = Date.now();
  const elapsed = state.startTime ? Math.max(now - state.startTime, 0) : 0;

  let displaySeconds: number;
  let timeLabel: string;

  if (config.mode === 'time') {
    const remainingMs = Math.max(config.time * 1000 - elapsed, 0);
    displaySeconds = Math.ceil(remainingMs / 1000);
    timeLabel = 'time left';
  } else {
    displaySeconds = Math.floor(elapsed / 1000);
    timeLabel = 'elapsed';
  }

  const minutes = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;

  const currentWpm = calculateWPM(state.correctChars, state.totalTyped, elapsed);
  const currentAccuracy = calculateAccuracy(state.correctChars, state.totalTyped);

  const wordsCompleted = state.currentWordIndex;
  const charsTyped = state.correctChars + state.incorrectChars;

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-center md:gap-8 py-4">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-dark-text dark:text-light-text tabular-nums">
            {minutes > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${displaySeconds}`}
          </div>
          <div className="text-[10px] md:text-xs text-dark-muted dark:text-light-muted mt-1 uppercase tracking-wider">{timeLabel}</div>
        </div>

        <div className="hidden md:block w-px h-12 bg-dark-muted/20 dark:bg-light-muted/20" />

        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-dark-accent dark:text-light-accent tabular-nums">
            {state.startTime ? currentWpm : 0}
          </div>
          <div className="text-[10px] md:text-xs text-dark-muted dark:text-light-muted mt-1 uppercase tracking-wider">wpm</div>
        </div>

        <div className="hidden md:block w-px h-12 bg-dark-muted/20 dark:bg-light-muted/20" />

        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-dark-correct dark:text-light-correct tabular-nums">
            {state.startTime ? currentAccuracy : 100}%
          </div>
          <div className="text-[10px] md:text-xs text-dark-muted dark:text-light-muted mt-1 uppercase tracking-wider">accuracy</div>
        </div>

        <div className="hidden md:block w-px h-12 bg-dark-muted/20 dark:bg-light-muted/20" />

        <div className="text-center">
          <div className="text-lg md:text-xl font-bold text-dark-text dark:text-light-text tabular-nums">
            {wordsCompleted}
            <span className="text-dark-muted dark:text-light-muted text-xs md:text-sm ml-1">words</span>
          </div>
          <div className="text-xs md:text-sm text-dark-muted dark:text-light-muted">{charsTyped} chars</div>
        </div>
      </div>
    </div>
  );
}