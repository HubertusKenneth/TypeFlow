import { commonWords, punctuationMarks, numbers } from '../data/words';

export type TestMode = 'words' | 'time';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordCountOption = 10 | 25 | 50 | 100;
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'insane';

export interface TestConfig {
  mode: TestMode;
  time: TimeOption;
  wordCount: WordCountOption;
  includePunctuation: boolean;
  includeNumbers: boolean;
  difficulty: DifficultyLevel;
}

export interface TypingState {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typed: string;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
  startTime: number | null;
  endTime: number | null;
  isTyping: boolean;
  isComplete: boolean;
  wordHistory: WordResult[];
}

export interface WordResult {
  word: string;
  typed: string;
  correct: boolean;
  chars: { char: string; typed: string | null; correct: boolean | null }[];
}

export function generateWords(config: TestConfig): string[] {
  const count = config.mode === 'words' ? config.wordCount : 200;
  const words: string[] = [];

  const wordPool = getWordPoolByDifficulty(config.difficulty);

  for (let i = 0; i < count; i++) {
    let word = wordPool[Math.floor(Math.random() * wordPool.length)];

    const isInsane = config.difficulty === 'insane';
    const shouldPunc = config.includePunctuation || isInsane;
    const puncThreshold = isInsane ? 0.6 : 0.85;

    if (shouldPunc && Math.random() > puncThreshold) {
      const punctuation = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      if (['.', ',', '!', '?', ';', ':', ')'].includes(punctuation)) {
        word += punctuation;
      } else if (['(', '"', "'"].includes(punctuation)) {
        word = punctuation + word;
      } else if (punctuation === '-') {
        word = word + punctuation + wordPool[Math.floor(Math.random() * wordPool.length)];
      }
    }

    if (isInsane && Math.random() > 0.6) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    if (config.includeNumbers && Math.random() > 0.92) {
      const num = numbers[Math.floor(Math.random() * numbers.length)];
      word = num + word;
    }

    words.push(word);
  }

  return words;
}

function getWordPoolByDifficulty(difficulty: DifficultyLevel): string[] {
  const easyWords = commonWords.filter(w => w.length <= 4);
  const mediumWords = commonWords.filter(w => w.length > 4 && w.length <= 6);
  const hardWords = commonWords.filter(w => w.length > 6);

  switch (difficulty) {
    case 'easy':
      // Easy: 100% short words (<= 4 letters)
      return easyWords;
    case 'medium':
      // Medium: Mostly 5-6 letter words, with a small mix of short words for natural flow
      return [...mediumWords, ...mediumWords, ...easyWords.slice(0, 20)];
    case 'hard':
      // Hard: Heavy emphasis on long words (> 6 letters), mixed with some medium words
      return [...hardWords, ...hardWords, ...hardWords, ...mediumWords.slice(0, 20)];
    case 'insane':
      // Insane: Same pool as hard, but generateWords will add punctuation and uppercase
      return [...hardWords, ...hardWords, ...hardWords, ...mediumWords.slice(0, 20)];
    default:
      return commonWords;
  }
}

export function calculateWPM(
  correctChars: number,
  _totalChars: number,
  timeMs: number
): number {
  if (timeMs === 0) return 0;
  const minutes = timeMs / 60000;
  const words = correctChars / 5;
  return Math.round(words / minutes);
}

export function calculateRawWPM(totalChars: number, timeMs: number): number {
  if (timeMs === 0) return 0;
  const minutes = timeMs / 60000;
  const words = totalChars / 5;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

export function getCharStatus(
  char: string,
  typedChar: string | null,
  index: number,
  currentWordIndex: number,
  wordIndex: number,
  currentCharIndex: number
): 'pending' | 'correct' | 'incorrect' | 'current' | 'extra' {
  if (wordIndex < currentWordIndex) {
    return typedChar === char ? 'correct' : typedChar ? 'incorrect' : 'pending';
  }

  if (wordIndex === currentWordIndex) {
    if (index < currentCharIndex) {
      return typedChar === char ? 'correct' : 'incorrect';
    }
    if (index === currentCharIndex) {
      return 'current';
    }
    if (index >= currentCharIndex && typedChar) {
      return 'extra';
    }
    return 'pending';
  }

  return 'pending';
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}
