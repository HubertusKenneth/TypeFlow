import { Zap, Target, TrendingUp, Clock, RotateCcw } from 'lucide-react';
import { TypingState, TestConfig, calculateWPM, calculateAccuracy, calculateRawWPM, formatTime } from '../utils/helpers';

interface ResultsProps {
  state: TypingState;
  config: TestConfig;
  onRestart: () => void;
}

export function Results({ state, config, onRestart }: ResultsProps) {
  const totalTimeMs = (state.endTime || Date.now()) - (state.startTime || Date.now());
  const wpm = calculateWPM(state.correctChars, state.totalTyped, totalTimeMs);
  const rawWpm = calculateRawWPM(state.totalTyped, totalTimeMs);
  const accuracy = calculateAccuracy(state.correctChars, state.totalTyped);
  const timeStr = formatTime(totalTimeMs);

  const correctWords = state.wordHistory.filter((w) => w.correct).length;
  const incorrectWords = state.wordHistory.length - correctWords;

  const consistency = calculateConsistency(state.wordHistory);

  const getWpmRating = (wpm: number) => {
    if (wpm >= 80) return { label: 'Professional', color: 'text-dark-error dark:text-light-error' };
    if (wpm >= 60) return { label: 'Fast', color: 'text-dark-correct dark:text-light-correct' };
    if (wpm >= 40) return { label: 'Average', color: 'text-dark-accent dark:text-light-accent' };
    if (wpm >= 20) return { label: 'Beginner', color: 'text-yellow-500' };
    return { label: 'Learning', color: 'text-dark-muted dark:text-light-muted' };
  };

  const wpmRating = getWpmRating(wpm);

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="WPM"
          value={wpm}
          highlight
          rating={wpmRating.label}
          ratingColor={wpmRating.color}
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Accuracy"
          value={accuracy}
          suffix="%"
          highlight
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Raw WPM"
          value={rawWpm}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Time"
          value={timeStr}
          isString
        />
      </div>

      {/* Detailed Stats */}
      <div className="bg-dark-surface/30 dark:bg-light-surface/30 rounded-2xl p-6 border border-dark-muted/10 dark:border-light-muted/10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
          <DetailStat label="Correct Words" value={correctWords} />
          <DetailStat label="Incorrect Words" value={incorrectWords} />
          <DetailStat label="Correct Chars" value={state.correctChars} />
          <DetailStat label="Incorrect Chars" value={state.incorrectChars} />
          <DetailStat label="Consistency" value={`${consistency}%`} />
          <DetailStat label="Total Words" value={state.wordHistory.length} />
          <DetailStat label="Test Mode" value={config.mode === 'time' ? `${config.time}s` : `${config.wordCount} words`} isString />
          <DetailStat label="Difficulty" value={config.difficulty} isString />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-dark-accent/20 dark:bg-light-accent/20 text-dark-text dark:text-light-text rounded-xl border border-dark-accent/30 dark:border-light-accent/30 hover:bg-dark-accent/30 dark:hover:bg-light-accent/30 transition-all duration-200 font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  highlight?: boolean;
  rating?: string;
  ratingColor?: string;
  isString?: boolean;
}

function StatCard({ icon, label, value, suffix, highlight, rating, ratingColor, isString }: StatCardProps) {
  return (
    <div className="bg-dark-surface/50 dark:bg-light-surface/50 rounded-xl p-4 md:p-5 border border-dark-muted/10 dark:border-light-muted/10 hover:border-dark-muted/20 dark:hover:border-light-muted/20 transition-all group">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-dark-muted dark:text-light-muted group-hover:text-dark-accent dark:group-hover:text-light-accent transition-colors">
          {icon}
        </span>
        <span className="text-xs text-dark-muted dark:text-light-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-2xl md:text-3xl font-bold tabular-nums ${highlight ? 'text-dark-accent dark:text-light-accent' : 'text-dark-text dark:text-light-text'}`}>
        {isString ? value : value.toLocaleString()}{suffix}
      </div>
      {rating && <div className={`text-xs mt-1 ${ratingColor}`}>{rating}</div>}
    </div>
  );
}

interface DetailStatProps {
  label: string;
  value: number | string;
  isString?: boolean;
}

function DetailStat({ label, value, isString }: DetailStatProps) {
  return (
    <div>
      <div className="text-xs text-dark-muted dark:text-light-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-semibold text-dark-text dark:text-light-text tabular-nums">
        {isString ? value : typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

function calculateConsistency(wordHistory: TypingState['wordHistory']): number {
  if (wordHistory.length < 2) return 100;

  const wpmPerWord = wordHistory.map((word) => {
    const totalChars = Array.from(word.typed).length;
    return totalChars / 5;
  });

  const avg = wpmPerWord.reduce((a, b) => a + b, 0) / wpmPerWord.length;
  const variance = wpmPerWord.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / wpmPerWord.length;
  const stdDev = Math.sqrt(variance);
  const cv = avg > 0 ? (stdDev / avg) * 100 : 0;

  return Math.max(0, Math.min(100, Math.round(100 - cv)));
}
