import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TypingState } from '../utils/helpers';

interface TypingAreaProps {
  state: TypingState;
  onInput: (key: string) => void;
  onRestart: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
}

export function TypingArea({ state, onInput, onRestart, pauseTest, resumeTest }: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(true);

  const words = displayWords(state);

  useEffect(() => {
    if (inputRef.current && !state.isComplete) {
      inputRef.current.focus();
    }
  }, [state.isComplete, state.words]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        inputRef.current && 
        !state.isComplete && 
        document.activeElement !== inputRef.current
      ) {
        if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [state.isComplete]);

  useEffect(() => {
    if (containerRef.current) {
      const currentWord = containerRef.current.querySelector(`[data-word="${state.currentWordIndex}"]`);
      if (currentWord) {
        const rect = currentWord.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const lineHeight = 48;

        if (rect.top - containerRect.top > lineHeight * 2) {
          containerRef.current.scrollTop += lineHeight;
        } else if (rect.top < containerRect.top + lineHeight) {
          containerRef.current.scrollTop = Math.max(0, containerRef.current.scrollTop - lineHeight);
        }
      }
    }
  }, [state.currentWordIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onRestart();
        return;
      }
      if (e.key === 'Enter' && state.isComplete) {
        e.preventDefault();
        onRestart();
        return;
      }
      if (e.key === 'Backspace' && state.typed.length === 0) {
        onInput('Backspace');
      }
    },
    [onInput, onRestart, state.isComplete, state.typed.length]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const typed = state.typed;

      if (val.length > typed.length) {
        const added = val.slice(typed.length);
        for (const char of added) {
          onInput(char);
        }
      } else if (val.length < typed.length) {
        const diff = typed.length - val.length;
        for (let i = 0; i < diff; i++) {
          onInput('Backspace');
        }
      }
    },
    [state.typed, onInput]
  );

  const handleContainerClick = useCallback(() => {
    if (inputRef.current && !state.isComplete) {
      inputRef.current.focus();
    }
  }, [state.isComplete]);

  if (state.words.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-dark-muted dark:text-light-muted animate-pulse-subtle select-none">
        Loading words...
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        autoFocus
        value={state.typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        data-gramm="false"
        onBlur={() => {
          setIsFocused(false);
          pauseTest();
        }}
        onFocus={() => {
          setIsFocused(true);
          resumeTest();
        }}
      />
      
      <div
        ref={containerRef}
        onMouseDown={(e) => e.preventDefault()}
        className="relative h-48 md:h-56 overflow-hidden leading-relaxed cursor-default transition-all p-4 sm:p-6 md:p-8 bg-dark-surface/30 dark:bg-light-surface/30 rounded-2xl border border-dark-muted/10 dark:border-light-muted/10 select-none"
      >
        <div className={`${state.isComplete || !isFocused ? 'blur-sm opacity-30' : ''} transition-all duration-300`}>
          {words}
        </div>
        
        {!isFocused && !state.isComplete && (
          <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <div className="flex flex-col items-center justify-center gap-2 text-dark-text dark:text-light-text animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-muted dark:text-light-muted">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                <circle cx="12" cy="13" r="2"/>
                <path d="M12 17v.01"/>
              </svg>
              <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-center px-4">Click here or press any key to focus</p>
            </div>
          </div>
        )}
      </div>

      {state.isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-surface/80 dark:bg-light-surface/80 rounded-2xl animate-fade-in select-none z-20">
          <div className="text-center">
            <p className="text-dark-muted dark:text-light-muted text-sm mb-2">test completed</p>
            <p className="text-dark-text dark:text-light-text text-lg">Press <kbd className="px-2 py-1 bg-dark-bg dark:bg-light-bg rounded-lg mx-1 font-bold">Tab</kbd> or <kbd className="px-2 py-1 bg-dark-bg dark:bg-light-bg rounded-lg mx-1 font-bold">Enter</kbd> to restart</p>
          </div>
        </div>
      )}
    </div>
  );
}

function displayWords(state: TypingState): React.ReactNode {
  return state.words.map((word, wordIndex) => {
    const isCurrentWord = wordIndex === state.currentWordIndex;
    const isPastWord = wordIndex < state.currentWordIndex;
    const historyWord = isPastWord ? state.wordHistory[wordIndex] : null;

    const chars = word.split('');
    
    let extraChars = '';
    if (isCurrentWord) {
      extraChars = state.typed.slice(word.length);
    } else if (isPastWord && historyWord) {
      extraChars = historyWord.typed.slice(word.length);
    }

    return (
      <span
        key={wordIndex}
        data-word={wordIndex}
        className={`typing-word pointer-events-none ${isPastWord ? 'opacity-60' : ''}`}
      >
        {chars.map((char, charIndex) => {
          let className = 'typing-char';
          const key = `${wordIndex}-${charIndex}`;

          if (isPastWord) {
            if (historyWord) {
              const charResult = historyWord.chars[charIndex];
              if (charResult && charResult.correct === true) {
                className += ' correct';
              } else if (charResult && charResult.correct === false) {
                className += ' incorrect';
              }
            } else {
              className += ' text-dark-muted dark:text-light-muted';
            }
          } else if (isCurrentWord) {
            if (charIndex < state.currentCharIndex) {
              className += state.typed[charIndex] === char ? ' correct' : ' incorrect';
            } else if (charIndex === state.currentCharIndex) {
              return (
                <React.Fragment key={key}>
                  <span className="inline-block w-0.5 h-5 -mb-1 mr-px bg-dark-accent dark:bg-light-accent animate-caret-blink" />
                  <span className="typing-char text-dark-muted dark:text-light-muted">{char}</span>
                </React.Fragment>
              );
            } else {
              className += ' text-dark-muted dark:text-light-muted';
            }
          } else {
            className += ' text-dark-muted dark:text-light-muted';
          }

          return (
            <span key={key} className={className}>
              {char}
            </span>
          );
        })}

        {extraChars.split('').map((char, idx) => (
          <span key={`extra-${wordIndex}-${idx}`} className="text-dark-error dark:text-light-error">
            {char}
          </span>
        ))}
        
        {isCurrentWord && state.currentCharIndex >= word.length && (
          <span className="inline-block w-0.5 h-5 -mb-1 bg-dark-accent dark:bg-light-accent animate-caret-blink" />
        )}
      </span>
    );
  });
}