import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { TypingArea } from './components/TypingArea';
import { LiveStats } from './components/LiveStats';
import { Results } from './components/Results';
import { useTypingTest } from './hooks/useTypingTest';
import { TestConfig } from './utils/helpers';

const defaultConfig: TestConfig = {
  mode: 'time',
  time: 30,
  wordCount: 50,
  includePunctuation: false,
  includeNumbers: false,
  difficulty: 'medium',
};

function App() {
  const [config, setConfig] = useState<TestConfig>(defaultConfig);
  const { state, handleInput, resetTest, pauseTest, resumeTest } = useTypingTest(config);

  const handleConfigChange = useCallback(
    (newConfig: TestConfig) => {
      setConfig(newConfig);
      setTimeout(() => resetTest(), 0);
    },
    [resetTest]
  );

  const handleRestart = useCallback(() => {
    resetTest();
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }, [resetTest]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-dark-bg dark:bg-light-bg text-dark-text dark:text-light-text transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/5 via-transparent to-teal-500/5 dark:from-light-accent/5 dark:to-teal-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <Header onLogoClick={handleRestart} />

      <main className="min-h-screen pt-[4.5rem] pb-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {!state.isComplete ? (
            <>
              <SettingsPanel config={config} onConfigChange={handleConfigChange} isTyping={state.isTyping} />
              <TypingArea
                state={state}
                onInput={handleInput}
                onRestart={handleRestart}
                pauseTest={pauseTest}
                resumeTest={resumeTest}
              />
              
              <div className="flex justify-center mt-4 mb-2">
                <button
                  onClick={handleRestart}
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-2 text-dark-muted hover:text-dark-text dark:text-light-muted dark:hover:text-light-text transition-all duration-200 rounded-full hover:bg-dark-surface/50 dark:hover:bg-light-surface/50 active:scale-95"
                  title="Restart Test"
                  aria-label="Restart Test"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
              </div>

              <LiveStats state={state} config={config} />
            </>
          ) : (
            <div className="animate-fade-in mt-8">
              <Results state={state} config={config} onRestart={handleRestart} />
            </div>
          )}

          <div className="mt-4 text-center animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-dark-muted dark:text-light-muted mb-4">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-dark-surface/30 dark:bg-light-surface/30 rounded border border-dark-muted/10 dark:border-light-muted/10 text-[10px] sm:text-xs">Space</kbd>
                <span>next word</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-dark-surface/30 dark:bg-light-surface/30 rounded border border-dark-muted/10 dark:border-light-muted/10 text-[10px] sm:text-xs">Backspace</kbd>
                <span>delete</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-dark-surface/30 dark:bg-light-surface/30 rounded border border-dark-muted/10 dark:border-light-muted/10 text-[10px] sm:text-xs">Tab</kbd>
                <span>restart</span>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-dark-muted/10 dark:border-light-muted/10">
              <p className="text-dark-muted dark:text-light-muted text-xs">
                Click the typing area or press any key to start typing
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;