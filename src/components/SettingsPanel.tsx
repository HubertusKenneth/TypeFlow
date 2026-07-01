import { Clock, Hash, Type, Gauge, Check } from 'lucide-react';
import { TestConfig, TimeOption, WordCountOption, DifficultyLevel } from '../utils/helpers';

interface SettingsPanelProps {
  config: TestConfig;
  onConfigChange: (config: TestConfig) => void;
  isTyping: boolean;
}

const timeOptions: TimeOption[] = [15, 30, 60, 120];
const wordCountOptions: WordCountOption[] = [10, 25, 50, 100];
const difficultyOptions: DifficultyLevel[] = ['easy', 'medium', 'hard', 'insane'];

export function SettingsPanel({ config, onConfigChange, isTyping }: SettingsPanelProps) {
  const handleToggle = (key: keyof Pick<TestConfig, 'includePunctuation' | 'includeNumbers'>) => {
    onConfigChange({ ...config, [key]: !config[key] });
  };

  const handleModeChange = (mode: 'words' | 'time') => {
    onConfigChange({ ...config, mode });
  };

  const handleTimeChange = (time: TimeOption) => {
    onConfigChange({ ...config, time });
  };

  const handleWordCountChange = (wordCount: WordCountOption) => {
    onConfigChange({ ...config, wordCount });
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    onConfigChange({ ...config, difficulty });
  };

  return (
    <div 
      className={`w-full max-w-4xl mx-auto mb-8 transition-all duration-300 ${isTyping ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center justify-center bg-dark-surface/50 dark:bg-light-surface/50 rounded-xl p-1 border border-dark-muted/10 dark:border-light-muted/10">
          <button
            onClick={() => handleModeChange('time')}
            className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
              config.mode === 'time'
                ? 'bg-dark-accent/20 dark:bg-light-accent/20 text-dark-accent dark:text-light-accent'
                : 'text-dark-muted dark:text-light-muted hover:text-dark-text dark:hover:text-light-text'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            time
          </button>
          <button
            onClick={() => handleModeChange('words')}
            className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
              config.mode === 'words'
                ? 'bg-dark-accent/20 dark:bg-light-accent/20 text-dark-accent dark:text-light-accent'
                : 'text-dark-muted dark:text-light-muted hover:text-dark-text dark:hover:text-light-text'
            }`}
          >
            <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            words
          </button>
        </div>

        {config.mode === 'time' && (
          <div className="flex flex-wrap items-center justify-center bg-dark-surface/50 dark:bg-light-surface/50 rounded-xl p-1 border border-dark-muted/10 dark:border-light-muted/10">
            {timeOptions.map((time) => (
               <button
                key={time}
                onClick={() => handleTimeChange(time)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  config.time === time
                    ? 'bg-dark-accent/20 dark:bg-light-accent/20 text-dark-accent dark:text-light-accent'
                    : 'text-dark-muted dark:text-light-muted hover:text-dark-text dark:hover:text-light-text'
                }`}
              >
                {time}s
              </button>
            ))}
          </div>
        )}

        {config.mode === 'words' && (
          <div className="flex flex-wrap items-center justify-center bg-dark-surface/50 dark:bg-light-surface/50 rounded-xl p-1 border border-dark-muted/10 dark:border-light-muted/10">
            {wordCountOptions.map((count) => (
              <button
                key={count}
                onClick={() => handleWordCountChange(count)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  config.wordCount === count
                    ? 'bg-dark-accent/20 dark:bg-light-accent/20 text-dark-accent dark:text-light-accent'
                    : 'text-dark-muted dark:text-light-muted hover:text-dark-text dark:hover:text-light-text'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center bg-dark-surface/50 dark:bg-light-surface/50 rounded-xl p-1 border border-dark-muted/10 dark:border-light-muted/10">
          {difficultyOptions.map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                config.difficulty === diff
                  ? 'bg-dark-accent/20 dark:bg-light-accent/20 text-dark-accent dark:text-light-accent'
                  : 'text-dark-muted dark:text-light-muted hover:text-dark-text dark:hover:text-light-text'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
        <button
          onClick={() => handleToggle('includePunctuation')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
            config.includePunctuation
              ? 'border-dark-accent/50 dark:border-light-accent/50 bg-dark-accent/10 dark:bg-light-accent/10 text-dark-accent dark:text-light-accent'
              : 'border-dark-muted/20 dark:border-light-muted/20 text-dark-muted dark:text-light-muted hover:border-dark-muted/40 dark:hover:border-light-muted/40'
          }`}
        >
          {config.includePunctuation ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          punctuation
        </button>

        <button
          onClick={() => handleToggle('includeNumbers')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
            config.includeNumbers
              ? 'border-dark-accent/50 dark:border-light-accent/50 bg-dark-accent/10 dark:bg-light-accent/10 text-dark-accent dark:text-light-accent'
              : 'border-dark-muted/20 dark:border-light-muted/20 text-dark-muted dark:text-light-muted hover:border-dark-muted/40 dark:hover:border-light-muted/40'
          }`}
        >
          {config.includeNumbers ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          numbers
        </button>
      </div>
    </div>
  );
}
