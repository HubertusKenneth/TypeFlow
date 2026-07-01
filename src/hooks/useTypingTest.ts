import { useState, useCallback, useRef, useEffect } from 'react';
import {
  TypingState,
  TestConfig,
  WordResult,
  generateWords,
} from '../utils/helpers';

const initialState: TypingState = {
  words: [],
  currentWordIndex: 0,
  currentCharIndex: 0,
  typed: '',
  correctChars: 0,
  incorrectChars: 0,
  totalTyped: 0,
  startTime: null,
  endTime: null,
  isTyping: false,
  isComplete: false,
  wordHistory: [],
};

export function useTypingTest(config: TestConfig) {
  const [state, setState] = useState<TypingState>(initialState);
  const timerRef = useRef<number | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const pauseTimeRef = useRef<number | null>(null);

  const resetTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pauseTimeRef.current = null;
    const newWords = generateWords(configRef.current);
    setState({ ...initialState, words: newWords });
  }, []);

  useEffect(() => {
    resetTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTest]);

  const endTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isTyping: false,
      isComplete: true,
      endTime: Date.now(),
    }));
  }, []);

  const pauseTest = useCallback(() => {
    setState((prev) => {
      if (!prev.startTime || prev.isComplete || !prev.isTyping) return prev;
      
      pauseTimeRef.current = Date.now();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return { ...prev, isTyping: false };
    });
  }, []);

  const resumeTest = useCallback(() => {
    setState((prev) => {
      if (!prev.startTime || prev.isComplete || !pauseTimeRef.current) return prev;
      
      const pausedDuration = Date.now() - pauseTimeRef.current;
      const newStartTime = prev.startTime + pausedDuration;
      pauseTimeRef.current = null;

      if (configRef.current.mode === 'time') {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = window.setInterval(() => {
          setState((s) => {
            if (!s.startTime || s.isComplete) return s;
            const elapsed = Date.now() - s.startTime;
            if (elapsed >= configRef.current.time * 1000) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
              return { ...s, isTyping: false, isComplete: true, endTime: Date.now() };
            }
            return s;
          });
        }, 200);
      }

      return { ...prev, startTime: newStartTime, isTyping: true };
    });
  }, []);

  const submitWord = useCallback((word: string, typed: string): WordResult => {
    const chars: WordResult['chars'] = [];
    const maxLength = Math.max(word.length, typed.length);

    for (let i = 0; i < maxLength; i++) {
      const originalChar = word[i] || '';
      const typedChar = typed[i] ?? null;

      if (i < word.length && i < typed.length) {
        chars.push({ char: originalChar, typed: typedChar, correct: originalChar === typedChar });
      } else if (i >= word.length) {
        chars.push({ char: '', typed: typedChar, correct: false });
      } else {
        chars.push({ char: originalChar, typed: null, correct: null });
      }
    }

    return { word, typed, correct: typed === word, chars };
  }, []);

  const handleInput = useCallback(
    (key: string) => {
      setState((prev) => {
        if (prev.isComplete) return prev;

        const currentWord = prev.words[prev.currentWordIndex];
        if (!currentWord) return prev;

        if (key === ' ') {
          if (prev.typed.length === 0) return prev;

          const wordResult = submitWord(currentWord, prev.typed);
          const nextIndex = prev.currentWordIndex + 1;
          const missingChars = Math.max(0, currentWord.length - prev.typed.length);
          
          const newCorrectChars = prev.correctChars + 1;
          const newTotalTyped = prev.totalTyped + 1 + missingChars;

          const isLastWord = nextIndex >= prev.words.length;
          if (isLastWord) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return {
              ...prev,
              currentWordIndex: nextIndex,
              typed: '',
              currentCharIndex: 0,
              correctChars: newCorrectChars,
              totalTyped: newTotalTyped,
              incorrectChars: prev.incorrectChars + missingChars,
              isTyping: false,
              isComplete: true,
              endTime: Date.now(),
              wordHistory: [...prev.wordHistory, wordResult],
            };
          }

          return {
            ...prev,
            currentWordIndex: nextIndex,
            typed: '',
            currentCharIndex: 0,
            correctChars: newCorrectChars,
            totalTyped: newTotalTyped,
            incorrectChars: prev.incorrectChars + missingChars,
            wordHistory: [...prev.wordHistory, wordResult],
          };
        }

        if (key === 'Backspace') {
          if (prev.typed.length === 0) {
            if (prev.currentWordIndex === 0) return prev;

            const prevWordIndex = prev.currentWordIndex - 1;
            const prevWordResult = prev.wordHistory[prevWordIndex];
            if (!prevWordResult) return prev;

            if (prevWordResult.correct) {
              return prev; 
            }

            const restoredTyped = prevWordResult.typed;
            const revertedCorrectChars = prev.correctChars > 0 ? prev.correctChars - 1 : 0;

            return {
              ...prev,
              currentWordIndex: prevWordIndex,
              typed: restoredTyped,
              currentCharIndex: restoredTyped.length,
              correctChars: revertedCorrectChars, 
              wordHistory: prev.wordHistory.slice(0, -1),
            };
          }

          const lastTyped = prev.typed[prev.typed.length - 1];
          const lastExpected = currentWord[prev.typed.length - 1];
          const wasCorrect = lastTyped === lastExpected;

          return {
            ...prev,
            typed: prev.typed.slice(0, -1),
            currentCharIndex: prev.typed.length - 1,
            correctChars: wasCorrect ? prev.correctChars - 1 : prev.correctChars,
          };
        }

        if (key.length !== 1) return prev;

        const newTyped = prev.typed + key;
        const charIndex = prev.typed.length;
        const expectedChar = currentWord[charIndex];
        const isCorrect = key === expectedChar;

        const newStartTime = prev.startTime ?? Date.now();
        const wasJustStarted = prev.startTime === null;

        if (wasJustStarted && configRef.current.mode === 'time') {
          timerRef.current = window.setInterval(() => {
            setState((s) => {
              if (!s.startTime || s.isComplete) return s;
              const elapsed = Date.now() - s.startTime;
              if (elapsed >= configRef.current.time * 1000) {
                clearInterval(timerRef.current!);
                timerRef.current = null;
                return { ...s, isTyping: false, isComplete: true, endTime: Date.now() };
              }
              return s;
            });
          }, 200);
        }

        return {
          ...prev,
          typed: newTyped,
          currentCharIndex: newTyped.length,
          correctChars: isCorrect ? prev.correctChars + 1 : prev.correctChars,
          incorrectChars: !isCorrect ? prev.incorrectChars + 1 : prev.incorrectChars,
          totalTyped: prev.totalTyped + 1,
          startTime: newStartTime,
          isTyping: true,
        };
      });
    },
    [submitWord]
  );

  return { state, handleInput, resetTest, endTest, pauseTest, resumeTest };
}