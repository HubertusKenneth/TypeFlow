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
  // Pastikan kita menarik pauseTest dan resumeTest dari hook
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
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/5 via-transparent to-teal-500/5 dark:from-light-accent/5 dark:to-teal-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <Header onLogoClick={handleRestart} />

      <main className="min-h-screen pt-20 pb-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {!state.isComplete ? (
            <>
              <SettingsPanel config={config} onConfigChange={handleConfigChange} isTyping={state.isTyping} />
              <TypingArea
                state={state}
                onInput={handleInput}
                onRestart={handleRestart}
                pauseTest={pauseTest}     // Oper fungsi ke sini
                resumeTest={resumeTest}   // Oper fungsi ke sini
              />
              <LiveStats state={state} config={config} />
            </>
          ) : (
            <div className="animate-fade-in mt-8">
              <Results state={state} config={config} onRestart={handleRestart} />
            </div>
          )}

          {/* Keyboard hints */}
          <div className="mt-12 text-center animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-dark-muted dark:text-light-muted mb-6">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-dark-surface/30 dark:bg-light-surface/30 rounded border border-dark-muted/10 dark:border-light-muted/10 text-xs">Space</kbd>
                <span>next word</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-dark-surface/30 dark:bg-light-surface/30 rounded border border-dark-muted/10 dark:border-light-muted/10 text-xs">Backspace</kbd>
                <span>delete</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-dark-surface/30 dark:bg-light-surface/30 rounded border border-dark-muted/10 dark:border-light-muted/10 text-xs">Tab</kbd>
                <span>restart</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 mt-12 border-t border-dark-muted/10 dark:border-light-muted/10">
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