import React from 'react';
import { Keyboard, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onLogoClick: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 animate-fade-in"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative">
              <Keyboard className="w-8 h-8 text-dark-accent dark:text-light-accent transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-dark-accent/20 dark:bg-light-accent/20 blur-lg rounded-full" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-dark-text dark:text-light-text">Type</span>
              <span className="text-gradient">Flow</span>
            </span>
          </button>

          <nav className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              className="relative p-3 rounded-xl bg-dark-surface/50 dark:bg-light-surface/50 border border-dark-muted/20 dark:border-light-muted/20 hover:border-dark-accent/50 dark:hover:border-light-accent/50 transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-dark-text dark:text-light-text group-hover:rotate-180 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-dark-text dark:text-light-text group-hover:-rotate-12 transition-transform duration-300" />
              )}
              <div className="absolute inset-0 bg-dark-accent/10 dark:bg-light-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
